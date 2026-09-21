# Sky HUD and timing challenge update

The interaction HUD and post-catch reflection panel now sit above the character, in the sky. Both meters use labeled, high-contrast sections: bad 10%, good 20%, two separated trick sections of 5% each, and regular 60%. Positions shuffle per round and remain fixed while playing. Throw zones affect spin quality; catch zones classify the committed input. Red catch timing misses, regular/good catch timing succeeds when positioned correctly, and trick timing earns a perfect return with an overhead catch pose.

The catch sweep runs over the final 22% of flight. There is one catch commitment per flight. Reach the ring before committing. The return target now offsets sideways and in depth; catch radius is 0.48 world units. W/S or up/down moves toward/away from the lake, A/D or left/right moves sideways. Four touch buttons provide equivalent control. Depth is constrained to -5.3 through -3.5, keeping movement close to the planted stage. Diagonal speed is normalized. The trajectory lands at the full two-axis target. The ring scales with projection and shows distance/alignment.

QA: 31 unit tests passed, including zone coverage, bad timing, depth misses, bounded movement and continuous flight. Desktop: one miss and five catches, end/replay, pause, gallery and orbit passed. Mobile: touch throw, movement on both axes, catch, small reflection/gallery and landscape reset passed. Runtime and missing-asset errors: zero in those runs. Original art and audio retained.

---
# September 17 presentation and variety update

- Photographer raises his camera during charging, shoots while waiting and throughout flight, and holds the shooting pose after a catch. Standing/crouching/kneeling compositions rotate. Missing animated viewing angles now show the existing unmirrored shooting profile during active photography instead of silently reverting to a static standing pose. This is a presentation fallback, not newly generated eight-direction animation.
- In the six-round desktop test, 860 of 959 visible flight samples (89.7%) showed an animated shooting pose. All three catch styles appeared. Miss, five catches, pause, gallery, replay and orbit passed.
- Rotation now remembers used options, so catch styles cycle through all choices before reuse. Catch photos draw from the entire approved catch pool, sorted by action, with at least one contact/secured/recovery photograph. Readiness and post-miss recovery also vary. The same 25 supplied photos remain; none were replaced or mirrored.
- Ground geometry is smoother, the stage feathers into the original panorama, and fine grass/soil texture replaces the conspicuous facets and broad painted patches. Small background stones and wind-driven grass add depth with two extra draw calls. Horizon, lake, sky, sunlight and photo assets are unchanged.
- 28 unit tests passed. Mobile touch round, small-screen layouts and GPU-safe SwiftShader launch passed without runtime or missing-asset errors. Detail density is reduced on mobile/GPU-safe and wind animation respects reduced motion.
- Use the new Presentation-Update ZIP. The older Documents Photographer-Preview folder is still the September 14 build and can show the old three-photo library.

---
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



