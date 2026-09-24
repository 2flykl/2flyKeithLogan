# Tempest Pavilion assets

The marble and garden imagery were made with the built-in image-generation tool for this game, then encoded as JPEG textures. The source marble PNG is preserved in the workspace at `outputs/Tempest-Pavilion-Art/calacatta-source.png`. These are surface/background assets; the WOMP, ammunition, target assemblies, architecture, and curtains are actual 3D geometry.

## Marble prompt

Create a production game texture asset, a seamless square photographed slab of luxurious polished white Calacatta marble. Top-down orthographic flat albedo texture only, edge to edge stone, no tiles, no room, no objects, no text, no borders, no cast shadows, no directional highlights. Soft warm white ivory ground, realistic translucent cloudy calcite grain, a few sweeping branching smoky gray veins and extremely subtle warm gold mineral threads, mostly white negative area, restrained expensive natural stone. Large-scale diagonal organic veins with fine branching details, no repetitive scribbles. Photoreal material scan.

## Garden prompt

Production video game environment background texture: very wide panoramic landscape photograph viewed at eye level from an elegant circular museum, looking out at a tranquil prestigious sculpture garden. No window frames, no interior, no people, no text. The lower third shows pale limestone terraces, reflecting pool and sculpted clipped hedges with slender mature cypress trees and green olive trees, few elegant abstract black sculptures; middle distant hazy forest and low hills, upper half spacious pale blue morning sky with wispy soft clouds. Cool restrained muted colors, realistic photographic lighting with warm sunlight from upper left, luxurious cinematic architecture magazine landscape, quietly monumental. Edge to edge outdoor scenery for use as panoramic backdrop beyond actual 3D windows. Landscape 3:1 aspect ratio, high resolution.

## Sound

No sound downloads or services are required. `src/tempest-audio.js` generates deterministic PCM percussion buffers using noise excitation and inharmonic resonant modes. The firing mix combines paired jingle sounds, a latch transient, and a body thump. Plate impacts, cassette movement, ricochets, and footsteps have separate layers. A stereo convolution response supplies gallery reverberation. Sound is synthesized rather than a recording of a real tambourine; subjective listening on the creator's headphones remains useful for further tuning.

## Rendering

The main WOMP is an articulated procedural reconstruction of the supplied Tempest reference, not an imported sculpted GLB. It preserves the black/gold rifle silhouette, cyan staff panel, tambourine ring, scope, and drum cassette. Model parts include the moving carriage, spring, barrel, cassette, and individual paired jingles. Desktop uses periodic planar floor reflections; touch devices use the environment lighting without that additional rendering pass.
