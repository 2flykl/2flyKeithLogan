import * as THREE from 'three';
import { GALAXY_THEMES } from '../types.js';
import { createDecoratedChild } from './decorated-object.js';
export class AfricaSystem {
  group; planetMesh; cloudMesh; birdParticles; children = []; labelContainer; time = 0; objectData; clickTargets = [];
  constructor(objectData, labelContainer) {
    this.objectData = objectData;
    this.labelContainer = labelContainer;
    this.group = new THREE.Group();
    const [gx, gy, gz] = GALAXY_THEMES['G2025']?.worldOffset ?? [0, 0, 0];
    this.group.position.set(gx + objectData.position.x, gy + objectData.position.y, gz + objectData.position.z);
    this.buildPlanet();
    this.buildClouds();
    this.buildBirds();
    this.buildRecordOrbits();
    this.buildChildren();
  }
  buildPlanet() {
    const geo = new THREE.SphereGeometry(500, 48, 48);
    const mat = new THREE.ShaderMaterial({ uniforms: { time: { value: 0 }, goldColor: { value: new THREE.Color(0xd58b33) }, earthColor: { value: new THREE.Color(0x231206) }, greenTone: { value: new THREE.Color(0x4d6b28) }, sunRay: { value: new THREE.Color(0xffe6ab) } }, vertexShader: `varying vec3 vNormal; varying vec3 vPos; uniform float time; void main(){ vNormal=normalize(normalMatrix*normal); vPos=position; vec3 displaced = position + normal * (11.0 * sin(position.y * 0.007 + time * 0.7) * cos(position.x * 0.005 + time * 0.45)); gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced,1.0); }`, fragmentShader: `uniform vec3 goldColor; uniform vec3 earthColor; uniform vec3 greenTone; uniform vec3 sunRay; uniform float time; varying vec3 vNormal; varying vec3 vPos; void main(){ vec3 viewDir = normalize(cameraPosition - vPos); float rim = pow(1.0 - max(0.0, dot(vNormal, viewDir)), 2.1); float elevation = 0.5 + 0.5 * sin(vPos.y * 0.008 + vPos.x * 0.006 + time * 0.35); vec3 terrain = mix(earthColor, greenTone, smoothstep(0.35, 0.7, elevation)); vec3 base = mix(terrain, goldColor, 0.44); gl_FragColor = vec4(mix(base, sunRay, rim * 0.68), 1.0); }` });
    this.planetMesh = new THREE.Mesh(geo, mat);
    this.planetMesh.userData.objectId = this.objectData.id;
    this.group.add(this.planetMesh);
    this.clickTargets.push(this.planetMesh);
    this.group.add(new THREE.PointLight(0xd18c36, 1.5, 7600));
  }
  buildClouds() {
    this.cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(530, 36, 36), new THREE.MeshBasicMaterial({ color: 0xffefc8, transparent: true, opacity: 0.12, depthWrite: false, blending: THREE.AdditiveBlending }));
    this.group.add(this.cloudMesh);
  }
  buildBirds() {
    const count = 300; const geo = new THREE.BufferGeometry(); const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) { const theta = Math.random() * Math.PI * 2; const r = 620 + Math.random() * 520; pos[i * 3] = Math.cos(theta) * r; pos[i * 3 + 1] = (Math.random() - 0.5) * 320; pos[i * 3 + 2] = Math.sin(theta) * r; }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.birdParticles = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffcf7a, size: 10, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false }));
    this.group.add(this.birdParticles);
  }
  buildRecordOrbits() {
    [1140, 1440, 1760, 2100, 2460, 2840, 3240, 3660, 4100].forEach((r) => {
      const ring = new THREE.Mesh(new THREE.RingGeometry(r - 2.2, r + 2.2, 160), new THREE.MeshBasicMaterial({ color: 0xfaf5eb, transparent: true, opacity: 0.095, side: THREE.DoubleSide, depthWrite: false }));
      ring.rotation.x = -Math.PI / 2;
      this.group.add(ring);
    });
  }
  buildChildren() {
    const radii = [1280, 1760, 2240, 2720, 3200, 3740];
    const speeds = [0.24, 0.2, 0.17, 0.145, 0.12, 0.1];
    const heights = [160, -130, 220, -180, 260, -220];
    const children = this.objectData.children ?? [];
    children.forEach((child, i) => {
      const angle = i / children.length * Math.PI * 2 + 0.2;
      const mk = child.mediaKind ?? 'archive';
      const dec = createDecoratedChild(child, 78, 0xd18c36, this.objectData.id);
      dec.group.position.set(Math.cos(angle) * radii[i], heights[i], Math.sin(angle) * radii[i]);
      dec.clickTarget.userData.childId = child.id;
      dec.clickTarget.userData.contentStatus = child.contentStatus;
      dec.clickTarget.userData.mediaUrl = child.mediaUrl;
      dec.clickTarget.userData.posterUrl = child.posterUrl;
      this.group.add(dec.group);
      this.clickTargets.push(dec.clickTarget);
      const el = document.createElement('div');
      el.className = 'universe-label africa-child-label';
      el.style.cssText = "position:absolute;top:0;left:0;pointer-events:none;font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,0.85vw,10px);letter-spacing:.12em;text-transform:uppercase;color:rgba(255,235,198,0);white-space:nowrap;transform:translate(-50%,-130%);user-select:none;text-align:center;line-height:1.35;";
      const icon = mk === 'playable' ? 'PLAY' : mk === 'audio' ? 'AUDIO' : mk === 'video' ? 'VIDEO' : 'ARCHIVE';
      el.innerHTML = `<span>${icon}</span><br/><span>${child.title}</span>`;
      this.labelContainer.appendChild(el);
      this.children.push({ id: child.id, title: child.title, mediaKind: mk, contentStatus: child.contentStatus ?? 'live', mediaUrl: child.mediaUrl, posterUrl: child.posterUrl, mesh: dec.group, orbitRadius: radii[i], orbitSpeed: speeds[i], orbitAngle: angle, orbitY: heights[i], bobPhase: Math.random() * Math.PI * 2, labelEl: el });
    });
  }
  update(dt, camera, renderer) {
    this.time += dt;
    this.planetMesh.material.uniforms.time.value = this.time;
    this.planetMesh.rotation.y += dt * 0.035;
    this.cloudMesh.rotation.y += dt * 0.05;
    this.birdParticles.rotation.y += dt * 0.08;
    for (const c of this.children) {
      c.orbitAngle += dt * c.orbitSpeed * 0.56;
      c.mesh.position.set(Math.cos(c.orbitAngle) * c.orbitRadius, c.orbitY + Math.sin(this.time * 0.7 + c.bobPhase) * 24, Math.sin(c.orbitAngle) * c.orbitRadius);
      c.mesh.rotation.y += dt * 0.35;
    }
    this.updateLabels(camera, renderer);
  }
  updateLabels(camera, renderer) {
    const { width, height } = renderer.domElement.getBoundingClientRect();
    const cameraWorld = new THREE.Vector3();
    camera.getWorldPosition(cameraWorld);
    for (const c of this.children) {
      const worldPos = new THREE.Vector3();
      c.mesh.getWorldPosition(worldPos);
      const dist = cameraWorld.distanceTo(worldPos);
      const opacity = 1 - Math.min(1, Math.max(0, (dist - 1200) / 5000));
      const ndc = worldPos.clone().project(camera);
      const x = (ndc.x * 0.5 + 0.5) * width;
      const y = (-(ndc.y * 0.5) + 0.5) * height;
      if (ndc.z > 1 || opacity < 0.02) c.labelEl.style.opacity = '0';
      else { c.labelEl.style.opacity = String(opacity); c.labelEl.style.left = `${x}px`; c.labelEl.style.top = `${y}px`; }
    }
  }
  getChildData(id) { return this.children.find((c) => c.id === id); }
  dispose() { this.children.forEach((c) => c.labelEl.remove()); }
}
