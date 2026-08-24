TIGER CALL // STILL STANDING
VIDEO-AUDIO MASTER BUILD

THIS BUILD USES ONE MEDIA CLOCK.

START TIGER CALL does exactly this:
1. Set the performance MP4 to 0.000 seconds.
2. Unmute the MP4 and set volume to 100%.
3. Call performanceVideo.play() directly from the user's button click.
4. Use performanceVideo.currentTime as the master clock for:
   - visible performance video
   - the video's built-in AAC audio
   - all 357 MIDI gameplay cues
   - falling lane icons
   - hit judging
   - markers/effects
   - pause/resume
   - replay

There is NO separate MP3 or WAV in this build.
There is therefore no audio-vs-video start race and no second media clock to drift.

Single MIDI:
assets/midi/TigerCall_HumanPerformance_Synced.mid

Lane mapping:
72 = LEFT / I / Snare
74 = DOWN / O / Bass Drum
76 = RIGHT / P / Cymbal
73 = UP / 9 / Quads

Performance MP4:
assets/video/tiger-call-still-standing.mp4
The MP4 contains its own AAC audio track and starts UNMUTED from START TIGER CALL.
