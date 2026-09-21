# Return of the Aviator — Freefall

Revision 13 makes freefall a continuous full-song campaign with recovery instead of early game-over. Revision 11 replaced the active four-act driver/platformer with one continuous aerial combat mission. Earlier scripts and assets remain archived in place; `index.html` now loads `freefall.js` and `freefall.css`.

## Play

Serve this folder with any static HTTP server and open `index.html`. No build, package installation, or backend is required. The explicit `?autostart=1` integration remains supported. Exit returns to `../../#experiences` or sends the existing `closeExperience` message when embedded.

- WASD / arrows: steer. Down adds a smooth 22% cloud-flow boost, wind streaks, and slightly faster fire. Each fresh vertical hold triggers one six-second camera breath: Down pushes in then returns to normal; Up widens then returns. The camera stays at normal scale if the key remains held. Pointer movement uses the inverse camera transform.
- Hold Space: fire downward. Shift: sonic burst when charged.
- Touch / pointer: hold and drag to steer and fire. Touch the sonic burst button to clear nearby enemies and projectiles.
- P / Escape: pause. Losing focus or hiding the page also pauses and releases held controls.
- Seven kills drop an upgrade; alternating drops grant nine seconds of triple shots or restore one armor point.
- Chain kills for multipliers up to 5×. Graze incoming shots for bonus score and burst charge.
- At the provisional 0:44 first-verse cue, eight drones assemble into the Colossus across the lower sky. Destroy every section to expose the core. The mission continues to the end of the 142.159-second track; survive with the core destroyed to win. Armor reaching zero restores armor, clears nearby danger, gives three seconds of protection, and costs up to 500 points. It does not stop the song or freefall. Both results support replay. ASSEMBLY_CUE in freefall.js is the editable approximate verse boundary.

## Presentation and state audit

The previous cloud layer was an opaque background. New alpha cloud artwork supports three independently scrolling depths. The supplied day, golden-hour, and dusk references are local sky assets. Clouds receive dusk lighting at runtime. Camera motion, steering, and projectiles use elapsed time with a fixed 120 Hz simulation and a bounded catch-up window.

2Fly's existing identity is retained. The neutral head-down pose anchors the new rotation cycle; firing blends smoothly into its paired recovery pose, and hit feedback overlays the current silhouette. The rotation sheet supplies axial turns; a separate two-frame firing sheet replaces the prior firing cells with tucked-head, straight-arm poses and a partly zipped jacket, with a bald head and unmarked white jacket back. Alpha bounds are recorded for identical HTTP/file rendering. Steering triggers two eased revolutions over 4.8 seconds and does not endlessly retrigger while a direction stays held. The approved original dive remains the neutral anchor. All poses render at one 220-unit target height on desktop, adaptively reduced in portrait. Alpha bounds normalize the visible cutout instead of the padded source rectangle. The tucked firing silhouette keeps the head behind the leading arms. Legacy ground poses are not used in the new aerial mission.

Scouts and the boss receive newly cleaned cutouts; the old scout had a detached numeric label and the boss included a grid and state label. The interceptor, shield, and heavy retain their established designs. Explosions use additive sparks, debris, expanding rings, and bounded camera shake. Reduced-motion preference suppresses shake.

## Assets and audio

`assets/freefall/sky-day.png`, `sky-gold.png`, and `sky-dusk.png` are the three user-supplied screenshots, copied locally. `cloud-bank.png`, `scout-clean.png`, `boss-clean.png`, `hero-states.png`, `plane-longwing.png`, and `hero-fire-tucked.png` were produced with the built-in image-generation tool. Prompts are recorded in `ASSET_PROMPTS.md`.

The existing Too Fast music URL is retained. The track plays once. Its playback clock drives assembly, sky progression, and mission completion, with a measured-duration fallback when audio is unavailable. Music requires network access and a user gesture; failure does not block gameplay. Synthesized combat effects run locally through Web Audio. Sound toggle controls both music and effects. Local storage saves a best score when available, with a safe fallback when storage is restricted.

## Validation

Run `node tests/freefall-mechanics.cjs` for the dependency-free simulation suite. It covers intro, steering, firing state, pause input reset, swept collision, damage grace, burst clearing, full mission/boss victory, replay reset, armor recovery, sustained-key camera return, and portrait touch bounds. An additional idle-player test completes the entire track without invulnerability. The test's invulnerability is restricted to its harness to evaluate full mission progression; it is absent from normal gameplay.

Browser QA uses desktop and touch-enabled mobile Edge via Playwright, including portrait and landscape, local asset/network errors, keyboard and touch controls, pause/resume, audio playback/muting, and day/dusk screenshots. `window.aviatorDiagnostics()` exposes read-only snapshots for QA.

The intro now shows three interceptors firing at the long-wing aircraft, impact flashes, a split fuselage, and 2Fly ejecting into freefall. Daylight develops a cloud-occluded sun and golden skyline, then a setting sun and deep blue/violet storm haze. Camera transforms affect the world, not the HUD. Destroyed Colossus modules become falling wreckage, award points/charge, and periodically release armor pickups. Core shields visibly deflect shots and explain the remaining outer sections.

Revision 13 Colossus tuning: eight sections at five hits each, followed by a 55-hit core (95 total, previously 270). Destruction grants armor and resumes incoming waves. Only the full-song result screen ends the freefall mission; no old driving or platform scenes are referenced by the active game.

Revision 14: Up peaks near 0.73x zoom with a mountain reveal; Down adds eased terminal-velocity steering, stronger near-cloud parallax and wind trails; Up adds drag and a 32% slower background flow. Final 36 seconds introduce two 46-hit Tempest cores with bounded pursuit and staggered telegraphed fire. Rain, close cloud banks, soft six-second lightning envelopes (disabled for reduced motion), blue-violet shading and golden foreground glare complete the weather progression. Defeat both final cores for victory at the end of the track. Any surviving Colossus drops away as the storm pair enters.

Revision 15: camera-aware lower movement limit keeps the full hero just inside the bottom edge. Held Down now ramps cloud flow to 3.5x and enemy approach to 1.8x, with longer wind trails and quicker acceleration. Supplies arrive every 12 seconds after an initial 8-second drop; every fourth kill drops an additional pickup. Pickup attraction reaches 250 units. Permanent weapon tiers advance at 24/58/92/118 song seconds (2/3/5/7/9 bolts); temporary supplies boost one tier for 12 seconds. Upper tiers use larger cyan/violet/gold bolts, double damage at tiers 4–5, contact sparks and small impact shakes. Boss destruction has a stronger bounded shake; reduced-motion suppression remains in place.

Revision 16 replaces the previous five-tier weapon path: single circular pellet, larger double glow pellets, triple glowing lasers, then a five-pellet rapid Prism Spray unlocked only after both Twins fall. Each final volley cycles its border glow color. Twins now have 100 HP each and enter 48 seconds before track end. Their defeat triggers a four-second storm intensification and repeated synchronized three-row formations of one-hit bots. The final swarm lasts at least 14 seconds; a late Twin defeat may extend gameplay beyond the music's final note. Existing full-song timing remains the minimum mission duration.
