2FLY UNIVERSE V16 — Navigation + Galaxy Spacing Restoration

Source of truth: uploaded 2fly-universe (5).zip

Resolved in this build:
- Restored V13-style mouse navigation behavior while preserving the decorated celestial assets.
- LEFT CLICK selects. LEFT HOLD + DRAG orbits.
- RIGHT CLICK gives an immediate forward thruster boost.
- RIGHT HOLD provides continuous forward thrust; sustained hold ramps into warp speed.
- Thruster never pulls backward before moving forward.
- Selected target has priority for thrust direction; otherwise thrust follows the live mouse direction.
- Natural short inertial drift remains after releasing thrust.
- Inside a galaxy, the galaxy center is re-established as the true orbit pivot without pulling the camera inward.
- Media activation is selection-gated only: first click selects, second click on the same selected item opens it.
- Passing through, approaching, or colliding with orbiting media does not activate content.
- V13-style screen-space fallback picking remains so distant decorated objects can still be selected.
- Empty-space click only places the gray selector; it no longer auto-flies.

Spatial / presentation fixes:
- Increased non-central galaxy spacing by roughly 12% to add modest deep-space travel time.
- Expanded the invisible universe containment radii to provide substantial breathing room beyond every galaxy.
- Reset View now uses a wider composition centered on the whole galaxy cluster so all explorable galaxies fit comfortably.
- When inside a galaxy, its era title is moved to the upper frame rather than the center of the scene.
- Other galaxy labels and region information are heavily subdued while inside a galaxy, but the galaxies remain visible as distant context.
- Preserved and reinforced the thin white abstract orbital-line language on the galactic plates.
- Removed the full-screen colored galaxy-entry wash; entry/exit text now sits toward the upper frame.

Runtime note:
- This package includes a browser-ready ESM build in /app plus a standalone Three.js module in /assets.
- Root index.html and dist/index.html both point to the same restored runtime path, avoiding root-vs-dist version drift.
- The original TypeScript source is included for future edits.
