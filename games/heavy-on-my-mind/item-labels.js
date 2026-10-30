const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function layoutItemLabels(items,width,height,obstacles=[]){
 const placed=[],result=[];const w=92,h=32;
 for(const item of [...items].sort((a,b)=>a.priority-b.priority)){
  const x=clamp(item.x-w/2,4,Math.max(4,width-w-4)),baseY=clamp(item.y-h-7,4,Math.max(4,height-h-4));
  const candidates=[];for(const dy of[0,-36,-72,-108,36,72])for(const dx of[0,-98,98])candidates.push({x:clamp(x+dx,4,Math.max(4,width-w-4)),y:clamp(baseY+dy,4,Math.max(4,height-h-4)),w,h});
  const blocked=[...placed,...obstacles];let fit=candidates.find(r=>!blocked.some(b=>overlap(r,b)));
  if(!fit){const xs=[],ys=[];for(let x=4;x<=width-w-4;x+=16)xs.push(x);for(let y=4;y<=height-h-4;y+=8)ys.push(y);xs.sort((a,b)=>Math.abs(a-x)-Math.abs(b-x));ys.sort((a,b)=>Math.abs(a-baseY)-Math.abs(b-baseY));outer:for(const y of ys)for(const x of xs){const r={x,y,w,h};if(!blocked.some(b=>overlap(r,b))){fit=r;break outer;}}}
  if(!fit)continue;placed.push({...fit,x:fit.x-3,y:fit.y-3,w:w+6,h:h+6});result.push({...item,...fit,anchorX:item.x,anchorY:item.y});
 }
 return result;
}
export function createItemLabels(root){const nodes=new Map();let signature='';return function paint(labels){const ids=labels.map(l=>l.id).join(',');for(const l of labels){let n=nodes.get(l.id);if(!n){n=document.createElement('div');n.className='item-countdown';n._weight=document.createElement('span');n._weight.className='item-weight';n._time=document.createElement('b');n.append(n._weight,n._time);nodes.set(l.id,n);}const parts=l.text.split(' · ');n._weight.textContent=parts.length>1?parts[0]:'';n._weight.hidden=parts.length===1;n._time.textContent=parts.at(-1)==='BURST!'?'0s!':parts.at(-1);n._time.style.fontSize='22px';n.classList.toggle('urgent',l.urgent);n.style.transform=`translate(${Math.round(l.x)}px,${Math.round(l.y)}px)`;const dx=l.anchorX-(l.x+46),dy=l.anchorY-(l.y+32);n.style.setProperty('--lead-length',Math.hypot(dx,dy)+'px');n.style.setProperty('--lead-angle',Math.atan2(dy,dx)+'rad');n.title=l.name;n.setAttribute('aria-label',`${l.name}: ${l.text}`);n.dataset.item=l.name;}
 if(ids!==signature){root.replaceChildren(...labels.map(l=>nodes.get(l.id)));signature=ids;const live=new Set(labels.map(l=>l.id));for(const id of nodes.keys())if(!live.has(id))nodes.delete(id);}
 };}

export function labelObstacle(points,width,height,pad=4){const xs=points.map(p=>p.x),ys=points.map(p=>p.y),x=Math.min(...xs)-pad,y=Math.min(...ys)-pad,w=Math.max(...xs)-x+pad,h=Math.max(...ys)-y+pad;return x<width&&x+w>0&&y<height&&y+h>0?{x,y,w,h}:null;}
