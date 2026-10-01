const fs=require('fs'),path=require('path');
const {applySeo}=require('./seo-metadata.cjs');
const root=path.resolve(__dirname,'..');
const output=path.resolve(process.argv[2]||path.join(root,'../../outputs/wix-pages'));
fs.mkdirSync(output,{recursive:true});
const base='https://2flykl.github.io/2flyKeithLogan/pages/';
let entrance=fs.readFileSync(path.join(root,'pages/awakening/index.html'),'utf8');
entrance=entrance.replace('<head>','<head><base href="'+base+'awakening/">');
entrance=entrance.replace(/<link rel="stylesheet" href="([^"]+)">/g,(_,file)=>'<style>'+fs.readFileSync(path.join(root,'pages/awakening',file),'utf8').replace('@media(max-width:760px),(max-height:500px)','@media(max-width:760px)')+'</style>');
entrance=entrance.replace('<script src="config.js"></script>',`<script>window.CHOICE_CONFIG={enterUrl:'https://www.2flykeithlogan.com/featured',exitUrl:'',returnToReferrer:false,introVideo:'',navigate:()=>{parent.WixPageNavigation.navigate('featured')},getReferrer:()=>''};</script>`);
entrance=entrance.replace('preload="auto"','preload="none"');
entrance=entrance.replace(/<script src="([^"]+)"><\/script>/g,(_,file)=>'<script>'+fs.readFileSync(path.join(root,'pages/awakening',file),'utf8').replace(/<\/script/gi,'<\\/script')+'</script>');
let html=fs.readFileSync(path.join(root,'pages/site-overhaul.html'),'utf8');
html=html.replace('<head>','<head>\n<base href="'+base+'">');
html=html.replace(/<link rel="stylesheet" href="([^\"]+)"\s*>/g,(_,url)=>'<style>\n'+fs.readFileSync(path.resolve(root,'pages',url.split('?')[0]),'utf8')+'\n</style>');
html=html.replace(/<script src="([^\"]+)"><\/script>/g,(_,url)=>{
 let js=fs.readFileSync(path.resolve(root,'pages',url.split('?')[0]),'utf8');
 if(url.includes('site-home-awakening.js'))js=js.replace("frame.src = 'awakening/index.html';",'frame.srcdoc = '+JSON.stringify(entrance)+';');
 js=js.replace(/,\s*location.href\)/g,', document.baseURI)');
 return '<script>\n'+js.replace(/<\/script/gi,'<\\/script')+'\n</script>';
});
const data=Object.fromEntries(['projects.json','playables-overhaul.json','site-messages.json'].map(f=>[f,JSON.parse(fs.readFileSync(path.join(root,'data',f),'utf8'))]));
const bridge=`<script>
(()=>{
// The Wix embed may be taller than the browser. Only dialogs use its visible
// intersection; scene dimensions never change in response to parent scrolling.
document.documentElement.classList.add('wix-embedded');
const probe=document.createElement('div');
probe.setAttribute('aria-hidden','true');
probe.style.cssText='position:fixed;inset:0;pointer-events:none;visibility:hidden';
document.body.append(probe);
const dialogViewport=new IntersectionObserver(entries=>{
 const bounds=entries[0].intersectionRect;
 if(bounds.width<1||bounds.height<1)return;
 const root=document.documentElement;
 root.style.setProperty('--wix-visible-height',bounds.height+'px');
 root.style.setProperty('--wix-visible-top',Math.max(0,bounds.y)+'px');
},{threshold:Array.from({length:101},(_,i)=>i/100)});
dialogViewport.observe(probe);
document.addEventListener('click',()=>{
 dialogViewport.unobserve(probe);dialogViewport.observe(probe);
});
const snapshot=${JSON.stringify(data).replace(/</g,'\\u003c')};
const nativeFetch=window.fetch.bind(window);
window.fetch=(input,options)=>{
const raw=typeof input==='string'?input:input.url;
const name=raw.split('?')[0].split('/').pop();
if(snapshot[name])return Promise.resolve(new Response(JSON.stringify(snapshot[name]),{headers:{'Content-Type':'application/json'}}));
return nativeFetch(input,options);
};
document.addEventListener('click',event=>{
const link=event.target.closest('a[href]');
if(!link)return;
const href=link.getAttribute('href');
if(link.hasAttribute('data-help2fly-checkout')){link.target='_blank';link.rel='noopener noreferrer';}
if(href.startsWith('#')){
event.preventDefault();
if(href==='#appView'){document.querySelector(href)?.focus();return;}
if(!link.hasAttribute('data-route'))location.hash=href;
}
});
})();
</script>`;
html=html.replace('<body>','<body>\n'+bridge);
html=html.replace('</head>',`<style>
html.wix-embedded .feedback-dialog,
html.wix-embedded .help2fly-modal {
 position:fixed;inset:auto;top:calc(var(--wix-visible-top,0px) + var(--wix-visible-height,100dvh)/2);
 left:50%;transform:translate(-50%,-50%);margin:0;
 max-height:calc(var(--wix-visible-height,100dvh) - 32px);
}
</style></head>`);
const navigation=fs.readFileSync(path.join(root,'js/site-wix-navigation.js'),'utf8');
const pages=[
 ['home','Home','/'],['featured','Featured','/featured'],['music','Music','/music'],
 ['videos','Videos','/videos'],['playables','Playables','/playables'],['flyzone','Flyzone','/flyzone'],
 ['support','Help 2Fly Create','/help-2fly-create'],['africa','I Woke Up in Africa','/i-woke-up-in-africa']
];
for(const [route,title,slug] of pages){
 let page=html;
 if(route==='africa'){
  page=fs.readFileSync(path.join(root,'pages/africa-cinema.html'),'utf8');
  page=page.replace('<head>','<head><base href="'+base+'">');
  page=page.replace(/<link rel="stylesheet" href="([^"]+)"\s*>/g,(_,url)=>'<style>'+fs.readFileSync(path.resolve(root,'pages',url.split('?')[0]),'utf8')+'</style>');
  page=page.replace(/<script src="([^"]+)"><\/script>/g,(_,url)=>'<script>'+fs.readFileSync(path.resolve(root,'pages',url.split('?')[0]),'utf8').replace(/,\s*location.href\)/g,', document.baseURI)').replace(/<\/script/gi,'<\\/script')+'</script>');
 }
 const setup='<script>window.WIX_PAGE='+JSON.stringify({route,slug})+';\n'+navigation+'</script>';
 page=page.replace(/<base[^>]+>/,match=>match+'\n'+setup);
 page=applySeo(page,route);
 fs.writeFileSync(path.join(output,route+'.html'),page);
 console.log(route+': '+Buffer.byteLength(page)+' bytes');
}
fs.writeFileSync(path.join(output,'pages.json'),JSON.stringify(pages.map(([route,title,slug])=>({route,title,slug})),null,2));
