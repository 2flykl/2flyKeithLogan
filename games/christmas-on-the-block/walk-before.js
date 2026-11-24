/* Illustrated 2.5D scene: each transparent vector object has its own world anchor.
   Perspective projects positions, with uniform scaling and no background warping. */
const $=s=>document.querySelector(s),canvas=$('#world'),ctx=canvas.getContext('2d',{alpha:false});
let W=innerWidth,H=innerHeight,DPR=1,elapsed=0,last=performance.now(),z=0,playing=false,started=false,finished=false,stopIndex=0,atCover=false,hold=0,look=0,lookY=0,lookTarget=0,pitchTarget=0,duck=false,eye=1.72,lane=0,laneNow=0,drag=null,speed=5.8;
const assets={},sizes={},objects=[];const anchors={'cover-bench':.88,'cover-car':.86,'cover-bushes':.88,'cover-wall':.88,'cover-planter':.88,'winter-tree':.92,'fir':.92,'lamp':.945,'mailbox':.93,'gateway':.94};const loadNames=['house-cranberry','house-evergreen','house-honey','winter-tree','fir','lamp','cover-bench','cover-car','cover-bushes','cover-wall','cover-planter','gateway','player-gloves','star','mailbox','porch-gate','mitten-left-back','mitten-left-front','mitten-right-back','mitten-right-front','held-snowball','snowman-0','snowman-1','snowman-2','snowman-3','snow-bough','snow-bough-bare','winter-moon','santa-sleigh','flying-reindeer-0','flying-reindeer-1'];
const types=['adult-male','teen-male','adult-female','teen-female'],poses=['ready','windup','release','follow','duck','run','hit','fall'];for(let t of types)for(let p of poses){loadNames.push(t+'-'+p);anchors[t+'-'+p]=.86;}
// Restore the original illustrated people, not the replacement vector caricatures.
let loaded=0;const envReady=Promise.all(loadNames.filter(n=>!types.some(t=>n.startsWith(t+'-'))).map(name=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{sizes[name]=im.naturalWidth/im.naturalHeight;const cached=document.createElement('canvas');cached.width=Math.min(1800,im.naturalWidth*2);cached.height=Math.round(cached.width/sizes[name]);cached.getContext('2d').drawImage(im,0,0,cached.width,cached.height);assets[name]=cached;loaded++;resolve()};im.onerror=reject;im.src=`illustrated/${name}.svg`})));
const peopleReady=new Promise((resolve,reject)=>{const sheet=new Image();sheet.onload=()=>{const rows={'adult-male':0,'adult-female':1,'teen-female':2,'teen-male':3},cols={ready:0,windup:1,release:2,follow:3,duck:0,run:0,hit:3,fall:3};for(const t of types)for(const pose of poses){let name=t+'-'+pose,c=document.createElement('canvas'),sw=sheet.naturalWidth/4,sh=sheet.naturalHeight/4;c.width=sw;c.height=sh;c.getContext('2d').drawImage(sheet,cols[pose]*sw,rows[t]*sh,sw,sh,0,0,sw,sh);assets[name]=c;sizes[name]=sw/sh;anchors[name]=.975;}resolve()};sheet.onerror=reject;sheet.src='throws.png'});
// Dedicated, padded crops: kneeling and snow-covered resting poses use their own
// proportions; no rotated standing sprites or vertical sinking through the floor.
const stateCrops={
 'adult-male':{duck:[78,12,342,350],rest:[492,75,578,279]},
 'adult-female':{duck:[90,373,335,354],rest:[492,431,578,273]},
 'teen-female':{duck:[92,731,317,350],rest:[480,779,590,286]},
 'teen-male':{duck:[84,1090,355,350],rest:[476,1149,598,283]}
};
const statesReady=peopleReady.then(()=>new Promise((resolve,reject)=>{const sheet=new Image();sheet.onload=()=>{for(const type of types)for(const pose of ['duck']){const [x,y,w,h]=stateCrops[type][pose],name=type+'-'+pose,c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(sheet,x,y,w,h,0,0,w,h);assets[name]=c;sizes[name]=w/h;anchors[name]=.97;}resolve()};sheet.onerror=reject;sheet.src='character-states.png'}));
const knockoutCrops={
 'adult-male':[65,42,950,294],'adult-female':[40,437,1012,256],
 'teen-female':[100,741,870,354],'teen-male':[52,1152,990,274]
};
const knockoutReady=statesReady.then(()=>new Promise((resolve,reject)=>{const sheet=new Image();sheet.onload=()=>{for(const type of types){const [x,y,w,h]=knockoutCrops[type],name=type+'-rest',c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(sheet,x,y,w,h,0,0,w,h);assets[name]=c;sizes[name]=w/h;anchors[name]=.96;}resolve()};sheet.onerror=reject;sheet.src='knockout-states.png'}));
const runReady=new Promise((resolve,reject)=>{const sheet=new Image();sheet.onload=()=>{for(const [row,type]of ['teen-female','teen-male'].entries())for(let i=0;i<4;i++){const name=type+'-run'+i,c=document.createElement('canvas'),w=sheet.naturalWidth/4,h=sheet.naturalHeight/2;c.width=w;c.height=h;c.getContext('2d').drawImage(sheet,i*w,row*h,w,h,0,0,w,h);assets[name]=c;sizes[name]=w/h;anchors[name]=.965;}resolve()};sheet.onerror=reject;sheet.src='teen-running.png'});
const ready=Promise.all([envReady,knockoutReady,runReady]);
const stops=[{z:19,name:'The Lantern Bench',cover:'cover-bench',offset:-1.7,width:3.6,label:'Snow-covered park bench',note:'A pocket of warm light beside the footpath.',enemy:'Porch and garden gate ahead'},{z:45,name:'Cranberry Crescent',cover:'cover-car',offset:-4.6,playerOffset:-3.45,width:4.5,label:'Snow-covered car hood',note:'A curbside parking bay, clear of the walking route.',enemy:'Driveways and the far sidewalk'},{z:74,name:'Holly Crossing',cover:'cover-bushes',offset:2.15,width:3.9,label:'Rapid-fire snowball crossing',note:'Garden cover at the outside of the bend.',enemy:'Garden entrance and crossing path'},{z:104,name:'The Snow Fort',cover:'cover-wall',offset:-.5,width:3.4,label:'Sculpted snow wall',note:'An open courtyard with layered cover.',enemy:'Side walls and the open crossing'},{z:137,name:'Merriest Christmas Square',cover:'cover-planter',offset:1.4,width:4,label:'The growing snowman',note:'The neighborhood tree and final gathering place.',enemy:'Neighbors beside the square'}];
function route(q){return Math.sin(q/25)*8-Math.sin(q/12)*2.7}function derivative(q){return Math.cos(q/25)*8/25-Math.cos(q/12)*2.7/12}
function object(name,x,z,w,extra={}){objects.push({name,x:route(z)+x,z,w,...extra})}
// Architectural rhythm is broken by gardens, a parking bay and the final square.
for(let i=0;i<13;i++){let q=3+i*12;for(let side of [-1,1]){if(q>124)continue;if(side<0&&q>36&&q<57)continue;object(['house-cranberry','house-evergreen','house-honey'][(i+(side>0?1:0))%3],side*(10.5+(i%3)*.5),q,9.5,{mirror:side>0});object('winter-tree',side*7.4,q+5.3,5.4);if(i%2===0)object('mailbox',side*5.5,q+1,1.05)}}
for(let i=0;i<18;i++){let q=2+i*8.8;for(let side of [-1,1]){if(i%2===0)object('lamp',side*4.5,q,1.8,{glow:true});if(i%3!==1)object('fir',side*(14+(i%3)*2),q+6,5.4);if(i%3===1)object('cover-bushes',side*6.6,q+5,3.1)}}
stops.forEach((s,i)=>{object(s.cover,s.offset,s.z+2.8,s.width,{cover:true,stop:i});if(i===0){object('cover-bushes',-5.2,s.z+5,3.4);object('lamp',-4.3,s.z+1.2,1.9,{glow:true})}if(i===1){object('mailbox',-7,s.z+4,1.2);object('house-cranberry',-13,s.z+9,10)}if(i===2){object('cover-bench',-5.8,s.z+7,3.1);object('winter-tree',5.8,s.z+5,5.4)}if(i===3){object('cover-wall',-4,s.z+10,2.8);object('cover-wall',4.5,s.z+14,3.1)}if(i===4){object('cover-bench',-5.8,s.z+6,3.3);object('cover-bench',6,s.z+7,3.3)}});
object('gateway',0,128,9.8);object('fir',0,157,6);object('star',0,157,.85,{elevation:8.5});object('house-honey',-14,155,10);object('house-evergreen',14,156,10);object('fir',-9,159,6);object('fir',9,161,6);
let cam={x:0,z:0,y:1.72,yaw:0},f=700,horizon=0;
function project(x,y,zz){let dx=x-cam.x,dz=zz-cam.z;let co=Math.cos(cam.yaw),si=Math.sin(cam.yaw),depth=dz*co+dx*si;if(depth<.22)return null;return {x:W/2+(dx*co-dz*si)*f/depth,y:horizon+(cam.y-y)*f/depth,k:f/depth,depth}}
function poly(points,fill,stroke=null,width=1){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke()}}
function groundQuad(x1,z1,x2,z2,x3,z3,x4,z4,fill,stroke){let a=[[x1,z1],[x2,z2],[x3,z3],[x4,z4]].map(([x,z])=>project(x,0,z));if(a.every(Boolean))poly(a,fill,stroke)}
function circle(x,y,r,col){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=col;ctx.fill()}
function glow(x,y,r,col){let g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(255,198,120,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)}
function starTwinkle(i,t=elapsed){return .18+.82*Math.pow(.5+.5*Math.sin(t*(.65+i%7*.13)+i*2.4),5)}
function drawStars(){for(let i=0;i<104;i++){const x=((i*173.3-cam.yaw*W*.18)%(W+80)+W+80)%(W+80)-40,y=18+(i*71.7)%(H*.35),a=starTwinkle(i);circle(x,y,i%9===0?1.5:.65,`rgba(255,244,221,${a*.85})`);if(i%13===0&&a>.35){ctx.strokeStyle=`rgba(220,235,255,${a*.65})`;ctx.lineWidth=.65;const r=2.5+a*3;ctx.beginPath();ctx.moveTo(x-r,y);ctx.lineTo(x+r,y);ctx.moveTo(x,y-r);ctx.lineTo(x,y+r);ctx.stroke();}}}
function moonLayout(){return {x:W*.63-cam.yaw*W*.055,y:H*.145,r:Math.min(73,Math.max(38,H*.068))};}
function drawMoon(){const m=moonLayout();glow(m.x,m.y,m.r*3.5,'rgba(198,212,248,.13)');glow(m.x,m.y,m.r*1.55,'rgba(255,234,192,.19)');const im=assets['winter-moon'];if(im)ctx.drawImage(im,m.x-m.r*1.16,m.y-m.r*1.16,m.r*2.32,m.r*2.32);}
// Quiet, recognizable constellation shapes. Decorative connections, not a star chart.
const constellationShapes=[{x:.33,y:.075,points:[[0,0],[.045,.025],[.07,.07],[.11,.08],[.14,.035],[.10,.018],[.07,.07]],edges:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,2]]},{x:.08,y:.21,points:[[0,0],[.028,-.052],[.06,0],[.09,-.052],[.125,0]],edges:[[0,1],[1,2],[2,3],[3,4]]},{x:.78,y:.08,points:[[0,0],[.07,.01],[.028,.075],[.041,.081],[.054,.087],[.015,.15],[.08,.14]],edges:[[0,2],[1,4],[2,3],[3,4],[2,5],[4,6],[5,6]]}];
function drawConstellations(){ctx.save();for(let j=0;j<constellationShapes.length;j++){const c=constellationShapes[j],pts=c.points.map(p=>({x:(c.x+p[0])*W-cam.yaw*W*.07,y:(c.y+p[1])*H}));ctx.lineWidth=.7;ctx.strokeStyle='#c3d7ee35';ctx.beginPath();for(const [a,b]of c.edges){ctx.moveTo(pts[a].x,pts[a].y);ctx.lineTo(pts[b].x,pts[b].y);}ctx.stroke();for(let i=0;i<pts.length;i++){const p=pts[i],a=.55+starTwinkle(i+j*13)*.4;circle(p.x,p.y,1.3+(i%3)*.3,`rgba(245,239,223,${a})`);if(i===1){ctx.strokeStyle='#e3efff99';ctx.beginPath();ctx.moveTo(p.x-4,p.y);ctx.lineTo(p.x+4,p.y);ctx.moveTo(p.x,p.y-4);ctx.lineTo(p.x,p.y+4);ctx.stroke();}}}ctx.restore();}
function meteorState(t,index){const period=index?23:17,phase=(t+(index?9:0))%period;if(phase<3||phase>4.25)return null;return {p:(phase-3)/1.25,index};}
function drawShootingStars(){for(let i=0;i<2;i++){const m=meteorState(elapsed,i);if(!m)continue;const x=W*((i?.54:.18)+m.p*.27),y=H*((i?.04:.075)+m.p*.14),tail=Math.min(115,W*.12)*Math.min(1,m.p*6),a=Math.sin(m.p*Math.PI);ctx.save();ctx.globalAlpha=a;const g=ctx.createLinearGradient(x-tail,y-tail*.42,x,y);g.addColorStop(0,'#d1e9ff00');g.addColorStop(.7,'#c0d5ef88');g.addColorStop(1,'#fff4cf');ctx.strokeStyle=g;ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(x-tail,y-tail*.42);ctx.lineTo(x,y);ctx.stroke();circle(x,y,2,'#fff9e5');glow(x,y,8,'rgba(216,237,255,.35)');ctx.restore();}}
function sleighFlight(t){const phase=t%66;if(phase<4||phase>28)return null;const scale=Math.max(.48,Math.min(.88,W/1700)),span=560*scale;return {x:-span+(W+span*2)*(phase-4)/24,scale};}
function drawSantaFlight(){const flight=sleighFlight(elapsed);if(!flight||!assets['santa-sleigh'])return;const m=moonLayout(),s=flight.scale,x=flight.x,y=m.y+Math.sin(elapsed*.8)*2;ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.drawImage(assets['santa-sleigh'],0,-31,133,82);ctx.strokeStyle='#18233b';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(102,9);ctx.quadraticCurveTo(270,24,500,-3);ctx.stroke();for(let i=0;i<4;i++){const dx=152+i*92,dy=-38+Math.sin(elapsed*6-i*.9)*3;ctx.drawImage(assets['flying-reindeer-'+(Math.floor(elapsed*5+i*.6)%2)],dx,dy,108,61);}ctx.restore();}
function drawSky(){let sky=ctx.createLinearGradient(0,0,0,H*.63);sky.addColorStop(0,'#151e3d');sky.addColorStop(.34,'#3f4269');sky.addColorStop(.68,'#9c799e');sky.addColorStop(1,'#e4b5bd');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);drawStars();drawConstellations();drawMoon();drawShootingStars();drawSantaFlight();
 for(let i=0;i<3;i++){const cx=((i*.41*W+elapsed*(2+i))%(W*1.5))-W*.2,cy=H*(.12+i*.065);ctx.save();ctx.translate(cx,cy);ctx.scale(1,.12);let cloud=ctx.createRadialGradient(0,0,0,0,0,W*.3);cloud.addColorStop(0,'#dac4df0f');cloud.addColorStop(1,'#dac4df00');ctx.fillStyle=cloud;ctx.fillRect(-W*.3,-W*.3,W*.6,W*.6);ctx.restore();}
 ctx.fillStyle='#6e6e94';for(let i=0;i<30;i++){let x=(i*87-look*80)%(W+100),base=H*.51,height=35+(i%7)*13;ctx.beginPath();ctx.moveTo(x,base);ctx.quadraticCurveTo(x+14,base-height*.5,x+25,base-height);ctx.quadraticCurveTo(x+35,base-height*.5,x+55,base);ctx.fill()}
 let ground=ctx.createLinearGradient(0,H*.43,0,H);ground.addColorStop(0,'#d2c9df');ground.addColorStop(.4,'#ddd9ec');ground.addColorStop(1,'#a8b8d6');ctx.fillStyle=ground;ctx.fillRect(0,horizon,W,H-horizon);
}
function drawGround(){
 const pathSnow=ctx.createLinearGradient(0,horizon,0,H);pathSnow.addColorStop(0,'#d3cce2');pathSnow.addColorStop(.44,'#e9e3ee');pathSnow.addColorStop(1,'#c5cee5');
 for(let q=Math.ceil(z+105);q>z+.65;q-=1.5){let a=q,b=q-1.5;if(b<z+.4)continue;let xa=route(a),xb=route(b);groundQuad(xa-5.4,a,xa+5.4,a,xb+5.4,b,xb-5.4,b,'#c4c6df');groundQuad(xa-3.8,a,xa+3.8,a,xb+3.8,b,xb-3.8,b,pathSnow);for(let side of [-1,1]){groundQuad(xa+side*3.8,a,xa+side*4.02,a,xb+side*4.02,b,xb+side*3.8,b,'#f6f0f3');groundQuad(xa+side*4.02,a,xa+side*4.09,a,xb+side*4.09,b,xb+side*4.02,b,'#a8b5d2')}
 }
 const crossZ=stops[2].z+13,crossX=route(stops[2].z);groundQuad(crossX-17,crossZ+2,crossX+17,crossZ+2,crossX+17,crossZ-2,crossX-17,crossZ-2,'#c6cce0');groundQuad(crossX-17,crossZ+2,crossX+17,crossZ+2,crossX+17,crossZ+1.85,crossX-17,crossZ+1.85,'#f4eef4');
 // Bench paving pad, car parking bay, and garden approach are attached to world space.
 for(let s of stops){let cx=route(s.z+2.8)+s.offset,w=s.cover==='cover-car'?3.2:2.6;groundQuad(cx-w,s.z+7,cx+w,s.z+7,cx+w,s.z-2,cx-w,s.z-2,s.cover==='cover-car'?'#99a8c3':'#d0c7d7');if(s.cover==='cover-car'){for(let d of [-2.5,2.5]){let a=project(cx+d,0,s.z-1),b=project(cx+d,0,s.z+6);if(a&&b){ctx.strokeStyle='#ede8e6';ctx.lineWidth=Math.max(1,a.k*.03);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}}}
 for(let o of objects){if(!o.glow)continue;let p=project(o.x,.01,o.z);if(!p||p.depth>40)continue;ctx.save();ctx.translate(p.x,p.y);ctx.scale(1,.22);glow(0,0,p.k*2,'rgba(255,217,158,.25)');ctx.restore()}
 // Fine seams and overlapping lavender drifts add hand-drawn surface depth.
 for(let i=0;i<180;i++){let q=i*1.0;if(q<z+.8||q>z+65)continue;let p=project(route(q)+Math.sin(i*3.1)*3.1,0,q);if(!p)continue;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.sin(i)*.2);ctx.fillStyle=i%3?'#c8c9df66':'#f7f0f166';ctx.beginPath();ctx.ellipse(0,0,p.k*(.3+i%4*.13),p.k*.025,0,0,7);ctx.fill();ctx.restore()}
 for(let q=Math.ceil(z);q<z+37;q++){for(let side of [-1,1]){let p=project(route(q)+side*.21,.005,q);if(p){ctx.fillStyle='#afbad04f';ctx.beginPath();ctx.ellipse(p.x,p.y,p.k*.065,p.k*.026,-side*.25,0,7);ctx.fill()}}}
 for(let i=0;i<96;i++){const q=i*1.77;if(q<z+1||q>z+34)continue;const p=project(route(q)+Math.sin(i*2.39)*4.5,.012,q),tw=starTwinkle(i,elapsed*.7);if(p&&tw>.7){circle(p.x,p.y,Math.min(1.5,p.k*.014),`rgba(255,253,242,${(tw-.7)*1.8})`);}}

}
function drawObject(o){const im=assets[o.name];if(!im)return;let p=project(o.x,o.elevation||0,o.z);if(!p||p.depth>110)return;let width=p.k*o.w,height=width/sizes[o.name];if(p.x+width/2<-100||p.x-width/2>W+100)return;
 ctx.save();let haze=Math.min(.66,Math.max(0,(p.depth-28)/130));ctx.globalAlpha=(1-haze)*Math.max(0,Math.min(1,(110-p.depth)/25));
 if(!o.elevation){ctx.fillStyle='#52618724';ctx.beginPath();ctx.ellipse(p.x,p.y-height*.055,width*.38,height*.025,0,0,Math.PI*2);ctx.fill()}
 if(o.glow){glow(p.x,p.y-height*.72,width*.6,`rgba(255,190,107,${.12+.012*Math.sin(elapsed*1.3+o.z)+.006*Math.sin(elapsed*3.1+o.z)})`)}
 ctx.translate(p.x,p.y);
 if(o.character){const e=o.enemy,age=combatTime-e.hit;
 ctx.beginPath();ctx.rect(-width,-height*2,width*2,height*2.015);ctx.clip();
 
 if(o.pose==='hit'){ctx.translate(Math.sin(age*32)*width*.025,0);ctx.rotate(-.07*Math.sin(age*18));}
 if(o.pose==='fall'){ctx.translate(width*.06,0);ctx.rotate(o.scatter?o.enemy.dir*Math.min(1,(age-.2)/.28)*Math.PI*1.1:Math.min(.35,(age-.2)*1.2));}
 if(o.pose==='ready')ctx.translate(0,Math.sin(elapsed*2.7+e.id)*height*.006);
 }
 if(o.name==='star'){const pulse=.7+.3*Math.sin(elapsed*2);ctx.globalAlpha*=pulse;glow(0,-height*.5,width*1.1,'rgba(255,220,145,.28)');}
 if(o.mirror)ctx.scale(-1,1);
 if(o.character&&!o.enemy.down&&['ready','duck'].includes(o.pose)&&o.enemy.crouch>.02&&o.enemy.crouch<.98){const alpha=ctx.globalAlpha;for(const pose of ['ready','duck']){const name=o.enemy.type+'-'+pose,w=p.k*enemyWidth(o.enemy,pose),h=w/sizes[name];ctx.globalAlpha=alpha*(pose==='duck'?o.enemy.crouch:1-o.enemy.crouch);ctx.drawImage(assets[name],-w/2,-h*anchors[name],w,h);}}
 else ctx.drawImage(im,-width/2,-height*(anchors[o.name]||.95),width,height);ctx.restore();
 if(o.character&&!o.enemy.down&&o.emerge>=1){let e=o.enemy,r=Math.max(2,Math.min(4,p.k*.035)),yy=p.y-height*1.01;for(let i=0;i<e.maxHp;i++){circle(p.x+(i-(e.maxHp-1)/2)*(r*3.4),yy,r+1,'#243e4eaa');circle(p.x+(i-(e.maxHp-1)/2)*(r*3.4),yy,r,i<e.hp?'#f4d696':'#708699');}}

}
// Depth-sorted world flakes pass behind houses, people and cover. Sparse near
// flakes provide parallax without resembling the large incoming snowballs.
let windDrift=0;
const particles=Array.from({length:2200},(_,i)=>({x:(i*.6180339)%1,y:(i*.731)%1,s:.4+(i%7)/7,d:1+i%4,z:(i*13.739)%245}));
function weatherProgress(){return Math.max(0,Math.min(1,z/137))}
function weatherState(){const progress=weatherProgress(),build=progress*progress*(3-2*progress),gust=Math.pow(Math.max(0,Math.sin(elapsed*.22-.7)),3)*(.2+.8*build);return {progress,build,gust,count:260+build*1640+gust*240,nearCount:32+build*260+gust*70,wind:.22+build*.45+gust*1.25};}
function weatherObjects(){const w=weatherState(),flakes=[];for(let i=0;i<particles.length;i++){const p=particles[i],alpha=Math.min(1,Math.max(0,(w.count-i)/18));if(!alpha||p.z<z+1||p.z>z+80)continue;const x=route(p.z)+((p.x*30+windDrift*p.s)%30)-15,y=((p.y*9-elapsed*(.26+p.s*.23))%9+9)%9;flakes.push({weather:true,x,z:p.z,y,r:.012+p.d*.005,alpha:alpha*(.39+p.s*.32),seed:i});}return flakes;}
function drawWorldFlake(o){const p=project(o.x,o.y,o.z);if(!p||p.x<0||p.x>W||p.y<0||p.y>H)return;const r=Math.min(2.7,Math.max(.45,p.k*o.r));circle(p.x,p.y,r,`rgba(249,250,255,${o.alpha*Math.min(1,p.depth/3)})`);}
function drawGroundSqualls(){const w=weatherState();if(w.gust<.015)return;ctx.save();for(let i=0;i<5;i++){const zz=z+5+i*8,x=route(zz)+Math.sin(elapsed*.36+i*1.8)*3.8,p=project(x,.09,zz);if(!p)continue;ctx.save();ctx.translate(p.x,p.y);ctx.scale(1,.10);let g=ctx.createRadialGradient(0,0,0,0,0,p.k*3.2);g.addColorStop(0,`rgba(243,248,255,${w.gust*.16})`);g.addColorStop(1,'#f3f8ff00');ctx.fillStyle=g;ctx.fillRect(-p.k*3.2,-p.k*3.2,p.k*6.4,p.k*6.4);ctx.restore();}ctx.restore();}
function snowfall(){const w=weatherState(),area=Math.max(.48,Math.min(1.25,W*H/1200000)),count=w.nearCount*area;ctx.save();for(let i=0;i<Math.ceil(count);i++){const p=particles[i],fade=Math.min(1,count-i),x=((p.x*W+Math.sin(elapsed*.7+i)*22+windDrift*64*p.s-cam.x*9)%(W+60)+W+60)%(W+60)-30,y=(p.y*H+elapsed*(30+p.s*36)+z*p.s*7)%(H+30)-15,r=.65+p.d*.5,a=(.26+p.s*.33)*fade;circle(x,y,r,`rgba(255,251,246,${a})`);if(i%13===0){ctx.strokeStyle=`rgba(242,249,255,${a*.75})`;ctx.lineWidth=.7;ctx.beginPath();for(let arm=0;arm<3;arm++){const ang=arm*Math.PI/3+elapsed*.1,dx=Math.cos(ang)*r*1.65,dy=Math.sin(ang)*r*1.65;ctx.moveTo(x-dx,y-dy);ctx.lineTo(x+dx,y+dy);}ctx.stroke();}if(w.gust>.2&&i%3===0){ctx.strokeStyle=`rgba(240,248,255,${w.gust*.22*fade})`;ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-8*w.gust,y-3);ctx.stroke();}}
 if(w.gust>.02){for(let side of [0,1]){const x=side*W,grad=ctx.createRadialGradient(x,H*.67,0,x,H*.67,W*.42);grad.addColorStop(0,`rgba(229,237,249,${w.gust*.11})`);grad.addColorStop(1,'#e5edf900');ctx.fillStyle=grad;ctx.fillRect(side?W*.58:0,H*.2,W*.42,H*.8);}}ctx.restore();
}
function cameraOffset(){let offset=0;for(let s of stops){let d=z-s.z;if(d>=-6&&d<=0){let t=(d+6)/6;t=t*t*(3-2*t);offset=(s.playerOffset??s.offset)*t}else if(d>0&&d<3){let t=d/3;t=t*t*(3-2*t);let bypass=s.offset>0?-2.5:2.5;offset=(s.playerOffset??s.offset)*(1-t)+bypass*t}else if(d>=3&&d<9){let t=(d-3)/6;t=t*t*(3-2*t);offset=(s.offset>0?-2.5:2.5)*(1-t)}}return offset}
function resize(){W=innerWidth;H=innerHeight;DPR=Math.min(devicePixelRatio,2);canvas.width=W*DPR;canvas.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);f=Math.max(W*.65,Math.min(H*.8,W*.92))}addEventListener('resize',resize);resize();
const music=new Audio('soundtrack.mp3');music.loop=true;music.volume=.45;let musicWanted=true;
function musicPlay(){if(musicWanted)music.play().catch(()=>{$('#music').textContent='♫ Tap for music'})}
function updateUI(){$('#scoreHud').textContent=`${score} PTS · ♥ ${hp} / ${MAX_HP}`;let s=stops[stopIndex];$('#zoneName').textContent=s.name;$('#chapter').textContent=`${String(stopIndex+1).padStart(2,'0')} / 05`;$('#coverName').textContent=s.label;$('#locationNote').textContent=atCover?(stopIndex===2?'Hold click to throw rapidly. One hit sends each running teen tumbling!':stopIndex===4?'Direct hits grow the snowman. Hit both overhead snow loads twice to bury the opponents.':'Click or hold to throw. Hold Space or ↓ to block incoming snowballs.'):'Hold ← or → to dodge smoothly. Space or ↓ ducks.';$('#status').textContent=finished?(hp<=0?'SNOWED OUT':'ROUTE CLEARED'):atCover?'SNOWBALL FIGHT':'DODGE RUN';$('#coverPanel').classList.toggle('at-cover',atCover);$('#next').textContent=finished?'Walk again ↻':atCover?(enemies.filter(e=>e.stop===stopIndex).every(e=>e.down)?'Continue trot →':'Clear this cover'):'Trotting →';$('#pause').textContent=finished?'Round over':playing?'Ⅱ Pause':'▶ Resume';$('#pause').disabled=finished;$('#result').hidden=!finished;$('#resultTitle').textContent=hp<=0?'Snowed out!':'Merriest Christmas!';$('#resultNote').textContent=hp<=0?'The neighborhood got you. Warm up and take another run.':'Every cover cleared. You made it through the whole block!';$('#resultScore').textContent=score+' points';$('#progress').style.width=`${Math.min(100,z/137*100)}%`;$('#duck').classList.toggle('active',duck);$('#mode').textContent=finished?'':atCover?(duck?'IN COVER':stopIndex===2?'HOLD TO THROW · ONE HIT SCATTERS':stopIndex===4?'AIM AT THE GOLD RINGS ABOVE THE SNOWMAN':'CLICK OR HOLD TO THROW'):'DODGE ONLY · HOLD ← OR → TO MOVE';$('#miniDot').setAttribute('cx',50+route(z)*2);$('#miniDot').setAttribute('cy',160-z)}
function next(){handCycle=null;pendingThrow=null;firing=false;playerFlights=[];if(finished){resetCombat();eye=1.72;laneNow=0;look=lookY=pitchTarget=0;z=0;stopIndex=0;finished=false;atCover=false;hold=0;playing=true;lane=0;lateralVelocity=0;lookTarget=0}else if(atCover){if(!enemies.filter(e=>e.stop===stopIndex).every(e=>e.down))return;if(stopIndex===4){finished=true;playing=false}else{stopIndex++;shots=[];spawnClock=.8;atCover=false;hold=0;playing=true;lane=0;lateralVelocity=0;lookTarget=0;pitchTarget=0}}else{speed=5.8;playing=true}musicPlay();updateUI()}
$('#begin').onclick=()=>{last=performance.now();started=playing=true;$('#intro').classList.add('hidden');musicPlay();updateUI()};$('#next').onclick=next;$('#replay').onclick=next;
$('#pause').onclick=()=>{if(!started||finished)return;playing=!playing;if(playing)musicPlay();updateUI()};$('#music').onclick=()=>{musicWanted=!musicWanted;$('#music').textContent=musicWanted?'♫ Music on':'♫ Music off';if(musicWanted)musicPlay();else music.pause()};
const heldKeys=new Set();let touchMove=0,touchDuck=false,lateralVelocity=0;
function syncDuck(){duck=touchDuck||heldKeys.has('ArrowDown')||heldKeys.has('Space')}
function advanceLateral(dt){syncDuck();if(!started||!playing||finished)return;let input=(heldKeys.has('ArrowRight')?1:0)-(heldKeys.has('ArrowLeft')?1:0)+touchMove;input=Math.max(-1,Math.min(1,input));lateralVelocity+=(input*1.7-lateralVelocity)*(1-Math.exp(-dt*14));lane=Math.max(-1,Math.min(1,lane+lateralVelocity*dt));}
for(let [id,d]of [['left',-1],['right',1]]){let b=$('#'+id);b.onpointerdown=e=>{touchMove=d;b.setPointerCapture(e.pointerId)};b.onpointerup=b.onpointercancel=()=>touchMove=0;}
$('#duck').onpointerdown=e=>{touchDuck=true;syncDuck();e.currentTarget.setPointerCapture(e.pointerId);updateUI()};$('#duck').onpointerup=$('#duck').onpointercancel=()=>{touchDuck=false;syncDuck();updateUI()};
$('#resetLook').onclick=()=>{lookTarget=pitchTarget=0};$('#routeToggle').onclick=()=>{$('#routePanel').classList.toggle('open');$('#routeToggle').setAttribute('aria-expanded',$('#routePanel').classList.contains('open'))};
$('#auto').onchange=e=>{if(!e.target.checked)hold=0};
// Aim stays at the real pointer position. No pointer lock, recentering, or
// mouse-drag camera rotation sharing the firing gesture.
function pointAim(e){aim.x=e.clientX;aim.y=e.clientY;const r=$('#reticle');r.style.left=e.clientX+'px';r.style.top=e.clientY+'px';r.style.visibility=started&&!finished?'visible':'hidden';}
canvas.onpointermove=pointAim;canvas.onpointerenter=pointAim;
canvas.onpointerleave=()=>{$('#reticle').style.visibility='hidden'};
canvas.onpointerdown=e=>{if(e.button>0)return;pointAim(e);firing=true;throwAt(e.clientX,e.clientY)};
canvas.onpointerup=canvas.onpointercancel=()=>{firing=false};addEventListener('pointerup',()=>{firing=false});
addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowDown','Space'].includes(e.code)){e.preventDefault();heldKeys.add(e.code);syncDuck()}if(e.code==='KeyP'&&!e.repeat)$('#pause').click();if(e.code==='Enter'&&!e.repeat&&started)next();if(e.code==='Escape')lookTarget=pitchTarget=0});
addEventListener('keyup',e=>{heldKeys.delete(e.code);syncDuck()});addEventListener('blur',()=>{firing=false;heldKeys.clear();touchMove=0;touchDuck=false;lateralVelocity=0;syncDuck();drag=null;if(started){playing=false;music.pause();updateUI()}});
// Keep each actor and its cover on the same ground plane. Porch guests enter from
// the house side of their garden gate, then return to that fixed fighting position.
const enemies=[];
for(let i=0;i<5;i++)for(let j=0;j<(i===2?12:4);j++){
 const stop=stops[i],zz=stop.z+(i===2?11+(j%3)*1.6:i===4?13.7+(j%2)*.5:[11,12.8,17,18.5][j]),xx=route(stop.z)+(i===4?stop.offset+(j<2?-1:1)*.8:i===2?(j%2?-12:12):[-2.8,2.8,-6.4,6.4][j]),type=i===2?(j%2?'teen-male':'teen-female'):types[(i+j)%4],maxHp=i===2?1:type.includes('teen')?2:3;
 const e={id:i*20+j,stop:i,type,x:xx,z:zz,w:type.includes('teen')?2.05:2.3,maxHp,hp:maxHp,down:false,hit:-10,release:-10,coverUntil:0,crouch:0,rect:null,house:j>1&&i!==2&&i!==4,crossing:i===2,runIndex:j,dir:j%2?1:-1,runVisible:i!==2,scatterX:0};enemies.push(e);
 if(i!==2&&i!==4)objects.push({name:j>1?'cover-planter':'cover-wall',x:xx,z:zz-.38,w:j>1?2.0:1.65,enemyCover:e.id});
 if(j>1&&i!==2&&i!==4)objects.push({name:'porch-gate',x:xx+(j===2?-1.9:1.9),z:zz+.8,w:2.3});
}
for(const side of [-1,1])objects.push({name:'winter-tree',x:route(stops[4].z)+stops[4].offset+side*5.8,z:stops[4].z+16,w:7.3});
const MAX_HP=12;
let hp=MAX_HP,score=0,shots=[],bursts=[],coverBursts=[],spawnClock=1,shotNumber=0,hitFlash=0,throwFlash=0,cooldown=0,combatTime=0,invulnerable=0,duckDuration=0,coverShake=0;
function resetCombat(){resetSpecials();hp=MAX_HP;score=0;shots=[];bursts=[];coverBursts=[];spawnClock=1;shotNumber=0;hitFlash=throwFlash=cooldown=invulnerable=combatTime=duckDuration=coverShake=0;heldKeys.clear();touchDuck=false;duck=false;enemies.forEach(e=>{e.hp=e.maxHp;e.down=false;e.hit=-10;e.release=-10;e.coverUntil=0;e.crouch=0;e.rect=null;e.runVisible=!e.crossing;e.scatterX=0});}
function enemyHidden(e){if(e.crossing)return false;if(e.stop===4)return true;return combatTime<e.coverUntil||((combatTime+e.id*.87)%6.6)>4.95;}
function enemyWidth(e,pose){return pose==='rest'?e.w*1.13:pose==='duck'?e.w*.64:e.w;}
function enemyObjects(){return enemies.filter(e=>e.z>z+.5&&e.z<z+105&&(!e.crossing||e.runVisible||e.down)).map(e=>{
 const age=combatTime-e.release,react=combatTime-e.hit,crouched=e.crouch>.5;
 const pose=e.crossing&&!e.down?'run'+(Math.floor(combatTime*11+e.id)%4):e.down?(react<.2?'hit':react<(e.crossing?.85:.48)?'fall':'rest'):react<.18?'hit':crouched?'duck':age<0&&age>-.55?'windup':age<.16&&age>=0?'release':age<.5&&age>=0?'follow':'ready';
 const width=enemyWidth(e,pose),restZ=e.down?e.z-Math.min(1,Math.max(0,(react-.2)/.28))*1.15:e.z,p=project(e.x,0,restZ),h=p?p.k*width/(sizes[e.type+'-'+pose]||1.08):0;
 // Only exposed head/shoulders can be hit behind cover. The hidden lower body
 // remains protected, while the visible crouching sprite is never invulnerable.
 const ownCover=objects.find(o=>o.enemyCover===e.id),coverP=ownCover?project(ownCover.x,0,ownCover.z):null;
 const coverH=coverP?coverP.k*ownCover.w/(sizes[ownCover.name]||2)*((anchors[ownCover.name]||.88)-(coverProfiles[ownCover.name]?.surface||.3)):0;
 const top=p?p.y-h*.93:0,bottom=p?Math.min(p.y-h*.16,coverP?coverP.y-coverH:p.y):0;
 e.rect=p&&!e.down?{x:p.x-p.k*width*.29,y:top,w:p.k*width*.58,h:Math.max(0,bottom-top)}:null;e.hidden=crouched;
 if(e.crossing&&!e.down&&p)e.rect={x:p.x-p.k*width*.32,y:p.y-h*.9,w:p.k*width*.64,h:h*.82};
 return {name:e.type+'-'+pose,x:e.x,z:restZ,w:width,character:true,pose,enemy:e,emerge:1,mirror:e.crossing&&e.dir<0&&pose.startsWith('run'),scatter:e.crossing&&e.down,elevation:e.crossing&&e.down?Math.sin(Math.min(1,react/.85)*Math.PI)*1.15:0};
 });}
