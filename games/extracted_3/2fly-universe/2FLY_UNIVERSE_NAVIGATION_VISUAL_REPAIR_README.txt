2FLY UNIVERSE — PHASE 3 NAVIGATION + DEPTH UPDATE
Generated: 2026-08-17

THIS UPDATE IS BUILT FOR THIS EXACT PROJECT FOLDER:
games\2fly-universe\

WHAT CHANGED
1. Mouse/gray-circle zoom anchor:
   - The gray circle follows the mouse over the Universe canvas.
   - Clicking empty space does NOT make the camera fly there.
   - Clicking only places/confirms the gray world locator.
   - Mouse wheel zoom follows the mouse direction instead of screen center.
   - Pinch zoom follows the pinch centroid.
2. Camera movement remains slower and smoother with stronger damping.
3. Galaxy swirls are now true 3D spiral particle volumes; the old PNG is only a faint diffuse accent.
4. Each historical galaxy (2000–2024) now contains explorable orbital shells: textured planets, moons, ring/orbit structures, and archive artifacts.
5. Only 2025–2029 opens real/live media and playable content.
6. Era naming:
   2000–2004 THE FOUNDATION ERA
   2005–2009 THE MOMENTUM ERA
   2010–2014 THE REINVENTION ERA
   2015–2019 THE EXPANSION ERA
   2020–2024 THE AWAKENING ERA
   2025–2029 THE PLAYABLE FRONTIER
   2030–2034 THE UNCHARTED ERA
7. New procedural planet textures are in assets\era\ and public\assets\era\.

IMPORTANT
The uploaded node_modules came from Windows. This package was typechecked successfully in the sandbox, but the sandbox could not run Vite/Vitest because Rollup's Windows-native optional binary is not executable on Linux. Rebuild on your Windows machine.

HOW TO APPLY
Option A — Extract this ZIP over your existing games\2fly-universe folder.
Option B — Replace the existing folder with this one, then run npm install if needed.

THEN RUN:
CLEAN_AND_BUILD_PHASE3.bat

That removes stale dist output and rebuilds the production files.

EXPECTED NAVIGATION TEST
- Put mouse near a purple galaxy; the gray reticle follows it.
- Click: camera should NOT fly.
- Scroll in: camera should bias/zoom toward the purple galaxy / pointer ray.
- Move mouse to the other side and scroll: direction should immediately change.
