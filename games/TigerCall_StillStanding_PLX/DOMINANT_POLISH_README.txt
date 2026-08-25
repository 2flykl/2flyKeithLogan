TIGER CALL DOMINANT POLISH BUILD

Built directly from TigerCall_StillStanding_PLX (4).zip.

FIXED / ADDED
- Hard-locked lane order: LEFT, DOWN, RIGHT, UP.
- Hard-locked keys: I, O, P, 9.
- Corrected falling LEFT and RIGHT arrow artwork that had been visually reversed.
- Added new dominant/armored receptor paw SVGs with directional badges.
- Keyboard input now listens in capture phase, supports both event.code and event.key, and stops propagation after a recognized hit.
- Added pointer/touch hit support on the lower lane area.
- Hit window widened slightly to 220 ms to avoid borderline non-registration while preserving cue timing.
- Successful hits emit tiny orange/black/white musical-note particles instead of generic circular dissolve particles.
- Added canvas-based orange/black/white confetti so it is not dependent on CSS masks.
- Added visible gameplay LED/drone formations: tiger eye, claw marks, 09, and paw constellation.
- Added direction reference sprite sheets for QA.

SYNC
The solved NewHeart sync architecture remains unchanged. performanceVideo.currentTime is still the gameplay master clock.

MIDI VERIFIED
72 LEFT: 94 cues
74 DOWN: 141 cues
76 RIGHT: 93 cues
73 UP: 29 cues
TOTAL: 357 cues
