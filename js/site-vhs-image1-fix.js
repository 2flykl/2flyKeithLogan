// Image-1 layout correction for the 2FLY VHS room.
// Keeps the working VHS logic from site-vhs.js, removes the old foreground tape table,
// restores click-to-open CRT controls, and leaves the archive artifact to the dedicated VHS HUD layer.
(function(){
  const baseRender = window.renderVideos;
  if (typeof baseRender !== 'function') return;

  function formatTime(sec){
    if (!Number.isFinite(sec)) return '0:00';
    const m=Math.floor(sec/60), s=Math.floor(sec%60);
    return `${m}:${String(s).padStart(2,'0')}`;
  }

  function patchVcr(){
    const vcr = document.querySelector('.video-vhs-page .vcr');
    if (!vcr || vcr.dataset.image1Patched) return;
    vcr.dataset.image1Patched = 'true';
    const brand = vcr.querySelector('.vcr-brand');
    if (brand && !brand.querySelector('.vcr-power-block')) {
      brand.innerHTML = '<span class="vcr-power-block"><i>POWER</i><b></b></span><strong>2FLY</strong>';
    }
    if(!vcr.querySelector('.vcr-foot-left')){
      vcr.insertAdjacentHTML('beforeend','<i class="vcr-foot vcr-foot-left" aria-hidden="true"></i><i class="vcr-foot vcr-foot-right" aria-hidden="true"></i>');
    }
  }

  function addScreenControls(){
    const screen=document.getElementById('crtScreen');
    const video=document.getElementById('vhsVideo');
    if(!screen || !video || screen.querySelector('.crt-click-controls')) return;

    const controls=document.createElement('div');
    controls.className='crt-click-controls';
    controls.setAttribute('aria-hidden','true');
    controls.innerHTML=`
      <div class="crt-control-glass"></div>
      <div class="crt-control-panel" role="group" aria-label="On-screen video controls">
        <div class="crt-control-title"><span>2FLY SCREEN CONTROL</span><button class="crt-control-close" type="button" aria-label="Close screen controls">×</button></div>
        <div class="crt-control-row">
          <button type="button" data-tv-control="rew" aria-label="Rewind 10 seconds">◀◀</button>
          <button class="crt-control-play" type="button" data-tv-control="play" aria-label="Play or pause">▶</button>
          <button type="button" data-tv-control="ff" aria-label="Fast forward 10 seconds">▶▶</button>
        </div>
        <div class="crt-control-progress"><span class="crt-control-current">0:00</span><input class="crt-control-seek" type="range" min="0" max="100" value="0" aria-label="Video progress"><span class="crt-control-duration">0:00</span></div>
        <div class="crt-control-volume"><span>VOL</span><input type="range" min="0" max="1" step=".01" value="1" aria-label="Video volume"></div>
      </div>`;
    screen.appendChild(controls);

    const open=()=>{screen.classList.add('controls-open');controls.setAttribute('aria-hidden','false');};
    const close=()=>{screen.classList.remove('controls-open');controls.setAttribute('aria-hidden','true');};
    screen.addEventListener('click',e=>{
      if(e.target.closest('.crt-click-controls')) return;
      if(screen.classList.contains('controls-open')) close(); else open();
    });
    controls.querySelector('.crt-control-close').onclick=e=>{e.stopPropagation();close();};
    controls.addEventListener('click',e=>e.stopPropagation());

    const playBtn=controls.querySelector('[data-tv-control="play"]');
    controls.querySelector('[data-tv-control="rew"]').onclick=()=>document.getElementById('vcrRew')?.click();
    controls.querySelector('[data-tv-control="ff"]').onclick=()=>document.getElementById('vcrFf')?.click();
    playBtn.onclick=()=>{ if(video.paused) document.getElementById('vcrPlay')?.click(); else document.getElementById('vcrPause')?.click(); };

    const seek=controls.querySelector('.crt-control-seek');
    const vol=controls.querySelector('.crt-control-volume input');
    const current=controls.querySelector('.crt-control-current');
    const duration=controls.querySelector('.crt-control-duration');
    vol.value=String(video.volume ?? 1);
    vol.oninput=()=>{video.volume=+vol.value;};
    seek.oninput=()=>{if(Number.isFinite(video.duration)&&video.duration>0) video.currentTime=(+seek.value/100)*video.duration;};
    const sync=()=>{
      current.textContent=formatTime(video.currentTime);
      duration.textContent=formatTime(video.duration);
      seek.value=Number.isFinite(video.duration)&&video.duration>0 ? String((video.currentTime/video.duration)*100) : '0';
      playBtn.textContent=video.paused?'▶':'Ⅱ';
    };
    ['timeupdate','loadedmetadata','durationchange','play','pause','ended'].forEach(evt=>video.addEventListener(evt,sync));
    sync();
  }

  function patchRoom(){
    document.querySelector('.video-vhs-page .featured-table')?.remove();
    patchVcr();
    addScreenControls();
    document.querySelectorAll('#vhsHud .cassette-inspection').forEach(el=>el.remove());
  }

  window.renderVideos = function(){
    baseRender.apply(this, arguments);
    patchRoom();
  };
})();
