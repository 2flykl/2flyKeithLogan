// performanceStations.js – Visual state manager for performance stations

// Ensure a global reference to the shared EventBus
window.eventBus = window.TigerCallEventBus || window.eventBus;

const stations = Array.from(document.querySelectorAll('.station'));

// Helper to get station by lane index
function getStation(lane) {
  return stations.find(st => Number(st.dataset.index) === lane);
}

// Fixed L/D/R/U station icons. Gameplay no longer changes lanes from song markers.
function updateInstruments() {
  const mapping = ['bass_drum', 'snare', 'cymbal', 'quads'];
  stations.forEach((st, i) => {
    const instrumentKey = mapping[i];
    const instrumentDiv = st.querySelector('.instrument');
    if (!instrumentDiv) return;
    // Path relative to project root
    const url = `assets/TigerCall_PerformanceStations_AssetPack/01_INSTRUMENT_ICONS/${instrumentKey}.png`;
    instrumentDiv.style.backgroundImage = `url(${url})`;
    // Mark dormant stations (inactive in this section)
    st.dataset.state = '';
  });
}

// Reset visual state for a station
function resetStation(st) {
  st.dataset.state = '';
  const instrumentDiv = st.querySelector('.instrument');
  if (instrumentDiv) instrumentDiv.style.opacity = '0.9';
}

// Event listeners
window.eventBus.on('NOTE_HIT', ({ lane }) => {
  const st = getStation(lane);
  if (!st) return;
  st.dataset.state = 'hit';
  // Return to idle after animation (~300ms)
  setTimeout(() => resetStation(st), 300);
});

window.eventBus.on('TIGER_PERFECT', ({ lane }) => {
  const st = getStation(lane);
  if (!st) return;
  st.dataset.state = 'perfect';
  setTimeout(() => resetStation(st), 400);
});

window.eventBus.on('HOLD_STARTED', ({ lane }) => {
  const st = getStation(lane);
  if (!st) return;
  st.dataset.state = 'held';
});

window.eventBus.on('HOLD_RELEASED', ({ lane }) => {
  const st = getStation(lane);
  if (!st) return;
  resetStation(st);
});

window.eventBus.on('NOTE_MISS', ({ lane }) => {
  const st = getStation(lane);
  if (!st) return;
  st.dataset.state = 'miss';
  setTimeout(() => resetStation(st), 300);
});

// Initial fixed L/D/R/U station setup.
updateInstruments();
