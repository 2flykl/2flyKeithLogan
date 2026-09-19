const main = document.querySelector('#main');

const scenes = [
  {
    title: 'The Introduction',
    subtitle: 'The journey begins with a question.',
    label: 'Chapter one',
    insightTitle: 'The central question',
    insight: 'Does awakening begin with what we discover, or with what a place awakens within us?',
    factTitle: 'A country of elevation',
    fact: 'Rwanda’s hills and mountains rise from roughly 950 to 4,507 metres above sea level.',
    src: 'https://video.wixstatic.com/video/85e419_d1023bd1a591485aac6da0ca76c18ab6/1080p/mp4/file.mp4',
    poster: 'https://static.wixstatic.com/media/85e419_d1023bd1a591485aac6da0ca76c18ab6f001.jpg'
  },
  {
    title: 'The School',
    subtitle: 'Service begins by listening.',
    label: 'Chapter two',
    insightTitle: 'Attention before answers',
    insight: 'The classroom exchange shifts the focus from arriving with answers to learning how to listen.',
    factTitle: 'One shared language',
    fact: 'Kinyarwanda is Rwanda’s national language and is spoken throughout the country.',
    src: 'https://video.wixstatic.com/video/85e419_c28808e63cc446c5b167d3079ec65e9d/1080p/mp4/file.mp4',
    poster: 'https://static.wixstatic.com/media/85e419_c28808e63cc446c5b167d3079ec65e9df001.jpg'
  },
  {
    title: 'The Greeting',
    subtitle: 'Connection crosses the distance first.',
    label: 'Chapter three',
    insightTitle: 'The first bridge',
    insight: 'A greeting turns observer and subject into people meeting one another.',
    factTitle: 'Muraho',
    fact: 'A warm “muraho” is a common way to say hello in Kinyarwanda.',
    src: 'https://video.wixstatic.com/video/85e419_181925da5f194738bc4946b0d7b20bff/1080p/mp4/file.mp4',
    poster: 'https://static.wixstatic.com/media/85e419_181925da5f194738bc4946b0d7b20bfff001.jpg'
  },
  {
    title: 'The Land of 1000 Hills',
    subtitle: 'Landscape becomes memory, scale, and perspective.',
    label: 'Chapter four',
    insightTitle: 'Landscape as teacher',
    insight: 'The camera slows down. Scale, distance and changing light let the land carry the story.',
    factTitle: 'A thousand hills',
    fact: 'Rwanda’s terrain is shaped by rolling hills, highlands, lakes and river valleys.',
    src: 'https://video.wixstatic.com/video/85e419_6b353e95cf4e467882c9c09e42991993/1080p/mp4/file.mp4',
    poster: 'https://static.wixstatic.com/media/85e419_6b353e95cf4e467882c9c09e42991993f001.jpg'
  },
  {
    title: 'The Village',
    subtitle: 'Community turns a visit into an exchange.',
    label: 'Chapter five',
    insightTitle: 'Community changes the frame',
    insight: 'The journey becomes less about where the filmmaker went and more about the people who made the place felt.',
    factTitle: 'Umuganda',
    fact: 'Umuganda means coming together for a shared outcome; communities gather for public work each month.',
    src: 'https://video.wixstatic.com/video/85e419_408ccbdd51b84ff0ba4b6ac769bd47f1/1080p/mp4/file.mp4',
    poster: 'https://static.wixstatic.com/media/85e419_408ccbdd51b84ff0ba4b6ac769bd47f1f001.jpg'
  },
  {
    title: 'The Hard Work',
    subtitle: 'Purpose becomes visible through effort.',
    label: 'Chapter six',
    insightTitle: 'Purpose becomes physical',
    insight: 'Work turns intention into something visible: shared effort, repetition and responsibility.',
    factTitle: 'Service for the common good',
    fact: 'Umuganda projects support shared needs such as roads, drainage, cleanliness and community facilities.',
    src: 'https://video.wixstatic.com/video/85e419_47659dfd4e164628ac014cc249a56deb/1080p/mp4/file.mp4',
    poster: 'https://static.wixstatic.com/media/85e419_47659dfd4e164628ac014cc249a56debf001.jpg'
  },
  {
    title: 'The Banana Crown',
    subtitle: 'Joy and play carry their own kind of truth.',
    label: 'Chapter seven',
    insightTitle: 'Joy interrupts the script',
    insight: 'Playfulness closes the distance between visitor and host. The moment feels ceremonial because no one planned it.',
    factTitle: 'A living harvest',
    fact: 'Bananas are widely grown across Rwanda and appear in everyday food and drink.',
    src: 'https://video.wixstatic.com/video/85e419_13fa53150986436496d580f658c13ee5/1080p/mp4/file.mp4',
    poster: 'https://static.wixstatic.com/media/85e419_13fa53150986436496d580f658c13ee5f001.jpg'
  },
  {
    title: 'The Food',
    subtitle: 'A table becomes a place of welcome.',
    label: 'Chapter eight',
    insightTitle: 'Hospitality at the table',
    insight: 'Sharing food makes the encounter reciprocal. The story lives in gestures, preparation and time together.',
    factTitle: 'From the land',
    fact: 'Meals often centre on locally grown staples such as beans, plantains, cassava and sweet potatoes.',
    src: 'https://video.wixstatic.com/video/85e419_247a9878bd50470687d77d4ae31a4d9f/1080p/mp4/file.mp4',
    poster: 'https://static.wixstatic.com/media/85e419_247a9878bd50470687d77d4ae31a4d9ff001.jpg'
  },
  {
    title: 'The Conclusion',
    subtitle: 'What changed after Africa?',
    label: 'Chapter nine',
    insightTitle: 'What comes home',
    insight: 'The closing question is not what Africa gave the filmmaker, but what responsibility follows from being changed.',
    factTitle: 'A connected landscape',
    fact: 'Rwanda borders Uganda, Tanzania, Burundi and the Democratic Republic of the Congo.',
    src: 'https://video.wixstatic.com/video/85e419_275598f2210c4d55a99beb819d5bc24a/1080p/mp4/file.mp4',
    poster: 'https://static.wixstatic.com/media/85e419_275598f2210c4d55a99beb819d5bc24af001.jpg'
  },
  {
    title: 'The Music Video',
    subtitle: 'The reflection continues through music.',
    label: 'Finale',
    insightTitle: 'Reflection becomes rhythm',
    insight: 'Music carries memory after the spoken journey ends, turning reflection into something communal and repeatable.',
    factTitle: 'Intore',
    fact: 'Rwanda’s Intore dance joins movement, drums, horns, songs and poetry; UNESCO inscribed it in 2024.',
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
      <a class="help-action" href="site-overhaul.html#support">Help 2FLY Create <span aria-hidden="true">→</span></a>
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
const cards = [...document.querySelectorAll('.scene-card')];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let activeScene = 0;
let insightTimers = [];

function setExperienceInert(state) { experience.inert = state; }
function clearInsightTimers() {
  insightTimers.forEach(timer => window.clearTimeout(timer));
  insightTimers = [];
}
function hideInsights() {
  sceneInsight.classList.remove('visible');
  rwandaInsight.classList.remove('visible');
}
function showPanel(panel) {
  hideInsights();
  panel.classList.add('visible');
}
function scheduleInsights() {
  clearInsightTimers();
  hideInsights();
  if (reduceMotion) {
    sceneInsight.classList.add('visible');
    return;
  }
  const cycle = () => {
    insightTimers.push(window.setTimeout(() => showPanel(sceneInsight), 900));
    insightTimers.push(window.setTimeout(hideInsights, 6200));
    insightTimers.push(window.setTimeout(() => showPanel(rwandaInsight), 7200));
    insightTimers.push(window.setTimeout(hideInsights, 12600));
    insightTimers.push(window.setTimeout(cycle, 14800));
  };
  cycle();
}

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
  window.scrollTo(0, 0);
  experience.scrollTop = 0;
  experience.scrollLeft = 0;
  activeScene = (index + scenes.length) % scenes.length;
  const scene = scenes[activeScene];
  filmFrame.classList.add('scene-changing');
  video.pause();
  mediaError.hidden = true;
  clearInsightTimers();
  hideInsights();
  window.setTimeout(() => {
    video.src = scene.src;
    video.poster = scene.poster;
    video.load();
    filmImage.style.backgroundImage = `url("${scene.poster}")`;
    screenLabel.textContent = scene.label;
    sceneTitle.textContent = scene.title;
    sceneSubtitle.textContent = scene.subtitle;
    insightTitle.textContent = scene.insightTitle;
    insightCopy.textContent = scene.insight;
    factTitle.textContent = scene.factTitle;
    factCopy.textContent = scene.fact;
    playMain.setAttribute('aria-label', `Play ${scene.title}`);
    cards.forEach((card, i) => card.setAttribute('aria-selected', String(i === activeScene)));
    centerSceneCard(cards[activeScene]);
    if (focusCard) cards[activeScene].focus({ preventScroll: true });
    window.setTimeout(() => filmFrame.classList.remove('scene-changing'), 60);
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
    clearInsightTimers();
    hideInsights();
  } else if (threshold.hidden) scheduleInsights();
});
window.addEventListener('resize', () => centerSceneCard(cards[activeScene]));

selectScene(0);
