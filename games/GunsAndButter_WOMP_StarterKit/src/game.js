// Guns & Butter — Weapons of Mass Production (WOMP) Range Game Engine
// Built for high fidelity, polished arcade responsiveness, and robust physics.

// --- CONFIG & GLOBAL STATE ---
const c = document.getElementById('game');
const x = c.getContext('2d');
const $ = id => document.getElementById(id);

let W = 0, H = 0;
function resize() {
  W = c.width = window.innerWidth;
  H = c.height = window.innerHeight;
}
window.addEventListener('resize', () => { resize(); });
resize();

// Game States: 'START', 'ARSENAL', 'PLAYING', 'SCORE'
let gameState = 'START';

// Weapon database merged from json specifications
let weapons = [];
let projectilesConfig = {};
let currentWeaponIndex = 2; // Default: Note Rifle
let activeWeapon = null;

// Player Statistics
let score = 0;
let combo = 1;
let lastHitTime = 0;
const COMBO_TIMEOUT = 3500; // 3.5 seconds to maintain combo
let maxCombo = 1;
let shotsFired = 0;
let shotsHit = 0;
let targetsBrokenCount = 0;

// Firing / Reloading states
let ammoLeft = 30;
let maxAmmo = 30;
let lastFireTime = 0;
let isReloading = false;
let reloadStartTime = 0;
let reloadDuration = 1500; // ms

// Visual Recoil Spring System (Camera & Weapon)
let camRecoilX = 0, camRecoilY = 0;
let camRecoilVX = 0, camRecoilVY = 0;
const camStiffness = 180;
const camDamping = 15;

let gunRecoilZ = 0, gunRecoilRot = 0;
let gunRecoilVZ = 0, gunRecoilVRot = 0;
const gunStiffness = 120;
const gunDamping = 12;

// Weapon Bobbing and ADS (Aim Down Sights)
let bobTimer = 0;
let isADS = false; // Right mouse button triggers ADS
let adsProgress = 0; // 0 = Hipfire, 1 = Full ADS

// Inspect weapon state
let isInspecting = false;
let inspectStartTime = 0;

// Mouse aim offsets (-0.5 to 0.5)
let mx = 0, my = 0;

// Active Game Entities
const projectiles = [];
const targets = [];
const particles = [];
const debris = [];
const floatingTexts = [];

// Wave / Challenge Management
let currentWave = 1;
const totalWaves = 3;
let waveActive = false;

// Assets Loader
const assets = {
  bg: new Image(),
  armRig: new Image(),
  projectilesSheet: new Image(),
  projectileIcons: new Image(),
  targetsSheet: new Image(),
  effectsSheet: new Image(),
  cdDoubleBarrel: new Image(),
  keytarRifle: new Image(),
  noteRifle: new Image(),
  vinylLauncher: new Image(),
  handCannon808: new Image(),
  harpJavelin: new Image(),
  firstPersonStates: new Image(),
  stafflineHero: new Image(), cdDoubleBarrelHero: new Image(), noteRifleHero: new Image(),
  harpJavelinHero: new Image(), handCannon808Hero: new Image(), vinylLauncherHero: new Image(), keytarRifleHero: new Image(),
  stafflineFPS: new Image(), cdDoubleBarrelFPS: new Image(), noteRifleFPS: new Image(),
  harpJavelinFPS: new Image(), handCannon808FPS: new Image(), vinylLauncherFPS: new Image(), keytarRifleFPS: new Image()
};

const assetPaths = {
  bg: 'assets/boards/production_board_01.png',
  armRig: 'assets/character/african_american_arm_rig_states.png',
  projectilesSheet: 'assets/projectiles/projectiles_sheet.png',
  projectileIcons: 'assets/projectiles/projectile_icons_clean.png',
  targetsSheet: 'assets/targets/targets_sheet.png',
  effectsSheet: 'assets/vfx/effects_sheet.png',
  cdDoubleBarrel: 'assets/weapons/cd_double_barrel_states.png',
  keytarRifle: 'assets/weapons/keytar_rifle_states.png',
  noteRifle: 'assets/weapons/note_rifle.png',
  vinylLauncher: 'assets/weapons/vinyl_launcher.png',
  handCannon808: 'assets/weapons/hand_cannon_808.png',
  harpJavelin: 'assets/weapons/harp_javelin.png',
  firstPersonStates: 'assets/character/first_person_states.png',
  stafflineHero: 'assets/weapons/production/staffline_hero.jpg',
  cdDoubleBarrelHero: 'assets/weapons/production/cd_double_barrel_hero.jpg',
  noteRifleHero: 'assets/weapons/production/note_rifle_hero.jpg',
  harpJavelinHero: 'assets/weapons/production/harp_javelin_hero.jpg',
  handCannon808Hero: 'assets/weapons/production/hand_cannon_808_hero.jpg',
  vinylLauncherHero: 'assets/weapons/production/vinyl_launcher_hero.jpg',
  keytarRifleHero: 'assets/weapons/production/keytar_rifle_hero.jpg',
  stafflineFPS: 'assets/weapons/production/staffline_fps.jpg',
  cdDoubleBarrelFPS: 'assets/weapons/production/cd_double_barrel_fps.jpg',
  noteRifleFPS: 'assets/weapons/production/note_rifle_fps.jpg',
  harpJavelinFPS: 'assets/weapons/production/harp_javelin_fps.jpg',
  handCannon808FPS: 'assets/weapons/production/hand_cannon_808_fps.jpg',
  vinylLauncherFPS: 'assets/weapons/production/vinyl_launcher_fps.jpg',
  keytarRifleFPS: 'assets/weapons/production/keytar_rifle_fps.jpg'
};

let assetsLoaded = 0;
const totalAssets = Object.keys(assetPaths).length;

function loadAssets() {
  const btnStart = $('btn-start');
  btnStart.textContent = "LOADING ASSETS...";
  btnStart.disabled = true;

  for (let key in assetPaths) {
    assets[key].onload = () => {
      assetsLoaded++;
      if (assetsLoaded === totalAssets) {
        btnStart.textContent = "ENTER ARSENAL";
        btnStart.disabled = false;
        console.log("All assets loaded successfully.");
      }
    };
    assets[key].onerror = (err) => {
      console.error(`Error loading asset: ${key} at ${assetPaths[key]}`, err);
      assetsLoaded++;
      if (assetsLoaded === totalAssets) {
        btnStart.textContent = "ENTER ARSENAL";
        btnStart.disabled = false;
      }
    };
    assets[key].src = assetPaths[key];
  }
}

