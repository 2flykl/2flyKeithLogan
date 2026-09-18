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

main.innerHTML = `
  <section class="experience" aria-label="I Woke Up in Africa screening room">
    <div class="living-bg" aria-hidden="true"></div><div class="grain" aria-hidden="true"></div>
    <header class="topbar">
      <a class="brand" href="site-overhaul.html#home" aria-label="Return to 2Fly Keith Logan"><strong>2FLY</strong><span>KEITH LOGAN<br>A FILM EXPERIENCE</span></a>
      <a class="film-id" href="africa-cinema.html" aria-current="page"><span>I Woke Up in Africa</span><small>A documentary by Keith Logan</small></a>
      <div class="header-actions">
        <details class="pages-menu">
          <summary>Pages</summary>
          <div class="pages-popover">
            <a href="site-overhaul.html#home"><span>01</span> 2FLY Home</a>
            <a href="africa-cinema.html" aria-current="page"><span>02</span> Documentary Theater <b>Live</b></a>
          </div>
        </details>
        <button class="replay-action" id="replay" aria-label="Replay theater entrance">↺ <span>Entrance</span></button>
        <button class="icon-action sound" aria-pressed="false" aria-label="Enable ambient sound"><span class="waves" aria-hidden="true"><i></i><i></i><i></i></span></button>
        <a class="help-action" href="site-overhaul.html#support">Help 2FLY Create <span aria-hidden="true">→</span></a>
      </div>
    </header>

    <section class="film-area" aria-label="Featured presentation">
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
const cards = [...document.querySelectorAll('.scene-card')];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let activeScene = 0;
let hasVisited = false;

try { hasVisited = localStorage.getItem('africa-theater-live-v1') === 'yes'; } catch {}

function setExperienceInert(state) { experience.inert = state; }
function finishEntrance() {
  threshold.hidden = true;
  threshold.classList.remove('opening');
  document.body.classList.remove('intro-active');
  setExperienceInert(false);
  playMain.focus({ preventScroll: true });
  try { localStorage.setItem('africa-theater-live-v1', 'yes'); } catch {}
}
function enterTheater(skip = false) {
  if (skip || reduceMotion) { finishEntrance(); return; }
  threshold.classList.add('opening');
  document.body.classList.remove('intro-active');
  window.setTimeout(finishEntrance, 3250);
}

if (hasVisited || reduceMotion) threshold.hidden = true;
else {
  document.body.classList.add('intro-active');
  setExperienceInert(true);
  document.querySelector('.enter-theater').focus({ preventScroll: true });
}

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
document.querySelector('#replay').addEventListener('click', () => {
  video.pause();
  threshold.hidden = false;
  setExperienceInert(true);
  document.body.classList.add('intro-active');
  document.querySelector('.enter-theater').focus({ preventScroll: true });
});

const pagesMenu = document.querySelector('.pages-menu');
document.addEventListener('click', event => {
  if (!pagesMenu.contains(event.target)) pagesMenu.removeAttribute('open');
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
}

async function togglePlayback() {
  if (video.paused || video.ended) {
    try { await video.play(); } catch { mediaError.hidden = false; }
  } else video.pause();
}

function selectScene(index, focusCard = false, autoplay = false) {
  activeScene = (index + scenes.length) % scenes.length;
  const scene = scenes[activeScene];
  filmFrame.classList.add('scene-changing');
  video.pause();
  mediaError.hidden = true;
  window.setTimeout(() => {
    video.src = scene.src;
    video.poster = scene.poster;
    video.load();
    filmImage.style.backgroundImage = `url("${scene.poster}")`;
    screenLabel.textContent = scene.label;
    sceneTitle.textContent = scene.title;
    sceneSubtitle.textContent = scene.subtitle;
    playMain.setAttribute('aria-label', `Play ${scene.title}`);
    cards.forEach((card, i) => card.setAttribute('aria-selected', String(i === activeScene)));
    cards[activeScene].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
    if (focusCard) cards[activeScene].focus();
    window.setTimeout(() => filmFrame.classList.remove('scene-changing'), 60);
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

let audioContext, ambientGain, soundOn = false;
const soundButton = document.querySelector('.sound');
soundButton.addEventListener('click', async () => {
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      ambientGain = audioContext.createGain();
      ambientGain.gain.value = 0;
      ambientGain.connect(audioContext.destination);
      [98, 146.83, 196].forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        gain.gain.value = [.2, .07, .025][index];
        oscillator.connect(gain); gain.connect(ambientGain); oscillator.start();
      });
    }
    await audioContext.resume();
    soundOn = !soundOn;
    ambientGain.gain.setTargetAtTime(soundOn ? .1 : 0, audioContext.currentTime, 1.2);
    soundButton.setAttribute('aria-pressed', String(soundOn));
    soundButton.setAttribute('aria-label', soundOn ? 'Mute ambient sound' : 'Enable ambient sound');
  } catch { soundButton.disabled = true; }
});
video.addEventListener('play', () => {
  if (!audioContext || !soundOn) return;
  soundOn = false;
  ambientGain.gain.setTargetAtTime(0, audioContext.currentTime, .25);
  soundButton.setAttribute('aria-pressed', 'false');
  soundButton.setAttribute('aria-label', 'Enable ambient sound');
});
document.addEventListener('visibilitychange', () => {
  if (!audioContext) return;
  if (document.hidden) audioContext.suspend();
  else if (soundOn) audioContext.resume();
});

selectScene(0);
