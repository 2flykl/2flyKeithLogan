// Camera — Phase II Spatial Exploration, Click-To-Travel, Idle Drift & Home Reset Engine

import * as THREE from 'three';
import type { CameraSnapshot } from './types';
import { UNIVERSE_HOME_CAMERA } from './types';

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const IDLE_TRIGGER_MS = 6000; // 6 seconds to trigger passive drift

export interface FlyToOptions {
  duration?: number;
  onDone?: () => void;
  saveHistory?: boolean;
}

interface FlyState {
  startPos: THREE.Vector3;
  startTarget: THREE.Vector3;
  endPos: THREE.Vector3;
  endTarget: THREE.Vector3;
  elapsed: number;
  duration: number;
  onDone?: () => void;
}

export class UniverseCamera {
  readonly camera: THREE.PerspectiveCamera;
  private target = new THREE.Vector3();
  private fly: FlyState | null = null;
  private historyStack: CameraSnapshot[] = [];

  // Orbit state
  private isDragging = false;
  private prevMouse = new THREE.Vector2();
  private spherical = new THREE.Spherical();
  private tmpVec = new THREE.Vector3();

  // Damping
  private velTheta = 0;
  private velPhi = 0;
  private velRadius = 0;
  private readonly DAMPING = 0.12;
  private readonly canvas: HTMLElement;

  // Passive Idle Drift
  private lastUserActivity = performance.now();
  private isIdleDrifting = false;
  private driftTime = 0;

  constructor(canvas: HTMLElement) {
    this.canvas = canvas;
    this.camera = new THREE.PerspectiveCamera(
      55, window.innerWidth / window.innerHeight, 10, 2_000_000
    );

    // Initial composition centered on Showcase Era G2025 at (0, 0, 0)
    const [hx, hy, hz] = UNIVERSE_HOME_CAMERA.position;
    const [tx, ty, tz] = UNIVERSE_HOME_CAMERA.target;
    this.camera.position.set(hx, hy, hz);
    this.target.set(tx, ty, tz);
    this.camera.lookAt(this.target);

    this.tmpVec.subVectors(this.camera.position, this.target);
    this.spherical.setFromVector3(this.tmpVec);

    this._bindEvents(canvas);

    window.addEventListener('universe-resize', (e: Event) => {
      const ev = e as CustomEvent<{ width: number; height: number }>;
      this.camera.aspect = ev.detail.width / ev.detail.height;
      this.camera.updateProjectionMatrix();
    });
  }

  private _onActivity() {
    this.lastUserActivity = performance.now();
    if (this.isIdleDrifting) {
      this.isIdleDrifting = false;
    }
  }

