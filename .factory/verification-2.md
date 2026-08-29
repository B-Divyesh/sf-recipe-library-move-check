# Independent verification 2 — FAIL

**Candidate:** `7b584eecbf483a2b5e958f186676cf609e438608`  
**Live URL:** `https://recipe-library-move-check.sociobot.in`  
**Verified:** 29 August 2026 (UTC)  
**Decision:** **FAIL — do not release until the production paid checkout is enabled.**

## First-read test

A cold live-page visit passed the plain-language first-read requirement. It says the product **checks a recipe move before importing**, says it is **for households moving between Mealie and Tandoor**, and puts **Try it with sample data** on the first screen beside “See a completed preflight in one click.” One Enter/click opens `/demo`, immediately showing the fixed, realistic findings: one collision, one missing image, and three fields to review. The persistent banner says “Demo — sample data, nothing is saved” and has Reset demo and Start for real.

## Required claims gate

From this checkout I ran `npm ci`, then every exact command in `.factory/claims.json`, separately, through its stipulated demo entry point. All passed. (Before `npm ci`, the first command stopped at the expected clean-checkout missing dependency `tsc: not found`; this was installation state, not a product test result.)

| Claim | Exact command | Result |
| --- | --- | --- |
| `sample-findings` | `npm test -- --grep @claim:sample-findings` | PASS |
| `demo-privacy` | `npm test -- --grep @claim:demo-privacy` | PASS |
| `cli-output` | `npm test -- --grep @claim:cli-output` | PASS |
| `cli-local-only` | `npm test -- --grep @claim:cli-local-only` | PASS |
| `offline-demo` | `npm test -- --grep @claim:offline-demo` | PASS |
| `planning-pack` | `npm test -- --grep @claim:planning-pack` | PASS, recorded verification fixture |

## Local build and CLI evidence

- `npm test`: **PASS** — strict Rust format/Clippy, TypeScript check, six Rust unit tests, production-site build, and 15 Chromium tests.
- `npm run build`: **PASS** — release CLI and `dist/site` produced.
- `cargo package --allow-dirty --no-verify`: **PASS** — 50.5 KiB compressed crate.
- Clean consumer install: **PASS** — `cargo install --path . --root <fresh temp>` installed the public binary. `recipe-move-check demo --json` produced 2 source recipes, 2 destination recipes, 1 collision, 1 missing image, 3 unmapped fields, and 2 ownership reviews, with both report and neutral inventory paths.
- Normal/boundary/recovery: **PASS** — an empty destination wrote nested requested outputs and reported zero collisions. Missing source folder, unsupported `paprika:` system, and malformed-only export each exited 2 with actionable messages.
- Local-only boundary: source image paths outside the selected export are classified `outside_export` with no hash; the regression unit test passes.

## Deployment, browser, privacy, and PWA evidence

- **Candidate match: PASS.** SHA-256 of live `/` and local `dist/site/index.html` is identical: `e86df0497ffbfb12fd88922f225b53838dcce3695f01e5fc69a0cd0f8a53dd55`.
- Live desktop and 390×844 Chromium checks on `/`, `/demo`, `/privacy`, `/terms`, and an unknown route: each page had exactly one `<h1>` and one `<main>`; all normal routes returned 200; unknown route returned 404; no horizontal overflow; axe serious/critical findings: none. The sole expected console error was the deliberately visited unknown route’s 404; normal product and demo flows had no console or page errors.
- Keyboard: **PASS.** Tab first focuses the skip link, then the visible primary sample action; its computed focus ring is a 3px high-contrast outline. Enter opens `/demo`.
- Reduced motion: **PASS.** `/demo` under `prefers-reduced-motion: reduce` uses the site’s near-zero (`0.00001s`) motion duration.
- Privacy: **PASS for the normal demo flow.** Cold `/demo`, Replay run, and Reset demo requested only `https://recipe-library-move-check.sociobot.in`; localStorage contained only `demo:recipe-library-move-check:run`. A browser license-token probe sent only the token to the documented Sociobot verification endpoint; it returned CORS `Access-Control-Allow-Origin: https://recipe-library-move-check.sociobot.in` and `Cache-Control: no-store`.
- Headers: **PASS.** Live responses include HSTS, `nosniff`, strict referrer policy, permissions policy, and a CSP with `frame-ancestors 'none'`. JS/CSS/versioned visual assets have `public, max-age=31536000, immutable`; `sw.js` has `no-cache`.
- PWA: **PASS.** Service worker `/sw.js` controlled the page using cache `recipe-move-check-v5`; `registration.update()` completed; after the first `/demo` visit, an offline reload displayed “Review a recipe move with sample data” with no errors.
- Budget: **PASS.** Production build reports 15.82 KB raw JavaScript (5.75 KB gzip), 12.76 KB raw CSS (3.76 KB gzip), and 146.3 KB hero WebP; all are below the stated static budgets.
- Server allowance: **PASS.** A single-client sequential probe of `GET /api/v1/products/recipe-library-move-check/verify?license=qa-rate-limit-probe` returned 200 for requests 1–30 and 429 for 31–35, each with `Retry-After: 3`. Observed allowance: **30 requests per window**.

## Release-blocking defect

### High — the promised production paid checkout is unavailable

Fresh request on 29 August:

```text
GET https://api.sociobot.in/api/v1/products/recipe-library-move-check/checkout
HTTP 404
{"error":"enabled factory product","status":404}
```

The live page advertises a one-time $19 planning pack and its “Buy the planning pack” link targets this endpoint, but a visitor cannot start checkout. The claim test only stubs `/verify`; it cannot establish production checkout/return/download. This violates the paid-unlock contract and is a release blocker even though the free local CLI works.

**Required external action:** enable/register the factory production product for slug `recipe-library-move-check` at USD 19 with return URL `https://recipe-library-move-check.sociobot.in/?license=<token>`, then recheck hosted checkout redirect, return-token storage, live verification, and worksheet download.

## Non-blocking packaging finding

### Low — crate includes repository-analysis and website development files

The ready-to-publish crate includes `graphify-out/**`, `package.json`, `package-lock.json`, `playwright.config.ts`, and `scripts/copy-404.mjs`, in addition to the CLI files and examples. It still builds and installs correctly, but this unrelated material inflates a CLI crate to 50.5 KiB compressed and should be excluded before registry publishing.

## Retest

1. Enable the Sociobot production product and complete one real end-to-end purchase/return/download check.
2. Exclude `graphify-out/` and web-only development files from Cargo packaging before publish (non-blocking for the deployed free CLI).
