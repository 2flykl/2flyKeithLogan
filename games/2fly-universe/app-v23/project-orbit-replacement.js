// V23.8 Project Orbit HARD REPLACEMENT
// Replaces legacy generic project/media sprites in-place while preserving
// click targets, content IDs, orbit logic, selection flow, and navigation.
import * as THREE from 'three';
import { getTexture } from './scene/decorated-object.js?v=23.8.0';
import { ThruTheFireSystem } from './scene/thru-the-fire-system.js';
import { AfricaSystem } from './scene/africa-system.js';
import { StreamsSystem } from './scene/streams-system.js';
import { FrontierSystems } from './scene/frontier-systems.js';

const PROJECTS = {
  fire: {
    core: 'assets/project_orbits/fire_core.svg',
    audio: 'assets/project_orbits/fire_audio.svg',
    video: 'assets/project_orbits/fire_video.svg',
    playable: 'assets/project_orbits/fire_playable.svg',
    archive: 'assets/project_orbits/fire_archive.svg',
    accent: 0xff5b14,
  },
  africa: {
    core: 'assets/project_orbits/africa_core.svg',
    audio: 'assets/project_orbits/africa_audio.svg',
    video: 'assets/project_orbits/africa_video.svg',
    playable: 'assets/project_orbits/africa_playable.svg',
    archive: 'assets/project_orbits/africa_archive.svg',
    accent: 0xf1b43c,
  },
  streams: {
    core: 'assets/project_orbits/streams_core.svg',
    audio: 'assets/project_orbits/streams_audio.svg',
    video: 'assets/project_orbits/streams_video.svg',
    playable: 'assets/project_orbits/streams_playable.svg',
    archive: 'assets/project_orbits/streams_archive.svg',
    accent: 0x70d6e5,
  },
  away: {
    core: 'assets/project_orbits/away_core.svg',
    audio: 'assets/project_orbits/away_audio.svg',
    video: 'assets/project_orbits/away_video.svg',
    playable: 'assets/project_orbits/away_playable.svg',
    archive: 'assets/project_orbits/away_archive.svg',
    accent: 0xff465a,
  },
};

function mediaPath(project, kind) {
  const cfg = PROJECTS[project];
  return cfg?.[kind] || cfg?.archive;
}

function hideLegacySprites(root) {
  if (!root?.traverse) return;
  root.traverse(node => {
    if (!node?.isSprite) return;
    if (node.userData?.projectOrbitReplacement) return;
    node.visible = false;
    if (node.material) {
      node.material.opacity = 0;
      node.material.transparent = true;
    }
  });
}

function addReplacementSprite(root, path, visualSize, accent, glowScale = 1.24) {
  if (!root || !path) return null;
  const texture = getTexture(path);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.006,
    depthWrite: false,
    depthTest: false,
  }));
  sprite.scale.set(visualSize, visualSize, 1);
  sprite.renderOrder = 40;
  sprite.userData.projectOrbitReplacement = true;
  root.add(sprite);

  const glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: texture,
    color: new THREE.Color(accent),
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    depthTest: false,
  }));
  glow.scale.set(visualSize * glowScale, visualSize * glowScale, 1);
  glow.renderOrder = 39;
  glow.userData.projectOrbitReplacement = true;
  root.add(glow);

  return { sprite, glow };
}

function replaceChildVisual(childRecord, project, defaultSize = 190) {
  const root = childRecord?.mesh;
  if (!root) return;
  hideLegacySprites(root);
  const kind = childRecord.mediaKind || 'archive';
  const size = kind === 'playable' ? defaultSize * 1.16 : kind === 'video' ? defaultSize * 1.08 : defaultSize;
  addReplacementSprite(root, mediaPath(project, kind), size, PROJECTS[project].accent, 1.27);
  root.userData.projectOrbitFamily = project;
  root.userData.projectOrbitKind = kind;
}

function replaceCoreVisual(system, project, size) {
  if (!system?.group) return;
  hideLegacySprites(system.group);
  addReplacementSprite(system.group, PROJECTS[project].core, size, PROJECTS[project].accent, 1.18);
  system.group.userData.projectOrbitFamily = project;
}

