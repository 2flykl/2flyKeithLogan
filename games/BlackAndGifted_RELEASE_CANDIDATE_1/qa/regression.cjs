const {chromium}=require('playwright');
const fs=require('fs');
const path=require('path');
const out=path.resolve('outputs');fs.mkdirSync(out,{recursive:true});
const gameURL=process.env.BG_GAME_URL||'http://127.0.0.1:8765/';
(async()=>{
 const b=await chromium.launch({headless:true,channel:'msedge'});
 const p=await b.newPage({viewport:{width:1366,height:768}});const errors=[],network=[],checks=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text().slice(0,500))});p.on('response',r=>{if(r.status()>=400)network.push([r.status(),r.url()])});
 await p.goto(gameURL+'?qa');await p.waitForFunction(()=>window.BGTest?.snapshot().ready,{},{timeout:60000});
 await p.screenshot({path:path.join(out,'title-screen.png')});await p.click('#begin');
 const snap=()=>p.evaluate(()=>BGTest.snapshot());
 const check=(name,ok,detail)=>{checks.push({name,pass:!!ok,detail});if(!ok)console.log('FAIL',name,detail)};
 check('Start loads visible character',(await snap()).ready);
 for(const gender of ['male','female']){
  await p.evaluate(g=>g==='male'?BGSetMale():BGSetFemale(),gender);
  for(let i=0;i<9;i++){
   await p.evaluate(n=>{BGTest.load(n);BGTest.advance(.3)},i);await p.waitForTimeout(180);
   const s=await snap();check(`${gender} scene ${i+1} render`,s.errors===0,s.lastRuntimeError);
   if(gender==='male')await p.screenshot({path:path.join(out,`scene-${i+1}.png`)});
   await p.evaluate(()=>{BGTest.keys.ArrowRight=true;BGTest.advance(.5);BGTest.keys.ArrowRight=false;BGTest.jump();BGTest.advance(.2)});
   const moving=await snap();check(`${gender} scene ${i+1} movement finite`,Number.isFinite(moving.player.x)&&Number.isFinite(moving.player.y));
  }
 }
 // Full authored progression, using positional setup to avoid waiting through empty runs.
 await p.evaluate(()=>{BGTest.load(0);BGTest.place(320);BGTest.advance(1.2)});
 let s=await snap();check('Opening walls complete before gift',s.state.wallDropFinished&&!s.state.gift,s.state);
 await p.evaluate(()=>BGTest.advance(1.8));s=await snap();check('Museum breath then gift',s.state.gift);
 await p.evaluate(()=>{let s=BGTest.snapshot();BGTest.place(s.state.giftX);BGTest.jump();BGTest.advance(2)});s=await snap();check('Gift crowns player',s.player.crowned);
 for(let i=0;i<3;i++){await p.evaluate(i=>{const s=BGTest.snapshot();BGTest.place(s.state.walls[i]-s.state.wallWidth/2-50);BGTest.breakWall();BGTest.advance(.9)},i)}
 s=await snap();check('Three uppercuts clear opening',s.state.broken?.every(Boolean));
 await p.evaluate(()=>{BGTest.load(1);BGTest.place(570);BGTest.keys.ArrowRight=true;BGTest.advance(12);BGTest.keys.ArrowRight=false});await p.waitForTimeout(400);s=await snap();check('Boulder release reaches Leap of Faith',s.scene===2,{scene:s.scene,progress:s.state.progress});
 await p.evaluate(()=>BGTest.load(2));
 for(let i=0;i<4;i++){await p.evaluate(()=>{const s=BGTest.snapshot();const edge=s.state.stage===0?s.state.cliff:s.state.platforms[s.state.stage-1].x+s.state.platforms[s.state.stage-1].w;BGTest.place(edge-35);BGTest.jump();BGTest.advance(3.5)});await p.waitForTimeout(120)}
 s=await snap();check('All four faith leaps reach Run Free',s.scene===3,s.scene);
 await p.evaluate(()=>{BGTest.load(3);BGTest.place(720);BGTest.advance(4)});s=await snap();check('Panthers join without speed increase',s.state.panthers.length===4&&Math.abs(s.player.vx)<=300);
 await p.evaluate(()=>{const s=BGTest.snapshot();BGTest.place(s.state.wall-s.state.wallWidth/2);BGTest.advance(.1);BGTest.place(s.state.wall-s.state.wallWidth/2-480);BGTest.advance(.1);BGTest.place(s.state.wall-s.state.wallWidth/2-60);BGTest.breakWall();BGTest.advance(1)});await p.waitForTimeout(1200);s=await snap();check('Worthiness wall advances to affirmation',s.scene===4,s.scene);
 await p.evaluate(()=>{BGTest.load(4);for(const x of BGTest.snapshot().state.boxes){BGTest.place(x);BGTest.jump();BGTest.advance(.4);BGTest.advance(.7)}});s=await snap();check('All affirmations open passage',s.state.revealed.length===4&&s.state.doorOpen,s.state.revealed);
 await p.evaluate(()=>{BGTest.place(1820);BGTest.advance(.1)});s=await snap();check('Affirmation enters tunnel',s.scene===5);
 await p.evaluate(()=>{BGTest.place(3580);BGTest.advance(5.3);BGTest.place(5650);BGTest.advance(.1);BGTest.breakWall();BGTest.advance(1);BGTest.place(6250);BGTest.advance(.1)});s=await snap();check('Tunnel breakthrough enters alignment',s.scene===6,s.scene);
 await p.evaluate(()=>{BGTest.place(2940);BGTest.jump();BGTest.advance(.5)});s=await snap();check('Future gift grants scepter',s.player.upgraded);
 await p.evaluate(()=>{BGTest.place(3450);BGTest.advance(.1);BGTest.place(820);BGTest.keys.ArrowRight=true;BGTest.advance(3)});s=await snap();check('Mirror resists while pressing forward',s.scene===7&&!s.state.resolved);
 await p.evaluate(()=>{BGTest.keys.ArrowRight=false;BGTest.advance(5)});s=await snap();check('Stillness unlocks palace',s.scene===8,s.scene);
 await p.evaluate(()=>{BGTest.place(BGTest.snapshot().state.throneX-60);BGTest.advance(.1)});await p.waitForTimeout(1100);check('Throne offers ending choices',await p.locator('#choice button').count()===4);
 await p.locator('#choice button').last().click();await p.waitForTimeout(1900);check('Final transition shows ending',await p.locator('#end').isVisible());
 await p.click('#again');await p.waitForFunction(()=>window.BGTest?.snapshot().ready,{},{timeout:60000});check('Replay restores entry screen',await p.locator('#start').isVisible());
 await p.click('#begin');await p.click('#soundToggle');check('Mute responds',await p.evaluate(()=>document.querySelector('#music').muted));await p.click('#soundToggle');
 await p.click('#pauseToggle');s=await snap();check('Pause responds',s.paused);await p.click('#pauseToggle');
 await p.keyboard.down('ArrowRight');await p.evaluate(()=>dispatchEvent(new Event('blur')));s=await snap();check('Focus loss pauses safely',s.paused);await p.keyboard.up('ArrowRight');
 await p.setViewportSize({width:1920,height:1080});await p.screenshot({path:path.join(out,'desktop-1920.png')});
 const mobile=await b.newPage({viewport:{width:844,height:390},isMobile:true,hasTouch:true});await mobile.goto(gameURL+'?qa');await mobile.waitForFunction(()=>window.BGTest?.snapshot().ready,{},{timeout:60000});await mobile.click('#begin');
 check('Touch controls available',await mobile.locator('#touchControls').isVisible());
 await mobile.locator('[data-key="ArrowRight"]').dispatchEvent('pointerdown',{pointerId:1,pointerType:'touch'});await mobile.waitForTimeout(600);await mobile.locator('[data-key="ArrowRight"]').dispatchEvent('pointerup',{pointerId:1,pointerType:'touch'});
 check('Touch movement advances player',(await mobile.evaluate(()=>BGTest.snapshot())).player.x>170);
 await mobile.screenshot({path:path.join(out,'mobile-landscape.png')});await mobile.setViewportSize({width:390,height:844});await mobile.screenshot({path:path.join(out,'mobile-portrait.png')});
 check('Portrait resize retains finite world',(await mobile.evaluate(()=>BGTest.snapshot())).errors===0);
 check('No blocking browser errors',errors.length===0,errors);check('No missing resources',network.length===0,network);
 fs.writeFileSync(path.join(out,'qa-results.json'),JSON.stringify({checks,errors,network},null,2));console.log(JSON.stringify({passed:checks.filter(x=>x.pass).length,total:checks.length,errors,network},null,2));await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
