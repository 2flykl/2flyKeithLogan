import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {CLIPS,DIRECTIONS,photographerFrame} from '../../../src/photographer.js';
const root=new URL('../',import.meta.url);
const manifest=JSON.parse(fs.readFileSync(new URL('manifest.json',root)));
const validation=JSON.parse(fs.readFileSync(new URL('atlas-validation.json',import.meta.url)));

test('all eight directions use distinct reviewed assets, without mirroring',()=>{
 assert.deepEqual(manifest.animationCoverage,DIRECTIONS);
 assert.deepEqual(manifest.pendingDirections,[]);
 const hashes=[];
 for(const direction of DIRECTIONS){
  const asset=fs.readFileSync(new URL(manifest.directions[direction],root));
  const hash=createHash('sha256').update(asset).digest('hex');
  assert.equal(hash,manifest.atlases[direction].sha256);
  hashes.push(hash);
 }
 assert.equal(new Set(hashes).size,8);
});

test('every clip only samples reviewed nonempty cells at the requested angle',()=>{
 for(const direction of DIRECTIONS){
  const atlas=manifest.atlases[direction];
  const reviewed=validation.directions[direction].frames.map(f=>f.index);
  for(const state of Object.keys(CLIPS)){
   assert.ok(atlas.clips[state]?.length,`${direction} ${state}`);
   for(let t=0;t<5;t+=.013){
    const f=photographerFrame(manifest,direction,state,t);
    assert.equal(f.file,manifest.directions[direction]);
    assert.ok(reviewed.includes(f.frame),`${direction} ${state} ${f.frame}`);
    assert.ok(f.frame>=0&&f.frame<f.columns*f.rows);
   }
  }
 }
});

test('compact clips preserve controller duration and hold transition endpoints',()=>{
 const duration=CLIPS.raise.frames.length/CLIPS.raise.fps;
 for(const direction of DIRECTIONS){
  const f=t=>photographerFrame(manifest,direction,'raise',t).frame;
  assert.equal(f(0),1);assert.equal(f(duration/2),2);assert.equal(f(duration),3);assert.equal(f(20),3);
 }
});

test('missing directions never select a different-angle action sprite',()=>{
 const missing={...manifest,directions:{'front-right':manifest.directions['front-right']}};
 for(const state of Object.keys(CLIPS))assert.equal(photographerFrame(missing,'back',state,.3),null);
});

test('invalid atlas metadata falls back instead of sampling empty or invalid cells',()=>{
 for(const patch of [{columns:0},{tile:[0,224]},{groundPivot:[80,999]},{clips:{idle:[55]}},{clips:{idle:[7]},validFrames:[0]}]){
  const damaged={...manifest,atlases:{...manifest.atlases,'front-right':{...manifest.atlases['front-right'],...patch}}};
  assert.equal(photographerFrame(damaged,'front-right','idle',0),null);
 }
});

test('all active poses stay grounded within transparent cell gutters',()=>{
 for(const direction of DIRECTIONS){
  for(const frame of validation.directions[direction].frames){
   const [left,top,right,bottom]=frame.packedBounds;
   assert.ok(left>=4&&right<=156&&top>=8);
   assert.equal(bottom,212);
  }
 }
});
