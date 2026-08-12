const f = require('./asset_audit_results.json');
const realMissing = f.filter(x => !x.assetPath.includes('${') && !x.assetPath.includes('about:blank') && !x.assetPath.includes('...'));
console.log(`Total real static missing assets: ${realMissing.length}`);
console.log(JSON.stringify(realMissing, null, 2));
