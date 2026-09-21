(()=>{
'use strict';
const canvas=document.getElementById('game'),ctx=canvas.getContext('2d',{alpha:false});
const W=canvas.width,H=canvas.height,fatal=document.getElementById('fatal');
ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), lerp=(a,b,t)=>a+(b-a)*t, ease=t=>t*t*(3-2*t), rand=(a,b)=>a+Math.random()*(b-a);
window.addEventListener('error',e=>{fatal.style.display='block';fatal.textContent='GAME ERROR: '+e.message});
window.addEventListener('unhandledrejection',e=>{fatal.style.display='block';fatal.textContent='ASYNC ERROR: '+String(e.reason||'unknown')});

const SONG='https://static.wixstatic.com/mp3/85e419_62dfb4b5acfc4747a02ad9eaeb643f29.mp3';
const A='assets/production/', B='assets/backgrounds/', C='assets/character/2fly_master/';

const M={
 sky:B+'scene1_sky.jpg',runway:B+'runway_final.jpg',maze:B+'maze_final.jpg',bossBg:B+'boss_final.jpg',clouds:B+'cloud_layer.png',rain:B+'rain.png',speed:B+'speed_lines.png',
 plane:[A+'plane_idle.png',A+'plane_bank.png',A+'plane_burn.png',A+'plane_explode.png'],boss:A+'algorithm_boss.png',explosion:A+'explosion.png',
 aerialDive:[0,1].map(i=>C+`freefall/default_inverted_dive_${i}.png`),
 aerialResist:[0,1,2].map(i=>C+`freefall/resistance_${i}.png`),
 aerialSpin:[0,1,2,3].map(i=>C+`freefall/aerial_revolution_${i}.png`),
 aerialFire:[0,1].map(i=>C+`freefall/default_inverted_dive_${i}.png`),
 aerialBankLeft:[C+'freefall/bank_left_0.png'],
 aerialBankRight:[C+'freefall/bank_right_0.png'],
 runBack:[0,2,3,1].map(i=>C+`freefall/aerial_revolution_${i}.png`),
 runFront:[0,1,2].map(i=>C+`freefall/resistance_${i}.png`),
 runSide:[C+'transitions/turnaround_0.png',C+'freefall/landing_brace_0.png'],
 runTurn:[C+'transitions/turnaround_0.png'],
 aimIdle:[C+'freefall/landing_brace_0.png'],
 aimUp:[0,1,2].map(i=>C+`freefall/resistance_${i}.png`),
 aimFire:[C+'freefall/resistance_fire_0.png',C+'freefall/inverted_fire_0.png',C+'freefall/inverted_fire_1.png'],
 frontFireUp:[C+'freefall/resistance_fire_0.png',C+'freefall/inverted_fire_0.png',C+'freefall/inverted_fire_1.png'],
 aimJump:[C+'freefall/aerial_revolution_1.png',C+'freefall/aerial_revolution_2.png'],
 crouch:[C+'freefall/landing_brace_0.png'],
 hitReaction:[C+'freefall/hit_reaction_air_0.png'],
 pianoTankDrive:A+'piano_tank_drive.png',
 pianoTankBoost:A+'piano_tank_boost.png',
 pianoTankPower:A+'piano_tank_power.png',
 bossClawLeft:A+'boss_claw_left.png',
 bossClawRight:A+'boss_claw_right.png',
 noteWhole:A+'note_whole.png',
 noteHalf:A+'note_half.png',
 sonicRing:A+'sonic_ring.png',
 heroCar:A+'hero_car.png',heroCarIdle:A+'hero_car_idle.png',heroCarBoost:A+'hero_car_boost.png',heroCarAlt:A+'hero_car_alt.png',
 enemyCar:A+'rev10/enemy_pursuit.png',enemyArmored:A+'rev10/enemy_armored.png',enemyTruck:A+'rev10/enemy_blocker.png',
 roadBarrier:A+'rev10/road_barrier.png',constructionBarrier:A+'rev10/construction_barrier.png',checkpointGate:A+'rev10/checkpoint_gate.png',
 routeRamps:[0,1,2,3].map(i=>A+`route_ramp_${i}.png`),
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

// MASTER ONE-SONG TIMING MAP (% of audio.duration)
let audio=null, audioStatus='READY', songDur=128;
const CUE_PCTS = [0, 0.08, 0.32, 0.36, 0.53, 0.57, 0.76, 0.80, 0.96, 1.00];
let cues = CUE_PCTS.map(p => p * 128);

function scaleCues(){
  if (audio && Number.isFinite(audio.duration) && audio.duration > 30) {
    songDur = audio.duration;
    cues = CUE_PCTS.map(p => p * songDur);
  }
}

function tryAudio(){
  if(!started) return;
  if(!audio){
    audio = new Audio(SONG);
    audio.preload = 'auto';
    audio.volume = .84;
    audio.loop = false; // ONE SONG = ONE PLAYABLE EXPERIENCE!
    audio.addEventListener('loadedmetadata', scaleCues);
    audio.addEventListener('ended', () => { audioStatus = 'MUSIC COMPLETE'; });
  }
  if(audio.paused){
    audio.play().then(() => audioStatus = 'PLAYING').catch(() => audioStatus = 'CLICK TO RETRY');
  }
}

let started=false,last=0,clock=0,scene='intro',sceneLocal=0,dtGlobal=0,animId=null;
let score=0,combo=0,hp=5,powerCharge=0,killTally=0,tankPowerUp=false,speedValue=0;
let hero,plane,vehicle,boss,enemies,shots,enemyShots,explosions,routeObjects,platforms,powerUps,cam,escapeTaps,spawnT,fireT,specialT,floorBroken,finalCharge,diveScroll,runScroll,runwayDir,itemSecured,itemFlash,flashT,routeSpeed;

function makeHero(){ return {x:640,y:520,frame:0,ft:0,jump:0,jv:0,spinT:0,spinDir:1,lastDir:0,lastDirTime:0,prevIx:0,carry:false}; }
function makePlane(){ return {x:650,y:270}; }
function makeVehicle(){ return {x:640,y:610,vx:0,vy:0,air:0,av:0}; }
function makeBoss(){ return {x:640,y:165,hp:140,max:140}; }

function reset(){
  if(animId){ cancelAnimationFrame(animId); animId=null; }
  clock=0; scene='intro'; sceneLocal=0; score=0; combo=0; hp=5; powerCharge=0; killTally=0; tankPowerUp=false; speedValue=0;
  hero=makeHero(); plane=makePlane(); vehicle=makeVehicle(); boss=makeBoss(); enemies=[]; shots=[]; enemyShots=[]; explosions=[]; routeObjects=[]; platforms=[]; powerUps=[];
  cam={x:0,y:0,zoom:1,tx:0,ty:0,tz:1}; escapeTaps=0; spawnT=.5; fireT=0; specialT=0; floorBroken=false; finalCharge=0; diveScroll=0; runScroll=0; runwayDir=1; itemSecured=false; itemFlash=0; flashT=0; routeSpeed=1;
  if(audio){ audio.pause(); try{ audio.currentTime=0; }catch(e){} } audioStatus='STARTING…';
}

function start(){ reset(); started=true; document.getElementById('start-overlay').classList.add('hidden'); tryAudio(); last=performance.now(); if(animId){ cancelAnimationFrame(animId); animId=null; } animId=requestAnimationFrame(loop); }
function im(k,i=0){ return imgs[`${k}_${i}`]||imgs[k]; }
function drawCover(img,x=0,y=0,w=W,h=H,zoom=1,panX=0,panY=0,alpha=1){ if(!img) return; ctx.save(); ctx.globalAlpha=alpha; const rw=w*zoom,rh=h*zoom; ctx.drawImage(img,x-(rw-w)/2+panX,y-(rh-h)/2+panY,rw,rh); ctx.restore(); }
function drawSprite(img,x,y,h,alpha=1,rot=0,shadow=true){ if(!img) return {w:0,h}; const w=img.width/img.height*h; ctx.save(); ctx.globalAlpha=alpha; ctx.translate(x,y); ctx.rotate(rot); if(shadow){ ctx.filter='drop-shadow(0 6px 10px rgba(0,0,0,.42))'; } ctx.drawImage(img,-w/2,-h/2,w,h); ctx.restore(); return {w,h}; }
function animName(name,rate=.1){ hero.ft+=dtGlobal; if(hero.ft>rate){ hero.ft=0; hero.frame++; } const len=M[name]?M[name].length:1; return im(name,hero.frame%len); }
function camera(dt){ cam.x=lerp(cam.x,cam.tx,1-Math.pow(.001,dt)); cam.y=lerp(cam.y,cam.ty,1-Math.pow(.001,dt)); cam.zoom=lerp(cam.zoom,cam.tz,1-Math.pow(.002,dt)); }
function inputX(){ return (keys.ArrowRight||keys.KeyD?1:0)-(keys.ArrowLeft||keys.KeyA?1:0); }
function inputY(){ return (keys.ArrowDown||keys.KeyS?1:0)-(keys.ArrowUp||keys.KeyW?1:0); }

// Continuous collision: tests the entire path travelled during this frame, not only the final point.
function segmentPointDistSq(x1,y1,x2,y2,px,py){
  const dx=x2-x1,dy=y2-y1,l2=dx*dx+dy*dy;
  if(l2<=.0001){ const ax=px-x1,ay=py-y1; return ax*ax+ay*ay; }
  const t=clamp(((px-x1)*dx+(py-y1)*dy)/l2,0,1);
  const qx=x1+t*dx,qy=y1+t*dy,ax=px-qx,ay=py-qy; return ax*ax+ay*ay;
}
function sweptHit(s,px,py,r){ const x1=s.px??s.x,y1=s.py??s.y; return segmentPointDistSq(x1,y1,s.x,s.y,px,py)<=r*r; }

function sceneFor(t){
  if(t<cues[1]) return 'intro';
  if(t<cues[2]) return 'dive';
  if(t<cues[3]) return 't1';
  if(t<cues[4]) return 'maze';
  if(t<cues[5]) return 't2';
  if(t<cues[6]) return 'runway';
  if(t<cues[7]) return 't3';
  if(t<cues[8]) return 'boss';
  if(t<cues[9]) return 'finale';
  return 'end';
}
function local(a,b){ return clamp((clock-cues[a])/(cues[b]-cues[a]),0,1); }

function setScene(s){
  if(scene===s) return;
  scene=s; sceneLocal=0; enemies=[]; enemyShots=[]; shots=[]; explosions=[]; powerUps=[]; spawnT=.3; itemSecured=false;
  if(s==='runway'){ hero.x=640; hero.jump=0; hero.carry=false; runScroll=0; runwayDir=1; }
  if(s==='maze'){ seedRoute(); vehicle.x=640; vehicle.y=612; routeSpeed=1; tankPowerUp=false; }
  if(s==='boss'){ boss=makeBoss(); hero.x=640; hero.y=570; seedPlatforms(); floorBroken=false; }
}

function seedPlatforms(){ platforms=[{x:230,y:610,w:290,i:0},{x:565,y:555,w:250,i:2},{x:880,y:620,w:300,i:1},{x:430,y:425,w:200,i:4},{x:780,y:390,w:220,i:5}]; }

function spawnEnemy(kind='air'){
  if(enemies.length>=10) return;
  const i=Math.floor(Math.random()*M.bots.length);
  const big=(i===7||Math.random()<.18);
  // Scaled slightly smaller as requested
  // One gameplay plane: visual size can vary slightly by bot class, never by fake Z/parallax depth.
  const scale = kind==='dive' ? (big ? 104 : 76) : (big ? 116 : 84);
  
  let x, y, vx, vy;
  if(kind==='dive'){
    // Enter from bottom and side frames!
    const entrySide = Math.random();
    if(entrySide < 0.50){
      // Entry from Bottom frame: streaming upward past 2Fly diving down
      x = rand(140, W - 140);
      y = H + 60;
      vx = rand(-50, 50);
      vy = rand(-260, -150);
    } else if(entrySide < 0.75){
      // Entry from Left side frame
      x = -60;
      y = rand(H * 0.32, H - 80);
      vx = rand(180, 320);
      vy = rand(-180, -60);
    } else {
      // Entry from Right side frame
      x = W + 60;
      y = rand(H * 0.32, H - 80);
      vx = rand(-320, -180);
      vy = rand(-180, -60);
    }
  } else {
    // SCREEN-PLANE COMBAT: enemy bots live on the same 2D gameplay plane as 2Fly and bullets.
    // No perspective/parallax depth scaling is applied to bots.
    x = rand(120,1160);
    y = rand(150,340);
    vx = rand(-42,42);
    vy = rand(8,26);
  }
  
  enemies.push({x, y, vx, vy, i, hp:big?5:2, scale, shooter:Math.random()<.35, cool:rand(1.5,4.4), touchCool:0});
}

function explodeAt(x,y,scale=1){
  explosions.push({x,y,life:.46,max:.46,scale});
}
function updateExplosions(dt){
  explosions.forEach(e=>e.life-=dt);
  explosions=explosions.filter(e=>e.life>0);
}
function drawExplosions(){
  explosions.forEach(e=>{
    const p=1-e.life/e.max;
    drawSprite(im('explosion'),e.x,e.y,lerp(58,150,ease(p))*e.scale,1-p*.75,0,false);
  });
}

function spawnPowerUp(x,y,type='charge'){ powerUps.push({x,y,vy:-25,life:8,type}); }
function updatePowerUps(dt,target){ powerUps.forEach(p=>{ p.life-=dt; p.y+=Math.sin(clock*4+p.x)*12*dt + p.vy*dt; p.vy+=16*dt; if(Math.hypot(p.x-target.x,p.y-target.y)<45){ p.life=0; powerCharge=clamp(powerCharge+.35,0,1); score+=250; }}); powerUps=powerUps.filter(p=>p.life>0); }

function tryBurst(){
  if((keys.ShiftLeft||keys.ShiftRight) && !keys._burstLatch && powerCharge>=0.8){
    keys._burstLatch=true; powerCharge=0; flashT=.25;
    enemies.forEach(e=>{ e.hp-=4; if(e.hp<=0) explodeAt(e.x,e.y,clamp(e.scale/82,.8,1.5)); });
    routeObjects.forEach(o=>{ if(['pursuit','armored','blocker','drone','wall'].includes(o.type)) { o.hp=(o.hp||2)-6; if(o.hp<=0&&o.sx) explodeAt(o.sx,o.sy,1.15); } });
    if(scene==='boss') boss.hp-=10;
    enemyShots=[]; score+=600;
  }
  if(!(keys.ShiftLeft||keys.ShiftRight)) keys._burstLatch=false;
}

function updateEnemies(dt,kind,target){
  spawnT-=dt; if(spawnT<=0){ spawnEnemy(kind); spawnT=kind==='dive'?rand(.5,0.9):rand(1.0,1.5); }
  enemies.forEach(e=>{
    e.px=e.x; e.py=e.y; e.x+=e.vx*dt; e.y+=e.vy*dt; e.touchCool=Math.max(0,(e.touchCool||0)-dt);
    const bodyR=Math.max(28,e.scale*.38), targetR=kind==='dive'?38:42;
    if(e.hp>0 && e.touchCool<=0 && Math.hypot(e.x-target.x,e.y-target.y)<bodyR+targetR){
      e.touchCool=.8; hp=Math.max(1,hp-1); combo=0; explodeAt(e.x,e.y,clamp(e.scale/90,.7,1.25)); e.hp=0;
    }
    if(e.shooter){ e.cool-=dt; if(e.cool<=0 && enemyShots.length<8){ e.cool=rand(1.8,4.5); const dx=target.x-e.x,dy=target.y-e.y,l=Math.hypot(dx,dy)||1; enemyShots.push({x:e.x,y:e.y,px:e.x,py:e.y,vx:dx/l*260,vy:dy/l*260,life:4,r:6}); } }
  });
  enemies=enemies.filter(e=>e.hp>0&&e.x>-220&&e.x<W+220&&e.y>-260&&e.y<H+260);
  enemyShots.forEach(s=>{ s.px=s.x; s.py=s.y; s.x+=s.vx*dt; s.y+=s.vy*dt; s.life-=dt; }); enemyShots=enemyShots.filter(s=>s.life>0);
}

// MUSIC NOTE PROJECTILE SYSTEM
function fire(dir='up'){
  if(fireT>0) return;
  fireT=0.14;
  const src = scene==='maze' ? vehicle : hero;
  const isPower = powerCharge>=0.8 || (scene==='maze' && tankPowerUp);

  if(dir==='down'||scene==='dive'){
    shots.push({x:src.x, y:src.y+35, px:src.x, py:src.y+35, vx:rand(-15,15), vy:860, life:1.5, r:8, power:isPower});
  } else if(scene==='maze'){
    // Car weapon state: twin forward shots leave the hood instead of 2Fly's body center.
    shots.push({x:src.x-26,y:src.y-52,px:src.x-26,py:src.y-52,vx:-18,vy:-1080,life:1.45,r:7,power:isPower});
    shots.push({x:src.x+26,y:src.y-52,px:src.x+26,py:src.y-52,vx:18,vy:-1080,life:1.45,r:7,power:isPower});
  } else {
    shots.push({x:src.x, y:src.y-45, px:src.x, py:src.y-45, vx:rand(-12,12), vy:-840, life:1.5, r:8, power:isPower});
  }
}

function updateCombat(dt,dir,target){
  fireT=Math.max(0,fireT-dt); if(keys.Space) fire(dir); tryBurst();
  shots.forEach(s=>{ s.px=s.x; s.py=s.y; s.x+=s.vx*dt; s.y+=s.vy*dt; s.life-=dt; });

  for(const s of shots){
    for(const e of enemies){
      // Shared screen-plane collision: projectile and bot use their rendered 2D centers.
      const botHitRadius=Math.max(30,e.scale*.50);
      if(s.life>0&&e.hp>0&&sweptHit(s,e.x,e.y,botHitRadius+(s.r||6))){
        s.life=0; e.hp-=(s.power?2:1);
        if(e.hp<=0){
          explodeAt(e.x,e.y,clamp(e.scale/82,.75,1.45));
          score+=200; combo++; killTally++; if(Math.random()<.25) spawnPowerUp(e.x,e.y);
        }
      }
    }
    if(scene==='boss'&&s.life>0&&sweptHit(s,boss.x,boss.y,175+(s.r||7))){ s.life=0; boss.hp-=(s.power?2.2:1.1); explodeAt(s.x,s.y,.45); score+=65; }
  }
  shots=shots.filter(s=>s.life>0&&s.y>-120&&s.y<H+120&&s.x>-80&&s.x<W+80);

  for(const s of enemyShots){ if(s.life>0&&sweptHit(s,target.x,target.y,42+(s.r||5))){ s.life=0; hp=Math.max(1,hp-1); combo=0; explodeAt(target.x,target.y,.35); } }
}

function drawEnemies(){
  drawExplosions();
  enemies.forEach(e=>{ drawSprite(im('bots',e.i),e.x,e.y,e.scale,1,0,true); });
  ctx.fillStyle='#ff5147'; enemyShots.forEach(s=>{ ctx.beginPath(); ctx.arc(s.x,s.y,s.r||5,0,7); ctx.fill(); });

  // Music Note Projectiles
  shots.forEach(s=>{
    const imgNote = s.power ? im('sonicRing') : im('noteWhole');
    if(imgNote){
      drawSprite(imgNote, s.x, s.y, s.power?38:26, 1, clock*8, false);
    } else {
      ctx.fillStyle='#72e9ff'; ctx.beginPath(); ctx.arc(s.x,s.y,s.r||6,0,7); ctx.fill();
    }
  });
  powerUps.forEach(p=>{ drawSprite(im('power'),p.x,p.y,36,0.95,0,true); });
}

let cloudPool = [];
function seedCloudPool(){
  cloudPool = [];
  for(let i=0; i<16; i++){
    cloudPool.push({
      x: rand(-40, W-120), y: rand(-220, H+220), speed: rand(220, 480), scale: rand(0.75, 1.45), alpha: rand(0.30, 0.60), layer: 'mid', rot: rand(-0.05, 0.05)
    });
  }
  for(let i=0; i<8; i++){
    cloudPool.push({
      x: rand(-80, W+80), y: rand(-320, H+320), speed: rand(540, 920), scale: rand(1.35, 2.25), alpha: rand(0.20, 0.42), layer: 'fore', rot: rand(-0.08, 0.08)
    });
  }
}

function updateAndDrawCloudPool(dt, diveMult=1.0, panX=0){
  const imgCloud = im('clouds');
  if(!imgCloud) return;
  if(cloudPool.length === 0) seedCloudPool();

  cloudPool.forEach(c => {
    c.y -= c.speed * dt * diveMult;
    if(c.y < -260){
      c.y = H + 220 + rand(0, 160); c.x = rand(-60, W-100);
      c.scale = c.layer === 'fore' ? rand(1.35, 2.25) : rand(0.75, 1.45);
      c.speed = c.layer === 'fore' ? rand(540, 920) : rand(220, 480);
      c.alpha = c.layer === 'fore' ? rand(0.20, 0.42) : rand(0.30, 0.60);
      c.rot = rand(-0.06, 0.06);
    }
    ctx.save(); ctx.globalAlpha = c.alpha;
    const w = imgCloud.width * c.scale, h = imgCloud.height * c.scale;
    const renderX = c.x + (c.layer === 'fore' ? panX * 0.75 : panX * 0.35);
    ctx.translate(renderX + w/2, c.y + h/2); ctx.rotate(c.rot);
    ctx.drawImage(imgCloud, -w/2, -h/2, w, h); ctx.restore();
  });
}

function drawFreefallBaseSky(panX=0){
  const grad = ctx.createLinearGradient(0,0,0,H);
  grad.addColorStop(0, '#050f1e'); grad.addColorStop(0.35, '#0e2338'); grad.addColorStop(0.70, '#1c425e'); grad.addColorStop(1.0, '#326080');
  ctx.fillStyle = grad; ctx.fillRect(0,0,W,H);
  const lightGrad = ctx.createRadialGradient(W*0.65 + panX*0.2, H*0.25, 20, W*0.65 + panX*0.2, H*0.25, 450);
  lightGrad.addColorStop(0, 'rgba(255, 220, 150, 0.14)'); lightGrad.addColorStop(0.5, 'rgba(100, 200, 255, 0.06)'); lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = lightGrad; ctx.fillRect(0,0,W,H);
}

let freefallState = 'DEFAULT_INVERTED_DIVE';
function updateFreefallState(ix, iy, power, resist, firing){
  if(hero.spinT > 0){ freefallState = 'AERIAL_REVOLUTION'; }
  else if(resist){ freefallState = firing ? 'RESISTANCE_FIRE' : 'RESISTANCE'; }
  else if(power){ freefallState = firing ? 'INVERTED_FIRE' : 'POWER_DIVE'; }
  else if(ix < -0.2){ freefallState = 'BANK_LEFT'; }
  else if(ix > 0.2){ freefallState = 'BANK_RIGHT'; }
  else if(firing){ freefallState = 'INVERTED_FIRE'; }
  else { freefallState = 'DEFAULT_INVERTED_DIVE'; }
}

function renderFreefallHero(x, y, state){
  let sprName = 'aerialDive', h = 205, rot = 0;
  switch(state){
    case 'DEFAULT_INVERTED_DIVE': sprName = 'aerialDive'; rot = 0; h = 205; break;
    case 'POWER_DIVE': sprName = 'aerialDive'; rot = 0; h = 195; break;
    case 'RESISTANCE': sprName = 'aerialResist'; rot = 0; h = 215; break;
    case 'RESISTANCE_FIRE': sprName = 'aerialDive'; rot = 0; h = 215; break;
    case 'INVERTED_FIRE': sprName = 'aerialDive'; rot = 0; h = 205; break;
    case 'BANK_LEFT': sprName = 'aerialBankLeft'; rot = -0.12; h = 205; break;
    case 'BANK_RIGHT': sprName = 'aerialBankRight'; rot = 0.12; h = 205; break;
    case 'AERIAL_REVOLUTION': sprName = 'aerialSpin'; rot = 0; h = 205; break;
    default: sprName = 'aerialDive'; rot = 0; h = 205; break;
  }

  let spr;
  if(state === 'AERIAL_REVOLUTION'){
    const pSpin = clamp(1 - (hero.spinT / 0.28), 0, 1);
    const fIdx = Math.floor(pSpin * 4) % 4;
    spr = im('aerialSpin', fIdx);

    // Controlled ballerina spin flare & circular motion silhouette
    ctx.save();
    ctx.globalAlpha = 0.38 * (1 - Math.abs(pSpin - 0.5) * 2);
    ctx.strokeStyle = 'rgba(255, 235, 190, 0.75)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(x, y, h * 0.32, h * 0.14, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  } else {
    spr = animName(sprName, 0.08);
  }

  drawSprite(spr, x, y, h, 1, rot, true);

  // Illuminated weapon tip glow when firing (at weapon nozzle pointing straight down)
  if(keys.Space){
    ctx.save();
    const flashY = y + h * 0.44;
    const flashR = 16 + Math.random() * 8;
    const grad = ctx.createRadialGradient(x, flashY, 2, x, flashY, flashR);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.35, '#ffea78');
    grad.addColorStop(1, 'rgba(255, 120, 30, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, flashY, flashR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function intro(dt){
  cam.tx=0; cam.ty=0; cam.tz=1+Math.sin(clock*.5)*.01; camera(dt);
  drawCover(im('sky'),0,0,W,H,cam.zoom);
  const p=local(0,1); plane.x=640+Math.sin(clock*1.4)*35; plane.y=240+Math.sin(clock*1.9)*12;
  const burning = escapeTaps >= 3 || p > .6, pi = burning ? 2 : 0;
  drawSprite(im('plane', pi), plane.x, plane.y, 210, 1, 0, true);

  if((keys.ArrowUp||keys.KeyW)&&!keys._tap){ escapeTaps++; keys._tap=true; } else if(!(keys.ArrowUp||keys.KeyW)) keys._tap=false;

  if(escapeTaps >= 5 || p > .85){
    const leapProgress = clamp((p - .85)/.15, 0, 1);
    drawSprite(im('aerialResist', 0), plane.x + leapProgress*120, plane.y + leapProgress*180, 160, 1, 0, true);
    drawSprite(im('explosion'), plane.x, plane.y, 280 * (1+leapProgress), 0.9);
  }

  ctx.fillStyle='rgba(10,14,22,.82)'; ctx.strokeStyle='#ff9f43'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.roundRect(390,625,500,48,8); ctx.fill(); ctx.stroke();
  ctx.fillStyle='#fff'; ctx.font='900 17px Arial'; ctx.textAlign='center';
  ctx.fillText(`TAP ↑ / W — EJECT FROM JET ${Math.min(100,escapeTaps*20)}%`,640,655);
}

function dive(dt){
  const ix=inputX(), iy=inputY(); const power=keys.ArrowDown||keys.KeyS, resist=keys.ArrowUp||keys.KeyW, firing=keys.Space;
  const pSeg = local(1,2);

  // Controlled aerial spin transition on rapid Left <-> Right input direction change
  if(hero.spinT > 0){
    hero.spinT -= dt;
  }
  const currentDir = Math.sign(ix);
  if(currentDir !== 0){
    if(hero.lastDir !== 0 && hero.lastDir !== currentDir && (clock - hero.lastDirTime) < 0.38){
      hero.spinT = 0.28;
      hero.spinDir = currentDir;
    }
    hero.lastDir = currentDir;
    hero.lastDirTime = clock;
  }
  hero.prevIx = ix;
  
  // Midpoint Power-Up Trigger at ~60% of Freefall
  if(pSeg > 0.60 && powerCharge < 0.8){ powerCharge = 1.0; flashT = 0.2; }

  const base=power?720:resist?180:400; diveScroll += base*dt;
  cam.tx=ix*48; cam.ty=iy*18 + (power?32:resist?-36:0);
  cam.tz=power?0.90:resist?1.25:1.05; camera(dt);

  drawFreefallBaseSky(cam.x*.15);
  updateAndDrawCloudPool(dt, power?1.8:resist?0.4:1.0, cam.x);
  if(im('speed')) drawCover(im('speed'),0,0,W,H,1.0,0,0,power?.45:.12);

  hero.x=clamp(hero.x+ix*390*dt,110,1170); hero.y=clamp(hero.y+iy*280*dt,120,610);
  updateFreefallState(ix, iy, power, resist, firing);
  renderFreefallHero(hero.x, hero.y, freefallState);

  updateEnemies(dt,'dive',hero); updatePowerUps(dt,hero); updateCombat(dt,'down',hero); updateExplosions(dt); drawEnemies();
}

function transition1(dt){
  const p=local(2,3);
  drawCover(im('maze'),0,0,W,H,1.05);
  // Dive lands directly into the car chase.
  drawSprite(im('heroCarIdle'),lerp(1120,640,ease(p)),585,lerp(120,205,p));
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
  }
}

function runway(dt){
  const p=local(5,6), half=p<.60, ix=inputX(); runwayDir=half?1:-1;
  cam.tx=ix*46; cam.ty=0; cam.tz=half?lerp(1.02,.92,p/.60):lerp(.92,1.08,(p-.60)/.40); camera(dt);
  drawRunwayTrack(!half,cam.x);

  hero.x=clamp(hero.x+ix*340*dt,190,1090);
  if((keys.ArrowUp||keys.KeyW)&&hero.jump===0){ hero.jv=-580; hero.jump=-1; }
  if(hero.jump!==0){ hero.jv+=1480*dt; hero.jump+=hero.jv*dt; if(hero.jump>=0){ hero.jump=0; hero.jv=0; } }

  let y,h,spr;
  const firing = keys.Space;
  const jumping = hero.jump < 0;
  const isMovingSide = Math.abs(ix) > 0.25;

  if(half){
    // Phase A: Running away toward background
    const q=p/.60; h=lerp(220,110,ease(q)); y=lerp(580,335,ease(q))+hero.jump;
    if(jumping) spr=animName('aimJump',.11);
    else if(isMovingSide) spr=animName('runSide',.095);
    else spr=animName('runBack',.095);
    // In the away-facing leg, preserve the correct back-facing run body state; weapon fire still travels forward up-lane.
    if(q>.85){ itemSecured=true; hero.carry=true; itemFlash=Math.sin(clock*14)*.5+.5; }
  } else {
    // Phase B: Turnaround, running toward camera carrying item!
    const q=(p-.60)/.40; h=lerp(118,228,ease(q)); y=lerp(355,578,ease(q))+hero.jump;
    if(q < 0.08) spr=im('runTurn');
    else if(jumping) spr=animName('aimJump',.11);
    else if(firing) spr=animName('frontFireUp',.09);
    else if(isMovingSide) spr=animName('runSide',.095);
    else spr=animName('runFront',.095);

    // Algorithm Air Boss emerges with MECHANICAL TENTACLES & CLAWS
    const bossScale = lerp(120, 480, q*q);
    const bossY = lerp(140, 230, q);
    drawSprite(im('boss'), 640 + Math.sin(clock*0.8)*25, bossY, bossScale, 0.98);

    // Boss Side Gripper Claws threatening edges
    if(im('bossClawLeft')) drawSprite(im('bossClawLeft'), 180 - q*40, bossY + 40, bossScale*0.5, 0.9);
    if(im('bossClawRight')) drawSprite(im('bossClawRight'), 1100 + q*40, bossY + 40, bossScale*0.5, 0.9);

    // Dark Ominous Palette Shift Overlay
    ctx.fillStyle = `rgba(15, 5, 25, ${q*0.35})`; ctx.fillRect(0,0,W,H);
  }

  // Render hero (white aviator jacket) and keep collision/fire origin on the exact rendered plane.
  hero.y=y;
  drawSprite(spr,hero.x,y,h,1,0,true);
  if(hero.carry) drawSprite(im('item'),hero.x+22,y-38,34,.85+.15*itemFlash,0,true);

  if(firing){
    ctx.save();
    const flashY = y - h * 0.42;
    const flashR = 14 + Math.random() * 6;
    const grad = ctx.createRadialGradient(hero.x, flashY, 2, hero.x, flashY, flashR);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.35, '#ffea78');
    grad.addColorStop(1, 'rgba(255, 120, 30, 0)');
    ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(hero.x, flashY, flashR, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }

  updateEnemies(dt,'air',hero); updatePowerUps(dt,hero); updateCombat(dt,'up',hero); updateExplosions(dt); drawEnemies();
}

function transition2(dt){
  const p=local(4,5);
  drawCover(im('runway'),0,0,W,H,1.06,0,-35);
  // Exit vehicle into the established runway character state.
  drawSprite(im('heroCarAlt'),lerp(640,380,ease(p)),585,lerp(205,150,p),1-p*.45);
  drawSprite(im('runBack',0),lerp(760,640,ease(p)),lerp(610,565,ease(p)),lerp(120,190,p),p);
}

function drawRoad(){
  drawCover(im('maze'),0,0,W,H,1.05,cam.x*.25,0);
  const horizon=232; ctx.fillStyle=tankPowerUp?'rgba(20,5,35,.88)':'rgba(5,10,16,.86)';
  ctx.beginPath(); ctx.moveTo(100,H); ctx.lineTo(525,horizon); ctx.lineTo(755,horizon); ctx.lineTo(1180,H); ctx.closePath(); ctx.fill();
  ctx.strokeStyle=tankPowerUp?'rgba(255,100,220,.75)':'rgba(102,232,255,.34)'; ctx.lineWidth=3; ctx.stroke();

  // Holographic Piano Keyboard Road Transformation after power-up!
  for(let i=0;i<32;i++){
    let z=((i*108-runScroll)%2600+2600)%2600, zz=z/2600, pers=1-zz, y=horizon+pers*440, half=lerp(550,55,zz), alpha=.18+.58*(1-zz);
    if(tankPowerUp){
      // Glowing Keyboard Key Lines
      ctx.fillStyle = i%2===0 ? `rgba(255,255,255,${alpha*.45})` : `rgba(30,30,40,${alpha*.65})`;
      ctx.fillRect(640-half,y,half*2,6);
    } else {
      ctx.fillStyle=`rgba(255,255,255,${alpha*.07})`; ctx.fillRect(640-half,y,half*2,2);
    }
  }
}

function roadPoint(z,lane,curve){ const maxZ=2200,zz=clamp(z/maxZ,-.28,1),pers=1-zz,horizon=235,roadHalf=lerp(540,58,zz),cy=horizon+pers*445,cx=640+curve*(1-zz)*160; return {x:cx+lane*roadHalf*.56,y:cy,scale:lerp(1,.10,zz),half:roadHalf,zz}; }

function routeType(){
  const r=Math.random();
  if(r<.09) return 'power';
  if(r<.20) return 'ramp';
  if(r<.31) return 'wall';
  if(r<.52) return 'pursuit';
  if(r<.69) return 'armored';
  if(r<.82) return 'blocker';
  return 'drone';
}
function routeHp(type){ return type==='wall'?7:type==='blocker'?6:type==='armored'?4:type==='drone'?3:type==='pursuit'?3:1; }
function seedRoute(){
  routeObjects=[]; let z=520;
  for(let i=0;i<22;i++){
    const type=routeType();
    routeObjects.push({ z, lane:[-1,0,1][Math.floor(Math.random()*3)], curve:rand(-.75,.75), type, hp:routeHp(type), shooter:(type==='drone'||type==='armored')&&Math.random()<.55, cool:rand(1.2,3.0), hit:false });
    z+=rand(190,285);
  }
}

function updateRoute(dt){
  const mult = tankPowerUp ? 1.45 : 1.0;
  const forwardSpeed = 940*routeSpeed*mult;
  runScroll += forwardSpeed*dt;
  speedValue = lerp(speedValue, tankPowerUp ? 235 : 185, Math.min(1,dt*3.4));

  routeObjects.forEach(o=>{
    o.prevZ=o.z; o.z -= forwardSpeed*dt;
    const pt=roadPoint(o.z,o.lane,o.curve);
    o.psx=o.sx??pt.x; o.psy=o.sy??pt.y;
    o.sx=pt.x; o.sy=pt.y; o.ss=pt.scale;
    if(o.shooter && o.z<900 && o.z>260){
      o.cool-=dt;
      if(o.cool<=0 && enemyShots.length<10){
        o.cool=rand(1.15,2.15);
        const dx=vehicle.x-o.sx,dy=(vehicle.y+vehicle.air)-o.sy,l=Math.hypot(dx,dy)||1;
        enemyShots.push({x:o.sx,y:o.sy,px:o.sx,py:o.sy,vx:dx/l*430,vy:dy/l*430,life:2.8,r:7});
      }
    }
  });
  routeObjects=routeObjects.filter(o=>o.z>-330&&o.hp>0);
  while(routeObjects.length<22){
    const last=Math.max(...routeObjects.map(o=>o.z),500);
    const type=routeType();
    routeObjects.push({ z:last+rand(190,285), lane:[-1,0,1][Math.floor(Math.random()*3)], curve:rand(-.75,.75), type, hp:routeHp(type), shooter:(type==='drone'||type==='armored')&&Math.random()<.55, cool:rand(1.2,3.0), hit:false });
  }
}

function collideRouteShots(){
  for(const s of shots){
    for(const o of routeObjects){
      if(!o.sx||o.type==='ramp'||o.type==='power'||o.hp<=0) continue;
      const rr=(o.type==='blocker'?58:o.type==='wall'?72:o.type==='drone'?40:48)*Math.max(.45,(o.ss||1)*1.75);
      if(s.life>0 && sweptHit(s,o.sx,o.sy,rr+(s.r||7))){
        s.life=0; o.hp-=s.power?3:1; explodeAt(s.x,s.y,.30+.25*(o.ss||1));
        if(o.hp<=0){ score+=o.type==='wall'?320:o.type==='blocker'?300:220; combo++; killTally++; explodeAt(o.sx,o.sy,Math.max(.65,(o.ss||1)*1.4)); }
      }
    }
  }
}

function currentRoadLane(){
  const laneCenters=[338,640,942];
  let best=0,bd=Infinity;
  laneCenters.forEach((x,i)=>{const d=Math.abs(vehicle.x-x);if(d<bd){bd=d;best=i-1;}});
  return best;
}

function drawRouteObject(o){
  if(!o.sx) return;
  const depthScale=Math.max(.10,o.ss||.1);
  if(o.type==='pursuit') drawSprite(im('enemyCar'),o.sx,o.sy,150*depthScale,1,0,true);
  else if(o.type==='armored') drawSprite(im('enemyArmored')||im('enemyCar'),o.sx,o.sy,165*depthScale,1,0,true);
  else if(o.type==='blocker') drawSprite(im('enemyTruck')||im('bots',7),o.sx,o.sy,205*depthScale,1,0,true);
  else if(o.type==='drone') drawSprite(im('bots',2),o.sx,o.sy-38*depthScale,130*depthScale,1,0,true);
  else if(o.type==='ramp') drawSprite(im('routeRamps',Math.abs(o.lane)%M.routeRamps.length),o.sx,o.sy,165*depthScale,1,0,true);
  else if(o.type==='wall') drawSprite(im('roadBarrier')||im('constructionBarrier'),o.sx,o.sy,190*depthScale,1,0,true);
  else if(o.type==='power') drawSprite(im('power'),o.sx,o.sy,65*depthScale,.95,0,true);
}

function drawCarHint(text,color='#72e9ff'){
  ctx.save(); ctx.textAlign='center'; ctx.font='bold 18px system-ui';
  ctx.fillStyle='rgba(3,8,18,.82)'; ctx.strokeStyle=color; ctx.lineWidth=2;
  const w=Math.min(580,Math.max(300,ctx.measureText(text).width+52));
  ctx.fillRect(W/2-w/2,118,w,44); ctx.strokeRect(W/2-w/2,118,w,44);
  ctx.fillStyle='#fff'; ctx.fillText(text,W/2,146); ctx.restore();
}

function maze(dt){
  const ix=inputX(), iy=inputY();
  const pSeg = local(3,4);
  if(pSeg > 0.60 && !tankPowerUp){ tankPowerUp = true; flashT = 0.25; }

  cam.tx=ix*46; cam.ty=iy*6; cam.tz=vehicle.air<0?.94:1.02; camera(dt); drawRoad();
  if(im('speed')) drawCover(im('speed'),0,0,W,H,1.05,0,0,.18+Math.min(.22,speedValue/900));

  // Faster arcade steering laid over a genuinely fast Z-axis road simulation.
  vehicle.vx=lerp(vehicle.vx,ix*590,.13);
  vehicle.vy=lerp(vehicle.vy,iy*150,.10);
  vehicle.x=clamp(vehicle.x+vehicle.vx*dt,175,1105);
  vehicle.y=clamp(vehicle.y+vehicle.vy*dt,485,642);

  const roadDepth = clamp((642 - vehicle.y)/157, 0, 1);
  const carHeight = lerp(220, 150, roadDepth);

  const isOffRoad = vehicle.x < 255 || vehicle.x > 1025;
  routeSpeed = isOffRoad && !tankPowerUp ? .95 : 1.48;
  if(isOffRoad && !tankPowerUp){ hp=Math.max(1,hp-dt*.35); ctx.strokeStyle='rgba(255,60,60,.6)';ctx.lineWidth=10;ctx.strokeRect(2,2,W-4,H-4); }

  if(vehicle.air!==0){ vehicle.av+=1650*dt; vehicle.air+=vehicle.av*dt; if(vehicle.air>=0){ vehicle.air=0; vehicle.av=0; } }

  updateRoute(dt);
  const playerLane=currentRoadLane();
  let nearestHazard=null;

  routeObjects.slice().sort((a,b)=>b.z-a.z).forEach(o=>drawRouteObject(o));

  for(const o of routeObjects){
    if(!o.sx) continue;
    if(o.lane===playerLane && o.z<520 && o.z>100 && (o.type==='ramp'||o.type==='wall')){
      if(!nearestHazard || o.z<nearestHazard.z) nearestHazard=o;
    }

    // Perspective-aware crossing: collisions only become physical near the player's foreground plane.
    if(o.lane===playerLane && o.z<155 && o.z>-45){
      if(o.type==='ramp' && !o.hit){
        o.hit=true;
        if(keys.ArrowUp||keys.KeyW||vehicle.air<0){ vehicle.air=-2; vehicle.av=-760; score+=90; }
        else { hp=Math.max(1,hp-1); combo=0; vehicle.air=-1; vehicle.av=-390; }
      } else if(o.type==='wall' && !o.hit){
        o.hit=true;
        if(tankPowerUp || o.hp<=0){ o.hp=0; score+=250; combo++; explodeAt(o.sx,o.sy,1.1); }
        else { hp=Math.max(1,hp-1); combo=0; o.hp=0; explodeAt(o.sx,o.sy,1.25); }
      } else if(['pursuit','armored','blocker','drone'].includes(o.type) && !o.hit){
        o.hit=true;
        if(vehicle.air<0){ score+=80; }
        else if(tankPowerUp){ o.hp=0;score+=350;combo++;explodeAt(o.sx,o.sy,1.0); }
        else { hp=Math.max(1,hp-1);combo=0;o.hp=0;explodeAt(o.sx,o.sy,.9); }
      } else if(o.type==='power' && !o.hit){ o.hit=true;o.hp=0;powerCharge=clamp(powerCharge+.35,0,1);score+=250; }
    }
  }

  if(nearestHazard){
    if(nearestHazard.type==='ramp') drawCarHint('RAMP AHEAD — ↑ / W TO JUMP','#72e9ff');
    else drawCarHint('WALL AHEAD — FIRE OR SHIFT BURST THROUGH','#ffb347');
  }

  if(keys.Space) fire('up'); fireT=Math.max(0,fireT-dt); tryBurst();
  shots.forEach(s=>{ s.px=s.x;s.py=s.y;s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt; });
  collideRouteShots();
  shots=shots.filter(s=>s.life>0&&s.y>-90&&s.y<H+90);

  enemyShots.forEach(s=>{ s.px=s.x;s.py=s.y;s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt; if(s.life>0&&sweptHit(s,vehicle.x,vehicle.y+vehicle.air,carHeight*.25)){s.life=0;hp=Math.max(1,hp-1);combo=0;explodeAt(vehicle.x,vehicle.y+vehicle.air,.35);} });
  enemyShots=enemyShots.filter(s=>s.life>0&&s.y<H+100);

  updatePowerUps(dt,vehicle);

  const carSpr = keys.Space ? im('heroCarBoost') : (Math.abs(ix)>.35 ? im('heroCarAlt') : im('heroCarIdle'));
  drawSprite(carSpr || im('heroCar'), vehicle.x, vehicle.y+vehicle.air, carHeight, 1, 0, true);
  updateExplosions(dt); drawExplosions();

  // Draw player and hostile projectiles after the route so depth reads cleanly.
  shots.forEach(s=>drawSprite(s.power?im('sonicRing'):im('noteWhole'),s.x,s.y,s.power?38:27,1,clock*8,false));
  ctx.fillStyle='#ff5147'; enemyShots.forEach(s=>{ctx.beginPath();ctx.arc(s.x,s.y,s.r||6,0,Math.PI*2);ctx.fill();});
}

function transition3(dt){
  const p=local(6,7);
  drawCover(im('bossBg'),0,0,W,H,lerp(.96,1.02,p));
  // Run scene resolves into the boss combat stance — no vehicle/piano-tank carryover.
  const spr=p<.48 ? im('runFront',Math.floor(clock*9)%M.runFront.length) : im('aimIdle');
  drawSprite(spr,640,lerp(575,565,ease(p)),lerp(210,205,p),1,0,true);
}

function bossScene(dt){
  const p=local(7,8), lost=1-boss.hp/boss.max;
  floorBroken=floorBroken||lost>.33||p>.36;
  const omin=ease(clamp((p-.05)/.82,0,1));
  cam.tx=inputX()*24; cam.ty=0; cam.tz=lerp(.90,1.25,omin); camera(dt);

  // Render EDGE-TO-EDGE Seamless Digital Storm Backdrop (ZERO FLOATING BOX!)
  drawCover(im('bossBg'),0,0,W,H,cam.zoom,cam.x*.2,0);

  boss.x=640+Math.sin(clock*.55)*150;
  boss.y=floorBroken ? 185+Math.sin(clock*.9)*18 : 135+Math.sin(clock*.9)*12;
  drawSprite(im('boss'),boss.x,boss.y,lerp(220,390,omin));

  // Ground / Platform Structure
  if(!floorBroken){
    ctx.fillStyle='#0f1923'; ctx.fillRect(0,570,W,150);
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

  updateEnemies(dt,'air',hero); updatePowerUps(dt,hero); updateCombat(dt,'up',hero); updateExplosions(dt); drawEnemies();

  // SINGLE 2Fly character rendering call (Aiming UP towards boss, ZERO GHOST DUPLICATES!)
  let bState = 'aimIdle';
  if(keys.ArrowDown||keys.KeyS) bState = 'crouch';
  else if(hero.jump<0) bState = 'aimJump';
  else if(keys.Space) bState = 'aimFire';
  else if(Math.abs(inputX())>0.1) bState = 'aimUp';

  const bSpr = (bState === 'aimFire') ? animName('aimFire', 0.08) : im(bState, Math.floor(clock*9) % (M[bState] ? M[bState].length : 1));
  drawSprite(bSpr, hero.x, hero.y, 205, 1, 0, true);

  if(keys.Space){
    ctx.save();
    const flashY = hero.y - 205 * 0.44;
    const flashR = 18 + Math.random() * 8;
    const grad = ctx.createRadialGradient(hero.x, flashY, 2, hero.x, flashY, flashR);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.35, '#72e9ff');
    grad.addColorStop(1, 'rgba(0, 150, 255, 0)');
    ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(hero.x, flashY, flashR, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }

  if(p>.94&&boss.hp>7) boss.hp-=dt*.7;
  if(boss.hp<=0&&!boss.exploded){ boss.exploded=true; explodeAt(boss.x,boss.y,2.4); score+=1500; }
}

function finale(dt){
  const p=local(8,9);
  // Smooth transition to EXTREME-WIDE SHOT
  const z=lerp(1.15,.55,ease(p));
  drawCover(im('bossBg'),0,0,W,H,z);

  drawSprite(im('boss'),640,245,lerp(380,170,p),1-p*.55);
  drawSprite(im('aimFire',Math.floor(clock*10)%M.aimFire.length),640,585,180);

  finalCharge=clamp(finalCharge+((keys.Space||keys.ArrowUp||keys.KeyW||keys.ArrowRight||keys.KeyD)?dt*.9:dt*.18),0,1);
  ctx.strokeStyle='#73e9ff'; ctx.lineWidth=8; ctx.beginPath(); ctx.arc(640,380,60+finalCharge*220,0,Math.PI*2); ctx.stroke();

  if(p>.72){
    ctx.fillStyle=`rgba(255,255,255,${clamp((p-.72)/.28,0,.85)})`; ctx.fillRect(0,0,W,H);
    drawSprite(im('explosion'), 640, 245, 320*(p-.7), 0.95);
  }

  ctx.fillStyle='#fff'; ctx.font='900 20px Arial'; ctx.textAlign='center';
  ctx.fillText('FINISHER CHARGING — MUSIC COMPLETE INCOMING!',640,670);
}

let endingReplayBound=false;
function ending(){
  drawCover(im('bossBg'),0,0,W,H,.62);
  ctx.fillStyle='rgba(0,0,0,.72)'; ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#fff'; ctx.textAlign='center'; ctx.font='900 54px Arial';
  ctx.fillText('THE SIGNAL SURVIVES.',640,280);
  ctx.fillStyle='#78e7ff'; ctx.font='700 19px Arial';
  ctx.fillText('ONE SONG. ONE COMPLETE PLAYABLE EXPERIENCE.',640,330);

  ctx.fillStyle='rgba(14,43,71,.88)'; ctx.strokeStyle='#6fd8ff'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.roundRect(470,410,340,64,12); ctx.fill(); ctx.stroke();

  ctx.fillStyle='#fff'; ctx.font='900 22px Arial';
  ctx.fillText('RUN IT BACK  ↺',640,448);
  ctx.fillStyle='#8197aa'; ctx.font='700 12px Arial';
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

function hud(){
  ctx.fillStyle='rgba(2,7,12,.84)'; ctx.fillRect(24,18,520,110);
  ctx.fillStyle='#fff'; ctx.font='900 24px Arial'; ctx.textAlign='left'; ctx.fillText('RETURN OF THE AVIATOR',38,48);
  ctx.fillStyle='#64dcff'; ctx.font='700 14px Arial'; ctx.fillText(clock>cues[2]?'808 BOOMER // BASS PRESSURE':'TONEARM // WHOLE NOTE',38,78);
  ctx.fillStyle='#82efc4'; ctx.fillText('♫ TOO FAST • '+audioStatus,255,78);
  ctx.fillStyle='#a6b6c5'; ctx.fillText(`SCORE ${String(Math.floor(score)).padStart(7,'0')}  COMBO x${combo}`,38,105);

  ctx.fillStyle='rgba(255,255,255,.18)'; ctx.fillRect(370,96,130,10);
  ctx.fillStyle='#73e8ff'; ctx.fillRect(370,96,130*powerCharge,10);
  ctx.fillStyle='#fff'; ctx.font='700 10px Arial'; ctx.fillText('POWER',370,92);

  // Speed Meter for Vehicle Scene
  if(scene==='maze'){
    ctx.fillStyle='rgba(0,0,0,.75)'; ctx.fillRect(W-220,18,190,48);
    ctx.fillStyle='#73e8ff'; ctx.font='900 14px Arial'; ctx.textAlign='center';
    ctx.fillText(`SPEED ${Math.floor(speedValue)} MPH`, W-125, 38);
    ctx.fillStyle='rgba(255,255,255,.2)'; ctx.fillRect(W-200,44,150,8);
    ctx.fillStyle=tankPowerUp?'#ff60e0':'#73e8ff'; ctx.fillRect(W-200,44,150*clamp(speedValue/180,0,1),8);
  }

  if(scene==='boss'){
    ctx.fillStyle='rgba(0,0,0,.7)'; ctx.fillRect(380,18,520,14);
    ctx.fillStyle='#ff5148'; ctx.fillRect(380,18,520*clamp(boss.hp/boss.max,0,1),14);
  }

  if(flashT>0){ flashT-=dtGlobal; ctx.fillStyle=`rgba(120,230,255,${flashT*1.6})`; ctx.fillRect(0,0,W,H); }
  if(debug){
    ctx.fillStyle='rgba(0,0,0,.78)'; ctx.fillRect(1010,18,250,132);
    ctx.fillStyle='#8be7ff'; ctx.font='12px monospace'; ctx.fillText(`SCENE ${scene}`,1024,40);
    ctx.fillText(`CLOCK ${clock.toFixed(1)} / ${songDur.toFixed(1)}s`,1024,58);
    ctx.fillText(`BOTS ${enemies.length}`,1024,76);
    ctx.fillText(`SHOTS ${shots.length}/${enemyShots.length}`,1024,94);
    ctx.fillText(`POWER ${powerCharge.toFixed(2)}`,1024,112);
    ctx.fillText(`CAM ${cam.zoom.toFixed(2)}`,1024,130);
  }
}

function loop(now){
  if(!started) return;
  const dt=Math.min(.033,(now-last)/1000||0); dtGlobal=dt; last=now; clock+=dt; sceneLocal+=dt;
  setScene(sceneFor(clock)); ctx.clearRect(0,0,W,H);

  if(scene==='intro') intro(dt);
  else if(scene==='dive') dive(dt);
  else if(scene==='t1') transition1(dt);
  else if(scene==='runway') runway(dt);
  else if(scene==='t2') transition2(dt);
  else if(scene==='maze') maze(dt);
  else if(scene==='t3') transition3(dt);
  else if(scene==='boss') bossScene(dt);
  else if(scene==='finale') finale(dt);
  else ending();

  hud(); animId=requestAnimationFrame(loop);
}

loadAll().then(m=>{
  const b=document.getElementById('start'); b.disabled=false; b.textContent='START EXPERIENCE';
  const isIframe = window.self !== window.top;
  const isAuto = new URLSearchParams(location.search).get('autostart')==='1';
  if(isIframe || isAuto) start();
}).catch(e=>{ fatal.style.display='block'; fatal.textContent='LOAD ERROR: '+e.message; });

document.getElementById('start').addEventListener('click',start);
})();
