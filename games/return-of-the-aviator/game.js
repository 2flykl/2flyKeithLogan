(()=>{
'use strict';
const W=1280,H=720;
const SONG_URL='https://static.wixstatic.com/mp3/85e419_62dfb4b5acfc4747a02ad9eaeb643f29.mp3';
const clamp=Phaser.Math.Clamp,lerp=Phaser.Math.Linear,rnd=Phaser.Math.FloatBetween;

const BOT_TYPES={
 surveillance_orb:{label:'SURVEILLANCE',hp:2,scale:.62,shoot:false,behavior:'scan',score:175},
 censorship_bot:{label:'CENSORSHIP',hp:4,scale:.66,shoot:true,behavior:'block',score:350},
 swarm_controller:{label:'SWARM',hp:3,scale:.60,shoot:false,behavior:'swarm',score:275},
 manipulator:{label:'MANIPULATION',hp:3,scale:.64,shoot:false,behavior:'pulse',score:300},
 heavy_assault:{label:'AMPLIFICATION',hp:6,scale:.72,shoot:true,behavior:'heavy',score:500},
 stealth_interceptor:{label:'STEALTH',hp:2,scale:.58,shoot:false,behavior:'dash',score:225},
 interceptor:{label:'INTERRUPTION',hp:2,scale:.58,shoot:true,behavior:'dash',score:225},
 tracking_orb:{label:'TRACKING',hp:2,scale:.62,shoot:false,behavior:'track',score:180},
 moderation_turret:{label:'FILTER',hp:4,scale:.66,shoot:true,behavior:'filter',score:325},
 firewall_sentinel:{label:'FIREWALL',hp:5,scale:.68,shoot:false,behavior:'block',score:425},
 data_miner:{label:'DATA MINER',hp:4,scale:.70,shoot:false,behavior:'mine',score:375},
 manipulator_priest:{label:'CONSENSUS',hp:5,scale:.66,shoot:false,behavior:'pulse',score:425},
 corrupted_jammer:{label:'JAMMER',hp:4,scale:.66,shoot:false,behavior:'jam',score:375},
 shield_projector:{label:'SHIELD',hp:4,scale:.66,shoot:false,behavior:'shield',score:350}
};

class Aviator extends Phaser.Scene{
 constructor(){super('Aviator')}
 preload(){
  const A='assets/production/',B='assets/backgrounds/';
  const states={idle:4,walk:4,run:4,dive:4,fire:4,glide:4,hit:4,victory:3};
  Object.entries(states).forEach(([s,n])=>{for(let i=0;i<n;i++)this.load.image(`${s}${i}`,`${A}hero_${s}_${i}.png`)});
  Object.keys(BOT_TYPES).forEach(k=>this.load.image(`bot_${k}`,`${A}bot_${k}.png`));
  ['808_boomer','algorithm_boss','explosion','hero_car','enemy_car','enemy_truck'].forEach(k=>this.load.image(k,`${A}${k}.png`));
  ['sky','runway','runway_city','road','city','boss_storm','boss_arena'].forEach(k=>this.load.image(`bg_${k}`,`${B}${k}.jpg`));
  this.load.image('clouds',`${B}cloud_layer.png`);this.load.image('speedlines',`${B}speed_lines.png`);this.load.image('rain',`${B}rain.png`);
 }
 create(){
  this.started=false;this.phase='opening';this.phaseT=0;this.totalT=0;this.score=0;this.combo=0;this.hp=5;this.debug=false;
  this.fireCd=0;this.enemyClock=.8;this.specialReady=true;this.escapeTaps=0;this.turnBack=false;this.transitioning=false;this.floorPhase=0;
  this.shots=[];this.enemyShots=[];this.enemies=[];this.fx=[];this.maxEnemies=8;this.maxEnemyShots=8;this.maxFx=36;
  this.jump={active:false,y:0,vy:0};this.car=null;this.boss=null;this.runwayBoss=null;this.roadCurve=0;this.roadTarget=0;
  this.song=new Audio(SONG_URL);this.song.preload='auto';this.song.volume=.82;this.song.loop=false;this.song.playbackRate=1;
  try{this.song.preservesPitch=true}catch(e){}
  this.duration=128;this.lastMusicTime=0;this.musicStallT=0;
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

  this.bg=this.add.image(W/2,H/2,'bg_sky').setDisplaySize(W,H).setDepth(-30);
  this.bg2=this.add.image(W/2,H/2,'bg_runway_city').setDisplaySize(W,H).setAlpha(0).setDepth(-28);
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
 }
 makeCues(){const d=this.duration||128,o=clamp(d*.075,6,9);this.cues={opening:o,dive:d*.34,runway:d*.58,car:d*.80,end:d*.985}}
 async startExperience(){
  this.reset();this.started=true;this.song.pause();this.song.currentTime=0;this.song.playbackRate=1;
  try{await this.song.play();this.musicText.setText('♫ TOO FAST • MASTER CLOCK').setColor('#82efc4')}catch(e){this.musicText.setText('♫ AUDIO CLICK REQUIRED').setColor('#ff8178')}
  this.showPrompt('TAP ↑ / W — BREAK THE LOOP',1700);this.showThought('THE ALGORITHM LEARNS YOU BEFORE YOU LEARN IT.',2100);
 }
 reset(){
  this.phase='opening';this.phaseT=0;this.totalT=0;this.score=0;this.combo=0;this.hp=5;this.fireCd=0;this.enemyClock=.45;this.escapeTaps=0;this.turnBack=false;this.transitioning=false;this.floorPhase=0;this.jump={active:false,y:0,vy:0};
  this.clearScene();this.cameras.main.setZoom(1);this.cameras.main.setRotation(0);this.hero.setVisible(true).setPosition(W*.5,H*.53).setScale(.54).setRotation(0);this.setHeroState('idle');
  this.bg.setTexture('bg_sky').setDisplaySize(W,H).setPosition(W/2,H/2);this.bg2.setAlpha(0);this.lines.setAlpha(0);this.cloudNear.setAlpha(0);this.rain.setAlpha(0);
 }
 togglePause(){if(!this.started)return;if(this.scene.isPaused()){this.scene.resume();this.song.playbackRate=1;this.song.play().catch(()=>{})}else{this.scene.pause();this.song.pause()}}
 toggleDebug(){this.debug=!this.debug;this.debugText.setVisible(this.debug);document.getElementById('debug-help').classList.toggle('hidden',!this.debug)}
 devJump(p){
  const map={opening:0,dive:this.cues.opening+.1,runway:this.cues.dive+.1,car:this.cues.runway+.1,boss:this.cues.car+.1};
  this.song.currentTime=map[p]||0;this.phase=p;this.phaseT=0;this.transitioning=false;this.turnBack=false;this.jump={active:false,y:0,vy:0};this.clearCombatOnly();
  if(this.car){this.car.destroy();this.car=null}if(this.runwayBoss){this.runwayBoss.destroy();this.runwayBoss=null}if(this.boss){this.boss.destroy();this.boss=null}
  this.hero.setVisible(p!=='car');this.cameras.main.setZoom(1);this.cameras.main.setRotation(0);
 }
 time(){return Number.isFinite(this.song.currentTime)?this.song.currentTime:this.totalT}
 progress(a,b){return clamp((this.time()-a)/Math.max(.001,b-a),0,1)}
 left(){return this.cursors.left.isDown||this.keys.A.isDown}right(){return this.cursors.right.isDown||this.keys.D.isDown}up(){return this.cursors.up.isDown||this.keys.W.isDown}down(){return this.cursors.down.isDown||this.keys.S.isDown}

 update(t,ms){
  if(!this.started)return;const dt=Math.min(.03,ms/1000);this.totalT+=dt;this.phaseT+=dt;this.fireCd=Math.max(0,this.fireCd-dt);this.enemyClock-=dt;
  if(this.song.playbackRate!==1)this.song.playbackRate=1;
  this.animate(dt);
  if(this.phase==='opening')this.opening(dt);else if(this.phase==='dive')this.dive(dt);else if(this.phase==='runway')this.runway(dt);else if(this.phase==='car')this.carScene(dt);else if(this.phase==='boss')this.bossScene(dt);
  if(this.keys.FIRE.isDown&&this.fireCd<=0)this.fire();
  if(Phaser.Input.Keyboard.JustDown(this.keys.SPECIAL)&&this.specialReady)this.special();
  this.updateCombat(dt);this.updateHUD();
 }
 setHeroState(s){if(this.heroState===s)return;this.heroState=s;this.animIndex=0;this.animT=0;this.hero.setTexture(`${s}0`)}
 animate(dt){this.animT+=dt;const rate=this.heroState==='run'?.09:this.heroState==='dive'?.11:.14;if(this.animT>rate){this.animT=0;const max=this.heroState==='victory'?3:4;this.animIndex=(this.animIndex+1)%max;if(this.textures.exists(`${this.heroState}${this.animIndex}`))this.hero.setTexture(`${this.heroState}${this.animIndex}`)}}

 opening(dt){
  this.bg.setTexture('bg_sky');this.cloudFar.tilePositionY-=14*dt;this.hero.setPosition(W*.5,H*.55).setScale(.54);this.setHeroState('idle');
  if(Phaser.Input.Keyboard.JustDown(this.cursors.up)||Phaser.Input.Keyboard.JustDown(this.keys.W)){this.escapeTaps++;this.cameras.main.shake(65,.0025);this.emitSparks(W*.5+rnd(-160,160),H*.38+rnd(-70,70),5)}
  this.spawnEnemy('opening');const p=clamp(this.time()/this.cues.opening,0,1);if((p>.8&&this.escapeTaps>=5)||p>.98)this.go('dive','THE DIVE');
 }
 dive(dt){
  const p=this.progress(this.cues.opening,this.cues.dive);this.bg.setTexture('bg_sky');this.lines.setAlpha(.20);this.cloudNear.setAlpha(.09);this.cloudFar.tilePositionY-=110*dt;this.cloudNear.tilePositionY-=240*dt;this.lines.tilePositionY-=330*dt;
  this.setHeroState('dive');this.hero.setScale(.58);const h=(this.right()?1:0)-(this.left()?1:0),v=(this.down()?1:0)-(this.up()?1:0);this.hero.x=clamp(this.hero.x+h*400*dt,120,1160);this.hero.y=clamp(this.hero.y+v*340*dt,110,590);
  this.spawnEnemy('dive');
  if(p>.74&&this.weaponText.text.indexOf('808')<0){this.weaponText.setText('808 BOOMER // BASS PRESSURE');this.showPrompt('W.M.P. ACQUIRED — 808 BOOMER',1500);this.showThought('SOME SIGNALS ARE FELT BEFORE THEY ARE HEARD.',1700);this.cameras.main.flash(150,95,220,255)}
  if(p>=.995)this.go('runway','RUNWAY ESCAPE');
 }
 runway(dt){
  const p=this.progress(this.cues.dive,this.cues.runway);this.bg.setTexture('bg_runway').setDisplaySize(W,H);this.bg2.setTexture('bg_runway_city').setAlpha(.17);this.lines.setAlpha(.05);this.setHeroState('run');
  const h=(this.right()?1:0)-(this.left()?1:0);this.hero.x=clamp(this.hero.x+h*390*dt,145,1135);
  if(Phaser.Input.Keyboard.JustDown(this.cursors.up)||Phaser.Input.Keyboard.JustDown(this.keys.W)){if(!this.jump.active)this.jump={active:true,y:0,vy:-630}}
  if(this.jump.active){this.jump.vy+=1520*dt;this.jump.y+=this.jump.vy*dt;if(this.jump.y>=0)this.jump={active:false,y:0,vy:0}}
  if(!this.turnBack){this.hero.setScale(lerp(.56,.31,clamp(p/.5,0,1)));this.hero.y=lerp(H*.79,H*.48,clamp(p/.5,0,1))+this.jump.y}
  else{this.hero.setScale(.56);this.hero.y=H*.79+this.jump.y}
  if(p>.5&&!this.turnBack){this.turnBack=true;this.showPrompt('TURN — FACE WHAT FOLLOWS YOU',1100);this.showThought('THE MACHINE GETS LARGER WHEN YOU KEEP RUNNING FROM IT.',1900);this.cameras.main.shake(160,.005)}
  if(this.turnBack){if(!this.runwayBoss)this.runwayBoss=this.add.image(W/2,160,'algorithm_boss').setDepth(2).setScale(.10);const q=clamp((p-.5)/.5,0,1);this.runwayBoss.setScale(lerp(.1,1.23,q*q)).setY(lerp(165,265,q))}
  this.spawnEnemy('runway');if(p>=.995)this.go('car','ALGORITHM MAZE');
 }
 carScene(dt){
  const p=this.progress(this.cues.runway,this.cues.car);this.bg.setTexture('bg_road').setDisplaySize(W,H);this.bg2.setTexture('bg_city').setAlpha(.25);this.lines.setAlpha(.10);this.lines.tilePositionY-=220*dt;
  if(this.hero.visible)this.hero.setVisible(false);if(!this.car)this.car=this.add.image(W*.5,H*.73,'hero_car').setScale(.66).setDepth(5);
  const h=(this.right()?1:0)-(this.left()?1:0),v=(this.down()?1:0)-(this.up()?1:0);this.car.x=clamp(this.car.x+h*450*dt,150,1130);this.car.y=clamp(this.car.y+v*260*dt,H*.47,H*.87);this.car.rotation=lerp(this.car.rotation,h*.06,.09);
  if(Math.abs(this.roadCurve-this.roadTarget)<.04&&Math.random()<dt*.26)this.roadTarget=rnd(-1,1);this.roadCurve=lerp(this.roadCurve,this.roadTarget,dt*.45);this.bg.x=W/2+this.roadCurve*38;this.cameras.main.rotation=lerp(this.cameras.main.rotation,this.roadCurve*.012,.025);
  this.spawnEnemy('car');if(p>=.995)this.go('boss','THE ALGORITHM STORM');
 }
 bossScene(dt){
  const p=this.progress(this.cues.car,this.cues.end);this.bg.setTexture('bg_boss_storm').setDisplaySize(W,H);this.bg2.setTexture('bg_boss_arena').setAlpha(.16);this.rain.setAlpha(.18);this.rain.tilePositionY-=290*dt;
  if(this.car){this.car.destroy();this.car=null}this.hero.setVisible(true);this.setHeroState('fire');this.hero.setScale(.54);const h=(this.right()?1:0)-(this.left()?1:0);this.hero.x=clamp(this.hero.x+h*380*dt,140,1140);
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
 clearScene(){this.clearCombatOnly();if(this.car){this.car.destroy();this.car=null}if(this.boss){this.boss.destroy();this.boss=null}if(this.runwayBoss){this.runwayBoss.destroy();this.runwayBoss=null}}
 emitSparks(x,y,n){if(this.fx.length>this.maxFx)return;for(let i=0;i<n;i++){const p=this.add.rectangle(x,y,rnd(2,5),rnd(1,3),Math.random()<.5?0xff684f:0x72e6ff,1).setDepth(13),a=rnd(0,6.28),d=rnd(20,60);this.fx.push(p);this.tweens.add({targets:p,x:x+Math.cos(a)*d,y:y+Math.sin(a)*d,alpha:0,duration:rnd(160,300),onComplete:()=>{p.destroy();this.fx=this.fx.filter(q=>q!==p)}})}}
 explode(x,y){const ex=this.add.image(x,y,'explosion').setScale(.14).setBlendMode(Phaser.BlendModes.ADD).setDepth(12);this.tweens.add({targets:ex,scale:.38,alpha:0,duration:280,onComplete:()=>ex.destroy()})}
 showPrompt(s,ms){this.prompt.setText(s).setAlpha(1);this.tweens.killTweensOf(this.prompt);this.tweens.add({targets:this.prompt,alpha:0,delay:ms,duration:220})}
 showThought(s,ms){this.thought.setText(s).setAlpha(1);this.tweens.killTweensOf(this.thought);this.tweens.add({targets:this.thought,alpha:0,delay:ms,duration:420})}
 updateHUD(){
  this.scoreText.setText(`SCORE ${String(Math.floor(this.score)).padStart(7,'0')}  COMBO x${this.combo}`);this.healthG.clear();for(let i=0;i<5;i++)this.healthG.fillStyle(i<this.hp?0xff5148:0x24313d,1).fillRect(340+i*17,58,12,8);
  this.bossBar.clear();if(this.boss){this.bossBar.fillStyle(0x080c12,.82).fillRect(350,22,580,16);this.bossBar.fillStyle(0xff4d44,1).fillRect(350,22,580*clamp(this.boss.hp/this.boss.max,0,1),16)}
  if(this.debug)this.debugText.setText(`SCENE ${this.phase.toUpperCase()}\nFPS ${Math.round(this.game.loop.actualFps)}\nBOTS ${this.enemies.length}/${this.maxEnemies}\nENEMY SHOTS ${this.enemyShots.length}/${this.maxEnemyShots}\nPLAYER SHOTS ${this.shots.length}\nMUSIC ${this.time().toFixed(1)} / ${this.duration.toFixed(1)}`);
 }
 finish(){if(!this.started)return;this.started=false;this.clearCombatOnly();this.song.pause();this.song.playbackRate=1;this.setHeroState('victory');this.hero.setVisible(true).setPosition(W*.5,H*.55).setScale(.58);this.showPrompt('THE SIGNAL SURVIVES.',1200);this.showThought('AN ALGORITHM CAN PREDICT A CHOICE. IT CANNOT OWN ONE.',2500);this.time.delayedCall(2700,()=>{const ov=document.getElementById('start-overlay');document.querySelector('#start-overlay h1').innerHTML='MISSION<br>COMPLETE';document.querySelector('#start-overlay p').innerHTML=`Score <strong>${Math.floor(this.score).toLocaleString()}</strong> · You made it through without becoming the feed.`;document.getElementById('start').textContent='RUN IT BACK';ov.classList.remove('hidden')})}
}

const config={type:Phaser.WEBGL,parent:'game',width:W,height:H,backgroundColor:'#02050a',antialias:true,pixelArt:false,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[Aviator],render:{powerPreference:'high-performance',antialias:true,roundPixels:false}};
const game=new Phaser.Game(config);
document.getElementById('start').addEventListener('click',()=>{document.getElementById('start-overlay').classList.add('hidden');game.scene.getScene('Aviator').startExperience()});
})();