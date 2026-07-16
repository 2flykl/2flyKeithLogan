
const c = document.querySelector('#c');
const x = c.getContext('2d');
const $ = s => document.querySelector(s);

let W = 0, H = 0, D = 1;
let running = false, last = 0, time = 0, camera = 0;
let value = 0, attention = 0, finishY = -5200;
let player, platforms = [], pennies = [], xBalls = [], particles = [];
let startY = 0, nextSpawnY = -800;

const input = {
  left: false,
  right: false,
  jumpQueued: false,
  dashDir: 0,
  dashUntil: 0,
  lastPress: { left: -9999, right: -9999 }
};

const A = {
  o: {},
  w: {},
  f: {},
  ch: { idle: [], run: [], jump: [], land: [] }
};

const objectNames = [
  'gold_microphone', 'platinum_record', 'rare_vinyl', 'mpc',
  'boombox', 'producer_laptop', 'headphones', 'gold_chain',
  'legendary_cassette', 'contract', 'award', 'photo',
  'document', 'key', 'flashlight', 'crates', 'guitars',
  'equipment', 'hero'
];

const waterNames = ['surface', 'current', 'foam', 'waterfall', 'reflection'];
const fxNames = ['splash', 'impact', 'streak', 'bubbles'];

const load = url => new Promise((resolve, reject) => {
  const image = new Image();
  image.onload = () => resolve(image);
  image.onerror = () => reject(new Error(`Unable to load ${url}`));
  image.src = url;
});

async function loadAssets() {
  for (const name of objectNames) A.o[name] = await load(`assets/objects/${name}.png`);
  for (const name of waterNames) A.w[name] = await load(`assets/water/${name}.jpg`);
  for (const name of fxNames) A.f[name] = await load(`assets/fx/${name}.png`);

  for (const [animation, count] of Object.entries({ idle: 8, run: 10, jump: 12, land: 8 })) {
    for (let i = 0; i < count; i++) {
      A.ch[animation].push(
        await load(`assets/character/${animation}/${String(i).padStart(2, '0')}.png`)
      );
    }
  }
}

function resize() {
  D = Math.min(devicePixelRatio || 1, 2);
  W = c.clientWidth;
  H = c.clientHeight;
  c.width = W * D;
  c.height = H * D;
  x.setTransform(D, 0, 0, D, 0, 0);
}
addEventListener('resize', resize);
resize();

function difficulty() {
  if (time < 16) return { current: 0.34, lateral: 0.24, xRate: 0, pennyRate: 0.0018 };
  const p = Math.min((time - 16) / 150, 1);
  return {
    current: 0.55 + p * 1.45,
    lateral: 0.38 + p * 0.9,
    xRate: 0.00055 + p * 0.0018,
    pennyRate: 0.0014 + p * 0.001
  };
}

function makePlatform({ x, y, w, asset, tutorial = false, anchored = false, lane = null, speed = null }) {
  return {
    x, y, w,
    h: Math.max(44, w * 0.18),
    asset,
    tutorial,
    anchored,
    lane: lane ?? Math.floor(Math.random() * 5),
    vy: speed ?? (tutorial ? 0.25 : 0.55 + Math.random() * 1.25),
    vx: anchored ? 0 : (Math.random() - 0.5) * 0.42,
    bob: Math.random() * Math.PI * 2,
    angle: (Math.random() - 0.5) * 0.08,
    angular: (Math.random() - 0.5) * 0.0018,
    mass: Math.max(1, w / 100),
    cooldown: 0
  };
}

