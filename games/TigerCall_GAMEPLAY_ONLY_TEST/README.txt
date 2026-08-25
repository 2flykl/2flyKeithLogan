TIGER CALL — GAMEPLAY-ONLY TEST

PURPOSE
This build intentionally removes the video and all presentation layers so the core
rhythm gameplay can be tested by itself.

INCLUDED
- TigerCall_FinalMaster.mp3
- TigerCall_NewHeart_HumanPerformance.mid
- TigerCall_NewHeart_Reference.mid
- 4 gameplay lanes
- 357 falling MIDI-driven icons
- 4 landing paws / receptor lines
- hit judging + score + combo
- I / O / P / 9 controls

MASTER CLOCK
The MP3 is the only runtime clock:
  audio.currentTime

MIDI LOGIC
- HumanPerformance MIDI supplies the 357 falling gameplay cues.
- Reference MIDI supplies tempo and authored Start/End markers.
- MIDI time is fitted to the MP3 duration using:
  gameplayTime = (midiTime - MIDI_Start) * MP3_Duration / (MIDI_End - MIDI_Start)

LANES
72 = LEFT  = I
74 = DOWN  = O
76 = RIGHT = P
73 = UP    = 9

TEST
Open index.html through your normal local/dev server and click START TEST.
Do not open via a browser environment that blocks local fetches for MIDI files.
