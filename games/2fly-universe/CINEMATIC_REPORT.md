# 2FLY Universe — Cinematic Depth V6.2 RC1

Built and tested September 17, 2026. Extract the ZIP and run `START_2FLY_UNIVERSE.bat`.
V6.1 remains intact as a separate checkpoint. The reference images guided scale,
composition and lighting; their pixels were not copied into this release.

## Visual changes

- Showcase system centers are spaced 2.1× farther from the galaxy core at runtime.
  The three flagship planet radii are 1.7× larger; frontier planets now range from
  650–860 units. Their distinct original artwork and material identity are preserved.
- Flagship moons are 28% smaller with orbital distances expanded about 1.8×;
  frontier moons are also smaller. Slower moon motion reinforces the sense of mass.
  Historical-era primary worlds are 1.75× larger with wider orbital spacing.
- Planet materials use their own galaxy's core position for directional illumination,
  a curved day/night boundary, a shaded night side, and a lit atmospheric limb.
  Emissive artwork is restrained so it no longer overwhelms directional shading.
  A depth-tested core glow provides a visible source behind planetary silhouettes.
- Distant surfaces lose some saturation and contrast. Stars are finer; local dust,
  orbital guides and duplicate labels are quieter. This creates more visual separation
  between foreground worlds and the environment beyond them.
- **Frame selected** explicitly flies to an asymmetric close composition: a large
  foreground planet on one side, with room for the core and distant objects. Framing
  adapts to portrait screens. Ordinary selection still preserves camera position.

## Navigation and padding

Mouse and touch drags rotate both camera position and view about the correct pivot:
universe origin outside a galaxy, the active galaxy core inside, or the selected
object while selected. Changing selection does not immediately move or turn the camera.
Clearing selection restores the galaxy/universe pivot on the next orbit input.

Entry still uses 1.06× the visual shell radius. Exit now uses 1.80× instead of 1.22×:
the entry-to-exit buffer is 4.6× wider. Entry flights settle at 60% of the entry radius
instead of 78%. The existing transition locks and cooldown remain. Local objects stay
exclusive to the active galaxy throughout the buffer.

Collision envelopes match enlarged flagship, frontier and historical worlds. Tours
respect those envelopes; saved tours resolve their destination IDs against current
positions. Showcase selection range is 42,000 units to cover the expanded local staging.
Two-stage media confirmation, silent proximity, safe warp recovery and exit controls remain.

## Verification

- All 36 application JS files passed syntax checks; no shader compilation errors in Chrome.
- Eight policy tests passed with the wider boundaries, including jitter, click confirmation,
  charge cancellation, and validated safe return points.
- Actual desktop drags verified universe, non-origin galaxy and selected-planet orbit pivots.
  Camera-to-pivot distance remains constant; selection does not jump the camera.
- Orbit beyond the old exit threshold stays in the active galaxy with no repeat entry.
  Desktop and portrait Frame selected compositions were captured and inspected.
- Revisited all seven galaxies, seven showcase worlds and 23 content panels. Safe arrivals
  still clear the registered scene object spheres after scaling. No page errors.
- Desktop safety regression: double-click suppression, explicit audio activation, overlay
  click isolation, exact camera restoration, selection clearing, distant click immunity,
  held-thrust charging/cancellation, wormhole lock and safe return. No browser errors or
  failed HTTP responses in that run.
- Touch emulation at 390×844 and 844×390: deliberate taps, visible close controls,
  no horizontal overflow, exit, reduced motion, held touch thrust and cancellation.
- Custom tour entry/resume, next stop, exit, star-placement cancellation, keyboard thrust
  and menu cancellation passed. All 73 bundled asset files and the canonical JSON match V6.1.

Evidence is in `CINEMATIC_QA/`. `REVISION_QA/` and `QA/` retain earlier release history.
Run `node tests/navigation-safety.test.mjs` for the policy checks.

## Files changed

- `index.html`
- `navigation-safety.css`
- `app-v23/camera.js`
- `app-v23/universe-shell.js`
- `tests/navigation-safety.test.mjs`
- `app-v23/scene/era-orbit-system.js`
- `app-v23/scene/flagship-system-base.js`
- `app-v23/scene/frontier-systems.js`
- `app-v23/scene/galaxy.js`
- `app-v23/scene/star-layer.js`
- `app-v23/ui/navigation-controls.js`
- `app-v23/ui/tour-builder.js`

Added `app-v23/scene/cinematic-depth.js`, this report and `CINEMATIC_QA/`.
Updated `READ_ME_FIRST.txt` with framing and orbit instructions.

## Scope and remaining limits

The core lighting is an analytic shader, not a full interplanetary shadow simulation.
No extra fullscreen post-processing pass or high-resolution shadow maps were added.
Original branded planet textures remain artistic rather than photorealistic terrain.
Physical mobile devices, Safari and broad GPU performance benchmarking remain untested.
Hosted media/games still require internet. No new controller implementation was added.
The larger spacing intentionally makes travel between systems longer; lists, tours and
Frame selected provide deliberate navigation shortcuts.
