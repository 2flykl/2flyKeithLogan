// Media Player Overlay — spatial audio player with orbital interface
import { createOverlayEl, injectOverlayStyles, addCloseButton, trapFocus, closeOnEsc } from './overlay-utils.js';
import { audioManager } from '../audio/audio-manager.js';
export function openAudioOverlay(container, child, onClose) {
    injectOverlayStyles();
    audioManager.duckAmbient();
    const panel = createOverlayEl('audio-overlay', 'audio-overlay');
    panel.setAttribute('aria-label', `Audio: ${child.title}`);
    const isAwaiting = !child.mediaUrl || child.contentStatus === 'awaiting-source';
    panel.innerHTML = `
    <div style="
      position:relative;
      background:linear-gradient(135deg,#030d18 0%,#061828 60%,#020a10 100%);
      border:1px solid rgba(32,160,208,0.2);
      border-radius:16px;
      padding:48px 40px 36px;
      max-width:480px;
      width:90vw;
      text-align:center;
    ">
      <div style="
        width:120px;height:120px;
        border-radius:50%;
        border:2px solid rgba(32,200,200,0.3);
        display:flex;align-items:center;justify-content:center;
        margin:0 auto 24px;
        position:relative;
        animation:orbit-pulse 3s ease-in-out infinite;
      ">
        <span style="font-size:2.5rem;" aria-hidden="true">♪</span>
        <div style="
          position:absolute;inset:-20px;
          border:1px solid rgba(32,200,200,0.1);
          border-radius:50%;
          animation:orbit-spin 8s linear infinite;
        "></div>
      </div>
      <p style="font-size:0.7rem;letter-spacing:0.2em;color:#4090b0;margin-bottom:8px;text-transform:uppercase;">
        THE SOUND OF THIS WORLD
      </p>
      <h2 style="font-family:'Space Mono',monospace;font-size:1.1rem;letter-spacing:0.1em;margin-bottom:16px;color:#c8e8f8;">
        ${child.title}
      </h2>
      ${isAwaiting ? `
        <p style="color:#4a6878;font-size:0.8rem;letter-spacing:0.08em;margin-bottom:24px;">
          A NEW SIGNAL IS TAKING SHAPE
        </p>
        <div style="
          background:rgba(8,40,60,0.6);
          border:1px dashed rgba(32,120,160,0.25);
          border-radius:8px;
          padding:16px;
          color:#3a6878;
          font-size:0.75rem;
          font-family:'Space Mono',monospace;
          letter-spacing:0.05em;
        ">
          This part of the archive is still growing.<br/>Return to the world to discover its available music, films, and experiences.
        </div>
      ` : `
        <audio
          id="spatial-audio"
          controls
          style="width:100%;border-radius:8px;margin-bottom:16px;accent-color:#20c0c0;"
          src="${child.mediaUrl}"
        ></audio>
      `}
    </div>
  `;
    injectOrbitAnimations();
    let closed=false;
    const previousFocus=document.activeElement;
    const closeFn = () => {
        if(closed)return;closed=true;
        unlisten();
        if(typeof untrap === "function") untrap();
        panel.querySelectorAll("audio,video").forEach(el=>audioManager.stopItem(el));
        previousFocus?.focus();
        panel.style.animation = 'overlay-out 0.2s ease forwards';
        setTimeout(() => {
            panel.remove();
            audioManager.restoreAmbient();
            onClose();
        }, 200);
    };
    addCloseButton(panel.firstElementChild, closeFn);
    const unlisten = closeOnEsc(panel, closeFn);
    const untrap = trapFocus(panel);
    panel.addEventListener('mousedown', (e) => {
        if (e.target === panel)
            closeFn();
    });
    container.appendChild(panel);
    container.setAttribute('aria-hidden', 'false');
    attachMediaFallback(panel,child);
    const video=panel.querySelector("video");if(video)audioManager.playItem(video);
    if (!isAwaiting) {
        const audio = panel.querySelector('#spatial-audio');
        if(audio)audioManager.playItem(audio);
        audio?.addEventListener('play', () => audioManager.duckAmbient());
        audio?.addEventListener('pause', () => audioManager.restoreAmbient());
    }
    return () => { unlisten(); untrap(); closeFn(); };
}
// Video Overlay — cinematic floating theater
export function openVideoOverlay(container, child, onClose) {
    injectOverlayStyles();
    audioManager.duckAmbient();
    const panel = createOverlayEl('video-overlay', 'video-overlay');
    panel.setAttribute('aria-label', `Video: ${child.title}`);
    panel.style.background = 'rgba(0,0,0,0.92)';
    const isAwaiting = !child.mediaUrl || child.contentStatus === 'awaiting-source';
    panel.innerHTML = `
    <div style="
      position:relative;
      max-width:820px;width:92vw;
    ">
      <p style="
        font-family:'Space Mono',monospace;
        font-size:0.65rem;letter-spacing:0.2em;color:#4090b0;
        text-align:center;margin-bottom:12px;text-transform:uppercase;
      ">
        STORIES IN MOTION
      </p>
      <h2 style="
        font-family:'Space Mono',monospace;font-size:1rem;letter-spacing:0.08em;
        color:#c8e8f8;text-align:center;margin-bottom:16px;
      ">
        ${child.title}
      </h2>
      <div style="
        aspect-ratio:16/9;
        background:#020810;
        border:1px solid rgba(255,100,60,0.15);
        border-radius:8px;
        display:flex;align-items:center;justify-content:center;
        overflow:hidden;
      ">
        ${isAwaiting ? `
          <div style="text-align:center;color:#3a5060;padding:32px;">
            <div style="font-size:2.5rem;margin-bottom:16px;" aria-hidden="true">▶</div>
            <p style="font-family:'Space Mono',monospace;font-size:0.7rem;letter-spacing:0.1em;">
              A NEW SIGNAL IS TAKING SHAPE<br/>This film has not yet entered the archive.
            </p>
          </div>
        ` : child.mediaUrl?.includes('youtube') || child.mediaUrl?.includes('youtu.be') ? `
          <iframe
            src="${toYouTubeEmbed(child.mediaUrl)}"
            style="width:100%;height:100%;border:none;"
            allow="autoplay;encrypted-media"
            allowfullscreen
            title="${child.title}"
          ></iframe>
        ` : `
          <video
            controls
            style="width:100%;height:100%;"
            src="${child.mediaUrl}"
            ${child.posterUrl ? `poster="${child.posterUrl}"` : ''}
          ></video>
        `}
      </div>
    </div>
  `;
    let closed=false;
    const previousFocus=document.activeElement;
    const closeFn = () => {
        if(closed)return;closed=true;
        unlisten();
        if(typeof untrap === "function") untrap();
        panel.querySelectorAll("audio,video").forEach(el=>audioManager.stopItem(el));
        previousFocus?.focus();
        panel.style.animation = 'overlay-out 0.2s ease forwards';
        setTimeout(() => {
            panel.remove();
            audioManager.restoreAmbient();
            onClose();
        }, 200);
    };
    addCloseButton(panel, closeFn);
    const unlisten = closeOnEsc(panel, closeFn);
    const untrap = trapFocus(panel);
    panel.addEventListener('mousedown', e => { if (e.target === panel)
        closeFn(); });
    container.appendChild(panel);
    attachMediaFallback(panel,child);
    const video=panel.querySelector("video");if(video)audioManager.playItem(video);
    return () => { unlisten(); untrap(); closeFn(); };
}
// Playable Experience Overlay — full-screen iframe
export function openPlayableOverlay(container, child, onClose) {
    injectOverlayStyles();
    audioManager.duckAmbient();
    const panel = createOverlayEl('playable-overlay', 'playable-overlay');
    panel.setAttribute('aria-label', `Playable Experience: ${child.title}`);
    panel.style.background = 'rgba(0,0,0,0.98)';
    panel.style.padding = '0';
    // The Streams game lives at /games/streams/
    const rawUrl = child.mediaUrl ?? '/games/streams/';
    const gameUrl = rawUrl.startsWith('/games/') ? 'https://2flykl.github.io/2flyKeithLogan' + rawUrl : rawUrl;
    panel.innerHTML = `
    <div style="position:relative;width:100%;height:100%;">
      <div style="
        position:absolute;top:0;left:0;right:0;
        display:flex;align-items:center;justify-content:space-between;
        padding:10px 16px;
        background:rgba(0,4,8,0.9);
        z-index:10;
        gap:16px;
      ">
        <span style="
          font-family:'Space Mono',monospace;
          font-size:0.6rem;letter-spacing:0.2em;color:#4090b0;
          flex:1;text-transform:uppercase;
        ">
          2FLY UNIVERSE — ${child.title}
        </span>
        <button
          id="exit-playable"
          type="button"
          style="
            font-family:'Space Grotesk',sans-serif;
            font-size:0.7rem;letter-spacing:0.12em;text-transform:uppercase;
            background:rgba(255,255,255,0.06);
            border:1px solid rgba(255,255,255,0.15);
            color:#a0c0d8;
            padding:6px 14px;border-radius:4px;
            cursor:pointer;
            transition:background 0.2s;
          "
          aria-label="Exit experience and return to Universe"
        >
          RETURN TO UNIVERSE
        </button>
      </div>
      <a href="${gameUrl}" target="_blank" rel="noopener noreferrer" style="position:absolute;bottom:12px;right:16px;z-index:11;padding:10px 14px;border:1px solid #75b8b1;border-radius:8px;background:#071b26;color:#b8ecda;font:12px Arial">Open experience in a new tab ↗</a>
      <iframe
        id="playable-frame"
        src="${gameUrl}"
        style="
          position:absolute;inset:40px 0 0 0;
          width:100%;
          height:calc(100% - 40px);
          border:none;
          background:#000;
        "
        title="${child.title}"
        allow="autoplay"
        sandbox="allow-scripts allow-same-origin allow-forms"
      ></iframe>
    </div>
  `;
    let closed=false;
    const previousFocus=document.activeElement;
    const closeFn = () => {
        if(closed)return;closed=true;
        unlisten();
        if(typeof untrap === "function") untrap();
        panel.querySelectorAll("audio,video").forEach(el=>audioManager.stopItem(el));
        previousFocus?.focus();
        panel.style.animation = 'overlay-out 0.15s ease forwards';
        setTimeout(() => {
            panel.remove();
            audioManager.restoreAmbient();
            onClose();
        }, 150);
    };
    panel.querySelector('#exit-playable')?.addEventListener('click', closeFn);
    const unlisten = closeOnEsc(panel, closeFn);
    const untrap=trapFocus(panel);
    container.appendChild(panel);
    // postMessage exit protocol from iframe
    const msgHandler = (e) => {
        if(e.source!==panel.querySelector('#playable-frame')?.contentWindow || e.origin!==new URL(gameUrl,location.href).origin)return;
        if (e.data === 'UNIVERSE_EXIT' || e.data?.type === 'UNIVERSE_EXIT') {
            closeFn();
        }
    };
    window.addEventListener('message', msgHandler);
    const observer=new MutationObserver(()=>{if(!panel.isConnected){window.removeEventListener('message',msgHandler);observer.disconnect();}});observer.observe(container,{childList:true});
    return () => {
        unlisten();
        window.removeEventListener('message', msgHandler);
        closeFn();
    };
}
// Archive / Dossier Overlay
export function openArchiveOverlay(container, child, onClose) {
    injectOverlayStyles();
    const panel = createOverlayEl('archive-overlay', 'archive-overlay');
    panel.setAttribute('aria-label', `Archive: ${child.title}`);
    panel.innerHTML = `
    <div style="
      position:relative;
      background:linear-gradient(135deg,#040810 0%,#080c18 100%);
      border:1px solid rgba(160,160,255,0.15);
      border-radius:16px;
      padding:48px 40px 36px;
      max-width:560px;width:90vw;
    ">
      <p style="font-size:0.65rem;letter-spacing:0.2em;color:#6060c0;margin-bottom:8px;text-transform:uppercase;font-family:'Space Mono',monospace;">
        MEMORY & ARTIFACTS
      </p>
      <h2 style="font-family:'Space Mono',monospace;font-size:1.1rem;letter-spacing:0.1em;margin-bottom:20px;color:#c0c8f8;">
        ${child.title}
      </h2>
      ${child.contentStatus === 'awaiting-source' ? `
        <div style="
          background:rgba(20,20,60,0.5);
          border:1px dashed rgba(80,80,180,0.25);
          border-radius:8px;
          padding:20px;
          color:#4a4a90;
          font-size:0.75rem;
          font-family:'Space Mono',monospace;
          letter-spacing:0.05em;
          line-height:1.7;
        ">
          THE ARCHIVE IS STILL GROWING<br/><br/>Artwork, memories, and the stories behind this world will gather here.<br/>Its available music and experiences are waiting in orbit.
        </div>
      ` : `<p style="color:#8090a8;font-size:0.9rem;line-height:1.7;">${child.description ?? 'Archive record.'}</p>`}
    </div>
  `;
    let closed=false;
    const previousFocus=document.activeElement;
    const closeFn = () => {
        if(closed)return;closed=true;
        unlisten();
        if(typeof untrap === "function") untrap();
        panel.querySelectorAll("audio,video").forEach(el=>audioManager.stopItem(el));
        previousFocus?.focus();
        panel.style.animation = 'overlay-out 0.2s ease forwards';
        setTimeout(() => { panel.remove(); onClose(); }, 200);
    };
    addCloseButton(panel.firstElementChild, closeFn);
    const unlisten = closeOnEsc(panel, closeFn);
    const untrap = trapFocus(panel);
    panel.addEventListener('mousedown', e => { if (e.target === panel)
        closeFn(); });
    container.appendChild(panel);
    attachMediaFallback(panel,child);
    const video=panel.querySelector("video");if(video)audioManager.playItem(video);
    return () => { unlisten(); untrap(); closeFn(); };
}
function toYouTubeEmbed(url) {
    const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match)
        return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
    return url;
}
function injectOrbitAnimations() {
    if (document.getElementById('orbit-anim'))
        return;
    const s = document.createElement('style');
    s.id = 'orbit-anim';
    s.textContent = `
    @keyframes orbit-pulse {
      0%,100% { box-shadow:0 0 20px rgba(32,200,200,0.1); }
      50% { box-shadow:0 0 40px rgba(32,200,200,0.25); }
    }
    @keyframes orbit-spin {
      to { transform:rotate(360deg); }
    }
  `;
    document.head.appendChild(s);
}

function attachMediaFallback(panel,child){
 const media=panel.querySelector('audio,video');if(!media)return;
 const link=document.createElement('a');link.className='media-fallback';link.href=child.mediaUrl;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Open original media ↗';media.parentElement.appendChild(link);
 media.addEventListener('error',()=>{link.textContent='Media could not load. Check your connection or open the original ↗';});
}
