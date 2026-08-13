const state={
  projects:[],featured:[],heroIndex:0,musicIndex:0,videoIndex:0,experienceIndex:0,
  createIndex:0,projectMediaIndex:0,trackIndex:0,currentView:'home',autoTimer:null,
  soundscape:false,previewChannel:0,previewProject:null,fx:{},videoProjects:[],
  experiences:[],createPaths:[],projectMedia:[],videoPlaylist:[],videoPlaylistIndex:0,currentVideoProject:null
};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

async function init(){
  bindNavigation(); // Attach event delegation immediately
  const response=await fetch('data/projects.json?v=4.0.3');
  if(!response.ok)throw new Error(`Project data failed: ${response.status}`);
  state.projects=await response.json();
  state.featured=state.projects.filter(project=>project.featured&&project.explore);
  state.experiences=experienceData();
  state.createPaths=createPathData();
  buildHero();
  buildMusic();
  buildVideos();
  buildExperiences();
  buildCreateCarousel();
  bindPlayer();
  bindOverlays();
  bindSoundscape();
  bindPointerWorlds();
  initFx();
  route();
  window.addEventListener('hashchange',route);
  setHero(0);
  const firstPlayable=state.projects.findIndex(project=>project.audio);
  if(firstPlayable>=0)loadTrack(firstPlayable,false);
  checkStagingGate();
}

const STAGING_GATE_PASSCODE = '2flyBeta';

