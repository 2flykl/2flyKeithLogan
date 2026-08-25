(() => {
  'use strict';

  const PERFORMANCE_MIDI_PATH = 'assets/midi/TigerCall_NewHeart_HumanPerformance.mid';
  const REFERENCE_MIDI_PATH = 'assets/midi/TigerCall_NewHeart_Reference.mid';
  const PITCH_TO_LANE = {72:0,74:1,76:2,73:3};
  const KEY_TO_LANE = {KeyI:0,KeyO:1,KeyP:2,Digit9:3,Numpad9:3};
  // HARD LOCKED visual/input order: LEFT, DOWN, RIGHT, UP
  const LANE_KEYS = ['I','O','P','9'];
  const LANE_NAMES = ['LEFT // SNARE','DOWN // BASS','RIGHT // CYMBAL','UP // QUADS'];
  const ARROW_LABELS = ['←','↓','→','↑'];
  const NOTE_ASSETS = [
    'note_left','note_down','note_right','note_up'
  ];
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
  let musicParticles=[];
  let confettiParticles=[];
  let lastJudgeMs=0;
  let lastShowMilestone=-1;
  let sideFlashUntil=0;
  let lastParticleFrame=0;

  const imgs={};
  const imageSources={
    note_left:'assets/generated/notes/paw_note_left.svg',
    note_down:'assets/generated/notes/paw_note_down.svg',
    note_right:'assets/generated/notes/paw_note_right.svg',
    note_up:'assets/generated/notes/paw_note_up.svg',
    receptor_left:'assets/generated/receptors_dominant/receptor_left.svg',
    receptor_down:'assets/generated/receptors_dominant/receptor_down.svg',
    receptor_right:'assets/generated/receptors_dominant/receptor_right.svg',
    receptor_up:'assets/generated/receptors_dominant/receptor_up.svg',
    lane_overlay:'assets/generated/lanes/lane_overlay.svg'
  };
  const confettiShapes=[
    'assets/generated/confetti/square.svg',
    'assets/generated/confetti/strip.svg',
    'assets/generated/confetti/streamer.svg'
  ];
  const confettiColors=['#ff7a12','#ffffff','#111111'];

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
    const ledCount = 28 + Math.floor(30*intensity);
    const margin = Math.max(22, W*.026);
    const top=H*.13,bottom=H*.93;
    const leftX=margin, rightX=W-margin;
    const mode=Math.floor(now/5)%5;

    for(const dir of [-1,1]){
      const baseX=dir<0?leftX:rightX;
      for(let i=0;i<ledCount;i++){
        const p=i/(ledCount-1);
        let y=lerp(top,bottom,p);
        let x=baseX;
        const wave=Math.sin(now*3.2+i*.43+(dir<0?0:1.8));
        x+=dir*wave*(7+16*intensity);
        if(mode===1)y+=Math.sin(p*18-now*4)*18*intensity;
        if(mode===2)x+=dir*((i%3)-1)*9*intensity;
        const b=clamp(.18+.42*Math.max(0,wave)+intensity*.38+flashBoost*.35,0,1);
        ctx.beginPath();
        ctx.fillStyle=`rgba(255,${Math.round(105+120*b)},${Math.round(10+25*b)},${.28+.66*b})`;
        ctx.shadowBlur=7+18*b;ctx.shadowColor='#ff6a00';
        ctx.arc(x,y,1.5+3.2*b,0,Math.PI*2);ctx.fill();
      }
    }
    ctx.shadowBlur=0;

    // Stadium/drone formations that become visible as intensity rises.
    if(intensity>.34){
      const formAlpha=clamp((intensity-.34)/.66,0,1)*.72;
      const cy=H*.46, spread=Math.min(110,W*.09);
      const centers=[Math.max(78,W*.075),W-Math.max(78,W*.075)];
      centers.forEach((cx,side)=>{
        ctx.save();ctx.globalAlpha=formAlpha;ctx.shadowBlur=12;ctx.shadowColor='#ff7410';
        const fmode=Math.floor(now/4.2)%4;
        if(fmode===0){ // tiger eye
          for(let i=0;i<30;i++){
            const a=i/30*Math.PI*2;
            const x=cx+Math.cos(a)*spread*.55;
            const y=cy+Math.sin(a)*spread*.22;
            ctx.fillStyle=i%3===0?'#fff':'#ff7410';ctx.beginPath();ctx.arc(x,y,2.2,0,Math.PI*2);ctx.fill();
          }
          ctx.fillStyle='#ff7410';ctx.beginPath();ctx.arc(cx,cy,6,0,Math.PI*2);ctx.fill();
        }else if(fmode===1){ // claw marks
          ctx.strokeStyle='#ff7410';ctx.lineWidth=4;
          for(let c=-1;c<=1;c++){
            ctx.beginPath();ctx.moveTo(cx-30+c*18,cy-58);ctx.quadraticCurveTo(cx-10+c*18,cy,cx+4+c*18,cy+60);ctx.stroke();
          }
        }else if(fmode===2){ // 09
          ctx.font=`1000 ${Math.round(spread*.7)}px Arial`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=side===0?'#ff7410':'#fff';ctx.fillText('09',cx,cy);
        }else{ // paw constellation
          const pts=[[0,22],[-25,-10],[-9,-28],[10,-28],[26,-10]];
          for(const [px,py] of pts){ctx.fillStyle='#ff7410';ctx.beginPath();ctx.arc(cx+px,cy+py,px===0?13:8,0,Math.PI*2);ctx.fill();}
        }
        ctx.restore();
      });
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
    if(quality!=='MISS') spawnMusicNotes(lane,quality,now);
  }

  function spawnMusicNotes(lane,quality,now){
    const x=laneX(lane,1), y=receptorY()-12;
    const amount=quality==='PERFECT'?18:quality==='GREAT'?13:9;
    const glyphs=['♪','♫','♬','♩'];
    for(let i=0;i<amount;i++){
      const angle=(-Math.PI*.82)+(Math.random()*Math.PI*.64);
      const speed=55+Math.random()*105;
      musicParticles.push({
        x:x+(Math.random()-.5)*20,
        y:y+(Math.random()-.5)*8,
        vx:Math.cos(angle)*speed*(Math.random()<.5?1:-1),
        vy:-Math.abs(Math.sin(angle)*speed)-38-Math.random()*30,
        age:0,
        life:.55+Math.random()*.55,
        size:12+Math.random()*13,
        rot:(Math.random()-.5)*.5,
        vr:(Math.random()-.5)*3,
        glyph:glyphs[(Math.random()*glyphs.length)|0],
        color:Math.random()<.54?'#ff7410':Math.random()<.72?'#111111':'#ffffff'
      });
    }
  }

  function drawMusicParticles(dt){
    musicParticles=musicParticles.filter(p=>p.age<p.life);
    for(const p of musicParticles){
      p.age+=dt;
      p.vy+=70*dt;
      p.x+=p.vx*dt;
      p.y+=p.vy*dt;
      p.rot+=p.vr*dt;
      const q=clamp(1-p.age/p.life,0,1);
      ctx.save();
      ctx.translate(p.x,p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha=q;
      ctx.font=`900 ${p.size}px Arial, "Segoe UI Symbol", sans-serif`;
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.lineWidth=3;ctx.strokeStyle='rgba(255,255,255,.35)';
      ctx.strokeText(p.glyph,0,0);
      ctx.fillStyle=p.color;ctx.shadowBlur=8;ctx.shadowColor='#ff7410';
      ctx.fillText(p.glyph,0,0);
      ctx.restore();
    }
  }

  function drawImpacts(now){
    impacts = impacts.filter(hit => now - hit.time < 0.48);
    for(const hit of impacts){
      const age=now-hit.time;
      const t=clamp(age/.48,0,1);
      const lane=hit.lane;
      const x=laneX(lane,1), y=receptorY();
      const power= hit.quality==='PERFECT' ? 1 : hit.quality==='GREAT' ? .72 : hit.quality==='GOOD' ? .52 : .3;
      if(hit.quality==='MISS'){
        ctx.save();ctx.globalAlpha=(1-t)*.25;ctx.strokeStyle='#ff5f34';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,42+18*t,0,Math.PI*2);ctx.stroke();ctx.restore();
        continue;
      }
      // aggressive claw flash rather than cute circular dissolve
      ctx.save();
      ctx.globalAlpha=(1-t)*(.48+.28*power);
      ctx.strokeStyle=t<.3?'#ffffff':'#ff7410';
      ctx.lineWidth=6-4*t;
      ctx.shadowBlur=18;ctx.shadowColor='#ff7410';
      for(let c=-1;c<=1;c++){
        ctx.beginPath();
        ctx.moveTo(x-28+c*15,y-44-easeOut(t)*18);
        ctx.lineTo(x-8+c*15,y+18+easeOut(t)*36);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  function drawNotes(rawNow,renderTime,intensity){
    const tY=topY(), bY=receptorY();
    for(const n of notes){
      if(n.hit||n.missed) continue;
      const dtRaw=n.hitTime-rawNow;
      if(dtRaw<-0.190){
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
      if(dt>APPROACH || dt<-0.190) continue;
      const p=clamp(1-dt/APPROACH,0,1);
      const x=laneX(n.lane,p), y=tY+(bY-tY)*p;
      const s=(.42 + .88*p)*(1+.02*Math.sin(renderTime*8+n.id));
      const glow=.18+.6*p+.25*intensity;
      const rot=Math.sin(renderTime*2.5+n.id*.7)*(.03+.03*p);
      // tail / trail
      ctx.save();
      ctx.translate(x,y);
      ctx.rotate(rot);
      for(let t=1;t<=3;t++){
        const back=t*.12;
        const tailP=clamp(p-back,0,1);
        const ty=tY+(bY-tY)*tailP;
        const alpha=(.18-back)*(.3+.4*intensity);
        ctx.save();
        ctx.translate(0,(ty-y));
        ctx.scale(1-back*.5,1-back*.5);
        ctx.globalAlpha=alpha;
        ctx.fillStyle='rgba(255,122,18,.35)';
        ctx.beginPath();ctx.arc(0,0,26*s,0,Math.PI*2);ctx.fill();
        ctx.restore();
      }
      ctx.globalAlpha=.98;
      ctx.shadowBlur=16+20*glow;
      ctx.shadowColor='rgba(255,106,0,.85)';
      ctx.fillStyle='rgba(255,122,18,.18)';
      ctx.beginPath();ctx.arc(0,0,34*s,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;
      const icon=imgs[NOTE_ASSETS[n.lane]];
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
    for(let lane=0; lane<4; lane++) drawLaneSurface(lane,renderTime,intensity);
    drawNotes(rawNow,renderTime,intensity);
    drawReceptors(rawNow,intensity);
    drawImpacts(rawNow);
    const particleDt=clamp(renderTime-lastParticleFrame,0,0.04)||1/60;
    lastParticleFrame=renderTime;
    drawMusicParticles(particleDt);
    drawConfettiParticles(particleDt);
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
    if(milestone>=20) confetti(16 + milestone/2);
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
      if(n.hitTime>now+0.220) break;
    }
    lastJudgementDelta = best ? Math.round((now - best.hitTime) * 1000) : 0;
    lastJudgeMs = lastJudgementDelta;
    if(!best || err>0.220){
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
    }
    if(name==='Unlock Ultra Tiger Power Up'){ultra=true;flashSides(1200);confetti(50);setTimeout(()=>{ultra=false;},2000);}
    if(name==='FireWorks')confetti(34);
    if(name==='Tiger Party')document.body.classList.add('tigerParty');
    if(name==='Pre-Tiger Call')document.body.classList.add('preCall');
    if(name==='Full Band2'){document.body.classList.remove('preCall');flashSides(800);}
  }

  function flashSides(duration=550){
    sideFlashUntil=(video.currentTime||0)+(duration/1000);
    sideLeft.classList.add('flash');
    sideRight.classList.add('flash');
    setTimeout(()=>{sideLeft.classList.remove('flash');sideRight.classList.remove('flash');},duration);
  }

  function confetti(count){
    const colors=['#ff7410','#ffffff','#101010'];
    for(let i=0;i<count;i++){
      const sideBias=Math.random()<.72;
      const x=sideBias?(Math.random()<.5?Math.random()*W*.24:W*(.76+Math.random()*.24)):Math.random()*W;
      confettiParticles.push({
        x,y:-20-Math.random()*H*.18,
        vx:(Math.random()-.5)*70,
        vy:90+Math.random()*150,
        age:0,
        life:2.4+Math.random()*1.8,
        rot:Math.random()*Math.PI*2,
        vr:(Math.random()-.5)*7,
        w:5+Math.random()*8,
        h:9+Math.random()*16,
        color:colors[(Math.random()*colors.length)|0]
      });
    }
  }

  function drawConfettiParticles(dt){
    confettiParticles=confettiParticles.filter(p=>p.age<p.life && p.y<H+60);
    for(const p of confettiParticles){
      p.age+=dt;p.vy+=34*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.rot+=p.vr*dt;
      const q=clamp(1-p.age/p.life,0,1);
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.globalAlpha=Math.min(1,q*1.5);ctx.fillStyle=p.color;
      ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore();
    }
  }

  function resetGameState(){
    score=0;combo=0;hype=0;nextMarker=0;stripeLevel=0;ultra=false;paused=false;impacts=[];musicParticles=[];confettiParticles=[];lastJudgeMs=0;lastShowMilestone=-1;sideFlashUntil=0;lastParticleFrame=0;
    notes.forEach(n=>{n.hit=false;n.missed=false;});
    document.body.dataset.stripes='0';
    document.body.classList.remove('ultra','tigerParty','preCall');
    confettiLayer.innerHTML='';
    updateHud(); judgeEl.textContent='READY';
    lastJudgementDelta = 0;
  }

  function gameLoop(){
    if(!running) return;
    const now=video.currentTime||0;
    while(nextMarker<markers.length && markers[nextMarker].time<=now+.01){ markerEvent(markers[nextMarker].name); nextMarker++; }
    
    const renderTime = getInterpolatedTime();
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
  const KEY_NAME_TO_LANE={i:0,o:1,p:2,'9':3};
  window.addEventListener('keydown',e=>{
    const lane=KEY_TO_LANE[e.code]!==undefined?KEY_TO_LANE[e.code]:KEY_NAME_TO_LANE[String(e.key||'').toLowerCase()];
    if(lane!==undefined){e.preventDefault();e.stopPropagation();hitLane(lane);}
  },true);
  canvas.addEventListener('pointerdown',e=>{
    if(!running||paused)return;
    const r=canvas.getBoundingClientRect();
    const x=e.clientX-r.left, y=e.clientY-r.top;
    if(y<r.height*.60)return;
    let bestLane=0,bestDist=Infinity;
    for(let lane=0;lane<4;lane++){
      const lx=laneX(lane,1);const d=Math.abs(x-lx);
      if(d<bestDist){bestDist=d;bestLane=lane;}
    }
    hitLane(bestLane);
  },{passive:true});
  window.addEventListener('resize',resize);

  resize();
  requestAnimationFrame(drawDrones);
  prepareFreshLaunch().catch(err=>{
    console.error(err); sourceBadge.textContent='LOAD ERROR'; droneMessage.textContent='CHECK FILES'; loadStatus.textContent=err.message; launchError.textContent=err.message; launchError.classList.add('show');
  });
})();
