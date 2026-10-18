const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const transparentPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==', 'base64');
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css'};
const server = http.createServer((req,res) => {
 const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
 if (pathname === '/shared-only.html') {res.setHeader('Content-Type','text/html');res.end('<script src="/js/playable-controls.js"></script><button id="ordinary">Ordinary button</button>');return;}
 if (pathname.startsWith('/pages/')) {res.setHeader('Content-Type','text/html');res.end('<h1>Library destination fixture</h1>');return;}
 const file=path.join(root,pathname);
 if (!file.startsWith(root+path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {res.statusCode=404;res.end('Not found');return;}
 res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));
});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base=`http://127.0.0.1:${server.address().port}`;
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try {
 const page=await browser.newPage({viewport:{width:1366,height:768}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 // Keep input/focus/event dispatch real; synthetic art/audio make this test offline and deterministic.
 await page.route('**/assets/**/*.png',route=>route.fulfill({status:200,contentType:'image/png',body:transparentPng}));
 await page.addInitScript(()=>{window.Audio=class {constructor(src){this.src=src;this.paused=true;this.currentTime=0;this.muted=false;}addEventListener(){}play(){this.paused=false;return Promise.resolve();}pause(){this.paused=true;}};});
 const url=base+'/games/return-of-the-aviator/index.html';
 const diagnostics=()=>page.evaluate(()=>window.aviatorDiagnostics());
 const active=()=>page.evaluate(()=>document.activeElement?.id);
 const waitState=state=>page.waitForFunction(s=>window.aviatorDiagnostics()?.state===s,state);
 const waitPaused=paused=>page.waitForFunction(p=>window.aviatorDiagnostics().paused===p,paused);
 const load=async()=>{await page.goto(url);await waitState('menu');};
 const start=async()=>{await page.locator('#start').click();await waitState('intro');await page.locator('#skip').click();await waitState('play');};
 await load();
 await page.locator('#sound').focus();await page.keyboard.press('Space');
 assert.equal(await page.locator('#sound').innerText(),'SOUND OFF','menu button keeps native Space activation');
 assert.equal((await diagnostics()).state,'menu');
 await start();assert.equal(await active(),'game','skip restores game focus');
 await page.locator('#sound').click();assert.equal(await active(),'game');
 const sound=await page.locator('#sound').innerText();
 await page.keyboard.down('Space');await page.waitForFunction(()=>window.aviatorDiagnostics().entities.shots>0);await page.keyboard.up('Space');
 assert.equal(await page.locator('#sound').innerText(),sound,'fire does not toggle sound');
 await page.locator('#pause').click();await waitPaused(true);assert.equal(await active(),'resume');
 await page.keyboard.press('Space');await waitPaused(false);assert.equal(await active(),'game','keyboard resume restores game focus');
 await page.locator('#pause').click();await waitPaused(true);await page.locator('#pause').click();await waitPaused(false);assert.equal(await active(),'game');
 await page.keyboard.press('Space');assert.equal((await diagnostics()).paused,false,'fire does not re-pause toolbar');
 await page.keyboard.press('KeyP');await waitPaused(true);await page.keyboard.press('KeyP');await waitPaused(false);
 await page.keyboard.press('Escape');await waitPaused(true);assert.equal(page.url(),url,'Escape pauses without navigation');
 await page.keyboard.press('Escape');await waitPaused(false);assert.equal(page.url(),url,'second Escape resumes');
 await page.evaluate(()=>window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',code:'Escape',repeat:true})));
 assert.equal((await diagnostics()).paused,false,'repeat Escape ignored');
 // Programmatically focus a control during play, as keyboard Tab can do.
 await page.locator('#sound').focus();await page.keyboard.down('Space');await page.waitForTimeout(100);
 assert.notEqual((await diagnostics()).hero.state,'fire','focused controls do not receive gameplay input');
 await page.keyboard.up('Space');assert.notEqual(await page.locator('#sound').innerText(),sound,'focused control still activates natively');
 assert.equal(await active(),'game');
 await page.locator('#playable-controls').locator('#toggle').click();
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('#playable-controls').locator('#panel').isVisible(),false,'Escape closes shared menu first');
 assert.equal((await diagnostics()).paused,false);assert.equal(page.url(),url);
 await page.locator('#game').focus();await page.keyboard.press('Shift');assert((await diagnostics()).charge<1,'burst remains functional');
 await page.locator('#exit').click();await page.waitForURL('**/pages/playables.html');
 assert.equal(page.url(),base+'/pages/playables.html','EXIT returns directly to library');
 await load();await page.waitForTimeout(450);await page.keyboard.press('Escape');await page.waitForURL('**/pages/site-overhaul.html#playables');
 assert.equal(page.url(),base+'/pages/site-overhaul.html#playables','menu Escape retains shared Back');
 await page.goto(base+'/shared-only.html');await page.waitForTimeout(450);await page.keyboard.press('Escape');await page.waitForURL('**/pages/site-overhaul.html#playables');
 assert.equal(page.url(),base+'/pages/site-overhaul.html#playables','other games keep shared Back');
 await load();await start();await page.evaluate(()=>{Object.defineProperty(document,'fullscreenElement',{configurable:true,get:()=>document.documentElement});document.exitFullscreen=()=>{window.testExitedFullscreen=true;return Promise.resolve();};});
 await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>window.testExitedFullscreen),true,'full-screen exit has priority');assert.equal((await diagnostics()).paused,false);
 await load();await start();await page.evaluate(()=>{Object.defineProperty(document,'pointerLockElement',{configurable:true,get:()=>document.body});document.exitPointerLock=()=>{window.testExitedPointerLock=true;};});
 await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>window.testExitedPointerLock),true,'pointer-lock exit has priority');assert.equal((await diagnostics()).paused,false);
 await page.setViewportSize({width:390,height:844});await load();await start();await page.locator('#sound').click();assert.equal(await active(),'game');await page.keyboard.press('Escape');await waitPaused(true);await page.locator('#resume').click();await waitPaused(false);assert.equal(await active(),'game');
 assert.deepEqual(errors,[],'no JavaScript page errors');
 console.log('PASS: desktop and portrait controls; native button Space; sound/fire; toolbar pause/fire; keyboard resume; P; Escape pause/resume/repeat; shared menu; burst; EXIT; inactive-menu Back; unrelated-game Back; fullscreen/pointer-lock priority.');
 console.log('Note: Chromium DOM/input is real; image/audio and library destination fixtures are synthetic. This is not a visual or audible QA pass.');
 } finally {await browser.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
