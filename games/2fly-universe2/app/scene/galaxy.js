// Galaxy Scene — volumetric spiral mist made from many tiny particles.
// NO galaxy bubble, NO spherical shell, NO flat galaxy billboard.
import * as THREE from 'three';
import { GALAXY_THEMES, REGION_OFFSETS } from '../types.js';
const LABEL_FADE_NEAR = 30000;
const LABEL_FADE_FAR = 150000;
const REGION_LABEL_NEAR = 6000;
const REGION_LABEL_FAR = 22000;
export class GalaxyScene {
    data;
    labelContainer;
    group = new THREE.Group();
    labelEls = [];
    orbitRings = [];
    gasLayers = [];
    gasMaterials = [];
    ledPivots = [];
    coreMaterial;
    galaxyLight;
    thresholdState = false;
    atmosphereRadius = 9000;
    constructor(data, labelContainer) {
        this.data = data;
        this.labelContainer = labelContainer;
        const theme = GALAXY_THEMES[data.id];
        if (!theme)
            return;
        const [x, y, z] = theme.worldOffset;
        this.group.position.set(x, y, z);
        this.group.scale.setScalar(theme.scale ?? 1);
        this.atmosphereRadius = theme.status === 'showcase' ? 10500 : theme.status === 'uncharted' ? 7600 : 9000;
        this.buildSpiralMist(theme);
        this.buildCore(theme);
        this.buildRegionMarkers(theme);
        this.buildThresholdLeds(theme);
        this.buildLabel();
        this.buildRegionLabels();
    }
    /**
     * The visible galaxy is thousands of tiny independent particles arranged in
     * spiral arms. Together they read as a single gas-like galaxy from far away,
     * while remaining open/traversable when the camera enters it.
     */
    buildSpiralMist(theme) {
        const showcase = theme.status === 'showcase';
        const uncharted = theme.status === 'uncharted';
        const baseCount = showcase ? 8200 : uncharted ? 2800 : 5200;
        const arms = showcase ? 5 : 4;
        const maxRadius = showcase ? 9800 : uncharted ? 6900 : 8200;
        const thickness = showcase ? 1750 : uncharted ? 900 : 1250;
        const primary = new THREE.Color(theme.primaryColor);
        const accent = new THREE.Color(theme.accentColor);
        const starTint = new THREE.Color(theme.starTint);
        const layerScales = [1, 0.55, 0.28];
        const baseOpacity = uncharted ? [0.28, 0.15, 0.08] : [0.72, 0.36, 0.20];
        layerScales.forEach((layerScale, layerIndex) => {
            const count = Math.floor(baseCount * layerScale);
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            const sizes = new Float32Array(count);
            for (let i = 0; i < count; i++) {
                const arm = i % arms;
                const r = Math.pow(Math.random(), 0.66) * maxRadius;
                const angle = arm * (Math.PI * 2 / arms) +
                    r * 0.00105 +
                    (Math.random() - 0.5) * (0.20 + r / maxRadius * 0.42) +
                    (layerIndex - 1) * 0.06;
                const rr = r + (Math.random() - 0.5) * (420 + layerIndex * 180);
                positions[i * 3] = Math.cos(angle) * rr;
                positions[i * 3 + 1] =
                    (Math.random() - 0.5) * thickness * (0.22 + 0.78 * r / maxRadius) +
                        (layerIndex - 1) * 170;
                positions[i * 3 + 2] = Math.sin(angle) * rr;
                const color = primary.clone().lerp(accent, 0.28 + (r / maxRadius) * 0.58);
                if (Math.random() < 0.10)
                    color.lerp(starTint, 0.70);
                colors[i * 3] = color.r;
                colors[i * 3 + 1] = color.g;
                colors[i * 3 + 2] = color.b;
                sizes[i] = (showcase ? 30 : 22) + Math.random() * (layerIndex === 0 ? 64 : 38);
            }
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    globalAlpha: { value: baseOpacity[layerIndex] },
                },
                vertexShader: `
          attribute float size;
          attribute vec3 color;
          uniform float time;
          uniform float globalAlpha;
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vColor = color;
            float pulse = 0.84 + 0.16 * sin(time * 0.45 + position.x * 0.0015 + position.z * 0.001);
            vAlpha = globalAlpha * pulse;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = clamp(size * (620.0 / -mv.z), 0.45, 18.0);
          }
        `,
                fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float d = length(uv);
            if (d > 0.5) discard;
            float soft = smoothstep(0.5, 0.02, d);
            float core = smoothstep(0.18, 0.0, d);
            gl_FragColor = vec4(vColor * (0.78 + core * 0.7), soft * vAlpha);
          }
        `,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
            });
            const points = new THREE.Points(geometry, material);
            points.rotation.x = 0.13 + (layerIndex - 1) * 0.03;
            points.rotation.z = (layerIndex - 1) * 0.025;
            this.group.add(points);
            this.gasLayers.push(points);
            this.gasMaterials.push(material);
        });
    }
    buildCore(theme) {
        const showcase = theme.status === 'showcase';
        const count = showcase ? 1700 : 900;
        const maxRadius = showcase ? 2900 : 2300;
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const r = Math.pow(Math.random(), 1.75) * maxRadius;
            positions[i * 3] = Math.cos(angle) * r;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 460;
            positions[i * 3 + 2] = Math.sin(angle) * r;
            sizes[i] = (showcase ? 34 : 24) + Math.random() * 86;
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        const material = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(theme.starTint) },
                time: { value: 0 },
                globalAlpha: { value: 1 },
            },
            vertexShader: `
        attribute float size;
        uniform float time;
        uniform float globalAlpha;
        varying float vAlpha;
        void main() {
          vAlpha = (0.4 + 0.28 * sin(time * 0.6 + position.x * 0.0018)) * globalAlpha;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = clamp(size * (620.0 / -mv.z), 0.5, 20.0);
        }
      `,
            fragmentShader: `
        uniform vec3 color;
        varying float vAlpha;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          gl_FragColor = vec4(color, smoothstep(0.5, 0.0, d) * vAlpha);
        }
      `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        this.coreMaterial = material;
        this.group.add(new THREE.Points(geometry, material));
        this.galaxyLight = new THREE.PointLight(theme.primaryColor, showcase ? 1.25 : 0.58, 26000);
        this.group.add(this.galaxyLight);
    }
    buildThresholdLeds(theme) {
        const count = theme.status === 'showcase' ? 18 : 12;
        for (let i = 0; i < count; i++) {
            const pivot = new THREE.Group();
            const angle = (i / count) * Math.PI * 2 + (i % 3) * 0.17;
            const radius = this.atmosphereRadius * (0.82 + (i % 4) * 0.045);
            const geometry = new THREE.SphereGeometry(52 + (i % 3) * 16, 12, 10);
            const material = new THREE.MeshBasicMaterial({
                color: i % 2 ? theme.accentColor : theme.starTint,
                transparent: true,
                opacity: 0.62,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
            });
            const node = new THREE.Mesh(geometry, material);
            node.position.set(Math.cos(angle) * radius, Math.sin(angle * 1.7) * this.atmosphereRadius * 0.16, Math.sin(angle) * radius);
            pivot.rotation.x = (i % 5 - 2) * 0.035;
            pivot.add(node);
            this.group.add(pivot);
            this.ledPivots.push({ pivot, node, speed: 0.12 + (i % 4) * 0.035 });
        }
    }
    buildRegionMarkers(theme) {
        for (const offset of REGION_OFFSETS) {
            const geometry = new THREE.RingGeometry(650, 720, 64);
            const material = new THREE.MeshBasicMaterial({
                color: theme.accentColor,
                transparent: true,
                opacity: 0.11,
                side: THREE.DoubleSide,
                depthWrite: false,
            });
            const ring = new THREE.Mesh(geometry, material);
            ring.position.set(offset[0], offset[1], offset[2]);
            ring.rotation.x = -Math.PI / 2;
            this.orbitRings.push(ring);
            this.group.add(ring);
        }
    }
    buildLabel() {
        const theme = GALAXY_THEMES[this.data.id];
        const showcase = theme?.status === 'showcase';
        const uncharted = theme?.status === 'uncharted';
        const el = document.createElement('div');
        el.className = 'universe-label galaxy-label';
        el.dataset.galaxyId = this.data.id;
        el.innerHTML = `<span class="label-era" style="${showcase ? 'color:#60ffd0;font-weight:bold;' : uncharted ? 'color:#6080a0;' : ''}">${showcase ? '✦ ' : ''}${this.data.title}${uncharted ? ' — UNCHARTED' : ''}</span>`;
        el.style.cssText = `position:absolute;top:0;left:0;pointer-events:none;font-family:'Space Mono',monospace;font-size:clamp(10px,1.3vw,14px);letter-spacing:.18em;text-transform:uppercase;white-space:nowrap;transform:translate(-50%,-50%);user-select:none;`;
        this.labelContainer.appendChild(el);
        this.labelEls.push({ el, pos: new THREE.Vector3(0, 1800, 0), kind: 'galaxy' });
    }
    buildRegionLabels() {
        this.data.regions.forEach((region, index) => {
            const offset = REGION_OFFSETS[index] ?? [0, 0, 0];
            const el = document.createElement('div');
            el.className = 'universe-label region-label';
            el.dataset.regionId = region.id;
            el.innerHTML = `<span style="font-weight:600;color:#c0e0ff;">${region.title}</span>${region.subtitle ? `<br/><span style="font-size:.8em;opacity:.7;font-weight:normal;">${region.subtitle}</span>` : ''}`;
            el.style.cssText = `position:absolute;top:0;left:0;pointer-events:none;font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,.95vw,11px);letter-spacing:.12em;text-transform:uppercase;white-space:nowrap;transform:translate(-50%,-50%);user-select:none;text-align:center;`;
            this.labelContainer.appendChild(el);
            this.labelEls.push({ el, pos: new THREE.Vector3(offset[0], offset[1] + 750, offset[2]), kind: 'region' });
        });
    }
    updateLabels(camera, renderer, cameraWorldPos) {
        const { width, height } = renderer.domElement.getBoundingClientRect();
        for (const { el, pos, kind } of this.labelEls) {
            const worldPos = pos.clone();
            this.group.localToWorld(worldPos);
            const dist = cameraWorldPos.distanceTo(worldPos);
            const opacity = kind === 'galaxy'
                ? smoothFade(dist, LABEL_FADE_FAR, LABEL_FADE_NEAR)
                : smoothFade(dist, REGION_LABEL_FAR, REGION_LABEL_NEAR);
            const ndc = worldPos.clone().project(camera);
            if (ndc.z > 1 || opacity < 0.02) {
                el.style.opacity = '0';
                continue;
            }
            el.style.opacity = String(opacity);
            el.style.left = `${(ndc.x * 0.5 + 0.5) * width}px`;
            el.style.top = `${(-ndc.y * 0.5 + 0.5) * height}px`;
        }
    }
    update(time, cameraWorldPos) {
        const center = this.group.getWorldPosition(new THREE.Vector3());
        const worldRadius = this.atmosphereRadius * this.group.scale.x;
        const dist = center.distanceTo(cameraWorldPos);
        const inside = dist < worldRadius * 1.02;
        if (inside !== this.thresholdState) {
            this.thresholdState = inside;
            const theme = GALAXY_THEMES[this.data.id];
            window.dispatchEvent(new CustomEvent('universe-galaxy-threshold', {
                detail: {
                    galaxyId: this.data.id,
                    title: this.data.title,
                    state: inside ? 'enter' : 'exit',
                    primaryColor: theme.primaryColor,
                    accentColor: theme.accentColor,
                },
            }));
        }
        const base = [0.72, 0.36, 0.20];
        this.gasLayers.forEach((layer, index) => {
            layer.rotation.y = time * (index === 0 ? 0.0032 : index === 1 ? -0.0017 : 0.0011);
            layer.rotation.z = Math.sin(time * 0.045 + index) * 0.008;
            const material = this.gasMaterials[index];
            material.uniforms.time.value = time;
            const unchartedMultiplier = GALAXY_THEMES[this.data.id]?.status === 'uncharted' ? 0.55 : 1;
            material.uniforms.globalAlpha.value = base[index] * (inside ? 0.16 : 1) * unchartedMultiplier;
        });
        if (this.coreMaterial) {
            this.coreMaterial.uniforms.time.value = time;
            this.coreMaterial.uniforms.globalAlpha.value = inside ? 0.42 : 1;
        }
        this.orbitRings.forEach((ring) => {
            ring.material.opacity = (inside ? 0.035 : 0.09) + 0.025 * Math.sin(time * 0.45);
        });
        this.ledPivots.forEach((led) => {
            led.pivot.rotation.y += led.speed * 0.003;
            led.pivot.rotation.x += led.speed * 0.001;
            led.node.material.opacity = (inside ? 0.20 : 0.58) + 0.10 * Math.sin(time * 0.8 + led.speed * 20);
        });
        this.galaxyLight.intensity = (GALAXY_THEMES[this.data.id]?.status === 'showcase' ? 1.25 : 0.58) * (inside ? 0.45 : 1);
    }
    getId() { return this.data.id; }
    distanceTo(worldPos) { return this.group.getWorldPosition(new THREE.Vector3()).distanceTo(worldPos); }
    getShellBoundaryRadius() { return this.atmosphereRadius * this.group.scale.x; }
    dispose() {
        this.labelEls.forEach(({ el }) => el.remove());
        this.gasLayers.forEach((layer) => {
            layer.geometry.dispose();
            layer.material.dispose();
        });
        this.coreMaterial?.dispose();
    }
}
function smoothFade(dist, far, near) {
    if (dist >= far)
        return 0;
    if (dist <= near)
        return 1;
    return 1 - (dist - near) / (far - near);
}
