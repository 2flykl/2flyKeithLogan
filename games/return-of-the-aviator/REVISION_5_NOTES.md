# Revision 5 — Flight System Rebuild

## Critical fixes
- Start button stays disabled until Phaser finishes creating the playable scene.
- New script filename (`game-rev5.js`) bypasses cached older game logic.
- New hero filenames (`v5_hero_*`) bypass cached clipped sprites.
- The master gameplay clock is monotonic and continues even if the Wix audio stream stalls or fails.
- Any later key press / pointer press retries audio and seeks it to the current gameplay clock.
- Opening scene shows the aircraft first. 2Fly appears only after the plane destruction/jump moment.

## Character proportions
- 31 character states were re-extracted from the actual alpha-connected sprite boundaries instead of equal-height rows.
- This prevents legs/feet from being cut off.
- Runtime production frames are narrowed and lengthened slightly for a leaner silhouette.
- Gameplay sizes use a target character height rather than arbitrary sprite scale.

## Scrolling boards
- Opening sky: diagonal cloud/sky movement.
- Dive: vertical high-speed downward-world scroll.
- Runway: perspective scroll reverses after the turnaround.
- Piano Tank / Algorithm Maze: strong forward road scroll with lateral curve drift.
- Boss storm: lateral cloud movement and stronger vertical arena drop after floor failure.

## Plane and Piano Tank
- Full plane + piano tank reference sprite sheet included under `assets/reference_sheets/`.
- Production plane states: normal, bank, damaged/burning, destruction.
- Piano tank replaces the generic hero vehicle in the Algorithm Maze.
