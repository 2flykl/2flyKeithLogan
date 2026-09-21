import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const SOFTWARE_FLAGS=['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--disable-gpu-compositing'];
export function findBrowser(){const candidates=[];for(const dir of [process.env.ProgramFiles,process.env['ProgramFiles(x86)'],process.env.LOCALAPPDATA].filter(Boolean)){candidates.push(path.join(dir,'Google','Chrome','Application','chrome.exe'),path.join(dir,'Microsoft','Edge','Application','msedge.exe'));}return candidates.find(p=>fs.existsSync(p));}
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.mp3':'audio/mpeg','.svg':'image/svg+xml'};
export function createServer(base=root){return http.createServer((req,res)=>{let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{return res.writeHead(400).end();}const file=path.resolve(base,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));if(!file.startsWith(base+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile())return res.writeHead(404).end('Not found');res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});fs.createReadStream(file).on('error',()=>res.destroy()).pipe(res);});}
async function main(){const safe=process.argv.includes('--gpu-safe'),verify=process.argv.includes('--verify');const logFile=path.join(root,'launcher.log');const log=text=>{console.log(text);try{fs.appendFileSync(logFile,new Date().toISOString()+' '+text+'\n');}catch{}};
 try{const browser=findBrowser();if(!browser)throw Error('Install Google Chrome or Microsoft Edge to launch this game.');const server=createServer();server.on('error',e=>{log('Server error: '+e.message);process.exitCode=1;});await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});const url=`http://127.0.0.1:${server.address().port}/${safe?'?gpu=safe':''}`;log(`I Was Away — ${safe?'GPU-safe software mode':'normal mode'}\n${url}\nKeep this window open while playing. Ctrl+C stops this server.`);
  if(verify){for(const file of ['index.html','src/main.js','assets/photographer/manifest.json','photo-reel.css']){const r=await fetch(new URL(file,url));if(!r.ok)throw Error('Missing launch file: '+file);}log('Launcher verified. Browser found: '+browser);server.close();return;}
  const profile=fs.mkdtempSync(path.join(os.tmpdir(),'iwa-browser-'));const args=[`--user-data-dir=${profile}`,'--no-first-run','--no-default-browser-check','--disable-background-mode',...(safe?SOFTWARE_FLAGS:[]),`--app=${url}`];const child=spawn(browser,args,{stdio:'ignore',windowsHide:true});child.on('error',e=>{log('Browser error: '+e.message);server.close();process.exitCode=1;});log('Opened a separate game browser window. Existing browser settings are unchanged.');
 }catch(e){log('Launch failed: '+e.message);process.exit(1);}}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main();
