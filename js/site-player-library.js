(function(){
  'use strict';
  const D=window.PlayerDownloads,KEY='2fly-hearted-songs-v1';
  const heart='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/></svg>';
  const down='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/></svg>';
  function init(){
    const player=document.querySelector('.global-player'),audio=document.querySelector('#globalAudio');if(!player||!D)return;
    player.classList.add('has-library');
    const panel=player.querySelector('.now-playing>div');panel.classList.add('player-info');
    const title=document.querySelector('#playerTitle'),label=panel.querySelector('small');
    const songInfo=document.createElement('section');songInfo.className='player-song-info';songInfo.append(label,title);
    panel.replaceChildren(songInfo);
    const save=document.createElement('button');save.type='button';save.className='player-heart';save.innerHTML=heart+'<span>Save song</span>';save.title='Save song to your download list';save.setAttribute('aria-pressed','false');panel.prepend(save);
    const actions=document.createElement('section');actions.className='player-download-actions';actions.setAttribute('aria-label','Downloads');
    actions.innerHTML='<button type="button" data-download="song">'+down+'Download song</button><button type="button" data-download="album">'+down+'Download album <em>ZIP</em></button><button type="button" data-download="hearted">'+down+'Download all hearted songs <em>ZIP</em></button>';
    panel.append(actions);
    const mobile=document.createElement('button');mobile.type='button';mobile.className='player-download-toggle';mobile.textContent='Downloads';mobile.setAttribute('aria-expanded','false');mobile.setAttribute('aria-controls','playerDownloadActions');actions.id='playerDownloadActions';panel.append(mobile);
    const library=document.querySelector('#detachPlayer');library.className='player-library-toggle';library.removeAttribute('title');library.setAttribute('aria-expanded','false');library.setAttribute('aria-controls','playerLibrary');
    const drawer=document.createElement('section');drawer.id='playerLibrary';drawer.className='player-library';drawer.hidden=true;drawer.setAttribute('aria-label','Hearted songs');
    drawer.innerHTML='<header><h2>Hearted songs</h2><button type="button" data-close>Close ×</button></header><p class="player-storage-note">Saved in this browser. Download a ZIP to keep your music files.</p><section class="player-library-tools"><button type="button" data-play-all>Play all</button><button type="button" data-shuffle>Shuffle</button><button type="button" data-download="hearted">'+down+'Download all (.zip)</button></section><ol></ol>';
    player.after(drawer);
    const notice=document.createElement('section');notice.className='player-notice';notice.hidden=true;
    notice.innerHTML='<p role="status" aria-live="polite"></p><button type="button" data-notice-download hidden>Download all hearted songs here (.zip)</button><a data-ready hidden>Save file</a><button type="button" data-retry hidden>Retry failed tracks</button><button type="button" data-cancel hidden>Cancel</button><button type="button" data-dismiss aria-label="Dismiss message">×</button>';
    drawer.after(notice);
    const q=s=>notice.querySelector(s),buttons=[...actions.querySelectorAll('button'),drawer.querySelector('[data-download]')];
    let ids=[],catalog=[],current=null,queue=[],queueIndex=0,queueSource='',job=null,busy=false,objectURL='';
    try{ids=D.readFavorites(localStorage.getItem(KEY));}catch{}
    function favorites(){return ids.map(id=>catalog.find(t=>t.id===id)).filter(Boolean);}
    function message(text){notice.hidden=false;q('p').textContent=text;q('[data-notice-download]').hidden=true;}
    function persist(){try{localStorage.setItem(KEY,JSON.stringify(ids));return true;}catch{message('Saved for this visit only. Browser storage is unavailable.');return false;}}
    function renderList(){
      const list=drawer.querySelector('ol');list.replaceChildren();
      if(!ids.length){const empty=document.createElement('li');empty.className='player-empty';empty.textContent='Heart songs to keep them here.';list.append(empty);}
      ids.forEach(id=>{
        const t=catalog.find(x=>x.id===id),row=document.createElement('li');
        const play=document.createElement('button');play.type='button';play.className='player-saved-track';play.disabled=!t;play.textContent=t?t.title:'Unavailable song';play.title=t?`Play ${t.title} · ${t.album}`:'This song is no longer in the catalog';
        play.onclick=()=>startQueue(favorites(),id);
        const download=document.createElement('button');download.type='button';download.innerHTML=down;download.disabled=!t||busy;download.setAttribute('aria-label',`Download ${t?.title||'unavailable song'}`);download.onclick=()=>prepare([t],false,t.title);
        const remove=document.createElement('button');remove.type='button';remove.textContent='×';remove.setAttribute('aria-label',`Remove ${t?.title||'unavailable song'} from hearted songs`);remove.onclick=()=>{const next=row.nextElementSibling?.querySelector('button')||row.previousElementSibling?.querySelector('button');const nextId=next?.textContent;ids=ids.filter(x=>x!==id);persist();sync();const focus=[...list.querySelectorAll('button')].find(b=>b.textContent===nextId);(focus||drawer.querySelector('[data-close]')).focus();};
        row.append(play,download,remove);list.append(row);
      });
      drawer.querySelector('[data-play-all]').disabled=!favorites().length;drawer.querySelector('[data-shuffle]').disabled=!favorites().length;
    }
    function sync(){
      const source=audio.getAttribute('src');const url=source?new URL(source,location.href).href:'';
      current=catalog.find(t=>t.url===url&&t.albumId===app.albumId)||catalog.find(t=>t.url===url)||null;
      if(queueSource&&queueSource!==url){queue=[];queueSource='';}
      const saved=!!current&&ids.includes(current.id);save.disabled=!current;save.setAttribute('aria-pressed',String(saved));save.setAttribute('aria-label',saved?'Remove song from hearted songs':'Save song to your download list');save.querySelector('span').textContent=saved?'Saved':'Save song';save.title=saved?'Remove song from hearted songs':'Save song to your download list';
      library.textContent=`♡ Hearted songs (${ids.length})`;
      buttons.forEach(b=>{const type=b.dataset.download;b.disabled=busy||(type==='song'?!current:type==='album'?!current?.isAlbum:!ids.length);if(type==='album')b.title=current?.isAlbum?`Download ${current.album} (.zip)`:'Choose a song from an album';});
      title.title=title.textContent;renderList();
    }
    function refreshCatalog(){catalog=D.catalog(app.projects,new URL('../',location.href));sync();}
    save.onclick=()=>{if(!current)return;const added=!ids.includes(current.id);ids=added?[...ids,current.id]:ids.filter(id=>id!==current.id);const stored=persist();sync();if(added){if(stored)message('Song saved! Download all your hearted songs in one ZIP file.');q('[data-notice-download]').hidden=false;if(!matchMedia('(prefers-reduced-motion: reduce)').matches)save.animate([{transform:'scale(1)'},{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:260});}else message('Song removed from hearted songs.');};
    library.onclick=()=>{drawer.hidden=!drawer.hidden;library.setAttribute('aria-expanded',String(!drawer.hidden));if(!drawer.hidden)drawer.querySelector('[data-close]').focus();};
    function close(){drawer.hidden=true;library.setAttribute('aria-expanded','false');library.focus();}
    drawer.querySelector('[data-close]').onclick=close;
    drawer.onkeydown=e=>{if(e.key==='Escape'){e.stopPropagation();close();}};
    mobile.onclick=()=>{const expanded=mobile.getAttribute('aria-expanded')!=='true';mobile.setAttribute('aria-expanded',String(expanded));panel.classList.toggle('downloads-open',expanded);};
    panel.addEventListener('keydown',e=>{if(e.key==='Escape'){panel.classList.remove('downloads-open');mobile.setAttribute('aria-expanded','false');mobile.focus();}});
    function playQueue(){const t=queue[queueIndex];if(!t)return;queueSource=t.url;loadProjectAudio({id:t.albumId,title:t.title,audio:t.url,cover:t.cover,albumId:t.isAlbum?t.albumId:null,albumTrackIndex:t.albumTrackIndex},false);audio.play().catch(()=>message('Playback could not start. Press Play to try again.'));}
    function startQueue(list,id){queue=list.slice();queueIndex=Math.max(0,queue.findIndex(t=>t.id===id));playQueue();}
    drawer.querySelector('[data-play-all]').onclick=()=>startQueue(favorites());
    drawer.querySelector('[data-shuffle]').onclick=()=>{const list=favorites();for(let i=list.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[list[i],list[j]]=[list[j],list[i]];}startQueue(list);};
    ['playerPrev','playerNext','playerPlay'].forEach(id=>document.getElementById(id).addEventListener('click',e=>{if(!queue.length||audio.src!==queueSource)return;e.stopImmediatePropagation();if(id==='playerPlay'){if(audio.paused)audio.play().catch(()=>message('Playback could not start. Try again.'));else audio.pause();}else{queueIndex=(queueIndex+(id==='playerNext'?1:-1)+queue.length)%queue.length;playQueue();}},{capture:true}));
    audio.addEventListener('ended',e=>{if(!queue.length||audio.src!==queueSource)return;e.stopImmediatePropagation();if(queueIndex+1<queue.length){queueIndex++;playQueue();}},{capture:true});
    function clearFile(){if(objectURL)URL.revokeObjectURL(objectURL);objectURL='';q('[data-ready]').hidden=true;q('[data-ready]').removeAttribute('href');}
    async function run(){
      if(busy||!job)return;busy=true;message('Preparing download…');const active=job;active.controller=new AbortController();q('[data-retry]').hidden=true;q('[data-cancel]').hidden=false;sync();
      try{
        for(let i=0;i<active.tracks.length;i++){
          const t=active.tracks[i];if(active.files.has(t.id))continue;message(`Preparing ${active.zip?'ZIP':'song'}: ${i+1}/${active.tracks.length} · ${t.title}`);
          let bytes;
          for(let attempt=0;attempt<2;attempt++){
            try{bytes=await D.fetchAudio(t.url,{signal:active.controller.signal,onProgress:n=>message(`Preparing ${active.zip?'ZIP':'song'}: ${i+1}/${active.tracks.length} · ${t.title} · ${(n/1048576).toFixed(1)} MB`)});break;}
            catch(error){if(active.controller.signal.aborted)throw error;if(attempt===1)throw new Error(`${t.title}: ${error.message}`);}
          }
          active.size+=bytes.length;if(active.size>D.MAX_TOTAL){active.files.clear();active.size=0;throw new Error('Selection exceeds 256 MB. Download albums or individual songs instead.');}active.files.set(t.id,bytes);
        }
        const blob=active.zip?D.zip(active.tracks.map((t,i)=>({name:`${D.filename(active.name)}/${String(i+1).padStart(2,'0')} - ${D.filename(t.title)}.mp3`,bytes:active.files.get(t.id)}))):new Blob([active.files.get(active.tracks[0].id)],{type:'audio/mpeg'});
        clearFile();objectURL=URL.createObjectURL(blob);const link=q('[data-ready]');link.href=objectURL;link.download=D.filename(active.name)+(active.zip?'.zip':'.mp3');link.textContent=`Save ${active.zip?'ZIP':'song'} (${(blob.size/1048576).toFixed(1)} MB)`;link.hidden=false;
        message(`Ready: ${active.tracks.length} ${active.tracks.length===1?'song':'songs'}. Select “Save ${active.zip?'ZIP':'song'}” to download to your device.`);active.files.clear();job=null;link.focus();
      }catch(error){
        if(active.controller.signal.aborted){message('Download preparation canceled.');active.files.clear();job=null;}
        else{message(`Download not ready. ${error.message}. No incomplete ZIP was created.`);q('[data-retry]').hidden=false;}
      }finally{busy=false;q('[data-cancel]').hidden=true;sync();}
    }
    function prepare(tracks,zipped,name){if(busy)return;if(!tracks.length){message('No songs are available to download.');return;}clearFile();job={tracks:tracks.slice(),zip:zipped,name,files:new Map(),size:0};run();}
    function download(type){if(type==='song'&&current)prepare([current],false,current.title);if(type==='album'&&current?.isAlbum)prepare(catalog.filter(t=>t.albumId===current.albumId),true,current.album);if(type==='hearted'){if(favorites().length!==ids.length){message('Some hearted songs are unavailable. Remove unavailable entries before downloading the full ZIP.');drawer.hidden=false;library.setAttribute('aria-expanded','true');return;}prepare(favorites(),true,'2Fly - Hearted songs');}}
    [actions,drawer].forEach(el=>el.addEventListener('click',e=>{const b=e.target.closest('[data-download]');if(b)download(b.dataset.download);}));
    q('[data-notice-download]').onclick=()=>download('hearted');q('[data-retry]').onclick=run;q('[data-cancel]').onclick=()=>job?.controller.abort();q('[data-dismiss]').onclick=()=>{if(!busy){notice.hidden=true;job?.files.clear();job=null;clearFile();q('[data-retry]').hidden=true;}};
    window.addEventListener('storage',e=>{if(e.key===KEY||e.key===null){try{ids=D.readFavorites(localStorage.getItem(KEY));}catch{}sync();}});
    window.addEventListener('pagehide',clearFile);
    document.addEventListener('playercatalogready',refreshCatalog);
    new MutationObserver(sync).observe(audio,{attributes:true,attributeFilter:['src']});
    audio.addEventListener('loadedmetadata',sync);audio.addEventListener('error',()=>message('This song could not load. Try another song or press Play to retry.'));
    refreshCatalog();
  }
  document.addEventListener('DOMContentLoaded',init);
})();
