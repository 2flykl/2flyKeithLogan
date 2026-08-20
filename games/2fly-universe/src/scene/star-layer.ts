// Star Layer — InstancedMesh for 20k+ visitor stars with LOD and spatial grid

import * as THREE from 'three';
import type { StarRecord } from '../types';
import { GALAXY_THEMES } from '../types';

const NEAR_DETAIL_DIST = 3000;
const MID_DETAIL_DIST = 12000;
const FAR_DETAIL_DIST = 60000;

export class StarLayer {
  readonly group: THREE.Group;

  // LOD meshes
  private instancedFar!: THREE.InstancedMesh;
  private instancedMid!: THREE.InstancedMesh;
  private nearMeshes: Map<string, THREE.Mesh> = new Map();

  private stars: StarRecord[] = [];
  private readonly dummy = new THREE.Object3D();
  private labelContainer: HTMLElement;
  private labelEls: Map<string, HTMLElement> = new Map();
  private myStarId: string | null = null;

  constructor(labelContainer: HTMLElement) {
    this.group = new THREE.Group();
    this.labelContainer = labelContainer;
    this._buildFarInstanced();
    this._buildMidInstanced();
  }

  private _buildFarInstanced() {
    const geo = new THREE.SphereGeometry(30, 4, 4);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
    });
    this.instancedFar = new THREE.InstancedMesh(geo, mat, 25000);
    this.instancedFar.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.instancedFar.count = 0;
    this.group.add(this.instancedFar);
  }

  private _buildMidInstanced() {
    const geo = new THREE.SphereGeometry(60, 6, 6);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.instancedMid = new THREE.InstancedMesh(geo, mat, 25000);
    this.instancedMid.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.instancedMid.count = 0;
    this.instancedMid.visible = false;
    this.group.add(this.instancedMid);
  }

  setStars(stars: StarRecord[], myStarId: string | null = null) {
    this.stars = stars;
    this.myStarId = myStarId;
    this._rebuildFar();
  }

  private _rebuildFar() {
    const color = new THREE.Color();
    let idx = 0;

    for (const s of this.stars) {
      if (idx >= 25000) break;
      this.dummy.position.set(s.x, s.y, s.z);
      this.dummy.scale.setScalar(s.id === this.myStarId ? 1.8 : 1.0);
      this.dummy.updateMatrix();
      this.instancedFar.setMatrixAt(idx, this.dummy.matrix);

      // Tint by galaxy
      const theme = GALAXY_THEMES[s.galaxyId];
      const c = theme ? new THREE.Color(theme.starTint) : color.set(0xffffff);
      if (s.id === this.myStarId) c.setHex(0xffd700); // gold for own star
      this.instancedFar.setColorAt(idx, c);
      idx++;
    }

    this.instancedFar.count = idx;
    this.instancedFar.instanceMatrix.needsUpdate = true;
    if (this.instancedFar.instanceColor) {
      this.instancedFar.instanceColor.needsUpdate = true;
    }
  }

  update(cameraPos: THREE.Vector3, camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
    const { width, height } = renderer.domElement.getBoundingClientRect();
    const dist = cameraPos.length(); // distance from world origin

    // Toggle LOD layers
    this.instancedFar.visible = true;
    this.instancedMid.visible = false;

    // Manage near-detail meshes and labels
    for (const s of this.stars) {
      const sp = new THREE.Vector3(s.x, s.y, s.z);
      const starDist = cameraPos.distanceTo(sp);

      if (starDist < NEAR_DETAIL_DIST) {
        this._ensureNearMesh(s);
        this._updateLabel(s, sp, camera, width, height, starDist);
      } else {
        this._removeNearMesh(s.id);
        this._updateLabel(s, sp, camera, width, height, starDist);
      }
    }

    // Hide labels at universe scale
    // Labels are managed per-star above.
  }

  private _ensureNearMesh(s: StarRecord) {
    if (this.nearMeshes.has(s.id)) return;
    const geo = new THREE.SphereGeometry(80, 12, 12);
    const theme = GALAXY_THEMES[s.galaxyId];
    const color = theme ? theme.starTint : 0xffffff;
    const mat = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.4,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(s.x, s.y, s.z);
    mesh.userData['starId'] = s.id;
    this.group.add(mesh);
    this.nearMeshes.set(s.id, mesh);
  }

  private _removeNearMesh(id: string) {
    const mesh = this.nearMeshes.get(id);
    if (!mesh) return;
    this.group.remove(mesh);
    (mesh.material as THREE.Material).dispose();
    mesh.geometry.dispose();
    this.nearMeshes.delete(id);
  }

  private _updateLabel(
    s: StarRecord,
    worldPos: THREE.Vector3,
    camera: THREE.Camera,
    width: number,
    height: number,
    dist: number
  ) {
    const LABEL_NEAR = 1200;
    const LABEL_FAR = 4000;
    const opacity = 1 - Math.min(1, Math.max(0, (dist - LABEL_NEAR) / (LABEL_FAR - LABEL_NEAR)));

    if (opacity < 0.02) {
      const el = this.labelEls.get(s.id);
      if (el) el.style.opacity = '0';
      return;
    }

    let el = this.labelEls.get(s.id);
    if (!el) {
      el = document.createElement('div');
      el.className = 'universe-label star-label';
      el.style.cssText = `
        position:absolute;top:0;left:0;
        pointer-events:none;
        font-family:'Space Grotesk',sans-serif;
        font-size:clamp(7px,0.75vw,10px);
        letter-spacing:0.1em;
        color:#e0eeff;
        white-space:nowrap;
        transform:translate(-50%,-100%);
        padding-bottom:4px;
        user-select:none;
      `;
      el.textContent = s.displayName;
      this.labelContainer.appendChild(el);
      this.labelEls.set(s.id, el);
    }

    const ndc = worldPos.clone().project(camera);
    const x = (ndc.x * 0.5 + 0.5) * width;
    const y = (-(ndc.y * 0.5) + 0.5) * height;

    if (ndc.z > 1) {
      el.style.opacity = '0';
    } else {
      el.style.opacity = String(opacity);
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    }
  }

  getClickTarget(raycaster: THREE.Raycaster): { starId: string } | null {
    // Check near meshes first
    const nearArr = Array.from(this.nearMeshes.values());
    const hits = raycaster.intersectObjects(nearArr);
    if (hits.length > 0) {
      const id = hits[0].object.userData['starId'] as string;
      return id ? { starId: id } : null;
    }
    // Check instanced
    const hit = raycaster.intersectObject(this.instancedFar);
    if (hit.length > 0 && hit[0].instanceId !== undefined) {
      const s = this.stars[hit[0].instanceId];
      return s ? { starId: s.id } : null;
    }
    return null;
  }

  addStar(star: StarRecord) {
    this.stars.push(star);
    this._rebuildFar();
  }

  dispose() {
    for (const [, el] of this.labelEls) el.remove();
    this.instancedFar.dispose();
    this.instancedMid.dispose();
    for (const [, m] of this.nearMeshes) {
      m.geometry.dispose();
      (m.material as THREE.Material).dispose();
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let _: unknown;
