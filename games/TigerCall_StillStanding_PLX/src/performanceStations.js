// performanceStations.js – Visual state manager for performance stations

// Ensure a global reference to the shared EventBus
window.eventBus = window.TigerCallEventBus || window.eventBus;

const stations = Array.from(document.querySelectorAll('.station'));

// Helper to get station by lane index
function getStation(lane) {
  return stations.find(st => Number(st.dataset.index) === lane);
}

// Update instrument icon based on current section mapping
function updateInstruments(section) {
  const mapping = section && section.mapping ? section.mapping : ['bass_drum', 'snare', 'cymbal', 'quads'];
  stations.forEach((st, i) => {
    const instrumentKey = mapping[i];
    const instrumentDiv = st.querySelector('.instrument');
    if (!instrumentDiv) return;
    // Path relative to project root
    const url = `assets/performanceStations/01_INSTRUMENT_ICONS/${instrumentKey}.png`;
    instrumentDiv.style.backgroundImage = `url(${url})`;
    // Mark dormant stations (inactive in this section)
    const activeCount = section && typeof section.activeCount === 'number' ? section.activeCount : 4;
    st.dataset.state = i >= activeCount ? 'dormant' : '';
  });
}

// Reset visual state for a station
function resetStation(st) {
  st.dataset.state = '';
  const instrumentDiv = st.querySelector('.instrument');
  if (instrumentDiv) instrumentDiv.style.opacity = '0.9';
}

// Event listeners
window.eventBus.on('SECTION_CHANGED', payload => {
  updateInstruments(payload);
});

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

// Initial setup – populate instruments for the first section (if any)
if (window.TigerCallEventBus) {
  // Assume the first section is the start marker
  const startSection = {
    mapping: ['bass_drum', 'snare', 'cymbal', 'quads'],
    activeCount: 4
  };
  updateInstruments(startSection);
}
