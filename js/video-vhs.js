(() => {
  'use strict';

  const ROOT_ID = 'view-videos';
  const ACTIVE_IDS = ['streams', 'away', 'fire', 'africa'];
  const futureTapes = [
    ['notes-to-self','Notes to Self','OCT 23, 2026','A private reflection reel from the evolving 2Fly archive.'],
    ['bigger-tomorrow','A Bigger Tomorrow','NOV 13, 2026','A future visual journal about building beyond the current moment.'],
    ['same-higher-purpose','Same Higher Purpose','DEC 04, 2026','A visual note about purpose surviving changing rooms and seasons.'],
    ['the-journey','The Journey','JAN 15, 2027','A travel-and-reflection tape reserved for a future upload.'],
    ['built-different','Built Different','FEB 05, 2027','A future release exploring craft, independence, and process.'],
    ['more-to-life','More to Life','MAR 12, 2027','A future visual chapter about meaning beyond metrics.'],
    ['still-here','Still Here','APR 09, 2027','A future archive entry about endurance and presence.'],
    ['the-vision','The Vision','MAY 14, 2027','A future tape about the ideas behind the 2Fly platform.'],
    ['unreleased','Unreleased','JUN 11, 2027','A reserved slot for an unreleased visual experiment.'],
    ['behind-scenes','Behind the Scenes','JUL 09, 2027','Production-room footage and creative process notes.'],
    ['interviews','Interviews','AUG 06, 2027','Conversations and context from collaborators and guests.'],
    ['sessions','Sessions','SEP 10, 2027','Studio sessions, alternate takes, and works in progress.'],
    ['family','Family','OCT 08, 2027','A future personal archive chapter.'],
    ['2fly-universe','2FLY Universe','NOV 12, 2027','A future video portal connecting the larger 2Fly universe.']
  ].map(([id,title,date,description], index) => ({
    id, title, date, description, future: true, index
  }));

  let archive = [];
  let selected = null;
  let activeChapter = 0;
  let powered = true;
  let loadTimer = 0;
  let mounted = false;

  const q = (sel, root = document) => root.querySelector(sel);
  const qa = (sel, root = document) => [...root.querySelectorAll(sel)];
  const pad = n => String(n).padStart(2, '0');
  const safeText = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  function project(id) {
    try { return state.projects.find(item => item.id === id) || null; } catch (_) { return null; }
  }

  function playableTape(id) {
    const item = project(id);
    if (!item) return null;
    const chapters = (item.clips && item.clips.length ? item.clips : [{
      title: item.title,
      src: item.video,
      poster: item.poster || item.cover,
      type: 'VISUAL STORY'
    }]).filter(chapter => chapter.src);
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      word: item.word || 'VISUAL STORY',
      poster: item.poster || item.cover || '',
      chapters,
      future: false,
      project: item
    };
  }

  function renderShell() {
    const root = document.getElementById(ROOT_ID);
    if (!root) return false;
    root.innerHTML = `
      <section class="vhs-archive" aria-label="2Fly VHS Video Archive">
        <div class="vhs-workbench">
          <aside class="vhs-spine-library" aria-label="Video archive tapes">
            <div class="vhs-spine-heading"><span>VIDEO ARCHIVE</span><small>SELECT A TAPE</small></div>
            <div class="vhs-spine-stack" id="vhsSpineStack"></div>
          </aside>

          <div class="vhs-center-stage">
            <div class="crt-console" id="crtConsole">
              <div class="crt-bezel">
                <div class="crt-screen" id="crtScreen" data-mode="idle">
                  <video id="vhsVideo" playsinline preload="metadata"></video>
                  <div class="crt-poster" id="crtPoster" aria-hidden="true"></div>
                  <div class="crt-idle" id="crtIdle" aria-live="polite">
                    <div class="crt-idle-top"><span>2FLY VIDEO</span><span>CH 03</span></div>
                    <div class="crt-idle-message"><b>▶</b><span>INSERT TAPE</span></div>
                    <div class="crt-idle-bottom"><span>SP</span><span>--:--</span></div>
                  </div>
                  <div class="crt-osd" id="crtOsd" aria-live="polite"></div>
                  <div class="crt-scanlines" aria-hidden="true"></div>
                  <div class="crt-glass" aria-hidden="true"></div>
                </div>
                <div class="tv-controls" aria-label="Television controls">
                  <div class="tv-brand">2FLY</div>
                  <div class="tv-control-group">
                    <span>CHANNEL</span><div class="tv-dial channel-dial" aria-hidden="true"><i></i></div>
                  </div>
                  <div class="tv-control-group">
                    <label for="tvVolume">VOLUME <output id="tvVolumeOut">75</output></label>
                    <input id="tvVolume" class="tv-volume-range" type="range" min="0" max="1" step="0.05" value="0.75" aria-label="Television volume">
                    <div class="tv-dial volume-dial" id="tvVolumeDial" aria-hidden="true"><i></i></div>
                  </div>
                  <button class="tv-power" id="tvPower" type="button" aria-pressed="true"><i></i><span>POWER</span></button>
                </div>
              </div>

              <div class="vcr-deck" aria-label="2Fly video cassette recorder">
                <div class="vcr-brand">2FLY <small>4 HEAD · HI-FI STEREO</small></div>
                <div class="vcr-slot" aria-hidden="true"></div>
                <div class="vcr-row">
                  <button type="button" data-vcr="eject"><span>▲</span>EJECT</button>
                  <div class="vcr-display" id="vcrDisplay" data-idle="true" aria-live="polite">12:00</div>
                  <button type="button" data-vcr="rew"><span>◀◀</span>REW</button>
                  <button type="button" data-vcr="play" class="vcr-play"><span>▶</span>PLAY</button>
                  <button type="button" data-vcr="stop"><span>■</span>STOP</button>
                  <button type="button" data-vcr="pause"><span>Ⅱ</span>PAUSE</button>
                  <button type="button" data-vcr="ff"><span>▶▶</span>FF</button>
                </div>
              </div>
            </div>
          </div>

          <aside class="vhs-hud" id="vhsHud" aria-live="polite"></aside>
        </div>

        <div class="featured-tape-table" aria-label="Featured video tapes">
          <div class="featured-table-label"><span>FEATURED TAPES</span><small>REAL VIDEOS · CLICK TO LOAD</small></div>
          <div class="featured-tapes" id="featuredTapes"></div>
        </div>
      </section>`;
    return true;
  }

  function tapeMarkup(item, index, kind) {
    const title = safeText(item.title);
    if (kind === 'spine') {
      return `<button type="button" class="vhs-spine tape-wear-${index % 4}" data-tape-id="${safeText(item.id)}" style="--offset:${[-7,3,-2,8,-4,5,0][index % 7]}px;--tilt:${[-.35,.22,-.12,.3,-.22,.12,0][index % 7]}deg" aria-label="Select ${title}"><span class="spine-grip"></span><b>${title}</b><i></i></button>`;
    }
    return `<button type="button" class="vhs-cassette feature-pos-${index}" data-tape-id="${safeText(item.id)}" aria-label="Load ${title}">
      <span class="vhs-window left"></span><span class="vhs-window right"></span>
      <span class="vhs-label">${title}</span><span class="vhs-notch"></span>
    </button>`;
  }

  function buildTapeLibraries() {
    const featured = ACTIVE_IDS.map(playableTape).filter(Boolean);
    archive = [...featured, ...futureTapes];
    q('#vhsSpineStack').innerHTML = archive.map((item, index) => tapeMarkup(item, index, 'spine')).join('');
    q('#featuredTapes').innerHTML = featured.map((item, index) => tapeMarkup(item, index, 'featured')).join('');
    qa('[data-tape-id]').forEach(button => {
      const id = button.dataset.tapeId;
      button.addEventListener('mouseenter', () => previewTape(id));
      button.addEventListener('focus', () => previewTape(id));
      button.addEventListener('mouseleave', restoreAfterPreview);
      button.addEventListener('blur', restoreAfterPreview);
      button.addEventListener('click', () => loadTape(id));
    });
  }

  function itemFor(id) { return archive.find(item => item.id === id) || null; }

  function setSelectedClasses(id) {
    qa('[data-tape-id]').forEach(button => button.classList.toggle('selected', button.dataset.tapeId === id));
  }

  function setVcrDisplay(text, idle = false) {
    const display = q('#vcrDisplay');
    if (!display) return;
    display.textContent = text;
    display.dataset.idle = String(idle);
  }

  function setScreenMode(mode, item = null, chapter = null) {
    const screen = q('#crtScreen');
    const poster = q('#crtPoster');
    const idle = q('#crtIdle');
    const video = q('#vhsVideo');
    if (!screen || !powered) return;
    screen.dataset.mode = mode;
    if (mode === 'idle') {
      poster.style.backgroundImage = '';
      idle.hidden = false;
      video.hidden = true;
      video.removeAttribute('src');
      video.load();
    } else if (mode === 'preview' || mode === 'loaded') {
      const image = chapter?.poster || item?.poster || '';
      poster.style.backgroundImage = image ? `url("${image.replace(/"/g, '%22')}")` : '';
      idle.hidden = true;
      video.hidden = true;
    } else if (mode === 'playing' || mode === 'paused') {
      idle.hidden = true;
      video.hidden = false;
    }
  }

  function flashOsd(text, ms = 900) {
    const osd = q('#crtOsd');
    if (!osd || !powered) return;
    osd.textContent = text;
    osd.classList.add('show');
    clearTimeout(osd._timer);
    osd._timer = setTimeout(() => osd.classList.remove('show'), ms);
  }

  function previewTape(id) {
    const item = itemFor(id);
    if (!item || selected?.id === id || !powered) return;
    renderHud(item, true);
    if (item.future) {
      if (selected) return;
      setScreenMode('idle');
      q('#crtIdle .crt-idle-message span').textContent = 'ARCHIVE PREVIEW';
    } else {
      if (selected) return;
      const chapter = item.chapters[0];
      setScreenMode('preview', item, chapter);
      flashOsd(`${item.title.toUpperCase()} · PREVIEW`, 700);
    }
  }

  function restoreAfterPreview() {
    if (selected) {
      renderHud(selected, false);
      if (selected.future) {
        if (powered) {
          setScreenMode('idle');
          const message = q('#crtIdle .crt-idle-message span');
          if (message) message.textContent = 'TAPE NOT RELEASED';
        }
      } else if (powered && q('#vhsVideo')?.paused) {
        setScreenMode('loaded', selected, selected.chapters[activeChapter]);
      }
      return;
    }
    renderHud(null, false);
    resetIdle();
  }

  function loadTape(id) {
    const item = itemFor(id);
    if (!item) return;
    clearTimeout(loadTimer);
    q('#vhsVideo')?.pause();
    selected = item;
    activeChapter = 0;
    setSelectedClasses(id);
    renderHud(item, false);
    if (!powered) togglePower(true);

    if (item.future) {
      setVcrDisplay('SOON');
      setScreenMode('idle');
      q('#crtIdle .crt-idle-message span').textContent = 'TAPE NOT RELEASED';
      flashOsd(`SCHEDULED ${item.date}`, 1500);
      return;
    }

    setVcrDisplay('LOAD');
    q('#crtScreen').classList.add('tracking');
    flashOsd('LOADING TAPE', 650);
    loadTimer = setTimeout(() => {
      q('#crtScreen').classList.remove('tracking');
      setVcrDisplay('STOP');
      prepareChapter(0, false);
    }, 650);
  }

  function prepareChapter(index, autoplay = false) {
    if (!selected || selected.future || !selected.chapters.length) return;
    activeChapter = (index + selected.chapters.length) % selected.chapters.length;
    const chapter = selected.chapters[activeChapter];
    const video = q('#vhsVideo');
    video.pause();
    video.src = chapter.src;
    video.poster = chapter.poster || selected.poster || '';
    video.load();
    setScreenMode('loaded', selected, chapter);
    setVcrDisplay('STOP');
    renderHud(selected, false);
    flashOsd(`CH ${pad(activeChapter + 1)} · ${chapter.title.toUpperCase()}`, 1100);
    if (autoplay) playVideo();
  }

  function playVideo() {
    if (!selected || selected.future) {
      flashOsd(selected?.future ? `AVAILABLE ${selected.date}` : 'INSERT TAPE');
      return;
    }
    const video = q('#vhsVideo');
    if (!video.src) prepareChapter(activeChapter, false);
    try { stopAll(video); } catch (_) {}
    video.play().catch(() => flashOsd('PRESS PLAY AGAIN'));
  }

  function stopVideo() {
    const video = q('#vhsVideo');
    if (!video || !selected || selected.future) return;
    video.pause();
    video.currentTime = 0;
    setScreenMode('loaded', selected, selected.chapters[activeChapter]);
    setVcrDisplay('STOP');
    flashOsd('STOP');
  }

  function pauseVideo() {
    const video = q('#vhsVideo');
    if (!video || !selected || selected.future) return;
    if (video.paused) playVideo(); else video.pause();
  }

  function seek(delta) {
    const video = q('#vhsVideo');
    if (!video || !selected || selected.future || !Number.isFinite(video.duration)) return;
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + delta));
    flashOsd(delta < 0 ? '◀◀ REW' : 'FF ▶▶', 550);
  }

  function ejectTape() {
    clearTimeout(loadTimer);
    const video = q('#vhsVideo');
    if (video) { video.pause(); video.removeAttribute('src'); video.load(); }
    selected = null;
    activeChapter = 0;
    setSelectedClasses('');
    q('#crtScreen')?.classList.add('tracking');
    setVcrDisplay('EJCT');
    renderHud(null, false);
    flashOsd('EJECT', 500);
    setTimeout(() => {
      q('#crtScreen')?.classList.remove('tracking');
      resetIdle();
    }, 520);
  }

  function resetIdle() {
    setVcrDisplay('12:00', true);
    const message = q('#crtIdle .crt-idle-message span');
    if (message) message.textContent = 'INSERT TAPE';
    if (powered) setScreenMode('idle');
  }

  function togglePower(forceOn) {
    powered = typeof forceOn === 'boolean' ? forceOn : !powered;
    const screen = q('#crtScreen');
    const power = q('#tvPower');
    if (!screen || !power) return;
    power.setAttribute('aria-pressed', String(powered));
    screen.classList.toggle('powered-off', !powered);
    if (!powered) {
      q('#vhsVideo')?.pause();
      setVcrDisplay(selected ? 'STOP' : '12:00', !selected);
    } else if (selected && !selected.future) {
      setScreenMode('loaded', selected, selected.chapters[activeChapter]);
      flashOsd('POWER ON');
    } else {
      resetIdle();
    }
  }

  function renderHud(item, preview) {
    const hud = q('#vhsHud');
    if (!hud) return;
    if (!item) {
      hud.innerHTML = `
        <div class="hud-kicker">VIDEO ARCHIVE</div>
        <h2>SELECT A TAPE</h2>
        <p>Choose a VHS from the archive or the featured table. Load it into the deck, choose a chapter, then use the VCR controls.</p>
        <div class="hud-status"><span>DECK</span><strong>READY</strong></div>
        <div class="hud-rule"></div>
        <small>REAL PEOPLE. REAL PLACES.<br>A HIGHER PERSPECTIVE.</small>`;
      return;
    }
    if (item.future) {
      hud.innerHTML = `
        <div class="hud-kicker">${preview ? 'ARCHIVE PREVIEW' : 'COMING SOON'}</div>
        <h2>${safeText(item.title)}</h2>
        <div class="hud-meta">FUTURE RELEASE · VHS ARCHIVE</div>
        <p>${safeText(item.description)}</p>
        <div class="future-date"><span>SCHEDULED UPLOAD</span><strong>${safeText(item.date)}</strong><small>FICTITIOUS PREVIEW DATE · SUBJECT TO CHANGE</small></div>
        <button class="hud-primary" type="button" disabled>NOT YET AVAILABLE</button>
        <div class="hud-rule"></div><small>THIS SLOT IS READY FOR MEDIA WHEN THE RELEASE ARRIVES.</small>`;
      return;
    }
    const chapterButtons = item.chapters.map((chapter, index) => `
      <button type="button" class="hud-chapter ${index === activeChapter ? 'active' : ''}" data-chapter-index="${index}">
        <span>${pad(index + 1)}</span><b>${safeText(chapter.title)}</b><em>${safeText(chapter.type || 'CHAPTER')}</em>
      </button>`).join('');
    hud.innerHTML = `
      <div class="hud-kicker">${preview ? 'TAPE PREVIEW' : 'NOW LOADED'}</div>
      <h2>${safeText(item.title)}</h2>
      <div class="hud-meta">${safeText(item.word)} · ${pad(item.chapters.length)} ${item.chapters.length === 1 ? 'CHAPTER' : 'CHAPTERS'}</div>
      <p>${safeText(item.description)}</p>
      <div class="hud-chapters" aria-label="${safeText(item.title)} chapters">${chapterButtons}</div>
      <button class="hud-primary" id="hudPlay" type="button">▶ ${preview ? 'LOAD & PLAY' : 'PLAY CHAPTER'}</button>
      <div class="hud-rule"></div><small>USE THE PHYSICAL VCR CONTROLS OR CHOOSE A CHAPTER ABOVE.</small>`;
    qa('[data-chapter-index]', hud).forEach(button => button.addEventListener('click', () => {
      if (selected?.id !== item.id) selected = item;
      setSelectedClasses(item.id);
      prepareChapter(+button.dataset.chapterIndex, false);
    }));
    q('#hudPlay', hud)?.addEventListener('click', () => {
      const alreadyLoaded = selected?.id === item.id;
      if (!alreadyLoaded) loadTape(item.id);
      setTimeout(playVideo, alreadyLoaded ? 0 : 720);
    });
  }

  function bindControls() {
    qa('[data-vcr]').forEach(button => button.addEventListener('click', () => {
      const action = button.dataset.vcr;
      if (action === 'eject') ejectTape();
      if (action === 'rew') seek(-10);
      if (action === 'play') playVideo();
      if (action === 'stop') stopVideo();
      if (action === 'pause') pauseVideo();
      if (action === 'ff') seek(10);
    }));
    q('#tvPower')?.addEventListener('click', () => togglePower());
    q('#tvVolume')?.addEventListener('input', event => {
      const value = Math.max(0, Math.min(1, Number(event.target.value) || 0));
      const video = q('#vhsVideo');
      if (video) video.volume = value;
      q('#tvVolumeOut').textContent = Math.round(value * 100);
      q('#tvVolumeDial')?.style.setProperty('--volume-turn', `${-125 + value * 250}deg`);
    });

    const video = q('#vhsVideo');
    video.volume = 0.75;
    video.addEventListener('play', () => {
      setScreenMode('playing');
      setVcrDisplay('PLAY');
      flashOsd('PLAY', 500);
    });
    video.addEventListener('pause', () => {
      if (!video.ended && selected && video.currentTime > 0) {
        q('#crtScreen').dataset.mode = 'paused';
        setVcrDisplay('PAUS');
        flashOsd('PAUSE', 450);
      }
    });
    video.addEventListener('timeupdate', () => {
      if (!video.paused && Number.isFinite(video.currentTime)) setVcrDisplay(formatClock(video.currentTime));
    });
    video.addEventListener('ended', () => {
      if (!selected) return;
      if (activeChapter < selected.chapters.length - 1) prepareChapter(activeChapter + 1, true);
      else stopVideo();
    });
    video.addEventListener('error', () => {
      if (!video.currentSrc) return;
      setVcrDisplay('ERR');
      flashOsd('VIDEO UNAVAILABLE', 1600);
    });
  }

  function formatClock(seconds) {
    const total = Math.max(0, Math.floor(seconds || 0));
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const secs = total % 60;
    return hours ? `${hours}:${pad(minutes)}:${pad(secs)}` : `${pad(minutes)}:${pad(secs)}`;
  }

  function mount() {
    if (mounted) return;
    let ready = false;
    try { ready = !!(state && Array.isArray(state.projects) && state.projects.length); } catch (_) {}
    if (!ready) return;
    if (!renderShell()) return;
    mounted = true;
    buildTapeLibraries();
    bindControls();
    renderHud(null, false);
    resetIdle();
    q('#tvVolumeDial')?.style.setProperty('--volume-turn', '62.5deg');
    document.body.classList.add('vhs-video-enabled');
  }

  function boot() {
    mount();
    if (!mounted) {
      let attempts = 0;
      const timer = setInterval(() => {
        attempts += 1;
        mount();
        if (mounted || attempts > 100) clearInterval(timer);
      }, 50);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
