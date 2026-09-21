// Authoritative navigation policy. No rendering, DOM, audio, or camera side effects.
export const NAV = Object.freeze({UNIVERSE:'Universe Travel',ENTERING:'Entering Galaxy',INSIDE:'Inside Galaxy',SELECTED:'Local Object Selected',CONTENT:'Local Content Open',EXITING:'Exiting Galaxy',CHARGING:'Warp Charging',TRANSIT:'Warp Transit',ARRIVAL:'Warp Arrival'});
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
export const SAFE_ARRIVALS=Object.freeze([
 {x:0,y:26000,z:70000},{x:-24000,y:14000,z:48000},{x:22000,y:-19000,z:47000},{x:0,y:-26000,z:49000},{x:18000,y:29000,z:59000}
]);
export function validateArrival(point,boundaries,bodies=[]){
 return [point.x,point.y,point.z].every(Number.isFinite) && boundaries.every(g=>distance(point,g.center)>g.exitRadius+3500) && bodies.every(b=>distance(point,b.center)>b.radius+3500);
}
export class NavigationSafety {
 constructor({boundaries,onChange=()=>{},onReturn=()=>{},random=Math.random,now=()=>performance.now(),bodies=[]}){
  this.boundaries=boundaries;this.onChange=onChange;this.onReturn=onReturn;this.random=random;this.now=now;
  this.arrivals=SAFE_ARRIVALS.filter(p=>validateArrival(p,boundaries,bodies));
  if(!this.arrivals.length)throw Error('No collision-free return points configured');
  this.state=NAV.UNIVERSE;this.galaxyId=null;this.selection=null;this.transition=0;this.cooldown=0;this.clock=0;this.entryCount=0;this.exitCount=0;this.warpCount=0;this.lastArrival=-1;this.charge=0;this.outwardTime=0;this.outwardDistance=0;this.lastRadius=null;this.content=false;
 }
 snapshot(){return {state:this.state,galaxyId:this.galaxyId,selectionKey:this.selection?.key||null,charge:this.charge,entryCount:this.entryCount,exitCount:this.exitCount,warpCount:this.warpCount,locked:this.locked};}
 get locked(){return [NAV.ENTERING,NAV.EXITING,NAV.TRANSIT,NAV.ARRIVAL].includes(this.state);}
 get canSelectGalaxy(){return this.state===NAV.UNIVERSE&&!this.galaxyId;}
 canSelectLocal(galaxyId){return !this.locked&&this.galaxyId===galaxyId&&[NAV.INSIDE,NAV.SELECTED,NAV.CONTENT].includes(this.state);}
 canTravelToGalaxy(id){return this.canSelectGalaxy||(!this.locked&&this.galaxyId===id&&!this.content);}
 emit(){this.onChange(this.snapshot());}
 setState(state){if(this.state!==state){this.state=state;this.emit();}}
 clearSelection(){const had=!!this.selection;this.selection=null;if(this.state===NAV.SELECTED)this.setState(this.content?NAV.CONTENT:(this.galaxyId?NAV.INSIDE:NAV.UNIVERSE));else if(had)this.emit();}
 choose(item,event={},position){
  if(!this.canSelectLocal(item.galaxyId))return 'blocked';
  if(position&&distance(position,item.world())>item.range){this.clearSelection();return 'out-of-range';}
  const now=this.now();
  if(!this.selection||this.selection.key!==item.key){this.selection={...item,armedAt:now+550};this.setState(NAV.SELECTED);this.emit();return 'selected';}
  // Native dblclick events, quick repeats and held Enter cannot confirm.
  if(event.detail>1||event.repeat||now<this.selection.armedAt){this.selection.armedAt=now+550;return 'wait';}
  this.selection=null;this.content=true;this.setState(NAV.CONTENT);return 'activate';
 }
 openContent(){if(this.locked)return false;this.clearSelection();this.content=true;this.setState(NAV.CONTENT);return true;}
 closeContent(){this.selection=null;this.content=false;this.setState(this.galaxyId?NAV.INSIDE:NAV.UNIVERSE);this.emit();}
 exit(){if(this.locked)return false;this.selection=null;this.content=false;this.galaxyId=null;this.charge=0;this.resetCharge();this.exitCount++;this.transition=1.25;this.cooldown=2.4;this.setState(NAV.EXITING);return true;}
 resetCharge(){this.outwardTime=0;this.outwardDistance=0;this.charge=0;if(this.state===NAV.CHARGING)this.setState(NAV.UNIVERSE);}
 interrupt(){this.resetCharge();this.lastRadius=null;}
 update(dt,{position,velocity={x:0,y:0,z:0},thrust=false,menu=false,flying=false}){
  dt=Math.max(0,Math.min(dt,.1));this.clock+=dt;this.cooldown=Math.max(0,this.cooldown-dt);
  const radius=Math.hypot(position.x,position.y,position.z);
  const previousRadius=this.lastRadius??radius;this.lastRadius=radius;
  if(this.locked){
   this.transition-=dt;
   if(this.transition<=0){
    if(this.state===NAV.ENTERING)this.setState(NAV.INSIDE);
    else if(this.state===NAV.EXITING)this.setState(NAV.UNIVERSE);
    else if(this.state===NAV.TRANSIT){
     const choices=this.arrivals.map((p,i)=>i).filter(i=>this.arrivals.length===1||i!==this.lastArrival);
     this.lastArrival=choices[Math.min(choices.length-1,Math.floor(this.random()*choices.length))];
     this.onReturn({...this.arrivals[this.lastArrival]});this.selection=null;this.galaxyId=null;this.content=false;this.resetCharge();this.transition=1.2;this.cooldown=3;this.lastRadius=null;this.setState(NAV.ARRIVAL);
    }else if(this.state===NAV.ARRIVAL)this.setState(NAV.UNIVERSE);
   }
   return;
  }
  if(this.galaxyId){
   const g=this.boundaries.find(g=>g.id===this.galaxyId);
   if(!g||distance(position,g.center)>g.exitRadius){this.exit();return;}
   if(this.selection&&distance(position,this.selection.world())>this.selection.range)this.clearSelection();
   this.resetCharge();return;
  }
  if(this.cooldown===0&&!this.content){
   const entered=this.boundaries.filter(g=>distance(position,g.center)<g.entryRadius).sort((a,b)=>distance(position,a.center)-distance(position,b.center))[0];
   if(entered){this.resetCharge();this.selection=null;this.galaxyId=entered.id;this.entryCount++;this.transition=1.45;this.cooldown=1.8;this.setState(NAV.ENTERING);return;}
  }
  const speed=Math.hypot(velocity.x,velocity.y,velocity.z);
  const dot=(position.x*velocity.x+position.y*velocity.y+position.z*velocity.z)/Math.max(1,radius*speed);
  if(!thrust||menu||flying||dot<.5||speed<1000||radius<=previousRadius-.5){this.resetCharge();return;}
  this.outwardTime+=dt;this.outwardDistance+=Math.max(0,radius-previousRadius);
  if(radius>90000&&this.outwardTime>=3&&this.outwardDistance>=14000){
   this.charge+=dt;if(this.state!==NAV.CHARGING)this.setState(NAV.CHARGING);
   if(this.charge>=3){this.selection=null;this.galaxyId=null;this.content=false;this.warpCount++;this.transition=2.4;this.setState(NAV.TRANSIT);}
  }
 }
}
