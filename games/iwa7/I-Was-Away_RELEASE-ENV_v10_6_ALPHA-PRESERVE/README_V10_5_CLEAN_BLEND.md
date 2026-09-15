# I Was Away — Release Environment v10.5 Clean Blend

Environment stabilization pass focused on presentation continuity.

## Changes
- Recut/defringed all existing environment PNG alpha edges without white/gray color-keying.
- Protected real light detail inside rocks, trees, grass, and flowers while removing matte contamination from translucent edges.
- Added a blue upper-sky gradient and Firefly cloud panorama above the landscape.
- Feathered the landscape panorama at both top and bottom so image edges disappear into sky and terrain.
- Forced sky/panorama layers to background-only render order so they cannot draw over characters from any orbit angle.
- Softened the horizon transition to reduce the colored ring where 3D terrain meets distant photography.
- Preserved v10.4 textured ground, gameplay, character states, boomerang logic, music, controls, and launcher.
