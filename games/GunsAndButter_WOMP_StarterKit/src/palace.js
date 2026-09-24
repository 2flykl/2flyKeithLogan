// Architectural geometry and materials for the Tempest pavilion.
export function buildPalace(T, A) {
 const {scene,renderer,mesh,box,cyl,ring,rod,sign,batch}=A;
 let seed=211;const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 function marble(dark=false){
  const c=document.createElement('canvas');c.width=c.height=1024;const g=c.getContext('2d');
  g.fillStyle=dark?'#131a20':'#dfdfd7';g.fillRect(0,0,1024,1024);
  for(let i=0;i<350;i++){const x=random()*1024,y=random()*1024,r=50+random()*220,gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,dark?'#67747c0b':'#ffffff38');gr.addColorStop(1,'#ffffff00');g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);}
  for(let i=0;i<44;i++){let x=random()*1400-180,y=-100;const path=new Path2D();path.moveTo(x,y);for(let j=0;j<24;j++){x+=(random()-.58)*115;y+=58;path.lineTo(x,y);}g.strokeStyle=dark?'#ced0c223':'#656d6831';g.lineWidth=1+random()*3;g.stroke(path);g.strokeStyle=dark?'#b9baa90a':'#858e8420';g.lineWidth=12+random()*15;g.stroke(path);}
  const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(7,7);t.colorSpace=T.SRGBColorSpace;t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t;
 }
 const whiteMap=new T.TextureLoader().load(PAVILION_DATA.marble);whiteMap.colorSpace=T.SRGBColorSpace;whiteMap.wrapS=whiteMap.wrapT=T.RepeatWrapping;whiteMap.repeat.set(3,3);whiteMap.anisotropy=8;
 const wallMap=whiteMap.clone();wallMap.repeat.set(1,2);const blackMap=marble(true);blackMap.repeat.set(1,1);
 const M={stone:new T.MeshStandardMaterial({color:0xf3f0e6,roughness:.46,map:wallMap}),floor:new T.MeshPhysicalMaterial({map:whiteMap,color:0xffffff,roughness:.23,metalness:.08,clearcoat:1,clearcoatRoughness:.2}),black:new T.MeshStandardMaterial({color:0x141b20,map:blackMap,roughness:.24,metalness:.35}),metal:new T.MeshStandardMaterial({color:0x1e272b,roughness:.3,metalness:.8}),gold:new T.MeshStandardMaterial({color:0xb69b62,roughness:.28,metalness:.8}),white:new T.MeshStandardMaterial({color:0xf5f3ea,roughness:.58}),glow:new T.MeshBasicMaterial({color:0xffeed0}),fabric:new T.MeshStandardMaterial({color:0xd6cec0,roughness:.95,side:T.DoubleSide}),window:new T.MeshBasicMaterial({color:0xc9e3ed})};
 // A studio environment gives the metal true reflections, even away from direct light.
 const env=new T.Scene();env.background=new T.Color(0x56616d);
 for(const [x,y,z,w,h,color] of [[0,7,0,14,12,0xffffff],[-7,3,0,5,7,0xd8eafa],[7,3,-3,4,8,0xffedd5],[0,3,8,10,4,0x90979d]]){const p=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color,side:T.DoubleSide}));p.position.set(x,y,z);p.lookAt(0,0,0);env.add(p);}
 const pmrem=new T.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(env,.05).texture;pmrem.dispose();env.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
 scene.background=new T.Color(0xbccdd2);scene.fog=new T.Fog(0xd0d3cf,32,72);
 const garden=new T.TextureLoader().load(PAVILION_DATA.garden);garden.colorSpace=T.SRGBColorSpace;garden.wrapS=T.RepeatWrapping;garden.repeat.set(4,1);
 const backdrop=mesh(new T.CylinderGeometry(38,38,23,128,1,true),new T.MeshBasicMaterial({map:garden,side:T.BackSide,fog:false}),scene,[0,8.5,0]);backdrop.castShadow=false;backdrop.receiveShadow=false;
 M.window=new T.MeshPhysicalMaterial({color:0xd3e5e6,transparent:true,opacity:.07,metalness:.05,roughness:.1,depthWrite:false});
 scene.add(new T.HemisphereLight(0xeaf5ff,0x716657,1.15));
 const sun=new T.DirectionalLight(0xfff1d9,3.1);sun.position.set(-12,14,-8);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);Object.assign(sun.shadow.camera,{left:-20,right:20,top:20,bottom:-20,near:1,far:55});sun.shadow.normalBias=.025;sun.shadow.bias=-.0002;scene.add(sun);
 const fill=new T.DirectionalLight(0xc5e9ff,.75);fill.position.set(10,6,6);scene.add(fill);
 const front=new T.DirectionalLight(0xfff3df,2.1);front.position.set(0,5,6);scene.add(front);
 const floor=mesh(new T.CircleGeometry(18,128),M.floor,scene,[0,0,0]);floor.rotation.x=-Math.PI/2;
 const outer=mesh(new T.RingGeometry(9.6,17.8,128),M.black.clone(),scene,[0,.018,0]);outer.rotation.x=-Math.PI/2;
 for(const r of [1.9,2.02,6.25,6.32,9.45,9.57,17.4]){const o=ring(scene,r>9?M.gold:M.black,r,r>9?.025:.018,0,.035,0);o.rotation.x=-Math.PI/2;}
 for(let i=0;i<24;i++){const a=i*Math.PI/12;rod(scene,M.gold,[Math.sin(a)*9.7,.04,Math.cos(a)*9.7],[Math.sin(a)*17.2,.04,Math.cos(a)*17.2],.009);}
 const center=sign(scene,['G & B','WEAPONS OF MASS PRODUCTION'],3.4,.86,0,.042,1.8,0,{bg:'#deded8',fg:'#172024',accent:'#5c605c',size:110});center.rotation.x=-Math.PI/2;
 // Window bays alternate with curated art and full-height pleated curtains.
 const curtains=[];
 for(let i=0;i<20;i++){
  const a=i*Math.PI/10,g=new T.Group();scene.add(g);g.rotation.y=a;const width=5.42;
  box(g,M.black,width,.3,.65,0,.15,-17.8);box(g,M.white,width,.22,.65,0,8.9,-17.8);
  if(i%5!==0){
   box(g,M.window,4.85,6.9,.08,0,4.6,-17.94);
   for(const x of [-2.5,0,2.5])box(g,M.metal,.065,7.6,.16,x,4.45,-17.7);
   for(const y of [.68,3.4,6.5,8.2])box(g,M.metal,5.04,.065,.16,0,y,-17.7);
   box(g,M.stone,5.2,.25,2.2,0,.06,-19.1);
   if(i%2===0)for(const side of [-1,1]){
    const geo=new T.PlaneGeometry(1.45,7.25,24,30),p=geo.attributes.position;
    for(let v=0;v<p.count;v++){const x=p.getX(v),y=p.getY(v);p.setZ(v,Math.cos((x+.72)*Math.PI*8)*.15+.13*Math.cos(y*.5));p.setX(v,x+side*.16*Math.sin((y+3.62)/7.25*Math.PI));}geo.computeVertexNormals();
    const cloth=mesh(geo,M.fabric,g,[side*1.98,4.49,-17.25]);curtains.push(cloth);rod(g,M.gold,[side*1.25,1.8,-17],[side*2.63,1.8,-17],.018);
   }
  }else{
   box(g,M.stone,5.1,8.1,.36,0,4.5,-17.8);
   const art=typeof MUSEUM_ART_DATA!=='undefined'?MUSEUM_ART_DATA[(i/5)%3]:null;
   if(art){const tex=new T.TextureLoader().load(art);tex.colorSpace=T.SRGBColorSpace;box(g,M.black,3.36,4.72,.16,0,4.9,-17.5);mesh(new T.PlaneGeometry(3.14,4.5),new T.MeshStandardMaterial({map:tex,roughness:.55}),g,[0,4.9,-17.4]);}
   sign(g,['BLACK FORM','PERMANENT COLLECTION / G&B'],2.7,.42,0,2.1,-17.4,0,{size:53});
  }
  // Fluted pillars, layered capitals and black bases.
  const pillar=new T.Group();g.add(pillar);pillar.position.set(2.72,0,-17.1);
  mesh(new T.CylinderGeometry(.26,.34,7.85,32),M.stone,pillar,[0,4.3,0]);
  for(let j=0;j<12;j++){const b=j*Math.PI/6;rod(pillar,M.white,[Math.sin(b)*.29,.7,Math.cos(b)*.29],[Math.sin(b)*.24,8.1,Math.cos(b)*.24],.025);}
  for(const [y,r,h,mat] of [[.22,.51,.44,M.black],[.48,.42,.13,M.gold],[8.18,.42,.16,M.gold],[8.37,.53,.23,M.white]])mesh(new T.CylinderGeometry(r,r,h,32),mat,pillar,[0,y,0]);
  box(g,M.black,5.5,.15,.8,0,8.62,-17.35);box(g,M.gold,5.5,.026,.82,0,8.51,-17.35);
 }
 // A coffered ceiling and glass oculus replace the flat prototype roof.
 const ceiling=mesh(new T.RingGeometry(5.8,18,96),M.white,scene,[0,9,0]);ceiling.rotation.x=Math.PI/2;
 for(const r of [5.85,6.12,10.8,16.4,17.4]){const o=ring(scene,M.black,r,.085,0,8.9,0);o.rotation.x=-Math.PI/2;const l=ring(scene,M.glow,r-.12,.018,0,8.88,0);l.rotation.x=-Math.PI/2;}
 for(let i=0;i<20;i++){const a=i*Math.PI/10;rod(scene,M.black,[Math.sin(a)*5.9,8.93,Math.cos(a)*5.9],[Math.sin(a)*17.6,8.93,Math.cos(a)*17.6],.055);}
 const sky=mesh(new T.CircleGeometry(5.82,64),new T.MeshBasicMaterial({color:0xd7e6ec,side:T.DoubleSide}),scene,[0,9.2,0]);sky.rotation.x=Math.PI/2;
 for(let i=0;i<8;i++){const a=i*Math.PI/4;rod(scene,M.metal,[0,9.05,0],[Math.sin(a)*5.8,9.05,Math.cos(a)*5.8],.033);}
 // Suspended concentric chandelier, kept clear of the firing sight line.
 for(const [r,y] of [[3.2,6.9],[2.35,7.3],[1.45,7.7]]){const o=ring(scene,M.gold,r,.028,0,y,0);o.rotation.x=-Math.PI/2;const l=ring(scene,M.glow,r,.011,0,y-.035,0);l.rotation.x=-Math.PI/2;for(let i=0;i<4;i++){const a=i*Math.PI/2;rod(scene,M.metal,[Math.sin(a)*r,y,Math.cos(a)*r],[Math.sin(a)*r,9,Math.cos(a)*r],.008);}}
 // Annular arena: acoustic fins, recessed light lines and laminated barrier rails.
 for(let i=0;i<48;i++){
  const a=i*Math.PI/24,g=new T.Group();scene.add(g);g.rotation.y=a;
  box(g,M.metal,1.95,1.05,.3,0,.54,-16.5);
  for(let j=0;j<5;j++)box(g,M.black,.06,.88,.12,-.75+j*.36,.56,-16.28);
  box(g,M.glow,1.7,.018,.03,0,1.08,-16.31);
  if(i%2===0){box(g,M.metal,.035,.65,.04,0,.37,-9.7);box(g,M.gold,2.5,.025,.04,0,.7,-9.7);}
 }
 // Exhibit dais and anchored gimbal. The front of the WOMP points down -Z.
 mesh(new T.CylinderGeometry(2,2.1,.2,64),M.black,scene,[0,.1,-6.3]);
 const trim=ring(scene,M.gold,1.97,.017,0,.21,-6.3);trim.rotation.x=-Math.PI/2;
 box(scene,M.black,1.15,.7,.72,0,.57,-6.3);box(scene,M.gold,1.18,.022,.75,0,.92,-6.3);
 for(const x of [-.28,.28]){rod(scene,M.metal,[x,.9,-6.3],[x,1.3,-6.3],.045);cyl(scene,M.gold,.065,.07,x,1.3,-6.3);}
 sign(scene,['TAMBOURINE TEMPEST','01 / PERCUSSION DIVISION'],1.07,.27,0,.61,-5.929,0,{bg:'#141d22',fg:'#eedbb7',accent:'#d0b77f',size:44});
 // Freestanding monoliths carry art and interpretation, without blocking the instrument.
 for(const side of [-1,1]){box(scene,M.black,1.76,3.25,.22,side*3.2,1.68,-6.65);box(scene,M.gold,1.78,.022,.25,side*3.2,.065,-6.65);}
 if(typeof MUSEUM_ART_DATA!=='undefined'){const tex=new T.TextureLoader().load(MUSEUM_ART_DATA[0]);tex.colorSpace=T.SRGBColorSpace;mesh(new T.PlaneGeometry(1.58,2.55),new T.MeshStandardMaterial({map:tex,roughness:.4}),scene,[-3.2,1.91,-6.526]);}
 sign(scene,['BLACK FORM / I','THE PERMANENT COLLECTION'],1.48,.24,-3.2,.39,-6.52,0,{bg:'#111b20',fg:'#f2eadb',accent:'#cbb784',size:43});
 for(const [text,sub,y] of [['01 / TEMPEST','WEAPONS OF MASS PRODUCTION',2.9],['TAMBOURINE','× AUTOMATIC RHYTHM ENGINE',2.25],['THE JINGLE ENGINE','PAIRED BRASS ZILLS / 18 CHARGES',1.5],['STRIKE. RESONATE.','OPERATE ONLY AT THIS EXHIBIT',.65]])sign(scene,[text,sub],1.51,.38,3.2,y,-6.52,0,{bg:'#111b20',fg:'#f2eadb',accent:'#cbb784',size:48});
 // Seating is a sculpted black leather arc, with clear circulation around the exhibit.
 for(const side of [-1,1]){box(scene,M.black,2.4,.28,.7,side*5,.52,2);for(const x of [-.8,.8])box(scene,M.gold,.04,.36,.5,side*5+x,.21,2);}
 const exhibitLight=new T.SpotLight(0xffebc6,95,15,.46,.5,1.3);exhibitLight.position.set(-2,7,-3);exhibitLight.target.position.set(0,1.3,-6.3);scene.add(exhibitLight,exhibitLight.target);
 const architecture=new T.Group();scene.add(architecture);
 for(const object of [...scene.children])if(object!==floor&&object!==outer&&object!==backdrop&&object!==architecture&&(object.isMesh||object.isGroup))architecture.attach(object);
 batch(architecture);
 architecture.traverse(o=>{if(o.material?.transparent)o.castShadow=false;});
 return {M,floor,outer,curtains};
}

