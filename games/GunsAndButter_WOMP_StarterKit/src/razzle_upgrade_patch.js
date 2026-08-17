(function(){
  const extra = {
    weaponSheets: {},
    projectileFX: new Image(),
    rangeProps: new Image(),
    targetHD: {}
  };

  const weaponIds = ['staffline','cd_double_barrel','note_rifle','harp_javelin','hand_cannon_808','vinyl_launcher','keytar_rifle'];
  const weaponTheme = {
    staffline: ['#ffd55d','#22d9ff'],
    cd_double_barrel: ['#ff9a3c','#ff47d1'],
    note_rifle: ['#ffd55d','#ff9a3c'],
    harp_javelin: ['#be6dff','#ffcc66'],
    hand_cannon_808: ['#ff5e5e','#8e5bff'],
    vinyl_launcher: ['#ff9a3c','#ff3d7a'],
    keytar_rifle: ['#22d9ff','#86ff9d']
  };
  const targetTypes = ['bullseye','silhouette','speaker','crate','barrel','terminal'];
  const projectileRows = { note_round:0, charged_disc:1, harp_javelin:2, bass_sphere:3, vinyl_disc:4, synth_wave:5 };

  weaponIds.forEach(id => {
    const img = new Image();
    img.src = `assets/upgrade/weapons/${id}_anim_sheet.png`;
    extra.weaponSheets[id] = img;
  });
  extra.projectileFX.src = 'assets/upgrade/projectiles/womp_projectile_fx_sheet.png';
  extra.rangeProps.src = 'assets/upgrade/range/range_props_sheet.png';
  targetTypes.forEach(t => {
    const img = new Image();
    img.src = `assets/upgrade/targets/${t}_hd.png`;
    extra.targetHD[t] = img;
  });

  function hydrateHDTargets() {
    if (extra.targetHD.bullseye.complete) {
      assets.targetBullseye = extra.targetHD.bullseye;
      assets.targetSilhouette = extra.targetHD.silhouette;
      assets.targetSpeaker = extra.targetHD.speaker;
      assets.targetCrate = extra.targetHD.crate;
      assets.targetBarrel = extra.targetHD.barrel;
      assets.targetTerminal = extra.targetHD.terminal;
    } else {
      setTimeout(hydrateHDTargets, 300);
    }
  }
  hydrateHDTargets();

  const originalDamageTarget = damageTarget;
  const originalSpawnDebris = spawnDebrisFromTarget;
  const originalDrawWeaponShowcase = drawWeaponShowcase;
  const originalDrawCanyonBackground = drawCanyonBackground;
  const originalUpdate = update;
  const originalDraw = draw;

  spawnTarget = function(type, x0, y0, z0, speed = 0) {
    const id = Math.random().toString(36).substring(2, 9);
    const info = TARGET_TYPES[type];
    const mount = type === 'bullseye' || type === 'silhouette' ? (Math.random() > 0.45 ? 'rope' : 'wood')
                : type === 'crate' || type === 'barrel' ? 'wood'
                : 'metal';
    const supportMax = mount === 'metal' ? 130 : mount === 'rope' ? 48 : 78;
    targets.push({
      id,
      type,
      x: x0,
      y: y0,
      z: z0,
      baseX: x0,
      baseY: y0,
      hp: info.maxHp,
      maxHp: info.maxHp,
      points: info.points,
      sfx: info.sfx,
      vx: speed,
      wobble: 0,
      wobbleSpeed: 0,
      shake: 0,
      status: 'INTACT',
      brokenTime: 0,
      mount,
      supportHp: supportMax,
      supportMaxHp: supportMax,
      swingAngle: (Math.random() - 0.5) * 0.08,
      swingVel: 0,
      rot: 0,
      rotVel: 0,
      fallVX: 0,
      fallVY: 0,
      falling: false,
      burning: 0,
      sparkCooldown: 0,
      explosive: type === 'barrel',
      lastImpactAt: 0,
      renderScale: 1,
      supportCrush: 0,
      ornamentSeed: Math.random() * 999
    });
  };

  function spawnExplosionBurst(cx, cy, colorA, colorB, amount = 16) {
    for (let i = 0; i < amount; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 60 + Math.random() * 240;
      particles.push({
        x: cx * W,
        y: cy * H,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - 80,
        gravity: 420,
        r: 6 + Math.random() * 12,
        color: Math.random() > 0.45 ? colorA : colorB,
        life: 0.55 + Math.random() * 0.55,
        maxLife: 1.1,
        isMuzzleFlash: false
      });
    }
  }

  damageTarget = function(target, dmg, projX, projY) {
    if (target.hp <= 0) return;

    const horizontalBias = (projX - target.x) * 28;
    target.lastImpactAt = performance.now();
    target.swingVel = (target.swingVel || 0) + horizontalBias * 0.025 + (Math.random() - 0.5) * 0.03;
    target.rotVel = (target.rotVel || 0) + horizontalBias * 0.6;

    if (target.mount === 'wood') {
      const supportHit = projY > target.y + 0.035 ? 1.7 : 0.8;
      target.supportHp -= dmg * supportHit;
      target.supportCrush = Math.min(1, 1 - target.supportHp / target.supportMaxHp);
      spawnExplosionBurst(target.x, target.y + 0.12, '#d59a4d', '#fff0c2', 4);
    } else if (target.mount === 'rope') {
      target.supportHp -= dmg * 0.95;
      target.supportCrush = Math.min(1, 1 - target.supportHp / target.supportMaxHp);
    } else {
      target.supportHp -= dmg * 0.18;
      spawnExplosionBurst(target.x, target.y, '#7ee7ff', '#ffffff', 2);
    }

    if ((target.type === 'barrel' || target.type === 'crate') && dmg >= 18) {
      target.burning = Math.max(target.burning, 1.4 + Math.random());
    }

    originalDamageTarget(target, dmg, projX, projY);

    if (target.supportHp <= 0 && !target.falling && target.status !== 'BROKEN') {
      target.falling = true;
      target.fallVX = horizontalBias * 0.0008 + (Math.random() - 0.5) * 0.025;
      target.fallVY = -0.02 - Math.random() * 0.03;
      target.rotVel += (Math.random() - 0.5) * 4.5;
      spawnFloatingText('SUPPORT DOWN!', projX * W, projY * H + 28, '#ff9a3c');
    }

    if (target.status === 'BROKEN') {
      target.brokenTime = performance.now();
      if (target.explosive) {
        spawnExplosionBurst(target.x, target.y, '#ff7b3c', '#ffd45c', 24);
        for (let i = 0; i < 10; i++) spawnSpark(target.x * W, target.y * H, '#ff9a3c', (Math.random() - 0.5) * 160, -60 - Math.random() * 120);
      }
    }
  };

  spawnDebrisFromTarget = function(target) {
    originalSpawnDebris(target);
    // amplify debris count and create a few forward chunks
    const info = TARGET_TYPES[target.type];
    for (let i = 0; i < 6; i++) {
      debris.push({
        x: target.x * W + (Math.random() - 0.5) * 20,
        y: target.y * H + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 320,
        vy: -120 - Math.random() * 260,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 12,
        scale: 0.8 + target.z * 0.9 + Math.random() * 0.4,
        sheetX: info.x,
        sheetY: info.y,
        qw: info.w / 2,
        qh: info.h / 2,
        life: 1.2 + Math.random() * 0.7,
        maxLife: 1.7
      });
    }
  };

  function getWeaponFrame() {
    if (isReloading) return 4;
    if (isInspecting) return 5;
    if (ammoLeft <= 0) return 7;
    if (performance.now() - lastFireTime < 60) return 2;
    if (performance.now() - lastFireTime < 125) return 3;
    if (performance.now() - lastFireTime < 240) return 1;
    return isADS ? 6 : 0;
  }

  drawWeaponShowcase = function(ctx, now, panX, panY) {
    const sheet = extra.weaponSheets[activeWeapon.id];
    if (!sheet || !sheet.complete || !sheet.naturalWidth) {
      return originalDrawWeaponShowcase(ctx, now, panX, panY);
    }
    const [accent, accent2] = weaponTheme[activeWeapon.id] || ['#ffd55d', '#22d9ff'];
    const frame = getWeaponFrame();
    const frameW = 720, frameH = 380;
    const motionX = Math.sin(now * 0.0017) * 6 + mx * 18 + panX * 0.04;
    const motionY = Math.cos(now * 0.0012) * 4 + my * 10 + gunRecoilZ * 0.09 + panY * 0.03;
    let drawW = Math.min(W * 0.46, 660);
    let drawH = drawW * (frameH / frameW);
    if (drawH > H * 0.34) {
      drawH = H * 0.34;
      drawW = drawH * (frameW / frameH);
    }
    const drawX = W - drawW - 8 + motionX;
    const drawY = H - drawH - 18 + motionY;

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const glow = ctx.createRadialGradient(drawX + drawW * 0.58, drawY + drawH * 0.6, 24, drawX + drawW * 0.58, drawY + drawH * 0.6, drawW * 0.55);
    glow.addColorStop(0, `${accent2}28`);
    glow.addColorStop(0.45, `${accent}12`);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.ellipse(drawX + drawW * 0.6, drawY + drawH * 0.62, drawW * 0.55, drawH * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.filter = `drop-shadow(0 14px 24px rgba(0,0,0,.75)) drop-shadow(0 0 20px ${accent2})`;
    ctx.imageSmoothingEnabled = true;
    if ('imageSmoothingQuality' in ctx) ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(sheet, frameW * frame, 0, frameW, frameH, drawX, drawY, drawW, drawH);
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,.18)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(drawX + drawW * 0.55, drawY + drawH * 0.58);
    ctx.lineTo(drawX + drawW * 0.92, drawY + drawH * 0.58 + Math.sin(now * 0.006) * 6);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.textAlign = 'right';
    ctx.font = '700 12px Rajdhani';
    ctx.fillStyle = 'rgba(255,255,255,.5)';
    ctx.fillText((activeWeapon.cls || 'womp').toUpperCase(), W - 30, H - 20);
    ctx.font = '700 16px Rajdhani';
    ctx.fillStyle = accent;
    ctx.fillText(activeWeapon.name.toUpperCase(), W - 30, H - 39);
    ctx.restore();
  };

  drawCanyonBackground = function(ctx, panX, panY) {
    originalDrawCanyonBackground(ctx, panX, panY);
    if (!extra.rangeProps.complete) return;

    // Props sheet helpers (4x2 grid, 256 each)
    const drawProp = (index, dx, dy, dw, dh, alpha=1) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.drawImage(extra.rangeProps, (index % 4) * 256, Math.floor(index / 4) * 256, 256, 256, dx, dy, dw, dh);
      ctx.restore();
    };

    drawProp(5, W * 0.42 + panX * 0.04, H * 0.61 + panY * 0.02, 140, 140, 0.95);
    drawProp(6, W * 0.74 + panX * 0.1, H * 0.52 + panY * 0.04, 105, 105, 0.6);

    targets.forEach(t => {
      if (t.status === 'BROKEN') return;
      const px = t.x * W + panX;
      const py = t.y * H + panY;
      const scale = 0.5 + t.z * 0.7;
      const targetW = 82 + t.z * 52;
      const postH = H * 0.18 + (1 - t.z) * H * 0.18;

      if (t.mount === 'rope') {
        ctx.save();
        ctx.strokeStyle = 'rgba(176,143,94,.8)';
        ctx.lineWidth = 2 + t.z;
        const topY = py - postH;
        const midX = px + Math.sin(t.swingAngle || 0) * 18;
        ctx.beginPath();
        ctx.moveTo(px, topY);
        ctx.quadraticCurveTo(midX, topY + postH * 0.35, px, py - targetW * 0.38);
        ctx.stroke();
        drawProp(2, px - 32, topY - 16, 64, 64, 0.95);
        ctx.restore();
      } else if (t.mount === 'wood') {
        const crackAlpha = Math.min(1, 1 - (t.supportHp / t.supportMaxHp));
        drawProp(0, px - 28 * scale, py + targetW * 0.24, 56 * scale, postH, 0.95);
        if (crackAlpha > 0.15) {
          ctx.save();
          ctx.strokeStyle = `rgba(255,170,100,${0.3 + crackAlpha * 0.6})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(px - 8, py + targetW * 0.3);
          ctx.lineTo(px + 4, py + targetW * 0.46);
          ctx.lineTo(px - 5, py + targetW * 0.62);
          ctx.stroke();
          ctx.restore();
        }
      } else {
        drawProp(1, px - 20 * scale, py + targetW * 0.24, 40 * scale, postH, 0.85);
      }

      if (t.burning > 0.05) {
        drawProp(3, px - 56, py + targetW * 0.18, 112, 90, 0.45 + Math.min(0.5, t.burning * 0.2));
      }
    });
  };

  update = function(dt) {
    originalUpdate(dt);

    for (const t of targets) {
      if (!t.mount || t.status === 'BROKEN') continue;

      if (t.mount === 'rope' && !t.falling) {
        t.swingVel += (-t.swingAngle * 5.8 - t.swingVel * 2.4) * dt;
        t.swingAngle += t.swingVel * dt;
        t.x = t.baseX + Math.sin(t.swingAngle) * (0.026 + (1 - t.z) * 0.01);
      }

      if (t.falling) {
        t.fallVY += 0.75 * dt;
        t.y += t.fallVY;
        t.x += t.fallVX;
        t.rot += t.rotVel * dt;
        t.rotVel *= 0.995;
        if (t.y >= 0.82) {
          t.hp = 0;
          t.status = 'BROKEN';
          spawnDebrisFromTarget(t);
          if (window.AudioManager) window.AudioManager.playTargetBreak('explosion', { x: t.x, y: t.y });
        }
      }

      if (t.burning > 0) {
        t.burning = Math.max(0, t.burning - dt * 0.18);
        t.sparkCooldown = (t.sparkCooldown || 0) - dt;
        if (t.sparkCooldown <= 0) {
          t.sparkCooldown = 0.03 + Math.random() * 0.08;
          const cx = t.x * W + (Math.random() - 0.5) * 32;
          const cy = t.y * H + 16 + Math.random() * 12;
          particles.push({ x: cx, y: cy, vx: (Math.random() - 0.5) * 35, vy: -45 - Math.random() * 60, gravity: -10, r: 8 + Math.random() * 10, color: Math.random() > 0.4 ? '#ff9a3c' : '#ffd55d', life: 0.35 + Math.random() * 0.28, maxLife: 0.7, isMuzzleFlash: false });
          particles.push({ x: cx, y: cy, vx: (Math.random() - 0.5) * 18, vy: -24 - Math.random() * 32, gravity: -6, r: 12 + Math.random() * 14, color: 'rgba(120,120,120,0.25)', life: 0.45, maxLife: 0.45, isMuzzleFlash: false });
        }
      }
    }
  };

  function renderPostFX() {
    if (gameState !== 'PLAYING') return;

    // Enhanced projectile glows
    if (extra.projectileFX.complete) {
      projectiles.forEach(p => {
        const row = projectileRows[p.type];
        if (row == null) return;
        const fxFrame = Math.floor((performance.now() / 60) % 4);
        const px = p.x * W - mx * 150 + camRecoilX;
        const py = p.y * H - my * 100 + camRecoilY;
        const size = 34 + p.radius * 360 * (0.4 + p.z);
        x.save();
        x.globalAlpha = 0.85;
        x.globalCompositeOperation = 'screen';
        x.drawImage(extra.projectileFX, fxFrame * 128, row * 128, 128, 128, px - size/2, py - size/2, size, size);
        x.restore();
      });
    }

    // Target overlay FX: flames, support failure indicators, and impact dings.
    targets.forEach(t => {
      if (t.status === 'BROKEN') return;
      const panX = -mx * 150 + camRecoilX;
      const panY = -my * 100 + camRecoilY;
      const px = t.x * W + panX;
      const py = t.y * H + panY;
      const sz = 82 + t.z * 52;

      if (t.mount === 'metal' && t.supportHp < t.supportMaxHp) {
        x.save();
        x.strokeStyle = 'rgba(126,231,255,.45)';
        x.lineWidth = 2;
        x.beginPath();
        x.arc(px + sz*0.18, py - sz*0.14, sz*0.1, 0, Math.PI*2);
        x.stroke();
        x.restore();
      }

      if (t.lastImpactAt && performance.now() - t.lastImpactAt < 160) {
        x.save();
        x.globalCompositeOperation = 'screen';
        x.strokeStyle = 'rgba(255,235,180,.75)';
        x.lineWidth = 2;
        x.beginPath();
        x.arc(px, py, sz * 0.62 * (1 + (performance.now() - t.lastImpactAt) / 160), 0, Math.PI * 2);
        x.stroke();
        x.restore();
      }

      if (t.burning > 0) {
        x.save();
        x.globalCompositeOperation = 'screen';
        const fire = x.createRadialGradient(px, py + sz*0.12, 4, px, py + sz*0.12, sz*0.55);
        fire.addColorStop(0, 'rgba(255,220,120,.25)');
        fire.addColorStop(0.55, 'rgba(255,125,40,.16)');
        fire.addColorStop(1, 'rgba(0,0,0,0)');
        x.fillStyle = fire;
        x.beginPath();
        x.ellipse(px, py + sz*0.12, sz*0.48, sz*0.32, 0, 0, Math.PI*2);
        x.fill();
        x.restore();
      }
    });
  }

  draw = function() {
    originalDraw();
    renderPostFX();
  };

  // switch the loop over on the very next scheduled frame
  console.log('Guns & Butter Razzle Patch armed.');
})();
