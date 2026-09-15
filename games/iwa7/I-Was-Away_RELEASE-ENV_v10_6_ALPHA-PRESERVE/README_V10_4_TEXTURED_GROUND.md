# I Was Away — Release ENV v10.4 — Textured Ground

This build keeps the v10.3 panoramic/sky/environment work and replaces the visible gameplay floor with the new Firefly-generated photoreal ground textures.

## Ground implementation
- `main_ground.png` is the primary repeated playable surface.
- `dirt_gravel.png` is used for the worn footpath.
- `alpine_meadow.png` is used as subtle meadow variation.
- `transition_rocky.png` is used around the rocky overlook / transition zone.
- Small feathered texture patches break up repetition without changing collision.
- The underlying Three.js terrain mesh still handles height, placement and gameplay collision.

The original modular ledge sheets are included in `environment_textures/` for future edge/cliff dressing.

Use `START_I_WAS_AWAY_TEST.bat` on Windows, or serve the folder from a local web server.
