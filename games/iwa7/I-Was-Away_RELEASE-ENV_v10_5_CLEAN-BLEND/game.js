import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js';

const $=id=>document.getElementById(id);
const canvas=$('game');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;renderer.outputColorSpace=THREE.SRGBColorSpace;
const scene=new THREE.Scene();scene.background=new THREE.Color(0x8aa0ad);scene.fog=new THREE.FogExp2(0xb7aa8d,.0036);
const camera=new THREE.PerspectiveCamera(49,1,.1,700);const clock=new THREE.Clock();
let started=false,muted=false,elapsed=0,catches=0,demoDone=false;

// ---- STYLIZED REALISM MATERIAL PIPELINE ----
function texCanvas(kind,size=256){
  const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d');
  const palettes={grass:['#78934d','#829b55','#667e43','#95a861'],dirt:['#aa8b62','#957654','#b89a70','#7d654c'],wood:['#6c452c','#7b5134','#583720','#8a6040'],stone:['#74776f','#85877d','#646860','#939489'],cloth:['#7b7c78','#898985','#686b68','#96958e'],skin:['#9e7157','#a87a5f','#8d6049','#b08064']};
  const p=palettes[kind]||palettes.cloth;x.fillStyle=p[0];x.fillRect(0,0,size,size);
  for(let i=0;i<size*7;i++){
    x.globalAlpha=.08+Math.random()*.12;x.fillStyle=p[(Math.random()*p.length)|0];
    const px=Math.random()*size,py=Math.random()*size;
    if(kind==='wood'){x.fillRect(px,py,1+Math.random()*18,.6+Math.random()*1.5)}
    else if(kind==='cloth'){x.fillRect(px,py,.6+Math.random()*1.3,.6+Math.random()*1.3)}
    else {x.beginPath();x.arc(px,py,.4+Math.random()*2.7,0,Math.PI*2);x.fill()}
  }
  if(kind==='cloth'){x.globalAlpha=.12;x.strokeStyle='#ece9df';for(let i=0;i<size;i+=5){x.beginPath();x.moveTo(i,0);x.lineTo(i,size);x.stroke();x.beginPath();x.moveTo(0,i);x.lineTo(size,i);x.stroke()}}
  if(kind==='wood'){x.globalAlpha=.16;x.strokeStyle='#2f1c12';for(let y=8;y<size;y+=18){x.beginPath();x.moveTo(0,y+Math.sin(y)*2);for(let xx=0;xx<size;xx+=10)x.lineTo(xx,y+Math.sin(xx*.08+y)*2);x.stroke()}}
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return t;
}
const TX={grass:texCanvas('grass',512),dirt:texCanvas('dirt',256),wood:texCanvas('wood',256),stone:texCanvas('stone',256),cloth:texCanvas('cloth',128),skin:texCanvas('skin',128)};
const envTextureLoader=new THREE.TextureLoader();
function loadEnvGround(name,repeatX,repeatY){
  const t=envTextureLoader.load(`./environment_release/${name}`);
  t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(repeatX,repeatY);
  t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return t;
}
function loadGroundArt(name,repeatX,repeatY){
  const t=envTextureLoader.load(`./environment_textures/${name}`);
  t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(repeatX,repeatY);
  t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;t.anisotropy=Math.min(12,renderer.capabilities.getMaxAnisotropy());return t;
}
const GROUND_ART={
  main:loadGroundArt('main_ground.png',15,15),
  dirt:loadGroundArt('dirt_gravel.png',10,10),
  meadow:loadGroundArt('alpine_meadow.png',14,14),
  transition:loadGroundArt('transition_rocky.png',12,12)
};
TX.grass=GROUND_ART.main;
TX.dirt=GROUND_ART.dirt;
TX.stone=GROUND_ART.transition;
TX.wood.repeat.set(2,5);TX.cloth.repeat.set(4,6);TX.skin.repeat.set(2,2);
function mat(color,kind='cloth',rough=.85,metal=0){const m=new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal,map:TX[kind]});m.bumpMap=TX[kind];m.bumpScale=kind==='stone'?.08:kind==='grass'?.12:kind==='wood'?.06:.018;return m}
function mesh(geo,material,cast=true,receive=false){const m=new THREE.Mesh(geo,material);m.castShadow=cast;m.receiveShadow=receive;return m}

// ---- CINEMATIC LIGHT ----
scene.add(new THREE.HemisphereLight(0xd5e8f0,0x4e4a32,2.1));
const sun=new THREE.DirectionalLight(0xffd9a3,5.2);sun.position.set(-38,64,28);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-60;sun.shadow.camera.right=60;sun.shadow.camera.top=60;sun.shadow.camera.bottom=-60;sun.shadow.bias=-.00035;scene.add(sun);
const faceFill=new THREE.DirectionalLight(0xd9e8ff,1.55);faceFill.position.set(18,24,28);scene.add(faceFill);
const warmFill=new THREE.DirectionalLight(0xffd2aa,.85);warmFill.position.set(-18,12,16);scene.add(warmFill);
const fill=new THREE.DirectionalLight(0xaecde6,1.0);fill.position.set(45,22,-35);scene.add(fill);
const rim=new THREE.DirectionalLight(0xf3b775,.85);rim.position.set(-25,18,-70);scene.add(rim);

// ---- V10.5 CLEAN BLEND SKY / ATMOSPHERE ----
// A cool blue upper sky replaces the previous burgundy cast. Warmth is confined to the horizon,
// which keeps the golden-hour panorama while allowing the camera to tilt upward naturally.
const skyMat=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,depthTest:false,uniforms:{top:{value:new THREE.Color(0x2f78bd)},mid:{value:new THREE.Color(0x72b6e6)},horizon:{value:new THREE.Color(0xf6c28b)},low:{value:new THREE.Color(0xf1a75f)}},vertexShader:`varying vec3 w;void main(){w=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`uniform vec3 top,mid,horizon,low;varying vec3 w;void main(){float h=normalize(w).y;vec3 c=mix(low,horizon,smoothstep(-.12,.04,h));c=mix(c,mid,smoothstep(.00,.34,h));c=mix(c,top,smoothstep(.32,.90,h));gl_FragColor=vec4(c,1.);}`});
const skyDome=new THREE.Mesh(new THREE.SphereGeometry(420,48,28),skyMat);skyDome.renderOrder=-1200;scene.add(skyDome);

// Firefly blue-sky panorama supplies real cloud texture above the landscape without ever crossing
// in front of characters. It is deliberately background-only and fades into the landscape horizon.
const skyPano=envTextureLoader.load('./environment_cinematic/sky_panorama.png');
skyPano.colorSpace=THREE.SRGBColorSpace;skyPano.wrapS=THREE.RepeatWrapping;skyPano.wrapT=THREE.ClampToEdgeWrapping;skyPano.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
const skyBandMat=new THREE.ShaderMaterial({side:THREE.BackSide,transparent:true,depthWrite:false,depthTest:false,fog:false,toneMapped:false,uniforms:{map:{value:skyPano},opacity:{value:.88}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`uniform sampler2D map;uniform float opacity;varying vec2 vUv;void main(){vec4 c=texture2D(map,vUv);float bottom=smoothstep(.02,.22,vUv.y);float top=1.-smoothstep(.96,1.,vUv.y);gl_FragColor=vec4(c.rgb,c.a*opacity*bottom*top);}`});
const skyBand=new THREE.Mesh(new THREE.CylinderGeometry(268,268,170,192,1,true),skyBandMat);skyBand.position.y=92;skyBand.rotation.y=Math.PI*.125;skyBand.renderOrder=-1100;scene.add(skyBand);

// Landscape panorama is vertically feathered at BOTH edges. This removes the hard image top/bottom
// and the orange ring where photography previously met the playable ground.
const cinematicPano=envTextureLoader.load('./environment_cinematic/panorama_seamless.png');
cinematicPano.colorSpace=THREE.SRGBColorSpace;cinematicPano.wrapS=THREE.RepeatWrapping;cinematicPano.wrapT=THREE.ClampToEdgeWrapping;cinematicPano.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
const panoMat=new THREE.ShaderMaterial({side:THREE.BackSide,transparent:true,depthWrite:false,depthTest:false,fog:false,toneMapped:false,uniforms:{map:{value:cinematicPano},opacity:{value:.98}},vertexShader:`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`uniform sampler2D map;uniform float opacity;varying vec2 vUv;void main(){vec4 c=texture2D(map,vUv);float lower=smoothstep(.07,.28,vUv.y);float upper=1.-smoothstep(.84,.985,vUv.y);float a=lower*upper*opacity;gl_FragColor=vec4(c.rgb,a);}`});
const panoShell=new THREE.Mesh(new THREE.CylinderGeometry(248,248,124,192,1,true),panoMat);panoShell.position.y=35;panoShell.rotation.y=Math.PI*.125;panoShell.renderOrder=-1000;scene.add(panoShell);

// Broad, cool-warm atmospheric transition hides the remaining ground/world join without a colored band.
const horizonVeil=new THREE.Mesh(new THREE.CylinderGeometry(220,220,26,160,1,true),new THREE.MeshBasicMaterial({color:0xc8d5c2,transparent:true,opacity:.055,side:THREE.BackSide,depthWrite:false,depthTest:false,fog:false}));
horizonVeil.position.y=7;horizonVeil.renderOrder=-900;scene.add(horizonVeil);
const sunDisc=new THREE.Mesh(new THREE.SphereGeometry(4.2,24,16),new THREE.MeshBasicMaterial({color:0xffe7b6}));sunDisc.position.set(-48,42,-155);scene.add(sunDisc);

