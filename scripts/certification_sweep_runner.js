const fs = require('fs');
const path = require('path');
const http = require('http');

console.log("=== STARTING RELEASE CERTIFICATION SWEEP ===");

// 1. Check all critical routes and assets
const routes = [
    '/',
    '/index.html',
    '/css/app.css',
    '/js/app.js',
    '/data/projects.json',
    '/pages/experiences.html',
    '/pages/music.html',
    '/pages/videos.html',
    '/pages/help-me-create.html',
    '/games/index.html',
    '/games/ebony_eyes_game/index.html',
    '/games/ebony_eyes_game/app.js',
    '/games/ebony_eyes_game/style.css',
    '/games/ebony_eyes_game/assets/Ebony Eyes 5.mp3',
    '/games/TigerCall_StillStanding_PLX/index.html',
    '/games/TigerCall_StillStanding_PLX/src/game.js',
    '/games/TigerCall_StillStanding_PLX/styles.css',
    '/games/TigerCall_StillStanding_PLX/assets/video/tiger-call-still-standing.mp4',
    '/games/return-of-the-aviator/index.html',
    '/games/return-of-the-aviator/game-rev9.js',
    '/games/return-of-the-aviator/styles.css',
    '/games/africa/index.html',
    '/games/guns-and-butter/index.html',
    '/games/i-was-away/index.html',
    '/games/streams/index.html',
    '/games/thru-the-fire/index.html'
];

let checked = 0;
const results = [];

routes.forEach(r => {
    http.get(`http://localhost:8080${r}`, (res) => {
        results.push({ route: r, status: res.statusCode, ok: res.statusCode === 200 || res.statusCode === 206 });
        checked++;
        if (checked === routes.length) {
            console.log(`\nChecked ${routes.length} core HTTP routes/assets:`);
            console.log(JSON.stringify(results, null, 2));
            
            const failed = results.filter(x => !x.ok);
            if (failed.length > 0) {
                console.log(`\nWARNING: ${failed.length} routes failed:`);
                console.log(JSON.stringify(failed, null, 2));
            } else {
                console.log("\nALL CORE ROUTES & ASSETS RESOLVE CLEANLY (200 / 206 OK).");
            }
        }
    }).on('error', err => {
        results.push({ route: r, error: err.message, ok: false });
        checked++;
    });
});
