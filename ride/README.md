# Rollin with FLY — RC4

A fixed passenger-seat music experience built around the supplied transparent dashboard image. Choose Youngstown, Sky Session, or Real World View. The first two use streamed 3D scenery; Real World View uses the supplied generated lakeside videos. All three remain independent of music playback and work locally with the included assets.

The Youngstown environment is Youngstown-inspired, not a reconstruction of actual streets. Photographic building/tree textures and scanned physical materials improve realism, but it remains a real-time 3D rendering rather than filmed footage. Building facades, house details and foliage assets are reused in varied layouts; there is no repeating video clip or fixed route reset.

## RC4 — Real World View

The title is now **Rollin with FLY**. The third title-screen option, **Real World View**, places the five supplied sunset videos behind the dashboard windshield. RealTest_02 is trimmed at the closest matching screenshot frame, approximately 12.5 seconds. A continuous encoded journey plays forward, reverses at the end, then repeats forward. A small route readout indicates the current direction.

The cabin picks up soft warmth and shading from the footage, darkening through the tunnel. Controls remain aligned and the stereo screen stays legible. The video is silent; music pause, seek and song changes do not change road playback. Reduced motion holds the video. End ride returns to the three-option selector.

See VIDEO-EDIT.md for precise trim/frame counts, replacement instructions, and suggestions for future footage. The complete round trip is 137.33 seconds of video, played at 0.9× by default (about 2:33). Generated pans and artifacts remain visible in this intentional reverse-playback test.

## RC3 — Sky Session

The title screen now offers **Youngstown** and **Sky Session**. Choose a card, then Start the Ride. End ride returns to the title screen so you can change worlds. Both modes use the same four-track stereo and audio ownership system.

Sky Session is an abstract elevated road with continuous climbs, dips, curves and gentle banking. Four scenic themes evolve along the route: Vinyl Sunrise, The Velvet Keys, Soul Frequency and Chromatic Dreams. Expect giant spinning records, floating piano steps, brass knots, speaker towers, orbiting forms, glowing arches and a ringed sun in a moving violet/teal sky. Cabin light picks up soft color from the scene. The camera stays in the passenger seat; there are no full inversions or steering controls. The original route suggestions remain available in Youngstown.

Reduced motion freezes the sky world and suppresses cabin movement while playback remains available. Music pause, seek and song changes never reset either road. Each world keeps its position when switching at the title screen; restarting playback begins I Was Away.

`ride/sky-ride.js` contains the procedural geometry, path, palette, sky shader and animation. No extra assets, downloads or services are required. Its streamed scenery keeps 15 chunks active; rigid ornaments are instanced and retired geometry is disposed. The existing photographic city assets remain in place.

## RC2 changes

- Optional Left / Ahead / Right suggestions before occasional junctions; no input selects a random direction automatically. Suggestions lock before the approach. Four junctions per scenic chapter, including two additional neighborhood turns.
- Gentle wind in foliage, shrubs and reeds, with matching animated shadows and rooted lower trunks.
- Subtle passing cabin shade and sunlight that respond to tree cover, distance and heading. HUD stays legible; reduced motion suppresses these overlays.
- Music remains independent of every route choice. See RELEASE-NOTES.md for behavior and QA-REPORT.md for verification.

## RC1 changes

- Added residential stretches with four house styles, solid walls and pitched roofs, facade textures, porches, side windows, lawns and driveways.
- Added varied foliage, planted yards, bins, parked cars, bus shelters and lakeside picnic/dock/boat/reed/rock details.
- Added a car ahead with actual acceleration, turn slowing, stop-sign waits and brake lights, plus additional freeway traffic. Passenger-car speed respects the lead vehicle gap.
- Integrated supplied asphalt, lawn, verge, sidewalk and lake materials. Water has independent soft wave motion, glints and a distant wooded shore.
- Rebuilt bridge members with I-shaped sections and added supports. Retained the complete dashboard fit and shared suspension rig.
- Added a restrained route/speed readout. Music, seeking and track changes never reset the drive.