// Load JSON data
async function loadConfig() {
  try {
    const resWeapons = await fetch('data/weapons.json');
    weapons = await resWeapons.json();

    const resProj = await fetch('data/projectiles.json');
    projectilesConfig = await resProj.json();

    console.log("Configs loaded successfully:", weapons, projectilesConfig);
  } catch (err) {
    console.error("Config fetch failed, using default fallbacks.", err);
    // Hardcoded fallbacks if fetch fails
    weapons = [
      { id: "staffline", name: "Staffline Sidearm", cls: "Sidearm", fire: "semi", projectile: "note_round", recoil: [0.55, 0.18], spread: 0.45, velocity: 120, gravity: 0.15, ricochet: 0.08, cooldown: 0.16, maxAmmo: 8 },
      { id: "cd_double_barrel", name: "CD Double Barrel", cls: "Heavy", fire: "dual", projectile: "charged_disc", recoil: [1.9, 0.7], spread: 2.4, velocity: 72, gravity: 0.22, ricochet: 0.72, cooldown: 0.72, maxAmmo: 2 },
      { id: "note_rifle", name: "Note Rifle", cls: "Rifle", fire: "auto", projectile: "note_round", recoil: [0.72, 0.24], spread: 0.75, velocity: 145, gravity: 0.12, ricochet: 0.12, cooldown: 0.095, maxAmmo: 30 },
      { id: "harp_javelin", name: "Harp Javelin", cls: "Hybrid", fire: "charge", projectile: "harp_javelin", recoil: [0.35, 0.08], spread: 0.05, velocity: 55, gravity: 7.2, ricochet: 0.0, cooldown: 0.7, maxAmmo: 1 },
      { id: "hand_cannon_808", name: "808 Hand Cannon", cls: "Sidearm", fire: "semi", projectile: "bass_sphere", recoil: [1.35, 0.34], spread: 0.2, velocity: 38, gravity: 0.0, ricochet: 0.0, cooldown: 0.48, maxAmmo: 5 },
      { id: "vinyl_launcher", name: "Vinyl Launcher", cls: "Heavy", fire: "semi", projectile: "vinyl_disc", recoil: [0.9, 0.4], spread: 0.25, velocity: 82, gravity: 0.4, ricochet: 0.82, cooldown: 0.3, maxAmmo: 6 },
      { id: "keytar_rifle", name: "Keytar Rifle", cls: "Rifle", fire: "burst", projectile: "synth_wave", recoil: [0.45, 0.16], spread: 0.55, velocity: 160, gravity: 0.0, ricochet: 0.0, cooldown: 0.13, maxAmmo: 15 }
    ];
    projectilesConfig = {
      note_round: { radius: 0.035, damage: 18, lifetime: 2.2, mode: "physical" },
      charged_disc: { radius: 0.16, damage: 34, lifetime: 4.0, mode: "physical", maxRicochets: 3 },
      harp_javelin: { radius: 0.06, damage: 60, lifetime: 5.0, mode: "physical", stick: true },
      bass_sphere: { radius: 0.32, damage: 42, lifetime: 3.0, mode: "spherecast", impulse: 18 },
      vinyl_disc: { radius: 0.14, damage: 28, lifetime: 4.0, mode: "physical", maxRicochets: 4 },
      synth_wave: { radius: 0.12, damage: 15, lifetime: 1.5, mode: "rayburst" }
    };
  }
  setupWeapon(currentWeaponIndex);
}

// Setup active weapon state
function setupWeapon(index) {
  currentWeaponIndex = index;
  activeWeapon = weapons[currentWeaponIndex];
  maxAmmo = activeWeapon.maxAmmo || (activeWeapon.id === 'note_rifle' ? 30 : activeWeapon.id === 'keytar_rifle' ? 15 : activeWeapon.id === 'staffline' ? 8 : activeWeapon.id === 'cd_double_barrel' ? 2 : activeWeapon.id === 'hand_cannon_808' ? 5 : activeWeapon.id === 'vinyl_launcher' ? 6 : 1);
  ammoLeft = maxAmmo;
  isReloading = false;
  isInspecting = false;
  $('weapon').textContent = activeWeapon.name;
  updateAmmoHUD();
  if (window.AudioManager) window.AudioManager.playEquip(activeWeapon.id);
}

function updateAmmoHUD() {
  $('ammo-text').textContent = `AMMO: ${ammoLeft} / ${maxAmmo}`;
  $('ammo-bar').style.width = `${(ammoLeft / maxAmmo) * 100}%`;
  if (ammoLeft === 0) {
    $('reload-message').style.display = 'block';
  } else {
    $('reload-message').style.display = 'none';
  }
}

function ensureAudioLive() {
  if (!window.AudioManager) return;
  try {
    window.AudioManager._unlockAudio();
  } catch (err) {
    console.warn('Audio unlock failed', err);
  }
}

const WEAPON_SHOWCASE_THEME = {
  staffline: { accent: '#ffd55d', accent2: '#22d9ff' },
  cd_double_barrel: { accent: '#ff9a3c', accent2: '#ff47d1' },
  note_rifle: { accent: '#ffd55d', accent2: '#ff9a3c' },
  harp_javelin: { accent: '#be6dff', accent2: '#ffcc66' },
  hand_cannon_808: { accent: '#ff5e5e', accent2: '#8e5bff' },
  vinyl_launcher: { accent: '#ff9a3c', accent2: '#ff3d7a' },
  keytar_rifle: { accent: '#22d9ff', accent2: '#86ff9d' }
};

function getWeaponTheme(id) {
  return WEAPON_SHOWCASE_THEME[id] || { accent: '#ffd55d', accent2: '#22d9ff' };
}

// --- CONTROLS / MOUSE LOOK ---
function normMouse(e) {
  const factor = isADS ? 0.0006 : 0.0015;
  mx += (e.movementX || 0) * factor;
  my += (e.movementY || 0) * factor;
  
  mx = Math.max(-0.5, Math.min(0.5, mx));
  my = Math.max(-0.4, Math.min(0.2, my));
}

document.addEventListener('mousemove', e => {
  if (document.pointerLockElement === c && gameState === 'PLAYING') {
    normMouse(e);
  }
});

c.addEventListener('click', () => {
  if (gameState === 'PLAYING') {
    c.requestPointerLock();
  }
});

// Key bindings
document.addEventListener('keydown', e => {
  if (gameState !== 'PLAYING') return;

  if (e.key >= '1' && e.key <= '7') {
    setupWeapon(parseInt(e.key) - 1);
    e.preventDefault();
  }
  if (e.key.toLowerCase() === 'r') {
    triggerReload();
    e.preventDefault();
  }
  if (e.key.toLowerCase() === 'i') {
    triggerInspect();
    e.preventDefault();
  }
});

// Right click toggles ADS
document.addEventListener('mousedown', e => {
  if (gameState !== 'PLAYING') return;
  if (e.button === 2) {
    isADS = true;
    e.preventDefault();
  }
});

document.addEventListener('mouseup', e => {
  if (gameState !== 'PLAYING') return;
  if (e.button === 2) {
    isADS = false;
    e.preventDefault();
  }
});

c.addEventListener('contextmenu', e => e.preventDefault());

// Left click triggers firing
c.addEventListener('mousedown', e => {
  if (gameState !== 'PLAYING') return;
  if (document.pointerLockElement !== c) {
    c.requestPointerLock();
    return;
  }
  if (e.button === 0) {
    triggerFire();
  }
});

// --- GAMEPLAY TRIGGERS ---

function triggerReload() {
  ensureAudioLive();
  if (isReloading || ammoLeft === maxAmmo) return;
  isReloading = true;
  reloadStartTime = performance.now();
  if (window.AudioManager) window.AudioManager.playReload(activeWeapon.id);
  
  gunRecoilVZ = -18;
  gunRecoilVRot = 0.35;
}

function triggerInspect() {
  ensureAudioLive();
  if (isReloading || isInspecting) return;
  isInspecting = true;
  inspectStartTime = performance.now();
  if (window.AudioManager) window.AudioManager.playSpecial(activeWeapon.id);
}

function triggerFire() {
  ensureAudioLive();
  if (isReloading) return;
  if (ammoLeft <= 0) {
    triggerReload();
    return;
  }

  const now = performance.now();
  const cd = activeWeapon.cooldown * 1000;
  if (now - lastFireTime < cd) return;

  if (activeWeapon.fire === 'burst') {
    fireBurst(3, 80);
  } else if (activeWeapon.fire === 'dual') {
    fireDual();
  } else {
    fireSingle();
  }
}

// Single projectile fire
function fireSingle() {
  const now = performance.now();
  lastFireTime = now;
  ammoLeft--;
  shotsFired++;
  updateAmmoHUD();

  if (window.AudioManager) window.AudioManager.playWompFire(activeWeapon.id);
  createMuzzleFlash();
  spawnProjectile(0, 0);
  applyRecoilImpulse();
}

