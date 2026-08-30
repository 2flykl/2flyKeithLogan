/* =========================================================================
   EBONY EYES — LOCK & FLOW ARCADE PUZZLE ENGINE V2.1 (MOBILE OVERHAUL)
   ========================================================================= */

const TRAITS = ['Stability', 'Heart', 'Confidence', 'Wellness', 'Mind', 'Soul', 'Loyalty', 'Ambition'];

const TILE_ASSET = {
  Stability: 'assets/tiles/stability.png',
  Heart: 'assets/tiles/heart.png',
  Confidence: 'assets/tiles/confidence.png',
  Wellness: 'assets/tiles/wellness.png',
  Mind: 'assets/tiles/mind.png',
  Soul: 'assets/tiles/soul.png',
  Loyalty: 'assets/tiles/loyalty.png',
  Ambition: 'assets/tiles/ambition.png',
  Balloon: 'assets/tiles/red_balloon.png'
};

const TRAIT_ICONS = {
  Stability: '🏠', Heart: '❤️', Confidence: '👑', Wellness: '🪷',
  Mind: '📚', Soul: '🎤', Loyalty: '🛡️', Ambition: '🏆', Balloon: '🎈'
};

const TRAIT_VARIANTS = {
  Stability: [
    { name: 'House', icon: '🏠' }, { name: 'Gold Key', icon: '🔑' }, { name: 'Briefcase', icon: '💼' }, { name: 'Blueprint', icon: '📐' }, { name: 'Safe', icon: '🧰' }
  ],
  Heart: [
    { name: 'Heart', icon: '❤️' }, { name: 'Rose', icon: '🌹' }, { name: 'Rings', icon: '💍' }, { name: 'Chocolate', icon: '🍫' }, { name: 'Love Note', icon: '💌' }
  ],
  Confidence: [
    { name: 'Crown', icon: '👑' }, { name: 'Mirror', icon: '🪞' }, { name: 'Gem', icon: '💎' }, { name: 'Heels', icon: '👠' }, { name: 'Spotlight', icon: '✨' }
  ],
  Wellness: [
    { name: 'Lotus', icon: '🪷' }, { name: 'Dumbbell', icon: '🏋️' }, { name: 'Water', icon: '💧' }, { name: 'Leaf', icon: '🌿' }, { name: 'Yoga', icon: '🧘🏾' }
  ],
  Mind: [
    { name: 'Books', icon: '📚' }, { name: 'Grad Cap', icon: '🎓' }, { name: 'Chess', icon: '♟️' }, { name: 'Puzzle', icon: '🧩' }, { name: 'Globe', icon: '🌍' }
  ],
  Soul: [
    { name: 'Microphone', icon: '🎤' }, { name: 'Vinyl', icon: '📀' }, { name: 'Palette', icon: '🎨' }, { name: 'Sax', icon: '🎷' }, { name: 'Headphones', icon: '🎧' }
  ],
  Loyalty: [
    { name: 'Shield', icon: '🛡️' }, { name: 'Linked Hands', icon: '🤝' }, { name: 'Knot', icon: '🪢' }, { name: 'Anchor', icon: '⚓' }, { name: 'Lock', icon: '🔒' }
  ],
  Ambition: [
    { name: 'Trophy', icon: '🏆' }, { name: 'Star', icon: '⭐️' }, { name: 'Graph', icon: '📈' }, { name: 'Rocket', icon: '🚀' }, { name: 'Medal', icon: '🥇' }
  ]
};

// SVG data URI for Ebony Eyes blinking Black eyes wildcard tile
const EBONY_EYES_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2a0e38"/>
      <stop offset="100%" stop-color="#0c0414"/>
    </linearGradient>
    <linearGradient id="iris" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a66236"/>
      <stop offset="50%" stop-color="#592b10"/>
      <stop offset="100%" stop-color="#1f0902"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="14" fill="url(#bg)" stroke="#e09aff" stroke-width="3.5"/>
  <circle cx="50" cy="50" r="42" fill="none" stroke="#ffd700" stroke-width="1.5" opacity="0.4"/>
  <!-- Left Eye -->
  <g transform="translate(0, 0)">
    <path d="M 16 50 Q 32 32 48 50 Q 32 64 16 50 Z" fill="#fff6ee"/>
    <circle cx="32" cy="50" r="8.5" fill="url(#iris)"/>
    <circle cx="32" cy="50" r="4" fill="#080302"/>
    <circle cx="30" cy="47" r="2.2" fill="#ffffff"/>
    <path d="M 14 50 Q 32 28 50 50" fill="none" stroke="#231209" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M 18 45 L 14 40 M 24 38 L 22 32 M 32 36 L 32 29 M 40 38 L 42 32" stroke="#120804" stroke-width="2" stroke-linecap="round"/>
  </g>
  <!-- Right Eye -->
  <g transform="translate(0, 0)">
    <path d="M 52 50 Q 68 32 84 50 Q 68 64 52 50 Z" fill="#fff6ee"/>
    <circle cx="68" cy="50" r="8.5" fill="url(#iris)"/>
    <circle cx="68" cy="50" r="4" fill="#080302"/>
    <circle cx="66" cy="47" r="2.2" fill="#ffffff"/>
    <path d="M 50 50 Q 68 28 86 50" fill="none" stroke="#231209" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M 60 38 L 58 32 M 68 36 L 68 29 M 76 38 L 78 32 M 82 45 L 86 40" stroke="#120804" stroke-width="2" stroke-linecap="round"/>
  </g>
</svg>
`)}`;

const women = [
  { name: 'Keysha', prefs: ['Stability', 'Loyalty', 'Heart'], img: 'assets/contestants/keysha.png', goals: { Stability: 5, Loyalty: 4, Heart: 6 } },
  { name: 'Jade', prefs: ['Ambition', 'Confidence', 'Soul'], img: 'assets/contestants/jade.png', goals: { Ambition: 5, Confidence: 4, Soul: 5 } },
  { name: 'Imani', prefs: ['Heart', 'Mind', 'Loyalty'], img: 'assets/contestants/imani.png', goals: { Heart: 6, Mind: 4, Loyalty: 5 } },
  { name: 'Simone', prefs: ['Heart', 'Loyalty', 'Confidence'], img: 'assets/contestants/simone.png', goals: { Heart: 6, Loyalty: 5, Confidence: 4 } },
  { name: 'Amara', prefs: ['Wellness', 'Soul', 'Stability'], img: 'assets/contestants/amara.png', goals: { Wellness: 5, Soul: 5, Stability: 4 } },
  { name: 'Zuri', prefs: ['Ambition', 'Mind', 'Loyalty'], img: 'assets/contestants/zuri.png', goals: { Ambition: 6, Mind: 5, Loyalty: 4 } }
];

const men = [
  { name: 'Marcus', prefs: ['Confidence', 'Ambition', 'Loyalty'], img: 'assets/contestants/marcus.png', goals: { Confidence: 5, Ambition: 5, Loyalty: 4 } },
  { name: 'Andre', prefs: ['Soul', 'Confidence', 'Heart'], img: 'assets/contestants/andre.png', goals: { Soul: 5, Confidence: 4, Heart: 5 } },
  { name: 'Malcolm', prefs: ['Mind', 'Stability', 'Ambition'], img: 'assets/contestants/malcolm.png', goals: { Mind: 5, Stability: 5, Ambition: 4 } },
  { name: 'Darius', prefs: ['Heart', 'Soul', 'Loyalty'], img: 'assets/contestants/darius.png', goals: { Heart: 5, Soul: 5, Loyalty: 4 } },
  { name: 'Isaiah', prefs: ['Stability', 'Wellness', 'Loyalty'], img: 'assets/contestants/isaiah.png', goals: { Stability: 5, Wellness: 5, Loyalty: 4 } },
  { name: 'Julian', prefs: ['Heart', 'Confidence', 'Soul'], img: 'assets/contestants/julian.png', goals: { Heart: 5, Confidence: 5, Soul: 4 } }
];

