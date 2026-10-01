// Native Help 2Fly Create route layered onto the shared shell.
const specialtyShellRoute=route;
const specialtyShellHome=renderHome;
const baseHelpModule=helpModule;

helpModule=function(){return`<section class="help-create-module"><div><small>INDEPENDENT WORK · COMMUNITY-SUPPORTED</small><h2>HELP 2FLY CREATE.</h2><p>Experience it first. If it connects with you, help move the next piece of the work forward.</p></div><div class="help-create-actions"><button type="button" data-feedback-open>LEAVE FEEDBACK</button><a href="https://buy.stripe.com/cNi3cx2NGaN53rk1HG0Fi00" target="_blank" rel="noopener noreferrer">HELP BUILD WHAT COMES NEXT <span>→</span></a></div></section><div class="help-ticker"><div class="ticker-track">${tick(helpTicker)}</div></div>`};

renderHome=function(){
  specialtyShellHome();
  const create=$('.home-actions .create');
  if(create){create.href='https://buy.stripe.com/cNi3cx2NGaN53rk1HG0Fi00';create.target='_blank';create.rel='noopener noreferrer';delete create.dataset.route}
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
  const action=url?`<a href="${url}" target="_blank" rel="noopener noreferrer">${cta} →</a>`:`<button data-support-panel="${type}" type="button">${cta} →</button>`;
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
    {cls:'worth',num:'01',symbol:'♥',scene:'VALUE / GRATITUDE',label:'DIRECT APPRECIATION · LIVE',title:"PAY WHAT IT'S WORTH",intent:'I want to show appreciation now.',copy:'Choose any amount that honestly reflects what the work or experience meant to you.',items:['You choose the amount','No approval or proposal','Direct support for independent creation'],cta:'ENTER YOUR AMOUNT',url:'https://buy.stripe.com/cNi3cx2NGaN53rk1HG0Fi00'},
    {cls:'invest',num:'02',symbol:'↗',scene:'BUILD / GROW',label:'SPECIFIC PROJECT · SEND A PROPOSAL',title:'INVEST IN A PROJECT',intent:'I see potential and want to build with it.',copy:'Shape a serious proposal around an album, video, Playable, mission, production, or new idea.',items:['Name the project and role','Set a working budget','Define timeline and outcome'],cta:'BUILD A PROPOSAL',type:'investment'},
    {cls:'live',num:'03',symbol:'●',scene:'PEOPLE / PRESENCE',label:'LIVE CONNECTION · SEND A REQUEST',title:'IN-PERSON EXPERIENCE',intent:'I want to bring this energy into a room.',copy:'Start a performance, presentation, workshop, demonstration, discussion, or speaking request.',items:['Date and location','Audience and format','Budget and expectations'],cta:'BUILD A REQUEST',type:'booking'},
    {cls:'posted',num:'04',symbol:'⌁',scene:'SIGNAL / CONTINUITY',label:'STAY CONNECTED · LOCAL PREVIEW',title:'KEEP ME POSTED',intent:'I want to stay close to what comes next.',copy:'Choose the kinds of 2Fly updates you want to hear about while the live list connection is finalized.',items:['Music and video releases','Playable launches','Shows and project updates'],cta:'SET PREFERENCES',type:'posted'}
  ];

  $('#appView').innerHTML=`<section class="support-page">
    <div class="support-hero">
      <div><div class="kicker">EXPERIENCE FIRST · DECIDE SECOND · PARTICIPATE YOUR WAY</div><h1>HELP <span>2FLY</span> CREATE.</h1></div>
      <div class="support-hero-copy"><strong>THE WORK COMES FIRST.</strong><p>Listen, watch, play, create, or explore first. Then choose the kind of participation that actually matches your interest, resources, and intent. No pressure. Pick the path that feels true.</p><div class="support-principles"><span>EXPERIENCE FIRST</span><span>DECIDE THE VALUE</span><span>PARTICIPATE YOUR WAY</span></div></div>
    </div>
    <div class="support-paths">${cards.map(supportCard).join('')}</div>
    <div class="support-workspace" id="supportWorkspace"><div class="support-workspace-empty"><span>SELECT A PARTICIPATION PATH</span><h2>BUILD THE NEXT MOVE.</h2><p>Each path is designed around a different kind of intent: appreciation, collaboration, live connection, or continuity. Send a project proposal or an in-person request directly to 2Fly for review.</p></div></div>
    <section class="support-origin"><div class="kicker">WHY THIS MATTERS</div><h2>HELP THE ORIGINATOR KEEP CREATING.</h2><p>2Fly is building music, visuals, Playable Experiences, software, documentary work, and creative experiments independently. Support can be money, a project proposal, a booking, useful feedback, or simply helping the right people discover the work.</p><a href="#featured" data-route="featured">RETURN TO THE WORK →</a></section>
  </section>`;
  $$('[data-support-panel]').forEach(b=>b.onclick=()=>openSupportPanel(b.dataset.supportPanel));
}
function openSupportPanel(kind){
  if(document.querySelector('#supportRequestForm[aria-busy="true"]'))return;
  const w=$('#supportWorkspace');if(!w)return;
  if(kind==='investment')w.innerHTML=supportRequestForm('investment');
  if(kind==='booking')w.innerHTML=supportRequestForm('booking');
  if(kind==='posted')w.innerHTML=`<form class="support-form" id="supportPostedForm"><div class="form-head"><span>LOCAL PREVIEW</span><h2>KEEP ME POSTED.</h2><p>Choose what you actually want to hear about. These preferences save on this device only until the live list is connected.</p></div><label>NAME<input name="name" autocomplete="name" required></label><label>EMAIL<input name="email" type="email" autocomplete="email" required></label><label>WHAT SHOULD 2FLY KEEP YOU POSTED ABOUT?<select name="interest"><option value="all">Everything 2Fly</option><option value="releases">Music and video releases</option><option value="playables">Playable Experiences</option><option value="shows">Shows and in-person experiences</option><option value="projects">Projects and missions</option></select></label><button type="submit">SAVE PREFERENCES ON THIS DEVICE</button><output id="supportFormStatus"></output></form>`;
  bindSupportForm(kind);
  w.scrollIntoView({behavior:'smooth',block:'center'});
}