// Dual projectile fire (CD double barrel)
function fireDual() {
  const now = performance.now();
  lastFireTime = now;
  ammoLeft = Math.max(0, ammoLeft - 2);
  shotsFired += 2;
  updateAmmoHUD();

  if (window.AudioManager) window.AudioManager.playWompFire(activeWeapon.id);
  createMuzzleFlash(-35);
  createMuzzleFlash(35);

  spawnProjectile(-0.02, 0);
  spawnProjectile(0.02, 0);

  applyRecoilImpulse(1.6);
}

// Burst fire (Keytar)
function fireBurst(count, intervalMs) {
  let shots = 0;
  lastFireTime = performance.now() + (count - 1) * intervalMs;

  function fireNext() {
    if (ammoLeft <= 0 || isReloading || gameState !== 'PLAYING') return;
    ammoLeft--;
    shotsFired++;
    updateAmmoHUD();

    if (window.AudioManager) window.AudioManager.playWompFire(activeWeapon.id);
    createMuzzleFlash();
    spawnProjectile(0, 0);
    applyRecoilImpulse(0.75);

    shots++;
    if (shots < count) {
      setTimeout(fireNext, intervalMs);
    }
  }
  fireNext();
}

function applyRecoilImpulse(mult = 1.0) {
  const kickV = activeWeapon.recoil[0] * mult;
  const kickH = activeWeapon.recoil[1] * mult;

  camRecoilVY -= kickV * 9;
  camRecoilVX += (Math.random() - 0.5) * kickH * 12;

  gunRecoilVZ -= kickV * 35;
  gunRecoilVRot += (Math.random() - 0.5) * kickH * 0.9;
}

// Projectile Spawning
function spawnProjectile(offsetX, offsetY) {
  const projType = activeWeapon.projectile;
  const cfg = projectilesConfig[projType];

  const angleSpread = (activeWeapon.spread * (isADS ? 0.4 : 1.0) * (Math.random() - 0.5)) * 0.05;
  const targetX = 0.5 + mx + offsetX + angleSpread;
  const targetY = 0.5 + my + offsetY + angleSpread;

  const proj = {
    x: 0.5 + offsetX,
    y: 0.85,
    z: 0.1,
    vx: (targetX - 0.5) * activeWeapon.velocity * 0.08,
    vy: (targetY - 0.85) * activeWeapon.velocity * 0.08,
    vz: activeWeapon.velocity * 0.02,
    gravity: activeWeapon.gravity * 0.08,
    ricochetsLeft: cfg.maxRicochets || 0,
    weaponId: activeWeapon.id,
    type: projType,
    radius: cfg.radius,
    damage: cfg.damage,
    life: cfg.lifetime,
    color: activeWeapon.id === 'keytar_rifle' ? '#ff2a85' : activeWeapon.id === 'cd_double_barrel' ? '#00e5ff' : '#ffd55d',
    stickTarget: null,
    stickOffsetX: 0,
    stickOffsetY: 0,
    vibrateTime: 0,
    trail: []
  };

  projectiles.push(proj);
}

// Muzzle Flash effect
function createMuzzleFlash(offsetPx = 0) {
  let cellIndex = 1;
  if (activeWeapon.id === 'hand_cannon_808') cellIndex = 0;
  else if (activeWeapon.id === 'keytar_rifle' || activeWeapon.id === 'cd_double_barrel') cellIndex = 2;

  const scaleMult = H * 0.0016;

  particles.push({
    x: offsetPx,
    y: -80,
    vx: 0,
    vy: 0,
    cell: cellIndex,
    scale: scaleMult * 1.6,
    life: 0.08,
    maxLife: 0.08,
    isMuzzleFlash: true
  });
}

// --- PARTICLE SYSTEMS ---
function spawnSpark(x, y, color = '#ffd55d', vx = 0, vy = 0) {
  particles.push({
    x: x,
    y: y,
    vx: vx || (Math.random() - 0.5) * 300,
    vy: vy || (Math.random() - 0.5) * 300 - 100,
    r: 3 + Math.random() * 4,
    life: 0.4 + Math.random() * 0.3,
    maxLife: 0.7,
    color: color,
    gravity: 300
  });
}

