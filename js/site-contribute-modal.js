(()=>{
  const PAYMENT_URL='https://buy.stripe.com/cNi3cx2NGaN53rk1HG0Fi00';
  let modal;
  let lastFocus;
  let openedHash;

  function ensureModal(){
    if(modal) return modal;
    modal=document.createElement('dialog');
    modal.className='help2fly-modal';
    modal.id='help2flyContributeModal';
    modal.setAttribute('aria-labelledby','help2flyModalTitle');
    modal.setAttribute('aria-describedby','help2flyModalCopy');
    modal.innerHTML=`
      <button class="help2fly-modal-close" type="button" aria-label="Close Help 2fly Create" autofocus>×</button>
      <span class="help2fly-modal-kicker">DECIDE WHAT IT'S WORTH.</span>
      <h2 id="help2flyModalTitle">HELP <span>2FLY</span> CREATE.</h2>
      <p class="help2fly-modal-copy" id="help2flyModalCopy">If the work connects with you, help move the next piece forward. Choose the amount that feels right to you at secure checkout.</p>
      <div class="help2fly-actions">
        <a class="help2fly-contribute" href="${PAYMENT_URL}" data-help2fly-checkout>CONTINUE TO SECURE CHECKOUT →</a>
        <a class="help2fly-full-link" href="#support" data-route="support" data-help2fly-full-page>EXPLORE THE FULL HELP 2FLY CREATE PAGE →</a>
      </div>`;
    document.body.append(modal);
    modal.querySelector('.help2fly-modal-close').addEventListener('click',closeModal);
    modal.querySelector('[data-help2fly-full-page]').addEventListener('click',()=>closeModal(false));
    modal.addEventListener('click',event=>{
      if(event.target!==modal) return;
      const bounds=modal.getBoundingClientRect();
      if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom) closeModal();
    });
    modal.addEventListener('cancel',event=>{event.preventDefault();closeModal()});
    modal.addEventListener('keydown',event=>{
      if(event.key!=='Tab') return;
      const controls=[...modal.querySelectorAll('button,a[href]')];
      const first=controls[0],last=controls[controls.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
    });
    modal.addEventListener('close',()=>{
      document.documentElement.classList.remove('help2fly-modal-open');
      document.body.classList.remove('help2fly-modal-open');
    });
    return modal;
  }

  function openModal(trigger=document.activeElement){
    const dialog=ensureModal();
    if(dialog.open) return;
    lastFocus=trigger;
    openedHash=location.hash;
    dialog.showModal();
    document.documentElement.classList.add('help2fly-modal-open');
    document.body.classList.add('help2fly-modal-open');
  }

  function closeModal(restoreFocus=true){
    if(!modal?.open) return;
    modal.close();
    document.documentElement.classList.remove('help2fly-modal-open');
    document.body.classList.remove('help2fly-modal-open');
    if(restoreFocus&&lastFocus?.isConnected) lastFocus.focus({preventScroll:true});
  }

  document.addEventListener('click',event=>{
    const trigger=event.target.closest?.('a,button');
    if(!trigger||trigger.closest('.help-create-nav,[data-help2fly-full-page],.help2fly-modal')) return;
    const isSupport=trigger.matches('[data-help2fly-open],[data-route="support"],a[href="#support"]')||trigger.getAttribute('href')===PAYMENT_URL;
    if(!isSupport) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openModal(trigger);
  },true);

  window.addEventListener('hashchange',()=>{if(location.hash!==openedHash) closeModal(false)});
  window.Help2flyCreateModal={open:openModal,close:closeModal};
})();
