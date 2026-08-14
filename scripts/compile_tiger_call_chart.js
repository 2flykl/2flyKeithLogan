const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, '../games/TigerCall_StillStanding_PLX/assets/TigerCall_RhythmSource_Clean');

const tempoData = JSON.parse(fs.readFileSync(path.join(basePath, 'MIDI/TigerCall_TEMPO_EVENTS.json'), 'utf8'));
const markersData = JSON.parse(fs.readFileSync(path.join(basePath, 'MARKERS/TigerCall_MARKERS_AUTHORITATIVE.json'), 'utf8'));

const tpq = tempoData.ticks_per_beat; // 480
const tempoEvents = tempoData.tempo_events;

function tickToSeconds(tick) {
  let prev = tempoEvents[0];
  for (let i = 1; i < tempoEvents.length; i++) {
    if (tempoEvents[i].tick > tick) break;
    prev = tempoEvents[i];
  }
  const dticks = tick - prev.tick;
  const secPerTick = (60 / prev.bpm) / tpq;
  return prev.time_seconds + dticks * secPerTick;
}

function parseVarlen(buf, offset) {
  let res = 0;
  while (true) {
    let b = buf[offset++];
    res = (res << 7) | (b & 0x7f);
    if ((b & 0x80) === 0) break;
  }
  return { val: res, next: offset };
}

function parseMidiFile(filepath) {
  const buf = fs.readFileSync(filepath);
  let offset = 8 + buf.readUInt32BE(4);
  const numTracks = buf.readUInt16BE(10);
  const events = [];
  for (let t = 0; t < numTracks; t++) {
    if (buf.toString('ascii', offset, offset + 4) !== 'MTrk') break;
    const trkLen = buf.readUInt32BE(offset + 4);
    let trkEnd = offset + 8 + trkLen;
    let currOffset = offset + 8;
    let currTick = 0;
    let runningStatus = 0;

    while (currOffset < trkEnd) {
      let vl = parseVarlen(buf, currOffset);
      currTick += vl.val;
      currOffset = vl.next;
      let b = buf[currOffset];
      if (b & 0x80) { runningStatus = b; currOffset++; }
      let status = runningStatus;
      let cmd = status & 0xf0;
      if (cmd === 0x90) {
        let note = buf[currOffset++];
        let vel = buf[currOffset++];
        if (vel > 0) events.push({ tick: currTick, note, vel, type: 'noteOn' });
        else events.push({ tick: currTick, note, vel, type: 'noteOff' });
      } else if (cmd === 0x80) {
        let note = buf[currOffset++];
        let vel = buf[currOffset++];
        events.push({ tick: currTick, note, vel, type: 'noteOff' });
      } else if (cmd === 0xa0 || cmd === 0xb0 || cmd === 0xe0) {
        currOffset += 2;
      } else if (cmd === 0xc0 || cmd === 0xd0) {
        currOffset += 1;
      } else if (status === 0xff) {
        let metaType = buf[currOffset++];
        let metaVl = parseVarlen(buf, currOffset);
        currOffset = metaVl.next + metaVl.val;
      } else if (status === 0xf0 || status === 0xf7) {
        let sysVl = parseVarlen(buf, currOffset);
        currOffset = sysVl.next + sysVl.val;
      }
    }
    offset = trkEnd;
  }
  return events;
}

const drumEvents = parseMidiFile(path.join(basePath, 'MIDI/TigerCall_DRUMS_RAW.mid'));
const otherEvents = parseMidiFile(path.join(basePath, 'MIDI/TigerCall_OTHER_RAW.mid'));

console.log(`Parsed ${drumEvents.length} raw drum events and ${otherEvents.length} raw other events.`);

// Section Performance Station Instrument Mappings
const sectionStationMappings = {
  "Start": ["bass_drum", "snare", "dormant", "dormant"],
  "Horns 1": ["trumpet", "trombone", "brass_ensemble", "sousaphone"],
  "Drums1": ["bass_drum", "snare", "cymbal", "quads"],
  "Horns2": ["trumpet", "trombone", "brass_ensemble", "sousaphone"],
  "Drum 2": ["bass_drum", "snare", "cymbal", "quads"],
  "Power Up": ["bass_drum", "snare", "cymbal", "quads"],
  "Horn3  Hold Buttons": ["trumpet", "trombone", "brass_ensemble", "sousaphone"],
  "Full Band1": ["bass_drum", "snare", "brass_ensemble", "sousaphone"],
  "Unlock Ultra Tiger Power Up": ["bass_drum", "snare", "brass_ensemble", "sousaphone"],
  "Button Mash or Hold Notes": ["snare", "quads", "brass_ensemble", "sousaphone"],
  "Hype Crowd": ["bass_drum", "snare", "cymbal", "quads"],
  "Drums3": ["bass_drum", "snare", "cymbal", "quads"],
  "Full Band2": ["bass_drum", "snare", "brass_ensemble", "sousaphone"],
  "Last Note": ["bass_drum", "snare", "brass_ensemble", "sousaphone"]
};

