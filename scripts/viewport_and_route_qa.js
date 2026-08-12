const http = require('http');

// Helper script to evaluate website DOM metrics and defects via fetch/HTTP
console.log("Checking HTTP routes...");
const routes = [
    '/',
    '/index.html',
    '/pages/index.html',
    '/pages/experiences.html',
    '/pages/music.html',
    '/pages/videos.html',
    '/pages/help-me-create.html',
    '/pages/test-lab.html', // test if exists
    '/games/index.html',
    '/games/ebony_eyes_game/index.html',
    '/games/TigerCall_StillStanding_PLX/index.html',
    '/games/return-of-the-aviator/index.html',
    '/games/africa/index.html',
    '/games/guns-and-butter/index.html',
    '/games/i-was-away/index.html',
    '/games/streams/index.html',
    '/games/thru-the-fire/index.html'
];

routes.forEach(route => {
    http.get(`http://localhost:8080${route}`, (res) => {
        console.log(`Route: ${route} -> Status: ${res.statusCode}`);
    }).on('error', (err) => {
        console.error(`Route: ${route} -> ERROR: ${err.message}`);
    });
});
