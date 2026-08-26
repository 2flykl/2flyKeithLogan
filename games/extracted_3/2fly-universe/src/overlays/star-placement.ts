// Star Placement Overlay — Phase II Safe Exit & Unsaved Data Protection Flow

import { createOverlayEl, injectOverlayStyles, trapFocus } from './overlay-utils';
import type { StarPlacementRequest } from '../types';
import { starRepository } from '../data/star-repository';
import { store } from '../state/universe-store';
import { openStarCardOverlay } from './star-card-export';

export interface PlacementContext {
  galaxyId: string;
  regionId: string;
  x: number;
  y: number;
  z: number;
}

type Step = 'info' | 'confirm' | 'ignition';

export function openStarPlacementOverlay(
  container: HTMLElement,
  ctx: PlacementContext,
  onClose: (placed: boolean) => void
) {
  injectOverlayStyles();

  const panel = createOverlayEl('star-placement-overlay', 'star-placement-overlay');
  panel.setAttribute('aria-label', 'Place Your Star in the 2Fly Universe');
  panel.style.background = 'rgba(0,2,8,0.88)';

  let step: Step = 'info';
  let displayName = '';
  let starName = '';
  let message = '';
  let showUnsavedWarning = false;

  function render() {
    panel.innerHTML = stepHTML(step, ctx, displayName, starName, message, showUnsavedWarning);
    bindStepEvents();
    trapFocus(panel);
  }

  function hasUnsavedData(): boolean {
    return displayName.trim().length > 0 || starName.trim().length > 0 || message.trim().length > 0;
  }

  function requestExit() {
    // Read current form inputs if on info step
    if (step === 'info') {
      const dnInput = panel.querySelector<HTMLInputElement>('#place-display-name');
      const snInput = panel.querySelector<HTMLInputElement>('#place-star-name');
      const msgInput = panel.querySelector<HTMLTextAreaElement>('#place-message');
      if (dnInput) displayName = dnInput.value.trim();
      if (snInput) starName = snInput.value.trim();
      if (msgInput) message = msgInput.value.trim();
    }

    if (hasUnsavedData()) {
      showUnsavedWarning = true;
      render();
    } else {
      close(false);
    }
  }

  function bindStepEvents() {
    // Top nav buttons
    panel.querySelector('#place-back-header')?.addEventListener('click', () => handleBack());
    panel.querySelector('#place-close')?.addEventListener('click', () => requestExit());

    // Unsaved warning modal buttons
    if (showUnsavedWarning) {
      panel.querySelector('#unsaved-keep')?.addEventListener('click', () => {
        showUnsavedWarning = false;
        render();
      });
      panel.querySelector('#unsaved-discard')?.addEventListener('click', () => {
        close(false);
      });
      return;
    }

    if (step === 'info') {
      const nextBtn = panel.querySelector<HTMLButtonElement>('#place-next');
      nextBtn?.addEventListener('click', () => {
        const dn = (panel.querySelector<HTMLInputElement>('#place-display-name')?.value ?? '').trim();
        const sn = (panel.querySelector<HTMLInputElement>('#place-star-name')?.value ?? '').trim();
        const msg = (panel.querySelector<HTMLTextAreaElement>('#place-message')?.value ?? '').trim();

        if (!dn) {
          const err = panel.querySelector('#place-error');
          if (err) err.textContent = 'Display name is required.';
          return;
        }
        displayName = dn;
        starName = sn;
        message = msg;
        step = 'confirm';
        render();
      });
    }

    if (step === 'confirm') {
      panel.querySelector('#place-back')?.addEventListener('click', () => handleBack());
      panel.querySelector('#place-confirm')?.addEventListener('click', async () => {
        const btn = panel.querySelector<HTMLButtonElement>('#place-confirm');
        if (btn) { btn.disabled = true; btn.textContent = 'PLACING…'; }

        const req: StarPlacementRequest = {
          galaxyId: ctx.galaxyId,
          regionId: ctx.regionId,
          x: ctx.x, y: ctx.y, z: ctx.z,
          displayName, starName: starName || undefined, message: message || undefined,
        };

        const result = await starRepository.placestar(req);

        if (result.success && result.star) {
          store.setMyStarForGalaxy(result.star.galaxyId, result.star.id);
          store.addStar(result.star);
          step = 'ignition';
          render();
          setTimeout(() => {
            if (result.star) openStarCardOverlay(container, result.star, () => close(true));
          }, 2200);
        } else {
          const errMap: Record<string, string> = {
            'collision': 'That location is too close to another star. Please choose a different spot.',
            'already-placed-in-galaxy': 'You have already placed a star in this era galaxy.',
            'already-placed': 'You have already placed a star in this era galaxy.',
            'rate-limit': 'Please wait a moment before placing again.',
            'server-error': 'An error occurred. Please try again.',
          };
          step = 'info';
          render();
          const err = panel.querySelector('#place-error');
          if (err) err.textContent = errMap[result.error ?? 'server-error'] ?? 'An error occurred.';
        }
      });
    }
  }

  function handleBack() {
    if (showUnsavedWarning) {
      showUnsavedWarning = false;
      render();
      return;
    }
    if (step === 'confirm') {
      step = 'info';
      render();
    } else if (step === 'info') {
      requestExit();
    }
  }

  // Keyboard Esc handling
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      handleBack();
    }
  };
  window.addEventListener('keydown', handleKeyDown);

  function close(placed: boolean) {
    window.removeEventListener('keydown', handleKeyDown);
    panel.style.animation = 'overlay-out 0.2s ease forwards';
    setTimeout(() => { panel.remove(); onClose(placed); }, 200);
  }

  render();
  container.appendChild(panel);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    close(false);
  };
}

