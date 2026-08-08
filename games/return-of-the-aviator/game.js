(()=>{
'use strict';

const canvas=document.getElementById('game'),ctx=canvas.getContext('2d');
const overlay=document.getElementById('overlay'),startBtn=document.getElementById('startBtn');
const W=1280,H=720,TAU=Math.PI*2;
const SONG_URL='https://static.wixstatic.com/mp3/85e419_62dfb4b5acfc4747a02ad9eaeb643f29.mp3';
const keys={left:false,right:false,up:false,fire:false,special:false};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const rnd=(a,b)=>a+Math.random()*(b-a);
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
let started=false,paused=false,last=0;

class AudioEngine{
  constructor(){
    this.audio=new Audio(SONG_URL);
    this.audio.preload='auto'; this.audio.volume=.84; this.audio.crossOrigin='anonymous';
    this.failed=false; this.duration=0; this.cues=null; this.ctx=null; this.master=null;
    this.audio.addEventListener('loadedmetadata',()=>{this.duration=this.audio.duration||128;this.buildCues()});
    this.audio.addEventListener('error',()=>{this.failed=true;this.buildCues()});
  }
  buildCues(){
    const d=this.duration||128, openingEnd=clamp(d*.075,5.8,9.2);
    this.cues={openingEnd,diveEnd:Math.max(openingEnd+20,d*.34),runwayEnd:Math.max(openingEnd+43,d*.58),carEnd:Math.max(openingEnd+67,d*.80),end:Math.max(openingEnd+94,d*.985)};
  }
  async start(){
    this.audio.currentTime=0;
    try{await this.audio.play()}catch(e){this.failed=true}
    if(!this.cues)this.buildCues();
    try{
      this.ctx=new (window.AudioContext||window.webkitAudioContext)();
      this.master=this.ctx.createGain();this.master.gain.value=.14;this.master.connect(this.ctx.destination);
    }catch(e){}
  }
  time(fallback=0){return !this.failed&&Number.isFinite(this.audio.currentTime)?this.audio.currentTime:fallback}
  progress(a,b,fallback){return clamp((this.time(fallback)-a)/Math.max(.001,b-a),0,1)}
  pause(){this.audio.pause()}
  resume(){if(!this.failed)this.audio.play().catch(()=>{})}
  sfx(freq=220,d=.07,type='square',vol=.1){
    if(!this.ctx||!this.master)return;
    const t=this.ctx.currentTime,o=this.ctx.createOscillator(),g=this.ctx.createGain();
    o.type=type;o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(Math.max(35,freq*.62),t+d);
    g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);
    o.connect(g);g.connect(this.master);o.start();o.stop(t+d+.02);
  }
}
const audio=new AudioEngine();

class Director{
  constructor(){this.skill=.45;this.pressure=.30;this.recentHits=0;this.mercy=0;this.spawnClock=.5;this.lastLane=-1}
  update(g,dt){
    this.recentHits=Math.max(0,this.recentHits-dt*.18);this.mercy=Math.max(0,this.mercy-dt);
    const accuracy=g.shots?g.hits/g.shots:.45,health=g.player.hp/5,streak=clamp(g.combo/15,0,1);
    const target=clamp(.22+accuracy*.34+health*.18+streak*.22,0,1);
    this.skill=lerp(this.skill,target,dt*.18);
    this.pressure=clamp(.20+this.skill*.58-this.recentHits*.31,.14,.84);
  }
  hit(){this.recentHits+=.7;this.mercy=1.35}
  interval(){return lerp(1.18,.52,this.pressure)*rnd(.88,1.18)+(this.mercy>0?.35:0)}
  chooseLane(){
    const options=[0,1,2].filter(x=>x!==this.lastLane || Math.random()>.55);
    const lane=options[(Math.random()*options.length)|0];this.lastLane=lane;return lane;
  }
}
class Particle{
  constructor(x,y,vx,vy,life,size,color,grav=0){Object.assign(this,{x,y,vx,vy,life,max:life,size,color,grav})}
  update(dt){this.life-=dt;this.vy+=this.grav*dt;this.x+=this.vx*dt;this.y+=this.vy*dt}
  draw(){ctx.globalAlpha=clamp(this.life/this.max,0,1);ctx.fillStyle=this.color;ctx.beginPath();ctx.arc(this.x,this.y,this.size,0,TAU);ctx.fill();ctx.globalAlpha=1}
}

class Game{
  constructor(){this.reset()}
  reset(){
    this.scene='opening';this.sceneTime=0;this.totalTime=0;this.transition=0;this.nextScene='';this.transitionLabel='';
    this.score=0;this.combo=0;this.maxCombo=0;this.shots=0;this.hits=0;this.shake=0;this.flash=0;
    this.weapon='TONEARM';this.weaponSecured=false;this.altitude=18500;this.message='';this.messageT=0;
    this.player={x:W*.5,y:H*.35,vx:0,vy:0,jumpY:0,jumping:false,hp:5,inv:0,tilt:0,flow:0,special:1};
    this.enemies=[];this.bullets=[];this.enemyBullets=[];this.obstacles=[];this.particles=[];
    this.director=new Director();this.fireCd=0;
    this.cutsceneTaps=0;this.jumpCommitted=false;
    this.runwayReverse=false;this.roadScroll=0;this.roadTurn=0;this.roadTurnTarget=0;
    this.boss=null;this.bossArenaPhase=0;this.floorBreak=0;this.dropY=0;
  }
  async begin(){
    this.reset();started=true;overlay.classList.remove('show');await audio.start();
    this.message='PLANE UNDER ATTACK';this.messageT=1.7;
  }
  sceneStart(s){
    this.scene=s;this.sceneTime=0;this.enemies=[];this.enemyBullets=[];this.obstacles=[];this.bullets=[];
    this.player.inv=1.2;this.player.jumpY=0;this.player.vy=0;this.player.jumping=false;this.director.spawnClock=.45;
    if(s==='skydive'){this.player.x=W*.5;this.player.y=H*.32;this.message='FREEFALL CONTROL ACTIVE';this.messageT=2}
    if(s==='runway'){this.player.x=W*.5;this.player.y=H*.77;this.message='RUNWAY ESCAPE';this.messageT=2}
    if(s==='car'){this.player.x=W*.5;this.player.y=H*.80;this.roadTurn=0;this.roadTurnTarget=0;this.roadScroll=0;this.message='ALGORITHM MAZE';this.messageT=2}
    if(s==='boss'){this.player.x=W*.5;this.player.y=H*.79;this.boss={x:W*.5,y:160,hp:120,max:120,t:0,scale:.85,hitFlash:0};this.bossArenaPhase=0;this.floorBreak=0;this.message='ALGORITHM AIR BOSS';this.messageT=2}
  }
  cut(to,label){this.transition=1;this.nextScene=to;this.transitionLabel=label}
  update(dt){
    if(!started||paused)return;
    this.totalTime+=dt;this.sceneTime+=dt;this.messageT=Math.max(0,this.messageT-dt);this.player.inv=Math.max(0,this.player.inv-dt);
    this.shake=Math.max(0,this.shake-dt*13);this.flash=Math.max(0,this.flash-dt*2.8);this.fireCd=Math.max(0,this.fireCd-dt);
    this.director.update(this,dt);
    if(this.transition>0){this.transition-=dt*.78;if(this.transition<=0){this.transition=0;this.sceneStart(this.nextScene)}return}
    if(this.scene==='opening')this.updateOpening(dt);
    else if(this.scene==='skydive')this.updateSkydive(dt);
    else if(this.scene==='runway')this.updateRunway(dt);
    else if(this.scene==='car')this.updateCar(dt);
    else if(this.scene==='boss')this.updateBoss(dt);
    else if(this.scene==='ending')this.updateEnding(dt);
    this.updatePlayer(dt);this.updateProjectiles(dt);this.updateParticles(dt);this.collisions();
  }
  updatePlayer(dt){
    const dir=(keys.right?1:0)-(keys.left?1:0), max=this.scene==='car'?500:this.scene==='skydive'?420:430,acc=this.scene==='car'?1500:1350;
    this.player.vx+=dir*acc*dt;this.player.vx*=Math.pow(.001,dt);this.player.vx=clamp(this.player.vx,-max,max);
    this.player.x=clamp(this.player.x+this.player.vx*dt,100,W-100);this.player.tilt=lerp(this.player.tilt,dir*.24,dt*6);
    if((this.scene==='runway'||this.scene==='boss')&&keys.up&&!this.player.jumping){
      this.player.jumping=true;this.player.vy=-700;keys.up=false;audio.sfx(390,.08,'square',.06);
    }
    if(this.player.jumping){
      this.player.vy+=1600*dt;this.player.jumpY+=this.player.vy*dt;
      if(this.player.jumpY>=0){this.player.jumpY=0;this.player.vy=0;this.player.jumping=false}
    }
    if(keys.fire){this.fire();keys.fire=false}
    if(keys.special){this.special();keys.special=false}
  }
  updateOpening(dt){
    const c=audio.cues||{openingEnd:7}, p=clamp(this.sceneTime/c.openingEnd,0,1);
    if(keys.up){keys.up=false;this.cutsceneTaps++;audio.sfx(360+this.cutsceneTaps*18,.05,'square',.06);this.shake=3;for(let i=0;i<5;i++)this.spark(rnd(W*.34,W*.67),rnd(H*.27,H*.47))}
    if(p>.48&&this.cutsceneTaps>=6)this.jumpCommitted=true;
    if((p>.78&&this.jumpCommitted)||p>.96){this.flash=.55;this.cut('skydive','THE DIVE')}
    if(Math.random()<dt*(8+p*17))this.spark(rnd(W*.28,W*.72),rnd(H*.22,H*.52));
  }
  updateSkydive(dt){
    const c=audio.cues||{openingEnd:7,diveEnd:42},p=audio.progress(c.openingEnd,c.diveEnd,this.sceneTime+c.openingEnd);
    this.altitude=18500*(1-p);
    this.director.spawnClock-=dt;
    if(this.director.spawnClock<=0&&p<.90){this.director.spawnClock=this.director.interval();this.spawnSkyEnemy()}
    if(!this.weaponSecured&&p>.78){this.weaponSecured=true;this.weapon='808 BOOMER';this.message='W.M.P. SECURED — 808 BOOMER';this.messageT=2.8;this.shake=10;this.flash=.35}
    if(p>.90&&!this.bracePrompt){this.bracePrompt=true;this.message='FIRE TO BRACE FOR IMPACT';this.messageT=3}
    if(p>=.995)this.cut('runway','RUNWAY ESCAPE');
    this.updateEnemies(dt);
  }
  updateRunway(dt){
    const c=audio.cues||{diveEnd:42,runwayEnd:72},p=audio.progress(c.diveEnd,c.runwayEnd,this.sceneTime+c.diveEnd);
    if(p>.50&&!this.runwayReverse){this.runwayReverse=true;this.message='TURN — RUN TOWARD CAMERA';this.messageT=2;this.shake=8}
    this.director.spawnClock-=dt;
    if(this.director.spawnClock<=0){this.director.spawnClock=this.director.interval()*.92;this.obstacles.push({lane:this.director.chooseLane(),z:1,speed:rnd(.42,.60),kind:Math.random()<.35?'crate':'barrier',hit:false})}
    for(const o of this.obstacles){o.z-=dt*o.speed;const d=1-o.z;o.y=lerp(215,H+90,d);o.x=lerp(W*.5,(o.lane-1)*300+W*.5,d);o.scale=lerp(.12,1.5,d)}
    this.obstacles=this.obstacles.filter(o=>o.z>-.08);
    if(p>=.995)this.cut('car','VEHICLE PURSUIT');
  }
  updateCar(dt){
    const c=audio.cues||{runwayEnd:72,carEnd:100},p=audio.progress(c.runwayEnd,c.carEnd,this.sceneTime+c.runwayEnd);
    this.roadScroll=(this.roadScroll+dt*(.65+.5*p))%1;
    if(Math.abs(this.roadTurn-this.roadTurnTarget)<.05&&Math.random()<dt*(.35+.4*p))this.roadTurnTarget=rnd(-.78,.78);
    this.roadTurn=lerp(this.roadTurn,this.roadTurnTarget,dt*(.8+1.1*p));
    this.director.spawnClock-=dt;
    if(this.director.spawnClock<=0){this.director.spawnClock=this.director.interval()*.82;this.obstacles.push({lane:this.director.chooseLane(),z:1,speed:rnd(.50,.70),kind:Math.random()<.4?'pursuer':'blocker',hit:false})}
    for(const o of this.obstacles){o.z-=dt*o.speed;const d=1-o.z,curve=Math.sin((d*2.8+this.roadScroll)*Math.PI)*this.roadTurn*320*d;o.y=lerp(235,H+100,d);o.x=lerp(W*.5,(o.lane-1)*300+W*.5,d)+curve;o.scale=lerp(.10,1.6,d)}
    this.obstacles=this.obstacles.filter(o=>o.z>-.08);
    if(p>=.995)this.cut('boss','FINAL APPROACH');
  }
  updateBoss(dt){
    const c=audio.cues||{carEnd:100,end:128},p=audio.progress(c.carEnd,c.end,this.sceneTime+c.carEnd),b=this.boss;
    b.t+=dt;b.hitFlash=Math.max(0,b.hitFlash-dt*5);
    const lost=1-b.hp/b.max;
    if(lost>=.33&&this.bossArenaPhase===0){this.bossArenaPhase=1;this.floorBreak=1.6;this.message='GROUND FAILURE';this.messageT=2;this.shake=25;this.flash=.4}
    if(this.floorBreak>0){this.floorBreak-=dt;if(this.floorBreak<=0){this.bossArenaPhase=2;this.dropY=160;this.player.inv=1.6;this.message='LOWER GRID';this.messageT=2}}
    if(this.dropY>0)this.dropY=Math.max(0,this.dropY-dt*180);
    b.scale=clamp(.82+.22*Math.sin(b.t*.62)+.17*Math.sin(b.t*.23)+(lost>.60?.22:0),.64,1.38);
    b.x=W*.5+Math.sin(b.t*.75)*250;b.y=160+Math.sin(b.t*1.12)*32;
    const volley=lerp(1.35,.75,p);
    if((b.t%volley)<dt){let a=Math.atan2(this.player.y+this.player.jumpY-b.y,this.player.x-b.x);for(let k=-1;k<=1;k++)this.enemyBullets.push({x:b.x,y:b.y,vx:Math.cos(a+k*.16)*320,vy:Math.sin(a+k*.16)*320,r:7,life:4})}
    if((b.t%4.8)<dt){this.message='LASER SWEEP — MOVE / JUMP';this.messageT=1.2;for(let k=0;k<8;k++)this.enemyBullets.push({x:b.x,y:b.y,vx:(k-3.5)*74,vy:380,r:6,life:3})}
    if(p>.86&&b.hp>10)b.hp-=dt*2.2;
    if(b.hp<=0||p>=.997){this.spawnExplosion(b.x,b.y,2.5);this.score+=12000;this.scene='ending';this.sceneTime=0}
  }
  updateEnding(dt){
    if(this.sceneTime>6){started=false;overlay.querySelector('h1').textContent='MISSION COMPLETE';overlay.querySelector('.pitch').textContent=`Score ${this.score.toLocaleString()} • Max combo x${this.maxCombo} • The signal survives.`;startBtn.textContent='PLAY AGAIN';overlay.classList.add('show')}
  }
  spawnSkyEnemy(){
    const type=Math.random()<.25?'shield':Math.random()<.55?'swarm':'scout';
    this.enemies.push({type,x:rnd(90,W-90),y:H+55,vx:rnd(-40,40),vy:-rnd(180,300),hp:type==='shield'?3:1,r:type==='swarm'?18:26,fire:rnd(.7,1.8),hitFlash:0,hitKick:0})
  }
  updateEnemies(dt){
    for(const e of this.enemies){
      e.hitFlash=Math.max(0,e.hitFlash-dt*6);e.hitKick=lerp(e.hitKick,0,dt*10);e.x+=e.vx*dt+e.hitKick*dt;e.y+=e.vy*dt;e.fire-=dt;
      if(e.fire<0&&e.y>100&&e.y<H-100){e.fire=rnd(1.1,2.1);let a=Math.atan2(this.player.y-e.y,this.player.x-e.x);this.enemyBullets.push({x:e.x,y:e.y,vx:Math.cos(a)*250,vy:Math.sin(a)*250,r:6,life:4})}
    }
    this.enemies=this.enemies.filter(e=>e.y>-100&&e.y<H+100&&e.hp>0)
  }
  fire(){
    if(this.fireCd>0)return;
    this.fireCd=this.weaponSecured?.12:.22;this.shots++;
    const spreads=this.weaponSecured?[-.08,0,.08]:[0];
    for(const a of spreads){
      const y=this.scene==='skydive'?this.player.y+62:this.player.y+this.player.jumpY-35;
      this.bullets.push({x:this.player.x+28,y,vx:a*250,vy:this.scene==='skydive'?650:-650,r:5,life:1.8,pow:this.weaponSecured?1.15:1});
    }
    audio.sfx(this.weaponSecured?95:300,.06,'square',.07)
  }
  special(){
    if(this.player.special<1)return;this.player.special=0;this.shake=16;this.enemyBullets=[];for(const e of this.enemies)e.hp-=2.5;
    for(let i=0;i<36;i++){let a=i/36*TAU;this.particles.push(new Particle(this.player.x,this.player.y,Math.cos(a)*rnd(180,500),Math.sin(a)*rnd(180,500),.7,rnd(2,5),'#62dfff'))}
    setTimeout(()=>{this.player.special=1},3500)
  }
  updateProjectiles(dt){
    for(const b of this.bullets){b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt}
    for(const b of this.enemyBullets){b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt}
    this.bullets=this.bullets.filter(b=>b.life>0&&b.y>-80&&b.y<H+80);this.enemyBullets=this.enemyBullets.filter(b=>b.life>0)
  }
  updateParticles(dt){for(const p of this.particles)p.update(dt);this.particles=this.particles.filter(p=>p.life>0)}
  collisions(){
    for(const b of this.bullets){
      for(const e of this.enemies){
        const dx=b.x-e.x,dy=b.y-e.y;
        if(b.life>0&&e.hp>0&&dx*dx+dy*dy<(e.r+10)**2){
          b.life=0;e.hp-=b.pow;e.hitFlash=.5;e.hitKick=(b.vx>=0?1:-1)*120;this.hits++;this.combo++;this.maxCombo=Math.max(this.maxCombo,this.combo);this.score+=100*this.combo;this.spawnExplosion(e.x,e.y,e.hp<=0?.6:.18)
        }
      }
      if(this.scene==='boss'&&this.boss){
        const dx=b.x-this.boss.x,dy=b.y-this.boss.y;
        if(b.life>0&&dx*dx+dy*dy<(135*this.boss.scale)**2){b.life=0;this.boss.hp-=b.pow;this.boss.hitFlash=.4;this.combo++;this.score+=85*this.combo;this.shake=3}
      }
    }
    for(const b of this.enemyBullets){
      const dx=b.x-this.player.x,dy=b.y-(this.player.y+this.player.jumpY);
      if(b.life>0&&dx*dx+dy*dy<28**2){b.life=0;this.damage()}
    }
    for(const o of this.obstacles){
      if(!o.hit&&o.z<.11){
        const jumpSafe=this.scene==='runway'&&this.player.jumpY<-70;
        if(Math.abs(this.player.x-o.x)<90&&!jumpSafe){o.hit=true;this.damage()}
        else if(!o.hit){o.hit=true;this.score+=250;this.combo++;this.player.flow=clamp(this.player.flow+.1,0,1)}
      }
    }
  }
  damage(){if(this.player.inv>0)return;this.player.hp--;this.player.inv=1.2;this.combo=0;this.shake=13;this.flash=.25;this.director.hit();if(this.player.hp<=0){this.player.hp=3;this.player.inv=2.2;this.message='SIGNAL RECOVERED';this.messageT=2}}
  spark(x,y){this.particles.push(new Particle(x,y,rnd(-100,100),rnd(-100,120),rnd(.2,.5),rnd(2,5),'#ff623f'))}
  spawnExplosion(x,y,p=1){this.shake=Math.max(this.shake,6*p);for(let i=0;i<Math.round(16*p);i++){let a=rnd(0,TAU),s=rnd(80,280)*p;this.particles.push(new Particle(x,y,Math.cos(a)*s,Math.sin(a)*s,rnd(.25,.7),rnd(2,6),'#ff7b42',60))}}
  draw(){
    ctx.save();ctx.translate(rnd(-this.shake,this.shake),rnd(-this.shake,this.shake));
    if(this.scene==='opening')this.drawOpening();
    else if(this.scene==='skydive')this.drawSkydive();
    else if(this.scene==='runway')this.drawRunway();
    else if(this.scene==='car')this.drawCar();
    else if(this.scene==='boss')this.drawBoss();
    else this.drawEnding();
    for(const p of this.particles)p.draw();ctx.restore();this.drawHUD();if(this.transition>0)this.drawTransition();if(this.flash>0){ctx.fillStyle=`rgba(255,255,255,${this.flash*.45})`;ctx.fillRect(0,0,W,H)}
  }
  bg(a='#07111e',b='#020408'){let g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,a);g.addColorStop(1,b);ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
  drawOpening(){
    this.bg('#172b42','#05070c');const c=audio.cues||{openingEnd:7},p=clamp(this.sceneTime/c.openingEnd,0,1);
    for(let i=0;i<12;i++){ctx.fillStyle='rgba(230,245,255,.06)';ctx.beginPath();ctx.ellipse((i*127)%W,H*.55+(i%4)*45,180,48,0,0,TAU);ctx.fill()}
    const px=W*.5,py=H*.40;ctx.save();ctx.translate(px,py);ctx.fillStyle='#dce7ef';ctx.beginPath();ctx.moveTo(-170,0);ctx.lineTo(90,-24);ctx.lineTo(165,0);ctx.lineTo(92,22);ctx.closePath();ctx.fill();ctx.fillStyle='#8999a7';ctx.fillRect(-95,-16,165,32);ctx.restore();
    for(let i=0;i<12;i++){let a=i/12*TAU+this.sceneTime*.8,r=205;this.drawBot(px+Math.cos(a)*r,py+Math.sin(a)*r*.5,18)}
    if(p>.32){ctx.strokeStyle='#ff453d';ctx.lineWidth=3;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(px+rnd(-190,190),py+rnd(-90,90));ctx.lineTo(px+rnd(-45,45),py+rnd(-25,25));ctx.stroke()}}
    if(p>.45){
      const need=6,fill=clamp(this.cutsceneTaps/need,0,1);
      ctx.fillStyle='rgba(0,0,0,.72)';ctx.fillRect(W/2-230,H-125,460,72);ctx.strokeStyle='#5aaee8';ctx.strokeRect(W/2-230,H-125,460,72);
      ctx.fillStyle='#fff';ctx.font='800 20px Arial';ctx.textAlign='center';ctx.fillText('TAP ↑  /  W  TO ESCAPE',W/2,H-94);
      ctx.fillStyle='#263746';ctx.fillRect(W/2-165,H-78,330,10);ctx.fillStyle='#5ee5ff';ctx.fillRect(W/2-165,H-78,330*fill,10);
    }
    if(this.jumpCommitted){ctx.fillStyle='#fff';ctx.font='900 34px Arial';ctx.textAlign='center';ctx.fillText('JUMP!',W/2,H*.17)}
  }
  drawSkydive(){
    this.bg('#173f69','#06101d');for(let i=0;i<70;i++){let y=(i*53+this.totalTime*580)%H;ctx.fillStyle='rgba(160,215,255,.35)';ctx.fillRect((i*97)%W,y,2,22+(i%5)*8)}
    for(const e of this.enemies)this.drawBot(e.x,e.y,e.r,e);for(const b of this.bullets)this.note(b.x,b.y);for(const b of this.enemyBullets)this.orb(b.x,b.y,'#ff463d');this.drawDiver();
  }
  drawRunway(){
    this.bg('#101a24','#020407');this.drawPerspectiveRoad();const c=audio.cues||{diveEnd:42,runwayEnd:72},p=audio.progress(c.diveEnd,c.runwayEnd,this.sceneTime+c.diveEnd);
    if(this.runwayReverse){let q=clamp((p-.5)/.5,0,1);ctx.save();ctx.translate(W*.5,lerp(135,260,q));ctx.scale(lerp(.18,1.5,ease(q)),lerp(.18,1.5,ease(q)));this.drawAlgorithmBoss(0,0,1);ctx.restore()}
    for(const o of this.obstacles)this.drawObstacle(o);this.drawRunner(this.runwayReverse);
  }
  drawCar(){
    this.bg('#071421','#020409');this.drawMazeRoad();for(const o of this.obstacles)this.drawObstacle(o);this.drawCarHero();
  }
  drawBoss(){
    this.bg(this.bossArenaPhase<2?'#07121f':'#020611','#010207');
    for(let i=0;i<12;i++){ctx.fillStyle=`rgba(32,54,83,${.13+(i%3)*.04})`;ctx.beginPath();ctx.ellipse((i*139+Math.sin(this.totalTime*.22+i)*60)%W,100+(i%5)*65,220,62,0,0,TAU);ctx.fill()}
    if(this.floorBreak>0){ctx.fillStyle='#151c25';ctx.fillRect(0,H*.69,W,H*.31);ctx.strokeStyle='#ff493f';ctx.lineWidth=4;for(let i=0;i<12;i++){ctx.beginPath();ctx.moveTo(W*.5+(i-6)*95,H*.70);ctx.lineTo(W*.5+(i-6)*95+rnd(-100,100),H);ctx.stroke()}}
    else{ctx.fillStyle=this.bossArenaPhase===0?'#141d28':'#05080d';ctx.fillRect(0,H*.73,W,H*.27)}
    const b=this.boss;ctx.save();ctx.translate(W/2,H/2);ctx.scale(b.scale,b.scale);ctx.translate(-W/2,-H/2);this.drawAlgorithmBoss(b.x,b.y,1.12);ctx.restore();
    if(b.hitFlash>0){ctx.fillStyle=`rgba(155,230,255,${b.hitFlash*.5})`;ctx.beginPath();ctx.arc(b.x,b.y,145*b.scale,0,TAU);ctx.fill()}
    for(const x of this.bullets)this.note(x.x,x.y);for(const x of this.enemyBullets)this.orb(x.x,x.y,'#ff493f');this.drawRunner(false,this.dropY);
    ctx.fillStyle='rgba(0,0,0,.65)';ctx.fillRect(350,24,580,18);ctx.fillStyle='#ff443c';ctx.fillRect(350,24,580*(b.hp/b.max),18);ctx.strokeStyle='#607386';ctx.strokeRect(350,24,580,18);
  }
  drawEnding(){this.bg('#0a2533','#020408');ctx.fillStyle='#fff';ctx.font='900 46px Arial';ctx.textAlign='center';ctx.fillText('THE SIGNAL SURVIVES',W/2,H/2)}
  drawPerspectiveRoad(){
    ctx.fillStyle='#222c36';ctx.beginPath();ctx.moveTo(W*.43,190);ctx.lineTo(W*.57,190);ctx.lineTo(W*.94,H);ctx.lineTo(W*.06,H);ctx.closePath();ctx.fill();
    for(let i=0;i<10;i++){let z=((i/10+this.totalTime*.24)%1),y=lerp(210,H,z*z),span=lerp(12,520,z*z);ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(W/2-span*.2,y);ctx.lineTo(W/2+span*.2,y);ctx.stroke()}
  }
  drawMazeRoad(){
    ctx.fillStyle='#080d13';ctx.fillRect(0,185,W,H-185);const bands=20;
    for(let i=bands-1;i>=0;i--){
      let z=((i/bands+this.roadScroll)%1),d=z*z,n=((i+1)/bands+this.roadScroll)%1,d2=n*n,y=lerp(195,H,d),y2=lerp(195,H,d2);
      let c=Math.sin((z*3.1+this.roadScroll)*Math.PI)*this.roadTurn*360*d,c2=Math.sin((n*3.1+this.roadScroll)*Math.PI)*this.roadTurn*360*d2;
      let hw=lerp(65,590,d),hw2=lerp(65,590,d2);ctx.fillStyle=i%2?'#172330':'#202d3b';ctx.beginPath();ctx.moveTo(W*.5+c-hw,y);ctx.lineTo(W*.5+c+hw,y);ctx.lineTo(W*.5+c2+hw2,y2);ctx.lineTo(W*.5+c2-hw2,y2);ctx.closePath();ctx.fill();
      ctx.strokeStyle='rgba(100,185,235,.35)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(W*.5+c-hw*.32,y);ctx.lineTo(W*.5+c2-hw2*.32,y2);ctx.moveTo(W*.5+c+hw*.32,y);ctx.lineTo(W*.5+c2+hw2*.32,y2);ctx.stroke();
    }
  }
  drawObstacle(o){
    const x=o.x,y=o.y,s=o.scale;ctx.save();ctx.translate(x,y);ctx.scale(s,s);
    if(o.kind==='pursuer'){ctx.fillStyle='#111820';ctx.fillRect(-48,-22,96,44);ctx.fillStyle='#ff4038';ctx.fillRect(-34,-15,15,7);ctx.fillRect(19,-15,15,7)}
    else{ctx.fillStyle='#e5e8ea';ctx.fillRect(-48,-28,96,56);ctx.fillStyle='#ff5545';for(let i=-2;i<=2;i+=2)ctx.fillRect(i*16-5,-28,10,56)}
    ctx.restore();
  }
  drawDiver(){
    const x=this.player.x,y=this.player.y;ctx.save();ctx.translate(x,y); // head-down world orientation
    ctx.fillStyle='#111820';ctx.strokeStyle='#111820';ctx.lineWidth=18;ctx.beginPath();ctx.moveTo(-8,-38);ctx.lineTo(-26,-86);ctx.moveTo(8,-38);ctx.lineTo(26,-86);ctx.stroke();
    ctx.fillStyle='#f2f5f7';ctx.beginPath();ctx.ellipse(0,0,28,50,0,0,TAU);ctx.fill();ctx.fillStyle='#8d5a3d';ctx.beginPath();ctx.arc(0,48,17,0,TAU);ctx.fill();ctx.fillStyle='#05080b';ctx.fillRect(-16,43,32,7);
    ctx.strokeStyle='#f2f5f7';ctx.lineWidth=15;ctx.beginPath();ctx.moveTo(-14,8);ctx.lineTo(-55,40);ctx.moveTo(14,8);ctx.lineTo(55,40);ctx.stroke();
    // Tonearm/808 visible and pointed downward
    ctx.save();ctx.translate(22,24);ctx.rotate(Math.PI/2);ctx.fillStyle='#111820';ctx.fillRect(-7,-6,50,16);ctx.fillStyle='#59dfff';ctx.fillRect(36,-3,10,10);ctx.restore();ctx.restore();
  }
  drawRunner(front=false,extraDrop=0){
    const x=this.player.x,y=this.player.y+this.player.jumpY+extraDrop;ctx.save();ctx.translate(x,y);ctx.fillStyle='#111720';ctx.fillRect(-25,-28,50,76);ctx.fillStyle='#eef3f6';ctx.fillRect(-31,-70,62,55);ctx.fillStyle='#8d5a3d';ctx.beginPath();ctx.arc(0,-84,17,0,TAU);ctx.fill();ctx.fillStyle='#05080b';ctx.fillRect(-17,-90,34,6);
    let ph=Math.sin(this.totalTime*15)*24;ctx.strokeStyle='#151a21';ctx.lineWidth=17;ctx.beginPath();ctx.moveTo(-10,40);ctx.lineTo(-24+ph,86);ctx.moveTo(10,40);ctx.lineTo(24-ph,86);ctx.stroke();
    ctx.fillStyle='#111820';ctx.fillRect(front?-45:18,-58,48,14);ctx.fillStyle='#5ddfff';ctx.fillRect(front?-49:60,-55,8,8);ctx.restore();
  }
  drawCarHero(){
    const x=this.player.x,y=this.player.y;ctx.save();ctx.translate(x,y);ctx.fillStyle='#080a0d';ctx.beginPath();ctx.roundRect(-92,-34,184,68,18);ctx.fill();ctx.fillStyle='#101d29';ctx.fillRect(-48,-57,96,34);ctx.fillStyle='#9cc8e8';ctx.fillRect(-34,-51,68,21);ctx.fillStyle='#5adfff';ctx.font='bold 18px Arial';ctx.textAlign='center';ctx.fillText('2FLY',0,10);ctx.restore();
  }
  drawBot(x,y,r,e=null){
    ctx.save();ctx.translate(x+(e?.hitKick||0)*.04,y);ctx.fillStyle=e&&e.hitFlash>0?'#f4f9ff':'#171d25';ctx.strokeStyle=e&&e.hitFlash>0?'#84e8ff':'#5d6875';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r,0,TAU);ctx.fill();ctx.stroke();
    for(let i=0;i<6;i++){let a=i/6*TAU;ctx.beginPath();ctx.moveTo(Math.cos(a)*r*.6,Math.sin(a)*r*.6);ctx.lineTo(Math.cos(a)*r*1.5,Math.sin(a)*r*1.5);ctx.stroke()}
    ctx.fillStyle=e&&e.hitFlash>0?'#fff':'#ff3d35';ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=15;ctx.beginPath();ctx.arc(0,0,r*.35,0,TAU);ctx.fill();ctx.shadowBlur=0;ctx.restore();
  }
  drawAlgorithmBoss(x,y,s){
    ctx.save();ctx.translate(x,y);ctx.scale(s,s);for(let i=0;i<8;i++){let a=i/8*TAU+this.totalTime*.13;ctx.strokeStyle='#28313c';ctx.lineWidth=22;ctx.beginPath();ctx.moveTo(Math.cos(a)*55,Math.sin(a)*55);ctx.lineTo(Math.cos(a)*125,Math.sin(a)*125);ctx.stroke();this.drawBot(Math.cos(a)*132,Math.sin(a)*132,18)}
    ctx.fillStyle='#141b24';ctx.strokeStyle='#596674';ctx.lineWidth=6;ctx.beginPath();ctx.roundRect(-78,-78,156,156,28);ctx.fill();ctx.stroke();ctx.strokeStyle='#ff4038';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(-35,-35);ctx.lineTo(35,35);ctx.moveTo(35,-35);ctx.lineTo(-35,35);ctx.stroke();ctx.restore();
  }
  note(x,y){ctx.fillStyle='#62e4ff';ctx.font='bold 28px Georgia';ctx.textAlign='center';ctx.fillText('♪',x,y)}
  orb(x,y,c){ctx.fillStyle=c;ctx.shadowColor=c;ctx.shadowBlur=12;ctx.beginPath();ctx.arc(x,y,6,0,TAU);ctx.fill();ctx.shadowBlur=0}
  drawHUD(){
    if(!started)return;ctx.fillStyle='rgba(2,7,12,.72)';ctx.fillRect(20,18,370,82);ctx.fillStyle='#fff';ctx.font='800 18px Arial';ctx.textAlign='left';ctx.fillText('RETURN OF THE AVIATOR',36,43);ctx.fillStyle='#65dfff';ctx.font='700 13px Arial';ctx.fillText(this.weapon,36,67);ctx.fillStyle=audio.failed?'#ff665f':'#80efc0';ctx.fillText(audio.failed?'MUSIC FALLBACK':'♫ TOO FAST • SYNCED',185,67);ctx.fillStyle='#a8b7c7';ctx.fillText(`SCORE ${String(this.score).padStart(7,'0')}   COMBO x${this.combo}`,36,88);
    for(let i=0;i<5;i++){ctx.fillStyle=i<this.player.hp?'#ff4a43':'#27313b';ctx.fillRect(292+i*17,54,12,8)}
    ctx.fillStyle='#252d36';ctx.fillRect(W-245,H-34,210,8);ctx.fillStyle='#56e1ff';ctx.fillRect(W-245,H-34,210*this.player.flow,8);ctx.fillStyle='#9aaabd';ctx.font='11px Arial';ctx.fillText('FLOW',W-245,H-43);
    if(this.scene==='skydive'){ctx.textAlign='right';ctx.fillStyle='#e2eff9';ctx.font='800 22px Arial';ctx.fillText(`${Math.max(0,Math.round(this.altitude)).toLocaleString()} FT`,W-35,45)}
    if(this.messageT>0){ctx.fillStyle='rgba(0,0,0,.72)';ctx.fillRect(W*.31,H*.12,W*.38,52);ctx.strokeStyle='#4d92ce';ctx.strokeRect(W*.31,H*.12,W*.38,52);ctx.fillStyle='#fff';ctx.font='800 20px Arial';ctx.textAlign='center';ctx.fillText(this.message,W*.5,H*.12+33)}
  }
  drawTransition(){const p=1-this.transition;ctx.fillStyle=`rgba(0,0,0,${clamp(1-Math.abs(.5-p)*2,0,.92)})`;ctx.fillRect(0,0,W,H);ctx.fillStyle='#fff';ctx.font='900 38px Arial';ctx.textAlign='center';ctx.fillText(this.transitionLabel,W/2,H/2)}
}

