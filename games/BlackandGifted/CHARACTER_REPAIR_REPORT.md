# BLACK & GIFTED — Character repair test build

## Changes
- Preserved the confirmed BlackandGifted build and all 315 original asset files. A complete untouched 344-file backup was verified with SHA-256 before edits.
- Cleaned 297 existing hero frames into assets/character-repair-v1/heroes. Removed detached sheet residue and transparent-pixel colour contamination; original PNGs remain unchanged. The audit records each original hash, output bounds and removed pixels.
- Replaced per-state maximum bounds with standing-reference jump sizing. Male scepter jump no longer derives its scale from stray pixels or a blanket 12% multiplier. Torso anchors and foot baselines stabilize frame placement; crouches retain their intended reduced height.
- Selected separate rising, falling and landing poses. Walking/running cadence follows distance travelled; slow movement uses walking instead of a forced run animation. Removed the standing stop pose from the male scepter run loop.
- Added 16 new young-character run frames from one built-in image-generation sheet, using the original male/female silhouettes as references. Young running no longer reuses walking. Source sheet and generation instructions are included under assets/character-repair-v1/sources.
- Extracted 30 whole panther silhouettes from the approved two sheets. The game uses seated, rising, launch and running poses without rectangular grid clipping through tails, crowns or paws. Removed neutral white fringe at transparent edges.
- Preserved the first-wall falling-video cue, first-attempt worthy-wall breakthrough, paired Past/Present/Future gallery, soundtrack, physics and scene progression. Both HTML entry points are byte-identical.

## Validation
123 passing automated browser checks: full progression 62; extended desktop/mobile/offline/media 38; prior refinements 13; targeted animation/scale checks 10. No browser errors or missing resources in the full progression and motion suites. Screenshots/contact sheets were inspected for scale, cutouts and complete panthers. The package is hash-verified and its extracted alternate entry is separately launched before delivery.

Browser checks used Microsoft Edge through Playwright, including touch emulation and portrait/landscape sizes. Physical phones and subjective animation feel still need the director's playtest; automated success does not certify perfect anatomy or animation artistry. Existing adult artwork was repaired and resequenced, not fully redrawn.

## Play
Extract the entire ZIP. Open BlackandGifted/START_BLACK_AND_GIFTED.bat or BLACK_AND_GIFTED_DEMO.html. Keep the assets folder alongside the HTML. Keyboard: arrows/A/D, Space to jump, Q to switch character. Touch controls are included.

## Rebuild the repaired assets
Requires Python with Pillow and numpy. From the game directory:
1. python tools/repair_characters.py
2. python tools/build_young_run.py
The second command registers the saved generated run sheet again; it does not call an AI service. Source art remains untouched. Browser QA scripts are in qa/ and require Node, Playwright, sharp and Edge. Set BG_GAME_URL to the served game URL.

## Usage and scope
Displayed account usage: 4% at start, 6% at the final checkpoint (a 2-percentage-point increase, below the requested 17-point ceiling). Account readings are rounded and shared; this is the observed difference, not exact per-task billing. No reset credit, purchase, deployment or push was performed.
