// Keep the approved entrance isolated from the music/gallery styles and their globals.
(function () {
  function syncEntrance() {
    const routeName = (location.hash || '#home').slice(1).split('?')[0];
    document.documentElement.classList.toggle('cinematic-home', routeName === 'home');
  }
  syncEntrance();
  window.addEventListener('hashchange', syncEntrance);
  renderHome = function () {
    document.documentElement.classList.add('cinematic-home');
    document.getElementById('globalAudio')?.pause();
    const frame = document.createElement('iframe');
    frame.className = 'home-awakening-frame';
    frame.title = 'The Choice — enter the world of 2Fly Keith Logan';
    frame.src = 'awakening/index.html';
    frame.allow = 'autoplay';
    document.getElementById('appView').replaceChildren(frame);
  };
})();
