import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js';

const $=id=>document.getElementById(id);
const canvas=$('game');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.16;renderer.outputColorSpace=THREE.SRGBColorSpace;
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0xb7c9a4,.0052);const camera=new THREE.PerspectiveCamera(54,1,.1,700);const clock=new THREE.Clock();
let started=false,muted=false,elapsed=0,catches=0,demoDone=false;

scene.add(new THREE.HemisphereLight(0xbce4ff,0x625a36,2.4));const sun=new THREE.DirectionalLight(0xfff0c9,5.8);sun.position.set(-40,75,-80);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-70;sun.shadow.camera.right=70;sun.shadow.camera.top=70;sun.shadow.camera.bottom=-70;scene.add(sun);
const skyMat=new THREE.ShaderMaterial({side:THREE.BackSide,uniforms:{top:{value:new THREE.Color(0x2e92d4)},bottom:{value:new THREE.Color(0xf4d19b)},offset:{value:26},exponent:{value:.72}},vertexShader:`varying vec3 v;void main(){vec4 w=modelMatrix*vec4(position,1.);v=w.xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`uniform vec3 top,bottom;uniform float offset,exponent;varying vec3 v;void main(){float h=normalize(v+offset).y;gl_FragColor=vec4(mix(bottom,top,max(pow(max(h,0.0),exponent),0.0)),1.0);}`});scene.add(new THREE.Mesh(new THREE.SphereGeometry(450,32,18),skyMat));
function makePaintTexture(size=512){const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d');x.fillStyle='#6d8d45';x.fillRect(0,0,size,size);for(let i=0;i<2200;i++){const px=Math.random()*size,py=Math.random()*size,r=1+Math.random()*8;const cols=['rgba(242,183,75,.08)','rgba(47,94,54,.11)','rgba(255,235,174,.06)','rgba(104,137,66,.13)'];x.fillStyle=cols[i%cols.length];x.beginPath();x.ellipse(px,py,r*2,r,Math.random()*Math.PI,0,Math.PI*2);x.fill()}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(12,12);t.colorSpace=THREE.SRGBColorSpace;return t}
const ground=new THREE.Mesh(new THREE.PlaneGeometry(500,500,80,80),new THREE.MeshStandardMaterial({map:makePaintTexture(),color:0x8aa65d,roughness:1,metalness:0}));
const gp=ground.geometry.attributes.position;for(let i=0;i<gp.count;i++){const x=gp.getX(i),y=gp.getY(i);gp.setZ(i,Math.sin(x*.035)*1.3+Math.cos(y*.028)*1.1+Math.sin((x+y)*.017)*.7)}gp.needsUpdate=true;ground.geometry.computeVertexNormals();ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
for(let i=0;i<13;i++){const r=28+Math.random()*45,m=new THREE.Mesh(new THREE.SphereGeometry(r,24,12,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:i%2?0x6b8e43:0x78984d,roughness:1}));m.scale.y=.22+Math.random()*.15;m.position.set((Math.random()-.5)*260,-2,-65-Math.random()*130);m.receiveShadow=true;scene.add(m)}
function tree(x,z,s=1){const g=new THREE.Group(),tr=new THREE.Mesh(new THREE.CylinderGeometry(.45*s,.7*s,5*s,9),new THREE.MeshStandardMaterial({color:0x6c4528,roughness:1}));tr.position.y=2.5*s;tr.castShadow=true;g.add(tr);const lm=new THREE.MeshStandardMaterial({color:0x315f34,roughness:1});[[0,5.7,0,2.8],[1.4,5.2,.2,2.1],[-1.3,5.1,.1,2.2],[.4,7,.1,2.3]].forEach(a=>{const m=new THREE.Mesh(new THREE.IcosahedronGeometry(a[3]*s,1),lm);m.position.set(a[0]*s,a[1]*s,a[2]*s);m.castShadow=true;g.add(m)});g.position.set(x,0,z);scene.add(g)}for(let i=0;i<30;i++){const side=i%2?1:-1;tree(side*(24+Math.random()*85),-15-Math.random()*180,.7+Math.random()*1.4)}
const sunDisc=new THREE.Mesh(new THREE.SphereGeometry(5,24,16),new THREE.MeshBasicMaterial({color:0xfff2b0}));sunDisc.position.set(-48,54,-160);scene.add(sunDisc);

// PainterFly scenic layers: painted mountains, meadow strokes, clouds and drifting life.
const scenic=new THREE.Group();scene.add(scenic);
function mountainLayer(z,baseY,color,scale,seed){const mat=new THREE.MeshToonMaterial({color,gradientMap:null,transparent:true,opacity:.96});for(let i=0;i<9;i++){const w=22+((i*17+seed)%27),h=8+((i*11+seed)%15);const geo=new THREE.ConeGeometry(w*.65,h,5);const m=new THREE.Mesh(geo,mat);m.scale.set(1.25,1,0.55);m.position.set((i-4)*31+(seed%9),baseY+h*.42,z-i*.4);m.rotation.y=(i%2?.15:-.12);scenic.add(m)}}
mountainLayer(-185,0,0x607c71,1,3);mountainLayer(-155,-1,0x77906a,1,8);mountainLayer(-126,-1.5,0x90a66e,1,13);
const cloudMat=new THREE.MeshBasicMaterial({color:0xffefd0,transparent:true,opacity:.74,depthWrite:false});const clouds=[];
for(let i=0;i<12;i++){const g=new THREE.Group();for(let j=0;j<4;j++){const puff=new THREE.Mesh(new THREE.SphereGeometry(3+Math.random()*3,10,7),cloudMat);puff.scale.set(1.7,.55,.65);puff.position.set(j*3-Math.random()*2,Math.random()*1.4,Math.random()*2);g.add(puff)}g.position.set(-110+Math.random()*220,25+Math.random()*28,-90-Math.random()*150);g.scale.setScalar(.7+Math.random()*1.4);clouds.push(g);scene.add(g)}
const grassGeo=new THREE.PlaneGeometry(.18,1.25);grassGeo.translate(0,.62,0);const grassMats=[0x476b35,0x5d7f3b,0x82974e,0xb08f3d].map(c=>new THREE.MeshBasicMaterial({color:c,side:THREE.DoubleSide,transparent:true,opacity:.88}));const grasses=[];
for(let i=0;i<1100;i++){const m=new THREE.Mesh(grassGeo,grassMats[i%grassMats.length]);const ang=Math.random()*Math.PI*2,rad=5+Math.pow(Math.random(),.62)*115;m.position.set(Math.cos(ang)*rad,0,Math.sin(ang)*rad-30);m.rotation.y=Math.random()*Math.PI;m.scale.setScalar(.45+Math.random()*.9);m.userData.phase=Math.random()*6.28;grasses.push(m);scene.add(m)}
const flowerCols=[0xf1c15f,0xd86a4a,0xf8e5a5,0x7196b5];for(let i=0;i<130;i++){const g=new THREE.Group();const stem=new THREE.Mesh(new THREE.CylinderGeometry(.018,.025,.55,4),new THREE.MeshBasicMaterial({color:0x52723c}));stem.position.y=.27;g.add(stem);const head=new THREE.Mesh(new THREE.CircleGeometry(.11,7),new THREE.MeshBasicMaterial({color:flowerCols[i%flowerCols.length],side:THREE.DoubleSide}));head.position.y=.58;head.rotation.x=-Math.PI/2;g.add(head);const a=Math.random()*Math.PI*2,r=8+Math.random()*70;g.position.set(Math.cos(a)*r,0,Math.sin(a)*r-22);scene.add(g)}
const butterflies=[];for(let i=0;i<8;i++){const g=new THREE.Group(),mat=new THREE.MeshBasicMaterial({color:i%2?0xf1b44f:0x4c8faa,side:THREE.DoubleSide});const l=new THREE.Mesh(new THREE.CircleGeometry(.12,8,0,Math.PI),mat),r=new THREE.Mesh(new THREE.CircleGeometry(.12,8,0,Math.PI),mat);l.position.x=-.1;r.position.x=.1;r.rotation.z=Math.PI;g.add(l,r);g.position.set((Math.random()-.5)*28,2+Math.random()*3,-5-Math.random()*35);g.userData={phase:Math.random()*6.28,base:g.position.clone(),l,r};butterflies.push(g);scene.add(g)}
const windRibbons=[];for(let i=0;i<9;i++){const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-8,1.2,-8-i*5),new THREE.Vector3(-2,2.2,-12-i*5),new THREE.Vector3(6,1.6,-16-i*5)]);const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,28,.025,5,false),new THREE.MeshBasicMaterial({color:0xffe5a3,transparent:true,opacity:.18}));mesh.userData.phase=i*.7;windRibbons.push(mesh);scene.add(mesh)}

function human({shirt,pants,skin,cap=false,hoodie=false}){const g=new THREE.Group(),ms=new THREE.MeshStandardMaterial({color:skin,roughness:.8}),mt=new THREE.MeshStandardMaterial({color:shirt,roughness:.85}),mp=new THREE.MeshStandardMaterial({color:pants,roughness:.9}),shoe=new THREE.MeshStandardMaterial({color:0x111318,roughness:.7});const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.72,1.55,5,10),mt);torso.position.y=3.7;torso.scale.z=.65;torso.castShadow=true;g.add(torso);const head=new THREE.Mesh(new THREE.SphereGeometry(.55,18,14),ms);head.position.y=5.25;head.castShadow=true;g.add(head);if(cap){const brim=new THREE.Mesh(new THREE.BoxGeometry(.8,.08,.6),new THREE.MeshStandardMaterial({color:0x08090b}));brim.position.set(0,5.62,-.26);g.add(brim);const crown=new THREE.Mesh(new THREE.SphereGeometry(.57,18,8,0,Math.PI*2,0,Math.PI/2),new THREE.MeshStandardMaterial({color:0x07090a}));crown.position.y=5.48;g.add(crown)}if(hoodie){const h=new THREE.Mesh(new THREE.TorusGeometry(.53,.14,8,18,Math.PI*1.35),mt);h.position.set(0,5.04,.22);h.rotation.x=1.3;g.add(h)}const limbs={};['lArm','rArm'].forEach((k,i)=>{const p=new THREE.Group(),a=new THREE.Mesh(new THREE.CapsuleGeometry(.17,1.25,4,8),ms);a.position.y=-.65;a.castShadow=true;p.add(a);p.position.set(i?-.88:.88,4.35,0);g.add(p);limbs[k]=p});['lLeg','rLeg'].forEach((k,i)=>{const p=new THREE.Group(),l=new THREE.Mesh(new THREE.CapsuleGeometry(.24,1.65,4,8),mp);l.position.y=-.85;l.castShadow=true;p.add(l);const sh=new THREE.Mesh(new THREE.BoxGeometry(.48,.25,.8),shoe);sh.position.set(0,-1.85,-.18);p.add(sh);p.position.set(i?-.38:.38,2.05,0);g.add(p);limbs[k]=p});g.userData.limbs=limbs;return g}
const player=human({shirt:0x3e4752,pants:0x232b34,skin:0x4a2618,hoodie:true});player.position.set(1.3,0,7);player.rotation.y=Math.PI;scene.add(player);const guide=human({shirt:0x101114,pants:0x5c646d,skin:0x4a281a,cap:true});guide.position.set(-2.1,0,7.4);guide.rotation.y=Math.PI-.16;scene.add(guide);
scene.traverse(o=>{if(o.isMesh&&o.material&&o!==ground){if(o.material.isMeshStandardMaterial){o.material.roughness=Math.max(.82,o.material.roughness||0);o.material.metalness=0;o.material.flatShading=true;o.material.needsUpdate=true}}});
// Painterly ground shadows and soft color accents around the two leads.
for(const h of[player,guide]){const halo=new THREE.Mesh(new THREE.CircleGeometry(1.25,32),new THREE.MeshBasicMaterial({color:h===guide?0xe7b653:0x5e94a9,transparent:true,opacity:.12,depthWrite:false}));halo.rotation.x=-Math.PI/2;halo.position.y=.025;h.add(halo)}
const em1=new THREE.Mesh(new THREE.PlaneGeometry(.9,.65),new THREE.MeshBasicMaterial({color:0x149df2,side:THREE.DoubleSide}));em1.position.set(0,3.85,-.66);em1.rotation.y=Math.PI;guide.add(em1);const em2=new THREE.Mesh(new THREE.PlaneGeometry(.34,.7),new THREE.MeshBasicMaterial({color:0xe13b3f,side:THREE.DoubleSide}));em2.position.set(.16,3.86,-.675);em2.rotation.y=Math.PI;em2.rotation.z=-.45;guide.add(em2);
const speaker=new THREE.Group(),sp=new THREE.Mesh(new THREE.BoxGeometry(1.15,.65,.55),new THREE.MeshStandardMaterial({color:0x111519,roughness:.55}));sp.position.y=.42;sp.castShadow=true;speaker.add(sp);for(const x of[-.33,.33]){const c=new THREE.Mesh(new THREE.CylinderGeometry(.19,.19,.04,18),new THREE.MeshStandardMaterial({color:0x253846,emissive:0x07131b}));c.rotation.x=Math.PI/2;c.position.set(x,.42,-.29);speaker.add(c)}speaker.position.set(-3.4,0,6.2);scene.add(speaker);
const sh=new THREE.Shape();sh.moveTo(-2.2,.18);sh.quadraticCurveTo(-.6,.55,0,0);sh.quadraticCurveTo(.65,.55,2.2,.18);sh.lineTo(2,-.15);sh.quadraticCurveTo(.65,.05,0,-.5);sh.quadraticCurveTo(-.65,.05,-2,-.15);sh.closePath();const boomerang=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:.16,bevelEnabled:true,bevelThickness:.08,bevelSize:.05,bevelSegments:2}),new THREE.MeshStandardMaterial({color:0x121417,roughness:.52,metalness:.12}));boomerang.geometry.center();boomerang.scale.set(.36,.36,.36);boomerang.castShadow=true;scene.add(boomerang);
const trailPoints=Array.from({length:26},()=>new THREE.Vector3());const trailGeo=new THREE.BufferGeometry().setFromPoints(trailPoints);const trailMat=new THREE.LineBasicMaterial({color:0xf6c45d,transparent:true,opacity:.58});const boomTrail=new THREE.Line(trailGeo,trailMat);scene.add(boomTrail);for(let i=-2;i<=2;i++){const c=new THREE.Mesh(new THREE.BoxGeometry(.1,.02,.2),new THREE.MeshBasicMaterial({color:i%2?0xe53b3f:0x12a9ff}));c.position.x=i*.28;c.position.z=.1;boomerang.add(c)}
const zoneMesh=new THREE.Mesh(new THREE.RingGeometry(1.8,2.5,48),new THREE.MeshBasicMaterial({color:0x70ff9a,transparent:true,opacity:.5,side:THREE.DoubleSide}));zoneMesh.rotation.x=-Math.PI/2;zoneMesh.position.set(1.3,.035,6.7);zoneMesh.visible=false;scene.add(zoneMesh);

const ui={hud:$('hud'),intro:$('intro'),loading:$('loading'),objective:$('objective'),fill:$('meter-fill'),needle:$('timing-needle'),mode:$('meter-mode'),value:$('meter-value'),help:$('meter-help'),releaseZone:$('release-zone'),catchZones:$('catch-zones'),caption:$('guide-caption'),toast:$('toast'),catchZone:$('catch-zone'),view:$('view-readout'),dPower:$('d-power'),dRelease:$('d-release'),dSpin:$('d-spin'),dReturn:$('d-return')};
const state={phase:'idle',power:0,powerDir:1,aim:0,timing:0,releaseQuality:0,flightT:0,flightDuration:5.8,start:new THREE.Vector3(),catchPoint:new THREE.Vector3(),catchT:0,catchPressed:false,catchResult:'',demoT:0};const keys={};let viewMode=0,orbit=.0;
function say(t){ui.caption.innerHTML=t}function pop(t){ui.toast.textContent=t;ui.toast.classList.add('show');setTimeout(()=>ui.toast.classList.remove('show'),1200)}
function setMeter(mode){ui.mode.textContent=mode;ui.catchZones.classList.toggle('hidden',mode!=='CATCH');ui.releaseZone.classList.toggle('hidden',mode==='CATCH');ui.fill.style.display=mode==='POWER'?'block':'none';ui.needle.style.opacity=mode==='POWER'?0:1}
function ready(message=true){state.phase='ready';state.power=0;state.timing=0;state.flightT=0;state.catchT=0;state.catchPressed=false;player.position.set(1.3,0,7);player.rotation.y=Math.PI;boomerang.position.set(1.95,4.25,6.75);boomerang.rotation.set(0,.2,.1);boomerang.visible=true;zoneMesh.visible=false;ui.catchZone.classList.add('hidden');setMeter('POWER');ui.fill.style.width='0%';ui.value.textContent='0%';ui.help.textContent='HOLD ↓ TO WIND UP';if(message)say('Your turn. Inspect the field, then hold <b>DOWN</b> to draw the boomerang back.');ui.objective.textContent='TUTORIAL: COMPLETE 3 CATCHES'}
function startDemo(){state.phase='demo';state.demoT=0;ui.objective.textContent='GUIDED TUTORIAL: WATCH THE INSTRUCTOR';setMeter('POWER');ui.help.textContent='INSTRUCTOR DEMONSTRATION';say('Watch closely. <b>DOWN</b> builds power, <b>UP</b> times the release, then you move into the catch circle.');boomerang.position.set(-1.35,4.45,7.1);player.position.set(1.3,0,7);zoneMesh.visible=false}
function beginRelease(){state.phase='release';state.timing=0;setMeter('RELEASE');ui.help.textContent='PRESS ↑ IN THE WHITE WINDOW';say('Now press <b>UP</b> when the marker reaches the white release window.')}
function launch(){const ideal=.775,err=Math.abs(state.timing-ideal);state.releaseQuality=Math.max(0,1-err/.38);ui.dRelease.textContent=err<.035?'Perfect':`${Math.round(err*180)} ms ${state.timing<ideal?'early':'late'}`;ui.dSpin.textContent=`${Math.round(45+55*state.releaseQuality)}%`;pop(err<.035?'PERFECT RELEASE':state.timing<ideal?'EARLY RELEASE':'LATE RELEASE');say('Move into the glowing circle. The catch meter appears as the boomerang returns.');state.phase='flight';state.flightT=0;state.flightDuration=4.5+state.power*2.3;state.start.copy(boomerang.position);state.catchPoint.set(1.3+(state.timing-ideal)*10,2.7,6.7);zoneMesh.position.set(state.catchPoint.x,.035,state.catchPoint.z);zoneMesh.visible=true;ui.catchZone.classList.remove('hidden');whoosh(.65+state.power*.5)}
function catchOutcome(auto=false){if(state.phase!=='catch')return;state.catchPressed=true;const x=state.catchT;let result='NORMAL CATCH';if((x>=.28&&x<=.303)||(x>=.73&&x<=.754))result='TRICK CATCH';else if((x>=.22&&x<=.31)||(x>=.67&&x<=.78))result='NICE CATCH';else if(x>=.48&&x<=.52)result='DROP';else if(auto)result='AUTOMATIC CATCH';state.catchResult=result;finishCatch(result)}
function finishCatch(result){state.phase='result';zoneMesh.visible=false;ui.catchZone.classList.add('hidden');ui.dReturn.textContent=result;boomerang.visible=result==='DROP';if(result==='DROP'){boomerang.position.set(player.position.x+.4,.15,player.position.z-.2);pop('DROPPED IT');say('That tiny dark zone is the risk. Let the automatic catch happen, or time <b>UP</b> for style.')}else{catches++;$('catch-count').textContent=`${Math.min(catches,3)} / 3`;pop(result);boomerang.visible=false;say(result.includes('TRICK')?'That was the smallest window—a trick catch.':result.includes('NICE')?'Clean timing. That upgraded the automatic catch.':'You were in position, so the catch was handled automatically.')}setTimeout(()=>ready(false),2100)}

let audioCtx,song,master,songGain,ambienceGain;async function startAudio(){audioCtx=new(window.AudioContext||window.webkitAudioContext)();master=audioCtx.createGain();master.gain.value=.82;master.connect(audioCtx.destination);songGain=audioCtx.createGain();songGain.gain.value=.66;const low=audioCtx.createBiquadFilter();low.type='highpass';low.frequency.value=85;const high=audioCtx.createBiquadFilter();high.type='lowpass';high.frequency.value=9400;const comp=audioCtx.createDynamicsCompressor();comp.threshold.value=-21;comp.knee.value=14;comp.ratio.value=3.2;comp.attack.value=.018;comp.release.value=.25;const pan=audioCtx.createStereoPanner();pan.pan.value=-.16;song=new Audio('audio/i-was-away.mp3');song.loop=true;const src=audioCtx.createMediaElementSource(song);src.connect(low).connect(high).connect(comp).connect(pan).connect(songGain).connect(master);await song.play();ambienceGain=audioCtx.createGain();ambienceGain.gain.value=.12;ambienceGain.connect(master);const b=audioCtx.createBuffer(1,audioCtx.sampleRate*2,audioCtx.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*.3;const n=audioCtx.createBufferSource(),f=audioCtx.createBiquadFilter(),g=audioCtx.createGain();n.buffer=b;n.loop=true;f.type='lowpass';f.frequency.value=700;g.gain.value=.32;n.connect(f).connect(g).connect(ambienceGain);n.start();setInterval(()=>{if(!audioCtx||muted||Math.random()>.55)return;const o=audioCtx.createOscillator(),v=audioCtx.createGain();o.type='sine';o.frequency.setValueAtTime(1600+Math.random()*900,audioCtx.currentTime);o.frequency.exponentialRampToValueAtTime(2200+Math.random()*900,audioCtx.currentTime+.12);v.gain.setValueAtTime(0,audioCtx.currentTime);v.gain.linearRampToValueAtTime(.035,audioCtx.currentTime+.015);v.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+.22);o.connect(v).connect(ambienceGain);o.start();o.stop(audioCtx.currentTime+.23)},4200)}
function whoosh(s=.5){if(!audioCtx||muted)return;const o=audioCtx.createOscillator(),g=audioCtx.createGain(),f=audioCtx.createBiquadFilter();o.type='sawtooth';o.frequency.setValueAtTime(180,audioCtx.currentTime);o.frequency.exponentialRampToValueAtTime(55,audioCtx.currentTime+.34);f.type='bandpass';f.frequency.value=600;f.Q.value=.55;g.gain.setValueAtTime(.001,audioCtx.currentTime);g.gain.linearRampToValueAtTime(.08*s,audioCtx.currentTime+.06);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+.4);o.connect(f).connect(g).connect(master);o.start();o.stop(audioCtx.currentTime+.42)}

addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key))e.preventDefault();keys[e.key.toLowerCase()]=true;if(!started)return;if(e.key==='v'||e.key==='V'){viewMode=(viewMode+1)%3;ui.view.textContent=['PLAYER','WIDE','FIELD'][viewMode];pop(`VIEW: ${ui.view.textContent}`)}if(e.key==='r'||e.key==='R'){demoDone?ready():startDemo()}if(e.key==='m'||e.key==='M'){muted=!muted;if(master)master.gain.setTargetAtTime(muted?0:.82,audioCtx.currentTime,.08);pop(muted?'MUSIC MUTED':'MUSIC ON')}if(e.key==='ArrowDown'&&state.phase==='ready'){state.phase='power';say('Hold it… choose your power, then release <b>DOWN</b>.')}if(e.key==='ArrowUp'&&state.phase==='release')launch();else if(e.key==='ArrowUp'&&state.phase==='catch')catchOutcome(false)});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false;if(e.key==='ArrowDown'&&state.phase==='power')beginRelease()});

function animatePerson(dt){const p=player.userData.limbs,g=guide.userData.limbs;if(state.phase==='power'){p.rArm.rotation.x=-1.5*(.45+.55*state.power);p.rArm.rotation.z=-.4;player.rotation.y=Math.PI+state.aim*.25;boomerang.position.set(player.position.x+.68,4.7,player.position.z+.25)}else if(state.phase==='release'){p.rArm.rotation.x=-1.5+state.timing*2.4;p.rArm.rotation.z=-.4+.4*state.timing;boomerang.position.set(player.position.x+.75,4.45,player.position.z-.12-.45*state.timing)}else if(state.phase==='flight'||state.phase==='catch'){p.rArm.rotation.x=.7;p.rArm.rotation.z=0}if(state.phase==='demo'){const t=state.demoT;if(t<2){g.rArm.rotation.x=-Math.min(1.45,t*.8);g.rArm.rotation.z=-.4}else if(t<2.8){g.rArm.rotation.x=-1.45+(t-2)*2.6}else g.rArm.rotation.x=.6}else{g.rArm.rotation.x=(state.phase==='flight'||state.phase==='catch')?-.9:-.15;g.rArm.rotation.z=(state.phase==='flight'||state.phase==='catch')?-.3:0}}
function flightPosition(u,p,q,aim,start,out){const r=12+26*p,th=u*Math.PI*2*(.88+.12*q),lat=Math.sin(th)*r*(.62+.38*q)+aim*18*Math.sin(Math.PI*u),f=-Math.sin(Math.PI*u)*r*1.2,h=2.7+Math.sin(Math.PI*u)*(6+8*p)+Math.sin(th*2)*(.5*(1-q)),dr=(state.timing-.775)*14*u;out.set(start.x+lat+dr,h,start.z+f)}
function updateDemo(dt){state.demoT+=dt;const t=state.demoT;ui.value.textContent=t<2?`${Math.round(Math.min(1,t/2)*72)}%`:t<2.8?`${Math.round((t-2)/.8*100)}%`:'RETURN';ui.fill.style.width=t<2?`${Math.min(72,t/2*72)}%`:'72%';if(t<2){boomerang.position.set(guide.position.x+.72,4.7,guide.position.z+.2)}else if(t<2.8){ui.mode.textContent='RELEASE';ui.needle.style.opacity=1;ui.needle.style.left=`${Math.min(78,(t-2)/.8*78)}%`;boomerang.position.set(guide.position.x+.78,4.45,guide.position.z-.2)}else if(t<7.2){if(t<2.9){state.start.copy(boomerang.position);whoosh(.8);zoneMesh.visible=true;zoneMesh.position.set(guide.position.x,.035,guide.position.z-.2);ui.catchZone.classList.remove('hidden');say('The throw is only half of it. I move into the circle before the return.')}const u=Math.min(1,(t-2.8)/4.4);flightPosition(u,.72,.96,0,state.start,boomerang.position);boomerang.rotation.z+=dt*35;if(t>5.8){guide.position.x=THREE.MathUtils.lerp(-2.1,-1.1,(t-5.8)/1.4)}}else{demoDone=true;guide.position.set(-2.1,0,7.4);zoneMesh.visible=false;ui.catchZone.classList.add('hidden');pop('NOW YOU TRY');ready();}}
function updateFlight(dt){state.flightT+=dt;const u=Math.min(1,state.flightT/state.flightDuration);flightPosition(u,state.power,state.releaseQuality,state.aim,state.start,boomerang.position);boomerang.rotation.z+=dt*(18+22*state.releaseQuality);boomerang.rotation.y+=dt*6;if(u>.72&&!['catch','result'].includes(state.phase)){state.phase='catch';state.catchT=0;setMeter('CATCH');ui.help.textContent='STAY IN THE CIRCLE. PRESS ↑ FOR STYLE — OR DO NOTHING FOR AUTO CATCH';say('You are safe inside the circle. The red meter catches automatically. Yellow is nice, blue is a trick catch, and the tiny dark zone is a drop risk.')}if(u>=1&&state.phase==='catch'){const dist=Math.hypot(player.position.x-state.catchPoint.x,player.position.z-state.catchPoint.z);if(dist<=2.7)catchOutcome(true);else{state.phase='result';ui.dReturn.textContent='OUTSIDE CIRCLE';pop('MISSED POSITION');say('The catch meter only helps if you reach the circle. Track the return and move earlier.');setTimeout(()=>ready(false),2100)}}}
function update(dt){elapsed+=dt;const breeze=elapsed*.9;for(const g of grasses){g.rotation.z=Math.sin(breeze+g.userData.phase)*.08}for(let i=0;i<clouds.length;i++){clouds[i].position.x+=dt*(.35+i*.015);if(clouds[i].position.x>130)clouds[i].position.x=-130}for(const b of butterflies){const u=b.userData;b.position.x=u.base.x+Math.sin(elapsed*.7+u.phase)*2.2;b.position.y=u.base.y+Math.sin(elapsed*1.5+u.phase)*.45;b.position.z=u.base.z+Math.cos(elapsed*.55+u.phase)*1.8;const flap=.35+Math.abs(Math.sin(elapsed*8+u.phase))*.9;u.l.rotation.y=flap;u.r.rotation.y=-flap}for(const w of windRibbons){w.material.opacity=.09+.09*Math.sin(elapsed*1.2+w.userData.phase)}$('rec-time').textContent=`${String(Math.floor(elapsed/60)).padStart(2,'0')}:${String(Math.floor(elapsed%60)).padStart(2,'0')}`;if(!started)return;if(keys.q)orbit-=dt*.8;if(keys.e)orbit+=dt*.8;if(state.phase==='demo')updateDemo(dt);if(state.phase==='ready'){if(keys.arrowleft)state.aim=Math.max(-1,state.aim-dt*.75);if(keys.arrowright)state.aim=Math.min(1,state.aim+dt*.75)}if(state.phase==='power'){state.power+=dt*.55*state.powerDir;if(state.power>=1){state.power=1;state.powerDir=-1}else if(state.power<=.12){state.power=.12;state.powerDir=1}ui.fill.style.width=`${state.power*100}%`;ui.value.textContent=`${Math.round(state.power*100)}%`;ui.dPower.textContent=`${Math.round(state.power*100)}%`}if(state.phase==='release'){state.timing+=dt*1.12;if(state.timing>1){state.timing=1;launch()}ui.needle.style.left=`calc(${state.timing*100}% - 2px)`;ui.value.textContent=`${Math.round(state.timing*100)}%`}if(state.phase==='flight'||state.phase==='catch'){const s=7.2*dt;if(keys.arrowleft)player.position.x-=s;if(keys.arrowright)player.position.x+=s;if(keys.arrowup&&state.phase==='flight')player.position.z-=s;if(keys.arrowdown)player.position.z+=s;player.position.x=THREE.MathUtils.clamp(player.position.x,-12,12);player.position.z=THREE.MathUtils.clamp(player.position.z,-4,13);updateFlight(dt)}if(state.phase==='catch'){state.catchT=(state.catchT+dt*.9)%1;ui.needle.style.left=`calc(${state.catchT*100}% - 2px)`;ui.value.textContent=`${Math.round(state.catchT*100)}%`}for(let i=trailPoints.length-1;i>0;i--)trailPoints[i].lerp(trailPoints[i-1],.82);trailPoints[0].copy(boomerang.position);trailGeo.setFromPoints(trailPoints);trailMat.opacity=(state.phase==='flight'||state.phase==='catch'||state.phase==='demo')?.52:0;animatePerson(dt);if(songGain&&audioCtx){const dist=player.position.distanceTo(speaker.position);songGain.gain.setTargetAtTime(.76/(1+dist*.018),audioCtx.currentTime,.18)}
const center=state.phase==='demo'?guide.position:player.position;let desired,target;if(viewMode===0){desired=new THREE.Vector3(center.x+Math.sin(orbit)*7,6.4,center.z+12+Math.cos(orbit)*2);target=new THREE.Vector3(center.x,3.2,center.z-8)}else if(viewMode===1){desired=new THREE.Vector3(center.x+Math.sin(orbit)*18,10.5,center.z+24+Math.cos(orbit)*8);target=new THREE.Vector3(center.x,3.5,center.z-15)}else{desired=new THREE.Vector3(center.x+Math.sin(orbit)*26,15,center.z+8+Math.cos(orbit)*26);target=new THREE.Vector3(0,4,-18)}if((state.phase==='flight'||state.phase==='catch')&&viewMode===0)desired.lerp(new THREE.Vector3(boomerang.position.x*.18,8.2,18.7),.3);camera.position.lerp(desired,1-Math.pow(.001,dt));camera.lookAt(target)}
function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}addEventListener('resize',resize);resize();
function loop(){requestAnimationFrame(loop);update(Math.min(.033,clock.getDelta()));renderer.render(scene,camera)}loop();ui.loading.style.display='none';
$('enter-btn').addEventListener('click',async()=>{started=true;ui.intro.classList.remove('show');ui.hud.classList.remove('hidden');try{await startAudio()}catch(e){console.warn(e)}startDemo()});



/* ============================================================
   I WAS AWAY — BROWSER AUDIO START FIX
   Browsers block audio until the visitor performs an intentional
   click/tap. This overlay starts the song and the experience together.
   ============================================================ */
(() => {
  const music = document.getElementById('bgMusic');
  const enterButton = document.getElementById('enterExperience');
  const soundToggle = document.getElementById('soundToggle');

  if (!music || !enterButton || !soundToggle) return;

  music.volume = 0.78;
  music.loop = true;
  music.preload = 'auto';

  let experienceEntered = false;

  const updateSoundButton = () => {
    const playing = !music.paused && !music.muted;
    soundToggle.textContent = playing ? 'Sound On' : 'Sound Off';
    soundToggle.setAttribute('aria-pressed', String(playing));
  };

  const startExperienceAudio = async () => {
    try {
      music.muted = false;
      await music.play();
      experienceEntered = true;
      document.body.classList.add('experience-entered');
      enterButton.setAttribute('hidden', '');
      updateSoundButton();
    } catch (error) {
      console.warn('Audio could not start yet:', error);
      enterButton.querySelector('.enter-subtitle').textContent =
        'Tap again to begin with sound';
    }
  };

  enterButton.addEventListener('click', startExperienceAudio);
  enterButton.addEventListener('touchend', (event) => {
    event.preventDefault();
    startExperienceAudio();
  }, { passive: false });

  soundToggle.addEventListener('click', async () => {
    if (music.paused) {
      try {
        music.muted = false;
        await music.play();
      } catch (error) {
        console.warn('Audio toggle could not start playback:', error);
      }
    } else {
      music.muted = !music.muted;
    }
    updateSoundButton();
  });

  music.addEventListener('play', updateSoundButton);
  music.addEventListener('pause', updateSoundButton);
  music.addEventListener('volumechange', updateSoundButton);

  // If the game already has a start/enter button, let that same click start audio.
  document.addEventListener('click', async (event) => {
    if (experienceEntered) return;
    const target = event.target.closest(
      'button, [role="button"], .start-button, #startButton, #playButton'
    );
    if (!target || target === soundToggle) return;
    if (target !== enterButton) {
      try {
        music.muted = false;
        await music.play();
        experienceEntered = true;
        document.body.classList.add('experience-entered');
        enterButton.setAttribute('hidden', '');
        updateSoundButton();
      } catch (_) {}
    }
  }, { capture: true });

  updateSoundButton();
})();
