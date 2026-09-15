// Hash-based router for the Universe
// Routes: #universe | #galaxy/G2000 | #object/OBJ-STREAMS | #star/STAR_ID
const _handlers = [];
let _current = { type: 'universe' };
function parseHash(hash) {
    const clean = hash.replace(/^#\/?/, '');
    if (!clean || clean === 'universe')
        return { type: 'universe' };
    const [seg0, seg1] = clean.split('/');
    if (seg0 === 'galaxy' && seg1)
        return { type: 'galaxy', galaxyId: seg1 };
    if (seg0 === 'object' && seg1)
        return { type: 'object', objectId: seg1 };
    if (seg0 === 'star' && seg1)
        return { type: 'star', starId: seg1 };
    return { type: 'universe' };
}
function dispatch(route) {
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
    on(handler) {
        _handlers.push(handler);
        // Immediately fire current route for new handler
        handler(_current);
    },
    navigate(route, pushState = true) {
        let hash = '';
        if (route.type === 'universe')
            hash = '#universe';
        else if (route.type === 'galaxy')
            hash = `#galaxy/${route.galaxyId}`;
        else if (route.type === 'object')
            hash = `#object/${route.objectId}`;
        else if (route.type === 'star')
            hash = `#star/${route.starId}`;
        if (pushState) {
            history.pushState(null, '', hash);
            dispatch(parseHash(hash));
        }
        else {
            history.replaceState(null, '', hash);
        }
    },
    back() {
        history.back();
    },
    current() {
        return _current;
    },
};
