/* 2Fly Final Beta — Playable Music release layer */
(() => {
  'use strict';

  const qs = (selector, root = document) => root.querySelector(selector);
  const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const progressKey = '2fly-playable-sequence-v1';
  const postedKey = '2fly-keep-me-posted-beta-v1';
  let sequenceRequest = null;
  let introTimer = null;

  function safeRead(key, fallback = {}) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch (_) {
      return fallback;
    }
  }

  function safeWrite(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (_) {
      return false;
    }
  }

  function projectForUrl(url = '') {
    if (!url || typeof state === 'undefined') return null;
    const clean = String(url).split('?')[0];
    return state.projects.find(project => {
      const experience = String(project.experience || '').split('?')[0];
      return experience && (experience === clean || clean.includes(experience) || experience.includes(clean));
    }) || null;
  }

  function projectForMedia(project) {
    if (!project || typeof state === 'undefined') return null;
    if (project.id) return state.projects.find(item => item.id === project.id) || project;
    if (project.video) {
      return state.projects.find(item => item.video === project.video || (item.clips || []).some(clip => clip.src === project.video)) || project;
    }
    return project;
  }

  function sequenceProgress(projectId) {
    const all = safeRead(progressKey, {});
    return all[projectId] || { listened: false, watched: false };
  }

  function markSequence(project, step) {
    if (!project?.id) return;
    const all = safeRead(progressKey, {});
    all[project.id] = { listened: false, watched: false, ...(all[project.id] || {}), [step]: true };
    safeWrite(progressKey, all);
  }

  function paintSequenceProgress(project) {
    const node = qs('#sequenceProgress');
    if (!node) return;
    const progress = sequenceProgress(project.id);
    node.innerHTML = `
      <span class="${progress.listened ? 'complete' : ''}"><b>${progress.listened ? '✓' : '1'}</b> LISTEN</span>
      <i>→</i>
      <span class="${progress.watched ? 'complete' : ''}"><b>${progress.watched ? '✓' : '2'}</b> WATCH</span>
      <i>→</i>
      <span class="ready"><b>3</b> PLAY</span>`;
  }

  function openSequence(project, url) {
    sequenceRequest = { project, url };
    qs('#sequenceTitle').textContent = `${project.title.toUpperCase()}: LISTEN. WATCH. PLAY.`;
    qs('#sequenceCopy').textContent = `This Playable Music world was inspired by ${project.title}. The song establishes the meaning, the visual expands the story, and PLAY places you inside it.`;
    paintSequenceProgress(project);
    qs('#sequenceListen').hidden = !project.audio;
    qs('#sequenceWatch').hidden = !project.video;
    openOverlay('#sequenceOverlay');
  }

  const originalPlayProject = typeof playProject === 'function' ? playProject : null;
  if (originalPlayProject) {
    playProject = function finalBetaPlayProject(project, openMusic = true) {
      markSequence(project, 'listened');
      return originalPlayProject(project, openMusic);
    };
  }

  const originalOpenVideo = typeof openVideo === 'function' ? openVideo : null;
  if (originalOpenVideo) {
    openVideo = function finalBetaOpenVideo(project) {
      const resolved = projectForMedia(project);
      markSequence(resolved, 'watched');
      return originalOpenVideo(project);
    };
  }

  const originalOpenExperience = typeof openExperience === 'function' ? openExperience : null;
  if (originalOpenExperience) {
    openExperience = function finalBetaOpenExperience(url, bypassSequence = false) {
      const project = projectForUrl(url);
      if (!bypassSequence && project && (project.audio || project.video)) {
        const progress = sequenceProgress(project.id);
        if (!progress.listened || !progress.watched) {
          openSequence(project, url);
          return;
        }
      }
      return originalOpenExperience(url);
    };
  }

  function bindSequenceMediaTracking() {
    qs('#audio')?.addEventListener('play', () => {
      if (typeof state === 'undefined') return;
      markSequence(state.projects[state.trackIndex], 'listened');
    });
  }

  function bindSequenceOverlay() {
    qs('#sequenceListen')?.addEventListener('click', () => {
      if (!sequenceRequest?.project) return;
      const { project } = sequenceRequest;
      closeOverlay(qs('#sequenceOverlay'));
      playProject(project, true);
    });

    qs('#sequenceWatch')?.addEventListener('click', () => {
      if (!sequenceRequest?.project) return;
      const { project } = sequenceRequest;
      closeOverlay(qs('#sequenceOverlay'));
      openVideo(project);
    });

    qs('#sequencePlay')?.addEventListener('click', () => {
      if (!sequenceRequest?.url) return;
      const request = sequenceRequest;
      closeOverlay(qs('#sequenceOverlay'));
      originalOpenExperience?.(request.url);
    });
  }

  function bindHeroTapZones() {
    qs('#heroTapPrev')?.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      qs('#heroTopPrev')?.click();
    });
    qs('#heroTapNext')?.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      qs('#heroTopNext')?.click();
    });
  }

  function shiftRail(rail, direction) {
    if (!rail) return;
    const card = rail.querySelector(':scope > *');
    const distance = card ? card.getBoundingClientRect().width + 16 : rail.clientWidth * .78;
    rail.scrollBy({ left: direction * distance, behavior: 'smooth' });
  }

  function bindGatewayCarousel() {
    const rail = qs('#gatewayRail');
    qs('#gatewayPrev')?.addEventListener('click', () => shiftRail(rail, -1));
    qs('#gatewayNext')?.addEventListener('click', () => shiftRail(rail, 1));
  }

  const intros = {
    music: ['LISTEN', 'HEAR THE WORK.', 'Every Playable Music world begins with a song.'],
    videos: ['WATCH', 'SEE THE STORY.', 'The visual expands the world before you enter it.'],
    experiences: ['PLAY', 'STEP INSIDE THE SONG.', 'You are no longer only the audience.'],
    flyzone: ['CREATE', 'ENTER FLYZONE.', 'Experiment with the tools shaping what comes next.'],
    motion: ['FOLLOW', "SEE WHAT'S IN MOTION.", 'The blueprint is visible while it is still being drawn.'],
    support: ['PARTICIPATE', 'HELP 2FLY CREATE.', 'Choose the role that matches what the work means to you.']
  };

  function showSectionIntro(view) {
    const copy = intros[view];
    const overlay = qs('#sectionIntroOverlay');
    if (!copy || !overlay) return;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const seenKey = `2fly-intro-${view}`;
    const repeatVisit = sessionStorage.getItem(seenKey) === '1';
    sessionStorage.setItem(seenKey, '1');

    qs('#sectionIntroStep').textContent = copy[0];
    qs('#sectionIntroTitle').textContent = copy[1];
    qs('#sectionIntroLine').textContent = copy[2];
    overlay.classList.add('show');
    clearTimeout(introTimer);
    introTimer = setTimeout(() => overlay.classList.remove('show'), reduced ? 250 : repeatVisit ? 720 : 1550);
  }

  function bindSectionIntros() {
    let initial = true;
    window.addEventListener('hashchange', () => {
      const view = (location.hash || '#home').slice(1).split('/')[0].split('?')[0];
      setTimeout(() => showSectionIntro(view), 20);
    });
    setTimeout(() => { initial = false; }, 50);
    qs('#introHelpCreate')?.addEventListener('click', () => {
      clearTimeout(introTimer);
      qs('#sectionIntroOverlay')?.classList.remove('show');
      navigate('support');
    });
    qs('#skipSectionIntro')?.addEventListener('click', () => {
      clearTimeout(introTimer);
      qs('#sectionIntroOverlay')?.classList.remove('show');
    });
  }

  function bindStaticCreateActions() {
    qs('#staticWorth')?.addEventListener('click', () => openSupport());
    qsa('[data-scroll-to]').forEach(button => {
      button.addEventListener('click', () => qs(`#${button.dataset.scrollTo}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    });

    qs('#postedForm')?.addEventListener('submit', event => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const record = Object.fromEntries(form.entries());
      record.savedAt = new Date().toISOString();
      const records = safeRead(postedKey, []);
      records.push(record);
      safeWrite(postedKey, records.slice(-25));
      event.currentTarget.reset();
      showToast('You are on the Final Beta Keep Me Posted list on this device.');
    });

    const share = async () => {
      const data = {
        title: '2Fly — The Birthplace of Playable Music',
        text: 'Experience the 2Fly Anti-Algorithm Experiment: listen, watch, and play the music.',
        url: location.href.split('#')[0]
      };
      try {
        if (navigator.share) await navigator.share(data);
        else {
          await navigator.clipboard.writeText(data.url);
          showToast('Site link copied. Keep 2Fly posted.');
        }
      } catch (error) {
        if (error?.name !== 'AbortError') showToast('Use your browser share menu to post the site.');
      }
    };

    qs('#shareExperiment')?.addEventListener('click', share);
    qs('#copyExperimentLink')?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(location.href.split('#')[0]);
        showToast('Site link copied.');
      } catch (_) {
        showToast('Copy the address from your browser bar.');
      }
    });
  }

  function motionCategory(item) {
    return item.category || 'Other';
  }

  function renderMotion(items, category = 'All') {
    const grid = qs('#motionGrid');
    if (!grid) return;
    const shown = category === 'All' ? items : items.filter(item => motionCategory(item) === category);
    grid.innerHTML = shown.map(item => `
      <article class="motion-card" data-status="${item.status.toLowerCase().replace(/[^a-z0-9]+/g, '-')}">
        <div class="motion-card-top"><span>${item.category}</span><b>${item.status}</b></div>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="motion-needs"><small>WHAT'S NEXT</small><strong>${item.next || item.need || "Continue development and testing"}</strong></div>
        <div class="motion-actions">
          ${item.link ? `<a href="${item.link}" ${item.external ? 'target="_blank" rel="noopener"' : ''}>${item.action || 'OPEN PROJECT'}</a>` : ''}
          <button data-go="support">HELP 2FLY CREATE</button>
        </div>
      </article>`).join('') || '<p class="motion-empty">No projects match this filter yet.</p>';

    qsa('[data-go]', grid).forEach(button => button.addEventListener('click', () => navigate(button.dataset.go)));
  }

  async function buildMotionBoard() {
    const filter = qs('#motionFilter');
    const grid = qs('#motionGrid');
    if (!filter || !grid) return;
    try {
      const response = await fetch('data/in-motion.json');
      if (!response.ok) throw new Error(`Project board failed: ${response.status}`);
      const items = await response.json();
      const categories = ['All', ...new Set(items.map(motionCategory))];
      filter.innerHTML = categories.map((category, index) => `<button class="${index === 0 ? 'active' : ''}" data-motion-filter="${category}">${category}</button>`).join('');
      qsa('[data-motion-filter]', filter).forEach(button => button.addEventListener('click', () => {
        qsa('[data-motion-filter]', filter).forEach(item => item.classList.toggle('active', item === button));
        renderMotion(items, button.dataset.motionFilter);
      }));
      renderMotion(items);
    } catch (error) {
      console.error(error);
      grid.innerHTML = '<p class="motion-empty">The project board could not load. Refresh the page and try again.</p>';
    }
  }

  function bindFooterOriginLink() {
    qsa('footer [data-go]').forEach(link => link.addEventListener('click', event => {
      event.preventDefault();
      navigate(link.dataset.go);
      setTimeout(() => qs('#birth-of-playable-music')?.scrollIntoView({ behavior: 'smooth' }), 80);
    }));
  }

  function syncFloatingHelp() {
    const update = () => {
      const view = (location.hash || '#home').slice(1).split('/')[0].split('?')[0];
      qs('#floatingHelpCreate')?.classList.toggle('hidden-on-support', view === 'support');
    };
    update();
    window.addEventListener('hashchange', update);
  }

  bindSequenceMediaTracking();
  bindSequenceOverlay();
  bindHeroTapZones();
  bindGatewayCarousel();
  bindSectionIntros();
  bindStaticCreateActions();
  bindFooterOriginLink();
  syncFloatingHelp();
  buildMotionBoard();
})();
