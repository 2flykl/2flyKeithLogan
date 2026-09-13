// Native Help 2Fly Create route layered onto the shared shell.
const specialtyShellRoute=route;
const specialtyShellHome=renderHome;
const baseHelpModule=helpModule;

helpModule=function(){return`<section class="help-create-module"><div><small>INDEPENDENT WORK · COMMUNITY-SUPPORTED</small><h2>HELP 2FLY CREATE.</h2><p>Experience it first. If it connects with you, help move the next piece of the work forward.</p></div><a href="#support" data-route="support">HELP BUILD WHAT COMES NEXT <span>→</span></a></section><div class="help-ticker"><div class="ticker-track">${tick(helpTicker)}</div></div>`};

renderHome=function(){
  specialtyShellHome();
  const create=$('.home-actions .create');
  if(create){create.href='#support';create.dataset.route='support'}
};

route=function(){
  const raw=(location.hash||'#home').slice(1).split('?')[0];
  if(raw!=='support'){specialtyShellRoute();return}
  app.route='support';
  $$('#primaryNav [data-route]').forEach(a=>a.classList.remove('active'));
  document.body.dataset.route='support';
  renderSupport();
  window.scrollTo({top:0,left:0,behavior:'auto'});
  $('#appView').focus({preventScroll:true});
};

function supportCard({cls,num,symbol,scene,label,title,intent,copy,items,cta,type,url}){
  const action=url?`<a href="${url}">${cta} →</a>`:`<button data-support-panel="${type}" type="button">${cta} →</button>`;
  return `<article class="support-path ${cls}">
    <span>${num}</span>
    <div class="path-scene" aria-hidden="true"><b class="path-symbol">${symbol}</b><em>${scene}</em></div>
    <div class="support-path-content">
      <small>${label}</small>
      <h2>${title}</h2>
      <div class="path-intent">${intent}</div>
      <p>${copy}</p>
      <ul>${items.map(i=>`<li>${i}</li>`).join('')}</ul>
      ${action}
    </div>
  </article>`;
}

