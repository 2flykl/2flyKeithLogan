import{W as tt,S as ot,A as st,V as M,a as je,b as nt,P as it,M as ze,G as oe,B as ue,C as A,c as B,d as Se,e as ee,f as he,g as at,h as rt,i as X,D as Me,j as V,k as Ye,R as He,O as lt,l as te,I as _e,m as ke,n as We,o as ct,T as dt,p as pt,q as mt,r as ut,F as ht,s as ft,t as gt,u as yt}from"./three-DrBb4uqg.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const i of s)if(i.type==="childList")for(const a of i.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&t(a)}).observe(document,{childList:!0,subtree:!0});function o(s){const i={};return s.integrity&&(i.integrity=s.integrity),s.referrerPolicy&&(i.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?i.credentials="include":s.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function t(s){if(s.ep)return;s.ep=!0;const i=o(s);fetch(s.href,i)}})();let I=null,Ee=!1,fe=null,ge=0,ye=!1;function bt(n){const e=Math.min(window.devicePixelRatio,2);return I=new tt({canvas:n,antialias:e<2,alpha:!1,powerPreference:"high-performance",stencil:!1,depth:!0}),I.setPixelRatio(e),I.setSize(n.clientWidth,n.clientHeight,!1),I.outputColorSpace=ot,I.toneMapping=st,I.toneMappingExposure=1.1,I.shadowMap.enabled=!1,new ResizeObserver(t=>{const s=t[0];if(!s||!I)return;const{width:i,height:a}=s.contentRect,r=Math.min(window.devicePixelRatio,2);I.setSize(i,a,!1),I.setPixelRatio(r),window.dispatchEvent(new CustomEvent("universe-resize",{detail:{width:i,height:a}}))}).observe(n),document.addEventListener("visibilitychange",()=>{ye=document.hidden,!ye&&Ee&&Ce()}),I}function xt(n){fe=n,Ee=!0,ge=performance.now(),Ce()}function Ce(){if(!Ee||ye)return;requestAnimationFrame(Ce);const n=performance.now(),e=Math.min((n-ge)/1e3,.05);ge=n,fe&&fe(e)}const Te=window.matchMedia("(prefers-reduced-motion: reduce)").matches;class vt{camera;target=new M;fly=null;isDragging=!1;prevMouse=new je;spherical=new nt;tmpVec=new M;velTheta=0;velPhi=0;velRadius=0;DAMPING=.08;constructor(e){this.camera=new it(55,window.innerWidth/window.innerHeight,10,2e6),this.camera.position.set(55e3,12e3,35e3),this.target.set(55e3,0,0),this.camera.lookAt(this.target),this.tmpVec.subVectors(this.camera.position,this.target),this.spherical.setFromVector3(this.tmpVec),this._bindEvents(e),window.addEventListener("universe-resize",o=>{const t=o;this.camera.aspect=t.detail.width/t.detail.height,this.camera.updateProjectionMatrix()})}_bindEvents(e){e.addEventListener("mousedown",s=>this._onMouseDown(s)),e.addEventListener("mousemove",s=>this._onMouseMove(s)),window.addEventListener("mouseup",()=>{this.isDragging=!1}),e.addEventListener("wheel",s=>this._onWheel(s),{passive:!1}),e.addEventListener("dblclick",s=>this._onDblClick(s));let o=0,t=[];e.addEventListener("touchstart",s=>{s.preventDefault(),t=Array.from(s.touches),t.length===1?(this.isDragging=!0,this.prevMouse.set(t[0].clientX,t[0].clientY)):t.length===2&&(this.isDragging=!1,o=Le(t))},{passive:!1}),e.addEventListener("touchmove",s=>{if(s.preventDefault(),t=Array.from(s.touches),t.length===1&&this.isDragging){const i=t[0].clientX-this.prevMouse.x,a=t[0].clientY-this.prevMouse.y;this._orbit(i*.006,a*.005),this.prevMouse.set(t[0].clientX,t[0].clientY)}else if(t.length===2){const i=Le(t),a=o-i;this._zoom(a*.01),o=i}},{passive:!1}),e.addEventListener("touchend",s=>{s.touches.length===0&&(this.isDragging=!1)}),window.addEventListener("keydown",s=>{s.key==="Escape"&&window.dispatchEvent(new CustomEvent("universe-esc"))})}_onMouseDown(e){this.isDragging=!0,this.prevMouse.set(e.clientX,e.clientY)}_onMouseMove(e){if(!this.isDragging)return;const o=e.clientX-this.prevMouse.x,t=e.clientY-this.prevMouse.y;this._orbit(o*.004,t*.004),this.prevMouse.set(e.clientX,e.clientY)}_orbit(e,o){this.velTheta-=e,this.velPhi-=o}_onWheel(e){e.preventDefault();const o=e.deltaY*.001;this._zoom(o)}_zoom(e){this.velRadius+=e*this.spherical.radius*.3}_onDblClick(e){this.velRadius-=this.spherical.radius*.35}update(e){if(this.fly){this._updateFly(e);return}this.spherical.theta+=this.velTheta,this.spherical.phi=ze.clamp(this.spherical.phi+this.velPhi,.05,Math.PI-.05),this.spherical.radius=ze.clamp(this.spherical.radius+this.velRadius,200,28e4),this.velTheta*=1-this.DAMPING,this.velPhi*=1-this.DAMPING,this.velRadius*=1-this.DAMPING,this.tmpVec.setFromSpherical(this.spherical).add(this.target),this.camera.position.copy(this.tmpVec),this.camera.lookAt(this.target)}_updateFly(e){if(!this.fly)return;const o=16;this.fly.elapsed+=o;const t=Te?1:Math.min(this.fly.elapsed/this.fly.duration,1),s=wt(t);if(this.camera.position.lerpVectors(this.fly.startPos,this.fly.endPos,s),this.target.lerpVectors(this.fly.startTarget,this.fly.endTarget,s),this.camera.lookAt(this.target),t>=1){const i=this.fly.onDone;this.fly=null,this.tmpVec.subVectors(this.camera.position,this.target),this.spherical.setFromVector3(this.tmpVec),this.velTheta=0,this.velPhi=0,this.velRadius=0,i?.()}}flyTo(e,o,t={}){const s=Te?200:t.duration??900;this.fly={startPos:this.camera.position.clone(),startTarget:this.target.clone(),endPos:new M(e.x,e.y,e.z),endTarget:new M(o.x,o.y,o.z),elapsed:0,duration:s,onDone:t.onDone}}snapshot(){return{position:[this.camera.position.x,this.camera.position.y,this.camera.position.z],target:[this.target.x,this.target.y,this.target.z],zoom:this.spherical.radius}}restoreSnapshot(e,o=!0){const t={x:e.position[0],y:e.position[1],z:e.position[2]},s={x:e.target[0],y:e.target[1],z:e.target[2]};o?this.flyTo(t,s,{duration:700}):(this.camera.position.set(t.x,t.y,t.z),this.target.set(s.x,s.y,s.z),this.camera.lookAt(this.target),this.tmpVec.subVectors(this.camera.position,this.target),this.spherical.setFromVector3(this.tmpVec))}getTarget(){return this.target.clone()}getRadius(){return this.spherical.radius}isBusy(){return this.fly!==null}}function wt(n){return n<.5?4*n*n*n:1-Math.pow(-2*n+2,3)/2}function Le(n){const e=n[1].clientX-n[0].clientX,o=n[1].clientY-n[0].clientY;return Math.sqrt(e*e+o*o)}const Z=6e4;class St{group;starsMesh;dustMesh;nebulaMeshes=[];constructor(){this.group=new oe,this._buildStarfield(),this._buildDust(),this._buildNebulae()}_buildStarfield(){const e=new ue,o=new Float32Array(Z*3),t=new Float32Array(Z*3),s=new Float32Array(Z),i=6e5,a=[new A(16774632),new A(15266047),new A(16769200),new A(11589887),new A(16765136)];for(let l=0;l<Z;l++){const c=l*3,d=Math.random()*Math.PI*2,f=Math.pow(Math.random(),.5)*i,p=(Math.random()-.5)*i*.3;o[c]=Math.cos(d)*f,o[c+1]=p,o[c+2]=Math.sin(d)*f;const g=a[Math.floor(Math.random()*a.length)];t[c]=g.r,t[c+1]=g.g,t[c+2]=g.b,s[l]=.5+Math.random()*2.5}e.setAttribute("position",new B(o,3)),e.setAttribute("color",new B(t,3)),e.setAttribute("size",new B(s,1));const r=new Se({uniforms:{time:{value:0}},vertexShader:`
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        void main() {
          vColor = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          float twinkle = 1.0 + 0.15 * sin(time * 2.0 + position.x * 0.001 + position.z * 0.001);
          gl_PointSize = size * twinkle * (300.0 / -mv.z);
          gl_PointSize = clamp(gl_PointSize, 0.3, 4.0);
        }
      `,fragmentShader:`
        varying vec3 vColor;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, d);
          gl_FragColor = vec4(vColor * (0.7 + alpha * 0.3), alpha);
        }
      `,transparent:!0,depthWrite:!1,vertexColors:!1,blending:ee});this.starsMesh=new he(e,r),this.starsMesh.renderOrder=-10,this.group.add(this.starsMesh)}_buildDust(){const o=new ue,t=new Float32Array(8e3*3),s=2e5;for(let a=0;a<8e3;a++){const r=a*3;t[r]=(Math.random()-.5)*s,t[r+1]=(Math.random()-.5)*s*.1,t[r+2]=(Math.random()-.5)*s}o.setAttribute("position",new B(t,3));const i=new at({color:3162208,size:80,transparent:!0,opacity:.04,depthWrite:!1,blending:ee});this.dustMesh=new he(o,i),this.dustMesh.renderOrder=-9,this.group.add(this.dustMesh)}_buildNebulae(){const e=[{x:0,z:0,color:3805192,scale:12e3},{x:22e3,z:0,color:3805216,scale:12e3},{x:44e3,z:0,color:530472,scale:12e3},{x:66e3,z:0,color:1050664,scale:12e3},{x:88e3,z:0,color:266272,scale:12e3},{x:11e4,z:0,color:267280,scale:12e3}];for(const o of e){const t=new rt(o.scale*2,o.scale*1.2),s=new X({color:o.color,transparent:!0,opacity:.18,depthWrite:!1,blending:ee,side:Me}),i=new V(t,s);i.position.set(o.x,-500,o.z),i.rotation.x=-Math.PI/2,i.renderOrder=-8,this.nebulaMeshes.push(i),this.group.add(i)}}update(e){const o=this.starsMesh.material;o.uniforms.time.value=e,this.dustMesh.position.y=Math.sin(e*.03)*200}dispose(){this.starsMesh.geometry.dispose(),this.starsMesh.material.dispose(),this.dustMesh.geometry.dispose(),this.dustMesh.material.dispose();for(const e of this.nebulaMeshes)e.geometry.dispose(),e.material.dispose()}}const k={G2000:{id:"G2000",primaryColor:12877098,accentColor:15247434,nebulaColor:8007696,dustColor:4004360,starTint:16769184,worldOffset:[0,0,0]},G2005:{id:"G2005",primaryColor:12869674,accentColor:14710848,nebulaColor:9052224,dustColor:4001808,starTint:16760960,worldOffset:[22e3,0,0]},G2010:{id:"G2010",primaryColor:1751224,accentColor:4251856,nebulaColor:671808,dustColor:530464,starTint:10551264,worldOffset:[44e3,0,0]},G2015:{id:"G2015",primaryColor:6308032,accentColor:9461992,nebulaColor:2099280,dustColor:1049640,starTint:13674751,worldOffset:[66e3,0,0]},G2020:{id:"G2020",primaryColor:2652360,accentColor:5286128,nebulaColor:532544,dustColor:266270,starTint:11065599,worldOffset:[88e3,0,0]},G2025:{id:"G2025",primaryColor:2664552,accentColor:6346896,nebulaColor:534552,dustColor:267276,starTint:10551248,worldOffset:[11e4,0,0]}},be=[[-4e3,0,-2e3],[0,0,3500],[4500,0,-1500]],Mt=180,Et=4500,Ct=400,It=4e4,At=12e4,zt=6e3,_t=18e3;class kt{constructor(e,o){this.data=e,this.group=new oe,this.labelContainer=o;const t=k[e.id];if(!t)return;const[s,i,a]=t.worldOffset;this.group.position.set(s,i,a),this._buildCore(t),this._buildRegionMarkers(t),this._buildLabel(),this._buildRegionLabels()}group;labelEls=[];labelContainer;orbitRings=[];galaxyLight;_buildCore(e){const t=new ue,s=new Float32Array(1200*3),i=new Float32Array(1200);for(let c=0;c<1200;c++){const d=Math.random()*Math.PI*2,f=Math.pow(Math.random(),1.5)*7e3,p=(Math.random()-.5)*800;s[c*3]=Math.cos(d)*f,s[c*3+1]=p,s[c*3+2]=Math.sin(d)*f,i[c]=20+Math.random()*80}t.setAttribute("position",new B(s,3)),t.setAttribute("size",new B(i,1));const a=new A(e.primaryColor),r=new Se({uniforms:{color:{value:a},time:{value:0}},vertexShader:`
        attribute float size;
        uniform float time;
        varying float vAlpha;
        void main() {
          vAlpha = 0.3 + 0.2 * sin(time * 0.5 + position.x * 0.002);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = size * (500.0 / -mv.z);
          gl_PointSize = clamp(gl_PointSize, 0.5, 12.0);
        }
      `,fragmentShader:`
        uniform vec3 color;
        varying float vAlpha;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.0, d) * vAlpha;
          gl_FragColor = vec4(color, a);
        }
      `,transparent:!0,depthWrite:!1,blending:ee}),l=new he(t,r);this.group.add(l),this.galaxyLight=new Ye(e.primaryColor,.6,2e4),this.galaxyLight.position.set(0,0,0),this.group.add(this.galaxyLight)}_buildRegionMarkers(e){for(const o of be){const t=new He(600,650,64),s=new X({color:e.accentColor,transparent:!0,opacity:.12,side:Me,depthWrite:!1}),i=new V(t,s);i.position.set(o[0],o[1],o[2]),i.rotation.x=-Math.PI/2,this.orbitRings.push(i),this.group.add(i)}}_buildLabel(){const e=document.createElement("div");e.className="universe-label galaxy-label",e.dataset.galaxyId=this.data.id,e.innerHTML=`<span class="label-era">${this.data.title}</span>`,e.style.cssText=`
      position:absolute; top:0; left:0;
      pointer-events:none;
      font-family:'Space Mono',monospace;
      font-size:clamp(9px,1.2vw,13px);
      letter-spacing:0.18em;
      text-transform:uppercase;
      color:rgba(200,220,255,0);
      white-space:nowrap;
      transform:translate(-50%,-50%);
      transition:color 0.3s;
      user-select:none;
    `,this.labelContainer.appendChild(e);const o=new M(0,1500,0);this.labelEls.push({el:e,pos:o,kind:"galaxy"})}_buildRegionLabels(){const e=this.data.regions;for(let o=0;o<e.length;o++){const t=e[o],s=be[o]??[0,0,0],i=document.createElement("div");i.className="universe-label region-label",i.dataset.regionId=t.id,i.innerHTML=`<span>${t.title}</span>`,i.style.cssText=`
        position:absolute; top:0; left:0;
        pointer-events:none;
        font-family:'Space Grotesk',sans-serif;
        font-size:clamp(8px,0.9vw,11px);
        letter-spacing:0.12em;
        text-transform:uppercase;
        color:rgba(180,200,240,0);
        white-space:nowrap;
        transform:translate(-50%,-50%);
        transition:color 0.3s;
        user-select:none;
      `,this.labelContainer.appendChild(i);const a=new M(s[0],s[1]+700,s[2]);this.labelEls.push({el:i,pos:a,kind:"region"})}}updateLabels(e,o,t){const{width:s,height:i}=o.domElement.getBoundingClientRect();for(const{el:a,pos:r,kind:l}of this.labelEls){const c=new M().copy(r);this.group.localToWorld(c);const d=t.distanceTo(c);let f=0;l==="galaxy"?f=Re(d,At,It):f=Re(d,_t,zt);const p=c.clone().project(e),g=(p.x*.5+.5)*s,x=(-(p.y*.5)+.5)*i;p.z>1||f<.02?(a.style.opacity="0",a.style.pointerEvents="none"):(a.style.opacity=String(f),a.style.left=`${g}px`,a.style.top=`${x}px`)}}update(e){for(const o of this.orbitRings){const t=o.material;t.opacity=.08+.06*Math.sin(e*.4)}}dispose(){for(const{el:e}of this.labelEls)e.remove()}}function Re(n,e,o){return n>=e?0:n<=o?1:1-(n-o)/(e-o)}const Tt=3e3,Lt=6e4;class Rt{group;instancedFar;instancedMid;nearMeshes=new Map;stars=[];dummy=new lt;labelContainer;labelEls=new Map;myStarId=null;constructor(e){this.group=new oe,this.labelContainer=e,this._buildFarInstanced(),this._buildMidInstanced()}_buildFarInstanced(){const e=new te(30,4,4),o=new X({color:16777215,transparent:!0,opacity:.7});this.instancedFar=new _e(e,o,25e3),this.instancedFar.instanceMatrix.setUsage(ke),this.instancedFar.count=0,this.group.add(this.instancedFar)}_buildMidInstanced(){const e=new te(60,6,6),o=new X({color:16777215});this.instancedMid=new _e(e,o,25e3),this.instancedMid.instanceMatrix.setUsage(ke),this.instancedMid.count=0,this.instancedMid.visible=!1,this.group.add(this.instancedMid)}setStars(e,o=null){this.stars=e,this.myStarId=o,this._rebuildFar()}_rebuildFar(){const e=new A;let o=0;for(const t of this.stars){if(o>=25e3)break;this.dummy.position.set(t.x,t.y,t.z),this.dummy.scale.setScalar(t.id===this.myStarId?1.8:1),this.dummy.updateMatrix(),this.instancedFar.setMatrixAt(o,this.dummy.matrix);const s=k[t.galaxyId],i=s?new A(s.starTint):e.set(16777215);t.id===this.myStarId&&i.setHex(16766720),this.instancedFar.setColorAt(o,i),o++}this.instancedFar.count=o,this.instancedFar.instanceMatrix.needsUpdate=!0,this.instancedFar.instanceColor&&(this.instancedFar.instanceColor.needsUpdate=!0)}update(e,o,t){const{width:s,height:i}=t.domElement.getBoundingClientRect(),a=e.length();this.instancedFar.visible=!0,this.instancedMid.visible=!1;for(const r of this.stars){const l=new M(r.x,r.y,r.z),c=e.distanceTo(l);c<Tt?(this._ensureNearMesh(r),this._updateLabel(r,l,o,s,i,c)):(this._removeNearMesh(r.id),this._updateLabel(r,l,o,s,i,c))}a<3e4||e.distanceTo(this.group.position)<Lt}_ensureNearMesh(e){if(this.nearMeshes.has(e.id))return;const o=new te(80,12,12),t=k[e.galaxyId],s=t?t.starTint:16777215,i=new We({color:s,emissive:s,emissiveIntensity:.6,roughness:.1,metalness:.4}),a=new V(o,i);a.position.set(e.x,e.y,e.z),a.userData.starId=e.id,this.group.add(a),this.nearMeshes.set(e.id,a)}_removeNearMesh(e){const o=this.nearMeshes.get(e);o&&(this.group.remove(o),o.material.dispose(),o.geometry.dispose(),this.nearMeshes.delete(e))}_updateLabel(e,o,t,s,i,a){const c=1-Math.min(1,Math.max(0,(a-1200)/2800));if(c<.02){const x=this.labelEls.get(e.id);x&&(x.style.opacity="0");return}let d=this.labelEls.get(e.id);d||(d=document.createElement("div"),d.className="universe-label star-label",d.style.cssText=`
        position:absolute;top:0;left:0;
        pointer-events:none;
        font-family:'Space Grotesk',sans-serif;
        font-size:clamp(7px,0.75vw,10px);
        letter-spacing:0.1em;
        color:#e0eeff;
        white-space:nowrap;
        transform:translate(-50%,-100%);
        padding-bottom:4px;
        user-select:none;
      `,d.textContent=e.displayName,this.labelContainer.appendChild(d),this.labelEls.set(e.id,d));const f=o.clone().project(t),p=(f.x*.5+.5)*s,g=(-(f.y*.5)+.5)*i;f.z>1?d.style.opacity="0":(d.style.opacity=String(c),d.style.left=`${p}px`,d.style.top=`${g}px`)}getClickTarget(e){const o=Array.from(this.nearMeshes.values()),t=e.intersectObjects(o);if(t.length>0){const i=t[0].object.userData.starId;return i?{starId:i}:null}const s=e.intersectObject(this.instancedFar);if(s.length>0&&s[0].instanceId!==void 0){const i=this.stars[s[0].instanceId];return i?{starId:i.id}:null}return null}addStar(e){this.stars.push(e),this._rebuildFar()}dispose(){for(const[,e]of this.labelEls)e.remove();this.instancedFar.dispose(),this.instancedMid.dispose();for(const[,e]of this.nearMeshes)e.geometry.dispose(),e.material.dispose()}}const $e=[800,1300,1900,2600],$t=[.35,.22,.14,.09];class Ot{group;planetMesh;children=[];labelContainer;time=0;objectData;onObjectClick=null;clickTargets=[];constructor(e,o){this.objectData=e,this.labelContainer=o,this.group=new oe,this.group.position.set(e.position.x,e.position.y,e.position.z);const t=k.G2020;t&&(this.group.position.x+=t.worldOffset[0],this.group.position.z+=t.worldOffset[2]),this._buildPlanet(),this._buildOrbitRings(),this._buildChildren()}_buildPlanet(){const e=new te(420,48,48),o=new Se({uniforms:{time:{value:0},deepColor:{value:new A(268328)},shallowColor:{value:new A(673904)},rimColor:{value:new A(2150608)}},vertexShader:`
        varying vec3 vNormal;
        varying vec3 vPos;
        uniform float time;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPos = position;
          vec3 displaced = position + normal * (
            15.0 * sin(position.y * 0.008 + time * 1.2) *
            cos(position.x * 0.006 + time * 0.8)
          );
          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        }
      `,fragmentShader:`
        uniform vec3 deepColor;
        uniform vec3 shallowColor;
        uniform vec3 rimColor;
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vPos;
        void main() {
          vec3 viewDir = normalize(cameraPosition - vPos);
          float rim = 1.0 - max(0.0, dot(vNormal, viewDir));
          rim = pow(rim, 3.0);
          float wave = 0.5 + 0.5 * sin(vPos.y * 0.01 + vPos.x * 0.008 + time * 0.9);
          vec3 waterColor = mix(deepColor, shallowColor, wave);
          vec3 final = mix(waterColor, rimColor, rim * 0.7);
          gl_FragColor = vec4(final, 1.0);
        }
      `,transparent:!1});this.planetMesh=new V(e,o),this.planetMesh.userData.objectId=this.objectData.id,this.group.add(this.planetMesh),this.clickTargets.push(this.planetMesh);const t=new Ye(2138320,1.2,5e3);this.group.add(t)}_buildOrbitRings(){for(const e of $e){const o=new He(e-4,e+4,96),t=new X({color:1720416,transparent:!0,opacity:.25,side:Me,depthWrite:!1}),s=new V(o,t);s.rotation.x=-Math.PI/2,this.group.add(s)}}_buildChildren(){const e=this.objectData.children??[],o={audio:"♪",video:"▶",playable:"⚡",archive:"◈"},t={audio:16765056,video:16744544,playable:8454016,archive:12632319};for(let s=0;s<e.length;s++){const i=e[s],a=$e[s]??800+s*500,r=$t[s]??.08,l=s/e.length*Math.PI*2,c=(s%2===0?1:-1)*(s*60),d=i.mediaKind??"archive",f=t[d]??16777215;let p;d==="playable"?p=new ct(90,1):d==="audio"?p=new dt(60,22,12,40):d==="video"?p=new pt(0,80,160,8):p=new mt(70,0);const g=new We({color:f,emissive:f,emissiveIntensity:.3,roughness:.3,metalness:.6}),x=new V(p,g);x.position.set(Math.cos(l)*a,c,Math.sin(l)*a),x.userData.childId=i.id,x.userData.contentStatus=i.contentStatus,this.group.add(x),this.clickTargets.push(x);const v=document.createElement("div");v.className="universe-label streams-child-label",v.style.cssText=`
        position:absolute;top:0;left:0;
        pointer-events:none;
        font-family:'Space Grotesk',sans-serif;
        font-size:clamp(8px,0.9vw,11px);
        letter-spacing:0.1em;
        text-transform:uppercase;
        color:rgba(220,240,255,0);
        white-space:nowrap;
        transform:translate(-50%,-130%);
        transition:color 0.3s;
        user-select:none;
        text-align:center;
        line-height:1.4;
      `,v.innerHTML=`<span>${o[d]??"○"}</span><br/><span>${i.title}</span>`,this.labelContainer.appendChild(v),this.children.push({id:i.id,title:i.title,mediaKind:d,contentStatus:i.contentStatus??"awaiting-source",mesh:x,orbitRadius:a,orbitSpeed:r,orbitAngle:l,orbitY:c,labelEl:v})}}update(e,o,t){this.time+=e;const s=this.planetMesh.material;s.uniforms.time.value=this.time,this.planetMesh.rotation.y+=e*.06;for(const i of this.children)i.orbitAngle+=e*i.orbitSpeed,i.mesh.position.set(Math.cos(i.orbitAngle)*i.orbitRadius,i.orbitY,Math.sin(i.orbitAngle)*i.orbitRadius),i.mesh.rotation.y+=e*.5,i.mesh.rotation.x+=e*.3;this._updateLabels(o,t)}_updateLabels(e,o){const{width:t,height:s}=o.domElement.getBoundingClientRect(),i=new M;e.getWorldPosition(i);for(const a of this.children){const r=new M;a.mesh.getWorldPosition(r);const l=i.distanceTo(r),c=800,f=1-Math.min(1,Math.max(0,(l-c)/(3500-c))),p=r.clone().project(e),g=(p.x*.5+.5)*t,x=(-(p.y*.5)+.5)*s;p.z>1||f<.02?a.labelEl.style.opacity="0":(a.labelEl.style.opacity=String(f),a.labelEl.style.left=`${g}px`,a.labelEl.style.top=`${x}px`)}}getChildData(e){return this.children.find(o=>o.id===e)}getPlanetWorldPos(){const e=new M;return this.planetMesh.getWorldPosition(e),e}dispose(){for(const e of this.children)e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.labelEl.remove();this.planetMesh.geometry.dispose(),this.planetMesh.material.dispose()}}const _={navContext:{level:"universe"},cameraSnapshot:null,selectedObjectId:null,selectedStarId:null,activeOverlay:"none",overlayData:null,audioState:"silent",muted:!!localStorage.getItem("universe_muted"),currentGalaxyId:null,placementMode:!1,myStarId:localStorage.getItem("universe_my_star_id"),stars:[],loaded:!1},W=new Map,xe=new Set;function Oe(n,e,o){const t=W.get(n);t&&t.forEach(s=>s(e,o)),xe.forEach(s=>s())}const b={get(n){return _[n]},set(n,e){const o=_[n];o!==e&&(_[n]=e,Oe(n,e,o))},patch(n){for(const[e,o]of Object.entries(n)){const t=_[e];t!==o&&(_[e]=o,Oe(e,o,t))}},subscribe(n,e){return W.has(n)||W.set(n,new Set),W.get(n).add(e),()=>W.get(n).delete(e)},on(n){return xe.add(n),()=>xe.delete(n)},snapshot(){return{..._}},toggleMute(){const n=!_.muted;n?localStorage.setItem("universe_muted","1"):localStorage.removeItem("universe_muted"),this.set("muted",n)},pushCameraSnapshot(n){this.set("cameraSnapshot",n)},popCameraSnapshot(){return _.cameraSnapshot},openOverlay(n,e,o){this.set("cameraSnapshot",o),this.patch({activeOverlay:n,overlayData:e})},closeOverlay(){this.patch({activeOverlay:"none",overlayData:null})},setMyStarId(n){localStorage.setItem("universe_my_star_id",n),this.set("myStarId",n)},addStar(n){const e=[..._.stars,n];this.set("stars",e)}},De=1500;class Dt{ambient=null;mediaEl=null;masterMuted;masterVol=.25;_rafId=0;constructor(){this.masterMuted=!!localStorage.getItem("universe_muted"),this._tick=this._tick.bind(this),requestAnimationFrame(this._tick)}unlock(){this.ambient?.el.paused&&!this.masterMuted&&this.ambient.el.play().catch(()=>{})}setAmbient(e){if(this.ambient?.el.src===e)return;this.ambient&&(this.ambient.targetVol=0);const o=new Audio(e);o.loop=!0,o.volume=0,o.preload="auto",this.masterMuted||o.play().catch(()=>{});const t={el:o,targetVol:this.masterMuted?0:this.masterVol,currentVol:0};this.ambient=t}clearAmbient(){this.ambient&&(this.ambient.targetVol=0,setTimeout(()=>{this.ambient&&(this.ambient.el.pause(),this.ambient.el.src=""),this.ambient=null},De+200))}duckAmbient(){this.ambient&&(this.ambient.targetVol=this.masterVol*.08)}restoreAmbient(){this.ambient&&(this.ambient.targetVol=this.masterMuted?0:this.masterVol)}setMuted(e){this.masterMuted=e,this.ambient&&(this.ambient.targetVol=e?0:this.masterVol),e&&this.mediaEl?.pause()}playEffect(e){}_tick(){this._rafId=requestAnimationFrame(this._tick);const e=16/De;if(this.ambient){const o=this.ambient.targetVol-this.ambient.currentVol;Math.abs(o)>.001&&(this.ambient.currentVol+=o*e*8,this.ambient.el.volume=Math.max(0,Math.min(1,this.ambient.currentVol)))}}dispose(){cancelAnimationFrame(this._rafId),this.ambient?.el.pause()}}const C=new Dt;let z=null;async function Pt(){if(z)return z;const o=await fetch("./data/seed_universe.json");if(!o.ok)throw new Error(`Failed to load seed data: ${o.status}`);return z=await o.json(),z}const Ie=new Map,Nt=new Map,Pe=new Map;function Ft(n){for(const e of n.galaxies){Ie.set(e.id,e);for(const o of e.regions)Nt.set(o.id,{...o,galaxyId:e.id})}for(const e of n.celestialObjects)if(Pe.set(e.id,e),e.children)for(const o of e.children)Pe.set(o.id,{...o,galaxyId:e.galaxyId,regionId:e.regionId,position:{...e.position}})}function Gt(){return z?z.galaxies:[]}function Ut(n){return Ie.get(n)?.regions??[]}function Bt(){return z?z.celestialObjects:[]}function Vt(){return z?z.demoStars:[]}function jt(){return Vt().map(n=>({id:n.id,galaxyId:n.galaxyId,regionId:n.regionId,x:n.x,y:n.y,z:n.z,displayName:n.displayName,message:n.message,createdAt:"2024-01-01T00:00:00Z",isDemo:!0}))}function ve(n){return k[n]?.worldOffset??[0,0,0]}function Yt(n,e){const o=ve(n),s=Ut(n).findIndex(a=>a.id===e),i=be[Math.max(0,s)];return[o[0]+i[0],o[1]+i[1],o[2]+i[2]]}function Ae(n){return Ie.get(n)?.title??n}class Ht{el;galaxyLabel;muteBtn;placeBtn;breadcrumb;constructor(e){this.el=document.createElement("div"),this.el.id="universe-hud",this.el.setAttribute("role","navigation"),this.el.setAttribute("aria-label","Universe navigation"),this.el.style.cssText=`
      position:absolute;
      top:0;left:0;right:0;
      display:flex;
      align-items:center;
      justify-content:space-between;
      padding:env(safe-area-inset-top,12px) 20px 12px;
      padding-top:max(env(safe-area-inset-top),12px);
      background:linear-gradient(to bottom,rgba(0,4,12,0.8) 0%,transparent 100%);
      pointer-events:none;
      z-index:50;
    `,this.el.innerHTML=`
      <div style="display:flex;align-items:center;gap:16px;pointer-events:auto;">
        <a
          id="hud-exit"
          href="/"
          style="
            font-family:'Space Mono',monospace;
            font-size:0.6rem;
            letter-spacing:0.18em;
            color:#3a6080;
            text-decoration:none;
            text-transform:uppercase;
            transition:color 0.2s;
            padding:6px 0;
          "
          aria-label="Exit Universe and return to main site"
        >← SITE</a>
        <div id="hud-breadcrumb" style="
          font-family:'Space Mono',monospace;
          font-size:0.6rem;
          letter-spacing:0.15em;
          color:#2a4858;
          text-transform:uppercase;
        ">UNIVERSE</div>
      </div>
      <div id="hud-galaxy-name" style="
        font-family:'Space Mono',monospace;
        font-size:0.65rem;
        letter-spacing:0.2em;
        color:#3a6080;
        text-transform:uppercase;
        text-align:center;
        flex:1;
        pointer-events:none;
      "></div>
      <div style="display:flex;align-items:center;gap:12px;pointer-events:auto;">
        <button
          id="hud-place"
          type="button"
          style="
            font-family:'Space Grotesk',sans-serif;
            font-size:0.65rem;letter-spacing:0.12em;text-transform:uppercase;
            background:rgba(20,60,100,0.6);
            border:1px solid rgba(40,120,200,0.25);
            border-radius:4px;
            color:#5090c0;
            padding:6px 12px;
            cursor:pointer;
            transition:background 0.2s,color 0.2s;
            white-space:nowrap;
          "
          aria-label="Place your star"
        >✦ PLACE STAR</button>
        <button
          id="hud-mute"
          type="button"
          style="
            background:rgba(255,255,255,0.04);
            border:1px solid rgba(255,255,255,0.08);
            border-radius:50%;
            width:32px;height:32px;
            color:#3a6080;
            cursor:pointer;
            font-size:0.8rem;
            display:flex;align-items:center;justify-content:center;
            transition:background 0.2s;
          "
          aria-label="Toggle sound"
        >♪</button>
      </div>
    `,e.appendChild(this.el),this.galaxyLabel=this.el.querySelector("#hud-galaxy-name"),this.breadcrumb=this.el.querySelector("#hud-breadcrumb"),this.muteBtn=this.el.querySelector("#hud-mute"),this.placeBtn=this.el.querySelector("#hud-place"),this._bindEvents(),this._syncMute(),b.subscribe("currentGalaxyId",o=>{this.galaxyLabel.textContent=o?Ae(o):""}),b.subscribe("navContext",o=>{this.breadcrumb.textContent=o.level.toUpperCase()}),b.subscribe("muted",()=>this._syncMute()),b.subscribe("myStarId",o=>{this.placeBtn.style.display=o?"none":"block"}),b.get("myStarId")&&(this.placeBtn.style.display="none")}_bindEvents(){this.muteBtn.addEventListener("click",()=>{C.unlock(),b.toggleMute(),C.setMuted(b.get("muted"))}),this.placeBtn.addEventListener("click",()=>{C.unlock(),b.set("placementMode",!0),window.dispatchEvent(new CustomEvent("universe-start-placement"))}),document.getElementById("universe-canvas")?.addEventListener("click",()=>{C.unlock()},{once:!0})}_syncMute(){const e=b.get("muted");this.muteBtn.textContent=e?"♪̶":"♪",this.muteBtn.setAttribute("aria-label",e?"Unmute":"Mute"),this.muteBtn.style.color=e?"#2a3848":"#3a6080"}setPlacementMode(e){this.placeBtn.textContent=e?"✦ PLACING…":"✦ PLACE STAR",this.placeBtn.style.color=e?"#60c080":"#5090c0"}dispose(){this.el.remove()}}const qe=[];let we={type:"universe"};function ie(n){const e=n.replace(/^#\/?/,"");if(!e||e==="universe")return{type:"universe"};const[o,t]=e.split("/");return o==="galaxy"&&t?{type:"galaxy",galaxyId:t}:o==="object"&&t?{type:"object",objectId:t}:o==="star"&&t?{type:"star",starId:t}:{type:"universe"}}function ae(n){we=n,qe.forEach(e=>e(n))}const re={init(){window.addEventListener("hashchange",()=>{ae(ie(window.location.hash))}),ae(ie(window.location.hash))},on(n){qe.push(n),n(we)},navigate(n,e=!0){let o="";n.type==="universe"?o="#universe":n.type==="galaxy"?o=`#galaxy/${n.galaxyId}`:n.type==="object"?o=`#object/${n.objectId}`:n.type==="star"&&(o=`#star/${n.starId}`),e?(history.pushState(null,"",o),ae(ie(o))):history.replaceState(null,"",o)},back(){history.back()},current(){return we}},Ne="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";function Wt(n=21){const e=crypto.getRandomValues(new Uint8Array(n));return Array.from(e,o=>Ne[o%Ne.length]).join("")}const U=500;class qt{cells=new Map;key(e,o,t){return`${Math.floor(e/U)},${Math.floor(o/U)},${Math.floor(t/U)}`}insert(e){const o=this.key(e.x,e.y,e.z);this.cells.has(o)||this.cells.set(o,[]),this.cells.get(o).push(e)}checkCollision(e,o,t,s){const i=Math.floor(e/U),a=Math.floor(o/U),r=Math.floor(t/U);for(let l=-1;l<=1;l++)for(let c=-1;c<=1;c++)for(let d=-1;d<=1;d++){const f=`${i+l},${a+c},${r+d}`,p=this.cells.get(f);if(p){for(const g of p)if(Math.sqrt((g.x-e)**2+(g.y-o)**2+(g.z-t)**2)<s)return!0}}return!1}rebuild(e){this.cells.clear();for(const o of e)this.insert(o)}}const Fe="universe_stars",Ge="universe_my_star_id",Ue="universe_last_place",Xt=1e3*60*5;class Kt{grid=new qt;stars=[];loaded=!1;async loadStars(){if(this.loaded)return this.stars;const e=jt();let o=[];try{const t=localStorage.getItem(Fe);t&&(o=JSON.parse(t))}catch{o=[]}return this.stars=[...e,...o],this.grid.rebuild(this.stars),this.loaded=!0,this.stars}async placestar(e){if(this.getMyStarId())return{success:!1,error:"already-placed"};const t=localStorage.getItem(Ue);if(t&&Date.now()-parseInt(t)<Xt)return{success:!1,error:"rate-limit"};if(this.grid.checkCollision(e.x,e.y,e.z,Mt))return{success:!1,error:"collision"};const s=Yt(e.galaxyId,e.regionId),i=e.x-s[0],a=e.z-s[2];if(Math.sqrt(i*i+a*a)>Et||Math.abs(e.y-s[1])>Ct)return{success:!1,error:"collision"};const l={id:Wt(),galaxyId:e.galaxyId,regionId:e.regionId,x:e.x,y:e.y,z:e.z,displayName:le(e.displayName),starName:e.starName?le(e.starName):void 0,message:e.message?le(e.message):void 0,signatureDataUrl:e.signatureDataUrl,createdAt:new Date().toISOString(),isDemo:!1};return this.stars.push(l),this.grid.insert(l),this.savePersisted(),localStorage.setItem(Ge,l.id),localStorage.setItem(Ue,String(Date.now())),b.setMyStarId(l.id),{success:!0,star:l}}async getStarById(e){return await this.loadStars(),this.stars.find(o=>o.id===e)??null}getMyStarId(){return localStorage.getItem(Ge)}savePersisted(){const e=this.stars.filter(o=>!o.isDemo);localStorage.setItem(Fe,JSON.stringify(e))}}function le(n){return n.replace(/[<>&"']/g,e=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&#39;"})[e]??e).slice(0,120)}function Jt(){return new Kt}const q=Jt();function D(n,e){const o=document.createElement("div");return o.id=n,o.className=`overlay-panel ${e}`,o.setAttribute("role","dialog"),o.setAttribute("aria-modal","true"),o.style.cssText=`
    position:absolute;
    inset:0;
    display:flex;
    align-items:center;
    justify-content:center;
    background:rgba(0,4,12,0.82);
    backdrop-filter:blur(4px);
    -webkit-backdrop-filter:blur(4px);
    z-index:100;
    animation:overlay-in 0.25s ease;
  `,o}function P(){if(document.getElementById("overlay-styles"))return;const n=document.createElement("style");n.id="overlay-styles",n.textContent=`
    @keyframes overlay-in {
      from { opacity:0; transform:scale(0.97); }
      to   { opacity:1; transform:scale(1); }
    }
    @keyframes overlay-out {
      from { opacity:1; }
      to   { opacity:0; }
    }
    @media (prefers-reduced-motion:reduce) {
      @keyframes overlay-in { from { opacity:0; } to { opacity:1; } }
      @keyframes overlay-out { from { opacity:1; } to { opacity:0; } }
    }
    .overlay-panel { font-family:'Space Grotesk',sans-serif; }
    .overlay-close-btn {
      position:absolute;top:20px;right:20px;
      background:rgba(255,255,255,0.06);
      border:1px solid rgba(255,255,255,0.12);
      color:#a0b8d0;
      width:36px;height:36px;
      border-radius:50%;
      cursor:pointer;
      font-size:1rem;
      display:flex;align-items:center;justify-content:center;
      transition:background 0.2s,color 0.2s;
      line-height:1;
    }
    .overlay-close-btn:hover { background:rgba(255,255,255,0.12); color:#fff; }
    .overlay-close-btn:focus-visible { outline:2px solid #4090d0; outline-offset:2px; }
  `,document.head.appendChild(n)}function j(n){const e=n.querySelectorAll('button,a,[tabindex]:not([tabindex="-1"]),input,textarea,select'),o=e[0],t=e[e.length-1];function s(i){i.key==="Tab"&&(i.shiftKey?document.activeElement===o&&(i.preventDefault(),t?.focus()):document.activeElement===t&&(i.preventDefault(),o?.focus()))}return n.addEventListener("keydown",s),o?.focus(),()=>n.removeEventListener("keydown",s)}function N(n,e){function o(t){t.key==="Escape"&&e()}return window.addEventListener("keydown",o),()=>window.removeEventListener("keydown",o)}function K(n,e){const o=document.createElement("button");return o.className="overlay-close-btn",o.type="button",o.setAttribute("aria-label","Close"),o.innerHTML="×",o.addEventListener("click",e),n.appendChild(o),o}function Zt(n,e,o){P(),C.duckAmbient();const t=D("audio-overlay","audio-overlay");t.setAttribute("aria-label",`Audio: ${e.title}`);const s=!e.mediaUrl||e.contentStatus==="awaiting-source";t.innerHTML=`
    <div style="
      position:relative;
      background:linear-gradient(135deg,#030d18 0%,#061828 60%,#020a10 100%);
      border:1px solid rgba(32,160,208,0.2);
      border-radius:16px;
      padding:48px 40px 36px;
      max-width:480px;
      width:90vw;
      text-align:center;
    ">
      <div style="
        width:120px;height:120px;
        border-radius:50%;
        border:2px solid rgba(32,200,200,0.3);
        display:flex;align-items:center;justify-content:center;
        margin:0 auto 24px;
        position:relative;
        animation:orbit-pulse 3s ease-in-out infinite;
      ">
        <span style="font-size:2.5rem;" aria-hidden="true">♪</span>
        <div style="
          position:absolute;inset:-20px;
          border:1px solid rgba(32,200,200,0.1);
          border-radius:50%;
          animation:orbit-spin 8s linear infinite;
        "></div>
      </div>
      <p style="font-size:0.7rem;letter-spacing:0.2em;color:#4090b0;margin-bottom:8px;text-transform:uppercase;">
        Streams / Audio
      </p>
      <h2 style="font-family:'Space Mono',monospace;font-size:1.1rem;letter-spacing:0.1em;margin-bottom:16px;color:#c8e8f8;">
        ${e.title}
      </h2>
      ${s?`
        <p style="color:#4a6878;font-size:0.8rem;letter-spacing:0.08em;margin-bottom:24px;">
          AUDIO SOURCE PENDING — RECORD MARKED AWAITING-SOURCE
        </p>
        <div style="
          background:rgba(8,40,60,0.6);
          border:1px dashed rgba(32,120,160,0.25);
          border-radius:8px;
          padding:16px;
          color:#3a6878;
          font-size:0.75rem;
          font-family:'Space Mono',monospace;
          letter-spacing:0.05em;
        ">
          contentStatus: "awaiting-source"<br/>
          No media URL has been assigned yet.<br/>
          This record will activate when a real source is supplied.
        </div>
      `:`
        <audio
          id="spatial-audio"
          controls
          style="width:100%;border-radius:8px;margin-bottom:16px;accent-color:#20c0c0;"
          src="${e.mediaUrl}"
        ></audio>
      `}
    </div>
  `,so();const i=()=>{t.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{t.remove(),C.restoreAmbient(),o()},200)};K(t.firstElementChild,i);const a=N(t,i),r=j(t);if(t.addEventListener("mousedown",l=>{l.target===t&&i()}),n.appendChild(t),n.setAttribute("aria-hidden","false"),!s){const l=t.querySelector("#spatial-audio");l?.play().catch(()=>{}),l?.addEventListener("play",()=>C.duckAmbient()),l?.addEventListener("pause",()=>C.restoreAmbient())}return()=>{a(),r(),i()}}function Qt(n,e,o){P(),C.duckAmbient();const t=D("video-overlay","video-overlay");t.setAttribute("aria-label",`Video: ${e.title}`),t.style.background="rgba(0,0,0,0.92)";const s=!e.mediaUrl||e.contentStatus==="awaiting-source";t.innerHTML=`
    <div style="
      position:relative;
      max-width:820px;width:92vw;
    ">
      <p style="
        font-family:'Space Mono',monospace;
        font-size:0.65rem;letter-spacing:0.2em;color:#4090b0;
        text-align:center;margin-bottom:12px;text-transform:uppercase;
      ">
        Streams / Video
      </p>
      <h2 style="
        font-family:'Space Mono',monospace;font-size:1rem;letter-spacing:0.08em;
        color:#c8e8f8;text-align:center;margin-bottom:16px;
      ">
        ${e.title}
      </h2>
      <div style="
        aspect-ratio:16/9;
        background:#020810;
        border:1px solid rgba(255,100,60,0.15);
        border-radius:8px;
        display:flex;align-items:center;justify-content:center;
        overflow:hidden;
      ">
        ${s?`
          <div style="text-align:center;color:#3a5060;padding:32px;">
            <div style="font-size:2.5rem;margin-bottom:16px;" aria-hidden="true">▶</div>
            <p style="font-family:'Space Mono',monospace;font-size:0.7rem;letter-spacing:0.1em;">
              VIDEO SOURCE PENDING<br/>contentStatus: "awaiting-source"
            </p>
          </div>
        `:e.mediaUrl?.includes("youtube")||e.mediaUrl?.includes("youtu.be")?`
          <iframe
            src="${oo(e.mediaUrl)}"
            style="width:100%;height:100%;border:none;"
            allow="autoplay;encrypted-media"
            allowfullscreen
            title="${e.title}"
          ></iframe>
        `:`
          <video
            controls autoplay
            style="width:100%;height:100%;"
            src="${e.mediaUrl}"
            ${e.posterUrl?`poster="${e.posterUrl}"`:""}
          ></video>
        `}
      </div>
    </div>
  `;const i=()=>{t.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{t.remove(),C.restoreAmbient(),o()},200)};K(t,i);const a=N(t,i),r=j(t);return t.addEventListener("mousedown",l=>{l.target===t&&i()}),n.appendChild(t),()=>{a(),r(),i()}}function eo(n,e,o){P(),C.duckAmbient();const t=D("playable-overlay","playable-overlay");t.setAttribute("aria-label",`Playable Experience: ${e.title}`),t.style.background="rgba(0,0,0,0.98)",t.style.padding="0";const s=e.mediaUrl??"/games/streams/";t.innerHTML=`
    <div style="position:relative;width:100%;height:100%;">
      <div style="
        position:absolute;top:0;left:0;right:0;
        display:flex;align-items:center;justify-content:between;
        padding:10px 16px;
        background:rgba(0,4,8,0.9);
        z-index:10;
        gap:16px;
      ">
        <span style="
          font-family:'Space Mono',monospace;
          font-size:0.6rem;letter-spacing:0.2em;color:#4090b0;
          flex:1;text-transform:uppercase;
        ">
          2FLY UNIVERSE — ${e.title}
        </span>
        <button
          id="exit-playable"
          type="button"
          style="
            font-family:'Space Grotesk',sans-serif;
            font-size:0.7rem;letter-spacing:0.12em;text-transform:uppercase;
            background:rgba(255,255,255,0.06);
            border:1px solid rgba(255,255,255,0.15);
            color:#a0c0d8;
            padding:6px 14px;border-radius:4px;
            cursor:pointer;
            transition:background 0.2s;
          "
          aria-label="Exit experience and return to Universe"
        >
          EXIT UNIVERSE
        </button>
      </div>
      <iframe
        id="playable-frame"
        src="${s}"
        style="
          position:absolute;inset:40px 0 0 0;
          width:100%;
          height:calc(100% - 40px);
          border:none;
          background:#000;
        "
        title="${e.title}"
        allow="autoplay"
        sandbox="allow-scripts allow-same-origin allow-forms"
      ></iframe>
    </div>
  `;const i=()=>{t.style.animation="overlay-out 0.15s ease forwards",setTimeout(()=>{t.remove(),C.restoreAmbient(),o()},150)};t.querySelector("#exit-playable")?.addEventListener("click",i);const a=N(t,i);n.appendChild(t);const r=l=>{(l.data==="UNIVERSE_EXIT"||l.data?.type==="UNIVERSE_EXIT")&&i()};return window.addEventListener("message",r),()=>{a(),window.removeEventListener("message",r),i()}}function to(n,e,o){P();const t=D("archive-overlay","archive-overlay");t.setAttribute("aria-label",`Archive: ${e.title}`),t.innerHTML=`
    <div style="
      position:relative;
      background:linear-gradient(135deg,#040810 0%,#080c18 100%);
      border:1px solid rgba(160,160,255,0.15);
      border-radius:16px;
      padding:48px 40px 36px;
      max-width:560px;width:90vw;
    ">
      <p style="font-size:0.65rem;letter-spacing:0.2em;color:#6060c0;margin-bottom:8px;text-transform:uppercase;font-family:'Space Mono',monospace;">
        Streams / Archive
      </p>
      <h2 style="font-family:'Space Mono',monospace;font-size:1.1rem;letter-spacing:0.1em;margin-bottom:20px;color:#c0c8f8;">
        ${e.title}
      </h2>
      ${e.contentStatus==="awaiting-source"?`
        <div style="
          background:rgba(20,20,60,0.5);
          border:1px dashed rgba(80,80,180,0.25);
          border-radius:8px;
          padding:20px;
          color:#4a4a90;
          font-size:0.75rem;
          font-family:'Space Mono',monospace;
          letter-spacing:0.05em;
          line-height:1.7;
        ">
          ARTIFACT RECORD — DOSSIER PENDING<br/>
          contentStatus: "awaiting-source"<br/><br/>
          This archive object is reserved for artwork,<br/>
          documentation, and archival materials.<br/>
          Content will appear when assigned to this record.
        </div>
      `:`<p style="color:#8090a8;font-size:0.9rem;line-height:1.7;">${e.description??"Archive record."}</p>`}
    </div>
  `;const s=()=>{t.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{t.remove(),o()},200)};K(t.firstElementChild,s);const i=N(t,s),a=j(t);return t.addEventListener("mousedown",r=>{r.target===t&&s()}),n.appendChild(t),()=>{i(),a(),s()}}function oo(n){const e=n.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);return e?`https://www.youtube.com/embed/${e[1]}?autoplay=1`:n}function so(){if(document.getElementById("orbit-anim"))return;const n=document.createElement("style");n.id="orbit-anim",n.textContent=`
    @keyframes orbit-pulse {
      0%,100% { box-shadow:0 0 20px rgba(32,200,200,0.1); }
      50% { box-shadow:0 0 40px rgba(32,200,200,0.25); }
    }
    @keyframes orbit-spin {
      to { transform:rotate(360deg); }
    }
  `,document.head.appendChild(n)}function no(n,e,o){P();const t=D("star-card-overlay","star-card-overlay");t.setAttribute("aria-label",`Star Card: ${e.displayName}`),t.style.background="rgba(0,2,10,0.92)";const s=document.createElement("canvas");s.width=1080,s.height=1350,s.style.display="none",document.body.appendChild(s),de(s,e,1080,1350);const i=document.createElement("canvas");i.width=1080,i.height=1920,i.style.display="none",document.body.appendChild(i),de(i,e,1080,1920);const a=document.createElement("canvas");a.width=360,a.height=450,a.style.cssText="border-radius:8px;max-width:100%;",de(a,e,360,450);const r=`${location.origin}${location.pathname}#star/${e.id}`;t.innerHTML=`
    <div style="
      position:relative;
      background:linear-gradient(135deg,#020610 0%,#040a1c 100%);
      border:1px solid rgba(255,200,50,0.15);
      border-radius:16px;
      padding:48px 32px 32px;
      max-width:480px;width:92vw;
      text-align:center;
    ">
      <p style="font-size:0.65rem;letter-spacing:0.2em;color:#c8a040;margin-bottom:16px;
        text-transform:uppercase;font-family:'Space Mono',monospace;">
        ✦ Your Star Card
      </p>
      <div id="star-card-preview-wrap" style="margin-bottom:20px;"></div>
      <h2 style="font-family:'Space Mono',monospace;font-size:1rem;letter-spacing:0.08em;
        margin-bottom:6px;color:#f8e080;">
        ${e.displayName}
      </h2>
      ${e.starName?`<p style="color:#9080a0;font-size:0.8rem;margin-bottom:4px;">"${e.starName}"</p>`:""}
      <p style="color:#3a5070;font-size:0.7rem;font-family:'Space Mono',monospace;margin-bottom:20px;">
        ID: ${e.id.slice(0,16)}…
      </p>
      <p style="color:#4a6888;font-size:0.75rem;margin-bottom:4px;">Share your star:</p>
      <div style="
        background:rgba(255,255,255,0.03);
        border:1px solid rgba(255,255,255,0.08);
        border-radius:6px;
        padding:8px 12px;
        font-family:'Space Mono',monospace;
        font-size:0.65rem;
        color:#4a6888;
        margin-bottom:20px;
        word-break:break-all;
      ">${r}</div>
      <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-bottom:16px;">
        <button id="dl-card" type="button" style="${ce()}">DOWNLOAD CARD (1080×1350)</button>
        <button id="dl-story" type="button" style="${ce()}">DOWNLOAD STORY (1080×1920)</button>
        <button id="copy-link" type="button" style="${ce("rgba(20,60,20,0.6)")}">COPY SHARE LINK</button>
      </div>
      <p id="copy-confirm" style="color:#60c070;font-size:0.75rem;min-height:18px;"></p>
    </div>
  `;const l=t.querySelector("#star-card-preview-wrap");l&&l.appendChild(a),t.querySelector("#dl-card")?.addEventListener("click",()=>{Ve(s,`2fly-star-${e.id.slice(0,8)}-card.png`)}),t.querySelector("#dl-story")?.addEventListener("click",()=>{Ve(i,`2fly-star-${e.id.slice(0,8)}-story.png`)}),t.querySelector("#copy-link")?.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(r);const p=t.querySelector("#copy-confirm");p&&(p.textContent="Link copied!",setTimeout(()=>{p.textContent=""},2e3))}catch{const p=t.querySelector("#copy-confirm");p&&(p.textContent=r)}});const c=()=>{t.remove(),s.remove(),i.remove(),a.remove(),o()};K(t.firstElementChild,c);const d=N(t,c),f=j(t);return t.addEventListener("mousedown",p=>{p.target===t&&c()}),n.appendChild(t),()=>{d(),f(),c()}}function Be(n,e,o){P();const t=D("star-view-overlay","star-view-overlay");t.setAttribute("aria-label",`Star: ${e.displayName}`);const s=k[e.galaxyId],i=s?"#"+s.primaryColor.toString(16).padStart(6,"0"):"#4080c0",a=Ae(e.galaxyId);t.innerHTML=`
    <div style="
      position:relative;
      background:radial-gradient(ellipse at 50% 30%, rgba(${H(s?.primaryColor??2121888)},0.12) 0%, rgba(0,4,12,0.95) 70%);
      border:1px solid rgba(${H(s?.primaryColor??2121888)},0.2);
      border-radius:20px;
      padding:60px 40px 40px;
      max-width:500px;width:92vw;
      text-align:center;
    ">
      <div style="
        font-size:3rem;margin-bottom:20px;
        text-shadow:0 0 30px ${i};
        animation:star-pulse 3s ease-in-out infinite;
      " aria-hidden="true">✦</div>
      <p style="font-size:0.65rem;letter-spacing:0.2em;color:${i};margin-bottom:8px;
        text-transform:uppercase;font-family:'Space Mono',monospace;">
        Star — ${a}
      </p>
      <h2 style="font-family:'Space Mono',monospace;font-size:1.2rem;letter-spacing:0.08em;
        margin-bottom:6px;color:#f0f4ff;">
        ${e.displayName}
      </h2>
      ${e.starName?`<p style="color:#7080a0;font-size:0.85rem;margin-bottom:12px;">"${e.starName}"</p>`:""}
      ${e.message?`
        <blockquote style="
          color:#8090a8;font-size:0.85rem;font-style:italic;
          margin:0 0 20px;padding:12px 16px;
          border-left:2px solid rgba(${H(s?.primaryColor??2121888)},0.3);
          text-align:left;border-radius:0 8px 8px 0;
          background:rgba(255,255,255,0.02);
        ">
          "${e.message}"
        </blockquote>
      `:""}
      <div style="
        display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:20px 0;
        text-align:left;
      ">
        ${Q("GALAXY",a)}
        ${Q("ARRIVED",Xe(e.createdAt))}
        ${Q("STAR ID",e.id.slice(0,14)+"…")}
        ${Q("COORDINATES",`${e.x.toFixed(0)}, ${e.y.toFixed(0)}, ${e.z.toFixed(0)}`)}
      </div>
      <button id="star-place-cta" type="button" style="
        margin-top:8px;
        padding:12px 28px;
        background:rgba(${H(s?.primaryColor??2121888)},0.15);
        border:1px solid rgba(${H(s?.primaryColor??2121888)},0.35);
        border-radius:6px;
        color:#c0d0f0;
        font-family:'Space Grotesk',sans-serif;
        font-size:0.8rem;letter-spacing:0.12em;text-transform:uppercase;
        cursor:pointer;
        transition:background 0.2s;
      ">PLACE YOUR STAR →</button>
    </div>
  `;const r=()=>{t.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{t.remove(),o()},200)};t.querySelector("#star-place-cta")?.addEventListener("click",()=>{r(),b.set("placementMode",!0),window.dispatchEvent(new CustomEvent("universe-start-placement"))}),K(t.firstElementChild,r);const l=N(t,r),c=j(t);return t.addEventListener("mousedown",d=>{d.target===t&&r()}),n.appendChild(t),()=>{l(),c(),r()}}async function io(n,e,o){const t=window.matchMedia("(prefers-reduced-motion: reduce)").matches,s=document.createElement("div");s.style.cssText=`
    position:fixed;inset:0;
    background:rgba(0,2,8,0.92);
    display:flex;flex-direction:column;
    align-items:center;justify-content:center;
    z-index:200;
    font-family:'Space Mono',monospace;
    text-align:center;gap:16px;
    transition:opacity 0.5s;
  `,s.innerHTML=`
    <p style="font-size:0.6rem;letter-spacing:0.3em;color:#2060a0;text-transform:uppercase;">
      DESTINATION RECEIVED
    </p>
    <div style="font-size:0.8rem;letter-spacing:0.1em;color:#4090c0;">
      INITIATING APPROACH SEQUENCE
    </div>
    <div style="
      font-size:2rem;color:#ffd700;
      animation:star-pulse 2s ease-in-out infinite;
    " aria-hidden="true">✦</div>
    <p style="font-size:0.7rem;color:#3a6080;max-width:300px;line-height:1.6;">
      Flying to ${e.displayName}'s star in the<br/>2Fly Universe…
    </p>
  `,n.appendChild(s);const i=t?400:2500;await new Promise(a=>setTimeout(a,i)),s.style.opacity="0",await new Promise(a=>setTimeout(a,500)),s.remove(),o()}function ce(n="rgba(20,40,80,0.6)"){return["display:inline-block;","padding:10px 16px;",`background:${n};`,"border:1px solid rgba(80,140,220,0.25);","border-radius:6px;","color:#a0b8d8;","font-family:'Space Grotesk',sans-serif;","font-size:0.72rem;","letter-spacing:0.1em;","text-transform:uppercase;","cursor:pointer;","transition:background 0.2s;"].join("")}function de(n,e,o,t){const s=n.getContext("2d");if(!s)return;n.width=o,n.height=t;const i=k[e.galaxyId],a=s.createRadialGradient(o*.5,t*.3,0,o*.5,t*.3,t*.7),r=i?"#"+i.primaryColor.toString(16).padStart(6,"0"):"#204080";a.addColorStop(0,`${r}22`),a.addColorStop(.6,"#020810"),a.addColorStop(1,"#010408"),s.fillStyle=a,s.fillRect(0,0,o,t),s.globalAlpha=.5;for(let g=0;g<300;g++){const x=Math.random()*o,v=Math.random()*t,F=Math.random()*1.2+.3;s.fillStyle="#ffffff",s.beginPath(),s.arc(x,v,F,0,Math.PI*2),s.fill()}s.globalAlpha=1;const l=o/1080,c=80*l;s.font=`${c}px serif`,s.textAlign="center",s.fillStyle="#ffd700",s.shadowColor="#ffd700",s.shadowBlur=40*l,s.fillText("✦",o*.5,t*.25),s.shadowBlur=0,s.font=`${11*l}px 'Arial', sans-serif`,s.fillStyle=r,s.letterSpacing=`${3*l}px`,s.fillText("2FLY UNIVERSE",o*.5,t*.32),s.font=`bold ${28*l}px 'Arial', sans-serif`,s.fillStyle="#f0f4ff",s.letterSpacing="0px",s.fillText(e.displayName.toUpperCase(),o*.5,t*.4),e.starName&&(s.font=`${16*l}px 'Arial', sans-serif`,s.fillStyle="#7080a0",s.fillText(`"${e.starName}"`,o*.5,t*.45)),e.message&&(s.font=`italic ${13*l}px 'Arial', sans-serif`,s.fillStyle="#5a7090",ao(s,`"${e.message}"`,o*.5,t*.52,o*.75,18*l));const d=t*.72,f=20*l;s.font=`${10*l}px 'Courier New', monospace`,s.textAlign="center";const p=[`GALAXY: ${Ae(e.galaxyId).toUpperCase()}`,`ARRIVED: ${Xe(e.createdAt)}`,`ID: ${e.id.slice(0,20)}`,`COORDS: ${e.x.toFixed(0)}, ${e.y.toFixed(0)}, ${e.z.toFixed(0)}`];s.fillStyle="#2a4060",p.forEach((g,x)=>s.fillText(g,o*.5,d+x*f)),s.font=`${9*l}px 'Arial', sans-serif`,s.fillStyle="#1a3050",s.fillText("2FLYKEITHLOGAN.COM/UNIVERSE",o*.5,t*.94),s.strokeStyle=`${r}33`,s.lineWidth=2*l,s.strokeRect(20*l,20*l,o-40*l,t-40*l)}function ao(n,e,o,t,s,i){const a=e.split(" ");let r="",l=t;for(const c of a){const d=r+c+" ";n.measureText(d).width>s&&r.length?(n.fillText(r,o,l),r=c+" ",l+=i):r=d}n.fillText(r,o,l)}function Ve(n,e){const o=document.createElement("a");o.href=n.toDataURL("image/png"),o.download=e,o.click()}function Q(n,e){return`
    <div style="
      background:rgba(255,255,255,0.02);
      border:1px solid rgba(255,255,255,0.05);
      border-radius:6px;
      padding:10px 12px;
    ">
      <div style="font-size:0.6rem;letter-spacing:0.15em;color:#3a5070;
        text-transform:uppercase;font-family:'Space Mono',monospace;margin-bottom:4px;">${n}</div>
      <div style="font-size:0.78rem;color:#8090b0;word-break:break-all;">${e}</div>
    </div>
  `}function Xe(n){try{return new Date(n).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}catch{return n}}function H(n){const e=n>>16&255,o=n>>8&255,t=n&255;return`${e},${o},${t}`}const Ke=document.createElement("style");Ke.textContent=`
  @keyframes star-pulse {
    0%,100% { text-shadow:0 0 10px currentColor,0 0 20px currentColor; }
    50% { text-shadow:0 0 20px currentColor,0 0 40px currentColor,0 0 60px currentColor; }
  }
`;document.head.appendChild(Ke);function ro(n,e,o){P();const t=D("star-placement-overlay","star-placement-overlay");t.setAttribute("aria-label","Place Your Star in the 2Fly Universe"),t.style.background="rgba(0,2,8,0.88)";let s="info",i="",a="",r="";function l(){t.innerHTML=lo(s,e,i,a,r),c(),j(t)}function c(){t.querySelector("#place-close")?.addEventListener("click",()=>d(!1)),s==="info"&&t.querySelector("#place-next")?.addEventListener("click",()=>{const x=(t.querySelector("#place-display-name")?.value??"").trim(),v=(t.querySelector("#place-star-name")?.value??"").trim(),F=(t.querySelector("#place-message")?.value??"").trim();if(!x){const T=t.querySelector("#place-error");T&&(T.textContent="Display name is required.");return}i=x,a=v,r=F,s="confirm",l()}),s==="confirm"&&(t.querySelector("#place-back")?.addEventListener("click",()=>{s="info",l()}),t.querySelector("#place-confirm")?.addEventListener("click",async()=>{const g=t.querySelector("#place-confirm");g&&(g.disabled=!0,g.textContent="PLACING…");const x={galaxyId:e.galaxyId,regionId:e.regionId,x:e.x,y:e.y,z:e.z,displayName:i,starName:a||void 0,message:r||void 0},v=await q.placestar(x);if(v.success&&v.star)b.setMyStarId(v.star.id),b.addStar(v.star),s="ignition",l(),setTimeout(()=>{v.star&&no(n,v.star,()=>d(!0))},2200);else{const F={collision:"That location is too close to another star. Please choose a different spot.","already-placed":"You have already placed a star in the Universe.","rate-limit":"Please wait a moment before placing again.","server-error":"An error occurred. Please try again."};s="info",l();const T=t.querySelector("#place-error");T&&(T.textContent=F[v.error??"server-error"]??"An error occurred.")}}))}function d(p){t.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{t.remove(),o(p)},200)}const f=N(t,()=>d(!1));return l(),n.appendChild(t),()=>{f(),d(!1)}}function lo(n,e,o,t,s){const i=`${e.x.toFixed(0)}, ${e.y.toFixed(0)}, ${e.z.toFixed(0)}`;return n==="info"?`
    <div style="
      position:relative;
      background:linear-gradient(135deg,#020610 0%,#040c1e 100%);
      border:1px solid rgba(100,160,255,0.15);
      border-radius:16px;
      padding:48px 36px 32px;
      max-width:440px;width:90vw;
    ">
      <button id="place-close" type="button" class="overlay-close-btn" aria-label="Cancel star placement"
        style="position:absolute;top:16px;right:16px;">×</button>
      <p style="font-size:0.65rem;letter-spacing:0.2em;color:#4070c0;margin-bottom:8px;
        text-transform:uppercase;font-family:'Space Mono',monospace;">
        PLACE YOUR STAR
      </p>
      <h2 style="font-family:'Space Mono',monospace;font-size:1rem;letter-spacing:0.08em;
        margin-bottom:6px;color:#c0d8f8;">
        Mark Your Place in the Universe
      </h2>
      <p style="font-size:0.75rem;color:#4a6888;margin-bottom:24px;line-height:1.6;">
        Coordinates: ${i}
      </p>
      <div id="place-error" role="alert" style="color:#f06060;font-size:0.78rem;
        margin-bottom:12px;min-height:18px;"></div>
      <label style="display:block;margin-bottom:16px;">
        <span style="font-size:0.7rem;letter-spacing:0.12em;color:#6090b8;text-transform:uppercase;
          display:block;margin-bottom:6px;">Display Name *</span>
        <input id="place-display-name" type="text" maxlength="60"
          placeholder="Your name or alias"
          value="${o}"
          style="${pe()}"
          autocomplete="name" required />
      </label>
      <label style="display:block;margin-bottom:16px;">
        <span style="font-size:0.7rem;letter-spacing:0.12em;color:#6090b8;text-transform:uppercase;
          display:block;margin-bottom:6px;">Star Name (optional)</span>
        <input id="place-star-name" type="text" maxlength="60"
          placeholder="Name your star"
          value="${t}"
          style="${pe()}" />
      </label>
      <label style="display:block;margin-bottom:24px;">
        <span style="font-size:0.7rem;letter-spacing:0.12em;color:#6090b8;text-transform:uppercase;
          display:block;margin-bottom:6px;">Message (optional)</span>
        <textarea id="place-message" maxlength="280" rows="3"
          placeholder="Leave a message for the Universe…"
          style="${pe()} resize:vertical;height:80px;"
        >${s}</textarea>
      </label>
      <button id="place-next" type="button" style="${me("#1a60c0","#2080e0")}">
        PREVIEW MY STAR →
      </button>
    </div>
  `:n==="confirm"?`
    <div style="
      position:relative;
      background:linear-gradient(135deg,#020610 0%,#040c1e 100%);
      border:1px solid rgba(100,200,255,0.2);
      border-radius:16px;
      padding:48px 36px 32px;
      max-width:440px;width:90vw;
      text-align:center;
    ">
      <button id="place-close" type="button" class="overlay-close-btn" aria-label="Cancel"
        style="position:absolute;top:16px;right:16px;">×</button>
      <div style="font-size:3rem;margin-bottom:16px;" aria-hidden="true">✦</div>
      <p style="font-size:0.65rem;letter-spacing:0.2em;color:#4070c0;margin-bottom:8px;
        text-transform:uppercase;font-family:'Space Mono',monospace;">Confirm Placement</p>
      <h2 style="font-family:'Space Mono',monospace;font-size:1.1rem;letter-spacing:0.08em;
        margin-bottom:20px;color:#c0d8f8;">
        ${o}
      </h2>
      ${t?`<p style="color:#7090b0;font-size:0.85rem;margin-bottom:8px;">Star: "${t}"</p>`:""}
      ${s?`<p style="color:#5a7898;font-size:0.8rem;font-style:italic;margin-bottom:8px;">"${s}"</p>`:""}
      <p style="color:#3a5878;font-size:0.75rem;font-family:'Space Mono',monospace;margin-bottom:24px;">
        ${i}
      </p>
      <p style="color:#4a6888;font-size:0.75rem;margin-bottom:28px;line-height:1.6;">
        Your star is permanent. You may place one primary star.
        Confirm to ignite your light in the Universe.
      </p>
      <div style="display:flex;gap:12px;justify-content:center;">
        <button id="place-back" type="button" style="${me("#1a2030","#202840")}">← BACK</button>
        <button id="place-confirm" type="button" style="${me("#104080","#1060b0")}">IGNITE MY STAR ✦</button>
      </div>
    </div>
  `:n==="ignition"?`
    <div style="
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      gap:24px;padding:60px;text-align:center;
    ">
      <div style="
        width:80px;height:80px;
        border-radius:50%;
        background:radial-gradient(circle,#ffd700 0%,#ff8800 40%,transparent 70%);
        animation:star-ignite 2s ease-out forwards;
        box-shadow:0 0 60px #ffd700, 0 0 120px #ff8800;
      " aria-hidden="true"></div>
      <p style="font-family:'Space Mono',monospace;font-size:0.8rem;letter-spacing:0.2em;
        color:#ffd070;text-transform:uppercase;animation:fade-in-text 0.8s 0.5s both;">
        ${o} — Your star ignites
      </p>
    </div>
  `:""}function pe(){return`
    width:100%;
    background:rgba(255,255,255,0.04);
    border:1px solid rgba(80,120,200,0.2);
    border-radius:6px;
    color:#c8d8f0;
    font-family:'Space Grotesk',sans-serif;
    font-size:0.9rem;
    padding:10px 14px;
    outline:none;
    transition:border-color 0.2s;
    box-sizing:border-box;
  `}function me(n,e){return`
    display:inline-block;
    padding:12px 24px;
    background:${n};
    border:1px solid rgba(80,140,220,0.3);
    border-radius:6px;
    color:#a0d0f0;
    font-family:'Space Grotesk',sans-serif;
    font-size:0.8rem;
    letter-spacing:0.12em;
    text-transform:uppercase;
    cursor:pointer;
    transition:background 0.2s;
    --hover-bg:${e};
  `}const Je=document.createElement("style");Je.textContent=`
  @keyframes star-ignite {
    0% { transform:scale(0.1); opacity:0.2; }
    50% { transform:scale(1.4); opacity:1; }
    100% { transform:scale(1); opacity:0.9; }
  }
  @keyframes fade-in-text {
    from { opacity:0; transform:translateY(10px); }
    to { opacity:1; transform:translateY(0); }
  }
`;document.head.appendChild(Je);async function co(n){const e=document.getElementById("overlay-layer"),o=document.getElementById("ui-layer"),t=document.getElementById("css3d-layer"),s=document.getElementById("loading-status"),i=bt(n),a=new ut;a.fog=new ht(1032,18e-7);const r=new vt(n),l=new gt,c=new je;s&&(s.textContent="Loading Universe data…");const d=await Pt();Ft(d),s&&(s.textContent="Building galaxies…"),await new Promise(m=>setTimeout(m,0));const f=new St;a.add(f.group);const p=[];for(const m of Gt()){const u=new kt(m,t);a.add(u.group),p.push(u)}s&&(s.textContent="Placing visitor stars…"),await new Promise(m=>setTimeout(m,0));const g=new Rt(t);a.add(g.group);const x=await q.loadStars();b.set("stars",x),g.setStars(x,b.get("myStarId"));let v=null;const T=Bt().find(m=>m.id==="OBJ-STREAMS");T&&(v=new Ot(T,t),a.add(v.group));const se=new Ht(o),Ze=new ft(527378,1);a.add(Ze);let L=null;function O(m){L&&(L(),L=null);const u=r.snapshot();b.pushCameraSnapshot(u),e.setAttribute("aria-hidden","false"),e.classList.add("overlay-active"),L=m(e,()=>{e.setAttribute("aria-hidden","true"),e.classList.remove("overlay-active"),L=null;const h=b.popCameraSnapshot();h&&r.restoreSnapshot(h)})}n.addEventListener("click",m=>{if(L||b.get("placementMode"))return;if(c.x=m.clientX/window.innerWidth*2-1,c.y=-(m.clientY/window.innerHeight)*2+1,l.setFromCamera(c,r.camera),v){const h=l.intersectObjects(v.clickTargets);if(h.length>0){const y=h[0].object,w=y.userData.childId,R=y.userData.objectId;if(w){const S=v.getChildData(w);if(S){const E=new M;y.getWorldPosition(E),r.flyTo({x:E.x+300,y:E.y+200,z:E.z+500},{x:E.x,y:E.y,z:E.z},{duration:900,onDone:()=>Qe(S)})}return}if(R==="OBJ-STREAMS"){const S=v.getPlanetWorldPos();r.flyTo({x:S.x+1200,y:S.y+600,z:S.z+1200},{x:S.x,y:S.y,z:S.z},{duration:1e3});return}}}const u=g.getClickTarget(l);if(u){const h=b.get("stars").find(y=>y.id===u.starId);h&&O((y,w)=>Be(y,h,w))}}),n.addEventListener("click",m=>{if(!b.get("placementMode"))return;c.x=m.clientX/window.innerWidth*2-1,c.y=-(m.clientY/window.innerHeight)*2+1,l.setFromCamera(c,r.camera);const u=new yt(new M(0,1,0),0),h=new M;if(l.ray.intersectPlane(u,h),!h)return;let y="G2020",w="G2020-R2",R=1/0;for(const S of Object.keys(k)){const[E,,G]=ve(S),Y=Math.sqrt((h.x-E)**2+(h.z-G)**2);Y<R&&(R=Y,y=S,w=`${S}-R1`)}b.set("placementMode",!1),se.setPlacementMode(!1),O((S,E)=>ro(S,{galaxyId:y,regionId:w,x:h.x,y:h.y+50,z:h.z},G=>{if(G){const Y=q.getMyStarId();Y&&q.getStarById(Y).then($=>{$&&(g.addStar($),r.flyTo({x:$.x+500,y:$.y+300,z:$.z+500},{x:$.x,y:$.y,z:$.z},{duration:1200}))})}E()}))});function Qe(m){if(!m)return;const u=m.mediaKind,h=m;if(u==="audio")O((y,w)=>Zt(y,h,w));else if(u==="video")O((y,w)=>Qt(y,h,w));else if(u==="playable"){const y={...h,mediaUrl:"/games/streams/"};O((w,R)=>eo(w,y,R))}else O((y,w)=>to(y,h,w))}window.addEventListener("universe-start-placement",()=>{se.setPlacementMode(!0),et()});function et(){const m=document.createElement("div");m.id="placement-hint",m.style.cssText=`
      position:absolute;bottom:100px;left:50%;transform:translateX(-50%);
      background:rgba(0,4,12,0.85);
      border:1px solid rgba(80,160,255,0.25);
      border-radius:8px;padding:10px 20px;
      font-family:'Space Mono',monospace;font-size:0.65rem;letter-spacing:0.12em;
      color:#4080c0;text-transform:uppercase;
      pointer-events:none;z-index:60;
      animation:fade-in-text 0.3s ease;
    `,m.textContent="Click anywhere in the Universe to place your star",o.appendChild(m);const u=document.createElement("button");u.type="button",u.textContent="CANCEL",u.style.cssText=`
      position:absolute;bottom:60px;left:50%;transform:translateX(-50%);
      background:rgba(40,0,0,0.6);border:1px solid rgba(180,60,60,0.3);
      border-radius:4px;padding:6px 14px;
      font-family:'Space Grotesk',sans-serif;font-size:0.7rem;letter-spacing:0.1em;
      color:#b06060;cursor:pointer;z-index:60;text-transform:uppercase;
    `,u.addEventListener("click",()=>{b.set("placementMode",!1),se.setPlacementMode(!1),m.remove(),u.remove()}),o.appendChild(u);const h=b.subscribe("placementMode",y=>{y||(m.remove(),u.remove(),h())})}re.init(),re.on(async m=>{if(m.type==="star"&&m.starId){const u=await q.getStarById(m.starId);u&&await io(e,u,()=>{r.flyTo({x:u.x+800,y:u.y+400,z:u.z+800},{x:u.x,y:u.y,z:u.z},{duration:3e3,onDone:()=>{O((h,y)=>Be(h,u,y))}})})}if(m.type==="galaxy"&&m.galaxyId){const[u,h,y]=ve(m.galaxyId);r.flyTo({x:u+8e3,y:h+3e3,z:y+8e3},{x:u,y:h,z:y},{duration:1800}),b.set("currentGalaxyId",m.galaxyId)}m.type==="universe"&&r.flyTo({x:55e3,y:12e3,z:35e3},{x:55e3,y:0,z:0},{duration:1400})}),window.addEventListener("universe-esc",()=>{if(L){L();return}re.back()});let ne=0;xt(m=>{ne+=m,r.update(m);const u=r.camera.position;let h=null,y=1/0;for(const[w,R]of Object.entries(k)){const[S,,E]=R.worldOffset,G=Math.sqrt((u.x-S)**2+(u.z-E)**2);G<y&&(y=G,h=w)}h!==b.get("currentGalaxyId")&&b.set("currentGalaxyId",h),f.update(ne);for(const w of p)w.update(ne),w.updateLabels(r.camera,i,u);v?.update(m,r.camera,i),g.update(u,r.camera,i),i.render(a,r.camera)}),b.set("loaded",!0);const J=document.getElementById("loading-screen");J&&(J.style.transition="opacity 0.8s",J.style.opacity="0",setTimeout(()=>J.remove(),800))}async function po(){const n=document.getElementById("universe-canvas");if(!n)throw new Error("No canvas element found");try{await co(n)}catch(e){if(console.error("[2Fly Universe] Fatal init error:",e),document.getElementById("loading-screen")){const t=document.getElementById("loading-status");t&&(t.textContent="Universe failed to initialize. Please refresh.",t.style.color="#f06060")}}}po();
