// Star Card Export — canvas-based shareable card generator
// 1080×1350 standard card and 1080×1920 story version
import { GALAXY_THEMES } from '../types.js';
import { getGalaxyLabel } from '../data/universe-data.js';
import { createOverlayEl, injectOverlayStyles, closeOnEsc, addCloseButton, trapFocus } from './overlay-utils.js';
import { store } from '../state/universe-store.js';
export function openStarCardOverlay(container, star, onClose) {
    injectOverlayStyles();
    const panel = createOverlayEl('star-card-overlay', 'star-card-overlay');
    panel.setAttribute('aria-label', `Star Card: ${star.displayName}`);
    panel.style.background = 'rgba(0,2,10,0.92)';
    const cardCanvas = document.createElement('canvas');
    cardCanvas.width = 1080;
    cardCanvas.height = 1350;
    cardCanvas.style.display = 'none';
    document.body.appendChild(cardCanvas);
    drawStarCard(cardCanvas, star, 1080, 1350);
    const storyCanvas = document.createElement('canvas');
    storyCanvas.width = 1080;
    storyCanvas.height = 1920;
    storyCanvas.style.display = 'none';
    document.body.appendChild(storyCanvas);
    drawStarCard(storyCanvas, star, 1080, 1920);
    // Preview canvas (scaled down for display)
    const previewCanvas = document.createElement('canvas');
    previewCanvas.width = 360;
    previewCanvas.height = 450;
    previewCanvas.style.cssText = 'border-radius:8px;max-width:100%;';
    drawStarCard(previewCanvas, star, 360, 450);
    const shareUrl = `${location.origin}${location.pathname}#star/${star.id}`;
    panel.innerHTML = `
    <div style="
      position:relative;
      background:linear-gradient(135deg,#020610 0%,#040a1c 100%);
      border:1px solid rgba(255,200,50,0.15);
      border-radius:16px;
      padding:48px 32px 32px;
      max-width:480px;width:92vw;
      text-align:center;
    ">
      <p style="font-size:0.65rem;letter-spacing:0.2em;color:#c8a040;margin-bottom:16px;
        text-transform:uppercase;font-family:'Space Mono',monospace;">
        ✦ Your Star Card
      </p>
      <div id="star-card-preview-wrap" style="margin-bottom:20px;"></div>
      <h2 style="font-family:'Space Mono',monospace;font-size:1rem;letter-spacing:0.08em;
        margin-bottom:6px;color:#f8e080;">
        ${star.displayName}
      </h2>
      ${star.starName ? `<p style="color:#9080a0;font-size:0.8rem;margin-bottom:4px;">"${star.starName}"</p>` : ''}
      <p style="color:#3a5070;font-size:0.7rem;font-family:'Space Mono',monospace;margin-bottom:20px;">
        ID: ${star.id.slice(0, 16)}…
      </p>
      <p style="color:#4a6888;font-size:0.75rem;margin-bottom:4px;">Share your star:</p>
      <div style="
        background:rgba(255,255,255,0.03);
        border:1px solid rgba(255,255,255,0.08);
        border-radius:6px;
        padding:8px 12px;
        font-family:'Space Mono',monospace;
        font-size:0.65rem;
        color:#4a6888;
        margin-bottom:20px;
        word-break:break-all;
      ">${shareUrl}</div>
      <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-bottom:16px;">
        <button id="dl-card" type="button" style="${dlBtnStyle()}">DOWNLOAD CARD (1080×1350)</button>
        <button id="dl-story" type="button" style="${dlBtnStyle()}">DOWNLOAD STORY (1080×1920)</button>
        <button id="copy-link" type="button" style="${dlBtnStyle('rgba(20,60,20,0.6)')}">COPY SHARE LINK</button>
      </div>
      <p id="copy-confirm" style="color:#60c070;font-size:0.75rem;min-height:18px;"></p>
    </div>
  `;
    // Inject preview canvas
    const wrap = panel.querySelector('#star-card-preview-wrap');
    if (wrap)
        wrap.appendChild(previewCanvas);
    // Download buttons
    panel.querySelector('#dl-card')?.addEventListener('click', () => {
        downloadCanvas(cardCanvas, `2fly-star-${star.id.slice(0, 8)}-card.png`);
    });
    panel.querySelector('#dl-story')?.addEventListener('click', () => {
        downloadCanvas(storyCanvas, `2fly-star-${star.id.slice(0, 8)}-story.png`);
    });
    panel.querySelector('#copy-link')?.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            const conf = panel.querySelector('#copy-confirm');
            if (conf) {
                conf.textContent = 'Link copied!';
                setTimeout(() => { conf.textContent = ''; }, 2000);
            }
        }
        catch {
            const conf = panel.querySelector('#copy-confirm');
            if (conf)
                conf.textContent = shareUrl;
        }
    });
    const closeFn = () => {
        panel.remove();
        cardCanvas.remove();
        storyCanvas.remove();
        previewCanvas.remove();
        onClose();
    };
    addCloseButton(panel.firstElementChild, closeFn);
    const unlisten = closeOnEsc(panel, closeFn);
    const untrap = trapFocus(panel);
    panel.addEventListener('mousedown', e => { if (e.target === panel)
        closeFn(); });
    container.appendChild(panel);
    return () => { unlisten(); untrap(); closeFn(); };
}
// Star View Overlay — rich parallax star profile
export function openStarViewOverlay(container, star, onClose) {
    injectOverlayStyles();
    const panel = createOverlayEl('star-view-overlay', 'star-view-overlay');
    panel.setAttribute('aria-label', `Star: ${star.displayName}`);
    const theme = GALAXY_THEMES[star.galaxyId];
    const themeColor = theme ? '#' + theme.primaryColor.toString(16).padStart(6, '0') : '#4080c0';
    const galaxyLabel = getGalaxyLabel(star.galaxyId);
    panel.innerHTML = `
    <div style="
      position:relative;
      background:radial-gradient(ellipse at 50% 30%, rgba(${hexToRgb(theme?.primaryColor ?? 0x2060a0)},0.12) 0%, rgba(0,4,12,0.95) 70%);
      border:1px solid rgba(${hexToRgb(theme?.primaryColor ?? 0x2060a0)},0.2);
      border-radius:20px;
      padding:60px 40px 40px;
      max-width:500px;width:92vw;
      text-align:center;
    ">
      <div style="
        font-size:3rem;margin-bottom:20px;
        text-shadow:0 0 30px ${themeColor};
        animation:star-pulse 3s ease-in-out infinite;
      " aria-hidden="true">✦</div>
      <p style="font-size:0.65rem;letter-spacing:0.2em;color:${themeColor};margin-bottom:8px;
        text-transform:uppercase;font-family:'Space Mono',monospace;">
        Star — ${galaxyLabel}
      </p>
      <h2 style="font-family:'Space Mono',monospace;font-size:1.2rem;letter-spacing:0.08em;
        margin-bottom:6px;color:#f0f4ff;">
        ${star.displayName}
      </h2>
      ${star.starName ? `<p style="color:#7080a0;font-size:0.85rem;margin-bottom:12px;">"${star.starName}"</p>` : ''}
      ${star.message ? `
        <blockquote style="
          color:#8090a8;font-size:0.85rem;font-style:italic;
          margin:0 0 20px;padding:12px 16px;
          border-left:2px solid rgba(${hexToRgb(theme?.primaryColor ?? 0x2060a0)},0.3);
          text-align:left;border-radius:0 8px 8px 0;
          background:rgba(255,255,255,0.02);
        ">
          "${star.message}"
        </blockquote>
      ` : ''}
      <div style="
        display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:20px 0;
        text-align:left;
      ">
        ${statRow('GALAXY', galaxyLabel)}
        ${statRow('ARRIVED', formatDate(star.createdAt))}
        ${statRow('STAR ID', star.id.slice(0, 14) + '…')}
        ${statRow('COORDINATES', `${star.x.toFixed(0)}, ${star.y.toFixed(0)}, ${star.z.toFixed(0)}`)}
      </div>
      <button id="star-place-cta" type="button" style="
        margin-top:8px;
        padding:12px 28px;
        background:rgba(${hexToRgb(theme?.primaryColor ?? 0x2060a0)},0.15);
        border:1px solid rgba(${hexToRgb(theme?.primaryColor ?? 0x2060a0)},0.35);
        border-radius:6px;
        color:#c0d0f0;
        font-family:'Space Grotesk',sans-serif;
        font-size:0.8rem;letter-spacing:0.12em;text-transform:uppercase;
        cursor:pointer;
        transition:background 0.2s;
      ">PLACE YOUR STAR →</button>
    </div>
  `;
    const closeFn = () => {
        panel.style.animation = 'overlay-out 0.2s ease forwards';
        setTimeout(() => { panel.remove(); onClose(); }, 200);
    };
    panel.querySelector('#star-place-cta')?.addEventListener('click', () => {
        closeFn();
        store.set('placementMode', true);
        window.dispatchEvent(new CustomEvent('universe-start-placement'));
    });
    addCloseButton(panel.firstElementChild, closeFn);
    const unlisten = closeOnEsc(panel, closeFn);
    const untrap = trapFocus(panel);
    panel.addEventListener('mousedown', e => { if (e.target === panel)
        closeFn(); });
    container.appendChild(panel);
    return () => { unlisten(); untrap(); closeFn(); };
}
// Shared star deep link arrival
export async function playStarArrivalSequence(container, star, onComplete) {
    const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const overlay = document.createElement('div');
    overlay.style.cssText = `
    position:fixed;inset:0;
    background:rgba(0,2,8,0.92);
    display:flex;flex-direction:column;
    align-items:center;justify-content:center;
    z-index:200;
    font-family:'Space Mono',monospace;
    text-align:center;gap:16px;
    transition:opacity 0.5s;
  `;
    overlay.innerHTML = `
    <p style="font-size:0.6rem;letter-spacing:0.3em;color:#2060a0;text-transform:uppercase;">
      DESTINATION RECEIVED
    </p>
    <div style="font-size:0.8rem;letter-spacing:0.1em;color:#4090c0;">
      INITIATING APPROACH SEQUENCE
    </div>
    <div style="
      font-size:2rem;color:#ffd700;
      animation:star-pulse 2s ease-in-out infinite;
    " aria-hidden="true">✦</div>
    <p style="font-size:0.7rem;color:#3a6080;max-width:300px;line-height:1.6;">
      Flying to ${star.displayName}'s star in the<br/>2Fly Universe…
    </p>
  `;
    container.appendChild(overlay);
    const delay = REDUCED ? 400 : 2500;
    await new Promise(r => setTimeout(r, delay));
    overlay.style.opacity = '0';
    await new Promise(r => setTimeout(r, 500));
    overlay.remove();
    onComplete();
}
// ── Drawing ──────────────────────────────────────────────────────────────────
function dlBtnStyle(bg = 'rgba(20,40,80,0.6)') {
    return [
        `display:inline-block;`,
        `padding:10px 16px;`,
        `background:${bg};`,
        `border:1px solid rgba(80,140,220,0.25);`,
        `border-radius:6px;`,
        `color:#a0b8d8;`,
        `font-family:'Space Grotesk',sans-serif;`,
        `font-size:0.72rem;`,
        `letter-spacing:0.1em;`,
        `text-transform:uppercase;`,
        `cursor:pointer;`,
        `transition:background 0.2s;`,
    ].join('');
}
function drawStarCard(canvas, star, w, h) {
    const ctx = canvas.getContext('2d');
    if (!ctx)
        return;
    canvas.width = w;
    canvas.height = h;
    const theme = GALAXY_THEMES[star.galaxyId];
    const bgGrad = ctx.createRadialGradient(w * 0.5, h * 0.3, 0, w * 0.5, h * 0.3, h * 0.7);
    const c = theme ? '#' + theme.primaryColor.toString(16).padStart(6, '0') : '#204080';
    bgGrad.addColorStop(0, `${c}22`);
    bgGrad.addColorStop(0.6, '#020810');
    bgGrad.addColorStop(1, '#010408');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);
    // Procedural stars background
    ctx.globalAlpha = 0.5;
    for (let i = 0; i < 300; i++) {
        const sx = Math.random() * w;
        const sy = Math.random() * h;
        const sr = Math.random() * 1.2 + 0.3;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
    // Star glyph
    const scale = w / 1080;
    const starSize = 80 * scale;
    ctx.font = `${starSize}px serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd700';
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 40 * scale;
    ctx.fillText('✦', w * 0.5, h * 0.25);
    ctx.shadowBlur = 0;
    // Title line
    ctx.font = `${11 * scale}px 'Arial', sans-serif`;
    ctx.fillStyle = c;
    ctx.letterSpacing = `${3 * scale}px`;
    ctx.fillText('2FLY UNIVERSE', w * 0.5, h * 0.32);
    // Display name
    ctx.font = `bold ${28 * scale}px 'Arial', sans-serif`;
    ctx.fillStyle = '#f0f4ff';
    ctx.letterSpacing = '0px';
    ctx.fillText(star.displayName.toUpperCase(), w * 0.5, h * 0.40);
    // Star name
    if (star.starName) {
        ctx.font = `${16 * scale}px 'Arial', sans-serif`;
        ctx.fillStyle = '#7080a0';
        ctx.fillText(`"${star.starName}"`, w * 0.5, h * 0.45);
    }
    // Message
    if (star.message) {
        ctx.font = `italic ${13 * scale}px 'Arial', sans-serif`;
        ctx.fillStyle = '#5a7090';
        wrapText(ctx, `"${star.message}"`, w * 0.5, h * 0.52, w * 0.75, 18 * scale);
    }
    // Metadata block
    const metaY = h * 0.72;
    const lineH = 20 * scale;
    ctx.font = `${10 * scale}px 'Courier New', monospace`;
    ctx.textAlign = 'center';
    const meta = [
        `GALAXY: ${getGalaxyLabel(star.galaxyId).toUpperCase()}`,
        `ARRIVED: ${formatDate(star.createdAt)}`,
        `ID: ${star.id.slice(0, 20)}`,
        `COORDS: ${star.x.toFixed(0)}, ${star.y.toFixed(0)}, ${star.z.toFixed(0)}`,
    ];
    ctx.fillStyle = '#2a4060';
    meta.forEach((line, i) => ctx.fillText(line, w * 0.5, metaY + i * lineH));
    // Bottom brand
    ctx.font = `${9 * scale}px 'Arial', sans-serif`;
    ctx.fillStyle = '#1a3050';
    ctx.fillText('2FLYKEITHLOGAN.COM/UNIVERSE', w * 0.5, h * 0.94);
    // Border
    ctx.strokeStyle = `${c}33`;
    ctx.lineWidth = 2 * scale;
    ctx.strokeRect(20 * scale, 20 * scale, w - 40 * scale, h - 40 * scale);
}
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let lineY = y;
    for (const word of words) {
        const test = line + word + ' ';
        if (ctx.measureText(test).width > maxWidth && line.length) {
            ctx.fillText(line, x, lineY);
            line = word + ' ';
            lineY += lineHeight;
        }
        else {
            line = test;
        }
    }
    ctx.fillText(line, x, lineY);
}
function downloadCanvas(canvas, filename) {
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = filename;
    a.click();
}
function statRow(label, value) {
    return `
    <div style="
      background:rgba(255,255,255,0.02);
      border:1px solid rgba(255,255,255,0.05);
      border-radius:6px;
      padding:10px 12px;
    ">
      <div style="font-size:0.6rem;letter-spacing:0.15em;color:#3a5070;
        text-transform:uppercase;font-family:'Space Mono',monospace;margin-bottom:4px;">${label}</div>
      <div style="font-size:0.78rem;color:#8090b0;word-break:break-all;">${value}</div>
    </div>
  `;
}
function formatDate(iso) {
    try {
        return new Date(iso).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    }
    catch {
        return iso;
    }
}
function hexToRgb(hex) {
    const r = (hex >> 16) & 0xff;
    const g = (hex >> 8) & 0xff;
    const b = hex & 0xff;
    return `${r},${g},${b}`;
}
// Inject star pulse animation
const _s = document.createElement('style');
_s.textContent = `
  @keyframes star-pulse {
    0%,100% { text-shadow:0 0 10px currentColor,0 0 20px currentColor; }
    50% { text-shadow:0 0 20px currentColor,0 0 40px currentColor,0 0 60px currentColor; }
  }
`;
document.head.appendChild(_s);
