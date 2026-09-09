// Native FlyZone wrapper that preserves the existing studio runtime intact.
const africaShellRoute=route;
route=function(){
  const raw=(location.hash||'#home').slice(1).split('?')[0];
  if(raw!=='flyzone'){africaShellRoute();return}
  app.route='flyzone';
  $$('#primaryNav [data-route]').forEach(a=>a.classList.toggle('active',a.dataset.route==='flyzone'));
  document.body.dataset.route='flyzone';
  renderFlyZone();
  window.scrollTo({top:0,left:0,behavior:'auto'});
  $('#appView').focus({preventScroll:true});
};

function renderFlyZone(){
  $('#appView').innerHTML=`<section class="flyzone-native">
    <div class="flyzone-native-head"><div><div class="kicker">CREATE · EXPERIMENT · PARTICIPATE</div><h1>FLYZONE.</h1><p>Describe the sound naturally, choose how much control you want, and create inside the studio. The full FlyZone engine remains intact inside this page rather than being recreated as a simplified website mockup.</p></div><div class="flyzone-head-actions"><button id="flyzoneFullscreen" type="button">FOCUS STUDIO</button><a href="../games/Flyzone/index.html" target="_blank" rel="noopener">OPEN STUDIO BY ITSELF ↗</a></div></div>
    <div class="flyzone-frame-shell" id="flyzoneFrameShell"><div class="flyzone-frame-bar"><span><i></i> FLYZONE CREATIVE STUDIO</span><small>THE GLOBAL 2FLY PLAYER REMAINS AVAILABLE ABOVE</small></div><iframe id="flyzoneFrame" src="../games/Flyzone/index.html" title="FlyZone Creative Studio" allow="autoplay; fullscreen" loading="eager"></iframe></div>
    <section class="flyzone-flow"><div><small>01</small><strong>DESCRIBE IT</strong><p>Tell FlyZone what you want in natural language.</p></div><i>→</i><div><small>02</small><strong>DIRECT IT</strong><p>Choose literal direction, refinement, engine, and optional production controls.</p></div><i>→</i><div><small>03</small><strong>CREATE</strong><p>Generate inside the room and evaluate the result as an experience.</p></div><i>→</i><div><small>04</small><strong>PARTICIPATE</strong><p>Keep creating, leave useful feedback, or help fund what comes next.</p></div></section>
    ${helpModule()}
  </section>`;
  $('#flyzoneFullscreen').onclick=()=>{
    const shell=$('#flyzoneFrameShell');
    if(document.fullscreenElement)document.exitFullscreen?.();else shell.requestFullscreen?.();
  };
}
