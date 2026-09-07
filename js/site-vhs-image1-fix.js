// Image-1 layout correction for the 2FLY VHS room.
// Keeps the working VHS logic from site-vhs.js, removes the old foreground tape table,
// and adds the cassette-inspection artifact inside the existing right-side HUD.
(function(){
  const baseRender = window.renderVideos;
  if (typeof baseRender !== 'function') return;

  function safeText(value){
    return String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function patchVcr(){
    const vcr = document.querySelector('.video-vhs-page .vcr');
    if (!vcr || vcr.dataset.image1Patched) return;
    vcr.dataset.image1Patched = 'true';

    const brand = vcr.querySelector('.vcr-brand');
    if (brand && !brand.querySelector('.vcr-power-block')) {
      brand.innerHTML = '<span class="vcr-power-block"><i>POWER</i><b></b></span><strong>2FLY</strong>';
    }
  }

  function addInspection(){
    const hud = document.getElementById('vhsHud');
    if (!hud || hud.querySelector('.cassette-inspection')) return;

    const title = (hud.querySelector('h1')?.textContent || 'SELECT A TAPE').trim();
    const kicker = (hud.querySelector('.hud-kicker')?.textContent || '').toUpperCase();
    const future = /SELECTED TAPE|PREVIEW/.test(kicker) && /FUTURE RELEASE/.test((hud.querySelector('.hud-meta')?.textContent || '').toUpperCase());
    const idle = title === 'SELECT A TAPE';
    if (idle) return;

    const inspection = document.createElement('section');
    inspection.className = 'cassette-inspection' + (future ? ' future' : ' loaded');
    inspection.setAttribute('aria-label', 'Cassette inspection view');
    inspection.innerHTML = `
      <div class="cassette-inspection-head"><span>ARCHIVE ARTIFACT</span><em>${future ? 'COMING SOON' : 'LOADED TAPE'}</em></div>
      <div class="cassette-stage">
        <div class="cassette-shell" aria-hidden="true">
          <div class="cassette-top-edge"></div>
          <div class="cassette-window"><i></i><i></i></div>
          <div class="cassette-label"><span>${safeText(title)}</span><b></b><b></b><b></b></div>
          <div class="cassette-bottom-edge"></div>
        </div>
      </div>
      <div class="cassette-caption"><strong>${safeText(title)}</strong><span>${future ? 'Reserved in the 2FLY archive for a future visual release.' : 'Physical archive reference for the selected 2FLY video.'}</span></div>`;

    hud.appendChild(inspection);
  }

  function patchRoom(){
    document.querySelector('.video-vhs-page .featured-table')?.remove();
    patchVcr();
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
