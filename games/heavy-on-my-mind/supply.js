export const LANE_ITEM_LIMIT=8,LOOSE_ITEM_LIMIT=24,TOTAL_ITEM_LIMIT=48,HAZARD_LIMIT=32,SHARD_LIMIT=24;
export function chooseSupply(catalog,loose,bag,needed=1,sequence=0){
 if(loose.length>=LANE_ITEM_LIMIT)return null;
 const weight=Math.max(1,Math.min(6,Math.round(Math.abs(needed)||1))),count=w=>[...loose,...bag].filter(d=>d.w===w).length;
 const required=count(weight)<(weight===2?2:1)?weight:count(1)<1?1:[2,3,5,1,4,6][sequence%6];
 const pool=catalog.filter(d=>d.w===required),names=new Set(loose.map(d=>d.name)),fresh=pool.filter(d=>!names.has(d.name));return (fresh.length?fresh:pool)[sequence%(fresh.length||pool.length)];
}
