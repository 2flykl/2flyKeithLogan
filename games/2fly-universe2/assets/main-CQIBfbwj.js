import{W as os,S as ge,A as ns,V as v,a as wt,b as is,P as as,M as rt,R as Be,c as Ge,G as Y,B as mt,C as I,d as W,e as gt,f as H,g as St,h as Fe,i as Rt,j as X,k as G,l as z,m as lt,D as ct,O as rs,I as Te,n as Ae,o as ae,T as je,p as ft,q as yt,r as ls,s as cs,E as ds,L as ps,t as us,u as hs,v as ms,F as gs,w as fs}from"./three-CIDt-Byr.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function e(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(o){if(o.ep)return;o.ep=!0;const n=e(o);fetch(o.href,n)}})();let q=null,fe=!1,re=null,le=0,ce=!1;function ys(i){const t=Math.min(window.devicePixelRatio,2);return q=new os({canvas:i,antialias:t<2,alpha:!1,powerPreference:"high-performance",stencil:!1,depth:!0}),q.setPixelRatio(t),q.setSize(i.clientWidth,i.clientHeight,!1),q.outputColorSpace=ge,q.toneMapping=ns,q.toneMappingExposure=1.1,q.shadowMap.enabled=!1,new ResizeObserver(s=>{const o=s[0];if(!o||!q)return;const{width:n,height:a}=o.contentRect,r=Math.min(window.devicePixelRatio,2);q.setSize(n,a,!1),q.setPixelRatio(r),window.dispatchEvent(new CustomEvent("universe-resize",{detail:{width:n,height:a}}))}).observe(i),document.addEventListener("visibilitychange",()=>{ce=document.hidden,!ce&&fe&&ye()}),q}function bs(i){re=i,fe=!0,le=performance.now(),ye()}function ye(){if(!fe||ce)return;requestAnimationFrame(ye);const i=performance.now(),t=Math.min((i-le)/1e3,.05);le=i,re&&re(t)}const P={G2025:{id:"G2025",title:"2025–2029 · THE PLAYABLE FRONTIER",primaryColor:3201168,accentColor:6356944,nebulaColor:538656,dustColor:269328,starTint:10551256,worldOffset:[0,0,0],scale:1.3,texturePath:"assets/galaxies/galaxy_2025_2029.png",status:"showcase"},G2020:{id:"G2020",title:"2020–2024 · THE AWAKENING ERA",primaryColor:2652360,accentColor:5286128,nebulaColor:532544,dustColor:266270,starTint:11065599,worldOffset:[32800,14e3,8400],scale:1,texturePath:"assets/galaxies/galaxy_2020_2024.png",status:"known"},G2015:{id:"G2015",title:"2015–2019 · THE EXPANSION ERA",primaryColor:6308032,accentColor:9461992,nebulaColor:2099280,dustColor:1049640,starTint:13674751,worldOffset:[28800,-12e3,-11200],scale:.95,texturePath:"assets/galaxies/galaxy_2015_2019.png",status:"known"},G2010:{id:"G2010",title:"2010–2014 · THE REINVENTION ERA",primaryColor:1751224,accentColor:4251856,nebulaColor:671808,dustColor:530464,starTint:10551264,worldOffset:[-4800,20800,-30400],scale:.9,texturePath:"assets/galaxies/galaxy_2010_2014.png",status:"known"},G2005:{id:"G2005",title:"2005–2009 · THE MOMENTUM ERA",primaryColor:12869674,accentColor:14710848,nebulaColor:9052224,dustColor:4001808,starTint:16760960,worldOffset:[-26e3,-13200,7200],scale:.85,texturePath:"assets/galaxies/galaxy_2005_2009.png",status:"known"},G2000:{id:"G2000",title:"2000–2004 · THE FOUNDATION ERA",primaryColor:12877098,accentColor:15247434,nebulaColor:8007696,dustColor:4004360,starTint:16769184,worldOffset:[-36e3,9600,-2e4],scale:.8,texturePath:"assets/galaxies/galaxy_2000_2004.png",status:"known"},G2030:{id:"G2030",title:"2030–2034 · THE UNCHARTED ERA",primaryColor:4214896,accentColor:6320272,nebulaColor:1054760,dustColor:527380,starTint:8429760,worldOffset:[7200,-24800,-36e3],scale:.75,texturePath:"assets/galaxies/galaxy_2030_2034.png",status:"uncharted"}},jt={position:[0,22e3,58e3],target:[0,0,0]},de=[[-4500,0,-2500],[0,0,4e3],[5e3,0,-2e3]],xs=180,vs=4500,ws=400,Xt=window.matchMedia("(prefers-reduced-motion: reduce)").matches,Ss=6e3;class Ms{camera;target=new v;fly=null;historyStack=[];selectedTarget=null;selectedTargetLabel="";setSelectedTarget(t,e=""){this.selectedTarget=t?new v(t.x,t.y,t.z):null,this.selectedTargetLabel=e||"",window.dispatchEvent(new CustomEvent("universe-selection-state",{detail:{active:!!this.selectedTarget,label:this.selectedTargetLabel,world:this.selectedTarget?{x:this.selectedTarget.x,y:this.selectedTarget.y,z:this.selectedTarget.z}:null}}))}clearSelectedTarget(){this.setSelectedTarget(null,"")}isDragging=!1;prevMouse=new wt;pointerScreen=new wt(window.innerWidth*.5,window.innerHeight*.5);spherical=new is;tmpVec=new v;zoomAnchor=null;velTheta=0;velPhi=0;velRadius=0;DAMPING=.11;canvas;lastUserActivity=performance.now();isIdleDrifting=!1;driftTime=0;constructor(t){this.canvas=t,this.camera=new as(55,window.innerWidth/window.innerHeight,10,2e6);const[e,s,o]=jt.position,[n,a,r]=jt.target;this.camera.position.set(e,s,o),this.target.set(n,a,r),this.camera.lookAt(this.target),this.tmpVec.subVectors(this.camera.position,this.target),this.spherical.setFromVector3(this.tmpVec),this._bindEvents(t),window.addEventListener("universe-resize",l=>{const c=l;this.camera.aspect=c.detail.width/c.detail.height,this.camera.updateProjectionMatrix()})}_onActivity(){this.lastUserActivity=performance.now(),this.isIdleDrifting&&(this.isIdleDrifting=!1)}_bindEvents(t){const e=()=>this._onActivity();window.addEventListener("pointermove",e,{passive:!0}),window.addEventListener("wheel",e,{passive:!0}),window.addEventListener("keydown",e,{passive:!0}),window.addEventListener("touchstart",e,{passive:!0}),t.addEventListener("mousedown",n=>{this._onActivity(),this.isDragging=!0,this.prevMouse.set(n.clientX,n.clientY)}),t.addEventListener("mousemove",n=>{if(this.pointerScreen.set(n.clientX,n.clientY),!this.isDragging)return;this._onActivity();const a=n.clientX-this.prevMouse.x,r=n.clientY-this.prevMouse.y;this._orbit(a*65e-6,r*6e-5),this.prevMouse.set(n.clientX,n.clientY)}),window.addEventListener("mouseup",()=>{this.isDragging=!1}),t.addEventListener("wheel",n=>this._onWheel(n),{passive:!1}),t.addEventListener("dblclick",n=>this._onDblClick(n));let s=0,o=[];t.addEventListener("touchstart",n=>{this._onActivity(),o=Array.from(n.touches),o.length===1?(this.isDragging=!0,this.prevMouse.set(o[0].clientX,o[0].clientY)):o.length===2&&(this.isDragging=!1,s=Ce(o))},{passive:!0}),t.addEventListener("touchmove",n=>{if(this._onActivity(),o=Array.from(n.touches),o.length===1&&this.isDragging){const a=o[0].clientX-this.prevMouse.x,r=o[0].clientY-this.prevMouse.y;this._orbit(a*7e-5,r*6e-5),this.prevMouse.set(o[0].clientX,o[0].clientY)}else if(o.length===2){const a=Ce(o),c=(s-a)*34e-5,p=(o[0].clientX+o[1].clientX)*.5,m=(o[0].clientY+o[1].clientY)*.5,u=this.zoomAnchor?.screen,f=u?.x??p,y=u?.y??m;this.pointerScreen.set(f,y),this._zoomTowardPointer(c,f,y),s=a}},{passive:!0}),t.addEventListener("touchend",()=>{this.isDragging=!1}),window.addEventListener("keydown",n=>{n.key==="Escape"&&window.dispatchEvent(new CustomEvent("universe-esc"))})}_orbit(t,e){this.velTheta-=t,this.velPhi-=e}_onWheel(t){t.preventDefault(),this._onActivity();const e=this.zoomAnchor?.screen,s=e?.x??t.clientX,o=e?.y??t.clientY;this.pointerScreen.set(s,o);const a=rt.clamp(t.deltaY,-120,120)*85e-6;this._zoomTowardPointer(a,s,o)}_zoom(t){const e=rt.clamp(t,-.022,.022);this.velRadius+=e*this.spherical.radius*.026}_zoomTowardPointer(t,e,s){const o=rt.clamp(t,-.022,.022),n=this.screenPointToFocusPoint(e,s),a=rt.clamp(-o*2.35,-.075,.075),r=n.clone().sub(this.target),l=Math.max(180,Math.min(this.spherical.radius*.085,2600)),c=r.multiplyScalar(a);c.length()>l&&c.setLength(l),this.camera.position.add(c),this.tmpVec.subVectors(this.camera.position,this.target),this.spherical.setFromVector3(this.tmpVec),this._zoom(o)}_screenRay(t,e){const s=this.canvas.getBoundingClientRect(),o=new wt((t-s.left)/s.width*2-1,-((e-s.top)/s.height*2-1)),n=new Be;return n.setFromCamera(o,this.camera),n.ray.clone()}screenPointToFocusPoint(t,e){const s=this._screenRay(t,e),o=new v;this.camera.getWorldDirection(o);const n=new Ge().setFromNormalAndCoplanarPoint(o,this.target),a=new v,r=s.intersectPlane(n,a);if(r)return r.clone();const l=Math.max(this.spherical.radius*.65,3500);return this.target.clone().addScaledVector(s.direction,l)}placeZoomAnchor(t,e){const s=this.screenPointToFocusPoint(t,e);return this.zoomAnchor={screen:new wt(t,e),world:s.clone()},this.pointerScreen.set(t,e),s}hasZoomAnchor(){return this.zoomAnchor!==null}isNearZoomAnchor(t,e,s=44){return this.zoomAnchor?this.zoomAnchor.screen.distanceTo(new wt(t,e))<=s:!1}getZoomAnchorScreenPoint(){return this.zoomAnchor?{x:this.zoomAnchor.screen.x,y:this.zoomAnchor.screen.y}:null}getZoomAnchorWorldPoint(){return this.zoomAnchor?.world.clone()??null}clearZoomAnchor(){this.zoomAnchor=null}travelTowardZoomAnchor(t={}){return this.zoomAnchor?this.travelTowardScreenPoint(this.zoomAnchor.screen.x,this.zoomAnchor.screen.y,t):this.travelTowardScreenPoint(this.pointerScreen.x,this.pointerScreen.y,t)}travelTowardScreenPoint(t,e,s={}){const o=this.screenPointToFocusPoint(t,e),n=this.spherical.radius,a=this.camera.position.clone().sub(this.target).normalize(),r=rt.clamp(n*.82,900,26e4),l=o.clone(),c=o.clone().addScaledVector(a,r);return this.flyTo(c,l,{duration:1750,saveHistory:!0,...s}),o}_onDblClick(t){this._onActivity()}update(t){if(this.fly){this._updateFly(t);return}const e=performance.now();!Xt&&!this.isDragging&&e-this.lastUserActivity>Ss&&(this.isIdleDrifting=!0),this.isIdleDrifting?(this.driftTime+=t,this.spherical.theta+=t*.006,this.spherical.phi=rt.clamp(this.spherical.phi+Math.sin(this.driftTime*.18)*12e-5,.05,Math.PI-.05)):(this.spherical.theta+=this.velTheta,this.spherical.phi=rt.clamp(this.spherical.phi+this.velPhi,.05,Math.PI-.05),this.spherical.radius=rt.clamp(this.spherical.radius+this.velRadius,150,32e4),this.velTheta*=1-this.DAMPING,this.velPhi*=1-this.DAMPING,this.velRadius*=1-this.DAMPING),this.tmpVec.setFromSpherical(this.spherical).add(this.target),this.camera.position.copy(this.tmpVec),this.camera.lookAt(this.target)}_updateFly(t){if(!this.fly)return;const e=16;this.fly.elapsed+=e;const s=Xt?1:Math.min(this.fly.elapsed/this.fly.duration,1),o=Es(s);if(this.camera.position.lerpVectors(this.fly.startPos,this.fly.endPos,o),this.target.lerpVectors(this.fly.startTarget,this.fly.endTarget,o),this.camera.lookAt(this.target),s>=1){const n=this.fly.onDone;this.fly=null,this.tmpVec.subVectors(this.camera.position,this.target),this.spherical.setFromVector3(this.tmpVec),this.velTheta=0,this.velPhi=0,this.velRadius=0,n?.()}}flyTo(t,e,s={}){s.saveHistory&&this.historyStack.push(this.snapshot());const o=Xt?200:s.duration??1100;this.fly={startPos:this.camera.position.clone(),startTarget:this.target.clone(),endPos:new v(t.x,t.y,t.z),endTarget:new v(e.x,e.y,e.z),elapsed:0,duration:o,onDone:s.onDone}}travelToObject(t,e=1200,s={}){const o=new v(e*.7,e*.45,e*.7),n={x:t.x+o.x,y:t.y+o.y,z:t.z+o.z};this.flyTo(n,t,{duration:1750,saveHistory:!0,...s})}resetToHome(t={}){const[e,s,o]=jt.position,[n,a,r]=jt.target;this.flyTo({x:e,y:s,z:o},{x:n,y:a,z:r},{duration:1400,saveHistory:!0,...t})}returnToPrevious(t={}){const e=this.historyStack.pop();return e?(this.restoreSnapshot(e,!0),!0):!1}hasHistory(){return this.historyStack.length>0}snapshot(){return{position:[this.camera.position.x,this.camera.position.y,this.camera.position.z],target:[this.target.x,this.target.y,this.target.z],zoom:this.spherical.radius}}restoreSnapshot(t,e=!0){const s={x:t.position[0],y:t.position[1],z:t.position[2]},o={x:t.target[0],y:t.target[1],z:t.target[2]};e?this.flyTo(s,o,{duration:800}):(this.camera.position.set(s.x,s.y,s.z),this.target.set(o.x,o.y,o.z),this.camera.lookAt(this.target),this.tmpVec.subVectors(this.camera.position,this.target),this.spherical.setFromVector3(this.tmpVec))}getTarget(){return this.target.clone()}getRadius(){return this.spherical.radius}isBusy(){return this.fly!==null}}function Es(i){return i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2}function Ce(i){const t=i[1].clientX-i[0].clientX,e=i[1].clientY-i[0].clientY;return Math.sqrt(t*t+e*e)}const Ut=6e4;class Ts{group;starsMesh;dustMesh;constructor(){this.group=new Y,this._buildStarfield(),this._buildDust()}_buildStarfield(){const t=new mt,e=new Float32Array(Ut*3),s=new Float32Array(Ut*3),o=new Float32Array(Ut),n=6e5,a=[new I(16774632),new I(15266047),new I(16769200),new I(11589887),new I(16765136)];for(let l=0;l<Ut;l++){const c=l*3,p=Math.random()*Math.PI*2,m=Math.pow(Math.random(),.5)*n,u=(Math.random()-.5)*n*.35;e[c]=Math.cos(p)*m,e[c+1]=u,e[c+2]=Math.sin(p)*m;const f=a[Math.floor(Math.random()*a.length)];s[c]=f.r,s[c+1]=f.g,s[c+2]=f.b,o[l]=.5+Math.random()*2.5}t.setAttribute("position",new W(e,3)),t.setAttribute("color",new W(s,3)),t.setAttribute("size",new W(o,1));const r=new gt({uniforms:{time:{value:0}},vertexShader:`
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
      `,transparent:!0,depthWrite:!1,blending:H});this.starsMesh=new St(t,r),this.starsMesh.renderOrder=-10,this.group.add(this.starsMesh)}_buildDust(){const e=new mt,s=new Float32Array(1e4*3),o=25e4;for(let a=0;a<1e4;a++){const r=a*3;s[r]=(Math.random()-.5)*o,s[r+1]=(Math.random()-.5)*o*.2,s[r+2]=(Math.random()-.5)*o}e.setAttribute("position",new W(s,3));const n=new Fe({color:3491944,size:90,transparent:!0,opacity:.05,depthWrite:!1,blending:H});this.dustMesh=new St(e,n),this.dustMesh.renderOrder=-9,this.group.add(this.dustMesh)}update(t){const e=this.starsMesh.material;e.uniforms.time.value=t,this.dustMesh.position.y=Math.sin(t*.03)*150}dispose(){this.starsMesh.geometry.dispose(),this.starsMesh.material.dispose(),this.dustMesh.geometry.dispose(),this.dustMesh.material.dispose()}}const As=3e4,Cs=15e4,Is=6e3,ks=22e3;class _s{constructor(t,e){this.data=t,this.labelContainer=e;const s=P[t.id];if(!s)return;const[o,n,a]=s.worldOffset;this.group.position.set(o,n,a),this.group.scale.setScalar(s.scale??1),this.atmosphereRadius=s.status==="showcase"?10500:s.status==="uncharted"?7600:9e3,this.buildSpiralMist(s),this.buildCore(s),this.buildRegionMarkers(s),this.buildThresholdLeds(s),this.buildLabel(),this.buildRegionLabels()}group=new Y;labelEls=[];orbitRings=[];gasLayers=[];gasMaterials=[];ledPivots=[];coreMaterial;galaxyLight;thresholdState=!1;atmosphereRadius=9e3;buildSpiralMist(t){const e=t.status==="showcase",s=t.status==="uncharted",o=e?8200:s?2800:5200,n=e?5:4,a=e?9800:s?6900:8200,r=e?1750:s?900:1250,l=new I(t.primaryColor),c=new I(t.accentColor),p=new I(t.starTint),m=[1,.55,.28],u=s?[.28,.15,.08]:[.72,.36,.2];m.forEach((f,y)=>{const T=Math.floor(o*f),x=new Float32Array(T*3),A=new Float32Array(T*3),C=new Float32Array(T);for(let F=0;F<T;F++){const zt=F%n,pt=Math.pow(Math.random(),.66)*a,Tt=zt*(Math.PI*2/n)+pt*.00105+(Math.random()-.5)*(.2+pt/a*.42)+(y-1)*.06,j=pt+(Math.random()-.5)*(420+y*180);x[F*3]=Math.cos(Tt)*j,x[F*3+1]=(Math.random()-.5)*r*(.22+.78*pt/a)+(y-1)*170,x[F*3+2]=Math.sin(Tt)*j;const ut=l.clone().lerp(c,.28+pt/a*.58);Math.random()<.1&&ut.lerp(p,.7),A[F*3]=ut.r,A[F*3+1]=ut.g,A[F*3+2]=ut.b,C[F]=(e?30:22)+Math.random()*(y===0?64:38)}const D=new mt;D.setAttribute("position",new W(x,3)),D.setAttribute("color",new W(A,3)),D.setAttribute("size",new W(C,1));const B=new gt({uniforms:{time:{value:0},globalAlpha:{value:u[y]}},vertexShader:`
          attribute float size;
          attribute vec3 color;
          uniform float time;
          uniform float globalAlpha;
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vColor = color;
            float pulse = 0.84 + 0.16 * sin(time * 0.45 + position.x * 0.0015 + position.z * 0.001);
            vAlpha = globalAlpha * pulse;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = clamp(size * (620.0 / -mv.z), 0.45, 18.0);
          }
        `,fragmentShader:`
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float d = length(uv);
            if (d > 0.5) discard;
            float soft = smoothstep(0.5, 0.02, d);
            float core = smoothstep(0.18, 0.0, d);
            gl_FragColor = vec4(vColor * (0.78 + core * 0.7), soft * vAlpha);
          }
        `,transparent:!0,depthWrite:!1,blending:H}),dt=new St(D,B);dt.rotation.x=.13+(y-1)*.03,dt.rotation.z=(y-1)*.025,this.group.add(dt),this.gasLayers.push(dt),this.gasMaterials.push(B)})}buildCore(t){const e=t.status==="showcase",s=e?1700:900,o=e?2900:2300,n=new Float32Array(s*3),a=new Float32Array(s);for(let c=0;c<s;c++){const p=Math.random()*Math.PI*2,m=Math.pow(Math.random(),1.75)*o;n[c*3]=Math.cos(p)*m,n[c*3+1]=(Math.random()-.5)*460,n[c*3+2]=Math.sin(p)*m,a[c]=(e?34:24)+Math.random()*86}const r=new mt;r.setAttribute("position",new W(n,3)),r.setAttribute("size",new W(a,1));const l=new gt({uniforms:{color:{value:new I(t.starTint)},time:{value:0},globalAlpha:{value:1}},vertexShader:`
        attribute float size;
        uniform float time;
        uniform float globalAlpha;
        varying float vAlpha;
        void main() {
          vAlpha = (0.4 + 0.28 * sin(time * 0.6 + position.x * 0.0018)) * globalAlpha;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = clamp(size * (620.0 / -mv.z), 0.5, 20.0);
        }
      `,fragmentShader:`
        uniform vec3 color;
        varying float vAlpha;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          gl_FragColor = vec4(color, smoothstep(0.5, 0.0, d) * vAlpha);
        }
      `,transparent:!0,depthWrite:!1,blending:H});this.coreMaterial=l,this.group.add(new St(r,l)),this.galaxyLight=new Rt(t.primaryColor,e?1.25:.58,26e3),this.group.add(this.galaxyLight)}buildThresholdLeds(t){const e=t.status==="showcase"?18:12;for(let s=0;s<e;s++){const o=new Y,n=s/e*Math.PI*2+s%3*.17,a=this.atmosphereRadius*(.82+s%4*.045),r=new X(52+s%3*16,12,10),l=new G({color:s%2?t.accentColor:t.starTint,transparent:!0,opacity:.62,depthWrite:!1,blending:H}),c=new z(r,l);c.position.set(Math.cos(n)*a,Math.sin(n*1.7)*this.atmosphereRadius*.16,Math.sin(n)*a),o.rotation.x=(s%5-2)*.035,o.add(c),this.group.add(o),this.ledPivots.push({pivot:o,node:c,speed:.12+s%4*.035})}}buildRegionMarkers(t){for(const e of de){const s=new lt(650,720,64),o=new G({color:t.accentColor,transparent:!0,opacity:.11,side:ct,depthWrite:!1}),n=new z(s,o);n.position.set(e[0],e[1],e[2]),n.rotation.x=-Math.PI/2,this.orbitRings.push(n),this.group.add(n)}}buildLabel(){const t=P[this.data.id],e=t?.status==="showcase",s=t?.status==="uncharted",o=document.createElement("div");o.className="universe-label galaxy-label",o.dataset.galaxyId=this.data.id,o.innerHTML=`<span class="label-era" style="${e?"color:#60ffd0;font-weight:bold;":s?"color:#6080a0;":""}">${e?"✦ ":""}${this.data.title}${s?" — UNCHARTED":""}</span>`,o.style.cssText="position:absolute;top:0;left:0;pointer-events:none;font-family:'Space Mono',monospace;font-size:clamp(10px,1.3vw,14px);letter-spacing:.18em;text-transform:uppercase;white-space:nowrap;transform:translate(-50%,-50%);user-select:none;",this.labelContainer.appendChild(o),this.labelEls.push({el:o,pos:new v(0,1800,0),kind:"galaxy"})}buildRegionLabels(){this.data.regions.forEach((t,e)=>{const s=de[e]??[0,0,0],o=document.createElement("div");o.className="universe-label region-label",o.dataset.regionId=t.id,o.innerHTML=`<span style="font-weight:600;color:#c0e0ff;">${t.title}</span>${t.subtitle?`<br/><span style="font-size:.8em;opacity:.7;font-weight:normal;">${t.subtitle}</span>`:""}`,o.style.cssText="position:absolute;top:0;left:0;pointer-events:none;font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,.95vw,11px);letter-spacing:.12em;text-transform:uppercase;white-space:nowrap;transform:translate(-50%,-50%);user-select:none;text-align:center;",this.labelContainer.appendChild(o),this.labelEls.push({el:o,pos:new v(s[0],s[1]+750,s[2]),kind:"region"})})}updateLabels(t,e,s){const{width:o,height:n}=e.domElement.getBoundingClientRect();for(const{el:a,pos:r,kind:l}of this.labelEls){const c=r.clone();this.group.localToWorld(c);const p=s.distanceTo(c),m=l==="galaxy"?Ie(p,Cs,As):Ie(p,ks,Is),u=c.clone().project(t);if(u.z>1||m<.02){a.style.opacity="0";continue}a.style.opacity=String(m),a.style.left=`${(u.x*.5+.5)*o}px`,a.style.top=`${(-u.y*.5+.5)*n}px`}}update(t,e){const s=this.group.getWorldPosition(new v),o=this.atmosphereRadius*this.group.scale.x,a=s.distanceTo(e)<o*1.02;if(a!==this.thresholdState){this.thresholdState=a;const l=P[this.data.id];window.dispatchEvent(new CustomEvent("universe-galaxy-threshold",{detail:{galaxyId:this.data.id,title:this.data.title,state:a?"enter":"exit",primaryColor:l.primaryColor,accentColor:l.accentColor}}))}const r=[.72,.36,.2];this.gasLayers.forEach((l,c)=>{l.rotation.y=t*(c===0?.0032:c===1?-.0017:.0011),l.rotation.z=Math.sin(t*.045+c)*.008;const p=this.gasMaterials[c];p.uniforms.time.value=t;const m=P[this.data.id]?.status==="uncharted"?.55:1;p.uniforms.globalAlpha.value=r[c]*(a?.16:1)*m}),this.coreMaterial&&(this.coreMaterial.uniforms.time.value=t,this.coreMaterial.uniforms.globalAlpha.value=a?.42:1),this.orbitRings.forEach(l=>{l.material.opacity=(a?.035:.09)+.025*Math.sin(t*.45)}),this.ledPivots.forEach(l=>{l.pivot.rotation.y+=l.speed*.003,l.pivot.rotation.x+=l.speed*.001,l.node.material.opacity=(a?.2:.58)+.1*Math.sin(t*.8+l.speed*20)}),this.galaxyLight.intensity=(P[this.data.id]?.status==="showcase"?1.25:.58)*(a?.45:1)}getId(){return this.data.id}distanceTo(t){return this.group.getWorldPosition(new v).distanceTo(t)}getShellBoundaryRadius(){return this.atmosphereRadius*this.group.scale.x}dispose(){this.labelEls.forEach(({el:t})=>t.remove()),this.gasLayers.forEach(t=>{t.geometry.dispose(),t.material.dispose()}),this.coreMaterial?.dispose()}}function Ie(i,t,e){return i>=t?0:i<=e?1:1-(i-e)/(t-e)}const Rs=3e3,Ls=6e4;class Ps{group;instancedFar;instancedMid;nearMeshes=new Map;stars=[];dummy=new rs;labelContainer;labelEls=new Map;myStarId=null;constructor(t){this.group=new Y,this.labelContainer=t,this._buildFarInstanced(),this._buildMidInstanced()}_buildFarInstanced(){const t=new X(30,4,4),e=new G({color:16777215,transparent:!0,opacity:.7});this.instancedFar=new Te(t,e,25e3),this.instancedFar.instanceMatrix.setUsage(Ae),this.instancedFar.count=0,this.group.add(this.instancedFar)}_buildMidInstanced(){const t=new X(60,6,6),e=new G({color:16777215});this.instancedMid=new Te(t,e,25e3),this.instancedMid.instanceMatrix.setUsage(Ae),this.instancedMid.count=0,this.instancedMid.visible=!1,this.group.add(this.instancedMid)}setStars(t,e=null){this.stars=t,this.myStarId=e,this._rebuildFar()}_rebuildFar(){const t=new I;let e=0;for(const s of this.stars){if(e>=25e3)break;this.dummy.position.set(s.x,s.y,s.z),this.dummy.scale.setScalar(s.id===this.myStarId?1.8:1),this.dummy.updateMatrix(),this.instancedFar.setMatrixAt(e,this.dummy.matrix);const o=P[s.galaxyId],n=o?new I(o.starTint):t.set(16777215);s.id===this.myStarId&&n.setHex(16766720),this.instancedFar.setColorAt(e,n),e++}this.instancedFar.count=e,this.instancedFar.instanceMatrix.needsUpdate=!0,this.instancedFar.instanceColor&&(this.instancedFar.instanceColor.needsUpdate=!0)}update(t,e,s){const{width:o,height:n}=s.domElement.getBoundingClientRect(),a=t.length();this.instancedFar.visible=!0,this.instancedMid.visible=!1;for(const r of this.stars){const l=new v(r.x,r.y,r.z),c=t.distanceTo(l);c<Rs?(this._ensureNearMesh(r),this._updateLabel(r,l,e,o,n,c)):(this._removeNearMesh(r.id),this._updateLabel(r,l,e,o,n,c))}a<3e4||t.distanceTo(this.group.position)<Ls}_ensureNearMesh(t){if(this.nearMeshes.has(t.id))return;const e=new X(80,12,12),s=P[t.galaxyId],o=s?s.starTint:16777215,n=new ae({color:o,emissive:o,emissiveIntensity:.6,roughness:.1,metalness:.4}),a=new z(e,n);a.position.set(t.x,t.y,t.z),a.userData.starId=t.id,this.group.add(a),this.nearMeshes.set(t.id,a)}_removeNearMesh(t){const e=this.nearMeshes.get(t);e&&(this.group.remove(e),e.material.dispose(),e.geometry.dispose(),this.nearMeshes.delete(t))}_updateLabel(t,e,s,o,n,a){const c=1-Math.min(1,Math.max(0,(a-1200)/2800));if(c<.02){const y=this.labelEls.get(t.id);y&&(y.style.opacity="0");return}let p=this.labelEls.get(t.id);p||(p=document.createElement("div"),p.className="universe-label star-label",p.style.cssText=`
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
      `,p.textContent=t.displayName,this.labelContainer.appendChild(p),this.labelEls.set(t.id,p));const m=e.clone().project(s),u=(m.x*.5+.5)*o,f=(-(m.y*.5)+.5)*n;m.z>1?p.style.opacity="0":(p.style.opacity=String(c),p.style.left=`${u}px`,p.style.top=`${f}px`)}getClickTarget(t){const e=Array.from(this.nearMeshes.values()),s=t.intersectObjects(e);if(s.length>0){const n=s[0].object.userData.starId;return n?{starId:n}:null}const o=t.intersectObject(this.instancedFar);if(o.length>0&&o[0].instanceId!==void 0){const n=this.stars[o[0].instanceId];return n?{starId:n.id}:null}return null}addStar(t){this.stars.push(t),this._rebuildFar()}dispose(){for(const[,t]of this.labelEls)t.remove();this.instancedFar.dispose(),this.instancedMid.dispose();for(const[,t]of this.nearMeshes)t.geometry.dispose(),t.material.dispose()}}const zs=new je,Kt={};function Lt(i){if(!Kt[i]){const t=zs.load(i);t.colorSpace=ge,Kt[i]=t}return Kt[i]}function Os(i){switch(i){case"OBJ-FIRE":return"assets/object_styles/music_planet.png";case"OBJ-AFRICA":return"assets/object_styles/life_planet.png";case"OBJ-STREAMS":return"assets/object_styles/experimental_planet.png";case"OBJ-EBONY":return"assets/object_styles/controller_planet.png";case"OBJ-AVIATOR":return"assets/object_styles/story_planet.png";case"OBJ-AWAY":return"assets/object_styles/legacy_planet.png";case"OBJ-FLYZONE":case"OBJ-TIGER":return"assets/object_styles/space_station.png";default:return"assets/object_styles/culture_planet.png"}}function $s(i){const t=i.mediaKind??"archive",e=(i.title??"").toLowerCase();return t==="playable"?"assets/object_styles/controller_planet.png":t==="audio"?e.includes("lyrics")?"assets/object_styles/lyrics_moon.png":e.includes("stem")||e.includes("instrumental")?"assets/object_styles/stem_moon.png":"assets/object_styles/song_moon.png":t==="video"?"assets/object_styles/video_moon.png":e.includes("photo")||e.includes("gallery")||e.includes("image")?"assets/object_styles/photo_moon.png":e.includes("behind")||e.includes("dossier")||e.includes("making")?"assets/object_styles/behind_moon.png":e.includes("art")||e.includes("cover")?"assets/object_styles/artwork_moon.png":e.includes("asset")||e.includes("source")?"assets/object_styles/game_asset_moon.png":e.includes("spotify")||e.includes("apple")||e.includes("music")||e.includes("stream")?"assets/object_styles/streaming_sat.png":e.includes("youtube")||e.includes("video")||e.includes("visual")?"assets/object_styles/youtube_sat.png":e.includes("merch")||e.includes("store")||e.includes("shop")?"assets/object_styles/merch_sat.png":e.includes("social")||e.includes("instagram")||e.includes("twitter")||e.includes("tiktok")?"assets/object_styles/social_sat.png":e.includes("book")||e.includes("show")||e.includes("tour")?"assets/object_styles/booking_sat.png":e.includes("collab")||e.includes("feat")||e.includes("feature")?"assets/object_styles/collab_sat.png":e.includes("press")||e.includes("article")||e.includes("interview")?"assets/object_styles/press_sat.png":"assets/object_styles/behind_moon.png"}function Ns(i,t,e){const s=new Y,o=Os(i),n=Lt(o),a=new ft({map:n,transparent:!0,depthWrite:!1}),r=new yt(a);r.scale.set(t*2.2,t*2.2,1),s.add(r);const l=new ft({map:n,color:new I(e),transparent:!0,opacity:.3,blending:H,depthWrite:!1}),c=new yt(l);c.scale.set(t*2.8,t*2.8,1),s.add(c);const p=new lt(t*1.1,t*1.25,64),m=new G({color:e,transparent:!0,opacity:.22,side:ct,depthWrite:!1,blending:H}),u=new z(p,m);u.rotation.x=-Math.PI/2+.15,u.rotation.y=.1,s.add(u);const f=new X(t*1.2,16,16),y=new G({transparent:!0,opacity:0,depthWrite:!1}),T=new z(f,y);return s.add(T),{group:s,clickTarget:T}}function Wt(i,t,e){const s=new Y,o=$s(i),n=Lt(o),a=new ft({map:n,transparent:!0,depthWrite:!1}),r=new yt(a);r.scale.set(t*2.3,t*2.3,1),s.add(r);const l=new lt(t*1.15,t*1.35,32),c=new G({color:e,transparent:!0,opacity:.35,side:ct,depthWrite:!1,blending:H}),p=new z(l,c);p.rotation.x=-Math.PI/2+(Math.random()-.5)*.3,s.add(p);const m=new ft({map:n,color:new I(e),transparent:!0,opacity:.4,blending:H,depthWrite:!1}),u=new yt(m);u.scale.set(t*2.9,t*2.9,1),s.add(u);const f=new X(t*1.45,12,12),y=new G({transparent:!0,opacity:0,depthWrite:!1}),T=new z(f,y);return s.add(T),{group:s,clickTarget:T}}const ke=[800,1300,1900,2600],Ds=[.35,.22,.14,.09];class Bs{group;planetMesh;children=[];labelContainer;time=0;objectData;onObjectClick=null;clickTargets=[];constructor(t,e){this.objectData=t,this.labelContainer=e,this.group=new Y,this.group.position.set(t.position.x,t.position.y,t.position.z);const s=P.G2020;s&&(this.group.position.x+=s.worldOffset[0],this.group.position.z+=s.worldOffset[2]),this._buildPlanet(),this._buildOrbitRings(),this._buildChildren()}_buildPlanet(){const t=new X(420,48,48),e=new gt({uniforms:{time:{value:0},deepColor:{value:new I(268328)},shallowColor:{value:new I(673904)},rimColor:{value:new I(2150608)}},vertexShader:`
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
      `,transparent:!1});this.planetMesh=new z(t,e),this.planetMesh.userData.objectId=this.objectData.id,this.group.add(this.planetMesh),this.clickTargets.push(this.planetMesh);const s=Lt("assets/object_styles/experimental_planet.png"),o=new ft({map:s,transparent:!0,depthWrite:!1}),n=new yt(o);n.scale.set(420*2.2,420*2.2,1),this.group.add(n);const a=new Rt(2138320,1.2,5e3);this.group.add(a)}_buildOrbitRings(){for(const t of ke){const e=new lt(t-4,t+4,96),s=new G({color:1720416,transparent:!0,opacity:.25,side:ct,depthWrite:!1}),o=new z(e,s);o.rotation.x=-Math.PI/2,this.group.add(o)}}_buildChildren(){const t=this.objectData.children??[],e={audio:"♪",video:"▶",playable:"⚡",archive:"◈"};for(let s=0;s<t.length;s++){const o=t[s],n=ke[s]??800+s*500,a=Ds[s]??.08,r=s/t.length*Math.PI*2,l=(s%2===0?1:-1)*(s*60),c=o.mediaKind??"archive",p=Wt(o,75,2138320);p.group.position.set(Math.cos(r)*n,l,Math.sin(r)*n);const m=p.clickTarget;m.userData.childId=o.id,m.userData.contentStatus=o.contentStatus,this.group.add(p.group),this.clickTargets.push(m);const u=document.createElement("div");u.className="universe-label streams-child-label",u.style.cssText=`
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
      `,u.innerHTML=`<span>${e[c]??"○"}</span><br/><span>${o.title}</span>`,this.labelContainer.appendChild(u),this.children.push({id:o.id,title:o.title,mediaKind:c,contentStatus:o.contentStatus??"awaiting-source",mesh:p.group,orbitRadius:n,orbitSpeed:a,orbitAngle:r,orbitY:l,labelEl:u})}}update(t,e,s){this.time+=t;const o=this.planetMesh.material;o.uniforms.time.value=this.time,this.planetMesh.rotation.y+=t*.06;for(const n of this.children)n.orbitAngle+=t*n.orbitSpeed*.72,n.mesh.position.set(Math.cos(n.orbitAngle)*n.orbitRadius,n.orbitY,Math.sin(n.orbitAngle)*n.orbitRadius),n.mesh.rotation.y+=t*.5,n.mesh.rotation.x+=t*.3;this._updateLabels(e,s)}_updateLabels(t,e){const{width:s,height:o}=e.domElement.getBoundingClientRect(),n=new v;t.getWorldPosition(n);for(const a of this.children){const r=new v;a.mesh.getWorldPosition(r);const l=n.distanceTo(r),c=800,m=1-Math.min(1,Math.max(0,(l-c)/(3500-c))),u=r.clone().project(t),f=(u.x*.5+.5)*s,y=(-(u.y*.5)+.5)*o;u.z>1||m<.02?a.labelEl.style.opacity="0":(a.labelEl.style.opacity=String(m),a.labelEl.style.left=`${f}px`,a.labelEl.style.top=`${y}px`)}}getChildData(t){return this.children.find(e=>e.id===t)}getPlanetWorldPos(){const t=new v;return this.planetMesh.getWorldPosition(t),t}dispose(){for(const t of this.children)t.mesh.traverse(e=>{if(e.isMesh){const s=e;s.geometry?.dispose(),Array.isArray(s.material)?s.material.forEach(o=>o.dispose()):s.material?.dispose()}else e.isSprite&&e.material?.dispose()}),t.labelEl.remove();this.planetMesh.geometry.dispose(),this.planetMesh.material.dispose()}}class Gs{group;planetMesh;emberParticles;children=[];labelContainer;time=0;objectData;clickTargets=[];constructor(t,e){this.objectData=t,this.labelContainer=e,this.group=new Y;const[s,o,n]=P.G2025?.worldOffset??[0,0,0];this.group.position.set(s+t.position.x,o+t.position.y,n+t.position.z),this._buildMoltenPlanet(),this._buildEmbers(),this._buildOrbitRings(),this._buildChildren()}_buildMoltenPlanet(){const t=new X(450,48,48),e=new gt({uniforms:{time:{value:0},crustColor:{value:new I(1574918)},moltenColor:{value:new I(14965544)},emberGlow:{value:new I(16750848)}},vertexShader:`
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
      `});this.planetMesh=new z(t,e),this.planetMesh.userData.objectId=this.objectData.id,this.group.add(this.planetMesh),this.clickTargets.push(this.planetMesh);const s=Lt("assets/object_styles/music_planet.png"),o=new ft({map:s,transparent:!0,depthWrite:!1}),n=new yt(o);n.scale.set(450*2.2,450*2.2,1),this.group.add(n);const a=new Rt(14965544,1.5,6e3);this.group.add(a)}_buildEmbers(){const e=new mt,s=new Float32Array(600*3),o=new Float32Array(600);for(let a=0;a<600;a++){const r=Math.random()*Math.PI*2,l=Math.acos(Math.random()*2-1),c=470+Math.random()*350;s[a*3]=c*Math.sin(l)*Math.cos(r),s[a*3+1]=c*Math.sin(l)*Math.sin(r),s[a*3+2]=c*Math.cos(l),o[a]=4+Math.random()*12}e.setAttribute("position",new W(s,3)),e.setAttribute("size",new W(o,1));const n=new gt({uniforms:{time:{value:0}},vertexShader:`
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
      `,transparent:!0,depthWrite:!1,blending:H});this.emberParticles=new St(e,n),this.group.add(this.emberParticles)}_buildOrbitRings(){const t=[900,1500,2200];for(const e of t){const s=new lt(e-5,e+5,64),o=new G({color:14965544,transparent:!0,opacity:.2,side:ct,depthWrite:!1}),n=new z(s,o);n.rotation.x=-Math.PI/2,this.group.add(n)}}_buildChildren(){const t=this.objectData.children??[],e=[900,1500,2200,2900],s=[.3,.2,.14,.09];for(let o=0;o<t.length;o++){const n=t[o],a=e[o]??1e3+o*600,r=s[o]??.1,l=o/t.length*Math.PI*2,c=n.mediaKind??"archive",p=Wt(n,75,14965544);p.group.position.set(Math.cos(l)*a,0,Math.sin(l)*a);const m=p.clickTarget;m.userData.childId=n.id,m.userData.contentStatus=n.contentStatus,this.group.add(p.group),this.clickTargets.push(m);const u=document.createElement("div");u.className="universe-label fire-child-label",u.style.cssText=`
        position:absolute;top:0;left:0;pointer-events:none;
        font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,0.9vw,11px);
        letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,200,180,0);
        white-space:nowrap;transform:translate(-50%,-130%);transition:color 0.3s;
        user-select:none;text-align:center;line-height:1.4;
      `;const f=c==="playable"?"◇ SATELLITE":c==="audio"?"♪ AUDIO":c==="video"?"▶ VIDEO":"◐ ARCHIVE";u.innerHTML=`<span>${f}</span><br/><span>${n.title}</span>`,this.labelContainer.appendChild(u),this.children.push({id:n.id,title:n.title,mediaKind:c,contentStatus:n.contentStatus??"live",mesh:p.group,orbitRadius:a,orbitSpeed:r,orbitAngle:l,labelEl:u})}}update(t,e,s){this.time+=t;const o=this.planetMesh.material;o.uniforms.time.value=this.time,this.planetMesh.rotation.y+=t*.05;const n=this.emberParticles.material;n.uniforms.time.value=this.time;for(const a of this.children)a.orbitAngle+=t*a.orbitSpeed*.72,a.mesh.position.set(Math.cos(a.orbitAngle)*a.orbitRadius,Math.sin(this.time*.5+a.orbitRadius)*40,Math.sin(a.orbitAngle)*a.orbitRadius),a.mesh.rotation.y+=t*.6;this._updateLabels(e,s)}_updateLabels(t,e){const{width:s,height:o}=e.domElement.getBoundingClientRect(),n=new v;t.getWorldPosition(n);for(const a of this.children){const r=new v;a.mesh.getWorldPosition(r);const l=n.distanceTo(r),c=900,m=1-Math.min(1,Math.max(0,(l-c)/(3800-c))),u=r.clone().project(t),f=(u.x*.5+.5)*s,y=(-(u.y*.5)+.5)*o;u.z>1||m<.02?a.labelEl.style.opacity="0":(a.labelEl.style.opacity=String(m),a.labelEl.style.left=`${f}px`,a.labelEl.style.top=`${y}px`)}}getChildData(t){return this.children.find(e=>e.id===t)}getPlanetWorldPos(){const t=new v;return this.planetMesh.getWorldPosition(t),t}dispose(){for(const t of this.children)t.mesh.traverse(e=>{if(e.isMesh){const s=e;s.geometry?.dispose(),Array.isArray(s.material)?s.material.forEach(o=>o.dispose()):s.material?.dispose()}else e.isSprite&&e.material?.dispose()}),t.labelEl.remove();this.planetMesh.geometry.dispose(),this.planetMesh.material.dispose()}}class Fs{group;planetMesh;cloudMesh;birdParticles;children=[];labelContainer;time=0;objectData;clickTargets=[];constructor(t,e){this.objectData=t,this.labelContainer=e,this.group=new Y;const[s,o,n]=P.G2025?.worldOffset??[0,0,0];this.group.position.set(s+t.position.x,o+t.position.y,n+t.position.z),this._buildSunrisePlanet(),this._buildClouds(),this._buildBirdParticles(),this._buildOrbitRings(),this._buildChildren()}_buildSunrisePlanet(){const t=new X(460,48,48),e=new gt({uniforms:{time:{value:0},goldColor:{value:new I(13732918)},earthColor:{value:new I(2823945)},greenTone:{value:new I(3829824)},sunRay:{value:new I(16769184)}},vertexShader:`
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
      `});this.planetMesh=new z(t,e),this.planetMesh.userData.objectId=this.objectData.id,this.group.add(this.planetMesh),this.clickTargets.push(this.planetMesh);const s=Lt("assets/object_styles/life_planet.png"),o=new ft({map:s,transparent:!0,depthWrite:!1}),n=new yt(o);n.scale.set(460*2.2,460*2.2,1),this.group.add(n);const a=new Rt(13732918,1.6,7e3);this.group.add(a)}_buildClouds(){const t=new X(480,36,36),e=new G({color:16772560,transparent:!0,opacity:.18,depthWrite:!1,blending:H});this.cloudMesh=new z(t,e),this.group.add(this.cloudMesh)}_buildBirdParticles(){const e=new mt,s=new Float32Array(300*3);for(let n=0;n<300;n++){const a=Math.random()*Math.PI*2,r=520+Math.random()*400;s[n*3]=Math.cos(a)*r,s[n*3+1]=(Math.random()-.5)*300,s[n*3+2]=Math.sin(a)*r}e.setAttribute("position",new W(s,3));const o=new Fe({color:16765072,size:14,transparent:!0,opacity:.45,blending:H,depthWrite:!1});this.birdParticles=new St(e,o),this.group.add(this.birdParticles)}_buildOrbitRings(){const t=[950,1400,1900,2400,2900];for(const e of t){const s=new lt(e-4,e+4,64),o=new G({color:13732918,transparent:!0,opacity:.22,side:ct,depthWrite:!1}),n=new z(s,o);n.rotation.x=-Math.PI/2,this.group.add(n)}}_buildChildren(){const t=this.objectData.children??[];for(let e=0;e<t.length;e++){const s=t[e],o=950+e%5*480,n=.25-e%5*.035,a=e/t.length*Math.PI*2,r=s.mediaKind??"archive",l=Wt(s,70,13732918);l.group.position.set(Math.cos(a)*o,(e%2===0?1:-1)*(e*30),Math.sin(a)*o);const c=l.clickTarget;c.userData.childId=s.id,c.userData.contentStatus=s.contentStatus,c.userData.mediaUrl=s.mediaUrl,c.userData.posterUrl=s.posterUrl,this.group.add(l.group),this.clickTargets.push(c);const p=document.createElement("div");p.className="universe-label africa-child-label",p.style.cssText=`
        position:absolute;top:0;left:0;pointer-events:none;
        font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,0.85vw,10px);
        letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,230,190,0);
        white-space:nowrap;transform:translate(-50%,-130%);transition:color 0.3s;
        user-select:none;text-align:center;line-height:1.4;
      `;const m=r==="playable"?"◇ SATELLITE":r==="audio"?"♪ AUDIO":r==="video"?"▶ DOC":"◐ ARCHIVE";p.innerHTML=`<span>${m}</span><br/><span>${s.title}</span>`,this.labelContainer.appendChild(p),this.children.push({id:s.id,title:s.title,mediaKind:r,contentStatus:s.contentStatus??"live",mediaUrl:s.mediaUrl,posterUrl:s.posterUrl,mesh:l.group,orbitRadius:o,orbitSpeed:n,orbitAngle:a,labelEl:p})}}update(t,e,s){this.time+=t;const o=this.planetMesh.material;o.uniforms.time.value=this.time,this.planetMesh.rotation.y+=t*.04,this.cloudMesh.rotation.y+=t*.07,this.birdParticles.rotation.y+=t*.12;for(const n of this.children)n.orbitAngle+=t*n.orbitSpeed*.72,n.mesh.position.set(Math.cos(n.orbitAngle)*n.orbitRadius,Math.sin(this.time*.4+n.orbitRadius)*35,Math.sin(n.orbitAngle)*n.orbitRadius),n.mesh.rotation.y+=t*.5;this._updateLabels(e,s)}_updateLabels(t,e){const{width:s,height:o}=e.domElement.getBoundingClientRect(),n=new v;t.getWorldPosition(n);for(const a of this.children){const r=new v;a.mesh.getWorldPosition(r);const l=n.distanceTo(r),c=900,m=1-Math.min(1,Math.max(0,(l-c)/(3800-c))),u=r.clone().project(t),f=(u.x*.5+.5)*s,y=(-(u.y*.5)+.5)*o;u.z>1||m<.02?a.labelEl.style.opacity="0":(a.labelEl.style.opacity=String(m),a.labelEl.style.left=`${f}px`,a.labelEl.style.top=`${y}px`)}}getChildData(t){return this.children.find(e=>e.id===t)}getPlanetWorldPos(){const t=new v;return this.planetMesh.getWorldPosition(t),t}dispose(){for(const t of this.children)t.mesh.traverse(e=>{if(e.isMesh){const s=e;s.geometry?.dispose(),Array.isArray(s.material)?s.material.forEach(o=>o.dispose()):s.material?.dispose()}else e.isSprite&&e.material?.dispose()}),t.labelEl.remove();this.planetMesh.geometry.dispose(),this.planetMesh.material.dispose(),this.cloudMesh.geometry.dispose(),this.cloudMesh.material.dispose()}}class js{group;planetMeshes=[];children=[];labelContainer;time=0;clickTargets=[];constructor(t,e){this.labelContainer=e,this.group=new Y;const[s,o,n]=P.G2025?.worldOffset??[0,0,0];this.group.position.set(s,o,n);for(const a of t)a.id==="OBJ-FIRE"||a.id==="OBJ-AFRICA"||a.id==="OBJ-STREAMS"||this._buildSystem(a)}_buildSystem(t){const e=new v(t.position.x,t.position.y,t.position.z),s=t.accentColor?parseInt(t.accentColor.replace("#","0x"),16):4227264,o=t.id==="OBJ-EBONY"?360:t.id==="OBJ-AVIATOR"?260:t.id==="OBJ-AWAY"?320:280,n=Ns(t.id,o,s);n.group.position.copy(e),n.clickTarget.userData.objectId=t.id,this.group.add(n.group),this.planetMeshes.push(n.group),this.clickTargets.push(n.clickTarget);const a=new lt(650,660,48),r=new G({color:s,transparent:!0,opacity:.2,side:ct,depthWrite:!1}),l=new z(a,r);if(l.position.copy(e),l.rotation.x=-Math.PI/2,this.group.add(l),t.children){const c=[700,1100,1600];for(let p=0;p<t.children.length;p++){const m=t.children[p],u=c[p]??800+p*450,f=p/t.children.length*Math.PI*2,y=m.mediaKind??"archive",T=Wt(m,65,s);T.group.position.set(e.x+Math.cos(f)*u,e.y,e.z+Math.sin(f)*u);const x=T.clickTarget;x.userData.childId=m.id,x.userData.contentStatus=m.contentStatus,x.userData.mediaUrl=m.mediaUrl,this.group.add(T.group),this.clickTargets.push(x);const A=document.createElement("div");A.className="universe-label frontier-child-label",A.style.cssText=`
          position:absolute;top:0;left:0;pointer-events:none;
          font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,0.85vw,10px);
          letter-spacing:0.1em;text-transform:uppercase;color:rgba(220,240,255,0);
          white-space:nowrap;transform:translate(-50%,-130%);transition:color 0.3s;
          user-select:none;text-align:center;line-height:1.4;
        `;const C=y==="playable"?"◇ SATELLITE":y==="audio"?"♪ AUDIO":y==="video"?"▶ VIDEO":"◐ ARCHIVE";A.innerHTML=`<span>${C}</span><br/><span>${m.title}</span>`,this.labelContainer.appendChild(A),this.children.push({id:m.id,title:m.title,mediaKind:y,contentStatus:m.contentStatus??"live",mediaUrl:m.mediaUrl,mesh:T.group,orbitRadius:u,orbitSpeed:.2+p%3*.08,orbitAngle:f,parentPos:e,labelEl:A})}}}update(t,e,s){this.time+=t;for(const o of this.planetMeshes)o.rotation.y+=t*.1,o.rotation.x+=t*.05;for(const o of this.children)o.orbitAngle+=t*o.orbitSpeed*.72,o.mesh.position.set(o.parentPos.x+Math.cos(o.orbitAngle)*o.orbitRadius,o.parentPos.y+Math.sin(this.time*.5+o.orbitRadius)*25,o.parentPos.z+Math.sin(o.orbitAngle)*o.orbitRadius),o.mesh.rotation.y+=t*.6;this._updateLabels(e,s)}_updateLabels(t,e){const{width:s,height:o}=e.domElement.getBoundingClientRect(),n=new v;t.getWorldPosition(n);for(const a of this.children){const r=new v;a.mesh.getWorldPosition(r);const l=n.distanceTo(r),c=900,m=1-Math.min(1,Math.max(0,(l-c)/(3800-c))),u=r.clone().project(t),f=(u.x*.5+.5)*s,y=(-(u.y*.5)+.5)*o;u.z>1||m<.02?a.labelEl.style.opacity="0":(a.labelEl.style.opacity=String(m),a.labelEl.style.left=`${f}px`,a.labelEl.style.top=`${y}px`)}}getChildData(t){return this.children.find(e=>e.id===t)}dispose(){for(const t of this.children)t.mesh.traverse(e=>{if(e.isMesh){const s=e;s.geometry?.dispose(),Array.isArray(s.material)?s.material.forEach(o=>o.dispose()):s.material?.dispose()}else e.isSprite&&e.material?.dispose()}),t.labelEl.remove();for(const t of this.planetMeshes)t.traverse(e=>{if(e.isMesh){const s=e;s.geometry?.dispose(),Array.isArray(s.material)?s.material.forEach(o=>o.dispose()):s.material?.dispose()}else e.isSprite&&e.material?.dispose()})}}const Us={G2000:[{title:"BRASS ARCHIVE WORLD",texture:"assets/era/planet_foundation_brass.jpg",radius:620,orbit:2400,speed:.08,kind:"planet"},{title:"ANALOG MOON",texture:"assets/era/planet_foundation_archive.jpg",radius:300,orbit:3900,speed:-.11,kind:"moon"},{title:"ORIGIN RELIC",texture:"",radius:180,orbit:5200,speed:.05,kind:"artifact"}],G2005:[{title:"CRIMSON MOMENTUM WORLD",texture:"assets/era/planet_momentum_crimson.jpg",radius:690,orbit:2600,speed:.1,kind:"planet"},{title:"CHROME SIGNAL MOON",texture:"assets/era/planet_momentum_chrome.jpg",radius:280,orbit:4200,speed:-.13,kind:"moon"},{title:"BROADCAST RELIC",texture:"",radius:190,orbit:5600,speed:.07,kind:"artifact"}],G2010:[{title:"PRISM REINVENTION WORLD",texture:"assets/era/planet_reinvention_violet.jpg",radius:670,orbit:2500,speed:.07,kind:"planet"},{title:"GLASS MOON",texture:"assets/era/planet_reinvention_glass.jpg",radius:315,orbit:4e3,speed:-.09,kind:"moon"},{title:"CRYSTAL ARCHIVE",texture:"",radius:210,orbit:5400,speed:.06,kind:"artifact"}],G2015:[{title:"EMBER EXPANSION WORLD",texture:"assets/era/planet_expansion_ember.jpg",radius:760,orbit:2800,speed:.085,kind:"planet"},{title:"GOLDEN ORBIT MOON",texture:"assets/era/planet_expansion_gold.jpg",radius:330,orbit:4500,speed:-.1,kind:"moon"},{title:"SIGNAL RING STATION",texture:"",radius:220,orbit:6e3,speed:.045,kind:"artifact"}],G2020:[{title:"TEAL AWAKENING WORLD",texture:"assets/era/planet_awakening_teal.jpg",radius:700,orbit:2550,speed:.065,kind:"planet"},{title:"CLOUD REFLECTION MOON",texture:"assets/era/planet_awakening_cloud.jpg",radius:350,orbit:4300,speed:-.08,kind:"moon"},{title:"REFLECTION SATELLITE",texture:"",radius:190,orbit:5700,speed:.055,kind:"artifact"}],G2030:[{title:"UNCHARTED SIGNAL WORLD",texture:"assets/era/planet_awakening_cloud.jpg",radius:640,orbit:2350,speed:.05,kind:"planet"},{title:"FUTURE ECHO MOON",texture:"assets/era/planet_reinvention_glass.jpg",radius:290,orbit:3950,speed:-.075,kind:"moon"},{title:"HORIZON ARCHIVE",texture:"",radius:185,orbit:5450,speed:.042,kind:"artifact"}]};class Vs{constructor(t){this.galaxyId=t;const e=P[t],s=Us[t];if(!e||!s)return;this.group.position.set(...e.worldOffset),s.forEach((n,a)=>{const r=new Y;r.rotation.x=(a-1)*.22,r.rotation.z=a*.4+.12;const l=n.kind==="artifact"?new ls(n.radius,1):new X(n.radius,44,28);let c;if(n.texture){const x=this.loader.load(n.texture);x.colorSpace=ge,x.wrapS=cs,c=new ae({map:x,roughness:n.kind==="moon"?.7:.48,metalness:n.kind==="planet"?.12:.28,emissive:e.nebulaColor,emissiveIntensity:.18})}else c=new ae({color:e.accentColor,roughness:.28,metalness:.78,emissive:e.primaryColor,emissiveIntensity:.22,wireframe:!1});const p=new z(l,c);p.position.x=n.orbit,p.userData.eraShell=!0,p.userData.galaxyId=t,p.userData.title=n.title,r.add(p),this.group.add(r),this.clickTargets.push(p),this.orbiters.push({pivot:r,body:p,speed:n.speed});const u=new ds(0,0,n.orbit,n.orbit*.52,0,Math.PI*2,!1,0).getPoints(128).map(x=>new v(x.x,0,x.y)),f=new mt().setFromPoints(u),y=new ps({color:e.accentColor,transparent:!0,opacity:.075,depthWrite:!1}),T=new us(f,y);if(T.rotation.x=Math.PI/2,r.add(T),a===0){const x=new z(new hs(n.radius*1.45,30,12,96),new G({color:e.accentColor,transparent:!0,opacity:.16,depthWrite:!1}));x.rotation.x=Math.PI/2.3,p.add(x)}});const o=new Rt(e.accentColor,1.5,14e3);this.group.add(o)}group=new Y;clickTargets=[];orbiters=[];loader=new je;getHit(t){const e=t.intersectObjects(this.clickTargets,!1);if(!e.length)return null;const s=e[0].object,o=new v;return s.getWorldPosition(o),{galaxyId:this.galaxyId,title:String(s.userData.title??"ARCHIVE OBJECT"),worldPos:o}}update(t){for(const e of this.orbiters)e.pivot.rotation.y+=t*e.speed*.72,e.body.rotation.y+=t*.1}}function Ws(){try{const i=localStorage.getItem("universe_my_stars_map");if(i)return JSON.parse(i)}catch{const i=localStorage.getItem("universe_my_star_id");if(i)return{G2025:i}}return{}}const _e=Ws(),V={navContext:{level:"universe"},cameraSnapshot:null,selectedObjectId:null,selectedStarId:null,activeOverlay:"none",overlayData:null,audioState:"silent",muted:!!localStorage.getItem("universe_muted"),currentGalaxyId:"G2025",placementMode:!1,myStarId:Object.values(_e)[0]??null,myStarsMap:_e,stars:[],loaded:!1},kt=new Map,pe=new Set;function Re(i,t,e){const s=kt.get(i);s&&s.forEach(o=>o(t,e)),pe.forEach(o=>o())}const S={get(i){return V[i]},set(i,t){const e=V[i];e!==t&&(V[i]=t,Re(i,t,e))},patch(i){for(const[t,e]of Object.entries(i)){const s=V[t];s!==e&&(V[t]=e,Re(t,e,s))}},subscribe(i,t){return kt.has(i)||kt.set(i,new Set),kt.get(i).add(t),()=>kt.get(i).delete(t)},on(i){return pe.add(i),()=>pe.delete(i)},getState(){return{...V}},toggleMute(){const i=!V.muted;i?localStorage.setItem("universe_muted","1"):localStorage.removeItem("universe_muted"),this.set("muted",i)},pushCameraSnapshot(i){this.set("cameraSnapshot",i)},popCameraSnapshot(){return V.cameraSnapshot},setMyStarId(i){localStorage.setItem("universe_my_star_id",i),this.set("myStarId",i)},setMyStarForGalaxy(i,t){const e={...V.myStarsMap,[i]:t};this.set("myStarsMap",e),this.set("myStarId",t)},hasStarInGalaxy(i){return!!V.myStarsMap[i]},getMyStarForGalaxy(i){return V.myStarsMap[i]??null},addStar(i){const t=[...V.stars,i];this.set("stars",t)}},Hs=1500;class Ys{ambientLayers=new Map;activeRegionTheme=null;masterMuted;masterVol=.22;_rafId=0;isDucked=!1;REGION_TRACKS={fire:"https://static.wixstatic.com/mp3/85e419_7810e2c471ce46b5a1c5a664b8307995.mp3",africa:"https://static.wixstatic.com/mp3/85e419_f92713dc5c48443ca1c191bbbb0aec04.mp3",frontier:"https://static.wixstatic.com/mp3/85e419_7be9c7aa18ad4a6db00fd1af6ee7dbcd.mp3"};constructor(){this.masterMuted=!!localStorage.getItem("universe_muted"),this._tick=this._tick.bind(this),requestAnimationFrame(this._tick)}unlock(){if(!this.masterMuted)for(const t of this.ambientLayers.values())t.el.paused&&t.targetVol>0&&t.el.play().catch(()=>{})}setRegionTheme(t){if(this.activeRegionTheme===t)return;this.activeRegionTheme=t;const e=t?this.REGION_TRACKS[t]:null;for(const[s,o]of this.ambientLayers)s!==e&&(o.targetVol=0);if(e){let s=this.ambientLayers.get(e);if(!s){const o=new Audio(e);o.loop=!0,o.volume=0,o.preload="auto",s={src:e,el:o,targetVol:0,currentVol:0},this.ambientLayers.set(e,s)}s.targetVol=this.masterMuted||this.isDucked?0:this.masterVol,!this.masterMuted&&s.el.paused&&s.el.play().catch(()=>{})}}duckAmbient(){this.isDucked=!0;for(const t of this.ambientLayers.values())t.targetVol=t.targetVol>0?this.masterVol*.08:0}restoreAmbient(){if(this.isDucked=!1,!this.masterMuted)for(const t of this.ambientLayers.values()){const e=this.activeRegionTheme&&this.REGION_TRACKS[this.activeRegionTheme]===t.src;t.targetVol=e?this.masterVol:0}}setMuted(t){this.masterMuted=t;for(const e of this.ambientLayers.values())t?(e.targetVol=0,e.el.pause()):this.activeRegionTheme&&this.REGION_TRACKS[this.activeRegionTheme]===e.src&&(e.targetVol=this.masterVol,e.el.play().catch(()=>{}))}_tick(){this._rafId=requestAnimationFrame(this._tick);const t=16/Hs;for(const e of this.ambientLayers.values()){const s=e.targetVol-e.currentVol;Math.abs(s)>.001&&(e.currentVol+=s*t*6,e.el.volume=Math.max(0,Math.min(1,e.currentVol)))}}dispose(){cancelAnimationFrame(this._rafId);for(const t of this.ambientLayers.values())t.el.pause()}}const _=new Ys;let J=null;async function qs(){if(J)return J;const e=await fetch("./data/seed_universe.json");if(!e.ok)throw new Error(`Failed to load seed data: ${e.status}`);return J=await e.json(),J}const be=new Map,Xs=new Map,Le=new Map;function Ks(i){for(const t of i.galaxies){be.set(t.id,t);for(const e of t.regions)Xs.set(e.id,{...e,galaxyId:t.id})}for(const t of i.celestialObjects)if(Le.set(t.id,t),t.children)for(const e of t.children)Le.set(e.id,{...e,galaxyId:t.galaxyId,regionId:t.regionId,position:{...t.position}})}function ue(){return J?J.galaxies:[]}function he(i){return be.get(i)?.regions??[]}function Ue(){return J?J.celestialObjects:[]}function Js(){return J?J.demoStars:[]}function Zs(){return Js().map(i=>({id:i.id,galaxyId:i.galaxyId,regionId:i.regionId,clusterId:i.clusterId,x:i.x,y:i.y,z:i.z,displayName:i.displayName,message:i.message,createdAt:"2025-01-01T00:00:00Z",isDemo:!0}))}function _t(i){return P[i]?.worldOffset??[0,0,0]}function Ve(i,t){const e=_t(i),o=he(i).findIndex(a=>a.id===t),n=de[Math.max(0,o)];return[e[0]+n[0],e[1]+n[1],e[2]+n[2]]}function Pe(i){const t=_t(i.galaxyId);return[t[0]+i.position.x,t[1]+i.position.y,t[2]+i.position.z]}function xe(i){const t=be.get(i);return t?`${t.title} Galaxy`:i}function Qs(i){return`${Math.max(1,Math.round(i*.085))} AU`}const ze="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";function to(i=21){const t=crypto.getRandomValues(new Uint8Array(i));return Array.from(t,e=>ze[e%ze.length]).join("")}const vt=500;class eo{cells=new Map;key(t,e,s){return`${Math.floor(t/vt)},${Math.floor(e/vt)},${Math.floor(s/vt)}`}insert(t){const e=this.key(t.x,t.y,t.z);this.cells.has(e)||this.cells.set(e,[]),this.cells.get(e).push(t)}checkCollision(t,e,s,o){const n=Math.floor(t/vt),a=Math.floor(e/vt),r=Math.floor(s/vt);for(let l=-1;l<=1;l++)for(let c=-1;c<=1;c++)for(let p=-1;p<=1;p++){const m=`${n+l},${a+c},${r+p}`,u=this.cells.get(m);if(u){for(const f of u)if(Math.sqrt((f.x-t)**2+(f.y-e)**2+(f.z-s)**2)<o)return!0}}return!1}rebuild(t){this.cells.clear();for(const e of t)this.insert(e)}}const Jt="universe_stars",Oe="universe_my_stars_map",$e="universe_last_place",so=1e3*30;class oo{grid=new eo;stars=[];loaded=!1;async loadStars(){if(this.loaded)return this.stars;const t=Zs();let e=[];try{const s=localStorage.getItem(Jt);s&&(e=JSON.parse(s))}catch{e=[]}return this.stars=[...t,...e],this.grid.rebuild(this.stars),this.loaded=!0,this.stars}getMyStarsMap(){try{const t=localStorage.getItem(Oe);if(t)return JSON.parse(t)}catch{const t=localStorage.getItem("universe_my_star_id");if(t)return{G2025:t}}return{}}hasStarInGalaxy(t){return!!this.getMyStarsMap()[t]}getMyStarId(t){const e=this.getMyStarsMap();return t?e[t]??null:Object.values(e)[0]??null}async placestar(t){if(this.hasStarInGalaxy(t.galaxyId))return{success:!1,error:"already-placed-in-galaxy"};const e=localStorage.getItem($e);if(e&&Date.now()-parseInt(e)<so)return{success:!1,error:"rate-limit"};if(this.grid.checkCollision(t.x,t.y,t.z,xs))return{success:!1,error:"collision"};const s=Ve(t.galaxyId,t.regionId),o=t.x-s[0],n=t.z-s[2];if(Math.sqrt(o*o+n*n)>vs||Math.abs(t.y-s[1])>ws)return{success:!1,error:"collision"};const r={id:to(),galaxyId:t.galaxyId,regionId:t.regionId,x:t.x,y:t.y,z:t.z,displayName:Zt(t.displayName),starName:t.starName?Zt(t.starName):void 0,message:t.message?Zt(t.message):void 0,signatureDataUrl:t.signatureDataUrl,createdAt:new Date().toISOString(),isDemo:!1};this.stars.push(r),this.grid.insert(r);try{const l=localStorage.getItem(Jt),c=l?JSON.parse(l):[];c.push(r),localStorage.setItem(Jt,JSON.stringify(c));const p=this.getMyStarsMap();p[t.galaxyId]=r.id,localStorage.setItem(Oe,JSON.stringify(p)),localStorage.setItem($e,String(Date.now()))}catch{}return S.setMyStarForGalaxy(t.galaxyId,r.id),{success:!0,star:r}}async getStarById(t){return await this.loadStars(),this.stars.find(e=>e.id===t)??null}}function Zt(i){return i.replace(/<[^>]*>/g,"").trim().slice(0,280)}const ht=new oo;class no{el;galaxyLabel;muteBtn;placeBtn;resetBtn;returnBtn;tourBtn;breadcrumb;tourPrevBtn;tourNextBtn;tourExitBtn;tourFinishBtn;tourInfoBtn;tourProgress;callbacks;constructor(t,e){this.callbacks=e,this.el=document.createElement("div"),this.el.id="universe-hud",this.el.setAttribute("role","navigation"),this.el.setAttribute("aria-label","Universe navigation"),this.el.style.cssText=`
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
          style="${Q("rgba(255,255,255,0.05)","#4080c0")}"
          aria-label="Reset Camera to Universe Composition"
          title="Reset View to Default Universe Composition"
        >⌂ RESET VIEW</button>
        <button
          id="hud-return"
          type="button"
          style="${Q("rgba(255,255,255,0.05)","#4080c0")} display:none;"
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
          style="${Q("rgba(40,100,160,0.4)","#70c0ff")}"
          aria-label="Take me somewhere guided tour"
          title="Cinematic flight to a featured universe destination"
        >✦ TAKE ME SOMEWHERE</button>
        <span id="hud-tour-progress" style="display:none;font-family:'Space Mono',monospace;font-size:.62rem;letter-spacing:.08em;color:#79b9df;max-width:190px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"></span>
        <button
          id="hud-tour-prev"
          type="button"
          style="${Q("rgba(20,60,100,0.4)","#5090c0")} display:none;"
          aria-label="Previous tour stop"
        >← PREV</button>
        <button
          id="hud-tour-next"
          type="button"
          style="${Q("rgba(20,60,100,0.4)","#5090c0")} display:none;"
          aria-label="Next tour stop"
        >NEXT →</button>
        <button id="hud-tour-info" type="button" style="${Q("rgba(35,70,100,0.4)","#78b9df")} display:none;" aria-label="Tour stop information">ⓘ INFO</button>
        <button
          id="hud-tour-exit"
          type="button"
          style="${Q("rgba(80,30,30,0.4)","#ff8080")} display:none;"
          aria-label="Exit tour"
        >✖ EXIT</button>
        <button
          id="hud-tour-finish"
          type="button"
          style="${Q("rgba(30,80,30,0.4)","#80ff80")} display:none;"
          aria-label="Finish tour"
        >✔ FINISH</button>

        <button
          id="hud-place"
          type="button"
          style="${Q("rgba(20,60,100,0.6)","#5090c0")}"
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
    `,t.appendChild(this.el),this.galaxyLabel=this.el.querySelector("#hud-galaxy-name"),this.breadcrumb=this.el.querySelector("#hud-breadcrumb"),this.muteBtn=this.el.querySelector("#hud-mute"),this.placeBtn=this.el.querySelector("#hud-place"),this.resetBtn=this.el.querySelector("#hud-reset"),this.returnBtn=this.el.querySelector("#hud-return"),this.tourBtn=this.el.querySelector("#hud-tour"),this.tourPrevBtn=this.el.querySelector("#hud-tour-prev"),this.tourNextBtn=this.el.querySelector("#hud-tour-next"),this.tourExitBtn=this.el.querySelector("#hud-tour-exit"),this.tourFinishBtn=this.el.querySelector("#hud-tour-finish"),this.tourInfoBtn=this.el.querySelector("#hud-tour-info"),this.tourProgress=this.el.querySelector("#hud-tour-progress"),this._bindEvents(),this._syncMute(),S.subscribe("currentGalaxyId",s=>{this.galaxyLabel.textContent=s?xe(s):"",this._syncStarButton()}),S.subscribe("navContext",s=>{this.breadcrumb.textContent=s.level.toUpperCase()}),S.subscribe("muted",()=>this._syncMute()),S.subscribe("myStarsMap",()=>this._syncStarButton()),this._syncStarButton()}_syncStarButton(){const t=S.get("currentGalaxyId")??"G2025",e=ht.getMyStarId(t);e?(this.placeBtn.textContent="✦ VIEW YOUR STAR",this.placeBtn.style.color="#ffd700",this.placeBtn.style.background="rgba(100,80,10,0.6)",this.placeBtn.dataset.action="view",this.placeBtn.dataset.starId=e):(this.placeBtn.textContent="✦ PLACE STAR",this.placeBtn.style.color="#5090c0",this.placeBtn.style.background="rgba(20,60,100,0.6)",this.placeBtn.dataset.action="place",delete this.placeBtn.dataset.starId)}_bindEvents(){this.resetBtn.addEventListener("click",()=>{_.unlock(),this.callbacks.onResetView()}),this.returnBtn.addEventListener("click",()=>{_.unlock(),this.callbacks.onReturnPrevious()}),this.tourBtn.addEventListener("click",()=>{_.unlock(),this.callbacks.onTakeTour()}),this.tourPrevBtn.addEventListener("click",()=>{_.unlock(),this.callbacks.onPrevTour()}),this.tourNextBtn.addEventListener("click",()=>{_.unlock(),this.callbacks.onNextTour()}),this.tourInfoBtn.addEventListener("click",()=>{_.unlock(),this.callbacks.onTourInfo()}),this.tourExitBtn.addEventListener("click",()=>{_.unlock(),this.callbacks.onExitTour()}),this.tourFinishBtn.addEventListener("click",()=>{_.unlock(),this.callbacks.onFinishTour()}),this.muteBtn.addEventListener("click",()=>{_.unlock(),S.toggleMute(),_.setMuted(S.get("muted"))}),this.placeBtn.addEventListener("click",()=>{_.unlock();const t=this.placeBtn.dataset.action,e=this.placeBtn.dataset.starId;t==="view"&&e?this.callbacks.onViewMyStar(e):(S.set("placementMode",!0),window.dispatchEvent(new CustomEvent("universe-start-placement")))}),document.getElementById("universe-canvas")?.addEventListener("click",()=>{_.unlock()},{once:!0})}setReturnAvailable(t){this.returnBtn.style.display=t?"inline-block":"none",this.tourPrevBtn.style.display="none",this.tourNextBtn.style.display="none",this.tourExitBtn.style.display="none",this.tourInfoBtn.style.display="none",this.tourFinishBtn.style.display="none"}setTourActive(t){const e=t?"inline-block":"none";this.tourPrevBtn.style.display=e,this.tourNextBtn.style.display=e,this.tourExitBtn.style.display=e,this.tourInfoBtn.style.display=e,this.tourFinishBtn.style.display=e,this.tourProgress.style.display=t?"inline-block":"none",this.tourBtn.style.display=t?"none":"inline-block"}setTourProgress(t,e,s){if(!e){this.tourProgress.textContent="";return}this.tourProgress.textContent=`${t}/${e} · ${s}`,this.tourPrevBtn.disabled=t<=1,this.tourNextBtn.disabled=t>=e,this.tourFinishBtn.style.display=t>=e?"inline-block":"none"}_syncMute(){const t=S.get("muted");this.muteBtn.textContent=t?"♪̶":"♪",this.muteBtn.setAttribute("aria-label",t?"Unmute":"Mute"),this.muteBtn.style.color=t?"#2a3848":"#4a85b0"}setPlacementMode(t){t?(this.placeBtn.textContent="✦ PLACING…",this.placeBtn.style.color="#60c080"):this._syncStarButton()}dispose(){this.el.remove()}}function Q(i,t){return`
    font-family:'Space Grotesk',sans-serif;
    font-size:0.65rem;letter-spacing:0.12em;text-transform:uppercase;
    background:${i};
    border:1px solid rgba(80,160,240,0.25);
    border-radius:4px;
    color:${t};
    padding:6px 12px;
    cursor:pointer;
    transition:background 0.2s, color 0.2s;
    white-space:nowrap;
  `}class io{el;openBtn;panel;activeTab="map";isOpen=!1;callbacks;constructor(t,e){this.callbacks=e,this.el=document.createElement("div"),this.el.id="galactic-navigator-wrap",this.el.style.cssText=`
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
    `,this.el.appendChild(this.panel),this.el.appendChild(this.openBtn),t.appendChild(this.el),this._injectStyles(),this._bindEvents(),this.render(),S.on(()=>{this.isOpen&&this._updateTelemetry()})}_injectStyles(){if(document.getElementById("nav-styles"))return;const t=document.createElement("style");t.id="nav-styles",t.textContent=`
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
    `,document.head.appendChild(t)}_bindEvents(){this.openBtn.addEventListener("click",()=>{this.isOpen=!this.isOpen,this.panel.style.display=this.isOpen?"flex":"none",this.isOpen&&this.render()})}render(){const t=S.get("currentGalaxyId")??"G2025",e=ue().find(s=>s.id===t);e&&he(t),this.panel.innerHTML=`
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
          <div>GALAXY: <strong style="color:#c0d8f0;">${e?.title??"2025–2029"}</strong></div>
          <div>AU: <strong id="telemetry-au" style="color:#c0d8f0;">427 AU</strong></div>
        </div>
      </div>

      <div style="padding:12px 16px;overflow-y:auto;flex:1;">
        ${this.activeTab==="map"?this._renderMapHTML():this._renderLegendHTML()}
      </div>
    `,this.panel.querySelectorAll(".nav-tab-btn").forEach(s=>{s.addEventListener("click",o=>{const n=o.currentTarget.dataset.tab;this.activeTab=n,this.render()})}),this.panel.querySelectorAll(".nav-tree-item").forEach(s=>{s.addEventListener("click",o=>{const n=o.currentTarget,a=n.dataset.type,r=n.dataset.id,l=n.dataset.parentId;a==="galaxy"&&r?this.callbacks.onTravelToGalaxy(r):a==="region"&&r&&l?this.callbacks.onTravelToRegion(l,r):a==="object"&&r&&this.callbacks.onTravelToObject(r)})}),this._updateTelemetry()}_renderMapHTML(){const t=ue(),e=S.get("currentGalaxyId")??"G2025",s=Ue();return`
      <div style="font-family:'Space Mono',monospace;font-size:0.65rem;color:#4a6888;letter-spacing:0.1em;margin-bottom:8px;">
        KNOWN GALAXIES (CLICK TO TRAVEL)
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;">
        ${t.map(o=>{const n=o.id===e,a=o.id==="G2025",r=o.status==="uncharted",l=he(o.id);return`
            <div class="nav-tree-item ${n?"active":""}" data-type="galaxy" data-id="${o.id}">
              <span>${a?"✦ ":""}${o.title}</span>
              <span style="font-size:0.6rem;opacity:0.6;">${a?"SHOWCASE":r?"UNCHARTED":"KNOWN"}</span>
            </div>
            ${n?`
              <div style="margin-left:12px;padding-left:8px;border-left:1px solid rgba(80,160,240,0.2);display:flex;flex-direction:column;gap:2px;margin-bottom:6px;">
                ${l.map(c=>`
                  <div class="nav-tree-item" data-type="region" data-id="${c.id}" data-parent-id="${o.id}">
                    <span>↳ ${c.title}</span>
                  </div>
                `).join("")}
                ${s.filter(c=>c.galaxyId===o.id).map(c=>`
                  <div class="nav-tree-item" data-type="object" data-id="${c.id}">
                    <span style="color:#50a0d0;">● ${c.title}</span>
                    <span style="font-size:0.6rem;opacity:0.6;">${c.kind.toUpperCase()}</span>
                  </div>
                `).join("")}
              </div>
            `:""}
          `}).join("")}
      </div>
    `}_renderLegendHTML(){return`
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${[{icon:"✦",label:"STAR",desc:"Visitor in the Universe"},{icon:"☀",label:"SUN",desc:"Era-defining work / event"},{icon:"●",label:"PLANET",desc:"Major work / history"},{icon:"◐",label:"MOON",desc:"Related artifact"},{icon:"◇",label:"SATELLITE",desc:"Interactive / external media"},{icon:"☄",label:"COMET",desc:"Theme / person crossing eras"},{icon:"✧",label:"NEBULA",desc:"Creative period"},{icon:"✺",label:"SUPERNOVA",desc:"Transformative event"},{icon:"·",label:"ASTEROID",desc:"Small archival artifact"}].map(e=>`
          <div style="display:flex;align-items:center;gap:12px;padding:6px;border-bottom:1px solid rgba(255,255,255,0.04);">
            <span style="font-size:1.1rem;color:#8ab4d4;width:24px;text-align:center;">${e.icon}</span>
            <div>
              <div style="font-family:'Space Mono',monospace;font-size:0.65rem;color:#c0d8f0;letter-spacing:0.1em;">${e.label}</div>
              <div style="font-size:0.7rem;color:#5a7898;">${e.desc}</div>
            </div>
          </div>
        `).join("")}
      </div>
    `}_updateTelemetry(){const t=this.panel.querySelector("#telemetry-au");if(t){const e=S.get("cameraSnapshot"),s=e?Math.hypot(...e.position):48e3;t.textContent=Qs(s)}}dispose(){this.el.remove()}}const Ne="2fly-universe-custom-tour-v1";class ao{constructor(t,e,s){this.callbacks=s,this.available=e,this.stops=this.load(),this.root=document.createElement("div"),this.root.style.cssText="position:absolute;inset:0;z-index:70;display:none;pointer-events:auto;background:rgba(0,4,12,.52);backdrop-filter:blur(8px);align-items:center;justify-content:center;padding:18px;",this.panel=document.createElement("section"),this.panel.style.cssText="width:min(920px,96vw);max-height:86vh;overflow:hidden;display:flex;flex-direction:column;background:linear-gradient(145deg,rgba(2,10,24,.98),rgba(8,22,40,.96));border:1px solid rgba(96,190,255,.35);border-radius:18px;box-shadow:0 24px 80px rgba(0,0,0,.65);color:#d8ecff;font-family:Space Grotesk,sans-serif;",this.root.appendChild(this.panel),t.appendChild(this.root),this.root.addEventListener("click",o=>{o.target===this.root&&this.close()}),this.render()}root;panel;stops=[];available;open(){this.render(),this.root.style.display="flex"}close(){this.root.style.display="none"}getStops(){return[...this.stops]}load(){try{return JSON.parse(localStorage.getItem(Ne)||"[]")}catch{return[]}}save(){localStorage.setItem(Ne,JSON.stringify(this.stops))}add(t){this.stops.some(e=>e.id===t.id)||(this.stops.push(t),this.save(),this.render())}remove(t){this.stops.splice(t,1),this.save(),this.render()}move(t,e){const s=t+e;s<0||s>=this.stops.length||([this.stops[t],this.stops[s]]=[this.stops[s],this.stops[t]],this.save(),this.render())}render(){const t=new Set(this.stops.map(e=>e.id));if(this.panel.innerHTML=`
      <header style="padding:20px 22px 14px;border-bottom:1px solid rgba(255,255,255,.08);display:flex;gap:18px;justify-content:space-between;align-items:flex-start;">
        <div><div style="font:600 .68rem 'Space Mono',monospace;letter-spacing:.2em;color:#65c8ff;text-transform:uppercase;">Build your own tour</div><h2 style="margin:5px 0 4px;font-size:clamp(1.35rem,3vw,2.1rem);font-weight:500;">Plot your route through the 2Fly Universe</h2><div style="color:#7697b2;font-size:.86rem;">Choose destinations, arrange the journey, then launch.</div></div>
        <button id="tour-close" style="background:none;border:0;color:#7ea3bf;font-size:1.4rem;cursor:pointer" aria-label="Close tour builder">×</button>
      </header>
      <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,.82fr);min-height:0;overflow:auto;" class="tour-grid">
        <div style="padding:18px 20px;border-right:1px solid rgba(255,255,255,.07);overflow:auto;">
          <div style="font:.62rem 'Space Mono',monospace;letter-spacing:.15em;color:#557b98;margin-bottom:10px;">AVAILABLE DESTINATIONS</div>
          ${this.available.map(e=>`<button data-add="${e.id}" ${t.has(e.id)?"disabled":""} style="width:100%;text-align:left;margin:0 0 8px;padding:11px 12px;border-radius:9px;border:1px solid rgba(80,160,240,.18);background:${t.has(e.id)?"rgba(60,90,110,.12)":"rgba(30,90,140,.16)"};color:${t.has(e.id)?"#526879":"#c9e7ff"};cursor:${t.has(e.id)?"default":"pointer"}"><strong>${e.name}</strong>${e.subtitle?`<span style="display:block;font-size:.75rem;color:#6889a2;margin-top:3px">${e.subtitle}</span>`:""}${t.has(e.id)?'<span style="float:right;color:#66cda8">ADDED</span>':""}</button>`).join("")}
        </div>
        <div style="padding:18px 20px;overflow:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;"><span style="font:.62rem 'Space Mono',monospace;letter-spacing:.15em;color:#557b98;">YOUR JOURNEY</span><span style="color:#68a7cf;font-size:.76rem;">${this.stops.length} STOP${this.stops.length===1?"":"S"}</span></div>
          ${this.stops.length?this.stops.map((e,s)=>`<div style="display:grid;grid-template-columns:26px 1fr auto;gap:8px;align-items:center;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.06);"><span style="font-family:Space Mono;color:#4a83a8">${s+1}</span><div><strong>${e.name}</strong>${e.subtitle?`<div style="font-size:.72rem;color:#67849a">${e.subtitle}</div>`:""}</div><div style="display:flex;gap:4px"><button data-up="${s}" title="Move up">↑</button><button data-down="${s}" title="Move down">↓</button><button data-remove="${s}" title="Remove">×</button></div></div>`).join(""):'<div style="padding:28px 8px;color:#67849a;text-align:center;border:1px dashed rgba(100,170,220,.2);border-radius:12px;">Your route is empty.<br>Add destinations from the left.</div>'}
        </div>
      </div>
      <footer style="padding:14px 20px 18px;border-top:1px solid rgba(255,255,255,.08);display:flex;justify-content:flex-end;gap:10px;"><button id="tour-launch" ${this.stops.length?"":"disabled"} style="padding:10px 18px;border-radius:8px;border:1px solid rgba(80,200,255,.45);background:rgba(20,110,170,.35);color:${this.stops.length?"#aee8ff":"#486272"};font:600 .7rem 'Space Mono',monospace;letter-spacing:.12em;cursor:${this.stops.length?"pointer":"default"};">✦ START TOUR</button></footer>`,this.panel.querySelector("#tour-close")?.addEventListener("click",()=>this.close()),this.panel.querySelector("#tour-launch")?.addEventListener("click",()=>{this.stops.length&&(this.close(),this.callbacks.onPlay([...this.stops]))}),this.panel.querySelectorAll("[data-add]").forEach(e=>e.addEventListener("click",()=>{const s=this.available.find(o=>o.id===e.dataset.add);s&&this.add(s)})),this.panel.querySelectorAll("[data-remove]").forEach(e=>e.addEventListener("click",()=>this.remove(Number(e.dataset.remove)))),this.panel.querySelectorAll("[data-up]").forEach(e=>e.addEventListener("click",()=>this.move(Number(e.dataset.up),-1))),this.panel.querySelectorAll("[data-down]").forEach(e=>e.addEventListener("click",()=>this.move(Number(e.dataset.down),1))),!document.getElementById("tour-builder-responsive")){const e=document.createElement("style");e.id="tour-builder-responsive",e.textContent="@media(max-width:700px){.tour-grid{grid-template-columns:1fr!important}.tour-grid>div:first-child{border-right:0!important;border-bottom:1px solid rgba(255,255,255,.07)}} #universe-hud button{touch-action:manipulation}",document.head.appendChild(e)}}}const We=[];let me={type:"universe"};function Qt(i){const t=i.replace(/^#\/?/,"");if(!t||t==="universe")return{type:"universe"};const[e,s]=t.split("/");return e==="galaxy"&&s?{type:"galaxy",galaxyId:s}:e==="object"&&s?{type:"object",objectId:s}:e==="star"&&s?{type:"star",starId:s}:{type:"universe"}}function te(i){me=i,We.forEach(t=>t(i))}const ee={init(){window.addEventListener("hashchange",()=>{te(Qt(window.location.hash))}),te(Qt(window.location.hash))},on(i){We.push(i),i(me)},navigate(i,t=!0){let e="";i.type==="universe"?e="#universe":i.type==="galaxy"?e=`#galaxy/${i.galaxyId}`:i.type==="object"?e=`#object/${i.objectId}`:i.type==="star"&&(e=`#star/${i.starId}`),t?(history.pushState(null,"",e),te(Qt(e))):history.replaceState(null,"",e)},back(){history.back()},current(){return me}};function bt(i,t){const e=document.createElement("div");return e.id=i,e.className=`overlay-panel ${t}`,e.setAttribute("role","dialog"),e.setAttribute("aria-modal","true"),e.style.cssText=`
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
  `,e}function xt(){if(document.getElementById("overlay-styles"))return;const i=document.createElement("style");i.id="overlay-styles",i.textContent=`
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
  `,document.head.appendChild(i)}function Mt(i){const t=i.querySelectorAll('button,a,[tabindex]:not([tabindex="-1"]),input,textarea,select'),e=t[0],s=t[t.length-1];function o(n){n.key==="Tab"&&(n.shiftKey?document.activeElement===e&&(n.preventDefault(),s?.focus()):document.activeElement===s&&(n.preventDefault(),e?.focus()))}return i.addEventListener("keydown",o),e?.focus(),()=>i.removeEventListener("keydown",o)}function Et(i,t){function e(s){s.key==="Escape"&&t()}return window.addEventListener("keydown",e),()=>window.removeEventListener("keydown",e)}function Pt(i,t){const e=document.createElement("button");return e.className="overlay-close-btn",e.type="button",e.setAttribute("aria-label","Close"),e.innerHTML="×",e.addEventListener("click",t),i.appendChild(e),e}function ro(i,t,e){xt(),_.duckAmbient();const s=bt("audio-overlay","audio-overlay");s.setAttribute("aria-label",`Audio: ${t.title}`);const o=!t.mediaUrl||t.contentStatus==="awaiting-source";s.innerHTML=`
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
        ${t.title}
      </h2>
      ${o?`
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
          src="${t.mediaUrl}"
        ></audio>
      `}
    </div>
  `,ho();const n=()=>{s.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{s.remove(),_.restoreAmbient(),e()},200)};Pt(s.firstElementChild,n);const a=Et(s,n),r=Mt(s);if(s.addEventListener("mousedown",l=>{l.target===s&&n()}),i.appendChild(s),i.setAttribute("aria-hidden","false"),!o){const l=s.querySelector("#spatial-audio");l?.play().catch(()=>{}),l?.addEventListener("play",()=>_.duckAmbient()),l?.addEventListener("pause",()=>_.restoreAmbient())}return()=>{a(),r(),n()}}function lo(i,t,e){xt(),_.duckAmbient();const s=bt("video-overlay","video-overlay");s.setAttribute("aria-label",`Video: ${t.title}`),s.style.background="rgba(0,0,0,0.92)";const o=!t.mediaUrl||t.contentStatus==="awaiting-source";s.innerHTML=`
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
        ${t.title}
      </h2>
      <div style="
        aspect-ratio:16/9;
        background:#020810;
        border:1px solid rgba(255,100,60,0.15);
        border-radius:8px;
        display:flex;align-items:center;justify-content:center;
        overflow:hidden;
      ">
        ${o?`
          <div style="text-align:center;color:#3a5060;padding:32px;">
            <div style="font-size:2.5rem;margin-bottom:16px;" aria-hidden="true">▶</div>
            <p style="font-family:'Space Mono',monospace;font-size:0.7rem;letter-spacing:0.1em;">
              VIDEO SOURCE PENDING<br/>contentStatus: "awaiting-source"
            </p>
          </div>
        `:t.mediaUrl?.includes("youtube")||t.mediaUrl?.includes("youtu.be")?`
          <iframe
            src="${uo(t.mediaUrl)}"
            style="width:100%;height:100%;border:none;"
            allow="autoplay;encrypted-media"
            allowfullscreen
            title="${t.title}"
          ></iframe>
        `:`
          <video
            controls autoplay
            style="width:100%;height:100%;"
            src="${t.mediaUrl}"
            ${t.posterUrl?`poster="${t.posterUrl}"`:""}
          ></video>
        `}
      </div>
    </div>
  `;const n=()=>{s.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{s.remove(),_.restoreAmbient(),e()},200)};Pt(s,n);const a=Et(s,n),r=Mt(s);return s.addEventListener("mousedown",l=>{l.target===s&&n()}),i.appendChild(s),()=>{a(),r(),n()}}function co(i,t,e){xt(),_.duckAmbient();const s=bt("playable-overlay","playable-overlay");s.setAttribute("aria-label",`Playable Experience: ${t.title}`),s.style.background="rgba(0,0,0,0.98)",s.style.padding="0";const o=t.mediaUrl??"/games/streams/";s.innerHTML=`
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
          2FLY UNIVERSE — ${t.title}
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
        src="${o}"
        style="
          position:absolute;inset:40px 0 0 0;
          width:100%;
          height:calc(100% - 40px);
          border:none;
          background:#000;
        "
        title="${t.title}"
        allow="autoplay"
        sandbox="allow-scripts allow-same-origin allow-forms"
      ></iframe>
    </div>
  `;const n=()=>{s.style.animation="overlay-out 0.15s ease forwards",setTimeout(()=>{s.remove(),_.restoreAmbient(),e()},150)};s.querySelector("#exit-playable")?.addEventListener("click",n);const a=Et(s,n);i.appendChild(s);const r=l=>{(l.data==="UNIVERSE_EXIT"||l.data?.type==="UNIVERSE_EXIT")&&n()};return window.addEventListener("message",r),()=>{a(),window.removeEventListener("message",r),n()}}function po(i,t,e){xt();const s=bt("archive-overlay","archive-overlay");s.setAttribute("aria-label",`Archive: ${t.title}`),s.innerHTML=`
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
        ${t.title}
      </h2>
      ${t.contentStatus==="awaiting-source"?`
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
      `:`<p style="color:#8090a8;font-size:0.9rem;line-height:1.7;">${t.description??"Archive record."}</p>`}
    </div>
  `;const o=()=>{s.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{s.remove(),e()},200)};Pt(s.firstElementChild,o);const n=Et(s,o),a=Mt(s);return s.addEventListener("mousedown",r=>{r.target===s&&o()}),i.appendChild(s),()=>{n(),a(),o()}}function uo(i){const t=i.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);return t?`https://www.youtube.com/embed/${t[1]}?autoplay=1`:i}function ho(){if(document.getElementById("orbit-anim"))return;const i=document.createElement("style");i.id="orbit-anim",i.textContent=`
    @keyframes orbit-pulse {
      0%,100% { box-shadow:0 0 20px rgba(32,200,200,0.1); }
      50% { box-shadow:0 0 40px rgba(32,200,200,0.25); }
    }
    @keyframes orbit-spin {
      to { transform:rotate(360deg); }
    }
  `,document.head.appendChild(i)}function mo(i,t,e){xt();const s=bt("star-card-overlay","star-card-overlay");s.setAttribute("aria-label",`Star Card: ${t.displayName}`),s.style.background="rgba(0,2,10,0.92)";const o=document.createElement("canvas");o.width=1080,o.height=1350,o.style.display="none",document.body.appendChild(o),ne(o,t,1080,1350);const n=document.createElement("canvas");n.width=1080,n.height=1920,n.style.display="none",document.body.appendChild(n),ne(n,t,1080,1920);const a=document.createElement("canvas");a.width=360,a.height=450,a.style.cssText="border-radius:8px;max-width:100%;",ne(a,t,360,450);const r=`${location.origin}${location.pathname}#star/${t.id}`;s.innerHTML=`
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
        ${t.displayName}
      </h2>
      ${t.starName?`<p style="color:#9080a0;font-size:0.8rem;margin-bottom:4px;">"${t.starName}"</p>`:""}
      <p style="color:#3a5070;font-size:0.7rem;font-family:'Space Mono',monospace;margin-bottom:20px;">
        ID: ${t.id.slice(0,16)}…
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
        <button id="dl-card" type="button" style="${oe()}">DOWNLOAD CARD (1080×1350)</button>
        <button id="dl-story" type="button" style="${oe()}">DOWNLOAD STORY (1080×1920)</button>
        <button id="copy-link" type="button" style="${oe("rgba(20,60,20,0.6)")}">COPY SHARE LINK</button>
      </div>
      <p id="copy-confirm" style="color:#60c070;font-size:0.75rem;min-height:18px;"></p>
    </div>
  `;const l=s.querySelector("#star-card-preview-wrap");l&&l.appendChild(a),s.querySelector("#dl-card")?.addEventListener("click",()=>{De(o,`2fly-star-${t.id.slice(0,8)}-card.png`)}),s.querySelector("#dl-story")?.addEventListener("click",()=>{De(n,`2fly-star-${t.id.slice(0,8)}-story.png`)}),s.querySelector("#copy-link")?.addEventListener("click",async()=>{try{await navigator.clipboard.writeText(r);const u=s.querySelector("#copy-confirm");u&&(u.textContent="Link copied!",setTimeout(()=>{u.textContent=""},2e3))}catch{const u=s.querySelector("#copy-confirm");u&&(u.textContent=r)}});const c=()=>{s.remove(),o.remove(),n.remove(),a.remove(),e()};Pt(s.firstElementChild,c);const p=Et(s,c),m=Mt(s);return s.addEventListener("mousedown",u=>{u.target===s&&c()}),i.appendChild(s),()=>{p(),m(),c()}}function se(i,t,e){xt();const s=bt("star-view-overlay","star-view-overlay");s.setAttribute("aria-label",`Star: ${t.displayName}`);const o=P[t.galaxyId],n=o?"#"+o.primaryColor.toString(16).padStart(6,"0"):"#4080c0",a=xe(t.galaxyId);s.innerHTML=`
    <div style="
      position:relative;
      background:radial-gradient(ellipse at 50% 30%, rgba(${Ct(o?.primaryColor??2121888)},0.12) 0%, rgba(0,4,12,0.95) 70%);
      border:1px solid rgba(${Ct(o?.primaryColor??2121888)},0.2);
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
        ${t.displayName}
      </h2>
      ${t.starName?`<p style="color:#7080a0;font-size:0.85rem;margin-bottom:12px;">"${t.starName}"</p>`:""}
      ${t.message?`
        <blockquote style="
          color:#8090a8;font-size:0.85rem;font-style:italic;
          margin:0 0 20px;padding:12px 16px;
          border-left:2px solid rgba(${Ct(o?.primaryColor??2121888)},0.3);
          text-align:left;border-radius:0 8px 8px 0;
          background:rgba(255,255,255,0.02);
        ">
          "${t.message}"
        </blockquote>
      `:""}
      <div style="
        display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:20px 0;
        text-align:left;
      ">
        ${Vt("GALAXY",a)}
        ${Vt("ARRIVED",He(t.createdAt))}
        ${Vt("STAR ID",t.id.slice(0,14)+"…")}
        ${Vt("COORDINATES",`${t.x.toFixed(0)}, ${t.y.toFixed(0)}, ${t.z.toFixed(0)}`)}
      </div>
      <button id="star-place-cta" type="button" style="
        margin-top:8px;
        padding:12px 28px;
        background:rgba(${Ct(o?.primaryColor??2121888)},0.15);
        border:1px solid rgba(${Ct(o?.primaryColor??2121888)},0.35);
        border-radius:6px;
        color:#c0d0f0;
        font-family:'Space Grotesk',sans-serif;
        font-size:0.8rem;letter-spacing:0.12em;text-transform:uppercase;
        cursor:pointer;
        transition:background 0.2s;
      ">PLACE YOUR STAR →</button>
    </div>
  `;const r=()=>{s.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{s.remove(),e()},200)};s.querySelector("#star-place-cta")?.addEventListener("click",()=>{r(),S.set("placementMode",!0),window.dispatchEvent(new CustomEvent("universe-start-placement"))}),Pt(s.firstElementChild,r);const l=Et(s,r),c=Mt(s);return s.addEventListener("mousedown",p=>{p.target===s&&r()}),i.appendChild(s),()=>{l(),c(),r()}}async function go(i,t,e){const s=window.matchMedia("(prefers-reduced-motion: reduce)").matches,o=document.createElement("div");o.style.cssText=`
    position:fixed;inset:0;
    background:rgba(0,2,8,0.92);
    display:flex;flex-direction:column;
    align-items:center;justify-content:center;
    z-index:200;
    font-family:'Space Mono',monospace;
    text-align:center;gap:16px;
    transition:opacity 0.5s;
  `,o.innerHTML=`
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
      Flying to ${t.displayName}'s star in the<br/>2Fly Universe…
    </p>
  `,i.appendChild(o);const n=s?400:2500;await new Promise(a=>setTimeout(a,n)),o.style.opacity="0",await new Promise(a=>setTimeout(a,500)),o.remove(),e()}function oe(i="rgba(20,40,80,0.6)"){return["display:inline-block;","padding:10px 16px;",`background:${i};`,"border:1px solid rgba(80,140,220,0.25);","border-radius:6px;","color:#a0b8d8;","font-family:'Space Grotesk',sans-serif;","font-size:0.72rem;","letter-spacing:0.1em;","text-transform:uppercase;","cursor:pointer;","transition:background 0.2s;"].join("")}function ne(i,t,e,s){const o=i.getContext("2d");if(!o)return;i.width=e,i.height=s;const n=P[t.galaxyId],a=o.createRadialGradient(e*.5,s*.3,0,e*.5,s*.3,s*.7),r=n?"#"+n.primaryColor.toString(16).padStart(6,"0"):"#204080";a.addColorStop(0,`${r}22`),a.addColorStop(.6,"#020810"),a.addColorStop(1,"#010408"),o.fillStyle=a,o.fillRect(0,0,e,s),o.globalAlpha=.5;for(let f=0;f<300;f++){const y=Math.random()*e,T=Math.random()*s,x=Math.random()*1.2+.3;o.fillStyle="#ffffff",o.beginPath(),o.arc(y,T,x,0,Math.PI*2),o.fill()}o.globalAlpha=1;const l=e/1080,c=80*l;o.font=`${c}px serif`,o.textAlign="center",o.fillStyle="#ffd700",o.shadowColor="#ffd700",o.shadowBlur=40*l,o.fillText("✦",e*.5,s*.25),o.shadowBlur=0,o.font=`${11*l}px 'Arial', sans-serif`,o.fillStyle=r,o.letterSpacing=`${3*l}px`,o.fillText("2FLY UNIVERSE",e*.5,s*.32),o.font=`bold ${28*l}px 'Arial', sans-serif`,o.fillStyle="#f0f4ff",o.letterSpacing="0px",o.fillText(t.displayName.toUpperCase(),e*.5,s*.4),t.starName&&(o.font=`${16*l}px 'Arial', sans-serif`,o.fillStyle="#7080a0",o.fillText(`"${t.starName}"`,e*.5,s*.45)),t.message&&(o.font=`italic ${13*l}px 'Arial', sans-serif`,o.fillStyle="#5a7090",fo(o,`"${t.message}"`,e*.5,s*.52,e*.75,18*l));const p=s*.72,m=20*l;o.font=`${10*l}px 'Courier New', monospace`,o.textAlign="center";const u=[`GALAXY: ${xe(t.galaxyId).toUpperCase()}`,`ARRIVED: ${He(t.createdAt)}`,`ID: ${t.id.slice(0,20)}`,`COORDS: ${t.x.toFixed(0)}, ${t.y.toFixed(0)}, ${t.z.toFixed(0)}`];o.fillStyle="#2a4060",u.forEach((f,y)=>o.fillText(f,e*.5,p+y*m)),o.font=`${9*l}px 'Arial', sans-serif`,o.fillStyle="#1a3050",o.fillText("2FLYKEITHLOGAN.COM/UNIVERSE",e*.5,s*.94),o.strokeStyle=`${r}33`,o.lineWidth=2*l,o.strokeRect(20*l,20*l,e-40*l,s-40*l)}function fo(i,t,e,s,o,n){const a=t.split(" ");let r="",l=s;for(const c of a){const p=r+c+" ";i.measureText(p).width>o&&r.length?(i.fillText(r,e,l),r=c+" ",l+=n):r=p}i.fillText(r,e,l)}function De(i,t){const e=document.createElement("a");e.href=i.toDataURL("image/png"),e.download=t,e.click()}function Vt(i,t){return`
    <div style="
      background:rgba(255,255,255,0.02);
      border:1px solid rgba(255,255,255,0.05);
      border-radius:6px;
      padding:10px 12px;
    ">
      <div style="font-size:0.6rem;letter-spacing:0.15em;color:#3a5070;
        text-transform:uppercase;font-family:'Space Mono',monospace;margin-bottom:4px;">${i}</div>
      <div style="font-size:0.78rem;color:#8090b0;word-break:break-all;">${t}</div>
    </div>
  `}function He(i){try{return new Date(i).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}catch{return i}}function Ct(i){const t=i>>16&255,e=i>>8&255,s=i&255;return`${t},${e},${s}`}const Ye=document.createElement("style");Ye.textContent=`
  @keyframes star-pulse {
    0%,100% { text-shadow:0 0 10px currentColor,0 0 20px currentColor; }
    50% { text-shadow:0 0 20px currentColor,0 0 40px currentColor,0 0 60px currentColor; }
  }
