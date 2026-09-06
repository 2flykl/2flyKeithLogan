// Music presentation variants: preserve the current binder as Option 1 and provide
// a separate Premium Build route so future visual experiments cannot overwrite it.
(function(){
  if(typeof route!=='function'||typeof renderMusic!=='function') return;
  const routedBeforeMusicVariants=route;

  function bindMusicMenu(){
    const group=document.getElementById('musicNavGroup');
    const toggle=document.getElementById('musicMenuToggle');
    if(!group||!toggle||toggle.dataset.bound==='1') return;
    toggle.dataset.bound='1';
    toggle.addEventListener('click',e=>{
      e.preventDefault();e.stopPropagation();
      const open=group.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded',String(open));
    });
    document.addEventListener('click',e=>{
      if(group.contains(e.target)) return;
      group.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded','false');
    });
    group.querySelectorAll('.music-nav-menu a').forEach(a=>a.addEventListener('click',()=>{
      group.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded','false');
    }));
  }

  function renderMusicPremium(){
    const projects=musicProjects();
    if(!projects.length){
      $('#appView').innerHTML='<section class="music-binder-page music-premium-page"><p class="empty">Music catalog data is unavailable.</p></section>';
      return;
    }
    app.musicPremiumIndex=Math.min(app.musicPremiumIndex||0,projects.length-1);
    app.musicPremiumPage=app.musicPremiumPage||0;
    const perPage=6,pages=Math.max(1,Math.ceil(projects.length/perPage));
    app.musicPremiumPage=Math.min(app.musicPremiumPage,pages-1);

    $('#appView').innerHTML=`<section class="music-binder-page music-premium-page">
      <div class="music-variant-banner"><div><small>MUSIC PRESENTATION</small><strong>OPTION 2 · PREMIUM BUILD</strong></div><a href="#music" data-route="music">VIEW OPTION 1 →</a></div>
      <div class="specialty-hero premium-music-hero"><div class="kicker">THE MUSIC ARCHIVE · PREMIUM PHYSICAL-MEDIA STUDY</div><h1>MUSIC.</h1><p>This alternate build preserves the original binder page while giving us a separate premium presentation to develop, compare, and refine without losing progress.</p></div>
      <div class="binder-shell premium-binder-shell">
        <div class="binder-spine"><span>2FLY</span><i></i><b>PREMIUM ARCHIVE</b></div>
        <div class="binder-book"><div class="binder-page-label"><button id="premiumBinderPrev" type="button">← PREV PAGE</button><span id="premiumBinderPageLabel"></span><button id="premiumBinderNext" type="button">NEXT PAGE →</button></div><div class="sleeve-grid" id="premiumSleeveGrid"></div></div>
        <aside class="disc-detail" id="premiumDiscDetail"></aside>
      </div>${helpModule()}
    </section>`;

    const drawPage=()=>{
      const start=app.musicPremiumPage*perPage,slice=projects.slice(start,start+perPage);
      $('#premiumBinderPageLabel').textContent=`PREMIUM PAGE ${String(app.musicPremiumPage+1).padStart(2,'0')} / ${String(pages).padStart(2,'0')}`;
      $('#premiumSleeveGrid').innerHTML=slice.map(p=>{
        const idx=projects.indexOf(p);
        return `<button class="cd-sleeve premium-cd-sleeve ${idx===app.musicPremiumIndex?'selected':''}" data-premium-music-index="${idx}" type="button"><span class="sleeve-plastic"></span><span class="compact-disc"><img src="${asset(p.cover)}" alt=""><i></i></span><strong>${esc(p.title)}</strong><small>${esc(p.subtitle||'2Fly Keith Logan')}</small></button>`;
      }).join('');
      $('#premiumSleeveGrid').querySelectorAll('[data-premium-music-index]').forEach(b=>b.onclick=()=>selectPremiumMusic(+b.dataset.premiumMusicIndex));
    };

    $('#premiumBinderPrev').onclick=()=>{app.musicPremiumPage=(app.musicPremiumPage-1+pages)%pages;drawPage()};
    $('#premiumBinderNext').onclick=()=>{app.musicPremiumPage=(app.musicPremiumPage+1)%pages;drawPage()};
    drawPage();
    selectPremiumMusic(app.musicPremiumIndex,false);
  }

  function selectPremiumMusic(index,redraw=true){
    const projects=musicProjects(),p=projects[index];if(!p)return;
    app.musicPremiumIndex=index;
    if(redraw)$$('.premium-cd-sleeve').forEach(b=>b.classList.toggle('selected',+b.dataset.premiumMusicIndex===index));
    const tracks=p.tracks?.length?p.tracks:[{title:p.title,src:p.audio}];
    $('#premiumDiscDetail').innerHTML=`<div class="disc-out premium-disc-out"><div class="disc-shine"></div><img src="${asset(p.cover)}" alt="${esc(p.title)} disc artwork"><span></span></div><div class="disc-copy"><div class="kicker">PREMIUM BUILD · SELECTED DISC</div><h2>${esc(p.title)}</h2><p>${esc(p.description||p.subtitle||'')}</p><div class="disc-tracklist">${tracks.map((t,i)=>`<button type="button" data-premium-track="${i}"><b>${String(i+1).padStart(2,'0')}</b><span>${esc(t.title||`Track ${i+1}`)}</span><em>▶</em></button>`).join('')}</div><div class="disc-actions"><button id="playPremiumDisc" type="button">PLAY IN GLOBAL PLAYER</button>${p.experience?'<button id="enterPremiumPlayable" type="button">ENTER PLAYABLE</button>':''}</div></div>`;
    $('#playPremiumDisc').onclick=()=>loadProjectAudio(p,true);
    $('#enterPremiumPlayable')?.addEventListener('click',()=>location.href=asset(p.experience));
    $$('#premiumDiscDetail [data-premium-track]').forEach(b=>b.onclick=()=>playProjectTrack(p,tracks,+b.dataset.premiumTrack));
  }

  route=function(){
    const raw=(location.hash||'#home').slice(1).split('?')[0];
    if(raw!=='music-premium'){
      routedBeforeMusicVariants();
      const musicTrigger=document.querySelector('.music-nav-group > [data-route="music"]');
      if(musicTrigger&&app.route==='music') musicTrigger.classList.add('active');
      return;
    }
    app.route='music-premium';
    $$('#primaryNav [data-route]').forEach(a=>a.classList.remove('active'));
    document.querySelector('.music-nav-group > [data-route="music"]')?.classList.add('active');
    document.querySelector('[data-route="music-premium"]')?.classList.add('active');
    document.body.dataset.route='music-premium';
    renderMusicPremium();
    window.scrollTo({top:0,left:0,behavior:'auto'});
    $('#appView').focus({preventScroll:true});
  };

  bindMusicMenu();
})();
