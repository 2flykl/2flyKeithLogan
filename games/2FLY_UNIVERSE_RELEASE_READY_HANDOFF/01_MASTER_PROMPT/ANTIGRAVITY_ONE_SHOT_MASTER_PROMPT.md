# ANTIGRAVITY MASTER BUILD PROMPT — 2FLY UNIVERSE
## Mission
Build, integrate, test, optimize, and release a production-quality **2Fly Universe** inside the existing 2flyKeithLogan.com project. Treat this as a release candidate, not a mockup, concept demo, or wireframe. Continue autonomously through implementation, debugging, responsive QA, performance testing, and final integration. Do not stop after scaffolding.

## Product North Star
The 2Fly Universe is an explorable spatial autobiography and audience galaxy. Space represents time. Content exists as celestial objects. Visitors permanently occupy the history as stars.

The experience must provoke: “I have never seen an artist archive their career like this.”

## Non-Negotiable Cosmology
- Universe = entire 2Fly creative history.
- Galaxies = fixed five-year periods beginning 2000:
  2000–2004, 2005–2009, 2010–2014, 2015–2019, 2020–2024, 2025–2029. Architecture must generate future five-year galaxies without redesign.
- Exactly 3 major Regions per galaxy. Region names/content remain data-driven and editable.
- Stars = real visitors. Never use “star” to represent songs/content.
- Star Clusters = groups of visitors; names will be supplied later. Use neutral data IDs now, never invent permanent lore.
- Suns = extremely rare era-defining works/events.
- Planets = major works/history/content.
- Moons = substantial artifacts belonging to a planet.
- Satellites = interactive/external media such as playable experiences or documented external media.
- Asteroids = small archival artifacts.
- Nebulae = creative/formative periods.
- Supernovae = rare transformative events.
- Comets = recurring people/themes/projects crossing eras.
- Constellations = meaningful connections.
- Every visible special object should reward investigation. Avoid decorative “fake clickable” objects.

## Core Interaction Law
DO NOT eject visitors to ordinary website pages for Universe content.
Content must open spatially in the persistent Universe shell:
- audio -> spatial player/orbital interface
- video -> cinematic floating theater
- playable experience -> full-screen Universe overlay; on exit restore exact prior camera/coordinates
- story/archive -> spatial dossier/panel
The galaxy must remain alive behind overlays. Preserve camera state, selected object, zoom, audio state where appropriate.

## Streams Reference System
Implement one polished canonical content system called **Streams** to prove the architecture:
- A distinctive water-inspired planet.
- Orbiting content objects sourced from data, not hard-coded UI.
- At minimum demonstrate Audio, Video, Playable Experience, Artwork/Archive.
- Moons/objects are actual spatial bodies, not a row of disguised menu buttons.
- Approaching the system progressively reveals labels; distant view should remain mysterious.
- Clicking an object transitions camera toward it before opening its media experience.
- Closing media returns to the exact Streams orbit position.

Use placeholders only when an actual media URL is unavailable, and mark such records in data as `contentStatus: "awaiting-source"`. Do NOT fabricate external URLs. Existing project media should be reused when confidently identified.

## Visitor Star Experience
A visitor can place ONE primary personal star by default.
Placement flow:
1. Enter placement mode.
2. Explore galaxy/region.
3. Preview an unoccupied valid location.
4. Enter display name, optional star name, short message, and optional drawn signature.
5. Confirm.
6. Validate collision/occupancy server-side.
7. Persist immutable star ID + galaxy/region + coordinates.
8. Cinematic ignition.
9. Generate shareable Star Card.
10. Offer share/copy link.

Do not require public exposure of sensitive personal information. Display name may be pseudonymous. Signature is optional.

