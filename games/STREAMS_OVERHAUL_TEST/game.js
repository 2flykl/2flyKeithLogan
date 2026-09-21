
'use strict';
const canvas=document.getElementById('game'), ctx=canvas.getContext('2d');
const $=s=>document.querySelector(s);
const MAX_RENDER_PIXELS=1600000;
let RENDER_SCALE=1;
let waterPattern=null;
const State={w:0,h:0,running:false,last:0,t:0,hudClock:0,fps:60,fpsClock:0,fpsFrames:0,camera:0,startY:0,stageY:0,waterfallY:0,platforms:[],particles:[],fish:[],player:null,value:0,attention:0,flow:1,streak:0,ended:false,endMode:null,endTimer:0,stageReached:false,riverPhase:'CALM',riverPhaseTime:0,riverMultiplier:.90,collisionCount:0};
const Keys={left:false,right:false,jumpPressed:false,lastTap:{left:-99,right:-99},dashDir:0,dashTimer:0,dashCooldown:0};
const Assets={char:{},platformStates:{},collectibles:{penny:[],cash:[],attention:[]},water:{}};
const animDefs={
  idle:{files:['idle_01.png','idle_02.png','idle_03.png','idle_04.png'],fps:4,loop:true,height:196},
  run:{files:['run_01.png','run_02.png','run_03.png','run_04.png'],fps:10,loop:true,height:200},
  jumpLaunch:{files:['jumpLaunch_01.png','jumpLaunch_02.png','jumpLaunch_03.png','jumpLaunch_04.png'],fps:12,loop:false,height:200},
  jumpRise:{files:['jumpRise_01.png','jumpRise_02.png'],fps:8,loop:true,height:205},
  jumpApex:{files:['jumpApex_01.png'],fps:1,loop:true,height:206},
  jumpFall:{files:['jumpFall_01.png'],fps:1,loop:true,height:205},
  landing:{files:['landing_01.png','landing_02.png'],fps:9,loop:false,height:196},
  ready:{files:['ready_01.png','ready_02.png'],fps:5,loop:true,height:196},
  balance:{files:['balance_01.png','balance_02.png'],fps:6,loop:true,height:205},
  slip:{files:['slip_01.png','slip_02.png','slip_03.png','slip_04.png'],fps:8,loop:true,height:215},
  victory:{files:['victory_01.png','victory_02.png'],fps:4,loop:true,height:208}
};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rand=(a,b)=>a+Math.random()*(b-a);
function clearInput(){Keys.left=false;Keys.right=false;Keys.jumpPressed=false;Keys.lastTap.left=-99;Keys.lastTap.right=-99;Keys.dashDir=0;Keys.dashTimer=0;Keys.dashCooldown=0;}
function keysReleased(){return !Keys.left&&!Keys.right&&!Keys.jumpPressed;}

const platformSpecs=[
  {name:'roadCase',category:'large',mass:0.96,sinkDelay:1.95,maxSink:14,sinkRate:11,recover:10,size:1.02},
  {name:'mixingConsole',category:'large',mass:0.90,sinkDelay:1.82,maxSink:14,sinkRate:13,recover:11,size:1.04},
  {name:'drumMachine',category:'large',mass:0.82,sinkDelay:1.56,maxSink:14,sinkRate:15,recover:12,size:0.96},
  {name:'turntable',category:'large',mass:0.80,sinkDelay:1.48,maxSink:14,sinkRate:16,recover:12,size:0.94},
  {name:'laptopCase',category:'large',mass:0.84,sinkDelay:1.58,maxSink:14,sinkRate:15,recover:11,size:0.98},
  {name:'broadcastMonitor',category:'large',mass:0.93,sinkDelay:1.88,maxSink:14,sinkRate:12,recover:10,size:1.02},
  {name:'synth',category:'large',mass:0.86,sinkDelay:1.66,maxSink:14,sinkRate:14,recover:11,size:1.06},
  {name:'speakerStack',category:'large',mass:0.94,sinkDelay:1.90,maxSink:14,sinkRate:12,recover:10,size:1.02},
  {name:'vinylCrate',category:'large',mass:0.78,sinkDelay:1.45,maxSink:14,sinkRate:17,recover:12,size:0.94},
  {name:'boombox',category:'large',mass:0.86,sinkDelay:1.68,maxSink:14,sinkRate:14,recover:11,size:0.98},
  {name:'djController',category:'large',mass:0.91,sinkDelay:1.82,maxSink:14,sinkRate:13,recover:10,size:1.04},
  {name:'reelToReel',category:'large',mass:0.89,sinkDelay:1.74,maxSink:14,sinkRate:14,recover:10,size:1.00},
  {name:'workstation',category:'medium',mass:0.72,sinkDelay:1.25,maxSink:22,sinkRate:18,recover:13,size:0.84},
  {name:'mpc',category:'medium',mass:0.64,sinkDelay:1.08,maxSink:22,sinkRate:20,recover:14,size:0.78},
  {name:'headphones',category:'medium',mass:0.46,sinkDelay:0.90,maxSink:22,sinkRate:25,recover:16,size:0.72},
  {name:'tablet',category:'medium',mass:0.56,sinkDelay:1.00,maxSink:22,sinkRate:22,recover:15,size:0.75},
  {name:'fieldRecorder',category:'medium',mass:0.58,sinkDelay:1.04,maxSink:22,sinkRate:21,recover:15,size:0.76},
  {name:'cameraRig',category:'medium',mass:0.70,sinkDelay:1.22,maxSink:22,sinkRate:18,recover:13,size:0.84},
  {name:'cassetteRaft',category:'cluster',mass:0.46,sinkDelay:0.82,maxSink:30,sinkRate:27,recover:17,size:0.68},
  {name:'cdRaft',category:'cluster',mass:0.42,sinkDelay:0.76,maxSink:30,sinkRate:29,recover:18,size:0.67},
  {name:'vinylRaft',category:'cluster',mass:0.52,sinkDelay:0.88,maxSink:30,sinkRate:25,recover:16,size:0.71},
  {name:'floppyRaft',category:'cluster',mass:0.48,sinkDelay:0.82,maxSink:30,sinkRate:27,recover:17,size:0.68},
  {name:'mediaRaft',category:'cluster',mass:0.50,sinkDelay:0.84,maxSink:30,sinkRate:26,recover:17,size:0.70},
  {name:'storageRaft',category:'cluster',mass:0.44,sinkDelay:0.76,maxSink:30,sinkRate:29,recover:18,size:0.66},
  {name:'attentionBall',category:'special',mass:0.18,sinkDelay:0.18,maxSink:54,sinkRate:70,recover:0,size:1.04}
];
const platformStateNames=platformSpecs.map(s=>s.name);
const ATTENTION_BALL_INDEX=platformSpecs.findIndex(s=>s.name==='attentionBall');
const routeChoices=[];
platformSpecs.forEach((s,i)=>{if(s.name==='attentionBall')return;const n=s.category==='large'?4:s.category==='medium'?2:1;for(let k=0;k<n;k++)routeChoices.push(i);});
const sideChoices=[];
platformSpecs.forEach((s,i)=>{if(s.name==='attentionBall'){sideChoices.push(i,i);return;}const n=s.category==='cluster'?3:s.category==='medium'?2:1;for(let k=0;k<n;k++)sideChoices.push(i);});
const rewardWeights={route:{none:.32,value:.53,attention:.15},side:{none:.26,value:.50,attention:.24}};
const balanceRules={
  maxAttentionStreak:1,
  maxEmptyStreak:1,
  recoveryEvery:5,
  choiceEvery:5,
  minRouteWidth:154,
  maxRouteWidth:236,
  sideChance:.26,
  attentionBallCooldown:9,
  springMinGap:9,
  springMaxGap:13
};
const movementProfiles={
  large:{label:'heavy',current:[0.58,0.80],bob:[0.52,0.92],sway:[0.005,0.011],meander:[4,9]},
  medium:{label:'medium',current:[0.88,1.16],bob:[0.88,1.38],sway:[0.009,0.018],meander:[7,14]},
  cluster:{label:'light',current:[1.22,1.58],bob:[1.15,1.76],sway:[0.014,0.026],meander:[10,18]},
  special:{label:'spring',current:[1.06,1.24],bob:[1.20,1.76],sway:[0.000,0.009],meander:[4,9]}
};
function profileForSpec(spec){
  if(spec.category==='large') return movementProfiles.large;
  if(spec.category==='medium') return movementProfiles.medium;
  if(spec.category==='cluster') return movementProfiles.cluster;
  return movementProfiles.special;
};
function weightedPick(weights){
  const r=Math.random(); let acc=0;
  for(const [k,v] of Object.entries(weights)){acc+=v;if(r<=acc)return k;}
  return Object.keys(weights)[0];
}
function chooseReward(route=true,seq=0){
  const weights=route?rewardWeights.route:rewardWeights.side;
  let type=weightedPick(weights);
  if(seq>0&&seq%balanceRules.recoveryEvery===0) type=Math.random()<.72?'value':'none';
  if(State.rewardMemory.attention>=balanceRules.maxAttentionStreak&&type==='attention') type=Math.random()<.78?'value':'none';
  if(State.rewardMemory.empty>=balanceRules.maxEmptyStreak&&type==='none') type='value';
  if(type==='attention'){State.rewardMemory.attention++;State.rewardMemory.empty=0;}
  else if(type==='none'){State.rewardMemory.empty++;State.rewardMemory.attention=0;}
  else {State.rewardMemory.attention=0;State.rewardMemory.empty=0;}
  const tier=type==='value'?(Math.random()<.08?3:Math.random()<.30?2:1):(type==='attention'?(Math.random()<.20?3:2):0);
  return {type,tier,collected:false};
}

