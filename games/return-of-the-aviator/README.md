# Return of the Aviator — Revision 7
## Four Acts / Two Plays

This build uses the browser's native Canvas renderer. It does not require Phaser or another game-engine CDN.

### Master timing
The game reads the actual duration of `Too Fast` when metadata becomes available and scales the complete timeline to exactly two song lengths.

Reference timing at a 128-second master:
- Intro / swarmed plane escape — 17s
- Scene 1: The Dive — 43s
- Transition: 808 Landing — 7s
- Scene 2: Runway Pursuit — 51s
- Transition: Call The Grand — 10s
- Scene 3: Algorithm Maze — 55s
- Transition: Road Ends Here — 8s
- Scene 4: Algorithm Storm — 58s
- Interactive final strike — 7s

Total: 256s / two full plays.

### Interaction
- WASD / arrows — movement
- Scene 1 DOWN — Power Dive; increases board speed and camera pulls wider
- Scene 1 UP — Resistance; upright precision/braking state
- Rapid left/right reversal in Scene 1 — aerial revolution/spin state
- Runway UP/W — jump
- Scene 3 directional movement — free piano-tank steering
- Scene 3 ramps — physical launch/airtime mechanic
- Space — fire
- Shift — sonic burst
- F2 — debug display

### Interactive transitions
1. Plane escape: tap UP/W to force the aircraft exit.
2. 808 landing: hold UP/W to brace against the runway with bass pressure.
3. The Grand: hold UP/W to call/charge the piano tank while the runway is collapsing.
4. Road Ends Here: hold UP/W while The Grand charges the final launch ramp into the storm.
5. Ending: hold Fire to charge the combined W.M.P. strike.

### Camera
Directional input subtly leads the camera. Freefall DOWN pulls wider, UP tightens framing, road steering receives lateral anticipation, and ramp airtime widens the view.

### Music stability
The gameplay clock does not depend on audio playback. If Wix audio is delayed or blocked, the game continues. Any key/click retries audio, and the audio engine seeks toward the current position within the two-play master timeline.

### Local test
Open PowerShell in this folder:

    npx serve . -l 8080

Open:

    http://localhost:8080

After replacing an older build, hard-refresh once with `Ctrl+Shift+R`.
