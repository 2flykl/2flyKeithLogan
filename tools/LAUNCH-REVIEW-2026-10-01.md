# Published launch review — October 1, 2026

Published all eight Wix page bundles with the creator's authorization.

## Changes

- One reusable green support/feedback footer on Home, Featured, Music, Videos, Playables, and Help 2Fly Create. The standalone Africa screening room and Flyzone studio keep their full-screen experience layouts.
- Slower header and footer tickers, hover pause, and reduced-motion support.
- Removed legacy Wix payment forms from the page tails and trimmed their empty sections.
- Added the scoped Wix viewport shell in `wix-viewport-shell.html`. It makes the existing HTML embed fill the available screen and gives the embedded application ownership of scrolling. It applies only to the eight named content routes, not other Wix system pages.
- Removed scene resizing based on iframe visibility while scrolling. Mobile scene height follows its actual content.
- Corrected support heading wrapping, feedback focus behavior, canonical feedback page URLs, and the Africa support/skip links.
- Deferred automatic video/game previews on Wix. Embedded scene scripts no longer need extra remote script fetches. Mobile and reduced-motion visitors go directly to the choice scene.

## Evidence

- Live phone viewport 390 × 844 and desktop viewport 1280 × 720: six footer routes each have exactly one footer, zero horizontal overflow, and 0–1 px after the footer.
- Home scene stayed 1264.8 × 600 px before and after scrolling 224 px to the footer.
- Africa and Flyzone: zero horizontal overflow at inspected phone/desktop sizes; Africa uses the viewport without a blank tail.
- Live Africa video started and advanced. Local Music play/pause and album navigation, Videos play/pause/channel navigation, Africa chapter navigation, and Playables catalog navigation passed.
- Feedback popup fits the phone screen, scrolls internally, exposes optional specific-content fields, validates required text, and closes with Escape. Proposal form opens and blocks empty submission.
- 95 catalog media and experience URLs responded successfully to HTTP checks. This is an availability check, not full gameplay coverage.
- Changed JavaScript syntax checks and `git diff --check` passed.

## Boundaries and remaining work

- Keep Me Posted still explicitly saves preferences on the visitor's device; a live mailing-list subscription workflow is not connected. Feedback opt-in is captured with the feedback record.
- Payment checkout remains Stripe-hosted. No charge was made during QA.
- Some video files exceed 100 MB. Deferred previews reduce unnecessary initial work; adaptive video encoding remains a separate improvement.
- This pass does not establish full gameplay, load-test, every physical device, or email-delivery coverage. No performance score is claimed.

## Deployment maintenance

Wix site: d8b26671-bc28-42b3-9a89-e82d823ca189.
Global custom embed: da03421d-57a8-432c-b5ae-b5f5e3e11bb2, named “2Fly responsive page shell”, HEAD, essential layout code, load once.
Keep its code synchronized with `wix-viewport-shell.html`. Rebuild page bundles with `node tools/build-wix-pages.cjs` when source changes, install in matching Wix HTML components, and publish. GitHub source updates alone do not update Wix's inline bundles.
