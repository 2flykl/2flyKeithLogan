import { startUniverse } from './app-v21/main.js';

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
    status.textContent = 'Building galaxies & navigation…';
  }
  try {
    await startUniverse();
  } catch (err) {
    launching = false;
    if (ring) ring.style.display = 'none';
    if (retryBtn) retryBtn.style.display = 'inline-block';
    if (status) {
      status.style.color = '#f07b7b';
      status.textContent = 'Launch interrupted — ' + String(err?.message || err || 'unknown error');
    }
    console.error('[2Fly V22 launcher]', err);
  }
}

launchBtn?.addEventListener('click', launch);
retryBtn?.addEventListener('click', launch);
window.addEventListener('2fly-universe-ready', () => {
  if (status) status.textContent = 'Universe ready.';
});
window.addEventListener('error', e => console.error('[2Fly V22 window error]', e.error || e.message));
window.addEventListener('unhandledrejection', e => console.error('[2Fly V22 rejection]', e.reason));
