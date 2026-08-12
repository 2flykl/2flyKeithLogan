(() => {
  'use strict';
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
    result: $('resultScreen')
  };

  const BPM = 198;
  const beat = 60 / BPM;
  const duration = 94.876735;
  const travel = 1.25;
  const hitY = 0.82;
  const latencyOffsetMs = 0; // Millisecond offset calibration

  const laneKeys = {
    ArrowLeft: 0, KeyA: 0,
    ArrowUp: 1, KeyW: 1,
    ArrowRight: 2, KeyD: 2,
    ArrowDown: 3, KeyS: 3
  };

  const sections = [
    { t: 0, name: 'COUNT-IN', banner: 'ENTER THE FORMATION', mode: 'intro', cam: 'march', density: 0.38 },
    { t: 9.5, name: 'DRUMLINE CADENCE', banner: 'DRUMLINE — LOCK THE POCKET', mode: 'drums', cam: 'drums', density: 0.82 },
    { t: 24.5, name: 'BRASS ATTACK', banner: 'BRASS — HIT & HOLD', mode: 'brass', cam: 'brass', density: 0.76 },
    { t: 39.8, name: 'FIELD FORMATION', banner: 'FULL BAND — MOVE IN TIME', mode: 'formation', cam: 'wide', density: 0.68 },
    { t: 55.5, name: 'CALL & RESPONSE', banner: 'THE BAND CALLS — YOU ANSWER', mode: 'response', cam: 'switch', density: 0.9 },
    { t: 70.5, name: 'SHOWTIME', banner: 'NO BRAKES — FULL BAND', mode: 'showtime', cam: 'rush', density: 1.0 },
    { t: 85.4, name: 'TIGER CALL', banner: 'BUILD IT. HOLD IT. UNLEASH IT.', mode: 'finale', cam: 'finale', density: 1.1 }
  ];

  let notes = [];
  let particles = [];
  let rippleRings = [];
  let running = false;
  let paused = false;
  let lastTime = 0;
  let score = 0;
  let combo = 0;
  let maxCombo = 0;
  let hype = 0;
  let perfect = 0;
  let good = 0;
  let miss = 0;
  let sectionIndex = -1;
  let tigerCall = false;
  let heldLanes = new Set();
  let recentHitTimes = [];
  let flash = 0;
  let shake = 0;

  const sprites = new Image();
  sprites.src = 'assets/sprites/tiger_band_sheet.png';

  // Video buffering event management
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

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  function hash(n) {
    let x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  }

  function getSection(t) {
    let idx = 0;
    for (let i = 0; i < sections.length; i++) {
      if (t >= sections[i].t) idx = i;
    }
    return [sections[idx], idx];
  }

  function generateChart() {
    notes = [];
    const offset = 0.62;
    let bi = 0;
    for (let t = offset; t < duration - 0.3; t += beat, bi++) {
      const [s] = getSection(t);
      const d = s.density;
      if (hash(bi * 4.1) > d) continue;

      let lane = Math.floor(hash(bi * 7.7) * 4);
      if (s.mode === 'intro') lane = bi % 4;
      if (s.mode === 'drums') lane = [0, 2, 0, 1, 2, 0, 3, 2][bi % 8];
      if (s.mode === 'formation') lane = [0, 0, 1, 2, 3, 2, 1, 3][bi % 8];
      if (s.mode === 'response' && bi % 8 < 4 && hash(bi) < 0.45) continue;

      let type = 'tap';
      let len = 0;
      if ((s.mode === 'brass' || s.mode === 'showtime') && bi % 12 === 4) {
        type = 'hold';
        len = beat * (s.mode === 'showtime' ? 2 : 3);
      }
      notes.push({ t, lane, type, len, hit: false, missed: false });

      if ((s.mode === 'showtime' || s.mode === 'finale') && bi % 16 === 10) {
        let l2 = (lane + 2) % 4;
        notes.push({ t, lane: l2, type: 'tap', len: 0, hit: false, missed: false, chord: true });
      }
      if (s.mode === 'finale' && bi % 6 === 0) {
        notes.push({ t: t + beat / 2, lane: (lane + 1) % 4, type: 'tap', len: 0, hit: false, missed: false });
      }
    }
  }

  function reset() {
    generateChart();
    particles = [];
    rippleRings = [];
    score = combo = maxCombo = hype = perfect = good = miss = 0;
    sectionIndex = -1;
    tigerCall = false;
    heldLanes.clear();
    recentHitTimes = [];
    flash = 0;
    shake = 0;

    UI.score.textContent = '0000000';
    UI.combo.textContent = '0';
    UI.hypeFill.style.width = '0%';
    UI.hypeText.textContent = '0%';
    UI.judge.textContent = 'READY';
  }

  function start() {
    reset();
    UI.start.classList.remove('active');
    UI.result.classList.remove('active');

    video.currentTime = 0;
    video.volume = 0.92;
    video.play().then(() => {
      running = true;
      paused = false;
      lastTime = performance.now();
      requestAnimationFrame(loop);
    }).catch(() => {
      UI.judge.textContent = 'TAP PLAY';
      UI.start.classList.add('active');
    });
  }

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
      lastTime = performance.now();
      requestAnimationFrame(loop);
    }
  }

  function setSection(s, idx) {
    if (idx === sectionIndex) return;
    sectionIndex = idx;
    UI.section.textContent = s.name;
    UI.bannerText.textContent = s.banner;
    UI.banner.classList.add('show');
    setTimeout(() => UI.banner.classList.remove('show'), 1400);
    shake = 12;

    const transforms = {
      march: 'scale(1.12) translateY(1%)',
      drums: 'scale(1.26) translate(-4%, 3%)',
      brass: 'scale(1.24) translate(5%, -2%)',
      wide: 'scale(1.04)',
      switch: 'scale(1.18) translate(-2%, 0)',
      rush: 'scale(1.28) translate(3%, 1%)',
      finale: 'scale(1.1) translateY(-1%)'
    };
    video.dataset.base = transforms[s.cam] || 'scale(1.1)';
  }

  function judge(lane) {
    if (!running || paused) return;
    const nowMs = performance.now();
    const t = video.currentTime + (latencyOffsetMs / 1000);

    let best = null;
    let bestD = 999;

    for (const n of notes) {
      if (n.hit || n.missed || n.lane !== lane) continue;
      let d = Math.abs(n.t - t);
      if (d < bestD) {
        best = n;
        bestD = d;
      }
      if (n.t > t + 0.20) break;
    }

    if (best && bestD <= 0.16) {
      best.hit = true;
      let j = bestD <= 0.045 ? 'PERFECT' : bestD <= 0.095 ? 'GREAT' : 'GOOD';
      let pts = j === 'PERFECT' ? 1000 : j === 'GREAT' ? 700 : 450;

      if (j === 'PERFECT') perfect++;
      else good++;

      combo++;
      maxCombo = Math.max(maxCombo, combo);
      score += Math.round(pts * (1 + Math.min(combo, 100) / 100 * 2));
      hype = Math.min(100, hype + (j === 'PERFECT' ? 2.5 : 1.4));

      UI.judge.textContent = j;
      flash = j === 'PERFECT' ? 0.9 : 0.45;
      shake = j === 'PERFECT' ? 7 : 4;

      spawnHitFX(lane, j);
      playSynthSFX(j);

      if (best.type === 'hold') heldLanes.add(lane);
    } else {
      combo = 0;
      hype = Math.max(0, hype - 1.8);
      UI.judge.textContent = 'OFF BEAT';
      playSynthSFX('bad');
    }

    updateHUD();
    checkTigerCall();
  }

  function releaseLane(lane) {
    heldLanes.delete(lane);
  }

  function checkTigerCall() {
    const now = performance.now();
    recentHitTimes = recentHitTimes.filter(x => now - x.t < 360);
    recentHitTimes.push({ t: now });

    if (hype >= 95 && recentHitTimes.length >= 4 && !tigerCall) {
      tigerCall = true;
      hype = 100;
      score += 25000;
      shake = 24;
      flash = 1;

      UI.call.classList.add('live');
      setTimeout(() => UI.call.classList.remove('live'), 1800);
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

  function missNotes(t) {
    for (const n of notes) {
      if (n.hit || n.missed) continue;
      if (t - n.t > 0.18) {
        n.missed = true;
        miss++;
        combo = 0;
        hype = Math.max(0, hype - 2.5);
        UI.judge.textContent = 'MISS';
        updateHUD();
      }
      if (n.t > t + 0.25) break;
    }
  }

  function spawnHitFX(lane, j) {
    const x = laneX(lane);
    const y = window.innerHeight * hitY;

    rippleRings.push({ x, y, r: 28, maxR: 75, alpha: 1 });

    const count = j === 'PERFECT' ? 18 : 10;
    for (let i = 0; i < count; i++) {
      spawnParticle(x, y, false);
    }
  }

  function spawnParticle(x, y, big) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * (big ? 16 : 8),
      vy: -Math.random() * (big ? 14 : 9) - 2,
      life: 1,
      size: big ? 4 + Math.random() * 10 : 2 + Math.random() * 6
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

      let f = kind === 'bad' ? 90 : kind === 'call' ? 60 : kind === 'PERFECT' ? 760 : 440;
      o.frequency.setValueAtTime(f, audioCtx.currentTime);

      if (kind === 'call') {
        o.frequency.exponentialRampToValueAtTime(55, audioCtx.currentTime + 0.45);
      }

      g.gain.setValueAtTime(kind === 'call' ? 0.15 : 0.04, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (kind === 'call' ? 0.55 : 0.08));

      o.start();
      o.stop(audioCtx.currentTime + (kind === 'call' ? 0.56 : 0.09));
    } catch (e) {}
  }

  function laneX(l) {
    const w = Math.min(window.innerWidth * 0.64, 760);
    return window.innerWidth / 2 - w / 2 + w * (l + 0.5) / 4;
  }

  function drawHighway(t, s) {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const roadW = Math.min(W * 0.7, 820);
    const cx = W / 2;
    const topY = H * 0.28;
    const bottomY = H * 0.94;

    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = 'rgba(5, 3, 0, 0.35)';
    ctx.beginPath();
    ctx.moveTo(cx - roadW * 0.15, topY);
    ctx.lineTo(cx + roadW * 0.15, topY);
    ctx.lineTo(cx + roadW / 2, bottomY);
    ctx.lineTo(cx - roadW / 2, bottomY);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 85, 0, 0.4)';
    ctx.lineWidth = 2;
    for (let i = 0; i <= 4; i++) {
      let xb = cx - roadW / 2 + roadW * i / 4;
      let xt = cx - roadW * 0.15 + roadW * 0.3 * i / 4;
      ctx.beginPath();
      ctx.moveTo(xt, topY);
      ctx.lineTo(xb, bottomY);
      ctx.stroke();
    }

    // Ripple rings
    for (let i = rippleRings.length - 1; i >= 0; i--) {
      const ring = rippleRings[i];
      ring.r += 3.5;
      ring.alpha -= 0.04;
      if (ring.alpha <= 0) {
        rippleRings.splice(i, 1);
        continue;
      }
      ctx.strokeStyle = `rgba(255, 85, 0, ${ring.alpha})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Hit targets
    for (let l = 0; l < 4; l++) {
      let x = laneX(l);
      let y = H * hitY;

      ctx.beginPath();
      ctx.arc(x, y, 32, 0, Math.PI * 2);
      ctx.fillStyle = heldLanes.has(l) ? 'rgba(255, 85, 0, 0.85)' : 'rgba(5, 5, 5, 0.85)';
      ctx.fill();

      ctx.strokeStyle = '#ff5500';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = heldLanes.has(l) ? '#000' : '#fff';
      ctx.font = '900 28px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(['←', '↑', '→', '↓'][l], x, y);
    }

    // Notes
    for (const n of notes) {
      if (n.hit || n.missed) continue;
      const dt = n.t - t;
      if (dt > travel + 0.15) break;
      if (dt < -0.2) continue;

      let p = 1 - dt / travel;
      p = Math.max(0, Math.min(1, p));

      let y = topY + (bottomY - topY) * Math.pow(p, 1.38);
      let topW = roadW * 0.3;
      let bw = roadW;
      let ww = topW + (bw - topW) * p;
      let x = cx - ww / 2 + ww * (n.lane + 0.5) / 4;
      let r = 9 + 20 * p;

      ctx.shadowBlur = 20;
      ctx.shadowColor = '#ff5500';
      ctx.fillStyle = n.type === 'hold' ? '#ffbe2e' : '#ff5500';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      if (n.type === 'hold') {
        ctx.strokeStyle = '#ffbe2e';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - 80 * (0.5 + p));
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.24;
      p.life -= 0.025;

      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = Math.random() > 0.18 ? '#ff5500' : '#ffbe2e';
      ctx.fillRect(p.x, p.y, p.size, p.size * 1.6);

      if (p.life <= 0) particles.splice(i, 1);
    }
    ctx.globalAlpha = 1;
  }

  function draw(t) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    const [s] = getSection(t);
    drawHighway(t, s);
    drawParticles();

    if (flash > 0) {
      ctx.fillStyle = `rgba(255, 85, 0, ${flash * 0.14})`;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      flash *= 0.82;
    }
  }

  function applyCamera(t) {
    let base = video.dataset.base || 'scale(1.1)';
    let bob = Math.sin(t * Math.PI * 2 / beat) * (0.8 + hype / 100 * 1.2);
    let rot = Math.sin(t * Math.PI * 2 / beat * 0.5) * 0.18;

    if (shake > 0) {
      let sx = (Math.random() - 0.5) * shake;
      let sy = (Math.random() - 0.5) * shake;
      video.style.transform = `${base} translate(${sx}px, ${sy + bob}px) rotate(${rot}deg)`;
      shake *= 0.85;
    } else {
      video.style.transform = `${base} translateY(${bob}px) rotate(${rot}deg)`;
    }
  }

  function loop(now) {
    if (!running || paused) return;
    const t = video.currentTime;
    const [s, idx] = getSection(t);

    setSection(s, idx);
    missNotes(t);
    applyCamera(t);
    draw(t);

    if (t >= duration - 0.08 || video.ended) {
      finish();
      return;
    }
    requestAnimationFrame(loop);
  }

  function finish() {
    running = false;
    video.pause();

    let totalPossible = perfect + good + miss;
    let acc = totalPossible > 0 ? (perfect + good * 0.7) / totalPossible : 0;
    let grade = acc >= 0.95 ? 'S' : acc >= 0.88 ? 'A' : acc >= 0.78 ? 'B' : acc >= 0.65 ? 'C' : 'D';

    $('grade').textContent = grade;
    $('resultTitle').textContent =
      grade === 'S' ? 'LEGENDARY TIGER CALL' :
      grade === 'A' ? 'STADIUM SHAKER' :
      grade === 'B' ? 'BAND READY' :
      grade === 'C' ? 'KEEP THE CADENCE' : 'BACK TO REHEARSAL';

    $('finalScore').textContent = score.toLocaleString();
    $('maxCombo').textContent = maxCombo;
    $('perfectCount').textContent = perfect;
    $('finalHype').textContent = Math.round(hype) + '%';
    UI.result.classList.add('active');
  }

  // Keyboard Event Handlers
  document.addEventListener('keydown', e => {
    if (e.code === 'Escape') {
      togglePause();
      return;
    }
    let lane = laneKeys[e.code];
    if (lane === undefined || e.repeat) return;
    e.preventDefault();

    heldLanes.add(lane);
    judge(lane);
  });

  document.addEventListener('keyup', e => {
    let lane = laneKeys[e.code];
    if (lane !== undefined) releaseLane(lane);
  });

  // Touch Control Handlers
  document.querySelectorAll('#touchControls button').forEach(btn => {
    const lane = +btn.dataset.lane;

    const down = e => {
      e.preventDefault();
      btn.classList.add('hit');
      heldLanes.add(lane);
      judge(lane);
    };

    const up = e => {
      e.preventDefault();
      btn.classList.remove('hit');
      releaseLane(lane);
    };

    btn.addEventListener('pointerdown', down);
    btn.addEventListener('pointerup', up);
    btn.addEventListener('pointercancel', up);
  });

  $('startBtn').onclick = start;
  $('replayBtn').onclick = start;
  $('pauseBtn').onclick = () => togglePause();
  $('resumeBtn').onclick = () => togglePause(true);
  video.addEventListener('ended', finish);
})();
