import assert from 'node:assert/strict';
import {SandGame,W,H,vertices} from '../engine.js';
const make=(type='tray',side='left')=>{const g=new SandGame(()=>.5);g.state='playing';g.next={type,transport:type!=='bucket',rotation:0,side,lane:0,color:'#fff',tiltAngle:0,tiltIndex:0};g.spawn();return g;};
const grains=g=>g.sand.reduce((n,v)=>n+(v>0),0);
for(const side of ['left','right']){
 const g=make('bucket',side),p=g.active;p.x=W/2;p.y=45;g.rebuildMask();g.setSteering(true);
 for(let i=0;i<120;i++)g.step();
 assert.equal(g.active,p,'sand contact must leave bucket selected');assert.equal(p.locked,false);assert.equal(p.x,W/2,'held steering suspends drift');assert(p.count>0,'test actually caught sand');
 assert.equal(g.rotate(),false);assert.equal(p.rotation,0,'bucket remains upright');
 const y=p.y;g.move(0,-4);assert.equal(p.y,y-4,'loaded bucket moves exactly four cells');g.move(0,4);
 assert(g.place());assert.equal(p.locked,true);assert.equal(g.active,null);assert.equal(p.remaining,null);
 const pos=[p.x,p.y];for(let i=0;i<30;i++)g.step();assert.deepEqual([p.x,p.y],pos);assert(g.active&&g.active!==p,'placing brings in next item');
}
const tool=make(),p=tool.active;p.x=80;p.y=100;tool.rebuildMask();
for(let y=100;y<105;y++)for(let x=74;x<86;x++){tool.sand[y*W+x]=1;tool.rest[y*W+x]=30;}tool.emitted=grains(tool);tool.checkCollectors(.1);assert(p.count>0);
assert(tool.place());assert.equal(p.remaining,8);assert.equal(p.locked,true);
const beforePause=p.remaining;tool.state='paused';for(let i=0;i<60;i++)tool.step();assert.equal(p.remaining,beforePause);tool.state='playing';
for(let i=0;i<479;i++)tool.step();assert(tool.pieces.includes(p),'tool holds for nearly 8 seconds');assert.equal(p.y,100);
for(let i=0;i<3;i++)tool.step();assert(!tool.pieces.includes(p),'tool expires after 8 seconds');assert.equal(tool.score,0,'release never scores');assert.equal(grains(tool)+tool.score+tool.escaped,tool.emitted,'release conserves sand');assert(!tool.owner.some(id=>id===p.id));assert(!tool.pieces.some(q=>q.gray),'gray obstacles are disabled');
const blocked=make();const bp=blocked.active;bp.x=blocked.pieces[0].x;bp.y=220;blocked.rebuildMask();const by=bp.y;assert.equal(blocked.move(0,55),false);assert.equal(bp.y,by);assert(blocked.blockedGhost,'blocked move has a visible ghost');
bp.y=275;assert.equal(blocked.place(),false);assert.equal(blocked.active,bp);assert(!bp.locked);
bp.x=-10;bp.y=80;blocked.rebuildMask();assert.equal(blocked.place(),false,'cannot place outside the board');
// A skipped item blocked by a placed object releases rather than getting stuck.
const skip=make();const sp=skip.active;sp.x=100;sp.y=100;skip.pieces.push({id:99,type:'bucket',rotation:0,x:136,y:100,locked:true});skip.rebuildMask();skip.setBoost(true);for(let i=0;i<30&&skip.active===sp;i++)skip.step();assert(!skip.pieces.includes(sp));
// Wider starter geometry and overflow threshold agree. Only above-brim sand triggers capture.
const wide=new SandGame(()=>.5);wide.state='playing';const wb=wide.pieces[0];assert.equal(wb.widthScale,1.5);const xs=vertices(wb).map(v=>v[0]);assert.equal(Math.max(...xs)-Math.min(...xs),51);
for(let y=wb.y-13;y<wb.y+9;y++)for(let x=wb.x-25;x<wb.x+25;x++){
 const radius=(14-4*((y+.5)-(wb.y-13))/22)*1.5;
 if(Math.abs(x+.5-wb.x)<radius){const i=y*W+x;wide.sand[i]=1;wide.rest[i]=30;}
}
for(let i=0;i<5;i++)wide.checkCollectors(.1);assert.equal(wide.score,0);
for(let x=wb.x-5;x<=wb.x+5;x++){wide.sand[(wb.y-14)*W+x]=1;wide.rest[(wb.y-14)*W+x]=30;}
for(let i=0;i<4;i++)wide.checkCollectors(.1);assert(wide.pieces.includes(wb));assert(wide.score>700);assert.equal(wb.fill,0);assert.equal(wide.fleetBuckets().length,2);
console.log('PASS: deliberate placement, contact never freezes buckets, equal steering, upright buckets, next-item handoff, 8-second expiry, pause, sand conservation, blocked feedback, skip escape, no gray obstacles, wider starter overflow.');
