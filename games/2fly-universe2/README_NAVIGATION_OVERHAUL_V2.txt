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


CONTROL FIX V3 (2026-08-24)
- Mouse wheel restored to 100% default navigation sensitivity.
- Left mouse hold no longer activates thrust; original mouse drag/orbit behavior is preserved.
- Hold SPACEBAR to engage progressive thrust / warp.
- While SPACEBAR is held, thrust continuously follows the live mouse position.
- Gray navigation selector hides during thrust and reappears on release.
- On SPACEBAR release, retained travel velocity is reduced to 28% and then rapidly damped for controllability.
