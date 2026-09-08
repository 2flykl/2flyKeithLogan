// 2FLY Music Option 2 — approved physical-media scene + live archive UI.
(function(){
  const archive=[
    {id:'merriest-christmas',title:'Aye I Wish You The Merriest Christmas',year:'ARCHIVE',cover:'assets/music-archive/aye-i-wish-you-the-merriest-christmas.jpg',description:'An earlier 2FLY holiday project returning as part of the physical-media archive.'},
    {id:'bbl',title:'BBL',year:'ARCHIVE',cover:'assets/music-archive/bbl.jpg',description:'An early 2FLY project preserved in its original visual identity and brought back into the official catalog.'},
    {id:'better-late-than-never',title:'Better Late Than Never',year:'2007',cover:'assets/music-archive/better-late-than-never.jpg',description:'An older project returning to the catalog with its original artwork preserved.'},
    {id:'youngstown-pride',title:'The Youngstown Pride',year:'ARCHIVE',cover:'assets/music-archive/the-youngstown-pride.jpg',description:'A hometown-centered release from the earlier catalog, preserved as part of the 2FLY discography.'},
    {id:'flyzone-album',title:'Flyzone',year:'ARCHIVE',cover:'assets/music-archive/flyzone.jpg',description:'A bold older project restored to the physical-media archive.'},
    {id:'ghetto-gumbo',title:'Ghetto Gumbo',year:'ARCHIVE',cover:'assets/music-archive/ghetto-gumbo.jpg',description:'A We Famous Entertainment-era project presented with its original visual identity.'},
    {id:'my-city-crazy',title:'My City Crazy',year:'ARCHIVE',cover:'assets/music-archive/my-city-crazy.jpg',description:'A city-focused archive release displayed inside the 2FLY collection.'},
    {id:'ohydro',title:'Ohydro',year:'ARCHIVE',cover:'assets/music-archive/ohydro.jpg',description:'An older catalog project brought forward as part of the complete 2FLY archive.'},
    {id:'please-believe-it',title:'Please Believe It!',year:'ARCHIVE',cover:'assets/music-archive/please-believe-it.jpg',description:'A legacy release returning to the catalog with its original visual identity intact.'}
  ];
  const coverOf=a=>asset(a.cover);
  const current=()=>archive[Math.max(0,Math.min(app.musicArchiveIndex||0,archive.length-1))];

  renderMusic=function(){
    app.musicArchiveIndex=Math.max(0,Math.min(app.musicArchiveIndex||0,archive.length-1));
    $('#appView').innerHTML=`<section class="music-v3-page premium-music-option-2">
      <div class="music-v3-stage">
        <aside class="music-v3-copy">
          <h1>MUSIC</h1>
          <p>COLLECT.<br>EXPLORE.<br>PRESS PLAY.</p>
          <em>MUSIC<br>LIVES<br>HERE.</em>
        </aside>

        <div class="music-v3-scene" id="musicScene">
          <img class="music-v3-scene-art" src="../assets/music-premium-v3/music-scene.webp" alt="2FLY music archive room with stereo, speakers, CD binder and wood table">
          <div class="music-v3-dotfield" aria-hidden="true"></div>
          <div class="music-v3-wave" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
          <div class="music-v3-stereo-screen" aria-live="polite">
            <span>2FLY MUSIC ARCHIVE</span>
            <strong id="stereoNowTitle">${esc(current().title)}</strong>
            <div class="music-v3-eq" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
          </div>
          <div class="music-v3-binder-hotspots" aria-label="Select a disc from the binder">
            ${archive.slice(0,5).map((a,i)=>`<button type="button" data-music-disc="${i}" aria-label="Select ${esc(a.title)}"><span>${String(i+1).padStart(2,'0')}</span></button>`).join('')}
          </div>
          <button class="music-v3-prev" id="musicDiscPrev" type="button" aria-label="Previous archive disc">‹</button>
          <button class="music-v3-next" id="musicDiscNext" type="button" aria-label="Next archive disc">›</button>
        </div>

        <aside class="music-v3-hud" id="musicUserHud" aria-live="polite"></aside>
      </div>
    </section>`;

    $$('.music-v3-binder-hotspots [data-music-disc]').forEach(btn=>btn.onclick=()=>selectMusicArchive(+btn.dataset.musicDisc));
    $('#musicDiscPrev').onclick=()=>selectMusicArchive((app.musicArchiveIndex-1+archive.length)%archive.length);
    $('#musicDiscNext').onclick=()=>selectMusicArchive((app.musicArchiveIndex+1)%archive.length);
    drawMusicHud();
  };

  window.selectMusicArchive=function(index){
    if(!archive[index])return;
    app.musicArchiveIndex=index;
    $$('.music-v3-binder-hotspots button').forEach(btn=>btn.classList.toggle('selected',+btn.dataset.musicDisc===index));
    drawMusicHud();
  };

  function drawMusicHud(){
    const album=current();
    const hud=$('#musicUserHud');
    if(!album||!hud)return;
    const stereo=$('#stereoNowTitle');
    if(stereo)stereo.textContent=album.title;
    $$('.music-v3-binder-hotspots button').forEach(btn=>btn.classList.toggle('selected',+btn.dataset.musicDisc===app.musicArchiveIndex));
    hud.innerHTML=`
      <div class="music-v3-hud-label">SELECTED DISC</div>
      <div class="music-v3-hud-cover"><img src="${coverOf(album)}" alt="${esc(album.title)} artwork"></div>
      <h2>${esc(album.title)}</h2>
      <div class="music-v3-hud-meta"><span>${esc(album.year)}</span><b>·</b><span>2FLY KEITH LOGAN</span></div>
      <p>${esc(album.description)}</p>
      <button class="music-v3-explore" id="musicExploreDisc" type="button"><span>EXPLORE THIS DISC</span><b>→</b></button>
      <div class="music-v3-status" id="musicDiscStatus" hidden>ARCHIVE AUDIO · COMING SOON</div>`;
    $('#musicExploreDisc').onclick=()=>{
      const status=$('#musicDiscStatus');
      status.hidden=!status.hidden;
      const playerTitle=$('#playerTitle');
      const playerCover=$('#playerCover');
      if(playerTitle)playerTitle.textContent=album.title;
      if(playerCover)playerCover.src=coverOf(album);
    };
  }
})();