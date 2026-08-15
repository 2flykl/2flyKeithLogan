// Universe Type Definitions
// Central type contracts for the entire 2Fly Universe system

export type CelestialKind =
  | 'sun' | 'planet' | 'moon' | 'satellite'
  | 'asteroid' | 'nebula' | 'supernova' | 'comet'
  | 'constellation' | 'star-cluster';

export type MediaKind = 'audio' | 'video' | 'playable' | 'archive';
export type ContentStatus = 'live' | 'awaiting-source' | 'discover-existing-project-route';

export interface GalaxyData {
  id: string;
  startYear: number;
  endYear: number;
  title: string;
  regions: RegionData[];
}

export interface RegionData {
  id: string;
  ordinal: number;
  title: string;
}

export interface CelestialObjectData {
  id: string;
  kind: CelestialKind;
  title: string;
  galaxyId: string;
  regionId: string;
  position: { x: number; y: number; z: number };
  visualTheme?: string;
  children?: ChildObjectData[];
  contentStatus?: ContentStatus;
  mediaKind?: MediaKind;
  mediaUrl?: string;
  posterUrl?: string;
  description?: string;
}

export interface ChildObjectData {
  id: string;
  kind: CelestialKind;
  title: string;
  mediaKind?: MediaKind;
  contentStatus?: ContentStatus;
  mediaUrl?: string;
  posterUrl?: string;
  description?: string;
}

export interface DemoStarData {
  id: string;
  demo: boolean;
  galaxyId: string;
  regionId: string;
  x: number;
  y: number;
  z: number;
  displayName: string;
  message: string;
}

export interface SeedUniverse {
  schemaVersion: string;
  galaxies: GalaxyData[];
  celestialObjects: CelestialObjectData[];
  demoStars: DemoStarData[];
}

// Runtime star (real visitor OR demo)
export interface StarRecord {
  id: string;
  galaxyId: string;
  regionId: string;
  x: number;
  y: number;
  z: number;
  displayName: string;
  starName?: string;
  message?: string;
  signatureDataUrl?: string;
  createdAt: string;
  isDemo?: boolean;
}

export interface StarPlacementRequest {
  galaxyId: string;
  regionId: string;
  x: number;
  y: number;
  z: number;
  displayName: string;
  starName?: string;
  message?: string;
  signatureDataUrl?: string;
}

export interface StarPlacementResult {
  success: boolean;
  star?: StarRecord;
  error?: 'collision' | 'already-placed' | 'rate-limit' | 'server-error';
}

// Spatial navigation state
export interface CameraSnapshot {
  position: [number, number, number];
  target: [number, number, number];
  zoom: number;
}

export type NavContext =
  | { level: 'universe' }
  | { level: 'galaxy'; galaxyId: string }
  | { level: 'region'; galaxyId: string; regionId: string }
  | { level: 'object'; objectId: string }
  | { level: 'star'; starId: string };

export interface UniverseRoute {
  type: 'universe' | 'galaxy' | 'object' | 'star';
  galaxyId?: string;
  objectId?: string;
  starId?: string;
}

// Galaxy visual identity
export interface GalaxyTheme {
  id: string;
  primaryColor: number;    // THREE hex
  accentColor: number;
  nebulaColor: number;
  dustColor: number;
  starTint: number;
  worldOffset: [number, number, number];
}

export const GALAXY_THEMES: Record<string, GalaxyTheme> = {
  G2000: {
    id: 'G2000',
    primaryColor: 0xc47d2a,
    accentColor: 0xe8a84a,
    nebulaColor: 0x7a3010,
    dustColor: 0x3d1a08,
    starTint: 0xffe0a0,
    worldOffset: [0, 0, 0],
  },
  G2005: {
    id: 'G2005',
    primaryColor: 0xc4602a,
    accentColor: 0xe07840,
    nebulaColor: 0x8a2040,
    dustColor: 0x3d1010,
    starTint: 0xffc080,
    worldOffset: [22000, 0, 0],
  },
  G2010: {
    id: 'G2010',
    primaryColor: 0x1ab8b8,
    accentColor: 0x40e0d0,
    nebulaColor: 0x0a4040,
    dustColor: 0x081820,
    starTint: 0xa0ffe0,
    worldOffset: [44000, 0, 0],
  },
  G2015: {
    id: 'G2015',
    primaryColor: 0x6040c0,
    accentColor: 0x9060e8,
    nebulaColor: 0x200850,
    dustColor: 0x100428,
    starTint: 0xd0a8ff,
    worldOffset: [66000, 0, 0],
  },
  G2020: {
    id: 'G2020',
    primaryColor: 0x2878c8,
    accentColor: 0x50a8f0,
    nebulaColor: 0x082040,
    dustColor: 0x04101e,
    starTint: 0xa8d8ff,
    worldOffset: [88000, 0, 0],
  },
  G2025: {
    id: 'G2025',
    primaryColor: 0x28a868,
    accentColor: 0x60d890,
    nebulaColor: 0x082818,
    dustColor: 0x04140c,
    starTint: 0xa0ffd0,
    worldOffset: [110000, 0, 0],
  },
};

// Region offsets within a galaxy (3 regions per galaxy, XZ plane)
export const REGION_OFFSETS: [number, number, number][] = [
  [-4000, 0, -2000],
  [0, 0, 3500],
  [4500, 0, -1500],
];

// Collision minimum distance (world units)
export const STAR_COLLISION_RADIUS = 180;
// Star placement bounds within a region (XZ)
export const REGION_STAR_RADIUS = 4500;
// Star Y scatter
export const STAR_Y_RANGE = 400;
