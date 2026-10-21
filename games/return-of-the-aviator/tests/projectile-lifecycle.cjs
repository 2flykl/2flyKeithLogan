/* Dependency-free production-script checks. Canvas commands and camera geometry are
   modeled here; this is not a substitute for browser visual/audio/touch QA. */
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const sourceRoot=process.env.SOURCE_ROOT?path.resolve(process.env.SOURCE_ROOT):path.resolve(__dirname,'../../..');
const code=fs.readFileSync(path.join(sourceRoot,'games/return-of-the-aviator/freefall.js'),'utf8');
function harness(width=1440){
 const noop=()=>{},gradient={addColorStop:noop},arcs=[],stack=[];
 const drawing={globalAlpha:1,getImageData:()=>({data:new Uint8ClampedArray([255,255,255,255])}),createLinearGradient:()=>gradient,createRadialGradient:()=>gradient};
 drawing.save=()=>stack.push(drawing.globalAlpha);drawing.restore=()=>{drawing.globalAlpha=stack.pop()??1;};
 drawing.arc=(x,y,r)=>arcs.push({x,y,r,alpha:drawing.globalAlpha});
 const ctx=new Proxy(drawing,{get:(t,k)=>k in t?t[k]:noop,set:(t,k,v)=>(t[k]=v,true)});
 const dimensions={width,height:900},elements={};
 const el=id=>elements[id]||(elements[id]={hidden:false,disabled:false,textContent:'',getContext:()=>ctx,addEventListener:noop,setAttribute:noop,focus:noop,getBoundingClientRect:()=>({left:0,top:0,...dimensions})});
 class Img{constructor(){this.width=1;this.height=1;}set src(v){queueMicrotask(()=>this.onload());}}
 class Audio{constructor(){this.paused=true;this.currentTime=0;}addEventListener(){}play(){this.paused=false;return Promise.resolve();}pause(){this.paused=true;}}
 const s={console,Math,Promise,Image:Img,Audio,Uint8ClampedArray,innerWidth:width,innerHeight:900,devicePixelRatio:1,matchMedia:()=>({matches:false}),document:{baseURI:'https://example.test/game/',getElementById:el,createElement:()=>el('offscreen'),addEventListener:noop},addEventListener:noop,requestAnimationFrame:noop,performance:{now:()=>0},location:{search:''},URL,URLSearchParams,localStorage:{getItem:()=>null,setItem:noop}};
 s.window=s;s.parent=s;
 const inject='window.test={start,beginDive,update,render,resize,burst,damage,clearBullets,updateColossus,updateStormBosses,assembleBoss,projectileVisible,updateProjectileFades,keys,camera,get:()=>({run,hero,shots,bullets,fadingShots,fadingBullets,enemies,particles,rings,boss,stormBosses,W,H})};';
 assert(code.includes('window.aviatorDiagnostics='),'diagnostic injection marker exists');
 vm.runInNewContext(code.replace('window.aviatorDiagnostics=',inject+'window.aviatorDiagnostics='),s);
 return {t:s.test,arcs,dimensions};
}
async function ready(width){
 const h=harness(width);await new Promise(r=>setImmediate(r));reset(h.t);return h;
}
function reset(t){t.start();t.beginDive();Object.assign(t.get().run,{stormStarted:true,waveIn:1e6,supplyIn:1e6});}
function bullet(x=120,y=500,vx=0,vy=-190){return {x,y,px:x,py:y,vx,vy,r:6,grazed:false};}
function shot(x=140,y=600,vx=0,vy=945,life=1.4,level=1){return {x,y,px:x,py:y,vx,vy,life,level,damage:1};}
function zoom(t,z){Object.assign(t.camera,{zoom:z,target:z,pulse:3,dir:z<1?-1:z>1?1:0,hold:z<1?-1:z>1?1:0});t.keys.clear();if(z!==1)t.keys.add(z<1?'ArrowUp':'ArrowDown');}
function step(t,n=1){for(let i=0;i<n;i++)t.update(1/120);}
function bounds(t){const {W,H}=t.get(),z=t.camera.zoom;return {left:W/2-W/(2*z),right:W/2+W/(2*z),top:H*.4-H*.4/z,bottom:H*.4+H*.6/z};}
function arcAlpha(h,p,r){h.arcs.length=0;h.t.render();const arc=h.arcs.find(a=>a.x===p.x&&a.y===p.y&&a.r===r);assert(arc,'projectile is rendered');return arc.alpha;}
(async()=>{
 for(const width of [1440,390]){
  const h=await ready(width),t=h.t;
  for(const z of [.72,1,1.12]){
   reset(t);zoom(t,z);const {W}=t.get(),v=bounds(t);
   for(const padding of [12,80]){
    const margin=padding/Math.min(1,z);
    for(const [inside,outside] of [
     [{x:v.left-margin+.01,y:500},{x:v.left-margin-.01,y:500}],
     [{x:v.right+margin-.01,y:500},{x:v.right+margin+.01,y:500}],
     [{x:W/2,y:v.top-margin+.01},{x:W/2,y:v.top-margin-.01}],
     [{x:W/2,y:v.bottom+margin-.01},{x:W/2,y:v.bottom+margin+.01}]
    ]){assert(t.projectileVisible(inside,padding),`preserve complete projectile at ${width}/${z}`);assert(!t.projectileVisible(outside,padding),`cull only beyond camera bounds at ${width}/${z}`);}
   }
   t.get().run.shake=25;
   assert(t.projectileVisible({x:W/2,y:v.bottom+12/Math.min(1,z)+24},12),'shake can reveal projectile outside nominal edge');
   assert(!t.projectileVisible({x:W/2,y:v.bottom+12/Math.min(1,z)+26},12),'shake margin remains bounded');
  }
  reset(t);zoom(t,.72);const {W}=t.get(),v=bounds(t);
  const visible=[bullet(v.left+20,450),bullet(v.right-20,450),bullet(W/2,v.top+20),bullet(W/2,v.bottom-20,0,190)];
  t.get().bullets.push(...visible);const laser=shot(W*.7,v.bottom+45,0,945,1.4,3);t.get().shots.push(laser);
  step(t);assert.equal(t.get().bullets.length,4,'zoom-out retains bullets beyond all four original W/H cutoffs');assert(t.get().shots.includes(laser),'visible laser tail survives below zoomed-out bottom');
  for(const b of visible){const v=bounds(t);b.x=v.right+100;b.vx=190;}
  laser.y=bounds(t).bottom+160;step(t);
  assert.equal(t.get().bullets.length,0,'fully offscreen enemy rounds are reclaimed');assert.equal(t.get().shots.length,0,'fully offscreen shots are reclaimed');assert.equal(t.get().fadingShots.length,0,'natural offscreen cleanup needs no fade object');
 }
 const h=await ready(),t=h.t;
 // Player TTL creates a moving, harmless fade, never a visible hard cut.
 const timed=shot(140,500,120,0,.004);t.get().shots.push(timed);step(t);
 assert.equal(t.get().shots.length,0);assert.equal(t.get().fadingShots.length,1);
 const tail=t.get().fadingShots[0],x=tail.x;assert.equal(arcAlpha(h,tail,4),1);
 t.get().enemies.push({x:tail.x+12,base:tail.x+12,y:tail.y,vx:0,vy:0,hp:3,type:'scout',r:27,phase:0,age:0,fire:100,formation:0,sway:0,motionRate:0,dead:false,tele:0});
 step(t,12);assert(tail.x>x,'fading player round stays in motion');assert.equal(t.get().enemies[0].hp,3,'fading player round cannot hit targets');
 assert(arcAlpha(h,tail,4)>.5&&arcAlpha(h,tail,4)<.8,'rendered player fade is partially transparent');
 step(t,30);assert.equal(t.get().fadingShots.length,0,'TTL fade is reclaimed within .3 seconds');
 // Clear semantics keep the gameplay list empty and continue visible motion.
 reset(t);const round=bullet(120,600,100,-190);t.get().bullets.push(round);t.burst();
 assert.equal(t.get().bullets.length,0);assert.equal(t.get().fadingBullets.length,1);const fade=t.get().fadingBullets[0];assert.equal(arcAlpha(h,fade,7),1);
 const oldX=fade.x,oldY=fade.y;step(t,12);assert(fade.x>oldX&&fade.y<oldY,'cleared bullets keep their flight direction');assert(arcAlpha(h,fade,7)>.5&&arcAlpha(h,fade,7)<.8,'cleared bullet visibly fades');
 t.clearBullets();assert.equal(t.get().fadingBullets.length,1,'repeated clears do not duplicate or reset fade');
 const hp=t.get().hero.hp,score=t.get().run.score;t.get().hero.inv=0;t.get().run.burst=0;fade.x=t.get().hero.x;fade.y=t.get().hero.y;fade.vx=fade.vy=0;step(t);
 assert.equal(t.get().hero.hp,hp,'cleared bullets cannot damage');assert.equal(t.get().run.score,score,'cleared bullets cannot graze');step(t,30);assert.equal(t.get().fadingBullets.length,0);
 // Recovery called inside the bullet iterator must also disarm later rounds this tick.
 reset(t);t.get().hero.hp=1;t.get().hero.inv=0;const hero=t.get().hero;
 t.get().bullets.push(bullet(hero.x,hero.y,0,0),bullet(hero.x,hero.y,0,0),bullet(100,500));step(t);
 assert.equal(t.get().run.recoveries,1);assert.equal(t.get().bullets.length,0);assert.equal(t.get().fadingBullets.length,2,'remaining rounds fade once after recovery');
 assert(t.get().particles.length>0&&t.get().rings.length>0,'the actual collision has a visible impact');
 // Every existing boss-clear path shares the harmless transition.
 reset(t);t.assembleBoss();t.get().boss.hp=0;t.get().bullets.push(bullet());t.updateColossus(1/120);assert.equal(t.get().bullets.length,0);assert.equal(t.get().fadingBullets.length,1,'core defeat fades rounds');
 reset(t);t.get().run.stormStarted=false;t.get().run.musicTime=100;t.get().bullets.push(bullet());t.updateStormBosses(1/120);assert.equal(t.get().fadingBullets.length,1,'storm arrival fades rounds');
 t.get().bullets.push(bullet(200));t.get().stormBosses[0].hp=0;t.updateStormBosses(1/120);assert.equal(t.get().fadingBullets.length,2,'first storm defeat fades rounds');
 t.get().bullets.push(bullet(300));t.get().stormBosses[1].hp=0;t.updateStormBosses(1/120);assert(t.get().run.finale);assert.equal(t.get().fadingBullets.length,3,'second storm/finale clear does not duplicate fades');
 t.get().bullets.push(bullet(400));t.get().run.finale=false;t.updateStormBosses(1/120);assert.equal(t.get().fadingBullets.length,4,'finale transition itself fades any remaining rounds');
 // Resizing preserves transient position; restart releases every transient.
 const before=t.get().fadingBullets[0].x;h.dimensions.width=720;t.resize();assert.equal(t.get().fadingBullets[0].x,before/2);
 reset(t);assert.equal(t.get().fadingBullets.length,0);assert.equal(t.get().fadingShots.length,0);
 // Repeated clears cannot accumulate: each frame's round has a fixed fade budget.
 for(let i=0;i<120*8;i++){t.get().bullets.push(bullet(80,600,0,0));t.clearBullets();step(t);assert(t.get().fadingBullets.length<=36,'fade retention stays bounded by .3 seconds of input');}
 step(t,40);assert.equal(t.get().fadingBullets.length,0);
 console.log('PASS: zoom-aware four-edge cleanup at .72/1/1.12 in desktop/portrait, full laser tail and shake bounds, rendered/moving harmless TTL and clear fades, recovery iterator safety, boss transitions, finite retention, resize, restart.');
})().catch(error=>{console.error(error);process.exitCode=1;});
