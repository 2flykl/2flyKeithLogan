# FlyZone Deployment Bridge

## What this package fixes
- New multi-engine UI replaces the old single Generate overlay.
- Background-video layer is preserved and intentionally separate from the interface.
- Existing voice WAV banks remain audio-only and now react to studio entry, engine changes, prompt-mode changes, production changes, generation, and result-ready state.
- Engine 2 now receives the actual prompt text.
- Engine 2 no longer reports READY when its backend bridge cannot be reached.

## Important: the uploaded ZIP did not contain the studio-console videos
The live Render version is displaying those videos from another source. Do not delete or re-encode them.

To keep those exact videos, place their existing URLs in `js/config.js`:

```js
videoSources: [
  'EXISTING_STUDIO_VIDEO_URL_1',
  'EXISTING_STUDIO_VIDEO_URL_2'
]
```

The interface will automatically render over the video and keep it muted so the 2Fly voice clips and generated music remain clear.

## GitHub vs Render
The public 2flyKeithLogan GitHub Pages website does not host FlyZone itself. It links to the Render app (`twofly-final-beta.onrender.com/studio/`). Therefore changing only the main website repo will not update the FlyZone interface unless Render is deploying that same source/repository/branch.

On Render, verify the FlyZone service:
1. Repository = the repository containing THIS FlyZone folder/app.
2. Branch = the branch you are actually pushing.
3. Root directory/build settings point at the FlyZone app.
4. Auto-deploy is enabled (or manually deploy the latest commit).
5. The `/studio/` route serves this new `index.html` or the equivalent built output.
6. The Engine 2 backend route `/api/suno` is available before showing Engine 2 as READY.

Do not change the GitHub Pages FlyZone link unless the Render service URL itself changes.
