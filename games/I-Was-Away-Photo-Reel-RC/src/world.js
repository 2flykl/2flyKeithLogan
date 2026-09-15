import * as THREE from '../vendor/three.module.js';
import {Photographer,DIRECTIONS} from './photographer.js';
import {RecentPool} from './variation.js';
const TAU=Math.PI*2;
const clamp=THREE.MathUtils.clamp;
const fract=(n)=>n-Math.floor(n);
const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t)};
const hash=(x,y)=>fract(Math.sin(x*127.1+y*311.7)*43758.5453123);

export class World{
 constructor(canvas){
  this.gpuSafe=new URLSearchParams(location.search).get('gpu')==='safe';
  this.renderer=new THREE.WebGLRenderer({canvas,antialias:!this.gpuSafe,alpha:false,powerPreference:this.gpuSafe?'low-power':'high-performance'});
  this.renderer.setPixelRatio(this.gpuSafe?Math.min(1,960/innerWidth,540/innerHeight):Math.min(devicePixelRatio,1.75));
  this.renderer.outputColorSpace=THREE.SRGBColorSpace;
  this.renderer.toneMapping=THREE.NoToneMapping;
  this.scene=new THREE.Scene();
  this.camera=new THREE.PerspectiveCamera(53,1,.05,1000);
  this.camera.position.set(0,1.72,0);
  this.yaw=0;
  this.pitch=.06;
  this.targetYaw=0;
  this.targetPitch=.06;
  this.orbitRadius=6.1;
  this.targetOrbitRadius=6.1;
  this.fov=53;
  this.targetFov=53;
  this.exploring=false;
  this.clock=0;
  this.guideX=1.65;
  this.photoMode=false;
  this.focus={x:-.25,y:.96,z:-4.95};
  this.stageCenter={x:.2,z:-5.05};
  this.resize();
 }
 async load(onProgress){
  const manager=new THREE.LoadingManager();
  manager.onProgress=(_,n,total)=>onProgress(n/total);
  this.compactTexture=this.gpuSafe||innerWidth<700||this.renderer.capabilities.maxTextureSize<8192;
  const loader=new THREE.TextureLoader(manager);
  const [pano,atlas,boom,manifest]=await Promise.all([
   loader.loadAsync(this.compactTexture?'assets/environment/qwantani-4k.jpg':'assets/environment/qwantani-8k.jpg'),
   loader.loadAsync('assets/characters/atlas.webp'),
   loader.loadAsync('assets/boomerang/master.png'),
   fetch('assets/characters/frames.json').then(r=>{if(!r.ok)throw Error('Character manifest failed');return r.json()})
  ]);
  for(const t of [pano,atlas,boom]){t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(8,this.renderer.capabilities.getMaxAnisotropy())}
  this.manifest=manifest;
  this.atlas=atlas;
  this.textureBytes=[pano,atlas,boom].reduce((n,t)=>n+t.image.width*t.image.height*4*4/3,0)+128*128*4*4/3;

  const mat=new THREE.ShaderMaterial({
   side:THREE.BackSide,depthWrite:false,
   uniforms:{map:{value:pano},offset:{value:.37}},
   vertexShader:`varying vec3 direction;void main(){direction=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
   fragmentShader:`uniform sampler2D map;uniform float offset;varying vec3 direction;void main(){vec3 d=normalize(direction);vec2 uv=vec2(fract(atan(d.z,d.x)/6.28318530718+.5+offset),asin(clamp(d.y,-1.,1.))/3.14159265359+.5);gl_FragColor=texture2D(map,uv);#include <colorspace_fragment>
}`.replace(';#include',';\n#include')
  });
  this.sky=new THREE.Mesh(new THREE.SphereGeometry(400,64,40),mat);
  this.sky.position.copy(this.camera.position);
  this.sky.renderOrder=-100;
  this.scene.add(this.sky);

  this.scene.add(new THREE.HemisphereLight(0xdaeaff,0x635843,1.5));
  const sun=new THREE.DirectionalLight(0xfff1d2,1.8);sun.position.set(8,12,-16);this.scene.add(sun);

  this.buildGroundStage();

  this.photographer=new Photographer();
  this.photoManifest=await fetch('assets/photographer/manifest.json').then(r=>{if(!r.ok)throw Error('Photographer manifest unavailable');return r.json()});
  this.photoTextures={};
  for(const [direction,file] of Object.entries(this.photoManifest.directions)){
   const texture=await loader.loadAsync('assets/photographer/'+file);
   texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;texture.generateMipmaps=false;texture.minFilter=THREE.LinearFilter;
   this.photoTextures[direction]=texture;this.textureBytes+=texture.image.width*texture.image.height*4;
  }
  this.photoTurn=await loader.loadAsync('assets/photographer/'+this.photoManifest.turnaround);
  this.photoTurn.colorSpace=THREE.SRGBColorSpace;this.photoTurn.generateMipmaps=false;this.photoTurn.minFilter=THREE.LinearFilter;
  this.textureBytes+=this.photoTurn.image.width*this.photoTurn.image.height*4;

  this.player=this.actor();
  this.variantManifest=await fetch('assets/states/manifest.json').then(r=>{if(!r.ok)throw Error('Catch states unavailable');return r.json()});
  this.variantAtlas=await loader.loadAsync('assets/states/catch-variants.webp');
  this.variantAtlas.colorSpace=THREE.SRGBColorSpace;this.variantAtlas.generateMipmaps=false;this.variantAtlas.minFilter=THREE.LinearFilter;
  this.textureBytes+=2048*1536*4;
  this.player.baseMap=this.player.main.material.map;
  this.catchPool=new RecentPool();this.readyPool=new RecentPool();this.catchAge=0;
  this.documentarian=this.actor();
  this.documentarian.main.material.map=this.photoTextures['front-right'];
  this.documentarian.main.center.set(.5,12/256);
  this.documentarian.ghost.visible=false;
  this.player.group.position.set(-.8,0,-4.4);
  this.documentarian.group.position.set(1.65,0,-5.6);

  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=128;
  const ctx=shadowCanvas.getContext('2d');
  const grad=ctx.createRadialGradient(64,64,0,64,64,60);
  grad.addColorStop(0,'rgba(20,25,17,.48)');grad.addColorStop(.4,'rgba(20,25,17,.2)');grad.addColorStop(1,'rgba(20,25,17,0)');
  ctx.fillStyle=grad;ctx.fillRect(0,0,128,128);
  const shadowMap=new THREE.CanvasTexture(shadowCanvas);
  for(const actor of [this.player,this.documentarian]){
   const sh=new THREE.Mesh(new THREE.PlaneGeometry(1.5,2.2),new THREE.MeshBasicMaterial({map:shadowMap,transparent:true,depthWrite:false}));
   sh.rotation.x=-Math.PI/2;sh.position.y=.01;sh.position.z=.25;actor.group.add(sh);actor.shadow=sh;
  }

  this.boom=new THREE.Mesh(new THREE.PlaneGeometry(.66,.33),new THREE.MeshBasicMaterial({map:boom,transparent:true,side:THREE.DoubleSide,alphaTest:.02,depthWrite:false}));
  this.scene.add(this.boom);this.boom.visible=false;
  this.trailGeo=new THREE.BufferGeometry();this.trailArray=new Float32Array(36*3);this.trailGeo.setAttribute('position',new THREE.BufferAttribute(this.trailArray,3));
  this.trail=new THREE.Line(this.trailGeo,new THREE.LineBasicMaterial({color:0xffe8ba,transparent:true,opacity:.17,depthWrite:false}));
  this.trail.frustumCulled=false;this.scene.add(this.trail);

  this.ready=true;
  this.setPose(this.player,'idle',4,0);
  this.renderer.compile(this.scene,this.camera);
 }
 buildGroundStage(){
  const diffuse=this.makeGroundTexture(1024);
  diffuse.colorSpace=THREE.SRGBColorSpace;
  diffuse.anisotropy=4;
  const groundGeo=new THREE.PlaneGeometry(18,13.5,48,36);
  groundGeo.rotateX(-Math.PI/2);
  const pos=groundGeo.attributes.position;
  for(let i=0;i<pos.count;i++){
   const x=pos.getX(i),z=pos.getZ(i);
   const rx=(x/8.2),rz=(z/6.4);
   const r=Math.hypot(rx,rz);
   const edge=smooth(.22,1,r);
   const n=(hash(x*.28,z*.31)-.5)*.28+(hash(x*.9+4.3,z*.7+2.1)-.5)*.08;
   pos.setY(i,n*edge);
  }
  pos.needsUpdate=true;
  groundGeo.computeVertexNormals();
  const groundMat=new THREE.MeshStandardMaterial({map:diffuse,roughness:.98,metalness:0,color:0xffffff});
  this.ground=new THREE.Mesh(groundGeo,groundMat);
  this.ground.position.set(this.stageCenter.x,-.03,this.stageCenter.z);
  this.scene.add(this.ground);

  const skirtTex=this.makeGroundSkirt(1024);
  skirtTex.colorSpace=THREE.SRGBColorSpace;
  const skirtGeo=new THREE.PlaneGeometry(24,18,1,1);skirtGeo.rotateX(-Math.PI/2);
  const skirtMat=new THREE.MeshBasicMaterial({map:skirtTex,transparent:true,depthWrite:false,opacity:.72});
  this.groundSkirt=new THREE.Mesh(skirtGeo,skirtMat);
  this.groundSkirt.position.set(this.stageCenter.x,-.05,this.stageCenter.z);
  this.scene.add(this.groundSkirt);
 }
 makeGroundTexture(size){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=size;const ctx=canvas.getContext('2d');
  const bg=ctx.createLinearGradient(0,0,0,size);bg.addColorStop(0,'#86785c');bg.addColorStop(.18,'#77835d');bg.addColorStop(.52,'#6f704d');bg.addColorStop(1,'#514734');ctx.fillStyle=bg;ctx.fillRect(0,0,size,size);
  for(let i=0;i<1700;i++){
   const x=Math.random()*size,y=Math.random()*size;const r=8+Math.random()*28;ctx.save();ctx.translate(x,y);ctx.rotate(Math.random()*Math.PI);
   ctx.fillStyle=Math.random()>.55?`rgba(${85+Math.random()*55},${105+Math.random()*65},${55+Math.random()*25},${.08+Math.random()*.12})`:`rgba(${95+Math.random()*45},${80+Math.random()*35},${50+Math.random()*20},${.05+Math.random()*.08})`;
   ctx.beginPath();ctx.ellipse(0,0,r*1.35,r*.42,0,0,TAU);ctx.fill();ctx.restore();
  }
  for(let i=0;i<260;i++){
   const x=Math.random()*size,y=Math.random()*size;const r=14+Math.random()*34;ctx.fillStyle=`rgba(${120+Math.random()*60},${112+Math.random()*38},${86+Math.random()*34},${.04+Math.random()*.06})`;
   ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();
  }
  return new THREE.CanvasTexture(canvas);
 }
 makeGroundSkirt(size){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=size;const ctx=canvas.getContext('2d');
  const bg=ctx.createLinearGradient(0,0,0,size);bg.addColorStop(0,'rgba(103,112,76,.75)');bg.addColorStop(.5,'rgba(88,90,61,.58)');bg.addColorStop(1,'rgba(68,58,39,.45)');ctx.fillStyle=bg;ctx.fillRect(0,0,size,size);
  const mask=ctx.createRadialGradient(size/2,size/2,size*.18,size/2,size/2,size*.5);mask.addColorStop(0,'rgba(255,255,255,.95)');mask.addColorStop(.55,'rgba(255,255,255,.7)');mask.addColorStop(1,'rgba(255,255,255,0)');
  ctx.globalCompositeOperation='destination-in';ctx.fillStyle=mask;ctx.fillRect(0,0,size,size);ctx.globalCompositeOperation='source-over';
  return new THREE.CanvasTexture(canvas);
 }
 actor(){
  const group=new THREE.Group();
  const make=()=>{
   const map=this.atlas.clone();map.needsUpdate=true;
   const material=new THREE.SpriteMaterial({map,transparent:true,alphaTest:.015,depthWrite:false});
   const s=new THREE.Sprite(material);s.center.set(.5,14/384);s.scale.set(1.4,2.1,1);group.add(s);return s;
  };
  const ghost=make(),main=make();ghost.material.opacity=0;ghost.visible=false;this.scene.add(group);
  return {group,main,ghost,key:null,fade:1,facing:0};
 }
 setMap(sprite,key){const f=this.manifest.frames[key];if(!f)return;const {width,height}=this.manifest;const map=sprite.material.map;map.repeat.set(256/width,384/height);map.offset.set((f.index%16)*256/width,1-(Math.floor(f.index/16)+1)*384/height);}
 setPose(actor,state,dir,dt){if(state==='wait')dir=[7,0,1,2,3,4,5,6][dir];const key=state+'_'+dir;if(key!==actor.key){if(actor.key){this.setMap(actor.ghost,actor.key);actor.ghost.material.opacity=0;actor.fade=0}this.setMap(actor.main,key);actor.key=key;}actor.fade=Math.min(1,actor.fade+dt/0.09);actor.main.material.opacity=1;actor.ghost.material.opacity=0;}
 direction(actor){const a=Math.atan2(this.camera.position.x-actor.group.position.x,this.camera.position.z-actor.group.position.z)-actor.facing;return (Math.round(-a/(Math.PI/4))+4+8)%8}
 update(dt,g,{intro=false,exploring=false,reduced=false,cutaway=false,frozen=false}={}){
  if(!this.ready)return;
  if(!cutaway&&!frozen)this.clock+=dt;
  this.exploring=exploring;
  const damping=1-Math.exp(-dt*6);
  this.guideX=this.photographer.x;
  this.targetPitch=clamp(this.targetPitch,-.12,.18);
  this.yaw+=(this.targetYaw-this.yaw)*damping;
  this.pitch+=(this.targetPitch-this.pitch)*damping;
  this.fov+=(this.targetFov-this.fov)*damping;
  this.orbitRadius+=(this.targetOrbitRadius-this.orbitRadius)*damping;
  this.camera.fov=this.fov;this.camera.updateProjectionMatrix();

  const lateral=innerWidth<700?.5:1;
  const flight=g.phase==='flight';
  this.player.group.visible=!intro;
  this.documentarian.group.visible=!intro;
  this.player.group.position.x=g.playerX*lateral;
  this.player.group.position.z=g.playerZ;
  this.photographer.step(dt,g,{frozen:frozen||exploring,cutaway});
  this.documentarian.group.position.set(this.photographer.x*lateral,0,this.photographer.z);
  this.documentarian.facing=this.photographer.facing;

  const px=this.player.group.position.x,pz=this.player.group.position.z;
  const qx=this.documentarian.group.position.x,qz=this.documentarian.group.position.z;
  const focusWeight=.78;
  let desiredFocusX=px*focusWeight+qx*(1-focusWeight);
  let desiredFocusZ=pz*focusWeight+qz*(1-focusWeight);
  if(flight){
   desiredFocusX+=clamp((g.landingX*lateral-px)*.16,-.28,.28);
   desiredFocusZ+=-.08;
  }
  const follow=1-Math.exp(-dt*(flight?3:8));
  this.focus.x+=(desiredFocusX-this.focus.x)*follow;
  this.focus.y+=(.98-this.focus.y)*follow;
  this.focus.z+=(desiredFocusZ-this.focus.z)*follow;

  const cosPitch=Math.cos(this.pitch),sinPitch=Math.sin(this.pitch),radius=this.orbitRadius;
  this.camera.position.set(
   this.focus.x+Math.sin(this.yaw)*radius*cosPitch,
   this.focus.y+1.08+sinPitch*radius*.58,
   this.focus.z+Math.cos(this.yaw)*radius*cosPitch
  );
  this.camera.lookAt(this.focus.x,this.focus.y+.12,this.focus.z);
  this.sky.position.copy(this.camera.position);

  let state='idle',dir=this.direction(this.player);
  const moving=Math.abs(g.playerX-(this.lastPlayerX??g.playerX))>.002;
  this.lastPlayerX=g.playerX;
  if(g.phase==='charging')state=g.charge>.3?'windup':'idle';
  if(g.phase==='launch'){state='accel';dir=dir>=3&&dir<=5?6+Math.min(1,Math.floor(g.phaseTime/.14)):0+Math.min(1,Math.floor(g.phaseTime/.14));}
  if(g.phase==='flight'){
   state=g.flightTime<.38?'release':g.flightTime/g.duration>.83?'ready':'wait';
   if(moving){state=Math.floor(this.clock*4)%2?'walkA':'walkB';dir=g.playerX>(this.prevMoveX??g.playerX)?2:6;}
   if(g.catchAt!==null)state='contact';
  }
  if(g.phase==='result')state=g.result==='Back in your hands'||g.result==='A perfect return'?'secured':'miss';
  if(this.variantAttempt!==g.attempts){this.variantAttempt=g.attempts;this.catchStyle=this.catchPool.pick(['one_hand','jump_catch','catch_contact'])[0];this.readyStyle=this.readyPool.pick(['tracking','original'])[0];this.catchAge=0;}
  const caught=g.phase==='result'&&(g.result.includes('hands')||g.result.includes('perfect'));
  if(caught&&!cutaway&&!frozen)this.catchAge+=dt;
  if(!caught)this.catchAge=0;
  let variant=null;
  // Empty hands while the boomerang is airborne. Secured props only after success.
  if(g.phase==='flight'&&!moving&&g.flightTime/g.duration>.65&&this.readyStyle==='tracking')variant='tracking';
  if(caught){variant=this.catchStyle;if(this.catchStyle==='jump_catch'&&this.catchAge>.55)variant='one_hand';}
  const candidates=Object.entries(this.variantManifest.frames).filter(([,f])=>f.state===variant&&f.direction===dir);
  this.player.group.position.y=caught&&this.catchStyle==='jump_catch'&&this.catchAge<.55?Math.sin(this.catchAge/.55*Math.PI)*.22:0;
  if(candidates.length){const [key,f]=candidates[g.attempts%candidates.length];this.player.main.material.map=this.variantAtlas;this.variantAtlas.repeat.set(1/8,1/4);this.variantAtlas.offset.set((f.index%8)/8,1-(Math.floor(f.index/8)+1)/4);this.player.key=key;this.player.main.material.opacity=1;this.player.ghost.visible=false;}
  else{if(this.player.main.material.map!==this.player.baseMap){this.player.main.material.map=this.player.baseMap;this.player.key=null;}this.setPose(this.player,state,dir,dt);}
  this.prevMoveX=g.playerX;

  const photoDir=this.direction(this.documentarian),direction=DIRECTIONS[photoDir],animated=this.photoTextures[direction];
  const sprite=this.documentarian.main;
  if(animated){
   sprite.material.map=animated;animated.repeat.set(1/8,1/7);animated.offset.set((this.photographer.frame%8)/8,1-(Math.floor(this.photographer.frame/8)+1)/7);sprite.center.set(.5,12/256);sprite.scale.set(1.45,1.94,1);
  } else {
   sprite.material.map=this.photoTurn;this.photoTurn.repeat.set(1/8,1);this.photoTurn.offset.set(photoDir/8,0);sprite.center.set(.5,14/384);sprite.scale.set(1.34,2.01,1);
  }
  this.photoDirection=direction;this.photoAnimated=!!animated;this.documentarian.shadow.scale.setScalar(['kneel','crouch'].some(s=>this.photographer.state.includes(s))?1.1:1);
  if(!reduced)this.player.main.scale.y=2.1+Math.sin(this.clock*1.8)*.004;

  this.boom.visible=g.phase==='flight'||(g.phase==='result'&&!g.result.includes('hands')&&!g.result.includes('perfect')&&g.phaseTime<1.5);
  if(g.phase==='flight'){
   this.boom.position.set(g.position.x*lateral,g.position.y,g.position.z);
   this.boom.rotation.set(.55+Math.sin(g.flightTime/g.duration*TAU)*.2,Math.sin(g.flightTime/g.duration*TAU)*.55,this.clock*(32+g.spin*12));
   for(let i=35;i>0;i--){this.trailArray[i*3]=this.trailArray[(i-1)*3];this.trailArray[i*3+1]=this.trailArray[(i-1)*3+1];this.trailArray[i*3+2]=this.trailArray[(i-1)*3+2];}
   if(this.lastPhase!=='flight'){for(let i=0;i<36;i++)this.trailArray.set([g.position.x*lateral,g.position.y,g.position.z],i*3)}else this.trailArray.set([g.position.x*lateral,g.position.y,g.position.z],0);
   this.trailGeo.attributes.position.needsUpdate=true;
  } else if(g.phase==='result'){
   this.boom.position.set(g.landingX*lateral,.07,g.landingZ);this.boom.rotation.set(-Math.PI/2,0,.2)
  }
  this.trail.visible=g.phase==='flight';
  this.lastPhase=g.phase;
  this.renderer.render(this.scene,this.camera);
 }
 project(x,y,z){const lateral=innerWidth<700?.5:1;const v=new THREE.Vector3(x*lateral,y,z).project(this.camera);return {x:(v.x*.5+.5)*innerWidth,y:(-.5*v.y+.5)*innerHeight,visible:v.z>-1&&v.z<1&&Math.abs(v.x)<1.1&&Math.abs(v.y)<1.1}}
 recenter(){this.userLook=false;this.targetYaw=0;this.targetPitch=.05;this.targetOrbitRadius=innerWidth<700?6.5:6.1;this.targetFov=innerWidth<700?65:54;}
 resize(){this.camera.aspect=innerWidth/innerHeight;if(this.gpuSafe)this.renderer.setPixelRatio(Math.min(1,960/innerWidth,540/innerHeight));this.renderer.setSize(innerWidth,innerHeight,false);this.camera.updateProjectionMatrix();this.targetFov=innerWidth<700?65:54;this.targetOrbitRadius=innerWidth<700?6.5:6.1;}
}

