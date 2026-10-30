import {contextAction} from './context-action.js';
export {viewportLayout} from './viewport.js';
import {objectiveReading,objectiveLabel,meterRange,signed} from './objectives.js';
import {LEVELS} from './rules.js';
export function selectMeterScale(player,scales,current=null){
 if(!player.ground&&current&&scales.includes(current))return current;
 const floor=Math.max(0,Math.min(4,Math.floor((player.y+.05)/5)))*5;
 const local=scales.filter(s=>player.y>22.1?Math.abs(s.y-player.y)<1.6:s.y===floor);
 if(!local.length)return null;
 const nearby=local.filter(s=>Math.abs(player.x-s.x)<=3.6).sort((a,b)=>Math.abs(player.x-a.x)-Math.abs(player.x-b.x));
 return nearby[0]??local.sort((a,b)=>Math.abs(player.x-a.x)-Math.abs(player.x-b.x)||Number(a.optional)-Number(b.optional))[0];
}
export function meterModel(player,scales,bag,current=null,action=contextAction({player,scales,bag,things:[]})){
 const scale=action.scale??selectMeterScale(player,scales,current);
 if(!scale)return {scale:null,route:'THE FRONT DOOR',target:'The porch is ahead',totals:'Collect keepsakes, then head to the porch.',direction:'↑ Jump onto the porch · ↓ Talk near the door',preview:'',position:.5,range:[.48,.52],ready:true};
 const r=objectiveReading(scale),index=scales.indexOf(scale)+1;
 const route=`SCALE ${String(index).padStart(2,'0')} · ${scale.optional?(scale.x<0?'FLOWERS DETOUR':'GIFT DETOUR'):(scale.y>25?'SERVICE LIFT':LEVELS[Math.floor(scale.y/5)]).toUpperCase()}`;
 let preview='',previewPosition=null;
 if(action.type==='load'&&action.scale===scale){
  const side=action.side;
  if(side){const next=r.net+(side===-1?bag[0].w:-bag[0].w);preview=`NEXT ${side===-1?'LEFT':'RIGHT'} LOAD → NET ${signed(next)}w`;previewPosition=Math.max(0,Math.min(1,.5-next/16));}
 }
 return {scale,route,target:scale.solved?'LIFT SAVED':objectiveLabel(scale),totals:`LEFT ${r.left}w  −  RIGHT ${r.right}w  =  NET ${signed(r.net)}w`,direction:scale.solved?'Saved permanently · ↑ at the right tray':r.ready?'TARGET MET · ↓ at center to save lift':r.direction,preview,previewPosition,position:Math.max(0,Math.min(1,.5-r.net/16)),range:meterRange(scale),ready:scale.solved||r.ready};
}
