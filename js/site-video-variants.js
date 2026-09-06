// 2FLY Videos: official single-page presentation + dynamic VHS companion display.
// Option 2 is retired. The existing Videos page remains the source of truth.
(function(){
  if(typeof renderVideos!=='function') return;

  const THEMES={
    streams:{accent:'#2c9d9a',accent2:'#163f46',caption:'Legacy, ownership, and what remains after attention passes.'},
    away:{accent:'#8069a8',accent2:'#332946',caption:'Distance, reflection, movement, and the feeling of returning.'},
    fire:{accent:'#d87934',accent2:'#542617',caption:'Resilience, rebuilding, and surviving with intention.'},
    africa:{accent:'#d7a448',accent2:'#4b5a2b',caption:'Perspective, purpose, travel, and transformation.'}
  };
  const FUTURE={accent:'#8c8374',accent2:'#282723',caption:'Reserved in the 2FLY archive for a future visual release.'};
  const baseRenderVideos=renderVideos;
  let hudObserver=null,tapeObserver=null,raf=0;

  function injectStyle(){
    if(document.getElementById('vhsCompanionStyles')) return;
    const style=document.createElement('style');
    style.id='vhsCompanionStyles';
    style.textContent=`
      .video-menu-toggle,.video-nav-menu{display:none!important}
      .video-nav-group{display:contents!important}.video-nav-trigger::after{display:none!important}
      .video-variant-banner{display:none!important}
      .vhs-hud .hud-panel{overflow:auto}
      .vhs-companion{--comp-accent:#d7a448;--comp-accent2:#392816;position:relative;isolation:isolate;min-height:230px;margin-top:18px;border:1px solid color-mix(in srgb,var(--comp-accent) 48%,#191919);background:linear-gradient(155deg,#080908 0,#0d0e0c 48%,#050605 100%);overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.02),0 14px 30px rgba(0,0,0,.28);perspective:900px}
      .vhs-companion::before{content:"";position:absolute;inset:-30%;background:radial-gradient(circle at 68% 34%,color-mix(in srgb,var(--comp-accent) 28%,transparent),transparent 31%),radial-gradient(circle at 17% 84%,color-mix(in srgb,var(--comp-accent2) 42%,transparent),transparent 34%);filter:blur(7px);transition:background .35s ease;pointer-events:none}
      .vhs-companion::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(180deg,rgba(255,255,255,.012) 0 1px,transparent 1px 4px),linear-gradient(115deg,transparent 0 45%,rgba(255,255,255,.03) 50%,transparent 55%);pointer-events:none}
      .vhs-companion-head{position:absolute;z-index:8;top:12px;left:14px;right:14px;display:flex;align-items:center;justify-content:space-between;gap:8px;font:800 7px/1 Arial,sans-serif;letter-spacing:.18em;color:#a9a398;text-transform:uppercase}
      .vhs-companion-head b{color:var(--comp-accent);font-size:8px}
      .vhs-companion-stage{position:absolute;inset:29px 8px 43px;transform-style:preserve-3d;transition:transform .22s cubic-bezier(.2,.7,.2,1);pointer-events:none}
      .vhs-art-face{position:absolute;left:4%;top:11%;width:79%;height:auto;max-height:75%;object-fit:contain;filter:drop-shadow(0 17px 19px rgba(0,0,0,.62)) saturate(.9) contrast(1.04);transform:translateZ(32px) rotate(-4.5deg);transform-origin:center;transition:transform .22s ease,filter .25s ease;z-index:4}
      .vhs-art-spine{position:absolute;right:4%;top:4%;height:88%;width:auto;max-width:19%;object-fit:contain;filter:drop-shadow(0 12px 13px rgba(0,0,0,.68));transform:translateZ(52px) rotate(6deg);opacity:.92;transition:transform .22s ease,filter .25s ease;z-index:5}
      .vhs-art-poster{position:absolute;left:9%;top:14%;width:57%;height:48%;object-fit:cover;border-radius:4px;opacity:.14;mix-blend-mode:screen;filter:saturate(.72) contrast(1.15);transform:translateZ(8px) rotate(-4deg);mask-image:linear-gradient(to bottom,rgba(0,0,0,.88),transparent 82%);z-index:1}
      .vhs-art-titleplate{position:absolute;z-index:7;left:11%;right:24%;bottom:12%;display:flex;align-items:center;min-height:27px;padding:5px 10px;border:1px solid rgba(222,205,176,.7);background:linear-gradient(180deg,rgba(241,234,220,.96),rgba(215,204,184,.94));color:#17120d;box-shadow:0 6px 13px rgba(0,0,0,.38);font:700 clamp(10px,1vw,14px)/1.05 "Comic Sans MS","Segoe Print",cursive;transform:translateZ(58px) rotate(-4.5deg);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .vhs-art-titleplate::after{content:"";position:absolute;right:0;top:0;bottom:0;width:12%;background:linear-gradient(90deg,#c24e53 0 33%,#c7a52f 33% 66%,#2d7f9c 66%)}
      .vhs-companion-foot{position:absolute;z-index:8;left:14px;right:14px;bottom:10px;display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:end}.vhs-companion-foot strong{font:900 9px/1 Arial,sans-serif;letter-spacing:.08em;color:#f0eadf}.vhs-companion-foot span{font:9px/1.25 Georgia,serif;color:#aaa398;text-align:right}
      .vhs-companion.is-future .vhs-art-face,.vhs-companion.is-future .vhs-art-spine{filter:grayscale(.62) brightness(.72) drop-shadow(0 14px 16px rgba(0,0,0,.66))}.vhs-companion.is-future .vhs-art-poster{opacity:.05}
      @media(hover:none),(max-width:900px){.vhs-companion-stage,.vhs-art-face,.vhs-art-spine,.vhs-art-titleplate{transform:none!important}.vhs-companion{min-height:205px}}
      @media(prefers-reduced-motion:reduce){.vhs-companion-stage,.vhs-art-face,.vhs-art-spine,.vhs-art-titleplate{transition:none!important}}
    `;
    document.head.appendChild(style);
  }

  function selectedTape(){
    const el=document.querySelector('.vhs-spine.selected[data-tape-id]');
    if(!el)return null;
    const id=el.dataset.tapeId,title=el.querySelector('.spine-label')?.textContent?.trim()||'Selected Tape';
    return {id,title,future:id.startsWith('future-')};
  }
  function themeFor(tape){return tape?(THEMES[tape.id]||FUTURE):{accent:'#d7a448',accent2:'#352719',caption:'Select a VHS to reveal its archive artifact.'}}
  function currentPoster(){return document.getElementById('crtPoster')?.getAttribute('src')||''}

  function makeCompanion(){
    const hud=document.getElementById('vhsHud');if(!hud||hud.querySelector('.vhs-companion'))return;
    const box=document.createElement('section');box.className='vhs-companion';box.id='vhsCompanion';box.setAttribute('aria-hidden','true');
    box.innerHTML=`<div class="vhs-companion-head"><span>ARCHIVE ARTIFACT</span><b id="vhsCompanionStatus">VHS DETAIL</b></div><div class="vhs-companion-stage"><img class="vhs-art-poster" id="vhsArtifactPoster" alt=""><img class="vhs-art-face" src="../assets/video-hud/vhs-face.svg?v=1" alt=""><img class="vhs-art-spine" src="../assets/video-premium/vhs-spine.svg?v=7" alt=""><div class="vhs-art-titleplate" id="vhsArtifactLabel">2FLY VIDEO</div></div><div class="vhs-companion-foot"><strong id="vhsArtifactTitle">SELECT A TAPE</strong><span id="vhsArtifactCaption">Select a VHS to reveal its archive artifact.</span></div>`;
    hud.appendChild(box);bindParallax(box);updateCompanion();
  }

  function updateCompanion(){
    const box=document.getElementById('vhsCompanion');if(!box)return;
    const tape=selectedTape(),theme=themeFor(tape),title=tape?.title||'SELECT A TAPE';
    box.style.setProperty('--comp-accent',theme.accent);box.style.setProperty('--comp-accent2',theme.accent2);box.classList.toggle('is-future',!!tape?.future);
    document.getElementById('vhsArtifactTitle').textContent=title.toUpperCase();document.getElementById('vhsArtifactLabel').textContent=title;
    document.getElementById('vhsArtifactCaption').textContent=tape?.future?FUTURE.caption:theme.caption;document.getElementById('vhsCompanionStatus').textContent=tape?.future?'COMING SOON':tape?'SELECTED VHS':'VHS DETAIL';
    const poster=document.getElementById('vhsArtifactPoster'),src=currentPoster();if(src){poster.src=src;poster.style.opacity=tape?.future?'.05':'.14'}else{poster.removeAttribute('src');poster.style.opacity='0'}
  }

  function bindParallax(box){
    if(matchMedia('(hover:none)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
    const stage=box.querySelector('.vhs-companion-stage'),face=box.querySelector('.vhs-art-face'),spine=box.querySelector('.vhs-art-spine'),label=box.querySelector('.vhs-art-titleplate');
    box.addEventListener('mousemove',e=>{const r=box.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;stage.style.transform=`rotateX(${(-y*3.5).toFixed(2)}deg) rotateY(${(x*5.5).toFixed(2)}deg)`;face.style.transform=`translate3d(${(x*10).toFixed(1)}px,${(y*6).toFixed(1)}px,32px) rotate(${(-4.5+x).toFixed(2)}deg)`;spine.style.transform=`translate3d(${(-x*8).toFixed(1)}px,${(-y*5).toFixed(1)}px,52px) rotate(${(6-x).toFixed(2)}deg)`;label.style.transform=`translate3d(${(x*6).toFixed(1)}px,${(y*3).toFixed(1)}px,58px) rotate(${(-4.5+x*.7).toFixed(2)}deg)`});
    box.addEventListener('mouseleave',()=>{stage.style.transform='';face.style.transform='';spine.style.transform='';label.style.transform=''})
  }

  function observeVideoUI(){
    hudObserver?.disconnect();tapeObserver?.disconnect();const hud=document.getElementById('vhsHud'),stack=document.getElementById('vhsStack');
    if(hud){hudObserver=new MutationObserver(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{makeCompanion();updateCompanion()})});hudObserver.observe(hud,{childList:true,subtree:false})}
    if(stack){tapeObserver=new MutationObserver(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{makeCompanion();updateCompanion()})});tapeObserver.observe(stack,{attributes:true,subtree:true,attributeFilter:['class']})}
    makeCompanion();updateCompanion();
  }

  renderVideos=function(){baseRenderVideos();requestAnimationFrame(observeVideoUI)};
  injectStyle();
  window.addEventListener('hashchange',()=>{if(location.hash==='#videos-premium')location.hash='videos'});
})();
