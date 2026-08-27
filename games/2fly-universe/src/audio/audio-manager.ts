// Ambient audio manager for the source/Vite build of 2Fly Universe.

const REGION_TRACKS: Record<string, string> = {
  fire: 'https://static.wixstatic.com/mp3/85e419_7810e2c471ce46b5a1c5a664b8307995.mp3',
  africa: 'https://static.wixstatic.com/mp3/85e419_f92713dc5c48443ca1c191bbbb0aec04.mp3',
  frontier: 'https://static.wixstatic.com/mp3/85e419_7be9c7aa18ad4a6db00fd1af6ee7dbcd.mp3',
};

type AudioLayer = {
  src: string;
  el: HTMLAudioElement;
  targetVol: number;
  currentVol: number;
};

function readMuted(): boolean {
  try { return localStorage.getItem('universe_muted') === '1'; }
  catch { return false; }
}

function writeMuted(value: boolean) {
  try {
    if (value) localStorage.setItem('universe_muted', '1');
    else localStorage.removeItem('universe_muted');
  } catch {}
}

class AudioManager {
  private layers = new Map<string, AudioLayer>();
  private activeRegionTheme: string | null = null;
  private masterMuted = readMuted();
  private masterVol = 0.22;
  private isDucked = false;
  private rafId = 0;

  constructor() {
    this.tick = this.tick.bind(this);
    this.rafId = requestAnimationFrame(this.tick);
  }

  private getLayer(src: string): AudioLayer {
    let layer = this.layers.get(src);
    if (!layer) {
      const el = new Audio(src);
      el.loop = true;
      el.preload = 'auto';
      el.volume = 0;
      layer = { src, el, targetVol: 0, currentVol: 0 };
      this.layers.set(src, layer);
    }
    return layer;
  }

  unlock() {
    if (this.masterMuted) return;
    for (const layer of this.layers.values()) {
      if (layer.targetVol > 0 && layer.el.paused) layer.el.play().catch(() => {});
    }
  }

  setRegionTheme(theme: string | null) {
    if (this.activeRegionTheme === theme) return;
    this.activeRegionTheme = theme;
    const activeSrc = theme ? REGION_TRACKS[theme] : null;

    for (const [src, layer] of this.layers) {
      if (src !== activeSrc) layer.targetVol = 0;
    }

    if (!activeSrc) return;
    const layer = this.getLayer(activeSrc);
    layer.targetVol = this.masterMuted || this.isDucked ? 0 : this.masterVol;
    if (!this.masterMuted && layer.el.paused) layer.el.play().catch(() => {});
  }

  duckAmbient() {
    this.isDucked = true;
    for (const layer of this.layers.values()) {
      if (layer.targetVol > 0 || !layer.el.paused) layer.targetVol = this.masterVol * 0.08;
    }
  }

  restoreAmbient() {
    this.isDucked = false;
    if (this.masterMuted) return;
    const activeSrc = this.activeRegionTheme ? REGION_TRACKS[this.activeRegionTheme] : null;
    for (const layer of this.layers.values()) {
      layer.targetVol = layer.src === activeSrc ? this.masterVol : 0;
      if (layer.targetVol > 0 && layer.el.paused) layer.el.play().catch(() => {});
    }
  }

  setMuted(value: boolean) {
    this.masterMuted = Boolean(value);
    writeMuted(this.masterMuted);
    if (this.masterMuted) {
      for (const layer of this.layers.values()) {
        layer.targetVol = 0;
        layer.el.pause();
      }
    } else {
      this.restoreAmbient();
    }
  }

  private tick() {
    this.rafId = requestAnimationFrame(this.tick);
    for (const layer of this.layers.values()) {
      const diff = layer.targetVol - layer.currentVol;
      if (Math.abs(diff) > 0.001) {
        layer.currentVol += diff * 0.08;
        layer.el.volume = Math.max(0, Math.min(1, layer.currentVol));
      }
    }
  }

  dispose() {
    cancelAnimationFrame(this.rafId);
    for (const layer of this.layers.values()) {
      layer.el.pause();
      layer.el.src = '';
    }
    this.layers.clear();
  }
}

export const audioManager = new AudioManager();
