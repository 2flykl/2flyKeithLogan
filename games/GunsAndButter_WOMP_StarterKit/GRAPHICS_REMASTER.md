# Guns & Butter — WOMP Realism Remaster

This pass replaces the first revamp's block-built visual layer. Exactly three WOMPs remain playable, with their original scoring, magazines and weapon roles.

## Weapon designs
- **CD Double Barrel:** twin machined bores, stepped steel sleeves, ribbed fore-end, brass sight rib, iridescent CD feed housings, engraved rear plate, textured grip, finger geometry and a break-open reload movement. Shots show spinning discs on their actual shot paths.
- **Tambourine Tempest:** a slimmer vented receiver, brass fittings, ring sight, and articulated tambourine with ten pairs of steel jingles. Rapid fire sends short brass pulse projectiles; the tambourine responds to firing and reloading.
- **808 Blaster:** deep red enamel housing, speaker-cone side pods, heat-dissipation rings, drum-machine pads and a rear meter. Heavy shots show a pressure shell and concentric bass waves; impacts add an expanding shockwave.

Beveled edges, roughness, metalness, local reflection lighting, fine surface grain, fasteners, trigger guards, leather and dark-skinned hands replace the old boxes and solid-color tubes. These are real 3D objects, not flat weapon overlays.

## Target hall
Textured concrete slabs, worn lane paint, oil/scuff decals, floor rails, overhead trusses, acoustic wall panels, pipe runs, working lights, flight cases, speaker cabinets and angled backstop plates replace the neon grid room. Targets are printed/scuffed physical plates with machined rims, fasteners, motor bases and persistent local impact marks. Color and hazard markings remain readable.

Lighting combines warm working lights, cool fill, a locally generated reflection environment, cached architecture shadows and distance haze. No external HDRI, texture download or account is required.

## Performance and compatibility
Static geometry is merged by material. Hall shadows are cached; moving targets and first-person weapons receive environmental lighting without dynamic shadow-map updates. Software renderers automatically use a lower render scale. Shared materials are reused, and transient geometry/materials are disposed when shots fade.

Open index.html directly, or use PLAY.cmd for an optional local server. The offline bundle includes src/art.js. After editing source, rebuild with `node tools/build-offline.mjs`.

## Verification and scope
Seven mechanics tests cover weapon scope, nearest-target occlusion, 27 angle/distance combinations, misses, accuracy, scoring and rank rules. The graphics browser checks cover each weapon's firing/reload and muzzle-direction dot product, three challenge acts, pause, replay, direct-file launch and touch controls. Evidence is saved in QA/remaster-*.

This remains a browser arcade range with procedural art, not a photogrammetry-based AAA environment. Projectile flight is visual; the existing immediate hit registration is preserved. Actual physical-phone and production-GPU performance are not benchmarked by the software-rendered browser tests. Original source artwork remains bundled as reference material.
