(function(){
  const byId = id => document.getElementById(id);

  // ---------- Start presentation ----------
  const start = byId('screen-start');
  if (start && !start.querySelector('.gb-start-eq')) {
    const eq = document.createElement('div');
    eq.className = 'gb-start-eq';
    eq.innerHTML = Array.from({length:22},(_,i)=>`<i style="animation-delay:${(i%7)*-.07}s"></i>`).join('');
    const btn = byId('btn-start');
    start.insertBefore(eq, btn);
    btn.textContent = 'START EXPERIENCE';
  }
  const enterRange = byId('btn-enter-range');
  if (enterRange) {
    enterRange.textContent = 'DROP INTO RANGE';
    enterRange.addEventListener('click', () => {
      try { if (window.AudioManager) window.AudioManager.startMusicFromGesture(false); }
      catch (e) { console.warn('Music range-entry retry failed', e); }
    }, {capture:true});
  }
  const help = byId('help');
  if (help) help.textContent = 'CLICK RANGE TO LOCK AIM • MOUSE = AIM • LMB = FIRE • 1–8 = SWAP WOMP • R = RELOAD • I = INSPECT • ESC = RELEASE';

  // Start the actual Guns & Butter track from the first explicit user gesture.
  const startBtn = byId('btn-start');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      try { if (window.AudioManager) window.AudioManager.startMusicFromGesture(true); }
      catch (e) { console.warn('Music start gesture retry failed', e); }
    }, {capture:true});
  }

  // ---------- Persistent in-range WOMP layer ----------
  const weaponLayer = document.createElement('div');
  weaponLayer.id = 'gb-live-weapon';
  weaponLayer.innerHTML = '<img alt="Active WOMP">';
  document.body.appendChild(weaponLayer);
  const weaponImg = weaponLayer.querySelector('img');
  const livePaths = {
    staffline:'assets/live_v2/weapons/staffline.png?v=20260818c',
    cd_double_barrel:'assets/live_v2/weapons/cd_double_barrel.png?v=20260818c',
    tambourine_tempest:'assets/live_v2/weapons/tambourine_tempest.png?v=20260818c',
    harp_javelin:'assets/live_v2/weapons/harp_javelin.png?v=20260818c',
    hand_cannon_808:'assets/live_v2/weapons/hand_cannon_808.png?v=20260818c',
    vinyl_launcher:'assets/live_v2/weapons/vinyl_launcher.png?v=20260818c',
    keytar_rifle:'assets/live_v2/weapons/keytar_rifle.png?v=20260818c',
    mic_drop:'assets/live_v2/weapons/mic_drop.png?v=20260818c'
  };
  let lastWeaponId = '';
  let lastShotStamp = 0;
  function syncWeaponLayer(){
    let playing=false, weapon=null, shot=0;
    try { playing = gameState === 'PLAYING'; weapon = activeWeapon; shot = lastFireTime || 0; } catch(e){}
    weaponLayer.style.display = playing && weapon ? 'block' : 'none';
    if (!playing || !weapon) return;
    if (weapon.id !== lastWeaponId) {
      lastWeaponId = weapon.id;
      weaponImg.src = livePaths[weapon.id] || livePaths.staffline;
      weaponImg.alt = weapon.name || 'Active WOMP';
      weaponLayer.classList.remove('swap'); void weaponLayer.offsetWidth; weaponLayer.classList.add('swap');
    }
    if (shot && shot !== lastShotStamp) {
      lastShotStamp = shot;
      weaponLayer.classList.remove('fire'); void weaponLayer.offsetWidth; weaponLayer.classList.add('fire');
    }
  }
  window.GBWeaponLayer = { sync: syncWeaponLayer };
  setInterval(syncWeaponLayer, 33);

  // ---------- Gameplay presentation layer ----------
  const shell = document.createElement('div');
  shell.id = 'gb-presentation';
  shell.innerHTML = `
    <i class="gb-corner tl"></i><i class="gb-corner tr"></i><i class="gb-corner bl"></i><i class="gb-corner br"></i>
    <div id="gb-song-chip"><i id="gb-song-dot"></i><span>NOW PLAYING</span><b>GUNS AND BUTTER 3</b></div>
    <div id="gb-hit-marker"></div>
    <div id="gb-combo-burst"></div>
    <div id="gb-weapon-banner"><small>WOMP EQUIPPED</small><strong></strong><span></span></div>
    <div id="gb-eq">${Array.from({length:18},(_,i)=>`<i style="animation-delay:${(i%6)*-.08}s"></i>`).join('')}</div>
    <div id="gb-impact-flash"></div>
    <div id="gb-vignette"></div>
    <div id="gb-wave-title" class="gb-wave-title"><small>LIVE RANGE</small><strong>WAVE 1</strong></div>`;
  document.body.appendChild(shell);

  function isPlaying(){ try { return gameState === 'PLAYING'; } catch(e){ return false; } }
  function syncShell(){ shell.style.display = isPlaying() ? 'block' : 'none'; }
  syncShell();
  setInterval(syncShell, 450);

  function pulse(el, cls='show') {
    if (!el) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  window.GBPresentation = {
    hit(critical=false){
      const hm=byId('gb-hit-marker');
      hm.classList.toggle('crit',!!critical); pulse(hm,'pop');
      pulse(byId('gb-impact-flash'));
    },
    combo(level){
      if (level < 2) return;
      const el=byId('gb-combo-burst');
      const word = level >= 8 ? 'MASS PRODUCTION' : level >= 5 ? 'HEAVY ROTATION' : level >= 3 ? 'ON BEAT' : 'LOCKED IN';
      el.innerHTML = `<em>x${level}</em> ${word}`;
      pulse(el);
    },
    weapon(w){
      const b=byId('gb-weapon-banner');
      if(!b||!w)return;
      b.querySelector('strong').textContent=w.name;
      b.querySelector('span').textContent=(w.tagline||w.cls||'WOMP').toUpperCase();
      pulse(b);
    },
    wave(n){
      const el=byId('gb-wave-title'); el.querySelector('strong').textContent=`WAVE ${n}`; pulse(el);
    }
  };

  // ---------- Hook game state changes without replacing the core engine ----------
  if (typeof setupWeapon === 'function') {
    const baseSetupWeapon = setupWeapon;
    setupWeapon = function(index){
      const result = baseSetupWeapon(index);
      try { if (activeWeapon) GBPresentation.weapon(activeWeapon); } catch(e){}
      return result;
    };
  }

  if (typeof setupWave === 'function') {
    const baseSetupWave = setupWave;
    setupWave = function(n){
      const result = baseSetupWave(n);
      setTimeout(()=>GBPresentation.wave(n),80);
      return result;
    };
  }

  if (typeof damageTarget === 'function') {
    const baseDamage = damageTarget;
    damageTarget = function(target,dmg,px,py){
      const before = target ? target.hp : 0;
      const result = baseDamage(target,dmg,px,py);
      const critical = !!target && (target.status === 'BROKEN' || dmg >= Math.max(28,(target.maxHp||100)*.34));
      GBPresentation.hit(critical);
      try { GBPresentation.combo(combo); } catch(e){}
      if (critical && navigator.vibrate) navigator.vibrate(critical ? 18 : 8);
      return result;
    };
  }

  if (typeof showScoreScreen === 'function') {
    const baseScore = showScoreScreen;
    showScoreScreen = function(){
      const r=baseScore();
      shell.style.display='none';
      return r;
    };
  }

  // Arsenal title and microcopy
  const arsenalTitle = document.querySelector('#screen-arsenal h2');
  if (arsenalTitle) arsenalTitle.textContent = 'CHOOSE YOUR WOMP';
  const arsenalSub = document.querySelector('#screen-arsenal .subtitle');
  if (arsenalSub) arsenalSub.textContent = 'Weapons of Mass Production • Select a sound • Make an impact';
})();