// Draw procedural canyon backgrounds
function drawCanyonBackground(ctx, panX, panY) {
  // A. Sky Gradient
  const skyGrd = ctx.createLinearGradient(0, 0, 0, H);
  skyGrd.addColorStop(0, '#0a0d18');
  skyGrd.addColorStop(0.45, '#1e243b');
  skyGrd.addColorStop(0.7, '#bf7540');
  skyGrd.addColorStop(0.85, '#ffd55d');
  skyGrd.addColorStop(1.0, '#30211a');
  ctx.fillStyle = skyGrd;
  ctx.fillRect(0, 0, W, H);

  // Distant Sun/Glow
  const sunX = W * 0.5 + panX * 0.2;
  const sunY = H * 0.45 + panY * 0.2;
  const sunGrd = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 250);
  sunGrd.addColorStop(0, 'rgba(255, 213, 93, 0.45)');
  sunGrd.addColorStop(0.5, 'rgba(191, 117, 64, 0.15)');
  sunGrd.addColorStop(1.0, 'rgba(10, 13, 24, 0)');
  ctx.fillStyle = sunGrd;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 250, 0, Math.PI * 2);
  ctx.fill();

  // B. Layer 1: Distant Canyon Spires (Parallax x0.3)
  ctx.fillStyle = '#26120c';
  ctx.beginPath();
  let px = panX * 0.3;
  ctx.moveTo(0, H);
  ctx.lineTo(0, H * 0.55 + panY * 0.3);
  
  const peakCount = 12;
  for (let i = 1; i <= peakCount; i++) {
    const xx = (i / peakCount) * (W + 200) - 100 + px;
    const yy = H * (0.55 + (i % 2 === 0 ? -0.06 : 0.04) + Math.sin(i * 1.7) * 0.05) + panY * 0.3;
    ctx.lineTo(xx, yy);
  }
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();

  // C. Layer 2: Closer Canyon Spires (Parallax x0.65)
  ctx.fillStyle = '#1c0c08';
  ctx.beginPath();
  px = panX * 0.65;
  ctx.moveTo(0, H);
  ctx.lineTo(0, H * 0.65 + panY * 0.65);
  
  const closerPeakCount = 8;
  for (let i = 1; i <= closerPeakCount; i++) {
    const xx = (i / closerPeakCount) * (W + 300) - 150 + px;
    const isPlateau = i % 3 === 0;
    const yy = H * (0.68 + (isPlateau ? -0.02 : 0.08) + Math.cos(i * 2.3) * 0.06) + panY * 0.65;
    ctx.lineTo(xx, yy);
  }
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fill();
  
  // D. Drawing Speaker silhouettes
  const drawTower = (tx, ty, tscale, tpx) => {
    ctx.save();
    ctx.translate(tx + tpx, ty + panY * 0.7);
    ctx.fillStyle = '#0b0402';
    ctx.beginPath();
    ctx.moveTo(-15 * tscale, 0);
    ctx.lineTo(-5 * tscale, -120 * tscale);
    ctx.lineTo(5 * tscale, -120 * tscale);
    ctx.lineTo(15 * tscale, 0);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(0, -125 * tscale, 18 * tscale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  
  drawTower(W * 0.15, H * 0.75, 1.2, panX * 0.7);
  drawTower(W * 0.85, H * 0.75, 1.2, panX * 0.7);
}

function spawnFloatingText(text, x, y, color = '#ffd55d') {
  floatingTexts.push({
    text: text,
    x: x,
    y: y,
    vy: -60,
    life: 1.0,
    maxLife: 1.0,
    color: color
  });
}

// --- TARGET SPAWNING & REACTION ---

// Precise crop bounds in targets_sheet.png
const TARGET_TYPES = {
  bullseye: { x: 3, y: 3, w: 42, h: 42, points: 150, maxHp: 1, sfx: 'paper' },
  silhouette: { x: 51, y: 3, w: 42, h: 42, points: 200, maxHp: 1, sfx: 'paper' },
  speaker: { x: 243, y: 3, w: 42, h: 42, points: 250, maxHp: 2, sfx: 'armor' },
  crate: { x: 99, y: 51, w: 42, h: 42, points: 300, maxHp: 2, sfx: 'wood' },
  barrel: { x: 147, y: 51, w: 42, h: 42, points: 400, maxHp: 3, sfx: 'metal' },
  terminal: { x: 195, y: 3, w: 42, h: 42, points: 500, maxHp: 4, sfx: 'armor' }
};

function setupWave(waveNum) {
  currentWave = waveNum;
  targets.length = 0;
  waveActive = true;
  
  $('wave-indicator').textContent = `WAVE ${currentWave} / ${totalWaves}`;
  const banner = $('wave-banner');
  banner.textContent = `WAVE ${currentWave}`;
  banner.style.opacity = 1;
  setTimeout(() => { banner.style.opacity = 0; }, 2000);

  if (waveNum === 1) {
    const layouts = [
      { type: 'bullseye', x: 0.2, y: 0.35, z: 0.8 },
      { type: 'bullseye', x: 0.8, y: 0.38, z: 0.8 },
      { type: 'silhouette', x: 0.35, y: 0.42, z: 0.6 },
      { type: 'silhouette', x: 0.65, y: 0.42, z: 0.6 },
      { type: 'bullseye', x: 0.5, y: 0.32, z: 0.95 },
      { type: 'silhouette', x: 0.5, y: 0.48, z: 0.5 }
    ];
    layouts.forEach(l => spawnTarget(l.type, l.x, l.y, l.z, 0));
  } else if (waveNum === 2) {
    const layouts = [
      { type: 'speaker', x: 0.15, y: 0.38, z: 0.75, speed: 0.08 },
      { type: 'speaker', x: 0.85, y: 0.38, z: 0.75, speed: -0.08 },
      { type: 'crate', x: 0.3, y: 0.48, z: 0.5, speed: 0.12 },
      { type: 'crate', x: 0.7, y: 0.48, z: 0.5, speed: -0.12 },
      { type: 'speaker', x: 0.5, y: 0.34, z: 0.9, speed: 0.05 },
      { type: 'crate', x: 0.5, y: 0.52, z: 0.4, speed: -0.15 },
      { type: 'bullseye', x: 0.2, y: 0.45, z: 0.6, speed: 0.1 },
      { type: 'bullseye', x: 0.8, y: 0.45, z: 0.6, speed: -0.1 }
    ];
    layouts.forEach(l => spawnTarget(l.type, l.x, l.y, l.z, l.speed));
  } else if (waveNum === 3) {
    const layouts = [
      { type: 'terminal', x: 0.5, y: 0.38, z: 0.8, speed: 0 },
      { type: 'barrel', x: 0.2, y: 0.48, z: 0.6, speed: 0.07 },
      { type: 'barrel', x: 0.8, y: 0.48, z: 0.6, speed: -0.07 },
      { type: 'terminal', x: 0.3, y: 0.32, z: 0.9, speed: -0.03 },
      { type: 'terminal', x: 0.7, y: 0.32, z: 0.9, speed: 0.03 },
      { type: 'barrel', x: 0.5, y: 0.52, z: 0.4, speed: 0.15 },
      { type: 'speaker', x: 0.5, y: 0.28, z: 0.95, speed: 0 }
    ];
    layouts.forEach(l => spawnTarget(l.type, l.x, l.y, l.z, l.speed));
  }
}

function spawnTarget(type, x, y, z, speed = 0) {
  const id = Math.random().toString(36).substring(2, 9);
  const info = TARGET_TYPES[type];
  targets.push({
    id: id,
    type: type,
    x: x,
    y: y,
    z: z,
    baseX: x,
    hp: info.maxHp,
    maxHp: info.maxHp,
    points: info.points,
    sfx: info.sfx,
    vx: speed,
    wobble: 0,
    wobbleSpeed: 0,
    shake: 0,
    status: 'INTACT',
    brokenTime: 0
  });
}

function damageTarget(target, dmg, projX, projY) {
  if (target.hp <= 0) return;
  target.hp -= dmg;
  target.shake = Math.min(25, target.shake + dmg * 2.5);
  
  if (window.AudioManager) window.AudioManager.playImpact(target.sfx, dmg, { x: target.x, y: target.y });

  const basePoints = Math.round(dmg * 5 * combo);
  score += basePoints;
  $('score').textContent = score.toLocaleString();
  
  const sparkColor = target.sfx === 'metal' || target.sfx === 'armor' ? '#22d9ff' : target.sfx === 'wood' ? '#d7a83e' : '#f4f1e6';
  for (let i = 0; i < 6; i++) {
    spawnSpark(projX * W, projY * H, sparkColor);
  }

  const ratio = target.hp / target.maxHp;
  if (target.hp <= 0) {
    target.status = 'BROKEN';
    targetsBrokenCount++;
    if (window.AudioManager) window.AudioManager.playTargetBreak('explosion', { x: target.x, y: target.y });
    spawnFloatingText(`+${target.points * combo}!`, projX * W, projY * H - 30, '#ffd55d');
    score += target.points * combo;
    $('score').textContent = score.toLocaleString();
    
    spawnDebrisFromTarget(target);
  } else {
    if (ratio <= 0.35) {
      target.status = 'CRITICAL';
      spawnFloatingText("CRITICAL!", projX * W, projY * H - 30, '#ff5e5e');
    } else {
      target.status = 'DAMAGED';
      spawnFloatingText(`HIT!`, projX * W, projY * H - 30, '#ffd55d');
    }
  }

  shotsHit++;
  combo = Math.min(25, combo + 1);
  if (combo > maxCombo) maxCombo = combo;
  $('combo').textContent = 'x' + combo;
  
  if (combo > 1 && combo % 5 === 0 && window.AudioManager) {
    window.AudioManager.playCombo(Math.floor(combo / 5));
  }

  lastHitTime = performance.now();
}

function spawnDebrisFromTarget(target) {
  const info = TARGET_TYPES[target.type];
  const targetX = target.x * W;
  const targetY = target.y * H;
  const scale = 0.5 + target.z * 0.7;

  // Split target into 4 quadrant shards
  const qw = info.w / 2;
  const qh = info.h / 2;

  const offsets = [
    { dx: -qw/2, dy: -qh/2, sx: 0, sy: 0 },
    { dx: qw/2, dy: -qh/2, sx: qw, sy: 0 },
    { dx: -qw/2, dy: qh/2, sx: 0, sy: qh },
    { dx: qw/2, dy: qh/2, sx: qw, sy: qh }
  ];

  offsets.forEach((o) => {
    debris.push({
      x: targetX + o.dx * scale,
      y: targetY + o.dy * scale,
      vx: (o.dx / qw) * 150 + (Math.random() - 0.5) * 100,
      vy: -100 - Math.random() * 200,
      rot: Math.random() * Math.PI * 2,
      vrot: (Math.random() - 0.5) * 10,
      scale: scale,
      sheetX: info.x + o.sx,
      sheetY: info.y + o.sy,
      qw: qw,
      qh: qh,
      life: 1.5,
      maxLife: 1.5
    });
  });
}

// --- ARSENAL CARD BUILDER ---
function renderArsenalUI() {
  const grid = $('arsenal-grid');
  grid.innerHTML = '';

  weapons.forEach((w, i) => {
    const card = document.createElement('div');
    card.className = `womp-card ${i === currentWeaponIndex ? 'selected' : ''}`;
    card.setAttribute('data-index', i);

    const recoilStat = Math.max(10, 100 - w.recoil[0] * 40);
    const accuracyStat = Math.max(10, 100 - w.spread * 15);
    const speedStat = Math.min(100, w.velocity * 0.6);

    card.innerHTML = `
      <div class="womp-icon-container">
        <img class="womp-hero-art" src="assets/weapons/production/${w.id}_hero.jpg" alt="${w.name}">
      </div>
      <div class="womp-name">${w.name}</div>
      <div class="womp-class">${w.cls}</div>
      <div class="womp-stats">
        <div class="womp-stat-row">
          <span>CONTROL</span>
          <div class="womp-stat-bar-bg"><div class="womp-stat-bar" style="width: ${recoilStat}%"></div></div>
        </div>
        <div class="womp-stat-row">
          <span>ACCURACY</span>
          <div class="womp-stat-bar-bg"><div class="womp-stat-bar" style="width: ${accuracyStat}%"></div></div>
        </div>
        <div class="womp-stat-row">
          <span>FORCE</span>
          <div class="womp-stat-bar-bg"><div class="womp-stat-bar" style="width: ${speedStat}%"></div></div>
        </div>
      </div>
      <div class="card-actions">
        <button class="btn-preview" onclick="event.stopPropagation(); previewWomp('${w.id}')">SONIC PREVIEW</button>
        <button class="btn-select" onclick="event.stopPropagation(); selectWomp(${i})">SELECT</button>
      </div>
    `;

    card.addEventListener('click', () => {
      document.querySelectorAll('.womp-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectWomp(i);
    });

    grid.appendChild(card);
  });

}

window.previewWomp = (id) => {
  ensureAudioLive();
  if (window.AudioManager) {
    window.AudioManager.playWompFire(id, true);
  }
};

window.selectWomp = (idx) => {
  ensureAudioLive();
  setupWeapon(idx);
  document.querySelectorAll('.womp-card').forEach((c, i) => {
    if (i === idx) c.classList.add('selected');
    else c.classList.remove('selected');
  });
  $('btn-enter-range').classList.remove('hidden');
};

// Toggle Settings collapsible
$('btn-toggle-settings').addEventListener('click', () => {
  const panel = $('settings-panel');
  panel.classList.toggle('collapsed');
});

// Settings Sliders Listeners
const setupSliders = () => {
  const sliders = {
    master: $('slider-master'),
    music: $('slider-music'),
    womp: $('slider-womp')
  };

  for (let k in sliders) {
    sliders[k].addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      $(`val-${k}`).textContent = `${Math.round(val * 100)}%`;
      if (window.AudioManager) {
        window.AudioManager.setVolume(k, val);
      }
    });
    if (window.AudioManager) {
      sliders[k].value = window.AudioManager.volumes[k];
      $(`val-${k}`).textContent = `${Math.round(window.AudioManager.volumes[k] * 100)}%`;
    }
  }
};

