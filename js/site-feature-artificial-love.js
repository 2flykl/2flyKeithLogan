// Artificial Love featured room: commercial, playable experiences, and album tracks.
(function(){
  const previousStandardFeature=standardFeature;
  const previousBindFeature=bindFeature;

  standardFeature=function(project){
    if(project.id!=='artificial-love')return previousStandardFeature(project);
    const tracks=(project.tracks||[]).map((track,index)=>`
      <button class="artificial-track" type="button" data-artificial-track="${index}" aria-label="Play ${esc(track.title)}">
        <span class="artificial-track-number">${String(index+1).padStart(2,'0')}</span>
        <strong>${esc(track.title)}</strong><span class="artificial-track-play" aria-hidden="true">▶</span>
      </button>`).join('');
    return `<div class="feature-control-room feature-production-room artificial-feature">
      <div class="feature-room-grid">
        <div class="feature-art-zone">
          <div class="feature-art-frame live-trim"><img src="${asset(project.cover)}" alt="Artificial Love album artwork"><div class="feature-art-caption"><small>ALBUM ARTWORK</small><strong>Artificial Love</strong></div></div>
          <a class="feature-support-strip feature-support-main" href="https://buy.stripe.com/cNi3cx2NGaN53rk1HG0Fi00" target="_blank" rel="noopener noreferrer"><b>HELP 2FLY CREATE</b><span>DECIDE WHAT IT'S WORTH. →</span></a>
        </div>
        <div class="feature-media-console artificial-console">
          <section class="artificial-commercial live-trim" aria-label="Artificial Love commercial">
            <video id="featurePreviewVideo" controls playsinline preload="metadata" poster="${asset(project.poster||project.cover)}" src="${asset(project.video)}"></video>
            <div class="artificial-commercial-head"><div><small>FEATURED FILM</small><strong>Artificial Love</strong><span>Watch the commercial</span></div><div class="media-view-controls"><button type="button" data-media="video" data-mode="theater" aria-label="Expand Artificial Love commercial">EXPAND</button><button type="button" data-media="video" data-mode="full" aria-label="Watch Artificial Love commercial in full screen">FULL</button></div></div>
          </section>
          <section class="artificial-playables" aria-label="Artificial Love playable experiences">
            <a class="artificial-playable artificial-playable-heavy live-trim" href="../games/heavy-on-my-mind/index.html" data-playable-launch data-playable-title="Heavy On My Mind" aria-label="Enter Heavy On My Mind playable experience"><img class="artificial-playable-art" src="../games/heavy-on-my-mind/assets/dusk-neighborhood.png" alt="" loading="lazy"><span class="artificial-playable-kicker">PLAYABLE EXPERIENCE · READY</span><strong>Heavy On<br>My Mind</strong><span class="artificial-playable-foot">ENTER EXPERIENCE <span aria-hidden="true">↗</span></span></a>
            <a class="artificial-playable artificial-playable-infinite live-trim" href="../games/infinite-love/index.html" data-playable-launch data-playable-title="Infinite Love" aria-label="Enter Infinite Love playable experience"><img class="artificial-playable-art" src="../games/infinite-love/assets/artificial-love-skin.png" alt="" loading="lazy"><span class="artificial-playable-kicker">PLAYABLE EXPERIENCE · READY</span><strong>Infinite<br>Love</strong><span class="artificial-playable-foot">ENTER EXPERIENCE <span aria-hidden="true">∞</span></span></a>
          </section>
          <section class="artificial-album" aria-label="Artificial Love album songs"><div class="artificial-album-head"><small>THE ALBUM</small><strong>Listen to Artificial Love</strong><span>${String(project.tracks?.length||0).padStart(2,'0')} TRACKS · PLAYS IN THE GLOBAL PLAYER</span></div><div class="artificial-track-grid">${tracks}</div></section>
        </div>
      </div>
    </div>`;
  };

  bindFeature=function(project){
    previousBindFeature(project);
    if(project.id!=='artificial-love')return;
    document.querySelectorAll('[data-artificial-track]').forEach(button=>button.addEventListener('click',()=>{
      const index=Number(button.dataset.artificialTrack);
      const track=project.tracks?.[index];
      if(!track?.audio)return;
      loadProjectAudio({...project,title:track.title,audio:track.audio,albumId:project.id,albumTrackIndex:index},true);
      document.querySelectorAll('[data-artificial-track]').forEach(item=>item.classList.toggle('is-playing',item===button));
    }));
  };
})();
