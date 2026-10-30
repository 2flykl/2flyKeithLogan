export const W = 400, H = 310;
export const SHAPES = {
 tray:[[-19,-6],[-15,-6],[-12,5],[12,5],[15,-6],[19,-6],[15,9],[-15,9]],
 ramp:[[-21,-10],[21,8],[21,12],[-21,-6]],
 seesaw:[[-24,-2],[24,-2],[24,2],[-24,2]],
 L:[[-12,-10],[-7,-10],[-7,6],[12,6],[12,11],[-12,11]],
 T:[[-13,-9],[13,-9],[13,-4],[3,-4],[3,11],[-3,11],[-3,-4],[-13,-4]],
 bar:[[-14,-3],[14,-3],[14,3],[-14,3]],
 square:[[-7,-7],[7,-7],[7,7],[-7,7]],
 triangle:[[-12,10],[0,-10],[12,10]],
 cup:[[-12,-9],[-7,-9],[-7,6],[7,6],[7,-9],[12,-9],[12,11],[-12,11]],
 bucket:[[-17,-13],[-14,-13],[-10,9],[10,9],[14,-13],[17,-13],[13,13],[-13,13]]
};
export const COLORS = ['#fb608c','#b08aff','#5bdfbf','#ffc064','#7db8ff','#f68bcf'];
export function vertices(p) {
 return SHAPES[p.type].map(([x,y]) => {
  x*=p.widthScale||1;
  for(let i=0;i<p.rotation;i++) [x,y]=[-y,x];
  const a=(p.tiltAngle||0)+(p.balance||0),c=Math.cos(a),s=Math.sin(a);return [x*c-y*s+p.x,x*s+y*c+p.y];
 });
}
export function inside(x,y,pts) {
 let c=false;
 for(let i=0,j=pts.length-1;i<pts.length;j=i++) {
  const a=pts[i],b=pts[j];
  if(((a[1]>y)!==(b[1]>y))&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0]) c=!c;
 }
 return c;
}
export function cells(p) {
 const pts=vertices(p),result=[];
 const x0=Math.max(0,Math.floor(Math.min(...pts.map(v=>v[0]))));
 const x1=Math.min(W-1,Math.ceil(Math.max(...pts.map(v=>v[0]))));
 const y0=Math.max(0,Math.floor(Math.min(...pts.map(v=>v[1]))));
 const y1=Math.min(H-1,Math.ceil(Math.max(...pts.map(v=>v[1]))));
 for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(inside(x+.5,y+.5,pts)) result.push(y*W+x);
 return result;
}
export class SandGame {
 constructor(random=Math.random) { this.random=random; this.reset(); }
 reset() {
  this.sand=new Uint8Array(W*H);this.rest=new Uint8Array(W*H);this.mask=new Int16Array(W*H);this.owner=new Int16Array(W*H);
  this.pieces=[];this.active=null;this.id=0;this.score=0;this.target=12000;this.time=0;this.ticks=0;
  this.state='ready';this.spawnClock=.4;this.captures=0;this.missed=0;this.danger=0;this.lossLine=257;this.events=[];
  this.driftClock=0;this.boost=false;this.steering=false;this.blockedGhost=null;this.emitted=0;this.escaped=0;this.grayClock=9;this.graySerial=0;this.fleetLimit=8;this.refills=[];this.refillId=29000;
  for(let n=0;n<2;n++)this.pieces.push({id:30000+n,type:'bucket',rotation:0,x:Math.round(W*[.33,.67][n]),y:270,locked:true,timer:0,count:0,color:'#b6e9f5',starter:true,fleet:true,fleetDir:n===0?1:-1,fleetClock:0,widthScale:1.5,fullTime:0,fill:0});
  this.rebuildMask();
  this.source={x:W/2,target:W/2,pause:2,stop:0};this.next=this.makeNext();
 }
 makeNext() {
  const n=this.id, special=n%4===2&&this.pieces.filter(p=>p.type==='bucket').length<this.fleetLimit;
  const weighted=['tray','tray','ramp','seesaw'];
  const type=special?'bucket':n===0?'tray':n===1?'ramp':weighted[Math.floor(this.random()*weighted.length)];
  return {type,transport:type!=='bucket',
   side:n===0?'left':n===1?'right':this.random()<.5?'left':'right',
   rotation:0,lane:Math.floor(this.random()*5),tiltIndex:0,tiltAngle:0,balance:0,
   color:type==='bucket'?'#b6e9f5':type==='tray'?'#efdbb6':type==='ramp'?'#eea3b5':'#bf8e68'};
 }
 spawn() {
  const n=this.next,lanes=[65,100,140,180,215];let y=lanes[n.lane];
  for(let j=0;j<5;j++){if(!this.pieces.some(p=>Math.abs(p.y-y)<30))break;y=lanes[(n.lane+j+1)%5];}
  this.active={...n,id:++this.id,x:n.side==='left'?24:W-24,y,locked:false,timer:0,count:0,fullTime:0,fill:0,sinkClock:0};
  this.pieces.push(this.active);this.next=this.makeNext();this.driftClock=0;this.boost=false;this.steering=false;this.blockedGhost=null;
  this.events.push({type:'entry',side:n.side,bucket:n.type==='bucket',tool:n.type});
 }
 valid(p) {
  const mine=cells(p);
  return !mine.some(i=>this.mask[i]&&this.mask[i]!==p.id);
 }
 setSteering(enabled) {this.steering=this.state==='playing'&&!!this.active&&!!enabled;}
 setBoost(enabled) {this.boost=this.state==='playing'&&!!this.active&&!!enabled;}
 rotate() {
  if(this.state!=='playing'||!this.active||this.active.type==='bucket')return false;
  const p=this.active,old=p.rotation,oi=p.tiltIndex||0,oa=p.tiltAngle||0;
  if(p.transport){const angles=[0,Math.PI/6,Math.PI/3,-Math.PI/3,-Math.PI/6];p.tiltIndex=(oi+1)%angles.length;p.tiltAngle=angles[p.tiltIndex];}
  else p.rotation=(old+1)%4;
  if(!this.valid(p)){this.blockedGhost={...p,remaining:.4};p.rotation=old;p.tiltIndex=oi;p.tiltAngle=oa;return false;}
  this.rebuildMask();this.clearOverlaps(p);this.events.push({type:'rotate'});return true;
 }
 move(dx,dy=0) {
  if(this.state!=='playing'||!this.active)return false;
  const p=this.active;
  const nx=Math.max(24,Math.min(W-24,Math.round(p.x+dx))),ny=Math.max(35,Math.min(H-22,Math.round(p.y+dy)));
  return this.translate(p,nx-p.x,ny-p.y,true);
 }
 translate(p,dx,dy=0,check=true) {
  const ox=p.x,oy=p.y;p.x=Math.round(ox+dx);p.y=Math.round(oy+dy);
  if(check&&!this.valid(p)){this.blockedGhost={...p,remaining:.4};p.x=ox;p.y=oy;return false;}
  if(check)this.blockedGhost=null;
  dx=p.x-ox;dy=p.y-oy;const payload=[];
  for(let i=0;i<this.sand.length;i++)if(this.owner[i]===p.id&&this.sand[i])payload.push({i,value:this.sand[i],rest:this.rest[i]});
  for(const g of payload){this.sand[g.i]=0;this.rest[g.i]=0;this.owner[g.i]=0;}
  this.rebuildMask();
  for(const g of payload){const x=g.i%W+dx,y=Math.floor(g.i/W)+dy;
   if(x<0||x>=W||y<0||y>=H){this.escaped++;continue;}
   let dest=y*W+x;
   if(this.mask[dest]||this.sand[dest]){let yy=y;while(yy>=0&&(this.mask[yy*W+x]||this.sand[yy*W+x]))yy--;if(yy<0){this.escaped++;continue;}dest=yy*W+x;}
   this.sand[dest]=g.value;this.rest[dest]=g.rest;this.owner[dest]=p.id;
  }
  this.clearOverlaps(p);return true;
 }
 canPlace(p=this.active) {
  if(!p||this.state!=='playing'||p.locked||!this.valid(p))return false;
  return vertices(p).every(([x,y])=>x>=1&&x<W-1&&y>=20&&y<this.lossLine-3);
 }
 place() {
  const p=this.active;
  if(!this.canPlace(p)){if(p)this.blockedGhost={...p,remaining:.6};this.events.push({type:'blocked'});return false;}
  p.locked=true;p.remaining=p.transport?8:null;
  this.active=null;this.spawnClock=.35;this.boost=false;this.steering=false;this.blockedGhost=null;
  this.events.push({type:'place',x:p.x,y:p.y,bucket:p.type==='bucket'});return true;
 }
 releasePiece(p,reason='expire') {
  // Removing a support releases its grains where they are; it never scores or erases them.
  this.pieces=this.pieces.filter(q=>q!==p);
  for(let i=0;i<this.owner.length;i++)if(this.owner[i]===p.id){this.owner[i]=0;this.rest[i]=0;}
  if(this.active===p){this.active=null;this.spawnClock=.3;this.boost=false;this.steering=false;}
  this.rebuildMask();this.events.push({type:reason,bucket:p.type==='bucket',x:p.x,y:p.y});
 }
 rebuildMask() {
  this.mask.fill(0);
  for(const p of [...this.pieces.filter(q=>q.gray),...this.pieces.filter(q=>!q.gray)]) {
   for(const i of cells(p))this.mask[i]=p.id;
  }
 }
 spawnGray() {
  const side=this.graySerial%2===0?'left':'right', types=['ramp','seesaw','tray'];
  const lanes=[90,130,170,210];let y=lanes[this.graySerial%lanes.length];
  for(const lane of lanes)if(!this.pieces.some(p=>!p.gray&&Math.abs(p.y-lane)<30)){y=lane;break;}
  const p={id:20000+(this.graySerial++%5000),type:types[(this.graySerial-1)%types.length],side,rotation:0,x:side==='left'?-18:W+18,y,locked:false,gray:true,timer:0,count:0,color:'#a1a5b4',drift:0};
  this.pieces.push(p);this.events.push({type:'gray'});
 }
 shiftGray(p,dx) {this.translate(p,dx,0,false);}
 clearOverlaps(p) {
  // Moving solids push struck grains to the closest available cell above, preserving their count.
  for(const i of cells(p)){if(!this.sand[i])continue;const x=i%W;let y=Math.floor(i/W)-1;
   while(y>=0&&(this.mask[y*W+x]||this.sand[y*W+x]))y--;
   if(y>=0){this.sand[y*W+x]=this.sand[i];this.rest[y*W+x]=0;}else this.escaped++;
   this.sand[i]=0;this.rest[i]=0;this.owner[i]=0;
  }
 }
 fleetBuckets() {return this.pieces.filter(p=>p.fleet);}
 updateFleet(dt) {
  const row=this.fleetBuckets();
  for(const p of row){
   p.rewardGlow=Math.max(0,(p.rewardGlow||0)-dt);p.refillGlow=Math.max(0,(p.refillGlow||0)-dt);p.repelGlow=Math.max(0,(p.repelGlow||0)-dt);
   p.fleetClock=(p.fleetClock||0)+3*dt;
   if(p.fleetClock<1)continue;p.fleetClock-=1;
   const r=17*(p.widthScale||1),dir=p.fleetDir||1,nx=p.x+dir;
   if(nx-r<4||nx+r>W-4){p.fleetDir=-dir;p.repelGlow=.4;continue;}
   const other=row.find(q=>q!==p&&Math.abs(q.x-nx)<r+17*(q.widthScale||1)+5);
   if(other){
    p.fleetDir=p.x<other.x?-1:1;other.fleetDir=-p.fleetDir;p.repelGlow=other.repelGlow=.5;
    continue;
   }
   // A bottom bucket carries its settled sand. Never push through another object.
   const ghost=this.blockedGhost;
   if(!this.translate(p,dir,0,true))p.fleetDir=-dir;
   this.blockedGhost=ghost;
  }
 }
 recruitBucket(p) {
  const from={x:p.x,y:p.y};
  this.pieces=this.pieces.filter(q=>q!==p);this.rebuildMask();
  p.fleet=true;p.locked=true;p.transport=false;p.y=270;p.rotation=0;p.tiltAngle=0;p.balance=0;
  p.fleetDir=this.fleetBuckets().length%2===0?1:-1;p.fleetClock=0;p.rewardGlow=2.5;
  p.count=0;p.fill=0;p.fullTime=0;
  // Reserve space for every earned bucket, keeping the collection row in order.
  const row=[...this.fleetBuckets(),p].sort((a,b)=>a.x-b.x),width=row.reduce((n,q)=>n+34*(q.widthScale||1),0);
  const gap=(W-12-width)/(row.length+1);let cursor=6+gap;
  const targets=new Map();for(const q of row){const radius=17*(q.widthScale||1);targets.set(q,Math.round(cursor+radius));cursor+=2*radius+gap;}
  const others=row.filter(q=>q!==p);
  for(const q of others.filter(q=>targets.get(q)<q.x))this.translate(q,targets.get(q)-q.x,0,false);
  for(const q of others.filter(q=>targets.get(q)>q.x).reverse())this.translate(q,targets.get(q)-q.x,0,false);
  p.x=targets.get(p);this.pieces.push(p);this.rebuildMask();this.clearOverlaps(p);
  this.events.push({type:'earned',x:from.x,y:from.y,toX:p.x,toY:p.y,total:row.length});
 }
 updateSource(dt) {
  const s=this.source;
  if(s.pause>0) {
   s.pause=Math.max(0,s.pause-dt);
   if(s.pause===0){const stops=[.8,.26,.65,.15,.87,.42];s.target=W*stops[s.stop++%stops.length];}
  } else {
   const distance=s.target-s.x,speed=18+Math.min(5,this.time/35);
   if(Math.abs(distance)<=speed*dt){s.x=s.target;s.pause=1.6+this.random()*.7;}
   else s.x+=Math.sign(distance)*speed*dt;
  }
 }
 step() {
  if(this.state!=='playing')return;
  const dt=1/60;this.time+=dt;this.ticks++;this.updateSource(dt);this.updateFleet(dt);
  if(this.blockedGhost){this.blockedGhost.remaining-=dt;if(this.blockedGhost.remaining<=0)this.blockedGhost=null;}
  for(const q of [...this.pieces])if(q.transport&&q.locked){q.remaining-=dt;if(q.remaining<=0)this.releasePiece(q);}

  for(const refill of [...this.refills]){refill.wait-=dt;if(refill.wait<=0){this.pieces.push({...refill.p,id:this.refillId--,count:0,fill:0,fullTime:0,timer:0});this.refills=this.refills.filter(r=>r!==refill);this.events.push({type:'refill'});}}
  if(!this.active){this.spawnClock-=dt;if(this.spawnClock<=0)this.spawn();}
  else {
   const p=this.active,dir=p.side==='left'?1:-1;
   if(!this.steering||this.boost)this.driftClock+=dt*(this.boost?5:1);
   const interval=p.type==='bucket'?.112:.085;
   while(this.driftClock>=interval&&this.active){
    this.driftClock-=interval;if(!this.translate(p,dir*2,0,true)){if(this.boost)this.releasePiece(p,'miss');break;}
   }
   if(this.active===p&&(p.x < -26 || p.x>W+26 || p.y>H+20))this.releasePiece(p,'miss');
  }
  for(const q of this.pieces)if(q.type==='seesaw'){
   let torque=0,weight=0;for(let i=0;i<this.sand.length;i++)if(this.owner[i]===q.id&&this.sand[i]){torque+=i%W-q.x;weight++;}
   const target=weight?Math.max(-.45,Math.min(.45,torque/(weight*32))):0,old=q.balance||0;
   q.balance=old+(target-old)*.12;if(!this.valid(q))q.balance=old;
  }
  this.rebuildMask();
  const p=this.active;
  if(p&&cells(p).some(i=>this.sand[i]))this.clearOverlaps(p);
  for(const q of this.pieces)if(q.gray||q.type==='seesaw')this.clearOverlaps(q);
  const spawnCount=this.time<12?2:this.time<90?3:4;
  for(let k=0;k<spawnCount;k++) {
   const x=Math.max(0,Math.min(W-1,Math.floor(this.source.x+(this.random()-.5)*7))),i=2*W+x;
   if(!this.sand[i]&&!this.mask[i]){this.sand[i]=1+Math.floor(this.random()*4);this.emitted++;}
  }
  const flip=this.ticks%2;
  for(let y=H-2;y>=0;y--)for(let z=0;z<W;z++) {
   const x=flip?z:W-1-z,i=y*W+x;if(!this.sand[i])continue;const b=i+W;
   let dest=-1;
   if(!this.sand[b]&&!this.mask[b])dest=b;
   else {const d=this.random()<.5?-1:1;for(const s of [d,-d])if(x+s>=0&&x+s<W&&!this.sand[b+s]&&!this.mask[b+s]&&!this.mask[i+s]){dest=b+s;break;}}
   if(dest>=0){this.sand[dest]=this.sand[i];this.rest[dest]=0;this.owner[dest]=0;this.sand[i]=0;this.rest[i]=0;this.owner[i]=0;}else this.rest[i]=Math.min(255,this.rest[i]+1);
  }
  if(this.ticks%6===0)this.checkCollectors(.1);
  if(this.ticks%30===0&&this.state==='playing')this.checkDanger();
 }
 checkDanger() {
  let top=H,ground=0;const connected=new Uint8Array(W*H),queue=[];
  for(let x=0;x<W;x++){const i=(H-1)*W+x;if(this.sand[i]){queue.push(i);connected[i]=1;}}
  for(let j=0;j<queue.length;j++) {
   const i=queue[j],x=i%W,y=Math.floor(i/W);top=Math.min(top,y);ground++;
   for(const n of [i-W,i+W,x>0?i-1:-1,x<W-1?i+1:-1])if(n>=0&&n<connected.length&&!connected[n]&&this.sand[n]&&this.rest[n]>=8&&!this.owner[n]){connected[n]=1;queue.push(n);}
  }
  this.missed=ground;this.danger=Math.min(1,Math.max(0,(H-top)/(H-this.lossLine)));
  if(top<this.lossLine){this.state='lost';this.events.push({type:'lost'});}
 }
 checkCollectors(dt) {
  this.owner.fill(0);const counts={};
  for(let y=H-2;y>=0;y--)for(let x=0;x<W;x++) {
   const i=y*W+x;if(!this.sand[i]||this.mask[i]||this.rest[i]<8)continue;const b=i+W;
   if(!this.mask[b]&&!this.sand[b])continue;
   let id=this.mask[b]||this.owner[b];
   if(!id)for(const d of [-1,1])if(x+d>=0&&x+d<W&&this.sand[b+d]&&this.owner[b+d]){id=this.owner[b+d];break;}
   if(id){this.owner[i]=id;counts[id]=(counts[id]||0)+1;}
  }
  for(const p of [...this.pieces]) {
   p.count=counts[p.id]||0;if(p.gray||!p.locked||p.type!=='bucket')continue;
   let complete=false;
   if(p.type==='bucket'){
    let interior=0,above=0;const widthScale=p.widthScale||1;
    for(let y=Math.floor(p.y-17);y<Math.ceil(p.y+9);y++)for(let x=Math.ceil(p.x-17*widthScale);x<Math.floor(p.x+17*widthScale);x++){
     if(x<0||x>=W||y<0||y>=H)continue;const i=y*W+x;
     if(this.owner[i]===p.id){if(y>=p.y-13){const radius=(14-4*((y+.5)-(p.y-13))/22)*widthScale;if(Math.abs(x+.5-p.x)<radius)interior++;}else above++;}
    }
    p.fill=Math.min(1,interior/(24*22*widthScale));
    const overflowing=p.rotation===0&&interior>=360*widthScale&&above>=6;
    p.fullTime=overflowing?(p.fullTime||0)+dt:0;
    complete=p.fullTime>=.4;
   }
   if(complete){let n=0;for(let i=0;i<this.sand.length;i++)if(this.owner[i]===p.id){this.sand[i]=0;this.rest[i]=0;this.owner[i]=0;n++;}
    this.score+=n;this.captures++;
    this.events.push({type:'capture',x:p.x,y:p.y,n,color:p.color,bucket:true});
    p.count=0;p.fill=0;p.fullTime=0;p.refillGlow=.8;
    if(!p.fleet)this.recruitBucket(p);
   }
  }
  if(this.score>=this.target){this.state='won';this.events.push({type:'won'});}
 }
}
