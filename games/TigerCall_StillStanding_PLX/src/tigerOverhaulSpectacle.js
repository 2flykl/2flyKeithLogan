(() => {
'use strict';
const MARKERS = [{"tick":734,"time":0.764875,"name":"Start"},{"tick":1560,"time":1.8662083333333332,"name":"Player Get Ready"},{"tick":3840,"time":4.907354166666666,"name":"First Note Press"},{"tick":7679,"time":9.790375,"name":"Stripe 1"},{"tick":15359,"time":19.39037500000006,"name":"PowerUP Stripe2"},{"tick":21060,"time":26.536624000000096,"name":"Beat Drums"},{"tick":22064,"time":27.813250081250107,"name":"Power Up Stripe"},{"tick":23029,"time":29.0597104250001,"name":"Hold Buttons"},{"tick":30480,"time":38.37319050000002,"name":"3rd Stripe Power UP"},{"tick":36480,"time":45.8416482291667,"name":"Pre-Tiger Call"},{"tick":41760,"time":52.42163777083373,"name":"Unlock Ultra Tiger Power Up"},{"tick":42206,"time":52.97913591250041,"name":"FireWorks"},{"tick":50900,"time":63.82660368750138,"name":"Tiger Party"},{"tick":66240,"time":83.04389001041926,"name":"Full Band2"},{"tick":71520,"time":89.8039080104195,"name":"Last Note"},{"tick":75956,"time":95.64066543958616,"name":"End"}];
const $ = (id) => document.getElementById(id);
let video, canvas, ctx, overlay, leftRail, rightRail, floor, label, tigerSym;
let nextMarker=0, particles=[], flashes=[], stripeLevel=0, ultra=false, activeName='';

function init() {
  video=$('performanceVideo'); canvas=$('spectacleCanvas'); overlay=$('tigerSpectacle');
  if(!video || !canvas || !overlay) return;
  ctx=canvas.getContext('2d'); leftRail=$('spectacleLeft'); rightRail=$('spectacleRight'); floor=$('spectacleFloor'); label=$('spectacleLabel'); tigerSym=$('tigerSymmetry');
  resize(); window.addEventListener('resize',resize);
  video.addEventListener('play',()=>requestAnimationFrame(loop));
  video.addEventListener('seeked',syncToTime);
  window.TigerCallEventBus?.on('NOTE_HIT',e=>notePulse(e.lane));
  window.TigerCallEventBus?.on('TIGER_PERFECT',()=>burst(innerWidth/2,innerHeight*.79,12,'white'));
  window.TigerCallEventBus?.on('COMBO_MILESTONE',()=>{ railFlash(); burst(innerWidth*.1,innerHeight*.6,16,'orange'); burst(innerWidth*.9,innerHeight*.6,16,'white'); });
}
function resize(){ const dpr=Math.min(2,devicePixelRatio||1); canvas.width=innerWidth*dpr; canvas.height=innerHeight*dpr; canvas.style.width=innerWidth+'px'; canvas.style.height=innerHeight+'px'; ctx.setTransform(dpr,0,0,dpr,0,0); }
function syncToTime(){ nextMarker=0; stripeLevel=0; ultra=false; overlay.dataset.ultra='0'; overlay.dataset.party='0'; while(nextMarker<MARKERS.length && MARKERS[nextMarker].time <= video.currentTime){ applyMarker(MARKERS[nextMarker],true); nextMarker++; } }
function setLabel(t){ if(!label)return; label.textContent=t; label.classList.remove('show'); void label.offsetWidth; label.classList.add('show'); }
function railFlash(){ leftRail?.classList.add('flash'); rightRail?.classList.add('flash'); setTimeout(()=>{leftRail?.classList.remove('flash');rightRail?.classList.remove('flash')},550); }
function addStripe(){ stripeLevel=Math.min(3,stripeLevel+1); overlay.dataset.stripes=String(stripeLevel); railFlash(); setLabel('TIGER STRIPE '+stripeLevel+' UNLOCKED'); burst(innerWidth*.08,innerHeight*.72,20,'orange'); burst(innerWidth*.92,innerHeight*.72,20,'orange'); }
function notePulse(lane){ if(!floor)return; floor.dataset.lane=String(lane); floor.classList.remove('pulse'); void floor.offsetWidth; floor.classList.add('pulse'); setTimeout(()=>floor.classList.remove('pulse'),180); }
function burst(x,y,count=20,style='orange'){ for(let i=0;i<count;i++){ const a=Math.random()*Math.PI*2, s=2+Math.random()*8; particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-3,life:1,size:2+Math.random()*5,style}); } }
function fireworks(big=false){ const n=big?8:4; for(let i=0;i<n;i++){ const side=i%2?innerWidth*.12:innerWidth*.88; burst(side+(Math.random()-.5)*120,innerHeight*(.2+Math.random()*.35),big?35:20,i%3===0?'white':'orange'); } }
function ultraTiger(){ ultra=true; overlay.dataset.ultra='1'; setLabel('ULTRA TIGER POWER'); fireworks(true); for(let i=0;i<90;i++) particles.push({x:Math.random()*innerWidth,y:-20-Math.random()*300,vx:(Math.random()-.5)*2,vy:3+Math.random()*6,life:1.7,size:4+Math.random()*7,style:i%4===0?'white':'orange'}); document.body.classList.add('ultra-shake'); setTimeout(()=>document.body.classList.remove('ultra-shake'),1000); const hype=document.querySelector('.hypeWrap'); hype?.classList.add('hype-explode'); setTimeout(()=>hype?.classList.remove('hype-explode'),1300); }
function applyMarker(m,silent=false){ activeName=m.name; if(!silent) setLabel(m.name.toUpperCase()); switch(m.name){
 case 'Start': overlay.dataset.mode='start'; break;
 case 'Player Get Ready': overlay.dataset.mode='ready'; railFlash(); break;
 case 'First Note Press': overlay.dataset.mode='awake'; railFlash(); if(!silent){burst(innerWidth*.08,innerHeight*.8,14);burst(innerWidth*.92,innerHeight*.8,14);} break;
 case 'Stripe 1': addStripe(); break;
 case 'PowerUP Stripe2': addStripe(); break;
 case 'Beat Drums': overlay.dataset.mode='drums'; break;
 case 'Power Up Stripe': addStripe(); break;
 case 'Hold Buttons': overlay.dataset.mode='holds'; break;
 case '3rd Stripe Power UP': addStripe(); overlay.dataset.mode='stripe3'; break;
 case 'Pre-Tiger Call': overlay.dataset.mode='precall'; break;
 case 'Unlock Ultra Tiger Power Up': ultraTiger(); break;
 case 'FireWorks': overlay.dataset.mode='fireworks'; if(!silent) fireworks(true); break;
 case 'Tiger Party': overlay.dataset.party='1'; overlay.dataset.mode='party'; if(!silent) fireworks(); break;
 case 'Full Band2': overlay.dataset.mode='fullband'; if(!silent) fireworks(); break;
 case 'Last Note': overlay.dataset.mode='last'; railFlash(); break;
 case 'End': overlay.dataset.mode='end'; if(!silent) fireworks(true); break;
 } }
