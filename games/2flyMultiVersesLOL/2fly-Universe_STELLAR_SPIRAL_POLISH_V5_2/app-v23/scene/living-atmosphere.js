import * as THREE from 'three';
import { GALAXY_THEMES } from '../types.js';
// Deliberately small GPU sky layer. No image planes, external textures, or post stack.
export class LivingAtmosphere {
 constructor(galaxies){
  this.group=new THREE.Group();
  const sky=new THREE.Mesh(new THREE.SphereGeometry(780000,32,20),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{time:{value:0}},vertexShader:`varying vec3 direction;void main(){direction=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,fragmentShader:`precision highp float;varying vec3 direction;uniform float time;
  float hash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1)),f.x),f.y),f.z);}
  void main(){vec3 p=direction*3.5;float n=noise(p)+.5*noise(p*2.1)+.22*noise(p*4.3);float band=pow(max(0.,1.-abs(direction.y+direction.x*.28)*2.2),4.);float gas=pow(max(0.,n-.46),2.)*band;vec3 col=mix(vec3(.005,.028,.034),vec3(.039,.014,.061),noise(p+7.));gl_FragColor=vec4(vec3(.0007,.0015,.003)+col*gas,1.);}`}));
  sky.renderOrder=-100;this.group.add(sky);
  this.paths=[];
  const sorted=[...galaxies].sort((a,b)=>a.startYear-b.startYear);
  for(let i=0;i<sorted.length-1;i++){
   const a=new THREE.Vector3(...GALAXY_THEMES[sorted[i].id].worldOffset),b=new THREE.Vector3(...GALAXY_THEMES[sorted[i+1].id].worldOffset);
   const mid=a.clone().lerp(b,.5);mid.z-=7000;mid.y+=4000;
   const curve=new THREE.QuadraticBezierCurve3(a,mid,b);
   const geo=new THREE.BufferGeometry().setFromPoints(curve.getPoints(90));
   const mat=new THREE.LineDashedMaterial({color:GALAXY_THEMES[sorted[i].id].accentColor,transparent:true,opacity:.14,dashSize:180,gapSize:360,depthWrite:false});
   const line=new THREE.Line(geo,mat);line.computeLineDistances();this.group.add(line);
   const spark=new THREE.Mesh(new THREE.SphereGeometry(50,8,6),new THREE.MeshBasicMaterial({color:0xb1f7db,transparent:true,opacity:.55}));this.group.add(spark);this.paths.push({curve,spark,line,phase:i*.14});
  }
 }
 update(time,camera){const distance=camera.position.length();const alpha=THREE.MathUtils.smoothstep(distance,19000,60000);for(const p of this.paths){p.line.material.opacity=.13*alpha;p.spark.visible=alpha>.1;p.spark.position.copy(p.curve.getPoint((time*.012+p.phase)%1));}}
}