const ROWS = 7, COLS = 10, SONG_SECONDS = 187;
let people = [], mode = 'male', board = [], cursor = { r: 3, c: 4 }, preview = [];
let profile = {}, interest = [], popped = [], score = 0, locks = 0, matches = 0, failedLocks = 0, streak = 0, maxStreak = 0, pressure = 0, time = SONG_SECONDS;
let comboVal = 1, comboTimer = null;
let started = false, paused = false, ending = false, audio = null, secondTimer = null, flowTimeout = null, lastFlowAt = 0;
let matchedTraitCount = Object.fromEntries(TRAITS.map(t => [t, 0]));
let lockTraitCount = Object.fromEntries(TRAITS.map(t => [t, 0]));
let contestantProgress = []; // per person: { trait: count }
let neglectCounters = []; // per person: missed count
let cursorMoves = 0, balloonHits = 0, safeBalloonClears = 0, focusIndex = -1, spotlightCharges = 2, spawnBag = [];
let laneHistory = [], globalHistory = [];
let consecutiveNegatives = 0, hotHandTimer = 0;
let mobileGroup = 'A'; // 'A' (0,1,2) or 'B' (3,4,5)
let hiddenAlerts = { A: { danger: false, react: false }, B: { danger: false, react: false } };
let hintFaded = false;
let flowStep = 0, ambiencePulse = 0;
let uid = 1;

function cell(type, locked = false, variantIndex = 0) {
  return { id: uid++, type, locked, variantIndex, lockedAt: locked ? performance.now() : 0, age: 0, hit: false };
}
function emptyBoard() { return Array.from({ length: ROWS }, () => Array(COLS).fill(null)); }
function rand(a) { return a[Math.floor(Math.random() * a.length)]; }
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function secondsElapsed() { return SONG_SECONDS - time; }
function playerUnderstanding() {
  const lockSkill = clamp(locks / 12, 0, 1);
  const moveSkill = clamp(cursorMoves / 20, 0, 1);
  const matchSkill = clamp(matches / 4, 0, 1);
  const survival = clamp((interest.reduce((a, b) => a + b, 0) / Math.max(1, people.length)) / 100, 0, 1);
  return clamp(lockSkill * 0.28 + moveSkill * 0.10 + matchSkill * 0.42 + survival * 0.20, 0, 1);
}
function onboardingGraceActive() { return progress() < 0.22 && (flowStep < 10 || playerUnderstanding() < 0.55 || matches < 1); }
function getLockedTraitStats() {
  const stats = Object.fromEntries(TRAITS.map(t => [t, 0]));
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const x = board[r][c];
    if (!x?.locked || x.type === 'Balloon' || x.type === 'EbonyEyes') continue;
    stats[x.type] += x.pair ? 1.8 : 1;
  }
  return stats;
}
function currentBalloonChance(base) {
  const learn = playerUnderstanding();
  if (flowStep < 4) return 0;
  if (flowStep < 8 && matches === 0) return base * 0.10;
  if (onboardingGraceActive()) return base * 0.32;
  if (learn < 0.40) return base * 0.48;
  if (learn < 0.65) return base * 0.72;
  return base;
}

