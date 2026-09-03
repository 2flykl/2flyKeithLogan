// Streams System — The proof-of-concept content planet with orbiting media objects
// Water-animated planet with 4 orbiting moons/satellites
import * as THREE from 'three';
import { GALAXY_THEMES } from '../types.js';
import { createDecoratedChild, getTexture } from './decorated-object.js';
const ORBIT_RADII = [800, 1300, 1900, 2600];
const ORBIT_SPEEDS = [0.35, 0.22, 0.14, 0.09];
export class StreamsSystem {
    group;
    planetMesh;
    children = [];
    labelContainer;
    time = 0;
    objectData;
    onObjectClick = null;
    clickTargets = [];
    constructor(objectData, labelContainer) {
        this.objectData = objectData;
        this.labelContainer = labelContainer;
        this.group = new THREE.Group();
        this.group.position.set(objectData.position.x, objectData.position.y, objectData.position.z);
        // Apply galaxy world offset for G2020
        const theme = GALAXY_THEMES['G2020'];
        if (theme) {
            this.group.position.x += theme.worldOffset[0];
            this.group.position.z += theme.worldOffset[2];
        }
        this._buildPlanet();
        this._buildOrbitRings();
        this._buildChildren();
    }
    _buildPlanet() {
        const geo = new THREE.SphereGeometry(420, 48, 48);
        const mat = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                deepColor: { value: new THREE.Color(0x041828) },
                shallowColor: { value: new THREE.Color(0x0a4870) },
                rimColor: { value: new THREE.Color(0x20d0d0) },
            },
            vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPos;
        uniform float time;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPos = position;
          vec3 displaced = position + normal * (
            15.0 * sin(position.y * 0.008 + time * 1.2) *
            cos(position.x * 0.006 + time * 0.8)
          );
          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        }
      `,
            fragmentShader: `
        uniform vec3 deepColor;
        uniform vec3 shallowColor;
        uniform vec3 rimColor;
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vPos;
        void main() {
          vec3 viewDir = normalize(cameraPosition - vPos);
          float rim = 1.0 - max(0.0, dot(vNormal, viewDir));
          rim = pow(rim, 3.0);
          float wave = 0.5 + 0.5 * sin(vPos.y * 0.01 + vPos.x * 0.008 + time * 0.9);
          vec3 waterColor = mix(deepColor, shallowColor, wave);
          vec3 final = mix(waterColor, rimColor, rim * 0.7);
          gl_FragColor = vec4(final, 1.0);
        }
      `,
            transparent: false,
        });
        this.planetMesh = new THREE.Mesh(geo, mat);
        this.planetMesh.userData['objectId'] = this.objectData.id;
        this.group.add(this.planetMesh);
        this.clickTargets.push(this.planetMesh);
        // Overlay designed experimental planet sprite
        const texture = getTexture('assets/object_styles/experimental_planet.png');
        const spriteMat = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthWrite: false,
        });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(420 * 2.2, 420 * 2.2, 1);
        this.group.add(sprite);
        // Planet glow light
        const light = new THREE.PointLight(0x20a0d0, 1.2, 5000);
        this.group.add(light);
    }
    _buildOrbitRings() {
        for (const r of ORBIT_RADII) {
            const geo = new THREE.RingGeometry(r - 4, r + 4, 96);
            const mat = new THREE.MeshBasicMaterial({
                color: 0x1a4060,
                transparent: true,
                opacity: 0.25,
                side: THREE.DoubleSide,
                depthWrite: false,
            });
            const ring = new THREE.Mesh(geo, mat);
            ring.rotation.x = -Math.PI / 2;
            this.group.add(ring);
        }
    }
    _buildChildren() {
        const children = this.objectData.children ?? [];
        const mediaKindIcons = {
            audio: '♪',
            video: '▶',
            playable: '⚡',
            archive: '◈',
        };
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const radius = ORBIT_RADII[i] ?? 800 + i * 500;
            const speed = ORBIT_SPEEDS[i] ?? 0.08;
            const angle = (i / children.length) * Math.PI * 2;
            const yOff = (i % 2 === 0 ? 1 : -1) * (i * 60);
            const mk = child.mediaKind ?? 'archive';
            const dec = createDecoratedChild(child, 75, 0x20a0d0);
            dec.group.position.set(Math.cos(angle) * radius, yOff, Math.sin(angle) * radius);
            const clickTarget = dec.clickTarget;
            clickTarget.userData['childId'] = child.id;
            clickTarget.userData['contentStatus'] = child.contentStatus;
            this.group.add(dec.group);
            this.clickTargets.push(clickTarget);
            // Icon label
            const el = document.createElement('div');
            el.className = 'universe-label streams-child-label';
            el.style.cssText = `
        position:absolute;top:0;left:0;
        pointer-events:none;
        font-family:'Space Grotesk',sans-serif;
        font-size:clamp(8px,0.9vw,11px);
        letter-spacing:0.1em;
        text-transform:uppercase;
        color:rgba(220,240,255,0);
        white-space:nowrap;
        transform:translate(-50%,-130%);
        transition:color 0.3s;
        user-select:none;
        text-align:center;
        line-height:1.4;
      `;
            el.innerHTML = `<span>${mediaKindIcons[mk] ?? '○'}</span><br/><span>${child.title}</span>`;
            this.labelContainer.appendChild(el);
            this.children.push({
                id: child.id,
                title: child.title,
                mediaKind: mk,
                contentStatus: child.contentStatus ?? 'awaiting-source',
                mesh: dec.group,
                orbitRadius: radius,
                orbitSpeed: speed,
                orbitAngle: angle,
                orbitY: yOff,
                labelEl: el,
            });
        }
    }
    update(dt, camera, renderer) {
        this.time += dt;
        // Animate planet shader
        const mat = this.planetMesh.material;
        mat.uniforms['time'].value = this.time;
        this.planetMesh.rotation.y += dt * 0.06;
        // Orbit children
        for (const child of this.children) {
            child.orbitAngle += dt * child.orbitSpeed * 0.72;
            child.mesh.position.set(Math.cos(child.orbitAngle) * child.orbitRadius, child.orbitY, Math.sin(child.orbitAngle) * child.orbitRadius);
            child.mesh.rotation.y += dt * 0.5;
            child.mesh.rotation.x += dt * 0.3;
        }
        // Update labels
        this._updateLabels(camera, renderer);
    }
    _updateLabels(camera, renderer) {
        const { width, height } = renderer.domElement.getBoundingClientRect();
        const cameraWorld = new THREE.Vector3();
        camera.getWorldPosition(cameraWorld);
        for (const child of this.children) {
            const worldPos = new THREE.Vector3();
            child.mesh.getWorldPosition(worldPos);
            const dist = cameraWorld.distanceTo(worldPos);
            const NEAR = 800;
            const FAR = 3500;
            const opacity = 1 - Math.min(1, Math.max(0, (dist - NEAR) / (FAR - NEAR)));
            const ndc = worldPos.clone().project(camera);
            const x = (ndc.x * 0.5 + 0.5) * width;
            const y = (-(ndc.y * 0.5) + 0.5) * height;
            if (ndc.z > 1 || opacity < 0.02) {
                child.labelEl.style.opacity = '0';
            }
            else {
                child.labelEl.style.opacity = String(opacity);
                child.labelEl.style.left = `${x}px`;
                child.labelEl.style.top = `${y}px`;
            }
        }
    }
    getChildData(childId) {
        return this.children.find(c => c.id === childId);
    }
    getPlanetWorldPos() {
        const wp = new THREE.Vector3();
        this.planetMesh.getWorldPosition(wp);
        return wp;
    }
    dispose() {
        for (const c of this.children) {
            c.mesh.traverse((child) => {
                if (child.isMesh) {
                    const m = child;
                    m.geometry?.dispose();
                    if (Array.isArray(m.material)) {
                        m.material.forEach((mat) => mat.dispose());
                    }
                    else {
                        m.material?.dispose();
                    }
                }
                else if (child.isSprite) {
                    const s = child;
                    s.material?.dispose();
                }
            });
            c.labelEl.remove();
        }
        this.planetMesh.geometry.dispose();
        this.planetMesh.material.dispose();
    }
}
