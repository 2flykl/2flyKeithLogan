/* Dependency-free event/DOM model. Runs the actual shared and game scripts together.
   Native button Space activation is modeled explicitly; real browser QA remains required. */
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const root=process.env.SOURCE_ROOT?path.resolve(process.env.SOURCE_ROOT):path.resolve(__dirname,'../../..');
const gameCode=fs.readFileSync(path.join(root,'games/return-of-the-aviator/freefall.js'),'utf8');
const sharedCode=fs.readFileSync(path.join(root,'js/playable-controls.js'),'utf8');
class TestEvent {
 constructor(type,options={}){Object.assign(this,{type,cancelable:false,defaultPrevented:false,repeat:false},options);}
 preventDefault(){if(this.cancelable)this.defaultPrevented=true;}
 stopImmediatePropagation(){this.immediateStopped=true;}
 stopPropagation(){this.propagationStopped=true;}
 composedPath(){return [this.target];}
}
function eventTarget(target){
 const listeners=new Map();
 target.addEventListener=(type,fn,options)=>{const list=listeners.get(type)||[];list.push({fn,capture:options===true||options?.capture});listeners.set(type,list);};
 target.dispatchEvent=event=>{event.target??=target;for(const listener of [...(listeners.get(event.type)||[])].sort((a,b)=>Number(b.capture)-Number(a.capture))){listener.fn(event);if(event.immediateStopped)break;}if(!event.immediateStopped)target['on'+event.type]?.(event);return !event.defaultPrevented;};
 return target;
}
function harness({game=true,width=1440,height=900}={}){
 const noop=()=>{},gradient={addColorStop:noop};
 const ctx=new Proxy({getImageData:()=>({data:new Uint8ClampedArray([255,255,255,255])}),createLinearGradient:()=>gradient,createRadialGradient:()=>gradient},{get:(t,k)=>t[k]||noop,set:(t,k,v)=>(t[k]=v,true)});
 let doc;const elements={};
 class Element {
  constructor(id='',tag='div'){this.id=id;this.tagName=tag.toUpperCase();this.hidden=false;this.disabled=false;this.textContent='';this.style={};this.attrs={};eventTarget(this);}
  setAttribute(k,v){this.attrs[k]=v;}getAttribute(k){return this.attrs[k];}
  focus(){doc.activeElement=this;}
  closest(selector){return selector.includes(this.tagName.toLowerCase())?this:null;}
  getContext(){return ctx;}getBoundingClientRect(){return {left:0,top:0,width,height};}
  appendChild(child){child.parentElement=this;(this.children??=[]).push(child);return child;}
  attachShadow(){this.shadowRoot={activeElement:null,querySelector:selector=>this.shadowRoot.nodes[selector],nodes:{}};for(const [selector,tag] of [['#toggle','button'],['#panel','div'],['#full','button'],['[role=status]','p'],['a','a']])this.shadowRoot.nodes[selector]=new Element(selector,tag);this.shadowRoot.nodes['#panel'].hidden=true;return this.shadowRoot;}
  setPointerCapture(){}hasPointerCapture(){return false;}
 }
 const buttons=new Set(['start','sound','pause','resume','skip','replay','burst-touch']);
 const el=id=>elements[id]||(elements[id]=new Element(id,id==='game'?'canvas':id==='exit'?'a':buttons.has(id)?'button':'div'));
 doc=eventTarget({activeElement:null,hidden:false,head:new Element('head'),body:new Element('body'),documentElement:new Element('html'),baseURI:'https://example.test/games/return-of-the-aviator/',currentScript:{src:'https://example.test/js/playable-controls.js'},getElementById:el,createElement:tag=>new Element('',tag),fullscreenElement:null,pointerLockElement:null});
 class Img{constructor(){this.width=1;this.height=1;}set src(value){queueMicrotask(()=>this.onload());}}
 class Audio{constructor(src){this.src=src;this.paused=true;this.currentTime=0;}addEventListener(){}play(){this.paused=false;return Promise.resolve();}pause(){this.paused=true;}}
 const sandbox=eventTarget({console,Math,Promise,Image:Img,Audio,Element,Event:TestEvent,PointerEvent:TestEvent,Uint8ClampedArray,innerWidth:width,innerHeight:height,devicePixelRatio:1,matchMedia:()=>({matches:false}),document:doc,requestAnimationFrame:noop,performance:{now:()=>1000},location:{search:'',assign:url=>sandbox.navigation=url},URL,URLSearchParams,queueMicrotask,localStorage:{getItem:()=>null,setItem:noop}});
 sandbox.window=sandbox;sandbox.parent=sandbox;
 vm.runInNewContext(sharedCode,sandbox);
 if(game){const inject='window.test={start,beginDive,update,pause,finish,keys,get:()=>({run,hero,state,paused,audio})};';vm.runInNewContext(gameCode.replace('window.aviatorDiagnostics=',inject+'window.aviatorDiagnostics='),sandbox);}
 doc.dispatchEvent(new TestEvent('DOMContentLoaded'));
 const click=element=>{element.focus();element.dispatchEvent(new TestEvent('click',{cancelable:true,target:element}));};
 const key=(code,{repeat=false,downOnly=false}={})=>{
  const target=doc.activeElement||doc.body,key=code==='Space'?' ':code==='KeyP'?'p':code;
  const event=new TestEvent('keydown',{cancelable:true,target,code,key,repeat});sandbox.dispatchEvent(event);
  if(!downOnly){sandbox.dispatchEvent(new TestEvent('keyup',{cancelable:true,target:doc.activeElement||doc.body,code,key}));if(code==='Space'&&!event.defaultPrevented&&target.tagName==='BUTTON'&&doc.activeElement===target)click(target);}
  return event;
 };
 return {sandbox,doc,el,click,key,Element};
}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
(async()=>{
 const h=harness();await tick();const {sandbox:s,doc,el,click,key}=h,t=s.test;
 assert.equal(t.get().state,'menu');
 el('sound').focus();key('Space');assert.equal(el('sound').textContent,'SOUND OFF','menu button keeps native Space');assert.equal(t.get().state,'menu');
 click(el('start'));assert.equal(t.get().state,'intro');click(el('skip'));assert.equal(t.get().state,'play');assert.equal(doc.activeElement,el('game'));
 click(el('sound'));assert.equal(doc.activeElement,el('game'),'sound interaction returns focus to game');const sound=el('sound').textContent;
 key('Space',{downOnly:true});t.update(1/120);assert.equal(t.get().hero.state,'fire');assert.equal(el('sound').textContent,sound);s.dispatchEvent(new TestEvent('keyup',{code:'Space'}));
 click(el('pause'));assert(t.get().paused);assert.equal(el('pause').getAttribute('aria-label'),'Resume game');assert.equal(doc.activeElement,el('resume'),'pause moves keyboard focus to Resume');key('Space');assert(!t.get().paused);assert.equal(doc.activeElement,el('game'));assert.equal(el('pause').getAttribute('aria-label'),'Pause game');
 click(el('pause'));click(el('pause'));key('Space');assert(!t.get().paused,'firing after toolbar resume does not pause again');
 key('KeyP');assert(t.get().paused);key('KeyP');assert(!t.get().paused);
 key('Escape');assert(t.get().paused);assert.equal(s.navigation,undefined,'Escape must not leave active run');key('Escape');assert(!t.get().paused);assert.equal(s.navigation,undefined);
 key('Escape',{repeat:true});assert(!t.get().paused);
 const sharedHost=doc.body.children.find(child=>child.id==='playable-controls');click(sharedHost.shadowRoot.querySelector('#toggle'));assert(!sharedHost.shadowRoot.querySelector('#panel').hidden);key('Escape');assert(sharedHost.shadowRoot.querySelector('#panel').hidden,'shared menu closes before game pause');assert(!t.get().paused);assert.equal(s.navigation,undefined);el('game').focus();
 el('sound').focus();key('Space',{downOnly:true});assert(!t.keys.has('Space'),'focused buttons must not also fire');
 s.dispatchEvent(new TestEvent('keyup',{code:'Space'}));click(el('sound'));assert.notEqual(el('sound').textContent,sound);
 t.pause(true);el('sound').focus();const pausedSound=el('sound').textContent;key('Space');assert.notEqual(el('sound').textContent,pausedSound);assert(t.get().paused,'paused controls stay accessible');key('KeyP');assert(!t.get().paused);
 // Shared fullscreen and pointer-lock behavior must precede Aviator pause.
 doc.fullscreenElement=doc.documentElement;let fullscreenExits=0;doc.exitFullscreen=()=>{fullscreenExits++;return Promise.resolve();};key('Escape');assert.equal(fullscreenExits,1);assert(!t.get().paused);doc.fullscreenElement=null;
 doc.pointerLockElement=doc.body;let pointerExits=0;doc.exitPointerLock=()=>pointerExits++;key('Escape');assert.equal(pointerExits,1);assert(!t.get().paused);doc.pointerLockElement=null;
 t.finish(false);key('Escape');assert.equal(s.navigation,'https://example.test/pages/site-overhaul.html#playables','results keep shared Back');
 const menu=harness();await tick();menu.key('Escape');assert.equal(menu.sandbox.navigation,'https://example.test/pages/site-overhaul.html#playables','inactive menu keeps Back');
 const other=harness({game:false});other.key('Escape');assert.equal(other.sandbox.navigation,'https://example.test/pages/site-overhaul.html#playables','unrelated games keep Back');
 const mobile=harness({width:390,height:844});await tick();mobile.click(mobile.el('start'));mobile.click(mobile.el('skip'));mobile.click(mobile.el('sound'));assert.equal(mobile.doc.activeElement,mobile.el('game'));mobile.key('Escape');assert(mobile.sandbox.test.get().paused);mobile.click(mobile.el('resume'));assert(!mobile.sandbox.test.get().paused);
 const html=fs.readFileSync(path.join(root,'games/return-of-the-aviator/index.html'),'utf8');assert.match(html,/id="exit" href="\.\.\/\.\.\/pages\/playables\.html"/,'EXIT must target library route');
 console.log('PASS: actual shared/game scripts integrated; sound+Space, toolbar pause+Space, native menu/paused button activation, pause/resume focus, P, Escape pause/resume/repeat, fullscreen/pointer-lock precedence, inactive/result/unrelated-game Back, portrait input, EXIT route.');
 console.log('Coverage limit: DOM/media events are modeled, not a browser/visual/audio QA pass.');
})().catch(error=>{console.error(error);process.exitCode=1;});
