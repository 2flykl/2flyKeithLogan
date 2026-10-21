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

Revision 17 bundles `assets/audio/2fast-remix26-short-final-mix.mp3` as the soundtrack. Its measured duration is 141.306803 seconds, and the runtime uses that value as its offline fallback while still preferring browser metadata.

Revision 18 fixes Wix iframe scaling by sizing the game from the canvas's actual displayed bounds and observing container resizes. Intro aircraft and enemy art are capped for balanced wide and compact layouts. Embedded games now wait for the **Begin Descent** click so the browser grants the user gesture required to play **Too Fast** reliably. Diagnostics report the displayed viewport and resolved audio source for embed troubleshooting.

Revision 19 replaces the repeating modulo-driven waves with stage-aware randomized enemy mixes and six formation families. Consecutive waves cannot reuse the same layout. Occasional three- or four-bot mini squads move in a shared synchronized pulse, while the final swarm rotates among four synchronized geometries with randomized spacing, speed, bot mix, firing cadence, and arrival timing.

Revision 20 continuously replenishes approaching bots: three at the start, rising toward 15 before the Colossus and 20 before the Twins. Reinforcement delays shorten with each buildup and drop to 0.35 seconds when the sky is under half its target population. Inbound reserves count toward the target; a 26-enemy cap bounds regular combat. Colossus support remains lighter, and the old seven-second delay no longer persists after its defeat.

## Review candidate: hunter chase and projectile continuity (revision 22)

The normal-wave sections now have one hunter above 2Fly. It enters four gameplay seconds into freefall, with 2.4 seconds of entry grace. Down opens escape distance, but an aligned hunter gradually borrows that speed: a visible dashed wake and `DRAFTING / WEAVE` cue explain why a straight dive stops working. Steer away to break its draft. Up retains its existing zoom-out/air-brake behavior.

The hunter follows your earlier lateral path. Its delay ranges from 0.72 to 2.65 seconds with gap and obstacle speed, so a late dodge leaves it committed to your old lane. At most two pieces of orange-rimmed interceptor wreckage approach from below; a 0.9-second lane marker precedes movement. Pass close for charge, or bait the hunter into the wreckage for 150 points, 14% charge and 2.6 seconds of relief. A clean, steering dive adds 6.5% charge per second after 0.8 seconds without a hit. Existing passive/kill/projectile-graze charge remains.

A catch requires close alignment plus a 1.1-second visible wind-up. Steering cancels that wind-up; a catch costs one armor, pushes the hunter away and gives recovery time. Zero armor still restores armor and continues the full song. Sonic burst pushes the hunter to maximum separation for 3.4 seconds. Pursuit and new wreckage withdraw during the Colossus, Tempest Twins and finale, with fresh entry grace if regular waves return. Boss health, wave composition, music cues, soundtrack, art and camera tuning are unchanged.

Projectile cleanup now uses the camera-transformed viewport, with room for laser tails/glow/shake. Player rounds that exhaust their lifetime and enemy rounds cleared by burst, recovery or boss transitions continue moving through a harmless 0.3-second fade. Direct impacts retain visible sparks. Pausing freezes pursuit, charging and fades; replay clears every new transient state.

Additional dependency-free checks:
- `node tests/chase-mechanics.cjs`: initial safety, escape versus drafting, delayed pursuit, warned catch/evasion/recovery, real moving-player obstacle bait at 390/1440/1920 logical widths, near passes, clean-dive charge/cap/burst, pause/replay, boss transitions, portrait warning and resize.
- `node tests/projectile-lifecycle.cjs`: all four camera-aware edges at zoom 0.72/1/1.12, complete laser tail, harmless moving fades, clear/recovery/boss paths, bounded lifetime, resize and restart.

These tests execute production JavaScript with modeled DOM/media/canvas APIs. They do not establish visual balance, actual touch response, asset decoding or audible playback. Desktop/mobile browser review is still required before production.

## Earlier review candidate: Hunter Crossfire and bot identities (revision 23)

