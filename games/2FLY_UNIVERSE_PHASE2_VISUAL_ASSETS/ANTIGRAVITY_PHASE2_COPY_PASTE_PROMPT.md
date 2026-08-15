# ANTIGRAVITY — 2FLY UNIVERSE PHASE 2 CORRECTION + LIVING GALAXY PASS

Use the supplied `2FLY_UNIVERSE_PHASE2_VISUAL_ASSETS` folder. Inspect and preserve working systems, but correct the visual/spatial architecture decisively.

## 1. REMOVE THE CURRENT FAILURE
The galaxies are still visually linked by dark rectangular/block planes. REMOVE the actual source meshes/materials/CSS/Three.js planes, strips, bridges, cards, ribbons or rails connecting galaxies. Do not merely hide them behind another texture. Galaxies must be independent objects separated by large volumes of true 3D space.

## 2. HOME VIEW
Match the supplied reference direction: dark elegant starfield, independent vibrant galaxies, large negative-space gaps, readable labels, compact Galactic Navigator and Legend. Do NOT use the reference as a flat background. Build the composition in real-time 3D.
Use `docs/spatial_layout.json` as an initial scatter and visually tune it.
Use transparent `/galaxies/*.png`; preserve alpha. Use `/nebulae/*.png` only as soft depth accents. No hard rectangular edges.

## 3. LABEL EVERY GALAXY
Mandatory date labels: 2000–2004, 2005–2009, 2010–2014, 2015–2019, 2020–2024, 2025–2029. 2030–2034 may appear distant as UNCHARTED.
Use elegant astronomical/editorial typography. Labels face camera, scale/fade with distance and strengthen on selection. Do not invent permanent historical era names unless existing repository content supports them.

## 4. CAMERA / TRAVEL
Wheel/pinch zoom remains, but selection becomes spatial:
- click/tap galaxy -> cinematic camera fly-to that galaxy
- click region/planet/moon -> fly toward that object
- parallax + easing + deceleration
- user input immediately interrupts automated motion
- after ~6 seconds inactivity begin extremely slow orbit/drift; stop on interaction
- reduced-motion disables long flights/drift
- RESET VIEW smoothly restores Universe home camera
- RETURN TO LAST LOCATION restores previous spatial state

## 5. GALACTIC NAVIGATOR + LEGEND
Implement compact translucent overlays inspired by the reference:
MAP / LEGEND tabs, YOU ARE HERE, current galaxy/region/nearest system, RESET VIEW, RETURN TO LAST LOCATION, TAKE ME SOMEWHERE, CENTER ON CURRENT GALAXY.
Map destinations are clickable and initiate travel.
Legend:
Star=Visitor; Sun=Era-defining work/event; Planet=Major work/history; Moon=Related artifact; Satellite=Playable/interactive; Comet=Cross-era theme/person; Nebula=Creative period; Supernova=Transformative event; Asteroid=Archival fragment.
Do not let UI overwhelm the space view.

## 6. CANONICAL STAR RULE — CHANGE THIS NOW
ONE PRIMARY STAR PER USER/ACCOUNT PER GALAXY.
A user may have one star in every five-year galaxy, but never two primary stars in the same galaxy.
Enforce production uniqueness server-side on owner/account + galaxy_id. Local/demo adapter must emulate it.
If the current user already owns a star in the selected galaxy, change PLACE YOUR STAR to VIEW YOUR STAR.
Each galaxy-star has independent coordinates, message/signature and shareable Star Card.
Never expose private owner/account identity in public payloads.
Update schema/migration, tests, documentation and card logic.

## 7. ASSETS
Use:
`galaxies/*.png` independent galaxy sprites/billboards
`nebulae/*.png` feathered depth accents
`spritesheets/visitor_stars_24.png` + JSON
`spritesheets/navigation_effects_8.png` + JSON
`effects/distant_star_dust.png`
`ui/*.svg`
Do not stretch assets. Preserve aspect and alpha.

## 8. NO SEAMS / GAPS
Large black spatial gaps BETWEEN galaxies are REQUIRED.
The gaps to eliminate are rendering artifacts only: no rectangular alpha boundaries, white seams, tile edges, sprite gutters or nebula cutoffs.
Use procedural/dust star layers at multiple Z depths for continuity without filling the Universe with panels.

## 9. BUILD 2025–2029 AS THE FIRST LIVING GALAXY
After fixing home view, make 2025–2029 dramatically richer than the other galaxies. Search existing site assets and authentic current-era content. Curate, don't fabricate.
Prioritize authentic repository material for Streams, Thru the Fire, I Woke Up in Africa, Ebony Eyes, Return of the Aviator, and XPLAY/PLX/Playable Experiences where actually present.

Create exactly 3 configurable galaxy regions. Names remain editable.

### STREAMS — CANONICAL SPATIAL CONTENT PROOF
Create a beautiful water-inspired Streams planet/system.
Actual orbiting objects:
- Audio moon
- Video moon
- Archive/Artwork moon
- Playable Experience satellite
These are spatial bodies, NOT menu buttons.
Click -> camera approaches object -> content opens inside Universe shell.
Close -> exact prior Streams orbital camera is restored.
Use authentic existing media/routes where found. Never fabricate URLs.

Give other authentic projects distinct celestial identities based on their real assets rather than plain spheres with cover art pasted on them.

## 10. VISUAL QUALITY
Vibrant galaxy cores and arms must read clearly against black.
Use bloom selectively, atmospheric depth, dust, subtle nebulae, parallax and differing galaxy orientations/scales.
The home screen must immediately communicate: “These are separate galaxies scattered throughout a vast Universe.”

## 11. TEST/REPAIR LOOP
Do not stop at compile.
Implement -> build/test -> visually inspect -> repair -> retest.
Explicitly inspect:
- no connecting blocks anywhere
- home composition
- click-to-travel
- reset/return
- idle drift
- navigator/legend
- one-star-per-galaxy
- 2025–2029 entry
- Streams close orbit + media return
- 360x800, 390x844, 430x932, 1366x768, 1920x1080
- existing 20K-star stress test
- no console errors/dead controls

Update `2FLY_UNIVERSE_RELEASE_REPORT.md` with what changed, authentic assets reused, persistence mode, test results, remaining awaiting-source media, performance and deployment status.

Do not call this complete until the rectangular/timeline architecture is truly gone and the 2025–2029 galaxy demonstrates the next level of the 2Fly Universe.
