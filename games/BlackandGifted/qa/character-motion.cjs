const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
const sharp=require('sharp');
(async()=>{
 const b=await chromium.launch({headless:true,channel:'msedge'});const p=await b.newPage({viewport:{width:1366,height:768}}),checks=[],errors=[];
 const check=(name,ok,detail)=>checks.push({name,pass:!!ok,detail});
 p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url())});
 await p.goto((process.env.BG_GAME_URL||'http://127.0.0.1:8788/')+'?qa');await p.waitForFunction(()=>BGTest.snapshot().ready&&!document.querySelector('#begin').disabled);await p.click('#begin');
 const rows=[];
 for(const gender of ['male','female'])for(const form of ['young','crowned','upgraded']){
  await p.evaluate(({gender,form})=>{BGTest.load(6);gender==='male'?BGSetMale():BGSetFemale();document.querySelector('#form'+({young:'Young',crowned:'Crowned',upgraded:'Upgraded'}[form])).click();}, {gender,form});
  const frames=[];
  for(const [state,i] of [['idle',0],['walk',2],['run',4],['jump',2],['jump',4],['jump',6],['jump',8]]){
   const capture=await p.evaluate(({state,i})=>{BGTest.renderPose(state,i);return document.querySelector('#game').toDataURL()}, {state,i});
   frames.push(await sharp(Buffer.from(capture.split(',')[1],'base64')).extract({left:470,top:260,width:430,height:440}).resize(195,200).toBuffer());
  }
  const row=await sharp({create:{width:1365,height:225,channels:3,background:'#30252f'}}).composite(frames.map((input,i)=>({input,left:i*195,top:25}))).png().toBuffer();rows.push(row);
  check(gender+' '+form+' all poses render',await p.evaluate(()=>BGTest.snapshot().errors===0));
 }
 await sharp({create:{width:1365,height:1350,channels:3,background:'#30252f'}}).composite(rows.map((input,i)=>({input,left:0,top:i*225}))).png().toFile('outputs/character-motion-contact.png');
 const stats=await p.evaluate(()=>{
  const m=BGTest.motion();let missing=[];
  for(const [g,forms] of Object.entries(m.plans))for(const [f,plan] of Object.entries(forms))for(const [s,list] of Object.entries(plan))for(const n of list){const bank=m.banks[g][f][['rise','fall','land'].includes(s)?'jump':s];if(!bank[n-1])missing.push([g,f,s,n]);}
  return {missing,metrics:Object.keys(BG_FRAME_METRICS).length,panthers:Object.values(m.panthers).flat().length};
 });
 check('Every authored motion index exists',stats.missing.length===0,stats);
 check('All 313 hero metrics and 30 complete panthers',stats.metrics===313&&stats.panthers===30);
 const scale=await p.evaluate(()=>{BGSetMale();document.querySelector('#formUpgraded').click();const c=document.querySelector('#game').getContext('2d'),old=c.drawImage,draws=[];c.drawImage=function(im,...args){if(im.src?.includes('/heroes/'))draws.push({path:im.src.split('/assets/')[1],scale:this.getTransform().d});return old.call(this,im,...args)};BGTest.renderPose('idle',0);BGTest.renderPose('jump',0);c.drawImage=old;return draws.map(d=>({height:BG_FRAME_METRICS['assets/'+d.path].height*d.scale}));});
 check('Male scepter standing and jump reference both 220px',scale.length===2&&scale.every(d=>Math.abs(d.height-220)<.01),scale);
 await p.evaluate(()=>{BGTest.load(3);BGTest.place(1050);BGTest.keys.ArrowRight=true;BGTest.advance(1);BGTest.keys.ArrowRight=false});await p.waitForTimeout(150);await p.screenshot({path:'outputs/repaired-panthers-in-game.png'});
 check('No browser errors or missing resources',errors.length===0,errors);
 fs.writeFileSync('outputs/character-motion-qa.json',JSON.stringify({checks,errors},null,2));console.log(JSON.stringify({passed:checks.filter(x=>x.pass).length,total:checks.length,failed:checks.filter(x=>!x.pass)}));await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
