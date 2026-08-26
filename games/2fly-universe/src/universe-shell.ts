// Universe Shell — Phase II Persistent Spatial Orchestrator Engine

import * as THREE from 'three';
import { initRenderer, startRenderLoop, getRenderer } from './renderer';
import { UniverseCamera } from './camera';
import { BackgroundScene } from './scene/background';
import { GalaxyScene } from './scene/galaxy';
import { StarLayer } from './scene/star-layer';
import { StreamsSystem } from './scene/streams-system';
import { ThruTheFireSystem } from './scene/thru-the-fire-system';
import { AfricaSystem } from './scene/africa-system';
import { FrontierSystems } from './scene/frontier-systems';
import { EraOrbitSystem } from './scene/era-orbit-system';
import { HUD } from './ui/hud';
import { GalacticNavigator } from './ui/galactic-navigator';
import { TourBuilder } from './ui/tour-builder';
import type { TourStop } from './tour-types';
import { store } from './state/universe-store';
import { router } from './router';
import {
  loadUniverseData, indexUniverseData, getAllGalaxies,
  getAllCelestialObjects, getGalaxyWorldOffset, getRegionWorldCenter, getObjectWorldPosition
} from './data/universe-data';
import { starRepository } from './data/star-repository';
import { GALAXY_THEMES } from './types';
import type { UniverseRoute, StarRecord, ChildObjectData } from './types';
import {
  openAudioOverlay, openVideoOverlay, openPlayableOverlay, openArchiveOverlay
} from './overlays/media-overlays';
import { openStarPlacementOverlay } from './overlays/star-placement';
import { openStarViewOverlay, playStarArrivalSequence } from './overlays/star-card-export';
import { audioManager } from './audio/audio-manager';

