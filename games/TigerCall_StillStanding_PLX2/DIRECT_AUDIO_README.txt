TIGER CALL — DIRECT AUDIO FIX

ONLY SOUND SOURCE:
  assets/TigerCall_RhythmSource_Clean/MASTER/TigerCallTigerHeart_ONLY_MASTER.wav

This is an exact byte-for-byte copy of:
  TigerCallTigerHeart_PLXMaster(2).wav

SHA256:
  8c9ec6a715b3ba7b8422b4cd1c781b17f0df376bfa641031596e8e51b35519e8

KEY FIX:
- Removed the custom WebAudio fetch/decode engine.
- ENTER THE FORMATION now directly calls audio.play() on the WAV.
- The start screen is hidden only after the WAV actually starts.
- If the WAV fails, the page does not reload or loop; it stays put and reports an audio failure.
- audio.currentTime is the gameplay clock.
- The background video remains permanently muted.
