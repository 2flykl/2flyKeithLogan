# PHYSICS_IMPLEMENTATION.md

## Recommended production stack
- Babylon.js for rendering / FPS camera / GUI.
- Havok Physics via Babylon Physics V2 for physical projectile WOMP and collision bodies.
- Separate first-person arm rig from the world character representation.
- Pointer Lock API for mouse-look.

## Production architecture
`WeaponController -> ProjectileFactory -> CollisionResolver -> Damage/Impulse -> VFX/Audio -> Score/Combo`

### Projectile modes
- `physical`: disc, javelin, shell, thrown object
- `rayburst`: traditional very-fast round / beam-like shot
- `spherecast`: bass pressure wave / oversized sonic round
- `placeable`: mine, piano artillery, console turret

### Collision pipeline
- Keep target collider simpler than visible mesh.
- Attach gameplay metadata/components to collision body.
- On collision: resolve surface -> damage -> impulse -> ricochet/stick/penetrate -> FX -> score.
- Use bounded lifetime and max ricochet count for every physical projectile.

### Recoil
Use critically damped spring recovery; tune impulse independently from camera shake.
The weapon rig should absorb most recoil. Camera shake should communicate impact, not disorient the player.

### Sources consulted
Babylon.js community FPS implementations and discussions show:
- pointer lock as the browser FPS mouse-look pattern,
- dedicated FPS arm rigs,
- physical bullets with gravity and ricochet,
- Havok-managed projectile collision,
- sphere projectile collision shapes,
- per-weapon recoil/accuracy behavior.

References:
- https://forum.babylonjs.com/t/first-person-shooter-fps-gaming-engine-alpha-version-demo/52564
- https://forum.babylonjs.com/t/locking-camera-to-mouse-like-in-an-fps/42370
- https://forum.babylonjs.com/t/how-to-implement-first-person-shooter-camera/8373
