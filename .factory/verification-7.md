# Independent product verification 7

**Decision: PASS**

**Candidate:** `03eae74c090ac780c80dfa97a6f755916753a9ab`

**Live URL:** <https://recipe-library-move-check.sociobot.in>

**Verified:** 29 August 2026 UTC

**Work order:** `recipe-library-move-check-verify-7`

The candidate satisfies the researched brief and factory acceptance contract. The previous deployment-only checkout failure is not present: the production checkout now returns HTTP 303 to hosted Dodo checkout. No product code was changed during verification.

## First-read and demo release gate

A new desktop browser context opened the live `/` with no stored state. The first viewport says:

- What it does: **“Check your recipe move before importing.”**
- Who it is for: **“For households moving between Mealie and Tandoor who need a checklist before importing the family library.”**
- What to do first: **“Try it with sample data.”**

The action was visible without scrolling at desktop (`1440×900`) and mobile (`390×844`, top `479.8px`, height `53.3px`). One click opened `/?demo=1` with completed findings and the persistent **“Demo — sample data, nothing is saved”** banner. Reset retained only the isolated `demo:recipe-library-move-check:run` key. **Start for real** removed that key and opened `/#install`. The entire sample flow made only same-origin GET requests and produced no console or page errors.

Result: **PASS**.

## Claims gate

Verification used a fresh clone detached at the exact candidate: `/tmp/recipe-qa-XCJWpI`. `npm ci` installed 24 packages with zero reported vulnerabilities. Every command from `.factory/claims.json` was run separately and exactly as declared after installation. All 20 passed.

| Claim | Result | Evidence |
| --- | --- | --- |
| `sample-findings` | PASS | `/tmp/recipe-claim-logs-clean/sample-findings.log` |
| `demo-privacy` | PASS | `/tmp/recipe-claim-logs-clean/demo-privacy.log` |
| `cli-capabilities` | PASS | `/tmp/recipe-claim-logs-clean/cli-capabilities.log` |
| `free-cli` | PASS | `/tmp/recipe-claim-logs-clean/free-cli.log` |
| `demo-is-real-cli` | PASS | `/tmp/recipe-claim-logs-clean/demo-is-real-cli.log` |
| `nested-export-support` | PASS | `/tmp/recipe-claim-logs-clean/nested-export-support.log` |
| `cli-local-only` | PASS | `/tmp/recipe-claim-logs-clean/cli-local-only.log` |
| `safe-output-paths` | PASS | `/tmp/recipe-claim-logs-clean/safe-output-paths.log` |
| `exit-codes` | PASS | `/tmp/recipe-claim-logs-clean/exit-codes.log` |
| `partial-read-warnings` | PASS | `/tmp/recipe-claim-logs-clean/partial-read-warnings.log` |
| `family-review-empty-state` | PASS | `/tmp/recipe-claim-logs-clean/family-review-empty-state.log` |
| `supported-fields` | PASS | `/tmp/recipe-claim-logs-clean/supported-fields.log` |
| `unknown-fields` | PASS | `/tmp/recipe-claim-logs-clean/unknown-fields.log` |
| `license-privacy` | PASS | `/tmp/recipe-claim-logs-clean/license-privacy.log` |
| `cached-license-notice` | PASS | `/tmp/recipe-claim-logs-clean/cached-license-notice.log` |
| `button-focus-contrast` | PASS | `/tmp/recipe-claim-logs-clean/button-focus-contrast.log` |
| `offline-demo` | PASS | `/tmp/recipe-claim-logs-clean/offline-demo.log` |
| `planning-pack` | PASS | `/tmp/recipe-claim-logs-clean/planning-pack.log` |
| `billing-roles` | PASS | `/tmp/recipe-claim-logs-clean/billing-roles.log` |
| `crate-package` | PASS | `/tmp/recipe-claim-logs-clean/crate-package.log` |

Landing-page and README claim-like statements map to the declared claims. I found no unlisted visitor-reliant claim.

## Clean checkout gates and production build

- `npm test`: **PASS**. Rust format and Clippy with warnings denied passed; TypeScript passed; 13 Rust tests passed; the site production build passed; 40 Playwright tests passed.
- `npm run build`: **PASS**. It built the optimized release CLI and `dist/site/`.
- Site output: JS `16.23 kB` raw / `5.81 kB` gzip; CSS `13.46 kB` raw / `3.89 kB` gzip; hero WebP `146,292` bytes. These are below the 200 kB JS, 50 kB CSS, and 300 kB mobile-hero budgets.
- The clean candidate clone remained unmodified after the gates.

Logs: `/tmp/recipe-full-test.log` and `/tmp/recipe-full-build.log`.

## CLI package and end-to-end behavior

`cargo package --locked` passed and verified a 17-file consumer package, 85.3 KiB unpacked / 21.4 KiB compressed. The package contains the CLI source, Cargo metadata, README, changelog, MIT license, and examples; it excludes site, browser-test, factory, and analysis files.

I unpacked that `.crate` and installed it offline with `cargo install --path <unpacked-crate> --root <fresh-root> --locked --offline`. The installed public binary reported version `0.1.0`, had useful `--help`, and ran `demo --json` without an account, license, or reachable registry. It wrote both promised outputs and returned:

