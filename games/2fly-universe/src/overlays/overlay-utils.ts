// Overlay utilities — shared helpers for all overlays

export function createOverlayEl(id: string, className: string): HTMLElement {
  const el = document.createElement('div');
  el.id = id;
  el.className = `overlay-panel ${className}`;
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.style.cssText = `
    position:absolute;
    inset:0;
    display:flex;
    align-items:center;
    justify-content:center;
    background:rgba(0,4,12,0.82);
    backdrop-filter:blur(4px);
    -webkit-backdrop-filter:blur(4px);
    z-index:100;
    animation:overlay-in 0.25s ease;
  `;
  return el;
}

export function injectOverlayStyles() {
  if (document.getElementById('overlay-styles')) return;
  const style = document.createElement('style');
  style.id = 'overlay-styles';
  style.textContent = `
    @keyframes overlay-in {
      from { opacity:0; transform:scale(0.97); }
      to   { opacity:1; transform:scale(1); }
    }
    @keyframes overlay-out {
      from { opacity:1; }
      to   { opacity:0; }
    }
    @media (prefers-reduced-motion:reduce) {
      @keyframes overlay-in { from { opacity:0; } to { opacity:1; } }
      @keyframes overlay-out { from { opacity:1; } to { opacity:0; } }
    }
    .overlay-panel { font-family:'Space Grotesk',sans-serif; }
    .overlay-close-btn {
      position:absolute;top:20px;right:20px;
      background:rgba(255,255,255,0.06);
      border:1px solid rgba(255,255,255,0.12);
      color:#a0b8d0;
      width:36px;height:36px;
      border-radius:50%;
      cursor:pointer;
      font-size:1rem;
      display:flex;align-items:center;justify-content:center;
      transition:background 0.2s,color 0.2s;
      line-height:1;
    }
    .overlay-close-btn:hover { background:rgba(255,255,255,0.12); color:#fff; }
    .overlay-close-btn:focus-visible { outline:2px solid #4090d0; outline-offset:2px; }
  `;
  document.head.appendChild(style);
}

export function trapFocus(el: HTMLElement) {
  const focusable = el.querySelectorAll<HTMLElement>(
    'button,a,[tabindex]:not([tabindex="-1"]),input,textarea,select'
  );
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  function handler(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }
  }

  el.addEventListener('keydown', handler);
  first?.focus();
  return () => el.removeEventListener('keydown', handler);
}

export function closeOnEsc(el: HTMLElement, onClose: () => void) {
  function handler(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}

export function addCloseButton(container: HTMLElement, onClose: () => void): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.className = 'overlay-close-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Close');
  btn.innerHTML = '×';
  btn.addEventListener('click', onClose);
  container.appendChild(btn);
  return btn;
}
