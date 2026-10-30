export const ITEMS=[{name:'Keys',w:1,fuse:30,color:0xe8c77c},{name:'Wallet',w:1,fuse:24,color:0xb47759},{name:'Clothes',w:2,fuse:26,color:0x71a5b1},{name:'Controller',w:2,fuse:14,color:0xb5a2ce},{name:'Console',w:3,fuse:22,color:0xe3dbc7},{name:'Stereo',w:4,fuse:18,color:0x485267},{name:'Dumbbell',w:5,fuse:28,color:0x69758a},{name:'Subwoofer',w:6,fuse:12,color:0x343246},{name:'Flat screen',w:6,fuse:20},{name:'Laptop',w:3,fuse:19},{name:'Sneakers',w:2,fuse:25},{name:'Vinyl Records',w:4,fuse:23},{name:'Basketball',w:2,fuse:17},{name:'Trophy',w:3,fuse:22},{name:'Guitar',w:4,fuse:22},{name:'Random box',w:5,fuse:22},{name:'Duffel bag',w:3,fuse:22},{name:'Teal sneakers',w:2,fuse:22}];
export const LEVELS=['Sidewalk','Retaining garden','Garage roof','Balcony','Upper landing','Front-door porch'];
export const canCarry=(bag,item)=>bag.length<2&&!bag.some(i=>i.w>=3)&&(item.w<3||bag.length===0);
export const heft=item=>item.w<=2?'LIGHT':item.w<=4?'MEDIUM':'HEAVY';
export const difficultyFor=floor=>{const stage=Math.max(0,Math.min(4,floor));return {fuseFactor:1-stage*.04,heartScale:1+stage*.08,hazardInterval:Math.max(3.6,5.8-stage*.45)};};
export const createItem=(def,floor=0)=>{const fuse=def.remaining===undefined?Math.round((def.w<=2?13:def.w<=4?11:10)*difficultyFor(floor).fuseFactor):def.fuse;return {...def,fuse,remaining:def.remaining??fuse,armed:def.armed??true};};
export function tickFuse(item,dt){if(item.armed){item.remaining=Math.max(0,item.remaining-dt);item.spillGrace=Math.max(0,(item.spillGrace||0)-dt);}return item.armed&&item.remaining<=0&&!(item.spillGrace>0);}
export function defuse(item){return {...item,armed:false};}
export function frameDelta(elapsed,active){return active?Math.max(0,Math.min(elapsed,.05)):0;}
export function hazardHits(hazard,player){const size=hazard.size??1,radius=(hazard.kind==='shard'?.34:.7)*size;return (hazard.kind==='heart'||hazard.kind==='shard'||hazard.kind==='roses')&&Math.abs(hazard.x-player.x)<radius&&hazard.y>player.y-.2*size&&hazard.y<player.y+1.8+.3*(size-1);}
export const facingAlongLane=(velocity,previousYaw)=>Math.abs(velocity)>.15?Math.sign(velocity)*Math.PI/2:previousYaw;
export function turnToward(current,target,dt){const delta=Math.atan2(Math.sin(target-current),Math.cos(target-current));return current+delta*(1-Math.exp(-14*dt));}
export const endingFor=n=>n===3?'balanced':n>0?'listens':'late';
export const EVENTS=new EventTarget();
export function emit(type,detail={}){EVENTS.dispatchEvent(new CustomEvent(type,{detail}));}

export const GIFT_FUSE=3;
export function advanceRoses(o,dt){o.x+=o.vx*dt;o.spin=(o.spin||0)+dt*2.4;return Math.abs(o.x)>15;}
