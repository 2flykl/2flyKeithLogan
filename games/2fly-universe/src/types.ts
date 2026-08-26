// Universe Type Definitions — Phase II Correction & Living Galaxy Pass

export type CelestialKind =
  | 'sun' | 'planet' | 'moon' | 'satellite'
  | 'asteroid' | 'nebula' | 'supernova' | 'comet'
  | 'constellation' | 'star-cluster';

export type MediaKind = 'audio' | 'video' | 'playable' | 'archive';
export type ContentStatus = 'live' | 'awaiting-source' | 'discover-existing-project-route' | 'uncharted';

export interface GalaxyData {
  id: string;
  startYear: number;
  endYear: number;
  title: string;
  status?: 'known' | 'showcase' | 'uncharted';
  regions: RegionData[];
}

export interface RegionData {
  id: string;
  ordinal: number;
  title: string;
  subtitle?: string;
  theme?: string;
}

export interface CelestialObjectData {
  id: string;
  kind: CelestialKind;
  title: string;
  subtitle?: string;
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
  gallery?: { image: string; label: string; caption: string }[];
  clips?: { title: string; src: string; poster: string; type: string }[];
  accentColor?: string;
}

export interface ChildObjectData {
  id: string;
  kind: CelestialKind;
  title: string;
  subtitle?: string;
  mediaKind?: MediaKind;
  contentStatus?: ContentStatus;
  mediaUrl?: string;
  posterUrl?: string;
  description?: string;
  clips?: { title: string; src: string; poster: string; type: string }[];
}

export interface DemoStarData {
  id: string;
  demo: boolean;
  galaxyId: string;
  regionId: string;
  clusterId?: string;
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

export interface StarRecord {
  id: string;
  galaxyId: string;
  regionId: string;
  clusterId?: string;
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
  error?: 'collision' | 'already-placed-in-galaxy' | 'rate-limit' | 'server-error';
}

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

export interface GalaxyTheme {
  id: string;
  title: string;
  primaryColor: number;    // THREE hex
  accentColor: number;
  nebulaColor: number;
  dustColor: number;
  starTint: number;
  worldOffset: [number, number, number]; // Based on spatial_layout.json scaled x4
  scale: number;
  texturePath: string;
  status?: 'showcase' | 'known' | 'uncharted';
}

// ── Non-Linear 3D Cosmology Layout (From docs/spatial_layout.json scaled x4) ─────
export const GALAXY_THEMES: Record<string, GalaxyTheme> = {
  G2025: {
    id: 'G2025',
    title: '2025–2029 · THE PLAYABLE FRONTIER',
    primaryColor: 0x30d890,
    accentColor: 0x60ffd0,
    nebulaColor: 0x083820,
    dustColor: 0x041c10,
    starTint: 0xa0ffd8,
    worldOffset: [0, 0, 0],
    scale: 1.3,
    texturePath: 'assets/galaxies/galaxy_2025_2029.png',
    status: 'showcase',
  },
  G2020: {
    id: 'G2020',
    title: '2020–2024 · THE AWAKENING ERA',
    primaryColor: 0x2878c8,
    accentColor: 0x50a8f0,
    nebulaColor: 0x082040,
    dustColor: 0x04101e,
    starTint: 0xa8d8ff,
    worldOffset: [36736, 15680, 9408],
    scale: 1.0,
    texturePath: 'assets/galaxies/galaxy_2020_2024.png',
    status: 'known',
  },
  G2015: {
    id: 'G2015',
    title: '2015–2019 · THE EXPANSION ERA',
    primaryColor: 0x6040c0,
    accentColor: 0x9060e8,
    nebulaColor: 0x200850,
    dustColor: 0x100428,
    starTint: 0xd0a8ff,
    worldOffset: [32256, -13440, -12544],
    scale: 0.95,
    texturePath: 'assets/galaxies/galaxy_2015_2019.png',
    status: 'known',
  },
  G2010: {
    id: 'G2010',
    title: '2010–2014 · THE REINVENTION ERA',
    primaryColor: 0x1ab8b8,
    accentColor: 0x40e0d0,
    nebulaColor: 0x0a4040,
    dustColor: 0x081820,
    starTint: 0xa0ffe0,
    worldOffset: [-5376, 23296, -34048],
    scale: 0.9,
    texturePath: 'assets/galaxies/galaxy_2010_2014.png',
    status: 'known',
  },
  G2005: {
    id: 'G2005',
    title: '2005–2009 · THE MOMENTUM ERA',
    primaryColor: 0xc4602a,
    accentColor: 0xe07840,
    nebulaColor: 0x8a2040,
    dustColor: 0x3d1010,
    starTint: 0xffc080,
    worldOffset: [-29120, -14784, 8064],
    scale: 0.85,
    texturePath: 'assets/galaxies/galaxy_2005_2009.png',
    status: 'known',
  },
  G2000: {
    id: 'G2000',
    title: '2000–2004 · THE FOUNDATION ERA',
    primaryColor: 0xc47d2a,
    accentColor: 0xe8a84a,
    nebulaColor: 0x7a3010,
    dustColor: 0x3d1a08,
    starTint: 0xffe0a0,
    worldOffset: [-40320, 10752, -22400],
    scale: 0.8,
    texturePath: 'assets/galaxies/galaxy_2000_2004.png',
    status: 'known',
  },
  G2030: {
    id: 'G2030',
    title: '2030–2034 · THE UNCHARTED ERA',
    primaryColor: 0x405070,
    accentColor: 0x607090,
    nebulaColor: 0x101828,
    dustColor: 0x080c14,
    starTint: 0x80a0c0,
    worldOffset: [8064, -27776, -40320],
    scale: 0.75,
    texturePath: 'assets/galaxies/galaxy_2030_2034.png',
    status: 'uncharted',
  },
};

// Default Home Camera Position for Universe Overview
export const UNIVERSE_HOME_CAMERA: CameraSnapshot = {
  position: [-1800, 42000, 90000],
  target: [-1800, -2200, -15500],
  zoom: 114000,
};

// Region offsets within a galaxy
export const REGION_OFFSETS: [number, number, number][] = [
  [-4500, 0, -2500],
  [0, 0, 4000],
  [5000, 0, -2000],
];

export const STAR_COLLISION_RADIUS = 180;
export const REGION_STAR_RADIUS = 4500;
export const STAR_Y_RANGE = 400;
