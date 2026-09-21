import {RecentPool} from './variation.js';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
export const DIRECTIONS=['front','front-left','left','rear-left','back','rear-right','right','front-right'];
export const CLIPS={idle:{frames:[0,1,2,3],fps:2,loop:true},ready:{frames:[4,5,6,7],fps:3,loop:true},walk:{frames:[8,10,12,13,14,13,12,10],fps:9,loop:true},raise:{frames:[16,17,18,19,20,21],fps:8},shoot:{frames:[22,23,24,25],fps:5,loop:true},crouch_in:{frames:[26,27,28,29,30,31],fps:8},crouch:{frames:[32,33,34,35],fps:3,loop:true},crouch_out:{frames:[31,30,29,28,27,26],fps:8},kneel_in:{frames:[36,37,38,39,40,41],fps:7},kneel:{frames:[42,43,44,45],fps:3,loop:true},kneel_out:{frames:[41,40,39,38,37,36],fps:7},lower:{frames:[21,20,19,18,17,16],fps:8},reset:{frames:[4,5,6,7],fps:3}};

// The controller owns position and animation time; rendering never advances a clip.
export class Photographer {
 constructor(){this.poses=new RecentPool();this.reset()}
 reset(){Object.assign(this,{x:1.65,z:-5.6,facing:2.1,state:'idle',time:0,clock:0,frame:0,flash:0,targetX:1.65,targetZ:-5.6,lastAttempt:0,shotPhase:'',queue:[],settle:0,tracking:2});}
 play(state,next=[]){if(this.state===state)return;this.state=state;this.time=0;this.queue=[...next];}
 onEvent(type,g){if(type==='charge'){this.shotPhase='';this.play('raise',['shoot'])}if(type==='release'){this.lastAttempt=g.attempts;this.play(this.poses.pick(['shoot','crouch','kneel'])[0])}if(type==='caught'){this.play('shoot');this.shotPhase='catch';}if(type==='miss'){this.targetX=g.attempts%2?1.95:1.4;this.targetZ=g.attempts%2?-5.8:-5.4;this.recover();}if(type==='ready'){this.targetX=g.attempts%2?1.95:1.4;this.targetZ=g.attempts%2?-5.8:-5.4;this.recover();}}
 recover(){if(['kneel','kneel_in'].includes(this.state))this.play('kneel_out',['ready']);else if(['crouch','crouch_in'].includes(this.state))this.play('crouch_out',['lower','ready']);else this.play('lower',['ready']);}
 capture(phase){this.flash=.09;if(this.shotPhase===phase)return;this.shotPhase=phase;if(phase==='apex'&&this.state!=='kneel'&&this.state!=='kneel_in'){if(this.state.startsWith('crouch'))this.play('crouch_out',['kneel_in','kneel']);else this.play('kneel_in',['kneel']);}else if(phase==='catch'&&!['shoot','raise'].includes(this.state))this.play('raise',['shoot']);}
 step(dt,g,{frozen=false,cutaway=false}={}){
  if(frozen)return;dt=clamp(dt,0,.05);this.clock+=dt;this.time+=dt;this.flash=Math.max(0,this.flash-dt);
  const u=g.flightTime/g.duration;
  // Always stay clear of the player and catch circle. Reposition only between throws.
  if(['ready','result'].includes(g.phase)&&!cutaway){if(Math.abs(this.targetX-g.landingX)<1.1)this.targetX=g.landingX<.6?2.25:-2.1;const dx=this.targetX-this.x,dz=this.targetZ-this.z,d=Math.hypot(dx,dz);if(d>.04){if(['idle','ready','walk'].includes(this.state)){this.play('walk');this.x+=dx/d*Math.min(d,dt*.55);this.z+=dz/d*Math.min(d,dt*.55);}}else if(this.state==='walk')this.play('ready');}
  const target=g.phase==='flight'&&u<.76?g.position:{x:g.playerX,y:1.5,z:g.playerZ};
  const desired=Math.atan2(target.x-this.x,target.z-this.z)+Math.PI;this.facing+=wrap(desired-this.facing)*Math.min(1,dt*3.2);
  this.tracking=clamp(Math.round(2+wrap(desired-this.facing)*2),0,4);
  if(g.phase==='charging'&&['idle','ready','walk','lower'].includes(this.state))this.play('raise',['shoot']);
  if(g.phase==='ready'&&['idle','ready'].includes(this.state)&&this.time>.8)this.play('raise',['shoot']);
  if(g.phase==='flight'&&['idle','ready','lower'].includes(this.state))this.play('raise',['shoot']);
  if(g.phase==='flight'&&u>.78&&['kneel','kneel_in','crouch','crouch_in'].includes(this.state))this.play('raise',['shoot']);
  if(g.phase==='flight'&&u>.78&&['ready','idle'].includes(this.state))this.play('raise',['shoot']);
  const clip=CLIPS[this.state]||CLIPS.idle;let index=Math.floor(this.time*clip.fps);
  if(index>=clip.frames.length){if(clip.loop)index%=clip.frames.length;else if(this.queue.length){const next=this.queue.shift(),rest=[...this.queue];this.play(next,rest);index=0;}else index=clip.frames.length-1;}
  this.frame=(CLIPS[this.state]||clip).frames[index]??(CLIPS[this.state]||clip).frames[0];
 }
 snapshot(){return {state:this.state,frame:this.frame,x:this.x,z:this.z,facing:this.facing,tracking:this.tracking,flash:this.flash};}
}