function stepHTML(
  step: Step,
  ctx: PlacementContext,
  dn: string,
  sn: string,
  msg: string,
  showUnsavedWarning: boolean
): string {
  const coords = `${ctx.x.toFixed(0)}, ${ctx.y.toFixed(0)}, ${ctx.z.toFixed(0)}`;

  if (showUnsavedWarning) {
    return `
      <div style="
        position:relative;
        background:linear-gradient(135deg,#0a0408 0%,#180812 100%);
        border:1px solid rgba(240,100,120,0.3);
        border-radius:16px;
        padding:40px 32px 32px;
        max-width:400px;width:90vw;
        text-align:center;
        box-shadow:0 12px 40px rgba(0,0,0,0.8);
      ">
        <div style="font-size:2rem;margin-bottom:12px;color:#f06080;" aria-hidden="true">⚠️</div>
        <h3 style="font-family:'Space Mono',monospace;font-size:1rem;letter-spacing:0.08em;
          margin-bottom:12px;color:#f8d0d8;">
          Discard this unfinished star?
        </h3>
        <p style="font-size:0.78rem;color:#a87888;margin-bottom:24px;line-height:1.5;">
          You have unsaved star information. Leaving now will discard your current entries.
        </p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          <button id="unsaved-keep" type="button" style="${btnStyle('#182838','#203850')}">
            KEEP EDITING
          </button>
          <button id="unsaved-discard" type="button" style="${btnStyle('#801828','#a02038')} color:#ffd0d8;">
            DISCARD & RETURN
          </button>
        </div>
      </div>
    `;
  }

  const headerControls = `
    <div style="
      position:absolute;top:16px;left:16px;right:16px;
      display:flex;align-items:center;justify-content:space-between;
      pointer-events:auto;z-index:10;
    ">
      <button id="place-back-header" type="button" aria-label="Go Back"
        style="
          background:rgba(255,255,255,0.06);
          border:1px solid rgba(255,255,255,0.12);
          border-radius:4px;
          color:#8ab4d4;
          font-family:'Space Mono',monospace;
          font-size:0.65rem;
          letter-spacing:0.1em;
          padding:6px 12px;
          cursor:pointer;
          min-height:36px;
          display:flex;align-items:center;gap:4px;
        ">← BACK</button>

      <button id="place-close" type="button" aria-label="Cancel star placement"
        style="
          background:rgba(255,255,255,0.06);
          border:1px solid rgba(255,255,255,0.12);
          border-radius:4px;
          color:#8ab4d4;
          font-family:'Space Mono',monospace;
          font-size:0.65rem;
          letter-spacing:0.1em;
          padding:6px 12px;
          cursor:pointer;
          min-height:36px;
        ">CANCEL ×</button>
    </div>
  `;

  if (step === 'info') return `
    <div style="
      position:relative;
      background:linear-gradient(135deg,#020610 0%,#040c1e 100%);
      border:1px solid rgba(100,160,255,0.15);
      border-radius:16px;
      padding:60px 32px 32px;
      max-width:440px;width:90vw;
    ">
      ${headerControls}
      <p style="font-size:0.65rem;letter-spacing:0.2em;color:#4070c0;margin-bottom:8px;
        text-transform:uppercase;font-family:'Space Mono',monospace;">
        PLACE YOUR STAR
      </p>
      <h2 style="font-family:'Space Mono',monospace;font-size:1rem;letter-spacing:0.08em;
        margin-bottom:6px;color:#c0d8f8;">
        Mark Your Place in the Universe
      </h2>
      <p style="font-size:0.75rem;color:#4a6888;margin-bottom:20px;line-height:1.6;">
        Coordinates: ${coords}
      </p>
      <div id="place-error" role="alert" style="color:#f06060;font-size:0.78rem;
        margin-bottom:12px;min-height:18px;"></div>
      <label style="display:block;margin-bottom:16px;">
        <span style="font-size:0.7rem;letter-spacing:0.12em;color:#6090b8;text-transform:uppercase;
          display:block;margin-bottom:6px;">Display Name *</span>
        <input id="place-display-name" type="text" maxlength="60"
          placeholder="Your name or alias"
          value="${dn}"
          style="${inputStyle()}"
          autocomplete="name" required />
      </label>
      <label style="display:block;margin-bottom:16px;">
        <span style="font-size:0.7rem;letter-spacing:0.12em;color:#6090b8;text-transform:uppercase;
          display:block;margin-bottom:6px;">Star Name (optional)</span>
        <input id="place-star-name" type="text" maxlength="60"
          placeholder="Name your star"
          value="${sn}"
          style="${inputStyle()}" />
      </label>
      <label style="display:block;margin-bottom:24px;">
        <span style="font-size:0.7rem;letter-spacing:0.12em;color:#6090b8;text-transform:uppercase;
          display:block;margin-bottom:6px;">Message (optional)</span>
        <textarea id="place-message" maxlength="280" rows="3"
          placeholder="Leave a message for the Universe…"
          style="${inputStyle()} resize:vertical;height:80px;"
        >${msg}</textarea>
      </label>
      <button id="place-next" type="button" style="${btnStyle('#1a60c0','#2080e0')} width:100%;">
        PREVIEW MY STAR →
      </button>
    </div>
  `;

  if (step === 'confirm') return `
    <div style="
      position:relative;
      background:linear-gradient(135deg,#020610 0%,#040c1e 100%);
      border:1px solid rgba(100,200,255,0.2);
      border-radius:16px;
      padding:60px 32px 32px;
      max-width:440px;width:90vw;
      text-align:center;
    ">
      ${headerControls}
      <div style="font-size:2.8rem;margin-bottom:12px;color:#ffd700;" aria-hidden="true">✦</div>
      <p style="font-size:0.65rem;letter-spacing:0.2em;color:#4070c0;margin-bottom:8px;
        text-transform:uppercase;font-family:'Space Mono',monospace;">Confirm Placement</p>
      <h2 style="font-family:'Space Mono',monospace;font-size:1.1rem;letter-spacing:0.08em;
        margin-bottom:16px;color:#c0d8f8;">
        ${dn}
      </h2>
      ${sn ? `<p style="color:#7090b0;font-size:0.85rem;margin-bottom:8px;">Star: "${sn}"</p>` : ''}
      ${msg ? `<p style="color:#5a7898;font-size:0.8rem;font-style:italic;margin-bottom:8px;">"${msg}"</p>` : ''}
      <p style="color:#3a5878;font-size:0.75rem;font-family:'Space Mono',monospace;margin-bottom:20px;">
        Coordinates: ${coords}
      </p>
      <p style="color:#4a6888;font-size:0.75rem;margin-bottom:24px;line-height:1.6;">
        Your star is permanent. Confirm to ignite your light in this era galaxy.
      </p>
      <div style="display:flex;gap:12px;justify-content:center;">
        <button id="place-back" type="button" style="${btnStyle('#1a2030','#202840')}">← BACK</button>
        <button id="place-confirm" type="button" style="${btnStyle('#104080','#1060b0')}">IGNITE MY STAR ✦</button>
      </div>
    </div>
  `;

  if (step === 'ignition') return `
    <div style="
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      gap:24px;padding:60px;text-align:center;
    ">
      <div style="
        width:80px;height:80px;
        border-radius:50%;
        background:radial-gradient(circle,#ffd700 0%,#ff8800 40%,transparent 70%);
        animation:star-ignite 2s ease-out forwards;
        box-shadow:0 0 60px #ffd700, 0 0 120px #ff8800;
      " aria-hidden="true"></div>
      <p style="font-family:'Space Mono',monospace;font-size:0.8rem;letter-spacing:0.2em;
        color:#ffd070;text-transform:uppercase;animation:fade-in-text 0.8s 0.5s both;">
        ${dn} — Your star ignites
      </p>
    </div>
  `;

  return '';
}

function inputStyle(): string {
  return `
    width:100%;
    background:rgba(255,255,255,0.04);
    border:1px solid rgba(80,120,200,0.2);
    border-radius:6px;
    color:#c8d8f0;
    font-family:'Space Grotesk',sans-serif;
    font-size:0.9rem;
    padding:10px 14px;
    outline:none;
    transition:border-color 0.2s;
    box-sizing:border-box;
  `;
}

function btnStyle(bg: string, hover: string): string {
  return `
    display:inline-block;
    padding:12px 20px;
    background:${bg};
    border:1px solid rgba(80,140,220,0.3);
    border-radius:6px;
    color:#a0d0f0;
    font-family:'Space Grotesk',sans-serif;
    font-size:0.75rem;
    letter-spacing:0.12em;
    text-transform:uppercase;
    cursor:pointer;
    transition:background 0.2s;
    --hover-bg:${hover};
  `;
}
