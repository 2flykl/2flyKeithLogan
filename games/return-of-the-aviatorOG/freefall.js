(() => {
  'use strict';
  const $=id=>document.getElementById(id), canvas=$('game'), ctx=canvas.getContext('2d',{
    alpha:false
  }
  );
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), mix=(a,b,t)=>a+(b-a)*t, rnd=(a,b)=>a+Math.random()*(b-a);
  const smooth=t=>t*t*(3-2*t), TAU=Math.PI*2;
  const SCORE_DURATION=142.15907, ASSEMBLY_CUE=44; // Approximate first-verse cue, seconds into the track.
  let songDuration=SCORE_DURATION;
  const camera={zoom:1,target:1,hold:0,pulse:6,dir:0};
  const heroSize=()=>Math.min(220,W*.38);
  let debris=[], stormBosses=[];
  let W=1440,H=900,dpr=1;
  const A='assets/production/', C='assets/character/2fly_master/freefall/', F='assets/freefall/';
  const manifest={
    day:F+'sky-day.png',gold:F+'sky-gold.png',dusk:F+'sky-dusk.png',cloud:F+'cloud-bank.png',plane:F+'plane-longwing.png',states:F+'hero-states.png',fireTucked:F+'hero-fire-tucked.png',burn:A+'plane_burn.png',boss:F+'boss-clean.png',scout:F+'scout-clean.png',interceptor:A+'bot_interceptor.png',shield:A+'bot_shield_projector.png',heavy:A+'bot_heavy_assault.png',dive:C+'default_inverted_dive_0.png',dive2:C+'default_inverted_dive_1.png',fire:C+'inverted_fire_0.png',fire2:C+'inverted_fire_1.png',left:C+'bank_left_0.png',right:C+'bank_right_0.png',resist:C+'resistance_0.png',resist2:C+'resistance_1.png',hit:C+'hit_reaction_air_0.png',spin:C+'aerial_revolution_0.png',spin2:C+'aerial_revolution_2.png'
  }
  ;
  let duskCloud=null;
  const art={
  }
  , keys=new Set(), pointer={
    active:false,x:0,y:0,id:null
  }
  ;
  let state='loading',paused=false,muted=false,last=0,acc=0,ambient=0,scroll=0,clouds=[],reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let run,hero,enemies=[],shots=[],bullets=[],particles=[],rings=[],pickups=[],texts=[],boss=null;
  let audio=null,ac=null,musicFailed=false;
  const SONG='https://static.wixstatic.com/mp3/85e419_62dfb4b5acfc4747a02ad9eaeb643f29.mp3';
  function resize(){
    const old=W;
    H=900;
    W=H*innerWidth/innerHeight;
    dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(innerWidth*dpr);
    canvas.height=Math.round(innerHeight*dpr);
    if(hero)hero.x=clamp(hero.x/old*W,35,W-35);
    for(const list of [enemies,shots,bullets,pickups,stormBosses])for(const e of list){
      e.x=e.x/old*W;
      if(e.base!==undefined)e.base=e.base/old*W;
      if(e.px!==undefined)e.px=e.px/old*W;
    }
    if(boss)boss.x=boss.x/old*W;
    clouds=Array.from({
      length:W<650?18:24
    }
    ,(_,i)=>({
      x:rnd(-W*.3,W*1.3),y:rnd(-300,H+400),w:rnd(360,850)*Math.min(1,W/1000+.25),layer:i%3,flip:Math.random()<.5
    }
    ));
  }
  addEventListener('resize',resize);
  resize();
  function fail(message){
    $('fatal').hidden=false;
    $('fatal').textContent=message;
  }
  addEventListener('error',e=>fail('Flight system error: '+e.message));
  function load(src){
    return new Promise((resolve,reject)=>{
      const image=new Image();
      image.onload=()=>{
        let bounds={
          x:0,y:0,w:image.width,h:image.height
        }
        ;
        if(src.endsWith('.png')&&!src.includes('/sky-')){
          const c=document.createElement('canvas');
          c.width=image.width;
          c.height=image.height;
          const g=c.getContext('2d',{
            willReadFrequently:true
          }
          );
          g.drawImage(image,0,0);
          let data;
          try {
            data=g.getImageData(0,0,c.width,c.height).data;
          } catch {
            // Local file URLs may prohibit pixel reads; keep the original bounds.
            resolve({image,...bounds});
            return;
          }
          let l=c.width,t=c.height,r=0,b=0;
          for(let y=0;
          y<c.height;
          y++)for(let x=0;
          x<c.width;
          x++)if(data[(y*c.width+x)*4+3]>30){
            l=Math.min(l,x);
            r=Math.max(r,x);
            t=Math.min(t,y);
            b=Math.max(b,y);
          }
          if(r>=l&&b>=t)bounds={
            x:l,y:t,w:r-l+1,h:b-t+1
          }
          ;
        }
        resolve({
          image,...bounds
        }
        );
      }
      ;
      image.onerror=()=>reject(new Error(src));
      image.src=src;
    }
    );
  }
  function sprite(name,x,y,height,rotation=0,alpha=1){
    const a=art[name];
    if(!a)return;
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(rotation);
    ctx.globalAlpha=alpha;
    const width=height*a.w/a.h;
    ctx.drawImage(a.image,a.x,a.y,a.w,a.h,-width/2,-height/2,width,height);
    ctx.restore();
  }
  function unlockAudio(){
    if(!ac){
      try{
        ac=new (window.AudioContext||window.webkitAudioContext)();
      }
      catch{
      }
    }
    if(ac?.state==='suspended')ac.resume().catch(()=>{
    }
    );
    if(!audio){
      audio=new Audio(SONG);
      audio.volume=.48;
      audio.loop=false;
      audio.addEventListener('loadedmetadata',()=>{if(Number.isFinite(audio.duration)&&audio.duration>30)songDuration=audio.duration;});
      audio.addEventListener('error',()=>{
        musicFailed=true;
      }
      );
    }
    audio.muted=muted;
    if(!paused&&['intro','play'].includes(state))audio.play().catch(()=>{
      musicFailed=true;
    }
    );
  }
  function tone(freq,duration=.1,type='sine',volume=.04,fall=1){
    if(!ac||muted||ac.state!=='running')return;
    const o=ac.createOscillator(),g=ac.createGain();
    o.type=type;
    o.frequency.setValueAtTime(freq,ac.currentTime);
    o.frequency.exponentialRampToValueAtTime(Math.max(20,freq*fall),ac.currentTime+duration);
    g.gain.setValueAtTime(volume,ac.currentTime);
    g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+duration);
    o.connect(g);
    g.connect(ac.destination);
    o.start();
    o.stop(ac.currentTime+duration);
  }
  function clearInput(){
    keys.clear();
    pointer.active=false;
    pointer.id=null;
  }
  function pause(value){
    if(!['play','intro'].includes(state))return;
    paused=value;
    clearInput();
    $('pause-menu').hidden=!paused;
    $('pause').textContent=paused?'▶':'Ⅱ';
    if(paused)audio?.pause();
    else unlockAudio();
    last=performance.now();
    acc=0;
  }
  function start(){
    run={
      time:0,musicTime:0,intro:0,score:0,recoveries:0,fallBoost:0,supplyIn:8,supplies:0,weapon:1,volley:0,finale:false,finaleAge:0,airBrake:0,stormStarted:false,kills:0,combo:0,comboTime:0,charge:1,wave:0,waveIn:1,fire:0,shake:0,flash:0,near:0,bestCombo:0,burst:0
    }
    ;
    hero={
      x:W*.5,y:H*.30,vx:0,vy:0,hp:5,inv:1.5,hit:0,roll:0,state:'dive',spinTime:0,spinDir:1,steerLatch:0,fireBlend:0
    }
    ;
    enemies=[];
    shots=[];
    bullets=[];
    particles=[];
    rings=[];
    pickups=[];
    texts=[];
    boss=null;
    debris=[];stormBosses=[];camera.zoom=1;camera.target=1;camera.hold=0;camera.pulse=6;camera.dir=0;
    scroll=0;
    paused=false;
    state='intro';
    clearInput();
    $('menu').hidden=true;
    $('result').hidden=true;
    $('pause-menu').hidden=true;
    $('skip').hidden=false;
    $('touch-controls').hidden=true;
    if(audio){
      audio.pause();
      audio.currentTime=0;
    }
    unlockAudio();
    canvas.focus();
  }
  function beginDive(){
    state='play';
    $('skip').hidden=true;
    $('touch-controls').hidden=!matchMedia('(pointer:coarse)').matches;
    hero.inv=2;
    run.waveIn=1.2;
    notice('BREAK THROUGH',W/2,H*.43,'#ffe0b5',2);
  }
  function finish(won){
    state=won?'win':'lose';
    clearInput();
    audio?.pause();
    $('touch-controls').hidden=true;
    $('skip').hidden=true;
    $('result').hidden=false;
    $('result-kicker').textContent=won?'THE ALGORITHM IS OFFLINE':'FULL DESCENT COMPLETE';
    $('result-title').textContent=won?'Still too fly.':'Made it through.';
    let best=0;
    try{
      best=Number(localStorage.getItem('aviator-freefall-best')||0);
      best=Math.max(best,run.score);
      localStorage.setItem('aviator-freefall-best',best);
    }
    catch{
    }
    $('result-stats').textContent=`${Math.floor(run.score).toLocaleString()} POINTS  /  ${run.kills} BOTS DOWN\nBEST CHAIN ×${run.bestCombo}  ·  PERSONAL BEST ${Math.floor(best).toLocaleString()}\n${run.recoveries} RECOVERIES · ${won?"CORE DESTROYED":"ALGORITHM STILL ACTIVE"}`;
    $('replay').focus();
  }
  $('start').onclick=start;
  $('replay').onclick=start;
  $('skip').onclick=beginDive;
  $('pause').onclick=()=>pause(!paused);
  $('resume').onclick=()=>pause(false);
  $('sound').onclick=()=>{
    muted=!muted;
    $('sound').textContent=muted?'SOUND OFF':'SOUND ON';
    $('sound').setAttribute('aria-pressed',String(muted));
    if(audio)audio.muted=muted;
    unlockAudio();
  }
  ;
  $('exit').onclick=e=>{
    if(parent!==window){
      e.preventDefault();
      parent.postMessage('closeExperience','*');
    }
    audio?.pause();
  }
  ;
  addEventListener('keydown',e=>{
    if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)&&e.target===canvas)e.preventDefault();
    if((e.code==='KeyP'||e.code==='Escape')&&!e.repeat){
      pause(!paused);
      return;
    }
    if(paused||!['play','intro'].includes(state))return;
    keys.add(e.code);
    if((e.code==='ShiftLeft'||e.code==='ShiftRight')&&!e.repeat)burst();
    if(e.code==='Enter'&&state==='intro')beginDive();
  }
  );
  addEventListener('keyup',e=>keys.delete(e.code));
  addEventListener('blur',()=>pause(true));
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)pause(true);
  }
  );
  function point(e){
    const r=canvas.getBoundingClientRect();
    pointer.x=((e.clientX-r.left)/r.width*W-W/2)/camera.zoom+W/2;
    pointer.y=((e.clientY-r.top)/r.height*H-H*.4)/camera.zoom+H*.4;
  }
  canvas.addEventListener('pointerdown',e=>{
    if(state!=='play'||paused)return;
    pointer.active=true;
    pointer.id=e.pointerId;
    point(e);
    canvas.setPointerCapture(e.pointerId);
    unlockAudio();
  }
  );
  canvas.addEventListener('pointermove',e=>{
    if(pointer.active&&pointer.id===e.pointerId)point(e);
  }
  );
  for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,e=>{
    if(e.pointerId===pointer.id){
      pointer.active=false;
      pointer.id=null;
    }
  }
  );
  $('burst-touch').addEventListener('pointerdown',e=>{
    e.preventDefault();
    if(!paused)burst();
  }
  );
  function notice(label,x,y,color='#fff',life=1){
    texts.push({
      label,x,y,color,life,max:life
    }
    );
  }
  function explode(x,y,size=1){
    run.shake=Math.max(run.shake,5*size);
    rings.push({
      x,y,r:8,life:.5,max:.5,size,color:'#ffdcaa'
    }
    );
    for(let i=0;
    i<Math.floor(23*size);
    i++){
      const a=rnd(0,TAU),v=rnd(60,300)*size;
      particles.push({
        x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:rnd(.25,.9),max:1,r:rnd(1,4)*size,color:i%3?'#ffd298':'#c3f7ff'
      }
      );
    }
    if(particles.length>500)particles.splice(0,particles.length-500);
    tone(90,.22,'sawtooth',.065,.22);
  }
  function destroy(e){
    if(e.dead)return;
    e.dead=true;
    run.kills++;
    run.combo++;
    run.comboTime=3;
    run.bestCombo=Math.max(run.bestCombo,run.combo);
    const mult=Math.min(5,1+Math.floor(run.combo/5));
    run.score+=(e.type==='heavy'?250:100)*mult;
    run.charge=clamp(run.charge+.055,0,1);
    explode(e.x,e.y,e.type==='heavy'?1.5:.8);
    notice('+'+(e.type==='heavy'?250:100)*mult,e.x,e.y-20,'#ffdfb3');
    if(run.kills%4===0)pickups.push({
      x:e.x,y:e.y,type:run.kills%8===0?'health':'power',life:10
    }
    );
  }
  function weaponLevel(){return run?.finale?4:Math.min(3,(run?.weapon||1)+(hero?.power>0?1:0));}
  function impact(shot,x,y){
    const level=shot.level||1;
    rings.push({x:shot.x,y:shot.y,r:4,life:.15,max:.15,size:.2+level*.09,color:level>=4?'#ffdd99':'#b8f4ff'});
    for(let i=0;i<3+level;i++)particles.push({x:shot.x,y:shot.y,vx:rnd(-90,90),vy:rnd(-130,50),life:.15+level*.025,max:.35,r:1+level*.3,color:level>=4?'#ffdb99':'#caf7ff'});
    if(level>=3)run.shake=Math.max(run.shake,1.2+level*.25);
  }
  function damage(){
    if(hero.inv>0||run.burst>0)return;
    hero.hp--;
    hero.inv=1.65;
    hero.hit=.3;
    run.combo=0;
    run.flash=.18;
    run.shake=9;
    tone(130,.25,'sawtooth',.08,.3);
    if(hero.hp<=0){
      // This is a full-song campaign: a setback costs score, never the rest of the track.
      run.recoveries++;run.score=Math.max(0,run.score-500);hero.hp=5;hero.inv=3;
      bullets=[];notice('RECOVERED — KEEP FALLING',W/2,H*.43,'#ccefff',2.5);
      rings.push({x:hero.x,y:hero.y,r:20,life:.8,max:.8,size:2,color:'#ccefff'});
    }
  }
  function burst(){
    if(state!=='play'||run.charge<1)return;
    run.charge=0;
    run.burst=.65;
    hero.inv=Math.max(hero.inv,.85);
    run.shake=7;
    rings.push({
      x:hero.x,y:hero.y,r:10,life:.7,max:.7,size:5,color:'#c7f8ff'
    }
    );
    bullets=[];
    for(const e of enemies)if(Math.hypot(e.x-hero.x,e.y-hero.y)<600){
      e.hp-=5;
      if(e.hp<=0)destroy(e);
    }
    if(boss&&!boss.dead){const active=boss.parts.filter(p=>p.hp>0);if(active.length){for(const p of active)if(p.arrived&&Math.hypot(p.x-hero.x,p.y-hero.y)<650)hitPart(p,4);}else{boss.hp-=20;}}
    for(const b of stormBosses)if(!b.dead&&b.age>2)b.hp-=12;
    tone(400,.6,'sine',.15,.1);
    notice('SONIC BREAK',hero.x,hero.y-75,'#ccfaff');
  }
  function spawnWave(){
    run.wave++;
    const stage=Math.min(3,Math.floor(run.time/28));
    const count=Math.min(7,3+stage),formation=run.wave%4;
    const spacing=Math.min(130,(W-100)/count),center=rnd(W*.3,W*.7);
    for(let i=0;
    i<count;
    i++){
      let type=['scout','interceptor','shield','heavy'][(i+run.wave)%Math.min(4,stage+2)];
      const x=clamp(center+(i-(count-1)/2)*spacing,45,W-45);
      enemies.push({
        x,y:H+80+i*32,base:x,vx:0,vy:-(type==='interceptor'?135:85)-stage*13,hp:type==='heavy'?6:type==='shield'?4:2,type,r:type==='heavy'?36:27,phase:i*.9,age:0,fire:rnd(1.6,3.8),formation,dead:false,tele:0
      }
      );
    }
    run.waveIn=Math.max(2.6,4.8-stage*.6);
    if(run.wave===1)notice('FIRE DOWN. STAY ABOVE THE SWARM.',W/2,H*.49,'#fff',3);
    if(run.wave%5===0)notice(['','CLOUD BREAK','GOLDEN HOUR','AFTERGLOW'][Math.max(1,stage)],W/2,H*.4,'#ffd5a2',2);
  }
  function aimShot(e,angleOffset=0,speed=210){
    const a=Math.atan2(hero.y-e.y,hero.x-e.x)+angleOffset;
    bullets.push({
      x:e.x,y:e.y,px:e.x,py:e.y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,r:6,grazed:false
    }
    );
  }
  function segmentHit(s,x,y,r){
    const dx=s.x-s.px,dy=s.y-s.py,den=dx*dx+dy*dy,t=den?clamp(((x-s.px)*dx+(y-s.py)*dy)/den,0,1):0;
    return (s.px+dx*t-x)**2+(s.py+dy*t-y)**2<=r*r;
  }
  function update(dt){
    ambient+=dt;
    const speed=state==='play'?155*(1+2.5*run.fallBoost-.32*run.airBrake):38;
    scroll+=dt*speed;
    for(const c of clouds){
      c.y-=dt*speed*[.16,.55,1.7][c.layer];
      if(c.y< -c.w*.5){
        c.y=H+c.w*.4;
        c.x=rnd(-W*.3,W*1.3);
      }
    }
    if(!['intro','play'].includes(state))return;
    run.musicTime=(audio&&Number.isFinite(audio.duration)&&audio.duration>30&&!musicFailed)?audio.currentTime:run.musicTime+dt;
    if(state==='intro'){
      run.intro+=dt;
      for(const cue of [1.9,2.6,3.2])if(run.intro>=cue&&run.intro-dt<cue)explode(W*.52,H*.39,cue===3.2?3:.5);
      updateFX(dt);
      if(run.intro>=6.5)beginDive();
      return;
    }
    run.time+=dt;
    run.waveIn-=dt;
    run.fire-=dt;
    run.charge=clamp(run.charge+dt*.022,0,1);
    run.burst=Math.max(0,run.burst-dt);
    run.comboTime-=dt;
    if(run.comboTime<=0)run.combo=0;
    hero.inv=Math.max(0,hero.inv-dt);
    hero.hit=Math.max(0,hero.hit-dt);
    const ix=(keys.has('ArrowRight')||keys.has('KeyD')?1:0)-(keys.has('ArrowLeft')||keys.has('KeyA')?1:0),iy=(keys.has('ArrowDown')||keys.has('KeyS')?1:0)-(keys.has('ArrowUp')||keys.has('KeyW')?1:0);
    let tx=ix*430,ty=iy*(iy<0?235:490);
    if(pointer.active){
      tx=clamp((pointer.x-hero.x)*9,-520,520);
      ty=clamp((pointer.y-65-hero.y)*9,-410,410);
    }
    const norm=(ix&&iy&&!pointer.active)?0.707:1;
    hero.vx=mix(hero.vx,tx*norm,1-Math.exp(-12*dt));
    // Terminal-velocity steering: drag builds against climbing; dives gather momentum.
    const verticalResponse=iy<0?3.2:iy>0?4.5:7;
    hero.vy=mix(hero.vy,ty*norm,1-Math.exp(-verticalResponse*dt));
    const edge=heroSize()*.24,viewLeft=W/2-W/(2*camera.zoom);
    hero.x=clamp(hero.x+hero.vx*dt,Math.max(edge,viewLeft+edge),Math.min(W-edge,W-viewLeft-edge));
    const bottom=H*.4+(H-H*.4)/camera.zoom-heroSize()*.52-28;
    hero.y=clamp(hero.y+hero.vy*dt,180,Math.min(H-heroSize()*.52-28,bottom));
    const intent=pointer.active?(ty>60?1:ty< -60?-1:0):iy;
    if(intent&&intent!==camera.hold){camera.pulse=0;camera.dir=intent;}
    camera.hold=intent;camera.pulse=Math.min(6,camera.pulse+dt);
    const breathe=Math.sin(Math.PI*camera.pulse/6)**2;
    camera.target=1+(camera.dir>0?.12:-.28)*breathe;
    camera.zoom=mix(camera.zoom,camera.target,1-Math.exp(-dt*3));
    run.fallBoost=mix(run.fallBoost,intent>0?1:0,1-Math.exp(-dt*(intent>0?2.2:1.25)));
    run.airBrake=mix(run.airBrake,intent<0?1:0,1-Math.exp(-dt*2.4));
    const steering=pointer.active?(Math.abs(tx)>80?Math.sign(tx):0):ix;
    if(steering&&steering!==hero.steerLatch&&hero.spinTime<=0){hero.spinTime=4.8;hero.spinDir=steering;}
    hero.steerLatch=steering;
    hero.spinTime=Math.max(0,hero.spinTime-dt);
    hero.roll=mix(hero.roll,hero.vx*.0005,1-Math.exp(-8*dt));
    const firing=keys.has('Space')||pointer.active;
    hero.state=hero.hit>0?'hit':firing?'fire':hero.spinTime>0?'spin':iy<0?'resist':'dive';
    hero.fireBlend=mix(hero.fireBlend,firing?1:0,1-Math.exp(-dt*15));
    if(firing&&run.fire<=0){
      const level=weaponLevel();
      run.fire=level===4?.075:level===3?.18:iy>0?.14:.17;
      const palette=['#74f6ff','#ffc270','#db91ff','#8effb8','#ff84bb'];
      const color=level===4?palette[run.volley++%palette.length]:level===3?'#bc9bff':'#8aeeff';
      const count=[0,1,2,3,5][level];
      const spread=Array.from({length:count},(_,i)=>(i-(count-1)/2)*(level===4?.085:.055));
      for(const a of spread)shots.push({
        x:hero.x+Math.sin(a)*220,y:hero.y+heroSize()*.48,px:hero.x+Math.sin(a)*220,py:hero.y+heroSize()*.48,vx:Math.sin(a)*700,vy:900+level*45,life:1.4,level,color,damage:1
      }
      );
      tone(660,.055,'triangle',.02,1.4);
    }
    hero.power=Math.max(0,(hero.power||0)-dt);
    const tier=1+[20,48].filter(t=>run.musicTime>=t).length;
    if(tier>run.weapon){run.weapon=tier;notice('WEAPON UP / '+[0,'PELLET','DOUBLE GLOW','TRIPLE LASER'][tier],W/2,H*.38,'#bdf6ff',2);}
    run.supplyIn-=dt;
    if(run.supplyIn<=0){run.supplies++;run.supplyIn=12;pickups.push({x:clamp(hero.x+Math.sin(run.supplies*2)*100,35,W-35),y:Math.min(H-45,hero.y+180),type:run.supplies%2?'health':'power',life:14});}
    if(keys.has('ShiftLeft')||keys.has('ShiftRight'))burst();
    if(run.finale){run.finaleAge+=dt;if(run.waveIn<=0&&enemies.length<42)spawnFinalFormation();}
    if(!run.stormStarted&&run.waveIn<=0&&enemies.length<12&&(!boss||boss.dead||boss.age>6)){
      spawnWave();if(boss)run.waveIn=7;
    }
    if(run.musicTime>=ASSEMBLY_CUE&&!boss)assembleBoss();
    for(const e of enemies){
      e.age+=dt;
      e.y+=e.vy*dt*(1+run.fallBoost*.8);
      e.x=e.finale?e.base+Math.sin(run.finaleAge*1.25)*Math.min(W*.08,85):clamp(e.base+Math.sin(e.age*(e.formation===2?2:1.1)+e.phase)*(e.formation===1?90:45),35,W-35);
      e.fire-=dt;
      e.tele=e.fire<.65&&e.y<H-40&&e.y>hero.y+70?1:0;
      if(e.fire<=0){
        if(e.y>hero.y+70&&e.y<H-40){
          aimShot(e,0,190+run.time*.5);
          if(e.type==='heavy'){
            aimShot(e,-.22);
            aimShot(e,.22);
          }
        }
        e.fire=e.finale?3.3:rnd(2.6,4);
      }
      if(Math.hypot(e.x-hero.x,e.y-hero.y)<e.r+16){
        damage();
        if(state!=='play')return;
      }
      if(e.y< -90){
        e.dead=true;
        run.combo=0;
      }
    }
    updateColossus(dt);
    updateStormBosses(dt);
    if(run.musicTime>=songDuration-.001&&(!run.finale||run.finaleAge>=14)){finish(stormBosses.length===2&&stormBosses.every(b=>b.dead));return;}
    for(const s of shots){
      s.px=s.x;
      s.py=s.y;
      s.x+=s.vx*dt;
      s.y+=s.vy*dt;
      s.life-=dt;
      const guardian=stormBosses.find(b=>!b.dead&&b.age>2&&segmentHit(s,b.x,b.y,b.r));
      if(guardian){guardian.hp-=s.damage||1;impact(s,guardian.x,guardian.y);guardian.hit=.12;s.life=0;run.score+=20;continue;}
      let target=enemies.find(e=>!e.dead&&segmentHit(s,e.x,e.y,e.r+5));
      if(target){
        target.hp-=s.damage||1;impact(s,target.x,target.y);
        target.hit=.1;
        s.life=0;
        if(target.hp<=0)destroy(target);
      }
      else if(boss&&!boss.dead){
        const part=boss.parts.find(p=>p.hp>0&&p.arrived&&segmentHit(s,p.x,p.y,p.r+5));
        if(part){hitPart(part,s.damage||1);impact(s,part.x,part.y);s.life=0;}
        else if(segmentHit(s,boss.x,boss.y,95)){
          s.life=0;
          if(boss.parts.some(p=>p.hp>0)){boss.shieldHit=.15;if(run.musicTime-(boss.hintAt||0)>4){notice('BREAK THE OUTER SECTIONS',W/2,H*.43,'#bceaff',1.5);boss.hintAt=run.musicTime;}}
          else{boss.hp-=s.damage||1;impact(s,boss.x,boss.y);boss.hit=.09;run.score+=10;}
        }
      }
    }
    for(const b of bullets){
      b.px=b.x;
      b.py=b.y;
      b.x+=b.vx*dt;
      b.y+=b.vy*dt;
      if(segmentHit(b,hero.x,hero.y,17)){
        b.dead=true;
        damage();
        if(state!=='play')return;
      }
      else if(!b.grazed&&segmentHit(b,hero.x,hero.y,43)&&hero.inv<=0){
        b.grazed=true;
        run.near++;
        run.score+=25;
        run.charge=clamp(run.charge+.025,0,1);
        notice('CLOSE +25',hero.x,hero.y-50,'#baf9ff',.6);
      }
    }
    for(const p of pickups){
      p.life-=dt;
      p.y-=45*dt;
      const dist=Math.hypot(p.x-hero.x,p.y-hero.y);
      if(dist<250){
        p.x+=(hero.x-p.x)*dt*4;
        p.y+=(hero.y-p.y)*dt*4;
      }
      if(dist<48){
        p.life=0;
        if(p.type==='health'){
          hero.hp=Math.min(5,hero.hp+1);
          notice('+1 ARMOR',hero.x,hero.y-60,'#caffce');
        }
        else{
          hero.power=12;
          notice('WEAPON BOOST / LEVEL '+weaponLevel(),hero.x,hero.y-60,'#ffdda2');
        }
        tone(900,.18,'sine',.07,1.6);
      }
    }
    shots=shots.filter(s=>s.life>0&&s.y<H+40);
    bullets=bullets.filter(b=>!b.dead&&b.y> -30&&b.y<H+50&&b.x> -40&&b.x<W+40);
    enemies=enemies.filter(e=>!e.dead);
    pickups=pickups.filter(p=>p.life>0);
    for(const e of enemies)e.hit=Math.max(0,(e.hit||0)-dt);
    if(boss)boss.hit=Math.max(0,(boss.hit||0)-dt);
    updateFX(dt);
  }
  function updateFX(dt){
    for(const d of debris){d.x+=d.vx*dt;d.y+=d.vy*dt;d.vy+=120*dt;d.rot+=d.spin*dt;d.life-=dt;}debris=debris.filter(d=>d.life>0);
    run.shake=Math.max(0,run.shake-dt*24);
    run.flash=Math.max(0,run.flash-dt);
    for(const p of particles){
      p.life-=dt;
      p.x+=p.vx*dt;
      p.y+=p.vy*dt;
      p.vx*=Math.exp(-dt*2);
      p.vy-=dt*30;
    }
    particles=particles.filter(p=>p.life>0);
    for(const r of rings){
      r.life-=dt;
      r.r+=dt*480*r.size;
    }
    rings=rings.filter(r=>r.life>0);
    for(const t of texts){
      t.life-=dt;
      t.y-=dt*24;
    }
    texts=texts.filter(t=>t.life>0);
  }
  function cover(name,alpha=1){
    const a=art[name];
    if(!a)return;
    const z=state==='play'?camera.zoom:1;
    const reveal=smooth(clamp((1-z)/.265,0,1));
    const scale=Math.max(W/a.w,H/a.h)*mix(1.28,1.06,reveal)/Math.min(1,z),w=a.w*scale,h=a.h*scale;
    ctx.save();
    ctx.globalAlpha=alpha;
    ctx.drawImage(a.image,(W-w)/2+Math.sin(ambient*.045)*12,(H-h)/2+H*.1*(1/Math.min(1,z)-1)+Math.sin(ambient*.07)*15,w,h);
    ctx.restore();
  }
  function drawClouds(layer){
    if(!art.cloud)return;
    for(const c of clouds){
      if(c.layer!==layer)continue;
      ctx.save();
      ctx.translate(c.x+(hero?(hero.x-W/2)*[-.012,-.03,-.06][layer]:0),c.y);
      if(c.flip)ctx.scale(-1,1);
      const a=art.cloud;
      const twilight=clamp(((run?.musicTime||0)/songDuration-.42)/.4,0,1),nearAction=layer===2&&c.x>W*.15&&c.x<W*.85;
      const alpha=[.20,.33,nearAction?.17:.38][layer];
      ctx.globalAlpha=alpha;
      ctx.drawImage(a.image,a.x,a.y,a.w,a.h,-c.w/2,-c.w*a.h/a.w/2,c.w,c.w*a.h/a.w);
      if(duskCloud&&twilight>0){
        ctx.globalAlpha=alpha*twilight;
        ctx.drawImage(duskCloud,a.x,a.y,a.w,a.h,-c.w/2,-c.w*a.h/a.w/2,c.w,c.w*a.h/a.w);
      }
      ctx.restore();
    }
  }
  function sky(){
    cover('day');
    const progress=(run?.musicTime||0)/songDuration;
    if(progress>.12)cover('gold',smooth(clamp((progress-.12)/.26,0,1)));
    if(progress>.48)cover('dusk',smooth(clamp((progress-.48)/.30,0,1)));
    const glow=Math.sin(Math.PI*clamp((progress-.06)/.72,0,1));
    const sx=W*.69,sy=H*(.36+progress*.40);
    if(glow>0){
      const sun=ctx.createRadialGradient(sx,sy,3,sx,sy,H*.43);
      sun.addColorStop(0,`rgba(255,248,207,${glow*.85})`);
      sun.addColorStop(.10,`rgba(255,214,134,${glow*.52})`);
      sun.addColorStop(1,'rgba(255,178,100,0)');
      ctx.fillStyle=sun;ctx.fillRect(-W*.3,-H*.3,W*1.6,H*1.6);
      ctx.fillStyle=`rgba(255,241,195,${glow*.78})`;ctx.beginPath();ctx.arc(sx,sy,22,0,TAU);ctx.fill();
      const skyline=ctx.createLinearGradient(0,H*.4,0,H);
      skyline.addColorStop(0,'rgba(255,178,104,0)');skyline.addColorStop(.65,`rgba(255,177,91,${glow*.23})`);skyline.addColorStop(1,'rgba(213,135,121,0)');
      ctx.fillStyle=skyline;ctx.fillRect(-W*.2,0,W*1.4,H*1.2);
      // A slow cloud bank physically passes in front of the distant sun.
      sprite('cloud',sx+Math.sin(ambient*.09)*W*.2,sy-15,H*.32,0,.65);
    }
    const storm=clamp((progress-.65)/.35,0,1);
    const haze=ctx.createLinearGradient(0,0,0,H);
    haze.addColorStop(0,`rgba(16,26,52,${.08+storm*.62})`);
    haze.addColorStop(.55,`rgba(51,51,84,${storm*.36})`);
    haze.addColorStop(1,`rgba(75,66,99,${storm*.45})`);
    ctx.fillStyle=haze;ctx.fillRect(-W*.3,-H*.3,W*1.6,H*1.6);
    drawClouds(0);drawClouds(1);
  }
  function line(x1,y1,x2,y2,color,width=1){
    ctx.strokeStyle=color;
    ctx.lineWidth=width;
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
  }
  function label(text,x,y,size=12,color='#fff',align='center',weight=600){
    ctx.font=`${weight} ${size}px Arial`;
    ctx.textAlign=align;
    ctx.fillStyle=color;
    ctx.fillText(text,x,y);
  }
  function drawFX(){
    ctx.save();
    ctx.globalCompositeOperation='lighter';
    for(const p of particles){
      ctx.globalAlpha=clamp(p.life*2,0,1);
      ctx.fillStyle=p.color;
      ctx.fillRect(p.x,p.y,p.r,p.r*2);
    }
    for(const r of rings){
      ctx.globalAlpha=r.life/r.max;
      ctx.strokeStyle=r.color;
      ctx.lineWidth=2+r.life*3;
      ctx.beginPath();
      ctx.arc(r.x,r.y,r.r,0,TAU);
      ctx.stroke();
    }
    ctx.restore();
  }
  function drawHero(x=hero.x,y=hero.y,size=heroSize()){
    const alpha=hero.inv>0?.78:1;
    const spinning=hero.spinTime>0;
    const cycle=spinning?(1-hero.spinTime/4.8)*2:0;
    const turn=smooth(clamp(cycle/2,0,1))*2*hero.spinDir;
    const frame=((turn*4)%4+4)%4;
    const first=Math.floor(frame),blend=smooth(frame-first);
    ctx.save();ctx.translate(x,y);ctx.rotate(hero.roll*.5);
    line(-12,-size*.43,-12-hero.vx*.04,-size*.78,'#eafaff60',2);
    line(12,-size*.43,12-hero.vx*.04,-size*.76,'#eafaff60',2);
    const fire=(hero.fireBlend||0)*(spinning?Math.pow(Math.max(0,Math.cos(turn*TAU)),6):1);
    if(fire<.99){sprite('pose'+first,0,0,size,0,alpha*(1-fire)*(1-blend));if(blend>0)sprite('pose'+((first+1)%4),0,0,size,0,alpha*(1-fire)*blend);}
    if(fire>.01){
      // Small axial sway retains motion while the gun remains aimed downward.
      const sway=spinning?Math.sin(turn*TAU)*.055:0;
      sprite('pose'+(run.fire>.09?4:5),0,0,size,sway,alpha*fire);
      if(run.fire>.105){ctx.fillStyle='#ffdf9c';ctx.beginPath();ctx.ellipse(0,size*.49,4,11,0,0,TAU);ctx.fill();}
    }
    if(hero.hit>0){ctx.strokeStyle='#ffc58a';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,size*.24,size*.52,0,0,TAU);ctx.stroke();}
    if(hero.inv>0){ctx.strokeStyle='#c6f6ff65';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(0,0,size*.23,size*.54,0,0,TAU);ctx.stroke();}
    ctx.restore();
  }
  function splitCharacterSheet(){
    // Measured alpha bounds keep HTTP and direct file launches identically scaled.
    const image=art.states.image;
    const bounds=[[163,3,176,504],[697,4,136,503],[1208,4,168,503],[191,514,142,495],[690,514,167,435],[1214,515,163,434]];
    bounds.forEach(([x,y,w,h],i)=>{art['pose'+i]={image,x,y,w,h};});
    // Keep the approved original head-down pose as the neutral anchor.
    art.pose0=art.dive;
    const tucked=art.fireTucked.image;
    art.pose4={image:tucked,x:251,y:22,w:234,h:1197};
    art.pose5={image:tucked,x:797,y:22,w:234,h:1189};
  }
  function assembleBoss(){
    boss={x:W/2,y:H*.80,hp:55,max:55,age:0,fire:3,tele:0,dead:false,parts:[]};
    for(let row=0;row<2;row++)for(let col=0;col<4;col++){
      boss.parts.push({nx:[.10,.32,.68,.90][col],ny:.68+row*.23,x:col<2?-160:W+160,y:H+180+row*100,startX:col<2?-160:W+160,startY:H+180+row*100,delay:(row*4+col)*.12,hp:5,r:clamp(W*.047,22,48),type:(col+row)%2?'interceptor':'scout',hit:0,arrived:false});
    }
    for(const e of enemies)explode(e.x,e.y,.35);
    enemies=[];run.waveIn=8;
    notice('THE SWARM BECOMES ONE',W/2,H*.40,'#ffdab2',3);
  }
  function hitPart(part,amount){
    if(part.hp<=0)return;
    part.hp-=amount;part.hit=.12;run.score+=15;
    if(part.hp>0)return;
    run.score+=350;run.kills++;run.charge=clamp(run.charge+.10,0,1);
    explode(part.x,part.y,1.4);
    debris.push({type:part.type,x:part.x,y:part.y,size:part.r*2,vx:(part.x-W/2)*.3,vy:90,spin:rnd(-2,2),rot:0,life:3});
    notice('SECTION OFFLINE +350',part.x,part.y,'#ffdfad',1.2);
    if(boss.parts.filter(p=>p.hp<=0).length%4===0)pickups.push({x:part.x,y:part.y,type:'health',life:12});
    if(!boss.parts.some(p=>p.hp>0))notice('CORE EXPOSED',W/2,H*.43,'#ffe4b9',2.5);
  }
  function updateColossus(dt){
    if(!boss||boss.dead)return;
    boss.shieldHit=Math.max(0,(boss.shieldHit||0)-dt);boss.age+=dt;boss.x=W/2+Math.sin(boss.age*.25)*Math.min(25,W*.03);boss.y=H*.80;
    for(const p of boss.parts){
      const t=smooth(clamp((boss.age-p.delay)/3,0,1));
      p.x=mix(p.startX,p.nx*W+(boss.x-W/2),t);p.y=mix(p.startY,p.ny*H,t);
      p.r=clamp(W*.047,22,48);p.arrived=t>.97;p.hit=Math.max(0,p.hit-dt);
    }
    boss.fire-=dt;boss.tele=boss.fire<.7?1:0;
    if(boss.age>4&&boss.fire<=0){
      const live=boss.parts.filter(p=>p.hp>0&&p.arrived);
      if(live.length){for(let i=0;i<2;i++)aimShot(live[(Math.floor(boss.age)+i*Math.ceil(live.length/2))%live.length],0,185);}
      else for(let i=-2;i<=2;i++)aimShot(boss,i*.20,210);
      boss.fire=live.length?1.65:1.3;
    }
    if(boss.hp<=0){
      boss.dead=true;hero.hp=Math.min(5,hero.hp+2);hero.inv=Math.max(hero.inv,2.5);run.waveIn=1.5;run.score+=6000;explode(boss.x,boss.y,4);run.shake=Math.max(run.shake,25);bullets=[];
      notice('SIGNAL BROKEN. RIDE OUT THE SKY.',W/2,H*.42,'#fff0ce',3);
      debris.push({type:'boss',x:boss.x,y:boss.y,size:300,vx:35,vy:60,spin:.3,rot:0,life:4});
    }
  }
  function drawColossus(){
    if(!boss||boss.dead)return;
    const assembly=smooth(clamp(boss.age/4,0,1));
    const coreY=mix(H+250,boss.y,assembly);
    for(const p of boss.parts){
      if(p.hp<=0)continue;
      line(boss.x,coreY,p.x,p.y,'#0b1d32bb',p.r*.7);
      line(boss.x,coreY,p.x,p.y,p.hit?'#ffdec0':'#73c5dd66',2);
    }
    sprite('boss',boss.x,coreY,Math.min(330,W*.58),0,1);
    for(const p of boss.parts){
      if(p.hp<=0)continue;
      sprite(p.type,p.x,p.y,p.r*2.1,Math.sin(boss.age*.6+p.delay)*.05);
      ctx.strokeStyle=p.hit?'#fff2c6':boss.tele?'#ffbd86':'#94d9ee66';ctx.lineWidth=p.hit?4:2;
      ctx.beginPath();ctx.arc(p.x,p.y,p.r+5,-Math.PI/2,-Math.PI/2+TAU*p.hp/5);ctx.stroke();
    }
    if(boss.parts.some(p=>p.hp>0)){
      ctx.strokeStyle=boss.shieldHit?'#ffe5b7':'#91dcec77';ctx.lineWidth=boss.shieldHit?4:2;ctx.beginPath();ctx.ellipse(boss.x,coreY,Math.min(115,W*.19),135,0,0,TAU);ctx.stroke();
    }
  }
  // Two exposed storm cores take over the final thirty-six seconds of the song.
  function updateStormBosses(dt){
    if(!run.stormStarted&&run.musicTime>=songDuration-48){
      run.stormStarted=true;
      if(boss&&!boss.dead){debris.push({type:'boss',x:boss.x,y:boss.y,size:300,vx:25,vy:150,spin:.3,rot:0,life:3});boss.dead=true;boss.hp=0;}
      enemies=[];bullets=[];
      stormBosses=[0,1].map(i=>({side:i,x:W*(i?.73:.27),y:H+200,hp:100,max:100,age:0,fire:3+i*.9,r:Math.min(92,W*.17),hit:0,dead:false}));
      notice('TEMPEST TWINS — BREAK BOTH SIGNALS',W/2,H*.42,'#d0f3ff',3);
    }
    for(const b of stormBosses){
      if(b.dead)continue;
      b.age+=dt;b.hit=Math.max(0,b.hit-dt);
      const slot=W*(b.side?.73:.27),drift=Math.sin(b.age*.55+b.side*Math.PI)*Math.min(75,W*.07);
      // Bounded pursuit leaves readable lanes; each twin fires on an offset cadence.
      const pursuit=clamp((hero.x-slot)*.1,-W*.045,W*.045);
      b.x=mix(b.x,slot+drift+pursuit,1-Math.exp(-dt*1.8));
      b.y=mix(H+200,H*(b.side?.76:.69),smooth(clamp(b.age/2.5,0,1)))+Math.sin(b.age*.9)*14;
      b.r=Math.min(92,W*.17);b.fire-=dt;
      if(b.age>3&&b.fire<=0){for(const offset of [-.18,0,.18])aimShot(b,offset,190);b.fire=2.5;}
      if(b.hp<=0){b.hp=0;b.dead=true;run.score+=4500;run.kills++;run.charge=1;hero.hp=Math.min(5,hero.hp+1);explode(b.x,b.y,3.6);run.shake=Math.max(run.shake,23);bullets=[];debris.push({type:'boss',x:b.x,y:b.y,size:b.r*2.5,vx:b.side?65:-65,vy:100,spin:b.side?.6:-.6,rot:0,life:3});notice('TEMPEST SIGNAL LOST',b.x,b.y,'#d5faff',2);}
    }
    if(run.stormStarted&&!run.finale&&stormBosses.length===2&&stormBosses.every(b=>b.dead)){
      run.finale=true;run.finaleAge=0;run.waveIn=.8;run.charge=1;hero.inv=Math.max(hero.inv,3);bullets=[];
      notice('PRISM SPRAY / SHATTER THE LAST SWARM',W/2,H*.38,'#aef7ff',3);
    }
  }
  function spawnFinalFormation(){
    const cols=W<650?6:10,spacing=W*.76/(cols-1);
    for(let row=0;row<3;row++)for(let col=0;col<cols;col++){
      const x=W*.12+col*spacing;
      enemies.push({x,base:x,y:H+38+row*65,vx:0,vy:-125,hp:1,type:(row+run.wave)%2?'interceptor':'scout',r:Math.min(20,W*.029),phase:0,age:0,fire:1.8+row*.65+(col%3)*.35,formation:0,finale:true,dead:false,tele:0});
    }
    run.wave++;run.waveIn=4.6;
  }
  function drawStormBosses(){
    for(const b of stormBosses){
      if(b.dead)continue;
      if(b.fire<.75){ctx.save();ctx.globalAlpha=.3;line(b.x,b.y,hero.x,hero.y,'#a8e8ff',2);ctx.restore();}
      sprite('boss',b.x,b.y,b.r*2.65,Math.sin(b.age*.5)*.06);
      ctx.strokeStyle=b.hit?'#ffffff':'#83dfff';ctx.lineWidth=b.hit?5:2;
      ctx.beginPath();ctx.arc(b.x,b.y,b.r*1.15,-Math.PI/2,-Math.PI/2+TAU*b.hp/b.max);ctx.stroke();
      label(b.side?'TEMPEST / II':'TEMPEST / I',b.x,b.y+b.r*1.5,10,'#d9f7ff');
    }
  }
  function drawWeather(){
    if(!run||!['play','win','lose'].includes(state))return;
    const progress=run.musicTime/songDuration,storm=smooth(clamp((progress-.65)/.12,0,1)),fury=smooth(clamp(run.finaleAge/4,0,1));
    ctx.save();
    if(storm>0){
      const shade=ctx.createLinearGradient(0,0,W,H);shade.addColorStop(0,`rgba(7,20,43,${storm*(.46+fury*.15)})`);shade.addColorStop(.55,`rgba(39,58,86,${storm*.12})`);shade.addColorStop(1,`rgba(13,33,59,${storm*(.4+fury*.12)})`);ctx.fillStyle=shade;ctx.fillRect(0,0,W,H);
      const travel=ambient*(610+run.fallBoost*470-run.airBrake*120)+run.finaleAge*350;
      for(let i=0;i<100+Math.floor(fury*75);i++){const near=i%4===0,x=((i*173.31+ambient*(near?65:22))%(W+160))-80,y=((i*91.73-travel*(near?1.5:.7))%(H+220)+H+220)%(H+220)-110;line(x,y,x+9,y-(near?95:37),`rgba(194,225,255,${storm*(near?.24:.12)})`,near?1.6:.8);}
      // One soft illumination envelope per six seconds, never a strobe.
      const phase=ambient%6,flash=!reduced&&phase<.65?Math.sin(Math.PI*phase/.65)*storm:0;
      if(flash>0){ctx.fillStyle=`rgba(179,208,255,${flash*.18})`;ctx.fillRect(0,0,W,H);ctx.globalAlpha=flash*.8;const side=Math.floor(ambient/6)%2? .91:.09;ctx.shadowColor='#addbff';ctx.shadowBlur=18;ctx.strokeStyle='#d9efff';ctx.lineWidth=2.5;ctx.beginPath();for(let j=0;j<9;j++){const x=W*side+Math.sin(j*7+Math.floor(ambient/6))*35,y=j*H*.085;if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();if(fury>0){ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(W*side,H*.25);ctx.lineTo(W*side+70,H*.34);ctx.lineTo(W*side+40,H*.44);ctx.lineTo(W*side+105,H*.53);ctx.stroke();}ctx.shadowBlur=0;ctx.globalAlpha=1;}
    }
    // Close banks cross the screen edges at a higher parallax speed.
    for(let i=0;i<2;i++){const y=H-((scroll*2.3+i*H*.7)%(H*1.8));sprite('cloud',i?W+W*.12:-W*.12,y,H*.64,0,.15+storm*.08);}
    const glare=Math.sin(Math.PI*clamp((progress-.16)/.48,0,1));
    if(glare>0){ctx.globalCompositeOperation='screen';const g=ctx.createRadialGradient(W*.83,H*.17,0,W*.83,H*.17,W*.45);g.addColorStop(0,`rgba(255,219,161,${glare*.15})`);g.addColorStop(1,'rgba(255,219,161,0)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
    if(run.fallBoost>.05){ctx.strokeStyle=`rgba(217,245,255,${run.fallBoost*.22})`;ctx.lineWidth=1;for(const side of [-1,1]){ctx.beginPath();ctx.ellipse((hero.x-W/2)*camera.zoom+W/2,(hero.y-H*.4)*camera.zoom+H*.4,heroSize()*(.3+side*.015),heroSize()*(.78+Math.sin(ambient*4)*.04),0,.15,Math.PI-.15);ctx.stroke();}}
    ctx.restore();
  }
  function hud(){
    const mobile=W<650,margin=mobile?22:38;
    ctx.fillStyle='#14384b88';
    ctx.fillRect(margin,82,mobile?160:212,85);
    label('ALTITUDE',margin+15,103,9,'#bbd5df','left');
    label(Math.max(800,Math.round(12000-11200*run.musicTime/songDuration)).toLocaleString()+' M',margin+15,132,25,'#fff','left',500);
    label(run.finale?'LAST SWARM':run.stormStarted?'TEMPEST':boss?(boss.dead?'CLEAR SKY':boss.parts.some(p=>p.hp>0)?'DISMANTLE':'CORE EXPOSED'):`SECTOR ${Math.min(4,1+Math.floor(run.time/28))} / 4`,margin+15,153,9,'#ffdaa8','left');
    label(String(Math.floor(run.score)).padStart(6,'0'),W-margin,105,mobile?22:30,'#fff','right',500);
    label(run.combo>1?`CHAIN ×${run.combo}`:'MAKE SOME NOISE',W-margin,125,9,'#ffe1b6','right');
    for(let i=0;
    i<5;
    i++){
      ctx.fillStyle=i<hero.hp?'#ffe0ac':'#ffffff30';
      ctx.fillRect(W-margin-90+i*19,145,13,5);
    }
    const bw=mobile?135:200;
    ctx.fillStyle='#14384b99';
    ctx.fillRect(margin,H-55,bw,5);
    ctx.fillStyle=run.charge>=1?'#ffe0a8':'#bdedff';
    ctx.fillRect(margin,H-55,bw*run.charge,5);
    label(run.charge>=1?(mobile?'SONIC BURST READY':'SONIC BURST READY  /  SHIFT'):'SONIC BURST CHARGING',margin,H-67,9,'#e7f5fa','left');
    label(['','PELLET','DOUBLE GLOW','TRIPLE LASER','PRISM SPRAY'][weaponLevel()]+(hero.power>0?' · BOOST '+Math.ceil(hero.power)+'s':''),W-margin,H-55,10,'#bff5ff','right');
    if(boss&&!run.stormStarted){
      const width=Math.min(360,W*.55),x=(W-width)/2,barY=mobile?185:72;
      ctx.fillStyle='#102f4dcc';
      ctx.fillRect(x,barY,width,5);
      ctx.fillStyle='#ffb692';
      ctx.fillRect(x,barY,width*clamp((boss.hp+boss.parts.reduce((n,p)=>n+Math.max(0,p.hp),0))/(boss.max+boss.parts.length*5),0,1),5);
      label(boss.dead?'ALGORITHM OFFLINE':`THE COLOSSUS / ${boss.parts.filter(p=>p.hp>0).length} SECTIONS`,W/2,barY-10,10,'#ffe0cd');
    }
    if(run.stormStarted){const live=stormBosses.filter(b=>!b.dead);label(live.length?'TEMPEST TWINS / '+live.length+' SIGNALS':'LAST SWARM / PRISM SPRAY ONLINE',W/2,mobile?190:76,mobile?10:12,'#cff6ff');}
    if(run.time<8&&!mobile)label(mobile?'DRAG TO STEER + FIRE':'SPACE TO FIRE ↓   •   SHIFT TO BREAK THE SWARM',W/2,H*.91,mobile?10:12,'#fff');
  }
  function render(){
    ctx.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#233e59';ctx.fillRect(0,0,W,H);
    ctx.save();
    const zoom=state==='play'?camera.zoom:1;
    ctx.translate(W/2,H*.4);ctx.scale(zoom,zoom);ctx.translate(-W/2,-H*.4);
    sky();
    ctx.save();
    if(run?.shake&&!reduced)ctx.translate(rnd(-run.shake,run.shake),rnd(-run.shake,run.shake));
    if(state==='menu'||state==='loading'){
      sprite('dive',W*.80,H*.46,Math.min(240,W*.25),-.2);
      sprite('plane',W*.74,H*.16,100,.08,.65);
    }
    else if(state==='intro'){
      const t=run.intro;
      const x=W*.5+Math.sin(t*.55)*W*.08;
      const y=H*.39;
      const attack=smooth(clamp(t/2.4,0,1));
      for(let i=0;i<3;i++){
        const bx=mix(i%2?-120:W+120,x+(i-1)*230,attack),by=y-130+i*100;
        sprite('interceptor',bx,by,65,Math.sin(t+i)*.12);
        if(t>1.3+i*.25&&t<3.2){const pulse=(t*4+i)%1;line(mix(bx,x,pulse),mix(by,y,pulse),mix(bx,x,Math.min(1,pulse+.22)),mix(by,y,Math.min(1,pulse+.22)),'#ff9d73',3);}
      }
      if(t<3.2)sprite('plane',x,y,175,-.06+t*.015);
      else if(t<5.8){const crash=t-3.2;for(const side of [-1,1]){ctx.save();ctx.translate(x+side*crash*95,y+crash*105);ctx.rotate(side*crash*.7);ctx.beginPath();ctx.rect(side<0?-170:0,-150,170,300);ctx.clip();sprite('plane',0,0,175,0,clamp(1-crash/2.6,0,1));ctx.restore();}}
      if(t>3.05){hero.state='dive';hero.roll=0;const eject=smooth(clamp((t-3.05)/2.5,0,1));drawHero(mix(x,W/2,eject),mix(y,H*.30,eject),mix(70,heroSize(),eject));}
      label(t<1.5?'12,000 METERS. ZERO PERMISSION.':t<3.2?'HOSTILE SIGNAL. BREAK AWAY.':t<4.5?'THEY CAN’T GROUND YOU.':'TAKE BACK THE SKY.',W/2,H*.72,W<650?16:27,'#fff','center',500);
      label('2FLY / RETURN OF THE AVIATOR',W/2,H*.77,10,'#ffe0ac');
    }
    else if(hero){
      if(run.fallBoost>.01){for(let i=0;i<48;i++){const x=((i*.618)%1)*W,y=H-((scroll*2.5+i*97)%(H+100));line(x,y,x,y+25+run.fallBoost*160,`rgba(228,247,255,${run.fallBoost*.27})`,1);}}
      for(const e of enemies){
        if(e.tele){
          ctx.save();
          ctx.globalAlpha=.28;
          line(e.x,e.y,hero.x,hero.y,'#ffb990',1);
          ctx.restore();
        }
        sprite(e.type,e.x,e.y,e.r*2.3,Math.sin(e.age*2+e.phase)*.08);
        if(e.hit){
          ctx.fillStyle='#fff9';
          ctx.beginPath();
          ctx.arc(e.x,e.y,13,0,TAU);
          ctx.fill();
        }
        if(e.type==='shield'){
          ctx.strokeStyle='#b6efff70';
          ctx.lineWidth=2;
          ctx.beginPath();
          ctx.arc(e.x,e.y,e.r+9,-.3,Math.PI*1.15);
          ctx.stroke();
        }
      }
      drawColossus();
      drawStormBosses();
      for(const d of debris)sprite(d.type,d.x,d.y,d.size,d.rot,clamp(d.life,0,1));
      ctx.save();
      ctx.globalCompositeOperation='lighter';
      for(const s of shots){
        const level=s.level||1,color=s.color||'#8aeeff';
        ctx.shadowColor=color;ctx.shadowBlur=level===1?0:14;
        if(level===3){line(s.x,s.y-58,s.x,s.y,color,9);line(s.x,s.y-56,s.x,s.y,'#fff5ff',3);}
        else{const radius=level===1?4:level===2?7:5.5;ctx.fillStyle='#edfaff';ctx.strokeStyle=color;ctx.lineWidth=level===1?1:2.5;ctx.beginPath();ctx.arc(s.x,s.y,radius,0,TAU);ctx.fill();ctx.stroke();}
        ctx.shadowBlur=0;
      }
      ctx.globalCompositeOperation='source-over';
      for(const b of bullets){
        ctx.strokeStyle='#743547';
        ctx.lineWidth=3;
        ctx.fillStyle='#ff9569';
        ctx.beginPath();
        ctx.arc(b.x,b.y,7,0,TAU);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle='#fff0d9';
        ctx.beginPath();
        ctx.arc(b.x,b.y,3,0,TAU);
        ctx.fill();
      }
      ctx.restore();
      for(const p of pickups){
        ctx.save();
        ctx.translate(p.x,p.y);
        ctx.rotate(Math.PI/4);
        ctx.fillStyle=p.type==='health'?'#c4f9dc':'#ffda93';
        ctx.fillRect(-13,-13,26,26);
        ctx.restore();
        label(p.type==='health'?'+':'»',p.x,p.y+5,18,'#184052');
      }
      drawHero();
    }
    drawFX();
    ctx.restore();
    drawClouds(2);
    ctx.restore();
    drawWeather();
    if(state==='play'){
      hud();
      for(const t of texts){
        ctx.save();
        ctx.globalAlpha=clamp(t.life/.35,0,1);
        label(t.label,t.x,t.y,t.max>1?W<650?15:23:12,t.color);
        ctx.restore();
      }
    }
    if(run?.flash>0){
      ctx.fillStyle=`rgba(255,190,140,${run.flash})`;
      ctx.fillRect(0,0,W,H);
    }
    const v=ctx.createLinearGradient(0,0,0,H);
    v.addColorStop(0,'#102b4128');
    v.addColorStop(.2,'#102b4100');
    v.addColorStop(.85,'#102b4100');
    v.addColorStop(1,'#102b4138');
    ctx.fillStyle=v;
    ctx.fillRect(0,0,W,H);
  }
  function frame(now){
    const dt=Math.min(.1,(now-last)/1000||0);
    last=now;
    if(!paused){
      acc+=dt;
      while(acc>=1/120){
        update(1/120);
        acc-=1/120;
      }
    }
    render();
    requestAnimationFrame(frame);
  }
  Promise.allSettled(Object.entries(manifest).map(async([name,src])=>{
    art[name]=await load(src);
  }
  )).then(results=>{
    const missing=results.map((r,i)=>r.status==='rejected'?Object.keys(manifest)[i]:null).filter(Boolean);
    if(missing.length){
      $('load-status').textContent='Unable to load: '+missing.join(', ')+'. Reload to retry.';
      fail('Required flight assets could not load.');
      return;
    }
    splitCharacterSheet();
    const source=art.cloud.image;
    duskCloud=document.createElement('canvas');
    duskCloud.width=source.width;
    duskCloud.height=source.height;
    const cg=duskCloud.getContext('2d');
    cg.drawImage(source,0,0);
    cg.globalCompositeOperation='source-atop';
    cg.fillStyle='#514268aa';
    cg.fillRect(0,0,source.width,source.height);
    state='menu';
    $('start').disabled=false;
    $('start').textContent='BEGIN DESCENT ↗';
    if(parent!==window||new URLSearchParams(location.search).get('autostart')==='1')start();
  }
  );
  // Read-only diagnostics for local QA; gameplay state is never writable from the UI.
  window.aviatorDiagnostics=()=>({
    state,paused,time:run?.time||0,musicTime:run?.musicTime||0,songDuration,recoveries:run?.recoveries,fallBoost:run?.fallBoost,weapon:run?weaponLevel():1,finale:run?.finale,finaleAge:run?.finaleAge,pickups:pickups.length,airBrake:run?.airBrake,stormBosses:stormBosses.map(b=>({hp:b.hp,dead:b.dead,x:b.x,y:b.y})),camera:{...camera},heroSize:heroSize(),parts:boss?.parts.filter(p=>p.hp>0).length,hp:hero?.hp,hero:hero?{
      x:hero.x,y:hero.y,state:hero.state,spinTime:hero.spinTime,fireBlend:hero.fireBlend
    }
    :null,score:run?.score,charge:run?.charge,entities:{
      enemies:enemies.length,shots:shots.length,bullets:bullets.length,particles:particles.length
    }
    ,boss:boss?.hp,assets:Object.keys(art).length,musicFailed,audio:audio?{
      paused:audio.paused,muted:audio.muted,time:audio.currentTime
    }
    :null
  }
  );
  requestAnimationFrame(frame);
}
)();
