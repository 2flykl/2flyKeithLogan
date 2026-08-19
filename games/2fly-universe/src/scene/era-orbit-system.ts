import * as THREE from 'three';
import { GALAXY_THEMES } from '../types';
import type { TourStop } from '../tour-types';

export interface EraOrbitHit {
  galaxyId: string;
  title: string;
  worldPos: THREE.Vector3;
}

interface ShellDef {
  title: string;
  texture: string;
  radius: number;
  orbit: number;
  speed: number;
  kind: 'planet'|'moon'|'artifact';
  form?: 'sphere'|'faceted'|'torus'|'crystal'|'station';
  ring?: boolean;
}

const ERA_SHELLS: Record<string, ShellDef[]> = {
  G2000: [
    { title:'BRASS ARCHIVE WORLD', texture:'assets/era/planet_foundation_brass.jpg', radius:620, orbit:2400, speed:0.08, kind:'planet', form:'sphere', ring:true },
    { title:'ANALOG MOON', texture:'assets/era/planet_foundation_archive.jpg', radius:300, orbit:3900, speed:-0.11, kind:'moon', form:'faceted' },
    { title:'ORIGIN RELIC', texture:'', radius:210, orbit:5200, speed:0.05, kind:'artifact', form:'torus' },
    { title:'SIGNAL CAPSULE', texture:'', radius:165, orbit:6400, speed:-0.035, kind:'artifact', form:'station' },
  ],
  G2005: [
    { title:'CRIMSON MOMENTUM WORLD', texture:'assets/era/planet_momentum_crimson.jpg', radius:690, orbit:2600, speed:0.10, kind:'planet', form:'sphere', ring:true },
    { title:'CHROME SIGNAL MOON', texture:'assets/era/planet_momentum_chrome.jpg', radius:280, orbit:4200, speed:-0.13, kind:'moon', form:'faceted' },
    { title:'BROADCAST RELIC', texture:'', radius:190, orbit:5600, speed:0.07, kind:'artifact', form:'station' },
    { title:'REDLINE COMET CORE', texture:'', radius:145, orbit:6750, speed:-0.045, kind:'artifact', form:'crystal' },
  ],
  G2010: [
    { title:'PRISM REINVENTION WORLD', texture:'assets/era/planet_reinvention_violet.jpg', radius:670, orbit:2500, speed:0.07, kind:'planet', form:'sphere', ring:true },
    { title:'GLASS MOON', texture:'assets/era/planet_reinvention_glass.jpg', radius:315, orbit:4000, speed:-0.09, kind:'moon', form:'faceted' },
    { title:'CRYSTAL ARCHIVE', texture:'', radius:235, orbit:5400, speed:0.06, kind:'artifact', form:'crystal' },
    { title:'REASSEMBLY RING', texture:'', radius:180, orbit:6600, speed:-0.04, kind:'artifact', form:'torus' },
  ],
  G2015: [
    { title:'EMBER EXPANSION WORLD', texture:'assets/era/planet_expansion_ember.jpg', radius:760, orbit:2800, speed:0.085, kind:'planet', form:'sphere', ring:true },
    { title:'GOLDEN ORBIT MOON', texture:'assets/era/planet_expansion_gold.jpg', radius:330, orbit:4500, speed:-0.10, kind:'moon', form:'faceted' },
    { title:'SIGNAL RING STATION', texture:'', radius:235, orbit:6000, speed:0.045, kind:'artifact', form:'torus' },
    { title:'EXPANSION BEACON', texture:'', radius:175, orbit:7200, speed:-0.032, kind:'artifact', form:'station' },
  ],
  G2020: [
    { title:'TEAL AWAKENING WORLD', texture:'assets/era/planet_awakening_teal.jpg', radius:700, orbit:2550, speed:0.065, kind:'planet', form:'sphere', ring:true },
    { title:'CLOUD REFLECTION MOON', texture:'assets/era/planet_awakening_cloud.jpg', radius:350, orbit:4300, speed:-0.08, kind:'moon', form:'faceted' },
    { title:'REFLECTION SATELLITE', texture:'', radius:195, orbit:5700, speed:0.055, kind:'artifact', form:'station' },
    { title:'TIDAL MEMORY CRYSTAL', texture:'', radius:160, orbit:6900, speed:-0.041, kind:'artifact', form:'crystal' },
  ],
  // Future era remains explorable and mysterious, with no fabricated live history.
  G2030: [
    { title:'UNCHARTED SIGNAL', texture:'', radius:430, orbit:3000, speed:0.045, kind:'artifact', form:'crystal', ring:true },
    { title:'DARK ORBIT RELAY', texture:'', radius:190, orbit:5200, speed:-0.035, kind:'artifact', form:'station' },
  ],
};

export class EraOrbitSystem {
  readonly group = new THREE.Group();
  readonly clickTargets: THREE.Object3D[] = [];
  private orbiters: { pivot: THREE.Group; body: THREE.Mesh; speed: number; baseY: number }[] = [];
  private loader = new THREE.TextureLoader();

