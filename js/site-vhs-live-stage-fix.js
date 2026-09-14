// LIVE-STAGE VHS FIX — optimized
(function(){
  const CHANNELS=['streams','away','fire','africa'];
  const EFFECTS=[
    {id:'none',label:'NO EFFECT'},
    {id:'bw',label:'B&W'},
    {id:'sepia',label:'SEPIA'},
    {id:'nineties',label:"1990'S"}
  ];
  let effectIndex=0;
  let appObserver=null;
  let hudObserver=null;
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));

  function selectedId(){return $('[data-tape-id].selected')?.dataset.tapeId||null}
  function channelFor(id){const i=CHANNELS.indexOf(id);return i<0?1:i+1}
  function writeChannel(id){const label=$('#crtChannel');if(label)label.textContent='CH '+String(channelFor(id)).padStart(2,'0')}
  function syncChannel(){writeChannel(selectedId()||'streams')}
  function setContentStarted(on){const screen=$('#crtScreen');if(screen)screen.dataset.contentStarted=on?'true':'false'}

  function applyEffect(index){
    effectIndex=(index+EFFECTS.length)%EFFECTS.length;
    const fx=EFFECTS[effectIndex];
    const screen=$('#crtScreen');
    if(screen){screen.dataset.liveFx=fx.id;screen.dataset.tvfx=fx.id;}
    const label=$('.picture-filter-status');
    if(label)label.textContent=fx.label;
    const btn=$('.picture-filter-trigger');
    if(btn)btn.setAttribute('aria-label',`Picture effect ${fx.label}. Click to cycle.`);
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
      if(rewind.nextElementSibling!==button)rewind.insertAdjacentElement('afterend',button);
    });
  }

  function cycleChannel(){
    const current=selectedId();
    let i=CHANNELS.indexOf(current);
    i=i<0?0:(i+1)%CHANNELS.length;
    const id=CHANNELS[i];
    const tape=$(`.vhs-spine[data-tape-id="${id}"]`);
    if(tape){tape.click();writeChannel(id)}
  }

  function bindVideo(){
    const video=$('#vhsVideo');
    if(!video||video.dataset.liveStageBound)return;
    video.dataset.liveStageBound='true';
    video.preload='metadata';
    video.addEventListener('play',()=>setContentStarted(true));
    video.addEventListener('ended',()=>setContentStarted(false));
    video.addEventListener('loadedmetadata',syncChannel);
    video.addEventListener('error',()=>{
      setContentStarted(false);
      const display=$('#vcrDisplay');
      if(display)display.textContent='ERROR';
    });
  }

  function watchHudOnly(){
    const hud=$('#vhsHud');
    if(!hud||hud.dataset.liveHudObserved)return;
    hud.dataset.liveHudObserved='true';
    hudObserver?.disconnect();
    hudObserver=new MutationObserver(()=>requestAnimationFrame(ensureHelpCreateButton));
    hudObserver.observe(hud,{childList:true});
  }

  function patch(){
    if(!$('.video-vhs-page'))return;
    ensureEffectButton();
    ensureHelpCreateButton();
    bindVideo();
    watchHudOnly();
    syncChannel();
    const video=$('#vhsVideo');
    if(video&&video.paused&&video.currentTime<=0.05)setContentStarted(false);
  }

  document.addEventListener('click',e=>{
    const fx=e.target.closest('.picture-filter-trigger');
    if(fx){e.preventDefault();e.stopImmediatePropagation();applyEffect(effectIndex+1);return;}
    const channel=e.target.closest('#channelDial,.crt-bar-ch');
    if(channel){e.preventDefault();e.stopImmediatePropagation();cycleChannel();return;}
    if(e.target.closest('#vcrStop,#vcrEject,.vhs-rewind-button'))setTimeout(()=>setContentStarted(false),0);
  },true);

  // Run after the tape's own handler, while the user's click activation is still valid.
  document.addEventListener('click',e=>{
    const tape=e.target.closest('.vhs-spine[data-tape-id]');
    if(!tape)return;
    const id=tape.dataset.tapeId;
    if(CHANNELS.includes(id))writeChannel(id);
    setContentStarted(false);
    const video=$('#vhsVideo');
    if(!video)return;
    const src=video.getAttribute('src')||video.currentSrc;
    if(!src)return;
    video.play().catch(()=>{
      const display=$('#vcrDisplay');
      if(display&&display.textContent==='LOAD')display.textContent='READY';
    });
    requestAnimationFrame(()=>{ensureHelpCreateButton();bindVideo();});
  });

  function observeAppView(){
    const app=$('#appView');
    if(!app||app.dataset.vhsAppObserved)return;
    app.dataset.vhsAppObserved='true';
    appObserver?.disconnect();
    appObserver=new MutationObserver(()=>requestAnimationFrame(patch));
    appObserver.observe(app,{childList:true});
  }

  window.addEventListener('hashchange',()=>setTimeout(()=>{observeAppView();patch();},20));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{observeAppView();patch();});
  else{observeAppView();patch();}
})();
