# STREAMS — Current Break

Jump upstream; the equipment flows downstream toward the falls.

Open `index.html` in a modern browser, or serve this folder with any static web server. Everything is local: no install, account, CDN, or build step. Direct file launching was not browser-verified because the testing browser blocks file URLs.

Move with A/D or Left/Right. Jump with Space/Up. Double-tap a direction to dash. On touch screens, use the on-screen controls. Press Jump during a blue ball's compression for the stronger spring launch.

- Slow, medium, fast and express traffic uses weighted speed bands. Visible speeds stay predictable; river phases vary the current.
- Optional fast carriers award 3 Value; express carriers award 5, with an extra point at Flow x2. Safe route spacing moderates the main chain while side traffic overtakes it.
- Incoming cases split compact side clusters into moving landing targets.
- Unstable rafts give an amber ring, countdown and SINKING warning before submerging.
- Value relieves pressure; Attention adds it. Recovery changes incoming traffic probabilities.
- Earned score feedback, gold-framed counters, downstream foam, banks and direction labels improve the presentation.

The original build and earlier RC were preserved. The stage remains fixed upstream.

## Verification

Run `node tests/verify.cjs` from any directory. It checks controls, pickups, springs, warning timing, collisions, weighted rewards, start-ledge retirement, fixed stage, failure/restart, and ten seeded input-only traversals.

Nine of ten automated traversals reached the stage (five of five at 390×800, four of five at 1280×800). The simple controller can lose; this is not a guarantee that every route choice is safe. The development build also completed a rendered browser replay at 1280×800 with five cluster breaks and no captured browser errors. A 1280×720 replay lost. This was automated playtesting, not a full manual play-through.

The independently packaged runtime passes the same tests and matches the tested source files byte for byte. Its separate browser launch was blocked by automatic approval review after the browser denied file-URL access, and remains unverified. See `tests/results.txt` for the recorded test results.
