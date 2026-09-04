// Living interaction layer: subtle pointer response + one live Playable preview for the active Feature.
(function(){
  const canHover=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if(canHover&&!reduceMotion){
    let raf=0,lastX=innerWidth/2,lastY=innerHeight/3;
    window.addEventListener('pointermove',e=>{
      lastX=e.clientX;lastY=e.clientY;
      if(raf)return;
      raf=requestAnimationFrame(()=>{
        document.documentElement.style.setProperty('--pointer-x',`${(lastX/innerWidth)*100}%`);
        document.documentElement.style.setProperty('--pointer-y',`${(lastY/innerHeight)*100}%`);
        const consoleEl=document.elementFromPoint(lastX,lastY)?.closest?.('.feature-media-console');
        if(consoleEl){
          const r=consoleEl.getBoundingClientRect();
          consoleEl.style.setProperty('--console-x',`${((lastX-r.left)/r.width)*100}%`);
          consoleEl.style.setProperty('--console-y',`${((lastY-r.top)/r.height)*100}%`);
        }
        raf=0;
      });
    },{passive:true});
  }

  const baseStandardFeature=standardFeature;
  standardFeature=function(p){
    const html=baseStandardFeature(p);
    if(!p?.experience)return html;
    return html.replace(
      /<button class="project-media-tile" id="featurePlay" type="button"([^>]*)><img src="([^"]*)" alt="">/,
      `<button class="project-media-tile" id="featurePlay" type="button"$1><iframe class="live-playable-preview" title="${esc(p.title)} live playable preview" src="${asset(p.experience)}" loading="lazy" tabindex="-1" aria-hidden="true"></iframe><span class="live-preview-shade"></span><span class="live-preview-badge"><i></i>LIVE PREVIEW</span>`
    );
  };

  const baseSetFeature=setFeature;
  setFeature=function(index,loadAudio=true){
    baseSetFeature(index,loadAudio);
    requestAnimationFrame(()=>{
      const tile=$('#featurePlay');
      const live=tile?.querySelector('.live-playable-preview');
      if(live){
        live.addEventListener('load',()=>tile.classList.add('live-ready'),{once:true});
      }
    });
  };

  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){
      document.querySelectorAll('.live-playable-preview').forEach(frame=>{try{frame.contentWindow?.postMessage({type:'2fly-preview-pause'},'*')}catch{}});
    }
  });
})();
