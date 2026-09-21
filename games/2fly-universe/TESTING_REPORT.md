# Release-candidate testing report

Tested locally in Chrome with bundled Playwright. This is browser evidence, not a claim that every device or every hosted game's full gameplay has been certified.

| Check | Result |
|---|---|
| Entry and Three.js scene | PASS — Enter launches; original GLSL failures repaired |
| Windows launcher server | PASS — complete browser regression ran through the PowerShell server on 127.0.0.1:8101 |
| Era navigation | PASS — all 7 timeline buttons selected and traveled |
| Project navigation | PASS — all 7 worlds opened, with all 23 child entries accounted for |
| Return / reset / Escape | PASS — media close, planet return, reset, placement cancellation; Escape remains inside the universe |
| Audio | PASS — actual playback, readyState 4 and advancing time on desktop, portrait, landscape; mute/unmute labels and state checked |
| Video | PASS — actual playback, readyState 4 and advancing currentTime |
| Hosted game integration | PASS — Thru the Fire iframe loaded its expected title; direct-open link matched; Return restored universe |
| Destination endpoint checks | PASS — all 7 resolved hosted game pages returned HTTP 200; all supplied Wix media and poster endpoints returned 200 |
| Custom tour | PASS — add two destinations, launch, next stop, finish |
| Keyboard | PASS — Navigator entry focused and activated with Enter; Escape dismissed media |
| Touch / reduced motion | PASS — mobile tap navigation, media entry/exit, reduced-motion preference active |
| Visitor star | PASS — placement, saved record, persistence after reload, card download, overlay close |
| Local assets | PASS — no failed local requests during tested flows; asset bytes preserved |
| Console | PASS — no page errors or blocking console errors in the final tested universe flows |
| Responsive | PASS — 1440×900, 390×844, 844×390; no horizontal document overflow or out-of-bounds visible buttons in the checked return views |
| Source syntax | PASS — all 33 application JavaScript modules checked with Node |
| Preservation | PASS — no original files removed; canonical data and all original assets unchanged |

## Performance observation

The measured desktop atlas sample was approximately 49 animation frames/second in automated headless Chrome at 1440×900, device pixel ratio 1, over 2.5 seconds. This is a short local observation, not a guaranteed minimum. Particle counts and pixel ratios are bounded; weaker devices may run more slowly. The renderer's reported draw-call counter is the last postprocessing pass only and must not be interpreted as total scene draw cost.

## Scope and remaining content limitations

- Rendering assets and application code are bundled. Original Wix media and GitHub Pages games require internet; they are not offline game copies.
- All seven game endpoint URLs were checked. Thru the Fire was loaded inside the universe; complete playthroughs of the separate hosted games are outside this remaster's testing scope.
- All 23 source child records are marked live: 5 audio, 6 video, 7 playable, and 5 descriptive archives. The original archive descriptions are carried through into the player. Earlier/future eras retain their original landscapes and metadata; they do not have additional project media assigned. Future `awaiting-source` entries have an explicit archive-expanding fallback.
- Personal stars and custom tours remain browser-local. There is no shared backend; return links for personal stars are meaningful only in the same browser/origin. Exported PNG cards can be shared.
- Direct `file://` loading is intentionally not used for ES modules/JSON. `index.html` displays launcher instructions in that mode. Extract the ZIP and run `START_2FLY_UNIVERSE.bat`.
- No production site was changed or deployed. The original project folder remains untouched.

## Evidence

`QA/desktop-mobile.json`, `QA/full-regression.json`, `QA/touch-stars.json`, `QA/media-links.json`, `QA/game-links.json`, and `QA/preservation.json` contain measured results. PNGs show the entrance, atlas, portrait focus, and landscape UI. Automated tests used isolated browser profiles; QA visitor stars were not written into the user's browser storage.

The original main-domain game-path 404 results are retained in `QA/media-links.json` as audit evidence; `QA/game-links.json` records the corrected GitHub Pages endpoints, all HTTP 200.