/* Audio Engine */
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}
function playTone(freq, type = 'sine', duration = 0.15, vol = 0.1) {
  try {
    const ctx = getAudioCtx(); if (!ctx) return;
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.type = type; osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

function startGame(m) {
  mode = m;
  people = (m === 'male' ? women : men).slice(0,4);
  board = emptyBoard();
  cursor = { r: Math.floor(ROWS / 2), c: Math.floor(COLS / 2) };
  laneHistory = Array.from({ length: COLS }, () => []);
  globalHistory = []; spawnBag = [];
  TRAITS.forEach(t => profile[t] = 8);
  interest = people.map(() => 72 + Math.random() * 8);
  popped = people.map(() => false);
  contestantProgress = people.map(() => ({}));
  neglectCounters = people.map(() => 0);

  score = 0; locks = 0; matches = 0; failedLocks = 0; streak = 0; maxStreak = 0; pressure = 0; time = SONG_SECONDS; ending = false;
  comboVal = 1; consecutiveNegatives = 0; hotHandTimer = 0; mobileGroup = 'A';
  hiddenAlerts = { A: { danger: false, react: false }, B: { danger: false, react: false } };
  hintFaded = false;
  flowStep = 0; ambiencePulse = 0;

  matchedTraitCount = Object.fromEntries(TRAITS.map(t => [t, 0]));
  lockTraitCount = Object.fromEntries(TRAITS.map(t => [t, 0]));
  cursorMoves = 0; balloonHits = 0; safeBalloonClears = 0; spotlightCharges = 2;

  document.body.classList.add('game-playing');
  document.querySelector('#title').classList.remove('active');
  document.querySelector('#game').classList.add('active');

  const banner = document.querySelector('#banner');
  if (banner) {
    banner.classList.remove('fade');
    banner.textContent = 'Tap tile to lock / unlock';
  }

  preview = makePreviewWave();
  updateBoardGeometry();
  renderAll();

  audio = new Audio('assets/Ebony Eyes 5.mp3');
  audio.volume = .72;
  audio.play().catch(() => {});
  document.querySelector('#soundBtn').onclick = () => {
    audio.muted = !audio.muted;
    document.querySelector('#soundBtn').textContent = audio.muted ? 'MUTED' : 'MUSIC';
  };

  started = true;
  secondTimer = setInterval(tickSecond, 1000);
  scheduleFlow(1200);
  toast('EMPTY BOARD • FLOW DIRECTOR 2.0 ACTIVE');

  setTimeout(fadeHintBanner, 3500);
}

function fadeHintBanner() {
  if (hintFaded) return;
  hintFaded = true;
  const banner = document.querySelector('#banner');
  if (banner) banner.classList.add('fade');
}

function switchMobileGroup(grp) { mobileGroup = grp; renderContestants(); }

/* =========================================================
   FLOW DIRECTOR 2.0 & FUN-FACTOR DIRECTOR
   ========================================================= */
function progress() { return clamp((SONG_SECONDS - time) / SONG_SECONDS, 0, 1); }
function phaseInfo() {
  const p = progress();
  if (p < .20) return { label: 'STAGE 1 • INTRO', stage: 'intro', help: 'Slow flow. Build your first locks and 2-chains.', interval: 1380, spawnMin: 2, spawnMax: 4, balloon: .008, ebonyEyesChance: .03, generosity: .92 };
  if (p < .45) return { label: 'STAGE 2 • GROOVE', stage: 'groove', help: 'Diagonals & 2x2 blocks open up. Flow Director feeds setup lanes.', interval: 1080, spawnMin: 3, spawnMax: 5, balloon: .022, ebonyEyesChance: .05, generosity: .72 };
  if (p < .70) return { label: 'STAGE 3 • PRESSURE', stage: 'pressure', help: 'Cadence accelerates. Watch for balloon hazard warnings.', interval: 860, spawnMin: 4, spawnMax: 6, balloon: .052, ebonyEyesChance: .065, generosity: .54 };
  if (p < .90) return { label: 'STAGE 4 • RUSH', stage: 'rush', help: 'Fast flow. Chained combos compete for attention.', interval: 680, spawnMin: 5, spawnMax: 7, balloon: .085, ebonyEyesChance: .08, generosity: .40 };
  return { label: 'STAGE 5 • FINALE', stage: 'finale', help: 'CLIMAX FLOW! High-energy closing spectacle.', interval: 520, spawnMin: 6, spawnMax: 8, balloon: .12, ebonyEyesChance: .10, generosity: .28 };
}

function skillFactor() {
  const lockQuality = locks ? matches / locks : 0;
  const congestion = averagePile() / ROWS;
  const miss = locks ? failedLocks / locks : 0;
  return clamp(.5 + lockQuality * 1.1 - congestion * .55 - miss * .35, 0, 1.35);
}
function adaptiveInterval() {
  const ph = phaseInfo(); const skill = skillFactor(); const understanding = playerUnderstanding();
  let mul = 1;
  if (skill > .9) mul *= .92;
  else if (skill < .35) mul *= 1.10;
  if (onboardingGraceActive()) mul *= 1.16;
  else if (understanding < .45) mul *= 1.08;
  return Math.round(ph.interval * mul);
}

function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function refillBag() { spawnBag = shuffle([...TRAITS, ...TRAITS]); }
function nextBagTrait(exclude = []) {
  if (spawnBag.length < 3) refillBag();
  let idx = spawnBag.findIndex(t => !exclude.includes(t));
  if (idx < 0) idx = 0;
  const [pick] = spawnBag.splice(idx, 1); return pick;
}
function recordLaneTrait(lane, type) {
  if (type === 'Balloon' || type === 'EbonyEyes') return;
  laneHistory[lane].push(type); if (laneHistory[lane].length > 3) laneHistory[lane].shift();
  globalHistory.push(type); if (globalHistory.length > 8) globalHistory.shift();
}
function chooseVariantIndex(type, lane = 0) {
  const variants = TRAIT_VARIANTS[type] || [];
  if (!variants.length) return 0;
  const lockedStats = getLockedTraitStats();
  const base = Math.floor((performance.now() / 600 + lane + locks + matches + (lockedStats[type] || 0)) % variants.length);
  if (Math.random() < 0.35) return Math.floor(Math.random() * variants.length);
  return base;
}

function makePreviewWave() {
  const ph = phaseInfo();
  let count = ph.spawnMin + Math.floor(Math.random() * (ph.spawnMax - ph.spawnMin + 1));
  if (onboardingGraceActive()) count = Math.min(count, 3 + Math.round(playerUnderstanding() * 1.5));
  const lanes = [...Array(COLS).keys()].sort(() => Math.random() - .5).slice(0, count);
  const wave = Array(COLS).fill(null);
  const assist = chooseOpportunity();
  const skill = skillFactor();

  const magneticLanes = getEbonyEyesMagneticLanes();
  let balloonChance = currentBalloonChance(ph.balloon) * (skill > .9 ? 1.08 : skill < .35 ? .88 : 1);
  let ebonyEyesChance = ph.ebonyEyesChance * (consecutiveNegatives > 2 ? 1.8 : 1);
  const waveCounts = {};

  for (const c of lanes) {
    if (Math.random() < balloonChance) { wave[c] = 'Balloon'; continue; }

    if (Math.random() < ebonyEyesChance && !wave.includes('EbonyEyes')) {
      wave[c] = 'EbonyEyes';
      continue;
    }

    const distToCursor = Math.abs(c - cursor.c);
    const cursorNear = (distToCursor <= 3);
    let assistChance = cursorNear ? ph.generosity : (ph.generosity * 0.5);

    if (consecutiveNegatives > 2) assistChance += 0.25;

    let preferred = (assist && assist.lanes.includes(c) && Math.random() < assistChance) ? assist.type : null;
    if (!preferred && magneticLanes[c] && Math.random() < 0.65) {
      preferred = magneticLanes[c];
    }

    wave[c] = variedDirectorTrait(c, preferred, waveCounts);
  }

  if (assist?.urgent && assist.lanes.length) {
    const c = rand(assist.lanes); wave[c] = assist.type;
    waveCounts[assist.type] = (waveCounts[assist.type] || 0) + 1;
    recordLaneTrait(c, assist.type);
  }
  return wave;
}

function getEbonyEyesMagneticLanes() {
  const map = {};
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = board[r][c];
      if (x?.locked && x.type === 'EbonyEyes') {
        const dirs = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]];
        for (const [dr, dc] of dirs) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
            const neighbor = board[nr][nc];
            if (neighbor?.locked && neighbor.type !== 'EbonyEyes' && neighbor.type !== 'Balloon') {
              map[c] = neighbor.type;
              if (c > 0) map[c - 1] = neighbor.type;
              if (c < COLS - 1) map[c + 1] = neighbor.type;
            }
          }
        }
      }
    }
  }
  return map;
}

function averagePile() {
  let total = 0; for (let c = 0; c < COLS; c++) { let count = 0; for (let r = 0; r < ROWS; r++) if (board[r][c]) count++; total += count; } return total / COLS;
}
function scheduleFlow(delay = null) { clearTimeout(flowTimeout); if (ending) return; flowTimeout = setTimeout(flowTick, delay ?? adaptiveInterval()); }

function updateBoardGeometry() {
  document.documentElement.style.setProperty('--cols', COLS);
  document.documentElement.style.setProperty('--rows', ROWS);

  const isMobile = window.innerWidth <= 900;
  const headerH = document.querySelector('header')?.offsetHeight || 58;
  const contestantH = document.querySelector('#contestantWrap')?.offsetHeight || (isMobile ? 126 : 116);
  const profileH = document.querySelector('#profileRibbonWrap')?.offsetHeight || (isMobile ? 70 : 62);
  const previewH = document.querySelector('#flowPreview')?.offsetHeight || 42;
  const bannerH = document.querySelector('#banner')?.offsetHeight || 24;
  const statusH = document.querySelector('#statusLine')?.offsetHeight || 18;

  const chromeH = headerH + contestantH + profileH + previewH + bannerH + statusH + (isMobile ? 24 : 32);
  const availH = Math.max(isMobile ? 220 : 340, window.innerHeight - chromeH);
  const availW = Math.max(isMobile ? 300 : 860, window.innerWidth - (isMobile ? 16 : 44));
  const gap = isMobile ? 3 : 4;
  const pad = isMobile ? 10 : 22;

  const cellW = Math.floor((availW - (COLS - 1) * gap - pad) / COLS);
  const cellH = Math.floor((availH - (ROWS - 1) * gap - pad) / ROWS);
  const cell = Math.max(isMobile ? 26 : 58, Math.min(isMobile ? 58 : 92, Math.min(cellW, cellH)));

  document.documentElement.style.setProperty('--cell', cell + 'px');
  document.documentElement.style.setProperty('--previewCell', Math.max(isMobile ? 22 : 34, Math.floor(cell * 0.46)) + 'px');
}


