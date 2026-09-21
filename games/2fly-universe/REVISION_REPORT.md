# 2FLY Universe — Galaxy Safety V6.1 RC1

Release candidate tested on September 17, 2026. Built as a separate copy of V6 RC1;
the original project and V6 checkpoint were not edited. Launch with
`START_2FLY_UNIVERSE.bat` after extracting the whole ZIP.

## Navigation and boundaries

One authoritative policy owns galaxy residency, selection, content, and recovery.
Each galaxy uses its existing 3D shell radius × 1.06 for entry and × 1.22 for exit.
Entry lasts 1.45 seconds; exit lasts 1.25 seconds with a 2.4-second re-entry cooldown.
Boundary jitter cannot repeatedly fire the entry effect. Only one galaxy is active.
Local raycasts, timeline controls, navigator actions, object lists, and deep links
honor the same active-galaxy restriction. Distant galaxies remain visible.
Entry uses a palette-colored ripple and title, followed by a persistent local status.
Exit or Return to Universe View restores a clear route to the wider region.

States: Universe Travel, Entering Galaxy, Inside Galaxy, Local Object Selected,
Local Content Open, Exiting Galaxy, Warp Charging, Warp Transit, and Warp Arrival.
Transition controls are locked; overlays capture interaction; content freezes the camera.
Explicit travel resumes after the entry pause, preserving tours.

## Interaction and audio

The first click selects, illuminates, and labels a local object without moving the camera.
A separate click after 550 ms confirms it. Rapid multi-clicks extend the confirmation delay;
held Enter cannot confirm. Different objects replace selection. Empty space, Escape,
range exit, and galaxy exit clear it. Showcase range is 28,000 world units; era landmarks
use 22,000; visitor stars use 18,000. Closing content restores position and orientation.

Regional/proximity song playback is disabled. Confirmed media owns one player;
opening fades in over 220 ms, closing fades out over 160 ms. Exploration never resumes
ambient music. Existing mute controls remain. If autoplay is blocked, native play controls
remain usable. Original songs, videos, games, archive descriptions, and URLs are retained.
Star placement inside a galaxy is restricted to that galaxy's regions.

## Warp recovery

Recovery requires radius > 90,000, at least 3 seconds of sustained outward thrust,
and 14,000 units of outward travel. A further 3-second charge ramps peripheral energy
and the existing controlled speed effect; thrust is capped at 19,000 units/second.
Release, reversal, inward travel, menus, focus loss, and interrupted flight cancel charging.
There is no uncontrolled acceleration. Transit lasts 2.4 seconds with eight lightweight
CSS rings and a clear return message; arrival lasts 1.2 seconds.

Return selects one of five validated points, excluding the previous arrival where possible.
Points clear all galaxy exit envelopes by at least 3,500 units; browser verification also
checks actual registered object spheres. Arrival faces the central region and clears velocity,
selection, galaxy residency, charge, zoom anchors, history, FOV changes, and temporary locks.
A 3-second cooldown prevents immediate re-entry. Reduced motion removes ring animation,
entry scaling, and thrust FOV motion. No continuous post-processing pipeline was added.

## Validation

- 8 policy tests: all seven boundaries, entry-edge jitter, exit hysteresis, confirmation,
  selection/range/galaxy gates, short/stationary/inward travel, cancellation, repeated random
  returns, and arrival clearance. Reproduce with `node tests/navigation-safety.test.mjs`.
- Desktop Chrome: real clicks and right-button thrust; rapid double-click suppression;
  selection aura; silence on approach; audio playback after confirmation; single player;
  overlay click containment; exact close restoration; selection changes, Escape, empty space;
  distant click immunity; release cancellation; wormhole lock and validated safe arrival.
  No browser errors or failed HTTP responses in that run.
- Browser traversal of all seven galaxies and deliberate opening of all seven showcase worlds
  and all 23 child panels. Every distant timeline button disabled while local. All five
  arrival candidates clear the actual registered object spheres. No page errors.
- Touch emulation at 390×844 and 844×390: deliberate taps, visible close controls, no horizontal
  overflow, exit, reduced motion, real touch hold charging and release cancellation.
- Custom two-stop tour: entry pause/resume, next stop remains silent, exit returns to universe.
  Local star placement and unsaved discard; keyboard W thrust and menu cancellation. No page errors.
- All 35 application JS files pass syntax checks. Windows PowerShell launcher serves and launches
  the build in Chrome without browser errors. Original asset and seed-data hashes match V6.
- All 23 unique preserved media/poster/game destinations returned HTTP 200.

Machine-readable results and screenshots are in `REVISION_QA/`. Earlier `QA/`,
`TESTING_REPORT.md`, and `CHANGELOG.md` are retained V6 history, not revision evidence.

## Files changed

- `index.html`
- `app-v23/camera.js`
- `app-v23/universe-shell.js`
- `app-v23/audio/audio-manager.js`
- `app-v23/overlays/media-overlays.js`
- `app-v23/scene/galaxy.js`
- `app-v23/ui/constellation-journey.js`
- `app-v23/ui/galactic-navigator.js`
- `app-v23/ui/planet-focus-panel.js`

Added: `app-v23/state/navigation-safety.js`, `app-v23/ui/navigation-controls.js`,
`navigation-safety.css`, `tests/navigation-safety.test.mjs`, this report, and `REVISION_QA/`.
Updated `READ_ME_FIRST.txt` with the new interaction and launch instructions.

## Limits and recommended follow-up

Chrome desktop and emulated touch were tested; physical iOS/Android hardware and Safari
remain recommended release checks. No gamepad input implementation existed in the supplied
project, so controller hardware was not added or claimed tested. Hosted media and games
require internet; HTTP and panel checks do not constitute complete playthroughs of each game.
Stars and tours still use local browser storage; changing origin/port changes that storage scope.
If future galaxies or distant geometry are added, revalidate the arrival candidates and boundaries.
The visual checks confirm bounded effects, not a performance benchmark across all GPUs.