function patchCore(Cls, methodName, project, size) {
  const original = Cls?.prototype?.[methodName];
  if (!original || original.__projectOrbitV238) return;
  function patchedCore(...args) {
    const result = original.apply(this, args);
    replaceCoreVisual(this, project, size);
    return result;
  }
  patchedCore.__projectOrbitV238 = true;
  Cls.prototype[methodName] = patchedCore;
}

function patchChildren(Cls, methodName, project, size, after) {
  const original = Cls?.prototype?.[methodName];
  if (!original || original.__projectOrbitV238) return;
  function patchedChildren(...args) {
    const result = original.apply(this, args);
    for (const c of this.children || []) replaceChildVisual(c, project, size);
    after?.(this);
    return result;
  }
  patchedChildren.__projectOrbitV238 = true;
  Cls.prototype[methodName] = patchedChildren;
}

patchCore(ThruTheFireSystem, '_buildMoltenPlanet', 'fire', 1040);
patchChildren(ThruTheFireSystem, '_buildChildren', 'fire', 205, system => {
  const byKind = { playable: 980, video: 1540, audio: 2180, archive: 2860 };
  const yByKind = { playable: 145, video: -125, audio: 90, archive: -85 };
  for (const c of system.children || []) {
    c.orbitRadius = byKind[c.mediaKind] || c.orbitRadius;
    c.orbitY = yByKind[c.mediaKind] || 0;
    if (c.mesh) c.mesh.position.y = c.orbitY;
  }
});

patchCore(AfricaSystem, '_buildSunrisePlanet', 'africa', 1180);
patchChildren(AfricaSystem, '_buildChildren', 'africa', 215, system => {
  const radii = [1180, 1760, 2380, 3040, 3740, 4480, 5140, 5760];
  const heights = [160, -145, 225, -205, 115, -95, 275, -250];
  (system.children || []).forEach((c, i) => {
    c.orbitRadius = radii[i] || (1180 + i * 620);
    c.orbitY = heights[i] || (i % 2 ? -120 : 120);
    if (c.mesh) c.mesh.position.y = c.orbitY;
  });
});

patchCore(StreamsSystem, '_buildPlanet', 'streams', 1000);
patchChildren(StreamsSystem, '_buildChildren', 'streams', 200, system => {
  const byKind = { playable: 920, video: 1450, audio: 2020, archive: 2640 };
  const yByKind = { playable: 125, video: -120, audio: 75, archive: -90 };
  for (const c of system.children || []) {
    c.orbitRadius = byKind[c.mediaKind] || c.orbitRadius;
    c.orbitY = yByKind[c.mediaKind] || 0;
    if (c.mesh) c.mesh.position.y = c.orbitY;
  }
});

const originalFrontierBuild = FrontierSystems?.prototype?._buildSystem;
if (originalFrontierBuild && !originalFrontierBuild.__projectOrbitV238) {
  function patchedFrontierBuild(obj, ...rest) {
    const beforePlanets = (this.planetMeshes || []).length;
    const beforeChildren = (this.children || []).length;
    const result = originalFrontierBuild.call(this, obj, ...rest);
    if (obj?.id !== 'OBJ-AWAY') return result;

    const planetRoot = (this.planetMeshes || [])[beforePlanets];
    if (planetRoot) {
      hideLegacySprites(planetRoot);
      addReplacementSprite(planetRoot, PROJECTS.away.core, 780, PROJECTS.away.accent, 1.18);
      planetRoot.userData.projectOrbitFamily = 'away';
    }

    const newChildren = (this.children || []).slice(beforeChildren);
    const byKind = { playable: 760, video: 1180, audio: 1640, archive: 2080 };
    const yByKind = { playable: 135, video: -115, audio: 72, archive: -80 };
    for (const c of newChildren) {
      replaceChildVisual(c, 'away', 190);
      c.orbitRadius = byKind[c.mediaKind] || c.orbitRadius;
      c.orbitY = yByKind[c.mediaKind] || 0;
      if (c.mesh) c.mesh.position.y = (c.parentPos?.y || 0) + c.orbitY;
    }
    return result;
  }
  patchedFrontierBuild.__projectOrbitV238 = true;
  FrontierSystems.prototype._buildSystem = patchedFrontierBuild;
}

window.__2flyProjectOrbitReplacement = {
  version: '23.8',
  projects: Object.keys(PROJECTS),
  mode: 'hard-replacement',
};
