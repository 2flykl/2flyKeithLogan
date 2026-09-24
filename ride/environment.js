import * as THREE from './vendor/three.module.min.js';

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
const roadCenter = s => 12 * Math.sin(s / 210) + 22 * Math.sin(s / 530) + 4 * Math.sin(s / 93);
const groundY = s => .7 * Math.sin(s / 180) + .3 * Math.sin(s / 75);
const roadHeading = s => Math.atan2(roadCenter(s + 1) - roadCenter(s - 1), 2);
const random = seed => { let a = seed >>> 0; return () => { a += 0x6D2B79F5; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
const seed = config.seed ?? Math.floor(Math.random() * 0x7fffffff);
const stats = { get distance() { return distance; }, get frames() { return frames; }, get chunks() { return chunks.size; }, get created() { return created; }, get disposed() { return disposed; }, get ready() { return ready; }, get running() { return running && !reduced; }, get drawCalls() { return renderer?.info.render.calls || 0; }, get geometries() { return renderer?.info.memory.geometries || 0; }, seed };
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
  scene.fog = new THREE.Fog('#bacbc8', 130, 570);
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
  let asphalt, grass, concrete, brick, facadeMaterials, treeMaterial, sun, sky;
  const assetsReady = Promise.all([
    load('asphalt_02-Diffuse.jpg'), load('asphalt_02-nor_gl.jpg', false), load('asphalt_02-Rough.jpg', false),
    load('grass_ground-Diffuse.jpg'), load('grass_ground-nor_gl.jpg', false),
    load('concrete_floor-Diffuse.jpg'), load('concrete_floor-nor_gl.jpg', false),
    load('brown_brick_02-Diffuse.jpg'), load('brown_brick_02-nor_gl.jpg', false),
    load('facades.png'), load('maple.png')
  ]).then(textures => {
    asphalt = new THREE.MeshStandardMaterial({ map: textures[0], normalMap: textures[1], roughnessMap: textures[2], roughness: .91, color: '#959d9f', normalScale: new THREE.Vector2(.28, .28) });
    grass = new THREE.MeshStandardMaterial({ map: textures[3], normalMap: textures[4], roughness: 1, color: '#b3bfaa', normalScale: new THREE.Vector2(.45, .45) });
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
    const ambient = new THREE.HemisphereLight('#dbe5e8', '#70694e', 2.1); scene.add(ambient);
    sun = new THREE.DirectionalLight('#fff2d7', 2.4);
    sun.position.set(-45, 65, -35); sun.target.position.set(0, 0, -80);
    sun.castShadow = true; sun.shadow.mapSize.set(innerWidth < 800 ? 1024 : 2048, innerWidth < 800 ? 1024 : 2048);
    Object.assign(sun.shadow.camera, { left: -65, right: 65, top: 65, bottom: -65, near: 1, far: 190 });
    sun.shadow.bias = -.0003; sun.shadow.normalBias = .12; sun.shadow.radius = 3;
    scene.add(sun, sun.target);
    // Procedural daylight sky: cloud density changes in world space, no finite clip.
    sky = new THREE.Mesh(new THREE.SphereGeometry(950, 28, 16), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false,
      uniforms: { time: { value: 0 }, sunDirection: { value: new THREE.Vector3(-.45, .65, -.35).normalize() } },
      vertexShader: `varying vec3 direction; void main(){ direction=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `varying vec3 direction; uniform float time; uniform vec3 sunDirection;
        float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
        float noise(vec2 p){vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
        float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.07+13.1;a*=.5;}return v;}
        void main(){vec3 d=normalize(direction);float h=max(d.y,0.);vec3 color=mix(vec3(.70,.79,.80),vec3(.22,.43,.64),pow(h,.45));
          vec2 uv=d.xz/(max(.12,d.y)+.25)*1.7+vec2(time*.0012,0.);
          float n=fbm(uv);float cloud=smoothstep(.46,.74,n)*smoothstep(.005,.2,d.y);color=mix(color,vec3(.91,.92,.88),cloud*.78);
          float sun=pow(max(dot(d,sunDirection),0.),300.);color+=vec3(.8,.64,.38)*sun;
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
      const d = s + j * CHUNK / 8, cx = roadCenter(d) - roadCenter(s), y = groundY(d) + height;
      positions.push(cx + left, y, -j * CHUNK / 8, cx + right, y, -j * CHUNK / 8);
      uv.push(left / uvSize, d / uvSize, right / uvSize, d / uvSize);
      if (j < 8) { const a = j * 2; indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(indices); geo.computeVertexNormals();
    const m = new THREE.Mesh(geo, material); m.receiveShadow = true; m.userData.ownedGeometry = true; return m;
  }
  function tree(group, s, offset, height, width, r) {
    const t = mesh(group, plane, treeMaterial, roadCenter(s) - roadCenter(group.userData.s) + offset, groundY(s) + height / 2, -(s - group.userData.s), width, height, 1);
    t.castShadow = true; t.receiveShadow = false;
    // Billboard stays facing the road tangent, not swivelling toward the viewer.
    t.rotation.y = -roadHeading(s) + (r() - .5) * .35;
    t.userData.tree = true; trees.add(t);
  }
  function building(group, s, side, width, height, depth, kind, r) {
    const b = new THREE.Group(), offset = side * (11.5 + depth / 2 + r() * 3);
    b.position.set(roadCenter(s) - roadCenter(group.userData.s) + offset, groundY(s) + .15, -(s - group.userData.s));
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
    const x = roadCenter(s) - roadCenter(group.userData.s) + side * 6.8, z = -(s - group.userData.s), y = groundY(s);
    const pole = mesh(group, cylinder, metal, x, y + 4.5, z, .095, 9, .095); pole.castShadow = true;
    const arm = mesh(group, box, metal, x - side * 1.1, y + 8.8, z, 2.3, .085, .085); arm.castShadow = true;
    mesh(group, box, metal, x - side * 2.2, y + 8.65, z, .75, .19, .35);
  }
  function utility(group, s) {
    const x = roadCenter(s) - roadCenter(group.userData.s) - 9.8, z = -(s - group.userData.s), y = groundY(s);
    mesh(group, cylinder, poleMaterial, x, y + 6, z, .14, 12, .14).castShadow = true;
    mesh(group, box, poleMaterial, x, y + 10.8, z, 2.2, .13, .13);
    const points = [];
    for (let k = 0; k <= 12; k++) {
      const at = s + k / 12 * CHUNK;
      points.push(new THREE.Vector3(roadCenter(at) - roadCenter(group.userData.s) - 9.8, groundY(at) + 10.9 - Math.sin(k / 12 * Math.PI) * .6, -(at - group.userData.s)));
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
  function createChunk(n) {
    const s = n * CHUNK, r = random(seed ^ Math.imul(n, 2654435761));
    const group = new THREE.Group(); group.userData.s = s;
    group.add(ribbon(s, -180, 180, grass, -.055, 5));
    group.add(ribbon(s, -4.9, 4.9, asphalt, 0, 3));
    group.add(ribbon(s, -.16, -.07, lineYellow, .014, 1), ribbon(s, .07, .16, lineYellow, .014, 1));
    group.add(ribbon(s, -4.55, -4.45, lineWhite, .016, 1), ribbon(s, 4.45, 4.55, lineWhite, .016, 1));
    const district = Math.sin(s / 370) + .45 * Math.sin(s / 133);
    const urban = district > -.35;
    for (const side of [-1, 1]) {
      const left = side < 0 ? -8.2 : 5.05, right = side < 0 ? -5.05 : 8.2;
      group.add(ribbon(s, left, right, concrete, .14, 2.2));
      group.add(ribbon(s, side < 0 ? -5.06 : 4.9, side < 0 ? -4.9 : 5.06, stone, .11, 1));
      // Built-up blocks blend gradually into green, quieter stretches.
      if (urban && r() > .08) {
        for (const dz of [11, 34]) {
          const width = 12 + r() * 9, height = 7 + r() * 8, depth = 8 + r() * 8;
          building(group, s + dz, side, width, height, depth, Math.floor(r() * 4), r);
        }
      }
      for (let k = 0; k < (urban ? 1 : 7); k++) {
        const at = s + r() * CHUNK;
        const offset = side * (urban ? 8.5 + r() * 2 : 9 + r() * 26);
        const h = urban ? 7 + r() * 5 : 9 + r() * 10; tree(group, at, offset, h, h * (.7 + r() * .25), r);
      }
      // Far treeline gives depth and obscures the streamed world boundary.
      for (let k = 0; k < 5; k++) {
        const at = s + r() * CHUNK, h = 12 + r() * 13;
        tree(group, at, side * (48 + r() * 70), h, h * .85, r);
      }
      if (urban && n % 2 === 0) lamp(group, s + 23, side);
    }
    utility(group, s);
    batchStaticMeshes(group);
    scene.add(group); chunks.set(n, group); created++;
  }
  function maintainChunks() {
    const current = Math.floor(distance / CHUNK);
    for (let n = current - BEHIND; n <= current + AHEAD; n++) if (!chunks.has(n)) createChunk(n);
    for (const [n, group] of chunks) if (n < current - BEHIND || n > current + AHEAD) {
      scene.remove(group); group.traverse(object => { if (object.userData.ownedGeometry) object.geometry.dispose(); if (object.isInstancedMesh) object.dispose(); if (object.userData.tree) trees.delete(object); }); chunks.delete(n); disposed++;
    }
  }
  function positionScene() {
    const cx = roadCenter(distance), y = groundY(distance);
    for (const group of chunks.values()) group.position.set(roadCenter(group.userData.s) - cx, 0, distance - group.userData.s);
    // Right lane, passenger-side eye point; locked pitch/position inside the cabin.
    camera.position.set(2.8, y + 1.65, 0);
    camera.lookAt(2.8 + roadCenter(distance + 38) - cx, groundY(distance + 38) + 1.9, -38);
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
    distance += dt * (config.speedMetersPerSecond || 10.5);
    maintainChunks(); positionScene(); sky.material.uniforms.time.value = elapsed;
    const cloudShade = .91 + .07 * Math.sin(distance * .012) * Math.sin(distance * .023);
    sun.intensity = 2.4 * cloudShade;
    const dash = document.getElementById('scene');
    dash.style.setProperty('--daylight', .1 + cloudShade * .035);
    dash.style.setProperty('--reflection', Math.max(0, Math.sin(distance * .073) * Math.sin(distance * .037)) * .16);
    dash.style.setProperty('--reflect-x', `${Math.sin(distance * .012) * 110}px`);
    renderer.render(scene, camera); frames++;
    // Test/diagnostic event, never used to drive playback.
    if (frames % 120 === 0) host.dataset.distance = distance.toFixed(1);
  }
}

