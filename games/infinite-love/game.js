import {SandGame,W,H,vertices,SHAPES} from './engine.js';
import {createSkinSystem} from './skins.js';
let skins;
const canvas=document.querySelector('#game'),ctx=canvas.getContext('2d'),game=new SandGame();const X=18,Y=105,S=2.2,BW=W*S,BH=H*S;const $=s=>document.querySelector(s);let last=0,acc=0,effects=[],beat=0, held=new Set(),repeatClock=0;const toolNames={tray:'LOVE LETTER',ramp:'PAPER RAMP',seesaw:'SEESAW',bucket:'GLASS BUCKET'};const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function text(t,x,y,size=10,color='#e9d8ff',align='left'){ctx.font=`bold ${size}px monospace`;ctx.fillStyle=skins?skins.color(color):color;ctx.textAlign=align;ctx.fillText(t,x,y);ctx.textAlign='left';}
function rect(x,y,w,h,c){ctx.fillStyle=skins?skins.color(c):c;ctx.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
function heart(x,y,s,c){const bits=['0110110','1111111','1111111','0111110','0011100','0001000'];for(let r=0;r<bits.length;r++)for(let q=0;q<7;q++)if(bits[r][q]==='1')rect(x+q*s,y+r*s,s,s,c);}
const background=document.createElement('canvas');background.width=1050;background.height=800;const bg=background.getContext('2d');let seed=128;function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647;}
function makeBackground(){const old=ctx;const g=bg.createLinearGradient(0,0,0,800);g.addColorStop(0,'#12052c');g.addColorStop(.55,'#251056');g.addColorStop(1,'#170a30');bg.fillStyle=g;bg.fillRect(0,0,1050,800);for(let i=0;i<140;i++){const x=Math.floor(rnd()*1050/2)*2,y=Math.floor(rnd()*800/2)*2;bg.fillStyle=['#a66dea','#7144a8','#4b2d77'][i%3];bg.fillRect(x,y,2,2);if(i%19===0){bg.fillRect(x-2,y,6,2);bg.fillRect(x,y-2,2,6);}}
 for(let layer=0;layer<3;layer++){bg.fillStyle=['#39216d','#251149','#130b30'][layer];const base=490+layer*85;bg.beginPath();bg.moveTo(0,800);for(let x=0;x<=1050;x+=8){let y=base+Math.sin(x*.022+layer*3)*46+Math.sin(x*.06)*17;bg.lineTo(x,Math.round(y/6)*6);}bg.lineTo(1050,800);bg.fill();for(let i=0;i<15;i++){const x=Math.floor(rnd()*1050/4)*4,y=base-10+rnd()*100,h=35+rnd()*50;bg.fillRect(x-2,y,4,h);for(let n=0;n<5;n++){const ww=8+n*4;bg.fillRect(x-ww/2,y+n*9,ww,8);}}}
 // Tiny lit cottage, a quiet nod to the reference's night landscape.
 bg.fillStyle='#0c0720';bg.fillRect(40,679,48,54);for(let i=0;i<6;i++)bg.fillRect(32+i*4,675-i*4,64-i*8,5);bg.fillStyle='#ffcc75';bg.fillRect(49,690,8,11);bg.fillRect(70,690,8,11);bg.fillStyle='#a87a48';bg.fillRect(61,711,9,22);}
