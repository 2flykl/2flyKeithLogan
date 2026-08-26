// Galaxy Scene — atmospheric galaxy plates, volumetric spiral arms, threshold-aware shells, parallax labels

import * as THREE from 'three';
import type { GalaxyData } from '../types';
import { GALAXY_THEMES, REGION_OFFSETS } from '../types';

const textureLoader = new THREE.TextureLoader();

const LABEL_FADE_NEAR = 30000;
const LABEL_FADE_FAR = 150000;
const REGION_LABEL_NEAR = 6000;
const REGION_LABEL_FAR = 22000;

interface ThresholdEventDetail {
  galaxyId: string;
  title: string;
  state: 'enter' | 'exit';
  primaryColor: number;
  accentColor: number;
}

export class GalaxyScene {
  readonly group: THREE.Group;
  private labelEls: { el: HTMLElement; pos: THREE.Vector3; kind: 'galaxy' | 'region' }[] = [];
  private labelContainer: HTMLElement;
  private orbitRings: THREE.Mesh[] = [];
  private galaxyOrb?: THREE.Mesh;
  private innerMist?: THREE.Mesh;
  private galaxyHalo?: THREE.Mesh;
  private galaxyLight!: THREE.PointLight;
  private coreMaterial?: THREE.ShaderMaterial;
  private spiralMaterial?: THREE.PointsMaterial;
  private shellMaterial?: THREE.ShaderMaterial;
  private mistMaterial?: THREE.ShaderMaterial;
  private haloMaterial?: THREE.ShaderMaterial;
  private spiralGroup = new THREE.Group();
  private shellBaseOpacity = 0.72;
  private haloBaseOpacity = 0.18;
  private mistBaseOpacity = 0.2;
  private orbRadius = 5200;
  private ledPivots: { pivot: THREE.Group; node: THREE.Mesh; speed: number }[] = [];
  private thresholdState = false;

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

