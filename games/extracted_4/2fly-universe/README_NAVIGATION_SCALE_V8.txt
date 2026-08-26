2FLY UNIVERSE — NAVIGATION SCALE V8

This build expands the spatial model instead of just changing camera sensitivity.

SCALE MODEL
- Legacy click unit used as the tuning baseline.
- Reset viewpoint begins roughly 50+ legacy-click units beyond the playable central-galaxy perimeter.
- Galaxy physical/visual footprint is expanded to at least roughly 100 legacy-click units across.
- Fixed galaxy centers are spread so neighboring galaxy perimeters have roughly 700+ legacy-click units of deep-space separation.
- Open-space left click travel = ~10 legacy clicks.
- Inside-galaxy left click travel = ~5 legacy clicks.
- Galaxy approach automatically tapers from the space step toward the interior precision step to reduce overshooting.

ORBIT
- Left-drag is true spherical orbit around the active focal axis.
- Drag does not pan or translate the scene.
- Radius stays locked unless wheel/zoom is deliberately used.
- Pitch is limited so orbit cannot flip awkwardly through the focal point.
- Open space gradually uses Universe center as the orbit axis.
- Entering a galaxy smoothly hands the orbit/focal axis to that galaxy center without snapping the camera position.

GALAXY RESIDENCY
- Galaxy center receives a mild focal bias after entry, not a hard camera snap.
- Local resistance is intentionally weak so users can float around the galaxy.
- Perimeter hysteresis from V7 remains to avoid enter/exit flicker.
- Single click still identifies/highlights orbit content; double click engages it.

THRUST / WARP
- Right-mouse thrust remains immediate.
- Warp now takes substantially longer to build: it begins only after sustained thrust and ramps over several more seconds.
- Wormholes are delayed to the extended sustained-thrust period and use distances appropriate to the larger universe.

OUTER UNIVERSE SAFETY
- Universe safe/return/max radii are expanded with the new galaxy layout.
- Star field extends past the containment shell.
- Galaxy rendering remains within the camera far plane at the outer boundary.
- As the return field activates, a faint projected galaxy-cluster glimmer remains visible in the direction of home, preventing a completely black/lost view.
- Strong outer-edge steering continues to bend travel back toward the galaxy cluster.

BUILD BASE
- Built from Navigation Style V7 Free Galaxy Residency.
