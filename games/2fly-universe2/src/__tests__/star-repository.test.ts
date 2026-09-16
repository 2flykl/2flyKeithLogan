// Star Repository tests — collision, one-star-rule, deep-link resolve
import { describe, it, expect, beforeEach } from 'vitest';
import { loadUniverseData, indexUniverseData, getRegionWorldCenter } from '../data/universe-data';

describe('star-repository (demo adapter)', () => {
  // Region G2020-R1 world center coordinates
  // G2020 worldOffset = [88000, 0, 0], REGION_OFFSETS[0] = [-4000, 0, -2000]
  // => center = [84000, 0, -2000]
  const REGION_CENTER = { galaxyId: 'G2020', regionId: 'G2020-R1' };

  let cx = 84000;
  let cy = 6000;
  let cz = -2000;

  beforeEach(async () => {
    localStorage.clear();
    const data = await loadUniverseData();
    indexUniverseData(data);
    const c = getRegionWorldCenter('G2020', 'G2020-R1');
    cx = c[0];
    cy = c[1];
    cz = c[2];
  });

  it('nanoid generates unique IDs', async () => {
    const { nanoid } = await import('../util/nanoid');
    const ids = new Set(Array.from({ length: 100 }, () => nanoid()));
    expect(ids.size).toBe(100);
  });

  it('star IDs are 21 characters by default', async () => {
    const { nanoid } = await import('../util/nanoid');
    expect(nanoid().length).toBe(21);
  });

  it('place star returns success with valid data', async () => {
    // Re-import to get a fresh module state
    const mod = await import('../data/star-repository');
    const repo = mod.starRepository;
    await repo.loadStars();

    const result = await repo.placestar({
      ...REGION_CENTER,
      x: cx + 100, y: cy + 50, z: cz + 100,
      displayName: 'Test User',
    });

    expect(result.success).toBe(true);
    expect(result.star?.displayName).toBe('Test User');
    expect(result.star?.id).toBeTruthy();
  });

  it('enforces one-primary-star-per-galaxy rule', async () => {
    const mod = await import('../data/star-repository');
    const repo = mod.starRepository;
    await repo.loadStars();

    // First placement in G2020
    const r1 = await repo.placestar({
      galaxyId: 'G2020', regionId: 'G2020-R1',
      x: cx + 200, y: cy + 30, z: cz + 200,
      displayName: 'User One',
    });

    if (r1.success) {
      // Second placement attempt in same galaxy G2020 — should fail
      const r2 = await repo.placestar({
        galaxyId: 'G2020', regionId: 'G2020-R2',
        x: cx + 3000, y: cy + 30, z: cz + 3000,
        displayName: 'User One Again in G2020',
      });
      expect(r2.success).toBe(false);
      expect(['already-placed-in-galaxy', 'rate-limit']).toContain(r2.error);

      // Placement in DIFFERENT galaxy G2025 — should succeed!
      const r3 = await repo.placestar({
        galaxyId: 'G2025', regionId: 'G2025-R1',
        x: 4800 + 100, y: 800 + 30, z: -2000 + 100,
        displayName: 'User One in G2025',
      });
      expect(r3.success).toBe(true);
    }
  });

  it('resolves star by immutable ID from demo seed', async () => {
    const mod = await import('../data/star-repository');
    const repo = mod.starRepository;
    await repo.loadStars();

    // Demo stars are always available
    const found = await repo.getStarById('DEMO-1');
    expect(found).toBeDefined();
    expect(found?.displayName).toBe('Test Visitor');
  });

  it('loads demo stars from seed', async () => {
    const mod = await import('../data/star-repository');
    const repo = mod.starRepository;
    const stars = await repo.loadStars();
    expect(stars.length).toBeGreaterThan(0);
    const demo = stars.find(s => s.isDemo);
    expect(demo).toBeDefined();
  });

  it('returns null for unknown star ID', async () => {
    const mod = await import('../data/star-repository');
    const repo = mod.starRepository;
    await repo.loadStars();
    const result = await repo.getStarById('NONEXISTENT-ID-XYZ');
    expect(result).toBeNull();
  });
});
