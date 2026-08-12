(() => {
'use strict';
const canvas=document.getElementById('gameCanvas'),ctx=canvas.getContext('2d');
const video=document.getElementById('performanceVideo');
const $=id=>document.getElementById(id);
const UI={section:$('sectionName'),hypeFill:$('hypeFill'),hypeText:$('hypeText'),score:$('scoreText'),combo:$('comboText'),judge:$('judgeText'),banner:$('sectionBanner'),bannerText:$('bannerText'),call:$('callPrompt'),start:$('startScreen'),pause:$('pauseScreen'),result:$('resultScreen')};
const BPM=198, beat=60/BPM, duration=94.876735, travel=1.32, hitY=.82;
const laneKeys={ArrowLeft:0,KeyA:0,ArrowUp:1,KeyW:1,ArrowRight:2,KeyD:2,ArrowDown:3,KeyS:3};
const sections=[
 {t:0,name:'COUNT-IN',banner:'ENTER THE FORMATION',mode:'intro',cam:'march',density:.38},
 {t:9.5,name:'DRUMLINE CADENCE',banner:'DRUMLINE — LOCK THE POCKET',mode:'drums',cam:'drums',density:.82},
 {t:24.5,name:'BRASS ATTACK',banner:'BRASS — HIT & HOLD',mode:'brass',cam:'brass',density:.76},
 {t:39.8,name:'FIELD FORMATION',banner:'FULL BAND — MOVE IN TIME',mode:'formation',cam:'wide',density:.68},
 {t:55.5,name:'CALL & RESPONSE',banner:'THE BAND CALLS — YOU ANSWER',mode:'response',cam:'switch',density:.9},
 {t:70.5,name:'SHOWTIME',banner:'NO BRAKES — FULL BAND',mode:'showtime',cam:'rush',density:1},
 {t:85.4,name:'TIGER CALL',banner:'BUILD IT. HOLD IT. UNLEASH IT.',mode:'finale',cam:'finale',density:1.1}
];
let notes=[],particles=[],running=false,paused=false,last=0,score=0,combo=0,maxCombo=0,hype=0,perfect=0,good=0,miss=0,sectionIndex=-1,tigerCall=false,callWindow=false,held=new Set(),allHitTimes=[],flash=0,shake=0,showBeat=0;
const sprites=new Image(); sprites.src='assets/sprites/tiger_band_sheet.png';
const fx=new Image(); fx.src='assets/sprites/effects_sheet.png';

function resize(){const dpr=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*dpr;canvas.height=innerHeight*dpr;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(dpr,0,0,dpr,0,0)} addEventListener('resize',resize);resize();
function hash(n){let x=Math.sin(n*12.9898+78.233)*43758.5453;return x-Math.floor(x)}
function getSection(t){let idx=0;for(let i=0;i<sections.length;i++)if(t>=sections[i].t)idx=i;return [sections[idx],idx]}
function generateChart(){notes=[];const offset=.62;let bi=0;for(let t=offset;t<duration-.3;t+=beat,bi++){
  const [s]=getSection(t); const d=s.density; if(hash(bi*4.1)>d)continue;
  let lane=Math.floor(hash(bi*7.7)*4);
  if(s.mode==='intro') lane=bi%4;
  if(s.mode==='drums') lane=[0,2,0,1,2,0,3,2][bi%8];
  if(s.mode==='formation') lane=[0,0,1,2,3,2,1,3][bi%8];
  if(s.mode==='response' && bi%8<4 && hash(bi)<.45) continue;
  let type='tap',len=0;
  if((s.mode==='brass'||s.mode==='showtime') && bi%12===4){type='hold';len=beat*(s.mode==='showtime'?2:3)}
  notes.push({t,lane,type,len,hit:false,missed:false});
  if((s.mode==='showtime'||s.mode==='finale') && bi%16===10){let l2=(lane+2)%4;notes.push({t,lane:l2,type:'tap',len:0,hit:false,missed:false,chord:true})}
  if(s.mode==='finale' && bi%6===0){notes.push({t:t+beat/2,lane:(lane+1)%4,type:'tap',len:0,hit:false,missed:false})}
 }}
function reset(){generateChart();particles=[];score=combo=maxCombo=hype=perfect=good=miss=0;sectionIndex=-1;tigerCall=false;callWindow=false;allHitTimes=[];UI.score.textContent='0000000';UI.combo.textContent='0';UI.hypeFill.style.width='0%';UI.hypeText.textContent='0%'}
function start(){reset();UI.start.classList.remove('active');UI.result.classList.remove('active');video.currentTime=0;video.volume=.92;video.play().then(()=>{running=true;paused=false;last=performance.now();requestAnimationFrame(loop)}).catch(()=>{UI.judge.textContent='TAP PLAY';UI.start.classList.add('active')})}
function togglePause(forceResume=false){if(!running)return;if(!paused&&!forceResume){paused=true;video.pause();UI.pause.classList.add('active')}else{paused=false;UI.pause.classList.remove('active');video.play();last=performance.now();requestAnimationFrame(loop)}}
function setSection(s,idx){if(idx===sectionIndex)return;sectionIndex=idx;UI.section.textContent=s.name;UI.bannerText.textContent=s.banner;UI.banner.classList.add('show');setTimeout(()=>UI.banner.classList.remove('show'),1250);shake=10;
 const transforms={march:'scale(1.13) translateY(1%)',drums:'scale(1.28) translate(-4%,3%)',brass:'scale(1.26) translate(5%,-2%)',wide:'scale(1.03)',switch:'scale(1.18) translate(-2%,0)',rush:'scale(1.3) translate(3%,1%)',finale:'scale(1.1) translateY(-1%)'};video.dataset.base=transforms[s.cam]||'scale(1.1)';}
function judge(lane){if(!running||paused)return;const t=video.currentTime;let best=null,bestD=999;for(const n of notes){if(n.hit||n.missed||n.lane!==lane)continue;let d=Math.abs(n.t-t);if(d<bestD){best=n;bestD=d}if(n.t>t+.19)break}
 if(best&&bestD<=.17){best.hit=true;let j=bestD<=.055?'PERFECT':bestD<=.11?'GREAT':'GOOD';let pts=j==='PERFECT'?1000:j==='GREAT'?700:450;if(j==='PERFECT')perfect++;else good++;combo++;maxCombo=Math.max(maxCombo,combo);score+=Math.round(pts*(1+Math.min(combo,100)/100*2));hype=Math.min(100,hype+(j==='PERFECT'?2.35:1.35));UI.judge.textContent=j;flash=j==='PERFECT'?.9:.45;shake=j==='PERFECT'?6:3;spawnHit(lane,j);sfx(j); if(best.type==='hold')held.add(lane);}
 else{combo=0;hype=Math.max(0,hype-1.8);UI.judge.textContent='OFF BEAT';sfx('bad')}
 updateHUD();checkTigerCall();}
function release(lane){held.delete(lane)}
function checkTigerCall(){let now=performance.now();allHitTimes=allHitTimes.filter(x=>now-x.t<360);allHitTimes.push({t:now});if(hype>=96&&allHitTimes.length>=4&&!tigerCall){tigerCall=true;hype=100;score+=25000;shake=22;flash=1;UI.call.classList.add('live');setTimeout(()=>UI.call.classList.remove('live'),1700);sfx('call');for(let i=0;i<80;i++)spawnParticle(innerWidth/2,innerHeight*.45,true)}}
function updateHUD(){UI.score.textContent=String(score).padStart(7,'0');UI.combo.textContent=combo;UI.hypeFill.style.width=hype+'%';UI.hypeText.textContent=Math.round(hype)+'%';video.style.filter=`saturate(${1.1+hype/180}) contrast(${1.08+hype/500}) brightness(${.58+hype/350})`}
function missNotes(t){for(const n of notes){if(n.hit||n.missed)continue;if(t-n.t>.19){n.missed=true;miss++;combo=0;hype=Math.max(0,hype-2.4);UI.judge.textContent='MISS';updateHUD()} if(n.t>t+.25)break}}
function spawnHit(lane,j){const x=laneX(lane),y=innerHeight*hitY;for(let i=0;i<(j==='PERFECT'?16:8);i++)spawnParticle(x,y,false)}
function spawnParticle(x,y,big){particles.push({x,y,vx:(Math.random()-.5)*(big?14:7),vy:-Math.random()*(big?13:8)-2,life:1,size:big?4+Math.random()*9:2+Math.random()*5,rot:Math.random()*6})}
let audioCtx=null;function sfx(kind){try{audioCtx=audioCtx||new (AudioContext||webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);let f=kind==='bad'?90:kind==='call'?60:kind==='PERFECT'?720:430;o.frequency.setValueAtTime(f,audioCtx.currentTime);if(kind==='call')o.frequency.exponentialRampToValueAtTime(55,audioCtx.currentTime+.45);g.gain.setValueAtTime(kind==='call'?.14:.035,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+(kind==='call'?.55:.08));o.start();o.stop(audioCtx.currentTime+(kind==='call'?.56:.09))}catch(e){}}
function laneX(l){const w=Math.min(innerWidth*.64,760);return innerWidth/2-w/2+w*(l+.5)/4}
function drawHighway(t,s){const W=innerWidth,H=innerHeight,roadW=Math.min(W*.7,820),cx=W/2,topY=H*.28,bottomY=H*.94;ctx.save();ctx.globalAlpha=.9;ctx.fillStyle='rgba(0,0,0,.32)';ctx.beginPath();ctx.moveTo(cx-roadW*.15,topY);ctx.lineTo(cx+roadW*.15,topY);ctx.lineTo(cx+roadW/2,bottomY);ctx.lineTo(cx-roadW/2,bottomY);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(255,96,0,.35)';ctx.lineWidth=2;for(let i=0;i<=4;i++){let xb=cx-roadW/2+roadW*i/4,xt=cx-roadW*.15+roadW*.3*i/4;ctx.beginPath();ctx.moveTo(xt,topY);ctx.lineTo(xb,bottomY);ctx.stroke()}
 // hit pads
 for(let l=0;l<4;l++){let x=laneX(l),y=H*hitY;ctx.beginPath();ctx.arc(x,y,30,0,Math.PI*2);ctx.fillStyle='rgba(5,5,5,.85)';ctx.fill();ctx.strokeStyle='#ff6000';ctx.lineWidth=4;ctx.stroke();ctx.fillStyle='#fff';ctx.font='900 28px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(['←','↑','→','↓'][l],x,y)}
 // notes
 for(const n of notes){if(n.hit||n.missed)continue;const dt=n.t-t;if(dt>travel+.15)break;if(dt<-.2)continue;let p=1-dt/travel;p=Math.max(0,Math.min(1,p));let y=topY+(bottomY-topY)*Math.pow(p,1.38);let topW=roadW*.3,bw=roadW;let ww=topW+(bw-topW)*p;let x=cx-ww/2+ww*(n.lane+.5)/4;let r=9+19*p;ctx.shadowBlur=18;ctx.shadowColor='#ff6000';ctx.fillStyle=n.type==='hold'?'#fff':'#ff6000';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();if(n.type==='hold'){ctx.strokeStyle='#ff6000';ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-80*(.5+p));ctx.stroke()}}
 ctx.restore()}
function drawFirstPerson(s,t){const W=innerWidth,H=innerHeight,b=Math.sin(t*Math.PI*2/beat),bob=b*6;ctx.save();ctx.translate(0,bob);ctx.globalAlpha=.96;ctx.lineCap='round';const o='#ff6000',blk='#090909';
 if(s.mode==='drums'||s.mode==='intro'||s.mode==='response'){ctx.strokeStyle=blk;ctx.lineWidth=34;ctx.beginPath();ctx.moveTo(W*.23,H);ctx.lineTo(W*.38,H*.79);ctx.moveTo(W*.77,H);ctx.lineTo(W*.62,H*.79);ctx.stroke();ctx.strokeStyle='#e6d3b6';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(W*.37,H*.83);ctx.lineTo(W*.47,H*.66);ctx.moveTo(W*.63,H*.83);ctx.lineTo(W*.53,H*.66);ctx.stroke();ctx.strokeStyle=o;ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(W*.5,H*.93,125,62,0,0,Math.PI*2);ctx.stroke()}
 else if(s.mode==='brass'){ctx.strokeStyle=blk;ctx.lineWidth=40;ctx.beginPath();ctx.moveTo(W*.18,H);ctx.lineTo(W*.43,H*.72);ctx.moveTo(W*.82,H);ctx.lineTo(W*.57,H*.72);ctx.stroke();ctx.strokeStyle=o;ctx.lineWidth=18;ctx.beginPath();ctx.moveTo(W*.42,H*.76);ctx.lineTo(W*.66,H*.56);ctx.stroke();ctx.beginPath();ctx.arc(W*.68,H*.54,42,0,Math.PI*2);ctx.stroke()}
 else {ctx.strokeStyle=blk;ctx.lineWidth=36;ctx.beginPath();ctx.moveTo(W*.14,H);ctx.lineTo(W*.35,H*.82);ctx.moveTo(W*.86,H);ctx.lineTo(W*.65,H*.82);ctx.stroke();ctx.fillStyle=o;ctx.beginPath();ctx.arc(W*.35,H*.82,12,0,Math.PI*2);ctx.arc(W*.65,H*.82,12,0,Math.PI*2);ctx.fill()}
 ctx.restore()}
function drawBandOverlay(t,s){if(!sprites.complete)return;const count=s.mode==='formation'||s.mode==='showtime'||s.mode==='finale'?8:5;const cell=256;for(let i=0;i<count;i++){let idx=(i+sectionIndex)%8,sx=(idx%4)*cell,sy=Math.floor(idx/4)*cell;let phase=(t/beat+i*.22)*Math.PI*2;let scale=.32+(i%3)*.035;let x=(i+1)*innerWidth/(count+1)+Math.sin(phase*.5)*14;let y=innerHeight*(.23+(i%2)*.07)+Math.abs(Math.sin(phase))*12;ctx.save();ctx.globalAlpha=.72;ctx.translate(x,y);ctx.scale(scale,scale);ctx.drawImage(sprites,sx,sy,cell,cell,-cell/2,-cell/2,cell,cell);ctx.restore()}}
function drawFormation(t,s){if(s.mode!=='formation')return;ctx.save();ctx.strokeStyle='#ff6000';ctx.lineWidth=5;ctx.setLineDash([12,10]);ctx.shadowBlur=15;ctx.shadowColor='#ff6000';ctx.beginPath();let cy=innerHeight*.55;ctx.moveTo(innerWidth*.25,cy);ctx.lineTo(innerWidth*.4,cy-65);ctx.lineTo(innerWidth*.58,cy+45);ctx.lineTo(innerWidth*.74,cy-40);ctx.stroke();ctx.restore()}
function drawParticles(){for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.22;p.life-=.025;ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle=Math.random()>.18?'#ff6000':'#fff';ctx.fillRect(p.x,p.y,p.size,p.size*1.7);if(p.life<=0)particles.splice(i,1)}ctx.globalAlpha=1}
function draw(t){ctx.clearRect(0,0,innerWidth,innerHeight);const [s]=getSection(t);drawBandOverlay(t,s);drawFormation(t,s);drawHighway(t,s);drawFirstPerson(s,t);drawParticles();if(flash>0){ctx.fillStyle=`rgba(255,96,0,${flash*.11})`;ctx.fillRect(0,0,innerWidth,innerHeight);flash*=.82}}
function applyCamera(t){let base=video.dataset.base||'scale(1.1)';let bob=Math.sin(t*Math.PI*2/beat)*(.8+hype/100*1.2);let rot=Math.sin(t*Math.PI*2/beat*.5)*.18;video.style.transform=`${base} translateY(${bob}px) rotate(${rot}deg)`}
function loop(now){if(!running||paused)return;const t=video.currentTime;const [s,idx]=getSection(t);setSection(s,idx);missNotes(t);showBeat=(showBeat+1)%999;applyCamera(t);draw(t);if(t>=duration-.08||video.ended){finish();return}requestAnimationFrame(loop)}
function finish(){running=false;video.pause();let acc=(perfect+good)/Math.max(1,perfect+good+miss);let grade=acc>.96?'S':acc>.9?'A':acc>.8?'B':acc>.68?'C':'D';$('grade').textContent=grade;$('resultTitle').textContent=grade==='S'?'LEGENDARY TIGER CALL':grade==='A'?'STADIUM SHAKER':grade==='B'?'BAND READY':grade==='C'?'KEEP THE CADENCE':'BACK TO REHEARSAL';$('finalScore').textContent=score.toLocaleString();$('maxCombo').textContent=maxCombo;$('perfectCount').textContent=perfect;$('finalHype').textContent=Math.round(hype)+'%';UI.result.classList.add('active')}

document.addEventListener('keydown',e=>{if(e.code==='Escape'){togglePause();return}let lane=laneKeys[e.code];if(lane===undefined||e.repeat)return;e.preventDefault();held.add(lane);allHitTimes.push({t:performance.now(),lane});judge(lane)});
document.addEventListener('keyup',e=>{let lane=laneKeys[e.code];if(lane!==undefined)release(lane)});
document.querySelectorAll('#touchControls button').forEach(btn=>{const lane=+btn.dataset.lane;const down=e=>{e.preventDefault();btn.classList.add('hit');allHitTimes.push({t:performance.now(),lane});judge(lane)};const up=e=>{e.preventDefault();btn.classList.remove('hit');release(lane)};btn.addEventListener('pointerdown',down);btn.addEventListener('pointerup',up);btn.addEventListener('pointercancel',up)});
$('startBtn').onclick=start;$('replayBtn').onclick=start;$('pauseBtn').onclick=()=>togglePause();$('resumeBtn').onclick=()=>togglePause(true);video.addEventListener('ended',finish);
})();
