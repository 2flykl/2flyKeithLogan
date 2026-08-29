// Thru the Fire System — presentation-ready SVG showcase
import * as THREE from 'three';
import { GALAXY_THEMES } from '../types.js';
import { createDecoratedChild, getTexture } from './decorated-object.js';

const FIRE_RADII = [1200, 1680, 2200, 2760];
const FIRE_SPEEDS = [0.34, 0.24, 0.18, 0.12];
const FIRE_Y = [180, -150, 210, -190];

export class ThruTheFireSystem {
    group;
    planetMesh;
    emberParticles;
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
        this._buildMoltenPlanet();
        this._buildEmbers();
        this._buildOrbitRings();
        this._buildChildren();
    }

    _buildMoltenPlanet() {
        const geo = new THREE.SphereGeometry(430, 48, 48);
        const mat = new THREE.ShaderMaterial({
            uniforms: { time: { value: 0 }, crustColor: { value: new THREE.Color(0x180806) }, moltenColor: { value: new THREE.Color(0xe45b28) }, emberGlow: { value: new THREE.Color(0xffc256) } },
            vertexShader: `varying vec3 vNormal;varying vec3 vPos;uniform float time;void main(){vNormal=normalize(normalMatrix*normal);vPos=position;vec3 displaced=position+normal*(16.0*sin(position.y*.007+time*1.5)*cos(position.z*.009+time*1.1));gl_Position=projectionMatrix*modelViewMatrix*vec4(displaced,1.0);}`,
            fragmentShader: `uniform vec3 crustColor;uniform vec3 moltenColor;uniform vec3 emberGlow;uniform float time;varying vec3 vNormal;varying vec3 vPos;void main(){vec3 viewDir=normalize(cameraPosition-vPos);float rim=pow(1.0-max(0.0,dot(vNormal,viewDir)),2.3);float heat=.5+.5*sin(vPos.x*.01+vPos.y*.008+time*1.2);heat*=smoothstep(.2,.8,sin(vPos.z*.012+time*.7));vec3 base=mix(crustColor,moltenColor,heat);gl_FragColor=vec4(mix(base,emberGlow,rim*.72),1.0);}`,
        });
        this.planetMesh = new THREE.Mesh(geo, mat);
        this.planetMesh.userData['objectId'] = this.objectData.id;
        this.group.add(this.planetMesh);
        this.clickTargets.push(this.planetMesh);

        // Direct project SVG identity. No legacy music/culture PNG overlay.
        const texture = getTexture('assets/project_orbits/fire_core.svg');
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, alphaTest: 0.01 }));
        sprite.scale.set(980, 980, 1);
        this.group.add(sprite);
        this.group.add(new THREE.PointLight(0xe45b28, 1.35, 6000));
    }

    _buildEmbers() {
        const COUNT = 380;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(COUNT * 3);
        const sizes = new Float32Array(COUNT);
        for (let i = 0; i < COUNT; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(Math.random() * 2 - 1);
            const r = 500 + Math.random() * 420;
            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);
            sizes[i] = 4 + Math.random() * 10;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        const mat = new THREE.ShaderMaterial({
            uniforms: { time: { value: 0 } },
            vertexShader: `attribute float size;uniform float time;varying float vAlpha;void main(){vec3 p=position;p.y+=sin(time*1.8+position.x*.01)*26.0;vAlpha=.35+.35*sin(time*2.6+position.z*.02);vec4 mv=modelViewMatrix*vec4(p,1.0);gl_Position=projectionMatrix*mv;gl_PointSize=size*(320.0/-mv.z);}`,
            fragmentShader: `varying float vAlpha;void main(){vec2 uv=gl_PointCoord-.5;if(length(uv)>.5)discard;gl_FragColor=vec4(1.0,.50,.18,vAlpha);}`,
            transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        });
        this.emberParticles = new THREE.Points(geo, mat);
        this.group.add(this.emberParticles);
    }

    _buildOrbitRings() {
        this.orbitField = new THREE.Group();
        const bands = [-72, -24, 16, 58];
        for (const r of FIRE_RADII) {
            bands.forEach((offset, index) => {
                const ring = new THREE.Mesh(new THREE.RingGeometry(r + offset, r + offset + (index % 2 === 0 ? 3 : 6), 96), new THREE.MeshBasicMaterial({ color: 0xf2f7ff, transparent: true, opacity: [0.05, 0.12, 0.09, 0.04][index], side: THREE.DoubleSide, depthWrite: false }));
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
            const angle = (i / Math.max(1, children.length)) * Math.PI * 2;
            const mk = child.mediaKind ?? 'archive';
            const dec = createDecoratedChild(child, mk === 'playable' ? 66 : 58, 0xe45b28);
            const yOff = FIRE_Y[i] ?? 0;
            dec.group.position.set(Math.cos(angle) * FIRE_RADII[i], yOff, Math.sin(angle) * FIRE_RADII[i]);
            dec.clickTarget.userData['childId'] = child.id;
            dec.clickTarget.userData['contentStatus'] = child.contentStatus;
            dec.clickTarget.userData['mediaUrl'] = child.mediaUrl;
            dec.clickTarget.userData['posterUrl'] = child.posterUrl;
            this.group.add(dec.group);
            this.clickTargets.push(dec.clickTarget);

            const el = document.createElement('div');
            el.className = 'universe-label fire-child-label';
            el.style.cssText = `position:absolute;top:0;left:0;pointer-events:none;font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,.9vw,11px);letter-spacing:.1em;text-transform:uppercase;color:rgba(255,210,185,0);white-space:nowrap;transform:translate(-50%,-130%);transition:color .3s;user-select:none;text-align:center;line-height:1.4;`;
            const icon = mk === 'playable' ? '◇ PLAYABLE' : (mk === 'audio' ? '♪ AUDIO' : (mk === 'video' ? '▶ VIDEO' : '◐ ARCHIVE'));
            el.innerHTML = `<span>${icon}</span><br/><span>${child.title}</span>`;
            this.labelContainer.appendChild(el);
            this.children.push({ id: child.id, title: child.title, mediaKind: mk, contentStatus: child.contentStatus ?? 'live', mediaUrl: child.mediaUrl, posterUrl: child.posterUrl, mesh: dec.group, orbitRadius: FIRE_RADII[i], orbitSpeed: FIRE_SPEEDS[i], orbitAngle: angle, orbitY: yOff, labelEl: el });
        }
    }

    update(dt, camera, renderer) {
        this.time += dt;
        this.planetMesh.material.uniforms['time'].value = this.time;
        this.planetMesh.rotation.y += dt * 0.04;
        this.emberParticles.material.uniforms['time'].value = this.time;
        if (this.orbitField) this.orbitField.rotation.y += dt * 0.040;
        for (const c of this.children) {
            c.orbitAngle += dt * c.orbitSpeed * 0.72;
            c.mesh.position.set(Math.cos(c.orbitAngle) * c.orbitRadius, c.orbitY + Math.sin(this.time * .42 + c.orbitRadius) * 25, Math.sin(c.orbitAngle) * c.orbitRadius);
            c.mesh.rotation.y += dt * .45;
        }
        this._updateLabels(camera, renderer);
    }

    _updateLabels(camera, renderer) {
        const { width, height } = renderer.domElement.getBoundingClientRect();
        const cameraWorld = new THREE.Vector3(); camera.getWorldPosition(cameraWorld);
        for (const c of this.children) {
            const worldPos = new THREE.Vector3(); c.mesh.getWorldPosition(worldPos);
            const dist = cameraWorld.distanceTo(worldPos);
            const opacity = 1 - Math.min(1, Math.max(0, (dist - 850) / (3150 - 850)));
            const ndc = worldPos.clone().project(camera);
            if (ndc.z > 1 || opacity < .02) { c.labelEl.style.opacity = '0'; continue; }
            c.labelEl.style.opacity = String(opacity);
            c.labelEl.style.left = `${(ndc.x * .5 + .5) * width}px`;
            c.labelEl.style.top = `${(-ndc.y * .5 + .5) * height}px`;
        }
    }

    getChildData(id) { return this.children.find(c => c.id === id); }
    getPlanetWorldPos() { const wp = new THREE.Vector3(); this.planetMesh.getWorldPosition(wp); return wp; }
    dispose() {
        for (const c of this.children) { c.mesh.traverse(child => { if (child.isMesh) { child.geometry?.dispose(); if (Array.isArray(child.material)) child.material.forEach(m => m.dispose()); else child.material?.dispose(); } else if (child.isSprite) child.material?.dispose(); }); c.labelEl.remove(); }
        this.planetMesh.geometry.dispose(); this.planetMesh.material.dispose();
    }
}
