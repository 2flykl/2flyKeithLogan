const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const root = path.resolve(__dirname, '..');
const srcRoot = path.join(root, 'src');
const outRoot = path.join(root, 'app');
fs.rmSync(outRoot, { recursive: true, force: true });

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(ent => {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === '__tests__') return [];
      return walk(full);
    }
    return ent.name.endsWith('.ts') && !ent.name.endsWith('.d.ts') ? [full] : [];
  });
}

function addJsExtensions(code) {
  return code.replace(/(from\s+["'])(\.\.?\/[^"']+)(["'])/g, (m, a, spec, q) => {
    if (/\.(js|json|css|png|jpg|jpeg|webp|svg)$/.test(spec)) return m;
    return a + spec + '.js' + q;
  }).replace(/(import\s*\(\s*["'])(\.\.?\/[^"']+)(["']\s*\))/g, (m, a, spec, q) => {
    if (/\.(js|json|css|png|jpg|jpeg|webp|svg)$/.test(spec)) return m;
    return a + spec + '.js' + q;
  });
}

for (const file of walk(srcRoot)) {
  const rel = path.relative(srcRoot, file).replace(/\\/g, '/');
  const out = path.join(outRoot, rel.replace(/\.ts$/, '.js'));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const source = fs.readFileSync(file, 'utf8');
  const result = ts.transpileModule(source, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ES2022,
      sourceMap: false,
      removeComments: false,
      useDefineForClassFields: true,
    },
    fileName: file,
  });
  fs.writeFileSync(out, addJsExtensions(result.outputText));
}

fs.copyFileSync(path.join(root, 'node_modules', 'three', 'build', 'three.module.js'), path.join(root, 'assets', 'three.module.js'));
console.log('Browser ESM app generated at', outRoot);
