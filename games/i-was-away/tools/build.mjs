import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');const output=path.join(root,'dist');fs.rmSync(output,{recursive:true,force:true});fs.mkdirSync(output,{recursive:true});
for(const name of ['index.html','style.css','photo-reel.css','session.css','meter.css','src','vendor','assets'])fs.cpSync(path.join(root,name),path.join(output,name),{recursive:true,filter:p=>{const rel=path.relative(root,p).split(path.sep).join('/');return !/(^|\/)(proof|masters|references|session-references|source-atlases|qa)(\/|$)/.test(rel)&&!rel.endsWith('-review.jpg')&&!(rel.startsWith('assets/characters/')&&rel.endsWith('.png'));}});
const controls=path.resolve(root,'../../js/playable-controls.js');
if(fs.existsSync(controls)){fs.copyFileSync(controls,path.join(output,'playable-controls.js'));const html=path.join(output,'index.html');fs.writeFileSync(html,fs.readFileSync(html,'utf8').replace('../../js/playable-controls.js','./playable-controls.js'));}
console.log('Built dist/. Serve it with any static web server. No install, CDN, API key or internet connection is required.');

