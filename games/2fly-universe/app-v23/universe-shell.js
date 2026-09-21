// Universe Shell — Phase II Persistent Spatial Orchestrator Engine
import * as THREE from 'three';
import { ConstellationJourney } from './ui/constellation-journey.js';
import { CinematicDepth } from './scene/cinematic-depth.js';
import { LivingAtmosphere } from './scene/living-atmosphere.js';
const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
import { initRenderer, startRenderLoop, renderUniverse, setBloomStrength } from './renderer.js';
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
import { PlanetFocusPanel } from './ui/planet-focus-panel.js';
import { TourBuilder } from './ui/tour-builder.js';
import { store } from './state/universe-store.js';
import { NavigationControls } from './ui/navigation-controls.js';
import { NAV } from './state/navigation-safety.js';
import { router } from './router.js';
import { loadUniverseData, indexUniverseData, getAllGalaxies, getAllCelestialObjects, getGalaxyWorldOffset, getRegionWorldCenter, getObjectWorldPosition } from './data/universe-data.js';
import { starRepository } from './data/star-repository.js';
import { GALAXY_THEMES, REGION_STAR_RADIUS } from './types.js';
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
    let controls=null;
    let overlayClose=null;
    let planetSnapshot=null;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    // ── Load data ────────────────────────────────────────────────────────────
    if (loadingStatus)
        loadingStatus.textContent = 'Loading Universe data…';
    const data = await loadUniverseData();
    for(const o of data.celestialObjects){o.position={x:o.position.x*2.1,y:o.position.y*2.1,z:o.position.z*2.1};}
    indexUniverseData(data);
    if (loadingStatus)
        loadingStatus.textContent = 'Building 3D galaxies…';
    await new Promise(r => setTimeout(r, 0));
    // ── Background ───────────────────────────────────────────────────────────
    const bg = new BackgroundScene();
    scene.add(bg.group);
    const atmosphere=new LivingAtmosphere(data.galaxies);scene.add(atmosphere.group);
    // ── Non-Linear Galaxy Scenes ──────────────────────────────────────────────
    const galaxyScenes = [];
    for (const g of getAllGalaxies()) {
        const gs = new GalaxyScene(g, labelContainer);
        scene.add(gs.group);
        galaxyScenes.push(gs);
    }
    // ── Explorable non-live era orbital shells (only G2025 opens real media) ──
    const eraOrbitSystems = [];
    for (const gid of data.galaxies.filter(g=>g.id!=='G2025').map(g=>g.id)) {
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
    // Protected content-planet boundaries. Ambient stars/dust remain fully fly-through.
    const protectedContentBodies = [streamsSystem, fireSystem, africaSystem]
        .filter(Boolean)
        .map(sys => sys.getCollisionDescriptor?.())
        .filter(Boolean);
    const cinematic=new CinematicDepth(scene,galaxyScenes,[fireSystem,africaSystem,streamsSystem].filter(Boolean),frontierSystems,eraOrbitSystems);
    cam.setProtectedBodies([...protectedContentBodies,...cinematic.colliders]);
    // ── Cinematic Planet Focus Controller (Phase 1 + Phase 3) ───────────────
    let focusedPlanetSystem = null;
    let focusedPlanetEntry = null;
    const planetFocusPanel = new PlanetFocusPanel(uiLayer, {
        onActivate: (child,e) => controls?.clickKey('child:'+child.id,e),
        onClose: () => {
            focusedPlanetSystem?.setFocus?.(false);focusedPlanetSystem=null;focusedPlanetEntry=null;
            controls?.clear();controls?.policy.closeContent();
            if(planetSnapshot)cam.restoreSnapshot(planetSnapshot,false);planetSnapshot=null;
        }
    });
    function openPlanet(objectId){
        const obj=celestialObjects.find(o=>o.id===objectId);if(!obj)return;
        planetSnapshot=cam.snapshot();cam.stopMotion();
        focusedPlanetSystem=[fireSystem,africaSystem,streamsSystem].find(sys=>sys?.objectData?.id===objectId)||null;
        focusedPlanetSystem?.setFocus?.(true);
        planetFocusPanel.open(obj.title,obj.subtitle||obj.description,obj.children||[]);
        controls.policy.openContent();
    }
    // ── Spatial Focus Locator (visitor position / snap ring) ────────────────
    const locatorGeometry = new THREE.RingGeometry(900, 908, 72);
    const locatorMaterial = new THREE.MeshBasicMaterial({
        color: 0x7fe6ff,
        transparent: true,
        opacity: 0.68,
        side: THREE.DoubleSide,
        depthWrite: false,
    });
    const userLocator = new THREE.Mesh(locatorGeometry, locatorMaterial);
    userLocator.rotation.x = -Math.PI / 2;
    userLocator.position.copy(cam.getTarget());
    userLocator.position.y += 24;
    userLocator.renderOrder = 8;
    scene.add(userLocator);
    const userLocatorPulse = new THREE.Mesh(new THREE.RingGeometry(1180, 1186, 96), new THREE.MeshBasicMaterial({ color: 0x7fe6ff, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false }));
    userLocatorPulse.rotation.x = -Math.PI / 2;
    userLocatorPulse.position.copy(userLocator.position);
    userLocatorPulse.renderOrder = 7;
    scene.add(userLocatorPulse);
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
    #selection-flow{position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;z-index:27;opacity:0;transition:opacity .18s ease}
    #selection-flow .selection-arrow{position:absolute;width:16px;height:16px;transform:translate(-50%,-50%) rotate(45deg);border-top:1px solid rgba(var(--guide-color),.9);border-right:1px solid rgba(var(--guide-color),.9);box-shadow:0 0 10px rgba(var(--guide-color),.26)}
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
    const selectionFlow = document.createElement('div');
    selectionFlow.id = 'selection-flow';
    selectionFlow.innerHTML = '<i class="selection-arrow"></i><i class="selection-arrow"></i><i class="selection-arrow"></i><i class="selection-arrow"></i><i class="selection-arrow"></i><i class="selection-arrow"></i>';
    uiLayer.appendChild(selectionFlow);
    const flowArrows = Array.from(selectionFlow.querySelectorAll('.selection-arrow'));
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
        userLocator.visible = true;
        userLocatorPulse.visible = true;
    }
    function updateSelectionFlow(time) {
        if (!cam.selectedTarget) {
            selectionFlow.style.opacity = '0';
            return;
        }
        const projected = locatorTarget.clone().project(cam.camera);
        if (projected.z < -1 || projected.z > 1) {
            selectionFlow.style.opacity = '0';
            return;
        }
        const endX = (projected.x * 0.5 + 0.5) * window.innerWidth;
        const endY = (-projected.y * 0.5 + 0.5) * window.innerHeight;
        const startX = parseFloat(zoomReticle.style.left || `${window.innerWidth / 2}`);
        const startY = parseFloat(zoomReticle.style.top || `${window.innerHeight / 2}`);
        const dx = endX - startX;
        const dy = endY - startY;
        const angle = Math.atan2(dy, dx) + Math.PI / 4;
        const len = Math.hypot(dx, dy);
        if (len < 34) {
            selectionFlow.style.opacity = '0';
            return;
        }
        selectionFlow.style.opacity = '1';
        flowArrows.forEach((arrow, i) => {
            const slot = ((i / flowArrows.length) + (time * 0.22)) % 1;
            const eased = 0.12 + slot * 0.76;
            arrow.style.left = `${startX + dx * eased}px`;
            arrow.style.top = `${startY + dy * eased}px`;
            arrow.style.transform = `translate(-50%,-50%) rotate(${angle}rad) scale(${0.8 + 0.38 * Math.sin(time * 2.6 + i)})`;
            arrow.style.opacity = `${0.34 + 0.6 * (1 - Math.abs(0.5 - slot) * 1.35)}`;
        });
    }

    function travelToWorldAndSnap(worldPos, distanceRadius, opts = {}, locatorScale = 1) {
        setLocatorTarget(worldPos, locatorScale);
        const body=cam.protectedBodies.find(b=>b.getCenter().distanceTo(new THREE.Vector3(worldPos.x,worldPos.y,worldPos.z))<100);
        if(body)distanceRadius=Math.max(distanceRadius,body.hardRadius*2.3);
        cam.travelToObject(worldPos, distanceRadius, opts);
    }
    // ── HUD & Galactic Navigator UI ──────────────────────────────────────────
    const hud = new HUD(uiLayer, {
        onResetView: () => controls?.exit(),
        onReturnPrevious: () => controls?.exit(),
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
            const star=await starRepository.getStarById(starId);if(!star)return;
            if(controls.policy.galaxyId!==star.galaxyId){controls.enter(star.galaxyId);return;}
            controls.clickKey('star:'+star.id,{});
        },
    });
    const navigator = new GalacticNavigator(uiLayer, {
        onTravelToGalaxy: id => controls?.enter(id),
        onTravelToRegion: (galaxyId,regionId) => {
            if(controls?.policy.galaxyId!==galaxyId||controls.policy.locked)return;
            controls.clear();const [x,y,z]=getRegionWorldCenter(galaxyId,regionId);
            controls.closeMenus();travelToWorldAndSnap({x,y,z},4500,{},1.65);
        },
        onTravelToObject: (id,e) => controls?.clickKey('object:'+id,e),
    });
    const journey = new ConstellationJourney(uiLayer,data,{
        canChooseEra:id=>!controls||controls.policy.canTravelToGalaxy(id),
        onEra:id=>controls?.enter(id),
        onProject:(id,e)=>controls?.clickKey('object:'+id,e),
    });
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
    controls=new NavigationControls({scene,cam,canvas,uiLayer,galaxies:galaxyScenes,themes:GALAXY_THEMES,
        getMenuOpen:()=>!journey.drawer.hidden||navigator.isOpen||tourBuilder.root.style.display==='flex'||document.body.classList.contains('planet-focused')||!!overlayClose||store.get('placementMode'),
        closeMenus:()=>{journey.close();navigator.isOpen=false;navigator.panel.style.display='none';tourBuilder.close();planetFocusPanel.close(false);focusedPlanetSystem?.setFocus?.(false);focusedPlanetSystem=null;planetSnapshot=null;},
        onExit:()=>{clearZoomReticleAndAnchor();hud.setReturnAvailable(false);hud.setTourActive(false);tourPlaylist=[];tourIndex=-1;tourSnapshot=null;if(store.get('placementMode'))cancelPlacementMode();},
    });
    // A single object registry supplies raycasts, list controls, range checks and activation.
    const systems=[fireSystem,africaSystem,streamsSystem,frontierSystems].filter(Boolean);
    const allTargets=systems.flatMap(sys=>sys.clickTargets||[]);
    function registerRecord(record,parent=null){
        const key=(parent?'child:':'object:')+record.id;
        const mesh=allTargets.find(m=>m.userData[parent?'childId':'objectId']===record.id);
        const owner=parent||record;
        const world=()=>mesh?mesh.getWorldPosition(new THREE.Vector3()):new THREE.Vector3(...getObjectWorldPosition(owner));
        mesh?.geometry?.computeBoundingSphere();
        controls.register({key,label:record.title,galaxyId:owner.galaxyId,mesh,world,range:42000,radius:mesh?.geometry?.boundingSphere?.radius|| (parent?100:650),
            open:()=>{journey.close();navigator.isOpen=false;navigator.panel.style.display='none';if(parent)openMediaOverlay(record);else openPlanet(record.id);}});
    }
    celestialObjects.forEach(obj=>{registerRecord(obj);(obj.children||[]).forEach(c=>registerRecord(c,obj));});
    eraOrbitSystems.forEach(era=>era.clickTargets.forEach((mesh,i)=>{
        controls.register({key:'era:'+era.galaxyId+':'+i,label:mesh.userData.title,galaxyId:era.galaxyId,mesh,world:()=>mesh.getWorldPosition(new THREE.Vector3()),range:22000,radius:mesh.geometry.parameters.radius||200,
            open:()=>openMediaOverlay({title:mesh.userData.title,mediaKind:'archive',description:'An orbital landmark in '+GALAXY_THEMES[era.galaxyId].title+'. This chapter preserves a place for the memories and work still joining the archive.'})});
    }));
    function registerStars(){for(const star of store.get('stars')){
        controls.register({key:'star:'+star.id,label:star.displayName||'Visitor star',galaxyId:star.galaxyId,sphereOnly:true,world:()=>new THREE.Vector3(star.x,star.y,star.z),radius:100,range:18000,open:()=>openOverlay((c,done)=>openStarViewOverlay(c,star,done))});
    }}
    registerStars();store.subscribe('stars',registerStars);
    // UI re-renders receive the same authoritative gate as scene raycasts.
    uiLayer.addEventListener('click',()=>{controls.syncGates();controls.syncSelection();});
    // ── Lighting ─────────────────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0x0a0f18, 0.62);
    scene.add(ambient);
    // ── Click Handling (Click-To-Travel & Overlays) ──────────────────────────
    window.addEventListener('universe-content-boundary', (e) => { const d=e.detail||{}; showNotification(`${d.label||'CONTENT PLANET'} · PROTECTED ORBITAL BOUNDARY`); });

    function openOverlay(fn) {
        if(overlayClose||controls.policy.locked)return;
        const snap=cam.snapshot();cam.stopMotion();controls.policy.openContent();
        overlayLayer.setAttribute('aria-hidden','false');overlayLayer.classList.add('overlay-active');uiLayer.inert=true;
        overlayClose=fn(overlayLayer,()=>{
            overlayLayer.setAttribute('aria-hidden','true');overlayLayer.classList.remove('overlay-active');uiLayer.inert=false;overlayClose=null;
            cam.restoreSnapshot(snap,false);cam._onActivity();controls.clear();controls.policy.closeContent();
            planetFocusPanel.root.querySelector('.pf-row')?.focus();
        });
    }
    let pointerDownAt=null,pointerDragged=false;
    canvas.addEventListener('pointerdown',e=>{if(e.button===0){pointerDownAt={x:e.clientX,y:e.clientY};pointerDragged=false;}});
    canvas.addEventListener('pointermove',e=>{if(pointerDownAt&&Math.hypot(e.clientX-pointerDownAt.x,e.clientY-pointerDownAt.y)>7)pointerDragged=true;});
    window.addEventListener('pointerup',()=>{pointerDownAt=null;});
    canvas.addEventListener('pointercancel',()=>{pointerDownAt=null;pointerDragged=true;cam.stopMotion();});
    function pickGalaxyTarget(e){
        if(!controls.policy.canSelectGalaxy)return null;
        let best=null,bestPx=Infinity;
        for(const [id,theme]of Object.entries(GALAXY_THEMES)){
            const worldPos=new THREE.Vector3(...theme.worldOffset),ndc=worldPos.clone().project(cam.camera);
            if(ndc.z<0||ndc.z>1)continue;
            const d=Math.hypot(e.clientX-(ndc.x*.5+.5)*innerWidth,e.clientY-(-ndc.y*.5+.5)*innerHeight);
            if(d<70&&d<bestPx){bestPx=d;best={id,worldPos,label:theme.title};}
        }return best;
    }
    canvas.addEventListener('click',e=>{
        if(controls.policy.locked||overlayClose||store.get('placementMode'))return;
        if(cam.consumeThrustClick()||cam.consumeOrbitClick()||pointerDragged){pointerDragged=false;return;}
        if(document.body.classList.contains('planet-focused')){controls.clear();return;}
        journey.close();navigator.isOpen=false;navigator.panel.style.display='none';
        mouse.set((e.clientX/innerWidth)*2-1,-(e.clientY/innerHeight)*2+1);raycaster.setFromCamera(mouse,cam.camera);
        if(controls.policy.canSelectGalaxy){
            const hit=pickGalaxyTarget(e);
            if(hit){
                const last=controls.galaxySelection;
                if(last?.id===hit.id&&e.detail<=1&&performance.now()-last.time>=550){controls.enter(hit.id);return;}
                controls.galaxySelection={...hit,time:performance.now()};cam.setSelectedTarget(hit.worldPos,hit.label);setLocatorTarget(hit.worldPos,5.4);journey.announce('Galaxy selected. Pause, then click once to enter.');return;
            }
        }else if(controls.policy.galaxyId){
            const item=controls.pick(raycaster,e);if(item){controls.clickItem(item,e);return;}
        }
        controls.clear();const focusPoint=cam.placeZoomAnchor(e.clientX,e.clientY);setLocatorTarget(focusPoint,.7);placeZoomReticle(e.clientX,e.clientY,true);
    });
    // No dblclick activation path. Confirmation is evaluated once per click by NavigationSafety.
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
        if(controls.policy.locked||controls.policy.content){store.set('placementMode',false);return;}
        controls.clear();controls.policy.interrupt();
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
      <span>✦ PLACING STAR — CHOOSE A SIGNAL · ALIGNED TO THE NEAREST STAR REGION</span>
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
        const intersection=raycaster.ray.intersectPlane(plane, point);
        if (!intersection)
            return;
        let nearestGalaxy='G2025',nearestRegion='G2025-R1',nearestDist=Infinity,regionCenter=null;
        for(const galaxy of data.galaxies){
            if(controls.policy.galaxyId&&galaxy.id!==controls.policy.galaxyId)continue;
            const regions=galaxy.regions.length?galaxy.regions:[{id:galaxy.id+'-R1'}];
            for(const region of regions){
                const center=getRegionWorldCenter(galaxy.id,region.id);
                const distance=Math.hypot(point.x-center[0],point.z-center[2]);
                if(distance<nearestDist){nearestDist=distance;nearestGalaxy=galaxy.id;nearestRegion=region.id;regionCenter=center;}
            }
        }
        // Align the chosen signal with an actual, bounded star region, including its elevation.
        const dx=point.x-regionCenter[0],dz=point.z-regionCenter[2];
        const factor=Math.min(1,REGION_STAR_RADIUS*.88/Math.max(1,Math.hypot(dx,dz)));
        point.set(regionCenter[0]+dx*factor,regionCenter[1],regionCenter[2]+dz*factor);
        setLocatorTarget(point,.25);
        store.set('placementMode', false);
        hud.setPlacementMode(false);
        openOverlay((container, onClose) => openStarPlacementOverlay(container, {
            galaxyId: nearestGalaxy,
            regionId: nearestRegion,
            x: point.x, y: point.y + 50, z: point.z,
        }, (placed) => {
            if (placed) {
                const myId = starRepository.getMyStarId(nearestGalaxy);
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
        const record=celestialObjects.flatMap(o=>o.children||[]).find(c=>c.id===child.id);
        if(record) child={...record,...child,description:record.description||child.description};
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
        if(controls.policy.locked||(controls.policy.galaxyId&&controls.policy.galaxyId!=='G2025')){journey.announce('Exit this galaxy before starting a frontier tour.');return;}
        controls.clear();
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
        if(controls.policy.locked||controls.policy.content||controls.policy.galaxyId!=="G2025")return;
        controls.clear();
        if (tourIndex < 0 || tourIndex >= tourPlaylist.length - 1)
            return;
        tourIndex++;
        const stop = tourPlaylist[tourIndex];
        hud.setTourProgress(tourIndex + 1, tourPlaylist.length, stop.name);
        travelToWorldAndSnap(stop.pos, 1500, { onDone: announceTourStop }, 1.05);
    }
    function prevTourStop() {
        if(controls.policy.locked||controls.policy.content||controls.policy.galaxyId!=="G2025")return;
        controls.clear();
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
        if(controls.policy.locked)return;
        controls.exit();
        tourSnapshot=null;
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
        banner.className='universe-notification';
        banner.textContent = text;
        uiLayer.appendChild(banner);
        setTimeout(() => banner.remove(), 3000);
    }
    // ── Router ───────────────────────────────────────────────────────────────
    router.init();
    router.on(async route=>{
        if(controls.policy.locked)return;
        if(route.type==='galaxy')controls.enter(route.galaxyId);
        if(route.type==='object'){
            const item=controls.items.get('object:'+route.objectId);
            if(item){if(controls.policy.galaxyId===item.galaxyId){controls.clear();controls.clickItem(item,{});}else controls.enter(item.galaxyId);}
        }
        if(route.type==='star'){
            const star=await starRepository.getStarById(route.starId);if(star){if(controls.policy.galaxyId===star.galaxyId){controls.clear();controls.clickKey('star:'+star.id,{});}else controls.enter(star.galaxyId);}
        }
        // Initial #universe already uses the preserved home camera; no automatic selection/content.
    });
    window.addEventListener('universe-esc',()=>{
        if(controls.policy.locked)return;
        if(controls.policy.selection){controls.clear();return;}
        if(store.get('placementMode')){cancelPlacementMode();return;}
        if(overlayClose){overlayClose();return;}
        if(!journey.drawer.hidden){journey.close();return;}
        if(tourBuilder.root.style.display==='flex'){tourBuilder.close();return;}
        if(document.body.classList.contains('planet-focused')){planetFocusPanel.close();return;}
        if(navigator.isOpen){navigator.openBtn.click();return;}
        controls.clear();controls.policy.interrupt();cam.stopMotion();
    });
    // ── Main Render & Spatial Audio Loop ─────────────────────────────────────
    let time = 0;
    startRenderLoop((dt) => {
        const motionDt=reducedMotion?0:dt;
        time += motionDt;
        controls.beforeFrame();
        cam.update(dt);
        controls.afterFrame(dt);

        const camPos = cam.camera.position;
        setBloomStrength(cam.localGalaxyId === 'G2025' ? 1.18 : 0.92);
        if(store.get('currentGalaxyId')!==controls.policy.galaxyId)store.set('currentGalaxyId',controls.policy.galaxyId);
        // No proximity-triggered songs or media. Only confirmed item actions reach openMediaOverlay.
        bg.update(time);
        atmosphere.update(time,cam.camera);
        if(!reducedMotion) updateNavigationGuide();
        for (const era of eraOrbitSystems)
            era.update(motionDt);
        for (const gs of galaxyScenes) {
            gs.update(time, camPos);
            gs.updateLabels(cam.camera, renderer, camPos, cam.localGalaxyId);
        }
        userLocator.position.lerp(locatorTarget, 0.14);
        userLocatorPulse.position.copy(userLocator.position);
        const targetScale = new THREE.Vector3(locatorScaleTarget, locatorScaleTarget, locatorScaleTarget);
        userLocator.scale.lerp(targetScale, 0.14);
        const pulseScale = new THREE.Vector3(locatorScaleTarget * (1.08 + 0.12 * (0.5 + 0.5 * Math.sin(time * 1.1))), locatorScaleTarget * (1.08 + 0.12 * (0.5 + 0.5 * Math.sin(time * 1.1))), locatorScaleTarget);
        userLocatorPulse.scale.lerp(pulseScale, 0.14);
        userLocator.rotation.z += motionDt * 0.28;
        userLocatorPulse.rotation.z -= motionDt * 0.2;
        const guideRgb = getComputedStyle(zoomReticle).getPropertyValue('--guide-color').trim().split(',').map(v => Number(v));
        if (guideRgb.length === 3 && guideRgb.every(v => Number.isFinite(v))) {
            const locatorColor = new THREE.Color(guideRgb[0] / 255, guideRgb[1] / 255, guideRgb[2] / 255);
            locatorMaterial.color.copy(locatorColor);
            userLocatorPulse.material.color.copy(locatorColor);
        }
        locatorMaterial.opacity = cam.selectedTarget ? (0.5 + 0.18 * (0.5 + 0.5 * Math.sin(time * 2.1))) : (0.24 + 0.09 * (0.5 + 0.5 * Math.sin(time * 1.4)));
        userLocatorPulse.material.opacity = cam.selectedTarget ? (0.16 + 0.14 * (0.5 + 0.5 * Math.sin(time * 1.6))) : 0.08;
        updateSelectionFlow(time);
        fireSystem?.update(motionDt, cam.camera, renderer);
        africaSystem?.update(motionDt, cam.camera, renderer);
        streamsSystem?.update(motionDt, cam.camera, renderer);
        frontierSystems?.update(motionDt, cam.camera, renderer);
        starLayer.update(camPos, cam.camera, renderer);
        cinematic.update(cam.camera,controls.policy.galaxyId);
        renderUniverse(scene, cam.camera);
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


