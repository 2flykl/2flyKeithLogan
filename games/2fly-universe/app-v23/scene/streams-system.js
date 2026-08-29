// Streams System — presentation-ready project system
import * as THREE from 'three';
import { GALAXY_THEMES } from '../types.js';
import { createDecoratedChild, getTexture } from './decorated-object.js';

const ORBIT_RADII = [1180, 1680, 2240, 2840];
const ORBIT_SPEEDS = [0.28, 0.21, 0.16, 0.11];
const ORBIT_Y = [140, -110, 190, -170];

export class StreamsSystem {
    group;
    planetMesh;
    children = [];
    labelContainer;
    time = 0;
    objectData;
    onObjectClick = null;
    clickTargets = [];
    orbitField;

    constructor(objectData, labelContainer) {
        this.objectData = objectData;
        this.labelContainer = labelContainer;
        this.group = new THREE.Group();
        this.group.position.set(objectData.position.x, objectData.position.y, objectData.position.z);
        // Streams is part of the live 2025–2029 galaxy, not G2020.
        const theme = GALAXY_THEMES['G2025'];
        if (theme) {
            this.group.position.x += theme.worldOffset[0];
            this.group.position.y += theme.worldOffset[1];
            this.group.position.z += theme.worldOffset[2];
        }
        this._buildPlanet();
        this._buildOrbitRings();
        this._buildChildren();
    }

