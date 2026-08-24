
(() => {
  'use strict';

  const PATHS = {
    mp3: 'assets/audio/TigerCall_FinalMaster.mp3',
    mp3: 'assets/audio/TigerCall_FinalMaster.mp3',
    human: 'assets/midi/TigerCall_NewHeart_HumanPerformance.mid',
    tempo: 'assets/midi/TigerCallNewHeart.mid',
    video: 'assets/video/tiger-call-still-standing.mp4'
  };

  const PITCH_TO_LANE = {72:0,74:1,76:2,73:3};
  const KEY_TO_LANE = {KeyI:0,KeyO:1,KeyP:2,Digit9:3};
  const LANE_KEYS = ['I','O','P','9'];
  const LANE_NAMES = ['LEFT','DOWN','RIGHT','UP'];
  const LANE_ICONS = ['snare','bass_drum','cymbal','quads'];
  const APPROACH = 3.6;

  const $ = id => document.getElementById(id);
  const canvas = $('gameCanvas');
  const ctx = canvas.getContext('2d');
  const video = $('performanceVideo');
  const audio = $('gameplayAudio');
  const startScreen = $('startScreen');
  const startBtn = $('startBtn');
  const retrySound = $('retrySound');
  const pauseBtn = $('pauseBtn');
  const scoreEl = $('score');
  const comboEl = $('combo');
  const judgeEl = $('judge');
  const hypeFill = $('hypeFill');
  const markerLabel = $('markerLabel');
  const sideLeft = $('sideLeft');
  const sideRight = $('sideRight');

  let W=0,H=0,dpr=1;
  let notes=[], markers=[], running=false, paused=false, nextMarker=0;
  let score=0, combo=0, hype=0, stripeLevel=0, ultra=false;
  let assetReady=false;

  const imgs={};
  const imageSources={
    paw_idle:'assets/gameplay/paws/paw_idle.png',
    paw_ready:'assets/gameplay/paws/paw_ready.png',
    paw_hit:'assets/gameplay/paws/paw_hit.png',
    paw_perfect:'assets/gameplay/paws/paw_perfect.png',
    paw_hold:'assets/gameplay/paws/paw_hold.png',
    paw_ultra:'assets/gameplay/paws/paw_ultra.png',
    paw_miss:'assets/gameplay/paws/paw_miss.png',
    snare:'assets/gameplay/instruments/snare.png',
    bass_drum:'assets/gameplay/instruments/bass_drum.png',
    cymbal:'assets/gameplay/instruments/cymbal.png',
    quads:'assets/gameplay/instruments/quads.png'
  };

  async function loadImage(key,url){
    return new Promise(resolve=>{
      const im=new Image();
      im.onload=()=>{imgs[key]=im; resolve();};
      im.onerror=()=>resolve();
      im.src=url;
    });
  }

  async function loadAll(){
    const [humanBuf,tempoBuf]=await Promise.all([
      fetch(PATHS.human,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Human MIDI '+r.status);return r.arrayBuffer();}),
      fetch(PATHS.tempo,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Tempo MIDI '+r.status);return r.arrayBuffer();})
    ]);
    const human=TigerMidi.parse(humanBuf);
    const tempo=TigerMidi.parse(tempoBuf);
    if(human.division!==tempo.division) throw Error('MIDI PPQ mismatch');
    const timeline=TigerMidi.makeTimeline(tempo.division,tempo.tempos);

    notes=human.notes
      .filter(n=>PITCH_TO_LANE[n.note]!==undefined)
      .map((n,i)=>{
        const lane=PITCH_TO_LANE[n.note];
        const hitTime=timeline.tickToSeconds(n.tick);
        const endTime=timeline.tickToSeconds(n.endTick);
        return {
          id:i+1,lane,midiNote:n.note,hitTime,endTime,
          duration:Math.max(0,endTime-hitTime),
          hit:false,missed:false,holding:false
        };
      });

    markers=tempo.markers.map(m=>({
      name:m.name,
      time:timeline.tickToSeconds(m.tick)
    }));

    await Promise.all(Object.entries(imageSources).map(([k,u])=>loadImage(k,u)));
    assetReady=true;

    $('loadStatus').textContent=`READY · ${notes.length} PLAYABLE NOTES`;
    startBtn.disabled=false;
  }

  function resize(){
    dpr=Math.min(2,window.devicePixelRatio||1);
    const rect=canvas.parentElement.getBoundingClientRect();
    W=Math.max(320,rect.width); H=Math.max(420,rect.height);
    canvas.width=Math.round(W*dpr); canvas.height=Math.round(H*dpr);
    canvas.style.width=W+'px'; canvas.style.height=H+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    if(running) drawHighway(audio.currentTime || 0);
  }

  function laneX(lane,p){
    const topW=W*.28, bottomW=W*.76;
    const width=topW+(bottomW-topW)*p;
    return W/2-width/2 + width*(lane+.5)/4;
  }

  function receptorY(){ return H*.86; }

  function drawHighway(now){
    ctx.clearRect(0,0,W,H);

    const topY=H*.18, bottomY=receptorY();
    const topW=W*.28, bottomW=W*.76;
    ctx.fillStyle='rgba(3,2,1,.56)';
    ctx.beginPath();
    ctx.moveTo(W/2-topW/2,topY);
    ctx.lineTo(W/2+topW/2,topY);
    ctx.lineTo(W/2+bottomW/2,bottomY+48);
    ctx.lineTo(W/2-bottomW/2,bottomY+48);
    ctx.closePath();ctx.fill();

    ctx.strokeStyle='rgba(255,98,0,.88)';
    ctx.shadowBlur=7;ctx.shadowColor='rgba(255,98,0,.65)';
    ctx.lineWidth=2.4;
    for(let i=0;i<=4;i++){
      const tx=W/2-topW/2+topW*i/4;
      const bx=W/2-bottomW/2+bottomW*i/4;
      ctx.beginPath();ctx.moveTo(tx,topY);ctx.lineTo(bx,bottomY+48);ctx.stroke();
    }
    ctx.shadowBlur=0;

    // Incoming notes
    for(const n of notes){
      if(n.hit||n.missed) continue;
      const dt=n.hitTime-now;
      if(dt>APPROACH || dt<-.22) continue;
      if(dt<-.16){ n.missed=true; combo=0; judge('MISS'); continue; }

      const p=Math.max(0,Math.min(1,1-dt/APPROACH));
      const x=laneX(n.lane,p);
      const y=topY+(bottomY-topY)*p;
      const s=.55+.65*p;

      ctx.save();
      ctx.translate(x,y);
      ctx.globalAlpha=.96;
      ctx.fillStyle='rgba(255,98,0,.18)';
      ctx.beginPath();ctx.arc(0,0,32*s,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#ff6200';ctx.lineWidth=2.4;
      ctx.shadowBlur=16;ctx.shadowColor='#ff6200';
      ctx.beginPath();ctx.arc(0,0,26*s,0,Math.PI*2);ctx.stroke();
      ctx.shadowBlur=0;

      const icon=imgs[LANE_ICONS[n.lane]];
      if(icon) ctx.drawImage(icon,-23*s,-23*s,46*s,46*s);
      else {
        ctx.fillStyle='#fff';ctx.font=`900 ${18*s}px sans-serif`;
        ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillText(LANE_KEYS[n.lane],0,0);
      }
      ctx.restore();

      if(n.duration>.35){
        const endDt=n.endTime-now;
        const endP=Math.max(p,Math.min(1,1-endDt/APPROACH));
        const ex=laneX(n.lane,endP), ey=topY+(bottomY-topY)*endP;
        ctx.strokeStyle='rgba(255,180,70,.75)';ctx.lineWidth=8*s;
        ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(ex,ey);ctx.stroke();
      }
    }

    // Landing paws
    for(let lane=0;lane<4;lane++){
      const x=laneX(lane,1), y=bottomY;
      const active=notes.some(n=>!n.hit&&!n.missed&&n.lane===lane&&Math.abs(n.hitTime-now)<.11);
      const paw=imgs[ultra?'paw_ultra':active?'paw_ready':'paw_idle'];

      ctx.save();ctx.translate(x,y);
      ctx.shadowBlur=active?28:16;ctx.shadowColor=active?'#fff':'#ff6200';
      if(paw) ctx.drawImage(paw,-54,-54,108,108);
      else {
        ctx.strokeStyle='#ff6200';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,42,0,Math.PI*2);ctx.stroke();
      }
      ctx.shadowBlur=0;
      const icon=imgs[LANE_ICONS[lane]];
      if(icon) ctx.drawImage(icon,-21,-21,42,42);
      ctx.fillStyle='#fff';ctx.font='900 14px sans-serif';ctx.textAlign='center';
      ctx.fillText(LANE_KEYS[lane],0,62);
      ctx.restore();
    }
  }

  function judge(text){
    judgeEl.textContent=text;
    judgeEl.classList.remove('pop');
    void judgeEl.offsetWidth;
    judgeEl.classList.add('pop');
  }

  function hitLane(lane){
    if(!running||paused) return;
    const now=audio.currentTime;
    let best=null,err=Infinity;
    for(const n of notes){
      if(n.hit||n.missed||n.lane!==lane) continue;
      const e=Math.abs(n.hitTime-now);
      if(e<err){err=e;best=n;}
      if(n.hitTime>now+.18) break;
    }
    if(!best||err>.16){ combo=0; judge('MISS'); updateHud(); return; }

    best.hit=true;
    combo++;
    hype=Math.min(100,hype+(err<=.045?2.2:err<=.085?1.5:.8));
    if(err<=.045){score+=1000;judge('PERFECT');}
    else if(err<=.085){score+=700;judge('GREAT');}
    else {score+=400;judge('GOOD');}
    score+=combo*8;
    updateHud();
  }

  function updateHud(){
    scoreEl.textContent=String(score).padStart(7,'0');
    comboEl.textContent=combo;
    hypeFill.style.width=hype+'%';
  }

  function markerEvent(name){
    markerLabel.textContent=name.toUpperCase();
    markerLabel.classList.remove('show'); void markerLabel.offsetWidth; markerLabel.classList.add('show');

    if(/Stripe/i.test(name) && !/Hold/i.test(name)){
      stripeLevel=Math.min(3,stripeLevel+1);
      document.body.dataset.stripes=String(stripeLevel);
      flashSides();
    }
    if(name==='Unlock Ultra Tiger Power Up'){
      ultra=true; document.body.classList.add('ultra');
      setTimeout(()=>document.body.classList.remove('ultra'),1600);
      confetti(70);
    }
    if(name==='FireWorks') confetti(35);
    if(name==='Tiger Party') document.body.classList.add('tigerParty');
    if(name==='Pre-Tiger Call') document.body.classList.add('preCall');
    if(name==='Full Band2'){ document.body.classList.remove('preCall'); flashSides(); }
  }

  function flashSides(){
    sideLeft.classList.add('flash');sideRight.classList.add('flash');
    setTimeout(()=>{sideLeft.classList.remove('flash');sideRight.classList.remove('flash');},550);
  }

  function confetti(count){
    const layer=$('confetti');
    for(let i=0;i<count;i++){
      const s=document.createElement('i');
      s.style.left=(5+Math.random()*90)+'%';
      s.style.animationDelay=(Math.random()*.25)+'s';
      s.style.animationDuration=(1.1+Math.random()*1.2)+'s';
      layer.appendChild(s);
      setTimeout(()=>s.remove(),2600);
    }
  }

  function loop(){
    if(!running) return;
    const now=audio.currentTime;
    while(nextMarker<markers.length && markers[nextMarker].time<=now+.01){
      markerEvent(markers[nextMarker].name);
      nextMarker++;
    }
    drawHighway(now);
    if(audio.ended){ finish(); return; }
    requestAnimationFrame(loop);
  }

  function reset(){
    score=0;combo=0;hype=0;nextMarker=0;stripeLevel=0;ultra=false;
    notes.forEach(n=>{n.hit=false;n.missed=false;n.holding=false;});
    document.body.dataset.stripes='0';
    document.body.classList.remove('ultra','tigerParty','preCall');
    updateHud();judgeEl.textContent='READY';
  }

  async function start(){
    reset();

    video.muted=true;
    video.volume=0;
    video.loop=true;

    audio.pause();
    try{ audio.currentTime=0; }catch(e){}
    audio.muted=false;
    audio.volume=1;

    try{
      await audio.play();
    }catch(err){
      console.error('MP3 playback failed',err);
      retrySound.classList.add('active');
      return;
    }

    startScreen.classList.remove('active');
    retrySound.classList.remove('active');

    running=true;
    paused=false;

    video.play().catch(()=>{});

    drawHighway(audio.currentTime);
    requestAnimationFrame(loop);
  }

  function finish(){
    running=false;
    $('resultScore').textContent=score.toLocaleString();
    $('resultScreen').classList.add('active');
  }

  function togglePause(){
    if(!running) return;
    paused=!paused;
    if(paused){ audio.pause();video.pause();$('pauseScreen').classList.add('active');}
    else {
      audio.play().catch(()=>retrySound.classList.add('active'));
      video.play().catch(()=>{});
      $('pauseScreen').classList.remove('active');
      requestAnimationFrame(loop);
    }
  }

  startBtn.addEventListener('click',start);
  retrySound.addEventListener('click',async()=>{
    audio.muted=false;
    audio.volume=1;
    try{
      await audio.play();
      retrySound.classList.remove('active');
      if(!running){
        startScreen.classList.remove('active');
        running=true;
        paused=false;
        drawHighway(audio.currentTime);
        requestAnimationFrame(loop);
      }
    }catch(err){
      console.error('MP3 retry failed',err);
      retrySound.classList.add('active');
    }
  });
  pauseBtn.addEventListener('click',togglePause);
  $('resumeBtn').addEventListener('click',togglePause);
  $('replayBtn').addEventListener('click',()=>{ $('resultScreen').classList.remove('active'); start(); });

  window.addEventListener('keydown',e=>{
    if(KEY_TO_LANE[e.code]!==undefined){ e.preventDefault(); hitLane(KEY_TO_LANE[e.code]); }
  });
  window.addEventListener('resize',resize);

  resize();
  loadAll().catch(err=>{
    console.error(err);
    $('loadStatus').textContent='LOAD ERROR — '+err.message;
  });
})();
