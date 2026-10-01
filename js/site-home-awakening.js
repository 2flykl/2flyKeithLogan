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
    frame.addEventListener('load',()=>{
      const stage=frame.contentDocument?.querySelector('#stage');
      if(!stage)return;
      const fit=()=>{
        const root=document.documentElement;
        if(matchMedia('(max-width:760px)').matches)root.style.setProperty('--home-scene-height',Math.ceil(stage.getBoundingClientRect().height)+'px');
        else root.style.removeProperty('--home-scene-height');
      };
      const observer=new ResizeObserver(fit);observer.observe(stage);fit();
      window.addEventListener('hashchange',()=>observer.disconnect(),{once:true});
    });
    const header = document.createElement('header');
    header.className = 'home-entrance-header flyzone-topbar';
    header.innerHTML = `<a class="flyzone-brand" href="#home" aria-label="2Fly Keith Logan home"><strong>2FLY</strong><span>KEITH LOGAN<br>THE EXPERIENCE</span></a><div class="flyzone-title-marquee" aria-label="2flyKeithLogan.com"><div class="flyzone-title-track">${Array.from({length:4}, (_, i) => `<span class="flyzone-title-unit"${i ? ' aria-hidden="true"' : ''}>2flyKeithLogan.com</span>`).join('')}</div></div><a class="flyzone-help-action" href="#support" data-help2fly-full-page>HELP 2FLY CREATE <span aria-hidden="true">→</span></a>`;
    const ticker = document.createElement('div');
    ticker.className = 'global-ticker home-entrance-ticker';
    ticker.setAttribute('aria-label', 'Global Ticker');
    const source = document.getElementById('globalTickerTrack');
    const mirrorTicker = () => { ticker.innerHTML = `<div class="ticker-track">${source?.innerHTML || ''}</div>`; };
    mirrorTicker();
    const tickerObserver = new MutationObserver(mirrorTicker);
    if (source) tickerObserver.observe(source, {childList:true, subtree:true, characterData:true});
    window.addEventListener('hashchange', () => tickerObserver.disconnect(), {once:true});
    const footer = document.createElement('footer');
    footer.className = 'home-entrance-footer';
    footer.innerHTML = helpModule();
    document.getElementById('appView').replaceChildren(header, ticker, frame, footer);
  };
})();
