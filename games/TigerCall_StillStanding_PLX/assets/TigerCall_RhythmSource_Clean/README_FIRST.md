# Tiger Call Rhythm Source — Clean Package

This package is organized for deterministic rhythm-game analysis and chart generation.

## Canonical sources
- MASTER/TigerCall_MASTER.wav
- STEMS/TigerCall_DRUMS.wav
- STEMS/TigerCall_BASS.wav
- STEMS/TigerCall_VOCALS.wav
- STEMS/TigerCall_OTHER.wav
- MIDI/TigerCall_TEMPO_MAP.mid
- MIDI/TigerCall_DRUMS_RAW.mid
- MIDI/TigerCall_OTHER_RAW.mid
- MARKERS/TigerCall_MARKERS_AUTHORITATIVE.csv
- MARKERS/TigerCall_MARKERS_AUTHORITATIVE.json
- MIDI/TigerCall_TEMPO_EVENTS.json

## Important
The authoritative marker files were reconstructed directly from marker events embedded in
TigerCall_TEMPO_MAP.mid. The distant Studio One session marker named "End" was intentionally
excluded because it occurs far beyond the actual song/audio duration.

The original manually typed marker CSV/TXT files are retained under REFERENCE only and should
not be treated as timing authority.

## AntiGravity / game-engine rule
Do not perform runtime beat detection when canonical timing data is available.
Use the tempo-map MIDI, raw extracted MIDI events, aligned stems, and authoritative marker data
to compile the final runtime chart JSON.
