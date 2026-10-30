import {BALCONY_Y} from './rooftop-route.js';
import {objectiveReading} from './objectives.js';
export function scalePrompt(s){if(s.solved)return 'Locked · Jump on the right tray';if(objectiveReading(s).ready)return 'Press Down Arrow to Lock Scale';return s.type==='even'?'Balance both sides · 4w total':s.type==='exact'?'Needs exactly '+Math.abs(s.target)+'w more on '+(s.target<0?'right':'left'): 'Needs '+Math.abs(s.target)+'w or more on '+(s.type==='right'?'right':'left');}
export const openingFrame=age=>{const t=Math.max(0,Math.min(1,(age-2.8)/3.2)),e=t*t*(3-2*t);return {x:5.1+(-10-5.1)*e,y:BALCONY_Y-.1+(2.9-(BALCONY_Y-.1))*e,span:8+4*e,done:age>=6};};
export const laneLimit=floor=>floor===0?5:7;
