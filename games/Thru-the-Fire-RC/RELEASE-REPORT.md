# Thru the Fire — RC2 update

- **Original song restored:** the exact MP3 referenced by the original game is bundled locally. It plays on Enter, continues across rooms, loops, responds to SONG ON/OFF, stops at the ending/title, and restarts on replay. Fire ambience stays quiet underneath. A PLAY SONG retry appears if the browser blocks playback.
- **Timer moved into the scene:** large centered countdown, progress bar, amber exit phase, and a pulsing red GET OUT NOW state during the final seconds.
- **Urgency effects:** denser descending smoke, soft layered flame particles, warmer edge lighting, and increasingly numerous/faster embers. Items and the exit signal remain above the effects. Reduced-motion settings are respected.
- **Boards unchanged:** all 72 room images are byte-identical to the previous RC. Nine-room rules, item choices, randomization and penalties remain unchanged.

**Validation:** offline original-song playback on desktop and touch-emulated Chrome; MP3 duration 3:15; decoded audio samples confirmed non-silent; mute/resume, failure-stop, replay restart, centered timer and critical state passed. All 9,000 randomized rule tests passed again, with no JavaScript errors. The updated ZIP was extracted and its full nine-room escape path verified offline.

Extract the complete ZIP and open `Thru-the-Fire-RC/index.html`. Mobile was tested with Chrome touch emulation, not physical phones. The previously noted panorama rear-join imperfections remain; room art was not rebuilt.
