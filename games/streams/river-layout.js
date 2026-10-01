// Encounter fields replace the ordered lane trail. Only arrivals are arranged;
// once in view, every moving object keeps its own downstream velocity.
const RIVER_ENCOUNTERS=['DRIFT FIELD','CROSSCURRENT','OPEN RAPIDS','BREAKWATER'];
function riverPiece(cx,y,width,options={}){
 addPlatform(cx,y,width,options.fragile?'fragile':'stable',true,options.spring?ATTENTION_BALL_INDEX:options.bank??null);
 const q=State.platforms.at(-1);
 if(State.w<650)q.w*=.78;
 q.active=true;q.riverItem=true;q.row=State.riverRow;q.puzzleSeq=State.riverRow;
 q.x=clamp(q.x,14,State.w-q.w-14);q.sinkState='afloat';q.sinkWarning=0;
 q.anchored=!!options.anchored;
 if(q.anchored&&State.w<650){q.w=Math.min(q.w,State.w*.23);q.x=cx<State.w/2?14:State.w-q.w-14;}
 q.anchorX=q.x;q.anchorY=q.y;
 q.canDive=!!options.fragile&&!q.anchored&&!options.spring;
 q.recoveryBeat=!!options.recovery;q.opening=State.riverRow<3;
 q.vx=q.anchored?0:rand(-11,11);q.xDriftAmp=q.anchored?0:rand(5,15);
 assignCurrent(q,options.band||weightedPick(State.recoveryTimer>0?{slow:80,medium:20}:{slow:65,medium:32,fast:3}));
 if(q.anchored){q.cruiseSpeed=0;q.speedClass='anchored';}
 if(options.spring){q.cruiseSpeed=rand(48,68);q.speedClass='slow';}
 q.downstreamSpeed=q.cruiseSpeed*clamp(State.riverMultiplier,.9,1.25);
 const quick=q.speedClass==='fast'||q.speedClass==='express';
 const pays=!options.spring&&Math.random()<(q.anchored?.22:quick?.65:.43);
 q.reward=pays?{type:quick||Math.random()<.76?'value':'attention',tier:quick?(q.speedClass==='express'?5:3):1,collected:false}:{type:'none',tier:0,collected:true};
 if(options.reward!==undefined)q.reward=options.reward?{type:'value',tier:options.reward,collected:false}:{type:'none',tier:0,collected:true};
 return q;
}
function riverEncounter(y){
 const band=Math.max(0,Math.floor((State.startY-y)/620));
 while(State.encounters.length<=band){
  if(!State.encounterBag.length)State.encounterBag=shuffled(RIVER_ENCOUNTERS);
  let next=State.encounterBag.pop();
  if(next===State.encounters.at(-1)){State.encounterBag.unshift(next);next=State.encounterBag.pop();}
  State.encounters.push(next);
 }
 return State.encounters[band];
}
function spawnRiverRow(y){
 const opening=State.riverRow<3,mode=opening?'DRIFT FIELD':riverEncounter(y);
 const last=State.feedX??State.w/2,reach=Math.min(150,State.w*.24);
 const cx=clamp(last+rand(-reach,reach),90,State.w-90);
 const eddy=mode==='BREAKWATER',spring=eddy?State.riverRow%3===1:State.riverRow>2&&State.riverRow%7===3;
 const anchor=eddy&&!spring&&State.riverRow%6===0;
 const primary=riverPiece(cx,y,rand(205,231),{anchored:anchor,spring,bank:randomLargeBank(),band:'slow',recovery:opening});
 primary.encounter=mode;State.feedX=primary.x+primary.w/2;
 // A second arrival is offset in depth and across the water, not lined up with
 // the first. Both are genuine landing options, and either can have the reward.
 const spread=Math.min(240,State.w*.36),direction=Math.random()<.5?-1:1;
 let bx=clamp(cx+direction*rand(spread*.65,spread),70,State.w-70);
 if(Math.abs(bx-cx)<55)bx=clamp(cx-direction*spread,70,State.w-70);
 const fast=mode==='OPEN RAPIDS'||mode==='CROSSCURRENT';
 riverPiece(bx,y+rand(-26,35),rand(160,218),{band:opening?'slow':weightedPick(State.recoveryTimer>0?{slow:80,medium:20}:fast?{slow:45,medium:40,fast:15}:{slow:60,medium:30,fast:10}),fragile:!opening&&Math.random()<.12});
 if(!opening&&State.w>650&&Math.random()<.60){
  riverPiece(rand(90,State.w-90),y+rand(-30,36),rand(130,180),{band:weightedPick({slow:10,medium:40,fast:35,express:15}),fragile:Math.random()<.18});
 }
 // Breakable bunches occasionally replace the wide-open choice. A following
 // express case catches the slow rack; the outer pieces fan out on impact.
 if(!opening&&State.riverRow%13===6){
  const pack=++State.nextPack,c=clamp(bx,110,State.w-110);
  for(let i=0;i<3;i++){
   const q=riverPiece(c+(i-1)*43,y-45+(i===1?-25:8),106,{bank:18+i,band:'slow',reward:i===1?3:0});
   q.packId=pack;q.packOrder=i;q.cruiseSpeed=60;q.vx=0;q.xDriftAmp=0;
  }
  const cue=riverPiece(c,y-245,144,{bank:0,band:'express',reward:Math.random()<.6?5:0});
  cue.breaker=true;cue.packTarget=pack;cue.route=false;cue.feedExcluded=true;cue.waitForPack=true;cue.active=false;
 }
 State.riverRow++;
}
function prepareRiverLayout(){
 const start=State.platforms.find(q=>q.launchPad),stage=State.platforms.find(q=>q.kind==='stage');
 State.platforms=[start,stage];State.floatTexts=[];State.breakCount=0;State.lastGain='READ THE WATER';State.lastGainTime=0;
 State.riverRow=0;State.nextPack=0;State.feedX=start.x+start.w/2;State.encounters=[];State.encounterBag=shuffled(RIVER_ENCOUNTERS);
 State.finalMooring=false;State.arrivalClock=0;
 start.active=stage.active=true;start.sinkState=stage.sinkState='afloat';
 for(let y=State.startY-84;y>State.camera-310;y-=rand(62,90))spawnRiverRow(y);
}
function updateRiverLayout(dt){
 const phase=clamp(State.riverMultiplier,.9,1.25);
 // Feed from upstream rather than revealing a stored staircase. No velocity
 // matching or neighbor tether exists after an object has entered the river.
 const live=State.platforms.filter(q=>q.riverItem&&!q.anchored&&!q.feedExcluded&&!q.retired&&q.alpha>.2);
 const head=live.reduce((a,q)=>!a||q.y<a.y?q:a,null);
 if(!State.finalMooring&&head&&head.y<State.stageY+350){
  const berth=riverPiece(State.w/2+rand(-70,70),State.stageY+106,224,{anchored:true,bank:0,reward:0});
  berth.feedExcluded=true;State.finalMooring=true;
 }
 // Continue arrivals while an offscreen mooring holds the old upstream head.
 State.arrivalClock=(State.arrivalClock||0)+dt;
 const entrance=State.camera-250;
 const entering=live.filter(q=>Math.abs(q.y-entrance)<80);
 if(head&&head.y>State.camera-230&&head.y-90>State.stageY+65){spawnRiverRow(head.y-rand(62,90));State.arrivalClock=0;}
 else if(State.arrivalClock>1.4&&entrance>State.stageY+65&&entering.filter(q=>Math.abs(q.x+q.w/2-State.player.x-36)<300).length<3){State.feedX=State.player.x+36;spawnRiverRow(entrance);State.arrivalClock=0;}
 for(const q of State.platforms){
  if(q.waitForPack){
   const rack=State.platforms.find(p=>p.packId===q.packTarget&&!p.retired);
   if(!rack){q.retired=true;q.waitForPack=false;continue;}
   q.y=rack.y-230;
   if(worldY(rack.y)>60){q.waitForPack=false;q.active=true;}
   else {q.downstreamSpeed=0;continue;}
  }
  if(q.launchPad||q.kind==='stage'||q.anchored){q.downstreamSpeed=0;continue;}
  q.downstreamSpeed=(q.cruiseSpeed||60)*phase;
  if(q.packId!=null&&!q.packBroken)q.downstreamSpeed=60*phase;
 }
 State.currentEncounter=riverEncounter(State.player.y+State.player.h);
}
