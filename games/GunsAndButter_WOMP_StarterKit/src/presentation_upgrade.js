(function(){
  const byId = id => document.getElementById(id);
  const start = byId('screen-start');
  if (start && !start.querySelector('.gb-start-eq')) {
    const eq = document.createElement('div'); eq.className = 'gb-start-eq';
    eq.innerHTML = Array.from({length:22},(_,i)=>`<i style="animation-delay:${(i%7)*-.07}s"></i>`).join('');
    const btn = byId('btn-start'); start.insertBefore(eq, btn); btn.textContent = 'START EXPERIENCE';
  }
  const enterRange = byId('btn-enter-range');
  if (enterRange) {
    enterRange.textContent = 'DROP INTO RANGE';
    enterRange.addEventListener('click', () => { try { window.AudioManager?.startMusicFromGesture(false); } catch(e){} }, {capture:true});
  }
  const help = byId('help');
  if (help) help.textContent = 'CLICK RANGE TO LOCK AIM • MOUSE = AIM • LMB = FIRE • 1–8 = SWAP WOMP • R = RELOAD • I = INSPECT • ESC = RELEASE';
  const startBtn = byId('btn-start');
  if (startBtn) startBtn.addEventListener('click', () => { try { window.AudioManager?.startMusicFromGesture(true); } catch(e){} }, {capture:true});

  const weaponLayer = document.createElement('div');
  weaponLayer.id = 'gb-live-weapon';
  weaponLayer.innerHTML = '<img alt="Active WOMP">';
  document.body.appendChild(weaponLayer);
  const weaponImg = weaponLayer.querySelector('img');
  weaponImg.style.transform = 'scaleX(-1)';
  weaponImg.style.transformOrigin = 'center center';
  weaponImg.style.opacity = '0.91';
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
  let lastWeaponId = '', lastShotStamp = 0;
  function syncWeaponLayer(){
    let playing=false, weapon=null, shot=0;
    try { playing = gameState === 'PLAYING'; weapon = activeWeapon; shot = lastFireTime || 0; } catch(e){}
    weaponLayer.style.display = playing && weapon ? 'block' : 'none';
    if (!playing || !weapon) return;
    if (weapon.id !== lastWeaponId) {
      lastWeaponId = weapon.id; weaponImg.src = livePaths[weapon.id] || livePaths.staffline; weaponImg.alt = weapon.name || 'Active WOMP';
      weaponLayer.classList.remove('swap'); void weaponLayer.offsetWidth; weaponLayer.classList.add('swap');
    }
    if (shot && shot !== lastShotStamp) {
      lastShotStamp = shot; weaponLayer.classList.remove('fire'); void weaponLayer.offsetWidth; weaponLayer.classList.add('fire');
    }
  }
  window.GBWeaponLayer = { sync: syncWeaponLayer }; setInterval(syncWeaponLayer, 33);

  const shell = document.createElement('div'); shell.id = 'gb-presentation';
  shell.innerHTML = `<i class="gb-corner tl"></i><i class="gb-corner tr"></i><i class="gb-corner bl"></i><i class="gb-corner br"></i><div id="gb-song-chip"><i id="gb-song-dot"></i><span>NOW PLAYING</span><b>GUNS AND BUTTER 3</b></div><div id="gb-hit-marker"></div><div id="gb-combo-burst"></div><div id="gb-weapon-banner"><small>WOMP EQUIPPED</small><strong></strong><span></span></div><div id="gb-eq">${Array.from({length:18},(_,i)=>`<i style="animation-delay:${(i%6)*-.08}s"></i>`).join('')}</div><div id="gb-impact-flash"></div><div id="gb-vignette"></div><div id="gb-wave-title" class="gb-wave-title"><small>LIVE RANGE</small><strong>WAVE 1</strong></div>`;
  document.body.appendChild(shell);
  function isPlaying(){ try { return gameState === 'PLAYING'; } catch(e){ return false; } }
  function syncShell(){ shell.style.display = isPlaying() ? 'block' : 'none'; } syncShell(); setInterval(syncShell,450);
  function pulse(el, cls='show'){ if(!el)return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
  window.GBPresentation={
    hit(critical=false){const hm=byId('gb-hit-marker');hm.classList.toggle('crit',!!critical);pulse(hm,'pop');pulse(byId('gb-impact-flash'));},
    combo(level){if(level<2)return;const el=byId('gb-combo-burst');const word=level>=8?'MASS PRODUCTION':level>=5?'HEAVY ROTATION':level>=3?'ON BEAT':'LOCKED IN';el.innerHTML=`<em>x${level}</em> ${word}`;pulse(el);},
    weapon(w){const b=byId('gb-weapon-banner');if(!b||!w)return;b.querySelector('strong').textContent=w.name;b.querySelector('span').textContent=(w.tagline||w.cls||'WOMP').toUpperCase();pulse(b);},
    wave(n){const el=byId('gb-wave-title');el.querySelector('strong').textContent=`WAVE ${n}`;pulse(el);}
  };
  if(typeof setupWeapon==='function'){const base=setupWeapon;setupWeapon=function(index){const r=base(index);try{if(activeWeapon)GBPresentation.weapon(activeWeapon);}catch(e){}return r;};}
  if(typeof setupWave==='function'){const base=setupWave;setupWave=function(n){const r=base(n);setTimeout(()=>GBPresentation.wave(n),80);return r;};}
  if(typeof damageTarget==='function'){const base=damageTarget;damageTarget=function(target,dmg,px,py){const r=base(target,dmg,px,py);const critical=!!target&&(target.status==='BROKEN'||dmg>=Math.max(28,(target.maxHp||100)*.34));GBPresentation.hit(critical);try{GBPresentation.combo(combo);}catch(e){}if(critical&&navigator.vibrate)navigator.vibrate(18);return r;};}
  if(typeof showScoreScreen==='function'){const base=showScoreScreen;showScoreScreen=function(){const r=base();shell.style.display='none';return r;};}
  const arsenalTitle=document.querySelector('#screen-arsenal h2');if(arsenalTitle)arsenalTitle.textContent='CHOOSE YOUR WOMP';
  const arsenalSub=document.querySelector('#screen-arsenal .subtitle');if(arsenalSub)arsenalSub.textContent='Weapons of Mass Production • Select a sound • Make an impact';
})();