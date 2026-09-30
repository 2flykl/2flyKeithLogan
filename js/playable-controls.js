/* Shared navigation for every catalogue experience, including direct visits. */
(() => {
  const library = new URL('../pages/site-overhaul.html#playables', document.currentScript.src).href;
  const dock = document.currentScript.dataset.dock || 'bottom';
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
    host.style.cssText = 'position:fixed;left:50%;bottom:max(10px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:2147483647;width:max-content;max-width:calc(100vw - 20px);';
    const shadow = host.attachShadow({mode:'open'});
    shadow.innerHTML = `<style>
      :host{color-scheme:dark}*{box-sizing:border-box;-webkit-user-select:none;user-select:none;-webkit-touch-callout:none}button,a{touch-action:manipulation}
      nav{display:flex;align-items:center;gap:4px;padding:4px;background:#090c12ed;border:1px solid #ffffff45;border-radius:9px;box-shadow:0 3px 16px #0005}
      button,a{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:36px;padding:0 12px;border:0;border-radius:5px;background:transparent;color:#fff;text-decoration:none;white-space:nowrap;font:700 11px/1.2 Arial,sans-serif;letter-spacing:.04em;cursor:pointer}
      button:hover,a:hover{background:#ffffff20}button:focus-visible,a:focus-visible{outline:2px solid #f5cb83;outline-offset:-2px}kbd{font:10px Arial,sans-serif;color:#d4c6ab;border:1px solid #ffffff40;border-radius:3px;padding:3px}
      [role=status]{position:absolute;bottom:100%;left:0;right:0;padding:8px;background:#090c12;color:#fff;font:12px/1.4 Arial,sans-serif;border-radius:5px} [role=status]:empty{display:none}
      @media(max-width:600px){button,a{min-height:40px;padding:0 10px;font-size:10px}kbd{display:none}}
    </style><nav aria-label="Experience controls"><a href="${library}" aria-label="Back to Playable Experiences">← BACK <kbd>Esc</kbd></a><button type="button" aria-pressed="false">⛶ FULL SCREEN</button></nav><p role="status" aria-live="polite"></p>`;
    document.body.appendChild(host);
    const layout = document.createElement('style');
    if (dock === 'top') {
      layout.textContent = '#playable-controls{top:max(56px,env(safe-area-inset-top));bottom:auto!important}';
    } else if (dock === 'streams') {
      layout.textContent = '@media(max-width:700px){#playable-controls{top:160px;bottom:auto!important}}';
    } else if (dock === 'flow') {
      host.style.cssText = 'position:sticky;top:0;z-index:2147483647;display:flex;justify-content:center;background:#090c12;padding:3px;';
      document.body.prepend(host);
    } else if (dock === 'ebony') {
      host.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:2147483647;display:flex;justify-content:center;background:#090c12;padding:3px;';
      layout.textContent = '#app{margin-top:56px;height:calc(100% - 56px)!important}#title.active{height:calc(100dvh - 56px)!important}';
    }
    document.head.appendChild(layout);
    const button = shadow.querySelector('button');
    const status = shadow.querySelector('[role=status]');
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
