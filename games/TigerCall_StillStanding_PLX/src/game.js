(() => {
  'use strict';

  // SEMANTIC EVENT BUS FOR AGENT 2 (SPECTACLE AGENT) & GAMEPLAY HOOKS
  class EventBus {
    constructor() {
      this.listeners = new Map();
    }
    on(event, handler) {
      if (!this.listeners.has(event)) this.listeners.set(event, []);
      this.listeners.get(event).push(handler);
    }
    off(event, handler) {
      if (!this.listeners.has(event)) return;
      const list = this.listeners.get(event).filter(h => h !== handler);
      this.listeners.set(event, list);
    }
    emit(event, payload = {}) {
      if (this.listeners.has(event)) {
        this.listeners.get(event).forEach(handler => {
          try { handler(payload); } catch (e) { console.error(`EventBus error on ${event}:`, e); }
        });
      }
    }
  }

  window.TigerCallEventBus = new EventBus();

  // DOM Elements & Canvas references initialized on load
  let canvas, ctx, video, loader, loaderText;
  const $ = id => document.getElementById(id);
  let UI = {};

  // Rhythm Engine Calibration & Constants
  const BPM = 198;
  const BEAT = 60 / BPM;
  const DURATION = 94.876735;
  const APPROACH_TIME = 1.45;
  const HIT_Y_RATIO = 0.84;

  let globalAudioOffsetSec = 0.00;
  let globalInputOffsetMs = 0;

  // 3-Finger Ergonomic Control Mappings (LEFT: index, DOWN: middle, RIGHT: ring, UP: middle reach)
  const laneKeys = {
    ArrowLeft: 0, KeyA: 0,
    ArrowDown: 1, KeyS: 1,
    ArrowRight: 2, KeyD: 2,
    ArrowUp: 3, KeyW: 3
  };

  // Performance Station Instrument Asset Preloader
  const assetPackBase = 'assets/TigerCall_PerformanceStations_AssetPack/';
  const images = {};
  const imageNames = [
    '01_INSTRUMENT_ICONS/bass_drum.png',
    '01_INSTRUMENT_ICONS/snare.png',
    '01_INSTRUMENT_ICONS/cymbal.png',
    '01_INSTRUMENT_ICONS/quads.png',
    '01_INSTRUMENT_ICONS/trumpet.png',
    '01_INSTRUMENT_ICONS/trombone.png',
    '01_INSTRUMENT_ICONS/brass_ensemble.png',
    '01_INSTRUMENT_ICONS/sousaphone.png',
    '02_PAW_RECEPTORS/paw_idle.png',
    '02_PAW_RECEPTORS/paw_ready.png',
    '02_PAW_RECEPTORS/paw_hit.png',
    '02_PAW_RECEPTORS/paw_perfect.png',
    '02_PAW_RECEPTORS/paw_hold.png',
    '02_PAW_RECEPTORS/paw_ultra.png',
    '02_PAW_RECEPTORS/paw_miss.png'
  ];

  function preloadAssets() {
    imageNames.forEach(name => {
      const img = new Image();
      img.src = assetPackBase + name;
      const key = name.split('/').pop().replace('.png', '');
      images[key] = img;
    });
  }
  preloadAssets();

  // 14 Authoritative Studio One Markers with Section Instrument Station Mappings
  const authoritativeMarkers = [
    { name: 'START', t: 0.0, banner: 'ENTER THE FORMATION', cam: 'march', mapping: ['bass_drum', 'snare', 'dormant', 'dormant'], activeCount: 2 },
    { name: 'HORNS 1', t: 4.746208, banner: 'HORNS — STEP IN TIME', cam: 'brass', mapping: ['trumpet', 'trombone', 'brass_ensemble', 'sousaphone'], activeCount: 4 },
    { name: 'DRUMS 1', t: 9.640375, banner: 'DRUMLINE — LOCK THE POCKET', cam: 'drums', mapping: ['bass_drum', 'snare', 'cymbal', 'quads'], activeCount: 4 },
    { name: 'HORNS 2', t: 19.090375, banner: 'BRASS ATTACK — CALL & RESPONSE', cam: 'brass', mapping: ['trumpet', 'trombone', 'brass_ensemble', 'sousaphone'], activeCount: 4 },
    { name: 'DRUM 2', t: 26.611624, banner: 'DRUM CADENCE ROLL STREAM', cam: 'drums', mapping: ['bass_drum', 'snare', 'cymbal', 'quads'], activeCount: 4 },
    { name: 'POWER UP', t: 27.833917, banner: 'POWER UP CHARGING!', cam: 'rush', mapping: ['bass_drum', 'snare', 'cymbal', 'quads'], activeCount: 4 },
    { name: 'HORN 3 / HOLDS', t: 29.004169, banner: 'HOLD THE CADENCE', cam: 'brass', mapping: ['trumpet', 'trombone', 'brass_ensemble', 'sousaphone'], activeCount: 4 },
    { name: 'FULL BAND 1', t: 45.691648, banner: 'FULL BAND — LEFT RHYTHM / RIGHT BRASS', cam: 'wide', mapping: ['bass_drum', 'snare', 'brass_ensemble', 'sousaphone'], activeCount: 4 },
    { name: 'ULTRA TIGER POWER UP', t: 52.350388, banner: 'ULTRA TIGER HYPE!', cam: 'rush', mapping: ['bass_drum', 'snare', 'brass_ensemble', 'sousaphone'], activeCount: 4 },
    { name: 'BUTTON MASH / HOLDS', t: 52.939136, banner: 'HYBRID MODE — CADENCE ROLL & STRIKE', cam: 'switch', mapping: ['snare', 'quads', 'brass_ensemble', 'sousaphone'], activeCount: 4 },
    { name: 'HYPE CROWD', t: 61.361316, banner: 'STADIUM REWARD GROOVE', cam: 'wide', mapping: ['bass_drum', 'snare', 'cymbal', 'quads'], activeCount: 4 },
    { name: 'DRUMS 3', t: 63.712854, banner: 'DRUMLINE RUSH', cam: 'drums', mapping: ['bass_drum', 'snare', 'cymbal', 'quads'], activeCount: 4 },
    { name: 'FULL BAND 2', t: 82.891597, banner: 'SHOWTIME — MAXIMUM HYPE', cam: 'rush', mapping: ['bass_drum', 'snare', 'brass_ensemble', 'sousaphone'], activeCount: 4 },
    { name: 'LAST NOTE (SLAM)', t: 89.648907, banner: 'TIGER CALL! ALL 4 STATIONS READY', cam: 'finale', mapping: ['bass_drum', 'snare', 'brass_ensemble', 'sousaphone'], activeCount: 4 }
  ];

  // Game Engine State Variables
  let authoritativeChartData = null;
  let sectionDebugReports = [];
  let notes = [];
  let particles = [];
  let shockwaves = [];
  let floatingTexts = [];
  let running = false;
  let paused = false;

  // Authoritative Audio Clock State
  let lastVideoTime = 0;
  let lastRealTime = 0;
  let songTime = 0;

  // Performance & Score Tracking
  let score = 0;
  let combo = 0;
  let maxCombo = 0;
  let hype = 0;
  let tigerPerfectCount = 0;
  let perfectCount = 0;
  let greatCount = 0;
  let goodCount = 0;
  let missCount = 0;
  let sectionIndex = -1;
  let tigerCallActive = false;
  let heldLanes = new Set();
  let laneHitState = [0, 0, 0, 0];

  // Active Note Telemetry
  let activeTelemetryNote = null;

  // Screen Displacement Feedback & FX
  let flashAlpha = 0;
  let screenImpulseX = 0;
  let screenImpulseY = 0;

  // Telemetry & Debug Statistics
  let showDebugPanel = false;
  let autoBotActive = false;
  let hitDeltas = [];
  let lastHitInfo = 'NONE';
  let frameCount = 0;
  let lastFpsCalcTime = performance.now();
  let currentFps = 60;

  window.TIGER_BOT = false;

  function initUI() {
    canvas = $('gameCanvas') || $('spectacleCanvas');
    if (!canvas) return false;
    ctx = canvas.getContext('2d');
    video = $('performanceVideo');
    loader = $('videoLoader');
    loaderText = $('videoLoaderText');

    UI = {
      section: $('sectionName'),
      hypeFill: $('hypeFill'),
      hypeText: $('hypeText'),
      score: $('scoreText'),
      combo: $('comboText'),
      judge: $('judgeText'),
      banner: $('sectionBanner'),
      bannerText: $('bannerText'),
      call: $('callPrompt'),
      start: $('startScreen'),
      pause: $('pauseScreen'),
      result: $('resultScreen'),
      debugPanel: $('debugPanel'),
      debugBtn: $('debugBtn'),
      closeDebugBtn: $('closeDebugBtn'),
      dbgBotBtn: $('dbgBotBtn'),
      dbgTime: $('dbgTime'),
      dbgBeat: $('dbgBeat'),
      dbgFps: $('dbgFps'),
      dbgBpm: $('dbgBpm'),
      dbgSectionName: $('dbgSectionName'),
      dbgSectionSource: $('dbgSectionSource'),
      dbgSectionDensity: $('dbgSectionDensity'),
      dbgPlayableCount: $('dbgPlayableCount'),
      dbgLaneDist: $('dbgLaneDist'),
      dbgLastHit: $('dbgLastHit')
    };

    if (video) {
      video.addEventListener('waiting', () => {
        if (running && !paused) {
          loaderText.textContent = 'BUFFERING STADIUM VIDEO...';
          loader.classList.add('active');
        }
      });
      video.addEventListener('canplaythrough', () => {
        loaderText.textContent = 'READY TO MARCH';
        setTimeout(() => loader.classList.remove('active'), 400);
      });
      video.addEventListener('playing', () => {
        loader.classList.remove('active');
      });
      video.addEventListener('ended', finishGame);
    }

    if (UI.debugBtn) {
      UI.debugBtn.onclick = () => {
        showDebugPanel = !showDebugPanel;
        UI.debugPanel.classList.toggle('active', showDebugPanel);
      };
    }

    if (UI.closeDebugBtn) {
      UI.closeDebugBtn.onclick = () => {
        showDebugPanel = false;
        UI.debugPanel.classList.remove('active');
      };
    }

    if (UI.dbgBotBtn) {
      UI.dbgBotBtn.onclick = () => {
        autoBotActive = !autoBotActive;
        window.TIGER_BOT = autoBotActive;
        UI.dbgBotBtn.textContent = autoBotActive ? 'ON' : 'OFF';
        UI.dbgBotBtn.classList.toggle('active', autoBotActive);
      };
    }

    if ($('startBtn')) $('startBtn').onclick = startGame;
    if ($('replayBtn')) $('replayBtn').onclick = startGame;
    if ($('pauseBtn')) $('pauseBtn').onclick = () => togglePause();
    if ($('resumeBtn')) $('resumeBtn').onclick = () => togglePause(true);

    resizeCanvas();
    return true;
  }

  async function loadAuthoritativeChart() {
    try {
      const res = await fetch('assets/TigerCall_AUTHORITATIVE_CHART.json');
      if (res.ok) {
        authoritativeChartData = await res.json();
        if (authoritativeChartData.section_debug_reports) {
          sectionDebugReports = authoritativeChartData.section_debug_reports;
        }
      }
    } catch (e) {
      console.warn('Fallback chart used.');
    }
  }

  function resizeCanvas() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resizeCanvas);

  function updateAudioClock() {
    if (!video || !running || paused) return songTime;
    const now = performance.now();
    const vTime = video.currentTime;
    if (vTime !== lastVideoTime) {
      lastVideoTime = vTime;
      lastRealTime = now;
      songTime = vTime + globalAudioOffsetSec;
    } else {
      const dt = (now - lastRealTime) / 1000;
      songTime = lastVideoTime + dt + globalAudioOffsetSec;
    }
    return songTime;
  }

  function getSectionInfo(t) {
    let idx = 0;
    for (let i = 0; i < authoritativeMarkers.length; i++) {
      if (t >= authoritativeMarkers[i].t) idx = i;
    }
    return [authoritativeMarkers[idx], idx];
  }

  function prepareChart() {
    notes = [];
    if (authoritativeChartData && authoritativeChartData.notes && authoritativeChartData.notes.length > 0) {
      notes = authoritativeChartData.notes.map(n => ({
        hitTime: n.t,
        lane: n.lane,
        instrument: n.instrument || 'bass_drum',
        type: n.type || 'tap',
        duration: n.duration || 0,
        chord: n.chord || false,
        marker: n.marker || 'START',
        hit: false,
        missed: false
      }));
    } else {
      const startOffset = 0.62;
      let b = 0;
      for (let t = startOffset; t < DURATION - 1.0; t += BEAT, b++) {
        let lane = [0, 1, 2, 1, 3, 1][b % 6];
        let type = (b % 16 === 8) ? 'hold' : 'tap';
        let duration = type === 'hold' ? BEAT * 2 : 0;
        let chord = (b % 16 === 0);
        let instrument = ['bass_drum', 'snare', 'cymbal', 'quads'][lane];
        notes.push({
          hitTime: t, lane, instrument, type, duration, chord, hit: false, missed: false
        });
      }
    }
    notes.sort((a, b) => a.hitTime - b.hitTime);
  }

  function resetGame() {
    prepareChart();
    particles = [];
    shockwaves = [];
    floatingTexts = [];
    score = combo = maxCombo = hype = 0;
    tigerPerfectCount = perfectCount = greatCount = goodCount = missCount = 0;
    sectionIndex = -1;
    tigerCallActive = false;
    heldLanes.clear();
    laneHitState = [0, 0, 0, 0];
    flashAlpha = 0;
    screenImpulseX = screenImpulseY = 0;
    hitDeltas = [];
    lastHitInfo = 'NONE';
    activeTelemetryNote = null;

    if (UI.score) UI.score.textContent = '0000000';
    if (UI.combo) UI.combo.textContent = '0';
    if (UI.hypeFill) UI.hypeFill.style.width = '0%';
    if (UI.hypeText) UI.hypeText.textContent = '0%';
    if (UI.judge) UI.judge.textContent = 'READY';
  }

  function startGame() {
    resetGame();
    if (UI.start) UI.start.classList.remove('active');
    if (UI.result) UI.result.classList.remove('active');

    video.currentTime = 0;
    video.volume = 0.92;

    const launchLoop = () => {
      running = true;
      paused = false;
      lastVideoTime = video.currentTime;
      lastRealTime = performance.now();
      requestAnimationFrame(gameLoop);
    };

    video.play().then(launchLoop).catch(() => {
      video.muted = true;
      video.play().then(launchLoop).catch(() => {
        launchLoop();
      });
    });
  }

  function togglePause(forceResume = false) {
    if (!running) return;
    if (!paused && !forceResume) {
      paused = true;
      if (video) video.pause();
      if (UI.pause) UI.pause.classList.add('active');
    } else {
      paused = false;
      if (UI.pause) UI.pause.classList.remove('active');
      if (video) video.play();
      lastVideoTime = video.currentTime;
      lastRealTime = performance.now();
      requestAnimationFrame(gameLoop);
    }
  }

  function updateSection(s, idx) {
    if (idx === sectionIndex) return;
    sectionIndex = idx;
    if (UI.section) UI.section.textContent = s.name;
    if (UI.bannerText) UI.bannerText.textContent = s.banner;
    if (UI.banner) {
      UI.banner.classList.add('show');
      setTimeout(() => UI.banner.classList.remove('show'), 1600);
    }

    triggerScreenImpulse(0, 10);

    const cameraTransforms = {
      march: 'scale(1.12) translateY(1%)',
      drums: 'scale(1.26) translate(-4%, 3%)',
      brass: 'scale(1.24) translate(5%, -2%)',
      wide: 'scale(1.04)',
      switch: 'scale(1.18) translate(-2%, 0)',
      rush: 'scale(1.28) translate(3%, 1%)',
      finale: 'scale(1.10) translateY(-1%)'
    };
    if (video) video.dataset.base = cameraTransforms[s.cam] || 'scale(1.1)';

    const activeReport = sectionDebugReports.find(r => r.section === s.name);
    const sourceDesc = activeReport ? activeReport.source : (s.name.includes('Horn') ? 'Human Horn Consensus' : 'Human Drum Consensus');

    window.TigerCallEventBus.emit('SECTION_CHANGED', {
      sectionName: s.name,
      mapping: s.mapping,
      activeCount: s.activeCount,
      source: sourceDesc,
      timestamp: songTime
    });

    if (s.name === 'POWER UP') {
      window.TigerCallEventBus.emit('POWER_UP', { timestamp: songTime });
    } else if (s.name === 'ULTRA TIGER POWER UP') {
      window.TigerCallEventBus.emit('ULTRA_TIGER', { timestamp: songTime });
    } else if (s.name.includes('LAST NOTE')) {
      window.TigerCallEventBus.emit('TIGER_CALL_READY', { timestamp: songTime });
    }
  }

  function drawTigerPaw(ctx, x, y, scale, rotation = 0, style = 'orange', alpha = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;

    let primaryColor = '#FF5A00';
    let secondaryColor = '#FF8800';
    let highlightColor = '#FFFFFF';
    let glowColor = 'rgba(255, 90, 0, 0.7)';

    if (style === 'white' || style === 'perfect') {
      primaryColor = '#FFFFFF';
      secondaryColor = '#FFD700';
      highlightColor = '#FFFFFF';
      glowColor = 'rgba(255, 255, 255, 0.9)';
    } else if (style === 'accent') {
      primaryColor = '#FF3300';
      secondaryColor = '#FF9900';
      highlightColor = '#FFF';
      glowColor = 'rgba(255, 51, 0, 0.8)';
    }

    if (glowColor !== 'transparent') {
      ctx.shadowBlur = style === 'perfect' ? 25 : 14;
      ctx.shadowColor = glowColor;
    }

    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.moveTo(0, 8);
    ctx.bezierCurveTo(-14, 8, -20, -6, -11, -12);
    ctx.bezierCurveTo(-6, -15, 0, -8, 0, -8);
    ctx.bezierCurveTo(0, -8, 6, -15, 11, -12);
    ctx.bezierCurveTo(20, -6, 14, 8, 0, 8);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = 1.8;
    ctx.stroke();

    const toes = [
      { x: -14, y: -20, rx: 4.5, ry: 6.5, rot: -0.3 },
      { x: -5,  y: -25, rx: 5.0, ry: 7.5, rot: -0.1 },
      { x: 5,   y: -25, rx: 5.0, ry: 7.5, rot: 0.1 },
      { x: 14,  y: -20, rx: 4.5, ry: 6.5, rot: 0.3 }
    ];

    toes.forEach(t => {
      ctx.save();
      ctx.translate(t.x, t.y);
      ctx.rotate(t.rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, t.rx, t.ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = primaryColor;
      ctx.fill();
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(-1, -2, t.rx * 0.4, t.ry * 0.4, 0, 0, Math.PI * 2);
      ctx.fillStyle = highlightColor;
      ctx.fill();
      ctx.restore();
    });

    ctx.restore();
  }

  function drawPerformanceStations(cx, roadW, H, currentSection) {
    const y = H * HIT_Y_RATIO;
    const mapping = currentSection ? currentSection.mapping : ['bass_drum', 'snare', 'cymbal', 'quads'];
    const activeCount = currentSection ? currentSection.activeCount : 4;
    const directionLabels = ['←', '↓', '→', '↑'];

    for (let l = 0; l < 4; l++) {
      const x = laneX(l, cx, roadW);
      const isHeld = heldLanes.has(l);
      const hitTimer = laneHitState[l];
      const fever = hype >= 90;
      const instrumentKey = mapping[l];
      const isDormant = l >= activeCount || instrumentKey === 'dormant';

      ctx.save();
      ctx.translate(x, y);

      ctx.globalAlpha = isDormant ? 0.35 : 1.0;

      ctx.beginPath();
      ctx.arc(0, 0, 36, 0, Math.PI * 2);
      ctx.fillStyle = isHeld ? 'rgba(255, 90, 0, 0.85)' : 'rgba(10, 6, 4, 0.90)';
      ctx.fill();

      ctx.strokeStyle = fever ? '#FFD700' : isHeld ? '#FFFFFF' : '#FF5A00';
      ctx.lineWidth = isHeld || hitTimer > 0 ? 4.5 : 3;
      ctx.stroke();

      if ((fever || hitTimer > 0 || isHeld) && !isDormant) {
        ctx.shadowBlur = hitTimer > 0 ? 30 : 16;
        ctx.shadowColor = fever ? '#FFD700' : '#FF5A00';
        ctx.beginPath();
        ctx.arc(0, 0, 38 + (hitTimer > 0 ? 6 : 0), 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 90, 0, 0.6)';
        ctx.stroke();
      }

      const pawScale = 1.05 + (hitTimer > 0 ? 0.2 : 0) + (isHeld ? 0.1 : 0);
      const pawStyle = hitTimer > 0 ? 'perfect' : isHeld ? 'white' : 'orange';
      drawTigerPaw(ctx, 0, 0, pawScale, 0, pawStyle, isHeld ? 1.0 : 0.85);

      if (!isDormant && images[instrumentKey] && images[instrumentKey].complete) {
        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#FF5A00';
        ctx.drawImage(images[instrumentKey], -18, -18, 36, 36);
        ctx.restore();
      }

      ctx.fillStyle = isHeld ? '#000' : '#FFF';
      ctx.font = '900 13px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#000';
      ctx.fillText(`[${directionLabels[l]}]`, 0, 26);

      ctx.restore();

      if (laneHitState[l] > 0) laneHitState[l] -= 0.08;
    }
  }

  function laneX(laneIndex, cx, roadWidth) {
    return cx - roadWidth / 2 + roadWidth * (laneIndex + 0.5) / 4;
  }

  function judgeInput(lane) {
    if (!running || paused) return;

    const currentSongTime = updateAudioClock();
    let bestNote = null;
    let minDeltaSec = 999;

    for (const n of notes) {
      if (n.hit || n.missed || n.lane !== lane) continue;
      const deltaSec = Math.abs(n.hitTime - currentSongTime);
      if (deltaSec < minDeltaSec) {
        bestNote = n;
        minDeltaSec = deltaSec;
      }
      if (n.hitTime > currentSongTime + 0.25) break;
    }

    const timingErrorMs = (currentSongTime - (bestNote ? bestNote.hitTime : 0)) * 1000 + globalInputOffsetMs;
    const absErrorMs = Math.abs(timingErrorMs);

    if (bestNote && absErrorMs <= 140) {
      bestNote.hit = true;
      laneHitState[lane] = 1.0;
      activeTelemetryNote = bestNote;

      let j = 'GOOD';
      let pts = 450;
      let hypeAdd = 1.0;

      if (absErrorMs <= 25) {
        j = 'TIGER PERFECT';
        pts = 1000;
        hypeAdd = 3.0;
        tigerPerfectCount++;
        window.TigerCallEventBus.emit('TIGER_PERFECT', { noteId: bestNote.id, lane, errorMs: timingErrorMs });
      } else if (absErrorMs <= 50) {
        j = 'PERFECT';
        pts = 850;
        hypeAdd = 2.2;
        perfectCount++;
      } else if (absErrorMs <= 85) {
        j = 'GREAT';
        pts = 600;
        hypeAdd = 1.5;
        greatCount++;
      } else {
        j = 'GOOD';
        pts = 400;
        hypeAdd = 0.8;
        goodCount++;
      }

      combo++;
      maxCombo = Math.max(maxCombo, combo);
      score += Math.round(pts * (1 + Math.min(combo, 100) / 100 * 2));
      hype = Math.min(100, hype + hypeAdd);

      const earlyLateStr = timingErrorMs < 0 ? `${Math.round(timingErrorMs)}ms EARLY` : `+${Math.round(timingErrorMs)}ms LATE`;
      if (UI.judge) UI.judge.textContent = j === 'TIGER PERFECT' ? 'TIGER PERFECT!' : j;
      lastHitInfo = `${j} (${earlyLateStr})`;
      hitDeltas.push(timingErrorMs);

      flashAlpha = j.includes('PERFECT') ? 0.8 : 0.4;
      triggerScreenImpulse(timingErrorMs < 0 ? -3 : 3, j.includes('PERFECT') ? -4 : -2);

      spawnHitFX(lane, j, earlyLateStr);
      playSynthSFX(j);

      window.TigerCallEventBus.emit('NOTE_HIT', {
        noteId: bestNote.id,
        lane,
        instrument: bestNote.instrument,
        judgment: j,
        errorMs: timingErrorMs
      });

      if (bestNote.chord) {
        window.TigerCallEventBus.emit('CHORD_HIT', { lane, timestamp: currentSongTime });
      }

      if (combo % 25 === 0) {
        window.TigerCallEventBus.emit('COMBO_MILESTONE', { combo });
      }

      if (bestNote.type === 'hold') {
        heldLanes.add(lane);
        window.TigerCallEventBus.emit('HOLD_STARTED', { noteId: bestNote.id, lane });
      }
    } else {
      combo = 0;
      hype = Math.max(0, hype - 2.0);
      if (UI.judge) UI.judge.textContent = 'OFF BEAT';
      lastHitInfo = 'OFF BEAT (MISS)';
      playSynthSFX('bad');
      triggerScreenImpulse(0, 4);
    }

    updateHUD();
    checkTigerCallSlam();
  }

  function releaseLaneInput(lane) {
    if (heldLanes.has(lane)) {
      window.TigerCallEventBus.emit('HOLD_RELEASED', { lane, timestamp: songTime });
    }
    heldLanes.delete(lane);
  }

  function checkTigerCallSlam() {
    if (hype >= 95 && heldLanes.size >= 4 && !tigerCallActive) {
      tigerCallActive = true;
      hype = 100;
      score += 30000;
      flashAlpha = 1.0;
      triggerScreenImpulse(0, -18);

      if (UI.call) {
        UI.call.classList.add('live');
        setTimeout(() => UI.call.classList.remove('live'), 2000);
      }
      playSynthSFX('call');

      window.TigerCallEventBus.emit('TIGER_CALL_HIT', { timestamp: songTime });

      for (let i = 0; i < 90; i++) {
        spawnParticle(window.innerWidth / 2, window.innerHeight * 0.45, true);
      }
    }
  }

  function updateHUD() {
    if (UI.score) UI.score.textContent = String(score).padStart(7, '0');
    if (UI.combo) UI.combo.textContent = combo;
    if (UI.hypeFill) UI.hypeFill.style.width = hype + '%';
    if (UI.hypeText) UI.hypeText.textContent = Math.round(hype) + '%';
    if (video) video.style.filter = `saturate(${1.2 + hype / 180}) contrast(${1.1 + hype / 500}) brightness(${0.58 + hype / 350})`;
    window.TigerCallEventBus.emit('HYPE_LEVEL_CHANGED', { hype });
  }

  function auditMissedNotes(currentSongTime) {
    for (const n of notes) {
      if (n.hit || n.missed) continue;
      if (currentSongTime - n.hitTime > 0.15) {
        n.missed = true;
        missCount++;
        combo = 0;
        hype = Math.max(0, hype - 2.5);
        if (UI.judge) UI.judge.textContent = 'MISS';
        updateHUD();
      }
      if (n.hitTime > currentSongTime + 0.3) break;
    }
  }

  function triggerScreenImpulse(dx, dy) {
    screenImpulseX = dx;
    screenImpulseY = dy;
  }

  function spawnHitFX(lane, judgment, earlyLateText) {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const roadW = Math.min(W * 0.72, 840);
    const x = laneX(lane, W / 2, roadW);
    const y = H * HIT_Y_RATIO;

    shockwaves.push({ x, y, r: 30, maxR: judgment.includes('PERFECT') ? 85 : 60, alpha: 1.0 });

    const particleCount = judgment === 'TIGER PERFECT' ? 22 : judgment === 'PERFECT' ? 14 : 8;
    for (let i = 0; i < particleCount; i++) {
      spawnParticle(x, y, judgment.includes('PERFECT'));
    }

    floatingTexts.push({
      x, y: y - 20,
      text: earlyLateText,
      alpha: 1.0,
      vy: -1.2,
      color: earlyLateText.includes('EARLY') ? '#FFD700' : '#00FFFF'
    });
  }

  function spawnParticle(x, y, isBig) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * (isBig ? 14 : 7),
      vy: -Math.random() * (isBig ? 12 : 7) - 2,
      life: 1.0,
      size: isBig ? 4 + Math.random() * 8 : 2 + Math.random() * 5,
      style: Math.random() > 0.2 ? 'orange' : 'white'
    });
  }

  let audioCtx = null;
  function playSynthSFX(kind) {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.connect(g);
      g.connect(audioCtx.destination);

      let freq = 440;
      if (kind === 'bad') freq = 100;
      else if (kind === 'TIGER PERFECT') freq = 880;
      else if (kind === 'PERFECT') freq = 660;
      else if (kind === 'GREAT') freq = 520;
      else if (kind === 'call') freq = 65;

      o.frequency.setValueAtTime(freq, audioCtx.currentTime);

      if (kind === 'call') {
        o.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.5);
      }

      g.gain.setValueAtTime(kind === 'call' ? 0.2 : 0.05, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (kind === 'call' ? 0.55 : 0.08));

      o.start();
      o.stop(audioCtx.currentTime + (kind === 'call' ? 0.56 : 0.09));
    } catch (e) {}
  }

  function drawHighway(currentSongTime, sec) {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const roadW = Math.min(W * 0.72, 840);
    const cx = W / 2;
    const topY = H * 0.26;
    const bottomY = H * 0.90;

    ctx.save();

    ctx.fillStyle = 'rgba(6, 4, 2, 0.45)';
    ctx.beginPath();
    ctx.moveTo(cx - roadW * 0.16, topY);
    ctx.lineTo(cx + roadW * 0.16, topY);
    ctx.lineTo(cx + roadW / 2, bottomY);
    ctx.lineTo(cx - roadW / 2, bottomY);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 90, 0, 0.4)';
    ctx.lineWidth = 2;
    for (let i = 0; i <= 4; i++) {
      let xb = cx - roadW / 2 + roadW * i / 4;
      let xt = cx - roadW * 0.16 + roadW * 0.32 * i / 4;
      ctx.beginPath();
      ctx.moveTo(xt, topY);
      ctx.lineTo(xb, bottomY);
      ctx.stroke();
    }

    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      sw.r += 3.8;
      sw.alpha -= 0.04;
      if (sw.alpha <= 0) {
        shockwaves.splice(i, 1);
        continue;
      }
      ctx.strokeStyle = `rgba(255, 90, 0, ${sw.alpha})`;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
      ctx.stroke();
    }

    drawPerformanceStations(cx, roadW, H, sec);

    for (const n of notes) {
      if (n.hit || n.missed) continue;

      const dt = n.hitTime - currentSongTime;
      if (dt > APPROACH_TIME + 0.1) continue;
      if (dt < -0.2) continue;

      let progress = 1 - dt / APPROACH_TIME;
      progress = Math.max(0, Math.min(1.05, progress));

      const y = topY + (bottomY - topY) * Math.pow(progress, 1.45);
      const currentRoadW = roadW * 0.32 + (roadW - roadW * 0.32) * progress;
      const x = cx - currentRoadW / 2 + currentRoadW * (n.lane + 0.5) / 4;

      const scale = 0.22 + 0.78 * progress;
      const style = n.chord ? 'white' : n.type === 'hold' ? 'accent' : 'orange';

      if (n.type === 'hold' && n.duration > 0) {
        const endDt = (n.hitTime + n.duration) - currentSongTime;
        let endProgress = 1 - endDt / APPROACH_TIME;
        endProgress = Math.max(0, Math.min(1.05, endProgress));
        const endY = topY + (bottomY - topY) * Math.pow(endProgress, 1.45);

        ctx.strokeStyle = 'rgba(255, 180, 0, 0.7)';
        ctx.lineWidth = 14 * scale;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, endY);
        ctx.stroke();
      }

      drawTigerPaw(ctx, x, y, scale * 1.5, 0, style, 1.0);

      const instKey = n.instrument || 'bass_drum';
      if (images[instKey] && images[instKey].complete) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.drawImage(images[instKey], -12, -12, 24, 24);
        ctx.restore();
      }
    }

    for (let i = floatingTexts.length - 1; i >= 0; i--) {
      const ft = floatingTexts[i];
      ft.y += ft.vy;
      ft.alpha -= 0.025;
      if (ft.alpha <= 0) {
        floatingTexts.splice(i, 1);
        continue;
      }
      ctx.fillStyle = ft.color;
      ctx.globalAlpha = ft.alpha;
      ctx.font = '800 12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(ft.text, ft.x, ft.y);
    }

    ctx.restore();
  }

  function drawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25;
      p.life -= 0.025;

      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.style === 'white' ? '#FFFFFF' : '#FF5A00';
      ctx.fillRect(p.x, p.y, p.size, p.size * 1.4);

      if (p.life <= 0) particles.splice(i, 1);
    }
    ctx.globalAlpha = 1;
  }

  function applyCameraEffects(t) {
    let base = video ? video.dataset.base || 'scale(1.1)' : 'scale(1.1)';
    let bob = Math.sin(t * Math.PI * 2 / BEAT) * (0.8 + hype / 100 * 1.2);
    let rot = Math.sin(t * Math.PI * 2 / BEAT * 0.5) * 0.18;

    const totalDx = screenImpulseX;
    const totalDy = screenImpulseY + bob;

    if (video) video.style.transform = `${base} translate(${totalDx}px, ${totalDy}px) rotate(${rot}deg)`;

    screenImpulseX *= 0.82;
    screenImpulseY *= 0.82;
  }

  // 7. DEVELOPER SECTION & TIMING TELEMETRY OVERLAY
  function updateTelemetryOverlay(currentSongTime, sec) {
    if (!showDebugPanel && !window.TIGER_BOT) return;

    if (UI.dbgTime) UI.dbgTime.textContent = currentSongTime.toFixed(2) + 's';
    const beatNum = Math.floor(currentSongTime / BEAT);
    if (UI.dbgBeat) UI.dbgBeat.textContent = `${beatNum} / ${Math.floor(beatNum / 4)}`;
    if (UI.dbgFps) UI.dbgFps.textContent = currentFps;

    const activeReport = sectionDebugReports.find(r => r.section.toLowerCase().trim() === sec.name.toLowerCase().trim());
    if (UI.dbgSectionName) UI.dbgSectionName.textContent = sec.name;
    if (UI.dbgSectionSource) UI.dbgSectionSource.textContent = activeReport ? activeReport.source : (sec.name.includes('Horn') ? 'Human Horn Consensus' : 'Human Drum Consensus');
    if (UI.dbgSectionDensity) UI.dbgSectionDensity.textContent = (activeReport ? activeReport.densityPerSec : 3.0) + ' /s';
    if (UI.dbgPlayableCount) UI.dbgPlayableCount.textContent = `${notes.length} total (${activeReport ? activeReport.playableEvents : 0} in section)`;

    if (activeReport && UI.dbgLaneDist) {
      const l = activeReport.lanes;
      UI.dbgLaneDist.textContent = `${l.L || 0} / ${l.D || 0} / ${l.R || 0} / ${l.U || 0}`;
    }

    if (UI.dbgLastHit) UI.dbgLastHit.textContent = lastHitInfo;
  }

  function processAutoRhythmBot(currentSongTime) {
    if (!autoBotActive && !window.TIGER_BOT) return;

    for (const n of notes) {
      if (n.hit || n.missed) continue;
      if (currentSongTime >= n.hitTime) {
        heldLanes.add(n.lane);
        judgeInput(n.lane);
        setTimeout(() => heldLanes.delete(n.lane), 80);
      }
    }
  }

  function gameLoop(now) {
    if (!running || paused) return;

    frameCount++;
    if (now - lastFpsCalcTime >= 1000) {
      currentFps = frameCount;
      frameCount = 0;
      lastFpsCalcTime = now;
    }

    const currentSongTime = updateAudioClock();
    const [sec, idx] = getSectionInfo(currentSongTime);

    updateSection(sec, idx);
    auditMissedNotes(currentSongTime);
    processAutoRhythmBot(currentSongTime);
    applyCameraEffects(currentSongTime);

    if (ctx) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    drawHighway(currentSongTime, sec);
    drawParticles();

    if (flashAlpha > 0 && ctx) {
      ctx.fillStyle = `rgba(255, 90, 0, ${flashAlpha * 0.16})`;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      flashAlpha *= 0.82;
    }

    updateTelemetryOverlay(currentSongTime, sec);

    if (currentSongTime >= DURATION - 0.08 || (video && video.ended)) {
      finishGame();
      return;
    }

    requestAnimationFrame(gameLoop);
  }

  function finishGame() {
    running = false;
    if (video) video.pause();

    let totalNotes = tigerPerfectCount + perfectCount + greatCount + goodCount + missCount;
    let accuracy = totalNotes > 0 ? (tigerPerfectCount + perfectCount + greatCount * 0.7 + goodCount * 0.4) / totalNotes : 0;
    let grade = accuracy >= 0.95 ? 'S' : accuracy >= 0.88 ? 'A' : accuracy >= 0.78 ? 'B' : accuracy >= 0.65 ? 'C' : 'D';

    if ($('grade')) $('grade').textContent = grade;
    if ($('resultTitle')) {
      $('resultTitle').textContent =
        grade === 'S' ? 'LEGENDARY TIGER CALL' :
        grade === 'A' ? 'STADIUM SHAKER' :
        grade === 'B' ? 'BAND READY' :
        grade === 'C' ? 'KEEP THE CADENCE' : 'BACK TO REHEARSAL';
    }

    if ($('finalScore')) $('finalScore').textContent = score.toLocaleString();
    if ($('maxCombo')) $('maxCombo').textContent = maxCombo;
    if ($('perfectCount')) $('perfectCount').textContent = tigerPerfectCount + perfectCount;
    if ($('finalHype')) $('finalHype').textContent = Math.round(hype) + '%';
    if (UI.result) UI.result.classList.add('active');
  }

  document.addEventListener('keydown', e => {
    if (e.code === 'Backquote') {
      showDebugPanel = !showDebugPanel;
      if (UI.debugPanel) UI.debugPanel.classList.toggle('active', showDebugPanel);
      return;
    }

    if (showDebugPanel) {
      if (e.code === 'BracketLeft') {
        globalAudioOffsetSec -= 0.005;
        return;
      } else if (e.code === 'BracketRight') {
        globalAudioOffsetSec += 0.005;
        return;
      }
    }

    if (e.code === 'Escape') {
      togglePause();
      return;
    }

    let lane = laneKeys[e.code];
    if (lane === undefined || e.repeat) return;
    e.preventDefault();

    heldLanes.add(lane);
    judgeInput(lane);
  });

  document.addEventListener('keyup', e => {
    let lane = laneKeys[e.code];
    if (lane !== undefined) releaseLaneInput(lane);
  });

  function setupTouchControls() {
    document.querySelectorAll('#touchControls button').forEach(btn => {
      const lane = +btn.dataset.lane;

      const down = e => {
        e.preventDefault();
        btn.classList.add('hit');
        heldLanes.add(lane);
        judgeInput(lane);
      };

      const up = e => {
        e.preventDefault();
        btn.classList.remove('hit');
        releaseLaneInput(lane);
      };

      btn.addEventListener('pointerdown', down);
      btn.addEventListener('pointerup', up);
      btn.addEventListener('pointercancel', up);
    });
  }

  const startInit = async () => {
    if (initUI()) {
      setupTouchControls();
      await loadAuthoritativeChart();
      resetGame();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startInit);
  } else {
    startInit();
  }

})();
