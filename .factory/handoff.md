# Repair handoff — Recipe Library Move Check

## Status

Repair commit: recorded in git after this handoff update. The Rust CLI, static product site, claims contract, and deployment configuration are buildable and verified locally. The one remaining release dependency is Sociobot production billing registration for `recipe-library-move-check`; the live checkout endpoint still returns its documented 404 and cannot be enabled from this repository.

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
- `npm test`: passed: strict format/Clippy, TypeScript check, 6 Rust tests, and 15 Chromium browser tests.
- Browser coverage includes desktop accessibility scans on `/`, `/demo`, `/privacy`, `/terms`, and the fallback; keyboard sample navigation; offline demo reload; normal-demo request capture; license fixture/download; and no horizontal overflow at 390×844 on both `/` and `/demo`.
- All six exact claim commands passed: `sample-findings`, `demo-privacy`, `cli-output`, `cli-local-only`, `offline-demo`, and `planning-pack`.
- `npm run build`: passed. Latest site bundle: 15.82 KB JavaScript raw / 5.75 KB gzip and 12.76 KB CSS raw / 3.76 KB gzip.
- `cargo package --allow-dirty --no-verify`: passed; `target/package/recipe-library-move-check-0.1.0.crate` is 43 KB.
- Clean consumer installation passed. `recipe-move-check demo --json` returned 2 source recipes, 2 destination recipes, 1 collision, 1 missing image, 3 unmapped fields, and 2 ownership reviews.
- Live pre-repair billing reproduction on 28 August 2026: `GET https://api.sociobot.in/api/v1/products/recipe-library-move-check/checkout` returned HTTP 404 with `{"error":"enabled factory product","status":404}`. `https://sociobot.in` returns HTTP 200; the former `www` target fails certificate validation.

## Remaining factory action

The researched brief specifies a one-time paid option. Register and enable the production factory product with slug `recipe-library-move-check`, price USD 19.00, and return URL `https://recipe-library-move-check.sociobot.in/?license=<token>`. Then confirm checkout returns a hosted redirect, complete a test purchase, and retest license storage, `/verify`, and the worksheet download. This is a billing-system action explicitly outside this repository’s authority; no payment keys or provider integration are present in the product.
