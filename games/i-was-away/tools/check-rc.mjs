import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const photographer=JSON.parse(fs.readFileSync(path.join(root,'assets/photographer/manifest.json')));
const library=JSON.parse(fs.readFileSync(path.join(root,'assets/photo-reel/library.json')));
const blockers=[];
if(photographer.animationCoverage?.length!==8)blockers.push('All eight photographer directions need reviewed animation sheets.');
if(photographer.requiredCorrections?.length)blockers.push(...photographer.requiredCorrections);
const pools=library.pools??library.phases;
const unique=new Set(Object.values(pools).flat().map(x=>x.src));
if(unique.size<9)blockers.push(`Nine distinct photographs required; ${unique.size} currently available. Editorial crops are not separate photographs.`);
for(const shots of Object.values(pools)){if(shots.length<3)blockers.push('Each phase must offer at least three photographs.');for(const shot of shots)if(!fs.existsSync(path.join(root,shot.src)))blockers.push('Missing media: '+shot.src);}
if(!['release-candidate','curated-user-library'].includes(library.status))blockers.push('Media library has not passed final art review.');
if(blockers.length){console.error('RC NOT READY\n'+blockers.map(s=>'• '+s).join('\n'));process.exitCode=1;}else console.log('RC asset completeness check passed. Run gameplay and browser QA before packaging.');
