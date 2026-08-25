(() => {
  'use strict';

  const PERFORMANCE_MIDI_PATH = 'assets/midi/TigerCall_NewHeart_HumanPerformance.mid';
  const REFERENCE_MIDI_PATH = 'assets/midi/TigerCall_NewHeart_Reference.mid';
  const PITCH_TO_LANE = {72:0,74:1,76:2,73:3};
  const KEY_TO_LANE = {KeyI:0,KeyO:1,KeyP:2,Digit9:3,Numpad9:3,ArrowLeft:0,ArrowDown:1,ArrowRight:2,ArrowUp:3};
  const LANE_KEYS = ['LEFT','DOWN','RIGHT','UP'];
  const LANE_NAMES = ['LEFT','DOWN','RIGHT','UP'];
  const ARROW_LABELS = ['←','↓','→','↑'];
  const LANE_DIRS = ['left','down','right','up'];
  const PAW_VARIANTS = ['classic','stripe','claw','solid','flame','bold'];
  const RECEPTOR_ASSETS = [
    'receptor_left','receptor_down','receptor_right','receptor_up'
  ];
  const APPROACH = 2.45;
  const FIXED_OFFSET = 0.0; // in seconds

  // Exact authored-marker sync:
  // videoTime = (midiTime - midiStart) * videoDuration / (midiEnd - midiStart)
  // We use the MIDI's authored Start/End markers, NOT the later MIDI file EOF.
  let midiSyncStart=0;
  let midiSyncEnd=0;
  let videoSyncEnd=0;
  let syncScale=1;
  let syncEndpointErrorSeconds=0;

  // Interpolated time variables for smooth visual note highway
  let lastVideoTime = 0;
  let lastVideoTimeCheckedAt = 0;

  function getInterpolatedTime() {
    if (video.paused || !running) {
      return video.currentTime || 0;
    }
    const now = performance.now();
    const vTime = video.currentTime || 0;
    
    if (vTime !== lastVideoTime) {
      lastVideoTime = vTime;
      lastVideoTimeCheckedAt = now;
    }
    
    const elapsed = (now - lastVideoTimeCheckedAt) / 1000;
    const delta = Math.min(0.1, elapsed * video.playbackRate);
    return lastVideoTime + delta;
  }

  // Debug overlay variables
  let lastJudgementDelta = 0;
  let debugOverlayEl = null;

  function ensureDebugOverlay() {
    if (debugOverlayEl) return;
    debugOverlayEl = document.createElement('div');
    debugOverlayEl.id = 'debugOverlay';
    debugOverlayEl.style.position = 'absolute';
    debugOverlayEl.style.top = '10px';
    debugOverlayEl.style.right = '10px';
    debugOverlayEl.style.backgroundColor = 'rgba(0,0,0,0.85)';
    debugOverlayEl.style.color = '#00ff00';
    debugOverlayEl.style.fontFamily = 'monospace';
    debugOverlayEl.style.fontSize = '12px';
    debugOverlayEl.style.padding = '10px';
    debugOverlayEl.style.borderRadius = '5px';
    debugOverlayEl.style.border = '1px solid #00ff00';
    debugOverlayEl.style.zIndex = '9999';
    debugOverlayEl.style.pointerEvents = 'none';
    debugOverlayEl.style.lineHeight = '1.4';
    document.body.appendChild(debugOverlayEl);
  }

  function updateDebugOverlay() {
    ensureDebugOverlay();
    
    const vTime = video.currentTime || 0;
    const mappedMidi = midiSyncStart + vTime / syncScale;
    
    let nextCue = null;
    let activeCount = 0;
    let spawnedCount = 0;
    
    for (const n of notes) {
      if (!n.hit && !n.missed) {
        if (!nextCue) nextCue = n;
      }
      
      const dt = n.hitTime - vTime;
      if (dt <= APPROACH && !n.hit && !n.missed) {
        spawnedCount++;
        if (dt >= -0.190) {
          activeCount++;
        }
      }
    }
    
    const nextCueStr = nextCue 
      ? `LANE ${nextCue.lane} @ ${nextCue.hitTime.toFixed(3)}s` 
      : 'NONE';
    const deltaStr = lastJudgementDelta !== 0 
      ? (lastJudgementDelta > 0 ? `+${lastJudgementDelta}` : `${lastJudgementDelta}`) + 'ms'
      : '0ms';
    
    debugOverlayEl.innerHTML = `
      <div>VIDEO: ${vTime.toFixed(3)}s</div>
      <div>MIDI MAPPED: ${mappedMidi.toFixed(3)}s</div>
      <div>SYNC SCALE: ${(syncScale * 100).toFixed(6)}%</div>
      <div>SYNC OFFSET: 0ms</div>
      <div>NEXT CUE: ${nextCueStr}</div>
      <div>CUES TOTAL: ${notes.length}</div>
      <div>SPAWNED: ${spawnedCount}</div>
      <div>ACTIVE: ${activeCount}</div>
      <div>LAST JUDGE: ${deltaStr}</div>
      <div>PLAYBACK: ${video.paused ? 'PAUSED' : video.ended ? 'ENDED' : 'PLAYING'}</div>
    `;
  }

  function mapMidiTimeToVideo(midiSeconds){
    return (midiSeconds-midiSyncStart)*syncScale + FIXED_OFFSET;
  }
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const easeOut=t=>1-Math.pow(1-t,3);

  function resolveLaneFromEvent(e){
    if (KEY_TO_LANE[e.code] !== undefined) return KEY_TO_LANE[e.code];
    const key=String(e.key||'').toLowerCase();
    if(key==='i' || key==='arrowleft') return 0;
    if(key==='o' || key==='arrowdown') return 1;
    if(key==='p' || key==='arrowright') return 2;
    if(key==='9' || key==='arrowup') return 3;
    return undefined;
  }

  function noteAssetKey(note){
    return `note_${PAW_VARIANTS[note.variantIndex % PAW_VARIANTS.length]}_${LANE_DIRS[note.lane]}`;
  }

  function drawLedPattern(px, py, cell, pattern, options={}){
    const onColor = options.onColor || '#ff8b24';
    const offColor = options.offColor || 'rgba(255,255,255,0.08)';
    const glow = options.glow ?? 12;
    const pulseBase = options.pulseBase ?? 0;
    const rounding = options.rounding ?? cell * 0.34;
    for (let r = 0; r < pattern.length; r++) {
      for (let c = 0; c < pattern[r].length; c++) {
        const on = pattern[r][c] === '1';
        const x = px + c * cell;
        const y = py + r * cell;
        const pulse = on ? (0.65 + 0.35 * Math.sin(pulseBase + r * 0.7 + c * 0.5)) : 1;
        ctx.fillStyle = on ? onColor : offColor;
        if (on) {
          ctx.shadowBlur = glow;
          ctx.shadowColor = onColor;
          ctx.globalAlpha = 0.72 + 0.28 * pulse;
        } else {
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 0.35;
        }
        ctx.beginPath();
        ctx.roundRect(x, y, cell * 0.68, cell * 0.68, rounding);
        ctx.fill();
      }
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
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
  const confettiLayer = $('confetti');

  let W=0,H=0,dpr=1;
  let notes=[], markers=[], running=false, paused=false, nextMarker=0;
  let score=0, combo=0, hype=0, stripeLevel=0, ultra=false;
  let bootReady=false, launchInProgress=false;
  let impacts=[];
  let lastJudgeMs=0;
  let lastShowMilestone=-1;
  let sideFlashUntil=0;

  const imgs={};
  const imageSources={
    receptor_left:'assets/generated/receptors/paw_receptor_left.svg',
    receptor_down:'assets/generated/receptors/paw_receptor_down.svg',
    receptor_right:'assets/generated/receptors/paw_receptor_right.svg',
    receptor_up:'assets/generated/receptors/paw_receptor_up.svg',
    lane_overlay:'assets/generated/lanes/lane_overlay.svg'
  };
  for (const variant of PAW_VARIANTS) {
    for (const dir of LANE_DIRS) {
      imageSources[`note_${variant}_${dir}`] = `assets/generated/notes/${variant}/paw_note_${variant}_${dir}.svg`;
    }
  }
  const confettiColors=['#ff7a12','#ffffff','#111111'];
  let confettiParticles=[];
  let autoHypeBurstAt=0;

  function loadImage(key,url){
    return new Promise((resolve,reject)=>{
      const im=new Image();
      im.onload=()=>{imgs[key]=im;resolve();};
      im.onerror=()=>reject(new Error(`${url} FAILED TO LOAD`));
      im.src=url;
    });
  }

  function waitForVideoReady(){
    return new Promise((resolve,reject)=>{
      if(video.readyState>=2){resolve();return;}
      const timer=setTimeout(()=>reject(new Error('VIDEO METADATA FAILED')),15000);
      const ok=()=>{clearTimeout(timer);cleanup();resolve();};
      const bad=()=>{clearTimeout(timer);cleanup();reject(new Error('VIDEO METADATA FAILED'));};
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

    let performanceBuf, referenceBuf;
    try {
      performanceBuf = await fetch(PERFORMANCE_MIDI_PATH,{cache:'no-store'}).then(r=>{
        if(!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.arrayBuffer();
      });
    } catch (e) {
      throw new Error('HUMAN PERFORMANCE MIDI LOAD FAILED');
    }

    try {
      referenceBuf = await fetch(REFERENCE_MIDI_PATH,{cache:'no-store'}).then(r=>{
        if(!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.arrayBuffer();
      });
    } catch (e) {
      throw new Error('REFERENCE MIDI LOAD FAILED');
    }

    const performanceMidi=TigerMidi.parse(performanceBuf);
    const referenceMidi=TigerMidi.parse(referenceBuf);

    if(performanceMidi.division!==referenceMidi.division){
      throw new Error('NewHeart MIDI files use different tick divisions.');
    }

    const timeline=TigerMidi.makeTimeline(referenceMidi.division,referenceMidi.tempos);
    const rawMarkers=referenceMidi.markers
      .map(m=>({name:m.name,time:timeline.tickToSeconds(m.tick)}))
      .sort((a,b)=>a.time-b.time);

    const startMarker=rawMarkers.find(m=>String(m.name).trim().toLowerCase()==='start');
    const endMarker=rawMarkers.find(m=>String(m.name).trim().toLowerCase()==='end');
    if(!startMarker){
      throw new Error('REFERENCE MIDI MISSING START MARKER');
    }
    if(!endMarker){
      throw new Error('REFERENCE MIDI MISSING END MARKER');
    }

    try {
      await Promise.all([
        waitForVideoReady(),
        ...Object.entries(imageSources).map(([k,u])=>loadImage(k,u))
      ]);
    } catch (e) {
      throw new Error(e.message);
    }

    midiSyncStart=startMarker.time;
    midiSyncEnd=endMarker.time;
    videoSyncEnd=Number(video.duration);
    if(!Number.isFinite(videoSyncEnd)||videoSyncEnd<=0){
      throw new Error('VIDEO DURATION INVALID');
    }
    if(!(midiSyncEnd>midiSyncStart)){
      throw new Error('NewHeart MIDI Start/End markers are invalid.');
    }

    syncScale=videoSyncEnd/(midiSyncEnd-midiSyncStart);
    syncEndpointErrorSeconds=videoSyncEnd-(midiSyncEnd-midiSyncStart);

    // Verify unsupported pitch mapping
    for (const n of performanceMidi.notes) {
      if (PITCH_TO_LANE[n.note] === undefined) {
        throw new Error(`UNSUPPORTED MIDI PITCH ${n.note}`);
      }
    }

    notes=performanceMidi.notes
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
          variantIndex:(i * 7 + n.note) % PAW_VARIANTS.length,
          hit:false,missed:false
        };
      })
      .sort((a,b)=>a.hitTime-b.hitTime);

    markers=rawMarkers
      .map(m=>({name:m.name,rawMidiTime:m.time,time:mapMidiTimeToVideo(m.time)}))
      .sort((a,b)=>a.time-b.time);

    if(notes.length!==357){
      throw new Error(`EXPECTED 357 CUES, FOUND ${notes.length}`);
    }

    bootReady=true;
    launchBtn.disabled=false;
    sourceBadge.textContent='SYNC LOCKED';
    droneMessage.textContent='RAYEN // 09';
    loadStatus.textContent=`PAW ASSETS LOADED · 357 CUES · SYNC LOCKED · ${(syncScale*100).toFixed(6)}% FIT · Δ ${(syncEndpointErrorSeconds*1000).toFixed(3)} ms`;
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

  // Launch-only LED drone show.
  const droneDots=Array.from({length:176},(_,i)=>({
    seed:i*9.73,
    phase:(i/176)*Math.PI*2,
    band:i%6,
    twinkle:.55+((i*19)%37)/100
  }));
  function drawDrones(ms){
    const t=ms/1000;
    dctx.clearRect(0,0,W,H);
    if(!launchDeck.classList.contains('active')){
      requestAnimationFrame(drawDrones);
      return;
    }
    const cx=W*.73, cy=H*.35;
    const scale=Math.min(W,H)*.22;
    for(let i=0;i<droneDots.length;i++){
      const p=droneDots[i];
      let x,y;
      const mode=Math.floor(t/4)%4;
      if(mode===0){
        const a=p.phase; const rr=.44+.13*Math.sin(t*.85+p.band);
        x=cx+Math.cos(a)*scale*1.14*rr;
        y=cy+Math.sin(a)*scale*.54*rr;
        if(i%7===0){x=cx+Math.cos(a)*scale*.18;y=cy+Math.sin(a)*scale*.18;}
      }else if(mode===1){
        if(i<80){x=cx+((i/79)-.5)*scale*1.32;y=cy-scale*.43;} else{x=cx+Math.sin(p.seed)*4;y=cy-scale*.43+((i-80)/95)*scale*1.05;}
      }else if(mode===2){
        const frac=i/(droneDots.length-1);
        x=cx+(frac-.5)*scale*1.72;
        y=cy+Math.sin(frac*Math.PI*7-t*3.1)*scale*.22*(.35+.65*Math.sin(frac*Math.PI));
      }else{
        const row=Math.floor(i/16), col=i%16;
        x=cx-scale*.62+col*scale*.08;
        y=cy-scale*.44+row*scale*.11;
        if(row<2 || col===7 || col===8){}
        else {y+=9999;}
      }
      const glow=.42+.58*Math.sin(t*2.4+p.seed)*p.twinkle;
      dctx.beginPath();
      dctx.fillStyle=`rgba(255,${Math.round(105+80*glow)},${Math.round(10+22*glow)},${.48+.46*glow})`;
      dctx.shadowBlur=7+16*glow;dctx.shadowColor='#ff6200';
      dctx.arc(x,y,1.3+2.3*glow,0,Math.PI*2);dctx.fill();
    }
    dctx.shadowBlur=0;
    requestAnimationFrame(drawDrones);
  }

  function laneX(lane,p){
    const topW=W*.28,bottomW=W*.76;
    const width=topW+(bottomW-topW)*p;
    return W/2-width/2+width*(lane+.5)/4;
  }
  const receptorY=()=>H*.865;
  const topY=()=>H*.18;

  function getLaneGeom(lane){
    const tY=topY(), bY=receptorY();
    const topW=W*.28,bottomW=W*.76;
    return {
      topY:tY,
      bottomY:bY,
      topL:W/2-topW/2+topW*lane/4,
      topR:W/2-topW/2+topW*(lane+1)/4,
      botL:W/2-bottomW/2+bottomW*lane/4,
      botR:W/2-bottomW/2+bottomW*(lane+1)/4
    };
  }
  function lanePointAtProgress(g,p,side){
    return side==='L'?lerp(g.topL,g.botL,p):lerp(g.topR,g.botR,p);
  }

  function getShowIntensity(now){
    const progress = videoSyncEnd? clamp(now/videoSyncEnd,0,1):0;
    const comboBoost = clamp(combo/50,0,1)*0.2;
    const hypeBoost = clamp(hype/100,0,1)*0.18;
    const stripeBoost = stripeLevel*0.05;
    const ultraBoost = ultra ? 0.12 : 0;
    return clamp(0.18 + progress*0.45 + comboBoost + hypeBoost + stripeBoost + ultraBoost, 0, 1);
  }

  function updateShellIntensity(now){
    const intensity=getShowIntensity(now);
    shell.style.setProperty('--showIntensity', intensity.toFixed(3));
    shell.style.setProperty('--hypeLevel', (hype/100).toFixed(3));
    const visualLevel = intensity > .86 ? 4 : intensity > .66 ? 3 : intensity > .44 ? 2 : intensity > .24 ? 1 : 0;
    document.body.dataset.stripes=String(Math.max(stripeLevel, visualLevel));
    if(intensity>.72) document.body.classList.add('tigerParty'); else if(!ultra) document.body.classList.remove('tigerParty');
  }

  function drawLaneSurface(lane, now, intensity){
    const g=getLaneGeom(lane);
    const hueBias=[1,.88,1.08,1.2][lane];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(g.topL,g.topY);
    ctx.lineTo(g.topR,g.topY);
    ctx.lineTo(g.botR,g.bottomY+48);
    ctx.lineTo(g.botL,g.bottomY+48);
    ctx.closePath();
    ctx.clip();

    const grad=ctx.createLinearGradient(0,g.topY,0,g.bottomY+48);
    grad.addColorStop(0,`rgba(22,14,10,${0.60+.08*intensity})`);
    grad.addColorStop(.35,`rgba(12,10,9,${0.46+.07*intensity})`);
    grad.addColorStop(1,`rgba(8,7,7,${0.76+.12*intensity})`);
    ctx.fillStyle=grad;
    ctx.fillRect(g.botL-30,g.topY,g.botR-g.botL+60,g.bottomY-g.topY+72);

    if(imgs.lane_overlay){
      const offset=((now*42*(1+lane*.08))%220)-110;
      ctx.globalAlpha=.11+.09*intensity;
      ctx.drawImage(imgs.lane_overlay,g.botL-18,g.topY-70+offset,(g.botR-g.botL)+36,g.bottomY-g.topY+230);
      ctx.globalAlpha=.06+.04*intensity;
      ctx.drawImage(imgs.lane_overlay,g.botL-18,g.topY-240+offset,(g.botR-g.botL)+36,g.bottomY-g.topY+230);
      ctx.globalAlpha=1;
    }

    // marching field hashes / perspective guides
    for(let i=0;i<8;i++){
      const p=((i/8)+((now*0.16*(lane%2?1:-1))+1)%1)%1;
      const y=lerp(g.topY,g.bottomY+24,p);
      const l=lanePointAtProgress(g,p,'L');
      const r=lanePointAtProgress(g,p,'R');
      ctx.strokeStyle=`rgba(255,255,255,${0.05+0.08*(1-p)*intensity})`;
      ctx.lineWidth=1.6;
      ctx.beginPath();
      ctx.moveTo(l+10,y);
      ctx.lineTo(r-10,y);
      ctx.stroke();
    }

    // animated tiger stripe sweeps
    for(let j=0;j<3;j++){
      const phase=(now*.55 + j*.27 + lane*.09)%1;
      const base=phase*(g.bottomY-g.topY+180)-120;
      ctx.strokeStyle=`rgba(255,122,18,${0.09+.07*intensity})`;
      ctx.lineWidth=4+3*intensity;
      ctx.beginPath();
      ctx.moveTo(g.botL-30, g.topY+base);
      ctx.bezierCurveTo(g.botL+20, g.topY+base+50, g.botR-80, g.topY+base+90, g.botR+20, g.topY+base+140);
      ctx.stroke();
    }

    // edge glows
    const edgeGlow=.45+.4*intensity;
    ctx.strokeStyle=`rgba(255,120,14,${edgeGlow})`;
    ctx.lineWidth=3.2;
    ctx.shadowBlur=8+14*intensity;
    ctx.shadowColor='rgba(255,98,0,.85)';
    ctx.beginPath();ctx.moveTo(g.topL,g.topY);ctx.lineTo(g.botL,g.bottomY+48);ctx.stroke();
    ctx.beginPath();ctx.moveTo(g.topR,g.topY);ctx.lineTo(g.botR,g.bottomY+48);ctx.stroke();
    ctx.shadowBlur=0;

    // subtle lane identity accents
    const accentAlpha=.12+.18*intensity;
    ctx.strokeStyle=`rgba(255,255,255,${accentAlpha})`;
    if(lane===0 || lane===2){
      for(let i=0;i<5;i++){
        const p=(i/5 + now*.2)%1;
        const x=lanePointAtProgress(g,p, lane===0?'L':'R');
        const y=lerp(g.topY,g.bottomY,p);
        ctx.beginPath();ctx.moveTo(x-8,y);ctx.lineTo(x+8,y);ctx.stroke();
      }
    }else{
      for(let i=0;i<5;i++){
        const p=(i/5 + now*.18)%1;
        const x=lerp(g.topL+14,g.topR-14,.5);
        const y=lerp(g.topY,g.bottomY,p);
        ctx.beginPath();ctx.moveTo(x-12,y);ctx.lineTo(x+12,y);ctx.stroke();
      }
    }

    // extra razzle-dazzle: center sweep + directional chevrons
    const sweepP=(Math.sin(now*2.4 + lane)*0.5+0.5);
    const sweepY=lerp(g.topY+40, g.bottomY-40, sweepP);
    const sweepGrad=ctx.createLinearGradient(g.botL, sweepY, g.botR, sweepY);
    sweepGrad.addColorStop(0,'rgba(255,255,255,0)');
    sweepGrad.addColorStop(0.5,`rgba(255,255,255,${0.12 + 0.18*intensity})`);
    sweepGrad.addColorStop(1,'rgba(255,255,255,0)');
    ctx.strokeStyle=sweepGrad;
    ctx.lineWidth=6;
    ctx.beginPath(); ctx.moveTo(lerp(g.topL,g.botL,sweepP)+16,sweepY); ctx.lineTo(lerp(g.topR,g.botR,sweepP)-16,sweepY); ctx.stroke();
    ctx.fillStyle=`rgba(255,160,74,${0.16 + 0.22*intensity})`;
    ctx.font='900 16px Arial';
    for(let i=0;i<3;i++){
      const cp=(i/3 + now*0.12 + lane*0.08)%1;
      const cx=lerp(g.topL,g.botL,cp)*0.5 + lerp(g.topR,g.botR,cp)*0.5;
      const cy=lerp(g.topY,g.bottomY,cp);
      ctx.fillText(ARROW_LABELS[lane], cx-6, cy+5);
    }

    ctx.restore();

    // Lane labels near top
    ctx.save();
    ctx.fillStyle='rgba(255,255,255,.72)';
    ctx.font='900 10px Arial, sans-serif';
    ctx.textAlign='center';
    ctx.letterSpacing='1px';
    ctx.fillText(LANE_NAMES[lane], (g.topL+g.topR)/2, g.topY-10);
    ctx.restore();
  }

  function drawSideSpectacle(now,intensity){
    const flashBoost = now < sideFlashUntil ? 1 : 0;
    const ledCount = 24 + Math.floor(14*intensity);
    const margin = Math.max(24, W*.028);
    const w=28 + 18*intensity;
    const top=H*.16,bottom=H*.92;
    const leftX=margin, rightX=W-margin;
    const modes=Math.floor(now/4)%4;
    for(const dir of [-1,1]){
      const baseX = dir<0? leftX : rightX;
      for(let i=0;i<ledCount;i++){
        const p=i/(ledCount-1);
        let y=lerp(top,bottom,p);
        let x=baseX;
        let b=.18 + .45*Math.max(0,Math.sin(now*2.7 + i*.35 + (dir<0?0:1.7)));
        if(modes===0) x += dir*(Math.sin(now*3+p*8)*w*.18);
        if(modes===1) x += dir*(Math.sin(p*12+now*5)*w*.28*(.3+.8*intensity));
        if(modes===2) y += Math.sin(now*4+i*.3)*18*intensity;
        if(modes===3) x += dir*((i%2?1:-1)*w*.12*(.2+intensity));
        b = clamp(b + intensity*.34 + flashBoost*.32, 0, 1);
        ctx.beginPath();
        ctx.fillStyle=`rgba(255,${Math.round(110+110*b)},${Math.round(20+25*b)},${0.24+.65*b})`;
        ctx.shadowBlur=6+15*b; ctx.shadowColor='#ff6a00';
        ctx.arc(x,y,1.4+3.2*b,0,Math.PI*2); ctx.fill();
      }
      // side ribbon bars
      for(let k=0;k<7;k++){
        const p=((k/7)+now*.22)%1;
        const y=lerp(top,bottom,p);
        const len=12+26*intensity;
        ctx.fillStyle=`rgba(255,122,18,${0.08+.16*intensity})`;
        ctx.fillRect(baseX + (dir<0?0:-len), y-2, len, 4);
      }
    }
    ctx.shadowBlur=0;
  }


  function drawLedFormation(now,intensity){
    const tigerPatterns = [
      ['00111100','01111110','11100111','01111110','00111100','00111100','01111110','11111111'],
      ['11001100','11101110','01111110','00111100','00011000','00111100','01100110','11000011'],
      ['111000111','111101111','011111110','001111100','000111000'],
      ['011101110','100111001','101111001','101001111','011001001']
    ];
    const instrumentPatterns = [
      ['0011100','0111110','1111111','0011100','0011100','0111110','1100011'], // snare
      ['0011100','0111110','1100011','1111111','0111110','0011100','0011100'], // bass
      ['1100011','0110110','0011100','0011100','0110110','1100011','0000000'], // cymbals
      ['0110110','1111111','0110110','1111111','0110110','0011100','0011100']  // quads
    ];
    const tigerNames=['TIGER PAW','CLAW STRIKE','TIGER EYES','09 FORM'];
    const instrumentNames=['SNARE','BASS','CYMBALS','QUADS'];
    const tigerIndex=Math.floor(now/3.8)%tigerPatterns.length;
    const instrumentIndex=Math.floor((now+1.9)/2.7)%instrumentPatterns.length;
    const topCell=Math.max(7, Math.min(15, W*0.0105 + intensity*4));
    const tigerPat=tigerPatterns[tigerIndex];
    const tigerCols=tigerPat[0].length, tigerRows=tigerPat.length;
    const tigerX=W*0.5-(tigerCols*topCell)/2;
    const tigerY=H*0.095;

    ctx.save();
    // crisp scoreboard plate
    const plateW=tigerCols*topCell + 48;
    const plateH=tigerRows*topCell + 44;
    ctx.fillStyle=`rgba(7,7,7,${0.35 + 0.18*intensity})`;
    ctx.strokeStyle='rgba(255,145,44,0.55)';
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.roundRect(tigerX-24,tigerY-20,plateW,plateH,16);
    ctx.fill(); ctx.stroke();
    drawLedPattern(tigerX, tigerY, topCell, tigerPat, { onColor:'#ff8b24', offColor:'rgba(255,255,255,0.07)', glow:12+12*intensity, pulseBase:now*5 });
    ctx.fillStyle='rgba(255,255,255,0.96)';
    ctx.font='900 11px Arial';
    ctx.textAlign='center';
    ctx.fillText(tigerNames[tigerIndex], tigerX + (tigerCols*topCell)/2, tigerY + tigerRows*topCell + 18);

    // side synchronized band displays
    const instPat=instrumentPatterns[instrumentIndex];
    const instCols=instPat[0].length, instRows=instPat.length;
    const instCell=Math.max(6, Math.min(11, W*0.008 + intensity*3));
    const leftX=W*0.12, rightX=W*0.88 - instCols*instCell;
    const instY=H*0.29;
    for (const [x,label] of [[leftX,instrumentNames[instrumentIndex]],[rightX,instrumentNames[(instrumentIndex+1)%instrumentNames.length]]]) {
      ctx.fillStyle='rgba(8,8,8,0.28)';
      ctx.strokeStyle='rgba(255,255,255,0.15)';
      ctx.beginPath(); ctx.roundRect(x-16, instY-16, instCols*instCell+32, instRows*instCell+40, 14); ctx.fill(); ctx.stroke();
      const pattern = x===leftX ? instPat : instrumentPatterns[(instrumentIndex+1)%instrumentPatterns.length];
      drawLedPattern(x, instY, instCell, pattern, { onColor:'#ffffff', offColor:'rgba(255,255,255,0.05)', glow:8+8*intensity, pulseBase:now*4.2 });
      ctx.fillStyle='rgba(255,160,74,0.96)';
      ctx.font='900 10px Arial';
      ctx.textAlign='center';
      ctx.fillText(label, x + (instCols*instCell)/2, instY + instRows*instCell + 16);
    }
    ctx.restore();
  }

  function spawnConfettiBurst(count, centerX=W*0.5, centerY=H*0.12){
    for(let i=0;i<count;i++){
      confettiParticles.push({
        x:centerX + (Math.random()*140-70),
        y:centerY + (Math.random()*26-13),
        vx:(Math.random()*160-80),
        vy:(Math.random()*-120-30),
        size:4 + Math.random()*8,
        life:1.5 + Math.random()*1.4,
        born:performance.now()/1000,
        rot:Math.random()*Math.PI*2,
        spin:(Math.random()*6-3),
        color:confettiColors[(Math.random()*confettiColors.length)|0],
        type:(Math.random()*3)|0
      });
    }
  }

  function drawConfettiParticles(now){
    confettiParticles = confettiParticles.filter(p => now - p.born < p.life);
    for(const p of confettiParticles){
      const age=now-p.born;
      const t=age/p.life;
      const x=p.x + p.vx*age;
      const y=p.y + p.vy*age + 140*age*age;
      ctx.save();
      ctx.translate(x,y);
      ctx.rotate(p.rot + p.spin*age);
      ctx.globalAlpha=Math.max(0, 1-t);
      ctx.fillStyle=p.color;
      if(p.type===0){ ctx.fillRect(-p.size/2,-p.size/2,p.size,p.size); }
      else if(p.type===1){ ctx.fillRect(-p.size*0.25,-p.size,p.size*0.5,p.size*1.8); }
      else { ctx.beginPath(); ctx.moveTo(0,-p.size); ctx.lineTo(p.size*0.4,0); ctx.lineTo(0,p.size); ctx.lineTo(-p.size*0.4,0); ctx.closePath(); ctx.fill(); }
      ctx.restore();
    }
  }

  function drawConfettiHint(now,intensity){
    if(intensity<.75) return;
    for(let i=0;i<18;i++){
      const x = (Math.sin(i*12.1+now*2.1)*.5+.5)*W;
      const y = ((i*73 + now*160)%(H+120))-120;
      ctx.save();
      ctx.globalAlpha=.12+.12*intensity;
      ctx.fillStyle = i%3===0 ? '#fff' : i%3===1 ? '#ff7a12' : '#0e0e0e';
      ctx.translate(x,y);
      ctx.rotate((i+1)*now*.4);
      ctx.fillRect(-2,-6,4,12);
      ctx.restore();
    }
  }

  function nearestLaneCue(now,lane){
    let best=null, err=Infinity;
    for(const n of notes){
      if(n.hit||n.missed||n.lane!==lane) continue;
      const e=Math.abs(n.hitTime-now);
      if(e<err){err=e;best=n;}
      if(n.hitTime>now+.35) break;
    }
    return best ? {note:best, err} : null;
  }

  function pushImpact(lane, quality, now){
    impacts.push({lane, quality, time:now});
  }

  function drawImpacts(now){
    impacts = impacts.filter(hit => now - hit.time < 0.7);
    const musicGlyphs=['♪','♫','♬'];
    for(const hit of impacts){
      const age=now-hit.time;
      const t=clamp(age/.7,0,1);
      const lane=hit.lane;
      const x=laneX(lane,1), y=receptorY();
      const power= hit.quality==='PERFECT' ? 1 : hit.quality==='GREAT' ? .78 : hit.quality==='GOOD' ? .6 : .38;
      const ring=40+easeOut(t)*64*power;
      ctx.save();
      ctx.globalAlpha=(1-t)*(hit.quality==='MISS'?.25:.72);
      ctx.strokeStyle=hit.quality==='MISS' ? 'rgba(255,120,80,.5)' : 'rgba(255,255,255,.95)';
      ctx.lineWidth=5*(1-t) + 1;
      ctx.shadowBlur=22; ctx.shadowColor='#ff7a12';
      ctx.beginPath();ctx.arc(x,y,ring,0,Math.PI*2);ctx.stroke();
      if(hit.quality!=='MISS'){
        for(let i=0;i<8;i++){
          const a=(i/8)*Math.PI*2 + age*4;
          const dist=18 + ring*.52 + age*20;
          const px=x+Math.cos(a)*dist;
          const py=y+Math.sin(a)*dist - age*24;
          ctx.fillStyle=i%3===0 ? '#111111' : (i%2===0 ? '#ff7a12' : '#ffffff');
          ctx.font=`900 ${14 + (1-t)*8}px Arial`;
          ctx.fillText(musicGlyphs[i%musicGlyphs.length], px, py);
        }
      }
      ctx.restore();
    }
  }

  function drawNotes(rawNow,renderTime,intensity){
    const tY=topY(), bY=receptorY();
    for(const n of notes){
      if(n.hit||n.missed) continue;
      const dtRaw=n.hitTime-rawNow;
      if(dtRaw<-0.22){
        n.missed=true;
        combo=0;
        hype=Math.max(0,hype-8);
        judge('MISS');
        lastJudgementDelta = Math.round(dtRaw * 1000);
        updateHud();
        pushImpact(n.lane,'MISS',rawNow);
        continue;
      }
      const dt=n.hitTime-renderTime;
      if(dt>APPROACH || dt<-0.22) continue;
      const p=clamp(1-dt/APPROACH,0,1);
      const x=laneX(n.lane,p), y=tY+(bY-tY)*p;
      const s=(.42 + .88*p)*(1+.02*Math.sin(renderTime*8+n.id));
      const glow=.18+.6*p+.25*intensity;
      const rot=Math.sin(renderTime*2.5+n.id*.7)*(.03+.03*p);
      // tail / trail
      ctx.save();
      ctx.translate(x,y);
      ctx.rotate(rot);
      const trailGlyphs=['♪','♫'];
      for(let t=1;t<=3;t++){
        const back=t*.12;
        const tailP=clamp(p-back,0,1);
        const ty=tY+(bY-tY)*tailP;
        const alpha=(.18-back)*(.32+.42*intensity);
        ctx.save();
        ctx.translate(0,(ty-y));
        ctx.scale(1-back*.5,1-back*.5);
        ctx.globalAlpha=alpha;
        ctx.fillStyle=t%2===0 ? 'rgba(0,0,0,.55)' : 'rgba(255,122,18,.55)';
        ctx.font=`900 ${18*s}px Arial`;
        ctx.fillText(trailGlyphs[t%trailGlyphs.length], -8*s, 8*s);
        ctx.restore();
      }
      ctx.globalAlpha=.98;
      ctx.shadowBlur=16+20*glow;
      ctx.shadowColor='rgba(255,106,0,.85)';
      ctx.fillStyle='rgba(255,122,18,.18)';
      ctx.beginPath();ctx.arc(0,0,34*s,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;
      const icon=imgs[noteAssetKey(n)];
      if(icon) ctx.drawImage(icon,-40*s,-40*s,80*s,80*s);
      else {
        ctx.fillStyle='#fff';ctx.font=`900 ${24*s}px Arial, sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(ARROW_LABELS[n.lane],0,0);
      }
      ctx.restore();
    }
  }

  function drawReceptors(now,intensity){
    const y=receptorY();
    for(let lane=0; lane<4; lane++){
      const x=laneX(lane,1);
      const pending=nearestLaneCue(now,lane);
      const near = pending ? clamp(1 - pending.err/.22, 0, 1) : 0;
      const pulse = .98 + .06*Math.sin(now*5 + lane*1.4) + near*.1;
      const size = 118 + 14*intensity + 16*near;
      // charging ring
      ctx.save();
      ctx.translate(x,y);
      ctx.globalAlpha=.24 + .4*near + .16*intensity;
      ctx.strokeStyle='rgba(255,138,32,.86)';
      ctx.lineWidth=4;
      ctx.shadowBlur=12 + 20*near;
      ctx.shadowColor=near>.3 ? '#fff' : '#ff7a12';
      ctx.beginPath();ctx.arc(0,0,42 + 10*near + 6*Math.sin(now*4+lane),0,Math.PI*2);ctx.stroke();
      ctx.shadowBlur=0;
      const receptor=imgs[RECEPTOR_ASSETS[lane]];
      if(receptor) ctx.drawImage(receptor,-size*.5*pulse,-size*.5*pulse,size*pulse,size*pulse);
      else {ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,0,34,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='rgba(255,255,255,.95)';
      ctx.font='900 17px Arial, sans-serif';
      ctx.textAlign='center';
      ctx.fillText(LANE_KEYS[lane],0,66);
      ctx.restore();
    }
  }

  function drawHighway(rawNow,renderTime){
    const intensity=getShowIntensity(rawNow);
    updateShellIntensity(rawNow);
    ctx.clearRect(0,0,W,H);

    // a gentle veil so the video is still visible
    const mainGrad=ctx.createLinearGradient(0,0,0,H);
    mainGrad.addColorStop(0,'rgba(0,0,0,.18)');
    mainGrad.addColorStop(.5,`rgba(0,0,0,${.14+.12*intensity})`);
    mainGrad.addColorStop(1,'rgba(0,0,0,.28)');
    ctx.fillStyle=mainGrad;
    ctx.fillRect(0,0,W,H);

    drawSideSpectacle(renderTime,intensity);
    drawLedFormation(renderTime,intensity);
    for(let lane=0; lane<4; lane++) drawLaneSurface(lane,renderTime,intensity);
    drawNotes(rawNow,renderTime,intensity);
    drawReceptors(rawNow,intensity);
    drawImpacts(renderTime);
    drawConfettiParticles(performance.now()/1000);
    drawConfettiHint(renderTime,intensity);
  }

  function judge(text){
    judgeEl.textContent=text;
    judgeEl.classList.remove('pop');
    void judgeEl.offsetWidth;
    judgeEl.classList.add('pop');
  }

  function updateHud(){
    scoreEl.textContent=String(score).padStart(7,'0');
    comboEl.textContent=combo;
    hypeFill.style.width=hype+'%';
  }

  function celebrateComboMilestone(){
    const milestone = combo>=50 ? 50 : combo>=40 ? 40 : combo>=30 ? 30 : combo>=20 ? 20 : combo>=10 ? 10 : combo>=5 ? 5 : 0;
    if(!milestone || milestone===lastShowMilestone) return;
    lastShowMilestone=milestone;
    if(milestone>=10) flashSides(700 + milestone*4);
    if(milestone>=20) confetti(22 + milestone/2);
    if(milestone>=30){
      markerLabel.textContent=`${milestone} COMBO`; markerLabel.classList.remove('show'); void markerLabel.offsetWidth; markerLabel.classList.add('show');
    }
    if(milestone>=40){ultra=true; setTimeout(()=>{ultra=false;}, 1800);}
  }

  function hitLane(lane){
    if(!running||paused) return;
    const now=video.currentTime||0;
    let best=null,err=Infinity;
    for(const n of notes){
      if(n.hit||n.missed||n.lane!==lane) continue;
      const e=Math.abs(n.hitTime-now);if(e<err){err=e;best=n;}
      if(n.hitTime>now+0.22) break;
    }
    lastJudgementDelta = best ? Math.round((now - best.hitTime) * 1000) : 0;
    lastJudgeMs = lastJudgementDelta;
    if(!best || err>0.22){
      combo=0; hype=Math.max(0,hype-10); judge('MISS'); updateHud(); pushImpact(lane,'MISS',now); return;
    }
    best.hit=true;
    combo++;
    let result='GOOD';
    if(err<=0.065){ score+=1000; result='PERFECT'; }
    else if(err<=0.120){ score+=700; result='GREAT'; }
    else { score+=400; result='GOOD'; }
    score += combo*8;
    hype = clamp(hype + (result==='PERFECT'?2.5:result==='GREAT'?1.8:1.1), 0, 100);
    judge(result);
    updateHud();
    pushImpact(lane,result,now);
    celebrateComboMilestone();
  }

  function markerEvent(name){
    markerLabel.textContent=name.toUpperCase();
    markerLabel.classList.remove('show');
    void markerLabel.offsetWidth;
    markerLabel.classList.add('show');
    if(/Stripe/i.test(name)&&!/Hold/i.test(name)){
      stripeLevel=Math.min(4,stripeLevel+1);
      flashSides(650);
      confetti(18 + stripeLevel*6);
    }
    if(name==='Unlock Ultra Tiger Power Up'){ultra=true;flashSides(1200);confetti(50);setTimeout(()=>{ultra=false;},2000);}
    if(name==='FireWorks')confetti(52);
    if(name==='Tiger Party')document.body.classList.add('tigerParty');
    if(name==='Pre-Tiger Call')document.body.classList.add('preCall');
    if(name==='Full Band2'){document.body.classList.remove('preCall');flashSides(800);confetti(36);}
  }

  function flashSides(duration=550){
    sideFlashUntil=(video.currentTime||0)+(duration/1000);
    sideLeft.classList.add('flash');
    sideRight.classList.add('flash');
    setTimeout(()=>{sideLeft.classList.remove('flash');sideRight.classList.remove('flash');},duration);
  }

  function confetti(count){
    const waves = [0, 170, 380, 680];
    waves.forEach((delay, idx) => {
      setTimeout(() => {
        const xChoices=[W*0.18, W*0.36, W*0.64, W*0.82];
        const x=xChoices[idx % xChoices.length] + (Math.random()*60-30);
        const y=H*(0.08 + idx*0.015) + Math.random()*22;
        spawnConfettiBurst(Math.round(count*(0.55 + Math.random()*0.35)), x, y);
      }, delay);
    });
  }

  function resetGameState(){
    score=0;combo=0;hype=0;nextMarker=0;stripeLevel=0;ultra=false;paused=false;impacts=[];lastJudgeMs=0;lastShowMilestone=-1;sideFlashUntil=0;
    notes.forEach(n=>{n.hit=false;n.missed=false;});
    document.body.dataset.stripes='0';
    document.body.classList.remove('ultra','tigerParty','preCall');
    confettiLayer.innerHTML='';
    confettiParticles=[];
    autoHypeBurstAt=0;
    updateHud(); judgeEl.textContent='READY';
    lastJudgementDelta = 0;
  }

  function gameLoop(){
    if(!running) return;
    const now=video.currentTime||0;
    while(nextMarker<markers.length && markers[nextMarker].time<=now+.01){ markerEvent(markers[nextMarker].name); nextMarker++; }
    
    const renderTime = getInterpolatedTime();
    const perfNow = performance.now()/1000;
    const intensity = getShowIntensity(now);
    if(intensity > 0.54 && perfNow - autoHypeBurstAt > 2.35){
      const burst=12 + Math.floor(intensity*20);
      spawnConfettiBurst(burst, W*(0.2 + Math.random()*0.6), H*(0.08 + Math.random()*0.08));
      if (intensity > 0.72) spawnConfettiBurst(Math.round(burst*0.8), Math.random() < 0.5 ? W*0.14 : W*0.86, H*0.10 + Math.random()*30);
      autoHypeBurstAt = perfNow;
      flashSides(420);
    }
    drawHighway(now, renderTime);
    updateDebugOverlay();
    
    if(video.ended){ finish(); return; }
    requestAnimationFrame(gameLoop);
  }

  function showCountdown(text){
    launchCountdown.textContent=text;
    launchCountdown.classList.remove('show');
    void launchCountdown.offsetWidth;
    launchCountdown.classList.add('show');
  }

  function freshLaunch(){
    if(!bootReady||launchInProgress) return;
    launchInProgress=true;
    launchBtn.disabled=true;
    launchError.classList.remove('show');
    resetGameState();

    video.pause();
    try{ video.currentTime=0; }catch(_e){}
    video.muted=false;
    video.volume=1;
    video.loop=false;

    sourceBadge.textContent='CALLING FORMATION';
    droneMessage.textContent='GO TIGERS';
    showCountdown('T');

    const playPromise=video.play();
    Promise.resolve(playPromise).then(()=>{
      shell.classList.add('launching');
      setTimeout(()=>showCountdown('09'),210);
      
      // Start the gameplay engine immediately
      resize(); // initialize lane rendering
      running=true;
      paused=false;
      shell.setAttribute('tabindex','-1');
      shell.focus();
      requestAnimationFrame(gameLoop);

      launchDeck.classList.add('depart');
      
      setTimeout(()=>{
        launchDeck.classList.remove('active','depart');
        document.body.classList.remove('launchMode');
        shell.classList.remove('launching');
        launchInProgress=false;
      },860);
    }).catch(err=>{
      console.error('Performance video/audio start failure:',err);
      launchInProgress=false;
      launchBtn.disabled=false;
      sourceBadge.textContent='VIDEO PLAYBACK BLOCKED';
      droneMessage.textContent='TAP START AGAIN';
      launchError.textContent='VIDEO PLAYBACK BLOCKED';
      launchError.classList.add('show');
    });
  }

  function finish(){
    running=false;
    video.pause();
    confetti(90);
    $('resultScore').textContent=score.toLocaleString();
    $('resultScreen').classList.add('active');
  }

  function togglePause(){
    if(!running) return;
    paused=!paused;
    if(paused){
      video.pause();
      $('pauseScreen').classList.add('active');
    }else{
      video.play().then(()=>{
        $('pauseScreen').classList.remove('active');
        requestAnimationFrame(gameLoop);
      }).catch(()=>{ paused=true; });
    }
  }

  function replay(){
    $('resultScreen').classList.remove('active');
    resetGameState();
    video.pause();
    try{ video.currentTime=0; }catch(_e){}
    video.muted=false;
    video.volume=1;
    const p=video.play();
    Promise.resolve(p).then(()=>{ running=true; paused=false; requestAnimationFrame(gameLoop); }).catch(()=>{
      running=false; launchDeck.classList.add('active'); document.body.classList.add('launchMode'); launchBtn.disabled=false;
    });
  }

  launchBtn.addEventListener('click',freshLaunch);
  $('pauseBtn').addEventListener('click',togglePause);
  $('resumeBtn').addEventListener('click',togglePause);
  $('replayBtn').addEventListener('click',replay);
  const keyHandler = e => {
    const lane = resolveLaneFromEvent(e);
    if(lane===undefined) return;
    e.preventDefault();
    hitLane(lane);
  };
  window.addEventListener('keydown', keyHandler, true);
  document.addEventListener('keydown', keyHandler, true);
  shell.addEventListener('pointerdown', e => {
    if(!running || paused) return;
    const rect=shell.getBoundingClientRect();
    const x=e.clientX-rect.left, y=e.clientY-rect.top;
    if(y < rect.height*0.62) return;
    const lane=Math.max(0, Math.min(3, Math.floor((x/rect.width)*4)));
    hitLane(lane);
  });
  window.addEventListener('resize',resize);

  resize();
  requestAnimationFrame(drawDrones);
  prepareFreshLaunch().catch(err=>{
    console.error(err); sourceBadge.textContent='LOAD ERROR'; droneMessage.textContent='CHECK FILES'; loadStatus.textContent=err.message; launchError.textContent=err.message; launchError.classList.add('show');
  });
})();
