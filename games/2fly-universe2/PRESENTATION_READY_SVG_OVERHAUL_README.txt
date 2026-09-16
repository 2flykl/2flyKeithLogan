2FLY UNIVERSE — PRESENTATION READY SVG OVERHAUL

What changed:
- Replaced the baked-text pink placeholder-style orbital art with clean no-text SVG object assets.
- Added new presentation assets for I Was Away, I Woke Up in Africa, Streams, and Thru the Fire.
- Rebalanced 2025–2029 galaxy object positions to reduce crowding and improve spacing.
- Expanded Africa's footprint so it has the most real estate and widest ring system.
- Restyled orbit lines so they read more like a subtle transparent vinyl-record / galactic disc.
- Reduced child-label visibility distance to lower clutter.
- Included the nine generated reference sheets under assets/reference_sheets.

Primary files changed:
- app/scene/decorated-object.js
- app/scene/thru-the-fire-system.js
- app/scene/africa-system.js
- app/scene/streams-system.js
- app/scene/frontier-systems.js
- data/seed_universe.json
- assets/object_styles/presentation/*.svg

Notes:
- The new SVG icons are intentionally text-light to avoid cutout/overlay issues.
- Legacy object_style PNG files were left in place for archive purposes, but the runtime now points to the new SVG set for the refreshed systems.
