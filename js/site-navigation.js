// Real URLs for the shared shell, with compatibility for previously shared hash links.
(function () {
  const pages = window.SITE_SEO_PAGES;
  const aliases = {music2: 'music', videos2: 'videos'};
  const directory = new URL('.', document.currentScript.src.replace('/js/', '/pages/'));
  const known = key => Object.prototype.hasOwnProperty.call(pages, key);
  function hashRoute() {
    const value = location.hash.slice(1).split('?')[0];
    const key = aliases[value] || value;
    return known(key) ? key : null;
  }
  function current() {
    return hashRoute() || Object.keys(pages).find(key =>
      new URL(pages[key].file, directory).pathname === location.pathname) || 'home';
  }
  function href(key) { return new URL(pages[key].file, directory).pathname; }
  function sync() {
    const key = current(), page = pages[key];
    // Only route hashes are migrated; section anchors such as #appView still work.
    if (hashRoute()) history.replaceState(null, '', href(key) + location.search);
    document.title = page.title;
    const values = {'description': page.description, 'og:title': page.title,
      'og:description': page.description, 'og:url': page.url,
      'twitter:title': page.title, 'twitter:description': page.description};
    for (const [name, value] of Object.entries(values)) {
      document.querySelector(`meta[name="${name}"],meta[property="${name}"]`)?.setAttribute('content', value);
    }
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', page.url);
    const schema = document.getElementById('siteStructuredData');
    if (schema) schema.textContent = JSON.stringify(page.schema);
    document.documentElement.classList.toggle('cinematic-home', key === 'home');
  }
  function navigate(key) {
    key = aliases[key] || key;
    if (!known(key)) return;
    if (location.pathname !== href(key) || location.hash) history.pushState(null, '', href(key));
    // Existing media cleanup and rendering listeners share this transition event.
    window.dispatchEvent(new Event('hashchange'));
  }
  function links(root) {
    const anchors = root.querySelectorAll('a[href]');
    for (const a of anchors) {
      const raw = a.getAttribute('href');
      const match = /^#([^?]+)$/.exec(raw);
      const key = aliases[match?.[1]] || match?.[1];
      if (!known(key)) continue;
      a.dataset.route = key;
      a.setAttribute('href', href(key));
    }
  }
  window.SiteNavigation = {current, navigate, sync, href};
  sync();
  window.addEventListener('hashchange', sync);
  window.addEventListener('popstate', () => window.dispatchEvent(new Event('hashchange')));
  document.addEventListener('DOMContentLoaded', () => {
    links(document);
    new MutationObserver(records => {
      for (const record of records) for (const node of record.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.matches('a[href]')) links(node.parentElement);
        else links(node);
      }
    }).observe(document.body, {childList: true, subtree: true});
  });
})();
