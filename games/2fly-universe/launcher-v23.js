import './app-v23/depth-focus.js?v=23.4.0';
import './app-v23/vinyl-residency.js?v=23.6.0';
import { initUniverseShell } from './app-v23/universe-shell.js?v=23.6.0';

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
    status.textContent = 'Building galaxies, vinyl atlas & residency field…';
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
    console.error('[2Fly V23.6 launcher]', err);
  }
}
launchBtn?.addEventListener('click', launch);
retryBtn?.addEventListener('click', launch);
window.addEventListener('error', e => console.error('[2Fly V23.6 window error]', e.error || e.message));
window.addEventListener('unhandledrejection', e => console.error('[2Fly V23.6 rejection]', e.reason));