See `ASSET-AUDIT.md` for all 22 Adobe sheets and `QA-REPORT.md` for RC checks. This is a local release candidate, not a production deployment.

## Run the portable build

1. Extract the entire ZIP.
2. With Node.js 18 or later installed, double-click `START_RIDE.cmd` on Windows, or run `node serve.cjs` from the extracted folder.
3. Open the local URL printed by the server. Default: `http://127.0.0.1:4173/ride/`.
4. Choose **Start the Ride**. It begins with **I Was Away**.

Use an HTTP server, not a file:// URL: the 3D renderer uses ES modules. The build has no npm install or compilation step. All dependencies and media are included. WebGL2 is required for the moving environment; a visible error is shown if it is unavailable, while music remains usable.

## Playlist and artwork

The only playlist, in `ride/media.js`, is:

| Track | Audio | Artwork | Tested duration |
| --- | --- | --- | --- |
| I Was Away | `assets/away.mp3` | `assets/away.png` | 3:05 |
| Streams | `assets/streams.mp3` | `assets/streams.png` | 2:53 |
| Gettin It | `assets/gettin.mp3` | `assets/gettin.png` | 3:37 |
| Guns and Butter | `assets/guns.mp3` | **Not verified / not included** | 2:45 |

All four audio files are real supplied/local project assets. Nothing has been substituted. The Guns and Butter source is `Guns and Butter 3.mp3` from the existing WOMP project. Its ID3 metadata contains no embedded cover. The older site's Guns and Butter game mapping incorrectly used Gettin It's cover; this build explicitly displays **Artwork unavailable** instead.

To add the correct cover, place it at `ride/assets/guns.png`, then set the fourth track's `artwork` to `'assets/guns.png'`. Replace audio or other covers by updating the matching entry in `media.js`. Preserve titles and order if using the test playlist.

## Continuous environment

`ride/adobe-assets.js` loads the prepared artwork and defines all crop windows. `ride/route.js` defines one continuous arc-length path; `ride/environment.js` builds its road, buildings, trees, water and lighting. The ride moves through town, woodland, a steel-truss bridge over water, a lakeshore, intersections and a divided freeway. Vehicles decelerate to a complete stop for 2.1 seconds at stop signs, then continue straight or accelerate into the selected 90-degree turn. Scenic chapters recur along a continuing path with varied scenery; there is no video loop, route teleport or song-triggered cut. `ride/assets/environment/` contains its materials. `ride/vendor/` contains the pinned Three.js renderer and MIT license.

The road clock does not read `audio.currentTime`. Play/pause, song seeking, next/previous, shuffle and natural track endings cannot reset the environment. The renderer keeps 18 active road sections, creates new sections ahead beyond the fog, and removes passed sections. Static objects are batched into instanced meshes; retired GPU buffers/geometries are disposed. New sessions use a new scenery seed. There is no finite route array or playlist-to-road synchronization.

Contextual speeds in `environment.js` range from 9 m/s on the bridge to 21 m/s on the freeway, with lower speeds for tight curves and intersections. An optional `environment.seed` in `media.js` gives a repeatable layout for development. Route chapter distances, bends, turns and stop locations live in `route.js`. The passenger eye point is fixed relative to the road/car; there is no orbit or drag camera. No driver, steering wheel, invented likeness, or synthesized voice is present.

The dashboard composition fits the available desktop width and height, with small overscan to conceal incomplete image edges. The phone layout remains scrollable so the controls retain usable sizes. The image, HUD and every dashboard hit target share one suspension rig: restrained irregular vibration, braking pitch and cornering roll keep controls aligned. Drifting clouds, sun glow, animated water and changing cabin illumination add environmental motion. The renderer intentionally suspends in a hidden tab and resumes smoothly on return. **Reduced motion** freezes road motion and removes suspension, changing cabin reflections and meter animation, while music continues; the preference is saved locally and initially respects the OS setting.

### Optional future road-video override

