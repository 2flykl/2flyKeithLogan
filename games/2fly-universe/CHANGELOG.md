# Living Constellation V6 RC1 — Changelog

The V5.2 universe remains the foundation. The original project folder was not edited.

## Preserved

- All 128 original files retained; all original asset bytes preserved.
- Seven era galaxies, seven project worlds, all 23 child content records, metadata, original media URLs, planets, textures, orbital objects, visitor stars, and custom tours.
- Teal/cyan, amber, violet, deep-space palette; original wrapped planet artwork and spatial layout.
- Original three regional music tracks, crossfades, mute preference, and media ducking.
- Main-site return and original linked game identities.
- Original destination JSON is byte-for-byte unchanged. See `QA/preservation.json`.

## Visual remaster

- Repaired three inherited GLSL attribute redefinition failures that suppressed the showcase spiral, nucleus, and perimeter particles.
- Broader, layered stellar arms with greater spatial thickness, differentiated particle sizes, luminous nucleus, and quieter background density.
- Procedural, low-contrast teal/violet sky atmosphere; subtle paths between chronological eras and moving light signals.
- Personal cinematic entrance using existing 4K galaxy artwork and narrative copy.
- Clearer HUD contrast, restrained glass panels, thin arrival rings, readable labels, and visual discovery progress.
- UI now renders above scene labels; mobile focus panels and landscape layouts stay within the viewport and scroll as needed.

## Exploration

- New living-timeline rail builds from existing era data; every era is reachable by keyboard and touch.
- Explore Worlds drawer connects to all seven original project worlds and their complete content lists.
- Era context comes from existing titles/regions, with honest descriptions for empty and future chapters.
- Existing camera travel and focus behavior powers the new UI. Reset and Return close stale planet focus.
- Escape closes the current interaction or returns inside the universe; it no longer invokes browser Back.
- Navigator tree entries are keyboard-operable; focus controls behind media dialogs are disabled until close.
- Original object hash routes now activate project focus.
- Star placement aligns to the nearest valid region and its real elevation; the original bounds and collision checks remain.
- Star cards explain that return links are local to the browser; downloadable cards remain shareable.

## Stability and performance

- Fixed duplicate requestAnimationFrame scheduling on tab visibility changes.
- Reduced background stars from 60,000 to 22,000 on desktop / 12,000 on small screens; dust from 10,000 to 2,200.
- Halved showcase arm particles on small screens. No destinations or content were removed.
- Pixel ratio capped at 1.5 desktop / 1.25 small screens; existing local Three.js runtime retained, no new application dependencies.
- Reduced-motion preference freezes ambient scene motion, removes UI animation, and uses existing immediate camera transitions.
- Restored original archive descriptions through the scene-to-media adapter.
- Fixed media overlay pointer interception; close paths release media and listeners once. Added original-media and direct-game fallback links.
- Regional playback requires a user gesture; silent tracks pause. Original audio source URLs are unchanged.
- Resolved root-relative game URLs to the repository's verified GitHub Pages host. Main-domain `/games/` equivalents returned 404.
- Added a graphics-context recovery screen and corrected local-server path containment.
- Added a dependency-free, loopback-only Windows launcher without GPU-disabling flags.

## Expand the archive

- `data/seed_universe.json`: canonical eras, region titles, project objects, child records, content status, media URLs, and demo stars. Add genuine information here.
- `app-v23/types.js`: era colors, world offsets, spatial themes, and home framing. A new era needs a matching theme.
- `app-v23/data/universe-data.js`: indexing and world-position helpers.
- `app-v23/ui/constellation-journey.js`: data-driven timeline, chapter drawer, and help.
- `app-v23/scene/living-atmosphere.js`: inter-era paths and procedural sky.
- `app-v23/scene/galaxy.js`: stellar arms and nucleus.
- `app-v23/scene/frontier-systems.js`: additional showcase worlds; special flagship worlds retain their individual systems.
- `remaster.css`: presentation and responsive layouts.

Add new showcase projects to the canonical JSON with a unique ID, galaxy/region, position, title, and real children. The drawer and tour list discover them automatically. A new specialized planet renderer or projects outside the existing showcase architecture also require scene integration; the JSON is not a replacement for those visual systems.
