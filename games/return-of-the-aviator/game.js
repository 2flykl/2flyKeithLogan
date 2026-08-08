(()=>{
'use strict';
const canvas=document.getElementById('game'),ctx=canvas.getContext('2d');
const W=1280,H=720, TAU=Math.PI*2;
const overlay=document.getElementById('overlay'),startBtn=document.getElementById('startBtn');
const keys={left:false,right:false,fire:false,special:false};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t,rnd=(a,b)=>a+Math.random()*(b-a);
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
let now=0,last=0,dt=0,paused=false,started=false;

const SONG_URL='https://static.wixstatic.com/mp3/85e419_62dfb4b5acfc4747a02ad9eaeb643f29.mp3';

class AudioEngine{
 constructor(){
   this.audio=new Audio(SONG_URL);
   this.audio.preload='auto';
   this.audio.volume=.82;
   this.audio.crossOrigin='anonymous';
   this.ctx=null; this.master=null; this.ready=false; this.failed=false;
   this.duration=0; this.cues=null; this.lastSceneCue='';
   this.audio.addEventListener('loadedmetadata',()=>{
     this.duration=Number.isFinite(this.audio.duration)?this.audio.duration:0;
     this.ready=true;
     this.buildCues();
   });
   this.audio.addEventListener('canplay',()=>{this.ready=true});
   this.audio.addEventListener('error',()=>{this.failed=true});
 }
 buildCues(){
   const d=this.duration||128;
   // Percent-based cue map keeps the playable ride locked to whatever master is supplied.
   const openingEnd=clamp(d*.075,5.5,9.5);
   this.cues={
     openingEnd,
     diveEnd:Math.max(openingEnd+18,d*.33),
     runwayEnd:Math.max(openingEnd+38,d*.56),
     carEnd:Math.max(openingEnd+62,d*.79),
     bossPeak:Math.max(openingEnd+82,d*.94),
     end:Math.max(openingEnd+92,d*.985)
   };
 }
 async start(){
   try{
     this.audio.currentTime=0;
     await this.audio.play();
     this.ready=true;
   }catch(e){ this.failed=true; }
   try{
     this.ctx=new (window.AudioContext||window.webkitAudioContext)();
     this.master=this.ctx.createGain(); this.master.gain.value=.16; this.master.connect(this.ctx.destination);
   }catch(e){}
   if(!this.cues)this.buildCues();
 }
 time(fallback=0){ return (!this.failed && !this.audio.paused && Number.isFinite(this.audio.currentTime))?this.audio.currentTime:fallback; }
 progress(a,b,fallback=0){ const t=this.time(fallback); return clamp((t-a)/Math.max(.001,b-a),0,1); }
 tick(){}
 pause(){ if(!this.audio.paused)this.audio.pause(); }
 resume(){ if(this.audio.paused && !this.failed)this.audio.play().catch(()=>{}); }
 restart(){ if(!this.failed){this.audio.currentTime=0;this.audio.play().catch(()=>{})} }
 sfx(freq=220,d=.08,type='square',vol=.12){
   if(!this.ctx||!this.master)return;
   const t=this.ctx.currentTime,o=this.ctx.createOscillator(),g=this.ctx.createGain();
   o.type=type; o.frequency.setValueAtTime(freq,t); o.frequency.exponentialRampToValueAtTime(Math.max(30,freq*.65),t+d);
   g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.0001,t+d);
   o.connect(g); g.connect(this.master); o.start(); o.stop(t+d);
 }
}
const audio=new AudioEngine();

class Director{
 constructor(){this.skill=.5;this.pressure=.35;this.recentHits=0;this.spawnClock=0;this.mercy=0;this.safeLane=1;this.lastLane=-1;this.chain=0;}
 update(g,dt){this.recentHits=Math.max(0,this.recentHits-dt*.13);this.mercy=Math.max(0,this.mercy-dt);const accuracy=g.shots?g.hits/g.shots:.45;const health=g.player.hp/5;const streak=clamp(g.combo/18,0,1);const target=clamp(.28+accuracy*.32+health*.18+streak*.22,0,1);this.skill=lerp(this.skill,target,dt*.22);this.pressure=clamp(.22+this.skill*.58-this.recentHits*.33+(g.sceneTime/55)*.1,.15,.88);}
 hit(){this.recentHits+=.65;this.mercy=1.15;}
 interval(){return lerp(1.12,.48,this.pressure)*rnd(.86,1.18)+(this.mercy>0?.28:0)}
 chooseLane(){let lanes=[0,1,2].filter(x=>x!==this.safeLane);let lane=lanes[(Math.random()*lanes.length)|0];if(lane===this.lastLane&&Math.random()<.55)lane=lanes.find(x=>x!==lane)??lane;this.lastLane=lane;this.safeLane=[0,1,2].find(x=>x!==lane&&x!==this.lastLane)??((lane+1)%3);return lane}
 enemyType(){let r=Math.random();if(this.mercy>0)return 'scout';if(r<this.pressure*.18)return 'jammer';if(r<this.pressure*.42)return 'swarm';if(r<this.pressure*.62)return 'shield';return 'scout'}
}

class Particle{constructor(x,y,vx,vy,life,size,color,grav=0){Object.assign(this,{x,y,vx,vy,life,max:life,size,color,grav})}update(dt){this.life-=dt;this.vy+=this.grav*dt;this.x+=this.vx*dt;this.y+=this.vy*dt}draw(){ctx.globalAlpha=clamp(this.life/this.max,0,1);ctx.fillStyle=this.color;ctx.beginPath();ctx.arc(this.x,this.y,this.size*(.5+.5*this.life/this.max),0,TAU);ctx.fill();ctx.globalAlpha=1}}

class Game{
 constructor(){this.reset()}
 reset(){this.scene='intro';this.sceneTime=0;this.totalTime=0;this.score=0;this.combo=0;this.maxCombo=0;this.hits=0;this.shots=0;this.shake=0;this.flash=0;this.transition=0;this.message='';this.messageT=0;this.altitude=18500;this.weapon='WHOLE NOTE';this.weaponSecured=false;this.braced=false;this.director=new Director();this.player={x:W*.5,y:H*.32,vx:0,hp:5,inv:0,tilt:0,flow:0,special:1};this.enemies=[];this.bullets=[];this.enemyBullets=[];this.particles=[];this.obstacles=[];this.stars=[];for(let i=0;i<160;i++)this.stars.push({x:rnd(0,W),y:rnd(0,H),z:rnd(.2,1)});}
 async begin(){this.reset();started=true;overlay.classList.remove('show');await audio.start();this.scene='opening';this.sceneTime=0;this.message='TOO FAST — MUSIC SYNC ONLINE';this.messageT=2.1}
 cut(to,label){this.transition=1;this.nextScene=to;this.transitionLabel=label;this.enemies.length=this.bullets.length=this.enemyBullets.length=this.obstacles.length=0;}
 startScene(s){this.scene=s;this.sceneTime=0;this.player.inv=1.1;this.director.spawnClock=.6;if(s==='skydive'){this.player.x=W*.5;this.player.y=H*.28;this.altitude=18500;this.message='FREEFALL CONTROL ACTIVE';this.messageT=2.2}else if(s==='runway'){this.player.x=W*.5;this.player.y=H*.77;this.message='RUNWAY ESCAPE';this.messageT=2.0}else if(s==='car'){this.player.x=W*.5;this.player.y=H*.78;this.message='VEHICLE LINKED';this.messageT=2.0}else if(s==='boss'){this.message='ALGORITHM AIR BOSS';this.messageT=2.2;this.boss={x:W*.5,y:150,hp:80,max:80,t:0,phase:0}}}
 update(dt){if(paused||!started)return;audio.tick();this.totalTime+=dt;this.sceneTime+=dt;this.messageT=Math.max(0,this.messageT-dt);this.flash=Math.max(0,this.flash-dt*2.5);this.shake=Math.max(0,this.shake-dt*12);this.player.inv=Math.max(0,this.player.inv-dt);this.director.update(this,dt);
 if(this.transition>0){this.transition-=dt*.7;if(this.transition<=0){this.transition=0;this.startScene(this.nextScene)}return}
 if(this.scene==='opening')this.updateOpening(dt);else if(this.scene==='skydive')this.updateSkydive(dt);else if(this.scene==='runway')this.updateRunway(dt);else if(this.scene==='car')this.updateCar(dt);else if(this.scene==='boss')this.updateBoss(dt);else if(this.scene==='ending')this.updateEnding(dt);
 this.updatePlayer(dt);this.updateBullets(dt);this.updateParticles(dt);this.collisions();}
 updatePlayer(dt){let dir=(keys.right?1:0)-(keys.left?1:0);let max=this.scene==='skydive'?420:this.scene==='car'?520:430;let accel=this.scene==='car'?1600:1350;this.player.vx+=dir*accel*dt;this.player.vx*=Math.pow(.0008,dt);this.player.vx=clamp(this.player.vx,-max,max);this.player.x+=this.player.vx*dt;this.player.x=clamp(this.player.x,110,W-110);this.player.tilt=lerp(this.player.tilt,dir*.28+this.player.vx/max*.14,dt*6);this.player.flow=clamp(this.player.flow+dt*(Math.abs(dir)>.2?.008:.018),0,1);
 if(keys.fire){this.fire();keys.fire=false}if(keys.special){this.special();keys.special=false}}
 fire(){if(this.fireCd>0)return;this.fireCd=this.weaponSecured?.11:.22;this.shots++;let spread=this.weaponSecured?[-.08,0,.08]:[0];for(const a of spread)this.bullets.push({x:this.player.x+a*600,y:this.player.y+34,vx:a*260,vy:this.scene==='skydive'?620:-650,r:5,life:1.8,pow:this.weaponSecured?1.15:1});audio.sfx(this.weaponSecured?92:280,.07,'square',.08);for(let i=0;i<4;i++)this.particles.push(new Particle(this.player.x,this.player.y+25,rnd(-60,60),this.scene==='skydive'?rnd(120,240):rnd(-240,-120),.18,rnd(2,5),'#5ed7ff'))}
 special(){if(this.player.special<1)return;this.player.special=0;audio.sfx(58,.55,'sawtooth',.18);this.shake=18;this.flash=.55;for(let i=0;i<42;i++){let a=i/42*TAU;this.particles.push(new Particle(this.player.x,this.player.y,Math.cos(a)*rnd(220,540),Math.sin(a)*rnd(220,540),.8,rnd(2,6),'#67dfff'))}for(const e of this.enemies)e.hp-=3;this.enemyBullets.length=0;setTimeout(()=>{this.player.special=1},3500)}
 updateOpening(dt){
   const t=audio.time(this.sceneTime), end=(audio.cues&&audio.cues.openingEnd)||7.2, p=clamp(t/end,0,1);
   if(p<.42){if(Math.random()<dt*(7+12*p))this.spawnParticle(rnd(W*.2,W*.8),rnd(H*.15,H*.5),'#ff6038')}
   else if(p<.73){this.shake=8+8*p;if(Math.random()<dt*25)this.spawnExplosion(rnd(W*.32,W*.68),rnd(H*.25,H*.48),.3)}
   else if(p<.90){this.flash=.25}
   else this.cut('skydive','THE DIVE')
 }
 updateSkydive(dt){
   this.fireCd=Math.max(0,(this.fireCd||0)-dt);
   const c=audio.cues||{openingEnd:7,diveEnd:40};
   const p=audio.progress(c.openingEnd,c.diveEnd,this.sceneTime+c.openingEnd);
   this.altitude=Math.max(0,18500*(1-p));
   const fallSpeed=260+1050*(.35+.65*p);
   for(const s of this.stars){s.y-=dt*(fallSpeed*s.z);if(s.y<0){s.y=H;s.x=rnd(0,W)}}
   this.director.spawnClock-=dt;
   if(this.director.spawnClock<=0&&p<.89){this.director.spawnClock=this.director.interval();this.spawnSkyEnemy()}
   if(!this.weaponSecured&&p>.78){
     this.weaponSecured=true;this.weapon='808 BOOMER';this.message='W.M.P. SECURED — 808 BOOMER';this.messageT=2.6;this.player.flow=1;this.shake=9;this.flash=.4;
   }
   if(this.weaponSecured&&p>.89&&!this.braced){this.braced=true;this.message='FIRE TO BRACE FOR IMPACT';this.messageT=3.5}
   if(p>=.995){this.shake=22;this.flash=.7;this.cut('runway','RUNWAY ESCAPE')}
   this.updateEnemies(dt,'sky')
 }
 spawnSkyEnemy(){let type=this.director.enemyType(),x=rnd(90,W-90),speed=rnd(180,300)*(1+this.director.pressure*.45);this.enemies.push({type,x,y:H+60,vx:rnd(-35,35),vy:-speed,hp:type==='shield'?3:1,r:type==='swarm'?18:26,t:0,fire:rnd(.5,1.4)})}
 updateRunway(dt){
   this.fireCd=Math.max(0,(this.fireCd||0)-dt);
   const c=audio.cues||{diveEnd:40,runwayEnd:69};
   const p=audio.progress(c.diveEnd,c.runwayEnd,this.sceneTime+c.diveEnd);
   this.director.spawnClock-=dt;
   if(this.director.spawnClock<=0){this.director.spawnClock=this.director.interval()*(.98-.22*p);this.spawnRunwayHazard()}
   if(p>=.995)this.cut('car','VEHICLE PURSUIT');
   this.updateEnemies(dt,'runway');
   for(const o of this.obstacles){o.z-=dt*o.speed;o.y=lerp(210,H+90,1-o.z);o.x=lerp(W*.5,(o.lane-.5)*360+W*.5,1-o.z);o.scale=lerp(.15,1.5,1-o.z)}
   this.obstacles=this.obstacles.filter(o=>o.z>-0.1)
 }
 spawnRunwayHazard(){let lane=this.director.chooseLane(),kind=Math.random()<.22?'laser':'barrier';this.obstacles.push({lane,kind,z:1,speed:rnd(.42,.60)+this.director.pressure*.08,x:0,y:0,scale:1,hit:false})}
 updateCar(dt){
   this.fireCd=Math.max(0,(this.fireCd||0)-dt);
   const c=audio.cues||{runwayEnd:69,carEnd:98};
   const p=audio.progress(c.runwayEnd,c.carEnd,this.sceneTime+c.runwayEnd);
   this.director.spawnClock-=dt;
   if(this.director.spawnClock<=0){this.director.spawnClock=this.director.interval()*(.92-.20*p);this.spawnCarHazard()}
   if(p>=.995)this.cut('boss','FINAL APPROACH');
   this.updateEnemies(dt,'car');
   for(const o of this.obstacles){o.z-=dt*o.speed;o.y=lerp(240,H+110,1-o.z);o.x=lerp(W*.5,(o.lane-.5)*390+W*.5,1-o.z);o.scale=lerp(.12,1.6,1-o.z)}
   this.obstacles=this.obstacles.filter(o=>o.z>-0.1)
 }
 spawnCarHazard(){let lane=this.director.chooseLane();let kind=Math.random()<.35?'pursuer':Math.random()<.55?'mine':'truck';this.obstacles.push({lane,kind,z:1,speed:rnd(.48,.68)+this.director.pressure*.1,x:0,y:0,scale:1,hit:false})}
 updateBoss(dt){
   this.fireCd=Math.max(0,(this.fireCd||0)-dt);
   const c=audio.cues||{carEnd:98,bossPeak:118,end:126};
   const p=audio.progress(c.carEnd,c.end,this.sceneTime+c.carEnd);
   let b=this.boss;b.t+=dt;
   b.x=W*.5+Math.sin(b.t*(.70+.35*p))*320;b.y=145+Math.sin(b.t*1.23)*42;
   const volley=lerp(1.35,.72,p);
   if((b.t%volley)<dt){let ang=Math.atan2(this.player.y-b.y,this.player.x-b.x);for(let k=-1;k<=1;k++)this.enemyBullets.push({x:b.x,y:b.y,vx:Math.cos(ang+k*.14)*330,vy:Math.sin(ang+k*.14)*330,r:8,life:4})}
   if((b.t%lerp(5.4,3.5,p))<dt){this.message='LASER SWEEP — MOVE!';this.messageT=1.1;for(let k=0;k<9;k++)this.enemyBullets.push({x:b.x,y:b.y,vx:(k-4)*65,vy:390,r:7,life:3.2})}
   if(p>.82&&b.hp>14)b.hp-=dt*2.6; // climax assist: prevents a stalled ending while preserving the fight.
   if(b.hp<=0||p>=.995){this.spawnExplosion(b.x,b.y,2.4);this.score+=10000;this.scene='ending';this.sceneTime=0;this.message='ALGORITHM CORE BROKEN';this.messageT=4}
 }
 updateEnding(dt){if(this.sceneTime>8){overlay.querySelector('h1').textContent='MISSION COMPLETE';overlay.querySelector('.pitch').textContent=`Score ${this.score.toLocaleString()} • Max combo x${this.maxCombo} • The signal survives.`;startBtn.textContent='PLAY AGAIN';overlay.classList.add('show');started=false}}
 updateEnemies(dt,mode){for(const e of this.enemies){e.t+=dt;e.x+=e.vx*dt;e.y+=e.vy*dt;e.fire-=dt;if(e.type==='jammer')e.x+=Math.sin(e.t*6)*70*dt;if(e.fire<0&&e.y>80&&e.y<H-120){e.fire=rnd(1.1,2.2);let a=Math.atan2(this.player.y-e.y,this.player.x-e.x);this.enemyBullets.push({x:e.x,y:e.y,vx:Math.cos(a)*260,vy:Math.sin(a)*260,r:6,life:4})}}this.enemies=this.enemies.filter(e=>e.y>-100&&e.y<H+120&&e.hp>0)}
 updateBullets(dt){for(const b of this.bullets){b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt}for(const b of this.enemyBullets){b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt}this.bullets=this.bullets.filter(b=>b.life>0&&b.y>-80&&b.y<H+80);this.enemyBullets=this.enemyBullets.filter(b=>b.life>0);}
 updateParticles(dt){for(const p of this.particles)p.update(dt);this.particles=this.particles.filter(p=>p.life>0)}
 collisions(){for(const b of this.bullets){for(const e of this.enemies){let dx=b.x-e.x,dy=b.y-e.y;if(b.life>0&&e.hp>0&&dx*dx+dy*dy<(e.r+9)**2){b.life=0;e.hp-=b.pow;this.hits++;this.combo++;this.maxCombo=Math.max(this.maxCombo,this.combo);this.score+=100*this.combo;this.spawnExplosion(e.x,e.y,e.hp<=0?.6:.18);if(e.hp<=0)audio.sfx(120,.13,'sawtooth',.08)}}if(this.scene==='boss'){let bo=this.boss,dx=b.x-bo.x,dy=b.y-bo.y;if(b.life>0&&dx*dx+dy*dy<125**2){b.life=0;bo.hp-=b.pow;this.hits++;this.combo++;this.score+=80*this.combo;this.shake=2}}}
 for(const b of this.enemyBullets){let dx=b.x-this.player.x,dy=b.y-this.player.y;if(b.life>0&&dx*dx+dy*dy<26**2){b.life=0;this.damage()}}
 for(const o of this.obstacles){if(!o.hit&&o.z<.11){let laneX=(o.lane-.5)*360+W*.5;if(Math.abs(this.player.x-laneX)<92){o.hit=true;this.damage()}else{this.score+=250;this.combo++;this.player.flow=clamp(this.player.flow+.13,0,1);audio.sfx(520,.04,'sine',.04)}}}}
 damage(){if(this.player.inv>0)return;this.player.hp--;this.player.inv=1.2;this.combo=0;this.shake=14;this.flash=.35;this.director.hit();audio.sfx(70,.25,'sawtooth',.14);if(this.player.hp<=0){this.player.hp=3;this.score=Math.max(0,this.score-1800);this.message='SIGNAL RECOVERED';this.messageT=2.1;this.player.inv=2.2}}
 spawnParticle(x,y,c){this.particles.push(new Particle(x,y,rnd(-100,100),rnd(-80,120),rnd(.2,.6),rnd(2,6),c))}
 spawnExplosion(x,y,p=1){this.shake=Math.max(this.shake,6*p);for(let i=0;i<Math.round(18*p);i++){let a=rnd(0,TAU),s=rnd(80,310)*p;this.particles.push(new Particle(x,y,Math.cos(a)*s,Math.sin(a)*s,rnd(.3,.8)*p,rnd(2,7)*p,Math.random()<.5?'#ff783f':'#ffd35c',60))}}
 draw(){ctx.save();let sx=rnd(-this.shake,this.shake),sy=rnd(-this.shake,this.shake);ctx.translate(sx,sy);if(this.scene==='opening')this.drawOpening();else if(this.scene==='skydive')this.drawSkydive();else if(this.scene==='runway')this.drawRunway();else if(this.scene==='car')this.drawCar();else if(this.scene==='boss')this.drawBoss();else if(this.scene==='ending')this.drawEnding();for(const p of this.particles)p.draw();ctx.restore();this.drawHUD();if(this.transition>0)this.drawTransition();if(this.flash>0){ctx.fillStyle=`rgba(255,255,255,${this.flash*.5})`;ctx.fillRect(0,0,W,H)}}
 bgGradient(a='#07111e',b='#020408'){let g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,a);g.addColorStop(1,b);ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
 drawOpening(){this.bgGradient('#16283b','#05070c');for(let i=0;i<22;i++){ctx.fillStyle=`rgba(220,235,255,${.03+i*.004})`;ctx.beginPath();ctx.ellipse((i*151+this.sceneTime*14)%W,H*.6+i%4*28,120,35,0,0,TAU);ctx.fill()}let t=this.sceneTime;let planeX=W*.5,planeY=H*.42;ctx.save();ctx.translate(planeX,planeY);ctx.scale(1.3,1.3);ctx.fillStyle='#d7e2ec';ctx.beginPath();ctx.moveTo(-145,0);ctx.lineTo(85,-22);ctx.lineTo(155,0);ctx.lineTo(88,21);ctx.closePath();ctx.fill();ctx.fillStyle='#8798a8';ctx.fillRect(-80,-15,135,30);ctx.restore();let count=Math.min(18,Math.floor(t*5));for(let i=0;i<count;i++){let a=i/count*TAU+t*.9,r=170+30*Math.sin(i*3.1+t*2);this.drawBot(planeX+Math.cos(a)*r,planeY+Math.sin(a)*r*.55,12+5*(i%3))}if(t>3.2){ctx.strokeStyle='#ff443d';ctx.lineWidth=3;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(planeX+rnd(-180,180),planeY+rnd(-100,100));ctx.lineTo(planeX+rnd(-50,50),planeY+rnd(-30,30));ctx.stroke()}}this.bigText(t<3?'ALGORITHM SWARM DETECTED':t<4.7?'HULL FAILURE':'JUMP.',H*.14)}
 drawSkydive(){let zoom=this.altitude>10000?1.08:this.altitude>4000?.92:.78;ctx.save();ctx.translate(W/2,H/2);ctx.scale(zoom,zoom);ctx.translate(-W/2,-H/2);this.bgGradient('#163b63','#06111f');for(const s of this.stars){ctx.fillStyle=`rgba(180,225,255,${.18+s.z*.45})`;ctx.fillRect(s.x,s.y,1+s.z*2,10+s.z*35)}for(let i=0;i<8;i++){let y=((i*170+this.totalTime*210)%950)-120;ctx.fillStyle='rgba(230,245,255,.08)';ctx.beginPath();ctx.ellipse((i*237)%W,y,200,45,0,0,TAU);ctx.fill()}for(const e of this.enemies)this.drawBot(e.x,e.y,e.r);for(const b of this.bullets)this.drawNote(b.x,b.y,b.r,'#5ee6ff',true);for(const b of this.enemyBullets)this.drawOrb(b.x,b.y,b.r,'#ff493f');this.drawDiver(this.player.x,this.player.y);if(this.weaponSecured&&this.altitude>500){ctx.strokeStyle='rgba(80,220,255,.35)';ctx.lineWidth=4;ctx.beginPath();ctx.arc(this.player.x,this.player.y,70+Math.sin(this.totalTime*8)*8,0,TAU);ctx.stroke()}ctx.restore();if(this.altitude<2600&&!this.weaponSecured){ctx.fillStyle='rgba(78,211,255,.85)';ctx.font='700 20px Arial';ctx.textAlign='center';ctx.fillText('W.M.P. SIGNAL ↓',W/2,H-80)}}
 drawRunway(){this.bgGradient('#0f1c28','#030508');this.drawPerspectiveRoad('#27313b','#e6edf5');for(let i=0;i<8;i++){let z=((i/8+this.totalTime*.17)%1),y=lerp(225,H,z),xspan=lerp(40,600,z);ctx.fillStyle='rgba(255,50,45,.8)';ctx.fillRect(W/2-xspan,y,6+z*5,4);ctx.fillRect(W/2+xspan,y,6+z*5,4)}for(const o of this.obstacles)this.drawObstacle(o);for(const e of this.enemies)this.drawBot(e.x,e.y,e.r);for(const b of this.bullets)this.drawNote(b.x,b.y,b.r,'#5ee6ff',false);for(const b of this.enemyBullets)this.drawOrb(b.x,b.y,b.r,'#ff493f');this.drawRunner(this.player.x,this.player.y);if(this.sceneTime>7&&this.sceneTime<13)this.drawBossFlyby()}
 drawCar(){this.bgGradient('#061423','#02050a');this.drawPerspectiveRoad('#151d28','#dde7ef');for(let i=0;i<18;i++){let x=(i*113)%W,y=190+(i%4)*35;ctx.fillStyle='rgba(45,130,220,.25)';ctx.fillRect(x,y,3,90)}for(const o of this.obstacles)this.drawObstacle(o);for(const b of this.bullets)this.drawNote(b.x,b.y,b.r,'#64e5ff',false);for(const b of this.enemyBullets)this.drawOrb(b.x,b.y,b.r,'#ff493f');this.drawCarHero(this.player.x,this.player.y)}
 drawBoss(){this.bgGradient('#090c14','#020307');for(let i=0;i<90;i++){let x=(i*137)%W,y=((i*79+this.totalTime*150)%H);ctx.fillStyle='rgba(90,170,255,.12)';ctx.fillRect(x,y,2,25)}let b=this.boss;this.drawAlgorithmBoss(b.x,b.y,1.15);for(const bl of this.bullets)this.drawNote(bl.x,bl.y,bl.r,'#59e9ff',false);for(const bl of this.enemyBullets)this.drawOrb(bl.x,bl.y,bl.r,'#ff493f');this.drawRunner(this.player.x,this.player.y);ctx.fillStyle='rgba(0,0,0,.65)';ctx.fillRect(350,26,580,18);ctx.fillStyle='#ff4038';ctx.fillRect(350,26,580*(b.hp/b.max),18);ctx.strokeStyle='#60758b';ctx.strokeRect(350,26,580,18)}
 drawEnding(){this.bgGradient('#0a2433','#020408');for(let i=0;i<100;i++)this.drawNote((i*93+this.totalTime*80)%W,(i*47)%H,3+(i%3),'rgba(90,220,255,.6)',false);this.bigText('THE SIGNAL SURVIVES',H*.42)}
 drawPerspectiveRoad(road,line){ctx.fillStyle='#0a0e13';ctx.fillRect(0,195,W,H-195);ctx.fillStyle=road;ctx.beginPath();ctx.moveTo(W*.43,190);ctx.lineTo(W*.57,190);ctx.lineTo(W*.93,H);ctx.lineTo(W*.07,H);ctx.closePath();ctx.fill();ctx.strokeStyle=line;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(W*.5,200);ctx.lineTo(W*.5,H);ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.32)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(W*.455,200);ctx.lineTo(W*.28,H);ctx.moveTo(W*.545,200);ctx.lineTo(W*.72,H);ctx.stroke()}
 drawObstacle(o){let x=o.x,y=o.y,s=o.scale;if(o.kind==='barrier'||o.kind==='truck'){ctx.fillStyle=o.kind==='truck'?'#222b34':'#e7e9e9';ctx.fillRect(x-55*s,y-30*s,110*s,60*s);ctx.fillStyle='#ff543c';for(let i=-2;i<=2;i+=2)ctx.fillRect(x+i*18*s,y-30*s,9*s,60*s)}else if(o.kind==='mine'){ctx.fillStyle='#181d24';ctx.beginPath();ctx.arc(x,y,28*s,0,TAU);ctx.fill();ctx.strokeStyle='#ff3d35';ctx.lineWidth=4;ctx.stroke()}else if(o.kind==='pursuer'){ctx.fillStyle='#15191f';ctx.fillRect(x-48*s,y-23*s,96*s,46*s);ctx.fillStyle='#ff3a32';ctx.fillRect(x-33*s,y-14*s,12*s,7*s);ctx.fillRect(x+21*s,y-14*s,12*s,7*s)}else{ctx.strokeStyle='#ff3a32';ctx.lineWidth=8*s;ctx.beginPath();ctx.moveTo(x-60*s,y);ctx.lineTo(x+60*s,y);ctx.stroke()}}
 drawDiver(x,y){ctx.save();ctx.translate(x,y);ctx.rotate(this.player.tilt*.4);ctx.fillStyle='#f2f5f7';ctx.beginPath();ctx.ellipse(0,0,28,52,0,0,TAU);ctx.fill();ctx.fillStyle='#8d5a3d';ctx.beginPath();ctx.arc(0,-46,18,0,TAU);ctx.fill();ctx.fillStyle='#06090d';ctx.fillRect(-16,-51,32,7);ctx.strokeStyle='#f2f5f7';ctx.lineWidth=16;ctx.beginPath();ctx.moveTo(-15,-12);ctx.lineTo(-68,22);ctx.moveTo(15,-12);ctx.lineTo(68,22);ctx.stroke();ctx.strokeStyle='#111820';ctx.lineWidth=18;ctx.beginPath();ctx.moveTo(-8,42);ctx.lineTo(-28,86);ctx.moveTo(8,42);ctx.lineTo(28,86);ctx.stroke();ctx.restore()}
 drawRunner(x,y){ctx.save();ctx.translate(x,y);ctx.rotate(this.player.tilt*.15);ctx.fillStyle='#111720';ctx.fillRect(-26,-28,52,76);ctx.fillStyle='#eef3f6';ctx.fillRect(-31,-70,62,56);ctx.fillStyle='#8d5a3d';ctx.beginPath();ctx.arc(0,-85,17,0,TAU);ctx.fill();ctx.fillStyle='#05080b';ctx.fillRect(-17,-91,34,6);let phase=Math.sin(this.totalTime*15)*24;ctx.strokeStyle='#151a21';ctx.lineWidth=17;ctx.beginPath();ctx.moveTo(-10,42);ctx.lineTo(-23+phase,88);ctx.moveTo(10,42);ctx.lineTo(23-phase,88);ctx.stroke();ctx.restore()}
 drawCarHero(x,y){ctx.save();ctx.translate(x,y);ctx.rotate(this.player.tilt*.08);ctx.fillStyle='#080a0d';ctx.beginPath();ctx.roundRect(-92,-34,184,68,18);ctx.fill();ctx.fillStyle='#111b27';ctx.fillRect(-48,-57,96,34);ctx.fillStyle='#9bc7e8';ctx.fillRect(-35,-52,70,22);ctx.fillStyle='#ff3b30';ctx.fillRect(-77,15,25,8);ctx.fillRect(52,15,25,8);ctx.fillStyle='#dbe7f1';ctx.beginPath();ctx.arc(-60,35,18,0,TAU);ctx.arc(60,35,18,0,TAU);ctx.fill();ctx.fillStyle='#111';ctx.beginPath();ctx.arc(-60,35,9,0,TAU);ctx.arc(60,35,9,0,TAU);ctx.fill();ctx.fillStyle='#57dfff';ctx.font='bold 18px Arial';ctx.textAlign='center';ctx.fillText('2FLY',0,10);ctx.restore()}
 drawBot(x,y,r){ctx.save();ctx.translate(x,y);ctx.fillStyle='#171c24';ctx.strokeStyle='#596473';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.stroke();ctx.strokeStyle='#3b4651';for(let i=0;i<6;i++){let a=i/6*TAU;ctx.beginPath();ctx.moveTo(Math.cos(a)*r*.6,Math.sin(a)*r*.6);ctx.lineTo(Math.cos(a)*r*1.55,Math.sin(a)*r*1.55);ctx.stroke()}ctx.fillStyle='#ff3a32';ctx.shadowColor='#ff3a32';ctx.shadowBlur=16;ctx.beginPath();ctx.arc(0,0,r*.35,0,TAU);ctx.fill();ctx.shadowBlur=0;ctx.restore()}
 drawAlgorithmBoss(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);for(let i=0;i<8;i++){let a=i/8*TAU+this.totalTime*.15;ctx.strokeStyle='#252d37';ctx.lineWidth=22;ctx.beginPath();ctx.moveTo(Math.cos(a)*55,Math.sin(a)*55);ctx.lineTo(Math.cos(a)*125,Math.sin(a)*125);ctx.stroke();this.drawBot(Math.cos(a)*130,Math.sin(a)*130,18)}ctx.fillStyle='#131922';ctx.strokeStyle='#556170';ctx.lineWidth=6;ctx.beginPath();ctx.roundRect(-78,-78,156,156,28);ctx.fill();ctx.stroke();ctx.strokeStyle='#ff3b34';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(-35,-35);ctx.lineTo(35,35);ctx.moveTo(35,-35);ctx.lineTo(-35,35);ctx.stroke();ctx.restore()}
 drawBossFlyby(){let t=(this.sceneTime-7)/6,x=lerp(W+260,-300,t),y=170+Math.sin(t*Math.PI)*45;ctx.save();ctx.translate(x,y);ctx.scale(.6,.6);this.drawAlgorithmBoss(0,0,1);ctx.restore()}
 drawNote(x,y,r,c,down){ctx.fillStyle=c;ctx.font=`bold ${Math.max(18,r*5)}px Georgia`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(Math.random()<.25?'♫':'♪',x,y)}
 drawOrb(x,y,r,c){ctx.fillStyle=c;ctx.shadowColor=c;ctx.shadowBlur=12;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.shadowBlur=0}
 bigText(s,y){ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(0,y-46,W,68);ctx.fillStyle='#f5f8fb';ctx.font='900 34px Arial';ctx.textAlign='center';ctx.fillText(s,W/2,y);ctx.fillStyle='#ff4038';ctx.fillRect(W/2-170,y+11,340,3)}
 drawHUD(){if(!started)return;ctx.save();ctx.fillStyle='rgba(3,7,12,.62)';ctx.fillRect(20,18,360,80);ctx.fillStyle='#fff';ctx.font='800 17px Arial';ctx.textAlign='left';ctx.fillText('RETURN OF THE AVIATOR',36,42);ctx.fillStyle='#69dfff';ctx.font='700 13px Arial';ctx.fillText(this.weapon,36,65);
ctx.fillStyle=audio.failed?'#ff665f':'#85f0c4';ctx.font='700 11px Arial';ctx.fillText(audio.failed?'MUSIC STREAM FALLBACK':'♫ TOO FAST • SYNCED',185,65);ctx.fillStyle='#a8b7c7';ctx.fillText(`SCORE ${String(this.score).padStart(7,'0')}   COMBO x${this.combo}`,36,86);for(let i=0;i<5;i++){ctx.fillStyle=i<this.player.hp?'#ff4a43':'#27313b';ctx.fillRect(272+i*17,53,12,8)}if(this.scene==='skydive'){ctx.textAlign='right';ctx.fillStyle='#d9e9f9';ctx.font='800 22px Arial';ctx.fillText(`${Math.round(this.altitude).toLocaleString()} FT`,W-34,45);ctx.font='12px Arial';ctx.fillStyle='#8ca0b5';ctx.fillText('ALTITUDE',W-34,63)}ctx.fillStyle='rgba(255,255,255,.13)';ctx.fillRect(W-246,H-38,210,8);ctx.fillStyle='#5be6ff';ctx.fillRect(W-246,H-38,210*this.player.flow,8);ctx.fillStyle='#a8b7c7';ctx.font='11px Arial';ctx.textAlign='left';ctx.fillText('FLOW',W-246,H-47);if(this.messageT>0){ctx.globalAlpha=clamp(this.messageT,.2,1);ctx.fillStyle='rgba(0,0,0,.72)';ctx.fillRect(W*.29,H*.13,W*.42,54);ctx.strokeStyle='#4a8bc8';ctx.strokeRect(W*.29,H*.13,W*.42,54);ctx.fillStyle='#fff';ctx.font='800 21px Arial';ctx.textAlign='center';ctx.fillText(this.message,W*.5,H*.13+34);ctx.globalAlpha=1}ctx.restore()}
 drawTransition(){let p=1-this.transition;ctx.fillStyle=`rgba(0,0,0,${clamp(1-Math.abs(.5-p)*2,0,.95)})`;ctx.fillRect(0,0,W,H);let z=1+Math.sin(Math.PI*p)*.3;ctx.save();ctx.translate(W/2,H/2);ctx.scale(z,z);ctx.translate(-W/2,-H/2);ctx.fillStyle='#fff';ctx.font='900 38px Arial';ctx.textAlign='center';ctx.fillText(this.transitionLabel||'',W/2,H/2);ctx.fillStyle='#ff4038';ctx.fillRect(W/2-130,H/2+18,260,3);ctx.restore()}
}

const game=new Game();
function loop(t){now=t/1000;dt=Math.min(.033,now-last||.016);last=now;if(!paused)game.update(dt);game.draw();requestAnimationFrame(loop)}requestAnimationFrame(loop);
startBtn.addEventListener('click',()=>game.begin());
window.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();if(e.code==='ArrowLeft'||e.code==='KeyA')keys.left=true;if(e.code==='ArrowRight'||e.code==='KeyD')keys.right=true;if(e.code==='Space')keys.fire=true;if(e.code==='ShiftLeft'||e.code==='ShiftRight')keys.special=true;if(e.code==='KeyP'){paused=!paused;paused?audio.pause():audio.resume()}});
window.addEventListener('keyup',e=>{if(e.code==='ArrowLeft'||e.code==='KeyA')keys.left=false;if(e.code==='ArrowRight'||e.code==='KeyD')keys.right=false});
document.querySelectorAll('#touch button').forEach(b=>{let k=b.dataset.key;const down=e=>{e.preventDefault();if(k==='left'||k==='right')keys[k]=true;else if(k==='fire')keys.fire=true};const up=e=>{e.preventDefault();if(k==='left'||k==='right')keys[k]=false};b.addEventListener('pointerdown',down);b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up)});
})();