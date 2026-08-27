# 2Fly Universe V23 — Living Atlas Navigation

This release starts from the restored V13-style navigation/decorated Universe and adds the requested spatial/interaction pass.

## Navigation & interaction
- Galaxies have moderately more breathing room to create actual travel time between eras.
- Universe containment radii were expanded so the larger layout still has deep-space breathing room.
- Reset/Home framing was widened to keep the explorable galaxy cluster in view.
- In open space, only galaxies are selectable.
- Planets, moons, satellites, stars, and archive objects only become selectable after the camera is inside their galaxy.
- Media remains selection-gated: first click selects; second click on the same selected media opens it.
- Hovering, proximity, flying through, or orbiting past content does not activate content.
- V13 mouse model remains: left-drag orbit; right-click boost; right-hold thrust; extended hold warp.

## Living Atlas guide
- The former gray circle is now a transparent crosshair sphere/atlas guide.
- Orbiting displays a directional holographic orbit arrow.
- Forward drift/thrust displays repeating twin holographic arrow trails.
- Warp intensifies the guide.
- Guide color follows the closest galaxy and softly blends between nearby galaxy color zones.
- The guide displays current navigation state/target.

## Galaxy visual pass
- Added more thin, pristine-white abstract atlas/orbit lines inside every galaxy.
- White lines breathe/fade subtly instead of flashing.
- Added a loose gas-like perimeter field near galaxy boundaries rather than a hard holographic cage.
- When inside a galaxy, that era label is moved to the upper frame and distant galaxy information is subdued.
- Entry/exit feedback is a small upper HUD cue; the world-space gas veil carries the perimeter feeling.

## Runtime
- Browser entry is `index.html` -> `launcher-v23.js` -> `app-v23/`.
- Root and `dist/` use the same V23 runtime.
- `assets/three.module.js` is the only Three.js runtime asset used by the import map.
