/**
 * prepare-mobile.js
 * Builds the mobile-web/ bundle for Capacitor from the secured public/ assets.
 */
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', '..', 'public');
const DEST_DIR = path.join(__dirname, '..', 'mobile-web');

const ITEMS = [
  'index.html',
  'order-success.html',
  'manifest.webmanifest',
  'sw.js',
  'css',
  'js',
  'icons'
];

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

console.log('🔄 Syncing public assets to mobile-web/...');
fs.rmSync(DEST_DIR, { recursive: true, force: true });
fs.mkdirSync(DEST_DIR, { recursive: true });

for (const item of ITEMS) {
  const src = path.join(PUBLIC_DIR, item);
  if (fs.existsSync(src)) {
    copyRecursive(src, path.join(DEST_DIR, item));
  } else {
    console.warn('⚠️ Asset not found:', item);
  }
}

console.log('✅ mobile-web/ bundle successfully created and secured!');
