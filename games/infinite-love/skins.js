// Visuals only: this module never reads or changes the simulation or its random source.
export const SKINS = {
 original:{label:'PIXEL SANDS',name:'Original',palette:{}},
 album:{label:'ARTIFICIAL LOVE',name:'Artificial Love',palette:{
  '#100821':'#100606','#715096':'#a94c49','#694290':'#713632','#29133b':'#321310',
  '#ffd184':'#ffd1a4','#f77da4':'#ff6866','#bc648c':'#ad3838','#e7b2fa':'#ffaaa0',
  '#bc9adb':'#d78b80','#bda2d8':'#c58f88','#d9b7f5':'#ffd0c3','#ecdcff':'#ffe6d6',
  '#f4c878':'#ffc38c','#e4cbfb':'#ffd6ca','#c3a5d5':'#dba098','#ac8fcb':'#d99a8b',
  '#bba8d1':'#d8aaa0','#3f2854':'#51231f','#a266d5':'#db5957','#9fded9':'#eac2aa',
  '#b7efff':'#ffd5c6','#c1efff':'#f6cbbd','#bb99df':'#e9a9a0','#a9e8e0':'#f5c8ad',
  '#59304a':'#57201d','#7f4352':'#9b4836','#321d34':'#190b0a','#f5ba74':'#f4bb96',
  '#ffc874':'#ffb071','#ffe4a1':'#ffe0b6','#e9a43b':'#d67b4d','#ffdc72':'#ffcd92',
  '#f091bd':'#ff9c8b','#d978aa':'#ef7b70','#95c9ce':'#e2ad9e','#8de1dc':'#c98c7f'
 }},
 night:{label:'STARRY NIGHT',name:'Starry Night',palette:{
  '#100821':'#030b20','#715096':'#4e719b','#694290':'#365f84','#29133b':'#102743',
  '#ffd184':'#e6edff','#f77da4':'#9eeaff','#bc648c':'#4f96bf','#e7b2fa':'#b4dfff',
  '#bc9adb':'#7eaaca','#bda2d8':'#9bb9de','#d9b7f5':'#c7e5ff','#ecdcff':'#dcf4ff',
  '#f4c878':'#c5e1ff','#e4cbfb':'#d3eaff','#c3a5d5':'#94b7d7','#ac8fcb':'#89abce',
  '#bba8d1':'#a4bfdc','#3f2854':'#203a59','#a266d5':'#7ba9de','#9fded9':'#b5edf4',
  '#bb99df':'#a5d4ec','#59304a':'#23405b','#7f4352':'#4b7296','#321d34':'#0c1b30',
  '#f5ba74':'#bdd8f0','#d68a5c':'#799ac2','#e6a147':'#b0cbfa','#b97a36':'#7d9cc9',
  '#ffc874':'#d1dfff','#ffe4a1':'#f5edcc','#e9a43b':'#9cbbef','#ffdc72':'#b9e8fa',
  '#f091bd':'#f5b2d9','#d978aa':'#b7a1e3','#95c9ce':'#a4cde8'
 }}
};
export function colorForSkin(id,value){
 if(typeof value!=='string')return value;
 const base=value.slice(0,7),mapped=SKINS[id]?.palette[base];return mapped?mapped+value.slice(7):value;
}
export function createSkinSystem({ctx,original,reduce=false}){
 let selected='original',clock=0,lastNow=0;
 const layer=()=>{const c=document.createElement('canvas');c.width=1050;c.height=800;return c;};
 const album=layer(),night=layer(),stars=[];
 let seed=824;const random=()=>{seed=seed*16807%2147483647;return seed/2147483647;};
 const art=new Image();
 function albumBackground(){
  const g=album.getContext('2d');g.fillStyle='#100605';g.fillRect(0,0,1050,800);
  const glow=g.createRadialGradient(650,370,10,600,390,600);glow.addColorStop(0,'#651c19');glow.addColorStop(1,'#100605');g.fillStyle=glow;g.fillRect(0,0,910,800);
  if(art.complete&&art.naturalWidth){g.imageSmoothingEnabled=true;g.drawImage(art,0,art.naturalHeight*.2,art.naturalWidth,art.naturalHeight*.8,0,72,910,728);}
  g.fillStyle='rgba(13,3,4,.55)';g.fillRect(0,0,910,800);
  const shade=g.createLinearGradient(0,0,0,800);shade.addColorStop(0,'#100605');shade.addColorStop(.15,'#100605aa');shade.addColorStop(.7,'#10060518');shade.addColorStop(1,'#100605b0');g.fillStyle=shade;g.fillRect(0,0,910,800);
  g.strokeStyle='#a24a3e55';g.lineWidth=1;g.strokeRect(7,7,896,786);
 }
 function nightBackground(){
  const g=night.getContext('2d'),sky=g.createLinearGradient(0,0,0,800);sky.addColorStop(0,'#020817');sky.addColorStop(.6,'#071c35');sky.addColorStop(1,'#07101f');g.fillStyle=sky;g.fillRect(0,0,1050,800);
  for(let i=0;i<14;i++){const x=100+i*60,y=540-i*27,r=180;const haze=g.createRadialGradient(x,y,0,x,y,r);haze.addColorStop(0,i%2?'#24477b18':'#386c8112');haze.addColorStop(1,'#10274900');g.fillStyle=haze;g.fillRect(x-r,y-r,2*r,2*r);}
  for(let i=0;i<300;i++){const x=10+random()*890,y=16+random()*745,size=random()>.91?1.8:.8;g.fillStyle=['#bddef28a','#88a5d077','#f6ebcf99'][i%3];g.fillRect(x,y,size,size);if(i<40)stars.push({x,y,phase:random()*6.28,size});}
  // A restrained moon and an infinity constellation sit behind the sand.
  const moon=g.createRadialGradient(780,175,0,780,175,65);moon.addColorStop(0,'#bbdcf01c');moon.addColorStop(1,'#a9d7ff00');g.fillStyle=moon;g.fillRect(710,105,140,140);
  g.fillStyle='#9dbbd65c';g.beginPath();g.arc(780,175,18,0,Math.PI*2);g.fill();g.fillStyle='#081c32';g.beginPath();g.arc(787,169,17,0,Math.PI*2);g.fill();
  g.strokeStyle='#8ebde025';g.lineWidth=.7;g.beginPath();for(let i=0;i<=40;i++){const a=i/40*Math.PI*2,x=440+Math.cos(a)*94,y=420+Math.sin(2*a)*31;i?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2;g.fillStyle='#c1e4ff88';g.fillRect(440+Math.cos(a)*94,420+Math.sin(2*a)*31,2,2);}
  for(let layer=0;layer<2;layer++){g.fillStyle=layer?'#030b15':'#09192a';g.beginPath();g.moveTo(0,800);for(let x=0;x<=910;x+=8)g.lineTo(x,680+layer*57+Math.sin(x*.014+layer)*22+Math.sin(x*.037)*13);g.lineTo(910,800);g.fill();}
 }
 albumBackground();nightBackground();art.onload=albumBackground;art.src='assets/artificial-love-skin.png';
 const buttons=[...document.querySelectorAll('[data-skin-choice]')];
 function select(id,persist=true){
  const next=Object.hasOwn(SKINS,id)?id:'original';if(next!==selected)clock=0;selected=next;document.body.dataset.skin=selected;
  for(const b of buttons)b.setAttribute('aria-pressed',String(b.dataset.skinChoice===selected));
  if(persist)try{localStorage.setItem('infinite-love-skin',selected);}catch{}
 }
 for(const b of buttons)b.addEventListener('click',e=>{select(b.dataset.skinChoice);if(e.detail)b.blur();});
 let saved;try{saved=localStorage.getItem('infinite-love-skin');}catch{}select(saved||'original',false);
 return {
  get id(){return selected;},get label(){return SKINS[selected].label;},select,
  color:value=>colorForSkin(selected,value),
  piece(type,fallback){return selected==='original'?fallback:({album:{tray:'#f3c5a2',ramp:'#d77e76',seesaw:'#b88765'},night:{tray:'#c9dded',ramp:'#91bde3',seesaw:'#9b99ca'}}[selected][type]||fallback);},
  get bucketFill(){return selected==='album'?'rgba(255,186,160,.12)':'rgba(161,226,248,.16)';},
  drawBackground(now,state){
   const dt=lastNow?Math.min(.1,(now-lastNow)/1000):0;lastNow=now;if(state!=='paused'&&state!=='lost'&&state!=='won')clock+=dt;
   ctx.drawImage(selected==='album'?album:selected==='night'?night:original,0,0);
   if(selected!=='night'||reduce)return;
   ctx.save();ctx.beginPath();ctx.rect(0,0,910,800);ctx.clip();
   for(const star of stars){ctx.globalAlpha=.12+.35*(.5+.5*Math.sin(clock*.8+star.phase));ctx.fillStyle='#e2f2ff';ctx.fillRect(star.x,star.y,star.size+1,star.size+1);}
   for(let i=0;i<2;i++){
    const period=i?11:7,elapsed=clock+i*4.2,cycle=Math.floor(elapsed/period),t=elapsed%period;
    if(t>1.2)continue;
    const x=100+(cycle*137+i*220)%380+t*380,y=80+(cycle%3)*70+t*160;
    ctx.globalAlpha=Math.sin(t/1.2*Math.PI)*.7;
    const trail=ctx.createLinearGradient(x-110,y-46,x,y);trail.addColorStop(0,'#99cfff00');trail.addColorStop(1,'#def4ff');ctx.strokeStyle=trail;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x-110,y-46);ctx.lineTo(x,y);ctx.stroke();ctx.fillStyle='#f3fbff';ctx.fillRect(x-1,y-1,2,2);
   }
   ctx.restore();
  }
 };
}
