BLACK & GIFTED — VECTOR CHARACTER PACK v1

Purpose:
Replace the visible puppet/rig system with authored SVG animation frames.

Included:
- 00 Canonical Model / Anchor sheet
- AGE 15: Idle, Walk, Run, Jump/Turn
- AGE 20 Royal: Idle, Walk, Run, Jump, Turn/Stop
- animation_manifest.json
- integration rules

Design decisions:
- Large 4096x2304 SVG sheets
- 4 or 8 frames per sheet
- generous gutters between characters
- frame IDs for direct runtime selection
- one canonical facing direction only
- runtime mirrors the completed frame for left movement
- no legacy sprite sheets
- no raster character images embedded in the SVGs
