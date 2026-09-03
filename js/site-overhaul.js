const app={projects:[],featured:[],playables:[],route:'home',featureIndex:0,trackIndex:0,docIndex:0};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const tickerItems=['THE 2FLY ANTI-ALGORITHM EXPERIMENT','PLAYABLE EXPERIENCES ARE BORN HERE','LISTEN · WATCH · STEP INSIDE THE WORK','NEW BUILDS AND PROJECTS ARE ALWAYS IN MOTION','EXPERIENCE FIRST · DECIDE SECOND'];
const helpTicker=['HELP FUND THE NEXT PLAYABLE EXPERIENCE','SUPPORT INDEPENDENT MUSIC · VIDEO · SOFTWARE · STORYTELLING','YOUR SUPPORT HELPS TURN IDEAS INTO WORKING EXPERIENCES','PARTICIPATE IN WHAT 2FLY BUILDS NEXT'];

const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function asset(path){if(!path)return'';if(/^https?:\/\//i.test(path)||path.startsWith('data:'))return path;return `../${path.replace(/^\//,'')}`}
function tick(items){return [...items,...items].map(x=>`<span>${esc(x)}</span>`).join('')}
function time(n){if(!Number.isFinite(n))return'0:00';return`${Math.floor(n/60)}:${String(Math.floor(n%60)).padStart(2,'0')}`}

async function init(){
  $('#globalTickerTrack').innerHTML=tick(tickerItems);
  bindShell(); bindPlayer();
  const [projects,playables]=await Promise.allSettled([
    fetch('../data/projects.json?v=4.0.3').then(r=>r.ok?r.json():[]),
    fetch('../data/playables-overhaul.json?v=0.2.0').then(r=>r.ok?r.json():[])
  ]);
  app.projects=projects.status==='fulfilled'?projects.value:[];
  app.featured=app.projects.filter(p=>p.featured&&p.explore);
  app.playables=playables.status==='fulfilled'?playables.value:[];
  restorePlayer(); route();
  window.addEventListener('hashchange',route);
}
function bindShell(){
  document.addEventListener('click',e=>{
    const routeLink=e.target.closest('[data-route]');
    if(routeLink){e.preventDefault();location.hash=routeLink.dataset.route;$('#primaryNav').classList.remove('open');$('#menuToggle').setAttribute('aria-expanded','false')}
  });
  $('#menuToggle').addEventListener('click',()=>{const open=$('#primaryNav').classList.toggle('open');$('#menuToggle').setAttribute('aria-expanded',String(open))});
  let compact=false;
  window.addEventListener('scroll',()=>{const next=window.scrollY>90;if(next!==compact){compact=next;$('#siteShell').classList.toggle('compact',compact)}},{passive:true});
}
function route(){
  const raw=(location.hash||'#home').slice(1).split('?')[0];
  app.route=['home','featured','playables'].includes(raw)?raw:'home';
  $$('#primaryNav [data-route]').forEach(a=>a.classList.toggle('active',a.dataset.route===app.route));
  document.body.dataset.route=app.route;
  if(app.route==='home')renderHome();
  if(app.route==='featured')renderFeatured();
  if(app.route==='playables')renderPlayables();
  window.scrollTo({top:0,behavior:'instant'}); $('#appView').focus({preventScroll:true});
}
function renderHome(){
  $('#appView').innerHTML=`<section class="home-splash"><div class="home-copy"><div class="kicker">THE 2FLY ANTI-ALGORITHM EXPERIMENT</div><h1><span>ENTER</span><em>2FLY.</em></h1><p>Music is the foundation. Visuals expand the world. Playable Experiences let you step inside it. Explore the work without a ranking deciding what reaches you, then decide what the experience is worth.</p><div class="home-actions"><a class="primary" href="#featured" data-route="featured">ENTER FEATURED →</a><a href="#playables" data-route="playables">EXPLORE PLAYABLES</a><a class="create" href="legacy-site.html#support">HELP 2FLY CREATE</a></div></div><aside class="home-portals"><a href="#featured" data-route="featured"><b>01</b><div><strong>FEATURED</strong><small>What 2Fly is spotlighting right now.</small></div><span>→</span></a><a href="#playables" data-route="playables"><b>02</b><div><strong>PLAYABLES</strong><small>Enter the complete interactive library.</small></div><span>→</span></a><a href="legacy-site.html#music"><b>03</b><div><strong>MUSIC</strong><small>Hear the work that starts each world.</small></div><span>→</span></a><a href="legacy-site.html#videos"><b>04</b><div><strong>VIDEOS</strong><small>Watch the visual stories and documentary work.</small></div><span>→</span></a></aside><div class="home-note"><span>THE BIRTHPLACE OF PLAYABLE EXPERIENCES</span><span>EXPERIENCE FIRST · DECIDE SECOND · PARTICIPATE YOUR WAY</span></div></section>`;
}
function renderFeatured(){
  $('#appView').innerHTML=`<section class="featured-stage"><div class="feature-backdrop" id="featureBackdrop"></div><div class="feature-noise"></div><div class="carousel-head"><div><small>FEATURED</small><strong id="featureCounter">01 / 01</strong></div><div class="carousel-controls"><button id="featurePrev" type="button">←</button><div class="feature-tabs" id="featureTabs"></div><button id="featureNext" type="button">→</button></div></div><div class="feature-content" id="featureContent"></div><div class="feature-spare-space"><small>EXPANDABLE PROJECT SPACE</small><p>Credits, notes, lyrics, development updates, collaborators and project-specific information can live here without rebuilding the page.</p></div>${helpModule()}</section>`;
  const tabs=$('#featureTabs');tabs.innerHTML=app.featured.map((p,i)=>`<button data-feature="${i}" type="button">${esc(p.title.toUpperCase())}</button>`).join('');
  tabs.addEventListener('click',e=>{const b=e.target.closest('[data-feature]');if(b)setFeature(+b.dataset.feature)});
  $('#featurePrev').onclick=()=>setFeature(app.featureIndex-1);$('#featureNext').onclick=()=>setFeature(app.featureIndex+1);setFeature(app.featureIndex,false);
}
function setFeature(index,loadAudio=true){
  if(!app.featured.length){$('#featureContent').innerHTML='<p class="empty">Featured project data is unavailable.</p>';return}
  app.featureIndex=(index+app.featured.length)%app.featured.length;const p=app.featured[app.featureIndex];
  document.documentElement.style.setProperty('--accent',p.accent||'#e45b28');document.documentElement.style.setProperty('--accent2',p.accent2||'#23100b');
  $('#featureBackdrop').style.backgroundImage=`url("${asset(p.poster||p.cover)}")`;$('#featureCounter').textContent=`${String(app.featureIndex+1).padStart(2,'0')} / ${String(app.featured.length).padStart(2,'0')}`;
  $$('#featureTabs button').forEach((b,i)=>b.classList.toggle('active',i===app.featureIndex));
  $('#featureContent').innerHTML=p.id==='africa'?documentary(p):standardFeature(p);bindFeature(p);if(loadAudio&&p.audio)loadProjectAudio(p,false);
}
function standardFeature(p){return`<div class="feature-standard"><div class="feature-art"><img src="${asset(p.cover)}" alt="${esc(p.title)} cover artwork"></div><div class="feature-info"><div class="kicker">${esc((p.word||'FEATURED PROJECT').toUpperCase())} · FEATURED PROJECT</div><h1>${esc(p.title.toUpperCase())}</h1><p class="subtitle">${esc(p.subtitle||'')}</p><p class="desc">${esc(p.description||'')}</p><div class="format-row"><button id="featureListen" ${p.audio?'':'disabled'}><span>01</span><strong>LISTEN</strong><small>${p.audio?'HEAR THE WORK':'IN DEVELOPMENT'}</small></button><button id="featureWatch" ${p.video?'':'disabled'}><span>02</span><strong>WATCH</strong><small>${p.video?'SEE THE STORY':'IN PRODUCTION'}</small></button><button id="featurePlay" ${p.experience?'':'disabled'}><span>03</span><strong>PLAYABLE</strong><small>${p.experience?'STEP INSIDE':'IN DEVELOPMENT'}</small></button></div></div></div>`}
function documentary(p){const clips=p.clips||[],first=clips[0]||{};return`<div class="feature-doc"><div><div class="doc-player"><video id="docVideo" controls playsinline preload="metadata" poster="${asset(first.poster||p.poster||p.cover)}"></video><div class="doc-meta"><div><small id="docCounter">CHAPTER 01 / ${String(clips.length).padStart(2,'0')}</small><strong id="docTitle">${esc(first.title||p.title)}</strong></div></div></div><div class="chapter-rail" id="chapterRail">${clips.map((c,i)=>`<button data-chapter="${i}">${String(i+1).padStart(2,'0')} · ${esc(c.title)}</button>`).join('')}</div></div><aside class="doc-side"><div class="kicker">DOCUMENTARY FEATURE</div><h1>${esc(p.title.toUpperCase())}</h1><p>${esc(p.description||'')}</p><div class="playable-stack"><a class="playable-card" href="../games/africa/index.html"><small>PLAYABLE EXPERIENCE 01</small><strong>PNG / INTENTION CERTIFICATION</strong></a><a class="playable-card" href="../games/BlackandGifted/index.html"><small>PLAYABLE EXPERIENCE 02</small><strong>BLACK & GIFTED</strong></a><button class="playable-card" id="featureListen"><small>SOUNDTRACK</small><strong>LISTEN TO THE PROJECT</strong></button></div></aside></div>`}
function bindFeature(p){
  $('#featureListen')?.addEventListener('click',()=>loadProjectAudio(p,true));$('#featureWatch')?.addEventListener('click',()=>p.video&&window.open(p.video,'_blank','noopener'));$('#featurePlay')?.addEventListener('click',()=>p.experience&&(location.href=asset(p.experience)));
  if(p.id==='africa'){const clips=p.clips||[];const select=i=>{if(!clips.length)return;app.docIndex=(i+clips.length)%clips.length;const c=clips[app.docIndex],v=$('#docVideo');v.pause();v.src=c.src||'';v.poster=asset(c.poster||p.poster||p.cover);v.load();$('#docCounter').textContent=`CHAPTER ${String(app.docIndex+1).padStart(2,'0')} / ${String(clips.length).padStart(2,'0')}`;$('#docTitle').textContent=c.title||p.title;$$('#chapterRail button').forEach((b,j)=>b.classList.toggle('active',j===app.docIndex))};$('#chapterRail')?.addEventListener('click',e=>{const b=e.target.closest('[data-chapter]');if(b)select(+b.dataset.chapter)});select(0)}
}
function helpModule(){return`<section class="help-create-module"><div><small>INDEPENDENT WORK · COMMUNITY-SUPPORTED</small><h2>HELP 2FLY CREATE.</h2><p>Experience it first. If it connects with you, help move the next piece of the work forward.</p></div><a href="legacy-site.html#support">HELP BUILD WHAT COMES NEXT <span>→</span></a></section><div class="help-ticker"><div class="ticker-track">${tick(helpTicker)}</div></div>`}
function renderPlayables(){
  $('#appView').innerHTML=`<section class="playables-page"><div class="playables-hero"><div class="kicker">THE COMPLETE INTERACTIVE LIBRARY</div><h1>PLAYABLES.</h1><p>Released work, featured experiences and works-in-progress now live in one public library. “Test Lab” remains an internal development status—not a separate destination.</p></div><div class="filter-bar" id="playableFilters"><button class="active" data-filter="all">ALL</button><button data-filter="featured">FEATURED</button><button data-filter="released">RELEASED</button><button data-filter="in-development">IN DEVELOPMENT</button><button data-filter="experimental">EXPERIMENTS</button><button data-filter="music">MUSIC PLAYABLES</button><button data-filter="story">STORY EXPERIENCES</button></div><div class="playables-grid" id="playablesGrid"></div>${helpModule()}</section>`;
  const render=filter=>{const list=app.playables.filter(p=>filter==='all'||(filter==='featured'&&p.featured)||p.status===filter||p.category===filter);$('#playablesGrid').innerHTML=list.map(playableCard).join('')||'<p class="empty">No Playables match this filter yet.</p>'};
  $('#playableFilters').onclick=e=>{const b=e.target.closest('[data-filter]');if(!b)return;$$('#playableFilters button').forEach(x=>x.classList.toggle('active',x===b));render(b.dataset.filter)};render('all');
}
function playableCard(p){const status=p.status.replace('-',' ').toUpperCase();return`<article class="playable-library-card" style="--card-accent:${esc(p.accent)}"><div class="playable-card-head"><span class="playable-glyph">${esc(p.glyph)}</span><div><small>${esc(p.format)}</small><b>${esc(status)}</b></div></div><h2>${esc(p.title)}</h2><p>${esc(p.description)}</p><div class="playable-card-foot"><span>${esc(p.category==='music'?'MUSIC PLAYABLE':'STORY EXPERIENCE')}</span><a href="${esc(p.path)}">ENTER PLAYABLE →</a></div></article>`}

function bindPlayer(){
  const a=$('#globalAudio');a.volume=.75;
  $('#playerPlay').onclick=async()=>{if(!a.src){const p=app.featured.find(x=>x.audio);if(p)loadProjectAudio(p,true);return}if(a.paused){try{await a.play()}catch{}}else a.pause()};
  $('#playerPrev').onclick=()=>stepTrack(-1);$('#playerNext').onclick=()=>stepTrack(1);$('#playerSeek').oninput=e=>{if(Number.isFinite(a.duration)&&a.duration>0)a.currentTime=(+e.target.value/100)*a.duration};$('#playerVolume').oninput=e=>{a.volume=+e.target.value;savePlayer()};
  $('#detachPlayer').onclick=()=>alert('The pop-out player is reserved for the Music-page phase. Playback is already persistent while moving between Home, Featured and Playables.');
  a.onplay=()=>{$('#playerPlay').textContent='❚❚';savePlayer()};a.onpause=()=>{$('#playerPlay').textContent='▶';savePlayer()};a.ontimeupdate=()=>{$('#playerCurrent').textContent=time(a.currentTime);$('#playerDuration').textContent=time(a.duration);$('#playerSeek').value=Number.isFinite(a.duration)&&a.duration>0?(a.currentTime/a.duration)*100:0;if(Math.floor(a.currentTime)%3===0)savePlayer()};a.onended=()=>stepTrack(1);
}
function tracks(){return app.featured.filter(p=>p.audio)}
function loadProjectAudio(p,autoplay=false){if(!p?.audio)return;const a=$('#globalAudio'),list=tracks();app.trackIndex=Math.max(0,list.findIndex(x=>x.id===p.id));a.src=p.audio;a.load();$('#playerCover').src=asset(p.cover);$('#playerCover').alt=`${p.title} cover`;$('#playerTitle').textContent=p.title;if('mediaSession'in navigator){try{navigator.mediaSession.metadata=new MediaMetadata({title:p.title,artist:'2Fly Keith Logan',artwork:[{src:asset(p.cover)}]})}catch{}}savePlayer();if(autoplay)a.play().catch(()=>{})}
function stepTrack(dir){const list=tracks();if(!list.length)return;app.trackIndex=(app.trackIndex+dir+list.length)%list.length;loadProjectAudio(list[app.trackIndex],true)}
function savePlayer(){const a=$('#globalAudio');try{sessionStorage.setItem('2fly-player',JSON.stringify({src:a.getAttribute('src')||'',time:a.currentTime||0,volume:a.volume,title:$('#playerTitle').textContent,cover:$('#playerCover').getAttribute('src')||'',trackIndex:app.trackIndex}))}catch{}}
function restorePlayer(){try{const s=JSON.parse(sessionStorage.getItem('2fly-player')||'null');if(!s?.src)return;const a=$('#globalAudio');a.src=s.src;a.volume=Number.isFinite(s.volume)?s.volume:.75;$('#playerVolume').value=a.volume;$('#playerTitle').textContent=s.title||'2Fly Keith Logan';$('#playerCover').src=s.cover||'';app.trackIndex=s.trackIndex||0;a.addEventListener('loadedmetadata',()=>{if(Number.isFinite(s.time)&&s.time<a.duration)a.currentTime=s.time},{once:true})}catch{}}

document.addEventListener('DOMContentLoaded',init);
