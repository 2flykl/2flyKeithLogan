// HUD — Phase II Navigation Chrome with Per-Galaxy "VIEW YOUR STAR" vs "PLACE STAR" Dynamic Logic

import { store } from '../state/universe-store';
import { audioManager } from '../audio/audio-manager';
import { getGalaxyLabel } from '../data/universe-data';
import { starRepository } from '../data/star-repository';

export interface HUDCallbacks {
  onResetView: () => void;
  onReturnPrevious: () => void;
  onTakeTour: () => void;
  onViewMyStar: (starId: string) => void;
  onNextTour: () => void;
  onPrevTour: () => void;
  onExitTour: () => void;
  onFinishTour: () => void;
}

export class HUD {
  private el: HTMLElement;
  private galaxyLabel!: HTMLElement;
  private muteBtn!: HTMLButtonElement;
  private placeBtn!: HTMLButtonElement;
  private resetBtn!: HTMLButtonElement;
  private returnBtn!: HTMLButtonElement;
  private tourBtn!: HTMLButtonElement;
  private breadcrumb!: HTMLElement;
  private callbacks: HUDCallbacks;

  constructor(container: HTMLElement, callbacks: HUDCallbacks) {
    this.callbacks = callbacks;

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
      background:linear-gradient(to bottom,rgba(0,4,12,0.85) 0%,transparent 100%);
      pointer-events:none;
      z-index:50;
      gap:12px;
    `;

    this.el.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;pointer-events:auto;flex-wrap:wrap;">
        <a
          id="hud-exit"
          href="../../index.html"
          style="
            font-family:'Space Mono',monospace;
            font-size:0.65rem;
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
        <button
          id="hud-reset"
          type="button"
          style="${btnStyle('rgba(255,255,255,0.05)', '#4080c0')}"
          aria-label="Reset Camera to Universe Composition"
          title="Reset View to Default Universe Composition"
        >⌂ RESET VIEW</button>
        <button
          id="hud-return"
          type="button"
          style="${btnStyle('rgba(255,255,255,0.05)', '#4080c0')} display:none;"
          aria-label="Return to Previous Location"
        >← RETURN</button>
      </div>

      <div id="hud-galaxy-name" style="
        font-family:'Space Mono',monospace;
        font-size:0.65rem;
        letter-spacing:0.2em;
        color:#4a78a0;
        text-transform:uppercase;
        text-align:center;
        flex:1;
        pointer-events:none;
      "></div>

      <div style="display:flex;align-items:center;gap:10px;pointer-events:auto;">
        <button
          id="hud-tour"
          type="button"
          style="${btnStyle('rgba(40,100,160,0.4)', '#70c0ff')}"
          aria-label="Take me somewhere guided tour"
          title="Cinematic flight to a featured universe destination"
        >✦ TAKE ME SOMEWHERE</button>
        <button
          id="hud-tour-prev"
          type="button"
          style="${btnStyle('rgba(20,60,100,0.4)', '#5090c0')} display:none;"
          aria-label="Previous tour stop"
        >← PREV</button>
        <button
          id="hud-tour-next"
          type="button"
          style="${btnStyle('rgba(20,60,100,0.4)', '#5090c0')} display:none;"
          aria-label="Next tour stop"
        >NEXT →</button>
        <button
          id="hud-tour-exit"
          type="button"
          style="${btnStyle('rgba(80,30,30,0.4)', '#ff8080')} display:none;"
          aria-label="Exit tour"
        >✖ EXIT</button>
        <button
          id="hud-tour-finish"
          type="button"
          style="${btnStyle('rgba(30,80,30,0.4)', '#80ff80')} display:none;"
          aria-label="Finish tour"
        >✔ FINISH</button>

        <button
          id="hud-place"
          type="button"
          style="${btnStyle('rgba(20,60,100,0.6)', '#5090c0')}"
          aria-label="Place or view your star"
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
            font-size:0.85rem;
            display:flex;align-items:center;justify-content:center;
            transition:background 0.2s, color 0.2s;
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
    this.resetBtn = this.el.querySelector('#hud-reset')!;
    this.returnBtn = this.el.querySelector('#hud-return')!;
    this.tourBtn = this.el.querySelector('#hud-tour')!;
    this.tourPrevBtn = this.el.querySelector('#hud-tour-prev')!;
    this.tourNextBtn = this.el.querySelector('#hud-tour-next')!;
    this.tourExitBtn = this.el.querySelector('#hud-tour-exit')!;
    this.tourFinishBtn = this.el.querySelector('#hud-tour-finish')!;

    this._bindEvents();
    this._syncMute();

    store.subscribe('currentGalaxyId', (id) => {
      this.galaxyLabel.textContent = id ? getGalaxyLabel(id) : '';
      this._syncStarButton();
    });
    store.subscribe('navContext', (ctx) => {
      this.breadcrumb.textContent = ctx.level.toUpperCase();
    });
    store.subscribe('muted', () => this._syncMute());
    store.subscribe('myStarsMap', () => this._syncStarButton());

    this._syncStarButton();
  }

  private _syncStarButton() {
    const curGalaxyId = store.get('currentGalaxyId') ?? 'G2025';
    const myStarId = starRepository.getMyStarId(curGalaxyId);

    if (myStarId) {
      this.placeBtn.textContent = '✦ VIEW YOUR STAR';
      this.placeBtn.style.color = '#ffd700';
      this.placeBtn.style.background = 'rgba(100,80,10,0.6)';
      this.placeBtn.dataset['action'] = 'view';
      this.placeBtn.dataset['starId'] = myStarId;
    } else {
      this.placeBtn.textContent = '✦ PLACE STAR';
      this.placeBtn.style.color = '#5090c0';
      this.placeBtn.style.background = 'rgba(20,60,100,0.6)';
      this.placeBtn.dataset['action'] = 'place';
      delete this.placeBtn.dataset['starId'];
    }
  }

  private _bindEvents() {
    this.resetBtn.addEventListener('click', () => {
      audioManager.unlock();
      this.callbacks.onResetView();
    });

    this.returnBtn.addEventListener('click', () => {
      audioManager.unlock();
      this.callbacks.onReturnPrevious();
    });

    this.tourBtn.addEventListener('click', () => {
      audioManager.unlock();
      this.callbacks.onTakeTour();
    });
    this.tourPrevBtn.addEventListener('click', () => {
      audioManager.unlock();
      this.callbacks.onPrevTour();
    });
    this.tourNextBtn.addEventListener('click', () => {
      audioManager.unlock();
      this.callbacks.onNextTour();
    });
    this.tourExitBtn.addEventListener('click', () => {
      audioManager.unlock();
      this.callbacks.onExitTour();
    });
    this.tourFinishBtn.addEventListener('click', () => {
      audioManager.unlock();
      this.callbacks.onFinishTour();
    });

    this.muteBtn.addEventListener('click', () => {
      audioManager.unlock();
      store.toggleMute();
      audioManager.setMuted(store.get('muted'));
    });

    this.placeBtn.addEventListener('click', () => {
      audioManager.unlock();
      const action = this.placeBtn.dataset['action'];
      const starId = this.placeBtn.dataset['starId'];

      if (action === 'view' && starId) {
        this.callbacks.onViewMyStar(starId);
      } else {
        store.set('placementMode', true);
        window.dispatchEvent(new CustomEvent('universe-start-placement'));
      }
    });

    document.getElementById('universe-canvas')?.addEventListener('click', () => {
      audioManager.unlock();
    }, { once: true });
  }

  setReturnAvailable(available: boolean) {
    this.returnBtn.style.display = available ? 'inline-block' : 'none';
    // Also control tour navigation visibility
    const tourActive = available; // reuse flag for simplicity – will be toggled via setTourActive
    this.tourPrevBtn.style.display = 'none';
    this.tourNextBtn.style.display = 'none';
    this.tourExitBtn.style.display = 'none';
    this.tourFinishBtn.style.display = 'none';
  }

  setTourActive(active: boolean) {
    const display = active ? 'inline-block' : 'none';
    this.tourPrevBtn.style.display = display;
    this.tourNextBtn.style.display = display;
    this.tourExitBtn.style.display = display;
    this.tourFinishBtn.style.display = display;
    // Hide the main tour button when active
    this.tourBtn.style.display = active ? 'none' : 'inline-block';
  }

  private _syncMute() {
    const muted = store.get('muted');
    this.muteBtn.textContent = muted ? '♪̶' : '♪';
    this.muteBtn.setAttribute('aria-label', muted ? 'Unmute' : 'Mute');
    this.muteBtn.style.color = muted ? '#2a3848' : '#4a85b0';
  }

  setPlacementMode(active: boolean) {
    if (active) {
      this.placeBtn.textContent = '✦ PLACING…';
      this.placeBtn.style.color = '#60c080';
    } else {
      this._syncStarButton();
    }
  }

  dispose() {
    this.el.remove();
  }
}

function btnStyle(bg: string, color: string): string {
  return `
    font-family:'Space Grotesk',sans-serif;
    font-size:0.65rem;letter-spacing:0.12em;text-transform:uppercase;
    background:${bg};
    border:1px solid rgba(80,160,240,0.25);
    border-radius:4px;
    color:${color};
    padding:6px 12px;
    cursor:pointer;
    transition:background 0.2s, color 0.2s;
    white-space:nowrap;
  `;
}
