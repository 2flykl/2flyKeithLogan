2Fly Universe — Inertial Navigation + Warp Package

Runtime changes in this build:

1. Mouse wheel speed reset to the original navigation baseline and reduced 15%.
   - Original baseline: 0.000125
   - Final wheel multiplier: 0.00010625 (85% of baseline)
   - Wheel movement still follows the gray mouse/zoom anchor rather than screen center.

2. Hold-left-click propulsion.
   - A normal short click still behaves normally.
   - Holding left click for ~180ms engages forward thrust toward the mouse position.
   - Thrust acceleration rises progressively while held.

3. Progressive warp travel.
   - Hold duration smoothly increases acceleration and maximum travel speed.
   - The camera field of view expands progressively as warp builds, giving speed a physical visual response instead of an instant fake transition.

4. Momentum and natural drift.
   - Releasing the mouse cuts thrust but preserves velocity.
   - The camera continues coasting in the current direction.
   - Light artificial damping gradually reduces velocity so navigation remains controllable.

5. Inertial steering.
   - Mouse direction supplies the desired thrust direction.
   - Existing velocity is preserved, so high-speed direction changes curve naturally instead of snapping instantly.

6. Click protection after thrust.
   - A long click used for propulsion suppresses the ordinary click event on release so the user does not accidentally select or teleport to an object.

Deploy this folder as:
/games/2fly-universe/

Runtime JS:
- assets/main-CF7RNdZJ.js
- assets/three-B6iN8XL--nQzNLpSq.js
