# Project audit

## Active architecture

`index.html` -> `launcher-v23.js` -> `app-v23/universe-shell.js` is the live entry chain. The shell orchestrates the local Three.js r170 renderer, camera, scene layers, HUD, store, hash router, destination data, star repository, and media overlays. `app-v23/main.js` is an alternative older entry; it remains preserved but is not loaded by the shipped index.

The renderer uses WebGL2 and its existing bloom pipeline. Scene modules construct seven era galaxies, procedural stars, era orbital shells, flagship project planets, the secondary frontier systems, and visitor stars. CSS-projected labels are separate from WebGL geometry. The camera retains orbit, mouse thrust, scroll/pinch approach, protected-body boundaries, travel interpolation, and history.

Canonical content is in `data/seed_universe.json`. There are seven chronological eras and seven showcase projects, with 23 live child records (5 audio, 6 video, 7 games, 5 descriptive archives). Historical/future galaxies provide existing era context and orbital landscapes, not additional dated project records. Their contents were not inferred or invented.

Media uses remote Wix URLs and previously root-relative game paths. The original audio manager implements three regional music layers with crossfades, mute, and ducking. Stars and custom tours use localStorage; the star repository is a local adapter, not a shared backend. All provided textures, nebula art, galaxy art, object-style sprites, UI icons, sprite sheets, and design references are retained, even when a current procedural renderer does not load them.

## Baseline defects confirmed

- Chrome reported GLSL `color` attribute redefinition in three particle shaders. Those missing renders materially weakened the galaxy.
- Original overlay pointer-events selector did not match the class applied by the shell; player buttons could be intercepted by the canvas.
- Escape called browser history.back, potentially leaving the application.
- Media adapters dropped original child archive descriptions before opening a dossier.
- Star placement allowed arbitrary global-plane coordinates despite enforcing per-region bounds/elevations downstream.
- Main-domain game paths returned 404; corresponding repository GitHub Pages paths all returned 200.
- Small focus panels/HUD, scene-label stacking, and purely pointer-based navigator items limited mobile/keyboard use.
- Tab visibility scheduling could create more than one render loop.

All are addressed in the RC. The baseline source folder was copied before editing; SHA-256 preservation evidence accompanies the release. Original version notes and launchers remain as historical material. `READ_ME_FIRST.txt` identifies the current launcher.

## Integration boundary

Main-site return is `https://2flyKeithLogan.com/`. Hosted game resolution is `https://2flykl.github.io/2flyKeithLogan` plus the original `/games/...` path. Original data retains those paths for provenance. No production repository, website, or third-party account was changed.
