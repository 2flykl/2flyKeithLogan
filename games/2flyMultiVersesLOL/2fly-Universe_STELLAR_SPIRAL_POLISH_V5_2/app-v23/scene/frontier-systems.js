// Frontier Systems — Region III Playable Systems (Ebony Eyes, Return of the Aviator, I Was Away, FlyZone)
import * as THREE from 'three';
import { GALAXY_THEMES } from '../types.js';
import { createDecoratedPlanet, createDecoratedChild } from './decorated-object.js';

export class FrontierSystems {
    group;
    planetMeshes = [];
    children = [];
    labelContainer;
    time = 0;
    clickTargets = [];
    orbitGuides = [];
    constructor(objects, labelContainer) {
        this.labelContainer = labelContainer;
        this.group = new THREE.Group();
        const [gx, gy, gz] = GALAXY_THEMES['G2025']?.worldOffset ?? [0, 0, 0];
        this.group.position.set(gx, gy, gz);
        for (const obj of objects) {
            if (obj.id === 'OBJ-FIRE' || obj.id === 'OBJ-AFRICA' || obj.id === 'OBJ-STREAMS')
                continue;
            this._buildSystem(obj);
        }
    }
    _buildSystem(obj) {
        const pos = new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z);
        const color = obj.accentColor ? parseInt(obj.accentColor.replace('#', '0x'), 16) : 0x4080c0;
        const size = obj.id === 'OBJ-EBONY' ? 360 : obj.id === 'OBJ-AVIATOR' ? 260 : obj.id === 'OBJ-AWAY' ? 320 : 280;
        const decPlanet = createDecoratedPlanet(obj.id, size, color);
        decPlanet.group.position.copy(pos);
        decPlanet.clickTarget.userData['objectId'] = obj.id;
        this.group.add(decPlanet.group);
        this.planetMeshes.push({ group: decPlanet.group, pos, size, id: obj.id });
        this.clickTargets.push(decPlanet.clickTarget);

