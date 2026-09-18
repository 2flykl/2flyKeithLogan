# Readable stereo faceplate

Music Page 2 replaces the small photographed controls with one integrated brushed-metal receiver faceplate. The disc slot, larger display, raised labeled transport keys and rotary volume control form the center unit. Existing playback, disc selection, volume and color actions remain shared with the HUD. Binder page arrows now flank the book instead of occupying a separate row below it.

Display and both speaker rings use the same `stereo-unison` CSS animation, duration and playback state. The selected LED color applies to all three. Paused/stopped media does not pulse; reduced-motion preferences suppress the animation. This is synchronized decorative lighting, not an audio-frequency analyzer.

Local browser QA: physical play/pause/stop, next disc, volume up, color selection, next/previous binder pages; confirmed matching computed brightness, animation name and duration on all three lit surfaces, and animation `none` after stopping. Desktop visual review and 390px mobile review completed. Mobile retains the large HUD transport controls alongside the compact scene. JavaScript syntax and diff whitespace checks passed. Existing generated room artwork is reused; no new raster generation.
