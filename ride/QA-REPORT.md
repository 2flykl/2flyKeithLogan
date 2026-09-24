# Rollin with FLY — verification

## RC4 / Real World View verification

- Source audit: five 1344×768, 24 fps clips with audio, plus one endpoint PNG. RealTest_02 frame 300 was the closest screenshot match. Original sources were preserved.
- Encoded outward route: 1,649 frames; round trip: 3,296 frames, 137.333333 s. Reverse-block timestamps were normalized after an early count discrepancy. Final frame count and sampled reverse frames at block boundaries passed against the forward edit. Output contains no audio stream.
- Browser: silent stationary title preview; Start launches footage and I Was Away; coast, bridge, waterfront, tunnel, sunset and reverse views checked. Tunnel cabin light samples were darker than the coast.
- Forward-to-reverse transition and end-to-start loop passed, including a complete accelerated round trip. Native playback remained active after wrapping. Music pause/next did not halt footage; reduced motion held the frame while music continued, then resumed it.
- Title switching Real → Sky → Youngstown → Real passed. End ride paused the footage. Browser errors: none.
- Full 24-check player suite passed in Real World View using all four actual tracks, including play/pause/seek/next/previous, shuffle, EQ, volume, climate, ownership, end/restart, phone touch, and overflow checks at 320/390/768/1440 px.
- Evidence: qa/real-browser-qa.json, qa/realtest-encode-qa.json, qa/real-qa-results.json and real-*.png. Video loop testing used Chrome on Windows; physical iOS/Android devices are untested. Generated footage artifacts and camera pans are retained as part of the requested test.

## RC3 / Sky Session verification

- Full 24-check player suite passed in Youngstown and again in Sky Session. All four actual MP3s played, paused, sought and transitioned; controls, shuffle, EQ, climate, audio ownership, end/restart and reduced motion passed. No browser errors or failed ride requests.
- Desktop title selection previews the chosen world, then Start launches that mode. End ride allows switching Sky → Youngstown → Sky, preserving each road's position while resetting the song to I Was Away on Start. City direction arrows return correctly.
- Phone touch selects Sky Session and operates the volume knob. Layout overflow checks passed at 320, 390, 768 and 1440 px. Screenshots of the title, four sky themes, desktop and phone were inspected.
- Accelerated sky run reached 4,102.5 m across all four themes: 15 active chunks, 70 created, 55 retired. Sampled renderer geometry count stabilized at 226 (including the retained city scene); sampled draw calls ranged from 229–265. Reduced motion froze sky time/distance/frames; audio continued and motion resumed.
- Early shader compilation defects were caught and corrected before passing the final runs. No shader errors remained in the tested scenes.
- Evidence: qa/sky-soak.json, qa/sky-qa-results.json, qa/qa-results.json, qa/sky-*.png. Tests used Chrome on Windows with touch/mobile emulation, not physical phones or a guaranteed performance benchmark.

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

## RC2 route, lighting and wind verification

- Optional left, straight, right and no-input automatic choices all passed desktop browser checks. User choices produced the matching actual heading change after a complete stop; buttons lock before approach. Mobile touch selects and highlights an arrow.
- Music continues through choices and turns. Reduced motion freezes distance, wind time and lighting properties.
- Fixed-camera foliage test: 35,167 canopy pixels changed while sampled sky and building regions stayed identical. Wind and alpha-tested shadow shaders compiled without errors.
- Full 24-check audio/dashboard regression passed again, including all four actual songs, all controls, end/restart, touch and reduced motion. Existing Home/Music/Videos and cross-player ownership also passed again.
- Accelerated 40× streaming reached 10,234.3 m and 14 stops across all seven scenery categories, with 18 active chunks, 229 created / 211 retired, and 581 cached route samples at finish. Traffic gaps stayed above 9 m and geometry counts below 650. No page errors observed.
- Desktop and phone screenshots inspected; suggestion buttons stay clear of console controls. Reduced-motion overlays are suppressed.
- Evidence: qa/rc2-navigation.json, qa/rc2-wind.json, qa/rc2-soak.json, qa/qa-results.json and screenshots. Earlier RC1 evidence below is retained for context.

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
