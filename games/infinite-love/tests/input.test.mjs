import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
import {SandGame,W,H,vertices,SHAPES} from '../engine.js';
const listeners={},nodes=new Map();let frame,g;
const ctx=new Proxy({}, {get:(_t,k)=>(k==='createLinearGradient'||k==='createRadialGradient')?()=>({addColorStop(){}}):()=>{},set:()=>true});
function element(id){if(!nodes.has(id))nodes.set(id,{id,textContent:'',dataset:{},disabled:false,hidden:false,paused:true,matches:()=>false,addEventListener(){},setAttribute(){},getContext:()=>ctx,play(){this.paused=false;return Promise.resolve();},pause(){this.paused=true;}});return nodes.get(id);}
const buttons=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space','Enter','Shift'].map(key=>{const e=element(key);e.dataset.key=key;e.handlers={};e.addEventListener=(type,fn)=>e.handlers[type]=fn;e.setPointerCapture=()=>{};return e;});
const skinButtons=['original','album','night'].map(id=>{const e=element('skin-'+id);e.dataset.skinChoice=id;e.handlers={};e.addEventListener=(type,fn)=>e.handlers[type]=fn;e.blur=()=>{};return e;});
const saved=new Map();
const sandbox={Image:class {constructor(){this.complete=false;}},localStorage:{getItem:k=>saved.get(k),setItem:(k,v)=>saved.set(k,v)},SandGame:class extends SandGame{constructor(){super(()=>.5);g=this;}},W,H,vertices,SHAPES,console,Math,performance:{now:()=>0},matchMedia:()=>({matches:true}),requestAnimationFrame:f=>frame=f,document:{body:element('body'),querySelector:element,querySelectorAll:selector=>selector==='[data-skin-choice]'?skinButtons:buttons,createElement:()=>element('background'),addEventListener(){}},window:{addEventListener:(name,fn)=>listeners[name]=fn}};
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(new URL('../skins.js',import.meta.url),'utf8').replace(/export /g,''),sandbox);
vm.runInContext(fs.readFileSync(new URL('../game.js',import.meta.url),'utf8').replace(/^import .*?;\n/gm,''),sandbox);
let now=0;const tick=(n=1)=>{for(let i=0;i<n;i++){now+=1000/60;frame(now);}};
const key=(type,k)=>listeners[type]({key:k,repeat:false,target:element('body'),preventDefault(){}});
element('#start').onclick();tick(35);const p=g.active;assert(p);p.x=100;p.y=100;g.rebuildMask();
key('keydown','ArrowRight');tick(20);key('keyup','ArrowRight');assert.equal(g.boost,false,'direction key must not skip');assert.equal(p.y,100);assert(p.x>100);assert.equal(g.steering,false);
key('keydown',' ');key('keyup',' ');assert(p.tiltAngle>0,'Space binding tilts');
key('keydown','Enter');key('keyup','Enter');assert.equal(p.locked,true,'Enter binding places');assert.equal(g.active,null);tick(25);const next=g.active;assert(next&&next!==p);
key('keydown','Shift');tick(2);assert.equal(g.boost,true,'Shift binding boosts');key('keyup','Shift');assert.equal(g.boost,false);
// On-screen placement follows the same action as the keyboard.
buttons.find(b=>b.dataset.key==='Enter').handlers.pointerdown({preventDefault(){},pointerId:1});assert.equal(next.locked,true);
key('keydown','p');assert.equal(g.state,'paused');assert.equal(g.boost,false);assert.equal(g.steering,false);
console.log('PASS: actual game UI handles arrows without boost, Space tilt, Enter place, Shift skip/release, on-screen placement, next-item handoff, and pause.');

const snapshot=JSON.stringify({time:g.time,score:g.score,pieces:g.pieces,sand:[...g.sand],state:g.state});
for(const b of skinButtons){b.handlers.click({detail:0});tick(1);assert.equal(element('body').dataset.skin,b.dataset.skinChoice);assert.equal(JSON.stringify({time:g.time,score:g.score,pieces:g.pieces,sand:[...g.sand],state:g.state}),snapshot,'skin switches preserve gameplay exactly');}
assert.equal(saved.get('infinite-love-skin'),'night');
console.log('PASS: all three skins render and switch without altering the game; selected skin persists.');
