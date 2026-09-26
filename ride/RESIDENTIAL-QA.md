# Residential update QA - 2026-09-25

- All 12 supplied clips retained: 4,157 chronological source frames, plus a 30-frame final dissolve. Output 174.458 seconds at 24 fps, forward only. Full frame-by-frame normalized pixel comparison passed (mean absolute error below 0.33/255 for each clip).
- Browser played the complete sequence through a natural loop, observed Real Test waterfront at 139s and residential again at 12s after wrap; video remained playing and music continued.
- Song change and music pause do not stop or seek the road. Reduced motion pauses the road while music continues; switching it off resumes motion.
- Start/end/restart exercised. Real World restart begins residential at zero. Youngstown and Sky Session launch with music and their route labels.
- Title cards inspected at 1440x1000 and 390x844. No horizontal document overflow; phone Start control fits within viewport (bottom 688px).
- Latest production changes merged before release, including the 12-track catalogue and Artificial Love album grouping. Beautiful Mind decoded and played with cover artwork after restoring the sparse checkout's album assets.
- Browser console error collection empty on final integrated run. JavaScript syntax checks and git whitespace checks passed.
- Existing generated camera movements and visual artifacts inside the supplied clips are retained. The requested full-length playback takes precedence over previously supplied stop-frame references.
