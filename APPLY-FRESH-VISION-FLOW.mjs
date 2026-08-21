import fs from 'fs';
import path from 'path';

const root = process.cwd();
const mainPath = path.join(root, 'src', 'main.js');
const cssPath = path.join(root, 'src', 'styles', 'app.css');

if (!fs.existsSync(mainPath)) {
  console.error('ERROR: Run this from the XPLAYEngine repository root.');
  process.exit(1);
}

let src = fs.readFileSync(mainPath, 'utf8');
const backupPath = mainPath + '.before-fresh-vision-flow.bak';
if (!fs.existsSync(backupPath)) fs.writeFileSync(backupPath, src);

function findFunctionRange(code, name) {
  const marker = `function ${name}(`;
  const start = code.indexOf(marker);
  if (start < 0) throw new Error(`Could not find ${marker}`);
  const brace = code.indexOf('{', start);
  if (brace < 0) throw new Error(`Could not find opening brace for ${name}`);

  let i = brace, depth = 0;
  let mode = 'code', quote = '', escaped = false;
  for (; i < code.length; i++) {
    const c = code[i], n = code[i+1];

    if (mode === 'line') { if (c === '\n') mode = 'code'; continue; }
    if (mode === 'block') { if (c === '*' && n === '/') { i++; mode='code'; } continue; }
    if (mode === 'string') {
      if (escaped) { escaped = false; continue; }
      if (c === '\\') { escaped = true; continue; }
      if (c === quote) mode = 'code';
      continue;
    }
    if (mode === 'template') {
      if (escaped) { escaped = false; continue; }
      if (c === '\\') { escaped = true; continue; }
      if (c === '`') { mode = 'code'; continue; }
      // braces inside template interpolations are rare in these replacement targets;
      // counting them still preserves overall balance.
    } else {
      if (c === '/' && n === '/') { i++; mode='line'; continue; }
      if (c === '/' && n === '*') { i++; mode='block'; continue; }
      if (c === '"' || c === "'") { mode='string'; quote=c; continue; }
      if (c === '`') { mode='template'; continue; }
    }

    if (c === '{') depth++;
    if (c === '}') {
      depth--;
      if (depth === 0) return [start, i + 1];
    }
  }
  throw new Error(`Could not parse ${name}`);
}

function replaceFunction(name, replacement) {
  const [a,b] = findFunctionRange(src, name);
  src = src.slice(0,a) + replacement.trim() + '\n\n' + src.slice(b);
  console.log(`Replaced ${name}`);
}

function renameFunction(oldName,newName){
  const marker=`function ${oldName}(`;
  if(!src.includes(marker)) throw new Error(`Could not find ${oldName}`);
  src=src.replace(marker,`function ${newName}(`);
  console.log(`Renamed ${oldName} -> ${newName}`);
}

// Preserve the existing final build wiring behind a fresh Step 10 shell.
if (src.includes('function renderStep10(') && !src.includes('function renderLegacyStep10(')) {
  renameFunction('renderStep10','renderLegacyStep10');
}

replaceFunction('getStepLabel', `
function getStepLabel(s) {
  const labels = {
    1:'Source',
    3:'Vision',
    4:'Game',
    5:'Direction',
    6:'Feel',
    7:'Look',
    8:'Extras',
    9:'Review',
    10:'Build'
  };
  return labels[s] || '';
}`);

