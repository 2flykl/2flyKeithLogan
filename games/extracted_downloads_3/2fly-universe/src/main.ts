// Main entry point

import { initUniverseShell } from './universe-shell';

async function main() {
  const canvas = document.getElementById('universe-canvas') as HTMLCanvasElement;
  if (!canvas) throw new Error('No canvas element found');

  try {
    await initUniverseShell(canvas);
  } catch (err) {
    console.error('[2Fly Universe] Fatal init error:', err);
    const loading = document.getElementById('loading-screen');
    if (loading) {
      const status = document.getElementById('loading-status');
      if (status) {
        status.textContent = 'Universe failed to initialize. Please refresh.';
        status.style.color = '#f06060';
      }
    }
  }
}

main();
