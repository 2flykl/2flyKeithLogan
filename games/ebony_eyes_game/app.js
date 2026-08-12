const TRAITS=['Stability','Heart','Confidence','Wellness','Mind','Soul','Loyalty','Ambition'];
const TILE_ASSET={
  Stability:'assets/tiles/stability.png',Heart:'assets/tiles/heart.png',Confidence:'assets/tiles/confidence.png',Wellness:'assets/tiles/wellness.png',
  Mind:'assets/tiles/mind.png',Soul:'assets/tiles/soul.png',Loyalty:'assets/tiles/loyalty.png',Ambition:'assets/tiles/ambition.png',Balloon:'assets/tiles/red_balloon.png'
};
const women=[
  {name:'Keysha',prefs:['Stability','Loyalty','Heart'],img:'assets/contestants/keysha.png'},
  {name:'Jade',prefs:['Ambition','Confidence','Soul'],img:'assets/contestants/jade.png'},
  {name:'Imani',prefs:['Heart','Mind','Loyalty'],img:'assets/contestants/imani.png'},
  {name:'Simone',prefs:['Heart','Loyalty','Confidence'],img:'assets/contestants/simone.png'},
  {name:'Amara',prefs:['Wellness','Soul','Stability'],img:'assets/contestants/amara.png'},
  {name:'Zuri',prefs:['Ambition','Mind','Loyalty'],img:'assets/contestants/zuri.png'}
];
const men=[
  {name:'Marcus',prefs:['Confidence','Ambition','Loyalty'],img:'assets/contestants/marcus.png'},
  {name:'Andre',prefs:['Soul','Confidence','Heart'],img:'assets/contestants/andre.png'},
  {name:'Malcolm',prefs:['Mind','Stability','Ambition'],img:'assets/contestants/malcolm.png'},
  {name:'Darius',prefs:['Heart','Soul','Loyalty'],img:'assets/contestants/darius.png'},
  {name:'Isaiah',prefs:['Stability','Wellness','Loyalty'],img:'assets/contestants/isaiah.png'},
  {name:'Julian',prefs:['Heart','Confidence','Soul'],img:'assets/contestants/julian.png'}
];

const ROWS=7,COLS=10,SONG_SECONDS=187;
let people=[],mode='male',board=[],cursor={r:3,c:4},preview=[];
let profile={},interest=[],popped=[],score=0,locks=0,matches=0,failedLocks=0,streak=0,maxStreak=0,pressure=0,time=SONG_SECONDS;
let started=false,paused=false,ending=false,audio=null,secondTimer=null,flowTimeout=null,lastFlowAt=0;
let matchedTraitCount=Object.fromEntries(TRAITS.map(t=>[t,0]));
let lockTraitCount=Object.fromEntries(TRAITS.map(t=>[t,0]));
let cursorMoves=0,balloonHits=0,safeBalloonClears=0,focusIndex=-1,spotlightCharges=2,spawnBag=[];
let laneHistory=[],globalHistory=[];
let uid=1;

function cell(type,locked=false){return {id:uid++,type,locked,lockedAt:locked?performance.now():0,age:0,hit:false}}
function emptyBoard(){return Array.from({length:ROWS},()=>Array(COLS).fill(null))}
function rand(a){return a[Math.floor(Math.random()*a.length)]}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function sleep(ms){return new Promise(r=>setTimeout(r,ms))}

function startGame(m){
  mode=m;people=m==='male'?women:men;board=emptyBoard();cursor={r:Math.floor(ROWS/2),c:Math.floor(COLS/2)};
  laneHistory=Array.from({length:COLS},()=>[]); globalHistory=[]; spawnBag=[];
  TRAITS.forEach(t=>profile[t]=8);interest=people.map((_,i)=>i===1?42+Math.random()*4:59+Math.random()*16);popped=people.map(()=>false);
  score=0;locks=0;matches=0;failedLocks=0;streak=0;maxStreak=0;pressure=0;time=SONG_SECONDS;ending=false;
  matchedTraitCount=Object.fromEntries(TRAITS.map(t=>[t,0]));lockTraitCount=Object.fromEntries(TRAITS.map(t=>[t,0]));cursorMoves=0;balloonHits=0;safeBalloonClears=0;spotlightCharges=2;
  document.querySelector('#title').classList.remove('active');document.querySelector('#game').classList.add('active');
  preview=makePreviewWave();updateBoardGeometry();renderAll();
  audio=new Audio('assets/Ebony Eyes 5.mp3');audio.volume=.72;audio.play().catch(()=>{});
  document.querySelector('#soundBtn').onclick=()=>{audio.muted=!audio.muted;document.querySelector('#soundBtn').textContent=audio.muted?'MUTED':'MUSIC'};
  started=true;secondTimer=setInterval(tickSecond,1000);scheduleFlow(1200);
  toast('EMPTY BOARD • FIRST FLOW INCOMING');
}

