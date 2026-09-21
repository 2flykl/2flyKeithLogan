2FLY UNIVERSE — CINEMATIC SPIRAL RECOVERY V4

THIS IS A CONTINUATION OF THE FULL 3D ENGINE, NOT A CANVAS/DOM REBUILD.

WHY THIS VERSION EXISTS
The previous GPU galaxy was mathematically a thin particle disk, but from the active camera it collapsed visually into a bright horizontal band. Earlier nebula attempts became a giant translucent green plate. This version separates the galaxy into distance-based representations.

WHAT CHANGED
1. Deep Space / Galaxy Approach
   - Dedicated 4096x4096 Playable Frontier spiral texture generated from hundreds of thousands of stellar/dust samples.
   - Correct square aspect ratio and no spherical wrapping, so the spiral image is not stretched.
   - The exterior spiral is intentionally oriented toward the Universe home camera so it reads unmistakably as a galaxy.

2. Transition Into Galaxy Residency
   - The 4K exterior spiral fades away before the camera enters it.
   - Sparse 3D GPU particles fade in as the camera approaches.
   - The giant showcase nebula plane is disabled completely.
   - Inside the galaxy there is no green wall/plate surrounding the camera.

3. Core
   - Much smaller stellar nucleus.
   - Compact flare and flattened stellar/accretion disk.
   - The core is a light source, not another planet-sized green sphere.

4. Clutter
   - Global Playable Frontier groove lines reduced to 3.
   - Local planetary systems remain separate.

5. Resolution / Image Quality
   - WebGL device pixel ratio ceiling raised to 2.0.
   - Flagship textures use mipmaps and anisotropic filtering.
   - Exterior galaxy is a dedicated 4K texture rather than artwork stretched around geometry.

TEST
Extract this ZIP to a NEW folder.
Double-click START_CINEMATIC_SPIRAL_V4_GPU_SAFE.bat
Browser URL: http://127.0.0.1:8091/

VISUAL PASS/FAIL RULE
From Deep Space the Playable Frontier must clearly read as a spiral galaxy even when viewed as a small screenshot. If it reads as a ball, plate, or horizontal green stripe, it fails.
