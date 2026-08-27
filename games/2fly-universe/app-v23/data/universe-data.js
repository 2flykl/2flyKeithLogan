// Universe Data Loader — Phase II
// Loads and indexes seed_universe.json with non-linear 3D spatial lookups and AU calculations
import { GALAXY_THEMES, REGION_OFFSETS } from '../types.js';
let _seed = null;
export async function loadUniverseData() {
    if (_seed) return _seed;
    const url = new URL('../../data/seed_universe.json', import.meta.url);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to load seed data: ${res.status}`);
    const raw = await res.json();
    // Schema-safe normalization: older seeds may omit demoStars entirely.
    _seed = {
        ...raw,
        galaxies: Array.isArray(raw?.galaxies) ? raw.galaxies : [],
        celestialObjects: Array.isArray(raw?.celestialObjects) ? raw.celestialObjects : [],
        demoStars: Array.isArray(raw?.demoStars) ? raw.demoStars : [],
    };
    return _seed;
}
const _galaxyIndex = new Map();
const _regionIndex = new Map();
const _objectIndex = new Map();
export function indexUniverseData(data) {
    for (const g of (data?.galaxies ?? [])) {
        _galaxyIndex.set(g.id, g);
        for (const r of (g.regions ?? [])) _regionIndex.set(r.id, { ...r, galaxyId: g.id });
    }
    for (const obj of (data?.celestialObjects ?? [])) {
        _objectIndex.set(obj.id, obj);
        for (const child of (obj.children ?? [])) {
            _objectIndex.set(child.id, {
                ...child,
                galaxyId: obj.galaxyId,
                regionId: obj.regionId,
                position: { ...(obj.position ?? { x: 0, y: 0, z: 0 }) },
            });
        }
    }
}
export function getGalaxy(id) { return _galaxyIndex.get(id); }
export function getRegion(id) { return _regionIndex.get(id); }
export function getCelestialObject(id) { return _objectIndex.get(id); }
export function getAllGalaxies() { return Array.from(_galaxyIndex.values()); }
export function getAllCelestialObjects() { return Array.from(_objectIndex.values()).filter(o => o.galaxyId); }
export function getGalaxyRegions(galaxyId) { return Array.from(_regionIndex.values()).filter(r => r.galaxyId === galaxyId); }
export function getGalaxyWorldOffset(galaxyId) { return GALAXY_THEMES[galaxyId]?.worldOffset ?? [0, 0, 0]; }
export function getRegionWorldCenter(galaxyId, regionId) {
    const galaxy = getGalaxy(galaxyId);
    const regionIndex = galaxy?.regions?.findIndex(r => r.id === regionId) ?? 0;
    const [gx, gy, gz] = getGalaxyWorldOffset(galaxyId);
    const offset = REGION_OFFSETS[Math.max(0, regionIndex)] ?? [0, 0, 0];
    return [gx + offset[0], gy + offset[1], gz + offset[2]];
}
export function getObjectWorldPosition(obj) {
    const [gx, gy, gz] = getGalaxyWorldOffset(obj?.galaxyId);
    const p = obj?.position ?? { x: 0, y: 0, z: 0 };
    return [gx + p.x, gy + p.y, gz + p.z];
}
export function formatAU(distance) {
    if (distance < 1000) return `${Math.round(distance)} AU`;
    if (distance < 10000) return `${(distance / 1000).toFixed(1)}k AU`;
    return `${Math.round(distance / 1000)}k AU`;
}
export function demoStarsAsRecords(data) {
    const stars = Array.isArray(data?.demoStars) ? data.demoStars : [];
    return stars.map(s => ({
        id: s.id,
        galaxyId: s.galaxyId,
        regionId: s.regionId,
        clusterId: s.clusterId,
        x: s.x,
        y: s.y,
        z: s.z,
        displayName: s.displayName,
        message: s.message,
        createdAt: new Date().toISOString(),
        isDemo: true,
    }));
}
export function getGalaxyLabel(galaxyId) { return GALAXY_THEMES[galaxyId]?.title ?? galaxyId; }
