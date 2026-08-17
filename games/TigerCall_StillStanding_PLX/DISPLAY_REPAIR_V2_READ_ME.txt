TIGER CALL DISPLAY REPAIR V2 — 2026-08-17

WHAT THIS FIXES
- Removes the opaque orange/brown full-screen spectacle background that covered the running game/video.
- Forces the spectacle canvas/layer to remain transparent.
- Fixes paw receptor CSS paths (css/ -> ../assets/).
- Adds cache-busting version tags so GitHub Pages is less likely to keep serving the old CSS/JS.
- Keeps TigerHeartbeat gameplay timing, Heartbeat silent metronome, and L/D/R/U mapping unchanged.

INSTALL
Replace the EXISTING folder:
  2flyKeithLogan\games\TigerCall_StillStanding_PLX
with the folder in this ZIP.

IMPORTANT
Use GitHub Desktop -> Repository -> Show in Explorer first, then replace the folder at that exact location.
GitHub Desktop should detect at minimum:
  index.html
  css/spectacle.css
  DISPLAY_REPAIR_V2_READ_ME.txt

Commit and push to main. Then hard refresh the live page with Ctrl+Shift+R.