function draw(){ if(!ctx)return; ctx.clearRect(0,0,innerWidth,innerHeight); for(let i=particles.length-1;i>=0;i--){ const p=particles[i]; p.x+=p.vx;p.y+=p.vy;p.vy+=.05;p.life-=.018; if(p.life<=0){particles.splice(i,1);continue;} ctx.globalAlpha=Math.min(1,p.life); ctx.fillStyle=p.style==='white'?'#fff':'#ff6200'; ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill(); } ctx.globalAlpha=1;
 if(overlay?.dataset.party==='1'){ const t=video?.currentTime||0; ctx.save(); ctx.globalAlpha=.38; ctx.strokeStyle='#ff6200'; ctx.lineWidth=3; for(let i=0;i<7;i++){ const y=120+i*70; const x1=90+Math.sin(t*2+i)*30; const x2=innerWidth-x1; ctx.beginPath();ctx.arc(x1,y,12+(i%3)*5,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(x2,y,12+(i%3)*5,0,Math.PI*2);ctx.stroke(); } ctx.restore(); } }
function loop(){ if(!video || video.paused || video.ended) return; while(nextMarker<MARKERS.length && MARKERS[nextMarker].time <= video.currentTime+.015){ applyMarker(MARKERS[nextMarker]); nextMarker++; } draw(); requestAnimationFrame(loop); }
window.addEventListener('DOMContentLoaded',init);
})();
