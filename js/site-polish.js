// Shell/Featured polish layer. Loaded last so it can refine renderers without replacing the underlying data model.
(function(){
  const themeIcons={fire:'🔥',streams:'≈',africa:'◎',away:'↻',black_gifted:'♛'};
  const themeLabels={fire:'RESILIENCE',streams:'LEGACY',africa:'AWAKENING',away:'REFLECTION',black_gifted:'ALIGNMENT'};
  const highlightWords=['PLAYABLE','EXPERIENCE','EXPERIENCES','CREATE','LISTEN','WATCH','NEW','VALUE','ATTENTION','MUSIC','VIDEO','2FLY'];

  const originalTick=tick;
  tick=function(items){
    return [...items,...items].map((raw,i)=>{
      let text=esc(raw);
      highlightWords.forEach(word=>{
        const re=new RegExp(`\\b${word}\\b`,'g');
        text=text.replace(re,`<span class="ticker-keyword">${word}</span>`);
      });
      return `<span class="ticker-item tone-${i%5}">${text}</span>`;
    }).join('');
  };

  renderHome=function(){
    $('#appView').innerHTML=`<section class="home-splash polished-home"><div class="home-copy"><div class="kicker">THE 2FLY ANTI-ALGORITHM EXPERIMENT</div><h1 class="site-domain"><span>2FLYKEITHLOGAN.COM</span><em>THE BIRTHPLACE OF PLAYABLE EXPERIENCES</em></h1><p>Music is the foundation. Visuals expand the world. Playable Experiences let you step inside it. Explore the work without a ranking deciding what reaches you, then decide what the experience is worth.</p><div class="home-actions"><a class="primary" href="#featured" data-route="featured">EXPLORE FEATURED →</a><a href="#playables" data-route="playables">ENTER PLAYABLES</a><a class="create" href="#support" data-route="support">HELP 2FLY CREATE</a></div></div><aside class="home-portals"><a href="#featured" data-route="featured"><b>01</b><div><strong>FEATURED</strong><small>Music, visuals, Playables and project worlds in one spotlight.</small></div><span>→</span></a><a href="#playables" data-route="playables"><b>02</b><div><strong>PLAYABLES</strong><small>Enter the complete interactive library.</small></div><span>→</span></a><a href="#music" data-route="music"><b>03</b><div><strong>MUSIC</strong><small>Open the disc archive and hear the work that starts each world.</small></div><span>→</span></a><a href="#videos" data-route="videos"><b>04</b><div><strong>VIDEOS</strong><small>Enter the VHS room and watch the visual archive.</small></div><span>→</span></a></aside><div class="home-note"><span>2FLYKEITHLOGAN.COM · MUSIC · VIDEO · SOFTWARE · STORYTELLING</span><span>EXPERIENCE FIRST · DECIDE SECOND · PARTICIPATE YOUR WAY</span></div></section>`;
  };

  standardFeature=function(p){
    return `<div class="feature-control-room">
      <div class="feature-project-title"><div><div class="kicker">${esc((p.subtitle||'FEATURED PROJECT').toUpperCase())}</div><h1>${esc(p.title)}</h1></div><div class="project-word"><small>PROJECT SIGNAL</small><strong>${esc((p.word||'FEATURED').toUpperCase())}</strong></div></div>
      <div class="feature-room-grid">
        <div class="feature-art-zone"><div class="feature-art-frame"><img src="${asset(p.cover)}" alt="${esc(p.title)} cover artwork"><div class="feature-art-caption"><small>PROJECT ARTWORK</small><strong>${esc(p.title)}</strong></div></div><a class="feature-support-strip" href="#support" data-route="support"><b>HELP 2FLY CREATE</b><span>SUPPORT THIS WORLD →</span></a></div>
        <div class="feature-media-console">
          <div class="project-player-skin"><img src="${asset(p.cover)}" alt=""><div class="project-player-copy"><small>PROJECT AUDIO · PLAYS THROUGH GLOBAL PLAYER</small><strong>${esc(p.title)}</strong><span>${esc(p.subtitle||'2Fly Keith Logan')}</span></div><button id="featureListen" type="button" ${p.audio?'':'disabled'} aria-label="Play ${esc(p.title)} in the global player">▶</button></div>
          <div class="project-media-row">
            <button class="project-media-tile" id="featureWatch" type="button" ${p.video?'':'disabled'}>${p.video?`<video id="featurePreviewVideo" muted loop playsinline autoplay preload="metadata" poster="${asset(p.poster||p.cover)}" src="${esc(p.video)}"></video><span class="project-video-fullscreen" id="featureVideoFullscreen">FULL SCREEN ↗</span>`:`<img src="${asset(p.poster||p.cover)}" alt="">`}<span class="project-media-label"><small>VISUAL STORY</small><strong>MUSIC VIDEO</strong><span>${p.video?'CLICK TO ACTIVATE VIDEO':'IN PRODUCTION'}</span></span></button>
            <button class="project-media-tile" id="featurePlay" type="button" ${p.experience?'':'disabled'}><img src="${asset(p.cover)}" alt=""><span class="project-media-label"><small>PLAYABLE EXPERIENCE</small><strong>STEP INSIDE</strong><span>${p.experience?'PREVIEW · EXPAND · FULLSCREEN':'IN DEVELOPMENT'}</span></span></button>
          </div>
        </div>
      </div>
    </div>`;
  };

  documentary=function(p){
    const clips=p.clips||[],first=clips[0]||{};
    return `<div class="feature-control-room feature-documentary-room">
      <div class="feature-project-title"><div><div class="kicker">DOCUMENTARY FEATURE · RWANDA</div><h1>${esc(p.title)}</h1></div><div class="project-word"><small>PROJECT SIGNAL</small><strong>${esc((p.word||'AWAKENING').toUpperCase())}</strong></div></div>
      <div class="feature-room-grid">
        <div class="feature-art-zone"><div class="feature-art-frame documentary-key-art"><img src="${asset(p.cover)}" alt="${esc(p.title)} artwork"><div class="feature-art-caption"><small>DOCUMENTARY / PROJECT ART</small><strong>Did I wake up in Africa—or did Africa wake me up?</strong></div></div><a class="feature-support-strip" href="#support" data-route="support"><b>HELP 2FLY CREATE</b><span>CONTINUE THE JOURNEY →</span></a></div>
        <div class="feature-media-console documentary-console">
          <div class="featured-doc-screen"><video id="docVideo" controls playsinline preload="metadata" poster="${asset(first.poster||p.poster||p.cover)}"></video><div class="featured-doc-meta"><div><small id="docCounter">CHAPTER 01 / ${String(clips.length).padStart(2,'0')}</small><strong id="docTitle">${esc(first.title||p.title)}</strong></div><button id="featureListen" type="button">♫ SOUNDTRACK</button></div></div>
          <div class="documentary-chapter-grid" id="chapterRail">${clips.map((c,i)=>`<button type="button" data-chapter="${i}"><img src="${asset(c.poster||p.poster||p.cover)}" alt=""><b>${String(i+1).padStart(2,'0')}</b><span>${esc(c.title)}</span></button>`).join('')}</div>
          <div class="documentary-related-playables"><button type="button" data-open-playable="../games/africa/index.html" data-playable-title="PNG / Intention Certification"><small>RELATED PLAYABLE 01</small><strong>PNG / INTENTION CERTIFICATION</strong></button><button type="button" data-open-playable="../games/BlackandGifted/index.html" data-playable-title="Black & Gifted"><small>RELATED PLAYABLE 02</small><strong>BLACK & GIFTED</strong></button></div>
        </div>
      </div>
    </div>`;
  };

  const originalSetFeature=setFeature;
  setFeature=function(index,loadAudio=true){
    const list=app.featured||[];
    if(list.length){const normalized=(index+list.length)%list.length;document.body.dataset.feature=list[normalized]?.id||'generic'}
    originalSetFeature(index,loadAudio);
  };

  const originalRenderFeatured=renderFeatured;
  renderFeatured=function(){
    originalRenderFeatured();
    decorateFeatureTabs();
  };
  function decorateFeatureTabs(){
    $$('#featureTabs button').forEach((button,i)=>{
      const p=app.featured[i];if(!p)return;
      button.innerHTML=`<span class="feature-nav-icon">${themeIcons[p.id]||'✦'}</span><span class="feature-nav-copy"><strong>${esc(p.title.toUpperCase())}</strong><small>${esc(themeLabels[p.id]||p.word||'FEATURED')}</small></span>`;
    });
  }

  bindFeature=function(p){
    $('#featureListen')?.addEventListener('click',()=>loadProjectAudio(p,true));
    const preview=$('#featurePreviewVideo');
    $('#featureWatch')?.addEventListener('click',e=>{
      if(e.target.closest('#featureVideoFullscreen'))return;
      if(!preview){if(p.video)window.open(p.video,'_blank','noopener');return}
      preview.controls=true;preview.muted=false;preview.loop=false;preview.play().catch(()=>{});
    });
    $('#featureVideoFullscreen')?.addEventListener('click',e=>{e.stopPropagation();preview?.requestFullscreen?.()});
    $('#featurePlay')?.addEventListener('click',()=>{if(p.experience)openPlayableViewer(asset(p.experience),p.title)});
    if(p.id==='africa'){
      const clips=p.clips||[];
      const select=i=>{if(!clips.length)return;app.docIndex=(i+clips.length)%clips.length;const c=clips[app.docIndex],v=$('#docVideo');v.pause();v.src=c.src||'';v.poster=asset(c.poster||p.poster||p.cover);v.load();$('#docCounter').textContent=`CHAPTER ${String(app.docIndex+1).padStart(2,'0')} / ${String(clips.length).padStart(2,'0')}`;$('#docTitle').textContent=c.title||p.title;$$('#chapterRail [data-chapter]').forEach((b,j)=>b.classList.toggle('active',j===app.docIndex))};
      $('#chapterRail')?.addEventListener('click',e=>{const b=e.target.closest('[data-chapter]');if(b)select(+b.dataset.chapter)});select(0);
    }
  };

  const originalPlayableCard=playableCard;
  playableCard=function(p){
    const status=p.status.replace('-',' ').toUpperCase();
    return `<article class="playable-library-card" style="--card-accent:${esc(p.accent)}"><div class="playable-card-head"><span class="playable-glyph">${esc(p.glyph)}</span><div><small>${esc(p.format)}</small><b>${esc(status)}</b></div></div><h2>${esc(p.title)}</h2><p>${esc(p.description)}</p><div class="playable-card-foot"><span>${esc(p.category==='music'?'MUSIC PLAYABLE':'STORY EXPERIENCE')}</span><a href="${esc(p.path)}" data-playable-launch data-playable-title="${esc(p.title)}">ENTER PLAYABLE →</a></div></article>`;
  };

  function ensurePlayableViewer(){
    let viewer=$('#playableViewer');if(viewer)return viewer;
    viewer=document.createElement('div');viewer.id='playableViewer';viewer.className='playable-viewer';viewer.setAttribute('aria-hidden','true');
    viewer.innerHTML=`<div class="playable-viewer-shell"><div class="playable-viewer-bar"><strong id="playableViewerTitle">PLAYABLE EXPERIENCE</strong><button id="playableViewerExpand" type="button">EXPAND</button><button id="playableViewerFullscreen" type="button">FULLSCREEN</button><a id="playableViewerOpen" href="#" target="_blank" rel="noopener">OPEN BY ITSELF ↗</a><button id="playableViewerClose" type="button">CLOSE ✕</button></div><div class="playable-stage"><iframe id="playableViewerFrame" title="Playable Experience" allow="autoplay; fullscreen; gamepad" allowfullscreen></iframe></div></div>`;
    document.body.appendChild(viewer);
    $('#playableViewerClose').onclick=closePlayableViewer;
    $('#playableViewerExpand').onclick=()=>viewer.classList.toggle('expanded');
    $('#playableViewerFullscreen').onclick=()=>viewer.querySelector('.playable-stage')?.requestFullscreen?.();
    viewer.addEventListener('click',e=>{if(e.target===viewer)closePlayableViewer()});
    window.addEventListener('keydown',e=>{if(e.key==='Escape'&&viewer.classList.contains('open')&&!document.fullscreenElement)closePlayableViewer()});
    return viewer;
  }
  function openPlayableViewer(url,title='Playable Experience'){
    const viewer=ensurePlayableViewer();$('#playableViewerTitle').textContent=title.toUpperCase();$('#playableViewerFrame').src=url;$('#playableViewerOpen').href=url;viewer.classList.add('open');viewer.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
  }
  function closePlayableViewer(){const viewer=$('#playableViewer');if(!viewer)return;viewer.classList.remove('open','expanded');viewer.setAttribute('aria-hidden','true');$('#playableViewerFrame').src='about:blank';document.body.style.overflow=''}

  document.addEventListener('click',e=>{
    const direct=e.target.closest('[data-open-playable]');
    if(direct){e.preventDefault();openPlayableViewer(direct.dataset.openPlayable,direct.dataset.playableTitle||'Playable Experience');return}
    const link=e.target.closest('a[data-playable-launch], .africa-playable-card[href*="../games/"], .playable-card[href*="../games/"]');
    if(!link||e.metaKey||e.ctrlKey||e.shiftKey||link.target==='_blank')return;
    e.preventDefault();openPlayableViewer(link.getAttribute('href'),link.dataset.playableTitle||link.textContent.trim()||'Playable Experience');
  });

  document.addEventListener('DOMContentLoaded',()=>{
    ensurePlayableViewer();
    const t=$('#globalTickerTrack');if(t&&tickerItems?.length)t.innerHTML=tick(tickerItems);
  });
})();
