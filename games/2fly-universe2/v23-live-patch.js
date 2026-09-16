import * as THREE from './assets/three.module.js';
import { UniverseCamera } from './app-v21/camera.js';
import { GalaxyScene } from './app-v21/scene/galaxy.js';
import { GALAXY_THEMES } from './app-v21/types.js';

let installed = false;
let activeGalaxyId = null;
let cameraInstance = null;
let lastPointerX = window.innerWidth * 0.5;
let orbitDirection = 'right';
let guideEl = null;
let guideStateEl = null;
let toastEl = null;

const originalCameraUpdate = UniverseCamera.prototype.update;
const originalGalaxyUpdate = GalaxyScene.prototype.update;
const originalGalaxyLabels = GalaxyScene.prototype.updateLabels;

function ensureToast() {
  if (toastEl?.isConnected) return toastEl;
  toastEl = document.createElement('div');
  toastEl.id = 'v23-atlas-toast';
  toastEl.style.cssText = `position:fixed;left:50%;bottom:72px;transform:translateX(-50%);z-index:80;pointer-events:none;padding:7px 12px;border:1px solid rgba(150,220,255,.22);border-radius:999px;background:rgba(2,10,18,.74);color:#bfe8ff;font:600 9px 'Space Mono',monospace;letter-spacing:.14em;text-transform:uppercase;opacity:0;transition:opacity .18s ease;backdrop-filter:blur(7px)`;
  document.body.appendChild(toastEl);
  return toastEl;
}

function showToast(text) {
  const el = ensureToast();
  el.textContent = text;
  el.style.opacity = '1';
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => { el.style.opacity = '0'; }, 1500);
}
showToast.t = 0;

function addGuideStyles() {
  if (document.getElementById('v23-living-atlas-style')) return;
  const style = document.createElement('style');
  style.id = 'v23-living-atlas-style';
  style.textContent = `
    #zoom-anchor-reticle.v23-atlas{--guide-color:180,215,235;width:56px!important;height:56px!important;border-radius:50%!important;background:radial-gradient(circle at 35% 30%,rgba(var(--guide-color),.09),rgba(var(--guide-color),.025) 48%,transparent 72%)!important;border:1px solid rgba(var(--guide-color),.58)!important;box-shadow:0 0 20px rgba(var(--guide-color),.16),inset 0 0 18px rgba(var(--guide-color),.08)!important;overflow:visible;transition:opacity .16s ease,filter .18s ease!important}
    #zoom-anchor-reticle.v23-atlas:before,#zoom-anchor-reticle.v23-atlas:after{content:"";position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:rgba(var(--guide-color),.72);box-shadow:0 0 7px rgba(var(--guide-color),.3)}
    #zoom-anchor-reticle.v23-atlas:before{width:27px;height:1px}#zoom-anchor-reticle.v23-atlas:after{width:1px;height:27px}
    .v23-guide-core{position:absolute;left:50%;top:50%;width:4px;height:4px;border-radius:50%;background:rgba(var(--guide-color),.95);transform:translate(-50%,-50%);box-shadow:0 0 9px rgba(var(--guide-color),.65)}
    .v23-orbit-arrow{position:absolute;inset:-10px;opacity:0;transition:opacity .12s ease;filter:drop-shadow(0 0 4px rgba(var(--guide-color),.45))}
    .v23-orbit-arrow path{fill:none;stroke:rgba(var(--guide-color),.82);stroke-width:1.3;stroke-dasharray:5 6}.v23-orbit-arrow polygon{fill:rgba(var(--guide-color),.94)}
    .v23-forward{position:absolute;left:50%;top:50%;width:126px;height:48px;transform:translate(-18px,-50%);opacity:0;transition:opacity .12s ease;overflow:visible}
    .v23-lane{position:absolute;left:0;top:50%;width:98px;height:1px}.v23-lane.a{transform:translateY(-9px) rotate(-2deg)}.v23-lane.b{transform:translateY(9px) rotate(2deg)}
    .v23-pulse{position:absolute;left:0;top:-3px;width:16px;height:7px;border-top:1px solid rgba(var(--guide-color),.9);border-right:1px solid rgba(var(--guide-color),.9);transform:rotate(45deg);opacity:0;animation:v23Pulse 1s linear infinite}.v23-lane.b .v23-pulse{animation-delay:.18s}
    @keyframes v23Pulse{0%{left:0;opacity:0;transform:rotate(45deg) scale(.72)}18%{opacity:.95}78%{opacity:.72}100%{left:82px;opacity:0;transform:rotate(45deg) scale(1.18)}}
    #zoom-anchor-reticle.v23-atlas.is-orbiting .v23-orbit-arrow{opacity:1}#zoom-anchor-reticle.v23-atlas.orbit-left .v23-orbit-arrow{transform:scaleX(-1)}
    #zoom-anchor-reticle.v23-atlas.is-thrusting .v23-forward,#zoom-anchor-reticle.v23-atlas.is-drifting .v23-forward{opacity:1}
    #zoom-anchor-reticle.v23-atlas.is-thrusting{filter:brightness(1.28)}#zoom-anchor-reticle.v23-atlas.is-warp{filter:brightness(1.7);box-shadow:0 0 34px rgba(var(--guide-color),.35),inset 0 0 20px rgba(var(--guide-color),.12)!important}
    .v23-guide-state{position:absolute;left:50%;top:66px;transform:translateX(-50%);white-space:nowrap;color:rgba(var(--guide-color),.76);font:600 8px 'Space Mono',monospace;letter-spacing:.15em;text-shadow:0 0 7px rgba(var(--guide-color),.25)}
  `;
  document.head.appendChild(style);
}

