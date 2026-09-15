# Photo reel and catch-state integration — September 15, 2026

Continues the patched photographer build. Preserves the orbit camera, planted ground stage, enlarged catch target and throw meter, boomerang physics, audio, photographer, and GPU-safe launcher.

## Imported assets

- 25 individual WebP photographs from IWAphotoreelNEW.zip, trimmed inside sheet gutters. These are distinct source panels, not multiple crops of the old proofs.
- Organized under photo-reel/release, apex, macro and catch; library.json records categories, original sheet/cell, crop bounds and dimensions.
- 32 transparent directional character views from the four supplied state sheets, stored individually under states/tracking, jump_catch, one_hand and catch_contact. A 2048×1536 runtime atlas adds 12 MiB of decoded GPU texture storage without mipmaps.
- 26 photo candidates excluded: left-hand-only catches, inconsistent accessories/poses, redundant idle images or unrelated lake/geography. Source sheets remain untouched. See import-report.json for the candidate inventory.
- No images were mirrored. The one-hand sheet repeats some directions; unsupported directions fall back to the existing correct directional character states.

## Gameplay and presentation

The release burst selects preparation → release → follow-through/release. Catch selects readiness/tracking → two-hand contact → secured/recovery. Apex selects three distinct macro/flight photographs. Selection remains stable for each burst. Category histories prevent the central release/contact photograph and catch style from repeating immediately. Apex retains a two-image cooldown; with five approved apex images and three per burst, some overlap between successive bursts is unavoidable. Every burst contains three different images.

All 25 small photographs are decoded during the existing loading screen, avoiding requests/decoding at shutter time. Original framing is preserved with contain sizing and per-image aspect ratios. Phone portrait uses one large image above two supporting images; desktop and landscape retain three columns. Existing shutter rhythm, pause behavior, reduced-motion support and gallery are preserved.

Gameplay alternates original readiness with new empty-hand tracking. Successful catches rotate among one-hand secured, two-hand contact and overhead jump catch. Overhead recovery steps through a brief jump and lands into a secured stance, keeping the caught boomerang present. The sheet's held boomerang never appears during flight. Existing empty-hand preparation remains in use; the supplied overhead sheet depicts a secured catch, not empty-hand preparation.

## Verified

- 25 unit tests passed: gameplay, timing, pause, reset, asset paths, directional metadata and recent-history selection.
- Two full desktop playthroughs: each included a miss and five catches, ending/replay, gallery/favorites, pause/resume and 360° viewing.
- Browser telemetry observed tracking, one_hand, catch_contact and jump_catch in real gameplay.
- Touch charge, movement, successful catch and all three bursts passed at 390×844; gallery/reflection/reset checked at 320×568 and landscape 844×390.
- No browser runtime errors or missing asset responses in those runs.
- GPU-safe test confirmed SwiftShader software rendering, 864×540 render buffer and 4K panorama; release burst returned to flight normally.

## Remaining source limitations

Source panels are approximately 500px across; enlarging them cannot recover missing detail. Some supplied photo artwork/accessory details vary subtly. The wider photographer animation coverage remains the previous build's unfinished work; this pass does not claim to complete all eight photographer animation directions. The completeness checker continues to report those existing photographer blockers.

## Play

Extract the entire ZIP. Run PLAY_GPU_SAFE.bat for software rendering or PLAY.cmd for normal rendering. Node.js 20+ and Chrome or Edge are required. The launcher selects a free local port to avoid old-preview collisions.