replaceFunction('renderStep1', `
function renderStep1(container) {
  state.creationLane = 'screenshot';
  container.innerHTML = \`
    <div class="fv-wrap">
      <div class="fv-kicker">SOURCE IMAGE</div>
      <h2 class="fv-title">Start with the picture you want XPLAY to understand</h2>
      <p class="fv-lead">Upload one image. XPLAY sends that exact image to Gemini multimodal vision before any game decisions are made.</p>

      <div class="fv-trust">
        <span>● GEMINI VISION</span>
        <span>● CURRENT IMAGE ONLY</span>
        <span>● NO GENERIC FALLBACKS</span>
      </div>

      <div id="mainImageDrop" class="fv-drop">
        <div class="fv-dropIcon">◫</div>
        <b>Drop an image here</b>
        <span>PNG, JPG or JPEG</span>
        <button class="btn primary" id="uploadMainBtn">CHOOSE IMAGE</button>
        <input id="mainImageFile" type="file" accept="image/png,image/jpeg" hidden />
      </div>
      <p class="fv-note">Nothing is analyzed until you confirm the image on the next screen.</p>
    </div>\`;

  const drop=container.querySelector('#mainImageDrop');
  const input=container.querySelector('#mainImageFile');
  const button=container.querySelector('#uploadMainBtn');
  button.onclick=(e)=>{e.stopPropagation();input.click();};
  drop.onclick=()=>input.click();
  drop.ondragover=(e)=>{e.preventDefault();drop.classList.add('is-over');};
  drop.ondragleave=()=>drop.classList.remove('is-over');
  drop.ondrop=async(e)=>{
    e.preventDefault();drop.classList.remove('is-over');
    const f=e.dataTransfer.files?.[0]; if(f) await processMainImage(f,'screenshot');
  };
  input.onchange=async()=>{const f=input.files?.[0];if(f)await processMainImage(f,'screenshot');};
}`);

replaceFunction('renderStep2', `
function renderStep2(container) {
  const fileName=state.media.primary?.file?.name||'uploaded image';
  const img=state.media.primary?.dataUrl||'';
  container.innerHTML=\`
    <div class="fv-wrap">
      <div class="fv-kicker">VISION CHECK</div>
      <h2 class="fv-title">Analyze this exact image</h2>
      <p class="fv-lead">Gemini will describe what is actually visible: subject, scene, opponents, objects, HUD, camera, colors and gameplay cues.</p>

      <div class="fv-preview">
        <img src="\${img}" alt="\${fileName}">
        <div><b>\${fileName}</b><span id="visionBadge" class="fv-badge">READY</span></div>
      </div>

      <div id="analysisStatus" class="fv-status">Ready for Gemini multimodal analysis.</div>
      <div class="fv-actions">
        <button class="btn primary" id="runAnalysisBtn">ANALYZE WITH GEMINI</button>
        <button class="btn ghost" id="replaceImageBtn">CHANGE IMAGE</button>
      </div>
    </div>\`;

  const analyzeBtn=container.querySelector('#runAnalysisBtn');
  const replaceBtn=container.querySelector('#replaceImageBtn');
  const status=container.querySelector('#analysisStatus');
  const badge=container.querySelector('#visionBadge');

  replaceBtn.onclick=()=>goToStep(1);
  analyzeBtn.onclick=async()=>{
    analyzeBtn.disabled=true;
    analyzeBtn.textContent='GEMINI IS LOOKING…';
    badge.textContent='ANALYZING';
    status.innerHTML='<b>Live vision:</b> reading the uploaded pixels. This can take several seconds.';
    try{
      state.styleDNA=await withTimeout(analyzeImageStyle(state.media.primary.dataUrl),8000,'Style scan timed out');
    }catch{
      state.styleDNA=fallbackDNA('style-only');
    }

    const prompt='Describe this exact image in depth for XPLAY. Identify the main subject/player candidate, visible characters or opponents, environment, objects and props, readable HUD/text, camera/composition, action/gameplay signals, dominant colors, and the most compatible game types. Do not invent anything that is not visible.';
    try{
      const extraction=await safeAnalyzeVisualSource(state.media.primary.dataUrl,prompt);
      if(!extraction?.ok || !extraction?.analysis) throw new Error(extraction?.error||'Gemini returned no usable analysis');
      state.extraction=extraction;
      state.compatiblePLXRecommendations=getDetailedRecommendations(extraction.analysis);
      state.analysisCorrected=null;
      badge.textContent='VISION CONNECTED';
      status.innerHTML='<b>Analysis complete.</b> Gemini vision returned a source-grounded read of this image.';
      setTimeout(()=>goToStep(3),250);
    }catch(e){
      console.error(e);
      state.extraction={ok:false,analysis:null,assets:{},analysisMode:'Gemini vision error',error:e.message};
      badge.textContent='VISION ERROR';
      status.innerHTML=\`<b>Gemini did not complete the analysis.</b><br>\${String(e.message||e)}<br><br>No local semantic substitute was used. Retry when the live service is available.\`;
      analyzeBtn.disabled=false;
      analyzeBtn.textContent='RETRY GEMINI ANALYSIS';
    }
  };
}`);

