(() => {
  "use strict";

  const DATA = window.TTF_DATA;
  const $ = (selector) => document.querySelector(selector);
  const els = {
    game: $("#game"),
    ambientBackdrop: $("#ambientBackdrop"),
    roomViewport: $("#roomViewport"),
    roomImage: $("#roomImage"),
    nextRoomImage: $("#nextRoomImage"),
    itemAnchor: $("#itemAnchor"),
    itemSprite: $("#itemSprite"),
    itemStatusChip: $("#itemStatusChip"),
    itemAnchorB: $("#itemAnchorB"),
    itemSpriteB: $("#itemSpriteB"),
    itemStatusChipB: $("#itemStatusChipB"),
    emptySignal: $("#emptySignal"),
    risingFire: $("#risingFire"),
    findExitBanner: $("#findExitBanner"),
    exitSignal: $("#exitSignal"),
    roomCounter: $("#roomCounter"),
    viewCounter: $("#viewCounter"),
    savedCounter: $("#savedCounter"),
    timerText: $("#timerText"),
    timerFill: $("#timerFill"),
    roomTag: $("#roomTag"),
    roomTitle: $("#roomTitle"),
    degreeLabel: $("#degreeLabel"),
    directionLabel: $("#directionLabel"),
    promptTitle: $("#promptTitle"),
    promptBody: $("#promptBody"),
    choiceCount: $("#choiceCount"),
    roomObjective: $("#roomObjective"),
    itemReadout: $("#itemReadout"),
    itemKicker: $("#itemKicker"),
    itemName: $("#itemName"),
    itemMeaning: $("#itemMeaning"),
    feedback: $("#feedback"),
    grabBtn: $("#grabBtn"),
    leftBtn: $("#leftBtn"),
    rightBtn: $("#rightBtn"),
    upBtn: $("#upBtn"),
    mobileLeftBtn: $("#mobileLeftBtn"),
    mobileRightBtn: $("#mobileRightBtn"),
    mobileUpBtn: $("#mobileUpBtn"),
    audioBtn: $("#audioBtn"),
    exitBtn: $("#exitBtn"),
    music: $("#music"),
    loadingOverlay: $("#loadingOverlay"),
    loadFill: $("#loadFill"),
    loadText: $("#loadText"),
    introOverlay: $("#introOverlay"),
    startBtn: $("#startBtn"),
    roomTransition: $("#roomTransition"),
    transitionTag: $("#transitionTag"),
    transitionTitle: $("#transitionTitle"),
    transitionLine: $("#transitionLine"),
    endOverlay: $("#endOverlay"),
    endKicker: $("#endKicker"),
    endTitle: $("#endTitle"),
    savedHeadline: $("#savedHeadline"),
    lostHeadline: $("#lostHeadline"),
    savedList: $("#savedList"),
    lostList: $("#lostList"),
    reflectionText: $("#reflectionText"),
    replayBtn: $("#replayBtn"),
    returnBtn: $("#returnBtn")
  };

  const suffixes = [
    "000-front", "045-right-front", "090-right", "135-right-back",
    "180-back", "225-left-back", "270-left", "315-left-front"
  ];

  const EXIT_TRIGGER_RATIO = 0.5;

  const objectPositions = [
    { x: 22, y: 56 }, { x: 36, y: 64 }, { x: 51, y: 55 },
    { x: 66, y: 64 }, { x: 79, y: 55 }, { x: 29, y: 47 },
    { x: 57, y: 69 }, { x: 73, y: 43 }
  ];

  let roomIndex = 0;
  let viewIndex = 0;
  let scenario = null;
  let saved = [];
  let lost = [];
  let timerId = null;
  let timeLeft = 0;
  let totalTime = 1;
  let playing = false;
  let rotating = false;
  let roomLocked = false;
  let audioEnabled = true;
  let fireAudio = null;
  let feedbackTimer = null;
  let usedItemIdsThisRun = new Set();
  let focusedItemIndex = 0;
  let synthAudioCtx = null;

  function playSynthCue(type) {
    if (!audioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!synthAudioCtx) synthAudioCtx = new AudioCtx();
      if (synthAudioCtx.state === "suspended") synthAudioCtx.resume();
      const osc = synthAudioCtx.createOscillator();
      const gain = synthAudioCtx.createGain();
      osc.connect(gain);
      gain.connect(synthAudioCtx.destination);
      const now = synthAudioCtx.currentTime;

      if (type === "focus") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(620, now + 0.05);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === "grab") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(580, now + 0.18);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.start(now);
        osc.stop(now + 0.18);
      } else if (type === "reveal") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.setValueAtTime(780, now + 0.08);
        osc.frequency.setValueAtTime(1040, now + 0.16);
        gain.gain.setValueAtTime(0.10, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.start(now);
        osc.stop(now + 0.28);
      }
    } catch (_) {}
  }

  const unique = (array) => [...new Set(array)];
  const shuffle = (array) => {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };
  const sample = (array, count) => shuffle(array).slice(0, count);
  const choose = (array) => array[Math.floor(Math.random() * array.length)];
  const randomInt = (minimum, maximum) => (
    Math.floor(Math.random() * (maximum - minimum + 1)) + minimum
  );

  const roomViewPrefixes = {
    'living-room': 'living',
    'kitchen': 'den',
    'master-bedroom': 'bedroom',
    'game-room': 'kids',
    'music-studio': 'studio',
    'hallway-front-entry': 'hall'
  };

  function viewPath(roomId, index) {
    const prefix = roomViewPrefixes[roomId] || roomId;
    return `assets/rooms/${prefix}_${index}.jpg`;
  }

  function collectPreloadUrls() {
    const urls = [];
    DATA.rooms.forEach((room) => {
      for (let index = 0; index < 8; index += 1) urls.push(viewPath(room.id, index));
      [...room.pools.savable, ...room.pools.burning].forEach((entry) => urls.push(entry.asset));
    });
    return unique(urls);
  }

  function preloadImage(url) {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => resolve({ url, ok: true });
      image.onerror = () => resolve({ url, ok: false });
      image.src = url;
    });
  }

  async function preload() {
    const urls = collectPreloadUrls();
    let complete = 0;
    let failed = 0;
    const update = () => {
      const pct = Math.round((complete / urls.length) * 100);
      els.loadFill.style.width = `${pct}%`;
      els.loadText.textContent = failed ? `${pct}% · ${failed} asset${failed === 1 ? "" : "s"} unavailable` : `${pct}%`;
    };
    await Promise.all(urls.map(async (url) => {
      const result = await preloadImage(url);
      if (!result.ok) failed += 1;
      complete += 1;
      update();
    }));
    window.setTimeout(() => {
      els.loadingOverlay.classList.add("hidden");
      els.introOverlay.classList.remove("hidden");
      setBaseScene();
    }, 280);
  }

  function setBaseScene() {
    const url = viewPath(DATA.rooms[0].id, 0);
    els.roomImage.src = url;
    els.ambientBackdrop.style.backgroundImage = `url("${url}")`;
  }

  function buildScenario(room, index) {
    let savablePool = room.pools.savable.filter((item) => !usedItemIdsThisRun.has(item.id));
    if (savablePool.length < (room.selectableMin ?? 3)) {
      savablePool = room.pools.savable;
    }

    const selectableMinimum = Math.min(
      savablePool.length,
      Math.max(3, room.selectableMin ?? 3)
    );
    const selectableMaximum = Math.min(
      savablePool.length,
      5,
      Math.max(selectableMinimum, room.selectableMax ?? 5)
    );

    const totalSelectableCount = randomInt(selectableMinimum, selectableMaximum);
    const hiddenCount = (
      totalSelectableCount >= 3 &&
      Math.random() < (room.secondLookChance ?? 0.52)
    ) ? 1 : 0;
    const visibleCount = totalSelectableCount - hiddenCount;

    const selectedSavable = sample(savablePool, totalSelectableCount);
    selectedSavable.forEach((item) => usedItemIdsThisRun.add(item.id));

    const initialSavable = selectedSavable.slice(0, visibleCount);
    const hiddenSavable = selectedSavable.slice(visibleCount);

    const usedNames = new Set(selectedSavable.map((entry) => entry.name));
    const burningPool = room.pools.burning.filter((entry) => !usedNames.has(entry.name));
    const burningQuantity = (
      room.burningCount > 0 &&
      Math.random() < (room.burningChance ?? 0.65)
    ) ? 1 : 0;
    const burning = sample(
      burningPool.length ? burningPool : room.pools.burning,
      burningQuantity
    );

    const candidates = room.isExitRoom
      ? [1,2,3,4,5,6,7]
      : index === 0
        ? [1,7,3,5,2,6,4,0]
        : shuffle([0,1,2,3,4,5,6,7]);

    const views = [...candidates];
    const items = [];
    const byView = new Map();

    const spawnDecisionFrame = initialSavable.length >= 2 && Math.random() < (room.decisionFrameChance ?? 0.80);
    let decisionViewIndex = null;

    if (spawnDecisionFrame) {
      decisionViewIndex = views.shift();
      const itemA = {
        ...initialSavable[0],
        instanceId: `${room.id}-${initialSavable[0].id}-0-decA`,
        view: decisionViewIndex,
        position: { x: 30, y: 58 },
        status: "savable",
        discovered: true,
        decisionSlot: 0
      };
      const itemB = {
        ...initialSavable[1],
        instanceId: `${room.id}-${initialSavable[1].id}-1-decB`,
        view: decisionViewIndex,
        position: { x: 68, y: 58 },
        status: "savable",
        discovered: true,
        decisionSlot: 1
      };
      items.push(itemA, itemB);
      byView.set(decisionViewIndex, [itemA, itemB]);
    }

    const remainingSavable = spawnDecisionFrame ? initialSavable.slice(2) : initialSavable;

    remainingSavable.forEach((entry, itemIndex) => {
      let view;
      if (index === 0 && itemIndex === 0 && !spawnDecisionFrame) {
        view = choose([1,7]);
        const chosenIndex = views.indexOf(view);
        if (chosenIndex >= 0) views.splice(chosenIndex, 1);
      } else {
        view = views.shift();
      }
      if (view === undefined) return;
      const position = choose(objectPositions);
      const itemObj = {
        ...entry,
        instanceId: `${room.id}-${entry.id}-${itemIndex}-safe`,
        view,
        position,
        status: "savable",
        discovered: true
      };
      items.push(itemObj);
      byView.set(view, itemObj);
    });

    burning.forEach((entry, itemIndex) => {
      const view = views.shift();
      if (view === undefined) return;
      const position = choose(objectPositions);
      const itemObj = {
        ...entry,
        instanceId: `${room.id}-${entry.id}-${itemIndex}-burning`,
        view,
        position,
        status: "burning",
        discovered: true
      };
      items.push(itemObj);
      byView.set(view, itemObj);
    });

    const occupiedViews = new Set(items.map((entry) => entry.view));
    const eligibleRevealViews = candidates.filter((view) => (
      !occupiedViews.has(view) &&
      !(room.isExitRoom && view === 0)
    ));

    const revealViews = sample(
      eligibleRevealViews,
      Math.min(hiddenSavable.length, eligibleRevealViews.length)
    );

    const revealSlots = new Map();
    hiddenSavable.forEach((entry, itemIndex) => {
      const view = revealViews[itemIndex];
      if (view === undefined) return;
      revealSlots.set(view, {
        entry: {
          ...entry,
          instanceId: `${room.id}-${entry.id}-${itemIndex}-hidden`,
          view,
          position: choose(objectPositions),
          status: "savable",
          discovered: false
        },
        revealed: false,
        minimumVisit: choose([2, 2, 3]),
        baseChance: choose([0.25, 0.30, 0.35])
      });
    });

    return {
      room,
      items,
      byView,
      revealSlots,
      visits: Array(8).fill(0),
      turns: 0,
      revealCount: 0,
      maxReveals: Math.min(2, room.maxReveals ?? 2, revealSlots.size + (spawnDecisionFrame ? 1 : 0)),
      totalSelectableCount,
      initialVisibleCount: initialSavable.length,
      hiddenPotentialCount: revealSlots.size,
      decisionViewIndex,
      saved: false,
      savedEntry: null,
      completed: false,
      exitActive: false,
      exitView: null,
      prompt: choose(room.prompts)
    };
  }

  async function startGame() {
    saved = [];
    lost = [];
    roomIndex = 0;
    viewIndex = 0;
    focusedItemIndex = 0;
    usedItemIdsThisRun.clear();
    playing = true;
    roomLocked = false;
    els.savedCounter.textContent = "0";
    els.game.classList.remove("exit-phase", "room-failed");
    els.risingFire.style.setProperty("--fire-rise", "0");
    els.risingFire.style.opacity = "0";
    els.findExitBanner.hidden = true;
    els.exitSignal.hidden = true;
    els.introOverlay.classList.add("hidden");
    els.endOverlay.classList.add("hidden");
    await startAudio();
    await startRoom(0);
  }

  async function startRoom(index) {
    stopTimer();
    roomIndex = index;
    viewIndex = 0;
    focusedItemIndex = 0;
    roomLocked = true;
    scenario = buildScenario(DATA.rooms[index], index);
    scenario.visits[0] = 1;
    els.game.classList.remove("exit-phase", "room-failed");
    els.risingFire.style.setProperty("--fire-rise", "0");
    els.risingFire.style.opacity = "0";
    els.findExitBanner.hidden = true;
    els.exitSignal.hidden = true;
    const room = scenario.room;

    els.transitionTag.textContent = `ROOM ${index + 1} OF ${DATA.rooms.length}`;
    els.transitionTitle.textContent = room.name.toUpperCase();
    els.transitionLine.textContent = room.transition;
    els.roomTransition.classList.remove("hidden");

    updateRoomCopy();
    renderView(true);
    renderObject();

    await delay(1050);
    els.roomTransition.classList.add("hidden");
    roomLocked = false;
    timeLeft = room.time;
    totalTime = room.time;
    updateTimer();
    startTimer();
    setFeedback(room.isExitRoom ? "FRONT + UP LEAVES NOW · TURN TO RISK ONE LAST CHOICE" : "LEFT / RIGHT TO TURN / TOGGLE · UP TO GRAB", "");
  }

  function updateRoomCopy() {
    const room = scenario.room;
    els.roomCounter.textContent = `${roomIndex + 1} / ${DATA.rooms.length}`;
    els.roomTag.textContent = room.tag;
    els.roomTitle.textContent = room.name;
    els.promptTitle.textContent = scenario.prompt[0];
    els.promptBody.textContent = scenario.prompt[1];
    els.choiceCount.textContent = `${scenario.totalSelectableCount} items · ${scenario.decisionViewIndex !== null ? '1 decision frame' : 'scattered'}`;
    els.roomObjective.textContent = `Several objects may be reachable. Heavy items cost time. Press ←/→ to toggle choices in dual frames and Arrow Up to grab. Locate the exit perspective before time expires.`;
  }

  function renderView(instant = false, direction = 1) {
    const room = scenario ? scenario.room : DATA.rooms[0];
    const url = viewPath(room.id, viewIndex);
    els.viewCounter.textContent = `${viewIndex + 1} / 8`;
    els.degreeLabel.textContent = `${DATA.degrees[viewIndex]}°`;
    els.directionLabel.textContent = DATA.directions[viewIndex];

    if (instant) {
      els.roomImage.src = url;
      els.roomImage.classList.add("active");
      els.ambientBackdrop.style.backgroundImage = `url("${url}")`;
      return;
    }

    rotating = true;
    els.itemAnchor.hidden = true;
    if (els.itemAnchorB) els.itemAnchorB.hidden = true;
    els.itemStatusChip.hidden = false;
    els.emptySignal.hidden = true;
    els.nextRoomImage.src = url;
    els.roomViewport.classList.remove("turning-left", "turning-right");
    void els.roomViewport.offsetWidth;
    els.roomViewport.classList.add(direction > 0 ? "turning-right" : "turning-left");

    window.setTimeout(() => {
      els.roomImage.src = url;
      els.ambientBackdrop.style.backgroundImage = `url("${url}")`;
      els.roomViewport.classList.remove("turning-left", "turning-right");
      registerViewVisit();
      renderObject();
      rotating = false;
    }, 220);
  }

  function registerViewVisit() {
    if (!scenario) return;
    scenario.visits[viewIndex] += 1;
    maybeRevealCurrentView();
  }

  function maybeRevealCurrentView() {
    if (!scenario || scenario.byView.has(viewIndex)) return false;
    if (scenario.exitActive && scenario.exitView === viewIndex) return false;
    if (scenario.revealCount >= scenario.maxReveals) return false;

    const slot = scenario.revealSlots.get(viewIndex);
    if (!slot || slot.revealed) return false;

    const visits = scenario.visits[viewIndex];
    if (visits < slot.minimumVisit || scenario.turns < 3) return false;

    const revisitBonus = Math.max(0, visits - slot.minimumVisit) * 0.17;
    const searchBonus = Math.min(0.18, scenario.turns * 0.022);
    const pressureRatio = totalTime > 0 ? 1 - (timeLeft / totalTime) : 0;
    const pressureBonus = Math.max(0, pressureRatio) * 0.10;
    const revealChance = Math.min(0.72, slot.baseChance + revisitBonus + searchBonus + pressureBonus);
    const guaranteed = visits >= slot.minimumVisit + 2;

    if (!guaranteed && Math.random() > revealChance) return false;

    slot.revealed = true;
    slot.entry.discovered = true;
    scenario.revealCount += 1;
    scenario.items.push(slot.entry);
    scenario.byView.set(viewIndex, slot.entry);

    els.itemAnchor.classList.remove("second-look-reveal");
    void els.itemAnchor.offsetWidth;
    els.itemAnchor.classList.add("second-look-reveal");
    playSynthCue("reveal");
    setFeedback("SECOND LOOK — YOU MISSED SOMETHING THE FIRST TIME", "good");
    return true;
  }

  function currentRawObject() {
    return scenario?.byView.get(viewIndex) || null;
  }

  function getActiveFocusedItem() {
    const raw = currentRawObject();
    if (!raw) return null;
    if (Array.isArray(raw)) {
      const active = raw.filter((item) => item.status !== "saved");
      if (!active.length) return null;
      return active[focusedItemIndex] || active[0];
    }
    return raw.status === "saved" ? null : raw;
  }

  function renderObject() {
    const raw = currentRawObject();
    const isExit = scenario?.exitActive && viewIndex === scenario.exitView;

    els.itemAnchor.hidden = true;
    if (els.itemAnchorB) els.itemAnchorB.hidden = true;
    els.itemStatusChip.hidden = false;
    els.emptySignal.hidden = true;
    els.exitSignal.hidden = true;
    els.grabBtn.classList.remove("ready");
    els.grabBtn.disabled = true;
    els.itemReadout.classList.add("muted");

    if (isExit) {
      els.exitSignal.hidden = false;
      els.itemKicker.textContent = "EXIT PERSPECTIVE FOUND";
      els.itemName.textContent = "This is the way out.";
      els.itemMeaning.textContent = "Press Arrow Up now to exit the room before the fire overtakes it.";
      els.itemReadout.classList.remove("muted");
      els.grabBtn.classList.add("ready", "exit-ready");
      els.grabBtn.disabled = false;
      els.grabBtn.querySelector("strong").textContent = "EXIT ROOM THIS WAY";
      setFeedback("PRESS ↑ TO EXIT ROOM THIS WAY", "good");
      return;
    }

    els.grabBtn.classList.remove("exit-ready");

    if (!raw) {
      els.itemKicker.textContent = scenario?.exitActive ? "EXIT ROUTE ACTIVE" : "NO REACHABLE ITEM";
      const slot = scenario?.revealSlots.get(viewIndex);
      const seen = scenario?.visits?.[viewIndex] ?? 0;
      els.itemName.textContent = scenario?.exitActive ? "Not the exit." : "Nothing clearly reachable.";
      els.itemMeaning.textContent = scenario?.exitActive
        ? "Keep turning. One perspective now leads out of the room."
        : slot && !slot.revealed && seen > 0
          ? "You may have missed something here. A later pass could reveal it, but the house does not reward every return."
          : "Turn again. Empty views are part of the cost of searching.";
      els.emptySignal.textContent = scenario?.exitActive
        ? "NOT THE EXIT — KEEP TURNING"
        : "NOTHING REACHABLE IN THIS VIEW";
      els.emptySignal.hidden = false;
      els.grabBtn.querySelector("strong").textContent = scenario?.exitActive ? "FIND EXIT" : "GRAB ITEM";
      return;
    }

    if (Array.isArray(raw)) {
      const activeItems = raw.filter((item) => item.status !== "saved");
      if (!activeItems.length) {
        els.emptySignal.textContent = "ITEM SAVED — VIEW CLEAR";
        els.emptySignal.hidden = false;
        els.grabBtn.querySelector("strong").textContent = scenario?.exitActive ? "FIND EXIT" : "KEEP MOVING";
        return;
      }

      if (focusedItemIndex >= activeItems.length) focusedItemIndex = 0;
      const focusedItem = activeItems[focusedItemIndex];
      const otherItem = activeItems.length > 1 ? activeItems[1 - focusedItemIndex] : null;

      els.itemAnchor.hidden = false;
      els.itemAnchor.style.left = `${activeItems[0].position.x}%`;
      els.itemAnchor.style.top = `${activeItems[0].position.y}%`;
      els.itemAnchor.classList.toggle("too-late", activeItems[0].status === "burning");
      els.itemAnchor.classList.toggle("active-focused", focusedItem === activeItems[0]);
      els.itemAnchor.classList.toggle("idle-choice", focusedItem !== activeItems[0]);
      els.itemSprite.src = activeItems[0].asset;
      els.itemSprite.alt = activeItems[0].name;
      els.itemStatusChip.textContent = focusedItem === activeItems[0] ? "SELECTED · PRESS ↑" : "PRESS ← / →";

      if (els.itemAnchorB && activeItems[1]) {
        els.itemAnchorB.hidden = false;
        els.itemAnchorB.style.left = `${activeItems[1].position.x}%`;
        els.itemAnchorB.style.top = `${activeItems[1].position.y}%`;
        els.itemAnchorB.classList.toggle("too-late", activeItems[1].status === "burning");
        els.itemAnchorB.classList.toggle("active-focused", focusedItem === activeItems[1]);
        els.itemAnchorB.classList.toggle("idle-choice", focusedItem !== activeItems[1]);
        els.itemSpriteB.src = activeItems[1].asset;
        els.itemSpriteB.alt = activeItems[1].name;
        els.itemStatusChipB.textContent = focusedItem === activeItems[1] ? "SELECTED · PRESS ↑" : "PRESS ← / →";
      }

      const weightTag = (focusedItem.weight || "light").toUpperCase();
      const penaltyTag = focusedItem.timeCost > 0 ? ` (-${focusedItem.timeCost}s)` : "";
      els.itemKicker.textContent = `DECISION FRAME · ${weightTag} WEIGHT${penaltyTag}`;
      els.itemName.textContent = focusedItem.name;
      els.itemMeaning.textContent = focusedItem.meaning;
      els.itemReadout.classList.remove("muted");

      if (focusedItem.status === "burning") {
        els.grabBtn.querySelector("strong").textContent = "TOO LATE";
        return;
      }

      if (scenario.savedEntry) {
        els.grabBtn.querySelector("strong").textContent = scenario.exitActive ? "FIND EXIT" : "KEEP MOVING";
        return;
      }

      els.grabBtn.classList.add("ready");
      els.grabBtn.disabled = false;
      els.grabBtn.querySelector("strong").textContent = `GRAB ${focusedItem.name.toUpperCase()} [${weightTag}]`;
      setFeedback(`DECISION: ${focusedItem.name.toUpperCase()} [${weightTag}] · PRESS ←/→ TO TOGGLE`, "");
      return;
    }

    const entry = raw;
    if (entry.status === "saved") {
      els.emptySignal.textContent = "ITEM SAVED — VIEW CLEAR";
      els.emptySignal.hidden = false;
      els.grabBtn.querySelector("strong").textContent = scenario?.exitActive ? "FIND EXIT" : "KEEP MOVING";
      return;
    }

    els.itemAnchor.hidden = false;
    els.itemAnchor.style.left = `${entry.position.x}%`;
    els.itemAnchor.style.top = `${entry.position.y}%`;
    els.itemAnchor.classList.toggle("too-late", entry.status === "burning");
    els.itemAnchor.classList.remove("active-focused", "idle-choice");
    els.itemSprite.src = entry.asset;
    els.itemSprite.alt = entry.name;
    const weightTag = (entry.weight || "light").toUpperCase();
    const penaltyTag = entry.timeCost > 0 ? ` (-${entry.timeCost}s)` : "";
    els.itemKicker.textContent = entry.status === "savable" ? `REACHABLE · ${weightTag} WEIGHT${penaltyTag}` : "ALREADY BURNING";
    els.itemName.textContent = entry.name;
    els.itemMeaning.textContent = entry.meaning;
    els.itemReadout.classList.remove("muted");

    if (entry.status === "burning") {
      els.itemStatusChip.textContent = "TOO LATE";
      els.grabBtn.querySelector("strong").textContent = "TOO LATE";
      return;
    }

    if (scenario.savedEntry) {
      els.itemStatusChip.hidden = true;
      els.itemMeaning.textContent = entry.meaning;
      els.grabBtn.querySelector("strong").textContent = scenario.exitActive ? "FIND EXIT" : "KEEP MOVING";
      return;
    }

    els.itemStatusChip.textContent = `SAVABLE · PRESS ↑`;
    els.grabBtn.classList.add("ready");
    els.grabBtn.disabled = false;
    els.grabBtn.querySelector("strong").textContent = `GRAB ${entry.name.toUpperCase()} [${weightTag}]`;
  }

  function rotate(direction) {
    if (!playing || roomLocked || rotating) return;

    const raw = currentRawObject();
    if (Array.isArray(raw)) {
      const activeItems = raw.filter((item) => item.status !== "saved");
      if (activeItems.length > 1) {
        if (direction === 1 && focusedItemIndex === 0) {
          focusedItemIndex = 1;
          playSynthCue("focus");
          renderObject();
          return;
        }
        if (direction === -1 && focusedItemIndex === 1) {
          focusedItemIndex = 0;
          playSynthCue("focus");
          renderObject();
          return;
        }
      }
    }

    focusedItemIndex = 0;
    scenario.turns += 1;
    viewIndex = (viewIndex + direction + 8) % 8;
    renderView(false, direction);
  }

  function grab() {
    if (!playing || roomLocked || rotating || !scenario) return;

    if (scenario.exitActive && viewIndex === scenario.exitView) {
      finishRoom("exit");
      return;
    }

    const room = scenario.room;
    const entry = getActiveFocusedItem();

    if (!entry) {
      setFeedback(scenario.exitActive ? "THIS IS NOT THE EXIT — KEEP TURNING" : "NOTHING TO GRAB IN THIS VIEW", "warn");
      pulseViewport("empty");
      return;
    }

    if (entry.status === "burning") {
      setFeedback("TOO LATE — THE ITEM CAN NO LONGER BE REACHED", "warn");
      pulseViewport("danger");
      return;
    }

    if (scenario.savedEntry) {
      setFeedback(
        scenario.exitActive
          ? "FIND THE EXIT ROUTE"
          : "KEEP MOVING — THE EXIT ROUTE WILL OPEN AT HALFWAY",
        "warn"
      );
      pulseViewport("empty");
      return;
    }

    scenario.saved = true;
    scenario.savedEntry = entry;
    saved.push({ name: entry.name, room: room.name, meaning: entry.meaning, weight: entry.weight });
    els.savedCounter.textContent = String(saved.length);

    playSynthCue("grab");

    if (entry.timeCost > 0) {
      timeLeft = Math.max(0, timeLeft - entry.timeCost);
      updateTimer();
    }

    const weightMsg = entry.timeCost > 0 ? ` (${entry.weight.toUpperCase()} -${entry.timeCost}s)` : "";
    setFeedback(`${entry.name.toUpperCase()} SAVED${weightMsg} — NOW SURVIVE THE ROOM`, "good");
    els.itemAnchor.classList.add("collected");
    els.grabBtn.disabled = true;

    window.setTimeout(() => {
      entry.status = "saved";
      els.itemAnchor.classList.remove("collected", "second-look-reveal");

      // In-Frame Discovery: Check if securing this item reveals another item in the SAME frame
      const slot = scenario.revealSlots.get(viewIndex);
      if (slot && !slot.revealed && Math.random() < 0.65) {
        slot.revealed = true;
        slot.entry.discovered = true;
        scenario.revealCount += 1;
        scenario.items.push(slot.entry);

        const raw = scenario.byView.get(viewIndex);
        if (Array.isArray(raw)) {
          raw.push(slot.entry);
        } else {
          const existing = scenario.byView.get(viewIndex);
          scenario.byView.set(viewIndex, existing ? [existing, slot.entry] : slot.entry);
        }
        playSynthCue("reveal");
        setFeedback(`IN-FRAME REVEAL — ${slot.entry.name.toUpperCase()} WAS HIDDEN BEHIND IT!`, "good");
      }

      renderObject();
    }, 680);
  }

  function chooseExitView() {
    if (scenario.room.isExitRoom) return 0;

    const occupied = new Set(
      [...scenario.byView.entries()]
        .filter(([, entry]) => entry.status !== "saved")
        .map(([view]) => view)
    );
    const reserved = new Set(
      [...scenario.revealSlots.entries()]
        .filter(([, slot]) => !slot.revealed)
        .map(([view]) => view)
    );

    let candidates = Array.from({ length: 8 }, (_, index) => index)
      .filter((index) => index !== viewIndex && !occupied.has(index) && !reserved.has(index));

    if (!candidates.length) {
      candidates = Array.from({ length: 8 }, (_, index) => index)
        .filter((index) => index !== viewIndex && !occupied.has(index));
    }
    if (!candidates.length) {
      candidates = Array.from({ length: 8 }, (_, index) => index)
        .filter((index) => index !== viewIndex);
    }

    const angularDistance = (index) => {
      const raw = Math.abs(index - viewIndex);
      return Math.min(raw, 8 - raw);
    };
    const preferred = candidates.filter((index) => {
      const distance = angularDistance(index);
      return distance >= 2 && distance <= 4;
    });

    return choose(preferred.length ? preferred : candidates);
  }

  function activateExitRoute() {
    if (!scenario || scenario.exitActive || scenario.completed) return;
    scenario.exitActive = true;
    scenario.exitView = chooseExitView();
    els.game.classList.add("exit-phase");
    els.findExitBanner.hidden = false;
    els.roomObjective.textContent = "FIND EXIT: rotate through the room, locate the marked exit perspective, and press Arrow Up before the clock reaches zero.";
    setFeedback("FIND EXIT — ROTATE AND PRESS ↑", "warn");

    if (viewIndex === scenario.exitView) renderObject();
    else {
      els.exitSignal.hidden = true;
      renderObject();
    }
  }

  function recordRoomLosses(reason) {
    const savedId = scenario.savedEntry?.instanceId;
    scenario.items.forEach((entry) => {
      if (entry.instanceId === savedId || entry.status === "saved") return;
      lost.push({
        name: entry.name,
        room: scenario.room.name,
        reason: entry.status === "burning" ? "already burning" : reason
      });
    });
  }

  function finishRoom(reason = "exit") {
    if (roomLocked || !scenario || scenario.completed) return;
    scenario.completed = true;
    roomLocked = true;
    stopTimer();
    recordRoomLosses(scenario.savedEntry ? "not selected" : "left behind");

    setFeedback("ROOM EXITED", "good");
    window.setTimeout(() => {
      els.itemAnchor.classList.remove("collected", "second-look-reveal");
      els.findExitBanner.hidden = true;
      els.exitSignal.hidden = true;
      if (roomIndex + 1 >= DATA.rooms.length) finishGame({ failed: false });
      else startRoom(roomIndex + 1);
    }, 480);
  }

  function failRoom() {
    if (!scenario || scenario.completed) return;
    scenario.completed = true;
    roomLocked = true;
    playing = false;
    stopTimer();
    recordRoomLosses("exit not found before time expired");
    els.game.classList.add("room-failed");
    els.findExitBanner.hidden = true;
    els.exitSignal.hidden = true;
    setFeedback("GAME OVER — YOU DID NOT FIND THE EXIT IN TIME", "warn");
    pulseViewport("danger");

    window.setTimeout(() => {
      finishGame({
        failed: true,
        failureRoom: scenario.room.name
      });
    }, 900);
  }

  function startTimer() {
    let graceTimeLeft = scenario?.room?.orientationGrace || 2.0;
    let last = performance.now();
    timerId = window.setInterval(() => {
      const now = performance.now();
      const delta = (now - last) / 1000;
      last = now;

      if (graceTimeLeft > 0) {
        graceTimeLeft = Math.max(0, graceTimeLeft - delta);
        els.timerText.textContent = "READY";
        els.timerFill.style.width = "100%";
        els.timerFill.style.background = "linear-gradient(90deg,#78c84a,#f3ad55)";
        setFeedback("ORIENTATION · SCAN THE ROOM", "");
        return;
      }

      timeLeft = Math.max(0, timeLeft - delta);

      if (!scenario.exitActive && timeLeft <= totalTime * EXIT_TRIGGER_RATIO) {
        activateExitRoute();
      }

      updateTimer();

      if (timeLeft <= 0) {
        failRoom();
      }
    }, 80);
  }

  function stopTimer() {
    if (timerId) window.clearInterval(timerId);
    timerId = null;
  }

  function updateTimer() {
    const pct = Math.max(0, Math.min(1, timeLeft / totalTime));
    const elapsed = 1 - pct;
    els.timerText.textContent = String(Math.ceil(timeLeft));
    els.timerFill.style.width = `${pct * 100}%`;
    els.timerFill.style.background = pct < .28
      ? "linear-gradient(90deg,#ff2f21,#ff7c30)"
      : "linear-gradient(90deg,#e9572a,#f3ad55)";
    els.game.classList.toggle("time-critical", pct < .28);

    // Fire begins fully absent and rises continuously with the countdown.
    const rise = Math.pow(elapsed, 1.28);
    els.risingFire.style.setProperty("--fire-rise", rise.toFixed(3));
    els.risingFire.style.opacity = String(Math.min(.92, rise * 1.06));
  }

  function setFeedback(message, type = "") {
    if (feedbackTimer) window.clearTimeout(feedbackTimer);
    els.feedback.textContent = message;
    els.feedback.classList.remove("good", "warn");
    if (type) els.feedback.classList.add(type);
    feedbackTimer = window.setTimeout(() => {
      els.feedback.classList.remove("good", "warn");
    }, 1900);
  }

  function pulseViewport(type) {
    const className = type === "danger" ? "danger-pulse" : "empty-pulse";
    els.roomViewport.classList.add(className);
    window.setTimeout(() => els.roomViewport.classList.remove(className), 420);
  }

  function finishGame(result = {}) {
    playing = false;
    roomLocked = true;
    stopTimer();
    pauseAudio();
    const savedCount = saved.length;
    const lostCount = lost.length;

    if (result.failed) {
      els.endKicker.textContent = "GAME OVER · EXIT NOT FOUND";
      els.endTitle.textContent = `The ${result.failureRoom || "room"} closed in.`;
    } else {
      els.endKicker.textContent = "YOU MADE IT OUT";
      els.endTitle.textContent = "What remained was the choice.";
    }

    els.savedHeadline.textContent = `${savedCount} item${savedCount === 1 ? "" : "s"}`;
    els.lostHeadline.textContent = `${lostCount} item${lostCount === 1 ? "" : "s"}`;
    els.savedList.innerHTML = savedCount
      ? saved.map((entry) => `<li><strong>${escapeHtml(entry.name)}</strong> — ${escapeHtml(entry.room)}</li>`).join("")
      : "<li>Nothing. You chose time and escape over objects.</li>";
    els.lostList.innerHTML = lostCount
      ? lost.map((entry) => `<li><strong>${escapeHtml(entry.name)}</strong> — ${escapeHtml(entry.room)} <em>(${escapeHtml(entry.reason)})</em></li>`).join("")
      : "<li>Nothing was left behind.</li>";

    let reflection;
    if (result.failed) {
      reflection = `You reached the final seconds in the ${result.failureRoom || "room"}, but did not locate and take the exit perspective before time expired. Saving an object was only half of the decision; survival required leaving in time.`;
    } else {
      reflection = "The game does not grade whether your choices were correct. It reveals what became important when time, access, certainty, and control disappeared.";
      if (saved.some((entry) => /photo|album|letter|journal|heirloom|ring|watch/i.test(entry.name))) {
        reflection = "Your choices leaned toward memory and meaning. You protected objects whose value could not be measured only by replacement cost.";
      } else if (saved.some((entry) => /document|passport|policy|cash|wallet|key|medication|first-aid/i.test(entry.name))) {
        reflection = "Your choices leaned toward recovery and immediate survival. You protected the objects most likely to help after the flames were gone.";
      } else if (saved.some((entry) => /drive|studio|vinyl|microphone|console|camera|laptop/i.test(entry.name))) {
        reflection = "Your choices leaned toward work, creation, and continuity. You protected the tools or records connected to what you were building.";
      }
    }
    els.reflectionText.textContent = reflection;
    els.endOverlay.classList.remove("hidden");
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (char) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
    }[char]));
  }

  async function startAudio() {
    if (!audioEnabled) return;
    els.music.volume = .32;
    try { await els.music.play(); } catch (_) { /* Browser may block remote audio. */ }
    if (!fireAudio) fireAudio = createFireAudio();
    fireAudio?.resume();
  }

  function pauseAudio() {
    els.music.pause();
    fireAudio?.suspend();
  }

  function toggleAudio() {
    audioEnabled = !audioEnabled;
    els.audioBtn.textContent = audioEnabled ? "AUDIO ON" : "AUDIO OFF";
    if (audioEnabled && playing) startAudio();
    else pauseAudio();
  }

  function createFireAudio() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    const context = new AudioCtx();
    const duration = 2;
    const buffer = context.createBuffer(1, context.sampleRate * duration, context.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < channel.length; i += 1) {
      const white = Math.random() * 2 - 1;
      channel[i] = white * (0.35 + Math.random() * 0.65);
    }
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    filter.type = "lowpass";
    filter.frequency.value = 520;
    gain.gain.value = .025;
    source.buffer = buffer;
    source.loop = true;
    source.connect(filter).connect(gain).connect(context.destination);
    source.start();
    return {
      resume: () => context.resume(),
      suspend: () => context.suspend()
    };
  }

  function exitExperience() {
    stopTimer();
    pauseAudio();
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage("closeExperience", "*");
        return;
      }
    } catch (_) { /* Continue to local navigation. */ }
    window.location.href = "../../#experiences";
  }

  function delay(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function bindHoldSafe(button, action) {
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      action();
    });
  }

  els.startBtn.addEventListener("click", startGame);
  els.replayBtn.addEventListener("click", startGame);
  els.returnBtn.addEventListener("click", exitExperience);
  els.exitBtn.addEventListener("click", exitExperience);
  els.audioBtn.addEventListener("click", toggleAudio);
  els.leftBtn.addEventListener("click", () => rotate(-1));
  els.rightBtn.addEventListener("click", () => rotate(1));
  els.upBtn.addEventListener("click", grab);
  els.grabBtn.addEventListener("click", grab);
  bindHoldSafe(els.mobileLeftBtn, () => rotate(-1));
  bindHoldSafe(els.mobileRightBtn, () => rotate(1));
  bindHoldSafe(els.mobileUpBtn, grab);

  window.addEventListener("keydown", (event) => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp"].includes(event.key)) event.preventDefault();
    if (event.repeat) return;
    if (event.key === "ArrowLeft") rotate(-1);
    if (event.key === "ArrowRight") rotate(1);
    if (event.key === "ArrowUp") grab();
  }, { passive: false });

  preload();
})();
