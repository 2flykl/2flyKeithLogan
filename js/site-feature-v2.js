// Featured V2 controller — unified deck, visual tabs, reordered media, sparse Help reminders.
(function(){
  const oldRenderFeatured=renderFeatured;
  const oldSetFeature=setFeature;
  const oldStandardFeature=standardFeature;

  const projectCue=p=>{
    if(!p)return'';
    const left=(p.subtitle||p.description||'FEATURED PROJECT').toUpperCase();
    const signal=(p.word||'FEATURED').toUpperCase();
    return {left,signal};
  };

  function deckTab(p,i){
    const image=asset(p.poster||p.cover);
    return `<button type="button" data-feature="${i}" aria-label="Feature ${esc(p.title)}">
      <img src="${image}" alt="" loading="lazy">
      <span class="feature-deck-tabcopy"><small>${esc((p.word||'FEATURED').toUpperCase())}</small><strong>${esc(p.title.toUpperCase())}</strong><span>${esc((p.subtitle||'').toUpperCase())}</span></span>
    </button>`;
  }

  renderFeatured=function(){
    const count=app.featured.length||1;
    $('#appView').innerHTML=`<section class="featured-stage">
      <div class="feature-backdrop" id="featureBackdrop"></div><div class="feature-noise"></div>
      <section class="feature-deck" aria-label="Featured project navigation">
        <div class="feature-deck-status"><small>NOW FEATURING</small><strong id="featureDeckNow">FEATURED</strong><span id="featureDeckTicker">LISTEN · WATCH · STEP INSIDE</span></div>
        <button class="feature-deck-arrow" id="featurePrev" type="button" aria-label="Previous feature">←</button>
        <div class="feature-deck-tabs" id="featureTabs">${app.featured.map(deckTab).join('')}</div>
        <button class="feature-deck-arrow" id="featureNext" type="button" aria-label="Next feature">→</button>
        <div class="feature-deck-counter"><small>FEATURE</small><strong id="featureCounter">01 / ${String(count).padStart(2,'0')}</strong></div>
        <div class="feature-deck-meta"><span class="meta-left" id="featureMetaLeft">FEATURED PROJECT</span><strong class="meta-center" id="featureMetaCenter">2FLY</strong><span class="meta-right" id="featureMetaRight">PROJECT SIGNAL</span></div>
      </section>
      <div class="feature-content" id="featureContent"></div>
      <div class="feature-spare-space"><small>EXPANDABLE PROJECT SPACE</small><p>Credits, notes, lyrics, development updates, collaborators and project-specific information can live here without rebuilding the page.</p></div>
      ${helpModule()}
    </section>`;
    $('#featureTabs').addEventListener('click',e=>{const b=e.target.closest('[data-feature]');if(b)setFeature(+b.dataset.feature)});
    $('#featurePrev').onclick=()=>setFeature(app.featureIndex-1);
    $('#featureNext').onclick=()=>setFeature(app.featureIndex+1);
    setFeature(app.featureIndex,false);
  };

  standardFeature=function(p){
    return `<div class="feature-control-room">
      <div class="feature-context-line"><span>${esc((p.subtitle||'FEATURED PROJECT').toUpperCase())}</span><strong>${esc(p.title)}</strong><span>${esc((p.word||'FEATURED').toUpperCase())}</span></div>
      <div class="feature-room-grid">
        <div class="feature-art-zone">
          <div class="feature-art-frame"><img src="${asset(p.cover)}" alt="${esc(p.title)} cover artwork"><div class="feature-art-caption"><small>PROJECT ARTWORK</small><strong>${esc(p.title)}</strong></div></div>
          <a class="feature-support-strip" href="#support" data-route="support"><b>HELP 2FLY CREATE</b><span>DECIDE WHAT IT'S WORTH. →</span></a>
        </div>
        <div class="feature-media-console">
          <div class="project-media-row">
            <button class="project-media-tile" id="featureWatch" type="button" ${p.video?'':'disabled'}>${p.video?`<video id="featurePreviewVideo" muted loop playsinline autoplay preload="metadata" poster="${asset(p.poster||p.cover)}" src="${esc(p.video)}"></video><span class="project-video-fullscreen" id="featureVideoFullscreen">FULL SCREEN ↗</span>`:`<img src="${asset(p.poster||p.cover)}" alt="">`}<span class="project-media-label"><small>VISUAL STORY</small><strong>MUSIC VIDEO</strong><span>${p.video?'CLICK TO ACTIVATE VIDEO':'IN PRODUCTION'}</span></span></button>
            <button class="project-media-tile" id="featurePlay" type="button" ${p.experience?'':'disabled'}><img src="${asset(p.cover)}" alt=""><span class="project-media-label"><small>PLAYABLE EXPERIENCE</small><strong>STEP INSIDE</strong><span>${p.experience?'LIVE PREVIEW · EXPAND · FULLSCREEN':'IN DEVELOPMENT'}</span></span></button>
          </div>
          <div class="project-player-skin"><img src="${asset(p.cover)}" alt=""><div class="project-player-copy"><small>PROJECT AUDIO · PLAYS THROUGH GLOBAL PLAYER</small><strong>${esc(p.title)}</strong><span>${esc(p.subtitle||'2Fly Keith Logan')}</span></div><button id="featureListen" type="button" ${p.audio?'':'disabled'} aria-label="Play ${esc(p.title)} in the global player">▶</button></div>
        </div>
      </div>
    </div>`;
  };

  setFeature=function(index,loadAudio=true){
    oldSetFeature(index,loadAudio);
    const p=app.featured[app.featureIndex];if(!p)return;
    const cue=projectCue(p);
    $('#featureDeckNow')&&( $('#featureDeckNow').textContent=p.title.toUpperCase() );
    $('#featureDeckTicker')&&( $('#featureDeckTicker').textContent=`CURRENTLY FEATURING ${p.title.toUpperCase()} · LISTEN · WATCH · STEP INSIDE` );
    $('#featureMetaLeft')&&( $('#featureMetaLeft').textContent=cue.left );
    $('#featureMetaCenter')&&( $('#featureMetaCenter').textContent=p.title );
    $('#featureMetaRight')&&( $('#featureMetaRight').textContent=`PROJECT SIGNAL · ${cue.signal}` );
    $$('#featureTabs [data-feature]').forEach((b,i)=>b.classList.toggle('active',i===app.featureIndex));
    requestAnimationFrame(()=>$('#featureTabs [data-feature].active')?.scrollIntoView({block:'nearest',inline:'center',behavior:'smooth'}));
  };

  function setHelpTaglines(){
    const top=$('.help-create-nav');
    if(top){
      const small=top.querySelector('small');
      if(small){small.classList.add('help-tagline');small.textContent="DECIDE WHAT IT'S WORTH."}
    }
    $$('.home-actions .create').forEach(a=>a.setAttribute('aria-label',"Help 2Fly Create — Decide what it's worth"));
  }

  function reminderTargets(){return $$('.help-create-nav,.feature-support-strip,.home-actions .create').filter(el=>el&&el.offsetParent!==null)}
  function pulse(type){
    reminderTargets().forEach(el=>{
      el.classList.remove('help-nudge','help-flare');void el.offsetWidth;el.classList.add(type);
      setTimeout(()=>el.classList.remove(type),type==='help-flare'?2100:1500);
    });
  }

  function startHelpCadence(){
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const sequence=[
      [12000,'help-nudge'],
      [27000,'help-nudge'],
      [44000,'help-nudge'],
      [68000,'help-flare']
    ];
    sequence.forEach(([delay,type])=>setTimeout(()=>pulse(type),delay));
    setInterval(()=>{
      setTimeout(()=>pulse('help-nudge'),14000);
      setTimeout(()=>pulse('help-nudge'),33000);
      setTimeout(()=>pulse('help-nudge'),54000);
      setTimeout(()=>pulse('help-flare'),80000);
    },102000);
  }

  document.addEventListener('DOMContentLoaded',()=>{
    setHelpTaglines();
    startHelpCadence();
    const observer=new MutationObserver(()=>setHelpTaglines());
    observer.observe(document.body,{childList:true,subtree:true});
  });
})();
