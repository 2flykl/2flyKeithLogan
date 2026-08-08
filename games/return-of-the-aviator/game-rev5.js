(()=>{
'use strict';
const W=1280,H=720;
const SONG_URL='https://static.wixstatic.com/mp3/85e419_62dfb4b5acfc4747a02ad9eaeb643f29.mp3';
const clamp=Phaser.Math.Clamp,lerp=Phaser.Math.Linear,rnd=Phaser.Math.FloatBetween;

const BOT_TYPES={
 surveillance_orb:{label:'SURVEILLANCE',hp:2,scale:.78,shoot:false,behavior:'scan',score:175},
 censorship_bot:{label:'CENSORSHIP',hp:4,scale:.84,shoot:true,behavior:'block',score:350},
 swarm_controller:{label:'SWARM',hp:3,scale:.76,shoot:false,behavior:'swarm',score:275},
 manipulator:{label:'MANIPULATION',hp:3,scale:.80,shoot:false,behavior:'pulse',score:300},
 heavy_assault:{label:'AMPLIFICATION',hp:6,scale:.88,shoot:true,behavior:'heavy',score:500},
 stealth_interceptor:{label:'STEALTH',hp:2,scale:.72,shoot:false,behavior:'dash',score:225},
 interceptor:{label:'INTERRUPTION',hp:2,scale:.72,shoot:true,behavior:'dash',score:225},
 tracking_orb:{label:'TRACKING',hp:2,scale:.78,shoot:false,behavior:'track',score:180},
 moderation_turret:{label:'FILTER',hp:4,scale:.82,shoot:true,behavior:'filter',score:325},
 firewall_sentinel:{label:'FIREWALL',hp:5,scale:.84,shoot:false,behavior:'block',score:425},
 data_miner:{label:'DATA MINER',hp:4,scale:.86,shoot:false,behavior:'mine',score:375},
 manipulator_priest:{label:'CONSENSUS',hp:5,scale:.82,shoot:false,behavior:'pulse',score:425},
 corrupted_jammer:{label:'JAMMER',hp:4,scale:.82,shoot:false,behavior:'jam',score:375},
 shield_projector:{label:'SHIELD',hp:4,scale:.82,shoot:false,behavior:'shield',score:350}
};

class Aviator extends Phaser.Scene{
 constructor(){super('Aviator')}
 preload(){
  const A='assets/production/',B='assets/backgrounds/';
  const states={idle:4,walk:4,run:4,dive:4,fire:4,glide:4,hit:4,victory:3};
  Object.entries(states).forEach(([s,n])=>{for(let i=0;i<n;i++)this.load.image(`${s}${i}`,`${A}v5_hero_${s}_${i}.png`)});
  Object.keys(BOT_TYPES).forEach(k=>this.load.image(`bot_${k}`,`${A}bot_${k}.png`));
  ['808_boomer','algorithm_boss','explosion','hero_car','hero_car_boost','hero_car_idle','hero_car_alt','plane_idle','plane_bank','plane_burn','plane_explode','enemy_car','enemy_truck'].forEach(k=>this.load.image(k,`${A}${k}.png`));
  ['sky','runway','runway_city','road','city','boss_storm','boss_arena'].forEach(k=>this.load.image(`bg_${k}`,`${B}${k}.jpg`));
  this.load.image('clouds',`${B}cloud_layer.png`);this.load.image('speedlines',`${B}speed_lines.png`);this.load.image('rain',`${B}rain.png`);
 }
 create(){
  this.started=false;this.phase='opening';this.phaseT=0;this.totalT=0;this.clockT=0;this.lastMusicTime=0;this.musicStallT=0;this.score=0;this.combo=0;this.hp=5;this.debug=false;
  this.fireCd=0;this.enemyClock=.8;this.specialReady=true;this.escapeTaps=0;this.turnBack=false;this.transitioning=false;this.floorPhase=0;
  this.shots=[];this.enemyShots=[];this.enemies=[];this.fx=[];this.maxEnemies=6;this.maxEnemyShots=5;this.maxFx=36;
  this.jump={active:false,y:0,vy:0};this.car=null;this.boss=null;this.runwayBoss=null;this.plane=null;this.roadCurve=0;this.roadTarget=0;
  this.song=new Audio(SONG_URL);this.song.preload='auto';this.song.volume=.82;this.song.loop=false;this.song.playbackRate=1;
  try{this.song.preservesPitch=true}catch(e){}
  this.duration=128;this.lastMusicTime=0;this.musicStallT=0;this.clockT=0;this.ready=false;this.audioRetryT=0;
  this.song.addEventListener('loadedmetadata',()=>{if(Number.isFinite(this.song.duration))this.duration=this.song.duration;this.makeCues()});this.makeCues();
  this.cursors=this.input.keyboard.createCursorKeys();
  this.keys=this.input.keyboard.addKeys({W:'W',A:'A',S:'S',D:'D',FIRE:'SPACE',SPECIAL:'SHIFT',P:'P',F2:'F2',ONE:'ONE',TWO:'TWO',THREE:'THREE',FOUR:'FOUR',FIVE:'FIVE'});
  this.input.keyboard.on('keydown-P',()=>this.togglePause());
  this.input.keyboard.on('keydown-F2',()=>this.toggleDebug());
  this.input.keyboard.on('keydown-ONE',()=>{if(this.debug)this.devJump('opening')});
  this.input.keyboard.on('keydown-TWO',()=>{if(this.debug)this.devJump('dive')});
  this.input.keyboard.on('keydown-THREE',()=>{if(this.debug)this.devJump('runway')});
  this.input.keyboard.on('keydown-FOUR',()=>{if(this.debug)this.devJump('car')});
  this.input.keyboard.on('keydown-FIVE',()=>{if(this.debug)this.devJump('boss')});

  this.bg=this.add.tileSprite(W/2,H/2,W,H,'bg_sky').setDepth(-30);
  this.bg2=this.add.tileSprite(W/2,H/2,W,H,'bg_runway_city').setAlpha(0).setDepth(-28);
  this.cloudFar=this.add.tileSprite(W/2,H/2,W*1.3,H,'clouds').setAlpha(.18).setDepth(-20);
  this.cloudNear=this.add.tileSprite(W/2,H/2,W*1.4,H,'clouds').setAlpha(0).setDepth(12).setBlendMode(Phaser.BlendModes.SCREEN);
  this.lines=this.add.tileSprite(W/2,H/2,W,H,'speedlines').setAlpha(0).setDepth(11).setBlendMode(Phaser.BlendModes.ADD);
  this.rain=this.add.tileSprite(W/2,H/2,W,H,'rain').setAlpha(0).setDepth(11).setBlendMode(Phaser.BlendModes.SCREEN);

  this.hero=this.add.image(W*.5,H*.53,'idle0').setDepth(5).setScale(.54);
  this.heroState='idle';this.animIndex=0;this.animT=0;

  this.hud=this.add.rectangle(242,72,450,104,0x02070c,.82).setDepth(40);
  this.title=this.add.text(28,24,'RETURN OF THE AVIATOR',{font:'900 24px Arial',color:'#fff'}).setDepth(41);
  this.weaponText=this.add.text(28,58,'TONEARM // WHOLE NOTE',{font:'700 15px Arial',color:'#62dcff'}).setDepth(41);
  this.musicText=this.add.text(242,58,'♫ TOO FAST • MASTER CLOCK',{font:'700 12px Arial',color:'#82efc4'}).setDepth(41);
  this.scoreText=this.add.text(28,84,'SCORE 0000000  COMBO x0',{font:'700 13px Arial',color:'#9eb1c4'}).setDepth(41);
  this.healthG=this.add.graphics().setDepth(41);this.bossBar=this.add.graphics().setDepth(41);

  this.prompt=this.add.text(W/2,H*.12,'',{font:'900 22px Arial',color:'#fff',backgroundColor:'rgba(0,0,0,.70)',padding:{x:17,y:10}}).setOrigin(.5).setDepth(45).setAlpha(0);
  this.thought=this.add.text(W/2,H*.84,'',{font:'800 17px Arial',color:'#8fe7ff',align:'center'}).setOrigin(.5).setDepth(43).setAlpha(0);
  this.debugText=this.add.text(W-12,12,'',{font:'700 11px monospace',color:'#8be7ff',align:'right',backgroundColor:'rgba(0,5,10,.72)',padding:{x:8,y:6}}).setOrigin(1,0).setDepth(50).setVisible(false);
  this.ready=true;window.dispatchEvent(new Event('aviator-ready'));this.input.on('pointerdown',()=>this.ensureAudio());this.input.keyboard.on('keydown',()=>this.ensureAudio());
 }
 makeCues(){const d=this.duration||128,o=clamp(d*.075,6,9);this.cues={opening:o,dive:d*.34,runway:d*.58,car:d*.80,end:d*.985}}
 async startExperience(){
  if(!this.ready)return;
  this.reset();this.started=true;this.clockT=0;this.lastMusicTime=0;this.musicStallT=0;this.song.pause();
  try{this.song.currentTime=0}catch(e){}this.song.playbackRate=1;
  this.ensureAudio(true);
  this.showPrompt('TAP ↑ / W — BREAK THE LOOP',1700);this.showThought('THE ALGORITHM LEARNS YOU BEFORE YOU LEARN IT.',2100);
 }
 reset(){
  this.phase='opening';this.phaseT=0;this.totalT=0;this.clockT=0;this.lastMusicTime=0;this.musicStallT=0;this.score=0;this.combo=0;this.hp=5;this.fireCd=0;this.enemyClock=.45;this.escapeTaps=0;this.turnBack=false;this.transitioning=false;this.floorPhase=0;this.jump={active:false,y:0,vy:0};
  this.clearScene();this.cameras.main.setZoom(1);this.cameras.main.setRotation(0);this.hero.setVisible(true).setPosition(W*.5,H*.53).setScale(.54).setRotation(0);this.setHeroState('idle');
  this.bg.setTexture('bg_sky').setPosition(W/2,H/2);this.bg.tilePositionX=0;this.bg.tilePositionY=0;this.bg2.setAlpha(0);this.bg2.tilePositionX=0;this.bg2.tilePositionY=0;this.lines.setAlpha(0);this.cloudNear.setAlpha(0);this.rain.setAlpha(0);
 }
 togglePause(){if(!this.started)return;if(this.scene.isPaused()){this.scene.resume();this.song.playbackRate=1;this.song.play().catch(()=>{})}else{this.scene.pause();this.song.pause()}}
 toggleDebug(){this.debug=!this.debug;this.debugText.setVisible(this.debug);document.getElementById('debug-help').classList.toggle('hidden',!this.debug)}
 devJump(p){
  const map={opening:0,dive:this.cues.opening+.1,runway:this.cues.dive+.1,car:this.cues.runway+.1,boss:this.cues.car+.1};
  this.song.currentTime=map[p]||0;this.phase=p;this.phaseT=0;this.transitioning=false;this.turnBack=false;this.jump={active:false,y:0,vy:0};this.clearCombatOnly();
  if(this.car){this.car.destroy();this.car=null}if(this.runwayBoss){this.runwayBoss.destroy();this.runwayBoss=null}if(this.boss){this.boss.destroy();this.boss=null}
  this.hero.setVisible(p!=='car');this.cameras.main.setZoom(1);this.cameras.main.setRotation(0);
 }
 ensureAudio(force=false){
  if(!this.started||!this.song)return;
  if(!force&&!this.song.paused)return;
  try{if(this.clockT>0.4&&Number.isFinite(this.song.duration))this.song.currentTime=Math.min(this.clockT,Math.max(0,this.song.duration-.2));}catch(e){}
  const p=this.song.play();if(p&&p.then)p.then(()=>{this.musicText.setText('♫ TOO FAST • MASTER CLOCK').setColor('#82efc4')}).catch(()=>{this.musicText.setText('♫ TOO FAST • PRESS ANY KEY').setColor('#ffb06b')});
 }
 time(){return this.clockT}
 progress(a,b){return clamp((this.time()-a)/Math.max(.001,b-a),0,1)}
 left(){return this.cursors.left.isDown||this.keys.A.isDown}right(){return this.cursors.right.isDown||this.keys.D.isDown}up(){return this.cursors.up.isDown||this.keys.W.isDown}down(){return this.cursors.down.isDown||this.keys.S.isDown}

 update(t,ms){
  if(!this.started)return;const dt=Math.min(.03,ms/1000);this.totalT+=dt;this.phaseT+=dt;this.fireCd=Math.max(0,this.fireCd-dt);this.enemyClock-=dt;
  if(this.song.playbackRate!==1)this.song.playbackRate=1;
  const at=Number.isFinite(this.song.currentTime)?this.song.currentTime:0;
  if(!this.song.paused&&at>this.lastMusicTime+.004){this.clockT=Math.max(this.clockT,at);this.lastMusicTime=at;this.musicStallT=0;}
  else{this.musicStallT+=dt;if(this.musicStallT>.35)this.clockT+=dt;}
  this.audioRetryT-=dt;if(this.song.paused&&this.audioRetryT<=0){this.audioRetryT=2.5;this.musicText.setText('♫ TOO FAST • PRESS ANY KEY').setColor('#ffb06b');}
  this.animate(dt);
  if(this.phase==='opening')this.opening(dt);else if(this.phase==='dive')this.dive(dt);else if(this.phase==='runway')this.runway(dt);else if(this.phase==='car')this.carScene(dt);else if(this.phase==='boss')this.bossScene(dt);
  if(this.keys.FIRE.isDown&&this.fireCd<=0)this.fire();
  if(Phaser.Input.Keyboard.JustDown(this.keys.SPECIAL)&&this.specialReady)this.special();
  this.updateCombat(dt);this.updateHUD();
 }
 setHeroState(s){if(this.heroState===s)return;this.heroState=s;this.animIndex=0;this.animT=0;this.hero.setTexture(`${s}0`)}
 setHeroHeight(h){const nh=this.hero.height||1;this.hero.setScale(h/nh);return this.hero}
 animate(dt){this.animT+=dt;const rate=this.heroState==='run'?.09:this.heroState==='dive'?.11:.14;if(this.animT>rate){this.animT=0;const max=this.heroState==='victory'?3:4;this.animIndex=(this.animIndex+1)%max;if(this.textures.exists(`${this.heroState}${this.animIndex}`))this.hero.setTexture(`${this.heroState}${this.animIndex}`)}}

 opening(dt){
  const p=clamp(this.time()/this.cues.opening,0,1);
  this.bg.setTexture('bg_sky');this.bg.tilePositionY-=34*dt;this.bg.tilePositionX+=7*dt;
  this.cloudFar.tilePositionY-=22*dt;this.cloudNear.setAlpha(.08);this.cloudNear.tilePositionY-=52*dt;this.rain.setAlpha(.04);this.rain.tilePositionY-=90*dt;
  if(!this.plane)this.plane=this.add.image(W*.52,H*.35,'plane_idle').setDepth(3).setScale(.92);
  this.plane.x=W*.52+Math.sin(this.phaseT*1.15)*28;this.plane.y=H*.35+Math.sin(this.phaseT*1.9)*10;
  if(p>.34&&p<=.62)this.plane.setTexture('plane_bank');
  if(p>.62&&p<=.84)this.plane.setTexture('plane_burn');
  if(p>.84)this.plane.setTexture('plane_explode').setScale(1.02);
  this.hero.setVisible(false);
  if(Phaser.Input.Keyboard.JustDown(this.cursors.up)||Phaser.Input.Keyboard.JustDown(this.keys.W)){this.escapeTaps++;this.cameras.main.shake(65,.0025);this.emitSparks(this.plane.x+rnd(-110,110),this.plane.y+rnd(-55,55),5);this.ensureAudio()}
  this.spawnEnemy('opening');
  if(p>.91){if(this.plane){this.plane.destroy();this.plane=null}this.hero.setVisible(true).setTexture('dive0').setPosition(W*.52,H*.32);this.setHeroHeight(150);this.hero.y+=clamp((p-.91)/.09,0,1)*180;}
  if((p>.82&&this.escapeTaps>=5)||p>.985)this.go('dive','THE DIVE');
 }
 dive(dt){
  const p=this.progress(this.cues.opening,this.cues.dive);this.bg.setTexture('bg_sky');this.bg.tilePositionY-=185*dt;this.bg.tilePositionX+=9*dt;this.lines.setAlpha(.20);this.cloudNear.setAlpha(.09);this.rain.setAlpha(.06);this.cloudFar.tilePositionY-=125*dt;this.cloudNear.tilePositionY-=270*dt;this.lines.tilePositionY-=370*dt;this.rain.tilePositionY-=250*dt;
  if(this.plane){this.plane.destroy();this.plane=null}
  this.setHeroState('dive');this.setHeroHeight(190);this.hero.setVisible(true).setRotation(0);const h=(this.right()?1:0)-(this.left()?1:0),v=(this.down()?1:0)-(this.up()?1:0);this.hero.x=clamp(this.hero.x+h*400*dt,120,1160);this.hero.y=clamp(this.hero.y+v*340*dt,110,590);
  this.spawnEnemy('dive');
  if(p>.72&&this.weaponText.text.indexOf('808')<0){this.weaponText.setText('808 BOOMER // BASS PRESSURE');this.showPrompt('W.M.P. ACQUIRED — 808 BOOMER',1500);this.showThought('SOME SIGNALS ARE FELT BEFORE THEY ARE HEARD.',1700);this.cameras.main.flash(150,95,220,255)}
  if(p>=.995)this.go('runway','RUNWAY ESCAPE');
 }
 runway(dt){
  const p=this.progress(this.cues.dive,this.cues.runway);this.bg.setTexture('bg_runway');this.bg2.setTexture('bg_runway_city').setAlpha(.18);this.bg.tilePositionY+=(!this.turnBack?320:-250)*dt;this.bg2.tilePositionY+=(!this.turnBack?135:-100)*dt;this.lines.setAlpha(.10);this.lines.tilePositionY+=(!this.turnBack?260:-210)*dt;this.setHeroState('run');
  const h=(this.right()?1:0)-(this.left()?1:0);this.hero.x=clamp(this.hero.x+h*390*dt,145,1135);
  if(Phaser.Input.Keyboard.JustDown(this.cursors.up)||Phaser.Input.Keyboard.JustDown(this.keys.W)){if(!this.jump.active)this.jump={active:true,y:0,vy:-630}}
  if(this.jump.active){this.jump.vy+=1520*dt;this.jump.y+=this.jump.vy*dt;if(this.jump.y>=0)this.jump={active:false,y:0,vy:0}}
  if(!this.turnBack){this.setHeroHeight(lerp(205,112,clamp(p/.5,0,1)));this.hero.y=lerp(H*.79,H*.48,clamp(p/.5,0,1))+this.jump.y}
  else{this.setHeroHeight(lerp(130,215,clamp((p-.5)/.5,0,1)));this.hero.y=H*.79+this.jump.y}
  if(p>.5&&!this.turnBack){this.turnBack=true;this.showPrompt('TURN — FACE WHAT FOLLOWS YOU',1100);this.showThought('THE MACHINE GETS LARGER WHEN YOU STOP RUNNING FROM IT.',1900);this.cameras.main.shake(160,.005)}
  if(this.turnBack){if(!this.runwayBoss)this.runwayBoss=this.add.image(W/2,160,'algorithm_boss').setDepth(2).setScale(.10);const q=clamp((p-.5)/.5,0,1);this.runwayBoss.setScale(lerp(.1,1.23,q*q)).setY(lerp(165,265,q))}
  this.spawnEnemy('runway');if(p>=.995)this.go('car','ALGORITHM MAZE');
 }
 carScene(dt){
  const p=this.progress(this.cues.runway,this.cues.car);this.bg.setTexture('bg_road');this.bg2.setTexture('bg_city').setAlpha(.28);this.bg.tilePositionY+=480*dt;this.bg2.tilePositionY+=145*dt;this.lines.setAlpha(.14);this.lines.tilePositionY+=560*dt;
  if(this.hero.visible)this.hero.setVisible(false);if(!this.car){this.car=this.add.image(W*.5,H*.73,'hero_car').setScale(.92).setDepth(5);this.weaponText.setText('THE GRAND // PIANO TANK')}
  const h=(this.right()?1:0)-(this.left()?1:0),v=(this.down()?1:0)-(this.up()?1:0);this.car.x=clamp(this.car.x+h*450*dt,150,1130);this.car.y=clamp(this.car.y+v*260*dt,H*.47,H*.87);this.car.rotation=lerp(this.car.rotation,h*.06,.09);
  if(Math.abs(this.roadCurve-this.roadTarget)<.04&&Math.random()<dt*.26)this.roadTarget=rnd(-1,1);this.roadCurve=lerp(this.roadCurve,this.roadTarget,dt*.45);this.bg.tilePositionX+=this.roadCurve*60*dt;this.bg2.tilePositionX+=this.roadCurve*22*dt;this.cameras.main.rotation=lerp(this.cameras.main.rotation,this.roadCurve*.012,.025);
  this.spawnEnemy('car');if(p>=.995)this.go('boss','THE ALGORITHM STORM');
 }
 bossScene(dt){
  const p=this.progress(this.cues.car,this.cues.end);this.bg.setTexture('bg_boss_storm');this.bg2.setTexture('bg_boss_arena').setAlpha(.20);this.bg.tilePositionX+=35*dt;this.bg.tilePositionY+=(this.floorPhase>=2?190:42)*dt;this.bg2.tilePositionY+=(this.floorPhase>=2?250:55)*dt;this.rain.setAlpha(.18);this.rain.tilePositionY-=300*dt;
  if(this.car){this.car.destroy();this.car=null;this.weaponText.setText('808 BOOMER // BASS PRESSURE')}this.hero.setVisible(true);this.setHeroState('fire');this.setHeroHeight(205);const h=(this.right()?1:0)-(this.left()?1:0);this.hero.x=clamp(this.hero.x+h*380*dt,140,1140);
  if(Phaser.Input.Keyboard.JustDown(this.cursors.up)||Phaser.Input.Keyboard.JustDown(this.keys.W)){if(!this.jump.active)this.jump={active:true,y:0,vy:-615}}if(this.jump.active){this.jump.vy+=1500*dt;this.jump.y+=this.jump.vy*dt;if(this.jump.y>=0)this.jump={active:false,y:0,vy:0}}this.hero.y=H*.79+this.jump.y;
  if(!this.boss){this.boss=this.add.image(W/2,190,'algorithm_boss').setScale(.84).setDepth(3);this.boss.hp=120;this.boss.max=120}
  const lost=1-this.boss.hp/this.boss.max;this.boss.x=W/2+Math.sin(this.totalT*.68)*225;this.boss.y=188+Math.sin(this.totalT*1.03)*24;this.boss.setScale(clamp(.84+.13*Math.sin(this.totalT*.45)+.09*Math.sin(this.totalT*.16)+(lost>.6?.14:0),.70,1.17));this.cameras.main.setZoom(1+.035*Math.sin(this.totalT*.32));
  if(lost>.33&&this.floorPhase===0){this.floorPhase=1;this.showPrompt('THE FLOOR WAS NEVER SOLID.',1200);this.showThought('WHEN THE SYSTEM BREAKS, YOU FIND OUT WHAT WAS HOLDING YOU UP.',2100);this.cameras.main.shake(550,.013);this.time.delayedCall(700,()=>this.floorPhase=2)}
  this.spawnEnemy('boss');if(p>.93&&this.boss.hp>8)this.boss.hp-=dt*.7;if(this.boss.hp<=0||p>.997)this.finish();
 }

 chooseType(scene){
  const pools={
   opening:['surveillance_orb','tracking_orb','interceptor'],
   dive:['surveillance_orb','stealth_interceptor','interceptor','swarm_controller'],
   runway:['censorship_bot','moderation_turret','firewall_sentinel','tracking_orb'],
   car:['data_miner','corrupted_jammer','heavy_assault','interceptor'],
   boss:['manipulator','manipulator_priest','shield_projector','heavy_assault','censorship_bot']
  };
  const a=pools[scene]||pools.opening;return a[Math.floor(Math.random()*a.length)];
 }
 spawnEnemy(scene){
  if(this.enemyClock>0||this.enemies.length>=this.maxEnemies)return;
  const gaps={opening:[1.2,1.7],dive:[.85,1.25],runway:[1.0,1.45],car:[.85,1.25],boss:[1.0,1.4]},g=gaps[scene];this.enemyClock=rnd(g[0],g[1]);
  const type=this.chooseType(scene),def=BOT_TYPES[type];
  let x=rnd(120,1160),y=scene==='dive'?H+90:rnd(125,285);
  const e=this.add.image(x,y,`bot_${type}`).setScale(def.scale).setDepth(4);
  e.type=type;e.def=def;e.hp=def.hp;e.max=def.hp;e.baseScale=def.scale;e.age=0;e.cool=rnd(3.4,5.2);e.vx=rnd(-28,28);e.vy=scene==='dive'?-rnd(95,155):rnd(18,50);e.phase=rnd(0,6.28);
  e.tag=this.add.text(x,y-e.displayHeight*.42,def.label,{font:'800 10px monospace',color:'#73dfff',backgroundColor:'rgba(0,0,0,.56)',padding:{x:5,y:2}}).setOrigin(.5).setDepth(5);
  this.enemies.push(e);
 }
 fire(){
  this.fireCd=this.weaponText.text.indexOf('808')>=0?.18:.25;const src=this.phase==='car'?this.car:this.hero;if(!src)return;
  const heavy=this.weaponText.text.indexOf('808')>=0,spreads=heavy?[-.055,0,.055]:[0];
  spreads.forEach(a=>{const b=this.add.circle(src.x,src.y-(this.phase==='dive'?-28:28),heavy?7:5,0x6be8ff,1).setDepth(9);b.vx=a*280;b.vy=this.phase==='dive'?620:-660;b.life=1.8;b.pow=heavy?1.25:1;this.shots.push(b)});
 }
 special(){this.specialReady=false;this.enemyShots.forEach(s=>s.destroy());this.enemyShots=[];const src=this.phase==='car'?this.car:this.hero;if(src){const r=this.add.circle(src.x,src.y,30,0x69e7ff,.06).setStrokeStyle(5,0x69e7ff,.9).setDepth(15);this.tweens.add({targets:r,scale:9,alpha:0,duration:650,onComplete:()=>r.destroy()})}this.enemies.forEach(e=>e.hp-=1.5);this.time.delayedCall(3600,()=>this.specialReady=true)}
 updateCombat(dt){
  const target=this.phase==='car'?this.car:this.hero;
  this.shots.forEach(b=>{b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt});
  this.enemies.forEach(e=>{
   e.age+=dt;e.cool-=dt;
   // Symbolic movement behaviors
   if(e.def.behavior==='scan'){e.x+=Math.sin(e.age*1.8+e.phase)*36*dt;e.y+=e.vy*dt}
   else if(e.def.behavior==='track'&&target){e.x+=clamp(target.x-e.x,-70,70)*dt*.35;e.y+=e.vy*dt}
   else if(e.def.behavior==='dash'){e.x+=Math.sin(e.age*2.8+e.phase)*110*dt;e.y+=e.vy*dt}
   else if(e.def.behavior==='block'){e.x+=Math.sin(e.age*.9+e.phase)*20*dt;e.y+=e.vy*.45*dt}
   else if(e.def.behavior==='pulse'){e.x+=e.vx*.5*dt;e.y+=e.vy*.4*dt;e.setScale(e.baseScale*(1+.035*Math.sin(e.age*3)))}
   else if(e.def.behavior==='jam'){e.x+=Math.sin(e.age*2+e.phase)*55*dt;e.y+=e.vy*.6*dt}
   else{e.x+=e.vx*dt;e.y+=e.vy*dt}
   if(e.tag&&e.tag.active)e.tag.setPosition(e.x,e.y-e.displayHeight*.42);
   // Fewer shots: only some types shoot, long telegraph cadence
   if(e.def.shoot&&e.cool<=0&&target&&this.enemyShots.length<this.maxEnemyShots){
    e.cool=rnd(3.6,5.4);
    const ring=this.add.circle(e.x,e.y,18,0xff4b41,.03).setStrokeStyle(3,0xff4b41,.9).setDepth(8);this.tweens.add({targets:ring,scale:2.2,alpha:0,duration:420,onComplete:()=>ring.destroy()});
    this.time.delayedCall(320,()=>{if(!e.active||!target)return;const a=Phaser.Math.Angle.Between(e.x,e.y,target.x,target.y);const s=this.add.circle(e.x,e.y,6,0xff5147,1).setDepth(8);s.vx=Math.cos(a)*175;s.vy=Math.sin(a)*175;s.life=4;this.enemyShots.push(s)});
   }
  });
  this.enemyShots.forEach(s=>{s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt});
  for(const b of this.shots){
   for(const e of this.enemies){if(!b.active||!e.active)continue;const r=Math.max(46,e.displayWidth*.18);if(Phaser.Math.Distance.Between(b.x,b.y,e.x,e.y)<r){b.life=0;b.setActive(false).setVisible(false);e.hp-=b.pow;e.setTintFill(0xffffff);this.time.delayedCall(60,()=>{if(e.active)e.clearTint()});this.emitSparks(e.x,e.y,5);this.combo++;this.score+=e.def.score;if(e.hp<=0){this.destroyEnemy(e)}}}
   if(this.boss&&b.active&&Phaser.Math.Distance.Between(b.x,b.y,this.boss.x,this.boss.y)<this.boss.displayWidth*.31){b.life=0;b.setActive(false).setVisible(false);this.boss.hp-=b.pow;this.boss.setTintFill(0xffffff);this.time.delayedCall(50,()=>{if(this.boss&&this.boss.active)this.boss.clearTint()})}
  }
  if(target){for(const s of this.enemyShots){if(s.active&&Phaser.Math.Distance.Between(s.x,s.y,target.x,target.y)<34){s.destroy();this.combo=0;this.hp=Math.max(1,this.hp-1);this.cameras.main.shake(90,.006)}}}
  this.shots=this.shots.filter(b=>{if(!b.active||b.life<=0||b.y<-100||b.y>H+100){if(b.active)b.destroy();return false}return true});
  this.enemyShots=this.enemyShots.filter(s=>{if(!s.active||s.life<=0||s.y<-100||s.y>H+100||s.x<-100||s.x>W+100){if(s.active)s.destroy();return false}return true});
  this.enemies=this.enemies.filter(e=>{if(!e.active||e.y>H+160||e.y<-180||e.x<-190||e.x>W+190){if(e.tag&&e.tag.active)e.tag.destroy();if(e.active)e.destroy();return false}return true});
 }
 destroyEnemy(e){
  if(e.tag&&e.tag.active)e.tag.destroy();
  // glitch breakup instead of instant disappearance
  const ghost=this.add.image(e.x,e.y,e.texture.key).setScale(e.scaleX).setTint(0xff574e).setAlpha(.8).setDepth(10);
  this.tweens.add({targets:ghost,scaleX:e.scaleX*1.18,scaleY:e.scaleY*.82,alpha:0,x:e.x+rnd(-20,20),duration:230,onComplete:()=>ghost.destroy()});
  this.explode(e.x,e.y);e.destroy();
 }
 go(next,label){
  if(this.transitioning)return;this.transitioning=true;this.showPrompt(label,600);this.cameras.main.fadeOut(220,0,0,0);this.time.delayedCall(235,()=>{this.clearCombatOnly();if(this.runwayBoss){this.runwayBoss.destroy();this.runwayBoss=null}this.phase=next;this.phaseT=0;this.turnBack=false;this.transitioning=false;this.jump={active:false,y:0,vy:0};this.cameras.main.setZoom(1);this.cameras.main.setRotation(0);this.cameras.main.fadeIn(230,0,0,0);if(next==='dive')this.hero.setVisible(true).setPosition(W*.5,H*.42);if(next==='runway')this.hero.setVisible(true).setPosition(W*.5,H*.79)})
 }
 clearCombatOnly(){this.shots.forEach(x=>x.destroy());this.enemyShots.forEach(x=>x.destroy());this.enemies.forEach(e=>{if(e.tag&&e.tag.active)e.tag.destroy();e.destroy()});this.shots=[];this.enemyShots=[];this.enemies=[];this.enemyClock=.45}
 clearScene(){this.clearCombatOnly();if(this.car){this.car.destroy();this.car=null}if(this.boss){this.boss.destroy();this.boss=null}if(this.runwayBoss){this.runwayBoss.destroy();this.runwayBoss=null}if(this.plane){this.plane.destroy();this.plane=null}}
 emitSparks(x,y,n){if(this.fx.length>this.maxFx)return;for(let i=0;i<n;i++){const p=this.add.rectangle(x,y,rnd(2,5),rnd(1,3),Math.random()<.5?0xff684f:0x72e6ff,1).setDepth(13),a=rnd(0,6.28),d=rnd(20,60);this.fx.push(p);this.tweens.add({targets:p,x:x+Math.cos(a)*d,y:y+Math.sin(a)*d,alpha:0,duration:rnd(160,300),onComplete:()=>{p.destroy();this.fx=this.fx.filter(q=>q!==p)}})}}
 explode(x,y){const ex=this.add.image(x,y,'explosion').setScale(.14).setBlendMode(Phaser.BlendModes.ADD).setDepth(12);this.tweens.add({targets:ex,scale:.38,alpha:0,duration:280,onComplete:()=>ex.destroy()})}
 showPrompt(s,ms){this.prompt.setText(s).setAlpha(1);this.tweens.killTweensOf(this.prompt);this.tweens.add({targets:this.prompt,alpha:0,delay:ms,duration:220})}
 showThought(s,ms){this.thought.setText(s).setAlpha(1);this.tweens.killTweensOf(this.thought);this.tweens.add({targets:this.thought,alpha:0,delay:ms,duration:420})}
 updateHUD(){
  this.scoreText.setText(`SCORE ${String(Math.floor(this.score)).padStart(7,'0')}  COMBO x${this.combo}`);this.healthG.clear();for(let i=0;i<5;i++)this.healthG.fillStyle(i<this.hp?0xff5148:0x24313d,1).fillRect(340+i*17,58,12,8);
  this.bossBar.clear();if(this.boss){this.bossBar.fillStyle(0x080c12,.82).fillRect(350,22,580,16);this.bossBar.fillStyle(0xff4d44,1).fillRect(350,22,580*clamp(this.boss.hp/this.boss.max,0,1),16)}
  if(this.debug)this.debugText.setText(`SCENE ${this.phase.toUpperCase()}\nFPS ${Math.round(this.game.loop.actualFps)}\nBOTS ${this.enemies.length}/${this.maxEnemies}\nENEMY SHOTS ${this.enemyShots.length}/${this.maxEnemyShots}\nPLAYER SHOTS ${this.shots.length}\nMUSIC ${this.time().toFixed(1)} / ${this.duration.toFixed(1)}`);
 }
 finish(){if(!this.started)return;this.started=false;this.clearCombatOnly();this.song.pause();this.song.playbackRate=1;this.setHeroState('victory');this.hero.setVisible(true).setPosition(W*.5,H*.55);this.setHeroHeight(220);this.showPrompt('THE SIGNAL SURVIVES.',1200);this.showThought('AN ALGORITHM CAN PREDICT A CHOICE. IT CANNOT OWN ONE.',2500);this.time.delayedCall(2700,()=>{const ov=document.getElementById('start-overlay');document.querySelector('#start-overlay h1').innerHTML='MISSION<br>COMPLETE';document.querySelector('#start-overlay p').innerHTML=`Score <strong>${Math.floor(this.score).toLocaleString()}</strong> · You made it through without becoming the feed.`;document.getElementById('start').textContent='RUN IT BACK';ov.classList.remove('hidden')})}
}

const config={type:Phaser.WEBGL,parent:'game',width:W,height:H,backgroundColor:'#02050a',antialias:true,pixelArt:false,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[Aviator],render:{powerPreference:'high-performance',antialias:true,roundPixels:false}};
const game=new Phaser.Game(config);
const btn=document.getElementById('start');btn.disabled=true;btn.textContent='LOADING FLIGHT SYSTEMS…';
const armStart=()=>{const s=game.scene.getScene('Aviator');if(s&&s.ready){btn.disabled=false;btn.textContent='ENTER THE SIGNAL';return true}return false};window.addEventListener('aviator-ready',armStart);const readyPoll=setInterval(()=>{if(armStart())clearInterval(readyPoll)},120);
const begin=()=>{const s=game.scene.getScene('Aviator');if(!s||!s.ready)return;document.getElementById('start-overlay').classList.add('hidden');s.startExperience()};
btn.addEventListener('click',begin);window.addEventListener('keydown',e=>{if(document.getElementById('start-overlay').classList.contains('hidden'))return;if((e.key==='Enter'||e.key===' ')&&!btn.disabled){e.preventDefault();begin()}});
})();