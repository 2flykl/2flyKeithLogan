// Execute the unmodified entrypoint and real gameplay/photo/UI modules without a GPU.
// Run directly with: node --experimental-vm-modules --test tests/return-lifecycle.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

if (!vm.SourceTextModule) {
  test('actual main.js lifecycle integration suite', t => {
    const env={...process.env};delete env.NODE_TEST_CONTEXT;
    const result = spawnSync(process.execPath, ['--experimental-vm-modules', '--test', fileURLToPath(import.meta.url)], {encoding:'utf8',env});
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout, /tests 18/, 'child runner must execute, not silently skip, all lifecycle scenarios');
    t.diagnostic(result.stdout.trim());
  });
} else {
  const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const library = JSON.parse(fs.readFileSync(path.join(root, 'assets/photo-reel/library.json'), 'utf8'));

  class Target {
    constructor() { this.listeners = new Map(); }
    addEventListener(type, handler) { const list=this.listeners.get(type)||[]; list.push(handler); this.listeners.set(type,list); }
    removeEventListener(type, handler) { this.listeners.set(type,(this.listeners.get(type)||[]).filter(x=>x!==handler)); }
    dispatchEvent(event) {
      event.target ||= this;
      event.currentTarget=this;
      event.preventDefault ||= function() { this.defaultPrevented=true; };
      for(const handler of this.listeners.get(event.type)||[]) handler(event);
      this['on'+event.type]?.(event);
      return !event.defaultPrevented;
    }
  }
  class Element extends Target {
    constructor(tag,document) {
      super(); Object.assign(this,{tagName:tag.toUpperCase(),ownerDocument:document,children:[],parentElement:null,dataset:{},attributes:{},style:{setProperty(name,value){this[name]=value;}},className:'',_text:'',inert:false,hidden:false,disabled:false,checked:false,value:''});
      this.classList={
        contains:name=>this.className.split(/\s+/).includes(name),
        add:(...names)=>{this.className=[...new Set([...this.className.split(/\s+/).filter(Boolean),...names])].join(' ');},
        remove:(...names)=>{this.className=this.className.split(/\s+/).filter(name=>!names.includes(name)).join(' ');},
        toggle:(name,force)=>{const add=force??!this.classList.contains(name);add?this.classList.add(name):this.classList.remove(name);return add;}
      };
    }
    append(...children) { for(const child of children){child.parentElement=this;this.children.push(child);} }
    replaceChildren(...children) { for(const child of this.children)child.parentElement=null;this.children=[];this._text='';this.append(...children); }
    remove() { if(this.parentElement)this.parentElement.children=this.parentElement.children.filter(child=>child!==this);this.parentElement=null; }
    set textContent(text) { this.replaceChildren();this._text=String(text); }
    get textContent() { return this._text+this.children.map(child=>child.textContent).join(''); }
    setAttribute(name,value) { this.attributes[name]=String(value);if(name==='id'||name==='class')this[name==='class'?'className':name]=String(value); }
    getAttribute(name) { return this.attributes[name]??null; }
    matches(selector) { return selector.startsWith('#')?this.id===selector.slice(1):selector.startsWith('.')?this.classList.contains(selector.slice(1)):this.tagName===selector.toUpperCase(); }
    querySelectorAll(selector) {
      const parts=selector.trim().split(/\s+/),last=parts.pop(),found=[];
      const visit=node=>{for(const child of node.children){if(child.matches(last)){let p=child.parentElement,index=parts.length-1;while(p&&index>=0){if(p.matches(parts[index]))index--;p=p.parentElement;}if(index<0)found.push(child);}visit(child);}};visit(this);return found;
    }
    querySelector(selector) { return this.querySelectorAll(selector)[0]||null; }
    get unavailable() { for(let p=this;p;p=p.parentElement)if(p.inert||p.hidden||p.classList.contains('hidden'))return true;return this.disabled; }
    focus() { if(!this.unavailable)this.ownerDocument.activeElement=this; }
    blur() { if(this.ownerDocument.activeElement===this)this.ownerDocument.activeElement=this.ownerDocument.body; }
    click() { if(!this.disabled)this.dispatchEvent({type:'click',target:this}); }
    setPointerCapture(id) { this.pointerCapture=id; }
    releasePointerCapture(id) { if(this.pointerCapture===id){this.pointerCapture=null;this.dispatchEvent({type:'lostpointercapture',pointerId:id});} }
  }
  function documentFromHtml(source) {
    const document=new Target();document.hidden=false;document.root=new Element('document',document);
    document.createElement=tag=>new Element(tag,document);
    document.getElementById=id=>document.root.querySelector('#'+id);
    document.querySelector=selector=>document.root.querySelector(selector);
    document.querySelectorAll=selector=>document.root.querySelectorAll(selector);
    const stack=[document.root],voids=new Set(['AREA','BASE','BR','COL','EMBED','HR','IMG','INPUT','LINK','META','PARAM','SOURCE','TRACK','WBR']);
    for(const match of source.matchAll(/<\/?([a-zA-Z][\w-]*)([^>]*)>/g)) {
      const [full,tag,attrs]=match;
      if(full.startsWith('</')){if(stack.at(-1).tagName===tag.toUpperCase())stack.pop();continue;}
      const element=document.createElement(tag);
      for(const attr of attrs.matchAll(/([\w:-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)){
        const name=attr[1],value=attr[2]??attr[3]??attr[4]??'';element.setAttribute(name,value);
        if(['checked','disabled','hidden'].includes(name))element[name]=true;
        if(name==='value')element.value=value;
      }
      stack.at(-1).append(element);
      if(element.tagName==='HTML')document.documentElement=element;
      if(element.tagName==='BODY')document.body=element;
      if(element.tagName==='OPTION'&&element.parentElement.tagName==='SELECT'&&!element.parentElement.value)element.parentElement.value=element.value;
      if(!voids.has(element.tagName))stack.push(element);
    }
    document.activeElement=document.body;return document;
  }
  async function boot({width=1280,reduced=false,storage=new Map(),actualAudio=false,mediaLibrary=library}={}) {
    const document=documentFromHtml(html),windowTarget=new Target(),errors=[],audioEvents=[],worldEvents=[],raf=[];
    let now=0;
    class Image extends Element {constructor(){super('img',document);}async decode(){}}
    class World {
      constructor(){Object.assign(this,{targetYaw:0,targetPitch:0,targetOrbitRadius:6,targetFov:60,yaw:0,pitch:0,fov:60,textureBytes:0,renderer:{info:{memory:{textures:0},render:{calls:0}}},player:{key:'standing'}});this.photographer={reset:()=>worldEvents.push(['reset']),capture:phase=>worldEvents.push(['capture',phase]),play:pose=>worldEvents.push(['play',pose]),onEvent:type=>worldEvents.push(['event',type]),snapshot:()=>({state:'idle'})};}
      async load(progress){progress(1);}
      recenter(){worldEvents.push(['recenter']);}
      resize(){worldEvents.push(['resize']);}
      update(dt,game,options){this.lastOptions=options;}
      project(x,y,z){return {x:600+x*70,y:360+z*25,visible:true};}
    }
    class Soundscape {
      constructor(){this.muted=false;this.ctx={state:'suspended'};this.energy=0;}
      async start(){this.ctx.state='running';audioEvents.push(['start']);}
      suspend(){this.ctx.state='suspended';audioEvents.push(['suspend']);}
      resume(){this.ctx.state='running';audioEvents.push(['resume']);}
      toggle(){this.muted=!this.muted;return this.muted;}
    }
    for(const name of ['releaseGrade','whoosh','cue','commit','tick','chapter','finish','shutter','update'])Soundscape.prototype[name]=function(...args){audioEvents.push([name,...args]);};
    const songs=[],contexts=[];
    class Audio {
      constructor(src){this.src=src;this.paused=true;this.muted=false;this.volume=1;songs.push(this);}
      async play(){this.paused=false;audioEvents.push(['song-play']);}
      pause(){this.paused=true;audioEvents.push(['song-pause']);}
    }
    const param=()=>({value:0,setTargetAtTime(){},setValueAtTime(){},exponentialRampToValueAtTime(){}});
    const node=()=>({gain:param(),frequency:param(),connect(target){return target;},start(){},stop(){}});
    class AudioContext {
      constructor(){this.state='suspended';this.sampleRate=1000;this.currentTime=0;this.destination=node();contexts.push(this);}
      async resume(){this.state='running';audioEvents.push(['context-resume']);}
      async suspend(){this.state='suspended';audioEvents.push(['context-suspend']);}
      createGain(){return node();}createBufferSource(){return node();}createBiquadFilter(){return node();}createOscillator(){return node();}createMediaElementSource(){return node();}
      createBuffer(channels,length){const data=new Float32Array(length);return {getChannelData:()=>data};}
      createAnalyser(){return {...node(),getByteTimeDomainData:array=>array.fill(128)};}
    }
    const math=Object.create(Math);math.random=()=>.53;
    const sandbox={document,Image,World,Soundscape,Audio,AudioContext,URLSearchParams,location:{search:'?qa'},innerWidth:width,innerHeight:800,performance:{now:()=>now},matchMedia:()=>({matches:reduced}),localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,String(value))},fetch:async url=>{assert.equal(url,'assets/photo-reel/library.json');return {ok:true,json:async()=>structuredClone(mediaLibrary)};},requestAnimationFrame:handler=>raf.push(handler),addEventListener:windowTarget.addEventListener.bind(windowTarget),console:{log(){},warn(){},error:error=>errors.push(error)},Math:math};
    sandbox.window=sandbox;
    const context=vm.createContext(sandbox),modules=new Map();
    function moduleFor(filename){
      if(modules.has(filename))return modules.get(filename);
      let source;
      if(path.basename(filename)==='world.js')source='export const World=globalThis.World;';
      else if(path.basename(filename)==='audio.js'&&!actualAudio)source='export const Soundscape=globalThis.Soundscape;';
      else source=fs.readFileSync(filename,'utf8');
      const module=new vm.SourceTextModule(source,{context,identifier:filename});modules.set(filename,module);return module;
    }
    const main=moduleFor(path.join(root,'src/main.js'));
    await main.link((specifier,parent)=>moduleFor(path.resolve(path.dirname(parent.identifier),specifier)));
    await main.evaluate();
    assert.deepEqual(errors,[],'entrypoint must load without catch/fallback');
    assert.equal(typeof sandbox.__iwa?.snapshot,'function','QA observer installed only after successful startup');
    const h={document,storage,audioEvents,worldEvents,errors,songs,contexts,
      get:id=>document.getElementById(id),snapshot:()=>JSON.parse(JSON.stringify(sandbox.__iwa.snapshot())),
      frame(count=1){for(let i=0;i<count;i++){const callback=raf.shift();assert(callback,'animation frame should remain scheduled');now+=50;callback(now);}assert.deepEqual(errors,[]);},
      until(predicate,limit=1000){let i=0;while(!predicate(h.snapshot())){assert(i++<limit,'condition did not arrive: '+JSON.stringify(h.snapshot()));h.frame();}return h.snapshot();},
      click(id){const element=h.get(id);assert(element&&!element.unavailable,`${id} must be interactive`);element.focus();element.click();},
      key(code,key,type='keydown',options={}){const target=options.target||document.activeElement;const event={type,code,key,repeat:false,...options,target};target.dispatchEvent(event);windowTarget.dispatchEvent(event);return event;},
      down(code,key){return h.key(code,key);},up(code,key){return h.key(code,key,'keyup');},
      tap(code,key){h.down(code,key);h.up(code,key);},
      pointer(id,type,options={}){const element=h.get(id);element.dispatchEvent({type,pointerId:1,clientX:20,clientY:20,...options,target:element});},
      blur(){windowTarget.dispatchEvent({type:'blur'});},
      hide(){document.hidden=true;document.dispatchEvent({type:'visibilitychange'});},
      visible(){document.hidden=false;document.dispatchEvent({type:'visibilitychange'});},
      change(id,value){const element=h.get(id);if(element.tagName==='INPUT')element.checked=value;else element.value=value;element.dispatchEvent({type:'change'});},
      begin(){h.click('begin');h.frame();return h.snapshot();}
    };
    return h;
  }
  function chargeThrow(h,grade='good',input='keyboard') {
    assert.equal(h.snapshot().phase,'ready');
    const zone=h.snapshot().throwZones.find(zone=>zone.grade===grade),target=(zone.start+zone.end)/2;
    if(input==='pointer')h.pointer('action','pointerdown');else h.down('Space',' ');
    h.until(state=>state.charge>=target,100);
    if(input==='pointer')h.pointer('action','pointerup');else h.up('Space',' ');
    assert.equal(h.snapshot().phase,'launch');h.frame();
    h.until(state=>state.phase==='flight',200);
  }
  function moveToRing(h) {
    const held=new Set();
    const set=(code,key,on)=>{if(on&&!held.has(key)){h.down(code,key);held.add(key);}else if(!on&&held.has(key)){h.up(code,key);held.delete(key);}};
    for(let i=0;i<120;i++){
      const state=h.snapshot(),dx=state.landingX-state.playerX,dz=state.landingZ-state.playerZ;
      if(Math.hypot(dx,dz)<.12)break;
      set('KeyA','a',dx<-.06);set('KeyD','d',dx>.06);set('KeyW','w',dz<-.06);set('KeyS','s',dz>.06);h.frame();
    }
    for(const key of held)h.up('Key'+key.toUpperCase(),key);
    const state=h.snapshot();assert(Math.hypot(state.playerX-state.landingX,state.playerZ-state.landingZ)<state.catchRadius,'movement reaches target through real controls');
  }
  function catchReturn(h,grade='good') {
    moveToRing(h);
    const state=h.snapshot(),zone=state.catchZones.find(zone=>zone.grade===grade),target=state.catchStart+(1-state.catchStart)*(zone.start+zone.end)/2;
    h.until(state=>state.progress>=target&&state.reel.active===null,400);
    h.tap('Space',' ');
    assert.equal(h.snapshot().catchGrade,grade);
    h.until(state=>state.phase==='result',200);
    h.until(state=>state.reel.active===null,100);
  }
  function nextReturn(h){if(h.snapshot().reflecting)h.click('throw-again');h.until(state=>state.phase==='ready'||state.phase==='complete',100);}
  function finishSession(h){for(let i=0;i<5;i++){chargeThrow(h);catchReturn(h,i%2?'trick':'good');assert.equal(h.snapshot().returns,i+1);nextReturn(h);}}

  test('actual entrypoint loads, starts, renders real meter, and holds/releases on keyboard and pointer',async()=>{
    const h=await boot();assert(!h.get('intro').classList.contains('hidden'));assert(h.get('loading').classList.contains('hidden'));
    const start=h.begin();assert.equal(start.phase,'ready');assert(start.started);assert(start.guided);assert.equal(h.document.activeElement,h.document.body);
    assert.equal(h.get('timing-assist').checked,true);assert(h.get('meter').querySelectorAll('.timing-zone').length>=3);
    h.down('Space',' ');h.frame(8);assert.equal(h.snapshot().phase,'charging');assert(h.snapshot().charge>0);assert.equal(h.get('action').textContent,'Release to throw');
    h.up('Space',' ');assert.equal(h.snapshot().attempts,1);h.frame();assert.equal(h.snapshot().reel.active,'release');assert(h.document.body.classList.contains('photo-active'));
    const p=await boot({width:390});p.begin();chargeThrow(p,'good','pointer');assert.equal(p.snapshot().phase,'flight');assert.equal(p.snapshot().throwGrade,'good');
  });


  test('guided live region writes only when its instruction changes, not on every animation frame',async()=>{
    const h=await boot();h.begin();const guide=h.get('session-guide'),writes=[];
    const text=Object.getOwnPropertyDescriptor(Element.prototype,'textContent');
    Object.defineProperty(guide,'textContent',{get(){return text.get.call(this);},set(value){writes.push(String(value));text.set.call(this,value);}});
    assert.equal(guide.getAttribute('aria-live'),'polite');assert.match(guide.textContent,/Hold Space/);
    const firstInstruction=guide.textContent;h.frame(20);assert.equal(guide.textContent,firstInstruction);assert.equal(writes.length,0,'unchanged ready instruction must not retrigger the live region');
    h.down('Space',' ');h.frame();assert.match(guide.textContent,/Let go in green/);assert.equal(writes.length,1,'new charging instruction must update the live region exactly once');
    h.frame(8);assert.equal(writes.length,1,'charging frames must not repeat the same live instruction');
    h.up('Space',' ');h.frame();assert.match(guide.textContent,/return ring/);assert.equal(writes.length,2,'release must publish the next instruction');
    h.frame(10);assert.equal(writes.length,2,'frozen cinematic frames must not repeat the launch instruction');
  });

  test('first guided flight waits for real movement and preserves a usable catch window',async()=>{
    const h=await boot();h.begin();chargeThrow(h);h.until(state=>state.tutorialWaiting,500);
    const before=h.snapshot();h.frame(100);assert.equal(h.snapshot().progress,before.progress);assert.equal(h.snapshot().returns,0);assert.match(h.get('session-guide').textContent,/waiting/);
    moveToRing(h);assert(!h.snapshot().tutorialWaiting);assert(h.snapshot().progress<1);catchReturn(h,'trick');
    assert.equal(h.snapshot().returns,1);assert.equal(h.snapshot().perfect,1);assert(h.snapshot().reflecting);assert.equal(h.document.activeElement,h.get('throw-again'));
  });

  test('cinematic release/apex freeze simulation and movement resumes after a held-key cutaway',async()=>{
    const h=await boot();h.begin();chargeThrow(h);
    h.until(state=>state.progress>.44&&state.reel.active===null,100);h.down('KeyD','d');
    h.until(state=>state.reel.active==='apex',100);const frozen=h.snapshot();h.frame(25);
    assert.equal(h.snapshot().progress,frozen.progress);assert.equal(h.snapshot().playerX,frozen.playerX);
    h.until(state=>state.reel.active===null,100);h.frame();assert(h.snapshot().playerX>frozen.playerX);h.up('KeyD','d');const stopped=h.snapshot().playerX;h.frame(5);assert.equal(h.snapshot().playerX,stopped);
  });

  test('movement first pressed during cinematic cutaway starts afterward; releasing during it prevents stale movement',async()=>{
    const h=await boot();h.begin();chargeThrow(h);h.until(state=>state.reel.active==='apex',200);const x=h.snapshot().playerX;
    h.down('KeyD','d');h.frame(10);assert.equal(h.snapshot().playerX,x);h.until(state=>state.reel.active===null,100);h.frame();assert(h.snapshot().playerX>x);h.up('KeyD','d');
    const k=await boot();k.begin();chargeThrow(k);k.until(state=>state.reel.active==='apex',200);const start=k.snapshot().playerX;k.down('KeyD','d');k.up('KeyD','d');k.until(state=>state.reel.active===null,100);k.frame(3);assert.equal(k.snapshot().playerX,start);
  });

  test('pause, blur, and visibility freeze both flight/photo time and clear held movement',async()=>{
    for(const trigger of ['pause','blur','hide']){
      const h=await boot();h.begin();chargeThrow(h);h.down('KeyD','d');h.frame();
      trigger==='pause'?h.tap('Escape','Escape'):h[trigger]();const state=h.snapshot();h.frame(40);assert.equal(h.snapshot().progress,state.progress);assert.equal(h.snapshot().playerX,state.playerX);assert.equal(h.snapshot().sound.state,'suspended');assert(!h.get('pause-screen').classList.contains('hidden'));
      if(trigger==='hide'){h.visible();assert(h.snapshot().paused,'gameplay background pause must not auto-resume');assert.equal(h.snapshot().sound.state,'suspended');}h.click('resume');h.frame();assert.equal(h.snapshot().playerX,state.playerX);assert(!h.snapshot().paused);
    }
    const h=await boot();h.begin();chargeThrow(h);h.until(state=>state.reel.active==='apex',200);h.blur();const elapsed=h.snapshot().reel.elapsed;h.frame(80);assert.equal(h.snapshot().reel.elapsed,elapsed);h.click('resume');h.frame();assert(h.snapshot().reel.elapsed>elapsed);
  });

  test('gallery freezes flight and photos, traps Tab, returns focus, and removes inert on Escape',async()=>{
    const h=await boot();h.begin();chargeThrow(h);h.click('open-reel');assert(h.snapshot().reel.gallery);assert.equal(h.document.activeElement,h.get('gallery-close'));assert(h.get('hud').inert);
    const frozen=h.snapshot();h.frame(50);assert.equal(h.snapshot().progress,frozen.progress);assert.equal(h.snapshot().reel.elapsed,frozen.reel.elapsed);
    const buttons=h.get('photo-gallery').querySelectorAll('button');h.key('Tab','Tab','keydown',{shiftKey:true});assert.equal(h.document.activeElement,buttons.at(-1));h.key('Tab','Tab');assert.equal(h.document.activeElement,buttons[0]);
    h.tap('Escape','Escape');assert(!h.snapshot().reel.gallery);assert(!h.get('hud').inert);assert(!h.get('reflection').inert);assert(!h.get('ending').inert);assert.equal(h.document.activeElement,h.get('open-reel'));
    h.get('open-reel').blur();h.frame();assert(h.snapshot().progress>frozen.progress);
  });


  test('gallery and Explore recover their actual soundtrack on visibility return without escaping their mode',async()=>{
    for(const mode of ['gallery','explore']){
      const h=await boot({actualAudio:true});h.begin();await new Promise(setImmediate);chargeThrow(h);h.click(mode==='gallery'?'open-reel':'look');assert.equal(h.snapshot().sound.state,'running');
      h.hide();assert.equal(h.snapshot().sound.state,'suspended');assert.equal(h.songs[0].paused,true);h.visible();h.frame();
      assert.equal(h.snapshot().sound.state,'running','visible gallery/exploration should restore the suspended soundtrack');assert.equal(h.songs[0].paused,false);
      assert(mode==='gallery'?h.snapshot().reel.gallery:h.snapshot().exploring,'audio recovery must keep the user in the existing mode');
      h.click(mode==='gallery'?'gallery-close':'back');h.frame();assert(!h.snapshot().reel.gallery);assert(!h.snapshot().exploring);assert(!h.snapshot().paused);assert.equal(h.snapshot().sound.state,'running');
    }
  });


  test('ending soundtrack recovers after tab visibility returns without needing another play action',async()=>{
    const h=await boot();h.begin();finishSession(h);assert.equal(h.snapshot().sound.state,'running');h.hide();assert.equal(h.snapshot().sound.state,'suspended');h.visible();h.frame();
    assert.equal(h.snapshot().phase,'complete');assert.equal(h.snapshot().sound.state,'running','ending has no Resume control, so visibility recovery must restore its audio');
  });

  test('actual Soundscape can unmute the song after resuming while muted',async()=>{
    const h=await boot({actualAudio:true});h.begin();await new Promise(setImmediate);assert.equal(h.songs.length,1);assert.equal(h.songs[0].paused,false);
    h.tap('KeyM','m');assert.equal(h.snapshot().sound.muted,true);h.tap('Escape','Escape');assert.equal(h.songs[0].paused,true);h.click('resume');assert.equal(h.snapshot().sound.state,'running');
    h.tap('KeyM','m');assert.equal(h.snapshot().sound.muted,false);assert.equal(h.songs[0].muted,false);assert.equal(h.songs[0].paused,false,'unmuting after a muted Resume must make the song audible again');
  });


  test('actual Soundscape reuses its song/context on restart and respects unmuting while explicitly paused',async()=>{
    const h=await boot({actualAudio:true});h.begin();await new Promise(setImmediate);assert.equal(h.contexts.length,1);assert.equal(h.songs.length,1);
    h.tap('KeyM','m');h.tap('Escape','Escape');h.tap('KeyM','m');assert.equal(h.snapshot().sound.muted,false);assert.equal(h.snapshot().sound.state,'suspended');assert.equal(h.songs[0].paused,true,'unmute must not bypass the pause screen');
    h.click('restart');await new Promise(setImmediate);assert.equal(h.contexts.length,1);assert.equal(h.songs.length,1);assert.equal(h.snapshot().sound.state,'running');assert.equal(h.songs[0].paused,false);assert.equal(h.snapshot().attempts,0);
  });

  test('first catch reflects, favorites persist, gallery close restores reflection and Throw again resumes',async()=>{
    const h=await boot();h.begin();chargeThrow(h);catchReturn(h);assert(h.snapshot().reflecting);assert(h.document.body.classList.contains('reflecting'));
    h.click('keep-best');assert.equal(h.snapshot().reel.favorites,1);assert(h.storage.has('iwa-photo-favorites'));
    h.click('reflect-reel');h.click('gallery-close');assert(h.snapshot().reflecting);assert.equal(h.document.activeElement,h.get('reflect-reel'));assert(!h.get('reflection').inert);
    h.click('throw-again');h.frame();assert.equal(h.snapshot().phase,'ready');assert(!h.snapshot().reflecting);assert(!h.snapshot().paused);assert.equal(h.document.activeElement,h.document.body);
    chargeThrow(h);assert.equal(h.snapshot().reel.active,'release');const before=h.snapshot().progress;h.frame(3);assert(h.snapshot().progress>before);assert(!h.snapshot().paused);
    catchReturn(h);assert.equal(h.snapshot().returns,2);assert(!h.snapshot().reflecting);nextReturn(h);assert.equal(h.snapshot().phase,'ready');
  });

  test('five played returns produce five personal contact-sheet cards and Replay clears session without losing favorites',async()=>{
    const h=await boot();h.begin();finishSession(h);
    const state=h.snapshot();assert.equal(state.phase,'complete');assert.equal(state.returns,5);assert.equal(state.perfect,2);assert.equal(state.reel.returns,5);assert.equal(state.reel.photos,45);assert(!h.get('ending').classList.contains('hidden'));assert(h.get('hud').classList.contains('hidden'));
    assert.equal(h.get('session-sheet').children.length,5);assert.match(h.get('end-stats').textContent,/2 PERFECT · 5 THROWS · 45 FRAMES/);assert.match(h.get('replay-goal').textContent,/3 perfect/);
    const cards=h.get('session-sheet').children;for(let i=0;i<5;i++)assert.match(cards[i].querySelector('figcaption').textContent,new RegExp(`Return ${i+1}`));
    cards[0].querySelector('button').click();assert.equal(cards[0].querySelector('button').getAttribute('aria-pressed'),'true');
    h.click('ending-reel');const firstPhoto=cards[0].querySelector('img').src;
    const galleryCard=()=>h.get('gallery-grid').children.find(item=>item.querySelector('img').src===firstPhoto);
    assert(galleryCard(),'the personal card must also exist in the gallery');assert.equal(galleryCard().querySelector('button').getAttribute('aria-pressed'),'true');
    galleryCard().querySelector('button').click();assert.equal(galleryCard().querySelector('button').getAttribute('aria-pressed'),'false');h.click('gallery-close');
    assert.equal(h.get('session-sheet').children[0].querySelector('button').getAttribute('aria-pressed'),'false','closing gallery must refresh the ending card after unfavoriting');
    h.click('ending-reel');galleryCard().querySelector('button').click();h.tap('Escape','Escape');
    assert.equal(h.get('session-sheet').children[0].querySelector('button').getAttribute('aria-pressed'),'true','Escape close must refresh the ending card after favoriting');
    h.click('again');h.frame();const replay=h.snapshot();assert.equal(replay.phase,'ready');assert.equal(replay.returns,0);assert.equal(replay.attempts,0);assert.equal(replay.reel.photos,0);assert.equal(replay.reel.returns,0);assert.equal(replay.reel.favorites,1);assert(!replay.guided);assert(!replay.paused);assert.equal(h.document.activeElement,h.document.body);
    for(const id of ['hud','reflection','ending'])assert(!h.get(id).inert);chargeThrow(h);assert.equal(h.snapshot().attempts,1);
  });



  test('ending cards sharing a catch asset synchronize Keep state in both directions and after gallery changes',async()=>{
    // The approved three-image fixture intentionally repeats its central catch
    // across returns, making an otherwise random duplicate-asset edge deterministic.
    const mediaLibrary=structuredClone(library);mediaLibrary.pools.catch=mediaLibrary.pools.catch.slice(0,3);
    const h=await boot({mediaLibrary});h.begin();finishSession(h);
    const cards=()=>h.get('session-sheet').children,photo=cards()[0].querySelector('img').src;
    assert(cards().every(card=>card.querySelector('img').src===photo),'fixture must exercise five instances of the same photo asset');
    const expectAll=value=>{for(const card of cards())assert.equal(card.querySelector('button').getAttribute('aria-pressed'),String(value));};
    expectAll(false);cards()[0].querySelector('button').click();expectAll(true);assert.equal(h.snapshot().reel.favorites,1);
    cards()[3].querySelector('button').click();expectAll(false);assert.equal(h.snapshot().reel.favorites,0);
    h.click('ending-reel');const matching=h.get('gallery-grid').children.filter(item=>item.querySelector('img').src===photo);assert.equal(matching.length,5);matching[2].querySelector('button').click();
    for(const item of h.get('gallery-grid').children.filter(item=>item.querySelector('img').src===photo))assert.equal(item.querySelector('button').getAttribute('aria-pressed'),'true');
    h.click('gallery-close');expectAll(true);assert.equal(h.snapshot().reel.favorites,1);assert.equal(h.document.activeElement,h.get('ending-reel'));assert(!h.get('ending').inert);
  });

  test('misses explain position, no-input and red-zone outcomes without ending or incrementing the session',async()=>{
    const h=await boot();h.begin();chargeThrow(h);catchReturn(h);nextReturn(h);
    chargeThrow(h);h.until(state=>state.phase==='result',400);assert.equal(h.snapshot().returns,1);assert.match(h.snapshot().feedback,/ring/);assert(!h.snapshot().reflecting);nextReturn(h);
    chargeThrow(h);moveToRing(h);h.until(state=>state.phase==='result',400);assert.equal(h.snapshot().returns,1);assert.match(h.snapshot().feedback,/Position was right.*Tap/);nextReturn(h);
    chargeThrow(h);catchReturn(h,'bad');assert.equal(h.snapshot().returns,1);assert.match(h.snapshot().feedback,/Red means a miss/);assert.equal(h.snapshot().reel.returns,1);nextReturn(h);
    chargeThrow(h);catchReturn(h);assert.equal(h.snapshot().returns,2);assert.equal(h.snapshot().attempts,5);assert.equal(h.snapshot().reel.returns,2);assert.equal(h.snapshot().history[1].attempt,5);
  });

  test('full photo mode keeps all five reflections and finishes through its final button',async()=>{
    const h=await boot({width:390,reduced:true});h.begin();h.click('pause');h.change('photo-mode','cinematic');h.click('resume');
    for(let i=0;i<5;i++){
      chargeThrow(h);catchReturn(h);assert(h.snapshot().reflecting);assert.equal(h.document.activeElement,h.get('throw-again'));
      if(i===4)assert.equal(h.get('throw-again').textContent,'Finish the session ↗');nextReturn(h);
    }
    assert.equal(h.snapshot().phase,'complete');assert.equal(h.get('session-sheet').children.length,5);assert.equal(h.snapshot().reel.photos,45);
    h.click('again');h.frame();assert(!h.document.body.classList.contains('reflecting'));assert(!h.document.body.classList.contains('photo-active'));assert.equal(h.snapshot().phase,'ready');assert(!h.snapshot().reflecting);
  });

  test('pause options consume their keyboard input; assist changes only between throws and full photos remain selectable',async()=>{
    const h=await boot();h.begin();h.click('pause');h.get('timing-assist').focus();const before=h.snapshot();h.tap('Space',' ');h.tap('KeyV','v');h.tap('KeyM','m');assert.equal(h.snapshot().phase,before.phase);assert.equal(h.snapshot().exploring,false);assert.equal(h.snapshot().sound.muted,false);
    h.change('timing-assist',false);assert.equal(h.snapshot().assist,false);h.get('photo-mode').focus();h.tap('ArrowDown','ArrowDown');h.change('photo-mode','cinematic');h.tap('Escape','Escape');assert(!h.snapshot().paused);assert.equal(h.document.activeElement,h.document.body);
    chargeThrow(h);h.tap('Escape','Escape');assert(h.get('timing-assist').disabled);h.change('timing-assist',true);assert.equal(h.snapshot().assist,false);assert.equal(h.get('timing-assist').checked,false);h.click('resume');catchReturn(h);nextReturn(h);chargeThrow(h);h.until(state=>state.reel.active==='apex',300);const progress=h.snapshot().progress;h.frame(10);assert.equal(h.snapshot().progress,progress);assert(h.document.body.classList.contains('photo-active'));
  });

  test('cancelled pointer charge, pause restart, and explore return do not leave a held action or stale movement',async()=>{
    const h=await boot();h.begin();h.pointer('action','pointerdown');h.frame(6);h.pointer('action','pointercancel');assert.equal(h.snapshot().phase,'ready');assert.equal(h.snapshot().attempts,0);
    h.down('Space',' ');h.frame(5);h.tap('Escape','Escape');assert.equal(h.snapshot().phase,'ready');h.up('Space',' ');h.click('restart');h.frame();assert.equal(h.snapshot().attempts,0);assert(!h.snapshot().paused);assert.equal(h.document.activeElement,h.document.body);
    h.down('KeyD','d');h.frame();h.tap('KeyV','v');const x=h.snapshot().playerX;h.frame(10);assert(h.snapshot().exploring);assert.equal(h.snapshot().playerX,x);h.click('back');h.get('back').blur();h.frame(5);assert(!h.snapshot().exploring);assert.equal(h.snapshot().playerX,x);chargeThrow(h);
  });
}
