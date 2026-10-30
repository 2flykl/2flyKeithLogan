export const TRAY_CAPACITY=6;
export const SCALE_LAYOUT=[
 {x:6,y:0,type:'left',target:5,dest:5},
 {x:-5,y:5,type:'even',target:0,minTotal:4,dest:10},
 {x:5,y:10,type:'right',target:-5,dest:15},
 {x:-5,y:15,type:'exact',target:3,dest:20},
 {x:-5,y:20,type:'left',target:5,dest:27},
 {x:-5,y:32.4,type:'left',target:2,dest:37.4}
];
export const signed=n=>n>0?'+'+n:String(n);
export const trayTotal=(s,side)=>s.items.filter(d=>(d.tray??-1)===side).reduce((n,d)=>n+d.w,0);
export function objectiveReading(s){
 const left=trayTotal(s,-1),right=trayTotal(s,1),net=left-right,total=left+right,target=s.target??0;
 const ready=s.type==='even'?net===0&&total>=(s.minTotal??4):s.type==='left'?net>=target:s.type==='right'?net<=target:net===target;
 const delta=target-net;
 let direction=ready?'TARGET MET · ↓ / SPACE AT CENTER TO LOCK':delta>0?'← ADD '+delta+'w LEFT / REMOVE RIGHT':delta<0?'ADD '+(-delta)+'w RIGHT / REMOVE LEFT →':'ADD '+Math.ceil(((s.minTotal??4)-total)/2)+'w TO EACH TRAY';
 return {left,right,net,total,target,delta,ready,direction};
}
export function objectiveLabel(s){return s.type==='even'?'EVEN: NET 0 · ≥'+(s.minTotal??4)+'w TOTAL':s.type==='exact'?(s.target>0?'LEFT ':'RIGHT ')+signed(s.target)+'w EXACTLY':s.type==='left'?'← NEEDS +'+s.target+'w OR MORE':'NEEDS '+s.target+'w OR LESS →';}
export function meterRange(s){const x=net=>Math.max(0,Math.min(1,.5-net/16));return s.type==='left'?[0,x(s.target)]:s.type==='right'?[x(s.target),1]:[x(s.target)-.025,x(s.target)+.025];}
export function checkObjective(s){const r=objectiveReading(s);if(s.solved)return {kind:'saved',reading:r,spilled:[]};if(r.ready){s.solved=true;s.lock=1;s.phase='ready';return {kind:'success',reading:r,spilled:[]};}if(s.type==='exact'&&s.items.length){const spilled=s.items.splice(0);return {kind:'spill',reading:r,spilled};}return {kind:'adjust',reading:r,spilled:[]};}
export function requiredWeight(s){const r=objectiveReading(s);return s.type==='even'&&r.net===0?2:Math.max(1,Math.min(6,Math.abs(r.delta)||1));}