function progress(){return clamp((SONG_SECONDS-time)/SONG_SECONDS,0,1)}
function phaseInfo(){
  const p=progress();
  if(p<.24)return {label:'FIRST IMPRESSION',help:'Slow flow. Build your first locks and 2-chains.',interval:1220,spawnMin:3,spawnMax:5,balloon:.012};
  if(p<.55)return {label:'READ THE ROOM',help:'The Director starts feeding your unfinished plans.',interval:980,spawnMin:4,spawnMax:6,balloon:.04};
  if(p<.79)return {label:'BALLOON PRESSURE',help:'More lanes fill. Balloons attack congested stacks.',interval:770,spawnMin:5,spawnMax:7,balloon:.082};
  return {label:'FINAL PURSUIT',help:'Fast flow. Multiple opportunities compete for your attention.',interval:600,spawnMin:6,spawnMax:8,balloon:.125};
}
function skillFactor(){
  const lockQuality=locks?matches/locks:0;const congestion=averagePile()/ROWS;const miss=locks?failedLocks/locks:0;
  return clamp(.5+lockQuality*1.1-congestion*.55-miss*.35,0,1.35);
}
function adaptiveInterval(){
  const ph=phaseInfo();const skill=skillFactor();
  return Math.round(ph.interval*(skill>.8?.9:skill<.35?1.12:1));
}

function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function refillBag(){spawnBag=shuffle([...TRAITS,...TRAITS])}
function nextBagTrait(exclude=[]){if(spawnBag.length<3)refillBag();let idx=spawnBag.findIndex(t=>!exclude.includes(t));if(idx<0)idx=0;const [pick]=spawnBag.splice(idx,1);return pick}
function recordLaneTrait(lane,type){if(type==='Balloon')return; laneHistory[lane].push(type); if(laneHistory[lane].length>3)laneHistory[lane].shift(); globalHistory.push(type); if(globalHistory.length>8)globalHistory.shift();}
function variedDirectorTrait(lane,preferred=null,waveCounts={}){const recentLane=laneHistory[lane]||[]; const recentGlobal=globalHistory.slice(-2); const exclude=[]; if(recentLane.length && recentLane[recentLane.length-1]) exclude.push(recentLane[recentLane.length-1]); if(recentLane.length>1 && recentLane[0]===recentLane[1]) exclude.push(recentLane[0]); if(recentGlobal.length===2 && recentGlobal[0]===recentGlobal[1]) exclude.push(recentGlobal[0]);
  let pick=preferred;
  if(!pick || (exclude.includes(pick) && Math.random()<0.75) || (waveCounts[pick]||0)>=2){
    for(let tries=0;tries<8;tries++){
      const candidate=directorTrait();
      if((waveCounts[candidate]||0)>=2) continue;
      if(exclude.includes(candidate) && Math.random()<0.7) continue;
      pick=candidate; break;
    }
  }
  if(!pick) pick=nextBagTrait(exclude);
  if((waveCounts[pick]||0)>=2){ pick=nextBagTrait(Object.keys(waveCounts).filter(k=>waveCounts[k]>=2).concat(exclude)); }
  waveCounts[pick]=(waveCounts[pick]||0)+1; recordLaneTrait(lane,pick); return pick;
}
function updateBoardGeometry(){
  document.documentElement.style.setProperty('--cols',COLS); document.documentElement.style.setProperty('--rows',ROWS);
  const headerH=document.querySelector('header')?.offsetHeight||66;
  const contestantH=document.querySelector('#contestants')?.offsetHeight||116;
  const sidebarW=470; const chrome=88; const boardAvailW=Math.max(540,window.innerWidth-sidebarW-chrome);
  const centerExtras=150; const boardAvailH=Math.max(280,window.innerHeight-headerH-contestantH-centerExtras);
  const cellW=Math.floor((boardAvailW-(COLS-1)*4-22)/COLS);
  const cellH=Math.floor((boardAvailH-(ROWS-1)*4-22)/ROWS);
  const cell=Math.max(52,Math.min(90,Math.min(cellW,cellH)));
  document.documentElement.style.setProperty('--cell',cell+'px');
  document.documentElement.style.setProperty('--previewCell',Math.max(26,Math.floor(cell*0.42))+'px');
}
function averagePile(){
  let total=0;for(let c=0;c<COLS;c++){let count=0;for(let r=0;r<ROWS;r++)if(board[r][c])count++;total+=count}return total/COLS;
}
function scheduleFlow(delay=null){clearTimeout(flowTimeout);if(ending)return;flowTimeout=setTimeout(flowTick,delay??adaptiveInterval())}

