/* Quiet, weighted background rotation. The still always remains underneath. */
(function (root) {
  'use strict';
  const clips = Object.freeze([
    { id: 'kling', file: 'kling.mp4', weight: 75 },
    { id: 'night-01', file: 'night-01.mp4', weight: 5 },
    { id: 'night-02', file: 'night-02.mp4', weight: 5 },
    { id: 'night-03', file: 'night-03.mp4', weight: 5 },
    { id: 'minimax', file: 'minimax.mp4', weight: 5 },
    { id: 'veo', file: 'veo.mp4', weight: 5 }
  ]);
  function pickClip(random = Math.random, excluded = new Set()) {
    const available = clips.filter(clip => !excluded.has(clip.id));
    if (!available.length) return null;
    let ticket = random() * available.reduce((sum, clip) => sum + clip.weight, 0);
    return available.find(clip => (ticket -= clip.weight) < 0) || available.at(-1);
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { clips, pickClip };
  if (!root.document) return;
  const host = document.querySelector('.exterior');
  const slots = [...host.querySelectorAll('.background-loop')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const failed = new Set();
  let active = null, timer, retireTimer, generation = 0, loading = false, cancelLoad;
  const allowed = () => !document.hidden && !reduced.matches;
  function schedule() {
    clearTimeout(timer);
    if (allowed() && active) timer = setTimeout(rotate, 45000);
  }
  function release(slot) {
    slot.classList.remove('is-visible'); slot.pause();
    slot.removeAttribute('src'); slot.load(); delete slot.dataset.clip;
  }
  function ready(slot) {
    return new Promise((resolve, reject) => {
      let timeout;
      const finish = error => {
        clearTimeout(timeout); slot.removeEventListener('canplay', good); slot.removeEventListener('error', bad);
        cancelLoad = null; error ? reject(error) : resolve();
      };
      const good = () => finish();
      const bad = () => finish(new Error('Background media unavailable'));
      cancelLoad = () => finish(new DOMException('Cancelled', 'AbortError'));
      slot.addEventListener('canplay', good, { once: true }); slot.addEventListener('error', bad, { once: true });
      timeout = setTimeout(bad, 15000);
      if (slot.readyState >= 3) good();
    });
  }
  async function rotate() {
    if (!allowed() || loading) return;
    const clip = pickClip(Math.random, failed);
    if (!clip) return;
    if (active?.dataset.clip === clip.id) { schedule(); return; }
    const token = ++generation, next = slots.find(slot => slot !== active);
    loading = true;
    try {
      next.muted = true; next.defaultMuted = true; next.volume = 0;
      next.dataset.clip = clip.id; next.src = `../assets/drive-in/loops/${clip.file}`; next.load();
      await ready(next);
      if (token !== generation || !allowed()) return;
      await next.play();
      if (token !== generation || !allowed()) { next.pause(); return; }
      const previous = active; active = next;
      host.dataset.activeLoop = clip.id;
      next.classList.add('is-visible');
      // The incoming layer fades over the outgoing layer; no dip to black.
      next.style.zIndex = '2';
      if (previous) {
        previous.style.zIndex = '1';
        clearTimeout(retireTimer);
        retireTimer = setTimeout(() => release(previous), 1800);
      }
      schedule();
    } catch (error) {
      if (token === generation && error.name !== 'AbortError') {
        release(next);
        if (error.name !== 'NotAllowedError') { failed.add(clip.id); timer = setTimeout(rotate, 500); }
        // Autoplay denial keeps the still; a user gesture retries below.
      }
    } finally { if (token === generation) loading = false; }
  }
  function sync() {
    document.body.classList.toggle('hidden-page', document.hidden);
    if (!allowed()) {
      ++generation; loading = false; cancelLoad?.(); clearTimeout(timer); clearTimeout(retireTimer);
      slots.forEach(slot => { slot.pause(); slot.classList.remove('is-visible'); });
      slots.filter(slot => slot !== active).forEach(release);
      return;
    }
    if (active) {
      active.play().then(() => { if (allowed()) { active.classList.add('is-visible'); schedule(); } else active.pause(); }).catch(() => {});
    } else rotate();
  }
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
  window.addEventListener('pagehide', () => { ++generation; cancelLoad?.(); loading = false; clearTimeout(timer); clearTimeout(retireTimer); slots.forEach(slot => { slot.pause(); slot.classList.remove('is-visible'); }); slots.filter(slot => slot !== active).forEach(release); });
  window.addEventListener('pageshow', sync);
  document.addEventListener('pointerdown', () => { if (allowed() && (!active || active.paused)) sync(); }, { passive: true });
  // Runtime failures also return to a still and try another supplied clip.
  slots.forEach(slot => slot.addEventListener('error', () => {
    if (slot !== active || loading) return;
    failed.add(slot.dataset.clip); release(slot); active = null; clearTimeout(timer);
    if (allowed()) timer = setTimeout(rotate, 500);
  }));
  sync();
})(typeof window === 'undefined' ? globalThis : window);
