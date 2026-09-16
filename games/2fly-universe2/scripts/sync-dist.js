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

// Keep source index.html pointing to /src/main.ts for Vite compilation.
console.log('[sync-dist] Assets and data synced successfully.');
