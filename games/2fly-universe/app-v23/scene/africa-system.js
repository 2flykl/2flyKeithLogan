// I Woke Up in Africa System — presentation-ready flagship system
import * as THREE from 'three';
import { GALAXY_THEMES } from '../types.js';
import { createDecoratedChild, getTexture } from './decorated-object.js';

const AFRICA_RADII = [1450, 1950, 2450, 2950, 3450, 3950];
const AFRICA_SPEEDS = [0.23, 0.20, 0.18, 0.15, 0.13, 0.11];
const AFRICA_Y = [220, -170, 250, -220, 280, -260];

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
    orbitField;

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
        const geo = new THREE.SphereGeometry(470, 48, 48);
        const mat = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                goldColor: { value: new THREE.Color(0xd18c36) },
                earthColor: { value: new THREE.Color(0x2b1709) },
                greenTone: { value: new THREE.Color(0x3a7040) },
                sunRay: { value: new THREE.Color(0xffe0a0) },
            },
            vertexShader: `
        varying vec3 vNormal; varying vec3 vPos; uniform float time;
        void main(){vNormal=normalize(normalMatrix*normal);vPos=position;vec3 displaced=position+normal*(14.0*sin(position.y*.008+time*.8)*cos(position.x*.006+time*.6));gl_Position=projectionMatrix*modelViewMatrix*vec4(displaced,1.0);}`,
            fragmentShader: `
        uniform vec3 goldColor;uniform vec3 earthColor;uniform vec3 greenTone;uniform vec3 sunRay;uniform float time;varying vec3 vNormal;varying vec3 vPos;
        void main(){vec3 viewDir=normalize(cameraPosition-vPos);float rim=pow(1.0-max(0.0,dot(vNormal,viewDir)),2.0);float elevation=.5+.5*sin(vPos.y*.008+vPos.x*.006+time*.4);vec3 terrain=mix(earthColor,greenTone,smoothstep(.3,.7,elevation));vec3 base=mix(terrain,goldColor,.38);gl_FragColor=vec4(mix(base,sunRay,rim*.7),1.0);}`,
        });
        this.planetMesh = new THREE.Mesh(geo, mat);
        this.planetMesh.userData['objectId'] = this.objectData.id;
        this.group.add(this.planetMesh);
        this.clickTargets.push(this.planetMesh);

        // Direct project identity — no legacy life/culture PNG.
        const texture = getTexture('assets/project_orbits/africa_core.svg');
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, alphaTest: 0.01 }));
        sprite.scale.set(1060, 1060, 1);
        this.group.add(sprite);

        const light = new THREE.PointLight(0xd18c36, 1.5, 7600);
        this.group.add(light);
    }

    _buildClouds() {
        const geo = new THREE.SphereGeometry(505, 36, 36);
        const mat = new THREE.MeshBasicMaterial({ color: 0xffedd0, transparent: true, opacity: 0.13, depthWrite: false, blending: THREE.AdditiveBlending });
        this.cloudMesh = new THREE.Mesh(geo, mat);
        this.group.add(this.cloudMesh);
    }

    _buildBirdParticles() {
        const COUNT = 220;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(COUNT * 3);
        for (let i = 0; i < COUNT; i++) {
            const theta = Math.random() * Math.PI * 2;
            const r = 560 + Math.random() * 460;
            pos[i * 3] = Math.cos(theta) * r;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 340;
            pos[i * 3 + 2] = Math.sin(theta) * r;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({ color: 0xffd090, size: 12, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false });
        this.birdParticles = new THREE.Points(geo, mat);
        this.group.add(this.birdParticles);
    }

    _buildOrbitRings() {
        this.orbitField = new THREE.Group();
        const bands = [-88, -32, 12, 48, 92];
        for (const r of AFRICA_RADII) {
            bands.forEach((offset, index) => {
                const geo = new THREE.RingGeometry(r + offset, r + offset + (index % 2 === 0 ? 3 : 5), 112);
                const mat = new THREE.MeshBasicMaterial({ color: 0xf5f8ff, transparent: true, opacity: [0.04, 0.08, 0.13, 0.07, 0.035][index], side: THREE.DoubleSide, depthWrite: false });
                const ring = new THREE.Mesh(geo, mat);
                ring.rotation.x = -Math.PI / 2;
                this.orbitField.add(ring);
            });
        }
        this.group.add(this.orbitField);
    }

    _buildChildren() {
        const children = this.objectData.children ?? [];
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const radius = AFRICA_RADII[i] ?? 1450 + i * 500;
            const speed = AFRICA_SPEEDS[i] ?? 0.1;
            const angle = (i / Math.max(1, children.length)) * Math.PI * 2;
            const mk = child.mediaKind ?? 'archive';
            const dec = createDecoratedChild(child, mk === 'playable' ? 70 : 62, 0xd18c36);
            const yOff = AFRICA_Y[i] ?? (i % 2 ? -180 : 180);
            dec.group.position.set(Math.cos(angle) * radius, yOff, Math.sin(angle) * radius);
            const clickTarget = dec.clickTarget;
            clickTarget.userData['childId'] = child.id;
            clickTarget.userData['contentStatus'] = child.contentStatus;
            clickTarget.userData['mediaUrl'] = child.mediaUrl;
            clickTarget.userData['posterUrl'] = child.posterUrl;
            this.group.add(dec.group);
            this.clickTargets.push(clickTarget);

            const el = document.createElement('div');
            el.className = 'universe-label africa-child-label';
            el.style.cssText = `position:absolute;top:0;left:0;pointer-events:none;font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,.85vw,10px);letter-spacing:.1em;text-transform:uppercase;color:rgba(255,230,190,0);white-space:nowrap;transform:translate(-50%,-130%);transition:color .3s;user-select:none;text-align:center;line-height:1.4;`;
            const icon = mk === 'playable' ? '◇ PLAYABLE' : (mk === 'audio' ? '♪ AUDIO' : (mk === 'video' ? '▶ VIDEO' : '◐ ARCHIVE'));
            el.innerHTML = `<span>${icon}</span><br/><span>${child.title}</span>`;
            this.labelContainer.appendChild(el);
            this.children.push({ id: child.id, title: child.title, mediaKind: mk, contentStatus: child.contentStatus ?? 'live', mediaUrl: child.mediaUrl, posterUrl: child.posterUrl, mesh: dec.group, orbitRadius: radius, orbitSpeed: speed, orbitAngle: angle, orbitY: yOff, labelEl: el });
        }
    }

    update(dt, camera, renderer) {
        this.time += dt;
        this.planetMesh.material.uniforms['time'].value = this.time;
        this.planetMesh.rotation.y += dt * 0.035;
        this.cloudMesh.rotation.y += dt * 0.055;
        this.birdParticles.rotation.y += dt * 0.09;
        if (this.orbitField) this.orbitField.rotation.y += dt * 0.030;
        for (const c of this.children) {
            c.orbitAngle += dt * c.orbitSpeed * 0.72;
            c.mesh.position.set(Math.cos(c.orbitAngle) * c.orbitRadius, c.orbitY + Math.sin(this.time * 0.33 + c.orbitRadius) * 24, Math.sin(c.orbitAngle) * c.orbitRadius);
            c.mesh.rotation.y += dt * 0.40;
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
            const opacity = 1 - Math.min(1, Math.max(0, (dist - 950) / (3550 - 950)));
            const ndc = worldPos.clone().project(camera);
            if (ndc.z > 1 || opacity < 0.02) { c.labelEl.style.opacity = '0'; continue; }
            c.labelEl.style.opacity = String(opacity);
            c.labelEl.style.left = `${(ndc.x * .5 + .5) * width}px`;
            c.labelEl.style.top = `${(-ndc.y * .5 + .5) * height}px`;
        }
    }

    getChildData(id) { return this.children.find(c => c.id === id); }
    getPlanetWorldPos() { const wp = new THREE.Vector3(); this.planetMesh.getWorldPosition(wp); return wp; }

    dispose() {
        for (const c of this.children) {
            c.mesh.traverse(child => {
                if (child.isMesh) { child.geometry?.dispose(); if (Array.isArray(child.material)) child.material.forEach(m => m.dispose()); else child.material?.dispose(); }
                else if (child.isSprite) child.material?.dispose();
            });
            c.labelEl.remove();
        }
        this.planetMesh.geometry.dispose();
        this.planetMesh.material.dispose();
        this.cloudMesh.geometry.dispose();
        this.cloudMesh.material.dispose();
    }
}
