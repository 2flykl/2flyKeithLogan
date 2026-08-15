// Galaxy Scene — per-galaxy visual cluster with regions and labels

import * as THREE from 'three';
import type { GalaxyData } from '../types';
import { GALAXY_THEMES, REGION_OFFSETS } from '../types';

const LABEL_FADE_NEAR = 40000;
const LABEL_FADE_FAR = 120000;
const REGION_LABEL_NEAR = 6000;
const REGION_LABEL_FAR = 18000;

export class GalaxyScene {
  readonly group: THREE.Group;
  private labelEls: { el: HTMLElement; pos: THREE.Vector3; kind: 'galaxy' | 'region' }[] = [];
  private labelContainer: HTMLElement;
  private orbitRings: THREE.Mesh[] = [];
  private galaxyLight!: THREE.PointLight;

  constructor(
    private readonly data: GalaxyData,
    labelContainer: HTMLElement
  ) {
    this.group = new THREE.Group();
    this.labelContainer = labelContainer;
    const theme = GALAXY_THEMES[data.id];
    if (!theme) return;

    const [ox, oy, oz] = theme.worldOffset;
    this.group.position.set(ox, oy, oz);

    this._buildCore(theme);
    this._buildRegionMarkers(theme);
    this._buildLabel();
    this._buildRegionLabels();
  }

  private _buildCore(theme: typeof GALAXY_THEMES[string]) {
    // Galaxy core glow
    const CORE_COUNT = 1200;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(CORE_COUNT * 3);
    const size = new Float32Array(CORE_COUNT);

    for (let i = 0; i < CORE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 1.5) * 7000;
      const y = (Math.random() - 0.5) * 800;
      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(theta) * r;
      size[i] = 20 + Math.random() * 80;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(size, 1));

    const c = new THREE.Color(theme.primaryColor);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: c },
        time: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        uniform float time;
        varying float vAlpha;
        void main() {
          vAlpha = 0.3 + 0.2 * sin(time * 0.5 + position.x * 0.002);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = size * (500.0 / -mv.z);
          gl_PointSize = clamp(gl_PointSize, 0.5, 12.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying float vAlpha;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.0, d) * vAlpha;
          gl_FragColor = vec4(color, a);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const mesh = new THREE.Points(geo, mat);
    this.group.add(mesh);

    // Ambient light for galaxy era
    this.galaxyLight = new THREE.PointLight(theme.primaryColor, 0.6, 20000);
    this.galaxyLight.position.set(0, 0, 0);
    this.group.add(this.galaxyLight);
  }

  private _buildRegionMarkers(theme: typeof GALAXY_THEMES[string]) {
    // Faint orbit rings at region positions
    for (const rOff of REGION_OFFSETS) {
      const geo = new THREE.RingGeometry(600, 650, 64);
      const mat = new THREE.MeshBasicMaterial({
        color: theme.accentColor,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(rOff[0], rOff[1], rOff[2]);
      mesh.rotation.x = -Math.PI / 2;
      this.orbitRings.push(mesh);
      this.group.add(mesh);
    }
  }

  private _buildLabel() {
    const el = document.createElement('div');
    el.className = 'universe-label galaxy-label';
    el.dataset.galaxyId = this.data.id;
    el.innerHTML = `<span class="label-era">${this.data.title}</span>`;
    el.style.cssText = `
      position:absolute; top:0; left:0;
      pointer-events:none;
      font-family:'Space Mono',monospace;
      font-size:clamp(9px,1.2vw,13px);
      letter-spacing:0.18em;
      text-transform:uppercase;
      color:rgba(200,220,255,0);
      white-space:nowrap;
      transform:translate(-50%,-50%);
      transition:color 0.3s;
      user-select:none;
    `;
    this.labelContainer.appendChild(el);

    const worldPos = new THREE.Vector3(0, 1500, 0); // above galaxy core in local space
    this.labelEls.push({ el, pos: worldPos, kind: 'galaxy' });
  }

  private _buildRegionLabels() {
    const regions = this.data.regions;
    for (let i = 0; i < regions.length; i++) {
      const r = regions[i];
      const rOff = REGION_OFFSETS[i] ?? [0, 0, 0];
      const el = document.createElement('div');
      el.className = 'universe-label region-label';
      el.dataset.regionId = r.id;
      el.innerHTML = `<span>${r.title}</span>`;
      el.style.cssText = `
        position:absolute; top:0; left:0;
        pointer-events:none;
        font-family:'Space Grotesk',sans-serif;
        font-size:clamp(8px,0.9vw,11px);
        letter-spacing:0.12em;
        text-transform:uppercase;
        color:rgba(180,200,240,0);
        white-space:nowrap;
        transform:translate(-50%,-50%);
        transition:color 0.3s;
        user-select:none;
      `;
      this.labelContainer.appendChild(el);
      const wp = new THREE.Vector3(rOff[0], rOff[1] + 700, rOff[2]);
      this.labelEls.push({ el, pos: wp, kind: 'region' });
    }
  }

  updateLabels(
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer,
    cameraWorldPos: THREE.Vector3
  ) {
    const { width, height } = renderer.domElement.getBoundingClientRect();

    for (const { el, pos, kind } of this.labelEls) {
      // World position = group position + local pos
      const worldPos = new THREE.Vector3().copy(pos);
      this.group.localToWorld(worldPos);

      const dist = cameraWorldPos.distanceTo(worldPos);

      let opacity = 0;
      if (kind === 'galaxy') {
        opacity = smoothFade(dist, LABEL_FADE_FAR, LABEL_FADE_NEAR);
      } else {
        opacity = smoothFade(dist, REGION_LABEL_FAR, REGION_LABEL_NEAR);
      }

      // Project to screen
      const ndc = worldPos.clone().project(camera);
      const x = (ndc.x * 0.5 + 0.5) * width;
      const y = (-(ndc.y * 0.5) + 0.5) * height;

      if (ndc.z > 1 || opacity < 0.02) {
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
      } else {
        el.style.opacity = String(opacity);
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
      }
    }
  }

  update(time: number) {
    // Pulse orbit rings
    for (const ring of this.orbitRings) {
      const mat = ring.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.08 + 0.06 * Math.sin(time * 0.4);
    }
  }

  dispose() {
    for (const { el } of this.labelEls) el.remove();
  }
}

function smoothFade(dist: number, far: number, near: number): number {
  if (dist >= far) return 0;
  if (dist <= near) return 1;
  return 1 - (dist - near) / (far - near);
}
