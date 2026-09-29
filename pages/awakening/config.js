// Same-origin integration with the live site's hash router.
window.CHOICE_CONFIG = {
  enterUrl: '../site-overhaul.html#featured',
  exitUrl: '',
  returnToReferrer: true,
  introVideo: '',
  navigate: url => (window.parent === window ? window : window.parent).location.assign(url),
  getReferrer: () => window.parent === window ? document.referrer : window.parent.document.referrer
};

if (window.parent !== window) {
  document.documentElement.classList.add('embedded-home');
  window.addEventListener('DOMContentLoaded', () => {
    const stage = document.getElementById('stage');
    const destination = document.getElementById('destination');
    const reportHeight = () => {
      const height = Math.ceil(document.getElementById('experience').hidden
        ? destination.getBoundingClientRect().height : stage.getBoundingClientRect().height);
      window.parent.postMessage({type: 'awakening-height', height}, location.origin);
    };
    const observer = new ResizeObserver(reportHeight);
    observer.observe(stage);
    observer.observe(destination);
    reportHeight();
  });
}
