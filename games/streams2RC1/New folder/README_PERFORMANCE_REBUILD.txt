STREAMS PERFORMANCE REBUILD

This build targets the progressive slowdown/freezing issue.

Rendering changes:
- Internal canvas resolution is capped to ~1.6 million pixels regardless of monitor/DPI.
- Removed four animated full-screen tiled water passes; uses one lightweight water pattern.
- Removed expensive per-object canvas blur/drop-shadow filters.
- Reduced animated water curves.
- Caps particles at 96.
- Caps ambient fish at 7.
- Keeps physics and gameplay coordinates unchanged.
- Keeps runtime-optimized character sprites.

Run START_STREAMS_PERFORMANCE_REBUILD.bat
