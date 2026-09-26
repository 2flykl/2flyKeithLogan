# BLACK & GIFTED — V3 animation and Leap of Faith corrections

## Changes
- Restored crowned male takeoff, ascent, descent, and landing frames. The arms-back pose is reserved for the airborne cinematic hold, not the entire leap.
- Removed the invisible platform clamp and timed jump queue. Each jump starts immediately, camera cutaway starts after liftoff, and the cutaway ends at landing. Flight follows a continuous curve with real vertical velocity.
- Museum/fist has a fixed world position and smaller distant scale. Added a star field, architectural sky lights, atmospheric haze, and rising moon.
- No character image is painted in the moon. The actual final leap crosses the moon center during the arms-back hold. Male/female visual centers were measured separately: tests measured less than 0.35 logical-pixel error at the sampled crossing.
- Male and female scepter runs reuse their crowned eight-frame body cycles with a gold scepter attached to the far hand in each pose. Arms and legs alternate, and the accessory cannot change body scale. Crowned and scepter run/idle/jump standing references remain 220 logical units; crouching and bending naturally change the occupied silhouette height.
- Replaced female crowned passing frames 02 and 06 with clean two-leg poses. Both crowned and scepter runs use these repairs.

## Validation
127 checks passed: gameplay 62, extended regression 38, character motion 10, Leap of Faith 11, motion/moon alignment 5, jump cycle 1. Actual rendering sampled jump frames 02, 03, 05, 07, 08, 09 across a leap. Desktop/mobile emulation, replay, touch movement, full scene flow, resource loading, pose metrics, and world-fixed museum coordinates covered. No browser/runtime errors in the focused checks. Original asset files preserved byte-for-byte; the two HTML entries are identical.

## Art workflow
Built-in image-generation tool used for the two female passing-pose repairs. Prompt: preserve the reference character's upper body and style; produce two transparent full-body passing-run poses with exactly two clearly separated legs and boots, no duplicated knee contour, consistent scale and clean margins. Generated source: assets/release-polish-v3/female-passing-repair-source.png. Final frame files: female-run-02.png and female-run-06.png in that folder. Extracted and normalized locally. Experimental generated scepter sheets were not integrated; shared body frames and hand-bound rendering preserve the established character art and size.

## Test the build
Extract the whole ZIP and open BLACK_AND_GIFTED_DEMO.html, or serve index.html locally. Review each run cycle in motion and jump immediately from each Leap of Faith platform. The moon crossing occurs on GIFTED to mainland. Physical-device testing and creator review are still needed before publication. No production deployment performed.

Backup: work/BEFORE_LEAP_CORRECTIONS_V3 in the Codex task workspace, verified with work/v3-backup-manifest.json. Prior V2 report/evidence is historical; this V3 report supersedes its platform-wait and fixed-pose behavior.
