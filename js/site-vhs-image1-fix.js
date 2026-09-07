// Image-1 layout correction for the 2FLY VHS room.
// Keeps the working VHS logic from site-vhs.js, removes the old foreground tape table,
// restores click-to-open CRT controls, and presents the selected cassette as a clean archive thumbnail.
(function(){
  const baseRender = window.renderVideos;
  if (typeof baseRender !== 'function') return;

  function safeText(value){
    return String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
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
    vcr.insertAdjacentHTML('beforeend','<i class="vcr-foot vcr-foot-left" aria-hidden="true"></i><i class="vcr-foot vcr-foot-right" aria-hidden="true"></i>');
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

  function addInspection(){
    const hud = document.getElementById('vhsHud');
    if (!hud || hud.querySelector('.cassette-inspection')) return;
    const title = (hud.querySelector('h1')?.textContent || 'SELECT A TAPE').trim();
    const kicker = (hud.querySelector('.hud-kicker')?.textContent || '').toUpperCase();
    const future = /SELECTED TAPE|PREVIEW/.test(kicker) && /FUTURE RELEASE/.test((hud.querySelector('.hud-meta')?.textContent || '').toUpperCase());
    if (title === 'SELECT A TAPE') return;

    const inspection = document.createElement('section');
    inspection.className = 'cassette-inspection' + (future ? ' future' : ' loaded');
    inspection.setAttribute('aria-label', 'Cassette inspection view');
    inspection.innerHTML = `
      <div class="cassette-inspection-head"><span>ARCHIVE ARTIFACT</span><em>${future ? 'COMING SOON' : 'LOADED TAPE'}</em></div>
      <div class="cassette-stage">
        <div class="cassette-parallax">
          <div class="cassette-shell" aria-hidden="true">
            <div class="cassette-ridge cassette-ridge-top"></div>
            <div class="cassette-window"><i></i><u></u><i></i></div>
            <div class="cassette-label"><span>${safeText(title)}</span><b></b><b></b><b></b></div>
            <div class="cassette-ridge cassette-ridge-bottom"></div>
            <span class="cassette-screw s1"></span><span class="cassette-screw s2"></span><span class="cassette-screw s3"></span><span class="cassette-screw s4"></span>
          </div>
        </div>
      </div>
      <div class="cassette-caption"><strong>${safeText(title)}</strong><span>${future ? 'Reserved in the 2FLY archive for a future visual release.' : 'Selected archive cassette · click the TV for screen controls.'}</span></div>`;
    hud.appendChild(inspection);

    const stage=inspection.querySelector('.cassette-stage');
    const card=inspection.querySelector('.cassette-parallax');
    stage.addEventListener('pointermove',e=>{
      const r=stage.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
      card.style.setProperty('--rx',`${(-y*5).toFixed(2)}deg`);
      card.style.setProperty('--ry',`${(x*7).toFixed(2)}deg`);
      card.style.setProperty('--tx',`${(x*5).toFixed(1)}px`);
      card.style.setProperty('--ty',`${(y*4).toFixed(1)}px`);
    });
    stage.addEventListener('pointerleave',()=>{['--rx','--ry','--tx','--ty'].forEach(p=>card.style.removeProperty(p));});
  }

  function patchRoom(){
    document.querySelector('.video-vhs-page .featured-table')?.remove();
    patchVcr();
    addScreenControls();
    addInspection();
    const hud = document.getElementById('vhsHud');
    if (hud && !hud.dataset.inspectionObserver) {
      hud.dataset.inspectionObserver = 'true';
      const observer = new MutationObserver(() => {
        if (!hud.querySelector('.cassette-inspection')) requestAnimationFrame(addInspection);
      });
      observer.observe(hud, {childList:true});
    }
  }

  window.renderVideos = function(){
    baseRender.apply(this, arguments);
    patchRoom();
  };
})();
