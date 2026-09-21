export const ZONE_COLORS={bad:'#d66d64',regular:'#819da4',good:'#69bead',trick:'#efc45d'};
export function makeZones(random=Math.random){
 const pieces=[['bad',.1],['good',.2],['trick',.05],['regular',.3],['trick',.05],['regular',.3]];
 for(let i=pieces.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pieces[i],pieces[j]]=[pieces[j],pieces[i]];}
 const tricks=pieces.map((p,i)=>p[0]==='trick'?i:-1).filter(i=>i>=0);
 if(tricks[1]-tricks[0]===1){const j=(tricks[1]+2)%pieces.length;[pieces[tricks[1]],pieces[j]]=[pieces[j],pieces[tricks[1]]];}
 let start=0;return pieces.map(([grade,width])=>{const zone={grade,start,end:start+width};start+=width;return zone;});
}
export function gradeAt(zones,value){return zones.find(z=>value>=z.start&&value<z.end)?.grade??zones.at(-1).grade;}
