// Frontier Systems — curated presentation-ready systems
import * as THREE from 'three';
import { GALAXY_THEMES } from '../types.js';
import { createDecoratedPlanet, createDecoratedChild } from './decorated-object.js';

const LAYOUTS = {
    'OBJ-AWAY':    { size: 300, childSize: 58, radii: [1180, 1660, 2160, 2640], y: [150, -120, 180, -160], color: 0x6eaef7 },
    'OBJ-EBONY':   { size: 185, childSize: 44, radii: [880, 1260, 1650], y: [75, -70, 95], color: 0x799bd1 },
    'OBJ-AVIATOR': { size: 170, childSize: 42, radii: [840, 1210, 1570], y: [65, -75, 88], color: 0x88a9d0 },
    'OBJ-FLYZONE': { size: 158, childSize: 40, radii: [820, 1160], y: [60, -65], color: 0x7298c0 },
    'OBJ-TIGER':   { size: 158, childSize: 40, radii: [820, 1160], y: [60, -65], color: 0x7298c0 },
};

export class FrontierSystems {
    group;
    planetMeshes = [];
    children = [];
    labelContainer;
    time = 0;
    clickTargets = [];
    orbitFields = [];

    constructor(objects, labelContainer) {
        this.labelContainer = labelContainer;
        this.group = new THREE.Group();
        const [gx, gy, gz] = GALAXY_THEMES['G2025']?.worldOffset ?? [0, 0, 0];
        this.group.position.set(gx, gy, gz);
        for (const obj of objects) {
            if (obj.id === 'OBJ-FIRE' || obj.id === 'OBJ-AFRICA' || obj.id === 'OBJ-STREAMS') continue;
            this._buildSystem(obj);
        }
    }

    _buildSystem(obj) {
        const pos = new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z);
        const layout = LAYOUTS[obj.id] ?? { size: 165, childSize: 42, radii: [860, 1240, 1640], y: [70, -70, 90], color: 0x789ec8 };
        const color = obj.id === 'OBJ-AWAY' ? 0x6eaef7 : layout.color;

        const decPlanet = createDecoratedPlanet(obj.id, layout.size, color);
        decPlanet.group.position.copy(pos);
        decPlanet.clickTarget.userData['objectId'] = obj.id;
        this.group.add(decPlanet.group);
        this.planetMeshes.push(decPlanet.group);
        this.clickTargets.push(decPlanet.clickTarget);

        // A restrained transparent-record field around each project instead of one heavy ring.
        const orbitField = new THREE.Group();
        layout.radii.forEach((radius, ri) => {
            [-38, 0, 42].forEach((offset, bi) => {
                const width = bi === 1 ? 4 : 2;
                const ring = new THREE.Mesh(
                    new THREE.RingGeometry(radius + offset, radius + offset + width, 96),
                    new THREE.MeshBasicMaterial({
                        color: 0xf1f7ff,
                        transparent: true,
                        opacity: bi === 1 ? 0.085 : 0.035,
                        side: THREE.DoubleSide,
                        depthWrite: false,
                    }),
                );
                ring.position.copy(pos);
                ring.rotation.x = -Math.PI / 2;
                ring.rotation.z = ri % 2 ? 0.025 : -0.018;
                orbitField.add(ring);
            });
        });
        this.group.add(orbitField);
        this.orbitFields.push(orbitField);

        if (!obj.children) return;
        for (let i = 0; i < obj.children.length; i++) {
            const child = obj.children[i];
            const radius = layout.radii[i] ?? layout.radii[layout.radii.length - 1] + 420 * (i - layout.radii.length + 1);
            const angle = (i / Math.max(1, obj.children.length)) * Math.PI * 2 + (obj.id === 'OBJ-AWAY' ? 0.18 : 0);
            const mk = child.mediaKind ?? 'archive';
            const size = mk === 'playable' ? layout.childSize * 1.12 : layout.childSize;
            const dec = createDecoratedChild(child, size, color);
            const yOff = layout.y[i % layout.y.length] ?? 0;
            dec.group.position.set(pos.x + Math.cos(angle) * radius, pos.y + yOff, pos.z + Math.sin(angle) * radius);
            dec.clickTarget.userData['childId'] = child.id;
            dec.clickTarget.userData['contentStatus'] = child.contentStatus;
            dec.clickTarget.userData['mediaUrl'] = child.mediaUrl;
            dec.clickTarget.userData['posterUrl'] = child.posterUrl;
            this.group.add(dec.group);
            this.clickTargets.push(dec.clickTarget);

            const el = document.createElement('div');
            el.className = 'universe-label frontier-child-label';
            el.style.cssText = `position:absolute;top:0;left:0;pointer-events:none;font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,.82vw,10px);letter-spacing:.1em;text-transform:uppercase;color:rgba(220,240,255,0);white-space:nowrap;transform:translate(-50%,-130%);transition:color .3s;user-select:none;text-align:center;line-height:1.4;`;
            const icon = mk === 'playable' ? '◇ PLAYABLE' : (mk === 'audio' ? '♪ AUDIO' : (mk === 'video' ? '▶ VIDEO' : '◐ ARCHIVE'));
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
                orbitSpeed: 0.12 + (i % 3) * 0.035,
                orbitAngle: angle,
                orbitY: yOff,
                parentPos: pos,
                labelEl: el,
            });
        }
    }

    update(dt, camera, renderer) {
        this.time += dt;
        for (const m of this.planetMeshes) {
            m.rotation.y += dt * 0.055;
            m.rotation.x += dt * 0.012;
        }
        this.orbitFields.forEach((field, index) => {
            field.rotation.y += dt * (0.020 + index * 0.0025);
        });
        for (const c of this.children) {
            c.orbitAngle += dt * c.orbitSpeed * 0.72;
            c.mesh.position.set(
                c.parentPos.x + Math.cos(c.orbitAngle) * c.orbitRadius,
                c.parentPos.y + c.orbitY + Math.sin(this.time * 0.32 + c.orbitRadius) * 16,
                c.parentPos.z + Math.sin(c.orbitAngle) * c.orbitRadius,
            );
            c.mesh.rotation.y += dt * 0.36;
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
            const opacity = 1 - Math.min(1, Math.max(0, (dist - 760) / (2850 - 760)));
            const ndc = worldPos.clone().project(camera);
            if (ndc.z > 1 || opacity < 0.02) { c.labelEl.style.opacity = '0'; continue; }
            c.labelEl.style.opacity = String(opacity);
            c.labelEl.style.left = `${(ndc.x * .5 + .5) * width}px`;
            c.labelEl.style.top = `${(-ndc.y * .5 + .5) * height}px`;
        }
    }

    getChildData(id) { return this.children.find(c => c.id === id); }

    dispose() {
        for (const c of this.children) {
            c.mesh.traverse(child => {
                if (child.isMesh) {
                    child.geometry?.dispose();
                    if (Array.isArray(child.material)) child.material.forEach(mat => mat.dispose());
                    else child.material?.dispose();
                } else if (child.isSprite) child.material?.dispose();
            });
            c.labelEl.remove();
        }
        for (const m of this.planetMeshes) {
            m.traverse(child => {
                if (child.isMesh) {
                    child.geometry?.dispose();
                    if (Array.isArray(child.material)) child.material.forEach(mat => mat.dispose());
                    else child.material?.dispose();
                } else if (child.isSprite) child.material?.dispose();
            });
        }
    }
}
