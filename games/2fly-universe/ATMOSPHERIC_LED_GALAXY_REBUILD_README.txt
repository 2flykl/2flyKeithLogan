2FLY UNIVERSE — ATMOSPHERIC LED GALAXY REBUILD

Prompt reinterpreted into implementation goals:
1. Replace bubble-like galaxy shells with fully spherical atmospheric galaxy plates.
2. Each plate should feel gas-like / volumetric, not like a flat image or hard wall.
3. Add futuristic LED-style orbital beacon orbs around each galaxy threshold.
4. Trigger an entry effect when crossing into a galaxy plate and an exit effect when returning to deep space.
5. Reduce galaxy plate opacity while inside a galaxy so orbiting content remains visible.
6. Preserve full explorable universe traversal across all galaxies.
7. Keep live content active only in the current era galaxy while historical/future galaxies remain explorable with orbiting objects.
8. Keep the gray selector circle and make navigation travel in the direction of the mouse click.
9. Slow orbit/zoom sensitivity so movement feels more controlled.
10. Center the overall experience on the current era galaxy for better 360° exploration.

Files updated:
- src/scene/galaxy.ts
- src/camera.ts
- src/types.ts
- src/universe-shell.ts

Key behavior changes:
- G2025 current era galaxy is now centered at universe origin.
- Galaxy plates now use softer atmospheric shading and lower internal opacity when the user enters them.
- Threshold overlay copy and timing were improved for entry/exit feedback.
- Pointer-directed travel remains active, with slower zoom and orbit speeds.
- All galaxies remain explorable; only the current era contains live playable/media systems.

If you want to run locally:
1. Open the 2fly-universe folder.
2. Run npm install (if needed on your machine).
3. Run npm run dev or npm run build.

