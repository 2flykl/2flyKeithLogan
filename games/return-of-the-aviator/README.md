# Return of the Aviator — Graphics Overhaul / Phaser WebGL Build

This build is a renderer overhaul, not a minor v5 patch.

## Major changes
- Phaser 3 / WebGL presentation layer.
- Isolated production sprites derived from the project's 2Fly, weapon, vehicle, bot, and boss art sheets.
- Multi-layer parallax skies and foreground cloud passes.
- Cinematic camera shake, flash, zoom, bank, and boss-scale changes.
- Image-based runway, road, city, and Algorithm Storm environments.
- Sprite hit flash/recoil, explosion textures, particles, note-fire trails, and screen-space FX.
- Music-synced scene structure remains tied to “Too Fast.”
- Existing gameplay ideas remain: interactive intro, freefall 2D movement, runway turnaround, free-drive vehicle scene, constant combat, boss storm arena, floor-collapse phase.

## Test
Run inside this folder:

    npx serve . -l 8080

Then open:

    http://localhost:8080

Because Phaser 3.90 is loaded from cdnjs and the song is streamed from Wix, an internet connection is required for this version.

## Controls
- Arrow Keys / WASD — move
- Up / W — jump / cutscene action on ground scenes
- Space — fire
- Shift — sonic burst
- P — pause

## Repository
Replace the previous `playable/return-of-the-aviator/` folder with this folder after testing.
