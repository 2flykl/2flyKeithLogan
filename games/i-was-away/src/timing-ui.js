import {ZONE_COLORS,gradeAt} from './timing.js';

const $=id=>document.getElementById(id);
const clamp=(value,min=0,max=1)=>Math.max(min,Math.min(max,value));
const finite=(value,fallback=0)=>Number.isFinite(value)?value:fallback;
const names={bad:'BAD',regular:'REG',good:'GOOD',trick:'◆ TRICK'};
const panels=new WeakMap();

function setText(element,text){if(element.textContent!==text)element.textContent=text;}
function mount(panel){
 const add=(id,tag='span')=>{const element=document.createElement(tag);element.id=id;panel.append(element);return element;};
 const grade=add('timing-grade');
 const readiness=add('timing-readiness','div');
 const position=document.createElement('span'),timing=document.createElement('span');
 position.id='position-readiness';timing.id='catch-readiness';readiness.append(position,timing);
 const announcement=add('timing-announcement');
 announcement.className='meter-sr-only';announcement.setAttribute('role','status');
 announcement.setAttribute('aria-live','polite');announcement.setAttribute('aria-atomic','true');
 $('meter').setAttribute('aria-describedby','hint');
 $('needle').setAttribute('aria-hidden','true');
 panel.classList.add('timing-panel');
 const state={grade,position,timing,announcement,eventKey:'',zoneKey:'',lastReturns:0,resultSuccess:false};
 panels.set(panel,state);return state;
}

function renderZones(meter,zones,state){
 const key=JSON.stringify(zones);
 if(state.zoneKey===key)return;
 state.zoneKey=key;meter.dataset.zones=key;
 meter.querySelectorAll('.timing-zone').forEach(element=>element.remove());
 for(const zone of zones){
  const element=document.createElement('span');
  element.className='timing-zone '+zone.grade;
  element.style.left=`${zone.start*100}%`;
  element.style.width=`${(zone.end-zone.start)*100}%`;
  element.style.backgroundColor=ZONE_COLORS[zone.grade];
  element.textContent=zone.grade==='trick'?'◆':names[zone.grade];
  element.title=zone.grade==='trick'?'TRICK · precise timing':zone.grade==='regular'?'REG · regular timing':names[zone.grade];
  element.setAttribute('aria-hidden','true');meter.append(element);
 }
}

