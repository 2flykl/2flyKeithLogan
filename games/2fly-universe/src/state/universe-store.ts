// Universe Store — reactive application state
// Simple pub/sub store; no framework dependency.

import type {
  NavContext, CameraSnapshot, StarRecord
} from '../types';

export type AudioState = 'silent' | 'ambient' | 'media';

export interface UniverseState {
  // Navigation
  navContext: NavContext;
  cameraSnapshot: CameraSnapshot | null;
  // Selection
  selectedObjectId: string | null;
  selectedStarId: string | null;
  // Overlays
  activeOverlay: 'none' | 'media-audio' | 'media-video' | 'media-playable' | 'media-archive' | 'star-placement' | 'star-view' | 'star-card';
  overlayData: unknown;
  // Audio
  audioState: AudioState;
  muted: boolean;
  currentGalaxyId: string | null;
  // Placement mode
  placementMode: boolean;
  // Stars
  myStarId: string | null;
  stars: StarRecord[];
  // Loading
  loaded: boolean;
}

type Listener<T> = (val: T, prev: T) => void;
type AnyListener = () => void;

const _state: UniverseState = {
  navContext: { level: 'universe' },
  cameraSnapshot: null,
  selectedObjectId: null,
  selectedStarId: null,
  activeOverlay: 'none',
  overlayData: null,
  audioState: 'silent',
  muted: !!localStorage.getItem('universe_muted'),
  currentGalaxyId: null,
  placementMode: false,
  myStarId: localStorage.getItem('universe_my_star_id'),
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
    if (prev === value) return;
    _state[key] = value;
    notify(key, value, prev);
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

  snapshot(): Readonly<UniverseState> {
    return { ..._state };
  },

  // Convenience: persist mute state
  toggleMute() {
    const next = !_state.muted;
    if (next) localStorage.setItem('universe_muted', '1');
    else localStorage.removeItem('universe_muted');
    this.set('muted', next);
  },

  // Save/restore camera for overlay round-trips
  pushCameraSnapshot(snap: CameraSnapshot) {
    this.set('cameraSnapshot', snap);
  },

  popCameraSnapshot(): CameraSnapshot | null {
    const s = _state.cameraSnapshot;
    return s;
  },

  openOverlay(
    type: UniverseState['activeOverlay'],
    data: unknown,
    cameraSnap: CameraSnapshot
  ) {
    this.set('cameraSnapshot', cameraSnap);
    this.patch({ activeOverlay: type, overlayData: data });
  },

  closeOverlay() {
    this.patch({ activeOverlay: 'none', overlayData: null });
  },

  setMyStarId(id: string) {
    localStorage.setItem('universe_my_star_id', id);
    this.set('myStarId', id);
  },

  addStar(star: import('../types').StarRecord) {
    const next = [..._state.stars, star];
    this.set('stars', next);
  },
};

// Derived helpers
export function isOverlayOpen(): boolean {
  return store.get('activeOverlay') !== 'none';
}

export function getSelectedObject(): string | null {
  return store.get('selectedObjectId');
}
