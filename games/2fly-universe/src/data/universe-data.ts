// Universe Data Loader
// Loads and indexes seed_universe.json for fast lookups

import type { SeedUniverse, GalaxyData, RegionData, CelestialObjectData, DemoStarData, StarRecord } from '../types';
import { GALAXY_THEMES, REGION_OFFSETS, type GalaxyTheme } from '../types';

let _seed: SeedUniverse | null = null;

export async function loadUniverseData(): Promise<SeedUniverse> {
  if (_seed) return _seed;
  const base = import.meta.env.BASE_URL || '/games/2fly-universe/';
  const url = `${base}data/seed_universe.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load seed data: ${res.status}`);
  _seed = (await res.json()) as SeedUniverse;
  return _seed;
}

// Indexed lookups
const _galaxyIndex: Map<string, GalaxyData> = new Map();
const _regionIndex: Map<string, RegionData & { galaxyId: string }> = new Map();
const _objectIndex: Map<string, CelestialObjectData> = new Map();

export function indexUniverseData(data: SeedUniverse) {
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
        // Promote children to top-level for lookup with parent context
        _objectIndex.set(child.id, {
          ...child,
          galaxyId: obj.galaxyId,
          regionId: obj.regionId,
          position: { ...obj.position }, // children inherit parent position basis
        } as CelestialObjectData);
      }
    }
  }
}

export function getGalaxy(id: string): GalaxyData | undefined {
  return _galaxyIndex.get(id);
}

export function getAllGalaxies(): GalaxyData[] {
  if (_seed) return _seed.galaxies;
  return [];
}

export function getRegion(id: string): (RegionData & { galaxyId: string }) | undefined {
  return _regionIndex.get(id);
}

export function getGalaxyRegions(galaxyId: string): RegionData[] {
  const g = _galaxyIndex.get(galaxyId);
  return g?.regions ?? [];
}

export function getObject(id: string): CelestialObjectData | undefined {
  return _objectIndex.get(id);
}

export function getAllCelestialObjects(): CelestialObjectData[] {
  if (_seed) return _seed.celestialObjects;
  return [];
}

export function getDemoStars(): DemoStarData[] {
  if (_seed) return _seed.demoStars;
  return [];
}

// Convert demo stars to StarRecord format
export function demoStarsAsRecords(): StarRecord[] {
  return getDemoStars().map(d => ({
    id: d.id,
    galaxyId: d.galaxyId,
    regionId: d.regionId,
    x: d.x,
    y: d.y,
    z: d.z,
    displayName: d.displayName,
    message: d.message,
    createdAt: '2024-01-01T00:00:00Z',
    isDemo: true,
  }));
}

// Get world-space position of a galaxy origin
export function getGalaxyWorldOffset(galaxyId: string): [number, number, number] {
  const theme = GALAXY_THEMES[galaxyId];
  return theme?.worldOffset ?? [0, 0, 0];
}

// Get world-space position of a region center
export function getRegionWorldCenter(galaxyId: string, regionId: string): [number, number, number] {
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

// Get theme for a galaxy
export function getGalaxyTheme(galaxyId: string): GalaxyTheme | undefined {
  return GALAXY_THEMES[galaxyId];
}

// Get year label for a galaxy
export function getGalaxyLabel(galaxyId: string): string {
  const g = _galaxyIndex.get(galaxyId);
  return g?.title ?? galaxyId;
}
