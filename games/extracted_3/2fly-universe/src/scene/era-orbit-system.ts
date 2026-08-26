import * as THREE from 'three';
import { GALAXY_THEMES } from '../types';

export interface EraOrbitHit {
  galaxyId: string;
  title: string;
  worldPos: THREE.Vector3;
}

interface ShellDef { title: string; texture: string; radius: number; orbit: number; speed: number; kind: 'planet'|'moon'|'artifact'; }

const ERA_SHELLS: Record<string, ShellDef[]> = {
  G2000: [
    { title:'BRASS ARCHIVE WORLD', texture:'assets/era/planet_foundation_brass.jpg', radius:620, orbit:2400, speed:0.08, kind:'planet' },
    { title:'ANALOG MOON', texture:'assets/era/planet_foundation_archive.jpg', radius:300, orbit:3900, speed:-0.11, kind:'moon' },
    { title:'ORIGIN RELIC', texture:'', radius:180, orbit:5200, speed:0.05, kind:'artifact' },
  ],
  G2005: [
    { title:'CRIMSON MOMENTUM WORLD', texture:'assets/era/planet_momentum_crimson.jpg', radius:690, orbit:2600, speed:0.10, kind:'planet' },
    { title:'CHROME SIGNAL MOON', texture:'assets/era/planet_momentum_chrome.jpg', radius:280, orbit:4200, speed:-0.13, kind:'moon' },
    { title:'BROADCAST RELIC', texture:'', radius:190, orbit:5600, speed:0.07, kind:'artifact' },
  ],
  G2010: [
    { title:'PRISM REINVENTION WORLD', texture:'assets/era/planet_reinvention_violet.jpg', radius:670, orbit:2500, speed:0.07, kind:'planet' },
    { title:'GLASS MOON', texture:'assets/era/planet_reinvention_glass.jpg', radius:315, orbit:4000, speed:-0.09, kind:'moon' },
    { title:'CRYSTAL ARCHIVE', texture:'', radius:210, orbit:5400, speed:0.06, kind:'artifact' },
  ],
  G2015: [
    { title:'EMBER EXPANSION WORLD', texture:'assets/era/planet_expansion_ember.jpg', radius:760, orbit:2800, speed:0.085, kind:'planet' },
    { title:'GOLDEN ORBIT MOON', texture:'assets/era/planet_expansion_gold.jpg', radius:330, orbit:4500, speed:-0.10, kind:'moon' },
    { title:'SIGNAL RING STATION', texture:'', radius:220, orbit:6000, speed:0.045, kind:'artifact' },
  ],
  G2020: [
    { title:'TEAL AWAKENING WORLD', texture:'assets/era/planet_awakening_teal.jpg', radius:700, orbit:2550, speed:0.065, kind:'planet' },
    { title:'CLOUD REFLECTION MOON', texture:'assets/era/planet_awakening_cloud.jpg', radius:350, orbit:4300, speed:-0.08, kind:'moon' },
    { title:'REFLECTION SATELLITE', texture:'', radius:190, orbit:5700, speed:0.055, kind:'artifact' },
  ],
  G2030: [
    { title:'UNCHARTED SIGNAL WORLD', texture:'assets/era/planet_awakening_cloud.jpg', radius:640, orbit:2350, speed:0.05, kind:'planet' },
    { title:'FUTURE ECHO MOON', texture:'assets/era/planet_reinvention_glass.jpg', radius:290, orbit:3950, speed:-0.075, kind:'moon' },
    { title:'HORIZON ARCHIVE', texture:'', radius:185, orbit:5450, speed:0.042, kind:'artifact' },
  ],
};

export class EraOrbitSystem {
  readonly group = new THREE.Group();
  readonly clickTargets: THREE.Object3D[] = [];
  private orbiters: { pivot: THREE.Group; body: THREE.Mesh; speed: number }[] = [];
  private loader = new THREE.TextureLoader();

  constructor(public readonly galaxyId: string) {
    const theme = GALAXY_THEMES[galaxyId];
    const defs = ERA_SHELLS[galaxyId];
    if (!theme || !defs) return;
    this.group.position.set(...theme.worldOffset);

    defs.forEach((def, i) => {
      const pivot = new THREE.Group();
      pivot.rotation.x = (i - 1) * 0.22;
      pivot.rotation.z = i * 0.4 + 0.12;
      const geo = def.kind === 'artifact' ? new THREE.IcosahedronGeometry(def.radius, 1) : new THREE.SphereGeometry(def.radius, 44, 28);
      let mat: THREE.MeshStandardMaterial;
      if (def.texture) {
        const tex=this.loader.load(def.texture); tex.colorSpace=THREE.SRGBColorSpace; tex.wrapS=THREE.RepeatWrapping;
        mat=new THREE.MeshStandardMaterial({map:tex,roughness:def.kind==='moon'?0.7:0.48,metalness:def.kind==='planet'?0.12:0.28,emissive:theme.nebulaColor,emissiveIntensity:0.18});
      } else {
        mat=new THREE.MeshStandardMaterial({color:theme.accentColor,roughness:0.28,metalness:0.78,emissive:theme.primaryColor,emissiveIntensity:0.22,wireframe:false});
      }
      const body=new THREE.Mesh(geo,mat);
      body.position.x=def.orbit;
      body.userData['eraShell']=true; body.userData['galaxyId']=galaxyId; body.userData['title']=def.title;
      pivot.add(body); this.group.add(pivot); this.clickTargets.push(body); this.orbiters.push({pivot,body,speed:def.speed});

      const curve=new THREE.EllipseCurve(0,0,def.orbit,def.orbit*0.52,0,Math.PI*2,false,0);
      const pts=curve.getPoints(128).map((v: THREE.Vector2)=>new THREE.Vector3(v.x,0,v.y));
      const ringGeo=new THREE.BufferGeometry().setFromPoints(pts);
      const ringMat=new THREE.LineBasicMaterial({color:theme.accentColor,transparent:true,opacity:0.075,depthWrite:false});
      const line=new THREE.LineLoop(ringGeo,ringMat); line.rotation.x=Math.PI/2; pivot.add(line);

      if (i===0) {
        const torus=new THREE.Mesh(new THREE.TorusGeometry(def.radius*1.45,30,12,96),new THREE.MeshBasicMaterial({color:theme.accentColor,transparent:true,opacity:0.16,depthWrite:false}));
        torus.rotation.x=Math.PI/2.3; body.add(torus);
      }
    });

    const light=new THREE.PointLight(theme.accentColor,1.5,14000); this.group.add(light);
  }

  getHit(raycaster: THREE.Raycaster): EraOrbitHit | null {
    const hits=raycaster.intersectObjects(this.clickTargets,false); if (!hits.length) return null;
    const obj=hits[0].object; const wp=new THREE.Vector3(); obj.getWorldPosition(wp);
    return { galaxyId:this.galaxyId, title:String(obj.userData['title'] ?? 'ARCHIVE OBJECT'), worldPos:wp };
  }

  update(dt:number) {
    for (const o of this.orbiters) { o.pivot.rotation.y += dt * o.speed * 0.72; o.body.rotation.y += dt * 0.1; }
  }
}