  constructor(public readonly galaxyId: string) {
    const theme = GALAXY_THEMES[galaxyId];
    const defs = ERA_SHELLS[galaxyId];
    if (!theme || !defs) return;
    this.group.position.set(...theme.worldOffset);

    const ambient = new THREE.AmbientLight(theme.starTint, galaxyId === 'G2030' ? 0.18 : 0.32);
    this.group.add(ambient);

    defs.forEach((def, i) => {
      const pivot = new THREE.Group();
      pivot.rotation.x = (i - (defs.length - 1) / 2) * 0.18;
      pivot.rotation.z = i * 0.52 + 0.1;

      let geo: THREE.BufferGeometry;
      switch (def.form) {
        case 'faceted': geo = new THREE.IcosahedronGeometry(def.radius, 2); break;
        case 'torus': geo = new THREE.TorusKnotGeometry(def.radius * 0.72, def.radius * 0.19, 96, 16, 2, 5); break;
        case 'crystal': geo = new THREE.OctahedronGeometry(def.radius, 1); break;
        case 'station': geo = new THREE.CylinderGeometry(def.radius * 0.72, def.radius, def.radius * 1.8, 10, 2); break;
        default: geo = new THREE.SphereGeometry(def.radius, 56, 36);
      }

      let mat: THREE.MeshStandardMaterial;
      if (def.texture) {
        const tex = this.loader.load(def.texture);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = THREE.RepeatWrapping;
        mat = new THREE.MeshStandardMaterial({
          map: tex,
          roughness: def.kind === 'moon' ? 0.64 : 0.42,
          metalness: def.kind === 'planet' ? 0.14 : 0.34,
          emissive: theme.nebulaColor,
          emissiveIntensity: 0.22,
        });
      } else {
        mat = new THREE.MeshStandardMaterial({
          color: theme.accentColor,
          roughness: def.form === 'crystal' ? 0.12 : 0.3,
          metalness: def.form === 'station' || def.form === 'torus' ? 0.86 : 0.58,
          emissive: theme.primaryColor,
          emissiveIntensity: galaxyId === 'G2030' ? 0.12 : 0.28,
          transparent: galaxyId === 'G2030',
          opacity: galaxyId === 'G2030' ? 0.62 : 1,
        });
      }

      const body = new THREE.Mesh(geo, mat);
      body.position.set(def.orbit, (i % 2 ? 1 : -1) * (120 + i * 40), 0);
      body.userData['eraShell'] = true;
      body.userData['galaxyId'] = galaxyId;
      body.userData['title'] = def.title;
      body.userData['kind'] = def.kind;
      pivot.add(body);
      this.group.add(pivot);
      this.clickTargets.push(body);
      this.orbiters.push({ pivot, body, speed: def.speed, baseY: body.position.y });

      const curve = new THREE.EllipseCurve(0, 0, def.orbit, def.orbit * (0.48 + i * 0.035), 0, Math.PI * 2, false, i * 0.2);
      const pts = curve.getPoints(160).map(v => new THREE.Vector3(v.x, 0, v.y));
      const ringGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const ringMat = new THREE.LineBasicMaterial({ color: theme.accentColor, transparent:true, opacity:0.08, depthWrite:false });
      const line = new THREE.LineLoop(ringGeo, ringMat);
      line.rotation.x = Math.PI / 2;
      pivot.add(line);

      if (def.ring) {
        const torus = new THREE.Mesh(
          new THREE.TorusGeometry(def.radius * 1.5, 28, 12, 128),
          new THREE.MeshBasicMaterial({ color: theme.accentColor, transparent:true, opacity:0.22, depthWrite:false, blending:THREE.AdditiveBlending })
        );
        torus.rotation.x = Math.PI / 2.35;
        body.add(torus);
        const torus2 = torus.clone();
        torus2.scale.setScalar(1.14);
        torus2.rotation.y = Math.PI / 4;
        (torus2.material as THREE.MeshBasicMaterial) = (torus.material as THREE.MeshBasicMaterial).clone();
        (torus2.material as THREE.MeshBasicMaterial).opacity = 0.08;
        body.add(torus2);
      }

      if (def.form === 'station') {
        const antenna = new THREE.Mesh(
          new THREE.TorusGeometry(def.radius * 0.95, 14, 8, 64),
          new THREE.MeshBasicMaterial({ color: theme.starTint, transparent:true, opacity:0.3 })
        );
        antenna.rotation.x = Math.PI / 2;
        body.add(antenna);
      }
    });

    const light = new THREE.PointLight(theme.accentColor, galaxyId === 'G2030' ? 0.75 : 1.7, 15000);
    this.group.add(light);
  }

  getHit(raycaster: THREE.Raycaster): EraOrbitHit | null {
    const hits = raycaster.intersectObjects(this.clickTargets, false);
    if (!hits.length) return null;
    const obj = hits[0].object;
    const wp = new THREE.Vector3();
    obj.getWorldPosition(wp);
    return { galaxyId:this.galaxyId, title:String(obj.userData['title'] ?? 'ARCHIVE OBJECT'), worldPos:wp };
  }

  getTourStops(): TourStop[] {
    return this.clickTargets.map((obj, i) => {
      const wp = new THREE.Vector3();
      obj.getWorldPosition(wp);
      return {
        id: `${this.galaxyId}-ARCHIVE-${i}`,
        name: String(obj.userData['title'] ?? 'ARCHIVE OBJECT'),
        subtitle: this.galaxyId === 'G2030' ? 'UNCHARTED · NO LIVE CONTENT' : 'ARCHIVE NOT YET CURATED',
        galaxyId: this.galaxyId,
        kind: String(obj.userData['kind'] ?? 'artifact'),
        live: false,
        pos: { x: wp.x, y: wp.y, z: wp.z },
      };
    });
  }

  update(dt:number) {
    const t = performance.now() * 0.001;
    for (const [i, o] of this.orbiters.entries()) {
      o.pivot.rotation.y += dt * o.speed;
      o.body.rotation.y += dt * (0.13 + i * 0.017);
      o.body.rotation.x += dt * (0.015 + i * 0.006);
      o.body.position.y = o.baseY + Math.sin(t * (0.45 + i * 0.1) + i) * (35 + i * 9);
    }
  }
}
