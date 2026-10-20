import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {renderTiming} from '../src/timing-ui.js';

class Element{
 constructor(tag='div'){this.tagName=tag;this.children=[];this.dataset={};this.style={};this.attributes={};this.className='';this._text='';this.classList={add:name=>{this.className+=' '+name;}};}
 set textContent(value){this._text=value;this.children=[];}
 get textContent(){return this._text+this.children.map(child=>child.textContent).join('');}
 append(...children){for(const child of children){child.parent=this;this.children.push(child);}}
 remove(){this.parent.children=this.parent.children.filter(child=>child!==this);}
 setAttribute(name,value){this.attributes[name]=value;}
 getAttribute(name){return this.attributes[name];}
 querySelectorAll(selector){return this.children.flatMap(child=>[...(selector[0]==='.'?child.className.split(' ').includes(selector.slice(1)):child.tagName===selector)?[child]:[],...child.querySelectorAll(selector)]);}
 querySelector(selector){return this.querySelectorAll(selector)[0];}
}
const zones=[{grade:'bad',start:0,end:.1},{grade:'regular',start:.1,end:.4},{grade:'good',start:.4,end:.8},{grade:'trick',start:.8,end:.85},{grade:'regular',start:.85,end:1}];
function setup(overrides={}){
 const elements={};const root=new Element();
 const add=(id,tag,parent=root)=>{const element=new Element(tag);element.id=id;elements[id]=element;parent.append(element);return element;};
 const panel=add('interaction','div');
 for(const [id,tag] of [['phase-label','span'],['prompt','h2'],['meter','div'],['hint','p'],['action','button']])add(id,tag,panel);
 add('needle','b',elements.meter);
 const landing=add('landing','div');landing.append(new Element('span'),new Element('small'));
 const find=(node,id)=>node.id===id?node:node.children.map(child=>find(child,id)).find(Boolean);
 globalThis.document={getElementById:id=>find(root,id),createElement:tag=>new Element(tag)};
 const game={phase:'ready',charge:0,flightTime:0,duration:5,playerX:0,playerZ:0,landingX:0,landingZ:0,catchRadius:.5,catchAt:null,throwGrade:'good',catchGrade:null,throwZones:zones,catchZones:zones,returns:0,result:'',...overrides};
 const world={project:(x,y,z)=>({x:100+x*50,y:200+z*20,visible:true})};
 return {game,elements,world,get:id=>find(root,id),render:()=>renderTiming(game,world)};
}

