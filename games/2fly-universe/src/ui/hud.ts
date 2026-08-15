// HUD — minimal floating UI chrome
// Galaxy name, breadcrumb, mute button, exit-to-site

import { store } from '../state/universe-store';
import { audioManager } from '../audio/audio-manager';
import { getGalaxyLabel } from '../data/universe-data';

export class HUD {
  private el: HTMLElement;
  private galaxyLabel!: HTMLElement;
  private muteBtn!: HTMLButtonElement;
  private placeBtn!: HTMLButtonElement;
  private breadcrumb!: HTMLElement;

  constructor(container: HTMLElement) {
    this.el = document.createElement('div');
    this.el.id = 'universe-hud';
    this.el.setAttribute('role', 'navigation');
    this.el.setAttribute('aria-label', 'Universe navigation');
    this.el.style.cssText = `
      position:absolute;
      top:0;left:0;right:0;
      display:flex;
      align-items:center;
      justify-content:space-between;
      padding:env(safe-area-inset-top,12px) 20px 12px;
      padding-top:max(env(safe-area-inset-top),12px);
      background:linear-gradient(to bottom,rgba(0,4,12,0.8) 0%,transparent 100%);
      pointer-events:none;
      z-index:50;
    `;

    this.el.innerHTML = `
      <div style="display:flex;align-items:center;gap:16px;pointer-events:auto;">
        <a
          id="hud-exit"
          href="/"
          style="
            font-family:'Space Mono',monospace;
            font-size:0.6rem;
            letter-spacing:0.18em;
            color:#3a6080;
            text-decoration:none;
            text-transform:uppercase;
            transition:color 0.2s;
            padding:6px 0;
          "
          aria-label="Exit Universe and return to main site"
        >← SITE</a>
        <div id="hud-breadcrumb" style="
          font-family:'Space Mono',monospace;
          font-size:0.6rem;
          letter-spacing:0.15em;
          color:#2a4858;
          text-transform:uppercase;
        ">UNIVERSE</div>
      </div>
      <div id="hud-galaxy-name" style="
        font-family:'Space Mono',monospace;
        font-size:0.65rem;
        letter-spacing:0.2em;
        color:#3a6080;
        text-transform:uppercase;
        text-align:center;
        flex:1;
        pointer-events:none;
      "></div>
      <div style="display:flex;align-items:center;gap:12px;pointer-events:auto;">
        <button
          id="hud-place"
          type="button"
          style="
            font-family:'Space Grotesk',sans-serif;
            font-size:0.65rem;letter-spacing:0.12em;text-transform:uppercase;
            background:rgba(20,60,100,0.6);
            border:1px solid rgba(40,120,200,0.25);
            border-radius:4px;
            color:#5090c0;
            padding:6px 12px;
            cursor:pointer;
            transition:background 0.2s,color 0.2s;
            white-space:nowrap;
          "
          aria-label="Place your star"
        >✦ PLACE STAR</button>
        <button
          id="hud-mute"
          type="button"
          style="
            background:rgba(255,255,255,0.04);
            border:1px solid rgba(255,255,255,0.08);
            border-radius:50%;
            width:32px;height:32px;
            color:#3a6080;
            cursor:pointer;
            font-size:0.8rem;
            display:flex;align-items:center;justify-content:center;
            transition:background 0.2s;
          "
          aria-label="Toggle sound"
        >♪</button>
      </div>
    `;

    container.appendChild(this.el);

    this.galaxyLabel = this.el.querySelector('#hud-galaxy-name')!;
    this.breadcrumb = this.el.querySelector('#hud-breadcrumb')!;
    this.muteBtn = this.el.querySelector('#hud-mute')!;
    this.placeBtn = this.el.querySelector('#hud-place')!;

    this._bindEvents();
    this._syncMute();

    // Subscribe to store changes
    store.subscribe('currentGalaxyId', (id) => {
      this.galaxyLabel.textContent = id ? getGalaxyLabel(id) : '';
    });
    store.subscribe('navContext', (ctx) => {
      this.breadcrumb.textContent = ctx.level.toUpperCase();
    });
    store.subscribe('muted', () => this._syncMute());
    store.subscribe('myStarId', (id) => {
      this.placeBtn.style.display = id ? 'none' : 'block';
    });
    // Init hide if already placed
    if (store.get('myStarId')) this.placeBtn.style.display = 'none';
  }

  private _bindEvents() {
    this.muteBtn.addEventListener('click', () => {
      audioManager.unlock();
      store.toggleMute();
      audioManager.setMuted(store.get('muted'));
    });

    this.placeBtn.addEventListener('click', () => {
      audioManager.unlock();
      store.set('placementMode', true);
      window.dispatchEvent(new CustomEvent('universe-start-placement'));
    });

    // Unlock audio on any interaction
    document.getElementById('universe-canvas')?.addEventListener('click', () => {
      audioManager.unlock();
    }, { once: true });
  }

  private _syncMute() {
    const muted = store.get('muted');
    this.muteBtn.textContent = muted ? '♪̶' : '♪';
    this.muteBtn.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
    this.muteBtn.style.color = muted ? '#2a3848' : '#3a6080';
  }

  setPlacementMode(active: boolean) {
    this.placeBtn.textContent = active ? '✦ PLACING…' : '✦ PLACE STAR';
    this.placeBtn.style.color = active ? '#60c080' : '#5090c0';
  }

  dispose() {
    this.el.remove();
  }
}
