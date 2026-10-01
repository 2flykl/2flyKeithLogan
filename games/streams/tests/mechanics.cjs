const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict'),path=require('path');
const root=path.resolve(process.argv[2]||path.join(__dirname,'..'));
const noop=()=>{},nodes=new Map();let seed=1;
function node(id){if(!nodes.has(id))nodes.set(id,{clientWidth:1280,clientHeight:800,style:{},classList:{add:noop,remove:noop},addEventListener:noop,play:()=>Promise.resolve(),getContext:()=>new Proxy({},{get:()=>noop})});return nodes.get(id)}
const math=Object.create(Math);math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
const box={Math:math,console,assert,document:{getElementById:node,querySelector:node,querySelectorAll:()=>[],addEventListener:noop},window:{addEventListener:noop},performance:{now:()=>0},Image:class{set src(v){}},setTimeout:noop,requestAnimationFrame:noop};vm.createContext(box);
for(const f of ['current.js','river-layout.js','physics.js','game.js','qa-controller.js'])vm.runInContext(fs.readFileSync(path.join(root,f==='qa-controller.js'?'tests/'+f:f),'utf8'),box);
const run=s=>vm.runInContext(s,box);
const assetPaths=run(`Object.values(animDefs).flatMap(a=>a.files.map(f=>'assets/character_runtime/'+f)).concat(platformStateNames.flatMap(n=>[0,1,2,3].map(i=>'assets/platform_states/'+n+'/'+i+'.webp')),['penny','cash','attention'].flatMap(n=>[0,1,2,3].map(i=>'assets/collectibles/'+n+'/'+i+'.webp')),'assets/audio/streams_song.mp3')`);
for(const asset of assetPaths)assert(fs.existsSync(path.join(root,asset)), 'Missing asset: '+asset);
console.log('PASS all '+assetPaths.length+' runtime asset references exist.');
run(`
reset();Keys.jumpPressed=true;update(1/60);assert(State.startRetired);assert(!State.player.ground);
reset();setDirection(1,true);setDirection(1,false);setDirection(1,true);assert(Keys.dashTimer>0);
reset();let q=State.platforms.find(q=>q.riverItem);q.active=true;assignCurrent(q,'slow');State.platforms=[q];State.startRetired=true;q.kind='value';q.reward={type:'none',collected:true};
function drop(){State.player.x=q.x+q.w/2-36;State.player.y=surfaceBounds(q).y-134;State.player.vy=120;State.player.ground=false;State.player.on=null;update(1/60);}
drop();assert.equal(State.player.on,q);let value=State.value,streak=State.streak;drop();assert.equal(State.value,value);assert.equal(State.streak,streak);
State.flow=2;State.pressure=.4;q.reward={type:'value',tier:5,collected:false};update(1/60);assert(q.reward.collected);assert.equal(State.value,value+6);assert(State.pressure<.2);
q.reward={type:'attention',tier:2,collected:false};update(1/60);assert.equal(State.attention,2);assert(State.pressure>.2);
q.canDive=true;q.diveAge=0;q.sinkState='afloat';for(let i=0;i<39;i++)updateDive(q,true,1/60);assert.equal(q.sinkState,'warning');for(let i=0;i<60;i++)updateDive(q,false,1/60);assert(!q.retired);for(let i=0;i<10;i++)updateDive(q,false,1/60);assert(q.retired);assert.equal(q.sinkState,'under');
reset();const ball=State.platforms.find(q=>q.spec.name==='attentionBall');ball.y=State.startY-10;ball.active=true;assignCurrent(ball,'medium');State.platforms=[ball];q=ball;drop();assert.equal(ball.springState,'compress');Keys.jumpPressed=true;for(let i=0;i<28;i++)update(1/120);assert(ball.perfectBounce);assert(State.player.vy< -600);
reset();const rack=State.platforms.find(q=>q.packId!=null),cue=State.platforms.find(q=>q.breaker&&q.packTarget===rack.packId);breakRack(cue,rack);assert.equal(State.breakCount,1);const pieces=State.platforms.filter(q=>q.packId===rack.packId);assert(pieces.every(q=>q.packBroken));breakRack(cue,rack);assert.equal(State.breakCount,1);
reset();const side=State.platforms.find(q=>!q.route);assignCurrent(side,'express');assert(side.cruiseSpeed>330);assert.equal(side.reward.tier,5);assignCurrent(side,'fast');assert.equal(side.reward.tier,3);const normal=State.platforms.find(q=>q.riverItem);assignCurrent(normal,'slow');assert(side.cruiseSpeed>normal.cruiseSpeed*2);
State.pressure=.8;assert(speedWeights(side).express===0);State.pressure=0;State.flow=3;assert(speedWeights(side).express>18);
reset();const stage=State.platforms.find(q=>q.kind==='stage'),stageY=stage.y;for(let i=0;i<120;i++){update(1/60);assert.equal(stage.y,stageY);for(const q of State.platforms)if(q.active&&!q.launchPad&&q.kind!=='stage'){assert(Number.isFinite(q.x)&&Number.isFinite(q.y));assert(Number.isFinite(q.bodyVY??0));assert(q.x>=12&&q.x+q.w<=State.w-12.001+0.01);}}
State.player.on=null;State.player.ground=false;State.player.y=State.waterfallY+20;update(1/60);assert.equal(State.endMode,'fail');reset();assert(!State.endMode&&!State.startRetired&&State.value===0);
`);
console.log('PASS controls, dash, moored start departure, moving landing, no reward farming, Value/Flow bonus, Attention feedback, sink warning timing, spring boost, rack split, speed/reward tiers, recovery weights, fixed stage, finite body motion, failure/reset.');
run(`
reset();const berth=riverPiece(State.w/2,State.startY-40,220,{anchored:true,bank:0,reward:0});State.platforms=[berth];State.player.on=berth;State.player.ground=true;State.player.x=berth.x+40;State.player.y=berth.y-132;const bx=berth.x,by=berth.y;for(let i=0;i<120;i++)update(1/60);assert.equal(berth.x,bx);assert.equal(berth.y,by);assert.equal(berth.sink,0);assert(!State.endMode);
berth.anchored=false;berth.riverItem=false;berth.cruiseSpeed=120;for(let i=0;i<1200&&!State.endMode;i++)update(1/60);assert.equal(State.endMode,'fail','remaining on moving raft reaches waterfall');
reset();for(let i=0;i<60;i++)spawnRiverRow(State.startY-800-i*100);const objects=State.platforms.filter(q=>q.riverItem);const empty=objects.filter(q=>q.reward.type==='none').length;assert(empty>objects.length*.3&&empty<objects.length*.8,'mixed rewards and empty landing options');assert(objects.some(q=>q.anchored));assert(objects.some(q=>q.speedClass==='express'));assert(objects.some(q=>q.spec.name==='attentionBall'));assert.equal(new Set(State.encounters).size,4);assert(State.encounters.every((v,i)=>!i||v!==State.encounters[i-1]));
reset();const independent=State.platforms.filter(q=>q.riverItem&&!q.anchored&&!q.packId).slice(0,2);independent[0].cruiseSpeed=60;independent[1].cruiseSpeed=210;updateRiverLayout(1/60);assert(independent[1].downstreamSpeed>independent[0].downstreamSpeed*3,'no chain velocity equalization');
`);
run(`reset();const mooredStart=State.player.on;assert(mooredStart.anchored&&mooredStart.spec.name==='roadCase');Keys.jumpPressed=true;update(1/60);assert(!mooredStart.retired&&mooredStart.alpha===1);`);
console.log('PASS fixed moorings, moving-raft timeout, mixed empty/rewarded surfaces, four shuffled encounter types, and independent current speeds.');