- 2 moving recipes and 2 existing recipes;
- 1 possible duplicate, with normalized-name, ingredient-list, and image-hash evidence;
- 1 missing image;
- 3 unmapped fields;
- 2 ownership reviews;
- no completeness warnings.

Independent installed-binary cases:

- Normal shipped Mealie-to-Tandoor check: exit `0`; Markdown and JSON outputs written.
- Empty source: exit `2`; actionable “no recipes were found” error; no misleading outputs.
- Unknown system and missing source folder: exit `2`.
- Canonically identical source/destination: exit `2` with a specific correction.
- Report inside an export: exit `2`; unsafe output not written.
- Valid recipe plus malformed JSON: exit `1`; both outputs marked partial and name `broken2.json`.
- After replacing the malformed JSON with a valid recipe, the same check recovered to exit `0` and rewrote complete outputs.

The declared regression tests additionally cover nested exports, Tandoor's default outer ZIP with per-recipe ZIPs, step ingredients, sibling images, path escape, out-of-root JSON symlinks, all-malformed input, unknown fields, image hashing, and exact source immutability.

Evidence: `/tmp/recipe-package-list.log`, `/tmp/recipe-cargo-package.log`, `/tmp/recipe-consumer-install.log`, and `/tmp/recipe-recovery-KaIkoN`.

## Live deployment identity and routes

Freshly built candidate files matched production byte-for-byte for:

- `index.html` (`371a0e3228d1e3bc6e59565409e307e62e1d55ae6bc5dd80ce64cbc2a1d7ccb9`);
- hashed JS and CSS;
- hero art and terminal recording;
- `sw.js`, `robots.txt`, and `sitemap.xml`.

`/`, `/demo`, `/privacy`, and `/terms` returned 200. An unknown route returned a real 404 and the styled recovery page. All internal links and fragment targets resolved; the Param Factory link returned 200. The only console message in route auditing was the browser's expected failed-resource message for the deliberately requested 404.

Result: the live deployment **matches candidate `03eae74`**.

## Accessibility, keyboard, mobile, and motion

Fresh Playwright checks covered every public route at `1440×900` and `390×844`:

- `lang="en"`, route-specific title, one `h1`, one `main`, header/footer landmarks, ordered headings, and no missing image alt text;
- no horizontal overflow;
- no visible interactive target below 44×44 CSS pixels;
- no axe violations at any severity, including zero serious/critical findings;
- keyboard order begins with the skip link; all controls are reachable; Enter activated the sample link;
- focused controls had a 3 px outline and contrasting 6 px ring or graphite outline;
- 200% root text size preserved content, the primary action, and a zero-overflow layout;
- reduced-motion media matched and reduced all animation/transition duration to `0.00001s`, with automatic rather than smooth scrolling;
- no unexpected console or page errors.

The required `/opt/fleet/lib/verify-url.sh` passed the live demo: HTTP 200, 717 ms load, title, language, one `h1`, main landmark, alt text, labeled buttons, and no browser errors. Evidence: `/tmp/recipe-verify-url-4oL5yh`.

Screenshots: `/tmp/recipe-desktop-home.png`, `/tmp/recipe-mobile-home.png`, and matching route screenshots under `/tmp/recipe-{desktop,mobile}-*.png`.

## Privacy, storage, offline, and response policy

- A full landing → demo → reset → exit flow made only same-origin requests. It did not send sample recipe data away.
- No analytics, trackers, CDN fonts, or third-party runtime scripts loaded.
- The browser demo used only its namespaced demo key and deleted it on exit.
- The service worker was active and controlling, `registration.update()` completed with the worker still activated, and `/?demo=1` reloaded offline with its title, heading, findings, and demo banner intact.
- A live paid-return URL stored the token under `sb_license:recipe-library-move-check`, stripped it from the address bar, and made exactly one external GET. The request URL contained only the license query parameter, had no body, and returned `Cache-Control: no-store`. An invalid token produced the quiet inactive-license recovery notice.
- Root response headers included HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, restricted camera/microphone/geolocation permissions, and a CSP limited to self plus the documented Sociobot API. `frame-ancestors 'none'` was delivered as a response header.
- HTML uses `public, must-revalidate, max-age=30`; hashed assets use one-year immutable caching; `sw.js` uses `no-cache`; robots and sitemap use one-hour caching.

No sign-in exists or is required, so the Entra tenant requirement is not applicable.

## Billing endpoint and request allowance

- Production checkout: **HTTP 303** to `https://checkout.dodopayments.com/...`.
- Live invalid-token verification returned HTTP 200 with `{ "valid": false, "reason": "invalid" }`.
- From one client/IP, verification requests 1–30 returned 200. Request 31 returned **429** with **`Retry-After: 3`**. Observed allowance: **30 successful verification requests per active rate window**.

This resolves the earlier deployment-only checkout failure and confirms the server-side allowance contract.

## Performance

Fresh mobile Lighthouse against production `/`:

| Category/metric | Result |
| --- | ---: |
| Performance | 97 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| LCP | 1,503 ms |
| FCP | 777 ms |
| Total blocking time | 196 ms |
| CLS | 0 |
| Total transfer | 159,655 bytes |

Lighthouse had no interaction sample from which to report INP; direct keyboard and pointer actions completed without observable delay. Evidence: `/tmp/recipe-lighthouse.json`.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

## Final result

**PASS — candidate `03eae74c090ac780c80dfa97a6f755916753a9ab` is release-ready at the tested live URL.**
