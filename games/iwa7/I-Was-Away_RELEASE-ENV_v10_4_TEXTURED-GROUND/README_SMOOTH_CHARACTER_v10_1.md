# I Was Away — Release ENV v10.1 Smooth Character

This is an update of the original `I-Was-Away_RELEASE-ENV_v10` build using the user-supplied `IWA_inbetweens.zip` Firefly sheets.

## Character changes
- Added midpoint-angle views between the original 8 camera directions for idle hold, release follow-through, catch ready, and catch secured/chest hold.
- Added a dedicated empty-hand waiting state for the return flight.
- Added two-frame throw acceleration bridges.
- Added two-frame release recovery bridges.
- Added two-frame catch approach bridges.
- Added two-frame catch absorb/secure bridges.
- 16-direction states use tighter hysteresis and a shorter crossfade to reduce orbit popping.
- Existing v10 gameplay, environment, boomerang, audio, Track Cam, catch-zone logic, and launcher are retained.

## Firefly source mapping
The original supplied sheets are preserved in `sprites_inbetweens_source/`. Individual production sprites are normalized to 512x768 in `sprites_firefly/`.

## Notes
Some Firefly exports had a flattened checkerboard instead of true transparency. The build automatically converted those backgrounds to alpha while preserving the character. The original source sheets remain untouched for future refinement.
