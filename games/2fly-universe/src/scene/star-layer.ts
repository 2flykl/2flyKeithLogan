import * as THREE from 'three';
import type { StarRecord } from '../types';
import { GALAXY_THEMES } from '../types';

const NEAR_DETAIL_DIST = 4200;
const ATLAS_COLS = 8;
const ATLAS_ROWS = 3;
const STAR_VARIANTS = ATLAS_COLS * ATLAS_ROWS;

export class StarLayer {
  readonly group = new THREE.Group();
  private instancedFar!: THREE.InstancedMesh;
  private instancedMid!: THREE.InstancedMesh;
  private nearMeshes = new Map<string, THREE.Sprite>();
  private stars: StarRecord[] = [];
  private dummy = new THREE.Object3D();
  private labelContainer: HTMLElement;
  private labelEls = new Map<string, HTMLElement>();
  private myStarId: string | null = null;
  private atlas: THREE.Texture;
  private atlasVariants = new Map<number, THREE.Texture>();

  constructor(labelContainer: HTMLElement) {
    this.labelContainer = labelContainer;
    this.atlas = new THREE.TextureLoader().load('assets/spritesheets/visitor_stars_24.png');
    this.atlas.colorSpace = THREE.SRGBColorSpace;
    this.atlas.minFilter = THREE.LinearFilter;
    this.atlas.magFilter = THREE.LinearFilter;
    this.buildFarInstanced();
    this.buildMidInstanced();
  }

  private buildFarInstanced() {
    const geo = new THREE.OctahedronGeometry(22, 0);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
    this.instancedFar = new THREE.InstancedMesh(geo, mat, 25000);
    this.instancedFar.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.instancedFar.count = 0;
    this.group.add(this.instancedFar);
  }

