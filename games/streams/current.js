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
function prepareCurrentRun(){prepareRiverLayout();}
function updateTraffic(dt){updateRiverLayout(dt);}
function breakRack(cue,target){
  if(target.packId==null||target.packBroken||!cue.breaker||cue.packTarget!==target.packId)return;
  const members=State.platforms.filter(q=>q.packId===target.packId&&!q.packBroken);
  for(const q of members){
    q.packBroken=true;q.collisionFlash=.45;
    q.cruiseSpeed=100+q.packOrder*22;q.speedClass='medium';
    q.canDive=q.packOrder===1;q.diveAge=0;q.sinkState='afloat';
  }
  cue.breaker=false;State.breakCount++;
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
  for(let i=0;i<3;i++){
    const cx=State.w*(.2+i*.3)+Math.sin(State.t*.12+i)*22;
    const light=ctx.createLinearGradient(cx-80,0,cx+80,0);
    light.addColorStop(0,'rgba(99,212,190,0)');light.addColorStop(.5,'rgba(99,212,190,.045)');light.addColorStop(1,'rgba(99,212,190,0)');
    ctx.strokeStyle=light;ctx.lineWidth=130;ctx.beginPath();ctx.moveTo(cx,-60);
    ctx.bezierCurveTo(cx-60,State.h*.28,cx+60,State.h*.66,cx-20,State.h+60);ctx.stroke();
  }
  ctx.lineWidth=1;
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
 if(State.w<880)return; // Keep the touch controls and progress bar unobstructed.
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
  if(q.anchored){
    ctx.strokeStyle='rgba(183,223,205,.65)';ctx.lineWidth=1.3;
    for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(x+side*q.w*.33,y+10);ctx.quadraticCurveTo(x+side*q.w*.43,y+23,x+side*q.w*.46,y+36);ctx.stroke();}
    ctx.fillStyle='#c3e6d7';ctx.font='bold 9px Arial';ctx.fillText('◇ MOORED',x,y+44);
  }
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