function variedDirectorTrait(lane, preferred = null, waveCounts = {}) {
  const recentLane = laneHistory[lane] || []; const recentGlobal = globalHistory.slice(-2); const exclude = [];
  if (recentLane.length && recentLane[recentLane.length - 1]) exclude.push(recentLane[recentLane.length - 1]);
  if (recentLane.length > 1 && recentLane[0] === recentLane[1]) exclude.push(recentLane[0]);
  if (recentGlobal.length === 2 && recentGlobal[0] === recentGlobal[1]) exclude.push(recentGlobal[0]);

  let pick = preferred;
  if (!pick || (exclude.includes(pick) && Math.random() < 0.75) || (waveCounts[pick] || 0) >= 2) {
    for (let tries = 0; tries < 8; tries++) {
      const candidate = directorTrait();
      if ((waveCounts[candidate] || 0) >= 2) continue;
      if (exclude.includes(candidate) && Math.random() < 0.7) continue;
      pick = candidate; break;
    }
  }
  if (!pick) pick = nextBagTrait(exclude);
  if ((waveCounts[pick] || 0) >= 2) { pick = nextBagTrait(Object.keys(waveCounts).filter(k => waveCounts[k] >= 2).concat(exclude)); }
  waveCounts[pick] = (waveCounts[pick] || 0) + 1; recordLaneTrait(lane, pick); return pick;
}

function directorTrait() {
  const weights = Object.fromEntries(TRAITS.map(t => [t, 1]));
  const plans = analyzePlans();
  const lockedStats = getLockedTraitStats();
  plans.forEach(p => {
    const distWeight = p.lanes.some(l => Math.abs(l - cursor.c) <= 2) ? 1.5 : 1.0;
    weights[p.type] += (p.size === 2 ? 3.8 : 1.2) * distWeight;
  });
  Object.entries(lockedStats).forEach(([trait, val]) => {
    weights[trait] += val * 0.55;
  });
  people.forEach((p, i) => {
    if (popped[i]) return;
    const bias = clamp(interest[i] / 100, 0.15, 1);
    p.prefs.forEach(t => weights[t] += 0.28 * bias);
  });
  const fi = inferFocus(); if (fi >= 0) people[fi].prefs.forEach(t => weights[t] += 1.45);
  const low = [...TRAITS].sort((a, b) => profile[a] - profile[b]).slice(0, 2); low.forEach(t => weights[t] += .55);
  let sum = Object.values(weights).reduce((a, b) => a + b, 0), x = Math.random() * sum;
  for (const t of TRAITS) { x -= weights[t]; if (x <= 0) return t; } return rand(TRAITS);
}

function chooseOpportunity() {
  const plans = analyzePlans().filter(p => p.lanes.length);
  if (!plans.length) return null;
  plans.sort((a, b) => (b.size - a.size) || ((performance.now() - b.oldest) - (performance.now() - a.oldest)));
  const p = plans[0]; return { ...p, urgent: p.size === 2 && (performance.now() - p.oldest) > 4800 };
}

function analyzePlans() {
  const seen = new Set(), out = [];
  const dirs = [[1,0],[-1,0],[0,1],[0,-1],[-1,-1],[-1,1],[1,-1],[1,1]];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const x = board[r][c]; if (!x?.locked || x.type === 'Balloon' || seen.has(x.id)) continue;
    const cluster = [], q = [[r, c]]; seen.add(x.id);
    while (q.length) {
      const [rr, cc] = q.shift(), cur = board[rr][cc]; cluster.push([rr, cc, cur]);
      for (const [dr, dc] of dirs) {
        const nr = rr + dr, nc = cc + dc; if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
        const n = board[nr][nc]; if (n?.locked && (n.type === x.type || n.type === 'EbonyEyes') && !seen.has(n.id)) { seen.add(n.id); q.push([nr, nc]); }
      }
    }
    if (cluster.length >= 3) continue;
    const candidates = new Set();
    for (const [rr, cc] of cluster) for (const [dr, dc] of dirs) {
      const nr = rr + dr, nc = cc + dc; if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
      if (!board[nr][nc] || !board[nr][nc].locked) candidates.add(nc);
    }
    out.push({ type: x.type === 'EbonyEyes' ? rand(TRAITS) : x.type, size: cluster.length, lanes: [...candidates], oldest: Math.min(...cluster.map(v => v[2].lockedAt)) });
  }
  return out;
}

function inferFocus() {
  let best = -1, bestScore = -1;
  people.forEach((p, i) => {
    if (popped[i]) return;
    let s = 0;
    p.prefs.forEach(t => s += lockTraitCount[t] * .4 + matchedTraitCount[t] * 1.4);
    if (s > bestScore) { bestScore = s; best = i; }
  });
  focusIndex = bestScore > 0 ? best : -1;
  return focusIndex;
}

/* Spectacle & Visual Helpers */
function spawnFloatingScore(r, c, text, color = '#ffe184') {
  const cellEl = document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
  if (!cellEl) return;
  const floatEl = document.createElement('div');
  floatEl.className = 'floatingScore';
  floatEl.textContent = text;
  floatEl.style.color = color;
  cellEl.appendChild(floatEl);
  setTimeout(() => floatEl.remove(), 900);
}

function shakeBoard() {
  const boardEl = document.querySelector('#boardContainer');
  if (!boardEl) return;
  boardEl.classList.remove('boardShake');
  void boardEl.offsetWidth;
  boardEl.classList.add('boardShake');
}

