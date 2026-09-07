// 2FLY Music V2 — premium layered physical-media scene.
// Option 2 uses the supplied real stereo / speaker / binder / table artwork.
(function(){
  const premium={
    speakerLeft:asset('assets/music-premium-v2/speaker-left-base.webp'),
    speakerRight:asset('assets/music-premium-v2/speaker-right-base.webp'),
    stereo:asset('assets/music-premium-v2/stereo-base.webp'),
    binder:asset('assets/music-premium-v2/binder-base.webp'),
    table:asset('assets/music-premium-v2/table.webp')
  };

  const archive=[
    {id:'merriest-christmas',title:'Aye I Wish You The Merriest Christmas',year:'ARCHIVE',cover:'assets/music-archive/aye-i-wish-you-the-merriest-christmas.jpg',description:'An earlier 2FLY holiday project returning as part of the physical-media archive.',tracks:['ARCHIVE PROJECT','AUDIO TO BE ADDED','RE-RELEASE EDITION']},
    {id:'bbl',title:'BBL',year:'ARCHIVE',cover:'assets/music-archive/bbl.jpg',description:'An early 2FLY project preserved in its original visual identity and brought back into the official catalog.',tracks:['ARCHIVE PROJECT','AUDIO TO BE ADDED','RE-RELEASE EDITION']},
    {id:'better-late-than-never',title:'Better Late Than Never',year:'2007',cover:'assets/music-archive/better-late-than-never.jpg',description:'An older project returning to the catalog. The original artwork stays at the center of the physical-CD presentation.',tracks:['BETTER LATE THAN NEVER','ARCHIVE PROJECT','AUDIO TO BE ADDED']},
    {id:'youngstown-pride',title:'The Youngstown Pride',year:'ARCHIVE',cover:'assets/music-archive/the-youngstown-pride.jpg',description:'A hometown-centered release from the earlier catalog, preserved as part of the 2FLY discography.',tracks:['THE YOUNGSTOWN PRIDE','ARCHIVE PROJECT','AUDIO TO BE ADDED']},
    {id:'flyzone-album',title:'Flyzone',year:'ARCHIVE',cover:'assets/music-archive/flyzone.jpg',description:'A bold older project restored to the binder as a selectable artwork insert and matching printed compact disc.',tracks:['FLYZONE','ARCHIVE PROJECT','AUDIO TO BE ADDED']},
    {id:'ghetto-gumbo',title:'Ghetto Gumbo',year:'ARCHIVE',cover:'assets/music-archive/ghetto-gumbo.jpg',description:'A classic We Famous Entertainment-era project presented without redesigning the original cover artwork.',tracks:['GHETTO GUMBO','WE FAMOUS ENTERTAINMENT','AUDIO TO BE ADDED']},
    {id:'my-city-crazy',title:'My City Crazy',year:'ARCHIVE',cover:'assets/music-archive/my-city-crazy.jpg',description:'A city-focused archive release displayed as physical media inside the interactive 2FLY binder.',tracks:['MY CITY CRAZY','ARCHIVE PROJECT','AUDIO TO BE ADDED']},
    {id:'ohydro',title:'Ohydro',year:'ARCHIVE',cover:'assets/music-archive/ohydro.jpg',description:'An older catalog project brought forward as part of the complete 2FLY physical-media archive.',tracks:['OHYDRO','ARCHIVE PROJECT','AUDIO TO BE ADDED']},
    {id:'please-believe-it',title:'Please Believe It!',year:'ARCHIVE',cover:'assets/music-archive/please-believe-it.jpg',description:'A legacy release returning to the catalog with its original visual identity intact.',tracks:['PLEASE BELIEVE IT!','ARCHIVE PROJECT','AUDIO TO BE ADDED']}
  ];

  function archiveAsset(path){return asset(path)}
  function currentAlbum(){return archive[app.musicArchiveIndex||0]||archive[0]}
  function imageFallback(event){
    const target=event.currentTarget;
    (target.closest('.premium-asset')||target.closest('.premium-binder-wrap')||target.closest('.premium-room'))?.classList.add('asset-missing');
  }
  function discMarkup(album,cover){
    if(album.year==='ARCHIVE'){
      return `<span class="printed-disc sharpie-cdr"><span class="sharpie-title">${esc(album.title)}</span><span class="sharpie-mark">2FLY ARCHIVE</span><i></i></span>`;
    }
    return `<span class="printed-disc album-disc"><img src="${cover}" alt=""><i></i></span>`;
  }

  renderMusic=function(){
    app.musicArchiveIndex=Math.max(0,Math.min(app.musicArchiveIndex||0,archive.length-1));
    app.musicArchivePage=Math.max(0,app.musicArchivePage||0);
    const pageSize=4;
    const pageCount=Math.ceil(archive.length/pageSize);
    if(app.musicArchivePage>=pageCount)app.musicArchivePage=pageCount-1;

    $('#appView').innerHTML=`<section class="music-v2-page premium-music-option-2">
      <div class="music-v2-stage">
        <div class="music-v2-copy"><h1>MUSIC</h1><p>COLLECT.<br>EXPLORE.<br>PRESS PLAY.</p><em>MUSIC LIVES HERE.</em></div>

        <div class="music-v2-main">
          <div class="premium-room">
            <div class="premium-scene-light" aria-hidden="true"></div>
            <img class="premium-table-asset" src="${premium.table}" alt="" aria-hidden="true">

            <div class="premium-hifi-scene" aria-label="2FLY premium home stereo">
              <div class="premium-asset premium-speaker premium-speaker-left">
                <span class="premium-shadow speaker-shadow"></span>
                <img class="speaker-base" src="${premium.speakerLeft}" alt="" aria-hidden="true">
                <span class="speaker-glow speaker-glow-a"></span><span class="speaker-glow speaker-glow-b"></span>
                <span class="speaker-led-live"></span>
              </div>

              <div class="premium-asset premium-stereo-wrap">
                <span class="premium-shadow stereo-shadow"></span>
                <img class="stereo-base" src="${premium.stereo}" alt="" aria-hidden="true">
                <span class="stereo-glow-layer"></span>
                <div class="stereo-screen-ui">
                  <div class="stereo-screen-top"><span>DISC <b id="stereoDiscNo">01</b></span><span id="stereoSource">CD ARCHIVE</span></div>
                  <strong id="stereoNowTitle">${esc(currentAlbum().title)}</strong>
                  <div class="stereo-bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
                  <div class="stereo-screen-status"><span>RE-RELEASE</span><b>00:00</b></div>
                </div>
                <span class="volume-ring-live" aria-hidden="true"></span>
              </div>

              <div class="premium-asset premium-speaker premium-speaker-right">
                <span class="premium-shadow speaker-shadow"></span>
                <img class="speaker-base" src="${premium.speakerRight}" style="transform:none" alt="" aria-hidden="true">
                <span class="speaker-glow speaker-glow-a"></span><span class="speaker-glow speaker-glow-b"></span>
                <span class="speaker-led-live"></span>
              </div>
            </div>
          </div>

          <div class="music-prop-layer" aria-hidden="true">
            <div class="cd-spindle"><span class="spindle-stack"></span><i></i></div>
            <div class="jewel-prop-stack"><span></span><span></span><span></span><span></span></div>
          </div>

          <div class="cd-binder-zone">
            <button class="binder-arrow binder-arrow-left" id="musicBinderPrev" type="button" aria-label="Previous CD binder page">‹</button>
            <div class="premium-binder-wrap" id="premiumBinderWrap">
              <span class="binder-shadow-pass" aria-hidden="true"></span>
              <img class="binder-base-asset" src="${premium.binder}" alt="" aria-hidden="true">
              <div class="cd-binder-book">
                <div class="binder-topline"><span>2FLY DISC ARCHIVE</span><strong id="musicBinderPage"></strong><span>SELECT COVER OR DISC</span></div>
                <div class="music-pocket-grid" id="musicPocketGrid"></div>
              </div>
              <span class="binder-crease-overlay" aria-hidden="true"></span>
              <span class="binder-glare-overlay" aria-hidden="true"></span>
              <span class="binder-pageflip-shadow" aria-hidden="true"></span>
            </div>
            <button class="binder-arrow binder-arrow-right" id="musicBinderNext" type="button" aria-label="Next CD binder page">›</button>
          </div>
        </div>

        <aside class="music-user-hud" id="musicUserHud" aria-live="polite"></aside>
      </div>
    </section>`;

    $$('.premium-music-option-2 img').forEach(img=>img.addEventListener('error',imageFallback,{once:true}));

    const drawBinder=()=>{
      const start=app.musicArchivePage*pageSize;
      const items=archive.slice(start,start+pageSize);
      $('#musicBinderPage').textContent=`PAGE ${String(app.musicArchivePage+1).padStart(2,'0')} / ${String(pageCount).padStart(2,'0')}`;
      $('#musicPocketGrid').innerHTML=items.map((album,localIndex)=>{
        const index=start+localIndex;
        const selected=index===app.musicArchiveIndex?' selected':'';
        const cover=archiveAsset(album.cover);
        const archiveDisc=album.year==='ARCHIVE';
        return `<article class="music-pocket-pair${selected}" data-album-pair="${index}">
          <button class="music-cover-pocket" data-album-index="${index}" type="button" aria-label="Select ${esc(album.title)} artwork insert">
            <img src="${cover}" alt="${esc(album.title)} original artwork"><span class="pocket-plastic"></span><small>ARTWORK INSERT</small>
          </button>
          <button class="music-disc-pocket" data-album-index="${index}" type="button" aria-label="Select ${esc(album.title)} compact disc">
            ${discMarkup(album,cover)}<span class="pocket-plastic"></span><small>${archiveDisc?'ARCHIVE CD-R':'MATCHING COMPACT DISC'}</small>
          </button>
        </article>`
      }).join('');
      $$('#musicPocketGrid [data-album-index]').forEach(button=>button.onclick=()=>selectMusicArchive(+button.dataset.albumIndex));
      $('#musicBinderPrev').disabled=app.musicArchivePage===0;
      $('#musicBinderNext').disabled=app.musicArchivePage===pageCount-1;
    };

    const flip=dir=>{
      const next=Math.max(0,Math.min(pageCount-1,app.musicArchivePage+dir));
      if(next===app.musicArchivePage)return;
      const wrap=$('#premiumBinderWrap');
      wrap?.classList.add(dir>0?'flip-next':'flip-prev');
      setTimeout(()=>wrap?.classList.remove('flip-next','flip-prev'),430);
      app.musicArchivePage=next;
      app.musicArchiveIndex=app.musicArchivePage*pageSize;
      drawBinder();
      drawMusicHud();
    };
    $('#musicBinderPrev').onclick=()=>flip(-1);
    $('#musicBinderNext').onclick=()=>flip(1);
    drawBinder();
    drawMusicHud();
  };

  window.selectMusicArchive=function(index){
    if(!archive[index])return;
    app.musicArchiveIndex=index;
    app.musicArchivePage=Math.floor(index/4);
    $$('.music-pocket-pair').forEach(pair=>pair.classList.toggle('selected',+pair.dataset.albumPair===index));
    drawMusicHud();
  };

  function drawMusicHud(){
    const album=currentAlbum();
    if(!album||!$('#musicUserHud'))return;
    const cover=archiveAsset(album.cover);
    if($('#stereoDiscNo'))$('#stereoDiscNo').textContent=String((app.musicArchiveIndex||0)+1).padStart(2,'0');
    if($('#stereoNowTitle'))$('#stereoNowTitle').textContent=album.title;
    $('#musicUserHud').innerHTML=`
      <div class="music-hud-label">SELECTED DISC</div>
      <div class="music-hud-cover"><img src="${cover}" alt="${esc(album.title)} artwork"></div>
      <h2>${esc(album.title)}</h2>
      <div class="music-hud-meta"><span>${esc(album.year)}</span><b>·</b><span>2FLY KEITH LOGAN</span></div>
      <p>${esc(album.description)}</p>
      <div class="music-release-status">RE-RELEASE DATE<br>COMING SOON</div>
      <div class="music-catalog-label">CATALOG / DISCOGRAPHY</div>
      <ol class="music-hud-tracklist">${album.tracks.map((track,i)=>`<li><b>${String(i+1).padStart(2,'0')}</b><span>${esc(track)}</span></li>`).join('')}</ol>
      <button class="music-audio-pending" type="button" disabled>AUDIO COMING SOON</button>
      <small class="music-hud-note">Original artwork is preserved. Audio and final track data will be attached to these archive entries later.</small>`;
  }
})();