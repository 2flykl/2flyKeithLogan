2FLY UNIVERSE V18 — Loading Screen Runtime Fix

Root cause:
The V17 browser-ready runtime loads /app/main.js directly. app/data/universe-data.js still contained Vite-only code: import.meta.env.BASE_URL. Because the direct browser module is not transformed by Vite, import.meta.env is undefined and Universe initialization could not complete.

Fix:
- Replaced Vite-only data URL construction with a runtime-safe URL relative to import.meta.url.
- Applied the same fix to root app/ and dist/app/.
- Preserved the V17 navigation, thruster, orbit, decoration and selection-only media behavior.
- Updated build marker to 2FLY-V18-LOAD-RESTORE.
