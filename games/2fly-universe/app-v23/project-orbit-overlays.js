// V23.7 Project Orbit Overlay Pass
// Adds live project-specific SVG identities to the four flagship project systems
// while preserving existing media behavior, navigation, and vinyl residency.
import * as THREE from 'three';
import { getTexture } from './scene/decorated-object.js';
import { ThruTheFireSystem } from './scene/thru-the-fire-system.js';
import { AfricaSystem } from './scene/africa-system.js';
import { StreamsSystem } from './scene/streams-system.js';

function addCoreOverlay(system, path, size, accent, glowOpacity = 0.14) {
  if (!system?.group || system.__projectCoreOverlay) return;
  const texture = getTexture(path);

  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    alphaTest: 0.01,
  }));
  sprite.scale.set(size * 2.46, size * 2.46, 1);
  sprite.renderOrder = 8;
  system.group.add(sprite);

  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: texture,
    color: new THREE.Color(accent),
    transparent: true,
    opacity: glowOpacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }));
  glow.scale.set(size * 2.94, size * 2.94, 1);
  glow.renderOrder = 7;
  system.group.add(glow);

  const disc = new THREE.Group();
  const radii = [size * 1.55, size * 2.2, size * 3.05];
  radii.forEach((r, i) => {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(r, r + Math.max(3, size * 0.012), 96),
      new THREE.MeshBasicMaterial({
        color: i === 1 ? 0xffffff : accent,
        transparent: true,
        opacity: i === 1 ? 0.045 : 0.08,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    ring.rotation.x = -Math.PI / 2;
    disc.add(ring);
  });
  disc.rotation.z = 0.055;
  system.group.add(disc);

  system.__projectCoreOverlay = { sprite, glow, disc };
}

function patchBuilder(Cls, methodName, overlay) {
  const original = Cls?.prototype?.[methodName];
  if (!original) return;
  Cls.prototype[methodName] = function projectCoreBuilder(...args) {
    const result = original.apply(this, args);
    overlay(this);
    return result;
  };
}

patchBuilder(ThruTheFireSystem, '_buildMoltenPlanet', system => {
  addCoreOverlay(system, 'assets/project_orbits/fire_core.svg', 450, 0xff5b14, 0.16);
});

patchBuilder(AfricaSystem, '_buildSunrisePlanet', system => {
  addCoreOverlay(system, 'assets/project_orbits/africa_core.svg', 500, 0xf1b43c, 0.13);
});

patchBuilder(StreamsSystem, '_buildPlanet', system => {
  addCoreOverlay(system, 'assets/project_orbits/streams_core.svg', 430, 0x70d6e5, 0.13);
});

// Africa owns the largest content footprint in the current galaxy. Keep the
// project core near the inner record while distributing documentary chapters,
// audio, archive and playable media across broader, breathable tiers.
const originalAfricaChildren = AfricaSystem.prototype._buildChildren;
AfricaSystem.prototype._buildChildren = function projectAfricaChildren(...args) {
  const result = originalAfricaChildren.apply(this, args);
  const radii = [1220, 1880, 2580, 3320, 4140, 5000, 5700, 6300];
  const yLevels = [160, -230, 320, -390, 250, -300, 430, -470];
  (this.children || []).forEach((child, i) => {
    child.orbitRadius = radii[i] ?? (1220 + i * 680);
    child.orbitSpeed = Math.max(0.055, 0.23 - i * 0.025);
    child.__projectOrbitY = yLevels[i] ?? (i % 2 ? -240 : 240);
    if (child.mesh) {
      child.mesh.scale.setScalar(child.mediaKind === 'playable' ? 1.18 : child.mediaKind === 'video' ? 1.08 : 1);
    }
  });
  return result;
};

const originalAfricaUpdate = AfricaSystem.prototype.update;
AfricaSystem.prototype.update = function projectAfricaUpdate(dt, camera, renderer) {
  const result = originalAfricaUpdate.call(this, dt, camera, renderer);
  (this.children || []).forEach((child, i) => {
    if (!child.mesh) return;
    const y = child.__projectOrbitY ?? (i % 2 ? -220 : 220);
    child.mesh.position.y = y + Math.sin((this.time || 0) * 0.34 + i * 1.2) * 34;
  });
  if (this.__projectCoreOverlay?.disc) this.__projectCoreOverlay.disc.rotation.y += dt * 0.035;
  return result;
};

function patchOverlayRotation(Cls, speed) {
  const original = Cls.prototype.update;
  Cls.prototype.update = function projectOverlayUpdate(...args) {
    const result = original.apply(this, args);
    const dt = Number(args[0]) || 0;
    if (this.__projectCoreOverlay?.disc) this.__projectCoreOverlay.disc.rotation.y += dt * speed;
    return result;
  };
}

patchOverlayRotation(ThruTheFireSystem, 0.045);
patchOverlayRotation(StreamsSystem, 0.032);

window.__2flyProjectOrbitAssets = {
  version: '23.7',
  enabled: true,
  projects: ['I Was Away', 'Streams', 'Thru the Fire', 'I Woke Up in Africa'],
};
