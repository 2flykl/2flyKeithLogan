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

## Continuous-road stress test

Version 2 was tested at 40× vehicle simulation speed, from 110 m to 11,601.6 m across all six environment categories. Eight stops completed. 257 chunks were created and 239 retired; exactly 18 remained active throughout sampling. The final route sample cache held 570 entries. No backward distance jumps or browser errors occurred while songs changed. See `qa/v2-soak.json`.

Separate real-speed browser scenarios verified town, a full stop and restart, an actual turning heading change, bridge, lakeshore and freeway. The stop waited briefly at zero speed while music continued. Screenshots were inspected for dashboard crop and terrain gaps. See `qa/v2-scenarios.json` and `qa/v2-*.png`.

The complete four-song and dashboard control suite was rerun on Version 2, including real mouse/keyboard/touch input, reduced motion and responsive widths. An overlapping Sound preset row found during testing was fixed by giving Sound its full display area. Existing-site audio ownership and Home/Music/Videos checks also passed. Motion-aware pointer tests bypassed Playwright's stationary-element wait; actual browser pointer/touch events were still used.
This validates streaming logic and bounded scene resources over the tested interval. It does not prove indefinite uptime or guarantee frame rate on every phone. Render performance depends on browser/device GPU and browser power management. The scene is intentionally paused when its tab is hidden, and in reduced-motion mode.

## Remaining content / limits

- Verified Guns and Butter cover artwork has not been located. No substitute was used. Its audio is included and tested (2:45).
- The road is a Youngstown-inspired 3D environment with photographic textures, not actual Youngstown footage or a surveyed route.
- Tests used Chrome on Windows, including mobile emulation and touch dispatch; physical iPhone/Safari and Android devices have not been tested.
- No production deployment or push was performed.
- Optional video-override mode remains available for later replacement but was not tested with actual road footage; the delivered experience uses no video clips.