const FLYZONE_STUDIO_URL='https://twofly-final-beta.onrender.com/studio/';
const WIX_PAY_WHAT_ITS_WORTH_URL='https://support.2flyKeithLogan.com/pay-what-its-worth';
function navigate(target){
  if(!target)return;
  if(target==='flyzone'){
    window.open(FLYZONE_STUDIO_URL,'_blank','noopener');
    return;
  }
  if(target.startsWith('http://')||target.startsWith('https://')){
    window.open(target,'_blank','noopener');
    return;
  }
  const cleanTarget=target.replace(/^#/,'');
  const newHash=`#${cleanTarget}`;

  // Always update location.hash unconditionally!
  location.hash=newHash;

  // Clean URL bar query parameters (e.g. ?amount=...) if present
  if(window.location.search){
    try {
      window.history.replaceState(null,'',window.location.pathname+newHash);
    } catch(e){}
  }
  route();
  document.querySelector('.mobile-nav')?.classList.remove('open');
}
function checkStagingGate(){
  const isIframe = window.parent !== window;
  const isAutostart = window.location.search.includes('autostart');
  const accessGranted = sessionStorage.getItem('2fly_preview_access') === 'granted';
  if (isIframe || isAutostart || accessGranted) return;
  const gateOverlay = $('#gateOverlay');
  if (!gateOverlay) return;
  gateOverlay.classList.add('open');
  document.body.classList.add('locked');
  const gateForm = $('#gateForm');
  if (gateForm) {
    gateForm.onsubmit = event => {
      event.preventDefault();
      const val = $('#gatePasscode')?.value.trim();
      if (val === STAGING_GATE_PASSCODE) {
        sessionStorage.setItem('2fly_preview_access', 'granted');
        gateOverlay.classList.remove('open');
        document.body.classList.remove('locked');
        showToast('Welcome to 2Fly Staging Preview');
      } else {
        showToast('Incorrect passcode.');
        $('#gatePasscode')?.focus();
      }
    };
  }
}

function showToast(text){
  const toast=$('#toast');
  if(!toast)return;
  toast.textContent=text;toast.classList.add('show');
  clearTimeout(toast._timer);toast._timer=setTimeout(()=>toast.classList.remove('show'),1900);
}
function applyTheme(project){
  if(!project)return;
  const root=document.documentElement;
  root.style.setProperty('--accent',project.accent||'#168D94');
  root.style.setProperty('--accent2',project.accent2||'#071E22');
  root.style.setProperty('--soft',project.soft||'#D7F0EF');
}
function projectById(id){return state.projects.find(project=>project.id===id)}
function setShowcaseTitle(element,project){
  if(!element||!project)return;
  element.classList.remove('title-single-line','title-stacked');
  if(project.id==='artificial-love'){
    element.innerHTML='ARTIFICIAL<br>LOVE';
    element.classList.add('title-stacked');
    return;
  }
  element.textContent=project.title.toUpperCase();
  if(project.id==='streams')element.classList.add('title-single-line');
}

function bindNavigation(){
  const handleNavClick = (event, el) => {
    const trigger = el || (event && event.target ? event.target.closest('.nav button,.mobile-nav button,[data-go],[data-view],a[href^="#"]') : null);
    if (!trigger) return;
    if (trigger.classList.contains('overlay-close') || trigger.type === 'submit') return;
    const href = trigger.getAttribute('href');
    const target = trigger.dataset.view || trigger.dataset.go || (href && href.startsWith('#') ? href.slice(1) : null);
    if (target) {
      if (event && event.preventDefault) event.preventDefault();
      const scrollTarget = trigger.dataset.scrollTarget;
      navigate(target);
      if (scrollTarget) {
        window.setTimeout(() => document.getElementById(scrollTarget)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 140);
      }
    }
  };

  // Direct element binding for 100% mobile touch & desktop click reliability
  document.querySelectorAll('.nav button, .mobile-nav button, [data-go], [data-view], a[href^="#"]').forEach(btn => {
    btn.onclick = (e) => handleNavClick(e, btn);
  });

  // Global event delegation fallback
  document.addEventListener('click', (e) => handleNavClick(e, null));

  $('.menu-btn')?.addEventListener('click', () => $('.mobile-nav')?.classList.toggle('open'));
  window.addEventListener('popstate', route);
  window.addEventListener('hashchange', route);
}
bindNavigation();
function route(){
  const requested=(location.hash||'#home').slice(1).split('?')[0];
  const projectMatch=requested.match(/^project\/([a-z0-9-]+)$/i);
  const allowed=['home','firsttime','music','videos','experiences','africa','testlab','flyzone','motion','support'];
  state.currentView=projectMatch?'project':allowed.includes(requested)?requested:'home';
  $$('.view').forEach(view=>view.classList.toggle('active',view.id===`view-${state.currentView}`));
  $$('.nav button,.mobile-nav button').forEach(button=>button.classList.toggle('active',button.dataset.view===state.currentView));
  if(projectMatch){
    const project=projectById(projectMatch[1]);
    if(project?.explore)buildProjectPage(project);else navigate('home');
  } else if(state.currentView==='africa'){
    buildAfricaStandaloneView();
  }
  window.scrollTo({top:0,left:0,behavior:'auto'});
  requestAnimationFrame(()=>window.dispatchEvent(new Event('resize')));
}

function buildHero(){
  const rail=$('#coverRail');
  rail.innerHTML='';
  state.featured.forEach((project,index)=>{
    const button=document.createElement('button');
    button.className='hero-cover';button.dataset.index=index;
    button.innerHTML=`<img src="${project.cover}" alt="${project.title} cover"><span class="cover-select-label">SELECT ${project.title.toUpperCase()}</span>`;
    button.addEventListener('click',()=>{
      if(index!==state.heroIndex)setHero(index);
    });
    rail.appendChild(button);
  });
  const previous=()=>setHero(state.heroIndex-1);
  const next=()=>setHero(state.heroIndex+1);
  $('#heroTopPrev').onclick=previous;$('#heroTopNext').onclick=next;
  $('#heroTapPrev').onclick=previous;$('#heroTapNext').onclick=next;
  $('#heroDirectListen').onclick=()=>playProject(state.featured[state.heroIndex],false);
  $('#heroDirectWatch').onclick=()=>openVideo(state.featured[state.heroIndex]);
  $('#heroDirectExperience').onclick=()=>launchProjectExperience(state.featured[state.heroIndex]);
  $('#heroDirectSupport').onclick=()=>openSupport(state.featured[state.heroIndex]);
  $('#heroDirectPage').onclick=()=>navigate(`project/${state.featured[state.heroIndex].id}`);
  $('#heroTotal').textContent=String(state.featured.length).padStart(2,'0');
  const stage=$('#heroStage');
  stage.addEventListener('mouseenter',()=>clearInterval(state.autoTimer));
  stage.addEventListener('mouseleave',()=>startHeroAuto());
  startHeroAuto();
}
function startHeroAuto(){
  clearInterval(state.autoTimer);
  state.autoTimer=setInterval(()=>setHero(state.heroIndex+1),7000);
}
function setHero(index){
  const count=state.featured.length;
  if(!count)return;
  state.heroIndex=(index+count)%count;
  const project=state.featured[state.heroIndex];
  applyTheme(project);
  const stage=$('#heroStage');
  stage.dataset.word=project.word;stage.dataset.universe=project.id;
  $('#heroPosition').textContent=String(state.heroIndex+1).padStart(2,'0');
  const listen=$('#heroDirectListen'),watch=$('#heroDirectWatch'),experience=$('#heroDirectExperience');
  listen.disabled=!project.audio;watch.disabled=!project.video;experience.disabled=!project.experience;
  listen.classList.toggle('unavailable',!project.audio);watch.classList.toggle('unavailable',!project.video);experience.classList.toggle('unavailable',!project.experience);
  listen.querySelector('small').textContent=project.audio?'HEAR THE WORK':'IN DEVELOPMENT';
  watch.querySelector('small').textContent=project.video?'SEE THE STORY':'IN PRODUCTION';
  experience.querySelector('small').textContent=project.experience?'STEP INSIDE':'IN DEVELOPMENT';
  $('#heroDirectPage').textContent=`${project.title.toUpperCase()} PAGE`;
  $('#heroDirectHub').dataset.project=project.id;
  $$('.hero-cover').forEach((cover,coverIndex)=>{
    const raw=coverIndex-state.heroIndex;
    const difference=(raw+count)%count;
    const position=difference===0?2:difference===1?3:difference===count-1?1:0;
    cover.dataset.pos=position;cover.classList.toggle('active',coverIndex===state.heroIndex);
  });
  setFxUniverse('hero',project.id);
}

function buildMusic(){
  const grid=$('#musicGrid');
  grid.innerHTML=state.projects.map((project,index)=>`<article class="music-card" tabindex="0" data-music-index="${index}" aria-label="Select ${project.title}">
    <img src="${project.cover}" alt="${project.title} cover"><div class="music-card-info"><h3>${project.title}</h3><p>${project.subtitle}</p></div><div class="card-progress"><span></span></div></article>`).join('');
  grid.querySelectorAll('.music-card').forEach(card=>{
    const index=+card.dataset.musicIndex;
    card.addEventListener('mouseenter',()=>selectMusicCard(index,true,false));
    card.addEventListener('focusin',()=>selectMusicCard(index,true,false));
    card.addEventListener('click',()=>selectMusicCard(index,true,true));
  });
  $('#musicPrev').onclick=()=>stepMusic(-1);$('#musicNext').onclick=()=>stepMusic(1);
  $('#musicPanelPlay').onclick=()=>{const project=state.projects[state.musicIndex];project?.audio?loadTrack(state.musicIndex,true):showToast('Audio is in development.')};
  $('#musicPanelExperience').onclick=()=>launchProjectExperience(state.projects[state.musicIndex]);
  $('#musicPanelCreate').onclick=()=>openSupport(state.projects[state.musicIndex]);
  $('#musicTotal').textContent=String(state.projects.length).padStart(2,'0');
  selectMusicCard(0,false,true);
}
function selectMusicCard(index,preview=false,lockAndCenter=false){
  const project=state.projects[index];if(!project)return;
  state.musicIndex=index;applyTheme(project);
  $$('.music-card').forEach((card,cardIndex)=>card.classList.toggle('selected',cardIndex===index));
  $('#musicFocusWord').textContent=project.word;setShowcaseTitle($('#musicFocusTitle'),project);
  $('#musicFocusDescription').textContent=project.description;$('#selectedMusicCover').src=project.cover;
  $('#selectedMusicCover').alt=`${project.title} selected album cover`;$('#panelAlbumTitle').textContent=project.title.toUpperCase();
  const tracks=project.tracks?.length?project.tracks:[{title:project.title,subtitle:project.subtitle,audio:project.audio}];
  $('#trackCount').textContent=`${String(tracks.length).padStart(2,'0')} ${tracks.length===1?'TRACK':'TRACKS'}`;
  $('#musicTracklist').innerHTML=tracks.map((track,trackIndex)=>`<li class="${track.audio?'playable':'unavailable'}"><button type="button" data-panel-track="${trackIndex}" ${track.audio?'':'disabled'}><span>${String(trackIndex+1).padStart(2,'0')}</span><div><strong>${track.title}</strong><small>${track.subtitle||''}</small></div><b>${track.audio?'PLAY':'SOON'}</b></button></li>`).join('');
  $('#musicTracklist').querySelectorAll('[data-panel-track]').forEach(button=>button.onclick=()=>{
    const track=tracks[+button.dataset.panelTrack];if(!track?.audio)return;
    if(track.audio===project.audio)loadTrack(index,true);else playDirectAudio(track.audio,project.cover,track.title);
  });
  $('#musicPanelPlay').disabled=!project.audio;$('#musicPanelPlay').textContent=project.audio?'▶ PLAY FULL':'IN DEVELOPMENT';
  $('#musicPanelExperience').classList.toggle('hidden-action',!project.experience);
  $('#musicStageBackdrop').style.backgroundImage=`url("${project.cover}")`;
  const hero=$('#musicPageHero');hero.dataset.word=project.word;hero.style.background=`radial-gradient(circle at 72% 35%,${project.accent}55,transparent 34%),linear-gradient(135deg,${project.accent2},#090b0c)`;
  setFxUniverse('music',project.id);$('#musicPosition').textContent=String(index+1).padStart(2,'0');
  if(lockAndCenter){gridCenter(`#musicGrid [data-music-index="${index}"]`);flashLock('#musicStage','album-locked')}
  if(preview&&state.soundscape&&project.audio)crossfadePreview(project);
}
function stepMusic(direction){selectMusicCard((state.musicIndex+direction+state.projects.length)%state.projects.length,true,true)}

function buildVideos(){
  const list=state.projects.filter(project=>project.video);state.videoProjects=list;
  $('#videoGrid').innerHTML=list.map((project,index)=>`<button class="video-thumb" data-video-index="${index}" aria-label="Select ${project.title}"><img src="${project.poster||project.cover}" alt="${project.title} video poster"><span>${project.title}</span></button>`).join('');
  $('#videoGrid').querySelectorAll('.video-thumb').forEach(button=>{
    const index=+button.dataset.videoIndex;
    button.addEventListener('mouseenter',()=>selectVideo(index,false));button.addEventListener('focusin',()=>selectVideo(index,false));button.addEventListener('click',()=>selectVideo(index,true));
  });
  $('#videoPrev').onclick=()=>stepVideo(-1);$('#videoNext').onclick=()=>stepVideo(1);$('#videoEdgePrev').onclick=()=>stepVideo(-1);$('#videoEdgeNext').onclick=()=>stepVideo(1);
  $('#selectedVideoLaunch').onclick=()=>openVideo(state.videoProjects[state.videoIndex]);$('#videoPanelPlay').onclick=()=>openVideo(state.videoProjects[state.videoIndex]);
  $('#videoPanelExperience').onclick=()=>launchProjectExperience(state.videoProjects[state.videoIndex]);$('#videoPanelCreate').onclick=()=>openSupport(state.videoProjects[state.videoIndex]);
  $('#videoTotal').textContent=String(list.length).padStart(2,'0');selectVideo(0,true);
}
function selectVideo(index,center=false){
  const list=state.videoProjects;if(!list.length)return;index=(index+list.length)%list.length;state.videoIndex=index;
  const project=list[index];applyTheme(project);
  $('#videoFocusWord').textContent=project.word||'VISUAL STORY';setShowcaseTitle($('#videoFocusTitle'),project);$('#videoFocusDescription').textContent=project.description;
  $('#panelVideoTitle').textContent=project.title.toUpperCase();$('#panelVideoDescription').textContent=project.description;
  $('#selectedVideoPoster').src=project.poster||project.cover;$('#selectedVideoPoster').alt=`${project.title} selected video poster`;
  const previous=list[(index-1+list.length)%list.length],next=list[(index+1)%list.length];
  $('#videoPrevPoster').src=previous.poster||previous.cover;$('#videoPrevPoster').alt=`Previous video: ${previous.title}`;
  $('#videoNextPoster').src=next.poster||next.cover;$('#videoNextPoster').alt=`Next video: ${next.title}`;
  $('#videoStageBackdrop').style.backgroundImage=`url("${project.poster||project.cover}")`;$('#videoPosition').textContent=String(index+1).padStart(2,'0');
  $('#videoPanelExperience').classList.toggle('hidden-action',!project.experience);
  const stage=$('#videoStage');[...stage.classList].filter(name=>name.startsWith('theme-')).forEach(name=>stage.classList.remove(name));stage.classList.add(`theme-${project.id}`);
  $('#videoGrid').querySelectorAll('.video-thumb').forEach((button,buttonIndex)=>button.classList.toggle('selected',buttonIndex===index));
  if(center){gridCenter(`#videoGrid [data-video-index="${index}"]`);flashLock('#videoStage','video-locked')}
}
function stepVideo(direction){if(state.videoProjects.length)selectVideo((state.videoIndex+direction+state.videoProjects.length)%state.videoProjects.length,true)}

function experienceData(){
  const get=id=>projectById(id)||{};
  return [
    {id:'fire',projectId:'fire',title:'Thru the Fire',word:'RESILIENCE',glyph:'🔥',cover:get('fire').cover,path:'games/thru-the-fire/index.html',description:'A cinematic pressure test about memory, value, and escaping each room before the fire closes in.',objective:'Rotate through each burning room, choose among two to four savable objects, then find the exit perspective before time expires.',mechanics:['360° room views','2–4 randomized items','Second-look discoveries','Halfway exit phase']},
    {id:'streams',projectId:'streams',title:'Streams',word:'LEGACY',glyph:'🌊',cover:get('streams').cover,path:'games/streams/index.html',description:'A moving platform experience where digital media flows downstream while you fight your way toward the stage.',objective:'Jump upstream across drifting media, collect pennies, and resist blue X attention before the waterfall takes the route.',mechanics:['Moving platforms','Momentum jumps','Value vs. attention','Progressive current']},
    {id:'africa',projectId:'africa',title:'I Woke Up in Africa',word:'AWAKENING',glyph:'◉',cover:get('africa').cover,path:'games/africa/index.html',description:'A reflective intention experience built around awakening, purpose, connection, and service.',objective:'Create a personal daily intention and carry the reflection beyond the screen.',mechanics:['Guided reflection','Personal choices','Downloadable result','Purpose-centered']},
    {id:'away',projectId:'away',title:'I Was Away',word:'REFLECTION',glyph:'⌁',cover:get('away').cover,path:'games/i-was-away/index.html?v=2.0',description:'A PainterFly field demo where a living painted landscape becomes a guided boomerang experience.',objective:'Watch the instructor, shape the throw, move into the return circle, and complete three controlled catches.',mechanics:['PainterFly landscape','Guided throw tutorial','Boomerang flight','Multi-view camera']},
    {id:'guns',projectId:'gettin',title:'Guns & Butter',word:'CREATION',glyph:'🎛',cover:get('gettin').cover,path:'games/guns-and-butter/index.html',description:'A musical memory game that turns rhythm, repetition, and focus into a playable production lab.',objective:'Repeat the progressive note pattern and keep the musical sequence alive.',mechanics:['Pattern memory','Keyboard input','Progressive rounds','Beat-lab atmosphere']}
  ];
}
function buildExperiences(){
  const list=state.experiences;
  $('#experienceRail').innerHTML=list.map((experience,index)=>`<button class="experience-mini" data-experience-index="${index}" aria-label="Select ${experience.title}"><img src="${experience.cover}" alt=""><span>${experience.glyph}</span></button>`).join('');
  $('#experienceRail').querySelectorAll('.experience-mini').forEach(button=>button.onclick=()=>selectExperience(+button.dataset.experienceIndex,true));
  $('#experiencePrev').onclick=()=>stepExperience(-1);$('#experienceNext').onclick=()=>stepExperience(1);
  $('#experienceLaunch').onclick=$('#experienceLaunchVisual').onclick=()=>openExperience(list[state.experienceIndex].path);
  $('#experienceExplore').onclick=()=>{const selected=list[state.experienceIndex];const project=projectById(selected.projectId);if(project?.explore)navigate(`project/${project.id}`)};
  $('#experienceCreate').onclick=()=>openSupport(projectById(list[state.experienceIndex].projectId));
  $('#experienceTotal').textContent=String(list.length).padStart(2,'0');selectExperience(0,false);
}
function selectExperience(index,center=false){
  const list=state.experiences;index=(index+list.length)%list.length;state.experienceIndex=index;const experience=list[index];const project=projectById(experience.projectId);
  if(project)applyTheme(project);
  const stage=$('#experienceStage');stage.dataset.universe=experience.id;$('#experienceStageBackdrop').style.backgroundImage=`url("${experience.cover}")`;
  $('#experienceWord').textContent=experience.word;$('#experienceTitle').textContent=experience.title.toUpperCase();$('#experienceDescription').textContent=experience.description;
  $('#experiencePanelTitle').textContent='OBJECTIVE';$('#experienceObjective').textContent=experience.objective;$('#experienceCover').src=experience.cover;$('#experienceCover').alt=`${experience.title} Playable Experience artwork`;$('#experienceGlyph').textContent=experience.glyph;
  $('#experienceMechanics').innerHTML=experience.mechanics.map(mechanic=>`<span>${mechanic}</span>`).join('');$('#experiencePosition').textContent=String(index+1).padStart(2,'0');
  $('#experienceExplore').classList.toggle('hidden-action',!project?.explore);$('#experienceRail').querySelectorAll('.experience-mini').forEach((button,buttonIndex)=>button.classList.toggle('selected',buttonIndex===index));
  setFxUniverse('experience',experience.id);
  if(center){gridCenter(`#experienceRail [data-experience-index="${index}"]`);flashLock('#experienceStage','experience-locked')}
}
function stepExperience(direction){selectExperience((state.experienceIndex+direction+state.experiences.length)%state.experiences.length,true)}

function createPathData(){return [
  {id:'worth',symbol:'♥',kicker:'DIRECT APPRECIATION',title:"Pay What It's Worth",description:'Experience the work first, then choose an amount that honestly reflects its value to you.',terms:['No approval required','Any amount','Builds the overall mission'],action:'CHOOSE AN AMOUNT'},
  {id:'venture',symbol:'↗',kicker:'CREATIVE VENTURE',title:'Invest in a Specific Idea',description:'For meaningful project funding, video budgets, royalty conversations, and exclusive one-to-one collaboration.',terms:['Approval required','Project summary + budget','Clear role and desired outcome'],action:'BUILD A PROPOSAL'},
  {id:'booking',symbol:'●',kicker:'LIVE EXPERIENCE',title:'Book the Work',description:'Bring the music, discussion, artistic presentation, or public-speaking experience into a real room with a real audience.',terms:['Approval required','Audience + date + budget','Performance or presentation'],action:'REQUEST A BOOKING'}
]}
function buildCreateCarousel(){
  const list=state.createPaths;
  $('#createRail').innerHTML=list.map((path,index)=>`<button class="create-orbit-node" data-create-index="${index}"><b>${path.symbol}</b><span>${path.title}</span></button>`).join('');
  $('#createRail').querySelectorAll('.create-orbit-node').forEach(button=>button.onclick=()=>selectCreatePath(+button.dataset.createIndex));
  $('#createPrev').onclick=()=>stepCreate(-1);$('#createNext').onclick=()=>stepCreate(1);$('#createAction').onclick=activateCreatePath;
  $('#createTotal').textContent=String(list.length).padStart(2,'0');selectCreatePath(0);
}
function selectCreatePath(index){
  const list=state.createPaths;index=(index+list.length)%list.length;state.createIndex=index;const path=list[index];
  $('#createSymbol').textContent=path.symbol;$('#createKicker').textContent=path.kicker;$('#createTitle').textContent=path.title.toUpperCase();$('#createDescription').textContent=path.description;
  $('#createTerms').innerHTML=path.terms.map(term=>`<span>${term}</span>`).join('');$('#createAction').textContent=path.action;$('#createPosition').textContent=String(index+1).padStart(2,'0');
  $('#createStage').dataset.path=path.id;$('#createRail').querySelectorAll('.create-orbit-node').forEach((button,buttonIndex)=>{button.classList.toggle('selected',buttonIndex===index);button.dataset.position=(buttonIndex-index+list.length)%list.length});
}
function stepCreate(direction){selectCreatePath((state.createIndex+direction+state.createPaths.length)%state.createPaths.length)}
function activateCreatePath(){
  const path=state.createPaths[state.createIndex];
  if(path.id==='worth')openSupport();
  if(path.id==='venture')$('#venture').scrollIntoView({behavior:'smooth'});
  if(path.id==='booking')$('#booking').scrollIntoView({behavior:'smooth'});
}

function buildProjectPage(project){
  applyTheme(project);
  const world=$('#projectWorld');world.dataset.universe=project.id;world.className=`project-world pointer-world project-theme-${project.id}`;world.setAttribute('data-parallax-zone','');
  $('#projectBackdrop').style.backgroundImage=`url("${project.poster||project.cover}")`;$('#projectWord').textContent=`${project.word} · PROJECT ARCHIVE`;$('#projectTitle').textContent=project.title.toUpperCase();$('#projectSubtitle').textContent=project.subtitle;
  $('#projectCover').src=project.cover;$('#projectCover').alt=`${project.title} cover artwork`;$('#projectStory').textContent=project.story||project.description;
  $('#projectCredits').innerHTML=(project.credits||[]).map(credit=>`<li>${credit}</li>`).join('');
  $('#projectNotes').innerHTML=(project.notes||[]).map(note=>`<article><span>${note.label}</span><h3>${note.title}</h3><p>${note.text}</p></article>`).join('');
  $('#projectGallery').innerHTML=(project.gallery||[]).map((item,index)=>`<figure class="gallery-tile gallery-tile-${index+1}"><img src="${item.image}" alt="${project.title} ${item.label.toLowerCase()}"><figcaption><span>${item.label}</span><p>${item.caption}</p></figcaption></figure>`).join('');
  const actions=[];
  if(project.audio)actions.push(`<button data-project-action="listen">▶ LISTEN</button>`);
  if(project.video)actions.push(`<button data-project-action="watch">▶ WATCH</button>`);
  if(project.experience)actions.push(`<button data-project-action="experience">PLAYABLE EXPERIENCE</button>`);
  actions.push(`<button data-project-action="create" class="project-create-action">HELP 2FLY CREATE</button>`);
  $('#projectActions').innerHTML=actions.join('');
  $('#projectActions').querySelectorAll('[data-project-action]').forEach(button=>button.onclick=()=>{
    const action=button.dataset.projectAction;
    if(action==='listen')playProject(project,false);if(action==='watch')openVideo(project);if(action==='experience')openExperience(project.experience);if(action==='create')openSupport(project);
  });
  $('#projectReturn').onclick=()=>navigate('home');
  buildProjectMedia(project);setFxUniverse('project',project.id);bindPointerWorlds();
}
function buildProjectMedia(project){
  const mediaSection=$('#projectMediaCarousel')?.closest('.project-media-section');
  mediaSection?.classList.toggle('africa-cinematic-section',project.id==='africa');
  if(project.id==='africa'){
    buildAfricaCinematicPage(project);
    return;
  }
  $('#projectMediaPrev').hidden=false;
  $('#projectMediaNext').hidden=false;
  const sectionHead=mediaSection?.querySelector('.section-head');
  if(sectionHead){
    sectionHead.querySelector('.eyebrow').textContent='MEDIA ROOM';
    sectionHead.querySelector('h2').textContent='EVERY FORMAT. ONE UNIVERSE.';
    sectionHead.querySelector('p').textContent='Move through the song, visual chapters, Playable Experiences, and project archive without losing the context that connects them.';
  }
  const media=[];
  if(project.audio)media.push({kind:'audio',label:'ORIGINAL MUSIC',title:project.title,description:'Listen to the project soundtrack inside the permanent archive.',image:project.cover,action:'PLAY SONG'});
  (project.clips||[]).forEach((clip,index)=>media.push({kind:'video',label:clip.type||`VIDEO ${index+1}`,title:clip.title,description:'Watch this visual chapter without leaving the project universe.',image:clip.poster||project.poster||project.cover,src:clip.src,action:'WATCH CHAPTER'}));
  if(project.experience)media.push({kind:'experience',label:'PLAYABLE EXPERIENCE',title:`Enter ${project.title}`,description:'Move from passive viewing into a playable version of the project idea.',image:project.cover,src:project.experience,action:'PLAYABLE EXPERIENCE'});
  media.push({kind:'archive',label:'PROJECT ARCHIVE',title:'Story, Credits & Notes',description:'Continue through production credits, project notes, and the evolving visual archive.',image:project.poster||project.cover,action:'VIEW ARCHIVE'});
  state.projectMedia=media;state.projectMediaIndex=0;
  $('#projectMediaPrev').onclick=()=>stepProjectMedia(-1);$('#projectMediaNext').onclick=()=>stepProjectMedia(1);selectProjectMedia(0,project);
}
function buildAfricaCinematicPage(project){
  const clips=project.clips||[];
  const mediaSection=$('#projectMediaCarousel')?.closest('.project-media-section');
  const sectionHead=mediaSection?.querySelector('.section-head');
  if(sectionHead){
    sectionHead.querySelector('.eyebrow').textContent='THE RWANDA JOURNEY';
    sectionHead.querySelector('h2').textContent='A STORY TOLD IN TEN CHAPTERS.';
    sectionHead.querySelector('p').textContent='Move through Rwanda one chapter at a time—from the first awakening to the final music video. Let the landscape, people, service, and lessons unfold in the order they were lived.';
  }
  $('#projectMediaPrev').hidden=true;
  $('#projectMediaNext').hidden=true;
  $('#projectMediaDots').innerHTML='';
  const stage=$('#projectMediaStage');
  stage.innerHTML=`
    <div class="africa-cinema-experience">
      <div class="africa-cinema-sky" aria-hidden="true"><span></span><span></span><span></span></div>
      <div class="africa-cinema-intro">
        <span>RWANDA · LAND OF 1000 HILLS</span>
        <h3>DID I WAKE UP IN AFRICA—<br>OR DID AFRICA WAKE ME UP?</h3>
        <p>This is not a playlist placed on a page. It is a chaptered journey through service, culture, laughter, work, landscape, community, and awakening.</p>
      </div>
      <div class="africa-feature-frame">
        <video id="africaChapterVideo" controls playsinline preload="metadata"></video>
        <div class="africa-feature-vignette" aria-hidden="true"></div>
        <div class="africa-chapter-caption">
          <small id="africaChapterCounter">CHAPTER 01 / 10</small>
          <h4 id="africaChapterTitle">THE INTRODUCTION</h4>
        </div>
        <button class="africa-center-play" id="africaCenterPlay" aria-label="Play selected chapter">▶</button>
      </div>
      <div class="africa-cinema-controls">
        <button id="africaPrevChapter">← PREVIOUS CHAPTER</button>
        <button class="africa-support" id="africaSupportJourney">HELP 2FLY CREATE</button>
        <button id="africaNextChapter">NEXT CHAPTER →</button>
      </div>
      <div class="africa-chapter-rail" id="africaChapterRail"></div>
      <div class="africa-cinema-footer">
        <span>THE JOURNEY CONTINUES BEYOND THE SCREEN</span>
        <p>Watch in order for the fullest experience. Each chapter carries a different piece of the awakening.</p>
      </div>
    </div>`;
  const video=$('#africaChapterVideo');
  const rail=$('#africaChapterRail');
  let active=0;
  const descriptions={
    'The Introduction':'The first step into the question that shaped the entire journey.',
    'The School':'Education, service, and the people who made the mission meaningful.',
    'The Greeting':'A welcome that carries culture, warmth, and connection.',
    'The Land of 1000 Hills':'The landscape becomes part of the story—and part of the awakening.',
    'The Village':'Community, everyday life, and the moments that cannot be staged.',
    'The Hard Work':'Purpose is revealed through effort, discipline, and shared responsibility.',
    'The Banana Crown':'Joy, personality, and an unforgettable moment from the journey.',
    'The Food':'A table, a culture, and the way a meal can become memory.',
    'The Conclusion':'The journey returns to the question: what changed after Africa?',
    'The Music Video':'The story, sound, and spirit come together in the final visual expression.'
  };
  rail.innerHTML=clips.map((clip,index)=>`<button class="africa-chapter-card" data-africa-chapter="${index}"><img src="${clip.poster||project.poster}" alt="${clip.title}"><span>${String(index+1).padStart(2,'0')}</span><strong>${clip.title}</strong><em>${descriptions[clip.title]||'Continue the journey.'}</em></button>`).join('');
  const selectChapter=(index,autoplay=false)=>{
    active=(index+clips.length)%clips.length;
    const clip=clips[active];
    video.pause();
    video.src=clip.src;
    video.poster=clip.poster||project.poster||project.cover;
    $('#africaChapterCounter').textContent=`CHAPTER ${String(active+1).padStart(2,'0')} / ${String(clips.length).padStart(2,'0')}`;
    $('#africaChapterTitle').textContent=clip.title.toUpperCase();
    rail.querySelectorAll('[data-africa-chapter]').forEach((button,i)=>button.classList.toggle('active',i===active));
    rail.querySelector(`[data-africa-chapter="${active}"]`)?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
    $('#africaCenterPlay').hidden=false;
    if(autoplay)video.play().catch(()=>{});
  };
  rail.querySelectorAll('[data-africa-chapter]').forEach(button=>button.onclick=()=>selectChapter(+button.dataset.africaChapter,true));
  $('#africaPrevChapter').onclick=()=>selectChapter(active-1,true);
  $('#africaNextChapter').onclick=()=>selectChapter(active+1,true);
  $('#africaSupportJourney').onclick=()=>openSupport(project);
  $('#africaCenterPlay').onclick=()=>video.play().catch(()=>{});
  video.addEventListener('play',()=>{$('#africaCenterPlay').hidden=true;stopAll(video)});
  video.addEventListener('pause',()=>{if(!video.ended)$('#africaCenterPlay').hidden=false});
  video.addEventListener('ended',()=>{if(active<clips.length-1)selectChapter(active+1,true)});
  selectChapter(0,false);
}

function selectProjectMedia(index,project=projectById((location.hash.split('/')[1]||''))){
  const list=state.projectMedia;if(!list.length)return;index=(index+list.length)%list.length;state.projectMediaIndex=index;const item=list[index];
  const previous=list[(index-1+list.length)%list.length],next=list[(index+1)%list.length];
  $('#projectMediaStage').innerHTML=`<button class="project-media-edge" data-media-step="-1"><img src="${previous.image}" alt=""><span>${previous.title}</span></button><article class="project-media-feature"><div class="project-media-image"><img src="${item.image}" alt="${item.title}"><span>${item.label}</span></div><div class="project-media-copy"><small>${String(index+1).padStart(2,'0')} / ${String(list.length).padStart(2,'0')}</small><h3>${item.title}</h3><p>${item.description}</p><button id="projectMediaAction">${item.action}</button></div></article><button class="project-media-edge" data-media-step="1"><img src="${next.image}" alt=""><span>${next.title}</span></button>`;
  $('#projectMediaStage').querySelectorAll('[data-media-step]').forEach(button=>button.onclick=()=>stepProjectMedia(+button.dataset.mediaStep));
  $('#projectMediaAction').onclick=()=>activateProjectMedia(item,project);
  $('#projectMediaDots').innerHTML=list.map((_,dotIndex)=>`<button class="${dotIndex===index?'active':''}" aria-label="Select media ${dotIndex+1}" data-project-media-dot="${dotIndex}"></button>`).join('');
  $('#projectMediaDots').querySelectorAll('[data-project-media-dot]').forEach(button=>button.onclick=()=>selectProjectMedia(+button.dataset.projectMediaDot,project));
}
function stepProjectMedia(direction){selectProjectMedia((state.projectMediaIndex+direction+state.projectMedia.length)%state.projectMedia.length)}
function activateProjectMedia(item,project){
  if(item.kind==='audio')playProject(project,false);if(item.kind==='video')openVideo({title:item.title,video:item.src,poster:item.image,accent:project.accent,accent2:project.accent2,soft:project.soft});
  if(item.kind==='experience')openExperience(item.src);if(item.kind==='archive')$('.project-archive-grid').scrollIntoView({behavior:'smooth'});
}

function playProject(project,openMusic=true){const index=state.projects.findIndex(item=>item.id===project.id);if(index>=0&&project.audio){state.musicIndex=index;selectMusicCard(index,false,false);loadTrack(index,true);if(openMusic)navigate('music')}}
function playDirectAudio(source,cover,title){const audio=$('#audio');stopAll(audio);audio.src=source;$('#nowCover').src=cover;$('#nowTitle').textContent=title;$('#playerDownload').disabled=!source;audio.play().catch(()=>showToast('Tap play to begin audio.'))}
function stopAll(except=null){document.querySelectorAll('audio,video').forEach(media=>{if(media!==except&&!media.paused)media.pause()})}
document.addEventListener('play',event=>{if(event.target.matches('audio,video'))stopAll(event.target)},true);
function bindPlayer(){
  const audio=$('#audio');
  $('#playerPlay').onclick=()=>audio.paused?(stopAll(audio),audio.play().catch(()=>{})):audio.pause();
  $('#playerPrev').onclick=()=>nextTrack(-1);
  $('#playerNext').onclick=()=>nextTrack(1);
  $('#playerDownload').onclick=downloadCurrentTrack;
  $('#downloadPromptClose').onclick=hideDownloadSupportPrompt;
  $('#downloadSupportButton').onclick=()=>{hideDownloadSupportPrompt();openSupport(state.projects[state.trackIndex]||null)};
  $('#seek').oninput=event=>{if(audio.duration)audio.currentTime=event.target.value/100*audio.duration};
  $('#volume').oninput=event=>audio.volume=event.target.value;audio.volume=.75;
  audio.onplay=()=>{document.body.classList.add('player-open');$('#playerPlay').textContent='❚❚'};
  audio.onpause=()=>$('#playerPlay').textContent='▶';
  audio.ontimeupdate=()=>{if(audio.duration){$('#seek').value=audio.currentTime/audio.duration*100;$('#currentTime').textContent=formatTime(audio.currentTime);$('#duration').textContent=formatTime(audio.duration)}};
  audio.onended=()=>nextTrack(1);
}

function safeDownloadName(title='2Fly Music'){
  return `${title.replace(/[\/:*?"<>|]+/g,'').replace(/\s+/g,' ').trim()||'2Fly Music'} - 2Fly Keith Logan.mp3`;
}
async function downloadCurrentTrack(){
  const project=state.projects[state.trackIndex];
  const source=$('#audio')?.currentSrc||project?.audio;
  if(!source){showToast('Choose a downloadable track first.');return}
  const button=$('#playerDownload');
  button.disabled=true;button.classList.add('downloading');
  try{
    const response=await fetch(source,{mode:'cors'});
    if(!response.ok)throw new Error(`Download failed: ${response.status}`);
    const blob=await response.blob();
    const objectUrl=URL.createObjectURL(blob);
    triggerTrackDownload(objectUrl,safeDownloadName(project?.title||$('#nowTitle')?.textContent));
    window.setTimeout(()=>URL.revokeObjectURL(objectUrl),15000);
  }catch(error){
    // Wix-hosted audio may block fetch in some browsers. The direct link remains a reliable fallback.
    triggerTrackDownload(source,safeDownloadName(project?.title||$('#nowTitle')?.textContent),true);
  }finally{
    button.disabled=false;button.classList.remove('downloading');
    window.setTimeout(showDownloadSupportPrompt,450);
  }
}
function triggerTrackDownload(href,filename,newTab=false){
  const link=document.createElement('a');
  link.href=href;link.download=filename;link.rel='noopener';
  if(newTab)link.target='_blank';
  document.body.appendChild(link);link.click();link.remove();
}
function showDownloadSupportPrompt(){
  const prompt=$('#downloadSupportPrompt');
  if(!prompt)return;
  prompt.hidden=false;
  requestAnimationFrame(()=>prompt.classList.add('show'));
  clearTimeout(prompt._timer);
  prompt._timer=setTimeout(hideDownloadSupportPrompt,11000);
}
function hideDownloadSupportPrompt(){
  const prompt=$('#downloadSupportPrompt');
  if(!prompt)return;
  prompt.classList.remove('show');
  clearTimeout(prompt._timer);
  window.setTimeout(()=>{if(!prompt.classList.contains('show'))prompt.hidden=true},260);
}
function loadTrack(index,autoplay=false){const project=state.projects[index];if(!project?.audio)return;state.trackIndex=index;applyTheme(project);stopAll();$('#audio').src=project.audio;$('#nowCover').src=project.cover;$('#nowTitle').textContent=project.title;$('#playerDownload').disabled=false;if(autoplay)$('#audio').play().catch(()=>showToast('Tap play to begin audio.'))}
function nextTrack(direction){if(!state.projects.length)return;let index=state.trackIndex;do{index=(index+direction+state.projects.length)%state.projects.length}while(!state.projects[index].audio);loadTrack(index,true)}
function formatTime(seconds){seconds=Math.floor(seconds||0);return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`}
function loadCinemaClip(index,autoplay=true){
  const list=state.videoPlaylist;
  if(!list.length)return;
  state.videoPlaylistIndex=(index+list.length)%list.length;
  const clip=list[state.videoPlaylistIndex];
  const video=$('#cinemaVideo');
  $('#cinemaTitle').textContent=clip.title||state.currentVideoProject?.title||'VIDEO';
  const chapter=$('#cinemaChapter');
  if(chapter)chapter.textContent=list.length>1?`Chapter ${state.videoPlaylistIndex+1} of ${list.length}`:(clip.type||'Visual Story');
  video.src=clip.src;
  video.poster=clip.poster||state.currentVideoProject?.poster||'';
  video.load();
  if(autoplay)video.play().catch(()=>{});
}
function openVideo(project){
  if(!project?.video)return;
  stopAll();applyTheme(project);
  state.currentVideoProject=project;
  state.videoPlaylist=(project.clips&&project.clips.length?project.clips:[{title:project.title,src:project.video,poster:project.poster,type:'VISUAL STORY'}]).filter(clip=>clip.src);
  openOverlay('#cinemaOverlay');
  loadCinemaClip(0,true);
}
const TEST_LAB_MANIFEST = {
  ebony_eyes: { id: 'ebony_eyes', title: 'Ebony Eyes — Lock & Flow', path: 'games/ebony_eyes_game/index.html' },
  tigercall: { id: 'tigercall', title: 'TigerCall: Still Standing', path: 'games/TigerCall_StillStanding_PLX/index.html' },
  aviator: { id: 'aviator', title: 'Return of the Aviator', path: 'games/return-of-the-aviator/index.html' },
  i_was_away: { id: 'i_was_away', title: 'I Was Away', path: 'games/i-was-away/index.html' },
  streams: { id: 'streams', title: 'Streams', path: 'games/streams/index.html' },
  africa: { id: 'africa', title: 'I Woke Up in Africa', path: 'games/africa/index.html' },
  thru_the_fire: { id: 'thru_the_fire', title: 'Thru the Fire', path: 'games/thru-the-fire/index.html' },
  fire: { id: 'thru_the_fire', title: 'Thru the Fire', path: 'games/thru-the-fire/index.html' }
};

function launchTestLabGame(key) {
  const item = TEST_LAB_MANIFEST[key];
  if (item && item.path) {
    openExperience(item.path, true);
  } else if (typeof key === 'string' && key.includes('/')) {
    openExperience(key, true);
  } else {
    showToast('Playtest build path unavailable.');
  }
}

function launchProjectExperience(project){project?.experience?openExperience(project.experience):showToast('This Playable Experience is in development.')}
function openExperience(url){
  if(!url)return;
  stopAll();

  const frame=$('#experienceFrame');
  frame.removeAttribute('sandbox');
  frame.setAttribute('allow','autoplay; fullscreen; gamepad');
  frame.setAttribute('allowfullscreen','');

  const joinChar = url.includes('?') ? '&' : '?';
  const source = `${url}${joinChar}autostart=1`;

  frame.src=source;
  openOverlay('#experienceOverlay');
}
function openSupport(project=null){if(project){applyTheme(project);$('#supportProject').textContent=project.title;$('#supportProjectInput').value=project.title}else{$('#supportProject').textContent='the overall mission';$('#supportProjectInput').value='Overall Mission'}openOverlay('#supportOverlay')}
function openOverlay(selector){$(selector)?.classList.add('open');document.body.classList.add('locked')}
function closeOverlay(overlay){
  if(!overlay)return;
  overlay.classList.remove('open');
  if($$('.overlay.open').length===0){
    document.body.classList.remove('locked');
    document.body.style.overflow='';
  }
  overlay.querySelector('video')?.pause();
  const frame=overlay.querySelector('iframe');
  if(frame)frame.src='about:blank';
}
function bindOverlays(){
  window.addEventListener('message',event=>{if(event.data==='closeExperience'){const overlay=$('#experienceOverlay');if(overlay?.classList.contains('open'))closeOverlay(overlay)}});
  $$('.overlay-close').forEach(button=>button.onclick=()=>closeOverlay(button.closest('.overlay')));$$('.overlay').forEach(overlay=>overlay.addEventListener('click',event=>{if(event.target===overlay)closeOverlay(overlay)}));
  window.addEventListener('keydown',event=>{if(event.key==='Escape'){const overlay=$('.overlay.open');if(overlay)closeOverlay(overlay)}});$('#fullscreenVideo').onclick=()=>$('#cinemaVideo').requestFullscreen?.();
  const cinemaVideo=$('#cinemaVideo');
  if(cinemaVideo&&!cinemaVideo.dataset.playlistBound){
    cinemaVideo.dataset.playlistBound='true';
    cinemaVideo.addEventListener('ended',()=>{
      if(state.videoPlaylist.length>1&&state.videoPlaylistIndex<state.videoPlaylist.length-1)loadCinemaClip(state.videoPlaylistIndex+1,true);
    });
  }
  $('#cinemaPrev')?.addEventListener('click',()=>loadCinemaClip(state.videoPlaylistIndex-1,true));
  $('#cinemaNext')?.addEventListener('click',()=>loadCinemaClip(state.videoPlaylistIndex+1,true));
  $('#openSupportGeneral')?.addEventListener('click',()=>openSupport());
  const worthForm=$('#worthForm');
  if(worthForm)worthForm.onsubmit=event=>{
    event.preventDefault();
    const amount=Number.parseFloat($('#worthAmount')?.value||'');
    if(!Number.isFinite(amount)||amount<=0){showToast('Enter an amount greater than zero.');$('#worthAmount')?.focus();return}
    if(!WIX_PAY_WHAT_ITS_WORTH_URL||WIX_PAY_WHAT_ITS_WORTH_URL.includes('PASTE_YOUR_')){
      showToast('Add your Wix payment-page URL in js/app.js first.');
      return;
    }
    const project=$('#supportProjectInput')?.value||'Overall Mission';
    const url=new URL(WIX_PAY_WHAT_ITS_WORTH_URL,window.location.href);
    url.searchParams.set('amount',amount.toFixed(2));
    url.searchParams.set('project',project);
    const supporterName=$('#worthName')?.value.trim();
    const supporterEmail=$('#worthEmail')?.value.trim();
    const comment=$('#worthComment')?.value.trim();
    const keepPosted=$('#worthKeepPosted')?.checked;
    if(supporterName)url.searchParams.set('name',supporterName);
    if(supporterEmail)url.searchParams.set('email',supporterEmail);
    if(comment)url.searchParams.set('comment',comment);
    if(keepPosted)url.searchParams.set('keepPosted','yes');
    window.location.href=url.toString();
  };
  $('#ventureForm').onsubmit=event=>{event.preventDefault();showToast('Proposal saved on this device. The live submission connection is being finalized.');event.target.reset()};$('#bookingForm').onsubmit=event=>{event.preventDefault();showToast('Booking request saved on this device. The live submission connection is being finalized.');event.target.reset()};
}
function bindSoundscape(){
  const button=$('#soundscapeToggle');if(!button)return;
  button.onclick=()=>{state.soundscape=!state.soundscape;button.classList.toggle('active',state.soundscape);button.setAttribute('aria-pressed',String(state.soundscape));button.lastChild.textContent=state.soundscape?' SOUNDSCAPE MODE ACTIVE':' ACTIVATE SOUNDSCAPE MODE';if(!state.soundscape){['#previewA','#previewB'].forEach(id=>{const audio=$(id);audio.pause();audio.volume=0});state.previewProject=null}else selectMusicCard(state.musicIndex,true,false)};
}
function crossfadePreview(project){if(state.previewProject===project.id)return;state.previewProject=project.id;const incoming=state.previewChannel===0?$('#previewB'):$('#previewA'),outgoing=state.previewChannel===0?$('#previewA'):$('#previewB');state.previewChannel=1-state.previewChannel;incoming.src=project.audio;incoming.currentTime=12;incoming.volume=0;incoming.play().catch(()=>{});const duration=650,steps=26;let step=0;clearInterval(state.previewFade);state.previewFade=setInterval(()=>{step++;const progress=step/steps;incoming.volume=Math.min(.24,progress*.24);outgoing.volume=Math.max(0,(1-progress)*outgoing.volume);if(step>=steps){clearInterval(state.previewFade);outgoing.pause();outgoing.volume=0}},duration/steps)}
function gridCenter(selector){
  const item=$(selector);if(!item)return;
  const rail=item.parentElement;
  if(!rail)return;
  const canScroll=rail.scrollWidth>rail.clientWidth+2;
  if(canScroll){
    const target=item.offsetLeft-(rail.clientWidth-item.offsetWidth)/2;
    rail.scrollTo({left:Math.max(0,target),behavior:'smooth'});
  }
  if(document.scrollingElement)document.scrollingElement.scrollLeft=0;
}
function flashLock(selector,className){const element=$(selector);element.classList.add(className);clearTimeout(element._lockTimer);element._lockTimer=setTimeout(()=>element.classList.remove(className),760)}

function bindPointerWorlds(){
  $$('[data-parallax-zone]').forEach(zone=>{
    if(zone.dataset.pointerBound)return;zone.dataset.pointerBound='true';
    zone.addEventListener('pointermove',event=>{const rectangle=zone.getBoundingClientRect();const x=(event.clientX-rectangle.left)/rectangle.width-.5,y=(event.clientY-rectangle.top)/rectangle.height-.5;zone.style.setProperty('--mx',x.toFixed(3));zone.style.setProperty('--my',y.toFixed(3))});
    zone.addEventListener('pointerleave',()=>{zone.style.setProperty('--mx',0);zone.style.setProperty('--my',0)});
  });
}
function initFx(){state.fx.hero=createFx($('#heroFx'),'streams');state.fx.music=createFx($('#musicFx'),'streams');state.fx.experience=createFx($('#experienceFx'),'fire');state.fx.project=createFx($('#projectFx'),'streams')}
function setFxUniverse(which,id){if(state.fx[which])state.fx[which].universe=id}
function createFx(canvas,universe){
  if(!canvas)return null;const context=canvas.getContext('2d'),fx={canvas,context,universe,particles:[],width:0,height:0};
  const resize=()=>{const rectangle=canvas.getBoundingClientRect(),density=Math.min(devicePixelRatio||1,2);fx.width=rectangle.width;fx.height=rectangle.height;canvas.width=rectangle.width*density;canvas.height=rectangle.height*density;context.setTransform(density,0,0,density,0,0)};resize();addEventListener('resize',resize);
  for(let index=0;index<76;index++)fx.particles.push({x:Math.random(),y:Math.random(),size:.5+Math.random()*2,velocity:.15+Math.random()*.7,alpha:.08+Math.random()*.28,phase:Math.random()*6.28});
  const loop=time=>{drawFx(fx,time);requestAnimationFrame(loop)};requestAnimationFrame(loop);return fx;
}
function drawFx(fx,time){
  const {context,width,height}=fx;context.clearRect(0,0,width,height);const id=fx.universe;
  fx.particles.forEach((particle,index)=>{
    if(id==='fire'){particle.y-=particle.velocity*.00032;if(particle.y<-.05)particle.y=1.05;context.fillStyle=`rgba(255,${90+index%90},35,${particle.alpha})`;context.fillRect(particle.x*width+Math.sin(time*.001+particle.phase)*16,particle.y*height,particle.size,particle.size*2.4)}
    else if(id==='streams'){particle.y+=particle.velocity*.00016;if(particle.y>1.05)particle.y=-.05;context.strokeStyle=`rgba(190,240,255,${particle.alpha*.62})`;context.lineWidth=particle.size;context.beginPath();context.moveTo(particle.x*width,particle.y*height);context.quadraticCurveTo(particle.x*width+24,particle.y*height+20,particle.x*width-4,particle.y*height+54);context.stroke();if(index%13===0){context.fillStyle=`rgba(205,126,48,${particle.alpha})`;context.beginPath();context.arc(particle.x*width,particle.y*height,2.5+particle.size,0,7);context.fill()}}
    else if(id==='africa'){particle.x+=particle.velocity*.00012;if(particle.x>1.05)particle.x=-.05;context.fillStyle=`rgba(240,195,116,${particle.alpha*.72})`;context.beginPath();context.arc(particle.x*width,particle.y*height+Math.sin(time*.001+particle.phase)*12,particle.size,0,7);context.fill();if(index<7){context.strokeStyle='rgba(35,20,8,.34)';context.beginPath();const x=(particle.x*width+time*.025*(index+1))%(width+80)-40,y=height*(.18+.07*index);context.moveTo(x,y);context.quadraticCurveTo(x+8,y-7,x+16,y);context.quadraticCurveTo(x+24,y-7,x+32,y);context.stroke()}}
    else{particle.x+=Math.sin(time*.0004+particle.phase)*.00008;particle.y+=particle.velocity*.00005;if(particle.y>1.05)particle.y=-.05;context.fillStyle=`rgba(190,220,235,${particle.alpha*.45})`;context.beginPath();context.arc(particle.x*width,particle.y*height,particle.size*1.5,0,7);context.fill()}
  });
}
function buildAfricaStandaloneView(){
  const project=projectById('africa');
  if(!project)return;
  applyTheme(project);
  const clips=project.clips||[];
  const video=$('#africaStandaloneVideo');
  const rail=$('#africaStandaloneRail');
  if(!video||!rail)return;
  let active=0;
  const descriptions={
    'The Introduction':'The first step into the question that shaped the entire journey.',
    'The School':'Education, service, and the people who made the mission meaningful.',
    'The Greeting':'A welcome that carries culture, warmth, and connection.',
    'The Land of 1000 Hills':'The landscape becomes part of the story—and part of the awakening.',
    'The Village':'Community, everyday life, and the moments that cannot be staged.',
    'The Hard Work':'Purpose is revealed through effort, discipline, and shared responsibility.',
    'The Banana Crown':'Joy, personality, and an unforgettable moment from the journey.',
    'The Food':'A table, a culture, and the way a meal can become memory.',
    'The Conclusion':'The journey returns to the question: what changed after Africa?',
    'The Music Video':'The story, sound, and spirit come together in the final visual expression.'
  };
  rail.innerHTML=clips.map((clip,index)=>`
    <button class="africa-chapter-card" data-africa-standalone-chapter="${index}" style="background:#140c06;border:1px solid rgba(209,140,54,.3);border-radius:10px;padding:10px;text-align:left;color:#fff;cursor:pointer;transition:.2s">
      <img src="${clip.poster||project.poster}" alt="${clip.title}" style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:6px;margin-bottom:8px">
      <span style="font-size:10px;color:#ffd26b;font-weight:900;letter-spacing:.12em;display:block">CHAPTER ${String(index+1).padStart(2,'0')}</span>
      <strong style="font-size:13px;display:block;margin:2px 0 4px">${clip.title}</strong>
      <em style="font-size:11px;color:#bbb;font-style:normal;line-height:1.4;display:block">${descriptions[clip.title]||'Continue the journey.'}</em>
    </button>
  `).join('');
  const selectChapter=(index,autoplay=false)=>{
    active=(index+clips.length)%clips.length;
    const clip=clips[active];
    video.pause();
    video.src=clip.src;
    video.poster=clip.poster||project.poster||project.cover;
    if($('#africaStandaloneCounter'))$('#africaStandaloneCounter').textContent=`CHAPTER ${String(active+1).padStart(2,'0')} / ${String(clips.length).padStart(2,'0')}`;
    if($('#africaStandaloneTitle'))$('#africaStandaloneTitle').textContent=clip.title.toUpperCase();
    rail.querySelectorAll('[data-africa-standalone-chapter]').forEach((button,i)=>{
      const isActive=i===active;
      button.style.borderColor=isActive?'#ffd26b':'rgba(209,140,54,.3)';
      button.style.background=isActive?'#22140a':'#140c06';
    });
    if(autoplay)video.play().catch(()=>{});
  };
  rail.querySelectorAll('[data-africa-standalone-chapter]').forEach(button=>{
    button.onclick=()=>selectChapter(+button.dataset.africaStandaloneChapter,true);
  });
  if($('#africaStandalonePrev'))$('#africaStandalonePrev').onclick=()=>selectChapter(active-1,true);
  if($('#africaStandaloneNext'))$('#africaStandaloneNext').onclick=()=>selectChapter(active+1,true);
  selectChapter(0,false);
}
init().catch(error=>{console.error(error);showToast('Could not load the platform data.')});
