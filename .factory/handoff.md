# Repair handoff — recipe-library-move-check polish 3

## Outcome

All cumulative review findings are repaired and deployed. The product remains a Rust `clap` command-line checker with a Vite static documentation/demo site.

- Repair commits: `bd34c1bd13afb9049d84a5ee6059622b37fd237b` and `d724b361667ca2dd490c0d3ce5fa68efcec9ab98`
- Production deployment: `c93e988f-203e-458e-a57d-6688c0eb302a` in `centralus`
- Live site: <https://recipe-library-move-check.sociobot.in>

## What changed

- Repaired public package terminology in Cargo metadata and changelog, with a regression test for the required plain terms.
- Rewrote every flagged README sentence and connected human terms to `--source`, `--destination`, `--report`, and `--inventory`.
- Replaced visitor-facing “CLI” jargon with “command-line checker” on first use.
- Added `one-click-demo` and `install-command` claims, each with an observable outcome test.
- Brought the complete three-fact first screen above the fold at 1440×900 and added a regression test.
- Made the 404 route literal and consistent: **Page not found — Recipe Library Move Check**.
- Updated the catalog sentence: “Check Mealie and Tandoor recipe exports for issues before importing a family library.”
- Preserved the handwritten migration-lab notebook visual system and its original local assets.

## Verify locally

```sh
npm ci
npm test
npm run build
cargo package --allow-dirty --no-verify --list
```

`npm test` passed locally: cargo format/clippy, TypeScript, 13 Rust tests, site build, and 44 Playwright tests. The built site is `dist/site/`; its initial JS is 16.31 kB (5.81 kB gzip) and CSS is 13.59 kB (3.91 kB gzip).

## Clean-clone claim evidence

A fresh GitHub clone at `d724b36` was installed with `npm ci`, then ran every exact `claims.json` command separately. All 22 passed:

`sample-findings`, `demo-privacy`, `one-click-demo`, `cli-capabilities`, `free-cli`, `demo-is-real-cli`, `nested-export-support`, `cli-local-only`, `safe-output-paths`, `exit-codes`, `partial-read-warnings`, `family-review-empty-state`, `supported-fields`, `unknown-fields`, `license-privacy`, `cached-license-notice`, `button-focus-contrast`, `offline-demo`, `planning-pack`, `billing-roles`, `crate-package`, and `install-command`.

## Production verification

- Cold URL verifier: PASS — 200 in 784 ms; no console/page errors; title, `lang=en`, one h1, one main, complete alt text, and labeled buttons. See `.factory/live-verification-3/post-redeploy/verify.json`.
- Route checks: `/`, `/demo`, `/privacy`, `/terms`, `/robots.txt`, and `/sitemap.xml` returned 200; `/missing-page` returned 404.
- Live browser suite: PASS — `PLAYWRIGHT_BASE_URL=https://recipe-library-move-check.sociobot.in npx playwright test`, 44/44. This includes axe, keyboard/focus, metadata, real 404, 320/390 mobile layout, demo isolation/reset, privacy, and offline reload.
- Lighthouse mobile for `/?demo=1`: Performance 100, Accessibility 100, LCP 0.8 s, CLS 0. See `.factory/live-verification-3/lighthouse-mobile.json`.
- Screenshots: `.factory/live-verification-3/post-redeploy/screenshot-desktop.png` and `.factory/live-verification-3/post-redeploy/screenshot-mobile.png`.

## Packaging and deployment

The consumer crate is ready to publish but was not published here. Use `cargo package` for a final archive and let the factory publish it. The static deployment command was:

```sh
npm ci && npm run build:site
/opt/fleet/lib/deploy-static.sh recipe-library-move-check dist/site
```

## Known gaps

None. The tool intentionally does not import recipes, sync servers, or require an AI feature; those are outside the brief.
