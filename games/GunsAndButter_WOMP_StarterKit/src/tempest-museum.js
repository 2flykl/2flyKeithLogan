import * as T from '../vendor/three.module.js';
import {buildReferenceWomps} from './reference-womps.js';
import {buildPalace,floorReflection} from './palace.js';
import {buildTempest} from './tempest.js';
import {createTempestAudio} from './tempest-audio.js';

const $=id=>document.getElementById(id),canvas=$('game'),touch=matchMedia('(pointer:coarse)').matches;
let renderer;
try{renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});}catch(e){$('error').hidden=false;$('error').textContent='Enable hardware acceleration to enter the WOMP museum.';throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,touch?1.25:1.65));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.shadowMap.autoUpdate=false;
let renderScale=Math.min(devicePixelRatio,touch?1:1.25),autoQuality=true;renderer.setPixelRatio(renderScale);const frameSamples=[];
const scene=new T.Scene(),camera=new T.PerspectiveCamera(62,1,.06,85);camera.rotation.order='YXZ';scene.add(camera);
function mesh(geometry,material,parent=scene,pos=[0,0,0]){const o=new T.Mesh(geometry,material);o.position.set(...pos);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function box(p,m,w,h,d,x=0,y=0,z=0){return mesh(new T.BoxGeometry(w,h,d),m,p,[x,y,z]);}
function cyl(p,m,r,l,x=0,y=0,z=0,r2=r,n=32){const o=mesh(new T.CylinderGeometry(r,r2,l,n),m,p,[x,y,z]);o.rotation.x=Math.PI/2;return o;}
function ring(p,m,r,t,x=0,y=0,z=0){return mesh(new T.TorusGeometry(r,t,8,48),m,p,[x,y,z]);}
function rod(p,m,a,b,r=.02){const av=new T.Vector3(...a),bv=new T.Vector3(...b),d=bv.clone().sub(av),o=mesh(new T.CylinderGeometry(r,r,d.length(),10),m,p);o.position.copy(av).add(bv).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return o;}
function round(p,m,w,h,d,r,x=0,y=0,z=0){r=Math.min(r,w/2-.001,h/2-.001);const s=new T.Shape(),a=-w/2,b=-h/2;s.moveTo(a+r,b);s.lineTo(a+w-r,b);s.quadraticCurveTo(a+w,b,a+w,b+r);s.lineTo(a+w,b+h-r);s.quadraticCurveTo(a+w,b+h,a+w-r,b+h);s.lineTo(a+r,b+h);s.quadraticCurveTo(a,b+h,a,b+h-r);s.lineTo(a,b+r);s.quadraticCurveTo(a,b,a+r,b);const geo=new T.ExtrudeGeometry(s,{depth:Math.max(.002,d-r*.4),bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:r*.2,bevelThickness:r*.2,curveSegments:7});geo.translate(0,0,-d/2);return mesh(geo,m,p,[x,y,z]);}
function batch(group){group.updateMatrixWorld(true);const inverse=group.matrixWorld.clone().invert(),buckets=new Map();group.traverse(o=>{if(o.isMesh){const list=buckets.get(o.material)||[];list.push(o);buckets.set(o.material,list);}});for(const [material,objects] of buckets){const positions=[],normals=[],uvs=[];for(const o of objects){const geo=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();geo.applyMatrix4(new T.Matrix4().multiplyMatrices(inverse,o.matrixWorld));positions.push(...geo.attributes.position.array);normals.push(...geo.attributes.normal.array);uvs.push(...(geo.attributes.uv?.array||new Float32Array(geo.attributes.position.count*2)));geo.dispose();o.geometry.dispose();o.removeFromParent();}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setAttribute('normal',new T.Float32BufferAttribute(normals,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));mesh(geo,material,group);}return group;}
function sign(p,lines,w,h,x,y,z,rotation=0,opts={}){const c=document.createElement('canvas');c.width=1024;c.height=Math.max(96,Math.round(1024*h/w));const g=c.getContext('2d');g.fillStyle=opts.bg||'#eeeae0';g.fillRect(0,0,c.width,c.height);g.textAlign='center';g.textBaseline='middle';lines.forEach((line,i)=>{g.fillStyle=i?opts.accent||'#60605a':opts.fg||'#161d20';g.font=(i?'400 ':'600 ')+(i?c.height*.14:Math.min(opts.size||65,c.height*.38))+'px '+(i?'Arial':'Georgia');g.fillText(line,512,c.height*(i?.77:.4),950);});const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;const o=mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:t,roughness:.7,side:T.DoubleSide}),p,[x,y,z]);o.rotation.y=rotation;return o;}
const helpers={scene,renderer,mesh,box,cyl,ring,rod,round,batch,sign};
const palace=buildPalace(T,helpers),tempest=buildTempest(T,helpers),sound=createTempestAudio();
const reflection=touch?null:floorReflection(T,renderer,scene,camera,[palace.floor,palace.outer]);
const targets=[],marks=[],projectiles=[],particles=[],keys=new Set();
const targetSteel=new T.MeshStandardMaterial({color:0xaab3b9,metalness:.83,roughness:.35}),targetFace=new T.MeshStandardMaterial({color:0xe5e0d3,metalness:.4,roughness:.5});
for(let i=0;i<5;i++){
 const x=(i-2)*1.6,y=[2.1,2.65,2.3,2.65,2.1][i],z=-14.5+Math.abs(i-2)*.3,r=i===2?.49:.42;
 const root=new T.Group(),housing=new T.Group();scene.add(root);root.add(housing);root.position.set(x,y,z);
 box(scene,palace.M.metal,.075,y,.11,x,y/2,z-.13);box(scene,palace.M.black,.7,.11,.7,x,.09,z);
 cyl(housing,palace.M.black,r*1.15,.14);ring(housing,palace.M.gold,r*1.11,.016,0,0,.075);
 const moving=new T.Group();root.add(moving);moving.position.z=.09;cyl(moving,targetSteel,r,.08);const face=cyl(moving,targetFace,r*.91,.012,0,0,.048);ring(moving,palace.M.black,r*.64,.01,0,0,.06);ring(moving,palace.M.gold,r*.35,.008,0,0,.065);cyl(moving,palace.M.black,r*.17,.016,0,0,.068);
 for(let j=0;j<8;j++){const a=j*Math.PI/4;cyl(housing,palace.M.gold,.025,.024,Math.cos(a)*r*1.05,Math.sin(a)*r*1.05,.077,.025,6);}
 const lampMat=new T.MeshStandardMaterial({color:0xdbc590,emissive:0xd7c094,emissiveIntensity:.2});box(root,lampMat,.16,.024,.025,0,-r*1.32,0);
 batch(housing);batch(moving);const t={root,moving,face,r,x,y,z,velocity:0,angle:0,flash:0,lamp:lampMat};targets.push(t);moving.traverse(o=>o.userData.target=t);
 sign(scene,['0'+(i+1),i===2?'THE HEART':'RESONANCE PLATE'],.72,.25,x,.38,z+.1,0,{bg:'#182027',fg:'#e5d4b2',accent:'#b4ac9d',size:85});
}
sign(scene,['THE RESONANCE CHAMBER','PERCUSSION DIVISION / LIVE DEMONSTRATION'],7,.85,0,4.3,-16.15,0,{bg:'#111b20',fg:'#eee2c9',accent:'#b9a880',size:61});
for(const x of [-4.6,4.6]){rod(scene,palace.M.gold,[x,.1,-11],[x,3.4,-16],.04);box(scene,palace.M.black,.1,3.3,.1,x,1.65,-16);}

