# Real World View - residential-to-coast edit

Playback order: Residental_01, Residential_02 through Residential_07, then RealTest_01 through RealTest_05. Every clip plays at 1x, in full, forward only. The supplied stop-frame images are references and are not inserted; the current request to play all clips in full supersedes the earlier RealTest_02 trim.

All 4,157 source frames are retained in chronological order. After the last clip, a 30-frame (1.25-second) dissolve blends its final frame into the residential opening frame. The single muted H.264 MP4 loops at that matching endpoint. Total: 4,187 frames, 174.458 seconds at 24 fps. No reverse footage. No source audio. Music changes do not seek or restart the road. End Ride followed by Start begins the residential sequence again.

Residential sources are 1440x704; Real Test sources are 1344x768. The latter are proportionally scaled and vertically cropped to the same 1440x704 windshield plate, without stretching. Existing passenger-seat windshield framing and sampled cabin lighting remain active. Reduced motion pauses the footage independently of music.

## Replace footage

- Video: assets/real-world/residential-to-coast.mp4
- Opening poster: assets/real-world/residential-poster.jpg
- Ordered chapters and timing: assets/real-world/residential-route.json
- Playback and lighting: real-world.js
- Selector previews: assets/route-cards/city.jpg, sky.jpg, and the residential poster

Replace the video and poster together; update chapter start times and forwardSeconds in the manifest. Keep the final fade ending on the opening frame. Increment asset query versions in index.html after code/style changes. The previous lakeside round-trip file is retained as a legacy asset but is no longer loaded.

Sources: user-supplied Residental_realworld.zip and RealTest_videos.zip. The original files are unmodified. Pixel comparison of every normalized source frame against the corresponding output frame confirms sequence preservation, allowing for lossy H.264 encoding. See residential-video-qa.json.
