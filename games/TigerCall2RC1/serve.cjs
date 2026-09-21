const http=require('http'),fs=require('fs'),path=require('path');
const root=__dirname;
http.createServer((req,res)=>{
 let file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
 if(!file.startsWith(path.resolve(root)+path.sep)&&file!==path.resolve(root)){res.writeHead(403).end();return;}
 try{if(fs.statSync(file).isDirectory())file=path.join(file,'index.html');const stat=fs.statSync(file);
 const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.mp4':'video/mp4','.json':'application/json'}[path.extname(file)]||'application/octet-stream';
 const range=req.headers.range?.match(/bytes=(\d+)-(\d*)/);const start=range?Number(range[1]):0,end=range&&range[2]?Number(range[2]):stat.size-1;
 const headers={'Content-Type':mime,'Accept-Ranges':'bytes','Content-Length':end-start+1,'Cache-Control':'no-store'};
 if(range)headers['Content-Range']=`bytes ${start}-${end}/${stat.size}`;
 res.writeHead(range?206:200,headers);fs.createReadStream(file,{start,end}).pipe(res);
 }catch{res.writeHead(404).end();}
}).listen(8772,'127.0.0.1',()=>console.log('Open http://127.0.0.1:8772 — Ctrl+C to stop.'));