function burst(x,y,color='#f4f7ff'){bursts.push({x,y,age:0,color})}
const coverProfiles={
 'cover-bench':{x:.53,surface:.21},'cover-car':{x:.79,surface:.46},
 'cover-bushes':{x:.52,surface:.47},'cover-wall':{x:.52,surface:.423},
 'cover-planter':{x:.52,surface:.32}
};
function coverImpactPoint(){const s=stops[stopIndex],profile=coverProfiles[s.cover],height=s.width/(sizes[s.cover]||2);return {x:route(s.z+2.8)+s.offset+(profile.x-.5)*s.width,z:s.z+2.84,y:height*((anchors[s.cover]||.88)-profile.surface)-.035};}
function coverTop(){return coverImpactPoint().y}
function blockBall(b){b.done=true;score+=25;coverBursts.push({...coverImpactPoint(),age:0});if(duckDuration>3.5)coverShake=.18;}
function throwAt(x,y){if(!started||!playing||finished||!atCover||duck||handCycle)return;handCycle={t:0,duration:stopIndex===2?.30:.48,x,y,released:false};}
function resolveThrow(x,y){
 if(stopIndex===4){shootFinale(x,y);return;}
 const target=enemies.find(e=>e.stop===stopIndex&&!e.down&&e.rect&&inside(x,y,e.rect));
 if(target){target.hp--;target.hit=combatTime;target.down=target.hp<=0;score+=target.down?(target.crossing?200:150):40;if(!target.down)target.coverUntil=combatTime+.75;if(target.crossing){target.scatterX=target.x;burst(x,y,'#fffaf0');bursts[bursts.length-1].label=['SNOWED!','WIPEOUT!','POWDER POWER!'][target.runIndex%3];}else burst(x,y);}else burst(x,y,'#d7e9fa');
}
function updateCombat(dt){
 // Transient effects must settle even after defeat, rather than freezing a white veil.
 hitFlash=Math.max(0,hitFlash-dt);throwFlash=Math.max(0,throwFlash-dt);coverShake=Math.max(0,coverShake-dt);
 for(const b of bursts)b.age+=dt;bursts=bursts.filter(b=>b.age<.7);
 for(const b of coverBursts)b.age+=dt;coverBursts=coverBursts.filter(b=>b.age<.85);
 if(!started||!playing||finished)return;
 combatTime+=dt;updateSpecials(dt);updateHands(dt);duckDuration=atCover&&duck?duckDuration+dt:0;for(const e of enemies){const target=enemyHidden(e)?1:0;e.crouch+=(target-e.crouch)*(1-Math.exp(-dt*8));}cooldown=Math.max(0,cooldown-dt);invulnerable=Math.max(0,invulnerable-dt);spawnClock-=dt;const travel=!atCover;
 const exposed=enemies.filter(e=>e.stop===stopIndex&&!e.down&&(!atCover||!enemyHidden(e)||e.stop===4)&&(!e.crossing||e.runVisible));
 if(spawnClock<=0&&exposed.length){
 const sender=exposed[shotNumber%exposed.length],aim=Math.max(-1.45,Math.min(1.45,laneNow+Math.sin(shotNumber*2.1)*.3));
 shots.push({targetX:aim,t:0,travel,duration:travel?1.47:1.87,origin:{x:sender.x-.42,y:sender.crouch>.5?1.05:1.45,z:sender.z},sender:sender.id});sender.release=combatTime+.38;shotNumber++;spawnClock=travel?1.8:stopIndex===2?2.8:2.25;
 }
 for(const b of shots){b.t+=dt;
 // Resolve on the far side of the barrier, well before the ball reaches the lens.
 if(atCover&&duck&&!b.travel&&b.t>=b.duration*.73&&!b.done){blockBall(b);continue;}
 if(b.t>=b.duration&&!b.done){b.done=true;const hit=(b.travel?Math.abs(laneNow-b.targetX)<.43:true)&&!duck;
 if(hit&&invulnerable<=0){hp=Math.max(0,hp-1);invulnerable=.55;hitFlash=.55;burst(W*.5,H*.48);if(hp<=0){finished=true;playing=false;shots=[];}}
 else if(!hit){score+=25;burst(W*(.5+(b.targetX-laneNow)*.18),H*.72,'#e3f4ff')}
 }}shots=shots.filter(b=>!b.done);
 $('#scoreHud').textContent=`${score} PTS · ♥ ${hp} / ${MAX_HP}`;
}
function ballVisual(b){let t=Math.max(0,Math.min(1,(b.t-.38)/(b.duration-.38)));const p=b.origin?project(b.origin.x,b.origin.y,b.origin.z):null;let dest=b.travel?W*(.5+(b.targetX-laneNow)*.18):W*.5,destY=H*.59;
 if(atCover&&duck&&!b.travel){const hit=coverImpactPoint(),q=project(hit.x,hit.y,hit.z);t=Math.max(0,Math.min(1,(b.t-.38)/(b.duration*.73-.38)));if(q){dest=q.x;destY=q.y;}}
 return {t,x:(p?.x??W*.5)*(1-t)+dest*t,y:(p?.y??H*.4)*(1-t)+destY*t-Math.sin(t*Math.PI)*H*.035,r:4+Math.pow(t,3)*(atCover&&duck?14:57)};}
