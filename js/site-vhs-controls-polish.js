// VHS-room polish: filters, compact CRT controls, channel surfing, VCR grouping,
// and a true overhead VHS artifact whose reels animate with playback.
(function(){
  const FILTERS=[
    {id:'none',label:'NO EFFECT'},
    {id:'bw',label:'B&W'},
    {id:'sepia',label:'SEPIA'},
    {id:'nineties',label:"1990'S"}
  ];
  const CHANNELS=['streams','away','fire','africa'];

  function fmt(sec){
    if(!Number.isFinite(sec)) return '0:00';
    const m=Math.floor(sec/60),s=Math.floor(sec%60);
    return `${m}:${String(s).padStart(2,'0')}`;
  }
  function safe(value){
    return String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function applyFilter(id){
    const screen=document.getElementById('crtScreen');
    if(!screen)return;
    const found=FILTERS.find(f=>f.id===id)||FILTERS[0];
    screen.dataset.tvfx=found.id;
    const status=document.querySelector('.picture-filter-status');
    if(status) status.textContent=found.label;
    const trigger=document.querySelector('.picture-filter-trigger');
    if(trigger){
      trigger.dataset.filter=found.id;
      trigger.setAttribute('aria-label',`Picture effect: ${found.label}. Click for next effect.`);
    }
  }

  function installPictureFilter(){
    const panel=document.querySelector('.tv-control-panel');
    if(!panel || panel.querySelector('.picture-filter-control')) return;
    const wrap=document.createElement('div');
    wrap.className='picture-filter-control picture-filter-toggle-control';
    wrap.innerHTML=`
      <span>PICTURE</span>
      <button class="picture-filter-trigger" type="button" data-filter="none" aria-label="Picture effect: No effect. Click for next effect.">
        <span>FX</span><b class="picture-filter-status">NO EFFECT</b>
      </button>`;
    panel.appendChild(wrap);
    const trigger=wrap.querySelector('.picture-filter-trigger');
    trigger.onclick=e=>{
      e.stopPropagation();
      const current=FILTERS.findIndex(f=>f.id===(trigger.dataset.filter||'none'));
      const next=FILTERS[(current+1)%FILTERS.length];
      applyFilter(next.id);
    };
    applyFilter('none');
  }

  function setChannel(index){
    const safeIndex=((index%CHANNELS.length)+CHANNELS.length)%CHANNELS.length;
    const label=document.getElementById('crtChannel');
    if(label) label.textContent=`CH ${String(safeIndex+1).padStart(2,'0')}`;
    const dial=document.getElementById('channelDial');
    if(dial){
      dial.dataset.channelIndex=String(safeIndex);
      dial.style.setProperty('--dial-rotation',`${-44+(safeIndex*23)}deg`);
      dial.setAttribute('aria-label',`Channel ${String(safeIndex+1).padStart(2,'0')}. Click for next channel.`);
    }
  }

  function selectedChannelIndex(){
    const selected=document.querySelector('.vhs-spine.selected[data-tape-id]');
    if(!selected)return -1;
    return CHANNELS.indexOf(selected.dataset.tapeId);
  }

  function syncChannelFromSelection(){
    const idx=selectedChannelIndex();
    setChannel(idx>=0?idx:0);
  }

  function installChannelSurfing(){
    const dial=document.getElementById('channelDial');
    if(!dial || dial.dataset.channelSurfBound)return;
    dial.dataset.channelSurfBound='true';
    setChannel(Math.max(0,selectedChannelIndex()));
    dial.onclick=()=>{
      const current=selectedChannelIndex();
      const next=current<0?0:(current+1)%CHANNELS.length;
      setChannel(next);
      const tape=document.querySelector(`.vhs-spine[data-tape-id="${CHANNELS[next]}"]`);
      tape?.click();
    };
    document.querySelectorAll('.vhs-spine[data-tape-id]').forEach(btn=>{
      if(btn.dataset.channelSyncBound)return;
      btn.dataset.channelSyncBound='true';
      btn.addEventListener('click',()=>{
        const idx=CHANNELS.indexOf(btn.dataset.tapeId);
        if(idx>=0)setChannel(idx);
      });
    });
  }

  function bindOsdFade(){
    const screen=document.getElementById('crtScreen');
    const video=document.getElementById('vhsVideo');
    if(!screen||!video||video.dataset.osdFadeBound)return;
    video.dataset.osdFadeBound='true';
    const hide=()=>screen.classList.add('osd-content-running');
    const show=()=>screen.classList.remove('osd-content-running');
    const reset=()=>{video.dataset.contentStarted='false';show();};
    video.addEventListener('play',()=>{video.dataset.contentStarted='true';hide();});
    video.addEventListener('pause',()=>{if(video.dataset.contentStarted==='true')hide();});
    video.addEventListener('ended',reset);
    document.getElementById('vcrStop')?.addEventListener('click',()=>requestAnimationFrame(reset));
    document.getElementById('vcrEject')?.addEventListener('click',()=>requestAnimationFrame(reset));
    document.querySelectorAll('.vhs-spine[data-tape-id]').forEach(btn=>btn.addEventListener('click',reset,{capture:true}));
    show();
  }

  function rebuildScreenControls(){
    const screen=document.getElementById('crtScreen');
    const video=document.getElementById('vhsVideo');
    if(!screen||!video)return;
    const old=screen.querySelector('.crt-click-controls');
    if(old) old.remove();
    const controls=document.createElement('div');
    controls.className='crt-click-controls crt-click-controls-bar';
    controls.setAttribute('aria-hidden','true');
    controls.innerHTML=`
      <div class="crt-bottom-bar" role="group" aria-label="Video screen controls">
        <button class="crt-bar-play" type="button" aria-label="Play or pause">▶</button>
        <input class="crt-bar-seek" type="range" min="0" max="100" value="0" aria-label="Video progress">
        <span class="crt-bar-time">0:00 / 0:00</span>
        <button class="crt-bar-vol" type="button" aria-label="Mute or unmute">VOL</button>
        <button class="crt-bar-ch" type="button" aria-label="Next channel">CH</button>
        <button class="crt-bar-stop" type="button" aria-label="Stop">■</button>
        <button class="crt-bar-full" type="button" aria-label="Fullscreen">⛶</button>
      </div>`;
    screen.appendChild(controls);
    const play=controls.querySelector('.crt-bar-play'),seek=controls.querySelector('.crt-bar-seek'),time=controls.querySelector('.crt-bar-time'),vol=controls.querySelector('.crt-bar-vol'),ch=controls.querySelector('.crt-bar-ch'),stop=controls.querySelector('.crt-bar-stop'),full=controls.querySelector('.crt-bar-full');
    controls.addEventListener('click',e=>e.stopPropagation());
    play.onclick=()=>{video.paused?document.getElementById('vcrPlay')?.click():document.getElementById('vcrPause')?.click();};
    seek.oninput=()=>{if(Number.isFinite(video.duration)&&video.duration>0)video.currentTime=(+seek.value/100)*video.duration;};
    vol.onclick=()=>{video.muted=!video.muted;vol.classList.toggle('muted',video.muted);};
    ch.onclick=()=>document.getElementById('channelDial')?.click();
    stop.onclick=()=>document.getElementById('vcrStop')?.click();
    full.onclick=()=>{if(document.fullscreenElement)document.exitFullscreen?.();else screen.requestFullscreen?.();};
    const sync=()=>{play.textContent=video.paused?'▶':'Ⅱ';time.textContent=`${fmt(video.currentTime)} / ${fmt(video.duration)}`;seek.value=Number.isFinite(video.duration)&&video.duration>0?String((video.currentTime/video.duration)*100):'0';};
    ['timeupdate','loadedmetadata','durationchange','play','pause','ended'].forEach(evt=>video.addEventListener(evt,sync));
    sync();
  }

  function groupVcrControls(){
    const controls=document.querySelector('.vcr-controls');
    if(!controls || controls.dataset.polished)return;
    controls.dataset.polished='true';
    document.getElementById('vcrRew')?.classList.add('transport-rew');
    document.getElementById('vcrFf')?.classList.add('transport-ff');
    document.getElementById('vcrPlay')?.classList.add('transport-play');
    document.getElementById('vcrPause')?.classList.add('transport-pause');
    document.getElementById('vcrStop')?.classList.add('transport-stop');
    document.getElementById('vcrEject')?.classList.add('transport-eject');
  }

  function currentHudTitle(){return document.querySelector('#vhsHud h1')?.textContent?.trim() || 'SELECT A TAPE';}
  function artifactState(mode,text){
    const artifact=document.querySelector('.vhs-overhead-artifact');
    if(!artifact)return;
    artifact.classList.remove('is-playing','is-paused','is-rewinding','is-idle');
    artifact.classList.add(mode);
    const state=artifact.querySelector('.vhs-overhead-state');
    if(state)state.textContent=text;
  }

  function buildOverheadArtifact(){
    const hud=document.getElementById('vhsHud');
    if(!hud)return;
    hud.querySelectorAll('.cassette-inspection').forEach(el=>el.remove());
    const title=currentHudTitle();
    const existing=hud.querySelector('.vhs-overhead-artifact');
    if(title==='SELECT A TAPE'){existing?.remove();return;}
    if(existing && existing.dataset.title===title)return;
    existing?.remove();
    const artifact=document.createElement('section');
    artifact.className='vhs-overhead-artifact is-idle';
    artifact.dataset.title=title;
    artifact.setAttribute('aria-label','Loaded VHS artifact');
    artifact.innerHTML=`
      <div class="vhs-overhead-head"><span>ARCHIVE ARTIFACT</span><em class="vhs-overhead-state">LOADED TAPE</em></div>
      <div class="vhs-overhead-stage">
        <div class="vhs-overhead-tape" role="img" aria-label="Overhead VHS tape for ${safe(title)}">
          <div class="vhs-top-ridge"></div>
          <div class="vhs-reel-bay left"><div class="vhs-reel-wheel reel-left"><i></i></div></div>
          <div class="vhs-reel-bay right"><div class="vhs-reel-wheel reel-right"><i></i></div></div>
          <div class="vhs-center-window"><span></span></div>
          <div class="vhs-main-label"><strong>${safe(title)}</strong><span>2FLY VIDEO ARCHIVE</span><div class="vhs-label-rules"></div></div>
          <span class="vhs-screw s1"></span><span class="vhs-screw s2"></span><span class="vhs-screw s3"></span><span class="vhs-screw s4"></span>
          <div class="vhs-bottom-ridge"></div>
        </div>
      </div>
      <div class="vhs-rewind-message">PLEASE BE KIND — REWIND BEFORE RETURNING THIS TAPE TO THE ARCHIVE.</div>
      <button class="vhs-rewind-button" type="button">BE KIND AND REWIND</button>
      <div class="vhs-overhead-caption"><strong>${safe(title)}</strong><span>The reels move with playback and reverse during rewind.</span></div>`;
    hud.appendChild(artifact);
    const stage=artifact.querySelector('.vhs-overhead-stage'),tape=artifact.querySelector('.vhs-overhead-tape');
    stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;tape.style.setProperty('--tiltX',`${(-y*1.8).toFixed(2)}deg`);tape.style.setProperty('--tiltY',`${(x*2.2).toFixed(2)}deg`);});
    stage.addEventListener('pointerleave',()=>{tape.style.removeProperty('--tiltX');tape.style.removeProperty('--tiltY');});
    const video=document.getElementById('vhsVideo');
    artifact.querySelector('.vhs-rewind-button').onclick=()=>{
      if(!video || !Number.isFinite(video.currentTime))return;
      video.pause();artifactState('is-rewinding','REWINDING');
      const startTime=video.currentTime,started=performance.now(),duration=Math.max(.45,Math.min(2.4,startTime/7));
      function step(now){const p=Math.min(1,(now-started)/(duration*1000));video.currentTime=Math.max(0,startTime*(1-p));if(p<1){requestAnimationFrame(step);return;}video.currentTime=0;video.dataset.contentStarted='false';document.getElementById('crtScreen')?.classList.remove('osd-content-running');artifactState('is-paused','READY');}
      requestAnimationFrame(step);
    };
    if(video && !video.dataset.vhsArtifactBound){
      video.dataset.vhsArtifactBound='true';
      video.addEventListener('play',()=>artifactState('is-playing','PLAYING'));
      video.addEventListener('pause',()=>{if(document.querySelector('.vhs-overhead-artifact.is-rewinding'))return;artifactState(video.currentTime>0?'is-paused':'is-idle',video.currentTime>0?'PAUSED':'LOADED TAPE');});
      video.addEventListener('ended',()=>artifactState('is-paused','ENDED'));
    }
    if(video && !video.paused)artifactState('is-playing','PLAYING');
  }

  function patch(){
    if(!document.querySelector('.video-vhs-page'))return;
    installPictureFilter();
    rebuildScreenControls();
    groupVcrControls();
    installChannelSurfing();
    bindOsdFade();
    buildOverheadArtifact();
    syncChannelFromSelection();
    const hud=document.getElementById('vhsHud');
    if(hud&&!hud.dataset.polishObserver){hud.dataset.polishObserver='true';new MutationObserver(()=>requestAnimationFrame(()=>{buildOverheadArtifact();syncChannelFromSelection();})).observe(hud,{childList:true,subtree:false});}
  }

  const original=window.renderVideos;
  if(typeof original==='function'){window.renderVideos=function(){const r=original.apply(this,arguments);requestAnimationFrame(patch);return r;};}
  if(document.querySelector('.video-vhs-page'))patch();
})();
