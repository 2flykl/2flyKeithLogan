const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const findings = [];

function checkFileExists(relPath, sourceFile) {
    if (!relPath || relPath.startsWith('http://') || relPath.startsWith('https://') || relPath.startsWith('data:') || relPath.startsWith('#') || relPath.startsWith('javascript:')) {
        return;
    }
    // strip query/hash
    let cleanPath = relPath.split('?')[0].split('#')[0];
    let resolvedPath;
    if (cleanPath.startsWith('/')) {
        resolvedPath = path.join(rootDir, cleanPath);
    } else {
        resolvedPath = path.resolve(path.dirname(sourceFile), cleanPath);
    }

    if (!fs.existsSync(resolvedPath)) {
        findings.push({
            type: 'MISSING_ASSET',
            sourceFile: path.relative(rootDir, sourceFile),
            assetPath: relPath,
            resolvedPath: path.relative(rootDir, resolvedPath)
        });
    }
}

function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Find src="..." and href="..." and url(...)
    const srcRegex = /(?:src|href|data-src)=["']([^"']+)["']/g;
    let match;
    while ((match = srcRegex.exec(content)) !== null) {
        checkFileExists(match[1], filePath);
    }

    const urlRegex = /url\(["']?([^"')]+)["']?\)/g;
    while ((match = urlRegex.exec(content)) !== null) {
        checkFileExists(match[1], filePath);
    }
}

function getAllFiles(dir, exts = ['.html', '.css', '.js']) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        if (file === '.git' || file === 'node_modules') return;
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllFiles(fullPath, exts));
        } else {
            if (exts.includes(path.extname(fullPath))) {
                results.push(fullPath);
            }
        }
    });
    return results;
}

const files = getAllFiles(rootDir);
console.log(`Scanning ${files.length} files for asset references...`);
files.forEach(f => scanFile(f));

console.log(`\nFound ${findings.length} missing asset references:`);
console.log(JSON.stringify(findings, null, 2));

const scratchDir = path.join(rootDir, 'scripts');
fs.writeFileSync(path.join(scratchDir, 'asset_audit_results.json'), JSON.stringify(findings, null, 2));