const haloCanvas=document.createElement('canvas');haloCanvas.width=256;haloCanvas.height=256;const hx=haloCanvas.getContext('2d');const grad=hx.createRadialGradient(128,128,12,128,128,118);grad.addColorStop(0,'rgba(255,245,215,0.96)');grad.addColorStop(.25,'rgba(255,221,153,0.45)');grad.addColorStop(.6,'rgba(255,191,97,0.13)');grad.addColorStop(1,'rgba(255,191,97,0)');hx.fillStyle=grad;hx.fillRect(0,0,256,256);const haloTexture=new THREE.CanvasTexture(haloCanvas);haloTexture.colorSpace=THREE.SRGBColorSpace;const sunHalo=new THREE.Sprite(new THREE.SpriteMaterial({map:haloTexture,transparent:true,depthWrite:false,depthTest:false}));sunHalo.position.copy(sunDisc.position);sunHalo.scale.set(54,54,1);scene.add(sunHalo);
const hazeBand=new THREE.Mesh(new THREE.PlaneGeometry(280,48),new THREE.MeshBasicMaterial({color:0xf5d7aa,transparent:true,opacity:.10,depthWrite:false}));hazeBand.position.set(0,8,-128);scene.add(hazeBand);
const dustCount=220;const dustPos=new Float32Array(dustCount*3);const dustSeed=[];for(let i=0;i<dustCount;i++){dustPos[i*3+0]=(Math.random()-.5)*160;dustPos[i*3+1]=1.8+Math.random()*16;dustPos[i*3+2]=-8-Math.random()*140;dustSeed.push(Math.random()*6.28)}const dustGeo=new THREE.BufferGeometry();dustGeo.setAttribute('position',new THREE.BufferAttribute(dustPos,3));const dustMat=new THREE.PointsMaterial({color:0xffe8bf,size:.18,transparent:true,opacity:.34,depthWrite:false,sizeAttenuation:true});const dust=new THREE.Points(dustGeo,dustMat);scene.add(dust);
const ridgeBands=[];for(let i=0;i<3;i++){const ridge=new THREE.Mesh(new THREE.PlaneGeometry(300,10+5*i,100,1),new THREE.MeshBasicMaterial({color:[0x68705f,0x7f846d,0x9c9276][i],transparent:true,opacity:.095-.018*i,depthWrite:false}));ridge.position.set((i-1)*10,1.8+i*1.3,-178-i*18);ridgeBands.push(ridge);scene.add(ridge)}


// ---- V10.4 TEXTURED GROUND SYSTEM ----
// Firefly-generated photoreal ground art replaces the older procedural-looking visible surface.
// Code still supplies terrain geometry/collision; the visible surface now comes from art tiles.

// ---- TERRAIN ----
const groundGeo=new THREE.PlaneGeometry(360,360,180,180);const pa=groundGeo.attributes.position;
for(let i=0;i<pa.count;i++){
  const x=pa.getX(i),y=pa.getY(i);
  const base=Math.sin(x*.028)*.76+Math.cos(y*.025)*.56+Math.sin((x-y)*.015)*.52+Math.sin(Math.hypot(x,y)*.022)*.28;
  const r=Math.hypot(x,y+5.5);let t=THREE.MathUtils.clamp((r-18)/28,0,1);t=t*t*(3-2*t);
  const drop=t*16.5;
  pa.setZ(i,base-drop);
}
pa.needsUpdate=true;groundGeo.computeVertexNormals();
const ground=mesh(groundGeo,new THREE.MeshStandardMaterial({color:0xffffff,map:GROUND_ART.main,bumpMap:GROUND_ART.main,bumpScale:.095,roughness:.96}),false,true);ground.rotation.x=-Math.PI/2;scene.add(ground);

// Short, natural footpath only on the playable overlook. It no longer runs into the distant world.
const pathCurve=new THREE.CatmullRomCurve3([new THREE.Vector3(-4,.06,16),new THREE.Vector3(-1,.08,10),new THREE.Vector3(2,.07,5),new THREE.Vector3(1,.06,-1),new THREE.Vector3(-2,.05,-8)]);
const path=mesh(new THREE.TubeGeometry(pathCurve,72,1.28,12,false),new THREE.MeshStandardMaterial({color:0xffffff,map:GROUND_ART.dirt,bumpMap:GROUND_ART.dirt,bumpScale:.065,roughness:1,transparent:true,opacity:.78}),false,true);path.scale.y=.012;scene.add(path);

// Irregular ledge patches break up the ground tile and visually merge the playable surface into the alpine background.
function irregularPatch(radius,segments=72,seed=1){const pts=[];for(let i=0;i<segments;i++){const a=i/segments*Math.PI*2;const rr=radius*(.88+.08*Math.sin(i*1.73+seed)+.045*Math.sin(i*4.11+seed*.7));pts.push(new THREE.Vector2(Math.cos(a)*rr,Math.sin(a)*rr));}return new THREE.ShapeGeometry(new THREE.Shape(pts));}
const overlook=new THREE.Mesh(irregularPatch(16.7,84,2.4),new THREE.MeshStandardMaterial({color:0xffffff,map:GROUND_ART.transition,bumpMap:GROUND_ART.transition,bumpScale:.085,roughness:.98,transparent:true,opacity:.55}));
overlook.rotation.x=-Math.PI/2;overlook.position.set(0,.075,5.5);overlook.receiveShadow=true;scene.add(overlook);
const overlookInner=new THREE.Mesh(irregularPatch(11.2,72,4.6),new THREE.MeshStandardMaterial({color:0xffffff,map:GROUND_ART.meadow,bumpMap:GROUND_ART.meadow,bumpScale:.055,roughness:.99,transparent:true,opacity:.32}));
overlookInner.rotation.x=-Math.PI/2;overlookInner.position.set(0,.087,5.5);overlookInner.receiveShadow=true;scene.add(overlookInner);

// Multi-depth atmospheric veils create a soft transition from real geometry into the photographic valley.
const valleyVeilMat=new THREE.MeshBasicMaterial({color:0xe8c29a,transparent:true,opacity:.07,depthWrite:false,side:THREE.DoubleSide});
for(let i=0;i<5;i++){const v=new THREE.Mesh(new THREE.PlaneGeometry(210,16+i*7),valleyVeilMat.clone());v.position.set((i-2)*9,7+i*2.8,-64-i*25);v.material.opacity=.068-.008*i;scene.add(v);}


// distant rolling ridges
const ridgeMats=[0x5e7856,0x71895f,0x879c68,0x9caf75].map((c,i)=>new THREE.MeshStandardMaterial({color:c,roughness:1}));
for(let layer=0;layer<4;layer++)for(let i=0;i<8;i++){const r=23+i%3*7+layer*2;const h=9+(i*5+layer*7)%12;const m=mesh(new THREE.SphereGeometry(r,26,14),ridgeMats[layer],false,true);m.scale.set(1.6,.30+.04*layer,.66);m.position.set((i-3.6)*42+(layer%2)*16,-3,-105-layer*28-(i%2)*8);scene.add(m)}