// UI Screen Navigation clicks
$('btn-start').addEventListener('click', () => {
  ensureAudioLive();
  setupSliders();
  gameState = 'ARSENAL';
  $('screen-start').classList.add('hidden');
  $('screen-arsenal').classList.remove('hidden');
  renderArsenalUI();
});

$('btn-enter-range').addEventListener('click', () => {
  ensureAudioLive();
  gameState = 'PLAYING';
  $('screen-arsenal').classList.add('hidden');
  $('hud').classList.remove('hidden');
  resetGameStats();
  setupWave(1);
  c.requestPointerLock();
});

$('btn-return-arsenal').addEventListener('click', () => {
  document.exitPointerLock();
  gameState = 'ARSENAL';
  $('hud').classList.add('hidden');
  $('screen-arsenal').classList.remove('hidden');
  renderArsenalUI();
});

$('btn-score-arsenal').addEventListener('click', () => {
  gameState = 'ARSENAL';
  $('screen-score').classList.add('hidden');
  $('screen-arsenal').classList.remove('hidden');
  renderArsenalUI();
});

$('btn-score-replay').addEventListener('click', () => {
  gameState = 'PLAYING';
  $('screen-score').classList.add('hidden');
  $('hud').classList.remove('hidden');
  resetGameStats();
  setupWave(1);
  c.requestPointerLock();
});

function resetGameStats() {
  score = 0;
  combo = 1;
  maxCombo = 1;
  shotsFired = 0;
  shotsHit = 0;
  targetsBrokenCount = 0;
  lastHitTime = performance.now();
  $('score').textContent = '0';
  $('combo').textContent = 'x1';
  projectiles.length = 0;
  targets.length = 0;
  particles.length = 0;
  debris.length = 0;
  floatingTexts.length = 0;
}

function showScoreScreen() {
  gameState = 'SCORE';
  $('hud').classList.add('hidden');
  $('screen-score').classList.remove('hidden');
  document.exitPointerLock();

  const acc = shotsFired > 0 ? Math.round((shotsHit / shotsFired) * 100) : 0;
  $('stat-accuracy').textContent = `${acc}%`;
  $('stat-shots').textContent = shotsFired;
  $('stat-targets').textContent = targetsBrokenCount;
  $('stat-combo').textContent = `x${maxCombo}`;
  $('stat-score').textContent = score.toLocaleString();
}

