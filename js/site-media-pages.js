/* Physical media rooms: functional HTML controls over photographic scene plates. */
window.MediaPages = (() => {
  'use strict';
  let dispose = () => {}, selectedMusic = '', selectedVideo = '', binderPage = 0;
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
    const current = list.findIndex(p => new URL(p.audio, location.href).href === a.src), chosen = list.findIndex(p => p.id === selectedMusic);
    let index = Math.max(0, chosen >= 0 ? chosen : current);
    const pages = Math.ceil(list.length / 4); binderPage = Math.floor(index / 4);
    q('#appView').innerHTML = `<section class="room-page listening-room">
      <header class="room-heading"><div><p class="room-eyebrow">2FLY AFTER HOURS / THE LISTENING ROOM</p><h1>Make yourself at home.</h1></div><p>Open the binder. Pick a CD.<br>Let the evening play out.</p></header>
      <div class="listening-layout"><section class="stereo-station" aria-label="2000s home stereo">
        <div class="stereo-scene">${plate('stereo-room','Silver 2000s stereo and large speakers on a walnut cabinet in a warmly lit home')}
          <div class="stereo-display" aria-hidden="true"><span>2FLY · CD CHANGER</span><strong id="stereoTrack"></strong><div class="room-stereo-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></div>
          <div class="room-scene-caption"><span>THE HOME SYSTEM</span><span>CD · STEREO</span></div>
        </div>
        <div class="hi-fi-panel"><div class="hi-fi-now"><div id="loadedDiscArt"></div><div><span class="hardware-label">DISC IN THE CHANGER <b id="discNumber"></b></span><h2 id="musicTitle"></h2><p id="musicTheme"></p></div><span class="room-status" id="audioState" role="status">READY</span></div>
          <div class="hardware-transport"><button type="button" id="musicPrev" aria-label="Previous CD"><b>⏮</b><span>PREVIOUS</span></button><button type="button" id="musicPlay" class="hardware-play"><b>▶</b><span>PLAY CD</span></button><button type="button" id="musicNext" aria-label="Next CD"><b>⏭</b><span>NEXT</span></button></div>
          <div class="room-progress"><label for="musicSeek">TRACK POSITION</label><input id="musicSeek" type="range" min="0" max="100" step=".1" value="0" disabled><div><span id="musicElapsed">0:00</span><span id="musicDuration">0:00</span></div></div>
          <div class="hi-fi-bottom"><span class="hardware-label">2FLY / PERSONAL SOUND SYSTEM</span><label for="musicVolume">VOLUME <input id="musicVolume" type="range" min="0" max="1" step=".01" value="${a.volume}"></label></div><p id="musicError" class="room-error" role="status" hidden></p>
        </div></section>
      <section class="binder-station" aria-labelledby="binderTitle"><div class="binder-heading"><div><p class="room-eyebrow">YOUR SEAT. YOUR SELECTION.</p><h2 id="binderTitle">The CD book.</h2></div><span class="binder-count">${number(list.length - 1)} DISCS</span></div>
        <p class="binder-instruction">Tap a disc to load it into the stereo.</p>
        <div class="cd-binder" id="cdBinder"><img class="binder-photo" src="../assets/media-rooms/cd-binder.webp" alt="Open leather CD binder with clear plastic sleeves" width="1536" height="1024"><div id="binderPockets"></div></div>
        <div class="binder-navigation"><button type="button" id="binderPrev" aria-label="Previous binder page">← Previous page</button><span id="binderPage" role="status"></span><button type="button" id="binderNext" aria-label="Next binder page">Next page →</button></div>
        <div class="album-liner"><span class="room-eyebrow">FROM THE LINER NOTES</span><h3 id="linerTitle"></h3><p id="linerDescription"></p><div class="room-related" id="musicRelated"></div></div>
      </section></div>${footer}</section>`;
    function active() { return new URL(list[index].audio, location.href).href === a.src; }
    function sync() {
      const loaded = active(), playing = loaded && !a.paused;
      q('.stereo-scene').classList.toggle('is-playing', playing);
      text('#musicPlay b',playing ? 'Ⅱ' : '▶'); text('#musicPlay span',playing ? 'PAUSE CD' : 'PLAY CD');
      q('#musicPlay').setAttribute('aria-label',playing ? 'Pause CD' : 'Play CD');
      text('#audioState',loaded && a.error ? 'CHECK DISC' : playing ? 'PLAYING' : loaded && a.currentTime > 0 ? 'PAUSED' : 'READY');
      q('#audioState').classList.toggle('is-on',playing);
      const duration = loaded && Number.isFinite(a.duration) && a.duration > 0 ? a.duration : 0;
      q('#musicSeek').disabled = !duration; q('#musicSeek').value = duration ? a.currentTime / duration * 100 : 0;
      text('#musicElapsed',time(loaded ? a.currentTime : 0)); text('#musicDuration',time(duration)); q('#musicVolume').value = a.volume;
    }
    function drawBinder() {
      q('#binderPockets').innerHTML = Array.from({length:4},(_,slot) => {
        const i = binderPage * 4 + slot, p = list[i];
        return p ? `<button type="button" class="cd-pocket pocket-${slot}" data-disc="${i}" aria-label="Load ${html(p.title)} CD" aria-pressed="${i === index}"><span class="room-compact-disc">${image(p.cover,'',true)}<i></i></span><span class="disc-label">${html(p.title)}</span><span class="disc-loaded">${i === index ? 'IN THE STEREO' : 'LOAD CD'}</span></button>` : `<div class="cd-pocket pocket-${slot} empty-pocket" aria-hidden="true"><span>More memories<br>to come.</span></div>`;
      }).join('');
      text('#binderPage',`${binderPage + 1} / ${pages}`); q('#binderPrev').disabled = binderPage === 0; q('#binderNext').disabled = binderPage === pages - 1;
    }
    function show() {
      const p = list[index]; selectedMusic = p.id;
      q('#loadedDiscArt').innerHTML = image(p.cover,`${p.title} CD artwork`,true);
      text('#discNumber',number(index)); text('#musicTitle',p.title); text('#stereoTrack',p.title); text('#musicTheme',p.subtitle || '2Fly Keith Logan');
      text('#linerTitle',p.title); text('#linerDescription',p.description || ''); q('#musicError').hidden = true;
      q('#musicRelated').innerHTML = `${clipsFor(p).length ? '<a id="watchTape" href="#videos2" data-route="videos2">Find the VHS ↗</a>' : ''}${p.experience ? `<a href="${html(asset(p.experience))}">Step inside the playable ↗</a>` : ''}`;
      q('#watchTape')?.addEventListener('click',() => { selectedVideo = p.id; },{signal:controller.signal}); drawBinder(); sync();
    }
    async function play() {
      q('#musicError').hidden = true; if (!active() || a.error) loadProjectAudio(list[index],false);
      try { await a.play(); } catch (error) { if (controller.signal.aborted || error.name === 'AbortError') return; q('#musicError').textContent = 'The disc could not start. Press Play CD to try again, or choose another CD.'; q('#musicError').hidden = false; }
    }
    function select(next,start = false) {
      index = (next + list.length) % list.length; binderPage = Math.floor(index / 4); a.pause();
      if (!active()) loadProjectAudio(list[index],false); show(); if (start) play();
    }
    on(q('#binderPockets'),'click',e => { const b = e.target.closest('[data-disc]'); if (b) { const next = Number(b.dataset.disc); select(next,!a.paused); q(`[data-disc="${next}"]`)?.focus({preventScroll:true}); } });
    on(q('#binderPrev'),'click',() => { binderPage = Math.max(0,binderPage - 1); drawBinder(); });
    on(q('#binderNext'),'click',() => { binderPage = Math.min(pages - 1,binderPage + 1); drawBinder(); });
    on(q('#musicPrev'),'click',() => select(index - 1,true)); on(q('#musicNext'),'click',() => select(index + 1,true));
    on(q('#musicPlay'),'click',() => active() && !a.paused ? a.pause() : play());
    on(q('#musicSeek'),'input',e => { if (active() && Number.isFinite(a.duration)) a.currentTime = Number(e.target.value) * a.duration / 100; });
    on(q('#musicVolume'),'input',e => { a.volume = Number(e.target.value); q('#playerVolume').value = a.volume; savePlayer(); });
    ['play','pause','timeupdate','loadedmetadata','durationchange','volumechange'].forEach(event => on(a,event,sync));
    on(a,'error',() => { q('#musicError').textContent = 'This disc could not load. Try Play CD again or choose another disc.'; q('#musicError').hidden = false; sync(); });
    const previousEnded = a.onended; a.onended = () => select(index + 1,true);
    dispose = () => { controller.abort(); a.onended = previousEnded; }; show();
  }
  function videos() {
    audio().pause(); const list = app.projects.filter(p => clipsFor(p).length); if (!list.length) return empty('Video');
    const {controller,on} = events(); let index = Math.max(0,list.findIndex(p => p.id === selectedVideo)), chapter = 0, loaded = true;
    q('#appView').innerHTML = `<section class="room-page room-video-page">
      <header class="room-heading"><div><p class="room-eyebrow">2FLY AFTER HOURS / THE VHS ROOM</p><h1>Be kind. Rewind.</h1></div><p>Pick a tape. Settle into the couch.<br>There's a story worth staying for.</p></header>
      <div class="video-layout"><section class="tv-station" aria-label="Floor console television and VHS player"><div class="tv-scene">${plate('vhs-room','Old-school walnut floor television, VHS player and cassette tapes in a warm living room')}
        <div class="crt-window"><video id="roomVideo" playsinline preload="none" aria-label="2Fly television"></video><div class="crt-glass" aria-hidden="true"></div><button type="button" class="crt-start" id="screenPlay"><span>▶</span><strong>PRESS PLAY</strong></button><div class="crt-osd-room" aria-hidden="true"><span id="tvChannel">CH 01</span><span id="tvMode">READY</span></div></div>
        <div class="room-scene-caption"><span>2FLY HOME VIDEO</span><span>VHS · HI-FI STEREO</span></div></div>
        <div class="vcr-remote"><div class="vcr-readout"><span class="hardware-label">TAPE LOADED</span><strong id="tapeTitle"></strong><span id="videoStatus" class="room-status" role="status">READY</span></div>
        <div class="vcr-buttons"><button type="button" id="videoRewind" aria-label="Rewind 10 seconds"><b>⏪</b><span>−10 SEC</span></button><button type="button" id="videoPlay" class="hardware-play"><b>▶</b><span>PLAY</span></button><button type="button" id="videoStop"><b>■</b><span>STOP</span></button><button type="button" id="videoForward" aria-label="Forward 10 seconds"><b>⏩</b><span>+10 SEC</span></button><button type="button" id="videoEject"><b>⏏</b><span>EJECT</span></button></div>
        <div class="room-progress"><label for="videoSeek">TAPE POSITION</label><input id="videoSeek" type="range" min="0" max="100" step=".1" value="0" disabled><div><span id="videoElapsed">0:00</span><span id="videoDuration">0:00</span></div></div>
        <div class="vcr-bottom"><label for="videoVolume">VOLUME <input id="videoVolume" type="range" min="0" max="1" step=".01" value=".75"></label><button type="button" id="videoFullscreen">⛶ Full screen</button></div><p id="videoError" class="room-error" role="status" hidden></p></div>
      </section><aside class="tape-cabinet" aria-labelledby="tapeShelfTitle"><div class="tape-shelf-heading"><div><p class="room-eyebrow">THE HOME COLLECTION</p><h2 id="tapeShelfTitle">Pull up a tape.</h2></div><span>${number(list.length - 1)} VHS</span></div>
      <div class="vhs-collection">${list.map((p,i) => `<button type="button" class="room-tape" data-tape="${i}" aria-label="Load ${html(p.title)} VHS" aria-pressed="false"><span class="cassette-screws" aria-hidden="true"></span><span class="room-cassette-label"><span>${image(p.cover,'')}<strong>${html(p.title)}</strong></span><small>2FLY HOME VIDEO · ${clipsFor(p).length > 1 ? `${clipsFor(p).length} CHAPTERS` : 'VISUAL STORY'}</small></span><span class="room-cassette-window" aria-hidden="true"><i></i><span>VHS</span><i></i></span><span class="cassette-foot"><span>HI-FI · STEREO</span><span class="tape-loaded-label">INSERT TAPE ↗</span></span></button>`).join('')}</div></aside></div>
      <section class="tape-insert"><div><p class="room-eyebrow">INSIDE THE TAPE CASE</p><h2 id="filmProject"></h2><p id="filmStory"></p><a href="#music2" data-route="music2" id="hearCD">Put on the CD ↗</a></div><div><div class="chapter-heading"><span>SCENE SELECTION</span><span id="sceneCount"></span></div><div class="room-chapters" id="roomChapters" aria-label="Choose a video chapter"></div></div></section>${footer}</section>`;
    const v = q('#roomVideo'), error = q('#videoError'); v.volume = .75;
    function sync() {
      const playing = !v.paused && loaded; q('.tv-scene').classList.toggle('is-playing',playing); q('#screenPlay').hidden = playing;
      text('#screenPlay strong',!loaded ? 'INSERT A TAPE' : v.ended ? 'PLAY AGAIN' : 'PRESS PLAY');
      text('#videoPlay b',playing ? 'Ⅱ' : '▶'); text('#videoPlay span',playing ? 'PAUSE' : 'PLAY'); q('#videoPlay').setAttribute('aria-label',playing ? 'Pause video' : 'Play video');
      const status = !loaded ? 'EJECTED' : v.error ? 'CHECK TAPE' : playing ? 'PLAYING' : v.ended ? 'ENDED' : v.currentTime > 0 ? 'PAUSED' : 'READY';
      text('#videoStatus',status); text('#tvMode',status); q('#videoStatus').classList.toggle('is-on',playing);
      const duration = loaded && Number.isFinite(v.duration) && v.duration > 0 ? v.duration : 0;
      q('#videoSeek').disabled = !duration; q('#videoSeek').value = duration ? v.currentTime / duration * 100 : 0;
      text('#videoElapsed',time(v.currentTime)); text('#videoDuration',time(duration)); q('#videoVolume').value = v.muted ? 0 : v.volume;
    }
    async function start() {
      error.hidden = true; if (!loaded || v.error) selectChapter(chapter);
      try { await v.play(); } catch (reason) { if (controller.signal.aborted || reason.name === 'AbortError') return; error.textContent = 'The tape could not start. Press Play to retry, or choose another tape.'; error.hidden = false; }
    }
    function selectChapter(next,autoplay = false) {
      chapter = next; loaded = true; const p = list[index], clip = clipsFor(p)[chapter];
      v.pause(); v.poster = asset(clip.poster || p.poster || p.cover); v.src = asset(clip.src); v.load(); v.setAttribute('aria-label',clip.title || p.title);
      text('#tapeTitle',clip.title || p.title); text('#tvChannel',`CH ${number(index)}`); error.hidden = true;
      document.querySelectorAll('[data-scene]').forEach(b => b.setAttribute('aria-pressed',String(Number(b.dataset.scene) === chapter)));
      document.querySelectorAll('[data-tape]').forEach(b => { const selected = Number(b.dataset.tape) === index; b.setAttribute('aria-pressed',String(selected)); b.querySelector('.tape-loaded-label').textContent = selected ? 'IN THE VCR' : 'INSERT TAPE ↗'; });
      sync(); if (autoplay) start();
    }
    function selectProject(next) {
      index = next; const p = list[index], clips = clipsFor(p); selectedVideo = p.id;
      text('#filmProject',p.title); text('#filmStory',p.story || p.description || ''); text('#sceneCount',`${clips.length} ${clips.length === 1 ? 'SCENE' : 'SCENES'}`);
      q('#roomChapters').innerHTML = clips.map((clip,i) => `<button type="button" data-scene="${i}" aria-pressed="false"><span>${number(i)}</span><strong>${html(clip.title || p.title)}</strong><b aria-hidden="true">▶</b></button>`).join(''); selectChapter(0);
    }
    on(q('.vhs-collection'),'click',e => { const b = e.target.closest('[data-tape]'); if (b) selectProject(Number(b.dataset.tape)); });
    on(q('#roomChapters'),'click',e => { const b = e.target.closest('[data-scene]'); if (b) selectChapter(Number(b.dataset.scene),true); });
    on(q('#screenPlay'),'click',start); on(q('#videoPlay'),'click',() => v.paused ? start() : v.pause());
    on(q('#videoStop'),'click',() => { v.pause(); if (Number.isFinite(v.duration)) v.currentTime = 0; sync(); });
    on(q('#videoRewind'),'click',() => { if (loaded && Number.isFinite(v.duration)) v.currentTime = Math.max(0,v.currentTime - 10); });
    on(q('#videoForward'),'click',() => { if (loaded && Number.isFinite(v.duration)) v.currentTime = Math.min(v.duration,v.currentTime + 10); });
    on(q('#videoEject'),'click',() => {
      v.pause(); loaded = false; v.removeAttribute('src'); v.removeAttribute('poster'); v.load(); text('#tapeTitle','No tape in the VCR');
      document.querySelectorAll('[data-tape]').forEach(b => { b.setAttribute('aria-pressed','false'); b.querySelector('.tape-loaded-label').textContent = 'INSERT TAPE ↗'; }); sync();
    });
    on(q('#videoSeek'),'input',e => { if (loaded && Number.isFinite(v.duration)) v.currentTime = Number(e.target.value) * v.duration / 100; });
    on(q('#videoVolume'),'input',e => { v.muted = false; v.volume = Number(e.target.value); });
    on(q('#videoFullscreen'),'click',async () => { try { if (v.requestFullscreen) await v.requestFullscreen(); else if (v.webkitEnterFullscreen) v.webkitEnterFullscreen(); else { v.controls = true; error.textContent = 'Use the video controls to expand the picture.'; error.hidden = false; } } catch { error.textContent = 'Full screen is unavailable here. You can still watch in the room.'; error.hidden = false; } });
    on(v,'fullscreenchange',() => { v.controls = document.fullscreenElement === v; });
    on(v,'play',() => audio().pause()); on(audio(),'play',() => v.pause());
    ['play','pause','timeupdate','loadedmetadata','durationchange','volumechange','ended'].forEach(event => on(v,event,sync));
    on(v,'error',() => { if (!loaded) return; error.textContent = 'This tape could not load. Press Play to retry, or select another VHS.'; error.hidden = false; sync(); });
    on(q('#hearCD'),'click',() => { selectedMusic = list[index].id; });
    dispose = () => { controller.abort(); v.pause(); v.removeAttribute('src'); v.load(); }; selectProject(index);
  }
  document.addEventListener('keydown',e => { const menu = q('.media-nav-options[open]'); if (e.key === 'Escape' && menu) { menu.open = false; menu.querySelector('summary').focus(); } });
  document.addEventListener('click',e => { const menu = q('.media-nav-options[open]'); if (menu && !menu.contains(e.target)) menu.open = false; });
  return {music,videos,cleanup() { dispose(); dispose = () => {}; }};
})();
