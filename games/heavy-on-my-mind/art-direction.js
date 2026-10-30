import {createSceneAssets} from './scene-assets.js';
import * as T from './vendor/three.module.min.js';

// Render-only scenery. Collision platforms and the player's movement plane stay unchanged.
export function createArtDirection(scene,kit){
  const assets=createSceneAssets(scene);
  const loader=new T.TextureLoader();
  const masonry=loader.load('assets/brownstone-brick.png');masonry.wrapS=masonry.wrapT=T.RepeatWrapping;masonry.repeat.set(4,5);masonry.colorSpace=T.SRGBColorSpace;masonry.anisotropy=8;
  const wallMaterial=new T.MeshStandardMaterial({map:masonry,roughness:.93,bumpMap:masonry,bumpScale:.055,color:0xc1a59c});
  const terraceTexture=masonry.clone();terraceTexture.repeat.set(4,1);terraceTexture.needsUpdate=true;
  const terraceMaterial=new T.MeshStandardMaterial({map:terraceTexture,roughness:.96,bumpMap:terraceTexture,bumpScale:.04,color:0xa8958b});
  const paving=assets.floorTexture(),steel=new T.MeshStandardMaterial({color:0x35373c,metalness:.66,roughness:.48}),edge=new T.MeshStandardMaterial({color:0x7d796b,metalness:.4,roughness:.6});
  function between(a,b,r,mat=steel){const start=new T.Vector3(...a),finish=new T.Vector3(...b),delta=finish.clone().sub(start);const m=new T.Mesh(new T.CylinderGeometry(r,r,delta.length(),8),mat);m.position.copy(start).addScaledVector(delta,.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());scene.add(m);return m;}
  function deck(x,y,w,name){
    const depth=name==='Sidewalk'?6.8:name==='Front-door porch'?6.2:5.9,front=-2.1+depth;
    const floorCopies=paving.userData.copies;paving.userData={};const tile=paving.clone();paving.userData={copies:floorCopies};floorCopies.push(tile);tile.repeat.set(w/3.2,depth/3.2);tile.needsUpdate=true;
    const top=new T.Mesh(new T.PlaneGeometry(w,depth),new T.MeshStandardMaterial({map:tile,bumpMap:tile,bumpScale:.025,roughness:.87,color:name==='Retaining garden'?0x9d9f84:0xbbb0a0}));top.rotation.x=-Math.PI/2;top.position.set(x,y+.007,-2.1+depth/2);scene.add(top);
    const slab=kit.cube(x,y-.22,-2.1+depth/2,w,.43,depth,0x514d49);slab.material=edge;
    for(let px=x-w/2+1.5;px<x+w/2;px+=3)assets.panel('fascia',px,y-.27,front+.12,3,.65);
    const fascia=kit.cube(x,y-.27,front,w,.42,.16,0x35373c);fascia.material=steel;
    for(const h of [-.09,-.46]){const rim=kit.cube(x,y+h,front+.04,w,.055,.14,0x7d796b);rim.material=edge;}
    for(let px=x-w/2+.5;px<x+w/2;px+=1.6){const rivet=kit.ball(px,y-.25,front+.1,.047,0xb9b09a);rivet.scale.z=.38;}
    if(y>0){for(let px=x-w/2+1;px<x+w/2;px+=4){between([px,y-.43,front-.25],[px,y-1.35,-1.7],.075);between([px,y-1.35,-1.7],[px,y-.38,-1.7],.07);}
      // A low side rail at each end reveals depth without hiding the walking lane.
      for(const px of [x-w/2+.12,x+w/2-.12]){between([px,y+.52,-1.65],[px,y+.52,front-.2],.045,edge);between([px,y+.12,-1.65],[px,y+.12,front-.2],.028);for(let z=-1.65;z<=front-.15;z+=.65){between([px,y-.01,z],[px,y+.52,z],.025);const cap=kit.ball(px,y+.54,z,.048,0xc2a975);cap.scale.y=.7;}}}
  }
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=128;const sc=shadowCanvas.getContext('2d'),gradient=sc.createRadialGradient(64,64,5,64,64,62);gradient.addColorStop(0,'rgba(8,6,9,.62)');gradient.addColorStop(.45,'rgba(8,6,9,.3)');gradient.addColorStop(1,'rgba(8,6,9,0)');sc.fillStyle=gradient;sc.fillRect(0,0,128,128);const shadowTexture=new T.CanvasTexture(shadowCanvas);
  function contactShadow(x,y,z,sx=1,sz=.6,opacity=1,parent=scene){const mesh=new T.Mesh(new T.PlaneGeometry(sx,sz),new T.MeshBasicMaterial({map:shadowTexture,transparent:true,opacity,depthWrite:false}));mesh.rotation.x=-Math.PI/2;mesh.position.set(x,y+.025,z);parent.add(mesh);return mesh;}
  function details(){
    // Recessed pilasters, downpipes and fire-escape brackets anchor the vertical route.
    for(const x of [-11.15,11.15]){kit.cube(x,13,-1.9,.48,26,.45,0x725d52);between([x-.45,.2,-1.6],[x-.45,26,-1.6],.07);for(let y=2;y<26;y+=4)kit.cube(x-.45,y,-1.6,.27,.11,.3,0x80766a);}
    for(const y of [5,10,15,20]){const glow=new T.PointLight(0xffbc74,4,5,2);glow.position.set(0,y+.7,-.8);scene.add(glow);kit.cube(0,y+.8,-1.7,.7,.18,.18,0xcda577);}
    for(const y of [0,5,10,15,20])contactShadow(0,y,1,23,4,.25);
  }
  return {wallMaterial,terraceMaterial,deck,contactShadow,details};
}
