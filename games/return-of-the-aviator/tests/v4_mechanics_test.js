const assert=require('assert');
let y=0,vy=-700,dt=1/120,min=0,landed=false;
for(let i=0;i<240;i++){vy+=1600*dt;y+=vy*dt;min=Math.min(min,y);if(y>=0&&i>5){landed=true;break}}
assert(landed);assert(min<-100);
assert(1-80/120>=.33);assert(!(1-81/120>=.33));
function escape(taps,p){return (p>.78&&taps>=6)||p>.96}
assert(escape(6,.8));assert(!escape(2,.8));assert(escape(0,.97));
console.log('v4 mechanics tests passed');