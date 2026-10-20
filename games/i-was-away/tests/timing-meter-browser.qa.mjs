// Isolated DOM/CSS QA. It deliberately does not load WebGL, audio, or main.js.
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require('playwright');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=process.env.METER_QA_OUTPUT||'/tmp/iwa-meter-qa';fs.mkdirSync(output,{recursive:true});
const fixture=fs.readFileSync(path.join(root,'index.html'),'utf8')
 .replace(/<script[^>]*>[\s\S]*?<\/script>/g,'')
 .replace('</head>','<link rel="stylesheet" href="meter.css"><style>#world{background:linear-gradient(#adbcb2,#8f9b73 55%,#405a39)}#loading,.intro,.overlay,#exploring{display:none!important}#hud{display:block!important}.shade{opacity:.4}</style></head>')
 .replace('</body>',`<script type="module">
import {renderTiming} from './src/timing-ui.js';
const zones=[{grade:'bad',start:0,end:.1},{grade:'regular',start:.1,end:.4},{grade:'trick',start:.4,end:.45},{grade:'good',start:.45,end:.65},{grade:'trick',start:.65,end:.7},{grade:'regular',start:.7,end:1}];
const state={phase:'ready',charge:0,flightTime:0,duration:5,playerX:0,playerZ:0,landingX:0,landingZ:0,catchRadius:.5,catchAt:null,throwGrade:'good',catchGrade:null,throwZones:zones,catchZones:zones,returns:0,result:''};
const world={project:(x,y,z)=>({x:innerWidth*.5+x*50,y:innerHeight*.49+z*20,visible:true})};
window.meterRender=patch=>{Object.assign(state,patch);renderTiming(state,world);document.querySelector('#action').disabled=['launch','result'].includes(state.phase);};
window.meterRender({});window.meterReady=true;
</script></body>`);
const server=http.createServer((request,response)=>{
 const url=new URL(request.url,'http://localhost');
 if(url.pathname==='/'){response.writeHead(200,{'Content-Type':'text/html'});response.end(fixture);return;}
 const target=path.resolve(root,'.'+decodeURIComponent(url.pathname));
 if(!target.startsWith(root+path.sep)||!fs.existsSync(target)){response.writeHead(404);response.end();return;}
 const types={'.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg'};
 response.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream'});fs.createReadStream(target).pipe(response);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
const results=[];
try{
 for(const viewport of [{width:1366,height:768},{width:1920,height:1080},{width:360,height:800},{width:390,height:844},{width:430,height:932},{width:390,height:667},{width:844,height:390},{width:667,height:375}]){
  const page=await browser.newPage({viewport,reducedMotion:'reduce'});const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.address().port}/`);await page.waitForFunction(()=>window.meterReady);
  let originalRect;
  for(const [name,patch] of Object.entries({ready:{phase:'ready',catchAt:null},charging:{phase:'charging',charge:.51},waiting:{phase:'flight',flightTime:2,catchStart:.7,playerX:2},open:{phase:'flight',flightTime:4.4,playerX:0},committed:{catchAt:.88,catchGrade:'good'},miss:{phase:'result',result:'Just out of reach',feedback:'Step inside the return ring before it lands.',playerX:2},success:{phase:'result',returns:1,result:'Back in your hands',feedback:'GOOD catch. You found the return.',playerX:0}})){
   if(name==='success')await page.evaluate(()=>window.meterRender({phase:'flight'}));
   await page.evaluate(patch=>window.meterRender(patch),patch);
   const metrics=await page.evaluate(()=>{
    const rect=id=>{const {x,y,width,height}=document.getElementById(id).getBoundingClientRect();return {x,y,width,height};};
    return {button:rect('action'),panel:rect('interaction'),meter:rect('meter'),hint:rect('hint'),overflow:document.documentElement.scrollWidth>innerWidth,promptOverflow:document.getElementById('prompt').scrollHeight>document.getElementById('prompt').clientHeight,readiness:[...document.querySelectorAll('#timing-readiness span')].map(element=>({text:element.textContent,overflow:element.scrollWidth>element.clientWidth})),animation:getComputedStyle(document.getElementById('interaction')).animationName,ringAnimation:getComputedStyle(document.querySelector('#landing span')).animationName};
   });
   assert.equal(metrics.overflow,false,`${viewport.width}×${viewport.height} ${name}: page overflow`);
   assert.ok(metrics.panel.x>=0&&metrics.panel.x+metrics.panel.width<=viewport.width+1);
   assert.ok(metrics.panel.y>=0&&metrics.panel.y+metrics.panel.height<=viewport.height);
   assert.ok(metrics.button.width>=44&&metrics.button.height>=44);
   assert.equal(metrics.promptOverflow,false,`${viewport.width}×${viewport.height} ${name}: prompt clipped`);
   assert.ok(metrics.readiness.every(item=>!item.overflow),`${viewport.width}×${viewport.height} ${name}: readiness clipped`);
   if(!originalRect)originalRect=metrics.button;else assert.deepEqual(metrics.button,originalRect,`${viewport.width}×${viewport.height} ${name}: control drift`);
   assert.equal(metrics.animation,'none');assert.equal(metrics.ringAnimation,'none');
   if(['charging','open','miss'].includes(name))await page.screenshot({path:path.join(output,`${viewport.width}x${viewport.height}-${name}.png`)});
   results.push({viewport,name,...metrics});
  }
  assert.deepEqual(errors,[]);await page.close();
 }
 fs.writeFileSync(path.join(output,'results.json'),JSON.stringify(results,null,2));
 console.log(`PASS: ${results.length} isolated meter states, stable controls across 8 viewports. Screenshots: ${output}`);
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
