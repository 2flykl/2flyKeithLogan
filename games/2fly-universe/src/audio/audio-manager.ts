// Audio Manager — Phase II Regional Spatial Crossfade Engine

const FADE_DURATION = 1500; // ms

interface AudioLayer {
  src: string;
  el: HTMLAudioElement;
  targetVol: number;
  currentVol: number;
}

class AudioManager {
  private ambientLayers: Map<string, AudioLayer> = new Map();
  private activeRegionTheme: string | null = null;
  private masterMuted: boolean;
  private masterVol = 0.22;
  private _rafId = 0;
  private isDucked = false;

  private readonly REGION_TRACKS: Record<string, string> = {
    fire: 'https://static.wixstatic.com/mp3/85e419_7810e2c471ce46b5a1c5a664b8307995.mp3',
    africa: 'https://static.wixstatic.com/mp3/85e419_f92713dc5c48443ca1c191bbbb0aec04.mp3',
    frontier: 'https://static.wixstatic.com/mp3/85e419_7be9c7aa18ad4a6db00fd1af6ee7dbcd.mp3',
  };

  constructor() {
    this.masterMuted = !!localStorage.getItem('universe_muted');
    this._tick = this._tick.bind(this);
    requestAnimationFrame(this._tick);
  }

  unlock() {
    if (this.masterMuted) return;
    for (const layer of this.ambientLayers.values()) {
      if (layer.el.paused && layer.targetVol > 0) {
        layer.el.play().catch(() => {});
      }
    }
  }

  setRegionTheme(themeKey: string | null) {
    if (this.activeRegionTheme === themeKey) return;
    this.activeRegionTheme = themeKey;

    const targetTrack = themeKey ? this.REGION_TRACKS[themeKey] : null;

    // Fade out all non-target layers
    for (const [src, layer] of this.ambientLayers) {
      if (src !== targetTrack) {
        layer.targetVol = 0;
      }
    }

    if (targetTrack) {
      let layer = this.ambientLayers.get(targetTrack);
      if (!layer) {
        const el = new Audio(targetTrack);
        el.loop = true;
        el.volume = 0;
        el.preload = 'auto';
        layer = { src: targetTrack, el, targetVol: 0, currentVol: 0 };
        this.ambientLayers.set(targetTrack, layer);
      }
      layer.targetVol = this.masterMuted || this.isDucked ? 0 : this.masterVol;
      if (!this.masterMuted && layer.el.paused) {
        layer.el.play().catch(() => {});
      }
    }
  }

  duckAmbient() {
    this.isDucked = true;
    for (const layer of this.ambientLayers.values()) {
      layer.targetVol = layer.targetVol > 0 ? this.masterVol * 0.08 : 0;
    }
  }

  restoreAmbient() {
    this.isDucked = false;
    if (this.masterMuted) return;
    for (const layer of this.ambientLayers.values()) {
      const isTarget = this.activeRegionTheme && this.REGION_TRACKS[this.activeRegionTheme] === layer.src;
      layer.targetVol = isTarget ? this.masterVol : 0;
    }
  }

  setMuted(muted: boolean) {
    this.masterMuted = muted;
    for (const layer of this.ambientLayers.values()) {
      if (muted) {
        layer.targetVol = 0;
        layer.el.pause();
      } else {
        const isTarget = this.activeRegionTheme && this.REGION_TRACKS[this.activeRegionTheme] === layer.src;
        if (isTarget) {
          layer.targetVol = this.masterVol;
          layer.el.play().catch(() => {});
        }
      }
    }
  }

  private _tick() {
    this._rafId = requestAnimationFrame(this._tick);
    const step = (16 / FADE_DURATION);

    for (const layer of this.ambientLayers.values()) {
      const diff = layer.targetVol - layer.currentVol;
      if (Math.abs(diff) > 0.001) {
        layer.currentVol += diff * step * 6;
        layer.el.volume = Math.max(0, Math.min(1, layer.currentVol));
      }
    }
  }

  dispose() {
    cancelAnimationFrame(this._rafId);
    for (const layer of this.ambientLayers.values()) {
      layer.el.pause();
    }
  }
}

export const audioManager = new AudioManager();