replaceFunction('renderStep3', `
function renderStep3(container) {
  const a=state.extraction?.analysis;
  if(!a){
    container.innerHTML='<div class="fv-wrap"><div class="fv-error"><b>No Gemini analysis is available.</b><br>Return to the previous step and analyze the image again.</div><button class="btn primary" id="backVision">BACK TO VISION</button></div>';
    container.querySelector('#backVision').onclick=()=>goToStep(2);
    return;
  }
  const desc=state.extraction?.description||a.fullDescription||a.description||'';
  const source=String(a.analysisSource||'');
  const connected=source.includes('gemini') || state.extraction?.provider==='gemini';
  const arr=(v)=>Array.isArray(v)?v.join(' · '):(v||'None confidently identified');

  container.innerHTML=\`
    <div class="fv-wrap fv-wide">
      <div class="fv-kicker">VISION REPORT</div>
      <div class="fv-headingRow"><div><h2 class="fv-title">Here is what Gemini sees</h2><p class="fv-lead">This report becomes the visual truth used by the rest of the build.</p></div><span class="fv-badge \${connected?'good':'bad'}">\${connected?'GEMINI CONNECTED':'VISION NOT VERIFIED'}</span></div>

      \${desc?\`<div class="fv-description"><b>Image description</b><p>\${desc}</p></div>\`:''}

      <div class="fv-grid">
        <div class="fv-card"><small>PLAYER / MAIN SUBJECT</small><b>\${a.player||'unknown'}</b></div>
        <div class="fv-card"><small>ENVIRONMENT</small><b>\${a.environment||'unknown'}</b></div>
        <div class="fv-card"><small>CAMERA / COMPOSITION</small><b>\${a.camera||a.sceneType||'unknown'}</b></div>
        <div class="fv-card"><small>OPPONENTS / CHARACTERS</small><b>\${arr(a.enemies)}</b></div>
        <div class="fv-card"><small>OBJECTS / PROPS</small><b>\${a.notableObjects||arr(a.objects)}</b></div>
        <div class="fv-card"><small>HUD / READABLE UI</small><b>\${arr(a.hud)}</b></div>
        <div class="fv-card"><small>GAMEPLAY SIGNALS</small><b>\${arr(a.gameplaySignals)}</b></div>
        <div class="fv-card"><small>DOMINANT COLORS</small><b>\${a.dominantColors||'unknown'}</b></div>
      </div>

      <div class="fv-actions">
        <button class="btn primary" id="confirmVision">YES — USE THIS VISION REPORT</button>
        <button class="btn ghost" id="editVision">CORRECT SOMETHING</button>
        <button class="btn ghost" id="reanalyzeVision">ANALYZE AGAIN</button>
      </div>

      <div id="visionCorrections" class="fv-corrections" hidden>
        <label>Main subject<input id="fvPlayer" value="\${String(a.player||'').replace(/"/g,'&quot;')}"></label>
        <label>Environment<input id="fvEnvironment" value="\${String(a.environment||'').replace(/"/g,'&quot;')}"></label>
        <label>Important objects<input id="fvObjects" value="\${String(a.notableObjects||'').replace(/"/g,'&quot;')}"></label>
        <button class="btn primary" id="saveVisionCorrection">SAVE CORRECTION</button>
      </div>
    </div>\`;

  container.querySelector('#confirmVision').onclick=()=>goToStep(4);
  container.querySelector('#reanalyzeVision').onclick=()=>goToStep(2);
  const corrections=container.querySelector('#visionCorrections');
  container.querySelector('#editVision').onclick=()=>{corrections.hidden=!corrections.hidden;};
  container.querySelector('#saveVisionCorrection').onclick=()=>{
    const corrected={
      player:container.querySelector('#fvPlayer').value.trim()||a.player,
      environment:container.querySelector('#fvEnvironment').value.trim()||a.environment,
      notableObjects:container.querySelector('#fvObjects').value.trim()||a.notableObjects,
      analysisSource:'user-corrected-from-gemini'
    };
    state.analysisCorrected={player:corrected.player,environment:corrected.environment,importantObject:corrected.notableObjects};
    state.extraction.analysis={...a,...corrected};
    goToStep(3);
  };
}`);

