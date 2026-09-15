# I Was Away — Release Environment v10.6 Alpha Preserve

This build focuses on cutout confidence.

## What changed
- Preserved the existing alpha channel for character, boomerang, and gameplay sprites.
- Stopped any white/gray color-key style removal on the character sheets.
- Added a CUTOUT_QA folder with visual review sheets and an alpha audit report.
- Applied a light alpha-edge cleanup pass to environment prop PNGs to reduce fringe.

## Why this matters
The corrected workflow assumes that if a PNG already contains real transparency, the pipeline should preserve that transparency instead of trying to cut it out again. That prevents pale denim, white shoe accents, and other light details from being mistaken for background.

## Launch
Use START_I_WAS_AWAY_TEST.bat or local_server.ps1, then open the local URL in a browser.