let state='intro',yaw=0,pitch=.03,ammo=18,score=0,hits=0,shots=0,combo=0,heat=0,held=false,shotAt=0,pending=null,reloadStart=0,reloadStage=0,now=0,last=0,shake=0,toastUntil=0,returnPose=null,challengeEnd=0,mode='precision',reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,footstep=0,frameCount=0,frameMs=16;
camera.position.set(3.7,2.6,1.9);camera.lookAt(0,1.4,-6.3);
function toast(text){$('toast').textContent=text;toastUntil=performance.now()+1900;$('toast').classList.add('visible');}
function audioStart(){try{sound.init();}catch{toast('Audio unavailable in this browser');}}
function resize(){camera.aspect=innerWidth/innerHeight;camera.fov=innerWidth<700?72:62;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight,false);}addEventListener('resize',resize);resize();
function setLook(){camera.rotation.set(pitch+(!reduced?shake*.012:0),yaw,!reduced?Math.sin(now*.08)*shake*.003:0);}
function enter(){if(state!=='intro')return;state='roam';camera.position.set(0,1.75,-1.25);yaw=0;pitch=.01;setLook();$('intro').hidden=true;$('hud').hidden=false;audioStart();toast('Welcome to the percussion pavilion');sync();}
function isNear(){return Math.hypot(camera.position.x,camera.position.z+6.3)<3.35;}
function inspect(){if(state!=='roam'||!isNear())return;returnPose={position:camera.position.clone(),yaw,pitch};state='inspect';$('inspect').hidden=false;camera.position.set(-2.35,1.95,-5.5);camera.lookAt(0,1.5,-6.3);sync();}
function closeInspect(){if(state!=='inspect')return;state='roam';$('inspect').hidden=true;camera.position.copy(returnPose.position);yaw=returnPose.yaw;pitch=returnPose.pitch;setLook();sync();}
function use(){if(state!=='inspect')return;state='use';$('inspect').hidden=true;camera.position.set(.48,1.88,-4.48);yaw=.045;pitch=.038;setLook();ammo=18;reloadStart=0;heat=0;audioStart();sound.reload(2);toast('Hold to fire · R to reload · E to leave');sync();specimenRenderer.render(specimenScene,specimenCamera);}
function leave(){if(state!=='use')return;state='roam';held=false;pending=null;reloadStart=0;challengeEnd=0;mode='precision';camera.position.copy(returnPose.position);yaw=returnPose.yaw;pitch=returnPose.pitch;setLook();sync();toast('Tempest secured to its display');}
function sync(){
 $('station-hud').hidden=state!=='use';$('prompt').hidden=state!=='roam'||!isNear();$('touch-move').hidden=state!=='roam'||!touch;$('reticle').hidden=state!=='use'&&state!=='roam';$('exhibit-card').hidden=state!=='roam';$('scoreboard').hidden=state!=='use';
 $('ammo').textContent=String(ammo).padStart(2,'0');$('score').textContent=String(score).padStart(5,'0');$('hits').textContent=hits;$('accuracy').textContent=shots?Math.round(hits/shots*100)+'%':'—';$('combo').textContent=combo>1?'×'+Math.min(combo,5):'';$('zone').textContent=state==='use'?'LIVE / PERCUSSION RANGE':'THE PERCUSSION PAVILION';
}
function reload(){if(state!=='use'||reloadStart||ammo===18)return;pending=null;held=false;reloadStart=performance.now();reloadStage=0;sound.reload(0);toast('Release · exchange · seat');}
function fire(){
 if(state!=='use'||!$('help').hidden||pending||reloadStart||now<shotAt)return;
 if(ammo===0){sound.empty();shotAt=now+300;toast('Cassette empty · press R');return;}
 pending={due:now+28};shotAt=now+155+heat*28;tempest.kick();
}
function release(){
 ammo--;shots++;heat=Math.min(1,heat+.085);shake=.8;sound.shot();
 const origin=tempest.muzzle,aim=camera.getWorldDirection(new T.Vector3()),aimPoint=camera.position.clone().addScaledVector(aim,(-14.35-camera.position.z)/aim.z),velocity=aimPoint.sub(origin).normalize().multiplyScalar(25);
 const g=new T.Group();scene.add(g);const discs=tempest.jingle(g,.067);g.position.copy(origin);g.quaternion.setFromUnitVectors(new T.Vector3(0,0,1),velocity.clone().normalize());
 projectiles.push({g,v:velocity,life:3.8,active:true,spin:0,discs,shot:shots});
 window.__lastShot={origin:origin.toArray(),projectile:'paired brass jingles',time:now};sync();
}
function spark(point,count=9){for(let i=0;i<count;i++){const m=new T.MeshBasicMaterial({color:i%3?0xf4c877:0xfff1da,transparent:true}),o=mesh(new T.SphereGeometry(.009+Math.random()*.009,5,4),m,scene,point.toArray());o.castShadow=false;particles.push({o,v:new T.Vector3((Math.random()-.5)*2.7,Math.random()*2+.2,Math.random()*2+.5),life:.25+Math.random()*.4});}}
function markHit(point,t){const m=new T.MeshBasicMaterial({color:0x424746,transparent:true,opacity:.78,side:T.DoubleSide,depthWrite:false}),o=new T.Mesh(new T.CircleGeometry(.025+Math.random()*.018,9),m);t.moving.add(o);o.position.copy(t.moving.worldToLocal(point.clone()));o.position.z=.071;o.scale.y=.45;marks.push(o);if(marks.length>40){const old=marks.shift();old.removeFromParent();old.geometry.dispose();old.material.dispose();}}
function updateProjectiles(dt){
 for(let i=projectiles.length-1;i>=0;i--){const p=projectiles[i];p.life-=dt;const before=p.g.position.clone(),next=before.clone().addScaledVector(p.v,dt);p.v.y-=dt*(p.active?.6:9.8);p.spin+=dt*42;p.discs[0].rotation.z=p.spin;p.discs[1].rotation.z=-p.spin*.83;p.g.rotation.x+=dt*(p.active?10:18);
  if(p.active){const delta=next.clone().sub(before),ray=new T.Raycaster(before,delta.clone().normalize(),0,delta.length()+.02);scene.updateMatrixWorld(true);const contact=ray.intersectObjects(targets.map(t=>t.moving),true).find(h=>h.object.userData.target);
   if(contact){const t=contact.object.userData.target;p.active=false;next.copy(contact.point).add(new T.Vector3(0,0,.04));p.v.set((Math.random()-.5)*4,2.2,3);t.velocity+=3.8;t.flash=1;hits++;combo++;const local=t.moving.worldToLocal(contact.point.clone()),center=Math.hypot(local.x,local.y)<t.r*.36;score+=(center?100:50)*Math.min(5,combo);markHit(contact.point,t);spark(contact.point);sound.hit(t.x/5,center);$('hitmarker').classList.remove('active');void $('hitmarker').offsetWidth;$('hitmarker').classList.add('active');$('shot-feedback').textContent=center?'HEART STRIKE +'+100*Math.min(5,combo):'PLATE STRUCK +'+50*Math.min(5,combo);sync();
   }else if(next.z<-16.05||next.y<.1||Math.abs(next.x)>8){p.active=false;combo=0;p.v.z=Math.abs(p.v.z)*.12;p.v.y=1.5;spark(next,4);sound.skim(next.x/8);sync();}
  }else if(next.y<.085){next.y=.085;p.v.y=Math.abs(p.v.y)*.32;p.v.x*=.7;p.v.z*=.7;if(p.v.length()<.3)p.v.set(0,0,0);}
  p.g.position.copy(next);if(p.life<=0){p.g.removeFromParent();p.g.traverse(o=>o.geometry?.dispose());projectiles.splice(i,1);}
 }
 for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;p.v.y-=dt*6;p.o.position.addScaledVector(p.v,dt);p.o.material.opacity=Math.min(1,p.life*3);if(p.life<=0){p.o.removeFromParent();p.o.geometry.dispose();p.o.material.dispose();particles.splice(i,1);}}
}
function clearProjectiles(){for(const p of projectiles){p.g.removeFromParent();p.g.traverse(o=>o.geometry?.dispose());}projectiles.length=0;}
function challenge(){if(state!=='use')return;clearProjectiles();challengeEnd=now+45000;score=hits=shots=combo=0;mode='kinetic';ammo=18;reloadStart=0;pending=null;sync();toast('45 SECOND RECITAL · moving plates');}
function reset(){clearProjectiles();challengeEnd=0;mode='precision';score=hits=shots=combo=0;ammo=18;reloadStart=0;pending=null;for(const m of marks){m.removeFromParent();m.geometry.dispose();m.material.dispose();}marks.length=0;sync();toast('Range reset · precision practice');}
function move(dt){const f=Number(keys.has('KeyW')||keys.has('ArrowUp')||keys.has('forward'))-Number(keys.has('KeyS')||keys.has('ArrowDown')||keys.has('back')),s=Number(keys.has('KeyD')||keys.has('ArrowRight')||keys.has('right'))-Number(keys.has('KeyA')||keys.has('ArrowLeft')||keys.has('left'));if(!f&&!s)return;const speed=2.8*dt/Math.max(1,Math.hypot(f,s)),x=camera.position.x+(-Math.sin(yaw)*f+Math.cos(yaw)*s)*speed,z=camera.position.z+(-Math.cos(yaw)*f-Math.sin(yaw)*s)*speed;
 if(Math.hypot(x,z)<9.1&&Math.hypot(x,z+6.3)>1.55&&!(Math.abs(z+6.65)<.4&&Math.abs(Math.abs(x)-3.2)<1)){camera.position.x=x;camera.position.z=z;}
 footstep+=dt;if(footstep>.47){footstep=0;sound.step();}if(!reduced)camera.position.y=1.75+Math.sin(now*.012)*.012;
}
function look(dx,dy){if(!['roam','use'].includes(state)||!$('help').hidden)return;const rate=touch?.0035:.002;const limit=state==='use'?.36:Math.PI*100;yaw=T.MathUtils.clamp(yaw-dx*rate,-limit,limit);pitch=T.MathUtils.clamp(pitch-dy*rate,state==='use'?-.16:-1.15,state==='use'?.28:1.15);setLook();}
const specimenRenderer=new T.WebGLRenderer({canvas:$('specimen'),antialias:true,alpha:true});specimenRenderer.setSize(224,98,false);specimenRenderer.setPixelRatio(1);specimenRenderer.outputColorSpace=T.SRGBColorSpace;specimenRenderer.toneMapping=T.ACESFilmicToneMapping;
const specimenScene=new T.Scene();specimenScene.add(new T.HemisphereLight(0xffffff,0x787878,2));const sl=new T.DirectionalLight(0xffedcc,3);sl.position.set(-2,4,5);specimenScene.add(sl);const clone=tempest.g.clone(true);clone.position.set(-.22,.2,0);clone.rotation.set(0,-Math.PI/2,0);clone.scale.setScalar(1);specimenScene.add(clone);const specimenCamera=new T.OrthographicCamera(-1.45,1.45,.64,-.64,.01,10);specimenCamera.position.set(0,0,5);const ammoPreview=new T.Group();specimenScene.add(ammoPreview);ammoPreview.position.set(1,-.16,.1);tempest.jingle(ammoPreview,.19);ammoPreview.rotation.y=.5;
function loop(time){requestAnimationFrame(loop);now=time;const dt=Math.min(.07,(now-(last||now))/1000);const elapsed=now-(last||now);frameMs=frameMs*.96+elapsed*.04;if(elapsed>0&&elapsed<100)frameSamples.push(elapsed);last=now;frameCount++;
 if(autoQuality&&frameCount%90===0&&frameSamples.length>40){const sorted=[...frameSamples].sort((a,b)=>a-b),median=sorted[Math.floor(sorted.length/2)];if(median>29&&renderScale>.66){renderScale=Math.max(.65,renderScale-.12);renderer.setPixelRatio(renderScale);renderer.setSize(innerWidth,innerHeight,false);}frameSamples.length=0;}
 if(state==='intro'){camera.position.set(3.7+Math.sin(now*.00008)*.65,2.6,1.9);camera.lookAt(0,1.5,-6.3);}
 if(state==='roam'&&$('help').hidden){move(dt);$('prompt').hidden=!isNear();}
 if(state==='inspect'){const a=-1.15+Math.sin(now*.00019)*.24;const distance=touch?4.4:2.8;camera.position.set(Math.sin(a)*distance,2,-6.3+Math.cos(a)*distance);camera.lookAt(.25,touch?.25:1.48,touch?-6.3:-5.7);}
 if(state==='use'&&$('help').hidden){if(held||keys.has('Space'))fire();if(pending&&now>=pending.due){pending=null;release();}shake=Math.max(0,shake-dt*6);setLook();}
 let progress=0;if(reloadStart){progress=Math.min(1,(now-reloadStart)/1750);if(progress>.34&&reloadStage===0){sound.reload(1);reloadStage=1;}if(progress>.79&&reloadStage===1){sound.reload(2);reloadStage=2;}if(progress===1){ammo=18;reloadStart=0;progress=0;sync();toast('Cassette seated · ready');}}
 heat=Math.max(0,heat-dt*.12);if(frameCount%5===0){$('heat-fill').style.transform='scaleX('+heat+')';const text=reloadStart?'EXCHANGING CASSETTE':pending?'INDEXING':held?'CYCLING':ammo===0?'CASSETTE EMPTY':'MECHANISM READY';if($('mechanism-state').textContent!==text)$('mechanism-state').textContent=text;}
 const aim=state==='use'?camera.position.clone().addScaledVector(camera.getWorldDirection(new T.Vector3()),12).sub(tempest.g.position).normalize():null;tempest.update(dt,now,{aim,ammo,reload:progress});
 for(let i=0;i<targets.length;i++){const t=targets[i];for(let n=0;n<4;n++){t.velocity+=(-t.angle*75-t.velocity*8)*dt/4;t.angle+=t.velocity*dt/4;}t.moving.rotation.x=t.angle;t.flash=Math.max(0,t.flash-dt*3);t.lamp.emissiveIntensity=.2+t.flash*5;t.root.position.x=t.x+(mode==='kinetic'?Math.sin(now*.0013+i*1.4)*.48:0);t.root.position.y=t.y+(mode==='kinetic'?Math.sin(now*.0018+i)*.19:0);}
 updateProjectiles(dt);
 if(challengeEnd){const left=Math.max(0,(challengeEnd-now)/1000);if(frameCount%5===0)$('timer').textContent=left.toFixed(1)+'s';if(left===0){challengeEnd=0;mode='precision';held=false;pending=null;clearProjectiles();keys.delete('Space');toast('Recital complete · '+score+' points');}}else if($('timer').textContent!=='FREE PRACTICE')$('timer').textContent='FREE PRACTICE';
 if(now>toastUntil)$('toast').classList.remove('visible');renderer.shadowMap.needsUpdate=frameCount===1;reflection?.update();renderer.render(scene,camera);

}
requestAnimationFrame(loop);
$('enter').onclick=enter;$('prompt').onclick=inspect;$('inspect-close').onclick=closeInspect;$('use').onclick=use;$('exit').onclick=leave;$('reload').onclick=reload;$('challenge').onclick=challenge;$('reset').onclick=reset;
$('sound').onclick=()=>{const muted=$('sound').getAttribute('aria-pressed')==='true';$('sound').setAttribute('aria-pressed',String(!muted));$('sound').textContent=muted?'SOUND OFF':'SOUND ON';audioStart();sound.mute(muted);};
function stopInput(){held=false;keys.clear();}
$('help-open').onclick=()=>{stopInput();$('help').hidden=false;};$('help-close').onclick=()=>{$('help').hidden=true;};
$('quality').onclick=()=>{autoQuality=!autoQuality;renderScale=autoQuality?1:Math.min(devicePixelRatio,1.65);renderer.setPixelRatio(renderScale);resize();$('quality').textContent=autoQuality?'VISUALS: AUTO':'VISUALS: FULL RESOLUTION';};
$('motion').onclick=()=>{reduced=!reduced;$('motion').textContent=reduced?'MOTION: REDUCED':'MOTION: FULL';};
document.addEventListener('keydown',e=>{if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(e.code==='Escape'){stopInput();if(!$('help').hidden)$('help').hidden=true;else if(state==='inspect')closeInspect();else leave();return;}if(!$('help').hidden)return;keys.add(e.code);if(e.repeat)return;if(e.code==='KeyE'){if(state==='roam')inspect();else if(state==='use')leave();}if(e.code==='Enter'){if(state==='intro')enter();else if(state==='inspect')use();}if(e.code==='Space'&&state==='use')fire();if(e.code==='KeyR')reload();if(e.code==='KeyC')challenge();});
document.addEventListener('keyup',e=>keys.delete(e.code));addEventListener('blur',stopInput);document.addEventListener('visibilitychange',()=>{if(document.hidden)stopInput();});
canvas.addEventListener('mousemove',e=>{if(!touch)look(e.movementX,e.movementY);});canvas.addEventListener('mousedown',e=>{if(e.button===0&&state==='use'){held=true;fire();}});addEventListener('mouseup',()=>held=false);
let tx=0,ty=0;canvas.addEventListener('touchstart',e=>{tx=e.touches[0].clientX;ty=e.touches[0].clientY;},{passive:true});canvas.addEventListener('touchmove',e=>{const t=e.touches[0];look(t.clientX-tx,t.clientY-ty);tx=t.clientX;ty=t.clientY;},{passive:true});
for(const el of document.querySelectorAll('[data-move]')){el.onpointerdown=e=>{el.setPointerCapture(e.pointerId);keys.add(el.dataset.move);};el.onpointerup=el.onpointercancel=()=>keys.delete(el.dataset.move);}
$('fire-touch').onpointerdown=e=>{e.preventDefault();$('fire-touch').setPointerCapture(e.pointerId);held=true;fire();};$('fire-touch').onpointerup=$('fire-touch').onpointercancel=()=>held=false;
window.__museum={get state(){return state;},get selected(){return state==='use'?0:-1;},get near(){return isNear()?0:-1;},get player(){return camera.position.toArray();},get ammo(){return ammo;},get hits(){return [hits];},get score(){return score;},get shots(){return shots;},get view(){return [yaw,pitch];},get audioState(){return sound.state;},get audioLevel(){return sound.level;},get audioEvents(){return sound.events;},get movingParts(){return{cycle:tempest.cycle,recoil:tempest.recoil,reload:tempest.reloadPhase};},get projectileCount(){return projectiles.length;},get drawCalls(){return renderer.info.render.calls;},get renderScale(){return renderScale;},get frameMs(){return frameMs;},get mode(){return mode;},get targets(){return targets.map(t=>t.root.position.toArray());},setPlayer(x,z){if(state==='roam'){camera.position.set(x,1.75,z);sync();}},setView(y,p){yaw=y;pitch=p;setLook();},aimAt(i=2){const d=targets[i].root.position.clone().sub(camera.position).normalize();yaw=Math.atan2(-d.x,-d.z);pitch=Math.asin(d.y);setLook();},inspect,use,fire,reload,leave,reset,challenge,get samples(){return sound.samples;}};