replaceFunction('renderStep4', `
function renderStep4(container) {
  const recs=getDetailedRecommendations(state.extraction?.analysis||{});
  state.compatiblePLXRecommendations=recs;
  const labels={runner:'Runner',dodge:'Dodge',collect:'Collect',rhythm:'Rhythm',puzzle:'Puzzle',fps:'First-Person Shooter',fighting:'Fighting / Beat-em-up',openworld:'Open World',racing:'Racing',platformer:'Platformer'};

  container.innerHTML=\`
    <div class="fv-wrap fv-wide">
      <div class="fv-kicker">GAME DIRECTION</div>
      <h2 class="fv-title">Choose what kind of game this becomes</h2>
      <p class="fv-lead">Gemini can recommend. You make the final choice. Once selected, the engine is locked and downstream builders are not allowed to reinterpret it.</p>

      \${recs.length?\`<div class="fv-recs"><b>BEST FITS FROM THE IMAGE</b>\${recs.map((r,i)=>\`<div><span>#\${i+1} \${labels[r.engine]||r.engine}</span><strong>\${Math.round(r.confidence)}%</strong><p>\${r.reason}</p></div>\`).join('')}</div>\`:''}

      <div class="fv-engineGrid">
        \${builtIns.map(([, ,engine,label,desc])=>\`<button class="fv-engine \${state.chosenEngine===engine?'selected':''}" data-engine="\${engine}"><span>\${label}</span><small>\${desc}</small>\${recs.some(r=>r.engine===engine)?'<em>AI FIT</em>':''}</button>\`).join('')}
      </div>
      <button class="btn primary fv-full" id="lockEngine" \${state.chosenEngine?'':'disabled'}>LOCK GAME TYPE & CONTINUE</button>
    </div>\`;

  const lock=container.querySelector('#lockEngine');
  container.querySelectorAll('.fv-engine').forEach(card=>card.onclick=()=>{
    state.chosenEngine=card.dataset.engine; chosenEngine=state.chosenEngine;
    container.querySelectorAll('.fv-engine').forEach(x=>x.classList.toggle('selected',x===card));
    lock.disabled=false;
  });
  lock.onclick=()=>goToStep(5);
}`);

replaceFunction('renderStep5', `
function renderStep5(container) {
  const a=state.extraction?.analysis||{};
  if(!state.prompt) state.prompt=generatePolishedPrompt(state.chosenEngine,a,'');
  const preserve=state.screenshotGuide?.doNotChange||'';
  container.innerHTML=\`
    <div class="fv-wrap">
      <div class="fv-kicker">PLAY DIRECTION</div>
      <h2 class="fv-title">Tell XPLAY what the player should do</h2>
      <p class="fv-lead">The image defines the world. Your words define the playable objective.</p>
      <label class="fv-field">CORE GAMEPLAY
        <textarea id="fvPrompt" rows="7" placeholder="Example: Control the fighter, move left and right, defeat each enemy, then advance through the industrial stage.">\${state.prompt||''}</textarea>
      </label>
      <label class="fv-field">MUST KEEP RECOGNIZABLE <span>optional</span>
        <input id="fvPreserve" value="\${String(preserve).replace(/"/g,'&quot;')}" placeholder="Example: white gi fighter, three enemies, night industrial skyline, combat HUD">
      </label>
      <button class="btn primary fv-full" id="fvDirectionNext">CONTINUE</button>
    </div>\`;
  container.querySelector('#fvDirectionNext').onclick=()=>{
    state.prompt=container.querySelector('#fvPrompt').value.trim();
    state.screenshotGuide=state.screenshotGuide||defaultScreenshotGuide();
    state.screenshotGuide.doNotChange=container.querySelector('#fvPreserve').value.trim();
    state.screenshotGuide.interpretationConfirmed=true;
    goToStep(6);
  };
}`);

