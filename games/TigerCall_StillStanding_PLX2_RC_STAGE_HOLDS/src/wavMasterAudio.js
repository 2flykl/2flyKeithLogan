
(() => {
  'use strict';
  const WAV_URL = 'assets/TigerCall_RhythmSource_Clean/MASTER/TigerCallTigerHeart_PLXMaster_LIVE.wav?v=20260823-soundfirst2';

  let ctx = null;
  let buffer = null;
  let gain = null;
  let source = null;
  let loading = null;
  let backend = 'none';
  let playing = false;
  let pausedAt = 0;
  let startCtx = 0;
  let startSong = 0;
  let htmlAudio = null;

  async function ensureContext() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      gain = ctx.createGain();
      gain.gain.value = 1.0;
      gain.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') await ctx.resume();
  }

  async function preload() {
    if (buffer) return buffer;
    if (loading) return loading;
    loading = (async () => {
      await ensureContext();
      const response = await fetch(WAV_URL, {cache:'no-store'});
      if (!response.ok) throw new Error('WAV HTTP ' + response.status);
      const bytes = await response.arrayBuffer();
      buffer = await ctx.decodeAudioData(bytes);
      return buffer;
    })();
    try {
      return await loading;
    } finally {
      loading = null;
    }
  }

  function clearSource() {
    if (!source) return;
    try { source.stop(); } catch(e) {}
    try { source.disconnect(); } catch(e) {}
    source = null;
  }

  function bufferStart(offset) {
    clearSource();
    source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(gain);
    startSong = Math.max(0, offset || 0);
    startCtx = ctx.currentTime;
    playing = true;
    backend = 'webaudio';
    source.onended = () => {
      if (playing && currentTime() >= duration() - 0.05) {
        playing = false;
        window.dispatchEvent(new Event('tigerwavended'));
      }
    };
    source.start(0, startSong);
  }

  async function play(offset = 0) {
    // Primary: WebAudio decode/play of the exact WAV.
    try {
      await ensureContext();
      await preload();
      bufferStart(offset);
      if (htmlAudio) {
        htmlAudio.pause();
        try { htmlAudio.currentTime = 0; } catch(e) {}
      }
      window.dispatchEvent(new CustomEvent('tigerwavplaying', {detail:{backend}}));
      return;
    } catch (err) {
      console.warn('Primary WAV engine failed, trying HTMLAudio fallback', err);
    }

    // Fallback: same exact WAV through <audio>.
    htmlAudio = htmlAudio || document.getElementById('gameplayAudio');
    if (!htmlAudio) throw new Error('No WAV playback backend available');
    htmlAudio.src = WAV_URL;
    htmlAudio.volume = 1;
    htmlAudio.currentTime = offset;
    await htmlAudio.play();
    playing = true;
    backend = 'htmlaudio';
    window.dispatchEvent(new CustomEvent('tigerwavplaying', {detail:{backend}}));
  }

  function pause() {
    pausedAt = currentTime();
    if (backend === 'webaudio') clearSource();
    if (backend === 'htmlaudio' && htmlAudio) htmlAudio.pause();
    playing = false;
  }

  function stop() {
    if (backend === 'webaudio') clearSource();
    if (htmlAudio) {
      htmlAudio.pause();
      try { htmlAudio.currentTime = 0; } catch(e) {}
    }
    playing = false;
    pausedAt = 0;
    startSong = 0;
  }

  function currentTime() {
    if (backend === 'webaudio' && playing && ctx) {
      return Math.min(duration(), startSong + (ctx.currentTime - startCtx));
    }
    if (backend === 'htmlaudio' && htmlAudio) return htmlAudio.currentTime || 0;
    return pausedAt || 0;
  }

  function duration() {
    if (buffer) return buffer.duration;
    if (htmlAudio && Number.isFinite(htmlAudio.duration)) return htmlAudio.duration;
    return 0;
  }

  window.TigerWavMaster = {
    url: WAV_URL, preload, play, pause, stop, currentTime, duration,
    isPlaying: () => playing,
    backend: () => backend
  };

  window.addEventListener('DOMContentLoaded', () => {
    htmlAudio = document.getElementById('gameplayAudio');
    preload().catch(err => console.warn('WAV preload:', err));
  });
})();
