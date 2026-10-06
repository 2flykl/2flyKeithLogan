#!/usr/bin/env node
'use strict';
const fs = require('node:fs');

// Patch a fresh Wix HTML export; never replace current content with an older bundle.
function restoreCinemaNav(html) {
  const navPattern = /<nav\b[^>]*id="primaryNav"[\s\S]*?<\/nav>/g;
  const menus = html.match(navPattern) || [];
  if (menus.length !== 1) throw new Error('Expected exactly one primaryNav');
  const nav = menus[0];
  if (/Drive In Cinema/.test(nav)) return html;
  const ride = /(<a\b[^>]*>Ride and Vibe<\/a>)/;
  if (!ride.test(nav)) throw new Error('Ride and Vibe anchor not found');
  return html.replace(nav, nav.replace(ride, '$1\n      <a href="https://www.2flykeithlogan.com/drive-in-cinema" target="_top">Drive In Cinema</a>'));
}

if (require.main === module) {
  const [input, output] = process.argv.slice(2);
  if (!input || !output || input === output) {
    throw new Error('Usage: node scripts/restore-wix-cinema-nav.cjs current-export.html repaired-export.html');
  }
  const original = fs.readFileSync(input, 'utf8');
  const repaired = restoreCinemaNav(original);
  fs.writeFileSync(output, repaired);
  console.log(repaired === original ? 'Cinema link already present.' : 'Cinema link restored after Ride and Vibe.');
}
module.exports = { restoreCinemaNav };
