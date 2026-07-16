
const state={
  projects:[],featured:[],heroIndex:0,musicIndex:0,trackIndex:0,currentView:'home',autoTimer:null,soundscape:false,previewChannel:0,previewProject:null,fx:{hero:null,music:null}
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
  bindHeroParallax();
  bindSoundscape();
  initFx();
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
    b.innerHTML=`<img src="${p.cover}" alt="${p.title} cover"><span class="cover-select-label">SELECT ${p.title.toUpperCase()}</span>`;
    b.onclick=()=>{
      if(i===state.heroIndex){
        $('#heroStage').classList.toggle('engaged');
        clearInterval(state.autoTimer);
      }else{
        $('#heroStage').classList.remove('engaged');
        setHero(i);
      }
    };
    rail.appendChild(b);
  });
  const previous=()=>{ $('#heroStage').classList.remove('engaged');setHero(state.heroIndex-1) };
  const next=()=>{ $('#heroStage').classList.remove('engaged');setHero(state.heroIndex+1) };
  $('#heroPrev').onclick=previous;
  $('#heroNext').onclick=next;
  $('#heroTopPrev').onclick=previous;
  $('#heroTopNext').onclick=next;
  $('#heroPlay').onclick=()=>playProject(state.featured[state.heroIndex]);
  $('#heroExperience').onclick=()=>{
    const p=state.featured[state.heroIndex];
    if(p.experience)openExperience(p.experience);else showToast('This experience is coming soon.');
  };
  $('#heroSupport').onclick=()=>openSupport(state.featured[state.heroIndex]);
  $('#heroTotal').textContent=String(state.featured.length).padStart(2,'0');
  const stage=$('#heroStage');
  stage.addEventListener('mouseenter',()=>clearInterval(state.autoTimer));
  stage.addEventListener('mouseleave',()=>{if(!stage.classList.contains('engaged'))startHeroAuto()});
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
  const stage=$('#heroStage');
  stage.dataset.word=p.word;
  stage.dataset.universe=p.id;
  $('#heroUniverse').textContent=`THE ${p.word} UNIVERSE`;
  $('#heroTitle').textContent=p.title.toUpperCase();
  $('#heroSubtitle').textContent=p.subtitle;
  $('#heroPosition').textContent=String(state.heroIndex+1).padStart(2,'0');
  $('#heroExperience').classList.toggle('hidden-option',!p.experience);
  $('#heroStage').classList.remove('engaged');
  $$('.hero-cover').forEach((el,idx)=>{
    const raw=idx-state.heroIndex;
    const diff=(raw+count)%count;
    const pos=diff===0?2:diff===1?3:diff===count-1?1:0;
    el.dataset.pos=pos;el.classList.toggle('active',idx===state.heroIndex);
  });
  setFxUniverse('hero',p.id);
}
function cardTemplate(p,i,mode='music'){
  const experience=p.experience?`<button class="btn dark" data-experience="${p.id}">EXPERIENCE</button>`:'';
  const play=p.audio?`<button class="btn primary" data-track="${i}">PLAY</button>`:'<button class="btn" disabled>COMING SOON</button>';
  return `<article class="card"><img src="${p.cover}" alt="${p.title} cover"><h3>${p.title}</h3><p>${p.description}</p><div class="card-actions">${play}${experience}<button class="support-btn" data-support="${p.id}">PAY WHAT IT'S WORTH</button></div></article>`;
}
function buildMusic(){
  const grid=$('#musicGrid');
  grid.innerHTML=state.projects.map((p,i)=>`<article class="music-card" tabindex="0" data-music-index="${i}" data-project="${p.id}" aria-label="Select ${p.title}">
    <img src="${p.cover}" alt="${p.title} cover">
    <div class="music-card-info"><h3>${p.title}</h3><p>${p.subtitle}</p></div>
    <div class="card-progress"><span></span></div>
  </article>`).join('');

  grid.querySelectorAll('.music-card').forEach(card=>{
    const index=+card.dataset.musicIndex;
    card.addEventListener('mouseenter',()=>selectMusicCard(index,true,false));
    card.addEventListener('focusin',()=>selectMusicCard(index,true,false));
    card.addEventListener('click',()=>selectMusicCard(index,true,true));
  });

  $('#musicPrev').onclick=()=>stepMusic(-1);
  $('#musicNext').onclick=()=>stepMusic(1);
  $('#musicPanelPlay').onclick=()=>{
    const p=state.projects[state.musicIndex];
    if(p?.audio)loadTrack(state.musicIndex,true);else showToast('Audio is coming soon.');
  };
  $('#musicPanelExperience').onclick=()=>{
    const p=state.projects[state.musicIndex];
    if(p?.experience)openExperience(p.experience);else showToast('This experience is coming soon.');
  };
  $('#musicPanelCreate').onclick=()=>openSupport(state.projects[state.musicIndex]);

  $('#musicTotal').textContent=String(state.projects.length).padStart(2,'0');
  selectMusicCard(0,false,true);
}
function selectMusicCard(index,preview=false,lockAndCenter=false){
  const p=state.projects[index];if(!p)return;
  state.musicIndex=index;
  applyTheme(p);
  $$('.music-card').forEach((c,i)=>c.classList.toggle('selected',i===index));
  $('#musicFocusWord').textContent=p.word;
  $('#musicFocusTitle').textContent=p.title.toUpperCase();
  $('#musicFocusDescription').textContent=p.description;
  $('#selectedMusicCover').src=p.cover;
  $('#selectedMusicCover').alt=`${p.title} selected album cover`;
  $('#panelAlbumTitle').textContent=p.title.toUpperCase();

  const tracks=(p.tracks&&p.tracks.length?p.tracks:[{
    title:p.title,
    subtitle:p.subtitle,
    audio:p.audio
  }]);
  $('#trackCount').textContent=`${String(tracks.length).padStart(2,'0')} ${tracks.length===1?'TRACK':'TRACKS'}`;
  $('#musicTracklist').innerHTML=tracks.map((track,trackIndex)=>`
    <li class="${track.audio?'playable':'unavailable'}">
      <button type="button" data-panel-track="${trackIndex}" ${track.audio?'':'disabled'}>
        <span>${String(trackIndex+1).padStart(2,'0')}</span>
        <div><strong>${track.title}</strong><small>${track.subtitle||''}</small></div>
        <b>${track.audio?'PLAY':'SOON'}</b>
      </button>
    </li>`).join('');
  $('#musicTracklist').querySelectorAll('[data-panel-track]').forEach(button=>{
    button.onclick=()=>{
      const track=tracks[+button.dataset.panelTrack];
      if(!track?.audio)return;
      if(track.audio===p.audio){loadTrack(index,true)}
      else{
        const audio=$('#audio');
        stopAll(audio);
        audio.src=track.audio;
        $('#playerCover').src=p.cover;
        $('#playerTitle').textContent=track.title;
        $('#playerArtist').textContent='2Fly Keith Logan';
        $('#player').classList.add('show');
        audio.play().catch(()=>{});
      }
    };
  });
  $('#musicPanelPlay').disabled=!p.audio;
  $('#musicPanelPlay').textContent=p.audio?'▶ PLAY FULL':'COMING SOON';
  $('#musicPanelExperience').classList.toggle('hidden-action',!p.experience);
  $('#musicStageBackdrop').style.backgroundImage=`url("${p.cover}")`;
  const hero=$('#musicPageHero');hero.dataset.word=p.word;hero.style.background=`radial-gradient(circle at 72% 35%,${p.accent}55,transparent 34%),linear-gradient(135deg,${p.accent2},#090b0c)`;
  setFxUniverse('music',p.id);
  $('#musicPosition').textContent=String(index+1).padStart(2,'0');
  if(lockAndCenter){
    const selected=$(`.music-card[data-music-index="${index}"]`);
    selected?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
    $('#musicStage').classList.add('album-locked');
    clearTimeout(state.musicLockTimer);
    state.musicLockTimer=setTimeout(()=>$('#musicStage').classList.remove('album-locked'),700);
  }
  if(preview&&state.soundscape&&p.audio)crossfadePreview(p);
}
function stepMusic(direction){
  const count=state.projects.length;
  const next=(state.musicIndex+direction+count)%count;
  selectMusicCard(next,true,true);
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

function bindHeroParallax(){
  const stage=$('#heroStage');
  if(!stage)return;
  stage.addEventListener('pointermove',e=>{
    const r=stage.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    stage.style.setProperty('--mx',x.toFixed(3));stage.style.setProperty('--my',y.toFixed(3));
  });
  stage.addEventListener('pointerleave',()=>{stage.style.setProperty('--mx',0);stage.style.setProperty('--my',0)});
}
function bindSoundscape(){
  const btn=$('#soundscapeToggle');if(!btn)return;
  btn.onclick=()=>{
    state.soundscape=!state.soundscape;
    btn.classList.toggle('active',state.soundscape);btn.setAttribute('aria-pressed',String(state.soundscape));
    btn.lastChild.textContent=state.soundscape?' SOUNDSCAPE MODE ACTIVE':' ACTIVATE SOUNDSCAPE MODE';
    if(!state.soundscape){['#previewA','#previewB'].forEach(id=>{const a=$(id);a.pause();a.volume=0});state.previewProject=null}
    else{const selected=$('.music-card.selected');if(selected)selectMusicCard(+selected.dataset.musicIndex,true)}
  };
}
function crossfadePreview(p){
  if(state.previewProject===p.id)return;
  state.previewProject=p.id;
  const incoming=state.previewChannel===0?$('#previewB'):$('#previewA');
  const outgoing=state.previewChannel===0?$('#previewA'):$('#previewB');
  state.previewChannel=1-state.previewChannel;
  incoming.src=p.audio;incoming.currentTime=12;incoming.volume=0;incoming.play().catch(()=>{});
  const duration=650,steps=26;let n=0;
  clearInterval(state.previewFade);
  state.previewFade=setInterval(()=>{
    n++;const t=n/steps;
    incoming.volume=Math.min(.24,t*.24);outgoing.volume=Math.max(0,(1-t)*outgoing.volume);
    if(n>=steps){clearInterval(state.previewFade);outgoing.pause();outgoing.volume=0}
  },duration/steps);
}
function initFx(){
  state.fx.hero=createFx($('#heroFx'),'streams');
  state.fx.music=createFx($('#musicFx'),'streams');
}
function setFxUniverse(which,id){if(state.fx[which])state.fx[which].universe=id}
function createFx(canvas,universe){
  if(!canvas)return null;
  const c=canvas.getContext('2d'),fx={canvas,c,universe,particles:[],w:0,h:0,last:0};
  const resize=()=>{const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);fx.w=r.width;fx.h=r.height;canvas.width=r.width*d;canvas.height=r.height*d;c.setTransform(d,0,0,d,0,0)};
  resize();addEventListener('resize',resize);
  for(let i=0;i<70;i++)fx.particles.push({x:Math.random(),y:Math.random(),s:.5+Math.random()*2,v:.15+Math.random()*.7,a:.08+Math.random()*.28,phase:Math.random()*6.28});
  const loop=t=>{drawFx(fx,t);requestAnimationFrame(loop)};requestAnimationFrame(loop);return fx;
}
function drawFx(fx,t){
  const {c,w,h}=fx;c.clearRect(0,0,w,h);const id=fx.universe;
  fx.particles.forEach((p,i)=>{
    if(id==='fire'){
      p.y-=p.v*.00032;if(p.y<-.05)p.y=1.05;
      c.fillStyle=`rgba(255,${90+i%90},35,${p.a})`;c.fillRect(p.x*w+Math.sin(t*.001+p.phase)*16,p.y*h,p.s,p.s*2.4);
    }else if(id==='streams'){
      p.y+=p.v*.00015;if(p.y>1.05)p.y=-.05;
      c.strokeStyle=`rgba(190,240,255,${p.a*.62})`;c.lineWidth=p.s;c.beginPath();c.moveTo(p.x*w,p.y*h);c.quadraticCurveTo(p.x*w+24,p.y*h+20,p.x*w-4,p.y*h+54);c.stroke();
      if(i%13===0){c.fillStyle=`rgba(205,126,48,${p.a})`;c.beginPath();c.arc(p.x*w,p.y*h,2.5+p.s,0,7);c.fill()}
    }else if(id==='africa'){
      p.x+=p.v*.00012;if(p.x>1.05)p.x=-.05;
      c.fillStyle=`rgba(240,195,116,${p.a*.72})`;c.beginPath();c.arc(p.x*w,p.y*h+Math.sin(t*.001+p.phase)*12,p.s,0,7);c.fill();
      if(i<7){c.strokeStyle='rgba(35,20,8,.34)';c.beginPath();const x=(p.x*w+t*.025*(i+1))%(w+80)-40,y=h*(.18+.07*i);c.moveTo(x,y);c.quadraticCurveTo(x+8,y-7,x+16,y);c.quadraticCurveTo(x+24,y-7,x+32,y);c.stroke()}
    }else{
      p.x+=Math.sin(t*.0004+p.phase)*.00008;p.y+=p.v*.00005;if(p.y>1.05)p.y=-.05;
      c.fillStyle=`rgba(190,220,235,${p.a*.45})`;c.beginPath();c.arc(p.x*w,p.y*h,p.s*1.5,0,7);c.fill();
    }
  });
}
init().catch(err=>{console.error(err);showToast('Could not load project data.')});
