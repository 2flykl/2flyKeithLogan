# Asset sources

| Asset | Source | Usage |
|---|---|---|
| Qwantani panorama | Greg Zaal / [Poly Haven](https://polyhaven.com/a/qwantani), [CC0](https://polyhaven.com/license) | Original 8192 × 4096 tonemapped JPG, plus a 4K downsample. Local files; no runtime requests. |
| Character identity and state sheets | Creator-supplied IWA_FireflyAssets, IWA_inbetweens, IWA_MoreStates folders | Recovered from the corresponding Downloads packs. 88 frames recut; individual source filename/cell recorded in `assets/characters/frames.json`. Originals preserved separately. |
| Boomerang design | Creator-supplied `ChatGPT Image Sep 9, 2026, 02_24_00 AM.png` | Intact master isolated and downsampled. Old fragmented bank/spin crops excluded. |
| I Was Away song | Creator-supplied `audio/i-was-away.mp3` | 185.18 seconds, stereo, 44.1 kHz, 192 kbps. Original 320 kbps version archived. |
| Wind / throw / catch sounds | New Web Audio synthesis | Generated locally at runtime; no external recordings. |
| Three.js 0.166.1 | [Three.js](https://github.com/mrdoob/three.js/tree/r166), MIT | Bundled locally; license included in `vendor/THREE-LICENSE.txt`. |
| Typefaces | System Arial and Georgia | No external font downloads. |
| Photographer identity | Creator-supplied `ChatGPT Image Sep 14, 2026, 12_09_38 PM.png` | Original reference retained in `assets/photographer/references/identity.png`. |
| Photographer turnaround and first animated sheet | Built-in image generation using the supplied reference | Masters, generation log, cleaned atlases and pending corrections retained in `assets/photographer/`. Not yet complete RC artwork. |
| Photo-reel stills | Built-in image generation from current game screenshots, original 2Fly sheet and boomerang master | Three proofs retained; optimized WebP runtime versions use the same images. Six additional distinct photographs remain pending. |
| Shutter sound | New Web Audio synthesis | Short filtered mechanical clicks timed to each image reveal; no recording or external request. |

The original 2Fly cutout processing used the already-installed U²-Net model, followed by GrabCut, component cleanup and edge-color propagation. The model is not distributed. The photographer's generated pale checkerboard was removed locally using a neutral-matte mask, component cleanup and edge-color propagation. The later photo-reel and photographer generation passes supplied the authorized visual references to the built-in image tool. Music was not uploaded. No new rights are asserted over creator-supplied material.

Panorama download: https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/qwantani.jpg

September 15 integration: user-provided IWAphotoreelNEW.zip and four Firefly catch/recovery PNG sheets. Source-to-frame crop records are in assets/photo-reel/import-report.json and library.json; character source/view records are in assets/states/manifest.json. No horizontal mirroring or new external asset service was used.
