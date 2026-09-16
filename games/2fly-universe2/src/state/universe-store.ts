// Universe Store — Phase II Reactive State Store
// Tracks navigation, camera, selection, overlays, audio, placement, and per-galaxy user star mapping.

import type {
  NavContext, CameraSnapshot, StarRecord
} from '../types';

export type AudioState = 'silent' | 'ambient' | 'media';

export interface UniverseState {
  navContext: NavContext;
  cameraSnapshot: CameraSnapshot | null;
  selectedObjectId: string | null;
  selectedStarId: string | null;
  activeOverlay: 'none' | 'media-audio' | 'media-video' | 'media-playable' | 'media-archive' | 'star-placement' | 'star-view' | 'star-card';
  overlayData: unknown;
  audioState: AudioState;
  muted: boolean;
  currentGalaxyId: string | null;
  placementMode: boolean;
  myStarId: string | null;
  myStarsMap: Record<string, string>;
  stars: StarRecord[];
  loaded: boolean;
}

type Listener<T> = (val: T, prev: T) => void;
type AnyListener = () => void;

function loadInitialStarsMap(): Record<string, string> {
  try {
    const raw = localStorage.getItem('universe_my_stars_map');
    if (raw) return JSON.parse(raw) as Record<string, string>;
  } catch {
    const legacy = localStorage.getItem('universe_my_star_id');
    if (legacy) return { G2025: legacy };
  }
  return {};
}

const initialMap = loadInitialStarsMap();

const _state: UniverseState = {
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

const _listeners: Map<keyof UniverseState, Set<Listener<unknown>>> = new Map();
const _anyListeners: Set<AnyListener> = new Set();

function notify<K extends keyof UniverseState>(key: K, next: UniverseState[K], prev: UniverseState[K]) {
  const set = _listeners.get(key);
  if (set) set.forEach(fn => fn(next as unknown, prev as unknown));
  _anyListeners.forEach(fn => fn());
}

export const store = {
  get<K extends keyof UniverseState>(key: K): UniverseState[K] {
    return _state[key];
  },

  set<K extends keyof UniverseState>(key: K, value: UniverseState[K]) {
    const prev = _state[key];
    if (prev !== value) {
      _state[key] = value;
      notify(key, value, prev);
    }
  },

  patch(partial: Partial<UniverseState>) {
    for (const [k, v] of Object.entries(partial) as [keyof UniverseState, unknown][]) {
      const prev = _state[k as keyof UniverseState];
      if (prev !== v) {
        ((_state as unknown) as Record<string, unknown>)[k] = v;
        notify(k as keyof UniverseState, v as UniverseState[typeof k], prev as UniverseState[typeof k]);
      }
    }
  },

  subscribe<K extends keyof UniverseState>(key: K, fn: Listener<UniverseState[K]>) {
    if (!_listeners.has(key)) _listeners.set(key, new Set());
    _listeners.get(key)!.add(fn as Listener<unknown>);
    return () => _listeners.get(key)!.delete(fn as Listener<unknown>);
  },

  on(fn: AnyListener) {
    _anyListeners.add(fn);
    return () => _anyListeners.delete(fn);
  },

  getState(): Readonly<UniverseState> {
    return { ..._state };
  },

  toggleMute() {
    const next = !_state.muted;
    if (next) localStorage.setItem('universe_muted', '1');
    else localStorage.removeItem('universe_muted');
    this.set('muted', next);
  },

  pushCameraSnapshot(snap: CameraSnapshot) {
    this.set('cameraSnapshot', snap);
  },

  popCameraSnapshot(): CameraSnapshot | null {
    return _state.cameraSnapshot;
  },

  setMyStarId(id: string) {
    localStorage.setItem('universe_my_star_id', id);
    this.set('myStarId', id);
  },

  setMyStarForGalaxy(galaxyId: string, starId: string) {
    const next = { ..._state.myStarsMap, [galaxyId]: starId };
    this.set('myStarsMap', next);
    this.set('myStarId', starId);
  },

  hasStarInGalaxy(galaxyId: string): boolean {
    return !!_state.myStarsMap[galaxyId];
  },

  getMyStarForGalaxy(galaxyId: string): string | null {
    return _state.myStarsMap[galaxyId] ?? null;
  },

  addStar(star: StarRecord) {
    const next = [..._state.stars, star];
    this.set('stars', next);
  },
};
