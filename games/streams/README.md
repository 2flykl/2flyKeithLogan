# Streams — Cinematic Game Engine V1

This is a standalone browser game built from the six uploaded Streams asset sheets.

## Features

- Player enters from the top of the frame on a moving media platform
- Guided 15-second onboarding period
- Low difficulty during onboarding
- Gradually increasing river current and platform instability
- Sparse pennies and attention orbs
- Blue attention orbs use white X symbols rather than Facebook branding
- Character animation states: idle, run, jump, and land
- Media-object platforms cropped from the modular asset sheet
- Layered water textures, stream flow, foam, reflections, particles, and vignette
- Pennies versus attention scoring
- Attention-driven head-size penalty
- Stage finish at the upstream end
- Direct and iframe-safe Exit behavior

## Install

Replace the contents of:

`games/streams/`

with everything inside this package.

Expected structure:

- index.html
- css/game.css
- js/game.js
- assets/

Commit message:

`Add cinematic Streams game engine`

Push to GitHub and wait for GitHub Pages to finish deploying.

## Important production note

The uploaded sheets are presentation posters rather than true transparent production atlases. This engine crops and processes them into usable prototype assets. The next visual-quality improvement would come from exporting the character frames and major platforms as separate full-resolution transparent PNG files.
