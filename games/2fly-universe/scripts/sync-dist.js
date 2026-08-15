import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const dist = path.resolve(root, 'dist');

// Copy dist/assets to root assets
const distAssets = path.join(dist, 'assets');
const targetAssets = path.join(root, 'assets');
if (fs.existsSync(distAssets)) {
  fs.cpSync(distAssets, targetAssets, { recursive: true });
  console.log('[sync-dist] Copied dist/assets -> assets');
}

// Copy dist/data to root data
const distData = path.join(dist, 'data');
const targetData = path.join(root, 'data');
if (fs.existsSync(distData)) {
  fs.cpSync(distData, targetData, { recursive: true });
  console.log('[sync-dist] Copied dist/data -> data');
}

// Copy dist/index.html to root index.html
const distIndex = path.join(dist, 'index.html');
const targetIndex = path.join(root, 'index.html');
if (fs.existsSync(distIndex)) {
  fs.copyFileSync(distIndex, targetIndex);
  console.log('[sync-dist] Copied dist/index.html -> index.html');
}
