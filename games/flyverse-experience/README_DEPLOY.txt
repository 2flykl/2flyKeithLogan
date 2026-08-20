2FLY UNIVERSE — FLYVERSE EXPERIENCE

NEW FILE NAMING SCHEME
Folder: flyverse-experience
Entry:  flyverse-experience/index.html

Recommended repo destination:
  games/flyverse-experience/

Main-site link:
  games/flyverse-experience/index.html

IMPORTANT
- This is intentionally NOT named 2fly-universe.
- Do not restore or merge the deleted legacy 2fly-universe folder into this one.
- This build has no npm build step, no Vite, no runtime folder, no import map, and no external JavaScript dependency.
- It is designed for direct static hosting on GitHub Pages.
- All Universe data required to start is embedded in scripts/flyverse-data.js, so there is no startup fetch that can stall on a missing JSON file.

Files:
  index.html
  styles/flyverse.css
  scripts/flyverse-data.js
  scripts/flyverse-engine.js
  scripts/flyverse-ui.js
  scripts/flyverse-app.js

Deployment:
1. Delete the old games/2fly-universe folder from your LOCAL repo as planned.
2. Extract this ZIP.
3. Copy the entire flyverse-experience folder into games/.
4. In the main site, change the Universe link to:
     games/flyverse-experience/index.html
5. Commit and push.
