import{W as Et,S as ut,A as Ct,V as w,a as mt,b as Tt,P as It,M as Te,G as K,B as ce,C as A,c as G,d as Q,e as q,f as de,g as ht,T as At,h as _t,i as kt,j as Me,R as me,k as H,D as he,l as R,O as Rt,m as U,I as et,n as tt,o as O,p as Se,q as pe,r as We,s as ue,t as zt,u as Lt,F as Ot,v as Pt,w as Dt,x as $t}from"./three-B6iN8XL-.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerPolicy&&(n.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?n.credentials="include":s.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(s){if(s.ep)return;s.ep=!0;const n=t(s);fetch(s.href,n)}})();let P=null,He=!1,$e=null,Ne=0,Ge=!1;function Nt(o){const e=Math.min(window.devicePixelRatio,2);return P=new Et({canvas:o,antialias:e<2,alpha:!1,powerPreference:"high-performance",stencil:!1,depth:!0}),P.setPixelRatio(e),P.setSize(o.clientWidth,o.clientHeight,!1),P.outputColorSpace=ut,P.toneMapping=Ct,P.toneMappingExposure=1.1,P.shadowMap.enabled=!1,new ResizeObserver(i=>{const s=i[0];if(!s||!P)return;const{width:n,height:a}=s.contentRect,r=Math.min(window.devicePixelRatio,2);P.setSize(n,a,!1),P.setPixelRatio(r),window.dispatchEvent(new CustomEvent("universe-resize",{detail:{width:n,height:a}}))}).observe(o),document.addEventListener("visibilitychange",()=>{Ge=document.hidden,!Ge&&He&&Ye()}),P}function Gt(o){$e=o,He=!0,Ne=performance.now(),Ye()}function Ye(){if(!He||Ge)return;requestAnimationFrame(Ye);const o=performance.now(),e=Math.min((o-Ne)/1e3,.05);Ne=o,$e&&$e(e)}const z={G2025:{id:"G2025",title:"2025–2029",primaryColor:3201168,accentColor:6356944,nebulaColor:538656,dustColor:269328,starTint:10551256,worldOffset:[4800,800,-2e3],scale:1.3,texturePath:"assets/galaxies/galaxy_2025_2029.png",status:"showcase"},G2020:{id:"G2020",title:"2020–2024",primaryColor:2652360,accentColor:5286128,nebulaColor:532544,dustColor:266270,starTint:11065599,worldOffset:[32800,14e3,8400],scale:1,texturePath:"assets/galaxies/galaxy_2020_2024.png",status:"known"},G2015:{id:"G2015",title:"2015–2019",primaryColor:6308032,accentColor:9461992,nebulaColor:2099280,dustColor:1049640,starTint:13674751,worldOffset:[28800,-12e3,-11200],scale:.95,texturePath:"assets/galaxies/galaxy_2015_2019.png",status:"known"},G2010:{id:"G2010",title:"2010–2014",primaryColor:1751224,accentColor:4251856,nebulaColor:671808,dustColor:530464,starTint:10551264,worldOffset:[-4800,20800,-30400],scale:.9,texturePath:"assets/galaxies/galaxy_2010_2014.png",status:"known"},G2005:{id:"G2005",title:"2005–2009",primaryColor:12869674,accentColor:14710848,nebulaColor:9052224,dustColor:4001808,starTint:16760960,worldOffset:[-26e3,-13200,7200],scale:.85,texturePath:"assets/galaxies/galaxy_2005_2009.png",status:"known"},G2000:{id:"G2000",title:"2000–2004",primaryColor:12877098,accentColor:15247434,nebulaColor:8007696,dustColor:4004360,starTint:16769184,worldOffset:[-36e3,9600,-2e4],scale:.8,texturePath:"assets/galaxies/galaxy_2000_2004.png",status:"known"},G2030:{id:"G2030",title:"2030–2034 UNCHARTED",primaryColor:4214896,accentColor:6320272,nebulaColor:1054760,dustColor:527380,starTint:8429760,worldOffset:[7200,-24800,-36e3],scale:.75,texturePath:"assets/galaxies/galaxy_2030_2034.png",status:"uncharted"}},be={position:[0,22e3,58e3],target:[0,0,0]},Ue=[[-4500,0,-2500],[0,0,4e3],[5e3,0,-2e3]],Ut=180,Bt=4500,Ft=400,Ie=window.matchMedia("(prefers-reduced-motion: reduce)").matches,jt=6e3;class Vt{camera;target=new w;fly=null;historyStack=[];isDragging=!1;prevMouse=new mt;spherical=new Tt;tmpVec=new w;velTheta=0;velPhi=0;velRadius=0;DAMPING=.11;lastUserActivity=performance.now();isIdleDrifting=!1;driftTime=0;constructor(e){this.camera=new It(55,window.innerWidth/window.innerHeight,10,2e6);const[t,i,s]=be.position,[n,a,r]=be.target;this.camera.position.set(t,i,s),this.target.set(n,a,r),this.camera.lookAt(this.target),this.tmpVec.subVectors(this.camera.position,this.target),this.spherical.setFromVector3(this.tmpVec),this._bindEvents(e),window.addEventListener("universe-resize",l=>{const c=l;this.camera.aspect=c.detail.width/c.detail.height,this.camera.updateProjectionMatrix()})}_onActivity(){this.lastUserActivity=performance.now(),this.isIdleDrifting&&(this.isIdleDrifting=!1)}_bindEvents(e){const t=()=>this._onActivity();window.addEventListener("pointermove",t,{passive:!0}),window.addEventListener("wheel",t,{passive:!0}),window.addEventListener("keydown",t,{passive:!0}),window.addEventListener("touchstart",t,{passive:!0}),e.addEventListener("mousedown",n=>{this._onActivity(),this.isDragging=!0,this.prevMouse.set(n.clientX,n.clientY)}),e.addEventListener("mousemove",n=>{if(!this.isDragging)return;this._onActivity();const a=n.clientX-this.prevMouse.x,r=n.clientY-this.prevMouse.y;this._orbit(a*.002,r*.002),this.prevMouse.set(n.clientX,n.clientY)}),window.addEventListener("mouseup",()=>{this.isDragging=!1}),e.addEventListener("wheel",n=>this._onWheel(n),{passive:!1}),e.addEventListener("dblclick",n=>this._onDblClick(n));let i=0,s=[];e.addEventListener("touchstart",n=>{this._onActivity(),s=Array.from(n.touches),s.length===1?(this.isDragging=!0,this.prevMouse.set(s[0].clientX,s[0].clientY)):s.length===2&&(this.isDragging=!1,i=it(s))},{passive:!0}),e.addEventListener("touchmove",n=>{if(this._onActivity(),s=Array.from(n.touches),s.length===1&&this.isDragging){const a=s[0].clientX-this.prevMouse.x,r=s[0].clientY-this.prevMouse.y;this._orbit(a*.003,r*.0025),this.prevMouse.set(s[0].clientX,s[0].clientY)}else if(s.length===2){const a=it(s),r=i-a;this._zoom(r*.004),i=a}},{passive:!0}),e.addEventListener("touchend",()=>{this.isDragging=!1}),window.addEventListener("keydown",n=>{n.key==="Escape"&&window.dispatchEvent(new CustomEvent("universe-esc"))})}_orbit(e,t){this.velTheta-=e,this.velPhi-=t}_onWheel(e){e.preventDefault(),this._onActivity();const t=e.deltaY*.0005;this._zoom(t)}_zoom(e){this.velRadius+=e*this.spherical.radius*.14}_onDblClick(e){this._onActivity(),this.velRadius-=this.spherical.radius*.18}update(e){if(this.fly){this._updateFly(e);return}const t=performance.now();!Ie&&!this.isDragging&&t-this.lastUserActivity>jt&&(this.isIdleDrifting=!0),this.isIdleDrifting?(this.driftTime+=e,this.spherical.theta+=e*.015,this.spherical.phi=Te.clamp(this.spherical.phi+Math.sin(this.driftTime*.2)*2e-4,.05,Math.PI-.05)):(this.spherical.theta+=this.velTheta,this.spherical.phi=Te.clamp(this.spherical.phi+this.velPhi,.05,Math.PI-.05),this.spherical.radius=Te.clamp(this.spherical.radius+this.velRadius,150,32e4),this.velTheta*=1-this.DAMPING,this.velPhi*=1-this.DAMPING,this.velRadius*=1-this.DAMPING),this.tmpVec.setFromSpherical(this.spherical).add(this.target),this.camera.position.copy(this.tmpVec),this.camera.lookAt(this.target)}_updateFly(e){if(!this.fly)return;const t=16;this.fly.elapsed+=t;const i=Ie?1:Math.min(this.fly.elapsed/this.fly.duration,1),s=Wt(i);if(this.camera.position.lerpVectors(this.fly.startPos,this.fly.endPos,s),this.target.lerpVectors(this.fly.startTarget,this.fly.endTarget,s),this.camera.lookAt(this.target),i>=1){const n=this.fly.onDone;this.fly=null,this.tmpVec.subVectors(this.camera.position,this.target),this.spherical.setFromVector3(this.tmpVec),this.velTheta=0,this.velPhi=0,this.velRadius=0,n?.()}}flyTo(e,t,i={}){i.saveHistory&&this.historyStack.push(this.snapshot());const s=Ie?200:i.duration??1100;this.fly={startPos:this.camera.position.clone(),startTarget:this.target.clone(),endPos:new w(e.x,e.y,e.z),endTarget:new w(t.x,t.y,t.z),elapsed:0,duration:s,onDone:i.onDone}}travelToObject(e,t=1200,i={}){const s=new w(t*.7,t*.45,t*.7),n={x:e.x+s.x,y:e.y+s.y,z:e.z+s.z};this.flyTo(n,e,{duration:1200,saveHistory:!0,...i})}resetToHome(e={}){const[t,i,s]=be.position,[n,a,r]=be.target;this.flyTo({x:t,y:i,z:s},{x:n,y:a,z:r},{duration:1400,saveHistory:!0,...e})}returnToPrevious(e={}){const t=this.historyStack.pop();return t?(this.restoreSnapshot(t,!0),!0):!1}hasHistory(){return this.historyStack.length>0}snapshot(){return{position:[this.camera.position.x,this.camera.position.y,this.camera.position.z],target:[this.target.x,this.target.y,this.target.z],zoom:this.spherical.radius}}restoreSnapshot(e,t=!0){const i={x:e.position[0],y:e.position[1],z:e.position[2]},s={x:e.target[0],y:e.target[1],z:e.target[2]};t?this.flyTo(i,s,{duration:800}):(this.camera.position.set(i.x,i.y,i.z),this.target.set(s.x,s.y,s.z),this.camera.lookAt(this.target),this.tmpVec.subVectors(this.camera.position,this.target),this.spherical.setFromVector3(this.tmpVec))}getTarget(){return this.target.clone()}getRadius(){return this.spherical.radius}isBusy(){return this.fly!==null}}function Wt(o){return o<.5?4*o*o*o:1-Math.pow(-2*o+2,3)/2}function it(o){const e=o[1].clientX-o[0].clientX,t=o[1].clientY-o[0].clientY;return Math.sqrt(e*e+t*t)}const ve=6e4;class Ht{group;starsMesh;dustMesh;constructor(){this.group=new K,this._buildStarfield(),this._buildDust()}_buildStarfield(){const e=new ce,t=new Float32Array(ve*3),i=new Float32Array(ve*3),s=new Float32Array(ve),n=6e5,a=[new A(16774632),new A(15266047),new A(16769200),new A(11589887),new A(16765136)];for(let l=0;l<ve;l++){const c=l*3,p=Math.random()*Math.PI*2,m=Math.pow(Math.random(),.5)*n,d=(Math.random()-.5)*n*.35;t[c]=Math.cos(p)*m,t[c+1]=d,t[c+2]=Math.sin(p)*m;const g=a[Math.floor(Math.random()*a.length)];i[c]=g.r,i[c+1]=g.g,i[c+2]=g.b,s[l]=.5+Math.random()*2.5}e.setAttribute("position",new G(t,3)),e.setAttribute("color",new G(i,3)),e.setAttribute("size",new G(s,1));const r=new Q({uniforms:{time:{value:0}},vertexShader:`
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
      `,transparent:!0,depthWrite:!1,blending:q});this.starsMesh=new de(e,r),this.starsMesh.renderOrder=-10,this.group.add(this.starsMesh)}_buildDust(){const t=new ce,i=new Float32Array(1e4*3),s=25e4;for(let a=0;a<1e4;a++){const r=a*3;i[r]=(Math.random()-.5)*s,i[r+1]=(Math.random()-.5)*s*.2,i[r+2]=(Math.random()-.5)*s}t.setAttribute("position",new G(i,3));const n=new ht({color:3491944,size:90,transparent:!0,opacity:.05,depthWrite:!1,blending:q});this.dustMesh=new de(t,n),this.dustMesh.renderOrder=-9,this.group.add(this.dustMesh)}update(e){const t=this.starsMesh.material;t.uniforms.time.value=e,this.dustMesh.position.y=Math.sin(e*.03)*150}dispose(){this.starsMesh.geometry.dispose(),this.starsMesh.material.dispose(),this.dustMesh.geometry.dispose(),this.dustMesh.material.dispose()}}const Yt=new At,qt=3e4,Kt=15e4,Xt=6e3,Jt=22e3;class Zt{constructor(e,t){this.data=e,this.group=new K,this.labelContainer=t;const i=z[e.id];if(!i)return;const[s,n,a]=i.worldOffset;this.group.position.set(s,n,a),this.group.scale.setScalar(i.scale??1),this._buildSprite(i),this._buildCore(i),this._buildRegionMarkers(i),this._buildLabel(),this._buildRegionLabels()}group;labelEls=[];labelContainer;orbitRings=[];galaxySprite;galaxyLight;_buildSprite(e){Yt.load(e.texturePath,t=>{t.colorSpace=ut;const i=new _t({map:t,transparent:!0,opacity:e.status==="uncharted"?.22:.48,blending:q,depthWrite:!1}),s=new kt(i),n=e.status==="showcase"?14e3:1e4;s.scale.set(n,n,1),s.position.set(0,0,0),s.renderOrder=-5,this.group.add(s),this.galaxySprite=s},void 0,()=>{})}_buildCore(e){const t=e.status==="showcase",i=e.status==="uncharted",s=t?2400:i?600:1200,n=new ce,a=new Float32Array(s*3),r=new Float32Array(s),l=t?9e3:7e3;for(let d=0;d<s;d++){const g=Math.random()*Math.PI*2,b=Math.pow(Math.random(),1.4)*l,v=(Math.random()-.5)*900;a[d*3]=Math.cos(g)*b,a[d*3+1]=v,a[d*3+2]=Math.sin(g)*b,r[d]=(t?25:16)+Math.random()*80}n.setAttribute("position",new G(a,3)),n.setAttribute("size",new G(r,1));const c=new A(e.primaryColor),p=new Q({uniforms:{color:{value:c},time:{value:0}},vertexShader:`
        attribute float size;
        uniform float time;
        varying float vAlpha;
        void main() {
          vAlpha = 0.35 + 0.25 * sin(time * 0.5 + position.x * 0.002);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = size * (550.0 / -mv.z);
          gl_PointSize = clamp(gl_PointSize, 0.5, 14.0);
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
      `,transparent:!0,depthWrite:!1,blending:q}),m=new de(n,p);this.group.add(m),this.galaxyLight=new Me(e.primaryColor,t?1.4:.6,25e3),this.galaxyLight.position.set(0,0,0),this.group.add(this.galaxyLight)}_buildRegionMarkers(e){for(const t of Ue){const i=new me(650,720,64),s=new H({color:e.accentColor,transparent:!0,opacity:.15,side:he,depthWrite:!1}),n=new R(i,s);n.position.set(t[0],t[1],t[2]),n.rotation.x=-Math.PI/2,this.orbitRings.push(n),this.group.add(n)}}_buildLabel(){const e=z[this.data.id],t=e?.status==="showcase",i=e?.status==="uncharted",s=document.createElement("div");s.className="universe-label galaxy-label",s.dataset.galaxyId=this.data.id,s.innerHTML=`
      <span class="label-era" style="${t?"color:#60ffd0;font-weight:bold;":i?"color:#6080a0;":""}">
        ${t?"✦ ":""}${this.data.title}${i?" — UNCHARTED":""}
      </span>
    `,s.style.cssText=`
      position:absolute; top:0; left:0;
      pointer-events:none;
      font-family:'Space Mono',monospace;
      font-size:clamp(10px,1.3vw,14px);
      letter-spacing:0.18em;
      text-transform:uppercase;
      color:rgba(200,220,255,0);
      white-space:nowrap;
      transform:translate(-50%,-50%);
      transition:color 0.3s;
      user-select:none;
    `,this.labelContainer.appendChild(s);const n=new w(0,1800,0);this.labelEls.push({el:s,pos:n,kind:"galaxy"})}_buildRegionLabels(){const e=this.data.regions;for(let t=0;t<e.length;t++){const i=e[t],s=Ue[t]??[0,0,0],n=document.createElement("div");n.className="universe-label region-label",n.dataset.regionId=i.id,n.innerHTML=`
        <span style="font-weight:600;color:#c0e0ff;">${i.title}</span>
        ${i.subtitle?`<br/><span style="font-size:0.8em;opacity:0.7;font-weight:normal;">${i.subtitle}</span>`:""}
      `,n.style.cssText=`
        position:absolute; top:0; left:0;
        pointer-events:none;
        font-family:'Space Grotesk',sans-serif;
        font-size:clamp(8px,0.95vw,11px);
        letter-spacing:0.12em;
        text-transform:uppercase;
        color:rgba(180,200,240,0);
        white-space:nowrap;
        transform:translate(-50%,-50%);
        transition:color 0.3s;
        user-select:none;
        text-align:center;
      `,this.labelContainer.appendChild(n);const a=new w(s[0],s[1]+750,s[2]);this.labelEls.push({el:n,pos:a,kind:"region"})}}updateLabels(e,t,i){const{width:s,height:n}=t.domElement.getBoundingClientRect();for(const{el:a,pos:r,kind:l}of this.labelEls){const c=new w().copy(r);this.group.localToWorld(c);const p=i.distanceTo(c);let m=0;l==="galaxy"?m=st(p,Kt,qt):m=st(p,Jt,Xt);const d=c.clone().project(e),g=(d.x*.5+.5)*s,b=(-(d.y*.5)+.5)*n;d.z>1||m<.02?(a.style.opacity="0",a.style.pointerEvents="none"):(a.style.opacity=String(m),a.style.left=`${g}px`,a.style.top=`${b}px`)}}update(e){this.galaxySprite&&(this.galaxySprite.rotation.z=e*.015);for(const t of this.orbitRings){const i=t.material;i.opacity=.1+.08*Math.sin(e*.5)}}dispose(){for(const{el:e}of this.labelEls)e.remove();this.galaxySprite?.material.dispose()}}function st(o,e,t){return o>=e?0:o<=t?1:1-(o-t)/(e-t)}const Qt=3e3,ei=6e4;class ti{group;instancedFar;instancedMid;nearMeshes=new Map;stars=[];dummy=new Rt;labelContainer;labelEls=new Map;myStarId=null;constructor(e){this.group=new K,this.labelContainer=e,this._buildFarInstanced(),this._buildMidInstanced()}_buildFarInstanced(){const e=new U(30,4,4),t=new H({color:16777215,transparent:!0,opacity:.7});this.instancedFar=new et(e,t,25e3),this.instancedFar.instanceMatrix.setUsage(tt),this.instancedFar.count=0,this.group.add(this.instancedFar)}_buildMidInstanced(){const e=new U(60,6,6),t=new H({color:16777215});this.instancedMid=new et(e,t,25e3),this.instancedMid.instanceMatrix.setUsage(tt),this.instancedMid.count=0,this.instancedMid.visible=!1,this.group.add(this.instancedMid)}setStars(e,t=null){this.stars=e,this.myStarId=t,this._rebuildFar()}_rebuildFar(){const e=new A;let t=0;for(const i of this.stars){if(t>=25e3)break;this.dummy.position.set(i.x,i.y,i.z),this.dummy.scale.setScalar(i.id===this.myStarId?1.8:1),this.dummy.updateMatrix(),this.instancedFar.setMatrixAt(t,this.dummy.matrix);const s=z[i.galaxyId],n=s?new A(s.starTint):e.set(16777215);i.id===this.myStarId&&n.setHex(16766720),this.instancedFar.setColorAt(t,n),t++}this.instancedFar.count=t,this.instancedFar.instanceMatrix.needsUpdate=!0,this.instancedFar.instanceColor&&(this.instancedFar.instanceColor.needsUpdate=!0)}update(e,t,i){const{width:s,height:n}=i.domElement.getBoundingClientRect(),a=e.length();this.instancedFar.visible=!0,this.instancedMid.visible=!1;for(const r of this.stars){const l=new w(r.x,r.y,r.z),c=e.distanceTo(l);c<Qt?(this._ensureNearMesh(r),this._updateLabel(r,l,t,s,n,c)):(this._removeNearMesh(r.id),this._updateLabel(r,l,t,s,n,c))}a<3e4||e.distanceTo(this.group.position)<ei}_ensureNearMesh(e){if(this.nearMeshes.has(e.id))return;const t=new U(80,12,12),i=z[e.galaxyId],s=i?i.starTint:16777215,n=new O({color:s,emissive:s,emissiveIntensity:.6,roughness:.1,metalness:.4}),a=new R(t,n);a.position.set(e.x,e.y,e.z),a.userData.starId=e.id,this.group.add(a),this.nearMeshes.set(e.id,a)}_removeNearMesh(e){const t=this.nearMeshes.get(e);t&&(this.group.remove(t),t.material.dispose(),t.geometry.dispose(),this.nearMeshes.delete(e))}_updateLabel(e,t,i,s,n,a){const c=1-Math.min(1,Math.max(0,(a-1200)/2800));if(c<.02){const b=this.labelEls.get(e.id);b&&(b.style.opacity="0");return}let p=this.labelEls.get(e.id);p||(p=document.createElement("div"),p.className="universe-label star-label",p.style.cssText=`
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
      `,p.textContent=e.displayName,this.labelContainer.appendChild(p),this.labelEls.set(e.id,p));const m=t.clone().project(i),d=(m.x*.5+.5)*s,g=(-(m.y*.5)+.5)*n;m.z>1?p.style.opacity="0":(p.style.opacity=String(c),p.style.left=`${d}px`,p.style.top=`${g}px`)}getClickTarget(e){const t=Array.from(this.nearMeshes.values()),i=e.intersectObjects(t);if(i.length>0){const n=i[0].object.userData.starId;return n?{starId:n}:null}const s=e.intersectObject(this.instancedFar);if(s.length>0&&s[0].instanceId!==void 0){const n=this.stars[s[0].instanceId];return n?{starId:n.id}:null}return null}addStar(e){this.stars.push(e),this._rebuildFar()}dispose(){for(const[,e]of this.labelEls)e.remove();this.instancedFar.dispose(),this.instancedMid.dispose();for(const[,e]of this.nearMeshes)e.geometry.dispose(),e.material.dispose()}}const nt=[800,1300,1900,2600],ii=[.35,.22,.14,.09];class si{group;planetMesh;children=[];labelContainer;time=0;objectData;onObjectClick=null;clickTargets=[];constructor(e,t){this.objectData=e,this.labelContainer=t,this.group=new K,this.group.position.set(e.position.x,e.position.y,e.position.z);const i=z.G2020;i&&(this.group.position.x+=i.worldOffset[0],this.group.position.z+=i.worldOffset[2]),this._buildPlanet(),this._buildOrbitRings(),this._buildChildren()}_buildPlanet(){const e=new U(420,48,48),t=new Q({uniforms:{time:{value:0},deepColor:{value:new A(268328)},shallowColor:{value:new A(673904)},rimColor:{value:new A(2150608)}},vertexShader:`
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
      `,transparent:!1});this.planetMesh=new R(e,t),this.planetMesh.userData.objectId=this.objectData.id,this.group.add(this.planetMesh),this.clickTargets.push(this.planetMesh);const i=new Me(2138320,1.2,5e3);this.group.add(i)}_buildOrbitRings(){for(const e of nt){const t=new me(e-4,e+4,96),i=new H({color:1720416,transparent:!0,opacity:.25,side:he,depthWrite:!1}),s=new R(t,i);s.rotation.x=-Math.PI/2,this.group.add(s)}}_buildChildren(){const e=this.objectData.children??[],t={audio:"♪",video:"▶",playable:"⚡",archive:"◈"},i={audio:16765056,video:16744544,playable:8454016,archive:12632319};for(let s=0;s<e.length;s++){const n=e[s],a=nt[s]??800+s*500,r=ii[s]??.08,l=s/e.length*Math.PI*2,c=(s%2===0?1:-1)*(s*60),p=n.mediaKind??"archive",m=i[p]??16777215;let d;p==="playable"?d=new Se(90,1):p==="audio"?d=new pe(60,22,12,40):p==="video"?d=new We(0,80,160,8):d=new ue(70,0);const g=new O({color:m,emissive:m,emissiveIntensity:.3,roughness:.3,metalness:.6}),b=new R(d,g);b.position.set(Math.cos(l)*a,c,Math.sin(l)*a),b.userData.childId=n.id,b.userData.contentStatus=n.contentStatus,this.group.add(b),this.clickTargets.push(b);const v=document.createElement("div");v.className="universe-label streams-child-label",v.style.cssText=`
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
      `,v.innerHTML=`<span>${t[p]??"○"}</span><br/><span>${n.title}</span>`,this.labelContainer.appendChild(v),this.children.push({id:n.id,title:n.title,mediaKind:p,contentStatus:n.contentStatus??"awaiting-source",mesh:b,orbitRadius:a,orbitSpeed:r,orbitAngle:l,orbitY:c,labelEl:v})}}update(e,t,i){this.time+=e;const s=this.planetMesh.material;s.uniforms.time.value=this.time,this.planetMesh.rotation.y+=e*.06;for(const n of this.children)n.orbitAngle+=e*n.orbitSpeed,n.mesh.position.set(Math.cos(n.orbitAngle)*n.orbitRadius,n.orbitY,Math.sin(n.orbitAngle)*n.orbitRadius),n.mesh.rotation.y+=e*.5,n.mesh.rotation.x+=e*.3;this._updateLabels(t,i)}_updateLabels(e,t){const{width:i,height:s}=t.domElement.getBoundingClientRect(),n=new w;e.getWorldPosition(n);for(const a of this.children){const r=new w;a.mesh.getWorldPosition(r);const l=n.distanceTo(r),c=800,m=1-Math.min(1,Math.max(0,(l-c)/(3500-c))),d=r.clone().project(e),g=(d.x*.5+.5)*i,b=(-(d.y*.5)+.5)*s;d.z>1||m<.02?a.labelEl.style.opacity="0":(a.labelEl.style.opacity=String(m),a.labelEl.style.left=`${g}px`,a.labelEl.style.top=`${b}px`)}}getChildData(e){return this.children.find(t=>t.id===e)}getPlanetWorldPos(){const e=new w;return this.planetMesh.getWorldPosition(e),e}dispose(){for(const e of this.children)e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.labelEl.remove();this.planetMesh.geometry.dispose(),this.planetMesh.material.dispose()}}class ni{group;planetMesh;emberParticles;children=[];labelContainer;time=0;objectData;clickTargets=[];constructor(e,t){this.objectData=e,this.labelContainer=t,this.group=new K;const[i,s,n]=z.G2025?.worldOffset??[0,0,0];this.group.position.set(i+e.position.x,s+e.position.y,n+e.position.z),this._buildMoltenPlanet(),this._buildEmbers(),this._buildOrbitRings(),this._buildChildren()}_buildMoltenPlanet(){const e=new U(450,48,48),t=new Q({uniforms:{time:{value:0},crustColor:{value:new A(1574918)},moltenColor:{value:new A(14965544)},emberGlow:{value:new A(16750848)}},vertexShader:`
        varying vec3 vNormal;
        varying vec3 vPos;
        uniform float time;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPos = position;
          vec3 displaced = position + normal * (
            18.0 * sin(position.y * 0.007 + time * 1.5) *
            cos(position.z * 0.009 + time * 1.1)
          );
          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        }
      `,fragmentShader:`
        uniform vec3 crustColor;
        uniform vec3 moltenColor;
        uniform vec3 emberGlow;
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vPos;
        void main() {
          vec3 viewDir = normalize(cameraPosition - vPos);
          float rim = 1.0 - max(0.0, dot(vNormal, viewDir));
          rim = pow(rim, 2.5);
          float heat = 0.5 + 0.5 * sin(vPos.x * 0.01 + vPos.y * 0.008 + time * 1.2);
          heat *= smoothstep(0.2, 0.8, sin(vPos.z * 0.012 + time * 0.7));
          vec3 base = mix(crustColor, moltenColor, heat);
          vec3 final = mix(base, emberGlow, rim * 0.85);
          gl_FragColor = vec4(final, 1.0);
        }
      `});this.planetMesh=new R(e,t),this.planetMesh.userData.objectId=this.objectData.id,this.group.add(this.planetMesh),this.clickTargets.push(this.planetMesh);const i=new Me(14965544,1.5,6e3);this.group.add(i)}_buildEmbers(){const t=new ce,i=new Float32Array(600*3),s=new Float32Array(600);for(let a=0;a<600;a++){const r=Math.random()*Math.PI*2,l=Math.acos(Math.random()*2-1),c=470+Math.random()*350;i[a*3]=c*Math.sin(l)*Math.cos(r),i[a*3+1]=c*Math.sin(l)*Math.sin(r),i[a*3+2]=c*Math.cos(l),s[a]=4+Math.random()*12}t.setAttribute("position",new G(i,3)),t.setAttribute("size",new G(s,1));const n=new Q({uniforms:{time:{value:0}},vertexShader:`
        attribute float size;
        uniform float time;
        varying float vAlpha;
        void main() {
          vec3 p = position;
          p.y += sin(time * 2.0 + position.x * 0.01) * 30.0;
          vAlpha = 0.4 + 0.4 * sin(time * 3.0 + position.z * 0.02);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = size * (350.0 / -mv.z);
        }
      `,fragmentShader:`
        varying float vAlpha;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          if (length(uv) > 0.5) discard;
          gl_FragColor = vec4(1.0, 0.45, 0.15, vAlpha);
        }
      `,transparent:!0,depthWrite:!1,blending:q});this.emberParticles=new de(t,n),this.group.add(this.emberParticles)}_buildOrbitRings(){const e=[900,1500,2200];for(const t of e){const i=new me(t-5,t+5,64),s=new H({color:14965544,transparent:!0,opacity:.2,side:he,depthWrite:!1}),n=new R(i,s);n.rotation.x=-Math.PI/2,this.group.add(n)}}_buildChildren(){const e=this.objectData.children??[],t=[900,1500,2200,2900],i=[.3,.2,.14,.09];for(let s=0;s<e.length;s++){const n=e[s],a=t[s]??1e3+s*600,r=i[s]??.1,l=s/e.length*Math.PI*2,c=n.mediaKind??"archive";let p,m;c==="playable"?(p=new ue(95,1),m=new O({color:16737826,emissive:16729088,emissiveIntensity:.5,roughness:.2,metalness:.8})):c==="audio"?(p=new pe(65,24,12,36),m=new O({color:16755268,emissive:16737792,emissiveIntensity:.3})):c==="video"?(p=new We(0,85,170,8),m=new O({color:16729139,emissive:13378065,emissiveIntensity:.3})):(p=new Se(75,0),m=new O({color:13399893,roughness:.4}));const d=new R(p,m);d.position.set(Math.cos(l)*a,0,Math.sin(l)*a),d.userData.childId=n.id,d.userData.contentStatus=n.contentStatus,this.group.add(d),this.clickTargets.push(d);const g=document.createElement("div");g.className="universe-label fire-child-label",g.style.cssText=`
        position:absolute;top:0;left:0;pointer-events:none;
        font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,0.9vw,11px);
        letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,200,180,0);
        white-space:nowrap;transform:translate(-50%,-130%);transition:color 0.3s;
        user-select:none;text-align:center;line-height:1.4;
      `;const b=c==="playable"?"◇ SATELLITE":c==="audio"?"♪ AUDIO":c==="video"?"▶ VIDEO":"◐ ARCHIVE";g.innerHTML=`<span>${b}</span><br/><span>${n.title}</span>`,this.labelContainer.appendChild(g),this.children.push({id:n.id,title:n.title,mediaKind:c,contentStatus:n.contentStatus??"live",mesh:d,orbitRadius:a,orbitSpeed:r,orbitAngle:l,labelEl:g})}}update(e,t,i){this.time+=e;const s=this.planetMesh.material;s.uniforms.time.value=this.time,this.planetMesh.rotation.y+=e*.05;const n=this.emberParticles.material;n.uniforms.time.value=this.time;for(const a of this.children)a.orbitAngle+=e*a.orbitSpeed,a.mesh.position.set(Math.cos(a.orbitAngle)*a.orbitRadius,Math.sin(this.time*.5+a.orbitRadius)*40,Math.sin(a.orbitAngle)*a.orbitRadius),a.mesh.rotation.y+=e*.6;this._updateLabels(t,i)}_updateLabels(e,t){const{width:i,height:s}=t.domElement.getBoundingClientRect(),n=new w;e.getWorldPosition(n);for(const a of this.children){const r=new w;a.mesh.getWorldPosition(r);const l=n.distanceTo(r),c=900,m=1-Math.min(1,Math.max(0,(l-c)/(3800-c))),d=r.clone().project(e),g=(d.x*.5+.5)*i,b=(-(d.y*.5)+.5)*s;d.z>1||m<.02?a.labelEl.style.opacity="0":(a.labelEl.style.opacity=String(m),a.labelEl.style.left=`${g}px`,a.labelEl.style.top=`${b}px`)}}getChildData(e){return this.children.find(t=>t.id===e)}getPlanetWorldPos(){const e=new w;return this.planetMesh.getWorldPosition(e),e}dispose(){for(const e of this.children)e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.labelEl.remove();this.planetMesh.geometry.dispose(),this.planetMesh.material.dispose()}}class oi{group;planetMesh;cloudMesh;birdParticles;children=[];labelContainer;time=0;objectData;clickTargets=[];constructor(e,t){this.objectData=e,this.labelContainer=t,this.group=new K;const[i,s,n]=z.G2025?.worldOffset??[0,0,0];this.group.position.set(i+e.position.x,s+e.position.y,n+e.position.z),this._buildSunrisePlanet(),this._buildClouds(),this._buildBirdParticles(),this._buildOrbitRings(),this._buildChildren()}_buildSunrisePlanet(){const e=new U(460,48,48),t=new Q({uniforms:{time:{value:0},goldColor:{value:new A(13732918)},earthColor:{value:new A(2823945)},greenTone:{value:new A(3829824)},sunRay:{value:new A(16769184)}},vertexShader:`
        varying vec3 vNormal;
        varying vec3 vPos;
        uniform float time;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPos = position;
          vec3 displaced = position + normal * (
            14.0 * sin(position.y * 0.008 + time * 0.8) *
            cos(position.x * 0.006 + time * 0.6)
          );
          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        }
      `,fragmentShader:`
        uniform vec3 goldColor;
        uniform vec3 earthColor;
        uniform vec3 greenTone;
        uniform vec3 sunRay;
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vPos;
        void main() {
          vec3 viewDir = normalize(cameraPosition - vPos);
          float rim = 1.0 - max(0.0, dot(vNormal, viewDir));
          rim = pow(rim, 2.2);
          float elevation = 0.5 + 0.5 * sin(vPos.y * 0.008 + vPos.x * 0.006 + time * 0.4);
          vec3 terrain = mix(earthColor, greenTone, smoothstep(0.3, 0.7, elevation));
          vec3 base = mix(terrain, goldColor, 0.4);
          vec3 final = mix(base, sunRay, rim * 0.75);
          gl_FragColor = vec4(final, 1.0);
        }
      `});this.planetMesh=new R(e,t),this.planetMesh.userData.objectId=this.objectData.id,this.group.add(this.planetMesh),this.clickTargets.push(this.planetMesh);const i=new Me(13732918,1.6,7e3);this.group.add(i)}_buildClouds(){const e=new U(480,36,36),t=new H({color:16772560,transparent:!0,opacity:.18,depthWrite:!1,blending:q});this.cloudMesh=new R(e,t),this.group.add(this.cloudMesh)}_buildBirdParticles(){const t=new ce,i=new Float32Array(300*3);for(let n=0;n<300;n++){const a=Math.random()*Math.PI*2,r=520+Math.random()*400;i[n*3]=Math.cos(a)*r,i[n*3+1]=(Math.random()-.5)*300,i[n*3+2]=Math.sin(a)*r}t.setAttribute("position",new G(i,3));const s=new ht({color:16765072,size:14,transparent:!0,opacity:.45,blending:q,depthWrite:!1});this.birdParticles=new de(t,s),this.group.add(this.birdParticles)}_buildOrbitRings(){const e=[950,1400,1900,2400,2900];for(const t of e){const i=new me(t-4,t+4,64),s=new H({color:13732918,transparent:!0,opacity:.22,side:he,depthWrite:!1}),n=new R(i,s);n.rotation.x=-Math.PI/2,this.group.add(n)}}_buildChildren(){const e=this.objectData.children??[];for(let t=0;t<e.length;t++){const i=e[t],s=950+t%5*480,n=.25-t%5*.035,a=t/e.length*Math.PI*2,r=i.mediaKind??"archive";let l,c;r==="playable"?(l=new zt(90,0),c=new O({color:13732918,emissive:16755268,emissiveIntensity:.5,roughness:.25,metalness:.7})):r==="audio"?(l=new pe(60,20,12,32),c=new O({color:16758852,emissive:13399808,emissiveIntensity:.3})):r==="video"?(l=new U(65,16,16),c=new O({color:14716976,emissive:11161616,emissiveIntensity:.3})):(l=new ue(70,0),c=new O({color:12089392,roughness:.4}));const p=new R(l,c);p.position.set(Math.cos(a)*s,(t%2===0?1:-1)*(t*30),Math.sin(a)*s),p.userData.childId=i.id,p.userData.contentStatus=i.contentStatus,p.userData.mediaUrl=i.mediaUrl,p.userData.posterUrl=i.posterUrl,this.group.add(p),this.clickTargets.push(p);const m=document.createElement("div");m.className="universe-label africa-child-label",m.style.cssText=`
        position:absolute;top:0;left:0;pointer-events:none;
        font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,0.85vw,10px);
        letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,230,190,0);
        white-space:nowrap;transform:translate(-50%,-130%);transition:color 0.3s;
        user-select:none;text-align:center;line-height:1.4;
      `;const d=r==="playable"?"◇ SATELLITE":r==="audio"?"♪ AUDIO":r==="video"?"▶ DOC":"◐ ARCHIVE";m.innerHTML=`<span>${d}</span><br/><span>${i.title}</span>`,this.labelContainer.appendChild(m),this.children.push({id:i.id,title:i.title,mediaKind:r,contentStatus:i.contentStatus??"live",mediaUrl:i.mediaUrl,posterUrl:i.posterUrl,mesh:p,orbitRadius:s,orbitSpeed:n,orbitAngle:a,labelEl:m})}}update(e,t,i){this.time+=e;const s=this.planetMesh.material;s.uniforms.time.value=this.time,this.planetMesh.rotation.y+=e*.04,this.cloudMesh.rotation.y+=e*.07,this.birdParticles.rotation.y+=e*.12;for(const n of this.children)n.orbitAngle+=e*n.orbitSpeed,n.mesh.position.set(Math.cos(n.orbitAngle)*n.orbitRadius,Math.sin(this.time*.4+n.orbitRadius)*35,Math.sin(n.orbitAngle)*n.orbitRadius),n.mesh.rotation.y+=e*.5;this._updateLabels(t,i)}_updateLabels(e,t){const{width:i,height:s}=t.domElement.getBoundingClientRect(),n=new w;e.getWorldPosition(n);for(const a of this.children){const r=new w;a.mesh.getWorldPosition(r);const l=n.distanceTo(r),c=900,m=1-Math.min(1,Math.max(0,(l-c)/(3800-c))),d=r.clone().project(e),g=(d.x*.5+.5)*i,b=(-(d.y*.5)+.5)*s;d.z>1||m<.02?a.labelEl.style.opacity="0":(a.labelEl.style.opacity=String(m),a.labelEl.style.left=`${g}px`,a.labelEl.style.top=`${b}px`)}}getChildData(e){return this.children.find(t=>t.id===e)}getPlanetWorldPos(){const e=new w;return this.planetMesh.getWorldPosition(e),e}dispose(){for(const e of this.children)e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.labelEl.remove();this.planetMesh.geometry.dispose(),this.planetMesh.material.dispose(),this.cloudMesh.geometry.dispose(),this.cloudMesh.material.dispose()}}class ai{group;planetMeshes=[];children=[];labelContainer;time=0;clickTargets=[];constructor(e,t){this.labelContainer=t,this.group=new K;const[i,s,n]=z.G2025?.worldOffset??[0,0,0];this.group.position.set(i,s,n);for(const a of e)a.id==="OBJ-FIRE"||a.id==="OBJ-AFRICA"||a.id==="OBJ-STREAMS"||this._buildSystem(a)}_buildSystem(e){const t=new w(e.position.x,e.position.y,e.position.z),i=e.accentColor?parseInt(e.accentColor.replace("#","0x"),16):4227264;let s;e.id==="OBJ-EBONY"?s=new Se(360,3):e.id==="OBJ-AVIATOR"?s=new pe(260,90,16,48):e.id==="OBJ-AWAY"?s=new U(320,32,32):s=new ue(280,2);const n=new O({color:i,emissive:i,emissiveIntensity:.35,roughness:.25,metalness:.65}),a=new R(s,n);a.position.copy(t),a.userData.objectId=e.id,this.group.add(a),this.planetMeshes.push(a),this.clickTargets.push(a);const r=new me(650,660,48),l=new H({color:i,transparent:!0,opacity:.2,side:he,depthWrite:!1}),c=new R(r,l);if(c.position.copy(t),c.rotation.x=-Math.PI/2,this.group.add(c),e.children){const p=[700,1100,1600];for(let m=0;m<e.children.length;m++){const d=e.children[m],g=p[m]??800+m*450,b=m/e.children.length*Math.PI*2,v=d.mediaKind??"archive";let S;v==="playable"?S=new ue(75,1):v==="audio"?S=new pe(50,16,12,28):v==="video"?S=new We(0,70,140,8):S=new Se(60,0);const I=new O({color:i,emissive:i,emissiveIntensity:.4,roughness:.3,metalness:.6}),M=new R(S,I);M.position.set(t.x+Math.cos(b)*g,t.y,t.z+Math.sin(b)*g),M.userData.childId=d.id,M.userData.contentStatus=d.contentStatus,M.userData.mediaUrl=d.mediaUrl,this.group.add(M),this.clickTargets.push(M);const _=document.createElement("div");_.className="universe-label frontier-child-label",_.style.cssText=`
          position:absolute;top:0;left:0;pointer-events:none;
          font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,0.85vw,10px);
          letter-spacing:0.1em;text-transform:uppercase;color:rgba(220,240,255,0);
          white-space:nowrap;transform:translate(-50%,-130%);transition:color 0.3s;
          user-select:none;text-align:center;line-height:1.4;
        `;const D=v==="playable"?"◇ SATELLITE":v==="audio"?"♪ AUDIO":v==="video"?"▶ VIDEO":"◐ ARCHIVE";_.innerHTML=`<span>${D}</span><br/><span>${d.title}</span>`,this.labelContainer.appendChild(_),this.children.push({id:d.id,title:d.title,mediaKind:v,contentStatus:d.contentStatus??"live",mediaUrl:d.mediaUrl,mesh:M,orbitRadius:g,orbitSpeed:.2+m%3*.08,orbitAngle:b,parentPos:t,labelEl:_})}}}update(e,t,i){this.time+=e;for(const s of this.planetMeshes)s.rotation.y+=e*.1,s.rotation.x+=e*.05;for(const s of this.children)s.orbitAngle+=e*s.orbitSpeed,s.mesh.position.set(s.parentPos.x+Math.cos(s.orbitAngle)*s.orbitRadius,s.parentPos.y+Math.sin(this.time*.5+s.orbitRadius)*25,s.parentPos.z+Math.sin(s.orbitAngle)*s.orbitRadius),s.mesh.rotation.y+=e*.6;this._updateLabels(t,i)}_updateLabels(e,t){const{width:i,height:s}=t.domElement.getBoundingClientRect(),n=new w;e.getWorldPosition(n);for(const a of this.children){const r=new w;a.mesh.getWorldPosition(r);const l=n.distanceTo(r),c=900,m=1-Math.min(1,Math.max(0,(l-c)/(3800-c))),d=r.clone().project(e),g=(d.x*.5+.5)*i,b=(-(d.y*.5)+.5)*s;d.z>1||m<.02?a.labelEl.style.opacity="0":(a.labelEl.style.opacity=String(m),a.labelEl.style.left=`${g}px`,a.labelEl.style.top=`${b}px`)}}getChildData(e){return this.children.find(t=>t.id===e)}dispose(){for(const e of this.children)e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.labelEl.remove();for(const e of this.planetMeshes)e.geometry.dispose(),e.material.dispose()}}function ri(){try{const o=localStorage.getItem("universe_my_stars_map");if(o)return JSON.parse(o)}catch{const o=localStorage.getItem("universe_my_star_id");if(o)return{G2025:o}}return{}}const ot=ri(),L={navContext:{level:"universe"},cameraSnapshot:null,selectedObjectId:null,selectedStarId:null,activeOverlay:"none",overlayData:null,audioState:"silent",muted:!!localStorage.getItem("universe_muted"),currentGalaxyId:"G2025",placementMode:!1,myStarId:Object.values(ot)[0]??null,myStarsMap:ot,stars:[],loaded:!1},re=new Map,Be=new Set;function at(o,e,t){const i=re.get(o);i&&i.forEach(s=>s(e,t)),Be.forEach(s=>s())}const x={get(o){return L[o]},set(o,e){const t=L[o];t!==e&&(L[o]=e,at(o,e,t))},patch(o){for(const[e,t]of Object.entries(o)){const i=L[e];i!==t&&(L[e]=t,at(e,t,i))}},subscribe(o,e){return re.has(o)||re.set(o,new Set),re.get(o).add(e),()=>re.get(o).delete(e)},on(o){return Be.add(o),()=>Be.delete(o)},getState(){return{...L}},toggleMute(){const o=!L.muted;o?localStorage.setItem("universe_muted","1"):localStorage.removeItem("universe_muted"),this.set("muted",o)},pushCameraSnapshot(o){this.set("cameraSnapshot",o)},popCameraSnapshot(){return L.cameraSnapshot},setMyStarId(o){localStorage.setItem("universe_my_star_id",o),this.set("myStarId",o)},setMyStarForGalaxy(o,e){const t={...L.myStarsMap,[o]:e};this.set("myStarsMap",t),this.set("myStarId",e)},hasStarInGalaxy(o){return!!L.myStarsMap[o]},getMyStarForGalaxy(o){return L.myStarsMap[o]??null},addStar(o){const e=[...L.stars,o];this.set("stars",e)}},li=1500;class ci{ambientLayers=new Map;activeRegionTheme=null;masterMuted;masterVol=.22;_rafId=0;isDucked=!1;REGION_TRACKS={fire:"https://static.wixstatic.com/mp3/85e419_7810e2c471ce46b5a1c5a664b8307995.mp3",africa:"https://static.wixstatic.com/mp3/85e419_f92713dc5c48443ca1c191bbbb0aec04.mp3",frontier:"https://static.wixstatic.com/mp3/85e419_7be9c7aa18ad4a6db00fd1af6ee7dbcd.mp3"};constructor(){this.masterMuted=!!localStorage.getItem("universe_muted"),this._tick=this._tick.bind(this),requestAnimationFrame(this._tick)}unlock(){if(!this.masterMuted)for(const e of this.ambientLayers.values())e.el.paused&&e.targetVol>0&&e.el.play().catch(()=>{})}setRegionTheme(e){if(this.activeRegionTheme===e)return;this.activeRegionTheme=e;const t=e?this.REGION_TRACKS[e]:null;for(const[i,s]of this.ambientLayers)i!==t&&(s.targetVol=0);if(t){let i=this.ambientLayers.get(t);if(!i){const s=new Audio(t);s.loop=!0,s.volume=0,s.preload="auto",i={src:t,el:s,targetVol:0,currentVol:0},this.ambientLayers.set(t,i)}i.targetVol=this.masterMuted||this.isDucked?0:this.masterVol,!this.masterMuted&&i.el.paused&&i.el.play().catch(()=>{})}}duckAmbient(){this.isDucked=!0;for(const e of this.ambientLayers.values())e.targetVol=e.targetVol>0?this.masterVol*.08:0}restoreAmbient(){if(this.isDucked=!1,!this.masterMuted)for(const e of this.ambientLayers.values()){const t=this.activeRegionTheme&&this.REGION_TRACKS[this.activeRegionTheme]===e.src;e.targetVol=t?this.masterVol:0}}setMuted(e){this.masterMuted=e;for(const t of this.ambientLayers.values())e?(t.targetVol=0,t.el.pause()):this.activeRegionTheme&&this.REGION_TRACKS[this.activeRegionTheme]===t.src&&(t.targetVol=this.masterVol,t.el.play().catch(()=>{}))}_tick(){this._rafId=requestAnimationFrame(this._tick);const e=16/li;for(const t of this.ambientLayers.values()){const i=t.targetVol-t.currentVol;Math.abs(i)>.001&&(t.currentVol+=i*e*6,t.el.volume=Math.max(0,Math.min(1,t.currentVol)))}}dispose(){cancelAnimationFrame(this._rafId);for(const e of this.ambientLayers.values())e.el.pause()}}const T=new ci;let $=null;async function di(){if($)return $;const t=await fetch("./data/seed_universe.json");if(!t.ok)throw new Error(`Failed to load seed data: ${t.status}`);return $=await t.json(),$}const qe=new Map,pi=new Map,rt=new Map;function ui(o){for(const e of o.galaxies){qe.set(e.id,e);for(const t of e.regions)pi.set(t.id,{...t,galaxyId:e.id})}for(const e of o.celestialObjects)if(rt.set(e.id,e),e.children)for(const t of e.children)rt.set(t.id,{...t,galaxyId:e.galaxyId,regionId:e.regionId,position:{...e.position}})}function Fe(){return $?$.galaxies:[]}function je(o){return qe.get(o)?.regions??[]}function ft(){return $?$.celestialObjects:[]}function mi(){return $?$.demoStars:[]}function hi(){return mi().map(o=>({id:o.id,galaxyId:o.galaxyId,regionId:o.regionId,clusterId:o.clusterId,x:o.x,y:o.y,z:o.z,displayName:o.displayName,message:o.message,createdAt:"2025-01-01T00:00:00Z",isDemo:!0}))}function le(o){return z[o]?.worldOffset??[0,0,0]}function gt(o,e){const t=le(o),s=je(o).findIndex(a=>a.id===e),n=Ue[Math.max(0,s)];return[t[0]+n[0],t[1]+n[1],t[2]+n[2]]}function fi(o){const e=le(o.galaxyId);return[e[0]+o.position.x,e[1]+o.position.y,e[2]+o.position.z]}function Ke(o){const e=qe.get(o);return e?`${e.title} Galaxy`:o}function gi(o){return`${Math.max(1,Math.round(o*.085))} AU`}const lt="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";function yi(o=21){const e=crypto.getRandomValues(new Uint8Array(o));return Array.from(e,t=>lt[t%lt.length]).join("")}const Z=500;class bi{cells=new Map;key(e,t,i){return`${Math.floor(e/Z)},${Math.floor(t/Z)},${Math.floor(i/Z)}`}insert(e){const t=this.key(e.x,e.y,e.z);this.cells.has(t)||this.cells.set(t,[]),this.cells.get(t).push(e)}checkCollision(e,t,i,s){const n=Math.floor(e/Z),a=Math.floor(t/Z),r=Math.floor(i/Z);for(let l=-1;l<=1;l++)for(let c=-1;c<=1;c++)for(let p=-1;p<=1;p++){const m=`${n+l},${a+c},${r+p}`,d=this.cells.get(m);if(d){for(const g of d)if(Math.sqrt((g.x-e)**2+(g.y-t)**2+(g.z-i)**2)<s)return!0}}return!1}rebuild(e){this.cells.clear();for(const t of e)this.insert(t)}}const Ae="universe_stars",ct="universe_my_stars_map",dt="universe_last_place",vi=1e3*30;class xi{grid=new bi;stars=[];loaded=!1;async loadStars(){if(this.loaded)return this.stars;const e=hi();let t=[];try{const i=localStorage.getItem(Ae);i&&(t=JSON.parse(i))}catch{t=[]}return this.stars=[...e,...t],this.grid.rebuild(this.stars),this.loaded=!0,this.stars}getMyStarsMap(){try{const e=localStorage.getItem(ct);if(e)return JSON.parse(e)}catch{const e=localStorage.getItem("universe_my_star_id");if(e)return{G2025:e}}return{}}hasStarInGalaxy(e){return!!this.getMyStarsMap()[e]}getMyStarId(e){const t=this.getMyStarsMap();return e?t[e]??null:Object.values(t)[0]??null}async placestar(e){if(this.hasStarInGalaxy(e.galaxyId))return{success:!1,error:"already-placed-in-galaxy"};const t=localStorage.getItem(dt);if(t&&Date.now()-parseInt(t)<vi)return{success:!1,error:"rate-limit"};if(this.grid.checkCollision(e.x,e.y,e.z,Ut))return{success:!1,error:"collision"};const i=gt(e.galaxyId,e.regionId),s=e.x-i[0],n=e.z-i[2];if(Math.sqrt(s*s+n*n)>Bt||Math.abs(e.y-i[1])>Ft)return{success:!1,error:"collision"};const r={id:yi(),galaxyId:e.galaxyId,regionId:e.regionId,x:e.x,y:e.y,z:e.z,displayName:_e(e.displayName),starName:e.starName?_e(e.starName):void 0,message:e.message?_e(e.message):void 0,signatureDataUrl:e.signatureDataUrl,createdAt:new Date().toISOString(),isDemo:!1};this.stars.push(r),this.grid.insert(r);try{const l=localStorage.getItem(Ae),c=l?JSON.parse(l):[];c.push(r),localStorage.setItem(Ae,JSON.stringify(c));const p=this.getMyStarsMap();p[e.galaxyId]=r.id,localStorage.setItem(ct,JSON.stringify(p)),localStorage.setItem(dt,String(Date.now()))}catch{}return x.setMyStarForGalaxy(e.galaxyId,r.id),{success:!0,star:r}}async getStarById(e){return await this.loadStars(),this.stars.find(t=>t.id===e)??null}}function _e(o){return o.replace(/<[^>]*>/g,"").trim().slice(0,280)}const Y=new xi;class wi{el;galaxyLabel;muteBtn;placeBtn;resetBtn;returnBtn;tourBtn;breadcrumb;callbacks;constructor(e,t){this.callbacks=t,this.el=document.createElement("div"),this.el.id="universe-hud",this.el.setAttribute("role","navigation"),this.el.setAttribute("aria-label","Universe navigation"),this.el.style.cssText=`
      position:absolute;
      top:0;left:0;right:0;
      display:flex;
      align-items:center;
      justify-content:space-between;
      padding:env(safe-area-inset-top,12px) 20px 12px;
      padding-top:max(env(safe-area-inset-top),12px);
      background:linear-gradient(to bottom,rgba(0,4,12,0.85) 0%,transparent 100%);
      pointer-events:none;
      z-index:50;
      gap:12px;
    `,this.el.innerHTML=`
      <div style="display:flex;align-items:center;gap:12px;pointer-events:auto;flex-wrap:wrap;">
        <a
          id="hud-exit"
          href="../../index.html"
          style="
            font-family:'Space Mono',monospace;
            font-size:0.65rem;
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
        <button
          id="hud-reset"
          type="button"
          style="${xe("rgba(255,255,255,0.05)","#4080c0")}"
          aria-label="Reset Camera to Universe Composition"
          title="Reset View to Default Universe Composition"
        >⌂ RESET VIEW</button>
        <button
          id="hud-return"
          type="button"
          style="${xe("rgba(255,255,255,0.05)","#4080c0")} display:none;"
          aria-label="Return to Previous Location"
        >← RETURN</button>
      </div>

      <div id="hud-galaxy-name" style="
        font-family:'Space Mono',monospace;
        font-size:0.65rem;
        letter-spacing:0.2em;
        color:#4a78a0;
        text-transform:uppercase;
        text-align:center;
        flex:1;
        pointer-events:none;
      "></div>

      <div style="display:flex;align-items:center;gap:10px;pointer-events:auto;">
        <button
          id="hud-tour"
          type="button"
          style="${xe("rgba(40,100,160,0.4)","#70c0ff")}"
          aria-label="Take me somewhere guided tour"
          title="Cinematic flight to a featured universe destination"
        >✦ TAKE ME SOMEWHERE</button>

        <button
          id="hud-place"
          type="button"
          style="${xe("rgba(20,60,100,0.6)","#5090c0")}"
          aria-label="Place or view your star"
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
            font-size:0.85rem;
            display:flex;align-items:center;justify-content:center;
            transition:background 0.2s, color 0.2s;
          "
          aria-label="Toggle sound"
        >♪</button>
      </div>
    `,e.appendChild(this.el),this.galaxyLabel=this.el.querySelector("#hud-galaxy-name"),this.breadcrumb=this.el.querySelector("#hud-breadcrumb"),this.muteBtn=this.el.querySelector("#hud-mute"),this.placeBtn=this.el.querySelector("#hud-place"),this.resetBtn=this.el.querySelector("#hud-reset"),this.returnBtn=this.el.querySelector("#hud-return"),this.tourBtn=this.el.querySelector("#hud-tour"),this._bindEvents(),this._syncMute(),x.subscribe("currentGalaxyId",i=>{this.galaxyLabel.textContent=i?Ke(i):"",this._syncStarButton()}),x.subscribe("navContext",i=>{this.breadcrumb.textContent=i.level.toUpperCase()}),x.subscribe("muted",()=>this._syncMute()),x.subscribe("myStarsMap",()=>this._syncStarButton()),this._syncStarButton()}_syncStarButton(){const e=x.get("currentGalaxyId")??"G2025",t=Y.getMyStarId(e);t?(this.placeBtn.textContent="✦ VIEW YOUR STAR",this.placeBtn.style.color="#ffd700",this.placeBtn.style.background="rgba(100,80,10,0.6)",this.placeBtn.dataset.action="view",this.placeBtn.dataset.starId=t):(this.placeBtn.textContent="✦ PLACE STAR",this.placeBtn.style.color="#5090c0",this.placeBtn.style.background="rgba(20,60,100,0.6)",this.placeBtn.dataset.action="place",delete this.placeBtn.dataset.starId)}_bindEvents(){this.resetBtn.addEventListener("click",()=>{T.unlock(),this.callbacks.onResetView()}),this.returnBtn.addEventListener("click",()=>{T.unlock(),this.callbacks.onReturnPrevious()}),this.tourBtn.addEventListener("click",()=>{T.unlock(),this.callbacks.onTakeTour()}),this.muteBtn.addEventListener("click",()=>{T.unlock(),x.toggleMute(),T.setMuted(x.get("muted"))}),this.placeBtn.addEventListener("click",()=>{T.unlock();const e=this.placeBtn.dataset.action,t=this.placeBtn.dataset.starId;e==="view"&&t?this.callbacks.onViewMyStar(t):(x.set("placementMode",!0),window.dispatchEvent(new CustomEvent("universe-start-placement")))}),document.getElementById("universe-canvas")?.addEventListener("click",()=>{T.unlock()},{once:!0})}setReturnAvailable(e){this.returnBtn.style.display=e?"inline-block":"none"}_syncMute(){const e=x.get("muted");this.muteBtn.textContent=e?"♪̶":"♪",this.muteBtn.setAttribute("aria-label",e?"Unmute":"Mute"),this.muteBtn.style.color=e?"#2a3848":"#4a85b0"}setPlacementMode(e){e?(this.placeBtn.textContent="✦ PLACING…",this.placeBtn.style.color="#60c080"):this._syncStarButton()}dispose(){this.el.remove()}}function xe(o,e){return`
    font-family:'Space Grotesk',sans-serif;
    font-size:0.65rem;letter-spacing:0.12em;text-transform:uppercase;
    background:${o};
    border:1px solid rgba(80,160,240,0.25);
    border-radius:4px;
    color:${e};
    padding:6px 12px;
    cursor:pointer;
    transition:background 0.2s, color 0.2s;
    white-space:nowrap;
  `}class Si{el;openBtn;panel;activeTab="map";isOpen=!1;callbacks;constructor(e,t){this.callbacks=t,this.el=document.createElement("div"),this.el.id="galactic-navigator-wrap",this.el.style.cssText=`
      position:absolute;
      bottom:24px;
      left:20px;
      z-index:40;
      font-family:'Space Grotesk',sans-serif;
      pointer-events:none;
    `,this.openBtn=document.createElement("button"),this.openBtn.type="button",this.openBtn.id="nav-open-btn",this.openBtn.setAttribute("aria-label","Open Galactic Navigator"),this.openBtn.style.cssText=`
      pointer-events:auto;
      background:rgba(2,10,24,0.85);
      border:1px solid rgba(80,160,240,0.3);
      border-radius:8px;
      color:#8ab4d4;
      font-family:'Space Mono',monospace;
      font-size:0.7rem;
      letter-spacing:0.15em;
      padding:10px 16px;
      cursor:pointer;
      display:flex;
      align-items:center;
      gap:8px;
      backdrop-filter:blur(8px);
      transition:background 0.2s, border-color 0.2s;
    `,this.openBtn.innerHTML="<span>⛯</span> <span>GALACTIC NAVIGATOR</span>",this.panel=document.createElement("div"),this.panel.id="nav-panel",this.panel.style.cssText=`
      pointer-events:auto;
      display:none;
      width:340px;
      max-width:90vw;
      max-height:75vh;
      background:linear-gradient(135deg, rgba(2,10,24,0.92) 0%, rgba(4,16,36,0.94) 100%);
      border:1px solid rgba(80,160,240,0.35);
      border-radius:12px;
      box-shadow:0 8px 32px rgba(0,0,0,0.6);
      backdrop-filter:blur(12px);
      overflow:hidden;
      flex-direction:column;
      margin-bottom:12px;
      animation:nav-slide-up 0.25s cubic-bezier(0.16,1,0.3,1);
    `,this.el.appendChild(this.panel),this.el.appendChild(this.openBtn),e.appendChild(this.el),this._injectStyles(),this._bindEvents(),this.render(),x.on(()=>{this.isOpen&&this._updateTelemetry()})}_injectStyles(){if(document.getElementById("nav-styles"))return;const e=document.createElement("style");e.id="nav-styles",e.textContent=`
      @keyframes nav-slide-up {
        from { opacity:0; transform:translateY(12px); }
        to { opacity:1; transform:translateY(0); }
      }
      .nav-tab-btn {
        flex:1;
        padding:10px;
        background:none;
        border:none;
        border-bottom:2px solid transparent;
        color:#4a6888;
        font-family:'Space Mono',monospace;
        font-size:0.65rem;
        letter-spacing:0.15em;
        text-transform:uppercase;
        cursor:pointer;
        transition:color 0.2s, border-color 0.2s;
      }
      .nav-tab-btn.active {
        color:#8ab4d4;
        border-bottom-color:#4090d0;
      }
      .nav-tree-item {
        padding:6px 12px;
        border-radius:4px;
        cursor:pointer;
        font-size:0.75rem;
        color:#7090b0;
        display:flex;
        align-items:center;
        justify-content:space-between;
        transition:background 0.15s, color 0.15s;
      }
      .nav-tree-item:hover {
        background:rgba(80,160,240,0.12);
        color:#e0f0ff;
      }
      .nav-tree-item.active {
        background:rgba(80,160,240,0.2);
        color:#8ab4d4;
        font-weight:600;
      }
    `,document.head.appendChild(e)}_bindEvents(){this.openBtn.addEventListener("click",()=>{this.isOpen=!this.isOpen,this.panel.style.display=this.isOpen?"flex":"none",this.isOpen&&this.render()})}render(){const e=x.get("currentGalaxyId")??"G2025",t=Fe().find(i=>i.id===e);t&&je(e),this.panel.innerHTML=`
      <div style="display:flex;border-bottom:1px solid rgba(255,255,255,0.08);background:rgba(0,0,0,0.2);">
        <button type="button" class="nav-tab-btn ${this.activeTab==="map"?"active":""}" data-tab="map">⛯ MAP</button>
        <button type="button" class="nav-tab-btn ${this.activeTab==="legend"?"active":""}" data-tab="legend">✧ LEGEND</button>
      </div>

      <!-- YOU ARE HERE TELEMETRY -->
      <div id="nav-telemetry" style="
        padding:12px 16px;
        background:rgba(80,160,240,0.05);
        border-bottom:1px solid rgba(255,255,255,0.06);
        font-family:'Space Mono',monospace;
        font-size:0.65rem;
      ">
        <div style="color:#4080c0;letter-spacing:0.15em;margin-bottom:4px;font-weight:bold;">YOU ARE HERE</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;color:#7090b0;">
          <div>GALAXY: <strong style="color:#c0d8f0;">${t?.title??"2025–2029"}</strong></div>
          <div>AU: <strong id="telemetry-au" style="color:#c0d8f0;">427 AU</strong></div>
        </div>
      </div>

      <div style="padding:12px 16px;overflow-y:auto;flex:1;">
        ${this.activeTab==="map"?this._renderMapHTML():this._renderLegendHTML()}
      </div>
    `,this.panel.querySelectorAll(".nav-tab-btn").forEach(i=>{i.addEventListener("click",s=>{const n=s.currentTarget.dataset.tab;this.activeTab=n,this.render()})}),this.panel.querySelectorAll(".nav-tree-item").forEach(i=>{i.addEventListener("click",s=>{const n=s.currentTarget,a=n.dataset.type,r=n.dataset.id,l=n.dataset.parentId;a==="galaxy"&&r?this.callbacks.onTravelToGalaxy(r):a==="region"&&r&&l?this.callbacks.onTravelToRegion(l,r):a==="object"&&r&&this.callbacks.onTravelToObject(r)})}),this._updateTelemetry()}_renderMapHTML(){const e=Fe(),t=x.get("currentGalaxyId")??"G2025",i=ft();return`
      <div style="font-family:'Space Mono',monospace;font-size:0.65rem;color:#4a6888;letter-spacing:0.1em;margin-bottom:8px;">
        KNOWN GALAXIES (CLICK TO TRAVEL)
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;">
        ${e.map(s=>{const n=s.id===t,a=s.id==="G2025",r=je(s.id);return`
            <div class="nav-tree-item ${n?"active":""}" data-type="galaxy" data-id="${s.id}">
              <span>${a?"✦ ":""}${s.title}</span>
              <span style="font-size:0.6rem;opacity:0.6;">${a?"SHOWCASE":"KNOWN"}</span>
            </div>
            ${n?`
              <div style="margin-left:12px;padding-left:8px;border-left:1px solid rgba(80,160,240,0.2);display:flex;flex-direction:column;gap:2px;margin-bottom:6px;">
                ${r.map(l=>`
                  <div class="nav-tree-item" data-type="region" data-id="${l.id}" data-parent-id="${s.id}">
                    <span>↳ ${l.title}</span>
                  </div>
                `).join("")}
                ${i.filter(l=>l.galaxyId===s.id).map(l=>`
                  <div class="nav-tree-item" data-type="object" data-id="${l.id}">
                    <span style="color:#50a0d0;">● ${l.title}</span>
                    <span style="font-size:0.6rem;opacity:0.6;">${l.kind.toUpperCase()}</span>
                  </div>
                `).join("")}
              </div>
            `:""}
          `}).join("")}
      </div>
    `}_renderLegendHTML(){return`
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${[{icon:"✦",label:"STAR",desc:"Visitor in the Universe"},{icon:"☀",label:"SUN",desc:"Era-defining work / event"},{icon:"●",label:"PLANET",desc:"Major work / history"},{icon:"◐",label:"MOON",desc:"Related artifact"},{icon:"◇",label:"SATELLITE",desc:"Interactive / external media"},{icon:"☄",label:"COMET",desc:"Theme / person crossing eras"},{icon:"✧",label:"NEBULA",desc:"Creative period"},{icon:"✺",label:"SUPERNOVA",desc:"Transformative event"},{icon:"·",label:"ASTEROID",desc:"Small archival artifact"}].map(t=>`
          <div style="display:flex;align-items:center;gap:12px;padding:6px;border-bottom:1px solid rgba(255,255,255,0.04);">
            <span style="font-size:1.1rem;color:#8ab4d4;width:24px;text-align:center;">${t.icon}</span>
            <div>
              <div style="font-family:'Space Mono',monospace;font-size:0.65rem;color:#c0d8f0;letter-spacing:0.1em;">${t.label}</div>
              <div style="font-size:0.7rem;color:#5a7898;">${t.desc}</div>
            </div>
          </div>
        `).join("")}
      </div>
    `}_updateTelemetry(){const e=this.panel.querySelector("#telemetry-au");if(e){const t=x.get("cameraSnapshot"),i=t?Math.hypot(...t.position):48e3;e.textContent=gi(i)}}dispose(){this.el.remove()}}const yt=[];let Ve={type:"universe"};function ke(o){const e=o.replace(/^#\/?/,"");if(!e||e==="universe")return{type:"universe"};const[t,i]=e.split("/");return t==="galaxy"&&i?{type:"galaxy",galaxyId:i}:t==="object"&&i?{type:"object",objectId:i}:t==="star"&&i?{type:"star",starId:i}:{type:"universe"}}function Re(o){Ve=o,yt.forEach(e=>e(o))}const ze={init(){window.addEventListener("hashchange",()=>{Re(ke(window.location.hash))}),Re(ke(window.location.hash))},on(o){yt.push(o),o(Ve)},navigate(o,e=!0){let t="";o.type==="universe"?t="#universe":o.type==="galaxy"?t=`#galaxy/${o.galaxyId}`:o.type==="object"?t=`#object/${o.objectId}`:o.type==="star"&&(t=`#star/${o.starId}`),e?(history.pushState(null,"",t),Re(ke(t))):history.replaceState(null,"",t)},back(){history.back()},current(){return Ve}};function X(o,e){const t=document.createElement("div");return t.id=o,t.className=`overlay-panel ${e}`,t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.style.cssText=`
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
  `,t}function J(){if(document.getElementById("overlay-styles"))return;const o=document.createElement("style");o.id="overlay-styles",o.textContent=`
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
  `,document.head.appendChild(o)}function ee(o){const e=o.querySelectorAll('button,a,[tabindex]:not([tabindex="-1"]),input,textarea,select'),t=e[0],i=e[e.length-1];function s(n){n.key==="Tab"&&(n.shiftKey?document.activeElement===t&&(n.preventDefault(),i?.focus()):document.activeElement===i&&(n.preventDefault(),t?.focus()))}return o.addEventListener("keydown",s),t?.focus(),()=>o.removeEventListener("keydown",s)}function te(o,e){function t(i){i.key==="Escape"&&e()}return window.addEventListener("keydown",t),()=>window.removeEventListener("keydown",t)}function fe(o,e){const t=document.createElement("button");return t.className="overlay-close-btn",t.type="button",t.setAttribute("aria-label","Close"),t.innerHTML="×",t.addEventListener("click",e),o.appendChild(t),t}function Mi(o,e,t){J(),T.duckAmbient();const i=X("audio-overlay","audio-overlay");i.setAttribute("aria-label",`Audio: ${e.title}`);const s=!e.mediaUrl||e.contentStatus==="awaiting-source";i.innerHTML=`
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
  `,Ai();const n=()=>{i.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{i.remove(),T.restoreAmbient(),t()},200)};fe(i.firstElementChild,n);const a=te(i,n),r=ee(i);if(i.addEventListener("mousedown",l=>{l.target===i&&n()}),o.appendChild(i),o.setAttribute("aria-hidden","false"),!s){const l=i.querySelector("#spatial-audio");l?.play().catch(()=>{}),l?.addEventListener("play",()=>T.duckAmbient()),l?.addEventListener("pause",()=>T.restoreAmbient())}return()=>{a(),r(),n()}}function Ei(o,e,t){J(),T.duckAmbient();const i=X("video-overlay","video-overlay");i.setAttribute("aria-label",`Video: ${e.title}`),i.style.background="rgba(0,0,0,0.92)";const s=!e.mediaUrl||e.contentStatus==="awaiting-source";i.innerHTML=`
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
            src="${Ii(e.mediaUrl)}"
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
  `;const n=()=>{i.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{i.remove(),T.restoreAmbient(),t()},200)};fe(i,n);const a=te(i,n),r=ee(i);return i.addEventListener("mousedown",l=>{l.target===i&&n()}),o.appendChild(i),()=>{a(),r(),n()}}function Ci(o,e,t){J(),T.duckAmbient();const i=X("playable-overlay","playable-overlay");i.setAttribute("aria-label",`Playable Experience: ${e.title}`),i.style.background="rgba(0,0,0,0.98)",i.style.padding="0";const s=e.mediaUrl??"/games/streams/";i.innerHTML=`
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
  `;const n=()=>{i.style.animation="overlay-out 0.15s ease forwards",setTimeout(()=>{i.remove(),T.restoreAmbient(),t()},150)};i.querySelector("#exit-playable")?.addEventListener("click",n);const a=te(i,n);o.appendChild(i);const r=l=>{(l.data==="UNIVERSE_EXIT"||l.data?.type==="UNIVERSE_EXIT")&&n()};return window.addEventListener("message",r),()=>{a(),window.removeEventListener("message",r),n()}}function Ti(o,e,t){J();const i=X("archive-overlay","archive-overlay");i.setAttribute("aria-label",`Archive: ${e.title}`),i.innerHTML=`
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
  `;const s=()=>{i.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{i.remove(),t()},200)};fe(i.firstElementChild,s);const n=te(i,s),a=ee(i);return i.addEventListener("mousedown",r=>{r.target===i&&s()}),o.appendChild(i),()=>{n(),a(),s()}}function Ii(o){const e=o.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);return e?`https://www.youtube.com/embed/${e[1]}?autoplay=1`:o}function Ai(){if(document.getElementById("orbit-anim"))return;const o=document.createElement("style");o.id="orbit-anim",o.textContent=`
    @keyframes orbit-pulse {
      0%,100% { box-shadow:0 0 20px rgba(32,200,200,0.1); }
      50% { box-shadow:0 0 40px rgba(32,200,200,0.25); }
    }
    @keyframes orbit-spin {
      to { transform:rotate(360deg); }
    }
  `,document.head.appendChild(o)}function _i(o,e,t){J();const i=X("star-card-overlay","star-card-overlay");i.setAttribute("aria-label",`Star Card: ${e.displayName}`),i.style.background="rgba(0,2,10,0.92)";const s=document.createElement("canvas");s.width=1080,s.height=1350,s.style.display="none",document.body.appendChild(s),Pe(s,e,1080,1350);const n=document.createElement("canvas");n.width=1080,n.height=1920,n.style.display="none",document.body.appendChild(n),Pe(n,e,1080,1920);const a=document.createElement("canvas");a.width=360,a.height=450,a.style.cssText="border-radius:8px;max-width:100%;",Pe(a,e,360,450);const r=`${location.origin}${location.pathname}#star/${e.id}`;i.innerHTML=`
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
        <button id="dl-card" type="button" style="${Oe()}">DOWNLOAD CARD (1080×1350)</button>
        <button id="dl-story" type="button" style="${Oe()}">DOWNLOAD STORY (1080×1920)</button>
        <button id="copy-link" type="button" style="${Oe("rgba(20,60,20,0.6)")}">COPY SHARE LINK</button>
      </div>
      <p id="copy-confirm" style="color:#60c070;font-size:0.75rem;min-height:18px;"></p>
    </div>
  `;const l=i.querySelector("#star-card-preview-wrap");l&&l.appendChild(a),i.querySelector("#dl-card")?.addEventListener("click",()=>{pt(s,`2fly-star-${e.id.slice(0,8)}-card.png`)}),i.querySelector("#dl-story")?.addEventListener("click",()=>{pt(n,`2fly-star-${e.id.slice(0,8)}-story.png`)}),i.querySelector("#copy-link")?.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(r);const d=i.querySelector("#copy-confirm");d&&(d.textContent="Link copied!",setTimeout(()=>{d.textContent=""},2e3))}catch{const d=i.querySelector("#copy-confirm");d&&(d.textContent=r)}});const c=()=>{i.remove(),s.remove(),n.remove(),a.remove(),t()};fe(i.firstElementChild,c);const p=te(i,c),m=ee(i);return i.addEventListener("mousedown",d=>{d.target===i&&c()}),o.appendChild(i),()=>{p(),m(),c()}}function Le(o,e,t){J();const i=X("star-view-overlay","star-view-overlay");i.setAttribute("aria-label",`Star: ${e.displayName}`);const s=z[e.galaxyId],n=s?"#"+s.primaryColor.toString(16).padStart(6,"0"):"#4080c0",a=Ke(e.galaxyId);i.innerHTML=`
    <div style="
      position:relative;
      background:radial-gradient(ellipse at 50% 30%, rgba(${oe(s?.primaryColor??2121888)},0.12) 0%, rgba(0,4,12,0.95) 70%);
      border:1px solid rgba(${oe(s?.primaryColor??2121888)},0.2);
      border-radius:20px;
      padding:60px 40px 40px;
      max-width:500px;width:92vw;
      text-align:center;
    ">
      <div style="
        font-size:3rem;margin-bottom:20px;
        text-shadow:0 0 30px ${n};
        animation:star-pulse 3s ease-in-out infinite;
      " aria-hidden="true">✦</div>
      <p style="font-size:0.65rem;letter-spacing:0.2em;color:${n};margin-bottom:8px;
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
          border-left:2px solid rgba(${oe(s?.primaryColor??2121888)},0.3);
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
        ${we("GALAXY",a)}
        ${we("ARRIVED",bt(e.createdAt))}
        ${we("STAR ID",e.id.slice(0,14)+"…")}
        ${we("COORDINATES",`${e.x.toFixed(0)}, ${e.y.toFixed(0)}, ${e.z.toFixed(0)}`)}
      </div>
      <button id="star-place-cta" type="button" style="
        margin-top:8px;
        padding:12px 28px;
        background:rgba(${oe(s?.primaryColor??2121888)},0.15);
        border:1px solid rgba(${oe(s?.primaryColor??2121888)},0.35);
        border-radius:6px;
        color:#c0d0f0;
        font-family:'Space Grotesk',sans-serif;
        font-size:0.8rem;letter-spacing:0.12em;text-transform:uppercase;
        cursor:pointer;
        transition:background 0.2s;
      ">PLACE YOUR STAR →</button>
    </div>
  `;const r=()=>{i.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{i.remove(),t()},200)};i.querySelector("#star-place-cta")?.addEventListener("click",()=>{r(),x.set("placementMode",!0),window.dispatchEvent(new CustomEvent("universe-start-placement"))}),fe(i.firstElementChild,r);const l=te(i,r),c=ee(i);return i.addEventListener("mousedown",p=>{p.target===i&&r()}),o.appendChild(i),()=>{l(),c(),r()}}async function ki(o,e,t){const i=window.matchMedia("(prefers-reduced-motion: reduce)").matches,s=document.createElement("div");s.style.cssText=`
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
  `,o.appendChild(s);const n=i?400:2500;await new Promise(a=>setTimeout(a,n)),s.style.opacity="0",await new Promise(a=>setTimeout(a,500)),s.remove(),t()}function Oe(o="rgba(20,40,80,0.6)"){return["display:inline-block;","padding:10px 16px;",`background:${o};`,"border:1px solid rgba(80,140,220,0.25);","border-radius:6px;","color:#a0b8d8;","font-family:'Space Grotesk',sans-serif;","font-size:0.72rem;","letter-spacing:0.1em;","text-transform:uppercase;","cursor:pointer;","transition:background 0.2s;"].join("")}function Pe(o,e,t,i){const s=o.getContext("2d");if(!s)return;o.width=t,o.height=i;const n=z[e.galaxyId],a=s.createRadialGradient(t*.5,i*.3,0,t*.5,i*.3,i*.7),r=n?"#"+n.primaryColor.toString(16).padStart(6,"0"):"#204080";a.addColorStop(0,`${r}22`),a.addColorStop(.6,"#020810"),a.addColorStop(1,"#010408"),s.fillStyle=a,s.fillRect(0,0,t,i),s.globalAlpha=.5;for(let g=0;g<300;g++){const b=Math.random()*t,v=Math.random()*i,S=Math.random()*1.2+.3;s.fillStyle="#ffffff",s.beginPath(),s.arc(b,v,S,0,Math.PI*2),s.fill()}s.globalAlpha=1;const l=t/1080,c=80*l;s.font=`${c}px serif`,s.textAlign="center",s.fillStyle="#ffd700",s.shadowColor="#ffd700",s.shadowBlur=40*l,s.fillText("✦",t*.5,i*.25),s.shadowBlur=0,s.font=`${11*l}px 'Arial', sans-serif`,s.fillStyle=r,s.letterSpacing=`${3*l}px`,s.fillText("2FLY UNIVERSE",t*.5,i*.32),s.font=`bold ${28*l}px 'Arial', sans-serif`,s.fillStyle="#f0f4ff",s.letterSpacing="0px",s.fillText(e.displayName.toUpperCase(),t*.5,i*.4),e.starName&&(s.font=`${16*l}px 'Arial', sans-serif`,s.fillStyle="#7080a0",s.fillText(`"${e.starName}"`,t*.5,i*.45)),e.message&&(s.font=`italic ${13*l}px 'Arial', sans-serif`,s.fillStyle="#5a7090",Ri(s,`"${e.message}"`,t*.5,i*.52,t*.75,18*l));const p=i*.72,m=20*l;s.font=`${10*l}px 'Courier New', monospace`,s.textAlign="center";const d=[`GALAXY: ${Ke(e.galaxyId).toUpperCase()}`,`ARRIVED: ${bt(e.createdAt)}`,`ID: ${e.id.slice(0,20)}`,`COORDS: ${e.x.toFixed(0)}, ${e.y.toFixed(0)}, ${e.z.toFixed(0)}`];s.fillStyle="#2a4060",d.forEach((g,b)=>s.fillText(g,t*.5,p+b*m)),s.font=`${9*l}px 'Arial', sans-serif`,s.fillStyle="#1a3050",s.fillText("2FLYKEITHLOGAN.COM/UNIVERSE",t*.5,i*.94),s.strokeStyle=`${r}33`,s.lineWidth=2*l,s.strokeRect(20*l,20*l,t-40*l,i-40*l)}function Ri(o,e,t,i,s,n){const a=e.split(" ");let r="",l=i;for(const c of a){const p=r+c+" ";o.measureText(p).width>s&&r.length?(o.fillText(r,t,l),r=c+" ",l+=n):r=p}o.fillText(r,t,l)}function pt(o,e){const t=document.createElement("a");t.href=o.toDataURL("image/png"),t.download=e,t.click()}function we(o,e){return`
    <div style="
      background:rgba(255,255,255,0.02);
      border:1px solid rgba(255,255,255,0.05);
      border-radius:6px;
      padding:10px 12px;
    ">
      <div style="font-size:0.6rem;letter-spacing:0.15em;color:#3a5070;
        text-transform:uppercase;font-family:'Space Mono',monospace;margin-bottom:4px;">${o}</div>
      <div style="font-size:0.78rem;color:#8090b0;word-break:break-all;">${e}</div>
    </div>
  `}function bt(o){try{return new Date(o).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}catch{return o}}function oe(o){const e=o>>16&255,t=o>>8&255,i=o&255;return`${e},${t},${i}`}const vt=document.createElement("style");vt.textContent=`
  @keyframes star-pulse {
    0%,100% { text-shadow:0 0 10px currentColor,0 0 20px currentColor; }
    50% { text-shadow:0 0 20px currentColor,0 0 40px currentColor,0 0 60px currentColor; }
  }
