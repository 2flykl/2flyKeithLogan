# Guns & Butter — WOMP Range Starter Kit

## Goal
This package establishes the reusable core for a polished browser-first **Guns & Butter: Weapons of Mass Production** range. The intent is that the remaining WOMP are added as data + art rather than requiring a rewrite of the shooting, recoil, projectile, collision, target, HUD, or arsenal systems.

## Starter WOMP
1. Staffline Sidearm — traditional note bullets
2. CD Double Barrel — dual charged compact discs with high ricochet
3. Note Rifle — automatic music-note ballistic rounds
4. Harp Javelin — arcing physical javelins / sharp clef concepts
5. 808 Hand Cannon — heavy bass-pressure sphere
6. Vinyl Launcher — spinning physical vinyl discs
7. Keytar Rifle — fast synth-wave bursts

## Character identity
The player is African American. Use the included first-person hand/arm references as the FPS arm rig. For the final art pass, maintain consistent dark skin tone across idle, aim, fire, reload, inspect, swap, and placeable-WOMP states. A portrait / arsenal avatar should reinforce identity outside the FPS view.

## Physics / feel specification

### Camera and recoil
- Pointer-lock mouse look.
- Recoil is split into **vertical kick + horizontal drift** per weapon.
- Never teleport the camera to recoil pose. Apply an impulse and spring it back toward the neutral aim vector.
- Recommended spring model:
  - recoil velocity += shot impulse
  - recoil velocity += (-stiffness * recoilOffset - damping * recoilVelocity) * dt
  - recoilOffset += recoilVelocity * dt
- ADS should reduce spread and horizontal recoil, not eliminate recoil.
- Large WOMP should move the weapon/arms more than the camera to preserve comfort.

### Physical projectiles
Use a physical projectile for discs, javelins, shells and other objects where the travel path is part of the fun.
- Fixed simulation step recommended.
- Sphere/capsule collision shapes are preferable to full detailed projectile meshes.
- Continuous collision detection or ray-sweep between previous/current positions prevents tunneling.
- Gravity should be tuned per projectile instead of globally “realistic.”
- Collision response:
  - metal / hard target: possible ricochet
  - soft / paper target: penetrate or stick
  - wall: spark + decal + energy loss
  - floor: bounce only for explicitly bouncy WOMP

### Ricochet
For ricochet-capable WOMP:
1. Reflect velocity around the collision normal.
2. Multiply speed by a material energy-retention factor.
3. Add a tiny deterministic angular perturbation so repeated impacts do not look robotic.
4. Decrement ricochet count.
5. Damage scales down after each bounce.

CD and vinyl WOMP should be visually excellent ricochet showcases.

### Ray / hitscan projectiles
Use ray or sphere cast for extremely fast bullets and beam-like WOMP.
- Traditional note rounds can be raycast if travel time is visually irrelevant.
- Render a tracer / note sprite even if damage resolution is instant.
- Never rely on frame-to-frame point collision for very fast shots.

### Harp Javelin
- Physical launch.
- Visible gravity arc.
- Javelin aligns to velocity vector in flight.
- On valid surface hit: stick and vibrate.
- Charged launch increases speed and flattens the trajectory.
- Alternate ammo can be a razor treble-clef projectile.

### 808 Hand Cannon
- Slow moving pressure sphere or short sphere-cast.
- On impact: radial impulse and damage falloff.
- Use a visible air distortion ring / bass shockwave.
- Strong weapon-model recoil, moderate camera recoil.

### Destruction
Targets have states rather than binary disappear:
`intact -> damaged -> critical -> break -> debris`
Heavy hits impart force to debris. Light hits use sparks / paper tears / wobble.

### Target motion
Moving targets should use predictable paths with easing and occasional pauses. Difficulty comes from speed, range and shot timing, not erratic random teleportation.

## Animation state contract
Every handheld WOMP should support:
- idle
- aim / ADS
- fire
- recover
- reload
- empty / dry fire
- equip
- unequip
- inspect
- special ability

Placeable WOMP additionally support:
- ghost placement
- valid placement
- invalid placement
- deploy
- operate
- pack up

## Wow-factor checklist
- Different muzzle / projectile identity per WOMP.
- Reactive targets and debris.
- Screen-space hit markers and combo feedback.
- Impact audio layered with the musical identity of the WOMP.
- Micro camera shake only on heavy impact.
- Weapon inspection animation.
- Arsenal presentation before the range.
- Strong contrast between ballistic, sonic, and hybrid WOMP.
- No generic laser substitution for every weapon.

## Browser production path
For the full 3D production build, Babylon.js + Havok is the recommended route. Babylon FPS examples demonstrate pointer-lock first-person controls, dedicated first-person arm rigs, physical bullets, gravity, ricochet, recoil and physics-driven interactions.

The included `index.html` is a dependency-free **offline functional prototype** so the package opens and shoots immediately even without a build system. The generated boards/sprites are art-direction references and starter assets; production should convert final WOMP art to optimized transparent WebP/PNG sprites or 3D models as appropriate.

## Add another WOMP
1. Add a weapon record to `data/weapons.json`.
2. Add its projectile definition to `data/projectiles.json`.
3. Add weapon art / state sheet.
4. Map its projectile mode to physical, rayburst, spherecast or placeable.
5. Add muzzle/impact/audio identity.
6. Tune recoil, spread, velocity, gravity, cooldown and ricochet.
7. QA idle/fire/reload/empty/inspect/swap and target interactions.

## Folder structure
- `assets/boards/` — full production concept boards
- `assets/weapons/` — WOMP state sheets / references
- `assets/projectiles/` — projectile sprite references
- `assets/vfx/` — impact / spark / shockwave reference
- `assets/targets/` — target / destruction reference
- `assets/character/` — African American first-person arm rig reference
- `data/` — reusable WOMP and projectile configuration
- `src/` — functional offline demo
- `index.html` — open this to play the demo

## Acceptance target for the next implementation pass
The core is considered “locked” when:
- all starter WOMP select correctly
- each uses the correct projectile family
- recoil is weapon-specific
- targets register hit / miss and score
- combos reset on misses
- range runs without page scrolling
- pointer lock recovers correctly after ESC / tab switching
- no projectile tunnels through thin targets
- ricochet counts are bounded
- WOMP can be added from config without modifying unrelated systems