function reset() {
  time = camera = value = attention = 0;
  platforms = [];
  pennies = [];
  xBalls = [];
  particles = [];
  $('#tip').classList.remove('hide');

  const starterW = Math.min(360, W * 0.58);
  const starterX = (W - starterW) / 2;
  const starterY = H * 0.54;
  startY = starterY;

  platforms.push(makePlatform({
    x: starterX, y: starterY, w: starterW,
    asset: 'boombox', tutorial: true, anchored: true, speed: 0.12
  }));

  player = {
    x: starterX + starterW / 2 - 28,
    y: starterY - 112,
    w: 56, h: 112,
    vx: 0, vy: 0,
    grounded: true,
    land: 0
  };

  const openingAssets = [
    'rare_vinyl', 'mpc', 'gold_microphone', 'platinum_record',
    'producer_laptop', 'headphones', 'legendary_cassette', 'guitars'
  ];

  let previousCenter = W / 2;
  let y = starterY - 122;

  for (let i = 0; i < 11; i++) {
    const pw = Math.min(265, Math.max(175, W * 0.27));
    const shift = Math.min(W * 0.15, 130) * (i % 2 ? -1 : 1);
    const center = Math.max(pw / 2 + 28, Math.min(W - pw / 2 - 28, previousCenter + shift));
    const platform = makePlatform({
      x: center - pw / 2,
      y,
      w: pw,
      asset: openingAssets[i % openingAssets.length],
      tutorial: true,
      anchored: i === 3 || i === 8,
      speed: i === 3 || i === 8 ? 0.05 : 0.2 + i * 0.018
    });
    platforms.push(platform);

    if (i === 2 || i === 5 || i === 8) {
      pennies.push({
        x: center,
        y: y - 42,
        r: 11,
        vy: platform.vy,
        vx: platform.vx,
        spin: Math.random() * Math.PI,
        attached: platform
      });
    }

    previousCenter = center;
    y -= 108;
  }

  const media = [
    'gold_microphone', 'platinum_record', 'rare_vinyl', 'mpc',
    'boombox', 'producer_laptop', 'headphones', 'gold_chain',
    'legendary_cassette', 'contract', 'award', 'photo',
    'document', 'crates', 'guitars', 'equipment', 'hero'
  ];

  for (let i = 0; i < 76; i++) {
    y -= 72 + Math.random() * 52;
    const big = Math.random() < 0.14;
    const pw = big ? 250 + Math.random() * 155 : 105 + Math.random() * 155;
    const lane = Math.floor(Math.random() * 5);
    const laneWidth = W / 5;
    const px = Math.max(18, Math.min(W - pw - 18,
      lane * laneWidth + laneWidth / 2 - pw / 2 + (Math.random() - 0.5) * laneWidth * 0.5
    ));

    platforms.push(makePlatform({
      x: px,
      y,
      w: pw,
      asset: media[Math.floor(Math.random() * media.length)],
      anchored: Math.random() < 0.1,
      lane,
      speed: big ? 0.25 + Math.random() * 0.55 : 0.55 + Math.random() * 1.35
    }));
  }

  finishY = y - 170;
  nextSpawnY = y - 300;
  updateHud();
}

function intersectsPlatform(p) {
  const bottom = player.y + player.h;
  return (
    player.x + player.w > p.x + 8 &&
    player.x < p.x + p.w - 8 &&
    bottom >= p.y - 10 &&
    bottom <= p.y + p.h + 16 &&
    player.vy >= 0
  );
}

function burst(px, py, type, count = 12) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x: px, y: py,
      vx: (Math.random() - 0.5) * 4.8,
      vy: -Math.random() * 3.7,
      life: 25 + Math.random() * 16,
      type
    });
  }
}

let audioContext = null;
function chaChing() {
  try {
    audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;
    [880, 1320, 1760].forEach((frequency, index) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = index === 0 ? 'triangle' : 'sine';
      oscillator.frequency.setValueAtTime(frequency, now + index * 0.045);
      gain.gain.setValueAtTime(0.0001, now + index * 0.045);
      gain.gain.exponentialRampToValueAtTime(0.14 / (index + 1), now + index * 0.045 + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.045 + 0.18);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start(now + index * 0.045);
      oscillator.stop(now + index * 0.045 + 0.2);
    });
  } catch {}
}

