import assert from 'node:assert/strict';
import {SandGame,W,H,cells} from '../engine.js';
function rng(seed=42){return()=>{seed=seed*16807%2147483647;return seed/2147483647;};}
const start=()=>{const g=new SandGame(rng());g.state='playing';return g;};
const g=start();assert.equal(g.pieces.filter(p=>p.type==='bucket'&&p.locked).length,2);assert(g.pieces.every(p=>p.y>250));g.spawn();const x=g.active.x,y=g.active.y,r=g.active.tiltAngle;assert(g.move(4,-4));assert.equal(g.active.x,x+4);assert.equal(g.active.y,y-4);assert.equal(g.active.tiltAngle,r);assert(g.rotate());assert(g.active.tiltAngle>r);g.state='paused';const time=g.time;g.step();assert.equal(g.time,time);assert.equal(g.rotate(),false);
const moving=start();moving.id=2;moving.next=moving.makeNext();moving.spawn();assert.equal(moving.active.type,'bucket');assert.equal(moving.rotate(),false);assert.equal(moving.active.rotation,0);assert(moving.move(5,5));
const s=start();const xs=[],pauses=[];for(let i=0;i<60*35;i++){s.updateSource(1/60);xs.push(s.source.x);pauses.push(s.source.pause);}assert(Math.max(...xs)-Math.min(...xs)>100);assert(pauses.filter(x=>x>0).length>100);
// A partially filled bucket NEVER clears on the regular three-second timer.
const b=start();b.pieces=[{id:1,type:'bucket',rotation:0,x:100,y:100,locked:true,timer:0,count:0,fullTime:0,fill:0}];b.rebuildMask();
for(let y=104;y<109;y++)for(let x=91;x<109;x++){b.sand[y*W+x]=1;b.rest[y*W+x]=30;}
for(let i=0;i<50;i++)b.checkCollectors(.1);assert.equal(b.score,0);assert.equal(b.pieces.length,1);assert(b.pieces[0].fill>0);
// Filling the cavity without overflowing does not clear it; sand must rise ABOVE the brim.
for(let y=87;y<109;y++)for(let x=86;x<114;x++){const radius=14-4*((y+.5)-87)/22;if(Math.abs(x+.5-100)<radius){b.sand[y*W+x]=1;b.rest[y*W+x]=30;}}
for(let i=0;i<10;i++)b.checkCollectors(.1);assert.equal(b.score,0);
for(let x=96;x<105;x++){b.sand[86*W+x]=1;b.rest[86*W+x]=30;}
for(let i=0;i<3;i++)b.checkCollectors(.1);assert.equal(b.score,0);b.checkCollectors(.1);assert.equal(b.pieces.length,1);assert(b.pieces[0].fleet);assert.equal(b.pieces[0].y,270);assert(b.score>=500);assert.equal(b.sand.reduce((n,v)=>n+(v>0),0),0);
// Transport tools never award captures, even when loaded for longer than 3 seconds.
const c=start();c.pieces=[{id:1,type:'bar',transport:true,rotation:0,x:W/2,y:90,locked:false,timer:0,color:'#fff'}];c.rebuildMask();for(let x=104;x<119;x++){c.sand[86*W+x]=1;c.rest[86*W+x]=20;}for(let i=0;i<29;i++)c.checkCollectors(.1);assert.equal(c.score,0);c.checkCollectors(.1);assert.equal(c.score,0);assert.equal(c.pieces.length,1);
const lose=start();for(let y=20;y<H;y++)for(let x=0;x<W;x++){lose.sand[y*W+x]=1;lose.rest[y*W+x]=20;}lose.checkDanger();assert.equal(lose.state,'lost');
const win=start();win.score=win.target;win.checkCollectors(.1);assert.equal(win.state,'won');win.reset();assert.equal(win.score,0);assert.equal(win.pieces.length,2);
assert.equal(g.target,12000);
const rim=start();rim.pieces=[];rim.rebuildMask();for(let y=rim.lossLine;y<H;y++)for(let x=0;x<W;x++){rim.sand[y*W+x]=1;rim.rest[y*W+x]=20;}rim.checkDanger();assert.equal(rim.state,'playing','reaching the rim is not yet above it');for(let x=0;x<W;x++){rim.sand[(rim.lossLine-1)*W+x]=1;rim.rest[(rim.lossLine-1)*W+x]=20;}rim.checkDanger();assert.equal(rim.state,'lost','settled ground above starter rim ends the game');
const stream=start();for(let y=0;y<H;y++)stream.sand[y*W+5]=1;stream.checkDanger();assert.equal(stream.state,'playing','falling grains cannot trigger a ground overflow');
console.log('PASS: free UDLR movement, Space rotation API, starter buckets, moving source, real overflow-only bucket capture, bucket-only captures, pause and win/loss/reset.');

