// Test setup
import { vi } from 'vitest';

// Mock canvas
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  fillRect: vi.fn(),
  fillStyle: '',
  fillText: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  createRadialGradient: vi.fn(() => ({
    addColorStop: vi.fn(),
  })),
  measureText: vi.fn(() => ({ width: 100 })),
  strokeRect: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  globalAlpha: 1,
  shadowColor: '',
  shadowBlur: 0,
  strokeStyle: '',
  lineWidth: 1,
  textAlign: 'center' as CanvasTextAlign,
  letterSpacing: '',
  font: '',
})) as unknown as typeof HTMLCanvasElement.prototype.getContext;

// Mock localStorage
const storage: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem: (k: string) => storage[k] ?? null,
  setItem: (k: string, v: string) => { storage[k] = v; },
  removeItem: (k: string) => { delete storage[k]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); },
});

// Mock crypto.getRandomValues
vi.stubGlobal('crypto', {
  getRandomValues: (arr: Uint8Array) => {
    for (let i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
    return arr;
  },
});

// Mock fetch for seed data
vi.stubGlobal('fetch', vi.fn(async () => ({
  ok: true,
  json: async () => ({
    schemaVersion: '1.0',
    galaxies: [
      {
        id: 'G2020', startYear: 2020, endYear: 2024, title: '2020–2024',
        regions: [
          { id: 'G2020-R1', ordinal: 1, title: 'Region 1' },
          { id: 'G2020-R2', ordinal: 2, title: 'Region 2' },
          { id: 'G2020-R3', ordinal: 3, title: 'Region 3' },
        ],
      },
    ],
    celestialObjects: [],
    demoStars: [
      { id: 'DEMO-1', demo: true, galaxyId: 'G2020', regionId: 'G2020-R1',
        x: 1000, y: 0, z: 1000, displayName: 'Test Visitor', message: 'Demo' },
    ],
  }),
})));
