// Featured cinematic layer — documentary focus mode + inline carousel placement.
(function(){
  const baseBindFeature=bindFeature;
  const baseSetFeature=setFeature;

  function supportButton(){
    return `<a class="feature-support-strip doc-support-strip" href="#support" data-route="support"><b>HELP 2FLY CREATE</b><span>DECIDE WHAT IT'S WORTH. →</span></a>`;
  }

  // Standard Featured layout with an explicit carousel anchor INSIDE the right-side
  // media console, immediately below the project audio/song panel.
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
          <div class="feature-deck-anchor" id="featureDeckAnchor" aria-label="Featured project carousel location"></div>
        </div>
      </div>
    </div>`;
  };

  documentary=function(p){
    const clips=p.clips||[],first=clips[0]||{};
    const poster=asset(p.cover||p.poster);
    return `<section class="feature-doc feature-doc-cinema">
      <div class="doc-focus-shade" id="docFocusShade" aria-hidden="true"></div>
      <header class="doc-feature-title"><small>DOCUMENTARY FEATURE</small><h1>${esc(p.title.toUpperCase())}</h1></header>
      <div class="doc-cinema-grid">
        <aside class="doc-wing doc-wing-left">
          <div class="doc-art-thumb"><img src="${poster}" alt="${esc(p.title)} artwork"><span>PROJECT ARTWORK</span></div>
          ${supportButton()}
        </aside>
        <div class="doc-center-stage">
          <div class="doc-player">
            <video id="docVideo" controls playsinline preload="metadata" poster="${asset(first.poster||p.poster||p.cover)}"></video>
            <button class="doc-focus-exit" id="docFocusExit" type="button">EXIT FOCUS ×</button>
            <div class="doc-meta"><div><small id="docCounter">CHAPTER 01 / ${String(clips.length).padStart(2,'0')}</small><strong id="docTitle">${esc(first.title||p.title)}</strong></div></div>
          </div>
        </div>
        <aside class="doc-wing doc-wing-right">
          <div class="doc-art-thumb"><img src="${poster}" alt="${esc(p.title)} artwork"><span>PROJECT ARTWORK</span></div>
          ${supportButton()}
        </aside>
      </div>
      <div class="doc-chapter-shell" aria-label="Documentary chapter navigation">
        <button class="doc-chapter-arrow" id="docPrevChapter" type="button" aria-label="Previous documentary chapter">←</button>
        <div class="chapter-rail" id="chapterRail">${clips.map((c,i)=>`<button data-chapter="${i}" type="button"><img src="${asset(c.poster||p.poster||p.cover)}" alt=""><span><small>${String(i+1).padStart(2,'0')}</small><strong>${esc(c.title)}</strong></span></button>`).join('')}</div>
        <button class="doc-chapter-arrow" id="docNextChapter" type="button" aria-label="Next documentary chapter">→</button>
      </div>
      <div class="doc-feature-footer-slot" aria-label="Featured project carousel location"></div>
    </section>`;
  };

  function placeFeatureDeck(){
    const deck=$('#featureDeck');
    if(!deck)return;
    const p=app.featured[app.featureIndex];
    if(p?.id==='africa'){
      const slot=$('.doc-feature-footer-slot');
      if(slot)slot.appendChild(deck);
      deck.classList.add('feature-deck-cinema');
      deck.classList.remove('feature-deck-inline');
      return;
    }
    const anchor=$('#featureDeckAnchor');
    if(anchor)anchor.appendChild(deck);
    deck.classList.add('feature-deck-inline');
    deck.classList.remove('feature-deck-cinema');
  }

  setFeature=function(index,loadAudio=true){
    document.body.classList.remove('doc-focus-mode');
    const deck=$('#featureDeck'),content=$('#featureContent');
    if(deck&&content&&content.contains(deck))content.after(deck);
    baseSetFeature(index,loadAudio);
    placeFeatureDeck();
  };

  function clickChapter(index){
    const clips=app.featured[app.featureIndex]?.clips||[];
    if(!clips.length)return;
    const i=(index+clips.length)%clips.length;
    $(`#chapterRail [data-chapter="${i}"]`)?.click();
  }

  function enterFocus(){document.body.classList.add('doc-focus-mode')}
  function exitFocus(){document.body.classList.remove('doc-focus-mode')}

  bindFeature=function(p){
    baseBindFeature(p);
    if(p.id!=='africa')return;
    const video=$('#docVideo');
    $('#docPrevChapter')?.addEventListener('click',()=>clickChapter(app.docIndex-1));
    $('#docNextChapter')?.addEventListener('click',()=>clickChapter(app.docIndex+1));
    $('#docFocusExit')?.addEventListener('click',()=>{video?.pause();exitFocus();video?.focus()});
    video?.addEventListener('play',enterFocus);
    video?.addEventListener('pause',exitFocus);
    video?.addEventListener('ended',exitFocus);
  };

  document.addEventListener('keydown',e=>{
    if(e.key!=='Escape'||!document.body.classList.contains('doc-focus-mode'))return;
    const video=$('#docVideo');
    video?.pause();
    exitFocus();
    video?.focus();
  });
  document.addEventListener('click',e=>{if(e.target.closest('[data-route]')&&!e.target.closest('.doc-support-strip'))exitFocus()});
  window.addEventListener('hashchange',exitFocus);
})();
