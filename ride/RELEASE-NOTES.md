# Ride with 2FLY — RC2

Release candidate built September 24, 2026.

## Optional route suggestions

Left, Ahead and Right buttons appear before occasional junctions. Select or change a suggestion while approaching; it locks 95 metres before the stop. With no selection, the car takes a randomly chosen direction. The car handles speed, stopping and the turn. No steering or song interruption is required. Two additional neighborhood junctions bring the scenic chapter to four intersections, with long uninterrupted bridge, lake and freeway stretches.

The road, camera, scenery and lead traffic share the selected path. Only future road samples and scenery are rebuilt. Scenic categories recur in varied layouts; directions change the generated path rather than selecting surveyed Youngstown streets or named destinations.

## Environmental motion and interior light

Tree crowns, shrubs and reeds have restrained, individually phased wind deformation. Lower trunks remain rooted; their shadow pass uses the same deformation. Soft cabin shade varies with road distance and tree cover, broad sunlight shifts with heading, and woodgrain retains its passing reflections. The stereo screen is excluded from the hardware light overlay. The complete dashboard and hit targets remain on the same suspension rig.

Reduced motion freezes scenery and vegetation and suppresses moving cabin overlays while music continues. End ride and restart remain available.

## Verification

Desktop left/right/ahead/automatic choices and phone touch passed. Tests confirmed completed stops, the matching heading change, continued music, locked selections and reduced-motion freezing. An isolated fixed-camera test confirmed moving foliage with unchanged sky and building pixels. The complete 24-check player suite and existing-site navigation/audio ownership passed. A 40× accelerated drive reached 10,234 m across seven scenery types and 14 stops, with 18 active scenery chunks and no browser errors. See QA-REPORT.md and qa/ evidence.

## Run and replace assets

Extract the complete package and run START_RIDE.cmd, or run `node serve.cjs` with Node.js 18+. No install/build step is required. README.md describes replacing tracks and artwork; ASSET-AUDIT.md documents the Adobe sheets. Route spacing is in ride/route.js (JUNCTIONS), arrow timing and lighting in ride/environment.js, and UI styling in ride/ride.css.

Verified Guns and Butter cover artwork remains outstanding; its correct audio is included and tested. This is a local RC, with no production deployment or push. Browser testing used Chrome with phone emulation, not physical iOS/Android devices.