function resolvePlatformPhysics(dt, d) {
  // Keep platforms distributed while still allowing brief clusters.
  for (let i = 0; i < platforms.length; i++) {
    const a = platforms[i];
    if (a.cooldown > 0) a.cooldown -= dt;

    a.bob += 0.015 * dt;
    a.angle += a.angular * dt;

    if (!a.anchored) {
      a.y += d.current * a.vy * 0.52 * dt;
      a.x += a.vx * d.lateral * dt;
    }

    if (a.x < 8) {
      a.x = 8;
      a.vx = Math.abs(a.vx) * 0.75;
    }
    if (a.x + a.w > W - 8) {
      a.x = W - a.w - 8;
      a.vx = -Math.abs(a.vx) * 0.75;
    }

    for (let j = i + 1; j < platforms.length; j++) {
      const b = platforms[j];
      const vertical = Math.abs((a.y + a.h / 2) - (b.y + b.h / 2));
      if (vertical > 68) continue;

      const overlap = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
      if (overlap <= 0) continue;

      // Break apart only dangerous blockades. Smaller overlaps remain as fun clusters.
      const combinedCoverage = Math.max(a.x + a.w, b.x + b.w) - Math.min(a.x, b.x);
      const blockade = combinedCoverage > W * 0.78 || overlap > Math.min(a.w, b.w) * 0.58;
      if (!blockade) continue;

      const direction = (a.x + a.w / 2) < (b.x + b.w / 2) ? -1 : 1;
      const push = Math.min(3.2, overlap * 0.035) * dt;
      if (!a.anchored) a.x += direction * push;
      if (!b.anchored) b.x -= direction * push;
      if (!a.anchored) a.vx += direction * 0.018;
      if (!b.anchored) b.vx -= direction * 0.018;
    }
  }

  // Respawn media far above the player after it has gone over the unseen waterfall.
  for (const p of platforms) {
    if (p.y - camera > H + 260 && !p.tutorial) {
      p.y = nextSpawnY;
      nextSpawnY -= 82 + Math.random() * 48;
      p.lane = Math.floor(Math.random() * 5);
      const laneWidth = W / 5;
      p.x = Math.max(10, Math.min(W - p.w - 10,
        p.lane * laneWidth + laneWidth / 2 - p.w / 2 + (Math.random() - 0.5) * laneWidth * 0.48
      ));
      p.vy = 0.35 + Math.random() * 1.45;
      p.vx = (Math.random() - 0.5) * 0.5;
      p.anchored = Math.random() < 0.09;
    }
  }
}

function spawnCollectibles(d) {
  const spawnY = camera - 110;

  if (time > 8 && Math.random() < d.pennyRate && pennies.length < 7) {
    pennies.push({
      x: 28 + Math.random() * (W - 56),
      y: spawnY,
      r: 10 + Math.random() * 3,
      vy: 0.6 + Math.random() * 0.75,
      vx: (Math.random() - 0.5) * 0.26,
      spin: Math.random() * Math.PI,
      attached: null
    });
  }

  if (time > 16 && Math.random() < d.xRate && xBalls.length < 4) {
    const large = Math.random() < 0.18;
    xBalls.push({
      x: 38 + Math.random() * (W - 76),
      y: spawnY,
      r: large ? 31 : 18 + Math.random() * 8,
      vy: 0.75 + Math.random() * 0.75,
      vx: (Math.random() - 0.5) * 0.32,
      spin: Math.random() * Math.PI
    });
  }
}

function updateHud() {
  const d = difficulty();
  const progress = Math.max(0, Math.min(1, (startY - player.y) / (startY - finishY)));
  $('#value').textContent = value;
  $('#attention').textContent = attention;
  $('#progress').textContent = `${Math.round(progress * 100)}%`;
  $('#current').textContent = d.current < 0.6 ? 'CALM' : d.current < 1.15 ? 'PUSHING' : d.current < 1.65 ? 'STRONG' : 'RUSHING';
}

function updateTutorial() {
  if (time < 5) {
    $('#tipTitle').textContent = 'GET YOUR BALANCE';
    $('#tipText').textContent = 'Use LEFT and RIGHT to move. Press UP to jump.';
  } else if (time < 10) {
    $('#tipTitle').textContent = 'BUILD MOMENTUM';
    $('#tipText').textContent = 'Double-press LEFT or RIGHT, then hold the second press for a short dash.';
  } else if (time < 16) {
    $('#tipTitle').textContent = 'FOLLOW THE MEDIA';
    $('#tipText').textContent = 'Media objects are platforms. Only pennies and blue X balls are collectible.';
  } else {
    $('#tip').classList.add('hide');
  }
}

