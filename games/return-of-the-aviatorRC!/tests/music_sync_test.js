const assert=require('assert');
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function cues(d){
 const openingEnd=clamp(d*.075,5.5,9.5);
 return {
  openingEnd,
  diveEnd:Math.max(openingEnd+18,d*.33),
  runwayEnd:Math.max(openingEnd+38,d*.56),
  carEnd:Math.max(openingEnd+62,d*.79),
  bossPeak:Math.max(openingEnd+82,d*.94),
  end:Math.max(openingEnd+92,d*.985)
 };
}
for(const d of [90,120,150,210,300]){
 const c=cues(d);
 assert(c.openingEnd<c.diveEnd);
 assert(c.diveEnd<c.runwayEnd);
 assert(c.runwayEnd<c.carEnd);
 assert(c.carEnd<c.end);
 assert(c.end<=Math.max(d*.985,c.openingEnd+92)+.001);
}
console.log('Music cue tests passed');
