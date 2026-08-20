2FLY UNIVERSE — RESTORED WORKING BUILD

Canonical folder: games/2fly-universe/

This package restores the known-good production deployment architecture:
  index.html -> bundled assets/main-D9gvOE80.js
  module preload -> bundled assets/three-B6iN8XL-.js

The raw runtime/js import-map experiment has been removed from the deploy path.
The latest TypeScript source is preserved in src/ and the two strict-mode defects
(_ = navigator and _ = showLabels) have been corrected there.

DEPLOY:
Replace the CONTENTS of your existing games/2fly-universe/ folder with the
contents of this 2fly-universe folder, commit, push, and hard-refresh the site.

Do not create a second folder with different capitalization.
