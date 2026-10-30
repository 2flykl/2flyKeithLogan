import * as T from './vendor/three.module.min.js';
export function createScaleRig(parent,index){
 const maps=[],texture=new T.TextureLoader().load('assets/scale-parts.png',()=>maps.forEach(m=>m.needsUpdate=true));texture.colorSpace=T.SRGBColorSpace;texture.minFilter=T.LinearFilter;texture.generateMipmaps=false;
 function part(row,w,h,target){const bounds=[[.01,.49],[.56,.67],[.78,.96]][row],map=texture.clone();map.repeat.set(1/3,bounds[1]-bounds[0]);map.offset.set(index/3,1-bounds[1]);maps.push(map);const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map,transparent:true,alphaTest:.03,side:T.DoubleSide,toneMapped:false}));target.add(m);return m;}
 const pedestal=part(0,1.65,1.85,parent);pedestal.position.set(0,.81,-.12);
 const beam=new T.Group();beam.position.y=1.5;parent.add(beam);part(1,4.5,.57,beam);
 const pans=[],hangers=[],chains=[],cargo=new T.Group(),rightCargo=new T.Group();const gold=[0xe2b969,0xb67d53,0xe9baa0][index];
 for(const side of [-1,1]){const hanging=new T.Group();parent.add(hanging);hangers.push(hanging);const pan=part(2,1.85,.6,hanging);pan.position.y=-.18;pans.push(pan);for(const offset of [-.72,.72]){const geometry=new T.BufferGeometry().setFromPoints([new T.Vector3(),new T.Vector3()]);const chain=new T.Line(geometry,new T.LineBasicMaterial({color:gold}));parent.add(chain);chains.push({chain,side,offset});}}
 hangers[0].add(cargo);hangers[1].add(rightCargo);cargo.position.set(0,.04,.12);rightCargo.position.set(0,.04,.12);
 const glow=new T.Mesh(new T.RingGeometry(.65,.78,48),new T.MeshBasicMaterial({color:0x9ff5cf,transparent:true,opacity:0,side:T.DoubleSide,depthWrite:false}));glow.rotation.x=-Math.PI/2;glow.position.set(0,.04,.2);hangers[1].add(glow);
 const jewel=new T.Mesh(new T.CircleGeometry(.12,24),new T.MeshBasicMaterial({color:gold}));jewel.position.set(0,1.5,.15);parent.add(jewel);
 function update(s,time){beam.rotation.z=s.angle;for(let i=0;i<2;i++){const side=i?1:-1;hangers[i].position.set(side*2*Math.cos(s.angle),1.5+side*2*Math.sin(s.angle)-.8,.12);}for(const {chain,side,offset} of chains){const a=chain.geometry.attributes.position,x=side*2*Math.cos(s.angle),y=1.5+side*2*Math.sin(s.angle);a.setXYZ(0,x,y,.1);a.setXYZ(1,x+offset,y-.8,.12);a.needsUpdate=true;chain.geometry.computeBoundingSphere();}const ready=s.phase==='ready';glow.material.opacity+=( (ready?.6+Math.sin(time*5)*.2:0)-glow.material.opacity)*.15;glow.scale.setScalar(s.phase==='launching'?1+( .55-s.launch)*2:1);jewel.material.color.set(s.phase==='spilled'?0xff95aa:ready?0xa4ffd1:gold);}
 return {beam,pans,cargo,cargos:[cargo,rightCargo],update};
}
