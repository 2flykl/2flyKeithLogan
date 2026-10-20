import {makeZones,gradeAt,learningZones} from './timing.js';
export const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const CHAPTERS=[
 {name:'Find the feeling',wind:.22,lesson:'A steady release. A familiar return.'},
 {name:'Trust the wind',wind:.72,lesson:'Read the wind. Give the return some room.'},
 {name:'Bring it home',wind:-.95,lesson:'A new direction. Everything you have learned.'}
];
export const THROW_STYLES={
 bad:{spin:.3,drift:1.2,radius:.46,range:0,label:'Loose release',hint:'More drift. Follow the ring.'},
 regular:{spin:.65,drift:1,radius:.50,range:0,label:'Steady throw',hint:'A balanced flight and return.'},
 good:{spin:.88,drift:.65,radius:.62,range:0,label:'Clean release',hint:'Less drift. A wider catch.'},
 trick:{spin:1,drift:1.05,radius:.46,range:3,label:'Trick flight',hint:'A wider arc. A precision return.'}
};
export class ReturnGame {
 constructor({assist=true,tutorial=true,random=Math.random}={}){this.assist=assist;this.tutorial=tutorial;this.random=random;this.reset()}
 reset({tutorial=this.tutorial,assist=this.assist}={}){
  this.assist=assist;this.tutorial=tutorial;
  Object.assign(this,{phase:'ready',time:0,phaseTime:0,charge:0,flightTime:0,duration:5,returns:0,perfect:0,attempts:0,streak:0,best:0,playerX:-.8,playerZ:-4.4,landingX:-.8,landingZ:-4.4,chapter:0,power:.7,spin:1,catchAt:null,result:'',feedback:'',range:0,events:[],history:[],position:{x:0,y:0,z:0},paused:false,catchRadius:.62,catchGrade:null,throwGrade:null,tutorialWaiting:false,tutorialReleased:false,catchWindowAnnounced:false});
  this.prepareWind();
 }
 prepareWind(){
  this.chapter=Math.min(2,Math.floor(this.returns/2));this.wind=CHAPTERS[this.chapter].wind;
  this.guided=this.tutorial&&this.returns===0;
  this.catchStart=this.guided?.7:this.assist?.72:.78;
  this.chargeDuration=this.guided?3:this.assist?2.8:2.4;
  this.throwZones=this.returns<2?learningZones(this.guided):makeZones(this.random,this.assist);
  this.catchZones=this.returns<2?learningZones(this.guided):makeZones(this.random,this.assist);
  this.tutorialWaiting=false;this.tutorialReleased=false;this.catchWindowAnnounced=false;
 }
 setAssist(value){if(!['ready','result'].includes(this.phase))return false;this.assist=!!value;this.prepareWind();return true}
 emit(type,data={}){this.events.push({type,...data})}
 get aligned(){return Math.hypot(this.playerX-this.landingX,this.playerZ-this.landingZ)<this.catchRadius}
 actionDown(){
  if(this.paused)return;
  if(this.phase==='ready'){this.phase='charging';this.phaseTime=0;this.charge=0;this.feedback='';this.emit('charge')}
  else if(this.phase==='flight'){
   const u=this.flightTime/this.duration;
   if(u>=this.catchStart&&u<=1.02&&this.catchAt===null){
    this.catchAt=u;this.catchGrade=gradeAt(this.catchZones,clamp((u-this.catchStart)/(1-this.catchStart),0,1));
    this.emit('catch-commit',{grade:this.catchGrade,aligned:this.aligned});
   }else if(u<this.catchStart){this.emit('early')}
  }
 }
 actionUp(){
  if(this.phase!=='charging'||this.paused)return;
  this.power=clamp(this.charge,.18,1);this.throwGrade=gradeAt(this.throwZones,this.charge);this.spin=THROW_STYLES[this.throwGrade].spin;
  this.phase='launch';this.phaseTime=0;this.attempts++;this.emit('release',{quality:this.spin});
 }
 predictReturn(power=this.power,grade=this.throwGrade||'regular'){
  const style=THROW_STYLES[grade];let delta=this.wind*(.6+power*.75)*style.drift+(power-.73)*.8;
  const minimum=this.guided?.9:1.1;
  if(Math.abs(delta)<minimum)delta=(Math.sign(delta)||Math.sign(this.wind)||1)*minimum;
  let x=this.playerX+delta;
  if(x>2.25||x< -2.25)x=this.playerX-delta;
  const depth=this.guided?0:this.returns===1?.35:this.returns<4?.55:.7;
  // A readable alternating depth challenge, with no random target jump after release.
  const direction=(this.attempts+this.returns)%2===0?-1:1;
  let z=this.playerZ+direction*depth;if(z> -3.6||z< -5.2)z=this.playerZ-direction*depth;
  return {x:clamp(x,-2.25,2.25),z:clamp(z,-5.2,-3.6)};
 }
 launch(){
  this.phase='flight';this.phaseTime=0;this.flightTime=0;this.duration=4.8+this.power*1.4+(this.assist?.55:0)+(this.guided?.4:0);
  this.startX=this.playerX;this.startZ=this.playerZ;this.catchAt=null;this.catchGrade=null;
  const style=THROW_STYLES[this.throwGrade||'regular'];this.range=12+this.power*16+style.range;
  this.catchRadius=this.guided?.76:style.radius+(this.assist?.12:0);
  const target=this.predictReturn();this.landingX=target.x;this.landingZ=target.z;this.emit('launch');
 }
 nextReturn(){if(this.phase!=='result')return;if(this.returns>=5){this.phase='complete';this.emit('complete');return}this.phase='ready';this.phaseTime=0;this.feedback='';this.prepareWind();this.emit('ready')}
 step(dt,move=0,depth=0){
  if(this.paused||this.phase==='complete')return;dt=clamp(dt,0,.05);this.time+=dt;this.phaseTime+=dt;
  if(['ready','flight','result'].includes(this.phase)){const norm=Math.max(1,Math.hypot(move,depth));this.playerX=clamp(this.playerX+move/norm*dt*1.35,-2.4,2.4);this.playerZ=clamp(this.playerZ+depth/norm*dt*1.15,-5.3,-3.5)}
  if(this.phase==='charging'){this.charge=.5-.5*Math.cos(Math.min(this.phaseTime,this.chargeDuration)/this.chargeDuration*Math.PI*2);if(this.phaseTime>=this.chargeDuration)this.actionUp()}
  if(this.phase==='launch'&&this.phaseTime>.28)this.launch();
  if(this.phase==='flight'){
   const next=this.flightTime+dt;
   if(this.guided&&!this.tutorialReleased&&next/this.duration>=this.catchStart-.025){
    if(!this.aligned){if(!this.tutorialWaiting)this.emit('guide-position');this.tutorialWaiting=true;this.flightTime=this.duration*(this.catchStart-.025)}
    else{this.tutorialReleased=true;this.tutorialWaiting=false;this.emit('guide-catch');this.flightTime=next}
   }else this.flightTime=next;
   const u=clamp(this.flightTime/this.duration,0,1);this.position=this.flightPosition(u);
   if(u>=this.catchStart&&!this.catchWindowAnnounced){this.catchWindowAnnounced=true;this.emit('catch-window')}
   if(this.flightTime>=this.duration){
    const aligned=this.aligned,timed=this.catchAt!==null&&this.catchGrade!=='bad',precision=timed&&this.catchGrade==='trick';
    this.result=!aligned?'Just out of reach':!timed?'Let it come to you':precision?'A perfect return':'Back in your hands';
    this.feedback=!aligned?(timed?'Timing landed. Move inside the ring and stay there.':'Move into the ring, then time a safe catch.'):
     !timed?(this.catchAt===null?'Position was right. Tap when the catch needle moves.':'Position right. Red means a miss; try green or gold.'):
     precision?'Position + timing. A perfect return.':'Position + timing. You brought it home.';
    this.phase='result';this.phaseTime=0;
    if(aligned&&timed){this.returns++;this.streak++;this.best=Math.max(this.best,this.streak);if(precision)this.perfect++;
     const moment={number:this.returns,attempt:this.attempts,chapter:this.chapter,throwGrade:this.throwGrade,catchGrade:this.catchGrade,perfect:precision};this.history.push(moment);this.emit('caught',{perfect:precision,moment});
    }else{this.streak=0;this.emit('miss',{aligned,timed,reason:!aligned?'position':this.catchAt===null?'no-input':'red-zone'})}
   }
  }
  if(this.phase==='result'&&this.phaseTime>2.5)this.nextReturn();
 }
 flightPosition(u){
  const turn=Math.PI*2*u,envelope=Math.sin(Math.PI*u),style=THROW_STYLES[this.throwGrade||'regular'];
  return {x:this.startX+(this.landingX-this.startX)*u+Math.sin(turn)*(3+this.power*3.2+(this.throwGrade==='trick'?.8:0))+this.wind*style.drift*envelope*envelope*.65,
   y:1.35+envelope*(2.7+this.power*2.1)+Math.sin(turn)*(.13*(1-this.spin)),
   z:this.startZ+(this.landingZ-this.startZ)*u-envelope*this.range};
 }
 snapshot(){return {phase:this.phase,charge:this.charge,progress:this.flightTime/this.duration,playerX:this.playerX,playerZ:this.playerZ,landingX:this.landingX,landingZ:this.landingZ,catchRadius:this.catchRadius,throwZones:this.throwZones,catchZones:this.catchZones,throwGrade:this.throwGrade,catchGrade:this.catchGrade,returns:this.returns,perfect:this.perfect,attempts:this.attempts,chapter:this.chapter,paused:this.paused,position:{...this.position},guided:this.guided,tutorialWaiting:this.tutorialWaiting,assist:this.assist,catchStart:this.catchStart,feedback:this.feedback,history:[...this.history]}}
}
