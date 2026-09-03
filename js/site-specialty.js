// Specialty experiences layered onto the shared shell without duplicating the player/header.
const baseShellRoute=route;
const baseShellHome=renderHome;

renderHome=function(){
  baseShellHome();
  const musicPortal=[...document.querySelectorAll('.home-portals a')].find(a=>a.querySelector('strong')?.textContent==='MUSIC');
  const videoPortal=[...document.querySelectorAll('.home-portals a')].find(a=>a.querySelector('strong')?.textContent==='VIDEOS');
  if(musicPortal){musicPortal.href='#music';musicPortal.dataset.route='music'}
  if(videoPortal){videoPortal.href='#videos';videoPortal.dataset.route='videos'}
};

route=function(){
  const raw=(location.hash||'#home').slice(1).split('?')[0];
  if(raw!=='music'&&raw!=='videos'){baseShellRoute();return}
  app.route=raw;
  $$('#primaryNav [data-route]').forEach(a=>a.classList.toggle('active',a.dataset.route===app.route));
  document.body.dataset.route=app.route;
  if(raw==='music')renderMusic();
  if(raw==='videos')renderVideos();
  window.scrollTo({top:0,left:0,behavior:'auto'});
  $('#appView').focus({preventScroll:true});
};

function musicProjects(){return app.projects.filter(p=>p.audio||p.tracks?.some(t=>t.src||t.audio))}
function renderMusic(){
  const projects=musicProjects();
  if(!projects.length){$('#appView').innerHTML='<section class="music-binder-page"><p class="empty">Music catalog data is unavailable.</p></section>';return}
  app.musicIndex=Math.min(app.musicIndex||0,projects.length-1);
  app.binderPage=app.binderPage||0;
  const perPage=6,pages=Math.max(1,Math.ceil(projects.length/perPage));
  app.binderPage=Math.min(app.binderPage,pages-1);
  $('#appView').innerHTML=`<section class="music-binder-page">
    <div class="specialty-hero"><div class="kicker">THE MUSIC ARCHIVE · 1990s CD BINDER</div><h1>MUSIC.</h1><p>Open the binder, pull a disc from its sleeve, and let the selected release take over the player without leaving the creative world.</p></div>
    <div class="binder-shell">
      <div class="binder-spine"><span>2FLY</span><i></i><b>DISC ARCHIVE</b></div>
      <div class="binder-book"><div class="binder-page-label"><button id="binderPrev" type="button">← PREV PAGE</button><span id="binderPageLabel"></span><button id="binderNext" type="button">NEXT PAGE →</button></div><div class="sleeve-grid" id="sleeveGrid"></div></div>
      <aside class="disc-detail" id="discDetail"></aside>
    </div>${helpModule()}
  </section>`;
  const drawPage=()=>{
    const start=app.binderPage*perPage,slice=projects.slice(start,start+perPage);
    $('#binderPageLabel').textContent=`BINDER PAGE ${String(app.binderPage+1).padStart(2,'0')} / ${String(pages).padStart(2,'0')}`;
    $('#sleeveGrid').innerHTML=slice.map(p=>{const idx=projects.indexOf(p);return `<button class="cd-sleeve ${idx===app.musicIndex?'selected':''}" data-music-index="${idx}" type="button"><span class="sleeve-plastic"></span><span class="compact-disc"><img src="${asset(p.cover)}" alt=""><i></i></span><strong>${esc(p.title)}</strong><small>${esc(p.subtitle||'2Fly Keith Logan')}</small></button>`}).join('');
    $('#sleeveGrid').querySelectorAll('[data-music-index]').forEach(b=>b.onclick=()=>selectMusic(+b.dataset.musicIndex));
  };
  $('#binderPrev').onclick=()=>{app.binderPage=(app.binderPage-1+pages)%pages;drawPage()};
  $('#binderNext').onclick=()=>{app.binderPage=(app.binderPage+1)%pages;drawPage()};
  drawPage();selectMusic(app.musicIndex,false);
}
function selectMusic(index,redraw=true){
  const projects=musicProjects(),p=projects[index];if(!p)return;app.musicIndex=index;
  if(redraw)$$('.cd-sleeve').forEach(b=>b.classList.toggle('selected',+b.dataset.musicIndex===index));
  const tracks=p.tracks?.length?p.tracks:[{title:p.title,src:p.audio}];
  $('#discDetail').innerHTML=`<div class="disc-out"><div class="disc-shine"></div><img src="${asset(p.cover)}" alt="${esc(p.title)} disc artwork"><span></span></div><div class="disc-copy"><div class="kicker">SELECTED DISC</div><h2>${esc(p.title)}</h2><p>${esc(p.description||p.subtitle||'')}</p><div class="disc-tracklist">${tracks.map((t,i)=>`<button type="button" data-track="${i}"><b>${String(i+1).padStart(2,'0')}</b><span>${esc(t.title||`Track ${i+1}`)}</span><em>▶</em></button>`).join('')}</div><div class="disc-actions"><button id="playSelectedDisc" type="button">PLAY IN GLOBAL PLAYER</button>${p.experience?'<button id="enterSelectedPlayable" type="button">ENTER PLAYABLE</button>':''}</div></div>`;
  $('#playSelectedDisc').onclick=()=>loadProjectAudio(p,true);
  $('#enterSelectedPlayable')?.addEventListener('click',()=>location.href=asset(p.experience));
  $$('#discDetail [data-track]').forEach(b=>b.onclick=()=>playProjectTrack(p,tracks,+b.dataset.track));
}
function playProjectTrack(project,tracks,index){
  const t=tracks[index];if(!t)return;const src=t.src||t.audio||project.audio;if(!src)return;
  const a=$('#globalAudio');a.src=src;a.load();$('#playerCover').src=asset(project.cover);$('#playerCover').alt=`${project.title} cover`;$('#playerTitle').textContent=t.title||project.title;savePlayer();a.play().catch(()=>{});
}

