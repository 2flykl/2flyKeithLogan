import * as THREE from 'three';
import { GALAXY_THEMES } from '../types.js';
import { createDecoratedPlanet, createDecoratedChild } from './decorated-object.js';
export class FrontierSystems {
  group; planetMeshes = []; children = []; labelContainer; time = 0; clickTargets = [];
  constructor(objects, labelContainer) {
    this.labelContainer = labelContainer;
    this.group = new THREE.Group();
    const [gx, gy, gz] = GALAXY_THEMES['G2025']?.worldOffset ?? [0, 0, 0];
    this.group.position.set(gx, gy, gz);
    objects.filter((o) => o.id === 'OBJ-AWAY').forEach((o) => this.buildSystem(o));
  }
  buildSystem(obj) {
    const pos = new THREE.Vector3(obj.position.x, obj.position.y, obj.position.z);
    const color = 0x55c7ff;
    const planet = createDecoratedPlanet(obj.id, 330, color);
    planet.group.position.copy(pos);
    planet.clickTarget.userData.objectId = obj.id;
    this.group.add(planet.group);
    this.planetMeshes.push(planet.group);
    this.clickTargets.push(planet.clickTarget);
    [920, 1160, 1440, 1760, 2120, 2520, 2960].forEach((r) => {
      const ring = new THREE.Mesh(new THREE.RingGeometry(r - 2, r + 2, 160), new THREE.MeshBasicMaterial({ color: 0xf5f8ff, transparent: true, opacity: 0.09, side: THREE.DoubleSide, depthWrite: false }));
      ring.position.copy(pos);
      ring.rotation.x = -Math.PI / 2;
      this.group.add(ring);
    });
    const children = obj.children ?? [];
    const childRadii = [1060, 1720, 2460];
    const speeds = [0.28, 0.19, 0.13];
    const heights = [120, -130, 170];
    children.forEach((child, i) => {
      const angle = i / children.length * Math.PI * 2 + 0.4;
      const mk = child.mediaKind ?? 'archive';
      const dec = createDecoratedChild(child, 76, color, obj.id);
      dec.group.position.set(pos.x + Math.cos(angle) * childRadii[i], pos.y + heights[i], pos.z + Math.sin(angle) * childRadii[i]);
      dec.clickTarget.userData.childId = child.id;
      dec.clickTarget.userData.contentStatus = child.contentStatus;
      dec.clickTarget.userData.mediaUrl = child.mediaUrl;
      dec.clickTarget.userData.posterUrl = child.posterUrl;
      this.group.add(dec.group);
      this.clickTargets.push(dec.clickTarget);
      const el = document.createElement('div');
      el.className = 'universe-label frontier-child-label';
      el.style.cssText = "position:absolute;top:0;left:0;pointer-events:none;font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,0.85vw,10px);letter-spacing:.12em;text-transform:uppercase;color:rgba(221,236,255,0);white-space:nowrap;transform:translate(-50%,-130%);user-select:none;text-align:center;line-height:1.35;";
      const icon = mk === 'playable' ? 'PLAY' : mk === 'audio' ? 'AUDIO' : mk === 'video' ? 'VIDEO' : 'ARCHIVE';
      el.innerHTML = `<span>${icon}</span><br/><span>${child.title}</span>`;
      this.labelContainer.appendChild(el);
      this.children.push({ id: child.id, title: child.title, mediaKind: mk, contentStatus: child.contentStatus ?? 'live', mediaUrl: child.mediaUrl, posterUrl: child.posterUrl, mesh: dec.group, orbitRadius: childRadii[i], orbitSpeed: speeds[i], orbitAngle: angle, orbitY: heights[i], bobPhase: Math.random() * Math.PI * 2, parentPos: pos, labelEl: el });
    });
  }
  update(dt, camera, renderer) {
    this.time += dt;
    this.planetMeshes.forEach((m) => { m.rotation.y += dt * 0.03; });
    this.children.forEach((c) => {
      c.orbitAngle += dt * c.orbitSpeed * 0.6;
      c.mesh.position.set(c.parentPos.x + Math.cos(c.orbitAngle) * c.orbitRadius, c.parentPos.y + c.orbitY + Math.sin(this.time * 0.72 + c.bobPhase) * 18, c.parentPos.z + Math.sin(c.orbitAngle) * c.orbitRadius);
      c.mesh.rotation.y += dt * 0.34;
    });
    this.updateLabels(camera, renderer);
  }
  updateLabels(camera, renderer) {
    const { width, height } = renderer.domElement.getBoundingClientRect();
    const cameraWorld = new THREE.Vector3();
    camera.getWorldPosition(cameraWorld);
    this.children.forEach((c) => {
      const worldPos = new THREE.Vector3();
      c.mesh.getWorldPosition(worldPos);
      const dist = cameraWorld.distanceTo(worldPos);
      const opacity = 1 - Math.min(1, Math.max(0, (dist - 900) / 3800));
      const ndc = worldPos.clone().project(camera);
      const x = (ndc.x * 0.5 + 0.5) * width;
      const y = (-(ndc.y * 0.5) + 0.5) * height;
      if (ndc.z > 1 || opacity < 0.02) c.labelEl.style.opacity = '0';
      else { c.labelEl.style.opacity = String(opacity); c.labelEl.style.left = `${x}px`; c.labelEl.style.top = `${y}px`; }
    });
  }
  getChildData(id) { return this.children.find((c) => c.id === id); }
  dispose() { this.children.forEach((c) => c.labelEl.remove()); }
}
