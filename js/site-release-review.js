// One shared footer for every content page, independent of its renderer.
(()=>{
  const footerRoutes=new Set(['home','featured','music','videos','playables','support','africa']);
  function finalize(){
    const view=document.getElementById('appView');
    if(!view||!view.children.length||!footerRoutes.has(document.body.dataset.route))return;
    if(view.querySelector(':scope > .site-global-footer'))return;
    view.querySelectorAll('.help-create-module,.help-ticker,.room-footer,.portal-footer,.home-entrance-footer').forEach(el=>el.remove());
    const footer=document.createElement('footer');
    footer.className='site-global-footer'+(document.body.dataset.route==='home'?' home-entrance-footer':'');
    footer.setAttribute('aria-label','Support and feedback');
    footer.innerHTML=helpModule();
    view.append(footer);
  }
  document.addEventListener('DOMContentLoaded',()=>{
    const view=document.getElementById('appView');
    if(!view)return;
    new MutationObserver(finalize).observe(view,{childList:true});
    finalize();
  });
})();
