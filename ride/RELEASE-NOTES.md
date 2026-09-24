# Ride with 2FLY — RC1

Release candidate built September 24, 2026.

The supplied Adobe sheets now contribute neighborhood houses, trees, parked cars, everyday street detail, lakeshore props, water and ground materials. Solid house roofs/walls, car bodies and bridge girders provide depth around those photographic details. A lead car brakes for curves and stops, while the passenger car follows at a controlled distance. Freeway traffic joins ahead. The road remains independent of the four-song player.

The complete stereo and climate controls fit the desktop viewport. A restrained route/speed readout identifies the changing scenery. Reduced motion freezes the drive and traffic while music remains available.

## Run

Extract the complete package and run START_RIDE.cmd, or run `node serve.cjs` with Node.js 18+. Open the printed local address and choose Start the Ride. There is no install/build step. All music and rendering assets are included.

## Review notes

All four actual audio tracks and the dashboard controls passed browser regression. Seven scene checks, a wide-viewport check, a traffic stop/braking check and an 11 km accelerated streaming check passed. See QA-REPORT.md for evidence and test limits.

The outstanding content item is verified Guns and Butter cover art. Its audio is included and works; the display explicitly shows artwork unavailable. No production deployment or push has been performed.

See ASSET-AUDIT.md for the full 22-sheet assessment and replacement instructions. Five selected sheets needed background extraction because every source PNG lacked real transparency.
