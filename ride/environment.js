import * as THREE from './vendor/three.module.min.js';
import {point,heading,elevation,routeInfo,nextStop,retireSamples,routeSampleCount,roadWidth} from './route.js';

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
const stats = { get distance() { return distance; }, get speed(){return speed;}, get biome(){return routeInfo(distance).biome;}, get stopsCompleted(){return stopsCompleted;}, get stopTimer(){return stopTimer;}, get heading(){return heading(distance);}, get routeSamples(){return routeSampleCount();}, get frames() { return frames; }, get chunks() { return chunks.size; }, get created() { return created; }, get disposed() { return disposed; }, get ready() { return ready; }, get running() { return running && !reduced; }, get drawCalls() { return renderer?.info.render.calls || 0; }, get geometries() { return renderer?.info.memory.geometries || 0; }, seed };
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
  renderer.toneMappingExposure = 1.18;
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
  const cylinder = new THREE.CylinderGeometry(1, 1, 1, 8);
  const metal = new THREE.MeshStandardMaterial({ color: '#525e5d', roughness: .56, metalness: .65 });
  const roof = new THREE.MeshStandardMaterial({ color: '#4c514d', roughness: .95 });
  const stone = new THREE.MeshStandardMaterial({ color: '#a19d8e', roughness: .9 });
  const lineWhite = new THREE.MeshStandardMaterial({ color: '#cdcbbb', roughness: .92 });
  const lineYellow = new THREE.MeshStandardMaterial({ color: '#c69a32', roughness: .92 });
  const poleMaterial = new THREE.MeshStandardMaterial({ color: '#53483a', roughness: .93 });
  let asphalt, grass, groundMaterial, concrete, brick, facadeMaterials, treeMaterial, sun, sky;
  const assetsReady = Promise.all([
    load('asphalt_02-Diffuse.jpg'), load('asphalt_02-nor_gl.jpg', false), load('asphalt_02-Rough.jpg', false),
    load('grass_ground-Diffuse.jpg'), load('grass_ground-nor_gl.jpg', false),
    load('concrete_floor-Diffuse.jpg'), load('concrete_floor-nor_gl.jpg', false),
    load('brown_brick_02-Diffuse.jpg'), load('brown_brick_02-nor_gl.jpg', false),
    load('facades.png'), load('maple.png')
  ]).then(textures => {
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
    buildLighting();
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

  function buildLighting() {
    const ambient = new THREE.HemisphereLight('#d9edff', '#676f49', 2.6); scene.add(ambient);
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
  function tree(group, s, offset, height, width, r) {
    const p=localPoint(group,s,offset);
    const t = mesh(group, plane, treeMaterial, p.x, height / 2, p.z, width, height, 1);
    t.castShadow = true; t.receiveShadow = false;
    // Billboard stays facing the road tangent, not swivelling toward the viewer.
    t.rotation.y = -roadHeading(s) + (r() - .5) * .35;
    t.userData.tree = true; trees.add(t);
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
  const wireMaterial = new THREE.LineBasicMaterial({ color: '#434844' });
  function batchStaticMeshes(group) {
    group.updateMatrixWorld(true);
    const buckets = new Map();
    group.traverse(object => {
      if (!object.isMesh || object.userData.ownedGeometry) return;
      const key = `${object.geometry.uuid}:${object.material.uuid}:${object.castShadow}:${object.receiveShadow}`;
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(object);
    });
    for (const list of buckets.values()) {
      const first = list[0], batch = new THREE.InstancedMesh(first.geometry, first.material, list.length);
      batch.castShadow = first.castShadow; batch.receiveShadow = first.receiveShadow;
      list.forEach((object, i) => { batch.setMatrixAt(i, object.matrixWorld); trees.delete(object); object.removeFromParent(); });
      batch.computeBoundingSphere(); group.add(batch);
    }
  }
  const waterMaterial=new THREE.ShaderMaterial({
    uniforms:{time:{value:0}}, side:THREE.DoubleSide,
    vertexShader:`varying vec3 world;void main(){world=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(world,1.);}`,
    fragmentShader:`uniform float time;varying vec3 world;
      void main(){vec2 p=world.xz;float w=sin(p.x*.8+time*.65)*sin(p.y*.42-time*.48)+sin(p.x*2.7+p.y*1.4+time)*.25;
      vec3 eye=normalize(cameraPosition-world);float fres=pow(1.-max(eye.y,0.),3.);
      vec3 c=mix(vec3(.025,.19,.23),vec3(.39,.64,.76),fres);float sparkle=pow(max(0.,sin(p.x*2.1+p.y*.87+time)+sin(p.y*3.-time)*.3-.92),5.);
      c+=vec3(.035,.065,.065)*w+vec3(1.,.84,.52)*sparkle*.35;
      float fog=smoothstep(180.,680.,length(cameraPosition-world));c=mix(c,vec3(.64,.78,.84),fog);gl_FragColor=vec4(c,1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`
  });
  const steel=new THREE.MeshStandardMaterial({color:'#647b76',metalness:.72,roughness:.43});
  function surfaceWater(group,s,left,right){const m=ribbon(s,left,right,waterMaterial,0,8);const pos=m.geometry.attributes.position;for(let i=0;i<pos.count;i++)pos.setY(i,-2.8);pos.needsUpdate=true;m.geometry.computeVertexNormals();group.add(m);}
  function beam(group,a,b,width,material=steel){const v=new THREE.Vector3(b.x-a.x,b.y-a.y,b.z-a.z);const m=mesh(group,box,material,(a.x+b.x)/2,(a.y+b.y)/2,(a.z+b.z)/2,width,v.length(),width);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());m.castShadow=true;return m;}
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
    const urban=type==='town'||type==='junction';
    const p0=routeInfo(s).phase;
    if(bridge){surfaceWater(group,s,-220,220);group.add(ribbon(s,-5.8,5.8,concrete,-.12,3));}
    else if(lake){group.add(ribbon(s,-150,12,grass,-.055,5));surfaceWater(group,s,12,260);group.add(ribbon(s,10,14,stone,-.3,3));}
    else {const p=localPoint(group,s+24);const ground=mesh(group,plane,groundMaterial,p.x,-.065,p.z,400,160,1);ground.rotation.set(-Math.PI/2,0,-heading(s));ground.receiveShadow=true;}
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
      if(lake&&side===1){rails(group,s,side);continue;}
      if(urban&&!junction){group.add(ribbon(s,side<0?-8.2:5.05,side<0?-5.05:8.2,concrete,.14,2.2));
        for(const dz of [11,34])building(group,s+dz,side,12+r()*8,7+r()*9,8+r()*7,Math.floor(r()*4),r);
      }
      if(!junction){for(let k=0;k<(urban?1:4);k++){const at=s+r()*48,off=side*((freeway?17:9)+r()*(urban?1:22)),h=urban?7+r()*5:9+r()*10;tree(group,at,off,h,h*(.7+r()*.25),r);}
        for(let k=0;k<4;k++){const at=s+r()*48,h=12+r()*12;tree(group,at,side*(45+r()*60),h,h*.85,r);}
      }
      if(urban&&n%2===0&&!junction)lamp(group,s+23,side);
    }
    if(urban&&!junction)utility(group,s);
    for(const stop of [228,1668])if(p0<=stop&&p0+48>stop)intersection(group,s+(stop-p0));
    if(p0===624)sign(group,s+24,'RIVER CROSSING',false,7);
    if(p0===1008)sign(group,s+24,'LAKESHORE|SCENIC DRIVE',false,-8);
    batchStaticMeshes(group);scene.add(group);chunks.set(n,group);created++;
  }
  let acceleration=0,lastSpeed=0;
  function advanceVehicle(dt){
    const info=routeInfo(distance);let target=info.biome==='freeway'?21:info.biome==='bridge'?9:info.biome==='lakeshore'?10:11.5;
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
    elapsed += dt;
    // No speed pulse tied to the beat and no changes on next/previous/seek.
    advanceVehicle(dt);
    maintainChunks(); positionScene(); retireSamples(distance); sky.material.uniforms.time.value = elapsed; waterMaterial.uniforms.time.value=elapsed;
    const cloudShade = .91 + .07 * Math.sin(distance * .012) * Math.sin(distance * .023);
    sun.intensity = 2.4 * cloudShade;
    const dash = document.getElementById('scene');
    dash.style.setProperty('--daylight', .16 + Math.sin(distance*.043)*Math.sin(distance*.017)*.09);
    dash.style.setProperty('--reflection', Math.max(0, Math.sin(distance * .073) * Math.sin(distance * .037)) * .24);
    dash.style.setProperty('--reflect-x', `${Math.sin(distance * .012) * 110}px`);
    updateCabin(dt); renderer.render(scene, camera); frames++;
    // Test/diagnostic event, never used to drive playback.
    if (frames % 120 === 0) host.dataset.distance = distance.toFixed(1);
  }
}