function specFor(bank){return platformSpecs[bank%platformSpecs.length];}
function shuffled(arr){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function refillPlatformBag(route=true){
  const src=route?routeChoices:sideChoices;
  const bag=shuffled(src);
  if(State.lastBank!=null&&bag.length>1&&bag[0]===State.lastBank){[bag[0],bag[1]]=[bag[1],bag[0]];}
  if(route)State.routeBag=bag;else State.sideBag=bag;
}
function pickBank(route=true,seq=0){
  const key=route?'routeBag':'sideBag';
  if(!State[key]||State[key].length===0)refillPlatformBag(route);
  let bank=State[key].shift()%platformSpecs.length;
  const ball=ATTENTION_BALL_INDEX;
  if(route&&bank===ball&&seq<7)bank=routeChoices[Math.floor(Math.random()*routeChoices.length)];
  if(bank===ball&&seq-State.lastAttentionBall<balanceRules.attentionBallCooldown){
    const alt=State[key].findIndex(v=>(v%platformSpecs.length)!==ball);
    if(alt>=0){const replacement=State[key].splice(alt,1)[0]%platformSpecs.length;State[key].push(bank);bank=replacement;}
    else bank=routeChoices[Math.floor(Math.random()*routeChoices.length)];
  }
  if(bank===ball)State.lastAttentionBall=seq;
  State.lastBank=bank;
  return bank;
}
function safeImage(src){return new Promise(res=>{const im=new Image();im.onload=()=>res(im);im.onerror=()=>res(null);im.src=src;});}
async function loadAssets(){
  for(const [name,def] of Object.entries(animDefs)) Assets.char[name]=await Promise.all(def.files.map(f=>safeImage('assets/character_runtime/'+f)));
  for(const name of platformStateNames){
    Assets.platformStates[name]=(await Promise.all([0,1,2,3].map(i=>safeImage(`assets/platform_states/${name}/${i}.webp`)))).filter(Boolean);
  }
  for(const kind of ['penny','cash','attention']){
    Assets.collectibles[kind]=(await Promise.all([0,1,2,3].map(i=>safeImage(`assets/collectibles/${kind}/${i}.webp`)))).filter(Boolean);
  }
}
function resize(){
  State.w=Math.max(320,canvas.clientWidth); State.h=Math.max(240,canvas.clientHeight);
  const cssPixels=State.w*State.h;
  RENDER_SCALE=Math.min(1,Math.sqrt(MAX_RENDER_PIXELS/Math.max(1,cssPixels)));
  canvas.width=Math.max(1,Math.round(State.w*RENDER_SCALE));
  canvas.height=Math.max(1,Math.round(State.h*RENDER_SCALE));
  ctx.setTransform(RENDER_SCALE,0,0,RENDER_SCALE,0,0);
  ctx.imageSmoothingEnabled=true;
  if(Assets.water.surface) waterPattern=ctx.createPattern(Assets.water.surface,'repeat');
}
window.addEventListener('resize',resize); resize();
function worldY(y){return y-State.camera}
function addParticle(x,y,type,count=10){const room=Math.max(0,48-State.particles.length);count=Math.min(count,room);for(let i=0;i<count;i++)State.particles.push({x,y,vx:rand(-90,90),vy:rand(type==='water'?-100:-170,-20),life:rand(.28,.65),type,size:rand(2,5)});}
function addPlatform(cx,y,w,kind='stable',route=true,bankOverride=null){
 const bank=bankOverride==null?pickBank(route,State.platforms.length):bankOverride;
 const spec=specFor(bank);
 const actualW=clamp(w*spec.size,spec.category==='cluster'?86:96,spec.category==='large'?236:214);
 const reward=spec.name==='attentionBall'?{type:'none',tier:0,collected:true}:chooseReward(route,State.platforms.length);
 const profile=profileForSpec(spec);
 const currentFactor=rand(profile.current[0],profile.current[1])*(kind==='fast'?1.07:kind==='boost'?.96:1);
 const bobAmp=rand(profile.bob[0],profile.bob[1]);
 const swayAmp=rand(profile.sway[0],profile.sway[1]);
 const xDriftAmp=rand(profile.meander[0],profile.meander[1]);
 State.platforms.push({x:cx-actualW/2,y,w:actualW,h:30,kind,route,bank,spec,reward,vx:route?rand(-3.5,3.5):rand(-6.5,6.5),flow:kind==='fast'?1.16:kind==='boost'?.96:1,currentFactor,bobAmp,swayAmp,xDriftAmp,driftPhase:rand(0,Math.PI*2),floatTilt:0,rewardOffsetX:rand(-Math.min(18,actualW*.08),Math.min(18,actualW*.08)),rewardOffsetY:spec.category==='large'?38:spec.category==='medium'?34:28,movementClass:profile.label,currentKickY:0,currentKickX:0,collisionCooldown:0,collisionFlash:0,bob:rand(0,Math.PI*2),landed:false,spark:rand(0,10),sink:0,standTime:0,tilt:rand(-0.018,0.018),submerge:0,launchPad:false,impactTimer:0,recovering:false,wasOccupied:false,springState:spec.name==='attentionBall'?'ready':null,springTimer:0,perfectBounce:false,alpha:1});
}
function surfaceBounds(q){return {left:q.x,right:q.x+q.w,y:q.y+q.sink};}
function makeFish(){
  State.fish=[];
  const n=Math.min(4,Math.max(2,Math.round(State.w/520)));
  for(let i=0;i<n;i++) State.fish.push({x:rand(30,State.w-30),y:rand(State.stageY+150,State.waterfallY-120),vx:(Math.random()<.5?-1:1)*rand(18,46),size:rand(16,34),phase:rand(0,Math.PI*2),depth:rand(.15,.42)});
}
function routeCenters(){const step=Math.min(296,State.w*.165);const c=State.w/2;return [-2,-1,0,1,2].map(i=>c+i*step);}
const LARGE_BANKS=platformSpecs.map((s,i)=>s.category==='large'?i:-1).filter(i=>i>=0);
function randomLargeBank(){return LARGE_BANKS[Math.floor(Math.random()*LARGE_BANKS.length)];}
function nextPuzzleLane(lane,dir,recoveryBeat){
  if(recoveryBeat) return {lane,dir};
  let next=lane+dir;
  if(next<0||next>4){dir*=-1;next=lane+dir;}
  if(next===0||next===4) dir*=-1;
  return {lane:next,dir};
}
function makeBranchLane(mainLane,dir){
  const preferred=mainLane-dir;
  if(preferred>=0&&preferred<=4&&preferred!==mainLane)return preferred;
  const alt=mainLane+dir;
  return clamp(alt,0,4);
}
function reset(){
 State.t=0; State.camera=0; clearInput();
 State.platforms=[]; State.particles=[]; State.fish=[]; State.routeBag=[]; State.sideBag=[]; State.lastBank=null; State.lastAttentionBall=-99; State.value=0; State.attention=0; State.flow=1; State.streak=0; State.pressure=0; State.rewardMemory={attention:0,empty:0}; State.ended=false; State.endMode=null; State.endTimer=0; State.stageReached=false;
 State.riverPhase='CALM';State.riverPhaseTime=0;State.riverMultiplier=.90;State.collisionCount=0;State.startRetired=false;
 State.startY=State.h*.72; State.stageY=State.startY-5200; State.waterfallY=State.startY+Math.max(850,State.h*1.05);
 // Anchored launch ledge: this is NOT a floating river item and disappears after the first committed jump.
 addPlatform(State.w/2,State.startY,clamp(State.w*.30,230,286),'start',true,0);
 const start=State.platforms[0];start.launchPad=true;start.isStart=true;start.vx=0;start.sink=0;start.currentFactor=0;start.reward={type:'none',tier:0,collected:true};start.alpha=1;
 let y=State.startY-110,lane=2,sweepDir=Math.random()<.5?-1:1,seq=0,springRecovery=0;
 let nextSpring=9+Math.floor(rand(0,3));
 const cs=routeCenters();
 while(y>State.stageY+160){
   const onboarding=seq<5;
   const recoveryBeat=seq>0&&seq%balanceRules.recoveryEvery===0;
   y-=springRecovery>0?rand(68,80):(onboarding?rand(78,92):recoveryBeat?rand(78,94):rand(88,108));
   const laneStep=nextPuzzleLane(lane,sweepDir,recoveryBeat);lane=laneStep.lane;sweepDir=laneStep.dir;
   const progress=clamp((State.startY-y)/(State.startY-State.stageY),0,1);const r=Math.random();
   const kind=(springRecovery>0||onboarding||recoveryBeat)?'stable':(r<.56?'stable':r<.70?'fast':r<.82?'boost':r<.91?'fragile':'value');
   const width=springRecovery>0?rand(214,236):(onboarding?rand(208,232):(recoveryBeat?rand(212,238):clamp(rand(168,224)*(1-progress*.02),154,236)));
   const forceSpring=!onboarding&&seq>=nextSpring;
   const bankOverride=forceSpring?ATTENTION_BALL_INDEX:(recoveryBeat?randomLargeBank():null);
   addPlatform(cs[lane]+rand(-9,9),y,width,kind,true,bankOverride);
   const current=State.platforms[State.platforms.length-1];
   current.puzzleSeq=seq;current.puzzleLane=lane;
   if(onboarding&&current.reward.type==='attention')current.reward={type:seq<3?'value':'none',tier:1,collected:false};
   if(recoveryBeat&&current.spec.name!=='attentionBall'){current.reward={type:Math.random()<.72?'value':'none',tier:1,collected:false};current.currentFactor=Math.min(current.currentFactor,.78);}
   if(springRecovery>0){current.reward={type:Math.random()<.68?'value':'none',tier:1,collected:false};current.currentFactor=Math.min(current.currentFactor,.82);springRecovery=0;}
   if(current.spec.name==='attentionBall'){
     current.reward={type:'none',tier:0,collected:true};springRecovery=1;State.lastAttentionBall=seq;
     nextSpring=seq+Math.floor(rand(balanceRules.springMinGap,balanceRules.springMaxGap+1));
   }
   // Choice beats: a second reachable lane carries a clearer risk/reward decision.
   if(!onboarding&&!recoveryBeat&&seq>2&&seq%balanceRules.choiceEvery===2){
     const branchLane=makeBranchLane(lane,sweepDir);
     if(branchLane!==lane){
       addPlatform(cs[branchLane]+rand(-8,8),y+rand(10,34),rand(132,178),Math.random()<.55?'fast':'stable',false);
       const branch=State.platforms[State.platforms.length-1];branch.choiceBranch=true;branch.puzzleSeq=seq;branch.puzzleLane=branchLane;
       // Side choice is intentionally juicier but more attention-prone.
       if(Math.random()<.58)branch.reward={type:'value',tier:Math.random()<.28?2:1,collected:false};
       else branch.reward={type:'attention',tier:2,collected:false};
     }
   } else if(!onboarding&&Math.random()<balanceRules.sideChance*.42){
     const side=makeBranchLane(lane,-sweepDir);
     if(side!==lane)addPlatform(cs[side]+rand(-9,9),y+rand(18,44),rand(124,168),Math.random()<.55?'fast':'stable',false);
   }
   seq++;
 }
 addPlatform(State.w/2,State.stageY,clamp(State.w*.60,420,690),'stage',true);
 State.player={x:State.w/2-36,y:State.startY-132,w:72,h:132,vx:0,vy:0,ground:true,on:start,coyote:.18,face:1,anim:'idle',animTime:0,animFrame:0,landTimer:0,jumpLaunchTimer:0,slip:false};
 makeFish(); State.hudClock=0; State.fps=60; State.fpsClock=0; State.fpsFrames=0; updateHUD();
}
function beginFinish(mode){if(State.endMode) return; State.endMode=mode; State.endTimer=mode==='win'?1.0:.85; const p=State.player; if(mode==='win'){State.stageReached=true;p.ground=true;p.vx=0;p.vy=0;p.anim='victory';p.animTime=0;p.animFrame=0;} else {p.slip=true;p.ground=false;p.on=null;if(p.vy<80)p.vy=80;p.anim='slip';p.animTime=0;p.animFrame=0;}}
function finalizeFinish(){State.ended=true;State.running=false;$('#end').classList.remove('hidden'); const win=State.endMode==='win'; $('#endTitle').textContent=win?'YOU REACHED THE STAGE':'THE CURRENT WON THIS RUN'; const type=State.value>State.attention*1.5?'THE BUILDER':State.attention>State.value*1.4?'THE VIRAL CHASER':'THE BALANCER'; $('#endCopy').innerHTML=`Value <b>${State.value}</b> · Attention <b>${State.attention}</b> · Flow <b>x${State.flow.toFixed(2)}</b><br><br>Run identity: <b>${type}</b>`;}
function update(dt){
 State.t+=dt;
 const p=State.player; if(!p) return;
 const progress=clamp((State.startY-p.y)/(State.startY-State.stageY),0,1);
 State.pressure=Math.max(0,State.pressure-dt*.055);
 State.riverPhaseTime+=dt;
 const cycle=State.riverPhaseTime%24;
 let phase='CALM',targetMult=.95;
 if(cycle>=6&&cycle<9){phase='BUILD';targetMult=1.02+(cycle-6)*.07;}
 else if(cycle>=9&&cycle<16){phase='RUSH';targetMult=1.40;}
 else if(cycle>=16&&cycle<20){phase='SETTLE';targetMult=1.12-(cycle-16)*.06;}
 State.riverPhase=phase;
 State.riverMultiplier+=(targetMult-State.riverMultiplier)*Math.min(1,dt*2.2);
 const imbalance=Math.max(0,State.attention-State.value*.72);
 const riverSpeed=(35+progress*47)*(1+imbalance*.004+State.pressure*.10)*State.riverMultiplier;

 // The launch ledge is an anchored start zone, never a rideable upstream platform.
 const startPad=State.platforms.find(q=>q.isStart);
 if(startPad){
   if(!State.startRetired&&p.on!==startPad&&State.t>.35)State.startRetired=true;
   if(State.startRetired){startPad.alpha=Math.max(0,startPad.alpha-dt*2.8);startPad.retired=true;}
 }

 for(const q of State.platforms){
   if(q.kind!=='stage'&&!q.launchPad){
     const downstream=riverSpeed*q.flow*(q.currentFactor||1);
     q.y+=(downstream+(q.currentKickY||0))*dt;
     const meander=Math.sin(State.t*(0.55+(1-q.spec.mass)*0.65)+q.driftPhase)*(q.xDriftAmp||0);
     q.x+=(q.vx+meander*0.18+(q.currentKickX||0))*dt;
     q.currentKickY*=Math.max(0,1-dt*2.6);
     q.currentKickX*=Math.max(0,1-dt*3.4);
     q.collisionCooldown=Math.max(0,(q.collisionCooldown||0)-dt);
     q.collisionFlash=Math.max(0,(q.collisionFlash||0)-dt);
     if(q.x<12){q.x=12;q.vx=Math.abs(q.vx);} else if(q.x+q.w>State.w-12){q.x=State.w-12-q.w;q.vx=-Math.abs(q.vx);}
   }
   const occupied=!q.retired&&p.ground&&p.on===q;
   q.impactTimer=Math.max(0,q.impactTimer-dt);
   q.floatTilt=Math.sin(State.t*.95+q.driftPhase)*(q.swayAmp||0)+Math.cos(q.bob*.55)*(q.swayAmp||0)*.45;
   if(q.spec.name==='attentionBall'){
     if(q.springState==='compress'){
       q.springTimer-=dt;
       q.sink=Math.min(16,q.sink+88*dt);
       if(q.springTimer<=0&&p.ground&&p.on===q){
         const perfect=q.perfectBounce;
         p.ground=false;p.on=null;p.coyote=0;
         p.vy=perfect?-785:-735;
         p.vx=clamp(p.vx*(perfect?1.10:1.02),-610,610);
         p.jumpLaunchTimer=.24;
         q.springState='launch';q.springTimer=.14;q.sink=8;q.alpha=1;
         addParticle(p.x+p.w/2,p.y+p.h,'blue',perfect?26:18);
         addParticle(p.x+p.w/2,p.y+p.h,'water',16);
       }
     } else if(q.springState==='launch'){
       q.springTimer-=dt;
       q.sink=Math.max(0,q.sink-70*dt);
       if(q.springTimer<=0){q.springState='submerge';q.springTimer=.62;}
     } else if(q.springState==='submerge'){
       q.springTimer-=dt;q.sink=Math.min(95,q.sink+155*dt);
       if(q.springTimer<.34)q.alpha=Math.max(0,q.alpha-dt*2.8);
     }
     q.submerge=clamp(q.sink/54,0,1);q.bob+=dt*(1.35+(q.bobAmp||1)*.20);q.spark+=dt*2.4;
     q.wasOccupied=p.ground&&p.on===q;
     continue;
   }
   if(occupied&&!q.launchPad){
     q.standTime+=dt;q.recovering=false;
     const delay=q.kind==='fragile'?q.spec.sinkDelay*.46:q.spec.sinkDelay;
     if(q.standTime>delay){
       const target=q.kind==='fragile'?Math.min(48,q.spec.maxSink*1.45):q.spec.maxSink;
       q.sink=Math.min(target,q.sink+q.spec.sinkRate*dt);
       q.tilt+=(p.face*.0032)*dt;
     }
   } else {
     if(q.wasOccupied&&q.sink>1)q.recovering=true;
     q.standTime=Math.max(0,q.standTime-dt*1.5);
     q.sink=Math.max(0,q.sink-q.spec.recover*dt);
     if(q.sink<=.5)q.recovering=false;
     q.tilt*=Math.max(0,1-dt*5);
   }
   q.wasOccupied=occupied;
   q.submerge=clamp(q.sink/Math.max(1,q.spec.maxSink),0,1);
   if(!q.launchPad)q.bob+=dt*(1.00+(1-q.spec.mass)*.48+(q.bobAmp||1)*.16);
   q.spark+=dt*(q.kind==='boost'?3.1:1.4);
 }
 // Floating-platform collision physics: mass-weighted separation plus damped impulse.
 const activePlatforms=State.platforms.filter(q=>q.kind!=='stage'&&!q.launchPad&&q.alpha>.04&&worldY(q.y)>-280&&worldY(q.y)<State.h+280);
 for(let i=0;i<activePlatforms.length;i++){
   const a=activePlatforms[i];
   for(let j=i+1;j<activePlatforms.length;j++){
     const b=activePlatforms[j];
     const ax=a.x+a.w*.5,bx=b.x+b.w*.5,ay=a.y+a.sink,by=b.y+b.sink;
     const halfX=(a.w+b.w)*.40,halfY=28+(a.spec.category==='cluster'||b.spec.category==='cluster'?7:11);
     const dx=bx-ax,dy=by-ay;
     if(Math.abs(dx)>=halfX||Math.abs(dy)>=halfY)continue;
     const ox=halfX-Math.abs(dx),oy=halfY-Math.abs(dy);
     const ma=.45+a.spec.mass,mb=.45+b.spec.mass,total=ma+mb;
     if(oy<=ox){
       const s=dy>=0?1:-1;
       a.y-=s*oy*(mb/total)*.56;b.y+=s*oy*(ma/total)*.56;
       const va=riverSpeed*a.flow*(a.currentFactor||1)+(a.currentKickY||0);
       const vb=riverSpeed*b.flow*(b.currentFactor||1)+(b.currentKickY||0);
       const rel=(va-vb)*s;
       if(rel>4&&(a.collisionCooldown||0)<=0&&(b.collisionCooldown||0)<=0){
         const restitution=.22;
         const impulse=(1+restitution)*rel/(1/ma+1/mb);
         a.currentKickY-=s*(impulse/ma)*.45;b.currentKickY+=s*(impulse/mb)*.45;
         a.currentKickX+=rand(-10,10)*(1-a.spec.mass*.40);b.currentKickX+=rand(-10,10)*(1-b.spec.mass*.40);
         a.collisionCooldown=b.collisionCooldown=.16;a.collisionFlash=b.collisionFlash=.18;State.collisionCount++;
         if(rel>18)addParticle((ax+bx)*.5,(ay+by)*.5,'water',5);
       }
     }else{
       const s=dx>=0?1:-1;
       a.x-=s*ox*(mb/total)*.50;b.x+=s*ox*(ma/total)*.50;
       const rv=(a.vx+(a.currentKickX||0))-(b.vx+(b.currentKickX||0));
       if(rv*s>2&&(a.collisionCooldown||0)<=0&&(b.collisionCooldown||0)<=0){
         const impulse=1.20*(rv*s)/(1/ma+1/mb);
         a.currentKickX-=s*(impulse/ma)*.52;b.currentKickX+=s*(impulse/mb)*.52;
         a.collisionCooldown=b.collisionCooldown=.14;a.collisionFlash=b.collisionFlash=.16;
       }
     }
   }
 }
 // Route elasticity: preserve a reachable main path while side traffic stays chaotic.
 const routeNow=activePlatforms.filter(q=>q.route&&q.spec.name!=='attentionBall').sort((a,b)=>a.y-b.y);
 for(let i=0;i<routeNow.length-1;i++){
   const up=routeNow[i],down=routeNow[i+1],gap=down.y-up.y;
   if(gap>138){up.currentKickY=Math.min(34,(up.currentKickY||0)+(gap-138)*.45*dt*60);}
   else if(gap<58){up.currentKickY=Math.max(-24,(up.currentKickY||0)-(58-gap)*.34*dt*60);}
 }
 for(const f of State.fish){f.x+=f.vx*dt;f.phase+=dt*(2.5+Math.abs(f.vx)*.015);if(f.x<-60&&f.vx<0)f.x=State.w+60;if(f.x>State.w+60&&f.vx>0)f.x=-60;}

 Keys.dashTimer=Math.max(0,Keys.dashTimer-dt);
 Keys.dashCooldown=Math.max(0,Keys.dashCooldown-dt);
 if(Keys.dashTimer<=0)Keys.dashDir=0;

 // Ground is a hard state: zero vertical velocity and anchor to the real surface.
 if(p.ground&&p.on){
   if(p.on.retired){p.ground=false;p.on=null;p.coyote=.14;}
   const b=p.on?surfaceBounds(p.on):null;
   if(b){const overlap=p.x+p.w>b.left+3&&p.x<b.right-3;
   if(overlap){p.y=b.y-p.h;p.vy=0;p.coyote=.14;}
   else {p.ground=false;p.on=null;p.coyote=.14;}}
 } else {p.coyote=Math.max(0,p.coyote-dt);}

 if(!State.endMode){
   const move=(Keys.right?1:0)-(Keys.left?1:0);
   if(move!==0)p.face=move;
   const dashing=Keys.dashTimer>0&&Keys.dashDir!==0&&((Keys.dashDir<0&&Keys.left)||(Keys.dashDir>0&&Keys.right));
   const targetVX=dashing?Keys.dashDir*590:move*420;
   const response=p.ground?(dashing?12:9):(dashing?7:4.5);
   p.vx+=(targetVX-p.vx)*Math.min(1,dt*response);
   if(move===0&&!dashing)p.vx*=Math.max(0,1-dt*(p.ground?8:1.2));
   p.vx=clamp(p.vx,-610,610);

   // No queued jump: this flag lives for one physics frame only.
   if(Keys.jumpPressed){
     if(p.ground&&p.on&&p.on.spec.name==='attentionBall'&&p.on.springState==='compress'){
       p.on.perfectBounce=true;
       addParticle(p.x+p.w/2,p.y+p.h,'blue',7);
     } else if(p.ground||p.coyote>0){
       if(p.on&&p.on.isStart){p.on.retired=true;State.startRetired=true;}
       p.vy=-625-(State.flow-1)*16;
       p.ground=false;p.on=null;p.coyote=0;p.jumpLaunchTimer=.22;
       addParticle(p.x+p.w/2,p.y+p.h,'water',12);
     }
     Keys.jumpPressed=false;
   }
 } else if(State.endMode==='win'){p.vx*=Math.max(0,1-dt*8);p.vy=0;p.ground=true;Keys.jumpPressed=false;}

 p.x+=p.vx*dt;
 p.x=clamp(p.x,8,State.w-p.w-8);

 // Walking off a platform detaches immediately; there is no invisible floor.
 if(p.ground&&p.on){
   if(p.on.retired){p.ground=false;p.on=null;p.coyote=.14;}
   const b=p.on?surfaceBounds(p.on):null;
   if(p.x+p.w<=b.left+3||p.x>=b.right-3){p.ground=false;p.on=null;p.coyote=.14;}
   else {p.y=b.y-p.h;p.vy=0;}
 }

 if(!p.ground&&State.endMode!=='win'){
   const prevBottom=p.y+p.h;
   p.vy+=1460*dt;
   p.y+=p.vy*dt;
   const nowBottom=p.y+p.h;
   if(p.vy>=0){
     let hit=null,hitY=Infinity;
     for(const q of State.platforms){
       if(q.retired||q.kind==='start')continue;
       if(q.spec.name==='attentionBall'&&q.springState!=='ready')continue;
       if(q.alpha<=.02)continue;
       const b=surfaceBounds(q);
       if(p.x+p.w<=b.left+4||p.x>=b.right-4)continue;
       if(prevBottom<=b.y+3&&nowBottom>=b.y-3&&b.y<hitY){hit=q;hitY=b.y;}
     }
     if(hit){
       const b=surfaceBounds(hit);
       p.y=b.y-p.h;p.vy=0;p.ground=true;p.on=hit;p.coyote=.14;p.landTimer=.20;p.jumpLaunchTimer=0;p.slip=false;hit.impactTimer=.16;
       if(hit.spec.name==='attentionBall'){
         hit.springState='compress';hit.springTimer=.20;hit.perfectBounce=false;hit.landed=true;
         addParticle(p.x+p.w/2,b.y,'blue',14);addParticle(p.x+p.w/2,b.y,'water',12);
       } else if(!hit.landed){
         hit.landed=true;State.streak++;State.flow=clamp(1+Math.floor(State.streak/3)*.20,1,3);
         if(hit.kind==='value'){State.value+=1;addParticle(p.x+p.w/2,b.y,'gold',12);}
         if(hit.reward&&!hit.reward.collected&&hit.reward.type!=='none'){
           hit.reward.collected=true;
           if(hit.reward.type==='value'){State.value+=hit.reward.tier;State.flow=clamp(State.flow+.05*hit.reward.tier,1,3);addParticle(p.x+p.w/2,b.y-28,'gold',18+hit.reward.tier*3);}
           else {State.attention+=hit.reward.tier;State.pressure=clamp(State.pressure+.12*hit.reward.tier,0,1);State.flow=clamp(State.flow-.04*hit.reward.tier,1,3);addParticle(p.x+p.w/2,b.y-28,'blue',20+hit.reward.tier*3);}
         }
         addParticle(p.x+p.w/2,b.y,'water',14);
       }
     }
   }
 }

 for(const q of State.platforms)if(q!==p.on&&q.spec.name!=='attentionBall')q.landed=false;
 p.landTimer=Math.max(0,p.landTimer-dt);p.jumpLaunchTimer=Math.max(0,p.jumpLaunchTimer-dt);
 for(const a of State.particles){a.x+=a.vx*dt;a.y+=a.vy*dt;a.vy+=280*dt;a.life-=dt;}State.particles=State.particles.filter(a=>a.life>0);
 const camTarget=p.y-State.h*.42;State.camera+=(camTarget-State.camera)*Math.min(1,dt*5);
 if(!State.endMode){if(p.y+p.h>State.waterfallY)beginFinish('fail');if(p.y<State.stageY+48)beginFinish('win');}
 if(State.endMode){State.endTimer-=dt;if(State.endTimer<=0)finalizeFinish();}

 const nearEdge=p.ground&&p.on&&(()=>{const b=surfaceBounds(p.on);return(p.x-b.left)<18||(b.right-(p.x+p.w))<18;})();
 let newAnim='idle';
 if(State.endMode==='win')newAnim='victory';else if(State.endMode==='fail'||p.slip)newAnim='slip';else if(p.landTimer>0)newAnim='landing';else if(!p.ground){if(p.jumpLaunchTimer>0)newAnim='jumpLaunch';else if(p.vy<-120)newAnim='jumpRise';else if(Math.abs(p.vy)<=120)newAnim='jumpApex';else newAnim='jumpFall';}else if(nearEdge&&Math.abs(p.vx)<55)newAnim='balance';else if(Math.abs(p.vx)>30)newAnim='run';
 if(newAnim!==p.anim){p.anim=newAnim;p.animTime=0;p.animFrame=0;}
 const def=animDefs[p.anim]||animDefs.idle;p.animTime+=dt;const frames=(Assets.char[p.anim]||[]).filter(Boolean);if(frames.length){const index=Math.floor(p.animTime*def.fps);p.animFrame=def.loop?index%frames.length:Math.min(frames.length-1,index);}
 if(State.t>6.5)$('#toast').classList.add('hide');updateHUD();
}
function updateHUD(){
  const p=State.player||{y:State.startY};
  const progress=clamp((State.startY-p.y)/(State.startY-State.stageY),0,1);
  $('#valueText').textContent=String(State.value);
  $('#attentionText').textContent=String(State.attention);
  $('#flowText').textContent='x'+State.flow.toFixed(2).replace(/0$/,'');
  $('#progressText').textContent=Math.round(progress*100)+'%';
  $('#valueFill').style.width=Math.min(100,State.value*4)+'%';
  $('#attentionFill').style.width=Math.min(100,State.attention*5)+'%';
  $('#flowFill').style.width=((State.flow-1)/2*100)+'%';
  const runFill=$('#runfill'), runAvatar=$('#runavatar');
  if(runFill) runFill.style.clipPath=`inset(0 ${100-progress*100}% 0 0 round 999px)`;
  if(runAvatar) runAvatar.style.left=`calc(8px + ${progress*100}% * (100% - 16px) / 100)`;
  const fpsEl=$('#fpsText'); if(fpsEl) fpsEl.textContent=Math.round(State.fps)+' FPS';
  const status=$('#audioStatus');if(status&&State.running)status.textContent=`${State.riverPhase} CURRENT · ${State.riverMultiplier.toFixed(2)}x · five-lane puzzle flow`;
}
function tile(im,dx,dy,dw,dh,ox,oy,alpha=.2){if(!im)return; ctx.save(); ctx.globalAlpha=alpha; const pw=im.width, ph=im.height; for(let yy=dy-((oy%ph)+ph)%ph; yy<dy+dh; yy+=ph) for(let xx=dx-((ox%pw)+pw)%pw; xx<dx+dw; xx+=pw) ctx.drawImage(im,xx,yy,pw,ph); ctx.restore();}
function drawWater(){
  const g=ctx.createLinearGradient(0,0,0,State.h);
  g.addColorStop(0,'#247494');g.addColorStop(.18,'#1a6180');g.addColorStop(.56,'#0d4862');g.addColorStop(1,'#061b29');
  ctx.fillStyle=g;ctx.fillRect(0,0,State.w,State.h);
  ctx.save();
  for(let i=0;i<3;i++){
    const bandY=((i*260+State.t*(32+i*5))%(State.h+280))-140;
    const band=ctx.createLinearGradient(0,bandY,0,bandY+160);
    band.addColorStop(0,'rgba(255,255,255,0)');
    band.addColorStop(.5,`rgba(118,218,235,${0.045+i*0.012})`);
    band.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=band; ctx.fillRect(0,bandY,State.w,170);
  }
  for(let i=0;i<6;i++){
    const yy=((i*150+State.t*(26+i*3.1))%(State.h+180))-90;
    ctx.strokeStyle=`rgba(220,247,255,${0.038+i*0.008})`;ctx.lineWidth=i<2?1:1.25;
    ctx.beginPath();
    for(let xx=0;xx<=State.w+60;xx+=54){const py=yy+Math.sin(xx*.0105+State.t*(.78+i*.05)+i)*8+Math.cos(xx*.006+i)*4;if(xx===0)ctx.moveTo(xx,py);else ctx.lineTo(xx,py);}
    ctx.stroke();
  }
  for(let i=0;i<9;i++){
    const px=(i/8)*State.w + Math.sin(State.t*.25+i)*26;
    const py=((i*115+State.t*(18+i))%(State.h+120))-60;
    const caustic=ctx.createRadialGradient(px,py,8,px,py,70);
    caustic.addColorStop(0,'rgba(255,255,255,0.035)');
    caustic.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=caustic; ctx.beginPath(); ctx.ellipse(px,py,78,24,0,0,Math.PI*2); ctx.fill();
  }
  ctx.restore();
  const bank=Math.max(28,Math.min(72,State.w*.045));
  const bankGrad=ctx.createLinearGradient(0,0,bank,0);
  bankGrad.addColorStop(0,'rgba(0,10,18,.56)'); bankGrad.addColorStop(1,'rgba(0,10,18,0)');
  ctx.fillStyle=bankGrad;ctx.fillRect(0,0,bank,State.h);
  ctx.fillRect(State.w-bank,0,bank,State.h);
}
function drawRipple(cx,cy,w,phase,color='rgba(219,249,255,0.22)'){ctx.save();ctx.strokeStyle=color;ctx.lineWidth=1.15;ctx.globalAlpha=.52;for(let i=0;i<2;i++){ctx.beginPath();ctx.ellipse(cx,cy+i*3,w*(.20+i*.055),6+i*2+Math.sin(phase+i)*1.1,0,0,Math.PI*2);ctx.stroke();}ctx.restore();}
function drawWake(cx,cy,w,speed,phase){
  const strength=clamp((speed-14)/54,0.06,0.22);
  ctx.save();
  ctx.globalAlpha=.34+strength*.55;
  ctx.strokeStyle=`rgba(223,248,255,${0.16+strength*.42})`;
  ctx.lineWidth=1.1;
  for(let i=0;i<3;i++){
    const off=i*7;
    ctx.beginPath();
    ctx.ellipse(cx,cy+14+off,w*(.18+i*.04),5+i*1.8,0,0,Math.PI*2);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(cx-w*.16,cy+10);
  ctx.quadraticCurveTo(cx,cy+18+Math.sin(phase)*3,cx+w*.16,cy+10);
  ctx.stroke();
  ctx.restore();
}
function drawObjectShadow(cx,cy,w,intensity=.22){ctx.save();ctx.globalAlpha=intensity;ctx.fillStyle='#03151b';ctx.beginPath();ctx.ellipse(cx,cy,w*.38,Math.max(5,w*.075),0,0,Math.PI*2);ctx.fill();ctx.restore();}
function drawFish(){
  for(const f of State.fish){
    const sy=worldY(f.y); if(sy<-60||sy>State.h+60) continue; const dir=f.vx<0?-1:1; const tail=Math.sin(f.phase)*.55;
    ctx.save(); ctx.globalAlpha=f.depth; ctx.translate(f.x,sy); ctx.scale(dir,1);
    ctx.fillStyle='rgba(72,145,146,.72)'; ctx.beginPath(); ctx.ellipse(0,0,f.size*1.05,f.size*.42,0,0,Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-f.size*.92,0); ctx.lineTo(-f.size*1.6,-f.size*.48+tail*5); ctx.lineTo(-f.size*1.48,f.size*.48+tail*5); ctx.closePath(); ctx.fill();
    ctx.fillStyle='rgba(219,252,245,.38)'; ctx.beginPath(); ctx.ellipse(f.size*.18,-f.size*.12,f.size*.36,f.size*.1,-.2,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }
}
function riverVisualFactor(q){return (28+(q.currentFactor||1)*36)*(q.flow||1)*State.riverMultiplier+Math.abs(q.currentKickY||0)*.16;}
function drawStageGlow(){ const sy=worldY(State.stageY); if(sy>-500&&sy<State.h+220){ ctx.save(); const g=ctx.createRadialGradient(State.w/2,sy,20,State.w/2,sy,360); g.addColorStop(0,'rgba(255,184,79,.36)'); g.addColorStop(1,'rgba(255,184,79,0)'); ctx.fillStyle=g; ctx.fillRect(0,sy-330,State.w,620); for(let i=0;i<6;i++){ ctx.strokeStyle='rgba(255,206,131,.18)'; ctx.lineWidth=8; ctx.beginPath(); ctx.moveTo(State.w/2+(i-3)*90,sy-20); ctx.lineTo(State.w/2+(i-3)*170,sy-370); ctx.stroke(); } ctx.restore(); } }
function platformFrame(q){
 const frames=Assets.platformStates[q.spec.name]||[];
 if(!frames.length)return null;
 let idx=0;
 if(q.spec.name==='attentionBall'){
   idx=q.springState==='compress'?1:q.springState==='launch'?2:q.springState==='submerge'?3:0;
 } else if(q.submerge>.48)idx=2;
 else if(q.recovering)idx=3;
 else if(q.impactTimer>0||q.standTime>.10)idx=1;
 return frames[Math.min(idx,frames.length-1)]||frames[0];
}
function drawPlatform(q){
 const sy=worldY(q.y+q.sink);if(sy<-210||sy>State.h+150)return;
 const bob=q.launchPad?0:Math.sin(q.bob)*(0.8+(1-q.spec.mass)*1.25);const cx=q.x+q.w/2,cy=sy+bob;
 if(q.kind==='start'){
   if((q.alpha??1)<=.02)return;
   ctx.save();ctx.globalAlpha=q.alpha??1;
   const g=ctx.createLinearGradient(q.x,cy-14,q.x+q.w,cy+24);g.addColorStop(0,'#23333b');g.addColorStop(.5,'#455963');g.addColorStop(1,'#1a2930');
   ctx.fillStyle=g;ctx.beginPath();ctx.roundRect(q.x,cy-10,q.w,30,8);ctx.fill();
   ctx.strokeStyle='rgba(222,245,250,.38)';ctx.lineWidth=1.2;ctx.stroke();
   ctx.fillStyle='rgba(111,215,235,.16)';ctx.fillRect(q.x+8,cy+16,q.w-16,3);
   ctx.restore();return;
 }
 if(q.kind==='stage'){
   const grd=ctx.createLinearGradient(q.x,cy,q.x+q.w,cy);grd.addColorStop(0,'#0d4654');grd.addColorStop(.5,'#ffb65e');grd.addColorStop(1,'#0d4654');ctx.fillStyle=grd;ctx.fillRect(q.x,cy+2,q.w,18);ctx.fillStyle='rgba(255,217,146,.25)';ctx.fillRect(q.x,cy-6,q.w,10);ctx.font='900 16px Arial';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText('THE STAGE',cx,cy-26);return;
 }
 const art=platformFrame(q);if(!art)return;
 const natural=art.width/Math.max(1,art.height);
 let vw=q.w,vh=vw/natural;
 const maxH=q.spec.name==='attentionBall'?150:q.spec.category==='large'?146:q.spec.category==='medium'?124:106;
 if(vh>maxH){const sc=maxH/vh;vw*=sc;vh=maxH;}
 drawObjectShadow(cx,cy+15,vw*.72,.12+.05*q.spec.mass);
 drawRipple(cx,cy+15,vw*.72,q.spark,q.spec.name==='attentionBall'?'rgba(80,200,255,.32)':q.kind==='boost'?'rgba(121,236,255,.28)':'rgba(225,247,255,.13)');
 if(q.spec.name==='attentionBall'&&q.springState==='ready'){ctx.save();const ag=ctx.createRadialGradient(cx,cy,10,cx,cy,vw*.58);ag.addColorStop(0,'rgba(92,218,255,.16)');ag.addColorStop(.62,'rgba(90,130,255,.08)');ag.addColorStop(1,'rgba(90,130,255,0)');ctx.fillStyle=ag;ctx.beginPath();ctx.arc(cx,cy,vw*.58,0,Math.PI*2);ctx.fill();ctx.restore();}
 if(q.collisionFlash>0){ctx.save();ctx.globalAlpha=q.collisionFlash*1.8;ctx.strokeStyle='rgba(235,253,255,.38)';ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(cx,cy+14,vw*.32,9,0,0,Math.PI*2);ctx.stroke();ctx.restore();}
 const vx=cx-vw/2,vy=cy-vh*.69;
 drawWake(cx,cy+12,vw*.70,riverVisualFactor(q),q.spark);
 ctx.save();ctx.translate(cx,cy+4);ctx.rotate(q.spec.name==='attentionBall'?0:(q.tilt+(q.floatTilt||0)));ctx.translate(-cx,-(cy+4));ctx.globalAlpha=(q.alpha??1)*(1-q.submerge*.06);ctx.drawImage(art,vx,vy,vw,vh);ctx.restore();
}
function drawPlatformReward(q){
 if(!q.reward||q.reward.collected||q.reward.type==='none'||q.spec.name==='attentionBall') return;
 const b=surfaceBounds(q), sy=worldY(b.y), cx=q.x+q.w/2+(q.rewardOffsetX||0);
 const pulse=Math.floor((State.t*2.6+q.spark)%3);
 let frames,size,glow='rgba(255,208,114,.18)';
 if(q.reward.type==='value'){
   const kind=q.reward.tier>=2?'cash':'penny';frames=Assets.collectibles[kind]||[];size=q.reward.tier===3?70:q.reward.tier===2?61:50;
 } else {frames=Assets.collectibles.attention||[];size=q.reward.tier===3?68:58;glow='rgba(110,226,255,.28)';}
 if(!frames.length)return;
 const im=frames[Math.min(pulse,frames.length-1)]||frames[0];
 const bob=Math.sin(State.t*2.5+q.spark)*2.2;
 const pulseScale=1+Math.sin(State.t*4.2+q.spark)*.055;
 ctx.save();
 ctx.translate(cx,sy-Math.max(q.rewardOffsetY||30,44)+bob);ctx.scale(pulseScale,pulseScale);
 ctx.globalAlpha=.24;ctx.fillStyle=glow;ctx.beginPath();ctx.arc(0,0,size*.70,0,Math.PI*2);ctx.fill();
 ctx.globalAlpha=.58;ctx.strokeStyle=q.reward.type==='attention'?'rgba(130,235,255,.82)':'rgba(255,225,135,.78)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,2,size*.57,size*.36,0,0,Math.PI*2);ctx.stroke();
 ctx.globalAlpha=.98;ctx.drawImage(im,-size/2,-size*.74,size,size*(im.height/im.width));
 ctx.globalAlpha=.75;ctx.fillStyle='#fff';for(let i=0;i<3;i++){const a=State.t*1.7+i*2.094+q.spark;ctx.beginPath();ctx.arc(Math.cos(a)*size*.64,Math.sin(a)*size*.34-3,1.7,0,Math.PI*2);ctx.fill();}
 ctx.restore();
}
function drawParticles(){ for(const p of State.particles){ const sy=worldY(p.y); ctx.globalAlpha=clamp(p.life/.8,0,1); ctx.fillStyle=p.type==='gold'?'#ffd072':p.type==='blue'?'#6fe2ff':p.type==='dash'?'#b7f5ff':'#e8fdff'; ctx.beginPath(); ctx.arc(p.x,sy,p.size,0,Math.PI*2); ctx.fill(); } ctx.globalAlpha=1; }
function drawPlayer(){ const p=State.player; if(!p) return; const sy=worldY(p.y); const frames=(Assets.char[p.anim]||[]).filter(Boolean); const im=frames[p.animFrame]||frames[0]||Assets.char.idle?.[0]; if(!im) return; const def=animDefs[p.anim]||animDefs.idle; const renderH=(def.height||198)*1.09; let scaleX=p.face<0?-1:1, squashY=1, squashX=1; if(p.anim==='landing'){squashY=.95;squashX=1.04;} if(p.anim==='jumpLaunch'){squashY=.98;squashX=1.02;} if(p.anim==='jumpRise'){squashY=1.02;} ctx.save(); ctx.translate(p.x+p.w/2, sy+p.h+4); ctx.scale(scaleX*squashX, squashY); drawObjectShadow(0,0,54,p.anim==='slip'?0:.22); ctx.drawImage(im,-renderH*(im.width/im.height)/2,-renderH,renderH*(im.width/im.height),renderH); ctx.restore(); }
function drawWaterfall(){ const lip=worldY(State.waterfallY); if(lip>-80&&lip<State.h+120){ const g=ctx.createLinearGradient(0,lip,0,State.h); g.addColorStop(0,'rgba(233,253,255,.82)'); g.addColorStop(.12,'rgba(109,201,220,.42)'); g.addColorStop(1,'rgba(0,0,0,.9)'); ctx.fillStyle=g; ctx.fillRect(0,lip,State.w,State.h-lip); ctx.fillStyle='#fff'; ctx.font='900 10px Arial'; ctx.textAlign='center'; ctx.fillText('POINT OF NO RETURN',State.w/2,lip-14); } }
function draw(){ drawWater(); drawFish(); drawStageGlow(); for(const q of State.platforms){ drawPlatform(q); drawPlatformReward(q); } drawParticles(); drawPlayer(); drawWaterfall(); }
function loop(ts){
 if(!State.running)return;
 const raw=(ts-State.last)/1000||.0167;
 const dt=Math.min(.033,Math.max(.001,raw));
 State.last=ts;
 State.fpsFrames++; State.fpsClock+=raw;
 if(State.fpsClock>=.5){State.fps=State.fpsFrames/State.fpsClock;State.fpsFrames=0;State.fpsClock=0;}
 update(dt);draw();requestAnimationFrame(loop);
}
function start(){
 clearInput();reset();
 if(document.activeElement&&document.activeElement.blur)document.activeElement.blur();
 $('#intro').classList.add('hidden');$('#end').classList.add('hidden');$('#toast').classList.remove('hide');
 State.running=true;State.last=performance.now();
 const music=$('#music');music.volume=.42;music.play().catch(()=>{});
 requestAnimationFrame(loop);
}
function setDirection(dir,down){
 const key=dir<0?'left':'right';
 if(down){
   const already=Keys[key];
   if(!already){
     const now=performance.now()/1000;
     if(now-Keys.lastTap[key]<.27&&Keys.dashCooldown<=0){Keys.dashDir=dir;Keys.dashTimer=.55;Keys.dashCooldown=.18;}
     Keys.lastTap[key]=now;
   }
   Keys[key]=true;
 } else Keys[key]=false;
}
window.addEventListener('keydown',e=>{
 if(!State.running)return;
 const c=e.code;
 if(c==='ArrowLeft'||c==='ArrowRight'||c==='ArrowUp'||c==='Space')e.preventDefault();
 if(c==='ArrowLeft'||c==='KeyA')setDirection(-1,true);
 if(c==='ArrowRight'||c==='KeyD')setDirection(1,true);
 if((c==='ArrowUp'||c==='Space')&&!e.repeat)Keys.jumpPressed=true;
},{passive:false});
window.addEventListener('keyup',e=>{
 const c=e.code;
 if(c==='ArrowLeft'||c==='KeyA')setDirection(-1,false);
 if(c==='ArrowRight'||c==='KeyD')setDirection(1,false);
});
window.addEventListener('blur',clearInput);
document.addEventListener('visibilitychange',()=>{if(document.hidden)clearInput();});
document.querySelectorAll('.touch button').forEach(btn=>{
 const k=btn.dataset.k;
 const on=e=>{e.preventDefault();if(!State.running)return;if(k==='left')setDirection(-1,true);if(k==='right')setDirection(1,true);if(k==='jump')Keys.jumpPressed=true;};
 const off=e=>{e.preventDefault();if(k==='left')setDirection(-1,false);if(k==='right')setDirection(1,false);};
 btn.addEventListener('pointerdown',on);btn.addEventListener('pointerup',off);btn.addEventListener('pointercancel',off);btn.addEventListener('pointerleave',off);
});
$('#start').onclick=start; $('#restart').onclick=start;
const music=$('#music'), audioStatus=$('#audioStatus');
function updateAudioStatus(){ if(!audioStatus) return; if(music.currentSrc && music.currentSrc.includes('streams_song.mp3')) audioStatus.textContent='Overhaul runtime · Moving current · Media physics · Spring Attention Ball'; else audioStatus.textContent='Soundtrack optional · visual target pass active'; }
music.addEventListener('loadedmetadata',updateAudioStatus); music.addEventListener('canplay',updateAudioStatus); music.addEventListener('error',updateAudioStatus); setTimeout(updateAudioStatus,800);
loadAssets().then(()=>{ resize(); reset(); draw(); $('#start').disabled=false; $('#start').textContent='ENTER THE STREAM'; }).catch(err=>{ console.error(err); reset(); draw(); $('#start').disabled=false; $('#start').textContent='ENTER THE STREAM'; });
