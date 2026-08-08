(()=>{
'use strict';
const SONG_URL='https://static.wixstatic.com/mp3/85e419_62dfb4b5acfc4747a02ad9eaeb643f29.mp3';
const W=1280,H=720;
const clamp=Phaser.Math.Clamp;
const lerp=Phaser.Math.Linear;
const rand=(a,b)=>Phaser.Math.FloatBetween(a,b);

class AviatorScene extends Phaser.Scene{
  constructor(){super('Aviator');}
  preload(){
    const A='assets/production/',B='assets/backgrounds/';
    for(let i=0;i<4;i++){this.load.image(`idle${i}`,`${A}hero_idle_${i}.png`);this.load.image(`run${i}`,`${A}hero_run_${i}.png`);this.load.image(`dive${i}`,`${A}hero_dive_${i}.png`)}
    for(let i=0;i<3;i++)this.load.image(`fire${i}`,`${A}hero_fire_${i}.png`);
    ['tonearm','808_boomer','sampler_cannon','feedback_axe','drum_machine','mic_drop','algorithm_boss','algorithm_bot','homing_missile','explosion','hero_car','enemy_car','enemy_truck'].forEach(k=>this.load.image(k,`${A}${k}.png`));
    ['sky','runway','runway_city','road','road_curve','city','boss_storm','boss_arena'].forEach(k=>this.load.image(`bg_${k}`,`${B}${k}.jpg`));
    this.load.image('clouds',`${B}cloud_layer.png`);this.load.image('speedlines',`${B}speed_lines.png`);this.load.image('rain',`${B}rain.png`);
  }
  create(){
    this.started=false;this.phase='opening';this.phaseT=0;this.score=0;this.combo=0;this.hp=5;this.fireCooldown=0;this.special=1;
    this.song=new Audio(SONG_URL);this.song.preload='auto';this.song.volume=.84;this.duration=128;
    this.song.addEventListener('loadedmetadata',()=>{this.duration=this.song.duration||128;this.makeCues()});
    this.makeCues();
    this.keys=this.input.keyboard.addKeys({left:'LEFT',right:'RIGHT',up:'UP',down:'DOWN',a:'A',d:'D',w:'W',s:'S',fire:'SPACE',special:'SHIFT',pause:'P'});
    this.input.keyboard.on('keydown-P',()=>{if(!this.started)return;this.scene.isPaused()?this.scene.resume():this.scene.pause();if(this.scene.isPaused())this.song.pause();else this.song.play().catch(()=>{})});
    this.cameras.main.setBackgroundColor('#02050a');
    this.bg=this.add.image(W/2,H/2,'bg_sky').setDisplaySize(W,H).setDepth(-20);
    this.bg2=this.add.image(W/2,H/2,'bg_runway_city').setDisplaySize(W,H).setAlpha(0).setDepth(-19);
    this.cloudFar=this.add.tileSprite(W/2,H/2,W*1.25,H,'clouds').setAlpha(.22).setDepth(-15);
    this.cloudNear=this.add.tileSprite(W/2,H/2,W*1.35,H,'clouds').setAlpha(.0).setDepth(8).setBlendMode(Phaser.BlendModes.SCREEN);
    this.lines=this.add.tileSprite(W/2,H/2,W,H,'speedlines').setAlpha(0).setDepth(7).setBlendMode(Phaser.BlendModes.ADD);
    this.rain=this.add.tileSprite(W/2,H/2,W,H,'rain').setAlpha(0).setDepth(7).setBlendMode(Phaser.BlendModes.SCREEN);

    this.hero=this.add.sprite(W*.5,H*.42,'idle0').setDepth(3).setScale(.42);
    this.weapon=this.add.image(this.hero.x+45,this.hero.y,'tonearm').setScale(.14).setDepth(4);
    this.heroState='idle';this.heroFrame=0;this.heroAnimClock=0;
    this.bullets=[];this.enemies=[];this.enemyShots=[];this.props=[];this.particles=[];
    this.enemyClock=.6;this.sceneClock=0;this.turnBack=false;this.escapeTaps=0;this.floorPhase=0;
    this.roadCurve=0;this.roadTarget=0;this.roadScroll=0;
    this.boss=null;

    this.hudBg=this.add.rectangle(210,65,390,92,0x02070c,.78).setScrollFactor(0).setDepth(30);
    this.title=this.add.text(34,28,'RETURN OF THE AVIATOR',{font:'900 22px Arial',color:'#ffffff'}).setDepth(31);
    this.weaponText=this.add.text(34,58,'TONEARM',{font:'700 15px Arial',color:'#66ddff'}).setDepth(31);
    this.musicText=this.add.text(190,58,'♫ TOO FAST • SYNCED',{font:'700 13px Arial',color:'#85f2c3'}).setDepth(31);
    this.scoreText=this.add.text(34,82,'SCORE 0000000  COMBO x0',{font:'700 13px Arial',color:'#9eb1c4'}).setDepth(31);
    this.health=this.add.graphics().setDepth(31);
    this.prompt=this.add.text(W/2,H*.13,'',{font:'900 24px Arial',color:'#ffffff',backgroundColor:'rgba(0,0,0,.62)',padding:{x:18,y:10}}).setOrigin(.5).setDepth(32).setAlpha(0);

    this.flash=this.add.rectangle(W/2,H/2,W,H,0xffffff,0).setDepth(50);
  }
  makeCues(){
    const d=this.duration||128,open=Math.min(9.2,Math.max(5.8,d*.075));
    this.cues={opening:open,dive:Math.max(open+20,d*.34),runway:Math.max(open+43,d*.58),car:Math.max(open+67,d*.80),end:Math.max(open+94,d*.985)};
  }
  start(){
    this.started=true;this.song.currentTime=0;this.song.play().catch(()=>{});
    this.phase='opening';this.phaseT=0;this.cameras.main.fadeIn(350,0,0,0);this.showPrompt('TAP ↑ / W TO ESCAPE',1800);
  }
  showPrompt(s,ms=1300){this.prompt.setText(s).setAlpha(1);this.tweens.killTweensOf(this.prompt);this.tweens.add({targets:this.prompt,alpha:0,delay:ms,duration:350});}
  musicTime(){return Number.isFinite(this.song.currentTime)&&this.song.currentTime>0?this.song.currentTime:this.sceneClock;}
  progress(a,b){return clamp((this.musicTime()-a)/(b-a),0,1);}
  update(t,dtMs){
    const dt=Math.min(.033,dtMs/1000);if(!this.started)return;this.sceneClock+=dt;this.phaseT+=dt;this.fireCooldown=Math.max(0,this.fireCooldown-dt);
    this.animateHero(dt);this.updateParticles(dt);
    if(this.keys.fire.isDown&&this.fireCooldown<=0)this.fire();
    if(Phaser.Input.Keyboard.JustDown(this.keys.special)&&this.special>=1)this.sonicBurst();
    if(this.phase==='opening')this.updateOpening(dt);
    if(this.phase==='dive')this.updateDive(dt);
    if(this.phase==='runway')this.updateRunway(dt);
    if(this.phase==='car')this.updateCar(dt);
    if(this.phase==='boss')this.updateBoss(dt);
    this.updateCombat(dt);this.updateHUD();
  }
  setHeroState(s){
    if(this.heroState===s)return;this.heroState=s;this.heroFrame=0;this.heroAnimClock=0;this.hero.setTexture(`${s}0`);
  }
  animateHero(dt){
    this.heroAnimClock+=dt;
    const rate=this.heroState==='run'?.095:this.heroState==='dive'?.11:.16;
    if(this.heroAnimClock>rate){this.heroAnimClock=0;const max=this.heroState==='fire'?3:4;this.heroFrame=(this.heroFrame+1)%max;if(this.textures.exists(`${this.heroState}${this.heroFrame}`))this.hero.setTexture(`${this.heroState}${this.heroFrame}`)}
    this.weapon.setPosition(this.hero.x+this.hero.displayWidth*.18,this.hero.y+this.hero.displayHeight*.02).setRotation(this.phase==='dive'?Math.PI/2:0);
  }
  updateOpening(dt){
    const p=clamp(this.musicTime()/this.cues.opening,0,1);this.bg.setTexture('bg_sky');this.cloudFar.tilePositionY-=18*dt;this.lines.setAlpha(.05+p*.08);
    this.enemyClock-=dt;if(this.enemyClock<=0){this.enemyClock=rand(.35,.72);this.spawnBot(rand(100,1180),rand(90,260),rand(-35,35),rand(15,50),1);}
    if((Phaser.Input.Keyboard.JustDown(this.keys.up)||Phaser.Input.Keyboard.JustDown(this.keys.w))){this.escapeTaps++;this.cameras.main.shake(70,.0025);this.emitSparks(W*.5+rand(-180,180),H*.38+rand(-70,70),6);}
    this.hero.setPosition(W*.5,H*.55).setScale(.34);this.setHeroState('idle');
    if(p>.45)this.showEscapeMeter();
    if((p>.78&&this.escapeTaps>=6)||p>.97)this.transitionTo('dive','THE DIVE');
  }
  showEscapeMeter(){
    if(this.escapeMeter)return;
    this.escapeMeter=this.add.graphics().setDepth(31);
    this.escapeLabel=this.add.text(W/2,H-86,'ESCAPE',{font:'800 13px Arial',color:'#bdeaff'}).setOrigin(.5).setDepth(31);
  }
  updateEscapeMeter(){
    if(!this.escapeMeter)return;this.escapeMeter.clear();this.escapeMeter.fillStyle(0x0a111a,.9).fillRoundedRect(W/2-180,H-68,360,12,6);this.escapeMeter.fillStyle(0x61dfff,1).fillRoundedRect(W/2-180,H-68,360*clamp(this.escapeTaps/6,0,1),12,6);
  }
  updateDive(dt){
    const p=this.progress(this.cues.opening,this.cues.dive);this.bg.setTexture('bg_sky');this.lines.setAlpha(.45);this.cloudNear.setAlpha(.18);this.cloudFar.tilePositionY-=140*dt;this.cloudNear.tilePositionY-=320*dt;this.lines.tilePositionY-=430*dt;
    this.setHeroState('dive');this.hero.setScale(.34);
    const h=(this.keys.right.isDown||this.keys.d.isDown?1:0)-(this.keys.left.isDown||this.keys.a.isDown?1:0);
    const v=(this.keys.down.isDown||this.keys.s.isDown?1:0)-(this.keys.up.isDown||this.keys.w.isDown?1:0);
    this.hero.x=clamp(this.hero.x+h*360*dt,100,1180);this.hero.y=clamp(this.hero.y+v*310*dt,110,590);this.hero.rotation=lerp(this.hero.rotation,h*.13,.12);
    this.enemyClock-=dt;if(this.enemyClock<=0){this.enemyClock=rand(.35,.70);this.spawnBot(rand(90,1190),H+80,rand(-60,60),-rand(170,280),Math.random()<.25?2:1);}
    if(p>.76&&this.weaponText.text!=='808 BOOMER'){this.weapon.setTexture('808_boomer').setScale(.12);this.weaponText.setText('808 BOOMER');this.showPrompt('W.M.P. SECURED — 808 BOOMER',1800);this.cameras.main.flash(220,100,220,255);this.cameras.main.shake(220,.008)}
    if(p>=.995)this.transitionTo('runway','RUNWAY ESCAPE');
  }
  updateRunway(dt){
    const p=this.progress(this.cues.dive,this.cues.runway);this.lines.setAlpha(.12);this.cloudNear.setAlpha(0);
    this.bg.setTexture('bg_runway').setDisplaySize(W,H);this.bg2.setTexture('bg_runway_city').setAlpha(.28);
    this.bg.y=H/2+Math.sin(this.sceneClock*.8)*3;
    if(!this.turnBack){
      this.setHeroState('run');this.hero.setScale(lerp(.26,.14,p/.5));this.hero.x=clamp(this.hero.x+(((this.keys.right.isDown||this.keys.d.isDown)?1:0)-((this.keys.left.isDown||this.keys.a.isDown)?1:0))*280*dt,340,940);this.hero.y=lerp(H*.78,H*.43,clamp(p/.5,0,1));
    }else{
      this.setHeroState('run');this.hero.setScale(.34);this.hero.y=H*.77;
      const h=((this.keys.right.isDown||this.keys.d.isDown)?1:0)-((this.keys.left.isDown||this.keys.a.isDown)?1:0);this.hero.x=clamp(this.hero.x+h*350*dt,150,1130);
      if((Phaser.Input.Keyboard.JustDown(this.keys.up)||Phaser.Input.Keyboard.JustDown(this.keys.w))&&!this.heroJump){this.heroJump={vy:-610,y:0};}
      if(this.heroJump){this.heroJump.vy+=1450*dt;this.heroJump.y+=this.heroJump.vy*dt;this.hero.y=H*.77+this.heroJump.y;if(this.heroJump.y>=0){this.heroJump=null;this.hero.y=H*.77}}
    }
    if(p>.50&&!this.turnBack){this.turnBack=true;this.showPrompt('TURN! RUN TOWARD CAMERA',1200);this.cameras.main.shake(160,.006)}
    // Ominous boss emergence in second half.
    if(this.turnBack){
      if(!this.runwayBoss)this.runwayBoss=this.add.image(W/2,170,'algorithm_boss').setDepth(1).setScale(.08).setAlpha(.92);
      const q=clamp((p-.5)/.5,0,1);this.runwayBoss.setScale(lerp(.08,1.20,ease(q))).setY(lerp(165,275,q));this.cameras.main.setZoom(lerp(1,1.08*Math.sin(q*Math.PI)+1,q*.15));
    }
    this.enemyClock-=dt;if(this.enemyClock<=0){this.enemyClock=rand(.45,.85);this.spawnBot(rand(100,1180),rand(100,320),rand(-60,60),rand(35,90),1);}
    if(p>=.995)this.transitionTo('car','ALGORITHM MAZE');
  }
  updateCar(dt){
    const p=this.progress(this.cues.runway,this.cues.car);this.bg.setTexture('bg_road').setDisplaySize(W,H);this.bg2.setTexture('bg_city').setAlpha(.35);this.lines.setAlpha(.22);this.lines.tilePositionY-=350*dt;
    if(this.hero.visible){this.hero.setVisible(false);this.weapon.setVisible(false);}
    if(!this.car)this.car=this.add.image(W*.5,H*.75,'hero_car').setScale(.48).setDepth(4);
    const h=((this.keys.right.isDown||this.keys.d.isDown)?1:0)-((this.keys.left.isDown||this.keys.a.isDown)?1:0);
    const v=((this.keys.down.isDown||this.keys.s.isDown)?1:0)-((this.keys.up.isDown||this.keys.w.isDown)?1:0);
    this.car.x=clamp(this.car.x+h*420*dt,150,1130);this.car.y=clamp(this.car.y+v*250*dt,H*.48,H*.86);this.car.rotation=lerp(this.car.rotation,h*.08,.10);
    this.roadScroll=(this.roadScroll+dt*(.5+p*.5))%1;
    if(Math.abs(this.roadCurve-this.roadTarget)<.04&&Math.random()<dt*.45)this.roadTarget=rand(-1,1);this.roadCurve=lerp(this.roadCurve,this.roadTarget,dt*.7);
    this.bg.x=W/2+this.roadCurve*55;this.bg.setScale(1.08+Math.abs(this.roadCurve)*.03);this.cameras.main.rotation=lerp(this.cameras.main.rotation,this.roadCurve*.025,.04);
    this.enemyClock-=dt;if(this.enemyClock<=0){this.enemyClock=rand(.30,.58);if(Math.random()<.52)this.spawnBot(rand(90,1190),rand(90,330),rand(-50,50),rand(60,120),1);else this.spawnEnemyVehicle(Math.random()<.25?'enemy_truck':'enemy_car');}
    if(p>=.995)this.transitionTo('boss','THE ALGORITHM STORM');
  }
  updateBoss(dt){
    const p=this.progress(this.cues.car,this.cues.end);this.bg.setTexture('bg_boss_storm').setDisplaySize(W,H);this.bg2.setTexture('bg_boss_arena').setAlpha(.22);this.rain.setAlpha(.32);this.rain.tilePositionY-=420*dt;this.lines.setAlpha(.05);
    if(this.car){this.car.destroy();this.car=null;}this.hero.setVisible(true);this.weapon.setVisible(true);this.setHeroState('fire');this.hero.setScale(.32);this.hero.y=H*.78;
    const h=((this.keys.right.isDown||this.keys.d.isDown)?1:0)-((this.keys.left.isDown||this.keys.a.isDown)?1:0);this.hero.x=clamp(this.hero.x+h*340*dt,130,1150);
    if((Phaser.Input.Keyboard.JustDown(this.keys.up)||Phaser.Input.Keyboard.JustDown(this.keys.w))&&!this.heroJump){this.heroJump={vy:-600,y:0};}
    if(this.heroJump){this.heroJump.vy+=1450*dt;this.heroJump.y+=this.heroJump.vy*dt;this.hero.y=H*.78+this.heroJump.y;if(this.heroJump.y>=0){this.heroJump=null;this.hero.y=H*.78}}
    if(!this.boss){
      this.boss=this.add.image(W/2,200,'algorithm_boss').setScale(.78).setDepth(2);this.boss.hp=120;this.boss.max=120;this.boss.hitFlash=0;
      this.bossBar=this.add.graphics().setDepth(31);
    }
    const lost=1-this.boss.hp/this.boss.max;
    this.boss.x=W/2+Math.sin(this.sceneClock*.75)*240;this.boss.y=185+Math.sin(this.sceneClock*1.2)*28;
    this.boss.setScale(clamp(.76+.17*Math.sin(this.sceneClock*.55)+.13*Math.sin(this.sceneClock*.18)+(lost>.6?.22:0),.62,1.28));
    this.cameras.main.setZoom(1+.08*Math.sin(this.sceneClock*.42)+.04*Math.sin(this.sceneClock*.16));
    if(lost>.33&&this.floorPhase===0){this.floorPhase=1;this.showPrompt('GROUND FAILURE!',1300);this.cameras.main.shake(700,.018);this.cameras.main.flash(160,255,75,60);this.tweens.add({targets:[this.hero,this.weapon],y:'+=150',duration:850,ease:'Quad.easeIn',onComplete:()=>{this.floorPhase=2;this.hero.y=H*.78;this.weapon.y=this.hero.y;this.showPrompt('LOWER GRID',1200)}})}
    this.enemyClock-=dt;if(this.enemyClock<=0){this.enemyClock=rand(.48,.92);this.spawnBot(rand(90,1190),rand(90,330),rand(-55,55),rand(45,100),1);}
    if(p>.86&&this.boss.hp>10)this.boss.hp-=1.6*dt;
    if(this.boss.hp<=0||p>.997){this.boss.destroy();this.boss=null;this.showPrompt('ALGORITHM CORE BROKEN',1800);this.cameras.main.flash(500,255,255,255);this.time.delayedCall(1600,()=>this.finish())}
  }
  transitionTo(next,label){
    if(this.transitioning)return;this.transitioning=true;this.showPrompt(label,800);
    this.cameras.main.fadeOut(380,0,0,0);this.time.delayedCall(400,()=>{this.clearPhaseObjects();this.phase=next;this.phaseT=0;this.turnBack=false;this.transitioning=false;this.cameras.main.setZoom(1);this.cameras.main.setRotation(0);this.cameras.main.fadeIn(400,0,0,0);if(next==='dive'){this.hero.setVisible(true);this.weapon.setVisible(true);this.hero.setPosition(W*.5,H*.36)}if(next==='runway'){this.hero.setVisible(true);this.weapon.setVisible(true);this.hero.setPosition(W*.5,H*.78)}});
  }
  clearPhaseObjects(){
    this.enemies.forEach(e=>e.destroy());this.enemies=[];this.enemyShots.forEach(e=>e.destroy());this.enemyShots=[];this.bullets.forEach(e=>e.destroy());this.bullets=[];
    if(this.runwayBoss){this.runwayBoss.destroy();this.runwayBoss=null}if(this.escapeMeter){this.escapeMeter.destroy();this.escapeMeter=null;this.escapeLabel.destroy();this.escapeLabel=null}
    this.cloudNear.setAlpha(0);this.rain.setAlpha(0);this.bg2.setAlpha(0);
  }
  spawnBot(x,y,vx,vy,hp){
    const e=this.add.image(x,y,'algorithm_bot').setScale(rand(.18,.27)).setDepth(2);e.vx=vx;e.vy=vy;e.hp=hp;e.fire=rand(.8,1.8);e.hitT=0;this.enemies.push(e);
  }
  spawnEnemyVehicle(key){
    const e=this.add.image(rand(W*.32,W*.68),220,key).setScale(.20).setDepth(3);e.vx=rand(-30,30);e.vy=rand(150,230);e.hp=key==='enemy_truck'?3:2;e.fire=rand(.8,1.5);e.hitT=0;e.vehicle=true;this.enemies.push(e);
  }
  fire(){
    this.fireCooldown=this.weaponText.text==='808 BOOMER'?.13:.20;
    const src=this.phase==='car'?this.car:this.hero;if(!src)return;
    const spreads=this.weaponText.text==='808 BOOMER'?[-.09,0,.09]:[0];
    spreads.forEach(s=>{
      const b=this.add.circle(src.x+20,src.y-(this.phase==='dive'?-25:25),6,0x65e7ff,1).setDepth(6);b.vx=s*330;b.vy=this.phase==='dive'?650:-720;b.life=1.6;b.pow=this.weaponText.text==='808 BOOMER'?1.25:1;this.bullets.push(b);
      const trail=this.add.circle(b.x,b.y,12,0x65e7ff,.22).setDepth(5);this.tweens.add({targets:trail,alpha:0,scale:2.2,duration:180,onComplete:()=>trail.destroy()});
    });
    this.cameras.main.shake(45,.0018);
  }
  sonicBurst(){
    this.special=0;this.enemyShots.forEach(s=>s.destroy());this.enemyShots=[];
    const src=this.phase==='car'?this.car:this.hero;if(src){const ring=this.add.circle(src.x,src.y,30,0x65e7ff,.08).setStrokeStyle(5,0x65e7ff,.9).setDepth(9);this.tweens.add({targets:ring,scale:9,alpha:0,duration:650,onComplete:()=>ring.destroy()});}
    this.enemies.forEach(e=>e.hp-=2);this.time.delayedCall(3200,()=>this.special=1);
  }
  updateCombat(dt){
    this.bullets.forEach(b=>{b.x+=b.vx*dt;b.y+=b.vy*dt;b.life-=dt;});
    this.enemies.forEach(e=>{e.x+=e.vx*dt;e.y+=e.vy*dt;e.fire-=dt;e.hitT=Math.max(0,e.hitT-dt);if(e.fire<=0){e.fire=rand(1.0,2.0);const src=this.phase==='car'?this.car:this.hero;if(src){const a=Phaser.Math.Angle.Between(e.x,e.y,src.x,src.y);const s=this.add.circle(e.x,e.y,5,0xff4b41,1).setDepth(5);s.vx=Math.cos(a)*250;s.vy=Math.sin(a)*250;s.life=3.2;this.enemyShots.push(s)}}});
    this.enemyShots.forEach(s=>{s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;});
    // bullet vs enemies
    for(const b of this.bullets){
      for(const e of this.enemies){
        if(!b.active||!e.active)continue;
        if(Phaser.Math.Distance.Between(b.x,b.y,e.x,e.y)<28+(e.vehicle?26:10)){
          b.life=0;b.setActive(false).setVisible(false);e.hp-=b.pow;e.hitT=.18;e.setTintFill(0xffffff);this.time.delayedCall(70,()=>{if(e.active)e.clearTint()});this.cameras.main.shake(45,.0028);this.emitSparks(e.x,e.y,7);
          this.combo++;this.score+=100*this.combo;if(e.hp<=0){this.explode(e.x,e.y);e.destroy()}
        }
      }
      if(this.boss&&b.active&&Phaser.Math.Distance.Between(b.x,b.y,this.boss.x,this.boss.y)<this.boss.displayWidth*.32){
        b.life=0;b.setActive(false).setVisible(false);this.boss.hp-=b.pow;this.boss.setTintFill(0xffffff);this.time.delayedCall(60,()=>{if(this.boss&&this.boss.active)this.boss.clearTint()});this.emitSparks(b.x,b.y,10);this.cameras.main.shake(55,.003);
      }
    }
    const src=this.phase==='car'?this.car:this.hero;
    if(src){
      for(const s of this.enemyShots){if(s.active&&Phaser.Math.Distance.Between(s.x,s.y,src.x,src.y)<32){s.life=0;s.destroy();this.combo=0;this.hp=Math.max(1,this.hp-1);this.cameras.main.shake(180,.012);this.cameras.main.flash(90,255,60,50);}}
    }
    this.bullets=this.bullets.filter(b=>{if(b.life<=0||b.y<-80||b.y>H+80||!b.active){if(b.active)b.destroy();return false}return true});
    this.enemies=this.enemies.filter(e=>{if(!e.active||e.y>H+120||e.y<-140||e.x<-160||e.x>W+160){if(e.active)e.destroy();return false}return true});
    this.enemyShots=this.enemyShots.filter(s=>{if(!s.active||s.life<=0||s.y>H+60||s.y<-60){if(s.active)s.destroy();return false}return true});
    this.updateEscapeMeter();
  }
  emitSparks(x,y,n){
    for(let i=0;i<n;i++){const p=this.add.circle(x,y,rand(1.5,4),Math.random()<.5?0xff7547:0x69dfff,1).setDepth(10);const a=rand(0,Math.PI*2),d=rand(25,90);this.tweens.add({targets:p,x:x+Math.cos(a)*d,y:y+Math.sin(a)*d,alpha:0,scale:.2,duration:rand(180,420),onComplete:()=>p.destroy()})}
  }
  explode(x,y){
    const ex=this.add.image(x,y,'explosion').setScale(.12).setBlendMode(Phaser.BlendModes.ADD).setDepth(9);this.tweens.add({targets:ex,scale:.42,alpha:0,duration:360,onComplete:()=>ex.destroy()});this.emitSparks(x,y,16);this.cameras.main.shake(90,.006);
  }
  updateParticles(){}
  updateHUD(){
    this.scoreText.setText(`SCORE ${String(Math.floor(this.score)).padStart(7,'0')}  COMBO x${this.combo}`);
    this.health.clear();for(let i=0;i<5;i++){this.health.fillStyle(i<this.hp?0xff4f48:0x25313d,1).fillRect(294+i*17,55,12,8)}
    if(this.boss&&this.bossBar){this.bossBar.clear().fillStyle(0x070b10,.75).fillRect(350,25,580,16).fillStyle(0xff4b43,1).fillRect(350,25,580*clamp(this.boss.hp/this.boss.max,0,1),16)}
  }
  finish(){
    this.started=false;this.song.pause();this.cameras.main.fadeOut(500,0,0,0);
    this.time.delayedCall(600,()=>{document.querySelector('#start-overlay h1').textContent='MISSION COMPLETE';document.querySelector('#start-overlay p').innerHTML=`Score <strong>${Math.floor(this.score).toLocaleString()}</strong> · The signal survives.`;document.querySelector('#start').textContent='PLAY AGAIN';document.querySelector('#start-overlay').classList.remove('hidden')})
  }
}
const config={type:Phaser.WEBGL,parent:'game',width:W,height:H,backgroundColor:'#02050a',pixelArt:false,antialias:true,scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},scene:[AviatorScene],render:{powerPreference:'high-performance',antialias:true,roundPixels:false}};
const game=new Phaser.Game(config);
document.getElementById('start').addEventListener('click',()=>{document.getElementById('start-overlay').classList.add('hidden');const s=game.scene.getScene('Aviator');s.start();});
})();