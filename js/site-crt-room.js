/* One video element and one controller own every CRT, VCR and archive interaction. */
window.CRTVideoRoom = (() => {
  'use strict';
  const escape = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const channel = i => `CH ${String(i+1).padStart(2,'0')}`;
  const clock = n => { n=Number.isFinite(n)?Math.max(0,Math.floor(n)):0; return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`; };
  const clipsFor = p => (p.clips?.length?p.clips:p.video?[{title:p.title,src:p.video,poster:p.poster}]:[]).filter(c=>c.src);
  const effects=[['No Effect','none'],['B&W','grayscale(1)'],['Sepia','sepia(.85)'],["1990’s",'saturate(1.45) contrast(1.13) sepia(.18)']];
  function mount({projects,initialId,onSelect,onMusic}) {
    const order=['streams','away','fire','africa'];
    const list=order.map(id=>projects.find(p=>p.id===id)).filter(Boolean);
    const future=[...projects.filter(p=>!order.includes(p.id)&&!clipsFor(p).length).map(p=>({title:p.title})),...Array.from({length:5},(_,i)=>({title:'Archive Volume '+String(i+5).padStart(2,'0')}))];
    const artBase='../assets/media-rooms/vhs-art/';
    const featureArt={streams:artBase+'streams.webp',away:artBase+'away.webp',fire:artBase+'fire.webp',africa:artBase+'africa.webp'};
    const tapeArt=[artBase+'tape-horizontal.webp',artBase+'tape-horizontal.webp',artBase+'tape-horizontal.webp',artBase+'tape-angled.webp',artBase+'tape-angled.webp',artBase+'tape-angled.webp',artBase+'tape-front.webp',artBase+'tape-front.webp',artBase+'tape-front.webp'];
    const archiveSlots=Array.from({length:9},(_,i)=>i<list.length?{kind:'real',projectIndex:i,title:list[i].title,art:tapeArt[i]}:{kind:'future',title:'Archive Volume '+String(i+1).padStart(2,'0'),art:tapeArt[i]});
    const abort=new AbortController(), {signal}=abort;
    const on=(el,event,fn)=>el.addEventListener(event,fn,{signal});
    const initialIndex=Math.max(0,list.findIndex(p=>p.id===initialId));
    const state={index:initialIndex,channelIndex:initialIndex,chapter:0,loaded:false,power:true,buffering:false,stopped:true,overlay:false,effect:0,transient:'',rewinding:false,error:'',upcoming:''};
    let frame=0,scanTimer=0,operation=0,disposed=false;
    const root=document.createElement('section'); root.className='vc-room vc-collection-room';
    const button=(action,label,extra='')=>`<button type="button" data-vc-action="${action}" ${extra}>${label}</button>`;
    const spine=(p,i)=>`<button type="button" class="vc-spine" data-vc-tape="${i}" aria-label="Play ${escape(p.title)} VHS" aria-pressed="false"><span>${channel(i)}</span><strong>${escape(p.title)}</strong><small>VHS · HI-FI</small></button>`;
    const cover=(p,i,box=false)=>`<button type="button" class="vc-cover ${box?'vc-box-set':''}" data-vc-tape="${i}" aria-label="Play ${escape(p.title)} ${box?'box set':'VHS cover'}" aria-pressed="false"><span class="vc-cover-top">${box?'THE COMPLETE VISUAL JOURNEY':'2FLY HOME VIDEO'}</span><img src="${escape(asset(p.cover||p.poster))}" alt="" loading="eager"><strong>${escape(p.title)}</strong><small>${box?'10 CHAPTERS · BOX SET':channel(i)+' · VHS EDITION'}</small>${box?'<span class="vc-box-spines" aria-hidden="true"><i>I</i><i>II</i><i>III</i><i>IV</i><i>V</i></span>':''}</button>`;
    const upcoming=(p,i)=>`<button type="button" class="vc-spine vc-coming-tape" data-vc-upcoming="${i}" aria-label="${escape(p.title)} — Release Date Goes Here" aria-pressed="false"><span>SOON</span><strong>${escape(p.title)}</strong><small>Release Date Goes Here</small></button>`;
    const featureAsset=(p,i,extra='')=>`<button type="button" class="vc-art-card ${extra}" data-vc-tape="${i}" aria-label="Load ${escape(p.title)} VHS" aria-pressed="false"><img src="${featureArt[p.id]||escape(asset(p.cover||p.poster))}" alt="${escape(p.title)} VHS collector artwork" loading="eager" decoding="async"></button>`;
    const stackTape=(slot,i)=>`<button type="button" class="vc-stack-tape vc-stack-tape-${i+1}" data-vc-channel-slot="${i}" aria-label="${slot.kind==='real'?'Play '+escape(slot.title):escape(slot.title)+' coming soon'}" aria-pressed="false"><img src="${slot.art}" alt="" loading="eager" decoding="async"><span class="vc-stack-label"><b>${escape(slot.title)}</b><em>${channel(i)}</em></span></button>`;
    root.innerHTML=`<div class="vc-layout"><div class="vc-main"><section class="vc-scene" aria-label="Home video room with television, featured VHS covers and a left-side tape stand">
        <img class="vc-room-photo" src="../assets/media-rooms/crt-collection-room.webp" width="1536" height="1024" alt="Walnut television and VHS player against a soft teal wall, with warm lighting and a narrow VHS stand on the left" fetchpriority="high">
        <div class="vc-feature-holder" aria-label="Featured VHS artwork on top of the television">${list.slice(0,3).map((p,i)=>featureAsset(p,i)).join('')}<span class="vc-holder-base" aria-hidden="true">2FLY · HOME VIDEO COLLECTION</span></div>
        <div class="vc-africa-feature" aria-label="I Woke Up in Africa VHS box set on the VCR">${list[3]?featureAsset(list[3],3,'vc-africa-art'):''}</div>
        <div class="vc-carpet-under-tv" aria-hidden="true"></div>
        <section class="vc-archive-stack-zone" aria-label="Nine channel VHS archive"><div class="vc-wall-patch" aria-hidden="true"></div><p class="vc-stack-heading">FROM THE ARCHIVE</p><div class="vc-physical-stack">${archiveSlots.map(stackTape).join('')}</div></section>
        <div class="vc-crt" id="vcScreen"><video id="vcVideo" playsinline preload="metadata" aria-label="2Fly video"></video><div class="vc-static" aria-hidden="true"></div><div class="vc-glass" aria-hidden="true"></div>
          <div class="vc-osd" aria-hidden="true"><span>2FLY VIDEO</span><span id="vcChannel">CH 01</span><span>SP</span><span id="vcCounter">0:00</span></div>
          <span class="vc-screen-message" id="vcScreenMessage"></span>
          <button type="button" class="vc-screen-toggle" data-vc-action="overlay" aria-label="Show on-screen video controls" aria-expanded="false" aria-controls="vcOverlay"></button>
          <div class="vc-overlay" id="vcOverlay" aria-label="On-screen video controls" hidden>
            <div class="vc-overlay-compact">${button('toggle','▶','data-vc-toggle aria-label="Play or pause"')}<label class="vc-sr" for="vcSeek">Video position</label><input id="vcSeek" data-vc-seek type="range" min="0" max="100" step=".1" value="0" disabled><span class="vc-overlay-clock"><span data-vc-elapsed>0:00</span> / <span data-vc-duration>0:00</span></span>${button('mute','VOL','data-vc-mute')}${button('fullscreen','⛶','aria-label="Fullscreen video"')}${button('overlay','×','aria-label="Close on-screen controls"')}</div>
          </div>
        </div>
        <div class="vc-tv-hardware"><button type="button" class="vc-channel-dial" data-vc-action="channel" aria-label="Turn TV channel dial to next channel" title="Next channel"><i></i><span>CH</span></button><div class="vc-volume-dial" id="vcDial" role="slider" tabindex="0" aria-label="TV volume dial" aria-valuemin="0" aria-valuemax="100" aria-valuenow="75" title="Turn TV volume dial"><i></i><span>VOL</span></div><div class="vc-effect-bank" role="group" aria-label="Picture effects">${effects.map((fx,i)=>button('effect',fx[0],`data-vc-effect-index="${i}" aria-pressed="${i===0}"`)).join('')}</div>${button('power','⏻','class="vc-power" aria-label="TV power" aria-pressed="true"')}<i class="vc-power-light" aria-hidden="true"></i></div>
        <div class="vc-vcr-face"><button type="button" class="vc-tape-slot" data-vc-action="insert" aria-label="Insert selected VHS tape"><span id="vcSlotLabel">VHS · INSERT TAPE</span></button><output class="vc-vcr-display" id="vcVcrDisplay">12:00</output><div class="vc-vcr-buttons">${button('play','▶','aria-label="VCR play"')}${button('pause','Ⅱ','aria-label="VCR pause"')}${button('stop','■','aria-label="VCR stop"')}${button('rewind','⏪','aria-label="VCR rewind 10 seconds"')}${button('forward','⏩','aria-label="VCR fast forward 10 seconds"')}${button('eject','⏏','aria-label="VCR eject"')}</div></div>
      </section>
      <nav class="vc-mobile-library" aria-label="Choose a VHS cover or upcoming release">${list.map((p,i)=>cover(p,i,i===3)).join('')}${future.map(upcoming).join('')}</nav>
      <p class="vc-error" id="vcError" role="status" hidden></p>

      </div>
      <aside class="vc-hud" aria-label="Selected VHS archive"><p class="vc-eyebrow">THE ORIGINAL TAPE / 2FLY ARCHIVE</p><div class="vc-vhs-artifact" id="vcArtifact" role="img" aria-label="Selected VHS tape viewed from overhead"><div class="vc-vhs-top">VHS <span>HI-FI STEREO</span></div><div class="vc-reel-window"><span class="vc-reel-well"><i class="vc-reel"></i></span><div class="vc-vhs-label"><strong id="vcArtifactTitle"></strong><small id="vcArtifactChannel"></small><span class="vc-label-lines" aria-hidden="true"></span></div><span class="vc-reel-well"><i class="vc-reel"></i></span></div><div class="vc-vhs-bottom"><span>T-120 · SP</span><span id="vcArchiveStatus">READY</span></div><i class="vc-vhs-screw vc-screw-left"></i><i class="vc-vhs-screw vc-screw-right"></i></div>
        <div class="vc-hud-transport" aria-label="VCR remote">${button('power','⏻','data-vc-power aria-label="TV power"')}${button('rewind','⏪','aria-label="Rewind 10 seconds"')}${button('toggle','▶','data-vc-toggle aria-label="Play or pause"')}${button('pause','Ⅱ','aria-label="Pause"')}${button('stop','■','aria-label="Stop"')}${button('forward','⏩','aria-label="Fast forward 10 seconds"')}${button('eject','⏏','aria-label="Eject tape"')}${button('channel','CH+','aria-label="Next channel"')}${button('fullscreen','⛶','aria-label="Fullscreen video"')}<label for="vcHudVolume">VOL</label><input id="vcHudVolume" data-vc-volume type="range" min="0" max="1" step=".01" value=".75">${button('mute','MUTE','data-vc-mute')}</div>
        <div class="vc-mobile-effects" role="group" aria-label="Picture effects for touch">${effects.map((fx,i)=>button('effect',fx[0],`data-vc-effect-index="${i}" aria-pressed="${i===0}"`)).join('')}</div>
        ${button('kind-rewind','BE KIND AND REWIND','class="vc-kind-rewind" id="vcKindRewind"')}
        <p class="vc-rewind-note">PLEASE BE KIND — REWIND BEFORE RETURNING THIS TAPE TO THE ARCHIVE.</p>
        <div class="vc-hud-info"><span id="vcHudChannel">CH 01</span><span id="vcHudStatus" role="status">READY</span></div><h2 id="vcHudTitle"></h2><p id="vcHudDescription"></p>      <section class="vc-chapter-section"><div><p>SCENE SELECTION</p><h2 id="vcProjectTitle"></h2></div><div id="vcChapters" class="vc-chapters"></div></section><a href="#music2" data-route="music2" id="vcHearCD">Put on the CD ↗</a>
      </aside></div>`;
    document.querySelector('#appView').replaceChildren(root);
    const q=s=>root.querySelector(s), all=s=>root.querySelectorAll(s), v=q('#vcVideo'), globalAudio=document.querySelector('#globalAudio');
    const write=(sel,val)=>{const e=q(sel);if(e&&e.textContent!==val)e.textContent=val;};
    v.volume=.75; globalAudio.pause();
    const project=()=>list[state.index], clips=()=>clipsFor(project());
    const duration=()=>Number.isFinite(v.duration)?v.duration:0;
    function status() { return !state.power?'OFF':state.error?'CHECK TAPE':state.rewinding?'REW':state.transient||(!state.loaded?'12:00':state.buffering?'LOAD':v.ended?'END':!v.paused?'PLAY':state.stopped?'STOP':'PAUSE'); }
    function sync() {
      if(disposed)return;
      const mode=status(), playing=state.power&&state.loaded&&!v.paused&&!state.buffering&&!state.rewinding, idle=!state.loaded;
      root.dataset.mode=mode; root.classList.toggle('vc-is-playing',playing); root.classList.toggle('vc-is-rewinding',mode==='REW'); root.classList.toggle('vc-is-off',!state.power); root.classList.toggle('vc-is-idle',idle); root.classList.toggle('vc-is-loading',state.buffering);
      root.classList.toggle('vc-osd-hidden',playing&&v.currentTime>.6&&!state.transient);
      q('#vcOverlay').hidden=!state.overlay; const screenToggle=q('.vc-screen-toggle'); screenToggle.setAttribute('aria-expanded',String(state.overlay)); screenToggle.setAttribute('aria-label',state.overlay?'Hide on-screen video controls':'Show on-screen video controls');
      all('[data-vc-toggle]').forEach(b=>{b.textContent=playing?'Ⅱ Pause':'▶ Play';b.disabled=idle||!state.power;});
      all('[data-vc-action="play"],[data-vc-action="pause"],[data-vc-action="stop"],[data-vc-action="rewind"],[data-vc-action="forward"],[data-vc-action="kind-rewind"]').forEach(b=>b.disabled=idle||!state.power);
      all('[data-vc-action="eject"]').forEach(b=>b.disabled=idle);
      all('[data-vc-action="power"]').forEach(b=>b.setAttribute('aria-pressed',String(state.power)));
      q('.vc-power-light').classList.toggle('is-on',state.power);
      q('#vcVideo').style.filter=effects[state.effect][1]; all('[data-vc-effect-index]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.vcEffectIndex)===state.effect)));
      write('#vcChannel',channel(state.channelIndex));write('#vcHudChannel',channel(state.channelIndex));write('#vcCounter',clock(v.currentTime));
      write('#vcScreenMessage',!state.power?'TV OFF':state.upcoming?'Release Date Goes Here':idle?'INSERT A TAPE':state.error?'CHECK TAPE':state.buffering?'TRACKING…':'');
      write('#vcVcrDisplay',mode==='PLAY'?`PLAY ${clock(v.currentTime)}`:mode); write('#vcHudStatus',state.upcoming?'COMING SOON':idle?'EJECTED':mode); write('#vcArchiveStatus',state.upcoming?'UNRELEASED':idle?'IN THE ARCHIVE':mode);
      write('#vcSlotLabel',state.loaded?'VHS · TAPE LOADED':'VHS · INSERT TAPE');
      const total=duration(); all('[data-vc-seek]').forEach(e=>{e.disabled=!state.loaded||!total||!state.power;e.value=total?v.currentTime/total*100:0;});
      all('[data-vc-elapsed]').forEach(e=>e.textContent=clock(v.currentTime));all('[data-vc-duration]').forEach(e=>e.textContent=clock(total));
      all('[data-vc-volume]').forEach(e=>e.value=v.volume);all('[data-vc-mute]').forEach(e=>{e.textContent=v.muted?'Unmute':'Mute';e.setAttribute('aria-pressed',String(v.muted));});
      const dial=q('#vcDial');dial.setAttribute('aria-valuenow',String(Math.round(v.volume*100)));dial.setAttribute('aria-valuetext',Math.round(v.volume*100)+' percent');dial.style.setProperty('--vc-dial-angle',(-135+v.volume*270)+'deg');
      q('.vc-channel-dial').style.setProperty('--vc-channel-angle',(-120+state.channelIndex*30)+'deg');
      all('[data-vc-tape]').forEach(b=>b.setAttribute('aria-pressed',String(state.loaded&&Number(b.dataset.vcTape)===state.index)));
      all('[data-vc-channel-slot]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.vcChannelSlot)===state.channelIndex)));
      all('[data-vc-upcoming]').forEach(b=>b.setAttribute('aria-pressed',String(future[Number(b.dataset.vcUpcoming)]?.title===state.upcoming)));
      q('#vcError').hidden=!state.error;write('#vcError',state.error);
    }
    function cancelMotion() { operation++; cancelAnimationFrame(frame);clearTimeout(scanTimer);state.rewinding=false;state.transient=''; }
    function transient(value,ms=800) { clearTimeout(scanTimer);state.transient=value;scanTimer=setTimeout(()=>{state.transient='';sync();},ms);sync(); }
    function load(index,chapter=0,autoplay=false) {
      cancelMotion();v.pause();state.upcoming='';state.index=index;state.channelIndex=index;state.chapter=chapter;state.error='';state.stopped=true;state.buffering=true;state.loaded=true;
      if(autoplay)state.power=true;
      const p=project(),choices=clips(),clip=choices[chapter];
      if(!clip){state.loaded=false;state.buffering=false;state.error='This tape has not been released yet.';sync();return;}
      onSelect(p.id);v.poster=asset(clip.poster||p.poster||p.cover);v.src=asset(clip.src);v.setAttribute('aria-label',clip.title||p.title);v.load();
      write('#vcArtifactTitle',p.title);write('#vcArtifactChannel',`${channel(index)} · 2FLY HOME VIDEO`);write('#vcHudChannel',channel(index));write('#vcHudTitle',p.title);write('#vcHudDescription',p.description||'');write('#vcProjectTitle',p.title);write('#vcOverlayTitle',clip.title||p.title);
      q('#vcArtifact').setAttribute('aria-label',`${p.title} VHS tape viewed from overhead`);
      q('.vc-chapter-section').hidden=choices.length<2; q('#vcHearCD').hidden=false;
      q('#vcChapters').innerHTML=choices.map((c,i)=>`<button type="button" data-vc-chapter="${i}" aria-pressed="${i===chapter}"><span>${String(i+1).padStart(2,'0')}</span>${escape(c.title||p.title)}</button>`).join('');
      sync();if(autoplay)play();
    }
    async function play() {
      if(!state.loaded||!state.power)return;
      cancelMotion();state.error='';state.stopped=false;const ticket=operation;
      try{if(v.error)v.load();await v.play();}catch(e){if(disposed||ticket!==operation||e.name==='AbortError')return;state.buffering=false;state.error='The tape could not start. Press Play to retry or choose another tape.';sync();}
    }
    function pause() { cancelMotion();v.pause();state.stopped=false;state.buffering=false;sync(); }
    function stop() { cancelMotion();v.pause();if(state.loaded)v.currentTime=0;state.stopped=true;state.buffering=false;sync(); }
    function eject() { cancelMotion();v.pause();state.loaded=false;state.buffering=false;state.stopped=true;state.error='';state.upcoming='';state.overlay=false;v.removeAttribute('src');v.removeAttribute('poster');v.load();transient('EJECT',1200); }
    function selectChannelSlot(slotIndex,autoplay=false) {
      const slot=archiveSlots[((slotIndex%archiveSlots.length)+archiveSlots.length)%archiveSlots.length];
      state.channelIndex=((slotIndex%archiveSlots.length)+archiveSlots.length)%archiveSlots.length;
      if(slot.kind==='real'){load(slot.projectIndex,0,autoplay);return;}
      cancelMotion();v.pause();state.loaded=false;state.buffering=false;state.stopped=true;state.error='';state.upcoming=slot.title;state.overlay=false;v.removeAttribute('src');v.removeAttribute('poster');v.load();
      write('#vcArtifactTitle',slot.title);write('#vcArtifactChannel',`${channel(state.channelIndex)} · 2FLY ARCHIVE`);
      write('#vcHudTitle',slot.title);write('#vcHudDescription','COMING SOON · This channel is reserved for a future 2Fly home video release.');
      q('#vcArtifact').setAttribute('aria-label',slot.title+' unreleased VHS tape');
      q('.vc-chapter-section').hidden=true;q('#vcHearCD').hidden=true;sync();
    }
    function previewUpcoming(index) {
      const slotIndex=Math.min(archiveSlots.length-1,list.length+index);
      selectChannelSlot(slotIndex,false);
    }
    function skip(delta) { if(!state.loaded||!state.power||!duration())return;cancelMotion();v.currentTime=Math.max(0,Math.min(duration(),v.currentTime+delta));if(v.currentTime===0){v.pause();state.stopped=true;}transient(delta<0?'REW':'FF'); }
    function kindRewind() {
      if(!state.loaded||!state.power)return;cancelMotion();v.pause();state.buffering=false;state.rewinding=true;state.stopped=false;const initial=v.currentTime,start=performance.now(),ticket=operation;let lastSeek=0;
      sync();
      const tick=now=>{if(disposed||ticket!==operation)return;const fraction=Math.min(1,(now-start)/1400);if(now-lastSeek>90||fraction===1){v.currentTime=Math.max(0,initial*(1-fraction));lastSeek=now;sync();}if(fraction<1)frame=requestAnimationFrame(tick);else{state.rewinding=false;state.stopped=true;v.currentTime=0;sync();}};
      frame=requestAnimationFrame(tick);
    }
    function volume(value){v.muted=false;v.volume=Math.max(0,Math.min(1,value));sync();}
    async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else if(q('#vcScreen').requestFullscreen)await q('#vcScreen').requestFullscreen();else if(v.webkitEnterFullscreen)v.webkitEnterFullscreen();else throw Error();}catch{state.error='Fullscreen is unavailable in this browser. The TV remains playable here.';sync();}}
    const actions={play,pause,stop,eject,rewind:()=>skip(-10),forward:()=>skip(10),'kind-rewind':kindRewind,fullscreen,
      toggle:()=>v.paused?play():pause(),overlay:()=>{state.overlay=!state.overlay;sync();},channel:()=>selectChannelSlot((state.channelIndex+1)%archiveSlots.length,!v.paused&&state.power),
      power:()=>{cancelMotion();state.power=!state.power;if(!state.power){v.pause();state.buffering=false;state.overlay=false;}sync();},effect:()=>{state.effect=(state.effect+1)%effects.length;sync();},mute:()=>{v.muted=!v.muted;sync();},insert:()=>{if(!state.loaded&&!state.upcoming)load(state.index,0,false);}
    };
    on(root,'click',e=>{const channelSlot=e.target.closest('[data-vc-channel-slot]'),pending=e.target.closest('[data-vc-upcoming]'),tape=e.target.closest('[data-vc-tape]'),scene=e.target.closest('[data-vc-chapter]'),control=e.target.closest('[data-vc-action]');if(channelSlot)selectChannelSlot(Number(channelSlot.dataset.vcChannelSlot),true);else if(pending)previewUpcoming(Number(pending.dataset.vcUpcoming));else if(tape)load(Number(tape.dataset.vcTape),0,true);else if(scene)load(state.index,Number(scene.dataset.vcChapter),true);else if(control){if(control.dataset.vcAction==='effect'&&control.dataset.vcEffectIndex!==undefined){state.effect=Number(control.dataset.vcEffectIndex);sync();}else actions[control.dataset.vcAction]?.();}});
    on(root,'input',e=>{if(e.target.matches('[data-vc-volume]'))volume(Number(e.target.value));else if(e.target.matches('[data-vc-seek]')&&state.loaded&&duration()){cancelMotion();v.currentTime=Number(e.target.value)*duration()/100;state.stopped=v.currentTime===0;sync();}});
    on(root,'keydown',e=>{if(e.key==='Escape'&&state.overlay){state.overlay=false;sync();q('.vc-screen-toggle').focus({preventScroll:true});}});
    on(v,'loadedmetadata',()=>{if(state.loaded){state.buffering=false;sync();}});on(v,'canplay',()=>{state.buffering=false;sync();});
    on(v,'waiting',()=>{if(state.loaded&&!v.paused&&!state.rewinding){state.buffering=true;sync();}});
    on(v,'playing',()=>{state.buffering=false;state.stopped=false;sync();});on(v,'play',()=>globalAudio.pause());
    on(globalAudio,'play',()=>{if(!v.paused)pause();});
    ['pause','timeupdate','volumechange','durationchange','ended'].forEach(event=>on(v,event,sync));
    on(v,'error',()=>{if(!state.loaded)return;state.buffering=false;state.error='This tape could not load. Select it again to retry, or choose another tape.';sync();});
    on(q('#vcHearCD'),'click',()=>onMusic(project().id));
    const dial=q('#vcDial');let pointer=null,angle=0;
    const angleAt=e=>{const r=dial.getBoundingClientRect();return Math.atan2(e.clientX-r.left-r.width/2,-(e.clientY-r.top-r.height/2))*180/Math.PI;};
    on(dial,'pointerdown',e=>{if(e.button!==0)return;e.preventDefault();pointer=e.pointerId;angle=angleAt(e);dial.setPointerCapture(pointer);dial.focus({preventScroll:true});});
    on(dial,'pointermove',e=>{if(e.pointerId!==pointer)return;const next=angleAt(e);let delta=next-angle;if(delta>180)delta-=360;if(delta< -180)delta+=360;angle=next;volume(v.volume+delta/270);});
    const release=e=>{if(e.pointerId===pointer){pointer=null;if(dial.hasPointerCapture(e.pointerId))dial.releasePointerCapture(e.pointerId);}};
    ['pointerup','pointercancel','lostpointercapture'].forEach(event=>on(dial,event,release));
    on(dial,'keydown',e=>{const steps={ArrowRight:.05,ArrowUp:.05,ArrowLeft:-.05,ArrowDown:-.05};if(e.key in steps){e.preventDefault();volume(v.volume+steps[e.key]);}else if(e.key==='Home'||e.key==='End'){e.preventDefault();volume(e.key==='Home'?0:1);}});
    load(state.index);
    return ()=>{disposed=true;cancelMotion();abort.abort();v.pause();v.removeAttribute('src');v.load();root.remove();};
  }
  return {mount};
})();