    _buildPlanet() {
        const geo = new THREE.SphereGeometry(405, 48, 48);
        const mat = new THREE.ShaderMaterial({
            uniforms: { time: { value: 0 }, deepColor: { value: new THREE.Color(0x191613) }, shallowColor: { value: new THREE.Color(0x6f4d34) }, rimColor: { value: new THREE.Color(0xe0c8ac) } },
            vertexShader: `varying vec3 vNormal;varying vec3 vPos;uniform float time;void main(){vNormal=normalize(normalMatrix*normal);vPos=position;vec3 displaced=position+normal*(12.0*sin(position.y*.008+time)*cos(position.x*.006+time*.72));gl_Position=projectionMatrix*modelViewMatrix*vec4(displaced,1.0);}`,
            fragmentShader: `uniform vec3 deepColor;uniform vec3 shallowColor;uniform vec3 rimColor;uniform float time;varying vec3 vNormal;varying vec3 vPos;void main(){vec3 viewDir=normalize(cameraPosition-vPos);float rim=pow(1.0-max(0.0,dot(vNormal,viewDir)),2.8);float wave=.5+.5*sin(vPos.y*.01+vPos.x*.008+time*.9);vec3 waterColor=mix(deepColor,shallowColor,wave);gl_FragColor=vec4(mix(waterColor,rimColor,rim*.62),1.0);}`,
            transparent: false,
        });
        this.planetMesh = new THREE.Mesh(geo, mat);
        this.planetMesh.userData['objectId'] = this.objectData.id;
        this.group.add(this.planetMesh);
        this.clickTargets.push(this.planetMesh);

        // Direct project SVG identity. No legacy experimental/culture PNG.
        const texture = getTexture('assets/project_orbits/streams_core.svg');
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, alphaTest: 0.01 }));
        sprite.scale.set(920, 920, 1);
        this.group.add(sprite);
        this.group.add(new THREE.PointLight(0xc49b73, 1.0, 4400));
    }

    _buildOrbitRings() {
        this.orbitField = new THREE.Group();
        const bands = [-72, -24, 14, 54];
        for (const r of ORBIT_RADII) {
            bands.forEach((offset, index) => {
                const ring = new THREE.Mesh(new THREE.RingGeometry(r + offset, r + offset + (index % 2 === 0 ? 3 : 5), 96), new THREE.MeshBasicMaterial({ color: 0xf2f7ff, transparent: true, opacity: [0.05, 0.11, 0.08, 0.035][index], side: THREE.DoubleSide, depthWrite: false }));
                ring.rotation.x = -Math.PI / 2;
                this.orbitField.add(ring);
            });
        }
        this.group.add(this.orbitField);
    }

    _buildChildren() {
        const children = this.objectData.children ?? [];
        const mediaKindIcons = { audio: '♪', video: '▶', playable: '⚡', archive: '◈' };
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const angle = (i / Math.max(1, children.length)) * Math.PI * 2;
            const mk = child.mediaKind ?? 'archive';
            const dec = createDecoratedChild(child, mk === 'playable' ? 64 : 56, 0xc49b73);
            const yOff = ORBIT_Y[i] ?? 0;
            dec.group.position.set(Math.cos(angle) * ORBIT_RADII[i], yOff, Math.sin(angle) * ORBIT_RADII[i]);
            dec.clickTarget.userData['childId'] = child.id;
            dec.clickTarget.userData['contentStatus'] = child.contentStatus;
            dec.clickTarget.userData['mediaUrl'] = child.mediaUrl;
            dec.clickTarget.userData['posterUrl'] = child.posterUrl;
            this.group.add(dec.group);
            this.clickTargets.push(dec.clickTarget);

            const el = document.createElement('div');
            el.className = 'universe-label streams-child-label';
            el.style.cssText = `position:absolute;top:0;left:0;pointer-events:none;font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,.9vw,11px);letter-spacing:.1em;text-transform:uppercase;color:rgba(220,240,255,0);white-space:nowrap;transform:translate(-50%,-130%);transition:color .3s;user-select:none;text-align:center;line-height:1.4;`;
            el.innerHTML = `<span>${mediaKindIcons[mk] ?? '○'}</span><br/><span>${child.title}</span>`;
            this.labelContainer.appendChild(el);
            this.children.push({ id: child.id, title: child.title, mediaKind: mk, contentStatus: child.contentStatus ?? 'live', mediaUrl: child.mediaUrl, posterUrl: child.posterUrl, mesh: dec.group, orbitRadius: ORBIT_RADII[i], orbitSpeed: ORBIT_SPEEDS[i], orbitAngle: angle, orbitY: yOff, labelEl: el });
        }
    }

    update(dt, camera, renderer) {
        this.time += dt;
        this.planetMesh.material.uniforms['time'].value = this.time;
        this.planetMesh.rotation.y += dt * 0.04;
        if (this.orbitField) this.orbitField.rotation.y += dt * 0.036;
        for (const child of this.children) {
            child.orbitAngle += dt * child.orbitSpeed * 0.72;
            child.mesh.position.set(Math.cos(child.orbitAngle) * child.orbitRadius, child.orbitY + Math.sin(this.time * .36 + child.orbitRadius) * 18, Math.sin(child.orbitAngle) * child.orbitRadius);
            child.mesh.rotation.y += dt * .40;
            child.mesh.rotation.x += dt * .14;
        }
        this._updateLabels(camera, renderer);
    }

    _updateLabels(camera, renderer) {
        const { width, height } = renderer.domElement.getBoundingClientRect();
        const cameraWorld = new THREE.Vector3(); camera.getWorldPosition(cameraWorld);
        for (const child of this.children) {
            const worldPos = new THREE.Vector3(); child.mesh.getWorldPosition(worldPos);
            const dist = cameraWorld.distanceTo(worldPos);
            const opacity = 1 - Math.min(1, Math.max(0, (dist - 760) / (3000 - 760)));
            const ndc = worldPos.clone().project(camera);
            if (ndc.z > 1 || opacity < .02) { child.labelEl.style.opacity = '0'; continue; }
            child.labelEl.style.opacity = String(opacity);
            child.labelEl.style.left = `${(ndc.x * .5 + .5) * width}px`;
            child.labelEl.style.top = `${(-ndc.y * .5 + .5) * height}px`;
        }
    }

    getChildData(childId) { return this.children.find(c => c.id === childId); }
    getPlanetWorldPos() { const wp = new THREE.Vector3(); this.planetMesh.getWorldPosition(wp); return wp; }
    dispose() {
        for (const c of this.children) { c.mesh.traverse(child => { if (child.isMesh) { child.geometry?.dispose(); if (Array.isArray(child.material)) child.material.forEach(m => m.dispose()); else child.material?.dispose(); } else if (child.isSprite) child.material?.dispose(); }); c.labelEl.remove(); }
        this.planetMesh.geometry.dispose(); this.planetMesh.material.dispose();
    }
}
