# BLACK & GIFTED — Living Museum revision

## Result

Revised the existing nine-scene game directly in the requested source folder. Preserved its story, silhouette characters, progression, original music, videos, and approved panther artwork. The two HTML entry points are synchronized.

Source: `C:\Users\2flyk\Documents\GitHub\2flyKeithLogan\games\BlackAndGifted_RELEASE_CANDIDATE_1`

Untouched baseline: `C:\Users\2flyk\Documents\Codex\2026-09-15\project-folder-to-analyze-and-modify\work\BlackAndGifted_RELEASE_CANDIDATE_1_UNTOUCHED`

Before editing, all **333 backup files** were checked against the source with SHA-256. After implementation, all **312 original asset files** still matched that baseline. No original art, audio, video, or character image was changed.

## Architecture audit and implementation approach

The baseline is a Canvas 2D game in an immediately invoked JavaScript function. `loadScene` recreates scene-local `S`; `P` holds the persistent player; `PLAYER_BANKS` selects gender/form frames; `physics`, `mountainY`, `runY`, and `faithGround` own movement and terrain. `drawWorld` composes scenes, projections, characters, and overlays. Nine HTML video elements provide the active projection sources. Panther rendering uses the approved sit/run sheets. The camera uses `camX`, `camY`, and `zoom` and hands control to `updateSpectator` during cinematics.

The work retained these authorities. New architecture rendering lives in `museum-presentation.js`; measured sprite bounds live in `character-metrics.js`. Neither module owns collisions or narrative progression.

Work order: verified backup and architecture audit → isolated feature branch → loading/input/render fixes → animation and terrain corrections → museum composition and cinematic polish → browser regression and release packaging.

## Changes

### Stability and controls

- Entry waits for character loading and offers a retry if a frame fails. The baseline allowed play with an invisible hero.
- Video initialization no longer calls `load()` repeatedly while waiting for a frame.
- Fixed an existing negative canvas arc radius in a decorative loop that otherwise threw on every rendered frame.
- Added touch movement/jump controls, character and sound buttons, pause/resume, and safe focus-loss handling.
- Keyboard movement remains available after using the character button. Form controls retain their own keyboard behavior.
- Kept the established 300-unit movement cap, 290-unit mountain cap, gravity, and jump impulse. Added a short jump input buffer and coyote-time allowance.
- Uses a stable 1366×768 logical world fitted into the viewport, so rotating or resizing a device does not relocate walls and terrain. Portrait play is letterboxed.
- Delayed scene callbacks are scoped to a scene generation and cleared on restart. They defer while paused.
- Replay and scene resets dismiss old ending state; a new journey resets the crown count.
- Director controls are hidden during normal play; append `?qa` to expose them.

### Character and game feel

- Measured alpha bounds for 297 supplied character frames. Feet anchors and apparent heights share one drawing contract across male/female and uncrowned/crowned/scepter forms.
- Grounded states use each frame's measured feet. Airborne/crouched poses retain their silhouette rather than being independently stretched to full height.
- Movement animation follows distance traveled; jumping uses the supplied sequence instead of four hard-coded frame choices. Uppercuts use all seven supplied frames.
- Added restrained landing dust, low-level synthesized impact accents, and a capped camera shake. Reduced-motion preference suppresses shake.
- Tunnel drawing preserves the selected form and adds a subtle gold edge glow.
- Panther companions are present before approach, activate in a staggered sequence, follow the player without raising the speed cap, and sit when the player stops.

### Museum and cinematic presentation

- Shared monumental arches, bronze-edged columns, distant balconies, pyramidal silhouettes, burgundy/teal textiles, suspended artifacts, deterministic paper grain, dust, and proximity-responsive shafts of light.
- Scene palettes retain antique gold, burgundy, plum, teal, and near-black while opening toward the palace.
- Removed competing legacy wireframe overlays and repeated sky titles to improve visual hierarchy.
- Opening projection is bounded in the upper environment. It fades with the wall drop, and the clean museum receives a 1.6-second presentation interval before the gift.
- Projections render behind physical scene geometry and use lower peak opacity. Their original feathered masking remains intact.
- Mountain drawing now samples the same terrain function as collision. The boulder receives slope-aware contact positioning.
- Faith cinematics now track the hero horizontally as well as vertically.
- The tunnel retains faint architecture and a thin ground trace in the darkness.
- Mirror recognition requires stillness without pressing forward.
- Palace rebuilt with dimensional bronze columns, a luminous vault, obsidian/burgundy throne, ceremonial stairs, reflective floor treatment, guardians, and an expanding carpet.
- Replaced prototype-facing title copy with the journey's premise and clear player controls.

## Verification

**100 checks passed** across the two browser regression suites. Final primary suite reported **zero browser errors and zero HTTP resource failures**.

Coverage includes:

- Both genders across all nine scenes; finite movement state after movement and jumps.
- Idle, walk, run, jump, and push rendering for applicable forms; all sequence indices exercised by the frame-render harness.
- Opening wall timing, museum interval, gift, coronation, and all three uppercuts.
- Mountain pushing, boulder release, and transition to Leap of Faith.
- All four faith leaps and the transition into Run Free; continuous camera visibility during the first long fall.
- Panther formation, speed cap, worthiness wall, and affirmation passage.
- All four affirmations, tunnel frenzy and breakthrough, Past/Present/Future upgrade, mirror stillness, palace, throne choices, ending, and replay.
- Female crown/scepter state preserved through an actual affirmation-to-tunnel transition.
- Song playback time advancing without media errors; opening projection decoding and advancing; mute, pause, and focus loss.
- 1366×768 and 1920×1080 desktop layouts, emulated 844×390 touch landscape, and 390×844 portrait resize.
- Normal release UI hides director controls. The alternate HTML entry also starts through `file://`, matching the shipped batch launcher.
- JavaScript syntax and matching hashes for both HTML entry points.

The regression harness uses deterministic simulation stepping and positional setup to exercise narrative gates. This is automated end-to-end state coverage, not a claim of two uninterrupted manual playthroughs. Screenshots were inspected for the opening, museum reveal, mountain, tunnel, palace, and mobile controls.

The recorded headless desktop frame timing sample had a 6.1 ms median and 6.4 ms 95th percentile over 89 intervals; it is an environment observation, not a hardware performance guarantee.

### Remaining release validation

Physical iPhone/Android testing, Safari testing, and listening through real speakers/headphones have not been performed. Automated audio checks establish playback and controls, not subjective mix quality. Mobile portrait retains the full stage in a letterboxed view and is best played landscape. Production has not been deployed.

## Files and use

- `index.html` and `BLACK_AND_GIFTED_DEMO.html`: synchronized game entry points and revised runtime.
- `character-metrics.js`: measured metadata for the supplied sprite frames.
- `museum-presentation.js`: shared museum renderer.
- `LIVING_MUSEUM_RELEASE_NOTES.md`: this report in the source package.
- `qa/`: repeatable Playwright regression scripts; requires Playwright and Microsoft Edge. Set `BG_GAME_URL` to the locally served game URL and `BG_GAME_FILE` to the alternate HTML entry if needed.

Open `START_BLACK_AND_GIFTED.bat` or `index.html` to play. For director testing, serve the folder locally and open `index.html?qa`. The existing historical RC notes are retained; this report describes the new revision.

No production deployment or push was performed.
