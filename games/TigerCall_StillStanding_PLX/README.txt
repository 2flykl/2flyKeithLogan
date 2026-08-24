TIGER CALL: STILL STANDING — CLEAN PLX

THIS IS A CLEAN-ROOM REBUILD.

AUTHORITATIVE RUNTIME SOURCES
1. assets/audio/TigerCall_FinalMaster.wav
   - audible master
   - sole gameplay clock

2. assets/midi/TigerCall_NewHeart_HumanPerformance.mid
   - only player-input MIDI
   - defines required lane presses

3. assets/midi/TigerCallNewHeart.mid
   - only tempo/structure MIDI
   - contains tempo changes and marker events

INCLUDED MASTER COPY
4. assets/audio/TigerCall_FinalMaster.mp3
   - included as a delivery/reference master
   - NOT loaded by gameplay
   - NOT a second timing clock

BACKGROUND VIDEO
- muted
- visual-only
- never controls timing or sound

REMOVED FROM THE OLD PLX
- all previous master WAV variants
- stems
- old heartbeat MIDI
- old tempo-map MIDI
- heartbeat/metronome JSON
- generated chart JSON files
- sync diagnostics
- repair manifests/readmes
- WebAudio wrappers
- old fallback timing engines
- duplicate performance-station asset packs
- backup CSS
- concept art not used at runtime
- old compile scripts

CONTROLS
I = LEFT
O = DOWN
P = RIGHT
9 = UP

TIMING PIPELINE
Human Performance MIDI ticks
→ Tempo/Marker MIDI tempo map
→ absolute seconds
→ TigerCall_FinalMaster.wav currentTime
→ note position / hit judgment

The MP4 is never part of that chain.
