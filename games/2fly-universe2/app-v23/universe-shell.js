// Universe Shell — Phase II Persistent Spatial Orchestrator Engine
import * as THREE from 'three';
import { initRenderer, startRenderLoop } from './renderer.js';
import { UniverseCamera } from './camera.js';
import { BackgroundScene } from './scene/background.js';
import { GalaxyScene } from './scene/galaxy.js';
import { StarLayer } from './scene/star-layer.js';
import { StreamsSystem } from './scene/streams-system.js';
import { ThruTheFireSystem } from './scene/thru-the-fire-system.js';
import { AfricaSystem } from './scene/africa-system.js';
import { FrontierSystems } from './scene/frontier-systems.js';
import { EraOrbitSystem } from './scene/era-orbit-system.js';
import { HUD } from './ui/hud.js';
import { GalacticNavigator } from './ui/galactic-navigator.js';
import { TourBuilder } from './ui/tour-builder.js';
import { store } from './state/universe-store.js';
import { router } from './router.js';
import { loadUniverseData, indexUniverseData, getAllGalaxies, getAllCelestialObjects, getGalaxyWorldOffset, getRegionWorldCenter, getObjectWorldPosition } from './data/universe-data.js';
import { starRepository } from './data/star-repository.js';
import { GALAXY_THEMES } from './types.js';
import { openAudioOverlay, openVideoOverlay, openPlayableOverlay, openArchiveOverlay } from './overlays/media-overlays.js';
import { openStarPlacementOverlay } from './overlays/star-placement.js';
import { openStarViewOverlay, playStarArrivalSequence } from './overlays/star-card-export.js';
import { audioManager } from './audio/audio-manager.js';
export async function initUniverseShell(canvas) {
    const overlayLayer = document.getElementById('overlay-layer');
    const uiLayer = document.getElementById('ui-layer');
    const labelContainer = document.getElementById('css3d-layer');
    const loadingStatus = document.getElementById('loading-status');
    // ── Renderer & Scene ─────────────────────────────────────────────────────
    const renderer = initRenderer(canvas);
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000408, 0.0000015);
    const cam = new UniverseCamera(canvas);
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    // ── Load data ────────────────────────────────────────────────────────────
    if (loadingStatus)
        loadingStatus.textContent = 'Loading Universe data…';
    const data = await loadUniverseData();
    indexUniverseData(data);
    if (loadingStatus)
        loadingStatus.textContent = 'Building 3D galaxies…';
    await new Promise(r => setTimeout(r, 0));
    // ── Background ───────────────────────────────────────────────────────────
    const bg = new BackgroundScene();
    scene.add(bg.group);
    // ── Non-Linear Galaxy Scenes ──────────────────────────────────────────────
    const galaxyScenes = [];
    for (const g of getAllGalaxies()) {
        const gs = new GalaxyScene(g, labelContainer);
        scene.add(gs.group);
        galaxyScenes.push(gs);
    }
    // ── Explorable non-live era orbital shells (only G2025 opens real media) ──
    const eraOrbitSystems = [];
    for (const gid of ['G2000', 'G2005', 'G2010', 'G2015', 'G2020', 'G2030']) {
        const era = new EraOrbitSystem(gid);
        scene.add(era.group);
        eraOrbitSystems.push(era);
    }
    // ── Visitor Star Layer ───────────────────────────────────────────────────
    if (loadingStatus)
        loadingStatus.textContent = 'Placing visitor star clusters…';
    await new Promise(r => setTimeout(r, 0));
    const starLayer = new StarLayer(labelContainer);
    scene.add(starLayer.group);
    const stars = await starRepository.loadStars();
    store.set('stars', stars);
    starLayer.setStars(stars, store.get('myStarId'));
    // ── Phase II 2025–2029 Showcase Systems ──────────────────────────────────
    let streamsSystem = null;
    let fireSystem = null;
    let africaSystem = null;
    let frontierSystems = null;
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
    // Living navigation guide: a transparent sphere/crosshair that explains
    // orbit, forward movement, thrust, warp and the color-space of the nearest galaxy.
    const guideStyle = document.createElement('style');
    guideStyle.id = '2fly-nav-guide-style';
    guideStyle.textContent = `
    #zoom-anchor-reticle{--guide-color:170,205,230;position:fixed;left:50%;top:50%;width:52px;height:52px;border-radius:50%;transform:translate(-50%,-50%);pointer-events:none;z-index:28;opacity:0;transition:opacity .18s ease,filter .2s ease;background:radial-gradient(circle at 36% 30%,rgba(var(--guide-color),.08),rgba(var(--guide-color),.025) 46%,transparent 72%);border:1px solid rgba(var(--guide-color),.58);box-shadow:0 0 18px rgba(var(--guide-color),.16),inset 0 0 16px rgba(var(--guide-color),.07)}
    #zoom-anchor-reticle::before,#zoom-anchor-reticle::after{content:"";position:absolute;left:50%;top:50%;background:rgba(var(--guide-color),.66);transform:translate(-50%,-50%);box-shadow:0 0 7px rgba(var(--guide-color),.28)}
    #zoom-anchor-reticle::before{width:24px;height:1px}#zoom-anchor-reticle::after{width:1px;height:24px}
    .guide-core{position:absolute;left:50%;top:50%;width:4px;height:4px;border-radius:50%;background:rgba(var(--guide-color),.88);transform:translate(-50%,-50%);box-shadow:0 0 8px rgba(var(--guide-color),.52)}
    .guide-orbit{position:absolute;inset:-8px;opacity:0;transition:opacity .15s ease;filter:drop-shadow(0 0 3px rgba(var(--guide-color),.45))}
    .guide-orbit path{fill:none;stroke:rgba(var(--guide-color),.74);stroke-width:1.25;stroke-dasharray:5 6}
    .guide-orbit polygon{fill:rgba(var(--guide-color),.9)}
    .guide-forward{position:absolute;left:50%;top:50%;width:120px;height:48px;transform:translate(-50%,-50%);opacity:0;overflow:visible;transition:opacity .12s ease}
    .guide-forward .lane{position:absolute;top:50%;width:92px;height:1px;transform-origin:left center}
    .guide-forward .lane.a{left:8px;transform:translateY(-9px) rotate(-2deg)}.guide-forward .lane.b{left:8px;transform:translateY(9px) rotate(2deg)}
    .guide-forward .pulse{position:absolute;left:0;top:-3px;width:16px;height:7px;border-top:1px solid rgba(var(--guide-color),.85);border-right:1px solid rgba(var(--guide-color),.85);transform:rotate(45deg);opacity:0;animation:guide-forward-pulse 1s linear infinite}
    .guide-forward .lane.b .pulse{animation-delay:.18s}
    @keyframes guide-forward-pulse{0%{left:0;opacity:0;transform:rotate(45deg) scale(.75)}18%{opacity:.9}78%{opacity:.75}100%{left:78px;opacity:0;transform:rotate(45deg) scale(1.18)}}
    #zoom-anchor-reticle.nav-orbit-left .guide-orbit,#zoom-anchor-reticle.nav-orbit-right .guide-orbit{opacity:1}
    #zoom-anchor-reticle.nav-orbit-right .guide-orbit{transform:scaleX(-1)}
    #zoom-anchor-reticle.nav-thrust .guide-forward,#zoom-anchor-reticle.nav-drift .guide-forward{opacity:1}
    #zoom-anchor-reticle.nav-thrust{filter:brightness(1.28)}#zoom-anchor-reticle.nav-warp{filter:brightness(1.7);box-shadow:0 0 30px rgba(var(--guide-color),.38),inset 0 0 20px rgba(var(--guide-color),.12)}
    #zoom-anchor-reticle.nav-warp .guide-forward{transform:translate(-50%,-50%) scaleX(1.35)}
    .guide-state{position:absolute;left:50%;top:63px;transform:translateX(-50%);white-space:nowrap;font:600 8px 'Space Mono',monospace;letter-spacing:.16em;color:rgba(var(--guide-color),.72);text-shadow:0 0 7px rgba(var(--guide-color),.22)}
  `;
    document.head.appendChild(guideStyle);
    const zoomReticle = document.createElement('div');
    zoomReticle.id = 'zoom-anchor-reticle';
    zoomReticle.setAttribute('aria-hidden', 'true');
    zoomReticle.innerHTML = `
    <span class="guide-core"></span>
    <svg class="guide-orbit" viewBox="0 0 68 68" aria-hidden="true"><path d="M11 41 C15 13,48 7,58 29 C63 41,56 52,45 57"/><polygon points="43,53 49,57 43,61"/></svg>
    <div class="guide-forward"><span class="lane a"><i class="pulse"></i></span><span class="lane b"><i class="pulse"></i></span></div>
    <span class="guide-state">ATLAS</span>`;
    uiLayer.appendChild(zoomReticle);
    const guideState = zoomReticle.querySelector('.guide-state');
    let lastPointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let lastGuideX = lastPointer.x;
    let guideOrbitDirection = 'left';
    let reticlePinned = false;
    function placeZoomReticle(x, y, pinned = false) {
        reticlePinned = pinned;
        zoomReticle.style.left = `${x}px`;
        zoomReticle.style.top = `${y}px`;
        zoomReticle.style.opacity = pinned ? '0.98' : '0.86';
    }
    function clearZoomReticleAndAnchor() {
        reticlePinned = false;
        cam.clearZoomAnchor();
        zoomReticle.style.opacity = '0';
    }
    canvas.addEventListener('pointermove', (e) => {
        lastPointer = { x: e.clientX, y: e.clientY };
        if ((e.buttons & 1) === 1 && Math.abs(e.clientX - lastGuideX) > 1)
            guideOrbitDirection = e.clientX > lastGuideX ? 'right' : 'left';
        lastGuideX = e.clientX;
        if (!reticlePinned)
            placeZoomReticle(e.clientX, e.clientY, false);
    });
    canvas.addEventListener('pointerleave', () => { if (!reticlePinned)
        zoomReticle.style.opacity = '0'; });
    canvas.addEventListener('wheel', () => {
        zoomReticle.animate([{ transform: 'translate(-50%,-50%) scale(1)' }, { transform: 'translate(-50%,-50%) scale(1.12)' }, { transform: 'translate(-50%,-50%) scale(1)' }], { duration: 280, easing: 'ease-out' });
    }, { passive: true });
    function updateNavigationGuide() {
        const camPos = cam.camera.position;
        const ranked = Object.values(GALAXY_THEMES)
            .map(theme => ({ theme, d: camPos.distanceTo(new THREE.Vector3(...theme.worldOffset)) }))
            .sort((a, b) => a.d - b.d);
        const first = ranked[0];
        const second = ranked[1];
        if (first) {
            const c = new THREE.Color(first.theme.accentColor);
            if (second) {
                const blendWindow = 12000;
                const gap = Math.max(0, second.d - first.d);
                const mix = THREE.MathUtils.clamp((blendWindow - gap) / blendWindow, 0, 0.48);
                c.lerp(new THREE.Color(second.theme.accentColor), mix);
            }
            zoomReticle.style.setProperty('--guide-color', `${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)}`);
        }
        zoomReticle.classList.remove('nav-orbit-left', 'nav-orbit-right', 'nav-thrust', 'nav-warp', 'nav-drift');
        if (cam.isOrbiting) {
            zoomReticle.classList.add(guideOrbitDirection === 'right' ? 'nav-orbit-right' : 'nav-orbit-left');
            guideState.textContent = cam.localGalaxyId ? 'ORBITING · LOCAL GALAXY' : 'ORBITING';
        }
        else if (cam.isThrusting) {
            zoomReticle.classList.add('nav-thrust');
            if (cam.currentWarpFactor > 0.18)
                zoomReticle.classList.add('nav-warp');
            guideState.textContent = cam.currentWarpFactor > 0.18 ? 'WARP THRUST' : (cam.selectedTargetLabel ? `THRUST · ${cam.selectedTargetLabel}` : 'FORWARD THRUST');
        }
        else if (cam.travelSpeed > 300) {
            zoomReticle.classList.add('nav-drift');
            guideState.textContent = 'FORWARD DRIFT';
        }
        else if (cam.selectedTargetLabel) {
            guideState.textContent = `TARGET · ${cam.selectedTargetLabel}`;
        }
        else {
            guideState.textContent = cam.localGalaxyId ? 'LOCAL ATLAS' : 'UNIVERSE ATLAS';
        }
    }
    function setLocatorTarget(worldPos, scale = 1) {
        locatorTarget.set(worldPos.x, worldPos.y + 24, worldPos.z);
        locatorScaleTarget = scale;
    }
    function travelToWorldAndSnap(worldPos, distanceRadius, opts = {}, locatorScale = 1) {
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
    const availableTourStops = celestialObjects.map(obj => {
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
    let overlayClose = null;
    function openOverlay(fn) {
        if (overlayClose) {
            overlayClose();
            overlayClose = null;
        }
        const snap = cam.snapshot();
        store.pushCameraSnapshot(snap);
        overlayLayer.setAttribute('aria-hidden', 'false');
        overlayLayer.classList.add('overlay-active');
        overlayClose = fn(overlayLayer, () => {
            overlayLayer.setAttribute('aria-hidden', 'true');
            overlayLayer.classList.remove('overlay-active');
            overlayClose = null;
            const prev = store.popCameraSnapshot();
            if (prev)
                cam.restoreSnapshot(prev);
        });
    }
    let pointerDownAt = null;
    let pointerDragged = false;
    let selectedActionKey = '';
    let selectedOrbitObject = null;
    canvas.addEventListener('pointerdown', (e) => {
        if (e.button !== 0)
            return;
        pointerDownAt = { x: e.clientX, y: e.clientY };
        pointerDragged = false;
    });
    canvas.addEventListener('pointermove', (e) => {
        if (!pointerDownAt)
            return;
        if (Math.hypot(e.clientX - pointerDownAt.x, e.clientY - pointerDownAt.y) > 7)
            pointerDragged = true;
    });
    window.addEventListener('pointerup', () => { pointerDownAt = null; });
    function resolveTaggedObject(obj) {
        let cur = obj;
        while (cur) {
            if (cur.userData['childId'] || cur.userData['objectId'])
                return cur;
            cur = cur.parent;
        }
        return obj;
    }
    function pickOrbitTarget(targets, e) {
        const hits = raycaster.intersectObjects(targets, true);
        if (hits.length)
            return resolveTaggedObject(hits[0].object);
        // V13 reliable screen-space fallback: keep small media objects selectable
        // from normal galaxy viewing distance instead of requiring the camera to be close.
        let best = null;
        let bestPx = Infinity;
        const thresholdPx = 58;
        for (const raw of targets) {
            const obj = resolveTaggedObject(raw);
            const wp = new THREE.Vector3();
            obj.getWorldPosition(wp);
            const ndc = wp.clone().project(cam.camera);
            if (ndc.z < -1 || ndc.z > 1)
                continue;
            const sx = (ndc.x * 0.5 + 0.5) * window.innerWidth;
            const sy = (-ndc.y * 0.5 + 0.5) * window.innerHeight;
            const d = Math.hypot(e.clientX - sx, e.clientY - sy);
            if (d < thresholdPx && d < bestPx) {
                best = obj;
                bestPx = d;
            }
        }
        return best;
    }
    function pickGalaxyTarget(e) {
        let best = null;
        let bestPx = Infinity;
        for (const [id, theme] of Object.entries(GALAXY_THEMES)) {
            const worldPos = new THREE.Vector3(...theme.worldOffset);
            const ndc = worldPos.clone().project(cam.camera);
            if (ndc.z < -1 || ndc.z > 1)
                continue;
            const sx = (ndc.x * 0.5 + 0.5) * window.innerWidth;
            const sy = (-ndc.y * 0.5 + 0.5) * window.innerHeight;
            const distance = Math.hypot(e.clientX - sx, e.clientY - sy);
            const thresholdPx = theme.status === 'showcase' ? 105 : 82;
            if (distance < thresholdPx && distance < bestPx) {
                bestPx = distance;
                best = { id, label: theme.title, worldPos };
            }
        }
        return best;
    }
    function selectWorldObject(obj, label, key) {
        selectedOrbitObject = obj;
        selectedActionKey = key;
        if (obj) {
            const wp = new THREE.Vector3();
            obj.getWorldPosition(wp);
            cam.setSelectedTarget(wp, label);
            setLocatorTarget(wp, 0.34);
        }
        showNotification(`${label} · SELECTED${key.startsWith('child:') || key.startsWith('star:') ? ' · CLICK AGAIN TO OPEN' : ''}`);
    }
    canvas.addEventListener('click', (e) => {
        // Never let a right-mouse boost/hold or an orbit drag fall through as a content click.
        if (cam.consumeThrustClick() || cam.consumeOrbitClick())
            return;
        if (overlayClose)
            return;
        if (store.get('placementMode'))
            return;
        if (pointerDragged) {
            pointerDragged = false;
            return;
        }
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, cam.camera);
        // CONTEXT GATE: in deep space the user can select galaxies only. Interior
        // planets/moons/satellites are not pickable until the camera is actually inside that galaxy.
        if (!cam.localGalaxyId) {
            const galaxyHit = pickGalaxyTarget(e);
            if (galaxyHit) {
                selectedActionKey = `galaxy:${galaxyHit.id}`;
                selectedOrbitObject = null;
                cam.setSelectedTarget(galaxyHit.worldPos, galaxyHit.label);
                setLocatorTarget(galaxyHit.worldPos, 5.4);
                showNotification(`${galaxyHit.label} · GALAXY SELECTED · RIGHT MOUSE TO THRUST`);
                return;
            }
            selectedActionKey = '';
            selectedOrbitObject = null;
            cam.clearSelectedTarget();
            const focusPoint = cam.placeZoomAnchor(e.clientX, e.clientY);
            setLocatorTarget(focusPoint, 0.7);
            placeZoomReticle(e.clientX, e.clientY, true);
            return;
        }
        const systems = [
            { sys: fireSystem, planetId: 'OBJ-FIRE', planetName: 'THRU THE FIRE' },
            { sys: africaSystem, planetId: 'OBJ-AFRICA', planetName: 'I WOKE UP IN AFRICA' },
            { sys: streamsSystem, planetId: 'OBJ-STREAMS', planetName: 'STREAMS' },
            { sys: frontierSystems },
        ];
        if (cam.localGalaxyId === 'G2025')
            for (const entry of systems) {
                if (!entry.sys)
                    continue;
                const obj = pickOrbitTarget(entry.sys.clickTargets, e);
                if (!obj)
                    continue;
                const childId = obj.userData['childId'];
                const objectId = obj.userData['objectId'];
                if (childId) {
                    const childData = entry.sys.getChildData(childId);
                    const label = childData?.title || childId;
                    const key = `child:${childId}`;
                    if (selectedActionKey === key && childData) {
                        // CONTENT ACTIVATION PATH: this is intentionally the only direct media-open path.
                        openMediaOverlay(childData);
                        showNotification(`${label} · OPENING`);
                        return;
                    }
                    selectWorldObject(obj, label, key);
                    return;
                }
                if (objectId) {
                    const label = entry.planetName || celestialObjects.find(x => x.id === objectId)?.title || objectId;
                    selectWorldObject(obj, label, `object:${objectId}`);
                    return;
                }
            }
        // Historical shell objects: selection only. No proximity or pass-through activation.
        for (const era of eraOrbitSystems) {
            if (era.galaxyId !== cam.localGalaxyId)
                continue;
            const hit = era.getHit(raycaster);
            if (!hit)
                continue;
            const key = `archive:${hit.title}`;
            if (selectedActionKey === key) {
                showNotification(`${hit.title} — ARCHIVE NOT YET CURATED`);
                return;
            }
            selectedActionKey = key;
            cam.setSelectedTarget(hit.worldPos, hit.title);
            setLocatorTarget(hit.worldPos, 0.5);
            showNotification(`${hit.title} · SELECTED`);
            return;
        }
        // Visitor stars use the same first-click select / second-click open rule.
        const starHit = starLayer.getClickTarget(raycaster);
        if (starHit) {
            const star = store.get('stars').find(s => s.id === starHit.starId);
            if (star && star.galaxyId === cam.localGalaxyId) {
                const key = `star:${star.id}`;
                if (selectedActionKey === key) {
                    openOverlay((container, onClose) => openStarViewOverlay(container, star, onClose));
                    showNotification(`${star.displayName || 'STAR'} · OPENING`);
                    return;
                }
                const wp = new THREE.Vector3(star.x, star.y, star.z);
                selectedActionKey = key;
                cam.setSelectedTarget(wp, star.displayName || 'STAR');
                setLocatorTarget(wp, 0.32);
                showNotification(`${star.displayName || 'STAR'} · SELECTED · CLICK AGAIN TO OPEN`);
                return;
            }
        }
        // Empty space is selection/aim only. It never opens media and no longer invokes the old click-to-travel camera.
        selectedActionKey = '';
        selectedOrbitObject = null;
        cam.clearSelectedTarget();
        const focusPoint = cam.placeZoomAnchor(e.clientX, e.clientY);
        setLocatorTarget(focusPoint, 0.7);
        placeZoomReticle(e.clientX, e.clientY, true);
        zoomReticle.animate([{ transform: 'translate(-50%,-50%) scale(.92)' }, { transform: 'translate(-50%,-50%) scale(1.12)' }, { transform: 'translate(-50%,-50%) scale(1)' }], { duration: 260, easing: 'ease-out' });
    });
    let preStarPlacementCameraState = null;
    let placementBannerEl = null;
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
        if (!store.get('placementMode'))
            return;
        removePlacementBanner();
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, cam.camera);
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const point = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, point);
        if (!point)
            return;
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
        openOverlay((container, onClose) => openStarPlacementOverlay(container, {
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
            }
            else {
                // Placement cancelled — restore exact prior camera state
                if (preStarPlacementCameraState) {
                    cam.restoreSnapshot(preStarPlacementCameraState, true);
                    setLocatorTarget({ x: preStarPlacementCameraState.target[0], y: preStarPlacementCameraState.target[1], z: preStarPlacementCameraState.target[2] }, 1);
                }
            }
            onClose();
        }));
    });
    function openMediaOverlay(child) {
        if (!child)
            return;
        const mk = child.mediaKind;
        if (mk === 'audio') {
            openOverlay((c, onClose) => openAudioOverlay(c, child, onClose));
        }
        else if (mk === 'video') {
            openOverlay((c, onClose) => openVideoOverlay(c, child, onClose));
        }
        else if (mk === 'playable') {
            openOverlay((c, onClose) => openPlayableOverlay(c, child, onClose));
        }
        else {
            openOverlay((c, onClose) => openArchiveOverlay(c, child, onClose));
        }
    }
    // ── Custom Tour State ──────────────────────────────────────────────────
    let tourPlaylist = [];
    let tourIndex = -1;
    let tourSnapshot = null;
    function announceTourStop() {
        const stop = tourPlaylist[tourIndex];
        if (!stop)
            return;
        hud.setTourProgress(tourIndex + 1, tourPlaylist.length, stop.name);
        showNotification(`DESTINATION ${tourIndex + 1}/${tourPlaylist.length} — ${stop.name}`);
    }
    function startTour(stops) {
        tourPlaylist = (stops?.length ? stops : tourBuilder.getStops()).slice();
        if (tourPlaylist.length === 0) {
            tourBuilder.open();
            return;
        }
        tourIndex = 0;
        tourSnapshot = cam.snapshot();
        hud.setTourActive(true);
        hud.setTourProgress(1, tourPlaylist.length, tourPlaylist[0].name);
        travelToWorldAndSnap(tourPlaylist[0].pos, 1500, { onDone: announceTourStop }, 1.05);
    }
    function nextTourStop() {
        if (tourIndex < 0 || tourIndex >= tourPlaylist.length - 1)
            return;
        tourIndex++;
        const stop = tourPlaylist[tourIndex];
        hud.setTourProgress(tourIndex + 1, tourPlaylist.length, stop.name);
        travelToWorldAndSnap(stop.pos, 1500, { onDone: announceTourStop }, 1.05);
    }
    function prevTourStop() {
        if (tourIndex <= 0)
            return;
        tourIndex--;
        const stop = tourPlaylist[tourIndex];
        hud.setTourProgress(tourIndex + 1, tourPlaylist.length, stop.name);
        travelToWorldAndSnap(stop.pos, 1500, { onDone: announceTourStop }, 1.05);
    }
    function showTourInfo() {
        const stop = tourPlaylist[tourIndex];
        if (!stop)
            return;
        showNotification(stop.subtitle ? `${stop.name} — ${stop.subtitle}` : stop.name);
    }
    function exitTour() {
        if (tourSnapshot) {
            cam.restoreSnapshot(tourSnapshot, true);
            setLocatorTarget({ x: tourSnapshot.target[0], y: tourSnapshot.target[1], z: tourSnapshot.target[2] }, 1);
        }
        hud.setTourActive(false);
        hud.setTourProgress(0, 0, '');
        tourPlaylist = [];
        tourIndex = -1;
        tourSnapshot = null;
    }
    function finishTour() {
        hud.setTourActive(false);
        hud.setTourProgress(0, 0, '');
        showNotification('TOUR COMPLETE — EXPLORE FREELY');
        tourPlaylist = [];
        tourIndex = -1;
        tourSnapshot = null;
    }
    function takeGuidedTour() {
        tourBuilder.open();
    }
    function showNotification(text) {
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
    let activeGalaxyPlateId = null;
    function playGalaxyPlateThresholdEffect(kind, galaxyId) {
        const theme = GALAXY_THEMES[galaxyId];
        if (!theme)
            return;
        const accent = new THREE.Color(theme.accentColor);
        const accentRgb = `${Math.round(accent.r * 255)}, ${Math.round(accent.g * 255)}, ${Math.round(accent.b * 255)}`;
        const plate = document.createElement('div');
        plate.style.cssText = `
      position:fixed;top:76px;left:50%;transform:translateX(-50%);pointer-events:none;z-index:75;
      padding:7px 12px;border-radius:999px;border:1px solid rgba(${accentRgb},0.20);
      background:rgba(2,10,18,0.28);backdrop-filter:blur(2px);
      font-family:'Space Mono',monospace;font-size:0.58rem;letter-spacing:0.20em;text-transform:uppercase;
      color:rgba(${accentRgb},0.86);box-shadow:0 0 20px rgba(${accentRgb},0.08);opacity:0;
      animation:galaxy-threshold-hud 1150ms ease forwards;
    `;
        plate.textContent = `${kind === 'enter' ? 'ENTERING' : 'LEAVING'} · ${theme.title}`;
        if (!document.getElementById('galaxy-threshold-style')) {
            const st = document.createElement('style');
            st.id = 'galaxy-threshold-style';
            st.textContent = `@keyframes galaxy-threshold-hud{0%{opacity:0;transform:translateX(-50%) translateY(-5px)}22%{opacity:.82;transform:translateX(-50%) translateY(0)}72%{opacity:.58}100%{opacity:0;transform:translateX(-50%) translateY(-2px)}}`;
            document.head.appendChild(st);
        }
        uiLayer.appendChild(plate);
        setTimeout(() => plate.remove(), 1160);
    }
    // ── First Entry Title Moment for 2025–2029 ──────────────────────────────
    let hasShownEntryTitle = false;
    function triggerEntryTitle() {
        if (hasShownEntryTitle)
            return;
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
    router.on(async (route) => {
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
        if (overlayClose) {
            overlayClose();
            return;
        }
        router.back();
    });
    // ── Main Render & Spatial Audio Loop ─────────────────────────────────────
    let time = 0;
    startRenderLoop((dt) => {
        time += dt;
        cam.update(dt);
        const camPos = cam.camera.position;
        // Determine nearest galaxy
        let nearestGalaxy = null;
        let nearestDist = Infinity;
        for (const [gid, theme] of Object.entries(GALAXY_THEMES)) {
            const [ox, oy, oz] = theme.worldOffset;
            const d = Math.hypot(camPos.x - ox, camPos.y - oy, camPos.z - oz);
            if (d < nearestDist) {
                nearestDist = d;
                nearestGalaxy = gid;
            }
        }
        if (nearestGalaxy !== store.get('currentGalaxyId')) {
            store.set('currentGalaxyId', nearestGalaxy);
        }
        if (activeGalaxyPlateId) {
            const activeScene = galaxyScenes.find(gs => gs.getId() === activeGalaxyPlateId);
            if (!activeScene || activeScene.distanceTo(camPos) > activeScene.getShellBoundaryRadius() * 1.08) {
                if (activeGalaxyPlateId)
                    playGalaxyPlateThresholdEffect('exit', activeGalaxyPlateId);
                activeGalaxyPlateId = null;
            }
        }
        if (!activeGalaxyPlateId) {
            const entryScene = galaxyScenes.find(gs => gs.distanceTo(camPos) < gs.getShellBoundaryRadius() * 0.96);
            if (entryScene) {
                activeGalaxyPlateId = entryScene.getId();
                playGalaxyPlateThresholdEffect('enter', activeGalaxyPlateId);
            }
        }
        // Determine spatial audio theme based on camera proximity
        if (camPos.distanceTo(new THREE.Vector3(-4500, 40, -2500)) < 4000) {
            audioManager.setRegionTheme('fire');
        }
        else if (camPos.distanceTo(new THREE.Vector3(0, 40, 4000)) < 4000) {
            audioManager.setRegionTheme('africa');
        }
        else if (camPos.distanceTo(new THREE.Vector3(4000, 40, -2000)) < 4500) {
            audioManager.setRegionTheme('frontier');
        }
        else {
            audioManager.setRegionTheme(null);
        }
        bg.update(time);
        updateNavigationGuide();
        for (const era of eraOrbitSystems)
            era.update(dt);
        for (const gs of galaxyScenes) {
            gs.update(time, camPos);
            gs.updateLabels(cam.camera, renderer, camPos, cam.localGalaxyId);
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
let _;
