import * as T from './vendor/three.module.min.js';
// Layered dusk silhouettes and sculpted planters replace the flat tree atlas.
export function addFoliage(scene){
 const bark=new T.MeshStandardMaterial({color:0x30313a,roughness:1});
 function branch(group,a,b,r){const d=b.clone().sub(a),m=new T.Mesh(new T.CylinderGeometry(r*.45,r,d.length(),9),bark);m.position.copy(a).addScaledVector(d,.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());group.add(m);}
 const leafGeo=new T.SphereGeometry(1,10,8),leafMats=[0x425d47,0x647951,0x8b925d].map(color=>new T.MeshStandardMaterial({color,roughness:.8}));
 for(const [x,y] of [[-9,5],[9,5],[-9,15],[9,20]]){const g=new T.Group();g.position.set(x,y,-1.3);scene.add(g);const pot=new T.Mesh(new T.CylinderGeometry(.38,.27,.65,16),new T.MeshStandardMaterial({color:0x79624e,roughness:.7}));pot.position.y=.325;g.add(pot);const rim=new T.Mesh(new T.TorusGeometry(.38,.045,6,20),bark);rim.rotation.x=Math.PI/2;rim.position.y=.65;g.add(rim);for(let i=0;i<16;i++){const a=i*2.4,leaf=new T.Mesh(leafGeo,leafMats[i%3]);leaf.position.set(Math.cos(a)*.3,.85+(i%4)*.13,Math.sin(a)*.3);leaf.scale.set(.09,.43,.035);leaf.rotation.set(Math.sin(a)*.65,0,Math.cos(a)*.65);g.add(leaf);}}
}
