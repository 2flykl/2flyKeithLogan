// Final runtime fix for VHS CRT interactions.
// Runs after all other page scripts so it can reliably own channel, OSD, and effect behavior.
(function(){
  const CHANNELS=['streams','away','fire','africa'];
  const EFFECTS=[
    {id:'none',label:'NO EFFECT'},
    {id:'bw',label:'B&W'},
    {id:'sepia',label:'SEPIA'},
    {id:'nineties',label:"1990'S"}
  ];
  let effectIndex=0;

  function qs(sel,root=document){return root.querySelector(sel)}
  function qsa(sel,root=document){return Array.from(root.querySelectorAll(sel))}
  function channelNumber(id){const i=CHANNELS.indexOf(id);return i<0?1:i+1}
  function currentTapeId(){
    const selected=qs('[data-tape-id].selected');
    return selected?.dataset.tapeId || null;
  }
  function setChannelLabel(id){
    const el=qs('#crtChannel');
    if(!el)return;
    el.textContent='CH '+String(channelNumber(id)).padStart(2,'0');
  }
  function syncChannelFromSelection(){
    const id=currentTapeId();
    if(id && CHANNELS.includes(id)) setChannelLabel(id);
    else if(qs('#crtChannel')) qs('#crtChannel').textContent='CH 01';
  }

  function cycleChannel(){
    const current=currentTapeId();
    let idx=CHANNELS.indexOf(current);
    idx=(idx+1+CHANNELS.length)%CHANNELS.length;
    const next=CHANNELS[idx];
    const btn=qs(`[data-tape-id="${next}"]`);
    if(btn){
      btn.click();
      setChannelLabel(next);
    }
  }

  function setOsdRunning(running){
    const screen=qs('#crtScreen');
    if(!screen)return;
    screen.classList.toggle('osd-content-running',!!running);
  }

  function bindVideoState(){
    const video=qs('#vhsVideo');
    if(!video || video.dataset.runtimeOsdBound)return;
    video.dataset.runtimeOsdBound='true';
    video.addEventListener('play',()=>setOsdRunning(true));
    video.addEventListener('pause',()=>{
      // Pausing during playback keeps the OSD hidden. STOP/ENDED/rewind-to-zero restores it separately.
      if(video.currentTime<=0.05) setOsdRunning(false);
    });
    video.addEventListener('ended',()=>setOsdRunning(false));
  }

  function applyEffect(){
    const screen=qs('#crtScreen');
    const btn=qs('.picture-filter-trigger');
    if(!screen || !btn)return;
    const effect=EFFECTS[effectIndex];
    screen.dataset.tvfx=effect.id;
    // Clear legacy effect classes so only the runtime data attribute controls the picture.
    EFFECTS.forEach(f=>screen.classList.remove('tvfx-'+f.id));
    let label=qs('.picture-filter-status',btn);
    if(!label){
      label=document.createElement('b');
      label.className='picture-filter-status';
      btn.appendChild(label);
    }
    label.textContent=effect.label;
    btn.setAttribute('aria-label',`Picture effect: ${effect.label}. Click for next effect.`);
  }

  function rebuildEffectToggle(){
    const panel=qs('.tv-control-panel');
    if(!panel)return;
    let old=qs('.picture-filter-control',panel) || qs('.picture-filter-toggle-control',panel);
    if(old) old.remove();

    const wrap=document.createElement('div');
    wrap.className='picture-filter-toggle-control';
    wrap.innerHTML=`<span>PICTURE</span><button class="picture-filter-trigger" type="button"><span>FX</span><b class="picture-filter-status">NO EFFECT</b></button>`;
    panel.appendChild(wrap);
    const btn=qs('.picture-filter-trigger',wrap);
    btn.addEventListener('click',e=>{
      e.preventDefault();
      e.stopPropagation();
      effectIndex=(effectIndex+1)%EFFECTS.length;
      applyEffect();
    });
    applyEffect();
  }

  function bindPhysicalControls(){
    const dial=qs('#channelDial');
    if(dial && !dial.dataset.runtimeChannelBound){
      dial.dataset.runtimeChannelBound='true';
      // Capture phase overrides the legacy onclick handler.
      dial.addEventListener('click',e=>{
        e.preventDefault();
        e.stopImmediatePropagation();
        cycleChannel();
      },true);
    }

    const ch=qs('.crt-bar-ch');
    if(ch && !ch.dataset.runtimeChannelBound){
      ch.dataset.runtimeChannelBound='true';
      ch.addEventListener('click',e=>{
        e.preventDefault();
        e.stopImmediatePropagation();
        cycleChannel();
      },true);
    }

    const stop=qs('#vcrStop');
    if(stop && !stop.dataset.runtimeOsdBound){
      stop.dataset.runtimeOsdBound='true';
      stop.addEventListener('click',()=>setTimeout(()=>setOsdRunning(false),0),true);
    }
    const eject=qs('#vcrEject');
    if(eject && !eject.dataset.runtimeOsdBound){
      eject.dataset.runtimeOsdBound='true';
      eject.addEventListener('click',()=>setTimeout(()=>setOsdRunning(false),0),true);
    }
    const rewind=qs('.vhs-rewind-button');
    if(rewind && !rewind.dataset.runtimeOsdBound){
      rewind.dataset.runtimeOsdBound='true';
      rewind.addEventListener('click',()=>setTimeout(()=>setOsdRunning(false),2500),true);
    }
  }

  function bindTapeClicks(){
    qsa('[data-tape-id]').forEach(btn=>{
      if(btn.dataset.runtimeChannelSync)return;
      btn.dataset.runtimeChannelSync='true';
      btn.addEventListener('click',()=>{
        const id=btn.dataset.tapeId;
        if(CHANNELS.includes(id)) setTimeout(()=>setChannelLabel(id),0);
        setOsdRunning(false);
      });
    });
  }

  function patch(){
    if(!qs('.video-vhs-page'))return;
    bindVideoState();
    bindPhysicalControls();
    bindTapeClicks();
    if(!qs('.picture-filter-toggle-control')) rebuildEffectToggle();
    syncChannelFromSelection();
  }

  const observer=new MutationObserver(()=>requestAnimationFrame(patch));
  observer.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('hashchange',()=>setTimeout(patch,40));
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',patch);
  else patch();
})();
