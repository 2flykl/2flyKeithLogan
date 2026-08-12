const fs = require('fs');
const path = require('path');

const gamesDir = path.resolve(__dirname, '../games');
const absolutePathFindings = [];

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relFile = path.relative(gamesDir, filePath);

    // Look for leading slash attributes like src="/..." or href="/..."
    const regex = /(?:src|href|url)\(["']?\/(?!\/)([^"'#?\s)]+)["']?\)/gi;
    let match;
    while ((match = regex.exec(content)) !== null) {
        // Exclude root domain links if intentional, but flag asset links
        if (match[1].startsWith('assets/') || match[1].startsWith('css/') || match[1].startsWith('js/')) {
            absolutePathFindings.push({
                file: relFile,
                match: match[0],
                target: match[1]
            });
        }
    }
}

function walk(dir) {
    fs.readdirSync(dir).forEach(f => {
        const full = path.join(dir, f);
        if (fs.statSync(full).isDirectory()) {
            if (f !== '.git' && f !== 'node_modules') walk(full);
        } else if (/\.(html|js|css)$/i.test(f)) {
            checkFile(full);
        }
    });
}

walk(gamesDir);
console.log(`Found ${absolutePathFindings.length} leading-slash asset references in games/:\n`);
console.log(JSON.stringify(absolutePathFindings, null, 2));
