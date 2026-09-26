// Downstream traffic is sampled once on approach, then remains predictable.
const CURRENT_BANDS={slow:[48,78],medium:[115,165],fast:[225,285],express:[360,430]};
function speedWeights(q){
  if(q.puzzleSeq<4||q.recoveryBeat)return {slow:100,medium:0,fast:0};
  const recovering=State.recoveryTimer>0||State.pressure>.5;
  if(q.route)return recovering?{slow:65,medium:32,fast:3}:{slow:28,medium:57,fast:15};
  return recovering?{slow:40,medium:45,fast:15,express:0}:{slow:12,medium:32,fast:38,express:18+Math.max(0,State.flow-1)*8};
}
function assignCurrent(q,forced){
  q.speedClass=forced||weightedPick(speedWeights(q));
  const band=CURRENT_BANDS[q.speedClass];
  q.cruiseSpeed=rand(band[0],band[1])*(q.spec.category==='large'?.94:q.spec.category==='cluster'?1.05:1);
  if(q.spec.name==='attentionBall')q.cruiseSpeed=118;
  if(!q.route&&(q.speedClass==='fast'||q.speedClass==='express')){
    q.reward={type:'value',tier:q.speedClass==='express'?5:3,collected:false};
  }
}
function prepareCurrentRun(){
  State.floatTexts=[];State.breakCount=0;State.lastGain='READ THE CURRENT';State.lastGainTime=0;
  State.safeCamera=0;
  for(const q of State.platforms){
    q.active=q.launchPad||q.kind==='stage';q.sinkWarning=0;q.sinkState='afloat';
    q.canDive=q.kind==='fragile'&&!q.recoveryBeat&&!q.launchPad&&q.spec.name!=='attentionBall';
  }
  // A few optional racks occupy a side lane. A faster incoming case breaks each rack.
  const anchors=State.platforms.filter(q=>q.route&&q.puzzleSeq>=7&&q.puzzleSeq%11===7);
  for(const anchor of anchors){
    const lane=anchor.puzzleLane<2?4:0,cx=routeCenters()[lane],cy=anchor.y-40;
    const id=anchor.puzzleSeq;
    for(let i=0;i<3;i++){
      addPlatform(cx+(i-1)*46,cy+(i===1?-36:12),100,'stable',false,18+i);
      const q=State.platforms.at(-1);q.x=clamp(q.x,12,State.w-q.w-12);q.packId=id;q.packOrder=i;q.active=false;q.sinkState='afloat';q.sinkWarning=0;
      q.reward={type:'value',tier:2,collected:false};q.forcedBand='slow';
    }
    addPlatform(cx,cy-270,142,'fast',false,0);
    const cue=State.platforms.at(-1);cue.breaker=true;cue.packTarget=id;cue.active=false;cue.forcedBand='express';cue.sinkState='afloat';cue.sinkWarning=0;
  }
}
function updateTraffic(dt){
  const phase=clamp(State.riverMultiplier,.9,1.25);
  // Feed the saved route into the current offscreen. Waiting pieces retain their
  // spacing instead of leaving a void as the visible river travels downstream.
  const live=State.platforms.filter(q=>q.active&&q.route&&!q.launchPad&&q.kind!=='stage');
  const head=live.reduce((a,q)=>!a||q.y<a.y?q:a,null);
  if(head&&head.y>State.camera-200&&head.y-96>State.stageY+65){
    let next=State.platforms.find(q=>!q.active&&q.route&&q.kind!=='stage');
    if(!next){
      const seq=head.puzzleSeq+1,lane=seq%8<5?seq%8:8-seq%8;
      addPlatform(routeCenters()[lane],head.y-96,220,'stable',true,randomLargeBank());
      next=State.platforms.at(-1);next.puzzleSeq=seq;next.puzzleLane=lane;next.recoveryBeat=seq%3===0;next.active=false;next.sinkState='afloat';next.sinkWarning=0;
    }
    const shift=head.y-96-next.y;
    for(const q of State.platforms)if(!q.active&&q.kind!=='stage')q.y+=shift;
  }
  for(const q of State.platforms){
    if(q.launchPad||q.kind==='stage'){q.downstreamSpeed=0;continue;}
    if(!q.active&&worldY(q.y)>-300&&q.y>State.stageY+65){q.active=true;assignCurrent(q,q.forcedBand);}
    q.downstreamSpeed=q.active?(q.cruiseSpeed||70)*phase:0;
    if(q.packId!=null&&!q.packBroken)q.downstreamSpeed=65*phase;
    // Recovery keeps existing trajectories intact; relief affects incoming choices.
    if(q.active&&State.recoveryTimer>0&&q.recoveryBeat)q.downstreamSpeed*=.85;
  }
  // Elastic spacing changes velocity, never teleports visible rafts. Side
  // traffic remains unrestricted and can overtake this slower navigable chain.
  const chain=State.platforms.filter(q=>q.active&&q.route&&!q.launchPad&&q.kind!=='stage'&&!q.retired&&q.alpha>.2&&q.springState!=='submerge').sort((a,b)=>a.puzzleSeq-b.puzzleSeq);
  for(let i=chain.length-2;i>=0;i--){
    const lower=chain[i],upper=chain[i+1],gap=lower.y-upper.y;
    if(gap>120)lower.downstreamSpeed=Math.max(30,Math.min(lower.downstreamSpeed,upper.downstreamSpeed-(gap-120)*2));
    if(gap<95)upper.downstreamSpeed=Math.max(30,Math.min(upper.downstreamSpeed,lower.downstreamSpeed-(95-gap)*2));
  }
}
function breakRack(cue,target){
  if(target.packId==null||target.packBroken||!cue.breaker||cue.packTarget!==target.packId)return;
  const members=State.platforms.filter(q=>q.packId===target.packId&&!q.packBroken);
  for(const q of members){
    q.packBroken=true;q.currentKickX=(q.packOrder-1)*145;q.currentKickY=95+q.packOrder*26;q.collisionFlash=.45;
    q.cruiseSpeed=100+q.packOrder*22;q.speedClass='medium';
    q.canDive=q.packOrder===1;q.diveAge=0;q.sinkState='afloat';
  }
  cue.breaker=false;cue.currentKickY=-85;State.breakCount++;
  addParticle(target.x+target.w/2,target.y,'water',22);
  showGain(target.x+target.w/2,target.y-45,'BREAK!', 'blue');
}
function updateDive(q,occupied,dt){
  if(!q.canDive||!q.active||q.retired)return;
  if(q.sinkState==='afloat'){
    q.diveAge=(q.diveAge||0)+(occupied?dt:0);
    if(q.diveAge>=.65){q.sinkState='warning';q.sinkWarning=1.15;}
  }else if(q.sinkState==='warning'){
    q.sinkWarning-=dt;
    if(q.sinkWarning<=0){q.sinkState='under';q.retired=true;
      if(State.player.on===q){State.player.ground=false;State.player.on=null;State.player.coyote=.14;}
      addParticle(q.x+q.w/2,q.y,'water',16);
    }
  }
}
function showGain(x,y,text,type='gold'){
  State.floatTexts.push({x,y,text,type,life:1});if(State.floatTexts.length>8)State.floatTexts.shift();
  State.lastGain=text;State.lastGainTime=1.2;
}
function tickFeedback(dt){
  State.lastGainTime=Math.max(0,State.lastGainTime-dt);
  for(const f of State.floatTexts){f.y-=35*dt;f.life-=dt;}
  State.floatTexts=State.floatTexts.filter(f=>f.life>0);
}
function drawCurrentAccents(){
  const near=clamp(1-(State.waterfallY-State.camera-State.h)/1000,0,1);
  ctx.save();
  // Visible banks give downstream motion a stable spatial reference.
  for(const side of [0,1])for(let i=0;i<12;i++){
    const span=State.h+140,y=((i*127-State.camera*.8)%span+span)%span-60;
    const x=side?State.w+7:-7;
    ctx.fillStyle=i%2?'#173b40':'#24484a';ctx.beginPath();ctx.ellipse(x,y,20+(i%3)*6,36,.18,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='rgba(174,232,218,.17)';ctx.beginPath();ctx.ellipse(x+(side?-9:9),y+16,25,8,0,0,Math.PI*2);ctx.stroke();
  }
  for(let i=0;i<34;i++){
    const span=State.h+180,y=((i*83+State.riverTravel*(1.3+(i%3)*.18)-State.camera)%span+span)%span-90;
    const x=30+(i*97.73)%(Math.max(1,State.w-60));
    ctx.strokeStyle=`rgba(215,250,246,${.10+near*.08})`;ctx.lineWidth=i%4===0?2:1;
    ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x+4,y+18,x+1,y+38+(i%4)*8);ctx.stroke();
    if(i%3===0){ctx.fillStyle='rgba(222,255,249,.38)';ctx.beginPath();ctx.ellipse(x,y+42,2.5,1.2,0,0,Math.PI*2);ctx.fill();}
  }
  ctx.restore();
}
function drawRiverDirection(){
 ctx.save();ctx.textAlign='center';ctx.font='700 9px Arial';ctx.letterSpacing='2px';
 ctx.fillStyle='rgba(173,232,236,.55)';
 ctx.fillText('↑  UPSTREAM · THE STAGE',State.w/2,State.h-53);
 ctx.fillStyle='rgba(139,202,216,.42)';ctx.fillText('↓  CURRENT TO THE FALLS',State.w/2,State.h-12);
 ctx.restore();
}
function drawTrafficHint(q){
  if(q.retired||!q.active)return;
  const x=q.x+q.w/2,y=worldY(q.y+q.sink);
  if(y<-130||y>State.h+100)return;
  ctx.save();ctx.textAlign='center';
  if(q.sinkState==='warning'){
    ctx.strokeStyle='#ffc35e';ctx.lineWidth=2.5;ctx.globalAlpha=.7+.2*Math.sin(State.t*8);
    ctx.beginPath();ctx.ellipse(x,y+12,q.w*.46,13,0,0,Math.PI*2);ctx.stroke();
    ctx.font='bold 11px Arial';ctx.fillStyle='#ffe5a0';ctx.fillText('SINKING',x,y+36);
    ctx.beginPath();ctx.arc(x,y+14,6,-Math.PI/2,-Math.PI/2+Math.PI*2*clamp(q.sinkWarning/1.15,0,1));ctx.stroke();
  }else if(q.speedClass==='express'||q.breaker){
    ctx.strokeStyle='rgba(255,201,83,.6)';ctx.lineWidth=1.5;
    for(let i=-1;i<=1;i++){ctx.beginPath();ctx.moveTo(x+i*16,y-45);ctx.lineTo(x+i*16,y-100);ctx.stroke();}
  }
  ctx.restore();
}
function drawGainTexts(){
  ctx.save();ctx.textAlign='center';ctx.font='900 20px Arial';
  for(const f of State.floatTexts){ctx.globalAlpha=Math.min(1,f.life*2);ctx.fillStyle=f.type==='blue'?'#92f3ff':'#ffe096';ctx.strokeStyle='#06232b';ctx.lineWidth=4;ctx.strokeText(f.text,f.x,worldY(f.y));ctx.fillText(f.text,f.x,worldY(f.y));}
  ctx.restore();
}
