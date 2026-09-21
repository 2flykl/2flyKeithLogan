import {makeZones,gradeAt} from './timing.js';
export const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const CHAPTERS=[{name:'Find the feeling',wind:.22},{name:'Trust the wind',wind:.72},{name:'Bring it home',wind:-.95}];
export class ReturnGame {
 constructor(){this.reset()}
 reset(){Object.assign(this,{phase:'ready',time:0,phaseTime:0,charge:0,flightTime:0,duration:5,returns:0,perfect:0,attempts:0,streak:0,best:0,playerX:-.8,playerZ:-4.4,landingX:-.8,landingZ:-4.4,chapter:0,power:.7,spin:1,catchAt:null,result:'',range:0,events:[],position:{x:0,y:0,z:0},paused:false,catchRadius:.48,catchGrade:null,throwGrade:null,throwZones:makeZones(),catchZones:makeZones()});this.prepareWind()}
 prepareWind(){this.chapter=Math.min(2,Math.floor(this.returns/2));this.wind=CHAPTERS[this.chapter].wind}
 emit(type,data={}){this.events.push({type,...data})}
 actionDown(){if(this.paused)return;if(this.phase==='ready'){this.phase='charging';this.phaseTime=0;this.charge=0;this.emit('charge')}else if(this.phase==='flight'){const u=this.flightTime/this.duration;if(u>=.78&&u<=1.02&&this.catchAt===null){this.catchAt=u;this.catchGrade=gradeAt(this.catchZones,clamp((u-.78)/.22,0,1));this.emit('catch-commit')}else if(u<.78){this.emit('early')}}}
 actionUp(){if(this.phase!=='charging'||this.paused)return;this.power=clamp(this.charge,.18,1);this.throwGrade=gradeAt(this.throwZones,this.charge);this.spin={bad:.3,regular:.65,good:.88,trick:1}[this.throwGrade];this.phase='launch';this.phaseTime=0;this.attempts++;this.emit('release',{quality:this.spin})}
 launch(){this.phase='flight';this.phaseTime=0;this.flightTime=0;this.duration=4.8+this.power*1.4;this.startX=this.playerX;this.startZ=this.playerZ;this.catchAt=null;this.catchGrade=null;this.range=12+this.power*16;let targetX=this.startX+this.wind*(.6+this.power*.75)+(this.power-.73)*1.15;
  // Keep the return zone meaningfully away from the launch point unless the computed physics already do so.
  const minReturnOffset=1.35;let delta=targetX-this.startX;
  if(Math.abs(delta)<minReturnOffset){let sign=Math.sign(delta)||Math.sign(this.wind)||((this.startX>=0)?-1:1);let candidate=this.startX+sign*minReturnOffset;if(candidate>2.25||candidate<-2.25)candidate=this.startX-sign*minReturnOffset;targetX=candidate;}
  this.landingX=clamp(targetX,-2.25,2.25);this.landingZ=clamp(this.startZ+(Math.random()<.5?-.7:.7),-5.2,-3.6);if(Math.abs(this.landingZ-this.startZ)<.35)this.landingZ=clamp(this.startZ+(this.startZ<-4.4?.7:-.7),-5.2,-3.6);this.emit('launch')}
 step(dt,move=0,depth=0){if(this.paused||this.phase==='complete')return;dt=clamp(dt,0,.05);this.time+=dt;this.phaseTime+=dt;
  if(['ready','flight','result'].includes(this.phase)){const norm=Math.max(1,Math.hypot(move,depth));this.playerX=clamp(this.playerX+move/norm*dt*1.35,-2.4,2.4);this.playerZ=clamp(this.playerZ+depth/norm*dt*1.15,-5.3,-3.5);}
  if(this.phase==='charging'){this.charge=.5-.5*Math.cos(Math.min(this.phaseTime,2.4)/2.4*Math.PI*2);if(this.phaseTime>=2.4)this.actionUp()}
  if(this.phase==='launch'&&this.phaseTime>.28)this.launch();
  if(this.phase==='flight'){this.flightTime+=dt;const u=clamp(this.flightTime/this.duration,0,1);this.position=this.flightPosition(u);if(this.flightTime>=this.duration){const aligned=Math.hypot(this.playerX-this.landingX,this.playerZ-this.landingZ)<this.catchRadius;const timed=this.catchAt!==null&&this.catchGrade!=='bad';const precision=timed&&this.catchGrade==='trick';this.result=!aligned?'Just out of reach':!timed?'Let it come to you':precision?'A perfect return':'Back in your hands';this.phase='result';this.phaseTime=0;if(aligned&&timed){this.returns++;this.streak++;this.best=Math.max(this.best,this.streak);if(precision)this.perfect++;this.emit('caught',{perfect:precision})}else{this.streak=0;this.emit('miss',{aligned,timed})}}}
  if(this.phase==='result'&&this.phaseTime>2.5){if(this.returns>=5){this.phase='complete';this.emit('complete')}else{this.phase='ready';this.phaseTime=0;this.prepareWind();this.throwZones=makeZones();this.catchZones=makeZones();this.emit('ready')}}
 }
 flightPosition(u){
  // A banked orbit with spin-dependent spread and accumulated crosswind.
  // The interaction is charge, drift positioning and timed contact; this is an art-directed flight model.
  const turn=Math.PI*2*u;const envelope=Math.sin(Math.PI*u);
  return {x:this.startX+(this.landingX-this.startX)*u+Math.sin(turn)*(3+this.power*3.2)+this.wind*envelope*envelope*.65,
   y:1.35+envelope*(2.7+this.power*2.1)+Math.sin(turn)*(.13*(1-this.spin)),
   z:this.startZ+(this.landingZ-this.startZ)*u-envelope*this.range};
 }
 snapshot(){return {phase:this.phase,charge:this.charge,progress:this.flightTime/this.duration,playerX:this.playerX,playerZ:this.playerZ,landingX:this.landingX,landingZ:this.landingZ,catchRadius:this.catchRadius,throwZones:this.throwZones,catchZones:this.catchZones,throwGrade:this.throwGrade,catchGrade:this.catchGrade,returns:this.returns,perfect:this.perfect,attempts:this.attempts,chapter:this.chapter,paused:this.paused,position:{...this.position}}}
}

