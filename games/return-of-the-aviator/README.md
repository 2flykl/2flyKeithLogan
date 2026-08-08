# Return of the Aviator — Revision VI: Canvas Flight Rebuild

This version deliberately removes Phaser from the runtime.

Why:
- The previous build could create the HUD and then stall before its first update.
- This build uses only the browser's built-in HTML5 Canvas + JavaScript.
- No Phaser CDN or external game engine is required.
- The gameplay clock always advances even if the Wix music stream is unavailable.

Opening:
- 2Fly is NOT visible initially.
- The opening begins with the aircraft.
- Plane states: normal -> bank -> burning -> breakup.
- 2Fly appears only during the escape jump/freefall transition.

Visual:
- All game boards scroll.
- Hero is rendered narrower than the source frame for a slim/tall silhouette.
- Piano tank is used in the vehicle scene.
- Plane/piano full sprite sheet remains in assets/reference_sheets.

Audio:
- Too Fast still streams from the supplied Wix URL.
- Clicking START is the first playback attempt.
- Any key/click retries audio.
- If audio cannot play, gameplay does NOT freeze.

Test:
  npx serve . -l 8080
  http://localhost:8080

After replacing the old folder, use Ctrl+Shift+R once.
