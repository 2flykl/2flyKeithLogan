import * as T from './vendor/three.module.min.js';
// All environment objects are visual-only; the authored jump route owns collision.
export function createNeighborhood(scene){
 const group=new T.Group();group.name='Dusk neighborhood';scene.add(group);
 const metal=new T.MeshStandardMaterial({color:0x28343b,metalness:.75,roughness:.38});
 const stone=new T.MeshStandardMaterial({color:0x847b72,roughness:.95});
 function box(x,y,z,w,h,d,mat){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);group.add(m);return m;}
 function rod(a,b,r=.04,mat=metal){const p=new T.Vector3(...a),v=new T.Vector3(...b).sub(p),m=new T.Mesh(new T.CylinderGeometry(r,r,v.length(),10),mat);m.position.copy(p).addScaledVector(v,.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());group.add(m);return m;}
 const skyline=new T.TextureLoader().load('assets/dusk-neighborhood.png');skyline.colorSpace=T.SRGBColorSpace;
 const backdrop=new T.Mesh(new T.PlaneGeometry(140,93.33),new T.MeshBasicMaterial({map:skyline,color:0xb8b8cf,fog:false,toneMapped:false}));backdrop.position.set(0,28,-45);group.add(backdrop);
 // A continuous street conceals the old floating plinth, with curb joints and recessed drains.
 const asphalt=new T.MeshStandardMaterial({color:0x252b35,roughness:.72});box(0,-1.1,-2,170,.45,110,asphalt);box(0,-.7,1,170,.8,13,stone);
 for(let x=-84;x<85;x+=1.6){box(x,-.275,5.7,1.54,.09,.7,stone);box(x,-.285,2.6,.025,.015,5.4,metal);}
 for(const x of [-17,17]){box(x,-.23,5.7,1.1,.03,.52,metal);for(let i=0;i<7;i++)box(x-.45+i*.15,-.205,5.7,.045,.02,.45,stone);}
 // Slender lanterns and warm pools bring depth to the street edges.
 const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=128;const ctx=glowCanvas.getContext('2d'),grad=ctx.createRadialGradient(64,64,0,64,64,64);grad.addColorStop(0,'rgba(255,197,111,.5)');grad.addColorStop(.3,'rgba(255,178,91,.15)');grad.addColorStop(1,'rgba(255,178,91,0)');ctx.fillStyle=grad;ctx.fillRect(0,0,128,128);const glowMap=new T.CanvasTexture(glowCanvas);
 for(const x of [-17,17]){box(x,.08,2,.5,.45,.5,metal);rod([x,.2,2],[x,5.8,2],.065);rod([x,5.8,2],[x+.7,5.8,2],.045);box(x+.7,5.35,2,.44,.65,.44,new T.MeshStandardMaterial({color:0xffddb0,emissive:0xffb35f,emissiveIntensity:1.2}));box(x+.7,5.72,2,.63,.09,.63,metal);for(const dx of [-.24,.24])rod([x+.7+dx,5,2.22],[x+.7+dx,5.7,2.22],.025);const light=new T.PointLight(0xffbf7c,14,11);light.position.set(x+.7,5.1,2.4);group.add(light);const halo=new T.Sprite(new T.SpriteMaterial({map:glowMap,transparent:true,depthWrite:false,blending:T.AdditiveBlending,opacity:.45}));halo.position.copy(light.position);halo.scale.set(2.5,2.5,1);group.add(halo);const pool=new T.Mesh(new T.PlaneGeometry(8,8),new T.MeshBasicMaterial({map:glowMap,transparent:true,opacity:.35,depthWrite:false}));pool.rotation.x=-Math.PI/2;pool.position.set(x,-.23,2);group.add(pool);}
 // Bench slats, iron tree grates and low planting beds stay beyond the playable lane.
 const wood=new T.MeshStandardMaterial({color:0x735142,roughness:.75});
 for(const x of [-19,19]){for(let i=0;i<4;i++)box(x,.55,1.7+i*.15,2.2,.09,.12,wood);for(let i=0;i<3;i++)box(x,.9+i*.16,1.6,2.2,.11,.09,wood);for(const dx of [-.8,.8])rod([x+dx,-.2,1.6],[x+dx,1.35,1.6],.055);box(x,-.15,-1.2,2.9,.3,2,stone);}
 // Warm trim lights and rear handrails do not cross the player's silhouette.
 for(const y of [5,10,15,20]){for(const x of [-10.5,10.5]){box(x,y-.12,3.86,1.4,.035,.035,new T.MeshStandardMaterial({color:0xffdb9a,emissive:0xffb85f,emissiveIntensity:.65}));}for(const x of [-8,0,8])rod([x-1.4,y+1.2,-1.55],[x+1.4,y+1.2,-1.55],.035);}
 // Decorative roof edging and drains finish the building silhouette.
 for(const x of [-11.65,11.65]){rod([x,27,-1.8],[x,43,-1.8],.06);for(let y=28;y<43;y+=3)box(x,y,-1.8,.23,.09,.2,metal);}
 const mist=[];for(let i=0;i<4;i++){const m=new T.Sprite(new T.SpriteMaterial({map:glowMap,color:0x999dc6,transparent:true,opacity:.055,depthWrite:false,fog:false}));m.position.set(-35+i*23,33+i*4,-27);m.scale.set(28,3+i,1);group.add(m);mist.push(m);}
 return {update(t,cameraY=0){backdrop.position.y=28+Math.max(0,cameraY)*.35;mist.forEach((m,i)=>m.position.x=-35+i*23+Math.sin(t*.025+i)*3);},group};
}
