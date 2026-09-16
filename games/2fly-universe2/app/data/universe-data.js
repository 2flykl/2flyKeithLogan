// Universe Data Loader — GitHub Pages-safe native ES module loader
// Loads and indexes seed_universe.json with non-linear 3D spatial lookups and AU calculations
import { GALAXY_THEMES, REGION_OFFSETS } from '../types.js';
let _seed = null;
export async function loadUniverseData() {
    if (_seed)
        return _seed;
    // This runtime is served directly by GitHub Pages, not transformed by Vite.
    // Resolve the seed file relative to this module so subpath hosting and direct
    // launches both work without relying on import.meta.env.
    const url = new URL('../../data/seed_universe.json', import.meta.url);
    const res = await fetch(url);
    if (!res.ok)
        throw new Error(`Failed to load seed data: ${res.status}`);
    _seed = (await res.json());
    return _seed;
}
// Indexed lookups
const _galaxyIndex = new Map();
const _regionIndex = new Map();
const _objectIndex = new Map();
export function indexUniverseData(data) {
    for (const g of data.galaxies) {
        _galaxyIndex.set(g.id, g);
        for (const r of g.regions) {
            _regionIndex.set(r.id, { ...r, galaxyId: g.id });
        }
    }
    for (const obj of data.celestialObjects) {
        _objectIndex.set(obj.id, obj);
        if (obj.children) {
            for (const child of obj.children) {
                _objectIndex.set(child.id, {
                    ...child,
                    galaxyId: obj.galaxyId,
                    regionId: obj.regionId,
                    position: { ...obj.position },
                });
            }
        }
    }
}
export function getGalaxy(id) {
    return _galaxyIndex.get(id);
}
export function getAllGalaxies() {
    if (_seed)
        return _seed.galaxies;
    return [];
}
export function getRegion(id) {
    return _regionIndex.get(id);
}
export function getGalaxyRegions(galaxyId) {
    const g = _galaxyIndex.get(galaxyId);
    return g?.regions ?? [];
}
export function getObject(id) {
    return _objectIndex.get(id);
}
export function getAllCelestialObjects() {
    if (_seed)
        return _seed.celestialObjects;
    return [];
}
export function getDemoStars() {
    if (_seed)
        return _seed.demoStars;
    return [];
}
export function demoStarsAsRecords() {
    return getDemoStars().map(d => ({
        id: d.id,
        galaxyId: d.galaxyId,
        regionId: d.regionId,
        clusterId: d.clusterId,
        x: d.x,
        y: d.y,
        z: d.z,
        displayName: d.displayName,
        message: d.message,
        createdAt: '2025-01-01T00:00:00Z',
        starType: 'standard',
    }));
}
export function getGalaxyWorldOffset(galaxyId) {
    return GALAXY_THEMES[galaxyId]?.worldOffset ?? [0, 0, 0];
}
export function getRegionWorldCenter(galaxyId, regionId) {
    const [gx, gy, gz] = getGalaxyWorldOffset(galaxyId);
    const [rx, ry, rz] = REGION_OFFSETS[regionId] ?? [0, 0, 0];
    return [gx + rx, gy + ry, gz + rz];
}
export function getObjectWorldPosition(obj) {
    const [gx, gy, gz] = getGalaxyWorldOffset(obj.galaxyId);
    return [gx + obj.position.x, gy + obj.position.y, gz + obj.position.z];
}
export function worldDistanceToAU(units) {
    return Math.round(units / 100);
}
export function formatAU(units) {
    const au = worldDistanceToAU(units);
    return `${au.toLocaleString()} AU`;
}
export function getGalaxyLabel(galaxyId) {
    const g = getGalaxy(galaxyId);
    return g ? `${g.yearStart}–${g.yearEnd} · ${g.title}` : galaxyId;
}
export function getRegionLabel(regionId) {
    const r = getRegion(regionId);
    return r?.title ?? regionId;
}