function update(dt) {
  time += dt / 60;
  const d = difficulty();

  const now = performance.now();
  const dashActive = now < input.dashUntil;
  const desired = input.left ? -1 : input.right ? 1 : 0;
  const acceleration = dashActive ? 0.82 : 0.48;
  const maxSpeed = dashActive ? 7.3 : 4.4;

  player.vx += desired * acceleration * dt;
  player.vx *= Math.pow(dashActive ? 0.93 : 0.865, dt);
  player.vx = Math.max(-maxSpeed, Math.min(maxSpeed, player.vx));
  player.x += player.vx * dt;
  player.x = Math.max(0, Math.min(W - player.w, player.x));

  player.vy += 0.52 * dt;
  player.y += player.vy * dt + d.current * 0.1 * dt;

  const wasGrounded = player.grounded;
  player.grounded = false;

  resolvePlatformPhysics(dt, d);

  for (const p of platforms) {
    if (intersectsPlatform(p)) {
      player.y = p.y - player.h;
      player.vy = 0;
      player.grounded = true;

      if (input.jumpQueued) {
        player.vy = dashActive ? -12.9 : -12.15;
        player.grounded = false;
        input.jumpQueued = false;
        burst(player.x + player.w / 2, p.y, 'water', 10);
      }
    }
  }

  if (player.grounded && !wasGrounded) {
    player.land = 9;
    burst(player.x + player.w / 2, player.y + player.h, 'water', 9);
  }
  if (player.land > 0) player.land -= dt;

  camera += (player.y - H * 0.4 - camera) * 0.052;

  spawnCollectibles(d);

  for (const penny of pennies) {
    if (penny.attached) {
      penny.x = penny.attached.x + penny.attached.w / 2;
      penny.y = penny.attached.y - 38;
    } else {
      penny.y += d.current * penny.vy * 0.62 * dt;
      penny.x += penny.vx * dt;
    }
    penny.spin += 0.1 * dt;
  }

  for (const ball of xBalls) {
    ball.y += d.current * ball.vy * 0.72 * dt;
    ball.x += ball.vx * dt;
    ball.spin += 0.045 * dt;
  }

  pennies = pennies.filter(penny => {
    if (Math.hypot(penny.x - (player.x + player.w / 2), penny.y - (player.y + 46)) < 31) {
      value += 1;
      chaChing();
      burst(penny.x, penny.y, 'value', 15);
      return false;
    }
    return penny.y - camera < H + 180;
  });

  xBalls = xBalls.filter(ball => {
    if (Math.hypot(ball.x - (player.x + player.w / 2), ball.y - (player.y + 46)) < ball.r + 22) {
      attention += ball.r > 27 ? 3 : 1;
      burst(ball.x, ball.y, 'attention', 16);
      return false;
    }
    return ball.y - camera < H + 190;
  });

  for (const p of particles) {
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 0.05 * dt;
    p.life -= dt;
  }
  particles = particles.filter(p => p.life > 0);

  updateTutorial();
  updateHud();

  if (player.y - camera > H + 150) end(false);
  if (player.y < finishY + 90) end(true);
}

function drawWater() {
  const gradient = x.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, '#78c9d7');
  gradient.addColorStop(0.45, '#166c7c');
  gradient.addColorStop(1, '#032c36');
  x.fillStyle = gradient;
  x.fillRect(0, 0, W, H);

  x.save();
  x.globalAlpha = 0.24;
  for (let yy = -110 + (time * 23) % 110; yy < H; yy += 110) {
    x.drawImage(A.w.current, 0, yy, W, 130);
  }
  x.globalAlpha = 0.13;
  x.drawImage(A.w.reflection, 0, 0, W, H);
  x.restore();

  // Clean procedural current lines. No embedded sheet labels.
  x.save();
  for (let i = 0; i < 22; i++) {
    const px = (i * 83 + time * (12 + i % 4)) % (W + 160) - 80;
    const py = (i * 131 + time * (18 + i % 3)) % (H + 140) - 70;
    x.strokeStyle = `rgba(220,250,255,${0.035 + (i % 4) * 0.014})`;
    x.lineWidth = 0.8 + (i % 3) * 0.45;
    x.beginPath();
    x.moveTo(px, py);
    x.bezierCurveTo(px + 34, py + 24, px - 18, py + 75, px + 22, py + 122);
    x.stroke();
  }
  x.restore();

  // Waterfall lip at bottom signals where objects ultimately disappear.
  x.save();
  x.globalAlpha = 0.28;
  x.drawImage(A.w.foam, 0, H - 52, W, 58);
  x.restore();
}

