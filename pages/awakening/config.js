// Same-origin integration with the live site's hash router.
window.CHOICE_CONFIG = {
  enterUrl: '../site-overhaul.html#featured',
  exitUrl: '',
  returnToReferrer: true,
  introVideo: '',
  navigate: url => (window.parent === window ? window : window.parent).location.assign(url),
  getReferrer: () => window.parent === window ? document.referrer : window.parent.document.referrer
};
