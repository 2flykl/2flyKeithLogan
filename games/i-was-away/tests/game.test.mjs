import test from 'node:test';import assert from 'node:assert/strict';import {ReturnGame} from '../src/game.js';
const tick=(g,seconds,move=0)=>{for(let t=0;t<seconds;t+=1/120)g.step(1/120,move)};
function throwBoom(g){g.actionDown();tick(g,.79);g.actionUp();tick(g,.3);assert.equal(g.phase,'flight');}
function catchBoom(g,perfect=true){g.playerX=g.landingX;g.playerZ=g.landingZ;const zone=g.catchZones.find(z=>z.grade===(perfect?'trick':'regular'));const target=.78+.22*(zone.start+zone.end)/2;while(g.flightTime/g.duration<target)g.step(1/240);g.actionDown();tick(g,g.duration-g.flightTime+.04);}
test('Charge releases once and owns a single projectile',()=>{const g=new ReturnGame();throwBoom(g);g.actionUp();assert.equal(g.attempts,1);assert.equal(g.phase,'flight');assert.ok(g.spin>=.3&&g.spin<=1)});
test('A perfect return needs timing and position',()=>{const g=new ReturnGame();throwBoom(g);catchBoom(g);assert.equal(g.returns,1);assert.equal(g.perfect,1);assert.equal(g.phase,'result')});
test('Early input does not grant a catch',()=>{const g=new ReturnGame();throwBoom(g);g.actionDown();tick(g,9);assert.equal(g.returns,0);assert.equal(g.phase,'ready')});
test('Timed input outside reach misses',()=>{const g=new ReturnGame();throwBoom(g);while(g.flightTime/g.duration<.97)g.step(.01);g.playerX=g.landingX>0?-2.4:2.4;g.actionDown();tick(g,.9);assert.equal(g.returns,0);assert.equal(g.result,'Just out of reach')});
test('A normal catch is distinct from a perfect one',()=>{const g=new ReturnGame();throwBoom(g);catchBoom(g,false);assert.equal(g.returns,1);assert.equal(g.perfect,0)});
test('Five catches reach a replayable ending through all chapters',()=>{const g=new ReturnGame();const winds=[];for(let i=0;i<5;i++){winds.push(g.wind);throwBoom(g);catchBoom(g);tick(g,3)}assert.equal(g.phase,'complete');assert.equal(g.returns,5);assert.equal(new Set(winds).size,3);g.reset();assert.equal(g.phase,'ready');assert.equal(g.returns,0);assert.equal(g.attempts,0)});
test('Pause freezes charge, flight and movement',()=>{const g=new ReturnGame();throwBoom(g);const before=g.snapshot();g.paused=true;tick(g,10,1);g.actionDown();assert.equal(g.flightTime/g.duration,before.progress);assert.equal(g.playerX,before.playerX)});
test('Holding past the whole charge cycle launches rather than sticking',()=>{const g=new ReturnGame();g.actionDown();tick(g,3);assert.equal(g.phase,'flight');assert.equal(g.attempts,1)});
test('Path is continuous and arrives at its advertised catch position',()=>{const g=new ReturnGame();throwBoom(g);const end=g.flightPosition(1);assert.ok(Math.abs(end.x-g.landingX)<1e-9);assert.ok(Math.abs(end.z-g.landingZ)<1e-9);let previous=g.flightPosition(0);for(let i=1;i<=1000;i++){const p=g.flightPosition(i/1000);assert.ok(Math.hypot(p.x-previous.x,p.y-previous.y,p.z-previous.z)<.15);previous=p}});
test('Movement clamps to the small grounded area',()=>{const g=new ReturnGame();tick(g,30,1);assert.equal(g.playerX,2.4);tick(g,30,-1);assert.equal(g.playerX,-2.4)});

test('Return zone is normally offset from the throw position',()=>{const g=new ReturnGame();g.wind=0;g.actionDown();tick(g,.79);g.actionUp();tick(g,.3);assert.ok(Math.abs(g.landingX-g.startX)>=.84)});
test('Depth movement is bounded and needed for alignment',()=>{const g=new ReturnGame();for(let i=0;i<200;i++)g.step(.05,1,1);assert.equal(g.playerX,2.4);assert.equal(g.playerZ,-3.5);for(let i=0;i<200;i++)g.step(.05,-1,-1);assert.equal(g.playerZ,-5.3);throwBoom(g);assert(Math.hypot(g.landingX-g.startX,g.landingZ-g.startZ)>g.catchRadius);});

