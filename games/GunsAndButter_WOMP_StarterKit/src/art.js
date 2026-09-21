import {buildReferenceWomps} from './reference-womps.js';
import {createMusicFx} from './music-fx.js';
// WOMP visual remaster. All assets are built locally: no network or file texture fetches.
export function createRangeArt(T,renderer,scene,camera){
 const pi=Math.PI;let seed=723;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 function texture(size,paint){const c=document.createElement('canvas');c.width=c.height=size;paint(c.getContext('2d'),size);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return t;}
 function surface(kind){return texture(512,(g,n)=>{g.fillStyle=kind==='concrete'?'#8a8a80':kind==='rubber'?'#55575a':'#afb3b6';g.fillRect(0,0,n,n);for(let i=0;i<23000;i++){const k=random()*255;g.fillStyle=`rgba(${k},${k},${k},${kind==='concrete'?.12:.06})`;g.fillRect(random()*n,random()*n,random()*2+1,random()*2+1);}for(let i=0;i<(kind==='metal'?650:100);i++){g.strokeStyle=`rgba(${random()>.5?'255,255,255':'0,0,0'},${random()*.16})`;g.lineWidth=random()*.6+.2;const x=random()*n,y=random()*n;g.beginPath();g.moveTo(x,y);g.lineTo(x+(kind==='metal'?random()*100:random()*6),y+random()*2);g.stroke();}if(kind==='rubber'){for(let y=0;y<n;y+=8)for(let x=0;x<n;x+=8){g.fillStyle='#24282a';g.fillRect(x+(y%16?4:0),y,3,3);}}});}
 const concreteTex=surface('concrete'),metalTex=surface('metal'),rubberTex=surface('rubber');
 concreteTex.wrapS=concreteTex.wrapT=T.RepeatWrapping;concreteTex.repeat.set(5,5);
 const m=(color,metalness=.1,roughness=.65,map=null)=>new T.MeshStandardMaterial({color,metalness,roughness,map,bumpMap:map,bumpScale:map?.008:0});
 const materials={steel:m(0x727c82,.88,.29,metalTex),edge:m(0xb3bdc1,.92,.23,metalTex),dark:m(0x1b252b,.72,.38,metalTex),black:m(0x101315,.12,.85,rubberTex),brass:m(0x94713e,.82,.32,metalTex),concrete:m(0x6b6c63,.02,.92,concreteTex),wall:m(0x535b59,.02,.94,concreteTex),red:m(0x792d24,.55,.36,metalTex),blue:m(0x294957,.68,.31,metalTex),leather:m(0x50392a,.05,.88,rubberTex),skin:m(0x603b2a,.02,.75),cloth:m(0x242a27,.05,.98,rubberTex)};
 const emissive=(c,v=.8)=>new T.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:v,roughness:.35,metalness:.3});
 const lights={cyan:emissive(0x6bd5d8,1.4),amber:emissive(0xffc477,1.8),red:emissive(0xe95338,1.4),white:emissive(0xe8f1ee,3)};
 function mesh(geometry,material,parent,pos=[0,0,0]){const o=new T.Mesh(geometry,material);o.position.set(...pos);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 function box(p,mat,w,h,d,x=0,y=0,z=0){return mesh(new T.BoxGeometry(w,h,d),mat,p,[x,y,z]);}
 function round(p,mat,w,h,d,r,x=0,y=0,z=0){r=Math.min(r,w/2-.001,h/2-.001);const s=new T.Shape(),a=-w/2,b=-h/2;s.moveTo(a+r,b);s.lineTo(a+w-r,b);s.quadraticCurveTo(a+w,b,a+w,b+r);s.lineTo(a+w,b+h-r);s.quadraticCurveTo(a+w,b+h,a+w-r,b+h);s.lineTo(a+r,b+h);s.quadraticCurveTo(a,b+h,a,b+h-r);s.lineTo(a,b+r);s.quadraticCurveTo(a,b,a+r,b);const geo=new T.ExtrudeGeometry(s,{depth:Math.max(.002,d-r*.4),bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:r*.2,bevelThickness:r*.2,curveSegments:5});geo.translate(0,0,-d/2);return mesh(geo,mat,p,[x,y,z]);}
 function cyl(p,mat,r,l,x=0,y=0,z=0,r2=r,segments=32){const o=mesh(new T.CylinderGeometry(r,r2,l,segments),mat,p,[x,y,z]);o.rotation.x=pi/2;return o;}
 function ring(p,mat,r,t,x=0,y=0,z=0){return mesh(new T.TorusGeometry(r,t,8,40),mat,p,[x,y,z]);}
 function ellipsoid(p,mat,sc,pos){const o=mesh(new T.SphereGeometry(1,20,12),mat,p,pos);o.scale.set(...sc);return o;}
 function rod(p,mat,a,b,r=.02){const av=new T.Vector3(...a),bv=new T.Vector3(...b),d=bv.clone().sub(av);const o=mesh(new T.CylinderGeometry(r,r,d.length(),12),mat,p);o.position.copy(av).add(bv).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return o;}
 function screw(p,x,y,z,r=.014){cyl(p,materials.edge,r,.012,x,y,z,r,6);box(p,materials.black,r*1.1,r*.17,.002,x,y,z+.008);}
 function text(p,str,w,h,x,y,z,color='#c9c8b9',bg=null){const c=document.createElement('canvas');c.width=1024;c.height=128;const ctx=c.getContext('2d');if(bg){ctx.fillStyle=bg;ctx.fillRect(0,0,1024,128);}ctx.font='700 74px monospace';ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(str,512,64,990);const tx=new T.CanvasTexture(c);tx.colorSpace=T.SRGBColorSpace;const mat=new T.MeshStandardMaterial({map:tx,transparent:!bg,roughness:.8,metalness:.1,polygonOffset:true,polygonOffsetFactor:-1});const o=mesh(new T.PlaneGeometry(w,h),mat,p,[x,y,z]);o.castShadow=false;return o;}
 // Merge static meshes by material while preserving normals and UVs. This keeps
 // detail inexpensive: screws, seams and fins do not each become a draw call.
 function batch(group){group.updateMatrixWorld(true);const inverse=group.matrixWorld.clone().invert(),buckets=new Map();group.traverse(o=>{if(!o.isMesh)return;const list=buckets.get(o.material)||[];list.push(o);buckets.set(o.material,list);});for(const [material,objects] of buckets){const positions=[],normals=[],uvs=[];for(const o of objects){const geo=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();geo.applyMatrix4(new T.Matrix4().multiplyMatrices(inverse,o.matrixWorld));positions.push(...geo.attributes.position.array);normals.push(...geo.attributes.normal.array);if(geo.attributes.uv)uvs.push(...geo.attributes.uv.array);else uvs.push(...new Float32Array(geo.attributes.position.count*2));geo.dispose();o.geometry.dispose();o.removeFromParent();}const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new T.Float32BufferAttribute(normals,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));mesh(geometry,material,group);}return group;}
 // Broad reflection cards supply genuine metallic highlights without remote HDRI.
 const env=texture(1024,(g,n)=>{const grad=g.createLinearGradient(0,0,0,n);grad.addColorStop(0,'#74818b');grad.addColorStop(.48,'#2c393d');grad.addColorStop(.52,'#1a2022');grad.addColorStop(1,'#10171c');g.fillStyle=grad;g.fillRect(0,0,n,n);for(const [x,w,c] of [[80,95,'#b6cee0'],[350,150,'#e9d8b4'],[700,60,'#8ba5af']]){const gr=g.createLinearGradient(x,0,x+w,0);gr.addColorStop(0,'#2b373b');gr.addColorStop(.2,c);gr.addColorStop(.8,c);gr.addColorStop(1,'#2b373b');g.fillStyle=gr;g.fillRect(x,110,w,390);}});env.mapping=T.EquirectangularReflectionMapping;const pmrem=new T.PMREMGenerator(renderer),envTarget=pmrem.fromEquirectangular(env);scene.environment=envTarget.texture;pmrem.dispose();env.dispose();scene.environmentIntensity=.7;
 renderer.setClearColor(0x140d2b);renderer.toneMappingExposure=1.05;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;scene.fog=new T.FogExp2(0x1a1738,.014);
 const gl=renderer.getContext(),debug=gl.getExtension('WEBGL_debug_renderer_info');const software=debug&&/swiftshader|llvmpipe|software|basic render/i.test(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL));if(software)renderer.setPixelRatio(.8);
 scene.add(new T.HemisphereLight(0xa4becd,0x494031,1.0));const sun=new T.DirectionalLight(0xffdfac,2.8);sun.position.set(-9,13,-8);sun.target.position.set(1,0,-15);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-18,right:18,top:20,bottom:-20,near:.5,far:55});sun.shadow.bias=-.0005;sun.shadow.normalBias=.035;scene.add(sun,sun.target);
 const cool=new T.DirectionalLight(0xb7d8e9,2.4);cool.position.set(5,4,8);scene.add(cool);
 const frontLight=new T.PointLight(0xead6ff,80,14,2);frontLight.position.set(-2,4.5,4);scene.add(frontLight);
 for(const z of [-4,-17,-28]){const flood=new T.PointLight(z===-4?0xdf57ff:z===-17?0x34ceff:0xffab39,300,24,2);flood.position.set(0,7.8,z);scene.add(flood);}
 materials.concrete.color.setHex(0x29223f);materials.concrete.roughness=.43;materials.concrete.metalness=.25;materials.wall.color.setHex(0x30264c);
 const hall=new T.Group();scene.add(hall);box(hall,materials.concrete,29,.35,47,0,-.2,-13);box(hall,materials.wall,29,11,.5,0,5.4,-32.5);box(hall,materials.wall,.5,11,44,-14.3,5.4,-11);box(hall,materials.wall,.5,11,44,14.3,5.4,-11);box(hall,materials.dark,29,.25,44,0,10.5,-11);
 const line=m(0xad9459,.02,.9),seam=m(0x333936,.05,.9);for(let z=5;z>-33;z-=3){box(hall,seam,28,.009,.014,0,.005,z);for(let x=-12;x<=12;x+=4)box(hall,seam,.014,.009,3,x,.005,z-1.5);}for(let x=-10;x<=10;x+=5){box(hall,line,.055,.012,36,x,.016,-13);for(let z=-2;z>-32;z-=8)box(hall,line,4,.012,.06,x+2,.017,z);}
 // Shallow oil marks and scuffs break up the floor, with soft alpha edges.
 const stain=texture(256,(g,n)=>{const gr=g.createRadialGradient(128,128,2,128,128,124);gr.addColorStop(0,'rgba(15,16,13,.28)');gr.addColorStop(.6,'rgba(20,20,17,.1)');gr.addColorStop(1,'rgba(20,20,17,0)');g.fillStyle=gr;g.fillRect(0,0,n,n);});const stainMat=new T.MeshBasicMaterial({map:stain,transparent:true,depthWrite:false});for(let i=0;i<23;i++){const o=mesh(new T.PlaneGeometry(1+random()*3,.7+random()*2),stainMat,hall,[(random()-.5)*24,.026,3-random()*33]);o.rotation.x=-pi/2;o.rotation.z=random()*pi;o.castShadow=false;}
 // Acoustic baffles, trusses, conduits and warm working lights.
 for(let z=-3;z>-33;z-=7){for(const x of [-13.9,13.9]){box(hall,materials.dark,.4,10,.5,x,5,z);box(hall,materials.edge,.46,.12,.65,x,.2,z);for(let y=1.2;y<7;y+=1.3){box(hall,materials.black,.13,1.12,3.8,x+(x<0?.32:-.32),y,z-2);for(let k=0;k<7;k++)box(hall,materials.dark,.18,1.08,.08,x+(x<0?.4:-.4),y,z-3.5+k*.5);}}
 box(hall,materials.dark,28,.27,.26,0,9.6,z);for(let x=-12;x<12;x+=3){rod(hall,materials.steel,[x,9.65,z],[x+1.5,10.25,z],.045);rod(hall,materials.steel,[x+1.5,10.25,z],[x+3,9.65,z],.045);}for(const x of [-7,7]){round(hall,materials.dark,3,.2,.6,.08,x,8.7,z);box(hall,lights.white,2.7,.035,.32,x,8.57,z);rod(hall,materials.steel,[x-.9,8.8,z],[x-.9,10.4,z],.025);rod(hall,materials.steel,[x+.9,8.8,z],[x+.9,10.4,z],.025);}}
 for(const x of [-12.8,12.8]){rod(hall,materials.steel,[x,7,6],[x,7,-32],.075);rod(hall,materials.brass,[x,7.25,6],[x,7.25,-32],.035);}
 // Steel bullet trap with angled plates and a restrained physical sign.
 for(let i=0;i<12;i++){const p=box(hall,materials.dark,24,.52,.18,0,.4+i*.47,-31.94);p.rotation.x=-.3;}round(hall,materials.black,15.3,2.3,.2,.08,0,7.2,-32.13);text(hall,'GUNS & BUTTER',14.2,1.5,0,7.35,-31.98,'#e4d8b5');text(hall,'ACOUSTIC BALLISTICS / TEST HALL 03',11,.42,0,6.55,-31.97,'#8aa6a7');box(hall,lights.amber,14.2,.045,.07,0,8.42,-31.9);
 for(const x of [-11,11]){for(let y=1.1;y<4.5;y+=2){round(hall,materials.black,2.1,1.85,1.3,.12,x,y,-29);for(const yy of [-.45,.45]){cyl(hall,materials.dark,.37,.07,x,y+yy,-28.31);ring(hall,materials.steel,.38,.025,x,y+yy,-28.25);cyl(hall,materials.black,.14,.06,x,y+yy,-28.22);}for(const sx of [-.86,.86])for(const sy of [-.72,.72])screw(hall,x+sx,y+sy,-28.29,.035);}}
 // Lane equipment and floor rails give moving targets a plausible setting.
 for(const x of [-7.5,-2.5,2.5,7.5]){for(const off of [-.12,.12])box(hall,materials.steel,.035,.045,27,x+off,.05,-18);for(let z=-6;z>-31;z-=5)box(hall,materials.dark,.45,.07,.2,x,.07,z);}
 for(let i=0;i<3;i++){const z=-6-i*9;for(const x of [-12.8,12.8]){round(hall,materials.dark,1.5,.65,.06,.03,x,1.6,z);text(hall,`${10+i*10} M`,1.25,.4,x,1.6,z+.04);}}
 const desk=round(hall,materials.dark,6.6,.2,1.25,.08,0,.68,3.35);round(hall,materials.black,6.3,.035,1.06,.03,0,.8,3.35);for(const x of [-3.1,3.1]){box(hall,materials.steel,.16,.75,.8,x,.28,3.3);round(hall,materials.dark,.12,1.3,1.1,.03,x,1.4,3.35);}text(hall,'03 / LIVE FIRE',1.5,.2,-1.5,.61,3.995,'#c4a36c');
 // Cargo cases at the edges, kept clear of the active aiming area.
 for(const x of [-11.7,11.7]){round(hall,materials.dark,1.8,.95,1.1,.07,x,.48,-2);for(const xx of [-.6,.6])box(hall,materials.edge,.06,.92,1.13,x+xx,.48,-2);for(const zz of [-2.4,-1.6])round(hall,materials.black,.4,.11,.09,.02,x,.54,zz);}
 // Concert-range color zoning follows the original WOMP palettes.
 const magenta=emissive(0xe52cff,2.2),teal=emissive(0x16d8ff,2.2),amber=emissive(0xffb52c,2.2);
 for(let z=-3;z>-32;z-=7){for(const side of [-1,1]){const color=side<0?magenta:teal;box(hall,color,.07,6.8,.12,side*13.65,4.2,z);box(hall,color,5,.06,.12,side*9.5,9.36,z);box(hall,color,.08,.025,6.7,side*10,.06,z-3);}}
 for(const x of [-7.5,-2.5,2.5,7.5])box(hall,x<0?magenta:teal,.03,.028,27,x,.09,-18);
 for(let i=0;i<30;i++){const h=.6+Math.abs(Math.sin(i*1.63))*2.3;box(hall,i<10?magenta:i<20?teal:amber,.24,h,.08,-10+i*.69,h/2+.3,-31.72);}
 text(hall,'RHYTHM  /  IMPACT  /  REPEAT',11,.55,0,8.95,-31.8,'#ee8dff');
 batch(hall);
 // The playable hall now doubles as a high-end live room: absorbers, control-room
 // glass, rack gear and a music-reactive speaker/wave installation. Reactive parts
 // live outside the static batch so their motion remains cheap and intentional.
 const studio=new T.Group(),reactive={cones:[],meters:[],waves:[],leds:[]};scene.add(studio);
 const glass=new T.MeshPhysicalMaterial({color:0x173c55,transparent:true,opacity:.22,roughness:.08,metalness:.05,transmission:.55,thickness:.25,side:T.DoubleSide});
 const meterMats=[magenta,teal,amber];
 for(const side of [-1,1]){
  // Observation booth and slotted acoustic treatment.
  const window=box(studio,glass,.055,3.2,7.2,side*14.02,6.2,-8);window.castShadow=false;
  for(let z=-2;z>-29;z-=4.5)for(let y=1.1;y<8.4;y+=1.18){const wedge=box(studio,materials.black,.18,.82,2.8,side*14.01,y,z);wedge.rotation.z=side*(y%2?.08:-.08);}
  // Full-range monitors line both walls and are visible down the firing lanes.
  for(let z=-3;z>-29;z-=5.2){const cab=round(studio,materials.dark,1.3,2.25,.82,.09,side*12.95,2.05,z);cab.rotation.y=side*pi/2;
   for(const [yy,rr] of [[2.55,.44],[1.68,.29]]){const cone=new T.Group();studio.add(cone);cone.position.set(side*12.48,yy,z);cone.rotation.y=side*pi/2;cyl(cone,materials.black,rr,.055);ring(cone,materials.steel,rr,.035,0,0,.035);cyl(cone,materials.dark,rr*.79,.075,0,0,.055,rr*.17);cyl(cone,meterMats[z<-18?2:z<-9?1:0],rr*.16,.025,0,0,.103);reactive.cones.push({o:cone,phase:Math.abs(z)*.19+yy,side});}
   for(let i=0;i<6;i++){const led=box(studio,meterMats[i%3],.03,.08,.13,side*12.44,.9+i*.13,z+.34);reactive.leds.push({o:led,index:i,phase:z});}
  }
 }
 // Mastering racks and patch-bay lights sell the studio-booth fantasy.
 for(const x of [-10.8,10.8]){round(studio,materials.dark,2.25,3.25,.75,.08,x,1.6,-30.8);for(let r=0;r<8;r++){round(studio,materials.black,1.92,.24,.04,.025,x,.4+r*.34,-30.38);for(let k=0;k<10;k++){const led=box(studio,meterMats[(r+k)%3],.065,.045,.025,x-.76+k*.17,.4+r*.34,-30.33);reactive.leds.push({o:led,index:k,phase:r});}}}
 // Three dimensional equalizer towers and pressure rings move with the music.
 for(let i=0;i<36;i++){const x=-10.5+i*.6,h=.35+(i%7)*.12,bar=box(studio,meterMats[Math.floor(i/12)],.36,h,.18,x,.18+h/2,-31.45);reactive.meters.push({o:bar,x,base:h,index:i});}
 for(let lane=0;lane<3;lane++)for(let i=0;i<5;i++){const mat=new T.MeshBasicMaterial({color:[0xf735ff,0x18d8ff,0xffba35][lane],transparent:true,opacity:.08,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false});const wave=mesh(new T.TorusGeometry(1.1+i*.42,.018,8,72),mat,studio,[lane*6-6,4.7,-29.9-lane*.35]);wave.userData.ownMaterial=true;reactive.waves.push({o:wave,lane,i});}
 // A suspended vocal mic and cable make this unmistakably a studio live room.
 rod(studio,materials.steel,[0,9.6,-4],[0,6.4,-4],.025);cyl(studio,materials.black,.12,.42,0,6.05,-4);ring(studio,materials.steel,.13,.018,0,6.05,-3.8);for(let i=0;i<7;i++)rod(studio,materials.edge,[-.1+i*.033,5.86,-3.8],[-.1+i*.033,6.24,-3.8],.008);
 const weaponRoot=new T.Group();camera.add(weaponRoot);
 const {models,palette}=buildReferenceWomps(T,{weaponRoot,materials,lights,mesh,round,box,cyl,ring,rod,batch});
 const musicFx=createMusicFx(T,camera,palette);
 // Printed, scuffed physical target plates. Radius is exactly the gameplay radius.
 const faceMats={};for(const type of ['normal','bonus','hazard','armor']){const tx=texture(512,(g,n)=>{g.fillStyle=type==='armor'?'#414270':'#102041';g.fillRect(0,0,n,n);for(let i=0;i<9000;i++){g.fillStyle=`rgba(0,0,0,${random()*.1})`;g.fillRect(random()*n,random()*n,1+random()*3,1+random()*3);}const color={normal:'#36e5ff',bonus:'#ffcf3e',hazard:'#ff5047',armor:'#bd79ff'}[type];g.strokeStyle=color;g.lineWidth=26;g.beginPath();g.arc(256,256,235,0,pi*2);g.stroke();for(const r of [174,105,55]){g.lineWidth=r===55?9:4;g.beginPath();g.arc(256,256,r,0,pi*2);g.stroke();}g.fillStyle=color;g.beginPath();g.arc(256,256,22,0,pi*2);g.fill();g.font='bold 24px monospace';g.textAlign='center';g.fillText(type==='hazard'?'NO FIRE':type==='bonus'?'GOLD MASTER':type==='armor'?'ARMORED / 03':'G&B / REFERENCE',256,365);if(type==='hazard'){g.lineWidth=28;g.beginPath();g.moveTo(166,165);g.lineTo(347,346);g.moveTo(347,165);g.lineTo(166,346);g.stroke();}for(let i=0;i<35;i++){g.strokeStyle='rgba(28,31,29,.25)';g.lineWidth=random()*2;const x=random()*512,y=random()*512;g.beginPath();g.moveTo(x,y);g.lineTo(x+random()*28,y-random()*5);g.stroke();}});faceMats[type]=new T.MeshStandardMaterial({map:tx,emissiveMap:tx,emissive:0xffffff,emissiveIntensity:.55,roughness:.43,metalness:type==='armor'?.65:.25});}
 function makeTarget(type,r,y){const g=new T.Group();const body=mesh(new T.CircleGeometry(r,64),faceMats[type],g);cyl(g,materials.dark,r,.12,0,0,-.07);ring(g,materials.steel,r-.012,.025,0,0,-.006);const indicator={normal:lights.cyan,bonus:lights.amber,hazard:lights.red,armor:lights.cyan}[type];ring(g,indicator,r*.98,.012,0,0,.012);for(let i=0;i<8;i++){const a=pi/8+i*pi/4;screw(g,Math.cos(a)*r*.87,Math.sin(a)*r*.87,.018,.018);}rod(g,materials.dark,[0,-r,-.16],[0,-y+.12,-.16],.06);rod(g,materials.steel,[0,-r,-.16],[0,-r-.42,-.16],.03);round(g,materials.dark,.72,.2,.42,.045,0,-y+.11,-.16);for(const x of [-.27,.27])cyl(g,materials.black,.11,.12,x,-y+.05,-.06);
  // Armor receives physical quarter shields; gold targets carry a pulsing mini monitor.
  if(type==='armor')for(let i=0;i<4;i++){const shield=mesh(new T.RingGeometry(r*.57,r*.86,18,1,i*pi/2+.07,pi/2-.14),materials.steel,g,[0,0,.035]);shield.userData.shield=true;}
  if(type==='bonus'){const speaker=cyl(g,materials.black,r*.24,.035,0,0,.052);ring(g,lights.amber,r*.26,.014,0,0,.075);speaker.userData.bonusCone=true;}
  batch(g);g.traverse(o=>o.castShadow=false);const holes=new T.Group();g.add(holes);const pulseMat=new T.MeshBasicMaterial({color:type==='hazard'?0xff514a:type==='bonus'?0xffcf3e:0x4be7ff,transparent:true,opacity:0,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false}),pulse=mesh(new T.RingGeometry(r*1.02,r*1.075,48),pulseMat,g,[0,0,.04]);pulse.userData.ownMaterial=true;g.userData.pulse=pulse;g.userData.hit=0;g.userData.baseRotation=0;return {g,body,holes};}
 function markHit(t,p){if(!t.holes||t.holes.children.length>=10)return;const q=mesh(new T.CircleGeometry(.036,12),materials.black,t.holes,[p.x-t.x,p.y-t.y,.022]);q.rotation.z=random()*pi;ring(t.holes,materials.edge,.038,.004,p.x-t.x,p.y-t.y,.02);}
 const {muzzleFlash,projectile,impact}=musicFx;
 // Hall shadows are static and cached. Dynamic records/first-person objects use
 // environment illumination, avoiding stale moving silhouettes in that map.
 models.forEach(m=>m.g.traverse(o=>o.castShadow=false));
 function reactTarget(t,power=1){t.g.userData.hit=Math.max(t.g.userData.hit||0,power);}
 function updateTarget(t,dt,time){const hit=t.g.userData.hit||0;t.g.userData.hit=Math.max(0,hit-dt*4.8);if(t.g.userData.pulse){const p=t.g.userData.pulse,s=1+(1-hit)*.18+hit*.3;p.scale.setScalar(s);p.material.opacity=hit*.92;}t.g.rotation.z=(t.g.userData.baseRotation||0)+Math.sin(time*4+t.phase)*.01+Math.sin(hit*pi)*.07;t.g.rotation.y=Math.sin(hit*pi)*.24;}
 function updateArt(time,index,reload,shotKick,reduced,energy={bass:.18,mid:.14,high:.1,beat:0}){
  for(const m of models)for(const a of m.moving){a.o.rotation.z=reduced?0:Math.sin(time*37)*shotKick*2;if(m===models[index]&&reload)a.o.rotation.z+=Math.sin(reload/1.45*pi)*.6;}if(index===0&&reload&&!reduced)for(const b of models[0].barrels)b.rotateX(-Math.sin(reload/1.25*pi)*.3);
  const bands=[energy.bass||0,energy.mid||0,energy.high||0],beat=energy.beat||0;
  for(const c of reactive.cones){const pulse=reduced?1:1+bands[c.phase%3|0]*.18+beat*.1;c.o.scale.set(1,1,pulse);}
  for(const mtr of reactive.meters){const band=bands[Math.floor(mtr.index/12)],wave=.2+.8*Math.abs(Math.sin(time*3.3+mtr.index*.61)),h=mtr.base+.3+band*(1.5+wave*2.4);mtr.o.scale.y=h/mtr.base;mtr.o.position.y=.18+h/2;}
  for(const w of reactive.waves){const e=bands[w.lane],pulse=1+w.i*.08+(reduced?0:e*(.35+w.i*.1)+beat*.12);w.o.scale.setScalar(pulse);w.o.material.opacity=.035+e*.22*(1-w.i*.11);w.o.rotation.z=reduced?0:time*.07*(w.lane%2?1:-1);}
  for(const l of reactive.leds)l.o.visible=reduced||((time*8+l.index+l.phase)%7)<1.8+bands[l.index%3]*4;
 }
 return {weaponRoot,models,makeTarget,markHit,reactTarget,updateTarget,muzzleFlash,projectile,updateArt,materials,lights,mesh,box,cyl,ring,round,rod,batch,palette,impact};
}
