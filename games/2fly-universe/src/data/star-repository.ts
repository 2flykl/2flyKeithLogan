// Star Repository — Abstract interface + Demo Adapter
// Production: swap demo adapter for Supabase adapter by setting env vars.

import type {
  StarRecord, StarPlacementRequest, StarPlacementResult
} from '../types';
import { STAR_COLLISION_RADIUS, REGION_STAR_RADIUS, STAR_Y_RANGE } from '../types';
import { demoStarsAsRecords, getRegionWorldCenter } from './universe-data';
import { store } from '../state/universe-store';
import { nanoid } from '../util/nanoid';

// ── Repository Interface ─────────────────────────────────────────────────────

export interface StarRepository {
  /** Load all publicly visible stars (demo + real) */
  loadStars(): Promise<StarRecord[]>;
  /** Place a new star; enforces collision + one-primary-star */
  placestar(req: StarPlacementRequest): Promise<StarPlacementResult>;
  /** Resolve a single star by immutable ID */
  getStarById(id: string): Promise<StarRecord | null>;
  /** Check if current session already placed a star */
  getMyStarId(): string | null;
}

// ── Spatial Grid for collision detection ────────────────────────────────────

const GRID_CELL = 500;

class SpatialGrid {
  private cells: Map<string, StarRecord[]> = new Map();

  private key(x: number, y: number, z: number): string {
    return `${Math.floor(x / GRID_CELL)},${Math.floor(y / GRID_CELL)},${Math.floor(z / GRID_CELL)}`;
  }

  insert(star: StarRecord) {
    const k = this.key(star.x, star.y, star.z);
    if (!this.cells.has(k)) this.cells.set(k, []);
    this.cells.get(k)!.push(star);
  }

  checkCollision(x: number, y: number, z: number, radius: number): boolean {
    const cx = Math.floor(x / GRID_CELL);
    const cy = Math.floor(y / GRID_CELL);
    const cz = Math.floor(z / GRID_CELL);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          const k = `${cx + dx},${cy + dy},${cz + dz}`;
          const stars = this.cells.get(k);
          if (!stars) continue;
          for (const s of stars) {
            const dist = Math.sqrt(
              (s.x - x) ** 2 + (s.y - y) ** 2 + (s.z - z) ** 2
            );
            if (dist < radius) return true;
          }
        }
      }
    }
    return false;
  }

  rebuild(stars: StarRecord[]) {
    this.cells.clear();
    for (const s of stars) this.insert(s);
  }
}

// ── Demo / localStorage Adapter ──────────────────────────────────────────────

const STORAGE_KEY = 'universe_stars';
const MY_STAR_KEY = 'universe_my_star_id';
const RATE_LIMIT_KEY = 'universe_last_place';
const RATE_LIMIT_MS = 1000 * 60 * 5; // 5 min demo rate limit

class DemoAdapter implements StarRepository {
  private grid = new SpatialGrid();
  private stars: StarRecord[] = [];
  private loaded = false;

  async loadStars(): Promise<StarRecord[]> {
    if (this.loaded) return this.stars;

    // Load demo seed stars
    const demo = demoStarsAsRecords();

    // Load any user-placed stars from localStorage
    let saved: StarRecord[] = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) saved = JSON.parse(raw) as StarRecord[];
    } catch {
      saved = [];
    }

    this.stars = [...demo, ...saved];
    this.grid.rebuild(this.stars);
    this.loaded = true;
    return this.stars;
  }

  async placestar(req: StarPlacementRequest): Promise<StarPlacementResult> {
    // One-primary-star rule
    const myId = this.getMyStarId();
    if (myId) {
      return { success: false, error: 'already-placed' };
    }

    // Rate limit
    const last = localStorage.getItem(RATE_LIMIT_KEY);
    if (last && Date.now() - parseInt(last) < RATE_LIMIT_MS) {
      return { success: false, error: 'rate-limit' };
    }

    // Collision check
    if (this.grid.checkCollision(req.x, req.y, req.z, STAR_COLLISION_RADIUS)) {
      return { success: false, error: 'collision' };
    }

    // Bounds check: keep within region
    const center = getRegionWorldCenter(req.galaxyId, req.regionId);
    const dx = req.x - center[0];
    const dz = req.z - center[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist > REGION_STAR_RADIUS || Math.abs(req.y - center[1]) > STAR_Y_RANGE) {
      return { success: false, error: 'collision' }; // out of bounds treated as placement error
    }

    const star: StarRecord = {
      id: nanoid(),
      galaxyId: req.galaxyId,
      regionId: req.regionId,
      x: req.x,
      y: req.y,
      z: req.z,
      displayName: sanitize(req.displayName),
      starName: req.starName ? sanitize(req.starName) : undefined,
      message: req.message ? sanitize(req.message) : undefined,
      signatureDataUrl: req.signatureDataUrl,
      createdAt: new Date().toISOString(),
      isDemo: false,
    };

    this.stars.push(star);
    this.grid.insert(star);
    this.savePersisted();
    localStorage.setItem(MY_STAR_KEY, star.id);
    localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
    store.setMyStarId(star.id);
    return { success: true, star };
  }

  async getStarById(id: string): Promise<StarRecord | null> {
    await this.loadStars();
    return this.stars.find(s => s.id === id) ?? null;
  }

  getMyStarId(): string | null {
    return localStorage.getItem(MY_STAR_KEY);
  }

  private savePersisted() {
    const realStars = this.stars.filter(s => !s.isDemo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(realStars));
  }
}

function sanitize(text: string): string {
  return text.replace(/[<>&"']/g, c => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;',
  }[c] ?? c)).slice(0, 120);
}

// ── Supabase Adapter Stub ────────────────────────────────────────────────────
// Set VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY to enable.
// Uncomment and implement when credentials are available.
/*
import { createClient } from '@supabase/supabase-js';
class SupabaseAdapter implements StarRepository { ... }
*/

// ── Factory ──────────────────────────────────────────────────────────────────

function createRepository(): StarRepository {
  const supaUrl = import.meta.env.VITE_SUPABASE_URL;
  const supaKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (supaUrl && supaKey) {
    // TODO: return new SupabaseAdapter(supaUrl, supaKey);
    console.warn('[Universe] Supabase env vars found but adapter not yet wired. Falling back to demo.');
  }
  return new DemoAdapter();
}

export const starRepository: StarRepository = createRepository();
