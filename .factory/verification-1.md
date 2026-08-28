# Independent verification 1 — FAIL

**Candidate:** `bdbb3a0f2182f2e3c64787a9e2733ed965679114`  
**Live URL:** `https://recipe-library-move-check.sociobot.in`  
**Verified:** 28 August 2026 (UTC)  
**Decision:** **FAIL — do not release.**

## First-read test

Cold-opening the live home page answered the required questions in plain words:

- It checks a Mealie-to-Tandoor recipe-library move for collisions, missing images, and fields needing review.
- It is for households moving between those recipe systems.
- The first action is the visible **“Try it with sample data”** link, which says it shows a completed preflight in one click.

This part passes. The demo opened directly at `/demo`, showed realistic fixed findings, and carries a persistent demo banner with Reset demo and Start for real.

## Required claim tests from a clean clone

Created a fresh detached clone at the candidate SHA, ran `npm ci`, then ran every exact command in `.factory/claims.json`. All passed:

| Claim | Exact command | Result |
| --- | --- | --- |
| sample-findings | `npm test -- --grep @claim:sample-findings` | PASS |
| demo-privacy | `npm test -- --grep @claim:demo-privacy` | PASS |
| cli-output | `npm test -- --grep @claim:cli-output` | PASS |
| offline-demo | `npm test -- --grep @claim:offline-demo` | PASS |
| planning-pack | `npm test -- --grep @claim:planning-pack` | PASS (recorded API fixture) |

The claim tests use the demo entry points as required. The offline demo claim passed after service-worker activation and offline reload.

## Local build, package, and CLI checks

- `npm test`: PASS — 5 Rust unit tests, Rust doc tests, production-site build, and 12 Chromium tests passed.
- `npm run build`: PASS — release CLI and `dist/site` built.
- `cargo package --allow-dirty --no-verify`: PASS — 22 files, 25.8 KiB compressed crate.
- Clean consumer: `cargo install --path . --root <fresh-temp-root>` then `recipe-move-check demo --json`: PASS; observed `{source_recipes:2, destination_recipes:2, collisions:1, missing_images:1, unmapped_fields:3, ownership_reviews:2}`.
- CLI normal/boundary recovery: PASS. An empty destination returned exit 0 and wrote nested report/inventory with zero collisions. Missing source folder, unsupported `paprika:` system, and malformed-only source each returned exit 2 with actionable text.
- `cargo fmt --check`: PASS.
- `cargo clippy --all-targets -- -D warnings`: **FAIL** at `src/lib.rs:274`, `clippy::unnecessary_sort_by` (suggests `sort_by_key`).

## Live deployment and browser checks

- Candidate match: PASS. SHA-256 of live `/` and local `dist/site/index.html` was identical: `d5a13b56a7cb72333256c8ce1bedf413ffba90ca1d85532a69c59c5108df58c1`.
- Desktop live routes `/`, `/demo`, `/privacy`, `/terms`, and `/missing-page`: each rendered one `<h1>` and one `<main>`; no console/page errors; axe serious/critical findings: none.
- Keyboard: PASS. Skip link and primary sample link receive focus; primary focus outline was a visible 3px solid outline; Enter reached `/demo`. Leaving demo removed `demo:recipe-library-move-check:run`.
- Reduced motion: PASS. Live `/demo` computed animation and transition durations of `0.00001s` under `prefers-reduced-motion: reduce`.
- Privacy/network: PASS for normal demo flow. Replay and Reset at `/demo` made requests only to `https://recipe-library-move-check.sociobot.in`; localStorage contained only `demo:recipe-library-move-check:run`.
- Response policy: PASS for the live site. HSTS, `nosniff`, strict referrer policy, permissions policy, and CSP were present. License verification accepted the live origin in CORS and used `Cache-Control: no-store`.
- Rate limit: PASS. A sequential burst to `GET /api/v1/products/recipe-library-move-check/verify?license=qa-rate-check` returned 200 for requests 1–30, then 429 beginning at request 31 with `Retry-After: 3` (then 2).
- Bundle budget: PASS. Candidate build reported 15.95 KB raw JavaScript (5.83 KB gzip) and 12.48 KB raw CSS (3.70 KB gzip); below the static-product budgets.

