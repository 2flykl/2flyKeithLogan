2FLY UNIVERSE — FINAL GITHUB TRACKING REPAIR

1. Extract this ZIP.
2. Copy everything INSIDE the 2fly-universe folder into your existing local repo folder:
   C:\Users\2flyk\Documents\GitHub\2flyKeithLogan\games\2fly-universe\
3. Choose Replace files in destination.
4. In that destination folder, double-click FIX_GITHUB_TRACKING.bat.
5. When it finishes, open GitHub Desktop.
6. You should now see runtime files under games/2fly-universe/runtime/ in Changes.
7. Commit and Push.

Why the BAT file is necessary:
Windows can treat folder-name capitalization as the same folder while Git tracks the spelling separately. Simply copying identical runtime files may therefore produce no GitHub Desktop changes. The BAT file resets only the Git tracking entry for this project folder and re-adds it using the canonical lowercase path. It does NOT delete your working files.

Critical runtime files included:
- runtime/main.js
- runtime/universe-shell.js
- runtime/vendor/three.module.js
- data/seed_universe.json
- index.html
