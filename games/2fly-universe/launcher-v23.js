import { audioManager } from './app-v23/audio/audio-manager.js';
import { initUniverseShell } from './app-v23/universe-shell.js';

const launchBtn = document.getElementById('launch-btn');
const retryBtn = document.getElementById('launch-retry');
const ring = document.getElementById('load-ring');
const status = document.getElementById('loading-status');
let launching = false;

async function launch() {
  if (launching) return;
  launching = true;
  launchBtn?.classList.add('hidden');
  if (retryBtn) retryBtn.style.display = 'none';
  if (ring) ring.style.display = 'block';
  if (status) {
    status.style.color = '#527990';
    status.textContent = 'Building galaxies, atlas & navigation…';
  }
  try {
    const canvas = document.getElementById('universe-canvas');
    if (!canvas) throw new Error('Universe canvas missing');
    await initUniverseShell(canvas);
  } catch (err) {
    launching = false;
    if (ring) ring.style.display = 'none';
    if (retryBtn) retryBtn.style.display = 'inline-block';
    if (status) {
      status.style.color = '#f07b7b';
      status.textContent = 'Launch interrupted — ' + String(err?.message || err || 'unknown error');
    }
    console.error('[2Fly V23 launcher]', err);
  }
}
launchBtn?.addEventListener('click', () => { audioManager.unlock(); launch(); });
retryBtn?.addEventListener('click', launch);
window.addEventListener('error', e => console.error('[2Fly V23 window error]', e.error || e.message));
window.addEventListener('unhandledrejection', e => console.error('[2Fly V23 rejection]', e.reason));

if (new URLSearchParams(window.location.search).get('autostart') === '1') { setTimeout(launch, 120); }

window.addEventListener('2fly-webgl-lost',()=>{
 const panel=document.createElement('div');panel.id='graphics-recovery';panel.style.cssText='position:fixed;inset:0;z-index:10000;display:grid;place-items:center;background:#03101bed;color:#d8eee8;padding:30px;text-align:center';
 const card=document.createElement('div');card.innerHTML='<h2>Let’s reconnect the constellation.</h2><p style="margin:20px">Your browser paused the graphics context. Your saved stars are safe.</p><button class="launch-btn">RELOAD UNIVERSE</button>';card.querySelector('button').onclick=()=>location.reload();panel.appendChild(card);document.body.appendChild(panel);
});
