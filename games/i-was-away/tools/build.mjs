import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');const output=path.join(root,'dist');fs.mkdirSync(output,{recursive:true});
for(const name of ['index.html','style.css','photo-reel.css','src','vendor','assets'])fs.cpSync(path.join(root,name),path.join(output,name),{recursive:true,filter:p=>{const rel=path.relative(root,p).split(path.sep).join('/');return !/(^|\/)(proof|masters|references|session-references)(\/|$)/.test(rel)&&!rel.endsWith('-review.jpg')&&!(rel.startsWith('assets/characters/')&&rel.endsWith('.png'));}});
console.log('Built dist/. Serve it with any static web server. No install, CDN, API key or internet connection is required.');