function renderSupport(){
  const cards=[
    {cls:'worth',num:'01',symbol:'♥',scene:'VALUE / GRATITUDE',label:'DIRECT APPRECIATION · LIVE',title:"PAY WHAT IT'S WORTH",intent:'I want to show appreciation now.',copy:'Choose any amount that honestly reflects what the work or experience meant to you.',items:['You choose the amount','No approval or proposal','Direct support for independent creation'],cta:'ENTER YOUR AMOUNT',url:'https://support.2flyKeithLogan.com/pay-what-its-worth'},
    {cls:'invest',num:'02',symbol:'↗',scene:'BUILD / GROW',label:'SPECIFIC PROJECT · DRAFT MODE',title:'INVEST IN A PROJECT',intent:'I see potential and want to build with it.',copy:'Shape a serious proposal around an album, video, Playable, mission, production, or new idea.',items:['Name the project and role','Set a working budget','Define timeline and outcome'],cta:'BUILD A PROPOSAL',type:'investment'},
    {cls:'live',num:'03',symbol:'●',scene:'PEOPLE / PRESENCE',label:'LIVE CONNECTION · DRAFT MODE',title:'IN-PERSON EXPERIENCE',intent:'I want to bring this energy into a room.',copy:'Start a performance, presentation, workshop, demonstration, discussion, or speaking request.',items:['Date and location','Audience and format','Budget and expectations'],cta:'BUILD A REQUEST',type:'booking'},
    {cls:'posted',num:'04',symbol:'⌁',scene:'SIGNAL / CONTINUITY',label:'STAY CONNECTED · LOCAL PREVIEW',title:'KEEP ME POSTED',intent:'I want to stay close to what comes next.',copy:'Choose the kinds of 2Fly updates you want to hear about while the live list connection is finalized.',items:['Music and video releases','Playable launches','Shows and project updates'],cta:'SET PREFERENCES',type:'posted'}
  ];

  $('#appView').innerHTML=`<section class="support-page">
    <div class="support-hero">
      <div><div class="kicker">EXPERIENCE FIRST · DECIDE SECOND · PARTICIPATE YOUR WAY</div><h1>HELP <span>2FLY</span> CREATE.</h1></div>
      <div class="support-hero-copy"><strong>THE WORK COMES FIRST.</strong><p>Listen, watch, play, create, or explore first. Then choose the kind of participation that actually matches your interest, resources, and intent. No pressure. Pick the path that feels true.</p><div class="support-principles"><span>EXPERIENCE FIRST</span><span>DECIDE THE VALUE</span><span>PARTICIPATE YOUR WAY</span></div></div>
    </div>
    <div class="support-paths">${cards.map(supportCard).join('')}</div>
    <div class="support-workspace" id="supportWorkspace"><div class="support-workspace-empty"><span>SELECT A PARTICIPATION PATH</span><h2>BUILD THE NEXT MOVE.</h2><p>Each path is designed around a different kind of intent: appreciation, collaboration, live connection, or continuity. Proposal and booking tools remain clearly marked as local drafts until their live submission connection is ready.</p></div></div>
    <section class="support-origin"><div class="kicker">WHY THIS MATTERS</div><h2>HELP THE ORIGINATOR KEEP CREATING.</h2><p>2Fly is building music, visuals, Playable Experiences, software, documentary work, and creative experiments independently. Support can be money, a project proposal, a booking, useful feedback, or simply helping the right people discover the work.</p><a href="#featured" data-route="featured">RETURN TO THE WORK →</a></section>
  </section>`;
  $$('[data-support-panel]').forEach(b=>b.onclick=()=>openSupportPanel(b.dataset.supportPanel));
}
function openSupportPanel(kind){
  const w=$('#supportWorkspace');if(!w)return;
  if(kind==='investment')w.innerHTML=supportDraftForm('investment','PROJECT PROPOSAL','Build a project investment proposal','Project / idea','Project, proposed role, budget, timeline, and desired outcome');
  if(kind==='booking')w.innerHTML=supportDraftForm('booking','IN-PERSON REQUEST','Build an in-person experience request','Event / organization','Date, location, audience, budget, format, and expectations');
  if(kind==='posted')w.innerHTML=`<form class="support-form" id="supportPostedForm"><div class="form-head"><span>LOCAL PREVIEW</span><h2>KEEP ME POSTED.</h2><p>Choose what you actually want to hear about. These preferences save on this device only until the live list is connected.</p></div><label>NAME<input name="name" autocomplete="name" required></label><label>EMAIL<input name="email" type="email" autocomplete="email" required></label><label>WHAT SHOULD 2FLY KEEP YOU POSTED ABOUT?<select name="interest"><option value="all">Everything 2Fly</option><option value="releases">Music and video releases</option><option value="playables">Playable Experiences</option><option value="shows">Shows and in-person experiences</option><option value="projects">Projects and missions</option></select></label><button type="submit">SAVE PREFERENCES ON THIS DEVICE</button><output id="supportFormStatus"></output></form>`;
  bindSupportForm(kind);
  w.scrollIntoView({behavior:'smooth',block:'center'});
}
function supportDraftForm(kind,kicker,title,subject,details){return`<form class="support-form" id="supportDraftForm" data-kind="${kind}"><div class="form-head"><span>${kicker} · LOCAL DRAFT</span><h2>${title.toUpperCase()}</h2><p>Use this space to shape the idea clearly. It saves a draft on this device and does not submit the request yet.</p></div><label>NAME<input name="name" autocomplete="name" required></label><label>EMAIL<input name="email" type="email" autocomplete="email" required></label><label>${subject.toUpperCase()}<input name="subject" required></label><label class="full">DETAILS<textarea name="details" rows="7" placeholder="${details}" required></textarea></label><button type="submit">SAVE DRAFT ON THIS DEVICE</button><output id="supportFormStatus"></output></form>`}
function bindSupportForm(kind){
  const form=$('#supportPostedForm')||$('#supportDraftForm');if(!form)return;
  const key=`2fly-support-${kind}`;
  try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved){Object.entries(saved).forEach(([name,value])=>{const field=form.elements.namedItem(name);if(field&&name!=='savedAt')field.value=value})}}catch{}
  form.onsubmit=e=>{e.preventDefault();const data=Object.fromEntries(new FormData(form).entries());data.savedAt=new Date().toISOString();try{localStorage.setItem(key,JSON.stringify(data));$('#supportFormStatus').textContent=kind==='posted'?'Preferences saved locally on this device.':'Draft saved locally on this device. Nothing has been submitted.'}catch{$('#supportFormStatus').textContent='This browser blocked local saving. Copy your details before leaving.'}};
}
