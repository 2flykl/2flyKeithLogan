import * as T from './vendor/three.module.min.js';
// Cinematic scenery never enters the platform collision list.
export function createSlamEffects(scene,y){
 const lamps=[],rubble=new T.Group();scene.add(rubble);rubble.visible=false;
 const brass=new T.MeshStandardMaterial({color:0x87704c,metalness:.7,roughness:.35});
 for(const [x,h] of [[3.7,y+2],[8.5,y+2],[-8,y+4],[10,y+7]]){
  const bulb=new T.Mesh(new T.SphereGeometry(.17,12,8),new T.MeshStandardMaterial({color:0xffdca1,emissive:0xffbd65,emissiveIntensity:2}));bulb.position.set(x,h,-.7);scene.add(bulb);
  const light=new T.PointLight(0xffbe77,7,6);light.position.copy(bulb.position);scene.add(light);lamps.push({bulb,light});
 }
 for(let i=0;i<76;i++){const chip=new T.Mesh(new T.BoxGeometry(.07+i%4*.055,.06+i%3*.06,.1),new T.MeshStandardMaterial({color:i%3?0xa28b73:0x473b36,roughness:.9}));rubble.add(chip);}
 const falling=new T.Group();scene.add(falling);falling.visible=false;
 const slab=new T.Mesh(new T.BoxGeometry(3.4,.24,1.8),new T.MeshStandardMaterial({color:0x6f6253,roughness:.8}));falling.add(slab);
 for(const x of [-1.5,0,1.5]){const post=new T.Mesh(new T.CylinderGeometry(.035,.035,.8,8),brass);post.position.set(x,.45,.7);falling.add(post);}
 const bar=new T.Mesh(new T.BoxGeometry(3.4,.055,.06),brass);bar.position.set(0,.85,.7);falling.add(bar);
 function update(age){const active=age>=0;rubble.visible=active&&age<2;falling.visible=active&&age<2;
  rubble.children.forEach((p,i)=>{const a=Math.max(0,age-i%5*.025);p.position.set(6+Math.sin(i*2.39)*a*(3+i%7),y+1.8+Math.cos(i*1.31)*a*5-5*a*a,.2+i%6*.23);p.rotation.set(a*(i%5),a*2,a*(i%7));});
  falling.position.set(10.9-age*.8,y+11-11*age*age,1.8);falling.rotation.set(age*.3,age*.16,-age*.55);
  lamps.forEach(({bulb,light},i)=>{const pulse=!active?1:age>1.1?(i===1||i===3?0:1):globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches?1:Math.sin(age*16+i*2)>-.1?1:.15;light.intensity=7*pulse;bulb.material.emissiveIntensity=2*pulse;});
 }
 return {update,reset:()=>update(-1)};
}
