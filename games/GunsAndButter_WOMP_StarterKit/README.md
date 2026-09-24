# Guns & Butter — The Tempest Pavilion

An offline first-person museum with one complete selectable exhibit: the Tambourine Tempest.

## Play

Open index.html in a modern browser with hardware acceleration. All runtime textures are embedded in the bundle, so no installation or internet connection is required. PLAY.cmd or `node tools/serve.mjs` can optionally serve the same game locally.

Enter the museum, walk toward the Tempest, and press E to inspect it. Select OPERATE THE TEMPEST. The WOMP stays on its mount when you leave.

- WASD / arrow keys: walk; mouse: look.
- E: inspect or leave the station. Enter: operate from inspection.
- Hold mouse / Space: automatic fire. R: exchange the 18-pair cassette.
- C: start a 45-second moving-target recital. Reset Range: clear score and marks.
- Esc: close inspection/help or leave the station.
- Touch: movement pad, drag to look, hold FIRE, and the station buttons.
- Sound and reduced-motion controls are available in the HUD/briefing.

## The instrument

The articulated 3D Tempest fires modeled paired brass tambourine jingles from its actual muzzle. Projectiles travel, collide with plates, ricochet, and fall. The carriage, recoil spring, barrel, jingle ring, and cassette animate. Reloading has release, exchange, and seating phases. Targets rock under impact and retain bounded scuff marks. Center strikes earn 100 points, other plate hits 50; consecutive hits multiply the award up to five times.

The circular pavilion has Calacatta marble, black architectural details, fluted pillars, curtain-lined windows, an exterior garden panorama, a glass oculus, ring chandeliers, black artwork, exhibit interpretation, and a surrounding range.

## Development

Run `node tools/build-museum.mjs` after source edits. The build embeds Three.js, artwork, and textures into src/museum.bundle.js. It requires only Node's built-in modules. Source modules: palace.js, tempest.js, tempest-audio.js, tempest-museum.js, and reference-womps.js.

See assets/pavilion/ASSET-NOTES.md for generated image prompts, sound construction, and the model pipeline. The same static build is published through the site at `games/GunsAndButter_WOMP_StarterKit/index.html`. Visual performance depends on the device and GPU. Mobile uses a less expensive floor-lighting path.
