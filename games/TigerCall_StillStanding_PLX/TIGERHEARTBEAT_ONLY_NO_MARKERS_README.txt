TIGER CALL — TIGERHEARTBEAT-ONLY / NO-MARKERS TEST

This is an isolated diagnostic build.

ONLY PLAYABLE SOURCE:
  assets/TigerCall_RhythmSource_Clean/MIDI/TigerCall_HUMAN_PERFORMANCE TigerHeartbeat.mid

NOT USED AT RUNTIME:
  markers
  TigerCall_TEMPO_EVENTS.json
  TigerCall_TEMPO_MAP.mid
  old Heartbeat MIDI
  extracted drum/other MIDI
  alternate generated charts

TIMING EXPERIMENT:
  The MIDI is parsed directly at runtime. Because it contains no embedded tempo
  events, this test intentionally uses Standard MIDI default 120 BPM, matching
  the simple Heartbeat-style scheduling experiment.

CONTROLS / MIDI:
  I = LEFT  = MIDI 72
  O = DOWN  = MIDI 74
  P = RIGHT = MIDI 76
  9 = UP    = MIDI 73

EXPECTED FIRST THREE: D D L

This test is not the production timing architecture. It exists only to test
whether removing all marker/tempo-map layers recreates the behavior of the
successful Heartbeat test.
