import{W as wt,S as lt,A as St,V as x,a as ct,b as Mt,P as Et,M as Se,G as Y,B as ae,C as T,c as $,d as Z,e as H,f as ne,g as dt,T as Ct,h as Tt,i as It,j as xe,R as ce,k as j,D as de,l as _,O as At,m as N,I as Xe,n as Je,o as L,p as ve,q as re,r as Fe,s as le,t as _t,u as Rt,F as kt,v as zt,w as Lt,x as Ot}from"./three-B6iN8XL-.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}})();let P=null,je=!1,Oe=null,Pe=0,De=!1;function Pt(a){const e=Math.min(window.devicePixelRatio,2);return P=new wt({canvas:a,antialias:e<2,alpha:!1,powerPreference:"high-performance",stencil:!1,depth:!0}),P.setPixelRatio(e),P.setSize(a.clientWidth,a.clientHeight,!1),P.outputColorSpace=lt,P.toneMapping=St,P.toneMappingExposure=1.1,P.shadowMap.enabled=!1,new ResizeObserver(i=>{const s=i[0];if(!s||!P)return;const{width:o,height:n}=s.contentRect,r=Math.min(window.devicePixelRatio,2);P.setSize(o,n,!1),P.setPixelRatio(r),window.dispatchEvent(new CustomEvent("universe-resize",{detail:{width:o,height:n}}))}).observe(a),document.addEventListener("visibilitychange",()=>{De=document.hidden,!De&&je&&Ve()}),P}function Dt(a){Oe=a,je=!0,Pe=performance.now(),Ve()}function Ve(){if(!je||De)return;requestAnimationFrame(Ve);const a=performance.now(),e=Math.min((a-Pe)/1e3,.05);Pe=a,Oe&&Oe(e)}const k={G2025:{id:"G2025",title:"2025–2029",primaryColor:3201168,accentColor:6356944,nebulaColor:538656,dustColor:269328,starTint:10551256,worldOffset:[4800,800,-2e3],scale:1.3,texturePath:"assets/galaxies/galaxy_2025_2029.png",status:"showcase"},G2020:{id:"G2020",title:"2020–2024",primaryColor:2652360,accentColor:5286128,nebulaColor:532544,dustColor:266270,starTint:11065599,worldOffset:[32800,14e3,8400],scale:1,texturePath:"assets/galaxies/galaxy_2020_2024.png",status:"known"},G2015:{id:"G2015",title:"2015–2019",primaryColor:6308032,accentColor:9461992,nebulaColor:2099280,dustColor:1049640,starTint:13674751,worldOffset:[28800,-12e3,-11200],scale:.95,texturePath:"assets/galaxies/galaxy_2015_2019.png",status:"known"},G2010:{id:"G2010",title:"2010–2014",primaryColor:1751224,accentColor:4251856,nebulaColor:671808,dustColor:530464,starTint:10551264,worldOffset:[-4800,20800,-30400],scale:.9,texturePath:"assets/galaxies/galaxy_2010_2014.png",status:"known"},G2005:{id:"G2005",title:"2005–2009",primaryColor:12869674,accentColor:14710848,nebulaColor:9052224,dustColor:4001808,starTint:16760960,worldOffset:[-26e3,-13200,7200],scale:.85,texturePath:"assets/galaxies/galaxy_2005_2009.png",status:"known"},G2000:{id:"G2000",title:"2000–2004",primaryColor:12877098,accentColor:15247434,nebulaColor:8007696,dustColor:4004360,starTint:16769184,worldOffset:[-36e3,9600,-2e4],scale:.8,texturePath:"assets/galaxies/galaxy_2000_2004.png",status:"known"},G2030:{id:"G2030",title:"2030–2034 UNCHARTED",primaryColor:4214896,accentColor:6320272,nebulaColor:1054760,dustColor:527380,starTint:8429760,worldOffset:[7200,-24800,-36e3],scale:.75,texturePath:"assets/galaxies/galaxy_2030_2034.png",status:"uncharted"}},fe={position:[0,22e3,58e3],target:[0,0,0]},$e=[[-4500,0,-2500],[0,0,4e3],[5e3,0,-2e3]],$t=180,Nt=4500,Gt=400,Me=window.matchMedia("(prefers-reduced-motion: reduce)").matches,Ut=6e3;class Bt{camera;target=new x;fly=null;historyStack=[];isDragging=!1;prevMouse=new ct;spherical=new Mt;tmpVec=new x;velTheta=0;velPhi=0;velRadius=0;DAMPING=.08;lastUserActivity=performance.now();isIdleDrifting=!1;driftTime=0;constructor(e){this.camera=new Et(55,window.innerWidth/window.innerHeight,10,2e6);const[t,i,s]=fe.position,[o,n,r]=fe.target;this.camera.position.set(t,i,s),this.target.set(o,n,r),this.camera.lookAt(this.target),this.tmpVec.subVectors(this.camera.position,this.target),this.spherical.setFromVector3(this.tmpVec),this._bindEvents(e),window.addEventListener("universe-resize",l=>{const c=l;this.camera.aspect=c.detail.width/c.detail.height,this.camera.updateProjectionMatrix()})}_onActivity(){this.lastUserActivity=performance.now(),this.isIdleDrifting&&(this.isIdleDrifting=!1)}_bindEvents(e){const t=()=>this._onActivity();window.addEventListener("pointermove",t,{passive:!0}),window.addEventListener("wheel",t,{passive:!0}),window.addEventListener("keydown",t,{passive:!0}),window.addEventListener("touchstart",t,{passive:!0}),e.addEventListener("mousedown",o=>{this._onActivity(),this.isDragging=!0,this.prevMouse.set(o.clientX,o.clientY)}),e.addEventListener("mousemove",o=>{if(!this.isDragging)return;this._onActivity();const n=o.clientX-this.prevMouse.x,r=o.clientY-this.prevMouse.y;this._orbit(n*.004,r*.004),this.prevMouse.set(o.clientX,o.clientY)}),window.addEventListener("mouseup",()=>{this.isDragging=!1}),e.addEventListener("wheel",o=>this._onWheel(o),{passive:!1}),e.addEventListener("dblclick",o=>this._onDblClick(o));let i=0,s=[];e.addEventListener("touchstart",o=>{this._onActivity(),s=Array.from(o.touches),s.length===1?(this.isDragging=!0,this.prevMouse.set(s[0].clientX,s[0].clientY)):s.length===2&&(this.isDragging=!1,i=Ze(s))},{passive:!0}),e.addEventListener("touchmove",o=>{if(this._onActivity(),s=Array.from(o.touches),s.length===1&&this.isDragging){const n=s[0].clientX-this.prevMouse.x,r=s[0].clientY-this.prevMouse.y;this._orbit(n*.006,r*.005),this.prevMouse.set(s[0].clientX,s[0].clientY)}else if(s.length===2){const n=Ze(s),r=i-n;this._zoom(r*.01),i=n}},{passive:!0}),e.addEventListener("touchend",()=>{this.isDragging=!1}),window.addEventListener("keydown",o=>{o.key==="Escape"&&window.dispatchEvent(new CustomEvent("universe-esc"))})}_orbit(e,t){this.velTheta-=e,this.velPhi-=t}_onWheel(e){e.preventDefault(),this._onActivity();const t=e.deltaY*.001;this._zoom(t)}_zoom(e){this.velRadius+=e*this.spherical.radius*.3}_onDblClick(e){this._onActivity(),this.velRadius-=this.spherical.radius*.35}update(e){if(this.fly){this._updateFly(e);return}const t=performance.now();!Me&&!this.isDragging&&t-this.lastUserActivity>Ut&&(this.isIdleDrifting=!0),this.isIdleDrifting?(this.driftTime+=e,this.spherical.theta+=e*.035,this.spherical.phi=Se.clamp(this.spherical.phi+Math.sin(this.driftTime*.2)*2e-4,.05,Math.PI-.05)):(this.spherical.theta+=this.velTheta,this.spherical.phi=Se.clamp(this.spherical.phi+this.velPhi,.05,Math.PI-.05),this.spherical.radius=Se.clamp(this.spherical.radius+this.velRadius,150,32e4),this.velTheta*=1-this.DAMPING,this.velPhi*=1-this.DAMPING,this.velRadius*=1-this.DAMPING),this.tmpVec.setFromSpherical(this.spherical).add(this.target),this.camera.position.copy(this.tmpVec),this.camera.lookAt(this.target)}_updateFly(e){if(!this.fly)return;const t=16;this.fly.elapsed+=t;const i=Me?1:Math.min(this.fly.elapsed/this.fly.duration,1),s=Ft(i);if(this.camera.position.lerpVectors(this.fly.startPos,this.fly.endPos,s),this.target.lerpVectors(this.fly.startTarget,this.fly.endTarget,s),this.camera.lookAt(this.target),i>=1){const o=this.fly.onDone;this.fly=null,this.tmpVec.subVectors(this.camera.position,this.target),this.spherical.setFromVector3(this.tmpVec),this.velTheta=0,this.velPhi=0,this.velRadius=0,o?.()}}flyTo(e,t,i={}){i.saveHistory&&this.historyStack.push(this.snapshot());const s=Me?200:i.duration??1100;this.fly={startPos:this.camera.position.clone(),startTarget:this.target.clone(),endPos:new x(e.x,e.y,e.z),endTarget:new x(t.x,t.y,t.z),elapsed:0,duration:s,onDone:i.onDone}}travelToObject(e,t=1200,i={}){const s=new x(t*.7,t*.45,t*.7),o={x:e.x+s.x,y:e.y+s.y,z:e.z+s.z};this.flyTo(o,e,{duration:1200,saveHistory:!0,...i})}resetToHome(e={}){const[t,i,s]=fe.position,[o,n,r]=fe.target;this.flyTo({x:t,y:i,z:s},{x:o,y:n,z:r},{duration:1400,saveHistory:!0,...e})}returnToPrevious(e={}){const t=this.historyStack.pop();return t?(this.restoreSnapshot(t,!0),!0):!1}hasHistory(){return this.historyStack.length>0}snapshot(){return{position:[this.camera.position.x,this.camera.position.y,this.camera.position.z],target:[this.target.x,this.target.y,this.target.z],zoom:this.spherical.radius}}restoreSnapshot(e,t=!0){const i={x:e.position[0],y:e.position[1],z:e.position[2]},s={x:e.target[0],y:e.target[1],z:e.target[2]};t?this.flyTo(i,s,{duration:800}):(this.camera.position.set(i.x,i.y,i.z),this.target.set(s.x,s.y,s.z),this.camera.lookAt(this.target),this.tmpVec.subVectors(this.camera.position,this.target),this.spherical.setFromVector3(this.tmpVec))}getTarget(){return this.target.clone()}getRadius(){return this.spherical.radius}isBusy(){return this.fly!==null}}function Ft(a){return a<.5?4*a*a*a:1-Math.pow(-2*a+2,3)/2}function Ze(a){const e=a[1].clientX-a[0].clientX,t=a[1].clientY-a[0].clientY;return Math.sqrt(e*e+t*t)}const ge=6e4;class jt{group;starsMesh;dustMesh;constructor(){this.group=new Y,this._buildStarfield(),this._buildDust()}_buildStarfield(){const e=new ae,t=new Float32Array(ge*3),i=new Float32Array(ge*3),s=new Float32Array(ge),o=6e5,n=[new T(16774632),new T(15266047),new T(16769200),new T(11589887),new T(16765136)];for(let l=0;l<ge;l++){const c=l*3,p=Math.random()*Math.PI*2,m=Math.pow(Math.random(),.5)*o,d=(Math.random()-.5)*o*.35;t[c]=Math.cos(p)*m,t[c+1]=d,t[c+2]=Math.sin(p)*m;const g=n[Math.floor(Math.random()*n.length)];i[c]=g.r,i[c+1]=g.g,i[c+2]=g.b,s[l]=.5+Math.random()*2.5}e.setAttribute("position",new $(t,3)),e.setAttribute("color",new $(i,3)),e.setAttribute("size",new $(s,1));const r=new Z({uniforms:{time:{value:0}},vertexShader:`
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
      `,transparent:!0,depthWrite:!1,blending:H});this.starsMesh=new ne(e,r),this.starsMesh.renderOrder=-10,this.group.add(this.starsMesh)}_buildDust(){const t=new ae,i=new Float32Array(1e4*3),s=25e4;for(let n=0;n<1e4;n++){const r=n*3;i[r]=(Math.random()-.5)*s,i[r+1]=(Math.random()-.5)*s*.2,i[r+2]=(Math.random()-.5)*s}t.setAttribute("position",new $(i,3));const o=new dt({color:3491944,size:90,transparent:!0,opacity:.05,depthWrite:!1,blending:H});this.dustMesh=new ne(t,o),this.dustMesh.renderOrder=-9,this.group.add(this.dustMesh)}update(e){const t=this.starsMesh.material;t.uniforms.time.value=e,this.dustMesh.position.y=Math.sin(e*.03)*150}dispose(){this.starsMesh.geometry.dispose(),this.starsMesh.material.dispose(),this.dustMesh.geometry.dispose(),this.dustMesh.material.dispose()}}const Vt=new Ct,Wt=3e4,Ht=15e4,Yt=6e3,Kt=22e3;class qt{constructor(e,t){this.data=e,this.group=new Y,this.labelContainer=t;const i=k[e.id];if(!i)return;const[s,o,n]=i.worldOffset;this.group.position.set(s,o,n),this.group.scale.setScalar(i.scale??1),this._buildSprite(i),this._buildCore(i),this._buildRegionMarkers(i),this._buildLabel(),this._buildRegionLabels()}group;labelEls=[];labelContainer;orbitRings=[];galaxySprite;galaxyLight;_buildSprite(e){Vt.load(e.texturePath,t=>{t.colorSpace=lt;const i=new Tt({map:t,transparent:!0,opacity:e.status==="uncharted"?.45:.85,blending:H,depthWrite:!1}),s=new It(i),o=e.status==="showcase"?14e3:1e4;s.scale.set(o,o,1),s.position.set(0,0,0),s.renderOrder=-5,this.group.add(s),this.galaxySprite=s},void 0,()=>{})}_buildCore(e){const t=e.status==="showcase",i=e.status==="uncharted",s=t?2400:i?600:1200,o=new ae,n=new Float32Array(s*3),r=new Float32Array(s),l=t?9e3:7e3;for(let d=0;d<s;d++){const g=Math.random()*Math.PI*2,b=Math.pow(Math.random(),1.4)*l,v=(Math.random()-.5)*900;n[d*3]=Math.cos(g)*b,n[d*3+1]=v,n[d*3+2]=Math.sin(g)*b,r[d]=(t?25:16)+Math.random()*80}o.setAttribute("position",new $(n,3)),o.setAttribute("size",new $(r,1));const c=new T(e.primaryColor),p=new Z({uniforms:{color:{value:c},time:{value:0}},vertexShader:`
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
      `,transparent:!0,depthWrite:!1,blending:H}),m=new ne(o,p);this.group.add(m),this.galaxyLight=new xe(e.primaryColor,t?1.4:.6,25e3),this.galaxyLight.position.set(0,0,0),this.group.add(this.galaxyLight)}_buildRegionMarkers(e){for(const t of $e){const i=new ce(650,720,64),s=new j({color:e.accentColor,transparent:!0,opacity:.15,side:de,depthWrite:!1}),o=new _(i,s);o.position.set(t[0],t[1],t[2]),o.rotation.x=-Math.PI/2,this.orbitRings.push(o),this.group.add(o)}}_buildLabel(){const e=k[this.data.id],t=e?.status==="showcase",i=e?.status==="uncharted",s=document.createElement("div");s.className="universe-label galaxy-label",s.dataset.galaxyId=this.data.id,s.innerHTML=`
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
    `,this.labelContainer.appendChild(s);const o=new x(0,1800,0);this.labelEls.push({el:s,pos:o,kind:"galaxy"})}_buildRegionLabels(){const e=this.data.regions;for(let t=0;t<e.length;t++){const i=e[t],s=$e[t]??[0,0,0],o=document.createElement("div");o.className="universe-label region-label",o.dataset.regionId=i.id,o.innerHTML=`
        <span style="font-weight:600;color:#c0e0ff;">${i.title}</span>
        ${i.subtitle?`<br/><span style="font-size:0.8em;opacity:0.7;font-weight:normal;">${i.subtitle}</span>`:""}
      `,o.style.cssText=`
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
      `,this.labelContainer.appendChild(o);const n=new x(s[0],s[1]+750,s[2]);this.labelEls.push({el:o,pos:n,kind:"region"})}}updateLabels(e,t,i){const{width:s,height:o}=t.domElement.getBoundingClientRect();for(const{el:n,pos:r,kind:l}of this.labelEls){const c=new x().copy(r);this.group.localToWorld(c);const p=i.distanceTo(c);let m=0;l==="galaxy"?m=Qe(p,Ht,Wt):m=Qe(p,Kt,Yt);const d=c.clone().project(e),g=(d.x*.5+.5)*s,b=(-(d.y*.5)+.5)*o;d.z>1||m<.02?(n.style.opacity="0",n.style.pointerEvents="none"):(n.style.opacity=String(m),n.style.left=`${g}px`,n.style.top=`${b}px`)}}update(e){this.galaxySprite&&(this.galaxySprite.rotation.z=e*.015);for(const t of this.orbitRings){const i=t.material;i.opacity=.1+.08*Math.sin(e*.5)}}dispose(){for(const{el:e}of this.labelEls)e.remove();this.galaxySprite?.material.dispose()}}function Qe(a,e,t){return a>=e?0:a<=t?1:1-(a-t)/(e-t)}const Xt=3e3,Jt=6e4;class Zt{group;instancedFar;instancedMid;nearMeshes=new Map;stars=[];dummy=new At;labelContainer;labelEls=new Map;myStarId=null;constructor(e){this.group=new Y,this.labelContainer=e,this._buildFarInstanced(),this._buildMidInstanced()}_buildFarInstanced(){const e=new N(30,4,4),t=new j({color:16777215,transparent:!0,opacity:.7});this.instancedFar=new Xe(e,t,25e3),this.instancedFar.instanceMatrix.setUsage(Je),this.instancedFar.count=0,this.group.add(this.instancedFar)}_buildMidInstanced(){const e=new N(60,6,6),t=new j({color:16777215});this.instancedMid=new Xe(e,t,25e3),this.instancedMid.instanceMatrix.setUsage(Je),this.instancedMid.count=0,this.instancedMid.visible=!1,this.group.add(this.instancedMid)}setStars(e,t=null){this.stars=e,this.myStarId=t,this._rebuildFar()}_rebuildFar(){const e=new T;let t=0;for(const i of this.stars){if(t>=25e3)break;this.dummy.position.set(i.x,i.y,i.z),this.dummy.scale.setScalar(i.id===this.myStarId?1.8:1),this.dummy.updateMatrix(),this.instancedFar.setMatrixAt(t,this.dummy.matrix);const s=k[i.galaxyId],o=s?new T(s.starTint):e.set(16777215);i.id===this.myStarId&&o.setHex(16766720),this.instancedFar.setColorAt(t,o),t++}this.instancedFar.count=t,this.instancedFar.instanceMatrix.needsUpdate=!0,this.instancedFar.instanceColor&&(this.instancedFar.instanceColor.needsUpdate=!0)}update(e,t,i){const{width:s,height:o}=i.domElement.getBoundingClientRect(),n=e.length();this.instancedFar.visible=!0,this.instancedMid.visible=!1;for(const r of this.stars){const l=new x(r.x,r.y,r.z),c=e.distanceTo(l);c<Xt?(this._ensureNearMesh(r),this._updateLabel(r,l,t,s,o,c)):(this._removeNearMesh(r.id),this._updateLabel(r,l,t,s,o,c))}n<3e4||e.distanceTo(this.group.position)<Jt}_ensureNearMesh(e){if(this.nearMeshes.has(e.id))return;const t=new N(80,12,12),i=k[e.galaxyId],s=i?i.starTint:16777215,o=new L({color:s,emissive:s,emissiveIntensity:.6,roughness:.1,metalness:.4}),n=new _(t,o);n.position.set(e.x,e.y,e.z),n.userData.starId=e.id,this.group.add(n),this.nearMeshes.set(e.id,n)}_removeNearMesh(e){const t=this.nearMeshes.get(e);t&&(this.group.remove(t),t.material.dispose(),t.geometry.dispose(),this.nearMeshes.delete(e))}_updateLabel(e,t,i,s,o,n){const c=1-Math.min(1,Math.max(0,(n-1200)/2800));if(c<.02){const b=this.labelEls.get(e.id);b&&(b.style.opacity="0");return}let p=this.labelEls.get(e.id);p||(p=document.createElement("div"),p.className="universe-label star-label",p.style.cssText=`
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
      `,p.textContent=e.displayName,this.labelContainer.appendChild(p),this.labelEls.set(e.id,p));const m=t.clone().project(i),d=(m.x*.5+.5)*s,g=(-(m.y*.5)+.5)*o;m.z>1?p.style.opacity="0":(p.style.opacity=String(c),p.style.left=`${d}px`,p.style.top=`${g}px`)}getClickTarget(e){const t=Array.from(this.nearMeshes.values()),i=e.intersectObjects(t);if(i.length>0){const o=i[0].object.userData.starId;return o?{starId:o}:null}const s=e.intersectObject(this.instancedFar);if(s.length>0&&s[0].instanceId!==void 0){const o=this.stars[s[0].instanceId];return o?{starId:o.id}:null}return null}addStar(e){this.stars.push(e),this._rebuildFar()}dispose(){for(const[,e]of this.labelEls)e.remove();this.instancedFar.dispose(),this.instancedMid.dispose();for(const[,e]of this.nearMeshes)e.geometry.dispose(),e.material.dispose()}}const et=[800,1300,1900,2600],Qt=[.35,.22,.14,.09];class ei{group;planetMesh;children=[];labelContainer;time=0;objectData;onObjectClick=null;clickTargets=[];constructor(e,t){this.objectData=e,this.labelContainer=t,this.group=new Y,this.group.position.set(e.position.x,e.position.y,e.position.z);const i=k.G2020;i&&(this.group.position.x+=i.worldOffset[0],this.group.position.z+=i.worldOffset[2]),this._buildPlanet(),this._buildOrbitRings(),this._buildChildren()}_buildPlanet(){const e=new N(420,48,48),t=new Z({uniforms:{time:{value:0},deepColor:{value:new T(268328)},shallowColor:{value:new T(673904)},rimColor:{value:new T(2150608)}},vertexShader:`
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
      `,transparent:!1});this.planetMesh=new _(e,t),this.planetMesh.userData.objectId=this.objectData.id,this.group.add(this.planetMesh),this.clickTargets.push(this.planetMesh);const i=new xe(2138320,1.2,5e3);this.group.add(i)}_buildOrbitRings(){for(const e of et){const t=new ce(e-4,e+4,96),i=new j({color:1720416,transparent:!0,opacity:.25,side:de,depthWrite:!1}),s=new _(t,i);s.rotation.x=-Math.PI/2,this.group.add(s)}}_buildChildren(){const e=this.objectData.children??[],t={audio:"♪",video:"▶",playable:"⚡",archive:"◈"},i={audio:16765056,video:16744544,playable:8454016,archive:12632319};for(let s=0;s<e.length;s++){const o=e[s],n=et[s]??800+s*500,r=Qt[s]??.08,l=s/e.length*Math.PI*2,c=(s%2===0?1:-1)*(s*60),p=o.mediaKind??"archive",m=i[p]??16777215;let d;p==="playable"?d=new ve(90,1):p==="audio"?d=new re(60,22,12,40):p==="video"?d=new Fe(0,80,160,8):d=new le(70,0);const g=new L({color:m,emissive:m,emissiveIntensity:.3,roughness:.3,metalness:.6}),b=new _(d,g);b.position.set(Math.cos(l)*n,c,Math.sin(l)*n),b.userData.childId=o.id,b.userData.contentStatus=o.contentStatus,this.group.add(b),this.clickTargets.push(b);const v=document.createElement("div");v.className="universe-label streams-child-label",v.style.cssText=`
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
      `,v.innerHTML=`<span>${t[p]??"○"}</span><br/><span>${o.title}</span>`,this.labelContainer.appendChild(v),this.children.push({id:o.id,title:o.title,mediaKind:p,contentStatus:o.contentStatus??"awaiting-source",mesh:b,orbitRadius:n,orbitSpeed:r,orbitAngle:l,orbitY:c,labelEl:v})}}update(e,t,i){this.time+=e;const s=this.planetMesh.material;s.uniforms.time.value=this.time,this.planetMesh.rotation.y+=e*.06;for(const o of this.children)o.orbitAngle+=e*o.orbitSpeed,o.mesh.position.set(Math.cos(o.orbitAngle)*o.orbitRadius,o.orbitY,Math.sin(o.orbitAngle)*o.orbitRadius),o.mesh.rotation.y+=e*.5,o.mesh.rotation.x+=e*.3;this._updateLabels(t,i)}_updateLabels(e,t){const{width:i,height:s}=t.domElement.getBoundingClientRect(),o=new x;e.getWorldPosition(o);for(const n of this.children){const r=new x;n.mesh.getWorldPosition(r);const l=o.distanceTo(r),c=800,m=1-Math.min(1,Math.max(0,(l-c)/(3500-c))),d=r.clone().project(e),g=(d.x*.5+.5)*i,b=(-(d.y*.5)+.5)*s;d.z>1||m<.02?n.labelEl.style.opacity="0":(n.labelEl.style.opacity=String(m),n.labelEl.style.left=`${g}px`,n.labelEl.style.top=`${b}px`)}}getChildData(e){return this.children.find(t=>t.id===e)}getPlanetWorldPos(){const e=new x;return this.planetMesh.getWorldPosition(e),e}dispose(){for(const e of this.children)e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.labelEl.remove();this.planetMesh.geometry.dispose(),this.planetMesh.material.dispose()}}class ti{group;planetMesh;emberParticles;children=[];labelContainer;time=0;objectData;clickTargets=[];constructor(e,t){this.objectData=e,this.labelContainer=t,this.group=new Y;const[i,s,o]=k.G2025?.worldOffset??[0,0,0];this.group.position.set(i+e.position.x,s+e.position.y,o+e.position.z),this._buildMoltenPlanet(),this._buildEmbers(),this._buildOrbitRings(),this._buildChildren()}_buildMoltenPlanet(){const e=new N(450,48,48),t=new Z({uniforms:{time:{value:0},crustColor:{value:new T(1574918)},moltenColor:{value:new T(14965544)},emberGlow:{value:new T(16750848)}},vertexShader:`
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
      `});this.planetMesh=new _(e,t),this.planetMesh.userData.objectId=this.objectData.id,this.group.add(this.planetMesh),this.clickTargets.push(this.planetMesh);const i=new xe(14965544,1.5,6e3);this.group.add(i)}_buildEmbers(){const t=new ae,i=new Float32Array(600*3),s=new Float32Array(600);for(let n=0;n<600;n++){const r=Math.random()*Math.PI*2,l=Math.acos(Math.random()*2-1),c=470+Math.random()*350;i[n*3]=c*Math.sin(l)*Math.cos(r),i[n*3+1]=c*Math.sin(l)*Math.sin(r),i[n*3+2]=c*Math.cos(l),s[n]=4+Math.random()*12}t.setAttribute("position",new $(i,3)),t.setAttribute("size",new $(s,1));const o=new Z({uniforms:{time:{value:0}},vertexShader:`
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
      `,transparent:!0,depthWrite:!1,blending:H});this.emberParticles=new ne(t,o),this.group.add(this.emberParticles)}_buildOrbitRings(){const e=[900,1500,2200];for(const t of e){const i=new ce(t-5,t+5,64),s=new j({color:14965544,transparent:!0,opacity:.2,side:de,depthWrite:!1}),o=new _(i,s);o.rotation.x=-Math.PI/2,this.group.add(o)}}_buildChildren(){const e=this.objectData.children??[],t=[900,1500,2200,2900],i=[.3,.2,.14,.09];for(let s=0;s<e.length;s++){const o=e[s],n=t[s]??1e3+s*600,r=i[s]??.1,l=s/e.length*Math.PI*2,c=o.mediaKind??"archive";let p,m;c==="playable"?(p=new le(95,1),m=new L({color:16737826,emissive:16729088,emissiveIntensity:.5,roughness:.2,metalness:.8})):c==="audio"?(p=new re(65,24,12,36),m=new L({color:16755268,emissive:16737792,emissiveIntensity:.3})):c==="video"?(p=new Fe(0,85,170,8),m=new L({color:16729139,emissive:13378065,emissiveIntensity:.3})):(p=new ve(75,0),m=new L({color:13399893,roughness:.4}));const d=new _(p,m);d.position.set(Math.cos(l)*n,0,Math.sin(l)*n),d.userData.childId=o.id,d.userData.contentStatus=o.contentStatus,this.group.add(d),this.clickTargets.push(d);const g=document.createElement("div");g.className="universe-label fire-child-label",g.style.cssText=`
        position:absolute;top:0;left:0;pointer-events:none;
        font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,0.9vw,11px);
        letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,200,180,0);
        white-space:nowrap;transform:translate(-50%,-130%);transition:color 0.3s;
        user-select:none;text-align:center;line-height:1.4;
      `;const b=c==="playable"?"◇ SATELLITE":c==="audio"?"♪ AUDIO":c==="video"?"▶ VIDEO":"◐ ARCHIVE";g.innerHTML=`<span>${b}</span><br/><span>${o.title}</span>`,this.labelContainer.appendChild(g),this.children.push({id:o.id,title:o.title,mediaKind:c,contentStatus:o.contentStatus??"live",mesh:d,orbitRadius:n,orbitSpeed:r,orbitAngle:l,labelEl:g})}}update(e,t,i){this.time+=e;const s=this.planetMesh.material;s.uniforms.time.value=this.time,this.planetMesh.rotation.y+=e*.05;const o=this.emberParticles.material;o.uniforms.time.value=this.time;for(const n of this.children)n.orbitAngle+=e*n.orbitSpeed,n.mesh.position.set(Math.cos(n.orbitAngle)*n.orbitRadius,Math.sin(this.time*.5+n.orbitRadius)*40,Math.sin(n.orbitAngle)*n.orbitRadius),n.mesh.rotation.y+=e*.6;this._updateLabels(t,i)}_updateLabels(e,t){const{width:i,height:s}=t.domElement.getBoundingClientRect(),o=new x;e.getWorldPosition(o);for(const n of this.children){const r=new x;n.mesh.getWorldPosition(r);const l=o.distanceTo(r),c=900,m=1-Math.min(1,Math.max(0,(l-c)/(3800-c))),d=r.clone().project(e),g=(d.x*.5+.5)*i,b=(-(d.y*.5)+.5)*s;d.z>1||m<.02?n.labelEl.style.opacity="0":(n.labelEl.style.opacity=String(m),n.labelEl.style.left=`${g}px`,n.labelEl.style.top=`${b}px`)}}getChildData(e){return this.children.find(t=>t.id===e)}getPlanetWorldPos(){const e=new x;return this.planetMesh.getWorldPosition(e),e}dispose(){for(const e of this.children)e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.labelEl.remove();this.planetMesh.geometry.dispose(),this.planetMesh.material.dispose()}}class ii{group;planetMesh;cloudMesh;birdParticles;children=[];labelContainer;time=0;objectData;clickTargets=[];constructor(e,t){this.objectData=e,this.labelContainer=t,this.group=new Y;const[i,s,o]=k.G2025?.worldOffset??[0,0,0];this.group.position.set(i+e.position.x,s+e.position.y,o+e.position.z),this._buildSunrisePlanet(),this._buildClouds(),this._buildBirdParticles(),this._buildOrbitRings(),this._buildChildren()}_buildSunrisePlanet(){const e=new N(460,48,48),t=new Z({uniforms:{time:{value:0},goldColor:{value:new T(13732918)},earthColor:{value:new T(2823945)},greenTone:{value:new T(3829824)},sunRay:{value:new T(16769184)}},vertexShader:`
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
      `});this.planetMesh=new _(e,t),this.planetMesh.userData.objectId=this.objectData.id,this.group.add(this.planetMesh),this.clickTargets.push(this.planetMesh);const i=new xe(13732918,1.6,7e3);this.group.add(i)}_buildClouds(){const e=new N(480,36,36),t=new j({color:16772560,transparent:!0,opacity:.18,depthWrite:!1,blending:H});this.cloudMesh=new _(e,t),this.group.add(this.cloudMesh)}_buildBirdParticles(){const t=new ae,i=new Float32Array(300*3);for(let o=0;o<300;o++){const n=Math.random()*Math.PI*2,r=520+Math.random()*400;i[o*3]=Math.cos(n)*r,i[o*3+1]=(Math.random()-.5)*300,i[o*3+2]=Math.sin(n)*r}t.setAttribute("position",new $(i,3));const s=new dt({color:16765072,size:14,transparent:!0,opacity:.45,blending:H,depthWrite:!1});this.birdParticles=new ne(t,s),this.group.add(this.birdParticles)}_buildOrbitRings(){const e=[950,1400,1900,2400,2900];for(const t of e){const i=new ce(t-4,t+4,64),s=new j({color:13732918,transparent:!0,opacity:.22,side:de,depthWrite:!1}),o=new _(i,s);o.rotation.x=-Math.PI/2,this.group.add(o)}}_buildChildren(){const e=this.objectData.children??[];for(let t=0;t<e.length;t++){const i=e[t],s=950+t%5*480,o=.25-t%5*.035,n=t/e.length*Math.PI*2,r=i.mediaKind??"archive";let l,c;r==="playable"?(l=new _t(90,0),c=new L({color:13732918,emissive:16755268,emissiveIntensity:.5,roughness:.25,metalness:.7})):r==="audio"?(l=new re(60,20,12,32),c=new L({color:16758852,emissive:13399808,emissiveIntensity:.3})):r==="video"?(l=new N(65,16,16),c=new L({color:14716976,emissive:11161616,emissiveIntensity:.3})):(l=new le(70,0),c=new L({color:12089392,roughness:.4}));const p=new _(l,c);p.position.set(Math.cos(n)*s,(t%2===0?1:-1)*(t*30),Math.sin(n)*s),p.userData.childId=i.id,p.userData.contentStatus=i.contentStatus,p.userData.mediaUrl=i.mediaUrl,p.userData.posterUrl=i.posterUrl,this.group.add(p),this.clickTargets.push(p);const m=document.createElement("div");m.className="universe-label africa-child-label",m.style.cssText=`
        position:absolute;top:0;left:0;pointer-events:none;
        font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,0.85vw,10px);
        letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,230,190,0);
        white-space:nowrap;transform:translate(-50%,-130%);transition:color 0.3s;
        user-select:none;text-align:center;line-height:1.4;
      `;const d=r==="playable"?"◇ SATELLITE":r==="audio"?"♪ AUDIO":r==="video"?"▶ DOC":"◐ ARCHIVE";m.innerHTML=`<span>${d}</span><br/><span>${i.title}</span>`,this.labelContainer.appendChild(m),this.children.push({id:i.id,title:i.title,mediaKind:r,contentStatus:i.contentStatus??"live",mediaUrl:i.mediaUrl,posterUrl:i.posterUrl,mesh:p,orbitRadius:s,orbitSpeed:o,orbitAngle:n,labelEl:m})}}update(e,t,i){this.time+=e;const s=this.planetMesh.material;s.uniforms.time.value=this.time,this.planetMesh.rotation.y+=e*.04,this.cloudMesh.rotation.y+=e*.07,this.birdParticles.rotation.y+=e*.12;for(const o of this.children)o.orbitAngle+=e*o.orbitSpeed,o.mesh.position.set(Math.cos(o.orbitAngle)*o.orbitRadius,Math.sin(this.time*.4+o.orbitRadius)*35,Math.sin(o.orbitAngle)*o.orbitRadius),o.mesh.rotation.y+=e*.5;this._updateLabels(t,i)}_updateLabels(e,t){const{width:i,height:s}=t.domElement.getBoundingClientRect(),o=new x;e.getWorldPosition(o);for(const n of this.children){const r=new x;n.mesh.getWorldPosition(r);const l=o.distanceTo(r),c=900,m=1-Math.min(1,Math.max(0,(l-c)/(3800-c))),d=r.clone().project(e),g=(d.x*.5+.5)*i,b=(-(d.y*.5)+.5)*s;d.z>1||m<.02?n.labelEl.style.opacity="0":(n.labelEl.style.opacity=String(m),n.labelEl.style.left=`${g}px`,n.labelEl.style.top=`${b}px`)}}getChildData(e){return this.children.find(t=>t.id===e)}getPlanetWorldPos(){const e=new x;return this.planetMesh.getWorldPosition(e),e}dispose(){for(const e of this.children)e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.labelEl.remove();this.planetMesh.geometry.dispose(),this.planetMesh.material.dispose(),this.cloudMesh.geometry.dispose(),this.cloudMesh.material.dispose()}}class si{group;planetMeshes=[];children=[];labelContainer;time=0;clickTargets=[];constructor(e,t){this.labelContainer=t,this.group=new Y;const[i,s,o]=k.G2025?.worldOffset??[0,0,0];this.group.position.set(i,s,o);for(const n of e)n.id==="OBJ-FIRE"||n.id==="OBJ-AFRICA"||n.id==="OBJ-STREAMS"||this._buildSystem(n)}_buildSystem(e){const t=new x(e.position.x,e.position.y,e.position.z),i=e.accentColor?parseInt(e.accentColor.replace("#","0x"),16):4227264;let s;e.id==="OBJ-EBONY"?s=new ve(360,3):e.id==="OBJ-AVIATOR"?s=new re(260,90,16,48):e.id==="OBJ-AWAY"?s=new N(320,32,32):s=new le(280,2);const o=new L({color:i,emissive:i,emissiveIntensity:.35,roughness:.25,metalness:.65}),n=new _(s,o);n.position.copy(t),n.userData.objectId=e.id,this.group.add(n),this.planetMeshes.push(n),this.clickTargets.push(n);const r=new ce(650,660,48),l=new j({color:i,transparent:!0,opacity:.2,side:de,depthWrite:!1}),c=new _(r,l);if(c.position.copy(t),c.rotation.x=-Math.PI/2,this.group.add(c),e.children){const p=[700,1100,1600];for(let m=0;m<e.children.length;m++){const d=e.children[m],g=p[m]??800+m*450,b=m/e.children.length*Math.PI*2,v=d.mediaKind??"archive";let E;v==="playable"?E=new le(75,1):v==="audio"?E=new re(50,16,12,28):v==="video"?E=new Fe(0,70,140,8):E=new ve(60,0);const I=new L({color:i,emissive:i,emissiveIntensity:.4,roughness:.3,metalness:.6}),R=new _(E,I);R.position.set(t.x+Math.cos(b)*g,t.y,t.z+Math.sin(b)*g),R.userData.childId=d.id,R.userData.contentStatus=d.contentStatus,R.userData.mediaUrl=d.mediaUrl,this.group.add(R),this.clickTargets.push(R);const O=document.createElement("div");O.className="universe-label frontier-child-label",O.style.cssText=`
          position:absolute;top:0;left:0;pointer-events:none;
          font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,0.85vw,10px);
          letter-spacing:0.1em;text-transform:uppercase;color:rgba(220,240,255,0);
          white-space:nowrap;transform:translate(-50%,-130%);transition:color 0.3s;
          user-select:none;text-align:center;line-height:1.4;
        `;const ue=v==="playable"?"◇ SATELLITE":v==="audio"?"♪ AUDIO":v==="video"?"▶ VIDEO":"◐ ARCHIVE";O.innerHTML=`<span>${ue}</span><br/><span>${d.title}</span>`,this.labelContainer.appendChild(O),this.children.push({id:d.id,title:d.title,mediaKind:v,contentStatus:d.contentStatus??"live",mediaUrl:d.mediaUrl,mesh:R,orbitRadius:g,orbitSpeed:.2+m%3*.08,orbitAngle:b,parentPos:t,labelEl:O})}}}update(e,t,i){this.time+=e;for(const s of this.planetMeshes)s.rotation.y+=e*.1,s.rotation.x+=e*.05;for(const s of this.children)s.orbitAngle+=e*s.orbitSpeed,s.mesh.position.set(s.parentPos.x+Math.cos(s.orbitAngle)*s.orbitRadius,s.parentPos.y+Math.sin(this.time*.5+s.orbitRadius)*25,s.parentPos.z+Math.sin(s.orbitAngle)*s.orbitRadius),s.mesh.rotation.y+=e*.6;this._updateLabels(t,i)}_updateLabels(e,t){const{width:i,height:s}=t.domElement.getBoundingClientRect(),o=new x;e.getWorldPosition(o);for(const n of this.children){const r=new x;n.mesh.getWorldPosition(r);const l=o.distanceTo(r),c=900,m=1-Math.min(1,Math.max(0,(l-c)/(3800-c))),d=r.clone().project(e),g=(d.x*.5+.5)*i,b=(-(d.y*.5)+.5)*s;d.z>1||m<.02?n.labelEl.style.opacity="0":(n.labelEl.style.opacity=String(m),n.labelEl.style.left=`${g}px`,n.labelEl.style.top=`${b}px`)}}getChildData(e){return this.children.find(t=>t.id===e)}dispose(){for(const e of this.children)e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.labelEl.remove();for(const e of this.planetMeshes)e.geometry.dispose(),e.material.dispose()}}function oi(){try{const a=localStorage.getItem("universe_my_stars_map");if(a)return JSON.parse(a)}catch{const a=localStorage.getItem("universe_my_star_id");if(a)return{G2025:a}}return{}}const tt=oi(),z={navContext:{level:"universe"},cameraSnapshot:null,selectedObjectId:null,selectedStarId:null,activeOverlay:"none",overlayData:null,audioState:"silent",muted:!!localStorage.getItem("universe_muted"),currentGalaxyId:"G2025",placementMode:!1,myStarId:Object.values(tt)[0]??null,myStarsMap:tt,stars:[],loaded:!1},se=new Map,Ne=new Set;function it(a,e,t){const i=se.get(a);i&&i.forEach(s=>s(e,t)),Ne.forEach(s=>s())}const w={get(a){return z[a]},set(a,e){const t=z[a];t!==e&&(z[a]=e,it(a,e,t))},patch(a){for(const[e,t]of Object.entries(a)){const i=z[e];i!==t&&(z[e]=t,it(e,t,i))}},subscribe(a,e){return se.has(a)||se.set(a,new Set),se.get(a).add(e),()=>se.get(a).delete(e)},on(a){return Ne.add(a),()=>Ne.delete(a)},getState(){return{...z}},toggleMute(){const a=!z.muted;a?localStorage.setItem("universe_muted","1"):localStorage.removeItem("universe_muted"),this.set("muted",a)},pushCameraSnapshot(a){this.set("cameraSnapshot",a)},popCameraSnapshot(){return z.cameraSnapshot},setMyStarId(a){localStorage.setItem("universe_my_star_id",a),this.set("myStarId",a)},setMyStarForGalaxy(a,e){const t={...z.myStarsMap,[a]:e};this.set("myStarsMap",t),this.set("myStarId",e)},hasStarInGalaxy(a){return!!z.myStarsMap[a]},getMyStarForGalaxy(a){return z.myStarsMap[a]??null},addStar(a){const e=[...z.stars,a];this.set("stars",e)}},ai=1500;class ni{ambientLayers=new Map;activeRegionTheme=null;masterMuted;masterVol=.22;_rafId=0;isDucked=!1;REGION_TRACKS={fire:"https://static.wixstatic.com/mp3/85e419_7810e2c471ce46b5a1c5a664b8307995.mp3",africa:"https://static.wixstatic.com/mp3/85e419_f92713dc5c48443ca1c191bbbb0aec04.mp3",frontier:"https://static.wixstatic.com/mp3/85e419_7be9c7aa18ad4a6db00fd1af6ee7dbcd.mp3"};constructor(){this.masterMuted=!!localStorage.getItem("universe_muted"),this._tick=this._tick.bind(this),requestAnimationFrame(this._tick)}unlock(){if(!this.masterMuted)for(const e of this.ambientLayers.values())e.el.paused&&e.targetVol>0&&e.el.play().catch(()=>{})}setRegionTheme(e){if(this.activeRegionTheme===e)return;this.activeRegionTheme=e;const t=e?this.REGION_TRACKS[e]:null;for(const[i,s]of this.ambientLayers)i!==t&&(s.targetVol=0);if(t){let i=this.ambientLayers.get(t);if(!i){const s=new Audio(t);s.loop=!0,s.volume=0,s.preload="auto",i={src:t,el:s,targetVol:0,currentVol:0},this.ambientLayers.set(t,i)}i.targetVol=this.masterMuted||this.isDucked?0:this.masterVol,!this.masterMuted&&i.el.paused&&i.el.play().catch(()=>{})}}duckAmbient(){this.isDucked=!0;for(const e of this.ambientLayers.values())e.targetVol=e.targetVol>0?this.masterVol*.08:0}restoreAmbient(){if(this.isDucked=!1,!this.masterMuted)for(const e of this.ambientLayers.values()){const t=this.activeRegionTheme&&this.REGION_TRACKS[this.activeRegionTheme]===e.src;e.targetVol=t?this.masterVol:0}}setMuted(e){this.masterMuted=e;for(const t of this.ambientLayers.values())e?(t.targetVol=0,t.el.pause()):this.activeRegionTheme&&this.REGION_TRACKS[this.activeRegionTheme]===t.src&&(t.targetVol=this.masterVol,t.el.play().catch(()=>{}))}_tick(){this._rafId=requestAnimationFrame(this._tick);const e=16/ai;for(const t of this.ambientLayers.values()){const i=t.targetVol-t.currentVol;Math.abs(i)>.001&&(t.currentVol+=i*e*6,t.el.volume=Math.max(0,Math.min(1,t.currentVol)))}}dispose(){cancelAnimationFrame(this._rafId);for(const e of this.ambientLayers.values())e.el.pause()}}const C=new ni;let D=null;async function ri(){if(D)return D;const t=await fetch("./data/seed_universe.json");if(!t.ok)throw new Error(`Failed to load seed data: ${t.status}`);return D=await t.json(),D}const We=new Map,li=new Map,st=new Map;function ci(a){for(const e of a.galaxies){We.set(e.id,e);for(const t of e.regions)li.set(t.id,{...t,galaxyId:e.id})}for(const e of a.celestialObjects)if(st.set(e.id,e),e.children)for(const t of e.children)st.set(t.id,{...t,galaxyId:e.galaxyId,regionId:e.regionId,position:{...e.position}})}function Ge(){return D?D.galaxies:[]}function Ue(a){return We.get(a)?.regions??[]}function pt(){return D?D.celestialObjects:[]}function di(){return D?D.demoStars:[]}function pi(){return di().map(a=>({id:a.id,galaxyId:a.galaxyId,regionId:a.regionId,clusterId:a.clusterId,x:a.x,y:a.y,z:a.z,displayName:a.displayName,message:a.message,createdAt:"2025-01-01T00:00:00Z",isDemo:!0}))}function oe(a){return k[a]?.worldOffset??[0,0,0]}function ut(a,e){const t=oe(a),s=Ue(a).findIndex(n=>n.id===e),o=$e[Math.max(0,s)];return[t[0]+o[0],t[1]+o[1],t[2]+o[2]]}function ui(a){const e=oe(a.galaxyId);return[e[0]+a.position.x,e[1]+a.position.y,e[2]+a.position.z]}function He(a){const e=We.get(a);return e?`${e.title} Galaxy`:a}function mi(a){return`${Math.max(1,Math.round(a*.085))} AU`}const ot="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";function hi(a=21){const e=crypto.getRandomValues(new Uint8Array(a));return Array.from(e,t=>ot[t%ot.length]).join("")}const J=500;class fi{cells=new Map;key(e,t,i){return`${Math.floor(e/J)},${Math.floor(t/J)},${Math.floor(i/J)}`}insert(e){const t=this.key(e.x,e.y,e.z);this.cells.has(t)||this.cells.set(t,[]),this.cells.get(t).push(e)}checkCollision(e,t,i,s){const o=Math.floor(e/J),n=Math.floor(t/J),r=Math.floor(i/J);for(let l=-1;l<=1;l++)for(let c=-1;c<=1;c++)for(let p=-1;p<=1;p++){const m=`${o+l},${n+c},${r+p}`,d=this.cells.get(m);if(d){for(const g of d)if(Math.sqrt((g.x-e)**2+(g.y-t)**2+(g.z-i)**2)<s)return!0}}return!1}rebuild(e){this.cells.clear();for(const t of e)this.insert(t)}}const Ee="universe_stars",at="universe_my_stars_map",nt="universe_last_place",gi=1e3*30;class yi{grid=new fi;stars=[];loaded=!1;async loadStars(){if(this.loaded)return this.stars;const e=pi();let t=[];try{const i=localStorage.getItem(Ee);i&&(t=JSON.parse(i))}catch{t=[]}return this.stars=[...e,...t],this.grid.rebuild(this.stars),this.loaded=!0,this.stars}getMyStarsMap(){try{const e=localStorage.getItem(at);if(e)return JSON.parse(e)}catch{const e=localStorage.getItem("universe_my_star_id");if(e)return{G2025:e}}return{}}hasStarInGalaxy(e){return!!this.getMyStarsMap()[e]}getMyStarId(e){const t=this.getMyStarsMap();return e?t[e]??null:Object.values(t)[0]??null}async placestar(e){if(this.hasStarInGalaxy(e.galaxyId))return{success:!1,error:"already-placed-in-galaxy"};const t=localStorage.getItem(nt);if(t&&Date.now()-parseInt(t)<gi)return{success:!1,error:"rate-limit"};if(this.grid.checkCollision(e.x,e.y,e.z,$t))return{success:!1,error:"collision"};const i=ut(e.galaxyId,e.regionId),s=e.x-i[0],o=e.z-i[2];if(Math.sqrt(s*s+o*o)>Nt||Math.abs(e.y-i[1])>Gt)return{success:!1,error:"collision"};const r={id:hi(),galaxyId:e.galaxyId,regionId:e.regionId,x:e.x,y:e.y,z:e.z,displayName:Ce(e.displayName),starName:e.starName?Ce(e.starName):void 0,message:e.message?Ce(e.message):void 0,signatureDataUrl:e.signatureDataUrl,createdAt:new Date().toISOString(),isDemo:!1};this.stars.push(r),this.grid.insert(r);try{const l=localStorage.getItem(Ee),c=l?JSON.parse(l):[];c.push(r),localStorage.setItem(Ee,JSON.stringify(c));const p=this.getMyStarsMap();p[e.galaxyId]=r.id,localStorage.setItem(at,JSON.stringify(p)),localStorage.setItem(nt,String(Date.now()))}catch{}return w.setMyStarForGalaxy(e.galaxyId,r.id),{success:!0,star:r}}async getStarById(e){return await this.loadStars(),this.stars.find(t=>t.id===e)??null}}function Ce(a){return a.replace(/<[^>]*>/g,"").trim().slice(0,280)}const W=new yi;class bi{el;galaxyLabel;muteBtn;placeBtn;resetBtn;returnBtn;tourBtn;breadcrumb;callbacks;constructor(e,t){this.callbacks=t,this.el=document.createElement("div"),this.el.id="universe-hud",this.el.setAttribute("role","navigation"),this.el.setAttribute("aria-label","Universe navigation"),this.el.style.cssText=`
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
          href="/"
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
          style="${ye("rgba(255,255,255,0.05)","#4080c0")}"
          aria-label="Reset Camera to Universe Composition"
          title="Reset View to Default Universe Composition"
        >⌂ RESET VIEW</button>
        <button
          id="hud-return"
          type="button"
          style="${ye("rgba(255,255,255,0.05)","#4080c0")} display:none;"
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
          style="${ye("rgba(40,100,160,0.4)","#70c0ff")}"
          aria-label="Take me somewhere guided tour"
          title="Cinematic flight to a featured universe destination"
        >✦ TAKE ME SOMEWHERE</button>

        <button
          id="hud-place"
          type="button"
          style="${ye("rgba(20,60,100,0.6)","#5090c0")}"
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

        <div id="phase2-badge" style="
          font-family:'Space Mono',monospace;
          font-size:0.55rem;
          letter-spacing:0.15em;
          color:#60ffd0;
          opacity:0.85;
          padding:2px 6px;
          border:1px solid rgba(96,255,208,0.3);
          border-radius:3px;
          background:rgba(2,10,24,0.6);
          white-space:nowrap;
        ">PHASE II • 2654bb5</div>
      </div>
    `,e.appendChild(this.el),this.galaxyLabel=this.el.querySelector("#hud-galaxy-name"),this.breadcrumb=this.el.querySelector("#hud-breadcrumb"),this.muteBtn=this.el.querySelector("#hud-mute"),this.placeBtn=this.el.querySelector("#hud-place"),this.resetBtn=this.el.querySelector("#hud-reset"),this.returnBtn=this.el.querySelector("#hud-return"),this.tourBtn=this.el.querySelector("#hud-tour"),this._bindEvents(),this._syncMute(),w.subscribe("currentGalaxyId",i=>{this.galaxyLabel.textContent=i?He(i):"",this._syncStarButton()}),w.subscribe("navContext",i=>{this.breadcrumb.textContent=i.level.toUpperCase()}),w.subscribe("muted",()=>this._syncMute()),w.subscribe("myStarsMap",()=>this._syncStarButton()),this._syncStarButton()}_syncStarButton(){const e=w.get("currentGalaxyId")??"G2025",t=W.getMyStarId(e);t?(this.placeBtn.textContent="✦ VIEW YOUR STAR",this.placeBtn.style.color="#ffd700",this.placeBtn.style.background="rgba(100,80,10,0.6)",this.placeBtn.dataset.action="view",this.placeBtn.dataset.starId=t):(this.placeBtn.textContent="✦ PLACE STAR",this.placeBtn.style.color="#5090c0",this.placeBtn.style.background="rgba(20,60,100,0.6)",this.placeBtn.dataset.action="place",delete this.placeBtn.dataset.starId)}_bindEvents(){this.resetBtn.addEventListener("click",()=>{C.unlock(),this.callbacks.onResetView()}),this.returnBtn.addEventListener("click",()=>{C.unlock(),this.callbacks.onReturnPrevious()}),this.tourBtn.addEventListener("click",()=>{C.unlock(),this.callbacks.onTakeTour()}),this.muteBtn.addEventListener("click",()=>{C.unlock(),w.toggleMute(),C.setMuted(w.get("muted"))}),this.placeBtn.addEventListener("click",()=>{C.unlock();const e=this.placeBtn.dataset.action,t=this.placeBtn.dataset.starId;e==="view"&&t?this.callbacks.onViewMyStar(t):(w.set("placementMode",!0),window.dispatchEvent(new CustomEvent("universe-start-placement")))}),document.getElementById("universe-canvas")?.addEventListener("click",()=>{C.unlock()},{once:!0})}setReturnAvailable(e){this.returnBtn.style.display=e?"inline-block":"none"}_syncMute(){const e=w.get("muted");this.muteBtn.textContent=e?"♪̶":"♪",this.muteBtn.setAttribute("aria-label",e?"Unmute":"Mute"),this.muteBtn.style.color=e?"#2a3848":"#4a85b0"}setPlacementMode(e){e?(this.placeBtn.textContent="✦ PLACING…",this.placeBtn.style.color="#60c080"):this._syncStarButton()}dispose(){this.el.remove()}}function ye(a,e){return`
    font-family:'Space Grotesk',sans-serif;
    font-size:0.65rem;letter-spacing:0.12em;text-transform:uppercase;
    background:${a};
    border:1px solid rgba(80,160,240,0.25);
    border-radius:4px;
    color:${e};
    padding:6px 12px;
    cursor:pointer;
    transition:background 0.2s, color 0.2s;
    white-space:nowrap;
  `}class vi{el;openBtn;panel;activeTab="map";isOpen=!1;callbacks;constructor(e,t){this.callbacks=t,this.el=document.createElement("div"),this.el.id="galactic-navigator-wrap",this.el.style.cssText=`
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
    `,this.el.appendChild(this.panel),this.el.appendChild(this.openBtn),e.appendChild(this.el),this._injectStyles(),this._bindEvents(),this.render(),w.on(()=>{this.isOpen&&this._updateTelemetry()})}_injectStyles(){if(document.getElementById("nav-styles"))return;const e=document.createElement("style");e.id="nav-styles",e.textContent=`
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
    `,document.head.appendChild(e)}_bindEvents(){this.openBtn.addEventListener("click",()=>{this.isOpen=!this.isOpen,this.panel.style.display=this.isOpen?"flex":"none",this.isOpen&&this.render()})}render(){const e=w.get("currentGalaxyId")??"G2025",t=Ge().find(i=>i.id===e);t&&Ue(e),this.panel.innerHTML=`
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
    `,this.panel.querySelectorAll(".nav-tab-btn").forEach(i=>{i.addEventListener("click",s=>{const o=s.currentTarget.dataset.tab;this.activeTab=o,this.render()})}),this.panel.querySelectorAll(".nav-tree-item").forEach(i=>{i.addEventListener("click",s=>{const o=s.currentTarget,n=o.dataset.type,r=o.dataset.id,l=o.dataset.parentId;n==="galaxy"&&r?this.callbacks.onTravelToGalaxy(r):n==="region"&&r&&l?this.callbacks.onTravelToRegion(l,r):n==="object"&&r&&this.callbacks.onTravelToObject(r)})}),this._updateTelemetry()}_renderMapHTML(){const e=Ge(),t=w.get("currentGalaxyId")??"G2025",i=pt();return`
      <div style="font-family:'Space Mono',monospace;font-size:0.65rem;color:#4a6888;letter-spacing:0.1em;margin-bottom:8px;">
        KNOWN GALAXIES (CLICK TO TRAVEL)
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;">
        ${e.map(s=>{const o=s.id===t,n=s.id==="G2025",r=Ue(s.id);return`
            <div class="nav-tree-item ${o?"active":""}" data-type="galaxy" data-id="${s.id}">
              <span>${n?"✦ ":""}${s.title}</span>
              <span style="font-size:0.6rem;opacity:0.6;">${n?"SHOWCASE":"KNOWN"}</span>
            </div>
            ${o?`
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
    `}_updateTelemetry(){const e=this.panel.querySelector("#telemetry-au");if(e){const t=w.get("cameraSnapshot"),i=t?Math.hypot(...t.position):48e3;e.textContent=mi(i)}}dispose(){this.el.remove()}}const mt=[];let Be={type:"universe"};function Te(a){const e=a.replace(/^#\/?/,"");if(!e||e==="universe")return{type:"universe"};const[t,i]=e.split("/");return t==="galaxy"&&i?{type:"galaxy",galaxyId:i}:t==="object"&&i?{type:"object",objectId:i}:t==="star"&&i?{type:"star",starId:i}:{type:"universe"}}function Ie(a){Be=a,mt.forEach(e=>e(a))}const Ae={init(){window.addEventListener("hashchange",()=>{Ie(Te(window.location.hash))}),Ie(Te(window.location.hash))},on(a){mt.push(a),a(Be)},navigate(a,e=!0){let t="";a.type==="universe"?t="#universe":a.type==="galaxy"?t=`#galaxy/${a.galaxyId}`:a.type==="object"?t=`#object/${a.objectId}`:a.type==="star"&&(t=`#star/${a.starId}`),e?(history.pushState(null,"",t),Ie(Te(t))):history.replaceState(null,"",t)},back(){history.back()},current(){return Be}};function K(a,e){const t=document.createElement("div");return t.id=a,t.className=`overlay-panel ${e}`,t.setAttribute("role","dialog"),t.setAttribute("aria-modal","true"),t.style.cssText=`
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
  `,t}function q(){if(document.getElementById("overlay-styles"))return;const a=document.createElement("style");a.id="overlay-styles",a.textContent=`
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
  `,document.head.appendChild(a)}function Q(a){const e=a.querySelectorAll('button,a,[tabindex]:not([tabindex="-1"]),input,textarea,select'),t=e[0],i=e[e.length-1];function s(o){o.key==="Tab"&&(o.shiftKey?document.activeElement===t&&(o.preventDefault(),i?.focus()):document.activeElement===i&&(o.preventDefault(),t?.focus()))}return a.addEventListener("keydown",s),t?.focus(),()=>a.removeEventListener("keydown",s)}function X(a,e){function t(i){i.key==="Escape"&&e()}return window.addEventListener("keydown",t),()=>window.removeEventListener("keydown",t)}function pe(a,e){const t=document.createElement("button");return t.className="overlay-close-btn",t.type="button",t.setAttribute("aria-label","Close"),t.innerHTML="×",t.addEventListener("click",e),a.appendChild(t),t}function xi(a,e,t){q(),C.duckAmbient();const i=K("audio-overlay","audio-overlay");i.setAttribute("aria-label",`Audio: ${e.title}`);const s=!e.mediaUrl||e.contentStatus==="awaiting-source";i.innerHTML=`
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
  `,Ci();const o=()=>{i.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{i.remove(),C.restoreAmbient(),t()},200)};pe(i.firstElementChild,o);const n=X(i,o),r=Q(i);if(i.addEventListener("mousedown",l=>{l.target===i&&o()}),a.appendChild(i),a.setAttribute("aria-hidden","false"),!s){const l=i.querySelector("#spatial-audio");l?.play().catch(()=>{}),l?.addEventListener("play",()=>C.duckAmbient()),l?.addEventListener("pause",()=>C.restoreAmbient())}return()=>{n(),r(),o()}}function wi(a,e,t){q(),C.duckAmbient();const i=K("video-overlay","video-overlay");i.setAttribute("aria-label",`Video: ${e.title}`),i.style.background="rgba(0,0,0,0.92)";const s=!e.mediaUrl||e.contentStatus==="awaiting-source";i.innerHTML=`
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
            src="${Ei(e.mediaUrl)}"
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
  `;const o=()=>{i.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{i.remove(),C.restoreAmbient(),t()},200)};pe(i,o);const n=X(i,o),r=Q(i);return i.addEventListener("mousedown",l=>{l.target===i&&o()}),a.appendChild(i),()=>{n(),r(),o()}}function Si(a,e,t){q(),C.duckAmbient();const i=K("playable-overlay","playable-overlay");i.setAttribute("aria-label",`Playable Experience: ${e.title}`),i.style.background="rgba(0,0,0,0.98)",i.style.padding="0";const s=e.mediaUrl??"/games/streams/";i.innerHTML=`
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
  `;const o=()=>{i.style.animation="overlay-out 0.15s ease forwards",setTimeout(()=>{i.remove(),C.restoreAmbient(),t()},150)};i.querySelector("#exit-playable")?.addEventListener("click",o);const n=X(i,o);a.appendChild(i);const r=l=>{(l.data==="UNIVERSE_EXIT"||l.data?.type==="UNIVERSE_EXIT")&&o()};return window.addEventListener("message",r),()=>{n(),window.removeEventListener("message",r),o()}}function Mi(a,e,t){q();const i=K("archive-overlay","archive-overlay");i.setAttribute("aria-label",`Archive: ${e.title}`),i.innerHTML=`
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
  `;const s=()=>{i.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{i.remove(),t()},200)};pe(i.firstElementChild,s);const o=X(i,s),n=Q(i);return i.addEventListener("mousedown",r=>{r.target===i&&s()}),a.appendChild(i),()=>{o(),n(),s()}}function Ei(a){const e=a.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);return e?`https://www.youtube.com/embed/${e[1]}?autoplay=1`:a}function Ci(){if(document.getElementById("orbit-anim"))return;const a=document.createElement("style");a.id="orbit-anim",a.textContent=`
    @keyframes orbit-pulse {
      0%,100% { box-shadow:0 0 20px rgba(32,200,200,0.1); }
      50% { box-shadow:0 0 40px rgba(32,200,200,0.25); }
    }
    @keyframes orbit-spin {
      to { transform:rotate(360deg); }
    }
  `,document.head.appendChild(a)}function Ti(a,e,t){q();const i=K("star-card-overlay","star-card-overlay");i.setAttribute("aria-label",`Star Card: ${e.displayName}`),i.style.background="rgba(0,2,10,0.92)";const s=document.createElement("canvas");s.width=1080,s.height=1350,s.style.display="none",document.body.appendChild(s),ke(s,e,1080,1350);const o=document.createElement("canvas");o.width=1080,o.height=1920,o.style.display="none",document.body.appendChild(o),ke(o,e,1080,1920);const n=document.createElement("canvas");n.width=360,n.height=450,n.style.cssText="border-radius:8px;max-width:100%;",ke(n,e,360,450);const r=`${location.origin}${location.pathname}#star/${e.id}`;i.innerHTML=`
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
        <button id="dl-card" type="button" style="${Re()}">DOWNLOAD CARD (1080×1350)</button>
        <button id="dl-story" type="button" style="${Re()}">DOWNLOAD STORY (1080×1920)</button>
        <button id="copy-link" type="button" style="${Re("rgba(20,60,20,0.6)")}">COPY SHARE LINK</button>
      </div>
      <p id="copy-confirm" style="color:#60c070;font-size:0.75rem;min-height:18px;"></p>
    </div>
  `;const l=i.querySelector("#star-card-preview-wrap");l&&l.appendChild(n),i.querySelector("#dl-card")?.addEventListener("click",()=>{rt(s,`2fly-star-${e.id.slice(0,8)}-card.png`)}),i.querySelector("#dl-story")?.addEventListener("click",()=>{rt(o,`2fly-star-${e.id.slice(0,8)}-story.png`)}),i.querySelector("#copy-link")?.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(r);const d=i.querySelector("#copy-confirm");d&&(d.textContent="Link copied!",setTimeout(()=>{d.textContent=""},2e3))}catch{const d=i.querySelector("#copy-confirm");d&&(d.textContent=r)}});const c=()=>{i.remove(),s.remove(),o.remove(),n.remove(),t()};pe(i.firstElementChild,c);const p=X(i,c),m=Q(i);return i.addEventListener("mousedown",d=>{d.target===i&&c()}),a.appendChild(i),()=>{p(),m(),c()}}function _e(a,e,t){q();const i=K("star-view-overlay","star-view-overlay");i.setAttribute("aria-label",`Star: ${e.displayName}`);const s=k[e.galaxyId],o=s?"#"+s.primaryColor.toString(16).padStart(6,"0"):"#4080c0",n=He(e.galaxyId);i.innerHTML=`
    <div style="
      position:relative;
      background:radial-gradient(ellipse at 50% 30%, rgba(${ie(s?.primaryColor??2121888)},0.12) 0%, rgba(0,4,12,0.95) 70%);
      border:1px solid rgba(${ie(s?.primaryColor??2121888)},0.2);
      border-radius:20px;
      padding:60px 40px 40px;
      max-width:500px;width:92vw;
      text-align:center;
    ">
      <div style="
        font-size:3rem;margin-bottom:20px;
        text-shadow:0 0 30px ${o};
        animation:star-pulse 3s ease-in-out infinite;
      " aria-hidden="true">✦</div>
      <p style="font-size:0.65rem;letter-spacing:0.2em;color:${o};margin-bottom:8px;
        text-transform:uppercase;font-family:'Space Mono',monospace;">
        Star — ${n}
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
          border-left:2px solid rgba(${ie(s?.primaryColor??2121888)},0.3);
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
        ${be("GALAXY",n)}
        ${be("ARRIVED",ht(e.createdAt))}
        ${be("STAR ID",e.id.slice(0,14)+"…")}
        ${be("COORDINATES",`${e.x.toFixed(0)}, ${e.y.toFixed(0)}, ${e.z.toFixed(0)}`)}
      </div>
      <button id="star-place-cta" type="button" style="
        margin-top:8px;
        padding:12px 28px;
        background:rgba(${ie(s?.primaryColor??2121888)},0.15);
        border:1px solid rgba(${ie(s?.primaryColor??2121888)},0.35);
        border-radius:6px;
        color:#c0d0f0;
        font-family:'Space Grotesk',sans-serif;
        font-size:0.8rem;letter-spacing:0.12em;text-transform:uppercase;
        cursor:pointer;
        transition:background 0.2s;
      ">PLACE YOUR STAR →</button>
    </div>
  `;const r=()=>{i.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{i.remove(),t()},200)};i.querySelector("#star-place-cta")?.addEventListener("click",()=>{r(),w.set("placementMode",!0),window.dispatchEvent(new CustomEvent("universe-start-placement"))}),pe(i.firstElementChild,r);const l=X(i,r),c=Q(i);return i.addEventListener("mousedown",p=>{p.target===i&&r()}),a.appendChild(i),()=>{l(),c(),r()}}async function Ii(a,e,t){const i=window.matchMedia("(prefers-reduced-motion: reduce)").matches,s=document.createElement("div");s.style.cssText=`
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
  `,a.appendChild(s);const o=i?400:2500;await new Promise(n=>setTimeout(n,o)),s.style.opacity="0",await new Promise(n=>setTimeout(n,500)),s.remove(),t()}function Re(a="rgba(20,40,80,0.6)"){return["display:inline-block;","padding:10px 16px;",`background:${a};`,"border:1px solid rgba(80,140,220,0.25);","border-radius:6px;","color:#a0b8d8;","font-family:'Space Grotesk',sans-serif;","font-size:0.72rem;","letter-spacing:0.1em;","text-transform:uppercase;","cursor:pointer;","transition:background 0.2s;"].join("")}function ke(a,e,t,i){const s=a.getContext("2d");if(!s)return;a.width=t,a.height=i;const o=k[e.galaxyId],n=s.createRadialGradient(t*.5,i*.3,0,t*.5,i*.3,i*.7),r=o?"#"+o.primaryColor.toString(16).padStart(6,"0"):"#204080";n.addColorStop(0,`${r}22`),n.addColorStop(.6,"#020810"),n.addColorStop(1,"#010408"),s.fillStyle=n,s.fillRect(0,0,t,i),s.globalAlpha=.5;for(let g=0;g<300;g++){const b=Math.random()*t,v=Math.random()*i,E=Math.random()*1.2+.3;s.fillStyle="#ffffff",s.beginPath(),s.arc(b,v,E,0,Math.PI*2),s.fill()}s.globalAlpha=1;const l=t/1080,c=80*l;s.font=`${c}px serif`,s.textAlign="center",s.fillStyle="#ffd700",s.shadowColor="#ffd700",s.shadowBlur=40*l,s.fillText("✦",t*.5,i*.25),s.shadowBlur=0,s.font=`${11*l}px 'Arial', sans-serif`,s.fillStyle=r,s.letterSpacing=`${3*l}px`,s.fillText("2FLY UNIVERSE",t*.5,i*.32),s.font=`bold ${28*l}px 'Arial', sans-serif`,s.fillStyle="#f0f4ff",s.letterSpacing="0px",s.fillText(e.displayName.toUpperCase(),t*.5,i*.4),e.starName&&(s.font=`${16*l}px 'Arial', sans-serif`,s.fillStyle="#7080a0",s.fillText(`"${e.starName}"`,t*.5,i*.45)),e.message&&(s.font=`italic ${13*l}px 'Arial', sans-serif`,s.fillStyle="#5a7090",Ai(s,`"${e.message}"`,t*.5,i*.52,t*.75,18*l));const p=i*.72,m=20*l;s.font=`${10*l}px 'Courier New', monospace`,s.textAlign="center";const d=[`GALAXY: ${He(e.galaxyId).toUpperCase()}`,`ARRIVED: ${ht(e.createdAt)}`,`ID: ${e.id.slice(0,20)}`,`COORDS: ${e.x.toFixed(0)}, ${e.y.toFixed(0)}, ${e.z.toFixed(0)}`];s.fillStyle="#2a4060",d.forEach((g,b)=>s.fillText(g,t*.5,p+b*m)),s.font=`${9*l}px 'Arial', sans-serif`,s.fillStyle="#1a3050",s.fillText("2FLYKEITHLOGAN.COM/UNIVERSE",t*.5,i*.94),s.strokeStyle=`${r}33`,s.lineWidth=2*l,s.strokeRect(20*l,20*l,t-40*l,i-40*l)}function Ai(a,e,t,i,s,o){const n=e.split(" ");let r="",l=i;for(const c of n){const p=r+c+" ";a.measureText(p).width>s&&r.length?(a.fillText(r,t,l),r=c+" ",l+=o):r=p}a.fillText(r,t,l)}function rt(a,e){const t=document.createElement("a");t.href=a.toDataURL("image/png"),t.download=e,t.click()}function be(a,e){return`
    <div style="
      background:rgba(255,255,255,0.02);
      border:1px solid rgba(255,255,255,0.05);
      border-radius:6px;
      padding:10px 12px;
    ">
      <div style="font-size:0.6rem;letter-spacing:0.15em;color:#3a5070;
        text-transform:uppercase;font-family:'Space Mono',monospace;margin-bottom:4px;">${a}</div>
      <div style="font-size:0.78rem;color:#8090b0;word-break:break-all;">${e}</div>
    </div>
  `}function ht(a){try{return new Date(a).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}catch{return a}}function ie(a){const e=a>>16&255,t=a>>8&255,i=a&255;return`${e},${t},${i}`}const ft=document.createElement("style");ft.textContent=`
  @keyframes star-pulse {
    0%,100% { text-shadow:0 0 10px currentColor,0 0 20px currentColor; }
    50% { text-shadow:0 0 20px currentColor,0 0 40px currentColor,0 0 60px currentColor; }
  }
`;document.head.appendChild(ft);function _i(a,e,t){q();const i=K("star-placement-overlay","star-placement-overlay");i.setAttribute("aria-label","Place Your Star in the 2Fly Universe"),i.style.background="rgba(0,2,8,0.88)";let s="info",o="",n="",r="";function l(){i.innerHTML=Ri(s,e,o,n,r),c(),Q(i)}function c(){i.querySelector("#place-close")?.addEventListener("click",()=>p(!1)),s==="info"&&i.querySelector("#place-next")?.addEventListener("click",()=>{const b=(i.querySelector("#place-display-name")?.value??"").trim(),v=(i.querySelector("#place-star-name")?.value??"").trim(),E=(i.querySelector("#place-message")?.value??"").trim();if(!b){const I=i.querySelector("#place-error");I&&(I.textContent="Display name is required.");return}o=b,n=v,r=E,s="confirm",l()}),s==="confirm"&&(i.querySelector("#place-back")?.addEventListener("click",()=>{s="info",l()}),i.querySelector("#place-confirm")?.addEventListener("click",async()=>{const g=i.querySelector("#place-confirm");g&&(g.disabled=!0,g.textContent="PLACING…");const b={galaxyId:e.galaxyId,regionId:e.regionId,x:e.x,y:e.y,z:e.z,displayName:o,starName:n||void 0,message:r||void 0},v=await W.placestar(b);if(v.success&&v.star)w.setMyStarForGalaxy(v.star.galaxyId,v.star.id),w.addStar(v.star),s="ignition",l(),setTimeout(()=>{v.star&&Ti(a,v.star,()=>p(!0))},2200);else{const E={collision:"That location is too close to another star. Please choose a different spot.","already-placed-in-galaxy":"You have already placed a star in this era galaxy.","already-placed":"You have already placed a star in this era galaxy.","rate-limit":"Please wait a moment before placing again.","server-error":"An error occurred. Please try again."};s="info",l();const I=i.querySelector("#place-error");I&&(I.textContent=E[v.error??"server-error"]??"An error occurred.")}}))}function p(d){i.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{i.remove(),t(d)},200)}const m=X(i,()=>p(!1));return l(),a.appendChild(i),()=>{m(),p(!1)}}function Ri(a,e,t,i,s){const o=`${e.x.toFixed(0)}, ${e.y.toFixed(0)}, ${e.z.toFixed(0)}`;return a==="info"?`
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
        Coordinates: ${o}
      </p>
      <div id="place-error" role="alert" style="color:#f06060;font-size:0.78rem;
        margin-bottom:12px;min-height:18px;"></div>
      <label style="display:block;margin-bottom:16px;">
        <span style="font-size:0.7rem;letter-spacing:0.12em;color:#6090b8;text-transform:uppercase;
          display:block;margin-bottom:6px;">Display Name *</span>
        <input id="place-display-name" type="text" maxlength="60"
          placeholder="Your name or alias"
          value="${t}"
          style="${ze()}"
          autocomplete="name" required />
      </label>
      <label style="display:block;margin-bottom:16px;">
        <span style="font-size:0.7rem;letter-spacing:0.12em;color:#6090b8;text-transform:uppercase;
          display:block;margin-bottom:6px;">Star Name (optional)</span>
        <input id="place-star-name" type="text" maxlength="60"
          placeholder="Name your star"
          value="${i}"
          style="${ze()}" />
      </label>
      <label style="display:block;margin-bottom:24px;">
        <span style="font-size:0.7rem;letter-spacing:0.12em;color:#6090b8;text-transform:uppercase;
          display:block;margin-bottom:6px;">Message (optional)</span>
        <textarea id="place-message" maxlength="280" rows="3"
          placeholder="Leave a message for the Universe…"
          style="${ze()} resize:vertical;height:80px;"
        >${s}</textarea>
      </label>
      <button id="place-next" type="button" style="${Le("#1a60c0","#2080e0")}">
        PREVIEW MY STAR →
      </button>
    </div>
  `:a==="confirm"?`
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
        ${t}
      </h2>
      ${i?`<p style="color:#7090b0;font-size:0.85rem;margin-bottom:8px;">Star: "${i}"</p>`:""}
      ${s?`<p style="color:#5a7898;font-size:0.8rem;font-style:italic;margin-bottom:8px;">"${s}"</p>`:""}
      <p style="color:#3a5878;font-size:0.75rem;font-family:'Space Mono',monospace;margin-bottom:24px;">
        ${o}
      </p>
      <p style="color:#4a6888;font-size:0.75rem;margin-bottom:28px;line-height:1.6;">
        Your star is permanent. You may place one primary star.
        Confirm to ignite your light in the Universe.
      </p>
      <div style="display:flex;gap:12px;justify-content:center;">
        <button id="place-back" type="button" style="${Le("#1a2030","#202840")}">← BACK</button>
        <button id="place-confirm" type="button" style="${Le("#104080","#1060b0")}">IGNITE MY STAR ✦</button>
      </div>
    </div>
  `:a==="ignition"?`
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
  `:""}function ze(){return`
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
  `}function Le(a,e){return`
    display:inline-block;
    padding:12px 24px;
    background:${a};
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
  `}const gt=document.createElement("style");gt.textContent=`
  @keyframes star-ignite {
    0% { transform:scale(0.1); opacity:0.2; }
    50% { transform:scale(1.4); opacity:1; }
    100% { transform:scale(1); opacity:0.9; }
  }
  @keyframes fade-in-text {
    from { opacity:0; transform:translateY(10px); }
    to { opacity:1; transform:translateY(0); }
  }
`;document.head.appendChild(gt);async function ki(a){const e=document.getElementById("overlay-layer"),t=document.getElementById("ui-layer"),i=document.getElementById("css3d-layer"),s=document.getElementById("loading-status"),o=Pt(a),n=new Rt;n.fog=new kt(1032,15e-7);const r=new Bt(a),l=new Lt,c=new ct;s&&(s.textContent="Loading Universe data…");const p=await ri();ci(p),s&&(s.textContent="Building 3D galaxies…"),await new Promise(u=>setTimeout(u,0));const m=new jt;n.add(m.group);const d=[];for(const u of Ge()){const h=new qt(u,i);n.add(h.group),d.push(h)}s&&(s.textContent="Placing visitor star clusters…"),await new Promise(u=>setTimeout(u,0));const g=new Zt(i);n.add(g.group);const b=await W.loadStars();w.set("stars",b),g.setStars(b,w.get("myStarId"));let v=null,E=null,I=null,R=null;const O=pt(),ue=O.find(u=>u.id==="OBJ-FIRE");ue&&(E=new ti(ue,i),n.add(E.group));const Ye=O.find(u=>u.id==="OBJ-AFRICA");Ye&&(I=new ii(Ye,i),n.add(I.group));const Ke=O.find(u=>u.id==="OBJ-STREAMS");Ke&&(v=new ei(Ke,i),n.add(v.group)),R=new si(O,i),n.add(R.group);const V=new bi(t,{onResetView:()=>{r.resetToHome(),V.setReturnAvailable(r.hasHistory())},onReturnPrevious:()=>{r.returnToPrevious(),V.setReturnAvailable(r.hasHistory())},onTakeTour:()=>{bt()},onViewMyStar:async u=>{const h=await W.getStarById(u);h&&r.travelToObject({x:h.x,y:h.y,z:h.z},600,{onDone:()=>{U((f,y)=>_e(f,h,y))}})}});new vi(t,{onTravelToGalaxy:u=>{const[h,f,y]=oe(u);r.travelToObject({x:h,y:f,z:y},14e3),V.setReturnAvailable(r.hasHistory())},onTravelToRegion:(u,h)=>{const[f,y,S]=ut(u,h);r.travelToObject({x:f,y,z:S},4500),V.setReturnAvailable(r.hasHistory())},onTravelToObject:u=>{const h=O.find(f=>f.id===u);if(h){const[f,y,S]=ui(h);r.travelToObject({x:f,y,z:S},1600),V.setReturnAvailable(r.hasHistory())}}});const yt=new zt(659224,1.1);n.add(yt);let G=null;function U(u){G&&(G(),G=null);const h=r.snapshot();w.pushCameraSnapshot(h),e.setAttribute("aria-hidden","false"),e.classList.add("overlay-active"),G=u(e,()=>{e.setAttribute("aria-hidden","true"),e.classList.remove("overlay-active"),G=null;const f=w.popCameraSnapshot();f&&r.restoreSnapshot(f)})}a.addEventListener("click",u=>{if(G||w.get("placementMode"))return;if(c.x=u.clientX/window.innerWidth*2-1,c.y=-(u.clientY/window.innerHeight)*2+1,l.setFromCamera(c,r.camera),E){const f=l.intersectObjects(E.clickTargets);if(f.length>0){const y=f[0].object,S=y.userData.childId;if(S){const A=E.getChildData(S);if(A){const M=new x;y.getWorldPosition(M),r.travelToObject(M,600,{onDone:()=>me(A)})}return}if(y.userData.objectId==="OBJ-FIRE"){r.travelToObject(E.getPlanetWorldPos(),1500);return}}}if(I){const f=l.intersectObjects(I.clickTargets);if(f.length>0){const y=f[0].object,S=y.userData.childId;if(S){const A=I.getChildData(S);if(A){const M=new x;y.getWorldPosition(M),r.travelToObject(M,600,{onDone:()=>me(A)})}return}if(y.userData.objectId==="OBJ-AFRICA"){r.travelToObject(I.getPlanetWorldPos(),1500);return}}}if(v){const f=l.intersectObjects(v.clickTargets);if(f.length>0){const y=f[0].object,S=y.userData.childId;if(S){const A=v.getChildData(S);if(A){const M=new x;y.getWorldPosition(M),r.travelToObject(M,600,{onDone:()=>me(A)})}return}if(y.userData.objectId==="OBJ-STREAMS"){r.travelToObject(v.getPlanetWorldPos(),1500);return}}}if(R){const f=l.intersectObjects(R.clickTargets);if(f.length>0){const y=f[0].object,S=y.userData.childId,A=y.userData.objectId;if(S){const M=R.getChildData(S);if(M){const B=new x;y.getWorldPosition(B),r.travelToObject(B,600,{onDone:()=>me(M)})}return}if(A){const M=new x;y.getWorldPosition(M),r.travelToObject(M,1400);return}}}const h=g.getClickTarget(l);if(h){const f=w.get("stars").find(y=>y.id===h.starId);f&&U((y,S)=>_e(y,f,S))}}),a.addEventListener("click",u=>{if(!w.get("placementMode"))return;c.x=u.clientX/window.innerWidth*2-1,c.y=-(u.clientY/window.innerHeight)*2+1,l.setFromCamera(c,r.camera);const h=new Ot(new x(0,1,0),0),f=new x;if(l.ray.intersectPlane(h,f),!f)return;let y="G2025",S="G2025-R3",A=1/0;for(const M of Object.keys(k)){const[B,,ee]=oe(M),F=Math.sqrt((f.x-B)**2+(f.z-ee)**2);F<A&&(A=F,y=M,S=`${M}-R1`)}w.set("placementMode",!1),V.setPlacementMode(!1),U((M,B)=>_i(M,{galaxyId:y,regionId:S,x:f.x,y:f.y+50,z:f.z},ee=>{if(ee){const F=W.getMyStarId();F&&W.getStarById(F).then(te=>{te&&(g.addStar(te),r.travelToObject({x:te.x,y:te.y,z:te.z},600))})}B()}))});function me(u){if(!u)return;const h=u.mediaKind;U(h==="audio"?(f,y)=>xi(f,u,y):h==="video"?(f,y)=>wi(f,u,y):h==="playable"?(f,y)=>Si(f,u,y):(f,y)=>Mi(f,u,y))}function bt(){const u=[{name:"Thru the Fire System",pos:E?.getPlanetWorldPos()??{x:-4500,y:40,z:-2500}},{name:"I Woke Up in Africa System",pos:I?.getPlanetWorldPos()??{x:0,y:40,z:4e3}},{name:"Streams System",pos:v?.getPlanetWorldPos()??{x:4e3,y:40,z:-2e3}}],h=u[Math.floor(Math.random()*u.length)];r.travelToObject(h.pos,1500,{onDone:()=>{vt(`DESTINATION ARRIVED — ${h.name}`)}}),V.setReturnAvailable(!0)}function vt(u){const h=document.createElement("div");h.style.cssText=`
      position:absolute;top:70px;left:50%;transform:translateX(-50%);
      background:rgba(2,10,24,0.9);border:1px solid rgba(80,160,240,0.3);
      border-radius:6px;padding:8px 16px;font-family:'Space Mono',monospace;
      font-size:0.65rem;letter-spacing:0.15em;color:#8ab4d4;
      text-transform:uppercase;pointer-events:none;z-index:60;
      animation:fade-in-text 0.3s ease;
    `,h.textContent=u,t.appendChild(h),setTimeout(()=>h.remove(),3e3)}let qe=!1;function xt(){if(qe)return;qe=!0;const u=document.createElement("div");if(u.style.cssText=`
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
      `,document.head.appendChild(h)}e.appendChild(u),setTimeout(()=>u.remove(),3600)}setTimeout(xt,1e3),Ae.init(),Ae.on(async u=>{if(u.type==="star"&&u.starId){const h=await W.getStarById(u.starId);h&&await Ii(e,h,()=>{r.travelToObject({x:h.x,y:h.y,z:h.z},700,{onDone:()=>{U((f,y)=>_e(f,h,y))}})})}if(u.type==="galaxy"&&u.galaxyId){const[h,f,y]=oe(u.galaxyId);r.travelToObject({x:h,y:f,z:y},12e3),w.set("currentGalaxyId",u.galaxyId)}u.type==="universe"&&r.resetToHome()}),window.addEventListener("universe-esc",()=>{if(G){G();return}Ae.back()});let we=0;Dt(u=>{we+=u,r.update(u);const h=r.camera.position;let f=null,y=1/0;for(const[S,A]of Object.entries(k)){const[M,B,ee]=A.worldOffset,F=Math.hypot(h.x-M,h.y-B,h.z-ee);F<y&&(y=F,f=S)}f!==w.get("currentGalaxyId")&&w.set("currentGalaxyId",f),h.distanceTo(new x(-4500,40,-2500))<4e3?C.setRegionTheme("fire"):h.distanceTo(new x(0,40,4e3))<4e3?C.setRegionTheme("africa"):h.distanceTo(new x(4e3,40,-2e3))<4500?C.setRegionTheme("frontier"):C.setRegionTheme(null),m.update(we);for(const S of d)S.update(we),S.updateLabels(r.camera,o,h);E?.update(u,r.camera,o),I?.update(u,r.camera,o),v?.update(u,r.camera,o),R?.update(u,r.camera,o),g.update(h,r.camera,o),o.render(n,r.camera)}),w.set("loaded",!0);const he=document.getElementById("loading-screen");he&&(he.style.transition="opacity 0.8s",he.style.opacity="0",setTimeout(()=>he.remove(),800))}async function zi(){const a=document.getElementById("universe-canvas");if(!a)throw new Error("No canvas element found");try{await ki(a)}catch(e){if(console.error("[2Fly Universe] Fatal init error:",e),document.getElementById("loading-screen")){const i=document.getElementById("loading-status");i&&(i.textContent="Universe failed to initialize. Please refresh.",i.style.color="#f06060")}}}zi();