export async function initUniverseShell(canvas: HTMLCanvasElement) {
  const overlayLayer = document.getElementById('overlay-layer')!;
  const uiLayer = document.getElementById('ui-layer')!;
  const labelContainer = document.getElementById('css3d-layer')!;
  const loadingStatus = document.getElementById('loading-status');

  // ── Renderer & Scene ─────────────────────────────────────────────────────

  const renderer = initRenderer(canvas);
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000408, 0.0000015);

  const cam = new UniverseCamera(canvas);
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // ── Load data ────────────────────────────────────────────────────────────

  if (loadingStatus) loadingStatus.textContent = 'Loading Universe data…';
  const data = await loadUniverseData();
  indexUniverseData(data);

  if (loadingStatus) loadingStatus.textContent = 'Building 3D galaxies…';
  await new Promise(r => setTimeout(r, 0));

  // ── Background ───────────────────────────────────────────────────────────

  const bg = new BackgroundScene();
  scene.add(bg.group);

  // ── Non-Linear Galaxy Scenes ──────────────────────────────────────────────

  const galaxyScenes: GalaxyScene[] = [];
  for (const g of getAllGalaxies()) {
    const gs = new GalaxyScene(g, labelContainer);
    scene.add(gs.group);
    galaxyScenes.push(gs);
  }


  // ── Explorable non-live era orbital shells (only G2025 opens real media) ──
  const eraOrbitSystems: EraOrbitSystem[] = [];
  for (const gid of ['G2000','G2005','G2010','G2015','G2020','G2030']) {
    const era = new EraOrbitSystem(gid);
    scene.add(era.group);
    eraOrbitSystems.push(era);
  }

  // ── Visitor Star Layer ───────────────────────────────────────────────────

  if (loadingStatus) loadingStatus.textContent = 'Placing visitor star clusters…';
  await new Promise(r => setTimeout(r, 0));

  const starLayer = new StarLayer(labelContainer);
  scene.add(starLayer.group);

  const stars = await starRepository.loadStars();
  store.set('stars', stars);
  starLayer.setStars(stars, store.get('myStarId'));

  // ── Phase II 2025–2029 Showcase Systems ──────────────────────────────────

  let streamsSystem: StreamsSystem | null = null;
  let fireSystem: ThruTheFireSystem | null = null;
  let africaSystem: AfricaSystem | null = null;
  let frontierSystems: FrontierSystems | null = null;

  const celestialObjects = getAllCelestialObjects();

  // Region I: Thru the Fire
  const fireData = celestialObjects.find(o => o.id === 'OBJ-FIRE');
  if (fireData) {
    fireSystem = new ThruTheFireSystem(fireData, labelContainer);
    scene.add(fireSystem.group);
  }

  // Region II: The Awakening (Africa)
  const africaData = celestialObjects.find(o => o.id === 'OBJ-AFRICA');
  if (africaData) {
    africaSystem = new AfricaSystem(africaData, labelContainer);
    scene.add(africaSystem.group);
  }

  // Region III: The Playable Frontier (Streams + Ebony Eyes + Aviator + Away + FlyZone)
  const streamsData = celestialObjects.find(o => o.id === 'OBJ-STREAMS');
  if (streamsData) {
    streamsSystem = new StreamsSystem(streamsData, labelContainer);
    scene.add(streamsSystem.group);
  }

  frontierSystems = new FrontierSystems(celestialObjects, labelContainer);
  scene.add(frontierSystems.group);

  // ── Spatial Focus Locator (visitor position / snap ring) ────────────────

  const locatorGeometry = new THREE.RingGeometry(900, 980, 72);
  const locatorMaterial = new THREE.MeshBasicMaterial({
    color: 0x77818c,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const userLocator = new THREE.Mesh(locatorGeometry, locatorMaterial);
  userLocator.rotation.x = -Math.PI / 2;
  userLocator.position.copy(cam.getTarget());
  userLocator.position.y += 24;
  userLocator.renderOrder = 8;
  scene.add(userLocator);

  const locatorTarget = userLocator.position.clone();
  let locatorScaleTarget = 1;


  // Screen-space zoom anchor reticle. It follows the pointer; clicking only places
  // the world locator and never forces travel.
  const zoomReticle = document.createElement('div');
  zoomReticle.id = 'zoom-anchor-reticle';
  zoomReticle.setAttribute('aria-hidden', 'true');
  zoomReticle.style.cssText = `
    position:fixed;left:50%;top:50%;width:34px;height:34px;border-radius:50%;
    border:1px solid rgba(175,190,205,.62);box-shadow:0 0 16px rgba(160,190,220,.16),inset 0 0 12px rgba(210,225,240,.06);
    transform:translate(-50%,-50%);pointer-events:none;z-index:28;opacity:0;
    transition:opacity .18s ease;
  `;
  zoomReticle.innerHTML = `<span style="position:absolute;left:50%;top:50%;width:4px;height:4px;border-radius:50%;background:rgba(210,220,230,.72);transform:translate(-50%,-50%);"></span>`;
  uiLayer.appendChild(zoomReticle);
  let lastPointer = { x: window.innerWidth/2, y: window.innerHeight/2 };
  let reticlePinned = false;

  function placeZoomReticle(x: number, y: number, pinned = false) {
    reticlePinned = pinned;
    zoomReticle.style.left = `${x}px`;
    zoomReticle.style.top = `${y}px`;
    zoomReticle.style.opacity = pinned ? '0.95' : '0.82';
  }

  function clearZoomReticleAndAnchor() {
    reticlePinned = false;
    cam.clearZoomAnchor();
    zoomReticle.style.opacity = '0';
  }

  canvas.addEventListener('pointermove', (e) => {
    lastPointer = { x:e.clientX, y:e.clientY };
    if (!reticlePinned) placeZoomReticle(e.clientX, e.clientY, false);
  });
  canvas.addEventListener('pointerleave', () => { if (!reticlePinned) zoomReticle.style.opacity = '0'; });
  canvas.addEventListener('wheel', () => {
    zoomReticle.animate([{transform:'translate(-50%,-50%) scale(1)'},{transform:'translate(-50%,-50%) scale(1.18)'},{transform:'translate(-50%,-50%) scale(1)'}],{duration:320,easing:'ease-out'});
  }, {passive:true});

  function setLocatorTarget(worldPos: THREE.Vector3Like, scale = 1) {
    locatorTarget.set(worldPos.x, worldPos.y + 24, worldPos.z);
    locatorScaleTarget = scale;
  }


  function travelToWorldAndSnap(
    worldPos: THREE.Vector3Like,
    distanceRadius: number,
    opts: Parameters<typeof cam.travelToObject>[2] = {},
    locatorScale = 1
  ) {
    setLocatorTarget(worldPos, locatorScale);
    cam.travelToObject(worldPos, distanceRadius, opts);
  }

  // ── HUD & Galactic Navigator UI ──────────────────────────────────────────

  const hud = new HUD(uiLayer, {
    onResetView: () => {
      clearZoomReticleAndAnchor();
      cam.resetToHome();
      setLocatorTarget(cam.getTarget(), 1);
      hud.setReturnAvailable(cam.hasHistory());
    },
    onReturnPrevious: () => {
      clearZoomReticleAndAnchor();
      cam.returnToPrevious();
      setLocatorTarget(cam.getTarget(), 1);
      hud.setReturnAvailable(cam.hasHistory());
    },
    onTakeTour: () => {
      tourBuilder.open();
    },
    onNextTour: () => {
      nextTourStop();
    },
    onPrevTour: () => {
      prevTourStop();
    },
    onExitTour: () => {
      exitTour();
    },
    onTourInfo: () => {
      showTourInfo();
    },
    onFinishTour: () => {
      finishTour();
    },
    onViewMyStar: async (starId) => {
      const star = await starRepository.getStarById(starId);
      if (star) {
        travelToWorldAndSnap({ x: star.x, y: star.y, z: star.z }, 600, {
          onDone: () => {
            openOverlay((c, onClose) => openStarViewOverlay(c, star, onClose));
          }
        });
      }
    },
  });

  const navigator = new GalacticNavigator(uiLayer, {
    onTravelToGalaxy: (galaxyId) => {
      const [gx, gy, gz] = getGalaxyWorldOffset(galaxyId);
      travelToWorldAndSnap({ x: gx, y: gy, z: gz }, 14000, {}, 6.5);
      hud.setReturnAvailable(cam.hasHistory());
    },
    onTravelToRegion: (galaxyId, regionId) => {
      const [rx, ry, rz] = getRegionWorldCenter(galaxyId, regionId);
      travelToWorldAndSnap({ x: rx, y: ry, z: rz }, 4500, {}, 1.65);
      hud.setReturnAvailable(cam.hasHistory());
    },
    onTravelToObject: (objectId) => {
      const obj = celestialObjects.find(o => o.id === objectId);
      if (obj) {
        const [ox, oy, oz] = getObjectWorldPosition(obj);
        travelToWorldAndSnap({ x: ox, y: oy, z: oz }, 1600, {}, 1.05);
        hud.setReturnAvailable(cam.hasHistory());
      }
    },
  });
  _ = navigator;

  const availableTourStops: TourStop[] = celestialObjects.map(obj => {
    const [x, y, z] = getObjectWorldPosition(obj);
    return {
      id: obj.id,
      objectId: obj.id,
      name: obj.title,
      subtitle: obj.subtitle,
      pos: { x, y, z },
    };
  });

  const tourBuilder = new TourBuilder(uiLayer, availableTourStops, {
    onPlay: (stops) => startTour(stops),
  });

  // ── Lighting ─────────────────────────────────────────────────────────────

  const ambient = new THREE.AmbientLight(0x0a0f18, 1.1);
  scene.add(ambient);

  // ── Click Handling (Click-To-Travel & Overlays) ──────────────────────────

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
      const prev = store.popCameraSnapshot();
      if (prev) cam.restoreSnapshot(prev);
    });
  }

  let pointerDownAt: { x: number; y: number } | null = null;
  let pointerDragged = false;
  let selectedActionKey = '';

  canvas.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return;
    pointerDownAt = { x: e.clientX, y: e.clientY };
    pointerDragged = false;
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!pointerDownAt) return;
    if (Math.hypot(e.clientX - pointerDownAt.x, e.clientY - pointerDownAt.y) > 7) pointerDragged = true;
  });
  window.addEventListener('pointerup', (e) => {
    if (e.button === 0) pointerDownAt = null;
  });

  type PickableSystem = {
    clickTargets: THREE.Object3D[];
    getChildData(id: string): unknown;
  };

  /**
   * V13 reliable picking: normal 3D raycast first, then a forgiving screen-space fallback.
   * This is selection only; proximity/collision can never open media.
   */
  function pickOrbitTarget(system: PickableSystem, e: MouseEvent): THREE.Object3D | null {
    const hits = raycaster.intersectObjects(system.clickTargets, true);
    if (hits.length) return hits[0].object;

    let best: THREE.Object3D | null = null;
    let bestPx = Infinity;
    const thresholdPx = 58;
    const rect = canvas.getBoundingClientRect();
    for (const obj of system.clickTargets) {
      const wp = new THREE.Vector3();
      obj.getWorldPosition(wp);
      const ndc = wp.clone().project(cam.camera);
      if (ndc.z < -1 || ndc.z > 1) continue;
      const sx = rect.left + (ndc.x * 0.5 + 0.5) * rect.width;
      const sy = rect.top + (-ndc.y * 0.5 + 0.5) * rect.height;
      const d = Math.hypot(e.clientX - sx, e.clientY - sy);
      if (d < thresholdPx && d < bestPx) {
        best = obj;
        bestPx = d;
      }
    }
    return best;
  }

  function selectWorldTarget(key: string, label: string, worldPos: THREE.Vector3) {
    selectedActionKey = key;
    cam.setSelectedTarget(worldPos, label);
    cam.placeZoomAnchor(
      ((worldPos.clone().project(cam.camera).x * 0.5 + 0.5) * window.innerWidth),
      ((-worldPos.clone().project(cam.camera).y * 0.5 + 0.5) * window.innerHeight),
    );
    setLocatorTarget(worldPos, 1.35);
    showNotification(`${label} · SELECTED${key.startsWith('child:') || key.startsWith('star:') ? ' · CLICK AGAIN TO OPEN' : ''}`);
  }

  canvas.addEventListener('click', (e) => {
    if (overlayClose) return;
    if (store.get('placementMode')) return;
    if (pointerDragged) { pointerDragged = false; return; }
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, cam.camera);

    const systems: Array<{ system: PickableSystem | null; planetLabel?: string }> = [
      { system: fireSystem as unknown as PickableSystem | null, planetLabel: 'THRU THE FIRE' },
      { system: africaSystem as unknown as PickableSystem | null, planetLabel: 'I WOKE UP IN AFRICA' },
      { system: streamsSystem as unknown as PickableSystem | null, planetLabel: 'STREAMS' },
      { system: frontierSystems as unknown as PickableSystem | null },
    ];

    for (const { system, planetLabel } of systems) {
      if (!system) continue;
      const obj = pickOrbitTarget(system, e);
      if (!obj) continue;

      // Decorated composites may put metadata on the collider parent or direct object.
      const source = obj.userData['childId'] || obj.userData['objectId'] ? obj : obj.parent ?? obj;
      const childId = (obj.userData['childId'] ?? source.userData['childId']) as string | undefined;
      const objectId = (obj.userData['objectId'] ?? source.userData['objectId']) as string | undefined;
      const wp = new THREE.Vector3();
      obj.getWorldPosition(wp);

      if (childId) {
        const childData = system.getChildData(childId) as ChildObjectData | undefined;
        if (!childData) return;
        const label = childData.title || childId;
        const key = `child:${childId}`;
        if (selectedActionKey === key) {
          showNotification(`${label} · OPENING`);
          openMediaOverlay(childData);
          return;
        }
        selectWorldTarget(key, label, wp);
        return;
      }

      if (objectId) {
        const label = planetLabel ?? objectId.replace(/^OBJ-/, '').replaceAll('-', ' ');
        selectWorldTarget(`object:${objectId}`, label, wp);
        return;
      }
    }

    // Historical era objects can be selected/focused, but never auto-open anything.
    for (const era of eraOrbitSystems) {
      const hit = era.getHit(raycaster);
      if (hit) {
        const key = `archive:${hit.title}`;
        if (selectedActionKey === key) {
          showNotification(`${hit.title} · ARCHIVE NOT YET CURATED`);
          return;
        }
        selectWorldTarget(key, hit.title, hit.worldPos);
        return;
      }
    }

    // Visitor stars use the same explicit first-click select / second-click open rule.
    const starHit = starLayer.getClickTarget(raycaster);
    if (starHit) {
      const star = store.get('stars').find(s => s.id === starHit.starId);
      if (star) {
        const key = `star:${star.id}`;
        const wp = new THREE.Vector3(star.x, star.y, star.z);
        if (selectedActionKey === key) {
          showNotification(`${star.displayName} · OPENING`);
          openOverlay((container, onClose) => openStarViewOverlay(container, star, onClose));
          return;
        }
        selectWorldTarget(key, star.displayName || 'STAR', wp);
        return;
      }
    }

    // Empty space only places the gray selector and clears media selection.
    // Travel is owned by the right-mouse thruster; empty-space clicks never auto-fly.
    selectedActionKey = '';
    cam.clearSelectedTarget();
    const focusPoint = cam.placeZoomAnchor(e.clientX, e.clientY);
    setLocatorTarget(focusPoint, 1.25);
    placeZoomReticle(e.clientX, e.clientY, true);
    zoomReticle.animate(
      [{ transform: 'translate(-50%,-50%) scale(0.92)' }, { transform: 'translate(-50%,-50%) scale(1.12)' }, { transform: 'translate(-50%,-50%) scale(1)' }],
      { duration: 260, easing: 'ease-out' },
    );
  });

  let preStarPlacementCameraState: ReturnType<typeof cam.snapshot> | null = null;
  let placementBannerEl: HTMLElement | null = null;

  function removePlacementBanner() {
    if (placementBannerEl) {
      placementBannerEl.remove();
      placementBannerEl = null;
    }
  }

  function cancelPlacementMode() {
    removePlacementBanner();
    store.set('placementMode', false);
    hud.setPlacementMode(false);
    if (preStarPlacementCameraState) {
      cam.restoreSnapshot(preStarPlacementCameraState, true);
    }
  }

  window.addEventListener('universe-start-placement', () => {
    preStarPlacementCameraState = cam.snapshot();
    removePlacementBanner();

    placementBannerEl = document.createElement('div');
    placementBannerEl.id = 'placement-mode-banner';
    placementBannerEl.style.cssText = `
      position:fixed;top:16px;left:50%;transform:translateX(-50%);
      background:rgba(2,10,24,0.92);border:1px solid rgba(96,255,208,0.4);
      border-radius:8px;padding:8px 16px;display:flex;align-items:center;gap:12px;
      z-index:60;font-family:'Space Mono',monospace;font-size:0.7rem;color:#60ffd0;
      box-shadow:0 8px 32px rgba(0,0,0,0.6);
    `;
    placementBannerEl.innerHTML = `
      <span>✦ PLACING STAR — CLICK ANYWHERE TO CHOOSE COORDINATE</span>
      <button id="cancel-placement-banner-btn" type="button" style="
        background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);
        border-radius:4px;color:#8ab4d4;padding:4px 10px;cursor:pointer;
        font-family:'Space Mono',monospace;font-size:0.65rem;
      ">← CANCEL</button>
    `;
    uiLayer.appendChild(placementBannerEl);

    placementBannerEl.querySelector('#cancel-placement-banner-btn')?.addEventListener('click', () => {
      cancelPlacementMode();
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && store.get('placementMode')) {
      cancelPlacementMode();
    }
  });

  // Star placement canvas click handler
  canvas.addEventListener('click', (e) => {
    if (!store.get('placementMode')) return;

    removePlacementBanner();

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, cam.camera);

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const point = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, point);
    if (!point) return;

    let nearestGalaxy = 'G2025';
    let nearestRegion = 'G2025-R3';
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
                travelToWorldAndSnap({ x: star.x, y: star.y, z: star.z }, 600);
              }
            });
          }
        } else {
          // Placement cancelled — restore exact prior camera state
          if (preStarPlacementCameraState) {
            cam.restoreSnapshot(preStarPlacementCameraState, true);
            setLocatorTarget({ x: preStarPlacementCameraState.target[0], y: preStarPlacementCameraState.target[1], z: preStarPlacementCameraState.target[2] }, 1);
          }
        }
        onClose();
      })
    );
  });

  function openMediaOverlay(child: ChildObjectData) {
    if (!child) return;
    const mk = child.mediaKind;
    if (mk === 'audio') {
      openOverlay((c, onClose) => openAudioOverlay(c, child, onClose));
    } else if (mk === 'video') {
      openOverlay((c, onClose) => openVideoOverlay(c, child, onClose));
    } else if (mk === 'playable') {
      openOverlay((c, onClose) => openPlayableOverlay(c, child, onClose));
    } else {
      openOverlay((c, onClose) => openArchiveOverlay(c, child, onClose));
    }
  }

  // ── Custom Tour State ──────────────────────────────────────────────────
  let tourPlaylist: TourStop[] = [];
  let tourIndex = -1;
  let tourSnapshot: ReturnType<typeof cam.snapshot> | null = null;

  function announceTourStop() {
    const stop = tourPlaylist[tourIndex];
    if (!stop) return;
    hud.setTourProgress(tourIndex + 1, tourPlaylist.length, stop.name);
    showNotification(`DESTINATION ${tourIndex + 1}/${tourPlaylist.length} — ${stop.name}`);
  }

  function startTour(stops?: TourStop[]) {
    tourPlaylist = (stops?.length ? stops : tourBuilder.getStops()).slice();
    if (tourPlaylist.length === 0) { tourBuilder.open(); return; }
    tourIndex = 0;
    tourSnapshot = cam.snapshot();
    hud.setTourActive(true);
    hud.setTourProgress(1, tourPlaylist.length, tourPlaylist[0].name);
    travelToWorldAndSnap(tourPlaylist[0].pos, 1500, { onDone: announceTourStop }, 1.05);
  }

  function nextTourStop() {
    if (tourIndex < 0 || tourIndex >= tourPlaylist.length - 1) return;
    tourIndex++;
    const stop = tourPlaylist[tourIndex];
    hud.setTourProgress(tourIndex + 1, tourPlaylist.length, stop.name);
    travelToWorldAndSnap(stop.pos, 1500, { onDone: announceTourStop }, 1.05);
  }

  function prevTourStop() {
    if (tourIndex <= 0) return;
    tourIndex--;
    const stop = tourPlaylist[tourIndex];
    hud.setTourProgress(tourIndex + 1, tourPlaylist.length, stop.name);
    travelToWorldAndSnap(stop.pos, 1500, { onDone: announceTourStop }, 1.05);
  }

  function showTourInfo() {
    const stop = tourPlaylist[tourIndex];
    if (!stop) return;
    showNotification(stop.subtitle ? `${stop.name} — ${stop.subtitle}` : stop.name);
  }

  function exitTour() {
    if (tourSnapshot) {
      cam.restoreSnapshot(tourSnapshot, true);
      setLocatorTarget({ x: tourSnapshot.target[0], y: tourSnapshot.target[1], z: tourSnapshot.target[2] }, 1);
    }
    hud.setTourActive(false);
    hud.setTourProgress(0, 0, '');
    tourPlaylist = []; tourIndex = -1; tourSnapshot = null;
  }

  function finishTour() {
    hud.setTourActive(false);
    hud.setTourProgress(0, 0, '');
    showNotification('TOUR COMPLETE — EXPLORE FREELY');
    tourPlaylist = []; tourIndex = -1; tourSnapshot = null;
  }

  function takeGuidedTour() {
    tourBuilder.open();
  }

  function showNotification(text: string) {
    const banner = document.createElement('div');
    banner.style.cssText = `
      position:absolute;top:70px;left:50%;transform:translateX(-50%);
      background:rgba(2,10,24,0.9);border:1px solid rgba(80,160,240,0.3);
      border-radius:6px;padding:8px 16px;font-family:'Space Mono',monospace;
      font-size:0.65rem;letter-spacing:0.15em;color:#8ab4d4;
      text-transform:uppercase;pointer-events:none;z-index:60;
      animation:fade-in-text 0.3s ease;
    `;
    banner.textContent = text;
    uiLayer.appendChild(banner);
    setTimeout(() => banner.remove(), 3000);
  }

  let activeGalaxyPlateId: string | null = null;

  function playGalaxyPlateThresholdEffect(kind: 'enter' | 'exit', galaxyId: string) {
    const theme = GALAXY_THEMES[galaxyId];
    if (!theme) return;
    const accent = new THREE.Color(theme.accentColor);
    const primary = new THREE.Color(theme.primaryColor);
    const accentRgb = `${Math.round(accent.r * 255)}, ${Math.round(accent.g * 255)}, ${Math.round(accent.b * 255)}`;
    const primaryRgb = `${Math.round(primary.r * 255)}, ${Math.round(primary.g * 255)}, ${Math.round(primary.b * 255)}`;
    const plate = document.createElement('div');
    plate.style.cssText = `
      position:fixed;inset:0;pointer-events:none;z-index:75;
      display:flex;align-items:flex-start;justify-content:center;padding-top:104px;
      background:transparent;
      mix-blend-mode:screen;opacity:0;
      animation:${kind === 'enter' ? 'galaxy-threshold-enter' : 'galaxy-threshold-exit'} ${kind === 'enter' ? '1150ms' : '950ms'} ease forwards; backdrop-filter:blur(2px);
    `;
    plate.innerHTML = `
      <div style="padding:14px 18px;border-radius:999px;border:1px solid rgba(${accentRgb},0.34);background:rgba(2,12,24,0.32);backdrop-filter:blur(2px);font-family:'Space Mono',monospace;font-size:0.72rem;letter-spacing:0.22em;text-transform:uppercase;color:rgb(${kind === 'enter' ? '210,255,240' : '180,205,230'});box-shadow:0 0 28px rgba(${accentRgb},0.18);">
        ${kind === 'enter' ? 'Entering' : 'Exiting'} ${theme.title}${kind === 'exit' ? ' · RETURNING TO DEEP SPACE' : ''}
      </div>
    `;
    if (!document.getElementById('galaxy-threshold-style')) {
      const st = document.createElement('style');
      st.id = 'galaxy-threshold-style';
      st.textContent = `
        @keyframes galaxy-threshold-enter {
          0% { opacity:0; transform:scale(0.96); filter:blur(12px); }
          20% { opacity:1; transform:scale(1); filter:blur(0); }
          100% { opacity:0; transform:scale(1.06); filter:blur(10px); }
        }
        @keyframes galaxy-threshold-exit {
          0% { opacity:0; transform:scale(1.04); filter:blur(10px); }
          20% { opacity:0.92; transform:scale(1); filter:blur(0); }
          100% { opacity:0; transform:scale(0.96); filter:blur(12px); }
        }
      `;
      document.head.appendChild(st);
    }
    overlayLayer.appendChild(plate);
    setTimeout(() => plate.remove(), kind === 'enter' ? 1100 : 900);
  }

  // ── First Entry Title Moment for 2025–2029 ──────────────────────────────

  let hasShownEntryTitle = false;
  function triggerEntryTitle() {
    if (hasShownEntryTitle) return;
    hasShownEntryTitle = true;
    const titleCard = document.createElement('div');
    titleCard.style.cssText = `
      position:fixed;inset:0;pointer-events:none;z-index:90;
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      text-align:center;font-family:'Space Mono',monospace;
      animation:title-fade 3.5s ease forwards;
    `;
    titleCard.innerHTML = `
      <div style="font-size:0.7rem;letter-spacing:0.3em;color:#4090c0;margin-bottom:8px;text-transform:uppercase;">
        2FLY UNIVERSE
      </div>
      <div style="font-size:clamp(1.2rem,3vw,2rem);letter-spacing:0.2em;color:#60ffd0;font-weight:bold;margin-bottom:8px;">
        2025 — 2029
      </div>
      <div style="font-size:0.75rem;letter-spacing:0.2em;color:#4a7898;text-transform:uppercase;">
        THE CURRENT GALAXY
      </div>
    `;

    if (!document.getElementById('title-anim-style')) {
      const s = document.createElement('style');
      s.id = 'title-anim-style';
      s.textContent = `
        @keyframes title-fade {
          0% { opacity:0; transform:scale(0.96); }
          20% { opacity:1; transform:scale(1); }
          75% { opacity:1; transform:scale(1); }
          100% { opacity:0; transform:scale(1.04); }
        }
      `;
      document.head.appendChild(s);
    }
    overlayLayer.appendChild(titleCard);
    setTimeout(() => titleCard.remove(), 3600);
  }

  // Trigger title card on initial launch
  setTimeout(triggerEntryTitle, 1000);

  // ── Router ───────────────────────────────────────────────────────────────

  router.init();
  router.on(async (route: UniverseRoute) => {
    if (route.type === 'star' && route.starId) {
      const star = await starRepository.getStarById(route.starId);
      if (star) {
        await playStarArrivalSequence(overlayLayer, star, () => {
          travelToWorldAndSnap({ x: star.x, y: star.y, z: star.z }, 700, {
            onDone: () => {
              openOverlay((c, onClose) => openStarViewOverlay(c, star, onClose));
            }
          });
        });
      }
    }
    if (route.type === 'galaxy' && route.galaxyId) {
      const [ox, oy, oz] = getGalaxyWorldOffset(route.galaxyId);
      travelToWorldAndSnap({ x: ox, y: oy, z: oz }, 12000, {}, 6.5);
      store.set('currentGalaxyId', route.galaxyId);
    }
    if (route.type === 'universe') {
      cam.resetToHome();
      setLocatorTarget(cam.getTarget(), 1);
    }
  });

  window.addEventListener('universe-esc', () => {
    if (overlayClose) { overlayClose(); return; }
    router.back();
  });

  // ── Main Render & Spatial Audio Loop ─────────────────────────────────────

  let time = 0;

  startRenderLoop((dt) => {
    time += dt;
    cam.update(dt);

    const camPos = cam.camera.position;

    // Determine nearest galaxy
    let nearestGalaxy: string | null = null;
    let nearestDist = Infinity;
    for (const [gid, theme] of Object.entries(GALAXY_THEMES)) {
      const [ox, oy, oz] = theme.worldOffset;
      const d = Math.hypot(camPos.x - ox, camPos.y - oy, camPos.z - oz);
      if (d < nearestDist) { nearestDist = d; nearestGalaxy = gid; }
    }
    if (nearestGalaxy !== store.get('currentGalaxyId')) {
      store.set('currentGalaxyId', nearestGalaxy);
    }

    if (activeGalaxyPlateId) {
      const activeScene = galaxyScenes.find(gs => gs.getId() === activeGalaxyPlateId);
      if (!activeScene || activeScene.distanceTo(camPos) > activeScene.getShellBoundaryRadius() * 1.08) {
        if (activeGalaxyPlateId) playGalaxyPlateThresholdEffect('exit', activeGalaxyPlateId);
        activeGalaxyPlateId = null;
        cam.setLocalGalaxyCenter(null);
      }
    }
    if (!activeGalaxyPlateId) {
      const entryScene = galaxyScenes.find(gs => gs.distanceTo(camPos) < gs.getShellBoundaryRadius() * 0.96);
      if (entryScene) {
        activeGalaxyPlateId = entryScene.getId();
        const activeTheme = GALAXY_THEMES[activeGalaxyPlateId];
        if (activeTheme) {
          const [gx, gy, gz] = activeTheme.worldOffset;
          cam.setLocalGalaxyCenter({ x: gx, y: gy, z: gz });
        }
        playGalaxyPlateThresholdEffect('enter', activeGalaxyPlateId);
      }
    }

    // Determine spatial audio theme based on camera proximity
    if (camPos.distanceTo(new THREE.Vector3(-4500, 40, -2500)) < 4000) {
      audioManager.setRegionTheme('fire');
    } else if (camPos.distanceTo(new THREE.Vector3(0, 40, 4000)) < 4000) {
      audioManager.setRegionTheme('africa');
    } else if (camPos.distanceTo(new THREE.Vector3(4000, 40, -2000)) < 4500) {
      audioManager.setRegionTheme('frontier');
    } else {
      audioManager.setRegionTheme(null);
    }

    bg.update(time);
    for (const era of eraOrbitSystems) era.update(dt);
    for (const gs of galaxyScenes) {
      gs.update(time, camPos);
      gs.updateLabels(cam.camera, renderer, camPos, activeGalaxyPlateId);
    }

    userLocator.position.lerp(locatorTarget, 0.14);
    const targetScale = new THREE.Vector3(locatorScaleTarget, locatorScaleTarget, locatorScaleTarget);
    userLocator.scale.lerp(targetScale, 0.14);
    userLocator.rotation.z += dt * 0.28;
    locatorMaterial.opacity = 0.22 + 0.09 * (0.5 + 0.5 * Math.sin(time * 1.4));

    fireSystem?.update(dt, cam.camera, renderer);
    africaSystem?.update(dt, cam.camera, renderer);
    streamsSystem?.update(dt, cam.camera, renderer);
    frontierSystems?.update(dt, cam.camera, renderer);
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let _: unknown;
