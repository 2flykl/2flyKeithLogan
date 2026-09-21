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
  const PAW_VARIANTS = ['rebuilt'];
  const RECEPTOR_ASSETS = [
    'receptor_left_v7','receptor_down_v7','receptor_right_v7','receptor_up_v7'
  ];
  let APPROACH = 1.8;
  let inputOffset=0,visualOffset=0,windows=[.09,.165,.28],mode='classic';
  let judgementCounts={PERFECT:0,GREAT:0,GOOD:0,MISS:0},timingErrors=[],emptyPresses=0;
  let acceptInputAfter=0,lastFrameMs=0,showFormation=0;
  const EXPIRY_GRACE=.20; // Let queued timestamped input arrive before finalizing misses.
  function eventMediaTime(event){
    const stamp=Number(event?.timeStamp);
    const age=Number.isFinite(stamp)&&stamp>0 ? Math.max(0,(performance.now()-stamp)/1000) : 0;
    return video.currentTime-Math.min(EXPIRY_GRACE,age)*video.playbackRate-inputOffset;
  }
  function readSettings(){
    mode=$('timingMode').value;windows=mode==='precision'?[.045,.09,.14]:[.09,.165,.28];
    APPROACH=Number($('scrollSpeed').value);
    inputOffset=clamp(Number($('inputOffset').value)||0,-200,200)/1000;
    visualOffset=clamp(Number($('visualOffset').value)||0,-200,200)/1000;
    try{localStorage.setItem('tigerTimingSettings',JSON.stringify({mode,approach:APPROACH,input:inputOffset*1000,visual:visualOffset*1000}));}catch{}
  }
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
  let currentRenderTime = 0;

  function getInterpolatedTime() {
    // Media remains the authority; never invent progress while buffering.
    return Math.max(0,(video.currentTime||0)+visualOffset);
  }

  // Debug overlay variables
  let lastJudgementDelta = 0;
  let debugOverlayEl = null;
  const DEBUG_ENABLED = false;

  function ensureDebugOverlay() { return; }

  function updateDebugOverlay() { return; }

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

  function findBestLaneMatch(now,lane){
    // Consume eligible notes in chart order instead of stealing a later note.
    for(const n of notes){
      if(n.hit||n.missed||n.lane!==lane)continue;
      if(n.hitTime>now+windows[2])break;
      const err=Math.abs(n.hitTime-now);
      if(err<=windows[2])return {best:n,err};
    }
    return {best:null,err:Infinity};
  }

  const dotPatternCache=new Map();
  function drawLedPattern(px,py,cell,pattern,options={}){
    const color=options.onColor||'#ff7900',accent=options.accentColor||'#fff';
    const key=pattern.join('/')+color+accent;
    let art=dotPatternCache.get(key);
    if(!art){
      art=document.createElement('canvas');art.width=Math.max(...pattern.map(r=>r.length))*12+12;art.height=pattern.length*12+12;
      const c=art.getContext('2d');
      pattern.forEach((row,r)=>Array.from(row).forEach((state,col)=>{if(state==='0')return;c.fillStyle=state==='1'?color:accent;c.shadowColor=c.fillStyle;c.shadowBlur=4;c.beginPath();c.arc(12+col*12,12+r*12,3.6,0,Math.PI*2);c.fill();}));
      dotPatternCache.set(key,art);
    }
    ctx.drawImage(art,px-cell,py-cell,art.width*cell/12,art.height*cell/12);
  }
  const lampCache=new Map();
  function drawLamp(x,y,r,color,alpha){
    let lamp=lampCache.get(color);
    if(!lamp){lamp=document.createElement('canvas');lamp.width=48;lamp.height=48;const c=lamp.getContext('2d');const g=c.createRadialGradient(24,24,1,24,24,24);g.addColorStop(0,color);g.addColorStop(.22,color);g.addColorStop(1,'transparent');c.fillStyle=g;c.fillRect(0,0,48,48);lampCache.set(color,lamp);}
    ctx.globalAlpha=alpha;ctx.drawImage(lamp,x-r*3,y-r*3,r*6,r*6);ctx.globalAlpha=1;
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
  let bestCombo=0, frameId=0, resumePending=false;
  const heldKeys=new Set();
  let bootReady=false, launchInProgress=false;
  let impacts=[];
  let lastJudgeMs=0;
  let lastShowMilestone=-1;
  let sideFlashUntil=0;

  const imgs={};
  const imageSources={
    receptor_left_v7:'assets/generated/receptors/paw_receptor_left_v7.svg?v=0826f',
    receptor_down_v7:'assets/generated/receptors/paw_receptor_down_v7.svg?v=0826f',
    receptor_right_v7:'assets/generated/receptors/paw_receptor_right_v7.svg?v=0826f',
    receptor_up_v7:'assets/generated/receptors/paw_receptor_up_v7.svg?v=0826f',
    lane_overlay:'assets/generated/lanes/lane_overlay.svg?v=0826f'
  };
  for (const variant of PAW_VARIANTS) {
    for (const dir of LANE_DIRS) {
      imageSources[`note_${variant}_${dir}`] = `assets/generated/notes/${variant}/paw_note_${variant}_${dir}.svg?v=0826f`;
    }
  }
  const confettiColors=['#ff7a12','#ffffff','#111111'];
  let confettiParticles=[];
  let autoHypeBurstAt=0;

  function loadImage(key,url){
    return new Promise((resolve,reject)=>{
      const im=new Image();
      im.onload=()=>{
        // Rasterize SVG filters once, not at every moving/scaling drawImage.
        const bitmap=document.createElement('canvas');
        const scale=Math.min(1,512/Math.max(im.naturalWidth,im.naturalHeight));
        bitmap.width=Math.max(1,Math.round(im.naturalWidth*scale));
        bitmap.height=Math.max(1,Math.round(im.naturalHeight*scale));
        bitmap.getContext('2d').drawImage(im,0,0,bitmap.width,bitmap.height);
        imgs[key]=bitmap;resolve();
      };
      im.onerror=()=>reject(new Error(`${url} FAILED TO LOAD`));
      im.src=url;
    });
  }

  function waitForVideoReady(){
    return new Promise((resolve,reject)=>{
      if(video.readyState>=2){resolve();return;}
      const timer=setTimeout(()=>{cleanup();reject(new Error('VIDEO METADATA FAILED'));},15000);
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

  async function loadMidiBytes(url){
    if(location.protocol==='file:'){
      const encoded=window.TigerCallLocalMidi && window.TigerCallLocalMidi[url];
      if(!encoded) throw new Error('LOCAL MIDI DATA MISSING');
      return Uint8Array.from(atob(encoded), c=>c.charCodeAt(0)).buffer;
    }
    const response=await fetch(url,{cache:'no-store'});
    if(!response.ok) throw new Error('HTTP '+response.status);
    return response.arrayBuffer();
  }

  async function prepareFreshLaunch(){
    document.body.classList.add('launchMode');
    sourceBadge.textContent='SYSTEM CHECK';
    loadStatus.textContent='LOCKING PERFORMANCE DATA…';

    let performanceBuf, referenceBuf;
    try {
      performanceBuf = await loadMidiBytes(PERFORMANCE_MIDI_PATH);
    } catch (e) {
      throw new Error('HUMAN PERFORMANCE MIDI LOAD FAILED');
    }

    try {
      referenceBuf = await loadMidiBytes(REFERENCE_MIDI_PATH);
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
    loadStatus.textContent='FORMATION READY · SOUND ON · MAKE EVERY CALL COUNT';
  }

  function resize(){
    dpr=Math.min(1.5,window.devicePixelRatio||1);
    const rect=shell.getBoundingClientRect();
    W=Math.max(1,rect.width);H=Math.max(1,rect.height);
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
  const topY=()=>Math.max(H*.20, W<760 ? 132 : 112);
  const laneScale=()=>Math.min(1,W*.76/4/148);

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

    const recentHit=impacts.findLast(hit=>hit.lane===lane && hit.quality!=='MISS' && now-hit.time>=0 && now-hit.time<.22);
    if(recentHit){
      const fade=1-(now-recentHit.time)/.22;
      const flash=ctx.createLinearGradient(0,g.bottomY-110,0,g.bottomY);
      flash.addColorStop(0,'rgba(255,122,18,0)');
      flash.addColorStop(1,'rgba(255,122,18,'+(fade*.18)+')');
      ctx.fillStyle=flash;ctx.fillRect(g.botL,g.bottomY-110,g.botR-g.botL,130);
    }

    // marching field hashes / perspective guides
    for(let i=0;i<5;i++){
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
    ctx.shadowBlur=0;
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
    ctx.fillText(W<760 ? ARROW_LABELS[lane] : LANE_NAMES[lane], (g.topL+g.topR)/2, g.topY-10);
    ctx.restore();
  }

  function drawSideSpectacle(now,intensity){
    const flashBoost = now < sideFlashUntil ? 1 : 0;
    const ledCount = 28 + Math.floor(20*intensity);
    const margin = Math.max(26, W*.03);
    const top=H*.15,bottom=H*.93;
    const leftX=margin, rightX=W-margin;
    const modes=Math.floor(now/2.4)%5;
    const notesPattern=['00100','01110','00100','00110','00110','00100','00100'];
    const pawPattern=['00100','01110','11111','01110','00100'];
    for(const dir of [-1,1]){
      const baseX = dir<0? leftX : rightX;
      for(let i=0;i<ledCount;i++){
        const p=i/(ledCount-1);
        let y=lerp(top,bottom,p);
        let x=baseX;
        let b=.25 + .45*Math.max(0,Math.sin(now*2.9 + i*.35 + (dir<0?0:1.7)));
        if(modes===0) x += dir*(Math.sin(now*3+p*8)*12*(1+intensity));
        if(modes===1) x += dir*(Math.sin(p*12+now*5)*18*(.4+.8*intensity));
        if(modes===2) y += Math.sin(now*4+i*.3)*16*intensity;
        if(modes===3) x += dir*((i%2?1:-1)*10*(.4+intensity));
        if(modes===4) x += dir*(Math.cos(now*3.7 + i*.18)*14*(.3+intensity));
        b = clamp(b + intensity*.34 + flashBoost*.42, 0, 1);
        ctx.beginPath();
        const useWhite = (i + Math.floor(now*8)) % 9 === 0;
        const alpha = 0.28 + 0.62*b;
        drawLamp(x,y,1.8+3*b,useWhite?'#ffffff':'#ff7900',alpha);
      }
      const cell = Math.max(4, 5 + 3*intensity);
      const pattern = (Math.floor(now/2)%2===0) ? notesPattern : pawPattern;
      const px = dir<0 ? margin+10 : W-margin - pattern[0].length*cell - 10;
      const py = H*0.42;
      drawLedPattern(px, py, cell, pattern, { onColor: dir<0 ? '#ff8b24' : '#ffffff', offColor:'rgba(255,255,255,0.03)', glow:10+10*intensity, pulseBase:now*6, rounding:cell*0.48 });
      // matrix rail tickers
      for(let k=0;k<10;k++){
        const p=((k/10)+now*.18)%1;
        const y=lerp(top,bottom,p);
        const len=10+24*intensity;
        for(let d=0;d<5;d++){
          const tx = baseX + (dir<0?d*4:-len+d*4);
          ctx.fillStyle = d===4 ? 'rgba(255,255,255,.65)' : 'rgba(255,122,18,.55)';
          ctx.fillRect(tx, y-2, 2.5, 2.5);
        }
      }
    }
    ctx.shadowBlur=0;
  }


  // Fixed square grids, pre-rendered once. Empty LEDs stay dark for a clean silhouette.
  const ledArtCache=new Map();
  const ledShows=['TIGER PAW','TIGER EYES','TIGER CLAW','DOUBLE NOTES','09'];
  function ledArtwork(name){
    if(ledArtCache.has(name)) return ledArtCache.get(name);
    const mask=document.createElement('canvas');mask.width=250;mask.height=250;
    const m=mask.getContext('2d');m.fillStyle='#ff7800';
    const oval=(x,y,rx,ry,angle=0)=>{m.beginPath();m.ellipse(x,y,rx,ry,angle,0,Math.PI*2);m.fill();};
    if(name==='TIGER PAW'){
      oval(48,94,21,29,-.35);oval(96,57,22,31,-.12);oval(154,57,22,31,.12);oval(202,94,21,29,.35);
      m.beginPath();m.moveTo(125,107);m.bezierCurveTo(101,105,76,135,57,166);m.bezierCurveTo(31,211,68,233,101,217);m.quadraticCurveTo(125,207,149,217);m.bezierCurveTo(183,233,219,211,193,166);m.bezierCurveTo(174,135,150,105,125,107);m.fill();
    }else if(name==='TIGER EYES'){
      m.beginPath();m.moveTo(15,68);m.lineTo(108,111);m.lineTo(109,145);m.quadraticCurveTo(45,149,15,68);m.fill();
      m.beginPath();m.moveTo(235,68);m.lineTo(142,111);m.lineTo(141,145);m.quadraticCurveTo(205,149,235,68);m.fill();
      m.fillStyle='#fff';oval(73,121,24,12,.2);oval(177,121,24,12,-.2);
      m.globalCompositeOperation='destination-out';oval(78,121,6,22);oval(172,121,6,22);
    }else if(name==='TIGER CLAW'){
      for(let i=0;i<3;i++){const x=73+i*56;m.beginPath();m.moveTo(x+39,26);m.bezierCurveTo(x-9,87,x-18,158,x-42,229);m.lineTo(x+1,201);m.bezierCurveTo(x+15,131,x+22,68,x+39,26);m.fill();}
    }else if(name==='DOUBLE NOTES'){
      m.fillRect(76,53,17,137);m.fillRect(179,31,17,137);
      m.beginPath();m.moveTo(76,53);m.lineTo(196,28);m.lineTo(196,59);m.lineTo(76,84);m.fill();
      oval(57,192,36,24,-.25);oval(160,171,36,24,-.25);
    }else{m.font='900 176px Arial';m.textAlign='center';m.textBaseline='middle';m.fillText('09',125,137);}
    const pixels=m.getImageData(0,0,250,250).data;
    const art=document.createElement('canvas');art.width=274;art.height=274;
    const c=art.getContext('2d');
    for(let y=5;y<250;y+=10)for(let x=5;x<250;x+=10){const i=(y*250+x)*4;if(pixels[i+3]<128)continue;
      const white=pixels[i+1]>200;c.fillStyle=white?'#fff':'#ff7900';c.shadowColor=c.fillStyle;c.shadowBlur=5;
      c.beginPath();c.arc(x+12,y+12,3.5,0,Math.PI*2);c.fill();
    }
    ledArtCache.set(name,art);return art;
  }
  function drawLedFormation(now,intensity){
    if(W<760)return;
    const size=Math.min(190,W*.14),index=showFormation%ledShows.length;
    for(const [side,name] of [[0,ledShows[(index+1)%ledShows.length]],[1,ledShows[index]]]){
      const x=side?W*.84-size/2:W*.12-size/2,y=H*(side?.19:.34);
      ctx.save();ctx.fillStyle='rgba(0,0,0,.6)';ctx.strokeStyle='rgba(255,122,18,.42)';ctx.lineWidth=1;
      ctx.beginPath();ctx.roundRect(x-10,y-10,size+20,size+39,14);ctx.fill();ctx.stroke();
      ctx.globalAlpha=.88+.12*Math.sin(now*2);ctx.drawImage(ledArtwork(name),x,y,size,size);ctx.globalAlpha=1;
      ctx.fillStyle='#fff';ctx.font='800 10px Arial';ctx.textAlign='center';ctx.fillText(name,x+size/2,y+size+17);ctx.restore();
    }
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
    now = currentRenderTime || now;
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
      const ring=(24+easeOut(t)*32*power)*laneScale();
      ctx.save();
      ctx.globalAlpha=(1-t)*(hit.quality==='MISS'?.25:.72);
      ctx.strokeStyle=hit.quality==='MISS' ? 'rgba(255,120,80,.5)' : 'rgba(255,255,255,.95)';
      ctx.lineWidth=5*(1-t) + 1;
      ctx.shadowBlur=0; ctx.shadowColor='#ff7a12';
      ctx.beginPath();ctx.arc(x,y,ring,0,Math.PI*2);ctx.stroke();
      if(hit.quality!=='MISS'){
        for(let i=0;i<8;i++){
          const a=(i/5)*Math.PI*2 + age*4;
          const dist=(12 + age*16)*laneScale() + ring*.52;
          const px=x+Math.cos(a)*dist;
          const py=y+Math.sin(a)*dist - age*24;
          ctx.fillStyle=i%3===0 ? '#111111' : (i%2===0 ? '#ff7a12' : '#ffffff');
          ctx.font=`900 ${(14 + (1-t)*8)*laneScale()}px Arial`;
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
      if(dtRaw < -windows[2]-EXPIRY_GRACE-Math.max(0,inputOffset)){
        n.missed=true;judgementCounts.MISS++;
        combo=0;
        hype=Math.max(0,hype-8);
        judge('MISS');
        lastJudgementDelta = Math.round(dtRaw * 1000);
        updateHud();
        pushImpact(n.lane,'MISS',rawNow);
        continue;
      }
      const dt=n.hitTime-renderTime;
      if(dt>APPROACH || dt < -windows[2]) continue;
      const p=clamp(1-dt/APPROACH,0,1.12);
      const x=laneX(n.lane,p), y=tY+(bY-tY)*p;
      const s=(.32 + .62*Math.min(p,1))*laneScale();
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
        const alpha=(.34-t*.075)*(.65+.25*intensity);
        ctx.save();
        ctx.translate(0,(ty-y));
        ctx.scale(1-back*.5,1-back*.5);
        ctx.globalAlpha=alpha;
        ctx.fillStyle=t%2===0 ? '#ffffff' : '#ff7a12';
        ctx.font=`900 ${18*s}px Arial`;
        ctx.fillText(trailGlyphs[t%trailGlyphs.length], -8*s, 8*s);
        ctx.restore();
      }
      ctx.globalAlpha=.98;
      ctx.shadowBlur=0;
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
      const near = pending ? clamp(1 - pending.err/.28, 0, 1) : 0;
      const impact=impacts.findLast(hit=>hit.lane===lane && hit.quality!=='MISS' && now-hit.time<.3);
      const kick=impact ? Math.sin(clamp((now-impact.time)/.3,0,1)*Math.PI)*.14 : 0;
      const pulse = 1 + near*.035 + kick;
      const size = (118 + 8*intensity)*laneScale();
      // charging ring
      ctx.save();
      ctx.translate(x,y);
      ctx.globalAlpha=.24 + .4*near + .16*intensity;
      ctx.strokeStyle='rgba(255,138,32,.86)';
      ctx.lineWidth=4;
      ctx.shadowBlur=0;
      ctx.shadowColor=near>.3 ? '#fff' : '#ff7a12';
      ctx.beginPath();ctx.arc(0,0,(42 + 10*near)*laneScale(),0,Math.PI*2);ctx.stroke();
      ctx.shadowBlur=0;
      ctx.globalAlpha=1;
      const receptor=imgs[RECEPTOR_ASSETS[lane]];
      if(receptor) ctx.drawImage(receptor,-size*.5*pulse,-size*.5*pulse,size*pulse,size*pulse);
      else {ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(0,0,34,0,Math.PI*2);ctx.fill();}
      ctx.fillStyle='rgba(255,255,255,.95)';
      ctx.font=`900 ${W<760?11:14}px Arial, sans-serif`;
      ctx.textAlign='center';
      ctx.fillText(LANE_KEYS[lane],0,size*.56+14);
      if(W>=760){ctx.fillStyle='#ff9e39';ctx.font='700 11px Arial';ctx.fillText(['I','O','P','9'][lane],0,size*.56+29);}
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
    drawConfettiParticles(performance.now()/1000);
    drawNotes(rawNow,renderTime,intensity);
    drawReceptors(rawNow,intensity);
    drawImpacts(renderTime);
  }

  function judge(text){
    if(text==='MISS'){
      judgeEl.textContent='MISS';
      judgeEl.dataset.quality='MISS';
      judgeEl.classList.remove('pop');
      return;
    }
    judgeEl.textContent=text;
    judgeEl.dataset.quality=text;
    judgeEl.classList.remove('pop');
    judgeEl.getAnimations().forEach(a=>a.cancel());
    judgeEl.animate([{transform:'scale(1)'},{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:180});
  }

  function updateHud(){
    const value=String(score).padStart(7,'0');
    if(scoreEl.textContent!==value)scoreEl.textContent=value;
    if(comboEl.textContent!==String(combo))comboEl.textContent=combo;
    const width=Math.round(hype)+'%';if(hypeFill.style.width!==width)hypeFill.style.width=width;
  }

  function celebrateComboMilestone(){
    const milestone=combo>=50?Math.floor(combo/50)*50:combo>=10?Math.floor(combo/10)*10:combo>=5?5:0;
    if(!milestone || milestone===lastShowMilestone) return;
    lastShowMilestone=milestone;
    if(milestone>=10) flashSides(Math.min(1000,700 + milestone*4));
    if(milestone>=20) confetti(Math.min(60,22 + milestone/2));
    if(milestone>=30){
      markerLabel.textContent=`${milestone} COMBO`; markerLabel.classList.remove('show'); void markerLabel.offsetWidth; markerLabel.classList.add('show');
    }
    if(milestone>=40){ultra=true; setTimeout(()=>{ultra=false;}, 1800);}
  }

  function hitLane(lane,event){
    if(!running||paused||video.paused||video.seeking||video.readyState<2) return;
    if(event?.timeStamp && event.timeStamp<acceptInputAfter)return;
    const now=eventMediaTime(event);
    const match = findBestLaneMatch(now, lane);
    let best=match.best, err=match.err;
    lastJudgementDelta = best ? Math.round((now - best.hitTime) * 1000) : 0;
    lastJudgeMs = lastJudgementDelta;
    if(!best || err>windows[2]){
      emptyPresses++;combo=0; hype=Math.max(0,hype-3); judge('NO NOTE'); updateHud(); pushImpact(lane,'MISS',video.currentTime); return;
    }
    best.hit=true;
    combo++;
    bestCombo=Math.max(bestCombo,combo);
    let result='GOOD';
    if(err<=windows[0]){ score+=1000; result='PERFECT'; }
    else if(err<=windows[1]){ score+=700; result='GREAT'; }
    else { score+=400; result='GOOD'; }
    score += combo*8;
    hype = clamp(hype + (result==='PERFECT'?2.5:result==='GREAT'?1.8:1.1), 0, 100);
    judgementCounts[result]++;timingErrors.push(lastJudgementDelta);
    judge(result);
    $('timingFeedback').textContent=Math.abs(lastJudgementDelta)<=15?'ON TIME':(lastJudgementDelta<0?'EARLY ':'LATE ')+Math.abs(lastJudgementDelta)+' ms';
    updateHud();
    pushImpact(best.lane,result,video.currentTime);
    celebrateComboMilestone();
  }

  function markerEvent(name){
    showFormation++;
    if(name==='Hold Buttons')name='FOLLOW THE CALL';
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
    const waves = [0, 180, 360, 620, 980];
    waves.forEach((delay, idx) => {
      setTimeout(() => {
        const anchors=[W*0.16, W*0.32, W*0.50, W*0.68, W*0.84];
        const x=anchors[idx] + (Math.random()*60-30);
        const y=H*(0.07 + idx*0.012) + Math.random()*24;
        spawnConfettiBurst(Math.round(count*(0.40 + Math.random()*0.28)), x, y);
      }, delay);
    });
  }

  function resetGameState(){
    cancelAnimationFrame(frameId);
    readSettings();judgementCounts={PERFECT:0,GREAT:0,GOOD:0,MISS:0};timingErrors=[];emptyPresses=0;showFormation=0;
    acceptInputAfter=performance.now();lastFrameMs=0;$('timingFeedback').textContent='';
    currentRenderTime=0;lastVideoTime=0;lastVideoTimeCheckedAt=performance.now();
    heldKeys.clear();bestCombo=0;
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
    if(!running || paused) return;
    const now=video.currentTime || 0;
    while(nextMarker<markers.length && markers[nextMarker].time<=now+.01){ markerEvent(markers[nextMarker].name); nextMarker++; }

    const renderTime = getInterpolatedTime();
    currentRenderTime = renderTime;
    const frameMs=performance.now();const elapsed=lastFrameMs?Math.min(.1,(frameMs-lastFrameMs)/1000):0;lastFrameMs=frameMs;
    const progress = video.duration ? Math.max(0, Math.min(1, now / video.duration)) : 0;
    if(combo===0)hype=Math.max(0,hype-elapsed*2);
    updateHud();
    const intensity = getShowIntensity(now);
    drawHighway(now, renderTime);
    updateDebugOverlay();

    if(video.ended){ finish(); return; }
    frameId=requestAnimationFrame(gameLoop);
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
      frameId=requestAnimationFrame(gameLoop);

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
    confetti(60);
    const finaleStart=performance.now();
    const finale=()=>{if(running)return;drawHighway(video.currentTime,getInterpolatedTime());if(performance.now()-finaleStart<3300)frameId=requestAnimationFrame(finale);};
    frameId=requestAnimationFrame(finale);
    $('resultScore').textContent=score.toLocaleString();
    const hits=notes.filter(n=>n.hit).length;
    $('resultStats').textContent=`${hits} / ${notes.length} CALLS HIT · ${Math.round(hits/notes.length*100)}% COVERAGE · BEST COMBO ${bestCombo}`;
    const accuracy=(judgementCounts.PERFECT+judgementCounts.GREAT*.7+judgementCounts.GOOD*.4)/notes.length*100;
    const mean=timingErrors.length?timingErrors.reduce((a,b)=>a+b,0)/timingErrors.length:0;
    $('resultAccuracy').textContent=accuracy.toFixed(2)+'% TIMING ACCURACY';
    $('resultBreakdown').textContent=mode.toUpperCase()+' · PERFECT '+judgementCounts.PERFECT+' · GREAT '+judgementCounts.GREAT+' · GOOD '+judgementCounts.GOOD+' · MISS '+judgementCounts.MISS+' · EMPTY PRESSES '+emptyPresses;
    $('resultTiming').textContent=timingErrors.length?'AVERAGE '+Math.abs(mean).toFixed(0)+' ms '+(mean<0?'EARLY':'LATE'):'';
    try{const key='tigerAccuracy-v1-'+mode;const previous=Number(localStorage.getItem(key)||0);if(accuracy>previous)localStorage.setItem(key,String(accuracy));$('resultTiming').textContent+=' · BEST '+Math.max(previous,accuracy).toFixed(2)+'%';}catch{}
    $('resultScreen').classList.add('active');
    $('replayBtn').focus();
  }

  function togglePause(){
    if(!running || resumePending) return;
    if(!paused){
      paused=true;
      cancelAnimationFrame(frameId);
      video.pause();
      heldKeys.clear();
      $('pauseScreen').classList.add('active');
      $('resumeBtn').focus();
    }else{
      resumePending=true;
      const button=$('resumeBtn');button.disabled=true;button.textContent='READY IN 2';
      setTimeout(()=>{button.textContent='READY IN 1';},1000);
      new Promise(resolve=>setTimeout(resolve,2000)).then(()=>{
        if(document.hidden)throw new Error('Hidden');
        return video.play();
      }).then(()=>{
        acceptInputAfter=performance.now();lastFrameMs=0;
        paused=false;
        lastVideoTime=video.currentTime;
        lastVideoTimeCheckedAt=performance.now();
        currentRenderTime=lastVideoTime;
        $('pauseScreen').classList.remove('active');
        shell.focus();
        frameId=requestAnimationFrame(gameLoop);
      }).catch(()=>{ paused=true; }).finally(()=>{resumePending=false;button.disabled=false;button.textContent='RETURN';});
    }
  }

  let replayPending=false;
  function replay(){
    if(replayPending)return;
    replayPending=true;
    $('replayBtn').disabled=true;
    $('resultScreen').classList.remove('active');
    resetGameState();
    video.pause();
    try{ video.currentTime=0; }catch(_e){}
    video.muted=false;
    video.volume=1;
    const p=video.play();
    Promise.resolve(p).then(()=>{ running=true; paused=false; frameId=requestAnimationFrame(gameLoop); }).catch(()=>{
      running=false; launchDeck.classList.add('active'); document.body.classList.add('launchMode'); launchBtn.disabled=false;
    }).finally(()=>{replayPending=false;$('replayBtn').disabled=false;});
  }

  launchBtn.addEventListener('click',freshLaunch);
  $('pauseBtn').addEventListener('click',togglePause);
  $('resumeBtn').addEventListener('click',togglePause);
  $('replayBtn').addEventListener('click',replay);
  const keyHandler = e => {
    const lane = resolveLaneFromEvent(e);
    if(lane===undefined) return;
    if(!running || paused) return;
    e.preventDefault();
    if(e.repeat || heldKeys.has(e.code)) return;
    heldKeys.add(e.code);
    hitLane(lane,e);
  };
  window.addEventListener('keydown', keyHandler, true);
  window.addEventListener('keyup',e=>heldKeys.delete(e.code));
  window.addEventListener('blur',()=>{heldKeys.clear();if(running&&!paused)togglePause();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&running&&!paused)togglePause();});
  window.addEventListener('keydown',e=>{if(e.code==='Escape'&&running){e.preventDefault();togglePause();}});
  shell.addEventListener('pointerdown', e => {
    if(!running || paused || e.target.closest('button')) return;
    const rect=shell.getBoundingClientRect();
    const x=e.clientX-rect.left, y=e.clientY-rect.top;
    if(y < receptorY()-Math.max(50,70*laneScale()) || y>receptorY()+Math.max(50,70*laneScale()) || x<W*.12 || x>W*.88) return;
    e.preventDefault();
    const lane=Math.max(0, Math.min(3, Math.floor((x-W*.12)/(W*.76)*4)));
    hitLane(lane,e);
  });
  window.addEventListener('resize',resize);

  try{const pref=JSON.parse(localStorage.getItem('tigerTimingSettings')||'null');if(pref){$('timingMode').value=pref.mode;$('scrollSpeed').value=pref.approach;$('inputOffset').value=pref.input;$('visualOffset').value=pref.visual;}}catch{}
  ledShows.forEach(ledArtwork);
  resize();
  requestAnimationFrame(drawDrones);
  prepareFreshLaunch().catch(err=>{
    console.error(err); sourceBadge.textContent='LOAD ERROR'; droneMessage.textContent='CHECK FILES'; loadStatus.textContent=err.message; launchError.textContent=err.message; launchError.classList.add('show');
  });
})();
