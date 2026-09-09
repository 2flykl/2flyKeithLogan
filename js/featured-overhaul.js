const state={projects:[],featured:[],index:0,currentTrackIndex:0,docIndex:0};
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

const globalTickerItems=[
  'THE 2FLY ANTI-ALGORITHM EXPERIMENT',
  'PLAYABLE EXPERIENCES ARE BORN HERE',
  'LISTEN · WATCH · STEP INSIDE THE WORK',
  'NEW BUILDS AND PROJECTS ARE ALWAYS IN MOTION',
  'EXPERIENCE FIRST · DECIDE WHAT IT IS WORTH SECOND'
];
const helpTickerItems=[
  'HELP FUND THE NEXT PLAYABLE EXPERIENCE',
  'SUPPORT INDEPENDENT MUSIC · VIDEO · SOFTWARE · STORYTELLING',
  'YOUR SUPPORT HELPS TURN IDEAS INTO WORKING EXPERIENCES',
  'PARTICIPATE IN WHAT 2FLY BUILDS NEXT'
];

function resolveAsset(path){
  if(!path)return '';
  if(/^https?:\/\//i.test(path)||path.startsWith('data:'))return path;
  return `../${path.replace(/^\//,'')}`;
}
function formatTime(seconds){
  if(!Number.isFinite(seconds))return '0:00';
  const mins=Math.floor(seconds/60);
  const secs=Math.floor(seconds%60).toString().padStart(2,'0');
  return `${mins}:${secs}`;
}
function duplicateTicker(items){
  return [...items,...items].map(item=>`<span>${item}</span>`).join('');
}

async function init(){
  $('#globalTickerTrack').innerHTML=duplicateTicker(globalTickerItems);
  $('#helpTickerTrack').innerHTML=duplicateTicker(helpTickerItems);
  bindPlayer();
  try{
    const response=await fetch('../data/projects.json?v=4.0.3');
    state.projects=response.ok?await response.json():[];
  }catch(error){console.warn('Featured project data failed to load',error)}
  state.featured=state.projects.filter(project=>project.featured&&project.explore);
  buildTabs();
  bindCarousel();
  if(state.featured.length){setFeature(0,false);loadProjectAudio(state.featured[0],false)}
}

function buildTabs(){
  const tabs=$('#featureTabs');
  tabs.innerHTML=state.featured.map((project,index)=>`<button type="button" data-index="${index}">${project.title.toUpperCase()}</button>`).join('');
  tabs.querySelectorAll('button').forEach(button=>button.addEventListener('click',()=>setFeature(+button.dataset.index)));
}
function bindCarousel(){
  $('#featurePrev').addEventListener('click',()=>setFeature(state.index-1));
  $('#featureNext').addEventListener('click',()=>setFeature(state.index+1));
  document.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'&&!event.target.matches('input,video'))setFeature(state.index-1);
    if(event.key==='ArrowRight'&&!event.target.matches('input,video'))setFeature(state.index+1);
  });
  let touchStart=0;
  $('#featuredStage').addEventListener('touchstart',event=>touchStart=event.touches[0]?.clientX||0,{passive:true});
  $('#featuredStage').addEventListener('touchend',event=>{
    const end=event.changedTouches[0]?.clientX||0;
    if(Math.abs(end-touchStart)>60)setFeature(state.index+(end<touchStart?1:-1));
  },{passive:true});
}
function setTheme(project){
  document.documentElement.style.setProperty('--accent',project.accent||'#e45b28');
  document.documentElement.style.setProperty('--accent2',project.accent2||'#230a06');
  document.documentElement.style.setProperty('--soft',project.soft||'#f2d0c4');
  $('#featureBackdrop').style.backgroundImage=`url("${resolveAsset(project.poster||project.cover)}")`;
}
function setFeature(index,loadAudio=true){
  const count=state.featured.length;if(!count)return;
  state.index=(index+count)%count;
  const project=state.featured[state.index];
  state.docIndex=0;
  setTheme(project);
  $('#featureCounter').textContent=`${String(state.index+1).padStart(2,'0')} / ${String(count).padStart(2,'0')}`;
  $$('#featureTabs button').forEach((button,i)=>button.classList.toggle('active',i===state.index));
  $('#featureContent').innerHTML=project.id==='africa'?renderDocumentary(project):renderStandard(project);
  bindFeatureActions(project);
  if(project.id==='africa')bindDocumentary(project);
  if(loadAudio&&project.audio)loadProjectAudio(project,false);
}
function renderStandard(project){
  const hasAudio=!!project.audio,hasVideo=!!project.video,hasExperience=!!project.experience;
  return `<div class="feature-standard">
    <div class="feature-art"><img src="${resolveAsset(project.cover)}" alt="${project.title} cover artwork"></div>
    <div class="feature-info">
      <div class="kicker">${(project.word||'FEATURED PROJECT').toUpperCase()} · FEATURED PROJECT</div>
      <h1>${project.title.toUpperCase()}</h1>
      <p class="subtitle">${project.subtitle||''}</p>
      <p class="desc">${project.description||''}</p>
      <div class="format-row">
        <button id="featureListen" type="button" ${hasAudio?'':'disabled'}><span>01</span><strong>LISTEN</strong><small>${hasAudio?'HEAR THE WORK':'IN DEVELOPMENT'}</small></button>
        <button id="featureWatch" type="button" ${hasVideo?'':'disabled'}><span>02</span><strong>WATCH</strong><small>${hasVideo?'SEE THE STORY':'IN PRODUCTION'}</small></button>
        <button id="featurePlay" type="button" ${hasExperience?'':'disabled'}><span>03</span><strong>PLAYABLE</strong><small>${hasExperience?'STEP INSIDE':'IN DEVELOPMENT'}</small></button>
      </div>
      <a class="feature-page-link" href="../index.html#project/${project.id}">EXPLORE ${project.title.toUpperCase()} →</a>
    </div>
  </div>`;
}
function renderDocumentary(project){
  const clips=project.clips||[];
  const first=clips[0]||{};
  return `<div class="feature-doc">
    <div>
      <div class="doc-player">
        <video id="docVideo" controls playsinline preload="metadata" poster="${resolveAsset(first.poster||project.poster||project.cover)}"></video>
        <div class="doc-meta"><div><small id="docCounter">CHAPTER 01 / ${String(clips.length).padStart(2,'0')}</small><br><strong id="docTitle">${first.title||project.title}</strong></div><small>${(first.type||'DOCUMENTARY').toUpperCase()}</small></div>
      </div>
      <div class="chapter-rail" id="chapterRail">${clips.map((clip,index)=>`<button type="button" data-index="${index}">${String(index+1).padStart(2,'0')} · ${clip.title}</button>`).join('')}</div>
    </div>
    <aside class="doc-side">
      <div>
        <div class="kicker" style="color:var(--accent);font-size:9px;font-weight:1000;letter-spacing:.15em">DOCUMENTARY FEATURE</div>
        <h1>${project.title.toUpperCase()}</h1>
        <p>${project.description||''}</p>
      </div>
      <div class="playable-stack">
        <a class="playable-card" href="../games/africa/index.html"><small>PLAYABLE EXPERIENCE 01</small><strong>PNG / INTENTION CERTIFICATION</strong><em>Guided reflection, purpose, service, and a downloadable intention certificate.</em></a>
        <a class="playable-card" href="../games/BlackandGifted/index.html"><small>PLAYABLE EXPERIENCE 02</small><strong>BLACK & GIFTED</strong><em>Step into the playable world connected to the project’s wider identity and purpose themes.</em></a>
        <button class="playable-card" id="featureListen" type="button"><small>SOUNDTRACK</small><strong>LISTEN TO THE PROJECT</strong><em>Keep the music playing while you explore the site.</em></button>
      </div>
    </aside>
  </div>`;
}
function bindFeatureActions(project){
  $('#featureListen')?.addEventListener('click',()=>loadProjectAudio(project,true));
  $('#featureWatch')?.addEventListener('click',()=>{
    if(!project.video)return;
    window.open(project.video,'_blank','noopener');
  });
  $('#featurePlay')?.addEventListener('click',()=>{
    if(!project.experience)return;
    window.location.href=resolveAsset(project.experience);
  });
}
function bindDocumentary(project){
  const clips=project.clips||[];
  const buttons=$$('#chapterRail button');
  const selectChapter=index=>{
    if(!clips.length)return;
    state.docIndex=(index+clips.length)%clips.length;
    const clip=clips[state.docIndex];
    const video=$('#docVideo');
    video.pause();
    video.src=clip.src||'';
    video.poster=clip.poster||project.poster||'';
    video.load();
    $('#docCounter').textContent=`CHAPTER ${String(state.docIndex+1).padStart(2,'0')} / ${String(clips.length).padStart(2,'0')}`;
    $('#docTitle').textContent=clip.title||project.title;
    buttons.forEach((button,i)=>button.classList.toggle('active',i===state.docIndex));
  };
  buttons.forEach(button=>button.addEventListener('click',()=>selectChapter(+button.dataset.index)));
  selectChapter(0);
}

