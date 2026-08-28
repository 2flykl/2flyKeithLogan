// V23.6 Vinyl Galaxy Residency Pass
// Adds a slow transparent-record interior language, shared macro-orbit motion,
// calmer interior color density, wider residency breathing room, and soft
// entry/exit threshold choreography without changing click/thrust rules.
import * as THREE from 'three';
import { GALAXY_THEMES } from './types.js';
import { GalaxyScene } from './scene/galaxy.js';
import { EraOrbitSystem } from './scene/era-orbit-system.js';
import { ThruTheFireSystem } from './scene/thru-the-fire-system.js';
import { AfricaSystem } from './scene/africa-system.js';
import { StreamsSystem } from './scene/streams-system.js';
import { FrontierSystems } from './scene/frontier-systems.js';

const RECORD_SPEED = 0.034;
const BREATHING_MULTIPLIER = 1.45;
const galaxyAngles = new Map();
let activeGalaxyId = null;
let transitionSequence = 0;

function getAngle(id) { return galaxyAngles.get(id) || 0; }
function setAngle(id, value) { galaxyAngles.set(id, value % (Math.PI * 2)); }

function setMaterialOpacity(root, factor) {
  if (!root) return;
  root.traverse?.(node => {
    const mats = Array.isArray(node.material) ? node.material : (node.material ? [node.material] : []);
    for (const mat of mats) {
      if (mat?.isShaderMaterial) continue;
      if (mat.__vinylBaseOpacity == null) mat.__vinylBaseOpacity = mat.opacity == null ? 1 : mat.opacity;
      mat.transparent = true;
      mat.opacity = mat.__vinylBaseOpacity * factor;
    }
  });
}

function createThresholdTransition(detail) {
  if (!document.body || !detail?.galaxyId) return;
  const theme = GALAXY_THEMES[detail.galaxyId];
  if (!theme) return;
  const seq = ++transitionSequence;
  const color = new THREE.Color(theme.accentColor);
  const rgb = `${Math.round(color.r * 255)},${Math.round(color.g * 255)},${Math.round(color.b * 255)}`;
  const entering = detail.state === 'enter';
  const veil = document.createElement('div');
  veil.className = 'galaxy-crossing-veil';
  veil.dataset.seq = String(seq);
  veil.style.cssText = `position:fixed;inset:-12%;pointer-events:none;z-index:72;opacity:0;mix-blend-mode:screen;` +
    `background:radial-gradient(ellipse at center,transparent 0 38%,rgba(${rgb},.045) 54%,rgba(${rgb},.12) 72%,transparent 90%),` +
    `repeating-conic-gradient(from ${entering ? '0deg' : '180deg'},rgba(255,255,255,.035) 0 .35deg,transparent .35deg 7deg);` +
    `filter:blur(.35px);transform:scale(${entering ? '1.08' : '.94'});`;
  document.body.appendChild(veil);
  veil.animate([
    { opacity: 0, transform: `scale(${entering ? 1.08 : .94})` },
    { opacity: .58, offset: .34, transform: 'scale(1)' },
    { opacity: .20, offset: .72, transform: `scale(${entering ? .965 : 1.045})` },
    { opacity: 0, transform: `scale(${entering ? .94 : 1.08})` },
  ], { duration: entering ? 1080 : 940, easing: 'cubic-bezier(.22,.7,.2,1)' });
  setTimeout(() => veil.remove(), entering ? 1120 : 980);
}

window.addEventListener('universe-galaxy-threshold', event => {
  const detail = event?.detail || {};
  if (detail.state === 'enter') activeGalaxyId = detail.galaxyId;
  if (detail.state === 'exit' && activeGalaxyId === detail.galaxyId) activeGalaxyId = null;
  createThresholdTransition(detail);
});