## Shared Star Deep Link
A shared star URL must be a destination journey, not a generic profile page.
Required behavior:
- open Universe at distant scale
- show “DESTINATION RECEIVED” with safe public coordinate notation
- cinematic fly-through: Universe -> target galaxy -> region -> cluster vicinity -> star
- settle into a rich parallax Star View
- actual neighboring stars remain spatially correct
- show star name/display name, public message, galaxy, region, created date, star/citizen ID, coordinates
- CTA: “PLACE YOUR STAR”
- CTA pulls camera outward and hands control to visitor for placement
Never teleport without transition unless reduced-motion accessibility is enabled.

## Star Card
Generate downloadable/shareable card imagery from actual persisted star data.
At minimum:
- 1080x1350 card
- 1080x1920 story version
- display/star name
- unique star ID
- galaxy + region
- coordinate notation
- arrival date
- QR or share URL representation if safe/available
- visual identity based on galaxy/era
No fake rarity economy. Early-era/founder visual treatments may be data-driven but must not imply monetary value.

## Coordinate & Spatial Architecture
Use a scalable spatial model; do not render an actually infinite scene.
- Chunk/sector space.
- Stable world coordinates.
- Spatial indexing / level-of-detail.
- Only render relevant nearby detail.
- Prevent star collisions.
- Deep links should prefer immutable star IDs; coordinates are display/navigation metadata.
- Camera floating-origin or equivalent precision strategy at extreme distance.
- Future galaxies can be added from data without changing renderer architecture.
- Never use array index as persistent identity.

## Rendering/Tech Direction
This is a WEB experience, not Unreal.
Preferred baseline:
- TypeScript
- Vite 8.x
- Three.js/WebGL (WebGPU enhancement allowed only with reliable WebGL fallback)
- Supabase/Postgres for persistence if project credentials/integration are available
- If backend credentials are unavailable, implement a clean repository interface plus local/demo adapter so UI is fully testable; leave explicit setup docs. Do not fake production persistence.
- Node 22+.
Use the existing project stack when integration cost would be lower, but preserve these architecture requirements.

## Visual Standard
Awe-inspiring, elegant, cinematic, adult, premium. NOT:
- Roblox
- GTA imitation
- generic sci-fi dashboard
- children’s educational solar-system UI
- flat black page with random white dots
- giant developer labels
- purple-gradient SaaS aesthetic
- placeholder spheres presented as final art
- excessive HUD clutter

Use depth: procedural stars, layered dust, subtle nebula volumes/sprites, bloom selectively, atmospheric scattering/fresnel where performant, orbital motion, depth fog, tasteful lens effects, parallax and camera easing.
Every galaxy must have a related but distinguishable identity.
The Universe overview should communicate enormous scale.

## Progressive Disclosure
Far -> near:
Universe labels -> galaxy eras -> 3 regions -> clusters/systems -> object names -> artifact detail.
Do not display every label simultaneously.
Labels must avoid overlap and disappear/condense by zoom threshold.

## Input
Desktop:
- drag = orbit/pan appropriate to mode
- wheel = smooth zoom
- click = select
- double click = approach/focus
- Esc = back one spatial/context level
Mobile:
- one-finger drag
- pinch zoom
- tap select
- deliberate placement confirmation
- no accidental browser/page-scroll trap
Provide a visible “Exit Universe / Main Site” affordance without breaking immersion.

## Accessibility
- prefers-reduced-motion path replaces long fly-throughs with short fades/controlled transitions
- keyboard navigability for core content
- semantic accessible overlay controls
- focus trapping only while modal media is open
- captions/transcripts hooks for video/audio where supplied
- contrast-safe UI
- no information conveyed by color alone

## Audio
Sound enhances, never blocks entry.
- browser autoplay rules respected
- user gesture activates audio
- master mute persisted locally
- ambient layers crossfade by region
- star ignition/select/warp hooks
- media audio ducks ambience
- no multiple audio sources fighting simultaneously