function makePreviewWave(){
  const ph=phaseInfo();const count=ph.spawnMin+Math.floor(Math.random()*(ph.spawnMax-ph.spawnMin+1));
  const lanes=[...Array(COLS).keys()].sort(()=>Math.random()-.5).slice(0,count);const wave=Array(COLS).fill(null);
  const assist=chooseOpportunity();const skill=skillFactor();
  let balloonChance=ph.balloon*(skill>.85?1.2:skill<.35?.55:1); const waveCounts={};
  for(const c of lanes){
    if(Math.random()<balloonChance){wave[c]='Balloon';continue}
    const preferred=(assist && assist.lanes.includes(c) && Math.random()<(progress()<.55?.56:.36))?assist.type:null;
    wave[c]=variedDirectorTrait(c,preferred,waveCounts);
  }
  if(assist?.urgent && assist.lanes.length){const c=rand(assist.lanes);wave[c]=assist.type; waveCounts[assist.type]=(waveCounts[assist.type]||0)+1; recordLaneTrait(c,assist.type)}
  return wave;
}
function directorTrait(){
  const weights=Object.fromEntries(TRAITS.map(t=>[t,1]));
  const plans=analyzePlans();
  plans.forEach(p=>{weights[p.type]+=p.size===2?3.3:1.1});
  const fi=inferFocus();if(fi>=0)people[fi].prefs.forEach(t=>weights[t]+=1.25);
  // Keep profile from becoming one-dimensional.
  const low=[...TRAITS].sort((a,b)=>profile[a]-profile[b]).slice(0,2);low.forEach(t=>weights[t]+=.45);
  let sum=Object.values(weights).reduce((a,b)=>a+b,0),x=Math.random()*sum;
  for(const t of TRAITS){x-=weights[t];if(x<=0)return t}return rand(TRAITS)
}
function chooseOpportunity(){
  const plans=analyzePlans().filter(p=>p.lanes.length);
  if(!plans.length)return null;
  plans.sort((a,b)=>(b.size-a.size)||((performance.now()-b.oldest)-(performance.now()-a.oldest)));
  const p=plans[0];return {...p,urgent:p.size===2&&(performance.now()-p.oldest)>5200};
}
function analyzePlans(){
  const seen=new Set(),out=[];
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
    const x=board[r][c];if(!x?.locked||x.type==='Balloon'||seen.has(x.id))continue;
    const cluster=[],q=[[r,c]];seen.add(x.id);
    while(q.length){const [rr,cc]=q.shift(),cur=board[rr][cc];cluster.push([rr,cc,cur]);for(const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]){const nr=rr+dr,nc=cc+dc;if(nr<0||nr>=ROWS||nc<0||nc>=COLS)continue;const n=board[nr][nc];if(n?.locked&&n.type===x.type&&!seen.has(n.id)){seen.add(n.id);q.push([nr,nc])}}}
    if(cluster.length>=3)continue;
    const candidates=new Set();for(const [rr,cc] of cluster)for(const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]){const nr=rr+dr,nc=cc+dc;if(nr<0||nr>=ROWS||nc<0||nc>=COLS)continue;if(!board[nr][nc]||!board[nr][nc].locked)candidates.add(nc)}
    out.push({type:x.type,size:cluster.length,lanes:[...candidates],oldest:Math.min(...cluster.map(v=>v[2].lockedAt))});
  }
  return out;
}
function inferFocus(){
  let best=-1,bestScore=-1;people.forEach((p,i)=>{if(popped[i])return;let s=0;p.prefs.forEach(t=>s+=lockTraitCount[t]*.4+matchedTraitCount[t]*1.4);if(s>bestScore){bestScore=s;best=i}});focusIndex=bestScore>0?best:-1;return focusIndex;
}

