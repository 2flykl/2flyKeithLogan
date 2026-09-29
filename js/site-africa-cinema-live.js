const main = document.querySelector('#main');

const scenes = [
  {
    title: 'The Introduction',
    subtitle: 'The journey begins with a question.',
    label: 'Chapter one',
    src: 'https://video.wixstatic.com/video/85e419_d1023bd1a591485aac6da0ca76c18ab6/1080p/mp4/file.mp4',
    poster: 'https://static.wixstatic.com/media/85e419_d1023bd1a591485aac6da0ca76c18ab6f001.jpg'
  },
  {
    title: 'The School',
    subtitle: 'Service begins by listening.',
    label: 'Chapter two',
    src: 'https://video.wixstatic.com/video/85e419_c28808e63cc446c5b167d3079ec65e9d/1080p/mp4/file.mp4',
    poster: 'https://static.wixstatic.com/media/85e419_c28808e63cc446c5b167d3079ec65e9df001.jpg'
  },
  {
    title: 'The Greeting',
    subtitle: 'Connection crosses the distance first.',
    label: 'Chapter three',
    src: 'https://video.wixstatic.com/video/85e419_181925da5f194738bc4946b0d7b20bff/1080p/mp4/file.mp4',
    poster: 'https://static.wixstatic.com/media/85e419_181925da5f194738bc4946b0d7b20bfff001.jpg'
  },
  {
    title: 'The Land of 1000 Hills',
    subtitle: 'Landscape becomes memory, scale, and perspective.',
    label: 'Chapter four',
    src: 'https://video.wixstatic.com/video/85e419_6b353e95cf4e467882c9c09e42991993/1080p/mp4/file.mp4',
    poster: 'https://static.wixstatic.com/media/85e419_6b353e95cf4e467882c9c09e42991993f001.jpg'
  },
  {
    title: 'The Village',
    subtitle: 'Community turns a visit into an exchange.',
    label: 'Chapter five',
    src: 'https://video.wixstatic.com/video/85e419_408ccbdd51b84ff0ba4b6ac769bd47f1/1080p/mp4/file.mp4',
    poster: 'https://static.wixstatic.com/media/85e419_408ccbdd51b84ff0ba4b6ac769bd47f1f001.jpg'
  },
  {
    title: 'The Hard Work',
    subtitle: 'Purpose becomes visible through effort.',
    label: 'Chapter six',
    src: 'https://video.wixstatic.com/video/85e419_47659dfd4e164628ac014cc249a56deb/1080p/mp4/file.mp4',
    poster: 'https://static.wixstatic.com/media/85e419_47659dfd4e164628ac014cc249a56debf001.jpg'
  },
  {
    title: 'The Banana Crown',
    subtitle: 'Joy and play carry their own kind of truth.',
    label: 'Chapter seven',
    src: 'https://video.wixstatic.com/video/85e419_13fa53150986436496d580f658c13ee5/1080p/mp4/file.mp4',
    poster: 'https://static.wixstatic.com/media/85e419_13fa53150986436496d580f658c13ee5f001.jpg'
  },
  {
    title: 'The Food',
    subtitle: 'A table becomes a place of welcome.',
    label: 'Chapter eight',
    src: 'https://video.wixstatic.com/video/85e419_247a9878bd50470687d77d4ae31a4d9f/1080p/mp4/file.mp4',
    poster: 'https://static.wixstatic.com/media/85e419_247a9878bd50470687d77d4ae31a4d9ff001.jpg'
  },
  {
    title: 'The Conclusion',
    subtitle: 'What changed after Africa?',
    label: 'Chapter nine',
    src: 'https://video.wixstatic.com/video/85e419_275598f2210c4d55a99beb819d5bc24a/1080p/mp4/file.mp4',
    poster: 'https://static.wixstatic.com/media/85e419_275598f2210c4d55a99beb819d5bc24af001.jpg'
  },
  {
    title: 'The Music Video',
    subtitle: 'The reflection continues through music.',
    label: 'Finale',
    src: 'https://video.wixstatic.com/video/85e419_391c04639be946c3aa158c986ca5cce9/1080p/mp4/file.mp4',
    poster: 'https://static.wixstatic.com/media/85e419_391c04639be946c3aa158c986ca5cce9f001.jpg'
  }
];

const marqueeUnit = `
  <span class="title-unit">
    <strong>I Woke Up in Africa</strong>
    <small>A documentary by Keith Logan</small>
  </span>`;

