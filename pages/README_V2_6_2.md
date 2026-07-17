# 2Fly Platform V2.6.2

## Experience carousel repair

- Replaced viewport-level `scrollIntoView()` carousel centering with rail-only scrolling.
- Prevents the whole document from shifting horizontally after an experience arrow is clicked.
- Locks the selected layout inside the stage at desktop, laptop, tablet, and phone widths.
- Adds safer desktop column sizing and interior padding.

## Streams world-physics revision

- Increased the number of downstream digital-media platforms.
- Added more optional side-route and ambient platforms without removing the guaranteed route.
- Increased platform current speed and variation slightly.
- Increased horizontal movement and dash momentum slightly.
- Platforms remain in world space after leaving the camera and continue traveling according to their speed.
- Platforms and collectibles are removed only after reaching the waterfall world coordinate.
- Added a permanent waterfall point of no return beneath the starting region.
- When a jump is missed, the camera tracks the player downward toward the waterfall.
- Crossing the waterfall lip triggers a dedicated falling end scene.
- Vertical camera travel locks at the waterfall during the end scene while the character remains visible.
