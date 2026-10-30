import {hasFloor} from './apartment-route.js';
import {looseArtRadius} from './item-display.js';

// These are the usable main-platform edges, not the decorative deck edges.
const FLOOR_BOUNDS = new Map([
  [0, [-13, 13]],
  [5, [-13, 13]],
  [10, [-13, 13]],
  [15, [-13, 13]],
  [20, [-13, 13]],
  [32.4, [-10.5, -2.5]],
]);
const GRID = .5;
const SCALE_CLEARANCE = 3.25;
const LANDING_CLEARANCE = 1.4;
const ITEM_GAP = .2;
const EPSILON = 1e-8;
const TWO_SCALE_POCKETS = [-12, -9.5, 0, 9.5, 12];

/** Actual enlarged silhouette plus padding; fixed DOM badges have no world footprint. */
export function itemRadius(def) {
  return looseArtRadius(def);
}

/** Half-unit grid positions whose full item footprint clears every tray/landing zone. */
export function safeSlots(y, scales = [], def) {
  const bounds = FLOOR_BOUNDS.get(y);
  if (!bounds) return [];
  const radius = itemRadius(def);
  const localScales = scales.filter(s => Number.isFinite(s.x) && Math.abs(s.y - y) <= EPSILON);
  const first = Math.ceil((bounds[0] + radius) / GRID);
  const last = Math.floor((bounds[1] - radius) / GRID);
  const slots = [];
  for (let index = first; index <= last; index++) {
    const x = index * GRID;
    if (hasFloor(x,y,radius) && localScales.every(s =>
      Math.abs(x - s.x) + EPSILON >= SCALE_CLEARANCE + radius &&
      Math.abs(x - (s.x + 2)) + EPSILON >= LANDING_CLEARANCE + radius
    )) {
      slots.push(x);
    }
  }
  return slots;
}

function itemIsOnFloor(thing, y) {
  // Count incoming deliveries as well as everything already loose on this floor.
  // Optional ledges belong to the main floor beneath them (13.4 -> 10, 18.4 -> 15).
  const heightFloor = Number.isFinite(thing.y) ? Math.floor((thing.y + .05) / 5) * 5 : NaN;
  return (Number.isFinite(thing.deliveryY) && Math.abs(thing.deliveryY - y) <= EPSILON) || heightFloor === y;
}

/**
 * Reserve an unobstructed spot on the SAME main floor. Ordinary supply never piles.
 * Manually released items (spills/returns/placement) may pile after empty slots are exhausted; even
 * then the full art footprint stays outside every scale envelope. No unsafe fallback.
 */
export function chooseStaging({y, scales = [], things = [], def, preferredX = 0, allowPile = false}) {
  const slots = safeSlots(y, scales, def);
  if (!slots.length) return null;
  const radius = itemRadius(def);
  const preferred = Number.isFinite(preferredX) ? preferredX : 0;
  const twoScaleFloor = scales.filter(s => Number.isFinite(s.x) && Math.abs(s.y - y) <= EPSILON).length >= 2;
  const loose = things.filter(o =>
    (o.kind === 'item' || (o.kind === undefined && o.def)) &&
    Number.isFinite(o.x) && itemIsOnFloor(o, y)
  );
  const ranked = slots.map(x => {
    let crowd = 0;
    let overlap = 0;
    for (const item of loose) {
      const encroachment = radius + itemRadius(item.def) + ITEM_GAP - Math.abs(x - item.x);
      if (encroachment > EPSILON) {
        crowd++;
        overlap += encroachment;
      }
    }
    const pocketPriority = twoScaleFloor && !TWO_SCALE_POCKETS.includes(x) ? 1 : 0;
    return {x, crowd, overlap, pocketPriority, distance: Math.abs(x - preferred)};
  });
  const empty = ranked.filter(slot => slot.crowd === 0);
  if (empty.length) {
    // Filling a near-center grid slot can strand its neighboring outer pocket.
    // Reserve the five enlarged-art pockets first; every pocket is still vetted
    // by safeSlots, so a changed layout can never force an unsafe placement.
    empty.sort((a, b) => a.pocketPriority - b.pocketPriority || a.distance - b.distance || a.x - b.x);
    return {x: empty[0].x, y, z: .6, stack: 0};
  }
  if (!allowPile) return null;
  ranked.sort((a, b) => a.crowd - b.crowd || a.overlap - b.overlap || a.distance - b.distance || a.x - b.x);
  const chosen = ranked[0];
  return {x: chosen.x, y, z: Math.min(1.3, .6 + chosen.crowd * .14), stack: chosen.crowd};
}
