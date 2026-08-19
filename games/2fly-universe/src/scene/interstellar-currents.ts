import * as THREE from 'three';
import { GALAXY_THEMES } from '../types';

interface CurrentParticle { mesh: THREE.Mesh; curve: THREE.CatmullRomCurve3; t: number; speed: number; }

export class InterstellarCurrents {
  readonly group = new THREE.Group();
  private particles: CurrentParticle[] = [];
  private ribbons: THREE.Mesh[] = [];

  constructor() {
    const ids = ['G2000','G2005','G2010','G2015','G2020','G2025','G2030'];
    for (let i = 0; i < ids.length - 1; i++) this.buildCurrent(ids[i], ids[i + 1], i);
    // A second diagonal route keeps the universe from reading like a linear timeline.
    this.buildCurrent('G2000', 'G2025', 8, 0.34);
    this.buildCurrent('G2010', 'G2030', 9, 0.26);
  }

  private buildCurrent(aId: string, bId: string, seed: number, opacity = 0.22) {
    const a = GALAXY_THEMES[aId], b = GALAXY_THEMES[bId];
    if (!a || !b) return;
    const p0 = new THREE.Vector3(...a.worldOffset);
    const p3 = new THREE.Vector3(...b.worldOffset);
    const mid = p0.clone().lerp(p3, 0.5);
    const span = p0.distanceTo(p3);
    const side = new THREE.Vector3(p3.z - p0.z, span * (0.10 + (seed % 3) * 0.035), -(p3.x - p0.x)).normalize();
    const bend = side.multiplyScalar(span * (0.11 + (seed % 2) * 0.045));
    const p1 = p0.clone().lerp(mid, 0.62).add(bend);
    const p2 = p3.clone().lerp(mid, 0.62).addScaledVector(bend, -0.55);
    const curve = new THREE.CatmullRomCurve3([p0, p1, p2, p3], false, 'catmullrom', 0.5);

    const tube = new THREE.TubeGeometry(curve, 160, Math.max(70, span * 0.0022), 10, false);
    const color = new THREE.Color(a.accentColor).lerp(new THREE.Color(b.accentColor), 0.5);
    const mat = new THREE.MeshBasicMaterial({ color, transparent:true, opacity, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide, wireframe:true });
    const ribbon = new THREE.Mesh(tube, mat);
    ribbon.renderOrder = -3;
    this.group.add(ribbon); this.ribbons.push(ribbon);

    const glowTube = new THREE.TubeGeometry(curve, 120, Math.max(20, span * 0.0007), 6, false);
    const glow = new THREE.Mesh(glowTube, new THREE.MeshBasicMaterial({color,transparent:true,opacity:opacity*0.46,blending:THREE.AdditiveBlending,depthWrite:false}));
    this.group.add(glow);

    for (let j=0;j<8;j++) {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(55 + (j%3)*18, 8, 6), new THREE.MeshBasicMaterial({color,transparent:true,opacity:0.55,blending:THREE.AdditiveBlending,depthWrite:false}));
      const t=(j/8 + seed*0.071)%1; mesh.position.copy(curve.getPointAt(t)); this.group.add(mesh);
      this.particles.push({mesh,curve,t,speed:0.010 + (j%4)*0.0025});
    }
  }

  update(dt:number, time:number) {
    for (const p of this.particles) { p.t=(p.t+dt*p.speed)%1; p.mesh.position.copy(p.curve.getPointAt(p.t)); p.mesh.scale.setScalar(0.72 + 0.35*(0.5+0.5*Math.sin(time*2+p.t*18))); }
    for (let i=0;i<this.ribbons.length;i++) (this.ribbons[i].material as THREE.MeshBasicMaterial).opacity = 0.13 + 0.07*(0.5+0.5*Math.sin(time*0.35+i));
  }
}
