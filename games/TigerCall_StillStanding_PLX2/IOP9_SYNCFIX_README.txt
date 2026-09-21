TIGER CALL — I/O/P/9 + DELAY-SYNC FIX

Canonical mapping:
I = LEFT  = MIDI 72
O = DOWN  = MIDI 74
P = RIGHT = MIDI 76
9 = UP    = MIDI 73

Verified first three chart events:
DOWN, DOWN, LEFT (DDL).

Delay prevention:
- TigerHeartbeat MIDI is the only player-action source.
- TigerCall_TEMPO_EVENTS.json is the only tick-to-seconds timing authority.
- TigerCall_TEMPO_MAP.mid remains in the source folder for Studio One reference
  but is NOT parsed or applied again at runtime.
- The compiler converts each MIDI tick using the exact time_seconds anchor from
  the active tempo event, avoiding cumulative re-integration drift.
- Runtime visuals prefer requestVideoFrameCallback metadata.mediaTime, reducing
  the small visual lag possible with coarse currentTime updates.
- Default global timing offset remains 0 ms. Debug offset controls remain
  available if device-specific calibration is ever required.
