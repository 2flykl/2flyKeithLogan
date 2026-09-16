2FLY UNIVERSE — FULL 3D RESTORE / PRE-STRIP BASELINE
=====================================================

This package was rebuilt from the intact V23 Living Atlas full-engine archive,
from before the later stripped-down HTML/canvas test versions.

THIS RESTORE PRESERVES
- Three.js renderer
- full 3D camera/navigation engine
- galaxy scene systems and volumetric particles
- separated era galaxies
- 2025 Playable Frontier systems
- Streams / Thru the Fire / I Woke Up In Africa scene systems
- star layer
- media overlays
- galaxy/region/object navigation
- original full 3D assets, planet styles, nebulae, galaxy textures, and spritesheets

THE ONLY STARTUP REPAIR IN THIS RESTORE
The V23 data loader used a Vite-only import.meta.env.BASE_URL reference.
That was replaced with a module-relative URL so the intact browser modules can
load seed_universe.json from a normal local HTTP server or static host.

HOW TO TEST
1. Extract the ZIP into a NEW folder. Do not overwrite V2/V5/V7 test folders.
2. Double-click START_FULL_3D_RESTORE.bat
3. Your browser should open http://127.0.0.1:8080/
4. Click ENTER THE UNIVERSE.
5. Keep the command window open while testing.

DO NOT double-click index.html directly for this build. This is the real ES-module
3D runtime and should be served through localhost.

BUILD MARKER
The launch screen should say:
FULL 3D RESTORE · PRE-STRIP BASELINE

NEXT DEVELOPMENT RULE
Use this restored full 3D package as the protected baseline. Future visual and
interaction upgrades should be additive/corrective; do not replace the renderer
with a simplified 2D diagnostic version.