The continuous 3D drive is the default and recommended shipped mode. To substitute your own footage later, set `environment.mode` to `'video'`, then populate `roads` in `media.js`:

```js
roads: [
  { src: 'assets/roads/01.mp4', label: 'Youngstown', position: '50% 50%' },
  { src: 'assets/roads/02.mp4', label: 'Youngstown', position: '50% 50%' }
]
```

Use forward-facing, passenger-compatible footage without a dashboard or driver baked into it. Videos are always muted and use independent elements with a 1.5-second dissolve. Repeated finite clips can still reveal repetition; the shipped procedural mode avoids this limitation. Optional video mode has not been qualified with supplied road footage because none is used in this build.

## Dashboard controls

- Home: main player. Screensaver: subdued listening view. Playlist icon: four-track queue.
- Shuffle: clear on/off state; shuffles only the four tracks, without repetitions within a cycle.
- Volume +/−: five-point changes. Volume knob: drag up/right to raise, down/left to lower. Arrow keys fine-tune; Shift+Arrow changes five points; Home/End set limits. Desktop music-note knob toggles mute.
- Sound: lows/mids/highs within ±4 dB; Original, Car Cabin and Performance Bass presets. Smooth parameter ramps, pre-EQ headroom compensation and a compressor reduce clipping risk and abrupt changes. Presets are modest tonal adjustments, not an exact acoustic model of a specific vehicle.
- Climate: both dials change 60–85°F and update warm/cool feedback. These are visual cabin controls, not real HVAC or audio filters.
- Previous selects the previous song. Next selects the next song. Paused track changes stay paused; natural endings automatically continue and wrap.
- End ride stops audio and motion. Starting again resets the music to I Was Away; Real World View also restarts from the first residential clip.

## Existing-site integration

An isolated branch, `feat/youngstown-ride`, contains the implementation. The original checkout and production site were not modified or deployed.

To install the drop-in package in the existing site:

1. Copy the `ride/` directory to the site root.
2. Copy `integration/site-audio-ownership.js` to the site's `js/` directory.
3. Apply `integration/site-shell.patch` from the site root, or add its two lines manually: the ride navigation link and the ownership script include.

The ride navigation link opens `../ride/index.html?from=site` in the same tab, naturally unloading the old player. The query flag makes the 2FLY Radio link return to the existing Music route. `site-audio-ownership.js` additionally uses a same-origin BroadcastChannel to coordinate audible media across tabs: a newly played song pauses other participating players. Muted road videos are excluded. This coordination requires both pages to be served from the same origin; cross-domain copies cannot share that channel.

## Verification

See `QA-REPORT.md` and the machine-readable evidence in `qa/` in the portable package. Chromium checks cover all four actual MP3 files, transport, seek, shuffle, sound, mouse/keyboard/touch dials, climate, start/end/restart, responsive widths and audio ownership. This is desktop Chrome automation with phone emulation, not a physical iPhone/Safari listening test. Full-track subjective listening and maximum speaker-volume checks have not been performed.

The single outstanding content item is **verified Guns and Butter artwork**. The app is playable without it and does not pretend the cover is present.

## Asset credits

- Dashboard and songs/covers: user's supplied image and existing 2fly project assets.
- Adobe sheets: supplied by the user; five sheets processed for background extraction with the built-in image tool. See `ASSET-AUDIT.md`.
- Original tree and four-facade atlas: generated with the built-in image-generation tool. Prompts are preserved in `ASSET-PROMPTS.md`.
- Scanned material maps: Poly Haven CC0 — [asphalt_02](https://polyhaven.com/a/asphalt_02), [grass_ground](https://polyhaven.com/a/grass_ground), [brown_brick_02](https://polyhaven.com/a/brown_brick_02), [concrete_floor](https://polyhaven.com/a/concrete_floor). See [Poly Haven license](https://polyhaven.com/license).
- Renderer: [Three.js](https://threejs.org/), pinned to 0.180.0, MIT; full license in `vendor/THREE-LICENSE.txt`.
