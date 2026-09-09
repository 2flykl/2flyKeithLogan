// Preview resilience layer: raw static preview hosts sometimes fail on JSON assets.
// Keep normal same-origin fetch first, then fall back to a known-good CDN snapshot.
(function(){
  const nativeFetch=window.fetch.bind(window);
  const fallbackBase='https://cdn.jsdelivr.net/gh/2flykl/2flyKeithLogan@3c1f44bee17e0d364f1a8b4a53ec6102e4c1d9e7/';
  const dataMap={
    'projects.json':'data/projects.json',
    'playables-overhaul.json':'data/playables-overhaul.json',
    'site-messages.json':'data/site-messages.json'
  };

  window.fetch=async function(input,init){
    const raw=typeof input==='string'?input:(input&&input.url)||'';
    const clean=raw.split('?')[0];
    const file=clean.split('/').pop();
    if(!dataMap[file])return nativeFetch(input,init);

    try{
      const response=await nativeFetch(input,init);
      if(response&&response.ok)return response;
    }catch(err){
      console.warn('[2Fly preview] local data request failed, using CDN fallback:',file,err);
    }

    const fallback=fallbackBase+dataMap[file];
    const response=await nativeFetch(fallback,{cache:'no-store',mode:'cors'});
    if(!response.ok)throw new Error('Preview data fallback failed for '+file+' ('+response.status+')');
    return response;
  };
})();