main.innerHTML = `
  <section class="experience" aria-label="I Woke Up in Africa screening room">
    <div class="living-bg" aria-hidden="true"><span class="wall-canopy canopy-left"></span><span class="wall-canopy canopy-right"></span><span class="wall-mist"></span></div>
    <div class="grain" aria-hidden="true"></div>

    <header class="topbar">
      <a class="brand" href="site-overhaul.html#home" aria-label="Return to 2Fly Keith Logan"><strong>2FLY</strong><span>KEITH LOGAN<br>A FILM EXPERIENCE</span></a>
      <div class="title-marquee" aria-label="I Woke Up in Africa — A documentary by Keith Logan">
        <div class="title-track">${marqueeUnit}${marqueeUnit}${marqueeUnit}${marqueeUnit}</div>
      </div>
      <a class="help-action" href="https://buy.stripe.com/cNi3cx2NGaN53rk1HG0Fi00" target="_blank" rel="noopener noreferrer">Help 2FLY Create <span aria-hidden="true">→</span></a>
    </header>

    <section class="film-area" aria-label="Featured presentation">
      <aside class="insight-panel scene-insight" id="scene-insight" aria-live="polite">
        <span class="panel-kicker">Inside the scene</span>
        <h2 id="insight-title">The central question</h2>
        <p id="insight-copy"></p>
        <span class="panel-pulse" aria-hidden="true"></span>
      </aside>

      <div class="film-frame" id="film-frame">
        <div class="film-image" aria-hidden="true"></div>
        <video id="presentation-video" playsinline preload="metadata"></video>
        <div class="film-shade" aria-hidden="true"></div>
        <div class="screen-label" id="screen-label">Chapter one</div>
        <div class="concept-badge">Private screening · 10 chapters</div>
        <button class="play-main" id="play-main" aria-label="Play The Introduction"><span aria-hidden="true">▶</span></button>
        <div class="scene-copy" aria-live="polite"><h1 id="scene-title">The Introduction</h1><p id="scene-subtitle">The journey begins with a question.</p></div>
        <div class="player-controls" aria-label="Presentation controls">
          <button class="control-icon" id="play-toggle" aria-label="Play presentation">▶</button>
          <label class="timeline" aria-label="Presentation timeline"><input id="video-seek" type="range" min="0" max="100" step="0.1" value="0"></label>
          <span class="timecode" id="timecode">00:00 / —:—</span>
          <button class="control-icon video-mute" id="video-mute" aria-label="Mute presentation">◖</button>
          <button class="control-icon fullscreen" aria-label="Enter fullscreen">⛶</button>
        </div>
        <p class="media-error" id="media-error" role="status" hidden>This chapter could not be loaded. Choose another scene or try again.</p>
      </div>

      <aside class="insight-panel rwanda-insight" id="rwanda-insight" aria-live="polite">
        <span class="panel-kicker">Rwanda, in context</span>
        <h2 id="fact-title">A country of elevation</h2>
        <p id="fact-copy"></p>
        <a class="panel-source" id="fact-source" target="_blank" rel="noopener noreferrer" tabindex="-1"></a>
        <span class="panel-pulse" aria-hidden="true"></span>
      </aside>
    </section>

    <nav class="scene-dock" aria-label="Documentary scenes">
      <div class="dock-title"><strong>Scenes</strong><span>Choose a chapter</span></div>
      <div class="scene-rail">
        <button class="rail-arrow previous" aria-label="Previous scene">‹</button>
        <div class="scene-strip" role="tablist" aria-label="Scenes">
          ${scenes.map((scene, index) => `<button class="scene-card" role="tab" aria-selected="${index === 0}" aria-controls="film-frame" data-scene="${index}"><img src="${scene.poster}" alt="" loading="lazy"><span class="number">${String(index + 1).padStart(2, '0')}</span><span class="name">${scene.title}</span></button>`).join('')}
        </div>
        <button class="rail-arrow next" aria-label="Next scene">›</button>
      </div>
      <div class="film-meta"><div><span>Location</span><strong>Rwanda</strong></div><div><span>Format</span><strong>Documentary</strong></div></div>
    </nav>
  </section>

  <div class="threshold" role="dialog" aria-modal="true" aria-labelledby="threshold-title">
    <div class="curtain left"></div><div class="curtain right"></div>
    <div class="threshold-content"><div class="ticket-mark" aria-hidden="true">KL</div><p class="presented">2FLY presents</p><h2 id="threshold-title">Leave the noise.<br><em>Enter the journey.</em></h2><p class="threshold-sub">I Woke Up in Africa</p><button class="enter-theater">Enter the theater <span aria-hidden="true">↗</span></button></div>
    <div class="threshold-bottom"><span>A FILM BY KEITH LOGAN<br>Best experienced with a little stillness.</span><button class="skip-intro">Skip introduction</button></div>
  </div>`;

