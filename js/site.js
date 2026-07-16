
let PROJECTS=[], active=0, track=0;
async function loadProjects(prefix=''){
  const response=await fetch(prefix+'data/projects.json');
  if(!response.ok) throw new Error('Could not load project data');
  PROJECTS=await response.json();
  return PROJECTS;
}
function stopAll(except=null){
  document.querySelectorAll('audio,video').forEach(media=>{
    if(media!==except && !media.paused) media.pause();
  });
}
document.addEventListener('play',e=>{
  if(e.target.matches('audio,video')) stopAll(e.target);
},true);
function applyTheme(project){
  const root=document.documentElement;
  root.style.setProperty('--accent',project.accent||'#0A8F92');
  root.style.setProperty('--accent2',project.accent2||'#17353B');
  root.style.setProperty('--soft',project.soft||'#D9EFF0');
}
function bindMedia(prefix=''){
  const audio=document.getElementById('audio');
  const cinemaVideo=document.getElementById('cinemaVideo');
  if(!audio) return;
  window.loadTrack=(index,autoplay=false)=>{
    track=(index+PROJECTS.length)%PROJECTS.length;
    const project=PROJECTS[track];
    if(!project.audio) return alert('Audio has not been assigned yet.');
    stopAll();
    audio.src=project.audio;
    document.getElementById('nowTitle').textContent=project.title;
    document.getElementById('nowCover').src=project.cover;
    if(autoplay) audio.play().catch(()=>{});
  };
  window.openVideo=(project)=>{
    if(!project.video) return alert('Video has not been assigned yet.');
    stopAll();
    document.getElementById('cinemaTitle').textContent=project.title;
    cinemaVideo.src=project.video;
    cinemaVideo.poster=project.poster||'';
    document.getElementById('videoModal').classList.add('open');
    cinemaVideo.play().catch(()=>{});
  };
  document.getElementById('play').onclick=()=>audio.paused?(stopAll(audio),audio.play()):audio.pause();
  audio.onplay=()=>document.getElementById('play').textContent='❚❚';
  audio.onpause=()=>document.getElementById('play').textContent='▶';
  document.getElementById('prev').onclick=()=>loadTrack(track-1,true);
  document.getElementById('next').onclick=()=>loadTrack(track+1,true);
  audio.ontimeupdate=()=>{
    if(audio.duration){
      document.getElementById('seek').value=audio.currentTime/audio.duration*100;
      document.getElementById('current').textContent=formatTime(audio.currentTime);
      document.getElementById('duration').textContent=formatTime(audio.duration);
    }
  };
  document.getElementById('seek').oninput=e=>{
    if(audio.duration) audio.currentTime=e.target.value/100*audio.duration;
  };
  document.getElementById('closeVideo').onclick=()=>{
    cinemaVideo.pause();
    document.getElementById('videoModal').classList.remove('open');
  };
  document.getElementById('videoModal').onclick=e=>{
    if(e.target.id==='videoModal'){
      cinemaVideo.pause();
      e.currentTarget.classList.remove('open');
    }
  };
}
function formatTime(seconds){
  seconds=Math.floor(seconds||0);
  return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');
}
