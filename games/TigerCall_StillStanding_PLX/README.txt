TIGER CALL // STILL STANDING
SYNC-SOLVED BUILD

WHAT WAS ACTUALLY WRONG
The full NewHeart MIDI file continues to about 95.64 s because it contains
trailing data after the musical performance. That file EOF is NOT the correct
sync endpoint.

The MIDI contains an authored "End" marker at:
  94.876873838 seconds

The performance video's AAC/media duration is:
  94.876735000 seconds

Difference:
  -0.138838 milliseconds

That is already essentially exact. The build now mathematically locks the
authored MIDI interval to the video's exact media interval.

SYNC EQUATION
  videoTime = (midiTime - midiStart) * syncScale

  syncScale = videoDuration / (midiEnd - midiStart)
            = 0.999998536656

  fit percentage = 99.999853666%

IMPORTANT
We DO NOT compress the song by ~0.8%.
That would have been based on the wrong 95.64-second MIDI EOF.

RUNTIME CLOCK
- performanceVideo.currentTime is the only playback clock.
- The MP4 is unmuted; its own AAC audio and picture are inherently locked.
- All falling cues and hit judging reference the same video.currentTime.
- MIDI cue ticks are converted through the NewHeart tempo map, then through
  the exact Start/End affine sync equation above.

MIDI FILE ROLES
1. TigerCall_NewHeart_HumanPerformance.mid
   - 357 gameplay cues only
2. TigerCall_NewHeart_Reference.mid
   - tempo map
   - Start/End sync anchors
   - musical section markers

LANE MAP
72 = LEFT / I / Snare
74 = DOWN / O / Bass Drum
76 = RIGHT / P / Cymbal
73 = UP / 9 / Quads
