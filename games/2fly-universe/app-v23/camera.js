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
    inputLocked = false;
    localGalaxyCenter = new THREE.Vector3();
    boundaryInfluence = 0;
    protectedBodies = [];
    protectedBodyInfluence = 0;
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
    setProtectedBodies(bodies = []) { this.protectedBodies = Array.isArray(bodies) ? bodies.filter(Boolean) : []; }
    setInputLocked(value){this.inputLocked=value;if(value){this._stopThrust(true);this.isDragging=false;this.isIdleDrifting=false;}}
    stopMotion({cancelFlight=true}={}){this._stopThrust(true);this.isDragging=false;this.velTheta=0;this.velPhi=0;this.velRadius=0;this.travelVelocity.set(0,0,0);this.warpFactor=0;this.camera.fov=this.baseFov;this.camera.updateProjectionMatrix();this.isIdleDrifting=false;if(cancelFlight)this.fly=null;}
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
            if(this.inputLocked)return;
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
            if(this.inputLocked)return;
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
            if(this.inputLocked)return;
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
            if(this.inputLocked)return;
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
        window.addEventListener('keydown', e => { if (e.key === 'Escape' && document.getElementById('overlay-layer')?.getAttribute('aria-hidden')!=='false')
            window.dispatchEvent(new CustomEvent('universe-esc')); });
    }
    _setGalaxyOrbitPivotIfInside() {
        // The orbit pivot is resolved on actual drag, never on a selection click.
    }
    _orbit(dTheta, dPhi) {
        // Rotate position AND view direction about the authoritative pivot. This preserves
        // off-center framing and never snaps the camera when selection changes.
        const pivot=this.selectedTarget || (this.localGalaxyId?this.localGalaxyCenter:new THREE.Vector3());
        this.fly=null;
        const yaw=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),-dTheta);
        const right=new THREE.Vector3(1,0,0).applyQuaternion(this.camera.quaternion).applyQuaternion(yaw);
        const pitch=new THREE.Quaternion().setFromAxisAngle(right,-dPhi);
        const rotation=pitch.multiply(yaw);
        this.camera.position.sub(pivot).applyQuaternion(rotation).add(pivot);
        this.target.sub(pivot).applyQuaternion(rotation).add(pivot);
        this.spherical.setFromVector3(this.tmpVec.subVectors(this.camera.position,this.target));
        this.velTheta=0;this.velPhi=0;
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
        if(this.inputLocked)return;
        this._onActivity();
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
            const localThrustScale = this.localGalaxyId ? 0.9 : 1;
            const speed = (10500 + 8500 * warp) * localThrustScale;
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
        const desiredFov = this.baseFov * (1 + (REDUCED_MOTION ? 0 : this.warpFactor) * 0.08);
        this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, desiredFov, THREE.MathUtils.clamp(dt * 7, 0, 1));
        this.camera.updateProjectionMatrix();
        const delta = this.travelVelocity.clone().multiplyScalar(dt);
        this.camera.position.add(delta);
        this.target.add(delta);
    }
    _applyProtectedBodyCollisions(dt) {
        if (!this.protectedBodies.length) return;
        let strongest = 0;
        for (const body of this.protectedBodies) {
            const center = typeof body.getCenter === 'function' ? body.getCenter() : body.center;
            if (!center) continue;
            const hard = Math.max(120, Number(body.hardRadius) || 900);
            const soft = Math.max(hard + 120, Number(body.softRadius) || hard * 1.55);
            const offset = this.camera.position.clone().sub(center);
            let dist = offset.length();
            if (dist < 1e-3) { offset.set(1, 0.25, 0.4); dist = offset.length(); }
            const normal = offset.normalize();
            if (dist < soft) {
                const influence = THREE.MathUtils.clamp((soft - dist) / (soft - hard), 0, 1);
                strongest = Math.max(strongest, influence);
                const inward = this.travelVelocity.dot(normal);
                if (inward < 0) {
                    // Convert forward impact into a glancing orbital slide instead of a dead stop.
                    const inwardVec = normal.clone().multiplyScalar(inward);
                    this.travelVelocity.sub(inwardVec.multiplyScalar(0.94));
                    const tangent = new THREE.Vector3().crossVectors(new THREE.Vector3(0,1,0), normal);
                    if (tangent.lengthSq() < 0.001) tangent.set(1,0,0);
                    tangent.normalize();
                    this.travelVelocity.addScaledVector(tangent, Math.abs(inward) * 0.10 * influence);
                }
                this.travelVelocity.multiplyScalar(1 - THREE.MathUtils.clamp(influence * dt * 1.45, 0, 0.16));
            }
            if (dist < hard) {
                const desired = center.clone().addScaledVector(normal, hard + 18);
                const push = desired.sub(this.camera.position);
                this.camera.position.add(push);
                this.target.add(push);
                const inward = this.travelVelocity.dot(normal);
                if (inward < 0) this.travelVelocity.addScaledVector(normal, -inward * 1.08);
                window.dispatchEvent(new CustomEvent('universe-content-boundary', { detail: { id: body.id, label: body.label, distance: dist, radius: hard } }));
            }
        }
        this.protectedBodyInfluence = THREE.MathUtils.lerp(this.protectedBodyInfluence, strongest, THREE.MathUtils.clamp(dt * 5, 0, 1));
    }
    _applyBoundary(dt) {
        // Recovery owns the outer boundary. Do not bend thrust inward or visibly teleport.
        // Coasting at the outer limit loses momentum; the persistent return control remains available.
        if(this.camera.position.length()>210000&&!this.thrusting)this.travelVelocity.multiplyScalar(Math.exp(-12*dt));
    }
    _onWheel(e) {
        e.preventDefault();
        if(this.inputLocked)return;
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
        if(this.inputLocked&&!this.fly)return;
        if (this.fly) {
            this._updateFly(dt);
            return;
        }

        const now = performance.now();
        if (!REDUCED_MOTION && !this.isDragging && !this.thrusting && this.travelVelocity.length() < 1 && now - this.lastUserActivity > IDLE_TRIGGER_MS)
            this.isIdleDrifting = true;
        if (this.isIdleDrifting) {
            this.driftTime += dt;
            this._orbit(dt * .003, 0);
            
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
        this._applyProtectedBodyCollisions(dt);
        this._applyBoundary(dt);
        this.tmpVec.subVectors(this.camera.position, this.target);
        this.spherical.setFromVector3(this.tmpVec);
        this.camera.lookAt(this.target);
    }
    _updateFly(dt) {
        if (!this.fly)
            return;
        this.fly.elapsed += dt * 1000;
        const t = REDUCED_MOTION ? 1 : Math.min(this.fly.elapsed / this.fly.duration, 1);
        const ease = smootherStep(t);
        if (this.fly.controlPos) {
            const one = 1 - ease;
            this.camera.position.copy(this.fly.startPos).multiplyScalar(one * one)
                .add(this.fly.controlPos.clone().multiplyScalar(2 * one * ease))
                .add(this.fly.endPos.clone().multiplyScalar(ease * ease));
        } else {
            this.camera.position.lerpVectors(this.fly.startPos, this.fly.endPos, ease);
        }
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
            elapsed: 0, duration, onDone: opts.onDone, controlPos: opts.controlPos ? new THREE.Vector3(opts.controlPos.x, opts.controlPos.y, opts.controlPos.z) : null,
        };
    }
    travelToObject(worldPos, distanceRadius = 1200, opts = {}) {
        const approach = this.camera.position.clone().sub(new THREE.Vector3(worldPos.x, worldPos.y, worldPos.z));
        if (approach.lengthSq() < 1) approach.set(1, .45, 1);
        approach.normalize();
        const side = new THREE.Vector3().crossVectors(approach, new THREE.Vector3(0, 1, 0)).normalize();
        const end = new THREE.Vector3(worldPos.x, worldPos.y, worldPos.z)
            .addScaledVector(approach, distanceRadius)
            .addScaledVector(side, distanceRadius * .18)
            .add(new THREE.Vector3(0, distanceRadius * .16, 0));
        const mid = this.camera.position.clone().lerp(end, .52).add(new THREE.Vector3(0, Math.min(distanceRadius * .32, 1800), 0));
        this.flyTo(end, worldPos, { duration: 1450, saveHistory: true, controlPos: mid, ...opts });
    }
    frameObject(worldPos,radius=800){
        const center=new THREE.Vector3(worldPos.x,worldPos.y,worldPos.z);
        const core=this.localGalaxyId?this.localGalaxyCenter:new THREE.Vector3();
        const outward=center.clone().sub(core).normalize();
        if(outward.lengthSq()<.1)outward.set(0,0,1);
        const side=new THREE.Vector3().crossVectors(outward,new THREE.Vector3(0,1,0)).normalize();
        const direction=outward.multiplyScalar(.70).addScaledVector(side,.72).add(new THREE.Vector3(0,.20,0)).normalize();
        const distance=radius*(this.camera.aspect<1?3.65:2.95);
        const end=center.clone().addScaledVector(direction,distance);
        const screenRight=new THREE.Vector3().crossVectors(direction,new THREE.Vector3(0,1,0)).normalize();
        const look=center.clone().addScaledVector(screenRight,radius*(this.camera.aspect<1?.38:.8));
        this.flyTo(end,look,{duration:1800,saveHistory:true});
    }
    focusOnObject(worldPos, distanceRadius = 1500, opts = {}) {
        return this.travelToObject(worldPos, distanceRadius, { duration: 1650, ...opts });
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
            this.stopMotion();
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
function smootherStep(t) { t = THREE.MathUtils.clamp(t, 0, 1); return t * t * t * (t * (t * 6 - 15) + 10); }
function _pinchDist(touches) {
    const dx = touches[1].clientX - touches[0].clientX;
    const dy = touches[1].clientY - touches[0].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}
