// 2Fly Galaxy Scene — GPU spiral density field + procedural nebula volumes + luminous core.
import * as THREE from 'three';
import { GALAXY_THEMES, REGION_OFFSETS } from '../types.js';
const LABEL_FADE_NEAR=30000,LABEL_FADE_FAR=150000,REGION_LABEL_NEAR=6000,REGION_LABEL_FAR=22000;
export class GalaxyScene{
  data;labelContainer;group=new THREE.Group();labelEls=[];orbitRings=[];gasLayers=[];gasMaterials=[];ledPivots=[];abstractLines=[];lineSparks=[];nebulaLayers=[];nebulaMaterials=[];coreMaterial=null;coreSphere=null;coreCorona=null;galaxyLight=null;coreFlare=null;coreHalo=null;exteriorSpiral=null;exteriorSpiralMat=null;stellarNucleus=null;stellarNucleusMat=null;nucleusRings=[];thresholdState=false;atmosphereRadius=9000;
  constructor(data,labelContainer){this.data=data;this.labelContainer=labelContainer;const theme=GALAXY_THEMES[data.id];if(!theme)return;const[x,y,z]=theme.worldOffset;this.group.position.set(x,y,z);this.group.scale.setScalar(theme.scale??1);this.atmosphereRadius=theme.status==='showcase'?12450:theme.status==='uncharted'?7600:9000;this.buildExteriorSpiralLOD(theme);this.buildSpiralGPU(theme);this.buildProceduralNebula(theme);this.buildCore(theme);this.buildAbstractWhiteLines(theme);this.buildPerimeterDust(theme);this.buildRegionMarkers(theme);this.buildThresholdLeds(theme);this.buildLabel();this.buildRegionLabels();}

