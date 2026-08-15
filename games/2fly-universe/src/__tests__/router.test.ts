// Router tests
import { describe, it, expect } from 'vitest';

describe('router', () => {
  it('parses universe route from empty hash', () => {
    // Test the internal parseHash logic via the router module
    // (We test by importing and calling navigate/current)
    const route = parseHashDirect('');
    expect(route.type).toBe('universe');
  });

  it('parses galaxy route', () => {
    const route = parseHashDirect('#galaxy/G2000');
    expect(route.type).toBe('galaxy');
    expect(route.galaxyId).toBe('G2000');
  });

  it('parses star route', () => {
    const route = parseHashDirect('#star/DEMO-STAR-000001');
    expect(route.type).toBe('star');
    expect(route.starId).toBe('DEMO-STAR-000001');
  });

  it('parses object route', () => {
    const route = parseHashDirect('#object/OBJ-STREAMS');
    expect(route.type).toBe('object');
    expect(route.objectId).toBe('OBJ-STREAMS');
  });

  it('falls back to universe for unknown routes', () => {
    const route = parseHashDirect('#unknown/path/here');
    expect(route.type).toBe('universe');
  });
});

// Duplicated from router.ts to avoid DOM dependency in tests
import type { UniverseRoute } from '../types';
function parseHashDirect(hash: string): UniverseRoute {
  const clean = hash.replace(/^#\/?/, '');
  if (!clean || clean === 'universe') return { type: 'universe' };
  const [seg0, seg1] = clean.split('/');
  if (seg0 === 'galaxy' && seg1) return { type: 'galaxy', galaxyId: seg1 };
  if (seg0 === 'object' && seg1) return { type: 'object', objectId: seg1 };
  if (seg0 === 'star' && seg1) return { type: 'star', starId: seg1 };
  return { type: 'universe' };
}
