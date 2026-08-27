// 2Fly Universe V20 direct launch entry point
import { initUniverseShell } from './universe-shell.js';

export async function startUniverse() {
  const canvas = document.getElementById('universe-canvas');
  if (!canvas) throw new Error('No canvas element found');
  const status = document.getElementById('loading-status');
  if (status) status.textContent = 'Connecting navigation core…';
  try {
    await initUniverseShell(canvas);
    window.dispatchEvent(new CustomEvent('2fly-universe-ready'));
    return true;
  } catch (err) {
    console.error('[2Fly Universe V20] Fatal init error:', err);
    if (status) {
      status.textContent = 'Launch failed — check console and retry.';
      status.style.color = '#f07b7b';
    }
    window.dispatchEvent(new CustomEvent('2fly-universe-error', { detail: { message: String(err?.message || err) } }));
    throw err;
  }
}