makeBackground();
skins=createSkinSystem({ctx,original:background,reduce});
function drawShape(p){
 const pts=vertices(p),px=X+p.x*S,py=Y+p.y*S,bucket=p.type==='bucket';
 ctx.save();ctx.beginPath();pts.forEach(([x,y],i)=>i?ctx.lineTo(X+x*S,Y+y*S):ctx.moveTo(X+x*S,Y+y*S));ctx.closePath();
 ctx.fillStyle=bucket?skins.bucketFill:p.gray?skins.color('#727786'):skins.piece(p.type,p.color);ctx.fill();
 ctx.strokeStyle=p.rewardGlow>0?skins.color('#ffda7a'):p.repelGlow>0?skins.color('#f6b9ec'):game.active===p?(game.canPlace(p)?skins.color('#b7efff'):skins.color('#ff668a')):bucket?skins.color('#b7efff'):p.gray?skins.color('#acb0bb'):p.locked?skins.color('#e9b8ff'):skins.color('#fff3c7');ctx.lineWidth=game.active===p?2:1.3;ctx.stroke();
 if(bucket){
  ctx.translate(px,py);ctx.rotate(p.rotation*Math.PI/2);ctx.scale(p.widthScale||1,1);
  ctx.fillStyle='rgba(173,228,255,.06)';ctx.beginPath();ctx.moveTo(-14*S,-13*S);ctx.lineTo(14*S,-13*S);ctx.lineTo(10*S,9*S);ctx.lineTo(-10*S,9*S);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(216,247,255,.6)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(-16*S,-9*S);ctx.lineTo(-19*S,-16*S);ctx.lineTo(-12*S,-21*S);ctx.lineTo(12*S,-21*S);ctx.lineTo(19*S,-16*S);ctx.lineTo(16*S,-9*S);ctx.stroke();
  ctx.strokeStyle=p.fullTime>0?skins.color('#ffe8a1'):skins.color('#b7efff');ctx.beginPath();ctx.moveTo(-17*S,-13*S);ctx.lineTo(17*S,-13*S);ctx.stroke();
  ctx.strokeStyle='rgba(222,249,255,.3)';for(let y=-6;y<9;y+=6){ctx.beginPath();ctx.moveTo(9*S,y*S);ctx.lineTo(12*S,y*S);ctx.stroke();}
 }
 if(!bucket){
  ctx.save();ctx.translate(px,py);ctx.rotate((p.rotation||0)*Math.PI/2+(p.tiltAngle||0)+(p.balance||0));
  if(p.type==='tray'){
   ctx.strokeStyle=p.gray?skins.color('#b3b6c0'):skins.color('#b18c71');ctx.lineWidth=1;
   ctx.beginPath();ctx.moveTo(-12*S,6*S);ctx.lineTo(0,8*S);ctx.lineTo(12*S,6*S);ctx.stroke();
   heart(-3,5*S,1,p.gray?skins.color('#b0b4bf'):skins.color('#b24a65'));
   ctx.beginPath();ctx.moveTo(-17*S,-4*S);ctx.lineTo(-12*S,5*S);ctx.moveTo(17*S,-4*S);ctx.lineTo(12*S,5*S);ctx.stroke();
  }else if(p.type==='ramp'){
   ctx.strokeStyle=p.gray?skins.color('#b3b6c0'):skins.color('#ffd6d7');ctx.setLineDash([3,3]);ctx.beginPath();ctx.moveTo(-17*S,-7*S);ctx.lineTo(17*S,8*S);ctx.stroke();ctx.setLineDash([]);
  }else if(p.type==='seesaw'){
   ctx.strokeStyle=p.gray?skins.color('#b3b6c0'):skins.color('#f3d3a1');ctx.beginPath();ctx.moveTo(-21*S,-S);ctx.lineTo(21*S,-S);ctx.stroke();
  }
  ctx.restore();
  if(p.type==='seesaw'){ctx.fillStyle=p.gray?skins.color('#737984'):skins.color('#9b6fa3');ctx.beginPath();ctx.moveTo(px,py+3);ctx.lineTo(px-9,py+17);ctx.lineTo(px+9,py+17);ctx.closePath();ctx.fill();}
 }
 ctx.restore();
 const top=Y+Math.min(...pts.map(v=>v[1]))*S-11;
 if(p.gray){text('PASSING '+(p.side==='left'?'→':'←'),px,top,8,skins.color('#c3c5d1'),'center');}
 else if(bucket&&p.locked){text(p.rewardGlow>0?'+1 COLLECTION BUCKET':p.refillGlow>0?'CAPTURED · READY AGAIN':p.fullTime>0?'OVERFLOW!':p.rotation===0?Math.round((p.fill||0)*100)+'% · FILL ABOVE RIM':'KEEP UPRIGHT TO FILL',px,top-7,7,p.fullTime>0?skins.color('#ffe49b'):skins.color('#c1efff'),'center');}
 else if(p.transport){text((toolNames[p.type]||'TOOL')+(p.count?' · '+p.count+' GRAINS':''),px,top-6,8,skins.color('#f3dfb8'),'center');}
 if(p.locked&&p.transport){text(`${Math.ceil(p.remaining)}s · THEN RELEASE`,px,top-19,9,p.remaining<2?skins.color('#ff8e9b'):skins.color('#a9e8e0'),'center');}
 if(game.active===p){text(game.boost?'SKIPPING '+(p.side==='left'?'→':'←'):bucket?'ENTER: PLACE':'SPACE: TILT · ENTER: PLACE',px,top-19,8,game.boost?skins.color('#ffd06e'):skins.color('#fff2c3'),'center');}
}
function hourglass(x,y){rect(x-10,y,20,3,skins.color('#f6d294'));rect(x-10,y+37,20,3,skins.color('#f6d294'));ctx.strokeStyle=skins.color('#bb99df');ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x-8,y+4);ctx.lineTo(x+7,y+32);ctx.lineTo(x+7,y+36);ctx.lineTo(x-7,y+36);ctx.lineTo(x-7,y+32);ctx.lineTo(x+8,y+4);ctx.closePath();ctx.stroke();ctx.fillStyle=skins.color('#ffc764');ctx.beginPath();ctx.moveTo(x-6,y+8);ctx.lineTo(x+6,y+8);ctx.lineTo(x,y+19);ctx.fill();ctx.beginPath();ctx.moveTo(x-7,y+34);ctx.lineTo(x,y+26);ctx.lineTo(x+7,y+34);ctx.fill();rect(x,y+19,1,8,skins.color('#ffebaa'));}
function previewPiece(){
 const n=game.next,pts=SHAPES[n.type].map(([x,y])=>{for(let i=0;i<n.rotation;i++)[x,y]=[-y,x];return [x,y]});
 ctx.beginPath();pts.forEach(([x,y],i)=>{i?ctx.lineTo(980+x*1.45,166+y*1.45):ctx.moveTo(980+x*1.45,166+y*1.45)});ctx.closePath();ctx.fillStyle=n.type==='bucket'?skins.color('#b6e9f530'):skins.piece(n.type,n.color);ctx.fill();ctx.strokeStyle=skins.color('#ecdcff');ctx.stroke();
 text(n.side==='left'?'FROM LEFT →':'← FROM RIGHT',980,205,9,skins.color('#f4c878'),'center');
 text(toolNames[n.type]||n.type.toUpperCase(),980,226,10,skins.color('#d9b7f5'),'center');
 rect(925,270,110,121,skins.color('#29133b'));
 text('POSITION • PLACE',980,292,10,skins.color('#e4cbfb'),'center');
 text('↑ ↓ ← → MOVE',980,316,10,skins.color('#fff0c9'),'center');
 text('SPACE TILTS',980,337,10,skins.color('#ffda79'),'center');
 text('ENTER PLACES',980,358,10,skins.color('#a9e8e0'),'center');
 text('HOLD SHIFT TO SKIP',980,379,8,skins.color('#c3a5d5'),'center');
}
function bucket(){const x=947,y=447,w=69,h=79,ratio=Math.min(1,game.score/game.target);rect(x-3,y-2,w+6,8,skins.color('#f5ba74'));rect(x,y+6,w,h,skins.color('#59304a'));rect(x+4,y+9,w-8,h-13,skins.color('#7f4352'));rect(x+8,y+12,w-16,h-20,skins.color('#321d34'));const fill=Math.max(3,Math.round((h-22)*ratio));rect(x+8,y+h-8-fill,w-16,fill,skins.color('#e6a147'));for(let i=0;i<25;i++){const gx=x+9+(i*19)%(w-20),gy=y+h-9-((i*13)%Math.max(1,fill));rect(gx,gy,2,2,i%2?skins.color('#ffdc7b'):skins.color('#b97a36'));}rect(x+3,y+h-3,w-6,6,skins.color('#d68a5c'));text('∞',x+w/2,y+57,42,skins.color('#ffdf98'),'center');text('CAPTURED SAND',980,422,10,skins.color('#eee2ff'),'center');rect(941,552,80,8,skins.color('#3f2854'));rect(942,553,78*ratio,6,skins.color('#ffd275'));text(`${Math.round(ratio*100)}%`,980,582,15,skins.color('#ffe3b2'),'center');text(`${game.score.toLocaleString()} / ${game.target.toLocaleString()}`,980,604,10,skins.color('#bba8d1'),'center');}
function drawPlacementGuide(){
 // The collection rail follows each moving bucket instead of marking fixed docks.
 ctx.strokeStyle=skins.color('#8de1dc33');ctx.setLineDash([3,7]);ctx.beginPath();ctx.moveTo(X+5,Y+294*S);ctx.lineTo(X+BW-5,Y+294*S);ctx.stroke();ctx.setLineDash([]);
 for(const [i,q] of game.fleetBuckets().entries()){
  const x=X+q.x*S,y=Y+q.y*S;
  text((q.fleetDir>0?'→ ':'← ')+(q.starter?'COLLECT':'EARNED'),x,y+27*S,8,q.rewardGlow>0?skins.color('#ffda7a'):skins.color('#95c9ce'),'center');
 }
 const p=game.active;
 if(p){
  const pts=vertices(p),bottom=Math.max(...pts.map(v=>v[1]));let gx=p.x;
  if(p.type==='ramp'||p.type==='seesaw'){const exit=pts.reduce((a,b)=>b[1]>a[1]?b:a);gx=exit[0];}
  if(p.type==='tray'&&Math.abs(p.tiltAngle||0)>.01){const a=p.tiltAngle||0,side=a>0?17:-17;gx=p.x+side*Math.cos(a)+6*Math.sin(a);}
  const ix=Math.max(0,Math.min(W-1,Math.round(gx)));let landing=H-1,catcher=null;
  for(let y=Math.max(0,Math.ceil(bottom)+1);y<H;y++){
   const id=game.mask[y*W+ix];
   if(id&&id!==p.id){landing=y;catcher=game.pieces.find(q=>q.id===id);break;}
   if(game.sand[y*W+ix]&&game.rest[y*W+ix]>=8){landing=y;break;}
  }
  const color=catcher?.type==='bucket'?skins.color('#9ce6e0'):skins.color('#ffd17b');
  ctx.strokeStyle=color+'88';ctx.setLineDash([3,6]);ctx.beginPath();ctx.moveTo(X+ix*S,Y+(bottom+2)*S);ctx.lineTo(X+ix*S,Y+landing*S);ctx.stroke();ctx.setLineDash([]);
  ctx.beginPath();ctx.moveTo(X+(ix-4)*S,Y+(landing-4)*S);ctx.lineTo(X+ix*S,Y+landing*S);ctx.lineTo(X+(ix+4)*S,Y+(landing-4)*S);ctx.stroke();
 }
 if(game.blockedGhost){
  const points=vertices(game.blockedGhost);ctx.strokeStyle=skins.color('#ff597d');ctx.fillStyle=skins.color('#ff597d22');ctx.lineWidth=2;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(X+x*S,Y+y*S):ctx.moveTo(X+x*S,Y+y*S));ctx.closePath();ctx.fill();ctx.stroke();
  text('BLOCKED',X+game.blockedGhost.x*S,Y+game.blockedGhost.y*S-40,10,skins.color('#ff8ca5'),'center');
 }
}
function draw(now){ctx.imageSmoothingEnabled=false;skins.drawBackground(now,game.state);rect(910,0,140,800,skins.color('#100821dc'));rect(909,0,2,800,skins.color('#715096'));rect(12,100,1,690,skins.color('#694290'));rect(902,100,1,690,skins.color('#694290'));text(skins.label,25,28,10,skins.color('#bc9adb'));text('INFINITE LOVE',25,52,21,skins.color('#ffd184'));heart(26,65,2,skins.color('#f77da4'));rect(48,71,85,1,skins.color('#bc648c'));hourglass(X+game.source.x*S,59);text(game.source.pause>0?'HOLDING':'SWEEP '+(game.source.target>game.source.x?'→':'←'),X+game.source.x*S,101,7,skins.color('#f9d993'),'center');text('∞',982,48,38,skins.color('#e7b2fa'),'center');text('NEXT PIECE',980,117,10,skins.color('#bda2d8'),'center');previewPiece();ctx.save();ctx.beginPath();ctx.rect(X,Y,BW,BH);ctx.clip();ctx.setLineDash([4,5]);ctx.strokeStyle=game.danger>.65?skins.color('#ff5377'):skins.color('#d978aa99');ctx.beginPath();ctx.moveTo(X,Y+game.lossLine*S);ctx.lineTo(X+BW,Y+game.lossLine*S);ctx.stroke();ctx.setLineDash([]);text('GROUND SAND LIMIT',X+BW-5,Y+game.lossLine*S-8,8,skins.color('#f091bd'),'right');drawPlacementGuide();for(const p of game.pieces)drawShape(p);const colors=['',skins.color('#ffc874'),skins.color('#ffe4a1'),skins.color('#e9a43b'),skins.color('#ffdc72')];for(let y=0;y<H;y++)for(let x=0;x<W;x++){const c=game.sand[y*W+x];if(c)rect(X+x*S,Y+y*S,S,S,colors[c]);}if(game.active){const p=game.active;const pos=p.side==='left'?X+3:X+BW-3;const wave=reduce?1:.5+.5*Math.sin(now/120);text(p.side==='left'?'›':'‹',pos,Y+p.y*S+5,24,`rgba(255,214,137,${wave})`,p.side==='left'?'left':'right');}ctx.restore();bucket();text(`${game.fleetBuckets().length} / ${game.fleetLimit} COLLECTORS`,980,645,8,skins.color('#9fded9'),'center');text('COLLECT',980,675,9,skins.color('#ac8fcb'),'center');text('12,000 GRAINS',980,696,11,skins.color('#ffdea5'),'center');heart(970,724,3,skins.color('#a266d5'));for(const f of effects){const a=1-f.life/f.max;ctx.globalAlpha=Math.max(0,a);if(f.type==='capture'){const t=f.life/f.max;const xx=f.x+(980-f.x)*t,yy=f.y+(473-f.y)*t-Math.sin(t*Math.PI)*70;for(let i=0;i<10;i++)rect(xx+Math.sin(i*4)*8,yy+Math.cos(i*2)*7,3,3,skins.color('#ffd576'));text(`+${f.n}`,f.x,f.y-f.life*20,13,skins.color('#ffe6a1'),'center');}else if(f.type==='earned'){
 const t=Math.min(1,f.life/f.max),ease=1-(1-t)**3;
 const ex=f.x+(f.toX-f.x)*ease,ey=f.y+(f.toY-f.y)*ease;
 ctx.strokeStyle=skins.color('#ffdc84');ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ex-17*S,ey-13*S);ctx.lineTo(ex-13*S,ey+13*S);ctx.lineTo(ex+13*S,ey+13*S);ctx.lineTo(ex+17*S,ey-13*S);ctx.stroke();
 text('+1 BUCKET',ex,ey-38,13,skins.color('#ffe3a0'),'center');
 }else{ctx.strokeStyle=skins.color('#ffe3a0');ctx.strokeRect(f.x-12-f.life*15,f.y-12-f.life*15,24+f.life*30,24+f.life*30);}ctx.globalAlpha=1;}}