function drawMatchTracers(cells, color = '#ffd700') {
  const canvas = document.getElementById('fxCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const boardEl = document.getElementById('board');
  if (!boardEl) return;
  canvas.width = boardEl.offsetWidth;
  canvas.height = boardEl.offsetHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (cells.length < 2) return;
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.shadowColor = color;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  cells.forEach(([r, c], idx) => {
    const cellEl = document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
    if (!cellEl) return;
    const x = cellEl.offsetLeft + cellEl.offsetWidth / 2;
    const y = cellEl.offsetTop + cellEl.offsetHeight / 2;
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  setTimeout(() => { ctx.clearRect(0, 0, canvas.width, canvas.height); }, 450);
}

async function flowTick() {
  if (!started || paused || ending) { scheduleFlow(250); return; }
  lastFlowAt = performance.now();
  flowStep++; ambiencePulse = (ambiencePulse + 1) % 9999;
  await advanceOneCell();
  injectPreview(); preview = makePreviewWave(); ageCells(); updatePressure(); checkOverflow(); checkPops(); renderAll(); scheduleFlow();
}

function ageCells() { for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (board[r][c]) board[r][c].age++; }

async function advanceOneCell() {
  const hits = [];
  for (let c = 0; c < COLS; c++) {
    for (let r = ROWS - 1; r >= 0; r--) {
      const x = board[r][c]; if (!x || x.locked) continue;
      if (x.type === 'Balloon') {
        if (r === ROWS - 1) {
          board[r][c] = null;
          spawnFloatingScore(r, c, 'BALLOON EXITED', '#ff738a');
          continue;
        }
        const below = board[r + 1][c];
        if (!below) { board[r + 1][c] = x; board[r][c] = null; continue; }
        if (below.locked) { hits.push({ r: r + 1, c, lockedType: below.type }); board[r + 1][c] = null; board[r][c] = null; balloonHits++; continue; }
        hits.push({ r: r + 1, c, loose: true, lockedType: below.type }); board[r + 1][c] = x; board[r][c] = null; continue;
      }

      if (r === ROWS - 1) {
        board[r][c] = null;

        if (x.type === 'EbonyEyes') {
          score = Math.max(0, score - 180);
          pressure = clamp(pressure + 4, 0, 100);
          comboVal = 1;
          consecutiveNegatives++;
          people.forEach((_, i) => { if (!popped[i]) interest[i] -= onboardingGraceActive() ? 1 : 1.6; });
          playTone(180, 'sawtooth', 0.35, 0.12);
          toast('MISSED CONNECTION • EBONY EYES EXITED');
          spawnFloatingScore(r, c, 'MISSED CONNECTION', '#ff4500');
        } else {
          score += 10;
          spawnFloatingScore(r, c, '+10 EXIT', '#c8b6cf');
          playTone(320, 'sine', 0.08, 0.03);

          people.forEach((p, i) => {
            if (!popped[i] && p.prefs.includes(x.type)) {
              neglectCounters[i]++;
              if (neglectCounters[i] >= 4) {
                triggerContestantReaction(i, 'disappoint', 'Missed ' + x.type);
                interest[i] -= onboardingGraceActive() ? 0.8 : 1.15;
              }
            }
          });
        }
        continue;
      }
      if (!board[r + 1][c]) { board[r + 1][c] = x; board[r][c] = null; }
    }
  }

  if (hits.length) {
    shakeBoard();
    renderBoard(); hits.forEach(h => flashCell(h.r, h.c)); await sleep(130); for (const h of hits) applyBalloonHit(h);
  }
}

function applyBalloonHit(h) {
  if (h.loose) { score += 45; safeBalloonClears++; toastSmall('BALLOON CLEARS LOOSE CLUTTER'); return; }
  const t = h.lockedType; if (t && TRAITS.includes(t)) {
    profile[t] = clamp(profile[t] - (onboardingGraceActive() ? 2 : 3), 0, 100);
    people.forEach((p, i) => { if (!popped[i]) interest[i] -= p.prefs.includes(t) ? (onboardingGraceActive() ? 2.2 : 3.5) : (onboardingGraceActive() ? 0.9 : 1.4); });
    score = Math.max(0, score - 240); streak = 0; pressure = clamp(pressure + 5, 0, 100); comboVal = 1; consecutiveNegatives++;
    toast('RED BALLOON BROKE A LOCK • ' + t.toUpperCase() + ' REGRESSED');
  }
}

function injectPreview() {
  for (let c = 0; c < COLS; c++) {
    const type = preview[c]; if (!type) continue;
    const variantIndex = (type !== 'Balloon' && type !== 'EbonyEyes') ? Math.floor(Math.random() * TRAIT_VARIANTS[type].length) : 0;
    if (!board[0][c]) board[0][c] = cell(type, false, variantIndex);
    else {
      if (type === 'Balloon' && board[0][c] && !board[0][c].locked) { board[0][c] = cell('Balloon', false); } else pressure += 1.2;
    }
  }
}

function updatePressure() {
  let occupied = 0, locked = 0, pairs = 0;
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) { if (board[r][c]) occupied++; if (board[r][c]?.locked) locked++; if (board[r][c]?.pair) pairs++; }
  const density = occupied / (ROWS * COLS);
  pressure = clamp(pressure * .96 + density * 5 + Math.max(0, averagePile() - 5) * .8, 0, 100);
}

function checkOverflow() {
  let topLocks = 0; for (let c = 0; c < COLS; c++) if (board[0][c]?.locked) topLocks++;
  if (topLocks >= 3) { pressure = clamp(pressure + 12, 0, 100); people.forEach((_, i) => { if (!popped[i]) interest[i] -= 3; }); toast('LANES ARE CHOKING • CLEAR A CONNECTION'); }
}

function moveCursor(dr, dc) { if (!started || paused || ending) return; cursor.r = clamp(cursor.r + dr, 0, ROWS - 1); cursor.c = clamp(cursor.c + dc, 0, COLS - 1); cursorMoves++; renderBoard(); updateStatusLine(); }

async function lockAtCursor() {
  if (!started || paused || ending) return; const x = board[cursor.r][cursor.c];
  if (!x) { failedLocks++; playTone(180, 'sawtooth', 0.1, 0.05); toastSmall('EMPTY CELL • WAIT FOR AN ICON'); return; }
  if (x.type === 'Balloon') { failedLocks++; playTone(150, 'sawtooth', 0.15, 0.08); toastSmall('RED BALLOONS CANNOT BE LOCKED'); return; }
  if (x.locked) {
    x.locked = false; x.lockedAt = 0; x.pair = false; score = Math.max(0, score - 110); pressure = clamp(pressure + 2, 0, 100); streak = 0;
    playTone(280, 'triangle', 0.12, 0.06);
    spawnFloatingScore(cursor.r, cursor.c, 'UNLOCKED', '#ff6584');
    toastSmall('UNLOCKED • FLOW RESUMES IN THIS LANE'); renderAll(); return;
  }
  x.locked = true; x.lockedAt = performance.now(); locks++;
  if (x.type !== 'EbonyEyes') lockTraitCount[x.type]++;
  score += 40;
  playTone(520, 'sine', 0.15, 0.08);
  spawnFloatingScore(cursor.r, cursor.c, 'LOCKED +40', '#ffe184');
  renderBoard();
  await resolveConnections();
  updateStatusLine();
  renderAll();
}

/* 8-Way Connection Engine & 2x2 Solid Foundation */
async function resolveConnections() {
  let clearedAny = false, chain = 0;

  const squares = get2x2Squares();
  if (squares.length) {
    for (const sq of squares) {
      clearedAny = true;
      shakeBoard();
      playTone(750, 'sine', 0.35, 0.15);
      drawMatchTracers(sq.cells, '#5ce1e6');
      sq.cells.forEach(([r, c]) => {
        const el = document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
        el?.classList.add('solidFoundation');
        spawnFloatingScore(r, c, 'SOLID FOUNDATION! +500', '#5ce1e6');
      });
      await sleep(350);
      sq.cells.forEach(([r, c]) => { board[r][c] = null; });
      score += 500 * comboVal;
      pressure = clamp(pressure - 15, 0, 100);
      awardTraitProgress(sq.trait, 12, 2);
      toast('SOLID FOUNDATION! 2x2 BLOCK CLEARED');

      if (Math.random() < 0.25) {
        preview[rand([...Array(COLS).keys()])] = 'EbonyEyes';
        toast('EBONY EYES SPAWNED FROM SOLID FOUNDATION!');
      }
    }
  }

  while (true) {
    const clusters = getLockedClusters().filter(c => c.group.length >= 3);
    if (!clusters.length) break;
    chain++; clearedAny = true;
    comboVal = clamp(comboVal + 1, 1, 10);
    consecutiveNegatives = 0;

    const toClear = new Map();
    let containsEbonyEyes = false;

    clusters.forEach(c => {
      c.group.forEach(([r, cIdx, x]) => {
        toClear.set(`${r},${cIdx}`, { x, trait: c.matchType });
        if (x.type === 'EbonyEyes') containsEbonyEyes = true;
      });
    });

    shakeBoard();
    const isEbonyCombo = containsEbonyEyes && (toClear.size >= 4 || chain >= 2);
    const traceColor = isEbonyCombo ? '#e09aff' : (chain >= 3 ? '#ff4eae' : '#ffd700');

    const cellList = [...toClear.keys()].map(k => k.split(',').map(Number));
    drawMatchTracers(cellList, traceColor);
    playTone(600 + chain * 150 + (isEbonyCombo ? 200 : 0), 'sine', 0.28, 0.14);

    toClear.forEach((val, key) => {
      const [r, c] = key.split(',').map(Number);
      const el = document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
      el?.classList.add('matching');
      const tierText = toClear.size >= 6 ? 'LEGACY COMBO!' : toClear.size >= 5 ? 'LOVE STREAK!' : toClear.size >= 4 ? 'STRONG MATCH' : 'CONNECTION';
      spawnFloatingScore(r, c, `+${160 * chain * comboVal} ${tierText}`, traceColor);
    });

    await sleep(280);

    const counts = {};
    toClear.forEach(val => counts[val.trait] = (counts[val.trait] || 0) + 1);
    Object.entries(counts).forEach(([t, n]) => awardMatch(t, n, chain, isEbonyCombo));

    toClear.forEach((_, key) => { const [r, c] = key.split(',').map(Number); board[r][c] = null; });
    matches++; streak++; maxStreak = Math.max(maxStreak, streak); score += toClear.size * 160 * chain * comboVal;
    renderAll(); await sleep(120);
  }

  if (!clearedAny) markPairs();
}

function get2x2Squares() {
  const squares = [];
  for (let r = 0; r < ROWS - 1; r++) {
    for (let c = 0; c < COLS - 1; c++) {
      const c1 = board[r][c], c2 = board[r][c + 1], c3 = board[r + 1][c], c4 = board[r + 1][c + 1];
      if (c1?.locked && c2?.locked && c3?.locked && c4?.locked) {
        const types = [c1.type, c2.type, c3.type, c4.type].filter(t => t !== 'Balloon');
        if (types.length === 4) {
          const normalTypes = types.filter(t => t !== 'EbonyEyes');
          const firstNormal = normalTypes[0] || rand(TRAITS);
          const allMatch = types.every(t => t === firstNormal || t === 'EbonyEyes');
          if (allMatch) squares.push({ cells: [[r, c], [r, c + 1], [r + 1, c], [r + 1, c + 1]], trait: firstNormal });
        }
      }
    }
  }
  return squares;
}

function getLockedClusters() {
  const seen = new Set(), clusters = [];
  const dirs = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]];

  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const x = board[r][c]; if (!x?.locked || x.type === 'Balloon' || seen.has(x.id)) continue;
    const group = [], q = [[r, c]]; seen.add(x.id);
    let matchType = x.type;

    while (q.length) {
      const [rr, cc] = q.shift(), cur = board[rr][cc]; group.push([rr, cc, cur]);
      if (matchType === 'EbonyEyes' && cur.type !== 'EbonyEyes') matchType = cur.type;

      for (const [dr, dc] of dirs) {
        const nr = rr + dr, nc = cc + dc; if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
        const n = board[nr][nc]; if (!n?.locked || n.type === 'Balloon' || seen.has(n.id)) continue;

        const isMatch = (n.type === matchType || n.type === 'EbonyEyes' || matchType === 'EbonyEyes');
        if (isMatch) { seen.add(n.id); q.push([nr, nc]); }
      }
    }
    if (matchType === 'EbonyEyes') matchType = rand(TRAITS);
    clusters.push({ group, matchType });
  }
  return clusters;
}

