2FLY UNIVERSE — VERIFIED STATIC RELEASE — 2026-08-19

THIS IS THE ONLY FOLDER YOU NEED.

FINAL REPO PATH:
  games/2fly-universe/

REPLACE the existing games/2fly-universe folder completely with this folder.
Do not merge it into an older copy. Do not keep 2fly-Universe and 2fly-universe at the same time.

NO BAT FILE.
NO npm install.
NO npm build.
NO Vite server is required for deployment.

The site already points to:
  games/2fly-universe/index.html

After replacing the folder:
  git add -A
  git commit -m "Replace 2Fly Universe with verified static release"
  git push origin main

Then hard refresh the live site with Ctrl+Shift+R.

IMPORTANT LOCAL NOTE:
Double-clicking index.html from File Explorer may be blocked by browser ES-module security.
Preview through the website/GitHub Pages/Render or a local HTTP server, not file://.

VERIFIED RELEASE CHANGES:
- Mouse/gray locator is the zoom anchor; wheel/pinch zoom follows the pointer.
- Empty-space click places the gray locator without forced camera travel.
- Era labels exist for 2000–2004 through 2030–2034.
- Historical/future eras are explorable but only 2025–2029 has live content.
- Historical eras contain upgraded orbital archive objects and textured worlds.
- Static backdrop dependence is removed from the core environment: procedural starfield,
  3D galaxy particles, interstellar currents, dust and depth layers provide spatial motion.
- Build Your Own Tour overlay is included.
- Runtime imports Three.js directly from the bundled local vendor file; no import map/CDN/Vite env required.
- Fresh /runtime/ path prevents an older cached /js/ module graph from being reused.
