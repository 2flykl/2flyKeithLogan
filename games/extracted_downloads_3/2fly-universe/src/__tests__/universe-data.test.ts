// Universe Data tests
import { describe, it, expect, beforeEach } from 'vitest';
import { loadUniverseData, indexUniverseData, getGalaxy, getRegion, getAllGalaxies } from '../data/universe-data';

describe('universe-data', () => {
  beforeEach(async () => {
    await loadUniverseData();
    const data = await loadUniverseData();
    indexUniverseData(data);
  });

  it('loads seed data successfully', async () => {
    const data = await loadUniverseData();
    expect(data).toBeDefined();
    expect(data.schemaVersion).toBe('1.0');
  });

  it('returns all galaxies', async () => {
    const data = await loadUniverseData();
    indexUniverseData(data);
    const galaxies = getAllGalaxies();
    expect(galaxies.length).toBeGreaterThan(0);
  });

  it('looks up galaxy by id', async () => {
    const data = await loadUniverseData();
    indexUniverseData(data);
    const g = getGalaxy('G2020');
    expect(g).toBeDefined();
    expect(g?.id).toBe('G2020');
  });

  it('looks up region by id', async () => {
    const data = await loadUniverseData();
    indexUniverseData(data);
    const r = getRegion('G2020-R1');
    expect(r).toBeDefined();
    expect(r?.galaxyId).toBe('G2020');
  });
});
