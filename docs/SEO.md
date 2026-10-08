# Search discovery

The canonical deployment is https://2flykl.github.io/2flyKeithLogan/.
The shared shell has real HTML entry pages under `pages/`. Old `#music`,
`#videos`, `#flyzone`, and other route links remain compatible. The History API
keeps navigation in the shared document so the persistent audio player survives.

## Updating content

After editing the shell in `pages/site-overhaul.html`, the route metadata in
`scripts/build-seo.mjs`, or the project/playable catalogs, run:

```sh
node scripts/build-seo.mjs
node scripts/check-seo.mjs
```

Commit the generated HTML pages and `js/site-seo-pages.js` with the source change.
The generator leaves the legacy `pages/music.html` and `pages/videos.html` alone.
Do not hand-edit the other generated shared-shell pages.

The sitemap lists the primary public destinations, rather than every prototype
or legacy game copy. Games remain discoverable through the playable library.
Sitemap inclusion and Search Console submission do not guarantee indexing.

## Search Console

Use the URL-prefix property `https://2flykl.github.io/2flyKeithLogan/`.
Keep `google78a070760e0c1aee.html` at the repository root to retain ownership
verification. This is Google's public verification file, not a credential.
Submit `https://2flykl.github.io/2flyKeithLogan/sitemap.xml`.
Use URL Inspection for the canonical home, music, videos, playables and Flyzone
pages; check the Pages report after Google has processed the site.

On GitHub project Pages, robots.txt is only authoritative at the origin root
(`https://2flykl.github.io/robots.txt`), which this repository does not control.
Its current 404 permits crawling. The project-level robots.txt is informational
until deployment at a domain root; direct sitemap submission supplies discovery.
If the site moves to a custom domain, update the production base in both SEO
scripts and the root index canonical, regenerate, and verify the new property.
