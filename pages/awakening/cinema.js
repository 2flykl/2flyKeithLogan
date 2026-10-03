if(parent!==window)document.body.classList.add('shared-landing');
(() => {
  'use strict';
  const stage=document.querySelector('#stage'),cinema=document.querySelector('#cinema'),intro=document.querySelector('#intro-film');
  const skip=document.querySelector('#skip-intro'),start=document.querySelector('#start-film'),replay=document.querySelector('#replay'),motion=document.querySelector('#motion-toggle');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const films={storm:document.querySelector('#background-storm'),light:document.querySelector('#background-light')};
  let ready=false,paused=reduced.matches,current='breath',bag=[],atmosphereTimer,fadeTimer,backgroundGeneration=0,disposed=false;
  const wall=document.querySelector('#living-wall'),ctx=wall.getContext('2d');let w=0,h=0,raf=0,clock=0,last=performance.now();
  function wallSize(){const rect=wall.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.5);w=rect.width;h=rect.height;wall.width=Math.round(w*dpr);wall.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);drawWall(clock)}
  function drawWall(time){ctx.clearRect(0,0,w,h);const pulse=(Math.sin(time*.62)+1)/2;ctx.lineWidth=.65;for(let line=0;line<38;line++){ctx.beginPath();for(let j=0;j<=90;j++){const x=w*j/90,y=h*(line/40)+Math.sin(j*.08+time*.14+line*.18)*(14+pulse*12)+Math.cos(j*.13-line*.16-time*.11)*10;j?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.strokeStyle=`rgba(100,190,152,${.025+pulse*.065})`;ctx.stroke()}for(let i=0;i<45;i++){const x=((i*173.7)%w),y=((i*113.9+Math.sin(time*.12+i)*14)%h);ctx.fillStyle=`rgba(155,222,180,${.05+.07*Math.sin(time*.6+i)**2})`;ctx.fillRect(x,y,1.2,1.2)}}
  function wallTick(now){clock+=Math.min((now-last)/1000,.05);last=now;drawWall(clock);raf=requestAnimationFrame(wallTick)}
  function runWall(){cancelAnimationFrame(raf);if(ready&&!paused&&!document.hidden){last=performance.now();raf=requestAnimationFrame(wallTick)}else drawWall(clock)}
  new ResizeObserver(wallSize).observe(wall);
  function schedule(delay=9000){clearTimeout(atmosphereTimer);if(!paused&&ready&&!document.hidden)atmosphereTimer=setTimeout(nextAtmosphere,delay)}
  function nextName(){if(!bag.length){bag=['storm','light','breath'].sort(()=>Math.random()-.5);if(bag[0]===current)bag.push(bag.shift())}let name=bag.shift();if(name===current&&bag.length){bag.push(name);name=bag.shift()}return name}
  async function nextAtmosphere(){
    if(paused||!ready||document.hidden)return;
    const name=nextName(),generation=++backgroundGeneration;
    if(name==='breath'){current=name;stage.dataset.atmosphere=name;Object.values(films).forEach(v=>v.classList.remove('show'));setTimeout(()=>{if(current==='breath')Object.values(films).forEach(v=>v.pause())},1800);schedule(10500);return}
    const film=films[name];film.currentTime=0;film.muted=true;
    try{await film.play();if(generation!==backgroundGeneration||paused||!ready){film.pause();return}current=name;stage.dataset.atmosphere=name;Object.entries(films).forEach(([key,v])=>v.classList.toggle('show',key===name));schedule(Math.max(4200,(film.duration||7)*1000-1300))}catch{current='breath';stage.dataset.atmosphere='breath';Object.values(films).forEach(v=>v.classList.remove('show'));schedule()}
  }
  function setPaused(value){paused=value;document.body.dataset.motion=paused?'paused':'running';motion.textContent=paused?'Resume atmosphere':'Pause atmosphere';motion.setAttribute('aria-pressed',String(paused));clearTimeout(atmosphereTimer);if(paused){backgroundGeneration++;Object.values(films).forEach(v=>v.pause())}else{if(films[current])films[current].play().catch(()=>{});schedule(5000)}runWall();dispatchEvent(new Event('choice-motion'))}
  function finishIntro(){if(ready)return;ready=true;clearTimeout(fadeTimer);intro.pause();start.hidden=true;stage.dataset.phase='ready';document.querySelectorAll('[data-select]').forEach(b=>b.disabled=false);cinema.classList.add('fade-out');cinema.inert=true;setTimeout(()=>{if(ready)cinema.hidden=true},reduced.matches?0:1150);runWall();schedule(6500)}
  function progress(){if(intro.duration){document.querySelector('#film-progress').style.transform=`scaleX(${Math.min(1,intro.currentTime/intro.duration)})`;const opening=intro.currentTime>=4.8;document.querySelector('#chapter').textContent=opening?'THE CHOICE IS YOURS.':'REALITY IS A CHOICE.';document.querySelector('#chapter-number').textContent=opening?'02 / 02':'01 / 02'}}
  async function playIntro(){ready=false;backgroundGeneration++;clearTimeout(atmosphereTimer);cancelAnimationFrame(raf);Object.values(films).forEach(v=>v.pause());stage.dataset.phase='intro';cinema.hidden=false;cinema.inert=false;cinema.classList.remove('fade-out');document.querySelectorAll('[data-select]').forEach(b=>b.disabled=true);start.hidden=true;intro.currentTime=0;progress();try{await intro.play()}catch{start.hidden=false}}
  intro.addEventListener('timeupdate',progress);intro.addEventListener('ended',finishIntro);intro.addEventListener('error',finishIntro);skip.addEventListener('click',finishIntro);start.addEventListener('click',()=>{intro.play().then(()=>start.hidden=true).catch(finishIntro)});replay.addEventListener('click',playIntro);motion.addEventListener('click',()=>setPaused(!paused));
  window.addEventListener('twofly-replay',playIntro);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimeout(atmosphereTimer);cancelAnimationFrame(raf);intro.pause();Object.values(films).forEach(v=>v.pause())}else if(!ready){intro.play().catch(()=>start.hidden=false)}else{runWall();if(!paused){films[current]?.play().catch(()=>{});schedule(5000)}}});
  reduced.addEventListener('change',()=>{if(reduced.matches){finishIntro();setPaused(true)}});
  document.querySelectorAll('[data-select]').forEach(b=>b.addEventListener('click',()=>{clearTimeout(atmosphereTimer);cancelAnimationFrame(raf);Object.values(films).forEach(v=>v.pause())}));
  document.querySelector('#return-choice').addEventListener('click',()=>{runWall();schedule(3000)});
  addEventListener('pageshow',e=>{if(e.persisted&&ready){runWall();schedule(3000)}});
  // Phone visitors reach the choices immediately; Replay still offers the film.
  wallSize();setPaused(paused);if(reduced.matches||matchMedia('(max-width:760px)').matches)finishIntro();else playIntro();
})();
