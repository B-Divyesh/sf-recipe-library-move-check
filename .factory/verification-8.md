# Independent product verification 8

**Decision: PASS**

**Candidate:** `f1dbc321a9b04cc8d392d051c421d98dea0ac67f`  
**Live URL:** <https://recipe-library-move-check.sociobot.in>  
**Verified:** 29 August 2026 UTC  
**Work order:** `recipe-library-move-check-verify-8`

The candidate meets the researched brief: it is a local Rust command-line preflight checker for households moving between Mealie and Tandoor. It inventories selected exports and writes a reviewable checklist/JSON inventory before import, identifying possible duplicates, missing images, fields to review, and ownership/family-access reminders. No product code was changed during this verification.

## Release gates

### First-read and one-click demo: PASS

A fresh desktop browser context opened the live landing page cold. Its first screen plainly says:

- **What it does:** “Check your recipe move before importing.”
- **For whom:** “For households moving between Mealie and Tandoor who need a checklist before importing the family library.”
- **What to do first:** “Try it with sample data,” followed by “See a completed check in one click.”

The action was visible at both `1440×900` and `390×844`. One activation opened `/?demo=1` with a persistent **“Demo — sample data, nothing is saved”** banner, Reset demo, Start for real, and completed results: 1 possible duplicate, 1 missing image, and 3 fields to review. The first-read/demo gate passes.

### Claims gate: PASS

I made a clean GitHub clone detached at the exact candidate (`/tmp/recipe-library-move-check-qa.IUT7qM`), installed with `npm ci` (24 packages, 0 reported vulnerabilities), and ran every command in `.factory/claims.json` separately and exactly as declared. All 22 passed. Individual logs are under `/tmp/recipe-library-move-check-qa.IUT7qM/qa-logs/claims-rerun/`.

| Claim | Result |
| --- | --- |
| `sample-findings` | PASS |
| `demo-privacy` | PASS |
| `one-click-demo` | PASS |
| `cli-capabilities` | PASS |
| `free-cli` | PASS |
| `demo-is-real-cli` | PASS |
| `nested-export-support` | PASS |
| `cli-local-only` | PASS |
| `safe-output-paths` | PASS |
| `exit-codes` | PASS |
| `partial-read-warnings` | PASS |
| `family-review-empty-state` | PASS |
| `supported-fields` | PASS |
| `unknown-fields` | PASS |
| `license-privacy` | PASS |
| `cached-license-notice` | PASS |
| `button-focus-contrast` | PASS |
| `offline-demo` | PASS |
| `planning-pack` | PASS |
| `billing-roles` | PASS |
| `crate-package` | PASS |
| `install-command` | PASS |

The landing page and README claim-like statements map to this manifest; no unlisted visitor-reliant claim was found. The repository does not provide the referenced `verify-url.sh`; equivalent live title/language/main/alt/console checks were run directly with Playwright.

## Local build, tests, package, and CLI: PASS

- `npm test`: PASS — format, Clippy with warnings denied, TypeScript, 13 Rust tests, site build, and **44 Playwright tests** passed. Log: `/tmp/recipe-library-move-check-qa.IUT7qM/qa-logs/full-npm-test.log`.
- `npm run build`: PASS — optimized release CLI plus `dist/site/`. Log: `/tmp/recipe-library-move-check-qa.IUT7qM/qa-logs/production-build.log`.
- Built assets: JavaScript 16.31 kB raw / **5.81 kB gzip**; CSS 13.59 kB raw / **3.91 kB gzip**, both within budget.
- `cargo package --allow-dirty --no-verify --list`: PASS — 17 consumer files only (source, Cargo metadata, README, changelog, MIT license, and shipped examples); no site, tests, or factory files.
- The public release binary's `--help` documented `check` and `demo`. `recipe-move-check demo --json` ran locally and produced two source/two destination recipes, one possible duplicate (name, ingredients, and image-hash evidence), one missing image, three unmapped fields, two ownership reviews, and output paths. The claim's isolated exact published `cargo install --git …` test also passed.

## Live deployment identity, privacy, and operational checks: PASS

- Fresh candidate build checksums matched production byte-for-byte for HTML, hashed JS/CSS, images, terminal recording, service worker, robots, sitemap, and route HTML. The live deployment is this candidate.
- `/`, `/demo`, `/privacy`, and `/terms` returned 200; an unknown route returned a real styled 404. Valid routes had route-specific titles, `lang="en"`, exactly one `h1`, one `main`, no page errors, and no console errors. The deliberately requested 404 produced the browser's expected failed-resource console message only.
- A live 1440px/390px Playwright audit found zero axe serious/critical violations on all public routes. No horizontal mobile overflow; the sample action measured 265×53 CSS px. Keyboard focus begins at the skip link, focused controls show a 3px solid outline and a contrasting 6px ring, and Enter on the sample action opened demo mode. With reduced motion, transition/animation durations were `0.00001s` and scrolling was auto.
- Visual inspection passed for `/tmp/recipe-live-desktop.png` and `/tmp/recipe-live-mobile.png`; no clipping or overlap was observed.
- The demo request log contained only same-origin GETs (page, self-hosted SVG, and self-hosted image), no analytics/tracker/CDN request, and no sample recipe data. It used `demo:recipe-library-move-check:run`; Start for real removed that key. Service worker control activated and `/?demo=1` reloaded successfully while offline. The worker uses versioned cache `recipe-move-check-v7`, `skipWaiting`, `clients.claim`, and removes old named caches on activate.
- Response headers include HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, restricted camera/microphone/geolocation permissions, and a response-header CSP with `frame-ancestors 'none'`. HTML cache is `max-age=30`; hashed assets are one-year immutable; `sw.js` is `no-cache`.
- No sign-in is offered or required, so the Entra tenant requirement does not apply.

## Billing allowance: PASS

The optional license verification route was exercised with invalid tokens from one client. Requests 1–30 returned HTTP 200 with the expected invalid verdict. Request 31 returned **HTTP 429** and **`Retry-After: 1`**. Observed allowance: **30 successful verification requests per active rate window**. The browser's documented license request uses only the token query value and the Sociobot verification origin; its recorded claim test passed.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

## Final result

**PASS — candidate `f1dbc321a9b04cc8d392d051c421d98dea0ac67f` is release-ready at the tested production URL.**
