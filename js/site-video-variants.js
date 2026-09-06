// Video presentation variants. Option 1 is the existing VHS build unchanged.
// Option 2 is a separate premium route so upgrades can be developed safely.
(function(){
  if(typeof route!=='function'||typeof renderVideos!=='function') return;
  const routeBeforeVideoVariants=route;

  function renderVideosPremium(){
    renderVideos();
    const page=document.querySelector('.video-vhs-page');
    if(!page) return;
    page.classList.add('video-premium-page');
    page.insertAdjacentHTML('afterbegin',`<div class="video-variant-banner"><div><small>VIDEO PRESENTATION</small><strong>OPTION 2 · PREMIUM BUILD</strong></div><a href="#videos" data-route="videos">VIEW OPTION 1 →</a></div>`);
    const stage=document.querySelector('.video-vhs-stage');
    stage?.classList.add('premium-video-stage');
    const tv=document.querySelector('.tv-cabinet');
    tv?.classList.add('premium-tv-cabinet');
    const archive=document.querySelector('.vhs-archive');
    archive?.classList.add('premium-vhs-archive');
    const hud=document.querySelector('.vhs-hud');
    hud?.classList.add('premium-vhs-hud');
  }

  route=function(){
    const raw=(location.hash||'#home').slice(1).split('?')[0];
    if(raw!=='videos-premium'){
      routeBeforeVideoVariants();
      const trigger=document.querySelector('.video-nav-group > [data-route="videos"]');
      if(trigger&&app.route==='videos') trigger.classList.add('active');
      return;
    }
    app.route='videos-premium';
    $$('#primaryNav [data-route]').forEach(a=>a.classList.remove('active'));
    document.querySelector('.video-nav-group > [data-route="videos"]')?.classList.add('active');
    document.querySelector('[data-route="videos-premium"]')?.classList.add('active');
    document.body.dataset.route='videos-premium';
    renderVideosPremium();
    window.scrollTo({top:0,left:0,behavior:'auto'});
    $('#appView').focus({preventScroll:true});
  };
})();