// ---- RELEASE ENVIRONMENT: ASSET-DRIVEN VEGETATION ----
function envHeight(x,z){const y=-z;const base=Math.sin(x*.028)*.76+Math.cos(y*.025)*.56+Math.sin((x-y)*.015)*.52+Math.sin(Math.hypot(x,y)*.022)*.28;const r=Math.hypot(x,y+5.5);let t=THREE.MathUtils.clamp((r-18)/28,0,1);t=t*t*(3-2*t);return base-t*16.5;}
function loadEnvAlpha(name){const t=envTextureLoader.load(`./environment_release/${name}`);t.colorSpace=THREE.SRGBColorSpace;t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return t;}
const ENV_TREE=Array.from({length:4},(_,i)=>loadEnvAlpha(`tree_0${i+1}.png`));
const ENV_ROCK=Array.from({length:4},(_,i)=>loadEnvAlpha(`rock_0${i+1}.png`));
const ENV_GRASS=Array.from({length:5},(_,i)=>loadEnvAlpha(`grass_0${i+1}.png`));
const ENV_FLOWER=Array.from({length:4},(_,i)=>loadEnvAlpha(`flower_0${i+1}.png`));
const envActors=[];
function softShadow(x,z,sx,sz,opacity=.18){const sh=new THREE.Mesh(new THREE.CircleGeometry(1,28),new THREE.MeshBasicMaterial({color:0x162314,transparent:true,opacity,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.set(x,envHeight(x,z)+.035,z);sh.scale.set(sx,sz,1);scene.add(sh);return sh;}
function crossTree(x,z,s=1,variant=0,rot=0){
  const g=new THREE.Group();const mat=new THREE.MeshBasicMaterial({map:ENV_TREE[variant%ENV_TREE.length],transparent:true,alphaTest:.025,side:THREE.DoubleSide,depthWrite:true,toneMapped:false});
  const geo=new THREE.PlaneGeometry(4.0*s,6.6*s);geo.translate(0,3.3*s,0);
  for(const a of [0,Math.PI/2]){const p=new THREE.Mesh(geo,mat.clone());p.rotation.y=a+rot;g.add(p)}
  g.position.set(x,envHeight(x,z),z);scene.add(g);softShadow(x,z,1.55*s,.7*s,.19);return g;
}
function envSprite(texture,x,z,w,h,opacity=1,rot=0){
  const mat=new THREE.SpriteMaterial({map:texture,transparent:true,alphaTest:.025,depthWrite:true,depthTest:true,toneMapped:false,opacity});
  const sp=new THREE.Sprite(mat);sp.center.set(.5,0);sp.position.set(x,envHeight(x,z)+.03,z);sp.scale.set(w,h,1);sp.material.rotation=rot;scene.add(sp);return sp;
}
function seeded(seed){return ()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296}}
const envRand=seeded(2409);
// Hero tree composition: large foreground framing trees, medium field trees, distant silhouettes.
const heroTrees=[[-24,-10,1.22,0],[-34,-28,1.05,1],[26,-18,1.18,2],[38,-36,.95,3],[-22,-58,.86,2],[24,-66,.84,1],[-42,-82,.78,0],[43,-92,.74,3]];
for(const [x,z,s,v] of heroTrees)crossTree(x,z,s,v,(envRand()-.5)*.32);
for(let i=0;i<22;i++){
  const side=i%2?1:-1;const x=side*(17+envRand()*65);const z=-20-envRand()*122;const s=.48+envRand()*.52;crossTree(x,z,s,i%4,(envRand()-.5)*.5);
}
// Asset rocks and field clumps kept outside the central catching corridor.
for(let i=0;i<42;i++){
  const side=i%2?1:-1;const x=side*(7+envRand()*43);const z=-5-envRand()*110;const s=.72+envRand()*1.15;envSprite(ENV_ROCK[i%4],x,z,2.4*s,1.55*s,.98,(envRand()-.5)*.06);softShadow(x,z,.8*s,.35*s,.14);
}
for(let i=0;i<115;i++){
  const a=envRand()*Math.PI*2,r=10+Math.pow(envRand(),.72)*72;let x=Math.cos(a)*r,z=Math.sin(a)*r-26;if(Math.abs(x)<6&&z>-58) x+=(x>=0?1:-1)*(7+envRand()*8);
  const s=.48+envRand()*.7;envSprite(ENV_GRASS[i%5],x,z,1.45*s,.95*s,.97,(envRand()-.5)*.06);
}
for(let i=0;i<52;i++){
  const a=envRand()*Math.PI*2,r=12+envRand()*62;let x=Math.cos(a)*r,z=Math.sin(a)*r-24;if(Math.abs(x)<5&&z>-50)x+=(x>=0?1:-1)*8;
  const s=.55+envRand()*.55;envSprite(ENV_FLOWER[i%4],x,z,1.25*s,.88*s,.98,(envRand()-.5)*.04);
}
// A few low, distant atmospheric meadow cards create depth without blocking gameplay.
for(let i=0;i<18;i++){const x=(envRand()-.5)*150,z=-84-envRand()*70,s=.85+envRand()*.75;envSprite(ENV_GRASS[(i+2)%5],x,z,2.3*s,1.45*s,.72);}

// Photographic material breakup: small, soft-edged art patches interrupt obvious UV repetition.
const patchAlphaCanvas=document.createElement('canvas');patchAlphaCanvas.width=256;patchAlphaCanvas.height=256;
const pax=patchAlphaCanvas.getContext('2d');const pg=pax.createRadialGradient(128,128,22,128,128,126);pg.addColorStop(0,'rgba(255,255,255,.92)');pg.addColorStop(.58,'rgba(255,255,255,.68)');pg.addColorStop(1,'rgba(255,255,255,0)');pax.fillStyle=pg;pax.fillRect(0,0,256,256);
const patchAlpha=new THREE.CanvasTexture(patchAlphaCanvas);
const groundPatchTextures=[GROUND_ART.meadow,GROUND_ART.dirt,GROUND_ART.transition];
const groundPatchMats=groundPatchTextures.map((t,i)=>new THREE.MeshStandardMaterial({map:t,bumpMap:t,bumpScale:.035,roughness:.99,transparent:true,opacity:[.22,.14,.18][i],alphaMap:patchAlpha,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1}));
for(let i=0;i<18;i++){
  const rr=3.8+envRand()*5.8,a=envRand()*Math.PI*2,r=3+envRand()*18;const x=Math.cos(a)*r,z=Math.sin(a)*r+3;
  const p=new THREE.Mesh(new THREE.CircleGeometry(rr,36),groundPatchMats[i%groundPatchMats.length]);
  p.position.set(x,envHeight(x,z)+.035,z);p.rotation.x=-Math.PI/2;p.rotation.z=envRand()*Math.PI*2;p.scale.y=.58+envRand()*.42;scene.add(p);
}

// ---- GRASS, FLOWERS, CLOUDS, LIFE ----
const grasses=[];const bladeGeo=new THREE.PlaneGeometry(.12,1.0);bladeGeo.translate(0,.5,0);const bladeMats=[0x466a36,0x587942,0x6f8749,0x8a914d].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:1,side:THREE.DoubleSide}));
for(let i=0;i<300;i++){const m=mesh(bladeGeo,bladeMats[i%bladeMats.length],false,false);const a=Math.random()*Math.PI*2,r=3+Math.pow(Math.random(),.62)*105;m.position.set(Math.cos(a)*r,0,Math.sin(a)*r-26);m.rotation.y=Math.random()*Math.PI;m.scale.setScalar(.35+Math.random()*.85);m.userData.phase=Math.random()*6.28;grasses.push(m);scene.add(m)}
const flowerColors=[0xe9c56a,0xe8dfc7,0xb36a58,0x7996b8];for(let i=0;i<48;i++){const g=new THREE.Group();const stem=mesh(new THREE.CylinderGeometry(.013,.018,.48,5),new THREE.MeshStandardMaterial({color:0x50713c,roughness:1}),false);stem.position.y=.24;g.add(stem);for(let p=0;p<5;p++){const petal=new THREE.Mesh(new THREE.CircleGeometry(.075,8),new THREE.MeshBasicMaterial({color:flowerColors[i%flowerColors.length],side:THREE.DoubleSide}));petal.position.set(Math.cos(p*1.256)*.06,.5,Math.sin(p*1.256)*.06);petal.rotation.x=-Math.PI/2;g.add(petal)}const a=Math.random()*Math.PI*2,r=7+Math.random()*65;g.position.set(Math.cos(a)*r,0,Math.sin(a)*r-22);scene.add(g)}
const clouds=[];
function makeCloudTexture(){const c=document.createElement('canvas');c.width=512;c.height=256;const x=c.getContext('2d');x.clearRect(0,0,512,256);const blobs=[[150,145,95],[225,115,112],[315,142,102],[370,155,72],[95,165,60]];for(const [cx,cy,r] of blobs){const g=x.createRadialGradient(cx,cy,r*.08,cx,cy,r);g.addColorStop(0,'rgba(255,252,241,.92)');g.addColorStop(.62,'rgba(247,241,224,.74)');g.addColorStop(1,'rgba(247,241,224,0)');x.fillStyle=g;x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.fill()}return new THREE.CanvasTexture(c)}
const cloudTexture=makeCloudTexture();cloudTexture.colorSpace=THREE.SRGBColorSpace;
for(let i=0;i<13;i++){const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:cloudTexture,transparent:true,opacity:.36+.18*Math.random(),depthWrite:false,depthTest:true,toneMapped:false}));sp.position.set(-120+Math.random()*240,30+Math.random()*28,-105-Math.random()*140);const s=18+Math.random()*25;sp.scale.set(s*2,s,1);clouds.push(sp);scene.add(sp)}
const butterflies=[];for(let i=0;i<8;i++){const g=new THREE.Group(),wm=new THREE.MeshBasicMaterial({color:i%2?0xd7a548:0x6f91ad,side:THREE.DoubleSide});const l=new THREE.Mesh(new THREE.CircleGeometry(.1,9,0,Math.PI),wm),r=new THREE.Mesh(new THREE.CircleGeometry(.1,9,0,Math.PI),wm);l.position.x=-.08;r.position.x=.08;r.rotation.z=Math.PI;g.add(l,r);g.position.set((Math.random()-.5)*28,2+Math.random()*3,-4-Math.random()*34);g.userData={phase:Math.random()*6.28,base:g.position.clone(),l,r};butterflies.push(g);scene.add(g)}
const windRibbons=[];for(let i=0;i<7;i++){const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-8,1.4,-10-i*7),new THREE.Vector3(-1,2.1,-14-i*7),new THREE.Vector3(7,1.7,-18-i*7)]);const m=new THREE.Mesh(new THREE.TubeGeometry(curve,28,.018,5,false),new THREE.MeshBasicMaterial({color:0xffe7b2,transparent:true,opacity:.09}));m.userData.phase=i*.7;windRibbons.push(m);scene.add(m)}


function terrainHeightAt(x,z){return envHeight(x,z);}
function placeActorOnGround(actor,footLift=.14){
  actor.position.y=terrainHeightAt(actor.position.x,actor.position.z)+footLift;
}
function placeZoneAt(x,z){
  zoneMesh.position.set(x,terrainHeightAt(x,z)+.03,z);
}

// ---- FIREFLY SMOOTH 16-DIRECTION + BRIDGE CHARACTER SYSTEM ----
const spriteLoader=new THREE.TextureLoader();
function loadActorTexture(name){
  const t=spriteLoader.load(`./sprites_firefly/${name}`);
  t.colorSpace=THREE.SRGBColorSpace;t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;
  t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return t;
}
const DIRS=['front','front_right','right','back_right','back','back_left','left','front_left'];
const DIR_ANGLE={front:0,front_right:Math.PI/4,right:Math.PI/2,back_right:3*Math.PI/4,back:Math.PI,back_left:-3*Math.PI/4,left:-Math.PI/2,front_left:-Math.PI/4};
const FIREFLY_STATES=['idle_hold','windup_hold','release_empty','catch_ready_empty','catch_contact_empty','catch_contact_hold','catch_chest_hold','catch_overhead_hold','catch_onehand_hold','catch_trick_hold','miss_empty'];
const ACTOR_TX={};
for(const stateName of FIREFLY_STATES){
  ACTOR_TX[stateName]={};
  for(const d of DIRS) ACTOR_TX[stateName][d]=loadActorTexture(`${stateName}_${d}.png`);
}
// Firefly midpoint views sit halfway between the original 45-degree directions.
const MID_KEYS=['m22','m67','m112','m157','m202','m247','m292','m337'];
const MID_ANGLE={m22:Math.PI/8,m67:3*Math.PI/8,m112:5*Math.PI/8,m157:7*Math.PI/8,m202:-7*Math.PI/8,m247:-5*Math.PI/8,m292:-3*Math.PI/8,m337:-Math.PI/8};
const MIDPOINT_TX={};
for(const stateName of ['idle_hold','catch_ready_empty','release_empty','catch_chest_hold']){
  MIDPOINT_TX[stateName]={};
  const filePrefix=stateName==='catch_chest_hold'?'catch_secured':stateName;
  for(const k of MID_KEYS) MIDPOINT_TX[stateName][k]=loadActorTexture(`${filePrefix}_${k}.png`);
}
// Empty wait is a dedicated return-flight state generated as eight midpoint views.
const EMPTY_WAIT_TX={};
for(const k of MID_KEYS) EMPTY_WAIT_TX[k]=loadActorTexture(`empty_wait_${k}.png`);

