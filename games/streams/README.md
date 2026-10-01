# STREAMS — Momentum website release

Open index.html or START_STREAMS.bat, or serve this folder with a static web server. All assets are local. No installation or build step is required. Browser QA uses local HTTP.

Player travels upstream; objects travel downstream. A/D or arrows move, Space/Up jumps, double-tap a direction dashes. Touch controls appear on mobile. Jump during spring compression for a stronger bounce.

Changes from Wild Current:
- Persistent body velocities, mass-weighted impulses, damped restitution and tangential friction. Isometric waterline contacts use a consistent unprojected physics plane.
- Physics substeps and iterative separation prevent fast traffic from passing through visible floating bodies. Real impact impulses split racks; artificial random collision kicks were removed.
- Moored road case replaces the rectangle start. It remains stationary and does not award repeat landing points or collectibles.
- Optional desktop third arrivals reduced by 40% (roughly 10–15% fewer ordinary arrivals overall). Mobile equipment is narrower, leaving room for physical deflection.
- More spring crossings: regular spring cadence changes from every 11 rows to every 7, with existing breakwater springs retained.
- Ready-state blue-ball artwork crops only the stray bottom fragment. Compression, launch and underwater frames retain their full artwork.
- Narrow bank moorings, flow around anchors and capped incoming traffic prevent an offscreen jam from halting all arrivals.
- Original player jump strength is retained. A stronger jump trial was rejected.

Verification:
- node tests/physics.cjs: momentum, energy loss, oblique deflection, moving-body transfer, anchored contacts and fast impacts at 30/60/144 Hz.
- node tests/mechanics.cjs: assets, input, start, pickups, springs, warnings, scoring, moorings, stage and restart.
- node tests/verify.cjs: full seeded traversals. The retained 8/10 completion target is NOT waived; this collision revision currently completes 6/10 (5 mobile, 1 desktop), so the balance regression check remains failing. This is a review candidate, not a claim of complete balance approval.
- Browser: desktop input-driven run reached the stage at 184.9 seconds, with 12 rack breaks; start/restart, keyboard jump and mobile touch jump verified; no console warnings/errors observed. Blue-ball fragment visually removed.

The earlier version remains in Git history. tests/replay.html provides seeded input-only browser runs and pause controls. The test driver predicts trajectories; it does not teleport the player or grant rewards. Automated success rates are not human difficulty measurements.