// A loaded folded-letter tray carries its sand through movement, and can be tilted without locking.
const carry=start();carry.pieces=[];carry.spawn();const tray=carry.active;tray.x=80;tray.y=110;tray.type='tray';tray.transport=true;carry.rebuildMask();
for(let y=110;y<115;y++)for(let x=72;x<88;x++){carry.sand[y*W+x]=1;carry.rest[y*W+x]=30;}
carry.checkCollectors(.1);assert(tray.count>=70);const cargo=carry.sand.reduce((n,v)=>n+(v>0),0);
carry.move(12,4);assert.equal(carry.sand.reduce((n,v)=>n+(v>0),0),cargo);assert.equal(tray.x,92);assert.equal(tray.y,114);assert(carry.owner.some(id=>id===tray.id));
assert.equal(tray.locked,false);assert.equal(carry.active,tray);assert(carry.rotate());assert(tray.tiltAngle>0);assert.equal(tray.locked,false);
// A loaded level tray stays at the selected height and remains steerable.
const sink=start();sink.pieces=[];sink.spawn();const heavy=sink.active;heavy.x=80;heavy.y=110;heavy.type='tray';heavy.transport=true;sink.rebuildMask();
for(let y=110;y<115;y++)for(let x=72;x<88;x++){sink.sand[y*W+x]=1;sink.rest[y*W+x]=30;}sink.checkCollectors(.1);const initialY=heavy.y;for(let i=0;i<90;i++)sink.step();assert.equal(heavy.y,initialY);assert.equal(sink.active,heavy);assert.equal(heavy.locked,false);
// The seesaw responds to an off-center load.
const lever=start();lever.pieces=[];lever.spawn();const beam=lever.active;beam.type='seesaw';beam.transport=true;beam.x=100;beam.y=100;lever.rebuildMask();for(let x=105;x<120;x++){lever.sand[97*W+x]=1;lever.rest[97*W+x]=30;}lever.checkCollectors(.1);lever.step();assert(beam.balance>0);
console.log('PASS: loaded tools carry grains, keep moving, stay at the selected height, tilt to pour, and never score directly; seesaws respond to weight; bottom buckets remain reusable.');
for(const seed of [12,47]){
 const sim=new SandGame(rng(seed));sim.state='playing';
 for(let tick=0;tick<60*100&&sim.state==='playing';tick++){
  const p=sim.active;
  if(p&&tick%6===0){
   const loaded=p.count>70;const destination=sim.pieces.find(q=>q.starter);
   const tx=loaded&&destination?destination.x-12:sim.source.x;
   const ty=loaded&&destination?destination.y-42:80;
   sim.move(Math.sign(tx-p.x)*4,Math.sign(ty-p.y)*4);
   if(loaded&&destination&&Math.abs(p.x-tx)<10&&p.y>destination.y-55&&p.tiltIndex===0)sim.rotate();
  }
  sim.step();sim.events=[];
 }
 const present=sim.sand.reduce((n,v)=>n+(v>0),0);
 assert.equal(present+sim.score+sim.escaped,sim.emitted,'every grain remains accounted for');
 console.log(JSON.stringify({seed,state:sim.state,seconds:Math.round(sim.time),captures:sim.captures,score:sim.score,escaped:sim.escaped}));
}