const BRIDGE_DIRS=['front_right','right','back_right','back'];
const BRIDGE_ANGLE={front_right:Math.PI/4,right:Math.PI/2,back_right:3*Math.PI/4,back:Math.PI};
const BRIDGE_TX={};
for(const stateName of []){
  BRIDGE_TX[stateName]={};
  for(const d of BRIDGE_DIRS) BRIDGE_TX[stateName][d]=[loadActorTexture(`${stateName}_${d}_0.png`),loadActorTexture(`${stateName}_${d}_1.png`)];
}
// ---- V10.2 SURGICALLY CUT STATES ----
// These were extracted with a subject mask, not a white-color key, so pale denim highlights remain opaque.
function loadV102Texture(name){
  const t=spriteLoader.load(`./sprites_v102/${name}`);
  t.colorSpace=THREE.SRGBColorSpace;t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;
  t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return t;
}
const V102_SEQ={};
for(const n of ['throw_chest','throw_dip','throw_low','recovery','track_wait','lookout']){
  V102_SEQ[n]=Array.from({length:8},(_,i)=>loadV102Texture(`${n}_${i}.png`));
}
const WALK_V102={right:{},left:{}};
for(let i=0;i<DIRS.length;i++){
  WALK_V102.right[DIRS[i]]=loadV102Texture(`walk_right_${i}.png`);
  WALK_V102.left[DIRS[i]]=loadV102Texture(`walk_left_${i}.png`);
}
const VIEW8=DIRS.map(k=>({key:k,ang:DIR_ANGLE[k],mid:false}));
const VIEW16=[...VIEW8,...MID_KEYS.map(k=>({key:k,ang:MID_ANGLE[k],mid:true}))].sort((a,b)=>a.ang-b.ang);
const VIEWMID8=MID_KEYS.map(k=>({key:k,ang:MID_ANGLE[k],mid:true}));
const VIEWBRIDGE4=BRIDGE_DIRS.map(k=>({key:k,ang:BRIDGE_ANGLE[k],mid:false}));
const CROSSFADE_TIME=.155;
const SMEAR_TIME=.19;
function makeSpriteActor(height=5.7){
  const g=new THREE.Group();
  const makeLayer=(opacity=1)=>{const mat=new THREE.SpriteMaterial({map:null,transparent:true,opacity,alphaTest:.018,depthWrite:false,depthTest:true,toneMapped:false});const sp=new THREE.Sprite(mat);sp.center.set(.5,0);sp.position.set(0,.02,0);sp.scale.set(height*.667,height,1);g.add(sp);return sp};
  const main=makeLayer(1),fade=makeLayer(0),ghostA=makeLayer(0),ghostB=makeLayer(0);
  ghostA.position.z=-.015;ghostB.position.z=-.03;
  const shadow=new THREE.Mesh(new THREE.CircleGeometry(.72,30),new THREE.MeshBasicMaterial({color:0x132015,transparent:true,opacity:.22,depthWrite:false}));
  shadow.rotation.x=-Math.PI/2;shadow.position.y=.018;shadow.scale.set(1.15,.48,1);g.add(shadow);
  g.userData.sprite=main;g.userData.main=main;g.userData.fade=fade;g.userData.ghostA=ghostA;g.userData.ghostB=ghostB;g.userData.baseHeight=height;g.userData.facing=0;g.userData.viewKey=null;g.userData.viewAngle=null;g.userData.fadeT=CROSSFADE_TIME;g.userData.smearT=0;return g;
}
function normAng(a){while(a<=-Math.PI)a+=Math.PI*2;while(a>Math.PI)a-=Math.PI*2;return a}
function relativeCameraAngle(actor){
  const toCam=Math.atan2(camera.position.x-actor.position.x,camera.position.z-actor.position.z);
  return normAng(toCam-(actor.userData.facing||0));
}
function chooseCandidate(rel,candidates,currentKey){
  let best=candidates[0],bestd=1e9;
  for(const c of candidates){const d=Math.abs(normAng(rel-c.ang));if(d<bestd){bestd=d;best=c}}
  if(currentKey){
    const cur=candidates.find(c=>c.key===currentKey);
    if(cur){
      const step=candidates.length>=16?Math.PI/8:candidates.length>=8?Math.PI/4:Math.PI/4;
      const limit=step/2+THREE.MathUtils.degToRad(candidates.length>=16?3.5:6.5);
      if(Math.abs(normAng(rel-cur.ang))<=limit)return cur;
    }
  }
  return best;
}
function resolveActorTexture(actor,stateName,frameIndex=0){
  const rel=relativeCameraAngle(actor);
  if(stateName==='walk_right'||stateName==='walk_left'){
    const pick=chooseCandidate(rel,VIEW8,actor.userData.viewKey);
    const leg=stateName==='walk_right'?'right':'left';
    return {tx:WALK_V102[leg][pick.key],key:pick.key,ang:pick.ang};
  }
  if(V102_SEQ[stateName]){
    const idx=Math.max(0,Math.min(7,frameIndex|0));
    return {tx:V102_SEQ[stateName][idx],key:`${stateName}_${idx}`,ang:actor.userData.viewAngle??0};
  }
  if(BRIDGE_TX[stateName]){
    const pick=chooseCandidate(rel,VIEWBRIDGE4,actor.userData.viewKey);
    return {tx:BRIDGE_TX[stateName][pick.key][Math.max(0,Math.min(1,frameIndex|0))],key:pick.key,ang:pick.ang};
  }
  if(stateName==='empty_wait'){
    const pick=chooseCandidate(rel,VIEWMID8,actor.userData.viewKey);
    return {tx:EMPTY_WAIT_TX[pick.key],key:pick.key,ang:pick.ang};
  }
  if(!ACTOR_TX[stateName])stateName='idle_hold';
  const candidates=MIDPOINT_TX[stateName]?VIEW16:VIEW8;
  const pick=chooseCandidate(rel,candidates,actor.userData.viewKey);
  const tx=pick.mid&&MIDPOINT_TX[stateName]?MIDPOINT_TX[stateName][pick.key]:ACTOR_TX[stateName][pick.key];
  return {tx,key:pick.key,ang:pick.ang};
}
function setActorFrame(actor,stateName,frameIndex=0){
  const resolved=resolveActorTexture(actor,stateName,frameIndex),tx=resolved.tx,key=resolved.key;
  const frameKey=`${stateName}:${key}:${frameIndex|0}`;
  if(actor.userData.lastFrameKey===frameKey)return;
  const oldTx=actor.userData.main.material.map;
  const oldAngle=actor.userData.viewAngle;
  const directionChanged=oldAngle!=null&&Math.abs(normAng(resolved.ang-oldAngle))>.01;
  if(!oldTx){actor.userData.main.material.map=tx;actor.userData.main.material.needsUpdate=true;actor.userData.main.material.opacity=1}
  else{
    actor.userData.fade.material.map=oldTx;actor.userData.fade.material.needsUpdate=true;actor.userData.fade.material.opacity=1;
    actor.userData.main.material.map=tx;actor.userData.main.material.needsUpdate=true;actor.userData.main.material.opacity=0;actor.userData.fadeT=0;
    if(directionChanged){actor.userData.ghostA.material.map=oldTx;actor.userData.ghostB.material.map=tx;actor.userData.ghostA.material.needsUpdate=true;actor.userData.ghostB.material.needsUpdate=true;actor.userData.ghostA.material.opacity=.19;actor.userData.ghostB.material.opacity=.11;const sign=normAng(resolved.ang-(oldAngle||0))>=0?1:-1;actor.userData.ghostA.position.x=.045*sign;actor.userData.ghostB.position.x=.085*sign;actor.userData.smearT=SMEAR_TIME}
  }
  actor.userData.viewKey=key;actor.userData.viewAngle=resolved.ang;actor.userData.lastFrameKey=frameKey;actor.userData.sprite=actor.userData.main;
}
function updateActorTransition(actor,dt){
  if(actor.userData.fadeT<CROSSFADE_TIME){actor.userData.fadeT=Math.min(CROSSFADE_TIME,actor.userData.fadeT+dt);const t=actor.userData.fadeT/CROSSFADE_TIME;const e=t*t*(3-2*t);actor.userData.main.material.opacity=e;actor.userData.fade.material.opacity=1-e}else{actor.userData.main.material.opacity=1;actor.userData.fade.material.opacity=0}
  if(actor.userData.smearT>0){actor.userData.smearT=Math.max(0,actor.userData.smearT-dt);const k=actor.userData.smearT/SMEAR_TIME;actor.userData.ghostA.material.opacity=.19*k*k;actor.userData.ghostB.material.opacity=.11*k*k;actor.userData.ghostA.position.x*=.89;actor.userData.ghostB.position.x*=.89}else{actor.userData.ghostA.material.opacity=0;actor.userData.ghostB.material.opacity=0}
}
const player=makeSpriteActor(5.75);player.position.set(1.3,0,7);placeActorOnGround(player,.15);scene.add(player);
// Until a separate Firefly guide pack exists, the tutorial guide intentionally reuses the player pack.
const guide=makeSpriteActor(5.55);guide.position.set(-2.1,0,7.4);placeActorOnGround(guide,.15);scene.add(guide);
const guideHome=new THREE.Vector3(-2.1,0,7.4);
const guideMoveTarget=guideHome.clone();
let guideAvoidActive=false;
player.userData.sourceLabel='FIREFLY 16-DIRECTION + BRIDGE PACK';guide.userData.sourceLabel='FIREFLY 16-DIRECTION + BRIDGE PACK';

// prop speaker
const speaker=new THREE.Group();const sp=mesh(new THREE.BoxGeometry(1.05,.62,.52),new THREE.MeshStandardMaterial({color:0x181b1f,roughness:.62}));sp.position.y=.4;speaker.add(sp);for(const x of[-.29,.29]){const c=mesh(new THREE.CylinderGeometry(.16,.16,.04,20),new THREE.MeshStandardMaterial({color:0x293b48,roughness:.5}),false);c.rotation.x=Math.PI/2;c.position.set(x,.4,-.28);speaker.add(c)}speaker.position.set(-3.5,terrainHeightAt(-3.5,6.1)+.02,6.1);scene.add(speaker);

// ---- FIREFLY LIVE BOOMERANG ----
function loadBoomTexture(name){const t=spriteLoader.load(`./boomerang_firefly/${name}`);t.colorSpace=THREE.SRGBColorSpace;t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return t}
const BOOM_TX={
  spin:Array.from({length:16},(_,i)=>loadBoomTexture(`spin_${String(i).padStart(2,'0')}.png`)),
  bank:Array.from({length:16},(_,i)=>loadBoomTexture(`bank_${String(i).padStart(2,'0')}.png`)),
  ret:Array.from({length:16},(_,i)=>loadBoomTexture(`return_${String(i).padStart(2,'0')}.png`))
};
const boomerangMat=new THREE.SpriteMaterial({map:BOOM_TX.spin[0],transparent:true,alphaTest:.02,depthWrite:true,depthTest:true,toneMapped:false});
const boomerang=new THREE.Sprite(boomerangMat);boomerang.center.set(.5,.5);boomerang.scale.set(2.35,1.57,1);boomerang.visible=false;scene.add(boomerang);
function setBoomFrame(u=0){
  const spin=Math.floor(elapsed*84)%16;
  let bank=BOOM_TX.spin;
  let idx=spin;
  let phase='OUTBOUND';
  if(u>.28&&u<.64){bank=BOOM_TX.bank;idx=Math.floor((elapsed*52 + ((u-.28)/.36)*16))%16;phase='ARC';}
  else if(u>=.64){bank=BOOM_TX.ret;idx=Math.floor((elapsed*74 + ((u-.64)/.36)*16))%16;phase='RETURN';}
  boomerang.material.map=bank[idx];
  boomerang.material.needsUpdate=true;
  const fastSpin=elapsed*42;
  boomerang.material.rotation=fastSpin;
  const wobble=.14+Math.abs(Math.sin(elapsed*26))*.06;
  boomerang.scale.set(2.25+wobble,1.46+wobble*.62,1);
  boomerang.position.y+=Math.sin(elapsed*30)*.015;
  const spinRate=(bank===BOOM_TX.spin?3.6:(bank===BOOM_TX.bank?4.2:5.0));
  updateBoomPip(bank[idx],u,phase,spinRate);
}

