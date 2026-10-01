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
  const gap=feet-surfaceBounds(q).y,speed=q.bodyVY??q.downstreamSpeed??0;
  if(gap< -100||gap>340||worldY(q.y)<-80)continue;
  const d=(launch+speed)**2-2920*(gap+14);if(d<0)continue;
  const t=(launch+speed+Math.sqrt(d))/1460;
  const dx=q.x+q.w/2-p.x-p.w/2;
  if(Math.abs(dx)>Math.max(0,420*(t-.21))+q.w*.35)continue;
  const gain=gap-speed*t;
  const score=gain+(q.kind==='stage'?150:0)+(q.spec.name==='attentionBall'?70:0)+(q.anchored?25:0)-Math.abs(dx)*.13-(q.canDive?15:0);
  if((gain>8||(q.spec.name==='attentionBall'&&!q.landed&&gain> -55))&&score>bestScore){best=q;bestScore=score;}
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
   if(target){controller.target=target;Keys.jumpPressed=true;
    const dx=target.x+target.w/2-p.x-p.w/2;
    if(Math.abs(dx)>150&&Keys.dashCooldown<=0){const dir=Math.sign(dx);setDirection(dir,false);setDirection(dir,true);setDirection(dir,false);setDirection(dir,true);}
   }
   else {controller.target=null;controller.wait=10;Keys.jumpPressed=false;}
 }
 if(!p.ground&&p.vy> -120){
  let best=null,score=-Infinity;
  for(const q of State.platforms){
   if(!q.active||q.retired||q.alpha<.2||q.isStart||(q.springState&&q.springState!=='ready'))continue;
   const speed=q.bodyVY??q.downstreamSpeed??0,rel=p.vy-speed,gap=surfaceBounds(q).y-p.y-p.h;
   const disc=rel*rel+2920*gap;if(disc<0)continue;
   const t=(-rel+Math.sqrt(disc))/1460;if(t<0||t>1.2)continue;
   const dx=q.x+q.w/2+(q.motionVX||q.bodyVX||0)*t-p.x-p.w/2;
   if(Math.abs(dx)>420*t*.65+q.w*.38)continue;
   const value=-surfaceBounds(q).y-Math.abs(dx)*.15+(q===controller.target?25:0);
   if(value>score){score=value;best=q;}
  }
  if(best)controller.target=best;
 }
 if(controller.target){
   qaSteer(controller.target);
 }else Keys.left=Keys.right=false;
}
