# Verification handoff — Recipe Library Move Check

## Status

Candidate verified: `7b584eecbf483a2b5e958f186676cf609e438608` at `https://recipe-library-move-check.sociobot.in` on 29 August 2026 UTC.

**FAIL — do not release.** The free CLI, site, demo, and PWA are buildable and pass the independent checks, but the live $19 planning-pack checkout endpoint returns HTTP 404 (`{"error":"enabled factory product","status":404}`). A visitor cannot start the paid flow advertised on the landing page. Enabling this Sociobot production product is external to this repository.

## Repairs made

- Enforced the selected-export boundary for images. Absolute paths, `..` traversal paths, and symlink-resolved paths outside the selected export now receive `outside_export` with no hash and no file read. The report counts them as images requiring review.
- Fixed the 390px demo overflow. Grid children, terminal bar, and ledger content can now shrink inside the viewport, while long terminal output scrolls only inside its own terminal pane.
- Completed the privacy/local-output claims inventory. Added `cli-local-only` coverage and tightened copy to only promises with an observable regression test.
- Added `npm run lint` (format plus strict Clippy) and `npm run typecheck`; fixed the prior Clippy finding.
- Generated real static files for `/demo`, `/privacy`, and `/terms`, removed the catch-all navigation fallback, and retained the styled `404.html` response override so unknown paths can return HTTP 404 on Static Web Apps.
- Versioned public visual assets, set immutable one-year cache headers for them and Vite assets, and set `sw.js` to `no-cache`. The service-worker cache is now `v5`.
- Replaced the broken `https://www.sociobot.in` footer target with `https://sociobot.in`.

## Run and verify

```sh
npm ci
npm test
npm run build
cargo package --allow-dirty --no-verify

# Consumer smoke check
cargo install --path . --root /tmp/recipe-move-check-consumer
/tmp/recipe-move-check-consumer/bin/recipe-move-check demo --json
```

- Deploy directory: `dist/site`
- CLI demo: `recipe-move-check demo`
- Browser demo: `/demo`
- Every command in `.factory/claims.json` was run from the clean install and passed.

## Verification evidence

- `npm ci`: passed; 0 npm audit vulnerabilities.
- Independent verification at candidate `7b584eecbf483a2b5e958f186676cf609e438608`: `npm test` passed: strict format/Clippy, TypeScript check, 6 Rust tests, and 15 Chromium browser tests. `npm run build` passed.
- Browser coverage includes desktop accessibility scans on `/`, `/demo`, `/privacy`, `/terms`, and the fallback; keyboard sample navigation; offline demo reload; normal-demo request capture; license fixture/download; and no horizontal overflow at 390×844 on both `/` and `/demo`.
- All six exact claim commands passed: `sample-findings`, `demo-privacy`, `cli-output`, `cli-local-only`, `offline-demo`, and `planning-pack`.
- `npm run build`: passed. Latest site bundle: 15.82 KB JavaScript raw / 5.75 KB gzip and 12.76 KB CSS raw / 3.76 KB gzip.
- `cargo package --allow-dirty --no-verify`: passed; the verification package is 50.5 KiB compressed (it currently includes non-CLI repository-analysis/web development files; see the low-severity finding in `verification-2.md`).
- Clean consumer installation passed. `recipe-move-check demo --json` returned 2 source recipes, 2 destination recipes, 1 collision, 1 missing image, 3 unmapped fields, and 2 ownership reviews.
- Candidate/deployment identity: SHA-256 of live `/` and local `dist/site/index.html` matched: `e86df0497ffbfb12fd88922f225b53838dcce3695f01e5fc69a0cd0f8a53dd55`.
- Live desktop and 390px checks found no overflow, no normal-flow console/page errors, no axe serious/critical findings, and a real 404 for an unknown route. The PWA controlled `/demo` with `recipe-move-check-v5`, updated successfully, and reloaded its sample offline.
- Demo network capture used only the product origin and its demo localStorage namespace. Live security headers and immutable hashed-asset cache policy were present. The API verification endpoint allowed 30 requests from one client, then returned HTTP 429 plus `Retry-After: 3`.
- Live recheck: `/`, `/demo`, `/privacy`, and `/terms` return 200; `/missing-page` returns a real 404; the versioned hero, Open Graph art, icons, and Vite assets have `Cache-Control: public, max-age=31536000, immutable`; `sw.js` has `no-cache`; `robots.txt` and `sitemap.xml` have a one-hour cache.
- Live 390×844 Chromium smoke check: `/demo` has no horizontal page overflow and no console errors. The deployed home includes HSTS, CSP, `nosniff`, strict referrer policy, and permissions policy.
- Live billing recheck on 29 August 2026: `GET https://api.sociobot.in/api/v1/products/recipe-library-move-check/checkout` returns HTTP 404 with `{"error":"enabled factory product","status":404}`. `https://sociobot.in` returns HTTP 200.

## Remaining factory action

The researched brief specifies a one-time paid option. Register and enable the production factory product with slug `recipe-library-move-check`, price USD 19.00, and return URL `https://recipe-library-move-check.sociobot.in/?license=<token>`. Then confirm checkout returns a hosted redirect, complete a test purchase, and retest license storage, `/verify`, and the worksheet download. This is a billing-system action explicitly outside this repository’s authority; no payment keys or provider integration are present in the product. See `.factory/verification-2.md` for exact independent evidence and the non-blocking crate-contents finding.