function markPairs() {
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) if (board[r][c]) board[r][c].pair = false;
  getLockedClusters().forEach(c => {
    if (c.group.length === 2) {
      c.group.forEach(([r, cIdx, x]) => {
        if (!x.pair) {
          x.pair = true;
          playTone(440, 'sine', 0.1, 0.04);
          spawnFloatingScore(r, cIdx, 'PAIR 2', '#ff78e3');
        }
      });
    }
  });
}

function awardMatch(t, n, chain, isEbonyCombo = false) {
  const gain = 9 + (n - 3) * 3 + chain * 2;
  awardTraitProgress(t, gain, chain, isEbonyCombo);
  pressure = clamp(pressure - (9 + chain * 2), 0, 100);
  score += gain * 35 * comboVal;

  let msg = `CONNECTION 3 • ${t.toUpperCase()}`;
  if (n === 4) msg = `STRONG CONNECTION • ${t.toUpperCase()}`;
  else if (n === 5) msg = `LOVE STREAK! • ${t.toUpperCase()}`;
  else if (n >= 6) msg = `LEGACY COMBO! • ${t.toUpperCase()}`;
  if (isEbonyCombo) msg = `EBONY EYES COMBO! • ${t.toUpperCase()}`;
  toast(msg);
}

function awardTraitProgress(t, gain, chain, isEbonyCombo = false) {
  profile[t] = clamp(profile[t] + gain, 0, 100);
  matchedTraitCount[t]++;

  people.forEach((p, i) => {
    if (popped[i]) return;
    if (p.prefs.includes(t)) {
      interest[i] = clamp(interest[i] + (10 + chain * 2 + (isEbonyCombo ? 8 : 0)), 0, 100);
      contestantProgress[i][t] = (contestantProgress[i][t] || 0) + 1;
      neglectCounters[i] = 0;

      // Check if this contestant is in hidden mobile group
      const inHiddenGroup = (mobileGroup === 'A' && i >= 3) || (mobileGroup === 'B' && i < 3);
      if (inHiddenGroup) {
        const hiddenGrpKey = i < 3 ? 'A' : 'B';
        hiddenAlerts[hiddenGrpKey].react = true;
      }

      if (isEbonyCombo || chain >= 3 || gain >= 15) {
        triggerContestantReaction(i, 'large', `${p.name} loved that!`);
      } else if (chain === 2 || gain >= 10) {
        triggerContestantReaction(i, 'medium', `${p.name} noticed!`);
      } else {
        triggerContestantReaction(i, 'small', `+${t}`);
      }
    }
  });

  if (isEbonyCombo) {
    people.forEach((_, i) => {
      if (!popped[i]) triggerContestantReaction(i, 'room', 'EBONY EYES!');
    });
  }
}

function triggerContestantReaction(index, tier, text = '') {
  const contestantEl = document.querySelectorAll('.contestant')[index];
  if (!contestantEl) return;

  contestantEl.classList.remove('reactSmall', 'reactLarge', 'reactDisappoint', 'roomReaction');
  void contestantEl.offsetWidth;

  if (tier === 'small') contestantEl.classList.add('reactSmall');
  else if (tier === 'medium' || tier === 'large') contestantEl.classList.add('reactLarge');
  else if (tier === 'disappoint') contestantEl.classList.add('reactDisappoint');
  else if (tier === 'room') contestantEl.classList.add('roomReaction');

  if (text) {
    const bubble = document.createElement('div');
    bubble.className = 'reactBubble';
    bubble.textContent = text;
    contestantEl.appendChild(bubble);
    setTimeout(() => bubble.remove(), 1400);
  }
}

function spotlight() {
  if (spotlightCharges <= 0) { toastSmall('NO SPOTLIGHT CHARGES'); return; }
  const opp = chooseOpportunity(); if (!opp) { toastSmall('NO OPEN 2-CHAIN YET'); return; }
  spotlightCharges--;
  const lane = rand(opp.lanes); preview[lane] = opp.type;
  toast(`SPOTLIGHT • ${opp.type.toUpperCase()} ENTERING LANE ${lane + 1}`); renderPreview();
}

function tickSecond() {
  if (paused || ending) return; time = Math.max(0, time - 1); const p = progress();

  people.forEach((person, i) => {
    if (popped[i]) return;
    let decay = p < .24 ? .18 : p < .55 ? .14 : .11;
    if (onboardingGraceActive()) decay *= 0.78;
    const focus = inferFocus(); if (focus === i) decay *= .76;
    interest[i] -= decay + (pressure / 100) * .08;

    if (interest[i] < 22) {
      const hiddenGrpKey = i < 3 ? 'A' : 'B';
      const inHiddenGroup = (mobileGroup === 'A' && i >= 3) || (mobileGroup === 'B' && i < 3);
      if (inHiddenGroup) hiddenAlerts[hiddenGrpKey].danger = true;
    }
  });

  checkPops(); renderAll(); if (time <= 0 || popped.every(Boolean)) endGame();
}

