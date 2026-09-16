2FLY UNIVERSE V17 — ACTUAL V13 NAVIGATION RESTORE

This build fixes the reason V16 still showed the old navigation: the served runtime was still using the old click-to-travel source path.

Authoritative runtime:
- index.html -> app/main.js (browser ESM)
- dist/index.html -> dist/app/main.js
- stale hashed main-*.js bundles were removed to prevent accidental loading of the old navigation.

Restored interaction model:
- LEFT CLICK: select object/media only.
- LEFT HOLD + DRAG: true orbit. Inside a galaxy, the nearest galaxy center becomes the orbit pivot; drag preserves orbit radius and does not pull inward.
- RIGHT QUICK CLICK: immediate forward boost.
- RIGHT HOLD: continuous forward thrust.
- EXTENDED RIGHT HOLD: warp-speed acceleration/FOV expansion.
- Selected target: right-thrust tracks selected target.
- No selected target: right-thrust follows the live mouse ray.
- No backwards wind-up before thrust.

Media activation hard rule:
- Proximity = no activation.
- Passing through = no activation.
- Collision / getting close = no activation.
- First click on media = SELECT.
- Second click on the SAME selected media = OPEN.
- Orbit drag and right-mouse thrust are suppressed from falling through into content click handlers.
- V13-style screen-space fallback picking is enabled so small media remain selectable at normal galaxy distance.

This package preserves the decorated celestial source and assets from 2fly-universe (5).zip.
