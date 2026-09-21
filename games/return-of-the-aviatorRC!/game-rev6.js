(()=>{
'use strict';
const canvas=document.getElementById('game'),ctx=canvas.getContext('2d',{alpha:false});
const W=canvas.width,H=canvas.height;
const fatal=document.getElementById('fatal');
window.addEventListener('error',e=>{fatal.style.display='block';fatal.textContent='GAME ERROR: '+e.message;});
window.addEventListener('unhandledrejection',e=>{fatal.style.display='block';fatal.textContent='AUDIO/ASYNC ERROR: '+String(e.reason||'unknown');});

const SONG='https://static.wixstatic.com/mp3/85e419_62dfb4b5acfc4747a02ad9eaeb643f29.mp3';
const A='assets/production/',B='assets/backgrounds/';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rand=(a,b)=>a+Math.random()*(b-a);

const manifest={
 sky:B+'sky.jpg', runway:B+'runway.jpg', runwayCity:B+'runway_city.jpg', road:B+'road.jpg', city:B+'city.jpg',
 bossStorm:B+'boss_storm.jpg', bossArena:B+'boss_arena.jpg', clouds:B+'cloud_layer.png', rain:B+'rain.png',
 planeIdle:A+'plane_idle.png', planeBank:A+'plane_bank.png', planeBurn:A+'plane_burn.png', planeExplode:A+'plane_explode.png',
 piano:A+'v5_hero_car.png', pianoBoost:A+'v5_hero_car_boost.png',
 boss:A+'algorithm_boss.png', explosion:A+'explosion.png',
 bots:[
  A+'bot_surveillance_orb.png',A+'bot_tracking_orb.png',A+'bot_interceptor.png',A+'bot_censorship_bot.png',
  A+'bot_firewall_sentinel.png',A+'bot_data_miner.png',A+'bot_corrupted_jammer.png',A+'bot_heavy_assault.png',
  A+'bot_manipulator.png',A+'bot_shield_projector.png'
 ],
 hero:{
  idle:[0,1,2,3].map(i=>A+`v5_hero_idle_${i}.png`),
  run:[0,1,2,3].map(i=>A+`v5_hero_run_${i}.png`),
  dive:[0,1,2,3].map(i=>A+`v5_hero_dive_${i}.png`),
  fire:[0,1,2,3].map(i=>A+`v5_hero_fire_${i}.png`),
  victory:[0,1,2].map(i=>A+`v5_hero_victory_${i}.png`)
 }
};
const imgs={};
function loadImage(src){return new Promise((res,rej)=>{const im=new Image();im.onload=()=>res(im);im.onerror=()=>rej(new Error('Missing image: '+src));im.src=src;});}
async function loadAll(){
 const flat=[];
 for(const [k,v] of Object.entries(manifest)){
  if(typeof v==='string')flat.push([k,v]);
  else if(Array.isArray(v))v.forEach((s,i)=>flat.push([`${k}_${i}`,s]));
  else Object.entries(v).forEach(([state,arr])=>arr.forEach((s,i)=>flat.push([`hero_${state}_${i}`,s])));
 }
 const results=await Promise.allSettled(flat.map(async ([k,s])=>[k,await loadImage(s)]));
 results.forEach((r,i)=>{if(r.status==='fulfilled')imgs[r.value[0]]=r.value[1];});
 return results.filter(r=>r.status==='rejected').length;
}

const keys={};
addEventListener('keydown',e=>{keys[e.code]=true;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();if(e.code==='F2')debug=!debug;tryAudio();});
addEventListener('keyup',e=>keys[e.code]=false);
canvas.addEventListener('pointerdown',()=>tryAudio());

let started=false,scene='opening',clock=0,last=0,score=0,combo=0,hp=5,debug=false;
let audio=null,audioStatus='READY',audioTried=false;
let hero={x:W*.5,y:H*.7,state:'idle',frame:0,frameT:0,jump:0,jumpV:0};
let plane={x:W*.5,y:H*.38,state:'idle'};
let vehicle={x:W*.5,y:H*.74};
let boss={x:W*.5,y:180,hp:120,max:120};
let enemies=[],shots=[],enemyShots=[],fx=[];
let spawnT=.8,fireT=0,specialT=0,escapeTaps=0,turnBack=false,floorPhase=0;
let scroll={sky:0,runway:0,road:0,boss:0,side:0};
const cue={opening:8.2,dive:43.5,runway:74.0,car:102.0,bossEnd:126.0};

function tryAudio(){
 if(!started)return;
 if(!audio){audio=new Audio(SONG);audio.preload='auto';audio.volume=.85;audio.loop=false;audio.playbackRate=1;}
 if(!audio.paused)return;
 audioTried=true;
 audio.play().then(()=>{audioStatus='PLAYING';}).catch(()=>{audioStatus='CLICK / KEY TO RETRY';});
}
function reset(){
 scene='opening';clock=0;score=0;combo=0;hp=5;escapeTaps=0;turnBack=false;floorPhase=0;
 hero={x:W*.5,y:H*.7,state:'idle',frame:0,frameT:0,jump:0,jumpV:0};
 plane={x:W*.5,y:H*.38,state:'idle'};vehicle={x:W*.5,y:H*.74};boss={x:W*.5,y:180,hp:120,max:120};
 enemies=[];shots=[];enemyShots=[];fx=[];spawnT=.5;fireT=0;specialT=0;scroll={sky:0,runway:0,road:0,boss:0,side:0};
 if(audio){audio.pause();try{audio.currentTime=0}catch(e){}}
 audioStatus='STARTING…';
}
function start(){
 reset();started=true;document.getElementById('start-overlay').classList.add('hidden');tryAudio();last=performance.now();requestAnimationFrame(loop);
}

function drawCover(im,x,y,w,h,offX=0,offY=0){
 if(!im)return;
 const r=Math.max(w/im.width,h/im.height),sw=w/r,sh=h/r,sx=(im.width-sw)/2+offX,sy=(im.height-sh)/2+offY;
 ctx.drawImage(im,sx,sy,sw,sh,x,y,w,h);
}
function drawScrolling(im,offset,dir='y',alpha=1){
 if(!im)return;ctx.save();ctx.globalAlpha=alpha;
 if(dir==='y'){
  const o=((offset%H)+H)%H;drawCover(im,0,o-H,W,H);drawCover(im,0,o,W,H);
 }else{
  const o=((offset%W)+W)%W;drawCover(im,o-W,0,W,H);drawCover(im,o,0,W,H);
 }
 ctx.restore();
}
function drawSprite(im,x,y,targetH,widthFactor=1,flip=false,alpha=1){
 if(!im)return;
 const h=targetH,w=(im.width/im.height)*h*widthFactor;
 ctx.save();ctx.globalAlpha=alpha;ctx.translate(x,y);if(flip)ctx.scale(-1,1);ctx.drawImage(im,-w/2,-h/2,w,h);ctx.restore();
 return {w,h};
}
function heroImg(){
 const arr=manifest.hero[hero.state]||manifest.hero.idle;
 const idx=Math.floor(hero.frame)%arr.length;
 return imgs[`hero_${hero.state}_${idx}`]||imgs.hero_idle_0;
}
function animateHero(dt){
 hero.frameT+=dt;const rate=hero.state==='run'?.09:hero.state==='dive'?.11:.14;
 if(hero.frameT>=rate){hero.frameT=0;hero.frame++;}
}

const botNames=['SURVEILLANCE','TRACKING','INTERRUPTION','CENSORSHIP','FIREWALL','DATA MINER','JAMMER','AMPLIFICATION','MANIPULATION','SHIELD'];
function spawnEnemy(){
 if(enemies.length>=6)return;
 const i=Math.floor(Math.random()*manifest.bots.length);
 const sceneY=scene==='dive'?H+110:rand(130,300);
 enemies.push({x:rand(130,1150),y:sceneY,vx:rand(-40,40),vy:scene==='dive'?-rand(110,170):rand(25,55),img:i,hp:i===7?5:2,label:botNames[i],shoot:([2,3,7].includes(i)),cool:rand(3.5,5.5),age:0});
}
function updateEnemies(dt){
 spawnT-=dt;if(spawnT<=0){spawnEnemy();spawnT=scene==='opening'?rand(1.1,1.6):rand(.85,1.35);}
 const target=scene==='car'?vehicle:hero;
 enemies.forEach(e=>{
  e.age+=dt;e.cool-=dt;
  if(e.img===1){e.x+=(target.x-e.x)*dt*.18;} else if(e.img===2){e.x+=Math.sin(e.age*3)*95*dt;} else e.x+=e.vx*dt;
  e.y+=e.vy*dt;
  if(e.shoot&&e.cool<=0&&enemyShots.length<4){e.cool=rand(4.2,6.0);const dx=target.x-e.x,dy=target.y-e.y,l=Math.hypot(dx,dy)||1;enemyShots.push({x:e.x,y:e.y,vx:dx/l*165,vy:dy/l*165,life:4});}
 });
 enemies=enemies.filter(e=>e.y>-180&&e.y<H+180&&e.x>-180&&e.x<W+180&&e.hp>0);
 enemyShots.forEach(s=>{s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;});
 enemyShots=enemyShots.filter(s=>s.life>0&&s.x>-50&&s.x<W+50&&s.y>-50&&s.y<H+50);
}
function fire(){
 if(fireT>0||scene==='opening')return;fireT=scene==='dive'?.16:.23;
 const src=scene==='car'?vehicle:hero;
 const heavy=clock>cue.dive*.72;
 const count=heavy?3:1;
 for(let i=0;i<count;i++){
  const spread=(i-(count-1)/2)*45;
  if(scene==='dive')shots.push({x:src.x,y:src.y+30,vx:spread,vy:620,life:1.7,pow:heavy?1.2:1});
  else shots.push({x:src.x,y:src.y-40,vx:spread,vy:-650,life:1.7,pow:heavy?1.2:1});
 }
}
function updateCombat(dt){
 if((keys.Space)&&fireT<=0)fire();fireT=Math.max(0,fireT-dt);specialT=Math.max(0,specialT-dt);
 shots.forEach(s=>{s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;});
 for(const s of shots){
  for(const e of enemies){
   if(s.life<=0||e.hp<=0)continue;
   if(Math.hypot(s.x-e.x,s.y-e.y)<60){s.life=0;e.hp-=s.pow;score+=150;combo++;if(e.hp<=0)fx.push({x:e.x,y:e.y,t:.35});}
  }
  if(scene==='boss'&&s.life>0&&Math.hypot(s.x-boss.x,s.y-boss.y)<115){s.life=0;boss.hp-=s.pow;}
 }
 shots=shots.filter(s=>s.life>0&&s.y>-100&&s.y<H+100);
 const target=scene==='car'?vehicle:hero;
 for(const s of enemyShots){
  if(s.life>0&&Math.hypot(s.x-target.x,s.y-target.y)<35){s.life=0;hp=Math.max(1,hp-1);combo=0;}
 }
 if(keys.ShiftLeft&&specialT<=0){specialT=3.5;enemyShots=[];enemies.forEach(e=>e.hp-=1);}
}

function drawEnemy(e){
 const im=imgs[`bots_${e.img}`];drawSprite(im,e.x,e.y,e.img===7?185:150,.98,false,1);
 ctx.font='700 11px monospace';ctx.textAlign='center';ctx.fillStyle='#77e5ff';ctx.fillText(e.label,e.x,e.y-92);
}
function drawHUD(){
 ctx.fillStyle='rgba(2,7,12,.84)';ctx.fillRect(25,18,445,108);
 ctx.fillStyle='#fff';ctx.font='900 25px Arial';ctx.textAlign='left';ctx.fillText('RETURN OF THE AVIATOR',38,48);
 ctx.fillStyle='#65ddff';ctx.font='700 15px Arial';ctx.fillText(clock>32?'808 BOOMER // BASS PRESSURE':'TONEARM // WHOLE NOTE',38,79);
 ctx.fillStyle=audioStatus==='PLAYING'?'#86efc5':'#ffb06b';ctx.font='700 13px Arial';ctx.fillText('♫ TOO FAST • '+audioStatus,260,79);
 ctx.fillStyle='#a6b6c5';ctx.font='700 13px Arial';ctx.fillText(`SCORE ${String(Math.floor(score)).padStart(7,'0')}   COMBO x${combo}`,38,106);
 for(let i=0;i<5;i++){ctx.fillStyle=i<hp?'#ff5148':'#26333f';ctx.fillRect(367+i*17,91,12,8);}
 if(scene==='boss'){ctx.fillStyle='rgba(0,0,0,.7)';ctx.fillRect(350,18,580,14);ctx.fillStyle='#ff4d44';ctx.fillRect(350,18,580*clamp(boss.hp/boss.max,0,1),14);}
 if(debug){ctx.fillStyle='rgba(0,0,0,.75)';ctx.fillRect(1040,20,220,110);ctx.fillStyle='#8be7ff';ctx.font='12px monospace';ctx.fillText(`SCENE ${scene}`,1055,42);ctx.fillText(`CLOCK ${clock.toFixed(1)}`,1055,60);ctx.fillText(`BOTS ${enemies.length}`,1055,78);ctx.fillText(`ENEMY SHOTS ${enemyShots.length}`,1055,96);ctx.fillText(`AUDIO ${audioStatus}`,1055,114);}
}
function drawProjectiles(){
 ctx.fillStyle='#6be8ff';shots.forEach(s=>{ctx.beginPath();ctx.arc(s.x,s.y,6,0,Math.PI*2);ctx.fill();});
 ctx.fillStyle='#ff5147';enemyShots.forEach(s=>{ctx.beginPath();ctx.arc(s.x,s.y,5,0,Math.PI*2);ctx.fill();});
 fx.forEach(f=>{ctx.strokeStyle=`rgba(105,231,255,${f.t/.35})`;ctx.lineWidth=4;ctx.beginPath();ctx.arc(f.x,f.y,(1-f.t/.35)*60+10,0,Math.PI*2);ctx.stroke();});
}
function updateFx(dt){fx.forEach(f=>f.t-=dt);fx=fx.filter(f=>f.t>0);}

function sceneOpening(dt){
 scroll.sky+=24*dt;drawScrolling(imgs.sky,scroll.sky,'y');drawScrolling(imgs.clouds,scroll.sky*1.7,'y',.18);
 const p=clock/cue.opening;
 let planeIm=imgs.planeIdle;
 if(p>.35)planeIm=imgs.planeBank;if(p>.62)planeIm=imgs.planeBurn;if(p>.84)planeIm=imgs.planeExplode;
 plane.x=W*.52+Math.sin(clock*1.2)*30;plane.y=H*.36+Math.sin(clock*2)*10;
 drawSprite(planeIm,plane.x,plane.y,p>.84?230:190,1);
 updateEnemies(dt);enemies.forEach(drawEnemy);drawProjectiles();
 if(keys.KeyW||keys.ArrowUp){if(!keys._escLatch){escapeTaps++;keys._escLatch=true;}}else keys._escLatch=false;
 ctx.fillStyle='rgba(0,0,0,.60)';ctx.fillRect(W/2-185,H-90,370,40);ctx.fillStyle='#fff';ctx.font='900 18px Arial';ctx.textAlign='center';ctx.fillText('TAP ↑ / W — ESCAPE THE PLANE',W/2,H-64);
 if(p>.91){
  hero.state='dive';hero.x=W*.52;hero.y=H*.26+(p-.91)/.09*175;drawSprite(heroImg(),hero.x,hero.y,150,.72);
 }
 if(p>.985|| (p>.82&&escapeTaps>=5)){scene='dive';hero.x=W*.5;hero.y=180;enemies=[];enemyShots=[];}
}
function sceneDive(dt){
 scroll.sky-=185*dt;drawScrolling(imgs.sky,scroll.sky,'y');drawScrolling(imgs.clouds,scroll.sky*1.45,'y',.18);
 hero.state='dive';animateHero(dt);
 hero.x=clamp(hero.x+((keys.ArrowRight||keys.KeyD?1:0)-(keys.ArrowLeft||keys.KeyA?1:0))*360*dt,100,1180);
 hero.y=clamp(hero.y+((keys.ArrowDown||keys.KeyS?1:0)-(keys.ArrowUp||keys.KeyW?1:0))*300*dt,100,610);
 drawSprite(heroImg(),hero.x,hero.y,190,.72);
 updateEnemies(dt);updateCombat(dt);enemies.forEach(drawEnemy);drawProjectiles();
 if(clock>=cue.dive){scene='runway';hero.x=W*.5;hero.y=H*.78;enemies=[];enemyShots=[];turnBack=false;}
}
function sceneRunway(dt){
 const local=(clock-cue.dive)/(cue.runway-cue.dive);
 if(local>.5)turnBack=true;
 scroll.runway+=(turnBack?-260:330)*dt;drawScrolling(imgs.runway,scroll.runway,'y');drawScrolling(imgs.runwayCity,scroll.runway*.35,'y',.18);
 hero.state='run';animateHero(dt);
 hero.x=clamp(hero.x+((keys.ArrowRight||keys.KeyD?1:0)-(keys.ArrowLeft||keys.KeyA?1:0))*365*dt,130,1150);
 if((keys.ArrowUp||keys.KeyW)&&hero.jump===0){hero.jumpV=-620;hero.jump=-1;}if(hero.jump!==0){hero.jumpV+=1500*dt;hero.jump+=hero.jumpV*dt;if(hero.jump>=0){hero.jump=0;hero.jumpV=0;}}
 const h=turnBack?lerp(125,215,clamp((local-.5)/.5,0,1)):lerp(205,115,clamp(local/.5,0,1));
 hero.y=(turnBack?H*.79:lerp(H*.79,H*.48,clamp(local/.5,0,1)))+hero.jump;
 drawSprite(heroImg(),hero.x,hero.y,h,.72);
 if(turnBack){const q=clamp((local-.5)/.5,0,1);drawSprite(imgs.boss,W/2,165+q*85,90+q*q*440,1);}
 updateEnemies(dt);updateCombat(dt);enemies.forEach(drawEnemy);drawProjectiles();
 if(clock>=cue.runway){scene='car';vehicle.x=W*.5;vehicle.y=H*.75;enemies=[];enemyShots=[];}
}
function sceneCar(dt){
 scroll.road+=500*dt;scroll.side+=110*dt;drawScrolling(imgs.road,scroll.road,'y');drawScrolling(imgs.city,scroll.side,'y',.22);
 vehicle.x=clamp(vehicle.x+((keys.ArrowRight||keys.KeyD?1:0)-(keys.ArrowLeft||keys.KeyA?1:0))*420*dt,130,1150);
 vehicle.y=clamp(vehicle.y+((keys.ArrowDown||keys.KeyS?1:0)-(keys.ArrowUp||keys.KeyW?1:0))*230*dt,H*.48,H*.86);
 drawSprite(imgs.piano,vehicle.x,vehicle.y,155,1);
 updateEnemies(dt);updateCombat(dt);enemies.forEach(drawEnemy);drawProjectiles();
 if(clock>=cue.car){scene='boss';hero.x=W*.5;hero.y=H*.79;enemies=[];enemyShots=[];}
}
function sceneBoss(dt){
 scroll.boss+=floorPhase?230*dt:60*dt;drawScrolling(imgs.bossStorm,scroll.boss,'y');drawScrolling(imgs.bossArena,scroll.boss*.55,'y',.20);
 hero.state='fire';animateHero(dt);hero.x=clamp(hero.x+((keys.ArrowRight||keys.KeyD?1:0)-(keys.ArrowLeft||keys.KeyA?1:0))*350*dt,120,1160);
 if((keys.ArrowUp||keys.KeyW)&&hero.jump===0){hero.jumpV=-600;hero.jump=-1;}if(hero.jump!==0){hero.jumpV+=1500*dt;hero.jump+=hero.jumpV*dt;if(hero.jump>=0){hero.jump=0;hero.jumpV=0;}}
 hero.y=H*.79+hero.jump;drawSprite(heroImg(),hero.x,hero.y,205,.72);
 boss.x=W/2+Math.sin(clock*.7)*220;boss.y=185+Math.sin(clock*1.1)*25;drawSprite(imgs.boss,boss.x,boss.y,310+Math.sin(clock*.45)*45,1);
 if(1-boss.hp/boss.max>.33)floorPhase=1;
 updateEnemies(dt);updateCombat(dt);enemies.forEach(drawEnemy);drawProjectiles();
 if(boss.hp<=0||clock>=cue.bossEnd){scene='complete';}
}
function sceneComplete(dt){
 drawScrolling(imgs.bossStorm,scroll.boss,'y');hero.state='victory';animateHero(dt);drawSprite(heroImg(),W/2,H*.52,220,.72);
 ctx.fillStyle='rgba(0,0,0,.58)';ctx.fillRect(0,0,W,H);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font='900 54px Arial';ctx.fillText('THE SIGNAL SURVIVES.',W/2,H*.28);
 ctx.fillStyle='#75e5ff';ctx.font='700 20px Arial';ctx.fillText('AN ALGORITHM CAN PREDICT A CHOICE. IT CANNOT OWN ONE.',W/2,H*.35);
}
function loop(now){
 if(!started)return;
 let dt=Math.min(.033,(now-last)/1000||0);last=now;clock+=dt;
 ctx.clearRect(0,0,W,H);
 if(scene==='opening')sceneOpening(dt);else if(scene==='dive')sceneDive(dt);else if(scene==='runway')sceneRunway(dt);else if(scene==='car')sceneCar(dt);else if(scene==='boss')sceneBoss(dt);else sceneComplete(dt);
 updateFx(dt);drawHUD();
 requestAnimationFrame(loop);
}

loadAll().then(missing=>{
 document.getElementById('start').textContent=missing?'START (SOME ART MISSING)':'START EXPERIENCE';
 document.getElementById('start').disabled=false;
}).catch(err=>{fatal.style.display='block';fatal.textContent='LOAD ERROR: '+err.message;});
document.getElementById('start').addEventListener('click',start);
})();