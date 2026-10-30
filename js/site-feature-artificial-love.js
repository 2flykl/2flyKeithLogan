// Artificial Love featured room: commercial, playable experiences, and album player.
(function(){
  const previousStandardFeature=standardFeature;
  const previousBindFeature=bindFeature;
  const waveform=()=>Array.from({length:24},(_,index)=>`<span style="--i:${index};--h:${14+((index*17)%47)}px"></span>`).join('');

  standardFeature=function(project){
    if(project.id!=='artificial-love')return previousStandardFeature(project);
    const trackOptions=(project.tracks||[]).map((track,index)=>`<option value="${index}">${String(index+1).padStart(2,'0')} · ${esc(track.title)}</option>`).join('');
    return `<div class="feature-control-room feature-production-room artificial-feature">
      <div class="feature-room-grid">
        <div class="feature-art-zone">
          <div class="feature-art-frame live-trim"><img src="${asset(project.cover)}" alt="Artificial Love album artwork"><div class="feature-art-caption"><small>ALBUM ARTWORK</small><strong>Artificial Love</strong></div></div>
          <a class="feature-support-strip feature-support-main artificial-support" href="https://buy.stripe.com/cNi3cx2NGaN53rk1HG0Fi00" target="_blank" rel="noopener noreferrer"><b>HELP 2FLY CREATE</b><span>DECIDE WHAT IT'S WORTH. →</span></a>
        </div>
        <div class="feature-media-console artificial-console">
          <div class="artificial-media-row" aria-label="Artificial Love commercial and playable experiences">
            <section class="artificial-commercial live-trim" aria-label="Artificial Love commercial">
              <video id="featurePreviewVideo" muted loop autoplay playsinline preload="metadata" poster="${asset(project.poster||project.cover)}" src="${asset(project.video)}"></video>
              <button class="artificial-commercial-open" type="button" data-media="video" data-mode="theater" aria-label="Watch Artificial Love commercial"><small>FEATURED FILM</small><strong>Artificial<br>Love</strong><span>WATCH COMMERCIAL ↗</span></button>
              <button class="artificial-commercial-full" type="button" data-media="video" data-mode="full" aria-label="Watch Artificial Love commercial in full screen">FULL</button>
            </section>
            <a class="artificial-playable artificial-playable-heavy live-trim" href="../games/heavy-on-my-mind/index.html" data-playable-launch data-playable-title="Heavy On My Mind" aria-label="Enter Heavy On My Mind playable experience"><img class="artificial-playable-art" src="../games/heavy-on-my-mind/assets/dusk-neighborhood.png" alt="" loading="lazy"><span class="artificial-playable-kicker">PLAYABLE EXPERIENCE · READY</span><strong>Heavy On<br>My Mind</strong><span class="artificial-playable-foot">ENTER EXPERIENCE <span aria-hidden="true">↗</span></span></a>
            <a class="artificial-playable artificial-playable-infinite live-trim" href="../games/infinite-love/index.html" data-playable-launch data-playable-title="Infinite Love" aria-label="Enter Infinite Love playable experience"><img class="artificial-playable-art" src="../games/infinite-love/assets/artificial-love-skin.png" alt="" loading="lazy"><span class="artificial-playable-kicker">PLAYABLE EXPERIENCE · READY</span><strong>Infinite<br>Love</strong><span class="artificial-playable-foot">ENTER EXPERIENCE <span aria-hidden="true">∞</span></span></a>
          </div>
          <div class="project-player-skin artificial-player live-trim">
            <img src="${asset(project.cover)}" alt="">
            <div class="project-player-copy"><small>ALBUM AUDIO · PLAYS THROUGH GLOBAL PLAYER</small><strong>Artificial Love</strong><span id="artificialSelectedTrack">01 · ${esc(project.tracks?.[0]?.title||'Choose a song')}</span></div>
            <div class="project-waveform" aria-hidden="true">${waveform()}</div>
            <button id="artificialListen" type="button" ${project.tracks?.length?'':'disabled'} aria-label="Play selected Artificial Love song">▶</button>
            <div class="artificial-song-picker"><label for="artificialTrackSelect">CHOOSE A SONG</label><select id="artificialTrackSelect" aria-label="Choose an Artificial Love song">${trackOptions}</select></div>
          </div>
        </div>
      </div>
    </div>`;
  };

  bindFeature=function(project){
    previousBindFeature(project);
    if(project.id!=='artificial-love')return;
    const select=document.querySelector('#artificialTrackSelect');
    const selectedTitle=document.querySelector('#artificialSelectedTrack');
    const listen=document.querySelector('#artificialListen');
    const playSelected=()=>{
      const index=Number(select?.value||0);
      const track=project.tracks?.[index];
      if(!track?.audio)return;
      loadProjectAudio({...project,title:track.title,audio:track.audio,albumId:project.id,albumTrackIndex:index},true);
      if(selectedTitle)selectedTitle.textContent=`${String(index+1).padStart(2,'0')} · ${track.title}`;
      if(listen)listen.setAttribute('aria-label',`Play ${track.title} in the global player`);
    };
    select?.addEventListener('change',playSelected);
    listen?.addEventListener('click',playSelected);
  };
})();
