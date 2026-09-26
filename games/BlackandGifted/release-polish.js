function fitGameViewport(){
 const vw=innerWidth,vh=window.visualViewport?.height||innerHeight;
 DPR=Math.min(devicePixelRatio||1,2);const scale=Math.min(vw/W,vh/H),w=W*scale,h=H*scale,x=(vw-w)/2,y=(vh-h)/2;
 Object.assign(C.style,{width:w+'px',height:h+'px',left:x+'px',top:y+'px',position:'fixed'});
 C.width=Math.round(w*DPR);C.height=Math.round(h*DPR);ctx.setTransform(C.width/W,0,0,C.height/H,0,0);
 for(const [k,v] of Object.entries({x,y,w,h,scale}))document.documentElement.style.setProperty('--game-'+k,k==='scale'?v:v+'px');
}
function resetFaithFilm(key){const v=MUSEUM_VIDEO[key];if(!v)return;v.pause();v.loop=false;try{v.currentTime=0}catch(_){};}
function faithLanded(stage){
 S.faithBeat=stage===0?'black':stage===1?'and':'reveal';S.faithLandedAt=sceneTime;
 S.beatReadyAt=sceneTime;S.pendingFaithLeap=false;
 if(stage<2)resetFaithFilm(stage===0?'leapFirst':'leapSecond');
 else {S.faithFadeAt=sceneTime;S.faithVideoEnded=true;S.monumentX=S.mainlandX-170;S.monumentY=P.y-95;
 const platform=S.platforms[2],sx=platform.x+platform.w-35,u=.38,dur=1.8;
 S.moonX=faithHermite(sx,S.mainlandX+170,180,240,dur,u);
 S.moonY=faithHermite(platform.y,S.mainlandY,-620,440,dur,u)-110;S.moonRise=0;}
}
function drawFaithSky(){
 const active=new Set();let key=null,fade=1;
 if(S.faithBeat==='black')key='leapFirst';
 if(S.faithBeat==='and')key='leapSecond';
 if(S.faithBeat==='reveal'){fade=Math.max(0,1-(sceneTime-S.faithFadeAt)/1.4);if(fade>0)key='leapSecond';}
 if(key){active.add(key);drawProjectedSky([key],camX+W*.12,camY+H*.035,W*.76,H*.48,{baseAlpha:.54*fade,peakAlpha:.64*fade,period:12,zoom:1,slideAmount:0,rotateEvery:99999,filter:'saturate(.85) contrast(1.08) brightness(1.12)'});}
 ambientVideoPauseUnused(active);S.faithProjection=key;S.faithProjectionOpacity=key?fade:0;
 document.body.dataset.faithBeat=S.faithBeat;

}
const faithMonumentImage=new Image();
const faithMonumentReady=new Promise((resolve,reject)=>{faithMonumentImage.onload=resolve;faithMonumentImage.onerror=()=>reject(new Error('Museum skyline could not load'));faithMonumentImage.src='assets/release-polish-v2/pyramid-fist-museum.png';});
function drawFaithMonument(alpha){
 const age=Math.max(0,sceneTime-S.faithFadeAt),mx=S.monumentX,my=S.monumentY;
 ctx.save();ctx.globalAlpha=alpha;
 const sky=ctx.createLinearGradient(0,camY,0,camY+H);sky.addColorStop(0,'#030718');sky.addColorStop(.55,'#11132c');sky.addColorStop(1,'#34243b');ctx.fillStyle=sky;ctx.fillRect(camX-40,camY-40,W+80,H+80);
 // Fixed world coordinates keep the skyline and stars independent of player motion.
 for(let i=0;i<170;i++){const x=1800+((i*379)%3600),y=-260+((i*137)%660);ctx.globalAlpha=alpha*(.25+.55*(.5+.5*Math.sin(age*.7+i)));ctx.fillStyle=i%4?'#eee8d9':'#b6ceff';ctx.beginPath();ctx.arc(x,y,i%19===0?1.9:.8,0,Math.PI*2);ctx.fill();}
 ctx.globalAlpha=alpha;
 const rise=Math.max(S.moonRise||0,Math.min(1,age/5));S.moonRise=rise;const moonX=S.moonX,moonY=S.moonY+155*(1-rise),radius=125;
 const halo=ctx.createRadialGradient(moonX,moonY,radius*.6,moonX,moonY,radius*2.6);halo.addColorStop(0,'rgba(222,216,255,.23)');halo.addColorStop(1,'rgba(150,160,255,0)');ctx.fillStyle=halo;ctx.fillRect(moonX-radius*2.6,moonY-radius*2.6,radius*5.2,radius*5.2);
 const moon=ctx.createRadialGradient(moonX-25,moonY-30,2,moonX,moonY,radius);moon.addColorStop(0,'#fff3d6');moon.addColorStop(.72,'#dcdce6');moon.addColorStop(1,'#a5a8c4');ctx.fillStyle=moon;ctx.beginPath();ctx.arc(moonX,moonY,radius,0,Math.PI*2);ctx.fill();
 ctx.save();ctx.clip();ctx.globalAlpha=alpha*.1;ctx.fillStyle='#606982';for(let i=0;i<17;i++){ctx.beginPath();ctx.arc(moonX-85+(i*43%160),moonY-80+(i*71%158),6+i%5*3,0,Math.PI*2);ctx.fill();}ctx.restore();
 ctx.globalAlpha=alpha;
 // Stationary architectural uplights taper through the night haze.
 for(const offset of [-155,-95,95,155]){const bx=mx+offset,by=my-38,top=my-650;const light=ctx.createLinearGradient(bx,top,bx,by);light.addColorStop(0,'rgba(215,208,255,0)');light.addColorStop(.65,'rgba(200,194,244,.055)');light.addColorStop(1,'rgba(255,224,162,.32)');ctx.fillStyle=light;ctx.beginPath();ctx.moveTo(bx-5,by);ctx.lineTo(bx+offset*.8-48,top);ctx.lineTo(bx+offset*.8+48,top);ctx.lineTo(bx+5,by);ctx.fill();}
 const dh=340,dw=dh*faithMonumentImage.naturalWidth/faithMonumentImage.naturalHeight;ctx.globalAlpha=alpha*.92;ctx.drawImage(faithMonumentImage,mx-dw/2,my-dh,dw,dh);
 const haze=ctx.createRadialGradient(mx,my+12,10,mx,my+12,460);haze.addColorStop(0,'rgba(67,51,77,.48)');haze.addColorStop(1,'rgba(67,51,77,0)');ctx.globalAlpha=alpha;ctx.save();ctx.translate(mx,my+12);ctx.scale(1,.18);ctx.fillStyle=haze;ctx.translate(-mx,-my-12);ctx.fillRect(mx-460,my-448,920,920);ctx.restore();
 S.skyline={x:mx,y:my,moonX,moonY};ctx.restore();
}

function initReleaseUI(){
 const buttons=[...document.querySelectorAll('[data-start-gender]')];
 for(const b of buttons)b.onclick=()=>{setPlayerGender(b.dataset.startGender);for(const c of buttons)c.setAttribute('aria-pressed',String(c===b));};
 const full=document.getElementById('fullscreenToggle');full.onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch(_){notify('Use your browser fullscreen control');}};
 document.addEventListener('fullscreenchange',()=>{fitGameViewport();full.textContent=document.fullscreenElement?'EXIT FULLSCREEN':'FULLSCREEN';});
 window.visualViewport?.addEventListener('resize',fitGameViewport);fitGameViewport();
}
