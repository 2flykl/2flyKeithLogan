(()=>{
'use strict';
const canvas=document.getElementById('game'),ctx=canvas.getContext('2d',{alpha:false});
const W=canvas.width,H=canvas.height,fatal=document.getElementById('fatal');
ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), lerp=(a,b,t)=>a+(b-a)*t, ease=t=>t*t*(3-2*t), rand=(a,b)=>a+Math.random()*(b-a);
window.addEventListener('error',e=>{fatal.style.display='block';fatal.textContent='GAME ERROR: '+e.message});
window.addEventListener('unhandledrejection',e=>{fatal.style.display='block';fatal.textContent='ASYNC ERROR: '+String(e.reason||'unknown')});
const SONG='https://static.wixstatic.com/mp3/85e419_62dfb4b5acfc4747a02ad9eaeb643f29.mp3',A='assets/production/',B='assets/backgrounds/';
const M={
 sky:B+'scene1_sky.jpg',runway:B+'runway_final.jpg',maze:B+'maze_final.jpg',bossBg:B+'boss_final.jpg',clouds:B+'cloud_layer.png',rain:B+'rain.png',speed:B+'speed_lines.png',
 plane:[A+'plane_idle.png',A+'plane_bank.png',A+'plane_burn.png',A+'plane_explode.png'],boss:A+'algorithm_boss.png',explosion:A+'explosion.png',
 aerialDive:[0,1,2,3].map(i=>A+`v5_hero_dive_${i}.png`),aerialResist:[0,1,2,3].map(i=>A+`v5_hero_glide_${i}.png`),aerialSpin:[0,1,2,3].map(i=>A+`v5_hero_fire_${i}.png`),
 runBack:[0,1,2,3].map(i=>A+`v5_hero_run_${i}.png`),runFront:[0,1,2,3].map(i=>A+`v5_hero_walk_${i}.png`),runJump:[0,1,2].map(i=>A+`v5_hero_victory_${i}.png`),
 aimIdle:[0,1,2,3].map(i=>A+`v5_hero_idle_${i}.png`),aimFire:[0,1,2,3].map(i=>A+`v5_hero_fire_${i}.png`),aimJump:[0,1,2,3].map(i=>A+`v5_hero_hit_${i}.png`),
 heroCar:[A+'v5_hero_car.png',A+'v5_hero_car_alt.png',A+'v5_hero_car_boost.png'],enemyCar:A+'enemy_car.png',enemyTruck:A+'enemy_truck.png',
 item:A+'tonearm.png',power:A+'808_boomer.png',platforms:[0,1,2,3,4,5,6].map(i=>A+`platform_${i}.png`),
 bots:['bot_surveillance_orb','bot_tracking_orb','bot_interceptor','bot_censorship_bot','bot_firewall_sentinel','bot_data_miner','bot_corrupted_jammer','bot_heavy_assault','bot_manipulator','bot_shield_projector'].map(x=>A+x+'.png')
};
const imgs={};
function loadImage(src){return new Promise((res,rej)=>{const im=new Image();im.onload=()=>res(im);im.onerror=()=>rej(new Error(src));im.src=src})}
async function loadAll(){
  const pairs=[]; for(const [k,v] of Object.entries(M)){ if(typeof v==='string') pairs.push([k,v]); else v.forEach((s,i)=>pairs.push([`${k}_${i}`,s])); }
  const rr=await Promise.allSettled(pairs.map(async p=>[p[0],await loadImage(p[1])])); let miss=0;
  rr.forEach(r=>{ if(r.status==='fulfilled') imgs[r.value[0]]=r.value[1]; else miss++; }); return miss;
}
const keys={}; let debug=false;
addEventListener('keydown',e=>{keys[e.code]=true; if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','ShiftLeft','ShiftRight'].includes(e.code)) e.preventDefault(); if(e.code==='F2') debug=!debug; tryAudio();});
addEventListener('keyup',e=>keys[e.code]=false); canvas.addEventListener('pointerdown',tryAudio);

function bindTouchControls() {
  document.querySelectorAll('#mobileControls button').forEach(btn => {
    const code = btn.dataset.key;
    if (!code) return;
    const down = e => {
      e.preventDefault();
      btn.classList.add('active');
      keys[code] = true;
      tryAudio();
    };
    const up = e => {
      e.preventDefault();
      btn.classList.remove('active');
      keys[code] = false;
    };
    btn.addEventListener('pointerdown', down);
    btn.addEventListener('pointerup', up);
    btn.addEventListener('pointercancel', up);
    btn.addEventListener('touchstart', down, {passive: false});
    btn.addEventListener('touchend', up, {passive: false});
  });
}
bindTouchControls();
let audio=null,audioStatus='READY',audioPass=0,songDur=128,totalDur=256;
const BASE=[0,16,59,66,117,127,183,191,249,256];
let cues=BASE.slice();
function scaleCues(){ const f=(songDur*2)/256; cues=BASE.map(x=>x*f); totalDur=songDur*2; }
function tryAudio(){ if(!started) return; if(!audio){ audio=new Audio(SONG); audio.preload='auto'; audio.volume=.84; audio.loop=false; audio.playbackRate=1; audio.addEventListener('loadedmetadata',()=>{ if(Number.isFinite(audio.duration)&&audio.duration>30){ songDur=audio.duration; scaleCues(); }}); audio.addEventListener('ended',()=>{ if(audioPass===0){ audioPass=1; audio.currentTime=0; audio.play().then(()=>audioStatus='PLAYING • PASS 2').catch(()=>audioStatus='CLICK TO RETRY'); } else audioStatus='MUSIC COMPLETE'; }); }
  if(audio.paused&&audioPass<2) audio.play().then(()=>audioStatus=`PLAYING • PASS ${audioPass+1}`).catch(()=>audioStatus='CLICK / KEY TO RETRY');
}
let started=false,last=0,clock=0,scene='intro',sceneLocal=0,dtGlobal=0,animId=null;
let score=0,combo=0,hp=5,powerCharge=0,killTally=0;
let hero,plane,vehicle,boss,enemies,shots,enemyShots,routeObjects,platforms,powerUps,cam,escapeTaps,spawnT,fireT,specialT,floorBroken,finalCharge,diveScroll,runScroll,runwayDir,itemSecured,itemFlash,flashT,routeSpeed;
function makeHero(){ return {x:640,y:520,frame:0,ft:0,jump:0,jv:0,spinT:0,carry:false}; }
function makePlane(){ return {x:650,y:270}; }
function makeVehicle(){ return {x:640,y:610,vx:0,vy:0,air:0,av:0}; }
function makeBoss(){ return {x:640,y:165,hp:140,max:140}; }
function reset(){
  if(animId){ cancelAnimationFrame(animId); animId=null; }
  clock=0; scene='intro'; sceneLocal=0; score=0; combo=0; hp=5; powerCharge=0; killTally=0;
  hero=makeHero(); plane=makePlane(); vehicle=makeVehicle(); boss=makeBoss(); enemies=[]; shots=[]; enemyShots=[]; routeObjects=[]; platforms=[]; powerUps=[];
  cam={x:0,y:0,zoom:1,tx:0,ty:0,tz:1}; escapeTaps=0; spawnT=.5; fireT=0; specialT=0; floorBroken=false; finalCharge=0; diveScroll=0; runScroll=0; runwayDir=1; itemSecured=false; itemFlash=0; flashT=0; routeSpeed=1;
  audioPass=0; if(audio){ audio.pause(); try{ audio.currentTime=0; }catch(e){} } audioStatus='STARTING…';
}
function start(){ reset(); started=true; document.getElementById('start-overlay').classList.add('hidden'); tryAudio(); last=performance.now(); if(animId){ cancelAnimationFrame(animId); animId=null; } animId=requestAnimationFrame(loop); }
function im(k,i=0){ return imgs[`${k}_${i}`]||imgs[k]; }
function drawCover(img,x=0,y=0,w=W,h=H,zoom=1,panX=0,panY=0,alpha=1){ if(!img) return; ctx.save(); ctx.globalAlpha=alpha; const rw=w*zoom,rh=h*zoom; ctx.drawImage(img,x-(rw-w)/2+panX,y-(rh-h)/2+panY,rw,rh); ctx.restore(); }
function drawRepeatY(img,off,scale=1.08,alpha=1,panX=0){ if(!img) return; const ratio=Math.max(W/img.width,H/img.height)*scale; const rw=img.width*ratio, rh=img.height*ratio, x=(W-rw)/2+panX; let y=-(off%rh); if(y>0) y-=rh; ctx.save(); ctx.globalAlpha=alpha; for(let i=-1;i<3;i++) ctx.drawImage(img,x,y+i*rh,rw,rh); ctx.restore(); }
function drawSprite(img,x,y,h,alpha=1,rot=0,shadow=true){ if(!img) return {w:0,h}; const w=img.width/img.height*h; ctx.save(); ctx.globalAlpha=alpha; ctx.translate(x,y); ctx.rotate(rot); if(shadow){ ctx.filter='drop-shadow(0 6px 10px rgba(0,0,0,.42))'; } ctx.drawImage(img,-w/2,-h/2,w,h); ctx.restore(); return {w,h}; }
function animName(name,rate=.1){ hero.ft+=dtGlobal; if(hero.ft>rate){ hero.ft=0; hero.frame++; } const len=M[name]?M[name].length:1; return im(name,hero.frame%len); }
function camera(dt){ cam.x=lerp(cam.x,cam.tx,1-Math.pow(.001,dt)); cam.y=lerp(cam.y,cam.ty,1-Math.pow(.001,dt)); cam.zoom=lerp(cam.zoom,cam.tz,1-Math.pow(.002,dt)); }
function inputX(){ return (keys.ArrowRight||keys.KeyD?1:0)-(keys.ArrowLeft||keys.KeyA?1:0); }
function inputY(){ return (keys.ArrowDown||keys.KeyS?1:0)-(keys.ArrowUp||keys.KeyW?1:0); }
function sceneFor(t){ if(t<cues[1]) return 'intro'; if(t<cues[2]) return 'dive'; if(t<cues[3]) return 't1'; if(t<cues[4]) return 'runway'; if(t<cues[5]) return 't2'; if(t<cues[6]) return 'maze'; if(t<cues[7]) return 't3'; if(t<cues[8]) return 'boss'; if(t<cues[9]) return 'finale'; return 'end'; }
function local(a,b){ return clamp((clock-cues[a])/(cues[b]-cues[a]),0,1); }
function setScene(s){ if(scene===s) return; scene=s; sceneLocal=0; enemies=[]; enemyShots=[]; shots=[]; powerUps=[]; spawnT=.3; itemSecured=false; if(s==='runway'){ hero.x=640; hero.jump=0; hero.carry=false; runScroll=0; runwayDir=1; } if(s==='maze'){ seedRoute(); vehicle.x=640; vehicle.y=612; routeSpeed=1; } if(s==='boss'){ boss=makeBoss(); hero.x=640; hero.y=570; seedPlatforms(); floorBroken=false; }}
function seedPlatforms(){ platforms=[{x:230,y:610,w:290,i:0},{x:565,y:555,w:250,i:2},{x:880,y:620,w:300,i:1},{x:430,y:425,w:200,i:4},{x:780,y:390,w:220,i:5}]; }
function spawnEnemy(kind='air'){ if(enemies.length>=8) return; const i=Math.floor(Math.random()*M.bots.length), big=(i===7||Math.random()<.2), scale=big?rand(145,180):rand(95,135); enemies.push({x:rand(100,1180),y:kind==='dive'?H+80:rand(110,310),vx:rand(-48,48),vy:kind==='dive'?-rand(120,220):rand(18,54),i,hp:big?5:2,scale,shooter:Math.random()<.48,cool:rand(1.5,4.4)}); }
function spawnPowerUp(x,y,type='charge'){ powerUps.push({x,y,vy:-25,life:8,type}); }
function updatePowerUps(dt,target){ powerUps.forEach(p=>{ p.life-=dt; p.y+=Math.sin(clock*4+p.x)*12*dt + p.vy*dt; p.vy+=16*dt; if(Math.hypot(p.x-target.x,p.y-target.y)<40){ p.life=0; powerCharge=clamp(powerCharge+.34,0,1); score+=220; }}); powerUps=powerUps.filter(p=>p.life>0); }
function tryBurst(){ if((keys.ShiftLeft||keys.ShiftRight) && !keys._burstLatch && powerCharge>=1){ keys._burstLatch=true; powerCharge=0; flashT=.18; enemies.forEach(e=>e.hp-=3); routeObjects.forEach(o=>{ if(o.type==='enemy'||o.type==='truck'||o.type==='drone') o.hp=(o.hp||2)-3; }); if(scene==='boss') boss.hp-=7; enemyShots=[]; score+=500; } if(!(keys.ShiftLeft||keys.ShiftRight)) keys._burstLatch=false; }
function updateEnemies(dt,kind,target){ spawnT-=dt; if(spawnT<=0){ spawnEnemy(kind); spawnT=kind==='dive'?rand(.75,1.2):rand(1.0,1.55); }
  enemies.forEach(e=>{ e.x+=e.vx*dt; e.y+=e.vy*dt; if(kind==='dive') e.vx+=Math.sin(clock*0.8+e.y*.01)*10*dt; if(e.shooter){ e.cool-=dt; if(e.cool<=0 && enemyShots.length<10){ e.cool=rand(1.6,4.3); const dx=target.x-e.x,dy=target.y-e.y,l=Math.hypot(dx,dy)||1; enemyShots.push({x:e.x,y:e.y,vx:dx/l*170,vy:dy/l*170,life:4,r:4+Math.random()*2}); } } });
  enemies=enemies.filter(e=>e.hp>0&&e.x>-150&&e.x<W+150&&e.y>-180&&e.y<H+180);
  enemyShots.forEach(s=>{ s.x+=s.vx*dt; s.y+=s.vy*dt; s.life-=dt; }); enemyShots=enemyShots.filter(s=>s.life>0);
}
function fire(dir='up'){ if(fireT>0) return; fireT=.18; const src=scene==='maze'?vehicle:hero; if(dir==='down'||scene==='dive') shots.push({x:src.x,y:src.y+35,vx:rand(-15,15),vy:820,life:1.6,r:7}); else shots.push({x:src.x,y:src.y-45,vx:0,vy:-780,life:1.6,r:7}); }
function updateCombat(dt,dir,target){ fireT=Math.max(0,fireT-dt); if(keys.Space) fire(dir); tryBurst(); shots.forEach(s=>{ s.x+=s.vx*dt; s.y+=s.vy*dt; s.life-=dt; });
  for(const s of shots){
    for(const e of enemies) if(s.life>0&&e.hp>0&&Math.hypot(s.x-e.x,s.y-e.y)<(e.scale*.36)){ s.life=0; e.hp-=1; if(e.hp<=0){ score+=180; combo++; killTally++; if(Math.random()<.22) spawnPowerUp(e.x,e.y); } }
    if(scene==='boss'&&s.life>0&&Math.hypot(s.x-boss.x,s.y-boss.y)<140){ s.life=0; boss.hp-=1.05; score+=55; }
  }
  shots=shots.filter(s=>s.life>0&&s.y>-120&&s.y<H+120&&s.x>-80&&s.x<W+80);
  for(const s of enemyShots){ if(s.life>0&&Math.hypot(s.x-target.x,s.y-target.y)<32){ s.life=0; hp=Math.max(1,hp-1); combo=0; } }
}
function drawEnemies(){
  enemies.forEach(e=>{
    if(e.shooter && e.cool <= 1.4 && e.x > 0 && e.x < W){
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 80, 80, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(e.x, e.y);
      const targetObj = scene==='maze'?vehicle:hero;
      ctx.lineTo(targetObj.x, targetObj.y);
      ctx.stroke();
      ctx.restore();
    }
    drawSprite(im('bots',e.i),e.x,e.y,e.scale,1,0,true);
    if(e.shooter){
      ctx.save();
      ctx.strokeStyle='rgba(110,230,255,.38)';
      ctx.lineWidth=2;
      ctx.beginPath();
      ctx.arc(e.x,e.y,e.scale*.22,0,7);
      ctx.stroke();
      ctx.restore();
    }
  });
  ctx.fillStyle='#ff5147'; enemyShots.forEach(s=>{ ctx.beginPath(); ctx.arc(s.x,s.y,s.r||5,0,7); ctx.fill(); });
  ctx.fillStyle='#72e9ff';
  shots.forEach(s=>{
    ctx.beginPath(); ctx.arc(s.x,s.y,s.r||6,0,7); ctx.fill();
    ctx.fillStyle='#000'; ctx.font='900 10px Arial'; ctx.textAlign='center';
    ctx.fillText('♫',s.x,s.y+3); ctx.fillStyle='#72e9ff';
  });
  powerUps.forEach(p=>{ drawSprite(im('power'),p.x,p.y,34,0.95,0,true); });
}
function drawRunwayTrack(reverse,shift=0){
  drawCover(im('runway'),0,0,W,H,1.08,shift*.25,-40);
  const horizon=240;
  ctx.fillStyle='rgba(10,13,20,.82)'; ctx.beginPath(); ctx.moveTo(90,H); ctx.lineTo(530,horizon); ctx.lineTo(750,horizon); ctx.lineTo(1190,H); ctx.closePath(); ctx.fill();
  ctx.strokeStyle='rgba(122,226,255,.35)'; ctx.lineWidth=3; ctx.stroke();
  const speed=reverse?-1:1; runScroll += speed*420*dtGlobal;
  for(let i=0;i<28;i++){
    let z=((i*125 + runScroll)%3300+3300)%3300; if(reverse) z=3300-z;
    const zz=z/3300, pers=1-zz, y=horizon+pers*430, roadHalf=lerp(560,50,zz), alpha=.09+.6*(1-zz);
    ctx.fillStyle=`rgba(255,255,255,${alpha*.18})`; ctx.fillRect(640-roadHalf,y,roadHalf*2,2);
    if(i<20){ const mH=Math.max(6,55*pers), mW=Math.max(2,10*pers); ctx.fillStyle=`rgba(115,231,255,${alpha})`; ctx.fillRect(640-mW/2,y-mH/2,mW,mH); }
    if(i%3===0){ ctx.fillStyle=`rgba(255,92,92,${alpha*.5})`; ctx.fillRect(640-roadHalf-8,y-6,6,12); ctx.fillRect(640+roadHalf+2,y-6,6,12); }
  }
}
function drawRoad(){
  drawCover(im('maze'),0,0,W,H,1.05,cam.x*.25,0);
  const horizon=232; ctx.fillStyle='rgba(5,10,16,.86)'; ctx.beginPath(); ctx.moveTo(100,H); ctx.lineTo(525,horizon); ctx.lineTo(755,horizon); ctx.lineTo(1180,H); ctx.closePath(); ctx.fill(); ctx.strokeStyle='rgba(102,232,255,.34)'; ctx.lineWidth=3; ctx.stroke();
  for(let i=0;i<32;i++){
    let z=((i*108+runScroll)%2600+2600)%2600, zz=z/2600, pers=1-zz, y=horizon+pers*440, half=lerp(550,55,zz), alpha=.18+.58*(1-zz);
    ctx.fillStyle=`rgba(255,255,255,${alpha*.07})`; ctx.fillRect(640-half,y,half*2,2);
    const mw=Math.max(2,10*pers), mh=Math.max(6,48*pers); ctx.fillStyle=`rgba(115,230,255,${alpha})`; ctx.fillRect(640-mw/2,y-mh/2,mw,mh);
  }
}
function roadPoint(z,lane,curve){ const maxZ=1800,zz=clamp(z/maxZ,0,1),pers=1-zz,horizon=235,roadHalf=lerp(540,58,zz),cy=horizon+pers*445,cx=640+curve*(1-zz)*160+Math.sin((clock*0.4+z*.0018))*65*(1-zz); return {x:cx+lane*roadHalf*.56,y:cy,scale:lerp(1,.12,zz),half:roadHalf,zz}; }

function seedRoute(){
  routeObjects=[]; let z=480;
  for(let i=0;i<24;i++){
    const r=Math.random();
    const type=r<.15?'power':r<.28?'ramp':r<.50?'enemy':r<.72?'truck':r<.88?'crazedBot':'drone';
    routeObjects.push({ z, lane:[-1,0,1][Math.floor(Math.random()*3)], curve:rand(-1,1), type, hp:type==='truck'||type==='crazedBot'?4:2, shooter:r>.88 });
    z+=rand(150,240);
  }
}

function updateRoute(dt){
  runScroll += 620*dt*routeSpeed;
  routeObjects.forEach(o=>{
    o.z -= 620*dt*routeSpeed;
    // Crazed bot lane adjustment to chase player
    if(o.type==='crazedBot' && o.z > 300){
      const targetLane = clamp((vehicle.x - 640)/300, -1, 1);
      o.lane = lerp(o.lane, targetLane, dt*0.8);
    }
    const pt=roadPoint(o.z,o.lane,o.curve);
    o.sx=pt.x; o.sy=pt.y; o.ss=pt.scale;
    if(o.shooter && Math.random()<dt*.55 && enemyShots.length<8){
      enemyShots.push({x:pt.x,y:pt.y,vx:(vehicle.x-pt.x)*0.9,vy:190,life:3,r:5});
    }
  });
  // Enemies zoom from horizon to foreground and exit screen
  routeObjects=routeObjects.filter(o=>o.z>-150&&o.hp>0);
  while(routeObjects.length<24){
    const last=Math.max(...routeObjects.map(o=>o.z),420);
    const r=Math.random();
    const type=r<.15?'power':r<.28?'ramp':r<.50?'enemy':r<.72?'truck':r<.88?'crazedBot':'drone';
    routeObjects.push({ z:last+rand(150,240), lane:[-1,0,1][Math.floor(Math.random()*3)], curve:rand(-1,1), type, hp:type==='truck'||type==='crazedBot'?4:2, shooter:r>.88 });
  }
}

function collideRouteShots(){
  for(const s of shots){
    for(const o of routeObjects){
      if(s.life>0 && o.sx && Math.hypot(s.x-o.sx,s.y-o.sy)<Math.max(22,o.type==='truck'?42:30)*(o.ss||1)*2.1){
        s.life=0; o.hp=(o.hp||1)-1;
        if(o.hp<=0){
          score+=o.type==='power'?0:o.type==='truck'?280:180; combo++; killTally++;
          if(o.type==='power'||Math.random()<.18) spawnPowerUp(o.sx,o.sy);
        }
      }
    }
  }
}

function intro(dt){
  cam.tx=0; cam.ty=0; cam.tz=1+Math.sin(clock*.5)*.01; camera(dt);
  drawCover(im('sky'),0,0,W,H,cam.zoom);
  
  // Dynamic cloud drift
  drawRepeatY(im('clouds'),clock*80,1.2,.35,0);

  const p=local(0,1);
  plane.x=640+Math.sin(clock*1.4)*35; plane.y=240+Math.sin(clock*1.9)*12;

  // Trailing bot pursuit swarm
  const swarm = [
    {x: plane.x - 220, y: plane.y - 45, type: 2},
    {x: plane.x + 230, y: plane.y - 25, type: 1},
    {x: plane.x - 180, y: plane.y + 65, type: 0},
    {x: plane.x + 190, y: plane.y + 75, type: 3}
  ];
  swarm.forEach(b=>{
    drawSprite(im('bots',b.type), b.x+Math.sin(clock*3+b.x)*15, b.y+Math.cos(clock*2+b.y)*10, 110, 0.9, 0, true);
    ctx.strokeStyle='rgba(255, 60, 60, 0.75)'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(b.x,b.y); ctx.lineTo(plane.x+rand(-30,30), plane.y+rand(-20,20)); ctx.stroke();
  });

  // Jet Plane with burning thruster smoke
  const burning = escapeTaps >= 3 || p > .6;
  const pi = burning ? 2 : 0;
  drawSprite(im('plane', pi), plane.x, plane.y, 210, 1, 0, true);

  // Thruster flame particles
  ctx.fillStyle = burning ? '#ff4411' : '#73e8ff';
  for(let i=0; i<5; i++){
    ctx.beginPath();
    ctx.arc(plane.x - 90 - i*14, plane.y + rand(-6,6), 12-i*2, 0, Math.PI*2);
    ctx.fill();
  }

  // Leap command input
  if((keys.ArrowUp||keys.KeyW)&&!keys._tap){ escapeTaps++; keys._tap=true; } else if(!(keys.ArrowUp||keys.KeyW)) keys._tap=false;
  
  // Heroic Ejection cutscene phase
  if(escapeTaps >= 5 || p > .85){
    const leapProgress = clamp((p - .85)/.15, 0, 1);
    // Hero leaping out of plane in ATHLETIC WHITE JACKET
    drawSprite(im('aerialResist', 0), plane.x + leapProgress*120, plane.y + leapProgress*180, 160, 1, leapProgress*0.8, true);
    drawSprite(im('explosion'), plane.x, plane.y, 280 * (1+leapProgress), 0.9);
    ctx.fillStyle = `rgba(255, 200, 120, ${leapProgress*.6})`;
    ctx.fillRect(0,0,W,H);
  }

  // Leap HUD prompt (functional input prompt only)
  ctx.fillStyle='rgba(10,14,22,.82)'; ctx.strokeStyle='#ff9f43'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.roundRect(390,625,500,48,8); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#fff'; ctx.font='900 17px Arial'; ctx.textAlign='center';
  ctx.fillText(`TAP ↑ / W (OR TOUCH LEAP) — EJECT FROM BURNING JET ${Math.min(100,escapeTaps*20)}%`,640,655);
}

let cloudPool = [];

function seedCloudPool(){
  cloudPool = [];
  for(let i=0; i<14; i++){
    cloudPool.push({
      x: rand(-40, W-120),
      y: rand(-220, H+220),
      speed: rand(220, 480),
      scale: rand(0.75, 1.45),
      alpha: rand(0.30, 0.60),
      layer: 'mid',
      rot: rand(-0.05, 0.05)
    });
  }
  for(let i=0; i<8; i++){
    cloudPool.push({
      x: rand(-80, W+80),
      y: rand(-320, H+320),
      speed: rand(540, 920),
      scale: rand(1.35, 2.25),
      alpha: rand(0.20, 0.42),
      layer: 'fore',
      rot: rand(-0.08, 0.08)
    });
  }
}

function updateAndDrawCloudPool(dt, diveMult=1.0, panX=0){
  const imgCloud = im('clouds');
  if(!imgCloud) return;
  if(cloudPool.length === 0) seedCloudPool();

  cloudPool.forEach(c => {
    c.y += c.speed * dt * diveMult;
    // Procedural non-repeating cloud recycling when exiting viewport bottom
    if(c.y > H + 260){
      c.y = -220 - rand(0, 160);
      c.x = rand(-60, W-100);
      c.scale = c.layer === 'fore' ? rand(1.35, 2.25) : rand(0.75, 1.45);
      c.speed = c.layer === 'fore' ? rand(540, 920) : rand(220, 480);
      c.alpha = c.layer === 'fore' ? rand(0.20, 0.42) : rand(0.30, 0.60);
      c.rot = rand(-0.06, 0.06);
    }

    ctx.save();
    ctx.globalAlpha = c.alpha;
    const w = imgCloud.width * c.scale;
    const h = imgCloud.height * c.scale;
    const renderX = c.x + (c.layer === 'fore' ? panX * 0.75 : panX * 0.35);

    ctx.translate(renderX + w/2, c.y + h/2);
    ctx.rotate(c.rot);
    ctx.drawImage(imgCloud, -w/2, -h/2, w, h);

    // Soft radial alpha feathering to eliminate tile borders
    const radGrad = ctx.createRadialGradient(0, 0, Math.min(w,h)*0.25, 0, 0, Math.max(w,h)*0.55);
    radGrad.addColorStop(0, 'rgba(0,0,0,0)');
    radGrad.addColorStop(0.85, 'rgba(12,28,45,0.06)');
    radGrad.addColorStop(1, 'rgba(12,28,45,0.0)');
    ctx.fillStyle = radGrad;
    ctx.fillRect(-w/2, -h/2, w, h);

    ctx.restore();
  });
}

function drawFreefallBaseSky(panX=0){
  const grad = ctx.createLinearGradient(0,0,0,H);
  grad.addColorStop(0, '#050f1e');     // Zenith stormy indigo
  grad.addColorStop(0.35, '#0e2338');  // Mid-atmosphere navy
  grad.addColorStop(0.70, '#1c425e');  // Open sky cyan haze
  grad.addColorStop(1.0, '#326080');   // Lower cloud horizon
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,W,H);

  // Atmospheric light shafts & cloud haze variation
  const lightGrad = ctx.createRadialGradient(W*0.65 + panX*0.2, H*0.25, 20, W*0.65 + panX*0.2, H*0.25, 450);
  lightGrad.addColorStop(0, 'rgba(255, 220, 150, 0.14)');
  lightGrad.addColorStop(0.5, 'rgba(100, 200, 255, 0.06)');
  lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = lightGrad;
  ctx.fillRect(0,0,W,H);
}

function drawSeamlessParallax(img,off,scale=1.1,alpha=1,panX=0){
  if(!img) return;
  const ratio=Math.max(W/img.width,H/img.height)*scale;
  const rw=img.width*ratio, rh=img.height*ratio, x=(W-rw)/2+panX;
  let y=-(off%rh);
  if(y>0) y-=rh;
  ctx.save();
  ctx.globalAlpha=alpha;
  for(let i=-1;i<3;i++){
    const curY=y+i*rh;
    ctx.drawImage(img,x,curY,rw,rh);
    // Soft seam-blending overlay at junction lines to eliminate tile cuts
    const seamGrad=ctx.createLinearGradient(0,curY-28,0,curY+28);
    seamGrad.addColorStop(0,'rgba(14,35,56,0.0)');
    seamGrad.addColorStop(0.5,'rgba(28,66,94,0.16)');
    seamGrad.addColorStop(1,'rgba(14,35,56,0.0)');
    ctx.fillStyle=seamGrad;
    ctx.fillRect(0,curY-28,W,56);
  }
  ctx.restore();
}

let freefallState = 'DEFAULT_INVERTED_DIVE';

function updateFreefallState(ix, iy, power, resist, firing){
  if(resist){
    freefallState = firing ? 'RESISTANCE_FIRE' : 'RESISTANCE';
  } else if(power){
    freefallState = firing ? 'INVERTED_FIRE' : 'POWER_DIVE';
  } else if(ix < -0.2){
    freefallState = 'BANK_LEFT';
  } else if(ix > 0.2){
    freefallState = 'BANK_RIGHT';
  } else if(hero.spinT > 0){
    freefallState = 'AERIAL_REVOLUTION';
  } else if(firing){
    freefallState = 'INVERTED_FIRE';
  } else {
    freefallState = 'DEFAULT_INVERTED_DIVE';
  }
}

function renderFreefallHero(x, y, state){
  let sprName = 'aerialDive';
  let h = 205;
  let rot = 0;

  switch(state){
    case 'DEFAULT_INVERTED_DIVE':
      sprName = 'aerialDive';
      h = 205;
      break;
    case 'POWER_DIVE':
      sprName = 'aerialDive';
      h = 195; // Aerodynamic streamlined fall
      break;
    case 'RESISTANCE':
    case 'RESISTANCE_FIRE':
      sprName = 'aerialResist'; // Upright air-brake drag pose
      h = 215;
      break;
    case 'INVERTED_FIRE':
      sprName = 'aerialSpin';
      h = 205;
      break;
    case 'BANK_LEFT':
      sprName = 'aerialDive';
      rot = -0.16; // Natural full body banking alignment
      h = 205;
      break;
    case 'BANK_RIGHT':
      sprName = 'aerialDive';
      rot = 0.16; // Natural full body banking alignment
      h = 205;
      break;
    case 'AERIAL_REVOLUTION':
      sprName = 'aerialSpin';
      rot = (clock * 6.5) % (Math.PI * 2); // 360 degree controlled corkscrew spin
      h = 205;
      break;
    default:
      sprName = 'aerialDive';
      h = 205;
      break;
  }

  const spr = animName(sprName, 0.08);
  drawSprite(spr, x, y, h, 1, rot, true);
}

function dive(dt){
  const ix=inputX(), iy=inputY(); const power=keys.ArrowDown||keys.KeyS, resist=keys.ArrowUp||keys.KeyW, firing=keys.Space;
  const base=power?680:resist?210:400; diveScroll += base*dt;
  
  // DYNAMIC CAMERA BEHAVIOR: Power Dive zooms out to 0.92, Resistance pushes in to 1.18, Left/Right leads camera
  cam.tx=ix*48; cam.ty=iy*18 + (power?32:resist?-36:0);
  cam.tz=power?0.92:resist?1.18:1.05;
  camera(dt);

  // 1. Open-Sky Atmospheric Base Gradient & Radial Light Shafts
  drawFreefallBaseSky(cam.x*.15);

  // 2. Seamless Deep Storm Cloud Layer
  drawSeamlessParallax(im('sky'),diveScroll*.28,1.25,.65,cam.x*.22);
  
  // 3. Procedural Non-Repeating Cloud Pool (Mid & Foreground Layers)
  updateAndDrawCloudPool(dt, power?1.6:resist?0.5:1.0, cam.x);

  // 4. Velocity Rain & Speed Haze Streaks
  if(im('rain')) drawSeamlessParallax(im('rain'),diveScroll*2.2,1.2,.30,cam.x*.80);
  if(im('speed')) drawSeamlessParallax(im('speed'),diveScroll*2.8,1.0,power?.42:.14,cam.x*.90);

  hero.x=clamp(hero.x+ix*390*dt,110,1170); hero.y=clamp(hero.y+iy*280*dt,120,610);
  if(Math.abs(ix)>0 && Math.random()<dt*.9) hero.spinT=.28; hero.spinT=Math.max(0,hero.spinT-dt);

  // Update Freefall 12-State Machine
  updateFreefallState(ix, iy, power, resist, firing);

  // Render 2Fly in the active freefall state (with white jacket and Tonearm handgun persistence)
  renderFreefallHero(hero.x, hero.y, freefallState);

  updateEnemies(dt,'dive',hero); updatePowerUps(dt,hero);
  updateCombat(dt,'down',hero); drawEnemies();
}

function transition1(dt){
  const p=local(2,3); drawRunwayTrack(false,0); const y=lerp(160,548,ease(p));
  drawSprite(animName('aerialResist',.1),640,y,lerp(150,205,p));
  ctx.strokeStyle=`rgba(100,230,255,${1-p*.4})`; ctx.lineWidth=8;
  ctx.beginPath(); ctx.ellipse(640,610,80+p*380,22+p*60,0,0,7); ctx.stroke();
  // State debug text completely removed!
}

function runway(dt){
  const p=local(3,4), half=p<.48, ix=inputX(); runwayDir=half?1:-1;
  cam.tx=ix*46; cam.ty=0; cam.tz=half?lerp(1.02,.92,p/.48):lerp(.92,1.08,(p-.48)/.52); camera(dt);
  drawRunwayTrack(!half,cam.x);

  hero.x=clamp(hero.x+ix*340*dt,190,1090);
  if((keys.ArrowUp||keys.KeyW)&&hero.jump===0){ hero.jv=-580; hero.jump=-1; }
  if(hero.jump!==0){ hero.jv+=1480*dt; hero.jump+=hero.jv*dt; if(hero.jump>=0){ hero.jump=0; hero.jv=0; } }

  let y,h,spr;
  if(half){
    const q=p/.48; h=lerp(220,110,ease(q)); y=lerp(580,335,ease(q))+hero.jump;
    spr=hero.jump<0?animName('runJump',.11):animName('runBack',.095);
    if(q>.6){ itemSecured=true; hero.carry=true; itemFlash=Math.sin(clock*14)*.5+.5; }
  } else {
    const q=(p-.48)/.52; h=lerp(118,228,ease(q)); y=lerp(355,578,ease(q))+hero.jump;
    spr=hero.jump<0?animName('runJump',.11):animName('runFront',.095);
    
    // Hitchcock North by Northwest homage: Boss AI bot emerges from background with huge wingspan
    const bossScale = lerp(80, 520, q*q);
    const bossY = lerp(140, 230, q);
    drawSprite(im('boss'), 640 + Math.sin(clock*0.8)*25, bossY, bossScale, 0.98);
  }

  // Render hero (athletic white jacket)
  drawSprite(spr,hero.x,y,h,1,0,true);
  if(hero.carry) drawSprite(im('item'),hero.x+22,y-38,34,.85+.15*itemFlash,0,true);

  updateEnemies(dt,'air',hero); updatePowerUps(dt,hero); updateCombat(dt,'up',hero); drawEnemies();
  // State debug text completely removed!
}

function transition2(dt){
  const p=local(4,5); drawRoad();
  drawSprite(im('heroCar',Math.min(2,Math.floor(p*3))),lerp(1180,640,ease(p)),575,lerp(120,220,p));
  // State debug text completely removed!
}

function maze(dt){
  const ix=inputX(), iy=inputY(); cam.tx=ix*52; cam.ty=iy*8; cam.tz=vehicle.air<0?.93:1.02; camera(dt); drawRoad();

  // UP BUTTON FIX: Allow vehicle.y to move from foreground (645) up into road depth (460) when UP is pressed!
  vehicle.vx=lerp(vehicle.vx,ix*440,.08);
  vehicle.vy=lerp(vehicle.vy,iy*160,.08);
  vehicle.x=clamp(vehicle.x+vehicle.vx*dt,180,1100);
  vehicle.y=clamp(vehicle.y+vehicle.vy*dt,460,645);

  // Perspective scaling for vehicle based on road depth
  const roadDepth = clamp((645 - vehicle.y)/185, 0, 1);
  const carHeight = lerp(205, 130, roadDepth);

  // Road Boundary Rule: penalty for driving off road shoulder
  const isOffRoad = vehicle.x < 270 || vehicle.x > 1010;
  if(isOffRoad){
    routeSpeed = 0.5;
    hp = Math.max(1, hp - dt*0.5);
    // Gold hazard boundary flash without debug text
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.65)'; ctx.lineWidth = 14;
    ctx.strokeRect(0, 0, W, H);
  } else {
    routeSpeed = 1.0;
  }

  if(vehicle.air<0 || vehicle.air>0){ vehicle.av+=1500*dt; vehicle.air+=vehicle.av*dt; if(vehicle.air>=0){ vehicle.air=0; vehicle.av=0; } }

  updateRoute(dt);
  routeObjects.forEach(o=>{
    if(!o.sx) return;
    const sz=o.type==='truck'?190*o.ss:o.type==='crazedBot'?145*o.ss:o.type==='drone'?115*o.ss:o.type==='enemy'?138*o.ss:o.type==='ramp'?150*o.ss:110*o.ss;
    if(o.type==='enemy') drawSprite(im('enemyCar'),o.sx,o.sy,sz,1,0,true);
    else if(o.type==='truck') drawSprite(im('enemyTruck'),o.sx,o.sy,sz,1,0,true);
    else if(o.type==='crazedBot') drawSprite(im('bots',7),o.sx,o.sy,sz,1,0,true);
    else if(o.type==='drone') drawSprite(im('bots',5),o.sx,o.sy-38*o.ss,sz,1,0,true);
    else if(o.type==='ramp'){
      ctx.save(); ctx.globalAlpha=.95; ctx.translate(o.sx,o.sy); ctx.scale(o.ss*1.3,o.ss*1.3);
      ctx.fillStyle='rgba(70,230,255,.35)'; ctx.fillRect(-45,-10,90,20);
      ctx.fillStyle='rgba(255,90,90,.75)'; ctx.fillRect(-45,-10,90,4); ctx.restore();
    } else if(o.type==='power'){ drawSprite(im('power'),o.sx,o.sy,55*o.ss,1,0,true); }

    const hitR = o.type==='truck'?55:o.type==='crazedBot'?42:o.type==='enemy'?40:o.type==='ramp'?35:30;
    if(Math.hypot(o.sx-vehicle.x,o.sy-vehicle.y)<hitR + carHeight*0.22 && o.z<320){
      if(o.type==='ramp' && vehicle.air===0){ vehicle.air=-1; vehicle.av=-760; score+=450; }
      else if(o.type==='power'){ o.hp=0; powerCharge=clamp(powerCharge+.45,0,1); score+=180; }
      else if(o.type==='enemy' || o.type==='truck' || o.type==='crazedBot'){ hp=Math.max(1,hp-1); combo=0; o.hp=0; }
    }
  });

  if(keys.Space) fire('up'); fireT=Math.max(0,fireT-dt); tryBurst();
  shots.forEach(s=>{ s.x+=s.vx*dt; s.y+=s.vy*dt; s.life-=dt; }); collideRouteShots();
  shots=shots.filter(s=>s.life>0&&s.y>-60);

  enemyShots.forEach(s=>{ s.x += s.vx*dt*.012; s.y += s.vy*dt; s.life -= dt; if(Math.hypot(s.x-vehicle.x,s.y-vehicle.y)<carHeight*0.2){ s.life=0; hp=Math.max(1,hp-1);} });
  enemyShots=enemyShots.filter(s=>s.life>0);

  updatePowerUps(dt,vehicle);

  // Render hero vehicle with perspective depth scale (carHeight)
  const carState = vehicle.air<0?2:Math.abs(ix)>.25?(ix<0?1:1):(keys.Space?2:0);
  drawSprite(im('heroCar',carState),vehicle.x,vehicle.y+vehicle.air,carHeight,1,0,true);

  drawEnemies();
  // State debug text completely removed!
}

function transition3(dt){
  const p=local(6,7); drawCover(im('maze'),0,0,W,H,lerp(1,.93,p));
  drawSprite(im('heroCar',2),640,lerp(570,360,ease(p)),lerp(220,155,p));
  ctx.strokeStyle=`rgba(90,225,255,${1-p})`; ctx.lineWidth=6;
  ctx.beginPath(); ctx.arc(640,330,80+p*380,0,7); ctx.stroke();
  // State debug text completely removed!
}

function bossScene(dt){
  const p=local(7,8), lost=1-boss.hp/boss.max;
  floorBroken=floorBroken||lost>.33||p>.36;
  const omin=ease(clamp((p-.05)/.82,0,1));
  cam.tx=inputX()*24; cam.ty=0; cam.tz=lerp(.82,1.1,omin); camera(dt);

  drawCover(im('bossBg'),0,0,W,H,cam.zoom,cam.x*.2,0);

  // Boss Spacing: starts higher (y=135) for early fight readability, moves closer as floor shatters
  boss.x=640+Math.sin(clock*.55)*150;
  boss.y=floorBroken ? 185+Math.sin(clock*.9)*18 : 135+Math.sin(clock*.9)*12;
  drawSprite(im('boss'),boss.x,boss.y,lerp(220,390,omin));

  // Ground Terrain (fixes bland ground line defect)
  if(!floorBroken){
    ctx.fillStyle='#0f1923'; ctx.fillRect(0,570,W,150);
    // Tiled cyber terrain accents
    for(let bx=0; bx<W; bx+=120){
      drawSprite(im('platforms', (bx/120)%M.platforms.length), bx+60, 600, 70);
    }
    ctx.strokeStyle='rgba(78,207,248,.65)'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(0,570); ctx.lineTo(W,570); ctx.stroke();
    hero.y=570+hero.jump;
  } else {
    platforms.forEach((pl,i)=>{
      const fy=Math.sin(clock*1.2+i)*7;
      drawSprite(im('platforms',i%M.platforms.length),pl.x,pl.y+fy,96);
    });
    let nearest=platforms.reduce((a,b)=>Math.abs(b.x-hero.x)<Math.abs(a.x-hero.x)?b:a,platforms[0]);
    hero.y=nearest.y-78+hero.jump;
  }

  if((keys.ArrowUp||keys.KeyW)&&hero.jump===0){ hero.jv=-580; hero.jump=-1; }
  if(hero.jump!==0){ hero.jv+=1450*dt; hero.jump+=hero.jv*dt; if(hero.jump>=0){ hero.jump=0; hero.jv=0; } }

  hero.x=clamp(hero.x+inputX()*338*dt,120,1160);

  updateEnemies(dt,'air',hero); updatePowerUps(dt,hero); updateCombat(dt,'up',hero); drawEnemies();

  // SINGLE hero rendering call (fixes duplicate player sprite glitch!)
  const state=hero.jump<0?'aimJump':keys.Space?'aimFire':'aimIdle';
  drawSprite(im(state,Math.floor(clock*9)%M[state].length),hero.x,hero.y,205,1,0,true);

  if(p>.94&&boss.hp>7) boss.hp-=dt*.7;
}

function finale(dt){
  const p=local(8,9);
  const z=lerp(1.08,.62,ease(p));
  drawCover(im('bossBg'),0,0,W,H,z);

  // Weakened boss retreating right across platforms
  drawSprite(im('boss'),640,245,lerp(380,170,p),1-p*.55);

  // Hero in WHITE JACKET aiming final shot
  drawSprite(im('aimFire',Math.floor(clock*10)%M.aimFire.length),640,585,180);

  // Final finisher charge prompt
  finalCharge=clamp(finalCharge+((keys.Space||keys.ArrowUp||keys.KeyW||keys.ArrowRight||keys.KeyD)?dt*.9:dt*.18),0,1);

  ctx.strokeStyle='#73e9ff'; ctx.lineWidth=8; ctx.beginPath(); ctx.arc(640,380,60+finalCharge*220,0,Math.PI*2); ctx.stroke();
  
  if(p>.72){
    ctx.fillStyle=`rgba(255,255,255,${clamp((p-.72)/.28,0,.85)})`; ctx.fillRect(0,0,W,H);
    // Boss explosion particles
    drawSprite(im('explosion'), 640, 245, 320*(p-.7), 0.95);
  }

  ctx.fillStyle='#fff'; ctx.font='900 20px Arial'; ctx.textAlign='center';
  ctx.fillText('PRESS RIGHT / D TO PURSUE — TAP SPACE FOR FINAL BOOMER SHOT!',640,670);
}
let endingReplayBound=false;
function ending(){
  drawCover(im('bossBg'),0,0,W,H,.62);
  ctx.fillStyle='rgba(0,0,0,.72)';
  ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#fff';
  ctx.textAlign='center';
  ctx.font='900 54px Arial';
  ctx.fillText('THE SIGNAL SURVIVES.',640,280);
  ctx.fillStyle='#78e7ff';
  ctx.font='700 19px Arial';
  ctx.fillText('AN ALGORITHM CAN PREDICT A CHOICE. IT CANNOT OWN ONE.',640,330);
  
  // Replay UI prompt
  ctx.fillStyle='rgba(14,43,71,.88)';
  ctx.strokeStyle='#6fd8ff';
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.roundRect(470,410,340,64,12);
  ctx.fill();
  ctx.stroke();
  
  ctx.fillStyle='#fff';
  ctx.font='900 22px Arial';
  ctx.fillText('RUN IT BACK  ↺',640,448);
  ctx.fillStyle='#8197aa';
  ctx.font='700 12px Arial';
  ctx.fillText('TAP HERE OR PRESS SPACE / ENTER TO REPLAY MISSION',640,495);

  if(!endingReplayBound){
    endingReplayBound=true;
    const replayHandler = (e)=>{
      if(scene!=='end') return;
      if(e.type==='keydown' && !['Space','Enter','KeyR'].includes(e.code)) return;
      e.preventDefault();
      canvas.removeEventListener('pointerdown', replayHandler);
      removeEventListener('keydown', replayHandler);
      endingReplayBound=false;
      start();
    };
    canvas.addEventListener('pointerdown', replayHandler);
    addEventListener('keydown', replayHandler);
  }
}
function hud(){ ctx.fillStyle='rgba(2,7,12,.84)'; ctx.fillRect(24,18,510,110); ctx.fillStyle='#fff'; ctx.font='900 24px Arial'; ctx.textAlign='left'; ctx.fillText('RETURN OF THE AVIATOR',38,48); ctx.fillStyle='#64dcff'; ctx.font='700 14px Arial'; ctx.fillText(clock>cues[2]?'808 BOOMER // BASS PRESSURE':'TONEARM // WHOLE NOTE',38,78); ctx.fillStyle=audioStatus.startsWith('PLAYING')?'#82efc4':'#ffb36b'; ctx.fillText('♫ TOO FAST • '+audioStatus,255,78); ctx.fillStyle='#a6b6c5'; ctx.fillText(`SCORE ${String(Math.floor(score)).padStart(7,'0')}  COMBO x${combo}`,38,105); ctx.fillStyle='rgba(255,255,255,.18)'; ctx.fillRect(370,96,130,10); ctx.fillStyle='#73e8ff'; ctx.fillRect(370,96,130*powerCharge,10); ctx.fillStyle='#fff'; ctx.font='700 10px Arial'; ctx.fillText('POWER',370,92); if(scene==='boss'){ ctx.fillStyle='rgba(0,0,0,.7)'; ctx.fillRect(380,18,520,14); ctx.fillStyle='#ff5148'; ctx.fillRect(380,18,520*clamp(boss.hp/boss.max,0,1),14); }
  if(flashT>0){ flashT-=dtGlobal; ctx.fillStyle=`rgba(120,230,255,${flashT*1.6})`; ctx.fillRect(0,0,W,H); }
  if(debug){ ctx.fillStyle='rgba(0,0,0,.78)'; ctx.fillRect(1010,18,250,132); ctx.fillStyle='#8be7ff'; ctx.font='12px monospace'; ctx.fillText(`SCENE ${scene}`,1024,40); ctx.fillText(`CLOCK ${clock.toFixed(1)} / ${totalDur.toFixed(1)}`,1024,58); ctx.fillText(`BOTS ${enemies.length}`,1024,76); ctx.fillText(`SHOTS ${shots.length}/${enemyShots.length}`,1024,94); ctx.fillText(`POWER ${powerCharge.toFixed(2)}`,1024,112); ctx.fillText(`CAM ${cam.zoom.toFixed(2)}`,1024,130);} }
function loop(now){ if(!started) return; const dt=Math.min(.033,(now-last)/1000||0); dtGlobal=dt; last=now; clock+=dt; sceneLocal+=dt; setScene(sceneFor(clock)); ctx.clearRect(0,0,W,H);
  if(scene==='intro') intro(dt); else if(scene==='dive') dive(dt); else if(scene==='t1') transition1(dt); else if(scene==='runway') runway(dt); else if(scene==='t2') transition2(dt); else if(scene==='maze') maze(dt); else if(scene==='t3') transition3(dt); else if(scene==='boss') bossScene(dt); else if(scene==='finale') finale(dt); else ending(); hud(); animId=requestAnimationFrame(loop); }
loadAll().then(m=>{ const b=document.getElementById('start'); b.disabled=false; b.textContent=m?`START EXPERIENCE (${m} OPTIONAL ASSETS MISSING)`:'START EXPERIENCE'; if(new URLSearchParams(location.search).get('autostart')==='1') start(); }).catch(e=>{ fatal.style.display='block'; fatal.textContent='LOAD ERROR: '+e.message; });
document.getElementById('start').addEventListener('click',start);
})();
