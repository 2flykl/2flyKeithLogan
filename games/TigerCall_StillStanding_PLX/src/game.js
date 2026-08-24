(() => {
  'use strict';

  const PERFORMANCE_MIDI_PATH = 'assets/midi/TigerCall_NewHeart_HumanPerformance.mid';
  const REFERENCE_MIDI_PATH = 'assets/midi/TigerCall_NewHeart_Reference.mid';
  const PITCH_TO_LANE = {72:0,74:1,76:2,73:3};
  const KEY_TO_LANE = {KeyI:0,KeyO:1,KeyP:2,Digit9:3};
  const LANE_KEYS = ['I','O','P','9'];
  const LANE_ICONS = ['snare','bass_drum','cymbal','quads'];
  const APPROACH = 3.2;

  // Exact authored-marker sync:
  // videoTime = (midiTime - midiStart) * videoDuration / (midiEnd - midiStart)
  // We use the MIDI's authored Start/End markers, NOT the later MIDI file EOF.
  let midiSyncStart=0;
  let midiSyncEnd=0;
  let videoSyncEnd=0;
  let syncScale=1;
  let syncEndpointErrorSeconds=0;

  function mapMidiTimeToVideo(midiSeconds){
    return (midiSeconds-midiSyncStart)*syncScale;
  }

  const $ = id => document.getElementById(id);
  const shell = $('gameShell');
  const canvas = $('gameCanvas');
  const ctx = canvas.getContext('2d');
  const droneCanvas = $('droneCanvas');
  const dctx = droneCanvas.getContext('2d');
  const video = $('performanceVideo');
  const launchDeck = $('launchDeck');
  const launchBtn = $('launchBtn');
  const loadStatus = $('loadStatus');
  const sourceBadge = $('sourceBadge');
  const droneMessage = $('droneMessage');
  const launchCountdown = $('launchCountdown');
  const launchError = $('launchError');
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
  let bootReady=false, launchInProgress=false;

  const imgs={};
  const imageSources={
    paw_idle:'assets/gameplay/paws/paw_idle.png',
    paw_ready:'assets/gameplay/paws/paw_ready.png',
    paw_ultra:'assets/gameplay/paws/paw_ultra.png',
    snare:'assets/gameplay/instruments/snare.png',
    bass_drum:'assets/gameplay/instruments/bass_drum.png',
    cymbal:'assets/gameplay/instruments/cymbal.png',
    quads:'assets/gameplay/instruments/quads.png'
  };

  function loadImage(key,url){
    return new Promise(resolve=>{
      const im=new Image();
      im.onload=()=>{imgs[key]=im;resolve();};
      im.onerror=()=>resolve();
      im.src=url;
    });
  }

  function waitForVideoReady(){
    return new Promise((resolve,reject)=>{
      if(video.readyState>=2){resolve();return;}
      const timer=setTimeout(()=>reject(new Error('Performance video did not become ready.')),15000);
      const ok=()=>{clearTimeout(timer);cleanup();resolve();};
      const bad=()=>{clearTimeout(timer);cleanup();reject(new Error('Performance video could not be loaded.'));};
      const cleanup=()=>{
        video.removeEventListener('canplay',ok);
        video.removeEventListener('loadeddata',ok);
        video.removeEventListener('error',bad);
      };
      video.addEventListener('canplay',ok,{once:true});
      video.addEventListener('loadeddata',ok,{once:true});
      video.addEventListener('error',bad,{once:true});
      video.load();
    });
  }

  async function prepareFreshLaunch(){
    document.body.classList.add('launchMode');
    sourceBadge.textContent='SYSTEM CHECK';
    loadStatus.textContent='LOCKING PERFORMANCE DATA…';

    // NEWHEART MIDI PAIR:
    // - PERFORMANCE file supplies ONLY the 357 player cue notes.
    // - REFERENCE file supplies tempo changes + section markers.
    // This prevents other band tracks in the full MIDI from spawning lane icons.
    const [performanceBuf, referenceBuf] = await Promise.all([
      fetch(PERFORMANCE_MIDI_PATH,{cache:'no-store'}).then(r=>{
        if(!r.ok) throw new Error(`HumanPerformance MIDI load failed (${r.status})`);
        return r.arrayBuffer();
      }),
      fetch(REFERENCE_MIDI_PATH,{cache:'no-store'}).then(r=>{
        if(!r.ok) throw new Error(`NewHeart reference MIDI load failed (${r.status})`);
        return r.arrayBuffer();
      })
    ]);

    const performanceMidi=TigerMidi.parse(performanceBuf);
    const referenceMidi=TigerMidi.parse(referenceBuf);

    if(performanceMidi.division!==referenceMidi.division){
      throw new Error('NewHeart MIDI files use different tick divisions.');
    }

    // The standalone HumanPerformance file intentionally has no tempo map.
    // Convert its ticks through the full NewHeart tempo map.
    const timeline=TigerMidi.makeTimeline(referenceMidi.division,referenceMidi.tempos);

    const rawMarkers=referenceMidi.markers
      .map(m=>({name:m.name,time:timeline.tickToSeconds(m.tick)}))
      .sort((a,b)=>a.time-b.time);

    const startMarker=rawMarkers.find(m=>String(m.name).trim().toLowerCase()==='start');
    const endMarker=rawMarkers.find(m=>String(m.name).trim().toLowerCase()==='end');
    if(!startMarker||!endMarker){
      throw new Error('NewHeart reference MIDI is missing authored Start/End sync markers.');
    }

    // Video metadata must be loaded before solving the equation.
    await Promise.all([
      waitForVideoReady(),
      ...Object.entries(imageSources).map(([k,u])=>loadImage(k,u))
    ]);

    midiSyncStart=startMarker.time;
    midiSyncEnd=endMarker.time;
    videoSyncEnd=Number(video.duration);

    if(!Number.isFinite(videoSyncEnd)||videoSyncEnd<=0){
      throw new Error('Performance video duration is unavailable.');
    }
    if(!(midiSyncEnd>midiSyncStart)){
      throw new Error('NewHeart MIDI Start/End markers are invalid.');
    }

    // Solve the exact linear mapping between authored MIDI time and media time.
    syncScale=videoSyncEnd/(midiSyncEnd-midiSyncStart);
    syncEndpointErrorSeconds=videoSyncEnd-(midiSyncEnd-midiSyncStart);

    notes=performanceMidi.notes
      .filter(n=>PITCH_TO_LANE[n.note]!==undefined)
      .map((n,i)=>{
        const rawHit=timeline.tickToSeconds(n.tick);
        const rawEnd=timeline.tickToSeconds(n.endTick);
        const hitTime=mapMidiTimeToVideo(rawHit);
        const endTime=mapMidiTimeToVideo(rawEnd);
        return {
          id:i+1,
          lane:PITCH_TO_LANE[n.note],
          midiNote:n.note,
          rawMidiTime:rawHit,
          hitTime,
          endTime,
          duration:Math.max(0,endTime-hitTime),
          hit:false,missed:false
        };
      })
      .sort((a,b)=>a.hitTime-b.hitTime);

    markers=rawMarkers
      .map(m=>({name:m.name,rawMidiTime:m.time,time:mapMidiTimeToVideo(m.time)}))
      .sort((a,b)=>a.time-b.time);

    if(notes.length!==357){
      throw new Error(`Expected 357 HumanPerformance cues; loaded ${notes.length}.`);
    }

    bootReady=true;
    launchBtn.disabled=false;
    sourceBadge.textContent='SYNC LOCKED';
    droneMessage.textContent='RAYEN // 09';
    loadStatus.textContent=`357 CUES · ${(syncScale*100).toFixed(6)}% FIT · Δ ${(syncEndpointErrorSeconds*1000).toFixed(3)} ms`;
  }

  function resize(){
    dpr=Math.min(2,window.devicePixelRatio||1);
    const rect=shell.getBoundingClientRect();
    W=Math.max(320,rect.width);H=Math.max(420,rect.height);
    canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);
    canvas.style.width=W+'px';canvas.style.height=H+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);

    droneCanvas.width=Math.round(W*dpr);droneCanvas.height=Math.round(H*dpr);
    droneCanvas.style.width=W+'px';droneCanvas.style.height=H+'px';
    dctx.setTransform(dpr,0,0,dpr,0,0);
  }

  // LED drone show: animated tiger-eye / marching-T / sound-wave formation.
  const droneDots=Array.from({length:150},(_,i)=>({
    seed:i*13.71,
    ring:i%5,
    phase:(i/150)*Math.PI*2,
    twinkle:.55+((i*17)%43)/100
  }));
  function drawDrones(ms){
    if(!launchDeck.classList.contains('active')) return;
    const t=ms/1000;
    dctx.clearRect(0,0,W,H);
    const cx=W*.73, cy=H*.35;
    const scale=Math.min(W,H)*.22;

    for(let i=0;i<droneDots.length;i++){
      const p=droneDots[i];
      let x,y;
      const mode=Math.floor(t/4)%3;
      if(mode===0){
        // Eye / tiger-call oval.
        const a=p.phase;
        const rr=.48+.11*Math.sin(p.ring*1.7+t*.7);
        x=cx+Math.cos(a)*scale*1.18*rr;
        y=cy+Math.sin(a)*scale*.56*rr;
        if(i%7===0){x=cx+Math.cos(a)*scale*.20;y=cy+Math.sin(a)*scale*.20;}
      }else if(mode===1){
        // Giant T formation.
        const frac=i/(droneDots.length-1);
        if(i<70){x=cx+((i/69)-.5)*scale*1.35;y=cy-scale*.42;}
        else{x=cx+Math.sin(p.seed)*5;y=cy-scale*.42+((i-70)/79)*scale*1.05;}
        x+=Math.sin(t*1.8+p.seed)*2;
      }else{
        // Audio waveform / band-call sweep.
        const frac=i/(droneDots.length-1);
        x=cx+(frac-.5)*scale*1.75;
        y=cy+Math.sin(frac*Math.PI*7-t*3.2)*scale*.22*(.35+.65*Math.sin(frac*Math.PI));
      }
      const glow=.45+.55*Math.sin(t*2.4+p.seed)*p.twinkle;
      dctx.beginPath();
      dctx.fillStyle=`rgba(255,${Math.round(95+90*glow)},${Math.round(10+30*glow)},${.45+.5*glow})`;
      dctx.shadowBlur=8+12*glow;dctx.shadowColor='#ff6200';
      dctx.arc(x,y,1.4+2*glow,0,Math.PI*2);dctx.fill();
    }
    dctx.shadowBlur=0;
    requestAnimationFrame(drawDrones);
  }

  function laneX(lane,p){
    const topW=W*.28,bottomW=W*.76;
    const width=topW+(bottomW-topW)*p;
    return W/2-width/2+width*(lane+.5)/4;
  }
  const receptorY=()=>H*.86;

  function drawHighway(now){
    ctx.clearRect(0,0,W,H);
    const topY=H*.18,bottomY=receptorY(),topW=W*.28,bottomW=W*.76;
    ctx.fillStyle='rgba(3,2,1,.56)';
    ctx.beginPath();ctx.moveTo(W/2-topW/2,topY);ctx.lineTo(W/2+topW/2,topY);ctx.lineTo(W/2+bottomW/2,bottomY+48);ctx.lineTo(W/2-bottomW/2,bottomY+48);ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(255,98,0,.88)';ctx.shadowBlur=7;ctx.shadowColor='rgba(255,98,0,.65)';ctx.lineWidth=2.4;
    for(let i=0;i<=4;i++){const tx=W/2-topW/2+topW*i/4,bx=W/2-bottomW/2+bottomW*i/4;ctx.beginPath();ctx.moveTo(tx,topY);ctx.lineTo(bx,bottomY+48);ctx.stroke();}
    ctx.shadowBlur=0;

    for(const n of notes){
      if(n.hit||n.missed) continue;
      const dt=n.hitTime-now;
      if(dt>APPROACH||dt<-.22) continue;
      if(dt<-.16){n.missed=true;combo=0;judge('MISS');updateHud();continue;}
      const p=Math.max(0,Math.min(1,1-dt/APPROACH));
      const x=laneX(n.lane,p),y=topY+(bottomY-topY)*p,s=.55+.65*p;
      ctx.save();ctx.translate(x,y);ctx.globalAlpha=.98;
      ctx.fillStyle='rgba(255,98,0,.18)';ctx.beginPath();ctx.arc(0,0,32*s,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#ff6200';ctx.lineWidth=2.4;ctx.shadowBlur=16;ctx.shadowColor='#ff6200';ctx.beginPath();ctx.arc(0,0,26*s,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;
      const icon=imgs[LANE_ICONS[n.lane]];
      if(icon) ctx.drawImage(icon,-23*s,-23*s,46*s,46*s);
      else{ctx.fillStyle='#fff';ctx.font=`900 ${18*s}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(LANE_KEYS[n.lane],0,0);}
      ctx.restore();
    }

    for(let lane=0;lane<4;lane++){
      const x=laneX(lane,1),y=bottomY;
      const active=notes.some(n=>!n.hit&&!n.missed&&n.lane===lane&&Math.abs(n.hitTime-now)<.11);
      const paw=imgs[ultra?'paw_ultra':active?'paw_ready':'paw_idle'];
      ctx.save();ctx.translate(x,y);ctx.shadowBlur=active?28:16;ctx.shadowColor=active?'#fff':'#ff6200';
      if(paw) ctx.drawImage(paw,-54,-54,108,108); else{ctx.strokeStyle='#ff6200';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,42,0,Math.PI*2);ctx.stroke();}
      ctx.shadowBlur=0;const icon=imgs[LANE_ICONS[lane]];if(icon)ctx.drawImage(icon,-18,-18,36,36);
      ctx.fillStyle='#fff';ctx.font='900 14px sans-serif';ctx.textAlign='center';ctx.fillText(LANE_KEYS[lane],0,62);ctx.restore();
    }
  }

  function judge(text){judgeEl.textContent=text;judgeEl.classList.remove('pop');void judgeEl.offsetWidth;judgeEl.classList.add('pop');}
  function updateHud(){scoreEl.textContent=String(score).padStart(7,'0');comboEl.textContent=combo;hypeFill.style.width=hype+'%';}

  function hitLane(lane){
    if(!running||paused)return;
    const now=video.currentTime||0;
    let best=null,err=Infinity;
    for(const n of notes){
      if(n.hit||n.missed||n.lane!==lane)continue;
      const e=Math.abs(n.hitTime-now);if(e<err){err=e;best=n;}
      if(n.hitTime>now+.18)break;
    }
    if(!best||err>.16){combo=0;judge('MISS');updateHud();return;}
    best.hit=true;combo++;hype=Math.min(100,hype+(err<=.045?2.2:err<=.085?1.5:.8));
    if(err<=.045){score+=1000;judge('PERFECT');}else if(err<=.085){score+=700;judge('GREAT');}else{score+=400;judge('GOOD');}
    score+=combo*8;updateHud();
  }

  function markerEvent(name){
    markerLabel.textContent=name.toUpperCase();markerLabel.classList.remove('show');void markerLabel.offsetWidth;markerLabel.classList.add('show');
    if(/Stripe/i.test(name)&&!/Hold/i.test(name)){stripeLevel=Math.min(3,stripeLevel+1);document.body.dataset.stripes=String(stripeLevel);flashSides();}
    if(name==='Unlock Ultra Tiger Power Up'){ultra=true;document.body.classList.add('ultra');setTimeout(()=>document.body.classList.remove('ultra'),1600);confetti(70);}
    if(name==='FireWorks')confetti(35);
    if(name==='Tiger Party')document.body.classList.add('tigerParty');
    if(name==='Pre-Tiger Call')document.body.classList.add('preCall');
    if(name==='Full Band2'){document.body.classList.remove('preCall');flashSides();}
  }
  function flashSides(){sideLeft.classList.add('flash');sideRight.classList.add('flash');setTimeout(()=>{sideLeft.classList.remove('flash');sideRight.classList.remove('flash');},550);}
  function confetti(count){const layer=$('confetti');for(let i=0;i<count;i++){const s=document.createElement('i');s.style.left=(5+Math.random()*90)+'%';s.style.animationDelay=(Math.random()*.25)+'s';s.style.animationDuration=(1.1+Math.random()*1.2)+'s';layer.appendChild(s);setTimeout(()=>s.remove(),2600);}}

  function resetGameState(){
    score=0;combo=0;hype=0;nextMarker=0;stripeLevel=0;ultra=false;paused=false;
    notes.forEach(n=>{n.hit=false;n.missed=false;});
    document.body.dataset.stripes='0';document.body.classList.remove('ultra','tigerParty','preCall');
    updateHud();judgeEl.textContent='READY';
  }

  function gameLoop(){
    if(!running)return;
    const now=video.currentTime||0;
    while(nextMarker<markers.length&&markers[nextMarker].time<=now+.01){markerEvent(markers[nextMarker].name);nextMarker++;}
    drawHighway(now);
    if(video.ended){finish();return;}
    requestAnimationFrame(gameLoop);
  }

  function showCountdown(text){
    launchCountdown.textContent=text;launchCountdown.classList.remove('show');void launchCountdown.offsetWidth;launchCountdown.classList.add('show');
  }

  // Fresh entry route. The unmuted performance video is the ONE master media clock.
  // Its built-in AAC audio, the picture, MIDI cues, lane motion, judging, pause and replay
  // all reference video.currentTime, so there are no two media clocks to drift.
  function freshLaunch(){
    if(!bootReady||launchInProgress)return;
    launchInProgress=true;
    launchBtn.disabled=true;
    launchError.classList.remove('show');
    resetGameState();

    video.pause();
    try{video.currentTime=0;}catch(_e){}
    video.muted=false;
    video.volume=1;
    video.loop=false;

    sourceBadge.textContent='CALLING FORMATION';
    droneMessage.textContent='GO TIGERS';
    showCountdown('T');

    // Directly inside the user's click gesture: this is the only media play() call.
    const playPromise=video.play();

    Promise.resolve(playPromise).then(()=>{
      shell.classList.add('launching');
      setTimeout(()=>showCountdown('09'),210);
      setTimeout(()=>{
        launchDeck.classList.add('depart');
        drawHighway(video.currentTime||0);
      },360);
      setTimeout(()=>{
        launchDeck.classList.remove('active','depart');
        document.body.classList.remove('launchMode');
        shell.classList.remove('launching');
        running=true;
        paused=false;
        launchInProgress=false;
        requestAnimationFrame(gameLoop);
      },860);
    }).catch(err=>{
      console.error('Performance video/audio start failure:',err);
      launchInProgress=false;
      launchBtn.disabled=false;
      sourceBadge.textContent='MEDIA BLOCKED';
      droneMessage.textContent='TAP START AGAIN';
      launchError.textContent='The browser did not start the performance video with sound. Click START TIGER CALL again.';
      launchError.classList.add('show');
    });
  }

  function finish(){
    running=false;
    video.pause();
    $('resultScore').textContent=score.toLocaleString();
    $('resultScreen').classList.add('active');
  }

  function togglePause(){
    if(!running)return;
    paused=!paused;
    if(paused){
      video.pause();
      $('pauseScreen').classList.add('active');
    }else{
      video.play().then(()=>{
        $('pauseScreen').classList.remove('active');
        requestAnimationFrame(gameLoop);
      }).catch(()=>{paused=true;});
    }
  }

  function replay(){
    $('resultScreen').classList.remove('active');
    resetGameState();
    video.pause();
    try{video.currentTime=0;}catch(_e){}
    video.muted=false;
    video.volume=1;
    const p=video.play();
    Promise.resolve(p).then(()=>{
      running=true;
      paused=false;
      requestAnimationFrame(gameLoop);
    }).catch(()=>{
      running=false;
      launchDeck.classList.add('active');
      document.body.classList.add('launchMode');
      launchBtn.disabled=false;
    });
  }

  launchBtn.addEventListener('click',freshLaunch);
  $('pauseBtn').addEventListener('click',togglePause);
  $('resumeBtn').addEventListener('click',togglePause);
  $('replayBtn').addEventListener('click',replay);
  window.addEventListener('keydown',e=>{if(KEY_TO_LANE[e.code]!==undefined){e.preventDefault();hitLane(KEY_TO_LANE[e.code]);}});
  window.addEventListener('resize',resize);

  resize();
  requestAnimationFrame(drawDrones);
  prepareFreshLaunch().catch(err=>{
    console.error(err);sourceBadge.textContent='LOAD ERROR';droneMessage.textContent='CHECK FILES';loadStatus.textContent=err.message;launchError.textContent=err.message;launchError.classList.add('show');
  });
})();
