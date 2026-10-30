import * as T from './vendor/three.module.min.js';
export function createSceneAssets(scene){
 const loader=new T.TextureLoader(),maps=[];const building=loader.load('assets/building-atlas.png',()=>{maps.forEach(m=>m.needsUpdate=true);if(floorCanvas){const c=floorCanvas.getContext('2d'),im=building.image;c.drawImage(im,im.width*2/3+im.width*.025,im.height*.045,im.width/3-im.width*.05,im.height/2-im.height*.09,0,0,512,512);floorMap.needsUpdate=true;for(const map of floorMap.userData.copies)map.needsUpdate=true;}}),scales=loader.load('assets/scales-atlas.png',()=>maps.forEach(m=>m.needsUpdate=true));
 for(const t of [building,scales]){t.colorSpace=T.SRGBColorSpace;t.minFilter=T.LinearFilter;t.generateMipmaps=false;}
 const mats=new Map();let floorCanvas,floorMap;
 function mat(sheet,cell,cols,rows){const key=(sheet===building?'b':'s')+cell;if(mats.has(key))return mats.get(key);const map=sheet.clone();map.repeat.set(1/cols,1/rows);map.offset.set(cell%cols/cols,1-(Math.floor(cell/cols)+1)/rows);maps.push(map);const m=new T.MeshBasicMaterial({map,transparent:true,alphaTest:.08,side:T.DoubleSide,toneMapped:false});mats.set(key,m);return m;}
 function panel(name,x,y,z,w,h,parent=scene){const cell={window:0,rail:1,floor:2,door:3,fascia:4,corbel:5}[name],m=new T.Mesh(new T.PlaneGeometry(w,h),mat(building,cell,3,2));m.position.set(x,y,z);parent.add(m);return m;}
 function scale(index,parent){const m=new T.Mesh(new T.PlaneGeometry(5.8,2.5),mat(scales,index,3,1));m.position.set(0,-.25,.08);parent.add(m);return m;}
 function floorTexture(){floorCanvas=document.createElement('canvas');floorCanvas.width=floorCanvas.height=512;const ctx=floorCanvas.getContext('2d');ctx.fillStyle='#89765a';ctx.fillRect(0,0,512,512);floorMap=new T.CanvasTexture(floorCanvas);floorMap.userData={copies:[]};floorMap.colorSpace=T.SRGBColorSpace;floorMap.wrapS=floorMap.wrapT=T.RepeatWrapping;return floorMap;}
 return {panel,scale,floorTexture};
}
