// Native I Woke Up in Africa documentary destination.
const supportShellRoute=route;
route=function(){
  const raw=(location.hash||'#home').slice(1).split('?')[0];
  if(raw!=='africa'){supportShellRoute();return}
  app.route='africa';
  $$('#primaryNav [data-route]').forEach(a=>a.classList.toggle('active',a.dataset.route==='africa'));
  document.body.dataset.route='africa';
  renderAfrica();
  window.scrollTo({top:0,left:0,behavior:'auto'});
  $('#appView').focus({preventScroll:true});
};

function africaProject(){return app.projects.find(p=>p.id==='africa')}
function renderAfrica(){
  const p=africaProject();
  if(!p){$('#appView').innerHTML='<section class="africa-native"><p class="empty">I Woke Up in Africa project data is unavailable.</p></section>';return}
  const clips=p.clips||[];
  $('#appView').innerHTML=`<section class="africa-native">
    <div class="africa-native-hero" style="--africa-poster:url('${asset(p.poster||p.cover)}')"><div class="africa-native-shade"></div><div class="africa-native-copy"><div class="kicker">RWANDA · HERITAGE · SERVICE · AWAKENING</div><h1>I WOKE UP<br><span>IN AFRICA.</span></h1><h2>Did I wake up in Africa—or did Africa wake me up?</h2><p>${esc(p.story||p.description||'')}</p><div class="africa-native-actions"><button id="africaSoundtrack" type="button">♫ PLAY SOUNDTRACK</button><a href="../games/africa/index.html">ENTER PNG CERTIFICATION →</a><a href="../games/BlackandGifted/index.html">ENTER BLACK & GIFTED →</a></div></div><img class="africa-native-cover" src="${asset(p.cover)}" alt="${esc(p.title)} artwork"></div>
    <section class="africa-cinema"><div class="africa-cinema-head"><div><div class="kicker">THE RWANDA JOURNEY</div><h2>A STORY TOLD IN ${clips.length} CHAPTERS.</h2></div><p>Move through the journey in sequence or choose a chapter directly. The documentary, soundtrack, reflection experience, and Playables remain connected instead of being split into unrelated pages.</p></div><div class="africa-cinema-grid"><div class="africa-screen"><video id="africaNativeVideo" controls playsinline preload="metadata"></video><div class="africa-screen-meta"><small id="africaNativeCounter"></small><strong id="africaNativeTitle"></strong></div><div class="africa-video-controls"><button id="africaPrevChapter" type="button">← PREVIOUS</button><button id="africaNextChapter" type="button">NEXT →</button></div></div><div class="africa-chapter-list" id="africaNativeRail">${clips.map((c,i)=>`<button type="button" data-africa-chapter="${i}"><b>${String(i+1).padStart(2,'0')}</b><span>${esc(c.title)}</span><small>${esc(c.type||'DOCUMENTARY CHAPTER')}</small></button>`).join('')}</div></div></section>
    <section class="africa-playable-pair"><div class="africa-section-title"><div class="kicker">STEP INSIDE THE PROJECT</div><h2>TWO PLAYABLE PATHS.</h2></div><a class="africa-playable-card intention" href="../games/africa/index.html"><span>01</span><div><small>GUIDED RITUAL · PURPOSE · SERVICE</small><h3>PNG / INTENTION CERTIFICATION</h3><p>Create a daily intention, reflect on purpose and service, and carry the project beyond the documentary.</p><strong>ENTER EXPERIENCE →</strong></div></a><a class="africa-playable-card gifted" href="../games/BlackandGifted/index.html"><span>02</span><div><small>SIDE-SCROLLING JOURNEY · IDENTITY · ALIGNMENT</small><h3>BLACK & GIFTED</h3><p>Move through barriers, faith, affirmation, ancestry, and alignment inside the larger creative world.</p><strong>ENTER EXPERIENCE →</strong></div></a></section>
    <section class="africa-archive"><div><div class="kicker">PROJECT ARCHIVE</div><h2>AWAKENING BECOMES ACTION.</h2><p>${esc(p.description||'')}</p></div><div class="africa-notes">${(p.notes||[]).map(n=>`<article><small>${esc(n.label)}</small><strong>${esc(n.title)}</strong><p>${esc(n.text)}</p></article>`).join('')}</div></section>
    ${helpModule()}
  </section>`;
  $('#africaSoundtrack').onclick=()=>loadProjectAudio(p,true);
  let index=0;
  const load=i=>{if(!clips.length)return;index=(i+clips.length)%clips.length;const c=clips[index],v=$('#africaNativeVideo');v.pause();v.src=c.src;v.poster=asset(c.poster||p.poster||p.cover);v.load();$('#africaNativeCounter').textContent=`CHAPTER ${String(index+1).padStart(2,'0')} / ${String(clips.length).padStart(2,'0')}`;$('#africaNativeTitle').textContent=c.title;$$('[data-africa-chapter]').forEach((b,j)=>b.classList.toggle('active',j===index))};
  $('#africaPrevChapter').onclick=()=>load(index-1);$('#africaNextChapter').onclick=()=>load(index+1);$('#africaNativeRail').onclick=e=>{const b=e.target.closest('[data-africa-chapter]');if(b)load(+b.dataset.africaChapter)};load(0);
}
