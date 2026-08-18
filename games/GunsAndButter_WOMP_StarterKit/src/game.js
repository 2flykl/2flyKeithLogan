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
let currentWeaponIndex = 2; // Default: Tambourine Tempest
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
let primaryFireHeld = false;

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
  targetBullseye: new Image(), targetSpeaker: new Image(),
  targetCrate: new Image(), targetBarrel: new Image(), targetTerminal: new Image(),
  targetBullseyePlate: new Image(), targetWoodenStake: new Image(), targetHangingSteel: new Image(),
  targetTrainingDummy: new Image(), targetSpeakerStack: new Image(), targetStageBarrel: new Image(),
  targetVinylRack: new Image(), targetGlassPanel: new Image(), targetPaperTarget: new Image(), targetRopeTarget: new Image(),
  integratedStaffline: new Image(), integratedCDDoubleBarrel: new Image(), integratedTambourineTempest: new Image(),
  integratedHarpJavelin: new Image(), integratedHandCannon808: new Image(), integratedVinylLauncher: new Image(),
  integratedKeytarRifle: new Image(), integratedMicDrop: new Image(),
  liveRangeBackdrop: new Image(),
  effectsSheet: new Image(),
  cdDoubleBarrel: new Image(),
  keytarRifle: new Image(),
  vinylLauncher: new Image(),
  handCannon808: new Image(),
  harpJavelin: new Image(),
  firstPersonStates: new Image(),
  stafflineHero: new Image(), cdDoubleBarrelHero: new Image(),
  harpJavelinHero: new Image(), handCannon808Hero: new Image(), vinylLauncherHero: new Image(), keytarRifleHero: new Image(),
  stafflineFPS: new Image(), cdDoubleBarrelFPS: new Image(),
  harpJavelinFPS: new Image(), handCannon808FPS: new Image(), vinylLauncherFPS: new Image(), keytarRifleFPS: new Image()
};