  private buildMidInstanced() {
    const geo = new THREE.OctahedronGeometry(34, 0);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 });
    this.instancedMid = new THREE.InstancedMesh(geo, mat, 25000);
    this.instancedMid.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.instancedMid.count = 0;
    this.instancedMid.visible = false;
    this.group.add(this.instancedMid);
  }

  private variantTexture(index: number) {
    const normalized = ((index % STAR_VARIANTS) + STAR_VARIANTS) % STAR_VARIANTS;
    const cached = this.atlasVariants.get(normalized);
    if (cached) return cached;
    const col = normalized % ATLAS_COLS;
    const row = Math.floor(normalized / ATLAS_COLS);
    const tex = this.atlas.clone();
    tex.needsUpdate = true;
    tex.repeat.set(1 / ATLAS_COLS, 1 / ATLAS_ROWS);
    tex.offset.set(col / ATLAS_COLS, 1 - (row + 1) / ATLAS_ROWS);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    this.atlasVariants.set(normalized, tex);
    return tex;
  }

  private hashStarId(id: string) {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
    return h;
  }

  setStars(stars: StarRecord[], myStarId: string | null = null) {
    this.stars = stars;
    this.myStarId = myStarId;
    this.rebuildFar();
  }

  private rebuildFar() {
    let idx = 0;
    for (const s of this.stars) {
      if (idx >= 25000) break;
      this.dummy.position.set(s.x, s.y, s.z);
      const hash = this.hashStarId(s.id);
      const naturalScale = 0.78 + (hash % 7) * 0.07;
      this.dummy.scale.setScalar(s.id === this.myStarId ? 1.7 : naturalScale);
      this.dummy.rotation.set((hash % 5) * 0.11, ((hash >> 3) % 7) * 0.09, ((hash >> 6) % 11) * 0.07);
      this.dummy.updateMatrix();
      this.instancedFar.setMatrixAt(idx, this.dummy.matrix);
      const theme = GALAXY_THEMES[s.galaxyId];
      const c = theme ? new THREE.Color(theme.starTint) : new THREE.Color(0xffffff);
      if (s.id === this.myStarId) c.setHex(0xffd76a);
      else c.lerp(new THREE.Color(0xffffff), 0.38);
      this.instancedFar.setColorAt(idx, c);
      idx++;
    }
    this.instancedFar.count = idx;
    this.instancedFar.instanceMatrix.needsUpdate = true;
    if (this.instancedFar.instanceColor) this.instancedFar.instanceColor.needsUpdate = true;
  }

  update(cameraPos: THREE.Vector3, camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
    const { width, height } = renderer.domElement.getBoundingClientRect();
    this.instancedFar.visible = true;
    this.instancedMid.visible = false;
    for (const s of this.stars) {
      const sp = new THREE.Vector3(s.x, s.y, s.z);
      const starDist = cameraPos.distanceTo(sp);
      if (starDist < NEAR_DETAIL_DIST) {
        this.ensureNearMesh(s);
        this.updateLabel(s, sp, camera, width, height, starDist);
      } else {
        this.removeNearMesh(s.id);
        this.updateLabel(s, sp, camera, width, height, starDist);
      }
    }
  }

  private ensureNearMesh(s: StarRecord) {
    if (this.nearMeshes.has(s.id)) return;
    const hash = this.hashStarId(s.id);
    const material = new THREE.SpriteMaterial({
      map: this.variantTexture(hash), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      opacity: s.id === this.myStarId ? 1 : 0.92,
    });
    const star = new THREE.Sprite(material);
    const size = s.id === this.myStarId ? 240 : 145 + (hash % 5) * 14;
    star.scale.set(size, size * 0.72, 1);
    star.position.set(s.x, s.y, s.z);
    star.userData['starId'] = s.id;
    star.renderOrder = 12;
    this.group.add(star);
    this.nearMeshes.set(s.id, star);
  }

  private removeNearMesh(id: string) {
    const mesh = this.nearMeshes.get(id);
    if (!mesh) return;
    this.group.remove(mesh);
    mesh.material.dispose();
    this.nearMeshes.delete(id);
  }

  private updateLabel(s: StarRecord, worldPos: THREE.Vector3, camera: THREE.Camera, width: number, height: number, dist: number) {
    const opacity = 1 - Math.min(1, Math.max(0, (dist - 900) / (3000 - 900)));
    if (opacity < 0.02) {
      const existing = this.labelEls.get(s.id);
      if (existing) existing.style.opacity = '0';
      return;
    }
    let el = this.labelEls.get(s.id);
    if (!el) {
      el = document.createElement('div');
      el.className = 'universe-label star-label';
      el.style.cssText = `position:absolute;top:0;left:0;pointer-events:none;font-family:'Space Grotesk',sans-serif;font-size:clamp(7px,.72vw,9px);letter-spacing:.12em;color:rgba(232,242,255,.82);white-space:nowrap;transform:translate(-50%,-100%);padding-bottom:5px;user-select:none;text-shadow:0 0 10px rgba(180,220,255,.28);`;
      el.textContent = s.displayName;
      this.labelContainer.appendChild(el);
      this.labelEls.set(s.id, el);
    }
    const ndc = worldPos.clone().project(camera);
    if (ndc.z > 1) { el.style.opacity = '0'; return; }
    el.style.opacity = String(opacity * 0.82);
    el.style.left = `${(ndc.x * 0.5 + 0.5) * width}px`;
    el.style.top = `${(-ndc.y * 0.5 + 0.5) * height}px`;
  }

  getClickTarget(raycaster: THREE.Raycaster): { starId: string } | null {
    const hits = raycaster.intersectObjects(Array.from(this.nearMeshes.values()));
    if (hits.length > 0) {
      const id = hits[0].object.userData['starId'];
      return id ? { starId: id } : null;
    }
    const far = raycaster.intersectObject(this.instancedFar);
    if (far.length > 0 && far[0].instanceId !== undefined) {
      const s = this.stars[far[0].instanceId];
      return s ? { starId: s.id } : null;
    }
    return null;
  }

  addStar(star: StarRecord) { this.stars.push(star); this.rebuildFar(); }
  dispose() {
    for (const [, el] of this.labelEls) el.remove();
    this.instancedFar.dispose(); this.instancedMid.dispose();
    for (const [, m] of this.nearMeshes) m.material.dispose();
    for (const [, t] of this.atlasVariants) t.dispose();
    this.atlas.dispose();
  }
}
