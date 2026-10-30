import assert from 'node:assert/strict';
import {SandGame,W,H,vertices} from '../engine.js';
const make=()=>{const g=new SandGame(()=>.5);g.state='playing';return g;};
const count=g=>g.sand.reduce((n,v)=>n+Number(v>0),0);
function fill(g,p){
 const scale=p.widthScale||1;
 for(let y=p.y-13;y<p.y+9;y++)for(let x=Math.ceil(p.x-17*scale);x<p.x+17*scale;x++){
  const radius=(14-4*((y+.5)-(p.y-13))/22)*scale;
  if(Math.abs(x+.5-p.x)<radius){g.sand[y*W+x]=1;g.rest[y*W+x]=30;}
 }
 for(let x=p.x-5;x<=p.x+5;x++){g.sand[(p.y-14)*W+x]=1;g.rest[(p.y-14)*W+x]=30;}
 g.emitted=count(g)+g.score+g.escaped;
 for(let i=0;i<4;i++)g.checkCollectors(.1);
}
const drift=make(),first=drift.pieces[0],second=drift.pieces[1],x=first.x;
for(let y=first.y+4;y<first.y+9;y++)for(let xx=first.x-10;xx<first.x+10;xx++){drift.sand[y*W+xx]=1;drift.rest[y*W+xx]=30;}
drift.checkCollectors(.1);const carried=count(drift);for(let i=0;i<300;i++)drift.updateFleet(1/60);
assert(first.x>x&&first.x<=x+16,'bottom drift is a gentle 3 cells/sec');assert.equal(count(drift),carried,'motion retains cargo');assert(drift.owner.some(id=>id===first.id));
first.x=100;second.x=156;first.fleetDir=1;second.fleetDir=-1;first.fleetClock=second.fleetClock=1;drift.rebuildMask();drift.updateFleet(1/60);
assert.equal(first.fleetDir,-1);assert.equal(second.fleetDir,1);assert(second.x-first.x>=56);assert(first.repelGlow>0);
first.x=30;first.fleetDir=-1;for(let i=0;i<120;i++)drift.updateFleet(1/60);assert(first.fleetDir===1);assert(first.x>=30);
const frozen=first.x;drift.state='paused';for(let i=0;i<60;i++)drift.step();assert.equal(first.x,frozen);
// A full placed bucket scores once, joins the moving row empty, and stays reusable.
const reward=make();const placed={id:1,type:'bucket',rotation:0,x:W/2,y:100,locked:true,transport:false,fill:0,fullTime:0};reward.pieces.push(placed);reward.rebuildMask();fill(reward,placed);
assert.equal(reward.fleetBuckets().length,3);assert(reward.pieces.includes(placed));assert(placed.fleet&&!placed.starter);assert.equal(placed.y,270);assert.equal(placed.fill,0);assert.equal(placed.fullTime,0);assert(placed.rewardGlow>0);assert(reward.events.some(e=>e.type==='earned'&&e.total===3));
assert.equal(count(reward)+reward.score+reward.escaped,reward.emitted);
const score=reward.score;fill(reward,placed);assert(reward.score>score);assert.equal(reward.fleetBuckets().length,3,'refilling an earned bottom bucket does not duplicate it');assert.equal(reward.events.filter(e=>e.type==='earned').length,1);
// Expansion preserves existing sand, separates all buckets, and reserves a finite row.
for(let n=0;n<5;n++){const q={id:10+n,type:'bucket',rotation:0,x:W/2,y:80,locked:true,fill:0,fullTime:0};reward.pieces.push(q);reward.rebuildMask();fill(reward,q);}
assert.equal(reward.fleetBuckets().length,8);reward.id=2;assert.notEqual(reward.makeNext().type,'bucket','full row stops issuing additional bucket pieces');
for(let i=0;i<600;i++)reward.updateFleet(1/60);
const row=reward.fleetBuckets().sort((a,b)=>a.x-b.x);
for(let i=0;i<row.length;i++){const p=row[i],r=17*(p.widthScale||1);assert(p.x-r>=4&&p.x+r<=W-4);if(i)assert(p.x-row[i-1].x>=r+17*(row[i-1].widthScale||1)+4);}
assert.equal(count(reward)+reward.score+reward.escaped,reward.emitted);
const speed=make();speed.spawn();const active=speed.active,start=active.x;for(let i=0;i<60;i++)speed.step();assert(active.x-start>=22&&active.x-start<=26,'piece drift is only slightly faster');
assert.equal(W,400);assert.equal(H,310);
console.log('PASS: gentle bucket drift, cargo retention, collision repulsion, wall rebound, pause, earned permanent buckets, repeat scoring without duplication, full-row spacing, sand conservation, slight speed increase, wider board.');
