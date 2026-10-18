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
 const inject=`window.test={start,beginDive,update,updateChase,render,pause,burst,damage,resize,assembleBoss,updateStormBosses,keys,pointer,get:()=>({run,hero,hunter,chaseObstacles,enemies,bullets,shots,boss,stormBosses,camera,state,paused}),obstacle:o=>chaseObstacles.push(o)};`;
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
 const first=await fresh();advance(first.t,3.9);assert(!first.t.get().hunter.active,'opening is safe');advance(first.t,.2);assert(first.t.get().hunter.active);assert(first.t.get().hunter.grace>2,'first sight gives reaction time');assert.equal(first.t.get().hero.hp,5);
 const dive=await fresh(),d=activate(dive.t);d.hunter.gap=250;dive.t.keys.add('ArrowDown');advance(dive.t,1.5);assert(d.hunter.gap>250,'Down initially opens the gap');advance(dive.t,20);assert(d.run.hunterCatches>0,'holding Down in one lane cannot solve pursuit');assert.equal(dive.t.get().state,'play');assert(d.hunter.path.length<=65,'path history stays bounded');
 const lag=await fresh(),l=activate(lag.t);chase(lag.t,1);const old=l.hunter.x;l.hero.x+=200;chase(lag.t,.4);assert(Math.abs(l.hunter.x-old)<1,'hunter initially follows old lane');chase(lag.t,2);assert(l.hunter.x>old+50,'then follows delayed path');
 const catchTest=await fresh(),c=activate(catchTest.t);c.hunter.gap=catchTest.s.aviatorDiagnostics().heroSize*.55+28;c.hunter.lock=1;chase(catchTest.t,.5);assert(c.hunter.warning>.45);assert.equal(c.hero.hp,5,'visible catch warning before damage');chase(catchTest.t,.7);assert.equal(c.hero.hp,4);assert.equal(c.run.hunterCatches,1);assert(c.hero.inv>1);assert(c.hunter.stun>2);assert(c.hunter.gap>=370);chase(catchTest.t,1);assert.equal(c.hero.hp,4,'recovery prevents repeat catch');
 const evade=await fresh(),e=activate(evade.t);e.hunter.gap=evade.s.aviatorDiagnostics().heroSize*.55+28;e.hunter.lock=1;chase(evade.t,.65);e.hero.x+=150;chase(evade.t,.3);assert.equal(e.hero.hp,5,'lateral move cancels warned catch');assert.equal(e.hunter.warning,0);
 const bait=await fresh(),b=activate(bait.t);b.run.charge=.2;bait.t.obstacle(obstacle(b,{x:b.hunter.x,y:b.hunter.y+1}));chase(bait.t,.02);assert.equal(b.run.hunterBaits,1);assert.equal(b.run.score,150);assert(Math.abs(b.run.charge-.34)<.0001);assert(b.hunter.stun>2.5);assert.equal(bait.t.get().chaseObstacles.length,0);chase(bait.t,.1);assert.equal(b.run.hunterBaits,1,'wreckage cannot reward twice');
 for(const width of [390,1440,1920]){const natural=await fresh(width),ng=activate(natural.t);ng.hero.y=900-natural.s.aviatorDiagnostics().heroSize*.52-28;ng.run.fallBoost=1;ng.hunter.gap=300;ng.hunter.path=Array.from({length:61},(_,i)=>({x:ng.hero.x,time:ng.run.time-3+i*.05}));natural.t.keys.add('ArrowDown');natural.t.obstacle(obstacle(ng,{x:ng.hero.x,y:970}));const dodgeTo=ng.hero.x+Math.min(120,width*.25);let dodged=false;for(let i=0;i<480;i++){const o=natural.t.get().chaseObstacles[0];if(o&&o.y-ng.hero.y<90)dodged=true;if(dodged&&ng.hero.x<dodgeTo)natural.t.keys.add('ArrowRight');else natural.t.keys.delete('ArrowRight');advance(natural.t,1/120);}assert(dodged);assert.equal(ng.hero.hp,5,'late steering clears moving wreckage at '+width);assert(ng.run.hunterBaits>=1,'actual moving-player dodge baits hunter at '+width);}
 const near=await fresh(),n=activate(near.t);n.run.charge=.3;n.run.fallBoost=1;near.t.obstacle(obstacle(n,{x:n.hero.x+52,y:n.hero.y+1}));chase(near.t,.02,1);assert.equal(n.run.near,1);assert(n.run.charge>=.39);assert.equal(n.hero.hp,5);chase(near.t,.2,1);assert.equal(n.run.near,1,'near miss only awarded once');
 const hit=await fresh(),hitg=activate(hit.t);hitg.run.cleanDive=3;hit.t.obstacle(obstacle(hitg,{x:hitg.hero.x,y:hitg.hero.y+1}));chase(hit.t,.02,1);assert.equal(hitg.hero.hp,4);assert.equal(hitg.run.cleanDive,0);assert(hitg.hunter.stun>1.7);assert.equal(hitg.run.near,0,'a collision is not a clean pass');
 const charge=await fresh(),q=activate(charge.t);q.run.charge=.1;q.run.fallBoost=1;q.run.cleanDive=1;q.hero.x+=250;chase(charge.t,.4,1);assert(q.run.charge>.12,'clean weaving dive charges burst');q.run.charge=.995;q.hero.x+=120;chase(charge.t,.2,1);assert.equal(q.run.charge,1,'charge is capped');charge.t.burst();assert.equal(q.run.charge,0);assert.equal(q.hunter.gap,450);assert.equal(q.hunter.stun,3.4);charge.t.burst();assert.equal(q.run.charge,0,'burst cannot fire again empty');
 q.run.charge=1;charge.t.pause(true);const frozen=JSON.stringify(charge.s.aviatorDiagnostics());charge.t.burst();charge.t.update(1);assert.equal(JSON.stringify(charge.s.aviatorDiagnostics()),frozen,'pause freezes chase, charge, music and burst');const pausedTime=q.run.time;charge.t.pause(false);advance(charge.t,.1);assert(charge.t.get().run.time>pausedTime,'resume advances simulation');charge.t.start();const reset=charge.t.get();assert(!reset.hunter.active);assert.equal(reset.hunter.path.length,0);assert.equal(reset.chaseObstacles.length,0);assert.equal(reset.run.cleanDive,0);assert.equal(reset.run.hunterCatches,0);assert.equal(reset.run.hunterBaits,0);assert.equal(reset.run.charge,1);
 const bossTest=await fresh(),bg=activate(bossTest.t);bossTest.t.obstacle(obstacle(bg));bossTest.t.assembleBoss();chase(bossTest.t,.4);assert(!bg.hunter.active);assert.equal(bossTest.t.get().chaseObstacles.length,0,'boss transition safely dissolves hazards');bossTest.t.get().boss.dead=true;chase(bossTest.t,.01);assert(bg.hunter.active);assert(bg.hunter.grace>2);bg.run.musicTime=93.4;bossTest.t.updateStormBosses(1/120);chase(bossTest.t,.01);assert(!bg.hunter.active,'hunter withdraws for Twins and finale');
 const mobile=await fresh(390),mg=activate(mobile.t);mg.hunter.obstacleIn=0;chase(mobile.t,.01);assert.equal(mobile.t.get().chaseObstacles.length,1);const mo=mobile.t.get().chaseObstacles[0],oy=mo.y;assert(mo.telegraph>.8);chase(mobile.t,.5);assert.equal(mo.y,oy,'wreckage gives advance lane cue');mobile.t.render();const hx=mg.hunter.x;mobile.setWidth(780);mobile.t.resize();assert.equal(mg.hunter.x,hx*2,'resize scales hunter and trail');assert(mobile.t.get().chaseObstacles[0].x>0);mobile.t.render();
 const recover=await fresh(),rg=activate(recover.t);rg.hero.hp=1;rg.hunter.gap=recover.s.aviatorDiagnostics().heroSize*.55+28;rg.hunter.lock=1;chase(recover.t,1.2);assert.equal(rg.run.recoveries,1);assert.equal(rg.hero.hp,5);assert.equal(recover.t.get().state,'play','catch never ends the song');assert(rg.hero.inv>=3);
 console.log('PASS: safe entry; Down escape versus straight-lane drafting; delayed trail; catch cue/evasion/recovery; obstacle bait, collision and one-time near miss; clean-dive charge/cap/burst; pause and replay; boss withdrawal/reentry; portrait warning/render and resize; bounded history.');
 console.log('Coverage limit: simulation and canvas calls are modeled. Real visual, touch and audio testing remains required.');
})().catch(error=>{console.error(error);process.exitCode=1;});
