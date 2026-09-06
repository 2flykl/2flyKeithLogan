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
      .vhs-companion{--comp-accent:#d7a448;--comp-accent2:#392816;position:relative;isolation:isolate;min-height:220px;margin-top:18px;border:1px solid color-mix(in srgb,var(--comp-accent) 48%,#191919);background:linear-gradient(155deg,#080908 0,#0d0e0c 48%,#050605 100%);overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.02),0 14px 30px rgba(0,0,0,.28);perspective:900px}
      .vhs-companion::before{content:"";position:absolute;inset:-30%;background:radial-gradient(circle at 67% 35%,color-mix(in srgb,var(--comp-accent) 25%,transparent),transparent 32%),radial-gradient(circle at 20% 82%,color-mix(in srgb,var(--comp-accent2) 38%,transparent),transparent 35%);filter:blur(5px);transition:background .35s ease;pointer-events:none}
      .vhs-companion::after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(180deg,rgba(255,255,255,.012) 0 1px,transparent 1px 4px),linear-gradient(115deg,transparent 0 45%,rgba(255,255,255,.025) 50%,transparent 55%);pointer-events:none}
      .vhs-companion-head{position:absolute;z-index:5;top:12px;left:14px;right:14px;display:flex;align-items:center;justify-content:space-between;gap:8px;font:800 7px/1 Arial,sans-serif;letter-spacing:.18em;color:#a9a398;text-transform:uppercase}
      .vhs-companion-head b{color:var(--comp-accent);font-size:8px}
      .vhs-companion-stage{position:absolute;inset:30px 8px 42px;transform-style:preserve-3d;transition:transform .22s cubic-bezier(.2,.7,.2,1);pointer-events:none}
      .vhs-art-cassette{position:absolute;left:7%;top:19%;width:76%;height:58%;border:1px solid #464945;border-radius:8px;background:linear-gradient(155deg,#353734 0,#111310 18%,#080908 56%,#242622 100%);box-shadow:0 18px 26px rgba(0,0,0,.58),inset 0 1px 0 rgba(255,255,255,.10),inset 0 -2px 0 rgba(255,255,255,.025);transform:translateZ(28px) rotate(-5deg);transition:transform .22s ease;overflow:hidden}
      .vhs-art-cassette::before{content:"";position:absolute;left:8%;right:8%;top:10%;height:48%;border:1px solid #252724;border-radius:5px;background:linear-gradient(180deg,#121411,#080908);box-shadow:inset 0 0 18px rgba(0,0,0,.82)}
      .vhs-art-reel{position:absolute;z-index:2;top:19%;width:27%;aspect-ratio:1;border-radius:50%;border:8px dotted #d3cec2;background:radial-gradient(circle,#0b0c0b 0 21%,#c9c3b7 23% 31%,#0e0f0e 33% 100%);box-shadow:0 0 0 4px rgba(255,255,255,.08)}
      .vhs-art-reel.a{left:14%}.vhs-art-reel.b{right:14%}
      .vhs-art-window{position:absolute;z-index:1;left:27%;right:27%;top:16%;height:40%;background:linear-gradient(90deg,#121310,#252723,#121310);border:1px solid #353633;clip-path:polygon(8% 0,92% 0,100% 100%,0 100%)}
      .vhs-art-label{position:absolute;z-index:4;left:8%;right:8%;bottom:7%;height:28%;display:flex;align-items:center;padding:0 10px;border:1px solid #b8aa92;background:linear-gradient(180deg,#efe7d8,#d9ceba);box-shadow:inset 0 1px rgba(255,255,255,.75);color:#17120d;font:700 clamp(10px,1vw,14px)/1.05 "Comic Sans MS","Segoe Print",cursive;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .vhs-art-label::after{content:"";position:absolute;right:0;top:0;bottom:0;width:16%;background:linear-gradient(90deg,#c24e53 0 33%,#c7a52f 33% 66%,#2d7f9c 66%)}
      .vhs-art-spine{position:absolute;right:7%;top:8%;height:82%;width:auto;max-width:23%;object-fit:contain;filter:drop-shadow(0 12px 13px rgba(0,0,0,.6));transform:translateZ(46px) rotate(7deg);opacity:.9;transition:transform .22s ease}
      .vhs-art-poster{position:absolute;left:12%;top:18%;width:56%;height:43%;object-fit:cover;border-radius:3px;opacity:.17;mix-blend-mode:screen;filter:saturate(.75) contrast(1.12);transform:translateZ(10px) rotate(-5deg);mask-image:linear-gradient(to bottom,rgba(0,0,0,.8),transparent)}
      .vhs-companion-foot{position:absolute;z-index:5;left:14px;right:14px;bottom:11px;display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:end}.vhs-companion-foot strong{font:900 9px/1 Arial,sans-serif;letter-spacing:.08em;color:#f0eadf}.vhs-companion-foot span{font:9px/1.25 Georgia,serif;color:#aaa398;text-align:right}
      .vhs-companion.is-future .vhs-art-cassette{filter:grayscale(.55) brightness(.78)}.vhs-companion.is-future .vhs-art-poster{opacity:.06}
      @media(hover:none),(max-width:900px){.vhs-companion-stage,.vhs-art-cassette,.vhs-art-spine{transform:none!important}.vhs-companion{min-height:205px}}
      @media(prefers-reduced-motion:reduce){.vhs-companion-stage,.vhs-art-cassette,.vhs-art-spine{transition:none!important}}
    `;
    document.head.appendChild(style);
  }

  function removeVariantNav(){
    const group=document.getElementById('videoNavGroup');
    if(!group)return;
    const trigger=group.querySelector('.video-nav-trigger');
    if(trigger){group.replaceWith(trigger);trigger.classList.remove('video-nav-trigger');trigger.removeAttribute('aria-expanded')}
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
    box.innerHTML=`<div class="vhs-companion-head"><span>ARCHIVE ARTIFACT</span><b id="vhsCompanionStatus">VHS DETAIL</b></div><div class="vhs-companion-stage"><img class="vhs-art-poster" id="vhsArtifactPoster" alt=""><div class="vhs-art-cassette"><span class="vhs-art-window"></span><i class="vhs-art-reel a"></i><i class="vhs-art-reel b"></i><span class="vhs-art-label" id="vhsArtifactLabel">2FLY VIDEO</span></div><img class="vhs-art-spine" src="../assets/video-premium/vhs-spine.svg?v=7" alt=""></div><div class="vhs-companion-foot"><strong id="vhsArtifactTitle">SELECT A TAPE</strong><span id="vhsArtifactCaption">Select a VHS to reveal its archive artifact.</span></div>`;
    hud.appendChild(box);bindParallax(box);updateCompanion();
  }

  function updateCompanion(){
    const box=document.getElementById('vhsCompanion');if(!box)return;
    const tape=selectedTape(),theme=themeFor(tape),title=tape?.title||'SELECT A TAPE';
    box.style.setProperty('--comp-accent',theme.accent);box.style.setProperty('--comp-accent2',theme.accent2);box.classList.toggle('is-future',!!tape?.future);
    document.getElementById('vhsArtifactTitle').textContent=title.toUpperCase();document.getElementById('vhsArtifactLabel').textContent=title;
    document.getElementById('vhsArtifactCaption').textContent=tape?.future?FUTURE.caption:theme.caption;document.getElementById('vhsCompanionStatus').textContent=tape?.future?'COMING SOON':tape?'SELECTED VHS':'VHS DETAIL';
    const poster=document.getElementById('vhsArtifactPoster'),src=currentPoster();if(src){poster.src=src;poster.style.opacity=tape?.future?'.06':'.17'}else{poster.removeAttribute('src');poster.style.opacity='0'}
  }

  function bindParallax(box){
    if(matchMedia('(hover:none)').matches||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
    const stage=box.querySelector('.vhs-companion-stage'),cassette=box.querySelector('.vhs-art-cassette'),spine=box.querySelector('.vhs-art-spine');
    box.addEventListener('mousemove',e=>{const r=box.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;stage.style.transform=`rotateX(${(-y*4).toFixed(2)}deg) rotateY(${(x*6).toFixed(2)}deg)`;cassette.style.transform=`translate3d(${(x*9).toFixed(1)}px,${(y*6).toFixed(1)}px,28px) rotate(${(-5+x*1.2).toFixed(2)}deg)`;spine.style.transform=`translate3d(${(-x*7).toFixed(1)}px,${(-y*5).toFixed(1)}px,46px) rotate(${(7-x).toFixed(2)}deg)`});
    box.addEventListener('mouseleave',()=>{stage.style.transform='';cassette.style.transform='';spine.style.transform=''})
  }

  function observeVideoUI(){
    hudObserver?.disconnect();tapeObserver?.disconnect();const hud=document.getElementById('vhsHud'),stack=document.getElementById('vhsStack');
    if(hud){hudObserver=new MutationObserver(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{makeCompanion();updateCompanion()})});hudObserver.observe(hud,{childList:true,subtree:false})}
    if(stack){tapeObserver=new MutationObserver(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{makeCompanion();updateCompanion()})});tapeObserver.observe(stack,{attributes:true,subtree:true,attributeFilter:['class']})}
    makeCompanion();updateCompanion();
  }

  renderVideos=function(){baseRenderVideos();requestAnimationFrame(observeVideoUI)};
  injectStyle();document.addEventListener('DOMContentLoaded',removeVariantNav);if(document.readyState!=='loading')removeVariantNav();
  window.addEventListener('hashchange',()=>{if(location.hash==='#videos-premium')location.hash='videos'});
})();
