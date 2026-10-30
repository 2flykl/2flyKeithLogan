import {ITEM_ART} from './item-assets.js';

export const ITEM_MESH_SCALE = 1.22;
export const MAX_LOOSE_ART_WIDTH = 1.9;

function artSize(def) {
  const size = ITEM_ART[def?.name]?.size;
  // Unknown art reserves the full capped silhouette rather than a tiny default.
  return Number.isFinite(size) && size > 0 ? size : MAX_LOOSE_ART_WIDTH / ITEM_MESH_SCALE;
}

/** Additional multiplier applied to itemMesh's icon, not to its timer/DOM label. */
export function looseArtScale(def) {
  return Math.min(1, MAX_LOOSE_ART_WIDTH / (artSize(def) * ITEM_MESH_SCALE));
}

/** Final visible world-space silhouette, shared by the renderer and staging. */
export function looseArtWidth(def) {
  return Math.min(MAX_LOOSE_ART_WIDTH, artSize(def) * ITEM_MESH_SCALE * looseArtScale(def));
}

// Current atlas sprites use square planes. Keep this helper separate so a later
// rectangular art crop does not require callers to assume width === height.
export function looseArtHeight(def) {
  return looseArtWidth(def);
}

export function looseArtRadius(def) {
  return Math.max(.83, looseArtWidth(def) / 2 + .04);
}