replaceFunction('renderStep6', `
function renderStep6(container) {
  const options=[
    ['action','Action','Fast, responsive, impact-heavy'],
    ['exploration','Exploration','Room to move, discover and read the world'],
    ['challenge','Challenge','Sharper timing and more demanding encounters'],
    ['story','Story','Cinematic pacing and clearer narrative beats'],
    ['rhythm','Rhythm','Timing, beat and combo-driven pacing'],
    ['relaxed','Relaxed','Low-pressure, smooth and accessible']
  ];
  container.innerHTML=\`
    <div class="fv-wrap">
      <div class="fv-kicker">GAME FEEL</div>
      <h2 class="fv-title">How should it feel to play?</h2>
      <p class="fv-lead">This changes pacing and response—not the game type you already locked.</p>
      <div class="fv-choiceGrid">\${options.map(([id,title,desc])=>\`<button class="fv-choice \${state.feel===id?'selected':''}" data-feel="\${id}"><b>\${title}</b><small>\${desc}</small></button>\`).join('')}</div>
      <button class="btn primary fv-full" id="fvFeelNext" \${state.feel?'':'disabled'}>CONTINUE</button>
    </div>\`;
  const next=container.querySelector('#fvFeelNext');
  container.querySelectorAll('[data-feel]').forEach(x=>x.onclick=()=>{
    state.feel=x.dataset.feel;
    container.querySelectorAll('[data-feel]').forEach(y=>y.classList.toggle('selected',y===x));
    next.disabled=false;
  });
  next.onclick=()=>goToStep(7);
}`);

replaceFunction('renderStep7', `
function renderStep7(container) {
  const styles=[
    ['source-match','Match the source','Stay closest to the uploaded image’s visual language'],
    ['speed-16','Arcade 16','Polished sprite-based arcade interpretation'],
    ['cinematic-photo','Cinematic','Dramatic lighting and dimensional realism'],
    ['graphic-novel','Graphic novel','Illustrated ink, panels and impact accents'],
    ['block-sandbox','Neon','High-energy futuristic glow and color'],
    ['storybook','Animated','Clean illustrated characters and environments']
  ];
  container.innerHTML=\`
    <div class="fv-wrap">
      <div class="fv-kicker">VISUAL TREATMENT</div>
      <h2 class="fv-title">Choose the final art treatment</h2>
      <p class="fv-lead">The source image remains visual truth. Style changes presentation, not subject identity or scene facts.</p>
      <div class="fv-choiceGrid">\${styles.map(([id,title,desc])=>\`<button class="fv-choice \${state.style===id?'selected':''}" data-style="\${id}"><b>\${title}</b><small>\${desc}</small></button>\`).join('')}</div>
      <button class="btn primary fv-full" id="fvStyleNext" \${state.style?'':'disabled'}>CONTINUE</button>
    </div>\`;
  const next=container.querySelector('#fvStyleNext');
  container.querySelectorAll('[data-style]').forEach(x=>x.onclick=()=>{
    state.style=x.dataset.style;
    container.querySelectorAll('[data-style]').forEach(y=>y.classList.toggle('selected',y===x));
    next.disabled=false;
  });
  next.onclick=()=>goToStep(8);
}`);

replaceFunction('renderStep8', `
function renderStep8(container) {
  container.innerHTML=\`
    <div class="fv-wrap">
      <div class="fv-kicker">OPTIONAL EXTRAS</div>
      <h2 class="fv-title">Add supporting media—or keep the build clean</h2>
      <p class="fv-lead">Extras can influence sound, characters or props. They do not replace the primary Gemini vision report.</p>

      <div class="fv-extraGrid">
        <label class="fv-uploadMini"><b>Extra image / asset</b><span>Optional secondary visual reference</span><input id="fvExtra1" type="file"></label>
        <label class="fv-uploadMini"><b>Audio / music</b><span>Optional soundtrack or sound reference</span><input id="fvExtra2" type="file"></label>
      </div>
      <button class="btn primary fv-full" id="fvExtrasNext">CONTINUE TO REVIEW</button>
    </div>\`;

  const e1=container.querySelector('#fvExtra1');
  const e2=container.querySelector('#fvExtra2');
  const load=async(input,key)=>{
    const f=input.files?.[0]; if(!f)return;
    state.media[key]={file:f,dataUrl:await readDataUrl(f),type:f.type,role:key==='extra1'?'supporting-visual':'audio'};
  };
  e1.onchange=()=>load(e1,'extra1');
  e2.onchange=()=>load(e2,'extra2');
  container.querySelector('#fvExtrasNext').onclick=()=>goToStep(9);
}`);

