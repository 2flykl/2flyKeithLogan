export const GAPS=new Map([[5,[-.8,2.5]],[20,[-11,-8.5]]]);
export function floorSegments(y){const gap=GAPS.get(y);return gap?[[-13.5,gap[0]],[gap[1],13.5]]:[[-13.5,13.5]];}
export function hasFloor(x,y,radius=0){return floorSegments(y).some(([a,b])=>x-radius>=a&&x+radius<=b);}
export function gaugePosition(net){return Math.max(0,Math.min(1,.5-net/16));}
export function gaugeStops(s){const at=gaugePosition(s.target);return s.type==='even'?[[0,'#e65b67'],[.42,'#edc06b'],[.5,'#65dfa0'],[.58,'#edc06b'],[1,'#e65b67']]:s.type==='exact'?[[0,'#e65b67'],[Math.max(.001,at-.09),'#edc06b'],[at,'#65dfa0'],[Math.min(.999,at+.09),'#edc06b'],[1,'#e65b67']]:s.type==='left'?[[0,'#65dfa0'],[at,'#65dfa0'],[Math.min(1,at+.18),'#edc06b'],[1,'#e65b67']]:[[0,'#e65b67'],[Math.max(0,at-.18),'#edc06b'],[at,'#65dfa0'],[1,'#65dfa0']];}