// Process drum events into ticks map
const drumTicksMap = new Map();
drumEvents.forEach(e => {
  if (e.type !== 'noteOn') return;
  if (!drumTicksMap.has(e.tick)) drumTicksMap.set(e.tick, []);
  drumTicksMap.get(e.tick).push(e);
});

// Process other events into ticks map
const otherTicksMap = new Map();
otherEvents.forEach(e => {
  if (e.type !== 'noteOn') return;
  if (!otherTicksMap.has(e.tick)) otherTicksMap.set(e.tick, []);
  otherTicksMap.get(e.tick).push(e);
});

const chartNotes = [];
let noteId = 0;

// Process Drum Events into Performance Stations
const sortedDrumTicks = Array.from(drumTicksMap.keys()).sort((a, b) => a - b);
sortedDrumTicks.forEach(tick => {
  const time = tickToSeconds(tick);
  if (time < 0.2 || time > 90.0) return;

  const evs = drumTicksMap.get(tick);
  const hasKick = evs.some(e => e.note === 36);
  const hasSnare = evs.some(e => e.note === 38);
  const hasHiHat = evs.some(e => e.note === 42 || e.note === 46);
  const hasToms = evs.some(e => e.note === 43 || e.note === 47 || e.note === 50);

  let activeMarker = markersData[0];
  for (let m of markersData) {
    if (time >= m.time_seconds) activeMarker = m;
  }

  const mapping = sectionStationMappings[activeMarker.name] || ["bass_drum", "snare", "cymbal", "quads"];

  if (activeMarker.name === "Start") {
    // Only stations 0 (Bass) and 1 (Snare) active in START section
    if (hasKick) {
      chartNotes.push({ id: ++noteId, t: time, lane: 0, instrument: "bass_drum", type: 'tap', marker: activeMarker.name });
    } else if (hasSnare) {
      chartNotes.push({ id: ++noteId, t: time, lane: 1, instrument: "snare", type: 'tap', marker: activeMarker.name });
    }
  } else if (hasKick && hasSnare) {
    // Ensemble Chord Hit
    chartNotes.push({ id: ++noteId, t: time, lane: 0, instrument: mapping[0], type: 'tap', chord: true, marker: activeMarker.name });
    chartNotes.push({ id: ++noteId, t: time, lane: 1, instrument: mapping[1], type: 'tap', chord: true, marker: activeMarker.name });
  } else if (hasKick) {
    chartNotes.push({ id: ++noteId, t: time, lane: 0, instrument: mapping[0], type: 'tap', marker: activeMarker.name });
  } else if (hasSnare) {
    chartNotes.push({ id: ++noteId, t: time, lane: 1, instrument: mapping[1], type: 'tap', marker: activeMarker.name });
  } else if (hasToms) {
    chartNotes.push({ id: ++noteId, t: time, lane: 3, instrument: mapping[3], type: 'tap', marker: activeMarker.name });
  } else if (hasHiHat) {
    chartNotes.push({ id: ++noteId, t: time, lane: 2, instrument: mapping[2], type: 'tap', marker: activeMarker.name });
  }
});

// Process Other Instrument / Horn / Hold events
const sortedOtherTicks = Array.from(otherTicksMap.keys()).sort((a, b) => a - b);
sortedOtherTicks.forEach(tick => {
  const time = tickToSeconds(tick);
  if (time < 4.0 || time > 89.0) return;

  const evs = otherTicksMap.get(tick);
  let activeMarker = markersData[0];
  for (let m of markersData) {
    if (time >= m.time_seconds) activeMarker = m;
  }

  const mapping = sectionStationMappings[activeMarker.name] || ["trumpet", "trombone", "brass_ensemble", "sousaphone"];

  if (activeMarker.name.includes("Hold") || activeMarker.name.includes("Horns")) {
    chartNotes.push({
      id: ++noteId,
      t: time,
      lane: 3,
      instrument: mapping[3],
      type: 'hold',
      duration: 1.5,
      marker: activeMarker.name
    });
  }
});

// Sort chart notes chronologically
chartNotes.sort((a, b) => a.t - b.t);

// Human Playability Safety Validator
const validatedNotes = [];
for (let i = 0; i < chartNotes.length; i++) {
  const n = chartNotes[i];
  const lastInLane = validatedNotes.slice().reverse().find(x => x.lane === n.lane);
  if (lastInLane && (n.t - lastInLane.t) < 0.055) {
    continue;
  }
  validatedNotes.push(n);
}

console.log(`Compiled ${validatedNotes.length} authoritative chart notes with Performance Station instrument tags.`);

const chartOutput = {
  version: "3.0-PERFORMANCE-STATIONS",
  bpm_base: 198,
  markers: markersData,
  tempo_events: tempoEvents,
  section_station_mappings: sectionStationMappings,
  notes: validatedNotes
};

const outputPath = path.join(__dirname, '../games/TigerCall_StillStanding_PLX/assets/TigerCall_AUTHORITATIVE_CHART.json');
fs.writeFileSync(outputPath, JSON.stringify(chartOutput, null, 2));
console.log(`Authoritative Performance Stations chart successfully saved to ${outputPath}`);
