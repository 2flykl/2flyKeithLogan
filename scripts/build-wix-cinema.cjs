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
const titleUnit='<span class="cinema-title-unit"><strong>2flyKeithLogan\'s Drive In Cinema</strong><small>A film experience by Keith Logan</small></span>';
const cinemaHeader='<header class="cinema-header" id="cinemaHeader"><a class="cinema-brand" href="https://www.2flykeithlogan.com/featured" target="_top" aria-label="Return to 2Fly Keith Logan"><strong>2FLY</strong><span>KEITH LOGAN<br>A FILM EXPERIENCE</span></a><div class="cinema-title-marquee" aria-label="2flyKeithLogan\'s Drive In Cinema"><div class="cinema-title-track" aria-hidden="true">'+titleUnit.repeat(4)+'</div></div></header>';
html=html.replace('<main id="appView" tabindex="-1"></main>',()=>cinemaHeader+'<main id="appView" tabindex="-1"><iframe id="cinemaScene" title="Drive In Cinema — movie screen and dashboard" allow="autoplay; fullscreen" allowfullscreen srcdoc="'+attr(scene)+'"></iframe></main>');
const addition=`<style>
#appView{min-height:0;padding:0}#cinemaScene{display:block;width:100%;height:var(--cinema-height,540px);border:0;background:#040a12}
body[data-route="cinema"] .site-shell{display:none}
.cinema-header{height:78px;display:grid;grid-template-columns:235px minmax(0,1fr);align-items:center;gap:28px;padding:0 3.1vw;background:linear-gradient(180deg,#080b08,#17160f);color:#eae5d7;border-bottom:1px solid #cdb17e29;overflow:hidden}
.cinema-brand{display:flex;align-items:center;gap:16px;color:inherit;text-decoration:none}.cinema-brand>strong{font:bold 27px Arial,sans-serif;letter-spacing:-2px}.cinema-brand>span{border-left:1px solid #cdb17e40;padding-left:16px;font:600 8px/1.6 Arial,sans-serif;letter-spacing:1.6px;color:#bcbab0}
.cinema-title-marquee{overflow:hidden;min-width:0;mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)}.cinema-title-track{display:flex;width:max-content;animation:cinema-procession 42s linear infinite}.cinema-title-unit{position:relative;flex:none;width:clamp(440px,42vw,700px);padding:0 40px;display:grid;place-items:center}.cinema-title-unit strong{font:400 clamp(25px,2.4vw,40px)/1.1 Georgia,serif;white-space:nowrap}.cinema-title-unit small{font:600 8px/1.7 Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;color:#99978d}.cinema-title-unit:after{content:'✦';position:absolute;right:0;color:#a28b57;font-size:10px}
@keyframes cinema-procession{to{transform:translateX(-50%)}}
@media(max-width:700px){.cinema-header{height:64px;grid-template-columns:70px minmax(0,1fr);gap:8px;padding:0 16px}.cinema-brand>span{display:none}.cinema-brand>strong{font-size:25px}.cinema-title-unit{width:410px;padding:0 24px}.cinema-title-unit strong{font-size:25px}.cinema-title-unit small{font-size:7px;letter-spacing:1.3px}}
@media(prefers-reduced-motion:reduce){.cinema-title-track{animation:none}}
</style><script>
// The shared bootstrap keeps the music player, routing, feedback and footer.
// Cinema owns its own scene and must not be replaced by a Featured renderer.
route=function(){app.route='cinema';document.body.dataset.route='cinema';document.title='Drive In Cinema | 2Fly Keith Logan';};
bindShell=function(){document.getElementById('menuToggle').addEventListener('click',()=>{const nav=document.getElementById('primaryNav');const open=nav.classList.toggle('open');document.getElementById('menuToggle').setAttribute('aria-expanded',String(open));});};
route();
(()=>{const header=document.getElementById('cinemaHeader');let visibleHeight=Math.min(innerHeight,screen.availHeight);
function fit(){document.documentElement.style.setProperty('--cinema-height',Math.max(320,visibleHeight-header.getBoundingClientRect().height)+'px');}
// Cross-frame intersection reports the area actually visible in Wix's parent viewport.
// Ignore scroll clipping so scrolling down never collapses the Cinema scene.
const observer=new IntersectionObserver(entries=>{const e=entries[0];if(e.boundingClientRect.top>=-1&&e.intersectionRect.top<=1&&e.intersectionRect.height>350){visibleHeight=e.intersectionRect.height;fit();}},{threshold:Array.from({length:201},(_,i)=>i/200)});
observer.observe(document.body);new ResizeObserver(fit).observe(header);window.addEventListener('resize',fit);fit();})();
</script>`;
html=html.replace(/<\/body>\s*<\/html>\s*$/,()=>addition+'</body></html>');
fs.mkdirSync(path.dirname(path.resolve(process.argv[3])),{recursive:true});
fs.writeFileSync(process.argv[3],html);
console.log('Wix Cinema bundle: '+Buffer.byteLength(html)+' bytes');
