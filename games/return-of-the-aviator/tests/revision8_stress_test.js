const fs=require('fs'),vm=require('vm'),assert=require('assert');
const code=fs.readFileSync('../game-rev8.js','utf8');
const noop=()=>{};
const ctx=new Proxy({},{get:(t,p)=>t[p]||(t[p]=p==='measureText'?(()=>({width:10})):noop),set:(t,p,v)=>(t[p]=v,true)});
const elements={
 game:{width:1280,height:720,getContext:()=>ctx,addEventListener:noop},
 fatal:{style:{},textContent:''},
 'start-overlay':{classList:{add:noop,remove:noop,contains:()=>false}},
 start:{disabled:true,textContent:'',addEventListener:(ev,fn)=>{if(ev==='click')elements.start.click=fn}}
};
class FakeImage{constructor(){this.width=320;this.height=220;this.onload=null;this.onerror=null;}set src(v){this._src=v;setImmediate(()=>this.onload&&this.onload())}get src(){return this._src}}
class FakeAudio{constructor(){this.paused=true;this.currentTime=0;this.duration=128;this.volume=1;this.playbackRate=1;this.listeners={};}addEventListener(n,f){this.listeners[n]=f;if(n==='loadedmetadata')setImmediate(f)}play(){this.paused=false;return Promise.resolve()}pause(){this.paused=true}}
let frames=0,now=0,doneResolve,doneReject;const done=new Promise((r,j)=>{doneResolve=r;doneReject=j});
const sandbox={console,Math,Promise,setImmediate,setTimeout,clearTimeout,Image:FakeImage,Audio:FakeAudio,URLSearchParams,
 location:{search:'?autostart=1'},performance:{now:()=>now},
 document:{getElementById:id=>elements[id]},
 addEventListener:noop,
 requestAnimationFrame:(fn)=>{if(frames>=7900){doneResolve();return 0}frames++;now+=33;setImmediate(()=>{try{fn(now)}catch(e){doneReject(e)}});return frames}
};
sandbox.window=sandbox;vm.createContext(sandbox);
try{vm.runInContext(code,sandbox,{filename:'game-rev8.js'})}catch(e){console.error(e);process.exit(1)}
Promise.race([done,new Promise((_,rej)=>setTimeout(()=>rej(new Error('stress timeout')),15000))]).then(()=>{
 assert(frames>=7900,'timeline did not advance');
 assert(!elements.fatal.textContent,'fatal error displayed: '+elements.fatal.textContent);
 console.log('REV8 FULL-TIMELINE STRESS PASS',frames,'frames ~',(frames*0.033).toFixed(1),'seconds');
}).catch(e=>{console.error('STRESS FAIL',e);process.exit(1)});
