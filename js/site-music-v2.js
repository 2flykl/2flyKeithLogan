// 2FLY Music Live Room — Astra playback integration for the production shell.
(function(){
  // Load the production integration CSS without adding another blocking stylesheet to the page shell.
  if(!document.querySelector('link[data-music-live-css]')){
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='../css/site-music-live.css?v=1.0.0';
    link.dataset.musicLiveCss='true';
    document.head.appendChild(link);
  }
  // Music is one canonical destination now; remove the old prototype/options dropdown.
  const oldMusicMenu=document.querySelector('.music-nav-dropdown');
  if(oldMusicMenu){
    const musicLink=document.createElement('a');
    musicLink.href='#music';
    musicLink.dataset.route='music';
    musicLink.textContent='MUSIC';
    oldMusicMenu.replaceWith(musicLink);
  }

  const MUSIC_IDS=['fire','streams','africa','away','gettin'];
  let roomIndex=0;
  let transportPatched=false;
  let originalPrev=null;
  let originalNext=null;
  let audioBound=false;

  const musicProjects=()=>MUSIC_IDS.map(id=>(app.projects||[]).find(p=>p.id===id)).filter(Boolean);
  const clampIndex=i=>{
    const list=musicProjects();
    if(!list.length)return 0;
    return (i+list.length)%list.length;
  };
  const current=()=>musicProjects()[clampIndex(roomIndex)]||null;
  const coverOf=p=>p?asset(p.cover):'';
  const audioEl=()=>$('#globalAudio');

  function syncGlobalPlayer(project){
    if(!project)return;
    const cover=$('#playerCover');
    const title=$('#playerTitle');
    if(cover){cover.src=coverOf(project);cover.alt=`${project.title} cover artwork`;}
    if(title)title.textContent=project.title;
    try{sessionStorage.setItem('2fly-music-room-id',project.id);}catch{}
  }

  function loadRoomAudio(project,autoplay=true){
    const a=audioEl();
    if(!a||!project?.audio)return;
    const absolute=new URL(project.audio,location.href).href;
    if(a.src!==absolute){a.src=project.audio;a.load();}
    syncGlobalPlayer(project);
    updateRoomHud();
    if(autoplay){a.play().catch(()=>{});}
  }

  function playSelected(){
    const project=current();
    const a=audioEl();
    if(!project||!a)return;
    const absolute=new URL(project.audio,location.href).href;
    if(a.src!==absolute){loadRoomAudio(project,true);return;}
    if(a.paused)a.play().catch(()=>{});else a.pause();
  }

  function selectRoom(index,autoplay=false){
    const list=musicProjects();
    if(!list.length)return;
    roomIndex=clampIndex(index);
    app.musicArchiveIndex=roomIndex;
    app.musicArchivePage=0;
    drawBinder();
    updateRoomHud();
    if(autoplay)loadRoomAudio(current(),true);
  }

  function stepRoom(delta,autoplay=true){selectRoom(roomIndex+delta,autoplay);}

  function patchGlobalTransport(){
    const prev=$('#playerPrev'),next=$('#playerNext');
    if(!prev||!next||transportPatched)return;
    originalPrev=prev.onclick;
    originalNext=next.onclick;
    prev.onclick=e=>{if(app.route==='music'){e?.preventDefault();stepRoom(-1,true);}else originalPrev?.call(prev,e);};
    next.onclick=e=>{if(app.route==='music'){e?.preventDefault();stepRoom(1,true);}else originalNext?.call(next,e);};
    transportPatched=true;
  }

  function bindAudioState(){
    const a=audioEl();
    if(!a||audioBound)return;
    const sync=()=>updatePlaybackState();
    ['play','pause','loadedmetadata','timeupdate','ended','durationchange'].forEach(evt=>a.addEventListener(evt,sync));
    a.addEventListener('ended',()=>{if(app.route==='music')stepRoom(1,true);});
    audioBound=true;
  }

  function drawBinder(){
    const strip=$('#musicBinderStrip');
    const page=$('#musicBinderPage');
    if(!strip)return;
    const list=musicProjects();
    if(page)page.textContent='THE CURRENT 2FLY CATALOG · 05 DISCS';
    strip.innerHTML=list.map((album,index)=>`<button class="music-v3-disc-card${index===roomIndex?' selected':''}" type="button" data-music-disc="${index}" aria-label="Select ${esc(album.title)}">
      <img src="${coverOf(album)}" alt="${esc(album.title)} artwork">
      <span>${esc(album.title)}</span>
    </button>`).join('');
    $$('#musicBinderStrip [data-music-disc]').forEach(btn=>btn.onclick=()=>selectRoom(+btn.dataset.musicDisc,false));
  }

  function updatePlaybackState(){
    const project=current();
    const a=audioEl();
    const page=$('.music-v3-page');
    if(!project||!a||!page)return;
    const active=new URL(project.audio,location.href).href===a.src;
    page.classList.toggle('is-playing',active&&!a.paused);
    const play=$('#musicRoomPlay');
    if(play)play.textContent=active&&!a.paused?'❚❚':'▶';
    const progress=$('#musicRoomSeek');
    if(progress&&active){progress.value=Number.isFinite(a.duration)&&a.duration>0?(a.currentTime/a.duration)*100:0;}
    const clock=$('#musicRoomClock');
    if(clock)clock.textContent=active?`${time(a.currentTime)} / ${time(a.duration)}`:'0:00 / 0:00';
    const screenTime=$('#musicStereoTime');
    if(screenTime)screenTime.textContent=active?`${time(a.currentTime)} · ${a.paused?'PAUSED':'PLAYING'}`:'READY · PRESS PLAY';
  }

  function updateRoomHud(){
    const album=current();
    const hud=$('#musicUserHud');
    if(!album||!hud)return;
    const stereo=$('#stereoNowTitle');
    if(stereo)stereo.textContent=album.title;
    const top=$('.music-v3-stereo-screen span');
    if(top)top.textContent=`DISC ${String(roomIndex+1).padStart(2,'0')} · 2FLY MUSIC`;
    $$('#musicBinderStrip [data-music-disc]').forEach(btn=>btn.classList.toggle('selected',+btn.dataset.musicDisc===roomIndex));
    hud.innerHTML=`
      <div class="music-v3-hud-label">NOW IN THE CHANGER</div>
      <div class="music-v3-hud-cover"><img src="${coverOf(album)}" alt="${esc(album.title)} artwork"></div>
      <div class="music-v3-hud-copy">
        <small>${esc((album.word||'2FLY MUSIC').toUpperCase())} · 2FLY KEITH LOGAN</small>
        <h2>${esc(album.title)}</h2>
        <p>${esc(album.description||album.subtitle||'')}</p>
      </div>
      <div class="music-room-remote" aria-label="Music controls">
        <div class="music-room-remote-head"><span>2FLY REMOTE</span><b>CD ${String(roomIndex+1).padStart(2,'0')}</b></div>
        <div class="music-room-transport">
          <button id="musicRoomPrev" type="button" aria-label="Previous disc">⏮</button>
          <button class="music-room-play" id="musicRoomPlay" type="button" aria-label="Play or pause">▶</button>
          <button id="musicRoomNext" type="button" aria-label="Next disc">⏭</button>
        </div>
        <input id="musicRoomSeek" class="music-room-seek" type="range" min="0" max="100" value="0" aria-label="Track progress">
        <div class="music-room-clock" id="musicRoomClock">0:00 / 0:00</div>
        <div class="music-room-volume"><span>VOL</span><input id="musicRoomVolume" type="range" min="0" max="1" step=".01" value="${audioEl()?.volume ?? .75}" aria-label="Volume"></div>
      </div>
      <button class="music-v3-explore" id="musicExploreDisc" type="button"><span>PLAY THIS DISC</span><b>▶</b></button>`;

    $('#musicRoomPrev').onclick=()=>stepRoom(-1,true);
    $('#musicRoomNext').onclick=()=>stepRoom(1,true);
    $('#musicRoomPlay').onclick=playSelected;
    $('#musicExploreDisc').onclick=()=>loadRoomAudio(album,true);
    $('#musicRoomSeek').oninput=e=>{
      const a=audioEl();
      if(!a)return;
      const active=new URL(album.audio,location.href).href===a.src;
      if(!active){loadRoomAudio(album,false);}
      if(Number.isFinite(a.duration)&&a.duration>0)a.currentTime=(+e.target.value/100)*a.duration;
    };
    $('#musicRoomVolume').oninput=e=>{
      const a=audioEl(); if(!a)return;
      a.volume=+e.target.value;
      const globalVol=$('#playerVolume');if(globalVol)globalVol.value=a.volume;
    };
    updatePlaybackState();
  }

  renderMusic=function(){
    const list=musicProjects();
    if(!list.length){$('#appView').innerHTML='<section class="music-v3-page"><p class="empty">Music catalog is loading.</p></section>';return;}
    let saved='';try{saved=sessionStorage.getItem('2fly-music-room-id')||'';}catch{}
    const savedIndex=list.findIndex(p=>p.id===saved);
    roomIndex=savedIndex>=0?savedIndex:Math.max(0,Math.min(app.musicArchiveIndex||0,list.length-1));

    $('#appView').innerHTML=`<section class="music-v3-page premium-music-option-2 music-live-room">
      <div class="music-v3-stage">
        <aside class="music-v3-copy">
          <div class="music-room-kicker">THE 2FLY SOUND ARCHIVE</div>
          <h1>MUSIC</h1>
          <p>SELECT.<br>LISTEN.<br>STAY AWHILE.</p>
          <em>MUSIC<br>LIVES<br>HERE.</em>
          <small class="music-room-note">Five current projects. One physical listening room. No algorithm deciding what plays next.</small>
        </aside>

        <div class="music-v3-scene" id="musicScene">
          <div class="music-v3-dotfield" aria-hidden="true"></div>
          <div class="music-v3-motif vinyl-a" aria-hidden="true"></div>
          <div class="music-v3-motif vinyl-b" aria-hidden="true"></div>
          <div class="music-v3-motif cassette" aria-hidden="true"><i></i><i></i></div>
          <div class="music-v3-motif note" aria-hidden="true">♪</div>
          <div class="music-v3-table" aria-hidden="true"></div>
          <div class="music-v3-speaker music-v3-speaker-left" aria-hidden="true"></div>
          <div class="music-v3-speaker music-v3-speaker-right" aria-hidden="true"></div>
          <div class="music-v3-stereo-glow" aria-hidden="true"></div>
          <div class="music-v3-stereo" aria-label="2FLY stereo"></div>
          <div class="music-v3-stereo-screen" aria-live="polite">
            <span>DISC 01 · 2FLY MUSIC</span>
            <strong id="stereoNowTitle"></strong>
            <div class="music-v3-eq" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
            <small id="musicStereoTime">READY · PRESS PLAY</small>
          </div>
          <div class="music-v3-archive-head"><span>2FLY CD BINDER</span><b id="musicBinderPage"></b><span>CHOOSE A COVER</span></div>
          <div class="music-v3-binder-strip" id="musicBinderStrip" aria-label="Choose a 2Fly release"></div>
        </div>

        <aside class="music-v3-hud" id="musicUserHud" aria-live="polite"></aside>
      </div>
    </section>`;

    patchGlobalTransport();
    bindAudioState();
    drawBinder();
    updateRoomHud();
  };
})();
