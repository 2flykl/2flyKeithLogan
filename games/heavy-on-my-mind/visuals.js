import * as T from './vendor/three.module.min.js';

// Smooth, sculpted geometry for the architecture and animated characters.
export function createVisualKit(scene){
  const materials=new Map(),geometries=new Map();
  function material(color){if(!materials.has(color)){const gold=[0xcc9f52,0xe7bf70,0xdcb76b,0xe4b867,0xe5bf75,0xd8b273,0xd5a653].includes(color);materials.set(color,new T.MeshStandardMaterial({color,roughness:gold?.3:.62,metalness:gold?.55:.06}));}return materials.get(color);}
  function rounded(w,h,d){const key=[w,h,d].join('/');if(geometries.has(key))return geometries.get(key);const r=Math.min(.14,w*.23,h*.23,d*.23),g=new T.BoxGeometry(w,h,d,4,4,4),a=g.attributes.position,v=new T.Vector3(),inner=new T.Vector3(),n=new T.Vector3();for(let i=0;i<a.count;i++){v.fromBufferAttribute(a,i);inner.set(T.MathUtils.clamp(v.x,-w/2+r,w/2-r),T.MathUtils.clamp(v.y,-h/2+r,h/2-r),T.MathUtils.clamp(v.z,-d/2+r,d/2-r));n.copy(v).sub(inner).normalize().multiplyScalar(r);v.copy(inner).add(n);a.setXYZ(i,v.x,v.y,v.z)}g.computeVertexNormals();geometries.set(key,g);return g;}
  function cube(x,y,z,w,h,d,c,parent=scene){const m=new T.Mesh(rounded(w,h,d),material(c));m.position.set(x,y,z);parent.add(m);return m;}
  const sphere=new T.SphereGeometry(1,20,14);
  function ball(x,y,z,r,c,parent=scene){const m=new T.Mesh(sphere,material(c));m.position.set(x,y,z);m.scale.setScalar(r);parent.add(m);return m;}
  function ellipsoid(x,y,z,sx,sy,sz,c,parent){const m=ball(x,y,z,1,c,parent);m.scale.set(sx,sy,sz);return m;}
  function rod(x,y,z,rt,rb,h,c,parent=scene){const m=new T.Mesh(new T.CylinderGeometry(rt,rb,h,20),material(c));m.position.set(x,y,z);parent.add(m);return m;}
  function pan(x,y,z,c,parent=scene){const m=new T.Mesh(new T.CylinderGeometry(.95,.83,.17,32),material(c));m.position.set(x,y,z);m.scale.z=.79;parent.add(m);const rim=new T.Mesh(new T.TorusGeometry(.91,.05,8,40),material(0xe7bf70));rim.rotation.x=Math.PI/2;rim.position.y=.095;m.add(rim);return m;}
  function curve(points,r,c,parent=scene){const path=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));const m=new T.Mesh(new T.TubeGeometry(path,24,r,7,false),material(c));parent.add(m);return m;}
  function person(female=false){
    const g=new T.Group(),skin=female?0x995b42:0x8a513c,hair=0x241e2b;
    ellipsoid(0,1.18,0,.38,.49,.24,female?0xa74787:0xe7decc,g);
    if(female){const profile=[[.32,.48],[.47,.55],[.45,.72],[.32,.96],[.26,1.22]].map(p=>new T.Vector2(...p));const skirt=new T.Mesh(new T.LatheGeometry(profile,28),material(0x7b365f));g.add(skirt);cube(0,1.04,.17,.56,.07,.15,0xe4b867,g);}else{ellipsoid(0,1.22,.23,.19,.32,.05,0x283b4a,g);curve([[-.19,1.58,.16],[-.14,1.24,.26],[-.18,.87,.18]],.025,0xc8bdb0,g);curve([[.19,1.58,.16],[.14,1.24,.26],[.18,.87,.18]],.025,0xc8bdb0,g);}
    rod(0,1.61,0,.14,.15,.22,skin,g);ellipsoid(0,1.93,.015,.31,.39,.285,skin,g);
    for(const side of [-1,1]){ellipsoid(side*.31,1.91,0,.068,.10,.06,skin,g);ellipsoid(side*.115,1.98,.275,.071,.042,.023,0xf6eadd,g);ellipsoid(side*.115,1.98,.295,.028,.033,.012,0x242434,g);ball(side*.105,1.995,.306,.009,0xffffff,g);curve([[side*.06,2.08,.27],[side*.13,2.10,.27],[side*.2,2.075,.25]],.021,hair,g);}
    ellipsoid(0,1.9,.3,.054,.075,.065,skin,g);curve([[-.08,1.79,.264],[0,1.775,.28],[.08,1.79,.264]],.018,0x5e2935,g);
    ellipsoid(0,2.17,-.025,.325,.19,.28,hair,g);
    if(female){for(let i=0;i<16;i++){const a=i*Math.PI*2/16;ball(Math.cos(a)*.34,2.15+Math.sin(a)*.14,-.06+Math.sin(a)*.22,.145,hair,g)}for(let i=0;i<7;i++)ball(-.2+Math.sin(i*2)*.15,2.39+Math.cos(i*2)*.12,-.13,.14,hair,g);for(const side of [-1,1]){const ring=new T.Mesh(new T.TorusGeometry(.075,.013,6,20),material(0xe4b867));ring.position.set(side*.335,1.78,.01);g.add(ring)}}else{ellipsoid(0,1.72,.08,.24,.09,.16,hair,g);}
    curve([[-.16,1.58,.19],[0,1.42,.27],[.16,1.58,.19]],.016,0xe4b867,g);
    g.arms=[];g.legs=[];
    for(const side of [-1,1]){const arm=new T.Group();arm.position.set(side*.41,1.46,0);ellipsoid(0,-.12,0,.14,.24,.15,female?0xa74787:0xe7decc,arm);ellipsoid(side*.025,-.4,0,.10,.22,.11,skin,arm);ellipsoid(side*.03,-.62,.025,.105,.14,.075,skin,arm);g.add(arm);g.arms.push(arm);const leg=new T.Group();leg.position.set(side*.18,.7,0);ellipsoid(0,-.24,0,.13,.36,.14,female?skin:0x36516c,leg);ellipsoid(0,-.6,.10,.145,.105,.25,female?0x332334:0xe6dfd3,leg);cube(0,-.67,.10,.29,.06,.49,0xc9bbac,leg);g.add(leg);g.legs.push(leg);}
    scene.add(g);return g;
  }
  function decorate(){
    const sky=document.createElement('canvas');sky.width=64;sky.height=512;const ctx=sky.getContext('2d'),grad=ctx.createLinearGradient(0,0,0,512);grad.addColorStop(0,'#171e36');grad.addColorStop(.55,'#3b3340');grad.addColorStop(1,'#544441');ctx.fillStyle=grad;ctx.fillRect(0,0,64,512);scene.background=new T.CanvasTexture(sky);
    const rim=new T.DirectionalLight(0x9fc9f4,.9);rim.position.set(10,16,-1);scene.add(rim);
    // Curved canopies and fluted columns give the building a lived-in silhouette.
    for(const y of [5,10,15,20]){for(const x of [-10.7,10.7])rod(x,y-2.5,-1.6,.19,.24,4.8,0x886877);for(const x of [-8,0,8]){curve([[x-1.1,y+1.8,-1.85],[x-1,y+2.4,-1.85],[x,y+2.7,-1.85],[x+1,y+2.4,-1.85],[x+1.1,y+1.8,-1.85]],.075,0xd8ad96);}}
    for(const x of [-11,11]){rod(x,1.9,1.2,.07,.1,3.8,0x2d3548);const globe=ball(x,3.9,1.2,.27,0xffd6a3);globe.material=new T.MeshStandardMaterial({color:0xffd4a4,emissive:0xffad63,emissiveIntensity:.8});}
    // The neighborhood matte supplies the distant moon.
  }
  function paintBrick(ctx,w,h){ctx.fillStyle='#392b32';ctx.fillRect(0,0,w,h);for(let y=0;y<h;y+=48)for(let x=-120;x<w;x+=120){const offset=(Math.floor(y/48)%2)*60,shade=58+((x+y+1200)%17);ctx.fillStyle='rgb('+shade+','+Math.round(shade*.63)+','+Math.round(shade*.7)+')';ctx.fillRect(x+offset+2,y+2,116,44);ctx.fillStyle='#ffffff09';ctx.fillRect(x+offset+3,y+3,114,2)}}
  return {material,cube,ball,rod,pan,curve,person,decorate,paintBrick};
}
