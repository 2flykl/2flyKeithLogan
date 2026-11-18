/* Standard Gamepad API layout: face buttons are numbered by position, across brands. */
(() => {
  const profiles = {
    streams: ['#start,#restart', ['Space'], 'Left stick moves. Bottom jumps.'],
    BlackandGifted: ['#begin,#again,#affirmGrid button,#affirmConfirm,[data-start-gender]', ['Space'], 'Left stick moves. Bottom jumps.'],
    'heavy-on-my-mind': ['#start,#resume', ['ArrowUp','KeyE','KeyQ','KeyF','KeyR'], 'Bottom jumps. Right interacts. Left places an item. Top adjusts the lever. LB unloads.'],
    'infinite-love': ['#start', ['Enter','ShiftLeft','Space'], 'D-pad moves. Bottom places. Left rotates. Hold right to skip.'],
    ebony_eyes_game: ['button[onclick^="startGame"]', ['Space'], 'D-pad moves the cursor. Bottom locks or releases a piece.'],
    TigerCall_StillStanding_PLX2_RC_STAGE_HOLDS: ['#launchBtn,#resumeBtn,#replayBtn', ['KeyO','KeyP','KeyI','Digit9'], 'Use the four face buttons for the four lanes. Hold long notes and release at the end.'],
    'return-of-the-aviator': ['#start,#resume,#replay,#skip', ['Space','ShiftLeft'], 'Left stick steers. Hold bottom to fire. Right triggers a sonic burst.'],
    'i-was-away': ['#begin,#resume,#again,#throw-again,#gallery-close,#keep-best,#back', ['Space','KeyR','KeyV'], 'Left stick moves. Hold and release bottom to throw. Tap to catch. Right recenters.'],
    'thru-the-fire': ['#startBtn,#replayBtn', ['ArrowUp'], 'Left and right turn. Bottom grabs the selected item.'],
    GunsAndButter_WOMP_StarterKit: ['#enter,#use,#help-close', ['KeyE','KeyR','KeyC','Enter',null,null,null,'Space'], 'Left stick moves. Right stick looks. Bottom inspects. RT fires. Right reloads. Left starts the challenge.'],
    '2fly-universe': ['#launch-btn,#launch-retry', ['Select','ExitGalaxy',null,null,null,null,null,'KeyW'], 'Left stick orbits. RT thrusts forward. Bottom selects at screen center. Right exits a galaxy.']
  };
  profiles.streams2RC1 = profiles.streams;
  profiles.TigerCall_StillStanding_PLX = profiles.TigerCall_StillStanding_PLX2_RC_STAGE_HOLDS;
  const id = location.pathname.match(/\/games\/([^/]+)/)?.[1];
  const profile = profiles[id];
  if (!profile) return;
  const [launch, actions, guide] = profile;
  const menu = document.querySelector('#playable-controls')?.shadowRoot;
  const panel = menu?.querySelector('#panel');
  if (panel) {
    const hint = document.createElement('p');
    hint.textContent = 'Controller · ' + guide + ' Start opens the game menu.';
    hint.style.cssText = 'margin:8px;color:#ddd;font:12px/1.45 Arial';
    panel.append(hint);
    if (window !== top) {
      const link = document.createElement('a');
      link.href = location.href;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Open standalone for controller access ↗';
      panel.append(link);
    }
  }
  // An ancestor (for example a Wix embed) can disable gamepad access for its
  // whole frame tree. The same game opened directly has its own permission.
  const policy = document.permissionsPolicy || document.featurePolicy;
  function offerStandalone() {
    const start = document.querySelector(launch);
    if (start) {
      const direct = document.createElement('a');
      direct.href = location.href;
      direct.target = '_blank';
      direct.rel = 'noopener';
      direct.textContent = 'Play with a controller ↗';
      direct.style.cssText = 'display:block;margin:6px auto;color:inherit;text-align:center;font:600 14px/1.5 system-ui';
      start.after(direct);
    }
  }
  if (window !== top && policy?.allowsFeature('gamepad') === false) {
    offerStandalone();
    return;
  }
  if (!navigator.getGamepads) return;
  const arrows = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];
  const held = new Set();
  const nextRepeat = new Map();
  let previous = [], blocked = true, padIndex = null, last = 0;
  function key(code, down, repeat = false) {
    const name = {Space:' ', ShiftLeft:'Shift', Digit9:'9'}[code] || (code.startsWith('Key') ? code.slice(3).toLowerCase() : code);
    const target = id === '2fly-universe' ? document.querySelector('#universe-canvas') : document.body;
    target?.dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', {key:name, code, bubbles:true, cancelable:true, repeat}));
  }
  function release() {
    for (const code of held) key(code,false);
    held.clear();
    nextRepeat.clear();
    blocked = true;
    previous = [];
  }
  window.addEventListener('blur', release);
  document.addEventListener('visibilitychange', release);
  window.addEventListener('gamepaddisconnected', event => { if(event.gamepad.index === padIndex) release(); });
  function actionable(el) {
    if (el.disabled || !el.getClientRects().length) return false;
    const r = el.getBoundingClientRect();
    const hit = el.getRootNode().elementFromPoint(r.x+r.width/2,r.y+r.height/2);
    return el.contains(hit);
  }
  function orbit(x,y) {
    const canvas = document.querySelector('#universe-canvas');
    if (!canvas) return;
    const options = {bubbles:true, clientX:innerWidth/2, clientY:innerHeight/2};
    canvas.dispatchEvent(new MouseEvent('mousedown',options));
    canvas.dispatchEvent(new MouseEvent('mousemove',{...options, clientX:options.clientX+x, clientY:options.clientY+y}));
    canvas.dispatchEvent(new MouseEvent('mouseup',options));
  }
  function sample(time) {
    if (document.hidden || !document.hasFocus()) return;
    let pads;
    try { pads = Array.from(navigator.getGamepads()).filter(p=>p?.connected && p.mapping==='standard'); }
    catch { cancelAnimationFrame(frame); if (window !== top) offerStandalone(); return; }
    const current = pads.find(p=>p.index===padIndex);
    const inUse = p => p && (p.buttons.some(b=>b.pressed) || p.axes.some(a=>Math.abs(a)>.22));
    const pad = inUse(current) ? current : pads.find(inUse) || current || pads[0];
    if (!pad) { if (padIndex!==null) release(); padIndex=null; return; }
    if (pad.index!==padIndex) { release(); padIndex=pad.index; }
    const buttons = pad.buttons.map(b=>b.pressed);
    const axis = n => Math.abs(pad.axes[n]||0)>.22 ? pad.axes[n] : 0;
    buttons[12] ||= axis(1)<-.48; buttons[13] ||= axis(1)>.48;
    buttons[14] ||= axis(0)<-.48; buttons[15] ||= axis(0)>.48;
    if (blocked) { blocked=buttons.some(Boolean); previous=buttons; return; }
    if (!buttons.some(Boolean) && !previous.some(Boolean) && !held.size && !axis(2) && !axis(3) && !axis(0) && !axis(1)) { last=time; return; }
    const pressed = n => buttons[n] && !previous[n];
    const menuOpen = panel && !panel.hidden;
    const choices = menuOpen ? [...panel.querySelectorAll('nav a,nav button,a[target="_blank"]')].filter(actionable) :
      launch.split(',').flatMap(selector=>Array.from(document.querySelectorAll(selector))).filter(actionable);
    const desired = new Set();
    if (pressed(9) && menu) { menu.querySelector('#toggle').click(); }
    else if (choices.length || menuOpen) {
      const active = choices.indexOf(menuOpen ? menu.activeElement : document.activeElement);
      const step = pressed(13)||pressed(15) ? 1 : pressed(12)||pressed(14) ? -1 : 0;
      if (step && choices.length) choices[(Math.max(0,active)+step+choices.length)%choices.length].focus();
      if (pressed(0)) { choices[Math.max(0,active)]?.click(); blocked=true; }
      if (menuOpen && pressed(1)) menu.querySelector('#toggle').click();
    } else if (!document.activeElement?.matches('input,textarea,[contenteditable=true]')) {
      for (let n=0;n<4;n++) if (buttons[12+n]) desired.add(arrows[n]);
      for (const [n,code] of actions.entries()) {
        if (!code || !buttons[n]) continue;
        if (code==='Select') { if (pressed(n)) document.querySelector('#universe-canvas')?.dispatchEvent(new MouseEvent('click',{bubbles:true, clientX:innerWidth/2, clientY:innerHeight/2})); }
        else if (code==='ExitGalaxy') { if (pressed(n)) document.querySelector('#exit-galaxy')?.click(); }
        else desired.add(code);
      }
      const scale = Math.min(40,time-last)*.45;
      if (id==='2fly-universe' && (axis(0)||axis(1))) orbit(axis(0)*scale,axis(1)*scale);
      if (id==='GunsAndButter_WOMP_StarterKit' && (axis(2)||axis(3))) document.querySelector('canvas')?.dispatchEvent(new MouseEvent('mousemove',{bubbles:true,movementX:Math.round(axis(2)*scale),movementY:Math.round(axis(3)*scale)}));
      if (id==='i-was-away' && axis(2)) desired.add(axis(2)<0?'KeyQ':'KeyE');
    }
    for (const code of held) if (!desired.has(code)) { key(code,false); held.delete(code); nextRepeat.delete(code); }
    for (const code of desired) {
      if (!held.has(code)) {
        if (document.activeElement?.matches('button,a') && !menuOpen) document.activeElement.blur();
        key(code,true); held.add(code); nextRepeat.set(code,time+310);
      } else if (id==='ebony_eyes_game' && arrows.includes(code) && time>=nextRepeat.get(code)) {
        key(code,true,true); nextRepeat.set(code,time+125);
      }
    }
    previous=buttons; last=time;
  }
  let frame;
  function poll(time) { frame=requestAnimationFrame(poll); sample(time); }
  frame=requestAnimationFrame(poll);
})();
