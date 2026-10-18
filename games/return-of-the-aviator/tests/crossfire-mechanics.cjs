/* Real production simulation in a dependency-free DOM/media model.
   These are deterministic mechanics checks, not rendered browser or audio QA. */
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const code=fs.readFileSync(path.join(__dirname,'../freefall.js'),'utf8');
function harness(width=1440){
 const noop=()=>{},gradient={addColorStop:noop};
 const ctx=new Proxy({getImageData:()=>({data:new Uint8ClampedArray([255,255,255,255])}),createLinearGradient:()=>gradient,createRadialGradient:()=>gradient},{get:(t,k)=>t[k]||noop,set:(t,k,v)=>(t[k]=v,true)});
 let currentWidth=width;
 const elements={},el=id=>elements[id]||(elements[id]={hidden:false,disabled:true,textContent:'',getContext:()=>ctx,addEventListener:noop,setAttribute:noop,focus:noop,getBoundingClientRect:()=>({left:0,top:0,width:currentWidth,height:900})});
 class Img{constructor(){this.width=1;this.height=1;}set src(v){queueMicrotask(()=>this.onload());}}
 class Audio{constructor(){this.paused=true;this.currentTime=0;}addEventListener(){}play(){this.paused=false;return Promise.resolve();}pause(){this.paused=true;}}
 let seed=12345;const math=Object.create(Math);math.random=()=>((seed=(1664525*seed+1013904223)>>>0)/2**32);
 const sandbox={console,Math:math,Promise,Image:Img,Audio,Uint8ClampedArray,innerWidth:width,innerHeight:900,devicePixelRatio:1,matchMedia:()=>({matches:false}),document:{baseURI:'https://example.test/game/',getElementById:el,createElement:()=>el('offscreen'),addEventListener:noop},addEventListener:noop,requestAnimationFrame:noop,performance:{now:()=>0},location:{search:''},URL,URLSearchParams,localStorage:{getItem:()=>null,setItem:noop}};
 sandbox.window=sandbox;sandbox.parent=sandbox;
 const inject=`window.test={start,beginDive,update,updateChase,render,pause,burst,damage,resize,assembleBoss,updateStormBosses,updateHunterSegment,updatePackHunters,hunterImpact,hunterRadius,spawnWave,movingHit,keys,pointer,get:()=>({run,hero,hunter,packHunters,chaseObstacles,enemies,bullets,fadingBullets,shots,rings,particles,boss,stormBosses,camera,state,paused}),obstacle:o=>chaseObstacles.push(o)};`;
 vm.runInNewContext(code.replace('window.aviatorDiagnostics=',inject+'window.aviatorDiagnostics='),sandbox);
 return {s:sandbox,t:sandbox.test,setWidth:w=>{currentWidth=w;}};
}
const next=()=>new Promise(r=>setImmediate(r));
async function fresh(width){const h=harness(width);await next();h.t.start();h.t.beginDive();return h;}
function advance(t,seconds,{obstacles=false}={}){
 for(let i=0;i<Math.round(seconds*120);i++){
  const g=t.get();g.run.waveIn=1000;g.run.supplyIn=1000;g.enemies.length=0;g.bullets.length=0;
  if(!obstacles)g.hunter.obstacleIn=1000;
  t.update(1/120);
 }
}
function activate(t){const g=t.get();g.run.time=4;t.updateChase(1/120,0);g.hunter.grace=0;g.hunter.obstacleIn=1000;g.hero.inv=0;return g;}
function chase(t,seconds,intent=0){for(let i=0;i<Math.round(seconds*120);i++){t.get().run.time+=1/120;t.updateChase(1/120,intent);}}
function obstacle(g,props={}){return {x:g.hero.x+80,y:g.hero.y+100,px:0,py:0,r:22,rot:0,spin:0,fade:1,telegraph:0,grazed:false,dead:false,...props};}
(async()=>{
 const makeBot=(x,y,type='scout')=>({x,y,px:x,py:y,base:x,vx:0,vy:-90,hp:2,type,r:27,age:0,phase:0,fire:99,sway:0,dead:false,tele:0});
 const enter=await fresh(),t=enter.t,g=t.get();g.run.musicTime=27.98;g.run.time=21.48;for(let i=0;i<12;i++)g.enemies.push(makeBot(100+i*50,600));g.bullets.push({x:100,y:100,vx:0,vy:-50});t.update(1/120);assert(!g.run.crossfire);t.update(1/120);t.update(1/120);assert(g.run.crossfire);assert.equal(t.get().packHunters.length,3);assert.equal(t.get().enemies.filter(e=>e.retiring===undefined&&!e.dead).length,2,'scene retains only two active basic bots');assert.equal(t.get().fadingBullets.length,1,'incoming bullet field fades harmlessly');assert.equal(t.get().bullets.length,0);for(let i=0;i<120*8;i++)t.update(1/120);assert(t.get().enemies.filter(e=>e.retiring===undefined&&!e.dead).length<=2,'two-bot cap includes bots past the player');
 // No coordinate injection for hunters, attack lanes or collisions: real movement
 // reverses committed routes. Stationary player lanes retain formation spacing.
 for(const width of [390,1440,1920])for(const policy of ['idle','down','cut']){
  const h=await fresh(width),p=h.t,v=p.get();v.run.musicTime=28;v.run.time=21.5;v.hero.y=900-h.s.aviatorDiagnostics().heroSize*.52-28;v.hero.x=width*.72;if(policy!=='idle')p.keys.add('ArrowDown');let maxPack=0;
  for(let i=0;i<16*120;i++){
   const phase=(v.run.musicTime-28)%5.3;
   if(policy==='cut'){if(phase<.9){p.keys.delete('ArrowLeft');p.keys.add('ArrowRight');}else if(phase<2){p.keys.delete('ArrowRight');p.keys.add('ArrowLeft');}else{p.keys.delete('ArrowLeft');p.keys.delete('ArrowRight');}}
   v.enemies.length=0;v.bullets.length=0;v.run.waveIn=999;v.run.supplyIn=999;p.update(1/120);maxPack=Math.max(maxPack,p.get().packHunters.length);
  }
  assert.equal(maxPack,3);assert(v.run.hunterPairs<=3,'at most one pair per bounded attack wave');
  if(policy==='cut'){assert.equal(v.run.hunterPairs,3,'normal lane cutting causes three pair collisions at '+width);assert.equal(v.hero.hp,5,'successful diving bait retains armor');}
  else assert.equal(v.run.hunterPairs,0,'unchanged lane does not automatically collide hunters');
  p.update(1/120);assert(!v.run.crossfire);assert(p.get().boss,'first boss assembles at unchanged 44-second cue');assert(p.get().packHunters.every(h=>!h.active));for(let i=0;i<60;i++)p.update(1/120);assert.equal(p.get().packHunters.length,0,'all pack state cleaned after exit fade');assert(v.run.musicTime<44.6);p.render();
 }
 const blast=await fresh(),b=activate(blast.t);b.hunter.x=500;b.hunter.y=300;b.hunter.stun=0;b.run.charge=.1;b.enemies.push(makeBot(500,300),makeBot(650,300),makeBot(800,300));b.bullets.push({x:500,y:300,vx:0,vy:50,dead:false});assert(blast.t.hunterImpact([b.hunter],500,300));assert.equal(b.run.kills,2);assert.equal(b.enemies[2].dead,false,'outside-radius bot survives');assert.equal(b.run.hunterCrashes,1);assert.equal(b.run.score,350);assert.equal(blast.t.get().fadingBullets.length,1);assert.equal(b.bullets[0].dead,true);assert(blast.t.get().rings.some(r=>r.r===195&&r.size===0),'visible boundary matches damage radius');const points=b.run.score;assert.equal(blast.t.hunterImpact([b.hunter],500,300),false);assert.equal(b.run.score,points,'same impact cannot score twice');
 const pair=await fresh(),p=pair.t,pg=p.get();pg.run.musicTime=28;p.updateHunterSegment();p.updatePackHunters(1/120,0);const [a,c,d]=p.get().packHunters;assert.equal(p.hunterImpact([a,a],a.x,a.y),false,'duplicate participant rejected');assert(p.hunterImpact([a,c],100,100));assert.equal(pg.run.hunterPairs,1);assert.equal(pg.run.hunterCrashes,2);assert(a.crashed&&c.crashed&&!d.crashed);assert.equal(p.hunterImpact([c,d],100,100),false,'partial repeated pair cannot consume another hunter');assert(!d.crashed);assert.equal(pg.run.hunterPairs,1);const score=pg.run.score;pg.run.charge=1;p.pause(true);const frozen=JSON.stringify(pair.s.aviatorDiagnostics());p.update(1);p.burst();assert.equal(JSON.stringify(pair.s.aviatorDiagnostics()),frozen,'pause freezes segment, ring state, charge and timing');p.pause(false);p.start();assert.equal(p.get().packHunters.length,0);assert.equal(p.get().run.crossfire,false);assert.equal(p.get().run.hunterPairs,0);assert.equal(p.get().run.hunterCrashes,0);assert.equal(p.get().run.charge,1);
 const resize=await fresh(390),rt=resize.t,rg=rt.get();rg.run.musicTime=30;rt.updateHunterSegment();rt.updatePackHunters(1/120,0);const old=rt.get().packHunters.map(h=>({x:h.x,aimX:h.aimX,fromX:h.fromX}));resize.setWidth(780);rt.resize();rt.get().packHunters.forEach((h,i)=>{assert.equal(h.x,old[i].x*2);assert.equal(h.aimX,old[i].aimX*2);assert.equal(h.fromX,old[i].fromX*2);});rt.render();
 const prism=await fresh();prism.t.spawnWave(3);assert(prism.t.get().enemies.some(e=>e.type==='prism'),'new basic design appears in first formation');prism.t.render();
 assert(t.movingHit({px:0,py:0,x:100,y:0},{px:100,py:0,x:0,y:0},5),'relative swept pair detects crossing');assert(!t.movingHit({px:0,py:0,x:100,y:0},{px:100,py:30,x:0,y:30},5));
 console.log('PASS: 28–44s segment; two-basic-bot cap; staggered readable locks; real Down/lane-cut pair bait at 390/1440/1920 versus zero automatic idle/down pairs; bounded AOE/scoring; friendly burst fades; first-boss cleanup; pause/restart/resize; new Prism formation.');
 console.log('Coverage limit: production simulation with modeled DOM/media/canvas, not real browser or human difficulty validation.');
})().catch(error=>{console.error(error);process.exitCode=1;});
