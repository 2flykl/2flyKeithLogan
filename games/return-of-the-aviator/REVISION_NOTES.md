# Graphics Overhaul Revision 2

This revision addresses the first Phaser/WebGL playtest:

- Re-cut and alpha-safe upscaled 2Fly frames from the original source sheet.
- Removed GrabCut from hero extraction because it produced translucent/dirty edges.
- Larger readable bots; maximum enemy count capped for stability.
- Enemy ammunition reduced: slower projectile speed, lower firing frequency, and a hard projectile cap.
- Runway: left/right movement works throughout; UP/W jump works in both halves.
- Runway still changes from running toward the background to running toward foreground as the Air Boss emerges.
- Car retains free movement across the road.
- Stable scene transitions clear projectiles/enemies before loading the next act.
- Audio playback is always forced to 1.0; scene transitions never alter playback rate.
- Runtime object caps prevent projectile/entity buildup that can freeze the browser.
- New `assets/hero_production_preview.png` lets you inspect the cutouts directly.
