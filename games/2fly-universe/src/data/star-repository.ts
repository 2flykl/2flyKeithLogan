// Star Repository — Phase II One-Star-Per-Galaxy Canonical Rule & Demo Adapter
// Production: enforce server-side UNIQUE(user_id, galaxy_id) constraint.

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
  /** Place a new star; enforces spatial collision + 1 star per galaxy rule */
  placestar(req: StarPlacementRequest): Promise<StarPlacementResult>;
  /** Resolve a single star by immutable ID */
  getStarById(id: string): Promise<StarRecord | null>;
  /** Get current user's star ID for a specific galaxy */
  getMyStarId(galaxyId?: string): string | null;
  /** Check if current user already placed a star in a galaxy */
  hasStarInGalaxy(galaxyId: string): boolean;
  /** Map of galaxyId -> starId for current user */
  getMyStarsMap(): Record<string, string>;
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
const MY_STARS_KEY = 'universe_my_stars_map';
const RATE_LIMIT_KEY = 'universe_last_place';
const RATE_LIMIT_MS = 1000 * 30; // 30s rate limit for test/demo usability

class DemoAdapter implements StarRepository {
  private grid = new SpatialGrid();
  private stars: StarRecord[] = [];
  private loaded = false;

  async loadStars(): Promise<StarRecord[]> {
    if (this.loaded) return this.stars;

    const demo = demoStarsAsRecords();

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

  getMyStarsMap(): Record<string, string> {
    try {
      const raw = localStorage.getItem(MY_STARS_KEY);
      if (raw) return JSON.parse(raw) as Record<string, string>;
    } catch {
      // Legacy fallback
      const old = localStorage.getItem('universe_my_star_id');
      if (old) return { G2025: old };
    }
    return {};
  }

  hasStarInGalaxy(galaxyId: string): boolean {
    const map = this.getMyStarsMap();
    return !!map[galaxyId];
  }

  getMyStarId(galaxyId?: string): string | null {
    const map = this.getMyStarsMap();
    if (galaxyId) return map[galaxyId] ?? null;
    // Return first placed star ID if no galaxy specified
    const ids = Object.values(map);
    return ids[0] ?? null;
  }

  async placestar(req: StarPlacementRequest): Promise<StarPlacementResult> {
    // Canonical One Star Per Galaxy Rule
    if (this.hasStarInGalaxy(req.galaxyId)) {
      return { success: false, error: 'already-placed-in-galaxy' };
    }

    // Rate limit check
    const last = localStorage.getItem(RATE_LIMIT_KEY);
    if (last && Date.now() - parseInt(last) < RATE_LIMIT_MS) {
      return { success: false, error: 'rate-limit' };
    }

    // Collision check
    if (this.grid.checkCollision(req.x, req.y, req.z, STAR_COLLISION_RADIUS)) {
      return { success: false, error: 'collision' };
    }

    // Bounds check within region
    const center = getRegionWorldCenter(req.galaxyId, req.regionId);
    const dx = req.x - center[0];
    const dz = req.z - center[2];
    const dist = Math.sqrt(dx * dx + dz * dz);
    if (dist > REGION_STAR_RADIUS || Math.abs(req.y - center[1]) > STAR_Y_RANGE) {
      return { success: false, error: 'collision' };
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

    // Save star record
    this.stars.push(star);
    this.grid.insert(star);

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const saved: StarRecord[] = raw ? JSON.parse(raw) : [];
      saved.push(star);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));

      // Save user star mapping for galaxy
      const myMap = this.getMyStarsMap();
      myMap[req.galaxyId] = star.id;
      localStorage.setItem(MY_STARS_KEY, JSON.stringify(myMap));
      localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
    } catch {
      // localStorage disabled / private browsing
    }

    store.setMyStarForGalaxy(req.galaxyId, star.id);
    return { success: true, star };
  }

  async getStarById(id: string): Promise<StarRecord | null> {
    await this.loadStars();
    return this.stars.find(s => s.id === id) ?? null;
  }
}

function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim().slice(0, 280);
}

export const starRepository: StarRepository = new DemoAdapter();
