TIGER CALL — ONE WAV / START BUTTON FIX

THE ONLY AUDIO FILE ANYWHERE IN THIS PROJECT:
  assets/TigerCall_RhythmSource_Clean/MASTER/TigerCallTigerHeart_ONLY_MASTER.wav

Exact source upload:
  TigerCallTigerHeart_PLXMaster(3).wav

SHA256:
  23a02fb9c26e7b2ace8e99ada740c17ed3c7c193a34914df08ef8e372478d4a3

WHAT WAS REMOVED
- Every other WAV
- Every MP3/OGG/M4A/AAC/FLAC if present
- Old master references in code/docs

START BUTTON FIX
- ENTER THE FORMATION now uses addEventListener.
- A second inline fail-safe listener is included.
- audio.load() was removed from the start path.
- The start page is never reopened because audio failed.
- The only audio play attempt is this exact WAV.
- Background video remains muted and visual-only.
