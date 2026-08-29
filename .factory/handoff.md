# Handoff — polish round 2

## Outcome

All findings from `.factory/review-1.md` and `.factory/review-2.md` are resolved and reverified. The Rust CLI, isolated browser sample, and handwritten migration-notebook site remain the original artifact and visual system.

Implementation commits:

- `936bac0` — cumulative copy, legal disclosure, claim, fixture, README, service-worker, and test repairs.
- `21affbc` — phone spacing plus a first-screen fold regression test.

The repair was pushed to `origin/main`. Production is live at https://recipe-library-move-check.sociobot.in from deployment `72a3cc09-c1ad-4544-b711-c2ffd9e15c47`.

## What changed

- Rewrote the first-screen fact to explain the JSON inventory at first use. README now defines it as a JSON file for scripts or another recipe tool.
- Verified the live checkout disclosure. Dodo Payments is the online reseller and merchant of record and handles order questions and returns. Landing and Terms use the same wording and point buyers to the support link in their Dodo receipt.
- Added `billing-roles` to `.factory/claims.json`, a recorded checkout fixture, and an outcome test covering both purchase pages and the exact Sociobot checkout URL.
- Added a manifest-integrity test requiring one exact tagged test for every declared claim.
- Tightened only phone spacing and headline scale. All required first-screen content now fits at both 320×844 and 390×844 without changing the notebook identity.
- Bumped the offline shell to `recipe-move-check-v7` so deployed visitors receive the repaired copy.
- Updated the catalog line to a 108-character verb-first description.
- Updated `.factory/copy-audit.md` and added the complete finding map in `.factory/polish-2.md`.

## Clean-clone evidence

Final product commit tested: `21affbc` in `/tmp/recipe-move-polish2-final`.

- `npm ci`: pass, 0 vulnerabilities.
- Every one of the 15 exact `.factory/claims.json` commands: pass separately.
- `npm test`: pass — strict Rust format/Clippy, TypeScript, 6 Rust tests, production site build, and 35 Chromium tests.
- `npm run build`: pass — release CLI and `dist/site/` produced.
- `cargo package --no-verify --list`: pass — 17 consumer files only.
- `cargo install --path . --locked --root /tmp/recipe-move-polish2-final-install`: pass.
- Installed `recipe-move-check demo --json`: 2 moving recipes, 2 existing recipes, 1 possible duplicate, 1 missing image, 3 fields, and 2 ownership reviews.
- Initial JavaScript: 16.16 KB raw / 5.80 KB gzip. CSS: 13.32 KB raw / 3.87 KB gzip.

Claim tests passed:

- `@claim:sample-findings`
- `@claim:demo-privacy`
- `@claim:cli-capabilities`
- `@claim:free-cli`
- `@claim:demo-is-real-cli`
- `@claim:nested-export-support`
- `@claim:cli-local-only`
- `@claim:exit-codes`
- `@claim:supported-fields`
- `@claim:unknown-fields`
- `@claim:license-privacy`
- `@claim:offline-demo`
- `@claim:planning-pack`
- `@claim:billing-roles`
- `@claim:crate-package`

## Browser, accessibility, privacy, offline, and performance

- Axe: no serious or critical violations across home, both demo URLs, Privacy, Terms, and the styled 404.
- Semantics: every route has `lang=en`, one h1, one main, header/nav/footer landmarks, alt text, route-specific runtime title and metadata, and legal links.
- Keyboard: skip link first, visible double focus ring, route h1 focus/announcement, and Back restoration pass.
- Mobile: no overflow or sub-44px visible targets at 320px and 390px. Complete home facts end at 831px and 787px respectively in an 844px viewport.
- Privacy: demo traffic remains same-origin, uses only `demo:recipe-library-move-check:run`, resets in place, and removes state on exit. Licensed verification sends only the token to the declared Sociobot endpoint.
- Offline: the isolated sample reloads after the first visit and replays the cached recording.
- Local and live Lighthouse on `/?demo=1`: performance 100, accessibility 100, best practices 100, SEO 100; LCP 0.8s, CLS 0, TBT 0ms.
- Factory live verifier: 801ms load, no console/page errors, correct title/lang/main/h1/alt/button checks.

## Deployment and cold production verification

Deployment command:

```sh
/opt/fleet/lib/deploy-static.sh recipe-library-move-check dist/site
```

Deployment `72a3cc09-c1ad-4544-b711-c2ffd9e15c47` succeeded. After deployment:

- `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms`: 200.
- `/missing-page`: 404 with the styled recovery page.
- Full live Playwright suite: 35 passed.
- Live index SHA-256 equals local build: `67d35ac72a819bd204ca1b71de1c015fab8a8fd239b66e2d9fba282e965c09b2`.
- Checkout: 303 to `checkout.dodopayments.com`; checkout footer matches the recorded online-reseller, merchant-of-record, inquiry, and returns disclosure.
- Production evidence is under `.factory/live-verification-2/` and `.factory/screenshots/polish-2-*`.

## Run and verify

```sh
npm ci
npm test
npm run build
cargo package --no-verify
PLAYWRIGHT_BASE_URL=https://recipe-library-move-check.sociobot.in npx playwright test
```

## Known gaps and next steps

None within this work order. Registry publication remains a factory release action; no package was published from this worker.
