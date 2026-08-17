TIGER CALL: STILL STANDING — HEARTBEAT REPAIR BUILD
=====================================================

WHAT CHANGED
- Studio/section marker authority has been removed from gameplay.
- TigerCall_HUMAN_PERFORMANCE TigerHeartbeat.mid is now the gameplay-note authority.
- TigerCall_HUMAN_PERFORMANCE Heartbeat.mid drives a SILENT visual metronome only.
- Four MIDI pitches are forced to one permanent lane map:
    72 = LEFT
    73 = DOWN
    74 = RIGHT
    76 = UP
- Legacy source input translation is fixed as I/O/P/9 -> L/D/R/U.
- Falling icons use the translated MIDI lane directly, so visual lane placement cannot be changed by sections.
- Player controls: Arrow keys or A/S/D/W. Legacy I/O/P/9 aliases remain supported.
- Missing-script startup errors from the prior package were removed.
- Heartbeat chart data is embedded for file:// testing and also retained as JSON for hosted builds/debugging.

PLAY
1. Unzip the folder.
2. Double-click index.html in Chrome or Edge.
3. Press ENTER THE FORMATION.
4. Follow the falling icons into LEFT / DOWN / RIGHT / UP landing paws.
5. The pulsing TIGER HEARTBEAT indicator is visual only; it adds no audio.
6. ESC pauses.

TIMING SOURCES
Gameplay notes:
  assets/TigerCall_RhythmSource_Clean/MIDI/TigerCall_HUMAN_PERFORMANCE TigerHeartbeat.mid
Visual metronome:
  assets/TigerCall_RhythmSource_Clean/MIDI/TigerCall_HUMAN_PERFORMANCE Heartbeat.mid
Tempo map:
  assets/TigerCall_RhythmSource_Clean/MIDI/TigerCall_TEMPO_EVENTS.json

GENERATED GAME DATA
  assets/TigerCall_TIGER_HEARTBEAT_GAME_CHART.json
  assets/TigerCall_HEARTBEAT_METRONOME.json
  src/heartbeatData.js

The performance video remains the audible master. The heartbeat metronome does not generate sound.
