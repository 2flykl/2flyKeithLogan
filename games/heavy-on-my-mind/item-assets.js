import * as T from './vendor/three.module.min.js';

export const ITEM_SHEET_URL='assets/belongings-atlas.png';
export const ATLAS_COLUMNS=4,ATLAS_ROWS=3;
export const ITEM_ART={Trophy:{cell:0,size:1.4,url:'assets/trophy-v1.png'},Guitar:{cell:0,size:1.55,url:'assets/guitar-v1.png'},'Random box':{cell:0,size:1.5,url:'assets/box-v1.png'},'Duffel bag':{cell:0,size:1.4,url:'assets/bag-v1.png'},'Teal sneakers':{cell:0,size:1.3,url:'assets/shoes-v1.png'},
  Keys:{cell:0,size:.92},Wallet:{cell:1,size:.85},Clothes:{cell:2,size:1.05},Controller:{cell:3,size:1.08},
  Console:{cell:4,size:1.25},Stereo:{cell:5,size:1.32},Dumbbell:{cell:6,size:1.25},Subwoofer:{cell:7,size:1.25},
  FLOWERS:{cell:6,size:1.5,extra:true},CARD:{cell:9,size:1.05},GIFT:{cell:5,size:1.4,extra:true},HEART:{cell:11,size:1.35},'Flat screen':{cell:0,size:1.9,extra:true},Laptop:{cell:1,size:1.4,extra:true},Sneakers:{cell:2,size:1.2,extra:true},'Vinyl Records':{cell:3,size:1.3,extra:true},Basketball:{cell:4,size:1.15,extra:true}
};
export function atlasFrame(name){const {cell}=ITEM_ART[name];return {col:cell%ATLAS_COLUMNS,row:Math.floor(cell/ATLAS_COLUMNS)};}
export function createItemAssets(){
  const materials=new Map(),maps=[];
  const sheet=new T.TextureLoader().load(ITEM_SHEET_URL,()=>{for(const map of maps)map.needsUpdate=true;document.getElementById('game').dataset.itemArt='loaded';},undefined,()=>{document.getElementById('game').dataset.itemArt='error';});
  sheet.colorSpace=T.SRGBColorSpace;sheet.minFilter=T.LinearFilter;sheet.magFilter=T.LinearFilter;sheet.generateMipmaps=false;
  const extraSheet=new T.TextureLoader().load('assets/extra-atlas.png',()=>{for(const map of maps)map.needsUpdate=true;});extraSheet.colorSpace=T.SRGBColorSpace;extraSheet.minFilter=T.LinearFilter;extraSheet.magFilter=T.LinearFilter;extraSheet.generateMipmaps=false;
  function styleIcon(icon,name){if(ITEM_ART[name].url){icon.style.backgroundImage=`url(${ITEM_ART[name].url})`;icon.style.backgroundSize="contain";icon.style.backgroundPosition="center";return;}const frame=atlasFrame(name),extra=ITEM_ART[name].extra;icon.style.backgroundImage=`url(${extra?'assets/extra-atlas.png':ITEM_SHEET_URL})`;icon.style.backgroundSize=extra?'400% 200%':'400% 300%';icon.style.backgroundPosition=`${frame.col*100/3}% ${frame.row*(extra?100:50)}%`;}
  function sprite(name){const art=ITEM_ART[name],{col,row}=atlasFrame(name);if(art.url&&!materials.has(name)){const map=new T.TextureLoader().load(art.url);map.colorSpace=T.SRGBColorSpace;materials.set(name,new T.SpriteMaterial({map,transparent:true,alphaTest:.025,depthWrite:false,toneMapped:false}));}if(!materials.has(name)){const rows=art.extra?2:3,map=(art.extra?extraSheet:sheet).clone();map.repeat.set(1/4,1/rows);map.offset.set(col/4,1-(row+1)/rows);map.needsUpdate=true;maps.push(map);materials.set(name,new T.SpriteMaterial({map,transparent:true,alphaTest:.025,depthWrite:false,toneMapped:false}));}const icon=new T.Sprite(materials.get(name));icon.scale.set(art.size,art.size,1);return icon;}
  function itemMesh(def){const g=new T.Group(),icon=sprite(def.name);icon.scale.multiplyScalar(1.22);icon.position.y=ITEM_ART[def.name].size*.43;g.add(icon);g.userData.assetName=def.name;return g;}
  function makeLegend(items){const root=document.getElementById('item-legend');root.replaceChildren();for(const item of items){const row=document.createElement('div');row.className='legend-item';const icon=document.createElement('span'),frame=atlasFrame(item.name);icon.className='item-art';icon.setAttribute('role','img');icon.setAttribute('aria-label',item.name);styleIcon(icon,item.name);const name=document.createElement('span');name.textContent=item.name;const value=document.createElement('b');value.textContent=item.w+'w';row.append(icon,name,value);root.append(row);}}
  function makeInventory(items){const root=document.getElementById('inventory-art');root.replaceChildren();for(const item of items){const icon=document.createElement('span'),frame=atlasFrame(item.name);icon.className='item-art';icon.title=item.name;icon.setAttribute('aria-label',item.name);styleIcon(icon,item.name);root.append(icon);}}
  return {sprite,itemMesh,makeLegend,makeInventory};
}