function bindPlayer(){
  const audio=$('#featuredAudio');
  $('#playerPlay').addEventListener('click',async()=>{
    if(!audio.src){const project=state.featured[state.index];if(project?.audio)loadProjectAudio(project,true);return}
    if(audio.paused){try{await audio.play()}catch(error){console.warn('Playback blocked',error)}}else audio.pause();
  });
  $('#playerPrev').addEventListener('click',()=>stepAudio(-1));
  $('#playerNext').addEventListener('click',()=>stepAudio(1));
  $('#playerSeek').addEventListener('input',event=>{if(Number.isFinite(audio.duration)&&audio.duration>0)audio.currentTime=(+event.target.value/100)*audio.duration});
  $('#playerVolume').addEventListener('input',event=>audio.volume=+event.target.value);
  $('#detachPlayer').addEventListener('click',()=>alert('Detachable playback is reserved for the Music-page phase. The player shell is already structured so we can add it without redesigning this page.'));
  audio.volume=.75;
  audio.addEventListener('play',()=>$('#playerPlay').textContent='❚❚');
  audio.addEventListener('pause',()=>$('#playerPlay').textContent='▶');
  audio.addEventListener('timeupdate',()=>{
    $('#playerCurrent').textContent=formatTime(audio.currentTime);
    $('#playerDuration').textContent=formatTime(audio.duration);
    $('#playerSeek').value=Number.isFinite(audio.duration)&&audio.duration>0?(audio.currentTime/audio.duration)*100:0;
  });
  audio.addEventListener('ended',()=>stepAudio(1,true));
}
function audioProjects(){return state.featured.filter(project=>project.audio)}
function loadProjectAudio(project,autoplay=false){
  if(!project?.audio)return;
  const audio=$('#featuredAudio');
  const list=audioProjects();
  state.currentTrackIndex=Math.max(0,list.findIndex(item=>item.id===project.id));
  audio.src=project.audio;
  audio.load();
  $('#playerCover').src=resolveAsset(project.cover);
  $('#playerCover').alt=`${project.title} cover`;
  $('#playerTitle').textContent=project.title;
  if('mediaSession'in navigator){
    try{
      navigator.mediaSession.metadata=new MediaMetadata({title:project.title,artist:'2Fly Keith Logan',artwork:[{src:resolveAsset(project.cover)}]});
    }catch(error){}
  }
  if(autoplay)audio.play().catch(()=>{});
}
function stepAudio(direction,autoplay=true){
  const list=audioProjects();if(!list.length)return;
  state.currentTrackIndex=(state.currentTrackIndex+direction+list.length)%list.length;
  loadProjectAudio(list[state.currentTrackIndex],autoplay);
}

document.addEventListener('DOMContentLoaded',init);
