// Camera — Phase II Spatial Exploration, Click-To-Travel, Idle Drift & Home Reset Engine
import * as THREE from 'three';
import { UNIVERSE_HOME_CAMERA } from './types.js';
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IDLE_TRIGGER_MS = 6000; // 6 seconds to trigger passive drift
export class UniverseCamera {
    camera;
    target = new THREE.Vector3();
    fly = null;
    historyStack = [];
    // Orbit state
    isDragging = false;
    prevMouse = new THREE.Vector2();
    pointerScreen = new THREE.Vector2(window.innerWidth * 0.5, window.innerHeight * 0.5);
    spherical = new THREE.Spherical();
    tmpVec = new THREE.Vector3();
    // Damping
    velTheta = 0;
    velPhi = 0;
    velRadius = 0;
    DAMPING = 0.075;
    canvas;
    // Passive Idle Drift
    lastUserActivity = performance.now();
    isIdleDrifting = false;
    driftTime = 0;
    constructor(canvas) {
        this.canvas = canvas;
        this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 10, 2_000_000);
        // Initial composition centered on Showcase Era G2025 at (0, 0, 0)
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
    _onActivity() {
        this.lastUserActivity = performance.now();
        if (this.isIdleDrifting) {
            this.isIdleDrifting = false;
        }
    }
    _bindEvents(canvas) {
        // Activity listeners
        const resetIdle = () => this._onActivity();
        window.addEventListener('pointermove', resetIdle, { passive: true });
        window.addEventListener('wheel', resetIdle, { passive: true });
        window.addEventListener('keydown', resetIdle, { passive: true });
        window.addEventListener('touchstart', resetIdle, { passive: true });
        // Mouse Controls
        canvas.addEventListener('mousedown', e => {
            this._onActivity();
            this.isDragging = true;
            this.prevMouse.set(e.clientX, e.clientY);
        });
        canvas.addEventListener('mousemove', e => {
            this.pointerScreen.set(e.clientX, e.clientY);
            if (!this.isDragging)
                return;
            this._onActivity();
            const dx = e.clientX - this.prevMouse.x;
            const dy = e.clientY - this.prevMouse.y;
            this._orbit(dx * 0.00068, dy * 0.00068);
            this.prevMouse.set(e.clientX, e.clientY);
        });
        window.addEventListener('mouseup', () => { this.isDragging = false; });
        canvas.addEventListener('wheel', e => this._onWheel(e), { passive: false });
        canvas.addEventListener('dblclick', e => this._onDblClick(e));
        // Touch Controls
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
                this._orbit(dx * 0.00072, dy * 0.00068);
                this.prevMouse.set(touches[0].clientX, touches[0].clientY);
            }
            else if (touches.length === 2) {
                const d = _pinchDist(touches);
                const delta = lastPinchDist - d;
                // Reduced sensitivity and simple damping
                const zoomFactor = 0.00115;
                const dampedDelta = delta * zoomFactor;
                const cx = (touches[0].clientX + touches[1].clientX) * 0.5;
                const cy = (touches[0].clientY + touches[1].clientY) * 0.5;
                this.pointerScreen.set(cx, cy);
                this._zoomTowardPointer(dampedDelta, cx, cy);
                lastPinchDist = d;
            }
        }, { passive: true });
        canvas.addEventListener('touchend', () => {
            this.isDragging = false;
        });
        window.addEventListener('keydown', e => {
            if (e.key === 'Escape')
                window.dispatchEvent(new CustomEvent('universe-esc'));
        });
    }
    _orbit(dTheta, dPhi) {
        this.velTheta -= dTheta;
        this.velPhi -= dPhi;
    }
    _onWheel(e) {
        e.preventDefault();
        this._onActivity();
        this.pointerScreen.set(e.clientX, e.clientY);
        const normalized = THREE.MathUtils.clamp(e.deltaY, -120, 120);
        const delta = normalized * 0.00030;
        this._zoomTowardPointer(delta, e.clientX, e.clientY);
    }
    _zoom(delta) {
        const clamped = THREE.MathUtils.clamp(delta, -0.05, 0.05);
        this.velRadius += clamped * this.spherical.radius * 0.095;
    }
    /** Infinite-canvas style zoom: translate camera + orbit target toward the pointer ray,
     * then apply a smaller radial dolly. The viewport center is never assumed to be the destination. */
    _zoomTowardPointer(delta, clientX, clientY) {
        const clamped = THREE.MathUtils.clamp(delta, -0.05, 0.05);
        const anchor = this.screenPointToFocusPoint(clientX, clientY);
        // Zoom-in (negative delta) moves toward pointer anchor; zoom-out reverses gently.
        const anchorFraction = THREE.MathUtils.clamp(-clamped * 4.4, -0.16, 0.16);
        const toAnchor = anchor.clone().sub(this.target);
        const maxTranslation = Math.max(220, Math.min(this.spherical.radius * 0.12, 4200));
        const translation = toAnchor.multiplyScalar(anchorFraction);
        if (translation.length() > maxTranslation)
            translation.setLength(maxTranslation);
        this.target.add(translation);
        this.camera.position.add(translation);
        // Rebuild spherical state around the translated target before radial motion.
        this.tmpVec.subVectors(this.camera.position, this.target);
        this.spherical.setFromVector3(this.tmpVec);
        this._zoom(clamped);
    }
    _screenRay(clientX, clientY) {
        const rect = this.canvas.getBoundingClientRect();
        const ndc = new THREE.Vector2(((clientX - rect.left) / rect.width) * 2 - 1, -(((clientY - rect.top) / rect.height) * 2 - 1));
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(ndc, this.camera);
        return raycaster.ray.clone();
    }
    /** Resolve a world-space focus point from a screen click so dead-space clicks become valid destinations. */
    screenPointToFocusPoint(clientX, clientY) {
        const ray = this._screenRay(clientX, clientY);
        const viewDir = new THREE.Vector3();
        this.camera.getWorldDirection(viewDir);
        const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(viewDir, this.target);
        const focus = new THREE.Vector3();
        const hit = ray.intersectPlane(plane, focus);
        if (hit)
            return hit.clone();
        const fallbackDistance = Math.max(this.spherical.radius * 0.65, 3500);
        return this.target.clone().addScaledVector(ray.direction, fallbackDistance);
    }
    /** Travel into empty space in the exact screen direction the visitor selected. */
    travelTowardScreenPoint(clientX, clientY, opts = {}) {
        const focusPoint = this.screenPointToFocusPoint(clientX, clientY);
        const currentRadius = this.spherical.radius;
        const offsetDir = this.camera.position.clone().sub(this.target).normalize();
        const newRadius = THREE.MathUtils.clamp(currentRadius * 0.74, 900, 260000);
        const endTarget = focusPoint.clone();
        const endPos = focusPoint.clone().addScaledVector(offsetDir, newRadius);
        this.flyTo(endPos, endTarget, { duration: 1550, saveHistory: true, ...opts });
        return focusPoint;
    }
    _onDblClick(_e) {
        // Deliberately no forced travel/zoom. Wheel/pinch owns navigation direction.
        this._onActivity();
    }
    update(dt) {
        if (this.fly) {
            this._updateFly(dt);
            return;
        }
        // Check passive idle drift (trigger after 6s of inactivity, if reduced-motion is off)
        const now = performance.now();
        if (!REDUCED_MOTION && !this.isDragging && (now - this.lastUserActivity > IDLE_TRIGGER_MS)) {
            this.isIdleDrifting = true;
        }
        if (this.isIdleDrifting) {
            this.driftTime += dt;
            // Subtle organic orbital rotation & Y drift
            this.spherical.theta += dt * 0.010;
            this.spherical.phi = THREE.MathUtils.clamp(this.spherical.phi + Math.sin(this.driftTime * 0.2) * 0.0002, 0.05, Math.PI - 0.05);
        }
        else {
            // Normal damped orbit velocity
            this.spherical.theta += this.velTheta;
            this.spherical.phi = THREE.MathUtils.clamp(this.spherical.phi + this.velPhi, 0.05, Math.PI - 0.05);
            this.spherical.radius = THREE.MathUtils.clamp(this.spherical.radius + this.velRadius, 150, 320_000);
            this.velTheta *= (1 - this.DAMPING);
            this.velPhi *= (1 - this.DAMPING);
            this.velRadius *= (1 - this.DAMPING);
        }
        this.tmpVec.setFromSpherical(this.spherical).add(this.target);
        this.camera.position.copy(this.tmpVec);
        this.camera.lookAt(this.target);
    }
    _updateFly(_dt) {
        if (!this.fly)
            return;
        const FLY_STEP_MS = 16;
        this.fly.elapsed += FLY_STEP_MS;
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
            done?.();
        }
    }
    flyTo(pos, lookAt, opts = {}) {
        if (opts.saveHistory) {
            this.historyStack.push(this.snapshot());
        }
        const duration = REDUCED_MOTION ? 200 : (opts.duration ?? 1100);
        this.fly = {
            startPos: this.camera.position.clone(),
            startTarget: this.target.clone(),
            endPos: new THREE.Vector3(pos.x, pos.y, pos.z),
            endTarget: new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z),
            elapsed: 0,
            duration,
            onDone: opts.onDone,
        };
    }
    // Click-To-Travel: Intelligent spatial flight toward any celestial object
    travelToObject(worldPos, distanceRadius = 1200, opts = {}) {
        // Position camera at an elevated 45-degree spatial offset from the object
        const offset = new THREE.Vector3(distanceRadius * 0.7, distanceRadius * 0.45, distanceRadius * 0.7);
        const camPos = {
            x: worldPos.x + offset.x,
            y: worldPos.y + offset.y,
            z: worldPos.z + offset.z,
        };
        this.flyTo(camPos, worldPos, { duration: 1550, saveHistory: true, ...opts });
    }
    resetToHome(opts = {}) {
        const [hx, hy, hz] = UNIVERSE_HOME_CAMERA.position;
        const [tx, ty, tz] = UNIVERSE_HOME_CAMERA.target;
        this.flyTo({ x: hx, y: hy, z: hz }, { x: tx, y: ty, z: tz }, { duration: 1400, saveHistory: true, ...opts });
    }
    returnToPrevious(opts = {}) {
        const prev = this.historyStack.pop();
        if (!prev)
            return false;
        this.restoreSnapshot(prev, true);
        return true;
    }
    hasHistory() {
        return this.historyStack.length > 0;
    }
    snapshot() {
        return {
            position: [this.camera.position.x, this.camera.position.y, this.camera.position.z],
            target: [this.target.x, this.target.y, this.target.z],
            zoom: this.spherical.radius,
        };
    }
    restoreSnapshot(snap, animate = true) {
        const pos = { x: snap.position[0], y: snap.position[1], z: snap.position[2] };
        const tgt = { x: snap.target[0], y: snap.target[1], z: snap.target[2] };
        if (animate) {
            this.flyTo(pos, tgt, { duration: 800 });
        }
        else {
            this.camera.position.set(pos.x, pos.y, pos.z);
            this.target.set(tgt.x, tgt.y, tgt.z);
            this.camera.lookAt(this.target);
            this.tmpVec.subVectors(this.camera.position, this.target);
            this.spherical.setFromVector3(this.tmpVec);
        }
    }
    getTarget() {
        return this.target.clone();
    }
    getRadius() {
        return this.spherical.radius;
    }
    isBusy() {
        return this.fly !== null;
    }
}
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function _pinchDist(touches) {
    const dx = touches[1].clientX - touches[0].clientX;
    const dy = touches[1].clientY - touches[0].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}