test('meter mounts once and preserves the action control and zone nodes between frames',()=>{
 const h=setup();const button=h.elements.action;h.render();const zones=h.elements.meter.querySelectorAll('.timing-zone');h.render();
 assert.equal(h.elements.meter.querySelectorAll('.timing-zone').length,5);
 assert.equal(h.elements.meter.querySelectorAll('.timing-zone')[0],zones[0]);
 assert.equal(h.get('action'),button);assert.equal(h.get('timing-readiness').children.length,2);
 assert.match(h.get('hint').textContent,/◆ TRICK/);
 assert.equal(zones[3].title,'TRICK · precise timing');
});
test('charge shows the current grade and matching needle position without moving controls',()=>{
 const h=setup({phase:'charging',charge:.7});h.render();
 assert.equal(h.get('needle').style.left,'70%');assert.equal(h.get('timing-grade').textContent,'GOOD THROW');
 assert.equal(h.get('action').textContent,'Release to throw');assert.equal(h.get('meter').getAttribute('aria-valuenow'),'70');
 assert.equal(h.get('catch-readiness').dataset.ready,'true');
});
test('position and timing readiness are independent before and during the catch window',()=>{
 const h=setup({phase:'flight',flightTime:2.5,catchStart:.7});h.render();
 assert.equal(h.get('position-readiness').dataset.ready,'true');assert.equal(h.get('catch-readiness').dataset.ready,'false');
 assert.equal(h.get('catch-readiness').textContent,'Timing · wait 1.0 s');
 h.game.playerX=2;h.game.flightTime=4;h.render();
 assert.equal(h.get('position-readiness').dataset.ready,'false');assert.equal(h.get('catch-readiness').dataset.ready,'true');
 assert.equal(h.get('action').textContent,'Catch now');
});
test('catch meter honors a variable window start rather than the old fixed threshold',()=>{
 const h=setup({phase:'flight',flightTime:3.5,catchStart:.6});h.render();
 assert.ok(Math.abs(parseFloat(h.get('needle').style.left)-25)<.0001);
 assert.equal(h.get('interaction').dataset.window,'open');
 assert.equal(h.get('meter').getAttribute('aria-label'),'Catch timing');
});
test('committed catch freezes its needle and grade while position can still change',()=>{
 const h=setup({phase:'flight',flightTime:4.75,catchStart:.6,catchAt:.8,catchGrade:'good'});h.render();
 assert.ok(Math.abs(parseFloat(h.get('needle').style.left)-50)<.0001);
 assert.equal(h.get('timing-grade').textContent,'GOOD CATCH');assert.equal(h.get('action').textContent,'Catch set');
 h.game.flightTime=4.95;h.game.playerX=2;h.render();
 assert.ok(Math.abs(parseFloat(h.get('needle').style.left)-50)<.0001);
 assert.equal(h.get('position-readiness').dataset.ready,'false');assert.match(h.get('prompt').textContent,/Move into the ring/);
});
test('specific miss feedback is text, not markup, and result keeps catch zones',()=>{
 const h=setup({phase:'result',catchAt:null,result:'Let it come to you',feedback:'Wait for the needle, then tap once.'});h.render();
 assert.equal(h.get('prompt').textContent,h.game.feedback);assert.equal(h.get('interaction').dataset.verdict,'miss');
 assert.equal(h.get('catch-readiness').textContent,'Timing · no catch');
 assert.equal(h.get('meter').getAttribute('aria-label'),'Catch timing');
});
test('successful returns have a distinct accent without announcing every frame',()=>{
 const h=setup({phase:'flight',flightTime:4.5,catchAt:.9,catchGrade:'good'});h.render();
 h.game.phase='result';h.game.returns=1;h.game.result='Back in your hands';h.render();
 assert.equal(h.get('interaction').dataset.verdict,'success');
 const announcement=h.get('timing-announcement').textContent;h.render();
 assert.equal(h.get('timing-announcement').textContent,announcement);
 assert.match(announcement,/THE RETURN/);
});
test('live announcements change for catch cues, not frame-by-frame charge or distance',()=>{
 const h=setup({phase:'flight',flightTime:1});h.render();const initial=h.get('timing-announcement').textContent;
 h.game.flightTime=2;h.game.playerX=.2;h.render();assert.equal(h.get('timing-announcement').textContent,initial);
 h.game.flightTime=4;h.render();assert.notEqual(h.get('timing-announcement').textContent,initial);
 assert.match(h.get('timing-announcement').textContent,/tap now/);
});
test('legacy state has safe catch-window fallbacks and a bounded return-ring size',()=>{
 const h=setup({phase:'flight',flightTime:4.45});h.render();
 assert.ok(Math.abs(parseFloat(h.get('needle').style.left)-50)<.0001);
 assert.equal(h.get('landing').querySelector('span').style.width,'50px');
 assert.equal(h.get('landing').querySelector('span').style.height,'20px');
});
test('out-of-range charge is clamped and missing optional UI is harmless',()=>{
 const h=setup({phase:'charging',charge:1.4});h.render();assert.equal(h.get('needle').style.left,'100%');
 globalThis.document={getElementById:()=>null};assert.doesNotThrow(()=>renderTiming(h.game,h.world));
});
test('CSS provides stable touch targets, non-color zones and reduced-motion treatment',()=>{
 const css=fs.readFileSync(new URL('../meter.css',import.meta.url),'utf8');
 assert.match(css,/grid-template-rows:/);assert.match(css,/min-height:44px/);
 assert.match(css,/timing-zone\.bad\{background-image:repeating-linear-gradient/);
 assert.match(css,/timing-zone\.good\{background-image:radial-gradient/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(css,/#landing span\{animation:none!important/);
});
test('guided waiting tells the player flight is waiting rather than showing a stalled countdown',()=>{
 const h=setup({phase:'flight',flightTime:3.45,catchStart:.7,tutorialWaiting:true,guided:true,playerX:2,catchZones:zones.filter(zone=>zone.grade!=='bad')});h.render();
 assert.equal(h.get('catch-readiness').textContent,'Timing · flight waits');
 assert.match(h.get('prompt').textContent,/Flight waits for you/);
 assert.match(h.get('hint').textContent,/no BAD zone/);
});
test('result readiness describes the completed attempt even if movement resumes',()=>{
 const h=setup({phase:'result',catchAt:.9,catchGrade:'good',returns:1,result:'Back in your hands',playerX:2});h.render();
 assert.equal(h.get('position-readiness').textContent,'Position · ready ✓');
 h.game.playerX=2;h.render();assert.equal(h.get('position-readiness').textContent,'Position · ready ✓');
});
test('timing renderer preserves main-owned disabled state and highlights the selected grade',()=>{
 const h=setup({phase:'charging',charge:.6});h.elements.action.disabled=true;h.render();
 assert.equal(h.elements.action.disabled,true);
 assert.equal(h.elements.meter.querySelectorAll('.timing-zone').filter(element=>element.dataset.current==='true').length,1);
 assert.match(h.elements.meter.querySelectorAll('.timing-zone').find(element=>element.dataset.current==='true').className,/good/);
});
