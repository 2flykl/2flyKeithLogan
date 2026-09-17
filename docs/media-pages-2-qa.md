# Music Page 2 and Video Page 2

## Scope

Adds `#music2` and `#videos2` to `pages/site-overhaul.html`, accessible through the new **PAGE OPTIONS** navigation disclosure. The original music and video destinations remain available.

The listening room emphasizes full cover artwork, project context, a single shared audio engine, track selection, seeking, volume, and related video/playable links. The screening room provides a native widescreen video player, project notes, documentary chapter navigation, replay, and a filtered collection of available films. Both render from `data/projects.json`; unavailable future releases are not presented as playable media.

## Audit findings addressed

- The existing pages place substantial decorative stereo/TV furniture ahead of media and controls. The alternatives give artwork and films more space and use readable, touch-friendly controls.
- The original music catalog uses a fixed list of five IDs. The new catalog includes any project with an audio source; the video catalog includes any project with playable clips or a video source.
- A shared-shell click handler matched the body's `data-route` attribute for ordinary button clicks. This immediately closed mobile navigation and could prevent native control defaults. Route interception now targets actual navigation anchors and buttons.
- New video playback is user initiated (`preload="none"`); catalog images are lazy-loaded and dimensioned. Only one video element exists, and the music room reuses the existing global audio element. Route cleanup aborts page listeners, restores the audio end handler, and releases the video source.
- Entering the screening room pauses background music; starting music and video cannot overlap within that room.

## Validation — September 17, 2026

Tested locally against the cloned production source using the in-app Chromium browser and the existing real Wix media URLs.

- JavaScript syntax checks and `git diff --check` passed.
- Both pages loaded directly by hash; navigation dropdown and browser Back worked.
- Desktop layouts visually inspected at the browser's initial approximately 1265-pixel width; phone layouts visually inspected at 390 × 844.
- Both pages measured without horizontal document overflow at 320, 768, and 1440 CSS-pixel viewport widths. Collections changed column count with width.
- Mobile hamburger stays open; PAGE OPTIONS expands and Music Page 2 navigates and closes the menu.
- Keyboard Enter opens the disclosure; Escape closes it and returns focus to the summary.
- Audio playback time advanced for Thru the Fire and Gettin' It; track switching to Streams worked. Pausing, keyboard volume adjustment, and seeking to the end were exercised. End-of-track wrapped from Gettin' It to Thru the Fire exactly once.
- Video playback time advanced for Streams and the documentary chapter The School. Starting video paused the audio player. Selecting I Woke Up in Africa exposed ten chapter buttons.
- Documentary filter displayed only the documentary project.
- Soundtrack link from the Africa video project selected the Africa record in Music Page 2, even when a different audio source had previously been loaded.
- All six music-page artwork instances loaded successfully during inspection.
- Original music room rendered five discs; original VHS room rendered nineteen tapes. Home and Playables loaded; Playables rendered ten library cards.
- No console errors or warnings were captured during new-page testing; no errors were captured in the subsequent route smoke checks.

## Limits

Responsive checks emulate viewport sizes, not physical iOS/Android hardware. Playback was verified through advancing browser media state, not a subjective audio-quality review. External media availability remains dependent on the existing Wix hosting. The original pages' pre-existing styling and media architecture were not comprehensively refactored. No production deployment or load-test claim is made by this report.

## Files

- `css/site-media-pages.css`: scoped alternate-page and dropdown styling.
- `js/site-media-pages.js`: catalog views, media controls, filtering, and lifecycle cleanup.
- `js/site-router.js`: new routes, cleanup, current-link semantics, dropdown close on route changes.
- `js/site-overhaul.js`: restrict route interception to actual route controls.
- `pages/site-overhaul.html`: dropdown, assets, and cache version updates.
