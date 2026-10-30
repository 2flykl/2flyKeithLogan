import * as T from './vendor/three.module.min.js';
export function heroPose({hurt,ground,carrying,speed,time}){if(hurt)return 7;if(!ground)return 6;if(carrying)return Math.abs(speed)>.3?4+Math.floor(time*6)%2:4;return Math.abs(speed)>.3?[1,2,3,2][Math.floor(time*8)%4]:0;}
export function womanPose({ended,refill,throwAge,time}){if(ended)return 7;if(throwAge>=0&&throwAge<.75)return throwAge<.15?3:throwAge<.4?4:5;if(refill>0)return Math.floor(time*3)%2?2:6;return Math.floor(time/5)%2?1:0;}
export function createStuffBox(scene){const g=new T.Group(),map=new T.TextureLoader().load('assets/your-stuff-box.png');map.colorSpace=T.SRGBColorSpace;const material=new T.SpriteMaterial({map,transparent:true,depthWrite:false,toneMapped:false});material.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
if(diffuseColor.g-diffuseColor.r>.18&&diffuseColor.b-diffuseColor.r>.18&&min(diffuseColor.g,diffuseColor.b)>.35)discard;`);};const icon=new T.Sprite(material);icon.scale.set(2.15,1.9,1);g.add(icon);scene.add(g);return g;}
export function createCharacter(scene,female=false){
 const g=new T.Group();scene.add(g);const map=new T.TextureLoader().load('assets/'+(female?'woman':'man')+'-poses.png',()=>{document.getElementById('game').dataset[female?'womanArt':'heroArt']='loaded';});map.colorSpace=T.SRGBColorSpace;map.minFilter=T.LinearFilter;map.magFilter=T.LinearFilter;map.generateMipmaps=false;
 const walkMap=female?null:new T.TextureLoader().load('assets/man-walk-cycle-v2.png');if(walkMap){walkMap.colorSpace=T.SRGBColorSpace;walkMap.minFilter=T.LinearFilter;walkMap.magFilter=T.LinearFilter;walkMap.generateMipmaps=false;}
 const material=new T.SpriteMaterial({map,transparent:true,alphaTest:.05,depthWrite:false,toneMapped:false});
 // The supplied cyan matte is discarded by the renderer; source artwork stays untouched.
 material.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
 if(diffuseColor.g-diffuseColor.r>.18 && diffuseColor.b-diffuseColor.r>.18 && min(diffuseColor.g,diffuseColor.b)>.35)discard;
 `);};material.customProgramCacheKey=()=> 'character-cyan-key-v1';
 const sprite=new T.Sprite(material);sprite.center.set(.5,0);g.add(sprite);let previous='';g.userData.throwAt=-10;
 const womanRects=[[.05,.23,0,.53],[.27,.43,0,.53],[.46,.71,.06,.53],[.74,1,0,.53],[.02,.28,.53,1],[.32,.47,.53,1],[.51,.70,.53,1],[.75,.93,.53,1]];
 g.setPose=(frame=0,direction=1,bob=0)=>{const key=frame+':'+direction;if(key!==previous){previous=key;const walking=!female&&frame>=8,atlas=walking?walkMap:map,index=walking?frame-8:frame;material.map=atlas;const rect=female?womanRects[frame]:[(index%4)/4,(index%4+1)/4,Math.floor(index/4)/2,(Math.floor(index/4)+1)/2];const [left,right,top,bottom]=rect,w=right-left,h=bottom-top;atlas.repeat.set(direction<0?-w:w,h);atlas.offset.set(direction<0?right:left,1-bottom);sprite.scale.set(2.6*w*1.5/h,2.6,1);g.userData.pose=frame;g.userData.direction=direction;}sprite.position.y=bob;};let stride=0;g.walk=(distance,carrying,direction)=>{stride=(stride+Math.abs(distance)/2.2)%1;g.setPose(8+(carrying?4:0)+Math.floor(stride*4),direction,Math.sin(stride*Math.PI*4)*.018);};g.setPose();return g;
}
