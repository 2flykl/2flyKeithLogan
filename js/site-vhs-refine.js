// VHS refinement pass: one-screen composition + archive status markers.
(function(){
  if(typeof renderVideos!=='function') return;
  const baseRenderVideos=renderVideos;

  const FEATURED=new Set(['streams','away','fire','africa']);
  const THROWBACK=new Set(['future-10','future-11','future-12','future-13']); // BTS, Interviews, Sessions, Family
  const COMING_SOON=new Set(['future-0','future-1','future-2']); // next scheduled releases

  function markerFor(id){
    if(FEATURED.has(id)) return {symbol:'★',label:'Featured',kind:'featured'};
    if(THROWBACK.has(id)) return {symbol:'▲',label:'Throwback',kind:'throwback'};
    if(COMING_SOON.has(id)) return {symbol:'→',label:'Coming soon',kind:'soon'};
    return null;
  }

  function decorateArchive(){
    const archive=document.querySelector('.vhs-archive');
    const title=document.querySelector('.vhs-archive-title');
    if(archive&&title&&!archive.querySelector('.vhs-legend')){
      const legend=document.createElement('div');
      legend.className='vhs-legend';
      legend.innerHTML='<span class="legend-featured">★ FEATURED</span><span class="legend-throwback">▲ THROWBACK</span><span class="legend-soon">→ COMING SOON</span>';
      title.insertAdjacentElement('afterend',legend);
    }

    document.querySelectorAll('.vhs-spine[data-tape-id]').forEach(spine=>{
      const marker=markerFor(spine.dataset.tapeId);
      const old=spine.querySelector('.archive-marker');
      if(old) old.remove();
      if(!marker) return;
      const el=document.createElement('span');
      el.className=`archive-marker marker-${marker.kind}`;
      el.textContent=marker.symbol;
      el.title=marker.label;
      el.setAttribute('aria-label',marker.label);
      spine.appendChild(el);
    });

    // The status language now lives in the vertical archive, so the redundant
    // foreground tape table is intentionally removed.
    document.querySelector('.featured-table')?.remove();

    // Replace the old table-specific idle instruction.
    const description=document.querySelector('.vhs-hud .hud-description');
    if(description&&/featured tapes on the table/i.test(description.textContent||'')){
      description.textContent='Choose a VHS from the archive. Symbols identify featured, throwback, and upcoming releases.';
    }
  }

  renderVideos=function(){
    baseRenderVideos();
    decorateArchive();
  };
})();
