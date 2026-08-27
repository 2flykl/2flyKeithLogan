2FLY UNIVERSE V19 — FRESH START / UPDATED UNIVERSE RUNTIME

WHY THIS VERSION EXISTS
V17/V18 could remain on the loading screen because the entry page was still dependent on stale/fragile runtime paths. This build replaces the launch path instead of adding another patch to the old splash.

WHAT CHANGED
- Fresh start screen with an explicit ENTER THE UNIVERSE action.
- New versioned browser runtime: /app-v19/
- app-v19 uses explicit relative imports to /assets/three.module.js; no import-map dependency.
- V18 runtime-safe seed data loader retained.
- Existing decorated celestial object system retained.
- Restored V13-style camera/navigation source retained:
  * left click select
  * left-drag orbit
  * right click short boost
  * right hold continuous thrust
  * extended hold warp
  * selected target receives thrust priority
  * media opens only on second click of the selected item
- Root and dist use the same launch architecture.
- Stale main-*.js bundles were removed so the browser cannot accidentally execute an older navigation build.

START FILE
Open /index.html.

EXPECTED START FLOW
1. Start card appears.
2. Click ENTER THE UNIVERSE.
3. Launcher imports /app-v19/main.js.
4. Updated Universe builds.
5. Universe shell removes the start/loading card after successful initialization.
6. If import/runtime initialization fails, the screen shows RETRY LAUNCH instead of spinning forever.
