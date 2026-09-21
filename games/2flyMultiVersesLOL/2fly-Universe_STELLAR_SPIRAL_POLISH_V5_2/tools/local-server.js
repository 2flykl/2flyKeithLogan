const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const port = Number(process.argv[2] || process.env.PORT || 8088);
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.css':'text/css; charset=utf-8','.mp3':'audio/mpeg','.wav':'audio/wav'};
http.createServer((req,res)=>{
  try {
    const u = new URL(req.url, `http://${req.headers.host}`);
    let rel = decodeURIComponent(u.pathname);
    if (rel === '/') rel = '/index.html';
    const file = path.resolve(root, '.' + rel);
    if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403); return res.end('Forbidden'); }
    fs.stat(file, (err, st)=>{
      if (err || !st.isFile()) { res.writeHead(404); return res.end('Not found'); }
      res.writeHead(200, {'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control':'no-store'});
      fs.createReadStream(file).pipe(res);
    });
  } catch (e) { res.writeHead(500); res.end(String(e)); }
}).listen(port, '127.0.0.1', ()=>console.log(`2Fly Universe full 3D restore running at http://127.0.0.1:${port}/`));