function checkPops() { people.forEach((_, i) => { if (!popped[i] && interest[i] <= 1) popContestant(i); }); }
function popContestant(i) {
  popped[i] = true; interest[i] = 0; score = Math.max(0, score - 650); pressure = clamp(pressure + 5, 0, 100); renderContestants();
  toast(`${people[i].name.toUpperCase()} LOWERS THE BALLOON… POP`);
  document.body.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(2.1)' }, { filter: 'brightness(1)' }], { duration: 330 });
}

function renderAll() { markPairs(); renderBoard(); renderPreview(); renderContestants(); renderTraits(); renderHud(); updatePhase(); updateStatusLine(); requestAnimationFrame(ensureBoardFitsViewport); }

function renderBoard() {
  const el = document.querySelector('#board'); el.innerHTML = '';
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const d = document.createElement('div'); d.className = 'cell'; d.dataset.r = r; d.dataset.c = c;
    if (r === cursor.r && c === cursor.c) d.classList.add('cursor');
    const x = board[r][c];

    if (x) {
      d.classList.add(x.locked ? 'locked' : 'loose');
      if (x.type === 'Balloon') d.classList.add('balloon');
      if (x.type === 'EbonyEyes') d.classList.add('ebonyEyes');
      if (x.pair) d.classList.add('pair');
      if (!x.locked && x.type === 'EbonyEyes' && r >= ROWS - 2) d.classList.add('warningMiss');

      const art = document.createElement('div'); art.className = 'tileArt';
      d.dataset.trait = x.type;
      art.style.setProperty('--driftDelay', `${((r * 3 + c * 5) % 11) * 0.14}s`);
      if (x.type === 'EbonyEyes') {
        art.style.backgroundImage = `url("${EBONY_EYES_SVG}")`;
      } else if (x.type === 'Balloon') {
        art.style.backgroundImage = `url("${TILE_ASSET.Balloon}")`;
      } else {
        const variant = TRAIT_VARIANTS[x.type][x.variantIndex || 0];
        if (variant?.asset) {
          art.style.backgroundImage = `url("${variant.asset}")`;
        } else {
          art.style.backgroundImage = `url("${TILE_ASSET[x.type]}")`;
          art.setAttribute('data-icon', variant?.icon || TRAIT_ICONS[x.type]);
        }
        const badge = document.createElement('div');
        badge.className = 'variantBadge';
        badge.textContent = variant?.icon || TRAIT_ICONS[x.type] || '';
        d.appendChild(badge);
      }
      d.appendChild(art);
    }
    el.appendChild(d);
  }
}

function renderPreview() {
  const el = document.querySelector('#previewLanes'); el.className = 'previewGrid'; el.innerHTML = '';
  preview.forEach((type, idx) => {
    const d = document.createElement('div'); d.className = 'previewCell' + (type === 'Balloon' ? ' balloon' : type === 'EbonyEyes' ? ' ebonyEyes' : '');
    d.style.setProperty('--previewDelay', `${(idx % 7) * 0.08}s`);
    if (type === 'EbonyEyes') d.style.backgroundImage = `url("${EBONY_EYES_SVG}")`;
    else if (type) {
      d.style.backgroundImage = `url("${TILE_ASSET[type]}")`;
      const variant = TRAIT_VARIANTS[type]?.[chooseVariantIndex(type, idx)];
      if (variant?.icon) d.setAttribute('data-icon', variant.icon);
    }
    el.appendChild(d);
  });
}


function tileChipMarkup(type, current, target = null, mode = 'goal') {
  const safeCurrent = Math.max(0, Math.round(current || 0));
  const badge = target == null ? `${safeCurrent}` : `${Math.min(safeCurrent, target)}/${target}`;
  const label = target == null ? type : '';
  return `<div class="miniTileStat ${mode}" data-trait="${type}">
    <div class="miniTileArt" style="background-image:url('${type === 'EbonyEyes' ? EBONY_EYES_SVG : TILE_ASSET[type]}')"></div>
    <div class="miniTileMeta"><b>${badge}</b>${label ? `<small>${label}</small>` : ''}</div>
  </div>`;
}

function interestState(value){
  if (value >= 74) return { text:'GAINING', cls:'gaining' };
  if (value >= 58) return { text:'INTERESTED', cls:'interested' };
  if (value >= 42) return { text:'NEUTRAL', cls:'neutral' };
  if (value >= 25) return { text:'COOLING', cls:'cooling' };
  return { text:'LOSING', cls:'losing' };
}

function renderContestants() {
  const el = document.querySelector('#contestants'); el.innerHTML = '';
  people.forEach((p, i) => {
    const d = document.createElement('div');
    const state = interestState(interest[i]);
    d.className = 'contestant' +
      (popped[i] ? ' popped' : '') +
      (interest[i] < 22 && !popped[i] ? ' danger' : '') +
      (inferFocus() === i && !popped[i] ? ' focus' : '');

    const reqHtml = p.prefs.map(t => {
      const current = contestantProgress[i][t] || 0;
      const target = p.goals[t] || 5;
      const isDone = current >= target;
      return `<div class="goalSlot${isDone ? ' done' : ''}">${tileChipMarkup(t, current, target, 'goal')}</div>`;
    }).join('');

    d.innerHTML = `
      <div class="portrait" style="background-image:url('${p.img}')"></div>
      <div class="contestantInfo">
        <div class="contestantTopRow"><div class="cname">${p.name}</div><div class="heldBalloon"></div></div>
        <div class="reqRow">${reqHtml}</div>
        <div class="likertBlock ${state.cls}">
          <div class="likertScale"><span class="seg s1"></span><span class="seg s2"></span><span class="seg s3"></span><span class="seg s4"></span><span class="seg s5"></span><i class="likertMarker" style="left:${clamp(interest[i],0,100)}%"></i></div>
          <div class="likertLabels"><span>LOSING</span><b class="stateLabel">${state.text}</b><span>GAINING</span></div>
        </div>
      </div>`;
    el.appendChild(d);
  });
}

function renderTraits() {
  const el = document.querySelector('#traits');
  if (el) el.innerHTML = '';
  const ribbon = document.querySelector('#traitsRibbon');
  if (ribbon) ribbon.innerHTML = '';

  TRAITS.forEach(t => {
    const pct = Math.round(profile[t]);
    if (el) {
      const d = document.createElement('div'); d.className = 'trait';
      d.innerHTML = `<span>${TRAIT_ICONS[t]} ${t}</span><div class="bar"><i style="width:${profile[t]}%"></i></div><b>${pct}</b>`;
      el.appendChild(d);
    }
    if (ribbon) {
      const d = document.createElement('div');
      d.innerHTML = tileChipMarkup(t, matchedTraitCount[t] || 0, null, 'profile');
      ribbon.appendChild(d.firstElementChild);
    }
  });

  const qualitiesEl = document.querySelector('#qualities');
  if (qualitiesEl) {
    qualitiesEl.innerHTML = Object.entries(profile).filter(([, v]) => v >= 72).map(([k]) => `<span class="chip good">${k}</span>`).join('') || '<span class="chip">Building…</span>';
  }
  const flagsEl = document.querySelector('#flags');
  if (flagsEl) {
    const flags = [];
    if (pressure > 55) flags.push('Board Pressure');
    if (failedLocks > matches + 2) flags.push('Off Rhythm');
    if (balloonHits > 1) flags.push('Balloon Damage');
    flagsEl.innerHTML = flags.map(f => `<span class="chip bad">${f}</span>`).join('') || '<span class="chip">None</span>';
  }
}