## Release-blocking defects

### High — paid checkout is unavailable in production

The live **Buy the planning pack** target is:

`https://api.sociobot.in/api/v1/products/recipe-library-move-check/checkout`

Fresh GET on 28 August returned **HTTP 404** with `{"error":"enabled factory product","status":404}`. The live site promises a $19 one-time planning pack, but a visitor cannot begin checkout. The recorded-fixture claim test does not establish the production billing integration. Register/enable the production product and reverify the complete redirect/return/license-download path.

### High — the required 390px demo has horizontal overflow

At a 390×844 viewport, live `/demo` had `document.documentElement.scrollWidth = 482` and `clientWidth = 390`. Both the findings ledger and sample terminal were 468px wide. This violates the mobile acceptance requirement and leaves the core one-click demonstration horizontally clipped. Fix and add a 390px `/demo` regression test.

### High — claim inventory is incomplete, contrary to the claims contract

The live landing page and README make visitor-reliant claims without a corresponding `.factory/claims.json` entry and observable demo test. Examples include “Recipes stay on your computer,” “No account is needed,” “The CLI reads export folders and writes only the files you name,” “It does not connect to servers,” and “It never uploads recipe data.” The current `demo-privacy` test covers only the browser sample and its localStorage key, not the CLI claims. The claims skill explicitly makes this a failed review until the claims are tested or removed.

## Other defects

### Medium — CLI can read an arbitrary absolute image path outside chosen exports

Using a source export JSON containing `{"name":"Outside image probe","image":"/etc/hostname"}`, the CLI completed and emitted inventory image status `present` with a SHA-256 hash. `inspect_image` accepts absolute image paths (and relative paths are not constrained to the export root), despite product copy saying it reads the export folders chosen by the user. Constrain image resolution to canonical paths within the selected export directory, or make any exception explicit and consented to.

### Medium — unknown routes return HTTP 200 instead of a real 404

`GET /missing-page` displays the styled fallback but returns HTTP 200. The stated site contract requires a real 404 route. The navigation fallback is intercepting it before the configured response override. Preserve the styled page while returning status 404 for genuinely missing paths.

### Medium — footer’s external “Built by Param Factory” link has a TLS failure

The live footer points to `https://www.sociobot.in/`. A fresh HTTPS request fails certificate validation: `no alternative certificate subject name matches target host name 'www.sociobot.in'`. Use the valid canonical host or repair its certificate. This is a dead outbound link from the product.

### Low — static asset caching is only 30 seconds

`/notebook-migration.webp`, `/og-image.webp`, `/favicon.svg`, `/robots.txt`, and `/sitemap.xml` all return `Cache-Control: public, must-revalidate, max-age=30`. This does not meet the stated long-lived immutable caching policy for deployable static assets. Version/hash assets and send an appropriately long immutable cache policy.

### Low — strict Rust lint is not clean

`cargo clippy --all-targets -- -D warnings` fails on `clippy::unnecessary_sort_by` at `src/lib.rs:274`. Add the lint to the supported quality gate and resolve it before release.

## Retest checklist

1. Enable the Sociobot production product and prove live checkout, return-token storage, verification, and planning-pack download.
2. Fix `/demo` at 390px and test both `/` and `/demo` for no horizontal overflow.
3. Complete `.factory/claims.json` and demo-observable tests for every remaining privacy, local-only, and pricing claim.
4. Restrict CLI file reads to selected export roots; add a traversal/absolute-path regression test.
5. Return actual 404 status, repair the footer URL, set static cache policy, and make Clippy clean.
