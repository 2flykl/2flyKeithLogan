// V23.4 Depth Focus Pass
// Keeps the current galaxy visually dominant while preserving distant galaxy awareness.
// This module patches presentation only; it does not alter camera/navigation or selection logic.

import * as THREE from 'three';
import { GalaxyScene } from './scene/galaxy.js';
import { EraOrbitSystem } from './scene/era-orbit-system.js';
import { ThruTheFireSystem } from './scene/thru-the-fire-system.js';
import { AfricaSystem } from './scene/africa-system.js';
import { StreamsSystem } from './scene/streams-system.js';
import { FrontierSystems } from './scene/frontier-systems.js';

let activeGalaxyId = null;

window.addEventListener('universe-galaxy-threshold', (event) => {
  const detail = event?.detail || {};
  if (!detail.galaxyId) return;
  if (detail.state === 'enter') activeGalaxyId = detail.galaxyId;
  else if (detail.state === 'exit' && activeGalaxyId === detail.galaxyId) activeGalaxyId = null;
});

function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}

// ── Galaxy plate depth attenuation ──────────────────────────────────────────
const originalGalaxyUpdate = GalaxyScene.prototype.update;
GalaxyScene.prototype.update = function patchedGalaxyUpdate(time, cameraWorldPos) {
  originalGalaxyUpdate.call(this, time, cameraWorldPos);

  const id = this.getId?.() || this.data?.id;
  const isInactive = !!activeGalaxyId && activeGalaxyId !== id;
  if (!isInactive) return;

  const center = this.group.getWorldPosition(new THREE.Vector3());
  const dist = cameraWorldPos.distanceTo(center);

  // Nearby background galaxies remain identifiable, but never compete with the
  // active galaxy. Farther ones collapse toward a faint landmark/glow.
  const distanceFade = 1 - clamp01((dist - 18000) / 65000);
  const focus = 0.055 + distanceFade * 0.105; // ~5.5% far -> ~16% near

  if (Array.isArray(this.gasMaterials)) {
    for (const mat of this.gasMaterials) {
      if (mat?.uniforms?.globalAlpha) mat.uniforms.globalAlpha.value *= focus;
    }
  }

  if (this.coreMaterial?.uniforms?.globalAlpha) {
    this.coreMaterial.uniforms.globalAlpha.value *= Math.min(0.19, focus * 1.18);
  }

  if (Array.isArray(this.abstractLines)) {
    for (const entry of this.abstractLines) {
      if (entry?.line?.material) entry.line.material.opacity *= Math.min(0.22, focus * 1.35);
    }
  }

  if (Array.isArray(this.orbitRings)) {
    for (const ring of this.orbitRings) {
      if (ring?.material) ring.material.opacity *= 0.16;
    }
  }

  if (this.atmosphereMaterial) this.atmosphereMaterial.opacity *= 0.12;

  if (Array.isArray(this.ledPivots)) {
    for (const led of this.ledPivots) {
      if (led?.node?.material) led.node.material.opacity *= 0.12;
    }
  }

  if (this.galaxyLight) this.galaxyLight.intensity *= 0.08;
};

// ── Label hierarchy ─────────────────────────────────────────────────────────
const originalGalaxyLabels = GalaxyScene.prototype.updateLabels;
GalaxyScene.prototype.updateLabels = function patchedGalaxyLabels(camera, renderer, cameraWorldPos, localGalaxyId = null) {
  originalGalaxyLabels.call(this, camera, renderer, cameraWorldPos, localGalaxyId);

  const id = this.getId?.() || this.data?.id;
  const isInactive = !!localGalaxyId && localGalaxyId !== id;

  for (const entry of this.labelEls || []) {
    const el = entry?.el;
    if (!el) continue;

    if (isInactive) {
      if (entry.kind === 'region') {
        el.style.opacity = '0';
        el.style.visibility = 'hidden';
      } else {
        const current = Number.parseFloat(el.style.opacity || '0');
        el.style.opacity = String(Math.min(Number.isFinite(current) ? current : 0, 0.075));
        el.style.visibility = 'visible';
        el.style.filter = 'brightness(.62) saturate(.58) blur(.18px)';
      }
    } else {
      el.style.visibility = 'visible';
      el.style.filter = '';
    }
  }
};

// ── Interior system gating ──────────────────────────────────────────────────
// Deep space is a galaxy atlas. Internal planets/moons appear only after entry.
const originalEraUpdate = EraOrbitSystem.prototype.update;
EraOrbitSystem.prototype.update = function patchedEraUpdate(dt) {
  this.group.visible = !!activeGalaxyId && activeGalaxyId === this.galaxyId;
  if (this.group.visible) originalEraUpdate.call(this, dt);
};

function gateShowcasePrototype(Cls) {
  if (!Cls?.prototype?.update) return;
  const original = Cls.prototype.update;
  Cls.prototype.update = function patchedShowcaseUpdate(...args) {
    this.group.visible = activeGalaxyId === 'G2025';
    if (this.group.visible) return original.apply(this, args);
  };
}

gateShowcasePrototype(ThruTheFireSystem);
gateShowcasePrototype(AfricaSystem);
gateShowcasePrototype(StreamsSystem);
gateShowcasePrototype(FrontierSystems);

// Expose the current focus state for diagnostics without coupling the renderer.
window.__2flyDepthFocus = {
  get activeGalaxyId() { return activeGalaxyId; },
  version: '23.4',
};
