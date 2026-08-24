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
  let canvas, ctx, video, audio, loader, loaderText;
  const $ = id => document.getElementById(id);
  let UI = {};

  // Rhythm Engine Calibration & Constants
  const DURATION = 94.876735;
  const APPROACH_TIME = 2.4;
  const HIT_Y_RATIO = 0.84;

  let globalAudioOffsetSec = 0.00;
  let globalInputOffsetMs = 0;

  // Canonical production controls, left-to-right:
  // I = LEFT, O = DOWN, P = RIGHT, 9 = UP.
  // Arrow keys remain optional development aliases only.
  const laneKeys = {
    KeyI: 0, ArrowLeft: 0,
    KeyO: 1, ArrowDown: 1,
    KeyP: 2, ArrowRight: 2,
    Digit9: 3, ArrowUp: 3
  };

  // Exact MIDI pitches created by the Studio One QWERTY performance:
  // I -> 72, O -> 74, P -> 76, 9 -> 73.
  const pitchToLane = { 72: 0, 74: 1, 76: 2, 73: 3 };
  const laneDirections = ['L', 'D', 'R', 'U'];
  const fixedLaneInstruments = ['bass_drum', 'snare', 'cymbal', 'quads'];

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
    // Paw receptor sprites
    '02_PAW_RECEPTORS/paw_idle.png',
    '02_PAW_RECEPTORS/paw_ready.png',
    '02_PAW_RECEPTORS/paw_hit.png',
    '02_PAW_RECEPTORS/paw_perfect.png',
    '02_PAW_RECEPTORS/paw_hold.png',
    '02_PAW_RECEPTORS/paw_ultra.png',
    '02_PAW_RECEPTORS/paw_miss.png',
    // FX sprite sheet
    '07_FX_SPRITES/fx_sprite_sheet_4x4.png'
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

  // Gameplay timing is sourced only from the TigerHeartbeat master gameplay chart.

  // Game Engine State Variables
  let heartbeatChartData = null;
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

  // High-resolution presentation clock used to reduce small visual delay.
  let presentedMediaTime = 0;
  let presentedMediaPerfTime = 0;
  let presentedClockReady = false;
  let videoFrameClockInstalled = false;

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
    audio = $('gameplayAudio');
    if (video) { video.muted = true; video.volume = 0; video.loop = true; }

    // Prefer requestVideoFrameCallback because metadata.mediaTime is tied to
    // the actual presented media timeline and updates more precisely than
    // relying only on HTMLMediaElement.currentTime.
    if (video && !videoFrameClockInstalled && typeof video.requestVideoFrameCallback === 'function') {
      videoFrameClockInstalled = true;
      const capturePresentedFrame = (now, metadata) => {
        if (metadata && Number.isFinite(metadata.mediaTime)) {
          presentedMediaTime = metadata.mediaTime;
          presentedMediaPerfTime = performance.now();
          presentedClockReady = true;
        }
        if (video && videoFrameClockInstalled) {
          video.requestVideoFrameCallback(capturePresentedFrame);
        }
      };
      video.requestVideoFrameCallback(capturePresentedFrame);
    }

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
      dbgLastHit: $('dbgLastHit'),
      dbgMidiEvent: $('dbgMidiEvent'),
      dbgMidiPitch: $('dbgMidiPitch'),
      dbgStation: $('dbgStation'),
      dbgBehavior: $('dbgBehavior'),
      dbgTargetTime: $('dbgTargetTime'),
      dbgInstrument: $('dbgInstrument'),
      dbgLastInput: $('dbgLastInput'),
      dbgErrorMs: $('dbgErrorMs'),
      soundUnlock: $('soundUnlockBtn')
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
    }

    if (audio) {
      audio.addEventListener('ended', finishGame);
      audio.addEventListener('waiting', () => {
        if (running && !paused && loader) {
          if (loaderText) loaderText.textContent = 'BUFFERING WAV MASTER...';
          loader.classList.add('active');
        }
      });
      audio.addEventListener('playing', () => loader && loader.classList.remove('active'));
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

    if ($('startBtn')) {
      $('startBtn').onclick = null;
      $('startBtn').addEventListener('click', startGame);
    }
    if ($('replayBtn')) {
      $('replayBtn').onclick = null;
      $('replayBtn').addEventListener('click', startGame);
    }
    if ($('pauseBtn')) $('pauseBtn').onclick = () => togglePause();
    if ($('resumeBtn')) $('resumeBtn').onclick = () => togglePause(true);
    if ($('soundUnlockBtn')) $('soundUnlockBtn').onclick = () => {
      if (!audio) return;
      audio.muted = false;
      audio.volume = 1.0;
      const p = audio.play();
      if (p && typeof p.then === 'function') {
        p.then(() => {
          if (UI.soundUnlock) UI.soundUnlock.classList.remove('active');
        }).catch(err => {
          console.error('ONE WAV MASTER retry failed:', err);
          if (UI.soundUnlock) UI.soundUnlock.classList.add('active');
        });
      }
    };

    resizeCanvas();
    prepareChart();
    if (ctx) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    return true;
  }

  async function loadHeartbeatCharts() {
    // TigerHeartbeat is the sole production gameplay timing source.
    if (window.TigerCallHeartbeatChart) {
      heartbeatChartData = window.TigerCallHeartbeatChart;
      return;
    }
    try {
      const gameRes = await fetch('assets/TigerCall_TIGER_HEARTBEAT_GAME_CHART.json');
      if (!gameRes.ok) throw new Error('TigerHeartbeat gameplay chart load failed');
      heartbeatChartData = await gameRes.json();
    } catch (e) {
      console.error('TigerHeartbeat master gameplay chart unavailable.', e);
      throw e;
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
    // ONE WAV MASTER is the sole timing authority.
    if (!audio) return 0;
    songTime = audio.currentTime + globalAudioOffsetSec;
    return songTime;
  }

  function prepareChart() {
    notes = [];
    if (heartbeatChartData && heartbeatChartData.notes && heartbeatChartData.notes.length > 0) {
      notes = heartbeatChartData.notes.map((n, idx) => {
        const midiNote = Number(n.midiNote);
        const lane = pitchToLane[midiNote];
        if (lane === undefined) return null;
        return {
          id: n.id || idx + 1,
          midiNote,
          station: lane,
          lane,
          direction: laneDirections[lane],
          hitTime: Number(n.hitTime),
          endTime: Number(n.endTime ?? n.hitTime),
          duration: Number(n.duration || 0),
          behavior: n.behavior || n.type || 'tap',
          type: n.type || n.behavior || 'tap',
          instrument: fixedLaneInstruments[lane],
          chord: Boolean(n.chord),
          hit: false, missed: false, lastErrorMs: null
        };
      }).filter(Boolean);
    } else {
      const fallbackBeat = 0.6;
      for (let t = 9.8, i = 0; t < 89.8; t += fallbackBeat, i++) {
        const lane = [2, 2, 0, 2, 3, 1][i % 6];
        notes.push({ id:i+1, midiNote:[72,74,76,73][lane], station:lane, lane, direction:laneDirections[lane], hitTime:t, endTime:t, duration:0, behavior:'tap', type:'tap', instrument:fixedLaneInstruments[lane], chord:false, hit:false, missed:false });
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

    // Highway/notes are rendered only by gameLoop after audio successfully begins.
  }

  function startGame() {
    resetGame();

    // Hide start screen immediately and NEVER reopen it because of audio errors.
    if (UI.start) UI.start.classList.remove('active');
    if (UI.result) UI.result.classList.remove('active');
    if (UI.pause) UI.pause.classList.remove('active');
    if (UI.soundUnlock) UI.soundUnlock.classList.remove('active');

    running = true;
    paused = false;
    songTime = 0;

    // Muted background video is visual-only.
    if (video) {
      video.muted = true;
      video.volume = 0;
      video.loop = true;
      video.play().catch(() => {});
    }

    // Gameplay renders immediately.
    requestAnimationFrame(gameLoop);

    if (!audio) {
      console.error('ONE WAV MASTER audio element missing');
      if (UI.soundUnlock) UI.soundUnlock.classList.add('active');
      return;
    }

    // This exact WAV is the ONLY audible source.
    audio.pause();
    try { audio.currentTime = 0; } catch (e) {}
    audio.muted = false;
    audio.volume = 1.0;

    // IMPORTANT: do NOT call audio.load() here.
    // Calling load() immediately before play() caused unreliable start behavior.
    const p = audio.play();

    if (p && typeof p.then === 'function') {
      p.then(() => {
        console.log('ONE WAV MASTER PLAYING:', audio.currentSrc);
        if (UI.soundUnlock) UI.soundUnlock.classList.remove('active');
        if (loader) loader.classList.remove('active');
      }).catch((err) => {
        console.error('ONE WAV MASTER playback blocked/failed:', err);

        // Stay inside gameplay. Never bounce back to start.
        if (UI.soundUnlock) {
          UI.soundUnlock.textContent = 'TAP FOR SOUND';
          UI.soundUnlock.classList.add('active');
        }
        if (loader) loader.classList.remove('active');
      });
    }
  }

  function togglePause(forceResume = false) {
    if (!running) return;
    if (!paused && !forceResume) {
      paused = true;
      if (audio) audio.pause();
    if (video) video.pause();
      if (UI.pause) UI.pause.classList.add('active');
    } else {
      paused = false;
      if (UI.pause) UI.pause.classList.remove('active');
      if (audio) audio.play().catch(() => { if (UI.soundUnlock) UI.soundUnlock.classList.add('active'); });
      if (video) { video.muted = true; video.volume = 0; video.play().catch(() => {}); }
      songTime = audio ? audio.currentTime : songTime;
      requestAnimationFrame(gameLoop);
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

  function drawPerformanceStations(cx, roadW, H) {
    const y = H * HIT_Y_RATIO;
    const mapping = fixedLaneInstruments;
    const activeCount = 4;
    const directionLabels = ['I', 'O', 'P', '9'];

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

      const baseR = 44;

      // 1. ARCADE OUTER BEZEL GRADIENT
      const bezelGrad = ctx.createRadialGradient(0, 0, baseR * 0.7, 0, 0, baseR * 1.15);
      bezelGrad.addColorStop(0, isHeld ? 'rgba(255, 140, 0, 0.95)' : 'rgba(25, 16, 10, 0.95)');
      bezelGrad.addColorStop(0.7, fever ? '#FFD700' : isHeld ? '#FF5A00' : '#442200');
      bezelGrad.addColorStop(1, 'rgba(5, 3, 2, 0.95)');

      ctx.fillStyle = bezelGrad;
      ctx.beginPath();
      ctx.arc(0, 0, baseR * 1.12, 0, Math.PI * 2);
      ctx.fill();

      // 2. METALLIC / NEON TARGET RIM
      ctx.strokeStyle = fever ? '#FFD700' : isHeld ? '#FFFFFF' : hitTimer > 0 ? '#00FFCC' : '#FF6600';
      ctx.lineWidth = isHeld || hitTimer > 0 ? 4.5 : 3.0;
      ctx.shadowBlur = hitTimer > 0 ? 28 : isHeld ? 20 : fever ? 16 : 10;
      ctx.shadowColor = fever ? '#FFD700' : isHeld ? '#FF8800' : '#FF3300';
      ctx.stroke();

      // 3. INNER ILLUMINATED TARGET PAD
      const innerGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, baseR * 0.85);
      innerGrad.addColorStop(0, hitTimer > 0 ? 'rgba(255, 255, 255, 0.9)' : isHeld ? 'rgba(255, 140, 0, 0.85)' : 'rgba(20, 10, 5, 0.9)');
      innerGrad.addColorStop(1, isHeld ? 'rgba(255, 60, 0, 0.7)' : 'rgba(10, 5, 2, 0.95)');

      ctx.fillStyle = innerGrad;
      ctx.beginPath();
      ctx.arc(0, 0, baseR * 0.85, 0, Math.PI * 2);
      ctx.fill();

      // 4. INNER TARGET CROSSHAIR / RING
      ctx.strokeStyle = isHeld ? 'rgba(255,255,255,0.8)' : 'rgba(255, 140, 0, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, baseR * 0.55, 0, Math.PI * 2);
      ctx.stroke();

      // 5. TIGER PAW TARGET RECEPTOR ICON – use sprite based on station state
      let pawSpriteKey = 'paw_idle';
      const state = hitTimer > 0 ? 'perfect' : isHeld ? 'held' : 'ready';
      if (state === 'ready') pawSpriteKey = 'paw_ready';
      else if (state === 'hit') pawSpriteKey = 'paw_hit';
      else if (state === 'perfect') pawSpriteKey = 'paw_perfect';
      else if (state === 'held') pawSpriteKey = 'paw_hold';
      else if (state === 'ultra') pawSpriteKey = 'paw_ultra';
      else if (state === 'miss') pawSpriteKey = 'paw_miss';
      const pawImg = images[pawSpriteKey];
      if (pawImg && pawImg.complete && pawImg.naturalWidth > 0) {
        const size = baseR * 2.45;
        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#FF5A00';
        ctx.drawImage(pawImg, -size/2, -size/2, size, size);
        ctx.restore();
      } else {
        // Never allow a missing sprite to make the landing target disappear.
        drawTigerPaw(ctx, 0, 6, 1.75, 0, 'orange', 1.0);
      }

      // Large readable instrument icon overlay
      const stationIcon = images[instrumentKey];
      if (!isDormant && stationIcon && stationIcon.complete && stationIcon.naturalWidth > 0) {
        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#FF5A00';
        ctx.drawImage(stationIcon, -23, -23, 46, 46);
        ctx.restore();
      }

      // 7. PROMINENT DIRECTIONAL ARROW BADGE UNDERNEATH
      const badgeY = baseR + 14;
      const badgeW = 44;
      const badgeH = 24;

      ctx.fillStyle = isHeld ? 'rgba(255, 140, 0, 0.95)' : 'rgba(15, 8, 4, 0.92)';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(-badgeW / 2, badgeY - badgeH / 2, badgeW, badgeH, 6);
      } else {
        ctx.rect(-badgeW / 2, badgeY - badgeH / 2, badgeW, badgeH);
      }
      ctx.fill();

      ctx.strokeStyle = isHeld ? '#FFFFFF' : fever ? '#FFD700' : 'rgba(255, 140, 0, 0.7)';
      ctx.lineWidth = isHeld ? 2.5 : 1.8;
      ctx.stroke();

      ctx.fillStyle = isHeld ? '#000000' : '#FFFFFF';
      ctx.font = '900 16px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowBlur = isHeld ? 0 : 6;
      ctx.shadowColor = '#FF5A00';
      ctx.fillText(directionLabels[l], 0, badgeY + 1);

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
      bestNote.lastErrorMs = timingErrorMs;
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

  function drawHighway(currentSongTime) {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const roadW = Math.min(W * 0.72, 840);
    const cx = W / 2;
    const topY = H * 0.26;
    const targetY = H * HIT_Y_RATIO; // 0.84 * H (Landing Paw center)
    const bottomY = H * 0.92;

    ctx.save();

    // Perspective highway background fill
    ctx.fillStyle = 'rgba(3, 2, 1, 0.66)';
    ctx.beginPath();
    ctx.moveTo(cx - roadW * 0.16, topY);
    ctx.lineTo(cx + roadW * 0.16, topY);
    ctx.lineTo(cx + roadW / 2, bottomY);
    ctx.lineTo(cx - roadW / 2, bottomY);
    ctx.closePath();
    ctx.fill();

    // Perspective lane dividers
    ctx.strokeStyle = 'rgba(255, 105, 0, 0.92)';
    ctx.lineWidth = 3;
    for (let i = 0; i <= 4; i++) {
      let xb = cx - roadW / 2 + roadW * i / 4;
      let xt = cx - roadW * 0.16 + roadW * 0.32 * i / 4;
      ctx.beginPath();
      ctx.moveTo(xt, topY);
      ctx.lineTo(xb, bottomY);
      ctx.stroke();
    }

    // 5. SUBTLE LANE HINT ARROWS (←, ↓, →, ↑) ALONG HIGHWAY
    const laneArrows = ['←', '↓', '→', '↑'];
    ctx.font = '900 13px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const hintSteps = 4;
    for (let l = 0; l < 4; l++) {
      for (let s = 1; s <= hintSteps; s++) {
        const hintP = s / (hintSteps + 1);
        const hy = topY + (targetY - topY) * hintP;
        const currentRoadW = roadW * 0.32 + (roadW - roadW * 0.32) * hintP;
        const hx = cx - currentRoadW / 2 + currentRoadW * (l + 0.5) / 4;
        ctx.fillStyle = 'rgba(255, 140, 0, 0.14)';
        ctx.fillText(laneArrows[l], hx, hy);
      }
    }

    // Shockwaves
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

    // Landing Paws (Draw target receptors)
    drawPerformanceStations(cx, roadW, H);

    // Notes
    for (const n of notes) {
      if (n.hit || n.missed) continue;

      const dt = n.hitTime - currentSongTime;
      if (dt > APPROACH_TIME + 0.1) continue;
      if (dt < -0.25) continue;

      let progress = 1 - dt / APPROACH_TIME;
      progress = Math.max(0, Math.min(1.08, progress));

      // Note arrives EXACTLY at targetY at currentSongTime == n.hitTime (progress == 1.0)
      const y = topY + (targetY - topY) * progress;
      const currentRoadW = roadW * 0.32 + (roadW - roadW * 0.32) * progress;
      const x = cx - currentRoadW / 2 + currentRoadW * (n.lane + 0.5) / 4;

      const scale = 0.22 + 0.78 * progress;
      const style = n.chord ? 'white' : n.type === 'hold' ? 'accent' : 'orange';

      if (n.type === 'hold' && n.duration > 0) {
        const endDt = (n.hitTime + n.duration) - currentSongTime;
        let endProgress = 1 - endDt / APPROACH_TIME;
        endProgress = Math.max(0, Math.min(1.08, endProgress));
        const endY = topY + (targetY - topY) * endProgress;

        ctx.strokeStyle = 'rgba(255, 180, 0, 0.75)';
        ctx.lineWidth = 16 * scale;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, endY);
        ctx.stroke();
      }

      drawTigerPaw(ctx, x, y, scale * 3.15, 0, style, 1.0);

      const instKey = n.instrument || fixedLaneInstruments[n.lane] || 'bass_drum';
      const incomingIcon = images[instKey];
      if (incomingIcon && incomingIcon.complete && incomingIcon.naturalWidth > 0) {
        ctx.save();
        ctx.translate(x, y);
        const iconSize = Math.max(34, 58 * scale);
        ctx.shadowBlur = 14;
        ctx.shadowColor = '#FF5A00';
        ctx.drawImage(incomingIcon, -iconSize/2, -iconSize/2, iconSize, iconSize);
        ctx.restore();
      } else {
        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `900 ${Math.max(12, 18 * scale)}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#FF5A00';
        ctx.fillText(['I','O','P','9'][n.lane], x, y);
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
    // Legacy Heartbeat metronome pulse removed. Camera response now comes only
    // from gameplay hit impulses / semantic performance events.
    let bob = 0;
    let rot = 0;

    const totalDx = screenImpulseX;
    const totalDy = screenImpulseY + bob;

    if (video) video.style.transform = `${base} translate(${totalDx}px, ${totalDy}px) rotate(${rot}deg)`;

    screenImpulseX *= 0.82;
    screenImpulseY *= 0.82;
  }

  // 7. DEVELOPER SECTION & TIMING TELEMETRY OVERLAY
  function updateTelemetryOverlay(currentSongTime) {
    if (!showDebugPanel && !window.TIGER_BOT) return;

    if (UI.dbgTime) UI.dbgTime.textContent = currentSongTime.toFixed(2) + 's';
    if (UI.dbgFps) UI.dbgFps.textContent = currentFps;
    if (UI.dbgSectionName) UI.dbgSectionName.textContent = 'TIGERHEARTBEAT MASTER';

    const hitCount = notes.filter(n => n.hit).length;
    if (UI.dbgPlayableCount) UI.dbgPlayableCount.textContent = `${notes.length} total (${hitCount} hit)`;

    const curNote = activeTelemetryNote || notes.find(n => !n.hit && !n.missed && n.hitTime >= currentSongTime);
    if (curNote) {
      if (UI.dbgMidiEvent) UI.dbgMidiEvent.textContent = `${curNote.id} / ${notes.length}`;
      if (UI.dbgMidiPitch) UI.dbgMidiPitch.textContent = curNote.midiNote;
      if (UI.dbgStation) UI.dbgStation.textContent = `Station ${curNote.station + 1} (${['L','D','R','U'][curNote.station]})`;
      if (UI.dbgBehavior) UI.dbgBehavior.textContent = curNote.behavior.toUpperCase() + (curNote.chord ? ' [CHORD]' : '');
      if (UI.dbgTargetTime) UI.dbgTargetTime.textContent = `${curNote.hitTime.toFixed(4)}s (${curNote.duration.toFixed(2)}s)`;
      if (UI.dbgInstrument) UI.dbgInstrument.textContent = curNote.instrument;
      if (UI.dbgErrorMs) {
        if (curNote.lastErrorMs !== undefined && curNote.lastErrorMs !== null) {
          const err = curNote.lastErrorMs;
          UI.dbgErrorMs.textContent = (err >= 0 ? '+' : '') + err.toFixed(1) + ' ms';
          UI.dbgErrorMs.style.color = Math.abs(err) <= 25 ? '#00e87a' : Math.abs(err) <= 50 ? '#ffd700' : '#ff8c00';
        } else {
          UI.dbgErrorMs.textContent = '—';
        }
      }
    }

    if (UI.dbgLastInput) UI.dbgLastInput.textContent = lastHitInfo;
  }

  function processAutoRhythmBot(currentSongTime) {
    if (!autoBotActive && !window.TIGER_BOT) return;

    for (const n of notes) {
      if (n.hit || n.missed) continue;
      if (currentSongTime >= n.hitTime - 0.002) {
        heldLanes.add(n.lane);
        judgeInput(n.lane);
        const holdDurationMs = n.duration > 0 ? Math.min(1200, n.duration * 1000) : 80;
        setTimeout(() => heldLanes.delete(n.lane), holdDurationMs);
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
    auditMissedNotes(currentSongTime);
    processAutoRhythmBot(currentSongTime);
    applyCameraEffects(currentSongTime);

    if (ctx) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    drawHighway(currentSongTime);
    drawParticles();

    if (flashAlpha > 0 && ctx) {
      ctx.fillStyle = `rgba(255, 90, 0, ${flashAlpha * 0.16})`;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      flashAlpha *= 0.82;
    }

    updateTelemetryOverlay(currentSongTime);

    if (audio && audio.ended) {
      finishGame();
      return;
    }

    requestAnimationFrame(gameLoop);
  }

  function finishGame() {
    if (audio) { audio.pause(); }
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

    if (e.code === 'KeyB' && showDebugPanel) {
      autoBotActive = !autoBotActive;
      window.TIGER_BOT = autoBotActive;
      if (UI.dbgBotBtn) {
        UI.dbgBotBtn.textContent = autoBotActive ? 'ON' : 'OFF';
        UI.dbgBotBtn.classList.toggle('active', autoBotActive);
      }
      return;
    }

    if (showDebugPanel) {
      if (e.code === 'BracketLeft') {
        globalAudioOffsetSec -= e.shiftKey ? 0.050 : 0.005;
        console.log(`Global Audio Offset: ${globalAudioOffsetSec > 0 ? '+' : ''}${(globalAudioOffsetSec * 1000).toFixed(1)}ms`);
        return;
      } else if (e.code === 'BracketRight') {
        globalAudioOffsetSec += e.shiftKey ? 0.050 : 0.005;
        console.log(`Global Audio Offset: ${globalAudioOffsetSec > 0 ? '+' : ''}${(globalAudioOffsetSec * 1000).toFixed(1)}ms`);
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
      await loadHeartbeatCharts();
      resetGame();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startInit);
  } else {
    startInit();
  }

  window.TigerCallStart = startGame;

})();
