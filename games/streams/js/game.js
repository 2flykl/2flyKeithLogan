
const canvas=document.getElementById('canvas'),ctx=canvas.getContext('2d');
const music=document.getElementById('music');music.volume=.34;
const ui={p:document.getElementById('pennies'),a:document.getElementById('attention'),c:document.getElementById('current'),d:document.getElementById('distance'),
tutorial:document.getElementById('tutorial'),tt:document.getElementById('tutorialTitle'),tx:document.getElementById('tutorialText'),
toast:document.getElementById('toast'),ending:document.getElementById('ending'),et:document.getElementById('endingTitle'),es:document.getElementById('endingStats'),em:document.getElementById('endingMessage')};

let W=0,H=0,dpr=1,running=false,last=0,elapsed=0,cameraY=0;
let keys={left:false,right:false,jump:false};
let player,platforms=[],coins=[],orbs=[],particles=[],waterLines=[],pennies=0,attention=0,finishY=-4200;
let images={},frames={idle:[],run:[],jump:[],land:[]},animState='idle',animFrame=0,animClock=0;

const platformFiles=['vinyl','cd','cassette','equipment','guitars','crates','debris','nature','awards','hero'];
const loadImage=src=>new Promise(res=>{const i=new Image();i.onload=()=>res(i);i.src=src});
async function loadAssets(){
  for(const n of platformFiles)images[n]=await loadImage(`assets/platforms/${n}.png`);
  for(const a of Object.keys(frames)){
    const counts={idle:8,run:10,jump:12,land:8}[a];
    for(let i=0;i<counts;i++)frames[a].push(await loadImage(`assets/character/${a}/${String(i).padStart(2,'0')}.png`));
  }
  images.surface=await loadImage('assets/water/surface.jpg');
  images.stream=await loadImage('assets/water/stream.jpg');
  images.foam=await loadImage('assets/water/foam.jpg');
  images.reflection=await loadImage('assets/water/reflection.jpg');
  images.waterfall=await loadImage('assets/water/waterfall.jpg');
}

