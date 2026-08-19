# 2fly-Universe — Paste / Push / Preview

This folder is the single source of truth for the 2Fly Universe.

## Deploy
1. Delete/replace any older duplicate Universe folders in the site repo.
2. Paste this folder at the site repo root as exactly: `2fly-Universe/`.
3. Point every site/menu/playable-experience Universe link to `./2fly-Universe/` (or `/2flyKeithLogan/2fly-Universe/` on the GitHub Pages project URL).
4. Commit and push. The included `index.html` is already a static production entry point; no build step is required for preview/deploy.

## Entry point rule
All Universe entry links should resolve to `2fly-Universe/index.html` (hash routes such as `#galaxy/G2025` may be appended). Do not maintain a second Universe copy.

## What changed
- Cursor/gray-reticle anchored zoom; zoom direction follows the mouse instead of the viewport center.
- Empty-space click places the gray world locator without auto-travel.
- Every era galaxy has a visible era label and is explorable.
- Only 2025–2029 contains live content.
- Historical/future galaxies contain upgraded non-live orbital archive objects.
- Added true 3D interstellar spiral/current geometry and moving particles between galaxies.
- Expanded Build Your Own Tour catalog across galaxies, live destinations, and archive objects.
- Static browser-native module build with local Three.js; no CDN or Vite build required to preview.
