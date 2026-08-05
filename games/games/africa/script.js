(() => {
  const experience = document.getElementById('experience');
  const panels = [...document.querySelectorAll('.panel')];
  const progressFill = document.getElementById('progressFill');
  const toast = document.getElementById('toast');

  const state = {
    affirmation: '',
    goal: '',
    connection: '',
    selflove: '',
    sound: false,
    awakeningNumber: ''
  };

  const stepOrder = ['intro', 'affirmation', 'goal', 'connection', 'selflove', 'ritual', 'result'];
  const dawnMap = { intro: 0, affirmation: .15, goal: .32, connection: .5, selflove: .68, ritual: .82, result: 1 };

  function showPanel(name) {
    panels.forEach(panel => panel.classList.toggle('active', panel.dataset.panel === name));
    const index = stepOrder.indexOf(name);
    progressFill.style.width = `${Math.max(0, index / (stepOrder.length - 1)) * 100}%`;
    experience.style.setProperty('--dawn', dawnMap[name] ?? 0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (state.sound) playTone(250 + index * 45, .08);
  }

  document.addEventListener('click', (event) => {
    const next = event.target.closest('[data-next]');
    const back = event.target.closest('[data-back]');
    if (next && !next.disabled) showPanel(next.dataset.next);
    if (back) showPanel(back.dataset.back);
  });

  document.querySelectorAll('.choices').forEach(group => {
    group.addEventListener('click', event => {
      const choice = event.target.closest('.choice');
      if (!choice) return;

      group.querySelectorAll('.choice').forEach(item => item.classList.remove('selected'));
      choice.classList.add('selected');

      const key = group.dataset.group;
      state[key] = choice.dataset.value;
      group.closest('.step-card').querySelector('.next-step').disabled = false;

      updatePreview(key);
      if (state.sound) playTone({ affirmation: 330, goal: 392, selflove: 494 }[key] || 440, .12);
    });
  });

  const connectionName = document.getElementById('connectionName');
  connectionName.addEventListener('input', () => {
    state.connection = connectionName.value.trim();
    const panel = connectionName.closest('.step-card');
    panel.querySelector('.next-step').disabled = state.connection.length < 2;
    updatePreview('connection');
  });

  function updatePreview(key) {
    const map = {
      affirmation: ['previewAffirmation', state.affirmation || 'Your first intention will appear here.'],
      goal: ['previewGoal', state.goal ? `Today, I will place my energy into ${state.goal}.` : 'Your focus for today will appear here.'],
      connection: ['previewConnection', state.connection ? `I will make space to check on ${state.connection}.` : 'The person you choose will appear here.'],
      selflove: ['previewSelflove', state.selflove ? `I will honor myself by ${state.selflove}.` : 'Your act of care will appear here.']
    };
    const [id, text] = map[key];
    document.getElementById(id).textContent = text;
  }

  const soundToggle = document.getElementById('soundToggle');
  let audioContext;
  soundToggle.addEventListener('click', () => {
    state.sound = !state.sound;
    soundToggle.setAttribute('aria-pressed', String(state.sound));
    if (state.sound) playTone(294, .12);
  });

  function playTone(frequency, duration) {
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(.08, audioContext.currentTime + .015);
      gain.gain.exponentialRampToValueAtTime(.0001, audioContext.currentTime + duration);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration + .03);
    } catch {}
  }

  const orb = document.getElementById('holdOrb');
  const holdStatus = document.getElementById('holdStatus');
  let holdFrame = 0;
  let holdStart = 0;
  const holdDuration = 3000;

  function beginHold(event) {
    event.preventDefault();
    holdStart = performance.now();
    cancelAnimationFrame(holdFrame);
    const tick = now => {
      const progress = Math.min(1, (now - holdStart) / holdDuration);
      orb.style.setProperty('--hold', `${progress * 100}%`);
      holdStatus.textContent = progress < 1 ? 'Keep holding…' : 'Your intention is ready.';
      if (state.sound && progress > .04 && Math.floor(progress * 10) !== Math.floor((progress - .02) * 10)) {
        playTone(350 + progress * 300, .05);
      }
      if (progress >= 1) {
        completeJourney();
        return;
      }
      holdFrame = requestAnimationFrame(tick);
    };
    holdFrame = requestAnimationFrame(tick);
  }

  function cancelHold() {
    if (!holdStart) return;
    cancelAnimationFrame(holdFrame);
    holdStart = 0;
    orb.style.setProperty('--hold', '0%');
    holdStatus.textContent = 'Hold for three seconds';
  }

  orb.addEventListener('pointerdown', beginHold);
  orb.addEventListener('pointerup', cancelHold);
  orb.addEventListener('pointerleave', cancelHold);
  orb.addEventListener('pointercancel', cancelHold);

  function completeJourney() {
    holdStart = 0;
    state.awakeningNumber = String(Date.now()).slice(-6);
    populateResult();
    showPanel('result');
    if (state.sound) {
      [392, 494, 587, 784].forEach((tone, index) => setTimeout(() => playTone(tone, .25), index * 120));
    }
    saveJournalEntry();
  }

  function sentenceCase(text) {
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
  }

  function buildIntention() {
    return `${state.affirmation} Today, I will place my energy into ${state.goal}. I will check on ${state.connection}. I will honor myself by ${state.selflove}.`;
  }

  function populateResult() {
    document.getElementById('awakeningNumber').textContent = `AWAKENING #${state.awakeningNumber}`;
    document.getElementById('finalIntention').textContent = `“${buildIntention()}”`;
    document.getElementById('certAffirmation').textContent = state.affirmation;
    document.getElementById('certGoal').textContent = sentenceCase(state.goal);
    document.getElementById('certConnection').textContent = state.connection;
    document.getElementById('certSelflove').textContent = sentenceCase(state.selflove);
    document.getElementById('certDate').textContent = new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(new Date());
  }

  function saveJournalEntry() {
    try {
      const journal = JSON.parse(localStorage.getItem('iwokeupready-journal') || '[]');
      journal.unshift({ ...state, intention: buildIntention(), date: new Date().toISOString() });
      localStorage.setItem('iwokeupready-journal', JSON.stringify(journal.slice(0, 30)));
    } catch {}
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2200);
  }

  document.getElementById('copyIntention').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(buildIntention());
      showToast('Intention copied');
    } catch {
      showToast('Copy was blocked by your browser');
    }
  });

  document.getElementById('restartExperience').addEventListener('click', () => {
    Object.assign(state, { affirmation: '', goal: '', connection: '', selflove: '', awakeningNumber: '' });
    document.querySelectorAll('.choice').forEach(choice => choice.classList.remove('selected'));
    document.querySelectorAll('.next-step').forEach(button => button.disabled = true);
    connectionName.value = '';
    document.getElementById('participantName').value = '';
    orb.style.setProperty('--hold', '0%');
    holdStatus.textContent = 'Hold for three seconds';
    ['affirmation','goal','connection','selflove'].forEach(updatePreview);
    showPanel('intro');
  });

  document.querySelectorAll('[data-placeholder-link]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      showToast('Replace this link in index.html with your website URL');
    });
  });

  document.getElementById('downloadCertificate').addEventListener('click', () => exportArtwork('certificate'));
  document.getElementById('downloadStory').addEventListener('click', () => exportArtwork('story'));

  function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 8) {
    const words = text.split(/\s+/);
    let line = '';
    const lines = [];
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    lines.slice(0, maxLines).forEach((value, index) => ctx.fillText(value, x, y + index * lineHeight));
    return lines.length * lineHeight;
  }

  function drawPattern(ctx, width, height, pad = 38) {
    ctx.save();
    ctx.strokeStyle = '#c89a46';
    ctx.lineWidth = 3;
    ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);
    ctx.lineWidth = 1;
    ctx.strokeRect(pad + 12, pad + 12, width - (pad + 12) * 2, height - (pad + 12) * 2);

    ctx.globalAlpha = .42;
    for (let x = pad + 20; x < width - pad - 20; x += 28) {
      ctx.beginPath();
      ctx.moveTo(x, pad + 3);
      ctx.lineTo(x + 10, pad + 13);
      ctx.lineTo(x, pad + 23);
      ctx.lineTo(x - 10, pad + 13);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, height - pad - 3);
      ctx.lineTo(x + 10, height - pad - 13);
      ctx.lineTo(x, height - pad - 23);
      ctx.lineTo(x - 10, height - pad - 13);
      ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();
  }

  function exportArtwork(type) {
    const canvas = document.getElementById('exportCanvas');
    const ctx = canvas.getContext('2d');
    const isStory = type === 'story';
    canvas.width = isStory ? 1080 : 1600;
    canvas.height = isStory ? 1920 : 1100;
    const w = canvas.width, h = canvas.height;
    const name = document.getElementById('participantName').value.trim() || 'The Participant';

    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, isStory ? '#123b32' : '#fffaf0');
    gradient.addColorStop(1, isStory ? '#087f83' : '#f1dfc1');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    if (isStory) {
      ctx.fillStyle = '#f4c36f';
      ctx.beginPath();
      ctx.arc(w * .72, h * .24, 120, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#214b3c';
      ctx.beginPath();
      ctx.moveTo(0, h * .54);
      ctx.bezierCurveTo(w*.25,h*.43,w*.45,h*.58,w*.66,h*.48);
      ctx.bezierCurveTo(w*.82,h*.41,w*.92,h*.5,w,h*.44);
      ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.closePath(); ctx.fill();

      ctx.fillStyle = '#0c3028';
      ctx.beginPath();
      ctx.moveTo(0, h * .63);
      ctx.bezierCurveTo(w*.22,h*.51,w*.43,h*.67,w*.66,h*.57);
      ctx.bezierCurveTo(w*.82,h*.49,w*.93,h*.62,w,h*.56);
      ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.closePath(); ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.font = '900 30px Arial';
      ctx.fillText('I WOKE UP IN AFRICA', w/2, 130);
      ctx.font = '700 20px Arial';
      ctx.fillStyle = '#f1c879';
      ctx.fillText('THE AWAKENING JOURNEY', w/2, 174);

      ctx.font = '700 78px Georgia';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('I Woke Up Ready', w/2, 340);

      ctx.font = 'italic 44px Georgia';
      ctx.fillStyle = '#fff7e5';
      wrapText(ctx, `“${buildIntention()}”`, w/2, 490, 850, 62, 11);

      ctx.font = '700 30px Arial';
      ctx.fillStyle = '#f1c879';
      ctx.fillText(name, w/2, 1430);
      ctx.font = '700 20px Arial';
      ctx.fillStyle = 'rgba(255,255,255,.78)';
      ctx.fillText(`AWAKENING #${state.awakeningNumber}`, w/2, 1470);
      ctx.fillText(new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(new Date()), w/2, 1510);

      drawPattern(ctx, w, h, 34);
    } else {
      drawPattern(ctx, w, h, 42);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#087f83';
      ctx.font = '900 21px Arial';
      ctx.fillText('I WOKE UP IN AFRICA', w/2, 112);

      ctx.fillStyle = '#123b32';
      ctx.font = '700 72px Georgia';
      ctx.fillText('Certificate of Intention', w/2, 208);

      ctx.fillStyle = '#9a7651';
      ctx.font = '800 18px Arial';
      ctx.fillText('THE AWAKENING JOURNEY', w/2, 248);

      ctx.fillStyle = '#5d4b35';
      ctx.font = '20px Arial';
      ctx.fillText('This certifies that', w/2, 318);

      ctx.fillStyle = '#9a4f32';
      ctx.font = '700 50px Georgia';
      ctx.fillText(name, w/2, 382);

      ctx.fillStyle = '#9a4f32';
      ctx.font = 'italic 30px Georgia';
      const used = wrapText(ctx, `“${buildIntention()}”`, w/2, 465, 1260, 43, 6);

      const gridY = 465 + used + 45;
      const items = [
        ['GUIDING WORD', state.affirmation],
        ['TODAY’S FOCUS', sentenceCase(state.goal)],
        ['CONNECTION', state.connection],
        ['SELF-LOVE', sentenceCase(state.selflove)]
      ];
      const colW = 650, rowH = 100, startX = 150;
      items.forEach((item, i) => {
        const col = i % 2, row = Math.floor(i / 2);
        const x = startX + col * colW, y = gridY + row * rowH;
        ctx.fillStyle = '#9a7651';
        ctx.textAlign = 'left';
        ctx.font = '900 14px Arial';
        ctx.fillText(item[0], x, y);
        ctx.fillStyle = '#123b32';
        ctx.font = '700 20px Arial';
        wrapText(ctx, item[1], x, y + 31, colW - 70, 27, 2);
      });

      ctx.textAlign = 'left';
      ctx.fillStyle = '#9a7651';
      ctx.font = '900 14px Arial';
      ctx.fillText('COMPLETED', 150, 1010);
      ctx.fillStyle = '#123b32';
      ctx.font = '700 20px Arial';
      ctx.fillText(new Intl.DateTimeFormat(undefined, { dateStyle: 'long' }).format(new Date()), 150, 1040);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#123b32';
      ctx.font = 'italic 30px Georgia';
      ctx.fillText('2fly Keith Logan', 1450, 1012);
      ctx.fillStyle = '#9a7651';
      ctx.font = '900 13px Arial';
      ctx.fillText(`CREATOR • AWAKENING #${state.awakeningNumber}`, 1450, 1040);
    }

    const link = document.createElement('a');
    link.download = isStory ? 'i-woke-up-ready-story-card.png' : 'i-woke-up-ready-certificate.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast(isStory ? 'Story card downloaded' : 'Certificate downloaded');
  }

  showPanel('intro');
})();
