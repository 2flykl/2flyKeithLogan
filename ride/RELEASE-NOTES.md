# Ride with 2FLY — RC3 / Sky Session

September 24, 2026. Local release candidate; no production deployment.

The title screen offers two worlds: the existing Youngstown ride and a new abstract Sky Session. Select a card and Start the Ride. End ride returns to the selector. The same stereo, exact four-track playlist, climate controls and audio ownership apply to both worlds.

Sky Session follows an elevated, continuously streamed road through rolling climbs, dips, sweeping curves and gentle banking. Its four visual chapters feature giant vinyl records, suspended piano keys, rotating brass sculptures, speaker towers, orbiting spheres, luminous arches and a ringed sun. Violet, teal, copper and pink light carries into the cabin while preserving display legibility. Objects have real geometry and parallax; music never drives road distance.

Reduced motion freezes sky movement and suppresses cabin overlays. Youngstown retains its optional direction arrows, traffic, stop signs and scenery. Switch worlds from the title screen without duplicating audio or loading another page.

Verified: full 24-check stereo suite in each world, all four actual songs, desktop/mobile emulation, reduced motion, title-screen round trip and 4.1 km accelerated sky streaming. No browser errors or failed requests in the player suites. Physical mobile devices were not tested. See QA-REPORT.md for evidence.

Run START_RIDE.cmd or `node serve.cjs` (Node 18+). No install/build step. The new world is implemented in ride/sky-ride.js; README.md and ASSET-AUDIT.md explain media replacement. Verified Guns and Butter artwork remains unavailable; its correct audio is included.
