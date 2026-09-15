# I Was Away — Firefly Fresh Build v1

This build removes the previous character sprite folders and legacy character builder. Runtime character art now comes only from the supplied `IWA_FireflyAssets.zip` after frame extraction, cleanup, normalization, and direction mapping.

## Direction order used
Top row: front, front-right, right, back-right
Bottom row: back, back-left, left, front-left

## Runtime state mapping
- `idle_hold` — Catch Secured Hold sheet; used as ready/neutral hold state.
- `windup_hold` — low two-hand wind-up sheet; boomerang remains baked into the character.
- `release_empty` — Release / Follow-Through Empty Hand sheet; activates only after projectile launch.
- `catch_ready_empty` — Catch Ready Empty Hand sheet.
- `catch_contact_empty` — Catch Contact Empty Hand sheet.
- `catch_contact_hold` — Catch Contact / Boomerang Reaching Hands sheet; used only at terminal contact.
- `catch_chest_hold` — normal/automatic catch result.
- `catch_onehand_hold` — nice catch result.
- `catch_trick_hold` — trick catch result.
- `catch_overhead_hold` — preserved as an alternate catch result state.
- `miss_empty` — drop/outside-circle reaction.

## Boomerang ownership rule
The character sprite contains the boomerang OR the live projectile is visible, never both.
- Ready/wind-up: baked-in held boomerang, live projectile hidden.
- Launch/flight/return: empty-hand character, live projectile visible.
- Final contact: live projectile hides as the contact-with-boomerang sprite takes ownership.
- Secured catch: held-boomerang result sprite.
- Miss/drop: empty-hand reaction and live boomerang remains visible.

## Boomerang sheets
Three unique 16-frame sheets are extracted and used as:
- spin cycle
- bank/turn cycle
- return approach cycle

## Guide
No separate new guide/instructor character pack was supplied. To avoid retaining any old guide character asset, the tutorial guide temporarily reuses the new Firefly character system. A dedicated guide sheet can be swapped in later without touching gameplay logic.

## Asset cleanup performed
- Removed all previous `sprites/` and `sprites_v7/` assets.
- Removed the legacy procedural human builder.
- Removed the old 3D wooden boomerang mesh.
- Deduplicated duplicate Firefly source sheets from runtime use.
- Split all 8-view character sheets into individual directional textures.
- Split all 16-view boomerang sheets into individual flight textures.
- Normalized character frame dimensions and foot alignment.
- Removed small crop artifacts from empty-hand sheets.

## Local test
Run `START_I_WAS_AWAY_TEST.bat` on Windows. It launches a local server on a fresh random port and opens the browser automatically.

Note: Three.js is still loaded from the same jsDelivr CDN dependency used by the working base build, so an internet connection is required for that library during local testing.
