// 2Fly Universe Camera — V13-style selector/orbit/thruster navigation restored
import * as THREE from 'three';
import { GALAXY_THEMES, UNIVERSE_HOME_CAMERA } from './types.js';
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IDLE_TRIGGER_MS = 6000;
export class UniverseCamera {
    camera;
    canvas;
    target = new THREE.Vector3();
    fly = null;
    historyStack = [];
    // Selection / travel target
    selectedTarget = null;
    selectedTargetLabel = '';
    // Orbit state
    isDragging = false;
    leftDownAt = new THREE.Vector2();
    prevMouse = new THREE.Vector2();
    pointerScreen = new THREE.Vector2(window.innerWidth * 0.5, window.innerHeight * 0.5);
    spherical = new THREE.Spherical();
    tmpVec = new THREE.Vector3();
    zoomAnchor = null;
    velTheta = 0;
    velPhi = 0;
    velRadius = 0;
    DAMPING = 0.11;
    suppressNextLeftClick = false;
    // Right-mouse propulsion
    thrusting = false;
    thrustStartedAt = 0;
    thrustPointer = new THREE.Vector2(window.innerWidth * 0.5, window.innerHeight * 0.5);
    thrustDirection = new THREE.Vector3();
    travelVelocity = new THREE.Vector3();
    warpFactor = 0;
    baseFov = 55;
    suppressNextClick = false;
    // Galaxy residency / containment
    localGalaxyId = null;
    localGalaxyCenter = new THREE.Vector3();
    boundaryInfluence = 0;
    UNIVERSE_SAFE_RADIUS = 108000;
    UNIVERSE_RETURN_RADIUS = 142000;
    UNIVERSE_MAX_RADIUS = 188000;
    // Idle drift
    lastUserActivity = performance.now();
    isIdleDrifting = false;
    driftTime = 0;
    get isOrbiting() { return this.isDragging; }
    get isThrusting() { return this.thrusting; }
    get currentWarpFactor() { return this.warpFactor; }
    get travelSpeed() { return this.travelVelocity.length(); }
    constructor(canvas) {
        this.canvas = canvas;
        this.camera = new THREE.PerspectiveCamera(this.baseFov, window.innerWidth / window.innerHeight, 10, 2_000_000);
        const [hx, hy, hz] = UNIVERSE_HOME_CAMERA.position;
        const [tx, ty, tz] = UNIVERSE_HOME_CAMERA.target;
        this.camera.position.set(hx, hy, hz);
        this.target.set(tx, ty, tz);
        this.camera.lookAt(this.target);
        this.tmpVec.subVectors(this.camera.position, this.target);
        this.spherical.setFromVector3(this.tmpVec);
        this._bindEvents(canvas);
        window.addEventListener('universe-resize', (e) => {
            const ev = e;
            this.camera.aspect = ev.detail.width / ev.detail.height;
            this.camera.updateProjectionMatrix();
        });
    }
    setSelectedTarget(pos, label = '') {
        this.selectedTarget = pos ? new THREE.Vector3(pos.x, pos.y, pos.z) : null;
        this.selectedTargetLabel = label || '';
        window.dispatchEvent(new CustomEvent('universe-selection-state', {
            detail: {
                active: !!this.selectedTarget,
                label: this.selectedTargetLabel,
                world: this.selectedTarget ? { x: this.selectedTarget.x, y: this.selectedTarget.y, z: this.selectedTarget.z } : null,
            }
        }));
    }
    clearSelectedTarget() { this.setSelectedTarget(null, ''); }
    _onActivity() {
        this.lastUserActivity = performance.now();
        this.isIdleDrifting = false;
    }
    _bindEvents(canvas) {
        window.addEventListener('pointermove', () => this._onActivity(), { passive: true });
        window.addEventListener('wheel', () => this._onActivity(), { passive: true });
        window.addEventListener('keydown', () => this._onActivity(), { passive: true });
        window.addEventListener('touchstart', () => this._onActivity(), { passive: true });
        canvas.addEventListener('contextmenu', e => e.preventDefault());
        canvas.addEventListener('mousedown', e => {
            this._onActivity();
            this.pointerScreen.set(e.clientX, e.clientY);
            if (e.button === 0) {
                this._setGalaxyOrbitPivotIfInside();
                this.isDragging = true;
                this.leftDownAt.set(e.clientX, e.clientY);
                this.prevMouse.set(e.clientX, e.clientY);
                this.velTheta = 0;
                this.velPhi = 0;
                return;
            }
            if (e.button === 2) {
                e.preventDefault();
                this._startThrust(e.clientX, e.clientY);
            }
        });
        canvas.addEventListener('mousemove', e => {
            this.pointerScreen.set(e.clientX, e.clientY);
            if (this.thrusting)
                this.thrustPointer.set(e.clientX, e.clientY);
            if (!this.isDragging)
                return;
            const dx = e.clientX - this.prevMouse.x;
            const dy = e.clientY - this.prevMouse.y;
            if (Math.hypot(e.clientX - this.leftDownAt.x, e.clientY - this.leftDownAt.y) > 6)
                this.suppressNextLeftClick = true;
            this._orbit(dx * 0.00125, dy * 0.0011);
            this.prevMouse.set(e.clientX, e.clientY);
        });
        window.addEventListener('mouseup', e => {
            if (e.button === 0)
                this.isDragging = false;
            if (e.button === 2 && this.thrusting)
                this._stopThrust(false);
        });
        canvas.addEventListener('wheel', e => this._onWheel(e), { passive: false });
        canvas.addEventListener('dblclick', () => this._onActivity());
        let lastPinchDist = 0;
        let touches = [];
        canvas.addEventListener('touchstart', e => {
            this._onActivity();
            touches = Array.from(e.touches);
            if (touches.length === 1) {
                this._setGalaxyOrbitPivotIfInside();
                this.isDragging = true;
                this.prevMouse.set(touches[0].clientX, touches[0].clientY);
            }
            else if (touches.length === 2) {
                this.isDragging = false;
                lastPinchDist = _pinchDist(touches);
            }
        }, { passive: true });
        canvas.addEventListener('touchmove', e => {
            this._onActivity();
            touches = Array.from(e.touches);
            if (touches.length === 1 && this.isDragging) {
                const dx = touches[0].clientX - this.prevMouse.x;
                const dy = touches[0].clientY - this.prevMouse.y;
                this._orbit(dx * 0.00125, dy * 0.0011);
                this.prevMouse.set(touches[0].clientX, touches[0].clientY);
            }
            else if (touches.length === 2) {
                const d = _pinchDist(touches);
                const delta = lastPinchDist - d;
                const cx = (touches[0].clientX + touches[1].clientX) * 0.5;
                const cy = (touches[0].clientY + touches[1].clientY) * 0.5;
                this._zoomTowardPointer(delta * 0.00034, cx, cy);
                lastPinchDist = d;
            }
        }, { passive: true });
        canvas.addEventListener('touchend', () => { this.isDragging = false; });
        window.addEventListener('keydown', e => { if (e.key === 'Escape')
            window.dispatchEvent(new CustomEvent('universe-esc')); });
    }
    _setGalaxyOrbitPivotIfInside() {
        let bestId = null;
        let bestDist = Infinity;
        let bestCenter = null;
        for (const [id, theme] of Object.entries(GALAXY_THEMES)) {
            const center = new THREE.Vector3(...theme.worldOffset);
            const d = this.camera.position.distanceTo(center);
            const enterRadius = 15000 * (theme.scale ?? 1);
            if (d < enterRadius && d < bestDist) {
                bestId = id;
                bestDist = d;
                bestCenter = center;
            }
        }
        if (bestId && bestCenter) {
            this.localGalaxyId = bestId;
            this.localGalaxyCenter.copy(bestCenter);
            this.target.copy(bestCenter);
            this.tmpVec.subVectors(this.camera.position, this.target);
            this.spherical.setFromVector3(this.tmpVec);
        }
    }
    _orbit(dTheta, dPhi) {
        // Direct orbit around current pivot. Radius is preserved exactly while dragging.
        this.spherical.theta -= dTheta;
        this.spherical.phi = THREE.MathUtils.clamp(this.spherical.phi - dPhi, 0.05, Math.PI - 0.05);
        this.velTheta = 0;
        this.velPhi = 0;
    }
    _screenRay(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        const ndc = new THREE.Vector2(((clientX - rect.left) / rect.width) * 2 - 1, -(((clientY - rect.top) / rect.height) * 2 - 1));
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(ndc, this.camera);
        return raycaster.ray.clone();
    }
    _screenRayDirection(clientX, clientY) {
        return this._screenRay(clientX, clientY).direction.normalize();
    }
    _startThrust(x, y) {
        this.fly = null;
        this.thrusting = true;
        this.thrustStartedAt = performance.now();
        this.thrustPointer.set(x, y);
        const dir = this.selectedTarget
            ? this.selectedTarget.clone().sub(this.camera.position).normalize()
            : this._screenRayDirection(x, y);
        this.thrustDirection.copy(dir);
        // Absolutely no backward wind-up: remove any reverse component immediately.
        const reverse = this.travelVelocity.dot(dir);
        if (reverse < 0)
            this.travelVelocity.addScaledVector(dir, -reverse);
    }
    _stopThrust(force = false) {
        if (!this.thrusting && !force)
            return;
        const heldMs = performance.now() - this.thrustStartedAt;
        if (!force && heldMs < 220) {
            const dir = this.selectedTarget
                ? this.selectedTarget.clone().sub(this.camera.position).normalize()
                : this._screenRayDirection(this.thrustPointer.x, this.thrustPointer.y);
            this.travelVelocity.addScaledVector(dir, 6800);
            this.suppressNextClick = true;
        }
        this.thrusting = false;
        this.warpFactor = 0;
    }
    _updateThrust(dt) {
        if (this.thrusting) {
            const held = (performance.now() - this.thrustStartedAt) / 1000;
            const desired = this.selectedTarget
                ? this.selectedTarget.clone().sub(this.camera.position).normalize()
                : this._screenRayDirection(this.thrustPointer.x, this.thrustPointer.y);
            this.thrustDirection.lerp(desired, THREE.MathUtils.clamp(dt * 10, 0, 1)).normalize();
            const reverse = this.travelVelocity.dot(this.thrustDirection);
            if (reverse < 0)
                this.travelVelocity.addScaledVector(this.thrustDirection, -reverse);
            const warp = held < 3.8 ? 0 : THREE.MathUtils.clamp((held - 3.8) / 3.7, 0, 1);
            const speed = 10500 + 22500 * warp;
            const targetVelocity = this.thrustDirection.clone().multiplyScalar(speed);
            this.travelVelocity.lerp(targetVelocity, THREE.MathUtils.clamp(dt * 14, 0, 1));
            this.warpFactor = THREE.MathUtils.lerp(this.warpFactor, warp, THREE.MathUtils.clamp(dt * 4, 0, 1));
        }
        else {
            this.travelVelocity.multiplyScalar(Math.exp(-4.3 * dt));
            if (this.travelVelocity.length() < 8)
                this.travelVelocity.set(0, 0, 0);
            this.warpFactor = THREE.MathUtils.lerp(this.warpFactor, 0, THREE.MathUtils.clamp(dt * 6, 0, 1));
        }
        const desiredFov = this.baseFov * (1 + this.warpFactor * 0.16);
        this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, desiredFov, THREE.MathUtils.clamp(dt * 7, 0, 1));
        this.camera.updateProjectionMatrix();
        const delta = this.travelVelocity.clone().multiplyScalar(dt);
        this.camera.position.add(delta);
        this.target.add(delta);
    }
    _applyBoundary(dt) {
        const dist = this.camera.position.length();
        if (this.selectedTarget) {
            this.boundaryInfluence = THREE.MathUtils.lerp(this.boundaryInfluence, 0, THREE.MathUtils.clamp(dt * 4, 0, 1));
            return;
        }
        const soft = THREE.MathUtils.clamp((dist - this.UNIVERSE_SAFE_RADIUS) / (this.UNIVERSE_RETURN_RADIUS - this.UNIVERSE_SAFE_RADIUS), 0, 1);
        const hard = THREE.MathUtils.clamp((dist - this.UNIVERSE_RETURN_RADIUS) / (this.UNIVERSE_MAX_RADIUS - this.UNIVERSE_RETURN_RADIUS), 0, 1);
        const influence = Math.max(soft * 0.42, hard);
        this.boundaryInfluence = THREE.MathUtils.lerp(this.boundaryInfluence, influence, THREE.MathUtils.clamp(dt * 2.4, 0, 1));
        if (this.boundaryInfluence > 0.001) {
            const homeDir = this.camera.position.clone().multiplyScalar(-1).normalize();
            const speed = Math.max(this.travelVelocity.length(), 2200);
            this.travelVelocity.lerp(homeDir.multiplyScalar(speed), THREE.MathUtils.clamp(this.boundaryInfluence * dt * 2.3, 0, .2));
            window.dispatchEvent(new CustomEvent('universe-boundary', { detail: { influence: this.boundaryInfluence, distance: dist } }));
        }
        if (dist > this.UNIVERSE_MAX_RADIUS) {
            const clamped = this.camera.position.clone().normalize().multiplyScalar(this.UNIVERSE_MAX_RADIUS - 5000);
            const shift = clamped.clone().sub(this.camera.position);
            this.camera.position.add(shift);
            this.target.add(shift);
        }
    }
    _refreshLocalGalaxy() {
        let nearestId = null;
        let nearestDist = Infinity;
        for (const [id, theme] of Object.entries(GALAXY_THEMES)) {
            const center = new THREE.Vector3(...theme.worldOffset);
            const d = this.camera.position.distanceTo(center);
            if (d < nearestDist) {
                nearestDist = d;
                nearestId = id;
            }
        }
        if (!nearestId)
            return;
        const theme = GALAXY_THEMES[nearestId];
        const threshold = 16500 * (theme.scale ?? 1);
        this.localGalaxyId = nearestDist < threshold ? nearestId : null;
        if (this.localGalaxyId)
            this.localGalaxyCenter.set(...theme.worldOffset);
    }
    _onWheel(e) {
        e.preventDefault();
        this._onActivity();
        const anchorScreen = this.zoomAnchor?.screen;
        const ax = anchorScreen?.x ?? e.clientX;
        const ay = anchorScreen?.y ?? e.clientY;
        this.pointerScreen.set(ax, ay);
        const normalized = THREE.MathUtils.clamp(e.deltaY, -120, 120);
        this._zoomTowardPointer(normalized * 0.000085, ax, ay);
    }
    _zoom(delta) {
        const clamped = THREE.MathUtils.clamp(delta, -0.022, 0.022);
        this.velRadius += clamped * this.spherical.radius * 0.026;
    }
    _zoomTowardPointer(delta, clientX, clientY) {
        const clamped = THREE.MathUtils.clamp(delta, -0.022, 0.022);
        const anchor = this.screenPointToFocusPoint(clientX, clientY);
        const anchorFraction = THREE.MathUtils.clamp(-clamped * 2.35, -0.075, 0.075);
        const toAnchor = anchor.clone().sub(this.camera.position);
        const maxTranslation = Math.max(180, Math.min(this.spherical.radius * 0.085, 2600));
        const translation = toAnchor.multiplyScalar(anchorFraction);
        if (translation.length() > maxTranslation)
            translation.setLength(maxTranslation);
        this.camera.position.add(translation);
        this.tmpVec.subVectors(this.camera.position, this.target);
        this.spherical.setFromVector3(this.tmpVec);
        this._zoom(clamped);
    }
    screenPointToFocusPoint(clientX, clientY) {
        const ray = this._screenRay(clientX, clientY);
        const viewDir = new THREE.Vector3();
        this.camera.getWorldDirection(viewDir);
        const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(viewDir, this.target);
        const focus = new THREE.Vector3();
        const hit = ray.intersectPlane(plane, focus);
        if (hit)
            return hit.clone();
        return this.camera.position.clone().addScaledVector(ray.direction, Math.max(this.spherical.radius * .65, 3500));
    }
    placeZoomAnchor(clientX, clientY) {
        const focusPoint = this.screenPointToFocusPoint(clientX, clientY);
        this.zoomAnchor = { screen: new THREE.Vector2(clientX, clientY), world: focusPoint.clone() };
        this.pointerScreen.set(clientX, clientY);
        return focusPoint;
    }
    hasZoomAnchor() { return this.zoomAnchor !== null; }
    isNearZoomAnchor(clientX, clientY, thresholdPx = 44) {
        if (!this.zoomAnchor)
            return false;
        return this.zoomAnchor.screen.distanceTo(new THREE.Vector2(clientX, clientY)) <= thresholdPx;
    }
    getZoomAnchorScreenPoint() { return this.zoomAnchor ? { x: this.zoomAnchor.screen.x, y: this.zoomAnchor.screen.y } : null; }
    getZoomAnchorWorldPoint() { return this.zoomAnchor?.world.clone() ?? null; }
    clearZoomAnchor() { this.zoomAnchor = null; }
    travelTowardZoomAnchor(opts = {}) {
        const p = this.zoomAnchor?.screen ?? this.pointerScreen;
        return this.travelTowardScreenPoint(p.x, p.y, opts);
    }
    travelTowardScreenPoint(clientX, clientY, opts = {}) {
        const focusPoint = this.screenPointToFocusPoint(clientX, clientY);
        const currentRadius = this.spherical.radius;
        const offsetDir = this.camera.position.clone().sub(this.target).normalize();
        const newRadius = THREE.MathUtils.clamp(currentRadius * .9, 900, 260000);
        const endTarget = focusPoint.clone();
        const endPos = focusPoint.clone().addScaledVector(offsetDir, newRadius);
        this.flyTo(endPos, endTarget, { duration: 1150, saveHistory: true, ...opts });
        return focusPoint;
    }
    consumeThrustClick() {
        if (!this.suppressNextClick)
            return false;
        this.suppressNextClick = false;
        return true;
    }
    consumeOrbitClick() {
        if (!this.suppressNextLeftClick)
            return false;
        this.suppressNextLeftClick = false;
        return true;
    }
    update(dt) {
        if (this.fly) {
            this._updateFly(dt);
            return;
        }
        this._refreshLocalGalaxy();
        const now = performance.now();
        if (!REDUCED_MOTION && !this.isDragging && !this.thrusting && this.travelVelocity.length() < 1 && now - this.lastUserActivity > IDLE_TRIGGER_MS)
            this.isIdleDrifting = true;
        if (this.isIdleDrifting) {
            this.driftTime += dt;
            this.spherical.theta += dt * .006;
            this.spherical.phi = THREE.MathUtils.clamp(this.spherical.phi + Math.sin(this.driftTime * .18) * .00012, .05, Math.PI - .05);
        }
        else if (!this.isDragging) {
            this.spherical.theta += this.velTheta;
            this.spherical.phi = THREE.MathUtils.clamp(this.spherical.phi + this.velPhi, .05, Math.PI - .05);
            this.spherical.radius = THREE.MathUtils.clamp(this.spherical.radius + this.velRadius, 150, 320000);
            this.velTheta *= 1 - this.DAMPING;
            this.velPhi *= 1 - this.DAMPING;
            this.velRadius *= 1 - this.DAMPING;
        }
        this.tmpVec.setFromSpherical(this.spherical).add(this.target);
        this.camera.position.copy(this.tmpVec);
        this._updateThrust(dt);
        this._applyBoundary(dt);
        this.tmpVec.subVectors(this.camera.position, this.target);
        this.spherical.setFromVector3(this.tmpVec);
        this.camera.lookAt(this.target);
    }
    _updateFly(_dt) {
        if (!this.fly)
            return;
        this.fly.elapsed += 16;
        const t = REDUCED_MOTION ? 1 : Math.min(this.fly.elapsed / this.fly.duration, 1);
        const ease = easeInOutCubic(t);
        this.camera.position.lerpVectors(this.fly.startPos, this.fly.endPos, ease);
        this.target.lerpVectors(this.fly.startTarget, this.fly.endTarget, ease);
        this.camera.lookAt(this.target);
        if (t >= 1) {
            const done = this.fly.onDone;
            this.fly = null;
            this.tmpVec.subVectors(this.camera.position, this.target);
            this.spherical.setFromVector3(this.tmpVec);
            this.velTheta = 0;
            this.velPhi = 0;
            this.velRadius = 0;
            this.travelVelocity.set(0, 0, 0);
            done?.();
        }
    }
    flyTo(pos, lookAt, opts = {}) {
        if (opts.saveHistory)
            this.historyStack.push(this.snapshot());
        this._stopThrust(true);
        this.travelVelocity.set(0, 0, 0);
        const duration = REDUCED_MOTION ? 200 : (opts.duration ?? 1100);
        this.fly = {
            startPos: this.camera.position.clone(), startTarget: this.target.clone(),
            endPos: new THREE.Vector3(pos.x, pos.y, pos.z), endTarget: new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z),
            elapsed: 0, duration, onDone: opts.onDone,
        };
    }
    travelToObject(worldPos, distanceRadius = 1200, opts = {}) {
        const offset = new THREE.Vector3(distanceRadius * .82, distanceRadius * .54, distanceRadius * .82);
        this.flyTo({ x: worldPos.x + offset.x, y: worldPos.y + offset.y, z: worldPos.z + offset.z }, worldPos, { duration: 1200, saveHistory: true, ...opts });
    }
    resetToHome(opts = {}) {
        const [hx, hy, hz] = UNIVERSE_HOME_CAMERA.position;
        const [tx, ty, tz] = UNIVERSE_HOME_CAMERA.target;
        this.clearSelectedTarget();
        this._stopThrust(true);
        this.flyTo({ x: hx, y: hy, z: hz }, { x: tx, y: ty, z: tz }, { duration: 1400, saveHistory: false, ...opts });
    }
    returnToPrevious(_opts = {}) {
        const prev = this.historyStack.pop();
        if (!prev)
            return false;
        this.restoreSnapshot(prev, true);
        return true;
    }
    hasHistory() { return this.historyStack.length > 0; }
    snapshot() { return { position: [this.camera.position.x, this.camera.position.y, this.camera.position.z], target: [this.target.x, this.target.y, this.target.z], zoom: this.spherical.radius }; }
    restoreSnapshot(snap, animate = true) {
        const pos = { x: snap.position[0], y: snap.position[1], z: snap.position[2] };
        const tgt = { x: snap.target[0], y: snap.target[1], z: snap.target[2] };
        if (animate)
            this.flyTo(pos, tgt, { duration: 800 });
        else {
            this.travelVelocity.set(0, 0, 0);
            this.camera.position.set(pos.x, pos.y, pos.z);
            this.target.set(tgt.x, tgt.y, tgt.z);
            this.camera.lookAt(this.target);
            this.tmpVec.subVectors(this.camera.position, this.target);
            this.spherical.setFromVector3(this.tmpVec);
        }
    }
    getTarget() { return this.target.clone(); }
    getRadius() { return this.spherical.radius; }
    isBusy() { return this.fly !== null; }
}
function easeInOutCubic(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function _pinchDist(touches) {
    const dx = touches[1].clientX - touches[0].clientX;
    const dy = touches[1].clientY - touches[0].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}
