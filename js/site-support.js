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

function renderSupport(){
  $('#appView').innerHTML=`<section class="support-page">
    <div class="support-hero"><div><div class="kicker">EXPERIENCE FIRST · DECIDE SECOND · PARTICIPATE YOUR WAY</div><h1>HELP<br><span>2FLY</span><br>CREATE.</h1></div><div class="support-hero-copy"><strong>THE WORK COMES FIRST.</strong><p>Most platforms put a price in front of the experience. This system reverses that. Listen, watch, play, create, or explore first. Then choose the form of participation that matches your interest, resources, and intent.</p><div class="support-principles"><span>EXPERIENCE FIRST</span><span>DECIDE THE VALUE</span><span>PARTICIPATE YOUR WAY</span></div></div></div>
    <div class="support-paths">
      <article class="support-path worth"><span>01</span><div class="support-icon">♥</div><small>DIRECT APPRECIATION · LIVE</small><h2>PAY WHAT IT'S WORTH</h2><p>Choose any amount that honestly reflects the value of the work or experience to you.</p><ul><li>No approval required</li><li>No suggested amount</li><li>Supports independent creation</li></ul><a href="https://support.2flyKeithLogan.com/pay-what-its-worth">ENTER YOUR AMOUNT →</a></article>
      <article class="support-path invest"><span>02</span><div class="support-icon">↗</div><small>SPECIFIC PROJECT · DRAFT MODE</small><h2>INVEST IN A PROJECT</h2><p>Build a clear proposal around an album, video, Playable, mission, production, or new idea.</p><ul><li>Project and role</li><li>Proposed budget</li><li>Timeline and desired outcome</li></ul><button data-support-panel="investment" type="button">BUILD A PROPOSAL →</button></article>
      <article class="support-path live"><span>03</span><div class="support-icon">●</div><small>LIVE CONNECTION · DRAFT MODE</small><h2>IN-PERSON EXPERIENCE</h2><p>Prepare a performance, presentation, workshop, demonstration, discussion, or speaking request.</p><ul><li>Date and location</li><li>Audience and format</li><li>Budget and expectations</li></ul><button data-support-panel="booking" type="button">BUILD A REQUEST →</button></article>
      <article class="support-path posted"><span>04</span><div class="support-icon">⌁</div><small>STAY CONNECTED · LOCAL PREVIEW</small><h2>KEEP ME POSTED</h2><p>Save the kinds of 2Fly updates you want to hear about while the live mailing-list connection is finalized.</p><ul><li>Releases</li><li>Playable launches</li><li>Shows and project updates</li></ul><button data-support-panel="posted" type="button">SET PREFERENCES →</button></article>
    </div>
    <div class="support-workspace" id="supportWorkspace"><div class="support-workspace-empty"><span>SELECT A PARTICIPATION PATH</span><h2>BUILD THE NEXT MOVE.</h2><p>The proposal and booking tools below are clearly marked as local draft tools until their live submission connection is ready.</p></div></div>
    <section class="support-origin"><div class="kicker">WHY THIS MATTERS</div><h2>HELP THE ORIGINATOR KEEP CREATING.</h2><p>2Fly is building music, visuals, Playable Experiences, software, documentary work, and creative experiments independently. Support can be money, a project proposal, a booking, useful feedback, or simply helping the right people discover the work.</p><a href="#featured" data-route="featured">RETURN TO THE WORK →</a></section>
  </section>`;
  $$('[data-support-panel]').forEach(b=>b.onclick=()=>openSupportPanel(b.dataset.supportPanel));
}
function openSupportPanel(kind){
  const w=$('#supportWorkspace');if(!w)return;
  if(kind==='investment')w.innerHTML=supportDraftForm('investment','PROJECT PROPOSAL','Build a project investment proposal','Project / idea','Proposed role, budget, timeline, and desired outcome');
  if(kind==='booking')w.innerHTML=supportDraftForm('booking','IN-PERSON REQUEST','Build an in-person experience request','Event / organization','Date, location, audience, budget, format, and expectations');
  if(kind==='posted')w.innerHTML=`<form class="support-form" id="supportPostedForm"><div class="form-head"><span>LOCAL PREVIEW</span><h2>KEEP ME POSTED.</h2><p>These preferences save on this device only until the live list is connected.</p></div><label>NAME<input name="name" autocomplete="name" required></label><label>EMAIL<input name="email" type="email" autocomplete="email" required></label><label>WHAT SHOULD 2FLY KEEP YOU POSTED ABOUT?<select name="interest"><option value="all">Everything 2Fly</option><option value="releases">Music and video releases</option><option value="playables">Playable Experiences</option><option value="shows">Shows and in-person experiences</option><option value="projects">Projects and missions</option></select></label><button type="submit">SAVE PREFERENCES ON THIS DEVICE</button><output id="supportFormStatus"></output></form>`;
  bindSupportForm(kind);
  w.scrollIntoView({behavior:'smooth',block:'center'});
}
function supportDraftForm(kind,kicker,title,subject,details){return`<form class="support-form" id="supportDraftForm" data-kind="${kind}"><div class="form-head"><span>${kicker} · LOCAL DRAFT</span><h2>${title.toUpperCase()}</h2><p>This saves a draft on this device. It does not submit the request yet.</p></div><label>NAME<input name="name" autocomplete="name" required></label><label>EMAIL<input name="email" type="email" autocomplete="email" required></label><label>${subject.toUpperCase()}<input name="subject" required></label><label class="full">DETAILS<textarea name="details" rows="7" placeholder="${details}" required></textarea></label><button type="submit">SAVE DRAFT ON THIS DEVICE</button><output id="supportFormStatus"></output></form>`}
function bindSupportForm(kind){
  const form=$('#supportPostedForm')||$('#supportDraftForm');if(!form)return;
  const key=`2fly-support-${kind}`;
  try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved){Object.entries(saved).forEach(([name,value])=>{const field=form.elements.namedItem(name);if(field&&name!=='savedAt')field.value=value})}}catch{}
  form.onsubmit=e=>{e.preventDefault();const data=Object.fromEntries(new FormData(form).entries());data.savedAt=new Date().toISOString();try{localStorage.setItem(key,JSON.stringify(data));$('#supportFormStatus').textContent=kind==='posted'?'Preferences saved locally on this device.':'Draft saved locally on this device. Nothing has been submitted.'}catch{$('#supportFormStatus').textContent='This browser blocked local saving. Copy your details before leaving.'}};
}