function drawMediaObject(p) {
  const yy = p.y - camera + Math.sin(p.bob) * 3;
  if (yy < -220 || yy > H + 170) return;

  const image = A.o[p.asset];
  const imageH = Math.max(78, p.h * 2.75);

  x.save();
  x.translate(p.x + p.w / 2, yy + p.h / 2);
  x.rotate(p.angle);

  // Strong silhouette/shadow for readability without dimming the art.
  x.shadowColor = 'rgba(0,0,0,.72)';
  x.shadowBlur = 20;
  x.shadowOffsetY = 10;

  // Fully opaque, full-color media artwork.
  x.globalAlpha = 1;
  x.drawImage(image, -p.w / 2, -imageH / 2, p.w, imageH);

  // Bright rim separates it from the water.
  x.shadowBlur = 0;
  x.strokeStyle = 'rgba(255,255,255,.26)';
  x.lineWidth = 1.2;
  x.strokeRect(-p.w / 2 + 4, -p.h / 2, p.w - 8, p.h);
  x.restore();

  // Wake.
  x.save();
  x.globalAlpha = 0.34;
  x.drawImage(A.f.streak, p.x + p.w * 0.08, yy + p.h * 0.5, p.w * 0.84, 28);
  x.restore();
}

function drawPenny(p) {
  const yy = p.y - camera;
  x.save();
  x.translate(p.x, yy);
  x.scale(0.28 + Math.abs(Math.cos(p.spin)) * 0.72, 1);
  x.shadowColor = 'rgba(255,191,78,.8)';
  x.shadowBlur = 13;
  x.fillStyle = '#c67b2e';
  x.beginPath();
  x.arc(0, 0, p.r, 0, Math.PI * 2);
  x.fill();
  x.strokeStyle = '#ffd69a';
  x.lineWidth = 2;
  x.stroke();
  x.fillStyle = '#ffe5b7';
  x.font = `900 ${Math.max(9, p.r)}px Arial`;
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.fillText('¢', 0, 1);
  x.restore();
}

function drawXBall(ball) {
  const yy = ball.y - camera;
  x.save();
  x.translate(ball.x, yy);
  x.rotate(ball.spin);
  x.shadowColor = 'rgba(42,145,255,.8)';
  x.shadowBlur = 20;
  const gradient = x.createRadialGradient(-ball.r * 0.3, -ball.r * 0.35, 2, 0, 0, ball.r);
  gradient.addColorStop(0, '#6bb8ff');
  gradient.addColorStop(0.45, '#187bdc');
  gradient.addColorStop(1, '#074a9d');
  x.fillStyle = gradient;
  x.beginPath();
  x.arc(0, 0, ball.r, 0, Math.PI * 2);
  x.fill();
  x.shadowBlur = 0;
  x.strokeStyle = '#fff';
  x.lineWidth = Math.max(3, ball.r * 0.14);
  x.lineCap = 'round';
  x.beginPath();
  x.moveTo(-ball.r * 0.35, -ball.r * 0.35);
  x.lineTo(ball.r * 0.35, ball.r * 0.35);
  x.moveTo(ball.r * 0.35, -ball.r * 0.35);
  x.lineTo(-ball.r * 0.35, ball.r * 0.35);
  x.stroke();
  x.restore();
}

