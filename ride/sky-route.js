import * as THREE from './vendor/three.module.min.js';

export const SKY_SECTION = 576;
const CYCLE = SKY_SECTION * 7;
const loops = [{chapter:0,start:112,radius:34,drift:58},{chapter:2,start:72,radius:42,drift:62},{chapter:6,start:110,radius:30,drift:58}].map(l=>({...l,from:l.chapter*SKY_SECTION+l.start,length:Math.PI*2*l.radius+l.drift}));
const spirals=[{chapter:3,start:30,radius:30,drift:60,height:80,direction:1},{chapter:5,start:80,radius:26,drift:56,height:65,direction:-1}].map(l=>({...l,from:l.chapter*SKY_SECTION+l.start,length:Math.PI*4*l.radius+l.drift,spiral:true}));
const features=[...loops,...spirals].sort((a,b)=>a.from-b.from);
const cycleOffset = features.reduce((sum,l)=>sum+l.length-l.drift,0);
export const skyEase=(a,b,x)=>{const t=THREE.MathUtils.clamp((x-a)/(b-a),0,1);return t*t*t*(t*(t*6-15)+10);};
const bump=(a,b,c,d,x)=>skyEase(a,b,x)-skyEase(c,d,x);

// The loop's forward drift makes it a true three-dimensional loop, not an
// overlapping circle. Position and tangent agree with the road at both joins.
export function sampleSkyRoute(s){
  const cycle=Math.floor(s/CYCLE),local=s-cycle*CYCLE,chapter=Math.floor(local/SKY_SECTION),phase=(local%SKY_SECTION)/SKY_SECTION;
  let x=62*Math.sin(s/290)+19*Math.sin(s/113),y=92+5*Math.sin(s/210),z=-s+cycle*cycleOffset,loop=false,spiral=false;
  for(const l of features){
    if(local>=l.from+l.length){z+=l.length-l.drift;continue;}
    if(local>=l.from){const t=(local-l.from)/l.length,a=t*Math.PI*(l.spiral?4:2);z+=(l.length-l.drift)*t-l.radius*Math.sin(a);if(l.spiral){x+=l.direction*l.radius*(1-Math.cos(a));spiral=true;}else{y+=l.radius*(1-Math.cos(a));loop=true;}}
  }
  if(chapter===0)y-=29*bump(.73,.83,.89,.995,phase);
  if(chapter===1)y+=26*bump(.1,.3,.46,.64,phase)-34*bump(.55,.74,.84,.99,phase);
  if(chapter===2)y+=28*bump(.7,.79,.87,.995,phase);
  if(chapter===3||chapter===5){
    const helix=spirals.find(l=>l.chapter===chapter);y-=helix.height*bump(helix.start/SKY_SECTION,(helix.start+helix.length)/SKY_SECTION,.85,.999,phase);
  }
  if(chapter===4)y+=54*bump(.1,.3,.4,.55,phase)-48*bump(.48,.67,.79,.995,phase);
  if(chapter===6)y-=31*bump(.75,.85,.9,.999,phase);
  const fall=(chapter===0||chapter===6)?bump(.73,.79,.86,.93,phase):chapter===1?bump(.59,.68,.74,.8,phase):chapter===4?bump(.51,.6,.68,.76,phase):0;
  const transition=bump(.915,.955,.978,1,phase);
  const airborne=(chapter===0&&phase>.77&&phase<.86)||(chapter===4&&phase>.54&&phase<.63)||(chapter===6&&phase>.78&&phase<.85);
  return {p:new THREE.Vector3(x,y,z),chapter,phase,loop,spiral,airborne,mist:Math.max(fall,transition*.8),maneuver:airborne?'CLOUD FREEFALL':loop?'LOOP THE SKY':spiral?'SPIRAL DOWN':fall>.2?'THROUGH THE CLOUDS':transition>.1?'INTO THE NEXT WORLD':'FOLLOW THE FEELING'};
}

export function skyRouteFrame(s){
  const sample=sampleSkyRoute(s),t=sampleSkyRoute(s+.12).p.sub(sampleSkyRoute(s-.12).p).normalize();
  let right;
  if(sample.loop){right=new THREE.Vector3(1,0,0).addScaledVector(t,-t.x).normalize();}
  else right=new THREE.Vector3().crossVectors(t,new THREE.Vector3(0,1,0)).normalize();
  const bank=sample.loop?0:THREE.MathUtils.clamp(-t.x*.18,-.21,.21);
  right.applyAxisAngle(t,bank);const up=new THREE.Vector3().crossVectors(right,t).normalize();
  return {...sample,t,right,up,bank};
}
