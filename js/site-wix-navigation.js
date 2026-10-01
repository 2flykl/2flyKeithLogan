// Included only in the Wix page bundles; the GitHub stage keeps its own router.
(()=>{
  const config=window.WIX_PAGE;
  if(!config)return;
  const paths={home:'/',featured:'/featured',music:'/music',videos:'/videos',playables:'/playables',flyzone:'/flyzone',support:'/help-2fly-create',africa:'/i-woke-up-in-africa'};
  const origin='https://www.2flykeithlogan.com';
  const initial='#'+config.route;
  if(location.hash.split('?')[0]!==initial)history.replaceState(null,'',location.href.split('#')[0]+initial);
  function routeOf(element){
    if(element.dataset.wixRoute)return element.dataset.wixRoute;
    if(paths[element.dataset.route])return element.dataset.route;
    const href=element.getAttribute('href');
    if(!href)return null;
    const hash=href.match(/^(?:.*site-overhaul\.html)?#(home|featured|music|videos|playables|flyzone|support|africa)(?:\?|$)/);
    if(hash)return hash[1];
    if(/(?:^|\/)africa-cinema\.html(?:[?#]|$)/.test(href))return 'africa';
    return null;
  }
  function isModalTrigger(element,route){
    return route==='support'&&!element.matches('.help-create-nav,[data-help2fly-full-page]');
  }
  function urlFor(route){return origin+paths[route];}
  function navigate(route){
    if(!paths[route])return;
    if(route===config.route){location.hash=route;return;}
    window.top.location.href=urlFor(route);
  }
  window.WixPageNavigation={navigate};
  function prepareLinks(root){
    const links=[...(root.matches?.('a[href]')?[root]:[]),...root.querySelectorAll('a[href]')];
    links.forEach(link=>{
      const destination=routeOf(link);
      if(!destination||isModalTrigger(link,destination))return;
      link.dataset.wixRoute=destination;
      link.href=urlFor(destination);link.target='_top';
    });
  }
  document.addEventListener('click',event=>{
    const link=event.target.closest?.('a,button');
    if(!link)return;
    const destination=routeOf(link);
    if(!destination||isModalTrigger(link,destination))return;
    // Keep normal browser behavior for opening an anchor in a new tab.
    if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    event.preventDefault();event.stopImmediatePropagation();
    if(link.matches('[data-help2fly-full-page]'))window.Help2flyCreateModal?.close(false);
    navigate(destination);
  },true);
  document.addEventListener('DOMContentLoaded',()=>{
    prepareLinks(document);
    new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{
      if(node.nodeType===1)prepareLinks(node);
    }))).observe(document.body,{childList:true,subtree:true});
  });
})();