        const haloGeo = new THREE.RingGeometry(size * 1.8, size * 1.85, 96);
        const haloMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.08, side: THREE.DoubleSide, depthWrite: false });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.position.copy(pos); halo.rotation.x = -Math.PI / 2 + 0.08;
        this.group.add(halo);
        this.orbitGuides.push(halo);

        if (obj.children) {
            const chosenMoonId = obj.children.find((c) => c.mediaKind === 'playable' || c.mediaKind === 'video')?.id ?? obj.children[0]?.id;
            const primary = obj.children.filter((c) => c.id === chosenMoonId);
            const minor = obj.children.filter((c) => c.id !== chosenMoonId);
            const ordered = [...primary, ...minor];
            ordered.forEach((child, i) => {
                const isMoon = child.id === chosenMoonId;
                const orbitRadius = isMoon ? size * 3.3 : size * 2.2 + (i - 1) * Math.max(90, size * 0.36);
                const angle = (i / Math.max(1, ordered.length)) * Math.PI * 2;
                const mk = child.mediaKind ?? 'archive';
                const renderSize = isMoon ? 92 : 58;
                const dec = createDecoratedChild(child, renderSize, color);
                const pivot = new THREE.Group();
                pivot.position.copy(pos);
                pivot.rotation.x = isMoon ? 0.12 : ((i % 2 === 0 ? 1 : -1) * 0.045);
                pivot.rotation.z = isMoon ? 0.08 : ((i % 3) - 1) * 0.035;
                this.group.add(pivot);
                dec.group.position.set(orbitRadius, isMoon ? 42 : (i % 2 === 0 ? 16 : -16), 0);
                pivot.rotation.y = angle;
                pivot.add(dec.group);
                const clickTarget = dec.clickTarget;
                clickTarget.userData['childId'] = child.id;
                clickTarget.userData['contentStatus'] = child.contentStatus;
                clickTarget.userData['mediaUrl'] = child.mediaUrl;
                this.clickTargets.push(clickTarget);

                if (isMoon) {
                    const moonGuideGeo = new THREE.RingGeometry(orbitRadius - 6, orbitRadius + 6, 120);
                    const moonGuideMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.11, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending });
                    const moonGuide = new THREE.Mesh(moonGuideGeo, moonGuideMat);
                    moonGuide.position.copy(pos); moonGuide.rotation.x = -Math.PI / 2 + 0.11;
                    this.group.add(moonGuide);
                    this.orbitGuides.push(moonGuide);
                }

                const el = document.createElement('div');
                el.className = 'universe-label frontier-child-label';
                el.style.cssText = `position:absolute;top:0;left:0;pointer-events:none;font-family:'Space Grotesk',sans-serif;font-size:clamp(${isMoon ? 9 : 8}px,0.85vw,${isMoon ? 11 : 10}px);letter-spacing:0.1em;text-transform:uppercase;color:rgba(220,240,255,0);white-space:nowrap;transform:translate(-50%,-130%);transition:opacity 0.3s,color 0.3s;user-select:none;text-align:center;line-height:1.4;`;
                const icon = isMoon ? '◉ MOON' : (mk === 'playable' ? '◇ PLAYABLE' : (mk === 'audio' ? '♪ AUDIO' : (mk === 'video' ? '▶ VIDEO' : '◐ ARCHIVE')));
                el.innerHTML = `<span>${icon}</span><br/><span>${child.title}</span>`;
                this.labelContainer.appendChild(el);
                this.children.push({
                    id: child.id, title: child.title, mediaKind: mk, contentStatus: child.contentStatus ?? 'live', mediaUrl: child.mediaUrl,
                    mesh: dec.group, pivot, orbitRadius, orbitSpeed: (0.16 + (i % 3) * 0.05) * (isMoon ? 0.78 : 0.92), orbitAngle: angle, parentPos: pos,
                    labelEl: el, isMoon, planetId: obj.id, planetPos: pos,
                });
            });
        }
    }
    update(dt, camera, renderer) {
        this.time += dt;
        const galaxyCenter = new THREE.Vector3(...(GALAXY_THEMES['G2025']?.worldOffset ?? [0, 0, 0]));
        const localOrbitFactor = camera.position.distanceTo(galaxyCenter) < 12500 ? 0.92 : 1;
        for (const m of this.planetMeshes) {
            m.group.rotation.y += dt * 0.075;
            m.group.rotation.x += dt * 0.03;
        }
        this.orbitGuides.forEach((g, i) => {
            g.rotation.z += dt * 0.03 * (i % 2 === 0 ? 1 : -1) * localOrbitFactor;
            g.material.opacity = 0.05 + 0.03 * (0.5 + 0.5 * Math.sin(this.time * 0.8 + i));
        });
        for (const c of this.children) {
            c.orbitAngle += dt * c.orbitSpeed * 0.72 * localOrbitFactor;
            c.pivot.rotation.y = c.orbitAngle;
            c.mesh.rotation.y += dt * (c.isMoon ? 0.28 : 0.5);
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
            const NEAR = c.isMoon ? 900 : 700;
            const FAR = c.isMoon ? 5200 : 3600;
            const opacity = 1 - Math.min(1, Math.max(0, (dist - NEAR) / (FAR - NEAR)));
            const ndc = worldPos.clone().project(camera);
            const x = (ndc.x * 0.5 + 0.5) * width;
            const y = (-(ndc.y * 0.5) + 0.5) * height;
            if (ndc.z > 1 || opacity < 0.02) {
                c.labelEl.style.opacity = '0';
            }
            else {
                c.labelEl.style.opacity = String(opacity);
                c.labelEl.style.color = c.isMoon ? 'rgba(255,255,255,0.95)' : 'rgba(220,240,255,0.86)';
                c.labelEl.style.left = `${x}px`;
                c.labelEl.style.top = `${y}px`;
            }
        }
    }
    getChildData(id) {
        return this.children.find(c => c.id === id);
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
        this.orbitGuides.forEach((g)=>{g.geometry?.dispose();g.material?.dispose();});
        for (const m of this.planetMeshes) {
            m.group.traverse((child) => {
                if (child.isMesh) {
                    const mesh = child;
                    mesh.geometry?.dispose();
                    if (Array.isArray(mesh.material)) {
                        mesh.material.forEach((mat) => mat.dispose());
                    }
                    else {
                        mesh.material?.dispose();
                    }
                }
                else if (child.isSprite) {
                    const s = child;
                    s.material?.dispose();
                }
            });
        }
    }
}
