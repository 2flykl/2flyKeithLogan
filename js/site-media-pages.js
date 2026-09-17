/* Alternate media rooms. Catalog-driven, one active player, no animation loop. */
window.MediaPages = (() => {
  'use strict';
  let dispose = () => {};
  let selectedMusic = '';
  let selectedVideo = '';
  const q = selector => document.querySelector(selector);
  const html = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[char]));
  const number = value => String(value + 1).padStart(2, '0');
  const source = path => asset(path);
  const audio = () => q('#globalAudio');
  const clipsFor = project => (project.clips?.length ? project.clips : project.video ? [{title:project.title, src:project.video, poster:project.poster, type:'VISUAL STORY'}] : []).filter(clip => clip.src);
  const support = '<a class="mp-support" href="#support" data-route="support"><span>INDEPENDENT WORK. SHARED EXPERIENCE.</span><strong>Help 2Fly create what comes next <span aria-hidden="true">↗</span></strong></a>';

  function artwork(path, alt, eager = false) {
    return `<img src="${html(source(path))}" alt="${html(alt)}" width="640" height="640" loading="${eager ? 'eager' : 'lazy'}" decoding="async">`;
  }

  function empty(kind) {
    q('#appView').innerHTML = `<section class="mp-page"><h1>${kind} archive</h1><p>The catalog could not be loaded. Please reload the page to try again.</p></section>`;
  }

  function music() {
    const list = app.projects.filter(project => project.audio);
    if (!list.length) { empty('Music'); return; }
    const controller = new AbortController();
    const on = (element, event, handler) => element.addEventListener(event, handler, {signal:controller.signal});
    const a = audio();
    const playingIndex = list.findIndex(project => new URL(project.audio, location.href).href === a.src);
    const chosenIndex = list.findIndex(project => project.id === selectedMusic);
    let index = Math.max(0, chosenIndex >= 0 ? chosenIndex : playingIndex);
    q('#appView').innerHTML = `<section class="mp-page mp-music">
      <header class="mp-heading"><div><p class="mp-eyebrow">2FLY KEITH LOGAN / THE SOUND ARCHIVE</p><h1>Good music.<br><em>Your own tempo.</em></h1></div><p class="mp-intro">Choose a record. Stay for the story.<br>No algorithm deciding what plays next.</p></header>
      <div class="mp-listening-room">
        <div class="mp-sleeve"><div class="mp-sleeve-top"><span>2FLY / ORIGINAL RECORDINGS</span><span id="mpDiscNumber"></span></div><div class="mp-art" id="mpCover"></div><div class="mp-sleeve-bottom"><span>SELECT · LISTEN · STAY AWHILE</span><span aria-hidden="true">↗</span></div></div>
        <div class="mp-record"><p class="mp-eyebrow" id="mpMusicTheme"></p><h2 id="mpMusicTitle"></h2><p id="mpMusicDescription" class="mp-description"></p>
          <div class="mp-deck" aria-label="Music player"><div class="mp-deck-label"><span>THE LISTENING ROOM</span><span class="mp-led" id="mpPlaybackState" role="status">READY</span></div>
            <div class="mp-transport"><button type="button" id="mpPrevious" aria-label="Previous track">⏮</button><button type="button" id="mpPlay" class="mp-play">▶ Play record</button><button type="button" id="mpNext" aria-label="Next track">⏭</button></div>
            <label class="mp-sr" for="mpSeek">Track progress</label><input id="mpSeek" type="range" min="0" max="100" step="0.1" value="0" disabled><div class="mp-clock"><span id="mpElapsed">0:00</span><span id="mpDuration">0:00</span></div>
            <div class="mp-deck-foot"><span>2FLY KEITH LOGAN</span><label>Volume <input id="mpVolume" type="range" min="0" max="1" step=".01" value="${a.volume}"></label></div>
          </div>
          <p class="mp-error" id="mpAudioError" role="status" hidden></p><div class="mp-related" id="mpMusicRelated"></div>
        </div>
      </div>
      <section class="mp-catalog" aria-labelledby="mpCatalogTitle"><div class="mp-section-title"><div><p class="mp-eyebrow">THE COLLECTION</p><h2 id="mpCatalogTitle">Find your next listen.</h2></div><span>${number(list.length - 1)} RECORDS · YOUR CHOICE</span></div>
        <div class="mp-albums">${list.map((project, i) => `<button type="button" class="mp-album" data-record="${i}" aria-label="Select ${html(project.title)}" aria-pressed="false"><span class="mp-album-image">${artwork(project.cover, '')}<span class="mp-record-tag">${number(i)} / SELECT</span></span><strong>${html(project.title)}</strong><span>${html(project.word || '2Fly original')}</span></button>`).join('')}</div>
      </section>${support}</section>`;

    function active() { return new URL(list[index].audio, location.href).href === a.src; }
    function sync() {
      const loaded = active();
      const playing = loaded && !a.paused;
      q('#mpPlay').textContent = playing ? 'Ⅱ Pause record' : '▶ Play record';
      const label = a.error && loaded ? 'UNAVAILABLE' : playing ? 'PLAYING' : loaded && a.currentTime > 0 ? 'PAUSED' : 'READY';
      const state = q('#mpPlaybackState');
      if (state.textContent !== label) state.textContent = label;
      state.classList.toggle('is-playing', playing);
      q('#mpSeek').disabled = !loaded || !Number.isFinite(a.duration) || a.duration <= 0;
      q('#mpSeek').value = loaded && Number.isFinite(a.duration) && a.duration > 0 ? a.currentTime / a.duration * 100 : 0;
      q('#mpElapsed').textContent = time(loaded ? a.currentTime : 0);
      q('#mpDuration').textContent = time(loaded ? a.duration : 0);
      q('#mpVolume').value = a.volume;
    }
    function show() {
      const project = list[index];
      selectedMusic = project.id;
      q('#mpDiscNumber').textContent = `RECORD ${number(index)}`;
      q('#mpCover').innerHTML = artwork(project.cover, `${project.title} cover artwork`, true);
      q('#mpMusicTheme').textContent = `${project.word || 'ORIGINAL MUSIC'} / ${project.subtitle || '2FLY ORIGINAL'}`;
      q('#mpMusicTitle').textContent = project.title;
      q('#mpMusicDescription').textContent = project.description || '';
      q('#mpAudioError').hidden = true;
      q('#mpMusicRelated').innerHTML = `${clipsFor(project).length ? '<a href="#videos2" data-route="videos2" id="mpWatchStory">Watch the visual story ↗</a>' : ''}${project.experience ? `<a href="${html(source(project.experience))}">Enter the playable ↗</a>` : ''}`;
      q('#mpWatchStory')?.addEventListener('click', () => { selectedVideo = project.id; }, {signal:controller.signal});
      document.querySelectorAll('[data-record]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.record) === index)));
      sync();
    }
    async function play() {
      q('#mpAudioError').hidden = true;
      if (!active() || a.error) loadProjectAudio(list[index], false);
      try { await a.play(); }
      catch (error) {
        if (controller.signal.aborted || error.name === 'AbortError') return;
        q('#mpAudioError').textContent = 'Playback could not start. Press Play record to try again.';
        q('#mpAudioError').hidden = false;
      }
    }
    function select(next, start = false) {
      index = (next + list.length) % list.length;
      show();
      if (start) play();
    }
    on(q('.mp-albums'), 'click', event => {
      const button = event.target.closest('[data-record]');
      if (button) select(Number(button.dataset.record), !a.paused);
    });
    on(q('#mpPlay'), 'click', () => active() && !a.paused ? a.pause() : play());
    on(q('#mpPrevious'), 'click', () => select(index - 1, true));
    on(q('#mpNext'), 'click', () => select(index + 1, true));
    on(q('#mpSeek'), 'input', event => { if (active() && Number.isFinite(a.duration)) a.currentTime = Number(event.target.value) * a.duration / 100; });
    on(q('#mpVolume'), 'input', event => { a.volume = Number(event.target.value); q('#playerVolume').value = a.volume; savePlayer(); });
    ['play', 'pause', 'timeupdate', 'loadedmetadata', 'durationchange', 'volumechange'].forEach(event => on(a, event, sync));
    on(a, 'error', () => { q('#mpAudioError').textContent = 'This recording could not load. Try playing it again, or choose another record.'; q('#mpAudioError').hidden = false; sync(); });
    // Replace, then restore the shell handler: never advance two tracks on ended.
    const previousEnded = a.onended;
    a.onended = () => select(index + 1, true);
    dispose = () => { controller.abort(); a.onended = previousEnded; };
    show();
  }

  function videos() {
    audio().pause();
    const list = app.projects.filter(project => clipsFor(project).length);
    if (!list.length) { empty('Video'); return; }
    const controller = new AbortController();
    const on = (element, event, handler) => element.addEventListener(event, handler, {signal:controller.signal});
    let index = Math.max(0, list.findIndex(project => project.id === selectedVideo));
    let chapter = 0;
    q('#appView').innerHTML = `<section class="mp-page mp-videos">
      <header class="mp-heading"><div><p class="mp-eyebrow">2FLY KEITH LOGAN / THE SCREENING ROOM</p><h1>Press play.<br><em>See the whole story.</em></h1></div><p class="mp-intro">Music, moving images, and a different perspective.<br>A front-row seat to the 2Fly world.</p></header>
      <div class="mp-screening-room"><div class="mp-screen-main"><div class="mp-screen-label"><span><i aria-hidden="true"></i> 2FLY CINEMA</span><span id="mpFilmNumber"></span></div>
        <video id="mpVideo" controls playsinline preload="none" aria-label="Selected 2Fly film"></video>
        <div class="mp-film-caption"><div><p class="mp-eyebrow" id="mpFilmType"></p><h2 id="mpFilmTitle"></h2></div><button type="button" class="mp-replay" id="mpReplay">↺ Replay</button></div><p class="mp-error" id="mpVideoError" role="status" hidden></p>
      </div><aside class="mp-film-notes"><p class="mp-eyebrow">BEHIND THE PICTURE</p><h2 id="mpProjectTitle"></h2><p id="mpFilmDescription" class="mp-description"></p><div class="mp-chapter-header"><span id="mpChapterHeading">IN THIS PROJECT</span><span id="mpChapterCount"></span></div><div class="mp-chapters" id="mpChapters" aria-label="Select a chapter"></div><a href="#music2" data-route="music2" id="mpHearSoundtrack">Listen to the soundtrack ↗</a></aside></div>
      <section class="mp-catalog" aria-labelledby="mpVideoCatalogTitle"><div class="mp-section-title"><div><p class="mp-eyebrow">PICK YOUR NEXT PICTURE</p><h2 id="mpVideoCatalogTitle">The visual collection.</h2></div><label class="mp-filter">Show <select id="mpVideoFilter"><option value="all">All projects</option><option value="stories">Visual stories</option><option value="chapters">Documentary & chapters</option></select></label></div>
      <div class="mp-films">${list.map((project, i) => `<button type="button" class="mp-film" data-film="${i}" aria-label="Select ${html(project.title)}" aria-pressed="false"><span class="mp-film-image">${artwork(project.poster || project.cover, '')}<span class="mp-film-play" aria-hidden="true">▶</span><span class="mp-record-tag">${clipsFor(project).length > 1 ? `${clipsFor(project).length} CHAPTERS` : 'VISUAL STORY'}</span></span><strong>${html(project.title)}</strong><span>${html(project.subtitle || project.word || '')}</span></button>`).join('')}</div><p id="mpNoFilms" hidden>No projects match this filter.</p></section>${support}</section>`;
    const video = q('#mpVideo');
    const error = q('#mpVideoError');
    async function start() {
      error.hidden = true;
      try { await video.play(); }
      catch (reason) {
        if (controller.signal.aborted || reason.name === 'AbortError') return;
        error.textContent = 'Press Play in the video player to start. If it cannot load, try another film.';
        error.hidden = false;
      }
    }
    function selectChapter(next, autoplay = false) {
      const project = list[index];
      const clips = clipsFor(project);
      chapter = next;
      const clip = clips[chapter];
      video.pause();
      video.poster = source(clip.poster || project.poster || project.cover);
      video.src = source(clip.src);
      video.setAttribute('aria-label', clip.title || project.title);
      video.load();
      q('#mpFilmTitle').textContent = clip.title || project.title;
      q('#mpFilmType').textContent = `${clip.type || 'VISUAL STORY'} / ${number(chapter)} OF ${number(clips.length - 1)}`;
      q('#mpFilmNumber').textContent = `PROJECT ${number(index)} / ${number(list.length - 1)}`;
      document.querySelectorAll('[data-clip]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.clip) === chapter)));
      error.hidden = true;
      if (autoplay) start();
    }
    function selectProject(next) {
      index = next;
      const project = list[index];
      selectedVideo = project.id;
      const clips = clipsFor(project);
      q('#mpProjectTitle').textContent = project.title;
      q('#mpFilmDescription').textContent = project.story || project.description || '';
      q('#mpChapterCount').textContent = number(clips.length - 1);
      q('#mpChapters').innerHTML = clips.map((clip, i) => `<button type="button" data-clip="${i}" aria-pressed="false"><span>${number(i)}</span><strong>${html(clip.title || project.title)}</strong><span aria-hidden="true">▶</span></button>`).join('');
      document.querySelectorAll('[data-film]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.film) === index)));
      selectChapter(0);
    }
    on(q('.mp-films'), 'click', event => { const button = event.target.closest('[data-film]'); if (button) selectProject(Number(button.dataset.film)); });
    on(q('#mpChapters'), 'click', event => { const button = event.target.closest('[data-clip]'); if (button) selectChapter(Number(button.dataset.clip), true); });
    on(q('#mpReplay'), 'click', () => { if (video.error) video.load(); else video.currentTime = 0; start(); });
    on(q('#mpHearSoundtrack'), 'click', () => { selectedMusic = list[index].id; audio().pause(); });
    on(video, 'play', () => audio().pause());
    on(audio(), 'play', () => video.pause());
    on(video, 'error', () => { error.textContent = 'This film could not load. Choose another film, or press Replay to try again.'; error.hidden = false; });
    on(q('#mpVideoFilter'), 'change', event => {
      let visible = 0;
      document.querySelectorAll('[data-film]').forEach(button => {
        const multi = clipsFor(list[Number(button.dataset.film)]).length > 1;
        const show = event.target.value === 'all' || (event.target.value === 'chapters' ? multi : !multi);
        button.hidden = !show;
        if (show) visible++;
      });
      q('#mpNoFilms').hidden = visible > 0;
    });
    dispose = () => { controller.abort(); video.pause(); video.removeAttribute('src'); video.load(); };
    selectProject(index);
  }

  // Native disclosure works with touch and keyboard; Escape and outside click close it.
  document.addEventListener('keydown', event => {
    const menu = q('.media-nav-options[open]');
    if (event.key === 'Escape' && menu) { menu.open = false; menu.querySelector('summary').focus(); }
  });
  document.addEventListener('click', event => {
    const menu = q('.media-nav-options[open]');
    if (menu && !menu.contains(event.target)) menu.open = false;
  });
  return {music, videos, cleanup() { dispose(); dispose = () => {}; }};
})();
