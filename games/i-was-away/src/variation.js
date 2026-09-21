// Shared recent-history selection. A burst never repeats an image; the previous
// burst is excluded whenever the category has enough approved photographs.
export class RecentPool {
 constructor(random=Math.random){this.random=random;this.history=[];this.used=new Set();}
 pick(items,count=1){
  if(items.length<count)throw Error('Not enough approved variants');
  const selected=[];
  for(let i=0;i<count;i++){
   let candidates=items.filter(x=>!selected.includes(x)&&!this.history.includes(x)&&!this.used.has(x));
   if(!candidates.length){candidates=items.filter(x=>!selected.includes(x)&&!this.used.has(x));}
   if(!candidates.length){this.used.clear();candidates=items.filter(x=>!selected.includes(x)&&!this.history.includes(x));}
   if(!candidates.length)candidates=items.filter(x=>!selected.includes(x)).sort((a,b)=>this.history.indexOf(a)-this.history.indexOf(b));
   const choice=candidates[Math.min(candidates.length-1,Math.floor(this.random()*candidates.length))];selected.push(choice);this.used.add(choice);
  }
  this.history=[...this.history.filter(x=>!selected.includes(x)),...selected].slice(-Math.max(1,Math.min(items.length-count,Math.max(count,2))));
  return selected;
 }
}
export class BurstPool {
 constructor(){this.pool=new RecentPool();this.slots=[new RecentPool(),new RecentPool(),new RecentPool()];}
 pick(items,phase){
  if(phase==='apex')return this.pool.pick(items,3);
  if(phase==='catch'){
   const shots=this.pool.pick(items,3);
   if(!shots.some(s=>['catch','secured','landing'].includes(s.category)))shots[2]=this.slots[2].pick(items.filter(s=>['catch','secured','landing'].includes(s.category)))[0];
   return shots;
  }
  const groups=phase==='release'?[['preparation'],['release'],['release','post_release']]:[['catch_ready','tracking'],['catch'],['secured','landing']];
  const selected=[];
  groups.forEach((categories,i)=>{const choices=items.filter(s=>categories.includes(s.category)&&!selected.includes(s));selected.push(this.slots[i].pick(choices)[0]);});
  return selected;
 }
}
