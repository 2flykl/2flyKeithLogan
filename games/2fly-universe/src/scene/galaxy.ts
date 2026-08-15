// Galaxy Scene — Phase II Visual Sprites, 3D Particle Arms & Camera-Facing Labels

import * as THREE from 'three';
import type { GalaxyData } from '../types';
import { GALAXY_THEMES, REGION_OFFSETS } from '../types';

const textureLoader = new THREE.TextureLoader();

const LABEL_FADE_NEAR = 30000;
const LABEL_FADE_FAR = 150000;
const REGION_LABEL_NEAR = 6000;
const REGION_LABEL_FAR = 22000;

export class GalaxyScene {
  readonly group: THREE.Group;
  private labelEls: { el: HTMLElement; pos: THREE.Vector3; kind: 'galaxy' | 'region' }[] = [];
  private labelContainer: HTMLElement;
  private orbitRings: THREE.Mesh[] = [];
  private galaxySprite?: THREE.Sprite;
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
    this.group.scale.setScalar(theme.scale ?? 1.0);

    this._buildSprite(theme);
    this._buildCore(theme);
    this._buildRegionMarkers(theme);
    this._buildLabel();
    this._buildRegionLabels();
  }

  private _buildSprite(theme: typeof GALAXY_THEMES[string]) {
    textureLoader.load(
      theme.texturePath,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        const mat = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          opacity: theme.status === 'uncharted' ? 0.45 : 0.85,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const sprite = new THREE.Sprite(mat);
        const size = theme.status === 'showcase' ? 14000 : 10000;
        sprite.scale.set(size, size, 1);
        sprite.position.set(0, 0, 0);
        sprite.renderOrder = -5;
        this.group.add(sprite);
        this.galaxySprite = sprite;
      },
      undefined,
      () => {
        // Fallback gracefully if texture path is unavailable
      }
    );
  }

  private _buildCore(theme: typeof GALAXY_THEMES[string]) {
    const isShowcase = theme.status === 'showcase';
    const isUncharted = theme.status === 'uncharted';
    const CORE_COUNT = isShowcase ? 2400 : (isUncharted ? 600 : 1200);

    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(CORE_COUNT * 3);
    const size = new Float32Array(CORE_COUNT);

    const radiusMax = isShowcase ? 9000 : 7000;

    for (let i = 0; i < CORE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = Math.pow(Math.random(), 1.4) * radiusMax;
      const y = (Math.random() - 0.5) * 900;
      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(theta) * r;
      size[i] = (isShowcase ? 25 : 16) + Math.random() * 80;
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
          vAlpha = 0.35 + 0.25 * sin(time * 0.5 + position.x * 0.002);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = size * (550.0 / -mv.z);
          gl_PointSize = clamp(gl_PointSize, 0.5, 14.0);
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

    this.galaxyLight = new THREE.PointLight(theme.primaryColor, isShowcase ? 1.4 : 0.6, 25000);
    this.galaxyLight.position.set(0, 0, 0);
    this.group.add(this.galaxyLight);
  }

  private _buildRegionMarkers(theme: typeof GALAXY_THEMES[string]) {
    for (const rOff of REGION_OFFSETS) {
      const geo = new THREE.RingGeometry(650, 720, 64);
      const mat = new THREE.MeshBasicMaterial({
        color: theme.accentColor,
        transparent: true,
        opacity: 0.15,
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
    const theme = GALAXY_THEMES[this.data.id];
    const isShowcase = theme?.status === 'showcase';
    const isUncharted = theme?.status === 'uncharted';

    const el = document.createElement('div');
    el.className = 'universe-label galaxy-label';
    el.dataset['galaxyId'] = this.data.id;
    el.innerHTML = `
      <span class="label-era" style="${isShowcase ? 'color:#60ffd0;font-weight:bold;' : (isUncharted ? 'color:#6080a0;' : '')}">
        ${isShowcase ? '✦ ' : ''}${this.data.title}${isUncharted ? ' — UNCHARTED' : ''}
      </span>
    `;
    el.style.cssText = `
      position:absolute; top:0; left:0;
      pointer-events:none;
      font-family:'Space Mono',monospace;
      font-size:clamp(10px,1.3vw,14px);
      letter-spacing:0.18em;
      text-transform:uppercase;
      color:rgba(200,220,255,0);
      white-space:nowrap;
      transform:translate(-50%,-50%);
      transition:color 0.3s;
      user-select:none;
    `;
    this.labelContainer.appendChild(el);

    const worldPos = new THREE.Vector3(0, 1800, 0);
    this.labelEls.push({ el, pos: worldPos, kind: 'galaxy' });
  }

  private _buildRegionLabels() {
    const regions = this.data.regions;
    for (let i = 0; i < regions.length; i++) {
      const r = regions[i];
      const rOff = REGION_OFFSETS[i] ?? [0, 0, 0];
      const el = document.createElement('div');
      el.className = 'universe-label region-label';
      el.dataset['regionId'] = r.id;
      el.innerHTML = `
        <span style="font-weight:600;color:#c0e0ff;">${r.title}</span>
        ${r.subtitle ? `<br/><span style="font-size:0.8em;opacity:0.7;font-weight:normal;">${r.subtitle}</span>` : ''}
      `;
      el.style.cssText = `
        position:absolute; top:0; left:0;
        pointer-events:none;
        font-family:'Space Grotesk',sans-serif;
        font-size:clamp(8px,0.95vw,11px);
        letter-spacing:0.12em;
        text-transform:uppercase;
        color:rgba(180,200,240,0);
        white-space:nowrap;
        transform:translate(-50%,-50%);
        transition:color 0.3s;
        user-select:none;
        text-align:center;
      `;
      this.labelContainer.appendChild(el);
      const wp = new THREE.Vector3(rOff[0], rOff[1] + 750, rOff[2]);
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
      const worldPos = new THREE.Vector3().copy(pos);
      this.group.localToWorld(worldPos);

      const dist = cameraWorldPos.distanceTo(worldPos);

      let opacity = 0;
      if (kind === 'galaxy') {
        opacity = smoothFade(dist, LABEL_FADE_FAR, LABEL_FADE_NEAR);
      } else {
        opacity = smoothFade(dist, REGION_LABEL_FAR, REGION_LABEL_NEAR);
      }

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
    if (this.galaxySprite) {
      this.galaxySprite.rotation.z = time * 0.015;
    }
    for (const ring of this.orbitRings) {
      const mat = ring.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.1 + 0.08 * Math.sin(time * 0.5);
    }
  }

  dispose() {
    for (const { el } of this.labelEls) el.remove();
    this.galaxySprite?.material.dispose();
  }
}

function smoothFade(dist: number, far: number, near: number): number {
  if (dist >= far) return 0;
  if (dist <= near) return 1;
  return 1 - (dist - near) / (far - near);
}
