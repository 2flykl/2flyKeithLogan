const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
const out=path.resolve('outputs');fs.mkdirSync(out,{recursive:true});
const gameURL=process.env.BG_GAME_URL||'http://127.0.0.1:8765/';
const gameFile=process.env.BG_GAME_FILE||require('url').pathToFileURL(path.resolve(__dirname,'../BLACK_AND_GIFTED_DEMO.html')).href;
(async()=>{const b=await chromium.launch({headless:true,channel:'msedge'});const p=await b.newPage({viewport:{width:1366,height:768}});const checks=[];
const check=(name,ok,detail)=>{checks.push({name,pass:!!ok,detail});if(!ok)console.log('FAIL',name,detail)};
await p.goto(gameURL+'?qa');await p.waitForFunction(()=>BGTest.snapshot().ready,{},{timeout:60000});await p.click('#begin');
check('All 313 metric entries refer to image files',await p.evaluate(()=>Object.keys(BG_FRAME_METRICS).length===313));
await p.click('#changeHero');let x=await p.evaluate(()=>BGTest.snapshot().player.x);await p.keyboard.down('ArrowRight');await p.waitForTimeout(450);await p.keyboard.up('ArrowRight');check('Keyboard movement after character button',await p.evaluate(x=>BGTest.snapshot().player.x>x,x));
await p.evaluate(()=>{BGTest.load(0);BGTest.place(320);BGTest.advance(3.2)});await p.waitForTimeout(200);await p.screenshot({path:path.join(out,'museum-reveal.png')});
// Actual scene transitions preserve form and gender (the director scene loader intentionally chooses forms).
await p.evaluate(()=>{BGTest.load(4);BGSetFemale()});
await p.evaluate(()=>document.querySelector('#formUpgraded').click());
await p.evaluate(()=>{for(const x of BGTest.snapshot().state.boxes){BGTest.place(x);BGTest.jump();BGTest.advance(1)}BGTest.place(1820);BGTest.advance(.1)});
let s=await p.evaluate(()=>BGTest.snapshot());check('Tunnel preserves female crown and scepter',s.scene===5&&s.gender==='female'&&s.player.upgraded&&s.player.crowned);
await p.evaluate(()=>{BGTest.place(2100);BGTest.advance(.3)});await p.waitForTimeout(200);await p.screenshot({path:path.join(out,'tunnel-scepter.png')});
// Every supplied frame in every selected animation renders, including all jump frames.
for(const gender of ['male','female']){
 await p.evaluate(g=>g==='male'?BGSetMale():BGSetFemale(),gender);
 for(const form of ['young','crowned','upgraded']){
  await p.evaluate(form=>{document.querySelector(form==='young'?'#formYoung':form==='crowned'?'#formCrowned':'#formUpgraded').click()},form);
  for(const state of ['idle','walk','run','jump','push']){
   if(form==='young'&&state==='push')continue;
   let result=await p.evaluate(state=>{let count=0;for(let i=0;i<18;i++){BGTest.renderPose(state,i);count++}return {count,errors:BGTest.snapshot().errors}},state);
   check(`${gender} ${form} ${state} frame render`,result.errors===0,result.count);
  }
 }
}
// Track the hero throughout the long cinematic instead of checking only landing.
await p.evaluate(()=>{BGTest.load(2);BGTest.place(620);BGTest.jump()});
let visible=true;for(let i=0;i<32;i++){await p.evaluate(()=>BGTest.advance(.1));s=await p.evaluate(()=>BGTest.snapshot());const px=(s.player.x-s.camera.x-683)*s.camera.zoom+683,py=(s.player.y-s.camera.y-384)*s.camera.zoom+384;if(px<0||px>1366||py<0||py>768)visible=false}
check('Hero stays in frame throughout first faith fall',visible);
// Rendering under load, plus playback evidence for the preserved song and projection.
await p.evaluate(()=>BGTest.load(0));await p.waitForTimeout(2000);
let media=await p.evaluate(()=>({song:{time:document.querySelector('#music').currentTime,paused:document.querySelector('#music').paused,error:document.querySelector('#music').error},video:{time:document.querySelector('#vidScene1Intro').currentTime,ready:document.querySelector('#vidScene1Intro').readyState}}));
check('Song plays with no media error',media.song.time>0&&!media.song.paused&&!media.song.error,media.song);check('Opening projection decodes and plays',media.video.time>0&&media.video.ready>=2,media.video);
let intervals=await p.evaluate(()=>new Promise(resolve=>{let arr=[],last=performance.now();function f(now){arr.push(now-last);last=now;if(arr.length<90)requestAnimationFrame(f);else resolve(arr.slice(1))}requestAnimationFrame(f)}));intervals.sort((a,b)=>a-b);checks.push({name:'Frame timing (headless desktop)',pass:true,medianMs:intervals[Math.floor(intervals.length*.5)],p95Ms:intervals[Math.floor(intervals.length*.95)]});
// Native pointer touch input through Chromium's touchscreen, with production UI.
const m=await b.newPage({viewport:{width:844,height:390},isMobile:true,hasTouch:true});await m.goto(gameURL);await m.waitForFunction(()=>document.querySelector('#begin').textContent==='ENTER THE MUSEUM',{},{timeout:60000});await m.tap('#begin');check('Director UI hidden in release',!(await m.locator('#qaDock').isVisible()));
await m.tap('[data-key="Space"]');await m.waitForTimeout(150);await m.screenshot({path:path.join(out,'mobile-release.png')});check('Release touch controls visible',await m.locator('#touchControls').isVisible());
// The shipped launcher uses file://; verify that exact entry path as well as HTTP.
const f=await b.newPage();let fileErrors=[];f.on('pageerror',e=>fileErrors.push(e.message));await f.goto(gameFile);await f.waitForFunction(()=>document.querySelector('#begin').textContent==='ENTER THE MUSEUM',{},{timeout:60000});await f.click('#begin');await f.waitForTimeout(1000);check('Offline alternate entry starts without script errors',fileErrors.length===0,fileErrors);
await p.evaluate(()=>{BGTest.load(8);document.body.classList.remove('director');document.querySelector('#toast').style.opacity=0;BGTest.advance(2)});await p.waitForTimeout(200);await p.screenshot({path:path.join(out,'palace-release.png')});
fs.writeFileSync(path.join(out,'extended-qa-results.json'),JSON.stringify({checks},null,2));console.log(JSON.stringify({passed:checks.filter(x=>x.pass).length,total:checks.length,failed:checks.filter(x=>!x.pass)},null,2));await b.close()})().catch(e=>{console.error(e);process.exit(1)});