/** Render timing only. Movement, input ownership and pause state remain in main.js. */
export function renderTiming(game,world){
 const panel=$('interaction'),meter=$('meter');
 if(!panel||!meter)return;
 const state=panels.get(panel)||mount(panel);
 const flying=game.phase==='flight',result=game.phase==='result';
 const catchMeter=flying||result;
 const duration=Math.max(.001,finite(game.duration,5));
 const u=clamp(finite(game.flightTime)/duration,0,1.05);
 const catchStart=clamp(finite(game.catchStart,.78),0,.99);
 const committed=Number.isFinite(game.catchAt);
 const windowOpen=flying&&u>=catchStart;
 const catchCursor=clamp(((committed?game.catchAt:u)-catchStart)/(1-catchStart));
 const cursor=catchMeter?catchCursor:clamp(finite(game.charge));
 const zones=(catchMeter?game.catchZones:game.throwZones)||[];
 if(!zones.length)return;
 const currentGrade=gradeAt(zones,cursor);
 const distance=Math.hypot(finite(game.playerX)-finite(game.landingX),finite(game.playerZ)-finite(game.landingZ));
 const aligned=distance<finite(game.catchRadius,.48);
 const remaining=Math.max(0,(catchStart-u)*duration);
 const phaseChanged=panel.dataset.phase!==game.phase;
 if(result&&phaseChanged){
  state.resultSuccess=game.returns>state.lastReturns||/hands|perfect return/i.test(game.result||'');
  state.resultAligned=state.resultSuccess||game.result==='Let it come to you'||(game.result!=='Just out of reach'&&aligned);
  state.resultTimed=committed&&game.catchGrade!=='bad';
 }
 state.lastReturns=finite(game.returns);
 panel.dataset.phase=game.phase;
 panel.dataset.verdict=result?(state.resultSuccess?'success':'miss'):'';
 panel.dataset.window=windowOpen&&!committed?'open':'closed';
 panel.dataset.grade=committed&&catchMeter?game.catchGrade||currentGrade:currentGrade;
 panel.dataset.assist=game.assist?'on':'off';
 renderZones(meter,zones,state);
 const activeZone=zones.findIndex(zone=>zone.grade===currentGrade&&cursor>=zone.start&&(cursor<zone.end||cursor===1&&zone.end>=1));
 meter.querySelectorAll('.timing-zone').forEach((element,index)=>{
  const active=!(flying&&!windowOpen&&!committed)&&index===activeZone;
  if(element.dataset.current!==String(active))element.dataset.current=String(active);
 });
 $('needle').style.left=`${cursor*100}%`;
 meter.dataset.waiting=flying&&!windowOpen&&!committed?'true':'false';
 meter.setAttribute('aria-label',catchMeter?'Catch timing':'Throw timing');
 meter.setAttribute('aria-valuenow',String(Math.round(cursor*100)));
 meter.setAttribute('aria-valuetext',flying&&!windowOpen&&!committed?`Catch timing opens in ${remaining.toFixed(1)} seconds`:`${Math.round(cursor*100)} percent, ${currentGrade} ${catchMeter?'catch':'throw'} zone${committed?', catch committed':''}`);

 let phase='01 / THROW',prompt='Hold, then release in a good zone.',action='Hold to throw';
 let grade='FIND YOUR RHYTHM',position='Position · next',timing='Timing · hold';
 let positionReady=false,timingReady=false;
 const hasBad=zones.some(zone=>zone.grade==='bad');
 let hint=`REG steady · GOOD clean · ◆ TRICK\n${hasBad?'BAD = weak throw':'Guided timing · no BAD zone'}`;
 if(game.guided)phase+=' · GUIDED';else if(game.assist)phase+=' · ASSIST';
 if(game.phase==='charging'){
  prompt='Release in GOOD or ◆ TRICK.';action='Release to throw';
  grade=`${names[currentGrade]} THROW`;timing='Timing · release';timingReady=currentGrade!=='bad';
 }else if(game.phase==='launch'){
  phase='02 / FLIGHT';prompt='Let it fly. Find the return ring.';action='In flight';
  grade=`${names[game.throwGrade]||names[currentGrade]} THROW`;timing='Timing · wait';
 }else if(flying){
  phase=windowOpen?'03 / CATCH':'02 / GET IN POSITION';
  hint=`REG steady · GOOD clean · ◆ TRICK\n${hasBad?'BAD = missed catch':'Guided timing · no BAD zone'}`;
  position=aligned?'Position · ready ✓':`Position · move ${distance.toFixed(1)} m`;
  positionReady=aligned;
  if(committed){
   grade=`${names[game.catchGrade]||names[currentGrade]} CATCH`;
   prompt=game.catchGrade==='bad'?'BAD zone. Aim for GOOD next time.':aligned?'Catch set. Stay inside the ring.':'Catch set. Move into the ring.';
   action='Catch set';timing=game.catchGrade==='bad'?'Timing · bad zone':'Timing · set ✓';timingReady=game.catchGrade!=='bad';
  }else if(windowOpen){
   grade=`${names[currentGrade]} ZONE`;prompt=aligned?'Tap once in GOOD or ◆ TRICK.':'Step into the ring, then tap once.';
   action='Catch now';timing='Timing · tap now';timingReady=true;
  }else{
   grade=`${names[game.throwGrade]||'REG'} THROW`;
   prompt=aligned?'In position. Wait for the catch cue.':'Move into the ring with the arrows.';
   action='Wait for return';timing=`Timing · wait ${remaining.toFixed(1)} s`;
   if(game.tutorialWaiting){prompt='Find the ring. Flight waits for you.';timing='Timing · flight waits';}
  }
 }else if(result){
  phase=state.resultSuccess?'THE RETURN':'ONE MORE TRY';
  grade=state.resultSuccess?`${names[game.catchGrade]||'REG'} CATCH`:'TRY AGAIN';
  prompt=game.feedback||game.result||'Take a breath. Try again.';
  action='A moment to breathe';
  positionReady=state.resultAligned;
  timingReady=state.resultTimed;
  position=positionReady?'Position · ready ✓':'Position · missed';
  timing=timingReady?'Timing · set ✓':committed?'Timing · bad zone':'Timing · no catch';
  hint=state.resultSuccess?'A return worth keeping.\nYour photograph is ready.':'REG steady · GOOD clean · ◆ TRICK\nBAD = missed catch';
 }
 setText($('phase-label'),phase);setText($('prompt'),prompt);setText($('action'),action);
 setText($('hint'),hint);setText(state.grade,grade);
 setText(state.position,position);setText(state.timing,timing);
 state.position.dataset.ready=String(positionReady);state.timing.dataset.ready=String(timingReady);
 $('action').setAttribute('aria-label',game.phase==='ready'?'Hold Space or this button, then release to throw':game.phase==='charging'?'Release Space or this button to throw':flying&&!committed?windowOpen?'Press Space or this button once to catch':'Wait for the catch cue; move into the ring':action);
 const eventKey=`${game.phase}:${flying?(committed?'committed':windowOpen?'open':'waiting'):result?prompt:''}`;
 if(state.eventKey!==eventKey){
  state.eventKey=eventKey;
  setText(state.announcement,`${phase}. ${prompt}${flying?` ${position}. ${timing}.`:''}`);
 }
 const landing=$('landing');
 if(landing&&world?.project){
  const point=world.project(game.landingX,.035,game.landingZ);
  const edge=world.project(game.landingX+finite(game.catchRadius,.48),.035,game.landingZ);
  const far=world.project(game.landingX,.035,game.landingZ+finite(game.catchRadius,.48));
  setText(landing.querySelector('small'),aligned?'IN POSITION':`${distance.toFixed(1)} m · MOVE TO RING`);
  landing.querySelector('span').style.width=`${clamp(Math.abs(edge.x-point.x)*2,32,170)}px`;
  landing.querySelector('span').style.height=`${clamp(Math.abs(far.y-point.y)*2,14,65)}px`;
 }
}
