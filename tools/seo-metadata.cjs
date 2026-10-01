const pages=require('../data/page-seo.json');
const origin='https://www.2flykeithlogan.com';
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function renderSeo(route){
  const page=pages.find(item=>item.route===route);
  if(!page)throw Error('Unknown SEO route: '+route);
  const url=origin+page.slug;
  return `<title>${escape(page.title)}</title>
  <meta name="description" content="${escape(page.description)}">
  <meta name="author" content="2Fly Keith Logan">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="2Fly Keith Logan">
  <meta property="og:locale" content="en_US">
  <meta property="og:title" content="${escape(page.title)}">
  <meta property="og:description" content="${escape(page.description)}">
  <meta property="og:url" content="${url}">
  ${page.image?'<meta property="og:image" content="'+escape(page.image)+'">':''}
  <meta name="twitter:card" content="${page.image?'summary_large_image':'summary'}">
  <meta name="twitter:title" content="${escape(page.title)}">
  <meta name="twitter:description" content="${escape(page.description)}">
  ${page.image?'<meta name="twitter:image" content="'+escape(page.image)+'">':''}`.replace(/[ \t]+$/gm,'').trim();
}
function applySeo(html,route){
  const headEnd=html.indexOf('</head>');
  if(headEnd<0)throw Error('Missing document head');
  // Keep embedded documents and script strings in the body untouched.
  return html.slice(0,headEnd).replace(/<title>[\s\S]*?<\/title>/gi,'')
    .replace(/<meta\b[^>]*(?:name|property)=["'](?:description|author|robots|og:[^"']+|twitter:[^"']+)["'][^>]*>/gi,'')
    .replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi,'')
    .replace(/[ \t]+$/gm,'').replace(/\n(?:\r?\n){2,}/g,'\n\n').trimEnd()+'\n'+renderSeo(route)+'\n'+html.slice(headEnd);
}
module.exports={pages,renderSeo,applySeo};