function updateBoomPip(texture,u=0,phase='STANDBY',spinRate=1){
  if(!boomPip||!boomPipImg||!boomPipState||!boomPipFill||!boomPipSpeed)return;
  const active = (state.phase==='flight'||state.phase==='catch'||state.phase==='demo') && boomerang.visible;
  boomPip.classList.toggle('hidden',!active);
  if(!active)return;
  const img=texture&&texture.image ? texture.image : null;
  const src=img && (img.currentSrc || img.src) ? (img.currentSrc || img.src) : '';
  if(src && boomPipImg.src!==src) boomPipImg.src=src;
  boomPipState.textContent=phase;
  boomPipSpeed.textContent=`SPIN ×${spinRate.toFixed(1)}`;
  boomPipFill.style.width=`${Math.max(0,Math.min(100,u*100))}%`;
  const rot=(elapsed*spinRate*820)%360;
  boomPipImg.style.transform=`translate(-50%,-50%) rotate(${rot}deg)`;
}
function hideBoomPip(){if(boomPip)boomPip.classList.add('hidden');}
const trailPoints=Array.from({length:26},()=>new THREE.Vector3());const trailGeo=new THREE.BufferGeometry().setFromPoints(trailPoints);const trailMat=new THREE.LineBasicMaterial({color:0xf6cf74,transparent:true,opacity:.55});const boomTrail=new THREE.Line(trailGeo,trailMat);scene.add(boomTrail);

// ---- CATCH TARGET (WORLD + SCREEN OVERLAY) ----
const zoneMesh=new THREE.Group();
const zoneOuter=new THREE.Mesh(new THREE.RingGeometry(2.38,2.67,72),new THREE.MeshBasicMaterial({color:0xecfff0,transparent:true,opacity:.24,side:THREE.DoubleSide,depthWrite:false}));zoneOuter.rotation.x=-Math.PI/2;zoneOuter.position.y=.038;zoneMesh.add(zoneOuter);
const zoneRing=new THREE.Mesh(new THREE.RingGeometry(1.72,2.48,72),new THREE.MeshBasicMaterial({color:0x82e89e,transparent:true,opacity:.78,side:THREE.DoubleSide,depthWrite:false}));zoneRing.rotation.x=-Math.PI/2;zoneRing.position.y=.045;zoneMesh.add(zoneRing);
const zoneInner=new THREE.Mesh(new THREE.CircleGeometry(1.7,72),new THREE.MeshBasicMaterial({color:0x82e89e,transparent:true,opacity:.10,side:THREE.DoubleSide,depthWrite:false}));zoneInner.rotation.x=-Math.PI/2;zoneInner.position.y=.041;zoneMesh.add(zoneInner);
const zoneBeacon=new THREE.Mesh(new THREE.CylinderGeometry(.04,.04,2.5,10),new THREE.MeshBasicMaterial({color:0xeaffef,transparent:true,opacity:.30,depthWrite:false}));zoneBeacon.position.y=1.25;zoneMesh.add(zoneBeacon);placeZoneAt(1.3,6.7);zoneMesh.visible=false;scene.add(zoneMesh);

function planGuideAvoidance(){
  guideMoveTarget.copy(guideHome);
  guideAvoidActive=false;
  if(!(state.phase==='flight'||state.phase==='catch')||!zoneMesh.visible)return;
  const cx=state.catchPoint.x,cz=state.catchPoint.z;
  const dx=guide.position.x-cx,dz=guide.position.z-cz;
  const dist=Math.hypot(dx,dz);
  if(dist<5.1){
    let ax=dist>.01?dx/dist:-1, az=dist>.01?dz/dist:0;
    // two offset candidates: step away AND sideways so the instructor clears the player's approach lane.
    const tx=-az,tz=ax;
    const candidates=[
      new THREE.Vector3(cx+ax*6.0+tx*2.2,0,cz+az*5.2+tz*2.2),
      new THREE.Vector3(cx+ax*6.0-tx*2.2,0,cz+az*5.2-tz*2.2)
    ];
    for(const c of candidates){c.x=THREE.MathUtils.clamp(c.x,-15.5,15.5);c.z=THREE.MathUtils.clamp(c.z,4.2,16.2);}
    candidates.sort((a,b)=>b.distanceToSquared(player.position)-a.distanceToSquared(player.position));
    guideMoveTarget.copy(candidates[0]);
    guideAvoidActive=true;
  }
}
function updateGuidePosition(dt){
  const dx=guideMoveTarget.x-guide.position.x,dz=guideMoveTarget.z-guide.position.z;
  const dist=Math.hypot(dx,dz);
  if(dist>.045){
    const speed=guideAvoidActive?3.45:1.8;
    const step=Math.min(dist,speed*dt);
    guide.position.x+=dx/dist*step; guide.position.z+=dz/dist*step;
    setFacingFromMotion(guide,dx,dz);
  }
  placeActorOnGround(guide,.15);
}

const ui={hud:$('hud'),intro:$('intro'),loading:$('loading'),objective:$('objective'),fill:$('meter-fill'),needle:$('timing-needle'),mode:$('meter-mode'),value:$('meter-value'),help:$('meter-help'),releaseZone:$('release-zone'),catchZones:$('catch-zones'),caption:$('guide-caption'),toast:$('toast'),catchZone:$('catch-zone'),view:$('view-readout'),dPower:$('d-power'),dRelease:$('d-release'),dSpin:$('d-spin'),dReturn:$('d-return')};
const state={phase:'idle',power:0,powerDir:1,aim:0,timing:0,releaseQuality:0,flightT:0,flightDuration:5.8,start:new THREE.Vector3(),catchPoint:new THREE.Vector3(),catchT:0,catchPressed:false,catchResult:'',demoT:0,throwStyle:'throw_chest',postThrowStyle:'track',walkPhase:0};const keys={};let viewMode=0,orbit=0,orbitTarget=0,orbitPitch=.27,orbitPitchTarget=.27,orbitZoom=1,orbitZoomTarget=1;let orbitDragging=false,orbitPointer=-1,lastOrbitX=0,lastOrbitY=0;
let cameraPunch=0;
function say(t){ui.caption.innerHTML=t}function pop(t){ui.toast.textContent=t;ui.toast.classList.add('show');setTimeout(()=>ui.toast.classList.remove('show'),1200)}
function setMeter(mode){ui.mode.textContent=mode;ui.catchZones.classList.toggle('hidden',mode!=='CATCH');ui.releaseZone.classList.toggle('hidden',mode==='CATCH');ui.fill.style.display=mode==='POWER'?'block':'none';ui.needle.style.opacity=mode==='POWER'?0:1}
function ready(message=true){hideBoomPip();guideAvoidActive=false;guideMoveTarget.copy(guideHome);guide.position.set(guideHome.x,0,guideHome.z);placeActorOnGround(guide,.15);state.phase='ready';state.power=0;state.timing=0;state.flightT=0;state.catchT=0;state.catchPressed=false;state.catchResult='';player.position.set(1.3,0,7);placeActorOnGround(player,.15);player.rotation.y=0;player.userData.facing=0;boomerang.position.set(1.95,player.position.y+4.25,6.75);boomerang.visible=false;zoneMesh.visible=false;ui.catchZone.classList.add('hidden');setMeter('POWER');ui.fill.style.height='0%';ui.value.textContent='0%';ui.help.textContent='HOLD ↓ TO WIND UP';if(message)say('Your turn. Inspect the field, hold <b>DOWN</b> to load power, then release into the throw window.');ui.objective.textContent='TUTORIAL: COMPLETE 3 CATCHES'}
function startDemo(){hideBoomPip();guideAvoidActive=false;guideMoveTarget.copy(guideHome);guide.position.set(guideHome.x,0,guideHome.z);placeActorOnGround(guide,.15);state.phase='demo';state.demoT=0;ui.objective.textContent='GUIDED TUTORIAL: WATCH THE INSTRUCTOR';setMeter('POWER');ui.help.textContent='INSTRUCTOR DEMONSTRATION';say('Watch closely. <b>DOWN</b> builds power, <b>UP</b> times the release, then you move into the catch circle.');placeActorOnGround(guide,.15);boomerang.position.set(-1.35,guide.position.y+4.45,7.1);boomerang.visible=false;player.position.set(1.3,0,7);placeActorOnGround(player,.15);zoneMesh.visible=false}
function beginRelease(){
  state.phase='release';state.timing=0;
  const r=Math.random(); state.throwStyle=r<.52?'throw_chest':r<.86?'throw_dip':'throw_low';
  const p=Math.random(); state.postThrowStyle=p<.18?'lookout':p<.48?'track':'neutral';
  setMeter('RELEASE');ui.help.textContent='PRESS ↑ IN THE WHITE WINDOW';
  say(state.throwStyle==='throw_chest'?'Upright release selected — time the throw.':state.throwStyle==='throw_dip'?'Athletic release selected — time the throw.':'Low release variation — time the throw.');
}
function launch(){const ideal=.775,err=Math.abs(state.timing-ideal);state.releaseQuality=Math.max(0,1-err/.38);ui.dRelease.textContent=err<.035?'Perfect':`${Math.round(err*180)} ms ${state.timing<ideal?'early':'late'}`;ui.dSpin.textContent=`${Math.round(45+55*state.releaseQuality)}%`;pop(err<.035?'PERFECT RELEASE':state.timing<ideal?'EARLY RELEASE':'LATE RELEASE');say('Move into the glowing circle. The catch meter appears as the boomerang returns.');state.phase='flight';state.flightT=0;state.flightDuration=4.1+state.power*2.0;placeActorOnGround(player,.15);boomerang.position.set(player.position.x+.72,player.position.y+4.15,player.position.z-.18);boomerang.visible=true;setBoomFrame(0);state.start.copy(boomerang.position);state.catchPoint.set(player.position.x+(state.timing-ideal)*5.2,0,player.position.z-.65);placeZoneAt(state.catchPoint.x,state.catchPoint.z);state.catchPoint.y=zoneMesh.position.y;zoneMesh.visible=true;ui.catchZone.classList.add('hidden');planGuideAvoidance();cameraPunch=1;whoosh(.65+state.power*.5)}
function catchOutcome(auto=false){
  if(state.phase!=='catch'||state.catchPressed)return;
  state.catchPressed=true;const x=state.catchT;let result='NORMAL CATCH';
  if((x>=.28&&x<=.303)||(x>=.73&&x<=.754))result='TRICK CATCH';
  else if((x>=.22&&x<=.31)||(x>=.67&&x<=.78))result='NICE CATCH';
  else if(x>=.48&&x<=.52)result='DROP';
  else if(auto)result='AUTOMATIC CATCH';
  state.catchResult=result;
  if(!auto){pop(result==='DROP'?'DROP RISK LOCKED':'CATCH TIMING LOCKED');ui.help.textContent='TIMING LOCKED — WATCH THE BOOMERANG ENTER THE CATCH ZONE';}
}
function finishCatch(result){hideBoomPip();guideAvoidActive=false;guideMoveTarget.copy(guideHome);state.phase='result';zoneMesh.visible=false;ui.catchZone.classList.add('hidden');ui.dReturn.textContent=result;boomerang.visible=result==='DROP';if(result==='DROP'){boomerang.position.set(player.position.x+.4,terrainHeightAt(player.position.x+.4,player.position.z-.2)+.18,player.position.z-.2);pop('DROPPED IT');say('That tiny dark zone is the risk. Let the automatic catch happen, or time <b>UP</b> for style.')}else{catches++;$('catch-count').textContent=`${Math.min(catches,3)} / 3`;pop(result);boomerang.visible=false;say(result.includes('TRICK')?'That was the smallest window—a trick catch.':result.includes('NICE')?'Clean timing. That upgraded the automatic catch.':'You were in position, so the catch was handled automatically.')}setTimeout(()=>ready(false),2100)}

