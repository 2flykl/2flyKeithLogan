// Galaxy Scene — Phase II Visual Sprites, 3D Particle Arms & Camera-Facing Labels
import * as THREE from 'three';
import { GALAXY_THEMES, REGION_OFFSETS } from '../types.js';
const textureLoader = new THREE.TextureLoader();
const LABEL_FADE_NEAR = 30000;
const LABEL_FADE_FAR = 150000;
const REGION_LABEL_NEAR = 6000;
const REGION_LABEL_FAR = 22000;
export class GalaxyScene {
    data;
    group;
    labelEls = [];
    labelContainer;
    orbitRings = [];
    galaxySprite;
    galaxyLight;
    coreMaterial;
    spiralMaterial;
    spiralGroup = new THREE.Group();
    haloSprites = [];
    spriteBaseOpacity = 0.85;
    constructor(data, labelContainer) {
        this.data = data;
        this.group = new THREE.Group();
        this.labelContainer = labelContainer;
        const theme = GALAXY_THEMES[data.id];
        if (!theme)
            return;
        const [ox, oy, oz] = theme.worldOffset;
        this.group.position.set(ox, oy, oz);
        this.group.scale.setScalar(theme.scale ?? 1.0);
        this._buildSprite(theme);
        this._buildDepthHalos(theme);
        this._buildSpiralVolume(theme);
        this._buildCore(theme);
        this._buildRegionMarkers(theme);
        this._buildLabel();
        this._buildRegionLabels();
    }
    _buildSprite(theme) {
        textureLoader.load(theme.texturePath, (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            const startingOpacity = theme.status === 'uncharted' ? 0.16 : 0.24;
            this.spriteBaseOpacity = startingOpacity;
            const mat = new THREE.SpriteMaterial({
                map: texture,
                transparent: true,
                opacity: startingOpacity,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            });
            const sprite = new THREE.Sprite(mat);
            const size = theme.status === 'showcase' ? 16000 : 12000;
            sprite.scale.set(size, size, 1);
            sprite.position.set(0, 0, 0);
            sprite.renderOrder = -5;
            this.group.add(sprite);
            this.galaxySprite = sprite;
        }, undefined, () => {
            // Fallback gracefully if texture path is unavailable
        });
    }
    _buildDepthHalos(theme) {
        const haloByGalaxy = {
            G2000: 'assets/galaxy_fx/galaxy_halo_gold.png',
            G2005: 'assets/galaxy_fx/galaxy_halo_crimson.png',
            G2010: 'assets/galaxy_fx/galaxy_halo_violet.png',
            G2015: 'assets/galaxy_fx/galaxy_halo_violet.png',
            G2020: 'assets/galaxy_fx/galaxy_halo_teal.png',
            G2025: 'assets/galaxy_fx/galaxy_halo_neon.png',
            G2030: 'assets/galaxy_fx/galaxy_halo_violet.png',
        };
        const path = haloByGalaxy[this.data.id];
        if (!path)
            return;
        textureLoader.load(path, texture => {
            texture.colorSpace = THREE.SRGBColorSpace;
            const layers = this.data.id === 'G2025' ? 4 : 3;
            for (let i = 0; i < layers; i++) {
                const mat = new THREE.SpriteMaterial({
                    map: texture, transparent: true, depthWrite: false,
                    blending: THREE.AdditiveBlending, opacity: 0.07 + i * 0.025,
                    color: i % 2 ? theme.accentColor : theme.primaryColor,
                });
                const sprite = new THREE.Sprite(mat);
                const size = (this.data.id === 'G2025' ? 15000 : 11800) * (1 + i * 0.18);
                sprite.scale.set(size, size * (0.78 + i * 0.04), 1);
                sprite.position.set((i - 1) * 280, (i - 1) * 120, (i - 1.5) * 720);
                sprite.rotation.z = i * 0.72;
                sprite.renderOrder = -8 + i;
                this.haloSprites.push(sprite);
                this.group.add(sprite);
            }
        });
    }
    /** True 3D spiral volume. This is the visible galaxy body; the PNG is only a faint diffuse accent. */
    _buildSpiralVolume(theme) {
        const isShowcase = theme.status === 'showcase';
        const isUncharted = theme.status === 'uncharted';
        const count = isShowcase ? 7200 : (isUncharted ? 1400 : 4200);
        const arms = isShowcase ? 5 : 4;
        const maxR = isShowcase ? 9800 : 7600;
        const thickness = isShowcase ? 1150 : 850;
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
            if (Math.random() < 0.08)
                c.lerp(white, 0.65);
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        this.spiralMaterial = new THREE.PointsMaterial({
            size: isShowcase ? 62 : 46,
            sizeAttenuation: true,
            transparent: true,
            opacity: isUncharted ? 0.20 : 0.68,
            vertexColors: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        const points = new THREE.Points(geo, this.spiralMaterial);
        points.rotation.x = 0.18;
        this.spiralGroup.add(points);
        // Sparse foreground stars create parallax through the planetary systems.
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
        const dMat = new THREE.PointsMaterial({ color: theme.starTint, size: 20, transparent: true, opacity: 0.20, depthWrite: false, blending: THREE.AdditiveBlending });
        this.spiralGroup.add(new THREE.Points(dGeo, dMat));
        this.group.add(this.spiralGroup);
    }
    _buildCore(theme) {
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
    _buildRegionMarkers(theme) {
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
    _buildLabel() {
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
    _buildRegionLabels() {
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
    updateLabels(camera, renderer, cameraWorldPos) {
        const { width, height } = renderer.domElement.getBoundingClientRect();
        for (const { el, pos, kind } of this.labelEls) {
            const worldPos = new THREE.Vector3().copy(pos);
            this.group.localToWorld(worldPos);
            const dist = cameraWorldPos.distanceTo(worldPos);
            let opacity = 0;
            if (kind === 'galaxy') {
                opacity = smoothFade(dist, LABEL_FADE_FAR, LABEL_FADE_NEAR);
            }
            else {
                opacity = smoothFade(dist, REGION_LABEL_FAR, REGION_LABEL_NEAR);
            }
            const ndc = worldPos.clone().project(camera);
            const x = (ndc.x * 0.5 + 0.5) * width;
            const y = (-(ndc.y * 0.5) + 0.5) * height;
            if (ndc.z > 1 || opacity < 0.02) {
                el.style.opacity = '0';
                el.style.pointerEvents = 'none';
            }
            else {
                el.style.opacity = String(opacity);
                el.style.left = `${x}px`;
                el.style.top = `${y}px`;
            }
        }
    }
    update(time, cameraWorldPos) {
        const galaxyWorldPos = this.group.getWorldPosition(new THREE.Vector3());
        const dist = cameraWorldPos.distanceTo(galaxyWorldPos);
        const spriteFade = fadeValue(dist, 12000, 52000, 0.16, 1.0);
        const coreFade = fadeValue(dist, 10000, 46000, 0.22, 1.0);
        const ringFade = fadeValue(dist, 9000, 26000, 0.04, 1.0);
        this.spiralGroup.rotation.y = time * (this.data.id === 'G2025' ? 0.006 : 0.0035);
        this.spiralGroup.rotation.z = Math.sin(time * 0.07) * 0.012;
        this.haloSprites.forEach((sprite, i) => {
            sprite.rotation.z = time * (0.0015 + i * 0.0008) * (i % 2 ? -1 : 1) + i * 0.72;
            const mat = sprite.material;
            mat.opacity = (0.055 + i * 0.022) * spriteFade;
        });
        if (this.galaxySprite) {
            this.galaxySprite.rotation.z = time * 0.004;
            const spriteMat = this.galaxySprite.material;
            spriteMat.opacity = this.spriteBaseOpacity * spriteFade;
        }
        if (this.coreMaterial) {
            this.coreMaterial.uniforms['time'].value = time;
            this.coreMaterial.uniforms['globalAlpha'].value = coreFade;
        }
        for (const ring of this.orbitRings) {
            const mat = ring.material;
            mat.opacity = (0.08 + 0.05 * Math.sin(time * 0.5)) * ringFade;
        }
        const lightIntensity = this.data.id === 'G2025' ? 1.4 : 0.6;
        this.galaxyLight.intensity = lightIntensity * fadeValue(dist, 9000, 42000, 0.35, 1.0);
    }
    dispose() {
        for (const { el } of this.labelEls)
            el.remove();
        this.galaxySprite?.material.dispose();
        this.spiralMaterial?.dispose();
    }
}
function smoothFade(dist, far, near) {
    if (dist >= far)
        return 0;
    if (dist <= near)
        return 1;
    return 1 - (dist - near) / (far - near);
}
function fadeValue(dist, near, far, min, max) {
    if (dist <= near)
        return min;
    if (dist >= far)
        return max;
    const t = (dist - near) / (far - near);
    return min + (max - min) * t;
}