  buildExteriorSpiralLOD(theme){
    // V5 showcase: intentionally no exterior image plate. The galaxy silhouette is made by real GPU stars/dust.
    if(theme.status==='showcase') return;
  }
  buildSpiralGPU(theme){
    const showcase=theme.status==='showcase',uncharted=theme.status==='uncharted';
    if(showcase){
      // Face-on stellar-density spiral. No fog/plate: the visible galaxy is literally stars + dust.
      const maxRadius=10400,arms=5;
      const palettes=[
        new THREE.Color(0x48e0d0),
        new THREE.Color(0x67cfff),
        new THREE.Color(0xf7f3dc),
        new THREE.Color(0xffc777),
        new THREE.Color(0xb991ff)
      ];
      const layers=[
        {count:26000,opacity:.42,sizeMin:3.0,sizeMax:9.0,width:.18,scatter:120,depth:170},
        {count:9000, opacity:.64,sizeMin:5.0,sizeMax:16.0,width:.10,scatter:70, depth:115},
        {count:2600, opacity:.86,sizeMin:9.0,sizeMax:27.0,width:.065,scatter:38, depth:75}
      ];
      for(let layerIndex=0;layerIndex<layers.length;layerIndex++){
        const L=layers[layerIndex],count=L.count;
        const pos=new Float32Array(count*3),seed=new Float32Array(count),sizes=new Float32Array(count),colors=new Float32Array(count*3);
        for(let i=0;i<count;i++){
          const arm=i%arms;
          const rn=Math.pow(Math.random(),.69),r=260+rn*(maxRadius-260);
          const armBase=arm*(Math.PI*2/arms);
          const spiral=armBase + r*.00134;
          const lane=(Math.random()-.5)*L.width*(.55+.9*rn);
          const jitter=(Math.random()-.5)*L.scatter;
          const a=spiral+lane;
          pos[i*3]=Math.cos(a)*(r+jitter);
          pos[i*3+1]=Math.sin(a)*(r+jitter);
          pos[i*3+2]=(Math.random()-.5)*L.depth*(.32+.68*rn);
          const q=Math.random(); seed[i]=q; sizes[i]=L.sizeMin+Math.random()*(L.sizeMax-L.sizeMin);
          let c;
          if(q>.982)c=palettes[2].clone();
          else if(q>.93)c=palettes[3].clone().lerp(palettes[2],Math.random()*.38);
          else if(q>.875)c=palettes[4].clone().lerp(palettes[1],.35);
          else c=palettes[Math.random()<.56?0:1].clone().lerp(palettes[2],Math.random()*.18);
          if(r<2300)c.lerp(palettes[3],.23);
          colors[i*3]=c.r;colors[i*3+1]=c.g;colors[i*3+2]=c.b;
        }
        const geo=new THREE.BufferGeometry();
        geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
        geo.setAttribute('aSeed',new THREE.BufferAttribute(seed,1));
        geo.setAttribute('size',new THREE.BufferAttribute(sizes,1));
        geo.setAttribute('color',new THREE.BufferAttribute(colors,3));
        const mat=new THREE.ShaderMaterial({uniforms:{time:{value:0},globalAlpha:{value:L.opacity}},vertexShader:`
          attribute float aSeed;attribute float size;attribute vec3 color;uniform float time;uniform float globalAlpha;varying vec3 vColor;varying float vAlpha;
          void main(){vec3 p=position;float rr=length(p.xy);float ang=time*.0036*(1.22-.44*clamp(rr/10400.0,0.0,1.0));float cs=cos(ang),sn=sin(ang);p.xy=mat2(cs,-sn,sn,cs)*p.xy;p.z+=sin(time*.16+aSeed*31.0+rr*.004)*3.5;vColor=color;vAlpha=globalAlpha*(.80+.20*sin(time*(.45+aSeed*.7)+aSeed*41.0));vec4 mv=modelViewMatrix*vec4(p,1.0);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(size*(720.0/max(1.0,-mv.z)),.65,8.5);}`,
          fragmentShader:`varying vec3 vColor;varying float vAlpha;void main(){vec2 q=gl_PointCoord-.5;float d=length(q);if(d>.5)discard;float soft=smoothstep(.5,.05,d);float core=smoothstep(.12,0.0,d);gl_FragColor=vec4(vColor*(.82+core*1.55),soft*vAlpha);}`,
          transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,vertexColors:true});
        const pts=new THREE.Points(geo,mat);
        pts.rotation.x=-.17;pts.rotation.z=-.08;
        this.group.add(pts);this.gasLayers.push(pts);this.gasMaterials.push(mat);
      }
      return;
    }
    const baseCount=uncharted?4200:8200,arms=4,maxRadius=uncharted?6900:8300,thickness=uncharted?780:980;
    const primary=new THREE.Color(theme.primaryColor),accent=new THREE.Color(theme.accentColor),starTint=new THREE.Color(theme.starTint);
    const layerScales=[1,.48,.22],baseOpacity=uncharted?[.24,.12,.06]:[.62,.28,.14];
    layerScales.forEach((scale,layerIndex)=>{
      const count=Math.floor(baseCount*scale),radius=new Float32Array(count),theta=new Float32Array(count),height=new Float32Array(count),seed=new Float32Array(count),sizes=new Float32Array(count),colors=new Float32Array(count*3);
      for(let i=0;i<count;i++){const arm=i%arms,r=Math.pow(Math.random(),.64)*maxRadius,s=Math.random();radius[i]=r+(Math.random()-.5)*(340+layerIndex*150);theta[i]=arm*(Math.PI*2/arms)+(Math.random()-.5)*(.17+(r/maxRadius)*.30)+(layerIndex-1)*.018;const flare=Math.max(.16,r/maxRadius);height[i]=(Math.random()-.5)*thickness*(.22+.78*flare)+(layerIndex-1)*110;seed[i]=s;sizes[i]=15+Math.random()*(layerIndex===0?48:30);let c=primary.clone().lerp(accent,.10+(r/maxRadius)*.38);if(s>.91)c.lerp(starTint,.78);colors[i*3]=c.r;colors[i*3+1]=c.g;colors[i*3+2]=c.b;}
      const geo=new THREE.BufferGeometry();geo.setAttribute('aRadius',new THREE.BufferAttribute(radius,1));geo.setAttribute('aTheta',new THREE.BufferAttribute(theta,1));geo.setAttribute('aHeight',new THREE.BufferAttribute(height,1));geo.setAttribute('aSeed',new THREE.BufferAttribute(seed,1));geo.setAttribute('size',new THREE.BufferAttribute(sizes,1));geo.setAttribute('color',new THREE.BufferAttribute(colors,3));
      const mat=new THREE.ShaderMaterial({uniforms:{time:{value:0},globalAlpha:{value:baseOpacity[layerIndex]},twist:{value:.00108},maxRadius:{value:maxRadius}},vertexShader:`attribute float aRadius;attribute float aTheta;attribute float aHeight;attribute float aSeed;attribute float size;attribute vec3 color;uniform float time;uniform float globalAlpha;uniform float twist;uniform float maxRadius;varying vec3 vColor;varying float vAlpha;void main(){float differential=(1.30-0.50*(aRadius/maxRadius));float a=aTheta+aRadius*twist+time*.0042*differential;float wobble=sin(time*.13+aSeed*21.0+aRadius*.003)*8.0;vec3 p=vec3(cos(a)*aRadius,aHeight+wobble,sin(a)*aRadius);vColor=color;float flick=.84+.16*sin(time*(.55+aSeed*.55)+aSeed*37.0);vAlpha=globalAlpha*flick;vec4 mv=modelViewMatrix*vec4(p,1.0);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(size*(650.0/-mv.z),.55,9.0);}`,fragmentShader:`varying vec3 vColor;varying float vAlpha;void main(){vec2 uv=gl_PointCoord-.5;float d=length(uv);if(d>.5)discard;float soft=smoothstep(.5,.03,d);float core=smoothstep(.13,0.0,d);gl_FragColor=vec4(vColor*(.78+core*1.35),soft*vAlpha);}`,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending});
      const pts=new THREE.Points(geo,mat);pts.rotation.x=.12+(layerIndex-1)*.025;pts.rotation.z=(layerIndex-1)*.02;this.group.add(pts);this.gasLayers.push(pts);this.gasMaterials.push(mat);
    });
  }
  buildProceduralNebula(theme){
    const showcase=theme.status==='showcase';
    if(showcase){return;}
    const vertex=`varying vec3 vLocal;varying vec3 vWorld;void main(){vLocal=position;vec4 w=modelMatrix*vec4(position,1.0);vWorld=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}`;
    const fragment=`precision highp float;uniform float time;uniform vec3 colorA;uniform vec3 colorB;uniform float density;varying vec3 vLocal;varying vec3 vWorld;
      float hash(vec3 p){p=fract(p*.3183099+.1);p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
      float noise(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(mix(hash(i+vec3(0,0,0)),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
      float fbm(vec3 p){float v=0.0,a=.52;for(int i=0;i<5;i++){v+=a*noise(p);p=p*2.03+vec3(1.7,2.1,1.3);a*=.49;}return v;}
      void main(){vec3 p=vLocal*.00044;float n=fbm(p+vec3(time*.008,-time*.004,time*.006));float n2=fbm(p*1.73-vec3(time*.004,time*.006,0.0));float gas=smoothstep(.48,.82,n*.72+n2*.42);float rim=pow(1.0-abs(dot(normalize(vLocal),normalize(cameraPosition-vWorld))),1.5);float alpha=gas*density*(.22+.45*rim);vec3 col=mix(colorA,colorB,n2);gl_FragColor=vec4(col,alpha);}`;
    for(let i=0;i<2;i++){
      const geo=new THREE.SphereGeometry(this.atmosphereRadius*(.72+i*.09),48,32);
      const mat=new THREE.ShaderMaterial({uniforms:{time:{value:0},colorA:{value:new THREE.Color(theme.primaryColor)},colorB:{value:new THREE.Color(theme.accentColor)},density:{value:.05*(1-i*.18)}},vertexShader:vertex,fragmentShader:fragment,transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending});
      const mesh=new THREE.Mesh(geo,mat);mesh.scale.y=.20+i*.025;mesh.rotation.set(.08+i*.025,i*.7,.05-i*.02);this.group.add(mesh);this.nebulaLayers.push(mesh);this.nebulaMaterials.push(mat);
    }
  }
  buildCore(theme){
    const showcase=theme.status==='showcase';
    if(showcase){
      const count=3600,pos=new Float32Array(count*3),sizes=new Float32Array(count),colors=new Float32Array(count*3),seed=new Float32Array(count);
      const white=new THREE.Color(0xfffbeb),gold=new THREE.Color(0xffc86b),cyan=new THREE.Color(0x9feeff),violet=new THREE.Color(0xd3b3ff);
      for(let i=0;i<count;i++){
        const u=Math.pow(Math.random(),2.35),r=55+u*960,a=Math.random()*Math.PI*2;
        pos[i*3]=Math.cos(a)*r;pos[i*3+1]=Math.sin(a)*r*.40;pos[i*3+2]=(Math.random()-.5)*(55+u*120);
        sizes[i]=4+Math.random()*(i<120?24:12);seed[i]=Math.random();
        let c=(seed[i]>.83?gold:seed[i]>.70?cyan:seed[i]>.95?violet:white).clone();
        colors[i*3]=c.r;colors[i*3+1]=c.g;colors[i*3+2]=c.b;
      }
      const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('size',new THREE.BufferAttribute(sizes,1));geo.setAttribute('color',new THREE.BufferAttribute(colors,3));geo.setAttribute('aSeed',new THREE.BufferAttribute(seed,1));
      const mat=new THREE.ShaderMaterial({uniforms:{time:{value:0}},vertexShader:`attribute float size;attribute vec3 color;attribute float aSeed;uniform float time;varying vec3 vColor;varying float vAlpha;void main(){vec3 p=position;float a=time*.012;float cs=cos(a),sn=sin(a);p.xy=mat2(cs,-sn,sn,cs)*p.xy;vColor=color;vAlpha=.72+.28*sin(time*(.7+aSeed)+aSeed*39.0);vec4 mv=modelViewMatrix*vec4(p,1.0);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(size*(800.0/max(1.0,-mv.z)),.8,10.0);}`,fragmentShader:`varying vec3 vColor;varying float vAlpha;void main(){vec2 q=gl_PointCoord-.5;float d=length(q);if(d>.5)discard;float a=smoothstep(.5,.04,d)*vAlpha;gl_FragColor=vec4(vColor*(1.0+smoothstep(.18,0.0,d)),a);}`,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,vertexColors:true});
      this.stellarNucleus=new THREE.Points(geo,mat);this.stellarNucleus.rotation.x=-.17;this.stellarNucleus.rotation.z=-.08;this.stellarNucleusMat=mat;this.group.add(this.stellarNucleus);
      this.nucleusRings=[];
      for(let i=0;i<3;i++){
        const rr=360+i*210;const ring=new THREE.Mesh(new THREE.RingGeometry(rr,rr+5,160),new THREE.MeshBasicMaterial({color:i===0?0xffe8ad:i===1?0x8ee8ff:0xc8b0ff,transparent:true,opacity:.20-i*.035,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));
        ring.rotation.x=-.17;ring.rotation.z=-.08+i*.17;this.group.add(ring);this.nucleusRings.push(ring);
      }
      this.galaxyLight=new THREE.PointLight(0xfff2d2,5.6,42000,1.45);this.group.add(this.galaxyLight);
      return;
    }
    const r=330,mat=new THREE.MeshBasicMaterial({color:theme.starTint,transparent:true,opacity:1});this.coreMaterial=mat;this.coreSphere=new THREE.Mesh(new THREE.SphereGeometry(r,48,32),mat);this.group.add(this.coreSphere);this.galaxyLight=new THREE.PointLight(0xf7fff9,2.2,30000,1.35);this.group.add(this.galaxyLight);
  }
  buildAbstractWhiteLines(theme){
    const count=theme.status==='showcase'?8:5;
    for(let i=0;i<count;i++){
      const t=i/Math.max(1,count-1);
      const radius=this.atmosphereRadius*(theme.status==='showcase'?(0.23+t*0.56):(0.31+t*0.46));
      const yScale=theme.status==='showcase'?(0.52+t*0.08):(0.34+(i%3)*0.045);
      const curve=new THREE.EllipseCurve(0,0,radius,radius*yScale,0,Math.PI*2,false,i*.035),pts=curve.getPoints(220).map(v=>new THREE.Vector3(v.x,0,v.y));
      const geo=new THREE.BufferGeometry().setFromPoints(pts),baseOpacity=theme.status==='showcase'?(0.05+t*0.018):0.07,mat=new THREE.LineBasicMaterial({color:0xf4fbff,transparent:true,opacity:baseOpacity,depthWrite:false,blending:THREE.AdditiveBlending}),line=new THREE.LineLoop(geo,mat);
      line.rotation.x=Math.PI/2 + (theme.status==='showcase' ? (-0.11 + t*0.07) : ((i%3-1)*0.045));
      line.rotation.y=theme.status==='showcase' ? (0.04*i) : i*.11;
      line.rotation.z=theme.status==='showcase' ? (-0.05 + t*0.08) : ((i%3-1)*.035);
      this.group.add(line);
      const spark=new THREE.Mesh(new THREE.SphereGeometry(theme.status==='showcase'?16:13,8,6),new THREE.MeshBasicMaterial({color:i%4===0?theme.starTint:0xffffff,transparent:true,opacity:.72,depthWrite:false,blending:THREE.AdditiveBlending}));
      line.add(spark);this.abstractLines.push({line,phase:i*.67,baseOpacity,curve});this.lineSparks.push({spark,curve,phase:(i*.173)%1,speed:(theme.status==='showcase'?0.0065:0.009)+(i%3)*.0015});
    }
  }
  buildPerimeterDust(theme){
    const showcase=theme.status==='showcase';
    const count=showcase?2200:720;
    const positions=new Float32Array(count*3),colors=new Float32Array(count*3),sizes=new Float32Array(count);
    const primary=new THREE.Color(theme.primaryColor),accent=new THREE.Color(theme.accentColor),star=new THREE.Color(theme.starTint);
    for(let i=0;i<count;i++){
      const a=Math.random()*Math.PI*2;
      const r=this.atmosphereRadius*(0.98+Math.random()*0.11);
      const y=(Math.random()-.5)*(showcase?this.atmosphereRadius*0.26:this.atmosphereRadius*0.18);
      positions[i*3]=Math.cos(a)*r;
      positions[i*3+1]=y;
      positions[i*3+2]=Math.sin(a)*r*(showcase?0.78:0.86);
      const c=(Math.random()<0.18?star.clone():primary.clone().lerp(accent,Math.random()*0.75));
      colors[i*3]=c.r;colors[i*3+1]=c.g;colors[i*3+2]=c.b;
      sizes[i]=showcase?(Math.random()<0.08?24:8+Math.random()*11):(6+Math.random()*7);
    }
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.BufferAttribute(positions,3));
    geo.setAttribute('color',new THREE.BufferAttribute(colors,3));
    geo.setAttribute('size',new THREE.BufferAttribute(sizes,1));
    const mat=new THREE.ShaderMaterial({uniforms:{time:{value:0},alpha:{value:showcase?.3:.2}},vertexShader:`attribute float size;attribute vec3 color;uniform float time;varying vec3 vColor;varying float vAlpha;void main(){vec3 p=position;float wave=sin(time*.45+p.x*.0012+p.z*.0016)*10.0; p.y+=wave; vColor=color; vAlpha=.72+.28*sin(time*1.2+position.x*.004+position.z*.005); vec4 mv=modelViewMatrix*vec4(p,1.0); gl_Position=projectionMatrix*mv; gl_PointSize=clamp(size*(700.0/max(1.0,-mv.z)),.7,8.8);}`,fragmentShader:`uniform float alpha;varying vec3 vColor;varying float vAlpha;void main(){vec2 q=gl_PointCoord-.5;float d=length(q);if(d>.5)discard;float soft=smoothstep(.5,.04,d);gl_FragColor=vec4(vColor,soft*alpha*vAlpha);}`,transparent:true,depthWrite:false,vertexColors:true,blending:THREE.AdditiveBlending});
    const pts=new THREE.Points(geo,mat);
    this.group.add(pts);
    this.perimeterDust=pts; this.perimeterDustMat=mat;
  }
  buildRegionMarkers(theme){for(const off of REGION_OFFSETS){const geo=new THREE.RingGeometry(650,720,64),mat=new THREE.MeshBasicMaterial({color:theme.accentColor,transparent:true,opacity:.09,side:THREE.DoubleSide,depthWrite:false}),ring=new THREE.Mesh(geo,mat);ring.position.set(...off);ring.rotation.x=-Math.PI/2;this.orbitRings.push(ring);this.group.add(ring);}}
  buildThresholdLeds(theme){const count=theme.status==='showcase'?18:12;for(let i=0;i<count;i++){const pivot=new THREE.Group(),a=i/count*Math.PI*2+(i%3)*.17,r=this.atmosphereRadius*(.82+(i%4)*.045),node=new THREE.Mesh(new THREE.SphereGeometry(42+(i%3)*14,10,8),new THREE.MeshBasicMaterial({color:i%2?theme.accentColor:theme.starTint,transparent:true,opacity:.48,depthWrite:false,blending:THREE.AdditiveBlending}));node.position.set(Math.cos(a)*r,Math.sin(a*1.7)*this.atmosphereRadius*.16,Math.sin(a)*r);pivot.add(node);this.group.add(pivot);this.ledPivots.push({pivot,node,speed:.12+(i%4)*.035});}}
  buildLabel(){const theme=GALAXY_THEMES[this.data.id],showcase=theme?.status==='showcase',uncharted=theme?.status==='uncharted',el=document.createElement('div');el.className='universe-label galaxy-label';el.dataset.galaxyId=this.data.id;el.innerHTML=`<span class="label-era" style="${showcase?'color:#60ffd0;font-weight:bold;':uncharted?'color:#6080a0;':''}">${showcase?'✦ ':''}${this.data.title}${uncharted?' — UNCHARTED':''}</span>`;el.style.cssText=`position:absolute;top:0;left:0;pointer-events:none;font-family:'Space Mono',monospace;font-size:clamp(10px,1.3vw,14px);letter-spacing:.18em;text-transform:uppercase;white-space:nowrap;transform:translate(-50%,-50%);user-select:none;`;this.labelContainer.appendChild(el);this.labelEls.push({el,pos:new THREE.Vector3(0,1800,0),kind:'galaxy'});}
  buildRegionLabels(){this.data.regions.forEach((region,index)=>{const off=REGION_OFFSETS[index]??[0,0,0],el=document.createElement('div');el.className='universe-label region-label';el.dataset.regionId=region.id;el.innerHTML=`<span style="font-weight:600;color:#c0e0ff;">${region.title}</span>${region.subtitle?`<br/><span style="font-size:.8em;opacity:.7;font-weight:normal;">${region.subtitle}</span>`:''}`;el.style.cssText=`position:absolute;top:0;left:0;pointer-events:none;font-family:'Space Grotesk',sans-serif;font-size:clamp(8px,.95vw,11px);letter-spacing:.12em;text-transform:uppercase;white-space:nowrap;transform:translate(-50%,-50%);user-select:none;text-align:center;`;this.labelContainer.appendChild(el);this.labelEls.push({el,pos:new THREE.Vector3(off[0],off[1]+750,off[2]),kind:'region'});});}
  updateLabels(camera,renderer,cameraWorldPos,activeGalaxyId=null){const{width,height}=renderer.domElement.getBoundingClientRect();for(const{el,pos,kind}of this.labelEls){const worldPos=pos.clone();this.group.localToWorld(worldPos);const dist=cameraWorldPos.distanceTo(worldPos);let opacity=kind==='galaxy'?smoothFade(dist,LABEL_FADE_FAR,LABEL_FADE_NEAR):smoothFade(dist,REGION_LABEL_FAR,REGION_LABEL_NEAR);if(activeGalaxyId&&activeGalaxyId!==this.data.id)opacity*=kind==='galaxy'?.18:.03;if(activeGalaxyId===this.data.id&&kind==='region')opacity*=.88;const ndc=worldPos.clone().project(camera);if(ndc.z>1||opacity<.02){el.style.opacity='0';continue;}el.style.opacity=String(opacity);if(activeGalaxyId===this.data.id&&kind==='galaxy'){el.style.left='50%';el.style.top='54px';el.style.transform='translate(-50%,0)';}else{el.style.left=`${(ndc.x*.5+.5)*width}px`;el.style.top=`${(-ndc.y*.5+.5)*height}px`;el.style.transform='translate(-50%,-50%)';}}}
  update(time,cameraWorldPos){
    const center=this.group.getWorldPosition(new THREE.Vector3()),worldRadius=this.atmosphereRadius*this.group.scale.x,dist=center.distanceTo(cameraWorldPos),inside=dist<worldRadius*1.02;
    if(inside!==this.thresholdState){this.thresholdState=inside;const theme=GALAXY_THEMES[this.data.id];window.dispatchEvent(new CustomEvent('universe-galaxy-threshold',{detail:{galaxyId:this.data.id,title:this.data.title,state:inside?'enter':'exit',primaryColor:theme.primaryColor,accentColor:theme.accentColor}}));}
    const isShowcase=GALAXY_THEMES[this.data.id]?.status==='showcase';const base=isShowcase?[.42,.64,.86]:[.62,.28,.14];
    if(isShowcase&&this.exteriorSpiralMat){const fadeOutStart=worldRadius*2.0,fadeOutEnd=worldRadius*1.12;const exteriorAlpha=THREE.MathUtils.clamp((dist-fadeOutEnd)/(fadeOutStart-fadeOutEnd),0,1);this.exteriorSpiralMat.opacity=.96*exteriorAlpha;this.exteriorSpiral.visible=exteriorAlpha>.01;}
    this.gasMaterials.forEach((m,i)=>{m.uniforms.time.value=time;const mult=GALAXY_THEMES[this.data.id]?.status==='uncharted'?.55:1;if(isShowcase){const approach=THREE.MathUtils.clamp((worldRadius*2.15-dist)/(worldRadius*1.1),0,1);m.uniforms.globalAlpha.value=base[i]*(.62+.22*approach)*(inside?.88:1);}else{m.uniforms.globalAlpha.value=base[i]*(inside?.34:1)*mult;}});
    this.nebulaMaterials.forEach((m,i)=>{m.uniforms.time.value=time;});if(this.stellarNucleusMat)this.stellarNucleusMat.uniforms.time.value=time;this.nucleusRings?.forEach((r,i)=>{r.rotation.z+=.00006*(i%2?1:-1);r.material.opacity=.12+.055*(.5+.5*Math.sin(time*.42+i));});if(this.coreDisk?.material?.uniforms?.time)this.coreDisk.material.uniforms.time.value=time;this.coreRings?.forEach((r,i)=>{r.rotation.z=time*(i%2?-.035:.028)+i*.41;r.material.opacity=(isShowcase?.26:.18)+.05*Math.sin(time*.7+i);});
    if(this.coreMaterial?.uniforms?.time)this.coreMaterial.uniforms.time.value=time;if(this.coreSphere)this.coreSphere.rotation.y=time*.035;if(this.coreFlare)this.coreFlare.material.opacity=(isShowcase?.90:.48)+.06*Math.sin(time*1.45);if(this.coreHalo)this.coreHalo.material.opacity=(isShowcase?.22:.14)+.04*Math.sin(time*.82+1.4);
    this.orbitRings.forEach(r=>r.material.opacity=(inside?.075:.09)+.018*Math.sin(time*.45));
    this.abstractLines.forEach((e,i)=>{const breathe=.76+.24*Math.sin(time*(.16+(i%3)*.025)+e.phase);e.line.material.opacity=e.baseOpacity*(inside?1.22:1)*breathe;e.line.rotation.y+=.000018*(i%2?1:-1);});
    this.lineSparks.forEach((s,i)=>{const t=(s.phase+time*s.speed)%1,p=s.curve.getPoint(t);s.spark.position.set(p.x,0,p.y);s.spark.material.opacity=.46+.42*(.5+.5*Math.sin(time*3.1+i));});if(this.perimeterDustMat)this.perimeterDustMat.uniforms.time.value=time;
    this.nebulaLayers.forEach((n,i)=>{n.rotation.z+=.000018*(i%2?1:-1);});
    this.ledPivots.forEach(l=>{l.pivot.rotation.y+=l.speed*.003;l.pivot.rotation.x+=l.speed*.001;l.node.material.opacity=(inside?.28:.48)+.09*Math.sin(time*.8+l.speed*20);});
    if(this.galaxyLight)this.galaxyLight.intensity=(isShowcase?5.6:2.2)*(inside?.96:1)*(.94+.06*Math.sin(time*1.15));
  }
  getId(){return this.data.id;} distanceTo(worldPos){return this.group.getWorldPosition(new THREE.Vector3()).distanceTo(worldPos);} getShellBoundaryRadius(){return this.atmosphereRadius*this.group.scale.x;}
  dispose(){this.labelEls.forEach(({el})=>el.remove());if(this.exteriorSpiral){this.exteriorSpiral.geometry.dispose();this.exteriorSpiral.material.map?.dispose();this.exteriorSpiral.material.dispose();}this.gasLayers.forEach(l=>{l.geometry.dispose();l.material.dispose();});this.nebulaLayers.forEach(n=>{n.geometry.dispose();n.material.dispose();});this.coreSphere?.geometry.dispose();this.coreMaterial?.dispose();this.coreDisk?.geometry.dispose();this.coreDisk?.material.dispose();this.coreRings?.forEach(r=>{r.geometry.dispose();r.material.dispose();});this.stellarNucleus?.geometry.dispose();this.stellarNucleusMat?.dispose();this.nucleusRings?.forEach(r=>{r.geometry.dispose();r.material.dispose();});this.perimeterDust?.geometry.dispose();this.perimeterDustMat?.dispose();}
}
function smoothFade(dist,far,near){if(dist>=far)return 0;if(dist<=near)return 1;return 1-(dist-near)/(far-near);}
