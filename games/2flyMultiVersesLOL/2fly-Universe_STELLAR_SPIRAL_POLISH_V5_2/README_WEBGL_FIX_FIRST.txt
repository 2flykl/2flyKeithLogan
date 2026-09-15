2FLY UNIVERSE — FULL 3D RESTORE V2 / WEBGL FIX

This is NOT the stripped-down Canvas prototype.
It preserves the full Three.js pre-strip Universe.

The previous restore reached the launch screen but Chrome returned:
  Error creating WebGL context

V2 fixes only the graphics-context / launcher layer:
- safer WebGL2 context negotiation
- removes forced high-performance GPU preference
- retries without antialiasing when needed
- dedicated GPU-safe Chrome launcher using D3D11/ANGLE
- WebGL diagnostic page

HOW TO TEST
1. Extract this ZIP into a NEW folder.
2. Double-click START_FULL_3D_GPU_SAFE.bat
3. A fresh Chrome window should open at http://127.0.0.1:8080
4. Click ENTER THE UNIVERSE.

If it still reports WebGL2 unavailable:
- open http://127.0.0.1:8080/WEBGL_DIAGNOSTIC.html
- take a screenshot and send it back.

Do not open index.html directly with file:// for this full 3D build.
