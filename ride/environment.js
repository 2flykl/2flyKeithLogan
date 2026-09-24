import * as THREE from './vendor/three.module.min.js';
import {loadAdobe,assetPlane} from './adobe-assets.js';
import {point,heading,elevation,routeInfo,nextStop,retireSamples,routeSampleCount,roadWidth,JUNCTIONS,configureRoutes,chooseJunction,junctionChoice} from './route.js';

// Stream new scenery beyond the fog; retire it only after it passes the car.
// World distance never derives from the audio clock, playlist, or song position.
const host = document.getElementById('windshield');
const notice = document.getElementById('roadNotice');
const config = window.RIDE_MEDIA.environment || {};
const CHUNK = 48, BEHIND = 2, AHEAD = 15;
let distance = 110, running = false, reduced = false, previousTime = 0;
let renderer, scene, camera, ready = false, failed = false;
let frames = 0, created = 0, disposed = 0, elapsed = 0;
const chunks = new Map(), trees = new Set();
const groundY = elevation;
const roadHeading = heading;
let speed=0, stopTimer=0, servedStop=-1, stopsCompleted=0, turnCount=0;
const localPoint=(group,s,offset=0)=>{const p=point(s,offset),o=point(group.userData.s);return {x:p.x-o.x,z:p.z-o.z,y:p.y};};
const random = seed => { let a = seed >>> 0; return () => { a += 0x6D2B79F5; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
const seed = config.seed ?? Math.floor(Math.random() * 0x7fffffff);
configureRoutes(seed);
const navigation={stop:null,selected:null,locked:false,committed:null};
const trafficState={gap:0,braking:false,count:0};
const stats = { get navigation(){return {...navigation};},get windTime(){return elapsed;}, get traffic(){return {...trafficState};}, get distance() { return distance; }, get speed(){return speed;}, get biome(){return routeInfo(distance).biome;}, get stopsCompleted(){return stopsCompleted;}, get stopTimer(){return stopTimer;}, get heading(){return heading(distance);}, get routeSamples(){return routeSampleCount();}, get frames() { return frames; }, get chunks() { return chunks.size; }, get created() { return created; }, get disposed() { return disposed; }, get ready() { return ready; }, get running() { return running && !reduced; }, get drawCalls() { return renderer?.info.render.calls || 0; }, get geometries() { return renderer?.info.memory.geometries || 0; }, seed };
window.RideRoad = { stats, setState(started, lowMotion) { running = started; reduced = lowMotion; previousTime = 0; }, destroy() { running = false; renderer?.dispose(); } };
window.addEventListener('ride-state', event => window.RideRoad.setState(event.detail.started, event.detail.reduced));

function fail(error) {
  failed = true; notice.hidden = false;
  notice.textContent = 'The 3D windshield needs WebGL. Your music player is still available.';
  console.error('Ride environment:', error);
}

try {
  if (config.mode !== 'video') {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 800 ? 1.35 : 1.6));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.id = 'roadCanvas';
  renderer.domElement.setAttribute('aria-label', 'Continuous Youngstown-inspired daytime drive');
  host.prepend(renderer.domElement);
  scene = new THREE.Scene(); scene.background = new THREE.Color('#b9cccf');
  scene.fog = new THREE.Fog('#bdd4dd', 180, 690);
  camera = new THREE.PerspectiveCamera(52, 2.8, .15, 1100);
  }
} catch (error) { fail(error); }

