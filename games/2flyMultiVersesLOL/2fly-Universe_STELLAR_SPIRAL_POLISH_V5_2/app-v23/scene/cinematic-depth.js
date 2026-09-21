import * as THREE from 'three';
import {GALAXY_THEMES} from '../types.js';

// One core position drives the surface terminator, atmosphere and visible light.
// Analytic lighting avoids seven huge shadow maps at astronomical scene scales.
function lightMaterial(material,core,tint){
 if(!material?.isMeshStandardMaterial||material.userData.coreLit)return;
 material.userData.coreLit=true;
 material.onBeforeCompile=shader=>{
  shader.uniforms.cineCore={value:core};shader.uniforms.cineTint={value:tint};
  shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 cineWorld;');
  shader.vertexShader=shader.vertexShader.replace('#include <worldpos_vertex>','#include <worldpos_vertex>\ncineWorld=(modelMatrix*vec4(transformed,1.0)).xyz;');
  shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nuniform vec3 cineCore;uniform vec3 cineTint;varying vec3 cineWorld;');
  shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`
   vec3 coreDirection=normalize(cineCore-cineWorld);
   vec3 worldNormal=inverseTransformDirection(normal,viewMatrix);
   float sun=max(0.0,dot(worldNormal,coreDirection));
   float rim=pow(1.0-max(0.0,dot(worldNormal,normalize(cameraPosition-cineWorld))),4.0);
   float illuminatedRim=smoothstep(-.28,.45,dot(worldNormal,coreDirection));
   outgoingLight=diffuseColor.rgb*(.045+1.85*pow(sun,.9))*cineTint
       +totalEmissiveRadiance*.035+rim*illuminatedRim*cineTint*.28;
   float farHaze=smoothstep(6000.0,32000.0,length(cameraPosition-cineWorld));
   float luminance=dot(outgoingLight,vec3(.2126,.7152,.0722));
   outgoingLight=mix(outgoingLight,vec3(luminance)*vec3(.78,.88,1.0),farHaze*.42)*(1.0-farHaze*.22);
   #include <opaque_fragment>`);
 };
 material.customProgramCacheKey=()=> '2fly-core-terminator-v1';material.needsUpdate=true;
}
function atmosphere(radius,core,color){
 return new THREE.Mesh(new THREE.SphereGeometry(radius*1.025,64,40),new THREE.ShaderMaterial({
  uniforms:{core:{value:core},tint:{value:color}},transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
  vertexShader:'varying vec3 w;varying vec3 n;void main(){w=(modelMatrix*vec4(position,1.0)).xyz;n=normalize(mat3(modelMatrix)*normal);gl_Position=projectionMatrix*viewMatrix*vec4(w,1.0);}',
  fragmentShader:'uniform vec3 core;uniform vec3 tint;varying vec3 w;varying vec3 n;void main(){vec3 N=normalize(n);float limb=pow(1.0-max(0.0,dot(N,normalize(cameraPosition-w))),4.5);float day=smoothstep(-.25,.6,dot(N,normalize(core-w)));gl_FragColor=vec4(tint,limb*(.055+.6*day));}'
 }));
}
function glowTexture(){
 const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');
 const g=x.createRadialGradient(128,128,0,128,128,128);
 g.addColorStop(0,'rgba(255,252,237,1)');g.addColorStop(.045,'rgba(255,242,209,.95)');g.addColorStop(.12,'rgba(255,228,181,.5)');g.addColorStop(.36,'rgba(255,220,179,.13)');g.addColorStop(1,'rgba(255,220,180,0)');
 x.fillStyle=g;x.fillRect(0,0,256,256);return new THREE.CanvasTexture(c);
}
export class CinematicDepth{
 constructor(scene,galaxies,flagships,frontier,eras){
  this.colliders=[];this.guides=[];this.glows=[];this.galaxies=galaxies;
  const apply=(group,id)=>{const core=new THREE.Vector3(...GALAXY_THEMES[id].worldOffset),tint=new THREE.Color(0xffedcf).lerp(new THREE.Color(GALAXY_THEMES[id].starTint),.18);
   group.traverse(o=>{if(o.isMesh)for(const m of Array.isArray(o.material)?o.material:[o.material])lightMaterial(m,core,tint);});return{core,tint};};
  for(const sys of flagships){const {core}=apply(sys.group,'G2025');sys.atmosphereMesh.visible=false;sys.planetRoot.add(atmosphere(sys.config.radius,core,new THREE.Color(sys.config.atmosphereColor)));this.guides.push(...sys.orbitRings,...sys.childOrbitGuides);}
  apply(frontier.group,'G2025');this.guides.push(...frontier.orbitGuides);
  for(const p of frontier.planetMeshes){p.group.add(atmosphere(p.size,new THREE.Vector3(...GALAXY_THEMES.G2025.worldOffset),new THREE.Color(0x8ccee5)));this.colliders.push({id:p.id,label:p.id,getCenter:()=>p.group.getWorldPosition(new THREE.Vector3()),hardRadius:p.size*1.15,softRadius:p.size*1.45});}
  for(const era of eras){const {core,tint}=apply(era.group,era.galaxyId);for(const o of era.orbiters){const radius=o.body.geometry.parameters.radius;o.body.add(atmosphere(radius,core,tint));this.colliders.push({id:o.body.userData.title,label:o.body.userData.title,getCenter:()=>o.body.getWorldPosition(new THREE.Vector3()),hardRadius:radius*1.15,softRadius:radius*1.4});}}
  const texture=glowTexture();
  for(const galaxy of galaxies){const core=new THREE.Vector3(...GALAXY_THEMES[galaxy.getId()].worldOffset);const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,color:0xffefda,transparent:true,depthWrite:false,depthTest:true,blending:THREE.AdditiveBlending}));glow.position.copy(core);glow.scale.set(4200,4200,1);scene.add(glow);this.glows.push({glow,id:galaxy.getId()});}
 }
 update(camera,active){
  document.body.classList.toggle('local-cosmos',!!active);
  for(const g of this.galaxies){
   if(active){for(const m of g.gasMaterials)m.uniforms.globalAlpha.value*=.24;
    for(const line of g.orbitRings)line.material.opacity*=.18;
    for(const e of g.abstractLines)e.line.material.opacity*=.12;
    for(const {el} of g.labelEls)el.style.opacity='0';
   }
  }
  // Rings are orientation aids, not competing luminous objects in the foreground.
  for(const g of this.guides)g.material.opacity=Math.min(g.material.opacity,.026);
  for(const {glow,id} of this.glows)glow.material.opacity=active&&active!==id?.22:.82;
 }
}
