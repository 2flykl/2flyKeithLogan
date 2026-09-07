// Music Option 2 asset repair layer.
// Real supplied hardware art defines the scene; this fixes page-relative paths and assigns distinct L/R assets.
(function(){
  'use strict';
  const ROOT='../assets/music-premium-v2/';

  function set(img,file){
    if(!img)return;
    const correct=ROOT+file;
    if(img.getAttribute('src')!==correct)img.setAttribute('src',correct);
  }

  function repairAll(root=document){
    const scene=root.matches?.('.premium-music-option-2')?root:root.querySelector?.('.premium-music-option-2');
    if(!scene)return;
    set(scene.querySelector('.premium-speaker-left .speaker-base'),'speaker-left-base.webp');
    set(scene.querySelector('.premium-speaker-right .speaker-base'),'speaker-right-base.webp');
    set(scene.querySelector('.premium-stereo-wrap .stereo-base'),'stereo-base.webp');
    set(scene.querySelector('.premium-binder-wrap .binder-base-asset'),'binder-base.webp');
    set(scene.querySelector('.premium-room .premium-table-asset'),'table.webp');
  }

  const observer=new MutationObserver(records=>{
    for(const r of records){
      for(const n of r.addedNodes){
        if(n.nodeType!==1)continue;
        if(n.matches?.('.premium-music-option-2')||n.querySelector?.('.premium-music-option-2'))repairAll(n);
      }
    }
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',()=>repairAll());
  window.addEventListener('hashchange',()=>setTimeout(()=>repairAll(),0));
  setTimeout(()=>repairAll(),0);
  setTimeout(()=>repairAll(),120);
  setTimeout(()=>repairAll(),500);
})();