function roundRectPath(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w * 0.5, h * 0.5);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawWeaponShowcase(ctx, now, panX, panY) {
  const heroArtMap = {
    staffline: assets.stafflineHero,
    cd_double_barrel: assets.cdDoubleBarrelHero,
    note_rifle: assets.noteRifleHero,
    harp_javelin: assets.harpJavelinHero,
    hand_cannon_808: assets.handCannon808Hero,
    vinyl_launcher: assets.vinylLauncherHero,
    keytar_rifle: assets.keytarRifleHero
  };

  const hero = heroArtMap[activeWeapon.id] || assets.noteRifleHero;
  const theme = getWeaponTheme(activeWeapon.id);
  const panelW = Math.min(W * 0.38, 480);
  const panelH = Math.min(H * 0.28, 280);
  const panelX = W - panelW - 40 + panX * 0.08;
  const panelY = H - panelH - 36 + panY * 0.06 + Math.max(-6, gunRecoilZ * 0.12);
  const firePulse = now - lastFireTime < 130 ? 1 : 0;
  const glow = 18 + 18 * firePulse + 4 * Math.sin(now * 0.004);

  ctx.save();
  ctx.shadowColor = `${theme.accent}88`;
  ctx.shadowBlur = glow;
  const bg = ctx.createLinearGradient(panelX, panelY, panelX + panelW, panelY + panelH);
  bg.addColorStop(0, 'rgba(4, 10, 22, 0.9)');
  bg.addColorStop(1, 'rgba(10, 20, 35, 0.82)');
  roundRectPath(ctx, panelX, panelY, panelW, panelH, 26);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.restore();

  ctx.save();
  roundRectPath(ctx, panelX, panelY, panelW, panelH, 26);
  ctx.clip();

  const innerGlow = ctx.createRadialGradient(panelX + panelW * 0.72, panelY + panelH * 0.42, 20, panelX + panelW * 0.72, panelY + panelH * 0.42, panelW * 0.75);
  innerGlow.addColorStop(0, `${theme.accent}44`);
  innerGlow.addColorStop(0.4, `${theme.accent2}16`);
  innerGlow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = innerGlow;
  ctx.fillRect(panelX, panelY, panelW, panelH);

  if (hero && hero.complete && hero.naturalWidth) {
    ctx.imageSmoothingEnabled = true;
    if ('imageSmoothingQuality' in ctx) ctx.imageSmoothingQuality = 'high';
    const cropTop = hero.naturalHeight * 0.18;
    const cropH = hero.naturalHeight - cropTop;
    const motionX = Math.sin(now * 0.0017) * 8 + (mx * 18);
    const motionY = Math.cos(now * 0.0012) * 6 + (my * 12) + gunRecoilZ * 0.08;
    const scale = 1.03 + firePulse * 0.04;
    const artW = panelW * scale;
    const artH = artW * (cropH / hero.naturalWidth);
    const artX = panelX + panelW * 0.5 - artW * 0.5 + motionX;
    const artY = panelY + panelH * 0.56 - artH * 0.5 + motionY;

    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.drawImage(hero, 0, cropTop, hero.naturalWidth, cropH, artX + 16, artY + 18, artW, artH);
    ctx.restore();

    ctx.save();
    ctx.filter = `drop-shadow(0 0 ${10 + 8 * firePulse}px ${theme.accent2})`;
    ctx.drawImage(hero, 0, cropTop, hero.naturalWidth, cropH, artX, artY, artW, artH);
    ctx.restore();
  }

  drawWeaponAura(ctx, now, panelX, panelY, panelW, panelH, theme);

  const gloss = ctx.createLinearGradient(panelX, panelY, panelX, panelY + panelH);
  gloss.addColorStop(0, 'rgba(255,255,255,0.18)');
  gloss.addColorStop(0.15, 'rgba(255,255,255,0.04)');
  gloss.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gloss;
  ctx.fillRect(panelX, panelY, panelW, panelH * 0.28);
  ctx.restore();

  ctx.save();
  ctx.lineWidth = 2;
  ctx.strokeStyle = `${theme.accent}cc`;
  roundRectPath(ctx, panelX, panelY, panelW, panelH, 26);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(34, 217, 255, 0.45)';
  roundRectPath(ctx, panelX + 8, panelY + 8, panelW - 16, panelH - 16, 20);
  ctx.stroke();

  ctx.fillStyle = 'rgba(255, 213, 93, 0.95)';
  ctx.font = '700 13px Rajdhani';
  ctx.textAlign = 'left';
  ctx.fillText(activeWeapon.name.toUpperCase(), panelX + 18, panelY + 22);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '700 11px Rajdhani';
  ctx.fillText((activeWeapon.cls || '').toUpperCase(), panelX + 18, panelY + 38);
  ctx.restore();
}

function drawWeaponAura(ctx, now, x0, y0, w, h, theme) {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const t = now * 0.001;
  if (activeWeapon.id === 'note_rifle') {
    for (let i = 0; i < 6; i++) {
      const x = x0 + w * (0.62 + i * 0.06);
      const y = y0 + h * (0.52 + Math.sin(t * 2 + i) * 0.12);
      ctx.fillStyle = i % 2 ? theme.accent : theme.accent2;
      ctx.beginPath();
      ctx.arc(x, y, 4 + i % 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 3, y - 10); ctx.lineTo(x + 3, y + 4);
      ctx.stroke();
    }
  } else if (activeWeapon.id === 'cd_double_barrel' || activeWeapon.id === 'vinyl_launcher') {
    for (let i = 0; i < 2; i++) {
      const cx = x0 + w * (0.78 + i * 0.08);
      const cy = y0 + h * (0.56 - i * 0.06);
      const r = 16 + 4 * Math.sin(t * 4 + i);
      ctx.strokeStyle = i ? theme.accent2 : theme.accent;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r, t * 2, t * 2 + Math.PI * 1.5);
      ctx.stroke();
    }
  } else if (activeWeapon.id === 'harp_javelin') {
    ctx.strokeStyle = theme.accent2;
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const yy = y0 + h * (0.35 + i * 0.08);
      ctx.beginPath();
      ctx.moveTo(x0 + w * 0.56, yy);
      ctx.bezierCurveTo(x0 + w * 0.7, yy - 8, x0 + w * 0.84, yy + 8, x0 + w * 0.96, yy + Math.sin(t * 3 + i) * 8);
      ctx.stroke();
    }
  } else if (activeWeapon.id === 'hand_cannon_808') {
    for (let i = 0; i < 3; i++) {
      const r = 30 + i * 18 + Math.sin(t * 6 + i) * 4;
      ctx.strokeStyle = i % 2 ? theme.accent2 : theme.accent;
      ctx.lineWidth = 3 - i * 0.7;
      ctx.globalAlpha = 0.55 - i * 0.12;
      ctx.beginPath();
      ctx.arc(x0 + w * 0.78, y0 + h * 0.54, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (activeWeapon.id === 'keytar_rifle') {
    for (let i = 0; i < 8; i++) {
      const xx = x0 + w * (0.58 + i * 0.045);
      const barH = 12 + Math.sin(t * 5 + i) * 10 + i * 2;
      ctx.fillStyle = i % 2 ? theme.accent : theme.accent2;
      ctx.globalAlpha = 0.5;
      ctx.fillRect(xx, y0 + h * 0.6 - barH, 7, barH);
    }
  } else {
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const yy = y0 + h * (0.44 + i * 0.055);
      ctx.beginPath();
      ctx.moveTo(x0 + w * 0.54, yy);
      ctx.lineTo(x0 + w * 0.98, yy + Math.sin(t * 4 + i) * 6);
      ctx.stroke();
    }
  }
  ctx.restore();
}

// --- UPDATE & RUN LOOP ---
let lastTime = performance.now();

function update(dt) {
  bobTimer += dt * (isADS ? 2.5 : 5.0);

  camRecoilVY += (-camStiffness * camRecoilY - camDamping * camRecoilVY) * dt;
  camRecoilVX += (-camStiffness * camRecoilX - camDamping * camRecoilVX) * dt;
  camRecoilY += camRecoilVY * dt;
  camRecoilX += camRecoilVX * dt;

  gunRecoilZ += (-gunStiffness * gunRecoilZ - gunDamping * gunRecoilVZ) * dt;
  gunRecoilVRot += (-gunStiffness * gunRecoilRot - gunDamping * gunRecoilVRot) * dt;
  gunRecoilZ += gunRecoilVZ * dt;
  gunRecoilRot += gunRecoilVRot * dt;

  if (isADS) {
    adsProgress = Math.min(1.0, adsProgress + dt * 8);
  } else {
    adsProgress = Math.max(0.0, adsProgress - dt * 8);
  }

  if (isReloading) {
    const elapsed = performance.now() - reloadStartTime;
    if (elapsed >= reloadDuration) {
      isReloading = false;
      ammoLeft = maxAmmo;
      updateAmmoHUD();
    }
  }

  if (isInspecting) {
    const elapsed = performance.now() - inspectStartTime;
    if (elapsed >= 2200) {
      isInspecting = false;
    }
  }

  if (combo > 1 && performance.now() - lastHitTime > COMBO_TIMEOUT) {
    combo = 1;
    $('combo').textContent = 'x' + combo;
  }

  if (waveActive && targets.length > 0 && targets.every(t => t.status === 'BROKEN')) {
    waveActive = false;
    setTimeout(() => {
      if (currentWave < totalWaves) {
        setupWave(currentWave + 1);
      } else {
        showScoreScreen();
      }
    }, 1500);
  }

  // 1. Update Projectiles
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];

    if (p.stickTarget) {
      p.x = p.stickTarget.x + p.stickOffsetX;
      p.y = p.stickTarget.y + p.stickOffsetY;
      p.life -= dt;
      p.vibrateTime -= dt;
      if (p.life <= 0 || p.stickTarget.status === 'BROKEN') {
        projectiles.splice(i, 1);
      }
      continue;
    }

    p.vy += p.gravity * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.z += p.vz * dt;
    p.life -= dt;

    p.trail.push({ x: p.x, y: p.y, z: p.z });
    if (p.trail.length > 8) p.trail.shift();

    if (p.x < 0.05 || p.x > 0.95) {
      if (p.ricochetsLeft > 0) {
        p.vx = -p.vx * 0.8;
        p.x = p.x < 0.05 ? 0.051 : 0.949;
        p.ricochetsLeft--;
        if (window.AudioManager) window.AudioManager.playRicochet('whistle', Math.abs(p.vx * 10), { x: p.x, y: p.y });
      } else {
        projectiles.splice(i, 1);
        continue;
      }
    }
    if (p.y > 0.82) {
      if (p.ricochetsLeft > 0) {
        p.vy = -p.vy * 0.75;
        p.y = 0.819;
        p.ricochetsLeft--;
        if (window.AudioManager) window.AudioManager.playRicochet('whistle', Math.abs(p.vy * 10), { x: p.x, y: p.y });
      } else {
        projectiles.splice(i, 1);
        continue;
      }
    }

    let hitSomething = false;
    for (const t of targets) {
      if (t.status === 'BROKEN') continue;

      const tScale = 0.5 + t.z * 0.7;
      const info = TARGET_TYPES[t.type];
      
      const radiusX = (info.w / W) * tScale * 1.0;
      const radiusY = (info.h / H) * tScale * 1.0;

      const dx = Math.abs(p.x - t.x);
      const dy = Math.abs(p.y - t.y);

      if (dx < radiusX && dy < radiusY && Math.abs(p.z - t.z) < 0.15) {
        hitSomething = true;

        if (activeWeapon.projectile === 'harp_javelin' && activeWeapon.id === 'harp_javelin') {
          p.stickTarget = t;
          p.stickOffsetX = p.x - t.x;
          p.stickOffsetY = p.y - t.y;
          p.vibrateTime = 0.8;
          p.vx = 0;
          p.vy = 0;
          p.vz = 0;
          damageTarget(t, p.damage, p.x, p.y);
        } else if (p.ricochetsLeft > 0) {
          p.vx = -p.vx * 0.8;
          p.vy = (p.vy - 0.02) * 0.8;
          p.ricochetsLeft--;
          damageTarget(t, p.damage, p.x, p.y);
          if (window.AudioManager) window.AudioManager.playRicochet('whistle', 20, { x: p.x, y: p.y });
        } else {
          damageTarget(t, p.damage, p.x, p.y);
          projectiles.splice(i, 1);
        }
        break;
      }
    }

    if (hitSomething) continue;

    if (p.life <= 0 || p.z > 1.2) {
      projectiles.splice(i, 1);
    }
  }

  targets.forEach(t => {
    if (t.status === 'BROKEN') return;
    
    if (t.vx !== 0) {
      t.x += t.vx * dt;
      if (t.x < 0.15) { t.x = 0.15; t.vx = -t.vx; }
      if (t.x > 0.85) { t.x = 0.85; t.vx = -t.vx; }
    }

    if (t.shake > 0) {
      t.shake *= 0.85;
    }
  });

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    if (p.gravity) p.vy += p.gravity * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }

  for (let i = debris.length - 1; i >= 0; i--) {
    const d = debris[i];
    d.vy += 600 * dt;
    d.x += d.vx * dt;
    d.y += d.vy * dt;
    d.rot += d.vrot * dt;
    d.life -= dt;
    if (d.life <= 0) {
      debris.splice(i, 1);
    }
  }

  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    const ft = floatingTexts[i];
    ft.y += ft.vy * dt;
    ft.life -= dt;
    if (ft.life <= 0) {
      floatingTexts.splice(i, 1);
    }
  }
}

