# 2Fly Site Layout Overhaul — Migration Plan

## Safety baseline
- Stable branch: `main`
- Restore checkpoint: `checkpoint-pre-layout-overhaul-2026-09-03`
- Active redesign branch: `feature/site-layout-overhaul`
- Production remains untouched until explicit approval.

## Current architecture found
The public site is primarily a single-page application built from:
- `index.html` — shared header, views, overlays, page markup
- `css/app.css` — global styling
- `js/app.js` — routing, carousel logic, music player, project rendering
- `data/projects.json` — core project/media data
- `/games` — first-class playable subsystem; do not relocate or rewrite during shell overhaul unless specifically approved

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
13. Music will later become a 1990s CD-book interaction.
14. Videos will later become a VCR / television / remote-control interaction.
15. Detachable/background-style audio behavior is deferred to the Music-page phase, but the new shell must be ready for it.

## Migration order
### Phase A — isolated prototype
- [x] Create overhaul branch
- [x] Audit current `index.html`, `js/app.js`, `data/projects.json`, and project operating rules
- [x] Build an isolated Featured prototype at `pages/featured-overhaul.html`
- [x] Use existing project data instead of duplicating content
- [x] Add global shell prototype, ticker, music player, carousel, Africa documentary composition, Help 2Fly Create module

### Phase B — global shell integration
- [ ] Extract/introduce reusable shell styling and behavior in the main site
- [ ] Replace current primary navigation
- [ ] Make brand/logo route to new Home splash
- [ ] Add Anti-Algorithm horizontal bar
- [ ] Add global ticker
- [ ] Preserve music playback across SPA view changes
- [ ] Ensure compact responsive shell behavior

### Phase C — Featured migration
- [ ] Rename current Home view conceptually to Featured
- [ ] Move Featured layout into main SPA
- [ ] Preserve existing project/media actions
- [ ] Support standard feature and documentary feature templates
- [ ] Add project-specific Help 2Fly Create ticker

### Phase D — Playables consolidation
- [ ] Inventory current public experiences plus Test Lab builds
- [ ] Build one Playables directory/list view
- [ ] Mark experimental/in-development status with metadata instead of a separate public Test Lab destination
- [ ] Verify every launch path before retiring Test Lab navigation

### Phase E — new Home splash
- [ ] Create lightweight orientation page
- [ ] Route logo to Home
- [ ] Keep Featured as the main content-discovery destination

### Phase F — specialty pages
- [ ] Music: 1990s CD binder
- [ ] Videos: VCR/TV/remote experience
- [ ] Help 2Fly Create contextual modules
- [ ] Detachable player research/implementation

### Phase G — QA and approval
- [ ] Desktop
- [ ] Mobile
- [ ] Navigation
- [ ] Audio continuity
- [ ] Featured carousel
- [ ] Video/documentary chapters
- [ ] All Playable launch links
- [ ] FlyZone/Africa/Universe routes
- [ ] No new critical 404s
- [ ] No production merge without creator approval

## Prototype files
- `pages/featured-overhaul.html`
- `css/featured-overhaul.css`
- `js/featured-overhaul.js`

The prototype is intentionally isolated so the current production-facing `index.html` is not modified until the new direction is visually and functionally approved.
