export const BALCONY_Y=27,ROOF_Y=42.8,SERVICE_Y=32.4;
// Traversal: left edge hops, a walk to the service lift, then a long rightward crossing.
export const ROOF_LEDGES=[
 {x:-9,y:28.8,w:4,name:'West fire escape'},
 {x:-10,y:30.6,w:3.4,name:'Corner landing'},
 {x:-6.5,y:SERVICE_Y,w:8,name:'Service balcony'},
 {x:0,y:37.4,w:14,name:'Skywalk'},
 {x:10,y:39.2,w:4,name:'East return'},
 {x:7,y:41,w:5,name:'Roof landing'}
];
export const BOX_HIT_AT=.58,SLAM_AT=1.55,SETBACK_END=3.25;
export const SPILL_X=[-1,1.2,2.8,4.2,5.8];
export function gateFor(y){return y>=37.3?5:y>=26.9?4:y>=20?3:y>=15?2:y>=10?1:y>=5?0:-1;}
export function canReachDeck(y,scales){const i=gateFor(y);return i<0||scales.slice(0,i+1).length===i+1&&scales.slice(0,i+1).every(s=>s.solved);}
export function patrolX(t,i){return i===0?2+Math.sin(t*.85)*2.5:10+Math.sin(t*.95+1.5)*1.1;}
const clamp=t=>Math.max(0,Math.min(1,t));
export function collisionShot(t,start){
 const u=clamp(t/BOX_HIT_AT),impact={x:1.65,y:Math.max(BALCONY_Y+1.2,start.y+.25)};
 const fall=clamp((t-BOX_HIT_AT)/1.8),e=fall*fall*(3-2*fall);
 const player=t<BOX_HIT_AT?{x:start.x+(impact.x-start.x)*u,y:start.y+(impact.y-start.y)*u+Math.sin(u*Math.PI)*.18}:{x:impact.x+(0-impact.x)*e,y:impact.y+(20-impact.y)*e+Math.sin(fall*Math.PI)*.35};
 const box=t<BOX_HIT_AT?{x:4.65+(impact.x+.45-4.65)*u,y:BALCONY_Y+.75+(impact.y+1-(BALCONY_Y+.75))*u}:{x:impact.x+.45+(-1.6-impact.x-.45)*e,y:impact.y+1+(20.45-impact.y-1)*e};
 return {player,box,impact,fall,hit:t>=BOX_HIT_AT};
}