function drawBalls(){for(const b of shots){const {t,x,y,r}=ballVisual(b);if(t===0){ctx.strokeStyle='#f7cd8d';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(x,y,11+Math.sin(elapsed*12)*2,0,Math.PI*2);ctx.stroke();continue;}ctx.save();ctx.shadowColor='#20364f66';ctx.shadowBlur=7;let g=ctx.createRadialGradient(x-r*.35,y-r*.38,r*.05,x,y,r);g.addColorStop(0,'#fffef8');g.addColorStop(.52,'#f0f5ff');g.addColorStop(1,'#8fa8d2');circle(x,y,r,g);ctx.restore();for(let j=1;j<5;j++)circle(x-j*3,y-j*(6+10*t),r*.22,`rgba(231,244,255,${.28-j*.045})`);circle(x-r*.3,y-r*.34,Math.max(1,r*.17),'#ffffffd9');}}
function drawCoverBursts(){for(const b of coverBursts){const t=b.age/.85;for(let i=0;i<22;i++){const a=i*2.4,spread=t*(.15+(i%4)*.055),p=project(b.x+Math.cos(a)*spread,b.y+Math.abs(Math.sin(a))*spread+.12*t-.46*t*t,b.z+Math.sin(i)*spread*.25);if(p)circle(p.x,p.y,Math.max(0,p.k*(.035+i%3*.018)*(1-t)),i%3?'#f9fcff':'#c3d7f1');}}}
function drawCombat(){if(!started)return;for(let b of bursts){let t=b.age/.7;for(let i=0;i<22;i++){let a=i*2.4,r=(8+105*t)*(1+i%3*.3);circle(b.x+Math.cos(a)*r,b.y+Math.sin(a)*r+60*t*t,(1-t)*(4+i%5),b.color)}if(b.label){ctx.save();ctx.globalAlpha=1-t;ctx.textAlign='center';ctx.font='bold 20px Arial';ctx.fillStyle='#fff0bb';ctx.strokeStyle='#5b3451';ctx.lineWidth=4;ctx.strokeText(b.label,b.x,b.y-35-t*65);ctx.fillText(b.label,b.x,b.y-35-t*65);ctx.restore();}}
 if(hitFlash>0){ctx.fillStyle=`rgba(225,239,255,${hitFlash*.23})`;ctx.fillRect(0,0,W,H);for(let i=0;i<8;i++){let x=(i*283)%W,y=i%2?H-25:25;circle(x,y,30+hitFlash*60,'#edf5ff88')}ctx.fillStyle='#933951';ctx.textAlign='center';ctx.font='bold 23px Arial';ctx.fillText('BRAIN FREEZE!',W/2,H*.22)}
 for(const b of playerFlights){const t=Math.min(1,b.t/.18);circle(b.sx+(b.x-b.sx)*t,b.sy+(b.y-b.sy)*t-Math.sin(t*Math.PI)*35,24*(1-t)+3,'#fffaf4');}drawSpecialHUD();
}
function fightYaw(){const squad=enemies.filter(e=>e.stop===stopIndex);const x=squad.reduce((a,e)=>a+e.x,0)/squad.length,zz=squad.reduce((a,e)=>a+e.z,0)/squad.length;return Math.atan2(x-cam.x,zz-cam.z)}
function prepareSightlines(){
 const removable=new Set(['lamp','winter-tree','mailbox','fir','cover-bushes','cover-bench','cover-wall','porch-gate']);
 for(let n=objects.length-1;n>=0;n--){const o=objects[n];if(o.cover||o.enemyCover!==undefined||(!removable.has(o.name)&&!o.name.startsWith('house-')))continue;
 const blocks=()=>stops.some((stop,i)=>enemies.filter(e=>e.stop===i).some(e=>{
 const t=(o.z-stop.z)/(e.z-stop.z);if(t<=0||t>=.98)return false;
 return [-.62,.62].some(shift=>{const cx=route(stop.z)+(stop.playerOffset??stop.offset)+shift,lineX=cx+(e.x-cx)*t;return Math.abs(o.x-lineX)<o.w*.42+e.w*.22*t;});
 }));if(o.name.startsWith('house-')){let attempts=0;const side=o.x<route(o.z)?-1:1;while(blocks()&&attempts++<12)o.x+=side*1.5;}else if(blocks())objects.splice(n,1);
 }
}
function drawScene(){const active=enemyObjects(),cover=objects.find(o=>o.cover&&o.stop===stopIndex),all=[...objects,...active,...weatherObjects(),...finaleObjects()];
 all.map(o=>({o,p:project(o.x,0,o.z)})).filter(v=>v.p&&!(atCover&&v.o===cover)).sort((a,b)=>b.p.depth-a.p.depth).forEach(({o})=>o.weather?drawWorldFlake(o):o.avalanche?drawAvalanche(o):drawObject(o));
 if(atCover&&duck){drawBalls();drawCoverBursts();if(cover)drawObject(cover);}else{drawCoverBursts();if(atCover&&cover)drawObject(cover);drawBalls();}
}

