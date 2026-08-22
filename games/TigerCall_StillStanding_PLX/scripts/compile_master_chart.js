const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '../assets/TigerCall_RhythmSource_Clean');
const midiPath = path.join(baseDir, 'MIDI/TigerCall_HUMAN_PERFORMANCE TigerHeartbeat.mid');
const tempoDataPath = path.join(baseDir, 'MIDI/TigerCall_TEMPO_EVENTS.json');
const markersPath = path.join(baseDir, 'MARKERS/TigerCall_MARKERS_AUTHORITATIVE.json');
const outputPath = path.join(__dirname, '../assets/TigerCall_AUTHORITATIVE_CHART.json');

const buf = fs.readFileSync(midiPath);
const tempoData = JSON.parse(fs.readFileSync(tempoDataPath, 'utf8'));
const markersData = JSON.parse(fs.readFileSync(markersPath, 'utf8'));

function readVarInt(buf, off) {
  let value = 0;
  let bytesRead = 0;
  while (true) {
    const byte = buf[off + bytesRead];
    bytesRead++;
    value = (value << 7) | (byte & 0x7f);
    if ((byte & 0x80) === 0) break;
  }
  return { value, bytesRead };
}

const headerLength = buf.readUInt32BE(4);
const format = buf.readUInt16BE(8);
const numTracks = buf.readUInt16BE(10);
const division = buf.readUInt16BE(12);

let offset = 14;
const allEvents = [];

for (let t = 0; t < numTracks; t++) {
  if (offset >= buf.length) break;
  const chunkType = buf.toString('ascii', offset, offset + 4);
  const chunkSize = buf.readUInt32BE(offset + 4);
  const trackEnd = offset + 8 + chunkSize;

  let ptr = offset + 8;
  let currentTick = 0;
  let runningStatus = 0;

  while (ptr < trackEnd) {
    const delta = readVarInt(buf, ptr);
    ptr += delta.bytesRead;
    currentTick += delta.value;

    let status = buf[ptr];
    if (status & 0x80) {
      runningStatus = status;
      ptr++;
    } else {
      status = runningStatus;
    }

    const type = status & 0xf0;
    const channel = status & 0x0f;

    if (status === 0xff) {
      const metaType = buf[ptr++];
      const len = readVarInt(buf, ptr);
      ptr += len.bytesRead;
      ptr += len.value;
    } else if (type === 0x90) {
      const note = buf[ptr++];
      const velocity = buf[ptr++];
      if (velocity === 0) {
        allEvents.push({ tick: currentTick, type: 'noteOff', channel, note, velocity });
      } else {
        allEvents.push({ tick: currentTick, type: 'noteOn', channel, note, velocity });
      }
    } else if (type === 0x80) {
      const note = buf[ptr++];
      const velocity = buf[ptr++];
      allEvents.push({ tick: currentTick, type: 'noteOff', channel, note, velocity });
    } else if (type === 0xb0 || type === 0xe0) {
      ptr += 2;
    } else if (type === 0xc0 || type === 0xd0) {
      ptr += 1;
    } else {
      break;
    }
  }
  offset = trackEnd;
}

// Convert MIDI ticks to absolute song seconds using Studio One's exported
// tempo-event JSON anchors. The JSON time_seconds values are authoritative.
// TigerCall_TEMPO_MAP.mid remains a reference/source copy and is NOT applied
// again at runtime, preventing double-tempo conversion and cumulative drift.
function tickToSeconds(tick, tempoEvents) {
  if (!Array.isArray(tempoEvents) || tempoEvents.length === 0) {
    throw new Error('TigerCall_TEMPO_EVENTS.json is required');
  }
  const events = tempoEvents.slice().sort((a, b) => a.tick - b.tick);
  let anchor = events[0];
  for (let i = 1; i < events.length; i++) {
    if (events[i].tick > tick) break;
    anchor = events[i];
  }
  const ppq = division || 480;
  const secondsPerTick = (60 / Number(anchor.bpm)) / ppq;
  return Number(anchor.time_seconds) + (tick - Number(anchor.tick)) * secondsPerTick;
}

// Physical station mapping
const pitchToStation = {
  72: 0, // I = LEFT
  74: 1, // O = DOWN
  76: 2, // P = RIGHT
  73: 3  // 9 = UP
};

const activeNotes = new Map();
const noteEvents = [];

allEvents.forEach(ev => {
  if (ev.type === 'noteOn') {
    const time = tickToSeconds(ev.tick, tempoData.tempo_events);
    const station = pitchToStation[ev.note];
    activeNotes.set(ev.note, {
      midiNote: ev.note,
      station,
      startTick: ev.tick,
      startTime: time,
      velocity: ev.velocity
    });
  } else if (ev.type === 'noteOff') {
    const onEv = activeNotes.get(ev.note);
    if (onEv) {
      const endTime = tickToSeconds(ev.tick, tempoData.tempo_events);
      const duration = endTime - onEv.startTime;
      noteEvents.push({
        ...onEv,
        endTick: ev.tick,
        endTime,
        duration: Math.max(0, duration)
      });
      activeNotes.delete(ev.note);
    }
  }
});

