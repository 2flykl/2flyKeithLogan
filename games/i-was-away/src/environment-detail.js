import * as THREE from '../vendor/three.module.js';
// Small local details; the photographed panorama remains the source of light/geography.
export function addOverlookDetail(scene,center,compact){
 const random=n=>{const x=Math.sin(n*127.1+91.7)*43758.5453;return x-Math.floor(x);};
 const dummy=new THREE.Object3D(),color=new THREE.Color();
 const count=compact?320:720;
 const blade=new THREE.BufferGeometry();blade.setAttribute('position',new THREE.Float32BufferAttribute([-.003,0,0,.003,0,0,.001,.09,0],3));blade.computeVertexNormals();
 const material=new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide});
 let shader;
 material.onBeforeCompile=s=>{shader=s;s.uniforms.breeze={value:0};s.vertexShader='uniform float breeze;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ntransformed.x += sin(breeze*1.1 + instanceMatrix[3].x*2.7 + instanceMatrix[3].z)*position.y*.15;');};
 const grass=new THREE.InstancedMesh(blade,material,count);
 for(let i=0;i<count;i++){
  const angle=random(i*9+1)*Math.PI*2,r=2.7+random(i*9+2)*4.6;
  const x=Math.cos(angle)*r,z=-1.4-Math.abs(Math.sin(angle))*r*.65;
  dummy.position.set(center.x+x,-.035,center.z+z);dummy.rotation.set(0,random(i*9+3)*Math.PI,0);dummy.scale.setScalar(.7+random(i*9+4)*1.5);dummy.updateMatrix();grass.setMatrixAt(i,dummy.matrix);
  color.setHSL(.13+random(i*9+5)*.06,.22,.36+random(i*9+6)*.15);grass.setColorAt(i,color);
 }
 grass.frustumCulled=false;scene.add(grass);
 const rocks=new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1,1),new THREE.MeshStandardMaterial({color:0x918779,roughness:1}),compact?60:130);
 for(let i=0;i<rocks.count;i++){
  const angle=random(i*11+101)*Math.PI*2,r=3.2+random(i*11+102)*3.4;
  dummy.position.set(center.x+Math.cos(angle)*r,-.018,center.z-1.5-Math.abs(Math.sin(angle))*r*.65);dummy.rotation.set(random(i+400),random(i+600)*6,random(i+800));const s=.018+random(i+1000)*.045;dummy.scale.set(s*1.6,s*.6,s);dummy.updateMatrix();rocks.setMatrixAt(i,dummy.matrix);color.setHSL(.10,.12,.24+random(i+1200)*.15);rocks.setColorAt(i,color);
 }scene.add(rocks);
 return {update(time,reduced){if(shader)shader.uniforms.breeze.value=reduced?0:time;},drawCalls:2};
}

