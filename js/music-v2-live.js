/* 2FLY live Music V3 — physical CD archive, current catalog first, cinematic stereo + binder. */
(() => {
  'use strict';

  const legacy = [
    {title:'Aye I Wish You The Merriest Christmas',year:'ARCHIVE',cover:'assets/music-archive/aye-i-wish-you-the-merriest-christmas.jpg',desc:'A holiday-era 2FLY project returning to the official physical-media archive.',legacy:true},
    {title:'Flyzone',year:'ARCHIVE',cover:'assets/music-archive/flyzone.jpg',desc:'A bold early project returned to the binder with its original artwork preserved.',legacy:true},
    {title:'Bad Boy Laroy',year:'ARCHIVE',cover:'assets/music-archive/bbl.jpg',desc:'An early 2FLY release preserved in its original visual identity and presented as part of the official discography.',legacy:true},
    {title:'Better Late Than Never',year:'2007',cover:'assets/music-archive/better-late-than-never.jpg',desc:'An older project returning to the catalog with the original artwork kept at the center of the presentation.',legacy:true},
    {title:'The Youngstown Pride',year:'ARCHIVE',cover:'assets/music-archive/the-youngstown-pride.jpg',desc:'A hometown-centered release from the earlier catalog, preserved as part of the 2FLY discography.',legacy:true},
    {title:'Ohydro',year:'ARCHIVE',cover:'assets/music-archive/ohydro.jpg',desc:'A legacy release brought forward as part of the complete 2FLY physical-media archive.',legacy:true},
    {title:'Please Believe It!',year:'ARCHIVE',cover:'assets/music-archive/please-believe-it.jpg',desc:'A legacy release returning to the catalog with its original visual identity intact.',legacy:true},
    {title:'My City Crazy',year:'ARCHIVE',cover:'assets/music-archive/my-city-crazy.jpg',desc:'A city-focused archive release presented as artwork above an authentic handwritten CD-R.',legacy:true,sharpie:true},
    {title:'Ghetto Gumbo',year:'ARCHIVE',cover:'assets/music-archive/ghetto-gumbo.jpg',desc:'A classic We Famous Entertainment-era project preserved as original artwork with a handwritten archive CD-R below.',legacy:true,sharpie:true}
  ];

  const currentSpecs = [
    {title:'Streams',match:['streams'],fallbackHue:203},
    {title:'Thru the Fire',match:['thru the fire','through the fire'],fallbackHue:17},
    {title:'I Was Away',match:['i was away','away'],fallbackHue:31},
    {title:'Guns & Butter',match:['guns & butter','guns and butter'],fallbackHue:42},
    {title:"Gettin' It",match:["gettin' it",'getting it','gettin it'],fallbackHue:278}
  ];

  const q = s => document.querySelector(s);
  const qa = s => [...document.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const asset = p => typeof resolveAssetUrl === 'function' ? resolveAssetUrl(p) : p;
  const norm = s => String(s || '').toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,' ').trim();
  const svgCover = (title,hue=210) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><defs><radialGradient id="g"><stop stop-color="hsl(${hue} 72% 47%)"/><stop offset=".55" stop-color="hsl(${hue} 58% 19%)"/><stop offset="1" stop-color="#070809"/></radialGradient><filter id="n"><feTurbulence baseFrequency=".7" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 .18 0"/></filter></defs><rect width="800" height="800" fill="url(#g)"/><rect width="800" height="800" filter="url(#n)" opacity=".25"/><circle cx="400" cy="320" r="220" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="7"/><text x="55" y="565" fill="white" font-family="Arial" font-size="68" font-weight="900">${title.replace(/&/g,'&amp;')}</text><text x="58" y="625" fill="rgba(255,255,255,.72)" font-family="Arial" font-size="24" letter-spacing="12">2FLY KEITH LOGAN</text></svg>`)}`;

  let catalog = [];
  let index = 0;
  let page = 0;
  const perPage = 4;

  function findProject(spec){
    if(typeof state === 'undefined' || !Array.isArray(state.projects)) return null;
    const matches = spec.match.map(norm);
    return state.projects.find(project => {
      const values=[project.title,project.id,project.subtitle].map(norm);
      return matches.some(m => values.some(v => v===m || v.includes(m) || m.includes(v)));
    }) || null;
  }

  function currentCatalog(){
    return currentSpecs.map(spec => {
      const p=findProject(spec);
      const tracks=p?.tracks?.length ? p.tracks : (p?.audio ? [{title:p.title,src:p.audio}] : []);
      return {
        title:p?.title || spec.title,
        year:p?.year || p?.releaseYear || 'CURRENT',
        cover:p?.cover || svgCover(spec.title,spec.fallbackHue),
        desc:p?.description || p?.subtitle || 'Current 2FLY material from the active catalog.',
        current:true,
        project:p,
        tracks,
        audio:p?.audio || tracks[0]?.src || tracks[0]?.audio || ''
      };
    });
  }

  function rebuildCatalog(){ catalog=[...currentCatalog(),...legacy]; }

  const css = `
  #view-music .page-hero,#view-music .music-catalog>.section-head{display:none!important}
  #view-music{background:#080705!important;overflow:hidden}
  .music-v3-live{--led:#178fff;--led2:#69d5ff;--gold:#e1ad31;--wood:#4e260f;min-height:calc(100vh - 70px);color:#f4efe7;padding:0 0 12px;background:
    radial-gradient(ellipse at 50% 2%,#76522b55 0,#24120700 42%),
    radial-gradient(circle at 17% 27%,#f0a64a28 0 5%,transparent 18%),
    radial-gradient(circle at 82% 19%,#e8a34a20 0 6%,transparent 19%),
    linear-gradient(180deg,#110d0a 0,#120b07 39%,#3b1b0b 40%,#5a2a0e 100%);position:relative}
  .music-v3-live:before{content:"";position:absolute;left:0;right:0;top:38%;bottom:0;pointer-events:none;background:
    repeating-linear-gradient(91deg,transparent 0 17px,#1607021c 18px,#e69b3a0d 19px,transparent 23px 70px),
    repeating-linear-gradient(3deg,#0000 0 20px,#0e050320 21px,#a85e1a12 22px,#0000 25px 47px);mix-blend-mode:overlay;opacity:.9}
  .music-v3-live:after{content:"";position:absolute;left:0;right:0;top:38%;height:32%;pointer-events:none;background:radial-gradient(ellipse at 50% 0,#1699ff22,transparent 55%);filter:blur(7px)}
  .m3-layout{position:relative;z-index:1;max-width:1820px;margin:auto;display:grid;grid-template-columns:150px minmax(720px,1fr) 330px;gap:10px;align-items:start}
  .m3-copy{padding:25px 0 0 12px;text-shadow:0 5px 20px #000}.m3-copy h1{font:1000 clamp(42px,4vw,68px)/.8 Arial;margin:0;letter-spacing:-.07em}.m3-copy p{font:900 17px/1.13 Arial;letter-spacing:.08em;margin:15px 0}.m3-copy em{display:block;margin-top:28px;color:#ffd44f;font:700 26px/1 "Comic Sans MS",cursive;transform:rotate(-5deg);filter:drop-shadow(0 2px 7px #000)}
  .m3-center{min-width:0;position:relative}.m3-stereo-stage{height:450px;display:grid;grid-template-columns:228px minmax(430px,570px) 228px;gap:0;align-items:end;justify-content:center;position:relative;perspective:1100px}
  .m3-stereo-stage:after{content:"";position:absolute;z-index:-1;left:6%;right:6%;bottom:0;height:90px;background:radial-gradient(ellipse,#1698ff2b,transparent 66%);filter:blur(13px)}
  .m3-speaker{height:420px;position:relative;background:
    linear-gradient(115deg,#514a43 0 3%,#1b1a19 4% 8%,#090a0b 9% 90%,#2d2926 91% 96%,#0a0909 97%),
    repeating-linear-gradient(0deg,#111 0 2px,#171717 2px 3px);border:1px solid #625a51;box-shadow:0 25px 35px #000b,inset 0 0 0 2px #ffffff0b,inset 12px 0 25px #ffffff09,inset -14px 0 30px #000;display:flex;flex-direction:column;align-items:center;justify-content:space-around;padding:22px 19px 20px;clip-path:polygon(10% 0,90% 0,100% 5%,100% 95%,91% 100%,9% 100%,0 95%,0 5%)}
  .m3-speaker.left{transform:translateX(-20px) rotateY(4deg);transform-origin:right center}.m3-speaker.right{transform:translateX(20px) rotateY(-4deg);transform-origin:left center}.m3-speaker:before{content:"";position:absolute;inset:12px;border:1px solid #34312e;clip-path:inherit;box-shadow:inset 0 0 34px #000}.m3-speaker:after{content:"2FLY";position:absolute;bottom:13px;color:#91877e;font:900 16px Arial;letter-spacing:.1em;text-shadow:0 1px #fff2}
  .m3-driver{display:block;border-radius:50%;position:relative;background:radial-gradient(circle at 45% 40%,#41464a 0 5%,#070707 7% 24%,#1d1d1d 25% 32%,#050505 34% 54%,#2b2926 55% 65%,#080808 66% 80%,#24211f 81%);border:2px solid #242424;box-shadow:0 0 0 4px #080808,0 0 0 7px #168fff,0 0 13px 8px #168fffbb,0 0 34px 11px #168fff55,inset 0 -13px 19px #000,inset 0 7px 9px #ffffff0c;z-index:1}.m3-driver:before{content:"";position:absolute;inset:8%;border-radius:50%;background:radial-gradient(circle at 42% 38%,#ffffff1a,transparent 20% 50%,#0008 75%)}.m3-driver:after{content:"";position:absolute;inset:-9px;border-radius:50%;border:1px solid #79d8ff;box-shadow:0 0 10px var(--led),0 0 25px #1c9dff88}.m3-t{width:56px;height:56px}.m3-m{width:100px;height:100px}.m3-s{width:180px;height:180px}
  .m3-deck{height:370px;position:relative;padding:20px 24px 15px;background:
    repeating-linear-gradient(90deg,#ffffff08 0 1px,#0000 1px 3px),
    linear-gradient(100deg,#5d554f,#a29a94 7%,#655c56 13%,#a99f97 25%,#625954 34%,#9a918b 48%,#5d544f 60%,#a69b93 75%,#5a504a 89%,#8f867f);border:1px solid #5c554f;box-shadow:0 27px 46px #000c,inset 0 0 0 2px #ffffff16,inset 0 14px 20px #fff1;border-radius:3px;transform:translateZ(28px)}
  .m3-deck:before{content:"2FLY";position:absolute;top:9px;left:0;right:0;text-align:center;color:#272523;font:900 14px Arial;letter-spacing:.14em;text-shadow:0 1px #fff7}.m3-deck:after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(114deg,transparent 0 37%,#fff2 42%,transparent 49% 100%);mix-blend-mode:screen}
  .m3-lid{height:46px;margin:-53px 38px 14px;background:linear-gradient(#59514c,#171819 46%,#080909 53%,#332e2b);border:1px solid #6d625a;border-radius:9px 9px 1px 1px;box-shadow:0 4px 7px #0009,inset 0 1px #ffffff2e}
  .m3-screen{height:132px;position:relative;background:linear-gradient(#07111a,#000308 72%,#05090c);border:6px solid #332f2d;color:var(--led2);padding:14px 18px;font:800 11px monospace;box-shadow:inset 0 0 25px #000,0 0 0 1px #aca29b,0 0 17px #168fff22}.m3-screen:after{content:"";position:absolute;inset:0;background:linear-gradient(165deg,#ffffff1c,transparent 28% 70%,#168fff0b);pointer-events:none}.m3-screen-top{display:flex;justify-content:space-between;letter-spacing:.08em}.m3-screen-title{text-align:center;font-size:14px;margin:6px 0 2px;color:#20b7ff;text-shadow:0 0 8px #168fff}.m3-bars{display:flex;align-items:end;justify-content:center;gap:4px;height:43px}.m3-bars i{width:10px;background:linear-gradient(#65e3ff,#0581ff);box-shadow:0 0 8px #169aff;animation:m3eq 1.2s ease-in-out infinite alternate}.m3-bars i:nth-child(1){height:14px;animation-delay:-.2s}.m3-bars i:nth-child(2){height:28px;animation-delay:-.7s}.m3-bars i:nth-child(3){height:35px;animation-delay:-.4s}.m3-bars i:nth-child(4){height:20px;animation-delay:-.9s}.m3-bars i:nth-child(5){height:39px;animation-delay:-.3s}.m3-bars i:nth-child(6){height:31px;animation-delay:-.65s}.m3-bars i:nth-child(7){height:23px;animation-delay:-.1s}.m3-bars i:nth-child(8){height:11px;animation-delay:-.8s}@keyframes m3eq{to{transform:scaleY(.45);filter:brightness(.75)}}.m3-time{text-align:right;font-size:19px;font-weight:900;margin-top:-18px}
  .m3-controls{display:grid;grid-template-columns:1fr 104px 1fr;align-items:center;gap:12px;margin-top:11px}.m3-button-bank{display:grid;grid-template-columns:repeat(2,1fr);gap:7px}.m3-button-bank i{height:21px;border-radius:2px;background:linear-gradient(#b8afa9,#6f655f 48%,#4b433e 51%,#8d8179);border:1px solid #443d39;box-shadow:inset 0 1px #fff6,0 2px 3px #0008}.m3-knob{width:96px;height:96px;border-radius:50%;margin:auto;background:repeating-conic-gradient(#d8d1cc 0deg 2deg,#635b56 2deg 4deg);border:7px solid #2d2927;box-shadow:0 0 0 3px #0c0c0c,0 0 0 6px #168fff,0 0 20px #168fffaa,inset 0 0 0 8px #6d625c}.m3-knob:after{content:"";display:block;width:62%;height:62%;border-radius:50%;margin:19%;background:radial-gradient(circle at 36% 28%,#fff8,#ad9f97 12%,#625852 58%,#a79b94);box-shadow:inset 0 0 12px #0008}.m3-slot{height:25px;margin:12px 30px 0;border-radius:2px;background:linear-gradient(#201c1a,#050505 55%,#2a2421);border:1px solid #6d625b;box-shadow:inset 0 4px 6px #000}.m3-label{text-align:center;color:#262320;font:1000 9px Arial;letter-spacing:.18em;margin-top:8px;text-shadow:0 1px #fff5}
  .m3-props{height:5px;position:relative;z-index:5;pointer-events:none}.m3-spindle{position:absolute;left:16px;top:-39px;width:135px;height:87px;filter:drop-shadow(0 13px 9px #0009)}.m3-spindle b{position:absolute;left:5px;right:5px;bottom:0;height:55px;border-radius:50%/18%;background:repeating-linear-gradient(180deg,#f7f7f7aa 0 1px,#363636 1px 4px),linear-gradient(90deg,#d5b038,#8ff,#ef85cd,#f3d676,#8bc7ff);border:2px solid #111}.m3-spindle i{position:absolute;left:61px;bottom:44px;width:13px;height:43px;border-radius:7px 7px 0 0;background:linear-gradient(90deg,#050505,#3e3e3e,#0a0a0a);border:1px solid #666}.m3-jewels{position:absolute;right:24px;top:-43px;width:150px;height:88px;filter:drop-shadow(0 10px 8px #0008)}.m3-jewels i{position:absolute;width:132px;height:78px;right:0;background:linear-gradient(135deg,#ffffff3a,#ffffff08 48%,#1a92ff0d);border:1px solid #ffffff46;box-shadow:inset 0 0 0 2px #ffffff12}.m3-jewels i:nth-child(2){top:8px;right:7px}.m3-jewels i:nth-child(3){top:16px;right:14px}.m3-jewels i:nth-child(4){top:24px;right:21px}
  .m3-binder-zone{display:grid;grid-template-columns:46px minmax(0,1fr) 46px;gap:7px;align-items:center;margin-top:13px;perspective:1000px}.m3-arrow{width:46px;height:46px;border-radius:50%;border:2px solid #d7c091;background:#060606e8;color:#fff;font-size:29px;box-shadow:0 8px 15px #0009,inset 0 0 0 3px #000}.m3-arrow:hover:not(:disabled){border-color:#62c6ff;box-shadow:0 0 18px #168fff88}.m3-arrow:disabled{opacity:.22}
  .m3-binder{position:relative;background:
    radial-gradient(circle at 23% 30%,#ffffff08 0 1px,transparent 2px),
    radial-gradient(circle at 62% 65%,#ffffff06 0 1px,transparent 2px),
    repeating-linear-gradient(120deg,#171513 0 3px,#0b0a09 3px 6px,#12100e 6px 9px);border:3px solid #080706;border-radius:20px;padding:20px 24px 22px;box-shadow:0 22px 42px #000b,inset 0 0 0 2px #5b4733,inset 0 0 0 5px #0a0908;transform:rotateX(3deg);transform-origin:bottom center}.m3-binder:before{content:"";position:absolute;inset:10px;border:1px dashed #a57c45aa;border-radius:12px;pointer-events:none}.m3-binder:after{content:"";position:absolute;left:50%;top:12px;bottom:12px;width:11px;transform:translateX(-50%);background:linear-gradient(90deg,#050505,#42352a 45%,#846744 50%,#31261f 56%,#050505);box-shadow:0 0 12px #000;pointer-events:none}.m3-binder-head{position:relative;z-index:2;display:flex;justify-content:space-between;color:#a99b89;font-size:7px;letter-spacing:.17em;font-weight:900;padding:0 10px 12px}.m3-binder-head strong{color:#e4bd62}.m3-grid{position:relative;z-index:1;display:grid;grid-template-columns:repeat(4,minmax(116px,1fr));gap:14px}.m3-pair{display:grid;grid-template-rows:158px 158px;gap:10px;position:relative}.m3-pocket{position:relative;border:1px solid #e6d8c455;background:linear-gradient(145deg,#ffffff1d,#ffffff05 34%,#8acaff0c 74%,#ffffff13);overflow:hidden;padding:8px;color:#e5ddd0;cursor:pointer;transition:transform .18s,border-color .18s,box-shadow .18s;box-shadow:inset 0 0 0 2px #0007,inset 0 0 18px #fff07,0 6px 10px #0005}.m3-pocket:after{content:"";position:absolute;inset:-30% -45%;transform:rotate(22deg);background:linear-gradient(90deg,transparent 35%,#ffffff28 48%,#ffffff06 57%,transparent 68%);pointer-events:none}.m3-pocket:hover{transform:translateY(-3px) scale(1.01);border-color:#8fcfff}.m3-pair.selected .m3-pocket{border-color:var(--led2);box-shadow:inset 0 0 0 1px var(--led),0 0 14px #149cff77,0 8px 12px #0007}.m3-cover img{width:100%;height:100%;object-fit:contain;background:#090909;filter:saturate(1.03) contrast(1.02)}.m3-pocket small{position:absolute;z-index:4;left:8px;right:8px;bottom:8px;background:#050505d9;border-top:1px solid #8c724f66;padding:5px;text-align:center;font-size:6px;letter-spacing:.11em;font-weight:900}
  .m3-discface{width:min(125px,79%);aspect-ratio:1;border-radius:50%;position:absolute;left:50%;top:47%;transform:translate(-50%,-50%);overflow:hidden;background:conic-gradient(#dcdcdc,#818181,#f4f3ed,#9c9c9c,#e4e4df,#7c7c7c);box-shadow:0 0 0 2px #efefe9,0 0 0 5px #65645f,0 8px 16px #0009,inset 0 0 10px #fff7}.m3-discface img{width:100%;height:100%;object-fit:cover}.m3-discface:before{content:"";position:absolute;inset:0;background:conic-gradient(transparent 0 8%,#6af5ff4f 10%,transparent 16% 30%,#ff66cf3d 33%,transparent 41% 58%,#ffe25d4f 61%,transparent 70%);mix-blend-mode:screen;z-index:2}.m3-discface:after{content:"";position:absolute;z-index:3;left:50%;top:50%;transform:translate(-50%,-50%);width:26%;height:26%;border-radius:50%;background:#141414;border:7px solid #deded9dd;box-shadow:0 0 0 1px #555,inset 0 0 8px #000}
  .m3-cdr{width:min(125px,79%);aspect-ratio:1;border-radius:50%;position:absolute;left:50%;top:47%;transform:translate(-50%,-50%);background:conic-gradient(#e7e4d8 0 8%,#b7c9ce 12%,#f0eacb 18%,#d7d5cc 27%,#9cc3d4 35%,#efe2a9 45%,#e4e4da 60%,#b7cdd5 70%,#f0e3ba 80%,#d3d5d3 100%);box-shadow:0 0 0 2px #eee,0 0 0 5px #65645f,0 8px 15px #0009;display:grid;place-items:center;overflow:hidden}.m3-cdr:after{content:"";position:absolute;width:27%;height:27%;border-radius:50%;background:#111;border:7px solid #ddd9ce;box-shadow:0 0 0 1px #777}.m3-sharpie{position:relative;z-index:3;color:#161616;font:700 15px/1.05 "Comic Sans MS",cursive;transform:rotate(-10deg);max-width:75%;text-align:center;text-shadow:0 1px #fff3;margin-top:-4px}
  .m3-hud{background:linear-gradient(180deg,#070808,#030303);border:2px solid #a77a0b;padding:15px;min-height:690px;margin-right:10px;box-shadow:0 20px 38px #0009,inset 0 0 0 1px #f3c84e1e;position:relative;overflow:hidden}.m3-hud:before{content:"";position:absolute;inset:0;background:linear-gradient(120deg,transparent 0 58%,#ffffff08 60%,transparent 64%);pointer-events:none}.m3-hud>small{display:block;color:#ffc531;font-size:9px;letter-spacing:.2em;font-weight:1000;margin-bottom:10px}.m3-hud-cover{aspect-ratio:1;border:1px solid #a27f25;padding:5px;background:#0d0d0d;box-shadow:inset 0 0 20px #000,0 8px 18px #0009}.m3-hud-cover img{width:100%;height:100%;object-fit:contain;background:#090909}.m3-hud h2{font:800 clamp(25px,2.15vw,37px)/.95 Georgia;margin:14px 0 8px}.m3-meta{color:#d0c5b6;font-size:9px;letter-spacing:.12em;font-weight:800}.m3-hud p{font:13px/1.48 Georgia;color:#ddd4c8}.m3-status{border:2px solid #c49117;color:#ffca31;text-align:center;font-weight:1000;font-size:14px;line-height:1.15;letter-spacing:.04em;padding:11px 7px;margin:12px 0;background:#4f380913}.m3-status.current{border-color:#168fff;color:#71d8ff;background:#168fff12}.m3-list-title{font-size:7px;letter-spacing:.18em;color:#e7b53c;font-weight:1000;border-top:1px solid #45351c;padding-top:12px}.m3-list{list-style:none;padding:0;margin:8px 0 12px;display:grid;gap:3px}.m3-list li{display:grid;grid-template-columns:26px 1fr;gap:7px;background:#10100f;border:1px solid #26231e;padding:6px}.m3-list b{color:#e0ab30;font-size:7px}.m3-list span{font-size:9px}.m3-play{width:100%;padding:12px;border:0;background:linear-gradient(#ffd349,#e5a710);color:#111;font-size:9px;font-weight:1000;letter-spacing:.12em;box-shadow:0 7px 15px #0008}.m3-play:disabled{background:#352d1b;color:#9d8c66}.m3-note{color:#777168!important;font:7px/1.45 Arial!important}
  .m3-page-flip{animation:m3flip .32s ease}@keyframes m3flip{0%{transform:rotateX(3deg) rotateY(0)}50%{transform:rotateX(3deg) rotateY(8deg);filter:brightness(.65)}100%{transform:rotateX(3deg) rotateY(0)}}
  @media(max-width:1320px){.m3-layout{grid-template-columns:120px minmax(650px,1fr) 290px}.m3-stereo-stage{grid-template-columns:190px minmax(390px,510px) 190px}.m3-s{width:155px;height:155px}.m3-pair{grid-template-rows:140px 140px}}
  @media(max-width:1020px){#view-music{overflow:visible}.m3-layout{grid-template-columns:1fr}.m3-copy{display:none}.m3-hud{margin:12px 12px 0;min-height:0}.m3-stereo-stage{grid-template-columns:160px minmax(330px,460px) 160px}.m3-grid{grid-template-columns:repeat(2,minmax(135px,1fr))}.m3-pair{grid-template-rows:170px 170px}}
  @media(max-width:700px){.music-v3-live{padding:4px 0 10px}.m3-stereo-stage{height:325px;grid-template-columns:92px minmax(220px,1fr) 92px}.m3-speaker{height:292px;padding:11px 5px}.m3-t{width:34px;height:34px}.m3-m{width:61px;height:61px}.m3-s{width:85px;height:85px}.m3-deck{height:270px;padding:12px}.m3-lid{display:none}.m3-screen{height:94px;padding:8px}.m3-screen-title{font-size:10px}.m3-bars{height:28px}.m3-time{font-size:13px}.m3-controls{grid-template-columns:1fr 62px 1fr}.m3-knob{width:58px;height:58px;border-width:4px}.m3-knob:after{margin:18%}.m3-slot{margin-top:6px}.m3-binder-zone{grid-template-columns:34px 1fr 34px}.m3-arrow{width:34px;height:34px}.m3-binder{padding:17px 14px}.m3-grid{gap:8px}.m3-pair{grid-template-rows:127px 127px}.m3-jewels,.m3-spindle{display:none}}
  `;

  function ensureStyle(){
    let s=q('#musicV3LiveStyle');
    if(!s){s=document.createElement('style');s.id='musicV3LiveStyle';document.head.appendChild(s)}
    s.textContent=css;
  }

  function playSelected(){
    const item=catalog[index];
    if(item.project && typeof playProject==='function'){playProject(item.project,true);return}
    const src=item.audio || item.tracks?.[0]?.src || item.tracks?.[0]?.audio;
    if(!src)return;
    const audio=q('#audio');if(!audio)return;
    audio.src=src;audio.load();
    const cover=q('#nowCover');if(cover)cover.src=asset(item.cover);
    const title=q('#nowTitle');if(title)title.textContent=item.tracks?.[0]?.title || item.title;
    audio.play().catch(()=>{});
  }

  function drawHud(){
    const a=catalog[index],hud=q('#m3Hud'); if(!hud||!a)return;
    const cover=asset(a.cover);
    const discNo=q('#m3DiscNo');if(discNo)discNo.textContent=String(index+1).padStart(2,'0');
    const screenTitle=q('#m3ScreenTitle');if(screenTitle)screenTitle.textContent=a.title.toUpperCase().slice(0,24);
    const tracks=a.tracks?.length ? a.tracks : [{title:a.title}];
    const playable=Boolean(a.project || a.audio || tracks.some(t=>t.src||t.audio));
    hud.innerHTML=`<small>NOW SELECTED · DISC ${String(index+1).padStart(2,'0')}</small><div class="m3-hud-cover"><img src="${cover}" alt="${esc(a.title)} artwork"></div><h2>${esc(a.title)}</h2><div class="m3-meta">${esc(a.year || (a.current?'CURRENT':'ARCHIVE'))} · 2FLY KEITH LOGAN</div><p>${esc(a.desc || '')}</p><div class="m3-status ${a.current?'current':''}">${a.current ? (playable?'CURRENT CATALOG · READY TO PLAY':'CURRENT CATALOG') : 'RE-RELEASE DATE COMING SOON'}</div><div class="m3-list-title">CATALOG / DISCOGRAPHY</div><ol class="m3-list">${tracks.slice(0,5).map((t,i)=>`<li><b>${String(i+1).padStart(2,'0')}</b><span>${esc(t.title || `Track ${i+1}`)}</span></li>`).join('')}</ol><button id="m3Play" class="m3-play" ${playable?'':'disabled'}>${playable?'▶ PLAY IN GLOBAL PLAYER':(a.legacy?'AUDIO COMING SOON':'AUDIO TO BE ADDED')}</button>${a.legacy?'<p class="m3-note">Archive artwork is intentionally preserved. Re-release audio and final track details will be added later.</p>':''}`;
    q('#m3Play')?.addEventListener('click',playSelected);
  }

  function discMarkup(a,cover){
    if(a.sharpie)return `<span class="m3-cdr"><b class="m3-sharpie">${esc(a.title)}</b></span>`;
    return `<span class="m3-discface"><img src="${cover}" alt=""></span>`;
  }

  function drawPage(animate=false){
    const grid=q('#m3Grid');if(!grid)return;
    const pages=Math.ceil(catalog.length/perPage),start=page*perPage;
    q('#m3Page').textContent=`PAGE ${String(page+1).padStart(2,'0')} / ${String(pages).padStart(2,'0')}`;
    grid.innerHTML=catalog.slice(start,start+perPage).map((a,local)=>{const i=start+local,cover=asset(a.cover);return `<article class="m3-pair ${i===index?'selected':''}" data-pair="${i}"><button class="m3-pocket m3-cover" data-album="${i}" type="button"><img src="${cover}" alt="${esc(a.title)} original artwork"><small>ARTWORK INSERT</small></button><button class="m3-pocket" data-album="${i}" type="button">${discMarkup(a,cover)}<small>${a.sharpie?'HANDWRITTEN ARCHIVE CD-R':'MATCHING COMPACT DISC'}</small></button></article>`}).join('');
    qa('#m3Grid [data-album]').forEach(b=>b.onclick=()=>{index=+b.dataset.album;qa('.m3-pair').forEach(p=>p.classList.toggle('selected',+p.dataset.pair===index));drawHud()});
    q('#m3Prev').disabled=page===0;q('#m3Next').disabled=page===pages-1;
    if(animate){const binder=q('#m3Binder');binder.classList.remove('m3-page-flip');void binder.offsetWidth;binder.classList.add('m3-page-flip')}
  }

  function turn(dir){
    const pages=Math.ceil(catalog.length/perPage),next=Math.max(0,Math.min(pages-1,page+dir));if(next===page)return;
    page=next;index=page*perPage;drawPage(true);drawHud();
  }

  function render(){
    if((location.hash||'#home').slice(1).split('?')[0]!=='music')return;
    const view=q('#view-music');if(!view)return;
    rebuildCatalog();ensureStyle();
    if(index>=catalog.length)index=0;
    page=Math.floor(index/perPage);
    view.innerHTML=`<section class="music-v3-live"><div class="m3-layout"><aside class="m3-copy"><h1>MUSIC</h1><p>COLLECT.<br>EXPLORE.<br>PRESS PLAY.</p><em>Music Lives Here.</em></aside><div class="m3-center"><div class="m3-stereo-stage"><div class="m3-speaker left"><i class="m3-driver m3-t"></i><i class="m3-driver m3-m"></i><i class="m3-driver m3-s"></i></div><div class="m3-deck"><div class="m3-lid"></div><div class="m3-screen"><div class="m3-screen-top"><span>DISC <b id="m3DiscNo">01</b></span><span>TRACK 01</span></div><div id="m3ScreenTitle" class="m3-screen-title">MUSIC LIVES HERE</div><div class="m3-bars"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="m3-time">00:00</div></div><div class="m3-controls"><div class="m3-button-bank"><i></i><i></i><i></i><i></i></div><div class="m3-knob"></div><div class="m3-button-bank"><i></i><i></i><i></i><i></i></div></div><div class="m3-slot"></div><div class="m3-label">5 DISC CHANGER · 2FLY · MUSIC LIVES HERE</div></div><div class="m3-speaker right"><i class="m3-driver m3-t"></i><i class="m3-driver m3-m"></i><i class="m3-driver m3-s"></i></div></div><div class="m3-props"><div class="m3-spindle"><b></b><i></i></div><div class="m3-jewels"><i></i><i></i><i></i><i></i></div></div><div class="m3-binder-zone"><button id="m3Prev" class="m3-arrow" type="button" aria-label="Previous binder page">‹</button><div id="m3Binder" class="m3-binder"><div class="m3-binder-head"><span>2FLY DISC ARCHIVE</span><strong id="m3Page"></strong><span>SELECT COVER OR DISC</span></div><div id="m3Grid" class="m3-grid"></div></div><button id="m3Next" class="m3-arrow" type="button" aria-label="Next binder page">›</button></div></div><aside id="m3Hud" class="m3-hud"></aside></div></section>`;
    q('#m3Prev').onclick=()=>turn(-1);q('#m3Next').onclick=()=>turn(1);
    drawPage();drawHud();
  }

  window.addEventListener('hashchange',()=>setTimeout(render,25));
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(render,120));else setTimeout(render,120);
})();
