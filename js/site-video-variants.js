// Video presentation variants. Option 1 is the existing VHS build unchanged.
// Option 2 is a separate premium route using mounted sliced artwork layers.
(function(){
  if(typeof route!=='function'||typeof renderVideos!=='function') return;
  const routeBeforeVideoVariants=route;

  function bindVideoNav(){
    const group=document.querySelector('#videoNavGroup');
    const toggle=document.querySelector('#videoMenuToggle');
    if(!group||!toggle||toggle.dataset.bound==='true') return;
    toggle.dataset.bound='true';
    toggle.addEventListener('click',e=>{
      e.preventDefault();e.stopPropagation();
      const open=group.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded',String(open));
    });
    document.addEventListener('click',e=>{
      if(!group.contains(e.target)){
        group.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded','false');
      }
    });
    group.querySelectorAll('.video-nav-menu [data-route]').forEach(link=>link.addEventListener('click',()=>{
      group.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded','false');
    }));
  }

  function mountPremiumArt(){
    const cabinet=document.querySelector('.premium-tv-cabinet');
    const archive=document.querySelector('.premium-vhs-archive');
    if(cabinet&&!cabinet.querySelector('.premium-shell-art')){
      const img=document.createElement('img');
      img.className='premium-shell-art';
      img.src='../assets/video-premium/tv-vcr-shell.svg';
      img.alt='';
      img.setAttribute('aria-hidden','true');
      cabinet.prepend(img);
    }
    if(archive&&!archive.querySelector('.premium-rack-art')){
      const img=document.createElement('img');
      img.className='premium-rack-art';
      img.src='../assets/video-premium/vhs-rack.svg';
      img.alt='';
      img.setAttribute('aria-hidden','true');
      archive.prepend(img);
    }
  }

  function renderVideosPremium(){
    renderVideos();
    const page=document.querySelector('.video-vhs-page');
    if(!page) return;
    page.classList.add('video-premium-page');
    page.insertAdjacentHTML('afterbegin',`<div class="video-variant-banner"><div><small>VIDEO PRESENTATION</small><strong>OPTION 2 · PREMIUM SLICED-ASSET BUILD</strong></div><a href="#videos" data-route="videos">VIEW OPTION 1 →</a></div>`);
    document.querySelector('.video-vhs-stage')?.classList.add('premium-video-stage');
    document.querySelector('.tv-cabinet')?.classList.add('premium-tv-cabinet');
    document.querySelector('.vhs-archive')?.classList.add('premium-vhs-archive');
    document.querySelector('.vhs-hud')?.classList.add('premium-vhs-hud');
    mountPremiumArt();
  }

  route=function(){
    bindVideoNav();
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

  document.addEventListener('DOMContentLoaded',bindVideoNav);
})();
