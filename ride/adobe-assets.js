import * as THREE from './vendor/three.module.min.js';

// Keep supplied sheets intact. UV windows select the usable artwork at render time.
export async function loadAdobe(renderer) {
  const loader = new THREE.TextureLoader();
  const files = ['sheet-17.png','sheet-14.png','sheet-19.png','sheet-2.png','sheet-9.png','surfaces.png','water.png'];
  const maps = await Promise.all(files.map(async file => {
    const t = await loader.loadAsync(`assets/adobe/${file}`);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    return t;
  }));
  const crop = (index, rect, cutout = true) => {
    const t = maps[index].clone(); t.needsUpdate = true;
    const {width:w,height:h} = t.image, [x,y,r,b] = rect;
    t.offset.set(x/w,1-b/h); t.repeat.set((r-x)/w,(b-y)/h);
    const material = new THREE.MeshStandardMaterial({map:t,roughness:.88,alphaTest:cutout ? .72 : 0,side:THREE.DoubleSide});
    return {material,aspect:(r-x)/(b-y)};
  };
  // Wrap inside a material patch rather than repeating the complete contact sheet.
  const surface = (rect, options={}) => {
    // Extract into a browser texture so mipmaps cannot bleed atlas gutters into the road.
    const canvas=document.createElement('canvas'),image=maps[5].image;
    canvas.width=rect[2]-rect[0];canvas.height=rect[3]-rect[1];
    canvas.getContext('2d').drawImage(image,rect[0],rect[1],canvas.width,canvas.height,0,0,canvas.width,canvas.height);
    const map=new THREE.CanvasTexture(canvas);map.colorSpace=THREE.SRGBColorSpace;
    map.wrapS=map.wrapT=THREE.RepeatWrapping;map.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
    return new THREE.MeshStandardMaterial({map,roughness:.95,...options});
  };
  const houses=[[100,25,750,430],[890,90,1660,415],[160,478,670,887],[963,518,1600,884]].map(r=>crop(0,r));
  const cars=[[60,100,510,442],[645,64,1068,443],[1203,48,1640,443],[62,555,505,898],[643,555,1058,898],[1220,573,1643,898]].map(r=>crop(1,r));
  const names={
    tree:crop(2,[46,48,499,635]), rocks:crop(2,[1646,224,2154,507]),
    dock:crop(3,[48,74,528,401]),picnic:crop(3,[596,104,1120,385]),boat:crop(3,[1159,127,1664,356]),
    reeds:crop(3,[50,462,596,881]),timber:crop(3,[630,547,1117,831]),driftwood:crop(3,[1170,517,1655,843]),
    parked:crop(4,[36,99,650,383]),bike:crop(4,[700,92,1104,411]),bins:crop(4,[1212,120,1637,394]),
    shrubs:crop(4,[38,470,668,865]),fence:crop(4,[727,529,1090,869]),shelter:crop(4,[1196,481,1644,888])
  };
  const road=surface([995,44,1328,366],{color:'#50595b'});
  const lawn=surface([79,45,413,366],{color:'#bdc69b'});
  const verge=surface([539,45,869,366],{color:'#b1b09c'});
  const sidewalk=surface([541,410,870,735],{color:'#ded8c9'});
  // Photo texture for physical house facades; geometry provides side depth and roofs.
  const houseFaces=[crop(0,[177,150,586,418],false),crop(0,[1185,168,1547,377],false),crop(0,[209,587,518,872],false),crop(0,[1005,696,1410,865],false)];
  const houseSides=[[597,184,708,380],[1553,182,1616,346],[527,618,615,847],[1432,690,1552,855]].map(r=>crop(0,r,false));
  return {names,houseSides,houses,cars,houseFaces,road,lawn,verge,sidewalk,water:maps[6],maps};
}

export function assetPlane(asset,width,height=null) {
  const geometry=new THREE.PlaneGeometry(width,height??width/asset.aspect);
  const object=new THREE.Mesh(geometry,asset.material);
  object.userData.ownedGeometry=true;
  return object;
}
