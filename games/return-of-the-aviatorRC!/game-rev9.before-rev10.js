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
 runBack:[0,1,2,3,4,5,6].map(i=>C+`runway/run_away_from_camera_${i}.png`),
 runFront:[0,1,2,3,4,5,6].map(i=>C+`runway/run_toward_camera_${i}.png`),
 runSide:[0,1,2,3,4,5,6].map(i=>C+`runway/run_side_${i}.png`),
 runTurn:[C+'transitions/turnaround_0.png'],
 aimIdle:[C+'combat/armed_idle_0.png'],
 aimUp:[0,1,2,3,4,5].map(i=>C+`combat/aim_up_${i}.png`),
 aimFire:[0,1,2,3,4,5].map(i=>C+`combat/fire_up_${i}.png`),
 frontFireUp:[0,1,2,3,4,5].map(i=>C+`combat/front_fire_up_${i}.png`),
 aimJump:[0,1,2].map(i=>C+`combat/jump_aim_up_${i}.png`),
 crouch:[C+'combat/crouch_0.png'],
 hitReaction:[C+'combat/hit_reaction_0.png'],
 pianoTankDrive:A+'piano_tank_drive.png',
 pianoTankBoost:A+'piano_tank_boost.png',
 pianoTankPower:A+'piano_tank_power.png',
 bossClawLeft:A+'boss_claw_left.png',
 bossClawRight:A+'boss_claw_right.png',
 noteWhole:A+'note_whole.png',
 noteHalf:A+'note_half.png',
 sonicRing:A+'sonic_ring.png',
 heroCar:A+'hero_car.png',heroCarIdle:A+'hero_car_idle.png',heroCarBoost:A+'hero_car_boost.png',heroCarAlt:A+'hero_car_alt.png',
 enemyCar:A+'enemy_car.png',enemyTruck:A+'enemy_truck.png',
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
  const scale = kind==='dive' ? (big ? rand(95, 112) : rand(58, 78)) : (big ? rand(110, 132) : rand(68, 92));
  
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
  
  enemies.push({x, y, vx, vy, i, hp:big?5:2, scale, shooter:Math.random()<.35, cool:rand(1.5,4.4)});
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
    enemies.forEach(e=>e.hp-=4);
    routeObjects.forEach(o=>{ if(o.type==='enemy'||o.type==='truck'||o.type==='crazedBot') o.hp=(o.hp||2)-4; });
    if(scene==='boss') boss.hp-=10;
    enemyShots=[]; score+=600;
  }
  if(!(keys.ShiftLeft||keys.ShiftRight)) keys._burstLatch=false;
}

function updateEnemies(dt,kind,target){
  spawnT-=dt; if(spawnT<=0){ spawnEnemy(kind); spawnT=kind==='dive'?rand(.5,0.9):rand(1.0,1.5); }
  enemies.forEach(e=>{
    e.x+=e.vx*dt; e.y+=e.vy*dt;
    if(e.shooter){ e.cool-=dt; if(e.cool<=0 && enemyShots.length<8){ e.cool=rand(1.8,4.5); const dx=target.x-e.x,dy=target.y-e.y,l=Math.hypot(dx,dy)||1; enemyShots.push({x:e.x,y:e.y,vx:dx/l*180,vy:dy/l*180,life:4,r:5}); } }
  });
  enemies=enemies.filter(e=>e.hp>0&&e.x>-220&&e.x<W+220&&e.y>-260&&e.y<H+260);
  enemyShots.forEach(s=>{ s.x+=s.vx*dt; s.y+=s.vy*dt; s.life-=dt; }); enemyShots=enemyShots.filter(s=>s.life>0);
}

// MUSIC NOTE PROJECTILE SYSTEM
function fire(dir='up'){
  if(fireT>0) return;
  fireT=0.14;
  const src = scene==='maze' ? vehicle : hero;
  const isPower = powerCharge>=0.8 || (scene==='maze' && tankPowerUp);

  if(dir==='down'||scene==='dive'){
    shots.push({x:src.x, y:src.y+35, vx:rand(-15,15), vy:860, life:1.5, r:8, power:isPower});
  } else if(scene==='maze'){
    // Car weapon state: twin forward shots leave the hood instead of 2Fly's body center.
    shots.push({x:src.x-26,y:src.y-52,vx:-18,vy:-900,life:1.45,r:7,power:isPower});
    shots.push({x:src.x+26,y:src.y-52,vx:18,vy:-900,life:1.45,r:7,power:isPower});
  } else {
    shots.push({x:src.x, y:src.y-45, vx:rand(-12,12), vy:-840, life:1.5, r:8, power:isPower});
  }
}

