# WOMP reference edition

The three available WOMPs are reconstructed as real-time 3D models from the supplied `assets/live_v2/sheets` reference boards. The boards remain the design authority; this is a modeled interpretation rather than a pixel-identical reproduction of the illustrations.

- CD Double Barrel: twin holographic blue/purple barrels, pink capsules, gold foregrip, rainbow rear discs, and three discs below the muzzle.
- Tambourine Tempest: open black/gold stock, cyan musical staff receiver, scope, tambourine grip surround, and illuminated drum magazine.
- 808 Blaster: red handgun silhouette, angled grip, five-speaker bank, large bass speaker, orange upper panel, and violet waveform muzzle.

Projectiles are camera-facing musical-note geometry with bright cores and colored glow. CD uses paired sixteenth notes, Tempest uses eighth notes, and 808 uses larger paired notes with bass rings. Impacts add expanding rings, sparks, and drifting musical notes; reduced-motion mode reduces particles.

The hall uses violet, cyan, and amber lighting, illuminated lane rails, and a back-wall equalizer. Target colors retain their gameplay meaning. Weapon HUD accents follow the selected WOMP.

Press I to inspect a WOMP from the side. Touch players use VIEW. Firing exits inspection and re-aligns the actual muzzle before the shot. Existing scoring, ammunition, reloads, timed sessions, practice, and replay remain intact.

Validation: seven rules tests; Chrome direct-file launch; all three weapons fire and reload; muzzle direction agrees with aim; pause, full timed session, results and replay; mobile fire and swap. A second browser pass checks final materials, musical-note creation, inspect-to-fire, and mobile inspection. Evidence is in QA/reference-*.json and screenshots.

Open index.html directly. Rebuild the bundled script after source edits with `node tools/build-offline.mjs`. No runtime network dependencies.
