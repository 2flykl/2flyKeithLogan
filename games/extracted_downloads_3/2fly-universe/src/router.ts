// Hash-based router for the Universe
// Routes: #universe | #galaxy/G2000 | #object/OBJ-STREAMS | #star/STAR_ID

import type { UniverseRoute } from './types';

type RouteHandler = (route: UniverseRoute) => void;

const _handlers: RouteHandler[] = [];
let _current: UniverseRoute = { type: 'universe' };

function parseHash(hash: string): UniverseRoute {
  const clean = hash.replace(/^#\/?/, '');
  if (!clean || clean === 'universe') return { type: 'universe' };

  const [seg0, seg1] = clean.split('/');
  if (seg0 === 'galaxy' && seg1) return { type: 'galaxy', galaxyId: seg1 };
  if (seg0 === 'object' && seg1) return { type: 'object', objectId: seg1 };
  if (seg0 === 'star' && seg1) return { type: 'star', starId: seg1 };
  return { type: 'universe' };
}

function dispatch(route: UniverseRoute) {
  _current = route;
  _handlers.forEach(h => h(route));
}

export const router = {
  init() {
    window.addEventListener('hashchange', () => {
      dispatch(parseHash(window.location.hash));
    });
    dispatch(parseHash(window.location.hash));
  },

  on(handler: RouteHandler) {
    _handlers.push(handler);
    // Immediately fire current route for new handler
    handler(_current);
  },

  navigate(route: UniverseRoute, pushState = true) {
    let hash = '';
    if (route.type === 'universe') hash = '#universe';
    else if (route.type === 'galaxy') hash = `#galaxy/${route.galaxyId}`;
    else if (route.type === 'object') hash = `#object/${route.objectId}`;
    else if (route.type === 'star') hash = `#star/${route.starId}`;

    if (pushState) {
      history.pushState(null, '', hash);
      dispatch(parseHash(hash));
    } else {
      history.replaceState(null, '', hash);
    }
  },

  back() {
    history.back();
  },

  current(): UniverseRoute {
    return _current;
  },
};
