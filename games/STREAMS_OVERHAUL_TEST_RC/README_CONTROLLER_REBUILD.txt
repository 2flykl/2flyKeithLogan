STREAMS CONTROLLER REBUILD

This build replaces the inherited player movement loop instead of tuning it.

Controller corrections:
- Gravity is applied only while airborne.
- Grounded vertical velocity is always zero.
- Walking beyond a visible platform edge immediately detaches the player from that platform.
- Standard A/D or arrow movement is direct and responsive.
- Up or Space queues one jump only on the initial key press.
- Double-tap + hold left/right triggers dash.
- All inputs clear on run start, tab switch, or focus loss.
- The old input-arm delay and 120 Hz accumulator loop are removed.
- Frame delta is capped to prevent browser startup stalls from creating giant physics steps.

This keeps the weighted river, attached rewards, current character art, and media assets.
