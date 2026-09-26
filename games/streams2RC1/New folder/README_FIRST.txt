STREAMS OVERHAUL - FIXED LOCAL TEST BUILD

RECOMMENDED START:
Double-click START_STREAMS_OVERHAUL.bat

What changed in this fixed build:
- No Python/local web server is required for normal play.
- The launcher opens index.html directly from this separate folder.
- The first launch downloads the exact original STREAMS MP3 from the same Wix URL used by the original game, and stores it locally at:
  assets\audio\streams_song.mp3
- After that first successful download, the game uses the local song file.
- If the song download fails, gameplay still loads instead of failing; run the BAT again after restoring internet access.
- START_STREAMS_SERVER.bat is included only as an optional alternative.

Your original STREAMS folder remains untouched.
