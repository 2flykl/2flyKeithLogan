import {BALCONY_Y} from './rooftop-route.js';
export {BALCONY_Y,ROOF_Y} from './rooftop-route.js';
export const questHint=state=>state==='seek'?'Lock the upper scale. Get the card across from her.':state==='cross'?'Card secured. Jump across to her balcony.':state==='recover'?'Recover the glowing card before the belongings burst!':state==='climb'?'Go left around the building. Lock the 2w service lift.':'Deliver the card.';
export const shouldKick=(state,p)=>state==='cross'&&!p.ground&&p.y>BALCONY_Y+.3&&p.x>.25;
export const roofHazard=n=>n%3===0?'roses':'heart';
