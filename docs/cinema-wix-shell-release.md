# Cinema Wix shell release — 2026-10-02

Drive In Cinema uses the published branded site shell around the existing standalone Cinema scene. The Wix template header and footer are hidden on every page, including duplicate, utility and form confirmation pages. These settings are Wix editor changes rather than repository CSS changes.

## Build

Export the existing Featured HTML embed, then run:

```sh
node scripts/build-wix-cinema.cjs shared-shell.html cinema-wix.html
```

Paste the generated document into the Cinema HTML embed and publish Wix. The builder inlines the Cinema assets and applies `css/drive-in-shell-fit.css` only to the nested scene. It retains the branded navigation, ticker, music player and feedback/support footer. It budgets the scene height around the header so the radio HUD remains visible on landing. The standalone GitHub Cinema page is unchanged.

## QA

- Published Cinema tested at desktop 1440×900, default desktop viewport, and mobile 390×844. Full dashboard fits; mobile program drawer opens.
- I Was Away and Streams played with readyState 4. Next selected Thru the Fire and pause worked.
- Cinema navigation follows Ride and Vibe; movie controls remain hidden until screen interaction.
- Final published Cinema console check had no errors.
- Fresh live page checks confirmed native Wix header/footer `display:none` with height 0 for Home, Music, Help 2Fly Create, Flyzone, Playables, Featured, Videos, Africa, Cinema, Home Copy, all four New pages and Pay What It's Worth.
- Form confirmation page header/footer were verified hidden in the editor and published.
- Wix visibility controls required actual clicks; keyboard activation sometimes left their state unchanged. Live verification, rather than editor labels alone, confirmed the removal.

Live release: https://www.2flykeithlogan.com/drive-in-cinema

## Navigation recovery — 2026-10-06

The Cinema URL remained live, but the current Wix embeds for Featured, Music, Playables, Videos and Help 2Fly Create had lost the main navigation entry. Restored the absolute, top-level Cinema link immediately after Ride and Vibe in each current embed and published Wix. Flyzone already contained the entry and retained its dedicated studio layout. No previous full-page bundle was redeployed.

Use `node scripts/restore-wix-cinema-nav.cjs current-export.html repaired-export.html` to repair a fresh export without replacing other page changes. The utility validates the expected menu and is idempotent. It does not publish; apply the repaired source to the matching Wix HTML element and publish through Wix.

QA: all six current exported menus matched the utility output and passed idempotence checks. Live menus on Featured, Music, Playables, Videos and Support show Cinema after Ride and Vibe; Flyzone retains its existing entry. Desktop and 390px mobile Featured menu clicks opened the actual `/drive-in-cinema` page. Cinema media loaded to readyState 4 and advanced playback. Desktop navigation fits at 1280px. Local before/after backups and desktop/mobile screenshots are saved under `outputs/nav-recovery-20261006` in the task workspace (outside this repository).

## Dedicated film header refinement

The creator subsequently requested the slim Africa film header style instead of the global shell on Cinema. The Cinema bundle now hides the global navigation, ticker and music player and displays a 2FLY return link with a continuous serif title marquee reading "2flyKeithLogan's Drive In Cinema". The support section remains beneath the scene, with no support action in the landing header.

An IntersectionObserver measures the visible area across the Wix iframe boundary to budget the header plus scene to the actual landing viewport. Scroll clipping is ignored so scrolling does not shrink the scene. Desktop live QA confirmed scene bottom and support top at 720px in a 720px viewport; support became visible after scrolling. Mobile QA at 390×844 confirmed the dashboard and program toggle fit with support below the fold. Next switched to Streams, the video reached readyState 4, pause worked, and the mobile program drawer opened. The live console error check was empty.
