STREAMS CLEAN CONTROLLER + PERFORMANCE PASS

This is a recovery build focused on eliminating startup drag and self-triggered movement.

Major changes:
- Player controller rewritten with no queued jump buffer.
- Jump fires only on the actual Up/Space press while grounded/coyote-valid.
- Grounded gravity accumulation removed.
- Visible platform edges are real edges; stepping off detaches immediately.
- Main-route platforms have no horizontal physical drift.
- Start button focus is explicitly removed before gameplay.
- Input uses KeyboardEvent.code and clears on focus loss/tab changes.
- 900x900 character frames are downsampled to 450x450 runtime textures, cutting animation texture memory dramatically.
- Original full-resolution character source files remain untouched.
- Frame delta is capped; no 120 Hz accumulator / catch-up loop.

Run START_STREAMS_CLEAN_CONTROLLER.bat
