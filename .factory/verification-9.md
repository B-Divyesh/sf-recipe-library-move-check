# Independent verification 9 — Recipe Library Move Check

## Verdict: PASS

Candidate commit: `6247a344a7c53012042e748e99f0256279d40b35` (`main`)

Verified URL: <https://recipe-library-move-check.sociobot.in>

Verification date: 29 August 2026 (UTC)

This was an independent, no-product-code-change verification against the researched brief and the factory acceptance contract. The live deployment matches the candidate's generated public files.

## First-read result

Cold-opening the live home page answers all three required questions in plain words:

- **What:** “Check your recipe move before importing.”
- **For whom:** households moving between Mealie and Tandoor who need a checklist before importing the family library.
- **First action:** the visible primary control is **Try it with sample data**, followed by “See a completed check in one click.”

One click opened the completed isolated demo, with its persistent “Demo — sample data, nothing is saved” banner, Reset demo, and Start for real controls. The completed sample visibly reports 1 possible duplicate, 1 missing image, and 3 fields to review.

## Clean-checkout quality gates

`npm ci` completed successfully (0 reported dependency vulnerabilities). The initial prescribed claim invocation was attempted before dependency installation as required; it correctly stopped at `tsc: not found` because a clean checkout has no `node_modules`. After `npm ci`, every exact claim command in `.factory/claims.json` was invoked and passed. A full rerun then passed:

- `npm test`: pass — Rust formatting and Clippy (`-D warnings`), TypeScript check, 13 Rust unit tests, site build, and 44 Playwright tests. `test-results/.last-run.json` records `status: passed` and no failed tests.
- `npm run build`: pass — release CLI at `target/release/recipe-move-check` and deployable `dist/site/`.
- `cargo package --allow-dirty --no-verify --list`: pass — package contains only consumer CLI sources, docs/license/changelog, and the shipped examples; no factory, browser-test, analysis, or site source material.
- The install-command claim installed the exact public `cargo install --git https://github.com/B-Divyesh/sf-recipe-library-move-check` command into a fresh `CARGO_INSTALL_ROOT`, then ran `recipe-move-check --version` and `demo --json` successfully. A separately packed `.crate` was also installed into a clean temporary consumer root and exercised through the public CLI.

All 22 claims declared in `.factory/claims.json` passed. This includes the sample findings, isolated-demo privacy and reset behavior, CLI capability/local-only/output-safety/error-code/partial-read cases, nested exports and Tandoor ZIP support, offline demo, package contents, and install command.

## End-to-end CLI evidence

`target/release/recipe-move-check demo --json` returned the advertised normal result: two source and two destination recipes, one possible duplicate, one missing image, three unmapped fields, and two ownership reviews; it wrote a Markdown checklist and JSON inventory in its disposable demo directory.

Manual invalid-input recovery was also confirmed:

- unsupported source system: exit `2` with a concrete supported-system error;
- missing source export folder: exit `2` with the missing path named.

The automated Rust and claim suites additionally cover empty libraries, malformed and nameless JSON, unsafe and overlapping output paths, identical exports, outside-root symlinks, nested folders, the default Tandoor outer ZIP, and partial output exit `1` behavior.

## Live deployment, privacy, and security

The live root document has the exact SHA-256 of the freshly built candidate. These deployed files also matched byte-for-byte by SHA-256: JavaScript, CSS, hero WebP, terminal SVG, and service worker. `staticwebapp.config.json` is intentionally not publicly served (404), while its generated headers are present on live responses.

- Live `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` return 200; an unknown route returns the designed 404 response.
- The demo request log contained only `recipe-library-move-check.sociobot.in` requests. Its only browser storage key was `demo:recipe-library-move-check:run`; Start for real removed it. No sample recipe data went to another origin.
- Response headers include HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, restrictive permissions policy, and CSP with `frame-ancestors 'none'`. The CSP permits only self-hosted assets plus the stated Sociobot verification origin.
- Cache policy is correct: HTML uses `public, must-revalidate, max-age=30`; hashed JS/CSS/images use `public, max-age=31536000, immutable`; the service worker uses `no-cache`.
- A fresh live demo gained service-worker control from `/sw.js` and reloaded successfully offline, retaining the sample heading.
- The optional license verification API was probed only with deliberately invalid QA tokens. It accepted 30 rapid requests, returned HTTP `429` beginning with request 31, and supplied `Retry-After: 3`; a request four seconds later recovered with HTTP 200. Observed allowance: 30 requests per active rate window for this client.

## Browser, accessibility, and responsive evidence

An independent live `PLAYWRIGHT_BASE_URL=https://recipe-library-move-check.sociobot.in npx playwright test` passed all 44 tests.

- Axe found no serious or critical violations on `/`, `/demo`, `/privacy`, `/terms`, or the designed 404 route.
- Each route has one `<h1>` and one `<main>` and the correct route-specific title. Normal routes had no console or page errors. The browser naturally logs the HTTP 404 itself as a failed resource when deliberately loading the unknown-route test; no application exception occurred.
- Keyboard testing reaches the skip link first, then all navigation/actions in a sensible order. Focus uses a visible 3px light outline plus blue ring; Enter opened the demo. The screenshot checks cover desktop and a 390px-wide mobile viewport.
- At 390px, document `scrollWidth` equalled `clientWidth` (390), visible controls met the 44px minimum, and the page stacked intentional content without horizontal overflow. Reduced-motion computed durations were effectively zero (`0.00001s`).
- The first-load JavaScript is 16,352 bytes / 5.83 kB gzip and CSS is 13,588 bytes / 3.91 kB gzip, within the static-product budgets. The 146,292-byte hero WebP is also within the 300 kB mobile hero budget.

## Defects

No release-blocking, high, medium, or low defects found.

## Scope note

This verification did not modify product code. Pre-existing changes under `graphify-out/` were unrelated to this verification and were neither staged nor included in the verification commit.
