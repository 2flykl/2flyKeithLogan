window.FlyverseEngine = class FlyverseEngine {
  constructor(canvas,data){
    this.canvas=canvas; this.ctx=canvas.getContext('2d'); this.data=data;
    this.dpr=Math.min(window.devicePixelRatio||1,2); this.w=0; this.h=0;
    this.camera={x:0,y:0,zoom:.62}; this.target={...this.camera};
    this.pointer={x:innerWidth/2,y:innerHeight/2}; this.reticleWorld={x:0,y:0};
    this.drag={on:false,x:0,y:0,cx:0,cy:0,moved:false}; this.hover=null; this.onSelect=null;
    this.stars=this.makeStars(420); this.t=0; this.last=performance.now();
    this.resize(); this.bind(); requestAnimationFrame(t=>this.loop(t));
  }
  makeStars(n){const a=[];for(let i=0;i<n;i++)a.push({x:(Math.random()-.5)*3600,y:(Math.random()-.5)*2200,s:Math.random()*1.8+.2,a:Math.random()*.75+.2});return a}
  resize(){const r=this.canvas.getBoundingClientRect();this.w=r.width;this.h=r.height;this.canvas.width=Math.round(this.w*this.dpr);this.canvas.height=Math.round(this.h*this.dpr);this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0)}
  bind(){
    addEventListener('resize',()=>this.resize());
    this.canvas.addEventListener('pointermove',e=>{this.pointer={x:e.clientX,y:e.clientY}; if(this.drag.on){const dx=e.clientX-this.drag.x,dy=e.clientY-this.drag.y;if(Math.hypot(dx,dy)>3)this.drag.moved=true;this.target.x=this.drag.cx-dx/this.target.zoom;this.target.y=this.drag.cy-dy/this.target.zoom;} this.hover=this.pick(e.clientX,e.clientY)});
    this.canvas.addEventListener('pointerdown',e=>{this.drag={on:true,x:e.clientX,y:e.clientY,cx:this.target.x,cy:this.target.y,moved:false};this.canvas.setPointerCapture(e.pointerId)});
    this.canvas.addEventListener('pointerup',e=>{const moved=this.drag.moved;this.drag.on=false; if(!moved){const hit=this.pick(e.clientX,e.clientY); if(hit&&this.onSelect)this.onSelect(hit); else this.reticleWorld=this.screenToWorld(e.clientX,e.clientY)}});
    this.canvas.addEventListener('wheel',e=>{e.preventDefault(); const before=this.screenToWorld(e.clientX,e.clientY); const factor=Math.exp(-Math.max(-120,Math.min(120,e.deltaY))*.0019); this.target.zoom=Math.max(.16,Math.min(3.4,this.target.zoom*factor)); const after=this.screenToWorld(e.clientX,e.clientY,this.target); this.target.x += before.x-after.x; this.target.y += before.y-after.y; this.reticleWorld=before;},{passive:false});
  }
  worldToScreen(x,y,cam=this.camera){return {x:(x-cam.x)*cam.zoom+this.w/2,y:(y-cam.y)*cam.zoom+this.h/2}}
  screenToWorld(x,y,cam=this.camera){return {x:(x-this.w/2)/cam.zoom+cam.x,y:(y-this.h/2)/cam.zoom+cam.y}}
  pick(sx,sy){let best=null,bestD=1e9;for(const o of this.data.objects){const p=this.worldToScreen(o.x,o.y);const rr=Math.max(8,o.r*this.camera.zoom);const d=Math.hypot(sx-p.x,sy-p.y);if(d<rr+10&&d<bestD){best=o;bestD=d}}return best}
  focus(x,y,zoom=1.15){this.target.x=x;this.target.y=y;this.target.zoom=zoom}
  reset(){this.target={x:260,y:0,zoom:.48}}
  loop(now){const dt=Math.min(.05,(now-this.last)/1000);this.last=now;this.t+=dt;const k=1-Math.exp(-dt*6);this.camera.x+=(this.target.x-this.camera.x)*k;this.camera.y+=(this.target.y-this.camera.y)*k;this.camera.zoom+=(this.target.zoom-this.camera.zoom)*k;this.draw();requestAnimationFrame(t=>this.loop(t))}
  draw(){const c=this.ctx;c.clearRect(0,0,this.w,this.h);this.drawBg(c);this.drawGalaxies(c);this.drawObjects(c)}
  drawBg(c){c.save();for(const s of this.stars){const p=this.worldToScreen(s.x,s.y);if(p.x<-5||p.x>this.w+5||p.y<-5||p.y>this.h+5)continue;c.globalAlpha=s.a;c.fillStyle='#d9ecff';c.fillRect(p.x,p.y,s.s,s.s)}c.restore()}
  drawGalaxies(c){for(const e of this.data.eras){const p=this.worldToScreen(e.x,e.y);const r=Math.max(42,210*this.camera.zoom);if(p.x<-r*2||p.x>this.w+r*2||p.y<-r*2||p.y>this.h+r*2)continue;c.save();c.translate(p.x,p.y);c.rotate(this.t*.018+(e.x%7));for(let arm=0;arm<3;arm++){c.beginPath();for(let i=0;i<80;i++){const q=i/79,ang=q*6.2+arm*2.094;const rr=q*r;const x=Math.cos(ang)*rr*1.25,y=Math.sin(ang)*rr*.55;(i?c.lineTo(x,y):c.moveTo(x,y))}c.strokeStyle=this.hexAlpha(e.color,.22);c.lineWidth=Math.max(1,4*this.camera.zoom);c.stroke()}const g=c.createRadialGradient(0,0,0,0,0,r*.6);g.addColorStop(0,this.hexAlpha(e.color,.45));g.addColorStop(.35,this.hexAlpha(e.color,.14));g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.beginPath();c.arc(0,0,r*.7,0,Math.PI*2);c.fill();c.restore();c.fillStyle='#eaf3ff';c.font='700 12px system-ui';c.textAlign='center';c.fillText(e.years,p.x,p.y-r*.58-12);c.fillStyle='#7890aa';c.font='10px system-ui';c.fillText(e.name,p.x,p.y-r*.58+4)}}
  drawObjects(c){for(const o of this.data.objects){const e=this.data.eras.find(x=>x.id===o.era),p=this.worldToScreen(o.x,o.y),rr=Math.max(5,o.r*this.camera.zoom);if(p.x<-80||p.x>this.w+80||p.y<-80||p.y>this.h+80)continue;const pulse=1+Math.sin(this.t*1.3+o.x*.01)*.035;const r=rr*pulse;const g=c.createRadialGradient(p.x-r*.25,p.y-r*.3,r*.08,p.x,p.y,r);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.2,this.hexAlpha(e.color,.95));g.addColorStop(1,this.hexAlpha(e.color,.08));c.fillStyle=g;c.beginPath();c.arc(p.x,p.y,r,0,Math.PI*2);c.fill();c.strokeStyle=this.hover===o?'rgba(255,255,255,.9)':this.hexAlpha(e.color,.55);c.lineWidth=this.hover===o?2:1;c.stroke();if(this.camera.zoom>.48||this.hover===o){c.fillStyle='#eef6ff';c.font=`600 ${Math.max(10,12*this.camera.zoom)}px system-ui`;c.textAlign='center';c.fillText(o.title,p.x,p.y+r+16)}}}
  hexAlpha(hex,a){const h=hex.replace('#','');const n=parseInt(h,16);return `rgba(${n>>16},${(n>>8)&255},${n&255},${a})`}
};
