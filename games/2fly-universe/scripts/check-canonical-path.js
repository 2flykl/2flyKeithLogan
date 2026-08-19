import fs from 'fs';
import path from 'path';

const CANONICAL = '2fly-universe';
const cwd = process.cwd();
const current = path.basename(cwd);
const parent = path.dirname(cwd);
const problems = [];

if (current !== CANONICAL) {
  problems.push(`Project folder must be exactly "${CANONICAL}"; found "${current}".`);
}

try {
  const siblings = fs.readdirSync(parent, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);
  const variants = siblings.filter(name => name.toLowerCase() === CANONICAL && name !== CANONICAL);
  if (variants.length) {
    problems.push(`Remove case-variant duplicate folder(s): ${variants.join(', ')}`);
  }
} catch (error) {
  problems.push(`Could not inspect parent directory: ${error.message}`);
}

if (problems.length) {
  console.error('\n[2Fly Universe path check FAILED]');
  for (const problem of problems) console.error(`- ${problem}`);
  console.error(`\nCanonical repository path: games/${CANONICAL}/\n`);
  process.exit(1);
}

console.log(`[2Fly Universe path check PASS] games/${CANONICAL}/`);
