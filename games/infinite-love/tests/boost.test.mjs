import assert from 'node:assert/strict';
import {SandGame,W} from '../engine.js';
function make(side){const g=new SandGame(()=>.5);g.state='playing';g.next={type:'tray',transport:true,rotation:0,side,lane:0,color:'#fff',tiltAngle:0,tiltIndex:0};g.spawn();return g;}
for(const side of ['left','right']){
 const normal=make(side),fast=make(side);const n=normal.active,f=fast.active,origin=f.x;
 fast.setBoost(true);for(let i=0;i<30;i++){normal.step();fast.step();}
 const slowDistance=Math.abs(n.x-origin),fastDistance=Math.abs(f.x-origin);
 assert(fastDistance>=slowDistance*4,`${side} entry must accelerate`);
 fast.setBoost(false);const before=f.x;for(let i=0;i<30;i++)fast.step();assert(Math.abs(f.x-before)<=slowDistance+2,'release restores ordinary drift');
 fast.setBoost(true);for(let i=0;i<180&&fast.active===f;i++)fast.step();assert(!fast.pieces.includes(f),'forward hold allows exit rather than clamping at edge');
 for(let i=0;i<40&&!fast.active;i++)fast.step();assert(fast.active&&fast.active!==f,'next item arrives after exit');assert.equal(fast.boost,false,'new item starts at normal speed');
 const remaining=fast.sand.reduce((sum,n)=>sum+(n>0),0);assert.equal(remaining+fast.score+fast.escaped,fast.emitted,'boost preserves sand accounting');
}
const paused=make('left');paused.state='paused';paused.setBoost(true);assert.equal(paused.boost,false);
console.log('PASS: 5x forward drift from both sides, normal speed on release, complete offscreen exit, next item at normal speed, pause guard, sand accounting.');