// Replace Step 9 with a clean build contract page.
if (src.includes('function renderStep9(')) {
replaceFunction('renderStep9', `
function renderStep9(container) {
  const a=state.extraction?.analysis||{};
  const rec=state.compatiblePLXRecommendations?.find(r=>r.engine===state.chosenEngine);
  const visionOk=String(a.analysisSource||'').includes('gemini') || state.extraction?.provider==='gemini';
  container.innerHTML=\`
    <div class="fv-wrap fv-wide">
      <div class="fv-kicker">BUILD CONTRACT</div>
      <h2 class="fv-title">Review exactly what XPLAY is about to build</h2>
      <p class="fv-lead">Nothing below should come from an old prototype or unrelated template.</p>
      <div class="fv-contract">
        <div><small>SOURCE</small><b>\${state.media.primary?.file?.name||'uploaded image'}</b></div>
        <div><small>VISION</small><b>\${visionOk?'Gemini multimodal — verified':'NOT VERIFIED'}</b></div>
        <div><small>PLAYER / SUBJECT</small><b>\${a.player||'unknown'}</b></div>
        <div><small>ENVIRONMENT</small><b>\${a.environment||'unknown'}</b></div>
        <div><small>LOCKED GAME TYPE</small><b>\${String(state.chosenEngine||'').toUpperCase()}</b></div>
        <div><small>ENGINE AUTHORITY</small><b>USER SELECTED</b></div>
        <div><small>AI FIT EVIDENCE</small><b>\${rec?Math.round(rec.confidence)+'% — '+rec.reason:'User override accepted'}</b></div>
        <div><small>FEEL</small><b>\${state.feel||'standard'}</b></div>
        <div><small>STYLE</small><b>\${state.style||'source-match'}</b></div>
        <div class="wide"><small>PLAY DIRECTION</small><b>\${state.prompt||'No direction supplied'}</b></div>
        <div class="wide"><small>MUST KEEP</small><b>\${state.screenshotGuide?.doNotChange||'Use the Gemini vision report as visual truth'}</b></div>
      </div>
      <div class="fv-actions">
        <button class="btn primary" id="fvApproveBuild" \${visionOk?'':'disabled'}>APPROVE BUILD CONTRACT</button>
        <button class="btn ghost" id="fvBackVision">BACK TO VISION</button>
      </div>
      \${visionOk?'':'<div class="fv-error">Build is blocked because Gemini vision is not verified.</div>'}
    </div>\`;
  container.querySelector('#fvApproveBuild').onclick=()=>goToStep(10);
  container.querySelector('#fvBackVision').onclick=()=>goToStep(3);
}`);
}

