import * as THREE from './vendor/three.module.min.js';
import {sampleSkyRoute,skyRouteFrame,SKY_SECTION} from './sky-route.js';
import {createSkyArt} from './sky-art.js';

// A separate, endless sky world. The stereo owns the only audio clock.
export function createSkyRide(renderer,host){
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(56,1,.15,1500);
  const chunks=new Map(),CHUNK=72,SECTION=SKY_SECTION;
  const artwork=createSkyArt(renderer);
  let distance=35,time=0,speed=0,frames=0,created=0,disposed=0;
  const chapters=[
    {name:'BLUE DEPARTURE',move:'CLOUD LAUNCH',high:'#122a50',low:'#567eae',haze:'#dce8ec',edge:'#7ecff1',accent:'#ef6962',road:'#22354a'},
    {name:'STREAMS OF SOUND',move:'WATERFALL ROAD',high:'#10293e',low:'#38869e',haze:'#b7dedf',edge:'#70ddec',accent:'#e7dac1',road:'#25464f'},
    {name:'THRU THE FIRE',move:'EMBER RAMP',high:'#281525',low:'#a94d30',haze:'#f6c18b',edge:'#ff8b44',accent:'#ffda9e',road:'#423037'},
    {name:'GOLDEN HOUR',move:'SUN SPIRAL',high:'#382443',low:'#d47a3b',haze:'#ffe1a3',edge:'#f7c979',accent:'#b496d9',road:'#4b3a4b'},
    {name:'ARTIFICIAL LOVE',move:'HEARTBEAT DROP',high:'#280e2b',low:'#8e294b',haze:'#e9a8bc',edge:'#ff7998',accent:'#ffd3d0',road:'#422c3d'},
    {name:'BLACK & GIFTED',move:'GOLDEN BRIDGE',high:'#231236',low:'#6d5194',haze:'#d7bde6',edge:'#efc577',accent:'#ddaeef',road:'#3b304b'},
    {name:'TIGER CALL',move:'FINAL RUN',high:'#1b283a',low:'#a4542e',haze:'#f7c08e',edge:'#ffa147',accent:'#fff0bd',road:'#38343c'}
  ];
  scene.fog=new THREE.Fog(chapters[0].haze,230,850);
  const themeAt=s=>((Math.floor(s/SECTION)%chapters.length)+chapters.length)%chapters.length;
  const phaseAt=s=>((s%SECTION)+SECTION)%SECTION/SECTION;
  const ease=(a,b,x)=>{const t=THREE.MathUtils.clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
  const pulse=(a,b,c,d,x)=>ease(a,b,x)-ease(c,d,x);
  const colors=chapters.map(c=>c.edge);
  const gold=new THREE.MeshStandardMaterial({color:'#efb966',metalness:.72,roughness:.27});
  const plum=new THREE.MeshStandardMaterial({color:'#311f4c',metalness:.55,roughness:.3});
  const pearl=new THREE.MeshStandardMaterial({color:'#d6dbdb',metalness:.55,roughness:.2});
  const neon=colors.map(color=>new THREE.MeshBasicMaterial({color}));
  const glossy=colors.map(color=>new THREE.MeshStandardMaterial({color,metalness:.42,roughness:.32,emissive:color,emissiveIntensity:.09}));
  const sphere=new THREE.SphereGeometry(1,24,16),ring=new THREE.TorusGeometry(1,.055,8,64);
  scene.add(new THREE.HemisphereLight('#e8b4ff','#305d78',2.4));
  const key=new THREE.DirectionalLight('#ffca86',3);key.position.set(-80,120,-80);scene.add(key);
  const rim=new THREE.DirectionalLight('#65e5ff',2);rim.position.set(80,20,40);scene.add(rim);
  const sky=new THREE.Mesh(new THREE.SphereGeometry(1300,32,20),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{time:{value:0},top:{value:new THREE.Color(chapters[0].high)},low:{value:new THREE.Color(chapters[0].low)},haze:{value:new THREE.Color(chapters[0].haze)}},vertexShader:`varying vec3 d;void main(){d=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`
    varying vec3 d;uniform float time;uniform vec3 top,low,haze;
    uniform sampler2D artA,artB;uniform float artMix,artReady,aspectA,aspectB;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
    float fbm(vec2 p){float n=0.,a=.5;for(int i=0;i<5;i++){n+=a*noise(p);p=p*2.03+7.8;a*=.5;}return n;}
    void main(){vec3 v=normalize(d);vec3 c=mix(low,top,smoothstep(-.2,.8,v.y));
    vec2 uv=v.xz/(abs(v.y)+.65)*2.5;float clouds=fbm(uv*2.4+vec2(time*.006,time*.003));float thin=fbm(uv*5.1-vec2(time*.003,0.));
    float layer=smoothstep(.44,.67,clouds+.16*thin)*(1.-smoothstep(.14,.55,v.y));c=mix(c,haze,layer*.39);
    c=mix(c,haze,exp(-pow((v.y+.12)*7.,2.))*.32);
    float sunlight=max(dot(v,normalize(vec3(-.41,.42,-.8))),0.);c+=haze*pow(sunlight,48.)*.37+vec3(1.,.78,.53)*pow(sunlight,500.)*.62;
    float theta=atan(v.x,-v.z);float angle=atan(sin(theta*2.),cos(theta*2.))*.5;
    vec2 surround=vec2(theta/6.283185+.5,.5+asin(clamp(v.y,-1.,1.))/3.141593);
    vec3 surroundingArt=mix(texture2D(artA,surround).rgb,texture2D(artB,surround).rgb,artMix);
    c=mix(c,surroundingArt,.56*artReady*(1.-smoothstep(2.8,3.141593,abs(theta))));
    vec2 coverA=vec2(.5+angle/(1.65*aspectA),.59+asin(clamp(v.y,-1.,1.))/1.4);
    vec2 coverB=vec2(.5+angle/(1.65*aspectB),.59+asin(clamp(v.y,-1.,1.))/1.4);
    float maskA=smoothstep(0.,.13,coverA.x)*(1.-smoothstep(.87,1.,coverA.x))*smoothstep(0.,.13,coverA.y)*(1.-smoothstep(.9,1.,coverA.y));
    float maskB=smoothstep(0.,.13,coverB.x)*(1.-smoothstep(.87,1.,coverB.x))*smoothstep(0.,.13,coverB.y)*(1.-smoothstep(.9,1.,coverB.y));
    vec3 artworkA=texture2D(artA,clamp(coverA,0.,1.)).rgb;
    vec3 artworkB=texture2D(artB,clamp(coverB,0.,1.)).rgb;
    vec3 worldA=mix(c,artworkA,maskA*.95),worldB=mix(c,artworkB,maskB*.95);
    c=mix(c,mix(worldA,worldB,artMix),artReady);
    c+=haze*layer*.025;
    gl_FragColor=vec4(c,1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`}));sky.frustumCulled=false;scene.add(sky);
  Object.assign(sky.material.uniforms,{artA:{value:artwork.fallback},artB:{value:artwork.fallback},artMix:{value:0},artReady:{value:0},aspectA:{value:1},aspectB:{value:1}});
  const center=s=>sampleSkyRoute(s).p;
  const frame=skyRouteFrame;
  function at(s,lateral=0,lift=0){const f=frame(s);return f.p.addScaledVector(f.right,lateral).addScaledVector(f.up,lift);}
  function add(group,geometry,material,p,scale=[1,1,1]){const m=new THREE.Mesh(geometry,material);m.position.copy(p);m.scale.set(...scale);group.add(m);return m;}
  function ribbon(group,s,left,right,material,lift=0,length=CHUNK,origin=center(s)){
    const positions=[],uv=[],indices=[];
    const steps=Math.max(2,Math.ceil(length/3));
    for(let i=0;i<=steps;i++){const d=s+i*length/steps;for(const l of [left,right]){const p=at(d,l,lift).sub(origin);positions.push(p.x,p.y,p.z);uv.push(l,d*.025);}if(i<steps&&!sampleSkyRoute(d+length/steps/2).airborne){const k=i*2;indices.push(k,k+1,k+2,k+1,k+3,k+2);}}
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();
    const m=new THREE.Mesh(geo,material);m.userData.ownedGeometry=true;group.add(m);
  }
  const grainCanvas=document.createElement('canvas');grainCanvas.width=grainCanvas.height=256;const grainCtx=grainCanvas.getContext('2d');
  grainCtx.fillStyle='#aaaaaa';grainCtx.fillRect(0,0,256,256);let grainSeed=7819;
  for(let i=0;i<16000;i++){grainSeed=(Math.imul(grainSeed,1664525)+1013904223)>>>0;const x=grainSeed%256;grainSeed=(Math.imul(grainSeed,1664525)+1013904223)>>>0;const y=grainSeed%256;grainCtx.fillStyle=i%4?'#9a9a9a':'#d2d2d2';grainCtx.fillRect(x,y,1+i%2,1+i%2);}
  const grainMap=new THREE.CanvasTexture(grainCanvas);grainMap.wrapS=grainMap.wrapT=THREE.RepeatWrapping;
  const road=new THREE.ShaderMaterial({side:THREE.DoubleSide,uniforms:{time:{value:0},roadTint:{value:new THREE.Color(chapters[0].road)},fogTint:{value:new THREE.Color(chapters[0].haze)},grainMap:{value:grainMap}},vertexShader:`varying vec2 v;varying vec3 world;void main(){v=uv;world=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(world,1.);}`,fragmentShader:`varying vec2 v;varying vec3 world;uniform float time;uniform vec3 roadTint,fogTint;uniform sampler2D grainMap;void main(){
    float grain=fract(sin(dot(v*1100.,vec2(12.9898,78.233)))*43758.5453)*.055;
    float vein=sin(v.y*.9+sin(v.x*17.)*.1)*.5+.5;
    float aggregate=texture2D(grainMap,vec2(v.x*.35,v.y*2.8)).r;
    vec3 c=roadTint*(1.24+grain*.4+vein*.04+aggregate*.28)+vec3(.014);
    float fog=smoothstep(230.,850.,length(cameraPosition-world));c=mix(c,fogTint*.4,fog);gl_FragColor=vec4(c,1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`});
  // Soft cloud sheets layer in depth. Near wisps briefly veil the road on descents.
  const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=128;
  const ctx=glowCanvas.getContext('2d'),gradient=ctx.createRadialGradient(64,64,0,64,64,64);
  gradient.addColorStop(0,'rgba(255,255,255,.65)');gradient.addColorStop(.28,'rgba(255,255,255,.24)');gradient.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);
  const glowMap=new THREE.CanvasTexture(glowCanvas);
  const glows=colors.map(color=>new THREE.SpriteMaterial({map:glowMap,color,transparent:true,opacity:.45,depthWrite:false,blending:THREE.AdditiveBlending}));
  const cloudSprites=chapters.map(c=>new THREE.SpriteMaterial({map:glowMap,color:c.haze,transparent:true,opacity:.55,depthWrite:false}));
  const laneMark=new THREE.MeshBasicMaterial({color:'#e9dabc',side:THREE.DoubleSide});
  function glow(group,p,size,color){const sprite=new THREE.Sprite(glows[color]);sprite.position.copy(p);sprite.scale.set(size,size,1);group.add(sprite);}
  function cloud(group,p,w,h,theme){const sprite=new THREE.Sprite(cloudSprites[theme]);sprite.position.copy(p);sprite.scale.set(w,h,1);group.add(sprite);}
  function tube(group,origin,points,material,r=.1){const path=new THREE.CatmullRomCurve3(points.map(p=>p.clone().sub(origin)));const geo=new THREE.TubeGeometry(path,Math.max(12,points.length*2),r,6,false);const o=add(group,geo,material,new THREE.Vector3());o.userData.ownedGeometry=true;}
  const sun=new THREE.Group();scene.add(sun);glow(sun,new THREE.Vector3(),230,3);
  add(sun,sphere,new THREE.MeshBasicMaterial({color:'#ffe3af'}),new THREE.Vector3(),[22,22,22]);
  function makeChunk(n){
    const s=n*CHUNK,group=new THREE.Group(),origin=center(s);group.userData.s=s;
    const local=(d,l=0,h=0)=>at(d,l,h).sub(origin),theme=themeAt(s+CHUNK/2),side=n%2?1:-1,mid=s+CHUNK*.54;
    ribbon(group,s,-6.6,6.6,plum,-.18);
    ribbon(group,s,-5.7,5.7,road);
    for(const dir of [-1,1]){
      ribbon(group,s,dir<0?-5.75:5.67,dir<0?-5.67:5.75,laneMark,.025);
      let bright=[],steel=[];const finishRail=()=>{if(bright.length>1){tube(group,origin,bright,neon[theme],.06);tube(group,origin,steel,gold,.065);}bright=[];steel=[];};
      for(let i=0;i<=36;i++){const d=s+i*CHUNK/36;if(sampleSkyRoute(d).airborne){finishRail();continue;}bright.push(at(d,dir*6.35,.65));steel.push(at(d,dir*6.35,.29));}finishRail();
    }
    for(let k=6;k<CHUNK;k+=12)ribbon(group,s+k,-.09,.09,laneMark,.028,4,origin);
    if(n%3===0){const f=frame(mid),arch=add(group,ring,neon[theme],local(mid,0,6),[10.7,10.7,1]);arch.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),f.t);if(n%6===0){const outer=add(group,ring,pearl,local(mid+.5,0,6),[11.5,11.5,1]);outer.quaternion.copy(arch.quaternion);}glow(group,local(mid,0,18),45,theme);}
    if(theme===0){
      // Blue-sky boomerang brushstrokes from I Was Away.
      for(const sign of [-1,1]){const path=[];for(let i=0;i<=16;i++){const u=i/16;path.push(at(mid-19+u*38,sign*(18+8*Math.sin(u*Math.PI)),12+14*Math.sin(u*Math.PI)));}tube(group,origin,path,sign<0?pearl:neon[theme],.28);}
    }else if(theme===1){
      // Waterfall ribbons stretch below the elevated road.
      for(let j=0;j<3;j++){const path=[];for(let i=0;i<12;i++){const u=i/11;path.push(at(mid-13+j*12+Math.sin(u*5+j)*1.5,side*(13+j*6),8-u*38));}tube(group,origin,path,glossy[theme],.34);}
    }else if(theme===2){
      for(let j=0;j<4;j++){const path=[];for(let i=0;i<8;i++){const u=i/7;path.push(at(s+8+j*15+u*5,side*(18+j*2+Math.sin(u*6)*2),2+u*19));}tube(group,origin,path,j%2?neon[theme]:gold,.13);}
    }else if(theme===3){
      for(let j=0;j<3;j++){const m=add(group,ring,j%2?pearl:neon[theme],local(mid,side*(21+j*4),8+j*4),[5+j*2,5+j*2,1]);m.rotation.set(.2+j*.2,.5,side*.22);}
    }else if(theme===4){
      const path=[];for(let i=0;i<=30;i++){const a=i/30*Math.PI*2,x=16*Math.sin(a)**3,y=12*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a);path.push(at(mid,side*26+x*.55,15+y*.53));}tube(group,origin,path,neon[theme],.2);glow(group,local(mid,side*25,17),40,theme);
    }else if(theme===5){
      for(let j=0;j<4;j++){const path=[];for(let i=0;i<10;i++){const u=i/9;path.push(at(s+7+j*14+u*9,side*(20+j*2),2+u*25));}tube(group,origin,path,j%2?pearl:gold,.1);}
    }else{
      for(let j=0;j<5;j++){const path=[];for(let i=0;i<10;i++){const u=i/9;path.push(at(s+3+j*12+u*8,side*(17+5*Math.sin(u*5+j)),4+u*15));}tube(group,origin,path,j%2?gold:neon[theme],.13);}
    }
    for(let i=0;i<5;i++){const d=s+i*14,dir=i%2?1:-1;cloud(group,local(d,dir*(34+i*15),-19-i%2*9),105+i*12,56+i*4,theme);}
    for(let i=0;i<2;i++)cloud(group,local(s+10+i*38,(i?1:-1)*18,13+i*4),28+i*8,17+i*4,theme);
    const u=phaseAt(mid);if((theme===0||theme===2||theme===4)&&u>.5&&u<.79)for(const dir of [-1,1])cloud(group,local(mid,dir*14,8),42,32,theme);
    artwork.decorate(group,s,origin,theme,at,n);
    scene.add(group);chunks.set(n,group);created++;
  }
  function maintain(){const current=Math.floor(distance/CHUNK);for(let n=current-2;n<=current+12;n++)if(!chunks.has(n))makeChunk(n);for(const [n,g] of chunks)if(n<current-2||n>current+12){scene.remove(g);g.traverse(o=>{if(o.userData.ownedGeometry)o.geometry.dispose();if(o.isInstancedMesh)o.dispose();});chunks.delete(n);disposed++;}}
  function render(dt){
    if(dt>0){time+=dt;const delta=center(distance+.2).sub(center(distance-.2)),metric=Math.max(.25,delta.length()/.4),slope=delta.clone().normalize().y;const target=THREE.MathUtils.clamp(35-slope*8,26,44);speed+=Math.min(1,dt*.8)*(target-speed);distance+=speed*dt/metric;frames++;}
    maintain();const origin=center(distance),f=frame(distance),eye=at(distance,1.8,2.1).sub(origin),look=at(distance+(f.loop?4:8),1.8,2.2).sub(origin);
    camera.aspect=host.clientWidth/Math.max(1,host.clientHeight);camera.fov=innerWidth<800?70:58;camera.updateProjectionMatrix();camera.position.copy(eye);camera.up.copy(f.up);camera.lookAt(look);
    for(const g of chunks.values()){g.position.copy(center(g.userData.s).sub(origin));for(const o of g.children){if(o.userData.artMoon)o.quaternion.copy(camera.quaternion);if(o.userData.floatBase!==undefined)o.position.y=o.userData.floatBase+Math.sin(time*.32+o.userData.floatPhase)*1.4;}}
    const chapter=themeAt(distance),u=phaseAt(distance),blend=ease(.87,.99,u),now=chapters[chapter],next=chapters[(chapter+1)%chapters.length];
    const a=new THREE.Color(),b=new THREE.Color();sky.position.copy(camera.position);sky.material.uniforms.time.value=time;
    sky.material.uniforms.top.value.copy(a.set(now.high).lerp(b.set(next.high),blend));
    sky.material.uniforms.low.value.copy(a.set(now.low).lerp(b.set(next.low),blend));
    sky.material.uniforms.haze.value.copy(a.set(now.haze).lerp(b.set(next.haze),blend));
    scene.fog.color.copy(a.set(now.haze).lerp(b.set(next.haze),blend));
    road.uniforms.roadTint.value.copy(a.set(now.road).lerp(b.set(next.road),blend));road.uniforms.fogTint.value.copy(scene.fog.color);
    artwork.updateSky(sky.material,chapter,u,ease);
    key.color.copy(a.set(now.haze).lerp(b.set(next.haze),blend));key.intensity=chapter===2||chapter===3?2.6:2;
    sun.visible=false;
    const shadows=renderer.shadowMap.enabled;renderer.shadowMap.enabled=false;renderer.render(scene,camera);renderer.shadowMap.enabled=shadows;
    artwork.renderMist(document.body.classList.contains('reduced')?0:f.mist,time,scene.fog.color);
    host.dataset.distance=distance.toFixed(1);
    host.dataset.skyFrames=String(frames);host.dataset.skyTime=time.toFixed(2);
    host.dataset.chapter=String(chapter);host.dataset.maneuver=f.maneuver;host.dataset.assetErrors=artwork.errors.join(',');
    document.getElementById('routeLabel').textContent=now.name;document.getElementById('speedLabel').textContent='SKY SESSION · '+f.maneuver;
    const cabin=document.getElementById('cabinRig'),dash=document.getElementById('scene');
    if(dt>0){cabin.style.setProperty('--rig-x',Math.sin(time*1.6)*.4+'px');cabin.style.setProperty('--rig-y',Math.sin(time*2.1)*.58+'px');cabin.style.setProperty('--rig-roll',f.bank*2.2+'deg');dash.style.setProperty('--sky-hue',[205,194,22,42,337,285,32][chapter]+'deg');dash.style.setProperty('--reflection',.13+Math.sin(distance*.013)*.07);dash.style.setProperty('--reflect-x',Math.sin(distance*.007)*80+'px');dash.style.setProperty('--sun-strength',chapter===2||chapter===3?.32:.2);dash.style.setProperty('--shade-strength',chapter===4||chapter===5?.13:.08);}
  }
  artwork.ready.then(()=>{if(window.RIDE_ROUTE==='sky')render(0);});
  return {render,ready:artwork.ready,get stats(){return {distance,time,speed,frames,chunks:chunks.size,created,disposed,elevation:center(distance).y,bank:frame(distance).bank,chapter:themeAt(distance),phase:phaseAt(distance),move:sampleSkyRoute(distance).maneuver,assetErrors:artwork.errors};}};
}

