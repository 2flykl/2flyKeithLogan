import {renderTiming} from './timing-ui.js';
import {gradeAt} from './timing.js';
import {ReturnGame,CHAPTERS,THROW_STYLES,clamp} from './game.js';
import {World} from './world.js';
import {Soundscape} from './audio.js';
import {PhotoReel} from './photo-reel.js';
import {photoModeFor,shouldReflect,replayGoal,guideFor} from './session.js';
const $=id=>document.getElementById(id),show=(id,yes)=>$(id).classList.toggle('hidden',!yes);
const game=new ReturnGame(),audio=new Soundscape();let world,started=false,exploring=false,paused=false,complete=false,reflecting=false;
let photoPreference='flow',hasFinished=false;
const keys=new Set();let actionHeld=false,noticeUntil=0,pointer=null,returnSnap=false;
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const lines={ready:['Practice gives the moment somewhere to land.','A steady hand begins before the gesture.','Keep the care. Let go of the outcome.'],flight:['The work is yours. The flight is not.','Leave room for what you cannot steer.','Timing is attention made visible.'],caught:['The return asks you to be present.','Skill remembers what effort taught it.','Some things return changed. So do we.']};
const reel=new PhotoReel(audio,phase=>world.photographer.capture(phase),(phase,mode)=>{if(phase==='catch'&&shouldReflect(photoPreference,game.returns)){world.photographer.play('shoot');reflecting=true;show('reflection',true);document.body.classList.add('reflecting');$('throw-again').textContent=game.returns>=5?'Finish the session ↗':'Throw again ↗';$('keep-best').textContent='♡ Keep best shot';$('throw-again').focus();}syncPause();});
function say(line){$('line').textContent=line}
function notice(text){$('notice').textContent=text;$('notice').classList.add('show');noticeUntil=performance.now()+2200}
function blocked(){return paused||exploring||reel.blocking||reel.galleryOpen||reflecting||complete}
function syncPause(){game.paused=paused||exploring||reel.blocking||reel.galleryOpen||reflecting;}
function clearInput(){keys.clear();actionHeld=false;pointer=null;}
function begin(){document.activeElement?.blur();reel.reset();game.reset({tutorial:!hasFinished,assist:$('timing-assist').checked});world.photographer.reset();started=true;complete=false;paused=false;exploring=false;reflecting=false;returnSnap=false;clearInput();world.recenter();document.body.classList.remove('explore','reflecting');for(const id of ['intro','ending','pause-screen','exploring','reflection'])show(id,false);show('hud',true);syncPause();document.activeElement?.blur();audio.start().catch(()=>notice('Sound is unavailable. You can still play.'));say(lines.ready[0]);}
function throwAgain(){reflecting=false;show('reflection',false);document.body.classList.remove('reflecting');clearInput();game.phaseTime=2.6;syncPause();document.activeElement?.blur();}
function toggleExplore(value=!exploring){if(reel.blocking||reel.galleryOpen||reflecting||paused)return;clearInput();if(game.phase==='charging'){game.phase='ready';game.charge=0}exploring=value;syncPause();document.body.classList.toggle('explore',value);show('hud',started&&!value&&!complete);show('intro',!started&&!value);show('ending',complete&&!value);show('exploring',value);if(!value){world.recenter();if(started)audio.resume();}}
function togglePause(value=!paused){if(!started||complete||exploring||reel.galleryOpen)return;paused=value;clearInput();if(game.phase==='charging'){game.phase='ready';game.charge=0}syncPause();show('pause-screen',paused);paused?audio.suspend():audio.resume();if(!value)document.activeElement?.blur();}
function openReel(){if(reel.blocking||paused||exploring)return;clearInput();if(game.phase==='charging'){game.phase='ready';game.charge=0}reel.openGallery();for(const id of ['hud','reflection','ending'])$(id).inert=true;syncPause();}
function closeReel(){for(const id of ['hud','reflection','ending'])$(id).inert=false;reel.closeGallery();if(complete)reel.renderSummary($('session-sheet'));syncPause();if(started&&!paused&&!exploring&&!document.hidden)audio.resume();}
function startBurst(phase,quality,moment=null){if(reel.start(phase,game.attempts,quality,{mode:photoModeFor(photoPreference,game.attempts),moment})){actionHeld=false;if(reel.blocking)pointer=null;syncPause();}}
function down(){if(!started||blocked()||actionHeld)return;actionHeld=true;game.actionDown();}
function up(){if(!actionHeld)return;actionHeld=false;game.actionUp();}
$('timing-assist').onchange=()=>{if(!game.setAssist($('timing-assist').checked)){ $('timing-assist').checked=game.assist;notice('Timing assist can change between throws.');}};
$('photo-mode').onchange=()=>{photoPreference=$('photo-mode').value;};
$('begin').onclick=begin;$('again').onclick=begin;$('restart').onclick=begin;
$('intro-explore').onclick=()=>toggleExplore(true);$('end-explore').onclick=()=>toggleExplore(true);$('back').onclick=()=>toggleExplore(false);$('look').onclick=()=>toggleExplore();$('recenter').onclick=()=>world.recenter();$('pause').onclick=()=>togglePause();$('resume').onclick=()=>togglePause(false);
$('open-reel').onclick=openReel;$('reflect-reel').onclick=openReel;$('ending-reel').onclick=openReel;$('gallery-close').onclick=closeReel;$('throw-again').onclick=throwAgain;
$('keep-best').onclick=()=>{if(reel.favoriteBest()){$('keep-best').textContent='♥ Best shot kept';notice('Saved to your favorites.')}};
$('sound').onclick=()=>{const mute=audio.toggle();$('sound').textContent=mute?'Sound off':'Sound on';$('sound').setAttribute('aria-label',mute?'Unmute sound':'Mute sound');};
$('action').addEventListener('pointerdown',e=>{e.preventDefault();$('action').setPointerCapture(e.pointerId);down();});$('action').addEventListener('pointerup',up);$('action').addEventListener('pointercancel',()=>{actionHeld=false;if(game.phase==='charging'){game.phase='ready';game.charge=0}});
for(const [id,key] of [['left','a'],['right','d'],['forward','w'],['backward','s']]){const el=$(id);el.addEventListener('pointerdown',e=>{e.preventDefault();if(blocked())return;el.setPointerCapture(e.pointerId);keys.add(key);});for(const evt of ['pointerup','pointercancel','lostpointercapture'])el.addEventListener(evt,()=>keys.delete(key));}
addEventListener('keydown',e=>{
 if(['INPUT','SELECT','TEXTAREA'].includes(e.target?.tagName)&&e.code!=='Escape')return;
 if(reel.galleryOpen){if(e.code==='Escape'){e.preventDefault();closeReel();return;}if(e.code==='Tab'){const buttons=[...$('photo-gallery').querySelectorAll('button')];const first=buttons[0],last=buttons.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}return;}
 if(['Space','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.code)&&document.activeElement?.tagName!=='BUTTON')e.preventDefault();if(e.repeat)return;
 if(e.code==='Escape'){if(exploring)toggleExplore(false);else togglePause();return;}
 if(e.code==='KeyM'){$('sound').click();return;}
 if(e.code==='KeyV'&&started){toggleExplore();return;}
 if(e.code==='KeyR'&&started&&!blocked()){world.recenter();return;}
 if(reel.blocking&&!paused&&!exploring&&!reel.galleryOpen&&!reflecting&&['a','d','w','s','arrowleft','arrowright','arrowup','arrowdown'].includes(e.key.toLowerCase()))keys.add(e.key.toLowerCase());
 if(blocked())return;
 if(e.code==='Space'&&document.activeElement?.tagName!=='BUTTON')down();keys.add(e.key.toLowerCase());
});
addEventListener('keyup',e=>{keys.delete(e.key.toLowerCase());if(e.code==='Space')up();});
$('action').addEventListener('keydown',e=>{
 if(['INPUT','SELECT','TEXTAREA'].includes(e.target?.tagName)&&e.code!=='Escape')return;if(e.code==='Space'){e.preventDefault();down();}});$('action').addEventListener('keyup',e=>{if(e.code==='Space'){e.preventDefault();up();}});
addEventListener('blur',()=>{clearInput();if(started&&!complete&&!exploring&&!reel.galleryOpen)togglePause(true);});
document.addEventListener('visibilitychange',()=>{if(document.hidden){clearInput();if(started&&!complete&&!exploring&&!reel.galleryOpen)togglePause(true);audio.suspend();}else if(started&&!paused){audio.resume();}});
const canvas=$('world');canvas.addEventListener('pointerdown',e=>{if(paused||reel.blocking||reel.galleryOpen||reflecting||complete&&!exploring)return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);});
canvas.addEventListener('pointermove',e=>{if(pointer?.id!==e.pointerId)return;world.userLook=true;world.targetYaw-=(e.clientX-pointer.x)*.0035;world.targetPitch=clamp(world.targetPitch-(e.clientY-pointer.y)*.0028,-.18,.22);pointer.x=e.clientX;pointer.y=e.clientY;});
for(const evt of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(evt,()=>pointer=null);
canvas.addEventListener('wheel',e=>{e.preventDefault();if(!reel.blocking&&!reel.galleryOpen&&!paused){world.targetOrbitRadius=clamp(world.targetOrbitRadius+e.deltaY*.0045,4.4,8.2);world.targetFov=clamp(world.targetFov+e.deltaY*.008,46,72);}},{passive:false});canvas.addEventListener('contextmenu',e=>e.preventDefault());addEventListener('resize',()=>world?.resize());
function updateUI(){
 const u=game.flightTime/game.duration,flying=game.phase==='flight';$('chapter-number').textContent=`0${game.chapter+1} / 03`;$('chapter-name').textContent=CHAPTERS[game.chapter].name;$('wind-value').textContent=`${game.wind<0?'↖':'↗'} ${(Math.abs(game.wind)*2+1).toFixed(1)} m/s`;$('score').textContent=`${game.returns} ${game.returns===1?'RETURN':'RETURNS'}`;$('reel-count').textContent=reel.archive.length;const guide=guideFor(game);if($('session-guide').textContent!==guide)$('session-guide').textContent=guide;show('session-guide',!!guide&&!reel.blocking&&!reflecting);$('timing-assist').disabled=!['ready','result'].includes(game.phase);$('throw-style').textContent=game.phase==='charging'?THROW_STYLES[gradeAt(game.throwZones,game.charge)].hint:game.phase==='flight'?(THROW_STYLES[game.throwGrade]?.hint||''):CHAPTERS[game.chapter].lesson;
 [...$('progress').children].forEach((e,i)=>e.classList.toggle('done',i<game.returns));
 let label='FIND YOUR RHYTHM',prompt='Hold. Breathe. Release.',hint='Hold SPACE, release in the light. Press again to catch.',button='Hold to throw ↗',value=0;
 if(game.phase==='charging'){label='LET GO IN THE LIGHT';prompt=game.charge>.63&&game.charge<.83?'That’s the feeling.':'Easy does it.';hint='Release SPACE or lift your finger to throw.';button='Release to throw ↗';value=game.charge;}
 else if(game.phase==='launch'){label='LET IT GO';prompt='A little faith.';button='Watch it fly';}
 else if(flying){label=u<.5?'OUT INTO THE WORLD':u<.88?'FIND THE RETURN':'BACK WITH YOU';prompt=u<.5?'Give it room.':u<.88?'Step into the circle.':game.catchAt!==null?'Hands ready.':'Now. Bring it home.';hint=u<.88?'A / D or ← / → to step toward the return.':'Press SPACE or tap CATCH before it reaches you.';button=u<.88?'Follow the return':game.catchAt!==null?'Hands ready':'Catch';value=u;$('range').textContent=`${Math.round(game.range*Math.sin(Math.PI*Math.min(u,1)))} m from the overlook`;}
 else if(game.phase==='result'){label=game.result.includes('hands')||game.result.includes('perfect')?'THE RETURN':'ANOTHER CHANCE';prompt=game.result;hint='Take a breath. There’s time for another.';button='A moment to breathe';}
 if(innerWidth<700){if(game.phase==='ready')hint='Hold. Release in the light. Tap to catch.';else if(game.phase==='charging')hint='Lift your finger to throw.';else if(flying)hint=u<.88?'Step with the arrows toward the circle.':'Tap Catch before it reaches you.';}
 $('phase-label').textContent=label;$('prompt').textContent=prompt;$('hint').textContent=hint;$('action').textContent=button;$('action').disabled=game.phase==='result'||game.phase==='launch'||blocked();$('fill').style.width=`${value*100}%`;$('meter').setAttribute('aria-valuenow',String(Math.round(value*100)));$('meter').setAttribute('aria-label',flying?'Return progress':'Throw charge');$('meter').querySelector('.sweet').style.left=flying?'88%':'63%';$('meter').querySelector('.sweet').style.width=flying?'12%':'20%';
 const point=world.project(game.landingX,.035,game.landingZ);const catchRadius=game.catchRadius??.48;show('landing',flying&&point.visible&&!exploring&&!reel.blocking);$('landing').style.left=point.x+'px';$('landing').style.top=point.y+'px';$('landing').style.opacity=Math.hypot(game.playerX-game.landingX,game.playerZ-game.landingZ)<catchRadius?'1':'.86';$('landing').classList.toggle('aligned',Math.hypot(game.playerX-game.landingX,game.playerZ-game.landingZ)<catchRadius);if(!flying)$('range').textContent='A little patience goes a long way.';
}
function handleEvents(){for(const e of game.events){world.photographer.onEvent(e.type,game);
 if(e.type==='release'){world.recenter();returnSnap=false;audio.releaseGrade(game.throwGrade);startBurst('release',e.quality);}
 if(e.type==='launch'){audio.whoosh();say(lines.flight[game.chapter]);}
 if(e.type==='early')notice('Not yet. Get into position; tap when the catch needle moves.');
 if(e.type==='guide-position')notice('First return: the flight waits while you find the ring.');
 if(e.type==='guide-catch'||e.type==='catch-window')audio.cue();
 if(e.type==='catch-commit'){audio.commit(e.grade);notice(e.grade==='bad'?'Red zone. This timing missed.':e.aligned?'Timing set. Stay inside the ring.':'Timing set. Move into the ring before it arrives.');}
 if(e.type==='caught'){audio.tick(e.perfect);say(lines.caught[game.chapter]);startBurst('catch',e.perfect?1:.85,e.moment);}
 if(e.type==='miss'){say(game.feedback);}
 if(e.type==='ready'){say(lines.ready[game.chapter]);audio.chapter(game.chapter);}
 if(e.type==='complete'){complete=true;hasFinished=true;audio.finish();reel.renderSummary($('session-sheet'));$('replay-goal').textContent=replayGoal(game.history).text;show('hud',false);show('ending',true);$('end-stats').textContent=`${game.perfect} PERFECT · ${game.attempts} THROWS · ${reel.archive.length} FRAMES`;try{const best=Number(localStorage.getItem('iwa-best'))||0;localStorage.setItem('iwa-best',String(Math.max(best,game.perfect)));}catch{}}
 }game.events.length=0;}
try{
 world=new World(canvas);await world.load(p=>{document.querySelector('.load-line i').style.width=`${p*80}%`;});$('load-label').textContent='Loading the contact sheets…';await reel.load();show('loading',false);show('intro',true);world.recenter();let last=performance.now();
 function frame(now){requestAnimationFrame(frame);const dt=Math.min((now-last)/1000,.05);last=now;
  if(started&&!exploring&&!paused&&!reel.galleryOpen){syncPause();if(!reel.blocking&&!reflecting){game.step(dt,(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0));handleEvents();if(game.phase==='flight'&&game.flightTime/game.duration>=.48)startBurst('apex',game.spin);if(game.phase==='flight'&&game.flightTime/game.duration>.8&&!returnSnap){returnSnap=true;audio.shutter('return',0);world.photographer.capture('return');}audio.update(game.phase==='flight'?game.flightTime/game.duration:0);}reel.update(dt);syncPause();}
  if(!paused){if(!blocked()){if(keys.has('q'))world.targetYaw+=dt*.6;if(keys.has('e'))world.targetYaw-=dt*.6;}world.update(dt,game,{intro:!started,exploring,reduced,cutaway:reel.blocking,frozen:reel.galleryOpen});}
  document.documentElement.style.setProperty('--song-energy',reduced?'0':String(audio.energy||0));
  if(started&&!complete){updateUI();renderTiming(game,world);}if(now>noticeUntil)$('notice').classList.remove('show');
 }requestAnimationFrame(frame);
 if(new URLSearchParams(location.search).has('qa'))window.__iwa={snapshot:()=>({...game.snapshot(),camera:{yaw:world.yaw,pitch:world.pitch,fov:world.fov},textures:world.renderer.info.memory.textures,drawCalls:world.renderer.info.render.calls,textureMiB:Math.round(world.textureBytes/1048576),panorama:world.compactTexture?4096:8192,characterPose:world.player.key,photographer:{...world.photographer.snapshot(),direction:world.photoDirection,animated:world.photoAnimated},reel:reel.snapshot(),reflecting,sound:{state:audio.ctx?.state,muted:audio.muted},started,exploring,paused})};
}catch(error){console.error(error);$('load-label').textContent='This browser could not open the 3D scene. Try a browser with WebGL enabled, or reload.';$('retry').hidden=false;}