let clearFor=0;function frame(now){const renderStart=performance.now();let dt=Math.min(1,(now-last)/1000);canvas.dataset.frameInterval=Math.round(now-last);last=now;elapsed+=dt;windDrift+=dt*weatherState().wind;const damping=1-Math.exp(-dt*7);if(started&&playing&&!finished){if(!atCover){z=Math.min(stops[stopIndex].z,z+dt*speed);if(z>=stops[stopIndex].z){atCover=true;handCycle=null;firing=false;lane=0;lateralVelocity=0;shots=[];spawnClock=2;hold=0;speed=5.8}}else{hold+=dt;clearFor=enemies.filter(e=>e.stop===stopIndex).every(e=>e.down)?clearFor+dt:0;if($('#auto').checked&&clearFor>2.0){clearFor=0;next()}}}
 advanceLateral(dt);eye+=((duck?.82:1.86)-eye)*(1-Math.exp(-dt*12));laneNow+=((atCover?lane*.62:lane*1.45)-laneNow)*(1-Math.exp(-dt*12));look+=(lookTarget-look)*damping;lookY+=(pitchTarget-lookY)*damping;
 let moving=started&&playing&&!atCover;cam.x=route(z)+cameraOffset()+laneNow;cam.z=z;cam.y=eye+(moving?Math.sin(elapsed*12)*.035:0);const approach=Math.max(0,Math.min(1,1-(stops[stopIndex].z-z)/6));const desiredYaw=Math.atan(derivative(z+4))*.68*(1-approach)+fightYaw()*approach+look;cam.yaw+=(desiredYaw-cam.yaw)*(1-Math.exp(-dt*6));horizon=H*(.40+lookY);updateCombat(dt);ctx.save();const pressure=atCover&&duck&&playing?Math.min(1,Math.max(0,(duckDuration-5)/4)):0,shake=pressure*.8+coverShake*6;ctx.translate(Math.sin(elapsed*29)*shake,Math.sin(elapsed*23)*shake*.65);drawSky();drawGround();drawGroundSqualls();drawScene();snowfall();drawCombat();
 // Warm/cool atmospheric grade and edge shading, without scaling a scene image.
 let vig=ctx.createRadialGradient(W*.5,H*.43,H*.15,W*.5,H*.5,Math.max(W,H)*.7);vig.addColorStop(0,'#20223b00');vig.addColorStop(1,'#20223b44');ctx.fillStyle=vig;ctx.fillRect(0,0,W,H);
 drawHands(moving);
 ctx.restore();if(started){updateUI();$('#walkFill').style.width=atCover?`${Math.min(100,hold/9*100)}%`:'0%'}canvas.dataset.renderMs=Math.round(performance.now()-renderStart);canvas.dataset.distance=z.toFixed(2);canvas.dataset.state=finished?'finished':atCover?'cover':'travel';canvas.dataset.health=hp;canvas.dataset.opponents=enemies.filter(e=>e.stop===stopIndex&&!e.down).length;requestAnimationFrame(frame)}