// Public visitor client only. Wix collection permissions enforce private reads.
const supportWixClientId='4078a373-e759-44f8-9261-f13eb6976fcd';
const supportRequestTypes={
  investment:{collection:'ProjectProposals',title:'PROJECT PROPOSAL',action:'SEND PROPOSAL',subject:'project',fields:[
    ['name','Your name',true],['email','Email',true],['phone','Phone (optional)'],
    ['project','Project / idea',true],['projectType','What kind of project?',true,['Music / album','Video / film','Playable Experience','Software / technology','Community initiative','Other']],['projectOther','Describe the project type',true,null,'projectType'],
    ['involvement','How would you like to be involved?',true,['Funding / investment','Sponsorship','Creative collaboration','Production','Resources / services','Other']],['role','Your proposed role'],
    ['goals','Goals and intended impact',true],['budget','Working budget or contribution range'],['timeline','Target timeline'],['links','Relevant links'],['details','Proposal and desired outcome',true]
  ]},
  booking:{collection:'InPersonRequests',title:'IN-PERSON REQUEST',action:'SEND REQUEST',subject:'organization',fields:[
    ['name','Your name',true],['email','Email',true],['phone','Phone (optional)'],['organization','Event / organization',true],
    ['experience','Experience type / format',true,['Performance','Workshop','Talk / speaking','Demonstration','Discussion / Q&A','Other']],['experienceOther','Describe the experience',true,null,'experience'],
    ['date','Preferred date / timeframe'],['location','City and location',true],['venue','Venue (if known)'],['audience','Estimated audience size'],['duration','Expected duration'],
    ['budget','Working budget'],['travel','Travel / accommodation plan',false,['To be provided','Help needed','To be discussed','Not applicable']],['equipment','Equipment or production needs'],['details','Requirements and expectations',true]
  ]}
};
let supportVisitorToken;
async function supportVisitorAccess(){
  if(supportVisitorToken&&supportVisitorToken.until>Date.now())return supportVisitorToken.value;
  const response=await fetch('https://www.wixapis.com/oauth2/token',{
    method:'POST',headers:{'Content-Type':'application/json'},signal:AbortSignal.timeout(20000),
    body:JSON.stringify({clientId:supportWixClientId,grantType:'anonymous'})
  });
  if(!response.ok)throw new Error('Connection unavailable');
  const token=await response.json();
  if(!token.access_token)throw new Error('Connection unavailable');
  supportVisitorToken={value:token.access_token,until:Date.now()+(Number(token.expires_in)||14400)*1000-60000};
  return supportVisitorToken.value;
}
function supportRequestForm(kind){
  const config=supportRequestTypes[kind];
  const fields=config.fields.map(([name,label,required,options,otherFor])=>{
    const attributes=`name="${name}" ${required&&!otherFor?'required':''} maxlength="${['details','goals','equipment'].includes(name)?5000:500}"`;
    const control=options?`<select name="${name}" ${required?'required':''}><option value="">Choose one</option>${options.map(value=>`<option value="${value}">${value}</option>`).join('')}</select>`:
      ['details','goals','equipment'].includes(name)?`<textarea ${attributes} rows="${name==='details'?6:4}"></textarea>`:`<input ${attributes} type="${name==='email'?'email':name==='phone'?'tel':name==='links'?'url':'text'}" autocomplete="${['name','email','organization','tel'].includes(name)?name:'off'}">`;
    const section=['project','organization'].includes(name)?'<div class="support-form-section">THE OPPORTUNITY</div>':['goals','date'].includes(name)?'<div class="support-form-section">THE PLAN</div>':'';
    return `${section}<label class="${['details','goals','equipment'].includes(name)?'full':''}" ${otherFor?`data-other-for="${otherFor}" hidden`:''}>${label}${required?' *':''}${control}</label>`;
  }).join('');
  return `<form class="support-form" id="supportRequestForm" data-kind="${kind}">
    <div class="form-head"><span>DIRECT TO 2FLY</span><h2>${config.title}</h2><p>Your request goes privately to 2Fly for review. Sending a request does not confirm a booking or project agreement. Fields marked * are required.</p></div>
    ${fields}<label class="support-trap" aria-hidden="true">Leave this empty<input name="website" tabindex="-1" autocomplete="off"></label>
    <div class="support-form-actions"><button type="submit">${config.action}</button><button type="button" data-save-request>SAVE DRAFT ON THIS DEVICE</button></div>
    <output id="supportFormStatus" role="status" aria-live="polite" tabindex="-1"></output>
  </form>`;
}
function bindSupportForm(kind){
  const form=$('#supportPostedForm')||$('#supportRequestForm');if(!form)return;
  const key=`2fly-support-${kind}`;
  const status=form.querySelector('output');
  const config=supportRequestTypes[kind];
  try{
    const saved=JSON.parse(localStorage.getItem(key)||'null');
    if(saved){
      if(config&&saved.subject&&!saved[config.subject])saved[config.subject]=saved.subject;
      Object.entries(saved).forEach(([name,value])=>{const field=form.elements.namedItem(name);if(field&&name!=='savedAt')field.value=value});
    }
  }catch{}
  let syncOtherFields=()=>{};
  if(config){
    syncOtherFields=()=>config.fields.forEach(([name,,,,otherFor])=>{
      if(!otherFor)return;
      const field=form.elements.namedItem(name);
      const show=form.elements.namedItem(otherFor).value==='Other';
      field.closest('label').hidden=!show;
      field.required=show;
      if(!show)field.value='';
    });
    form.addEventListener('change',syncOtherFields);
    syncOtherFields();
  }
  const saveDraft=()=>{
    const data=Object.fromEntries(new FormData(form).entries());delete data.website;
    data.savedAt=new Date().toISOString();
    try{localStorage.setItem(key,JSON.stringify(data));status.textContent=kind==='posted'?'Preferences saved locally on this device.':'Draft saved on this device. It has not been sent.'}
    catch{status.textContent='This browser blocked local saving. Copy your details before leaving.'}
  };
  if(!config){form.onsubmit=e=>{e.preventDefault();saveDraft()};return}
  form.querySelector('[data-save-request]').onclick=saveDraft;
  form.onsubmit=async e=>{
    e.preventDefault();
    if(form.getAttribute('aria-busy')==='true'||!form.reportValidity())return;
    if(form.elements.namedItem('website').value){status.textContent='Please leave the extra website field empty.';return}
    const data=Object.fromEntries(config.fields.map(([name,,,,otherFor])=>[name,otherFor&&form.elements.namedItem(otherFor).value!=='Other'?'':form.elements.namedItem(name).value.trim()]));
    const empty=config.fields.find(([name,,required,,otherFor])=>required&&(!otherFor||form.elements.namedItem(otherFor).value==='Other')&&!data[name]);
    if(empty){status.textContent='Please complete the required fields.';form.elements.namedItem(empty[0]).focus();return}
    form.setAttribute('aria-busy','true');
    const controls=[...form.querySelectorAll('input,select,textarea,button')];controls.forEach(el=>el.disabled=true);
    status.textContent='Sending your request…';
    try{
      const access=await supportVisitorAccess();
      const response=await fetch('https://www.wixapis.com/wix-data/v2/items',{
        method:'POST',headers:{'Content-Type':'application/json',Authorization:access},signal:AbortSignal.timeout(25000),
        body:JSON.stringify({dataCollectionId:config.collection,dataItem:{data}})
      });
      if(!response.ok){if(response.status===401)supportVisitorToken=null;throw new Error('Delivery not confirmed')}
      const result=await response.json();
      if(!result.dataItem?.id||result.dataItem.dataCollectionId!==config.collection)throw new Error('Delivery not confirmed');
      form.reset();syncOtherFields();try{localStorage.removeItem(key)}catch{}
      status.textContent=`Thank you. Your ${kind==='investment'?'proposal':'request'} has been received by 2Fly for review. Reference: ${result.dataItem.id}. This does not confirm a booking or project agreement.`;
    }catch{
      status.textContent='We could not confirm delivery. Your details are still here. Save a draft or copy them before leaving, and try again later.';
    }finally{
      form.removeAttribute('aria-busy');controls.forEach(el=>el.disabled=false);status.focus({preventScroll:true});
    }
  };
}

