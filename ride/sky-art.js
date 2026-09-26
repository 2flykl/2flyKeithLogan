import * as THREE from './vendor/three.module.min.js';

export function createSkyArt(renderer){
  const names=['away','streams','fire','africa','love','gifted','tiger','away-flight','streams-cosmic'];
  const fallback=new THREE.DataTexture(new Uint8Array([0,0,0,0]),1,1);fallback.needsUpdate=true;
  const maps=names.map(()=>fallback),loaded=names.map(()=>false),errors=[];
  const loader=new THREE.TextureLoader();
  const ready=Promise.all(names.map((name,i)=>loader.loadAsync('assets/sky/'+name+'.webp').then(t=>{t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());maps[i]=t;loaded[i]=true;}).catch(()=>errors.push(name))));
  const props=Array.from({length:6},()=>new THREE.SpriteMaterial({map:fallback,transparent:true,depthWrite:false,alphaTest:.012,color:'#ffffff'}));
  const atlasReady=loader.loadAsync('assets/sky/world-islands.webp').then(atlas=>{
    atlas.colorSpace=THREE.SRGBColorSpace;
    props.forEach((mat,i)=>{const tile=atlas.clone();tile.repeat.set(1/3,1/2);tile.offset.set((i%3)/3,i<3?.5:0);tile.needsUpdate=true;mat.map=tile;mat.needsUpdate=true;});
  }).catch(()=>errors.push('world-islands'));
  const coverMats=names.slice(0,7).map(()=>new THREE.MeshBasicMaterial({map:fallback,side:THREE.DoubleSide}));
  ready.then(()=>coverMats.forEach((m,i)=>{m.map=maps[i];m.needsUpdate=true;}));
  const disc=new THREE.CircleGeometry(1,72);
  const rim=new THREE.TorusGeometry(1,.018,8,72),rimMat=new THREE.MeshStandardMaterial({color:'#d8b474',metalness:.85,roughness:.23});
  function decorate(group,s,origin,ch,at,n){
    const side=n%2?1:-1;
    if(ch>0&&n%3===1){
      const sprite=new THREE.Sprite(props[ch-1]);sprite.position.copy(at(s+45,side*(39+n%3*4),16).sub(origin));sprite.scale.set(72,72,1);sprite.userData.floatBase=sprite.position.y;sprite.userData.floatPhase=n;group.add(sprite);
      if(n%6===1){const distant=new THREE.Sprite(props[ch-1]);distant.position.copy(at(s+63,-side*105,-7).sub(origin));distant.scale.set(105,105,1);group.add(distant);}
    }
    if(((n%8)+8)%8!==2)return;
    // A tangible record-sized artwork moon sits among the clouds as well as in the sky.
    const art=new THREE.Group();art.position.copy(at(s+26,-side*31,20).sub(origin));
    const face=new THREE.Mesh(disc,coverMats[ch]);face.scale.set(12,12,1);art.add(face);
    const border=new THREE.Mesh(rim,rimMat);border.scale.set(12.25,12.25,12.25);art.add(border);
    art.userData.artMoon=true;art.userData.floatBase=art.position.y;art.userData.floatPhase=n;group.add(art);
  }
  const hazeScene=new THREE.Scene(),hazeCamera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  const hazeMaterial=new THREE.ShaderMaterial({transparent:true,depthWrite:false,depthTest:false,toneMapped:false,uniforms:{time:{value:0},amount:{value:0},tint:{value:new THREE.Color('#e0e8ed')}},vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:`
    varying vec2 v;uniform float time,amount;uniform vec3 tint;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
    float fbm(vec2 p){float n=0.,a=.5;for(int i=0;i<5;i++){n+=a*noise(p);p=p*2.03+4.7;a*=.5;}return n;}
    void main(){vec2 p=v-.5;float radius=length(p);vec2 flow=p/(radius+.16);float mist=fbm(p*5.-flow*time*.47+vec2(time*.09,0.));float detail=fbm(p*14.-flow*time*.7);float alpha=amount*(.12+smoothstep(.28,.7,mist+detail*.16)*.7);alpha*=.7+radius*.6;gl_FragColor=vec4(tint,alpha);}
  `});hazeScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),hazeMaterial));
  function updateSky(material,ch,phase,ease){
    let a=ch,b=ch,blend=0;
    if(ch<2){b=ch===0?7:8;blend=ease(.2,.62,phase);}
    if(phase>.88){a=ch<2?(ch===0?7:8):ch;b=(ch+1)%7;blend=ease(.88,1,phase);}
    material.uniforms.artA.value=maps[a];material.uniforms.artB.value=maps[b];material.uniforms.artMix.value=blend;
    material.uniforms.artReady.value=loaded[a]&&loaded[b]?1:0;
    material.uniforms.aspectA.value=a>=5?16/9:1;material.uniforms.aspectB.value=b>=5?16/9:1;
  }
  function renderMist(amount,time,color){if(amount<.005)return;hazeMaterial.uniforms.amount.value=amount;hazeMaterial.uniforms.time.value=time;hazeMaterial.uniforms.tint.value.copy(color).lerp(new THREE.Color('#ffffff'),.58);const clear=renderer.autoClear;renderer.autoClear=false;renderer.render(hazeScene,hazeCamera);renderer.autoClear=clear;}
  return {decorate,updateSky,renderMist,fallback,ready:Promise.all([ready,atlasReady]),get errors(){return errors;}};
}
