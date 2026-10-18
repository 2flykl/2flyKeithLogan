(() => {
  'use strict';
  const $=id=>document.getElementById(id), canvas=$('game'), ctx=canvas.getContext('2d',{
    alpha:false
  }
  );
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), mix=(a,b,t)=>a+(b-a)*t, rnd=(a,b)=>a+Math.random()*(b-a), choose=a=>a[Math.floor(Math.random()*a.length)];
  const smooth=t=>t*t*(3-2*t), TAU=Math.PI*2;
  const SCORE_DURATION=141.306803, ASSEMBLY_CUE=44, CROSSFIRE_CUE=28; // Remix 26 local master duration; approximate first-verse cue.
  let songDuration=SCORE_DURATION;
  const camera={zoom:1,target:1,hold:0,pulse:6,dir:0};
  const heroSize=()=>Math.min(220,W*.38);
  let debris=[], stormBosses=[], hunter=null, chaseObstacles=[], packHunters=[];
  let W=1440,H=900,dpr=1,viewWidth=1440,viewHeight=900;
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
  let run,hero,enemies=[],shots=[],bullets=[],fadingShots=[],fadingBullets=[],particles=[],rings=[],pickups=[],texts=[],boss=null;
  let audio=null,ac=null,musicFailed=false;
  const SONG_FILE='assets/audio/2fast-remix26-short-final-mix.mp3';
  const SONG=new URL(SONG_FILE,document.baseURI).href;
  function resize(){
    const old=W;
    const rect=canvas.getBoundingClientRect();
    viewWidth=Math.max(1,Math.round(rect.width||document.documentElement?.clientWidth||innerWidth));
    viewHeight=Math.max(1,Math.round(rect.height||document.documentElement?.clientHeight||innerHeight));
    H=900;
    W=H*viewWidth/viewHeight;
    dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(viewWidth*dpr);
    canvas.height=Math.round(viewHeight*dpr);
    if(hero)hero.x=clamp(hero.x/old*W,35,W-35);
    for(const list of [enemies,shots,bullets,fadingShots,fadingBullets,pickups,stormBosses])for(const e of list){
      e.x=e.x/old*W;
      if(e.base!==undefined)e.base=e.base/old*W;
      if(e.px!==undefined)e.px=e.px/old*W;
    }
    if(boss)boss.x=boss.x/old*W;
    if(hunter){hunter.x*=W/old;for(const p of hunter.path)p.x*=W/old;}
    for(const o of chaseObstacles){o.x*=W/old;o.px*=W/old;}
    for(const h of packHunters){h.x*=W/old;h.px*=W/old;h.fromX*=W/old;h.aimX*=W/old;}
    clouds=Array.from({
      length:W<650?18:24
    }
    ,(_,i)=>({
      x:rnd(-W*.3,W*1.3),y:rnd(-300,H+400),w:rnd(360,850)*Math.min(1,W/1000+.25),layer:i%3,flip:Math.random()<.5
    }
    ));
  }
  addEventListener('resize',resize);
  window.visualViewport?.addEventListener('resize',resize);
  if(typeof ResizeObserver!=='undefined')new ResizeObserver(resize).observe($('shell'));
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
      audio.preload='auto';
      audio.volume=.48;
      audio.loop=false;
      audio.addEventListener('loadedmetadata',()=>{if(Number.isFinite(audio.duration)&&audio.duration>30)songDuration=audio.duration;});
      audio.addEventListener('playing',()=>{musicFailed=false;});
      audio.addEventListener('error',()=>{
        musicFailed=true;
      }
      );
    }
    audio.muted=muted;
    if(!paused&&['intro','play'].includes(state))audio.play().then(()=>{musicFailed=false;}).catch(()=>{musicFailed=true;});
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
    $('pause').setAttribute('aria-label',paused?'Resume game':'Pause game');
    if(paused){audio?.pause();$('resume').focus({preventScroll:true});}
    else{unlockAudio();canvas.focus({preventScroll:true});}
    last=performance.now();
    acc=0;
  }
  function start(){
    run={
      time:0,musicTime:0,intro:0,score:0,cleanDive:0,hunterCatches:0,hunterBaits:0,hunterCrashes:0,hunterPairs:0,crossfire:false,crossfireEntered:false,crossfireWave:-1,recoveries:0,fallBoost:0,supplyIn:8,supplies:0,weapon:1,volley:0,finale:false,finaleAge:0,airBrake:0,stormStarted:false,kills:0,combo:0,comboTime:0,charge:1,wave:0,waveIn:1,lastPattern:-1,lastFinalPattern:-1,fire:0,shake:0,flash:0,near:0,bestCombo:0,burst:0
    }
    ;
    hero={
      x:W*.5,y:H*.30,vx:0,vy:0,hp:5,inv:1.5,hit:0,roll:0,state:'dive',spinTime:0,spinDir:1,steerLatch:0,fireBlend:0
    }
    ;
    enemies=[];
    shots=[];
    bullets=[];
    fadingShots=[];
    fadingBullets=[];
    particles=[];
    rings=[];
    pickups=[];
    texts=[];
    boss=null;
    debris=[];stormBosses=[];camera.zoom=1;camera.target=1;camera.hold=0;camera.pulse=6;camera.dir=0;
    hunter={active:false,seen:false,x:hero.x,y:hero.y-330,gap:330,alpha:0,lock:0,stun:0,grace:0,warning:0,sampleIn:0,obstacleIn:2.2,path:[],delay:.72,status:'INBOUND'};
    chaseObstacles=[];packHunters=[];
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
    canvas.focus({preventScroll:true});
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
    if(!paused&&['intro','play'].includes(state))canvas.focus({preventScroll:true});
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
  addEventListener('playable:escape',e=>{
    if(!['play','intro'].includes(state))return;
    e.preventDefault();
    pause(!paused);
  });
  addEventListener('keydown',e=>{
    if((e.code==='KeyP'||e.code==='Escape')&&!e.repeat){
      pause(!paused);
      return;
    }
    if(e.target!==canvas&&e.target?.closest?.('button,a,input,textarea,select,[contenteditable]'))return;
    if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)&&e.target===canvas)e.preventDefault();
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
    run.cleanDive=0;
    if(hunter?.active){hunter.gap=Math.max(330,hunter.gap);hunter.stun=Math.max(hunter.stun,1.8);hunter.warning=0;hunter.lock=0;}
    for(const h of packHunters){h.stun=Math.max(h.stun,2.5);h.warning=0;}
    hero.inv=1.65;
    hero.hit=.3;
    run.combo=0;
    run.flash=.18;
    run.shake=9;
    tone(130,.25,'sawtooth',.08,.3);
    if(hero.hp<=0){
      // This is a full-song campaign: a setback costs score, never the rest of the track.
      run.recoveries++;run.score=Math.max(0,run.score-500);hero.hp=5;hero.inv=3;
      clearBullets();notice('RECOVERED — KEEP FALLING',W/2,H*.43,'#ccefff',2.5);
      rings.push({x:hero.x,y:hero.y,r:20,life:.8,max:.8,size:2,color:'#ccefff'});
    }
  }
  function burst(){
    if(state!=='play'||paused||run.charge<1)return;
    run.charge=0;
    run.burst=.65;
    hero.inv=Math.max(hero.inv,.85);
    run.shake=7;
    rings.push({
      x:hero.x,y:hero.y,r:10,life:.7,max:.7,size:5,color:'#c7f8ff'
    }
    );
    clearBullets();
    for(const e of enemies)if(!e.dead&&e.retiring===undefined&&Math.hypot(e.x-hero.x,e.y-hero.y)<600){
      e.hp-=5;
      if(e.hp<=0)destroy(e);
    }
    if(boss&&!boss.dead){const active=boss.parts.filter(p=>p.hp>0);if(active.length){for(const p of active)if(p.arrived&&Math.hypot(p.x-hero.x,p.y-hero.y)<650)hitPart(p,4);}else{boss.hp-=20;}}
    for(const b of stormBosses)if(!b.dead&&b.age>2)b.hp-=12;
    if(hunter?.active)repelHunter('burst');
    for(const h of packHunters){h.stun=Math.max(h.stun,3.4);h.warning=0;}
    tone(400,.6,'sine',.15,.1);
    notice('SONIC BREAK',hero.x,hero.y-75,'#ccfaff');
  }
  function attackPressure(){
    if(run.crossfire)return {target:2,delay:3.8};
    const time=run.musicTime;
    const ramp=time<ASSEMBLY_CUE?clamp(time/ASSEMBLY_CUE,0,1):clamp((time-ASSEMBLY_CUE)/(songDuration-48-ASSEMBLY_CUE),0,1);
    const fightingCore=boss&&!boss.dead;
    return {target:fightingCore?6:Math.round(time<ASSEMBLY_CUE?mix(3,15,ramp):mix(9,20,ramp)),delay:fightingCore?1.5:mix(1.8,.55,ramp)};
  }
  function spawnWave(capacity=8){
    run.wave++;
    const stage=Math.min(3,Math.floor(run.time/28));
    const patternPool=stage<1?[0,1,2]:stage<3?[0,1,2,3,4]:[0,1,2,3,4,5];
    let formation=choose(patternPool.filter(p=>p!==run.lastPattern));
    run.lastPattern=formation;
    const count=Math.min(capacity,run.wave===1?3:2+Math.floor(rnd(0,3))+stage);
    const spacing=Math.min(rnd(82,138),(W-100)/Math.max(1,count-1)),center=rnd(W*.28,W*.72);
    const typePools=[['scout','prism','interceptor'],['scout','prism','interceptor','shield'],['prism','interceptor','shield','shield','heavy'],['prism','interceptor','shield','heavy','heavy']];
    for(let i=0;i<count;i++){
      const type=run.wave===1&&i===0?'prism':choose(typePools[stage]);
      const lane=i-(count-1)/2;
      let x=center+lane*spacing,y=H+80+i*rnd(18,34);
      if(formation===1)y+=Math.abs(lane)*38;
      if(formation===2)y+=(i%2)*72;
      if(formation===3){x=W*(i%2?.72:.28)+lane*spacing*.22;y+=Math.floor(i/2)*48;}
      if(formation===4){x=center+Math.sin(i/(Math.max(1,count-1))*Math.PI-Math.PI/2)*spacing*2.25;y+=Math.cos(i/(Math.max(1,count-1))*Math.PI-Math.PI/2)*70;}
      if(formation===5){x=rnd(55,W-55);y+=rnd(-20,105);}
      x=clamp(x,45,W-45);
      enemies.push({
        x,y,base:x,vx:0,vy:-(type==='interceptor'?135:type==='prism'?112:85)-stage*13-rnd(0,18),hp:type==='heavy'?6:type==='shield'?4:2,type,r:type==='heavy'?36:27,phase:rnd(0,TAU),age:0,fire:rnd(1.6,3.8),formation,sway:rnd(32,formation===5?105:72),motionRate:rnd(.8,1.65),dead:false,tele:0
      }
      );
    }
    // Small synchronized trios punctuate the looser formations without taking over the sky.
    if(!run.crossfire&&run.wave>1&&capacity-count>=3&&Math.random()<.38){
      const miniCount=Math.min(capacity-count,Math.random()<.78?3:4),miniCenter=rnd(W*.22,W*.78),miniSpacing=Math.min(48,W*.055),groupPhase=rnd(0,TAU);
      for(let i=0;i<miniCount;i++){
        const x=clamp(miniCenter+(i-(miniCount-1)/2)*miniSpacing,28,W-28);
        enemies.push({x,y:H+55+Math.abs(i-(miniCount-1)/2)*18,base:x,vx:0,vy:-155-stage*11,hp:1,type:'scout',r:16,phase:groupPhase,age:0,fire:2.2+i*.18,formation:6,sway:Math.min(72,W*.07),motionRate:2.05,sync:true,dead:false,tele:0});
      }
    }
    run.waveIn=attackPressure().delay*rnd(.8,1.15);
    if(run.wave===1)notice('FIRE DOWN. STAY ABOVE THE SWARM.',W/2,H*.49,'#fff',3);
    if(!run.crossfire&&run.wave%5===0)notice(['','CLOUD BREAK','GOLDEN HOUR','AFTERGLOW'][Math.max(1,stage)],W/2,H*.4,'#ffd5a2',2);
  }
  function aimShot(e,angleOffset=0,speed=210){
    const a=Math.atan2(hero.y-e.y,hero.x-e.x)+angleOffset;
    bullets.push({
      x:e.x,y:e.y,px:e.x,py:e.y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,r:6,grazed:false
    }
    );
  }
  function projectileVisible(p,padding){
    // Match render's pivot/zoom; keep room for unscaled canvas glow and camera shake.
    const z=camera.zoom,cx=W/2,cy=H*.4,margin=padding/Math.min(1,z)+(reduced?0:(run?.shake||0));
    return p.x>=cx-cx/z-margin&&p.x<=cx+(W-cx)/z+margin&&p.y>=cy-cy/z-margin&&p.y<=cy+(H-cy)/z+margin;
  }
  function clearBullets(){
    // Remove danger immediately, but let each cleared round visibly dissolve in flight.
    for(const b of bullets){
      if(b.dead)continue;
      b.dead=true;
      fadingBullets.push({...b,fade:.3,maxFade:.3});
    }
    bullets=[];
  }
  function updateProjectileFades(dt){
    for(const list of [fadingShots,fadingBullets])for(const p of list){
      p.x+=p.vx*dt;p.y+=p.vy*dt;p.fade-=dt;
    }
    fadingShots=fadingShots.filter(p=>p.fade>0&&projectileVisible(p,80));
    fadingBullets=fadingBullets.filter(p=>p.fade>0&&projectileVisible(p,12));
  }
  function segmentHit(s,x,y,r){
    const dx=s.x-s.px,dy=s.y-s.py,den=dx*dx+dy*dy,t=den?clamp(((x-s.px)*dx+(y-s.py)*dy)/den,0,1):0;
    return (s.px+dx*t-x)**2+(s.py+dy*t-y)**2<=r*r;
  }
  // The hunter drafts a straight dive, but commits to your earlier route.
  // Trail lag follows the gap/obstacle travel time, so a late dodge can bait it.
  // Existing boss encounters keep their own pacing; pursuit returns between them.
  function chaseAllowed(){
    return run.time>=4&&!run.crossfire&&!run.stormStarted&&!run.finale&&(!boss||boss.dead)&&run.musicTime<songDuration-48;
  }
  function repelHunter(reason){
    if(!hunter)return;
    hunter.gap=reason==='burst'?450:Math.min(450,hunter.gap+150);
    hunter.stun=reason==='burst'?3.4:2.6;
    hunter.lock=0;hunter.warning=0;
    if(reason==='bait'){
      run.hunterBaits++;run.score+=150;run.charge=clamp(run.charge+.14,0,1);
      notice('HUNTER BAITED +150',hero.x,hero.y-70,'#bff4ff',1.2);
    }
    else notice('HUNTER REPELLED',hero.x,hero.y-105,'#c7f8ff',1.2);
    rings.push({x:hunter.x,y:hunter.y,r:20,life:.55,max:.55,size:1.3,color:'#bff4ff'});
  }
  function updateChase(dt,intent){
    const h=hunter;if(!h)return;
    h.px=h.x;h.py=h.y;
    const active=chaseAllowed();
    if(active&&!h.active){
      h.x=hero.x;h.gap=330;h.stun=0;h.grace=2.4;h.lock=0;h.warning=0;h.path=[];h.sampleIn=0;h.obstacleIn=2.2;
      if(!h.seen){
        notice('HUNTER ABOVE / DIVE + WEAVE',W/2,H*.41,'#ffe0b5',3);
        h.seen=true;
      }
    }
    h.active=active;h.alpha=mix(h.alpha,active?1:0,1-Math.exp(-dt*4));
    if(active){
      h.sampleIn-=dt;
      if(h.sampleIn<=0){h.path.push({x:hero.x,time:run.time});h.sampleIn=.05;}
      while(h.path.length>1&&h.path[1].time<run.time-3.1)h.path.shift();
      h.delay=clamp(.3+h.gap/(195*(1+run.fallBoost*.65)),.72,2.65);
      let target=h.path[0];
      for(const p of h.path){if(p.time>run.time-h.delay)break;target=p;}
      if(target)h.x+=clamp((target.x-h.x)*5,-Math.min(360,W*.7),Math.min(360,W*.7))*dt;
      h.x=clamp(h.x,28,W-28);
      h.stun=Math.max(0,h.stun-dt);h.grace=Math.max(0,h.grace-dt);
      // A visible aligned wake means the hunter can borrow your speed. Real lateral
      // separation breaks that wake; holding a direction against an edge cannot.
      const aligned=Math.abs(h.x-hero.x)<Math.max(34,heroSize()*.22);
      h.lock=clamp(h.lock+dt*(aligned&&h.stun<=0&&h.grace<=0?.25:-1.5),0,1);
      const dive=intent>0&&run.fallBoost>.25;
      const weaving=dive&&!aligned&&h.stun<=0;
      run.cleanDive=hero.inv<=0&&dive?run.cleanDive+dt:0;
      if(weaving&&run.cleanDive>.8)run.charge=clamp(run.charge+dt*.065,0,1);
      const catchGap=heroSize()*.55+28;
      if(h.stun>0||h.grace>0)h.gap=Math.min(450,h.gap+dt*32);
      else h.gap=clamp(h.gap+dt*(68*run.fallBoost-30-72*h.lock),catchGap,450);
      h.y=hero.y-h.gap;
      if(h.stun>0)h.status='REELING';
      else if(h.grace>0)h.status='INBOUND';
      else if(h.gap<catchGap+35)h.status='TOO CLOSE / WEAVE';
      else if(h.lock>.7)h.status='DRAFTING / WEAVE';
      else if(weaving)h.status='CLEAN DIVE / CHARGE';
      else h.status='DIVE + WEAVE';
      if(h.gap<=catchGap+2&&aligned&&h.stun<=0&&h.grace<=0&&hero.inv<=0&&run.burst<=0){
        h.warning+=dt;
        if(h.warning>=1.1){
          run.hunterCatches++;damage();
          h.gap=370;h.stun=2.8;h.warning=0;h.lock=0;
          notice('CLIPPED / BREAK THE DRAFT',hero.x,hero.y-75,'#ffcead',1.5);
        }
      }
      else h.warning=Math.max(0,h.warning-dt*3);
      h.obstacleIn-=dt;
      if(h.obstacleIn<=0&&chaseObstacles.length<2){
        // Spare wreckage follows the same upward flow as the incoming swarm.
        // Its orange rim is solid; clear it, then let the hunter follow your old lane.
        const r=Math.min(25,Math.max(18,W*.045)),x=clamp(hero.x+rnd(-W*.09,W*.09),r+24,W-r-24);
        const y=H*.4+(H-H*.4)/camera.zoom+70;
        chaseObstacles.push({x,y,px:x,py:y,r,rot:rnd(-.5,.5),spin:rnd(-.6,.6),fade:1,telegraph:.9,grazed:false,dead:false});
        h.obstacleIn=rnd(4.2,5.4);
      }
    }
    else {h.warning=0;h.lock=0;run.cleanDive=0;h.status='WITHDRAWN';}
    for(const o of chaseObstacles){
      if(o.dead)continue;
      o.px=o.x;o.py=o.y;
      o.telegraph=Math.max(0,(o.telegraph||0)-dt);
      if(o.telegraph<=0)o.y-=dt*195*(1+run.fallBoost*.65);
      o.rot+=o.spin*dt;
      if(!active)o.fade=Math.max(0,o.fade-dt*3);
      if(active&&segmentHit(o,hero.x,hero.y,o.r+17)){
        o.dead=true;explode(o.x,o.y,.6);damage();
      }
      else if(active&&!o.grazed&&o.py>=hero.y&&o.y<hero.y){
        o.grazed=true;
        if(Math.abs(o.x-hero.x)<o.r+62&&hero.inv<=0){
          run.near++;run.score+=50;run.charge=clamp(run.charge+(intent>0?.09:.045),0,1);
          notice('CLEAN PASS +50',hero.x,hero.y-50,'#bff4ff',.8);
        }
      }
      if(!o.dead&&active&&h.stun<=0&&segmentHit(o,h.x,h.y,o.r+27)){
        o.dead=true;run.hunterBaits++;hunterImpact([h],o.x,o.y);
      }
      const top=H*.4-H*.4/camera.zoom;
      if(o.y<top-100||o.fade<=0)o.dead=true;
    }
    chaseObstacles=chaseObstacles.filter(o=>!o.dead);
    if(h.active&&h.stun<=0&&h.grace<=0){
      const bot=enemies.find(e=>!e.dead&&e.retiring===undefined&&movingHit(h,e,hunterRadius()+e.r));
      if(bot)hunterImpact([h],bot.x,bot.y);
    }
    updatePackHunters(dt,intent);
  }
  const hunterSize=()=>Math.min(138,heroSize()*.78);
  const hunterRadius=()=>hunterSize()*.23;
  function movingHit(a,b,r){
    return segmentHit({px:(a.px??a.x)-(b.px??b.x),py:(a.py??a.y)-(b.py??b.y),x:a.x-b.x,y:a.y-b.y},0,0,r);
  }
  function hunterImpact(hit,x,y){
    // Mark every participant first. A pair, bot or repeated collision loop cannot
    // score the same impact twice; the blast destroys bots but never recurses.
    const eligible=[...new Set(hit)].filter(h=>h.active&&!h.crashed&&h.stun<=0);
    if(!eligible.length||eligible.length!==hit.length)return false;
    for(const h of eligible){
      if(h===hunter){h.stun=3.2;h.gap=450;h.lock=0;h.warning=0;}
      else {h.crashed=true;h.mode='reform';h.stun=4;h.warning=0;}
    }
    const pair=eligible.length>1,radius=clamp(W*.28,105,195);
    run.hunterCrashes+=eligible.length;
    if(pair){run.hunterPairs++;run.score+=400;run.charge=clamp(run.charge+.22,0,1);}
    else {run.score+=150;run.charge=clamp(run.charge+.14,0,1);}
    for(const e of enemies)if(!e.dead&&e.retiring===undefined&&Math.hypot(e.x-x,e.y-y)<=radius+e.r)destroy(e);
    for(const b of bullets)if(!b.dead&&Math.hypot(b.x-x,b.y-y)<=radius){b.dead=true;fadingBullets.push({...b,fade:.3,maxFade:.3});}
    rings.push({x,y,r:8,life:.55,max:.55,size:(radius-8)/(480*.55),color:'#fff1bb'});
    rings.push({x,y,r:radius,life:.25,max:.25,size:0,color:'#8cf2ff'});
    for(let i=0;i<42;i++){const a=rnd(0,TAU),v=rnd(radius*.4,radius*2.1);particles.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:rnd(.25,.65),max:.7,r:rnd(2,5),color:i%2?'#ffe7a3':'#a5f5ff'});}
    if(particles.length>500)particles.splice(0,particles.length-500);
    run.shake=Math.max(run.shake,12);tone(70,.35,'sawtooth',.08,.18);
    notice(pair?'CROSSFIRE +400':'HUNTER CRASH +150',x,y-45,'#fff1bd',1.1);
    return true;
  }
  function updateHunterSegment(){
    const active=run.musicTime>=CROSSFIRE_CUE&&run.musicTime<ASSEMBLY_CUE&&!boss;
    if(active&&!run.crossfireEntered){
      run.crossfireEntered=true;run.crossfireWave=-1;
      let keep=0;for(const e of enemies)if(!e.dead){if(keep++>=2)e.retiring=.6;}
      clearBullets();run.waveIn=3.8;
      notice('HUNTER CROSSFIRE',W/2,H*.39,'#ffe2b6',2.2);
      notice('DIVE + SWITCH LANES / BAIT THEM INTO EACH OTHER',W/2,H*.45,'#cef4ff',3.4);
    }
    run.crossfire=active;
  }
  function updatePackHunters(dt,intent){
    if(!run.crossfire){
      for(const h of packHunters){h.active=false;h.alpha=Math.max(0,h.alpha-dt*3);}
      packHunters=packHunters.filter(h=>h.alpha>0);
      return;
    }
    // Three bounded attack cycles fit the existing 28–44s music window. Locks
    // sample different moments, then launch together. Unchanged player lanes
    // preserve formation; a genuine lane cut can reverse the committed paths.
    const elapsed=run.musicTime-CROSSFIRE_CUE,wave=Math.min(2,Math.floor(elapsed/5.3)),phase=elapsed-wave*5.3;
    if(wave!==run.crossfireWave){
      run.crossfireWave=wave;
      packHunters=[0,1,2].map(id=>{
        const x=W*[.18,.82,.5][id],y=hero.y-[310,310,440][id];
        return {id,x,y,px:x,py:y,fromX:x,fromY:y,aimX:x,aimY:hero.y,active:true,alpha:0,mode:'reform',color:['#ffd09b','#c4a1ff','#9cf5f2'][id],lock:0,warning:0,stun:0,locked:false,crashed:false};
      });
    }
    const offset=hunterRadius()*2+10,lockTimes=[.9,1.75,2.2],launch=2.6,duration=2.1;
    const laneTarget=id=>clamp(hero.x,offset+hunterRadius()+8,W-offset-hunterRadius()-8)+[-offset,offset,0][id];
    for(const h of packHunters){
      h.px=h.x;h.py=h.y;h.stun=Math.max(0,h.stun-dt);
      h.alpha=mix(h.alpha,h.crashed?0:1,1-Math.exp(-dt*5));
      if(h.crashed)continue;
      if(phase<launch){
        h.mode=phase<.9?'reform':'windup';
        const homeY=hero.y-[310,310,440][h.id];
        h.y=mix(h.y,homeY,1-Math.exp(-dt*4));
        if(!h.locked&&phase>=lockTimes[h.id]){
          h.locked=true;h.aimX=laneTarget(h.id);
        }
        if(!h.locked)h.aimX=laneTarget(h.id);
        h.aimY=hero.y;h.lock=clamp((phase-.9)/(launch-.9),0,1);h.fromX=h.x;h.fromY=h.y;
      }
      else if(phase<launch+duration){
        if(h.mode!=='dive'){h.mode='dive';h.aimY=hero.y;h.fromX=h.x;h.fromY=h.y;}
        const progress=clamp((phase-launch)/duration,0,1);
        h.x=mix(h.fromX,h.aimX,progress);
        h.y=mix(h.fromY,h.aimY,progress)-run.fallBoost*120*Math.sin(progress*Math.PI*.5);
        h.warning=clamp(progress,0,1)*1.1;
        if(h.stun<=0&&hero.inv<=0&&Math.hypot(h.x-hero.x,h.y-hero.y)<hunterRadius()+19){damage();run.hunterCatches++;notice('CLIPPED / KEEP DIVING',hero.x,hero.y-75,'#ffcead',1);}
      }
      else {h.mode='reform';h.alpha=Math.max(0,h.alpha-dt*5);}
    }
    const live=packHunters.filter(h=>!h.crashed&&h.mode==='dive'&&h.stun<=0);
    for(let i=0;i<live.length;i++)for(let j=i+1;j<live.length;j++){
      const a=live[i],b=live[j];
      if(!a.crashed&&!b.crashed&&movingHit(a,b,hunterRadius()*2))hunterImpact([a,b],(a.x+b.x)/2,(a.y+b.y)/2);
    }
    for(const h of live){
      if(h.crashed||h.stun>0)continue;
      const bot=enemies.find(e=>!e.dead&&e.retiring===undefined&&movingHit(h,e,hunterRadius()+e.r));
      if(bot)hunterImpact([h],bot.x,bot.y);
    }
    if(intent>0&&hero.inv<=0&&Math.abs(hero.vx)>100)run.charge=clamp(run.charge+dt*.035,0,1);
  }
  // `size` is the hunter hull height; total wing span is 1.55–1.68 * size.
  // Render-only: no gameplay fields are changed. Use the same helpers as drawChase.
  function drawHunterBody(h,x,y,size,alpha=1){
    const id=((h.id||0)%3+3)%3,color=h.color||['#ffbb70','#c8a4ff','#73e6f5'][id];
    const stunned=h.stun>0,boost=clamp(run?.fallBoost||0,0,1),lock=clamp(h.lock||0,0,1);
    const warning=clamp((h.warning||0)/1.1,0,1),diving=h.mode==='dive',charging=h.mode==='windup';
    const threat=stunned?0:Math.max(warning,charging?.55:0,diving?1:0);
    const t=reduced?0:ambient,pulse=.5+.5*Math.sin(t*3.4+id*1.9);
    const rim=threat>.05?'#ff8f78':color,opacity=clamp(alpha,0,1)*(stunned?.48:1);
    const bank=clamp((hero?.vx||0)*.00018,-.1,.1)*(stunned?.25:1);
    const ring=size*(.64+boost*.055+threat*.035);
    ctx.save();ctx.translate(x,y);ctx.globalAlpha=opacity;
    ctx.lineCap='round';ctx.lineJoin='round';
    // The open threat circle stays legible around the broad hull, even at phone scale.
    ctx.strokeStyle=color;ctx.lineWidth=1.15;ctx.globalAlpha=opacity*(stunned?.2:.24+lock*.18);
    ctx.beginPath();ctx.arc(0,0,ring,0,TAU);ctx.stroke();
    ctx.globalAlpha=opacity*(.55+lock*.24);ctx.strokeStyle=rim;ctx.lineWidth=1.6+threat*1.2;
    const turn=(stunned?-.12:.08)*t;
    for(let n=0;n<3;n++){
      const a=-Math.PI/2+n*TAU/3+turn;
      ctx.beginPath();ctx.arc(0,0,ring,a,a+(stunned?.44:.85+lock*.25));ctx.stroke();
    }
    // Direction ticks lean toward the player; Down stretches the escape-side marks.
    const bearing=hero?Math.atan2(hero.y-y,hero.x-x):Math.PI/2;
    for(let n=-1;n<=1;n++){
      const a=bearing+n*.24,inner=ring+4,outer=inner+size*(.055+boost*.035);
      ctx.globalAlpha=opacity*(n===0?.84:.42);ctx.lineWidth=n===0?2.3:1.4;
      ctx.beginPath();ctx.moveTo(Math.cos(a)*inner,Math.sin(a)*inner);ctx.lineTo(Math.cos(a)*outer,Math.sin(a)*outer);ctx.stroke();
    }
    if(threat>.01){
      ctx.globalAlpha=opacity*.88;ctx.strokeStyle='#ffe4c5';ctx.lineWidth=3;
      ctx.beginPath();ctx.arc(0,0,ring+5,-Math.PI/2,-Math.PI/2+TAU*threat);ctx.stroke();
    }
    ctx.rotate(bank);ctx.scale(size,size);ctx.globalAlpha=opacity;
    // Exhaust is a bounded, tapered glow rather than a screen-filling bloom.
    const plume=.18+boost*.17+(diving?.12:0),engineY=-.24;
    for(const side of [-1,1]){
      const engineX=side*.25,g=ctx.createLinearGradient(engineX,engineY,engineX,engineY-plume);
      g.addColorStop(0,stunned?'#7e9daa':color);g.addColorStop(.24,stunned?'#7e9daa55':color+'aa');g.addColorStop(1,'#b9f5ff00');
      ctx.fillStyle=g;ctx.globalAlpha=opacity*(stunned?.22:.62+boost*.2);
      ctx.beginPath();ctx.moveTo(engineX-.045,engineY);ctx.lineTo(engineX-.022,engineY-plume*.68);ctx.lineTo(engineX,engineY-plume);ctx.lineTo(engineX+.022,engineY-plume*.68);ctx.lineTo(engineX+.045,engineY);ctx.closePath();ctx.fill();
    }
    ctx.globalAlpha=opacity;ctx.lineWidth=.012;ctx.strokeStyle='#081a2b';
    const hull=ctx.createLinearGradient(0,-.5,0,.5);
    hull.addColorStop(0,'#708499');hull.addColorStop(.26,'#344b66');hull.addColorStop(.62,'#172b43');hull.addColorStop(1,'#0b172a');
    const wingShapes=[
      [[.12,-.23],[.37,-.38],[.77,-.16],[.73,.34],[.49,.13],[.34,.24],[.15,.1]],
      [[.12,-.25],[.32,-.34],[.84,-.08],[.64,.39],[.57,.12],[.38,.23],[.17,.11]],
      [[.12,-.22],[.41,-.3],[.79,-.2],[.77,.2],[.57,.31],[.54,.07],[.34,.19],[.16,.09]]
    ];
    for(const side of [-1,1]){
      const points=wingShapes[id];ctx.fillStyle=hull;ctx.beginPath();
      points.forEach((p,i)=>i?ctx.lineTo(side*p[0],p[1]):ctx.moveTo(side*p[0],p[1]));ctx.closePath();ctx.fill();ctx.stroke();
      // Inset armor and a bright chamfer communicate a solid mechanical body.
      ctx.fillStyle='#89a6bb25';ctx.beginPath();ctx.moveTo(side*.23,-.2);ctx.lineTo(side*.4,-.26);ctx.lineTo(side*.67,-.11);ctx.lineTo(side*.49,.025);ctx.closePath();ctx.fill();
      ctx.strokeStyle=rim;ctx.lineWidth=.014;ctx.globalAlpha=opacity*.88;
      ctx.beginPath();ctx.moveTo(side*points[1][0],points[1][1]+.02);ctx.lineTo(side*(points[2][0]-.025),points[2][1]+.025);ctx.lineTo(side*(points[3][0]-.025),points[3][1]-.045);ctx.stroke();
      ctx.globalAlpha=opacity;ctx.strokeStyle='#09172a';ctx.lineWidth=.018;
      ctx.beginPath();ctx.moveTo(side*.38,-.12);ctx.lineTo(side*.47,.04);ctx.lineTo(side*.6,.11);ctx.stroke();
      ctx.strokeStyle=color;ctx.lineWidth=.018;ctx.globalAlpha=opacity*.7;
      for(let v=0;v<id+1;v++){
        const px=.39+v*.055;ctx.beginPath();ctx.moveTo(side*px,-.13);ctx.lineTo(side*(px+.035),-.072);ctx.stroke();
      }
      ctx.globalAlpha=opacity;
    }
    // Variant spines: single keel, forked aerials, or broad crown.
    ctx.fillStyle='#23394f';ctx.strokeStyle='#0b1b2b';ctx.lineWidth=.014;
    if(id===1){
      for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(side*.05,-.16);ctx.lineTo(side*.105,-.5);ctx.lineTo(side*.19,-.29);ctx.lineTo(side*.14,-.14);ctx.closePath();ctx.fill();ctx.stroke();}
    }else if(id===2){
      ctx.beginPath();ctx.moveTo(-.17,-.18);ctx.lineTo(-.2,-.42);ctx.lineTo(-.08,-.37);ctx.lineTo(0,-.5);ctx.lineTo(.08,-.37);ctx.lineTo(.2,-.42);ctx.lineTo(.17,-.18);ctx.closePath();ctx.fill();ctx.stroke();
    }else{
      ctx.beginPath();ctx.moveTo(-.1,-.16);ctx.lineTo(0,-.5);ctx.lineTo(.1,-.16);ctx.closePath();ctx.fill();ctx.stroke();
    }
    // Armored nose and central reactor are common recognizable hunter anatomy.
    ctx.fillStyle=hull;ctx.beginPath();ctx.moveTo(0,-.3);ctx.lineTo(.22,-.17);ctx.lineTo(.18,.22);ctx.lineTo(0,.5);ctx.lineTo(-.18,.22);ctx.lineTo(-.22,-.17);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#667e9445';ctx.beginPath();ctx.moveTo(0,.13);ctx.lineTo(.13,.2);ctx.lineTo(0,.43);ctx.lineTo(-.13,.2);ctx.closePath();ctx.fill();
    ctx.strokeStyle=color;ctx.lineWidth=.013;ctx.globalAlpha=opacity*.7;
    ctx.beginPath();ctx.moveTo(-.13,.2);ctx.lineTo(0,.43);ctx.lineTo(.13,.2);ctx.stroke();
    ctx.globalAlpha=opacity;ctx.fillStyle='#071624';ctx.strokeStyle='#91a5b2';ctx.lineWidth=.015;
    ctx.beginPath();ctx.arc(0,-.025,.154,0,TAU);ctx.fill();ctx.stroke();
    const glow=ctx.createRadialGradient(0,-.025,.018,0,-.025,.18);
    glow.addColorStop(0,'#f4fffb');glow.addColorStop(.23,rim);glow.addColorStop(.56,rim+'80');glow.addColorStop(1,rim+'00');
    ctx.globalAlpha=opacity*(stunned?.32:.68+pulse*.12+threat*.2);ctx.fillStyle=glow;
    ctx.beginPath();ctx.arc(0,-.025,.18,0,TAU);ctx.fill();
    ctx.globalAlpha=opacity;ctx.fillStyle=stunned?'#7f9ba8':'#f0fff6';
    ctx.beginPath();ctx.moveTo(0,-.1);ctx.lineTo(.055,-.025);ctx.lineTo(0,.053);ctx.lineTo(-.055,-.025);ctx.closePath();ctx.fill();
    ctx.strokeStyle=rim;ctx.lineWidth=.018;
    ctx.beginPath();ctx.arc(0,-.025,.113,.15,Math.PI-.15);ctx.stroke();
    // Non-color IDs remain readable when the silhouettes overlap during reform.
    ctx.fillStyle=color;
    for(let mark=0;mark<=id;mark++){
      const mx=(mark-id*.5)*.043;ctx.beginPath();ctx.moveTo(mx,.15);ctx.lineTo(mx+.014,.174);ctx.lineTo(mx,.198);ctx.lineTo(mx-.014,.174);ctx.closePath();ctx.fill();
    }
    ctx.restore();
  }

  function drawAlgorithmBot(e){
    const type=e.type,size=e.r*2.3,t=reduced?0:(e.age||0),phase=e.phase||0,bank=Math.sin(t*2+phase)*.08;
    const opacity=e.retiring===undefined?1:clamp(e.retiring/.6,0,1);
    const color={scout:'#78def5',interceptor:'#ffbc88',shield:'#86e7dd',heavy:'#ceacff',prism:'#b1ffd5'}[type]||'#b3ecff';
    if(e.tele&&hero){
      ctx.save();ctx.globalAlpha=.28*opacity;line(e.x,e.y,hero.x,hero.y,'#ffb990',1);ctx.restore();
    }
    ctx.save();ctx.translate(e.x,e.y);ctx.rotate(bank);ctx.globalAlpha=opacity;ctx.lineCap='round';ctx.lineJoin='round';
    // Modest engine light ties the existing painted cutouts to the vector newcomer.
    const glow=ctx.createRadialGradient(0,size*.23,0,0,size*.23,size*.41);
    glow.addColorStop(0,color+'65');glow.addColorStop(.43,color+'20');glow.addColorStop(1,color+'00');
    ctx.fillStyle=glow;ctx.beginPath();ctx.arc(0,size*.23,size*.41,0,TAU);ctx.fill();
    ctx.strokeStyle=color;ctx.lineWidth=Math.max(1,size*.018);
    if(type==='prism'){
      ctx.save();ctx.scale(size,size);
      // Three forked fins surround a white diamond; no sprite/image dependency.
      for(let i=0;i<3;i++){
        ctx.save();ctx.rotate(i*TAU/3);
        const fin=ctx.createLinearGradient(-.12,-.5,.12,.1);fin.addColorStop(0,'#d4ffdc');fin.addColorStop(.37,'#6cbda4');fin.addColorStop(1,'#193e40');
        ctx.fillStyle=fin;ctx.strokeStyle='#153c3c';ctx.lineWidth=.018;
        ctx.beginPath();ctx.moveTo(0,-.61);ctx.lineTo(.13,-.18);ctx.lineTo(.095,-.025);ctx.lineTo(-.095,-.025);ctx.lineTo(-.13,-.18);ctx.closePath();ctx.fill();ctx.stroke();
        ctx.strokeStyle='#caffdf';ctx.lineWidth=.025;ctx.beginPath();ctx.moveTo(0,-.51);ctx.lineTo(.062,-.19);ctx.stroke();
        ctx.fillStyle='#0e3734';ctx.beginPath();ctx.moveTo(0,-.35);ctx.lineTo(.032,-.2);ctx.lineTo(0,-.145);ctx.lineTo(-.032,-.2);ctx.closePath();ctx.fill();
        ctx.restore();
      }
      ctx.fillStyle='#173d3d';ctx.strokeStyle='#9af6ca';ctx.lineWidth=.026;
      ctx.beginPath();ctx.moveTo(0,-.245);ctx.lineTo(.195,0);ctx.lineTo(0,.245);ctx.lineTo(-.195,0);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle=e.tele?'#fff7c8':'#ecfff3';ctx.beginPath();ctx.moveTo(0,-.16);ctx.lineTo(.105,0);ctx.lineTo(0,.16);ctx.lineTo(-.105,0);ctx.closePath();ctx.fill();
      ctx.fillStyle='#74d3af';ctx.beginPath();ctx.moveTo(0,-.16);ctx.lineTo(.105,0);ctx.lineTo(0,.16);ctx.closePath();ctx.fill();
      ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,0,.034,0,TAU);ctx.fill();ctx.restore();
    }else{
      // Established cutouts stay at their original dimensions and orientation.
      sprite(type,0,0,size,0,opacity);
      ctx.strokeStyle=color;ctx.lineWidth=Math.max(1,size*.018);
      if(type==='scout'){
        for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(side*size*.37,size*.16);ctx.lineTo(side*size*.47,0);ctx.lineTo(side*size*.37,-size*.16);ctx.stroke();}
      }else if(type==='interceptor'){
        for(const side of [-1,1]){
          ctx.globalAlpha=.75*opacity;ctx.beginPath();ctx.moveTo(side*size*.22,size*.28);ctx.lineTo(side*size*.22,size*(.46+.035*Math.sin(t*6+phase)));ctx.stroke();
          ctx.globalAlpha=.88*opacity;ctx.beginPath();ctx.moveTo(side*size*.31,-size*.24);ctx.lineTo(side*size*.43,-size*.33);ctx.stroke();
        }
      }else if(type==='shield'){
        ctx.globalAlpha=.66*opacity;ctx.lineWidth=1.7;
        for(const side of [-1,1]){
          ctx.beginPath();ctx.moveTo(side*size*.25,-size*.48);ctx.lineTo(side*size*.49,-size*.29);ctx.lineTo(side*size*.49,size*.2);ctx.lineTo(side*size*.25,size*.4);ctx.stroke();
        }
        ctx.globalAlpha=.35*opacity;ctx.beginPath();ctx.arc(0,0,e.r+9,-.3,Math.PI*1.15);ctx.stroke();
      }else if(type==='heavy'){
        ctx.lineWidth=Math.max(2,size*.028);
        for(const side of [-1,1]){
          ctx.beginPath();ctx.moveTo(side*size*.25,-size*.35);ctx.lineTo(side*size*.43,-size*.35);ctx.lineTo(side*size*.43,-size*.11);ctx.stroke();
          ctx.fillStyle='#ffd2a0';ctx.beginPath();ctx.arc(side*size*.28,size*.21,Math.max(1.8,size*.028),0,TAU);ctx.fill();
        }
      }
    }
    ctx.globalAlpha=opacity;
    if(e.tele){ctx.fillStyle='#fff2ce';ctx.beginPath();ctx.arc(0,-size*.17,Math.max(2,size*.045),0,TAU);ctx.fill();}
    if(e.hit){ctx.fillStyle='#fff9';ctx.beginPath();ctx.arc(0,0,13,0,TAU);ctx.fill();}
    ctx.restore();
  }

  function drawChase(){
    for(const o of chaseObstacles){
      if(o.telegraph>0){
        const edge=H*.4+(H-H*.4)/camera.zoom-22;
        ctx.save();ctx.globalAlpha=o.fade*.8;
        line(o.x-10,edge+7,o.x,edge-3,'#ffd09b',2);line(o.x,edge-3,o.x+10,edge+7,'#ffd09b',2);
        ctx.restore();
      }
      sprite('interceptor',o.x,o.y,o.r*2.4,o.rot,o.fade*.75);
      ctx.save();ctx.globalAlpha=o.fade;ctx.strokeStyle='#ffd09b';ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(o.x,o.y,o.r+5,0,TAU);ctx.stroke();
      line(o.x-o.r*.45,o.y-o.r*.35,o.x+o.r*.45,o.y+o.r*.35,'#ffd09b',2);ctx.restore();
    }
    const threats=[hunter,...packHunters].filter(h=>h&&h.alpha>.01);
    for(const h of threats){
      ctx.save();ctx.globalAlpha=h.alpha;
      const color=h.color||'#ffd09b',r=hunterRadius();
      if(h.active&&h.stun<=0&&((h.lock||0)>.25||h.mode==='windup')){
        ctx.globalAlpha=h.alpha*.45;ctx.setLineDash(h.mode==='windup'?[5,8]:[9,12]);
        const targetX=h.mode==='windup'?h.aimX:hero.x,targetY=h.mode==='windup'?h.aimY:hero.y-heroSize()*.55;
        line(h.x,h.y+r,targetX,targetY,h.warning>0?'#ff997f':color,2);
        if(h.mode==='windup'&&h.locked){ctx.strokeStyle=color;ctx.lineWidth=2;ctx.beginPath();ctx.arc(h.aimX,h.aimY,18,0,TAU);ctx.stroke();}
        ctx.setLineDash([]);ctx.globalAlpha=h.alpha;
      }
      const top=H*.4-H*.4/camera.zoom;
      if(h.y<top+42){
        const y=top+47;
        line(h.x-9,y+8,h.x,y,color,2);line(h.x,y,h.x+9,y+8,color,2);
      }
      else drawHunterBody(h,h.x,h.y,hunterSize(),h.alpha);
      ctx.restore();
    }
    // Open arcs, a steering notch and a shrinking threat gap react to controls;
    // the ring's geometry communicates pressure even without distinguishing colors.
    const live=threats.filter(h=>h.active&&h.stun<=0&&!h.crashed);
    if(live.length){
      const danger=Math.max(...live.map(h=>clamp(1-Math.hypot(h.x-hero.x,h.y-hero.y)/450,0,1)));
      const radius=heroSize()*(.62+run.fallBoost*.10);
      ctx.save();ctx.translate(hero.x,hero.y);ctx.rotate(clamp(hero.vx/1200,-.32,.32));
      ctx.strokeStyle=danger>.65?'#ffd09b':'#bcefff';ctx.lineWidth=1.5+danger*1.5;ctx.globalAlpha=.4+danger*.45;
      for(const side of [0,Math.PI]){ctx.beginPath();ctx.ellipse(0,0,radius*.65,radius,0,side+.18,side+Math.PI-.18);ctx.stroke();}
      const notch=clamp(hero.vx/430,-1,1)*radius*.5;
      line(notch-7,-radius-5,notch,-radius-12,'#e3faff',2);line(notch,-radius-12,notch+7,-radius-5,'#e3faff',2);
      ctx.restore();
    }
  }
  function drawChaseHUD(margin){
    if(run.crossfire){
      const width=W<650?170:240;
      ctx.fillStyle='#14384bc8';ctx.fillRect(margin,173,width,44);
      label('HUNTER CROSSFIRE / '+Math.max(0,Math.ceil(ASSEMBLY_CUE-run.musicTime))+'s',margin+10,187,9,'#ffdfb5','left');
      label('DIVE. SWITCH LANES. MAKE THEM COLLIDE.',margin+10,202,W<650?7:8,'#d9f3ff','left');
      return;
    }
    const h=hunter;if(!h?.active)return;
    const width=W<650?145:200,safe=clamp((h.gap-(heroSize()*.55+28))/260,0,1);
    ctx.fillStyle='#14384bb8';ctx.fillRect(margin,173,width,43);
    label('HUNTER '+Math.round(h.gap)+' M',margin+10,186,9,'#ffdfb5','left');
    label(h.status,margin+10,201,8,h.warning>0?'#ffae91':'#d9f3ff','left');
    ctx.fillStyle='#ffffff25';ctx.fillRect(margin+10,207,width-20,3);
    ctx.fillStyle=safe<.2?'#ff9d7d':'#bdefff';ctx.fillRect(margin+10,207,(width-20)*safe,3);
  }
  function update(dt){
    if(paused)return;
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
    updateProjectileFades(dt);
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
    updateHunterSegment();
    if(run.finale){run.finaleAge+=dt;if(run.waveIn<=0&&enemies.length<42)spawnFinalFormation();}
    if(!run.stormStarted&&(!boss||boss.dead||boss.age>6)){
      const pressure=attackPressure();
      // Count inbound reserves too, but retire bots that have already passed the player.
      const incoming=enemies.filter(e=>!e.dead&&e.retiring===undefined&&(run.crossfire||e.y>hero.y-100)).length;
      if(incoming<pressure.target*.5)run.waveIn=Math.min(run.waveIn,.35);
      const capacity=Math.min(pressure.target-incoming,26-enemies.filter(e=>!e.dead).length);
      if(run.waveIn<=0&&capacity>0)spawnWave(capacity);
    }
    if(run.musicTime>=ASSEMBLY_CUE&&!boss)assembleBoss();
    for(const e of enemies){
      e.px=e.x;e.py=e.y;
      if(e.retiring!==undefined){e.retiring-=dt;e.y-=dt*170;if(e.retiring<=0)e.dead=true;continue;}
      e.age+=dt;
      e.y+=e.vy*dt*(1+run.fallBoost*.8);
      const sway=e.sway??(e.formation===1?90:45),motionRate=e.motionRate??(e.formation===2?2:1.1);
      e.x=e.finale?e.base+Math.sin(run.finaleAge*1.25)*Math.min(W*.08,85):clamp(e.base+Math.sin(e.age*motionRate+e.phase)*sway,24,W-24);
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
    updateChase(dt,intent);
    if(run.musicTime>=songDuration-.001&&(!run.finale||run.finaleAge>=14)){finish(stormBosses.length===2&&stormBosses.every(b=>b.dead));return;}
    for(const s of shots){
      s.px=s.x;
      s.py=s.y;
      s.x+=s.vx*dt;
      s.y+=s.vy*dt;
      s.life-=dt;
      if(s.life<=0){fadingShots.push({...s,fade:.3,maxFade:.3});continue;}
      const guardian=stormBosses.find(b=>!b.dead&&b.age>2&&segmentHit(s,b.x,b.y,b.r));
      if(guardian){guardian.hp-=s.damage||1;impact(s,guardian.x,guardian.y);guardian.hit=.12;s.life=0;run.score+=20;continue;}
      let target=enemies.find(e=>!e.dead&&e.retiring===undefined&&segmentHit(s,e.x,e.y,e.r+5));
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
      if(b.dead)continue;
      b.px=b.x;
      b.py=b.y;
      b.x+=b.vx*dt;
      b.y+=b.vy*dt;
      if(segmentHit(b,hero.x,hero.y,17)){
        b.dead=true;
        impact(b,hero.x,hero.y);
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
    shots=shots.filter(s=>s.life>0&&projectileVisible(s,80));
    bullets=bullets.filter(b=>!b.dead&&projectileVisible(b,12));
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
      boss.dead=true;hero.hp=Math.min(5,hero.hp+2);hero.inv=Math.max(hero.inv,2.5);run.waveIn=1.5;run.score+=6000;explode(boss.x,boss.y,4);run.shake=Math.max(run.shake,25);clearBullets();
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
      enemies=[];clearBullets();
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
      if(b.hp<=0){b.hp=0;b.dead=true;run.score+=4500;run.kills++;run.charge=1;hero.hp=Math.min(5,hero.hp+1);explode(b.x,b.y,3.6);run.shake=Math.max(run.shake,23);clearBullets();debris.push({type:'boss',x:b.x,y:b.y,size:b.r*2.5,vx:b.side?65:-65,vy:100,spin:b.side?.6:-.6,rot:0,life:3});notice('TEMPEST SIGNAL LOST',b.x,b.y,'#d5faff',2);}
    }
    if(run.stormStarted&&!run.finale&&stormBosses.length===2&&stormBosses.every(b=>b.dead)){
      run.finale=true;run.finaleAge=0;run.waveIn=.8;run.charge=1;hero.inv=Math.max(hero.inv,3);clearBullets();
      notice('PRISM SPRAY / SHATTER THE LAST SWARM',W/2,H*.38,'#aef7ff',3);
    }
  }
  function spawnFinalFormation(){
    const choices=[0,1,2,3].filter(p=>p!==run.lastFinalPattern),pattern=choose(choices);
    run.lastFinalPattern=pattern;
    const cols=W<650?6:Math.floor(rnd(8,11)),rows=pattern===3?2:3,spacing=W*.76/(cols-1);
    for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
      const lane=col-(cols-1)/2;
      let x=W*.12+col*spacing,y=H+38+row*65;
      if(pattern===1)y+=Math.abs(lane)*18;
      if(pattern===2)y+=(col%2)*48;
      if(pattern===3){x+=row?spacing*.45:0;y+=Math.sin(col*.9)*24;}
      const type=Math.random()<.58?'scout':'interceptor';
      enemies.push({x,base:x,y,vx:0,vy:-rnd(118,143),hp:1,type,r:Math.min(type==='scout'?18:21,W*.029),phase:0,age:0,fire:rnd(1.65,2.35)+row*.55+(col%3)*.24,formation:pattern,finale:true,dead:false,tele:0});
    }
    run.wave++;run.waveIn=rnd(3.9,5.2);
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
    drawChaseHUD(margin);
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
      const planeRatio=art.plane?art.plane.w/art.plane.h:1.77;
      const planeHeight=Math.min(175,H*.195,W*.48/planeRatio);
      const botHeight=Math.min(65,H*.072,W*.06);
      const botSpacing=Math.min(230,W*.18);
      const attack=smooth(clamp(t/2.4,0,1));
      for(let i=0;i<3;i++){
        const bx=mix(i%2?-120:W+120,x+(i-1)*botSpacing,attack),by=y-130+i*100;
        sprite('interceptor',bx,by,botHeight,Math.sin(t+i)*.12);
        if(t>1.3+i*.25&&t<3.2){const pulse=(t*4+i)%1;line(mix(bx,x,pulse),mix(by,y,pulse),mix(bx,x,Math.min(1,pulse+.22)),mix(by,y,Math.min(1,pulse+.22)),'#ff9d73',3);}
      }
      if(t<3.2)sprite('plane',x,y,planeHeight,-.06+t*.015);
      else if(t<5.8){const crash=t-3.2;for(const side of [-1,1]){ctx.save();ctx.translate(x+side*crash*95,y+crash*105);ctx.rotate(side*crash*.7);ctx.beginPath();ctx.rect(side<0?-planeHeight:0,-planeHeight,planeHeight,planeHeight*2);ctx.clip();sprite('plane',0,0,planeHeight,0,clamp(1-crash/2.6,0,1));ctx.restore();}}
      if(t>3.05){hero.state='dive';hero.roll=0;const eject=smooth(clamp((t-3.05)/2.5,0,1));drawHero(mix(x,W/2,eject),mix(y,H*.30,eject),mix(70,heroSize(),eject));}
      label(t<1.5?'12,000 METERS. ZERO PERMISSION.':t<3.2?'HOSTILE SIGNAL. BREAK AWAY.':t<4.5?'THEY CAN’T GROUND YOU.':'TAKE BACK THE SKY.',W/2,H*.72,W<650?16:27,'#fff','center',500);
      label('2FLY / RETURN OF THE AVIATOR',W/2,H*.77,10,'#ffe0ac');
    }
    else if(hero){
      if(run.fallBoost>.01){for(let i=0;i<48;i++){const x=((i*.618)%1)*W,y=H-((scroll*2.5+i*97)%(H+100));line(x,y,x,y+25+run.fallBoost*160,`rgba(228,247,255,${run.fallBoost*.27})`,1);}}
      for(const e of enemies){
        drawAlgorithmBot(e);
      }
      drawChase();
      drawColossus();
      drawStormBosses();
      for(const d of debris)sprite(d.type,d.x,d.y,d.size,d.rot,clamp(d.life,0,1));
      ctx.save();
      ctx.globalCompositeOperation='lighter';
      for(const list of [shots,fadingShots])for(const s of list){
        ctx.globalAlpha=s.fade===undefined?1:clamp(s.fade/s.maxFade,0,1);
        const level=s.level||1,color=s.color||'#8aeeff';
        ctx.shadowColor=color;ctx.shadowBlur=level===1?0:14;
        if(level===3){line(s.x,s.y-58,s.x,s.y,color,9);line(s.x,s.y-56,s.x,s.y,'#fff5ff',3);}
        else{const radius=level===1?4:level===2?7:5.5;ctx.fillStyle='#edfaff';ctx.strokeStyle=color;ctx.lineWidth=level===1?1:2.5;ctx.beginPath();ctx.arc(s.x,s.y,radius,0,TAU);ctx.fill();ctx.stroke();}
        ctx.shadowBlur=0;
      }
      ctx.globalCompositeOperation='source-over';
      for(const list of [bullets,fadingBullets])for(const b of list){
        ctx.globalAlpha=b.fade===undefined?1:clamp(b.fade/b.maxFade,0,1);
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
    // Embedded autoplay is intentionally disabled: Wix/iframe playback needs the
    // BEGIN DESCENT click to grant the soundtrack a real user gesture.
    if(parent!==window)$('start').focus();
  }
  );
  // Read-only diagnostics for local QA; gameplay state is never writable from the UI.
  window.aviatorDiagnostics=()=>({
    crossfire:{active:run?.crossfire,wave:run?.crossfireWave,crashes:run?.hunterCrashes,pairs:run?.hunterPairs,hunters:packHunters.map(h=>({id:h.id,x:h.x,y:h.y,mode:h.mode,locked:h.locked,aimX:h.aimX,aimY:h.aimY,stun:h.stun,crashed:h.crashed,active:h.active}))},
    chase:hunter?{active:hunter.active,gap:hunter.gap,x:hunter.x,y:hunter.y,lock:hunter.lock,stun:hunter.stun,warning:hunter.warning,status:hunter.status,pathSamples:hunter.path.length,trailDelay:hunter.delay,obstacles:chaseObstacles.filter(o=>!o.dead).length,catches:run?.hunterCatches,baits:run?.hunterBaits,cleanDive:run?.cleanDive}:null,
    state,paused,time:run?.time||0,musicTime:run?.musicTime||0,songDuration,recoveries:run?.recoveries,fallBoost:run?.fallBoost,weapon:run?weaponLevel():1,finale:run?.finale,finaleAge:run?.finaleAge,pickups:pickups.length,airBrake:run?.airBrake,stormBosses:stormBosses.map(b=>({hp:b.hp,dead:b.dead,x:b.x,y:b.y})),viewport:{cssWidth:viewWidth,cssHeight:viewHeight,logicalWidth:W,logicalHeight:H,dpr,embedded:parent!==window},camera:{...camera},heroSize:heroSize(),parts:boss?.parts.filter(p=>p.hp>0).length,hp:hero?.hp,hero:hero?{
      x:hero.x,y:hero.y,state:hero.state,spinTime:hero.spinTime,fireBlend:hero.fireBlend
    }
    :null,score:run?.score,charge:run?.charge,entities:{
      enemies:enemies.length,shots:shots.length,bullets:bullets.length,fadingShots:fadingShots.length,fadingBullets:fadingBullets.length,particles:particles.length
    }
    ,wave:{index:run?.wave,lastPattern:run?.lastPattern,lastFinalPattern:run?.lastFinalPattern,miniBots:enemies.filter(e=>e.sync).length,formations:[...new Set(enemies.map(e=>e.formation))],types:enemies.reduce((mix,e)=>(mix[e.type]=(mix[e.type]||0)+1,mix),{})},boss:boss?.hp,assets:Object.keys(art).length,musicFailed,audio:audio?{
      paused:audio.paused,muted:audio.muted,time:audio.currentTime,src:audio.currentSrc||audio.src,title:'Too Fast'
    }
    :null
  }
  );
  requestAnimationFrame(frame);
}
)();
