(() => {
  'use strict';

  // DOM Elements
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const video = document.getElementById('performanceVideo');
  const loader = document.getElementById('videoLoader');
  const loaderText = document.getElementById('videoLoaderText');

  const $ = id => document.getElementById(id);
  const UI = {
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
    dbgAudioOffset: $('dbgAudioOffset'),
    dbgInputOffset: $('dbgInputOffset'),
    dbgLastHit: $('dbgLastHit'),
    dbgMeanDelta: $('dbgMeanDelta'),
    dbgStats: $('dbgStats')
  };

  // Rhythm Engine Calibration & Constants
  const BPM = 198;
  const BEAT = 60 / BPM; // ~0.30303s
  const DURATION = 94.876735;
  const APPROACH_TIME = 1.45; // Approach window in seconds
  const HIT_Y_RATIO = 0.84; // Landing Paw Target position

  // Configurable Latency Offsets (in seconds / ms)
  let globalAudioOffsetSec = 0.00;
  let globalInputOffsetMs = 0;

  // Keyboard Mappings
  const laneKeys = {
    ArrowLeft: 0, KeyA: 0,
    ArrowUp: 1, KeyW: 1,
    ArrowRight: 2, KeyD: 2,
    ArrowDown: 3, KeyS: 3
  };

  // Section Choreography Definitions
  const sections = [
    { t: 0, name: 'COUNT-IN', banner: 'ENTER THE FORMATION', mode: 'intro', cam: 'march', density: 0.4 },
    { t: 9.5, name: 'DRUMLINE CADENCE', banner: 'DRUMLINE — LOCK THE POCKET', mode: 'drums', cam: 'drums', density: 0.85 },
    { t: 24.5, name: 'BRASS ATTACK', banner: 'BRASS — HIT & HOLD', mode: 'brass', cam: 'brass', density: 0.80 },
    { t: 39.8, name: 'FIELD FORMATION', banner: 'FULL BAND — MOVE IN TIME', mode: 'formation', cam: 'wide', density: 0.75 },
    { t: 55.5, name: 'CALL & RESPONSE', banner: 'THE BAND CALLS — YOU ANSWER', mode: 'response', cam: 'switch', density: 0.92 },
    { t: 70.5, name: 'SHOWTIME', banner: 'NO BRAKES — FULL BAND', mode: 'showtime', cam: 'rush', density: 1.0 },
    { t: 85.4, name: 'TIGER CALL', banner: 'BUILD IT. HOLD IT. UNLEASH IT.', mode: 'finale', cam: 'finale', density: 1.15 }
  ];

  // Game Engine State Variables
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
  let laneHitState = [0, 0, 0, 0]; // Timers for hit flash on landing targets

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

  // Expose Bot Control to Global Scope
  window.TIGER_BOT = false;

  // Resize Handler
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Video Event Handlers
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

  // 1. MASTER AUDIO CLOCK SYSTEM (SONG_TIME)
  function updateAudioClock() {
    if (!video || !running || paused) return songTime;

    const now = performance.now();
    const vTime = video.currentTime;

    if (vTime !== lastVideoTime) {
      // Audio decoder tick received
      lastVideoTime = vTime;
      lastRealTime = now;
      songTime = vTime + globalAudioOffsetSec;
    } else {
      // High-resolution interpolation between video ticks
      const dt = (now - lastRealTime) / 1000;
      songTime = lastVideoTime + dt + globalAudioOffsetSec;
    }

    return songTime;
  }

  function getSectionInfo(t) {
    let idx = 0;
    for (let i = 0; i < sections.length; i++) {
      if (t >= sections[i].t) idx = i;
    }
    return [sections[idx], idx];
  }

  // 2. HAND-CRAFTED MUSICAL PHRASE CHART GENERATION
  function generateHandcraftedChart() {
    notes = [];
    const startOffset = 0.62;

    // Phrase Building Helper
    function addNote(hitTime, lane, type = 'tap', duration = 0, chord = false) {
      if (hitTime < startOffset || hitTime > DURATION - 0.5) return;
      notes.push({
        hitTime,
        lane,
        type,      // 'tap', 'hold', 'cadence', 'chord'
        duration,  // Duration for holds
        chord,     // Multi-paw ensemble hit flag
        hit: false,
        missed: false,
        holdProgress: 0,
        cadenceTapsReq: type === 'cadence' ? 4 : 0,
        cadenceTapsDone: 0
      });
    }

    let b = 0;
    for (let t = startOffset; t < DURATION - 1.0; t += BEAT, b++) {
      const [sec] = getSectionInfo(t);
      const mode = sec.mode;

      if (mode === 'intro') {
        // SECTION 1: COUNT-IN — March Pulse (L - R - L - R)
        let lane = b % 4;
        addNote(t, lane, 'tap');
      }
      else if (mode === 'drums') {
        // SECTION 2: DRUMLINE CADENCE — 16th Rudiment Flurries & Cadence Rolls
        if (b % 16 === 4 || b % 16 === 12) {
          // Cadence Roll Stream on Lane 1 or 2
          addNote(t, b % 2 === 0 ? 1 : 2, 'cadence', BEAT * 1.5);
        } else {
          let lane = [0, 2, 0, 1, 3, 2, 1, 3][b % 8];
          addNote(t, lane, 'tap');
          if (b % 4 === 2) {
            addNote(t + BEAT / 2, (lane + 1) % 4, 'tap');
          }
        }
      }
      else if (mode === 'brass') {
        // SECTION 3: BRASS ATTACK — Sustained Holds & Accent Stabs
        if (b % 8 === 0) {
          let lane = (Math.floor(b / 8) % 2 === 0) ? 1 : 2;
          addNote(t, lane, 'hold', BEAT * 2.2);
        } else if (b % 8 !== 1 && b % 8 !== 2) {
          let lane = [0, 3, 1, 2][b % 4];
          addNote(t, lane, 'tap');
        }
      }
      else if (mode === 'formation') {
        // SECTION 4: FIELD FORMATION — Chords & Spatial Movement
        if (b % 8 === 0) {
          // Dual Paw Ensemble Hit (L + R)
          addNote(t, 0, 'tap', 0, true);
          addNote(t, 2, 'tap', 0, true);
        } else if (b % 8 === 4) {
          // Dual Paw Ensemble Hit (U + D)
          addNote(t, 1, 'tap', 0, true);
          addNote(t, 3, 'tap', 0, true);
        } else {
          let lane = [0, 1, 2, 3, 2, 1, 0, 3][b % 8];
          addNote(t, lane, 'tap');
        }
      }
      else if (mode === 'response') {
        // SECTION 5: CALL & RESPONSE — Band Calls, Player Answers
        let subIndex = b % 8;
        if (subIndex >= 4) { // Player Answer Phrase
          let lane = [0, 1, 2, 3][subIndex - 4];
          addNote(t, lane, 'tap');
          if (subIndex === 7) {
            addNote(t + BEAT / 2, 0, 'tap');
          }
        }
      }
      else if (mode === 'showtime') {
        // SECTION 6: SHOWTIME — Double-Time High Density Show Mode
        let lane1 = [0, 2, 1, 3][b % 4];
        addNote(t, lane1, 'tap');

        if (b % 2 === 1) {
          addNote(t + BEAT / 2, (lane1 + 2) % 4, 'tap');
        }
        if (b % 12 === 6) {
          addNote(t, (lane1 + 1) % 4, 'hold', BEAT * 1.8);
        }
      }
      else if (mode === 'finale') {
        // SECTION 7: TIGER CALL — Finale Climax & 4-Lane Slam
        if (t >= 91.0 && t <= 92.5) {
          // THE TIGER CALL SLAM MOMENT (All 4 lanes)
          if (Math.abs(t - 91.5) < 0.1) {
            addNote(91.5, 0, 'tap', 0, true);
            addNote(91.5, 1, 'tap', 0, true);
            addNote(91.5, 2, 'tap', 0, true);
            addNote(91.5, 3, 'tap', 0, true);
          }
        } else {
          let lane = b % 4;
          addNote(t, lane, 'tap');
          addNote(t + BEAT / 2, (lane + 2) % 4, 'tap');
        }
      }
    }

    // Sort notes chronologically by hitTime
    notes.sort((a, b) => a.hitTime - b.hitTime);

    // Run Playability Safety Validator
    validateChartPlayability();
  }

  // Playability & Fairness Validator
  function validateChartPlayability() {
    for (let i = 0; i < notes.length - 1; i++) {
      const current = notes[i];
      const next = notes[i + 1];
      // Prevent impossible same-lane double taps (< 60ms)
      if (current.lane === next.lane && Math.abs(next.hitTime - current.hitTime) < 0.06) {
        next.hitTime += 0.07;
      }
    }
  }

  // RESET ENGINE
  function resetGame() {
    generateHandcraftedChart();
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

    UI.score.textContent = '0000000';
    UI.combo.textContent = '0';
    UI.hypeFill.style.width = '0%';
    UI.hypeText.textContent = '0%';
    UI.judge.textContent = 'READY';
  }

  // START EXPERIENCE
  function startGame() {
    resetGame();
    UI.start.classList.remove('active');
    UI.result.classList.remove('active');

    video.currentTime = 0;
    video.volume = 0.92;
    video.play().then(() => {
      running = true;
      paused = false;
      lastVideoTime = video.currentTime;
      lastRealTime = performance.now();
      requestAnimationFrame(gameLoop);
    }).catch(() => {
      UI.judge.textContent = 'TAP PLAY';
      UI.start.classList.add('active');
    });
  }

  // PAUSE / RESUME SYSTEM
  function togglePause(forceResume = false) {
    if (!running) return;
    if (!paused && !forceResume) {
      paused = true;
      video.pause();
      UI.pause.classList.add('active');
    } else {
      paused = false;
      UI.pause.classList.remove('active');
      video.play();
      lastVideoTime = video.currentTime;
      lastRealTime = performance.now();
      requestAnimationFrame(gameLoop);
    }
  }

  // SECTION CAMERA & BAND CHOREOGRAPHY
  function updateSection(s, idx) {
    if (idx === sectionIndex) return;
    sectionIndex = idx;
    UI.section.textContent = s.name;
    UI.bannerText.textContent = s.banner;
    UI.banner.classList.add('show');
    setTimeout(() => UI.banner.classList.remove('show'), 1500);

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
    video.dataset.base = cameraTransforms[s.cam] || 'scale(1.1)';
  }

  // 3. TIGER PAW VECTOR DRAWING SYSTEM
  function drawTigerPaw(ctx, x, y, scale, rotation = 0, style = 'orange', alpha = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;

    // Palette Configuration
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
    } else if (style === 'ghost') {
      primaryColor = 'rgba(255, 120, 0, 0.3)';
      secondaryColor = 'rgba(255, 180, 0, 0.2)';
      highlightColor = 'rgba(255, 255, 255, 0.4)';
      glowColor = 'transparent';
    }

    // Outer Glow Effect
    if (glowColor !== 'transparent') {
      ctx.shadowBlur = style === 'perfect' ? 25 : 14;
      ctx.shadowColor = glowColor;
    }

    // Main Palm Pad (Shield / Rounded Heart Shape)
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

    // 4 Radial Toe Pads
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

      // Toe Specular Highlight
      ctx.beginPath();
      ctx.ellipse(-1, -2, t.rx * 0.4, t.ry * 0.4, 0, 0, Math.PI * 2);
      ctx.fillStyle = highlightColor;
      ctx.fill();
      ctx.restore();
    });

    // Inner Palm Highlight Pad
    ctx.beginPath();
    ctx.ellipse(0, 0, 6, 4, 0, 0, Math.PI * 2);
    ctx.fillStyle = highlightColor;
    ctx.globalAlpha = alpha * 0.75;
    ctx.fill();

    ctx.restore();
  }

  // 4. STATIONARY LANDING PAW TARGETS (TIMING INSTRUMENTS)
  function drawLandingTargets(cx, roadW, H) {
    const y = H * HIT_Y_RATIO;

    for (let l = 0; l < 4; l++) {
      const x = laneX(l, cx, roadW);
      const isHeld = heldLanes.has(l);
      const hitTimer = laneHitState[l];
      const fever = hype >= 90;

      ctx.save();
      ctx.translate(x, y);

      // Target Rim & Base Ring
      ctx.beginPath();
      ctx.arc(0, 0, 34, 0, Math.PI * 2);
      ctx.fillStyle = isHeld ? 'rgba(255, 90, 0, 0.85)' : 'rgba(8, 6, 4, 0.88)';
      ctx.fill();

      // Outer Target Border
      ctx.strokeStyle = fever ? '#FFD700' : isHeld ? '#FFFFFF' : '#FF5A00';
      ctx.lineWidth = isHeld || hitTimer > 0 ? 4.5 : 3;
      ctx.stroke();

      // Pulse Glow Aura
      if (fever || hitTimer > 0 || isHeld) {
        ctx.shadowBlur = hitTimer > 0 ? 30 : 16;
        ctx.shadowColor = fever ? '#FFD700' : '#FF5A00';
        ctx.beginPath();
        ctx.arc(0, 0, 36 + (hitTimer > 0 ? 6 : 0), 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 90, 0, 0.6)';
        ctx.stroke();
      }

      // Draw Center Landing Paw Glyph
      const pawScale = 1.05 + (hitTimer > 0 ? 0.2 : 0) + (isHeld ? 0.1 : 0);
      const pawStyle = hitTimer > 0 ? 'perfect' : isHeld ? 'white' : 'orange';
      drawTigerPaw(ctx, 0, 0, pawScale, 0, pawStyle, isHeld ? 1.0 : 0.85);

      // Lane Key Direction Indicator Overlay
      ctx.fillStyle = isHeld ? '#000' : '#FFF';
      ctx.font = '900 16px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#000';
      ctx.fillText(['←', '↑', '→', '↓'][l], 0, 24);

      ctx.restore();

      // Decay hit timer animation
      if (laneHitState[l] > 0) laneHitState[l] -= 0.08;
    }
  }

  function laneX(laneIndex, cx, roadWidth) {
    return cx - roadWidth / 2 + roadWidth * (laneIndex + 0.5) / 4;
  }

  // 5. INPUT JUDGMENT & TIMING MATHEMATICS
  function judgeInput(lane) {
    if (!running || paused) return;

    const currentSongTime = updateAudioClock();

    let bestNote = null;
    let minDeltaSec = 999;

    // Search for closest active note in target lane
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

      // Judgment Tier Evaluation
      let j = 'GOOD';
      let pts = 450;
      let hypeAdd = 1.0;

      if (absErrorMs <= 25) {
        j = 'TIGER PERFECT';
        pts = 1000;
        hypeAdd = 3.0;
        tigerPerfectCount++;
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
      UI.judge.textContent = j === 'TIGER PERFECT' ? 'TIGER PERFECT!' : j;
      lastHitInfo = `${j} (${earlyLateStr})`;
      hitDeltas.push(timingErrorMs);

      // Tactile Impulse & FX Trigger
      flashAlpha = j.includes('PERFECT') ? 0.8 : 0.4;
      triggerScreenImpulse(timingErrorMs < 0 ? -3 : 3, j.includes('PERFECT') ? -4 : -2);

      spawnHitFX(lane, j, earlyLateStr);
      playSynthSFX(j);

      if (bestNote.type === 'hold' || bestNote.type === 'cadence') {
        heldLanes.add(lane);
      }
    } else {
      // Off-beat Miss
      combo = 0;
      hype = Math.max(0, hype - 2.0);
      UI.judge.textContent = 'OFF BEAT';
      lastHitInfo = 'OFF BEAT (MISS)';
      playSynthSFX('bad');
      triggerScreenImpulse(0, 4);
    }

    updateHUD();
    checkTigerCallSlam();
  }

  function releaseLaneInput(lane) {
    heldLanes.delete(lane);
  }

  // TIGER CALL SLAM CLIMAX
  function checkTigerCallSlam() {
    if (hype >= 95 && heldLanes.size >= 4 && !tigerCallActive) {
      tigerCallActive = true;
      hype = 100;
      score += 30000;
      flashAlpha = 1.0;
      triggerScreenImpulse(0, -18);

      UI.call.classList.add('live');
      setTimeout(() => UI.call.classList.remove('live'), 2000);
      playSynthSFX('call');

      for (let i = 0; i < 90; i++) {
        spawnParticle(window.innerWidth / 2, window.innerHeight * 0.45, true);
      }
    }
  }

  function updateHUD() {
    UI.score.textContent = String(score).padStart(7, '0');
    UI.combo.textContent = combo;
    UI.hypeFill.style.width = hype + '%';
    UI.hypeText.textContent = Math.round(hype) + '%';
    video.style.filter = `saturate(${1.2 + hype / 180}) contrast(${1.1 + hype / 500}) brightness(${0.58 + hype / 350})`;
  }

  // MISS NOTE AUDIT
  function auditMissedNotes(currentSongTime) {
    for (const n of notes) {
      if (n.hit || n.missed) continue;
      if (currentSongTime - n.hitTime > 0.15) {
        n.missed = true;
        missCount++;
        combo = 0;
        hype = Math.max(0, hype - 2.5);
        UI.judge.textContent = 'MISS';
        updateHUD();
      }
      if (n.hitTime > currentSongTime + 0.3) break;
    }
  }

  // FX & PARTICLES
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

  // AUDIO SYNTHESIS SFX (WEB AUDIO API)
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

  // 6. HIGHWAY PERSPECTIVE RENDERER & NOTE TRAVEL
  function drawHighway(currentSongTime, sec) {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const roadW = Math.min(W * 0.72, 840);
    const cx = W / 2;
    const topY = H * 0.26;
    const bottomY = H * 0.90;

    ctx.save();

    // Highway Background Polygon
    ctx.fillStyle = 'rgba(6, 4, 2, 0.45)';
    ctx.beginPath();
    ctx.moveTo(cx - roadW * 0.16, topY);
    ctx.lineTo(cx + roadW * 0.16, topY);
    ctx.lineTo(cx + roadW / 2, bottomY);
    ctx.lineTo(cx - roadW / 2, bottomY);
    ctx.closePath();
    ctx.fill();

    // Lane Dividers
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

    // Render Expanding Shockwave Rings
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

    // Render Stationary Landing Paw Targets
    drawLandingTargets(cx, roadW, H);

    // Render Incoming Tiger Paw Notes
    for (const n of notes) {
      if (n.hit || n.missed) continue;

      const dt = n.hitTime - currentSongTime;
      if (dt > APPROACH_TIME + 0.1) continue;
      if (dt < -0.2) continue;

      // Perspective Approach Progress Calculation
      let progress = 1 - dt / APPROACH_TIME;
      progress = Math.max(0, Math.min(1.05, progress));

      // Perspective Curve Mapping
      const y = topY + (bottomY - topY) * Math.pow(progress, 1.45);
      const currentRoadW = roadW * 0.32 + (roadW - roadW * 0.32) * progress;
      const x = cx - currentRoadW / 2 + currentRoadW * (n.lane + 0.5) / 4;

      // Perspective Scaling
      const scale = 0.22 + 0.78 * progress;
      const style = n.chord ? 'white' : n.type === 'hold' ? 'accent' : 'orange';

      // Draw Hold Paw Trail Stream
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

      // Draw Tiger Paw Note
      drawTigerPaw(ctx, x, y, scale * 1.6, 0, style, 1.0);
    }

    // Render Floating Timing Feedback Texts
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

  // CAMERA DISPLACEMENT & VISUAL FX
  function applyCameraEffects(t) {
    let base = video.dataset.base || 'scale(1.1)';
    let bob = Math.sin(t * Math.PI * 2 / BEAT) * (0.8 + hype / 100 * 1.2);
    let rot = Math.sin(t * Math.PI * 2 / BEAT * 0.5) * 0.18;

    const totalDx = screenImpulseX;
    const totalDy = screenImpulseY + bob;

    video.style.transform = `${base} translate(${totalDx}px, ${totalDy}px) rotate(${rot}deg)`;

    // Dampen impulses
    screenImpulseX *= 0.82;
    screenImpulseY *= 0.82;
  }

  // 7. DEVELOPER TELEMETRY & DEBUG PANEL OVERLAY
  function updateTelemetryOverlay(currentSongTime) {
    if (!showDebugPanel && !window.TIGER_BOT) return;

    UI.dbgTime.textContent = currentSongTime.toFixed(2) + 's';
    const beatNum = Math.floor(currentSongTime / BEAT);
    UI.dbgBeat.textContent = `${beatNum} / ${Math.floor(beatNum / 4)}`;
    UI.dbgFps.textContent = currentFps;
    UI.dbgAudioOffset.textContent = (globalAudioOffsetSec * 1000).toFixed(0) + ' ms';
    UI.dbgInputOffset.textContent = globalInputOffsetMs.toFixed(0) + ' ms';
    UI.dbgLastHit.textContent = lastHitInfo;

    if (hitDeltas.length > 0) {
      const sum = hitDeltas.reduce((a, b) => a + b, 0);
      const mean = sum / hitDeltas.length;
      UI.dbgMeanDelta.textContent = (mean >= 0 ? '+' : '') + mean.toFixed(1) + ' ms';
    }

    const totalJudged = tigerPerfectCount + perfectCount + greatCount + goodCount + missCount;
    const perfectPct = totalJudged > 0 ? Math.round(((tigerPerfectCount + perfectCount) / totalJudged) * 100) : 0;
    UI.dbgStats.textContent = `${perfectPct}% P / ${missCount} M`;
  }

  // 8. AUTOMATED RHYTHM BOT (AUTO-TESTER)
  function processAutoRhythmBot(currentSongTime) {
    if (!autoBotActive && !window.TIGER_BOT) return;

    for (const n of notes) {
      if (n.hit || n.missed) continue;
      // Trigger programmatic hit at exact hitTime
      if (currentSongTime >= n.hitTime) {
        heldLanes.add(n.lane);
        judgeInput(n.lane);
        setTimeout(() => heldLanes.delete(n.lane), 80);
      }
    }
  }

  // MAIN GAME RENDER LOOP
  function gameLoop(now) {
    if (!running || paused) return;

    // Calculate FPS
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

    // Clear Canvas
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Render Highway & Notes
    drawHighway(currentSongTime, sec);
    drawParticles();

    // Render Screen Flash
    if (flashAlpha > 0) {
      ctx.fillStyle = `rgba(255, 90, 0, ${flashAlpha * 0.16})`;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      flashAlpha *= 0.82;
    }

    updateTelemetryOverlay(currentSongTime);

    if (currentSongTime >= DURATION - 0.08 || video.ended) {
      finishGame();
      return;
    }

    requestAnimationFrame(gameLoop);
  }

  // EXPERIENCE FINISH
  function finishGame() {
    running = false;
    video.pause();

    let totalNotes = tigerPerfectCount + perfectCount + greatCount + goodCount + missCount;
    let accuracy = totalNotes > 0 ? (tigerPerfectCount + perfectCount + greatCount * 0.7 + goodCount * 0.4) / totalNotes : 0;
    let grade = accuracy >= 0.95 ? 'S' : accuracy >= 0.88 ? 'A' : accuracy >= 0.78 ? 'B' : accuracy >= 0.65 ? 'C' : 'D';

    $('grade').textContent = grade;
    $('resultTitle').textContent =
      grade === 'S' ? 'LEGENDARY TIGER CALL' :
      grade === 'A' ? 'STADIUM SHAKER' :
      grade === 'B' ? 'BAND READY' :
      grade === 'C' ? 'KEEP THE CADENCE' : 'BACK TO REHEARSAL';

    $('finalScore').textContent = score.toLocaleString();
    $('maxCombo').textContent = maxCombo;
    $('perfectCount').textContent = tigerPerfectCount + perfectCount;
    $('finalHype').textContent = Math.round(hype) + '%';
    UI.result.classList.add('active');
  }

  // KEYBOARD & INPUT EVENT LISTENERS
  document.addEventListener('keydown', e => {
    // Debug Panel Toggle Shortcut (~)
    if (e.code === 'Backquote') {
      showDebugPanel = !showDebugPanel;
      UI.debugPanel.classList.toggle('active', showDebugPanel);
      return;
    }

    // Offset Calibration Shortcuts when Debug Panel is active
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

  // Touch & Mobile Control Handlers
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

  // Debug Panel Button Listeners
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

  // CTA Button Handlers
  $('startBtn').onclick = startGame;
  $('replayBtn').onclick = startGame;
  $('pauseBtn').onclick = () => togglePause();
  $('resumeBtn').onclick = () => togglePause(true);
  video.addEventListener('ended', finishGame);

})();
