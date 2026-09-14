// 2FLY LIVE STAGE — functional physical stereo controls
(function(){
  function wireStereo(){
    if(document.body.dataset.route!=="music") return;
    const stereo=document.querySelector('.music-v3-stereo');
    if(!stereo) return;

    const screen=document.querySelector('.music-v3-stereo-screen');
    if(screen && screen.parentElement!==stereo) stereo.appendChild(screen);

    if(stereo.dataset.controlsWired==='true') return;
    stereo.dataset.controlsWired='true';

    const controls=[
      ['prev','Previous disc','#musicRoomPrev'],
      ['play','Play or pause','#musicRoomPlay'],
      ['next','Next disc','#musicRoomNext'],
      ['power','Power / play','#musicRoomPlay']
    ];
    controls.forEach(([cls,label,target])=>{
      const b=document.createElement('button');
      b.type='button';
      b.className='music-stereo-physical '+cls;
      b.setAttribute('aria-label',label);
      b.title=label;
      b.addEventListener('click',e=>{
        e.preventDefault();
        e.stopPropagation();
        document.querySelector(target)?.click();
      });
      stereo.appendChild(b);
    });
  }

  const root=document.getElementById('appView');
  if(root){
    new MutationObserver(()=>requestAnimationFrame(wireStereo))
      .observe(root,{childList:true,subtree:true});
  }
  window.addEventListener('hashchange',()=>setTimeout(wireStereo,0));
  document.addEventListener('DOMContentLoaded',()=>setTimeout(wireStereo,0));
  setTimeout(wireStereo,0);
})();
