const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const noop=()=>{},State={platforms:[],w:1000,t:0,collisionCount:0};
const b={State,Math,clamp:(v,l,h)=>Math.max(l,Math.min(h,v)),breakRack:noop,addParticle:noop};vm.createContext(b);vm.runInContext(fs.readFileSync(__dirname+'/../physics.js','utf8'),b);
function body(x,y,vx,vy,anchor=false){return {x,y,w:160,spec:{mass:.7},bodyVX:vx,bodyVY:vy,downstreamSpeed:vy,vx,driftPhase:0,xDriftAmp:0,active:true,alpha:1,anchored:anchor,anchorX:x,anchorY:y};}
function contact(a,c){b.a=a;b.b=c;vm.runInContext('solveRiverContact(a,b)',b);}
let a=body(350,0,0,400),c=body(350,37,0,0);contact(a,c);
assert(Math.abs(a.bodyVY+c.bodyVY-400)<1e-8);assert(c.bodyVY>200&&a.bodyVY<200);assert(a.bodyVY**2+c.bodyVY**2<=400**2);
a=body(350,0,0,400);c=body(390,35,0,0);contact(a,c);assert(a.bodyVX<0&&c.bodyVX>0);assert(Math.abs(a.bodyVX+c.bodyVX)<1e-8);
for(const dt of [1/30,1/60,1/144]){
 a=body(350,0,0,530);c=body(350,110,0,0,true);State.platforms=[a,c];
 for(let i=0;i<2/dt;i++){vm.runInContext('advanceRiverBodies('+dt+')',b);assert(Math.hypot((a.x-c.x)/128,(a.y-c.y)/38)>.995,'penetrated anchored item');assert.equal(c.y,110);}
}
a=body(350,0,0,500);c=body(350,100,0,50);State.platforms=[a,c];for(let i=0;i<120;i++){vm.runInContext('advanceRiverBodies(1/60)',b);assert(a.y<c.y-37.8,'moving bodies passed through');}assert(c.bodyVY>50);
console.log('PASS momentum conservation, dissipative energy, glancing deflection, moving-body momentum transfer, no tunneling at 30/60/144 Hz, immovable moorings.');