function hydrateGuide() {
  const el = document.getElementById('zoom-anchor-reticle');
  if (!el || el.dataset.v23Atlas === '1') return false;
  addGuideStyles();
  el.dataset.v23Atlas = '1';
  el.classList.add('v23-atlas');
  el.innerHTML = `
    <span class="v23-guide-core"></span>
    <svg class="v23-orbit-arrow" viewBox="0 0 76 76" aria-hidden="true"><path d="M12 45 C16 15,53 8,64 32 C69 45,61 58,48 63"/><polygon points="46,59 53,63 46,67"/></svg>
    <div class="v23-forward"><span class="v23-lane a"><i class="v23-pulse"></i></span><span class="v23-lane b"><i class="v23-pulse"></i></span></div>
    <span class="v23-guide-state">UNIVERSE ATLAS</span>`;
  guideEl = el;
  guideStateEl = el.querySelector('.v23-guide-state');
  return true;
}

function nearestGalaxyColor() {
  if (!cameraInstance) return new THREE.Color(0xaed7ee);
  const pos = cameraInstance.camera.position;
  const ranked = Object.values(GALAXY_THEMES)
    .map(theme => ({ theme, d: pos.distanceTo(new THREE.Vector3(...theme.worldOffset)) }))
    .sort((a,b) => a.d - b.d);
  if (!ranked.length) return new THREE.Color(0xaed7ee);
  const c = new THREE.Color(ranked[0].theme.accentColor);
  if (ranked[1]) {
    const gap = Math.max(0, ranked[1].d - ranked[0].d);
    const mix = THREE.MathUtils.clamp((15000 - gap) / 15000, 0, .45);
    c.lerp(new THREE.Color(ranked[1].theme.accentColor), mix);
  }
  return c;
}