let animation = 'idle', frame = 0, animationClock = 0;
function drawPlayer() {
  const state = Math.abs(player.vx) > 1 && player.grounded
    ? 'run'
    : !player.grounded
      ? 'jump'
      : player.land > 0
        ? 'land'
        : 'idle';

  if (state !== animation) {
    animation = state;
    frame = 0;
    animationClock = 0;
  }

  animationClock++;
  if (animationClock > 5) {
    animationClock = 0;
    frame = (frame + 1) % A.ch[animation].length;
  }

  const image = A.ch[animation][frame];
  const py = player.y - camera;

  x.save();
  x.translate(player.x + player.w / 2, py);
  if (player.vx < -0.2) x.scale(-1, 1);
  x.shadowColor = 'rgba(0,0,0,.65)';
  x.shadowBlur = 17;
  x.drawImage(image, -54, -8, 108, 128);
  x.restore();
}

function drawParticles() {
  for (const p of particles) {
    x.globalAlpha = Math.max(0, p.life / 40);
    x.fillStyle = p.type === 'attention' ? '#58afff' : p.type === 'value' ? '#ffd08a' : '#fff';
    x.beginPath();
    x.arc(p.x, p.y - camera, 1.6 + (40 - p.life) * 0.025, 0, Math.PI * 2);
    x.fill();
  }
  x.globalAlpha = 1;
}

function drawStage() {
  const yy = finishY - camera;
  x.save();
  x.fillStyle = '#090c0d';
  x.fillRect(W * 0.24, yy, W * 0.52, 26);
  x.fillStyle = '#e1a45a';
  x.font = '900 19px Arial';
  x.textAlign = 'center';
  x.fillText('STAGE', W / 2, yy - 12);
  x.restore();
}

function draw() {
  drawWater();
  for (const p of platforms) drawMediaObject(p);
  for (const p of pennies) drawPenny(p);
  for (const b of xBalls) drawXBall(b);
  drawParticles();
  drawStage();
  drawPlayer();
}

function loop(now) {
  if (!running) return;
  const dt = Math.min((now - last) / 16.67, 2);
  last = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

function end(win) {
  if (!running) return;
  running = false;
  $('#end').classList.remove('hidden');
  $('#endTitle').textContent = win ? 'YOU REACHED THE STAGE.' : 'THE CURRENT WON THIS ROUND.';
  $('#endText').textContent = `Value ${value} · Attention ${attention}. ${
    win
      ? value > attention
        ? 'You created more value than attention.'
        : 'You arrived, but attention still outweighed value.'
      : 'Try again. Use short dashes to reach the moving media without losing control.'
  }`;
}

function pressDirection(name) {
  const now = performance.now();
  const direction = name === 'left' ? -1 : 1;

  if (now - input.lastPress[name] < 285) {
    input.dashDir = direction;
    input.dashUntil = now + 470;
  }
  input.lastPress[name] = now;
  input[name] = true;
}

function releaseDirection(name) {
  input[name] = false;
}

$('#start').onclick = () => {
  $('#intro').classList.add('hidden');
  reset();
  running = true;
  last = performance.now();
  requestAnimationFrame(loop);
};

$('#exit').onclick = () => {
  if (parent !== window) parent.postMessage('closeExperience', '*');
  else location.href = '../../#experiences';
};

addEventListener('keydown', event => {
  if (event.repeat && event.key !== 'ArrowUp') return;
  if (event.key === 'ArrowLeft') pressDirection('left');
  if (event.key === 'ArrowRight') pressDirection('right');
  if (event.key === 'ArrowUp' || event.code === 'Space') {
    event.preventDefault();
    input.jumpQueued = true;
  }
});

addEventListener('keyup', event => {
  if (event.key === 'ArrowLeft') releaseDirection('left');
  if (event.key === 'ArrowRight') releaseDirection('right');
});

function bindDirection(selector, name) {
  const element = $(selector);
  element.onpointerdown = event => {
    event.preventDefault();
    pressDirection(name);
  };
  element.onpointerup = () => releaseDirection(name);
  element.onpointerleave = () => releaseDirection(name);
  element.onpointercancel = () => releaseDirection(name);
}

bindDirection('#left', 'left');
bindDirection('#right', 'right');
$('#jump').textContent = '↑ JUMP';
$('#jump').onpointerdown = event => {
  event.preventDefault();
  input.jumpQueued = true;
};

loadAssets().then(() => {
  reset();
  draw();
});
