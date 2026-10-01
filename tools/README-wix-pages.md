# Wix clean page bundles

Run `node tools/build-wix-pages.cjs [output-directory]` from the repository. The default output is the workspace `outputs/wix-pages` directory, outside the repository.

Install each generated HTML file in its matching Wix HTML embed:

| Bundle | Wix path |
| --- | --- |
| home.html | / |
| featured.html | /featured |
| music.html | /music |
| videos.html | /videos |
| playables.html | /playables |
| flyzone.html | /flyzone |
| support.html | /help-2fly-create |
| africa.html | /i-woke-up-in-africa |

Each bundle initializes its own route before route-memory restoration. Main navigation targets the parent Wix page. Smaller contribution buttons retain the existing modal. Page changes reload the document and can interrupt playback; the creator chose clean URLs over uninterrupted navigation.

Assets remain hosted on the existing GitHub Pages site. GitHub stage routing is unchanged. Rebuild and replace the relevant Wix embeds when source content changes. Wix draft changes require publication before public URLs can be checked end to end.

September 30, 2026: eight matching Wix embeds installed in the draft, and page content checked in the editor. Local direct-load and refresh checks passed; Africa desktop and mobile previews reviewed. The support bundle additionally closes its contribution modal when its full-page link targets the current page.

September 30, 2026: published the eight clean-URL pages with creator authorization. All eight public URLs returned HTTP 200 and their unique title, description, canonical, Open Graph and Twitter metadata. Music retained its route after a browser refresh. Africa has its existing film artwork as the sharing image.

`data/page-seo.json` is the editable metadata source. `seo-metadata.cjs` applies it to the outer HTML head only, preserving embedded document strings. Generated bundles include this metadata; Wix outer-page SEO must also be updated in Wix SEO Settings because iframe metadata does not replace the parent page metadata. The live Wix outer pages have the new SEO; their embedded content remains the previously installed bundles. Source HTML and future bundle builds include the matching metadata and canonical Wix URLs.
