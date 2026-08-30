import * as THREE from 'three';

const textureLoader = new THREE.TextureLoader();
const textureCache: Record<string, THREE.Texture> = {};

export function getTexture(path: string): THREE.Texture {
  if (!textureCache[path]) {
    const tex = textureLoader.load(path);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    textureCache[path] = tex;
  }
  return textureCache[path];
}

function projectFromId(id = ''): 'fire' | 'africa' | 'streams' | 'away' | 'frontier' {
  const u = id.toUpperCase();
  if (u.includes('AFRICA')) return 'africa';
  if (u.includes('FIRE')) return 'fire';
  if (u.includes('STREAMS')) return 'streams';
  if (u.includes('AWAY')) return 'away';
  return 'frontier';
}

const PROJECT_SURFACES: Record<string, string> = {
  fire: 'assets/era/planet_expansion_ember.jpg',
  africa: 'assets/era/planet_expansion_gold.jpg',
  streams: 'assets/era/planet_reinvention_glass.jpg',
  away: 'assets/era/planet_momentum_chrome.jpg',
  frontier: 'assets/era/planet_awakening_teal.jpg',
};

const MEDIA_SURFACES: Record<string, string> = {
  audio: 'assets/era/planet_momentum_chrome.jpg',
  video: 'assets/era/planet_reinvention_glass.jpg',
  playable: 'assets/era/planet_expansion_gold.jpg',
  archive: 'assets/era/planet_foundation_archive.jpg',
};

function createAtmosphere(radius: number, color: number, opacity = 0.15): THREE.Mesh {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius, 32, 32),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
}

function createPlanetRings(radius: number, accentColorHex: number, intensity = 1): THREE.Group {
  const group = new THREE.Group();
  const ring1 = new THREE.Mesh(
    new THREE.RingGeometry(radius * 1.32, radius * 1.37, 128),
    new THREE.MeshBasicMaterial({ color: 0xeaf5ff, transparent: true, opacity: 0.10 * intensity, side: THREE.DoubleSide, depthWrite: false }),
  );
  ring1.rotation.x = -Math.PI / 2 + 0.22;
  ring1.rotation.z = 0.18;
  group.add(ring1);
  const ring2 = new THREE.Mesh(
    new THREE.RingGeometry(radius * 1.46, radius * 1.49, 128),
    new THREE.MeshBasicMaterial({ color: accentColorHex, transparent: true, opacity: 0.12 * intensity, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }),
  );
  ring2.rotation.x = -Math.PI / 2 + 0.18;
  ring2.rotation.z = 0.18;
  group.add(ring2);
  return group;
}

export interface DecoratedObjectResult { group: THREE.Group; clickTarget: THREE.Mesh; }

export function createDecoratedPlanet(objectId: string, size: number, accentColorHex: number): DecoratedObjectResult {
  const group = new THREE.Group();
  const project = projectFromId(objectId);
  const surface = getTexture(PROJECT_SURFACES[project]);
  surface.repeat.set(1.6, 1.1);
  const geo = new THREE.SphereGeometry(size, 48, 48);
  const mat = new THREE.MeshStandardMaterial({
    map: surface, color: 0xffffff, roughness: project === 'away' ? 0.32 : 0.56, metalness: project === 'away' ? 0.5 : 0.12,
    emissive: new THREE.Color(accentColorHex), emissiveIntensity: 0.09,
  });
  const planet = new THREE.Mesh(geo, mat);
  planet.rotation.z = 0.12;
  group.add(planet);
  group.add(createAtmosphere(size * 1.09, accentColorHex, 0.12));
  group.add(createPlanetRings(size, accentColorHex, 1));
  const light = new THREE.PointLight(accentColorHex, 0.55, size * 10);
  light.position.set(size * 1.4, size * 0.7, size * 1.5);
  group.add(light);
  const collider = new THREE.Mesh(new THREE.SphereGeometry(size * 1.16, 16, 16), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
  group.add(collider);
  return { group, clickTarget: collider };
}

export function createDecoratedChild(childData: { id: string; mediaKind?: string; title?: string }, size: number, accentColorHex: number, parentObjectId?: string): DecoratedObjectResult {
  const group = new THREE.Group();
  const mk = childData.mediaKind ?? 'archive';
  const project = projectFromId(parentObjectId ?? childData.id);
  const surface = getTexture(MEDIA_SURFACES[mk] ?? MEDIA_SURFACES.archive).clone();
  surface.needsUpdate = true;
  surface.repeat.set(1.35 + (mk === 'video' ? 0.25 : 0), 1.05);
  surface.offset.x = project === 'fire' ? 0.08 : project === 'africa' ? 0.18 : project === 'streams' ? 0.28 : 0.38;
  const segments = mk === 'archive' ? 18 : 36;
  const geo = mk === 'playable' ? new THREE.IcosahedronGeometry(size, 3) : new THREE.SphereGeometry(size, segments, segments);
  const material = new THREE.MeshStandardMaterial({
    map: surface, color: 0xffffff, roughness: mk === 'audio' ? 0.38 : mk === 'video' ? 0.28 : mk === 'playable' ? 0.2 : 0.72,
    metalness: mk === 'audio' ? 0.42 : mk === 'video' ? 0.55 : mk === 'playable' ? 0.32 : 0.08,
    emissive: new THREE.Color(accentColorHex), emissiveIntensity: mk === 'playable' ? 0.18 : 0.07,
  });
  const body = new THREE.Mesh(geo, material);
  body.rotation.z = (project.charCodeAt(0) % 10) * 0.03;
  group.add(body);
  if (mk === 'audio') {
    const grooves = new THREE.Group();
    [1.18, 1.32, 1.46].forEach((mult, idx) => {
      const torus = new THREE.Mesh(new THREE.TorusGeometry(size * mult, 1.3 + idx * 0.45, 8, 96), new THREE.MeshBasicMaterial({ color: idx === 1 ? accentColorHex : 0xeef7ff, transparent: true, opacity: 0.11, depthWrite: false }));
      torus.rotation.x = Math.PI / 2;
      grooves.add(torus);
    });
    grooves.rotation.z = 0.2;
    group.add(grooves);
  } else if (mk === 'video') {
    const halo = createPlanetRings(size * 0.9, accentColorHex, 0.8);
    halo.rotation.z = -0.18;
    group.add(halo);
  } else if (mk === 'playable') {
    group.add(new THREE.Mesh(new THREE.IcosahedronGeometry(size * 1.16, 1), new THREE.MeshBasicMaterial({ color: accentColorHex, transparent: true, opacity: 0.10, wireframe: true, depthWrite: false })));
  } else {
    const moonlet = new THREE.Mesh(new THREE.SphereGeometry(size * 0.18, 12, 12), new THREE.MeshStandardMaterial({ color: 0xbec8d4, roughness: 0.8, metalness: 0.05 }));
    moonlet.position.set(size * 1.55, size * 0.1, 0);
    group.add(moonlet);
  }
  group.add(createAtmosphere(size * 1.12, accentColorHex, mk === 'playable' ? 0.12 : 0.065));
  const collider = new THREE.Mesh(new THREE.SphereGeometry(size * 1.4, 12, 12), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
  group.add(collider);
  return { group, clickTarget: collider };
}
