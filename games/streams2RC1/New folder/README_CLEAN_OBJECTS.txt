STREAMS - CLEAN OBJECTS / WATER REALISM PASS

This build corrects the previous asset-pool mistake.

Key changes:
- NO legacy multi-item category/sprite sheets are used as gameplay platforms.
- Platforms are drawn only from clean isolated newer assets:
  boombox, vinyl, cassette, headphones, microphone, speaker, road case,
  cash stack, cash bundle, coin stack, and money bag.
- Items are slightly exaggerated in size for readability and platforming.
- New water treatment: compact contact shadows, short local ripples,
  subtle reflections, partial blue waterline tint, bob/tilt based on mass,
  and stronger displacement after heavy landings.
- Existing character, dash, jump, buoyancy, sinking, fish, token timing,
  and balanced route-generation improvements are retained.
- The original STREAMS folder is not overwritten.

Run:
START_STREAMS_CLEAN_OBJECTS.bat
