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

  // ── HUD & Galactic Navigator UI ──────────────────────────────────────────

  const hud = new HUD(uiLayer, {
    onResetView: () => {
      cam.resetToHome();
      hud.setReturnAvailable(cam.hasHistory());
    },
    onReturnPrevious: () => {
      cam.returnToPrevious();
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
        cam.travelToObject({ x: star.x, y: star.y, z: star.z }, 600, {
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
      cam.travelToObject({ x: gx, y: gy, z: gz }, 14000);
      hud.setReturnAvailable(cam.hasHistory());
    },
    onTravelToRegion: (galaxyId, regionId) => {
      const [rx, ry, rz] = getRegionWorldCenter(galaxyId, regionId);
      cam.travelToObject({ x: rx, y: ry, z: rz }, 4500);
      hud.setReturnAvailable(cam.hasHistory());
    },
    onTravelToObject: (objectId) => {
      const obj = celestialObjects.find(o => o.id === objectId);
      if (obj) {
        const [ox, oy, oz] = getObjectWorldPosition(obj);
        cam.travelToObject({ x: ox, y: oy, z: oz }, 1600);
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
  canvas.addEventListener('pointerdown', (e) => { pointerDownAt = { x: e.clientX, y: e.clientY }; pointerDragged = false; });
  canvas.addEventListener('pointermove', (e) => {
    if (!pointerDownAt) return;
    if (Math.hypot(e.clientX - pointerDownAt.x, e.clientY - pointerDownAt.y) > 7) pointerDragged = true;
  });
  window.addEventListener('pointerup', () => { pointerDownAt = null; });

  canvas.addEventListener('click', (e) => {
    if (overlayClose) return;
    if (store.get('placementMode')) return;
    if (pointerDragged) { pointerDragged = false; return; }

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, cam.camera);

    // 1. Check Thru the Fire system
    if (fireSystem) {
      const hits = raycaster.intersectObjects(fireSystem.clickTargets);
      if (hits.length > 0) {
        const obj = hits[0].object;
        const childId = obj.userData['childId'] as string | undefined;
        if (childId) {
          const childData = fireSystem.getChildData(childId);
          if (childData) {
            const wp = new THREE.Vector3();
            obj.getWorldPosition(wp);
            cam.travelToObject(wp, 600, {
              onDone: () => openMediaOverlay(childData as unknown as ChildObjectData)
            });
          }
          return;
        }
        if (obj.userData['objectId'] === 'OBJ-FIRE') {
          cam.travelToObject(fireSystem.getPlanetWorldPos(), 1500);
          return;
        }
      }
    }

    // 2. Check Africa system
    if (africaSystem) {
      const hits = raycaster.intersectObjects(africaSystem.clickTargets);
      if (hits.length > 0) {
        const obj = hits[0].object;
        const childId = obj.userData['childId'] as string | undefined;
        if (childId) {
          const childData = africaSystem.getChildData(childId);
          if (childData) {
            const wp = new THREE.Vector3();
            obj.getWorldPosition(wp);
            cam.travelToObject(wp, 600, {
              onDone: () => openMediaOverlay(childData as unknown as ChildObjectData)
            });
          }
          return;
        }
        if (obj.userData['objectId'] === 'OBJ-AFRICA') {
          cam.travelToObject(africaSystem.getPlanetWorldPos(), 1500);
          return;
        }
      }
    }

    // 3. Check Streams system
    if (streamsSystem) {
      const hits = raycaster.intersectObjects(streamsSystem.clickTargets);
      if (hits.length > 0) {
        const obj = hits[0].object;
        const childId = obj.userData['childId'] as string | undefined;
        if (childId) {
          const childData = streamsSystem.getChildData(childId);
          if (childData) {
            const wp = new THREE.Vector3();
            obj.getWorldPosition(wp);
            cam.travelToObject(wp, 600, {
              onDone: () => openMediaOverlay(childData as unknown as ChildObjectData)
            });
          }
          return;
        }
        if (obj.userData['objectId'] === 'OBJ-STREAMS') {
          cam.travelToObject(streamsSystem.getPlanetWorldPos(), 1500);
          return;
        }
      }
    }

    // 4. Check Frontier systems (Ebony Eyes, Aviator, Away, FlyZone)
    if (frontierSystems) {
      const hits = raycaster.intersectObjects(frontierSystems.clickTargets);
      if (hits.length > 0) {
        const obj = hits[0].object;
        const childId = obj.userData['childId'] as string | undefined;
        const objectId = obj.userData['objectId'] as string | undefined;
        if (childId) {
          const childData = frontierSystems.getChildData(childId);
          if (childData) {
            const wp = new THREE.Vector3();
            obj.getWorldPosition(wp);
            cam.travelToObject(wp, 600, {
              onDone: () => openMediaOverlay(childData as unknown as ChildObjectData)
            });
          }
          return;
        }
        if (objectId) {
          const wp = new THREE.Vector3();
          obj.getWorldPosition(wp);
          cam.travelToObject(wp, 1400);
          return;
        }
      }
    }

    // 5. Check Visitor Star hits
    const starHit = starLayer.getClickTarget(raycaster);
    if (starHit) {
      const star = store.get('stars').find(s => s.id === starHit.starId);
      if (star) {
        openOverlay((container, onClose) =>
          openStarViewOverlay(container, star, onClose)
        );
        return;
      }
    }

    // Empty-space navigation: wherever the visitor clicks becomes the travel direction.
    cam.travelTowardScreenPoint(e.clientX, e.clientY);
    hud.setReturnAvailable(cam.hasHistory());
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
                cam.travelToObject({ x: star.x, y: star.y, z: star.z }, 600);
              }
            });
          }
        } else {
          // Placement cancelled — restore exact prior camera state
          if (preStarPlacementCameraState) {
            cam.restoreSnapshot(preStarPlacementCameraState, true);
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
    cam.travelToObject(tourPlaylist[0].pos, 1500, { onDone: announceTourStop });
  }

  function nextTourStop() {
    if (tourIndex < 0 || tourIndex >= tourPlaylist.length - 1) return;
    tourIndex++;
    const stop = tourPlaylist[tourIndex];
    hud.setTourProgress(tourIndex + 1, tourPlaylist.length, stop.name);
    cam.travelToObject(stop.pos, 1500, { onDone: announceTourStop });
  }

  function prevTourStop() {
    if (tourIndex <= 0) return;
    tourIndex--;
    const stop = tourPlaylist[tourIndex];
    hud.setTourProgress(tourIndex + 1, tourPlaylist.length, stop.name);
    cam.travelToObject(stop.pos, 1500, { onDone: announceTourStop });
  }

  function showTourInfo() {
    const stop = tourPlaylist[tourIndex];
    if (!stop) return;
    showNotification(stop.subtitle ? `${stop.name} — ${stop.subtitle}` : stop.name);
  }

  function exitTour() {
    if (tourSnapshot) cam.restoreSnapshot(tourSnapshot, true);
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
          cam.travelToObject({ x: star.x, y: star.y, z: star.z }, 700, {
            onDone: () => {
              openOverlay((c, onClose) => openStarViewOverlay(c, star, onClose));
            }
          });
        });
      }
    }
    if (route.type === 'galaxy' && route.galaxyId) {
      const [ox, oy, oz] = getGalaxyWorldOffset(route.galaxyId);
      cam.travelToObject({ x: ox, y: oy, z: oz }, 12000);
      store.set('currentGalaxyId', route.galaxyId);
    }
    if (route.type === 'universe') {
      cam.resetToHome();
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
    for (const gs of galaxyScenes) {
      gs.update(time);
      gs.updateLabels(cam.camera, renderer, camPos);
    }

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
