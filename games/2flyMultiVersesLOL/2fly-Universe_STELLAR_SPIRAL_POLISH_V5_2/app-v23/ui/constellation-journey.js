import { GALAXY_THEMES } from '../types.js';
export class ConstellationJourney {
 constructor(container,data,callbacks){
  this.data=data;this.callbacks=callbacks;this.visited=new Set();this.selected='G2025';
  const heading=document.createElement('header');heading.id='cosmos-heading';heading.innerHTML='<div class="overline">KEITH “2FLY” LOGAN</div><h1>A life in<br>constellation.</h1><p>Music, memory, and imagination.<br>Every world is part of the story.</p><div class="exp-count">07 ERAS · ONE EXPANDING UNIVERSE</div>';heading.querySelector('.exp-count').textContent=`${String(data.galaxies.length).padStart(2,'0')} ERAS · ONE EXPANDING UNIVERSE`;container.appendChild(heading);
  this.rail=document.createElement('nav');this.rail.id='journey-rail';this.rail.setAttribute('aria-label','Creative timeline');
  this.rail.innerHTML=`<div class="rail-caption"><span>A LIVING TIMELINE</span><span id="discovery-count">FOLLOW YOUR CURIOSITY</span></div><div class="era-track">${data.galaxies.map(g=>`<button class="era-stop" data-era="${g.id}" style="--era:#${GALAXY_THEMES[g.id].accentColor.toString(16).padStart(6,'0')}" aria-label="Explore ${g.title}" aria-pressed="false">${g.startYear}${g.status==='uncharted'?'+':''}</button>`).join('')}</div>`;container.appendChild(this.rail);
  this.rail.querySelectorAll('[data-era]').forEach(b=>b.addEventListener('click',()=>this.select(b.dataset.era,true)));
  this.drawer=document.createElement('aside');this.drawer.id='chapter-drawer';this.drawer.hidden=true;this.drawer.setAttribute('aria-label','Era and destinations');container.appendChild(this.drawer);
  this.tools=document.createElement('div');this.tools.id='exp-tools';this.tools.innerHTML='<button id="open-chapters" aria-expanded="false" aria-controls="chapter-drawer">EXPLORE WORLDS ↗</button><button id="exp-help" aria-label="Navigation help">?</button>';container.appendChild(this.tools);
  this.tools.querySelector('#open-chapters').onclick=()=>{if(this.drawer.hidden)this.select(this.selected,false);else this.close();};
  this.tools.querySelector('#exp-help').onclick=()=>this.help();
  this.status=document.createElement('div');this.status.id='exp-status';this.status.setAttribute('role','status');container.appendChild(this.status);
  window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!this.drawer.hidden){this.close();this.tools.querySelector('#open-chapters').focus();}});
 }
 announce(text){clearTimeout(this.timer);this.status.textContent=text;this.status.classList.add('active');this.timer=setTimeout(()=>this.status.classList.remove('active'),4200);}
 close(){this.drawer.hidden=true;this.tools.querySelector('#open-chapters').setAttribute('aria-expanded','false');}
 select(id,travel=true){
  if(this.callbacks.canChooseEra&&!this.callbacks.canChooseEra(id))return;
  const g=this.data.galaxies.find(g=>g.id===id);if(!g)return;this.selected=id;this.visited.add(id);
  this.rail.querySelectorAll('[data-era]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.era===id));b.classList.toggle('visited',this.visited.has(b.dataset.era));});
  this.rail.querySelector('#discovery-count').textContent=`${this.visited.size} / ${this.data.galaxies.length} ERAS EXPLORED`;
  const objects=this.data.celestialObjects.filter(o=>o.galaxyId===id);
  const name=g.title.split(' · ')[1]||g.title;
  this.drawer.innerHTML=`<button class="chapter-close" aria-label="Close chapter">×</button><div class="exp-kicker">${g.startYear} — ${g.endYear}</div><h2>${name.replace('THE ','')}</h2><p>${g.status==='uncharted'?'The next chapter is still becoming. A distant signal for the ideas, worlds, and possibilities ahead.':objects.length?'Songs become worlds. Stories become experiences. Follow a signal and discover what lives in its orbit.':'A constellation of beginnings, experiments, and creative evolution. These chapter markers preserve the shape of the journey as the archive grows.'}</p>${objects.length?objects.map(o=>`<button class="chapter-project" data-project="${o.id}">${o.title}<small>${o.subtitle||'Explore this world'} →</small></button>`).join(''):`<ul class="chapter-regions">${g.regions.map(r=>`<li>${r.title}<small>${r.subtitle||''}</small></li>`).join('')}</ul><p>${g.status==='uncharted'?'This horizon is intentionally open.':'Explore the orbital landscape. Media for this era has not yet been added to the archive.'}</p><button class="exp-action" id="back-frontier">Explore the playable frontier →</button>`}`;
  this.drawer.hidden=false;this.tools.querySelector('#open-chapters').setAttribute('aria-expanded','true');
  this.drawer.querySelector('.chapter-close').onclick=()=>this.close();
  this.drawer.querySelector('#back-frontier')?.addEventListener('click',()=>this.select('G2025',true));
  this.drawer.querySelectorAll('[data-project]').forEach(b=>b.onclick=e=>{this.callbacks.onProject(b.dataset.project,e);});
  if(travel){this.callbacks.onEra(id);this.announce(`${g.startYear} — ${g.endYear} · ${name}`);}
 }
 help(){this.drawer.hidden=false;this.tools.querySelector('#open-chapters').setAttribute('aria-expanded','true');this.drawer.innerHTML='<button class="chapter-close" aria-label="Close help">×</button><div class="exp-kicker">FIND YOUR WAY</div><h2>Follow a signal.</h2><p>Choose a year along the timeline, then a world. Its orbit holds music, films, playable experiences, and archives.</p><ul class="chapter-regions"><li>Mouse<small>Drag to orbit · scroll to approach · right hold to thrust. Click to select; pause after selecting, then click once more to open.</small></li><li>Touch<small>Drag to orbit · pinch to zoom. Use Explore Worlds to select a destination. Pause, then tap it again to open.</small></li><li>Keyboard<small>Tab through controls · Enter to select · Escape to close media. Reset View returns to the whole universe.</small></li><li>Your mark in the cosmos<small>Place a star with a message. Stars are saved in this browser on this device.</small></li><li>Sound<small>Songs start only when you confirm their item. The music button mutes the active player. Music and hosted experiences require an internet connection.</small></li></ul>';this.drawer.querySelector('.chapter-close').onclick=()=>this.close();}
}