if (!failed && config.mode !== 'video') {
  notice.textContent = 'Preparing your drive…';
  const manager = new THREE.LoadingManager();
  const loader = new THREE.TextureLoader(manager);
  const load = async (name, color = true, repeat = 1) => {
    const t = await loader.loadAsync(`assets/environment/${name}`);
    if (color) t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat, repeat);
    t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    return t;
  };
  const box = new THREE.BoxGeometry(1, 1, 1), plane = new THREE.PlaneGeometry(1, 1);
  const foliagePlane=new THREE.PlaneGeometry(1,1,8,12);
  const windTime={value:0};
  const cylinder = new THREE.CylinderGeometry(1, 1, 1, 8);
  const metal = new THREE.MeshStandardMaterial({ color: '#525e5d', roughness: .56, metalness: .65 });
  const roof = new THREE.MeshStandardMaterial({ color: '#4c514d', roughness: .95 });
  const stone = new THREE.MeshStandardMaterial({ color: '#a19d8e', roughness: .9 });
  const lineWhite = new THREE.MeshStandardMaterial({ color: '#cdcbbb', roughness: .92 });
  const lineYellow = new THREE.MeshStandardMaterial({ color: '#c69a32', roughness: .92 });
  const poleMaterial = new THREE.MeshStandardMaterial({ color: '#53483a', roughness: .93 });
  let asphalt, grass, groundMaterial, concrete, brick, facadeMaterials, treeMaterial, sun, sky, adobe;
  const assetsReady = loadAdobe(renderer).then(value=>{adobe=value;return Promise.all([
    load('asphalt_02-Diffuse.jpg'), load('asphalt_02-nor_gl.jpg', false), load('asphalt_02-Rough.jpg', false),
    load('grass_ground-Diffuse.jpg'), load('grass_ground-nor_gl.jpg', false),
    load('concrete_floor-Diffuse.jpg'), load('concrete_floor-nor_gl.jpg', false),
    load('brown_brick_02-Diffuse.jpg'), load('brown_brick_02-nor_gl.jpg', false),
    load('facades.png'), load('maple.png')
  ]);}).then(textures => {
    asphalt = new THREE.MeshStandardMaterial({ map: textures[0], normalMap: textures[1], roughnessMap: textures[2], roughness: .91, color: '#959d9f', normalScale: new THREE.Vector2(.28, .28) });
    grass = new THREE.MeshStandardMaterial({ map: textures[3], normalMap: textures[4], roughness: 1, color: '#b3bfaa', normalScale: new THREE.Vector2(.45, .45) });
    const groundMap=textures[3].clone();groundMap.repeat.set(80,32);groundMap.needsUpdate=true;
    groundMaterial=new THREE.MeshStandardMaterial({map:groundMap,color:'#b3bfaa',roughness:1});
    concrete = new THREE.MeshStandardMaterial({ map: textures[5], normalMap: textures[6], roughness: .94, color: '#deded8', normalScale: new THREE.Vector2(.28, .28) });
    brick = new THREE.MeshStandardMaterial({ map: textures[7], normalMap: textures[8], roughness: .96, color: '#a49a85', normalScale: new THREE.Vector2(.35, .35) });
    textures[7].repeat.set(3, 2); textures[8].repeat.set(3, 2);
    facadeMaterials = [0, 1, 2, 3].map(i => {
      const map = textures[9].clone(); map.needsUpdate = true;
      map.repeat.set(.499, .499); map.offset.set(i % 2 * .5 + .0005, i < 2 ? .5005 : .0005);
      return new THREE.MeshStandardMaterial({ map, roughness: .86, color: '#e4e0d8' });
    });
    treeMaterial = new THREE.MeshStandardMaterial({ map: textures[10], alphaTest: .45, side: THREE.DoubleSide, roughness: 1, color: '#bac2a2', transparent: false });
    asphalt=adobe.road;asphalt.normalMap=textures[1];asphalt.normalScale=new THREE.Vector2(.2,.2); grass=adobe.lawn; groundMaterial=adobe.lawn; concrete=adobe.sidewalk;
    waterMaterial.uniforms.lakeMap.value=adobe.water;
    [treeMaterial,adobe.names.tree.material].forEach(m=>addWind(m,.009));
    addWind(adobe.names.shrubs.material,.016);addWind(adobe.names.reeds.material,.028);
    buildLighting(); setupTraffic();
    maintainChunks();
    resize(); positionScene();
    return renderer.compileAsync(scene, camera);
  }).then(() => {
    ready = true; notice.hidden = true;
    running = document.body.classList.contains('started'); reduced = document.body.classList.contains('reduced');
    renderer.render(scene, camera);
    window.dispatchEvent(new CustomEvent('ride-road-ready'));
    requestAnimationFrame(animate);
  }).catch(fail);
  window.RideRoad.ready = assetsReady;

  function addWind(material,amplitude){
    const inject=shader=>{
      shader.uniforms.breezeTime=windTime;
      shader.vertexShader='uniform float breezeTime;\n'+shader.vertexShader;
      shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
        vec3 windOrigin=vec3(0.);
        #ifdef USE_INSTANCING
          windOrigin=instanceMatrix[3].xyz;
        #endif
        float phase=dot(windOrigin.xz,vec2(.173,.291));
        float crown=smoothstep(-.22,.48,position.y);
        float gust=.62+.38*sin(breezeTime*.37+phase*.21);
        float sway=sin(breezeTime*1.13+phase)+.24*sin(breezeTime*2.41+phase*1.7+position.y*9.);
        transformed.x+=sway*crown*gust*${amplitude.toFixed(4)};
        transformed.z+=sin(breezeTime*.83+phase)*crown*${(amplitude*.42).toFixed(4)};
      `);
    };
    material.onBeforeCompile=inject;material.customProgramCacheKey=()=>`wind-${amplitude}`;
    const depth=new THREE.MeshDepthMaterial({depthPacking:THREE.RGBADepthPacking,map:material.map,alphaTest:material.alphaTest,side:THREE.DoubleSide});
    depth.onBeforeCompile=inject;depth.customProgramCacheKey=()=>`wind-depth-${amplitude}`;
    material.userData.windDepth=depth;
  }
  function buildLighting() {
    const ambient = new THREE.HemisphereLight('#d9edff', '#757664', 2.2); scene.add(ambient);
    sun = new THREE.DirectionalLight('#fff2d7', 2.4);
    sun.position.set(-45, 65, -35); sun.target.position.set(0, 0, -80);
    sun.castShadow = true; sun.shadow.mapSize.set(innerWidth < 800 ? 1024 : 2048, innerWidth < 800 ? 1024 : 2048);
    Object.assign(sun.shadow.camera, { left: -65, right: 65, top: 65, bottom: -65, near: 1, far: 190 });
    sun.shadow.bias = -.0003; sun.shadow.normalBias = .12; sun.shadow.radius = 3;
    scene.add(sun, sun.target);
    // Procedural daylight sky: cloud density changes in world space, no finite clip.
    sky = new THREE.Mesh(new THREE.SphereGeometry(950, 28, 16), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      uniforms: { time: { value: 0 }, sunDirection: { value: new THREE.Vector3(.25, .2, -1).normalize() } },
      vertexShader: `varying vec3 direction; void main(){ direction=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `varying vec3 direction; uniform float time; uniform vec3 sunDirection;
        float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
        float noise(vec2 p){vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
        float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.07+13.1;a*=.5;}return v;}
        void main(){vec3 d=normalize(direction);float h=max(d.y,0.);vec3 color=mix(vec3(.64,.79,.9),vec3(.08,.32,.65),pow(h,.45));
          vec2 uv=d.xz/(max(.12,d.y)+.25)*1.7+vec2(time*.0012,0.);
          float n=fbm(uv);float cloud=smoothstep(.52,.70,n)*smoothstep(.005,.2,d.y);color=mix(color,vec3(.91,.92,.88),cloud*.78);
          float sun=pow(max(dot(d,sunDirection),0.),700.);float halo=pow(max(dot(d,sunDirection),0.),14.);color+=vec3(1.,.76,.38)*(sun*3.+halo*.16);
          gl_FragColor=vec4(color,1.);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`
    }));
    sky.frustumCulled = false; scene.add(sky);
  }
  function mesh(group, geometry, material, x, y, z, sx = 1, sy = 1, sz = 1) {
    const m = new THREE.Mesh(geometry, material); m.position.set(x, y, z); m.scale.set(sx, sy, sz); group.add(m); return m;
  }
  function ribbon(s, left, right, material, height = 0, uvSize = 3) {
    const positions = [], uv = [], indices = [];
    for (let j = 0; j <= 8; j++) {
      const d = s + j * CHUNK / 8, origin=point(s), l=typeof left==='function'?left(d):left, r=typeof right==='function'?right(d):right, a=point(d,l), b=point(d,r);
      positions.push(a.x-origin.x, a.y+height, a.z-origin.z, b.x-origin.x, b.y+height, b.z-origin.z);
      uv.push(l / uvSize, d / uvSize, r / uvSize, d / uvSize);
      if (j < 8) { const a = j * 2; indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(indices); geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, material); m.receiveShadow = true; m.userData.ownedGeometry = true; return m;
  }
  function tree(group,s,offset,height,width,r) {
    const p=localPoint(group,s,offset),useNew=r()>.3;
    const material=useNew?adobe.names.tree.material:treeMaterial;
    // Crossed foliage preserves volume through turns without rotating trees at the viewer.
    for(const angle of [-.43,.43]){
      const t=mesh(group,foliagePlane,material,p.x,height/2,p.z,width,height,1);
      t.customDepthMaterial=material.userData.windDepth;
      t.rotation.y=-roadHeading(s)+angle;t.castShadow=true;
    }
    mesh(group,cylinder,poleMaterial,p.x,height*.13,p.z,.16,height*.26,.16).castShadow=true;
  }
  function prop(group,key,s,offset,width,base=0){
    const p=localPoint(group,s,offset),asset=adobe.names[key],h=width/asset.aspect;
    const vegetation=key==='shrubs'||key==='reeds';
    const object=vegetation?new THREE.Mesh(foliagePlane,asset.material):assetPlane(asset,width);
    if(vegetation){object.scale.set(width,h,1);object.customDepthMaterial=asset.material.userData.windDepth;}
    object.position.set(p.x,base+h/2,p.z);
    object.rotation.y=-heading(s);object.castShadow=true;group.add(object);return object;
  }
  const roofHouse=new THREE.MeshStandardMaterial({color:'#615e56',roughness:1});
  const sidingColors=['#bcad8d','#859798','#bfc1b7','#cfbf9f'];
  const siding=sidingColors.map(color=>new THREE.MeshStandardMaterial({color,roughness:.9}));
  const glassHouse=new THREE.MeshStandardMaterial({color:'#283c40',roughness:.28,metalness:.35});
  const trimHouse=new THREE.MeshStandardMaterial({color:'#d2cbbb',roughness:.75});
  function house(group,s,side,kind,r){
    const width=kind===1?12:8.5+r()*2,depth=8,height=kind===3?3.8:6.3;
    const p=localPoint(group,s,side*(16+depth/2)),home=new THREE.Group();
    home.position.set(p.x,0,p.z);home.rotation.y=-heading(s)-side*Math.PI/2;group.add(home);
    mesh(home,box,[adobe.houseSides[kind].material,adobe.houseSides[kind].material,siding[kind],siding[kind],siding[kind],siding[kind]],0,height/2,0,width,height,depth).castShadow=true;
    const front=mesh(home,plane,adobe.houseFaces[kind].material,0,height/2,depth/2+.018,width,height,1);front.receiveShadow=true;
    // Pitched roof is true geometry; side windows, eaves and porch cast real shadows.
    for(const dir of [-1,1]){
      const roofPart=mesh(home,box,roofHouse,0,height+.9,dir*depth/4,width+.8,.18,Math.hypot(depth/2,1.8)+.4);
      roofPart.rotation.x=dir*Math.atan2(1.8,depth/2);roofPart.castShadow=true;
      const triangle=new THREE.BufferGeometry();triangle.setAttribute('position',new THREE.Float32BufferAttribute([dir*width/2,height,-depth/2,dir*width/2,height,depth/2,dir*width/2,height+1.8,0],3));triangle.computeVertexNormals();
      const gable=new THREE.Mesh(triangle,siding[kind]);gable.material.side=THREE.DoubleSide;gable.userData.ownedGeometry=true;home.add(gable);

    }
    mesh(home,box,stone,0,.15,0,width+.3,.3,depth+.3);
    if(kind!==1){
      mesh(home,box,stone,0,.22,depth/2+1.1,width*.78,.44,2.2);
      mesh(home,box,roofHouse,0,2.85,depth/2+1,width*.85,.15,2.8).castShadow=true;
      for(const x of [-width*.32,width*.32])mesh(home,box,trimHouse,x,1.55,depth/2+2,.14,2.7,.14).castShadow=true;
    }
    const driveway=mesh(group,box,concrete,p.x, .005,p.z,4,.02,23);driveway.rotation.y=-heading(s);
    prop(group,'shrubs',s-5,side*11.4,3.5);
    if(r()>.4)prop(group,'bins',s+7,side*9,1.2);
    if(r()>.55)prop(group,'parked',s+8,side*13.3,3.8);
    if(r()>.6){const distant=assetPlane(adobe.houses[(kind+1)%4],13);const q=localPoint(group,s+20,side*43);distant.position.set(q.x,13/adobe.houses[(kind+1)%4].aspect/2,q.z);distant.rotation.y=-heading(s);group.add(distant);}
  }
  function building(group, s, side, width, height, depth, kind, r) {
    const b = new THREE.Group(), offset = side * (11.5 + depth / 2 + r() * 3);
    const p=localPoint(group,s,offset);b.position.set(p.x,p.y+.15,p.z);
    b.rotation.y = -roadHeading(s); group.add(b);
    const shell = mesh(b, box, brick, 0, height / 2, 0, depth, height, width); shell.castShadow = true; shell.receiveShadow = true;
    // Facade faces the road, with real scanned-style windows and cornices.
    const front = mesh(b, plane, facadeMaterials[kind], -side * (depth / 2 + .015), height / 2, 0, width, height, 1);
    front.rotation.y = -side * Math.PI / 2; front.receiveShadow = true;
    // Corner elevations keep the approach view detailed, not a blank box wall.
    for (const end of [-1, 1]) {
      const elevation = mesh(b, plane, facadeMaterials[(kind + 3) % 4], 0, height / 2, end * (width / 2 + .018), depth, height, 1);
      elevation.rotation.y = end < 0 ? Math.PI : 0; elevation.receiveShadow = true;
    }
    const roofCap = mesh(b, box, roof, 0, height + .12, 0, depth + .45, .24, width + .45); roofCap.castShadow = true;
    mesh(b, box, stone, -side * (depth / 2 + .14), height - .12, 0, .28, .23, width + .2);
    mesh(b, box, stone, -side * (depth / 2 + .08), .23, 0, .18, .46, width);
    if (r() > .5) mesh(b, box, metal, (r() - .5) * depth / 2, height + .6, 0, 1.6, 1, 1.3);
  }
  function lamp(group, s, side) {
    const p=localPoint(group,s,side*6.8),x=p.x,z=p.z,y=p.y;
    const pole = mesh(group, cylinder, metal, x, y + 4.5, z, .095, 9, .095); pole.castShadow = true;
    const arm = mesh(group, box, metal, x - side * 1.1, y + 8.8, z, 2.3, .085, .085); arm.castShadow = true;
    mesh(group, box, metal, x - side * 2.2, y + 8.65, z, .75, .19, .35);
  }
  function utility(group, s) {
    const p=localPoint(group,s,-9.8),x=p.x,z=p.z,y=p.y;
    mesh(group, cylinder, poleMaterial, x, y + 6, z, .14, 12, .14).castShadow = true;
    mesh(group, box, poleMaterial, x, y + 10.8, z, 2.2, .13, .13);
    const points = [];
    for (let k = 0; k <= 12; k++) {
      const at = s + k / 12 * CHUNK;
      const p=localPoint(group,at,-9.8);points.push(new THREE.Vector3(p.x,p.y+10.9-Math.sin(k/12*Math.PI)*.6,p.z));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const wire = new THREE.Line(geometry, wireMaterial); wire.userData.ownedGeometry = true; group.add(wire);
  }
  const groundPlane=new THREE.PlaneGeometry(1,1);
  {const uv=groundPlane.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*80,uv.getY(i)*32);}
  const wireMaterial = new THREE.LineBasicMaterial({ color: '#434844' });
  function batchStaticMeshes(group) {
    group.updateMatrixWorld(true);
    const buckets = new Map();
    group.traverse(object => {
      if (!object.isMesh || object.userData.ownedGeometry) return;
      const key = `${object.geometry.uuid}:${Array.isArray(object.material)?object.material.map(m=>m.uuid).join("/"):object.material.uuid}:${object.castShadow}:${object.receiveShadow}`;
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(object);
    });
    for (const list of buckets.values()) {
      const first = list[0], batch = new THREE.InstancedMesh(first.geometry, first.material, list.length);
      batch.customDepthMaterial=first.customDepthMaterial;
      batch.castShadow = first.castShadow; batch.receiveShadow = first.receiveShadow;
      list.forEach((object, i) => { batch.setMatrixAt(i, object.matrixWorld); trees.delete(object); object.removeFromParent(); });
      batch.computeBoundingSphere(); group.add(batch);
    }
  }
  const waterMaterial=new THREE.ShaderMaterial({
    uniforms:{time:{value:0},lakeMap:{value:null},worldOffset:{value:new THREE.Vector2()}}, side:THREE.DoubleSide,
    vertexShader:`varying vec3 world;void main(){world=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(world,1.);}`,
    fragmentShader:`uniform float time;uniform sampler2D lakeMap;uniform vec2 worldOffset;varying vec3 world;
      void main(){vec2 p=world.xz+worldOffset;float w=sin(p.x*.8+time*.65)*sin(p.y*.42-time*.48)+sin(p.x*2.7+p.y*1.4+time)*.25;
      vec3 eye=normalize(cameraPosition-world);float fres=pow(1.-max(eye.y,0.),3.);
      vec3 c=mix(vec3(.012,.10,.14),vec3(.16,.37,.48),fres);float sparkle=pow(max(0.,sin(p.x*2.1+p.y*.87+time)+sin(p.y*3.-time)*.3-.92),5.);
      vec2 uv=fract(p*.036+vec2(time*.002,time*.001));
      vec2 reflected=fract(p*.047+vec2(-time*.001,time*.0015));
      vec3 photo=texture2D(lakeMap,mix(vec2(.124,.51),vec2(.377,.976),uv)).rgb;
      vec3 photo2=texture2D(lakeMap,mix(vec2(.124,.51),vec2(.377,.976),reflected)).rgb;
      c=mix(c,(photo+photo2)*.5,.6);
      vec3 normal=normalize(vec3(.11*cos(p.x*.8+time*.65)+.04*cos(p.x*2.7+time),1.,.08*sin(p.y*.42-time*.48)));
      vec3 halfLight=normalize(eye+normalize(vec3(.25,.23,-1.)));
      float glint=pow(max(dot(normal,halfLight),0.),160.);
      c+=vec3(.014,.02,.023)*w+vec3(1.,.9,.7)*(sparkle*.09+glint*.45);
      float fog=smoothstep(180.,680.,length(cameraPosition-world));c=mix(c,vec3(.64,.78,.84),fog);gl_FragColor=vec4(c,1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`
  });
  const steel=new THREE.MeshStandardMaterial({color:'#728379',metalness:.55,roughness:.6});
  const iSection=new THREE.Shape();
  [[-.5,-.5],[.5,-.5],[.5,-.34],[.09,-.34],[.09,.34],[.5,.34],[.5,.5],[-.5,.5],[-.5,.34],[-.09,.34],[-.09,-.34],[-.5,-.34]].forEach(([x,y],i)=>i?iSection.lineTo(x,y):iSection.moveTo(x,y));iSection.closePath();
  const girderGeometry=new THREE.ExtrudeGeometry(iSection,{depth:1,bevelEnabled:false,steps:1});girderGeometry.translate(0,0,-.5);girderGeometry.rotateX(Math.PI/2);

  function surfaceWater(group,s,left,right){const m=ribbon(s,left,right,waterMaterial,0,8);const pos=m.geometry.attributes.position;for(let i=0;i<pos.count;i++)pos.setY(i,-2.8);pos.needsUpdate=true;m.geometry.computeVertexNormals();group.add(m);}
  function beam(group,a,b,width,material=steel){const v=new THREE.Vector3(b.x-a.x,b.y-a.y,b.z-a.z);const m=mesh(group,girderGeometry,material,(a.x+b.x)/2,(a.y+b.y)/2,(a.z+b.z)/2,width,v.length(),width);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());m.castShadow=true;return m;}
  function rails(group,s,side,bridge=false,freeway=false){
    const off=side*(freeway?10:5.6);
    for(let j=0;j<48;j+=8){const a=localPoint(group,s+j,off),b=localPoint(group,s+j+8,off);
      beam(group,{...a,y:a.y+.1},{...a,y:a.y+1.2},.12);
      beam(group,{...a,y:a.y+1.1},{...b,y:b.y+1.1},.16);
      if(bridge){beam(group,{...a,y:a.y+.4},{...b,y:b.y+.4},.13);beam(group,{...a,y:a.y+1.1},{...b,y:b.y+4.6},.18);beam(group,{...a,y:a.y+4.6},{...b,y:b.y+4.6},.22);beam(group,{...a,y:a.y+.1},{...a,y:a.y+4.6},.25);
        if(j===0){const opposite=localPoint(group,s+j,-off);beam(group,{...a,y:a.y+4.6},{...opposite,y:opposite.y+4.6},.22);}
      }
    }
  }
  const signCache=new Map();
  function signMaterial(text,stop=false){if(signCache.has(text))return signCache.get(text);const c=document.createElement('canvas');c.width=512;c.height=stop?512:256;const x=c.getContext('2d');
    if(stop){x.beginPath();for(let i=0;i<8;i++){const a=Math.PI/8+i*Math.PI/4;const px=256+245*Math.cos(a),py=256+245*Math.sin(a);i?x.lineTo(px,py):x.moveTo(px,py);}x.closePath();x.fillStyle='#ac281e';x.fill();x.lineWidth=15;x.strokeStyle='#f7eee0';x.stroke();x.font='bold 122px Arial';}
    else{x.fillStyle='#1f5549';x.fillRect(0,0,512,256);x.strokeStyle='#eee9d7';x.lineWidth=9;x.strokeRect(9,9,494,238);x.font='bold 47px Arial';}
    x.textAlign='center';x.textBaseline='middle';x.fillStyle='#fff9e6';text.split('|').forEach((line,i,arr)=>x.fillText(line,256,c.height/2+(i-(arr.length-1)/2)*63));
    const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;const mat=new THREE.MeshStandardMaterial({map:texture,transparent:true,alphaTest:.2,roughness:.6,side:THREE.DoubleSide});signCache.set(text,mat);return mat;}
  function sign(group,s,text,stop=false,offset=7){const p=localPoint(group,s,offset);mesh(group,cylinder,metal,p.x,p.y+1.6,p.z,.045,3.2,.045);const face=mesh(group,plane,signMaterial(text,stop),p.x,p.y+2.8,p.z,stop?1.1:2.8,stop?1.1:1.4,1);face.rotation.y=-heading(s);}
  function intersection(group,s){
    const p=localPoint(group,s),g=new THREE.Group();g.position.set(p.x,p.y+.026,p.z);g.rotation.y=-heading(s-18);group.add(g);
    const cross=mesh(g,box,asphalt,0,0,-10,65,.045,25);cross.receiveShadow=true;
    mesh(g,box,lineWhite,2.5,.05,0,4,.018,.35);
    sign(group,s-2,'STOP',true,6.4);
  }
  function createChunk(n) {
    const s=n*CHUNK,r=random(seed^Math.imul(n,2654435761)),info=routeInfo(s+24),type=info.biome;
    const group=new THREE.Group();group.userData.s=s;
    const bridge=type==='bridge',lake=type==='lakeshore',freeway=type==='freeway',junction=info.intersection;
    const urban=type==='town'||type==='junction', residential=type==='residential';
    const p0=routeInfo(s).phase;
    if(bridge){surfaceWater(group,s,-220,220);group.add(ribbon(s,-5.8,5.8,concrete,-.12,3));
      if(n%2===0)for(const side of [-1,1]){const pier=localPoint(group,s,side*5.2);mesh(group,box,stone,pier.x,1,pier.z,1.4,8,2.5).castShadow=true;}
    }
    else if(lake){group.add(ribbon(s,-150,10,grass,-.055,5));surfaceWater(group,s,18,260);
      const bank=ribbon(s,10,19,adobe.verge,0,3),pos=bank.geometry.attributes.position;
      for(let i=0;i<pos.count;i++)pos.setY(i,i%2?-2.8:pos.getY(i)-.065);pos.needsUpdate=true;bank.geometry.computeVertexNormals();group.add(bank);
      group.add(ribbon(s,225,390,grass,-.1,6));
      for(let k=0;k<3;k++)tree(group,s+k*16,230+r()*20,12+r()*7,15+r()*5,r);
    }
    else {const p=localPoint(group,s+24);const ground=mesh(group,plane,groundMaterial,p.x,-.065,p.z,400,160,1);ground.geometry=groundPlane;ground.rotation.set(-Math.PI/2,0,-heading(s));ground.receiveShadow=true;}
    const width=freeway?9.4:4.9;
    group.add(ribbon(s,d=>-roadWidth(d),d=>roadWidth(d),asphalt,0,3));
    if(!junction){
      group.add(ribbon(s,-.16,-.07,lineYellow,.016,1),ribbon(s,.07,.16,lineYellow,.016,1));
      group.add(ribbon(s,d=>-roadWidth(d)+.3,d=>-roadWidth(d)+.4,lineWhite,.018,1),ribbon(s,d=>roadWidth(d)-.4,d=>roadWidth(d)-.3,lineWhite,.018,1));
    }
    if(freeway){
      group.add(ribbon(s,-.65,.65,concrete,.35,2));
      for(let j=0;j<48;j+=12)for(const side of [-1,1]){const a=localPoint(group,s+j,side*4.8);const mark=mesh(group,box,lineWhite,a.x,a.y+.025,a.z,.13,.018,4.5);mark.rotation.y=-heading(s+j);}
      if(n%6===0)sign(group,s+28,'EAST  |SCENIC FREEWAY',false,11.5);
    }
    for(const side of [-1,1]){
      if(bridge){rails(group,s,side,true);continue;}
      if(freeway){rails(group,s,side,false,true);}
      if(lake&&side===1){rails(group,s,side);
        prop(group,'rocks',s+12,13.7,3.8,-1.15);prop(group,'reeds',s+33,18,2.4,-2.65);
        if(n%3===0)prop(group,'driftwood',s+27,15,3.5,-1.5);
        if(n%4===0){prop(group,'dock',s+16,19,6,-2.2);prop(group,'boat',s+26,20,3,-2.7);}
        continue;}
      if(residential&&!junction){group.add(ribbon(s,side<0?-8:6,side<0?-6:8,concrete,.12,2));house(group,s+24,side,Math.floor(r()*4),r);}
      if(urban&&!junction){group.add(ribbon(s,side<0?-8.2:5.05,side<0?-5.05:8.2,concrete,.14,2.2));
        for(const dz of [14,38])building(group,s+dz,side,12+r()*8,7+r()*9,8+r()*7,Math.floor(r()*4),r);
      }
      if(urban&&!junction&&n%3===0)prop(group,'shelter',s+18,side*9.5,3.8);
      if(lake&&side===-1&&n%3===0){prop(group,'picnic',s+20,-10,3);prop(group,'shrubs',s+36,-9,4);}
      if(!junction){for(let k=0;k<(urban?1:4);k++){const at=s+r()*48,off=side*((freeway?17:residential?25:9)+r()*(urban?1:22)),h=urban?7+r()*5:9+r()*10;tree(group,at,off,h,h*(.7+r()*.25),r);}
        for(let k=0;k<4;k++){const at=s+r()*48,h=12+r()*12;tree(group,at,side*(45+r()*60),h,h*.85,r);}
      }
      if(!bridge&&!(lake&&side===1))tree(group,s+24,side*(120+r()*45),18+r()*7,28,r);
      if((urban||residential)&&n%2===0&&!junction)lamp(group,s+23,side);
    }
    if((urban||residential)&&!junction)utility(group,s);
    for(const stop of JUNCTIONS)if(p0<=stop&&p0+48>stop)intersection(group,s+(stop-p0));
    if(p0===624)sign(group,s+24,'RIVER CROSSING',false,7);
    if(p0===1008)sign(group,s+24,'LAKESHORE|SCENIC DRIVE',false,-8);
    batchStaticMeshes(group);scene.add(group);chunks.set(n,group);created++;
  }
  const vehicles=[];
  const tireMaterial=new THREE.MeshStandardMaterial({color:'#151919',roughness:1});
  const carGlass=new THREE.MeshStandardMaterial({color:'#26343b',roughness:.18,metalness:.45});
  function setupTraffic(){
    for(let i=0;i<3;i++){
      const root=new THREE.Group(),kind=i===0?0:i===1?4:3,asset=adobe.cars[kind],width=2.02,height=width/asset.aspect;
      const color=['#e4e5de','#4c91a9','#465256'][i];
      const paint=new THREE.MeshStandardMaterial({color,roughness:.34,metalness:.32});
      mesh(root,box,paint,0,.58,0,1.93,.65,4.1).castShadow=true;
      mesh(root,box,carGlass,0,1.07,-.1,1.55,.59,2.2).castShadow=true;
      mesh(root,box,paint,0,1.38,-.1,1.62,.1,2.25);
      for(const side of [-1,1])for(const z of [-1.3,1.3]){
        const wheel=mesh(root,cylinder,tireMaterial,side*.94,.34,z,.33,.22,.33);wheel.rotation.z=Math.PI/2;
      }
      const rear=assetPlane(asset,width);rear.position.set(0,height/2,2.07);root.add(rear);
      const lamps=[];
      for(const side of [-1,1]){
        const mat=new THREE.MeshBasicMaterial({color:'#ff2b11',transparent:true,opacity:.08,depthWrite:false});
        const lamp=mesh(root,plane,mat,side*.73,height*.64,2.084,.26,.072,1);lamps.push(lamp);
      }
      scene.add(root);vehicles.push({root,lamps,s:distance+36+i*75,speed:0,wait:0,served:-1,lane:i?7:2.65});
    }
    trafficState.count=1;
  }
  function driveTraffic(v,dt){
    const biome=routeInfo(v.s).biome;
    let target=biome==='freeway'?21:biome==='bridge'?9:biome==='lakeshore'?10:11.5;
    if(v.s-distance>65)target*=.88;
    const curve=Math.abs(heading(v.s+5)-heading(v.s-5));target=Math.min(target,curve>.15?4.2:curve>.05?7:target);
    let stop=nextStop(v.s);if(stop===v.served)stop=nextStop(stop+.05);
    const remain=stop-v.s,previous=v.speed;
    if(v.wait>0){v.speed=0;v.wait=Math.max(0,v.wait-dt);if(v.wait===0)v.served=stop;}
    else{
      if(remain<40)target=Math.min(target,Math.sqrt(Math.max(0,2*1.8*remain)));
      const delta=target-v.speed;v.speed+=Math.sign(delta)*Math.min(Math.abs(delta),dt*(delta<0?2.1:1.3));
      const step=v.speed*dt;
      if(remain>=0&&remain<=Math.max(step,.025)){v.s=stop;v.speed=0;v.wait=2.1;}else v.s+=step;
    }
    v.braking=v.wait>0||v.speed<previous-.001;
  }
  function updateTraffic(dt){
    const origin=point(distance);let visible=0;
    vehicles.forEach((v,i)=>{
      const freeway=routeInfo(distance).biome==='freeway';
      if(i){
        // Extra freeway traffic is introduced beyond the fog and never passes the camera.
        if(!freeway){v.root.visible=false;v.s=distance+240+i*90;return;}
        v.braking=false;
      }
      const p=point(v.s,i?7:2.65);v.root.position.set(p.x-origin.x,p.y+.015,p.z-origin.z);
      v.root.rotation.y=-heading(v.s);v.root.visible=v.s-distance<660&&(!i||roadWidth(v.s)>9);
      v.lamps.forEach(l=>l.material.opacity=v.braking ? .88 : .07);
      if(v.root.visible)visible++;
    });
    trafficState.gap=vehicles[0].s-distance;trafficState.braking=!!vehicles[0].braking;trafficState.count=visible;
    const info=routeInfo(distance),label={town:'CITY STREETS',residential:'NEIGHBORHOOD',woodland:'WOODLAND DRIVE',bridge:'RIVER CROSSING',lakeshore:'ALONG THE LAKE',junction:'BACK INTO TOWN',freeway:'OPEN FREEWAY'}[info.biome];
    const routeLabel=document.getElementById('routeLabel'),speedLabel=document.getElementById('speedLabel');
    if(routeLabel)routeLabel.textContent=label;
    if(speedLabel)speedLabel.textContent=stopTimer>0?'STOP · TAKE A BREATH':`${Math.round(speed*2.23694)} MPH`;
  }
  const directionPanel=document.getElementById('directions');
  const directionButtons=[...document.querySelectorAll('[data-direction]')];
  directionButtons.forEach(button=>button.addEventListener('click',()=>{
    if(!running||navigation.locked||navigation.stop===null||navigation.stop-distance<=95)return;
    navigation.selected=Number(button.dataset.direction);paintNavigation();
  }));
  function paintNavigation(){
    const name=value=>value===-1?'LEFT':value===1?'RIGHT':'STRAIGHT AHEAD';
    directionButtons.forEach(button=>{
      button.setAttribute('aria-pressed',String(Number(button.dataset.direction)===(navigation.locked?navigation.committed:navigation.selected)));
      button.disabled=navigation.locked;
    });
    document.getElementById('directionStatus').textContent=navigation.locked?`TAKING ${name(navigation.committed)}`:'NEXT JUNCTION · YOUR CALL';
    document.getElementById('directionHint').textContent=navigation.locked?(navigation.selected===null?'A little exploring. Just enjoy the ride.':'Got it. We’ll take it from here.'):navigation.selected===null?'Or relax — we’ll pick a way.':'Saved · you can still change it';
  }
  function disposeChunk(n,group){
    scene.remove(group);group.traverse(object=>{if(object.userData.ownedGeometry)object.geometry.dispose();if(object.isInstancedMesh)object.dispose();});chunks.delete(n);disposed++;
  }
  function updateNavigation(){
    // Hold the chosen arrow until we have actually completed this junction.
    if(navigation.stop!==null&&distance>navigation.stop+58){navigation.stop=null;directionPanel.hidden=true;}
    const stop=nextStop(distance);
    if(navigation.stop===null&&stop-distance<=180&&stop-distance>95){
      Object.assign(navigation,{stop,selected:null,locked:false,committed:null});directionPanel.hidden=false;paintNavigation();
    }
    if(navigation.stop!==null&&!navigation.locked&&navigation.stop-distance<=95){
      navigation.locked=true;navigation.committed=navigation.selected??junctionChoice(navigation.stop);
      if(navigation.committed!==junctionChoice(navigation.stop)){
        chooseJunction(navigation.stop,navigation.committed);
        // Rebuild only future scenery; nothing beneath or behind the car moves.
        const first=Math.floor((navigation.stop+12)/CHUNK);
        for(const [n,group] of chunks)if(n>=first)disposeChunk(n,group);
      }
      paintNavigation();
    }
  }
  function updateInteriorLight(){
    const dash=document.getElementById('scene'),biome=routeInfo(distance).biome;
    const cover={town:.32,residential:.65,woodland:1,bridge:.08,lakeshore:.44,junction:.3,freeway:.16}[biome];
    const cloud=.5+.5*Math.sin(elapsed*.09+distance*.0017);
    const leaf=.5+.5*Math.sin(distance*.19+Math.sin(distance*.057));
    const sunSide=.5+.5*Math.cos(heading(distance)-.65);
    dash.style.setProperty('--shade-strength',(.055+cover*(.08+leaf*.13)).toFixed(3));
    dash.style.setProperty('--shade-x',`${Math.sin(distance*.017)*720}px`);
    dash.style.setProperty('--shade-y',`${Math.sin(elapsed*.7)*3}px`);
    dash.style.setProperty('--sun-angle',`${112+sunSide*42}deg`);
    dash.style.setProperty('--sun-x',`${25+sunSide*55}%`);
    dash.style.setProperty('--sun-strength',(.13+(1-cloud)*.11+(1-cover)*.08).toFixed(3));
    dash.style.setProperty('--hardware-light',(.25+sunSide*.25-leaf*cover*.1).toFixed(3));
  }
  let acceleration=0,lastSpeed=0;
  function advanceVehicle(dt){
    updateNavigation();
    if(vehicles.length)driveTraffic(vehicles[0],dt);
    for(let i=1;i<vehicles.length;i++){
      if(routeInfo(distance).biome==='freeway')vehicles[i].s+=22*dt;
      else vehicles[i].s=distance+240+i*90;
    }
    const info=routeInfo(distance);let target=info.biome==='freeway'?21:info.biome==='bridge'?9:info.biome==='lakeshore'?10:11.5;
    if(vehicles.length)target=Math.min(target,Math.max(0,(vehicles[0].s-distance-12)*.8));
    const curve=Math.abs(heading(distance+5)-heading(distance-5));target=Math.min(target,curve>.15?4.2:curve>.05?7:target);
    let stop=nextStop(distance);if(stop===servedStop)stop=nextStop(stop+.05);
    const remain=stop-distance;
    if(stopTimer>0){speed=0;stopTimer=Math.max(0,stopTimer-dt);if(stopTimer===0){servedStop=stop;stopsCompleted++;}}
    else{
      if(remain<40)target=Math.min(target,Math.sqrt(Math.max(0,2*1.8*remain)));
      const delta=target-speed;speed+=Math.sign(delta)*Math.min(Math.abs(delta),dt*(delta<0?2.1:1.3));
      const step=speed*dt;
      if(remain>=0&&remain<=Math.max(step,.025)){distance=stop;speed=0;stopTimer=2.1;}
      else distance+=step;
    }
    acceleration=dt?(speed-lastSpeed)/dt:0;lastSpeed=speed;
  }
  function updateCabin(dt){
    const rig=document.getElementById('cabinRig');if(!rig)return;
    const strength=Math.min(1,speed/9),t=elapsed;
    const roll=THREE.MathUtils.clamp(-(heading(distance+3)-heading(distance-3))*speed*.15,-.22,.22);
    const bob=.08*Math.sin(t*19)+(Math.sin(t*7.13)*.42+Math.sin(t*11.37)*.2+Math.sin(t*2.67)*.35)*strength;
    const pitch=THREE.MathUtils.clamp(acceleration*.24,-.6,.6);
    rig.style.setProperty('--rig-x',`${Math.sin(t*2.13)*.45*strength}px`);rig.style.setProperty('--rig-y',`${bob+pitch}px`);rig.style.setProperty('--rig-roll',`${roll}deg`);
  }
  function maintainChunks() {
    const current = Math.floor(distance / CHUNK);
    for (let n = current - BEHIND; n <= current + AHEAD; n++) if (!chunks.has(n)) createChunk(n);
    for (const [n, group] of chunks) if (n < current - BEHIND || n > current + AHEAD) {
      scene.remove(group); group.traverse(object => { if (object.userData.ownedGeometry) object.geometry.dispose(); if (object.isInstancedMesh) object.dispose(); if (object.userData.tree) trees.delete(object); }); chunks.delete(n); disposed++;
    }
  }
  function positionScene() {
    const origin=point(distance),eye=point(distance,2.65),ahead=point(distance+9,2.65);
    for(const group of chunks.values()){const p=point(group.userData.s);group.position.set(p.x-origin.x,0,p.z-origin.z);}
    camera.position.set(eye.x-origin.x,eye.y+1.65,eye.z-origin.z);
    camera.lookAt(ahead.x-origin.x,ahead.y+1.75,ahead.z-origin.z);
    sun.position.set(-45,65,-35);sun.target.position.set(Math.sin(heading(distance))*50,0,-Math.cos(heading(distance))*50);
    sky.position.copy(camera.position);
    waterMaterial.uniforms.worldOffset.value.set(origin.x,origin.z);
  }
  function resize() {
    if (!renderer) return;
    const w = host.clientWidth, h = host.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    // Phone crops horizontally, retaining the same passenger eye position.
    camera.fov = innerWidth < 800 ? 62 : 52; camera.updateProjectionMatrix();
    if (ready) renderer.render(scene, camera);
  }
  new ResizeObserver(resize).observe(host);
  document.addEventListener('visibilitychange', () => { previousTime = 0; });
  renderer.domElement.addEventListener('webglcontextlost', e => { e.preventDefault(); ready = false; notice.hidden = false; notice.textContent = 'Restoring the windshield… Music continues.'; });
  renderer.domElement.addEventListener('webglcontextrestored', () => { ready = true; notice.hidden = true; previousTime = 0; });
  function animate(time) {
    requestAnimationFrame(animate);
    if (!ready || document.hidden) { previousTime = 0; return; }
    const dt = previousTime ? Math.min((time - previousTime) / 1000, .06) : 0;
    previousTime = time;
    if (!running || reduced) return;
    elapsed += dt;windTime.value=elapsed;
    // No speed pulse tied to the beat and no changes on next/previous/seek.
    advanceVehicle(dt);
    maintainChunks(); positionScene(); updateTraffic(dt); retireSamples(distance); sky.material.uniforms.time.value = elapsed; waterMaterial.uniforms.time.value=elapsed;
    const cloudShade = .91 + .07 * Math.sin(distance * .012) * Math.sin(distance * .023);
    sun.intensity = 2.1 * cloudShade;
    const dash = document.getElementById('scene');
    dash.style.setProperty('--daylight', .16 + Math.sin(distance*.043)*Math.sin(distance*.017)*.09);
    dash.style.setProperty('--reflection', Math.max(0, Math.sin(distance * .073) * Math.sin(distance * .037)) * .24);
    dash.style.setProperty('--reflect-x', `${Math.sin(distance * .012) * 110}px`);
    updateInteriorLight(); updateCabin(dt); renderer.render(scene, camera); frames++;
    // Test/diagnostic event, never used to drive playback.
    if (frames % 120 === 0) host.dataset.distance = distance.toFixed(1);
  }
}