GalaxyScene.prototype.buildAbstractWhiteLines = function buildVinylRecord(theme) {
  const recordRadius = this.atmosphereRadius * 0.86;
  this.__vinylRecordRadius = recordRadius;
  const record = new THREE.Group();
  record.name = `vinyl-record-${this.data?.id || 'galaxy'}`;

  const disc = new THREE.Mesh(
    new THREE.RingGeometry(recordRadius * 0.12, recordRadius, 144),
    new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.010,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  disc.rotation.x = -Math.PI / 2;
  record.add(disc);

  const grooveCount = theme.status === 'showcase' ? 24 : 18;
  for (let i = 0; i < grooveCount; i++) {
    const t = i / Math.max(1, grooveCount - 1);
    const radius = recordRadius * (0.16 + t * 0.80);
    const pts = new THREE.EllipseCurve(0, 0, radius, radius * (0.985 + 0.012 * Math.sin(i * 1.7)), 0, Math.PI * 2)
      .getPoints(220).map(v => new THREE.Vector3(v.x, 0, v.y));
    const mat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: (i % 5 === 0 ? 0.105 : 0.050) * (theme.status === 'showcase' ? 1 : .82),
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const line = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), mat);
    record.add(line);
    this.abstractLines.push({ line, phase: i * 0.37, baseOpacity: mat.opacity, vinyl: true });
  }

  for (let i = 0; i < 9; i++) {
    const radius = recordRadius * (0.27 + i * 0.068);
    const start = i * 0.74;
    const span = 0.48 + (i % 3) * 0.23;
    const pts = new THREE.EllipseCurve(0, 0, radius, radius * 0.98, start, start + span)
      .getPoints(46).map(v => new THREE.Vector3(v.x + (i % 2 ? 34 : -28), (i % 3 - 1) * 18, v.y));
    const mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12, depthWrite: false, blending: THREE.AdditiveBlending });
    const arc = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat);
    record.add(arc);
    this.abstractLines.push({ line: arc, phase: 1.4 + i * .61, baseOpacity: mat.opacity, vinyl: true });
  }

  for (const [r, op] of [[recordRadius * .075, .15], [recordRadius * .105, .085]]) {
    const pts = new THREE.EllipseCurve(0, 0, r, r, 0, Math.PI * 2).getPoints(96).map(v => new THREE.Vector3(v.x, 0, v.y));
    const mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: op, depthWrite: false, blending: THREE.AdditiveBlending });
    const line = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(pts), mat);
    record.add(line);
    this.abstractLines.push({ line, phase: r * .001, baseOpacity: op, vinyl: true });
  }

  record.rotation.x = 0.035;
  record.rotation.z = -0.018;
  this.group.add(record);
  this.__vinylRecord = record;
};

const originalAtmosphere = GalaxyScene.prototype.buildAtmosphericVeil;
GalaxyScene.prototype.buildAtmosphericVeil = function buildWideAtmosphere(theme) {
  this.__contentRadius = this.atmosphereRadius;
  this.atmosphereRadius *= BREATHING_MULTIPLIER;
  originalAtmosphere.call(this, theme);
};

const originalGalaxyUpdate = GalaxyScene.prototype.update;
GalaxyScene.prototype.update = function vinylGalaxyUpdate(time, cameraWorldPos) {
  originalGalaxyUpdate.call(this, time, cameraWorldPos);
  const id = this.getId?.() || this.data?.id;
  const angle = (time * RECORD_SPEED) % (Math.PI * 2);
  setAngle(id, angle);
  if (this.__vinylRecord) this.__vinylRecord.rotation.y = angle;

  const inside = !!this.thresholdState;
  if (inside) {
    for (const mat of this.gasMaterials || []) {
      if (mat?.uniforms?.globalAlpha) mat.uniforms.globalAlpha.value *= 0.52;
    }
    if (this.atmosphereMaterial) this.atmosphereMaterial.opacity *= 0.72;
    if (this.coreMaterial?.uniforms?.globalAlpha) this.coreMaterial.uniforms.globalAlpha.value *= 0.78;
  }

  if (this.abstractLines) {
    for (const entry of this.abstractLines) {
      if (!entry.vinyl || !entry.line?.material) continue;
      const pulse = 0.88 + 0.12 * Math.sin(time * .16 + (entry.phase || 0));
      entry.line.material.opacity = entry.baseOpacity * (inside ? 1.12 : .76) * pulse;
    }
  }
};

