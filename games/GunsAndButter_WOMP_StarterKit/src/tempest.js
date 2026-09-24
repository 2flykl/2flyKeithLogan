export function buildTempest(T,A){
 const {scene,mesh,box,cyl,ring,rod,round,batch}=A;
 const steel=new T.MeshStandardMaterial({color:0x566270,roughness:.28,metalness:.91});
 const gold=new T.MeshPhysicalMaterial({color:0xe9b849,roughness:.23,metalness:.88,clearcoat:.6});
 const black=new T.MeshPhysicalMaterial({color:0x17212c,roughness:.3,metalness:.7,clearcoat:.45});
 const blue=new T.MeshStandardMaterial({color:0x079ec1,emissive:0x00749a,emissiveIntensity:.55,metalness:.55,roughness:.24});
 const M={steel,edge:steel,dark:black,black,brass:gold,concrete:black,wall:black,red:gold,blue,leather:black,skin:black,cloth:black};
 const surface=document.createElement('canvas');surface.width=surface.height=512;const paint=surface.getContext('2d');paint.fillStyle='#aaaaaa';paint.fillRect(0,0,512,512);
 let seed=2026;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 for(let i=0;i<6000;i++){paint.strokeStyle=`rgba(${i%2?'240,240,240':'30,30,30'},${.015+random()*.06})`;paint.lineWidth=.3+random()*.4;const x=random()*512,y=random()*512;paint.beginPath();paint.moveTo(x,y);paint.lineTo(x+random()*65,y+random()*1.2);paint.stroke();}
 const brushed=new T.CanvasTexture(surface);brushed.wrapS=brushed.wrapT=T.RepeatWrapping;brushed.repeat.set(2,2);steel.bumpMap=brushed;steel.bumpScale=.002;
 const root=new T.Group();scene.add(root);
 const {models}=buildReferenceWomps(T,{...A,weaponRoot:root,materials:M,lights:{cyan:blue,amber:gold,red:gold,white:steel},onlyIndex:1,displayOnly:true});
 const model=models[0],g=model.g;g.visible=true;g.scale.setScalar(1.28);g.position.set(0,1.48,-6.3);g.rotation.y=Math.PI;
 g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;if(o.material.emissiveIntensity)o.material.emissiveIntensity=Math.min(o.material.emissiveIntensity,.6);if(!o.material.map){o.material.bumpMap=brushed;o.material.bumpScale=.0015;o.material.roughnessMap=brushed;o.material.roughness=.48;}}});
 const detailing=new T.Group();g.add(detailing);
 for(const side of [-1,1]){
  for(let i=0;i<12;i++){const socket=new T.Group();detailing.add(socket);socket.position.set(side*.16,-.09,.15+i*.064);socket.rotation.y=side*Math.PI/2;cyl(socket,steel,.012,.01);box(socket,black,.013,.002,.012,0,0,.006);}
  for(let i=0;i<6;i++){round(detailing,steel,.024,.012,.06,.004,side*.125,.078,-.66+i*.09);}
  const cablePath=new T.CatmullRomCurve3([new T.Vector3(side*.18,-.12,.13),new T.Vector3(side*.25,-.34,.25),new T.Vector3(side*.25,-.4,.55),new T.Vector3(side*.15,-.27,.79)]);
  mesh(new T.TubeGeometry(cablePath,32,.012,8,false),black,detailing);
  for(let i=0;i<12;i++){const q=cablePath.getPoint(i/11),collar=ring(detailing,steel,.013,.003,...q.toArray());collar.lookAt(q.clone().add(cablePath.getTangent(i/11)));}
  rod(detailing,steel,[side*.185,-.115,.22],[side*.185,-.115,.9],.014);
  for(const z of [.24,.55,.88]){const clamp=new T.Group();detailing.add(clamp);clamp.position.set(side*.185,-.115,z);cyl(clamp,gold,.024,.055);}
  for(let i=0;i<11;i++){const screw=new T.Group();detailing.add(screw);screw.position.set(side*.151,.065,.17+i*.067);screw.rotation.y=side*Math.PI/2;cyl(screw,steel,.006,.005);}
  for(const z of [.245,.27,.295,.32,.46,.485,.51,.535])ring(detailing,steel,.069,.003,0,.29,z);
 }batch(detailing);
 // Independent carriage, indexing wheel, paired jingles, loading cassette and spring.
 const carrier=new T.Group();g.add(carrier);carrier.position.set(0,.185,.64);
 round(carrier,steel,.115,.04,.27,.01);for(let j=0;j<5;j++)box(carrier,black,.118,.01,.018,0,.025,-.11+j*.055);
 const cassette=new T.Group();g.add(cassette);cassette.position.set(-.215,-.21,.57);cassette.rotation.y=-Math.PI/2;
 cyl(cassette,black,.184,.12);ring(cassette,gold,.185,.012,0,0,.065);ring(cassette,gold,.135,.008,0,0,.067);
 const rounds=[];
 function jingle(parent,r=.04){const p=[new T.Vector2(r*.15,-.008),new T.Vector2(r*.3,-.007),new T.Vector2(r*.55,.005),new T.Vector2(r*.85,.009),new T.Vector2(r,.003)];const a=mesh(new T.LatheGeometry(p,24),gold,parent);a.rotation.x=Math.PI/2;const b=a.clone();parent.add(b);b.rotation.x=-Math.PI/2;b.position.z=.012;return [a,b];}
 for(let i=0;i<18;i++){const a=i*Math.PI*2/18,p=new T.Group();cassette.add(p);p.position.set(Math.cos(a)*.151,Math.sin(a)*.151,.076);jingle(p,.025);rounds.push(p);}
 const jingles=[];for(let i=0;i<9;i++){const a=i*Math.PI*2/9,p=new T.Group();g.add(p);p.position.set(-.055,-.27+Math.sin(a)*.185,-.055+Math.cos(a)*.185);p.rotation.y=Math.PI/2;jingle(p,.04);jingles.push(p);}
 const coil=new T.Group();g.add(coil);coil.position.set(.155,-.08,.12);for(let j=0;j<14;j++)ring(coil,steel,.018,.004,0,0,j*.02);
 const emitter=new T.PointLight(0x1fcafa,0,2.5);g.add(emitter);emitter.position.set(0,.025,1.13);
 let impulse=0,spring=0,velocity=0,reloadPhase=0,cycle=0;
 return {g,model,rounds,jingle,gold,steel,black,emitter,
  kick(){velocity-=1.7;impulse=1;cycle++;},
  update(dt,now,{aim,ammo,reload=0}){
   for(let n=0;n<4;n++){velocity+=(-spring*190-velocity*20)*dt/4;spring+=velocity*dt/4;}
   g.position.z=-6.3-spring;g.position.y=1.48+Math.sin(now*.0008)*.0007;
   if(aim){const target=g.position.clone().add(aim);g.lookAt(target);}else g.rotation.set(0,Math.PI,0);
   impulse=Math.max(0,impulse-dt*8);carrier.position.z=.64-impulse*.11;coil.scale.z=1-impulse*.36;emitter.intensity=impulse*3.5;
   model.barrels[0].position.z=.05-impulse*.055;
   for(let i=0;i<jingles.length;i++)jingles[i].rotation.x=Math.sin(now*.13+i)*impulse*.4;
   model.moving[0].o.rotation.x=Math.sin(now*.09)*impulse*.16;
   cassette.rotation.z=T.MathUtils.damp(cassette.rotation.z,-cycle*Math.PI/9,20,dt);
   // Three distinct reload beats: unlatch, lower cassette, seat and latch.
   reloadPhase=reload;const drop=reload?Math.sin(Math.PI*Math.min(1,reload/.8))*.36:0;
   cassette.position.y=-.21-drop;cassette.rotation.x=drop*.8;
   for(const part of model.moving)if(part.type==='cassette')part.o.position.y=part.baseY-drop;
   rounds.forEach((r,i)=>r.visible=i<ammo||reload>.55);
  },get muzzle(){g.updateMatrixWorld(true);return model.muzzles[0].getWorldPosition(new T.Vector3());},get recoil(){return spring;},get cycle(){return cycle;},get reloadPhase(){return reloadPhase;}};
}
