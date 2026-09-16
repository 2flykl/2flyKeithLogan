2FLY UNIVERSE — CELESTIAL PRESENTATION V3

Design correction:
- People who place stars are now represented as actual luminous visitor stars.
- Target/reticle-like visitor representations were removed from the star layer.
- Flagship project planets remain physical/abstract worlds rather than flat project icons.
- Audio, video, playable and archive content now render as physical 3D moons/planetoids, not interface badges.
- Existing era texture assets (ember, gold, glass, chrome, archive) are wrapped across real Three.js geometry.
- The visitor_stars_24 sprite sheet is now used for near-detail visitor-star variants.
- Media type is communicated through interaction/labels while the space scene remains celestial.

Primary changes:
app/scene/star-layer.js
src/scene/star-layer.ts
app/scene/decorated-object.js
src/scene/decorated-object.ts
app/scene/thru-the-fire-system.js
app/scene/africa-system.js
app/scene/streams-system.js
src/scene/thru-the-fire-system.ts
src/scene/africa-system.ts
src/scene/streams-system.ts

Important asset choices:
assets/spritesheets/visitor_stars_24.png
assets/era/planet_expansion_ember.jpg
assets/era/planet_expansion_gold.jpg
assets/era/planet_reinvention_glass.jpg
assets/era/planet_momentum_chrome.jpg
assets/era/planet_foundation_archive.jpg
