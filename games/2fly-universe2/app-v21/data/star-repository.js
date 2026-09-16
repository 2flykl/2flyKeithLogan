// Star Repository — Phase II One-Star-Per-Galaxy Canonical Rule & Demo Adapter
// Production: enforce server-side UNIQUE(user_id, galaxy_id) constraint.
import { STAR_COLLISION_RADIUS, REGION_STAR_RADIUS, STAR_Y_RANGE } from '../types.js';
import { demoStarsAsRecords, getRegionWorldCenter } from './universe-data.js';
import { store } from '../state/universe-store.js';
import { nanoid } from '../util/nanoid.js';
// ── Spatial Grid for collision detection ────────────────────────────────────
const GRID_CELL = 500;
class SpatialGrid {
    cells = new Map();
    key(x, y, z) {
        return `${Math.floor(x / GRID_CELL)},${Math.floor(y / GRID_CELL)},${Math.floor(z / GRID_CELL)}`;
    }
    insert(star) {
        const k = this.key(star.x, star.y, star.z);
        if (!this.cells.has(k))
            this.cells.set(k, []);
        this.cells.get(k).push(star);
    }
    checkCollision(x, y, z, radius) {
        const cx = Math.floor(x / GRID_CELL);
        const cy = Math.floor(y / GRID_CELL);
        const cz = Math.floor(z / GRID_CELL);
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                for (let dz = -1; dz <= 1; dz++) {
                    const k = `${cx + dx},${cy + dy},${cz + dz}`;
                    const stars = this.cells.get(k);
                    if (!stars)
                        continue;
                    for (const s of stars) {
                        const dist = Math.sqrt((s.x - x) ** 2 + (s.y - y) ** 2 + (s.z - z) ** 2);
                        if (dist < radius)
                            return true;
                    }
                }
            }
        }
        return false;
    }
    rebuild(stars) {
        this.cells.clear();
        for (const s of stars)
            this.insert(s);
    }
}
function safeStorageGet(key) { try { return window.localStorage?.getItem(key) ?? null; } catch { return null; } }
function safeStorageSet(key, value) { try { window.localStorage?.setItem(key, value); return true; } catch { return false; } }
// ── Demo / localStorage Adapter ──────────────────────────────────────────────
const STORAGE_KEY = 'universe_stars';
const MY_STARS_KEY = 'universe_my_stars_map';
const RATE_LIMIT_KEY = 'universe_last_place';
const RATE_LIMIT_MS = 1000 * 30; // 30s rate limit for test/demo usability
class DemoAdapter {
    grid = new SpatialGrid();
    stars = [];
    loaded = false;
    async loadStars() {
        if (this.loaded)
            return this.stars;
        const demo = demoStarsAsRecords();
        let saved = [];
        try {
            const raw = safeStorageGet(STORAGE_KEY);
            if (raw)
                saved = JSON.parse(raw);
        }
        catch {
            saved = [];
        }
        this.stars = [...demo, ...saved];
        this.grid.rebuild(this.stars);
        this.loaded = true;
        return this.stars;
    }
    getMyStarsMap() {
        try {
            const raw = safeStorageGet(MY_STARS_KEY);
            if (raw)
                return JSON.parse(raw);
        }
        catch {
            // Legacy fallback
            const old = safeStorageGet('universe_my_star_id');
            if (old)
                return { G2025: old };
        }
        return {};
    }
    hasStarInGalaxy(galaxyId) {
        const map = this.getMyStarsMap();
        return !!map[galaxyId];
    }
    getMyStarId(galaxyId) {
        const map = this.getMyStarsMap();
        if (galaxyId)
            return map[galaxyId] ?? null;
        // Return first placed star ID if no galaxy specified
        const ids = Object.values(map);
        return ids[0] ?? null;
    }
    async placestar(req) {
        // Canonical One Star Per Galaxy Rule
        if (this.hasStarInGalaxy(req.galaxyId)) {
            return { success: false, error: 'already-placed-in-galaxy' };
        }
        // Rate limit check
        const last = safeStorageGet(RATE_LIMIT_KEY);
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
        const star = {
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
            const raw = safeStorageGet(STORAGE_KEY);
            const saved = raw ? JSON.parse(raw) : [];
            saved.push(star);
            safeStorageSet(STORAGE_KEY, JSON.stringify(saved));
            // Save user star mapping for galaxy
            const myMap = this.getMyStarsMap();
            myMap[req.galaxyId] = star.id;
            safeStorageSet(MY_STARS_KEY, JSON.stringify(myMap));
            safeStorageSet(RATE_LIMIT_KEY, String(Date.now()));
        }
        catch {
            // localStorage disabled / private browsing
        }
        store.setMyStarForGalaxy(req.galaxyId, star.id);
        return { success: true, star };
    }
    async getStarById(id) {
        await this.loadStars();
        return this.stars.find(s => s.id === id) ?? null;
    }
}
function sanitize(str) {
    return str.replace(/<[^>]*>/g, '').trim().slice(0, 280);
}
export const starRepository = new DemoAdapter();
