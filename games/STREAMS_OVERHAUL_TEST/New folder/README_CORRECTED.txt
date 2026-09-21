STREAMS OVERHAUL - CORRECTED BUILD

What was corrected:
- Replaced crowded-sheet gameplay usage with normalized, isolated character frames on a fixed 512x768 transparent canvas.
- Locked the character renderer to a stable bottom-center anchor to reduce cut-off, popping, and jitter.
- Kept the gameplay hitbox separate from the rendered character sprite.
- Replaced the obvious gray platform boundary ovals with more natural shadow, ripple, and water-contact cues.
- Preserved the separate-folder workflow so your original STREAMS project is untouched.
- Included the original song downloader in the BAT launcher. If audio download fails, the game still loads.

How to run:
1. Extract the ZIP anywhere.
2. Double-click START_STREAMS_OVERHAUL_CORRECTED.bat
3. The browser should open the corrected build.

Notes:
- This build is still a test pass, but the character pipeline is now structurally correct.
- If any specific animation state still feels off, regenerate only that state—not the whole system.
