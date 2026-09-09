// Featured Life Pass V2 — artwork response + hardened Featured navigation interactions.
(function(){
  const fine=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function bindArt(){
    if(!fine||reduce)return;
    document.querySelectorAll('.feature-art-frame:not([data-life-bound])').forEach(frame=>{
      frame.dataset.lifeBound='1';
      frame.addEventListener('pointermove',e=>{
        const r=frame.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-.5;
        const y=(e.clientY-r.top)/r.height-.5;
        frame.style.setProperty('--art-ry',`${(x*2.1).toFixed(2)}deg`);
        frame.style.setProperty('--art-rx',`${(-y*1.7).toFixed(2)}deg`);
      });
      frame.addEventListener('pointerleave',()=>{
        frame.style.setProperty('--art-ry','0deg');
        frame.style.setProperty('--art-rx','0deg');
      });
    });
  }

  // Capture carousel/edge navigation before older nested listeners can double-fire.
  document.addEventListener('click',e=>{
    const thumb=e.target.closest('.feature-deck [data-feature]');
    const step=e.target.closest('.feature-deck [data-step]');
    const edge=e.target.closest('.feature-side-preview[data-feature]');
    const target=thumb||edge;
    if(!target&&!step)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if(typeof setFeature!=='function')return;
    if(target){
      const i=Number(target.dataset.feature);
      if(Number.isFinite(i))setFeature(i,true);
    }else if(step){
      const delta=Number(step.dataset.step);
      if(Number.isFinite(delta))setFeature((app.featureIndex||0)+delta,true);
    }
  },true);

  // Keyboard support for the same controls.
  document.addEventListener('keydown',e=>{
    if(!document.body.matches('[data-route="featured"]'))return;
    if(e.key==='ArrowLeft'){e.preventDefault();setFeature((app.featureIndex||0)-1,true)}
    if(e.key==='ArrowRight'){e.preventDefault();setFeature((app.featureIndex||0)+1,true)}
  });

  const observer=new MutationObserver(()=>requestAnimationFrame(bindArt));
  observer.observe(document.getElementById('appView')||document.body,{subtree:true,childList:true});
  document.addEventListener('DOMContentLoaded',bindArt);
  bindArt();
})();
