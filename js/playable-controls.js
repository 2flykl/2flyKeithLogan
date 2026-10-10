/* Shared navigation for every catalogue experience, including direct visits. */
(() => {
  const library = new URL('../pages/site-overhaul.html#playables', document.currentScript.src).href;
  let closeMenu = () => {};
  let menuOpen = false;
  // Restrict browser gestures to UI where they make sense. Instructions and
  // form fields retain scrolling/editing; game surfaces own their touches.
  const surface = 'canvas,[data-key],[data-move],.touch button,.mobile-controls button,.mobileControls button,#touch-controls button,#touch-move button,#action,#fire-touch,#burst-touch,#board,#roomViewport';
  const protectedUI = `${surface},button,[role="button"],a,img,video,#hud,.hud`;
  const editable = 'input,textarea,select,[contenteditable]:not([contenteditable="false"])';
  const touchStyle = document.createElement('style');
  touchStyle.textContent = `
    html{overscroll-behavior:none}
    ${protectedUI}{-webkit-user-select:none!important;user-select:none!important;-webkit-touch-callout:none!important;-webkit-tap-highlight-color:transparent}
    button,[role="button"],a{touch-action:manipulation}
    ${surface}{touch-action:none!important;overscroll-behavior:none}
    img,canvas{ -webkit-user-drag:none }
    input,textarea,[contenteditable]:not([contenteditable="false"]){-webkit-user-select:text!important;user-select:text!important;-webkit-touch-callout:default!important}
  `;
  document.head.appendChild(touchStyle);
  const protectedTarget = event => {
    const target = event.composedPath().find(node => node instanceof Element);
    return target && !target.closest(editable) && target.closest(protectedUI);
  };
  for (const type of ['contextmenu','selectstart','dragstart']) {
    document.addEventListener(type, event => {
      if (protectedTarget(event)) event.preventDefault();
    }, true);
  }
  const activeTouches = new Map();
  window.addEventListener('pointerdown', event => {
    const target = protectedTarget(event);
    if (target && event.pointerType !== 'mouse') activeTouches.set(event.pointerId, {target, type:event.pointerType});
  }, true);
  for (const type of ['pointerup','pointercancel']) {
    window.addEventListener(type, event => activeTouches.delete(event.pointerId), true);
  }
  window.addEventListener('lostpointercapture', event => {
    const touch = activeTouches.get(event.pointerId);
    activeTouches.delete(event.pointerId);
    if (touch) touch.target.dispatchEvent(new PointerEvent('pointercancel', {bubbles:true, pointerId:event.pointerId, pointerType:touch.type}));
  }, true);
  const cancelTouches = () => {
    const touches = [...activeTouches];
    activeTouches.clear();
    for (const [id, touch] of touches) {
      touch.target.dispatchEvent(new PointerEvent('pointercancel', {bubbles:true, pointerId:id, pointerType:touch.type}));
      for (let node = touch.target; node; node = node.parentElement) {
        if (node.hasPointerCapture?.(id)) node.releasePointerCapture(id);
      }
    }
  };
  window.addEventListener('blur', cancelTouches);
  window.addEventListener('pagehide', cancelTouches);
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancelTouches(); });
  const fullscreenElement = () => document.fullscreenElement || document.webkitFullscreenElement;
  let releasedAt = 0;
  const back = () => {
    document.exitPointerLock?.();
    window.location.assign(library);
  };
  // Capture before a game's pause/keyboard handlers. Native Esc exits immersive
  // mode first; a second press returns to the library, without accidental exits.
  window.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || event.repeat) return;
    event.stopImmediatePropagation();
    if (menuOpen) { event.preventDefault(); closeMenu(true); return; }
    if (fullscreenElement()) {
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      Promise.resolve(exit.call(document)).catch(() => {});
      return;
    }
    if (document.pointerLockElement) { document.exitPointerLock(); return; }
    if (performance.now() - releasedAt < 400) return;
    event.preventDefault();
    back();
  }, true);
  document.addEventListener('pointerlockchange', () => { if (!document.pointerLockElement) releasedAt = performance.now(); });
  document.addEventListener('DOMContentLoaded', () => {
    const host = document.createElement('div');
    host.id = 'playable-controls';
    host.style.cssText = 'position:fixed;right:env(safe-area-inset-right,0px);top:50%;transform:translateY(-50%);z-index:2147483647;width:44px;height:44px;';
    const shadow = host.attachShadow({mode:'open'});
    shadow.innerHTML = `<style>
      :host{color-scheme:dark}*{box-sizing:border-box;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}button,a{touch-action:manipulation}
      [hidden]{display:none!important}
      button,a{display:flex;align-items:center;justify-content:center;gap:8px;min-height:44px;padding:0 12px;border:0;border-radius:5px;background:transparent;color:#fff;text-decoration:none;white-space:nowrap;font:700 11px/1.2 Arial,sans-serif;letter-spacing:.04em;cursor:pointer}
      button:hover,a:hover{background:#ffffff20}button:focus-visible,a:focus-visible{outline:2px solid #f5cb83;outline-offset:-2px}
      #toggle{width:44px;height:44px;padding:0;opacity:.5;background:transparent;transition:opacity .18s}
      #toggle span{display:grid;place-items:center;width:26px;height:34px;margin-left:auto;border:1px solid #ffffff45;border-right:0;border-radius:7px 0 0 7px;background:#090c12d9;font-size:20px;line-height:1}
      #toggle:hover,#toggle:focus-visible,#toggle[aria-expanded=true]{opacity:1}
      #panel{position:absolute;right:44px;top:50%;transform:translateY(-50%);width:190px;max-width:calc(100vw - 60px);padding:6px;background:#090c12f5;border:1px solid #ffffff30;border-radius:9px;box-shadow:0 3px 16px #0005}
      nav{display:grid;gap:2px}nav a,nav button{justify-content:flex-start;width:100%}
      kbd{margin-left:auto;font:10px Arial,sans-serif;color:#d4c6ab;border:1px solid #ffffff40;border-radius:3px;padding:3px}
      [role=status]{margin:4px 0 0;padding:6px;color:#ddd;font:12px/1.4 Arial,sans-serif}[role=status]:empty{display:none}
      @media(prefers-reduced-motion:reduce){#toggle{transition:none}}
    </style><button id="toggle" type="button" aria-label="Open game menu" aria-expanded="false" aria-controls="panel" title="Game menu · Back / Full screen"><span aria-hidden="true">⋮</span></button><div id="panel" hidden><nav aria-label="Experience controls"><a href="${library}" aria-label="Back to Playable Experiences">← BACK <kbd>Esc</kbd></a><button id="full" type="button" aria-pressed="false">⛶ FULL SCREEN</button></nav><p role="status" aria-live="polite"></p></div>`;
    document.body.appendChild(host);
    const toggle = shadow.querySelector('#toggle');
    const panel = shadow.querySelector('#panel');
    const button = shadow.querySelector('#full');
    const status = shadow.querySelector('[role=status]');
    closeMenu = (restoreFocus = false) => {
      menuOpen = false; panel.hidden = true;
      toggle.setAttribute('aria-expanded','false');
      toggle.setAttribute('aria-label','Open game menu');
      status.textContent = '';
      if (restoreFocus) toggle.focus({preventScroll:true});
    };
    toggle.addEventListener('click', () => {
      if (menuOpen) { closeMenu(); return; }
      menuOpen = true; panel.hidden = false;
      toggle.setAttribute('aria-expanded','true');
      toggle.setAttribute('aria-label','Close game menu');
    });
    // Returning to the board dismisses the menu without consuming game input.
    document.addEventListener('pointerdown', event => {
      if (!event.composedPath().includes(host)) closeMenu();
    }, true);
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape' && !event.composedPath().includes(host)) closeMenu();
    }, true);
    host.addEventListener('focusout', () => {
      queueMicrotask(() => { if (!shadow.activeElement) closeMenu(); });
    });
    shadow.querySelector('a').addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); back();
    });
    const update = () => {
      const active = !!fullscreenElement();
      button.textContent = active ? '⛶ EXIT FULL SCREEN' : '⛶ FULL SCREEN';
      button.setAttribute('aria-pressed', String(active));
      if (!active) releasedAt = performance.now();
    };
    document.addEventListener('fullscreenchange', update);
    document.addEventListener('webkitfullscreenchange', update);
    button.addEventListener('click', async () => {
      status.textContent = '';
      try {
        if (fullscreenElement()) {
          const exit = document.exitFullscreen || document.webkitExitFullscreen;
          await exit.call(document);
        } else {
          const request = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
          if (!request) throw new Error('unsupported');
          await request.call(document.documentElement);
        }
        update();
        closeMenu(true);
      } catch {
        status.textContent = 'Full screen is unavailable in this browser. Try opening this experience in Safari, Chrome, or Edge.';
      }
    });
    // Clicking these controls must not also fire/jump in the game behind them.
    ['pointerdown','pointerup','mousedown','mouseup','click','touchstart','touchend','keydown','keyup'].forEach(type => {
      host.addEventListener(type, event => event.stopPropagation());
    });
  }, {once:true});
})();
