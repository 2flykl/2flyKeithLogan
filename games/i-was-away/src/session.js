// Small, deterministic policies shared by UI and regression tests.
export function photoModeFor(preference,attempt){return preference==='cinematic'||attempt===1?'cinematic':'compact'}
export function shouldReflect(preference,returns){return preference==='cinematic'||returns===1}
export function replayGoal(history){
 const perfect=history.filter(r=>r.perfect).length;
 if(perfect===0)return {text:'Next moment: find one gold trick catch.',target:1};
 if(perfect<5)return {text:`Next moment: bring home ${Math.min(5,perfect+1)} perfect returns.`,target:Math.min(5,perfect+1)};
 return {text:'Next moment: five clean returns with timing assist off.',target:5};
}
export function guideFor(game){
 if(!game.guided)return '';
 if(game.phase==='ready')return '1 / 3 · Hold Space or the throw button. Release in green for a steady first flight.';
 if(game.phase==='charging')return '1 / 3 · Let go in green. The first layout stays familiar.';
 if(game.phase==='launch')return '2 / 3 · Your return ring is next. Use A / D or the arrow controls to step into it.';
 if(game.phase==='flight'&&game.tutorialWaiting)return '2 / 3 · No rush. The flight is waiting while you move into the ring.';
 if(game.phase==='flight'&&game.flightTime/game.duration<game.catchStart)return '2 / 3 · Step into the ring. It will brighten when you are in position.';
 if(game.phase==='flight')return '3 / 3 · Stay in the ring. Tap Space or Catch as the white needle crosses a safe zone.';
 return '';
}
