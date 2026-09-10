import * as THREE from 'three';
import { GALAXY_THEMES } from '../types.js';
import { createDecoratedChild } from './decorated-object.js';

const loader = new THREE.TextureLoader();
const textureCache = new Map();
function loadTex(path, srgb=false){
  if(textureCache.has(path)) return textureCache.get(path);
  const t=loader.load(path);
  if(srgb) t.colorSpace=THREE.SRGBColorSpace;
  t.anisotropy=8; t.generateMipmaps=true;
  t.wrapS=t.wrapT=THREE.RepeatWrapping;
  textureCache.set(path,t);
  return t;
}

export class FlagshipSystemBase {
  constructor(objectData,labelContainer,config){
    this.objectData=objectData; this.labelContainer=labelContainer; this.config=config;
    this.group=new THREE.Group(); this.planetRoot=new THREE.Group(); this.children=[]; this.clickTargets=[]; this.time=0; this.orbitRings=[]; this.childOrbitGuides=[];
    const [gx,gy,gz]=GALAXY_THEMES['G2025']?.worldOffset ?? [0,0,0];
    this.group.position.set(gx+objectData.position.x,gy+objectData.position.y,gz+objectData.position.z);
    this.group.add(this.planetRoot);
    this._buildPlanet(); this._buildAtmosphere(); this._buildOrbitRings(); this._buildChildren();
  }
  _buildPlanet(){
    const c=this.config, r=c.radius;
    const geo=new THREE.SphereGeometry(r,96,72);
    const map=loadTex(c.albedo,true), emissiveMap=loadTex(c.emissive,true), roughnessMap=loadTex(c.roughness,false), normalMap=loadTex(c.normal,false);
    normalMap.colorSpace=THREE.NoColorSpace; roughnessMap.colorSpace=THREE.NoColorSpace;
    const mat=new THREE.MeshStandardMaterial({
      map, emissiveMap, roughnessMap, normalMap,
      roughness:c.roughnessValue??0.7, metalness:c.metalness??0.2,
      emissive:new THREE.Color(c.emissiveColor), emissiveIntensity:c.emissiveIntensity??1.25,
      normalScale:new THREE.Vector2(c.normalStrength??0.65,c.normalStrength??0.65)
    });
    this.planetMesh=new THREE.Mesh(geo,mat);
    this.planetMesh.userData.objectId=this.objectData.id;
    this.planetMesh.rotation.z=c.axialTilt??0.18;
    this.planetRoot.add(this.planetMesh); this.clickTargets.push(this.planetMesh);

    const innerLight=new THREE.PointLight(c.lightColor,(c.lightIntensity??2.0)*0.58,c.lightDistance??9000,2);
    innerLight.position.set(r*0.5,r*0.35,r*0.7); this.planetRoot.add(innerLight);
    const rimLight=new THREE.PointLight(c.rimColor??c.lightColor,(c.rimIntensity??1.2)*0.72,c.lightDistance??9000,2);
    rimLight.position.set(-r*0.8,r*0.4,-r*0.7); this.planetRoot.add(rimLight);
  }
  _buildAtmosphere(){
    const c=this.config,r=c.radius;
    const geo=new THREE.SphereGeometry(r*1.045,72,56);
    const mat=new THREE.ShaderMaterial({
      uniforms:{color:{value:new THREE.Color(c.atmosphereColor??c.lightColor)},power:{value:c.atmospherePower??3.0},opacity:{value:c.atmosphereOpacity??0.38}},
      vertexShader:`varying vec3 vN; varying vec3 vW; void main(){vN=normalize(mat3(modelMatrix)*normal); vec4 w=modelMatrix*vec4(position,1.0); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w;}`,
      fragmentShader:`uniform vec3 color; uniform float power; uniform float opacity; varying vec3 vN; varying vec3 vW; void main(){vec3 V=normalize(cameraPosition-vW); float rim=pow(1.0-max(dot(normalize(vN),V),0.0),power); gl_FragColor=vec4(color,rim*opacity);}`,
      transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, side:THREE.FrontSide
    });
    this.atmosphereMesh=new THREE.Mesh(geo,mat); this.planetRoot.add(this.atmosphereMesh);
  }
  _buildOrbitRings(){
    const c=this.config;
    const grooveCount=c.systemGrooveCount??2;
    for(let i=0;i<grooveCount;i++){
      const radius=c.radius*(1.88+i*0.38);
      const pts=[]; const seg=180; const yScale=.68+i*.045;
      for(let j=0;j<=seg;j++){const a=j/seg*Math.PI*2;pts.push(new THREE.Vector3(Math.cos(a)*radius,Math.sin(a*1.8+i*.7)*26,Math.sin(a)*radius*yScale));}
      const geo=new THREE.BufferGeometry().setFromPoints(pts);
      const mat=new THREE.LineBasicMaterial({color:i===0?0xffffff:c.orbitColor,transparent:true,opacity:i===0?0.12:0.09,depthWrite:false,blending:THREE.AdditiveBlending});
      const line=new THREE.LineLoop(geo,mat); line.rotation.x=(i===0?0.08:-0.05); line.rotation.z=i*0.14; this.group.add(line); this.orbitRings.push(line);
    }
  }
  _buildChildren(){
    const children=this.objectData.children??[];
    const overrides=this.config.childLabelOverrides??{};
    const primaryIds=new Set(this.config.primaryMoonIds??[]);
    const primaryChildren=[]; const minorChildren=[];
    children.forEach((child,i)=>{
      const isPrimary=primaryIds.size?primaryIds.has(child.id):i===0;
      (isPrimary?primaryChildren:minorChildren).push({...child});
    });
    const ordered=[...primaryChildren,...minorChildren];
    const baseMoonRadius=this.config.moonOrbitRadius??(this.config.radius*2.25);
    const moonStep=this.config.moonOrbitStep??(this.config.radius*0.72);
    const minorBase=this.config.minorOrbitRadius??(this.config.radius*1.62);
    const minorStep=this.config.minorOrbitStep??Math.max(220,this.config.radius*0.26);
    ordered.forEach((child,index)=>{
      const originalIndex=children.findIndex(c=>c.id===child.id);
      const isPrimary=primaryIds.size?primaryIds.has(child.id):index===0;
      const moonIndex=isPrimary ? primaryChildren.findIndex(c=>c.id===child.id) : -1;
      const minorIndex=!isPrimary ? minorChildren.findIndex(c=>c.id===child.id) : -1;
      const r=isPrimary ? baseMoonRadius + Math.max(0,moonIndex)*moonStep : minorBase + Math.max(0,minorIndex)*minorStep;
      const speed=(this.config.orbitSpeeds?.[originalIndex]??Math.max(0.055,0.24-originalIndex*0.028))*(isPrimary?0.78:0.9);
      const pivot=new THREE.Group();
      pivot.rotation.x=(isPrimary?0.13:0.045)+(originalIndex%2===0?1:-1)*(isPrimary?0.03:0.018);
      pivot.rotation.z=(originalIndex%3-1)*(isPrimary?0.055:0.03);
      this.group.add(pivot);
      const size=(isPrimary?(this.config.childSize??112)*1.5:(this.config.childSize??112)*0.72);
      const dec=createDecoratedChild(child,size,this.config.accentHex);
      dec.group.position.set(r,(isPrimary?64:22)+(originalIndex%2===0?1:-1)*(isPrimary?34:18),0);
      pivot.rotation.y=((index+0.3)/Math.max(1,ordered.length))*Math.PI*2;
      pivot.add(dec.group);
      const ct=dec.clickTarget; ct.userData.childId=child.id; ct.userData.contentStatus=child.contentStatus; ct.userData.mediaUrl=child.mediaUrl; ct.userData.posterUrl=child.posterUrl; this.clickTargets.push(ct);

      let orbitGuide=null;
      if(isPrimary){
        const ringGeo=new THREE.RingGeometry(r-8,r+8,120);
        const ringMat=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.12,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending});
        orbitGuide=new THREE.Mesh(ringGeo,ringMat); orbitGuide.rotation.x=-Math.PI/2+0.12; orbitGuide.rotation.z=(moonIndex%2?0.16:-0.08); this.group.add(orbitGuide);
        this.childOrbitGuides.push(orbitGuide);
      }

      const title=overrides[child.id]??child.title;
      const el=document.createElement('div'); el.className='universe-label flagship-child-label';
      el.style.cssText=`position:absolute;top:0;left:0;pointer-events:none;font-family:'Space Grotesk',sans-serif;font-size:clamp(${isPrimary?9:8}px,.82vw,${isPrimary?12:10}px);letter-spacing:.11em;text-transform:uppercase;color:${this.config.labelColor};white-space:nowrap;transform:translate(-50%,-140%);user-select:none;text-align:center;opacity:0;transition:opacity .18s ease;text-shadow:0 0 12px rgba(0,0,0,.9);`;
      el.innerHTML=`<span>${isPrimary?'◉ MOON':symbol(child.mediaKind)}</span><br/><span>${title}</span>`; this.labelContainer.appendChild(el);
      this.children.push({id:child.id,title,mediaKind:child.mediaKind??'archive',contentStatus:child.contentStatus??'live',mediaUrl:child.mediaUrl,posterUrl:child.posterUrl,mesh:dec.group,pivot,orbitGuide,orbitRadius:r,orbitSpeed:speed,labelEl:el,isPrimaryMoon:isPrimary,orbitYOffset:dec.group.position.y});
    });
  }
  update(dt,camera,renderer){
    this.time+=dt;
    const galaxyCenter=new THREE.Vector3(...(GALAXY_THEMES['G2025']?.worldOffset ?? [0,0,0]));
    const localOrbitFactor=camera.position.distanceTo(galaxyCenter)<12500?0.92:1;
    this.planetMesh.rotation.y+=dt*(this.config.rotationSpeed??0.045);
    this.atmosphereMesh.rotation.y-=dt*0.012;
    this.orbitRings.forEach((ring,i)=>{ring.rotation.y+=dt*(0.0018+(i%3)*0.0008)*localOrbitFactor*(i%2?1:-1); ring.material.opacity=0.07+0.04*(0.5+0.5*Math.sin(this.time*0.28+i));});
    this.children.forEach((c,i)=>{c.pivot.rotation.y+=dt*c.orbitSpeed*0.72*localOrbitFactor; c.mesh.rotation.y+=dt*(0.18+i*0.012); c.mesh.rotation.x+=dt*(c.isPrimaryMoon?0.03:0.06); if(c.orbitGuide){c.orbitGuide.rotation.z+=dt*0.035*(i%2?1:-1)*localOrbitFactor; c.orbitGuide.material.opacity=0.08+0.04*(0.5+0.5*Math.sin(this.time*0.65+i));}});
    this._updateLabels(camera,renderer);
  }
  _updateLabels(camera,renderer){
    const rect=renderer.domElement.getBoundingClientRect(); const cp=new THREE.Vector3(); camera.getWorldPosition(cp);
    this.children.forEach(c=>{const wp=new THREE.Vector3();c.mesh.getWorldPosition(wp);const d=cp.distanceTo(wp);const near=c.isPrimaryMoon?900:700;const far=c.isPrimaryMoon?6200:4200;const opacity=1-Math.min(1,Math.max(0,(d-near)/(far-near)));const ndc=wp.clone().project(camera); if(ndc.z>1||opacity<.025){c.labelEl.style.opacity='0';return;} c.labelEl.style.opacity=String(opacity);c.labelEl.style.left=`${(ndc.x*.5+.5)*rect.width}px`;c.labelEl.style.top=`${(-ndc.y*.5+.5)*rect.height}px`;});
  }
  setFocus(active){
    this._focused=active;
    this.children.forEach(c=>c.labelEl.style.filter=active?'brightness(1.15)':'');
  }
  getChildData(id){return this.children.find(c=>c.id===id);}
  getPlanetWorldPos(){const wp=new THREE.Vector3();this.planetMesh.getWorldPosition(wp);return wp;}
  getFocusRadius(){return this.config.focusRadius??1500;}
  getBoundaryRadius(){return (this.config.radius??500)*1.32;}
  getSoftBoundaryRadius(){return (this.config.radius??500)*1.85;}
  getCollisionDescriptor(){return {id:this.objectData.id,label:this.objectData.title||'CONTENT PLANET',getCenter:()=>this.getPlanetWorldPos(),hardRadius:this.getBoundaryRadius(),softRadius:this.getSoftBoundaryRadius()};}
  dispose(){this.children.forEach(c=>{c.labelEl.remove();c.mesh.traverse(o=>{if(o.isMesh){o.geometry?.dispose();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material?.dispose();}else if(o.isSprite)o.material?.dispose();});c.orbitGuide?.geometry?.dispose();c.orbitGuide?.material?.dispose();});this.orbitRings.forEach(r=>{r.geometry.dispose();r.material.dispose();});this.planetMesh.geometry.dispose();this.planetMesh.material.dispose();this.atmosphereMesh.geometry.dispose();this.atmosphereMesh.material.dispose();}
}
function symbol(kind){return kind==='playable'?'◇ PLAYABLE':kind==='audio'?'♪ AUDIO':kind==='video'?'▶ VIDEO':'◐ ARCHIVE';}
