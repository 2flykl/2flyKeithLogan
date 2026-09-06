// 2FLY CRT interaction polish: modern usability inside the physical VHS presentation.
(function(){
  if(typeof renderVideos!=='function') return;
  const baseRenderVideos=renderVideos;
  let theater=false;
  let hudObserver=null;

  function q(s){return document.querySelector(s)}
  function fmt(seconds){
    seconds=Math.floor(Number(seconds)||0);
    return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
  }

  function installControls(){
    const screen=q('#crtScreen'), video=q('#vhsVideo'), hud=q('#vhsHud');
    if(!screen||!video||screen.querySelector('.crt-user-controls')) return;

    screen.insertAdjacentHTML('beforeend',`
      <div class="crt-tap-play" id="crtTapPlay" aria-hidden="true">▶</div>
      <div class="crt-user-controls" id="crtUserControls" aria-label="Video controls">
        <button class="crt-control-play" id="crtControlPlay" type="button" aria-label="Play video">▶</button>
        <div class="crt-progress-wrap"><input id="crtProgress" type="range" min="0" max="1000" value="0" aria-label="Video progress"></div>
        <span class="crt-control-time" id="crtControlTime">0:00 / 0:00</span>
        <button id="crtControlMute" type="button" aria-label="Mute video">VOL</button>
        <button id="crtControlChapters" type="button" aria-label="Show chapters">CH</button>
        <button id="crtControlTheater" type="button" aria-label="Expand theater mode">▣</button>
        <button id="crtControlFullscreen" type="button" aria-label="Full screen">⛶</button>
      </div>
      <div class="crt-chapter-popover" id="crtChapterPopover" aria-label="Chapters"></div>
    `);

    if(!q('#vhsTheaterBackdrop')){
      const backdrop=document.createElement('button');
      backdrop.type='button';
      backdrop.id='vhsTheaterBackdrop';
      backdrop.className='vhs-theater-backdrop';
      backdrop.setAttribute('aria-label','Exit theater mode');
      document.body.appendChild(backdrop);
      backdrop.onclick=()=>setTheater(false);
    }

    const playBtn=q('#crtControlPlay'), centerPlay=q('#crtTapPlay'), progress=q('#crtProgress');
    const mute=q('#crtControlMute'), chapters=q('#crtControlChapters');
    const theaterBtn=q('#crtControlTheater'), fullscreen=q('#crtControlFullscreen');

    function hasVideo(){return Boolean(video.currentSrc||video.getAttribute('src'))}
    function togglePlay(){
      if(!hasVideo()) return;
      if(video.paused){
        const physical=q('#vcrPlay');
        if(physical) physical.click(); else video.play().catch(()=>{});
      }else{
        const physical=q('#vcrPause');
        if(physical) physical.click(); else video.pause();
      }
    }
    playBtn.onclick=e=>{e.stopPropagation();togglePlay()};
    centerPlay.onclick=e=>{e.stopPropagation();togglePlay()};
    screen.addEventListener('click',e=>{
      if(e.target.closest('button,input,.crt-chapter-popover')) return;
      if(hasVideo()) togglePlay();
    });

    video.addEventListener('play',()=>{
      playBtn.textContent='Ⅱ'; playBtn.setAttribute('aria-label','Pause video');
      centerPlay.textContent='Ⅱ'; screen.classList.add('user-playing');
    });
    video.addEventListener('pause',()=>{
      playBtn.textContent='▶'; playBtn.setAttribute('aria-label','Play video');
      centerPlay.textContent='▶'; screen.classList.remove('user-playing');
    });
    video.addEventListener('timeupdate',()=>{
      const duration=Number.isFinite(video.duration)?video.duration:0;
      progress.value=duration?Math.round(video.currentTime/duration*1000):0;
      q('#crtControlTime').textContent=`${fmt(video.currentTime)} / ${fmt(duration)}`;
    });
    video.addEventListener('loadedmetadata',()=>{
      q('#crtControlTime').textContent=`${fmt(video.currentTime)} / ${fmt(video.duration)}`;
      rebuildChapters();
    });
    progress.oninput=e=>{
      if(Number.isFinite(video.duration)&&video.duration>0) video.currentTime=(+e.target.value/1000)*video.duration;
    };
    mute.onclick=e=>{
      e.stopPropagation(); video.muted=!video.muted;
      mute.textContent=video.muted?'MUTE':'VOL';
      mute.classList.toggle('active',video.muted);
    };
    chapters.onclick=e=>{
      e.stopPropagation(); rebuildChapters();
      q('#crtChapterPopover').classList.toggle('open');
      chapters.classList.toggle('active',q('#crtChapterPopover').classList.contains('open'));
    };
    theaterBtn.onclick=e=>{e.stopPropagation();setTheater(!theater)};
    fullscreen.onclick=async e=>{
      e.stopPropagation();
      try{
        video.controls=true;
        await video.requestFullscreen?.();
      }catch{}
    };
    document.addEventListener('fullscreenchange',()=>{
      if(document.fullscreenElement!==video) video.controls=false;
    });

    function rebuildChapters(){
      const pop=q('#crtChapterPopover'); if(!pop) return;
      const source=[...document.querySelectorAll('#vhsHud .chapter-btn')];
      if(!source.length){
        pop.innerHTML='<div class="crt-no-chapters">NO CHAPTER MENU</div>';
        chapters.disabled=true;
        return;
      }
      chapters.disabled=false;
      pop.innerHTML=source.map((b,i)=>`<button type="button" data-crt-chapter="${i}" class="${b.classList.contains('active')?'active':''}">${b.textContent.replace('▶','').trim()}</button>`).join('');
      pop.querySelectorAll('[data-crt-chapter]').forEach((b,i)=>b.onclick=e=>{
        e.stopPropagation();
        const actual=[...document.querySelectorAll('#vhsHud .chapter-btn')][i];
        actual?.click(); pop.classList.remove('open'); chapters.classList.remove('active');
      });
    }

    if(hud){
      hudObserver?.disconnect();
      hudObserver=new MutationObserver(()=>rebuildChapters());
      hudObserver.observe(hud,{childList:true,subtree:true,attributes:true});
    }
    rebuildChapters();
  }

  function setTheater(on){
    theater=Boolean(on);
    document.body.classList.toggle('vhs-theater-mode',theater);
    const btn=q('#crtControlTheater');
    if(btn){btn.textContent=theater?'▣':'▣';btn.classList.toggle('active',theater);btn.setAttribute('aria-label',theater?'Exit theater mode':'Expand theater mode')}
    const pop=q('#crtChapterPopover'); if(!theater) pop?.classList.remove('open');
  }

  renderVideos=function(){
    setTheater(false);
    baseRenderVideos();
    requestAnimationFrame(()=>installControls());
  };

  window.addEventListener('hashchange',()=>{if(location.hash!=='#videos')setTheater(false)});
  document.addEventListener('keydown',e=>{
    if(!document.body.classList.contains('vhs-theater-mode')) return;
    if(e.key==='Escape'&&!document.fullscreenElement) setTheater(false);
  });
})();
