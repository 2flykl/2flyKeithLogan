/* Independent presentation pass. Reads timer and scene DOM; never writes gameplay state. */
(() => {
  'use strict';
  const viewport = document.querySelector('#roomViewport');
  const canvas = document.createElement('canvas');
  canvas.className = 'visual-atmosphere';
  canvas.setAttribute('aria-hidden', 'true');
  viewport.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const fire = document.querySelector('#risingFire');
  const intro = document.querySelector('#introOverlay');
  const end = document.querySelector('#endOverlay');
  const transition = document.querySelector('#roomTransition');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let w = 1, h = 1, frame = 0, last = 0;
  // Fixed deterministic visual particles do not consume gameplay randomness.
  const seed = i => { const v = Math.sin(i * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
  const motes = Array.from({length:58}, (_,i) => ({x:seed(i+1),y:seed(i+90),z:seed(i+180),v:seed(i+270)}));
  const smoke = document.createElement('canvas'); smoke.width = smoke.height = 128;
  const sc = smoke.getContext('2d');
  const sg = sc.createRadialGradient(64,64,2,64,64,64);
  sg.addColorStop(0,'rgba(38,43,43,.52)'); sg.addColorStop(.45,'rgba(32,37,37,.32)'); sg.addColorStop(1,'rgba(24,30,31,0)');
  sc.fillStyle = sg; sc.fillRect(0,0,128,128);
  new ResizeObserver(() => {
    w = viewport.clientWidth; h = viewport.clientHeight;
    const d = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(w*d); canvas.height = Math.round(h*d);
    ctx.setTransform(d,0,0,d,0,0);
  }).observe(viewport);
  function draw(now) {
    frame = requestAnimationFrame(draw);
    if (document.hidden || now-last < (reduce.matches ? 200 : 33)) return;
    last = now;
    ctx.clearRect(0,0,w,h);
    if (!intro.classList.contains('hidden') || !end.classList.contains('hidden') || !transition.classList.contains('hidden')) return;
    const pressure = Math.max(0,Math.min(1,parseFloat(fire.style.getPropertyValue('--fire-rise')) || 0));
    const t = reduce.matches ? 1 : now/1000;
    // Cool shadows and localized floor bounce retain room color separation.
    ctx.globalCompositeOperation = 'screen';
    for (let j=0;j<3;j++) {
      const x=w*[.08,.55,.93][j];
      const intensity=(.05+pressure*.17)*(1+Math.sin(t*3.1+j)*.13);
      const glow=ctx.createRadialGradient(x,h,0,x,h,w*.48);
      glow.addColorStop(0,`rgba(255,116,32,${intensity})`); glow.addColorStop(1,'rgba(255,91,22,0)');
      ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
    }
    // Individually phased flame tongues, anchored to the lower edge.
    if (pressure > .015) {
      ctx.globalCompositeOperation='source-over';
      for(let j=0;j<26;j++) {
        const x=w*(j/25), phase=seed(j+410)*6.28;
        const height=h*pressure*(.075+seed(j+510)*.24)*(1+.18*Math.sin(t*3.7+phase));
        const width=w*(.015+seed(j+610)*.026);
        const sway=Math.sin(t*2.8+phase)*width*.7;
        const g=ctx.createLinearGradient(0,h,0,h-height);
        g.addColorStop(0,'rgba(255,220,130,.86)');g.addColorStop(.24,'rgba(245,122,31,.73)');g.addColorStop(.65,'rgba(190,55,15,.36)');g.addColorStop(1,'rgba(120,40,12,0)');
        ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-width,h+8);
        ctx.bezierCurveTo(x-width*1.1,h-height*.35,x+width+sway,h-height*.58,x+sway,h-height);
        ctx.bezierCurveTo(x+sway-width*.35,h-height*.42,x+width,h-height*.25,x+width,h+8);
        ctx.closePath();ctx.fill();
      }
    }
    // Soft ceiling accumulation, with varied drift and depth; keep central targets readable.
    ctx.globalCompositeOperation='source-over';
    for(let j=0;j<15;j++) {
      const size=w*(.25+seed(j+720)*.3);
      const x=((seed(j+800)*w+t*(6+seed(j+860)*9))%(w+size))-size*.5;
      const y=h*(.01+seed(j+940)*.15)-size*.4+Math.sin(t*.22+j)*h*.025;
      ctx.globalAlpha=.25+pressure*.65;
      ctx.drawImage(smoke,x,y,size,size*(.65+seed(j+980)*.4));
    }
    ctx.globalAlpha=1;
    ctx.globalCompositeOperation='screen';
    for(const p of motes) {
      const x=p.x*w+Math.sin(t*.65+p.y*30)*(8+p.z*15);
      const y=h-((p.y*h+t*(12+p.v*22)*(1+pressure))%(h*1.15));
      const alpha=(.12+pressure*.55)*(1-y/h);
      ctx.fillStyle=`rgba(255,${Math.round(142+p.z*87)},83,${Math.max(0,alpha)})`;
      ctx.beginPath();ctx.ellipse(x,y,.5+p.z*1.1,1+p.z*1.8,-.3,0,Math.PI*2);ctx.fill();
    }
    ctx.globalCompositeOperation='source-over';
  }
  frame=requestAnimationFrame(draw);
  window.addEventListener('pagehide',()=>cancelAnimationFrame(frame),{once:true});
})();
