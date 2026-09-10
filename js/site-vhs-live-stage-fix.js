// LIVE-STAGE VHS FIX
// Uses persistent data attributes and delegated capture handlers so core VCR class resets
// cannot break channel numbering, OSD fading, picture-effect toggle, or the Help 2Fly Create CTA.
(function(){
  const CHANNELS=['streams','away','fire','africa'];
  const EFFECTS=[
    {id:'none',label:'NO EFFECT'},
    {id:'bw',label:'B&W'},
    {id:'sepia',label:'SEPIA'},
    {id:'nineties',label:"1990'S"}
  ];
  let effectIndex=0;

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));

  function selectedId(){return $('[data-tape-id].selected')?.dataset.tapeId||null}
  function channelFor(id){const i=CHANNELS.indexOf(id);return i<0?1:i+1}
  function writeChannel(id){
    const label=$('#crtChannel');
    if(label) label.textContent='CH '+String(channelFor(id)).padStart(2,'0');
  }
  function syncChannel(){writeChannel(selectedId()||'streams')}

  function setContentStarted(on){
    const screen=$('#crtScreen');
    if(screen) screen.dataset.contentStarted=on?'true':'false';
  }

  function applyEffect(index){
    effectIndex=(index+EFFECTS.length)%EFFECTS.length;
    const fx=EFFECTS[effectIndex];
    const screen=$('#crtScreen');
    if(screen) screen.dataset.liveFx=fx.id;
    const label=$('.picture-filter-status');
    if(label) label.textContent=fx.label;
    const btn=$('.picture-filter-trigger');
    if(btn){
      btn.setAttribute('aria-label',`Picture effect ${fx.label}. Click to cycle.`);
      btn.dataset.liveFxBound='true';
    }
  }

  function ensureEffectButton(){
    const panel=$('.tv-control-panel');
    if(!panel)return;
    let wrap=$('.picture-filter-toggle-control',panel);
    if(!wrap){
      $('.picture-filter-control',panel)?.remove();
      wrap=document.createElement('div');
      wrap.className='picture-filter-toggle-control live-effect-control';
      wrap.innerHTML='<span>PICTURE</span><button class="picture-filter-trigger" type="button"><span>FX</span><b class="picture-filter-status">NO EFFECT</b></button>';
      panel.appendChild(wrap);
    }
    applyEffect(effectIndex);
  }

  function ensureHelpCreateButton(){
    $$('.vhs-overhead-artifact').forEach(artifact=>{
      const rewind=$('.vhs-rewind-button',artifact);
      if(!rewind)return;
      let button=$('.video-help2fly-create',artifact);
      if(!button){
        button=document.createElement('a');
        button.className='video-help2fly-create';
        button.href='#support';
        button.dataset.route='support';
        button.setAttribute('aria-label','Help 2Fly Create');
        button.innerHTML='<small>IF THIS MOVED YOU</small><strong>HELP 2FLY CREATE</strong><span>→</span>';
      }
      // Keep it physically attached directly beneath BE KIND AND REWIND,
      // even when the VHS HUD is rebuilt after changing tapes.
      if(rewind.nextElementSibling!==button) rewind.insertAdjacentElement('afterend',button);
    });
  }

  function cycleChannel(){
    const current=selectedId();
    let i=CHANNELS.indexOf(current);
    i=i<0?0:(i+1)%CHANNELS.length;
    const id=CHANNELS[i];
    const tape=$(`[data-tape-id="${id}"]`);
    if(tape){tape.click();writeChannel(id)}
  }

  function bindVideo(){
    const video=$('#vhsVideo');
    if(!video||video.dataset.liveStageBound)return;
    video.dataset.liveStageBound='true';
    video.addEventListener('play',()=>setContentStarted(true));
    video.addEventListener('ended',()=>setContentStarted(false));
    video.addEventListener('loadedmetadata',syncChannel);
  }

  // Delegated capture handlers beat legacy onclick assignments and survive every re-render.
  document.addEventListener('click',e=>{
    const fx=e.target.closest('.picture-filter-trigger');
    if(fx){
      e.preventDefault();
      e.stopImmediatePropagation();
      applyEffect(effectIndex+1);
      return;
    }

    const channel=e.target.closest('#channelDial,.crt-bar-ch');
    if(channel){
      e.preventDefault();
      e.stopImmediatePropagation();
      cycleChannel();
      return;
    }

    const tape=e.target.closest('[data-tape-id]');
    if(tape){
      const id=tape.dataset.tapeId;
      if(CHANNELS.includes(id)) setTimeout(()=>writeChannel(id),0);
      setContentStarted(false);
      return;
    }

    if(e.target.closest('#vcrStop,#vcrEject,.vhs-rewind-button')){
      setTimeout(()=>setContentStarted(false),0);
    }
  },true);

  function patch(){
    if(!$('.video-vhs-page'))return;
    ensureEffectButton();
    ensureHelpCreateButton();
    bindVideo();
    syncChannel();
    const video=$('#vhsVideo');
    if(video && video.paused && video.currentTime<=0.05) setContentStarted(false);
  }

  const observer=new MutationObserver(()=>requestAnimationFrame(patch));
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('hashchange',()=>setTimeout(patch,25));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patch);
  else patch();
})();
