# XPLAY Fresh Vision Flow

This merge pack replaces the creator experience from the upload screen forward with a fresh Gemini-first process.

## What changes

- Removes the visible "Original Creator / Screenshot Test / Reverse Forge" legacy split.
- Makes the primary source flow one clean image-to-PLX path.
- Step 2 uses the live Gemini multimodal service and **fails closed** if semantic vision is unavailable.
- No semantic local fallback is allowed to masquerade as Gemini.
- Step 3 becomes a full Gemini Vision Report with the detailed image description plus structured fields.
- Step 4 shows Gemini's top game-type fits but **the user locks the final engine**.
- Fresh Direction, Feel, Look, Extras, Review and Build pages.
- Review page creates an explicit build contract:
  - current source
  - verified Gemini vision
  - player/environment
  - user-selected engine authority
  - gameplay direction
  - feel/style
  - must-keep visual locks
- The final Build screen bridges into the existing XPLAY build wiring so the proven backend/game assembly code is preserved.
- Gemini analysis timeout is raised to 60 seconds.
- Adds a new clean responsive visual system for the creator flow.
- Creates a backup of `src/main.js` before patching.

## Apply

1. Extract this ZIP.
2. Copy the contents into the root of your `XPLAYEngine` repo.
3. Open PowerShell in the repo root.
4. Run:

```powershell
node .\APPLY-FRESH-VISION-FLOW.mjs
npm run build
```

5. If the build succeeds:

```powershell
git add .
git commit -m "Replace creator flow with Gemini-first Vision Flow"
git push origin main
```

## Important Cloud Run note

Your Cloud Build trigger was intentionally disabled while the Cloud Run secret binding was being stabilized. Do not re-enable automatic Cloud Run source deploy until its deployment config is guaranteed to preserve:

- `GEMINI_VISION_MODEL=gemini-3.6-flash`
- `GEMINI_API_KEY -> XPLAY_GEMINI_KEY:latest`

The live backend health endpoint should remain:

`https://xplay-api-246473132693.us-central1.run.app/api/vision/health`

and should report `ok:true`, `configured:true`, and `mode:"vision-drop-proven"`.

## Rollback

The patcher creates:

`src/main.js.before-fresh-vision-flow.bak`

before changing the file.
