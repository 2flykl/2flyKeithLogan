const fs=require('fs'),assert=require('assert');
const g=fs.readFileSync('../game-rev5.js','utf8');
const h=fs.readFileSync('../index.html','utf8');
for(const t of [
 "this.clockT+=dt",
 "ensureAudio(force=false)",
 "this.hero.setVisible(false)",
 "plane_idle",
 "plane_burn",
 "plane_explode",
 "this.bg.tilePositionY-=185*dt",
 "this.bg.tilePositionY+=(!this.turnBack?320:-250)*dt",
 "this.bg.tilePositionY+=480*dt",
 "THE GRAND // PIANO TANK",
 "this.setHeroHeight(205)",
 "const readyPoll=setInterval"
]) assert(g.includes(t),t);
assert(h.includes('game-rev5.js?v=5.0.0'));
assert(h.includes('LOADING FLIGHT SYSTEMS'));
assert(!h.includes('src="game.js"'));
console.log('Revision 5 static tests passed');
