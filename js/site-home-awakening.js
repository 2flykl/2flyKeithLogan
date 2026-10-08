// Keep the approved entrance isolated from the music/gallery styles and their globals.
(function () {
  function syncEntrance() {
    const routeName = window.SiteNavigation?.current() || (location.hash || '#home').slice(1).split('?')[0];
    document.documentElement.classList.toggle('cinematic-home', routeName === 'home');
  }
  // Fit the embedded HUD content so the page has one scrollbar, including on phones.
  window.addEventListener('message', event => {
    const frame = document.querySelector('.home-awakening-frame');
    if (!frame || event.source !== frame.contentWindow || event.origin !== location.origin) return;
    if (event.data?.type === 'awakening-height' && Number.isFinite(event.data.height)) {
      frame.style.height = `${Math.max(200, Math.min(4000, event.data.height))}px`;
    }
  });
  syncEntrance();
  window.addEventListener('hashchange', syncEntrance);
  renderHome = function () {
    document.documentElement.classList.add('cinematic-home');
    const frame = document.createElement('iframe');
    frame.className = 'home-awakening-frame';
    frame.title = 'The Choice — enter the world of 2Fly Keith Logan';
    frame.src = 'awakening/index.html';
    frame.allow = 'autoplay';
    const footer = document.createElement('footer');
    footer.className = 'home-awakening-footer';
    footer.innerHTML = helpModule();
    document.getElementById('appView').replaceChildren(frame, footer);
  };
})();
