// 2FLY VHS polish pass — click-to-reveal screen controls, synced channel OSD,
// optional picture filters, playback-clean overlays, and a more authentic 90s VCR face.
(function(){
  if(typeof renderVideos!=='function') return;
  const baseRenderVideos=renderVideos;
  let controlTimer=null;
  const FILTERS=[
    {id:'off',label:'OFF'},
    {id:'crt',label:'90s CRT'},
    {id:'bw',label:'B&W'},
    {id:'sepia',label:'SEPIA'}
  ];
  let filterIndex=0;

  const q=s=>document.querySelector(s);
  const qa=s=>[...document.querySelectorAll(s)];

  function installPolish(){
    const screen=q('#crtScreen'),video=q('#vhsVideo'),panel=q('.tv-control-panel'),vcr=q('.vcr');
    if(!screen||!video) return;

    // Default playback is clean/original quality. Nostalgic filters are opt-in.
    screen.classList.add('filter-off');

    // Click/tap reveals controls. Hover alone never reveals them.
    // Capture phase intentionally intercepts the older click-to-toggle behavior.
    screen.addEventListener('click',e=>{
      if(e.target.closest('.crt-user-controls,.crt-chapter-popover,button,input')) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      revealControls(true);
    },true);
    screen.addEventListener('pointermove',()=>{
      if(screen.classList.contains('controls-open')) scheduleHide();
    });

    function revealControls(forceOpen=false){
      if(forceOpen) screen.classList.add('controls-open');
      else screen.classList.toggle('controls-open');
      scheduleHide();
    }
    function scheduleHide(){
      clearTimeout(controlTimer);
      if(video.paused) return;
      controlTimer=setTimeout(()=>screen.classList.remove('controls-open'),3000);
    }
    video.addEventListener('play',()=>{
      // Keep the first moment readable, then clear all nostalgic OSD for clean viewing.
      screen.classList.add('osd-fade-pending');
      setTimeout(()=>screen.classList.remove('osd-fade-pending'),650);
      scheduleHide();
    });
    video.addEventListener('pause',()=>{
      clearTimeout(controlTimer);
      screen.classList.add('controls-open');
    });
    video.addEventListener('ended',()=>screen.classList.add('controls-open'));

    // Screen filter control on the physical TV panel.
    if(panel&&!q('#tvFilterButton')){
      const wrap=document.createElement('div');
      wrap.className='tv-filter-control';
      wrap.innerHTML='<span>PICTURE</span><button id="tvFilterButton" type="button" aria-label="Cycle picture filter"><b>FILTER</b><em id="tvFilterValue">OFF</em></button>';
      panel.appendChild(wrap);
      q('#tvFilterButton').onclick=e=>{
        e.stopPropagation();
        filterIndex=(filterIndex+1)%FILTERS.length;
        applyFilter();
      };
    }

    if(!q('#crtFilterToast')){
      const toast=document.createElement('div');
      toast.id='crtFilterToast';
      toast.className='crt-filter-toast';
      screen.appendChild(toast);
    }

    function applyFilter(){
      const f=FILTERS[filterIndex];
      FILTERS.forEach(x=>screen.classList.remove(`filter-${x.id}`));
      screen.classList.add(`filter-${f.id}`);
      const val=q('#tvFilterValue');if(val) val.textContent=f.label;
      const toast=q('#crtFilterToast');
      if(toast){
        toast.textContent=`PICTURE: ${f.label}`;
        toast.classList.remove('show');
        requestAnimationFrame(()=>toast.classList.add('show'));
        setTimeout(()=>toast.classList.remove('show'),1250);
      }
    }

    // Channel is the tape's actual position in the archive: first tape = CH 01.
    const syncChannel=()=>{
      const tapes=qa('.vhs-spine[data-tape-id]');
      const selected=tapes.findIndex(t=>t.classList.contains('selected'));
      const channel=selected>=0?selected+1:1;
      const text=`CH ${String(channel).padStart(2,'0')}`;
      const osd=q('#crtChannel'); if(osd) osd.textContent=text;
      const remote=q('#remoteChannel'); if(remote) remote.textContent=String(channel).padStart(2,'0');
    };
    const tapeObserver=new MutationObserver(syncChannel);
    qa('.vhs-spine[data-tape-id]').forEach(t=>tapeObserver.observe(t,{attributes:true,attributeFilter:['class']}));
    syncChannel();

    // Make VCR face closer to a classic late-90s deck while remaining unbranded.
    if(vcr&&!vcr.classList.contains('vcr-reference')){
      vcr.classList.add('vcr-reference');
      const power=document.createElement('button');
      power.type='button';power.className='vcr-power';power.id='vcrPower';power.setAttribute('aria-label','VCR power');power.innerHTML='<span>POWER</span><i></i>';
      vcr.prepend(power);

      const av=document.createElement('div');
      av.className='vcr-av';
      av.innerHTML='<span>AV</span><i></i><i></i><i></i>';
      vcr.appendChild(av);

      const slot=q('.vcr-slot');
      if(slot&&!slot.querySelector('.vcr-slot-lip')) slot.innerHTML='<span class="vcr-slot-lip"></span>';

      power.onclick=()=>{
        const off=vcr.classList.toggle('vcr-off');
        power.classList.toggle('active',!off);
        if(off){video.pause();const d=q('#vcrDisplay');if(d)d.textContent='--:--'}
        else{const d=q('#vcrDisplay');if(d&&!video.currentSrc)d.textContent='12:00'}
      };
    }

    // Physical VCR action buttons should always wake on-screen OSD/control feedback.
    ['#vcrPlay','#vcrPause','#vcrStop','#vcrEject','#vcrRew','#vcrFf'].forEach(sel=>{
      q(sel)?.addEventListener('click',()=>{
        if(sel==='#vcrPlay') screen.classList.remove('controls-open');
        else screen.classList.add('controls-open');
      });
    });
  }

  renderVideos=function(){
    baseRenderVideos();
    requestAnimationFrame(()=>requestAnimationFrame(installPolish));
  };
})();