let mini='';for(let q=0;q<=145;q+=2)mini+=(q?'L':'M')+(50+route(q)*2)+' '+(160-q);$('#miniRoute').setAttribute('d',mini);$('#stopDots').innerHTML=stops.map(s=>`<circle cx="${50+route(s.z)*2}" cy="${160-s.z}" r="3.5"/>`).join('');
ready.then(()=>{prepareSightlines();$('#begin').disabled=false;$('#begin').textContent='Begin the winding walk →';$('#loadStatus').textContent='Five encounters · Rapid-fire crossing · Snowman finale';if(new URLSearchParams(location.search).has('review')){practiceEncounter(0);playing=false;music.pause();elapsed=12;eye=1.86;}requestAnimationFrame(frame)}).catch(()=>{$('#loadStatus').textContent='An illustration could not load. Please refresh to retry.'});

// Player's two-hand rig: windup → right release → transfer → left scoop.
let handCycle=null,pendingThrow=null,firing=false,aim={x:W*.5,y:H*.45},playerFlights=[];
let finale={growth:0,loads:[{hits:2,fall:0,done:false},{hits:2,fall:0,done:false}],notice:'',noticeUntil:0};
function inside(x,y,r){return x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h;}
function resetSpecials(){handCycle=null;firing=false;playerFlights=[];finale={growth:0,loads:[{hits:2,fall:0,done:false},{hits:2,fall:0,done:false}],notice:'',noticeUntil:0};}
function handPose(side,phase){const keys=side==='right'?[[0,0,0,0,1],[.12,65,45,.20,1],[.25,-140,-170,-.6,.82],[.38,-120,-60,-.2,.97],[.58,-170,0,-.12,1],[.76,0,0,0,1],[1,0,0,0,1]]:[[0,0,0,0,1],[.35,0,0,0,1],[.58,210,-5,.15,1],[.68,80,100,-.2,1],[.82,-30,150,-.35,1],[.97,0,0,0,1],[1,0,0,0,1]];let a=keys[0],b=keys[keys.length-1];for(let i=1;i<keys.length;i++)if(phase<=keys[i][0]){a=keys[i-1];b=keys[i];break;}let t=Math.max(0,Math.min(1,(phase-a[0])/(b[0]-a[0])));t=t*t*(3-2*t);return {x:a[1]+(b[1]-a[1])*t,y:a[2]+(b[2]-a[2])*t,rot:a[3]+(b[3]-a[3])*t,scale:a[4]+(b[4]-a[4])*t};}
function handBallPoint(side,phase){const u=Math.min(W*.57,690)/900,p=handPose(side,phase),pivot=side==='left'?200:250,ball=side==='left'?236:214,x=(ball-pivot)*u*p.scale,y=(140-340)*u*p.scale;return {x:W*.5+(side==='left'?-450:0)*u+pivot*u+p.x*u+x*Math.cos(p.rot)-y*Math.sin(p.rot),y:H+65-120*u+p.y*u+x*Math.sin(p.rot)+y*Math.cos(p.rot)};}
function updateHands(dt){for(const b of playerFlights)b.t+=dt;playerFlights=playerFlights.filter(b=>b.t<.18);if(duck){handCycle=null;return;}if(handCycle){const c=handCycle;c.t+=dt;if(!c.released&&c.t>=c.duration*.22){c.released=true;const start=handBallPoint('right',.22);playerFlights.push({sx:start.x,sy:start.y,x:c.x,y:c.y,t:0});resolveThrow(c.x,c.y);}if(c.t>=c.duration)handCycle=null;}if(firing&&!handCycle&&atCover)throwAt(aim.x,aim.y);}
function drawHands(moving){if(!started||!assets['mitten-left-back'])return;const u=Math.min(W*.57,690)/900,phase=handCycle?Math.min(1,handCycle.t/handCycle.duration):0,bob=moving?Math.sin(elapsed*12)*7:Math.sin(elapsed*1.7)*2;
 for(const side of ['left','right']){const p=handPose(side,phase),pivot=side==='left'?200:250,ballX=side==='left'?236:214,hasBall=side==='right'?(!handCycle||phase<.22||phase>=.58):(!handCycle||phase<.58||phase>=.86);ctx.save();ctx.translate(W*.5+(side==='left'?-450:0)*u+pivot*u+p.x*u,H+65-120*u+p.y*u+(duck?80:0)+bob);ctx.rotate(p.rot);ctx.scale(u*p.scale,u*p.scale);ctx.drawImage(assets['mitten-'+side+'-back'],-pivot,-340,450,460);if(hasBall){let size=side==='left'&&phase>=.86&&phase<.97?160*Math.min(1,(phase-.86)/.08):160;ctx.drawImage(assets['held-snowball'],ballX-pivot-size/2,140-340-size/2,size,size);}ctx.drawImage(assets['mitten-'+side+'-front'],-pivot,-340,450,460);ctx.restore();}
 if(handCycle&&phase>.82&&phase<.97){const p=handBallPoint('left',phase);for(let i=0;i<9;i++)circle(p.x+Math.sin(i*2.4)*35,p.y+Math.cos(i*2.4)*18,2+i%3,'#f7fbffbb');}
}
function updateSpecials(dt){
 for(const e of enemies.filter(e=>e.crossing)){if(e.down){const t=Math.min(1,(combatTime-e.hit)/.85);e.x=e.scatterX+e.dir*4.2*(1-(1-t)*(1-t));continue;}if(stopIndex!==2||!atCover){e.runVisible=false;continue;}const t=hold-e.runIndex*.85,period=7.2,cycle=((t%period)+period)%period;e.runVisible=t>=0&&cycle<5.9;e.x=route(stops[2].z)+e.dir*(-12+24*Math.min(1,cycle/5.9));}
 if(stopIndex===4)for(let i=0;i<2;i++){const load=finale.loads[i];if(load.fall>0&&!load.done){load.fall+=dt;if(load.fall>=1.05){load.done=true;for(const e of enemies.filter(e=>e.stop===4&&(e.runIndex<2?0:1)===i)){e.hp=0;e.down=true;e.hit=combatTime;}score+=600;finale.notice='SNOWED UNDER!';finale.noticeUntil=combatTime+1.5;}}}
}
function finaleCenter(){const s=stops[4];return {x:route(s.z)+s.offset,z:s.z+12.4};}
function snowmanRect(){const c=finaleCenter(),p=project(c.x,0,c.z);if(!p)return null;const width=p.k*4.6,height=width/(540/700),stage=Math.min(3,Math.ceil(finale.growth/2));return {x:p.x-width*(.24+stage*.045),y:p.y-height*(.68+stage*.03),w:width*(.48+stage*.09),h:height*(.66+stage*.03)};}
function loadPoint(i){const c=finaleCenter();return {x:c.x+(i?2.3:-2.3),y:5.1,z:c.z+.7};}
function loadRect(i){const p=loadPoint(i),q=project(p.x,p.y,p.z);if(!q)return null;return {x:q.x-37,y:q.y-30,w:74,h:60};}
function shootFinale(x,y){for(let i=0;i<2;i++){const load=finale.loads[i],r=loadRect(i);if(r&&!load.done&&!load.fall&&inside(x,y,r)){load.hits--;burst(x,y);finale.notice=load.hits?'ONE MORE HIT ON THAT SNOW LOAD!':'AVALANCHE!';finale.noticeUntil=combatTime+1.6;if(load.hits===0)load.fall=.001;return;}}
 const shield=snowmanRect(),opponent=enemies.find(e=>e.stop===4&&!e.down&&e.rect&&inside(x,y,e.rect));if((shield&&inside(x,y,shield))||opponent){finale.growth=Math.min(6,finale.growth+1);finale.notice='YOU ARE MAKING THEIR COVER BIGGER — AIM ABOVE!';finale.noticeUntil=combatTime+2.2;burst(x,y);bursts[bursts.length-1].label='BIGGER!';}else burst(x,y,'#d7e9fa');}
