
const state={
  projects:[],featured:[],heroIndex:0,trackIndex:0,currentView:'home',autoTimer:null
};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

async function init(){
  const res=await fetch('data/projects.json');
  state.projects=await res.json();
  state.featured=state.projects.filter(p=>p.featured);
  buildHero();
  buildMusic();
  buildVideos();
  buildExperiences();
  bindNavigation();
  bindPlayer();
  bindOverlays();
  route();
  window.addEventListener('hashchange',route);
  setHero(0);
  const firstPlayable=state.projects.findIndex(p=>p.audio);
  loadTrack(firstPlayable,false);
}
function showToast(text){
  const toast=$('#toast');toast.textContent=text;toast.classList.add('show');
  clearTimeout(toast._t);toast._t=setTimeout(()=>toast.classList.remove('show'),1500);
}
function applyTheme(p){
  const root=document.documentElement;
  root.style.setProperty('--accent',p.accent||'#168D94');
  root.style.setProperty('--accent2',p.accent2||'#071E22');
  root.style.setProperty('--soft',p.soft||'#D7F0EF');
}
function bindNavigation(){
  const navigate=(target)=>{
    if(!target)return;
    history.pushState(null,'','#'+target);
    route();
    document.querySelector('.mobile-nav')?.classList.remove('open');
  };
  document.querySelectorAll('.nav button,.mobile-nav button,[data-go]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      navigate(btn.dataset.view||btn.dataset.go);
    });
  });
  const menu=document.querySelector('.menu-btn');
  if(menu)menu.onclick=()=>document.querySelector('.mobile-nav')?.classList.toggle('open');
  window.addEventListener('popstate',route);
}
function route(){
  const requested=(location.hash||'#home').slice(1).split('?')[0];
  const allowed=['home','music','videos','experiences','support'];
  state.currentView=allowed.includes(requested)?requested:'home';
  document.querySelectorAll('.view').forEach(v=>{
    v.classList.toggle('active',v.id===`view-${state.currentView}`);
  });
  document.querySelectorAll('.nav button,.mobile-nav button').forEach(b=>{
    b.classList.toggle('active',b.dataset.view===state.currentView);
  });
  window.scrollTo({top:0,left:0,behavior:'auto'});
}
function buildHero(){
  const rail=$('#coverRail');
  state.featured.forEach((p,i)=>{
    const b=document.createElement('button');b.className='hero-cover';b.dataset.index=i;
    b.innerHTML=`<img src="${p.cover}" alt="${p.title} cover">`;
    b.onclick=()=>setHero(i);rail.appendChild(b);
  });
  $('#heroPrev').onclick=()=>setHero(state.heroIndex-1);
  $('#heroNext').onclick=()=>setHero(state.heroIndex+1);
  $('#heroPlay').onclick=()=>playProject(state.featured[state.heroIndex]);
  const stage=$('#heroStage');
  stage.addEventListener('mouseenter',()=>clearInterval(state.autoTimer));
  stage.addEventListener('mouseleave',startHeroAuto);
  startHeroAuto();
}
function startHeroAuto(){
  clearInterval(state.autoTimer);
  state.autoTimer=setInterval(()=>setHero(state.heroIndex+1),6500);
}
function setHero(i){
  const count=state.featured.length;
  state.heroIndex=(i+count)%count;
  const p=state.featured[state.heroIndex];
  applyTheme(p);
  $('#heroStage').dataset.word=p.word;
  $('#heroTitle').textContent=p.title.toUpperCase();
  $('#heroSubtitle').textContent=p.subtitle;
  $$('.hero-cover').forEach((el,idx)=>{
    const diff=(idx-state.heroIndex+count)%count;
    const pos=diff===0?2:diff===1?3:diff===2?0:1;
    el.dataset.pos=pos;el.classList.toggle('active',idx===state.heroIndex);
  });
}
function cardTemplate(p,i,mode='music'){
  const experience=p.experience?`<button class="btn dark" data-experience="${p.id}">EXPERIENCE</button>`:'';
  const play=p.audio?`<button class="btn primary" data-track="${i}">PLAY</button>`:'<button class="btn" disabled>COMING SOON</button>';
  return `<article class="card"><img src="${p.cover}" alt="${p.title} cover"><h3>${p.title}</h3><p>${p.description}</p><div class="card-actions">${play}${experience}<button class="support-btn" data-support="${p.id}">PAY WHAT IT'S WORTH</button></div></article>`;
}
function buildMusic(){
  $('#musicGrid').innerHTML=state.projects.map((p,i)=>cardTemplate(p,i)).join('');
}
function buildVideos(){
  const list=state.projects.filter(p=>p.video);
  $('#videoGrid').innerHTML=list.map(p=>`<article class="video-card"><button class="video-poster" data-video="${p.id}"><img src="${p.poster}" alt="${p.title} video poster"></button><div class="video-info"><div><h3>${p.title}</h3><p>${p.subtitle}</p></div><button class="support-btn" data-support="${p.id}">PAY WHAT IT'S WORTH</button></div></article>`).join('');
}
function buildExperiences(){
  const exps=[
    ['fire','🔥','Thru the Fire','Choose what to save before the timer reaches zero.'],
    ['streams','🌊','Streams','Collect pennies, resist attention, and stay above the waterfall.'],
    ['africa','🌍','I Woke Up in Africa','Create a daily intention and downloadable certificate.'],
    ['guns','🎹','Guns & Butter','Repeat progressive note patterns on your chosen keyboard.']
  ];
  $('#experienceGrid').innerHTML=exps.map(([id,icon,title,desc])=>`<article class="card exp-card"><div><div class="exp-icon">${icon}</div><h3>${title}</h3><p>${desc}</p></div><button class="btn primary" data-launch-game="${id}">LAUNCH EXPERIENCE</button></article>`).join('');
}
function projectById(id){return state.projects.find(p=>p.id===id)}
function playProject(p){
  const idx=state.projects.findIndex(x=>x.id===p.id);
  loadTrack(idx,true);location.hash='music';
}
function stopAll(except=null){
  document.querySelectorAll('audio,video').forEach(m=>{if(m!==except&&!m.paused)m.pause()});
}
document.addEventListener('play',e=>{if(e.target.matches('audio,video'))stopAll(e.target)},true);
function bindPlayer(){
  const audio=$('#audio');
  $('#playerPlay').onclick=()=>audio.paused?(stopAll(audio),audio.play()):audio.pause();
  $('#playerPrev').onclick=()=>nextTrack(-1);
  $('#playerNext').onclick=()=>nextTrack(1);
  $('#seek').oninput=e=>{if(audio.duration)audio.currentTime=e.target.value/100*audio.duration};
  $('#volume').oninput=e=>audio.volume=e.target.value;
  audio.volume=.75;
  audio.onplay=()=>$('#playerPlay').textContent='❚❚';
  audio.onpause=()=>$('#playerPlay').textContent='▶';
  audio.ontimeupdate=()=>{
    if(audio.duration){$('#seek').value=audio.currentTime/audio.duration*100;$('#currentTime').textContent=fmt(audio.currentTime);$('#duration').textContent=fmt(audio.duration)}
  };
  audio.onended=()=>nextTrack(1);
  document.addEventListener('click',e=>{
    const track=e.target.closest('[data-track]');if(track)loadTrack(+track.dataset.track,true);
    const video=e.target.closest('[data-video]');if(video)openVideo(projectById(video.dataset.video));
    const support=e.target.closest('[data-support]');if(support)openSupport(projectById(support.dataset.support));
    const exp=e.target.closest('[data-experience]');if(exp)openExperience(projectById(exp.dataset.experience).experience);
    const game=e.target.closest('[data-launch-game]');if(game){
      const map={fire:'games/thru-the-fire/index.html',streams:'games/streams/index.html',africa:'games/africa/index.html',guns:'games/guns-and-butter/index.html'};
      openExperience(map[game.dataset.launchGame]);
    }
  });
}
function loadTrack(index,autoplay=false){
  const playable=state.projects.filter(p=>p.audio);
  const current=state.projects[index];
  if(!current||!current.audio)return;
  state.trackIndex=index;applyTheme(current);stopAll();
  $('#audio').src=current.audio;$('#nowCover').src=current.cover;$('#nowTitle').textContent=current.title;
  if(autoplay)$('#audio').play().catch(()=>{});
}
function nextTrack(direction){
  let i=state.trackIndex;
  do{i=(i+direction+state.projects.length)%state.projects.length}while(!state.projects[i].audio);
  loadTrack(i,true);
}
function fmt(s){s=Math.floor(s||0);return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
function openVideo(p){
  stopAll();applyTheme(p);
  $('#cinemaTitle').textContent=p.title;$('#cinemaVideo').src=p.video;$('#cinemaVideo').poster=p.poster||'';
  openOverlay('#cinemaOverlay');$('#cinemaVideo').play().catch(()=>{});
}
function openExperience(url){
  stopAll();$('#experienceFrame').src=url;openOverlay('#experienceOverlay');
}
function openSupport(p=null){
  if(p){applyTheme(p);$('#supportProject').textContent=p.title;$('#supportProjectInput').value=p.title}
  else{$('#supportProject').textContent='the overall mission';$('#supportProjectInput').value='Overall Mission'}
  openOverlay('#supportOverlay');
}
function openOverlay(sel){$(sel).classList.add('open');document.body.classList.add('locked')}
function closeOverlay(overlay){
  overlay.classList.remove('open');document.body.classList.remove('locked');
  const video=overlay.querySelector('video');if(video)video.pause();
  const frame=overlay.querySelector('iframe');if(frame)frame.src='about:blank';
}
function bindOverlays(){
  window.addEventListener('message',event=>{
    if(event.data==='closeExperience'){
      const overlay=document.querySelector('#experienceOverlay');
      if(overlay?.classList.contains('open'))closeOverlay(overlay);
    }
  });
  $$('.overlay-close').forEach(b=>b.onclick=()=>closeOverlay(b.closest('.overlay')));
  $$('.overlay').forEach(o=>o.addEventListener('click',e=>{if(e.target===o)closeOverlay(o)}));
  window.addEventListener('keydown',e=>{if(e.key==='Escape'){const o=$('.overlay.open');if(o)closeOverlay(o)}});
  $('#fullscreenVideo').onclick=()=>$('#cinemaVideo').requestFullscreen?.();
  $('#openSupportGeneral').onclick=()=>openSupport();
  $$('.amount').forEach(b=>b.onclick=()=>showToast(`${b.textContent} selected — connect your Wix payment link here.`));
  $('#customAmount').onclick=()=>showToast('Connect this button to a custom Wix payment page.');
  $('#ventureForm').onsubmit=e=>{e.preventDefault();showToast('Proposal captured in Beta. Connect to your live form next.');e.target.reset()};
  $('#bookingForm').onsubmit=e=>{e.preventDefault();showToast('Booking request captured in Beta. Connect to your live form next.');e.target.reset()};
}
init().catch(err=>{console.error(err);showToast('Could not load project data.')});