// A low-resolution planar reflection supplies real architectural reflections.
export function floorReflection(T,renderer,scene,camera,surfaces){
 const target=new T.WebGLRenderTarget(512,384,{type:T.HalfFloatType});
 const mirror=new T.PerspectiveCamera(),matrix=new T.Matrix4(),bias=new T.Matrix4().set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1);
 const uniforms={palaceReflection:{value:target.texture},palaceMatrix:{value:matrix}};
 for(const s of surfaces){s.material.onBeforeCompile=shader=>{Object.assign(shader.uniforms,uniforms);shader.vertexShader='varying vec4 vPalace; uniform mat4 palaceMatrix;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvPalace=palaceMatrix * modelMatrix * vec4(transformed,1.0);');shader.fragmentShader='varying vec4 vPalace; uniform sampler2D palaceReflection;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>','vec3 reflection=texture2D(palaceReflection,vPalace.xy/vPalace.w).rgb;\nfloat fresnel=pow(1.0-abs(dot(normal,geometryViewDir)),3.0);\noutgoingLight=mix(outgoingLight,reflection,0.12+0.25*fresnel);\n#include <opaque_fragment>');};}
 let frame=0;
 return {update(force=false){if(!force&&frame++%6)return;mirror.copy(camera);mirror.position.y=-camera.position.y+.01;const look=camera.getWorldDirection(new T.Vector3());look.y*=-1;mirror.up.set(0,-1,0);mirror.lookAt(mirror.position.clone().add(look));mirror.updateMatrixWorld();matrix.copy(bias).multiply(mirror.projectionMatrix).multiply(mirror.matrixWorldInverse);const old=renderer.getRenderTarget();surfaces.forEach(s=>s.visible=false);renderer.clippingPlanes=[new T.Plane(new T.Vector3(0,1,0),-.045)];renderer.setRenderTarget(target);renderer.render(scene,mirror);renderer.setRenderTarget(old);renderer.clippingPlanes=[];surfaces.forEach(s=>s.visible=true);},dispose(){target.dispose();}};
}
