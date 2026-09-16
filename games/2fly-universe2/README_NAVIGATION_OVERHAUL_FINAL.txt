2FLY UNIVERSE — NAVIGATION OVERHAUL FINAL
=========================================

This build intentionally separates precision navigation from cinematic flight.

DEFAULT / PRECISION NAVIGATION
- Mouse move: moves the gray navigation indicator.
- Left mouse drag: direct orbit/look. No propulsion and no momentum carryover.
- Mouse wheel: restored to the original/default wheel speed and zooms toward the selected cursor anchor.
- WASD: optional directional travel.
- Q / E: optional down / up travel.
- Reset View: returns to the Universe home position and exits Flight Mode.

FLIGHT / THRUSTER MODE
- SPACEBAR: toggles Flight Mode ON/OFF. Spacebar does not itself create thrust.
- In Flight Mode, HOLD RIGHT MOUSE BUTTON to thrust.
- Live mouse position continuously steers the thrust vector.
- Releasing right mouse leaves only a very short assisted coast, then velocity damps quickly.
- Sustained thrust progressively builds from normal acceleration into warp.

CHAOS TRAVEL
- After sustained high-speed thrust, randomized wormhole events become possible.
- A wormhole visually pulls the traveler through space-time and ejects them to a randomized safe location/direction within the Universe envelope.
- The traveler retains meaningful motion after ejection, so it feels like an uncontrolled cosmic event rather than a menu teleport.

GALAXY HYPERLAPSE
- Entering a galaxy while traveling at warp triggers a hyperlapse state.
- Forward travel is temporarily speed-ramped/slowed so orbiting galaxy content can flash past instead of the player crossing the galaxy invisibly in a fraction of a second.
- The speed ramps back to deep-space travel on exit.

UNIVERSE CONTAINMENT / RETURN FIELD
- The populated Universe sits inside an invisible spherical navigation envelope.
- Normal space: full player control.
- Deep-space return zone: a gradual center-facing influence begins.
- Outer limit: the camera increasingly faces the true Universe center and travel velocity bends inward.
- Extreme outward travel is gently forced back inside instead of letting the user become permanently lost.
- No hard invisible-wall collision or abrupt teleport is used for the boundary.

DESIGN PRINCIPLE
Precision navigation must remain predictable. Flight is intentionally cinematic. Chaos only appears after the player deliberately sustains high-speed thrust. The return field is the final safety net.