const threshold = document.querySelector('.threshold');
const experience = document.querySelector('.experience');
const filmFrame = document.querySelector('#film-frame');
const filmImage = document.querySelector('.film-image');
const video = document.querySelector('#presentation-video');
const playMain = document.querySelector('#play-main');
const playToggle = document.querySelector('#play-toggle');
const seek = document.querySelector('#video-seek');
const timecode = document.querySelector('#timecode');
const videoMute = document.querySelector('#video-mute');
const sceneTitle = document.querySelector('#scene-title');
const sceneSubtitle = document.querySelector('#scene-subtitle');
const screenLabel = document.querySelector('#screen-label');
const mediaError = document.querySelector('#media-error');
const sceneStrip = document.querySelector('.scene-strip');
const sceneInsight = document.querySelector('#scene-insight');
const rwandaInsight = document.querySelector('#rwanda-insight');
const insightTitle = document.querySelector('#insight-title');
const insightCopy = document.querySelector('#insight-copy');
const factTitle = document.querySelector('#fact-title');
const factCopy = document.querySelector('#fact-copy');
const factSource = document.querySelector('#fact-source');
const cards = [...document.querySelectorAll('.scene-card')];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let activeScene = 0;
let displayedCue = null;
let sceneTransition = null;
let sceneReveal = null;
let sceneLoading = true;

function setExperienceInert(state) { experience.inert = state; }
function hideInsights() {
  for (const panel of [sceneInsight, rwandaInsight]) {
    panel.classList.remove('visible');
    panel.setAttribute('aria-hidden', 'true');
    panel.inert = true;
  }
  factSource.tabIndex = -1;
  displayedCue = null;
}
function scheduleInsights() {
  // The media clock naturally freezes on pause/buffering and follows seeks.
  const cue = !threshold.hidden || document.hidden || video.seeking || sceneLoading || video.error
    ? null : africaNotes.cueAt(activeScene, video.currentTime);
  if (cue === displayedCue) return;
  hideInsights();
  if (!cue) return;
  const panel = cue.kind === 'scene' ? sceneInsight : rwandaInsight;
  if (cue.kind === 'scene') {
    insightTitle.textContent = cue.title;
    insightCopy.textContent = cue.text;
  } else {
    factTitle.textContent = cue.title;
    factCopy.textContent = cue.text;
    const [label, url] = africaNotes.sources[cue.source];
    factSource.textContent = `${label} ↗`;
    factSource.href = url;
    factSource.tabIndex = 0;
  }
  panel.inert = false;
  panel.setAttribute('aria-hidden', 'false');
  panel.classList.add('visible');
  displayedCue = cue;
}
factSource.addEventListener('focus', () => video.pause());
factSource.addEventListener('click', () => video.pause());
hideInsights();

function finishEntrance() {
  threshold.hidden = true;
  threshold.classList.remove('opening');
  document.body.classList.remove('intro-active');
  setExperienceInert(false);
  playMain.focus({ preventScroll: true });
  scheduleInsights();
}
function enterTheater(skip = false) {
  if (skip || reduceMotion) { finishEntrance(); return; }
  threshold.classList.add('opening');
  document.body.classList.remove('intro-active');
  window.setTimeout(finishEntrance, 3250);
}

