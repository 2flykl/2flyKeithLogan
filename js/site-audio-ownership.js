// Coordinate the existing site player with Ride with 2FLY, including other tabs.
(() => {
  if (!('BroadcastChannel' in window)) return;
  const channel = new BroadcastChannel('2fly-audio-owner');
  const owner = `site-${Math.random().toString(36).slice(2)}`;
  let lastAudioClaim = 0;
  channel.onmessage = ({ data }) => {
    if (data?.type !== 'claim' || data.owner === owner || (data.at || 0) < lastAudioClaim) return;
    document.querySelectorAll('audio,video').forEach(el => { if (!el.muted) el.pause(); });
  };
  document.addEventListener('play', event => {
    const el = event.target;
    if (!(el instanceof HTMLMediaElement) || el.muted) return;
    document.querySelectorAll('audio,video').forEach(other => { if (other !== el && !other.muted) other.pause(); });
    lastAudioClaim = Date.now();
    channel.postMessage({ type: 'claim', owner, at: lastAudioClaim });
  }, true);
})();