`;document.head.appendChild(vt);function zi(o,e,t){J();const i=X("star-placement-overlay","star-placement-overlay");i.setAttribute("aria-label","Place Your Star in the 2Fly Universe"),i.style.background="rgba(0,2,8,0.88)";let s="info",n="",a="",r="",l=!1;function c(){i.innerHTML=Li(s,e,n,a,r,l),d(),ee(i)}function p(){return n.trim().length>0||a.trim().length>0||r.trim().length>0}function m(){if(s==="info"){const S=i.querySelector("#place-display-name"),I=i.querySelector("#place-star-name"),M=i.querySelector("#place-message");S&&(n=S.value.trim()),I&&(a=I.value.trim()),M&&(r=M.value.trim())}p()?(l=!0,c()):v(!1)}function d(){if(i.querySelector("#place-back-header")?.addEventListener("click",()=>g()),i.querySelector("#place-close")?.addEventListener("click",()=>m()),l){i.querySelector("#unsaved-keep")?.addEventListener("click",()=>{l=!1,c()}),i.querySelector("#unsaved-discard")?.addEventListener("click",()=>{v(!1)});return}s==="info"&&i.querySelector("#place-next")?.addEventListener("click",()=>{const I=(i.querySelector("#place-display-name")?.value??"").trim(),M=(i.querySelector("#place-star-name")?.value??"").trim(),_=(i.querySelector("#place-message")?.value??"").trim();if(!I){const D=i.querySelector("#place-error");D&&(D.textContent="Display name is required.");return}n=I,a=M,r=_,s="confirm",c()}),s==="confirm"&&(i.querySelector("#place-back")?.addEventListener("click",()=>g()),i.querySelector("#place-confirm")?.addEventListener("click",async()=>{const S=i.querySelector("#place-confirm");S&&(S.disabled=!0,S.textContent="PLACING…");const I={galaxyId:e.galaxyId,regionId:e.regionId,x:e.x,y:e.y,z:e.z,displayName:n,starName:a||void 0,message:r||void 0},M=await Y.placestar(I);if(M.success&&M.star)x.setMyStarForGalaxy(M.star.galaxyId,M.star.id),x.addStar(M.star),s="ignition",c(),setTimeout(()=>{M.star&&_i(o,M.star,()=>v(!0))},2200);else{const _={collision:"That location is too close to another star. Please choose a different spot.","already-placed-in-galaxy":"You have already placed a star in this era galaxy.","already-placed":"You have already placed a star in this era galaxy.","rate-limit":"Please wait a moment before placing again.","server-error":"An error occurred. Please try again."};s="info",c();const D=i.querySelector("#place-error");D&&(D.textContent=_[M.error??"server-error"]??"An error occurred.")}}))}function g(){if(l){l=!1,c();return}s==="confirm"?(s="info",c()):s==="info"&&m()}const b=S=>{S.key==="Escape"&&(S.stopPropagation(),g())};window.addEventListener("keydown",b);function v(S){window.removeEventListener("keydown",b),i.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{i.remove(),t(S)},200)}return c(),o.appendChild(i),()=>{window.removeEventListener("keydown",b),v(!1)}}function Li(o,e,t,i,s,n){const a=`${e.x.toFixed(0)}, ${e.y.toFixed(0)}, ${e.z.toFixed(0)}`;if(n)return`
      <div style="
        position:relative;
        background:linear-gradient(135deg,#0a0408 0%,#180812 100%);
        border:1px solid rgba(240,100,120,0.3);
        border-radius:16px;
        padding:40px 32px 32px;
        max-width:400px;width:90vw;
        text-align:center;
        box-shadow:0 12px 40px rgba(0,0,0,0.8);
      ">
        <div style="font-size:2rem;margin-bottom:12px;color:#f06080;" aria-hidden="true">⚠️</div>
        <h3 style="font-family:'Space Mono',monospace;font-size:1rem;letter-spacing:0.08em;
          margin-bottom:12px;color:#f8d0d8;">
          Discard this unfinished star?
        </h3>
        <p style="font-size:0.78rem;color:#a87888;margin-bottom:24px;line-height:1.5;">
          You have unsaved star information. Leaving now will discard your current entries.
        </p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          <button id="unsaved-keep" type="button" style="${ae("#182838","#203850")}">
            KEEP EDITING
          </button>
          <button id="unsaved-discard" type="button" style="${ae("#801828","#a02038")} color:#ffd0d8;">
            DISCARD & RETURN
          </button>
        </div>
      </div>
    `;const r=`
    <div style="
      position:absolute;top:16px;left:16px;right:16px;
      display:flex;align-items:center;justify-content:space-between;
      pointer-events:auto;z-index:10;
    ">
      <button id="place-back-header" type="button" aria-label="Go Back"
        style="
          background:rgba(255,255,255,0.06);
          border:1px solid rgba(255,255,255,0.12);
          border-radius:4px;
          color:#8ab4d4;
          font-family:'Space Mono',monospace;
          font-size:0.65rem;
          letter-spacing:0.1em;
          padding:6px 12px;
          cursor:pointer;
          min-height:36px;
          display:flex;align-items:center;gap:4px;
        ">← BACK</button>

      <button id="place-close" type="button" aria-label="Cancel star placement"
        style="
          background:rgba(255,255,255,0.06);
          border:1px solid rgba(255,255,255,0.12);
          border-radius:4px;
          color:#8ab4d4;
          font-family:'Space Mono',monospace;
          font-size:0.65rem;
          letter-spacing:0.1em;
          padding:6px 12px;
          cursor:pointer;
          min-height:36px;
        ">CANCEL ×</button>
    </div>
  `;return o==="info"?`
    <div style="
      position:relative;
      background:linear-gradient(135deg,#020610 0%,#040c1e 100%);
      border:1px solid rgba(100,160,255,0.15);
      border-radius:16px;
      padding:60px 32px 32px;
      max-width:440px;width:90vw;
    ">
      ${r}
      <p style="font-size:0.65rem;letter-spacing:0.2em;color:#4070c0;margin-bottom:8px;
        text-transform:uppercase;font-family:'Space Mono',monospace;">
        PLACE YOUR STAR
      </p>
      <h2 style="font-family:'Space Mono',monospace;font-size:1rem;letter-spacing:0.08em;
        margin-bottom:6px;color:#c0d8f8;">
        Mark Your Place in the Universe
      </h2>
      <p style="font-size:0.75rem;color:#4a6888;margin-bottom:20px;line-height:1.6;">
        Coordinates: ${a}
      </p>
      <div id="place-error" role="alert" style="color:#f06060;font-size:0.78rem;
        margin-bottom:12px;min-height:18px;"></div>
      <label style="display:block;margin-bottom:16px;">
        <span style="font-size:0.7rem;letter-spacing:0.12em;color:#6090b8;text-transform:uppercase;
          display:block;margin-bottom:6px;">Display Name *</span>
        <input id="place-display-name" type="text" maxlength="60"
          placeholder="Your name or alias"
          value="${t}"
          style="${De()}"
          autocomplete="name" required />
      </label>
      <label style="display:block;margin-bottom:16px;">
        <span style="font-size:0.7rem;letter-spacing:0.12em;color:#6090b8;text-transform:uppercase;
          display:block;margin-bottom:6px;">Star Name (optional)</span>
        <input id="place-star-name" type="text" maxlength="60"
          placeholder="Name your star"
          value="${i}"
          style="${De()}" />
      </label>
      <label style="display:block;margin-bottom:24px;">
        <span style="font-size:0.7rem;letter-spacing:0.12em;color:#6090b8;text-transform:uppercase;
          display:block;margin-bottom:6px;">Message (optional)</span>
        <textarea id="place-message" maxlength="280" rows="3"
          placeholder="Leave a message for the Universe…"
          style="${De()} resize:vertical;height:80px;"
        >${s}</textarea>
      </label>
      <button id="place-next" type="button" style="${ae("#1a60c0","#2080e0")} width:100%;">
        PREVIEW MY STAR →
      </button>
    </div>
  `:o==="confirm"?`
    <div style="
      position:relative;
      background:linear-gradient(135deg,#020610 0%,#040c1e 100%);
      border:1px solid rgba(100,200,255,0.2);
      border-radius:16px;
      padding:60px 32px 32px;
      max-width:440px;width:90vw;
      text-align:center;
    ">
      ${r}
      <div style="font-size:2.8rem;margin-bottom:12px;color:#ffd700;" aria-hidden="true">✦</div>
      <p style="font-size:0.65rem;letter-spacing:0.2em;color:#4070c0;margin-bottom:8px;
        text-transform:uppercase;font-family:'Space Mono',monospace;">Confirm Placement</p>
      <h2 style="font-family:'Space Mono',monospace;font-size:1.1rem;letter-spacing:0.08em;
        margin-bottom:16px;color:#c0d8f8;">
        ${t}
      </h2>
      ${i?`<p style="color:#7090b0;font-size:0.85rem;margin-bottom:8px;">Star: "${i}"</p>`:""}
      ${s?`<p style="color:#5a7898;font-size:0.8rem;font-style:italic;margin-bottom:8px;">"${s}"</p>`:""}
      <p style="color:#3a5878;font-size:0.75rem;font-family:'Space Mono',monospace;margin-bottom:20px;">
        Coordinates: ${a}
      </p>
      <p style="color:#4a6888;font-size:0.75rem;margin-bottom:24px;line-height:1.6;">
        Your star is permanent. Confirm to ignite your light in this era galaxy.
      </p>
      <div style="display:flex;gap:12px;justify-content:center;">
        <button id="place-back" type="button" style="${ae("#1a2030","#202840")}">← BACK</button>
        <button id="place-confirm" type="button" style="${ae("#104080","#1060b0")}">IGNITE MY STAR ✦</button>
      </div>
    </div>
  `:o==="ignition"?`
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
        ${t} — Your star ignites
      </p>
    </div>
  `:""}function De(){return`
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
  `}function ae(o,e){return`
    display:inline-block;
    padding:12px 20px;
    background:${o};
    border:1px solid rgba(80,140,220,0.3);
    border-radius:6px;
    color:#a0d0f0;
    font-family:'Space Grotesk',sans-serif;
    font-size:0.75rem;
    letter-spacing:0.12em;
    text-transform:uppercase;
    cursor:pointer;
    transition:background 0.2s;
    --hover-bg:${e};
  `}async function Oi(o){const e=document.getElementById("overlay-layer"),t=document.getElementById("ui-layer"),i=document.getElementById("css3d-layer"),s=document.getElementById("loading-status"),n=Nt(o),a=new Lt;a.fog=new Ot(1032,15e-7);const r=new Vt(o),l=new Dt,c=new mt;s&&(s.textContent="Loading Universe data…");const p=await di();ui(p),s&&(s.textContent="Building 3D galaxies…"),await new Promise(u=>setTimeout(u,0));const m=new Ht;a.add(m.group);const d=[];for(const u of Fe()){const h=new Zt(u,i);a.add(h.group),d.push(h)}s&&(s.textContent="Placing visitor star clusters…"),await new Promise(u=>setTimeout(u,0));const g=new ti(i);a.add(g.group);const b=await Y.loadStars();x.set("stars",b),g.setStars(b,x.get("myStarId"));let v=null,S=null,I=null,M=null;const _=ft(),D=_.find(u=>u.id==="OBJ-FIRE");D&&(S=new ni(D,i),a.add(S.group));const Xe=_.find(u=>u.id==="OBJ-AFRICA");Xe&&(I=new oi(Xe,i),a.add(I.group));const Je=_.find(u=>u.id==="OBJ-STREAMS");Je&&(v=new si(Je,i),a.add(v.group)),M=new ai(_,i),a.add(M.group);const B=new wi(t,{onResetView:()=>{r.resetToHome(),B.setReturnAvailable(r.hasHistory())},onReturnPrevious:()=>{r.returnToPrevious(),B.setReturnAvailable(r.hasHistory())},onTakeTour:()=>{wt()},onViewMyStar:async u=>{const h=await Y.getStarById(u);h&&r.travelToObject({x:h.x,y:h.y,z:h.z},600,{onDone:()=>{j((f,y)=>Le(f,h,y))}})}});new Si(t,{onTravelToGalaxy:u=>{const[h,f,y]=le(u);r.travelToObject({x:h,y:f,z:y},14e3),B.setReturnAvailable(r.hasHistory())},onTravelToRegion:(u,h)=>{const[f,y,E]=gt(u,h);r.travelToObject({x:f,y,z:E},4500),B.setReturnAvailable(r.hasHistory())},onTravelToObject:u=>{const h=_.find(f=>f.id===u);if(h){const[f,y,E]=fi(h);r.travelToObject({x:f,y,z:E},1600),B.setReturnAvailable(r.hasHistory())}}});const xt=new Pt(659224,1.1);a.add(xt);let F=null;function j(u){F&&(F(),F=null);const h=r.snapshot();x.pushCameraSnapshot(h),e.setAttribute("aria-hidden","false"),e.classList.add("overlay-active"),F=u(e,()=>{e.setAttribute("aria-hidden","true"),e.classList.remove("overlay-active"),F=null;const f=x.popCameraSnapshot();f&&r.restoreSnapshot(f)})}o.addEventListener("click",u=>{if(F||x.get("placementMode"))return;if(c.x=u.clientX/window.innerWidth*2-1,c.y=-(u.clientY/window.innerHeight)*2+1,l.setFromCamera(c,r.camera),S){const f=l.intersectObjects(S.clickTargets);if(f.length>0){const y=f[0].object,E=y.userData.childId;if(E){const k=S.getChildData(E);if(k){const C=new w;y.getWorldPosition(C),r.travelToObject(C,600,{onDone:()=>ge(k)})}return}if(y.userData.objectId==="OBJ-FIRE"){r.travelToObject(S.getPlanetWorldPos(),1500);return}}}if(I){const f=l.intersectObjects(I.clickTargets);if(f.length>0){const y=f[0].object,E=y.userData.childId;if(E){const k=I.getChildData(E);if(k){const C=new w;y.getWorldPosition(C),r.travelToObject(C,600,{onDone:()=>ge(k)})}return}if(y.userData.objectId==="OBJ-AFRICA"){r.travelToObject(I.getPlanetWorldPos(),1500);return}}}if(v){const f=l.intersectObjects(v.clickTargets);if(f.length>0){const y=f[0].object,E=y.userData.childId;if(E){const k=v.getChildData(E);if(k){const C=new w;y.getWorldPosition(C),r.travelToObject(C,600,{onDone:()=>ge(k)})}return}if(y.userData.objectId==="OBJ-STREAMS"){r.travelToObject(v.getPlanetWorldPos(),1500);return}}}if(M){const f=l.intersectObjects(M.clickTargets);if(f.length>0){const y=f[0].object,E=y.userData.childId,k=y.userData.objectId;if(E){const C=M.getChildData(E);if(C){const V=new w;y.getWorldPosition(V),r.travelToObject(V,600,{onDone:()=>ge(C)})}return}if(k){const C=new w;y.getWorldPosition(C),r.travelToObject(C,1400);return}}}const h=g.getClickTarget(l);if(h){const f=x.get("stars").find(y=>y.id===h.starId);f&&j((y,E)=>Le(y,f,E))}});let ie=null,N=null;function Ee(){N&&(N.remove(),N=null)}function Ze(){Ee(),x.set("placementMode",!1),B.setPlacementMode(!1),ie&&r.restoreSnapshot(ie,!0)}window.addEventListener("universe-start-placement",()=>{ie=r.snapshot(),Ee(),N=document.createElement("div"),N.id="placement-mode-banner",N.style.cssText=`
      position:fixed;top:16px;left:50%;transform:translateX(-50%);
      background:rgba(2,10,24,0.92);border:1px solid rgba(96,255,208,0.4);
      border-radius:8px;padding:8px 16px;display:flex;align-items:center;gap:12px;
      z-index:60;font-family:'Space Mono',monospace;font-size:0.7rem;color:#60ffd0;
      box-shadow:0 8px 32px rgba(0,0,0,0.6);
    `,N.innerHTML=`
      <span>✦ PLACING STAR — CLICK ANYWHERE TO CHOOSE COORDINATE</span>
      <button id="cancel-placement-banner-btn" type="button" style="
        background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);
        border-radius:4px;color:#8ab4d4;padding:4px 10px;cursor:pointer;
        font-family:'Space Mono',monospace;font-size:0.65rem;
      ">← CANCEL</button>
    `,t.appendChild(N),N.querySelector("#cancel-placement-banner-btn")?.addEventListener("click",()=>{Ze()})}),window.addEventListener("keydown",u=>{u.key==="Escape"&&x.get("placementMode")&&Ze()}),o.addEventListener("click",u=>{if(!x.get("placementMode"))return;Ee(),c.x=u.clientX/window.innerWidth*2-1,c.y=-(u.clientY/window.innerHeight)*2+1,l.setFromCamera(c,r.camera);const h=new $t(new w(0,1,0),0),f=new w;if(l.ray.intersectPlane(h,f),!f)return;let y="G2025",E="G2025-R3",k=1/0;for(const C of Object.keys(z)){const[V,,se]=le(C),W=Math.sqrt((f.x-V)**2+(f.z-se)**2);W<k&&(k=W,y=C,E=`${C}-R1`)}x.set("placementMode",!1),B.setPlacementMode(!1),j((C,V)=>zi(C,{galaxyId:y,regionId:E,x:f.x,y:f.y+50,z:f.z},se=>{if(se){const W=Y.getMyStarId();W&&Y.getStarById(W).then(ne=>{ne&&(g.addStar(ne),r.travelToObject({x:ne.x,y:ne.y,z:ne.z},600))})}else ie&&r.restoreSnapshot(ie,!0);V()}))});function ge(u){if(!u)return;const h=u.mediaKind;j(h==="audio"?(f,y)=>Mi(f,u,y):h==="video"?(f,y)=>Ei(f,u,y):h==="playable"?(f,y)=>Ci(f,u,y):(f,y)=>Ti(f,u,y))}function wt(){const u=[{name:"Thru the Fire System",pos:S?.getPlanetWorldPos()??{x:-4500,y:40,z:-2500}},{name:"I Woke Up in Africa System",pos:I?.getPlanetWorldPos()??{x:0,y:40,z:4e3}},{name:"Streams System",pos:v?.getPlanetWorldPos()??{x:4e3,y:40,z:-2e3}}],h=u[Math.floor(Math.random()*u.length)];r.travelToObject(h.pos,1500,{onDone:()=>{St(`DESTINATION ARRIVED — ${h.name}`)}}),B.setReturnAvailable(!0)}function St(u){const h=document.createElement("div");h.style.cssText=`
      position:absolute;top:70px;left:50%;transform:translateX(-50%);
      background:rgba(2,10,24,0.9);border:1px solid rgba(80,160,240,0.3);
      border-radius:6px;padding:8px 16px;font-family:'Space Mono',monospace;
      font-size:0.65rem;letter-spacing:0.15em;color:#8ab4d4;
      text-transform:uppercase;pointer-events:none;z-index:60;
      animation:fade-in-text 0.3s ease;
    `,h.textContent=u,t.appendChild(h),setTimeout(()=>h.remove(),3e3)}let Qe=!1;function Mt(){if(Qe)return;Qe=!0;const u=document.createElement("div");if(u.style.cssText=`
      position:fixed;inset:0;pointer-events:none;z-index:90;
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      text-align:center;font-family:'Space Mono',monospace;
      animation:title-fade 3.5s ease forwards;
    `,u.innerHTML=`
      <div style="font-size:0.7rem;letter-spacing:0.3em;color:#4090c0;margin-bottom:8px;text-transform:uppercase;">
        2FLY UNIVERSE
      </div>
      <div style="font-size:clamp(1.2rem,3vw,2rem);letter-spacing:0.2em;color:#60ffd0;font-weight:bold;margin-bottom:8px;">
        2025 — 2029
      </div>
      <div style="font-size:0.75rem;letter-spacing:0.2em;color:#4a7898;text-transform:uppercase;">
        THE CURRENT GALAXY
      </div>
    `,!document.getElementById("title-anim-style")){const h=document.createElement("style");h.id="title-anim-style",h.textContent=`
        @keyframes title-fade {
          0% { opacity:0; transform:scale(0.96); }
          20% { opacity:1; transform:scale(1); }
          75% { opacity:1; transform:scale(1); }
          100% { opacity:0; transform:scale(1.04); }
        }
      `,document.head.appendChild(h)}e.appendChild(u),setTimeout(()=>u.remove(),3600)}setTimeout(Mt,1e3),ze.init(),ze.on(async u=>{if(u.type==="star"&&u.starId){const h=await Y.getStarById(u.starId);h&&await ki(e,h,()=>{r.travelToObject({x:h.x,y:h.y,z:h.z},700,{onDone:()=>{j((f,y)=>Le(f,h,y))}})})}if(u.type==="galaxy"&&u.galaxyId){const[h,f,y]=le(u.galaxyId);r.travelToObject({x:h,y:f,z:y},12e3),x.set("currentGalaxyId",u.galaxyId)}u.type==="universe"&&r.resetToHome()}),window.addEventListener("universe-esc",()=>{if(F){F();return}ze.back()});let Ce=0;Gt(u=>{Ce+=u,r.update(u);const h=r.camera.position;let f=null,y=1/0;for(const[E,k]of Object.entries(z)){const[C,V,se]=k.worldOffset,W=Math.hypot(h.x-C,h.y-V,h.z-se);W<y&&(y=W,f=E)}f!==x.get("currentGalaxyId")&&x.set("currentGalaxyId",f),h.distanceTo(new w(-4500,40,-2500))<4e3?T.setRegionTheme("fire"):h.distanceTo(new w(0,40,4e3))<4e3?T.setRegionTheme("africa"):h.distanceTo(new w(4e3,40,-2e3))<4500?T.setRegionTheme("frontier"):T.setRegionTheme(null),m.update(Ce);for(const E of d)E.update(Ce),E.updateLabels(r.camera,n,h);S?.update(u,r.camera,n),I?.update(u,r.camera,n),v?.update(u,r.camera,n),M?.update(u,r.camera,n),g.update(h,r.camera,n),n.render(a,r.camera)}),x.set("loaded",!0);const ye=document.getElementById("loading-screen");ye&&(ye.style.transition="opacity 0.8s",ye.style.opacity="0",setTimeout(()=>ye.remove(),800))}async function Pi(){const o=document.getElementById("universe-canvas");if(!o)throw new Error("No canvas element found");try{await Oi(o)}catch(e){if(console.error("[2Fly Universe] Fatal init error:",e),document.getElementById("loading-screen")){const i=document.getElementById("loading-status");i&&(i.textContent="Universe failed to initialize. Please refresh.",i.style.color="#f06060")}}}Pi();
