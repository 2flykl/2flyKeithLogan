// Input-only visual QA. Never teleports or changes player physics.
let replayTimer=null,replayPaused=false;
const panel=document.createElement('aside');panel.style='position:fixed;right:12px;top:12px;z-index:100;background:#061b24ef;color:#d8efed;padding:10px;font:11px monospace;max-width:205px';
panel.innerHTML='<label>Seed <input id="seed" value="7" size="3"></label><button id="runQA">Replay</button><button id="pauseQA">Pause / resume</button><pre id="qaReport">Ready</pre>';document.body.appendChild(panel);
document.getElementById('runQA').onclick=()=>{
 clearInterval(replayTimer);let seed=Number(document.getElementById('seed').value)||1;
 Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 State.running=false;reset();replayPaused=false;
 document.getElementById('intro').classList.add('hidden');document.getElementById('end').classList.add('hidden');
 const c={};replayTimer=setInterval(()=>{
  if(replayPaused)return;
  for(let i=0;i<12&&!State.ended;i++){qaDrive(c);update(1/60);}
  draw();document.getElementById('qaReport').textContent=JSON.stringify({time:+State.t.toFixed(1),progress:Math.round((State.startY-State.player.y-132)/52),result:State.endMode,breaks:State.breakCount,encounter:State.currentEncounter},null,2);
  if(State.ended)clearInterval(replayTimer);
 },50);
};
document.getElementById('pauseQA').onclick=()=>{replayPaused=!replayPaused;};
const hide=document.createElement('button');hide.textContent='Hide QA';hide.onclick=()=>{panel.hidden=true;};panel.appendChild(hide);