function updateGuide() {
  if (!guideEl?.isConnected) hydrateGuide();
  if (!guideEl || !cameraInstance) return;
  const c = nearestGalaxyColor();
  guideEl.style.setProperty('--guide-color', `${Math.round(c.r*255)},${Math.round(c.g*255)},${Math.round(c.b*255)}`);
  guideEl.classList.remove('is-orbiting','orbit-left','orbit-right','is-thrusting','is-warp','is-drifting');
  if (cameraInstance.isOrbiting) {
    guideEl.classList.add('is-orbiting', orbitDirection === 'left' ? 'orbit-left' : 'orbit-right');
    guideStateEl.textContent = cameraInstance.localGalaxyId ? 'ORBITING · LOCAL GALAXY' : 'ORBITING · DEEP SPACE';
  } else if (cameraInstance.isThrusting) {
    guideEl.classList.add('is-thrusting');
    if (cameraInstance.currentWarpFactor > .18) guideEl.classList.add('is-warp');
    guideStateEl.textContent = cameraInstance.currentWarpFactor > .18 ? 'WARP THRUST' : (cameraInstance.selectedTargetLabel ? `THRUST · ${cameraInstance.selectedTargetLabel}` : 'FORWARD THRUST');
  } else if (cameraInstance.travelSpeed > 300) {
    guideEl.classList.add('is-drifting');
    guideStateEl.textContent = 'FORWARD DRIFT';
  } else if (cameraInstance.selectedTargetLabel) {
    guideStateEl.textContent = `TARGET · ${cameraInstance.selectedTargetLabel}`;
  } else {
    guideStateEl.textContent = cameraInstance.localGalaxyId ? 'LOCAL ATLAS' : 'UNIVERSE ATLAS';
  }
}

function ensureGalaxyEnhancements(scene) {
  if (scene.__v23Enhanced) return;
  scene.__v23Enhanced = true;
  const theme = GALAXY_THEMES[scene.getId?.() || scene.data?.id];
  if (!theme) return;
  scene.__v23AtlasLines = [];
  const radius = scene.atmosphereRadius || 9000;
  for (let i = 0; i < 6; i++) {
    const pts = [];
    const rx = radius * (.47 + i * .07);
    const rz = radius * (.31 + i * .055);
    const yAmp = radius * (.018 + (i%3) * .009);
    for (let j = 0; j < 128; j++) {
      const a = (j / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a)*rx, Math.sin(a*2.15+i)*yAmp, Math.sin(a)*rz));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.085 + (i%2)*.018,depthWrite:false,blending:THREE.AdditiveBlending});
    const line = new THREE.LineLoop(geo, mat);
    line.rotation.x = .08 + i * .025;
    line.rotation.z = (i - 2.5) * .065;
    line.renderOrder = 2;
    scene.group.add(line);
    scene.__v23AtlasLines.push(line);
  }
  const count = 260;
  const positions = new Float32Array(count*3);
  for (let i=0;i<count;i++) {
    const a = Math.random()*Math.PI*2;
    const r = radius*(.90 + Math.random()*.18);
    positions[i*3] = Math.cos(a)*r;
    positions[i*3+1] = (Math.random()-.5)*radius*.28;
    positions[i*3+2] = Math.sin(a)*r;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.BufferAttribute(positions,3));
  const mat = new THREE.PointsMaterial({color:theme.accentColor,size:22,transparent:true,opacity:.075,depthWrite:false,blending:THREE.AdditiveBlending,sizeAttenuation:true});
  const haze = new THREE.Points(geo,mat);
  scene.group.add(haze);
  scene.__v23Haze = haze;
}

function pickGalaxyAt(clientX, clientY) {
  if (!cameraInstance) return null;
  let best = null;
  let bestPx = Infinity;
  const rect = cameraInstance.canvas?.getBoundingClientRect?.() || {left:0,top:0,width:window.innerWidth,height:window.innerHeight};
  for (const theme of Object.values(GALAXY_THEMES)) {
    const p = new THREE.Vector3(...theme.worldOffset).project(cameraInstance.camera);
    if (p.z < -1 || p.z > 1) continue;
    const sx = rect.left + (p.x*.5+.5)*rect.width;
    const sy = rect.top + (-p.y*.5+.5)*rect.height;
    const d = Math.hypot(clientX-sx,clientY-sy);
    const threshold = theme.status === 'showcase' ? 125 : 96;
    if (d < threshold && d < bestPx) { best = theme; bestPx = d; }
  }
  return best;
}

