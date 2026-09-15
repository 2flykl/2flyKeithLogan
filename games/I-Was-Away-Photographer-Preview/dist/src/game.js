export const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export const CHAPTERS=[{name:'Find the feeling',wind:.22},{name:'Trust the wind',wind:.72},{name:'Bring it home',wind:-.95}];
export class ReturnGame {
 constructor(){this.reset()}
 reset(){Object.assign(this,{phase:'ready',time:0,phaseTime:0,charge:0,flightTime:0,duration:5,returns:0,perfect:0,attempts:0,streak:0,best:0,playerX:-.8,playerZ:-4.4,landingX:-.8,landingZ:-4.4,chapter:0,power:.7,spin:1,catchAt:null,result:'',range:0,events:[],position:{x:0,y:0,z:0},paused:false,catchRadius:.96});this.prepareWind()}
 prepareWind(){this.chapter=Math.min(2,Math.floor(this.returns/2));this.wind=CHAPTERS[this.chapter].wind}
 emit(type,data={}){this.events.push({type,...data})}
 actionDown(){if(this.paused)return;if(this.phase==='ready'){this.phase='charging';this.phaseTime=0;this.charge=0;this.emit('charge')}else if(this.phase==='flight'){const u=this.flightTime/this.duration;if(u>=.88&&u<=1.02&&this.catchAt===null){this.catchAt=u;this.emit('catch-commit')}else if(u<.88){this.emit('early')}}}
 actionUp(){if(this.phase!=='charging'||this.paused)return;this.power=clamp(this.charge,.18,1);this.spin=clamp(1-Math.abs(this.power-.73)*1.5,.25,1);this.phase='launch';this.phaseTime=0;this.attempts++;this.emit('release',{quality:this.spin})}
 launch(){this.phase='flight';this.phaseTime=0;this.flightTime=0;this.duration=4.8+this.power*1.4;this.startX=this.playerX;this.startZ=this.playerZ;this.catchAt=null;this.range=12+this.power*16;let targetX=this.startX+this.wind*(.6+this.power*.75)+(this.power-.73)*1.15;
  // Keep the return zone meaningfully away from the launch point unless the computed physics already do so.
  const minReturnOffset=.85;let delta=targetX-this.startX;
  if(Math.abs(delta)<minReturnOffset){let sign=Math.sign(delta)||Math.sign(this.wind)||((this.startX>=0)?-1:1);let candidate=this.startX+sign*minReturnOffset;if(candidate>2.25||candidate<-2.25)candidate=this.startX-sign*minReturnOffset;targetX=candidate;}
  this.landingX=clamp(targetX,-2.25,2.25);this.landingZ=this.startZ;this.emit('launch')}
 step(dt,move=0){if(this.paused||this.phase==='complete')return;dt=clamp(dt,0,.05);this.time+=dt;this.phaseTime+=dt;
  if(['ready','flight','result'].includes(this.phase))this.playerX=clamp(this.playerX+move*dt*1.35,-2.4,2.4);
  if(this.phase==='charging'){this.charge=.5-.5*Math.cos(Math.min(this.phaseTime,2.4)/2.4*Math.PI*2);if(this.phaseTime>=2.4)this.actionUp()}
  if(this.phase==='launch'&&this.phaseTime>.28)this.launch();
  if(this.phase==='flight'){this.flightTime+=dt;const u=clamp(this.flightTime/this.duration,0,1);this.position=this.flightPosition(u);if(this.flightTime>=this.duration){const aligned=Math.abs(this.playerX-this.landingX)<this.catchRadius;const timed=this.catchAt!==null;const precision=timed&&this.catchAt>=.958;this.result=!aligned?'Just out of reach':!timed?'Let it come to you':precision?'A perfect return':'Back in your hands';this.phase='result';this.phaseTime=0;if(aligned&&timed){this.returns++;this.streak++;this.best=Math.max(this.best,this.streak);if(precision)this.perfect++;this.emit('caught',{perfect:precision})}else{this.streak=0;this.emit('miss',{aligned,timed})}}}
  if(this.phase==='result'&&this.phaseTime>2.5){if(this.returns>=5){this.phase='complete';this.emit('complete')}else{this.phase='ready';this.phaseTime=0;this.prepareWind();this.emit('ready')}}
 }
 flightPosition(u){
  // A banked orbit with spin-dependent spread and accumulated crosswind.
  // The interaction is charge, drift positioning and timed contact; this is an art-directed flight model.
  const turn=Math.PI*2*u;const envelope=Math.sin(Math.PI*u);
  return {x:this.startX+(this.landingX-this.startX)*u+Math.sin(turn)*(3+this.power*3.2)+this.wind*envelope*envelope*.65,
   y:1.35+envelope*(2.7+this.power*2.1)+Math.sin(turn)*(.13*(1-this.spin)),
   z:this.startZ-envelope*this.range};
 }
 snapshot(){return {phase:this.phase,charge:this.charge,progress:this.flightTime/this.duration,playerX:this.playerX,landingX:this.landingX,returns:this.returns,perfect:this.perfect,attempts:this.attempts,chapter:this.chapter,paused:this.paused,position:{...this.position}}}
}
