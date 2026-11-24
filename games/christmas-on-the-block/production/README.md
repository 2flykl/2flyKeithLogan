# The Lantern Quarter — November 8, 2026

This production pass brings the opening bench encounter into a painted Christmas storybook direction. New facade artwork also replaces distant house silhouettes so the opening vista is consistent. It does not claim every later encounter has received the same prop pass.

## Asset provenance and generation briefs

Three transparent raster sheets were generated specifically during this art-production session. These are project-generated assets, not an externally sourced licensed stock pack. Existing character, glove, impact and soundtrack sources were retained from the project. No additional rights to existing music or artwork are asserted.

- **houses.png:** Two separate, fully visible Victorian houses, cranberry and evergreen, real alpha background; detailed painted wood grain, carved porches, warm amber windows, garlands, lavender snow and cool moonlight; storybook illustration consistent with the user's winter-neighborhood reference. No people, text, labels, sky or rectangular ground backdrop.
- **garden.png:** A padded 2×2 transparent sheet of a carved snowy bench, decorated fir, brass Victorian lantern and snow-covered holly bed; rich material detail and matching warm/cool lighting; full silhouettes separated for independent extraction.
- **details.png:** A padded 2×2 transparent sheet of decorated brick cover, an organic bare snowy oak, a low snow drift and a cluster of wrapped gifts; painted storybook detail with matching light direction, no people or labels.

These are recorded production briefs, not a claim that raster sources are SVG vectors. The renderer preserves each crop's native aspect ratio. `atlas.json` holds the exact crop rectangles; original sheets remain intact. Runtime crops are cached canvases with small-resolution variants for distant objects.

## Rendering / gameplay

The engine is custom Canvas 2D: world positions project through a perspective camera and sprites are sorted by distance. Existing Three.js files are unused. Materials and illumination are painted into the sprites, with runtime contact shadows and depth haze. This is not a conversion to a fully 3D environment.

The opening bench is 2.3 world units wide. Its cover-impact profile matches its top. Sightline pruning recognizes the new trees, lamps and facades. The four opening opponents remain human characters from the existing cast, with their original handedness and damage rules.

Existing `hands.png` is now used as 12 cached animation cells, with release/transfer/scoop timing driven by the original gameplay cycle. Existing `effects.png` supplies four impact-puff frames. Foreground hand scale is capped by screen height to keep the throwing area clear in landscape phone layouts.

## Verification and limitations

- `node scripts/test-game.cjs`: gameplay, weather, production atlas and opening cover assertions pass.
- Opening scene, successful hit, desktop screenshot and portrait/landscape layout checks performed in the cloud browser.
- Matched camera screenshots: `../evidence/before.jpg` and `../evidence/after.jpg`; compare at `../art-review.html`.
- After sprite mip caching and bounding large contact shadows, sampled paused-scene render work was about 8 ms average / 24 ms p95 at 1363×936 and device pixel ratio 1. The browser throttles animation scheduling, so these are render-cost measurements, not verified sustained FPS. Target remains 60 FPS.
- Physical mobile GPU, thermal and touch-device performance testing remains. Later scene props and broader character-animation production remain outside this representative-scene pass.
