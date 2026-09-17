// Final shared-shell router. Specialty files define renderers; this controller owns navigation.
(function(){
  const routes={
    home:()=>renderHome(),
    featured:()=>renderFeatured(),
    playables:()=>renderPlayables(),
    music:()=>renderMusic(),
    videos:()=>renderVideos(),
    music2:()=>MediaPages.music(),
    videos2:()=>MediaPages.videos(),
    support:()=>renderSupport(),
    africa:()=>renderAfrica(),
    flyzone:()=>renderFlyZone()
  };

  route=function(){
    const raw=(location.hash||'#home').slice(1).split('?')[0];
    const next=Object.prototype.hasOwnProperty.call(routes,raw)?raw:'home';
    window.MediaPages?.cleanup();
    app.route=next;

    $$('#primaryNav [data-route]').forEach(a=>a.classList.toggle('active',a.dataset.route===next));
    document.body.dataset.route=next;
    $$('#primaryNav [data-route]').forEach(a=>{
      if(a.dataset.route===next)a.setAttribute('aria-current','page');
      else a.removeAttribute('aria-current');
    });
    $$('#primaryNav details[open]').forEach(menu=>menu.removeAttribute('open'));
    routes[next]();

    window.scrollTo({top:0,left:0,behavior:'auto'});
    $('#primaryNav')?.classList.remove('open');
    $('#menuToggle')?.setAttribute('aria-expanded','false');
    $('#appView')?.focus({preventScroll:true});
  };
})();