function buildVideoPlaylist(){
  const list=[];
  app.projects.forEach(p=>{
    const clips=(p.clips&&p.clips.length?p.clips:[p.video?{title:p.title,src:p.video,poster:p.poster,type:'VISUAL STORY'}:null]).filter(Boolean);
    clips.filter(c=>c.src).forEach((c,i)=>list.push({...c,projectId:p.id,projectTitle:p.title,cover:p.cover,accent:p.accent,index:i}));
  });
  return list;
}
function renderVideos(){
  app.videoPlaylist=buildVideoPlaylist();
  if(!app.videoPlaylist.length){$('#appView').innerHTML='<section class="video-vhs-page"><p class="empty">Video catalog data is unavailable.</p></section>';return}
  app.videoIndex=Math.min(app.videoIndex||0,app.videoPlaylist.length-1);
  $('#appView').innerHTML=`<section class="video-vhs-page">
    <div class="specialty-hero video-specialty"><div class="kicker">THE VISUAL ARCHIVE · VHS / TELEVISION ROOM</div><h1>VIDEOS.</h1><p>Choose a tape, load it into the television, and use the remote to move through the visual archive.</p></div>
    <div class="video-room">
      <div class="tv-stack"><div class="television"><div class="tv-bezel"><video id="vhsVideo" controls playsinline preload="metadata"></video><div class="tv-scanlines"></div><div class="tv-osd" id="tvOsd">CH 02FLY · STOP</div></div><div class="tv-controls"><i></i><i></i><i></i></div></div><div class="vcr-deck"><span>2FLY VHS DECK</span><div class="vcr-slot" id="vcrSlot">INSERT TAPE</div><b id="vcrCounter">0:00</b></div></div>
      <aside class="remote-control"><div class="remote-brand">2FLY<br><small>REMOTE</small></div><button id="remotePower" type="button">POWER</button><div class="remote-pad"><button id="videoPrev" type="button">⏮</button><button id="videoPlay" type="button">▶</button><button id="videoNext" type="button">⏭</button></div><button id="videoFullscreen" type="button">FULL SCREEN</button><button id="videoMute" type="button">MUTE</button><div class="remote-channel">CH<br><strong id="remoteChannel">01</strong></div></aside>
      <div class="vhs-library" id="vhsLibrary"></div>
    </div>${helpModule()}
  </section>`;
  $('#vhsLibrary').innerHTML=app.videoPlaylist.map((v,i)=>`<button class="vhs-tape" data-video="${i}" type="button" style="--tape-accent:${esc(v.accent||'#d25f32')}"><span class="vhs-window"><i></i><i></i></span><div><small>${esc(v.type||'VISUAL STORY')}</small><strong>${esc(v.title||v.projectTitle)}</strong><em>${esc(v.projectTitle)}</em></div></button>`).join('');
  $('#vhsLibrary').onclick=e=>{const b=e.target.closest('[data-video]');if(b)loadVideo(+b.dataset.video,true)};
  $('#videoPrev').onclick=()=>loadVideo(app.videoIndex-1,true);$('#videoNext').onclick=()=>loadVideo(app.videoIndex+1,true);
  $('#videoPlay').onclick=()=>{const v=$('#vhsVideo');v.paused?v.play().catch(()=>{}):v.pause()};
  $('#videoFullscreen').onclick=()=>$('#vhsVideo').requestFullscreen?.();
  $('#videoMute').onclick=()=>{const v=$('#vhsVideo');v.muted=!v.muted;$('#videoMute').textContent=v.muted?'UNMUTE':'MUTE'};
  $('#remotePower').onclick=()=>{$('#vhsVideo').classList.toggle('tv-off');$('#tvOsd').classList.toggle('tv-off')};
  loadVideo(app.videoIndex,false);
}
function loadVideo(index,autoplay=false){
  const list=app.videoPlaylist;if(!list.length)return;app.videoIndex=(index+list.length)%list.length;
  const item=list[app.videoIndex],v=$('#vhsVideo');v.pause();v.src=item.src;v.poster=asset(item.poster||item.cover);v.load();
  $('#vcrSlot').textContent=(item.title||item.projectTitle).toUpperCase();$('#remoteChannel').textContent=String(app.videoIndex+1).padStart(2,'0');$('#tvOsd').textContent=`CH ${String(app.videoIndex+1).padStart(2,'0')} · ${String(item.type||'VIDEO').toUpperCase()}`;
  $$('.vhs-tape').forEach((b,i)=>b.classList.toggle('selected',i===app.videoIndex));
  v.ontimeupdate=()=>{$('#vcrCounter').textContent=time(v.currentTime)};
  if(autoplay)v.play().catch(()=>{});
}

document.addEventListener('DOMContentLoaded',()=>{
  const detach=$('#detachPlayer');
  if(detach)detach.onclick=()=>alert('Playback stays active while you move through Home, Featured, Playables, Music, and Videos. The separate pop-out player is reserved for the later detachable-player phase.');
});