async function flowTick(){
  if(!started||paused||ending){scheduleFlow(250);return}
  lastFlowAt=performance.now();
  await advanceOneCell();
  injectPreview();preview=makePreviewWave();ageCells();updatePressure();checkOverflow();checkPops();renderAll();scheduleFlow();
}
function ageCells(){for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(board[r][c])board[r][c].age++}
async function advanceOneCell(){
  // bottom-up keeps movement exactly one grid space per flow tick.
  const hits=[];
  for(let c=0;c<COLS;c++){
    for(let r=ROWS-1;r>=0;r--){
      const x=board[r][c];if(!x||x.locked)continue;
      if(x.type==='Balloon'){
        if(r===ROWS-1){board[r][c]=null;continue}
        const below=board[r+1][c];
        if(!below){board[r+1][c]=x;board[r][c]=null;continue}
        if(below.locked){hits.push({r:r+1,c,lockedType:below.type});board[r+1][c]=null;board[r][c]=null;balloonHits++;continue}
        // Balloon chews a loose tile and occupies its cell.
        hits.push({r:r+1,c,loose:true,lockedType:below.type});board[r+1][c]=x;board[r][c]=null;continue
      }
      if(r===ROWS-1){board[r][c]=null;continue}
      if(!board[r+1][c]){board[r+1][c]=x;board[r][c]=null}
    }
  }
  if(hits.length){renderBoard();hits.forEach(h=>flashCell(h.r,h.c));await sleep(130);for(const h of hits)applyBalloonHit(h)}
}
function applyBalloonHit(h){
  if(h.loose){score+=35;toastSmall('BALLOON CLEARS LOOSE CLUTTER');return}
  const t=h.lockedType;if(t&&TRAITS.includes(t)){profile[t]=clamp(profile[t]-5,0,100);people.forEach((p,i)=>{if(!popped[i])interest[i]-=p.prefs.includes(t)?7:2.5});score=Math.max(0,score-350);streak=0;pressure+=8;toast('RED BALLOON BROKE A LOCK • '+t.toUpperCase()+' REGRESSED')}
}
function injectPreview(){
  for(let c=0;c<COLS;c++){
    const type=preview[c];if(!type)continue;
    if(!board[0][c])board[0][c]=cell(type,false);
    else { // crowded entry lane: balloon may still punch in, otherwise pressure rises.
      if(type==='Balloon'&&board[0][c]&&!board[0][c].locked){board[0][c]=cell('Balloon',false)}else pressure+=1.2;
    }
  }
}
function updatePressure(){
  let occupied=0,locked=0,pairs=0;for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){if(board[r][c])occupied++;if(board[r][c]?.locked)locked++;if(board[r][c]?.pair)pairs++}
  const density=occupied/(ROWS*COLS);pressure=clamp(pressure*.96+density*5+Math.max(0,averagePile()-5)*.8,0,100);
}
function checkOverflow(){
  let topLocks=0;for(let c=0;c<COLS;c++)if(board[0][c]?.locked)topLocks++;
  if(topLocks>=3){pressure=clamp(pressure+12,0,100);people.forEach((_,i)=>{if(!popped[i])interest[i]-=3});toast('LANES ARE CHOKING • CLEAR A CONNECTION')}
}

