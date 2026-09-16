# 2Fly Universe — Architecture Specification

## 1. Spatial & Coordinate Model
- **Timeline Mapping**: Time is geography. The X-axis represents chronological progression.
- **Galaxy Spacing**: Each 5-year galaxy is anchored along the X-axis:
  - G2000 (2000–2004): X = 0
  - G2005 (2005–2009): X = 22,000
  - G2010 (2010–2014): X = 44,000
  - G2015 (2015–2019): X = 66,000
  - G2020 (2020–2024): X = 88,000
  - G2025 (2025–2029): X = 110,000
- **Region Offsets**: 3 data-driven regions per galaxy distributed in the XZ plane within a ±5,000 unit bounds.
- **Precision**: Uses relative camera targeting and spherical camera interpolation to maintain 32-bit floating-point precision across extreme galactic distances.

## 2. Level of Detail (LOD) & Performance Strategy
- **Instanced Stars**: Up to 25,000 active visitor stars rendered via a single `InstancedMesh` draw call.
- **LOD Ranges**:
  - Distance < 3,000: Full PBR detail mesh + CSS3D text label.
  - Distance 3,000–12,000: Mid-detail instanced sphere.
  - Distance > 12,000: Low-detail instanced point / starfield particle.
- **Visibility Throttling**: Renders at target 60 FPS; pauses render loop entirely when document tab is hidden.

## 3. Spatial Overlays & In-Universe Media
- Media interactions (audio player, video theater, iframe playable games, archive dossier) open inside persistent spatial shell overlays.
- Camera position, zoom radius, selected celestial object, and background scene ambient loop are saved on overlay open and restored cleanly on overlay close or Escape key press.
