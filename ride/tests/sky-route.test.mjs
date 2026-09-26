import assert from 'node:assert/strict';
import {sampleSkyRoute,skyRouteFrame,SKY_SECTION} from '../sky-route.js';

let previous=skyRouteFrame(0),loopRuns=0,spiralRuns=0,dropRuns=0,inverted=0,minMetric=Infinity;
for(let s=.5;s<SKY_SECTION*7*2;s+=.5){
  const f=skyRouteFrame(s),metric=f.p.distanceTo(previous.p)/.5;
  for(const v of [f.p,f.t,f.right,f.up])assert([v.x,v.y,v.z].every(Number.isFinite),'finite camera and road coordinates');
  assert(Math.abs(f.t.dot(f.up))<1e-7,'camera up stays perpendicular to travel');
  assert(Math.abs(f.right.length()-1)<1e-7,'road frame stays normalized');
  assert(f.up.dot(previous.up)>.8,'no abrupt camera-frame flip');
  assert(metric>.08&&metric<6,'route remains continuous and traversable');
  minMetric=Math.min(minMetric,metric);
  if(f.loop&&!previous.loop)loopRuns++;
  if(f.spiral&&!previous.spiral)spiralRuns++;
  if(f.airborne&&!previous.airborne)dropRuns++;
  if(f.loop&&f.up.y<-.9)inverted++;
  previous=f;
}
assert.equal(loopRuns,6,'three real loops per journey');
assert.equal(spiralRuns,4,'two spiral descents per journey');
assert.equal(dropRuns,6,'three cloud freefalls per journey');
assert(inverted>100,'loops actually invert the road and passenger camera');
for(let i=1;i<=14;i++)assert(sampleSkyRoute(i*SKY_SECTION-.001).p.distanceTo(sampleSkyRoute(i*SKY_SECTION+.001).p)<.01,'chapter joins do not jump');
console.log(JSON.stringify({loopRuns,spiralRuns,dropRuns,invertedSamples:inverted,minMetric,continuousChapters:14}));