function moveCursor(dr,dc){if(!started||paused||ending)return;cursor.r=clamp(cursor.r+dr,0,ROWS-1);cursor.c=clamp(cursor.c+dc,0,COLS-1);cursorMoves++;renderBoard();updateStatusLine()}
async function lockAtCursor(){
  if(!started||paused||ending)return;const x=board[cursor.r][cursor.c];
  if(!x){failedLocks++;toastSmall('EMPTY CELL • WAIT FOR AN ICON');return}
  if(x.type==='Balloon'){failedLocks++;toastSmall('RED BALLOONS CANNOT BE LOCKED');return}
  if(x.locked){
    x.locked=false;x.lockedAt=0;x.pair=false;score=Math.max(0,score-110);pressure=clamp(pressure+2,0,100);streak=0;toastSmall('UNLOCKED • FLOW RESUMES IN THIS LANE');renderAll();return;
  }
  x.locked=true;x.lockedAt=performance.now();locks++;lockTraitCount[x.type]++;score+=40;
  renderBoard();await resolveConnections();updateStatusLine();renderAll();
}
async function resolveConnections(){
  let clearedAny=false,chain=0;
  while(true){
    const clusters=getLockedClusters().filter(g=>g.length>=3);if(!clusters.length)break;chain++;clearedAny=true;
    const toClear=new Map();
    clusters.forEach(g=>g.forEach(([r,c,x])=>toClear.set(`${r},${c}`,x)));
    toClear.forEach((x,key)=>{const [r,c]=key.split(',').map(Number);const el=document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);el?.classList.add('matching')});
    await sleep(260);
    const counts={};toClear.forEach(x=>counts[x.type]=(counts[x.type]||0)+1);
    Object.entries(counts).forEach(([t,n])=>awardMatch(t,n,chain));
    toClear.forEach((_,key)=>{const [r,c]=key.split(',').map(Number);board[r][c]=null});
    matches++;streak++;maxStreak=Math.max(maxStreak,streak);score+=toClear.size*160*chain;
    // A successful match releases every stack naturally on future one-cell ticks; no instant gravity.
    renderAll();await sleep(120);
  }
  if(!clearedAny)streak=Math.max(0,streak-0);markPairs();
}
function getLockedClusters(){
  const seen=new Set(),groups=[];
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
    const x=board[r][c];if(!x?.locked||x.type==='Balloon'||seen.has(x.id))continue;const group=[],q=[[r,c]];seen.add(x.id);
    while(q.length){const [rr,cc]=q.shift(),cur=board[rr][cc];group.push([rr,cc,cur]);for(const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]){const nr=rr+dr,nc=cc+dc;if(nr<0||nr>=ROWS||nc<0||nc>=COLS)continue;const n=board[nr][nc];if(n?.locked&&n.type===x.type&&!seen.has(n.id)){seen.add(n.id);q.push([nr,nc])}}}groups.push(group)
  }
  return groups;
}
function markPairs(){for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++)if(board[r][c])board[r][c].pair=false;getLockedClusters().forEach(g=>{if(g.length===2)g.forEach(([, ,x])=>x.pair=true)})}
function awardMatch(t,n,chain){
  const gain=9+(n-3)*3+chain*2;profile[t]=clamp(profile[t]+gain,0,100);matchedTraitCount[t]++;
  people.forEach((p,i)=>{if(popped[i])return;interest[i]=clamp(interest[i]+(p.prefs.includes(t)?10+chain*2:1),0,100)});
  pressure=clamp(pressure-(9+chain*2),0,100);score+=gain*35;toast(chain>1?`CASCADE ${chain} • ${t.toUpperCase()}`:`CONNECTION 3 • ${t.toUpperCase()}`)
}

function releaseLock(){
  if(!started||paused||ending)return;const x=board[cursor.r][cursor.c];if(!x?.locked){toastSmall('MOVE CURSOR TO A LOCKED ICON');return}
  x.locked=false;x.lockedAt=0;x.pair=false;score=Math.max(0,score-180);pressure=clamp(pressure+3,0,100);streak=0;toast('LET GO • LOCK RELEASED');renderAll()
}
function spotlight(){
  if(spotlightCharges<=0){toastSmall('NO SPOTLIGHT CHARGES');return}const opp=chooseOpportunity();if(!opp){toastSmall('NO OPEN 2-CHAIN YET');return}spotlightCharges--;
  const lane=rand(opp.lanes);preview[lane]=opp.type;toast(`SPOTLIGHT • ${opp.type.toUpperCase()} ENTERING LANE ${lane+1}`);renderPreview()
}

