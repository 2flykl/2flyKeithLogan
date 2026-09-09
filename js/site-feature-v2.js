// Featured V3 controller — staged carousel, edge previews, waveform, theater/fullscreen media.
(function(){
  const waveform=()=>Array.from({length:34},(_,i)=>`<span style="--i:${i};--h:${14+((i*17)%47)}px"></span>`).join('');

  function deckThumb(p,i){
    return `<button class="feature-thumb ${i===app.featureIndex?'active':''}" type="button" data-feature="${i}" aria-label="Show ${esc(p.title)}">
      <img src="${asset(p.poster||p.cover)}" alt="" loading="lazy">
      <span><small>${esc((p.word||'FEATURED').toUpperCase())}</small><strong>${esc(p.title.toUpperCase())}</strong></span>
    </button>`;
  }

  function renderDeck(){
    const deck=$('#featureDeck');
    if(!deck||!app.featured.length)return;
    deck.innerHTML=`
      <div class="feature-deck-heading"><div><small>FEATURED PROJECTS</small><strong>CHOOSE WHAT TO EXPERIENCE NEXT</strong></div><span>${String(app.featureIndex+1).padStart(2,'0')} / ${String(app.featured.length).padStart(2,'0')}</span></div>
      <div class="feature-deck-row">
        <button class="feature-deck-arrow" type="button" data-step="-1" aria-label="Previous featured project">←</button>
        <div class="feature-thumb-rail">${app.featured.map(deckThumb).join('')}</div>
        <button class="feature-deck-arrow" type="button" data-step="1" aria-label="Next featured project">→</button>
      </div>`;
  }

  function sidePreview(index,role){
    const total=app.featured.length;
    if(!total)return'';
    const i=(index+total)%total,p=app.featured[i];
    const arrow=role==='prev'?'←':'→';
    return `<button class="feature-side-preview ${role}" type="button" data-feature="${i}" aria-label="${role==='prev'?'Previous':'Next'} project: ${esc(p.title)}"><img src="${asset(p.poster||p.cover)}" alt=""><b aria-hidden="true">${arrow}</b><span>${esc(p.title.toUpperCase())}</span></button>`;
  }

  function theaterShell(){
    return `<div class="media-theater-backdrop" id="mediaTheaterBackdrop" hidden></div>
      <section class="media-theater" id="mediaTheater" hidden aria-modal="true" role="dialog" aria-label="Expanded media viewer">
        <div class="media-theater-head"><div><small id="mediaTheaterType">MEDIA</small><strong id="mediaTheaterTitle">FEATURED</strong></div><div class="media-theater-actions"><button id="mediaTheaterFull" type="button">FULL SCREEN</button><button id="mediaTheaterClose" type="button">CLOSE</button></div></div>
        <div class="media-theater-body" id="mediaTheaterBody"></div>
      </section>`;
  }

  renderFeatured=function(){
    $('#appView').innerHTML=`<section class="featured-stage">
      <div class="feature-backdrop" id="featureBackdrop"></div><div class="feature-noise"></div>
      <div id="featurePrevPeek"></div><div id="featureNextPeek"></div>
      <div class="feature-content" id="featureContent"></div>
      <section class="feature-deck" id="featureDeck" aria-label="Featured project navigation"></section>
      <div class="feature-spare-space"><small>EXPANDABLE PROJECT SPACE</small><p>Credits, notes, lyrics, development updates, collaborators and project-specific information can live here without rebuilding the page.</p></div>
      ${helpModule()}${theaterShell()}
    </section>`;

    $('#featureDeck')?.addEventListener('click',e=>{
      const item=e.target.closest('[data-feature]');
      const step=e.target.closest('[data-step]');
      if(item)setFeature(Number(item.dataset.feature));
      else if(step)setFeature(app.featureIndex+Number(step.dataset.step));
    });
    $('#featurePrevPeek')?.addEventListener('click',e=>{const b=e.target.closest('[data-feature]');if(b)setFeature(Number(b.dataset.feature))});
    $('#featureNextPeek')?.addEventListener('click',e=>{const b=e.target.closest('[data-feature]');if(b)setFeature(Number(b.dataset.feature))});
    setFeature(app.featureIndex,false);
  };

  standardFeature=function(p){
    return `<div class="feature-control-room">
      <div class="feature-room-grid">
        <div class="feature-art-zone">
          <div class="feature-art-frame"><img src="${asset(p.cover)}" alt="${esc(p.title)} cover artwork"><div class="feature-art-caption"><small>PROJECT ARTWORK</small><strong>${esc(p.title)}</strong></div></div>
          <a class="feature-support-strip" href="#support" data-route="support"><b>HELP 2FLY CREATE</b><span>DECIDE WHAT IT'S WORTH. →</span></a>
        </div>
        <div class="feature-media-console">
          <div class="project-media-row">
            <div class="project-media-tile feature-video-tile">
              ${p.video?`<video id="featurePreviewVideo" muted loop playsinline autoplay preload="metadata" poster="${asset(p.poster||p.cover)}" src="${esc(p.video)}"></video>`:`<img src="${asset(p.poster||p.cover)}" alt="">`}
              <div class="media-view-controls">${p.video?`<button type="button" data-media="video" data-mode="theater">EXPAND</button><button type="button" data-media="video" data-mode="full">FULL</button>`:''}</div>
              <span class="project-media-label"><small>VISUAL STORY</small><strong>MUSIC VIDEO</strong><span>${p.video?'EXPAND · FULL SCREEN':'IN PRODUCTION'}</span></span>
            </div>
            <div class="project-media-tile project-playable-static ${p.experience?'':'is-disabled'}">
              <span class="playable-artmark" aria-hidden="true"></span>
              <span class="playable-hud" aria-hidden="true"><b>PLX</b><i>INTERACTIVE EXPERIENCE</i><em>${p.experience?'READY':'BUILDING'}</em></span>
              <div class="media-view-controls">${p.experience?`<button type="button" data-media="playable" data-mode="theater">EXPAND</button><button type="button" data-media="playable" data-mode="full">FULL</button>`:''}</div>
              <span class="project-media-label"><small>PLAYABLE EXPERIENCE</small><strong>STEP INSIDE</strong><span>${p.experience?'EXPAND · FULL SCREEN':'IN DEVELOPMENT'}</span></span>
            </div>
          </div>
          <div class="project-player-skin"><img src="${asset(p.cover)}" alt=""><div class="project-player-copy"><small>PROJECT AUDIO · PLAYS THROUGH GLOBAL PLAYER</small><strong>${esc(p.title)}</strong><span>${esc(p.subtitle||'2Fly Keith Logan')}</span></div><div class="project-waveform" aria-hidden="true">${waveform()}</div><button id="featureListen" type="button" ${p.audio?'':'disabled'} aria-label="Play ${esc(p.title)} in the global player">▶</button></div>
        </div>
      </div>
    </div>`;
  };

  function openTheater(p,type,full=false){
    const theater=$('#mediaTheater'),backdrop=$('#mediaTheaterBackdrop'),body=$('#mediaTheaterBody');
    if(!theater||!backdrop||!body)return;
    $('#mediaTheaterType').textContent=type==='video'?'MUSIC VIDEO':'PLAYABLE EXPERIENCE';
    $('#mediaTheaterTitle').textContent=p.title;
    body.innerHTML=type==='video'
      ? `<video id="mediaTheaterMedia" controls autoplay playsinline src="${esc(p.video||'')}" poster="${asset(p.poster||p.cover)}"></video>`
      : `<iframe id="mediaTheaterMedia" title="${esc(p.title)} playable experience" src="${asset(p.experience||'')}"></iframe>`;
    theater.hidden=false;backdrop.hidden=false;document.body.style.overflow='hidden';
    if(full)setTimeout(()=>requestFull(theater),80);
  }
  function closeTheater(){
    const theater=$('#mediaTheater'),backdrop=$('#mediaTheaterBackdrop'),body=$('#mediaTheaterBody');
    if(theater)theater.hidden=true;if(backdrop)backdrop.hidden=true;if(body)body.innerHTML='';document.body.style.overflow='';
  }
  function requestFull(el){
    if(!el)return;const fn=el.requestFullscreen||el.webkitRequestFullscreen;try{fn&&fn.call(el)}catch{}
  }
  function bindTheater(p){
    $('#featureContent')?.addEventListener('click',e=>{
      const b=e.target.closest('[data-media][data-mode]');if(!b)return;
      const type=b.dataset.media,mode=b.dataset.mode;
      if(type==='video'&&!p.video)return;if(type==='playable'&&!p.experience)return;
      openTheater(p,type,mode==='full');
    });
    $('#mediaTheaterClose')?.addEventListener('click',closeTheater);
    $('#mediaTheaterBackdrop')?.addEventListener('click',closeTheater);
    $('#mediaTheaterFull')?.addEventListener('click',()=>requestFull($('#mediaTheater')));
  }

  setFeature=function(index,loadAudio=true){
    if(!app.featured.length){
      const content=$('#featureContent');if(content)content.innerHTML='<p class="empty">Featured project data is unavailable.</p>';
      return;
    }
    app.featureIndex=(index+app.featured.length)%app.featured.length;
    const p=app.featured[app.featureIndex];
    document.documentElement.style.setProperty('--accent',p.accent||'#e45b28');
    document.documentElement.style.setProperty('--accent2',p.accent2||'#23100b');
    const backdrop=$('#featureBackdrop');if(backdrop)backdrop.style.backgroundImage=`url("${asset(p.poster||p.cover)}")`;
    const content=$('#featureContent');if(content){content.innerHTML=p.id==='africa'?documentary(p):standardFeature(p);bindFeature(p);bindTheater(p)}
    const prev=$('#featurePrevPeek'),next=$('#featureNextPeek');
    if(prev)prev.innerHTML=sidePreview(app.featureIndex-1,'prev');if(next)next.innerHTML=sidePreview(app.featureIndex+1,'next');
    renderDeck();
    if(loadAudio&&p.audio)loadProjectAudio(p,false);
  };

  function applyHelpTagline(){const top=$('.help-create-nav');if(!top)return;const small=top.querySelector('small');if(small&&small.textContent!=="DECIDE WHAT IT'S WORTH."){small.classList.add('help-tagline');small.textContent="DECIDE WHAT IT'S WORTH."}}
  function reminderTargets(){return $$('.help-create-nav,.feature-support-strip,.home-actions .create').filter(el=>el&&el.offsetParent!==null)}
  function pulse(type){reminderTargets().forEach(el=>{el.classList.remove('help-nudge','help-flare');void el.offsetWidth;el.classList.add(type);setTimeout(()=>el.classList.remove(type),type==='help-flare'?2100:1500)})}
  function startHelpCadence(){if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;const cycle=()=>{setTimeout(()=>pulse('help-nudge'),14000);setTimeout(()=>pulse('help-nudge'),33000);setTimeout(()=>pulse('help-nudge'),54000);setTimeout(()=>pulse('help-flare'),80000)};cycle();setInterval(cycle,102000)}
  document.addEventListener('DOMContentLoaded',()=>{applyHelpTagline();startHelpCadence()});window.addEventListener('hashchange',()=>setTimeout(applyHelpTagline,0));document.addEventListener('click',e=>{if(e.target.closest('[data-route]'))setTimeout(applyHelpTagline,0)});
})();
