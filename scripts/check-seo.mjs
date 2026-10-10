import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const base='https://2flykl.github.io/2flyKeithLogan/';
const xml=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert.equal(new Set(urls).size,urls.length,'Duplicate sitemap URLs');
const titles=new Set();
let checkedLinks=0;
for(const url of urls){
  assert(url.startsWith(base)&&!url.includes('#')&&!url.includes('?'),'Clean production URL required');
  const file=path.join(root,url.slice(base.length));
  const html=fs.readFileSync(file,'utf8');
  const title=html.match(/<title>([^<]+)<\/title>/)?.[1];
  assert(title&&!titles.has(title),'Missing or duplicate title: '+url);titles.add(title);
  assert(html.includes(`<link rel="canonical" href="${url}">`),'Canonical mismatch: '+url);
  assert.match(html,/<meta name="description" content="[^"]+">/);
  assert(!/content="[^"]*noindex/i.test(html),'noindex: '+url);
  const schema=html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/)?.[1];
  assert.equal(JSON.parse(schema)['@context'],'https://schema.org');
  if(html.includes('id="appView"'))assert.match(html,/<main id="appView"[^>]*><section[^>]*><h1>/,'Initial HTML content required');
  for(const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)){
    const target=new URL(match[1].replaceAll('&amp;','&'),url);
    if(!target.href.startsWith(base))continue;
    const targetPath=decodeURIComponent(target.pathname.slice(new URL(base).pathname.length));
    assert(fs.existsSync(path.join(root,targetPath)),'Missing internal link: '+match[1]+' in '+url);
    checkedLinks++;
  }
  if(process.argv[2]){
    const response=await fetch(new URL(url.slice(base.length),process.argv[2]));
    assert.equal(response.status,200,'HTTP failure: '+url);
  }
}
assert.equal(fs.readFileSync(path.join(root,'google78a070760e0c1aee.html'),'utf8').trim(),'google-site-verification: google78a070760e0c1aee.html');
console.log(`SEO checks passed: ${urls.length} URLs, unique metadata, valid structured data, ${checkedLinks} internal references, Google verification file.`);