document.body.classList.add('intro-active');
setExperienceInert(true);
document.querySelector('.enter-theater').focus({ preventScroll: true });
document.querySelector('.enter-theater').addEventListener('click', () => enterTheater());
document.querySelector('.skip-intro').addEventListener('click', () => enterTheater(true));
threshold.addEventListener('keydown', event => {
  if (event.key === 'Escape') enterTheater(true);
  if (event.key === 'Tab') {
    const first = document.querySelector('.enter-theater');
    const last = document.querySelector('.skip-intro');
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});

function formatTime(value) {
  if (!Number.isFinite(value)) return '—:—';
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
function syncPlayerState() {
  const playing = !video.paused && !video.ended;
  filmFrame.classList.toggle('is-playing', playing);
  playMain.hidden = playing;
  playToggle.textContent = playing ? '❚❚' : '▶';
  playToggle.setAttribute('aria-label', playing ? 'Pause presentation' : 'Play presentation');
  const elapsed = Number.isFinite(video.currentTime) ? video.currentTime : 0;
  const duration = Number.isFinite(video.duration) ? video.duration : 0;
  seek.value = duration > 0 ? String((elapsed / duration) * 100) : '0';
  timecode.textContent = `${formatTime(elapsed)} / ${formatTime(video.duration)}`;
  videoMute.textContent = video.muted ? '×' : '◖';
  videoMute.setAttribute('aria-label', video.muted ? 'Unmute presentation' : 'Mute presentation');
  scheduleInsights();
}
async function togglePlayback() {
  if (video.paused || video.ended) {
    try { await video.play(); } catch { mediaError.hidden = false; }
  } else video.pause();
}

function centerSceneCard(card) {
  window.scrollTo(0, 0);
  experience.scrollTop = 0;
  experience.scrollLeft = 0;
  const target = card.offsetLeft - ((sceneStrip.clientWidth - card.offsetWidth) / 2);
  sceneStrip.scrollTo({
    left: Math.max(0, Math.min(target, sceneStrip.scrollWidth - sceneStrip.clientWidth)),
    behavior: reduceMotion ? 'auto' : 'smooth'
  });
}
function selectScene(index, focusCard = false, autoplay = false) {
  window.clearTimeout(sceneTransition);
  window.clearTimeout(sceneReveal);
  sceneLoading = true;
  window.scrollTo(0, 0);
  experience.scrollTop = 0;
  experience.scrollLeft = 0;
  activeScene = (index + scenes.length) % scenes.length;
  const scene = scenes[activeScene];
  filmFrame.classList.add('scene-changing');
  video.pause();
  mediaError.hidden = true;
  hideInsights();
  sceneTransition = window.setTimeout(() => {
    video.src = scene.src;
    video.poster = scene.poster;
    video.load();
    filmImage.style.backgroundImage = `url("${scene.poster}")`;
    screenLabel.textContent = scene.label;
    sceneTitle.textContent = scene.title;
    sceneSubtitle.textContent = scene.subtitle;
    playMain.setAttribute('aria-label', `Play ${scene.title}`);
    cards.forEach((card, i) => card.setAttribute('aria-selected', String(i === activeScene)));
    centerSceneCard(cards[activeScene]);
    if (focusCard) cards[activeScene].focus({ preventScroll: true });
    sceneLoading = false;
    sceneReveal = window.setTimeout(() => filmFrame.classList.remove('scene-changing'), 60);
    if (threshold.hidden) scheduleInsights();
    if (autoplay) video.play().catch(() => { mediaError.hidden = false; });
  }, reduceMotion ? 0 : 220);
}

cards.forEach((card, index) => {
  card.addEventListener('click', () => selectScene(index));
  card.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); selectScene(activeScene + 1, true); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); selectScene(activeScene - 1, true); }
    if (event.key === 'Home') { event.preventDefault(); selectScene(0, true); }
    if (event.key === 'End') { event.preventDefault(); selectScene(scenes.length - 1, true); }
  });
});
document.querySelector('.previous').addEventListener('click', () => selectScene(activeScene - 1));
document.querySelector('.next').addEventListener('click', () => selectScene(activeScene + 1));

playMain.addEventListener('click', togglePlayback);
playToggle.addEventListener('click', togglePlayback);
video.addEventListener('click', togglePlayback);
video.addEventListener('play', syncPlayerState);
video.addEventListener('pause', syncPlayerState);
video.addEventListener('loadedmetadata', syncPlayerState);
video.addEventListener('timeupdate', syncPlayerState);
video.addEventListener('seeking', hideInsights);
video.addEventListener('seeked', syncPlayerState);
video.addEventListener('volumechange', syncPlayerState);
video.addEventListener('error', () => { mediaError.hidden = false; syncPlayerState(); });
video.addEventListener('ended', () => selectScene(activeScene + 1, false, true));
seek.addEventListener('input', event => {
  if (Number.isFinite(video.duration) && video.duration > 0) video.currentTime = (+event.target.value / 100) * video.duration;
});
videoMute.addEventListener('click', () => { video.muted = !video.muted; });
document.querySelector('.fullscreen').addEventListener('click', async () => {
  try {
    if (!document.fullscreenElement) await filmFrame.requestFullscreen();
    else await document.exitFullscreen();
  } catch {}
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    video.pause();
    hideInsights();
  } else if (threshold.hidden) scheduleInsights();
});
window.addEventListener('resize', () => centerSceneCard(cards[activeScene]));

selectScene(0);