## Performance Budget
Target modern mid-range mobile + desktop:
- 60fps target desktop; graceful 30fps floor mobile under load
- adaptive quality based on DPR/device capability
- no millions of individual DOM nodes
- instanced rendering for stars/particles
- lazy-load heavy media
- texture compression/optimized formats where pipeline permits
- dispose GPU resources correctly
- pause expensive animation when hidden
- avoid memory growth during repeated planet/media visits

Stress-test with seeded 20,000+ stars and prove navigation remains responsive. Rendering may cluster/cull; do not draw all stars at maximum detail.

## Data Integrity & Security
- RLS/least privilege if Supabase is active
- client cannot choose privileged/founder flags
- sanitize user text
- rate-limit star creation endpoint/function when production backend exists
- collision and one-primary-star rules enforced server-side, not only UI
- do not expose service-role keys
- public star payload excludes private account fields
- deletion/moderation/admin strategy documented
- signatures stored as bounded optimized image/vector data, not arbitrary executable markup

## Required Routes / State
Use project-compatible routing. Deep-link semantics must support:
- Universe root
- galaxy
- planet/content object
- star by immutable ID
Browser Back should move sensibly through spatial/context history without reloading the whole application.

## Seed Content
Use `03_DATA/seed_universe.json`.
It contains the six initial galaxies, three regions each, a Streams proof system, and generated demo stars.
Do not interpret demo people as real users.
Demo data must be easy to remove for production.

## Assets
Use supplied assets under `04_VISUAL_ASSETS` and `05_UI` as references/building blocks.
They are starter assets, not permission to settle for flat placeholders. Procedural/shader enhancement is expected.
Do not delete or overwrite existing site assets.

## Integration Safety
Before edits:
1. inspect repo
2. identify current live/staging deployment path
3. create/confirm working branch
4. inventory existing Universe-related code to avoid destructive duplication
5. preserve existing website functionality
Then build.

Do not automatically deploy to production unless the repository workflow already explicitly treats the requested branch as staging/live-stage. Build and test release candidate; document exact deployment state.

## Required Automated QA
Create tests where stack permits:
- star ID deep-link resolves correct target
- star placement collision rejection
- one-primary-star rule
- media overlay opens/closes and camera restores
- Universe -> galaxy -> region -> planet navigation
- Streams Audio/Video/Playable/Archive interactions
- mobile viewport 360x800, 390x844, 430x932
- desktop 1366x768, 1920x1080
- no horizontal/vertical document scroll leakage while Universe owns gesture input
- browser Back behavior
- reduced motion
- star-card export dimensions
- no console errors in happy path
- reload/deep-link persistence
- 20k star stress seed

## Release Gate
Do not call the build “done” until:
1. production build succeeds
2. automated tests pass or every remaining failure is explicitly documented with cause
3. desktop + mobile visual QA completed
4. no dead buttons
5. no broken media routes
6. no placeholder geometry masquerading as release art
7. deep-link star journey works
8. Star Card generation works
9. Streams spatial content works without leaving Universe
10. performance stress test completed
11. accessibility basics verified
12. existing main site navigation still works

## Autonomous Repair Loop
After first implementation:
- run build
- run tests
- inspect errors
- repair
- repeat
- visually inspect target viewports
- repair layout/input issues
- rerun tests
Do not return control merely because the first implementation compiles.

## Deliverables
Create/update:
- working integrated source
- README for Universe
- architecture notes
- database migration/schema if backend used
- `.env.example` with NO secrets
- seed/demo data
- tests
- performance notes
- deployment notes
- `2FLY_UNIVERSE_RELEASE_REPORT.md`

The release report must state:
- what is complete
- exact route to launch Universe
- persistence mode (production Supabase vs demo adapter)
- test results
- performance results
- known limitations
- media records still awaiting real sources
- files changed
- deployment status
- next recommended improvements

## Final Principle
Do not build a website decorated like outer space.
Build a persistent, explorable universe where **time is geography, content is celestial matter, and people are the stars**.