function tickSecond(){
  if(paused||ending)return;time=Math.max(0,time-1);const p=progress();
  // Contestants judge continuously. Jade starts skeptical so an early pop is common, not guaranteed.
  people.forEach((person,i)=>{if(popped[i])return;let decay=p<.24?.31:p<.55?.18:.13;const focus=inferFocus();if(focus===i)decay*=.74;interest[i]-=decay+(pressure/100)*.13});
  checkPops();renderAll();if(time<=0||popped.every(Boolean))endGame()
}
function checkPops(){people.forEach((_,i)=>{if(!popped[i]&&interest[i]<=1)popContestant(i)})}
function popContestant(i){popped[i]=true;interest[i]=0;score=Math.max(0,score-650);pressure=clamp(pressure+5,0,100);renderContestants();toast(`${people[i].name.toUpperCase()} LOWERS THE BALLOON… POP`);document.body.animate([{filter:'brightness(1)'},{filter:'brightness(2.1)'},{filter:'brightness(1)'}],{duration:330})}

function renderAll(){markPairs();renderBoard();renderPreview();renderContestants();renderTraits();renderHud();updatePhase();updateStatusLine();renderDirector()}
function renderBoard(){
  const el=document.querySelector('#board');el.innerHTML='';
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
    const d=document.createElement('div');d.className='cell';d.dataset.r=r;d.dataset.c=c;if(r===cursor.r&&c===cursor.c)d.classList.add('cursor');const x=board[r][c];
    if(x){d.classList.add(x.locked?'locked':'loose');if(x.type==='Balloon')d.classList.add('balloon');if(x.pair)d.classList.add('pair');const art=document.createElement('div');art.className='tileArt';art.style.backgroundImage=`url("${TILE_ASSET[x.type]}")`;d.appendChild(art)}
    el.appendChild(d)
  }
}
function renderPreview(){
  const el=document.querySelector('#previewLanes');el.className='previewGrid';el.innerHTML='';preview.forEach(type=>{const d=document.createElement('div');d.className='previewCell'+(type==='Balloon'?' balloon':'');if(type)d.style.backgroundImage=`url("${TILE_ASSET[type]}")`;el.appendChild(d)})
}
function renderContestants(){
  const el=document.querySelector('#contestants');el.innerHTML='';const focus=inferFocus();people.forEach((p,i)=>{
    const d=document.createElement('div');d.className='contestant'+(popped[i]?' popped':'')+(interest[i]<22&&!popped[i]?' danger':'')+(focus===i&&!popped[i]?' focus':'');
    d.innerHTML=`<div class="portrait" style="background-image:url('${p.img}')"></div><div class="contestantInfo"><div class="cname">${p.name}</div><div class="prefs">${p.prefs.map(t=>`<i>${t}</i>`).join('')}</div></div><div class="heldBalloon"></div><div class="interest"><span style="width:${clamp(interest[i],0,100)}%"></span></div>`;el.appendChild(d)
  })
}
function qualities(){const arr=[];if(profile.Stability>=35)arr.push('Grounded');if(profile.Heart>=35)arr.push('Open Heart');if(profile.Confidence>=35)arr.push('Self-Assured');if(profile.Wellness>=35)arr.push('Disciplined');if(profile.Mind>=35)arr.push('Thoughtful');if(profile.Soul>=35)arr.push('Creative Spirit');if(profile.Loyalty>=35)arr.push('Dependable');if(profile.Ambition>=35)arr.push('Driven');return arr}
function flags(){const arr=[];if(pressure>55)arr.push('Overextended');if(failedLocks>7)arr.push('Impulsive');if(balloonHits>2)arr.push('Inconsistent');if(averagePile()>6)arr.push('Cluttered Priorities');return arr}
function renderTraits(){
  const el=document.querySelector('#traits');el.innerHTML='';TRAITS.forEach(t=>{const d=document.createElement('div');d.className='trait';d.innerHTML=`<span>${t}</span><div class="bar"><i style="width:${profile[t]}%"></i></div><b>${Math.round(profile[t])}</b>`;el.appendChild(d)});
  document.querySelector('#qualities').innerHTML=(qualities().length?qualities():['Building…']).map(x=>`<span class="chip good">${x}</span>`).join('');document.querySelector('#flags').innerHTML=(flags().length?flags():['None']).map(x=>`<span class="chip bad">${x}</span>`).join('')
}
function renderHud(){
  document.querySelector('#timer').textContent=`${String(Math.floor(time/60)).padStart(2,'0')}:${String(time%60).padStart(2,'0')}`;document.querySelector('#locks').textContent=`Locks ${locks}`;document.querySelector('#score').textContent=score.toLocaleString();document.querySelector('#streak').textContent=streak;document.querySelector('#balloonsLeft').textContent=popped.filter(x=>!x).length;
  const legacy=Math.round(TRAITS.reduce((a,t)=>a+profile[t],0)/TRAITS.length);document.querySelector('#legacy').textContent=legacy;document.querySelector('#pressureBar').style.width=pressure+'%';document.querySelector('#pressureText').textContent=pressure<25?'CALM':pressure<50?'BUILDING':pressure<75?'DANGER':'CRITICAL'
}
function updatePhase(){const ph=phaseInfo();document.querySelector('#phaseLabel').textContent=ph.label;document.querySelector('#phaseHelp').textContent=ph.help}
function updateStatusLine(){
  const x=board[cursor.r][cursor.c],plans=analyzePlans();let s=`Cursor: row ${cursor.r+1}, lane ${cursor.c+1}`;
  if(x?.type==='Balloon')s+=' • Red balloon passing here — move.';else if(x?.locked)s+=` • ${x.type} is locked — SPACE unlocks it.`;else if(x)s+=` • ${x.type} passing — SPACE locks it.`;else s+=' • Empty cell — watch the flow.';
  const pair=plans.find(p=>p.size===2);if(pair)s+=` • Live 2-chain: ${pair.type}.`;document.querySelector('#statusLine').textContent=s
}
function renderDirector(){
  const plan=chooseOpportunity(),focus=inferFocus(),skill=skillFactor();let text='Balancing foundations and opportunities.';
  if(plan?.size===2)text=`Watching your ${plan.type} 2-chain and feeding possible adjacent lanes.`;else if(focus>=0)text=`Your locks suggest you may be playing toward ${people[focus].name}.`;
  if(skill<.35)text+=' Flow assistance increased.';else if(skill>.85)text+=' Challenge pressure increased.';document.querySelector('#directorText').textContent=text
}
function flashCell(r,c){const el=document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);el?.classList.add('hit')}
function toast(msg){const el=document.querySelector('#toast');el.textContent=msg;el.classList.remove('showToast');void el.offsetWidth;el.classList.add('showToast')}
function toastSmall(msg){document.querySelector('#statusLine').textContent=msg}