function updateCatchOverlay(){
  if(!ui.catchZone)return;
  const active=zoneMesh.visible&&(state.phase==='flight'||state.phase==='catch'||state.phase==='demo');
  if(!active){ui.catchZone.classList.add('hidden');return}
  const w=canvas.clientWidth||innerWidth,h=canvas.clientHeight||innerHeight;
  const worldTarget=zoneMesh.position.clone();worldTarget.y=.18;
  const playerWorld=player.position.clone();playerWorld.y=player.position.y+1.4;
  worldTarget.project(camera);playerWorld.project(camera);
  if(worldTarget.z<-1||worldTarget.z>1||playerWorld.z<-1||playerWorld.z>1){ui.catchZone.classList.add('hidden');return}
  let tx=(worldTarget.x*.5+.5)*w,ty=(-worldTarget.y*.5+.5)*h;
  const px=(playerWorld.x*.5+.5)*w,py=(-playerWorld.y*.5+.5)*h;
  // Keep the gameplay marker connected to the character even when perspective stretches the field.
  const dx=tx-px,dy=ty-py,dist=Math.hypot(dx,dy),maxDist=Math.min(220,w*.18);
  if(dist>maxDist&&dist>0){const k=maxDist/dist;tx=px+dx*k;ty=py+dy*k}
  tx=THREE.MathUtils.clamp(tx,82,w-82);ty=THREE.MathUtils.clamp(ty,105,h-115);
  const worldDist=camera.position.distanceTo(zoneMesh.position);
  const scale=THREE.MathUtils.clamp(1.18-worldDist/58,.76,1.08);
  ui.catchZone.style.left=`${tx}px`;ui.catchZone.style.top=`${ty}px`;
  ui.catchZone.style.setProperty('--catch-scale',scale.toFixed(3));
  ui.catchZone.classList.remove('hidden');
}


let audioCtx=null,master=null;
let musicMuted=false;

const musicButton=$('music-toggle');
const backgroundSong=$('background-song');
const songPill=$('song-pill');
const boomPip=$('boom-pip');
const boomPipImg=$('boom-pip-img');
const boomPipState=$('boom-pip-state');
const boomPipSpeed=$('boom-pip-speed');
const boomPipFill=$('boom-pip-fill');

function setMusicStatus(state,label){
  if(!musicButton)return;
  musicButton.dataset.state=state;
  musicButton.textContent=`♫ ${label}`;
}

function ensureAudioContext(){
  const AudioContextClass=window.AudioContext||window.webkitAudioContext;
  if(!AudioContextClass)return Promise.resolve();

  if(!audioCtx){
    audioCtx=new AudioContextClass();
    master=audioCtx.createGain();
    master.gain.value=.86;
    master.connect(audioCtx.destination);
  }

  if(audioCtx.state==='suspended')return audioCtx.resume();
  return Promise.resolve();
}

function startSongFromGesture(){
  if(!backgroundSong){
    setMusicStatus('error','MUSIC FILE MISSING');
    return;
  }

  backgroundSong.loop=true;
  backgroundSong.volume=.82;
  backgroundSong.muted=false;
  musicMuted=false;
  setMusicStatus('loading','MUSIC STARTING');

  // IMPORTANT: play() is called synchronously inside the actual ENTER/MUSIC tap.
  // This preserves browser user activation inside the embedded Playable.
  const playback=backgroundSong.play();
  if(playback&&typeof playback.then==='function'){
    playback.then(()=>{setMusicStatus('on','MUSIC ON • I WAS AWAY'); if(songPill) songPill.classList.remove('hidden');}).catch(error=>{
      console.error('Native song playback was blocked.',error);
      setMusicStatus('error','TAP MUSIC RETRY');
      if(songPill) songPill.classList.add('hidden');
      pop('MUSIC BLOCKED — TAP MUSIC RETRY');
    });
  }else{
    setMusicStatus('on','MUSIC ON • I WAS AWAY'); if(songPill) songPill.classList.remove('hidden');
  }
}

function toggleMusic(){
  if(!backgroundSong)return;

  if(backgroundSong.paused){
    startSongFromGesture();
    return;
  }

  musicMuted=!musicMuted;
  backgroundSong.muted=musicMuted;
  if(songPill) songPill.classList.toggle('hidden',musicMuted);
  setMusicStatus(musicMuted?'off':'on',musicMuted?'MUSIC OFF':'MUSIC ON • I WAS AWAY');
}

function ensureEffectsAudio(){
  if(!audioCtx){
    ensureAudioContext().catch(()=>{});
    return false;
  }
  if(audioCtx.state==='suspended')audioCtx.resume().catch(()=>{});
  return true;
}

function whoosh(s=.5){if(muted||!ensureEffectsAudio())return;const o=audioCtx.createOscillator(),g=audioCtx.createGain(),f=audioCtx.createBiquadFilter();o.type='sawtooth';o.frequency.setValueAtTime(180,audioCtx.currentTime);o.frequency.exponentialRampToValueAtTime(55,audioCtx.currentTime+.34);f.type='bandpass';f.frequency.value=600;f.Q.value=.55;g.gain.setValueAtTime(.001,audioCtx.currentTime);g.gain.linearRampToValueAtTime(.08*s,audioCtx.currentTime+.06);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+.4);o.connect(f).connect(g).connect(master);o.start();o.stop(audioCtx.currentTime+.42)}

function changeView(){
  viewMode=(viewMode+1)%3;
  ui.view.textContent=['PLAYER','WIDE','FIELD'][viewMode];
  pop(`VIEW: ${ui.view.textContent}`);
}

function handleKeyDown(key){
  const lower=key.toLowerCase();
  keys[lower]=true;

  if(!started)return;

  if(lower==='v')changeView();
  if(lower==='r'){demoDone?ready():startDemo()}
  if(lower==='m')toggleMusic();

  if(key==='ArrowDown'&&state.phase==='ready'){
    state.phase='power';
    say('Hold it… choose your power, then release <b>DOWN</b>.');
  }

  if(key==='ArrowUp'&&state.phase==='release'){
    launch();
  }else if(key==='ArrowUp'&&state.phase==='catch'){
    catchOutcome(false);
  }
}

function handleKeyUp(key){
  keys[key.toLowerCase()]=false;
  if(key==='ArrowDown'&&state.phase==='power'){
    beginRelease();
  }
}

addEventListener('keydown',event=>{
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(event.key)){
    event.preventDefault();
  }
  handleKeyDown(event.key);
});

addEventListener('keyup',event=>{
  handleKeyUp(event.key);
});

if(musicButton){
  musicButton.addEventListener('click',()=>{
    toggleMusic();
  });
}

// Desktop free-orbit camera. Right mouse drag + wheel are camera-only and never consume gameplay keys.
canvas.addEventListener('contextmenu',e=>e.preventDefault());
canvas.addEventListener('pointerdown',e=>{if(e.button!==2)return;orbitDragging=true;orbitPointer=e.pointerId;lastOrbitX=e.clientX;lastOrbitY=e.clientY;canvas.setPointerCapture(e.pointerId);e.preventDefault();});
canvas.addEventListener('pointermove',e=>{if(!orbitDragging||e.pointerId!==orbitPointer)return;const dx=e.clientX-lastOrbitX,dy=e.clientY-lastOrbitY;lastOrbitX=e.clientX;lastOrbitY=e.clientY;orbitTarget-=dx*.0052;orbitPitchTarget=THREE.MathUtils.clamp(orbitPitchTarget+dy*.0038,-.12,1.02);e.preventDefault();});
function endOrbit(e){if(e.pointerId!==orbitPointer)return;orbitDragging=false;orbitPointer=-1;try{canvas.releasePointerCapture(e.pointerId)}catch(_){}}
canvas.addEventListener('pointerup',endOrbit);canvas.addEventListener('pointercancel',endOrbit);
canvas.addEventListener('wheel',e=>{orbitZoomTarget=THREE.MathUtils.clamp(orbitZoomTarget*Math.exp(e.deltaY*.0009),.55,1.85);e.preventDefault();},{passive:false});

/* Smartphone touch controller */
const touchStick=$('touch-stick');
const touchKnob=$('touch-stick-knob');
const touchAction=$('touch-action');
const touchActionMain=$('touch-action-main');
const touchActionSub=$('touch-action-sub');
const touchView=$('touch-view');
const touchReset=$('touch-reset');
const touchOrbitLeft=$('touch-orbit-left');
const touchOrbitRight=$('touch-orbit-right');

