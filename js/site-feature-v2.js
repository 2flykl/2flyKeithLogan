// Featured V2 controller — in-content cinematic carousel, static playable thumbnails, sparse Help reminders.
(function(){
  const oldSetFeature=setFeature;

  function deckCard(index,role){
    const total=app.featured.length;
    if(!total)return'';
    const i=(index+total)%total;
    const p=app.featured[i];
    const image=asset(p.poster||p.cover);
    const arrow=role==='prev'?'←':role==='next'?'→':'';
    const action=role==='current'?'CURRENT FEATURE':role==='prev'?'PREVIOUS FEATURE':'NEXT FEATURE';
    return `<button class="feature-cover-card ${role}" type="button" data-feature="${i}" aria-label="${action}: ${esc(p.title)}">
      <img src="${image}" alt="" loading="lazy">
      <span class="feature-cover-shade"></span>
      ${arrow?`<span class="feature-cover-arrow" aria-hidden="true">${arrow}</span>`:''}
      <span class="feature-cover-copy"><small>${esc((p.word||'FEATURED').toUpperCase())}</small><strong>${esc(p.title.toUpperCase())}</strong><span>${esc((p.subtitle||'').toUpperCase())}</span></span>
    </button>`;
  }

  function renderDeck(){
    const deck=$('#featureDeck');
    if(!deck||!app.featured.length)return;
    const i=app.featureIndex;
    deck.innerHTML=`
      <div class="feature-deck-heading">
        <div><small>MORE FEATURED PROJECTS</small><strong>BROWSE THE FEATURED DECK</strong></div>
        <span>${String(i+1).padStart(2,'0')} / ${String(app.featured.length).padStart(2,'0')}</span>
      </div>
      <div class="feature-coverflow">
        ${deckCard(i-1,'prev')}
        ${deckCard(i,'current')}
        ${deckCard(i+1,'next')}
      </div>
      <div class="feature-deck-dots" aria-label="Featured project position">
        ${app.featured.map((p,n)=>`<button type="button" data-feature="${n}" class="${n===i?'active':''}" aria-label="Show ${esc(p.title)}"></button>`).join('')}
      </div>`;
  }

  renderFeatured=function(){
    $('#appView').innerHTML=`<section class="featured-stage">
      <div class="feature-backdrop" id="featureBackdrop"></div><div class="feature-noise"></div>
      <a class="feature-firstview-help" href="#support" data-route="support"><span><small>HELP 2FLY CREATE</small><strong>DECIDE WHAT IT'S WORTH.</strong></span><b>→</b></a>
      <div class="feature-content" id="featureContent"></div>
      <section class="feature-deck" id="featureDeck" aria-label="Featured project navigation"></section>
      <div class="feature-spare-space"><small>EXPANDABLE PROJECT SPACE</small><p>Credits, notes, lyrics, development updates, collaborators and project-specific information can live here without rebuilding the page.</p></div>
      ${helpModule()}
    </section>`;

    $('#featureDeck')?.addEventListener('click',e=>{
      const target=e.target.closest('[data-feature]');
      if(target)setFeature(Number(target.dataset.feature));
    });
    setFeature(app.featureIndex,false);
  };

  standardFeature=function(p){
    const playableThumb=asset(p.cover||p.poster);
    const playableHref=p.experience?asset(p.experience):'';
    return `<div class="feature-control-room">
      <div class="feature-context-line"><span>${esc((p.subtitle||'FEATURED PROJECT').toUpperCase())}</span><strong>${esc(p.title)}</strong><span>${esc((p.word||'FEATURED').toUpperCase())}</span></div>
      <div class="feature-room-grid">
        <div class="feature-art-zone">
          <div class="feature-art-frame"><img src="${asset(p.cover)}" alt="${esc(p.title)} cover artwork"><div class="feature-art-caption"><small>PROJECT ARTWORK</small><strong>${esc(p.title)}</strong></div></div>
        </div>
        <div class="feature-media-console">
          <div class="project-media-row">
            <button class="project-media-tile feature-video-tile" id="featureWatch" type="button" ${p.video?'':'disabled'}>
              ${p.video?`<video id="featurePreviewVideo" muted loop playsinline autoplay preload="metadata" poster="${asset(p.poster||p.cover)}" src="${esc(p.video)}"></video><span class="project-video-fullscreen" id="featureVideoFullscreen">FULL SCREEN ↗</span>`:`<img src="${asset(p.poster||p.cover)}" alt="">`}
              <span class="project-media-label"><small>VISUAL STORY</small><strong>MUSIC VIDEO</strong><span>${p.video?'CLICK TO ACTIVATE VIDEO':'IN PRODUCTION'}</span></span>
            </button>
            ${p.experience?`<a class="project-media-tile project-playable-static" href="${playableHref}" aria-label="Open ${esc(p.title)} playable experience">
              <img src="${playableThumb}" alt="${esc(p.title)} playable experience artwork">
              <span class="playable-grid" aria-hidden="true"></span>
              <span class="playable-hud" aria-hidden="true"><b>PLX</b><i>INTERACTIVE</i><em>READY</em></span>
              <span class="playable-enter-icon" aria-hidden="true">⌁</span>
              <span class="project-media-label"><small>PLAYABLE EXPERIENCE</small><strong>STEP INSIDE</strong><span>OPEN PLAYABLE ↗</span></span>
            </a>`:`<div class="project-media-tile project-playable-static is-disabled" aria-disabled="true">
              <img src="${playableThumb}" alt="${esc(p.title)} playable concept artwork">
              <span class="playable-grid" aria-hidden="true"></span>
              <span class="playable-hud" aria-hidden="true"><b>PLX</b><i>INTERACTIVE</i><em>BUILDING</em></span>
              <span class="project-media-label"><small>PLAYABLE EXPERIENCE</small><strong>STEP INSIDE</strong><span>IN DEVELOPMENT</span></span>
            </div>`}
          </div>
          <div class="project-player-skin"><img src="${asset(p.cover)}" alt=""><div class="project-player-copy"><small>PROJECT AUDIO · PLAYS THROUGH GLOBAL PLAYER</small><strong>${esc(p.title)}</strong><span>${esc(p.subtitle||'2Fly Keith Logan')}</span></div><button id="featureListen" type="button" ${p.audio?'':'disabled'} aria-label="Play ${esc(p.title)} in the global player">▶</button></div>
        </div>
      </div>
    </div>`;
  };

  setFeature=function(index,loadAudio=true){
    oldSetFeature(index,loadAudio);
    if(!app.featured.length)return;
    renderDeck();
  };

  function applyHelpTagline(){
    const top=$('.help-create-nav');
    if(!top)return;
    const small=top.querySelector('small');
    if(small&&small.textContent!=="DECIDE WHAT IT'S WORTH."){
      small.classList.add('help-tagline');
      small.textContent="DECIDE WHAT IT'S WORTH.";
    }
  }

  function reminderTargets(){
    return $$('.help-create-nav,.feature-firstview-help,.home-actions .create').filter(el=>el&&el.offsetParent!==null);
  }
  function pulse(type){
    reminderTargets().forEach(el=>{
      el.classList.remove('help-nudge','help-flare');
      void el.offsetWidth;
      el.classList.add(type);
      setTimeout(()=>el.classList.remove(type),type==='help-flare'?2100:1500);
    });
  }
  function startHelpCadence(){
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const cycle=()=>{
      setTimeout(()=>pulse('help-nudge'),14000);
      setTimeout(()=>pulse('help-nudge'),33000);
      setTimeout(()=>pulse('help-nudge'),54000);
      setTimeout(()=>pulse('help-flare'),80000);
    };
    cycle();
    setInterval(cycle,102000);
  }

  document.addEventListener('DOMContentLoaded',()=>{
    applyHelpTagline();
    startHelpCadence();
  });
  window.addEventListener('hashchange',()=>setTimeout(applyHelpTagline,0));
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-route]'))setTimeout(applyHelpTagline,0);
  });
})();