  private _bindEvents(canvas: HTMLElement) {
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
      if (!this.isDragging) return;
      this._onActivity();
      const dx = e.clientX - this.prevMouse.x;
      const dy = e.clientY - this.prevMouse.y;
      this._orbit(dx * 0.0022, dy * 0.0022);
      this.prevMouse.set(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', () => { this.isDragging = false; });
    canvas.addEventListener('wheel', e => this._onWheel(e), { passive: false });
    canvas.addEventListener('dblclick', e => this._onDblClick(e));

    // Touch Controls
    let lastPinchDist = 0;
    let touches: Touch[] = [];

    canvas.addEventListener('touchstart', e => {
      this._onActivity();
      touches = Array.from(e.touches);
      if (touches.length === 1) {
        this.isDragging = true;
        this.prevMouse.set(touches[0].clientX, touches[0].clientY);
      } else if (touches.length === 2) {
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
        this._orbit(dx * 0.003, dy * 0.0027);
        this.prevMouse.set(touches[0].clientX, touches[0].clientY);
      } else if (touches.length === 2) {
        const d = _pinchDist(touches);
        const delta = lastPinchDist - d;
        // Reduced sensitivity and simple damping
        const zoomFactor = 0.0022;
        const dampedDelta = delta * zoomFactor;
        this._zoom(dampedDelta);
        lastPinchDist = d;
      }
    }, { passive: true });

    canvas.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') window.dispatchEvent(new CustomEvent('universe-esc'));
    });
  }

  private _orbit(dTheta: number, dPhi: number) {
    this.velTheta -= dTheta;
    this.velPhi -= dPhi;
  }

  private _onWheel(e: WheelEvent) {
    e.preventDefault();
    this._onActivity();
    const delta = e.deltaY * 0.00055;
    this._zoomTowardPointer(delta, e.clientX, e.clientY);
  }

  private _zoom(delta: number) {
    this.velRadius += delta * this.spherical.radius * 0.18;
  }

  private _zoomTowardPointer(delta: number, clientX: number, clientY: number) {
    if (delta < 0) {
      const ray = this._screenRay(clientX, clientY);
      const pull = Math.min(this.spherical.radius * 0.035, 2200);
      this.target.addScaledVector(ray.direction, pull);
    }
    this._zoom(delta);
  }

  private _screenRay(clientX: number, clientY: number): THREE.Ray {
    const rect = this.canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -(((clientY - rect.top) / rect.height) * 2 - 1)
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(ndc, this.camera);
    return raycaster.ray.clone();
  }

  /** Travel into empty space in the exact screen direction the visitor selected. */
  travelTowardScreenPoint(clientX: number, clientY: number, opts: FlyToOptions = {}) {
    const ray = this._screenRay(clientX, clientY);
    const currentRadius = this.spherical.radius;
    const step = THREE.MathUtils.clamp(currentRadius * 0.32, 2200, 22000);
    const endPos = this.camera.position.clone().addScaledVector(ray.direction, step);
    const lookDistance = Math.max(currentRadius * 0.55, 6000);
    const endTarget = endPos.clone().addScaledVector(ray.direction, lookDistance);
    this.flyTo(endPos, endTarget, { duration: 1450, saveHistory: true, ...opts });
  }

  private _onDblClick(_e: MouseEvent) {
    this._onActivity();
    this.velRadius -= this.spherical.radius * 0.18;
  }

  update(dt: number) {
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
      this.spherical.theta += dt * 0.035;
      this.spherical.phi = THREE.MathUtils.clamp(
        this.spherical.phi + Math.sin(this.driftTime * 0.2) * 0.0002,
        0.05, Math.PI - 0.05
      );
    } else {
      // Normal damped orbit velocity
      this.spherical.theta += this.velTheta;
      this.spherical.phi = THREE.MathUtils.clamp(
        this.spherical.phi + this.velPhi,
        0.05, Math.PI - 0.05
      );
      this.spherical.radius = THREE.MathUtils.clamp(
        this.spherical.radius + this.velRadius,
        150, 320_000
      );

      this.velTheta *= (1 - this.DAMPING);
      this.velPhi *= (1 - this.DAMPING);
      this.velRadius *= (1 - this.DAMPING);
    }

    this.tmpVec.setFromSpherical(this.spherical).add(this.target);
    this.camera.position.copy(this.tmpVec);
    this.camera.lookAt(this.target);
  }

  private _updateFly(_dt: number) {
    if (!this.fly) return;
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
      this.velTheta = 0; this.velPhi = 0; this.velRadius = 0;
      done?.();
    }
  }

  flyTo(
    pos: THREE.Vector3Like,
    lookAt: THREE.Vector3Like,
    opts: FlyToOptions = {}
  ) {
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
  travelToObject(
    worldPos: THREE.Vector3Like,
    distanceRadius = 1200,
    opts: FlyToOptions = {}
  ) {
    // Position camera at an elevated 45-degree spatial offset from the object
    const offset = new THREE.Vector3(
      distanceRadius * 0.7,
      distanceRadius * 0.45,
      distanceRadius * 0.7
    );
    const camPos = {
      x: worldPos.x + offset.x,
      y: worldPos.y + offset.y,
      z: worldPos.z + offset.z,
    };
    this.flyTo(camPos, worldPos, { duration: 1550, saveHistory: true, ...opts });
  }

  resetToHome(opts: FlyToOptions = {}) {
    const [hx, hy, hz] = UNIVERSE_HOME_CAMERA.position;
    const [tx, ty, tz] = UNIVERSE_HOME_CAMERA.target;
    this.flyTo({ x: hx, y: hy, z: hz }, { x: tx, y: ty, z: tz }, { duration: 1400, saveHistory: true, ...opts });
  }

  returnToPrevious(opts: FlyToOptions = {}): boolean {
    const prev = this.historyStack.pop();
    if (!prev) return false;
    this.restoreSnapshot(prev, true);
    return true;
  }

  hasHistory(): boolean {
    return this.historyStack.length > 0;
  }

  snapshot(): CameraSnapshot {
    return {
      position: [this.camera.position.x, this.camera.position.y, this.camera.position.z],
      target: [this.target.x, this.target.y, this.target.z],
      zoom: this.spherical.radius,
    };
  }

  restoreSnapshot(snap: CameraSnapshot, animate = true) {
    const pos = { x: snap.position[0], y: snap.position[1], z: snap.position[2] };
    const tgt = { x: snap.target[0], y: snap.target[1], z: snap.target[2] };
    if (animate) {
      this.flyTo(pos, tgt, { duration: 800 });
    } else {
      this.camera.position.set(pos.x, pos.y, pos.z);
      this.target.set(tgt.x, tgt.y, tgt.z);
      this.camera.lookAt(this.target);
      this.tmpVec.subVectors(this.camera.position, this.target);
      this.spherical.setFromVector3(this.tmpVec);
    }
  }

  getTarget(): THREE.Vector3 {
    return this.target.clone();
  }

  getRadius(): number {
    return this.spherical.radius;
  }

  isBusy(): boolean {
    return this.fly !== null;
  }
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function _pinchDist(touches: Touch[]): number {
  const dx = touches[1].clientX - touches[0].clientX;
  const dy = touches[1].clientY - touches[0].clientY;
  return Math.sqrt(dx * dx + dy * dy);
}
