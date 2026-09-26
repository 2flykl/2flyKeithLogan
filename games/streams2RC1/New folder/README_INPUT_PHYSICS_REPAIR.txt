STREAMS INPUT / PHYSICS REPAIR

This build repairs the startup-control bug instead of changing visual proportions.

Fixes:
- clears jump buffer, direction state, dash state, and double-tap history on every run
- requires a short neutral/released-input arm period before gameplay controls activate
- clears controls on browser blur/tab changes
- makes the initial launch platform non-drifting and non-sinking
- uses a fixed 120 Hz physics timestep to remove first-frame drag / inconsistent movement
- preserves the stable player hitbox and the clean media art pipeline