    this._buildOrbShell(theme);
    this._buildSpiralVolume(theme);
    this._buildCore(theme);
    this._buildRegionMarkers(theme);
    this._buildLabel();
    this._buildRegionLabels();
    this._buildThresholdBeacons(theme);
  }

  private _buildOrbShell(theme: typeof GALAXY_THEMES[string]) {
    const isShowcase = theme.status === 'showcase';
    const isUncharted = theme.status === 'uncharted';
    this.orbRadius = isShowcase ? 6200 : isUncharted ? 4400 : 5200;
    this.shellBaseOpacity = isUncharted ? 0.48 : isShowcase ? 0.64 : 0.56;
    this.mistBaseOpacity = isUncharted ? 0.11 : isShowcase ? 0.22 : 0.16;
    this.haloBaseOpacity = isUncharted ? 0.12 : isShowcase ? 0.24 : 0.16;

    const buildShells = (texture?: THREE.Texture) => {
      if (texture) {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 8;
      }

      const orbGeo = new THREE.SphereGeometry(this.orbRadius, 72, 72);
      const shellMat = new THREE.ShaderMaterial({
        uniforms: {
          mapTex: { value: texture ?? null },
          opacity: { value: this.shellBaseOpacity },
          accent: { value: new THREE.Color(theme.accentColor) },
          primary: { value: new THREE.Color(theme.primaryColor) },
          time: { value: 0 },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vWorldPos;
          varying vec3 vLocalPos;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vLocalPos = position;
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vWorldPos = worldPos.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `,
        fragmentShader: `
          uniform sampler2D mapTex;
          uniform float opacity;
          uniform vec3 accent;
          uniform vec3 primary;
          uniform float time;
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vWorldPos;
          varying vec3 vLocalPos;
          void main() {
            vec3 viewDir = normalize(cameraPosition - vWorldPos);
            float fresnel = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 2.0);
            vec3 texColor = texture2D(mapTex, vUv).rgb;
            float luma = dot(texColor, vec3(0.299, 0.587, 0.114));
            float swirl1 = 0.5 + 0.5 * sin(vUv.y * 28.0 + time * 0.20 + vUv.x * 8.0);
            float swirl2 = 0.5 + 0.5 * sin(length(vLocalPos.xz) * 0.0016 - time * 0.12 + vUv.y * 11.0);
            float band = mix(swirl1, swirl2, 0.5);
            float cloud = smoothstep(0.18, 0.95, band * 0.8 + fresnel * 0.45 + luma * 0.30);
            vec3 mixed = mix(primary, texColor, 0.72);
            mixed = mix(mixed, accent, fresnel * 0.36 + cloud * 0.1);
            float alpha = opacity * (0.05 + 0.24 * luma + 0.34 * fresnel + 0.22 * cloud);
            gl_FragColor = vec4(mixed, clamp(alpha, 0.0, 0.95));
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      const orb = new THREE.Mesh(orbGeo, shellMat);
      orb.rotation.x = 0.14;
      orb.rotation.z = 0.08;
      this.group.add(orb);
      this.galaxyOrb = orb;
      this.shellMaterial = shellMat;

      const mistGeo = new THREE.SphereGeometry(this.orbRadius * 0.96, 48, 48);
      const mistMat = new THREE.ShaderMaterial({
        uniforms: {
          mapTex: { value: texture ?? null },
          opacity: { value: this.mistBaseOpacity },
          accent: { value: new THREE.Color(theme.accentColor) },
          time: { value: 0 },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vWorldPos;
          varying vec3 vNormal;
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vWorldPos = worldPos.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `,
        fragmentShader: `
          uniform sampler2D mapTex;
          uniform float opacity;
          uniform vec3 accent;
          uniform float time;
          varying vec2 vUv;
          varying vec3 vWorldPos;
          varying vec3 vNormal;
          void main() {
            vec3 viewDir = normalize(cameraPosition - vWorldPos);
            float fresnel = pow(max(dot(normalize(vNormal), viewDir), 0.0), 0.75);
            vec3 texColor = texture2D(mapTex, vUv).rgb;
            float drift = 0.5 + 0.5 * sin(vUv.x * 18.0 - time * 0.18 + vUv.y * 14.0);
            float alpha = opacity * (0.28 + 0.30 * drift + 0.18 * fresnel);
            vec3 outColor = mix(texColor, accent, 0.20 + 0.20 * drift);
            gl_FragColor = vec4(outColor, clamp(alpha, 0.0, 0.75));
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      });
      const mist = new THREE.Mesh(mistGeo, mistMat);
      mist.rotation.y = 0.3;
      this.group.add(mist);
      this.innerMist = mist;
      this.mistMaterial = mistMat;

      const haloGeo = new THREE.SphereGeometry(this.orbRadius * 1.055, 56, 56);
      const haloMat = new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(theme.accentColor) },
          opacity: { value: this.haloBaseOpacity },
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vViewDir;
          void main() {
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vNormal = normalize(normalMatrix * normal);
            vViewDir = normalize(cameraPosition - worldPos.xyz);
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          uniform float opacity;
          varying vec3 vNormal;
          varying vec3 vViewDir;
          void main() {
            float fresnel = pow(1.0 - max(dot(normalize(vNormal), normalize(vViewDir)), 0.0), 2.4);
            float alpha = fresnel * opacity;
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      this.group.add(halo);
      this.galaxyHalo = halo;
      this.haloMaterial = haloMat;
    };

    textureLoader.load(
      theme.texturePath,
      (texture: THREE.Texture) => buildShells(texture),
      undefined,
      () => buildShells(undefined)
    );
  }

  /** True 3D spiral volume. The shell is atmospheric; the galaxy body remains volumetric. */
  private _buildSpiralVolume(theme: typeof GALAXY_THEMES[string]) {
    const isShowcase = theme.status === 'showcase';
    const isUncharted = theme.status === 'uncharted';
    const count = isShowcase ? 7600 : (isUncharted ? 1600 : 4400);
    const arms = isShowcase ? 5 : 4;
    const maxR = isShowcase ? 9800 : 7600;
    const thickness = isShowcase ? 1500 : 980;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const primary = new THREE.Color(theme.primaryColor);
    const accent = new THREE.Color(theme.accentColor);
    const white = new THREE.Color(0xfff1c0);

    for (let i = 0; i < count; i++) {
      const arm = i % arms;
      const r = Math.pow(Math.random(), 0.68) * maxR;
      const armBase = arm * (Math.PI * 2 / arms);
      const angle = armBase + r * 0.00105 + (Math.random() - 0.5) * (0.22 + r / maxR * 0.34);
      const radialNoise = (Math.random() - 0.5) * 520;
      const rr = r + radialNoise;
      positions[i * 3] = Math.cos(angle) * rr;
      positions[i * 3 + 1] = (Math.random() - 0.5) * thickness * (0.25 + 0.75 * r / maxR);
      positions[i * 3 + 2] = Math.sin(angle) * rr;

      const t = THREE.MathUtils.clamp(r / maxR, 0, 1);
      const c = primary.clone().lerp(accent, 0.35 + t * 0.55);
      if (Math.random() < 0.08) c.lerp(white, 0.65);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.spiralMaterial = new THREE.PointsMaterial({
      size: isShowcase ? 64 : 48,
      sizeAttenuation: true,
      transparent: true,
      opacity: isUncharted ? 0.24 : 0.72,
      vertexColors: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geo, this.spiralMaterial);
    points.rotation.x = 0.18;
    this.spiralGroup.add(points);

    const dustCount = isShowcase ? 1000 : 520;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * maxR * 1.08;
      dustPos[i * 3] = Math.cos(a) * r;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * thickness * 2.2;
      dustPos[i * 3 + 2] = Math.sin(a) * r;
    }
    const dGeo = new THREE.BufferGeometry();
    dGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dMat = new THREE.PointsMaterial({
      color: theme.starTint,
      size: 20,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    this.spiralGroup.add(new THREE.Points(dGeo, dMat));
    this.group.add(this.spiralGroup);
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
        globalAlpha: { value: 1.0 },
      },
      vertexShader: `
        attribute float size;
        uniform float time;
        uniform float globalAlpha;
        varying float vAlpha;
        void main() {
          vAlpha = (0.35 + 0.25 * sin(time * 0.5 + position.x * 0.002)) * globalAlpha;
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

    this.coreMaterial = mat;
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

  private _buildThresholdBeacons(theme: typeof GALAXY_THEMES[string]) {
    const beaconCount = theme.status === 'showcase' ? 26 : 18;
    for (let i = 0; i < beaconCount; i++) {
      const pivot = new THREE.Group();
      const t = i / beaconCount;
      const phi = Math.acos(1 - 2 * ((i + 0.5) / beaconCount));
      const theta = t * Math.PI * 2 * 1.618;
      const radius = this.orbRadius * (0.98 + (i % 3) * 0.03);
      const nodeGeo = new THREE.SphereGeometry(65 + (i % 4) * 14, 14, 14);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? theme.accentColor : theme.primaryColor,
        transparent: true,
        opacity: 0.72,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.set(
        Math.sin(phi) * Math.cos(theta) * radius,
        Math.cos(phi) * radius,
        Math.sin(phi) * Math.sin(theta) * radius,
      );
      pivot.add(node);
      this.group.add(pivot);
      this.ledPivots.push({ pivot, node, speed: 0.05 + (i % 5) * 0.013 });
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

  update(time: number, cameraWorldPos: THREE.Vector3) {
    const galaxyWorldPos = this.group.getWorldPosition(new THREE.Vector3());
    const worldRadius = this.orbRadius * this.group.scale.x;
    const dist = cameraWorldPos.distanceTo(galaxyWorldPos);
    const insidePlate = dist <= worldRadius * 1.05;

    if (insidePlate !== this.thresholdState) {
      this.thresholdState = insidePlate;
      const theme = GALAXY_THEMES[this.data.id];
      if (theme) {
        const detail: ThresholdEventDetail = {
          galaxyId: this.data.id,
          title: this.data.title,
          state: insidePlate ? 'enter' : 'exit',
          primaryColor: theme.primaryColor,
          accentColor: theme.accentColor,
        };
        window.dispatchEvent(new CustomEvent<ThresholdEventDetail>('universe-galaxy-threshold', { detail }));
      }
    }

    // As the visitor zooms in, the galaxy plate becomes transparent so inner orbiting content stays readable.
    const shellFade = insidePlate
      ? fadeValue(dist, 0, worldRadius * 1.05, 0.05, 0.18)
      : fadeValue(dist, worldRadius * 1.05, 52000, 0.18, 1.0);
    const mistFade = insidePlate
      ? fadeValue(dist, 0, worldRadius * 1.05, 0.08, 0.32)
      : fadeValue(dist, worldRadius * 1.05, 52000, 0.32, 1.0);
    const haloFade = insidePlate
      ? fadeValue(dist, 0, worldRadius * 1.1, 0.02, 0.14)
      : fadeValue(dist, worldRadius * 1.1, 52000, 0.14, 1.0);
    const coreFade = fadeValue(dist, 10000, 46000, 0.22, 1.0);
    const ringFade = insidePlate ? 0.08 : fadeValue(dist, 9000, 26000, 0.04, 1.0);

    this.spiralGroup.rotation.y = time * (this.data.id === 'G2025' ? 0.0032 : 0.0019);
    this.spiralGroup.rotation.z = Math.sin(time * 0.05) * 0.009;

    if (this.galaxyOrb) {
      this.galaxyOrb.rotation.y = time * 0.0013;
      this.galaxyOrb.rotation.z = Math.sin(time * 0.035) * 0.04;
    }
    if (this.shellMaterial) {
      this.shellMaterial.uniforms['time'].value = time;
      this.shellMaterial.uniforms['opacity'].value = this.shellBaseOpacity * shellFade;
    }

    if (this.innerMist) {
      this.innerMist.rotation.y = -time * 0.0011;
      this.innerMist.rotation.x = Math.sin(time * 0.02) * 0.08;
    }
    if (this.mistMaterial) {
      this.mistMaterial.uniforms['time'].value = time;
      this.mistMaterial.uniforms['opacity'].value = this.mistBaseOpacity * mistFade;
    }

    if (this.galaxyHalo) {
      this.galaxyHalo.rotation.y = -time * 0.0010;
    }
    if (this.haloMaterial) {
      this.haloMaterial.uniforms['opacity'].value = this.haloBaseOpacity * haloFade;
    }

    if (this.coreMaterial) {
      this.coreMaterial.uniforms['time'].value = time;
      this.coreMaterial.uniforms['globalAlpha'].value = coreFade;
    }

    for (const ring of this.orbitRings) {
      const mat = ring.material as THREE.MeshBasicMaterial;
      mat.opacity = (0.08 + 0.05 * Math.sin(time * 0.38)) * ringFade;
    }

    for (const led of this.ledPivots) {
      led.pivot.rotation.y += led.speed * 0.004;
      led.pivot.rotation.x += led.speed * 0.0015;
      const mat = led.node.material as THREE.MeshBasicMaterial;
      mat.opacity = (insidePlate ? 0.22 : 0.62) + 0.12 * Math.sin(time * 0.8 + led.speed * 40);
    }

    const lightIntensity = this.data.id === 'G2025' ? 1.4 : 0.6;
    this.galaxyLight.intensity = lightIntensity * fadeValue(dist, 9000, 42000, insidePlate ? 0.22 : 0.35, 1.0);
  }


  getId(): string {
    return this.data.id;
  }

  distanceTo(worldPos: THREE.Vector3): number {
    const center = this.group.getWorldPosition(new THREE.Vector3());
    return center.distanceTo(worldPos);
  }

  getShellBoundaryRadius(): number {
    return this.orbRadius * this.group.scale.x;
  }

  dispose() {
    for (const { el } of this.labelEls) el.remove();
    this.galaxyOrb?.geometry.dispose();
    this.innerMist?.geometry.dispose();
    this.galaxyHalo?.geometry.dispose();
    this.galaxyOrb?.material.dispose();
    this.innerMist?.material.dispose();
    this.galaxyHalo?.material.dispose();
    this.spiralMaterial?.dispose();
    this.coreMaterial?.dispose();
  }
}

function smoothFade(dist: number, far: number, near: number): number {
  if (dist >= far) return 0;
  if (dist <= near) return 1;
  return 1 - (dist - near) / (far - near);
}

function fadeValue(dist: number, near: number, far: number, min: number, max: number): number {
  if (dist <= near) return min;
  if (dist >= far) return max;
  const t = (dist - near) / (far - near);
  return min + (max - min) * t;
}