At song time 0:28, the normal wave pressure briefly gives way to Hunter Crossfire. Only two basic bots remain active. Three large crescent hunters mark their lanes, sample the player's position at staggered moments, then dive together. A Down-and-sideways lane cut can make their already-committed paths cross. Holding one lane keeps their formation separated; pair crashes are physical swept collisions, not automatically awarded maneuvers. Three bounded attack cycles fit inside the segment. At 0:44 the hunters withdraw and the original Colossus assembly proceeds on schedule.

Hunter collisions with bots or wreckage now detonate a large friendly blast, destroying basic bots within a bounded radius of 105–195 logical units (responsive to width). The visible outer ring marks this radius. Each hunter impact can score once until it recovers; a pack pair is consumed for the remainder of that attack cycle. Pair collisions grant 400 points and 22% burst charge; individual crashes grant 150 and 14%. Nearby hostile rounds fade harmlessly. Blasts do not chain recursively through hunters or damage bosses/player. Existing armor recovery, damage grace, pause/replay and the full-song/finale rules remain.

Hunters now have larger code-native armored crescent silhouettes with distinct keel, fork and crown structures. Segmented circles, lock arcs, direction ticks, engine trails and player-ring steering notches react to pursuit, dive and input. Identification uses shape and marks as well as color. The new mint-white Prism bot uses three fins and a faceted diamond core; one appears in the first formation. Original scout/interceptor/shield/heavy sprites retain their dimensions with distinct restrained chevrons, exhaust, shield geometry or shoulder braces. No image asset, soundtrack, camera tuning or shared control script changes are required.

Run `node tests/crossfire-mechanics.cjs` in addition to the four earlier suites. It checks the 28–44-second segment and two-basic-bot cap; movement-driven three-pair bait at portrait/desktop widths versus no automatic stationary/Down-only pairs; bounded blast radius, no repeated/partial-pair scoring, swept crossing, harmless projectile clears, first-boss cleanup, pause/replay, resize and Prism spawning. Vector functions were also rasterized using native Canvas2D and inspected separately, with 312 render-state checks. Those contact sheets do not establish browser/in-game composition or original-texture accent quality. Full desktop/mobile visual, touch and audio review remains required before production.

## Current review candidate: armored pursuit (revision 24)

Replaces revision 23's Prism bot and repeating fade/reform cycles. The three-fin geometry is now a spinning orange/coral hunter projectile: an 0.85-second warning precedes a straight, non-homing shot, with 6.5–9 seconds between shots. Hunter hulls remain opaque, enter and withdraw through movement, and display eight armor pips. Every touched regular bot is destroyed regardless of its HP and costs one hunter armor point. The eighth contact destroys the hunter; hunter pairs always destroy both participants, including while stunned. Wreckage remains a lethal bait obstacle. Large hunter blasts retain bounded, non-recursive damage and cannot damage the player or bosses.

Crossfire retains its 28–44-second music window but now replenishes synchronized six-bot squads up to twelve approaching targets. Three persistent hunters seek separated lanes, visibly acquire a lock, then mirror player movement with short staggered delays before tracking again. The delay provides a lane-cut bait opportunity; Down increases escape separation and clean weaving charges the burst. Survivors fly out at the Colossus transition. The solo hunter can return six seconds after destruction while its chase segment is active.

Updated regression coverage verifies removal of Prism enemies, synchronized squads, eight-impact armor, unconditional contact destruction, lethal hunter pairs, sparse warned spinning shots, delayed mirrored motion, constant hull opacity, fly-out cleanup, bounded history, and restart at portrait/desktop widths. All five Aviator suites plus Tiger Call lifecycle and Streams resize suites pass. Physical-device touch and subjective difficulty remain playtest work.

## Hunter / twin tactics (revision 25)
Hunters carry red X markings and coral armor rings. Locked pack pursuit uses delayed movement with bounded speed and smoothed turning, followed by reacquisition. Three hunters join the Tempest Twins: direct swept contact destroys the hunter and removes 28 boss HP once. Twins drift higher, retain aimed fire, and leave room to slip beneath them. Lower-edge movement transfers into additional sky travel while dive velocity remains active.
All five Aviator suites pass, including portrait/desktop twin collision and lower-lane checks. Browser visual QA for this revision was blocked by browser URL security policy; appearance and subjective control feel still need local playtesting. No production deployment.

