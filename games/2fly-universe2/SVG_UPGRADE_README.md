# 2Fly Universe — SVG Crispness Upgrade

This is a **drop-in upgrade patch** for the current working `games/2fly-universe` folder.

## What changed
- Graphic/iconic objects now use dedicated SVG masters at a 2048×2048 intrinsic render size.
- Painterly/organic planets remain raster intentionally.
- `decorated-object.js` and its TypeScript source now route controller/playable, media moons, satellites, and station objects to SVG assets.
- Texture filtering uses mipmaps, linear filtering, anisotropy, and alpha handling for cleaner WebGL presentation.
- Glow scale/opacity was reduced slightly so crisp edges are not washed out by the aura.

## Install
Merge the included `2fly-universe` folder into your existing:

`games/2fly-universe`

Allow these files to overwrite the existing versions. **Do not delete the current folder first** because the painterly raster assets and the rest of the Universe runtime are intentionally not duplicated in this patch.

## SVG categories
Vectorized:
- Controller / playable planets
- Space station / hub
- Song / lyrics / stem moons
- Video / photo / behind-the-scenes / artwork / game-asset moons
- Streaming / YouTube / merch / social / booking / collaboration / press satellites

Intentionally retained as raster:
- Thru the Fire main world
- Africa main world
- Streams main world
- Aviator / Away / culture-style painterly worlds

## Verification
Open `verify-svg-assets.html` after merging to confirm all 17 SVG files resolve.
The normal Universe page continues using the existing V23 runtime and navigation; this patch changes object presentation only.