function endGame(){
  if(ending)return;ending=true;clearInterval(secondTimer);clearTimeout(flowTimeout);if(audio)audio.pause();document.querySelector('#game').classList.remove('active');document.querySelector('#end').classList.add('active');
  const alive=people.map((p,i)=>!popped[i]?{p,i,compat:p.prefs.reduce((s,t)=>s+profile[t],0)/3}:null).filter(Boolean).sort((a,b)=>b.compat-a.compat);let title,text;
  if(!alive.length){title='EVERY BALLOON POPPED';text='The flow got away from you. Run it back and lock with a plan.'}
  else{title=alive.length===6?'PERFECT ROOM':'FINAL COMPATIBILITY';text=`${alive[0].p.name} stayed in and finished with ${Math.round(alive[0].compat)}% profile compatibility.`}
  document.querySelector('#endTitle').textContent=title;document.querySelector('#endText').textContent=text;document.querySelector('#endStats').innerHTML=`<p>Score ${score.toLocaleString()} • Connections ${matches} • Locks ${locks} • Best streak ${maxStreak} • Balloon hits ${balloonHits}</p>`
}

document.addEventListener('keydown',e=>{
  if(!started||ending)return;const k=e.key.toLowerCase();if(['arrowleft','arrowright','arrowup','arrowdown',' ','a','d','w','s'].includes(k))e.preventDefault();
  if(k==='arrowleft'||k==='a')moveCursor(0,-1);else if(k==='arrowright'||k==='d')moveCursor(0,1);else if(k==='arrowup'||k==='w')moveCursor(-1,0);else if(k==='arrowdown'||k==='s')moveCursor(1,0);else if(k===' ')lockAtCursor()
});
document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;const a=b.dataset.act;if(a==='left')moveCursor(0,-1);if(a==='right')moveCursor(0,1);if(a==='up')moveCursor(-1,0);if(a==='down')moveCursor(1,0);if(a==='lock')lockAtCursor()});

window.addEventListener('resize',()=>{ if(document.querySelector('#game').classList.contains('active')) updateBoardGeometry(); });
