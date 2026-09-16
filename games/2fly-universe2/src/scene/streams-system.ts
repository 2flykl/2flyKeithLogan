import * as THREE from 'three';
import type { CelestialObjectData } from '../types';
import { GALAXY_THEMES } from '../types';
import { createDecoratedChild } from './decorated-object';

interface OrbitChild {
  id: string;
  title: string;
  mediaKind: string;
  contentStatus: string;
  mesh: THREE.Object3D;
  orbitRadius: number;
  orbitSpeed: number;
  orbitAngle: number;
  orbitY: number;
  bobPhase: number;
  labelEl: HTMLElement;
}

export class StreamsSystem {
  readonly group: THREE.Group;
  private planetMesh!: THREE.Mesh;
  private children: OrbitChild[] = [];
  private labelContainer: HTMLElement;
  private time = 0;
  private readonly objectData: CelestialObjectData;
  public onObjectClick: ((childId: string) => void) | null = null;
  public clickTargets: THREE.Object3D[] = [];

  constructor(objectData: CelestialObjectData, labelContainer: HTMLElement) {
    this.objectData = objectData;
    this.labelContainer = labelContainer;
    this.group = new THREE.Group();
    const theme = GALAXY_THEMES['G2025'];
    const [gx, gy, gz] = theme?.worldOffset ?? [0, 0, 0];
    this.group.position.set(gx + objectData.position.x, gy + objectData.position.y, gz + objectData.position.z);
    this.buildPlanet();
    this.buildRecordOrbits();
    this.buildChildren();
  }

  private buildPlanet() {
    const geo = new THREE.SphereGeometry(390, 48, 48);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        deepColor: { value: new THREE.Color(0x0b1218) },
        shallowColor: { value: new THREE.Color(0x6f5238) },
        rimColor: { value: new THREE.Color(0xd7b38b) },
      },
      vertexShader: `
        varying vec3 vNormal; varying vec3 vPos; uniform float time;
        void main(){
          vNormal = normalize(normalMatrix * normal); vPos = position;
          vec3 displaced = position + normal * (12.0 * sin(position.y * 0.008 + time * 0.9) * cos(position.x * 0.006 + time * 0.55));
          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced,1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 deepColor; uniform vec3 shallowColor; uniform vec3 rimColor; uniform float time;
        varying vec3 vNormal; varying vec3 vPos;
        void main(){
          vec3 viewDir = normalize(cameraPosition - vPos);
          float rim = pow(1.0 - max(0.0, dot(vNormal, viewDir)), 2.4);
          float wave = 0.5 + 0.5 * sin(vPos.y * 0.012 + vPos.x * 0.008 + time * 0.75);
          vec3 base = mix(deepColor, shallowColor, wave);
          gl_FragColor = vec4(mix(base, rimColor, rim * 0.55),1.0);
        }
      `,
    });
    this.planetMesh = new THREE.Mesh(geo, mat);
    this.planetMesh.userData['objectId'] = this.objectData.id;
    this.group.add(this.planetMesh);
    this.clickTargets.push(this.planetMesh);

    this.group.add(new THREE.PointLight(0xd1a06e, 1.1, 5600));
  }

  private buildRecordOrbits() {
    const radii = [920, 1220, 1560, 1940, 2360, 2800];
    radii.forEach(r => {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(r - 2, r + 2, 160),
        new THREE.MeshBasicMaterial({ color: 0xf3f7ff, transparent: true, opacity: 0.095, side: THREE.DoubleSide, depthWrite: false })
      );
      ring.rotation.x = -Math.PI / 2;
      this.group.add(ring);
    });
  }

  private buildChildren() {
    const children = this.objectData.children ?? [];
    const radii = [1040, 1560, 2200, 2860];
    const speeds = [0.3, 0.2, 0.15, 0.11];
    const heights = [120, -100, 160, -150];

    children.forEach((child, i) => {
      const angle = (i / children.length) * Math.PI * 2 + 0.6;
      const mk = child.mediaKind ?? 'archive';
      const dec = createDecoratedChild(child, 74, 0xd7b38b, this.objectData.id);
      dec.group.position.set(Math.cos(angle) * radii[i], heights[i], Math.sin(angle) * radii[i]);
      dec.clickTarget.userData['childId'] = child.id;
      dec.clickTarget.userData['contentStatus'] = child.contentStatus;
      dec.clickTarget.userData['mediaUrl'] = child.mediaUrl;
      this.group.add(dec.group);
      this.clickTargets.push(dec.clickTarget);

      const el = document.createElement('div');
      el.className = 'universe-label streams-child-label';
      el.style.cssText = `position:absolute;top:0;left:0;pointer-events:none;font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,0.85vw,10px);letter-spacing:.12em;text-transform:uppercase;color:rgba(227,232,240,0);white-space:nowrap;transform:translate(-50%,-130%);user-select:none;text-align:center;line-height:1.35;`;
      const icon = mk === 'playable' ? 'PLAY' : mk === 'audio' ? 'AUDIO' : mk === 'video' ? 'VIDEO' : 'ARCHIVE';
      el.innerHTML = `<span>${icon}</span><br/><span>${child.title}</span>`;
      this.labelContainer.appendChild(el);

      this.children.push({
        id: child.id,
        title: child.title,
        mediaKind: mk,
        contentStatus: child.contentStatus ?? 'live',
        mesh: dec.group,
        orbitRadius: radii[i],
        orbitSpeed: speeds[i],
        orbitAngle: angle,
        orbitY: heights[i],
        bobPhase: Math.random() * Math.PI * 2,
        labelEl: el,
      });
    });
  }

  update(dt: number, camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
    this.time += dt;
    (this.planetMesh.material as THREE.ShaderMaterial).uniforms['time'].value = this.time;
    this.planetMesh.rotation.y += dt * 0.04;
    for (const child of this.children) {
      child.orbitAngle += dt * child.orbitSpeed * 0.62;
      child.mesh.position.set(
        Math.cos(child.orbitAngle) * child.orbitRadius,
        child.orbitY + Math.sin(this.time * 0.75 + child.bobPhase) * 20,
        Math.sin(child.orbitAngle) * child.orbitRadius,
      );
      child.mesh.rotation.y += dt * 0.35;
    }
    this.updateLabels(camera, renderer);
  }

  private updateLabels(camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
    const { width, height } = renderer.domElement.getBoundingClientRect();
    const cameraWorld = new THREE.Vector3();
    camera.getWorldPosition(cameraWorld);
    for (const child of this.children) {
      const worldPos = new THREE.Vector3();
      child.mesh.getWorldPosition(worldPos);
      const dist = cameraWorld.distanceTo(worldPos);
      const opacity = 1 - Math.min(1, Math.max(0, (dist - 900) / (5000 - 900)));
      const ndc = worldPos.clone().project(camera);
      const x = (ndc.x * 0.5 + 0.5) * width;
      const y = (-(ndc.y * 0.5) + 0.5) * height;
      if (ndc.z > 1 || opacity < 0.02) child.labelEl.style.opacity = '0';
      else {
        child.labelEl.style.opacity = String(opacity);
        child.labelEl.style.left = `${x}px`;
        child.labelEl.style.top = `${y}px`;
      }
    }
  }

  getChildData(childId: string) { return this.children.find(c => c.id === childId); }
  getPlanetWorldPos() { const wp = new THREE.Vector3(); this.planetMesh.getWorldPosition(wp); return wp; }
  dispose() { this.children.forEach(c => c.labelEl.remove()); }
}
