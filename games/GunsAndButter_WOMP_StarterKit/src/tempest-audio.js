// Offline physical-percussion synthesis: noise excites inharmonic metal modes.
// All samples are generated locally, with no network or audio licensing dependency.
export function createTempestAudio(){
 let ctx,master,dry,room,analyser,enabled=true,ready=false;const samples={};let variant=0,events=0;
 let seed=541;const rand=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296)*2-1;
 function sample(name,duration,fn){const b=ctx.createBuffer(1,Math.floor(ctx.sampleRate*duration),ctx.sampleRate),a=b.getChannelData(0);let peak=0;for(let i=0;i<a.length;i++){a[i]=fn(i/ctx.sampleRate,i);peak=Math.max(peak,Math.abs(a[i]));}for(let i=0;i<a.length;i++)a[i]*=.8/Math.max(1,peak);samples[name]=b;}
 function init(){
  if(ctx){ctx.resume();return;}
  ctx=new(window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=.6;
  const compressor=ctx.createDynamicsCompressor();compressor.threshold.value=-14;compressor.ratio.value=4;compressor.attack.value=.004;compressor.release.value=.12;
  analyser=ctx.createAnalyser();analyser.fftSize=1024;master.connect(compressor);compressor.connect(analyser);analyser.connect(ctx.destination);
  dry=ctx.createGain();dry.connect(master);room=ctx.createConvolver();const impulse=ctx.createBuffer(2,ctx.sampleRate*1.65,ctx.sampleRate);
  for(let ch=0;ch<2;ch++){const a=impulse.getChannelData(ch);for(let i=0;i<a.length;i++){const t=i/ctx.sampleRate;a[i]=rand()*Math.exp(-t*4.2)*.21*(t>.045?1:0);}}
  room.buffer=impulse;const wet=ctx.createGain();wet.gain.value=.24;room.connect(wet);wet.connect(master);
  for(let v=0;v<4;v++){let last=0;sample('jingle'+v,.62,(t)=>{const n=rand(),high=n-last;last=n;const attack=Math.min(1,t/.001);let metal=0;for(const [f,a,d] of [[2190,1,27],[3371,.7,21],[4873,.55,18],[6217,.4,24],[8339,.25,30]])metal+=Math.sin(t*f*(1+v*.011)*Math.PI*2)*Math.exp(-t*d)*a;return attack*(metal*.21+high*.32*Math.exp(-t*36));});}
  sample('body',.19,t=>Math.sin(2*Math.PI*(125*t+13*(1-Math.exp(-t*35))))*Math.exp(-t*38)*.62+rand()*.24*Math.exp(-t*100));
  sample('latch',.12,t=>(rand()*.55+Math.sin(t*2*Math.PI*1700)*.15)*Math.exp(-t*85));
  sample('plate',1.1,t=>[436,711,1139,1843,2909].reduce((s,f,i)=>s+Math.sin(t*f*Math.PI*2)*Math.exp(-t*(4+i*2))/(i+2),0)*.55+rand()*.3*Math.exp(-t*95));
  sample('skim',.26,t=>rand()*.22*Math.sin(Math.min(1,t/.03)*Math.PI/2)*Math.exp(-t*19));
  sample('step',.16,t=>(rand()*.2+Math.sin(t*2*Math.PI*89)*.15)*Math.exp(-t*40));
  ready=true;ctx.resume();
 }
 function play(name,volume=1,rate=1,pan=0,delay=0){if(!ctx||!enabled)return;const s=ctx.createBufferSource(),gain=ctx.createGain(),p=ctx.createStereoPanner();s.buffer=samples[name];s.playbackRate.value=rate;gain.gain.value=volume;p.pan.value=Math.max(-1,Math.min(1,pan));s.connect(gain);gain.connect(p);p.connect(dry);p.connect(room);s.start(ctx.currentTime+delay);s.onended=()=>{s.disconnect();gain.disconnect();p.disconnect();};events++;}
 return {init,shot(){play('body',.65);play('latch',.35,1.1);play('jingle'+variant++%4,.65,1,-.12,.008);play('jingle'+variant%4,.42,1.09,.12,.024);},hit(pan=0,center=false){play('plate',center?.8:.6,center?1.14:.91,pan);play('jingle'+variant%4,.2,1.2,pan,.035);},reload(stage){play('latch',.8,stage===1?.7:1.15);play('jingle'+variant%4,.4,.85,0,.04);},empty(){play('latch',.4,.68);},skim(pan){play('skim',.15,1,pan);},step(){play('step',.12,.9+Math.random()*.2);},mute(value){enabled=!value;if(master)master.gain.setTargetAtTime(enabled?.6:0,ctx.currentTime,.03);},
  get state(){return ctx?.state||'locked';},get events(){return events;},get ready(){return ready;},get level(){if(!analyser)return 0;const a=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(a);return Math.sqrt(a.reduce((s,v)=>s+v*v,0)/a.length);},get samples(){return samples;},get context(){return ctx;}};
}
