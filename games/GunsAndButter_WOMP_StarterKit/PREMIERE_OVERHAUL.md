# Guns & Butter — Premiere Studio Range Overhaul

## Creative direction

The range now combines grounded tactical readability with the saturated identity of a professional music studio. It remains an original Guns & Butter experience; it does not reproduce another game's branded art or assets.

## Major changes

- Added a full acoustic live-room treatment: observation glass, wall absorbers, vocal microphone, rack equipment, mastering meters, lane speakers, and animated pressure rings.
- Connected the speaker cones, waveform rings, LEDs, and back-wall equalizer to a live Web Audio analyser, so the room moves with the song rather than playing a canned loop.
- Analyzed `Guns and Butter 3.mp3`; the strongest detected key is C-sharp minor. Pitched WOMP layers and result stingers use notes from that key.
- Reworked all three projectiles:
  - CD Double Barrel launches visibly spinning iridescent compact discs and can ricochet through nearby valid targets.
  - Tambourine Tempest fires rapid musical-note projectiles with layered jingle/noise transients and pitched C-sharp-minor accents.
  - 808 Blaster launches a compressed bass-pressure orb with animated sub rings, stronger recoil, and an expanded impact radius.
- Added warm-brown visible hands and forearms with tactical cuffs to ground the first-person presentation.
- Upgraded targets with heavier housings, fasteners, armor plates, hit pulses, wobble, spawn animation, and distinct movement logic for normal, bonus, armored, and hazard targets.
- Refined the menu, HUD, reticle, pause/results panels, and mobile breakpoint.

## Verification

- Offline bundle rebuilt successfully.
- Seven gameplay/raycast/scoring tests pass.
- Desktop browser: menu, start, all three WOMPs, switching, firing, reload, pause/resume, timed results, and replay checked with no new console errors.
- Mobile 390×844: no horizontal overflow; menu, full-screen canvas, touch controls, weapon swap, and fire checked with no console errors.

## Music playback hotfix

The song uses the browser media element's direct output path. This avoids a Web Audio security behavior that can silently zero a `MediaElementAudioSourceNode` for some local-file/origin configurations even while its playback clock advances. The reactive room remains synchronized to the song clock, and WOMP sound effects continue through Web Audio. Playback was verified through both `PLAY.cmd`/localhost and direct `index.html` launch: loaded, unmuted, 35% volume, clock advancing, and no playback rejection.

## Launch

Run `PLAY.cmd`, or run `node tools/serve.mjs` and open the printed local URL in a WebGL-capable browser.
