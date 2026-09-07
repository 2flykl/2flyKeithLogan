// Music Option 2 asset repair layer.
// Keeps the current renderer intact but corrects asset URLs from /pages/ to repository-root assets.
(function(){
  'use strict';
  const ROOT='../assets/music-premium-v2/';
  const map={
    'speaker-left-base.webp':'speaker-left-base.webp',
    'speaker-right-base.webp':'speaker-right-base.webp',
    'stereo-base.webp':'stereo-base.webp',
    'binder-base.webp':'binder-base.webp',
    'table.webp':'table.webp'
  };

  function repair(img){
    if(!img || !img.getAttribute)return;
    const raw=img.getAttribute('src')||'';
    const name=Object.keys(map).find(k=>raw.includes('music-premium-v2/'+k));
    if(!name)return;
    const correct=ROOT+map[name];
    if(raw!==correct) img.setAttribute('src',correct);
  }

  function repairAll(root=document){
    root.querySelectorAll?.('.premium-music-option-2 img').forEach(repair);
  }

  const observer=new MutationObserver(records=>{
    for(const r of records){
      for(const n of r.addedNodes){
        if(n.nodeType!==1)continue;
        if(n.matches?.('.premium-music-option-2 img'))repair(n);
        repairAll(n);
      }
    }
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',()=>repairAll());
  setTimeout(()=>repairAll(),0);
  setTimeout(()=>repairAll(),250);
})();