// Flyzone uses its own quiet shell while keeping the full studio runtime in the iframe.
function renderFlyZone(){
  const studioUrl='../games/Flyzone/index.html?v=20260925-layout1';
  const titleUnit='<span class="flyzone-title-unit">Welcome to the Flyzone</span>';
  $('#globalAudio')?.pause();
  $('#appView').innerHTML=`<section class="flyzone-native" aria-label="Flyzone creative studio">
    <header class="flyzone-topbar">
      <a class="flyzone-brand" href="#home" data-route="home" aria-label="2Fly Keith Logan home"><strong>2FLY</strong><span>KEITH LOGAN<br>A CREATIVE EXPERIENCE</span></a>
      <h1 class="flyzone-screen-reader">Welcome to the Flyzone</h1>
      <div class="flyzone-title-marquee" aria-hidden="true"><div class="flyzone-title-track">${titleUnit.repeat(4)}</div></div>
      <a class="flyzone-help-action" href="#support" data-route="support">HELP 2FLY CREATE <span aria-hidden="true">→</span></a>
    </header>
    <div class="flyzone-frame-shell" id="flyzoneFrameShell">
      <iframe id="flyzoneFrame" src="${studioUrl}" title="Flyzone Creative Studio" allow="autoplay; fullscreen" loading="eager"></iframe>
    </div>
  </section>`;
}
