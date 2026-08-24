TIGER CALL: STILL STANDING — FRESH LAUNCH BUILD

This build replaces the entire pre-game/start architecture.

STARTUP
- New LED-drone launch deck.
- New START TIGER CALL control.
- The START TIGER CALL click directly calls the MP3 play() method.
- No retry-sound route, old ENTER route, delayed startup verification, or legacy call-up sequence is used.
- The launch deck exits only after the browser accepts audio playback.

SYNC
- One gameplay MIDI only: assets/midi/TigerCall_HumanPerformance_Synced.mid
- One master audio file: assets/audio/TigerCall_FinalMaster.mp3
- Audio currentTime is the gameplay clock.
- MIDI pitch mapping: 72=LEFT/I, 74=DOWN/O, 76=RIGHT/P, 73=UP/9.

RUN FROM A WEB SERVER / REPOSITORY PREVIEW. Browser fetch security can block MIDI loading if index.html is opened directly as file://.