function updateCombat(dt,dir,target){
  fireT=Math.max(0,fireT-dt); if(keys.Space) fire(dir); tryBurst();
  shots.forEach(s=>{ s.x+=s.vx*dt; s.y+=s.vy*dt; s.life-=dt; });

  for(const s of shots){
    for(const e of enemies){
      // Shared screen-plane collision: projectile and bot use their rendered 2D centers.
      const botHitRadius=Math.max(30,e.scale*.50);
      if(s.life>0&&e.hp>0&&Math.hypot(s.x-e.x,s.y-e.y)<botHitRadius){
        s.life=0; e.hp-=(s.power?2:1);
        if(e.hp<=0){
          explodeAt(e.x,e.y,clamp(e.scale/82,.75,1.45));
          score+=200; combo++; killTally++; if(Math.random()<.25) spawnPowerUp(e.x,e.y);
        }
      }
    }
    if(scene==='boss'&&s.life>0&&Math.hypot(s.x-boss.x,s.y-boss.y)<165){ s.life=0; boss.hp-=(s.power?2.2:1.1); explodeAt(s.x,s.y,.45); score+=65; }
  }
  shots=shots.filter(s=>s.life>0&&s.y>-120&&s.y<H+120&&s.x>-80&&s.x<W+80);

  for(const s of enemyShots){ if(s.life>0&&Math.hypot(s.x-target.x,s.y-target.y)<35){ s.life=0; hp=Math.max(1,hp-1); combo=0; } }
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

function roadPoint(z,lane,curve){ const maxZ=1800,zz=clamp(z/maxZ,0,1),pers=1-zz,horizon=235,roadHalf=lerp(540,58,zz),cy=horizon+pers*445,cx=640+curve*(1-zz)*160; return {x:cx+lane*roadHalf*.56,y:cy,scale:lerp(1,.12,zz),half:roadHalf,zz}; }

function seedRoute(){
  routeObjects=[]; let z=480;
  for(let i=0;i<24;i++){
    const r=Math.random();
    const type=r<.15?'power':r<.28?'ramp':r<.50?'enemy':r<.72?'truck':'crazedBot';
    routeObjects.push({ z, lane:[-1,0,1][Math.floor(Math.random()*3)], curve:rand(-1,1), type, hp:type==='truck'||type==='crazedBot'?4:2, shooter:r>.88 });
    z+=rand(150,240);
  }
}

function updateRoute(dt){
  const mult = tankPowerUp ? 1.6 : 1.0;
  runScroll += 640*dt*routeSpeed*mult;
  speedValue = lerp(speedValue, tankPowerUp ? 180 : 110, dt*2.0);

  routeObjects.forEach(o=>{
    o.z -= 640*dt*routeSpeed*mult;
    const pt=roadPoint(o.z,o.lane,o.curve);
    o.sx=pt.x; o.sy=pt.y; o.ss=pt.scale;
  });
  routeObjects=routeObjects.filter(o=>o.z>-150&&o.hp>0);
  while(routeObjects.length<24){
    const last=Math.max(...routeObjects.map(o=>o.z),420);
    const r=Math.random();
    const type=r<.15?'power':r<.28?'ramp':r<.50?'enemy':r<.72?'truck':'crazedBot';
    routeObjects.push({ z:last+rand(150,240), lane:[-1,0,1][Math.floor(Math.random()*3)], curve:rand(-1,1), type, hp:type==='truck'||type==='crazedBot'?4:2, shooter:r>.88 });
  }
}

function collideRouteShots(){
  for(const s of shots){
    for(const o of routeObjects){
      if(s.life>0 && o.sx && Math.hypot(s.x-o.sx,s.y-o.sy)<Math.max(22,o.type==='truck'?42:30)*(o.ss||1)*2.1){
        s.life=0; o.hp=(o.hp||1)-1;
        if(o.hp<=0){ score+=o.type==='truck'?280:180; combo++; killTally++; }
      }
    }
  }
}

function maze(dt){
  const ix=inputX(), iy=inputY();
  const pSeg = local(3,4);
  if(pSeg > 0.60 && !tankPowerUp){ tankPowerUp = true; flashT = 0.25; }

  cam.tx=ix*52; cam.ty=iy*8; cam.tz=vehicle.air<0?.93:1.02; camera(dt); drawRoad();

  // Physics-driven movement
  vehicle.vx=lerp(vehicle.vx,ix*460,.09);
  vehicle.vy=lerp(vehicle.vy,iy*170,.09);
  vehicle.x=clamp(vehicle.x+vehicle.vx*dt,180,1100);
  vehicle.y=clamp(vehicle.y+vehicle.vy*dt,460,645);

  const roadDepth = clamp((645 - vehicle.y)/185, 0, 1);
  const carHeight = lerp(205, 130, roadDepth);

  // Raised Bridge Danger Check
  const isOffRoad = vehicle.x < 270 || vehicle.x > 1010;
  if(isOffRoad && !tankPowerUp){
    routeSpeed = 0.5; hp = Math.max(1, hp - dt*0.5);
    ctx.strokeStyle = 'rgba(255, 60, 60, 0.75)'; ctx.lineWidth = 14; ctx.strokeRect(0, 0, W, H);
  } else {
    routeSpeed = 1.0;
  }

  if(vehicle.air<0 || vehicle.air>0){ vehicle.av+=1500*dt; vehicle.air+=vehicle.av*dt; if(vehicle.air>=0){ vehicle.air=0; vehicle.av=0; } }

  updateRoute(dt);
  routeObjects.forEach(o=>{
    if(!o.sx) return;
    const sz=o.type==='truck'?190*o.ss:o.type==='crazedBot'?145*o.ss:o.type==='enemy'?138*o.ss:110*o.ss;
    if(o.type==='enemy') drawSprite(im('enemyCar'),o.sx,o.sy,sz,1,0,true);
    else if(o.type==='truck') drawSprite(im('enemyTruck'),o.sx,o.sy,sz,1,0,true);
    else if(o.type==='crazedBot') drawSprite(im('bots',7),o.sx,o.sy,sz,1,0,true);

    const hitR = o.type==='truck'?55:o.type==='crazedBot'?42:40;
    if(Math.hypot(o.sx-vehicle.x,o.sy-vehicle.y)<hitR + carHeight*0.22 && o.z<320){
      if(tankPowerUp){
        // SMASH THROUGH EVERYTHING IN TANK POWER MODE!
        o.hp=0; score+=350; combo++;
      } else if(o.type==='enemy' || o.type==='truck' || o.type==='crazedBot'){
        hp=Math.max(1,hp-1); combo=0; o.hp=0;
      }
    }
  });

  if(keys.Space) fire('up'); fireT=Math.max(0,fireT-dt); tryBurst();
  shots.forEach(s=>{ s.x+=s.vx*dt; s.y+=s.vy*dt; s.life-=dt; }); collideRouteShots();
  shots=shots.filter(s=>s.life>0&&s.y>-60);

  updatePowerUps(dt,vehicle);

  // Proper 2Fly CAR character state. Keep the character/vehicle readable rather than swapping to an unrelated tank state.
  const carSpr = keys.Space ? im('heroCarBoost') : (Math.abs(ix)>.35 ? im('heroCarAlt') : im('heroCarIdle'));
  drawSprite(carSpr || im('heroCar'), vehicle.x, vehicle.y+vehicle.air, carHeight, 1, 0, true);

  // Enemy bots are screen-plane actors here too — no parallax/4D bot movement.
  updateEnemies(dt,'car',vehicle);
  updateExplosions(dt);
  // Bullets already moved above for route targets; test those same screen-space bullets against bots.
  for(const s of shots){
    for(const e of enemies){
      const hitR=Math.max(30,e.scale*.50);
      if(s.life>0&&e.hp>0&&Math.hypot(s.x-e.x,s.y-e.y)<hitR){
        s.life=0; e.hp-=(s.power?2:1);
        if(e.hp<=0){ explodeAt(e.x,e.y,clamp(e.scale/82,.75,1.45)); score+=200; combo++; killTally++; }
      }
    }
  }
  drawEnemies();
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
