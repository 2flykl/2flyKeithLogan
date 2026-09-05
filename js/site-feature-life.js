// Featured Life Pass — tiny physical response for project artwork.
(function(){
  const fine=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!fine||reduce)return;

  function bindArt(){
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

  const observer=new MutationObserver(()=>requestAnimationFrame(bindArt));
  observer.observe(document.getElementById('appView')||document.body,{subtree:true,childList:true});
  document.addEventListener('DOMContentLoaded',bindArt);
  bindArt();
})();
