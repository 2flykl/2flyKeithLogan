# Guns & Butter — WOMP Target Range Revamp

## Reference edition
The three WOMPs are reconstructed from the supplied reference sheets, with their original silhouettes, musical details, and color schemes. Music-note projectiles, colorful impact bursts, and a violet/cyan/amber target hall replace the earlier generic treatment. Press I (or VIEW on touch) to inspect. See REFERENCE_EDITION.md for details and verification.

## Launch
Extract the complete ZIP, then double-click **index.html**. No server or Node.js is required.

Optional: run **PLAY.cmd** to use the local HTTP server (Node.js required for this option).
Or run `node tools/serve.mjs` and open http://localhost:4173.
No npm install, build, account, CDN, or network access is required. The classic-script bundle supports direct file opening and HTTP hosting. Rebuild it after source edits with `node tools/build-offline.mjs`. Modern WebGL browser required.

## Play
Choose CD Double Barrel, Tambourine Tempest, or 808 Blaster. Start a 75-second score attack or untimed practice session. Mouse aims, left click fires, right click focuses, R reloads, 1–3 switches, Escape pauses. P optionally locks the pointer. Arrow keys aim and Space fires. On touch screens drag to aim and use FIRE/RELOAD/SWAP; landscape recommended.

Cyan records score points, gold doubles points, red × records cost 200 points and reset the streak. Armored records take more damage. Center hits score 50% more. Every four consecutive hits raises the multiplier, capped at ×5. Misses, expired records, and 3.5 seconds without a hit reset the streak. Three timed acts increase movement and reduce target lifetime. S rank starts at 14,000, A at 8,500, B at 4,000. Personal best persists locally. Practice does not overwrite it.

## Weapons and alignment
- CD: two independent barrel shots, five spread rays per shot, 1.25-second reload.
- Tempest: 18-round automatic tambourine, 0.115-second cadence, 1.45-second reload.
- 808: three heavy shots, 0.85-second cadence, 2.5-unit area blast, 1.9-second reload. Splash can hit hazards.

All active weapons are actual procedural 3D geometry, with +Z forward and Y up. Camera center ray selects the closest rendered target, otherwise the back-wall point. Each individual barrel's lookAt wrapper converges on that point. Its local +Z muzzle object supplies the flash position, tracer origin and shot direction. CD's secondary rays have intentional spread; the central ray stays exact. Recoil translates the mount and alignment is recomputed before each shot. Targets use the same centers/radii for rendering and analytic nearest-plane ray intersection; no discrete projectile tunneling. Shot accuracy is counted once per trigger, not per pellet or splash victim.

## Inventory and preservation
The supplied folder path was absent. The existing source was found at `C:\Users\2flyk\Documents\GitHub\2flyKeithLogan\games\GunsAndButter_WOMP_StarterKit`.
The original contained 210 files (~144 MB): canvas prototype, multiple presentation patches, eight weapon records, 157 image references, and two music files. The active mirrored DOM weapon overlay was independent of muzzle/projectile simulation. Projectile collisions used approximate normalized screen rectangles; presentation wrappers and audio keepalive timers overlapped the game lifecycle. Original audio defaults also interpreted missing storage keys as zero.

The entry point loads src/range.bundle.js, built from src/range.js, src/art.js, src/rules.mjs and the vendored MIT Three.js runtime. Existing artwork, music, data and legacy scripts are preserved as source/reference material, but legacy extra weapons are not selectable. Original index and README are backed up in legacy/. The supplied song is reused; procedural instrument sounds add immediate fire/hit/reload feedback. No unrelated game files were changed. No production deployment was made.

## Verification
`node tests/rules.test.mjs` runs seven dependency-free tests: exact weapon scope, occlusion, 27 aim-angle/distance combinations, misses/dead/backward/parallel rays, per-trigger accuracy, combo/hazard/rank rules, and deterministic generation. Browser evidence is in QA/.

## Limits
This is a stylized stationary arcade range, not a locomotion FPS. Geometry is procedural, rather than production skeletal weapon art. Hits are instantaneous with short visible tracers. Music playback and AudioContext state were checked programmatically; subjective loudspeaker listening and physical phone performance were not verified. Original reference assets account for most ZIP size. The local server is for local use, not production hosting.