noteEvents.sort((a, b) => a.startTime - b.startTime || a.station - b.station);

function getSectionForTime(timeSeconds) {
  let section = markersData[0];
  for (let i = 0; i < markersData.length; i++) {
    if (timeSeconds >= markersData[i].time_seconds - 0.05) {
      section = markersData[i];
    } else {
      break;
    }
  }
  return section ? section.name : 'Start';
}

function getInstrumentForStationAndSection(station, sectionName) {
  const lowerSec = (sectionName || '').toLowerCase();
  if (lowerSec.includes('horn')) {
    return ['trumpet', 'trombone', 'brass_ensemble', 'sousaphone'][station];
  } else if (lowerSec.includes('full band') || lowerSec.includes('power') || lowerSec.includes('hype')) {
    return ['pulse', 'cadence', 'brass_hit', 'brass_hold'][station];
  } else {
    return ['bass_drum', 'snare', 'cymbal', 'quads'][station];
  }
}

const CHORD_TOLERANCE_SEC = 0.035;

const compiledNotes = noteEvents.map((ev, idx) => {
  const behavior = ev.duration >= 0.25 ? 'hold' : 'tap';
  const sectionName = getSectionForTime(ev.startTime);
  const instrument = getInstrumentForStationAndSection(ev.station, sectionName);

  const isChord = noteEvents.some((other, oIdx) => oIdx !== idx && Math.abs(other.startTime - ev.startTime) <= CHORD_TOLERANCE_SEC);

  return {
    id: idx + 1,
    midiNote: ev.midiNote,
    station: ev.station,
    lane: ev.station,
    t: parseFloat(ev.startTime.toFixed(6)),
    hitTime: parseFloat(ev.startTime.toFixed(6)),
    endTime: parseFloat(ev.endTime.toFixed(6)),
    duration: parseFloat(ev.duration.toFixed(6)),
    behavior,
    type: behavior,
    chord: isChord,
    marker: sectionName,
    section: sectionName,
    instrument
  };
});

const sectionStationMappings = {};
markersData.forEach(m => {
  const sName = m.name;
  const lower = sName.toLowerCase();
  if (lower.includes('horn')) {
    sectionStationMappings[sName] = ['trumpet', 'trombone', 'brass_ensemble', 'sousaphone'];
  } else if (lower.includes('full band') || lower.includes('power') || lower.includes('hype')) {
    sectionStationMappings[sName] = ['pulse', 'cadence', 'brass_hit', 'brass_hold'];
  } else {
    sectionStationMappings[sName] = ['bass_drum', 'snare', 'cymbal', 'quads'];
  }
});

const sectionDebugReports = markersData.map((m, i) => {
  const nextTime = i < markersData.length - 1 ? markersData[i + 1].time_seconds : 95.0;
  const sectionNotes = compiledNotes.filter(n => n.t >= m.time_seconds && n.t < nextTime);

  const lanes = { L: 0, D: 0, R: 0, U: 0 };
  sectionNotes.forEach(n => {
    const laneKeys = ['L', 'D', 'R', 'U'];
    lanes[laneKeys[n.lane]]++;
  });

  const dur = Math.max(0.1, nextTime - m.time_seconds);
  const density = (sectionNotes.length / dur).toFixed(1);

  return {
    section: m.name,
    category: m.name.toLowerCase().includes('horn') ? 'HORNS' : m.name.toLowerCase().includes('band') ? 'FULL_BAND' : 'DRUMS',
    startSec: parseFloat(m.time_seconds.toFixed(2)),
    endSec: parseFloat(nextTime.toFixed(2)),
    source: 'TigerHeartbeat Master Gameplay MIDI',
    rawEvents: sectionNotes.length,
    consensusEvents: sectionNotes.length,
    playableEvents: sectionNotes.length,
    densityPerSec: parseFloat(density),
    lanes
  };
});

const authoritativeChart = {
  version: '5.0-MASTER-MIDI-AUTHORITY',
  source_midi: 'TigerCall_HUMAN_PERFORMANCE TigerHeartbeat.mid',
  total_notes: compiledNotes.length,
  pitch_mapping: {
    72: 'Station 0 (LEFT / I)',
    74: 'Station 1 (DOWN / O)',
    76: 'Station 2 (RIGHT / P)',
    73: 'Station 3 (UP / 9)'
  },
  markers: markersData,
  tempo_events: tempoData.tempo_events,
  section_station_mappings: sectionStationMappings,
  section_debug_reports: sectionDebugReports,
  notes: compiledNotes
};

fs.writeFileSync(outputPath, JSON.stringify(authoritativeChart, null, 2));

console.log(`✓ Master Gameplay MIDI Authority chart compiled successfully to ${outputPath}`);
console.log(`✓ Total playable events: ${compiledNotes.length}`);
console.log(`✓ Hold events: ${compiledNotes.filter(n => n.type === 'hold').length}`);
console.log(`✓ Chords: ${compiledNotes.filter(n => n.chord).length}`);
