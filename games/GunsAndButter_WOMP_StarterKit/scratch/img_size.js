const fs = require('fs');
const path = require('path');

function getPngDimensions(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    if (buffer.toString('ascii', 1, 4) !== 'PNG') {
      return null;
    }
    const width = buffer.readInt32BE(16);
    const height = buffer.readInt32BE(20);
    return { width, height };
  } catch (err) {
    return null;
  }
}

const assetsDir = 'c:/Users/2flyk/Documents/GitHub/2flyKeithLogan/games/GunsAndButter_WOMP_StarterKit/assets';
const pngs = [];

function findPngs(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      findPngs(fullPath);
    } else if (file.endsWith('.png')) {
      pngs.push(fullPath);
    }
  }
}

findPngs(assetsDir);
pngs.forEach(p => {
  const dim = getPngDimensions(p);
  const rel = path.relative(assetsDir, p);
  console.log(`${rel}: ${dim ? `${dim.width}x${dim.height}` : 'invalid PNG'}`);
});
