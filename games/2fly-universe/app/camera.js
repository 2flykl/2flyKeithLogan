// Camera — V13-style selector/orbit/thruster navigation restored.
import * as THREE from 'three';
import { UNIVERSE_HOME_CAMERA } from './types.js';
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IDLE_TRIGGER_MS = 6000;
export class UniverseCamera {
    camera;
    target = new THREE.Vector3();
    fly = null;
    historyStack = [];
    // Selected navigation target. Selection never opens media by itself.
    selectedTarget = null;
    selectedTargetLabel = '';
    // Orbit state.
    isDragging = false;
    dragMoved = false;
    prevMouse = new THREE.Vector2();
    pointerScreen = new THREE.Vector2(window.innerWidth * 0.5, window.innerHeight * 0.5);
    spherical = new THREE.Spherical();
    tmpVec = new THREE.Vector3();
    zoomAnchor = null;
    localGalaxyCenter = null;
    // Damping.
    velTheta = 0;
    velPhi = 0;
    velRadius = 0;
    DAMPING = 0.11;
    canvas;
    // Thruster / inertial travel.
    thrusting = false;
    thrustStartedAt = 0;
    thrustPointer = new THREE.Vector2(window.innerWidth * 0.5, window.innerHeight * 0.5);
    travelVelocity = new THREE.Vector3();
    thrustDirection = new THREE.Vector3(0, 0, -1);
    warpFactor = 0;
    suppressNextClick = false;
    // Universe containment — comfortably beyond every galaxy after the spacing pass.
    universeCenter = new THREE.Vector3(-1800, -2200, -15500);
    UNIVERSE_SAFE_RADIUS = 125_000;
    UNIVERSE_RETURN_RADIUS = 170_000;
    UNIVERSE_MAX_RADIUS = 220_000;
    // Passive idle drift.
    lastUserActivity = performance.now();
    isIdleDrifting = false;
    driftTime = 0;
    constructor(canvas) {
        this.canvas = canvas;
        this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 10, 2_000_000);
        const [hx, hy, hz] = UNIVERSE_HOME_CAMERA.position;
        const [tx, ty, tz] = UNIVERSE_HOME_CAMERA.target;
        this.camera.position.set(hx, hy, hz);
        this.target.set(tx, ty, tz);
        this.camera.lookAt(this.target);
        this.syncSpherical();
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
            },
        }));
    }
    clearSelectedTarget() {
        this.setSelectedTarget(null, '');
    }
    /** Sets the true orbit axis when the visitor is inside a galaxy, without moving the camera. */
    setLocalGalaxyCenter(pos) {
        this.localGalaxyCenter = pos ? new THREE.Vector3(pos.x, pos.y, pos.z) : null;
        if (this.localGalaxyCenter && !this.thrusting && !this.fly) {
            this.target.copy(this.localGalaxyCenter);
            this.syncSpherical();
            this.camera.lookAt(this.target);
        }
    }
    syncSpherical() {
        this.tmpVec.subVectors(this.camera.position, this.target);
        this.spherical.setFromVector3(this.tmpVec);
    }
    _onActivity() {
        this.lastUserActivity = performance.now();
        this.isIdleDrifting = false;
    }
    _bindEvents(canvas) {
        const resetIdle = () => this._onActivity();
        window.addEventListener('pointermove', resetIdle, { passive: true });
        window.addEventListener('wheel', resetIdle, { passive: true });
        window.addEventListener('keydown', resetIdle, { passive: true });
        window.addEventListener('touchstart', resetIdle, { passive: true });
        canvas.addEventListener('contextmenu', e => e.preventDefault());
        canvas.addEventListener('mousedown', e => {
            this._onActivity();
            this.pointerScreen.set(e.clientX, e.clientY);
            if (e.button === 0) {
                this.isDragging = true;
                this.dragMoved = false;
                this.prevMouse.set(e.clientX, e.clientY);
            }
            else if (e.button === 2) {
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
            if (Math.hypot(dx, dy) > 1.5)
                this.dragMoved = true;
            this._orbit(dx * 0.000065, dy * 0.00006);
            this.prevMouse.set(e.clientX, e.clientY);
        });
        window.addEventListener('mouseup', e => {
            if (e.button === 0)
                this.isDragging = false;
            if (e.button === 2)
                this._stopThrust();
        });
        canvas.addEventListener('wheel', e => this._onWheel(e), { passive: false });
        canvas.addEventListener('dblclick', e => this._onDblClick(e));
        let lastPinchDist = 0;
        let touches = [];
        canvas.addEventListener('touchstart', e => {
            this._onActivity();
            touches = Array.from(e.touches);
            if (touches.length === 1) {
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
                this._orbit(dx * 0.00007, dy * 0.00006);
                this.prevMouse.set(touches[0].clientX, touches[0].clientY);
            }
            else if (touches.length === 2) {
                const d = _pinchDist(touches);
                const delta = lastPinchDist - d;
                const cx = (touches[0].clientX + touches[1].clientX) * 0.5;
                const cy = (touches[0].clientY + touches[1].clientY) * 0.5;
                this.pointerScreen.set(cx, cy);
                this._zoomTowardPointer(delta * 0.00034, cx, cy);
                lastPinchDist = d;
            }
        }, { passive: true });
        canvas.addEventListener('touchend', () => { this.isDragging = false; });
        window.addEventListener('keydown', e => {
            if (e.key === 'Escape')
                window.dispatchEvent(new CustomEvent('universe-esc'));
        });
    }
    _orbit(dTheta, dPhi) {
        // Inside a galaxy, orbit always uses the galaxy center as the fixed axis.
        if (this.localGalaxyCenter && !this.thrusting) {
            this.target.copy(this.localGalaxyCenter);
            this.syncSpherical();
        }
        this.velTheta -= dTheta;
        this.velPhi -= dPhi;
    }
    _startThrust(clientX, clientY) {
        if (this.fly)
            return;
        this.thrusting = true;
        this.thrustStartedAt = performance.now();
        this.thrustPointer.set(clientX, clientY);
        this.suppressNextClick = true;
        const dir = this.getDesiredThrustDirection();
        // Never pull backward before thrusting: strip any opposing velocity immediately.
        const backwards = this.travelVelocity.dot(dir);
        if (backwards < 0)
            this.travelVelocity.addScaledVector(dir, -backwards);
        // Right-click always gives an immediate short forward boost.
        this.travelVelocity.addScaledVector(dir, 2800);
    }
    _stopThrust() {
        if (!this.thrusting)
            return;
        this.thrusting = false;
        this.warpFactor = 0;
        this.suppressNextClick = false;
        if (this.localGalaxyCenter) {
            // Re-establish the galaxy as the true orbit pivot without changing camera position/radius.
            this.target.copy(this.localGalaxyCenter);
            this.syncSpherical();
            this.camera.lookAt(this.target);
        }
    }
    getDesiredThrustDirection() {
        if (this.selectedTarget) {
            const d = this.selectedTarget.clone().sub(this.camera.position);
            if (d.lengthSq() > 0.0001)
                return d.normalize();
        }
        return this._screenRay(this.thrustPointer.x, this.thrustPointer.y).direction.normalize();
    }
    _updateThrust(dt) {
        if (this.thrusting) {
            const held = (performance.now() - this.thrustStartedAt) / 1000;
            const desired = this.getDesiredThrustDirection();
            this.thrustDirection.lerp(desired, THREE.MathUtils.clamp(dt * 11, 0, 1)).normalize();
            const backwards = this.travelVelocity.dot(this.thrustDirection);
            if (backwards < 0)
                this.travelVelocity.addScaledVector(this.thrustDirection, -backwards);
            // Progressive acceleration. Warp starts only after a deliberate sustained hold.
            const warp = THREE.MathUtils.clamp((held - 2.8) / 3.8, 0, 1);
            this.warpFactor = THREE.MathUtils.lerp(this.warpFactor, warp, THREE.MathUtils.clamp(dt * 2.8, 0, 1));
            const targetSpeed = 10_500 + 31_500 * this.warpFactor;
            this.travelVelocity.lerp(this.thrustDirection.clone().multiplyScalar(targetSpeed), THREE.MathUtils.clamp(dt * 7.5, 0, 1));
        }
        else {
            // Natural post-thrust drift instead of stopping dead.
            this.travelVelocity.multiplyScalar(Math.exp(-2.7 * dt));
            if (this.travelVelocity.length() < 8)
                this.travelVelocity.set(0, 0, 0);
        }
        if (this.travelVelocity.lengthSq() > 0) {
            const delta = this.travelVelocity.clone().multiplyScalar(dt);
            this.camera.position.add(delta);
            // Outside a fixed local-galaxy pivot, move the look target with travel so thrust feels spatial, not like zoom.
            if (!this.localGalaxyCenter || this.thrusting)
                this.target.add(delta);
            this.syncSpherical();
        }
        // Small FOV expansion communicates warp without changing world scale.
        const targetFov = 55 * (1 + this.warpFactor * 0.12);
        this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFov, THREE.MathUtils.clamp(dt * 6, 0, 1));
        this.camera.updateProjectionMatrix();
    }
    _applyBoundary(dt) {
        const fromCenter = this.camera.position.clone().sub(this.universeCenter);
        const dist = fromCenter.length();
        const soft = THREE.MathUtils.clamp((dist - this.UNIVERSE_SAFE_RADIUS) / (this.UNIVERSE_RETURN_RADIUS - this.UNIVERSE_SAFE_RADIUS), 0, 1);
        const hard = THREE.MathUtils.clamp((dist - this.UNIVERSE_RETURN_RADIUS) / (this.UNIVERSE_MAX_RADIUS - this.UNIVERSE_RETURN_RADIUS), 0, 1);
        const influence = this.selectedTarget ? hard * 0.3 : Math.max(soft * 0.34, hard);
        if (influence > 0.001) {
            const homeDir = this.universeCenter.clone().sub(this.camera.position).normalize();
            const speed = Math.max(this.travelVelocity.length(), 1800);
            this.travelVelocity.lerp(homeDir.multiplyScalar(speed), THREE.MathUtils.clamp(influence * dt * 2.4, 0, 0.18));
        }
        if (dist > this.UNIVERSE_MAX_RADIUS) {
            const clampedPos = this.universeCenter.clone().add(fromCenter.normalize().multiplyScalar(this.UNIVERSE_MAX_RADIUS - 6000));
            this.camera.position.lerp(clampedPos, THREE.MathUtils.clamp(dt * 2.5, 0, 0.18));
            this.syncSpherical();
        }
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
        const toAnchor = anchor.clone().sub(this.target);
        const maxTranslation = Math.max(180, Math.min(this.spherical.radius * 0.085, 2600));
        const translation = toAnchor.multiplyScalar(anchorFraction);
        if (translation.length() > maxTranslation)
            translation.setLength(maxTranslation);
        this.camera.position.add(translation);
        this.syncSpherical();
        this._zoom(clamped);
    }
    _screenRay(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        const ndc = new THREE.Vector2(((clientX - rect.left) / rect.width) * 2 - 1, -(((clientY - rect.top) / rect.height) * 2 - 1));
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(ndc, this.camera);
        return raycaster.ray.clone();
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
        return this.target.clone().addScaledVector(ray.direction, Math.max(this.spherical.radius * 0.65, 3500));
    }
    placeZoomAnchor(clientX, clientY) {
        const focusPoint = this.screenPointToFocusPoint(clientX, clientY);
        this.zoomAnchor = { screen: new THREE.Vector2(clientX, clientY), world: focusPoint.clone() };
        this.pointerScreen.set(clientX, clientY);
        return focusPoint;
    }
    hasZoomAnchor() { return this.zoomAnchor !== null; }
    isNearZoomAnchor(clientX, clientY, thresholdPx = 44) {
        return !!this.zoomAnchor && this.zoomAnchor.screen.distanceTo(new THREE.Vector2(clientX, clientY)) <= thresholdPx;
    }
    getZoomAnchorScreenPoint() { return this.zoomAnchor ? { x: this.zoomAnchor.screen.x, y: this.zoomAnchor.screen.y } : null; }
    getZoomAnchorWorldPoint() { return this.zoomAnchor?.world.clone() ?? null; }
    clearZoomAnchor() { this.zoomAnchor = null; }
    travelTowardZoomAnchor(opts = {}) {
        if (this.zoomAnchor)
            return this.travelTowardScreenPoint(this.zoomAnchor.screen.x, this.zoomAnchor.screen.y, opts);
        return this.travelTowardScreenPoint(this.pointerScreen.x, this.pointerScreen.y, opts);
    }
    travelTowardScreenPoint(clientX, clientY, opts = {}) {
        const focusPoint = this.screenPointToFocusPoint(clientX, clientY);
        const currentRadius = this.spherical.radius;
        const offsetDir = this.camera.position.clone().sub(this.target).normalize();
        const newRadius = THREE.MathUtils.clamp(currentRadius * 0.82, 900, 260000);
        const endTarget = focusPoint.clone();
        const endPos = focusPoint.clone().addScaledVector(offsetDir, newRadius);
        this.flyTo(endPos, endTarget, { duration: 1750, saveHistory: true, ...opts });
        return focusPoint;
    }
    _onDblClick(_e) { this._onActivity(); }
    /** Used by the shell so a right-mouse thrust never becomes a left-click selection action. */
    consumeThrustClick() {
        if (!this.suppressNextClick)
            return false;
        this.suppressNextClick = false;
        return true;
    }
    update(dt) {
        if (this.fly) {
            this._updateFly(dt);
            return;
        }
        const now = performance.now();
        if (!REDUCED_MOTION && !this.isDragging && !this.thrusting && this.travelVelocity.length() < 1 && now - this.lastUserActivity > IDLE_TRIGGER_MS) {
            this.isIdleDrifting = true;
        }
        if (this.localGalaxyCenter && !this.thrusting && !this.isDragging) {
            this.target.copy(this.localGalaxyCenter);
            this.syncSpherical();
        }
        if (this.isIdleDrifting) {
            this.driftTime += dt;
            this.spherical.theta += dt * 0.006;
            this.spherical.phi = THREE.MathUtils.clamp(this.spherical.phi + Math.sin(this.driftTime * 0.18) * 0.00012, 0.05, Math.PI - 0.05);
        }
        else {
            this.spherical.theta += this.velTheta;
            this.spherical.phi = THREE.MathUtils.clamp(this.spherical.phi + this.velPhi, 0.05, Math.PI - 0.05);
            this.spherical.radius = THREE.MathUtils.clamp(this.spherical.radius + this.velRadius, 150, 320_000);
            this.velTheta *= 1 - this.DAMPING;
            this.velPhi *= 1 - this.DAMPING;
            this.velRadius *= 1 - this.DAMPING;
        }
        this.tmpVec.setFromSpherical(this.spherical).add(this.target);
        this.camera.position.copy(this.tmpVec);
        this._updateThrust(dt);
        this._applyBoundary(dt);
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
            this.syncSpherical();
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
        this.thrusting = false;
        this.travelVelocity.set(0, 0, 0);
        const duration = REDUCED_MOTION ? 200 : (opts.duration ?? 1100);
        this.fly = {
            startPos: this.camera.position.clone(), startTarget: this.target.clone(),
            endPos: new THREE.Vector3(pos.x, pos.y, pos.z), endTarget: new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z),
            elapsed: 0, duration, onDone: opts.onDone,
        };
    }
    travelToObject(worldPos, distanceRadius = 1200, opts = {}) {
        const offset = new THREE.Vector3(distanceRadius * 0.7, distanceRadius * 0.45, distanceRadius * 0.7);
        this.flyTo({ x: worldPos.x + offset.x, y: worldPos.y + offset.y, z: worldPos.z + offset.z }, worldPos, {
            duration: 1450, saveHistory: true, ...opts,
        });
    }
    resetToHome(opts = {}) {
        const [hx, hy, hz] = UNIVERSE_HOME_CAMERA.position;
        const [tx, ty, tz] = UNIVERSE_HOME_CAMERA.target;
        this.localGalaxyCenter = null;
        this.clearSelectedTarget();
        this.clearZoomAnchor();
        this.flyTo({ x: hx, y: hy, z: hz }, { x: tx, y: ty, z: tz }, { duration: 1400, saveHistory: true, ...opts });
    }
    returnToPrevious(opts = {}) {
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
            this.camera.position.set(pos.x, pos.y, pos.z);
            this.target.set(tgt.x, tgt.y, tgt.z);
            this.camera.lookAt(this.target);
            this.syncSpherical();
        }
    }
    getTarget() { return this.target.clone(); }
    getRadius() { return this.spherical.radius; }
    isBusy() { return this.fly !== null; }
    isThrusting() { return this.thrusting; }
    getWarpFactor() { return this.warpFactor; }
}
function easeInOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function _pinchDist(touches) {
    const dx = touches[1].clientX - touches[0].clientX;
    const dy = touches[1].clientY - touches[0].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}
