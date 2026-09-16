// I Woke Up in Africa System — Region II Showcase Planet
// Sunrise gold/green atmospheric planet with cloud layers, bird particle trails, 10 doc chapter moons, and satellite
import * as THREE from '../../assets/three.module.js';
import { GALAXY_THEMES } from '../types.js';
import { createDecoratedChild, getTexture } from './decorated-object.js';
export class AfricaSystem {
    group;
    planetMesh;
    cloudMesh;
    birdParticles;
    children = [];
    labelContainer;
    time = 0;
    objectData;
    clickTargets = [];
    constructor(objectData, labelContainer) {
        this.objectData = objectData;
        this.labelContainer = labelContainer;
        this.group = new THREE.Group();
        const [gx, gy, gz] = GALAXY_THEMES['G2025']?.worldOffset ?? [0, 0, 0];
        this.group.position.set(gx + objectData.position.x, gy + objectData.position.y, gz + objectData.position.z);
        this._buildSunrisePlanet();
        this._buildClouds();
        this._buildBirdParticles();
        this._buildOrbitRings();
        this._buildChildren();
    }
    _buildSunrisePlanet() {
        const geo = new THREE.SphereGeometry(460, 48, 48);
        const mat = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                goldColor: { value: new THREE.Color(0xd18c36) },
                earthColor: { value: new THREE.Color(0x2b1709) },
                greenTone: { value: new THREE.Color(0x3a7040) },
                sunRay: { value: new THREE.Color(0xffe0a0) },
            },
            vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPos;
        uniform float time;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPos = position;
          vec3 displaced = position + normal * (
            14.0 * sin(position.y * 0.008 + time * 0.8) *
            cos(position.x * 0.006 + time * 0.6)
          );
          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        }
      `,
            fragmentShader: `
        uniform vec3 goldColor;
        uniform vec3 earthColor;
        uniform vec3 greenTone;
        uniform vec3 sunRay;
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vPos;
        void main() {
          vec3 viewDir = normalize(cameraPosition - vPos);
          float rim = 1.0 - max(0.0, dot(vNormal, viewDir));
          rim = pow(rim, 2.2);
          float elevation = 0.5 + 0.5 * sin(vPos.y * 0.008 + vPos.x * 0.006 + time * 0.4);
          vec3 terrain = mix(earthColor, greenTone, smoothstep(0.3, 0.7, elevation));
          vec3 base = mix(terrain, goldColor, 0.4);
          vec3 final = mix(base, sunRay, rim * 0.75);
          gl_FragColor = vec4(final, 1.0);
        }
      `,
        });
        this.planetMesh = new THREE.Mesh(geo, mat);
        this.planetMesh.userData['objectId'] = this.objectData.id;
        this.group.add(this.planetMesh);
        this.clickTargets.push(this.planetMesh);
        // Overlay designed life planet sprite
        const texture = getTexture('assets/object_styles/life_planet.png');
        const spriteMat = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthWrite: false,
        });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(460 * 2.2, 460 * 2.2, 1);
        this.group.add(sprite);
        // Warm sunlight
        const light = new THREE.PointLight(0xd18c36, 1.6, 7000);
        this.group.add(light);
    }
    _buildClouds() {
        const geo = new THREE.SphereGeometry(480, 36, 36);
        const mat = new THREE.MeshBasicMaterial({
            color: 0xffedd0,
            transparent: true,
            opacity: 0.18,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        this.cloudMesh = new THREE.Mesh(geo, mat);
        this.group.add(this.cloudMesh);
    }
    _buildBirdParticles() {
        const COUNT = 300;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(COUNT * 3);
        for (let i = 0; i < COUNT; i++) {
            const theta = Math.random() * Math.PI * 2;
            const r = 520 + Math.random() * 400;
            pos[i * 3] = Math.cos(theta) * r;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 300;
            pos[i * 3 + 2] = Math.sin(theta) * r;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({
            color: 0xffd090,
            size: 14,
            transparent: true,
            opacity: 0.45,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        this.birdParticles = new THREE.Points(geo, mat);
        this.group.add(this.birdParticles);
    }
    _buildOrbitRings() {
        const radii = [950, 1400, 1900, 2400, 2900];
        for (const r of radii) {
            const geo = new THREE.RingGeometry(r - 4, r + 4, 64);
            const mat = new THREE.MeshBasicMaterial({
                color: 0xd18c36,
                transparent: true,
                opacity: 0.22,
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
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const radius = 950 + (i % 5) * 480;
            const speed = 0.25 - (i % 5) * 0.035;
            const angle = (i / children.length) * Math.PI * 2;
            const mk = child.mediaKind ?? 'archive';
            const dec = createDecoratedChild(child, 70, 0xd18c36);
            dec.group.position.set(Math.cos(angle) * radius, (i % 2 === 0 ? 1 : -1) * (i * 30), Math.sin(angle) * radius);
            const clickTarget = dec.clickTarget;
            clickTarget.userData['childId'] = child.id;
            clickTarget.userData['contentStatus'] = child.contentStatus;
            clickTarget.userData['mediaUrl'] = child.mediaUrl;
            clickTarget.userData['posterUrl'] = child.posterUrl;
            this.group.add(dec.group);
            this.clickTargets.push(clickTarget);
            const el = document.createElement('div');
            el.className = 'universe-label africa-child-label';
            el.style.cssText = `
        position:absolute;top:0;left:0;pointer-events:none;
        font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,0.85vw,10px);
        letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,230,190,0);
        white-space:nowrap;transform:translate(-50%,-130%);transition:color 0.3s;
        user-select:none;text-align:center;line-height:1.4;
      `;
            const icon = mk === 'playable' ? '◇ SATELLITE' : (mk === 'audio' ? '♪ AUDIO' : (mk === 'video' ? '▶ DOC' : '◐ ARCHIVE'));
            el.innerHTML = `<span>${icon}</span><br/><span>${child.title}</span>`;
            this.labelContainer.appendChild(el);
            this.children.push({
                id: child.id,
                title: child.title,
                mediaKind: mk,
                contentStatus: child.contentStatus ?? 'live',
                mediaUrl: child.mediaUrl,
                posterUrl: child.posterUrl,
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
        this.planetMesh.rotation.y += dt * 0.04;
        this.cloudMesh.rotation.y += dt * 0.07;
        // Bird particle orbit
        this.birdParticles.rotation.y += dt * 0.12;
        for (const c of this.children) {
            c.orbitAngle += dt * c.orbitSpeed * 0.72;
            c.mesh.position.set(Math.cos(c.orbitAngle) * c.orbitRadius, Math.sin(this.time * 0.4 + c.orbitRadius) * 35, Math.sin(c.orbitAngle) * c.orbitRadius);
            c.mesh.rotation.y += dt * 0.5;
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
        this.cloudMesh.geometry.dispose();
        this.cloudMesh.material.dispose();
    }
}
