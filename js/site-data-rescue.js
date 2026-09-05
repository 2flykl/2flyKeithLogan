// Preview data rescue: RawGitHack can intermittently fail relative JSON fetches.
// If the primary bootstrap leaves projects empty, retry from stable public sources
// and re-render the active route instead of showing an empty Featured shell.
(function(){
  async function getJson(url){
    const r=await fetch(url,{cache:'no-store'});
    if(!r.ok)throw new Error(`${r.status} ${url}`);
    return r.json();
  }

  async function rescueProjects(){
    if(Array.isArray(app.projects)&&app.projects.length)return false;
    const candidates=[
      '../data/projects.json?v=rescue-20260905',
      '../data/projects.json',
      'https://raw.githubusercontent.com/2flykl/2flyKeithLogan/feature/site-layout-overhaul/data/projects.json'
    ];
    for(const url of candidates){
      try{
        const data=await getJson(url);
        if(Array.isArray(data)&&data.length){
          app.projects=data;
          app.featured=data.filter(p=>p.featured&&p.explore);
          return true;
        }
      }catch(err){console.warn('[2Fly preview] project data retry failed:',url,err)}
    }
    return false;
  }

  async function ensureDataAndRender(){
    // Give the normal bootstrap first chance to finish.
    await new Promise(r=>setTimeout(r,250));
    const rescued=await rescueProjects();
    if(!rescued&&app.featured?.length)return;
    if(app.featured?.length){
      try{route()}catch(err){console.error('[2Fly preview] route retry failed',err)}
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureDataAndRender);
  else ensureDataAndRender();
})();
