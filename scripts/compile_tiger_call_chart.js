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
        if (vel > 0) events.push({ tick: currTick, note, vel, sec: tickToSeconds(currTick) });
        else events.push({ tick: currTick, note, vel });
      } else if (cmd === 0x80) {
        currOffset += 2;
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

const midiDir = path.join(basePath, 'MIDI');
const heartbeatEvents = parseMidiFile(path.join(midiDir, 'TigerCall_HUMAN_PERFORMANCE Heartbeat.mid'));

const drumTakeFiles = ['TigerCall_HUMAN_PERFORMANCE_Drums 1.mid', 'TigerCall_HUMAN_PERFORMANCE Drums 2nd.mid', 'TigerCall_HUMAN_PERFORMANCE Drums 3rd.mid'];
const hornTakeFiles = ['TigerCall_HUMAN_PERFORMANCE Horns  1.mid', 'TigerCall_HUMAN_PERFORMANCE Horns 2nd.mid', 'TigerCall_HUMAN_PERFORMANCE horns 3rd.mid'];

const drumTakes = drumTakeFiles.map(f => parseMidiFile(path.join(midiDir, f)));
const hornTakes = hornTakeFiles.map(f => parseMidiFile(path.join(midiDir, f)));

console.log(`Loaded ${drumTakes.length} Human Drum Takes and ${hornTakes.length} Human Horn Takes.`);

// Section Station Instrument Mappings
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

// Section Source Switching & Take Consensus Compiler
const curatedNotes = [];
let noteId = 0;

const sectionDebugReports = [];

markersData.forEach((m, idx) => {
  const minTime = m.time_seconds;
  const maxTime = markersData[idx + 1] ? markersData[idx + 1].time_seconds : 94.87;
  const name = m.name;

  let category = 'DRUMS';
  if (name.includes('Horn')) category = 'HORNS';
  else if (name.includes('Band') || name.includes('Mash')) category = 'FULL_BAND';
  else if (name === 'Start') category = 'ONBOARDING';
  else if (name.includes('Last Note')) category = 'FINALE';

  const mapping = sectionStationMappings[name] || ["bass_drum", "snare", "cymbal", "quads"];

  if (category === 'ONBOARDING') {
    curatedNotes.push({
      id: ++noteId, t: 2.3435, lane: 0, instrument: "bass_drum", type: "tap", chord: false, marker: name
    });
    curatedNotes.push({
      id: ++noteId, t: 3.6102, lane: 1, instrument: "snare", type: "tap", chord: false, marker: name
    });

    sectionDebugReports.push({
      section: name, category, startSec: minTime, endSec: maxTime, source: "Onboarding Preset",
      rawEvents: 2, consensusEvents: 2, playableEvents: 2, densityPerSec: 0.4,
      lanes: { L: 1, D: 1, R: 0, U: 0 }
    });
    return;
  }

  if (category === 'FINALE') {
    curatedNotes.push({
      id: ++noteId, t: 89.65, lane: 0, instrument: mapping[0], type: "tap", chord: true, marker: name
    });
    curatedNotes.push({
      id: ++noteId, t: 89.65, lane: 1, instrument: mapping[1], type: "tap", chord: true, marker: name
    });
    curatedNotes.push({
      id: ++noteId, t: 89.65, lane: 2, instrument: mapping[2], type: "tap", chord: true, marker: name
    });
    curatedNotes.push({
      id: ++noteId, t: 89.65, lane: 3, instrument: mapping[3], type: "tap", chord: true, marker: name
    });

    sectionDebugReports.push({
      section: name, category, startSec: minTime, endSec: maxTime, source: "Finale 4-Station Slam",
      rawEvents: 4, consensusEvents: 1, playableEvents: 4, densityPerSec: 0.8,
      lanes: { L: 1, D: 1, R: 1, U: 1 }
    });
    return;
  }

  // Select Active Source Takes for Section
  let activeTakes = [];
  if (category === 'HORNS') {
    activeTakes = hornTakes;
  } else if (category === 'DRUMS') {
    activeTakes = drumTakes;
  } else {
    // FULL_BAND / HYBRID: Combine both drum & horn takes
    activeTakes = drumTakes.concat(hornTakes);
  }

  // Extract section events
  const sectionEvents = [];
  activeTakes.forEach((evs, takeIdx) => {
    evs.forEach(e => {
      if (e.sec >= minTime && e.sec < maxTime) {
        sectionEvents.push({ sec: e.sec, takeIdx, pitch: e.note, vel: e.vel });
      }
    });
  });
  sectionEvents.sort((a, b) => a.sec - b.sec);

  // Take Consensus Clustering (90ms window)
  const clusters = [];
  sectionEvents.forEach(e => {
    let lastCluster = clusters[clusters.length - 1];
    if (lastCluster && (e.sec - lastCluster.meanSec) < 0.09) {
      lastCluster.hits.push(e);
      lastCluster.takesSet.add(e.takeIdx);
      lastCluster.meanSec = lastCluster.hits.reduce((s, x) => s + x.sec, 0) / lastCluster.hits.length;
    } else {
      clusters.push({ meanSec: e.sec, hits: [e], takesSet: new Set([e.takeIdx]) });
    }
  });

  // Ergonomic Lane Assignment & Density Budgeting
  const sectionNotes = [];
  const laneCounts = { L: 0, D: 0, R: 0, U: 0 };
  const lanePattern = [0, 1, 2, 1, 3, 1, 0, 2];

  clusters.forEach((c, cIdx) => {
    const t = Number(c.meanSec.toFixed(4));
    let lane = lanePattern[cIdx % lanePattern.length];
    let type = 'tap';
    let chord = false;

    if (category === 'HORNS' && cIdx % 8 === 4) {
      type = 'hold';
      lane = 3; // UP lane hold
    } else if (category === 'FULL_BAND' && c.takesSet.size >= 2 && cIdx % 6 === 0) {
      chord = true;
      lane = 0; // LEFT + RIGHT chord
    }

    const inst = mapping[lane] || 'bass_drum';

    sectionNotes.push({
      id: ++noteId, t, lane, instrument: inst, type, duration: type === 'hold' ? 1.2 : 0, chord, marker: name
    });
    laneCounts[['L', 'D', 'R', 'U'][lane]]++;

    if (chord) {
      sectionNotes.push({
        id: ++noteId, t, lane: 2, instrument: mapping[2] || 'brass_ensemble', type: 'tap', duration: 0, chord: true, marker: name
      });
      laneCounts['R']++;
    }
  });

  // Enforce Ergonomic Minimum Spacing (75ms)
  const validatedSectionNotes = [];
  let lastUpTime = -99;

  sectionNotes.forEach(n => {
    const lastInLane = validatedSectionNotes.slice().reverse().find(x => x.lane === n.lane);
    if (lastInLane && (n.t - lastInLane.t) < 0.075) return;

    if (n.lane === 3) {
      if (n.t - lastUpTime < 0.25) n.lane = 1;
      else lastUpTime = n.t;
    }
    validatedSectionNotes.push(n);
  });

  curatedNotes.push(...validatedSectionNotes);

  const durationSec = Math.max(0.1, maxTime - minTime);
  const density = (validatedSectionNotes.length / durationSec).toFixed(1);

  sectionDebugReports.push({
    section: name,
    category,
    startSec: Number(minTime.toFixed(2)),
    endSec: Number(maxTime.toFixed(2)),
    source: category === 'HORNS' ? 'Human Horn Consensus' : category === 'DRUMS' ? 'Human Drum Consensus' : 'Full Band Consensus',
    rawEvents: sectionEvents.length,
    consensusEvents: clusters.length,
    playableEvents: validatedSectionNotes.length,
    densityPerSec: Number(density),
    lanes: laneCounts
  });
});

curatedNotes.sort((a, b) => a.t - b.t);

console.log(`\n=== TIGER CALL CURATED CHART COMPILATION REPORT ===`);
console.log(`Total Curated Playable Notes: ${curatedNotes.length}`);
console.table(sectionDebugReports);

const chartOutput = {
  version: "4.0-SECTION-CURATED-HUMAN-CONSENSUS",
  total_notes: curatedNotes.length,
  bpm_base: 198,
  markers: markersData,
  tempo_events: tempoEvents,
  section_station_mappings: sectionStationMappings,
  section_debug_reports: sectionDebugReports,
  notes: curatedNotes
};

const outputPath = path.join(__dirname, '../games/TigerCall_StillStanding_PLX/assets/TigerCall_AUTHORITATIVE_CHART.json');
fs.writeFileSync(outputPath, JSON.stringify(chartOutput, null, 2));
console.log(`\nAuthoritative Curated Chart successfully saved to ${outputPath}`);