// New Step 10: fresh shell, but preserve the existing proven build button/event wiring invisibly.
const freshStep10 = `
function renderStep10(container) {
  container.innerHTML=\`
    <div class="fv-wrap">
      <div class="fv-kicker">READY TO BUILD</div>
      <h2 class="fv-title">Build from the approved contract</h2>
      <p class="fv-lead">XPLAY will now hand the verified Gemini vision, your locked game type and your direction to the build pipeline.</p>
      <div class="fv-finalLock">
        <span>VISION <b>LOCKED</b></span>
        <span>ENGINE <b>\${String(state.chosenEngine||'').toUpperCase()}</b></span>
        <span>SOURCE <b>CURRENT IMAGE</b></span>
      </div>
      <button class="btn primary fv-full" id="fvLaunchBuild">BUILD THIS PLX</button>
      <div id="fvBuildBridge" style="display:none"></div>
      <div id="fvBuildStatus" class="fv-status" style="display:none">Starting build…</div>
    </div>\`;

  container.querySelector('#fvLaunchBuild').onclick=()=>{
    const status=container.querySelector('#fvBuildStatus');
    status.style.display='block';
    status.textContent='Starting the XPLAY build pipeline…';

    const bridge=container.querySelector('#fvBuildBridge');
    renderLegacyStep10(bridge);

    const buttons=[...bridge.querySelectorAll('button')];
    const buildButton=buttons.find(b=>/build|create|generate|make|compile/i.test(b.textContent||'')) || buttons.find(b=>b.classList.contains('primary'));
    if(!buildButton){
      status.innerHTML='<b>Build bridge could not locate the existing launch control.</b> No build was started.';
      return;
    }
    buildButton.click();
  };
}`;
if (!src.includes('function renderStep10(')) {
  const insertAt = src.indexOf('function renderLegacyStep10(');
  if (insertAt < 0) throw new Error('Legacy Step 10 was not preserved.');
  src = src.slice(0, insertAt) + freshStep10.trim() + '\n\n' + src.slice(insertAt);
  console.log('Inserted fresh renderStep10');
}

replaceFunction('safeAnalyzeVisualSource', `
async function safeAnalyzeVisualSource(dataUrl, prompt) {
  try {
    const result = await withTimeout(
      analyzeVisualSource(dataUrl,prompt),
      60000,
      'Gemini vision timed out after 60 seconds'
    );
    if(!result?.ok || !result?.analysis) throw new Error(result?.error||'Gemini returned no analysis');
    return {...result,analysisMode:result.mode==='vision-drop-proven'?'Gemini Vision Drop Proven':'Gemini multimodal vision'};
  } catch(e) {
    console.warn('Gemini vision failed. No semantic fallback will be substituted.',e);
    return {ok:false,analysis:null,assets:{},analysisMode:'Gemini vision unavailable',error:e.message};
  }
}`);

// Ensure processMainImage always begins the fresh path.
src = src.replace(
  /state\.creationLane\s*=\s*lane;/,
  "state.creationLane = 'screenshot';"
);

// Remove old lane wording from the top-level comment/state display only.
src = src.replace("creationLane:'standard', // 'standard' or 'screenshot'", "creationLane:'screenshot', // fresh Gemini-first creator flow");

