import fs from 'fs';
import path from 'path';
import ts from 'typescript';
const root = path.resolve('.');
const files = ['types.ts','camera.ts','scene/galaxy.ts','universe-shell.ts'];
function fixImports(js){
  return js.replace(/(from\s+['"])(\.\.?\/[^'"]+?)(['"])/g,(m,a,spec,b)=>{
    if (/\.(js|json|css|png|jpg|svg)$/.test(spec)) return m;
    return a+spec+'.js'+b;
  }).replace(/(import\s*\(\s*['"])(\.\.?\/[^'"]+?)(['"]\s*\))/g,(m,a,spec,b)=>{
    if (/\.(js|json|css|png|jpg|svg)$/.test(spec)) return m;
    return a+spec+'.js'+b;
  });
}
for (const rel of files){
  const srcPath=path.join(root,'src',rel);
  const outPath=path.join(root,'app',rel.replace(/\.ts$/,'.js'));
  const source=fs.readFileSync(srcPath,'utf8');
  const result=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,useDefineForClassFields:true}});
  fs.mkdirSync(path.dirname(outPath),{recursive:true});
  fs.writeFileSync(outPath,fixImports(result.outputText));
  console.log('transpiled',rel,'->',path.relative(root,outPath));
}
