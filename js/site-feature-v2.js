// Featured V2 controller — compact header switcher, static playable thumbnails, sparse Help reminders.
(function(){
  const oldSetFeature=setFeature;

  const projectCue=p=>{
    if(!p)return{left:'FEATURED PROJECT',signal:'FEATURED'};
    return {
      left:(p.subtitle||p.description||'FEATURED PROJECT').toUpperCase(),
      signal:(p.word||'FEATURED').toUpperCase()
    };
  };

  function deckTab(p,i){
    const image=asset(p.poster||p.cover);
    return `<button type="button" data-feature="${i}" aria-label="Feature ${esc(p.title)}">
      <img src="${image}" alt="" loading="lazy">
      <span class="feature-deck-tabcopy"><small>${esc((p.word||'FEATURED').toUpperCase())}</small><strong>${esc(p.title.toUpperCase())}</strong></span>
    </button>`;
  }

  function renderHeaderSwitcher(){
    const slot=$('#featuredSwitcherSlot');
    if(!slot)return;
    const count=app.featured.length||1;
    slot.hidden=false;
    slot.innerHTML=`<section class="feature-deck feature-deck-header" aria-label="Featured project navigation">
      <div class="feature-deck-status"><small>NOW FEATURING</small><strong id="featureDeckNow">FEATURED</strong></div>
      <button class="feature-deck-arrow" id="featurePrev" type="button" aria-label="Previous feature">←</button>
      <div class="feature-deck-tabs" id="featureTabs">${app.featured.map(deckTab).join('')}</div>
      <button class="feature-deck-arrow" id="featureNext" type="button" aria-label="Next feature">→</button>
      <div class="feature-deck-counter"><small>FEATURE</small><strong id="featureCounter">01 / ${String(count).padStart(2,'0')}</strong></div>
    </section>`;

    $('#featureTabs')?.addEventListener('click',e=>{
      const b=e.target.closest('[data-feature]');
      if(b)setFeature(Number(b.dataset.feature));
    });
    $('#featurePrev')?.addEventListener('click',()=>setFeature(app.featureIndex-1));
    $('#featureNext')?.addEventListener('click',()=>setFeature(app.featureIndex+1));
  }

  function syncSwitcherVisibility(){
    const slot=$('#featuredSwitcherSlot');
    if(!slot)return;
    const isFeatured=(location.hash||'#home').slice(1).split('?')[0]==='featured';
    if(!isFeatured){
      slot.hidden=true;
      slot.innerHTML='';
    }
  }

  renderFeatured=function(){
    renderHeaderSwitcher();
    $('#appView').innerHTML=`<section class="featured-stage">
      <div class="feature-backdrop" id="featureBackdrop"></div><div class="feature-noise"></div>
      <div class="feature-content" id="featureContent"></div>
      <div class="feature-spare-space"><small>EXPANDABLE PROJECT SPACE</small><p>Credits, notes, lyrics, development updates, collaborators and project-specific information can live here without rebuilding the page.</p></div>
      ${helpModule()}
    </section>`;
    setFeature(app.featureIndex,false);
  };

  standardFeature=function(p){
    const playableThumb=asset(p.poster||p.cover);
    const playableHref=p.experience?asset(p.experience):'';
    return `<div class="feature-control-room">
      <div class="feature-context-line"><span>${esc((p.subtitle||'FEATURED PROJECT').toUpperCase())}</span><strong>${esc(p.title)}</strong><span>${esc((p.word||'FEATURED').toUpperCase())}</span></div>
      <div class="feature-room-grid">
        <div class="feature-art-zone">
          <div class="feature-art-frame"><img src="${asset(p.cover)}" alt="${esc(p.title)} cover artwork"><div class="feature-art-caption"><small>PROJECT ARTWORK</small><strong>${esc(p.title)}</strong></div></div>
          <a class="feature-support-strip" href="#support" data-route="support"><b>HELP 2FLY CREATE</b><span>DECIDE WHAT IT'S WORTH. →</span></a>
        </div>
        <div class="feature-media-console">
          <div class="project-media-row">
            <button class="project-media-tile" id="featureWatch" type="button" ${p.video?'':'disabled'}>
              ${p.video?`<video id="featurePreviewVideo" muted loop playsinline autoplay preload="metadata" poster="${asset(p.poster||p.cover)}" src="${esc(p.video)}"></video><span class="project-video-fullscreen" id="featureVideoFullscreen">FULL SCREEN ↗</span>`:`<img src="${asset(p.poster||p.cover)}" alt="">`}
              <span class="project-media-label"><small>VISUAL STORY</small><strong>MUSIC VIDEO</strong><span>${p.video?'CLICK TO ACTIVATE VIDEO':'IN PRODUCTION'}</span></span>
            </button>
            ${p.experience?`<a class="project-media-tile project-playable-static" href="${playableHref}" aria-label="Open ${esc(p.title)} playable experience">
              <img src="${playableThumb}" alt="${esc(p.title)} playable thumbnail">
              <span class="project-media-label"><small>PLAYABLE EXPERIENCE</small><strong>STEP INSIDE</strong><span>STATIC PREVIEW · OPEN PLAYABLE ↗</span></span>
            </a>`:`<div class="project-media-tile project-playable-static is-disabled" aria-disabled="true">
              <img src="${playableThumb}" alt="${esc(p.title)} playable concept thumbnail">
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
    const p=app.featured[app.featureIndex];
    if(!p)return;
    const now=$('#featureDeckNow');if(now)now.textContent=p.title.toUpperCase();
    const counter=$('#featureCounter');if(counter)counter.textContent=`${String(app.featureIndex+1).padStart(2,'0')} / ${String(app.featured.length).padStart(2,'0')}`;
    $$('#featureTabs [data-feature]').forEach((b,i)=>b.classList.toggle('active',i===app.featureIndex));
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
    return $$('.help-create-nav,.feature-support-strip,.home-actions .create').filter(el=>el&&el.offsetParent!==null);
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
    syncSwitcherVisibility();
  });

  window.addEventListener('hashchange',()=>setTimeout(()=>{
    applyHelpTagline();
    syncSwitcherVisibility();
  },0));
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-route]'))setTimeout(applyHelpTagline,0);
  });
})();
