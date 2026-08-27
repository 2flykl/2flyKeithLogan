// Frontier Systems — Region III Playable Systems (Ebony Eyes, Return of the Aviator, I Was Away, FlyZone)
import * as THREE from '../../assets/three.module.js';
import { GALAXY_THEMES } from '../types.js';
import { createDecoratedPlanet, createDecoratedChild } from './decorated-object.js';
export class FrontierSystems {
    group;
    planetMeshes = [];
    children = [];
    labelContainer;
    time = 0;
    clickTargets = [];
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
        // Main planet geometry replaced with custom designed sprite & composite
        const size = obj.id === 'OBJ-EBONY' ? 360 : obj.id === 'OBJ-AVIATOR' ? 260 : obj.id === 'OBJ-AWAY' ? 320 : 280;
        const decPlanet = createDecoratedPlanet(obj.id, size, color);
        decPlanet.group.position.copy(pos);
        decPlanet.clickTarget.userData['objectId'] = obj.id;
        this.group.add(decPlanet.group);
        this.planetMeshes.push(decPlanet.group);
        this.clickTargets.push(decPlanet.clickTarget);
        // Orbit ring
        const ringGeo = new THREE.RingGeometry(650, 660, 48);
        const ringMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.2, side: THREE.DoubleSide, depthWrite: false });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.copy(pos);
        ring.rotation.x = -Math.PI / 2;
        this.group.add(ring);
        // Build children
        if (obj.children) {
            const radii = [700, 1100, 1600];
            for (let i = 0; i < obj.children.length; i++) {
                const child = obj.children[i];
                const r = radii[i] ?? 800 + i * 450;
                const angle = (i / obj.children.length) * Math.PI * 2;
                const mk = child.mediaKind ?? 'archive';
                const dec = createDecoratedChild(child, 65, color);
                dec.group.position.set(pos.x + Math.cos(angle) * r, pos.y, pos.z + Math.sin(angle) * r);
                const clickTarget = dec.clickTarget;
                clickTarget.userData['childId'] = child.id;
                clickTarget.userData['contentStatus'] = child.contentStatus;
                clickTarget.userData['mediaUrl'] = child.mediaUrl;
                this.group.add(dec.group);
                this.clickTargets.push(clickTarget);
                const el = document.createElement('div');
                el.className = 'universe-label frontier-child-label';
                el.style.cssText = `
          position:absolute;top:0;left:0;pointer-events:none;
          font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,0.85vw,10px);
          letter-spacing:0.1em;text-transform:uppercase;color:rgba(220,240,255,0);
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
                    mediaUrl: child.mediaUrl,
                    mesh: dec.group,
                    orbitRadius: r,
                    orbitSpeed: 0.2 + (i % 3) * 0.08,
                    orbitAngle: angle,
                    parentPos: pos,
                    labelEl: el,
                });
            }
        }
    }
    update(dt, camera, renderer) {
        this.time += dt;
        for (const m of this.planetMeshes) {
            m.rotation.y += dt * 0.1;
            m.rotation.x += dt * 0.05;
        }
        for (const c of this.children) {
            c.orbitAngle += dt * c.orbitSpeed * 0.72;
            c.mesh.position.set(c.parentPos.x + Math.cos(c.orbitAngle) * c.orbitRadius, c.parentPos.y + Math.sin(this.time * 0.5 + c.orbitRadius) * 25, c.parentPos.z + Math.sin(c.orbitAngle) * c.orbitRadius);
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
        for (const m of this.planetMeshes) {
            m.traverse((child) => {
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
