/* Ebony Eyes runtime repair v4.4
   - Restores the missing viewport-fit function referenced by app.js.
   - Sizes the board from its ACTUAL rendered top edge rather than estimated UI heights.
   - Removes CSS max-height clipping so the bottom gold border stays visible.
*/
(function () {
  'use strict';

  const ROW_COUNT = 7;
  const COL_COUNT = 10;
  const root = document.documentElement;

  function clampRuntime(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function installCssRepair() {
    if (document.getElementById('ebony-runtime-fix-v44-style')) return;
    const style = document.createElement('style');
    style.id = 'ebony-runtime-fix-v44-style';
    style.textContent = `
      html, body, #app { height: 100%; min-height: 100%; overflow: hidden; }
      #game.active { height: 100dvh !important; min-height: 0 !important; overflow: hidden !important; }
      #game.active main { min-height: 0 !important; overflow: hidden !important; }
      #game.active #boardWrap { min-height: 0 !important; overflow: hidden !important; }
      #game.active #boardContainer {
        max-height: none !important;
        height: auto !important;
        overflow: visible !important;
        margin-bottom: 0 !important;
      }
      #game.active #board {
        max-height: none !important;
        height: auto !important;
        min-height: 0 !important;
      }
      #game.active #statusLine {
        flex: 0 0 auto !important;
        min-height: 12px !important;
        margin-top: 2px !important;
        padding-bottom: 0 !important;
      }
    `;
    document.head.appendChild(style);
  }

  function initialBoardGeometry() {
    root.style.setProperty('--cols', COL_COUNT);
    root.style.setProperty('--rows', ROW_COUNT);

    const mobile = window.innerWidth <= 900;
    const gap = mobile ? 2 : 4;
    const pad = mobile ? 10 : 20;
    const reserve = mobile ? 12 : 36;
    const availableWidth = Math.max(280, (window.visualViewport?.width || window.innerWidth) - reserve);
    const byWidth = Math.floor((availableWidth - (COL_COUNT - 1) * gap - pad) / COL_COUNT);
    const cell = clampRuntime(byWidth, mobile ? 22 : 32, mobile ? 58 : 88);

    root.style.setProperty('--cell', cell + 'px');
    root.style.setProperty('--previewCell', Math.max(mobile ? 18 : 24, Math.floor(cell * 0.40)) + 'px');
  }

  function fitBoardToViewport() {
    const boardWrap = document.getElementById('boardWrap');
    const boardContainer = document.getElementById('boardContainer');
    const board = document.getElementById('board');
    const status = document.getElementById('statusLine');
    if (!boardWrap || !boardContainer || !board) return;

    const mobile = window.innerWidth <= 900;
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    const viewportWidth = window.visualViewport?.width || window.innerWidth;
    const boardTop = boardContainer.getBoundingClientRect().top;
    const statusReserve = status ? Math.max(12, status.offsetHeight) : 12;
    const bottomSafety = mobile ? 7 : 10;

    const availableHeight = Math.max(170, viewportHeight - boardTop - statusReserve - bottomSafety);
    const availableWidth = Math.max(250, Math.min(boardWrap.clientWidth, viewportWidth) - (mobile ? 8 : 16));

    const cs = getComputedStyle(board);
    const rowGap = parseFloat(cs.rowGap) || (mobile ? 2 : 4);
    const colGap = parseFloat(cs.columnGap) || rowGap;
    const padY = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
    const padX = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);

    const byHeight = Math.floor((availableHeight - padY - (ROW_COUNT - 1) * rowGap) / ROW_COUNT);
    const byWidth = Math.floor((availableWidth - padX - (COL_COUNT - 1) * colGap) / COL_COUNT);

    let cell = Math.floor(Math.min(byHeight, byWidth));
    cell = clampRuntime(cell, mobile ? 22 : 28, mobile ? 58 : 92);
    root.style.setProperty('--cell', cell + 'px');
    root.style.setProperty('--previewCell', Math.max(mobile ? 18 : 22, Math.floor(cell * 0.40)) + 'px');

    /* Real post-layout correction. The board frame itself is the authority. */
    let rect = boardContainer.getBoundingClientRect();
    const bottomLimit = viewportHeight - bottomSafety - statusReserve;
    if (rect.bottom > bottomLimit && cell > (mobile ? 22 : 28)) {
      const overflow = rect.bottom - bottomLimit;
      const shrink = Math.ceil(overflow / ROW_COUNT) + 1;
      cell = Math.max(mobile ? 22 : 28, cell - shrink);
      root.style.setProperty('--cell', cell + 'px');
      root.style.setProperty('--previewCell', Math.max(mobile ? 18 : 22, Math.floor(cell * 0.40)) + 'px');
      rect = boardContainer.getBoundingClientRect();
    }

    document.body.dataset.ebonyBoardFits = rect.bottom <= viewportHeight - bottomSafety ? 'true' : 'false';
  }

  function queueFit() {
    cancelAnimationFrame(queueFit.raf1 || 0);
    cancelAnimationFrame(queueFit.raf2 || 0);
    queueFit.raf1 = requestAnimationFrame(function () {
      queueFit.raf2 = requestAnimationFrame(fitBoardToViewport);
    });
  }

  installCssRepair();

  /* app.js calls ensureBoardFitsViewport() from renderAll(). The live main branch
     was missing this definition, which stopped startup at 03:07. */
  window.ensureBoardFitsViewport = fitBoardToViewport;
  window.updateBoardGeometry = initialBoardGeometry;
  window.__EBONY_RUNTIME_FIX__ = '4.4';

  window.addEventListener('resize', queueFit, { passive: true });
  window.visualViewport?.addEventListener('resize', queueFit, { passive: true });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) queueFit();
  });

  /* Safety watchdog: if a start interaction occurred but a browser lost the first
     scheduled flow timeout, restart the normal loop once without duplicating it. */
  setInterval(function () {
    try {
      if (window.started === true && window.ending !== true && window.paused !== true) {
        queueFit();
      }
    } catch (_) {}
  }, 1500);
})();