const assetPaths = {
  bg: 'assets/boards/production_board_01.png',
  liveRangeBackdrop: 'assets/live_v2/range/range_backdrop.jpg?v=20260818b',
  armRig: 'assets/character/african_american_arm_rig_states.png',
  projectilesSheet: 'assets/projectiles/projectiles_sheet.png',
  projectileIcons: 'assets/projectiles/projectile_icons_clean.png',
  targetsSheet: 'assets/targets/targets_sheet.png',
  targetBullseye: 'assets/targets/clean/bullseye.png',
  targetSpeaker: 'assets/targets/clean/speaker.png',
  targetCrate: 'assets/targets/clean/crate.png',
  targetBarrel: 'assets/targets/clean/barrel.png',
  targetTerminal: 'assets/targets/clean/terminal.png',
  targetBullseyePlate: 'assets/live_v2/targets/bullseye_plate.png?v=20260818b',
  targetWoodenStake: 'assets/live_v2/targets/wooden_stake.png?v=20260818b',
  targetHangingSteel: 'assets/live_v2/targets/hanging_steel.png?v=20260818b',
  targetTrainingDummy: 'assets/integrated/targets/training_dummy.png',
  targetSpeakerStack: 'assets/integrated/targets/speaker_stack.png',
  targetStageBarrel: 'assets/integrated/targets/stage_barrel.png',
  targetVinylRack: 'assets/integrated/targets/vinyl_rack.png',
  targetGlassPanel: 'assets/integrated/targets/glass_panel.png',
  targetPaperTarget: 'assets/integrated/targets/paper_target.png',
  targetRopeTarget: 'assets/integrated/targets/rope_target.png',
  integratedStaffline: 'assets/live_v2/weapons/staffline.png?v=20260818b',
  integratedCDDoubleBarrel: 'assets/live_v2/weapons/cd_double_barrel.png?v=20260818b',
  integratedTambourineTempest: 'assets/live_v2/weapons/tambourine_tempest.png?v=20260818b',
  integratedHarpJavelin: 'assets/live_v2/weapons/harp_javelin.png?v=20260818b',
  integratedHandCannon808: 'assets/live_v2/weapons/hand_cannon_808.png?v=20260818b',
  integratedVinylLauncher: 'assets/live_v2/weapons/vinyl_launcher.png?v=20260818b',
  integratedKeytarRifle: 'assets/live_v2/weapons/keytar_rifle.png?v=20260818b',
  integratedMicDrop: 'assets/live_v2/weapons/mic_drop.png?v=20260818b',
  effectsSheet: 'assets/vfx/effects_sheet.png',
  cdDoubleBarrel: 'assets/weapons/cd_double_barrel_states.png',
  keytarRifle: 'assets/weapons/keytar_rifle_states.png',
  vinylLauncher: 'assets/weapons/vinyl_launcher.png',
  handCannon808: 'assets/weapons/hand_cannon_808.png',
  harpJavelin: 'assets/weapons/harp_javelin.png',
  firstPersonStates: 'assets/character/first_person_states.png',
  stafflineHero: 'assets/weapons/production/transparent/staffline_transparent.png',
  cdDoubleBarrelHero: 'assets/weapons/production/transparent/cd_double_barrel_transparent.png',
  harpJavelinHero: 'assets/weapons/production/transparent/harp_javelin_transparent.png',
  handCannon808Hero: 'assets/weapons/production/transparent/hand_cannon_808_transparent.png',
  vinylLauncherHero: 'assets/weapons/production/transparent/vinyl_launcher_transparent.png',
  keytarRifleHero: 'assets/weapons/production/transparent/keytar_rifle_transparent.png',
  stafflineFPS: 'assets/weapons/production/staffline_fps.jpg',
  cdDoubleBarrelFPS: 'assets/weapons/production/cd_double_barrel_fps.jpg',
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
        btnStart.textContent = "START EXPERIENCE";
        btnStart.disabled = false;
        console.log("All assets loaded successfully.");
      }
    };
    assets[key].onerror = (err) => {
      console.error(`Error loading asset: ${key} at ${assetPaths[key]}`, err);
      assetsLoaded++;
      if (assetsLoaded === totalAssets) {
        btnStart.textContent = "START EXPERIENCE";
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
      {
            "id": "staffline",
            "name": "Staffline Sidearm",
            "cls": "precision",
            "fire": "semi",
            "projectile": "note_round",
            "recoil": [
                  0.55,
                  0.18
            ],
            "spread": 0.45,
            "velocity": 120,
            "gravity": 0.15,
            "ricochet": 0.08,
            "cooldown": 0.16,
            "maxAmmo": 8,
            "heroArt": "assets/live_v2/weapons/staffline.png?v=20260818b",
            "tagline": "PRECISION ON THE STAFF"
      },
      {
            "id": "cd_double_barrel",
            "name": "CD Double Barrel",
            "cls": "heavy hybrid",
            "fire": "dual",
            "projectile": "charged_disc",
            "recoil": [
                  1.9,
                  0.7
            ],
            "spread": 2.4,
            "velocity": 72,
            "gravity": 0.22,
            "ricochet": 0.72,
            "cooldown": 0.72,
            "maxAmmo": 2,
            "heroArt": "assets/live_v2/weapons/cd_double_barrel.png?v=20260818b",
            "tagline": "TWIN DISCS \u2022 MAX IMPACT"
      },
      {
            "id": "tambourine_tempest",
            "name": "Tambourine Tempest",
            "cls": "rhythm auto",
            "fire": "auto",
            "projectile": "note_round",
            "recoil": [
                  0.72,
                  0.24
            ],
            "spread": 0.75,
            "velocity": 145,
            "gravity": 0.12,
            "ricochet": 0.12,
            "cooldown": 0.095,
            "maxAmmo": 32,
            "heroArt": "assets/live_v2/weapons/tambourine_tempest.png?v=20260818b",
            "tagline": "RHYTHM \u2022 SPEED \u2022 IMPACT"
      },
      {
            "id": "harp_javelin",
            "name": "Harp Javelin",
            "cls": "energy hybrid",
            "fire": "charge",
            "projectile": "harp_javelin",
            "recoil": [
                  0.35,
                  0.08
            ],
            "spread": 0.05,
            "velocity": 55,
            "gravity": 7.2,
            "ricochet": 0.0,
            "cooldown": 0.7,
            "maxAmmo": 1,
            "heroArt": "assets/live_v2/weapons/harp_javelin.png?v=20260818b",
            "tagline": "CHARGE \u2022 THWANG \u2022 STICK"
      },
      {
            "id": "hand_cannon_808",
            "name": "808 Hand Cannon",
            "cls": "sonic",
            "fire": "semi",
            "projectile": "bass_sphere",
            "recoil": [
                  1.35,
                  0.34
            ],
            "spread": 0.2,
            "velocity": 38,
            "gravity": 0,
            "ricochet": 0,
            "cooldown": 0.48,
            "maxAmmo": 5,
            "heroArt": "assets/live_v2/weapons/hand_cannon_808.png?v=20260818b",
            "tagline": "TURN UP THE PRESSURE"
      },
      {
            "id": "vinyl_launcher",
            "name": "Vinyl Launcher",
            "cls": "ricochet",
            "fire": "semi",
            "projectile": "vinyl_disc",
            "recoil": [
                  0.9,
                  0.4
            ],
            "spread": 0.25,
            "velocity": 82,
            "gravity": 0.4,
            "ricochet": 0.82,
            "cooldown": 0.3,
            "maxAmmo": 6,
            "heroArt": "assets/live_v2/weapons/vinyl_launcher.png?v=20260818b",
            "tagline": "SPIN \u2022 BOUNCE \u2022 REPEAT"
      },
      {
            "id": "keytar_rifle",
            "name": "Keytar Rifle",
            "cls": "harmonic energy",
            "fire": "burst",
            "projectile": "synth_wave",
            "recoil": [
                  0.45,
                  0.16
            ],
            "spread": 0.55,
            "velocity": 160,
            "gravity": 0,
            "ricochet": 0,
            "cooldown": 0.13,
            "maxAmmo": 15,
            "heroArt": "assets/live_v2/weapons/keytar_rifle.png?v=20260818b",
            "tagline": "PLAY THE CHORD \u2022 BREAK THE LINE"
      },
      {
            "id": "mic_drop",
            "name": "Mic Drop",
            "cls": "sonic throw",
            "fire": "semi",
            "projectile": "bass_sphere",
            "recoil": [
                  0.9,
                  0.28
            ],
            "spread": 0.18,
            "velocity": 48,
            "gravity": 2.1,
            "ricochet": 0,
            "cooldown": 0.85,
            "maxAmmo": 3,
            "heroArt": "assets/live_v2/weapons/mic_drop.png?v=20260818b",
            "tagline": "DROP THE BEAT \u2022 DROP THE MIC"
      }
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
  maxAmmo = activeWeapon.maxAmmo || 8;
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

function ensureAudioLive(restart = false) {
  if (!window.AudioManager) return;
  try {
    if (typeof window.AudioManager.startMusicFromGesture === 'function') {
      window.AudioManager.startMusicFromGesture(restart);
    } else {
      window.AudioManager._unlockAudio();
      window.AudioManager._playMusic();
    }
  } catch (err) {
    console.warn('Audio unlock failed', err);
  }
}

const WEAPON_SHOWCASE_THEME = {
  staffline: { accent: '#ffd55d', accent2: '#22d9ff' },
  cd_double_barrel: { accent: '#ff9a3c', accent2: '#ff47d1' },
  tambourine_tempest: { accent: '#22d9ff', accent2: '#ffd55d' },
  mic_drop: { accent: '#ff3838', accent2: '#ff7a44' },
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

  if (e.key >= '1' && e.key <= '8') {
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
    primaryFireHeld = true;
    triggerFire();
  }
});

document.addEventListener('mouseup', e => {
  if (e.button === 0) primaryFireHeld = false;
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
    color: activeWeapon.id === 'keytar_rifle' ? '#ff2a85' : activeWeapon.id === 'cd_double_barrel' ? '#00e5ff' : activeWeapon.id === 'tambourine_tempest' ? '#22d9ff' : activeWeapon.id === 'mic_drop' ? '#ff3838' : '#ffd55d',
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
const RANGE_DUST = Array.from({ length: 95 }, (_, i) => ({
  x: ((i * 73) % 997) / 997,
  y: ((i * 131) % 881) / 881,
  r: 0.5 + ((i * 17) % 11) / 6,
  layer: 0.2 + ((i * 19) % 80) / 100,
  warm: i % 3 !== 0
}));

function drawCanyonBackground(ctx, panX, panY) {
  const horizon = H * 0.48 + panY * 0.14;

  // Premium dusk sky: deep navy -> violet smoke -> gold desert horizon.
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, '#030813');
  sky.addColorStop(0.34, '#0d1730');
  sky.addColorStop(0.58, '#25203a');
  sky.addColorStop(0.74, '#8e4c35');
  sky.addColorStop(0.88, '#df9c52');
  sky.addColorStop(1, '#170b0a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Layered atmospheric glow; tracks aim subtly for parallax depth.
  const sunX = W * 0.52 + panX * 0.10;
  const sunY = horizon - H * 0.045;
  const glow = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, Math.max(W,H) * 0.30);
  glow.addColorStop(0, 'rgba(255,226,131,.52)');
  glow.addColorStop(.18, 'rgba(255,178,78,.22)');
  glow.addColorStop(.55, 'rgba(166,71,69,.08)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0,0,W,H);

  // Distant production skyline / rock silhouettes.
  const drawMesaLayer = (baseY, amp, step, color, parallax, edgeColor) => {
    ctx.save();
    ctx.translate(panX * parallax, panY * parallax);
    ctx.beginPath();
    ctx.moveTo(-W * .1, H);
    ctx.lineTo(-W * .1, baseY);
    for (let i=0;i<=step;i++) {
      const xx = (i/step) * W * 1.2 - W*.1;
      const yy = baseY - (i%3===0 ? amp*.62 : i%2===0 ? amp*.18 : amp*.42) - Math.sin(i*1.73)*amp*.22;
      ctx.lineTo(xx, yy);
    }
    ctx.lineTo(W*1.1,H); ctx.closePath();
    ctx.fillStyle=color; ctx.fill();
    ctx.strokeStyle=edgeColor; ctx.lineWidth=1.2; ctx.globalAlpha=.65; ctx.stroke();
    ctx.restore();
  };
  drawMesaLayer(H*.62, H*.18, 14, '#1a1420', .12, 'rgba(255,148,66,.18)');
  drawMesaLayer(H*.70, H*.20, 10, '#150c10', .28, 'rgba(255,91,67,.20)');
  drawMesaLayer(H*.78, H*.16, 8, '#0b070b', .52, 'rgba(34,217,255,.12)');

  // Range floor: perspective lanes and illuminated production rails.
  const floorTop = H * .58 + panY * .28;
  const floor = ctx.createLinearGradient(0,floorTop,0,H);
  floor.addColorStop(0,'rgba(18,13,22,.18)');
  floor.addColorStop(.15,'rgba(8,9,15,.70)');
  floor.addColorStop(1,'#05070b');
  ctx.fillStyle=floor; ctx.fillRect(0,floorTop,W,H-floorTop);

  ctx.save();
  ctx.globalAlpha=.22;
  for(let i=-5;i<=5;i++){
    const topX=W*.5+i*W*.055+panX*.08;
    const bottomX=W*.5+i*W*.18+panX*.32;
    ctx.strokeStyle=i%2?'#22d9ff':'#ffd55d'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(topX,floorTop); ctx.lineTo(bottomX,H); ctx.stroke();
  }
  for(let j=0;j<7;j++){
    const t=j/7; const yy=floorTop+(H-floorTop)*(t*t);
    ctx.strokeStyle='rgba(255,213,93,.18)';
    ctx.beginPath(); ctx.moveTo(0,yy); ctx.lineTo(W,yy); ctx.stroke();
  }
  ctx.restore();

  // LIVE V2 cinematic environment overlay from the new transparent environment art.
  if (assets.liveRangeBackdrop && assets.liveRangeBackdrop.complete && assets.liveRangeBackdrop.naturalWidth) {
    ctx.save();
    ctx.globalAlpha = 0.34;
    ctx.globalCompositeOperation = 'screen';
    const iw = assets.liveRangeBackdrop.naturalWidth, ih = assets.liveRangeBackdrop.naturalHeight;
    const scale = Math.max(W / iw, (H * .62) / ih);
    const dw = iw * scale, dh = ih * scale;
    ctx.drawImage(assets.liveRangeBackdrop, (W-dw)/2 + panX*.08, H*.02 + panY*.05, dw, dh);
    ctx.restore();
  }

  // Side production towers inspired by the production boards.
  const drawTower = (tx, ty, scale, phase) => {
    ctx.save(); ctx.translate(tx + panX*.5, ty + panY*.4);
    const towerGrad=ctx.createLinearGradient(0,-180*scale,0,40*scale);
    towerGrad.addColorStop(0,'#18263b'); towerGrad.addColorStop(1,'#06090f');
    ctx.fillStyle=towerGrad; ctx.fillRect(-13*scale,-150*scale,26*scale,170*scale);
    ctx.strokeStyle='rgba(34,217,255,.45)';ctx.lineWidth=2;ctx.strokeRect(-13*scale,-150*scale,26*scale,170*scale);
    for(let k=0;k<2;k++){
      const yy=(-122+k*65)*scale; const rr=(26-k*4)*scale;
      const sp=ctx.createRadialGradient(0,yy,3,0,yy,rr);
      sp.addColorStop(0,'rgba(255,213,93,.92)'); sp.addColorStop(.25,'rgba(191,117,64,.55)'); sp.addColorStop(1,'rgba(0,0,0,.95)');
      ctx.fillStyle=sp;ctx.beginPath();ctx.arc(0,yy,rr,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='rgba(255,213,93,.35)';ctx.stroke();
    }
    const beam=ctx.createLinearGradient(0,-160*scale,150*scale,-260*scale);
    beam.addColorStop(0,'rgba(34,217,255,.12)');beam.addColorStop(1,'rgba(34,217,255,0)');
    ctx.fillStyle=beam;ctx.beginPath();ctx.moveTo(0,-155*scale);ctx.lineTo((80+Math.sin(performance.now()*.0006+phase)*45)*scale,-300*scale);ctx.lineTo((150+Math.sin(performance.now()*.0006+phase)*45)*scale,-300*scale);ctx.closePath();ctx.fill();
    ctx.restore();
  };
  drawTower(W*.105,H*.76,1.0,0);
  drawTower(W*.895,H*.76,1.0,2.3);

  // Stable atmospheric particles, layered by depth rather than frame-random flicker.
  ctx.save();
  for(const p of RANGE_DUST){
    const xx=(p.x*W + panX*p.layer + performance.now()*.004*p.layer)%(W+30)-15;
    const yy=p.y*H*.78 + panY*p.layer*.35;
    ctx.fillStyle=p.warm?'rgba(255,199,90,.38)':'rgba(82,203,255,.28)';
    ctx.beginPath();ctx.arc(xx,yy,p.r,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();

  // Thin horizon energy line visually ties the firing lane together.
  ctx.strokeStyle='rgba(255,154,74,.34)';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(0,horizon);ctx.lineTo(W,horizon);ctx.stroke();
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
  bullseye_plate: { w: 100, h: 132, imageKey: 'targetBullseyePlate', points: 150, maxHp: 2, sfx: 'metal' },
  wooden_stake: { w: 100, h: 145, imageKey: 'targetWoodenStake', points: 225, maxHp: 3, sfx: 'wood' },
  hanging_steel: { w: 105, h: 145, imageKey: 'targetHangingSteel', points: 300, maxHp: 5, sfx: 'metal' },
  training_dummy: { w: 110, h: 155, imageKey: 'targetTrainingDummy', points: 500, maxHp: 8, sfx: 'armor' },
  speaker_stack: { w: 110, h: 150, imageKey: 'targetSpeakerStack', points: 325, maxHp: 5, sfx: 'armor' },
  stage_barrel: { w: 92, h: 135, imageKey: 'targetStageBarrel', points: 450, maxHp: 4, sfx: 'metal' },
  vinyl_rack: { w: 115, h: 130, imageKey: 'targetVinylRack', points: 275, maxHp: 4, sfx: 'wood' },
  glass_panel: { w: 105, h: 135, imageKey: 'targetGlassPanel', points: 220, maxHp: 2, sfx: 'glass' },
  paper_target: { w: 92, h: 125, imageKey: 'targetPaperTarget', points: 125, maxHp: 1, sfx: 'paper' },
  rope_target: { w: 100, h: 140, imageKey: 'targetRopeTarget', points: 250, maxHp: 2, sfx: 'wood' }
};

function setupWave(waveNum) {
  currentWave = waveNum;
  targets.length = 0;
  waveActive = true;
  $('wave-indicator').textContent = `WAVE ${currentWave} / ${totalWaves}`;
  const banner = $('wave-banner');
  banner.textContent = `WAVE ${currentWave}`;
  banner.style.opacity = 1;
  setTimeout(() => { banner.style.opacity = 0; }, 1500);

  const waves = {
    1: [
      ['bullseye_plate',.18,.34,.80,0], ['paper_target',.34,.43,.58,.035],
      ['wooden_stake',.50,.34,.92,0], ['rope_target',.66,.43,.58,-.035],
      ['hanging_steel',.82,.35,.80,0], ['glass_panel',.50,.50,.43,.05]
    ],
    2: [
      ['speaker_stack',.17,.39,.72,.055], ['vinyl_rack',.34,.47,.52,.07],
      ['training_dummy',.50,.37,.88,0], ['stage_barrel',.66,.47,.52,-.07],
      ['hanging_steel',.83,.39,.72,-.055], ['wooden_stake',.50,.53,.38,.09]
    ],
    3: [
      ['training_dummy',.20,.38,.77,.035], ['speaker_stack',.36,.43,.63,-.05],
      ['stage_barrel',.50,.49,.46,.10], ['vinyl_rack',.64,.43,.63,.05],
      ['training_dummy',.80,.38,.77,-.035], ['glass_panel',.30,.54,.38,.07],
      ['hanging_steel',.70,.54,.38,-.07]
    ]
  };
  (waves[waveNum] || waves[1]).forEach(([type,x,y,z,speed]) => spawnTarget(type,x,y,z,speed));
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
  const cx = target.x * W;
  const cy = target.y * H;
  const material = target.sfx || 'metal';
  const palette = material === 'wood' ? ['#8b5a2b','#c58a4a','#e3b16f'] : material === 'paper' ? ['#d8c8a3','#f0e0bd','#a9895f'] : material === 'glass' ? ['#b8f1ff','#7fd8ef','#e8fbff'] : ['#7f8790','#c8d0d8','#d39b58'];
  const count = target.type === 'training_dummy' ? 18 : target.type === 'stage_barrel' ? 16 : 12;
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const speed = 90 + Math.random() * 280;
    debris.push({
      custom: true,
      x: cx + (Math.random()-.5)*28,
      y: cy + (Math.random()-.5)*28,
      vx: Math.cos(a)*speed,
      vy: Math.sin(a)*speed - 130,
      rot: Math.random()*Math.PI*2,
      vrot: (Math.random()-.5)*12,
      w: 5 + Math.random()*14,
      h: 3 + Math.random()*10,
      color: palette[(Math.random()*palette.length)|0],
      life: 1.2 + Math.random()*.9,
      maxLife: 2.1
    });
  }
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
        <img class="womp-hero-art" src="${w.heroArt || `assets/weapons/production/${w.id}_hero.jpg`}" alt="${w.name}">
      </div>
      <div class="womp-name">${w.name}</div>
      <div class="womp-class">${w.cls}</div>
      <div class="womp-tagline">${w.tagline || "WEAPON OF MASS PRODUCTION"}</div>
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
  ensureAudioLive(true);
  setupSliders();
  gameState = 'ARSENAL';
  $('screen-start').classList.add('hidden');
  $('screen-arsenal').classList.remove('hidden');
  renderArsenalUI();
});

$('btn-enter-range').addEventListener('click', () => {
  ensureAudioLive(false);
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
    staffline: assets.integratedStaffline,
    cd_double_barrel: assets.integratedCDDoubleBarrel,
    tambourine_tempest: assets.integratedTambourineTempest,
    harp_javelin: assets.integratedHarpJavelin,
    hand_cannon_808: assets.integratedHandCannon808,
    vinyl_launcher: assets.integratedVinylLauncher,
    keytar_rifle: assets.integratedKeytarRifle,
    mic_drop: assets.integratedMicDrop
  };
  const hero = heroArtMap[activeWeapon.id] || assets.integratedStaffline;
  if (!hero || !hero.complete || !hero.naturalWidth) return;

  const theme = getWeaponTheme(activeWeapon.id);
  const firePulse = now - lastFireTime < 130 ? 1 : 0;
  const motionX = Math.sin(now * .0017) * 5 + mx * 16 + panX * .035;
  const motionY = Math.cos(now * .0012) * 4 + my * 10 + gunRecoilZ * .10 + panY * .025;

  // Transparent weapon art sits directly in the world — no rectangular hero card.
  const maxW = Math.min(W * .39, 560);
  const maxH = Math.min(H * .31, 330);
  let artW = maxW * (1 + firePulse*.035);
  let artH = artW * (hero.naturalHeight / hero.naturalWidth);
  if (artH > maxH) { artH = maxH; artW = artH * (hero.naturalWidth / hero.naturalHeight); }
  const artX = W - artW - 26 + motionX;
  const artY = H - artH - 28 + motionY;

  // Soft, irregular aura reinforces silhouette while keeping the background fully visible.
  ctx.save();
  ctx.globalCompositeOperation='screen';
  const aura=ctx.createRadialGradient(artX+artW*.55,artY+artH*.55,12,artX+artW*.55,artY+artH*.55,artW*.58);
  aura.addColorStop(0,`${theme.accent}24`);
  aura.addColorStop(.45,`${theme.accent2}13`);
  aura.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=aura;ctx.beginPath();ctx.ellipse(artX+artW*.56,artY+artH*.58,artW*.58,artH*.68,0,0,Math.PI*2);ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 1; // persistent live weapon layer: never hide on fire/recoil
  ctx.imageSmoothingEnabled=true;
  if ('imageSmoothingQuality' in ctx) ctx.imageSmoothingQuality='high';
  ctx.filter=`drop-shadow(0 10px 20px rgba(0,0,0,.72)) drop-shadow(0 0 ${12+firePulse*11}px ${theme.accent2})`;
  ctx.drawImage(hero,artX,artY,artW,artH);
  ctx.restore();

  drawWeaponAura(ctx, now, artX, artY, artW, artH, theme);

  // Small diegetic weapon tag, deliberately not a box around the artwork.
  ctx.save();
  ctx.textAlign='right';
  ctx.font='700 12px Rajdhani';ctx.fillStyle='rgba(255,255,255,.58)';
  ctx.fillText((activeWeapon.cls||'WOMP').toUpperCase(),W-30,H-20);
  ctx.font='700 15px Rajdhani';ctx.fillStyle=theme.accent;
  ctx.fillText(activeWeapon.name.toUpperCase(),W-30,H-38);
  ctx.restore();
}

function drawWeaponAura(ctx, now, x0, y0, w, h, theme) {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const t = now * 0.001;
  if (activeWeapon.id === 'tambourine_tempest') {
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
  } else if (activeWeapon.id === 'mic_drop') {
    for (let i = 0; i < 4; i++) {
      const r = 22 + i * 15 + Math.sin(t * 7 + i) * 4;
      ctx.strokeStyle = i % 2 ? theme.accent2 : theme.accent;
      ctx.lineWidth = 3 - i * .45;
      ctx.globalAlpha = .62 - i * .1;
      ctx.beginPath(); ctx.arc(x0 + w * .68, y0 + h * .55, r, 0, Math.PI * 2); ctx.stroke();
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
  if (gameState === 'PLAYING' && primaryFireHeld && activeWeapon && activeWeapon.fire === 'auto') triggerFire();

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
      const targetW = (info.w || 92) * (0.72 + t.z * 0.45);
      const targetH = (info.h || info.w || 110) * (0.72 + t.z * 0.45);

      x.save();
      x.translate(px, py);

      // Minimal carriage only for freestanding targets. Hanging/prop sprites already contain their supports.
      const drawGenericStand = ['bullseye_plate','paper_target','glass_panel'].includes(t.type);
      if (drawGenericStand) {
      const postGrad = x.createLinearGradient(-8, 0, 8, 0);
      postGrad.addColorStop(0,'rgba(5,8,14,.92)');
      postGrad.addColorStop(.5,'rgba(35,57,77,.92)');
      postGrad.addColorStop(1,'rgba(3,6,11,.95)');
      x.fillStyle=postGrad;
      x.fillRect(-5*tScale,targetH*.30,10*tScale,H*.40);
      x.strokeStyle='rgba(34,217,255,.32)';x.lineWidth=1.4*tScale;
      x.beginPath();x.moveTo(0,targetH*.30);x.lineTo(0,H*.40);x.stroke();

      const baseGlow=x.createRadialGradient(0,targetH*.66,1,0,targetH*.66,targetW*.52);
      baseGlow.addColorStop(0,'rgba(255,213,93,.30)');baseGlow.addColorStop(1,'rgba(0,0,0,0)');
      x.fillStyle=baseGlow;x.beginPath();x.ellipse(0,targetH*.67,targetW*.52,targetH*.14,0,0,Math.PI*2);x.fill();
      }

      const pulse=1+Math.sin(performance.now()*.003+t.x*9)*.05;
      x.strokeStyle=t.status==='CRITICAL'?'rgba(255,94,94,.7)':'rgba(34,217,255,.20)';
      x.lineWidth=1.5*tScale;
      x.beginPath();x.arc(0,0,targetW*.58*pulse,0,Math.PI*2);x.stroke();

      // Hit shake displacement
      const shakeOffsetX = (Math.random() - 0.5) * t.shake;
      const shakeOffsetY = (Math.random() - 0.5) * t.shake;
      x.translate(shakeOffsetX, shakeOffsetY);

      const targetImage = assets[info.imageKey] || assets.targetsSheet;
      x.save();
      x.filter = `drop-shadow(0 8px 8px rgba(0,0,0,.6)) drop-shadow(0 0 ${5+4*t.z}px rgba(34,217,255,.34))`;
      if (targetImage === assets.targetsSheet) {
        x.drawImage(assets.targetsSheet, info.x, info.y, info.w, info.h, -targetW/2,-targetH/2,targetW,targetH);
      } else {
        x.drawImage(targetImage,-targetW/2,-targetH/2,targetW,targetH);
      }
      x.restore();

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

    // Authoritative WOMP is rendered by the persistent DOM weapon layer.
    // This prevents old sprite-sheet/fire-frame fallbacks from blanking the weapon.
    if (window.GBWeaponLayer && window.GBWeaponLayer.sync) window.GBWeaponLayer.sync();

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
      
      if (d.custom) {
        x.fillStyle = d.color || '#b7b7b7';
        x.fillRect(-(d.w||8)/2, -(d.h||5)/2, d.w||8, d.h||5);
      } else {
        x.drawImage(
          assets.targetsSheet,
          d.sheetX, d.sheetY, d.qw, d.qh,
          -d.qw * d.scale / 2, -d.qh * d.scale / 2, d.qw * d.scale, d.qh * d.scale
        );
      }
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

