// Renderer — full Three.js WebGL2 renderer with resilient context negotiation.
// This keeps the full 3D engine intact; only context creation is made safer.
import * as THREE from 'three';

let _renderer = null;
let _animId = 0;
let _running = false;
let _onFrame = null;
let _lastTime = 0;
let _paused = false;
let _resizeObserver = null;

function createWebGL2Context(canvas) {
    // Chrome/ANGLE can reject a context when a specific powerPreference or
    // antialias combination is requested. Try progressively safer settings.
    const attempts = [
        {
            alpha: false,
            antialias: true,
            depth: true,
            stencil: false,
            powerPreference: 'default',
            preserveDrawingBuffer: false,
            failIfMajorPerformanceCaveat: false,
        },
        {
            alpha: false,
            antialias: false,
            depth: true,
            stencil: false,
            powerPreference: 'default',
            preserveDrawingBuffer: false,
            failIfMajorPerformanceCaveat: false,
        },
        {
            alpha: false,
            antialias: false,
            depth: true,
            stencil: false,
            powerPreference: 'low-power',
            preserveDrawingBuffer: false,
            failIfMajorPerformanceCaveat: false,
        },
        {
            alpha: false,
            antialias: false,
            depth: true,
            stencil: false,
            preserveDrawingBuffer: false,
            failIfMajorPerformanceCaveat: false,
        },
    ];

    const errors = [];
    for (let i = 0; i < attempts.length; i++) {
        try {
            const context = canvas.getContext('webgl2', attempts[i]);
            if (context) {
                console.info(`[2Fly renderer] WebGL2 context acquired on attempt ${i + 1}.`);
                return context;
            }
            errors.push(`attempt ${i + 1}: null context`);
        } catch (err) {
            errors.push(`attempt ${i + 1}: ${String(err?.message || err)}`);
        }
    }

    throw new Error(
        'WebGL2 is unavailable in this Chrome session. ' +
        'Close this tab and run START_FULL_3D_GPU_SAFE.bat. ' +
        'Context attempts: ' + errors.join(' | ')
    );
}

export function initRenderer(canvas) {
    if (_renderer) return _renderer;

    const context = createWebGL2Context(canvas);
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 1.75));

    _renderer = new THREE.WebGLRenderer({
        canvas,
        context,
        antialias: false, // context already negotiated above
        alpha: false,
        stencil: false,
        depth: true,
    });

    _renderer.setPixelRatio(dpr);
    _renderer.setSize(Math.max(1, canvas.clientWidth), Math.max(1, canvas.clientHeight), false);
    _renderer.outputColorSpace = THREE.SRGBColorSpace;
    _renderer.toneMapping = THREE.ACESFilmicToneMapping;
    _renderer.toneMappingExposure = 1.1;
    _renderer.shadowMap.enabled = false;

    _resizeObserver = new ResizeObserver(entries => {
        const e = entries[0];
        if (!e || !_renderer) return;
        const { width, height } = e.contentRect;
        const nextDpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 1.75));
        _renderer.setSize(Math.max(1, width), Math.max(1, height), false);
        _renderer.setPixelRatio(nextDpr);
        window.dispatchEvent(new CustomEvent('universe-resize', { detail: { width, height } }));
    });
    _resizeObserver.observe(canvas);

    document.addEventListener('visibilitychange', () => {
        _paused = document.hidden;
        if (!_paused && _running) _tick();
    });

    canvas.addEventListener('webglcontextlost', (event) => {
        event.preventDefault();
        console.error('[2Fly renderer] WebGL context lost.');
        window.dispatchEvent(new CustomEvent('2fly-webgl-lost'));
    }, false);

    canvas.addEventListener('webglcontextrestored', () => {
        console.info('[2Fly renderer] WebGL context restored.');
        window.dispatchEvent(new CustomEvent('2fly-webgl-restored'));
    }, false);

    return _renderer;
}

export function getRenderer() {
    if (!_renderer) throw new Error('Renderer not initialized');
    return _renderer;
}

export function startRenderLoop(onFrame) {
    _onFrame = onFrame;
    _running = true;
    _lastTime = performance.now();
    _tick();
}

function _tick() {
    if (!_running || _paused) return;
    _animId = requestAnimationFrame(_tick);
    const now = performance.now();
    const dt = Math.min((now - _lastTime) / 1000, 0.05);
    _lastTime = now;
    if (_onFrame) _onFrame(dt);
}

export function stopRenderLoop() {
    _running = false;
    cancelAnimationFrame(_animId);
}

export function getSize() {
    if (!_renderer) return { width: window.innerWidth, height: window.innerHeight };
    const s = _renderer.getSize(new THREE.Vector2());
    return { width: s.x, height: s.y };
}

export function disposeRenderer() {
    stopRenderLoop();
    _resizeObserver?.disconnect();
    _resizeObserver = null;
    _renderer?.dispose();
    _renderer = null;
}
