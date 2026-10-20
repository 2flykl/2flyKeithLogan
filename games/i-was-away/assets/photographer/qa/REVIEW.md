# Photographer directional runtime review

2026-10-20. Eight new direction-specific photographic cutout atlases were generated with the built-in image tool from this project's original photographer turnaround and front-right sheet. The exact prompts and intact generated masters are retained in `../source-atlases/`. No outside character imagery or horizontal mirroring was used. The original two WebP files are unchanged.

## What was inspected

- All eight generated master sheets were visually inspected. The views progress from frontal through screen-right profile, rear, screen-left profile, and back to the original three-quarter view.
- `all-directions-contact.jpg` shows the actual runtime idle, standing-shoot, crouch, and kneel cells at all eight angles on a solid backing. Individual contact sheets show every packed slot and explicitly mark the rejected source cells.
- The eight angles preserve the reference's dark shirt, jeans, boots, short dreadlocks, beard, DSLR, and photography backpack. They remain photographic rather than switching to a cartoon or a 3D mannequin.
- Crops are centered and ground-aligned. Crouches and kneels stay lower in their cell rather than expanding to standing height. Narrow transparent gutters prevent neighboring-cell bleed.
- Six source cells were rejected: front-left walk 5 and front-right walk 7 lost the camera; back/rear-right/right alternate standing-shoot 11 clipped shoes; front-right standing-reset 15 clipped the lower legs. None are referenced by a runtime clip.

## Runtime changes

- All eight requested directions have their own texture and compact clip metadata. A requested angle never borrows a front-right action pose.
- Camera raise/lower, crouch, and kneel transitions retain the existing controller durations while selecting the new reviewed keyframes.
- Standing reset uses the correct standing camera-lowering sequence. Front-right walking uses its three camera-bearing drawings. The original flawed sheet is preserved as source but is no longer loaded.
- If directional metadata is missing, the renderer uses the correct standing turnaround angle as a truthful fallback.

## Measured validation

- Eight 640 × 896 RGBA runtime sheets; 160 × 224 cells; ground pivot 80, 212.
- 1,217,010 compressed bytes combined (about 1.16 MiB).
- 18,350,080 decoded bytes combined (17.5 MiB), 7 MiB more than the old single 1536 × 1792 animated texture. The turnaround remains 3 MiB in both versions.
- 122 accepted source cells; six excluded cells. Actual decoded WebP alpha was checked for nonempty accepted cells, empty rejected cells, and transparent perimeters. Full output is in `pixel-validation.json`.
- Five dedicated Node tests cover all directions, hashes, every state at many timeline positions, timing equivalence, missing-direction behavior, and ground pivots. Run `node --test assets/photographer/qa/photographer-atlas.test.mjs` from the game directory.
- The existing game test suite and `npm run check:rc` also pass after integration.

## Honest limits

These are compact keyframe animations, not dense hand-animated production cycles. Idle/ready hold a single drawing. Walks use three or four drawings; camera raises/lowering use three; crouch and kneel loops use two. Back, rear-right, and right hold a single standing-shoot drawing after their raise transition. Small hand, gear, and shirt-detail variations remain in the generated artwork. Full WebGL gameplay, desktop/mobile camera transitions, and final creator art approval are still required; those are not claimed by this asset review.

Exclude `source-atlases/` and `qa/` from the runtime build. They retain approximately 13 MiB of generation provenance and visual evidence and are not requested by the game.
