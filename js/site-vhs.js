// 2FLY VHS VIDEO ROOM — overrides the earlier remote-control prototype.
// Uses the existing project catalog for real video/chapter content and keeps future tapes data-driven.
(function(){
  const FUTURE_TAPES=[
    ['2FLY Forever','2026-10-16'],['Notes to Self','2026-11-06'],['A Bigger Tomorrow','2026-11-27'],
    ['Same Higher Purpose','2026-12-18'],['The Journey','2027-01-15'],['Built Different','2027-02-05'],
    ['More to Life','2027-02-26'],['Still Here','2027-03-19'],['The Vision','2027-04-09'],
    ['Unreleased','2027-04-30'],['Behind the Scenes','2027-05-21'],['Interviews','2027-06-11'],
    ['Sessions','2027-07-02'],['Family','2027-07-23'],['2FLY Universe','2027-08-13']
  ];
  const FEATURED_IDS=['streams','away','fire','africa'];
  const room={selected:null,chapter:0,hovered:null,tvOn:true,state:'idle'};
  const safe=s=>typeof esc==='function'?esc(s):String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const mediaAsset=p=>typeof asset==='function'?asset(p):p;
  const fmtDate=iso=>{try{return new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric'}).format(new Date(iso+'T12:00:00'))}catch{return iso}};
  function projectById(id){return app.projects.find(p=>p.id===id)}
  function clipsFor(p){if(!p)return[];const clips=(p.clips&&p.clips.length?p.clips:(p.video?[{title:p.title,src:p.video,poster:p.poster,type:'VISUAL STORY'}]:[]));return clips.filter(c=>c&&c.src)}
  function realTape(p){return {kind:'real',id:p.id,title:p.title,project:p,release:null,clips:clipsFor(p)}}
  function futureTape(name,date,i){return {kind:'future',id:`future-${i}`,title:name,release:date,clips:[]}}
  function allArchiveTapes(){
    const real=FEATURED_IDS.map(projectById).filter(Boolean).map(realTape);
    return [...real,...FUTURE_TAPES.map((x,i)=>futureTape(x[0],x[1],i))];
  }
  function featuredTapes(){return FEATURED_IDS.map(projectById).filter(Boolean).map(realTape)}
  function tapeTab(i){return ['#cf5038','#d9a328','#1c8e93','#c54e62','#4f8fba'][i%5]}
  function spineHTML(t,i){return `<button class="vhs-spine" type="button" data-tape-id="${safe(t.id)}" style="--tab:${tapeTab(i)}" aria-label="Select ${safe(t.title)}"><span class="spine-edge"></span><span class="spine-label">${safe(t.title)}</span><span class="spine-tab"></span></button>`}
  function featuredHTML(t,i){return `<button class="featured-tape" type="button" data-tape-id="${safe(t.id)}" style="--tab:${tapeTab(i+1)}" aria-label="Load ${safe(t.title)}"><span class="tape-window"><i class="tape-reel"></i><i class="tape-reel"></i></span><span class="tape-label">${safe(t.title)}</span><i class="tape-badge"></i></button>`}

  renderVideos=function(){
    const archive=allArchiveTapes(),featured=featuredTapes();
    $('#appView').innerHTML=`<section class="video-vhs-page">
      <div class="video-vhs-stage" id="videoVhsStage">
        <div class="vhs-workspace">
          <aside class="vhs-archive" aria-label="Video archive"><div class="vhs-archive-title">VIDEO ARCHIVE · SELECT A TAPE</div><div class="vhs-stack" id="vhsStack">${archive.map(spineHTML).join('')}</div></aside>
          <section class="vhs-center" aria-label="2Fly television and VCR">
            <div class="tv-cabinet">
              <div class="tv-upper">
                <div class="crt-shell"><div class="crt-screen" id="crtScreen">
                  <img class="crt-poster" id="crtPoster" alt="">
                  <video class="crt-video" id="vhsVideo" playsinline preload="metadata"></video>
                  <div class="crt-noise" aria-hidden="true"></div>
                  <div class="crt-osd" aria-live="polite"><div class="crt-osd-top"><span>2FLY VIDEO</span><span id="crtChannel">CH 03</span></div><div class="crt-message" id="crtMessage">INSERT TAPE</div><div class="crt-preview-label" id="crtPreviewLabel">PREVIEW</div><div class="crt-bottom"><span id="crtMode">SP</span><span id="crtCounter">--:--</span></div></div>
                </div></div>
                <div class="tv-control-panel"><div class="tv-brand">2FLY</div><span>CHANNEL</span><button class="dial" id="channelDial" type="button" aria-label="Cycle video"></button><span>VOLUME</span><button class="dial" id="volumeDial" type="button" aria-label="Cycle volume" style="--dial-rotation:-32deg"></button><div class="tv-knob-row"><span class="mini-knob">BRIGHT<button type="button" disabled aria-label="Brightness decorative control"></button></span><span class="mini-knob">CONTRAST<button type="button" disabled aria-label="Contrast decorative control"></button></span><span class="mini-knob">POWER<button id="tvPower" type="button" aria-label="Power television"></button><i class="power-light" id="powerLight"></i></span></div></div>
              </div>
              <div class="vcr" aria-label="VCR controls"><div class="vcr-brand">2FLY</div><div class="vcr-center"><div class="vcr-slot" aria-hidden="true"></div><div class="vcr-display idle" id="vcrDisplay">12:00</div></div><div class="vcr-controls"><button id="vcrEject" type="button" title="Eject">▲</button><button id="vcrRew" type="button" title="Rewind">◀◀</button><button id="vcrPlay" type="button" title="Play">▶</button><button id="vcrStop" type="button" title="Stop">■</button><button id="vcrPause" type="button" title="Pause">Ⅱ</button><button id="vcrFf" type="button" title="Fast forward">▶▶</button></div></div>
            </div>
          </section>
          <aside class="vhs-hud" aria-label="Selected video details"><div class="hud-panel" id="vhsHud"></div></aside>
        </div>
        <section class="featured-table" aria-label="Featured tapes"><div class="featured-label">FEATURED TABLE · REAL CONTENT</div><div class="featured-tapes" id="featuredTapes">${featured.map(featuredHTML).join('')}</div></section>
      </div>
    </section>`;
    bindRoom(); setIdle();
  };

  function bindRoom(){
    document.querySelectorAll('[data-tape-id]').forEach(btn=>{
      btn.addEventListener('mouseenter',()=>previewTape(btn.dataset.tapeId));
      btn.addEventListener('focus',()=>previewTape(btn.dataset.tapeId));
      btn.addEventListener('mouseleave',clearPreview);
      btn.addEventListener('blur',clearPreview);
      btn.addEventListener('click',()=>selectTape(btn.dataset.tapeId,true));
    });
    $('#vcrPlay').onclick=playSelected; $('#vcrPause').onclick=pauseSelected; $('#vcrStop').onclick=stopSelected;
    $('#vcrRew').onclick=()=>seekBy(-10); $('#vcrFf').onclick=()=>seekBy(10); $('#vcrEject').onclick=ejectSelected;
    $('#tvPower').onclick=togglePower; $('#channelDial').onclick=cycleTape; $('#volumeDial').onclick=cycleVolume;
    const v=$('#vhsVideo');
    v.addEventListener('play',()=>{room.state='playing';syncTvState();displayState('PLAY')});
    v.addEventListener('pause',()=>{if(room.selected&&room.state!=='stopped'&&room.state!=='loading'){room.state='paused';syncTvState();displayState('PAUSE')}});
    v.addEventListener('timeupdate',()=>{$('#crtCounter').textContent=time(v.currentTime);if(room.state==='playing')$('#vcrDisplay').textContent=time(v.currentTime)});
    v.addEventListener('ended',()=>{room.state='stopped';v.currentTime=0;syncTvState();displayState('STOP')});
  }
  function tapeById(id){return allArchiveTapes().find(t=>t.id===id)}
  function previewTape(id){
    if(!room.tvOn||room.selected)return;const t=tapeById(id);if(!t)return;room.hovered=t;
    if(t.kind==='real'){
      const c=t.clips[0],poster=c?.poster||t.project.poster||t.project.cover;
      $('#crtPoster').src=mediaAsset(poster||''); $('#crtPoster').alt=`${t.title} preview`; $('#crtPreviewLabel').textContent=`PREVIEW · ${t.title.toUpperCase()}`;
      $('#crtScreen').className='crt-screen previewing';
    }else{$('#crtMessage').textContent='COMING SOON';$('#crtScreen').className='crt-screen'}
    renderHud(t,true);
  }
  function clearPreview(){if(room.selected)return;room.hovered=null;setIdle()}
  function selectTape(id,autoplay=false){
    const t=tapeById(id);if(!t)return;room.selected=t;room.chapter=0;
    document.querySelectorAll('[data-tape-id]').forEach(b=>b.classList.toggle('selected',b.dataset.tapeId===id));
    if(t.kind==='future'){
      room.state='future'; const v=$('#vhsVideo');v.pause();v.removeAttribute('src');v.load();renderHud(t,false);$('#crtMessage').textContent='NOT YET RELEASED';$('#crtScreen').className='crt-screen';$('#crtCounter').textContent='--:--';displayState('HOLD');return;
    }
    loadChapter(0,autoplay);
  }
  function loadChapter(index,autoplay=false){
    const t=room.selected;if(!t||t.kind!=='real'||!t.clips.length)return;room.chapter=Math.max(0,Math.min(index,t.clips.length-1));const c=t.clips[room.chapter],v=$('#vhsVideo');
    room.state='loading';syncTvState();displayState('LOAD');renderHud(t,false);
    const poster=c.poster||t.project.poster||t.project.cover;$('#crtPoster').src=mediaAsset(poster||'');$('#crtPoster').alt=`${t.title} — ${c.title||'video'}`;
    v.pause();v.src=c.src;v.poster=mediaAsset(poster||'');v.load();
    setTimeout(()=>{if(room.selected!==t)return;room.state='loaded';syncTvState();displayState('STOP');if(autoplay)playSelected()},430);
  }
  function renderHud(t,preview=false){
    const hud=$('#vhsHud');if(!hud)return;
    if(!t){hud.innerHTML=`<div class="hud-kicker">VIDEO ARCHIVE</div><h1>SELECT A TAPE</h1><p class="hud-description">Choose a VHS from the archive or one of the featured tapes on the table.</p><div class="hud-status"><strong>VCR READY</strong>The television is waiting for a tape.</div>`;return}
    if(t.kind==='future'){
      hud.innerHTML=`<div class="hud-kicker">${preview?'PREVIEW':'SELECTED TAPE'}</div><h1>${safe(t.title)}</h1><div class="hud-meta">FUTURE RELEASE · 2FLY VIDEO</div><p class="hud-description">This tape is reserved in the archive for a future visual release.</p><div class="hud-status"><strong>EXPECTED UPLOAD</strong>${safe(fmtDate(t.release))}<br>Placeholder content will be replaced when the release is ready.</div><div class="hud-actions"><button type="button" disabled>NOT YET AVAILABLE</button></div>`;return
    }
    const p=t.project,clips=t.clips;hud.innerHTML=`<div class="hud-kicker">${preview?'PREVIEW':'NOW PLAYING'}</div><h1>${safe(t.title)}</h1><div class="hud-meta">${safe((p.word||'2FLY VIDEO').toUpperCase())} · ${clips.length} ${clips.length===1?'CHAPTER':'CHAPTERS'}</div><p class="hud-description">${safe(p.description||p.subtitle||'')}</p><div class="hud-status"><strong>${preview?'HIGHLIGHTED':'TAPE LOADED'}</strong>${preview?'Click the tape to load it into the VCR.':'Choose a chapter below or use the physical VCR controls.'}</div><div class="chapter-list">${clips.map((c,i)=>`<button class="chapter-btn ${i===room.chapter&&!preview?'active':''}" type="button" data-chapter="${i}"><b>${String(i+1).padStart(2,'0')}</b><span>${safe(c.title||`Chapter ${i+1}`)}</span><em>▶</em></button>`).join('')}</div><div class="hud-actions"><button id="hudPlay" type="button">${preview?'LOAD + PLAY':'PLAY VIDEO'}</button><button class="secondary" id="hudEject" type="button">EJECT</button></div>`;
    hud.querySelectorAll('[data-chapter]').forEach(b=>b.onclick=()=>{if(preview)selectTape(t.id,false);room.chapter=+b.dataset.chapter;loadChapter(room.chapter,true)});
    $('#hudPlay').onclick=()=>{if(preview)selectTape(t.id,true);else playSelected()}; $('#hudEject').onclick=ejectSelected;
  }
  function setIdle(){
    if(!room.tvOn){syncTvState();return}room.state='idle';room.selected=null;room.chapter=0;document.querySelectorAll('[data-tape-id]').forEach(b=>b.classList.remove('selected'));const v=$('#vhsVideo');v?.pause();if(v){v.removeAttribute('src');v.load()}
    $('#crtScreen').className='crt-screen';$('#crtMessage').textContent='INSERT TAPE';$('#crtMode').textContent='SP';$('#crtCounter').textContent='--:--';$('#crtPoster').removeAttribute('src');$('#vcrDisplay').textContent='12:00';$('#vcrDisplay').classList.add('idle');renderHud(null,false);
  }
  function syncTvState(){const s=$('#crtScreen');if(!s)return;if(!room.tvOn){s.className='crt-screen';s.style.filter='brightness(.08)';$('#crtMessage').textContent='';return}s.style.filter='';s.className='crt-screen'+(room.state==='playing'?' playing':room.state==='loaded'||room.state==='paused'||room.state==='stopped'?' loaded':'')}
  function displayState(label){const d=$('#vcrDisplay');d.classList.remove('idle');d.textContent=label}
  function playSelected(){if(!room.tvOn)togglePower();if(!room.selected)return; if(room.selected.kind==='future'){displayState('HOLD');return}const v=$('#vhsVideo');if(!v.src){loadChapter(room.chapter,false);setTimeout(playSelected,480);return}v.play().catch(()=>{})}
  function pauseSelected(){const v=$('#vhsVideo');if(!room.selected||v.paused)return;v.pause()}
  function stopSelected(){const v=$('#vhsVideo');if(!room.selected||room.selected.kind!=='real')return;v.pause();try{v.currentTime=0}catch{}room.state='stopped';syncTvState();displayState('STOP');$('#crtCounter').textContent='0:00'}
  function seekBy(n){const v=$('#vhsVideo');if(!room.selected||room.selected.kind!=='real'||!Number.isFinite(v.duration))return;v.currentTime=Math.max(0,Math.min(v.duration,v.currentTime+n));displayState(n<0?'REW':'FF')}
  function ejectSelected(){const had=!!room.selected;if(!had)return;displayState('EJECT');const v=$('#vhsVideo');v.pause();setTimeout(setIdle,360)}
  function togglePower(){room.tvOn=!room.tvOn;$('#powerLight').style.opacity=room.tvOn?'1':'.18';if(room.tvOn){if(room.selected&&room.selected.kind==='real'){room.state='loaded';syncTvState();renderHud(room.selected,false);displayState('STOP')}else setIdle()}else{const v=$('#vhsVideo');v.pause();syncTvState();displayState('OFF')}}
  function cycleTape(){const list=allArchiveTapes();const current=room.selected?list.findIndex(t=>t.id===room.selected.id):-1;const next=list[(current+1+list.length)%list.length];selectTape(next.id,false);const d=$('#channelDial');d.style.setProperty('--dial-rotation',`${((current+2)%12)*24-120}deg`)}
  function cycleVolume(){const v=$('#vhsVideo');v.volume=v.volume>.8?.25:v.volume+.25;$('#volumeDial').style.setProperty('--dial-rotation',`${Math.round(-110+v.volume*220)}deg`)}
})();
