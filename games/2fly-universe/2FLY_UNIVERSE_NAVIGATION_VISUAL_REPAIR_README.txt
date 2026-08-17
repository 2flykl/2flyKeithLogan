2FLY UNIVERSE — NAVIGATION + VISUAL REPAIR
Generated: 2026-08-17

WHAT THIS PATCH CHANGES
1. Lowers the opacity of the galaxy swirl/core as the camera approaches a galaxy,
   so orbiting items are easier to see.
2. Slows the user orbit / spin speed when dragging the camera.
3. Improves dead-space navigation so a click anywhere in the universe becomes a
   valid travel target and the zoom follows the selected screen location.
4. Adds a gray locator ring that represents the visitor focus position and snaps
   to selected galaxies, regions, orbit items, stars, and dead-space click destinations.
5. Keeps the ring smoothly following the current selected focus point.

FILES INCLUDED
- src/camera.ts
- src/scene/galaxy.ts
- src/universe-shell.ts
- 2FLY_UNIVERSE_NAVIGATION_VISUAL_REPAIR_README.txt

INSTALL
1. Open your local 2fly-universe project folder.
2. Replace the files above with the ones from this patch.
3. Commit and/or rebuild the project on your machine.

IMPORTANT FOR GITHUB PAGES / STATIC DEPLOYMENTS
If your live 2Fly Universe is serving the built static files (assets/dist),
you must rebuild on your machine after replacing the source files so the built
JavaScript updates.

Suggested local rebuild flow:
- npm install   (if needed)
- npm run build

If you use a provided helper batch file, run that after replacing the files.
Then commit/push the rebuilt output to GitHub.
