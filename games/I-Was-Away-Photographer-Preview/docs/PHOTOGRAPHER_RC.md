# Photographer integration — work saved 14 September 2026

Status: playable integration preview; final RC blocked on image-generation quota. The tool returned `usage_limit_reached` with a reset of 2026-09-14 18:43:43 UTC (2:43:43 p.m. Eastern). No API fallback or Firefly handoff was used. The original Documents project and previous finished ZIP remain unchanged.

## Implemented and tested

- Removed the duplicate/instructor character and its runtime role completely. The replacement uses the supplied photographer identity, a new animation controller and generated photographic sprites.
- Eight standing directions plus one animated front-right direction. The renderer chooses a real directional turnaround view when the corresponding animated sheet is unavailable; it never mirrors a sprite. This fallback is temporary and is not full animation coverage.
- Dedicated clip clock, raising/lowering, standing shooting, crouch/kneel transitions, recovery, target-facing and between-throw repositioning. Camera and backpack remain integrated in the sprite. The photographer stays still during flight and chooses a location clear of the catch area between throws.
- Automatic release, apex and successful-catch contact sheets. Release lasts 1.65s with reveals at 0/.24/.52s; apex lasts 2.65s with reveals at 0/.48/.98s; catch lasts 2.15s with reveals at 0/.32/.72s. Each reveal produces a shutter click. Separate layouts, pacing and dynamic text distinguish the phases.
- Flight simulation freezes during bursts, pause, gallery and reflection. The catch window is never consumed by a cutaway. One subtle shutter during the return does not interrupt controls.
- Post-catch best-shot selection, gallery, favorite toggles and throw-again flow. Favorites persist locally by media variant. Replay clears session photos and trigger locks; it keeps favorites. The ending also opens the session reel.
- Keyboard focus handling, gallery focus containment, inert background controls, reduced-motion presentation, touch controls and compact layouts.

## Available artwork and precise remaining work

The requested final library is 55 state/animation cells per direction × 8 directions, plus any atlas padding. The first generated 8 × 7 sheet contains 56 cells at 1254 × 1254 pixels. Its modest per-character source resolution is suitable for integration testing but deserves a larger replacement for close inspection. The generated checkerboard was opaque and was removed locally. Unequal row spacing required component-based extraction rather than equal rectangular slicing. All exported frames use the same standing scale and a foot baseline at y=244 in 192 × 256 tiles; crouches are not enlarged to standing height.

Remaining art requirements:

1. Generate the seven missing animated directions: front, front-left, left, rear-left, back, rear-right and right. Keep lettering, camera grip and asymmetric equipment correct without mirroring.
2. Correct the first direction's walk cycle: several original generated cells lose the camera. Runtime currently reuses the valid camera-present cells; that is not the requested final eight distinct phases.
3. Replace standing tracking and reaction/reset poses: the generator continued kneeling into the final row. Runtime currently uses ready frames for reset and torso orientation for tracking; it does not pretend the kneeling cells are standing.
4. Recheck turnaround gear handedness, face, hair, original shirt graphic, alpha edges and transitions between standing turnaround and animated poses. Expand only after the first complete angle passes this review.
5. Generate six additional distinct photographs: two release, two apex and two catch. The current library contains three unique proof photographs, each presented in three editorial crops to test the nine reveal slots. Crops are not separate photographs, and the repeated proof images are not a finished reel library.
6. Replace media paths in `assets/photo-reel/library.json`, complete and review the photographer manifest, then run full regression and visual QA. Only after that should the final RC be packaged.

`npm run check:rc` intentionally fails until these asset requirements and final art review are complete. It prevents a functioning interface from being mistaken for finished RC artwork.

## Organization and tools

- `assets/photographer/references/identity.png`: original supplied reference.
- `assets/photographer/masters/`: untouched generated sheets, source map and generation prompts/error record.
- `assets/photographer/front-right.webp`: cleaned animation atlas; `turnaround.webp`: eight standing directions.
- `assets/photographer/manifest.json`: state ranges, pivots, source dimensions, coverage and corrections.
- `tools/pack_photographer.py`: local extraction/packing using Pillow, NumPy, SciPy and OpenCV. Install the packages listed in `tools/requirements-assets.txt`; run from any directory. Review detected components after every newly generated sheet. The current thresholds and grouping are tailored to this first sheet and must be validated for new inputs.
- `assets/photo-reel/{release,apex,catch}/`: optimized WebP runtime images. The original proof masters and visual bible remain under `assets/photo-reel/proof/`.
- `src/photographer.js`, `src/photo-reel.js`, `photo-reel.css`: new runtime systems.
- `docs/photographer-qa/`: screenshots and browser results. Image generation used the built-in tool; browser QA used installed Chrome through Playwright. No runtime generation, CDN or network service is required.

## Validation

18 model/behavior tests passed, including all ten original gameplay tests. Desktop browser QA passed a deliberate miss and five subsequent successful catches through all chapters, with release/apex/catch bursts, pause during a burst, frozen flight at apex, favorites, gallery, ending, replay and 360 viewing. Phone-emulated Chrome passed actual touch charge/movement/catch, reduced-motion presentation, all bursts, gallery, favorites and reset at 390 × 844, 320 × 568 and 844 × 390. Both completed browser suites reported zero runtime/console errors and zero failed asset requests. Physical phone hardware remains untested.

Estimated texture allocation is 235 MiB for desktop and 107 MiB for phone startup with the current preview assets, excluding driver/render-buffer/CPU image overhead. The photographer adds approximately 14 MiB using non-mipmapped atlases. Resting scene rendering uses five draw calls; other directional textures upload on first use. Additional directions will require a new texture-budget review, ideally with demand loading and smaller phone atlases.

The integration preview is saved separately; no final RC claim, production deployment or original-folder replacement was made.
