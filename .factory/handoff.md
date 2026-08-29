# Handoff — adversarial review 2

## Outcome

Wrote `.factory/review-2.md` and did not modify product code. The review verdict is **FAIL**:

- **F-1-18 (reopened):** “JSON inventory” remains unexplained on the first screen.
- **F-2-1:** the landing and Terms pages identify the paid planning pack's merchant/refund route inconsistently, without a matching claim test.

## Verification performed

- Opened the live site cold at 390px and desktop; checked the demo, routes, metadata, 404, direct install link, focus, links, and console errors.
- Confirmed demo request isolation and its `demo:recipe-library-move-check:run` storage key; exiting demo removes the key.
- In a fresh clone, ran `npm ci`, each of the 14 exact `.factory/claims.json` commands separately, `npm test` (32 browser tests), and `npm run build`. All passed.
- Read all earlier reviews, polish reports, verifier reports, and the prior handoff; rechecked F-1-01 through F-1-21 individually.

## Reproduce

    npm ci
    npm test
    npm run build

Run each `test` command in `.factory/claims.json` separately. Check the live demo at:

    https://recipe-library-move-check.sociobot.in/?demo=1

## Next steps

1. Define “JSON inventory” at its first landing-page use and retain the relevant claim test.
2. Verify the legal merchant, payment processor, and refund route. Use one consistent plain-language disclosure, add a recorded claim fixture, or remove the unsupported statements.
3. Re-run the full review after both findings are fixed.

# Previous handoff — polish round 1

## Outcome

All 21 findings in .factory/review-1.md are resolved. The static site and Rust CLI retain the handwritten migration-notebook identity. Production is deployed at https://recipe-library-move-check.sociobot.in.

The main repair commit is 597c995e8cef598599f8a50dcaf89f24dd374fab. The final supported-field fixture commit is c5cd7c0095907aaaa82ca20cfac22757ad85aebb. Both were pushed before the final deployment.

## What changed

- Added the isolated one-click /?demo=1 path with the persistent demo banner, Reset demo, and Start for real.
- Replaced the simulated transcript with a self-hosted SVG recording sourced from the real CLI demo.
- Made CLI demo fixtures compile directly from the shipped examples and tested their equivalence.
- Standardized public language on check, possible duplicate, checklist, and JSON inventory.
- Rewrote the first screen, headings, actions, README, demo guide, and copy audit.
- Added outcome tests for every visitor-reliant claim, including free use, complete folder immutability, fields, exit codes, demo equivalence, license privacy, and planning-pack contents.
- Restricted Cargo packaging to 17 consumer files. Analysis, site, test, Node, and factory files are excluded.
- Added full per-route metadata updates, canonical routes, focus restoration, genuine 404 output, legal links, and live-test configuration.
- Fixed mobile overflow and made visible controls at least 44×44 CSS pixels at 320px and 390px.
- Added the catalog description: “Check Mealie and Tandoor recipe moves for possible duplicates, missing images, and fields to review.”

The finding-by-finding map is in .factory/polish-1.md.

## Clean-clone evidence

Final clean clone: commit c5cd7c0 in /tmp/recipe-move-final-P1DCsA/repo.

- npm ci: pass; 0 vulnerabilities.
- Every one of the 14 exact commands in .factory/claims.json: pass when run separately.
- npm test: pass; strict Rust format/Clippy, TypeScript, 6 Rust tests, production build, and 32 Chromium tests.
- npm run build: pass; release CLI and dist/site produced.
- cargo package --no-verify: pass; 17 files, 53.0 KiB unpacked, 15.3 KiB compressed.
- Fresh cargo install --path . --locked: pass.
- Installed recipe-move-check demo --json: 2 moving recipes, 2 existing recipes, 1 possible duplicate, 1 missing image, 3 fields, and 2 ownership reviews.
- Installed JSON inventory preserved the fixture's Tandoor keywords and servings as tags [weeknight, family] and servings 4.
- Initial JavaScript: 15.99 KB raw / 5.77 KB gzip.
- CSS: 13.21 KB raw / 3.84 KB gzip.

Claim tests:

- @claim:sample-findings
- @claim:demo-privacy
- @claim:cli-capabilities
- @claim:free-cli
- @claim:demo-is-real-cli
- @claim:nested-export-support
- @claim:cli-local-only
- @claim:exit-codes
- @claim:supported-fields
- @claim:unknown-fields
- @claim:license-privacy
- @claim:offline-demo
- @claim:planning-pack
- @claim:crate-package

## Accessibility, browser, privacy, offline, and performance

- Axe: no serious or critical violations on /, /?demo=1, /demo, /privacy, /terms, or /missing-page.
- Semantics: every route has lang=en, one h1, one main, header/nav/footer landmarks, image alt text, and route-specific metadata.
- Keyboard: skip link first, primary action reachable with Tab/Enter, route h1 focused and announced after navigation and Back.
- Responsive: no overflow and no visible target below 44×44 CSS pixels at 320px or 390px.
- Reduced motion: page motion is removed and the SVG exposes its own reduced-motion rule.
- Privacy: demo requests stay same-origin and use only demo:recipe-library-move-check:run. Leaving removes it.
- Licensed fixture: exactly one GET reaches the Sociobot verify endpoint with only the license query value and no request body.
- Offline: cold /?demo=1 becomes service-worker controlled, reloads offline, and replays the cached SVG.
- Local Lighthouse home: performance 100, accessibility 100, best practices 100, SEO 100; LCP 1.6 s, CLS 0, TBT 30 ms.
- Live Lighthouse /?demo=1: performance 100, accessibility 100, best practices 100, SEO 100; LCP 0.8 s, CLS 0, TBT 0 ms.

## Deployment and cold live verification

Deployment command:

    /opt/fleet/lib/deploy-static.sh recipe-library-move-check dist/site

Final Azure Static Web Apps deployment e7999b7d-2522-4a0f-9c7e-823e8ca4a42d succeeded in centralus.

- GET /, /?demo=1, /demo, /privacy, /terms, and /terminal-recording.4a32d1.svg: 200.
- GET /missing-page: 404 with the styled recovery page.
- Live index SHA-256 equals dist/site/index.html: b23f1323a075337083962e11972eb38046cd8e31e083094c4c05c70953f9eae6.
- Factory verify-url: pass; 923 ms, no console errors, title/lang/main/h1/alt/button checks pass.
- Full Playwright suite against PLAYWRIGHT_BASE_URL=https://recipe-library-move-check.sociobot.in: 32 passed.
- CSP, HSTS, nosniff, referrer policy, permissions policy, immutable asset caching, and no-cache service-worker policy are present.
- Production planning-pack checkout returns 303 to hosted checkout. Invalid verification returns valid=false and reason=invalid.

Live evidence:

- .factory/live-verification/verify.json
- .factory/live-verification/screenshot-desktop.png
- .factory/live-verification/screenshot-mobile.png
- .factory/screenshots/polish-1-demo-desktop.png
- .factory/screenshots/polish-1-404-desktop.png

## Run and verify

    npm ci
    npm test
    npm run build
    cargo package --no-verify
    PLAYWRIGHT_BASE_URL=https://recipe-library-move-check.sociobot.in npx playwright test

## Known gaps and next steps

None within this work order. Registry publishing remains a factory release action; no package was published here.
