(()=>{
'use strict';
const W=1280,H=720;
const SONG_URL='https://static.wixstatic.com/mp3/85e419_62dfb4b5acfc4747a02ad9eaeb643f29.mp3';
const clamp=Phaser.Math.Clamp,lerp=Phaser.Math.Linear,rnd=Phaser.Math.FloatBetween;

class Aviator extends Phaser.Scene{
  constructor(){super('Aviator')}
  preload(){
    const A='assets/production/',B='assets/backgrounds/';
    for(let i=0;i<4;i++){this.load.image(`idle${i}`,`${A}hero_idle_${i}.png`);this.load.image(`run${i}`,`${A}hero_run_${i}.png`);this.load.image(`dive${i}`,`${A}hero_dive_${i}.png`)}
    for(let i=0;i<3;i++)this.load.image(`fire${i}`,`${A}hero_fire_${i}.png`);
    ['tonearm','808_boomer','algorithm_boss','algorithm_bot','explosion','hero_car','enemy_car','enemy_truck'].forEach(k=>this.load.image(k,`${A}${k}.png`));
    ['sky','runway','runway_city','road','city','boss_storm','boss_arena'].forEach(k=>this.load.image(`bg_${k}`,`${B}${k}.jpg`));
    this.load.image('clouds',`${B}cloud_layer.png`);this.load.image('speedlines',`${B}speed_lines.png`);this.load.image('rain',`${B}rain.png`);
  }
  create(){
    this.started=false;this.phase='opening';this.totalT=0;this.phaseT=0;this.score=0;this.combo=0;this.hp=5;
    this.fireCd=0;this.enemyClock=.5;this.specialReady=true;this.escapeTaps=0;this.turnBack=false;this.transitioning=false;
    this.projectiles=[];this.enemies=[];this.enemyShots=[];this.maxEnemies=12;this.maxEnemyShots=16;
    this.jump={active:false,y:0,vy:0};this.roadCurve=0;this.roadTarget=0;this.floorPhase=0;this.car=null;this.boss=null;this.runwayBoss=null;

    this.song=new Audio(SONG_URL);this.song.preload='auto';this.song.volume=.82;this.song.loop=false;
    this.song.playbackRate=1;try{this.song.preservesPitch=true}catch(e){}
    this.duration=128;this.song.addEventListener('loadedmetadata',()=>{if(Number.isFinite(this.song.duration))this.duration=this.song.duration;this.makeCues()});this.makeCues();

    this.cursors=this.input.keyboard.createCursorKeys();
    this.keys=this.input.keyboard.addKeys({W:'W',A:'A',S:'S',D:'D',FIRE:'SPACE',SPECIAL:'SHIFT',P:'P'});
    this.input.keyboard.on('keydown-P',()=>{
      if(!this.started)return;
      if(this.scene.isPaused()){this.scene.resume();this.song.playbackRate=1;this.song.play().catch(()=>{})}
      else{this.scene.pause();this.song.pause()}
    });

    this.bg=this.add.image(W/2,H/2,'bg_sky').setDisplaySize(W,H).setDepth(-20);
    this.bg2=this.add.image(W/2,H/2,'bg_runway_city').setDisplaySize(W,H).setAlpha(0).setDepth(-19);
    this.cloudFar=this.add.tileSprite(W/2,H/2,W*1.25,H,'clouds').setAlpha(.17).setDepth(-12);
    this.cloudNear=this.add.tileSprite(W/2,H/2,W*1.35,H,'clouds').setAlpha(0).setDepth(8).setBlendMode(Phaser.BlendModes.SCREEN);
    this.lines=this.add.tileSprite(W/2,H/2,W,H,'speedlines').setAlpha(0).setDepth(7).setBlendMode(Phaser.BlendModes.ADD);
    this.rain=this.add.tileSprite(W/2,H/2,W,H,'rain').setAlpha(0).setDepth(7).setBlendMode(Phaser.BlendModes.SCREEN);

    this.hero=this.add.image(W*.5,H*.52,'idle0').setDepth(3).setScale(.44);
    this.heroState='idle';this.animIndex=0;this.animT=0;
    this.weapon=this.add.image(this.hero.x+58,this.hero.y-5,'tonearm').setDepth(4).setScale(.18);

    this.hud=this.add.rectangle(210,67,390,94,0x02070c,.80).setDepth(30);
    this.title=this.add.text(34,27,'RETURN OF THE AVIATOR',{font:'900 22px Arial',color:'#fff'}).setDepth(31);
    this.weaponText=this.add.text(34,58,'TONEARM',{font:'700 15px Arial',color:'#63dfff'}).setDepth(31);
    this.musicText=this.add.text(185,58,'♫ TOO FAST • SYNCED',{font:'700 13px Arial',color:'#83f0c3'}).setDepth(31);
    this.scoreText=this.add.text(34,82,'SCORE 0000000  COMBO x0',{font:'700 13px Arial',color:'#9eb1c4'}).setDepth(31);
    this.healthG=this.add.graphics().setDepth(31);this.bossBar=this.add.graphics().setDepth(31);
    this.prompt=this.add.text(W/2,H*.13,'',{font:'900 23px Arial',color:'#fff',backgroundColor:'rgba(0,0,0,.68)',padding:{x:18,y:10}}).setOrigin(.5).setDepth(35).setAlpha(0);
  }

  makeCues(){const d=this.duration||128;const o=clamp(d*.075,6,9);this.cues={opening:o,dive:d*.34,runway:d*.58,car:d*.80,end:d*.985}}
  async startExperience(){
    this.resetExperience();this.started=true;this.song.pause();this.song.currentTime=0;this.song.playbackRate=1;
    try{await this.song.play();this.musicText.setText('♫ TOO FAST • SYNCED').setColor('#83f0c3')}
    catch(e){this.musicText.setText('♫ AUDIO CLICK REQUIRED').setColor('#ff857d')}
    this.showPrompt('TAP ↑ / W TO ESCAPE',1800);
  }
  resetExperience(){
    this.phase='opening';this.totalT=0;this.phaseT=0;this.score=0;this.combo=0;this.hp=5;this.fireCd=0;this.enemyClock=.35;this.escapeTaps=0;this.turnBack=false;this.transitioning=false;this.floorPhase=0;this.jump={active:false,y:0,vy:0};
    this.clearCombat();if(this.car){this.car.destroy();this.car=null}if(this.boss){this.boss.destroy();this.boss=null}if(this.runwayBoss){this.runwayBoss.destroy();this.runwayBoss=null}
    this.cameras.main.setZoom(1);this.cameras.main.setRotation(0);this.hero.setVisible(true).setPosition(W*.5,H*.52).setScale(.44).setRotation(0);this.weapon.setVisible(true).setTexture('tonearm').setScale(.18);this.weaponText.setText('TONEARM');this.setHeroState('idle');
    this.bg.setTexture('bg_sky').setDisplaySize(W,H).setPosition(W/2,H/2);this.bg2.setAlpha(0);this.lines.setAlpha(0);this.cloudNear.setAlpha(0);this.rain.setAlpha(0);
  }
  musicTime(){const t=this.song.currentTime;return Number.isFinite(t)&&t>=0?t:this.totalT}
  progress(a,b){return clamp((this.musicTime()-a)/Math.max(.001,b-a),0,1)}
  left(){return this.cursors.left.isDown||this.keys.A.isDown} right(){return this.cursors.right.isDown||this.keys.D.isDown}
  up(){return this.cursors.up.isDown||this.keys.W.isDown} down(){return this.cursors.down.isDown||this.keys.S.isDown}

  update(t,ms){
    if(!this.started)return;const dt=Math.min(.032,ms/1000);this.totalT+=dt;this.phaseT+=dt;this.fireCd=Math.max(0,this.fireCd-dt);this.enemyClock-=dt;
    if(this.song.playbackRate!==1)this.song.playbackRate=1;
    this.animate(dt);
    if(this.phase==='opening')this.opening(dt);else if(this.phase==='dive')this.dive(dt);else if(this.phase==='runway')this.runway(dt);else if(this.phase==='car')this.carScene(dt);else if(this.phase==='boss')this.bossScene(dt);
    if(this.keys.FIRE.isDown&&this.fireCd<=0)this.fire();
    if(Phaser.Input.Keyboard.JustDown(this.keys.SPECIAL)&&this.specialReady)this.special();
    this.updateCombat(dt);this.updateHUD();
  }

  setHeroState(s){if(this.heroState===s)return;this.heroState=s;this.animIndex=0;this.animT=0;this.hero.setTexture(`${s}0`)}
  animate(dt){
    this.animT+=dt;const rate=this.heroState==='run'?.095:this.heroState==='dive'?.11:.15;
    if(this.animT>rate){this.animT=0;const max=this.heroState==='fire'?3:4;this.animIndex=(this.animIndex+1)%max;if(this.textures.exists(`${this.heroState}${this.animIndex}`))this.hero.setTexture(`${this.heroState}${this.animIndex}`)}
    const ox=this.phase==='dive'?48:62,oy=this.phase==='dive'?52:-5;this.weapon.setPosition(this.hero.x+ox,this.hero.y+oy).setRotation(this.phase==='dive'?Math.PI/2:0);
  }

  opening(dt){
    this.bg.setTexture('bg_sky');this.cloudFar.tilePositionY-=16*dt;this.lines.setAlpha(.04);this.hero.setPosition(W*.5,H*.54).setScale(.42);this.setHeroState('idle');
    if(Phaser.Input.Keyboard.JustDown(this.cursors.up)||Phaser.Input.Keyboard.JustDown(this.keys.W)){this.escapeTaps++;this.cameras.main.shake(70,.003);this.emitSparks(W*.5+rnd(-170,170),H*.37+rnd(-80,80),7)}
    this.spawnBots('opening');const p=clamp(this.musicTime()/this.cues.opening,0,1);if((p>.80&&this.escapeTaps>=6)||p>.98)this.go('dive','THE DIVE');
  }
  dive(dt){
    const p=this.progress(this.cues.opening,this.cues.dive);this.bg.setTexture('bg_sky');this.lines.setAlpha(.26);this.cloudNear.setAlpha(.10);this.cloudFar.tilePositionY-=125*dt;this.cloudNear.tilePositionY-=275*dt;this.lines.tilePositionY-=360*dt;
    this.setHeroState('dive');this.hero.setScale(.46);const h=(this.right()?1:0)-(this.left()?1:0),v=(this.down()?1:0)-(this.up()?1:0);this.hero.x=clamp(this.hero.x+h*390*dt,115,1165);this.hero.y=clamp(this.hero.y+v*330*dt,120,585);
    this.spawnBots('dive');if(p>.76&&this.weaponText.text!=='808 BOOMER'){this.weapon.setTexture('808_boomer').setScale(.14);this.weaponText.setText('808 BOOMER');this.showPrompt('W.M.P. SECURED — 808 BOOMER',1600);this.cameras.main.flash(180,100,220,255)}
    if(p>=.995)this.go('runway','RUNWAY ESCAPE');
  }
  runway(dt){
    const p=this.progress(this.cues.dive,this.cues.runway);this.bg.setTexture('bg_runway').setDisplaySize(W,H);this.bg2.setTexture('bg_runway_city').setAlpha(.18);this.lines.setAlpha(.06);this.setHeroState('run');
    // Free lateral movement through the full runway scene.
    const h=(this.right()?1:0)-(this.left()?1:0);this.hero.x=clamp(this.hero.x+h*380*dt,145,1135);
    if(Phaser.Input.Keyboard.JustDown(this.cursors.up)||Phaser.Input.Keyboard.JustDown(this.keys.W)){if(!this.jump.active)this.jump={active:true,y:0,vy:-620}}
    if(this.jump.active){this.jump.vy+=1500*dt;this.jump.y+=this.jump.vy*dt;if(this.jump.y>=0)this.jump={active:false,y:0,vy:0}}
    if(!this.turnBack){this.hero.setScale(lerp(.44,.25,clamp(p/.5,0,1)));this.hero.y=lerp(H*.78,H*.47,clamp(p/.5,0,1))+this.jump.y}
    else{this.hero.setScale(.44);this.hero.y=H*.78+this.jump.y}
    if(p>.50&&!this.turnBack){this.turnBack=true;this.showPrompt('TURN! RUN TOWARD CAMERA',1100);this.cameras.main.shake(180,.006)}
    if(this.turnBack){if(!this.runwayBoss)this.runwayBoss=this.add.image(W/2,160,'algorithm_boss').setDepth(1).setScale(.10);const q=clamp((p-.5)/.5,0,1);this.runwayBoss.setScale(lerp(.10,1.25,q*q)).setY(lerp(165,260,q))}
    this.spawnBots('runway');if(p>=.995)this.go('car','ALGORITHM MAZE');
  }
  carScene(dt){
    const p=this.progress(this.cues.runway,this.cues.car);this.bg.setTexture('bg_road').setDisplaySize(W,H);this.bg2.setTexture('bg_city').setAlpha(.28);this.lines.setAlpha(.12);this.lines.tilePositionY-=260*dt;
    if(this.hero.visible){this.hero.setVisible(false);this.weapon.setVisible(false)}if(!this.car)this.car=this.add.image(W*.5,H*.72,'hero_car').setScale(.62).setDepth(4);
    const h=(this.right()?1:0)-(this.left()?1:0),v=(this.down()?1:0)-(this.up()?1:0);this.car.x=clamp(this.car.x+h*440*dt,150,1130);this.car.y=clamp(this.car.y+v*250*dt,H*.48,H*.86);this.car.rotation=lerp(this.car.rotation,h*.065,.1);
    if(Math.abs(this.roadCurve-this.roadTarget)<.04&&Math.random()<dt*.30)this.roadTarget=rnd(-1,1);this.roadCurve=lerp(this.roadCurve,this.roadTarget,dt*.5);this.bg.x=W/2+this.roadCurve*40;this.cameras.main.rotation=lerp(this.cameras.main.rotation,this.roadCurve*.015,.03);
    this.spawnBots('car');if(p>=.995)this.go('boss','THE ALGORITHM STORM');
  }
  bossScene(dt){
    const p=this.progress(this.cues.car,this.cues.end);this.bg.setTexture('bg_boss_storm').setDisplaySize(W,H);this.bg2.setTexture('bg_boss_arena').setAlpha(.18);this.rain.setAlpha(.22);this.rain.tilePositionY-=330*dt;if(this.car){this.car.destroy();this.car=null}
    this.hero.setVisible(true);this.weapon.setVisible(true);this.setHeroState('fire');this.hero.setScale(.42);const h=(this.right()?1:0)-(this.left()?1:0);this.hero.x=clamp(this.hero.x+h*370*dt,140,1140);
    if(Phaser.Input.Keyboard.JustDown(this.cursors.up)||Phaser.Input.Keyboard.JustDown(this.keys.W)){if(!this.jump.active)this.jump={active:true,y:0,vy:-610}}if(this.jump.active){this.jump.vy+=1500*dt;this.jump.y+=this.jump.vy*dt;if(this.jump.y>=0)this.jump={active:false,y:0,vy:0}}this.hero.y=H*.78+this.jump.y;
    if(!this.boss){this.boss=this.add.image(W/2,190,'algorithm_boss').setScale(.82).setDepth(2);this.boss.hp=120;this.boss.max=120}
    const lost=1-this.boss.hp/this.boss.max;this.boss.x=W/2+Math.sin(this.totalT*.72)*235;this.boss.y=190+Math.sin(this.totalT*1.1)*26;this.boss.setScale(clamp(.82+.15*Math.sin(this.totalT*.48)+.10*Math.sin(this.totalT*.17)+(lost>.6?.16:0),.68,1.2));this.cameras.main.setZoom(1+.045*Math.sin(this.totalT*.35));
    if(lost>.33&&this.floorPhase===0){this.floorPhase=1;this.showPrompt('GROUND FAILURE!',1200);this.cameras.main.shake(650,.015);this.time.delayedCall(750,()=>{this.floorPhase=2;this.showPrompt('LOWER GRID',1000)})}
    this.spawnBots('boss');if(p>.92&&this.boss.hp>8)this.boss.hp-=dt*.9;if(this.boss.hp<=0||p>.997)this.finish();
  }

  spawnBots(scene){
    if(this.enemyClock>0||this.enemies.length>=this.maxEnemies)return;
    const gaps={opening:[.8,1.2],dive:[.58,.85],runway:[.7,1.0],car:[.5,.78],boss:[.68,.95]},g=gaps[scene]||[.8,1.1];this.enemyClock=rnd(g[0],g[1]);
    if(scene==='car'&&Math.random()<.46){
      const k=Math.random()<.28?'enemy_truck':'enemy_car';const e=this.add.image(rnd(W*.28,W*.72),185,k).setScale(k==='enemy_truck'?.36:.44).setDepth(3);e.hp=k==='enemy_truck'?3:2;e.vx=rnd(-22,22);e.vy=rnd(100,155);e.cool=rnd(2.5,3.8);e.vehicle=true;this.enemies.push(e);
    }else{
      const e=this.add.image(rnd(100,1180),scene==='dive'?H+80:rnd(115,300),'algorithm_bot').setScale(rnd(.42,.56)).setDepth(3);e.hp=Math.random()<.18?2:1;e.vx=rnd(-42,42);e.vy=scene==='dive'?-rnd(120,190):rnd(24,62);e.cool=rnd(2.4,3.8);e.vehicle=false;this.enemies.push(e);
    }
  }

  fire(){
    this.fireCd=this.weaponText.text==='808 BOOMER'?.14:.22;const src=this.phase==='car'?this.car:this.hero;if(!src)return;const spreads=this.weaponText.text==='808 BOOMER'?[-.07,0,.07]:[0];
    spreads.forEach(a=>{const b=this.add.circle(src.x+20,src.y-(this.phase==='dive'?-28:24),6,0x64e8ff,1).setDepth(7);b.vx=a*300;b.vy=this.phase==='dive'?650:-700;b.life=1.7;b.pow=this.weaponText.text==='808 BOOMER'?1.2:1;this.projectiles.push(b)});
  }
  special(){this.specialReady=false;this.enemyShots.forEach(s=>s.destroy());this.enemyShots=[];this.enemies.forEach(e=>e.hp-=2);this.time.delayedCall(3200,()=>this.specialReady=true)}
  updateCombat(dt){
    this.projectiles.forEach(b=>{b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt});const target=this.phase==='car'?this.car:this.hero;
    this.enemies.forEach(e=>{e.x+=e.vx*dt;e.y+=e.vy*dt;e.cool-=dt;if(e.cool<=0&&target&&this.enemyShots.length<this.maxEnemyShots){e.cool=rnd(2.5,4.0);const a=Phaser.Math.Angle.Between(e.x,e.y,target.x,target.y);const s=this.add.circle(e.x,e.y,5,0xff4b41,1).setDepth(6);s.vx=Math.cos(a)*195;s.vy=Math.sin(a)*195;s.life=3.3;this.enemyShots.push(s)}});
    this.enemyShots.forEach(s=>{s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt});
    for(const b of this.projectiles){
      for(const e of this.enemies){if(!b.active||!e.active)continue;const r=e.vehicle?52:46;if(Phaser.Math.Distance.Between(b.x,b.y,e.x,e.y)<r){b.life=0;b.setActive(false).setVisible(false);e.hp-=b.pow;e.setTintFill(0xffffff);this.time.delayedCall(65,()=>{if(e.active)e.clearTint()});this.emitSparks(e.x,e.y,8);this.combo++;this.score+=100*this.combo;if(e.hp<=0){this.explode(e.x,e.y);e.destroy()}}}
      if(this.boss&&b.active&&Phaser.Math.Distance.Between(b.x,b.y,this.boss.x,this.boss.y)<this.boss.displayWidth*.31){b.life=0;b.setActive(false).setVisible(false);this.boss.hp-=b.pow;this.boss.setTintFill(0xffffff);this.time.delayedCall(55,()=>{if(this.boss&&this.boss.active)this.boss.clearTint()});this.emitSparks(b.x,b.y,9)}
    }
    if(target){for(const s of this.enemyShots){if(s.active&&Phaser.Math.Distance.Between(s.x,s.y,target.x,target.y)<35){s.destroy();this.combo=0;this.hp=Math.max(1,this.hp-1);this.cameras.main.shake(100,.008)}}}
    this.projectiles=this.projectiles.filter(b=>{if(!b.active||b.life<=0||b.y<-90||b.y>H+90){if(b.active)b.destroy();return false}return true});
    this.enemyShots=this.enemyShots.filter(s=>{if(!s.active||s.life<=0||s.y<-90||s.y>H+90||s.x<-90||s.x>W+90){if(s.active)s.destroy();return false}return true});
    this.enemies=this.enemies.filter(e=>{if(!e.active||e.y>H+130||e.y<-160||e.x<-170||e.x>W+170){if(e.active)e.destroy();return false}return true});
  }

  go(next,label){
    if(this.transitioning)return;this.transitioning=true;this.showPrompt(label,650);this.cameras.main.fadeOut(240,0,0,0);this.time.delayedCall(260,()=>{this.clearCombat();if(this.runwayBoss){this.runwayBoss.destroy();this.runwayBoss=null}this.phase=next;this.phaseT=0;this.turnBack=false;this.transitioning=false;this.jump={active:false,y:0,vy:0};this.cameras.main.setZoom(1);this.cameras.main.setRotation(0);this.cameras.main.fadeIn(260,0,0,0);if(next==='dive'){this.hero.setVisible(true).setPosition(W*.5,H*.40);this.weapon.setVisible(true)}if(next==='runway'){this.hero.setVisible(true).setPosition(W*.5,H*.78);this.weapon.setVisible(true)}})
  }
  clearCombat(){this.projectiles.forEach(x=>x.destroy());this.enemies.forEach(x=>x.destroy());this.enemyShots.forEach(x=>x.destroy());this.projectiles=[];this.enemies=[];this.enemyShots=[];this.enemyClock=.35}
  emitSparks(x,y,n){for(let i=0;i<n;i++){const p=this.add.circle(x,y,rnd(1.5,3.5),Math.random()<.5?0xff7547:0x68ddff,1).setDepth(10),a=rnd(0,Math.PI*2),d=rnd(25,75);this.tweens.add({targets:p,x:x+Math.cos(a)*d,y:y+Math.sin(a)*d,alpha:0,duration:rnd(180,360),onComplete:()=>p.destroy()})}}
  explode(x,y){const e=this.add.image(x,y,'explosion').setScale(.15).setBlendMode(Phaser.BlendModes.ADD).setDepth(10);this.tweens.add({targets:e,scale:.45,alpha:0,duration:320,onComplete:()=>e.destroy()})}
  showPrompt(s,ms){this.prompt.setText(s).setAlpha(1);this.tweens.killTweensOf(this.prompt);this.tweens.add({targets:this.prompt,alpha:0,delay:ms,duration:250})}
  updateHUD(){this.scoreText.setText(`SCORE ${String(Math.floor(this.score)).padStart(7,'0')}  COMBO x${this.combo}`);this.healthG.clear();for(let i=0;i<5;i++)this.healthG.fillStyle(i<this.hp?0xff4f48:0x25313d,1).fillRect(294+i*17,55,12,8);this.bossBar.clear();if(this.boss){this.bossBar.fillStyle(0x080c12,.8).fillRect(350,24,580,16);this.bossBar.fillStyle(0xff4a42,1).fillRect(350,24,580*clamp(this.boss.hp/this.boss.max,0,1),16)}}
  finish(){if(!this.started)return;this.started=false;this.clearCombat();this.song.pause();this.song.playbackRate=1;this.showPrompt('ALGORITHM CORE BROKEN',1000);this.time.delayedCall(1100,()=>{const ov=document.getElementById('start-overlay');document.querySelector('#start-overlay h1').textContent='MISSION COMPLETE';document.querySelector('#start-overlay p').innerHTML=`Score <strong>${Math.floor(this.score).toLocaleString()}</strong> · The signal survives.`;document.getElementById('start').textContent='PLAY AGAIN';ov.classList.remove('hidden')})}
}

const config={type:Phaser.WEBGL,parent:'game',width:W,height:H,backgroundColor:'#02050a',antialias:true,pixelArt:false,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[Aviator],render:{powerPreference:'high-performance',antialias:true,roundPixels:false}};
const game=new Phaser.Game(config);
document.getElementById('start').addEventListener('click',()=>{document.getElementById('start-overlay').classList.add('hidden');game.scene.getScene('Aviator').startExperience()});
})();