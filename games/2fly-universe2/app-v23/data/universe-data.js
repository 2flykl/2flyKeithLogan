// Universe Data Loader — Phase II
// Loads and indexes seed_universe.json with non-linear 3D spatial lookups and AU calculations
import { GALAXY_THEMES, REGION_OFFSETS } from '../types.js';
let _seed = null;
export async function loadUniverseData() {
    if (_seed)
        return _seed;
    const url = new URL('../../data/seed_universe.json', import.meta.url).href;
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
        isDemo: true,
    }));
}
export function getGalaxyWorldOffset(galaxyId) {
    const theme = GALAXY_THEMES[galaxyId];
    return theme?.worldOffset ?? [0, 0, 0];
}
export function getRegionWorldCenter(galaxyId, regionId) {
    const gOffset = getGalaxyWorldOffset(galaxyId);
    const regions = getGalaxyRegions(galaxyId);
    const idx = regions.findIndex(r => r.id === regionId);
    const rOff = REGION_OFFSETS[Math.max(0, idx)];
    return [
        gOffset[0] + rOff[0],
        gOffset[1] + rOff[1],
        gOffset[2] + rOff[2],
    ];
}
export function getObjectWorldPosition(obj) {
    const gOffset = getGalaxyWorldOffset(obj.galaxyId);
    return [
        gOffset[0] + obj.position.x,
        gOffset[1] + obj.position.y,
        gOffset[2] + obj.position.z,
    ];
}
export function getGalaxyTheme(galaxyId) {
    return GALAXY_THEMES[galaxyId];
}
export function getGalaxyLabel(galaxyId) {
    const g = _galaxyIndex.get(galaxyId);
    return g ? `${g.title} Galaxy` : galaxyId;
}
// Convert world distance units to interface AU (Astronomical Units)
export function formatAU(distanceUnits) {
    const au = Math.max(1, Math.round(distanceUnits * 0.085));
    return `${au} AU`;
}
