// Reuse an exported published site shell; inline the independent Cinema scene.
// Usage: node scripts/build-wix-cinema.cjs <shared-shell.html> <output.html>
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const shell=fs.readFileSync(process.argv[2],'utf8');
let scene=read('pages/drive-in.html');
scene=scene.replace('<head>','<head><base href="https://2flykl.github.io/2flyKeithLogan/pages/">');
scene=scene.replace(/<link rel="stylesheet" href="..\/css\/drive-in.css[^\"]*">/,()=>'<style>'+read('css/drive-in.css')+'\n'+read('css/drive-in-shell-fit.css')+'</style>');
scene=scene.replace(/<script src="..\/js\/([^\"?]+)[^\"]*"><\/script>/g,(_,file)=>'<script>'+read('js/'+file).replace(/<\/script/gi,'<\\/script')+'</script>');
scene=scene.replace('href="site-overhaul.html#home"','href="https://www.2flykeithlogan.com/featured" target="_top"');
const attr=s=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
let html=shell.replace('"route":"featured","slug":"/featured"','"route":"cinema","slug":"/drive-in-cinema"');
html=html.replace("africa:'/i-woke-up-in-africa'","africa:'/i-woke-up-in-africa',cinema:'/drive-in-cinema'");
html=html.replace("'support','africa']);","'support','africa','cinema']);");
html=html.replace('<a href="../ride/index.html?from=site">Ride and Vibe</a>', '<a href="../ride/index.html?from=site">Ride and Vibe</a><a href="https://www.2flykeithlogan.com/drive-in-cinema" target="_top" aria-current="page">Drive In Cinema</a>');
html=html.replace('<main id="appView" tabindex="-1"></main>',()=>'<main id="appView" tabindex="-1"><iframe id="cinemaScene" title="Drive In Cinema — movie screen and dashboard" allow="autoplay; fullscreen" allowfullscreen srcdoc="'+attr(scene)+'"></iframe></main>');
const addition=`<style>
#appView{min-height:0;padding:0}#cinemaScene{display:block;width:100%;height:var(--cinema-height,540px);border:0;background:#040a12}
body[data-route="cinema"] .site-shell{position:relative;top:auto}body[data-route="cinema"] .primary-nav a[aria-current]{color:#f5bd75}
@media(max-width:700px){body[data-route="cinema"] .global-player{grid-template-columns:minmax(0,1fr) auto;gap:8px;padding:8px 10px}body[data-route="cinema"] .now-playing{min-width:0;width:auto}body[data-route="cinema"] .transport{gap:4px}body[data-route="cinema"] .transport>button{width:34px;min-width:34px;height:36px}}
</style><script>
// The shared bootstrap keeps the music player, routing, feedback and footer.
// Cinema owns its own scene and must not be replaced by a Featured renderer.
route=function(){app.route='cinema';document.body.dataset.route='cinema';document.title='Drive In Cinema | 2Fly Keith Logan';};
bindShell=function(){document.getElementById('menuToggle').addEventListener('click',()=>{const nav=document.getElementById('primaryNav');const open=nav.classList.toggle('open');document.getElementById('menuToggle').setAttribute('aria-expanded',String(open));});};
route();
(()=>{const shell=document.getElementById('siteShell');
function fit(){const mobile=innerWidth<=700;const budget=mobile?Math.min(innerHeight,screen.availHeight-80):Math.min(innerHeight,innerWidth*.5625,820,screen.availHeight-180);const room=Math.max(mobile?400:280,budget-shell.getBoundingClientRect().height);document.documentElement.style.setProperty('--cinema-height',room+'px');}
new ResizeObserver(fit).observe(shell);window.addEventListener('resize',fit);document.addEventListener('DOMContentLoaded',fit);fit();})();
</script>`;
html=html.replace(/<\/body>\s*<\/html>\s*$/,()=>addition+'</body></html>');
fs.mkdirSync(path.dirname(path.resolve(process.argv[3])),{recursive:true});
fs.writeFileSync(process.argv[3],html);
console.log('Wix Cinema bundle: '+Buffer.byteLength(html)+' bytes');
