# BLACK & GIFTED — Release polish V2

## Changes
- New supplied title artwork, male/female selection, and fullscreen control.
- Canvas, HUD, crown counter, and progress display now share viewport scaling.
- Rebuilt crowned male/female eight-frame runs with visible near/right-arm forward and backward poses; normalized size and foot anchor. Original assets retained.
- Extended male jump pose used throughout the Leap of Faith cinematic. Crowned jump progression avoids the tucked peak pose.
- Both power-fist animations increased 10% to a 242-unit reference.
- First broken Scene 1 wall cues the falling-wall video from 4.7 seconds.
- BLACK and AND landings select their respective projections, framed above the platforms. Minimum viewing beats are 4 and 5.5 seconds; an early jump is queued while the platform stays stable.
- GIFTED intentionally fades out the second projection over 1.4 seconds and reveals the pyramid museum/Black Power fist skyline. Leap films cannot restart during the reveal.

## Validation
148 automated checks passed across gameplay (62), extended regression (38), requested refinements (13), release polish (21), final scale/mobile checks (4), and character motion (10). Desktop, mobile emulation, fullscreen, replay, touch movement, all scenes, resource loading, and direct-file entry covered. Five consecutive mobile launches also passed. Tests now wait for the completed startup state rather than a short fixed delay.

Both HTML entry files are identical. All original artwork files match the untouched backup; all 16 added transparent run frames have clear image borders. New raster artwork was produced with the built-in image generator and extracted/normalized locally. Full source sheets are retained alongside the extracted frames.

## Testing this build
Extract the entire ZIP before opening BLACK_AND_GIFTED_DEMO.html or serving index.html. Keep the assets folder beside the HTML. Test the male and female runs, first wall impact, and all three Leap of Faith landings. The runs can be previewed in qa/release-polish-evidence/crowned-run-preview-v2.gif.

Browser checks used desktop Edge and mobile emulation; physical phone testing and the creator's final animation/art-direction review remain recommended before publication. No production deployment was performed. Account usage cannot be guaranteed or attributed to a specific percentage by this package.

## Backup
Untouched 701-file pre-edit backup: work/BEFORE_RELEASE_POLISH_20260922_224455 in the Codex task workspace, with SHA-256 manifest work/release-polish-backup.json.
