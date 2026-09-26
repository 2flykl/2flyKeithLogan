STREAMS · RELEASE CANDIDATE 1

RUN
1. Extract the ZIP into its own folder.
2. Double-click START_STREAMS_RC1.bat.
3. The launcher uses a dedicated localhost port (8777) so an older STREAMS test server cannot accidentally serve a previous build.

RC-1 FOUNDATION
- Built from the STABLE FPS version that passed local testing.
- Stable controller architecture retained; player physics hitbox was not enlarged or replaced.
- Performance-capped renderer retained.
- Optimized 450px character animation runtime frames retained.

NEW RC SYSTEMS
- 8 digital-media platform families: microphone, boombox, turntable, MPC/drum pad, synth keyboard, laptop, studio speaker, sinking Blue Attention Ball.
- Four prepared visual states per platform family (idle, weighted/impact, sink, recovery/deep state) loaded as small WebP runtime textures.
- No shoes/clothing and no money objects are jumpable platforms.
- Money/Value exists only as an attached collectible on real platforms.
- Small Attention rewards also ride on real platforms; nothing collectible floats ambiguously in open air.
- Large Blue Attention Ball is an actual platform and sinks rapidly after landing.
- Weighted river director with recovery beats, reward safeguards, platform variety bags, and Attention-Ball cooldown.
- First 5 platforms are an onboarding stretch with wider/stable surfaces and no Attention-Ball platform.
- Main route horizontal spacing is capped so ultrawide displays do not create impossible normal jumps.
- Side lines remain optional higher-risk choices where dash is more useful.

CONTROLS
A / D or Left / Right: move
Up or Space: jump
Double-tap + hold Left/Right: dash

DEBUG
A live FPS counter remains visible for RC validation. The target is a stable ~50-60 FPS on the machine that passed the stable-FPS build.
