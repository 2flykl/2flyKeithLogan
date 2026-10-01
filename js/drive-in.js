/* 2FLY Drive-In: one verified feature for this test release. No catalogue prefetch. */
(() => {
  'use strict';
  const stations = Object.freeze([
    { id: 'away', frequency: 88.1, title: 'I Was Away', src: 'https://video.wixstatic.com/video/85e419_de8f9ec40b844a068eae0ab148b44fb6/1080p/mp4/file.mp4', poster: 'https://static.wixstatic.com/media/85e419_de8f9ec40b844a068eae0ab148b44fb6f001.jpg' }
  ]);
  const $ = id => document.getElementById(id);
  const scene = $('driveIn'), film = $('film'), movie = $('movie');
  let selected = 0, page = 0, idleTimer, tuneTimer, statusTimer, started = false, tuneFrequency = stations[0].frequency;
  const minFM = 88.1, maxFM = 107.9, pageSize = 5;
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const format = s => Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00';
  const announce = (message, persistent = false) => {
    clearTimeout(statusTimer); $('status').textContent = message; $('status').hidden = !message;
    if (!persistent && message) statusTimer = setTimeout(() => $('status').hidden = true, 2400);
  };
  function wake() {
    scene.classList.remove('idle'); clearTimeout(idleTimer);
    if (!film.paused) idleTimer = setTimeout(() => {
      if (!scene.querySelector(':focus-visible') || document.activeElement === movie) scene.classList.add('idle');
    }, 3000);
  }
  function setVolume(value) {
    const level = clamp(Math.round(value), 0, 100);
    film.volume = level / 100;
    if (level > 0) film.muted = false;
    syncVolume(); wake();
  }
  function syncVolume() {
    const level = Math.round(film.volume * 100), silent = film.muted || !level;
    $('volume').value = level;
    $('volumeKnob').setAttribute('aria-valuenow', level);
    $('volumeKnob').setAttribute('aria-valuetext', `${level} percent${film.muted ? ', muted' : ''}`);
    $('volumeKnob').style.setProperty('--turn', `${-135 + level * 2.7}deg`);
    $('mute').textContent = silent ? 'Muted' : 'Sound on';
    $('mute').setAttribute('aria-label', silent ? 'Unmute' : 'Mute');
    $('mute').setAttribute('aria-pressed', String(silent));
  }
  function previewFrequency(value) {
    tuneFrequency = Math.round(clamp(value, minFM, maxFM) * 10) / 10;
    const ratio = (tuneFrequency - minFM) / (maxFM - minFM);
    $('frequency').textContent = tuneFrequency.toFixed(1);
    $('needle').style.left = `${ratio * 100}%`;
    $('tuneKnob').style.setProperty('--turn', `${-135 + ratio * 270}deg`);
    $('tuneKnob').setAttribute('aria-valuenow', tuneFrequency.toFixed(1));
    const match = stations.find(s => Math.abs(s.frequency - tuneFrequency) < .05);
    $('stationTitle').textContent = match ? match.title.toUpperCase() : 'TUNING…';
    $('tuneKnob').setAttribute('aria-valuetext', `${tuneFrequency.toFixed(1)} FM, ${match ? match.title : 'no station'}`);
    wake();
  }
  function settleFrequency() {
    clearTimeout(tuneTimer);
    const closest = stations.reduce((a, s, i) => Math.abs(s.frequency - tuneFrequency) < Math.abs(stations[a].frequency - tuneFrequency) ? i : a, 0);
    if (closest !== selected) selectStation(closest);
    else previewFrequency(stations[selected].frequency);
    $('radioNote').textContent = `${stations[selected].frequency.toFixed(1)} FM · ${stations[selected].title}${stations.length === 1 ? ' · Only station tonight' : ''}`;
  }
  function renderProgram() {
    const entries = $('programEntries'); entries.replaceChildren();
    stations.slice(page * pageSize, (page + 1) * pageSize).forEach(s => {
      const b = document.createElement('button'); b.className = `program-entry${s.id === stations[selected].id ? ' selected' : ''}`;
      b.dataset.station = s.id; b.setAttribute('aria-current', String(s.id === stations[selected].id));
      const f = document.createElement('span'), title = document.createElement('strong'), icon = document.createElement('span');
      f.textContent = s.frequency.toFixed(1); title.textContent = s.title; icon.textContent = '▶'; icon.setAttribute('aria-hidden', 'true');
      b.append(f, title, icon); b.addEventListener('click', () => { selectStation(stations.indexOf(s)); play(); }); entries.append(b);
    });
    const total = Math.ceil(stations.length / pageSize);
    $('pageNumber').textContent = `${page + 1} / ${total}`;
    $('pagePrev').disabled = page === 0; $('pageNext').disabled = page >= total - 1;
    $('programCount').textContent = `${stations.length} VIDEO${stations.length === 1 ? '' : 'S'} · ENJOY THE SHOW`;
    $('previous').disabled = selected === 0; $('next').disabled = selected === stations.length - 1;
  }
  function selectStation(index) {
    if (index < 0 || index >= stations.length) return;
    const changed = index !== selected; selected = index; const s = stations[selected];
    if (changed) {
      film.pause(); film.removeAttribute('src'); film.load(); started = false;
      film.poster = s.poster; $('welcome').hidden = false; $('error').hidden = true;
      $('welcome').querySelector('h1').textContent = s.title;
      $('start').setAttribute('aria-label', `Play ${s.title}`);
      movie.setAttribute('aria-label', `${s.title} video player`); film.setAttribute('aria-label', `${s.title} — Visual Story`);
      document.querySelector('.film-title').textContent = s.title;
      document.title = `2FLY Drive-In · ${s.title}`;
    }
    $('sourceLink').href = s.src; previewFrequency(s.frequency); renderProgram();
    $('radioNote').textContent = `${s.frequency.toFixed(1)} FM · ${s.title}`;
  }
  async function play() {
    $('error').hidden = true;
    if (!started) { film.src = stations[selected].src; started = true; }
    if (film.ended) film.currentTime = 0;
    announce('Threading the film…', true);
    try { await film.play(); }
    catch (error) {
      if (error.name === 'AbortError') return;
      if (error.name === 'NotAllowedError') announce('Press play to start the film.');
      else showError();
    }
  }
  function togglePlay() { film.paused ? play() : film.pause(); }
  function showError() { announce(''); $('error').hidden = false; $('welcome').hidden = true; scene.classList.remove('playing', 'idle'); }
  function setTheater(enabled) {
    scene.classList.toggle('theater', enabled); $('theater').setAttribute('aria-pressed', String(enabled));
    $('theater').innerHTML = enabled ? 'Exit theater <span aria-hidden="true">×</span>' : 'Theater mode <span aria-hidden="true">⛶</span>';
    $('program').inert = enabled; wake();
  }
  function bindKnob(id, {get, set, min, max, step, commit}) {
    const knob = $(id); let drag = null;
    knob.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      drag = { y: e.clientY, x: e.clientX, value: get() }; knob.setPointerCapture(e.pointerId); knob.focus(); e.preventDefault(); wake();
    });
    knob.addEventListener('pointermove', e => {
      if (!drag) return;
      set(clamp(drag.value + ((drag.y - e.clientY) + (e.clientX - drag.x)) * (max - min) / 180, min, max));
    });
    const end = () => { if (!drag) return; drag = null; if (commit) commit(); };
    knob.addEventListener('pointerup', end); knob.addEventListener('pointercancel', end); knob.addEventListener('lostpointercapture', end);
    knob.addEventListener('keydown', e => {
      const delta = {ArrowUp: step, ArrowRight: step, ArrowDown: -step, ArrowLeft: -step, PageUp: step * 10, PageDown: -step * 10}[e.key];
      if (delta === undefined && e.key !== 'Home' && e.key !== 'End') return;
      e.preventDefault(); set(e.key === 'Home' ? min : e.key === 'End' ? max : get() + delta);
      if (commit) { clearTimeout(tuneTimer); tuneTimer = setTimeout(commit, 450); }
    });
  }
  $('start').onclick = play; $('play').onclick = togglePlay; $('radioPlay').onclick = togglePlay;
  $('retry').onclick = () => { started = false; play(); };
  $('volume').oninput = e => setVolume(Number(e.target.value));
  $('mute').onclick = () => { if (!film.volume) film.volume = .75; film.muted = !film.muted; syncVolume(); wake(); };
  $('seek').oninput = e => { if (Number.isFinite(film.duration)) film.currentTime = Number(e.target.value) / 100 * film.duration; wake(); };
  $('theater').onclick = () => setTheater(!scene.classList.contains('theater'));
  $('programToggle').onclick = () => { const open = $('program').classList.toggle('open'); $('programToggle').setAttribute('aria-expanded', String(open)); $('programToggle').querySelector('span').textContent = open ? '−' : '＋'; };
  $('previous').onclick = () => { selectStation(selected - 1); play(); };
  $('next').onclick = () => { selectStation(selected + 1); play(); };
  const turnPage = direction => {
    page = clamp(page + direction, 0, Math.ceil(stations.length / pageSize) - 1); renderProgram();
    $('programEntries').classList.remove('shuffle'); requestAnimationFrame(() => $('programEntries').classList.add('shuffle'));
  };
  $('pagePrev').onclick = () => turnPage(-1); $('pageNext').onclick = () => turnPage(1);
  $('fullscreen').onclick = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (movie.requestFullscreen) await movie.requestFullscreen();
      else if (film.webkitEnterFullscreen) film.webkitEnterFullscreen();
      else { setTheater(true); announce('Theater mode is available on this browser.'); }
    } catch { announce('Fullscreen unavailable. Try Theater mode.'); }
  };
  document.addEventListener('fullscreenchange', () => $('fullscreen').setAttribute('aria-label', document.fullscreenElement ? 'Exit fullscreen' : 'Enter fullscreen'));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && scene.classList.contains('theater')) setTheater(false);
    if (e.target !== movie) return;
    if (e.key === ' ' || e.key.toLowerCase() === 'k') { e.preventDefault(); togglePlay(); }
    if (e.key.toLowerCase() === 'm') $('mute').click();
    if (e.key.toLowerCase() === 'f') $('fullscreen').click();
    if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && Number.isFinite(film.duration)) { e.preventDefault(); film.currentTime = clamp(film.currentTime + (e.key === 'ArrowRight' ? 5 : -5), 0, film.duration); wake(); }
  });
  ['pointermove', 'pointerdown', 'focusin', 'keydown'].forEach(type => scene.addEventListener(type, wake, {passive: true}));
  film.addEventListener('play', () => {
    // Local handoff also works in browsers without BroadcastChannel.
    document.querySelectorAll('audio,video').forEach(other => { if (other !== film && other !== $('exteriorLoop')) other.pause(); });
      $('welcome').hidden = true; scene.classList.add('playing', 'has-started'); $('play').textContent = 'Ⅱ'; $('play').setAttribute('aria-label', 'Pause video');
    $('radioPlay').textContent = 'PAUSE'; $('radioPlay').setAttribute('aria-label', 'Pause video'); wake();
  });
  film.addEventListener('playing', () => announce(''));
  film.addEventListener('pause', () => { scene.classList.remove('playing', 'idle'); $('play').textContent = '▶'; $('play').setAttribute('aria-label', 'Play video'); $('radioPlay').textContent = 'PLAY'; $('radioPlay').setAttribute('aria-label', 'Play video'); if (started && !film.ended && !film.error) announce('Paused'); });
  film.addEventListener('waiting', () => { if (started && !film.paused) announce('Buffering the film…', true); });
  film.addEventListener('ended', () => { $('welcome').hidden = false; $('start').innerHTML = '<span aria-hidden="true">↻</span> Watch again'; announce('Thanks for spending the night with 2FLY.'); });
  film.addEventListener('error', showError);
  film.addEventListener('volumechange', syncVolume);
  const progress = () => { const valid = Number.isFinite(film.duration) && film.duration > 0; $('seek').disabled = !valid; $('seek').value = valid ? film.currentTime / film.duration * 100 : 0; $('seek').setAttribute('aria-valuetext', `${format(film.currentTime)} of ${format(film.duration)}`); $('time').textContent = `${format(film.currentTime)} / ${format(film.duration)}`; };
  film.addEventListener('timeupdate', progress); film.addEventListener('durationchange', progress);
  bindKnob('volumeKnob', {get: () => film.volume * 100, set: setVolume, min: 0, max: 100, step: 5});
  bindKnob('tuneKnob', {get: () => tuneFrequency, set: previewFrequency, min: minFM, max: maxFM, step: .2, commit: settleFrequency});
  // Set data-src on #exteriorLoop to install a matching silent loop; still stays underneath.
  const loop = $('exteriorLoop'), reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function syncLoop() {
    document.body.classList.toggle('hidden-page', document.hidden);
    if (document.hidden || reduced.matches) { loop.pause(); loop.hidden = true; return; }
    if (loop.dataset.src) { if (!loop.getAttribute('src')) loop.src = loop.dataset.src; loop.play().then(() => loop.hidden = false).catch(() => loop.hidden = true); }
  }
  loop.addEventListener('error', () => { loop.hidden = true; });
  document.addEventListener('visibilitychange', syncLoop); reduced.addEventListener('change', syncLoop);
  window.addEventListener('pagehide', () => { film.pause(); loop.pause(); clearTimeout(tuneTimer); clearTimeout(idleTimer); clearTimeout(statusTimer); });
  setVolume(75); selectStation(0); syncLoop();
})();
