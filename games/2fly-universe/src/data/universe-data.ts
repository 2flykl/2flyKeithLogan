// Universe Data Loader — Phase II
// Loads and indexes seed_universe.json with non-linear 3D spatial lookups and AU calculations

import type { SeedUniverse, GalaxyData, RegionData, CelestialObjectData, DemoStarData, StarRecord } from '../types';
import { GALAXY_THEMES, REGION_OFFSETS, type GalaxyTheme } from '../types';

let _seed: SeedUniverse | null = null;

export async function loadUniverseData(): Promise<SeedUniverse> {
  if (_seed) return _seed;
  const base = import.meta.env.BASE_URL || '/games/2fly-universe/';
  const url = `${base}data/seed_universe.json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load seed data: ${res.status}`);
  const raw = await res.json() as Partial<SeedUniverse>;
  _seed = {
    schemaVersion: raw.schemaVersion ?? '1.0',
    galaxies: Array.isArray(raw.galaxies) ? raw.galaxies : [],
    celestialObjects: Array.isArray(raw.celestialObjects) ? raw.celestialObjects : [],
    demoStars: Array.isArray(raw.demoStars) ? raw.demoStars : [],
  };
  return _seed;
}

const _galaxyIndex: Map<string, GalaxyData> = new Map();
const _regionIndex: Map<string, RegionData & { galaxyId: string }> = new Map();
const _objectIndex: Map<string, CelestialObjectData> = new Map();

export function indexUniverseData(data: SeedUniverse) {
  for (const g of data.galaxies ?? []) {
    _galaxyIndex.set(g.id, g);
    for (const r of g.regions ?? []) _regionIndex.set(r.id, { ...r, galaxyId: g.id });
  }
  for (const obj of data.celestialObjects ?? []) {
    _objectIndex.set(obj.id, obj);
    for (const child of obj.children ?? []) {
      _objectIndex.set(child.id, {
        ...child,
        galaxyId: obj.galaxyId,
        regionId: obj.regionId,
        position: { ...obj.position },
      } as CelestialObjectData);
    }
  }
}

export function getGalaxy(id: string): GalaxyData | undefined { return _galaxyIndex.get(id); }
export function getAllGalaxies(): GalaxyData[] { return _seed?.galaxies ?? []; }
export function getRegion(id: string): (RegionData & { galaxyId: string }) | undefined { return _regionIndex.get(id); }
export function getGalaxyRegions(galaxyId: string): RegionData[] { return _galaxyIndex.get(galaxyId)?.regions ?? []; }
export function getObject(id: string): CelestialObjectData | undefined { return _objectIndex.get(id); }
export function getAllCelestialObjects(): CelestialObjectData[] { return _seed?.celestialObjects ?? []; }
export function getDemoStars(): DemoStarData[] { return Array.isArray(_seed?.demoStars) ? _seed!.demoStars : []; }

export function demoStarsAsRecords(): StarRecord[] {
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

export function getGalaxyWorldOffset(galaxyId: string): [number, number, number] {
  return GALAXY_THEMES[galaxyId]?.worldOffset ?? [0, 0, 0];
}
export function getRegionWorldCenter(galaxyId: string, regionId: string): [number, number, number] {
  const gOffset = getGalaxyWorldOffset(galaxyId);
  const regions = getGalaxyRegions(galaxyId);
  const idx = regions.findIndex(r => r.id === regionId);
  const rOff = REGION_OFFSETS[Math.max(0, idx)] ?? [0, 0, 0];
  return [gOffset[0] + rOff[0], gOffset[1] + rOff[1], gOffset[2] + rOff[2]];
}
export function getObjectWorldPosition(obj: CelestialObjectData): [number, number, number] {
  const gOffset = getGalaxyWorldOffset(obj.galaxyId);
  return [gOffset[0] + obj.position.x, gOffset[1] + obj.position.y, gOffset[2] + obj.position.z];
}
export function getGalaxyTheme(galaxyId: string): GalaxyTheme | undefined { return GALAXY_THEMES[galaxyId]; }
export function getGalaxyLabel(galaxyId: string): string {
  const g = _galaxyIndex.get(galaxyId);
  return g ? `${g.title} Galaxy` : galaxyId;
}
export function formatAU(distanceUnits: number): string {
  const au = Math.max(1, Math.round(distanceUnits * 0.085));
  return `${au} AU`;
}
