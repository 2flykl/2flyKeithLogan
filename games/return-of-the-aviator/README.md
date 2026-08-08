# Return of the Aviator — Revision 3
## “The Algorithm Has Faces”

This build is designed to replace the previous `return-of-the-aviator` folder.

### What's new
- New armed 2Fly production frames sourced from the latest sprite sheet.
- The base weapon is visually integrated into 2Fly's frames; no floating weapon layer.
- Larger enemy silhouettes designed to read clearly at gameplay speed.
- 14 symbolic Algorithm enemy types; spider/crawler bots are excluded.
- Integrated code markings remain visible on the bot artwork.
- Enemy fire is intentionally reduced. The game now emphasizes enemy behavior:
  surveillance, tracking, censorship, filtering, manipulation, jamming, interception,
  data mining, shielding, and amplification.
- Maximum 8 enemies and 8 enemy projectiles at once.
- Telegraph ring before enemy shots.
- Hit flash + glitch breakup + explosion instead of instant disappear.
- Full runway lateral control and UP/W jumping.
- Stronger visual hierarchy / screen scale.
- Scene cleanup and hard entity ceilings for browser stability.
- Music playbackRate is never altered.
- F2 debug HUD shows FPS, scene, music time, active bot/projectile counts.
- With debug enabled: keys 1–5 jump to Opening / Dive / Runway / Maze / Boss.

### Test locally
1. Extract this ZIP.
2. Open PowerShell in the `return-of-the-aviator` folder.
3. Run:
   npx serve . -l 8080
4. Open:
   http://localhost:8080
5. Hard refresh once with Ctrl+Shift+R.

### Controls
- WASD / Arrow Keys — move
- W / Up — jump on ground
- Space — fire
- Shift — sonic burst
- P — pause
- F2 — debug
- Debug + 1–5 — jump to scenes

### Note
Phaser is still loaded from cdnjs in this build; internet access is needed for the engine
and the “Too Fast” song stream.
