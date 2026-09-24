import * as THREE from './vendor/three.module.min.js';

// A separate, endless sky world. The stereo owns the only audio clock.
export function createSkyRide(renderer,host){
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(56,1,.15,1500);
  scene.fog=new THREE.Fog('#462453',280,1000);
  const chunks=new Map(),CHUNK=72;
  let distance=80,time=0,speed=0,frames=0,created=0,disposed=0;
  const colors=['#fb69c2','#40e1d1','#ffbc63','#b092ff'];
  const gold=new THREE.MeshStandardMaterial({color:'#efb966',metalness:.72,roughness:.27});
  const plum=new THREE.MeshStandardMaterial({color:'#311f4c',metalness:.55,roughness:.3});
  const black=new THREE.MeshStandardMaterial({color:'#17152c',metalness:.42,roughness:.32});
  const pearl=new THREE.MeshStandardMaterial({color:'#d6dbdb',metalness:.55,roughness:.2});
  const neon=colors.map(color=>new THREE.MeshBasicMaterial({color}));
  const glossy=colors.map(color=>new THREE.MeshStandardMaterial({color,metalness:.6,roughness:.25,emissive:color,emissiveIntensity:.13}));
  const box=new THREE.BoxGeometry(1,1,1),sphere=new THREE.SphereGeometry(1,24,16),ring=new THREE.TorusGeometry(1,.055,8,64),disc=new THREE.CylinderGeometry(1,1,.09,48),knot=new THREE.TorusKnotGeometry(1,.24,80,10,2,3);
  scene.add(new THREE.HemisphereLight('#e8b4ff','#305d78',2.4));
  const key=new THREE.DirectionalLight('#ffca86',3);key.position.set(-80,120,-80);scene.add(key);
  const rim=new THREE.DirectionalLight('#65e5ff',2);rim.position.set(80,20,40);scene.add(rim);
  const sky=new THREE.Mesh(new THREE.SphereGeometry(1300,24,16),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{time:{value:0},journey:{value:0}},vertexShader:`varying vec3 d;void main(){d=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`
    varying vec3 d;uniform float time;uniform float journey;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
    float fbm(vec2 p){float n=0.,a=.5;for(int i=0;i<5;i++){n+=a*noise(p);p=p*2.03+7.8;a*=.5;}return n;}
    void main(){vec3 v=normalize(d);float mood=.5+.5*sin(journey*.0008);vec3 low=mix(vec3(.42,.12,.29),vec3(.08,.28,.37),mood);vec3 high=vec3(.045,.025,.14);vec3 c=mix(low,high,smoothstep(-.2,.8,v.y));
    vec2 uv=v.xz/(abs(v.y)+.3)*1.5;float clouds=fbm(uv+vec2(time*.009,time*.004));float silk=sin(uv.x*2.+clouds*5.+time*.055)*.5+.5;
    c+=mix(vec3(.34,.065,.23),vec3(.06,.26,.3),silk)*smoothstep(.37,.8,clouds)*.7;
    float horizon=exp(-abs(v.y+.12)*8.);c+=vec3(.33,.16,.16)*horizon;
    float stars=step(.9986,hash(floor(v.xz/(v.y+.001)*160.)))*smoothstep(.18,.5,v.y);c+=vec3(.7,.65,.47)*stars;
    gl_FragColor=vec4(c*.48,1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`}));sky.frustumCulled=false;scene.add(sky);
  const center=s=>new THREE.Vector3(105*Math.sin(s/170)+34*Math.sin(s/73),52+27*Math.sin(s/117)+10*Math.sin(s/49),-s);
  function frame(s){const p=center(s),t=center(s+1).sub(center(s-1)).normalize(),bank=.19*Math.sin(s/170)+.07*Math.sin(s/73);const right=new THREE.Vector3().crossVectors(t,new THREE.Vector3(0,1,0)).normalize().applyAxisAngle(t,bank);const up=new THREE.Vector3().crossVectors(right,t).normalize();return {p,t,right,up,bank};}
  function at(s,lateral=0,lift=0){const f=frame(s);return f.p.addScaledVector(f.right,lateral).addScaledVector(f.up,lift);}
  function add(group,geometry,material,p,scale=[1,1,1]){const m=new THREE.Mesh(geometry,material);m.position.copy(p);m.scale.set(...scale);group.add(m);return m;}
  function ribbon(group,s,left,right,material,lift=0){
    const origin=center(s),positions=[],uv=[],indices=[];
    for(let i=0;i<=24;i++){const d=s+i*CHUNK/24;for(const l of [left,right]){const p=at(d,l,lift).sub(origin);positions.push(p.x,p.y,p.z);uv.push(l,d*.025);}if(i<24){const k=i*2;indices.push(k,k+1,k+2,k+1,k+3,k+2);}}
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();
    const m=new THREE.Mesh(geo,material);m.userData.ownedGeometry=true;group.add(m);
  }
  const road=new THREE.ShaderMaterial({side:THREE.DoubleSide,uniforms:{time:{value:0}},vertexShader:`varying vec2 v;varying vec3 world;void main(){v=uv;world=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(world,1.);}`,fragmentShader:`varying vec2 v;varying vec3 world;uniform float time;void main(){
    float grain=fract(sin(dot(v*900.,vec2(12.9898,78.233)))*43758.5453)*.016;
    float sheen=pow(.5+.5*sin(v.y*.42+v.x*.28),5.)*.09;
    vec3 c=vec3(.045,.03,.085)+vec3(.4,.12,.45)*sheen+grain;
    float grooves=pow(abs(sin(v.x*5.)),22.)*.024;c+=vec3(.12,.3,.35)*grooves;
    float fog=smoothstep(280.,1000.,length(cameraPosition-world));c=mix(c,vec3(.20,.08,.25),fog);gl_FragColor=vec4(c,1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`});
  // Soft cloud islands use translucent ellipsoids, never hard billboard rectangles.
  const cloudMat=new THREE.MeshStandardMaterial({color:'#ab83bc',roughness:1,transparent:true,opacity:.25,depthWrite:false});
  const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=128;
  const ctx=glowCanvas.getContext('2d'),gradient=ctx.createRadialGradient(64,64,0,64,64,64);
  gradient.addColorStop(0,'rgba(255,255,255,.65)');gradient.addColorStop(.28,'rgba(255,255,255,.24)');gradient.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
  const glowMap=new THREE.CanvasTexture(glowCanvas);
  const glows=colors.map(color=>new THREE.SpriteMaterial({map:glowMap,color,transparent:true,opacity:.45,depthWrite:false,blending:THREE.AdditiveBlending}));
  function glow(group,p,size,color){const sprite=new THREE.Sprite(glows[color]);sprite.position.copy(p);sprite.scale.set(size,size,1);group.add(sprite);}
  const sun=new THREE.Group();scene.add(sun);glow(sun,new THREE.Vector3(),180,2);
  add(sun,sphere,new THREE.MeshBasicMaterial({color:'#ffb978'}),new THREE.Vector3(),[44,44,44]);
  for(let i=0;i<3;i++){const m=add(sun,ring,neon[i%2?0:2],new THREE.Vector3(),[57+i*9,57+i*9,57+i*9]);m.rotation.set(1.13,.2,.3);}
  function makeChunk(n){
    const s=n*CHUNK,group=new THREE.Group(),origin=center(s);group.userData.s=s;group.userData.animated=[];
    const local=(d,l=0,h=0)=>at(d,l,h).sub(origin),theme=((Math.floor(n/6)%4)+4)%4;
    ribbon(group,s,-5.2,5.2,road);ribbon(group,s,-5.45,-5.2,gold,-.08);ribbon(group,s,5.2,5.45,gold,-.08);
    for(const side of [-1,1]){ribbon(group,s,side*5.1-.055,side*5.1+.055,neon[theme],.62);ribbon(group,s,side*4.85-.045,side*4.85+.045,neon[(theme+1)%4],.03);
      for(let k=0;k<72;k+=12){const f=frame(s+k),pole=add(group,box,gold,local(s+k,side*5.1,.28),[.065,.65,.065]);pole.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),f.up);}
    }
    for(let k=0;k<72;k+=12){const mark=add(group,box,neon[2],local(s+k,0,.03),[.10,.025,3]);const f=frame(s+k);mark.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(f.right,f.up,f.t.clone().negate()));}
    // A sculptural arcade through which the road actually passes.
    if(n%3===0){const f=frame(s+36),arch=add(group,ring,neon[theme],local(s+36,0,7),[12,12,12]);arch.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),f.t);const outer=add(group,ring,gold,local(s+36,0,7),[13.2,13.2,13.2]);outer.quaternion.copy(arch.quaternion);}
    const side=n%2===0?1:-1,anchor=local(s+38,side*28,12);glow(group,anchor,54,theme);
    if(theme===0){
      const vinyl=new THREE.Group();vinyl.position.copy(anchor);vinyl.rotation.set(.35,0,side*.3);group.add(vinyl);
      const record=add(vinyl,disc,black,new THREE.Vector3(),[12,12,12]);record.rotation.x=Math.PI/2;
      for(const r of [4,7,10,11.4])add(vinyl,ring,r===4?neon[2]:gold,new THREE.Vector3(0,0,.6),[r,r,r]);
      const label=add(vinyl,disc,glossy[theme],new THREE.Vector3(0,0,.7),[3.5,1,3.5]);label.rotation.x=Math.PI/2;
      add(vinyl,sphere,gold,new THREE.Vector3(0,0,1),[.8,.8,.3]);group.userData.animated.push({object:vinyl,kind:'record',base:vinyl.position.y,phase:n});
    }else if(theme===1){
      // Suspended piano steps and brass ribbons: a sky-sized soul instrument.
      for(let i=0;i<9;i++){const p=local(s+8+i*6,-side*(20+i*1.7),3+i*1.3);const key=add(group,box,i%3===1?black:pearl,p,[8,i%3===1?1.5:.7,4.5]);key.rotation.z=side*.22;}
      const sculpture=add(group,knot,gold,anchor,[10,10,10]);group.userData.animated.push({object:sculpture,kind:'knot',base:anchor.y,phase:n});
    }else if(theme===2){
      const speaker=new THREE.Group();speaker.position.copy(anchor);speaker.rotation.z=-side*.18;group.add(speaker);
      add(speaker,box,plum,new THREE.Vector3(),[12,24,8]);
      for(const y of [-6,6]){const cone=add(speaker,disc,black,new THREE.Vector3(0,y,4.2),[4.8,1,4.8]);cone.rotation.x=Math.PI/2;add(speaker,ring,neon[theme],new THREE.Vector3(0,y,4.35),[4.9,4.9,4.9]);add(speaker,sphere,gold,new THREE.Vector3(0,y,4.4),[1.7,1.7,.65]);}
      for(let i=0;i<6;i++){const m=add(group,box,glossy[i%4],local(s+i*10,-side*28,4+i%3*4),[3,10+i%3*5,3]);m.rotation.z=side*.22;}
    }else{
      for(let i=0;i<5;i++){const p=local(s+10+i*12,side*(19+Math.sin(i)*7),10+Math.sin(i*2)*8);const orb=add(group,sphere,glossy[i%4],p,[4+i%3,4+i%3,4+i%3]);const halo=add(group,ring,neon[(i+1)%4],p,[8,8,8]);halo.rotation.set(.7+i*.4,.4,.2);group.userData.animated.push({object:orb,kind:'orb',base:p.y,phase:n+i});}
    }
    for(let i=0;i<3;i++){const p=local(s+i*24,Math.sin(n*2+i)*110,-28-i*9);add(group,sphere,cloudMat,p,[32+i*7,6+i,20+i*5]);}
    // Far floating architecture provides depth without filling the driving corridor.
    for(let i=0;i<4;i++){const p=local(s+i*18,-side*(75+i*9),-8+i*3);const m=add(group,box,glossy[(theme+2)%4],p,[8,18+i*7,8]);m.rotation.set(.08,Math.sin(n+i),.16);}
    // Batch rigid sculptures and rails; moving records/orbs retain independent transforms.
    group.userData.animated.forEach(a=>a.object.userData.dynamic=true);
    group.updateMatrixWorld(true);const buckets=new Map();
    group.traverse(o=>{if(!o.isMesh||o.userData.ownedGeometry)return;let parent=o;while(parent&&parent!==group){if(parent.userData.dynamic)return;parent=parent.parent;}const k=o.geometry.uuid+o.material.uuid;if(!buckets.has(k))buckets.set(k,[]);buckets.get(k).push(o);});
    for(const list of buckets.values()){const first=list[0],batch=new THREE.InstancedMesh(first.geometry,first.material,list.length);list.forEach((o,i)=>{batch.setMatrixAt(i,o.matrixWorld);o.removeFromParent();});batch.computeBoundingSphere();group.add(batch);}
    scene.add(group);chunks.set(n,group);created++;
  }
  function maintain(){const current=Math.floor(distance/CHUNK);for(let n=current-2;n<=current+12;n++)if(!chunks.has(n))makeChunk(n);for(const [n,g] of chunks)if(n<current-2||n>current+12){scene.remove(g);g.traverse(o=>{if(o.userData.ownedGeometry)o.geometry.dispose();if(o.isInstancedMesh)o.dispose();});chunks.delete(n);disposed++;}}
  function render(dt){
    if(dt>0){time+=dt;const slope=(center(distance+2).y-center(distance-2).y)/4;const target=24-slope*14;speed+=Math.min(1,dt*.7)*(target-speed);distance+=speed*dt;frames++;}
    maintain();const origin=center(distance),f=frame(distance),eye=at(distance,1.8,1.8).sub(origin),look=at(distance+12,1.8,1.9).sub(origin);
    camera.aspect=host.clientWidth/host.clientHeight;camera.fov=innerWidth<800?65:56;camera.updateProjectionMatrix();camera.position.copy(eye);camera.up.copy(f.up);camera.lookAt(look);
    for(const g of chunks.values()){g.position.copy(center(g.userData.s).sub(origin));for(const a of g.userData.animated){a.object.position.y=a.base+Math.sin(time*.45+a.phase)*.8;if(a.kind==='record')a.object.rotation.z=time*.09+a.phase*.2;if(a.kind==='knot'){a.object.rotation.y=time*.11;a.object.rotation.z=time*.07;}}}
    sky.position.copy(camera.position);sky.material.uniforms.time.value=time;sky.material.uniforms.journey.value=distance;sun.position.set(-170,130,-700);
    const shadows=renderer.shadowMap.enabled;renderer.shadowMap.enabled=false;renderer.render(scene,camera);renderer.shadowMap.enabled=shadows;
    const labels=['VINYL SUNRISE','THE VELVET KEYS','SOUL FREQUENCY','CHROMATIC DREAMS'];document.getElementById('routeLabel').textContent=labels[((Math.floor(distance/432)%4)+4)%4];document.getElementById('speedLabel').textContent='SKY SESSION · FLOAT WITH IT';
    const cabin=document.getElementById('cabinRig'),dash=document.getElementById('scene');
    if(dt>0){cabin.style.setProperty('--rig-x',`${Math.sin(time*1.6)*.5}px`);cabin.style.setProperty('--rig-y',`${Math.sin(time*2.1)*.7}px`);cabin.style.setProperty('--rig-roll',`${f.bank*3}deg`);dash.style.setProperty('--sky-hue',`${285+Math.sin(distance*.002)*55}deg`);dash.style.setProperty('--reflection',`${.16+Math.sin(distance*.013)*.08}`);dash.style.setProperty('--reflect-x',`${Math.sin(distance*.007)*80}px`);}
  }
  return {render,get stats(){return {distance,time,speed,frames,chunks:chunks.size,created,disposed,elevation:center(distance).y,bank:frame(distance).bank,chapter:Math.floor(distance/432)%4};}};
}

