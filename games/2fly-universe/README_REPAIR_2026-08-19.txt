2FLY UNIVERSE — SINGLE LOWERCASE FOLDER REPAIR

CANONICAL PATH
games/2fly-universe/

WHY THE LIVE UNIVERSE WAS STUCK ON "INITIALIZING COSMOS…"
The repository had duplicate case-variant Universe folders. The live page and browser-ready runtime were split between different case-sensitive GitHub paths. Windows can obscure that difference, while GitHub Pages does not.

THIS PACKAGE
This is one complete deployable Universe folder named exactly `2fly-universe`. It contains:
- index.html
- runtime/ browser-ready JavaScript
- runtime/vendor/three.module.js
- assets/
- data/
- src/ editable TypeScript source
- public/ + project configuration for future development
- scripts/check-canonical-path.js to prevent future capitalization drift

The production page runs directly from runtime/main.js and resolves seed_universe.json relative to the runtime module, so it does not depend on Vite environment variables at runtime.

INCLUDED EXPERIENCE UPGRADES
- pointer/gray reticle follows the mouse and wheel/pinch zoom biases toward that pointer ray
- galaxy era labels for all era galaxies
- volumetric spiral particles + layered halo/swirly depth inside each galaxy
- explorable historical era orbit systems with richer planet/moon/artifact geometry
- 2030–2034 remains explorable but mysterious/non-live
- only 2025–2029 is marked for live content
- Build Your Own Tour includes saved queue, search, galaxy/type filters, next/back/info/exit/finish controls

PASTE / PUSH
Use only `games/2fly-universe/`. Replace its contents with this package, remove any duplicate case-variant sibling folder from Git/GitHub, commit, push main, then hard-refresh the live site.
