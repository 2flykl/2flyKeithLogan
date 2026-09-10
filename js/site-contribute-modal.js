(()=>{
  const SUPPORT_HASH='#support';
  const SUPPORT_URL='https://support.2flyKeithLogan.com/pay-what-its-worth';
  let lastFocus=null;

  function isMainNavSupport(el){
    return !!el.closest('.help-create-nav');
  }

  function isFullPageSupportLink(el){
    return !!el.closest('[data-help2fly-full-page]');
  }

  function isSupportTrigger(el){
    const anchor=el.closest('a[href="#support"],a[data-route="support"],button[data-route="support"]');
    if(!anchor) return null;
    if(isMainNavSupport(anchor)||isFullPageSupportLink(anchor)) return null;
    return anchor;
  }

  function modalMarkup(){
    return `<div class="help2fly-modal-backdrop" id="help2flyContributeBackdrop" aria-hidden="true" data-payment="false">
      <section class="help2fly-modal" role="dialog" aria-modal="true" aria-labelledby="help2flyModalTitle">
        <button class="help2fly-modal-close" type="button" aria-label="Close Help 2fly Create">×</button>
        <span class="help2fly-modal-kicker">HELP 2FLY CREATE</span>
        <h2 id="help2flyModalTitle">HELP <span>2FLY</span> CREATE.</h2>
        <p class="help2fly-modal-copy">If the work connects with you, you can help move the next piece forward right here.</p>
        <label class="help2fly-contribute-label" for="help2flyAmount">CONTRIBUTE</label>
        <div class="help2fly-amount-wrap">
          <span class="help2fly-currency" aria-hidden="true">$</span>
          <input class="help2fly-amount" id="help2flyAmount" name="amount" type="number" inputmode="decimal" min="1" step="1" placeholder="0" autocomplete="off" aria-label="Contribution amount">
        </div>
        <div class="help2fly-actions">
          <button class="help2fly-contribute" id="help2flyContributeButton" type="button">CONTRIBUTE</button>
          <a class="help2fly-full-link" href="${SUPPORT_HASH}" data-route="support" data-help2fly-full-page>EXPLORE THE FULL HELP 2FLY CREATE PAGE →</a>
        </div>
        <small class="help2fly-note">Choose the amount that feels right to you.</small>
        <p class="help2fly-modal-status" id="help2flyModalStatus" role="status" aria-live="polite"></p>
        <div class="help2fly-payment-shell" id="help2flyPaymentShell">
          <div class="help2fly-payment-head"><span>CONTINUE YOUR CONTRIBUTION</span><button type="button" id="help2flyChangeAmount">CHANGE AMOUNT</button></div>
          <iframe class="help2fly-payment-frame" id="help2flyPaymentFrame" title="Help 2fly Create contribution" loading="eager"></iframe>
        </div>
      </section>
    </div>`;
  }

  function ensureModal(){
    let backdrop=document.getElementById('help2flyContributeBackdrop');
    if(backdrop) return backdrop;
    document.body.insertAdjacentHTML('beforeend',modalMarkup());
    backdrop=document.getElementById('help2flyContributeBackdrop');
    const close=backdrop.querySelector('.help2fly-modal-close');
    const contribute=backdrop.querySelector('#help2flyContributeButton');
    const change=backdrop.querySelector('#help2flyChangeAmount');
    const full=backdrop.querySelector('[data-help2fly-full-page]');
    const amount=backdrop.querySelector('#help2flyAmount');

    close.addEventListener('click',closeModal);
    backdrop.addEventListener('click',e=>{if(e.target===backdrop) closeModal()});
    contribute.addEventListener('click',beginContribution);
    amount.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();beginContribution()}});
    change.addEventListener('click',()=>{
      backdrop.dataset.payment='false';
      backdrop.querySelector('#help2flyPaymentShell').classList.remove('is-active');
      backdrop.querySelector('#help2flyPaymentFrame').removeAttribute('src');
      backdrop.querySelector('#help2flyModalStatus').textContent='';
      setTimeout(()=>amount.focus(),0);
    });
    full.addEventListener('click',()=>closeModal(false));
    return backdrop;
  }

  function openModal(){
    const backdrop=ensureModal();
    lastFocus=document.activeElement;
    backdrop.dataset.payment='false';
    backdrop.querySelector('#help2flyPaymentShell').classList.remove('is-active');
    backdrop.querySelector('#help2flyPaymentFrame').removeAttribute('src');
    backdrop.querySelector('#help2flyModalStatus').textContent='';
    backdrop.classList.add('is-open');
    backdrop.setAttribute('aria-hidden','false');
    document.documentElement.classList.add('help2fly-modal-open');
    document.body.classList.add('help2fly-modal-open');
    setTimeout(()=>backdrop.querySelector('#help2flyAmount').focus(),60);
  }

  function closeModal(restoreFocus=true){
    const backdrop=document.getElementById('help2flyContributeBackdrop');
    if(!backdrop) return;
    backdrop.classList.remove('is-open');
    backdrop.setAttribute('aria-hidden','true');
    document.documentElement.classList.remove('help2fly-modal-open');
    document.body.classList.remove('help2fly-modal-open');
    if(restoreFocus&&lastFocus&&typeof lastFocus.focus==='function') setTimeout(()=>lastFocus.focus(),60);
  }

  function beginContribution(){
    const backdrop=ensureModal();
    const input=backdrop.querySelector('#help2flyAmount');
    const status=backdrop.querySelector('#help2flyModalStatus');
    const value=Number(input.value);
    if(!Number.isFinite(value)||value<=0){
      status.textContent='Enter the amount you would like to contribute.';
      input.focus();
      return;
    }
    const amount=value.toFixed(2);
    const frame=backdrop.querySelector('#help2flyPaymentFrame');
    const shell=backdrop.querySelector('#help2flyPaymentShell');
    const url=`${SUPPORT_URL}?amount=${encodeURIComponent(amount)}&embed=1`;
    status.textContent=`Your $${amount} contribution is ready to continue below.`;
    frame.src=url;
    shell.classList.add('is-active');
    backdrop.dataset.payment='true';
  }

  document.addEventListener('click',e=>{
    const trigger=isSupportTrigger(e.target);
    if(!trigger) return;
    e.preventDefault();
    e.stopPropagation();
    openModal();
  },true);

  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){
      const backdrop=document.getElementById('help2flyContributeBackdrop');
      if(backdrop?.classList.contains('is-open')) closeModal();
    }
  });

  window.Help2flyCreateModal={open:openModal,close:closeModal};
})();