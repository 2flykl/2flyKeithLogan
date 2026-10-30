import {ROOF_Y,ROOF_LEDGES,BALCONY_Y} from './rooftop-route.js';
import * as T from './vendor/three.module.min.js';
// Quiet, occasional scenes in three of the fifteen apartment windows.
export function createApartmentLife(scene,kit){
 const {cube,ball}=kit,windows=[];
 for(const [x,y,kind,offset] of [[-8,6.3,'cat',0],[8,11.3,'curtains',6],[0,21.3,'reader',12]]){
  const canvas=document.createElement('canvas');canvas.width=240;canvas.height=320;const ctx=canvas.getContext('2d'),map=new T.CanvasTexture(canvas);map.colorSpace=T.SRGBColorSpace;
  const mesh=new T.Mesh(new T.PlaneGeometry(1.85,2.25),new T.MeshBasicMaterial({map,transparent:true,toneMapped:false}));mesh.position.set(x,y,-1.66);scene.add(mesh);windows.push({ctx,map,kind,offset,last:-1});
 }
 // Taller side returns and a rear rail frame her balcony; the front stays open to camera.
 const steel=0x424954;
 for(const x of [2.1,9.9]){for(const z of [-1.3,-.4,.5,1.4,2.3,3.2])cube(x,BALCONY_Y+.75,z,.055,1.5,.055,steel);cube(x,BALCONY_Y+1.52,1,.075,.075,4.6,steel);}
 for(const [a,b] of [[2.1,3.5],[7.5,9.9]]){cube((a+b)/2,BALCONY_Y+1.52,-1.25,b-a,.075,.075,steel);for(let x=a;x<=b;x+=.45)cube(x,BALCONY_Y+.75,-1.25,.045,1.5,.045,steel);}
 // Apartment crown and rooftop terrace are above the existing top cornice.
 const rooftop=new T.Group();scene.add(rooftop);cube(1,28.8,0,21,.4,8,0x696575,rooftop);cube(-7,30.4,-2.2,3,2.8,2.2,0x5b4856,rooftop);cube(-7,29.9,-1.05,1.25,1.8,.1,0x292c3b,rooftop);
 for(let x=-9;x<=11;x+=.7)cube(x,29.65,-2.8,.045,1.3,.045,steel,rooftop);cube(1,30.3,-2.8,20,.06,.06,steel,rooftop);
 for(const x of [-8,10]){cube(x,29.3,1.8,.8,.6,.8,0x9f7566,rooftop);for(let i=0;i<16;i++){const a=i*2.4,leaf=ball(x+Math.sin(a)*.28,29.9+(i%4)*.12,1.8+Math.cos(a)*.28,1,i%2?0x405d4e:0x63765b,rooftop);leaf.scale.set(.12,.55,.085);leaf.rotation.z=Math.sin(a)*.65;}}
 for(let x=-6;x<10;x+=1.8){const bulb=ball(x,32-Math.sin((x+6)/16*Math.PI)*.7,-1.8,.085,0xffda92,rooftop);bulb.material=new T.MeshBasicMaterial({color:0xffdba1});}
 const cablePoints=[];for(let i=0;i<=40;i++){const x=-6+i*.4;cablePoints.push(new T.Vector3(x,32-Math.sin((x+6)/16*Math.PI)*.7,-1.8));}rooftop.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(cablePoints),40,.018,5,false),new T.MeshStandardMaterial({color:0x242931})));
 for(const x of [-6,10])cube(x,30.5,-1.8,.055,3,.055,steel,rooftop);
 cube(-7,31.86,-2.2,3.3,.16,2.5,0x292e39,rooftop);for(const x of [-7.7,-6.3])cube(x,29.95,-.98,.08,1.95,.08,0x9f8f74,rooftop);cube(-7,30.94,-.98,1.5,.09,.08,0x9f8f74,rooftop);ball(-6.6,29.9,-.88,.055,0xc9a767,rooftop);
 rooftop.position.y=ROOF_Y-29;
 const motes=new T.BufferGeometry(),positions=new Float32Array(36*3);for(let i=0;i<36;i++){positions[i*3]=(i*7.31%22)-11;positions[i*3+1]=3+(i*3.77%28);positions[i*3+2]=1.8+(i%3)*.3;}motes.setAttribute('position',new T.BufferAttribute(positions,3));const dust=new T.Points(motes,new T.PointsMaterial({color:0xffdfb5,size:.035,transparent:true,opacity:.27,depthWrite:false}));scene.add(dust);
 const routeLights=[];for(const [x,y] of [[-3,BALCONY_Y],...ROOF_LEDGES.map(p=>[p.x,p.y])]){const light=new T.PointLight(0xffcc83,2.5,4);light.position.set(x,y+.35,1);scene.add(light);const strip=cube(x,y+.06,2,.5,.035,.12,0xe6c28b);if(y>24){routeLights.push(light,strip);light.visible=strip.visible=false;}}
 function update(t){dust.rotation.y=Math.sin(t*.035)*.035;dust.position.y=Math.sin(t*.2)*.1;for(const w of windows){const step=Math.floor(t*8);if(step===w.last)continue;w.last=step;const c=w.ctx,cycle=(t+w.offset)%24;c.clearRect(0,0,240,320);c.fillStyle='#b49a6d';c.globalAlpha=.68;c.fillRect(0,0,240,320);c.globalAlpha=1;c.fillStyle='#292634';
  if(w.kind==='cat'){const shift=cycle<5?Math.sin(cycle/5*Math.PI)*13:0;c.beginPath();c.ellipse(126+shift,256,39,29,0,0,Math.PI*2);c.fill();c.beginPath();c.arc(100+shift,220,23,0,Math.PI*2);c.fill();c.beginPath();c.moveTo(79+shift,213);c.lineTo(81+shift,184);c.lineTo(99+shift,201);c.lineTo(117+shift,183);c.lineTo(121+shift,213);c.fill();c.strokeStyle='#292634';c.lineWidth=10;c.beginPath();c.moveTo(151+shift,267);c.bezierCurveTo(208,277,212,234+Math.sin(t)*5,188,235);c.stroke();}
  else if(w.kind==='curtains'){const close=cycle<5?cycle/5:cycle<15?1:cycle<20?1-(cycle-15)/5:0;c.beginPath();c.arc(133,114,20,0,Math.PI*2);c.fill();c.fillRect(116,132,35,110);c.fillStyle='#554253';c.fillRect(0,0,29+close*91,320);c.fillRect(211-close*91,0,29+close*91,320);c.strokeStyle='#2c2936';c.lineWidth=2;for(let x=8;x<240;x+=16){if(x<29+close*91||x>211-close*91){c.beginPath();c.moveTo(x,0);c.lineTo(x,320);c.stroke();}}}
  else{c.beginPath();c.arc(112,150+Math.sin(t*.3)*2,21,0,Math.PI*2);c.fill();c.fillRect(92,169,39,85);c.fillStyle='#453943';c.save();c.translate(143,205);c.rotate(-.18);c.fillRect(-15,-22,47,38);c.restore();c.fillStyle='#292634';c.fillRect(54,260,135,10);}
  c.fillStyle='#564c48';c.fillRect(116,0,8,320);c.fillRect(0,150,240,7);w.map.needsUpdate=true;}}
 return {update,rooftop,setChase(active){routeLights.forEach(o=>o.visible=active);},reset(){rooftop.visible=true;}};
}
