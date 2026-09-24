// Arc-length route: geometry, road markings and the vehicle use one continuous path.
export const ROUTE_LENGTH = 3072;
const ease = x => { x=Math.max(0,Math.min(1,x)); return x*x*(3-2*x); };
const phase = s => ((s % ROUTE_LENGTH)+ROUTE_LENGTH)%ROUTE_LENGTH;
export function routeInfo(s) {
  const p=phase(s), cycle=Math.floor(s/ROUTE_LENGTH);
  const biome=p<384?'town':p<576?'residential':p<672?'woodland':p<960?'bridge':p<1632?'lakeshore':p<1824?'junction':p<2592?'freeway':'residential';
  return {biome,phase:p,cycle,intersection:Math.abs(p-250)<35||Math.abs(p-1690)<38};
}
export function heading(s) {
  const p=phase(s);
  const turn=Math.PI/2*(ease((p-240)/26)-ease((p-1680)/30));
  const near=Math.max(1-ease(Math.abs(p-250)/85),1-ease(Math.abs(p-1690)/90));
  return turn+(.32*Math.sin(s/135)+.12*Math.sin(s/59))*(1-near);
}
export function elevation(s) {
  const p=phase(s);
  return 5.5*ease((p-576)/96)*(1-ease((p-960)/120));
}
const samples=new Map([[0,{x:0,z:0}]]);let last=0;
export function point(s,lateral=0) {
  s=Math.max(0,s);const i=Math.floor(s/2);
  while(last<=i){const v=samples.get(last),h=heading(last*2+1);samples.set(last+1,{x:v.x+2*Math.sin(h),z:v.z-2*Math.cos(h)});last++;}
  const a=samples.get(i),b=samples.get(i+1),t=s/2-i,h=heading(s);
  if(!a)throw new Error('Route sample was retired too early');
  return {x:a.x+(b.x-a.x)*t+Math.cos(h)*lateral,z:a.z+(b.z-a.z)*t+Math.sin(h)*lateral,y:elevation(s),heading:h};
}
export function retireSamples(distance) {const min=Math.floor((distance-400)/2);for(const k of samples.keys()){if(k<min)samples.delete(k);else break;}}
export function nextStop(distance) {const cycle=Math.floor(distance/ROUTE_LENGTH);return [cycle*ROUTE_LENGTH+228,cycle*ROUTE_LENGTH+1668,(cycle+1)*ROUTE_LENGTH+228].find(s=>s>distance-.02);}
export const routeSampleCount=()=>samples.size;
export function roadWidth(s){const p=phase(s);return 4.9+4.5*ease((p-1776)/96)*(1-ease((p-2544)/96));}
