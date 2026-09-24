# Real World View — video edit

The five user-supplied generated clips are used in numerical order, 01 → 02 → 03 → 04 → 05. All source audio is removed. The stereo retains the only audible soundtrack.

RealTest_02 is trimmed after frame 300 (zero-based), at 12.500 seconds; its retained duration is 301/24 = 12.541667 seconds. Frame 300 was the closest match to RealTest_02LastFrame.png across the complete source. The screenshot is a reference, not an inserted still frame.

All clips are 1344×768 at 24 fps. Eight-frame (0.333333 s) dissolves connect the matching scene ends. The outward edit has 1,649 frames / 68.708333 seconds. Its frames are then played in reverse order, omitting duplicated turnaround and loop endpoints: forward frame 0 through 1648, then 1647 through 1, then loop back to 0. The result is 3,296 frames / 137.333333 seconds, with no audio stream. Default playback at 0.9× makes a complete round trip approximately 2 minutes 33 seconds.

The video is encoded as H.264 / yuv420p with fast-start metadata. Backward motion is encoded into the file: it does not depend on unsupported negative browser playback rates or repeated seeking. One muted inline video decodes the whole journey, so music transitions never switch the footage.

The original dashboard alpha opening masks the footage. CSS object-fit preserves proportions, with a small overscan and crop tuned to the windshield. The cabin has restrained suspension movement. A 24×14 video sample updates smoothly to vary dashboard exposure and warmth; the stereo display stays independently lit. Reduced motion pauses the video and disables moving cabin overlays.

## Replace or rebuild

- Current video: ride/assets/real-world/lakeside-roundtrip.mp4
- Poster: ride/assets/real-world/poster.jpg
- Edit timing and clip joins: ride/assets/real-world/route.json
- Playback, labels and sampled cabin light: ride/real-world.js
- Windshield framing: #realWorldVideo rules in ride/ride.css

A replacement should be silent H.264 MP4, with an encoded forward/reverse return if that behavior is still wanted. Update forwardSeconds and joins in route.json, and keep the filename or change its path in real-world.js. Source files remain in the original RealTest_videos.zip; originals were not modified.

## Suggestions for the next footage batch

Keep a fixed passenger-eye camera, consistent lens and horizon height, and 12–24 frames of overlap between connected clips. Generate scenery without baked-in glass, wipers or rain effects; those can then be controlled consistently in the browser. Longer continuous road sections will reduce visible generative changes. This test intentionally retains the supplied camera pans and visual artifacts, and reverse motion is the requested functionality test.
