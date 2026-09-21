2FLY UNIVERSE — PHASES 1, 2, 3 FULL 3D BUILD

THIS IS NOT THE STRIPPED-DOWN CANVAS TEST.
It is a continuation of the restored full Three.js Universe.

HOW TO RUN
1. Extract this ZIP into a brand-new folder.
2. Double-click START_PHASE123_GPU_SAFE.bat
3. Chrome will open http://127.0.0.1:8088
4. Click ENTER THE UNIVERSE.

If Chrome still refuses WebGL2, close the first test and try:
START_PHASE123_SOFTWARE_FALLBACK.bat
This is only a compatibility fallback and may run slower.

PHASE 1 — ENGINE / NAVIGATION
- Preserves the full Three.js Universe architecture.
- Formal navigation state machine: deep space -> galaxy residency -> planet focus -> media.
- Camera travel now uses a cinematic curved chase path rather than a linear hard move.
- Fly timing uses actual delta time instead of fixed 16 ms increments.
- Planet content: single click selects; double-click deliberately activates.
- Double-click a flagship planet to enter cinematic planet focus.
- Planet focus panel is HTML/DOM UI; the Universe itself remains WebGL/Three.js.

PHASE 2 — GALAXY
- Galaxy stars/dust are GPU point systems with shader-computed spiral motion.
- Differential rotation gives inner and outer regions different apparent motion.
- Procedural FBM nebula gas layers replace static flat fog behavior.
- Luminous 3D energy core and corona.
- White vinyl/orbital grooves are brighter and include moving spark nodes.
- Built-in postprocessing pipeline adds thresholded bloom, blur, composite and vignette.

PHASE 3 — FLAGSHIP WORLDS
- Streams, Thru the Fire and I Woke Up In Africa use true high-segment 3D spheres.
- Existing 2fly artwork was converted into albedo, emissive, roughness and generated normal maps.
- Artwork is wrapped as real surface material instead of used as a flat planet sprite.
- Atmosphere/rim shaders surround each world.
- Media children now live in hierarchical orbit-pivot groups.
- Outer objects orbit more slowly than inner objects.
- The three flagship worlds include independently tuned material/light/orbit personalities.

DESIGN LOGIC USED
The systems borrow believable astronomical ideas—differential galactic rotation, spiral-arm density patterns, orbital inclination, axial tilt, atmospheric rim scattering, inverse-distance-like hierarchy, slow outer orbital motion, stellar flicker and parallax—while keeping 2fly Universe artistic rather than turning it into a literal astronomy simulator.
