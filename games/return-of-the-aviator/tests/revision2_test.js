const fs=require('fs'),assert=require('assert');const g=fs.readFileSync('../game.js','utf8');
for(const x of ['this.maxEnemies=12','this.maxEnemyShots=16','playbackRate=1',"this.spawnBots('runway')",'this.jump.active','rnd(2.5,4.0)','this.clearCombat()'])assert(g.includes(x),x);
console.log('Revision 2 tests passed');