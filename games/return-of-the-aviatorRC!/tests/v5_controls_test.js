const assert=require('assert');
function steer(x,y,h,v,dt=.016){
  let vx=h*460,vy=v*380;
  return {x:Math.max(90,Math.min(1190,x+vx*dt)),y:Math.max(110,Math.min(590,y+vy*dt))}
}
let p=steer(640,300,1,1);assert(p.x>640&&p.y>300);
p=steer(640,300,-1,-1);assert(p.x<640&&p.y<300);
function roadY(y,v,dt=.016){return Math.max(374.4,Math.min(633.6,y+v*260*dt))}
assert(roadY(560,-1)<560);assert(roadY(560,1)>560);
console.log('v5 free-movement tests passed');