// Add the new styles once.
let css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath,'utf8') : '';
const marker = '/* XPLAY FRESH VISION FLOW */';
if(!css.includes(marker)){
css += `

${marker}
.fv-wrap{max-width:680px;margin:0 auto;padding:8px 0 24px;color:var(--navy)}
.fv-wide{max-width:820px}
.fv-kicker{display:inline-flex;padding:6px 10px;border-radius:999px;background:#e7f7f5;color:#078f89;font-size:11px;font-weight:900;letter-spacing:.08em}
.fv-title{font-size:30px;line-height:1.05;margin:14px 0 8px}
.fv-lead{color:var(--soft);line-height:1.55;margin:0 0 20px}
.fv-trust{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 18px}.fv-trust span{font-size:10px;font-weight:800;background:#f6fbfb;border:1px solid var(--line);padding:7px 9px;border-radius:999px}
.fv-drop{border:2px dashed var(--teal);border-radius:22px;background:#effaf9;padding:48px 24px;text-align:center;display:grid;gap:10px;place-items:center;cursor:pointer;transition:.2s}
.fv-drop.is-over{transform:scale(1.01);background:#ddf6f3}.fv-dropIcon{font-size:42px}.fv-drop span,.fv-note{color:var(--soft);font-size:13px}
.fv-preview{background:#fff;border:1px solid var(--line);border-radius:18px;padding:12px;box-shadow:var(--shadow)}
.fv-preview img{width:100%;max-height:390px;object-fit:contain;border-radius:12px;background:#07131e}.fv-preview>div{display:flex;justify-content:space-between;align-items:center;padding:10px 4px 2px;gap:10px}
.fv-badge{font-size:10px;font-weight:900;padding:6px 9px;border-radius:999px;background:#eef3f4;color:#51606e}.fv-badge.good{background:#dff8ee;color:#137a55}.fv-badge.bad{background:#ffe9e9;color:#b03535}
.fv-status,.fv-error{margin:14px 0;padding:14px 16px;border-radius:14px;background:#f5fbfb;border:1px solid var(--line);line-height:1.45}.fv-error{background:#fff0f0;border-color:#f2c2c2;color:#9b2d2d}
.fv-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}.fv-full{width:100%;margin-top:20px;padding:14px}
.fv-headingRow{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}.fv-description{background:#0d223d;color:white;border-radius:18px;padding:18px;margin:18px 0}.fv-description p{margin:7px 0 0;line-height:1.55;color:#dfe9ef}
.fv-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.fv-card{border:1px solid var(--line);border-radius:16px;padding:16px;background:#fff;display:grid;gap:7px}.fv-card small,.fv-contract small{font-size:10px;font-weight:900;color:#0b9992;letter-spacing:.06em}.fv-card b{font-size:13px;line-height:1.45}
.fv-corrections{margin-top:18px;border-top:1px solid var(--line);padding-top:16px}.fv-corrections label,.fv-field{display:grid;gap:7px;font-size:11px;font-weight:900;margin:12px 0}.fv-corrections input,.fv-field input,.fv-field textarea{width:100%;box-sizing:border-box;padding:12px;border:1px solid var(--line);border-radius:12px;font:inherit;font-weight:400;background:white}.fv-field span{color:var(--soft);font-weight:500}
.fv-recs{border:1px solid var(--line);background:#f5fbfb;border-radius:18px;padding:16px;margin:16px 0}.fv-recs>div{display:grid;grid-template-columns:1fr auto;gap:3px 10px;padding:10px 0;border-bottom:1px dashed var(--line)}.fv-recs>div:last-child{border-bottom:0}.fv-recs p{grid-column:1/-1;margin:0;color:var(--soft);font-size:12px}
.fv-engineGrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.fv-engine,.fv-choice{position:relative;text-align:left;padding:16px;border-radius:16px;border:1px solid var(--line);background:white;cursor:pointer;display:grid;gap:6px}.fv-engine.selected,.fv-choice.selected{border:2px solid var(--teal);background:#effaf9}.fv-engine span,.fv-choice b{font-weight:900;color:var(--navy)}.fv-engine small,.fv-choice small{color:var(--soft);line-height:1.35}.fv-engine em{position:absolute;right:10px;top:10px;font-size:9px;background:#dff8ee;color:#137a55;padding:4px 6px;border-radius:999px;font-style:normal;font-weight:900}
.fv-choiceGrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.fv-extraGrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.fv-uploadMini{display:grid;gap:8px;border:1px solid var(--line);border-radius:16px;padding:16px;background:white}.fv-uploadMini span{color:var(--soft);font-size:12px}
.fv-contract{display:grid;grid-template-columns:1fr 1fr;gap:12px}.fv-contract>div{display:grid;gap:6px;padding:14px;border:1px solid var(--line);border-radius:14px;background:white}.fv-contract .wide{grid-column:1/-1}.fv-contract b{font-size:13px;line-height:1.45}
.fv-finalLock{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:20px 0}.fv-finalLock span{border:1px solid var(--line);border-radius:14px;padding:14px;background:#fff;font-size:10px;color:var(--soft);display:grid;gap:5px}.fv-finalLock b{font-size:13px;color:var(--navy)}
@media(max-width:720px){.fv-grid,.fv-engineGrid,.fv-choiceGrid,.fv-extraGrid,.fv-contract,.fv-finalLock{grid-template-columns:1fr}.fv-contract .wide{grid-column:auto}.fv-headingRow{display:block}.fv-badge{display:inline-flex;margin-bottom:10px}}
`;
fs.writeFileSync(cssPath,css);
console.log('Added fresh Vision Flow styles');
}

fs.writeFileSync(mainPath, src);
console.log('');
console.log('XPLAY Fresh Vision Flow applied.');
console.log('Next: npm run build');
console.log('Then: git add . && git commit -m "Replace creator flow with Gemini-first Vision Flow" && git push origin main');
