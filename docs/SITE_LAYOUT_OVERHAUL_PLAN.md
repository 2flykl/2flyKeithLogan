# 2Fly Site Layout Overhaul — Migration Plan

## Safety baseline
- Stable branch: `main`
- Restore checkpoint: `checkpoint-pre-layout-overhaul-2026-09-03`
- Active redesign branch: `feature/site-layout-overhaul`
- Production remains untouched until explicit approval.

## Current architecture found
The original public site is primarily a single-page application built from:
- `index.html` — shared header, views, overlays, page markup
- `css/app.css` — global styling
- `js/app.js` — routing, carousel logic, music player, project rendering
- `data/projects.json` — core project/media data
- `/games` — first-class playable subsystem; do not relocate or rewrite during shell overhaul unless specifically approved

The overhaul branch now introduces a parallel shared-shell architecture centered on:
- `pages/site-overhaul.html` — global shell and app mount point
- `css/site-overhaul.css` — Home, Featured, Playables, shell and persistent-player presentation
- `css/site-specialty.css` — Music CD binder and Videos VHS/TV room
- `css/site-support.css` — native Help 2Fly Create destination
- `css/site-africa.css` — native I Woke Up in Africa documentary destination
- `css/site-flyzone.css` — FlyZone studio wrapper
- `js/site-overhaul.js` — project data, shell behavior, Home, Featured, Playables and persistent audio
- `js/site-specialty.js` — Music and Videos renderers
- `js/site-support.js` — Help 2Fly Create renderer and local draft tools
- `js/site-africa.js` — Africa documentary renderer
- `js/site-flyzone.js` — FlyZone wrapper renderer
- `js/site-router.js` — final centralized route controller
- `data/playables-overhaul.json` — public Playables manifest
- `data/site-messages.json` — editable ticker messages

## Approved redesign intent
1. Logo becomes the route back to the new Home splash page.
2. Existing Home becomes `Featured`.
3. Main navigation becomes:
   - Featured
   - Playables
   - Music
   - Videos
   - FlyZone
   - I Woke Up in Africa
   - 2Fly Universe
   - dominant green Help 2Fly Create CTA
4. Remove First Time Here?, Test Lab, What's in Motion, and Keep Me Posted from primary navigation.
5. Convert Anti-Algorithm hero copy into a horizontal brand/manifesto bar.
6. Add global information ticker below the manifesto bar.
7. Move the music player into the global shell below the ticker.
8. Featured becomes a full-width carousel whose slide layout may vary by content type.
9. Thru the Fire uses album art + Listen + Watch + Playable + flexible information area.
10. I Woke Up in Africa uses documentary video + chapter rail + two related playables + flexible information area.
11. Every major content page receives contextual Help 2Fly Create support space and ticker.
12. Playables absorbs the Test Lab library behavior and public game listing.
13. Music becomes a 1990s CD-book interaction.
14. Videos become a VCR / television / remote-control interaction.
15. Detachable audio remains a later enhancement; the shared player already persists across native shell routes.

## Migration order
### Phase A — isolated prototype
- [x] Create overhaul branch
- [x] Audit current `index.html`, `js/app.js`, `data/projects.json`, and project operating rules
- [x] Build an isolated Featured prototype
- [x] Use existing project data instead of duplicating content
- [x] Prototype global shell, ticker, player, carousel, Africa composition and Help 2Fly Create
- [x] Convert the old prototype pages into compatibility redirects after the shared shell superseded them

### Phase B — global shell integration
- [x] Introduce reusable shell styling and behavior on the overhaul branch
- [x] Replace primary navigation in the overhaul shell
- [x] Make brand/logo route to the new Home splash
- [x] Add Anti-Algorithm horizontal bar
- [x] Add data-driven global ticker
- [x] Preserve music playback across native shell route changes
- [x] Add compact-on-scroll shell behavior in code/CSS
- [x] Centralize final routing in `js/site-router.js`
- [ ] Browser-verify compact/responsive shell behavior

### Phase C — Featured migration
- [x] Move the old Home discovery concept to Featured
- [x] Move Featured into the shared shell
- [x] Preserve project Listen / Watch / Playable actions
- [x] Support standard feature and documentary feature templates
- [x] Add contextual Help 2Fly Create module and ticker
- [ ] Browser-verify carousel proportions, media actions and responsive layouts

### Phase D — Playables consolidation
- [x] Inventory current public experiences and Test Lab builds
- [x] Build one data-driven Playables directory
- [x] Separate lifecycle status from the independent Featured flag
- [x] Keep `experimental` / `in-development` as metadata instead of a separate public Test Lab destination
- [x] Verify the current public launcher files exist for every manifest entry on the overhaul branch
- [ ] Browser-smoke-test every launcher from the new Playables page

Current public manifest launch targets verified to exist:
- Ebony Eyes
- Guns & Butter
- TigerCall: Still Standing
- Return of the Aviator
- I Was Away
- Streams
- I Woke Up in Africa
- Black & Gifted
- Thru the Fire
- 2Fly Universe

### Phase E — new Home splash
- [x] Create lightweight orientation page inside the shared shell
- [x] Route logo to Home
- [x] Keep Featured as the main content-discovery destination
- [x] Route Home portals to native Featured / Playables / Music / Videos destinations
- [ ] Browser-verify desktop and mobile Home composition

### Phase F — specialty pages
- [x] Music: 1990s CD binder implementation
- [x] Videos: VHS / TV / remote implementation
- [x] Help 2Fly Create native destination and contextual modules
- [x] I Woke Up in Africa native documentary destination
- [x] FlyZone native wrapper preserving the existing studio runtime
- [x] Canonical 2Fly Universe restored and linked from the overhaul shell
- [ ] Detachable/pop-out player implementation
- [ ] Browser-verify Music, Videos, Support, Africa and FlyZone interactions

### Phase G — QA and approval
Static/source verification is not the same as browser QA. The items below remain open until a real browser-accessible test state is available.
- [ ] Desktop browser QA
- [ ] Mobile browser QA
- [ ] Navigation interaction QA
- [ ] Audio continuity QA
- [ ] Featured carousel QA
- [ ] Video/documentary chapter QA
- [ ] All Playable launch smoke tests
- [ ] FlyZone iframe/fullscreen QA
- [ ] Africa/Universe route QA
- [ ] Console/network review for critical errors or 404s
- [ ] No production merge without creator approval

## Canonical runtime notes
### 2Fly Universe
The overhaul branch points to `games/2fly-universe/index.html`, the restored canonical web runtime. Legacy Universe entry points should forward to this location rather than resurrecting obsolete builds.

### Streams V2
A newer large Streams package was reduced to its deployable runtime set, but its new binary asset tree was not reconstructable from Git history. Do **not** claim the uploaded Streams V2 package is fully imported until those exact binary assets are transferred and verified. The public manifest currently points to the existing `games/streams/index.html` runtime.

## Compatibility / rollback
- Root `index.html` on the overhaul branch forwards to `pages/site-overhaul.html#home`.
- `pages/home-overhaul.html` forwards to `site-overhaul.html#home`.
- `pages/featured-overhaul.html` forwards to `site-overhaul.html#featured`.
- The legacy site remains available as migration reference/rollback material and is not deleted.
- `main` and `checkpoint-pre-layout-overhaul-2026-09-03` remain protected from this redesign work.
