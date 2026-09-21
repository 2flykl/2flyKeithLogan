export function createMusicFx(T,camera,palette){
 const pi=Math.PI;
 function paintTexture(painter){const c=document.createElement('canvas');c.width=c.height=128;painter(c.getContext('2d'));const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;}
 const glow=paintTexture(g=>{const q=g.createRadialGradient(64,64,0,64,64,62);q.addColorStop(0,'#ffffff');q.addColorStop(.09,'#ffffffed');q.addColorStop(.22,'#ffffff65');q.addColorStop(.5,'#ffffff15');q.addColorStop(1,'#ffffff00');g.fillStyle=q;g.fillRect(0,0,128,128);});
 const flare=paintTexture(g=>{g.translate(64,64);const q=g.createRadialGradient(0,0,0,0,0,63);q.addColorStop(0,'#fff');q.addColorStop(.08,'#ffffffdd');q.addColorStop(.35,'#ffffff44');q.addColorStop(1,'#ffffff00');g.fillStyle=q;g.fillRect(-64,-64,128,128);for(let i=0;i<10;i++){g.rotate(pi/5);g.fillStyle=i%2?'#ffffff70':'#ffffffbb';g.beginPath();g.moveTo(-3,0);g.lineTo(0,-59);g.lineTo(3,0);g.fill();}});
 const notes=palette.map(color=>new T.MeshBasicMaterial({color,toneMapped:false})),white=new T.MeshBasicMaterial({color:0xf6faff,toneMapped:false});
 const cdMaterial=new T.MeshPhysicalMaterial({color:0xe5f5ff,metalness:.92,roughness:.12,clearcoat:1,iridescence:1,iridescenceThicknessRange:[140,520],emissive:0x6d1ab7,emissiveIntensity:.42,side:T.DoubleSide});
 const bassMaterial=new T.MeshBasicMaterial({color:palette[2],transparent:true,opacity:.8,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false});
 function sprite(parent,map,color,size,opacity=1){const mat=new T.SpriteMaterial({map,color,transparent:true,opacity,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false});const s=new T.Sprite(mat);s.userData.ownMaterial=true;s.scale.setScalar(size);parent.add(s);return s;}
 function piece(g,geometry,material,x=0,y=0,z=0){const o=new T.Mesh(geometry,material);o.position.set(x,y,z);g.add(o);return o;}
 function note(parent,index,scale=1){const g=new T.Group();parent.add(g);g.scale.setScalar(scale);g.userData.effectKind='music-note';const mat=notes[index];
  function head(x,y){const o=piece(g,new T.CircleGeometry(.096,24),mat,x,y,.005);o.scale.y=.68;o.rotation.z=.27;const shine=piece(g,new T.CircleGeometry(.039,16),white,x-.016,y+.01,.01);shine.scale.y=.47;}
  const stem=x=>piece(g,new T.BoxGeometry(.025,.285,.014),mat,x,.035);
  if(index===1){head(-.045,-.103);stem(.034);const f=new T.Shape();f.moveTo(.033,.177);f.bezierCurveTo(.205,.135,.231,.015,.102,-.015);f.bezierCurveTo(.174,.064,.092,.062,.034,.075);f.closePath();piece(g,new T.ExtrudeGeometry(f,{depth:.012,bevelEnabled:false,curveSegments:10}),mat);}
  else{head(-.1,-.095);head(.13,-.059);stem(-.021);const st=stem(.209);st.position.y+=.036;const beam=piece(g,new T.BoxGeometry(.255,.047,.014),mat,.097,.176);beam.rotation.z=.155;if(index===0){const beam2=piece(g,new T.BoxGeometry(.255,.027,.014),mat,.097,.118);beam2.rotation.z=.155;}}
  sprite(g,glow,palette[index],.72,.55).position.set(.02,.03,-.01);return g;
 }
 function face(g){g.quaternion.copy(camera.getWorldQuaternion(new T.Quaternion()));}
 function projectile(parent,from,to,index){const g=new T.Group();parent.add(g);g.position.copy(from);g.userData.weapon=index;
  if(index===0){
   // A real compact disc—not a generic bolt. It flies edge-first, spins hard and
   // carries a rainbow glint that remains readable through ricochets.
   g.userData.effectKind='compact-disc';face(g);const disc=piece(g,new T.RingGeometry(.055,.19,56),cdMaterial);disc.userData.spinDisc=true;ringGlyph(g,.2);sprite(g,glow,palette[0],.62,.5);
  }else if(index===1){g.userData.effectKind='music-note';face(g);note(g,index,1.22);const echo=note(g,index,.62);echo.position.set(-.2,.13,-.02);echo.rotation.z=-.35;
  }else{
   // The 808 is a compressed bass-pressure sphere with expanding sub rings.
   g.userData.effectKind='bass-orb';face(g);const core=piece(g,new T.IcosahedronGeometry(.16,2),bassMaterial);core.userData.bassCore=true;sprite(g,glow,0xffffff,.35,1);for(let i=0;i<4;i++){const mat=new T.MeshBasicMaterial({color:i%2?0xff53e8:palette[index],transparent:true,opacity:.58-i*.08,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false});const r=piece(g,new T.TorusGeometry(.25+i*.07,.012,7,56),mat);r.userData.ownMaterial=true;r.rotation.x=i*.46;r.rotation.y=i*.31;}
  }return g;
 }
 function ringGlyph(g,r){const mat=new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.78,depthWrite:false,blending:T.AdditiveBlending,toneMapped:false});const ring=piece(g,new T.RingGeometry(r*.91,r,56),mat,0,0,.01);ring.userData.ownMaterial=true;return ring;}
 function muzzleFlash(parent,pos,dir,index){const g=new T.Group();parent.add(g);g.position.copy(pos);g.userData.effectKind='muzzle';sprite(g,flare,palette[index],index===2?.75:.46,.85);sprite(g,glow,0xfff8e3,.2,1);return g;}
 function impact(parent,p,index,heavy,transient,reduced,small=false){
  const flash=new T.Group();parent.add(flash);flash.position.copy(p);flash.userData.effectKind='impact';const glowSize=small?.75:heavy?3.5:1.8;const f=sprite(flash,flare,palette[index],glowSize,.95);const core=sprite(flash,glow,0xffffff,glowSize*.5,1);transient(flash,small?.16:.28,(o,t)=>{f.material.opacity=t;core.material.opacity=t;o.scale.setScalar(.6+(1-t)*.8);});
  for(let j=0;j<(small?1:heavy?3:2);j++){const mat=new T.MeshBasicMaterial({color:j%2?0xffcc5a:palette[index],transparent:true,opacity:.85,blending:T.AdditiveBlending,depthWrite:false,toneMapped:false});const o=new T.Mesh(new T.TorusGeometry(.12,.012,6,56),mat);o.userData.ownMaterial=true;parent.add(o);o.position.copy(p);face(o);transient(o,.34+j*.09,(o,t)=>{o.scale.setScalar(1+(1-t)*(small?3:heavy?20:10));o.material.opacity=t*.8;});}
  const count=reduced?3:small?5:heavy?22:13;
  for(let i=0;i<count;i++){const g=new T.Group();parent.add(g);g.position.copy(p);const color=i%4?palette[index]:0xffdf64,s=sprite(g,glow,color,.13+Math.random()*.13,.95),v=new T.Vector3((Math.random()-.5)*8,(Math.random()-.2)*7,(Math.random()-.2)*5);transient(g,.3+Math.random()*.38,(o,t,dt)=>{o.position.addScaledVector(v,dt);v.y-=5*dt;s.material.opacity=t;o.scale.setScalar(t);});}
  if(!small)for(let i=0;i<(reduced?1:heavy?7:4);i++){const g=new T.Group();parent.add(g);g.position.copy(p);face(g);const glyph=note(g,index,.7+Math.random()*.55),velocity=new T.Vector3((Math.random()-.5)*4,1+Math.random()*3,(Math.random()-.5)*2);transient(g,.55+Math.random()*.35,(o,t,dt)=>{o.position.addScaledVector(velocity,dt);velocity.y-=2*dt;glyph.rotation.z+=(i%2?1:-1)*dt*1.8;o.scale.setScalar(Math.min(1,t*3));});}
 }
 return {projectile,muzzleFlash,impact,face,note,palette};
}