function renderHud() {
  const timerEl = document.querySelector('#timer'); if (timerEl) timerEl.textContent = `${String(Math.floor(time / 60)).padStart(2, '0')}:${String(time % 60).padStart(2, '0')}`;
  const locksEl = document.querySelector('#locks'); if (locksEl) locksEl.textContent = `Locks ${locks}`;
  const scoreEl = document.querySelector('#score'); if (scoreEl) scoreEl.textContent = score.toLocaleString();
  const comboEl = document.querySelector('#comboVal'); if (comboEl) comboEl.textContent = `x${comboVal}`;
  const comboBadge = document.querySelector('#comboBadge'); if (comboBadge) comboBadge.textContent = `COMBO x${comboVal}`;
  const mobCombo = document.querySelector('#mobileComboBadge'); if (mobCombo) mobCombo.textContent = `x${comboVal}`;

  const remaining = popped.filter(x => !x).length;
  const balloonStr = '🎈'.repeat(remaining) + '✕'.repeat(Math.max(0, people.length - remaining));
  const balloonIconRow = document.querySelector('#balloonIconRow'); if (balloonIconRow) balloonIconRow.textContent = balloonStr;
  const mobBalloons = document.querySelector('#mobBalloons'); if (mobBalloons) mobBalloons.textContent = balloonStr;

  const averageInterest = interest.reduce((a, b) => a + b, 0) / people.length;
  const loveGaugePct = clamp((averageInterest * 0.5 + comboVal * 8 + (streak * 3)), 5, 100);
  const gaugeBar = document.querySelector('#loveGaugeBar'); if (gaugeBar) gaugeBar.style.width = loveGaugePct + '%';
  const mobLoveBar = document.querySelector('#mobLoveBar'); if (mobLoveBar) mobLoveBar.style.width = loveGaugePct + '%';

  let stateTextStr = 'COOL';
  if (loveGaugePct > 85) stateTextStr = 'EBONY EYES';
  else if (loveGaugePct > 68) stateTextStr = 'ON FIRE';
  else if (loveGaugePct > 48) stateTextStr = 'HOT';
  else if (loveGaugePct > 28) stateTextStr = 'WARM';

  const stateText = document.querySelector('#loveStateText'); if (stateText) stateText.textContent = stateTextStr;
  const mobLoveState = document.querySelector('#mobLoveState'); if (mobLoveState) mobLoveState.textContent = stateTextStr;
  const pressBar = document.querySelector('#pressureBar'); if (pressBar) pressBar.style.width = pressure + '%';
  const mobPressBar = document.querySelector('#mobPressureBar'); if (mobPressBar) mobPressBar.style.width = pressure + '%';
  const pressText = document.querySelector('#pressureText'); if (pressText) pressText.textContent = pressure < 25 ? 'CALM' : pressure < 50 ? 'BUILDING' : pressure < 75 ? 'DANGER' : 'CRITICAL';
}


function updatePhase() { const ph = phaseInfo(); document.querySelector('#phaseLabel').textContent = ph.label; document.querySelector('#phaseHelp').textContent = ph.help; }

function updateStatusLine() {
  const x = board[cursor.r][cursor.c], plans = analyzePlans();
  let s = `Cursor: row ${cursor.r + 1}, lane ${cursor.c + 1}`;
  if (x?.type === 'Balloon') s += ' • Red balloon passing here — move.';
  else if (x?.type === 'EbonyEyes') s += x.locked ? ' • EBONY EYES is locked (Wildcard) — SPACE unlocks it.' : ' • EBONY EYES wildcard passing — SPACE locks it!';
  else if (x?.locked) s += ` • ${x.type} is locked — SPACE unlocks it.`;
  else if (x) s += ` • ${x.type} passing — SPACE locks it.`;
  else s += ' • Empty cell — watch the flow.';
  const pair = plans.find(p => p.size === 2); if (pair) s += ` • Live 2-chain: ${pair.type}.`;
  document.querySelector('#statusLine').textContent = s;
}

function flashCell(r, c) { const el = document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`); el?.classList.add('hit'); }
function toast(msg) { const el = document.querySelector('#toast'); el.textContent = msg; el.classList.remove('showToast'); void el.offsetWidth; el.classList.add('showToast'); }
function toastSmall(msg) { document.querySelector('#statusLine').textContent = msg; }

function endGame() {
  if (ending) return; ending = true; clearInterval(secondTimer); clearTimeout(flowTimeout); if (audio) audio.pause();
  document.body.classList.remove('game-playing');
  document.querySelector('#game').classList.remove('active'); document.querySelector('#end').classList.add('active');
  const alive = people.map((p, i) => !popped[i] ? { p, i, compat: p.prefs.reduce((s, t) => s + profile[t], 0) / 3 } : null).filter(Boolean).sort((a, b) => b.compat - a.compat);
  let title, text;
  if (!alive.length) { title = 'EVERY BALLOON POPPED'; text = 'The flow got away from you. Run it back and lock with a plan.'; }
  else { title = alive.length === 6 ? 'PERFECT ROOM' : 'FINAL COMPATIBILITY'; text = `${alive[0].p.name} stayed in and finished with ${Math.round(alive[0].compat)}% profile compatibility.`; }
  document.querySelector('#endTitle').textContent = title; document.querySelector('#endText').textContent = text;
  document.querySelector('#endStats').innerHTML = `<p>Score ${score.toLocaleString()} • Connections ${matches} • Locks ${locks} • Best streak ${maxStreak} • Balloon hits ${balloonHits}</p>`;
}

/* Event Listeners & Direct Touch Tapping */
document.addEventListener('keydown', e => {
  if (!started || ending) return; const k = e.key.toLowerCase(); if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', ' ', 'a', 'd', 'w', 's'].includes(k)) e.preventDefault();
  if (k === 'arrowleft' || k === 'a') moveCursor(0, -1); else if (k === 'arrowright' || k === 'd') moveCursor(0, 1); else if (k === 'arrowup' || k === 'w') moveCursor(-1, 0); else if (k === 'arrowdown' || k === 's') moveCursor(1, 0); else if (k === ' ') lockAtCursor();
  fadeHintBanner();
});

document.addEventListener('click', e => {
  const boardCell = e.target.closest('#board .cell');
  if (boardCell && started && !ending) {
    const r = parseInt(boardCell.dataset.r, 10);
    const c = parseInt(boardCell.dataset.c, 10);
    if (!isNaN(r) && !isNaN(c)) {
      fadeHintBanner();
      if (cursor.r === r && cursor.c === c) {
        lockAtCursor();
      } else {
        cursor.r = r;
        cursor.c = c;
        cursorMoves++;
        renderBoard();
        updateStatusLine();
        lockAtCursor();
      }
      return;
    }
  }

  const b = e.target.closest('[data-act]'); if (!b) return; const a = b.dataset.act;
  fadeHintBanner();
  if (a === 'left') moveCursor(0, -1); if (a === 'right') moveCursor(0, 1); if (a === 'up') moveCursor(-1, 0); if (a === 'down') moveCursor(1, 0); if (a === 'lock') lockAtCursor();
});

window.addEventListener('resize', () => { if (document.querySelector('#game').classList.contains('active')) { updateBoardGeometry(); renderAll(); } });
