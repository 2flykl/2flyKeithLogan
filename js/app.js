const state={
  projects:[],featured:[],heroIndex:0,musicIndex:0,videoIndex:0,experienceIndex:0,
  createIndex:0,projectMediaIndex:0,trackIndex:0,currentView:'home',autoTimer:null,
  soundscape:false,previewChannel:0,previewProject:null,fx:{},videoProjects:[],
  experiences:[],createPaths:[],projectMedia:[]
};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

async function init(){
  const response=await fetch('data/projects.json');
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
  bindNavigation();
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
function navigate(target){
  if(!target)return;
  location.hash=target;
  document.querySelector('.mobile-nav')?.classList.remove('open');
}
function bindNavigation(){
  $$('.nav button,.mobile-nav button,[data-go]').forEach(button=>{
    button.addEventListener('click',()=>navigate(button.dataset.view||button.dataset.go));
  });
  $('.menu-btn')?.addEventListener('click',()=>$('.mobile-nav')?.classList.toggle('open'));
  window.addEventListener('popstate',route);
}
function route(){
  const requested=(location.hash||'#home').slice(1).split('?')[0];
  const projectMatch=requested.match(/^project\/([a-z0-9-]+)$/i);
  const allowed=['home','music','videos','experiences','support'];
  state.currentView=projectMatch?'project':allowed.includes(requested)?requested:'home';
  $$('.view').forEach(view=>view.classList.toggle('active',view.id===`view-${state.currentView}`));
  $$('.nav button,.mobile-nav button').forEach(button=>button.classList.toggle('active',button.dataset.view===state.currentView));
  closeHeroPortal(false);
  if(projectMatch){
    const project=projectById(projectMatch[1]);
    if(project?.explore)buildProjectPage(project);else navigate('home');
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
      if(index!==state.heroIndex){closeHeroPortal(false);setHero(index);return;}
      openHeroPortal(project);
    });
    rail.appendChild(button);
  });
  const previous=()=>{closeHeroPortal(false);setHero(state.heroIndex-1)};
  const next=()=>{closeHeroPortal(false);setHero(state.heroIndex+1)};
  $('#heroPrev').onclick=previous;$('#heroNext').onclick=next;
  $('#heroTopPrev').onclick=previous;$('#heroTopNext').onclick=next;
  $('#heroPlay').onclick=()=>playProject(state.featured[state.heroIndex],true);
  $('#heroExperience').onclick=()=>launchProjectExperience(state.featured[state.heroIndex]);
  $('#heroSupport').onclick=()=>openSupport(state.featured[state.heroIndex]);
  $('#heroPortalBack').onclick=()=>closeHeroPortal(true);
  $('#heroPortalExplore').onclick=()=>navigate(`project/${state.featured[state.heroIndex].id}`);
  $('#heroTotal').textContent=String(state.featured.length).padStart(2,'0');
  const stage=$('#heroStage');
  stage.addEventListener('mouseenter',()=>clearInterval(state.autoTimer));
  stage.addEventListener('mouseleave',()=>{if(!stage.classList.contains('portal-open'))startHeroAuto()});
  startHeroAuto();
}
function startHeroAuto(){
  clearInterval(state.autoTimer);
  state.autoTimer=setInterval(()=>{if(!$('#heroStage').classList.contains('portal-open'))setHero(state.heroIndex+1)},7000);
}
function setHero(index){
  const count=state.featured.length;
  if(!count)return;
  state.heroIndex=(index+count)%count;
  const project=state.featured[state.heroIndex];
  applyTheme(project);
  const stage=$('#heroStage');
  stage.dataset.word=project.word;stage.dataset.universe=project.id;
  $('#heroUniverse').textContent=`THE ${project.word} UNIVERSE`;
  $('#heroTitle').textContent=project.title.toUpperCase();
  $('#heroSubtitle').textContent=project.subtitle;
  $('#heroPosition').textContent=String(state.heroIndex+1).padStart(2,'0');
  $('#heroExperience').classList.toggle('hidden-option',!project.experience);
  $$('.hero-cover').forEach((cover,coverIndex)=>{
    const raw=coverIndex-state.heroIndex;
    const difference=(raw+count)%count;
    const position=difference===0?2:difference===1?3:difference===count-1?1:0;
    cover.dataset.pos=position;cover.classList.toggle('active',coverIndex===state.heroIndex);
  });
  setFxUniverse('hero',project.id);
}
function openHeroPortal(project){
  clearInterval(state.autoTimer);
  const stage=$('#heroStage');stage.classList.add('engaged','portal-open');
  $('#heroPortalNumber').textContent=`${String(state.heroIndex+1).padStart(2,'0')} / ${String(state.featured.length).padStart(2,'0')}`;
  $('#heroPortalKicker').textContent=`${project.word} · FEATURED CONTENT`;
  $('#heroPortalTitle').textContent=project.title.toUpperCase();
  $('#heroPortalDescription').textContent=project.description;
  const available=[project.audio?'MUSIC':'',project.video?'FILM':'',project.experience?'EXPERIENCE':'',project.explore?'ARCHIVE':''].filter(Boolean);
  $('#heroPortalAvailability').innerHTML=available.map(item=>`<span>${item}</span>`).join('');
  $('#heroPortalExplore').textContent=`EXPLORE CONTENT FOR ${project.title.toUpperCase()}`;
}
function closeHeroPortal(restart=true){
  const stage=$('#heroStage');if(!stage)return;
  stage.classList.remove('engaged','portal-open');
  if(restart)startHeroAuto();
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
  $('#musicPanelPlay').onclick=()=>{const project=state.projects[state.musicIndex];project?.audio?loadTrack(state.musicIndex,true):showToast('Audio is coming soon.')};
  $('#musicPanelExperience').onclick=()=>launchProjectExperience(state.projects[state.musicIndex]);
  $('#musicPanelCreate').onclick=()=>openSupport(state.projects[state.musicIndex]);
  $('#musicTotal').textContent=String(state.projects.length).padStart(2,'0');
  selectMusicCard(0,false,true);
}
function selectMusicCard(index,preview=false,lockAndCenter=false){
  const project=state.projects[index];if(!project)return;
  state.musicIndex=index;applyTheme(project);
  $$('.music-card').forEach((card,cardIndex)=>card.classList.toggle('selected',cardIndex===index));
  $('#musicFocusWord').textContent=project.word;$('#musicFocusTitle').textContent=project.title.toUpperCase();
  $('#musicFocusDescription').textContent=project.description;$('#selectedMusicCover').src=project.cover;
  $('#selectedMusicCover').alt=`${project.title} selected album cover`;$('#panelAlbumTitle').textContent=project.title.toUpperCase();
  const tracks=project.tracks?.length?project.tracks:[{title:project.title,subtitle:project.subtitle,audio:project.audio}];
  $('#trackCount').textContent=`${String(tracks.length).padStart(2,'0')} ${tracks.length===1?'TRACK':'TRACKS'}`;
  $('#musicTracklist').innerHTML=tracks.map((track,trackIndex)=>`<li class="${track.audio?'playable':'unavailable'}"><button type="button" data-panel-track="${trackIndex}" ${track.audio?'':'disabled'}><span>${String(trackIndex+1).padStart(2,'0')}</span><div><strong>${track.title}</strong><small>${track.subtitle||''}</small></div><b>${track.audio?'PLAY':'SOON'}</b></button></li>`).join('');
  $('#musicTracklist').querySelectorAll('[data-panel-track]').forEach(button=>button.onclick=()=>{
    const track=tracks[+button.dataset.panelTrack];if(!track?.audio)return;
    if(track.audio===project.audio)loadTrack(index,true);else playDirectAudio(track.audio,project.cover,track.title);
  });
  $('#musicPanelPlay').disabled=!project.audio;$('#musicPanelPlay').textContent=project.audio?'▶ PLAY FULL':'COMING SOON';
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
  $('#videoFocusWord').textContent=project.word||'VISUAL STORY';$('#videoFocusTitle').textContent=project.title.toUpperCase();$('#videoFocusDescription').textContent=project.description;
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
    {id:'away',projectId:'away',title:'I Was Away',word:'REFLECTION',glyph:'⌁',cover:get('away').cover,path:'games/i-was-away/index.html',description:'A PainterFly field demo where a living painted landscape becomes a guided boomerang experience.',objective:'Watch the instructor, shape the throw, move into the return circle, and complete three controlled catches.',mechanics:['PainterFly landscape','Guided throw tutorial','Boomerang flight','Multi-view camera']},
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
  $('#experiencePanelTitle').textContent=experience.title.toUpperCase();$('#experienceObjective').textContent=experience.objective;$('#experienceCover').src=experience.cover;$('#experienceCover').alt=`${experience.title} experience artwork`;$('#experienceGlyph').textContent=experience.glyph;
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
  if(project.experience)actions.push(`<button data-project-action="experience">ENTER EXPERIENCE</button>`);
  actions.push(`<button data-project-action="create" class="project-create-action">HELP ME CREATE</button>`);
  $('#projectActions').innerHTML=actions.join('');
  $('#projectActions').querySelectorAll('[data-project-action]').forEach(button=>button.onclick=()=>{
    const action=button.dataset.projectAction;
    if(action==='listen')playProject(project,false);if(action==='watch')openVideo(project);if(action==='experience')openExperience(project.experience);if(action==='create')openSupport(project);
  });
  $('#projectReturn').onclick=()=>navigate('home');
  buildProjectMedia(project);setFxUniverse('project',project.id);bindPointerWorlds();
}
function buildProjectMedia(project){
  const media=[];
  if(project.audio)media.push({kind:'audio',label:'ORIGINAL MUSIC',title:project.title,description:'Listen to the project soundtrack inside the permanent archive.',image:project.cover,action:'PLAY SONG'});
  (project.clips||[]).forEach((clip,index)=>media.push({kind:'video',label:clip.type||`VIDEO ${index+1}`,title:clip.title,description:'Watch this visual chapter without leaving the project universe.',image:clip.poster||project.poster||project.cover,src:clip.src,action:'WATCH CHAPTER'}));
  if(project.experience)media.push({kind:'experience',label:'INTERACTIVE EXPERIENCE',title:`Enter ${project.title}`,description:'Move from passive viewing into a playable version of the project idea.',image:project.cover,src:project.experience,action:'LAUNCH EXPERIENCE'});
  media.push({kind:'archive',label:'PROJECT ARCHIVE',title:'Story, Credits & Notes',description:'Continue through production credits, project notes, and the evolving visual archive.',image:project.poster||project.cover,action:'VIEW ARCHIVE'});
  state.projectMedia=media;state.projectMediaIndex=0;
  $('#projectMediaPrev').onclick=()=>stepProjectMedia(-1);$('#projectMediaNext').onclick=()=>stepProjectMedia(1);selectProjectMedia(0,project);
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
function playDirectAudio(source,cover,title){const audio=$('#audio');stopAll(audio);audio.src=source;$('#nowCover').src=cover;$('#nowTitle').textContent=title;audio.play().catch(()=>showToast('Tap play to begin audio.'))}
function stopAll(except=null){document.querySelectorAll('audio,video').forEach(media=>{if(media!==except&&!media.paused)media.pause()})}
document.addEventListener('play',event=>{if(event.target.matches('audio,video'))stopAll(event.target)},true);
function bindPlayer(){
  const audio=$('#audio');
  $('#playerPlay').onclick=()=>audio.paused?(stopAll(audio),audio.play().catch(()=>{})):audio.pause();$('#playerPrev').onclick=()=>nextTrack(-1);$('#playerNext').onclick=()=>nextTrack(1);
  $('#seek').oninput=event=>{if(audio.duration)audio.currentTime=event.target.value/100*audio.duration};$('#volume').oninput=event=>audio.volume=event.target.value;audio.volume=.75;
  audio.onplay=()=>{document.body.classList.add('player-open');$('#playerPlay').textContent='❚❚'};audio.onpause=()=>$('#playerPlay').textContent='▶';
  audio.ontimeupdate=()=>{if(audio.duration){$('#seek').value=audio.currentTime/audio.duration*100;$('#currentTime').textContent=formatTime(audio.currentTime);$('#duration').textContent=formatTime(audio.duration)}};audio.onended=()=>nextTrack(1);
}
function loadTrack(index,autoplay=false){const project=state.projects[index];if(!project?.audio)return;state.trackIndex=index;applyTheme(project);stopAll();$('#audio').src=project.audio;$('#nowCover').src=project.cover;$('#nowTitle').textContent=project.title;if(autoplay)$('#audio').play().catch(()=>showToast('Tap play to begin audio.'))}
function nextTrack(direction){if(!state.projects.length)return;let index=state.trackIndex;do{index=(index+direction+state.projects.length)%state.projects.length}while(!state.projects[index].audio);loadTrack(index,true)}
function formatTime(seconds){seconds=Math.floor(seconds||0);return `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`}
function openVideo(project){if(!project?.video)return;stopAll();applyTheme(project);$('#cinemaTitle').textContent=project.title;$('#cinemaVideo').src=project.video;$('#cinemaVideo').poster=project.poster||'';openOverlay('#cinemaOverlay');$('#cinemaVideo').play().catch(()=>{})}
function launchProjectExperience(project){project?.experience?openExperience(project.experience):showToast('This experience is coming soon.')}
function openExperience(url){if(!url)return;stopAll();$('#experienceFrame').src=url;openOverlay('#experienceOverlay')}
function openSupport(project=null){if(project){applyTheme(project);$('#supportProject').textContent=project.title;$('#supportProjectInput').value=project.title}else{$('#supportProject').textContent='the overall mission';$('#supportProjectInput').value='Overall Mission'}openOverlay('#supportOverlay')}
function openOverlay(selector){$(selector)?.classList.add('open');document.body.classList.add('locked')}
function closeOverlay(overlay){overlay.classList.remove('open');document.body.classList.remove('locked');overlay.querySelector('video')?.pause();const frame=overlay.querySelector('iframe');if(frame)frame.src='about:blank'}
function bindOverlays(){
  window.addEventListener('message',event=>{if(event.data==='closeExperience'){const overlay=$('#experienceOverlay');if(overlay?.classList.contains('open'))closeOverlay(overlay)}});
  $$('.overlay-close').forEach(button=>button.onclick=()=>closeOverlay(button.closest('.overlay')));$$('.overlay').forEach(overlay=>overlay.addEventListener('click',event=>{if(event.target===overlay)closeOverlay(overlay)}));
  window.addEventListener('keydown',event=>{if(event.key==='Escape'){const overlay=$('.overlay.open');if(overlay)closeOverlay(overlay)}});$('#fullscreenVideo').onclick=()=>$('#cinemaVideo').requestFullscreen?.();$('#openSupportGeneral').onclick=()=>openSupport();
  $$('.amount').forEach(button=>button.onclick=()=>showToast(`${button.textContent} selected — connect your Wix payment link here.`));$('#customAmount').onclick=()=>showToast('Connect this button to a custom Wix payment page.');
  $('#ventureForm').onsubmit=event=>{event.preventDefault();showToast('Proposal captured in Beta. Connect this form to your live workflow next.');event.target.reset()};$('#bookingForm').onsubmit=event=>{event.preventDefault();showToast('Booking request captured in Beta. Connect this form to your live workflow next.');event.target.reset()};
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
init().catch(error=>{console.error(error);showToast('Could not load the platform data.')});
