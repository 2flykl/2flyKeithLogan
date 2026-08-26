// Thru the Fire System — Region I Showcase Planet
// Scarred, partially molten planet with ember/ash particle system, heat glow, and satellite
import * as THREE from 'three';
import { GALAXY_THEMES } from '../types.js';
import { createDecoratedChild, getTexture } from './decorated-object.js';
export class ThruTheFireSystem {
    group;
    planetMesh;
    emberParticles;
    children = [];
    labelContainer;
    time = 0;
    objectData;
    clickTargets = [];
    constructor(objectData, labelContainer) {
        this.objectData = objectData;
        this.labelContainer = labelContainer;
        this.group = new THREE.Group();
        // World position: G2025 at (0, 0, 0)
        const [gx, gy, gz] = GALAXY_THEMES['G2025']?.worldOffset ?? [0, 0, 0];
        this.group.position.set(gx + objectData.position.x, gy + objectData.position.y, gz + objectData.position.z);
        this._buildMoltenPlanet();
        this._buildEmbers();
        this._buildOrbitRings();
        this._buildChildren();
    }
    _buildMoltenPlanet() {
        const geo = new THREE.SphereGeometry(450, 48, 48);
        const mat = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                crustColor: { value: new THREE.Color(0x180806) },
                moltenColor: { value: new THREE.Color(0xe45b28) },
                emberGlow: { value: new THREE.Color(0xff9900) },
            },
            vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPos;
        uniform float time;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPos = position;
          vec3 displaced = position + normal * (
            18.0 * sin(position.y * 0.007 + time * 1.5) *
            cos(position.z * 0.009 + time * 1.1)
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
          float rim = 1.0 - max(0.0, dot(vNormal, viewDir));
          rim = pow(rim, 2.5);
          float heat = 0.5 + 0.5 * sin(vPos.x * 0.01 + vPos.y * 0.008 + time * 1.2);
          heat *= smoothstep(0.2, 0.8, sin(vPos.z * 0.012 + time * 0.7));
          vec3 base = mix(crustColor, moltenColor, heat);
          vec3 final = mix(base, emberGlow, rim * 0.85);
          gl_FragColor = vec4(final, 1.0);
        }
      `,
        });
        this.planetMesh = new THREE.Mesh(geo, mat);
        this.planetMesh.userData['objectId'] = this.objectData.id;
        this.group.add(this.planetMesh);
        this.clickTargets.push(this.planetMesh);
        // Overlay designed music planet sprite
        const texture = getTexture('assets/object_styles/music_planet.png');
        const spriteMat = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthWrite: false,
        });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(450 * 2.2, 450 * 2.2, 1);
        this.group.add(sprite);
        // Heat point light
        const light = new THREE.PointLight(0xe45b28, 1.5, 6000);
        this.group.add(light);
    }
    _buildEmbers() {
        const COUNT = 600;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(COUNT * 3);
        const sizes = new Float32Array(COUNT);
        for (let i = 0; i < COUNT; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const r = 470 + Math.random() * 350;
            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
            sizes[i] = 4 + Math.random() * 12;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        const mat = new THREE.ShaderMaterial({
            uniforms: { time: { value: 0 } },
            vertexShader: `
        attribute float size;
        uniform float time;
        varying float vAlpha;
        void main() {
          vec3 p = position;
          p.y += sin(time * 2.0 + position.x * 0.01) * 30.0;
          vAlpha = 0.4 + 0.4 * sin(time * 3.0 + position.z * 0.02);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = size * (350.0 / -mv.z);
        }
      `,
            fragmentShader: `
        varying float vAlpha;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          if (length(uv) > 0.5) discard;
          gl_FragColor = vec4(1.0, 0.45, 0.15, vAlpha);
        }
      `,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        this.emberParticles = new THREE.Points(geo, mat);
        this.group.add(this.emberParticles);
    }
    _buildOrbitRings() {
        const radii = [900, 1500, 2200];
        for (const r of radii) {
            const geo = new THREE.RingGeometry(r - 5, r + 5, 64);
            const mat = new THREE.MeshBasicMaterial({
                color: 0xe45b28,
                transparent: true,
                opacity: 0.2,
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
        const radii = [900, 1500, 2200, 2900];
        const speeds = [0.3, 0.2, 0.14, 0.09];
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const radius = radii[i] ?? 1000 + i * 600;
            const speed = speeds[i] ?? 0.1;
            const angle = (i / children.length) * Math.PI * 2;
            const mk = child.mediaKind ?? 'archive';
            const dec = createDecoratedChild(child, 75, 0xe45b28);
            dec.group.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
            const clickTarget = dec.clickTarget;
            clickTarget.userData['childId'] = child.id;
            clickTarget.userData['contentStatus'] = child.contentStatus;
            this.group.add(dec.group);
            this.clickTargets.push(clickTarget);
            // Label
            const el = document.createElement('div');
            el.className = 'universe-label fire-child-label';
            el.style.cssText = `
        position:absolute;top:0;left:0;pointer-events:none;
        font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,0.9vw,11px);
        letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,200,180,0);
        white-space:nowrap;transform:translate(-50%,-130%);transition:color 0.3s;
        user-select:none;text-align:center;line-height:1.4;
      `;
            const icon = mk === 'playable' ? '◇ SATELLITE' : (mk === 'audio' ? '♪ AUDIO' : (mk === 'video' ? '▶ VIDEO' : '◐ ARCHIVE'));
            el.innerHTML = `<span>${icon}</span><br/><span>${child.title}</span>`;
            this.labelContainer.appendChild(el);
            this.children.push({
                id: child.id,
                title: child.title,
                mediaKind: mk,
                contentStatus: child.contentStatus ?? 'live',
                mesh: dec.group,
                orbitRadius: radius,
                orbitSpeed: speed,
                orbitAngle: angle,
                labelEl: el,
            });
        }
    }
    update(dt, camera, renderer) {
        this.time += dt;
        const pMat = this.planetMesh.material;
        pMat.uniforms['time'].value = this.time;
        this.planetMesh.rotation.y += dt * 0.05;
        const eMat = this.emberParticles.material;
        eMat.uniforms['time'].value = this.time;
        for (const c of this.children) {
            c.orbitAngle += dt * c.orbitSpeed * 0.72;
            c.mesh.position.set(Math.cos(c.orbitAngle) * c.orbitRadius, Math.sin(this.time * 0.5 + c.orbitRadius) * 40, Math.sin(c.orbitAngle) * c.orbitRadius);
            c.mesh.rotation.y += dt * 0.6;
        }
        this._updateLabels(camera, renderer);
    }
    _updateLabels(camera, renderer) {
        const { width, height } = renderer.domElement.getBoundingClientRect();
        const cameraWorld = new THREE.Vector3();
        camera.getWorldPosition(cameraWorld);
        for (const c of this.children) {
            const worldPos = new THREE.Vector3();
            c.mesh.getWorldPosition(worldPos);
            const dist = cameraWorld.distanceTo(worldPos);
            const NEAR = 900;
            const FAR = 3800;
            const opacity = 1 - Math.min(1, Math.max(0, (dist - NEAR) / (FAR - NEAR)));
            const ndc = worldPos.clone().project(camera);
            const x = (ndc.x * 0.5 + 0.5) * width;
            const y = (-(ndc.y * 0.5) + 0.5) * height;
            if (ndc.z > 1 || opacity < 0.02) {
                c.labelEl.style.opacity = '0';
            }
            else {
                c.labelEl.style.opacity = String(opacity);
                c.labelEl.style.left = `${x}px`;
                c.labelEl.style.top = `${y}px`;
            }
        }
    }
    getChildData(id) {
        return this.children.find(c => c.id === id);
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
