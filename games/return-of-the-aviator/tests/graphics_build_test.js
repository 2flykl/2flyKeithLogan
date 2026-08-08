const fs=require('fs'),assert=require('assert');
const game=fs.readFileSync('../game.js','utf8');
for(const token of ['Phaser.WEBGL',"phase==='dive'","phase==='runway'","phase==='car'","phase==='boss'",'algorithm_boss','hero_car','bg_boss_storm']) assert(game.includes(token),token);
console.log('Graphics overhaul static tests passed');