let activeStickPointer=null;
let activeActionPointer=null;
let lastTouchPhase='';

function clearTouchMovement(){
  keys.arrowleft=false;
  keys.arrowright=false;
  keys.arrowup=false;
  keys.arrowdown=false;

  if(touchKnob){
    touchKnob.style.transform='translate(-50%, -50%)';
  }
}

function updateTouchStick(event){
  if(!touchStick||!touchKnob)return;

  const rect=touchStick.getBoundingClientRect();
  const centerX=rect.left+rect.width/2;
  const centerY=rect.top+rect.height/2;
  const radius=rect.width*.31;

  let dx=event.clientX-centerX;
  let dy=event.clientY-centerY;
  const distance=Math.hypot(dx,dy);

  if(distance>radius){
    dx=dx/distance*radius;
    dy=dy/distance*radius;
  }

  const normalizedX=dx/radius;
  const normalizedY=dy/radius;
  const deadZone=.22;

  keys.arrowleft=normalizedX<-deadZone;
  keys.arrowright=normalizedX>deadZone;
  keys.arrowup=normalizedY<-deadZone;
  keys.arrowdown=normalizedY>deadZone;

  touchKnob.style.transform=`translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
}

if(touchStick){
  touchStick.addEventListener('pointerdown',event=>{
    activeStickPointer=event.pointerId;
    touchStick.setPointerCapture(event.pointerId);
    updateTouchStick(event);
  });

  touchStick.addEventListener('pointermove',event=>{
    if(event.pointerId===activeStickPointer){
      updateTouchStick(event);
    }
  });

  const releaseStick=event=>{
    if(event.pointerId!==activeStickPointer)return;
    activeStickPointer=null;
    clearTouchMovement();
  };

  touchStick.addEventListener('pointerup',releaseStick);
  touchStick.addEventListener('pointercancel',releaseStick);
  touchStick.addEventListener('lostpointercapture',()=>{
    activeStickPointer=null;
    clearTouchMovement();
  });
}

function updateTouchActionLabel(){
  if(!touchActionMain||!touchActionSub||state.phase===lastTouchPhase)return;
  lastTouchPhase=state.phase;

  const labels={
    idle:['ENTER','FIELD'],
    demo:['WATCH','TUTORIAL'],
    ready:['HOLD','POWER'],
    power:['RELEASE','POWER'],
    release:['THROW','TIME IT'],
    flight:['MOVE','TO CIRCLE'],
    catch:['CATCH','FOR STYLE'],
    result:['WAIT','RESULT']
  };

  const label=labels[state.phase]||['ACTION',''];
  touchActionMain.textContent=label[0];
  touchActionSub.textContent=label[1];
}

if(touchAction){
  touchAction.addEventListener('pointerdown',event=>{
    activeActionPointer=event.pointerId;
    touchAction.setPointerCapture(event.pointerId);
    touchAction.classList.add('is-held');

    if(state.phase==='ready'){
      handleKeyDown('ArrowDown');
    }else if(state.phase==='release'||state.phase==='catch'){
      handleKeyDown('ArrowUp');
    }
  });

  const releaseAction=event=>{
    if(event.pointerId!==activeActionPointer)return;
    activeActionPointer=null;
    touchAction.classList.remove('is-held');

    if(state.phase==='power'){
      handleKeyUp('ArrowDown');
    }
  };

  touchAction.addEventListener('pointerup',releaseAction);
  touchAction.addEventListener('pointercancel',releaseAction);
  touchAction.addEventListener('lostpointercapture',()=>{
    if(state.phase==='power'){
      handleKeyUp('ArrowDown');
    }
    activeActionPointer=null;
    touchAction.classList.remove('is-held');
  });
}

function bindHoldButton(button,key){
  if(!button)return;

  button.addEventListener('pointerdown',event=>{
    button.setPointerCapture(event.pointerId);
    keys[key]=true;
  });

  const release=()=>{
    keys[key]=false;
  };

  button.addEventListener('pointerup',release);
  button.addEventListener('pointercancel',release);
  button.addEventListener('lostpointercapture',release);
}

bindHoldButton(touchOrbitLeft,'q');
bindHoldButton(touchOrbitRight,'e');

if(touchView){
  touchView.addEventListener('click',()=>{
    if(started)changeView();
  });
}

if(touchReset){
  touchReset.addEventListener('click',()=>{
    if(started){
      demoDone?ready():startDemo();
    }
  });
}

addEventListener('blur',()=>{
  clearTouchMovement();
  keys.q=false;
  keys.e=false;
});



function setFacingFromMotion(actor,dx,dz){
  if(Math.hypot(dx,dz)<0.0001) return;
  actor.userData.facing=Math.atan2(dx,dz);
}
function faceTarget(actor,target){
  actor.userData.facing=Math.atan2(target.x-actor.position.x,target.z-actor.position.z);
}

function animatePerson(dt){
  const moveLeft=!!keys.arrowleft,moveRight=!!keys.arrowright,moveUp=!!keys.arrowup,moveDown=!!keys.arrowdown;
  const moving=(moveLeft||moveRight||moveUp||moveDown);
  let mdx=0,mdz=0;
  if(state.phase==='flight'||state.phase==='catch'){
    const fwd=new THREE.Vector3(-Math.sin(orbit),0,-Math.cos(orbit));
    const right=new THREE.Vector3(Math.cos(orbit),0,-Math.sin(orbit));
    if(moveLeft){mdx-=right.x;mdz-=right.z}if(moveRight){mdx+=right.x;mdz+=right.z}
    if(moveUp&&state.phase==='flight'){mdx+=fwd.x;mdz+=fwd.z}if(moveDown){mdx-=fwd.x;mdz-=fwd.z}
    if(moving)setFacingFromMotion(player,mdx,mdz);
  }else if(state.phase==='power'||state.phase==='release'||state.phase==='ready'){
    // World-facing stays stable. Orbit changes the viewed sprite angle; it no longer rotates the actor with the camera.
    player.userData.facing=0;
  }else if(state.phase==='demo'){faceTarget(player,guide.position)}
  else if(!moving){player.userData.facing=0}

  if(!guideAvoidActive) faceTarget(guide,player.position);

  let pState='idle_hold',pFrame=0;
  const u=state.flightDuration?Math.min(1,state.flightT/state.flightDuration):0;
  if((state.phase==='flight'||state.phase==='catch')&&moving){
    state.walkPhase+=dt*4.4;
    pState=(Math.floor(state.walkPhase)%2===0)?'walk_right':'walk_left';
  }else if(state.phase==='power'){
    pState='windup_hold';
  }else if(state.phase==='release'){
    pState=state.throwStyle||'throw_chest';
    pFrame=Math.min(7,Math.floor(state.timing*7.99));
  }else if(state.phase==='flight'){
    if(u<.085){pState='recovery';pFrame=Math.min(7,Math.floor((u/.085)*7.99));}
    else if(u<.68){
      if(state.postThrowStyle==='lookout'){pState='lookout';pFrame=Math.min(7,Math.floor(((u-.085)/.595)*7.99));}
      else if(state.postThrowStyle==='track'){pState='track_wait';pFrame=Math.min(7,Math.floor(((u-.085)/.595)*7.99));}
      else pState='release_empty';
    }else pState='catch_ready_empty';
  }else if(state.phase==='catch'){
    // Avoid the old damaged absorb cutouts; use clean catch-ready -> contact transition.
    pState=u<.975?'catch_ready_empty':'catch_contact_hold';
  }else if(state.phase==='result'){
    if(state.catchResult==='DROP'||state.catchResult==='OUTSIDE CIRCLE')pState='miss_empty';
    else if((state.catchResult||'').includes('TRICK'))pState='catch_trick_hold';
    else if((state.catchResult||'').includes('NICE'))pState='catch_onehand_hold';
    else if((state.catchResult||'').includes('PERFECT'))pState='catch_overhead_hold';
    else pState='catch_chest_hold';
  }
  setActorFrame(player,pState,pFrame);

  let gState='idle_hold',gFrame=0;
  if(guideAvoidActive){
    state.walkPhase+=dt*3.7;
    gState=(Math.floor(state.walkPhase)%2===0)?'walk_right':'walk_left';
  }else if(state.phase==='demo'){
    const t=state.demoT;
    if(t<2.45)gState='windup_hold';
    else if(t<3.08){gState='throw_chest';gFrame=Math.min(7,Math.floor((t-2.45)/.63*7.99));}
    else if(t<4.0){gState='recovery';gFrame=Math.min(7,Math.floor((t-3.08)/.92*7.99));}
    else if(t<5.75){gState='track_wait';gFrame=Math.min(7,Math.floor((t-4.0)/1.75*7.99));}
    else gState='catch_ready_empty';
  }
  setActorFrame(guide,gState,gFrame);

  const bob=moving?Math.sin(elapsed*10)*.025:Math.sin(elapsed*2.2)*.010;
  player.userData.sprite.position.y=.02+bob;
  guide.userData.sprite.position.y=.02+Math.sin(elapsed*1.8+.7)*.008;
}
function cubicBezier(a,b,c,d,t,out){
  const it=1-t,it2=it*it,t2=t*t;
  out.set(
    it2*it*a.x+3*it2*t*b.x+3*it*t2*c.x+t2*t*d.x,
    it2*it*a.y+3*it2*t*b.y+3*it*t2*c.y+t2*t*d.y,
    it2*it*a.z+3*it2*t*b.z+3*it*t2*c.z+t2*t*d.z
  );return out;
}
function flightPosition(u,p,q,aim,start,out,target=state.catchPoint){
  // Two connected cubic arcs. The second arc is solved to END at the catch circle.
  const strength=10+22*p;
  const lateral=(aim*8)+(state.timing-.775)*5;
  const far=new THREE.Vector3(start.x+lateral,start.y+4.8+6.5*p,start.z-strength);
  const c1=new THREE.Vector3(start.x+4.5+aim*5,start.y+3.5+5*p,start.z-strength*.32);
  const c2=new THREE.Vector3(far.x+5.5*q,far.y+2.3,far.z-2.8);
  const end=new THREE.Vector3(target.x,3.72,target.z);
  const r1=new THREE.Vector3(far.x-5.5*q,far.y+1.8,far.z+2.5);
  const r2=new THREE.Vector3(end.x+3.8+aim*2.2,end.y+2.2,end.z-5.0);
  if(u<.56)cubicBezier(start,c1,c2,far,u/.56,out);
  else cubicBezier(far,r1,r2,end,(u-.56)/.44,out);
}
function updateDemo(dt){
  state.demoT+=dt;const t=state.demoT;
  ui.value.textContent=t<2?`${Math.round(Math.min(1,t/2)*72)}%`:t<2.8?`${Math.round((t-2)/.8*100)}%`:'RETURN';
  ui.fill.style.height=t<2?`${Math.min(72,t/2*72)}%`:'72%';
  if(t<2.8){
    boomerang.visible=false;
    if(t>=2){ui.mode.textContent='RELEASE';ui.needle.style.opacity=1;ui.needle.style.top=`calc(${100-Math.min(78,(t-2)/.8*78)}% - 2px)`}
  }else if(t<7.2){
    if(t<2.9){placeActorOnGround(guide,.15);boomerang.position.set(guide.position.x+.76,guide.position.y+4.2,guide.position.z-.18);boomerang.visible=true;state.start.copy(boomerang.position);whoosh(.8);zoneMesh.visible=true;placeZoneAt(guide.position.x,guide.position.z-.65);ui.catchZone.classList.add('hidden');say('The throw is only half of it. I move into the circle before the return.')}
    const u=Math.min(1,(t-2.8)/4.4);flightPosition(u,.72,.96,0,state.start,boomerang.position,new THREE.Vector3(guide.position.x,0,guide.position.z-.65));setBoomFrame(u);
    if(u>.965)boomerang.visible=false;
    if(t>5.8)guide.position.x=THREE.MathUtils.lerp(-2.1,-1.1,(t-5.8)/1.4); placeActorOnGround(guide,.15);
  }else{
    boomerang.visible=false;hideBoomPip();demoDone=true;guide.position.set(-2.1,0,7.4);zoneMesh.visible=false;ui.catchZone.classList.add('hidden');pop('NOW YOU TRY');ready();
  }
}
function updateFlight(dt){
  state.flightT+=dt;const u=Math.min(1,state.flightT/state.flightDuration);
  flightPosition(u,state.power,state.releaseQuality,state.aim,state.start,boomerang.position,state.catchPoint);setBoomFrame(u);
  // Ownership handoff: live boomerang disappears only at final hand contact.
  if(u>=.982&&state.phase==='catch')boomerang.visible=false;else if(state.phase==='flight'||state.phase==='catch')boomerang.visible=true;
  if(u>.72&&!['catch','result'].includes(state.phase)){
    state.phase='catch';state.catchT=0;setMeter('CATCH');
    ui.help.textContent='MOVE INTO THE CIRCLE. PRESS ↑ FOR STYLE — THE BOOMERANG MUST PHYSICALLY RETURN';
    say('Track the boomerang all the way back. A catch only resolves when it actually reaches the glowing return zone.');
  }
  if(u>=1&&state.phase==='catch'){
    const dist=Math.hypot(player.position.x-state.catchPoint.x,player.position.z-state.catchPoint.z);
    if(dist<=2.7){if(!state.catchPressed){state.catchResult='AUTOMATIC CATCH';state.catchPressed=true;}finishCatch(state.catchResult||'AUTOMATIC CATCH');}
    else{state.phase='result';state.catchResult='OUTSIDE CIRCLE';boomerang.visible=true;boomerang.position.set(state.catchPoint.x,terrainHeightAt(state.catchPoint.x,state.catchPoint.z)+.28,state.catchPoint.z);zoneMesh.visible=false;ui.catchZone.classList.add('hidden');ui.dReturn.textContent='OUTSIDE CIRCLE';pop('MISSED POSITION');say('The boomerang reached the return zone, but you were outside it. Move into the circle before it arrives.');setTimeout(()=>ready(false),2100)}
  }
}
function update(dt){elapsed+=dt;const breeze=elapsed*.9;for(const g of grasses){g.rotation.z=Math.sin(breeze+g.userData.phase)*.08}for(let i=0;i<clouds.length;i++){clouds[i].position.x+=dt*(.28+i*.012);clouds[i].position.y+=Math.sin(elapsed*.19+i)*dt*.06;clouds[i].material.opacity=.28+.12*Math.sin(elapsed*.13+i*.7);if(clouds[i].position.x>130)clouds[i].position.x=-130}for(let i=0;i<ridgeBands.length;i++){ridgeBands[i].position.x=Math.sin(elapsed*.035+i)*5-i*1.6;}for(const b of butterflies){const u=b.userData;b.position.x=u.base.x+Math.sin(elapsed*.7+u.phase)*2.2;b.position.y=u.base.y+Math.sin(elapsed*1.5+u.phase)*.45;b.position.z=u.base.z+Math.cos(elapsed*.55+u.phase)*1.8;const flap=.35+Math.abs(Math.sin(elapsed*8+u.phase))*.9;u.l.rotation.y=flap;u.r.rotation.y=-flap}const dustAttr=dust.geometry.attributes.position;for(let i=0;i<dustCount;i++){const base=i*3;dustAttr.array[base]+=Math.sin(elapsed*.28+dustSeed[i])*.0016+dt*.18;if(dustAttr.array[base]>86)dustAttr.array[base]=-86;dustAttr.array[base+1]+=Math.sin(elapsed*.55+dustSeed[i])*.0018;if(dustAttr.array[base+1]>18)dustAttr.array[base+1]=2.2;}dustAttr.needsUpdate=true;sunHalo.material.opacity=.54+.06*Math.sin(elapsed*.45);for(const w of windRibbons){w.material.opacity=.09+.09*Math.sin(elapsed*1.2+w.userData.phase)}if(state.phase!=='demo')planGuideAvoidance();updateGuidePosition(dt);if(zoneMesh.visible){const pulse=.5+.5*Math.sin(elapsed*5.2);zoneOuter.material.opacity=.16+pulse*.12;zoneRing.material.opacity=.68+pulse*.22;zoneInner.material.opacity=.09+pulse*.05;zoneBeacon.material.opacity=.22+pulse*.18;const zScale=1+pulse*.03;zoneOuter.scale.set(zScale*1.02,zScale*1.02,zScale*1.02);zoneRing.scale.set(zScale,zScale,zScale);zoneInner.scale.set(zScale,zScale,zScale)}$('rec-time').textContent=`${String(Math.floor(elapsed/60)).padStart(2,'0')}:${String(Math.floor(elapsed%60)).padStart(2,'0')}`;if(!started)return;if(keys.q)orbitTarget-=dt*1.12;if(keys.e)orbitTarget+=dt*1.12;const oe=1-Math.exp(-dt*8.5);orbit+=normAng(orbitTarget-orbit)*oe;orbitPitch=THREE.MathUtils.lerp(orbitPitch,orbitPitchTarget,1-Math.exp(-dt*9.5));orbitZoom=THREE.MathUtils.lerp(orbitZoom,orbitZoomTarget,1-Math.exp(-dt*10.5));if(state.phase==='demo')updateDemo(dt);if(state.phase==='ready'){if(keys.arrowleft)state.aim=Math.max(-1,state.aim-dt*.75);if(keys.arrowright)state.aim=Math.min(1,state.aim+dt*.75)}if(state.phase==='power'){state.power+=dt*.55*state.powerDir;if(state.power>=1){state.power=1;state.powerDir=-1}else if(state.power<=.12){state.power=.12;state.powerDir=1}ui.fill.style.height=`${state.power*100}%`;ui.value.textContent=`${Math.round(state.power*100)}%`;ui.dPower.textContent=`${Math.round(state.power*100)}%`}if(state.phase==='release'){state.timing+=dt*1.12;if(state.timing>1){state.timing=1;launch()}ui.needle.style.top=`calc(${100-state.timing*100}% - 2px)`;ui.value.textContent=`${Math.round(state.timing*100)}%`}if(state.phase==='flight'||state.phase==='catch'){const speed=7.2*dt;const fwd=new THREE.Vector3(-Math.sin(orbit),0,-Math.cos(orbit));const right=new THREE.Vector3(Math.cos(orbit),0,-Math.sin(orbit));if(keys.arrowleft)player.position.addScaledVector(right,-speed);if(keys.arrowright)player.position.addScaledVector(right,speed);if(keys.arrowup&&state.phase==='flight')player.position.addScaledVector(fwd,speed);if(keys.arrowdown)player.position.addScaledVector(fwd,-speed);player.position.x=THREE.MathUtils.clamp(player.position.x,-18,18);player.position.z=THREE.MathUtils.clamp(player.position.z,-12,18);placeActorOnGround(player,.15);updateFlight(dt)}if(state.phase==='catch'){state.catchT=(state.catchT+dt*.9)%1;ui.needle.style.top=`calc(${100-state.catchT*100}% - 2px)`;ui.value.textContent=`${Math.round(state.catchT*100)}%`}for(let i=trailPoints.length-1;i>0;i--)trailPoints[i].lerp(trailPoints[i-1],.82);trailPoints[0].copy(boomerang.position);trailGeo.setFromPoints(trailPoints);trailMat.opacity=(state.phase==='flight'||state.phase==='catch'||state.phase==='demo')?.52:0;animatePerson(dt);updateActorTransition(player,dt);updateActorTransition(guide,dt);updateTouchActionLabel();
cameraPunch += (0-cameraPunch)*Math.min(1,dt*3.4);
const center=state.phase==='demo'?guide.position:player.position;
const target=new THREE.Vector3(center.x,center.y+3.25,center.z-.55);
const baseDist=viewMode===0?14:viewMode===1?24:34;
const dist=(baseDist-cameraPunch*1.25)*orbitZoom;
const cp=Math.cos(orbitPitch),sp=Math.sin(orbitPitch);
const desired=new THREE.Vector3(target.x+Math.sin(orbit)*cp*dist,target.y+sp*dist+1.2+cameraPunch*.18,target.z+Math.cos(orbit)*cp*dist);
camera.position.lerp(desired,1-Math.pow(.001,dt));camera.lookAt(target);updateCatchOverlay()}
function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}addEventListener('resize',resize);resize();
function loop(){requestAnimationFrame(loop);update(Math.min(.033,clock.getDelta()));renderer.render(scene,camera)}loop();ui.loading.style.display='none';
setMusicStatus('ready','MUSIC READY');

$('enter-btn').addEventListener('click',()=>{
  // Song playback must be the first media action inside this user gesture.
  startSongFromGesture();
  // Effects audio can resume independently after the native song play request.
  ensureAudioContext().catch(()=>{});

  started=true;
  ui.intro.classList.remove('show');
  ui.hud.classList.remove('hidden');
  startDemo();
});
