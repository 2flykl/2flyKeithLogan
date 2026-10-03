// Keep the approved entrance isolated from the music/gallery styles and their globals.
(function () {
  window.twoflyLanding = new URLSearchParams(location.search).get('landing') === '2' ? 2 : 1;
  function setLanding(value, notify = true) {
    window.twoflyLanding = value === 2 ? 2 : 1;
    if(notify && window.WIX_PAGE) parent.postMessage({type:'twofly-landing-select',landing:window.twoflyLanding}, 'https://www.2flykeithlogan.com');
    else if(notify){const url=new URL(location.href);window.twoflyLanding===2?url.searchParams.set('landing','2'):url.searchParams.delete('landing');history.replaceState(null,'',url);}
    if(document.body.dataset.route==='home'){renderHome();window.scrollTo({top:0,behavior:'instant'});}
  }
  window.addEventListener('message',event=>{
    if(event.source!==parent || event.origin!=='https://www.2flykeithlogan.com' || event.data?.type!=='twofly-landing-state')return;
    const next=event.data.landing===2?2:1;
    if(next!==window.twoflyLanding)setLanding(next,false);
  });
  if(window.WIX_PAGE)parent.postMessage({type:'twofly-landing-ready'},'https://www.2flykeithlogan.com');
  function syncEntrance() {
    const routeName = (location.hash || '#home').slice(1).split('?')[0];
    document.documentElement.classList.toggle('cinematic-home', routeName === 'home');
  }
  syncEntrance();
  window.addEventListener('hashchange', syncEntrance);
  let sceneObserver, mirrorObserver;
  function cleanup(){sceneObserver?.disconnect();mirrorObserver?.disconnect();}
  window.addEventListener('hashchange',cleanup);
  renderHome = function () {
    cleanup();
    document.documentElement.classList.add('cinematic-home');
    document.getElementById('globalAudio')?.pause();
    const airport = window.twoflyLanding === 2;
    const frame = document.createElement('iframe');
    frame.className = 'home-awakening-frame';
    frame.title = airport ? 'Airport — Landing Page 2' : 'The Choice — Landing Page 1';
    frame.src = airport ? 'airport/index.html' : 'awakening/index.html';
    frame.allow = 'autoplay';
    frame.addEventListener('load',()=>{
      const stage=frame.contentDocument?.querySelector('#stage, main');
      if(!stage)return;
      const fit=()=>{
        const root=document.documentElement;
        if(matchMedia(airport?'(max-width:800px)':'(max-width:760px)').matches)root.style.setProperty('--home-scene-height',Math.ceil(stage.getBoundingClientRect().height)+'px');
        else root.style.removeProperty('--home-scene-height');
      };
      sceneObserver=new ResizeObserver(fit);sceneObserver.observe(stage);fit();

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
    mirrorObserver = new MutationObserver(mirrorTicker);
    if (source) mirrorObserver.observe(source, {childList:true, subtree:true, characterData:true});

    const footer = document.createElement('footer');
    footer.className = 'home-entrance-footer';
    footer.innerHTML = helpModule();
    const controls=document.createElement('nav');controls.className='landing-controls';controls.setAttribute('aria-label','Landing page options');
    controls.innerHTML=`<button type="button" data-replay>Replay Intro</button><button type="button" class="landing-switch">Landing Page ${airport?'1':'2'} <span aria-hidden="true">→</span></button><span class="landing-soon">More landing pages in the works</span><a href="#featured" data-route="featured">Skip Landing Page <span aria-hidden="true">↗</span></a>`;
    controls.querySelector('[data-replay]').onclick=()=>frame.contentWindow?.dispatchEvent(new Event('twofly-replay'));
    controls.querySelector('.landing-switch').onclick=()=>setLanding(airport?1:2);
    document.documentElement.style.removeProperty('--home-scene-height');
    document.getElementById('appView').replaceChildren(header, ticker, controls, frame, footer);
  };
})();
