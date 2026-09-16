2FLY UNIVERSE V21 — EMBED-SAFE START

Fixes:
- Preserves the V13-style navigation/thruster runtime.
- Removes localStorage as a startup dependency.
- Safe when launched inside an iframe/modal where storage access can be denied.
- Uses one runtime only: app-v21.
- Root and dist launch the same runtime.
- If launch fails for another reason, the exact error message is shown on the launch screen instead of a generic retry message.
