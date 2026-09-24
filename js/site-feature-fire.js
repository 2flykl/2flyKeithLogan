// Featured production pass — top carousel rail, film entry, and themed playable artwork.
(function(){
  const priorSetFeature=setFeature;
  const priorBindFeature=bindFeature;
  const wave=()=>Array.from({length:34},(_,i)=>`<span style="--i:${i};--h:${14+((i*17)%47)}px"></span>`).join('');

  const themeMap={
    africa:'../assets/feature-motifs/africa-acacia.svg',
    streams:'../assets/feature-motifs/streams-water.svg',
    fire:'../assets/feature-motifs/fire-house.svg',
    away:'../assets/feature-motifs/away-distance.svg'
  };
  const playableArtwork={
    fire:'../assets/covers/thru-the-fire-cover.png',
    streams:'../assets/playables/streams.jpg',
    away:'../assets/playables/away.jpg'
  };

  function supportButton(extra=''){
    return `<a class="feature-support-strip ${extra}" href="#support" data-route="support"><b>HELP 2FLY CREATE</b><span>DECIDE WHAT IT'S WORTH. →</span></a>`;
  }

  standardFeature=function(p){
    return `<div class="feature-control-room feature-production-room">
      <div class="feature-room-grid">
        <div class="feature-art-zone">
          <div class="feature-art-frame live-trim"><img src="${asset(p.cover)}" alt="${esc(p.title)} cover artwork"><div class="feature-art-caption"><small>PROJECT ARTWORK</small><strong>${esc(p.title)}</strong></div></div>
          ${supportButton('feature-support-main')}
        </div>
        <div class="feature-media-console">
          <div class="project-media-row">
            <div class="project-media-tile feature-video-tile live-trim">
              ${p.video?`<video id="featurePreviewVideo" muted loop playsinline autoplay preload="metadata" poster="${asset(p.poster||p.cover)}" src="${esc(p.video)}"></video>`:`<img src="${asset(p.poster||p.cover)}" alt="">`}
              <div class="media-view-controls">${p.video?`<button type="button" data-media="video" data-mode="theater">EXPAND</button><button type="button" data-media="video" data-mode="full">FULL</button>`:''}</div>
              <span class="project-media-label"><small>VISUAL STORY</small><strong>MUSIC VIDEO</strong><span>${p.video?'EXPAND · FULL SCREEN':'IN PRODUCTION'}</span></span>
            </div>
            <div class="project-media-tile project-playable-static ${p.experience?'':'is-disabled'} live-trim">
              <img class="feature-playable-artwork" src="${playableArtwork[p.id]||asset(p.cover)}" alt="${esc(p.title)} playable experience artwork" loading="lazy">
              <span class="playable-hud" aria-hidden="true"><b>PLX</b><i>INTERACTIVE EXPERIENCE</i><em>${p.experience?'READY':'BUILDING'}</em></span>
              <div class="media-view-controls">${p.experience?`<button type="button" data-media="playable" data-mode="theater">EXPAND</button><button type="button" data-media="playable" data-mode="full">FULL</button>`:''}</div>
              <span class="project-media-label"><small>PLAYABLE EXPERIENCE</small><strong>STEP INSIDE</strong><span>${p.experience?'EXPAND · FULL SCREEN':'IN DEVELOPMENT'}</span></span>
            </div>
          </div>
          <div class="project-player-skin live-trim"><img src="${asset(p.cover)}" alt=""><div class="project-player-copy"><small>PROJECT AUDIO · PLAYS THROUGH GLOBAL PLAYER</small><strong>${esc(p.title)}</strong><span>${esc(p.subtitle||'2Fly Keith Logan')}</span></div><div class="project-waveform" aria-hidden="true">${wave()}</div><button id="featureListen" type="button" ${p.audio?'':'disabled'} aria-label="Play ${esc(p.title)} in the global player">▶</button></div>
        </div>
      </div>
    </div>`;
  };

  documentary=function(p){
    const clips=p.clips||[],first=clips[0]||{};
    const musicIndex=clips.findIndex(c=>c.type==='MUSIC VIDEO');
    const poster=asset('assets/africa-soundtrack-artwork.png');
    const firstPoster=asset('assets/africa-cinema-landscape.jpg');
    const musicPoster=poster;
    return `<section class="feature-africa-production">
      <aside class="feature-africa-left">
        <div class="feature-africa-poster live-trim"><img src="${poster}" alt="${esc(p.title)} project artwork"><div><small>PROJECT ARTWORK</small><strong>${esc(p.title)}</strong></div></div>
        ${supportButton('feature-africa-support')}
        <p class="feature-africa-quote">REAL PEOPLE · REAL PLACES · A BRIGHTER TOMORROW</p>
      </aside>
      <div class="feature-africa-main">
        <div class="feature-africa-video live-trim">
          <video id="docVideo" controls playsinline preload="metadata" poster="${firstPoster}"></video>
          <div class="doc-meta"><div><small id="docCounter">FEATURED VIDEO 01 / 02</small><strong id="docTitle">${esc(first.title||p.title)}</strong></div></div>
        </div>
        <div class="feature-africa-video-choices" id="chapterRail" aria-label="Featured Africa videos">
          <button type="button" data-feature-video="0" class="active"><img src="${firstPoster}" alt=""><span><small>DOCUMENTARY INTRODUCTION</small><strong>The Introduction</strong></span><em>WATCH ▶</em></button>
          <button type="button" data-feature-video="${musicIndex}" ${musicIndex<0?'disabled':''}><img src="${musicPoster}" alt=""><span><small>MUSIC VIDEO</small><strong>I Woke Up in Africa</strong></span><em>WATCH ▶</em></button>
        </div>
      </div>
      <aside class="feature-africa-actions">
        <a class="feature-viewing-room live-trim" href="africa-cinema.html" aria-label="Enter the I Woke Up in Africa documentary viewing room"><span class="viewing-room-curtains" aria-hidden="true"><i></i><i></i><b>▶</b></span><small>THE COMPLETE DOCUMENTARY</small><strong>ENTER VIEWING ROOM</strong><em>Step through the curtains →</em></a>
        <a class="feature-gifted-card africa-playable-card gifted live-trim" href="../games/BlackandGifted/index.html"><img src="../assets/playables/gifted.jpg" alt="Black & Gifted playable experience artwork" loading="lazy"><span><small>PLAYABLE EXPERIENCE</small><strong>BLACK & GIFTED</strong><em>ENTER EXPERIENCE →</em></span></a>
      </aside>
    </section>`;
  };

  function railLabel(p){
    if(p.id==='africa')return 'DOCUMENTARY FEATURE';
    if(p.experience&&p.video)return 'MUSIC · VIDEO · PLAYABLE';
    if(p.video)return 'VISUAL STORY';
    return 'FEATURED PROJECT';
  }

  function renderGlobalRail(){
    const stage=$('.featured-stage');
    if(!stage||!app.featured?.length)return;
    stage.querySelector('.feature-global-rail')?.remove();
    const rail=document.createElement('nav');
    rail.className='feature-global-rail';
    rail.setAttribute('aria-label','Featured project carousel');
    rail.innerHTML=`<button class="feature-global-arrow" data-global-step="-1" type="button" aria-label="Previous featured project">‹</button>
      <div class="feature-global-items">${app.featured.map((p,i)=>`<button class="feature-global-item ${i===app.featureIndex?'active':''}" type="button" data-global-feature="${i}"><small>${esc(railLabel(p))}</small><strong>${esc(p.title.toUpperCase())}</strong></button>`).join('')}</div>
      <button class="feature-global-arrow" data-global-step="1" type="button" aria-label="Next featured project">›</button>`;
    const content=stage.querySelector('.feature-content');
    stage.insertBefore(rail,content||stage.firstChild);
    rail.addEventListener('click',e=>{
      const item=e.target.closest('[data-global-feature]');
      const step=e.target.closest('[data-global-step]');
      if(item)setFeature(Number(item.dataset.globalFeature),true);
      else if(step)setFeature(app.featureIndex+Number(step.dataset.globalStep),true);
    });
  }

  function applyTheme(p){
    const stage=$('.featured-stage');
    if(!stage)return;
    stage.dataset.featureTheme=p.id||'feature';
    const motif=themeMap[p.id]||themeMap.away;
    stage.style.setProperty('--feature-motif',`url("${motif}")`);
    if(!stage.querySelector('.feature-motif-field')){
      const motifField=document.createElement('div');motifField.className='feature-motif-field';motifField.setAttribute('aria-hidden','true');stage.prepend(motifField);
      const geo=document.createElement('div');geo.className='feature-geometry-field';geo.setAttribute('aria-hidden','true');stage.prepend(geo);
    }
  }

  function removeOldNavigation(){
    const old=$('#featureDeck');if(old)old.hidden=true;
    $$('.feature-inline-nav,.feature-deck-anchor,.doc-feature-footer-slot').forEach(el=>el.remove());
  }

  bindFeature=function(p){
    if(p.id!=='africa'){priorBindFeature(p);return}
    const video=$('#docVideo');
    const choices=$$('#chapterRail [data-feature-video]');
    const select=button=>{
      const i=Number(button.dataset.featureVideo);
      const clip=p.clips?.[i];
      if(!clip||!video)return;
      app.docIndex=i;
      video.pause();video.src=clip.src||'';video.poster=button===choices[0]?asset('assets/africa-cinema-landscape.jpg'):asset('assets/africa-soundtrack-artwork.png');video.load();
      $('#docCounter').textContent=`FEATURED VIDEO ${button===choices[0]?'01':'02'} / 02`;
      $('#docTitle').textContent=clip.title||p.title;
      choices.forEach(choice=>choice.classList.toggle('active',choice===button));
    };
    choices.forEach(button=>button.addEventListener('click',()=>{select(button);video?.play().catch(()=>{})}));
    if(choices[0])select(choices[0]);
  };

  setFeature=function(index,loadAudio=true){
    priorSetFeature(index,loadAudio);
    const p=app.featured?.[app.featureIndex];
    if(!p)return;
    applyTheme(p);
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      removeOldNavigation();
      renderGlobalRail();
    }));
  };
})();
