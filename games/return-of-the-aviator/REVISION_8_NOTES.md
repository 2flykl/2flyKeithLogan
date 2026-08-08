# Revision 8 — Cinematic Scene Rebuild

## Scene 2: Runway Pursuit
- No vertical background scrolling.
- True tracked runway perspective.
- First half uses rear-running 2Fly states and camera pull-back as he runs toward the vanishing point.
- Midpoint turn changes to front-running states.
- Second half pushes toward camera while Algorithm Air Boss grows behind him.
- Left/right camera lead is eased rather than snapped.
- Jump remains active throughout.

## Scene 3: The Grand / Algorithm Route
- The Grand piano tank is the visible player vehicle.
- Pseudo-3D chase-road renderer replaces tiled sprite-sheet backgrounds.
- Skyline is a separate environmental layer.
- Dynamic lanes, route curvature, gates, enemy vehicles and real ramps.
- Ramp contact launches The Grand and pulls camera wider for airtime.
- Steering subtly leads the camera.

## Scene 4: Algorithm Storm
- Starts in a wider arena composition.
- 2Fly uses dedicated upward-aim states.
- Boss gradually occupies more upper framing as health/time advances.
- Opening arena floor is level across the frame.
- At roughly one-third damage/progression, the floor breaks.
- Combat continues across floating digital land platforms.
- Finale smoothly pulls to an extreme wide composition for destruction.

## Stability
- Native Canvas renderer; no Phaser/CDN game-engine dependency.
- Gameplay timeline remains independent of audio playback.
- Too Fast plays twice while the game progresses continuously.
- Scene transitions are part of the master timeline.
- Entity counts remain capped.
- Revision 8 full-timeline mocked-browser stress test: 7,900 frames / ~260.7 seconds PASS.
- Production asset integrity test PASS.
- Node JavaScript syntax check PASS.
