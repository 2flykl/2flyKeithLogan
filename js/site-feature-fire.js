// Featured production pass — top carousel rail, documentary playlist layout, theme motifs.
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
              <span class="playable-artmark" aria-hidden="true"></span>
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
    const poster=asset(p.cover||p.poster);
    return `<section class="feature-africa-production">
      <aside class="feature-africa-left">
        <div class="feature-africa-poster live-trim"><img src="${poster}" alt="${esc(p.title)} project artwork"><div><small>PROJECT ARTWORK</small><strong>${esc(p.title)}</strong></div></div>
        ${supportButton('feature-africa-support')}
        <p class="feature-africa-quote">REAL PEOPLE · REAL PLACES · A BRIGHTER TOMORROW</p>
      </aside>
      <div class="feature-africa-main">
        <div class="feature-africa-video live-trim">
          <video id="docVideo" controls playsinline preload="metadata" poster="${asset(first.poster||p.poster||p.cover)}"></video>
          <div class="feature-doc-actions">
            <button id="docNextChapterFire" type="button">NEXT CHAPTER →</button>
            <button id="docPlayNextFire" type="button">PLAY NEXT ▶</button>
          </div>
          <div class="doc-meta"><div><small id="docCounter">CHAPTER 01 / ${String(clips.length).padStart(2,'0')}</small><strong id="docTitle">${esc(first.title||p.title)}</strong></div></div>
        </div>
        <div class="feature-africa-chapter-title"><small>CHAPTER <span id="docChapterNumber">01</span></small><strong id="docTitleMirror">${esc(first.title||p.title)}</strong><span>PEOPLE / PLACE / PERSPECTIVE</span></div>
      </div>
      <aside class="feature-africa-playlist live-trim">
        <header><div><small>THE FULL STORY</small><strong>DOCUMENTARY PLAYLIST</strong></div><b>${String(clips.length).padStart(2,'0')} CHAPTERS</b></header>
        <div class="chapter-rail feature-doc-playlist" id="chapterRail">${clips.map((c,i)=>`<button data-chapter="${i}" type="button"><img src="${asset(c.poster||p.poster||p.cover)}" alt=""><span><small>${String(i+1).padStart(2,'0')} · ${esc(c.type||'CHAPTER')}</small><strong>${esc(c.title)}</strong></span><em>PLAY</em></button>`).join('')}</div>
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

  function syncChapterMeta(){
    const active=$('#chapterRail [data-chapter].active');
    const i=active?Number(active.dataset.chapter):app.docIndex||0;
    const clip=app.featured[app.featureIndex]?.clips?.[i];
    if(!clip)return;
    const num=String(i+1).padStart(2,'0');
    const n=$('#docChapterNumber');if(n)n.textContent=num;
    const m=$('#docTitleMirror');if(m)m.textContent=clip.title||'';
  }

  function wireDocumentaryContinuation(){
    const p=app.featured[app.featureIndex];
    if(p?.id!=='africa')return;
    const clips=p.clips||[];
    const advance=async autoplay=>{
      if(!clips.length)return;
      const next=((app.docIndex||0)+1)%clips.length;
      const btn=$(`#chapterRail [data-chapter="${next}"]`);
      btn?.click();
      requestAnimationFrame(syncChapterMeta);
      if(autoplay){const v=$('#docVideo');try{await v?.play()}catch{}}
    };
    $('#docNextChapterFire')?.addEventListener('click',()=>advance(false));
    $('#docPlayNextFire')?.addEventListener('click',()=>advance(true));
    $('#chapterRail')?.addEventListener('click',()=>requestAnimationFrame(syncChapterMeta));
    $('#docVideo')?.addEventListener('ended',()=>advance(true));
    syncChapterMeta();
  }

  bindFeature=function(p){
    priorBindFeature(p);
  };

  setFeature=function(index,loadAudio=true){
    priorSetFeature(index,loadAudio);
    const p=app.featured?.[app.featureIndex];
    if(!p)return;
    applyTheme(p);
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      removeOldNavigation();
      renderGlobalRail();
      wireDocumentaryContinuation();
    }));
  };
})();
