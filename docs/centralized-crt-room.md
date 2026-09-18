# Close-up CRT / VHS room

Video Page 2 (`pages/site-overhaul.html#videos2`) uses one controller in `js/site-crt-room.js`. The previous alternate-page controller was removed from `site-media-pages.js`; its route delegates to this controller and retains its cleanup callback. The original Video route remains separate. No MutationObservers or runtime patches were added.

## Behavior

One HTML video element supplies time, duration, volume and playback events. Tape selection, channel dial, screen controls, VCR transport, picture effects and archive reels share the same state. Channel order is Streams, I Was Away, Thru the Fire, I Woke Up in Africa. Africa retains its ten chapter choices. Unreleased projects are non-interactive archive entries.

Selecting a tape starts playback. Clicking the glass toggles controls. Power off pauses; powering on retains the position without autoplay. Stop resets to zero. Eject removes the source. The slot reinserts the selected tape. Rewind/forward skip ten seconds; Be Kind and Rewind pauses and progressively seeks to zero over 1.4 seconds. Selection, transport and power actions cancel pending rewind work. Route cleanup aborts listeners, timers and animation frames, and unloads the video.

Physical controls align with the photographed equipment. Large remote controls provide touch-friendly equivalents. The volume dial supports circular pointer dragging and arrow/Home/End keys. Picture effects use a single cycle button and persist across channel changes. Fullscreen toggles the CRT including its controls. VHS reels animate only during playback or rewind; reduced-motion preferences disable decorative animation. Mobile places the compact tape HUD immediately below the TV, ahead of the remote, so the rewind button is visible in the tested initial view.

## Browser verification

Checked the local page in the Codex browser at desktop, 768×1024, 390×844 and 320×740. No horizontal overflow or console errors observed. Confirmed all four tapes start the matching video, CH 04 wraps to CH 01, Africa chapters render, and unreleased entries do not load sources. Verified physical play/pause/stop, ±10-second transport, eject/source removal, slot reinsertion, seek, mute/volume, keyboard dial adjustment, picture cycle and persistence, power pause/indicator, screen overlay and fullscreen enter/exit. Rewind showed reverse-reel state and decreasing actual time before ending paused at zero with OSD restored. Selecting another tape during rewind cancelled the old operation. Music Page 2 still loads and plays; entering Video Page 2 pauses its global audio.

Media remains hosted on the existing Wix video URLs; network speed and browser playback policies affect loading. Testing used browser playback state and controls, not a physical speaker/listening-device audit. No claim of device-lab coverage or guaranteed offline playback.

## Image provenance

Mode: image edit / precise object edit, using the existing `assets/media-rooms/vhs-room.webp` as reference. Generated with the built-in image-generation tool, then encoded as WebP (quality 88) without compositional edits. Saved asset: `assets/media-rooms/crt-close-room.webp` (1536×1024). Tape labels and all controls are accessible HTML, not generated lettering.

Prompt:

> Use case: precise-object-edit. Website scene plate, photorealistic 1536x1024 landscape. Rebuild the reference walnut floor-console CRT television and black VHS VCR in a much tighter front-facing close-up. Remove couch, foreground table, plant, all foreground objects and clutter. Television fills x4%-96%, y28%-96%, huge dark blank curved CRT glass at left and physical channel and volume knobs on a narrow right panel. Black 1980s VCR placed on top of television, center-right, x44%-88%, y15%-28%. Its front must be clear, with a real short tall rectangular VHS tape loading flap, illuminated blank display and six visible transport buttons. Leave clear horizontal space on television top to LEFT of VCR x8%-39% for two selectable tape spines to be rendered by code. Leave clear space immediately above the VCR x51%-83%, y5%-15% for two more tapes rendered by code. Do NOT paint tapes in those spaces, code will add accurately labeled interactive tapes. Two large distinct TV knobs on right side, small power button with indicator beneath; everything unobstructed. Warm wooden panel wall and subtle amber light only, minimal background, no couch, no furniture or objects in front. Strong premium woodgrain and metal textures, convincing analog glass. No text, logos, or watermarks. The TV picture is blank dark charcoal, no video content. Straight on, minimal perspective for perfectly aligned interactive screen and controls.
