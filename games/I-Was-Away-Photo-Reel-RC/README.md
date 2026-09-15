## September 15 photo-reel RC upgrade

Includes 25 supplied photo-panel cuts, 32 cleaned catch-state views, category-based variation, and the GPU-safe launcher. See [integration and QA notes](docs/PHOTO_REEL_RC_UPGRADE.md). Extract all files and run PLAY_GPU_SAFE.bat or PLAY.cmd.

# I Was Away — The Return

A short, playable moment about letting go and finding your way back, documented by a photographer on a real hill above the lake. Five successful returns carry you through three changes in the wind.

**Current working version: photographer integration preview, not the final RC.** The live systems are implemented and tested, but image-generation quota blocked the remaining artwork. See `docs/PHOTOGRAPHER_RC.md` for exact coverage and remaining work. The previous finished playable ZIP is preserved separately.

## Play

Run **PLAY.cmd** to open the game automatically. If the normal launcher gives a blank screen or graphics error, run **PLAY_GPU_SAFE.bat** instead. Both select a free local port so they cannot accidentally reuse an older preview on port 4188. Keep the launcher window open while playing. Node.js 20 or newer and Chrome or Edge are required. Startup errors remain visible and are recorded in `launcher.log`.

GPU-safe mode uses Chromium's CPU-based SwiftShader renderer, disables antialiasing, selects the smaller panorama and limits the internal scene resolution to 960 × 540 (the interface still fills the window). It can run more slowly but avoids relying on the normal graphics driver. The launcher uses a separate temporary browser profile, preserving existing browser settings; use that game window for the local game. Browser sandboxing is not disabled. The software-rendering flags follow [Chromium's SwiftShader documentation](https://chromium.googlesource.com/chromium/src/+/HEAD/docs/gpu/swiftshader.md). No internet connection, account, CDN or API key is required to play.

Alternatively, run `npm start` in this folder. If the port is occupied, set `PORT` to another available port before starting. Any ordinary static web server can serve the game.

| Action | Desktop | Phone / tablet |
|---|---|---|
| Charge and throw | Hold Space; release in the lit band | Hold the action button; lift your finger |
| Catch | Press Space when “Now” appears | Tap Catch |
| Step toward the return | A / D or left / right arrows | Left / right touch buttons |
| Look around | Drag; Q / E also turn | Drag the scene |
| Zoom | Mouse wheel | Use the wider default phone framing |
| Recenter | R or Recenter | Recenter |
| Pause | Escape or pause button | Pause button |
| Sound | M or Sound | Sound button |
| Explore | V or Look around | Look around |

A catch requires both timing and proximity to the return marker. Releasing between 63% and 83% produces a dependable throw. The final 12% of the flight is the catch window; the last 4.2% awards a perfect return. Missing never blocks progress. Pause freezes the flight. Replay begins a new five-return session.

## Build

`npm test` runs the deterministic gameplay tests. `npm run build` creates `dist/`, ready for a static host. There is no dependency installation step: Three.js is bundled in `vendor/`.

The portable ZIP contains the playable web build, launcher, and documentation. The source project additionally contains individual cleaned frames, QA evidence, processing instructions, and the original-media archive. A desktop executable was not added: the local browser build already runs on desktop without an engine installation.

## Environment and presentation

The landscape is **Qwantani**, Greg Zaal’s real photographic panorama, from Poly Haven. The untouched 8192 × 4096 tonemapped source is retained. Phone-sized startup selects a 4096 × 2048 derivative. Both cover all 360 degrees; the landscape is never mirrored or tiled.

The sky, distant mountains, lake, vegetation, rocks, and ground are photographic. Their sunlight, water reflections, shadows, and atmospheric perspective are baked into the photograph. This is an LDR photographic presentation, not live HDR lighting or a walkable scan. A camera-centered sphere projects it at effectively infinite distance. The sphere’s geometry is not visible scenery.

The characters are cleaned directional photographic sprites positioned in 3D. The boomerang moves and spins in 3D, with a restrained trail and soft contact-shadow cards. The camera rotates at the photographic capture point rather than traveling through a small image bubble. Downward tilt stops before the capture equipment at the nadir. Camera damping and modest zoom preserve the intended scale. Phones use a narrower lateral staging and gentle reframing to keep both characters visible.

The second character is now the **photographer** from the supplied four-view reference. The previous duplicate character is removed from runtime. A dedicated controller handles camera raising/lowering, shooting, crouching/kneeling and between-throw repositioning. One animated direction and an eight-view standing turnaround are available; the other seven animated directions remain pending generation. Their current standing fallback is explicitly temporary.

Release, apex and successful catch each trigger an automatic three-tile contact sheet with timed shutter sounds and a separate short line beneath the images. Simulation time freezes during each burst, so the player's catch window is preserved. After a successful catch, keep a best shot, open the reel, or throw again. Favorites persist locally; replay clears the current session. The integration preview uses three existing proof photographs with editorial crops, not nine distinct generated photographs.

The supplied song plays quietly beneath filtered wind and brief throw/catch sounds. Visual character breathing is extremely small and respects reduced-motion preferences. The landscape itself remains still photography.

## What changed

- Replaced the mirrored cylindrical background, repeated terrain tiles, primitive ridges, heavy haze layers, and crossed prop cards with the coherent real panorama.
- Replaced the monolithic old game with separate gameplay, rendering, audio, and input modules.
- Recut 88 usable directional/state frames from recovered original sheets. Removed neighbor fragments, repaired the previously destroyed pale-denim transparency by returning to intact sources, defringed edges, and standardized foot pivots.
- Removed translucent pose ghosts, broken boomerang frame fragments, unused legacy animation selections, and large diagnostic/PIP panels.
- Added charge-sensitive flight, crosswind landing offsets, positional catches, perfect timing, three stages, a finish screen, replay, pause, touch controls, and panorama exploration.

The flight is deliberately art-directed, using a banked loop and wind-dependent return displacement. It is not a scientific aerodynamic simulation.

## Files

- `src/game.js`: gameplay state machine and flight model.
- `src/world.js`: photographic world, camera, characters, boomerang.
- `src/audio.js`: song and procedural effects.
- `src/main.js`: controls, accessibility states, UI, pause and lifecycle.
- `src/photographer.js`: photographer behavior, clip timing, recovery and repositioning.
- `src/photo-reel.js`: burst timing, photo reveal, gallery and favorites.
- `assets/photographer/`: generated source sheets, cleaned atlases and coverage manifest.
- `assets/photo-reel/`: compressed media library and separately retained proofs.
- `assets/characters/`: 88 clean PNGs, packed WebP atlas, and per-frame provenance/pivots.
- `assets/environment/`: preserved 8K photograph and optimized 4K derivative.
- `docs/`: discovery notes, QA results, processing workflow, screenshots.
- `SOURCE_ARCHIVE/`: untouched original release ZIP and recovered source sheets in the source project. Excluded from runtime builds and source-control commits.

## Release scope

The working photographer extension has an ending and replay, but final RC asset completion is pending. Run `npm run check:rc` to see the release blockers; a passing gameplay test does not substitute for complete artwork. The panorama cannot supply translational parallax or physical foliage/water simulation. Physical-device Safari/Android QA also remains outstanding. No production website deployment was performed.

See `docs/QA.md` for measured checks and practical limitations, and `ASSET_SOURCES.md` for provenance.


## RC camera + catch-zone patch
- Camera now performs a true full 360° third-person orbit around 2Fly rather than rotating from a fixed point. Drag the world or use Q/E to orbit; R recenters. Mouse wheel adjusts orbit distance/zoom.
- Catch/return target is wider, brighter, animated, and uses an expanded catch radius.
- Return target now avoids spawning directly under 2Fly when the computed throw would otherwise place it there; the target remains physics-influenced and reachable.

