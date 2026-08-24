2fly Universe — Inertial Warp Navigation V2

Changes in this revision:
- Reduced after-drift substantially for easier stopping and precision control.
- On thrust release, retained momentum is immediately reduced to 28%, then quickly damped.
- Non-thrust travel damping increased so coasting settles naturally instead of carrying the player too far.
- During click-hold thrust / warp, steering follows the LIVE mouse position continuously.
- Normal drag-orbit input is suspended after thrust engages, preventing competing steering systems.
- The gray navigation selector hides while thrust/warp is active.
- On mouse release, the selector reappears at the current mouse position and normal selector navigation resumes.
- Warp steering remains progressive: steering is responsive at low speed and slightly heavier at high warp speed.
- Existing 85% wheel navigation speed is preserved.
