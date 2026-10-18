const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(process.argv[2]||path.join(__dirname,'..')),noop=()=>{},nodes=new Map();
function node(id){if(!nodes.has(id))nodes.set(id,{clientWidth:1920,clientHeight:1080,style:{},classList:{add:noop,remove:noop},addEventListener:noop,play:()=>Promise.resolve(),getContext:()=>new Proxy({},{get:()=>noop})});return nodes.get(id)}
let seed=1;const math=Object.create(Math);math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
const box={Math:math,assert,console,document:{getElementById:node,querySelector:node,querySelectorAll:()=>[],addEventListener:noop},window:{addEventListener:noop},performance:{now:()=>0},Image:class{set src(v){}},setTimeout:noop,requestAnimationFrame:noop};vm.createContext(box);
for(const f of ['current.js','river-layout.js','physics.js','game.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),box);
const run=s=>vm.runInContext(s,box);function resize(w,h){node('game').clientWidth=w;node('game').clientHeight=h;run('resize()')}
run(`reset();State.value=17;State.attention=4;State.flow=1.7;State.t=12;const originalContact=State.player.on,originalFeet=State.player.y+State.player.h,originalStageY=State.stageY;`);
for(const [w,h] of [[390,844],[844,390],[360,800],[1920,1080],[430,932]]){
 resize(w,h);
 run(`assert.equal(State.player.on,originalContact);assert(State.player.ground);assert.equal(State.player.y+State.player.h,originalFeet);assert.equal(State.stageY,originalStageY);assert.equal(State.value,17);assert.equal(State.attention,4);assert.equal(State.flow,1.7);assert.equal(State.t,12);assert(State.player.x>=8&&State.player.x+State.player.w<=State.w-8);for(const q of State.platforms){assert(q.x>=12);assert(q.x+q.w<=State.w-12+1e-8);if(q.anchored)assert.equal(q.anchorX,q.x);}var rider=surfaceBounds(State.player.on);assert(State.player.x+State.player.w>rider.left+3&&State.player.x<rider.right-3);`);
}
run(`Keys.jumpPressed=true;update(1/60);assert(!State.player.ground);const airborneFeet=State.player.y+State.player.h,airborneVY=State.player.vy;`);
resize(390,844);run(`assert(!State.player.ground);assert.equal(State.player.y+State.player.h,airborneFeet);assert.equal(State.player.vy,airborneVY);`);
resize(1920,1080);run(`reset()`);resize(390,844);
run(`const stage=State.platforms.find(q=>q.kind==='stage');assert.equal(stage.x,12);assert.equal(stage.w,366);State.player.x=stage.x+stage.w/2-State.player.w/2;State.player.y=stage.y-State.player.h-2;State.player.vy=120;State.player.ground=false;State.player.on=null;update(1/60);assert.equal(State.player.on,stage);assert.equal(State.endMode,'win');reset();assert(!State.endMode);assert(State.player.on.anchored);`);
console.log('PASS responsive stage, in-bounds platforms and anchors, grounded contact, unchanged progress/score, airborne trajectory, stage landing, restart across repeated width changes.');
