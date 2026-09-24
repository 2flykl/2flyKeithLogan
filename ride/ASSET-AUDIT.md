# Adobe asset audit — RC1

Archive: `Adobe_2026-09-24.zip`. All 22 image files were inspected. There are no GLB/glTF models in this archive. All 22 PNGs are RGB, with no alpha channel. Most contain a painted checkerboard; sheet 13 has a black backdrop. These patterns are image pixels, not transparency.

Five selected sheets were processed with the built-in image-generation tool for background extraction (not Firefly, not a CLI/API fallback). The resulting files have real alpha ranges 0–255. Some regenerated edge/detail differences remain; cutout materials use an alpha threshold to avoid colored edge fringes. Original files remain unchanged in the source archive.

| ID | Contents | Decision |
|---|---|---|
| 00 | Surface assortment | Reference; newer surface sheet 20 selected |
| 01 | Intersection hardware | Reference; signals would imply traffic rules beyond this route |
| 02 | Lakeshore details | USED: alpha extraction; dock, picnic table, boat, reeds, driftwood |
| 03 | Modern cars, three-quarter views | Reference; rear views fit the moving traffic camera better |
| 04 | Eight residential houses | Reference; individual houses are smaller than sheet 17 |
| 05 | Rear vehicle assortment | Reference; sheet 14 selected for this RC |
| 06 | Material assortment | Reference; higher-density patches from sheet 20 selected |
| 07 | Modern vehicle assortment | Reference; three-quarter perspectives reserved for future traffic views |
| 08 | Street signs and park furniture | Reference; important sign lettering stays sharp vector/canvas artwork |
| 09 | Quiet signs of life | USED: parked sedan, bins, shrubs and shelter; clean sheet retained with bike and fence |
| 10 | Mixed vehicle assortment | Reference; the rear-view cars are prioritized |
| 11 | Brake and vehicle glow effects | Reference; procedural lamps respond to actual braking and do not carry baked checkerboards |
| 12 | Street signage and utilities | Reference; readable STOP and route signage remain generated geometry/canvas |
| 13 | Tree, storefront and bridge variation | Reference; black background, low per-object resolution |
| 14 | Six rear-view vehicles | USED: extracted alpha, three vehicle types on solid car bodies; all six crop definitions retained |
| 15 | Roadside decor | Reference; avoided adding unneeded street clutter |
| 16 | Bridge module kit | DESIGN REFERENCE: rebuilt bridge girders and supports as actual 3D geometry |
| 17 | Four residential houses | USED: extracted alpha; facade/side materials on solid houses and distant complete house cutouts |
| 18 | Lake water | USED: clean upper-left water patch; soft motion and sun glints rendered separately |
| 19 | Tree, building, bridge and rocks | USED: tree and rock cutouts; bridge/building retained as reference |
| 20 | Grass, road and street surfaces | USED: lawn, roadside verge, asphalt and sidewalk patches |
| 21 | Sunlight and lens effects | Reference; procedural sky and changing cabin daylight preserve clean rendering |

## Runtime assets

`assets/adobe/sheet-17.png`, `sheet-14.png`, `sheet-19.png`, `sheet-2.png`, and `sheet-9.png` are the five transparent sheets. `surfaces.png` and `water.png` are unchanged supplied sheets. `adobe-assets.js` selects exact pixel regions; surface patches are extracted into browser textures before mipmap generation so sheet borders cannot bleed into the scenery.

The source images are 1408×768 or 1841×560; individual objects have only a few hundred pixels of source detail. They improve the scene, but they are not equivalent to photographed high-resolution 3D scans. Nearby houses, cars and bridge members use real geometry; plants, parked objects and distant house details use photographic cutouts. Rendering remains a Youngstown-inspired realtime scene.

Replacement workflow: keep the named runtime files or update the filenames and crop rectangles in `adobe-assets.js`. Supply transparent PNGs for cutouts. Supply GLB models for a future upgrade to fully modeled trees, props and vehicles. Track paths/art remain in `media.js`.

## Background-extraction prompt

Edit this exact supplied game asset sheet: replace the entire fake checkerboard with genuine transparent alpha. Preserve the existing objects, photographic details, colors, arrangement, shapes and spacing. Make background and interior gaps transparent as appropriate. No redesign, new objects, labels, solid backdrop or new shadows. Output transparent PNG at the source aspect ratio.

The houses request explicitly retained all four houses and porch gaps; the props request named the existing sedan, bicycle, bins, shrubs, fence and shelter. The final sheets are included alongside the application.
