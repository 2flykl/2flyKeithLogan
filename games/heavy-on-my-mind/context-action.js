import {ROOF_Y} from './rooftop-route.js';
import {viewportLayout} from './viewport.js';
import {canCarry} from './rules.js';
import {objectiveReading,signed,TRAY_CAPACITY} from './objectives.js';
export function contextAction({player,scales,things,bag}){
 if(!player.ground)return {type:'none',label:'Land to interact'};
 if(player.y>=ROOF_Y-.1&&Math.abs(player.x-5.8)<3)return {type:'talk',label:'Deliver the card'};
 const local=scales.filter(s=>Math.abs(player.y-s.y)<1.6).sort((a,b)=>Math.abs(player.x-a.x)-Math.abs(player.x-b.x));
 const center=local.find(s=>!s.solved&&Math.abs(player.x-s.x)<=.78);
 if(center){const r=objectiveReading(center);return {type:'lever',scale:center,label:r.ready?'LOCK SCALE · TARGET MET':center.type==='exact'?'CHECK '+signed(center.target)+' EXACT · NOW '+signed(r.net)+(r.total?' · WILL SPILL':''):'CHECK · '+r.direction};}
 const pan=local.flatMap(s=>[-1,1].map(side=>({s,side,x:s.x+side*2}))).find(p=>!p.s.solved&&Math.abs(player.x-p.x)<=.98);
 if(pan&&bag.length){if(pan.s.items.length>=TRAY_CAPACITY)return {type:'none',label:'Tray capacity reached · put item aside to return a load'};const r=objectiveReading(pan.s),net=r.net+(pan.side===-1?bag[0].w:-bag[0].w);return {type:'load',scale:pan.s,side:pan.side,label:`LOAD ${bag[0].w}w ${pan.side===-1?'LEFT':'RIGHT'} · net ${signed(net)}`};}
 const loose=things.filter(o=>o.kind==='item'&&Math.abs(o.x-player.x)<1.65&&Math.abs(o.y-player.y)<1.6);
 const item=loose.filter(o=>canCarry(bag,o.def)).sort((a,b)=>Math.abs(a.x-player.x)-Math.abs(b.x-player.x)||a.def.remaining-b.def.remaining)[0];
 if(item)return {type:'pickup',item,label:`PICK UP ${item.def.name} · ${item.def.w}w · ${Math.ceil(item.def.remaining)}s`};
 if(pan?.s.items.some(d=>d.tray===pan.side))return {type:'unload',scale:pan.s,side:pan.side,label:`RETURN ${pan.side===-1?'LEFT':'RIGHT'} ITEM · timer resumes`};
 const ready=local.find(s=>s.solved&&Math.abs(player.x-(s.x+2))<1.3);
 if(ready)return {type:'jump',scale:ready,label:'Jump · lift ready'};
 const nearby=local.find(s=>Math.abs(player.x-s.x)<3.5);
 if(bag.length&&loose.length)return {type:'none',label:'Hands full · move aside to place an item'};
 if(nearby?.solved)return {type:'none',label:'Lift ready · walk to the right pan →'};
 if(bag.length&&nearby)return {type:'none',label:'Carry to either tray · left adds +, right adds −'};
 if(bag.length)return {type:'place',label:`PLACE ${bag.at(-1).name} · timer keeps running`};
 if(nearby?.items.length)return {type:'none',label:'↓ / SPACE at center: LOCK scale before jumping'};
 return {type:'none',label:'Collect a numbered weight · trays stop its timer'};
}
export const gameViewport=viewportLayout;
