const fs=require('fs'),assert=require('assert');
const g=fs.readFileSync('../game.js','utf8');
for(const token of [
 'this.maxEnemies=8',
 'this.maxEnemyShots=8',
 'surveillance_orb',
 'censorship_bot',
 'data_miner',
 'corrupted_jammer',
 "this.spawnEnemy('runway')",
 'this.jump.active',
 'keydown-F2',
 "devJump('boss')",
 'playbackRate=1',
 'clearCombatOnly()'
]) assert(g.includes(token),token);
assert(!g.includes('signal_crawler'),'spider/crawler should not be used');
console.log('Revision 3 game tests passed');