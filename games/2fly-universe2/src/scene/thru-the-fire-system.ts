import * as THREE from 'three';
import type { CelestialObjectData } from '../types';
import { GALAXY_THEMES } from '../types';
import { createDecoratedChild } from './decorated-object';

interface FireChild {
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

export class ThruTheFireSystem {
  readonly group: THREE.Group;
  private planetMesh!: THREE.Mesh;
  private emberParticles!: THREE.Points;
  private children: FireChild[] = [];
  private labelContainer: HTMLElement;
  private time = 0;
  private readonly objectData: CelestialObjectData;
  public clickTargets: THREE.Object3D[] = [];

  constructor(objectData: CelestialObjectData, labelContainer: HTMLElement) {
    this.objectData = objectData;
    this.labelContainer = labelContainer;
    this.group = new THREE.Group();

    const [gx, gy, gz] = GALAXY_THEMES['G2025']?.worldOffset ?? [0, 0, 0];
    this.group.position.set(gx + objectData.position.x, gy + objectData.position.y, gz + objectData.position.z);

    this.buildPlanet();
    this.buildEmbers();
    this.buildRecordOrbits();
    this.buildChildren();
  }

  private buildPlanet() {
    const geo = new THREE.SphereGeometry(420, 48, 48);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        crustColor: { value: new THREE.Color(0x180806) },
        moltenColor: { value: new THREE.Color(0xe45b28) },
        emberGlow: { value: new THREE.Color(0xffaa3d) },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPos;
        uniform float time;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPos = position;
          vec3 displaced = position + normal * (
            12.0 * sin(position.y * 0.008 + time * 1.2) *
            cos(position.z * 0.007 + time * 0.8)
          );
          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 crustColor;
        uniform vec3 moltenColor;
        uniform vec3 emberGlow;
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vPos;
        void main() {
          vec3 viewDir = normalize(cameraPosition - vPos);
          float rim = pow(1.0 - max(0.0, dot(vNormal, viewDir)), 2.2);
          float heat = 0.5 + 0.5 * sin(vPos.x * 0.014 + vPos.y * 0.009 + time * 1.1);
          vec3 base = mix(crustColor, moltenColor, heat);
          vec3 finalColor = mix(base, emberGlow, rim * 0.72);
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
    });

    this.planetMesh = new THREE.Mesh(geo, mat);
    this.planetMesh.userData['objectId'] = this.objectData.id;
    this.group.add(this.planetMesh);
    this.clickTargets.push(this.planetMesh);

    const light = new THREE.PointLight(0xe45b28, 1.45, 7200);
    this.group.add(light);
  }

  private buildEmbers() {
    const count = 420;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 520 + Math.random() * 520;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = (Math.random() - 0.5) * 360;
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xff8c3a,
      size: 12,
      transparent: true,
      opacity: 0.46,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.emberParticles = new THREE.Points(geo, mat);
    this.group.add(this.emberParticles);
  }

  private buildRecordOrbits() {
    const radii = [980, 1240, 1520, 1820, 2160, 2520, 2920, 3340];
    for (const r of radii) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(r - 2.2, r + 2.2, 160),
        new THREE.MeshBasicMaterial({
          color: 0xf5f8ff,
          transparent: true,
          opacity: 0.1,
          side: THREE.DoubleSide,
          depthWrite: false,
        })
      );
      ring.rotation.x = -Math.PI / 2;
      this.group.add(ring);
    }
  }

  private buildChildren() {
    const children = this.objectData.children ?? [];
    const radii = [1120, 1680, 2360, 3040];
    const speeds = [0.34, 0.24, 0.17, 0.12];
    const heights = [140, -130, 190, -170];

    children.forEach((child, i) => {
      const mk = child.mediaKind ?? 'archive';
      const dec = createDecoratedChild(child, 76, 0xe45b28, this.objectData.id);
      const angle = (i / children.length) * Math.PI * 2 + 0.35;
      dec.group.position.set(Math.cos(angle) * radii[i], heights[i], Math.sin(angle) * radii[i]);
      dec.clickTarget.userData['childId'] = child.id;
      dec.clickTarget.userData['contentStatus'] = child.contentStatus;
      dec.clickTarget.userData['mediaUrl'] = child.mediaUrl;
      this.group.add(dec.group);
      this.clickTargets.push(dec.clickTarget);

      const el = document.createElement('div');
      el.className = 'universe-label fire-child-label';
      el.style.cssText = `position:absolute;top:0;left:0;pointer-events:none;font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,0.85vw,10px);letter-spacing:.12em;text-transform:uppercase;color:rgba(255,219,198,0);white-space:nowrap;transform:translate(-50%,-130%);user-select:none;text-align:center;line-height:1.35;`;
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
    this.planetMesh.rotation.y += dt * 0.05;
    this.emberParticles.rotation.y += dt * 0.09;

    for (const c of this.children) {
      c.orbitAngle += dt * c.orbitSpeed * 0.65;
      c.mesh.position.set(
        Math.cos(c.orbitAngle) * c.orbitRadius,
        c.orbitY + Math.sin(this.time * 0.8 + c.bobPhase) * 22,
        Math.sin(c.orbitAngle) * c.orbitRadius,
      );
      c.mesh.rotation.y += dt * 0.42;
    }

    this.updateLabels(camera, renderer);
  }

  private updateLabels(camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
    const { width, height } = renderer.domElement.getBoundingClientRect();
    const cameraWorld = new THREE.Vector3();
    camera.getWorldPosition(cameraWorld);
    for (const c of this.children) {
      const worldPos = new THREE.Vector3();
      c.mesh.getWorldPosition(worldPos);
      const dist = cameraWorld.distanceTo(worldPos);
      const opacity = 1 - Math.min(1, Math.max(0, (dist - 1000) / (5200 - 1000)));
      const ndc = worldPos.clone().project(camera);
      const x = (ndc.x * 0.5 + 0.5) * width;
      const y = (-(ndc.y * 0.5) + 0.5) * height;
      if (ndc.z > 1 || opacity < 0.02) c.labelEl.style.opacity = '0';
      else {
        c.labelEl.style.opacity = String(opacity);
        c.labelEl.style.left = `${x}px`;
        c.labelEl.style.top = `${y}px`;
      }
    }
  }

  getChildData(id: string) { return this.children.find(c => c.id === id); }

  dispose() {
    this.children.forEach(c => c.labelEl.remove());
  }
}
