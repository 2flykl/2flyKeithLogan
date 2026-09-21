export const WEAPONS = Object.freeze([
 {id:'cd',name:'CD Double Barrel',tag:'TWIN DISC / TWO-SHOT PUNCH',color:0x6bf2fa,ammo:2,reload:1.25,cooldown:.32,damage:44,pellets:5,spread:.024,kick:.12},
 {id:'tempest',name:'Tambourine Tempest',tag:'JINGLE ENGINE / FULL AUTO',color:0xffcf68,ammo:18,reload:1.45,cooldown:.115,damage:38,pellets:1,spread:0,kick:.035},
 {id:'808',name:'808 Blaster',tag:'LOW FREQUENCY / HEAVY IMPACT',color:0xff788c,ammo:3,reload:1.9,cooldown:.85,damage:155,pellets:1,spread:0,kick:.19}
]);
export function newRun(practice=false){return {practice,time:0,score:0,shots:0,hits:0,broken:0,streak:0,maxStreak:0,lastHit:-10,hazards:0,bullseyes:0,expired:0,stage:0};}
export function multiplier(s){return Math.min(5,1+Math.floor(s/4));}
export function accuracy(r){return r.shots?Math.round(r.hits/r.shots*100):100;}
export function rank(s){return s>=14000?['S','MASS PRODUCTION']:s>=8500?['A','HEADLINER']:s>=4000?['B','HEAVY ROTATION']:['C','SOUNDCHECK'];}
export function award(r,{kills=0,bullseye=false,bonus=false,hazard=false,hit=false}){if(hazard){r.score=Math.max(0,r.score-200);r.hazards++;r.streak=0;}if(!hit){r.streak=0;return 0;}r.hits++;r.streak=hazard?0:r.streak+1;r.maxStreak=Math.max(r.maxStreak,r.streak);r.lastHit=r.time;r.broken+=kills;if(bullseye)r.bullseyes++;const p=Math.round((50+kills*100)*(bullseye?1.5:1)*(bonus?2:1)*multiplier(r.streak));r.score+=p;return p;}
export function seeded(seed){let n=seed>>>0;return ()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};}
// XY record planes share precisely the same centers and radii as rendered geometry.
export function intersectDisc(o,d,targets){let best=null;for(const t of targets){if(t.dead||Math.abs(d.z)<1e-8)continue;const distance=(t.z-o.z)/d.z;if(distance<=0||(best&&distance>=best.distance))continue;const x=o.x+d.x*distance,y=o.y+d.y*distance;const r=Math.hypot(x-t.x,y-t.y);if(r<=t.radius)best={target:t,distance,point:{x,y,z:t.z},bullseye:r<t.radius*.3};}return best;}