function announce(msg){$('#status').textContent=msg;}
function showModal(title,body,button){$('#overlayTitle').textContent=title;$('#overlayText').innerHTML=body;$('#start').textContent=button;$('#overlay').hidden=false;}
function playSong(){return $('#song').play().catch(()=>announce('Soundtrack is ready. Press Play song if your browser blocks it.'));}
function start(){const resume=game.state==='paused';if(resume){game.state='playing';}else{game.reset();game.state='playing';effects=[];$('#song').currentTime=0;}$('#overlay').hidden=true;$('#pause').textContent='Ⅱ PAUSE';held.clear();announce('Arrows position · Space tilts · Enter places · Hold Shift to skip. Fill the glass buckets.');last=performance.now();acc=0;if(!musicPaused)playSong();}
function pause(){if(game.state==='playing'){game.state='paused';held.clear();game.setBoost(false);game.setSteering(false);$('#song').pause();$('#pause').textContent='▶ RESUME';showModal('A moment to breathe.','Your sand is waiting right here.','KEEP FLOWING →');}else if(game.state==='paused')start();}
function action(key) {
 if(game.state!=='playing')return;
 if(key==='Enter'){game.place();held.clear();return;}
 if(key==='Space'){if(game.active?.type==='bucket')announce('Buckets stay upright. Press Enter to place it.');else if(game.rotate())announce('Tilt set. Press Enter to hold this position for 8 seconds.');return;}
 if(key==='ArrowLeft')game.move(-4);
 if(key==='ArrowRight')game.move(4);
 if(key==='ArrowUp')game.move(0,-4);
 if(key==='ArrowDown')game.move(0,4);
}
function press(key){if(held.has(key))return;held.add(key);repeatClock=.14;game.setSteering([...held].some(k=>k.startsWith('Arrow')));action(key);}
function release(key){held.delete(key);if(key==='Shift')game.setBoost(false);game.setSteering([...held].some(k=>k.startsWith('Arrow')));}
function updateInput(dt){
 if(game.state!=='playing')return;
 const steering=[...held].some(k=>k.startsWith('Arrow'));
 game.setSteering(steering);game.setBoost(held.has('Shift')&&!steering);repeatClock-=dt;
 if(repeatClock<=0){repeatClock=.068;
  const dx=(Number(held.has('ArrowRight'))-Number(held.has('ArrowLeft')))*4;
  const dy=(Number(held.has('ArrowDown'))-Number(held.has('ArrowUp')))*4;
  if(dx||dy)game.move(dx,dy);
 }
}
$('#start').onclick=start;$('#pause').onclick=pause;
$('#restart').onclick=()=>{held.clear();game.reset();effects=[];$('#song').pause();$('#song').currentTime=0;showModal('A fresh beginning.','Position with arrows. Tilt with Space. Place with Enter.<br>Guide 12,000 grains into the glass buckets.','LET IT FLOW →');$('#pause').textContent='Ⅱ PAUSE';announce('Ready when you are.');};
const keys=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space','Enter','Shift'];
const normalizeKey=e=>({' ':'Space','Spacebar':'Space','Return':'Enter','Left':'ArrowLeft','Right':'ArrowRight','Up':'ArrowUp','Down':'ArrowDown'}[e.key]||e.key);window.addEventListener('keydown',e=>{if(e.target.matches('input')||e.target.closest?.('.skin-picker'))return;const key=normalizeKey(e);if(key.toLowerCase()==='p'){e.preventDefault();if(!e.repeat)pause();return;}if(keys.includes(key)&&game.state==='playing'){e.preventDefault();if(!e.repeat)press(key);}});
window.addEventListener('keyup',e=>{const key=normalizeKey(e);if(keys.includes(key)){e.preventDefault();release(key);}});
window.addEventListener('blur',()=>{held.clear();game.setBoost(false);game.setSteering(false);});
document.querySelectorAll('[data-key]').forEach(b=>{b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);press(b.dataset.key);});for(const event of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(event,()=>release(b.dataset.key));b.addEventListener('click',e=>{if(e.detail===0)action(b.dataset.key);});});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&game.state==='playing')pause();});
let musicPaused=false;
$('#song').volume=.7;
$('#songToggle').onclick=()=>{const song=$('#song');musicPaused=!song.paused;if(song.paused){musicPaused=false;playSong();}else song.pause();};
$('#muteSong').onclick=()=>{const song=$('#song');song.muted=!song.muted;$('#muteSong').textContent=song.muted?'Sound off':'Sound on';$('#muteSong').setAttribute('aria-label',song.muted?'Unmute soundtrack':'Mute soundtrack');};
$('#songVolume').oninput=e=>{$('#song').volume=Number(e.target.value);};
$('#song').onplay=()=>$('#songToggle').textContent='Pause song';
$('#song').onpause=()=>$('#songToggle').textContent='Play song';
$('#song').onerror=()=>announce('The soundtrack could not load. Reload to try again.');
function frame(now){const elapsed=Math.min(.1,(now-(last||now))/1000);last=now;if(game.state==='playing'){acc+=elapsed;while(acc>=1/60){updateInput(1/60);game.step();acc-=1/60;}effects.forEach(f=>f.life+=elapsed);effects=effects.filter(f=>f.life<f.max);}for(const e of game.events.splice(0)){if(e.type==='capture'){effects.push({...e,x:X+e.x*S,y:Y+e.y*S,life:0,max:1.1});announce(`Captured ${e.n} grains. ${game.score} of ${game.target} collected.`);}if(e.type==='earned'){effects.push({...e,x:X+e.x*S,y:Y+e.y*S,toX:X+e.toX*S,toY:Y+e.toY*S,life:0,max:1.3});announce(`Bucket earned! ${e.total} moving buckets now collect sand for you.`);}if(e.type==='place'){effects.push({...e,x:X+e.x*S,y:Y+e.y*S,life:0,max:.35});announce(e.bucket?'Bucket placed. Fill it above the brim to earn another bottom collector.':'Tool placed for 8 seconds. Set up your next pour.');}if(e.type==='blocked')announce('Cannot place here. Stay clear of other items and above the moving collection row.');if(e.type==='expire')announce('Tool released its sand. Watch where it lands.');if(e.type==='entry'){held.clear();announce(e.bucket?'Bucket arriving: arrows position · Enter places it. Sand never locks it.':`${toolNames[e.tool]||'Tool'} from the ${e.side}. Arrows position · Space tilts · Enter places for 8 seconds.`);}if(e.type==='refill')announce('A fresh starting bucket is ready for another pour.');if(e.type==='gray')announce('Gray passing tool: use its movement to redirect the sand.');if(e.type==='miss')announce(e.bucket?'Bucket drifted away. Another arrives in four pieces.':'Piece passed through. Watch the next one.');if(e.type==='won'){showModal('Love, captured.',`You caught ${game.score} grains in ${Math.round(game.time)} seconds.<br>${game.captures} little moments. One infinite love.`,'PLAY AGAIN →');announce('Bucket filled! You won.');}if(e.type==='lost'){$('#song').pause();showModal('Time caught up.',`You saved ${game.score} grains.<br>Ground sand rose above the starting buckets.<br>Redirect spills and catch more sand before the floor fills.`,'TRY AGAIN →');announce('Ground sand passed the bucket-rim limit. Try again.');}}
 $('#runInfo').textContent=game.state==='ready'?'12,000 GRAINS · MOVING SANDS':`${Math.floor(game.time/60)}:${String(Math.floor(game.time%60)).padStart(2,'0')} · ${game.captures} CAPTURES`;$('#controlHint').textContent=game.boost?'SKIPPING · Release Shift to slow down':'ARROWS move · SPACE tilts · ENTER places · Hold SHIFT skips';$('#rotatePiece').disabled=!game.active||game.active.type==='bucket'||game.state!=='playing';$('#placePiece').disabled=!game.active||game.state!=='playing';$('#skipPiece').disabled=!game.active||game.state!=='playing';draw(now);requestAnimationFrame(frame);}requestAnimationFrame(frame);
