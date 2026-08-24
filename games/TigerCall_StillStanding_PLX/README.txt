TIGER CALL: STILL STANDING — AUDIO METHOD FIX

THIS BUILD USES THE SAME AUDIO METHOD AS THE SUCCESSFUL SIDE TEST.

AUDIO STARTUP
1. ENTER THE FORMATION tries:
   assets/audio/TigerCall_FinalMaster.mp3

2. The game waits 350ms and verifies currentTime actually advanced.

3. If MP3 fails, it automatically tries:
   assets/audio/TigerCall_FinalMaster.wav

4. Whichever file proves playback becomes the sole gameplay clock.

5. Only AFTER confirmed playback do:
   - the start screen close
   - the lane highway appear
   - Landing Paws appear
   - incoming icons begin moving

VIDEO
- permanently muted
- visual-only
- never used as an audio or timing source

MIDI
- TigerCall_NewHeart_HumanPerformance.mid = required player inputs
- TigerCallNewHeart.mid = tempo + marker timing

CONTROLS
I = LEFT
O = DOWN
P = RIGHT
9 = UP

MP3 SHA256
149abac3e12fc883601066b7a538391ecd44510b4d502926de86a62a46bf7517

WAV SHA256
93b6af5abc4ac95f86b92110f9f05f5e4554d96ffdac174fb0c2ff87d514e2c0
