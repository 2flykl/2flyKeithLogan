const http = require('http');

console.log("=== STARTING STRESS TEST OF TEST LAB LAUNCH PATHS ===");

const testLabGames = [
    { key: 'ebony_eyes', path: '/games/ebony_eyes_game/index.html' },
    { key: 'tigercall', path: '/games/TigerCall_StillStanding_PLX/index.html' },
    { key: 'aviator', path: '/games/return-of-the-aviator/index.html' },
    { key: 'i_was_away', path: '/games/i-was-away/index.html' },
    { key: 'streams', path: '/games/streams/index.html' },
    { key: 'africa', path: '/games/africa/index.html' }
];

let completed = 0;
const results = [];

function checkUrl(urlStr, key, originalPath) {
    http.get(urlStr, res => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            const redirectUrl = res.headers.location.startsWith('http') ? res.headers.location : `http://localhost:8080${res.headers.location}`;
            checkUrl(redirectUrl, key, originalPath);
            return;
        }
        results.push({ key, path: originalPath, finalUrl: urlStr, status: res.statusCode, ok: res.statusCode === 200 });
        completed++;
        if (completed === testLabGames.length) {
            console.log("\nTest Lab Manifest Routes Results:");
            console.log(JSON.stringify(results, null, 2));
            const failed = results.filter(r => !r.ok);
            if (failed.length > 0) {
                console.error(`FAIL: ${failed.length} Test Lab paths failed!`);
            } else {
                console.log("\nSUCCESS: All 6 Test Lab Manifest canonical builds respond with 200 OK!");
            }
        }
    }).on('error', err => {
        results.push({ key, path: originalPath, error: err.message, ok: false });
        completed++;
    });
}

testLabGames.forEach(g => {
    checkUrl(`http://localhost:8080${g.path}?autostart=1`, g.key, g.path);
});
