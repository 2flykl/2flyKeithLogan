// 2FLY Music V2 — 2000s home stereo + interactive CD binder archive.
// Loaded after site-specialty.js so this renderer replaces only the Music route.
(function(){
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

  renderMusic=function(){
    app.musicArchiveIndex=Math.max(0,Math.min(app.musicArchiveIndex||0,archive.length-1));
    app.musicArchivePage=Math.max(0,app.musicArchivePage||0);
    const pageSize=4;
    const pageCount=Math.ceil(archive.length/pageSize);
    if(app.musicArchivePage>=pageCount)app.musicArchivePage=pageCount-1;

    $('#appView').innerHTML=`<section class="music-v2-page">
      <div class="music-v2-stage">
        <div class="music-v2-copy" aria-hidden="true"><h1>MUSIC</h1><p>COLLECT.<br>EXPLORE.<br>PRESS PLAY.</p><em>MUSIC LIVES HERE.</em></div>

        <div class="music-v2-main">
          <div class="stereo-hero" aria-label="2000s home stereo display">
            <div class="tower-speaker tower-left" aria-hidden="true"><i class="speaker-tweeter"></i><i class="speaker-mid"></i><i class="speaker-sub"></i></div>
            <div class="stereo-deck" aria-hidden="true">
              <div class="stereo-lid"></div>
              <div class="stereo-display"><span>DISC <b id="stereoDiscNo">01</b></span><span>TRACK 01</span><div class="stereo-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><strong>00:00</strong></div>
              <div class="stereo-controls"><button tabindex="-1">◀◀</button><i class="stereo-knob"></i><button tabindex="-1">▶▶</button></div>
              <div class="stereo-slot"></div><small>2FLY · MUSIC LIVES HERE</small>
            </div>
            <div class="tower-speaker tower-right" aria-hidden="true"><i class="speaker-tweeter"></i><i class="speaker-mid"></i><i class="speaker-sub"></i></div>
          </div>

          <div class="music-prop-layer" aria-hidden="true">
            <div class="cd-spindle"><span class="spindle-stack"></span><i></i></div>
            <div class="jewel-prop-stack"><span></span><span></span><span></span><span></span></div>
          </div>

          <div class="cd-binder-zone">
            <button class="binder-arrow binder-arrow-left" id="musicBinderPrev" type="button" aria-label="Previous CD binder page">‹</button>
            <div class="cd-binder-book">
              <div class="binder-topline"><span>2FLY DISC ARCHIVE</span><strong id="musicBinderPage"></strong><span>SELECT COVER OR DISC</span></div>
              <div class="binder-rings" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
              <div class="music-pocket-grid" id="musicPocketGrid"></div>
            </div>
            <button class="binder-arrow binder-arrow-right" id="musicBinderNext" type="button" aria-label="Next CD binder page">›</button>
          </div>
        </div>

        <aside class="music-user-hud" id="musicUserHud" aria-live="polite"></aside>
      </div>
    </section>`;

    const drawBinder=()=>{
      const start=app.musicArchivePage*pageSize;
      const items=archive.slice(start,start+pageSize);
      $('#musicBinderPage').textContent=`PAGE ${String(app.musicArchivePage+1).padStart(2,'0')} / ${String(pageCount).padStart(2,'0')}`;
      $('#musicPocketGrid').innerHTML=items.map((album,localIndex)=>{
        const index=start+localIndex;
        const selected=index===app.musicArchiveIndex?' selected':'';
        const cover=archiveAsset(album.cover);
        return `<article class="music-pocket-pair${selected}" data-album-pair="${index}">
          <button class="music-cover-pocket" data-album-index="${index}" type="button" aria-label="Select ${esc(album.title)} artwork insert">
            <span class="pocket-plastic"></span><img src="${cover}" alt="${esc(album.title)} original artwork"><small>ARTWORK INSERT</small>
          </button>
          <button class="music-disc-pocket" data-album-index="${index}" type="button" aria-label="Select ${esc(album.title)} compact disc">
            <span class="pocket-plastic"></span><span class="printed-disc"><img src="${cover}" alt=""><i></i></span><small>MATCHING COMPACT DISC</small>
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
      app.musicArchivePage=next;
      const first=app.musicArchivePage*pageSize;
      app.musicArchiveIndex=first;
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
    $('#stereoDiscNo') && ($('#stereoDiscNo').textContent=String((app.musicArchiveIndex||0)+1).padStart(2,'0'));
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