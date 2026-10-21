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
 const inject=`window.test={start,beginDive,registerFireTap,updatePowerBombs,update,updateChase,render,pause,burst,damage,resize,assembleBoss,updateStormBosses,updateHunterSegment,updatePackHunters,hunterImpact,hunterRadius,hitHunterShot,smashHunterBots,hunterWeapon,spawnWave,movingHit,keys,pointer,get:()=>({run,hero,powerBombs,hunter,packHunters,chaseObstacles,enemies,bullets,fadingBullets,shots,rings,particles,boss,stormBosses,camera,state,paused}),obstacle:o=>chaseObstacles.push(o)};`;
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
 const makeBot=(x,y)=>({x,y,px:x,py:y,base:x,vx:0,vy:-90,hp:50,type:'heavy',r:27,age:0,phase:0,fire:99,dead:false});
 for(const width of [390,1440,1920]){
  const {t,s}=await fresh(width),g=t.get();g.run.musicTime=28;g.run.time=21.5;
  t.updateHunterSegment();t.updatePackHunters(1/120,0);t.spawnWave(12);
  assert.equal(t.get().packHunters.length,3);assert(g.enemies.length>=2&&g.enemies.length<=6);
  assert(g.enemies.every(e=>e.hp===1&&e.type!=='prism'));
  if(g.enemies[0].sync)assert(g.enemies.every(e=>e.phase===g.enemies[0].phase&&e.vy===g.enemies[0].vy),'synchronized squads retain shared motion');
  const a=t.get().packHunters[0];a.x=width/2;a.y=300;a.px=a.x;a.py=a.y;
  for(let i=0;i<9;i++){
   const bot=makeBot(a.x,a.y);g.enemies.push(bot);t.smashHunterBots(a);
   assert(bot.dead,'contact kills even a 50 HP armored bot');assert(!a.crashed,'hunter survives first nine small-bot blasts');
  }
  const last=makeBot(a.x,a.y);g.enemies.push(last);t.smashHunterBots(a);
  assert(last.dead&&a.crashed&&!a.active&&a.alpha===0,'tenth impact destroys hunter');
  const score=g.run.score;t.smashHunterBots(a);assert.equal(g.run.score,score,'no duplicate impact rewards');
  const [b,c]=t.get().packHunters.slice(1);b.stun=2;c.stun=2;
  assert(t.hunterImpact([b,c],100,100),'even stunned hunters explode on pair contact');
  assert(b.crashed&&c.crashed&&b.alpha===0&&c.alpha===0);assert.equal(g.run.hunterPairs,1);
  assert(!t.hunterImpact([b,c],100,100));
  t.render();t.start();assert.equal(t.get().packHunters.length,0);
 }
 const fire=await fresh(),f=fire.t,g=f.get();g.run.musicTime=28;f.updateHunterSegment();f.updatePackHunters(.01,0);
 const h=f.get().packHunters[0];h.x=200;h.y=100;h.fire=.5;
 f.hunterWeapon(h,.1);assert(h.shotWarning);assert.equal(f.get().bullets.length,0);
 f.hunterWeapon(h,.5);assert.equal(f.get().bullets.length,1);assert(f.get().bullets[0].spinner);assert(h.fire>=3.2&&h.fire<=4.6);
 const vel={x:f.get().bullets[0].vx,y:f.get().bullets[0].vy};g.hero.x+=100;f.hunterWeapon(h,1);
 assert.equal(f.get().bullets.length,1);assert.equal(f.get().bullets[0].vx,vel.x);assert.equal(f.get().bullets[0].vy,vel.y);
 f.render();
 const mirror=await fresh(),m=mirror.t,mg=m.get();mg.run.musicTime=28;m.updateHunterSegment();m.updatePackHunters(.01,0);
 // Isolate one hunter to verify its seek/lock motion without pair collisions.
 m.get().packHunters.splice(1);mg.hero.y=700;
 for(let i=0;i<360;i++)m.updatePackHunters(1/120,0);
 const mh=m.get().packHunters[0];assert(mh.locked);const x=mh.x;
 for(let i=0;i<120;i++){mg.hero.x+=1;m.updatePackHunters(1/120,0);}
 assert(mh.x>x+60&&mh.x<x+100,'locked hunter echoes movement after a readable short delay');
 assert.equal(mh.alpha,1,'living hunter never fades');
 for(let i=0;i<360;i++)m.updatePackHunters(1/120,0);
 assert.equal(mh.alpha,1);assert(mh.path.length<90,'mirror history stays bounded');
 mg.run.musicTime=44;m.updateHunterSegment();m.updatePackHunters(.1,0);assert(!mh.active);assert.equal(mh.alpha,1,'withdrawal flies out instead of fading');
 for(let i=0;i<600;i++)m.updatePackHunters(1/120,0);assert.equal(m.get().packHunters.length,0);
 for(const width of [390,1440]){
  const fight=await fresh(width),t=fight.t,g=t.get();g.run.musicTime=100;
  t.updateStormBosses(.01);t.updatePackHunters(.01,0);
  assert.equal(t.get().packHunters.length,3,'twins get three hunters');
  t.get().packHunters.splice(1); // Isolate the boss-ram collision from hunter-pair impacts.
  const b=t.get().stormBosses[0],h=t.get().packHunters[0];
  b.age=4;b.x=width/2;b.y=450;b.px=b.x;b.py=b.y;
  h.x=b.x;h.y=b.y;h.stun=1;
  t.updatePackHunters(.001,0);
  assert.equal(b.hp,72,'baited collision removes 28 boss HP');assert(h.crashed);
  t.updatePackHunters(.001,0);assert.equal(b.hp,72,'collision cannot score twice');
  g.hero.inv=999;t.keys.add('ArrowDown');
  for(let i=0;i<600;i++){g.run.waveIn=999;t.update(1/120);}
  assert(g.hero.y>t.get().stormBosses[1].y+t.get().stormBosses[1].r,'player can slip below both twins');
  assert(g.run.fallBoost>.95,'edge does not cancel dive speed');t.keys.clear();
  t.get().stormBosses.forEach(b=>b.dead=true);t.updateStormBosses(.01);t.updatePackHunters(.01,0);
  assert(t.get().packHunters.every(h=>!h.active),'hunters withdraw for finale');
 }
 for(const width of [390,1440]){
  const inverse=await fresh(width),t=inverse.t,g=t.get();g.run.musicTime=100;g.hero.y=250;g.hero.inv=999;
  t.updateStormBosses(.01);t.updatePackHunters(.01,0);t.get().packHunters.splice(1);
  const h=t.get().packHunters[0];t.hunterImpact([h],h.x,h.y);
  for(let i=0;i<600;i++)t.updatePackHunters(.01,0);
  assert(h.active&&!h.crashed&&h.hp===10,'twin fight replenishes destroyed hunters with stronger armor');
  for(let i=0;i<200;i++)t.updatePackHunters(.01,-1);
  assert.equal(h.mode,'inverse');assert(h.y>g.hero.y+160,'Up draws hunter below player');
  const lowY=h.y;
  for(let i=0;i<400;i++)t.updatePackHunters(.01,-1);
  assert(h.y<lowY,'inverse hunter closes in after its bottom maneuver');
  assert(h.y>0&&h.y<900&&h.x>0&&h.x<width,'hunter stays inside frame');
 }
 for(const width of [390,1440]){
  const refill=await fresh(width),t=refill.t,g=t.get();g.run.musicTime=36;g.hero.inv=999;
  t.updateHunterSegment();t.updatePackHunters(.01,0);t.get().packHunters.splice(1);
  const h=t.get().packHunters[0];t.hunterImpact([h],h.x,h.y);
  for(let i=0;i<240;i++)t.updatePackHunters(.01,0);
  assert(h.active&&!h.crashed&&h.hp===10,'pre-boss hunter replacements close the regular-bot gap');
  t.hunterImpact([h],h.x,h.y);g.run.musicTime=44;t.updateHunterSegment();
  for(let i=0;i<400;i++)t.updatePackHunters(.01,0);
  assert.equal(t.get().packHunters.length,0,'reinforcements stop at first boss cue');
 }
 const variety=await fresh(390),vt=variety.t,vg=vt.get();vg.run.crossfire=true;
 const patterns=new Set(),sizes=new Set(),delays=new Set();let previous=-1;
 for(let i=0;i<40;i++){
  vg.enemies.length=0;vt.spawnWave(12);const bots=vg.enemies,p=bots[0].hunterPattern;
  assert.notEqual(p,previous,'consecutive chase groups differ');previous=p;patterns.add(p);sizes.add(bots.length);delays.add(vg.run.waveIn);
  assert(bots.length<=6&&bots.every(e=>e.x>=24&&e.x<=366&&e.y>900),'bounded safe arrivals');
 }
 assert.equal(patterns.size,5);assert(sizes.size>=3&&delays.size>10,'counts and pacing vary');
 vg.enemies.length=0;vt.spawnWave(1);assert.equal(vg.enemies.length,1,'respects remaining encounter capacity');
 const gun=await fresh(),gt=gun.t,gg=gt.get();gg.run.musicTime=28;gt.updateHunterSegment();gt.updatePackHunters(.01,0);
 const gh=gt.get().packHunters[0];gh.x=300;gh.y=400;gh.px=300;gh.py=400;
 for(let i=0;i<10;i++){
  const shot={x:300,y:500,px:300,py:300,life:1,damage:1,level:1};
  assert(gt.hitHunterShot(shot),'fast player shot hits hunter between frames');
  assert.equal(shot.life,0);assert.equal(gh.hp,9-i);
  const score=gg.run.score;assert(!gt.hitHunterShot(shot),'consumed shot cannot hit twice');assert.equal(gg.run.score,score);
 }
 assert(gh.crashed&&!gh.active,'player shots can destroy hunter armor');
 const orb=await fresh(),ot=orb.t,og=ot.get();
 ot.updatePowerBombs(2,true);assert.equal(ot.get().powerBombs.length,0,'holding fire never drops an orb');
 ot.registerFireTap();og.run.time+=1;ot.registerFireTap();assert.equal(og.run.bombTaps.length,1,'slow taps expire');
 og.run.time+=.15;ot.registerFireTap();og.run.time+=.15;ot.registerFireTap();
 assert.equal(ot.get().powerBombs.length,1,'three quick taps drop one orb');
 ot.registerFireTap();ot.registerFireTap();ot.registerFireTap();assert.equal(ot.get().powerBombs.length,1,'cooldown blocks repeated triples');
 const bomb=ot.get().powerBombs[0],baseRadius=bomb.radius;
 const startY=bomb.y;
 ot.updatePowerBombs(.1,true);assert(bomb.y<startY,'light orb floats upward rather than firing downward');
 const nearBot=makeBot(bomb.x+100,bomb.y-80);nearBot.hp=2;
 const farBot=makeBot(bomb.x+baseRadius+100,bomb.y);farBot.hp=2;
 og.enemies.push(nearBot,farBot);const hp=og.hero.hp;
 for(let i=0;i<65;i++)ot.updatePowerBombs(.01,true);
 assert(nearBot.dead&&!farBot.dead,'orb damages only targets inside its wide blast');
 assert.equal(og.hero.hp,hp,'own orb does not damage player');assert.equal(ot.get().powerBombs.length,0);
 assert.equal(og.run.bombCooldown,0,'orb is ready again without a long recharge');
 og.run.bombCooldown=0;og.run.finale=true;
 ot.registerFireTap();ot.registerFireTap();ot.registerFireTap();
 assert(ot.get().powerBombs[0].radius>baseRadius,'weapon upgrades widen blast');
 ot.updatePowerBombs(.13);ot.registerFireTap();ot.registerFireTap();ot.registerFireTap();
 assert.equal(ot.get().powerBombs.length,2,'rapid triples allow overlapping floating orbs');
 assert.equal(baseRadius,220,'base blast is slightly wider');
 ot.start();assert.equal(ot.get().powerBombs.length,0);assert.equal(ot.get().run.bombTaps.length,0);
 const spawn=await fresh();for(let i=0;i<20;i++){spawn.t.get().enemies.length=0;spawn.t.spawnWave(8);assert(spawn.t.get().enemies.every(e=>e.type!=='prism'));}
 assert(m.movingHit({px:0,py:0,x:100,y:0},{px:100,py:0,x:0,y:0},5),'crossing hulls collide between frames');
 console.log('PASS hunter armor/contact kills, lethal pairs including stun, synchronized squads, no green bot, sparse warned non-homing spinner, seek/lock/mirror, solid opacity, fly-out cleanup, bounded history, restart and portrait/desktop rendering.');
})().catch(error=>{console.error(error);process.exitCode=1;});
