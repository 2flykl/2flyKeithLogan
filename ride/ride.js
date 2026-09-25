/* One audio element, one independent road clock. No generated voice or substitute songs. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const media = window.RIDE_MEDIA;
  const audio = $('rideAudio');
  window.RIDE_ROUTE='city';
  document.querySelectorAll('[data-ride]').forEach(button=>button.addEventListener('click',()=>{
    if(started)return;window.RIDE_ROUTE=button.dataset.ride;document.body.dataset.route=window.RIDE_ROUTE;
    document.querySelectorAll('[data-ride]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    $('rideInvitation').textContent=window.RIDE_ROUTE==='sky'?'Above the clouds. Deep in the groove.':window.RIDE_ROUTE==='real'?'Golden hour. Windows to another world.':`${media.tracks.length} records. Your seat is saved.`;
    document.querySelector('.location').textContent=window.RIDE_ROUTE==='sky'?'SKY SESSION · NO CEILING':window.RIDE_ROUTE==='real'?'REAL WORLD VIEW · GOLDEN HOUR':'YOUNGSTOWN, OHIO';
    syncEnvironment();
  }));
  const tracks = media.tracks;
  if (new URLSearchParams(location.search).get('from') === 'site') document.querySelector('.brand').href = '../pages/site-overhaul.html#music';
  const owner = `ride-${Math.random().toString(36).slice(2)}`;
  const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('2fly-audio-owner') : null;
  let lastAudioClaim = 0;
  let started = false, index = 0, volume = 65, lastVolume = 65, shuffled = false;
  let order = tracks.map((_, i) => i), cursor = 0, switching = 0, transitionTimer;
  let context, filters, gain, preGain, transitionGain, analyser, bins;
  let reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function syncEnvironment() { window.dispatchEvent(new CustomEvent('ride-state', { detail: { started, reduced } })); }
  try { const saved = localStorage.getItem('2fly-ride-motion'); if (saved !== null) reduced = saved === 'reduced'; } catch {}
  const format = time => `${Math.floor((time || 0) / 60)}:${String(Math.floor((time || 0) % 60)).padStart(2, '0')}`;
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const announce = text => { $('status').textContent = text; };
  const smooth = (param, value, seconds = .09) => {
    if (!context) return;
    param.cancelScheduledValues(context.currentTime);
    param.setTargetAtTime(value, context.currentTime, seconds);
  };
  function initAudio() {
    if (context) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) { audio.volume = volume / 100; announce('STANDARD AUDIO · EQ UNAVAILABLE'); return; }
    context = new AudioCtx();
    const source = context.createMediaElementSource(audio);
    preGain = context.createGain(); preGain.gain.value = .8;
    filters = ['lows', 'mids', 'highs'].map((name, i) => {
      const node = context.createBiquadFilter();
      node.type = ['lowshelf', 'peaking', 'highshelf'][i];
      node.frequency.value = [160, 1100, 5000][i]; node.Q.value = .7;
      return node;
    });
    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -5; compressor.knee.value = 10; compressor.ratio.value = 8;
    compressor.attack.value = .003; compressor.release.value = .15;
    transitionGain = context.createGain();
    gain = context.createGain(); gain.gain.value = volume / 100;
    analyser = context.createAnalyser(); analyser.fftSize = 128; analyser.smoothingTimeConstant = .85;
    bins = new Uint8Array(analyser.frequencyBinCount);
    source.connect(preGain).connect(filters[0]).connect(filters[1]).connect(filters[2]).connect(compressor).connect(transitionGain).connect(gain).connect(analyser).connect(context.destination);
    audio.volume = 1;
    updateEQ();
  }
  function claimAudio() {
    lastAudioClaim = Date.now();
    channel?.postMessage({ type: 'claim', owner, at: lastAudioClaim });
    document.querySelectorAll('audio,video').forEach(el => { if (el !== audio && !el.muted) el.pause(); });
  }
  channel?.addEventListener('message', event => {
    if (event.data?.type === 'claim' && event.data.owner !== owner && (event.data.at || 0) >= lastAudioClaim) { switching++; clearTimeout(transitionTimer); audio.pause(); announce('PAUSED · OTHER PLAYER ACTIVE'); }
  });
  document.addEventListener('play', event => {
    const el = event.target;
    if (el instanceof HTMLMediaElement && el !== audio && !el.muted) audio.pause();
  }, true);
  function refreshTrack() {
    const track = tracks[index];
    $('title').textContent = track.title; $('saverTitle').textContent = track.title;
    $('trackNumber').textContent = `${String(index + 1).padStart(2, '0')} / ${String(tracks.length).padStart(2, '0')}`;
    for (const id of ['artwork', 'saverArt']) {
      const el = $(id); el.hidden = !track.artwork;
      if (track.artwork) { el.src = track.artwork; el.alt = `${track.title} cover artwork`; } else el.removeAttribute('src');
    }
    $('artMissing').hidden = !!track.artwork;
    $('artwork').onerror = () => { $('artwork').hidden = true; $('artMissing').hidden = false; };
    $('seek').value = 0; $('elapsed').textContent = '0:00'; $('duration').textContent = '0:00';
    document.querySelectorAll('[data-track]').forEach(b => { b.classList.toggle('active', Number(b.dataset.track) === index); b.setAttribute('aria-current', Number(b.dataset.track) === index ? 'true' : 'false'); });
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({ title: track.title, artist: '2Fly Keith Logan', album: track.album || 'Ride with 2FLY', artwork: track.artwork ? [{ src: new URL(track.artwork, location.href).href }] : [] });
    }
  }
  async function playCurrent(token = switching) {
    try {
      initAudio(); await context?.resume();
      if (token !== switching || !started) return;
      claimAudio();
      await audio.play();
      if (!started) { audio.pause(); return; }
      if (token !== switching) return;
      if (transitionGain) smooth(transitionGain.gain, 1, .06);
      announce('NOW PLAYING');
    } catch (error) {
      if (token !== switching || error.name === 'AbortError') return;
      announce(error.name === 'NotAllowedError' ? 'TAP PLAY TO CONTINUE' : `UNABLE TO PLAY ${tracks[index].title.toUpperCase()}`);
    }
  }
  function selectTrack(nextIndex, autoplay = !audio.paused) {
    const token = ++switching; clearTimeout(transitionTimer);
    const fade = !audio.paused && !!transitionGain;
    if (fade) smooth(transitionGain.gain, 0, .025);
    const swap = () => {
      if (token !== switching) return;
      audio.pause(); index = nextIndex; cursor = order.indexOf(index);
      audio.src = tracks[index].audio; audio.load(); refreshTrack();
      if (transitionGain) transitionGain.gain.setValueAtTime(autoplay ? 0 : 1, context.currentTime);
      announce(autoplay ? 'LOADING' : 'PAUSED');
      if (autoplay) void playCurrent(token);
    };
    if (fade) transitionTimer = setTimeout(swap, 110); else swap();
  }
  function next(delta) {
    const target = (cursor + delta + order.length) % order.length;
    selectTrack(order[target], !audio.paused || audio.ended);
  }
  async function togglePlay() {
    if (!started) return startRide();
    if (audio.paused) await playCurrent();
    else { switching++; clearTimeout(transitionTimer); audio.pause(); announce('PAUSED'); }
  }
  function setVolume(value) {
    volume = clamp(Math.round(value), 0, 100);
    if (gain) smooth(gain.gain, volume / 100); else audio.volume = volume / 100;
    $('volumeKnob').setAttribute('aria-valuenow', volume);
    $('volumeKnob').setAttribute('aria-valuetext', `${volume} percent`);
    $('volumeKnob').style.setProperty('--angle', `${-135 + volume * 2.7}deg`);
    $('volumeReadout').textContent = `VOL ${String(volume).padStart(2, '0')}`;
    $('volumeSmall').textContent = `${volume}%`;
    $('mute').setAttribute('aria-pressed', String(volume === 0));
    $('mute').setAttribute('aria-label', volume === 0 ? 'Unmute' : 'Mute');
  }
  function showView(name) {
    for (const mode of ['home', 'saver', 'sound', 'queue']) $(mode + 'View').hidden = mode !== name;
    $('queueButton').setAttribute('aria-expanded', String(name === 'queue'));
    document.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === name)));
  }
  const presets = { Original: [0, 0, 0], 'Car Cabin': [1.5, -.5, -1.5], 'Performance Bass': [3, -.5, 1] };
  function updateEQ() {
    const levels = ['lows', 'mids', 'highs'].map(id => +$(id).value);
    levels.forEach((level, i) => {
      const id = ['lows', 'mids', 'highs'][i];
      $(id).nextElementSibling.textContent = `${level > 0 ? '+' : ''}${level} dB`;
      if (filters) smooth(filters[i].gain, level, .12);
    });
    // Compensate for the worst-case cumulative positive filter gain BEFORE EQ.
    // The compressor is a final safety stage, not a substitute for headroom.
    if (preGain) smooth(preGain.gain, .8 * Math.pow(10, -levels.reduce((sum, db) => sum + Math.max(0, db), 0) / 20), .07);
  }
  function applyPreset(name) {
    presets[name].forEach((v, i) => { $(['lows', 'mids', 'highs'][i]).value = v; });
    $('presetName').textContent = name;
    document.querySelectorAll('[data-preset]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.preset === name)));
    updateEQ();
  }
  function rotary(el, min, max, initial, update) {
    let value = initial, drag;
    function set(v) { value = clamp(Math.round(v), min, max); el.setAttribute('aria-valuenow', value); el.style.setProperty('--angle', `${-135 + (value - min) / (max - min) * 270}deg`); update(value); }
    el.addEventListener('pointerdown', e => { if (e.button !== 0) return; value = +el.getAttribute('aria-valuenow'); drag = { x: e.clientX, y: e.clientY, value }; el.setPointerCapture(e.pointerId); el.focus(); e.preventDefault(); });
    el.addEventListener('pointermove', e => { if (drag) set(drag.value + ((drag.y - e.clientY) + (e.clientX - drag.x)) * (max - min) / 160); });
    const finish = () => { drag = null; }; el.addEventListener('pointerup', finish); el.addEventListener('pointercancel', finish); el.addEventListener('lostpointercapture', finish);
    el.addEventListener('keydown', e => {
      value = +el.getAttribute('aria-valuenow');
      const step = e.shiftKey ? 5 : 1;
      const keys = { ArrowUp: value + step, ArrowRight: value + step, ArrowDown: value - step, ArrowLeft: value - step, PageUp: value + 10, PageDown: value - 10, Home: min, End: max };
      if (e.key in keys) { e.preventDefault(); set(keys[e.key]); }
    });
    set(initial);
  }
  const videos = [$('roadA'), $('roadB')];
  let roadIndex = 0, activeVideo = 0, roadChanging = false, roadToken = 0;
  function prepareRoad(v, i) {
    const clip = media.roads[i]; if (!clip) return;
    v.src = clip.src; v.muted = true; v.style.objectPosition = clip.position || '50% 50%';
    if (media.roadPoster) v.poster = media.roadPoster;
    v.load();
  }
  async function runRoad() {
    if (media.environment?.mode !== 'video') return;
    if (!media.roads.length || reduced || !started) return;
    const v = videos[activeVideo];
    try { await v.play(); $('roadNotice').hidden = true; v.classList.add('active'); }
    catch { $('roadNotice').hidden = false; $('roadNotice').textContent = 'Road video could not start. The music can keep playing.'; }
  }
  async function advanceRoad() {
    if (roadChanging || !started || reduced || !media.roads.length) return;
    roadChanging = true;
    const token = ++roadToken;
    const old = videos[activeVideo], nextSlot = 1 - activeVideo;
    const nextIndex = (roadIndex + 1) % media.roads.length, incoming = videos[nextSlot];
    prepareRoad(incoming, nextIndex);
    try {
      await incoming.play();
      if (token !== roadToken || !started || reduced) { incoming.pause(); roadChanging = false; return; }
      incoming.classList.add('active'); old.classList.remove('active');
      activeVideo = nextSlot; roadIndex = nextIndex;
      setTimeout(() => { if (token === roadToken) { old.pause(); roadChanging = false; } }, 1550);
    } catch { roadChanging = false; $('roadNotice').hidden = false; $('roadNotice').textContent = 'A road clip is unavailable. Music playback is unaffected.'; }
  }
  videos.forEach(v => {
    v.addEventListener('timeupdate', () => { if (v === videos[activeVideo] && Number.isFinite(v.duration) && v.duration > 2 && v.duration - v.currentTime < 1.6) void advanceRoad(); });
    v.addEventListener('ended', () => { if (v === videos[activeVideo]) void advanceRoad(); });
    v.addEventListener('error', () => { $('roadNotice').hidden = false; $('roadNotice').textContent = 'Road footage is unavailable. Your music is ready.'; });
  });
  if (media.roads.length) prepareRoad(videos[0], 0);
  if (media.roadPoster) $('windshield')?.style.setProperty('background-image', `url("${media.roadPoster}")`);
  function setReduced(value) {
    reduced = value; document.body.classList.toggle('reduced', value);
    $('motion').setAttribute('aria-pressed', String(value)); $('motion').querySelector('span').textContent = value ? 'ON' : 'OFF';
    try { localStorage.setItem('2fly-ride-motion', value ? 'reduced' : 'full'); } catch {}
    if (value) { roadToken++; roadChanging = false; videos.forEach(v => v.pause()); }
    else void runRoad();
    syncEnvironment();
  }
  async function startRide() {
    if (started) return;
    started = true; document.body.classList.add('started'); $('startGate').hidden = true;
    document.querySelector('.console').inert = false; document.querySelector('.climate').inert = false;
    initAudio(); void context?.resume();
    order = tracks.map((_, i) => i); cursor = 0; shuffled = false; $('shuffle').setAttribute('aria-pressed', 'false'); $('modeLabel').textContent = 'IN ORDER';
    selectTrack(0, true); void runRoad(); $('play').focus();
    syncEnvironment();
  }
  function endRide() {
    started = false; switching++; clearTimeout(transitionTimer); roadToken++; roadChanging = false;
    audio.pause(); audio.currentTime = 0; videos.forEach(v => v.pause());
    document.body.classList.remove('started'); $('startGate').hidden = false;
    document.querySelector('.console').inert = true; document.querySelector('.climate').inert = true;
    showView('home'); $('start').focus();
    syncEnvironment();
  }
  $('start').onclick = startRide; $('play').onclick = togglePlay; $('endRide').onclick = endRide;
  $('previous').onclick = () => next(-1); $('next').onclick = () => next(1);
  $('volumeUp').onclick = () => setVolume(volume + 5); $('volumeDown').onclick = () => setVolume(volume - 5);
  $('mute').onclick = () => { if (volume) { lastVolume = volume; setVolume(0); } else setVolume(lastVolume || 65); };
  $('motion').onclick = () => setReduced(!reduced);
  $('queueButton').onclick = () => showView($('queueView').hidden ? 'queue' : 'home');
  $('shuffle').onclick = () => {
    shuffled = !shuffled;
    if (shuffled) {
      const rest = tracks.map((_, i) => i).filter(i => i !== index);
      for (let i = rest.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [rest[i], rest[j]] = [rest[j], rest[i]]; }
      order = [index, ...rest]; cursor = 0;
    } else { order = tracks.map((_, i) => i); cursor = index; }
    $('shuffle').setAttribute('aria-pressed', String(shuffled)); $('modeLabel').textContent = shuffled ? 'SHUFFLE ON' : 'IN ORDER';
  };
  document.querySelectorAll('[data-view]').forEach(b => { b.onclick = () => showView(b.dataset.view); });
  document.querySelectorAll('[data-preset]').forEach(b => { b.onclick = () => applyPreset(b.dataset.preset); });
  ['lows', 'mids', 'highs'].forEach(id => { $(id).oninput = () => { $('presetName').textContent = 'Custom'; document.querySelectorAll('[data-preset]').forEach(b => b.setAttribute('aria-pressed', 'false')); updateEQ(); }; });
  tracks.forEach((track, i) => {
    if (i === 0 || track.album !== tracks[i - 1].album) {
      const heading = document.createElement('div'); heading.className = 'queue-album';
      heading.textContent = track.album || 'Ride with 2FLY'; $('queueView').append(heading);
    }
    const b = document.createElement('button'); b.dataset.track = i;
    const n = document.createElement('span'); n.textContent = String(i + 1).padStart(2, '0'); b.append(n);
    if (track.artwork) { const img = document.createElement('img'); img.src = track.artwork; img.alt = ''; b.append(img); }
    b.append(document.createTextNode(track.title)); b.onclick = () => { selectTrack(i, !audio.paused); showView('home'); }; $('queueView').append(b);
  });
  $('seek').oninput = () => { if (Number.isFinite(audio.duration)) { audio.currentTime = +$('seek').value / 100 * audio.duration; $('elapsed').textContent = format(audio.currentTime); } };
  audio.addEventListener('timeupdate', () => { if (Number.isFinite(audio.duration)) { $('seek').value = audio.currentTime / audio.duration * 100; $('elapsed').textContent = format(audio.currentTime); $('seek').setAttribute('aria-valuetext', `${format(audio.currentTime)} of ${format(audio.duration)}`); } });
  audio.addEventListener('loadedmetadata', () => { $('duration').textContent = format(audio.duration); });
  audio.addEventListener('play', () => { $('play').textContent = 'Ⅱ'; $('play').setAttribute('aria-label', 'Pause'); });
  audio.addEventListener('pause', () => { $('play').textContent = '▶'; $('play').setAttribute('aria-label', 'Play'); });
  audio.addEventListener('ended', () => next(1));
  audio.addEventListener('error', () => announce(`MISSING AUDIO: ${tracks[index].audio}`));
  rotary($('volumeKnob'), 0, 100, volume, setVolume);
  ['Left', 'Right'].forEach(side => rotary($('climate' + side), 60, 85, 72, v => {
    $('temp' + side).textContent = `${v}°`; $('climate' + side).setAttribute('aria-valuetext', `${v} degrees Fahrenheit`);
    $('climateFeedback').textContent = v < 70 ? 'AUTO · COOLING' : v > 74 ? 'AUTO · WARMING' : 'AUTO · COMFORT';
    $('temp' + side).style.color = v < 70 ? '#9edcff' : v > 74 ? '#ffad62' : '#ffbf55';
  }));
  const canvas = $('meter'), ctx = canvas.getContext('2d');
  let lastFrame = 0;
  function frame(ms) {
    requestAnimationFrame(frame);
    if (document.hidden || ms - lastFrame < (reduced ? 250 : 45)) return;
    lastFrame = ms;
    if (started && !reduced && media.environment?.mode === 'video' && media.roads.length && !videos[activeVideo].paused) {
      const t = ms / 1000;
      $('scene').style.setProperty('--sway-y', `${Math.sin(t * 2.13) * .5 + Math.sin(t * 5.19) * .18}px`);
      $('scene').style.setProperty('--sway-x', `${Math.sin(t * .73) * .35}px`);
      if (media.environment?.mode === 'video') {
        $('scene').style.setProperty('--daylight', .08 + (Math.sin(t * .31) + Math.sin(t * .17)) * .027);
        $('scene').style.setProperty('--reflection', Math.max(0, Math.sin(t * .37) * Math.sin(t * .81)) * .17);
        $('scene').style.setProperty('--reflect-x', `${Math.sin(t * .23) * 130}px`);
      }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (analyser && !audio.paused && !reduced) analyser.getByteFrequencyData(bins);
    for (let i = 0; i < 26; i++) {
      const height = analyser && !audio.paused && !reduced ? Math.max(2, bins[i * 2] / 255 * 44) : 2;
      ctx.fillStyle = i > 21 ? '#f1d6a1' : '#d3a862'; ctx.fillRect(i * 10, 46 - height, 5, height);
    }
  }
  if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', () => { if (started) void playCurrent(); });
    navigator.mediaSession.setActionHandler('pause', () => { switching++; clearTimeout(transitionTimer); audio.pause(); });
    navigator.mediaSession.setActionHandler('nexttrack', () => next(1));
    navigator.mediaSession.setActionHandler('previoustrack', () => next(-1));
    navigator.mediaSession.setActionHandler('seekto', e => { if (Number.isFinite(audio.duration)) audio.currentTime = clamp(e.seekTime, 0, audio.duration); });
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) videos.forEach(v => v.pause()); else void runRoad(); });
  window.addEventListener('pagehide', () => { audio.pause(); videos.forEach(v => v.pause()); });
  document.querySelector('.console').inert = true; document.querySelector('.climate').inert = true;
  setReduced(reduced); refreshTrack(); showView('home'); requestAnimationFrame(frame);
})();
