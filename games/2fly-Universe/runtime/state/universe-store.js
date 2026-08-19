// Universe Store — Phase II Reactive State Store
// Tracks navigation, camera, selection, overlays, audio, placement, and per-galaxy user star mapping.
function loadInitialStarsMap() {
    try {
        const raw = localStorage.getItem('universe_my_stars_map');
        if (raw)
            return JSON.parse(raw);
    }
    catch {
        const legacy = localStorage.getItem('universe_my_star_id');
        if (legacy)
            return { G2025: legacy };
    }
    return {};
}
const initialMap = loadInitialStarsMap();
const _state = {
    navContext: { level: 'universe' },
    cameraSnapshot: null,
    selectedObjectId: null,
    selectedStarId: null,
    activeOverlay: 'none',
    overlayData: null,
    audioState: 'silent',
    muted: !!localStorage.getItem('universe_muted'),
    currentGalaxyId: 'G2025',
    placementMode: false,
    myStarId: Object.values(initialMap)[0] ?? null,
    myStarsMap: initialMap,
    stars: [],
    loaded: false,
};
const _listeners = new Map();
const _anyListeners = new Set();
function notify(key, next, prev) {
    const set = _listeners.get(key);
    if (set)
        set.forEach(fn => fn(next, prev));
    _anyListeners.forEach(fn => fn());
}
export const store = {
    get(key) {
        return _state[key];
    },
    set(key, value) {
        const prev = _state[key];
        if (prev !== value) {
            _state[key] = value;
            notify(key, value, prev);
        }
    },
    patch(partial) {
        for (const [k, v] of Object.entries(partial)) {
            const prev = _state[k];
            if (prev !== v) {
                _state[k] = v;
                notify(k, v, prev);
            }
        }
    },
    subscribe(key, fn) {
        if (!_listeners.has(key))
            _listeners.set(key, new Set());
        _listeners.get(key).add(fn);
        return () => _listeners.get(key).delete(fn);
    },
    on(fn) {
        _anyListeners.add(fn);
        return () => _anyListeners.delete(fn);
    },
    getState() {
        return { ..._state };
    },
    toggleMute() {
        const next = !_state.muted;
        if (next)
            localStorage.setItem('universe_muted', '1');
        else
            localStorage.removeItem('universe_muted');
        this.set('muted', next);
    },
    pushCameraSnapshot(snap) {
        this.set('cameraSnapshot', snap);
    },
    popCameraSnapshot() {
        return _state.cameraSnapshot;
    },
    setMyStarId(id) {
        localStorage.setItem('universe_my_star_id', id);
        this.set('myStarId', id);
    },
    setMyStarForGalaxy(galaxyId, starId) {
        const next = { ..._state.myStarsMap, [galaxyId]: starId };
        this.set('myStarsMap', next);
        this.set('myStarId', starId);
    },
    hasStarInGalaxy(galaxyId) {
        return !!_state.myStarsMap[galaxyId];
    },
    getMyStarForGalaxy(galaxyId) {
        return _state.myStarsMap[galaxyId] ?? null;
    },
    addStar(star) {
        const next = [..._state.stars, star];
        this.set('stars', next);
    },
};