function draw() {
  const now = performance.now();
  const dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;

  if (gameState === 'PLAYING') {
    update(dt);
  }

  x.clearRect(0, 0, W, H);

  if (gameState === 'PLAYING') {
    const panX = -mx * 150 + camRecoilX;
    const panY = -my * 100 + camRecoilY;
    
    drawCanyonBackground(x, panX, panY);

    // Draw target rails (midground infrastructure)
    x.strokeStyle = 'rgba(191, 117, 64, 0.25)';
    x.lineWidth = 3;
    const midY = H * 0.45 + panY;
    x.beginPath();
    x.moveTo(0, midY);
    x.lineTo(W, midY);
    x.stroke();

    x.strokeStyle = 'rgba(7, 17, 29, 0.6)';
    x.lineWidth = 14;
    x.beginPath();
    x.moveTo(W * 0.12, H * 0.5 + panY);
    x.lineTo(W * 0.88, H * 0.5 + panY);
    x.stroke();

    x.strokeStyle = 'rgba(34, 217, 255, 0.4)';
    x.lineWidth = 2;
    x.beginPath();
    x.moveTo(W * 0.12, H * 0.5 + panY);
    x.lineTo(W * 0.88, H * 0.5 + panY);
    x.stroke();

    // 2. Draw Targets (sorted by depth)
    const sortedTargets = [...targets].sort((a, b) => a.z - b.z);
    sortedTargets.forEach(t => {
      if (t.status === 'BROKEN') return;

      const px = t.x * W + panX;
      const py = t.y * H + panY;
      const tScale = 0.5 + t.z * 0.7;

      const info = TARGET_TYPES[t.type];
      const targetW = info.w * tScale * 1.5;
      const targetH = info.h * tScale * 1.5;

      x.save();
      x.translate(px, py);
      
      // Target stand post
      x.fillStyle = 'rgba(7, 17, 29, 0.8)';
      x.fillRect(-6 * tScale, targetH * 0.3, 12 * tScale, H * 0.45);

      // Hit shake displacement
      const shakeOffsetX = (Math.random() - 0.5) * t.shake;
      const shakeOffsetY = (Math.random() - 0.5) * t.shake;
      x.translate(shakeOffsetX, shakeOffsetY);

      x.drawImage(
        assets.targetsSheet,
        info.x, info.y, info.w, info.h,
        -targetW / 2, -targetH / 2, targetW, targetH
      );

      // Draw damaged status overlays
      if (t.status === 'DAMAGED' || t.status === 'CRITICAL') {
        x.strokeStyle = 'rgba(255, 94, 94, 0.8)';
        x.lineWidth = 2 * tScale;
        x.beginPath();
        x.moveTo(-targetW * 0.25, -targetH * 0.25);
        x.lineTo(targetW * 0.2, targetH * 0.1);
        x.moveTo(targetW * 0.15, -targetH * 0.3);
        x.lineTo(-targetW * 0.2, targetH * 0.2);
        x.stroke();
      }

      if (t.status === 'CRITICAL') {
        x.strokeStyle = 'rgba(255, 94, 94, 0.5)';
        x.lineWidth = 4 * tScale;
        x.beginPath();
        x.arc(0, 0, targetW * 0.6, 0, Math.PI * 2);
        x.stroke();
      }

      x.restore();
    });

    // 3. Draw Projectiles
    projectiles.forEach(p => {
      const projX = p.x * W + panX;
      const projY = p.y * H + panY;
      const projScale = 0.1 + p.z * 1.2;
      
      const size = p.radius * 256 * projScale;

      if (p.trail.length > 1) {
        x.beginPath();
        x.strokeStyle = p.color;
        x.globalAlpha = 0.35;
        x.lineWidth = 3 * projScale;
        x.moveTo(p.trail[0].x * W + panX, p.trail[0].y * H + panY);
        for (let i = 1; i < p.trail.length; i++) {
          x.lineTo(p.trail[i].x * W + panX, p.trail[i].y * H + panY);
        }
        x.stroke();
        x.globalAlpha = 1.0;
      }

      x.save();
      x.translate(projX, projY);
      
      if (p.stickTarget) {
        if (p.vibrateTime > 0) {
          const vib = Math.sin(performance.now() * 0.08) * 0.15 * p.vibrateTime;
          x.rotate(vib);
        }
      } else {
        const spinSpeed = p.type === 'charged_disc' || p.type === 'vinyl_disc' ? 0.04 : 0.005;
        const angle = performance.now() * spinSpeed;
        x.rotate(angle);
      }

      let iconIndex = 0;
      if (p.type === 'note_round') iconIndex = 0;
      else if (p.type === 'charged_disc') iconIndex = 3;
      else if (p.type === 'harp_javelin') iconIndex = 5;
      else if (p.type === 'bass_sphere') iconIndex = 4;
      else if (p.type === 'vinyl_disc') iconIndex = 6;
      else if (p.type === 'synth_wave') iconIndex = 7;

      const srcW = 256;
      const srcH = 256;
      const col = iconIndex % 4;
      const row = Math.floor(iconIndex / 4);

      x.drawImage(
        assets.projectileIcons,
        col * srcW, row * srcH, srcW, srcH,
        -size / 2, -size / 2, size, size
      );

      x.restore();
    });

    // 4. Draw FP Hand Arms & Weapon Rig (Forefront HUD space)
    const bobX = Math.sin(bobTimer) * (isADS ? 2 : 12);
    const bobY = Math.cos(bobTimer * 2) * (isADS ? 1 : 8);

    const recoilZ = gunRecoilZ;
    const recoilRot = gunRecoilRot;

    const baseW = 256;
    const baseH = 256;
    const scale = (H * 0.0016) * 1.05;

    const targetAnchorX = W * 0.5 * adsProgress + W * 0.72 * (1.0 - adsProgress);
    const targetAnchorY = H * 0.5 * adsProgress + H * 0.88 * (1.0 - adsProgress);

    const handX = targetAnchorX + bobX + panX * 0.15;
    const handY = targetAnchorY + bobY + panY * 0.15 + recoilZ;

    // Draw non-muzzle flash particles before weapon
    particles.forEach(p => {
      if (p.isMuzzleFlash) return;
      x.save();
      x.fillStyle = p.color;
      x.globalAlpha = p.life / p.maxLife;
      x.fillRect(p.x - p.r/2, p.y - p.r/2, p.r, p.r);
      x.restore();
    });

    // Foreground firing lane console base panel
    x.save();
    x.fillStyle = 'rgba(7, 17, 29, 0.95)';
    x.strokeStyle = '#bf7540';
    x.lineWidth = 4;
    x.beginPath();
    x.moveTo(0, H * 0.85);
    x.lineTo(W * 0.25, H * 0.85);
    x.lineTo(W * 0.35, H * 0.95);
    x.lineTo(W * 0.65, H * 0.95);
    x.lineTo(W * 0.75, H * 0.85);
    x.lineTo(W, H * 0.85);
    x.lineTo(W, H);
    x.lineTo(0, H);
    x.closePath();
    x.fill();
    x.stroke();

    x.strokeStyle = '#22d9ff';
    x.lineWidth = 2;
    x.beginPath();
    x.moveTo(W * 0.35, H * 0.95);
    x.lineTo(W * 0.65, H * 0.95);
    x.stroke();
    x.restore();

    x.save();
    x.translate(handX, handY);
    x.rotate(recoilRot);

    if (isInspecting) {
      const inspectElapsed = performance.now() - inspectStartTime;
      const rot = Math.sin((inspectElapsed / 2200) * Math.PI * 2) * 0.45;
      x.rotate(rot);
      x.translate(-50 * rot, 30 * Math.abs(rot));
    }

    let animFrame = 0; // idle
    if (isReloading) animFrame = 4; // reload
    else if (isADS) animFrame = 2; // aim
    else if (isInspecting) animFrame = 7; // inspect
    else if (performance.now() - lastFireTime < 100) animFrame = 3; // fire

    const wW = baseW * scale;
    const wH = baseH * scale;

    // A. Draw a high-fidelity WOMP showcase built from the same hero art used in the arsenal.
    // This avoids low-resolution cutouts and keeps the in-game presentation aligned with the featured card art.
    x.restore();

    drawWeaponShowcase(x, performance.now(), panX, panY);

    x.save();
    x.translate(handX, handY);
    x.rotate(recoilRot);

    // C. Draw Muzzle Flash particles on top of gun/showcase
    particles.forEach(p => {
      if (!p.isMuzzleFlash) return;
      x.save();
      x.globalAlpha = p.life / p.maxLife;
      x.drawImage(
        assets.effectsSheet,
        p.cell * 102, 0, 102, 102,
        p.x - (102 * p.scale) / 2, p.y - (102 * p.scale) / 2, 102 * p.scale, 102 * p.scale
      );
      x.restore();
    });

    x.restore();

    // 9. Draw Debris and Floating Text on top of weapons
    debris.forEach(d => {
      if (d.life <= 0) return;
      x.save();
      x.translate(d.x, d.y);
      x.rotate(d.rot);
      x.globalAlpha = Math.max(0, d.life);
      
      x.drawImage(
        assets.targetsSheet,
        d.sheetX, d.sheetY, d.qw, d.qh,
        -d.qw * d.scale / 2, -d.qh * d.scale / 2, d.qw * d.scale, d.qh * d.scale
      );
      x.restore();
    });

    floatingTexts.forEach(ft => {
      if (ft.life <= 0) return;
      x.save();
      x.fillStyle = ft.color;
      x.font = 'bold 22px Rajdhani';
      x.textAlign = 'center';
      x.globalAlpha = ft.life / ft.maxLife;
      x.fillText(ft.text, ft.x, ft.y);
      x.restore();
    });

    // 10. Draw Crosshair
    if (!isADS) {
      const retX = (0.5 + mx) * W + panX;
      const retY = (0.5 + my) * H + panY;
      x.save();
      x.strokeStyle = '#22d9ff';
      x.lineWidth = 2.5;
      x.beginPath();
      x.arc(retX, retY, 9, 0, Math.PI * 2);
      x.moveTo(retX - 18, retY); x.lineTo(retX - 7, retY);
      x.moveTo(retX + 7, retY);  x.lineTo(retX + 18, retY);
      x.moveTo(retX, retY - 18); x.lineTo(retX, retY - 7);
      x.moveTo(retX, retY + 7);  x.lineTo(retX, retY + 18);
      x.stroke();
      x.restore();
    }
  }

  // Request next frame
  requestAnimationFrame(draw);
}

// Start Engine Init
loadConfig();
loadAssets();
draw();

// Expose gameDebug for automated testing
window.gameDebug = {
  getGameState: () => gameState,
  getCurrentWave: () => currentWave,
  getTargets: () => targets,
  getAmmo: () => ammoLeft,
  getScore: () => score,
  getShotsFired: () => shotsFired,
  getShotsHit: () => shotsHit,
  getCombo: () => combo,
  triggerFire: () => triggerFire(),
  triggerReload: () => triggerReload(),
  setupWeapon: (idx) => setupWeapon(idx),
  setAim: (x, y) => { mx = x; my = y; }
};

