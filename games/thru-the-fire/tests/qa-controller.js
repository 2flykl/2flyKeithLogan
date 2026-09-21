// QA-only input driver. Predicts a landing on moving targets; never moves the player.
function qaChooseTarget(){
 return qaEstimate();
}
function qaEstimate(){
 const p=State.player,feet=p.y+p.h,launch=p.on?.spec.name==='attentionBall'?785:625;
 let best=null,bestScore=-Infinity;
 for(const q of State.platforms){
  if(!q.route||!q.active||q===p.on||q.retired||q.isStart||q.alpha<.2||q.sinkState==='warning')continue;
  if(q.spec.name==='attentionBall'&&q.springState!=='ready')continue;
  const gap=feet-surfaceBounds(q).y,speed=q.downstreamSpeed||0;
  if(gap< -100||gap>340||worldY(q.y)<-80)continue;
  const d=(launch+speed)**2-2920*(gap+14);if(d<0)continue;
  const t=(launch+speed+Math.sqrt(d))/1460;
  const dx=q.x+q.w/2-p.x-p.w/2;
  if(Math.abs(dx)>Math.max(0,420*(t-.21))+q.w*.35)continue;
  const gain=gap-speed*t;
  const score=gain+(q.kind==='stage'?150:0)+(q.spec.name==='attentionBall'?115:0)-Math.abs(dx)*.13-(q.canDive?15:0);
  if((gain>12||(!q.landed&&gain> -170))&&score>bestScore){best=q;bestScore=score;}
 }
 return best;
}
function qaSteer(q){
 const p=State.player,dx=q.x+q.w/2-(p.x+p.w/2),brake=p.vx*.14;
 Keys.left=dx<brake-6;Keys.right=dx>brake+6;
}
function qaDrive(controller){
 const p=State.player;
 if(p.ground&&!controller.target&&(controller.wait||0)>0){controller.wait--;Keys.left=Keys.right=Keys.jumpPressed=false;return;}
 if(p.ground&&!(p.on?.spec.name==='attentionBall'&&p.on.springState==='compress'&&controller.target&&controller.target!==p.on)){
   const target=qaChooseTarget();
   if(target){controller.target=target;Keys.jumpPressed=true;}
   else {controller.target=null;controller.wait=10;Keys.jumpPressed=false;}
 }
 if(controller.target){
   qaSteer(controller.target);
 }else Keys.left=Keys.right=false;
}