## Charged power orb (revision 26)
Holding fire (Space or touch steering) continues normal shots and charges an automatic orb after 1.4 seconds. It detonates after 0.65 seconds with radius 195/235/275/315 across effective weapon levels, including temporary power boosts. A 3.8-second recharge precedes the next charge. Releasing cancels partial charge; pause freezes simulation; replay clears orbs. Blasts damage nearby enemies, hunter armor and exposed boss targets, respect Colossus shielding, and clear nearby hostile shots without hurting the player. HUD shows charge/recharge status. Hunters shoot every 3.2-4.6 seconds, acquire locks sooner and close faster while preserving a diving escape opportunity.
All five automated Aviator suites pass, including charge cancellation, cooldown, blast range, safe self-damage behavior, upgrade radius and restart. Browser visual/audio QA remains pending because local browser access was blocked by policy during this revision session. Not deployed.

## Inverse pursuit and triple-tap orb (revision 29)
Three distinct fire presses within 0.75 seconds release an orb; key repeat and holding fire do not. Touch uses three pointer-down taps. Slow taps expire, pause clears partial gestures, and the existing 3.8-second cooldown remains. Orbs still float upward and grow with weapon power.
Hunters have ten armor points. Twin-fight hunter slots replenish 4.5-5.9 seconds after destruction, capped at three simultaneous pack hunters. Up draws hunters toward the bottom before they close back toward the player using inverse lateral tracking. Active hulls stay within zoom-aware frame bounds and point their noses at the player. Pair collisions and boss rams remain lethal to hunters. Surviving hunters withdraw when the encounter ends.
All five automated Aviator suites pass, including triple-tap timing, cooldown, inverse approach, reinforcement and portrait bounds checks. Browser visual playtest remains pending due to the previously reported browser access policy block. Not published.

## Orb palette and shootable hunters (revision 30)
Orbs use a white-to-blue-to-orange radial gradient, blue rim and orange glow. Blast rings and particles share the orange/blue/white palette. Player shots now use swept relative collision against active hunters, consume one projectile per impact, reduce hunter armor and award the existing crash reward on destruction. Triple-tap activation, upward drift and blast scaling remain unchanged. Focused hunter, full-mission and projectile lifecycle suites pass. Visual QA remains pending; not published.

## Rapid orbs and readable hunter rounds (revision 31)
Hunters retain their spinning three-fin projectiles, now enlarged for visibility with matching cleanup bounds. Triple-tap orbs have only a 0.12-second anti-duplicate cooldown and may overlap. Orb bodies are modestly larger, and blast radius scales 220/265/310/355 with weapon level. Orange/blue/white coloring and upward drift remain. Hunter/orb, full-mission and projectile lifecycle tests pass; visual playtest remains pending. Not published.

## Varied chase arrivals (revision 32)
Hunter Crossfire now draws from a five-pattern shuffled bag (chevrons, staggered lines, paired columns, diagonals and scattered arrivals) with no consecutive pattern repeats. Groups vary from two to six bots with randomized entry lanes/depth, speed, sway, bot mix and arrival intervals. Coordinated groups retain shared motion; scattered groups move independently. Existing twelve-bot pressure cap and fast replenishment remain. Deterministic tests cover pattern/count/timing variety, portrait bounds and capacity; full-mission simulation passes. Visual playtest remains pending. Not published.

## Pre-boss hunter replenishment (revision 33)
Destroyed crossfire hunters now return after 2.2-3.1 seconds, keeping up to three hunter slots in circulation until the Colossus cue at 44 seconds. The varied regular-bot formations continue alongside them. Twin-fight pacing is unchanged. Portrait/desktop replenishment and boss-transition tests plus full-mission simulation pass. Not published; visual playtest pending.

## Production release 34 — October 20, 2026
Promotes the reviewed Aviator hunter/orb changes onto current production without importing unrelated review-branch game changes. The game title screen and catalogue entry carry the release date. All five Aviator suites pass on the production-based release tree; audio assets are unchanged (Too Fast Remix 26 Short Final Mix). Shared Escape handling allows this game's pause handler and preserves default navigation for other games.
