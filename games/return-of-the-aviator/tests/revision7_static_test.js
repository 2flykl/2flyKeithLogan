const fs=require('fs'),assert=require('assert');
const g=fs.readFileSync('../game-rev7.js','utf8');
for(const t of ['const clamp=', 'lerp=', "['intro',17]", "['dive',43]", "['land',7]", "['runway',51]", "['grand',10]", "['maze',55]", "['stormJump',8]", "['boss',58]", "['ending',7]", 'vehicle.airT', 'rampTimes', 'syncAudio()', 'camTarget']) assert(g.includes(t),t);
assert(!g.includes('Phaser.'),'Revision 7 must not depend on Phaser');
console.log('Revision 7 static tests passed');
