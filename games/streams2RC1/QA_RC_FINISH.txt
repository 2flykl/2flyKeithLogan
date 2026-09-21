# STREAMS — River Flow RC

Open index.html, or use START_STREAMS_OVERHAUL.bat for a local HTTP launch. All game art and the original soundtrack are included. No build or download is required.

This revision preserves the original STREAMS_OVERHAUL_TEST folder.

Changes: dominant downstream translation; modest heavy/medium/light speed differences; bounded route-spacing correction; grounded camera framing that reveals drift; cleanup beyond the falls. Springs recur every 5–8 route steps after onboarding and lead to stable heavy platforms with Value. A four-second recovery window (14-second cooldown) eases the current and delays heavy-platform sinking when falling behind or under high pressure. Value relieves pressure; first landings and spring execution build Flow; cash earns one extra point at Flow x2. No jump-height changes.

Presentation: restrained directional streaks, trailing wakes, falls mist, mobile HUD visibility, and pickup accents. song-envelope.js is a small precomputed amplitude envelope from the included 173-second soundtrack. It follows actual playback time, affects glints only, and has a silent fallback; it is not beat detection. The song itself is unchanged. Reduced-motion preferences disable music-linked glints.

QA: node test-runtime.cjs game.js 120 (or 30).
Twenty seeded full-route simulations passed across 390px and 1280px widths at 120/30 Hz. Controls, dash, start retirement, moving landings, one-time rewards, Value/Attention pickups, spring/perfect bounce, abandoned spring cleanup, platform carry, recovery cooldown, Flow cash bonus, downstream cleanup, fail/reset passed.
Rendered browser automated traversals reached the stage on desktop and mobile with no captured errors. Direct touch start/jump/direction smoke check passed; final console error/warning check was empty.

Limits: full manual end-to-end play-through and subjective musical/emotional assessment were not completed. Soundtrack playback/decoding was inspected; an initial browser audio-analysis attempt crashed, so offline decoding was used. Seeded tests demonstrate sampled reachability, not a guarantee for every random route. Legacy QA/README files in this folder describe earlier revisions; this file and QA_RC_FINISH.txt describe the current build.