function resize(){dpr=Math.min(devicePixelRatio||1,2);W=canvas.clientWidth;H=canvas.clientHeight;canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
addEventListener('resize',resize);resize();

function reset(){
  elapsed=0;cameraY=0;pennies=0;attention=0;coins=[];orbs=[];particles=[];
  player={x:W*.48,y:-80,vx:0,vy:1,w:50,h:108,onGround:false,headScale:1,landTimer:0};
  platforms=[];
  let y=45;
  for(let i=0;i<58;i++){
    const progress=i/57;
    const tutorial=i<8;
    const type=platformFiles[i%platformFiles.length];
    const width=tutorial?Math.min(270,W*.42):110+Math.random()*145;
    platforms.push({
      x:30+Math.random()*Math.max(40,W-width-60),
      y:y-i*(tutorial?96:84+Math.random()*30),
      w:width,h:34,type,
      anchor:i%11===0 && i>5,
      vx:(Math.random()-.5)*(tutorial?.12:.28+progress*.38),
      drift:tutorial?.30:.72+progress*1.5,
      used:false
    });
  }
  finishY=platforms[platforms.length-1].y-150;
  for(let i=0;i<42;i++)waterLines.push({x:Math.random()*W,y:Math.random()*H,s:.6+Math.random()*1.8,o:.04+Math.random()*.12});
}

function difficulty(){
  if(elapsed<15)return {current:.65,coin:.004,orb:.0008,gap:1};
  const t=Math.min((elapsed-15)/135,1);
  return {current:1.1+t*2.35,coin:.005+t*.003,orb:.0015+t*.004,gap:1+t*.6};
}
function showToast(t){ui.toast.textContent=t;ui.toast.classList.add('show');clearTimeout(ui.toast._t);ui.toast._t=setTimeout(()=>ui.toast.classList.remove('show'),650)}
function updateTutorial(){
  if(elapsed<5){ui.tt.textContent='GET YOUR BALANCE';ui.tx.textContent='Use ← → to stay centered on the platform.'}
  else if(elapsed<10){ui.tt.textContent='PRACTICE THE JUMP';ui.tx.textContent='Press SPACE or JUMP. The opening platforms are intentionally forgiving.'}
  else if(elapsed<15){ui.tt.textContent='WATCH THE CURRENT';ui.tx.textContent='The river begins gently. It will not stay that way.'}
  else ui.tutorial.classList.add('hide');
}
function spawn(){
  const d=difficulty(),top=cameraY-110;
  if(Math.random()<d.coin && coins.length<5)coins.push({x:30+Math.random()*(W-60),y:top,r:8,spin:0});
  if(elapsed>12 && Math.random()<d.orb && orbs.length<3){
    const size=Math.random()<.1?3:Math.random()<.32?2:1;
    orbs.push({x:30+Math.random()*(W-60),y:top,r:11*size,val:size===1?1:size===2?3:7,rot:0});
  }
}
function collide(p){return player.x+player.w>p.x && player.x<p.x+p.w && player.y+player.h>=p.y && player.y+player.h<=p.y+34 && player.vy>=0}
function update(dt){
  elapsed+=dt/60;updateTutorial();const d=difficulty();
  player.vx+=(keys.left?-.52:keys.right?.52:0)*dt;
  player.vx*=Math.pow(.88,dt);
  const precision=1+(player.headScale-1)*.7;
  player.x+=player.vx*dt/precision;
  player.x=Math.max(0,Math.min(W-player.w,player.x));
  player.vy+=.55*dt;player.y+=player.vy*dt+d.current*.12*dt;
  let wasGround=player.onGround;player.onGround=false;
  for(const p of platforms){
    if(!p.anchor)p.y+=d.current*p.drift*.24*dt;
    p.x+=p.vx*dt;if(p.x<0||p.x+p.w>W)p.vx*=-1;
    if(collide(p)){player.y=p.y-player.h;player.vy=0;player.onGround=true;if(keys.jump){player.vy=-12.2;player.onGround=false;burst(player.x+player.w/2,p.y,'splash')}}
  }
  if(player.onGround&&!wasGround){player.landTimer=10;burst(player.x+player.w/2,player.y+player.h,'land')}
  if(player.landTimer>0)player.landTimer-=dt;

  cameraY+=(player.y-H*.33-cameraY)*.045;
  spawn();
  for(const c of coins){c.y+=d.current*.8*dt;c.spin+=.12*dt}
  for(const o of orbs){o.y+=d.current*1.05*dt;o.rot+=.06*dt}
  coins=coins.filter(c=>{if(Math.hypot(c.x-(player.x+player.w/2),c.y-(player.y+35))<30){pennies++;showToast('+1 VALUE');burst(c.x,c.y,'coin');return false}return c.y-cameraY<H+80});
  orbs=orbs.filter(o=>{if(Math.hypot(o.x-(player.x+player.w/2),o.y-(player.y+35))<o.r+25){attention+=o.val;showToast(`+${o.val} ATTENTION`);burst(o.x,o.y,'orb');return false}return o.y-cameraY<H+90});
  player.headScale=1+Math.min(Math.max(attention-pennies,0)*.026,.5);
  particles.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=.04*dt;p.life-=dt});particles=particles.filter(p=>p.life>0);

  if(Math.abs(player.vx)>1.2&&player.onGround)animState='run';
  else if(!player.onGround)animState='jump';
  else if(player.landTimer>0)animState='land';
  else animState='idle';
  animClock+=dt;if(animClock>5){animClock=0;animFrame=(animFrame+1)%frames[animState].length}

  if(player.y-cameraY>H+120)finish(false);
  if(player.y<finishY+80)finish(true);
  const progress=Math.max(0,Math.min(1,(45-player.y)/(45-finishY)));
  ui.p.textContent=pennies;ui.a.textContent=attention;ui.d.textContent=Math.round(progress*100)+'%';
  ui.c.textContent=d.current<1?'CALM':d.current<2?'PUSHING':d.current<3?'STRONG':'RUSHING';
}
function burst(x,y,type){for(let i=0;i<10;i++)particles.push({x,y,vx:(Math.random()-.5)*3,vy:-Math.random()*2.8,life:28,type})}
function drawWater(){
  const grad=ctx.createLinearGradient(0,0,0,H);grad.addColorStop(0,'#77bac7');grad.addColorStop(.45,'#176477');grad.addColorStop(1,'#062731');ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
  ctx.globalAlpha=.20;for(let y=-80+(elapsed*28)%80;y<H;y+=80)ctx.drawImage(images.stream,0,y,W,100);ctx.globalAlpha=1;
  waterLines.forEach((l,i)=>{const y=(l.y+elapsed*18*(i%3+1))%H;ctx.strokeStyle=`rgba(255,255,255,${l.o})`;ctx.lineWidth=l.s;ctx.beginPath();ctx.moveTo(l.x,y);ctx.bezierCurveTo(l.x+26,y+18,l.x-20,y+55,l.x+18,y+90);ctx.stroke()});
  const lip=H-64;ctx.globalAlpha=.35;ctx.drawImage(images.foam,0,lip,W,64);ctx.globalAlpha=1;
}
function drawPlatforms(){
  for(const p of platforms){const sy=p.y-cameraY;if(sy<-140||sy>H+100)continue;
    ctx.save();ctx.translate(p.x+p.w/2,sy+p.h/2);ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=18;
    const img=images[p.type];ctx.globalAlpha=.96;ctx.drawImage(img,-p.w/2,-p.h*1.7,p.w,p.h*3.4);ctx.restore();
  }
}
function drawStage(){const y=finishY-cameraY;ctx.fillStyle='#111';ctx.fillRect(W*.22,y,W*.56,22);ctx.fillStyle='#e4a55f';ctx.fillRect(W*.29,y-86,W*.42,86);ctx.fillStyle='#111';ctx.font='900 22px Arial';ctx.textAlign='center';ctx.fillText('STAGE',W/2,y-36)}
function drawCoins(){for(const c of coins){const y=c.y-cameraY;ctx.save();ctx.translate(c.x,y);ctx.scale(Math.abs(Math.sin(c.spin))+.15,1);ctx.fillStyle='#b06b2a';ctx.beginPath();ctx.arc(0,0,c.r,0,7);ctx.fill();ctx.fillStyle='#ffd79b';ctx.font='900 11px Arial';ctx.textAlign='center';ctx.fillText('¢',0,4);ctx.restore()}}
function drawOrbs(){for(const o of orbs){const y=o.y-cameraY;ctx.save();ctx.translate(o.x,y);ctx.rotate(o.rot);ctx.fillStyle='#1877d1';ctx.shadowColor='#1877d1';ctx.shadowBlur=15;ctx.beginPath();ctx.arc(0,0,o.r,0,7);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#fff';ctx.lineWidth=Math.max(2,o.r*.15);ctx.beginPath();ctx.moveTo(-o.r*.34,-o.r*.34);ctx.lineTo(o.r*.34,o.r*.34);ctx.moveTo(o.r*.34,-o.r*.34);ctx.lineTo(-o.r*.34,o.r*.34);ctx.stroke();ctx.restore()}}
function drawPlayer(){
  const sy=player.y-cameraY,img=frames[animState][animFrame%frames[animState].length];
  ctx.save();ctx.translate(player.x+player.w/2,sy);if(player.vx<-.2)ctx.scale(-1,1);
  ctx.shadowColor='rgba(0,0,0,.5)';ctx.shadowBlur=16;
  const h=130,w=95;ctx.drawImage(img,-w/2,-10,w,h);
  if(player.headScale>1.02){ctx.fillStyle='rgba(24,119,209,.18)';ctx.beginPath();ctx.arc(0,23,22*player.headScale,0,7);ctx.fill()}
  ctx.restore();
}
function drawParticles(){for(const p of particles){ctx.globalAlpha=p.life/28;ctx.fillStyle=p.type==='coin'?'#ffd08a':p.type==='orb'?'#79bfff':'#fff';ctx.beginPath();ctx.arc(p.x,p.y-cameraY,1.5+(28-p.life)*.05,0,7);ctx.fill()}ctx.globalAlpha=1}
function draw(){
  ctx.clearRect(0,0,W,H);drawWater();drawStage();drawPlatforms();drawCoins();drawOrbs();drawParticles();drawPlayer();
}
function loop(t){if(!running)return;const dt=Math.min((t-last)/16.67,2);last=t;update(dt);draw();requestAnimationFrame(loop)}
function finish(win){if(!running)return;running=false;music.pause();ui.ending.classList.remove('hidden');ui.et.textContent=win?'YOU REACHED THE STAGE.':'THE CURRENT WON THIS ROUND.';ui.es.textContent=`Pennies: ${pennies} · Attention: ${attention}`;ui.em.textContent=win?(pennies>attention?'Whew. You barely created more value than attention.':'You reached the stage, but attention still outweighed value.'):'Attention moves quickly. Value requires direction, timing, and balance.'}
document.getElementById('startBtn').onclick=async()=>{document.getElementById('intro').classList.add('hidden');reset();running=true;music.currentTime=0;music.play().catch(()=>{});last=performance.now();requestAnimationFrame(loop)};
document.getElementById('exitBtn').onclick=()=>{if(parent!==window)parent.postMessage('closeExperience','*');else location.href='../../#experiences'};
addEventListener('keydown',e=>{if(e.key==='ArrowLeft')keys.left=true;if(e.key==='ArrowRight')keys.right=true;if(e.code==='Space')keys.jump=true});
addEventListener('keyup',e=>{if(e.key==='ArrowLeft')keys.left=false;if(e.key==='ArrowRight')keys.right=false;if(e.code==='Space')keys.jump=false});
function hold(id,key){const el=document.getElementById(id);el.onpointerdown=()=>keys[key]=true;el.onpointerup=el.onpointerleave=()=>keys[key]=false}
hold('leftBtn','left');hold('rightBtn','right');hold('jumpBtn','jump');
loadAssets().then(()=>{reset();draw()});