`;document.head.appendChild(Ye);function yo(i,t,e){xt();const s=bt("star-placement-overlay","star-placement-overlay");s.setAttribute("aria-label","Place Your Star in the 2Fly Universe"),s.style.background="rgba(0,2,8,0.88)";let o="info",n="",a="",r="",l=!1;function c(){s.innerHTML=bo(o,t,n,a,r,l),u(),Mt(s)}function p(){return n.trim().length>0||a.trim().length>0||r.trim().length>0}function m(){if(o==="info"){const x=s.querySelector("#place-display-name"),A=s.querySelector("#place-star-name"),C=s.querySelector("#place-message");x&&(n=x.value.trim()),A&&(a=A.value.trim()),C&&(r=C.value.trim())}p()?(l=!0,c()):T(!1)}function u(){if(s.querySelector("#place-back-header")?.addEventListener("click",()=>f()),s.querySelector("#place-close")?.addEventListener("click",()=>m()),l){s.querySelector("#unsaved-keep")?.addEventListener("click",()=>{l=!1,c()}),s.querySelector("#unsaved-discard")?.addEventListener("click",()=>{T(!1)});return}o==="info"&&s.querySelector("#place-next")?.addEventListener("click",()=>{const A=(s.querySelector("#place-display-name")?.value??"").trim(),C=(s.querySelector("#place-star-name")?.value??"").trim(),D=(s.querySelector("#place-message")?.value??"").trim();if(!A){const B=s.querySelector("#place-error");B&&(B.textContent="Display name is required.");return}n=A,a=C,r=D,o="confirm",c()}),o==="confirm"&&(s.querySelector("#place-back")?.addEventListener("click",()=>f()),s.querySelector("#place-confirm")?.addEventListener("click",async()=>{const x=s.querySelector("#place-confirm");x&&(x.disabled=!0,x.textContent="PLACING…");const A={galaxyId:t.galaxyId,regionId:t.regionId,x:t.x,y:t.y,z:t.z,displayName:n,starName:a||void 0,message:r||void 0},C=await ht.placestar(A);if(C.success&&C.star)S.setMyStarForGalaxy(C.star.galaxyId,C.star.id),S.addStar(C.star),o="ignition",c(),setTimeout(()=>{C.star&&mo(i,C.star,()=>T(!0))},2200);else{const D={collision:"That location is too close to another star. Please choose a different spot.","already-placed-in-galaxy":"You have already placed a star in this era galaxy.","already-placed":"You have already placed a star in this era galaxy.","rate-limit":"Please wait a moment before placing again.","server-error":"An error occurred. Please try again."};o="info",c();const B=s.querySelector("#place-error");B&&(B.textContent=D[C.error??"server-error"]??"An error occurred.")}}))}function f(){if(l){l=!1,c();return}o==="confirm"?(o="info",c()):o==="info"&&m()}const y=x=>{x.key==="Escape"&&(x.stopPropagation(),f())};window.addEventListener("keydown",y);function T(x){window.removeEventListener("keydown",y),s.style.animation="overlay-out 0.2s ease forwards",setTimeout(()=>{s.remove(),e(x)},200)}return c(),i.appendChild(s),()=>{window.removeEventListener("keydown",y),T(!1)}}function bo(i,t,e,s,o,n){const a=`${t.x.toFixed(0)}, ${t.y.toFixed(0)}, ${t.z.toFixed(0)}`;if(n)return`
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
          <button id="unsaved-keep" type="button" style="${It("#182838","#203850")}">
            KEEP EDITING
          </button>
          <button id="unsaved-discard" type="button" style="${It("#801828","#a02038")} color:#ffd0d8;">
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
  `;return i==="info"?`
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
          value="${e}"
          style="${ie()}"
          autocomplete="name" required />
      </label>
      <label style="display:block;margin-bottom:16px;">
        <span style="font-size:0.7rem;letter-spacing:0.12em;color:#6090b8;text-transform:uppercase;
          display:block;margin-bottom:6px;">Star Name (optional)</span>
        <input id="place-star-name" type="text" maxlength="60"
          placeholder="Name your star"
          value="${s}"
          style="${ie()}" />
      </label>
      <label style="display:block;margin-bottom:24px;">
        <span style="font-size:0.7rem;letter-spacing:0.12em;color:#6090b8;text-transform:uppercase;
          display:block;margin-bottom:6px;">Message (optional)</span>
        <textarea id="place-message" maxlength="280" rows="3"
          placeholder="Leave a message for the Universe…"
          style="${ie()} resize:vertical;height:80px;"
        >${o}</textarea>
      </label>
      <button id="place-next" type="button" style="${It("#1a60c0","#2080e0")} width:100%;">
        PREVIEW MY STAR →
      </button>
    </div>
  `:i==="confirm"?`
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
        ${e}
      </h2>
      ${s?`<p style="color:#7090b0;font-size:0.85rem;margin-bottom:8px;">Star: "${s}"</p>`:""}
      ${o?`<p style="color:#5a7898;font-size:0.8rem;font-style:italic;margin-bottom:8px;">"${o}"</p>`:""}
      <p style="color:#3a5878;font-size:0.75rem;font-family:'Space Mono',monospace;margin-bottom:20px;">
        Coordinates: ${a}
      </p>
      <p style="color:#4a6888;font-size:0.75rem;margin-bottom:24px;line-height:1.6;">
        Your star is permanent. Confirm to ignite your light in this era galaxy.
      </p>
      <div style="display:flex;gap:12px;justify-content:center;">
        <button id="place-back" type="button" style="${It("#1a2030","#202840")}">← BACK</button>
        <button id="place-confirm" type="button" style="${It("#104080","#1060b0")}">IGNITE MY STAR ✦</button>
      </div>
    </div>
  `:i==="ignition"?`
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
        ${e} — Your star ignites
      </p>
    </div>
  `:""}function ie(){return`
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
  `}function It(i,t){return`
    display:inline-block;
    padding:12px 20px;
    background:${i};
    border:1px solid rgba(80,140,220,0.3);
    border-radius:6px;
    color:#a0d0f0;
    font-family:'Space Grotesk',sans-serif;
    font-size:0.75rem;
    letter-spacing:0.12em;
    text-transform:uppercase;
    cursor:pointer;
    transition:background 0.2s;
    --hover-bg:${t};
  `}async function xo(i){const t=document.getElementById("overlay-layer"),e=document.getElementById("ui-layer"),s=document.getElementById("css3d-layer"),o=document.getElementById("loading-status"),n=ys(i),a=new ms;a.fog=new gs(1032,15e-7);const r=new Ms(i),l=new Be,c=new wt;o&&(o.textContent="Loading Universe data…");const p=await qs();Ks(p),o&&(o.textContent="Building 3D galaxies…"),await new Promise(d=>setTimeout(d,0));const m=new Ts;a.add(m.group);const u=[];for(const d of ue()){const h=new _s(d,s);a.add(h.group),u.push(h)}const f=[];for(const d of["G2000","G2005","G2010","G2015","G2020","G2030"]){const h=new Vs(d);a.add(h.group),f.push(h)}o&&(o.textContent="Placing visitor star clusters…"),await new Promise(d=>setTimeout(d,0));const y=new Ps(s);a.add(y.group);const T=await ht.loadStars();S.set("stars",T),y.setStars(T,S.get("myStarId"));let x=null,A=null,C=null,D=null;const B=Ue(),dt=B.find(d=>d.id==="OBJ-FIRE");dt&&(A=new Gs(dt,s),a.add(A.group));const F=B.find(d=>d.id==="OBJ-AFRICA");F&&(C=new Fs(F,s),a.add(C.group));const zt=B.find(d=>d.id==="OBJ-STREAMS");zt&&(x=new Bs(zt,s),a.add(x.group)),D=new js(B,s),a.add(D.group);const pt=new lt(900,980,72),Tt=new G({color:7831948,transparent:!0,opacity:.4,side:ct,depthWrite:!1}),j=new z(pt,Tt);j.rotation.x=-Math.PI/2,j.position.copy(r.getTarget()),j.position.y+=24,j.renderOrder=8,a.add(j);const ut=j.position.clone();let Ot=1;const U=document.createElement("div");U.id="zoom-anchor-reticle",U.setAttribute("aria-hidden","true"),U.style.cssText=`
    position:fixed;left:50%;top:50%;width:34px;height:34px;border-radius:50%;
    border:1px solid rgba(175,190,205,.62);box-shadow:0 0 16px rgba(160,190,220,.16),inset 0 0 12px rgba(210,225,240,.06);
    transform:translate(-50%,-50%);pointer-events:none;z-index:28;opacity:0;
    transition:opacity .18s ease;
  `,U.innerHTML='<span style="position:absolute;left:50%;top:50%;width:4px;height:4px;border-radius:50%;background:rgba(210,220,230,.72);transform:translate(-50%,-50%);"></span>',e.appendChild(U);let $t=!1;function ve(d,h,g=!1){$t=g,U.style.left=`${d}px`,U.style.top=`${h}px`,U.style.opacity=g?"0.95":"0.82"}function we(){$t=!1,r.clearZoomAnchor(),U.style.opacity="0"}i.addEventListener("pointermove",d=>{d.clientX,d.clientY,$t||ve(d.clientX,d.clientY,!1)}),i.addEventListener("pointerleave",()=>{$t||(U.style.opacity="0")}),i.addEventListener("wheel",()=>{U.animate([{transform:"translate(-50%,-50%) scale(1)"},{transform:"translate(-50%,-50%) scale(1.18)"},{transform:"translate(-50%,-50%) scale(1)"}],{duration:320,easing:"ease-out"})},{passive:!0});function tt(d,h=1){ut.set(d.x,d.y+24,d.z),Ot=h}function L(d,h,g={},w=1){tt(d,w),r.travelToObject(d,h,g)}const O=new no(e,{onResetView:()=>{we(),r.resetToHome(),tt(r.getTarget(),1),O.setReturnAvailable(r.hasHistory())},onReturnPrevious:()=>{we(),r.returnToPrevious(),tt(r.getTarget(),1),O.setReturnAvailable(r.hasHistory())},onTakeTour:()=>{Ht.open()},onNextTour:()=>{Je()},onPrevTour:()=>{Ze()},onExitTour:()=>{ts()},onTourInfo:()=>{Qe()},onFinishTour:()=>{es()},onViewMyStar:async d=>{const h=await ht.getStarById(d);h&&L({x:h.x,y:h.y,z:h.z},600,{onDone:()=>{st((g,w)=>se(g,h,w))}})}});new io(e,{onTravelToGalaxy:d=>{const[h,g,w]=_t(d);L({x:h,y:g,z:w},14e3,{},6.5),O.setReturnAvailable(r.hasHistory())},onTravelToRegion:(d,h)=>{const[g,w,M]=Ve(d,h);L({x:g,y:w,z:M},4500,{},1.65),O.setReturnAvailable(r.hasHistory())},onTravelToObject:d=>{const h=B.find(g=>g.id===d);if(h){const[g,w,M]=Pe(h);L({x:g,y:w,z:M},1600,{},1.05),O.setReturnAvailable(r.hasHistory())}}});const qe=B.map(d=>{const[h,g,w]=Pe(d);return{id:d.id,objectId:d.id,name:d.title,subtitle:d.subtitle,pos:{x:h,y:g,z:w}}}),Ht=new ao(e,qe,{onPlay:d=>Ke(d)}),Xe=new fs(659224,1.1);a.add(Xe);let et=null;function st(d){et&&(et(),et=null);const h=r.snapshot();S.pushCameraSnapshot(h),t.setAttribute("aria-hidden","false"),t.classList.add("overlay-active"),et=d(t,()=>{t.setAttribute("aria-hidden","true"),t.classList.remove("overlay-active"),et=null;const g=S.popCameraSnapshot();g&&r.restoreSnapshot(g)})}let At=null,Nt=!1;i.addEventListener("pointerdown",d=>{At={x:d.clientX,y:d.clientY},Nt=!1}),i.addEventListener("pointermove",d=>{At&&Math.hypot(d.clientX-At.x,d.clientY-At.y)>7&&(Nt=!0)}),window.addEventListener("pointerup",()=>{At=null}),i.addEventListener("click",d=>{if(et||S.get("placementMode"))return;if(Nt){Nt=!1;return}if(c.x=d.clientX/window.innerWidth*2-1,c.y=-(d.clientY/window.innerHeight)*2+1,l.setFromCamera(c,r.camera),A){const M=l.intersectObjects(A.clickTargets);if(M.length>0){const b=M[0].object,E=b.userData.childId;if(E){const R=A.getChildData(E);if(R){const k=new v;b.getWorldPosition(k),L(k,600,{onDone:()=>Dt(R)})}return}if(b.userData.objectId==="OBJ-FIRE"){L(A.getPlanetWorldPos(),1500,{},1.2);return}}}if(C){const M=l.intersectObjects(C.clickTargets);if(M.length>0){const b=M[0].object,E=b.userData.childId;if(E){const R=C.getChildData(E);if(R){const k=new v;b.getWorldPosition(k),L(k,600,{onDone:()=>Dt(R)})}return}if(b.userData.objectId==="OBJ-AFRICA"){L(C.getPlanetWorldPos(),1500,{},1.2);return}}}if(x){const M=l.intersectObjects(x.clickTargets);if(M.length>0){const b=M[0].object,E=b.userData.childId;if(E){const R=x.getChildData(E);if(R){const k=new v;b.getWorldPosition(k),L(k,600,{onDone:()=>Dt(R)})}return}if(b.userData.objectId==="OBJ-STREAMS"){L(x.getPlanetWorldPos(),1500,{},1.2);return}}}if(D){const M=l.intersectObjects(D.clickTargets);if(M.length>0){const b=M[0].object,E=b.userData.childId,R=b.userData.objectId;if(E){const k=D.getChildData(E);if(k){const K=new v;b.getWorldPosition(K),L(K,600,{onDone:()=>Dt(k)})}return}if(R){const k=new v;b.getWorldPosition(k),L(k,1400,{},1.05);return}}}for(const M of f){const b=M.getHit(l);if(b){L(b.worldPos,1700,{onDone:()=>Bt(`${b.title} — ARCHIVE NOT YET CURATED`)},1.1);return}}const h=y.getClickTarget(l);if(h){const M=S.get("stars").find(b=>b.id===h.starId);if(M){st((b,E)=>se(b,M,E));return}}const g=r.isNearZoomAnchor(d.clientX,d.clientY,48),w=r.placeZoomAnchor(d.clientX,d.clientY);if(tt(w,1.25),ve(d.clientX,d.clientY,!0),!g){U.animate([{transform:"translate(-50%,-50%) scale(0.92)"},{transform:"translate(-50%,-50%) scale(1.12)"},{transform:"translate(-50%,-50%) scale(1)"}],{duration:260,easing:"ease-out"});return}r.travelTowardZoomAnchor({onDone:()=>{tt(r.getTarget(),1.25),O.setReturnAvailable(r.hasHistory())}})});let ot=null,Z=null;function Yt(){Z&&(Z.remove(),Z=null)}function Se(){Yt(),S.set("placementMode",!1),O.setPlacementMode(!1),ot&&r.restoreSnapshot(ot,!0)}window.addEventListener("universe-start-placement",()=>{ot=r.snapshot(),Yt(),Z=document.createElement("div"),Z.id="placement-mode-banner",Z.style.cssText=`
      position:fixed;top:16px;left:50%;transform:translateX(-50%);
      background:rgba(2,10,24,0.92);border:1px solid rgba(96,255,208,0.4);
      border-radius:8px;padding:8px 16px;display:flex;align-items:center;gap:12px;
      z-index:60;font-family:'Space Mono',monospace;font-size:0.7rem;color:#60ffd0;
      box-shadow:0 8px 32px rgba(0,0,0,0.6);
    `,Z.innerHTML=`
      <span>✦ PLACING STAR — CLICK ANYWHERE TO CHOOSE COORDINATE</span>
      <button id="cancel-placement-banner-btn" type="button" style="
        background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);
        border-radius:4px;color:#8ab4d4;padding:4px 10px;cursor:pointer;
        font-family:'Space Mono',monospace;font-size:0.65rem;
      ">← CANCEL</button>
    `,e.appendChild(Z),Z.querySelector("#cancel-placement-banner-btn")?.addEventListener("click",()=>{Se()})}),window.addEventListener("keydown",d=>{d.key==="Escape"&&S.get("placementMode")&&Se()}),i.addEventListener("click",d=>{if(!S.get("placementMode"))return;Yt(),c.x=d.clientX/window.innerWidth*2-1,c.y=-(d.clientY/window.innerHeight)*2+1,l.setFromCamera(c,r.camera);const h=new Ge(new v(0,1,0),0),g=new v;if(l.ray.intersectPlane(h,g),!g)return;let w="G2025",M="G2025-R3",b=1/0;for(const E of Object.keys(P)){const[R,,k]=_t(E),K=Math.sqrt((g.x-R)**2+(g.z-k)**2);K<b&&(b=K,w=E,M=`${E}-R1`)}S.set("placementMode",!1),O.setPlacementMode(!1),st((E,R)=>yo(E,{galaxyId:w,regionId:M,x:g.x,y:g.y+50,z:g.z},k=>{if(k){const K=ht.getMyStarId();K&&ht.getStarById(K).then(at=>{at&&(y.addStar(at),L({x:at.x,y:at.y,z:at.z},600))})}else ot&&(r.restoreSnapshot(ot,!0),tt({x:ot.target[0],y:ot.target[1],z:ot.target[2]},1));R()}))});function Dt(d){if(!d)return;const h=d.mediaKind;st(h==="audio"?(g,w)=>ro(g,d,w):h==="video"?(g,w)=>lo(g,d,w):h==="playable"?(g,w)=>co(g,d,w):(g,w)=>po(g,d,w))}let $=[],N=-1,nt=null;function qt(){const d=$[N];d&&(O.setTourProgress(N+1,$.length,d.name),Bt(`DESTINATION ${N+1}/${$.length} — ${d.name}`))}function Ke(d){if($=(d?.length?d:Ht.getStops()).slice(),$.length===0){Ht.open();return}N=0,nt=r.snapshot(),O.setTourActive(!0),O.setTourProgress(1,$.length,$[0].name),L($[0].pos,1500,{onDone:qt},1.05)}function Je(){if(N<0||N>=$.length-1)return;N++;const d=$[N];O.setTourProgress(N+1,$.length,d.name),L(d.pos,1500,{onDone:qt},1.05)}function Ze(){if(N<=0)return;N--;const d=$[N];O.setTourProgress(N+1,$.length,d.name),L(d.pos,1500,{onDone:qt},1.05)}function Qe(){const d=$[N];d&&Bt(d.subtitle?`${d.name} — ${d.subtitle}`:d.name)}function ts(){nt&&(r.restoreSnapshot(nt,!0),tt({x:nt.target[0],y:nt.target[1],z:nt.target[2]},1)),O.setTourActive(!1),O.setTourProgress(0,0,""),$=[],N=-1,nt=null}function es(){O.setTourActive(!1),O.setTourProgress(0,0,""),Bt("TOUR COMPLETE — EXPLORE FREELY"),$=[],N=-1,nt=null}function Bt(d){const h=document.createElement("div");h.style.cssText=`
      position:absolute;top:70px;left:50%;transform:translateX(-50%);
      background:rgba(2,10,24,0.9);border:1px solid rgba(80,160,240,0.3);
      border-radius:6px;padding:8px 16px;font-family:'Space Mono',monospace;
      font-size:0.65rem;letter-spacing:0.15em;color:#8ab4d4;
      text-transform:uppercase;pointer-events:none;z-index:60;
      animation:fade-in-text 0.3s ease;
    `,h.textContent=d,e.appendChild(h),setTimeout(()=>h.remove(),3e3)}let it=null;function Me(d,h){const g=P[h];if(!g)return;const w=new I(g.accentColor),M=new I(g.primaryColor),b=`${Math.round(w.r*255)}, ${Math.round(w.g*255)}, ${Math.round(w.b*255)}`,E=`${Math.round(M.r*255)}, ${Math.round(M.g*255)}, ${Math.round(M.b*255)}`,R=document.createElement("div");if(R.style.cssText=`
      position:fixed;inset:0;pointer-events:none;z-index:75;
      display:flex;align-items:center;justify-content:center;
      background:${d==="enter"?`radial-gradient(circle at center, rgba(${b},0.16) 0%, rgba(${E},0.1) 20%, rgba(0,0,0,0) 62%)`:`radial-gradient(circle at center, rgba(${E},0.12) 0%, rgba(${b},0.06) 18%, rgba(0,0,0,0) 58%)`};
      mix-blend-mode:screen;opacity:0;
      animation:${d==="enter"?"galaxy-threshold-enter":"galaxy-threshold-exit"} ${d==="enter"?"1150ms":"950ms"} ease forwards; backdrop-filter:blur(2px);
    `,R.innerHTML=`
      <div style="padding:14px 18px;border-radius:999px;border:1px solid rgba(${b},0.34);background:rgba(2,12,24,0.32);backdrop-filter:blur(2px);font-family:'Space Mono',monospace;font-size:0.72rem;letter-spacing:0.22em;text-transform:uppercase;color:rgb(${d==="enter"?"210,255,240":"180,205,230"});box-shadow:0 0 28px rgba(${b},0.18);">
        ${d==="enter"?"Entering":"Exiting"} ${g.title}${d==="exit"?" · RETURNING TO DEEP SPACE":""}
      </div>
    `,!document.getElementById("galaxy-threshold-style")){const k=document.createElement("style");k.id="galaxy-threshold-style",k.textContent=`
        @keyframes galaxy-threshold-enter {
          0% { opacity:0; transform:scale(0.96); filter:blur(12px); }
          20% { opacity:1; transform:scale(1); filter:blur(0); }
          100% { opacity:0; transform:scale(1.06); filter:blur(10px); }
        }
        @keyframes galaxy-threshold-exit {
          0% { opacity:0; transform:scale(1.04); filter:blur(10px); }
          20% { opacity:0.92; transform:scale(1); filter:blur(0); }
          100% { opacity:0; transform:scale(0.96); filter:blur(12px); }
        }
      `,document.head.appendChild(k)}t.appendChild(R),setTimeout(()=>R.remove(),d==="enter"?1100:900)}let Ee=!1;function ss(){if(Ee)return;Ee=!0;const d=document.createElement("div");if(d.style.cssText=`
      position:fixed;inset:0;pointer-events:none;z-index:90;
      display:flex;flex-direction:column;align-items:center;justify-content:center;
      text-align:center;font-family:'Space Mono',monospace;
      animation:title-fade 3.5s ease forwards;
    `,d.innerHTML=`
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
      `,document.head.appendChild(h)}t.appendChild(d),setTimeout(()=>d.remove(),3600)}setTimeout(ss,1e3),ee.init(),ee.on(async d=>{if(d.type==="star"&&d.starId){const h=await ht.getStarById(d.starId);h&&await go(t,h,()=>{L({x:h.x,y:h.y,z:h.z},700,{onDone:()=>{st((g,w)=>se(g,h,w))}})})}if(d.type==="galaxy"&&d.galaxyId){const[h,g,w]=_t(d.galaxyId);L({x:h,y:g,z:w},12e3,{},6.5),S.set("currentGalaxyId",d.galaxyId)}d.type==="universe"&&(r.resetToHome(),tt(r.getTarget(),1))}),window.addEventListener("universe-esc",()=>{if(et){et();return}ee.back()});let Gt=0;bs(d=>{Gt+=d,r.update(d);const h=r.camera.position;let g=null,w=1/0;for(const[b,E]of Object.entries(P)){const[R,k,K]=E.worldOffset,at=Math.hypot(h.x-R,h.y-k,h.z-K);at<w&&(w=at,g=b)}if(g!==S.get("currentGalaxyId")&&S.set("currentGalaxyId",g),it){const b=u.find(E=>E.getId()===it);(!b||b.distanceTo(h)>b.getShellBoundaryRadius()*1.08)&&(it&&Me("exit",it),it=null)}if(!it){const b=u.find(E=>E.distanceTo(h)<E.getShellBoundaryRadius()*.96);b&&(it=b.getId(),Me("enter",it))}h.distanceTo(new v(-4500,40,-2500))<4e3?_.setRegionTheme("fire"):h.distanceTo(new v(0,40,4e3))<4e3?_.setRegionTheme("africa"):h.distanceTo(new v(4e3,40,-2e3))<4500?_.setRegionTheme("frontier"):_.setRegionTheme(null),m.update(Gt);for(const b of f)b.update(d);for(const b of u)b.update(Gt,h),b.updateLabels(r.camera,n,h);j.position.lerp(ut,.14);const M=new v(Ot,Ot,Ot);j.scale.lerp(M,.14),j.rotation.z+=d*.28,Tt.opacity=.22+.09*(.5+.5*Math.sin(Gt*1.4)),A?.update(d,r.camera,n),C?.update(d,r.camera,n),x?.update(d,r.camera,n),D?.update(d,r.camera,n),y.update(h,r.camera,n),n.render(a,r.camera)}),S.set("loaded",!0);const Ft=document.getElementById("loading-screen");Ft&&(Ft.style.transition="opacity 0.8s",Ft.style.opacity="0",setTimeout(()=>Ft.remove(),800))}async function vo(){const i=document.getElementById("universe-canvas");if(!i)throw new Error("No canvas element found");try{await xo(i)}catch(t){if(console.error("[2Fly Universe] Fatal init error:",t),document.getElementById("loading-screen")){const s=document.getElementById("loading-status");s&&(s.textContent="Universe failed to initialize. Please refresh.",s.style.color="#f06060")}}}vo();
