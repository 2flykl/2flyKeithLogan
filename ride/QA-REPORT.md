# Ride with 2FLY — verification

## Passed

- Start gate: no autoplay; road is stationary before Start.
- Start: I Was Away plays and road advances.
- All four actual audio files: metadata decoded, playback advances, pause holds position, 46% seek lands correctly, resume works.
- Direct next/previous transitions, end-of-track wrap, playlist selection, paused track changes.
- Correct local artwork mappings for I Was Away, Streams and Gettin It. Guns and Butter intentionally reports unavailable artwork.
- Shuffle contains exactly the same four songs, with no repetition within a cycle; clear on/off state.
- Volume up/down, mute/unmute, keyboard dial adjustment, mouse drag and real browser touch-event dispatch.
- Screensaver, Home, queue and Sound view.
- Original, Car Cabin and Performance Bass presets; individual bands alter actual Web Audio filter nodes.
- Nonzero audio signal reaches the analyser. Sampled output stayed below clipping during the +4 dB/all-bands stress case. This is not an exhaustive loudness certification.
- Both climate temperatures and warm/cool readout change.
- Reduced motion suspends the road but keeps music playing; re-enabling resumes without resetting distance.
- Cross-tab ride ownership and existing global site player ownership work both directions.
- End ride, restart, first-track reset.
- No horizontal overflow at 320, 390, 768 and 1440 CSS pixels; desktop and phone screenshots visually inspected.
- Existing Home, Music and Videos routes still render; existing-site navigation and return link work.
- No new browser JavaScript errors in the ride or tested existing-site routes. No failed ride asset requests.

## RC1 route and traffic verification

- Full player suite: 24 checks passed, using the four actual MP3 files. No browser errors or failed ride requests.
- Seven scenario views passed: town, residential, stop, turn, bridge, lakeshore, freeway. Screenshots were visually inspected for material borders, cutout backgrounds, shoreline placement, house depth and dashboard framing.
- Lead traffic: brake lights, stopping and restart verified. Minimum observed centerline gap was 11.32 m. Reduced motion freezes both road and traffic while music continues.
- The 1897×855 viewport from the user's crop report keeps the full console and climate panel visible. The phone layout retains reachable controls.
- Existing-site audio ownership and Home/Music/Videos regression passed again.

At 40× simulation speed, the final RC streamed from 110 m to 11,003.6 m, across all seven scenery categories and 8 stops. 245 chunks were created and 227 retired. Exactly 18 stayed active. Renderer geometry count ranged from 84 to 238; the route cache finished with 581 samples. No distance resets, browser errors or traffic collisions were observed. Songs were changed during the run.

A retired-route-sample error discovered in accelerated testing was fixed by advancing all vehicles on the same simulation clock. A material gutter bleed was fixed by extracting source patches into independent runtime textures before mipmaps are generated. Both fixes were rechecked.

Evidence: `qa/qa-results.json`, `qa/rc-scenarios.json`, `qa/rc-traffic.json`, `qa/rc-soak.json`, `qa/integration-qa.json`, and RC screenshots. Automated tests use Chrome on Windows with phone/touch emulation; they do not establish a frame-rate guarantee on physical phones or indefinite uptime. Pointer tests bypass the stationary-element wait because the cabin deliberately moves, while still dispatching actual pointer/touch events.

## Remaining content / limits

- Verified Guns and Butter cover artwork has not been located. No substitute was used. Its audio is included and tested (2:45).
- Asset sheets are 2D artwork, not supplied 3D scans. Some distant objects and plants remain cutouts; inspect at the intended passenger camera distance.
- The road is a Youngstown-inspired 3D environment with photographic textures, not actual Youngstown footage or a surveyed route.
- Tests used Chrome on Windows, including mobile emulation and touch dispatch; physical iPhone/Safari and Android devices have not been tested.
- No production deployment or push was performed.
- Optional video-override mode remains available for later replacement but was not tested with actual road footage; the delivered experience uses no video clips.
