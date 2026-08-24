TIGER CALL: STILL STANDING — SINGLE-CLOCK FIX

RUNTIME SOURCES
- Audio: assets/audio/TigerCall_FinalMaster.mp3
- Gameplay MIDI: assets/midi/TigerCall_HumanPerformance_Synced.mid
- Background video: assets/video/tiger-call-still-standing.mp4 (muted visual only)

AUDIO STARTUP
- ENTER THE FORMATION is the required browser user gesture.
- The MP3 play() call is made directly from that click.
- Gameplay does not begin until the audio currentTime is verified to advance.
- The MP3 is the only gameplay clock.

MIDI
There is exactly ONE MIDI file in this build.
TigerCall_HumanPerformance_Synced.mid contains:
- 357 human-performance gameplay notes
- the tempo map required to align those notes to the master audio
- marker events used by the visual effects

LANE MAP
MIDI 72 = LEFT  = I  = snare
MIDI 74 = DOWN  = O  = bass drum
MIDI 76 = RIGHT = P  = cymbal
MIDI 73 = UP    = 9  = quads

VERIFIED TIMING
- First playable note: 3.926 s
- Last playable note: 88.855 s
- End marker: 94.877 s
- MP3 duration: 94.929 s

The falling icons and hit judgment both read the same audio.currentTime clock, so visual approach timing and scoring remain locked to the same source.
