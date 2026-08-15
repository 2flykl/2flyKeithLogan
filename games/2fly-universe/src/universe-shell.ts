// Universe Shell — persistent Three.js scene orchestrator

import * as THREE from 'three';
import { initRenderer, startRenderLoop, getRenderer } from './renderer';
import { UniverseCamera } from './camera';
import { BackgroundScene } from './scene/background';
import { GalaxyScene } from './scene/galaxy';
import { StarLayer } from './scene/star-layer';
import { StreamsSystem } from './scene/streams-system';
import { HUD } from './ui/hud';
import { store } from './state/universe-store';
import { router } from './router';
import {
  loadUniverseData, indexUniverseData, getAllGalaxies,
  getAllCelestialObjects, getGalaxyWorldOffset, getRegionWorldCenter
} from './data/universe-data';
import { starRepository } from './data/star-repository';
import { GALAXY_THEMES } from './types';
import type { UniverseRoute, StarRecord } from './types';
import {
  openAudioOverlay, openVideoOverlay, openPlayableOverlay, openArchiveOverlay
} from './overlays/media-overlays';
import { openStarPlacementOverlay } from './overlays/star-placement';
import { openStarViewOverlay, openStarCardOverlay, playStarArrivalSequence } from './overlays/star-card-export';

export async function initUniverseShell(canvas: HTMLCanvasElement) {
  const overlayLayer = document.getElementById('overlay-layer')!;
  const uiLayer = document.getElementById('ui-layer')!;
  const labelContainer = document.getElementById('css3d-layer')!;
  const loadingStatus = document.getElementById('loading-status');

  // ── Renderer & Scene ─────────────────────────────────────────────────────

  const renderer = initRenderer(canvas);
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000408, 0.0000018);

  const cam = new UniverseCamera(canvas);
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // ── Load data ────────────────────────────────────────────────────────────

  if (loadingStatus) loadingStatus.textContent = 'Loading Universe data…';
  const data = await loadUniverseData();
  indexUniverseData(data);

  if (loadingStatus) loadingStatus.textContent = 'Building galaxies…';
  await new Promise(r => setTimeout(r, 0)); // yield to paint

  // ── Background ───────────────────────────────────────────────────────────

  const bg = new BackgroundScene();
  scene.add(bg.group);

  // ── Galaxy scenes ────────────────────────────────────────────────────────

  const galaxyScenes: GalaxyScene[] = [];
  for (const g of getAllGalaxies()) {
    const gs = new GalaxyScene(g, labelContainer);
    scene.add(gs.group);
    galaxyScenes.push(gs);
  }

  // ── Star layer ───────────────────────────────────────────────────────────

  if (loadingStatus) loadingStatus.textContent = 'Placing visitor stars…';
  await new Promise(r => setTimeout(r, 0));

  const starLayer = new StarLayer(labelContainer);
  scene.add(starLayer.group);

  const stars = await starRepository.loadStars();
  store.set('stars', stars);
  starLayer.setStars(stars, store.get('myStarId'));

  // ── Streams system ───────────────────────────────────────────────────────

  let streamsSystem: StreamsSystem | null = null;
  const celestialObjects = getAllCelestialObjects();
  const streamsData = celestialObjects.find(o => o.id === 'OBJ-STREAMS');
  if (streamsData) {
    streamsSystem = new StreamsSystem(streamsData, labelContainer);
    scene.add(streamsSystem.group);
  }

  // ── HUD ──────────────────────────────────────────────────────────────────

  const hud = new HUD(uiLayer);

  // ── Lighting ─────────────────────────────────────────────────────────────

  const ambient = new THREE.AmbientLight(0x080c12, 1.0);
  scene.add(ambient);

  // ── Click handling ───────────────────────────────────────────────────────

  let overlayClose: (() => void) | null = null;

  function openOverlay(fn: (container: HTMLElement, onClose: () => void) => (() => void)) {
    if (overlayClose) { overlayClose(); overlayClose = null; }
    const snap = cam.snapshot();
    store.pushCameraSnapshot(snap);
    overlayLayer.setAttribute('aria-hidden', 'false');
    overlayLayer.classList.add('overlay-active');

    overlayClose = fn(overlayLayer, () => {
      overlayLayer.setAttribute('aria-hidden', 'true');
      overlayLayer.classList.remove('overlay-active');
      overlayClose = null;
      // Restore camera
      const prev = store.popCameraSnapshot();
      if (prev) cam.restoreSnapshot(prev);
    });
  }

  canvas.addEventListener('click', (e) => {
    if (overlayClose) return;
    if (store.get('placementMode')) return;

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, cam.camera);

    // Check Streams click targets
    if (streamsSystem) {
      const hits = raycaster.intersectObjects(streamsSystem.clickTargets);
      if (hits.length > 0) {
        const obj = hits[0].object;
        const childId = obj.userData['childId'] as string | undefined;
        const objectId = obj.userData['objectId'] as string | undefined;

        if (childId) {
          const childData = streamsSystem.getChildData(childId);
          if (childData) {
            // Fly camera toward child
            const wp = new THREE.Vector3();
            obj.getWorldPosition(wp);
            cam.flyTo(
              { x: wp.x + 300, y: wp.y + 200, z: wp.z + 500 },
              { x: wp.x, y: wp.y, z: wp.z },
              { duration: 900, onDone: () => openMediaOverlay(childData) }
            );
          }
          return;
        }

        if (objectId === 'OBJ-STREAMS') {
          const wp = streamsSystem.getPlanetWorldPos();
          cam.flyTo(
            { x: wp.x + 1200, y: wp.y + 600, z: wp.z + 1200 },
            { x: wp.x, y: wp.y, z: wp.z },
            { duration: 1000 }
          );
          return;
        }
      }
    }

    // Check star clicks
    const starHit = starLayer.getClickTarget(raycaster);
    if (starHit) {
      const star = store.get('stars').find(s => s.id === starHit.starId);
      if (star) {
        openOverlay((container, onClose) =>
          openStarViewOverlay(container, star, onClose)
        );
      }
    }
  });

  // Placement mode click
  canvas.addEventListener('click', (e) => {
    if (!store.get('placementMode')) return;

    // Raycast to find XZ plane at Y=0
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, cam.camera);

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const point = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, point);
    if (!point) return;

    // Find which galaxy/region we're near
    let nearestGalaxy = 'G2020';
    let nearestRegion = 'G2020-R2';
    let nearestDist = Infinity;

    for (const gid of Object.keys(GALAXY_THEMES)) {
      const [ox, , oz] = getGalaxyWorldOffset(gid);
      const d = Math.sqrt((point.x - ox) ** 2 + (point.z - oz) ** 2);
      if (d < nearestDist) {
        nearestDist = d;
        nearestGalaxy = gid;
        nearestRegion = `${gid}-R1`;
      }
    }

    store.set('placementMode', false);
    hud.setPlacementMode(false);

    openOverlay((container, onClose) =>
      openStarPlacementOverlay(container, {
        galaxyId: nearestGalaxy,
        regionId: nearestRegion,
        x: point.x, y: point.y + 50, z: point.z,
      }, (placed) => {
        if (placed) {
          const myId = starRepository.getMyStarId();
          if (myId) {
            starRepository.getStarById(myId).then(star => {
              if (star) {
                starLayer.addStar(star);
                // Fly to new star
                cam.flyTo(
                  { x: star.x + 500, y: star.y + 300, z: star.z + 500 },
                  { x: star.x, y: star.y, z: star.z },
                  { duration: 1200 }
                );
              }
            });
          }
        }
        onClose();
      })
    );
  });

  function openMediaOverlay(child: ReturnType<StreamsSystem['getChildData']>) {
    if (!child) return;
    const mk = child.mediaKind;
    // Bridge OrbitChild to ChildObjectData via unknown
    type CD = import('./types').ChildObjectData;
    const asChild = child as unknown as CD;
    if (mk === 'audio') {
      openOverlay((c, onClose) => openAudioOverlay(c, asChild, onClose));
    } else if (mk === 'video') {
      openOverlay((c, onClose) => openVideoOverlay(c, asChild, onClose));
    } else if (mk === 'playable') {
      const gameChild = { ...asChild, mediaUrl: '/games/streams/' };
      openOverlay((c, onClose) => openPlayableOverlay(c, gameChild, onClose));
    } else {
      openOverlay((c, onClose) => openArchiveOverlay(c, asChild, onClose));
    }
  }

  // ── Placement mode setup ──────────────────────────────────────────────────

  window.addEventListener('universe-start-placement', () => {
    hud.setPlacementMode(true);
    // Show reticle hint
    showPlacementHint();
  });

  function showPlacementHint() {
    const hint = document.createElement('div');
    hint.id = 'placement-hint';
    hint.style.cssText = `
      position:absolute;bottom:100px;left:50%;transform:translateX(-50%);
      background:rgba(0,4,12,0.85);
      border:1px solid rgba(80,160,255,0.25);
      border-radius:8px;padding:10px 20px;
      font-family:'Space Mono',monospace;font-size:0.65rem;letter-spacing:0.12em;
      color:#4080c0;text-transform:uppercase;
      pointer-events:none;z-index:60;
      animation:fade-in-text 0.3s ease;
    `;
    hint.textContent = 'Click anywhere in the Universe to place your star';
    uiLayer.appendChild(hint);

    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.textContent = 'CANCEL';
    cancel.style.cssText = `
      position:absolute;bottom:60px;left:50%;transform:translateX(-50%);
      background:rgba(40,0,0,0.6);border:1px solid rgba(180,60,60,0.3);
      border-radius:4px;padding:6px 14px;
      font-family:'Space Grotesk',sans-serif;font-size:0.7rem;letter-spacing:0.1em;
      color:#b06060;cursor:pointer;z-index:60;text-transform:uppercase;
    `;
    cancel.addEventListener('click', () => {
      store.set('placementMode', false);
      hud.setPlacementMode(false);
      hint.remove();
      cancel.remove();
    });
    uiLayer.appendChild(cancel);

    // Auto-remove when not in placement mode
    const unsub = store.subscribe('placementMode', (active) => {
      if (!active) { hint.remove(); cancel.remove(); unsub(); }
    });
  }

  // ── Router ───────────────────────────────────────────────────────────────

  router.init();
  router.on(async (route: UniverseRoute) => {
    if (route.type === 'star' && route.starId) {
      const star = await starRepository.getStarById(route.starId);
      if (star) {
        await playStarArrivalSequence(overlayLayer, star, () => {
          // Fly to star
          cam.flyTo(
            { x: star.x + 800, y: star.y + 400, z: star.z + 800 },
            { x: star.x, y: star.y, z: star.z },
            {
              duration: 3000,
              onDone: () => {
                openOverlay((c, onClose) => openStarViewOverlay(c, star, onClose));
              }
            }
          );
        });
      }
    }
    if (route.type === 'galaxy' && route.galaxyId) {
      const [ox, oy, oz] = getGalaxyWorldOffset(route.galaxyId);
      cam.flyTo(
        { x: ox + 8000, y: oy + 3000, z: oz + 8000 },
        { x: ox, y: oy, z: oz },
        { duration: 1800 }
      );
      store.set('currentGalaxyId', route.galaxyId);
    }
    if (route.type === 'universe') {
      cam.flyTo(
        { x: 55000, y: 12000, z: 35000 },
        { x: 55000, y: 0, z: 0 },
        { duration: 1400 }
      );
    }
  });

  // ESC to go back
  window.addEventListener('universe-esc', () => {
    if (overlayClose) { overlayClose(); return; }
    router.back();
  });

  // ── Render loop ──────────────────────────────────────────────────────────

  let time = 0;

  startRenderLoop((dt) => {
    time += dt;
    cam.update(dt);

    const camPos = cam.camera.position;

    // Detect nearest galaxy
    let nearestGalaxy: string | null = null;
    let nearestDist = Infinity;
    for (const [gid, theme] of Object.entries(GALAXY_THEMES)) {
      const [ox, , oz] = theme.worldOffset;
      const d = Math.sqrt((camPos.x - ox) ** 2 + (camPos.z - oz) ** 2);
      if (d < nearestDist) { nearestDist = d; nearestGalaxy = gid; }
    }
    if (nearestGalaxy !== store.get('currentGalaxyId')) {
      store.set('currentGalaxyId', nearestGalaxy);
    }

    bg.update(time);
    for (const gs of galaxyScenes) {
      gs.update(time);
      gs.updateLabels(cam.camera, renderer, camPos);
    }
    streamsSystem?.update(dt, cam.camera, renderer);
    starLayer.update(camPos, cam.camera, renderer);

    renderer.render(scene, cam.camera);
  });

  // ── Hide loading screen ──────────────────────────────────────────────────

  store.set('loaded', true);
  const loading = document.getElementById('loading-screen');
  if (loading) {
    loading.style.transition = 'opacity 0.8s';
    loading.style.opacity = '0';
    setTimeout(() => loading.remove(), 800);
  }
}
