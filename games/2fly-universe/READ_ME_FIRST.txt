2FLY UNIVERSE — CINEMATIC DEPTH V6.2 RC1

START HERE
Extract the entire ZIP, then double-click START_2FLY_UNIVERSE.bat.
Keep its console open; closing it stops the local server.
The launcher uses Windows PowerShell and your default browser. It binds only
to 127.0.0.1, finds an available port starting at 8088, and does not alter GPU flags.
No Node, Python, npm, or installation is required.

index.html is the entry point. Direct file:// launching cannot reliably load
ES modules and JSON; it shows clear launcher instructions instead of a blank screen.
For another platform, use any static HTTP server. Node users may optionally run:
  node tools/local-server.js 8088
Then open http://127.0.0.1:8088/.

CINEMATIC DEPTH
Planets are larger, systems are farther apart, and moons and star points are smaller.
Each galaxy core now lights the planet surfaces and atmospheric rims.
Select a planet, close Explore Worlds, then use FRAME SELECTED for a dramatic close view.
Drag to orbit the selected object. Clear selection to orbit the active galaxy center.
Outside galaxies, drag orbits the universe center. Selection never snaps the camera.
Galaxy exits have a much wider buffer; entry flights settle deeper inside.

EXPLORE
Choose a year on the timeline to enter its galaxy. The entry ripple lasts 1.45 seconds.
Only that galaxy's local objects can be selected. Exit galaxy restores universe travel.
First click/tap selects and illuminates. Pause briefly (at least 0.55 seconds), then
click/tap the same item again to open. Rapid double-clicks never open content.
The same rule applies to the object list and each song, film, game, or archive row.
Empty space or Escape clears selection. Closing content restores the exact local view.
Drag to orbit; scroll/pinch to approach. Right mouse hold, the HOLD TO THRUST button,
or W while the canvas has focus thrusts forward. Release to stop thrust.
Extended outward travel charges warp. Release or open a menu to cancel.
Continue charging to enter a brief wormhole and return safely to the galaxy region.
Return to Universe View is always available outside transitions.
Songs start only after confirming their item. Closing fades audio; exploration is silent.
Take Me Somewhere retains the original custom tour builder.
Place Star saves your mark locally and exports a downloadable card.

WHAT IS INCLUDED
The entire original universe, its assets, Three.js runtime, original destination
data, remaster code, launchers, changelog, testing report, and QA evidence.
The source project was not modified. All 128 original files are retained.
Older README and BAT files are retained for provenance; use this START file.

CONNECTIVITY & ARCHIVE STATUS
The universe's rendering assets are bundled. Original music and video still
stream from Wix; games open the existing 2fly GitHub Pages site. These need internet.
The seven hosted games are linked experiences, not bundled offline game copies.
All 23 existing child records and archive descriptions are preserved. Earlier and
future eras without project media are described as an expanding archive.
No missing media, dates, or career achievements were invented.
Stars and custom tours use browser local storage; they are not shared server records.
Return links to personal stars work in the same browser/origin. Share exported cards.
If the launch port changes, browser storage belongs to the previous port/origin.

Read CINEMATIC_REPORT.md and CINEMATIC_QA for this release.
REVISION_REPORT.md and REVISION_QA describe the preserved V6.1 checkpoint.
CHANGELOG.md, TESTING_REPORT.md, and QA describe the retained V6 baseline.
Optional developer check: node tests/navigation-safety.test.mjs
