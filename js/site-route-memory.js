// Wix reloads the HTML component from its original URL, without its route hash.
// Restore before the router starts; standalone pages already keep their own URL.
(()=>{
  if(window.self===window.top)return;
  const key='2fly-embedded-route-v1';
  const valid=hash=>/^#(?:home|featured|playables|music|videos|support|africa|flyzone)(?:\?[^#]*)?$/.test(hash);
  try{
    if(!location.hash){
      const saved=sessionStorage.getItem(key);
      if(valid(saved))history.replaceState(history.state,'',location.href.split('#')[0]+saved);
    }
  }catch{}
  const remember=()=>{
    const hash=location.hash||'#home';
    if(valid(hash))try{sessionStorage.setItem(key,hash)}catch{}
  };
  remember();
  window.addEventListener('hashchange',remember);
  window.addEventListener('pagehide',remember);
})();
