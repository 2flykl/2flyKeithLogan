/* 2Fly Public Preview loader — preserves the release layer and adds Music Option 2. */
(() => {
  'use strict';
  const asset = path => typeof resolveAssetUrl === 'function' ? resolveAssetUrl(path) : path;
  const load = src => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = asset(src);
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Could not load ${src}`));
    document.body.appendChild(script);
  });
  load('js/public-preview-core.js?v=5.0.1')
    .then(() => load('js/music-v2-live.js?v=2.2.0'))
    .catch(error => console.warn('2Fly preview extension warning:', error));
})();