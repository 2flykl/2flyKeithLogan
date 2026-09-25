/* Physical media rooms: functional HTML controls over photographic scene plates. */
window.MediaPages = (() => {
  'use strict';
  let dispose = () => {}, selectedMusic = '', selectedVideo = '', binderPage = 0, ledIndex = 0;
  const q = s => document.querySelector(s);
  const html = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const number = n => String(n + 1).padStart(2, '0');
  const audio = () => q('#globalAudio');
  const clipsFor = p => (p.clips?.length ? p.clips : p.video ? [{title:p.title, src:p.video, poster:p.poster}]:[]).filter(c => c.src);
  const image = (path, alt, eager = false) => `<img src="${html(asset(path))}" alt="${html(alt)}" width="640" height="640" loading="${eager ? 'eager' : 'lazy'}" decoding="async">`;
  const plate = (name, alt) => `<img class="room-photo" src="../assets/media-rooms/${name}.webp" alt="${alt}" width="1536" height="1024" fetchpriority="high">`;
  const footer = '<footer class="room-footer"><span>2FLY KEITH LOGAN · THE ANTI-ALGORITHM EXPERIMENT</span><a href="#support" data-route="support">Help keep the room playing ↗</a></footer>';
  function empty(kind) { q('#appView').innerHTML = `<section class="room-page"><h1>${kind} room</h1><p>The catalog could not load. Reload this page to try again.</p></section>`; }
  function events() { const controller = new AbortController(); return {controller, on:(el, event, fn) => el.addEventListener(event, fn, {signal:controller.signal})}; }
  function text(selector, value) { const el = q(selector); if (el && el.textContent !== value) el.textContent = value; }
  function music() {
    const list = app.projects.filter(p => p.audio);
    if (!list.length) return empty('Listening');
    const {controller, on} = events(), a = audio();
    const current = list.findIndex(p => new URL(asset(p.audio), location.href).href === a.src), chosen = list.findIndex(p => p.id === selectedMusic);
    let index = Math.max(0, chosen >= 0 ? chosen : current);
    const tracksFor = p => (p.tracks?.length ? p.tracks : [{title:p.title,audio:p.audio}]).filter(t => t.audio || t.src);
    let trackIndex = Math.max(0, tracksFor(list[index]).findIndex(t => new URL(asset(t.audio || t.src), location.href).href === a.src));
    const perPage = 2, pages = Math.ceil(list.length / perPage); binderPage = Math.floor(index / perPage);
    q('#appView').innerHTML = `<section class="room-page listening-room unified-listening-room">
      <header class="room-heading"><div><p class="room-eyebrow">2FLY AFTER HOURS / THE LISTENING ROOM</p><h1>Make yourself at home.</h1></div><p>Flip the book. Load a CD.<br>Press play on the stereo.</p></header>
      <div class="unified-listening-layout">
        <section class="unified-room-stage" aria-label="Interactive home stereo and upright CD binder">
          <div class="stereo-scene unified-stereo-scene">
            ${plate('stereo-binder-refined','Close-up silver stereo with two large speakers and an upright open leather CD binder in the foreground')}
            <div class="stereo-chassis"><div class="stereo-display" aria-hidden="true"><span>2FLY · CD CHANGER</span><strong id="stereoTrack"></strong><div class="room-stereo-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>

            <div class="stereo-image-controls" aria-label="Stereo buttons">
              <button type="button" data-stereo="previous" aria-label="Stereo previous disc" title="Previous disc"><b>⏮</b><span>PREV</span></button>
              <button type="button" data-stereo="play" aria-label="Stereo play CD" title="Play / pause"><b>▶</b><span>PLAY</span></button>
              <button type="button" data-stereo="stop" aria-label="Stereo stop CD" title="Stop"><b>■</b><span>STOP</span></button>
              <button type="button" data-stereo="next" aria-label="Stereo next disc" title="Next disc"><b>⏭</b><span>NEXT</span></button>
              <button type="button" data-stereo="color" aria-label="Change speaker LED color" title="Change speaker LED color"><b>◉</b><span>LED COLOR</span></button>
            </div>
            <div class="image-volume-dial" id="stereoDial" role="slider" tabindex="0" aria-label="Stereo volume knob" aria-valuemin="0" aria-valuemax="100" aria-valuenow="75" aria-valuetext="75 percent" title="Turn to adjust volume. Arrow keys also work."><span class="dial-rotor" aria-hidden="true"><i></i></span></div>
            </div><div class="speaker-led speaker-led-left" aria-hidden="true"></div><div class="speaker-led speaker-led-right" aria-hidden="true"></div><section class="upright-binder" id="cdBinder" role="region" aria-roledescription="carousel" aria-label="CD binder" tabindex="0"><div id="binderPockets"></div><div class="binder-navigation unified-binder-navigation"><button type="button" id="binderPrev" aria-label="Previous binder page">← Flip back</button><span id="binderPage" role="status" aria-live="polite"></span><button type="button" id="binderNext" aria-label="Next binder page">Flip next →</button></div></section>
          </div>

          <p class="stereo-help">Previous disc · play/pause · stop · next disc. Turn the volume knob; use the HUD for volume − / +.</p><p class="binder-help">Select a CD in the book. Swipe or use ← → to turn its pages.</p>
        </section>
        <aside class="hi-fi-panel music-hud" aria-label="Playback HUD">
          <p class="hardware-label hud-heading">2FLY / PERSONAL SOUND SYSTEM</p>
          <div class="hi-fi-now"><div id="loadedDiscArt"></div><div><span class="hardware-label">DISC <b id="discNumber"></b> / ${number(list.length - 1)}</span><h2 id="musicTitle"></h2><p id="musicTheme"></p></div><span class="room-status" id="audioState" role="status">READY</span></div>
          <div class="hardware-transport"><button type="button" id="musicPlay" class="hardware-play"><b>▶</b><span>PLAY CD</span></button><button type="button" id="musicPrev" aria-label="Previous CD"><b>⏮</b><span>PREVIOUS DISC</span></button><button type="button" id="musicNext" aria-label="Next CD"><b>⏭</b><span>NEXT</span></button><button type="button" id="musicStop" aria-label="Stop CD"><b>■</b><span>STOP</span></button></div>
          <div class="room-progress"><label for="musicSeek">TRACK POSITION</label><input id="musicSeek" type="range" min="0" max="100" step=".1" value="0" disabled><div><span id="musicElapsed">0:00</span><span id="musicDuration">0:00</span></div></div>
          <div class="hi-fi-bottom"><label for="musicVolume">VOLUME <input id="musicVolume" type="range" min="0" max="1" step=".01" value="${a.volume}"></label></div><div class="volume-step-controls"><button type="button" id="volumeDown" aria-label="Volume down">− VOL</button><output id="volumePercent" aria-label="Volume level">75%</output><button type="button" id="volumeUp" aria-label="Volume up">VOL +</button></div><button type="button" id="ledColor" class="led-color-control">LED COLOR · <span id="ledColorName">ICE BLUE</span></button><button type="button" id="hudMute" class="hud-mute" aria-pressed="false">Mute speakers</button><p id="musicError" class="room-error" role="status" hidden></p>
          <div class="hud-liner"><span class="hardware-label">FROM THE LINER NOTES</span><h3 id="linerTitle"></h3><p id="linerDescription"></p><div class="room-related" id="musicRelated"></div><div id="musicAlbumTracks" class="music-album-tracks"></div></div>
        </aside>
      </div>${footer}</section>`;
    function selectedTrack() { return tracksFor(list[index])[trackIndex]; }
    function active() { return new URL(asset(selectedTrack()?.audio || selectedTrack()?.src || list[index].audio), location.href).href === a.src; }
    function sync() {
      const loaded = active(), playing = loaded && !a.paused && !a.ended && a.readyState >= 3;
      q('.stereo-scene').classList.toggle('is-playing', playing);
      text('#musicPlay b',playing ? 'Ⅱ' : '▶'); text('#musicPlay span',playing ? 'PAUSE CD' : 'PLAY CD');
      q('#musicPlay').setAttribute('aria-label',playing ? 'Pause CD' : 'Play CD');
      q('[data-stereo="play"]').setAttribute('aria-label',playing ? 'Stereo pause CD' : 'Stereo play CD');
      const quiet = a.muted || a.volume === 0;
      const percent = Math.round(a.volume * 100), dial=q('#stereoDial');
      dial.setAttribute('aria-valuenow',String(percent)); dial.setAttribute('aria-valuetext',percent + ' percent' + (a.muted ? ', muted' : ''));
      dial.style.setProperty('--dial-turn',(-135 + a.volume * 270) + 'deg');
      text('#volumePercent',percent + '%');
      q('.stereo-scene').classList.toggle('leds-active',playing);
      text('[data-stereo="play"] b',playing ? 'Ⅱ' : '▶'); text('[data-stereo="play"] span',playing ? 'PAUSE' : 'PLAY');
      q('#hudMute').setAttribute('aria-pressed',String(quiet)); text('#hudMute',quiet ? 'Unmute speakers' : 'Mute speakers');
      text('#audioState',loaded && a.error ? 'CHECK DISC' : playing ? 'PLAYING' : loaded && a.currentTime > 0 ? 'PAUSED' : 'READY');
      q('#audioState').classList.toggle('is-on',playing);
      const duration = loaded && Number.isFinite(a.duration) && a.duration > 0 ? a.duration : 0;
      q('#musicSeek').disabled = !duration; q('#musicSeek').value = duration ? a.currentTime / duration * 100 : 0;
      text('#musicElapsed',time(loaded ? a.currentTime : 0)); text('#musicDuration',time(duration)); q('#musicVolume').value = a.volume;
    }
    function drawBinder() {
      q('#binderPockets').innerHTML = Array.from({length:perPage},(_,slot) => {
        const i = binderPage * perPage + slot, p = list[i];
        return p ? `<button type="button" class="cd-pocket pocket-${slot}" data-disc="${i}" aria-label="Load ${html(p.title)} CD" aria-pressed="${i === index}"><span class="room-compact-disc">${image(p.cover,'',true)}<i></i></span><span class="disc-label">${html(p.title)}</span><span class="disc-loaded">${i === index ? 'IN THE STEREO' : 'LOAD CD'}</span></button>` : `<div class="cd-pocket pocket-${slot} empty-pocket" aria-hidden="true"><span>More memories<br>to come.</span></div>`;
      }).join('');
      text('#binderPage',`PAGE ${binderPage + 1} / ${pages}`); q('#binderPrev').disabled = pages < 2; q('#binderNext').disabled = pages < 2;
    }
    function show() {
      const p = list[index]; selectedMusic = p.id;
      q('#loadedDiscArt').innerHTML = image(p.cover,`${p.title} CD artwork`,true);
      text('#discNumber',number(index)); text('#musicTitle',p.title); text('#stereoTrack',p.title); text('#musicTheme',p.subtitle || '2Fly Keith Logan');
      text('#linerTitle',p.title); text('#linerDescription',p.description || ''); q('#musicError').hidden = true;
      q('#musicRelated').innerHTML = `${clipsFor(p).length ? '<a id="watchTape" href="#videos" data-route="videos">Find the VHS ↗</a>' : ''}${p.experience ? `<a href="${html(asset(p.experience))}">Step inside the playable ↗</a>` : ''}`;
      const songs=tracksFor(p);
      q('#musicAlbumTracks').innerHTML = songs.length > 1 ? `<h4>ALBUM TRACKS</h4><ol>${songs.map((t,i)=>`<li><button type="button" data-album-track="${i}" aria-current="${i===trackIndex?'true':'false'}"><span>${number(i)}</span>${html(t.title)}</button></li>`).join('')}</ol>` : '';
      q('#watchTape')?.addEventListener('click',() => { selectedVideo = p.id; },{signal:controller.signal}); drawBinder(); sync();
    }
    function loadSelected(start=false) {
      const p=list[index],t=selectedTrack();
      loadProjectAudio({...p,title:t?.title || p.title,audio:t?.audio || t?.src || p.audio},false);
      if(start) play();
    }
    async function play() {
      q('#musicError').hidden = true; if (!active() || a.error) loadSelected(false);
      try { await a.play(); } catch (error) { if (controller.signal.aborted || error.name === 'AbortError') return; q('#musicError').textContent = 'The disc could not start. Press Play CD to try again, or choose another CD.'; q('#musicError').hidden = false; }
    }
    function select(next,start = false) {
      index = (next + list.length) % list.length; trackIndex=0; binderPage = Math.floor(index / perPage); a.pause();
      if (!active()) loadSelected(false); show(); if (start) play();
    }
    function chooseTrack(next,start=true) {
      const songs=tracksFor(list[index]); if(next<0 || next>=songs.length)return;
      trackIndex=next; a.pause(); loadSelected(false); show(); if(start) play();
    }
    on(q('#musicAlbumTracks'),'click',e => { const button=e.target.closest('[data-album-track]'); if(button)chooseTrack(Number(button.dataset.albumTrack)); });
    on(q('#binderPockets'),'click',e => { const b = e.target.closest('[data-disc]'); if (swiped) { swiped=false; return; } if (b) { const next = Number(b.dataset.disc); select(next,!a.paused); q(`[data-disc="${next}"]`)?.focus({preventScroll:true}); } });
    let flipAnimation, swipeStart = null, swiped = false;
    function flip(direction) {
      binderPage = (binderPage + direction + pages) % pages; drawBinder();
      flipAnimation?.cancel();
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        flipAnimation = q('#binderPockets').animate([
          {transform: 'perspective(900px) rotateY(' + (direction * 28) + 'deg)',opacity:.25},
          {transform:'perspective(900px) rotateY(0deg)',opacity:1}
        ],{duration:400,easing:'cubic-bezier(.2,.7,.2,1)'});
      }
    }
    on(q('#binderPrev'),'click',() => flip(-1)); on(q('#binderNext'),'click',() => flip(1));
    on(q('#cdBinder'),'keydown',e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); flip(e.key === 'ArrowLeft' ? -1 : 1); q('#cdBinder').focus({preventScroll:true}); } });
    on(q('#cdBinder'),'pointerdown',e => { swipeStart = {x:e.clientX,y:e.clientY}; swiped = false; });
    on(q('#cdBinder'),'pointerup',e => { if (!swipeStart) return; const dx=e.clientX-swipeStart.x,dy=e.clientY-swipeStart.y; swipeStart=null; if (Math.abs(dx)>35 && Math.abs(dx)>Math.abs(dy)*1.4) { swiped=true; flip(dx<0 ? 1 : -1); } });
    on(q('#cdBinder'),'pointercancel',() => { swipeStart=null; });
    on(q('#cdBinder'),'dragstart',e => e.preventDefault());
    function toggle() { active() && !a.paused ? a.pause() : play(); }
    function stop() { if (active()) { a.pause(); a.currentTime=0; } sync(); }
    function mute() { const quiet=a.muted || a.volume===0; if (a.volume === 0) a.volume=.75; a.muted=!quiet; savePlayer(); }
    on(q('.stereo-image-controls'),'click',e => { const action=e.target.closest('[data-stereo]')?.dataset.stereo; if(action==='play') toggle(); else if(action==='stop') stop(); else if(action==='previous') select(index-1,true); else if(action==='next') select(index+1,true); else if(action==='quieter') setVolume(a.volume-.05); else if(action==='louder') setVolume(a.volume+.05); else if(action==='color') changeColor(); });
    on(q('#hudMute'),'click',mute); on(q('#musicStop'),'click',stop);
    on(q('#musicPrev'),'click',() => select(index - 1,true)); on(q('#musicNext'),'click',() => select(index + 1,true));
    on(q('#musicPlay'),'click',toggle);
    on(q('#musicSeek'),'input',e => { if (active() && Number.isFinite(a.duration)) a.currentTime = Number(e.target.value) * a.duration / 100; });
    on(q('#musicVolume'),'input',e => setVolume(Number(e.target.value)));
    function setVolume(value) { a.muted=false; a.volume=Math.max(0,Math.min(1,value)); q('#playerVolume').value=a.volume; savePlayer(); sync(); }
    on(q('#volumeDown'),'click',() => setVolume(a.volume-.05)); on(q('#volumeUp'),'click',() => setVolume(a.volume+.05));
    const colors=[['ICE BLUE','#58d8ff'],['AMBER','#ffae45'],['VIOLET','#be7aff'],['ROSE','#ff578a'],['MINT','#67ffb4'],['OFF','transparent']];
    function paintLEDs() {
      const [name,color]=colors[ledIndex],scene=q('.stereo-scene');
      scene.style.setProperty('--speaker-led',color); scene.classList.toggle('leds-off',name==='OFF');
      text('#ledColorName',name); q('#ledColor').setAttribute('aria-label','Change LED color, currently '+name.toLowerCase());
      q('[data-stereo="color"]').setAttribute('aria-label','Change speaker LED color, currently '+name.toLowerCase());
    }
    function changeColor() { ledIndex=(ledIndex+1)%colors.length; paintLEDs(); }
    on(q('#ledColor'),'click',changeColor); paintLEDs();
    const dial=q('#stereoDial'); let dialPointer=null,lastAngle=0;
    function pointerAngle(e) { const r=dial.getBoundingClientRect(); return Math.atan2(e.clientX-r.left-r.width/2,-(e.clientY-r.top-r.height/2))*180/Math.PI; }
    on(dial,'pointerdown',e => { if(e.button!==0 || dialPointer!==null) return; e.preventDefault(); dial.focus({preventScroll:true}); dialPointer=e.pointerId; lastAngle=pointerAngle(e); dial.setPointerCapture(e.pointerId); dial.classList.add('is-turning'); });
    on(dial,'pointermove',e => { if(e.pointerId!==dialPointer) return; const angle=pointerAngle(e); let delta=angle-lastAngle; if(delta>180) delta-=360; if(delta< -180) delta+=360; lastAngle=angle; setVolume(a.volume+delta/270); });
    function releaseDial(e) { if(e.pointerId!==dialPointer) return; dialPointer=null; dial.classList.remove('is-turning'); if(dial.hasPointerCapture(e.pointerId)) dial.releasePointerCapture(e.pointerId); }
    ['pointerup','pointercancel','lostpointercapture'].forEach(event => on(dial,event,releaseDial));
    on(dial,'keydown',e => { const steps={ArrowUp:.02,ArrowRight:.02,ArrowDown:-.02,ArrowLeft:-.02,PageUp:.1,PageDown:-.1}; if(e.key in steps) { e.preventDefault(); setVolume(a.volume+steps[e.key]); } else if(e.key==='Home' || e.key==='End') { e.preventDefault(); setVolume(e.key==='Home'?0:1); } });
    ['play','playing','waiting','pause','ended','timeupdate','loadedmetadata','durationchange','volumechange'].forEach(event => on(a,event,sync));
    on(a,'error',() => { q('#musicError').textContent = 'This disc could not load. Try Play CD again or choose another disc.'; q('#musicError').hidden = false; sync(); });
    const previousEnded = a.onended, globalPrev=q('#playerPrev'), globalNext=q('#playerNext');
    const previousGlobalPrev=globalPrev.onclick, previousGlobalNext=globalNext.onclick;
    const stepSong=delta => { const next=trackIndex+delta,songs=tracksFor(list[index]); if(next>=0&&next<songs.length)chooseTrack(next); else select(index+delta,true); };
    globalPrev.onclick=() => stepSong(-1); globalNext.onclick=() => stepSong(1);
    a.onended = () => stepSong(1);
    dispose = () => { flipAnimation?.cancel(); controller.abort(); a.onended = previousEnded; globalPrev.onclick=previousGlobalPrev; globalNext.onclick=previousGlobalNext; }; show();
  }
  function videos() {
    dispose = window.CRTVideoRoom.mount({projects:app.projects, initialId:selectedVideo, onSelect:id=>{selectedVideo=id;}, onMusic:id=>{selectedMusic=id;}});
  }
  return {music,videos,cleanup() { dispose(); dispose = () => {}; }};
})();
