import {objectiveReading} from './objectives.js';
export function stepScale(s,dt){
 s.launch=Math.max(0,(s.launch||0)-dt);s.recover=Math.max(0,(s.recover||0)-dt);s.spillFlash=Math.max(0,(s.spillFlash||0)-dt);
 const r=objectiveReading(s);s.phase=s.launch>0?'launching':s.recover>0?'recovering':s.solved?'ready':s.spillFlash>0?'spilled':r.ready?'check':r.total?'loading':'empty';
 const target=s.launch>0?.4:Math.max(-.32,Math.min(.32,r.net/5*.32));
 let remaining=dt;while(remaining>0){const h=Math.min(remaining,1/120);s.velocity=(s.velocity||0)+(target-s.angle)*100*h-(s.velocity||0)*17*h;s.angle+=s.velocity*h;remaining-=h;}
 return s.phase;
}
export function scalePan(s,side){return {x:s.x+side*2*Math.cos(s.angle),y:s.y+.7+side*2*Math.sin(s.angle)};}
export const canLaunchScale=s=>s.solved&&(s.launch||0)<=0&&(s.recover||0)<=0;
export const scaleStatus=s=>s.solved?'LIFT SAVED · JUMP RIGHT PAN':objectiveReading(s).direction;
