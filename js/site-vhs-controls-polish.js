// Minor VHS-room polish: restore four picture filters, rebuild the CRT overlay controls,
// improve VCR transport grouping, and refine the loaded VHS artifact.
(function(){
  const FILTERS=[
    {id:'none',label:'NO EFFECT'},
    {id:'bw',label:'B&W'},
    {id:'sepia',label:'SEPIA'},
    {id:'nineties',label:"1990'S"}
  ];

  function fmt(sec){
    if(!Number.isFinite(sec)) return '0:00';
    const m=Math.floor(sec/60),s=Math.floor(sec%60);
    return `${m}:${String(s).padStart(2,'0')}`;
  }

  function applyFilter(id){
    const screen=document.getElementById('crtScreen');
    if(!screen)return;
    FILTERS.forEach(f=>screen.classList.remove('tvfx-'+f.id));
    screen.classList.add('tvfx-'+id);
    const status=document.querySelector('.picture-filter-status');
    const found=FILTERS.find(f=>f.id===id);
    if(status) status.textContent=found?.label||'NO EFFECT';
    document.querySelectorAll('.picture-filter-menu button').forEach(b=>b.classList.toggle('active',b.dataset.filter===id));
  }

  function installPictureFilter(){
    const panel=document.querySelector('.tv-control-panel');
    if(!panel || panel.querySelector('.picture-filter-control')) return;
    const wrap=document.createElement('div');
    wrap.className='picture-filter-control';
    wrap.innerHTML=`
      <span>PICTURE</span>
      <button class="picture-filter-trigger" type="button" aria-expanded="false">FILTER <b class="picture-filter-status">NO EFFECT</b></button>
      <div class="picture-filter-menu" hidden>
        ${FILTERS.map(f=>`<button type="button" data-filter="${f.id}" class="${f.id==='none'?'active':''}">${f.label}</button>`).join('')}
      </div>`;
    panel.appendChild(wrap);
    const trigger=wrap.querySelector('.picture-filter-trigger');
    const menu=wrap.querySelector('.picture-filter-menu');
    trigger.onclick=e=>{
      e.stopPropagation();
      const open=menu.hidden;
      menu.hidden=!open;
      trigger.setAttribute('aria-expanded',String(open));
    };
    menu.addEventListener('click',e=>{
      const btn=e.target.closest('[data-filter]');
      if(!btn)return;
      applyFilter(btn.dataset.filter);
      menu.hidden=true;
      trigger.setAttribute('aria-expanded','false');
    });
    document.addEventListener('click',e=>{
      if(!wrap.contains(e.target)){menu.hidden=true;trigger.setAttribute('aria-expanded','false');}
    });
    applyFilter('none');
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
        <button class="crt-bar-ch" type="button" aria-label="Next chapter">CH</button>
        <button class="crt-bar-stop" type="button" aria-label="Stop">■</button>
        <button class="crt-bar-full" type="button" aria-label="Fullscreen">⛶</button>
      </div>`;
    screen.appendChild(controls);

    const play=controls.querySelector('.crt-bar-play');
    const seek=controls.querySelector('.crt-bar-seek');
    const time=controls.querySelector('.crt-bar-time');
    const vol=controls.querySelector('.crt-bar-vol');
    const ch=controls.querySelector('.crt-bar-ch');
    const stop=controls.querySelector('.crt-bar-stop');
    const full=controls.querySelector('.crt-bar-full');

    controls.addEventListener('click',e=>e.stopPropagation());
    play.onclick=()=>{video.paused?document.getElementById('vcrPlay')?.click():document.getElementById('vcrPause')?.click();};
    seek.oninput=()=>{if(Number.isFinite(video.duration)&&video.duration>0)video.currentTime=(+seek.value/100)*video.duration;};
    vol.onclick=()=>{video.muted=!video.muted;vol.classList.toggle('muted',video.muted);};
    ch.onclick=()=>document.getElementById('channelDial')?.click();
    stop.onclick=()=>document.getElementById('vcrStop')?.click();
    full.onclick=()=>{if(document.fullscreenElement)document.exitFullscreen?.();else screen.requestFullscreen?.();};

    const sync=()=>{
      play.textContent=video.paused?'▶':'Ⅱ';
      time.textContent=`${fmt(video.currentTime)} / ${fmt(video.duration)}`;
      seek.value=Number.isFinite(video.duration)&&video.duration>0?String((video.currentTime/video.duration)*100):'0';
    };
    ['timeupdate','loadedmetadata','durationchange','play','pause','ended'].forEach(evt=>video.addEventListener(evt,sync));
    sync();
  }

  function groupVcrControls(){
    const controls=document.querySelector('.vcr-controls');
    if(!controls || controls.dataset.polished)return;
    controls.dataset.polished='true';
    const rew=document.getElementById('vcrRew');
    const ff=document.getElementById('vcrFf');
    const play=document.getElementById('vcrPlay');
    const pause=document.getElementById('vcrPause');
    const stop=document.getElementById('vcrStop');
    const eject=document.getElementById('vcrEject');
    if(rew)rew.classList.add('transport-rew');
    if(ff)ff.classList.add('transport-ff');
    if(play)play.classList.add('transport-play');
    if(pause)pause.classList.add('transport-pause');
    if(stop)stop.classList.add('transport-stop');
    if(eject)eject.classList.add('transport-eject');
  }

  function polishTape(){
    document.querySelectorAll('.cassette-inspection').forEach(box=>box.classList.add('vhs-artifact-polished'));
  }

  function patch(){
    if(!document.querySelector('.video-vhs-page'))return;
    installPictureFilter();
    rebuildScreenControls();
    groupVcrControls();
    polishTape();
    const hud=document.getElementById('vhsHud');
    if(hud&&!hud.dataset.polishObserver){
      hud.dataset.polishObserver='true';
      new MutationObserver(()=>requestAnimationFrame(polishTape)).observe(hud,{childList:true,subtree:true});
    }
  }

  const original=window.renderVideos;
  if(typeof original==='function'){
    window.renderVideos=function(){const r=original.apply(this,arguments);requestAnimationFrame(patch);return r;};
  }
  if(document.querySelector('.video-vhs-page'))patch();
})();