function orbitPositionWithRecord(system, galaxyId, heightOffset) {
  if (!system?.group) return;
  const theme = GALAXY_THEMES[galaxyId];
  if (!theme) return;
  if (!system.__vinylBase) {
    const center = new THREE.Vector3(...theme.worldOffset);
    const local = system.objectData?.position
      ? new THREE.Vector3(system.objectData.position.x, system.objectData.position.y, system.objectData.position.z)
      : system.group.position.clone().sub(center);
    system.__vinylBase = local;
    system.__vinylCenter = center;
  }
  const a = getAngle(galaxyId);
  const base = system.__vinylBase;
  const x = base.x * Math.cos(a) - base.z * Math.sin(a);
  const z = base.x * Math.sin(a) + base.z * Math.cos(a);
  system.group.position.set(system.__vinylCenter.x + x, system.__vinylCenter.y + base.y + heightOffset, system.__vinylCenter.z + z);
}

function patchShowcaseSystem(Cls, heightOffset) {
  if (!Cls?.prototype?.update) return;
  const previous = Cls.prototype.update;
  Cls.prototype.update = function vinylShowcaseUpdate(...args) {
    const result = previous.apply(this, args);
    this.group.visible = true;
    const active = activeGalaxyId === 'G2025';
    setMaterialOpacity(this.group, active ? 1 : 0.22);
    orbitPositionWithRecord(this, 'G2025', heightOffset);
    return result;
  };
}

patchShowcaseSystem(ThruTheFireSystem, 520);
patchShowcaseSystem(AfricaSystem, -360);
patchShowcaseSystem(StreamsSystem, 220);

const previousFrontierUpdate = FrontierSystems.prototype.update;
FrontierSystems.prototype.update = function vinylFrontierUpdate(...args) {
  const result = previousFrontierUpdate.apply(this, args);
  this.group.visible = true;
  if (!this.__vinylDepthConfigured) {
    const offsets = [-420, 340, -220, 510, 120, -520];
    (this.planetMeshes || []).forEach((mesh, i) => { mesh.position.y += offsets[i % offsets.length]; });
    const uniqueParents = [];
    for (const c of this.children || []) if (c.parentPos && !uniqueParents.includes(c.parentPos)) uniqueParents.push(c.parentPos);
    uniqueParents.forEach((p, i) => { p.y += offsets[i % offsets.length]; });
    this.__vinylDepthConfigured = true;
  }
  this.group.rotation.y = getAngle('G2025');
  setMaterialOpacity(this.group, activeGalaxyId === 'G2025' ? 1 : 0.22);
  return result;
};

const previousEraUpdate = EraOrbitSystem.prototype.update;
EraOrbitSystem.prototype.update = function vinylEraUpdate(dt) {
  const result = previousEraUpdate.call(this, dt);
  this.group.visible = true;
  if (!this.__vinylDepthConfigured) {
    const offsets = [-300, 260, 470, -180];
    (this.orbiters || []).forEach((o, i) => { o.pivot.position.y = offsets[i % offsets.length]; });
    this.__vinylDepthConfigured = true;
  }
  this.group.rotation.y = getAngle(this.galaxyId);
  setMaterialOpacity(this.group, activeGalaxyId === this.galaxyId ? 1 : 0.18);
  return result;
};

window.__2flyVinylGalaxy = {
  version: '23.6',
  get activeGalaxyId() { return activeGalaxyId; },
  getAngle,
  breathingMultiplier: BREATHING_MULTIPLIER,
};
