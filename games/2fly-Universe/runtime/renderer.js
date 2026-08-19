// Renderer — WebGL renderer with adaptive DPR, resize, render loop, visibility pause
import * as THREE from '../vendor/three.module.js';
let _renderer = null;
let _animId = 0;
let _running = false;
let _onFrame = null;
let _lastTime = 0;
let _paused = false;
export function initRenderer(canvas) {
    const dpr = Math.min(window.devicePixelRatio, 2);
    _renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: dpr < 2,
        alpha: false,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
    });
    _renderer.setPixelRatio(dpr);
    _renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    _renderer.outputColorSpace = THREE.SRGBColorSpace;
    _renderer.toneMapping = THREE.ACESFilmicToneMapping;
    _renderer.toneMappingExposure = 1.1;
    _renderer.shadowMap.enabled = false; // disable for perf (space scene)
    // Resize observer
    const ro = new ResizeObserver(entries => {
        const e = entries[0];
        if (!e || !_renderer)
            return;
        const { width, height } = e.contentRect;
        const dpr = Math.min(window.devicePixelRatio, 2);
        _renderer.setSize(width, height, false);
        _renderer.setPixelRatio(dpr);
        window.dispatchEvent(new CustomEvent('universe-resize', { detail: { width, height } }));
    });
    ro.observe(canvas);
    // Visibility-based pause
    document.addEventListener('visibilitychange', () => {
        _paused = document.hidden;
        if (!_paused && _running)
            _tick();
    });
    return _renderer;
}
export function getRenderer() {
    if (!_renderer)
        throw new Error('Renderer not initialized');
    return _renderer;
}
export function startRenderLoop(onFrame) {
    _onFrame = onFrame;
    _running = true;
    _lastTime = performance.now();
    _tick();
}
function _tick() {
    if (!_running || _paused)
        return;
    _animId = requestAnimationFrame(_tick);
    const now = performance.now();
    const dt = Math.min((now - _lastTime) / 1000, 0.05); // clamp to 50ms
    _lastTime = now;
    if (_onFrame)
        _onFrame(dt);
}
export function stopRenderLoop() {
    _running = false;
    cancelAnimationFrame(_animId);
}
export function getSize() {
    if (!_renderer)
        return { width: window.innerWidth, height: window.innerHeight };
    const s = _renderer.getSize(new THREE.Vector2());
    return { width: s.x, height: s.y };
}
export function disposeRenderer() {
    stopRenderLoop();
    _renderer?.dispose();
    _renderer = null;
}
