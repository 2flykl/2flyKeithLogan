import {ZONE_COLORS,gradeAt} from './timing.js';
const $=id=>document.getElementById(id),clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
export function renderTiming(game,world){
 const flying=game.phase==='flight',u=game.flightTime/game.duration,zones=flying?game.catchZones:game.throwZones,key=JSON.stringify(zones);
 if($('meter').dataset.zones!==key){$('meter').dataset.zones=key;$('meter').querySelectorAll('.timing-zone').forEach(e=>e.remove());for(const z of zones){const el=document.createElement('span');el.className='timing-zone '+z.grade;el.style.left=z.start*100+'%';el.style.width=(z.end-z.start)*100+'%';el.style.background=ZONE_COLORS[z.grade];el.textContent=z.grade==='trick'?'◆':z.grade==='regular'?'REG':z.grade.toUpperCase();$('meter').append(el);}}
 const cursor=flying?clamp((u-.78)/.22,0,1):game.charge;
 $('needle').style.left=cursor*100+'%';$('meter').setAttribute('aria-valuenow',String(Math.round(cursor*100)));$('meter').setAttribute('aria-valuetext',`${Math.round(cursor*100)} percent, ${gradeAt(zones,cursor)} zone`);
 if(game.phase==='ready'){$('hint').textContent='Release: red = weak · gray = regular · green = good · ◆ = trick';$('prompt').textContent='Read the rhythm.';}
 if(game.phase==='charging'){$('prompt').textContent=gradeAt(zones,cursor).toUpperCase()+' THROW';$('hint').textContent='Release in your chosen zone. New layout each throw.';}
 if(game.phase==='result'&&game.result.includes('hands'))$('prompt').textContent=game.catchGrade==='good'?'A clean, good catch.':'Back in your hands.';
 if(game.phase==='result'&&game.result.includes('perfect'))$('prompt').textContent='Trick catch — a perfect return.';
 if(flying){$('prompt').textContent=game.catchAt!==null?(game.catchGrade==='bad'?'Mistimed.':game.catchGrade.toUpperCase()+' CATCH'):u<.78?'Find the return circle.':'Choose your catch.';$('hint').textContent=u<.78?'W A S D / arrows: step into the circle.':'Tap: red = miss · gray = regular · green = good · ◆ = trick';$('action').textContent=u<.78?'Get into position':game.catchAt!==null?'Catch committed':'Catch';}
 const distance=Math.hypot(game.playerX-game.landingX,game.playerZ-game.landingZ),point=world.project(game.landingX,.035,game.landingZ);
 $('landing').querySelector('small').textContent=distance<game.catchRadius?'IN POSITION · TIME IT':`${distance.toFixed(1)} m · MOVE TO THE RING`;
 const edge=world.project(game.landingX+game.catchRadius,.035,game.landingZ),far=world.project(game.landingX,.035,game.landingZ+game.catchRadius);
 $('landing').querySelector('span').style.width=clamp(Math.abs(edge.x-point.x)*2,32,170)+'px';$('landing').querySelector('span').style.height=clamp(Math.abs(far.y-point.y)*2,14,65)+'px';
}
