// Visitor feedback is stored in a private Wix CMS collection.
(()=>{
  let dialog;
  let backdrop;
  function closeDialog(){
    if(!dialog||dialog.hidden)return;
    dialog.hidden=true;
    backdrop.hidden=true;
    document.documentElement.classList.remove('feedback-open');
  }
  function ensureDialog(){
    if(dialog)return dialog;
    backdrop=document.createElement('div');
    backdrop.className='feedback-backdrop';
    backdrop.hidden=true;
    backdrop.onclick=closeDialog;
    dialog=document.createElement('div');
    dialog.className='feedback-dialog';
    dialog.hidden=true;
    dialog.setAttribute('role','dialog');
    dialog.setAttribute('aria-modal','true');
    dialog.setAttribute('aria-labelledby','feedback-title');
    dialog.innerHTML=`<form id="visitorFeedbackForm" class="feedback-form">
      <button class="feedback-close" type="button" aria-label="Close feedback">×</button>
      <small>DIRECT TO 2FLY · PRIVATE FEEDBACK</small>
      <h2 id="feedback-title">LEAVE FEEDBACK.</h2>
      <p>Tell me anything about the work or your experience here. Your note goes privately to 2Fly.</p>
      <label>IS THIS GENERAL OR ABOUT A SPECIFIC PIECE OF CONTENT?
        <select name="scope"><option value="General">General feedback</option><option value="Specific content">A specific piece of content</option></select>
      </label>
      <label class="feedback-specific" hidden>WHICH SONG, VIDEO, PROJECT, OR EXPERIENCE?
        <input name="contentTitle" maxlength="250" placeholder="Title or link (optional)">
      </label>
      <label>TELL ME ANYTHING *
        <textarea name="message" rows="5" maxlength="5000" required placeholder="What connected with you? What could be better? What's on your mind?"></textarea>
      </label>
      <div class="feedback-pair">
        <label>NAME (OPTIONAL)<input name="name" maxlength="150" autocomplete="name"></label>
        <label>EMAIL (OPTIONAL)<input name="email" type="email" maxlength="254" autocomplete="email"></label>
      </div>
      <label>WHAT WAS THE WORK WORTH TO YOU? (OPTIONAL · NO PAYMENT HERE)
        <input name="valueAmount" type="number" min="0" max="1000000" step="0.01" inputmode="decimal" placeholder="$ amount">
      </label>
      <label class="feedback-optin"><input name="optIn" type="checkbox"> Keep me posted about releases, events, and Playable Experiences.</label>
      <label class="feedback-trap" aria-hidden="true">Leave this empty<input name="website" tabindex="-1" autocomplete="off"></label>
      <button class="feedback-submit" type="submit">SEND FEEDBACK →</button>
      <output role="status" aria-live="polite" tabindex="-1"></output>
    </form>`;
    document.body.append(backdrop,dialog);
    const form=dialog.querySelector('form');
    const scope=form.elements.namedItem('scope');
    const specific=form.querySelector('.feedback-specific');
    scope.onchange=()=>{specific.hidden=scope.value!=='Specific content';if(specific.hidden)form.elements.namedItem('contentTitle').value='';};
    dialog.querySelector('.feedback-close').onclick=closeDialog;
    document.addEventListener('keydown',event=>{
      if(dialog.hidden)return;
      if(event.key==='Escape'){event.preventDefault();closeDialog();return}
      if(event.key!=='Tab')return;
      const focusable=[...dialog.querySelectorAll('button:not([disabled]),input:not([disabled]),select,textarea')].filter(el=>el.tabIndex>=0&&!el.closest('[hidden]'));
      if(!focusable.length)return;
      const first=focusable[0],last=focusable[focusable.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus({preventScroll:true})}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus({preventScroll:true})}
      else if(!dialog.contains(document.activeElement)){event.preventDefault();first.focus({preventScroll:true})}
    });
    form.onsubmit=async event=>{
      event.preventDefault();
      if(!form.reportValidity()||form.getAttribute('aria-busy')==='true')return;
      const status=form.querySelector('output');
      if(form.elements.namedItem('website').value)return;
      if(form.elements.namedItem('optIn').checked&&!form.elements.namedItem('email').value.trim()){
        status.textContent='Add an email address if you would like updates.';
        form.elements.namedItem('email').focus();return;
      }
      const value=form.elements.namedItem('valueAmount').value;
      const data={
        scope:scope.value,
        contentTitle:form.elements.namedItem('contentTitle').value.trim(),
        message:form.elements.namedItem('message').value.trim(),
        name:form.elements.namedItem('name').value.trim(),
        email:form.elements.namedItem('email').value.trim(),
        optIn:form.elements.namedItem('optIn').checked,
        pageUrl:window.WIX_PAGE?'https://www.2flykeithlogan.com'+window.WIX_PAGE.slug:location.href
      };
      if(value)data.valueAmount=Number(value);
      if(!data.message){status.textContent='Please enter your feedback.';return}
      form.setAttribute('aria-busy','true');
      const submit=form.querySelector('.feedback-submit');submit.disabled=true;
      status.textContent='Sending your feedback…';
      try{
        const access=await supportVisitorAccess();
        const response=await fetch('https://www.wixapis.com/wix-data/v2/items',{
          method:'POST',headers:{'Content-Type':'application/json',Authorization:access},signal:AbortSignal.timeout(25000),
          body:JSON.stringify({dataCollectionId:'VisitorFeedback',dataItem:{data}})
        });
        if(!response.ok)throw new Error('Delivery not confirmed');
        const result=await response.json();
        if(!result.dataItem?.id)throw new Error('Delivery not confirmed');
        form.reset();scope.onchange();
        status.textContent='Thank you. Your feedback has been sent privately to 2Fly.';
      }catch{
        status.textContent='We could not confirm delivery. Your feedback is still here; please try again.';
      }finally{
        form.removeAttribute('aria-busy');submit.disabled=false;status.focus({preventScroll:true});
      }
    };
    return dialog;
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest?.('[data-feedback-open]');
    if(!button)return;
    event.preventDefault();
    // Avoid the browser scrolling the outer Wix page when dialog focus returns.
    button.blur();
    ensureDialog();
    backdrop.hidden=false;
    dialog.hidden=false;
    document.documentElement.classList.add('feedback-open');
  });
})();