function finaleObjects(){const c=finaleCenter();if(c.z<z||c.z>z+105)return [];const all=[{name:'snowman-'+Math.min(3,Math.ceil(finale.growth/2)),x:c.x,z:c.z,w:4.6}];for(let i=0;i<2;i++){const p=loadPoint(i),load=finale.loads[i];all.push({name:load.fall||load.done?'snow-bough-bare':'snow-bough',x:p.x,z:p.z,w:4.8,elevation:4.6});if(load.fall&&!load.done)all.push({avalanche:true,x:p.x,z:p.z+.25,index:i});}return all;}
function drawAvalanche(o){const load=finale.loads[o.index],t=Math.min(1,load.fall/1.05),p=loadPoint(o.index);for(let i=0;i<54;i++){const a=i*2.4,spread=.25+t*.95,x=p.x+(o.index?-1:1)*1.4*t+Math.cos(a)*spread*(.5+i%3*.22),y=Math.max(.12,5.1-5*t*t)+Math.sin(a)*spread*.5,q=project(x,y,p.z+.25);if(q)circle(q.x,q.y,q.k*(.065+i%5*.025)*(t>.85?Math.max(.2,(1-t)*6):1),i%3?'#f8faff':'#bdcfe9');}}
function drawSpecialHUD(){if(!atCover)return;if(stopIndex===2){const down=enemies.filter(e=>e.crossing&&e.down).length;ctx.textAlign='center';ctx.fillStyle='#fff1c9';ctx.font='bold 18px Arial';ctx.fillText('RAPID FIRE · '+down+' / 12 SCATTERED',W*.5,H*.16);}if(stopIndex===4){for(let i=0;i<2;i++){const load=finale.loads[i],r=loadRect(i);if(!r||load.done||load.fall)continue;ctx.save();ctx.strokeStyle='#f6d189';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(r.x+37,r.y+30,24+Math.sin(elapsed*3+i)*2,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#fff0b9';ctx.font='bold 12px Arial';ctx.textAlign='center';ctx.strokeStyle='#263149';ctx.lineWidth=3;ctx.strokeText('HIT SNOW ×'+load.hits,r.x+37,r.y-8);ctx.fillText('HIT SNOW ×'+load.hits,r.x+37,r.y-8);ctx.restore();}ctx.textAlign='center';ctx.fillStyle='#fff0c5';ctx.font='bold 16px Arial';ctx.fillText(finale.noticeUntil>combatTime?finale.notice:'KNOCK THE SNOW OFF THE BRANCHES',W*.5,H*.24);}}
function practiceEncounter(index){resetCombat();stopIndex=index;z=stops[index].z;hold=0;clearFor=0;atCover=true;started=playing=true;finished=false;lane=laneNow=lateralVelocity=0;eye=1.86;look=lookY=lookTarget=pitchTarget=0;for(const e of enemies)if(e.stop<index)e.down=true;cam.x=route(z)+cameraOffset();cam.z=z;cam.y=eye;cam.yaw=fightYaw();$('#intro').classList.add('hidden');$('#routePanel').classList.remove('open');spawnClock=2;musicPlay();updateUI();}
$('#practiceCross').onclick=()=>practiceEncounter(2);$('#practiceFinale').onclick=()=>practiceEncounter(4);