function installContextSelectionGate() {
  document.addEventListener('click', (e) => {
    const canvas = document.getElementById('universe-canvas');
    if (!canvas || e.target !== canvas || e.button !== 0 || !cameraInstance) return;
    const inside = cameraInstance.localGalaxyId || activeGalaxyId;
    if (inside) return; // local content is intentionally enabled only after entry.

    e.preventDefault();
    e.stopImmediatePropagation();
    const hit = pickGalaxyAt(e.clientX,e.clientY);
    if (hit) {
      const target = new THREE.Vector3(...hit.worldOffset);
      cameraInstance.setSelectedTarget(target, hit.title);
      showToast(`${hit.title} · GALAXY SELECTED`);
      if (guideStateEl) guideStateEl.textContent = `TARGET · ${hit.title}`;
    } else {
      cameraInstance.clearSelectedTarget();
      showToast('DEEP SPACE · GALAXIES ONLY');
    }
  }, true);
}

function installPointerState() {
  document.addEventListener('pointermove', (e) => {
    if ((e.buttons & 1) === 1 && Math.abs(e.clientX - lastPointerX) > 1) orbitDirection = e.clientX < lastPointerX ? 'left' : 'right';
    lastPointerX = e.clientX;
  }, {passive:true});
  window.addEventListener('universe-galaxy-threshold', (e) => {
    const d = e.detail || {};
    if (d.state === 'enter') activeGalaxyId = d.galaxyId;
    if (d.state === 'exit' && activeGalaxyId === d.galaxyId) activeGalaxyId = null;
  });
}

export function installV23LivePatch() {
  if (installed) return;
  installed = true;

  UniverseCamera.prototype.update = function(dt) {
    cameraInstance = this;
    const result = originalCameraUpdate.call(this, dt);
    updateGuide();
    return result;
  };

  GalaxyScene.prototype.update = function(time, cameraWorldPos) {
    ensureGalaxyEnhancements(this);
    const result = originalGalaxyUpdate.call(this, time, cameraWorldPos);
    const inside = !!this.thresholdState;
    if (this.__v23AtlasLines) {
      this.__v23AtlasLines.forEach((line,i) => {
        line.rotation.y += .00016 * (i%2 ? -1 : 1);
        line.material.opacity = (inside ? .055 : .095) + .018*Math.sin(time*.28+i*.8);
      });
    }
    if (this.__v23Haze) {
      this.__v23Haze.rotation.y += .00018;
      this.__v23Haze.material.opacity = inside ? .045 : .075;
    }
    return result;
  };

  GalaxyScene.prototype.updateLabels = function(camera, renderer, cameraWorldPos) {
    const result = originalGalaxyLabels.call(this, camera, renderer, cameraWorldPos);
    const localId = cameraInstance?.localGalaxyId || activeGalaxyId;
    if (!localId) return result;
    for (const entry of this.labelEls || []) {
      if (entry.kind !== 'galaxy') continue;
      if (this.data?.id === localId) {
        entry.el.style.left = '50%';
        entry.el.style.top = '58px';
        entry.el.style.transform = 'translate(-50%,0)';
        entry.el.style.opacity = '1';
        entry.el.style.zIndex = '32';
      } else {
        const current = Number(entry.el.style.opacity || '1');
        entry.el.style.opacity = String(Math.min(current, .18));
      }
    }
    return result;
  };

  installContextSelectionGate();
  installPointerState();
  const observer = new MutationObserver(() => hydrateGuide());
  observer.observe(document.documentElement,{childList:true,subtree:true});
  requestAnimationFrame(() => hydrateGuide());
}