const game=new Game();
function loop(t){const dt=Math.min(.033,(t/1000-last)||.016);last=t/1000;if(!paused)game.update(dt);game.draw();requestAnimationFrame(loop)}
requestAnimationFrame(loop);

startBtn.addEventListener('click',()=>game.begin());
window.addEventListener('keydown',e=>{
  if(['ArrowLeft','ArrowRight','ArrowUp','Space'].includes(e.code))e.preventDefault();
  if(e.code==='ArrowLeft'||e.code==='KeyA')keys.left=true;
  if(e.code==='ArrowRight'||e.code==='KeyD')keys.right=true;
  if(e.code==='ArrowUp'||e.code==='KeyW')keys.up=true;
  if(e.code==='Space')keys.fire=true;
  if(e.code==='ShiftLeft'||e.code==='ShiftRight')keys.special=true;
  if(e.code==='KeyP'){paused=!paused;paused?audio.pause():audio.resume()}
});
window.addEventListener('keyup',e=>{
  if(e.code==='ArrowLeft'||e.code==='KeyA')keys.left=false;
  if(e.code==='ArrowRight'||e.code==='KeyD')keys.right=false;
  if(e.code==='ArrowUp'||e.code==='KeyW')keys.up=false;
});
document.querySelectorAll('#touch button').forEach(b=>{
  const k=b.dataset.key;
  b.addEventListener('pointerdown',e=>{e.preventDefault();if(k==='left'||k==='right'||k==='up')keys[k]=true;else if(k==='fire')keys.fire=true});
  b.addEventListener('pointerup',e=>{e.preventDefault();if(k==='left'||k==='right'||k==='up')keys[k]=false});
  b.addEventListener('pointercancel',()=>{if(k==='left'||k==='right'||k==='up')keys[k]=false});
});
})();