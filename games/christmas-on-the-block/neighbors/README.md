# Neighbors, outfits and throwing variety

Six new African American identities: a parka-wearing adult man and braided adult woman who play snowball; a senior man with a cane, senior woman with groceries, mother pushing a closed stroller, and a man decorating with a wreath and lights. Each has a separate flat, partially snow-covered resting sprite. The stroller remains upright; no infant is visible or targetable.

## Gameplay

- Eleven civilian instances appear along the five-stop route. They have a NEIGHBOR badge and never enter the attack scheduler.
- An accidental civilian hit deducts 150 points once, shows an OOPS / NEIGHBOR HIT notice, and transitions to the resting pose. Fallen residents are no longer targets. Civilians do not gate encounter completion.
- Pedestrians use two illustrated poses with gentle sidewalk motion; decorators alternate reaching poses. These are limited sprite animations, not full skeletal walk cycles.
- Two new fighter identities replace eight existing encounter slots. Existing human characters and the twelve teen runners remain. Enemy health, player health and existing controls are unchanged.
- Five profiles: steady (1.44-second flight), lobber (1.95), fast (.91), double (1.35), triple (1.48). Add visible windups of .42–.50 seconds, per-actor speed variation and travel adjustment. Double and triple shots are spaced .40/.36 seconds apart, followed by longer 3.05/3.65-second recovery gaps.
- Follow-up throws are queued, not simultaneous. Hitting or defeating the sender cancels remaining queued shots. Route changes and replay clear the queue. At most six active-plus-queued shots may be scheduled.

## Recoloring

Original outfit plus cranberry, midnight and plum variants. Runtime derives soft clothing masks from source pigment hue and caches the results before play. New artwork deliberately uses turquoise clothing; its mask excludes brown skin, cream trim, hair, snow, green wreaths and the burgundy stroller. Existing cast masks select green and berry clothing pigments. Yellow garments stay yellow rather than risking skin-tone recoloring. Painted value/shading and alpha are preserved. Every available pose uses the same palette, including down poses.

The inspector at `index.html` lets the user switch colors and inspect ready, animation and laid-out poses. `atlas.json` contains exact independent crop rectangles and the original transparent sheets are retained. New imagery was generated for this project; no external stock pack was used.

## Validation

`node scripts/test-game.cjs` covers original controls/progression plus mask exclusions, new identities, civilian penalty/repeated-hit protection, visible opening targets, projectile speeds, burst scheduling/interruption and replay reset. The opening encounter was also checked visually in the browser; a civilian hit produced -150 and settled into the dedicated flat resting sprite. Physical mobile GPU testing remains outstanding.
