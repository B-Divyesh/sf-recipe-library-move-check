# Polish round 2 — cumulative finding closure

**Reviewed release candidate:** `eff1da5c69ea31843cb1dd87844298353c91d9a0`  
**Review base:** `e646f4125ec184ce7107d268c541de1116db0aa1`  
**Repair commits:** `936bac0`, `21affbc`  
**Live URL:** https://recipe-library-move-check.sociobot.in

Every blocking and minor finding from reviews 1 and 2 was rechecked. Evidence below names the outcome test and, where visual confirmation matters, a production screenshot or URL.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-01 | Kept the Cargo package allowlist; site, test, factory, and analysis files remain excluded. | `@claim:crate-package`; clean `cargo package --no-verify --list` returned 17 consumer files. |
| F-1-02 | Kept the self-hosted SVG recording generated from the real bundled CLI sample. | `@claim:demo-is-real-cli`; `.factory/screenshots/polish-2-demo-desktop.png`; live `/?demo=1`. |
| F-1-03 | Kept the concrete audience sentence and checklist outcome; no “safe plan” claim remains. | `.factory/copy-audit.md`; `.factory/screenshots/polish-2-home-mobile.png`; live `/`. |
| F-1-04 | Kept the free CLI statement backed by an offline, unlicensed binary run. | `@claim:free-cli`; clean installed binary demo. |
| F-1-05 | Kept the precise no-change boundary and omitted the unsupported paid-content statement. | `@claim:cli-local-only`; live `/`. |
| F-1-06 | Kept tested ownership worksheet and move-day notes; free outputs remain available. | `@claim:planning-pack`; `@claim:free-cli`; live `/`. |
| F-1-07 | Kept separate, tested inventory, hash, duplicate, missing-image, field, and checklist capabilities. | `@claim:cli-capabilities`; clean CLI demo summary. |
| F-1-08 | Kept one shipped fixture for `demo`, `check`, and the web recording. | `@claim:demo-is-real-cli`; live `/?demo=1`. |
| F-1-09 | Kept nested JSON and local-image support covered by the shipped folders. | `@claim:nested-export-support`. |
| F-1-10 | Kept recursive source and destination hashes and a complete sandbox path diff. | `@claim:cli-local-only`. |
| F-1-11 | Kept explicit success, invalid-system, and unreadable-folder exit behavior. | `@claim:exit-codes`. |
| F-1-12 | Kept fixtures and assertions for every documented Mealie and Tandoor field. | `@claim:supported-fields`. |
| F-1-13 | Kept unknown field names in both JSON inventory and Markdown checklist. | `@claim:unknown-fields`. |
| F-1-14 | Kept exact licensed-request origin, method, query, body, referrer, and storage checks. | `@claim:license-privacy`; live `/privacy`. |
| F-1-15 | Kept all three displayed possible-duplicate reasons tied to the CLI fixture. | `@claim:sample-findings`; `@claim:cli-capabilities`; live `/?demo=1`. |
| F-1-16 | Kept the exact `missing.jpg` path tied to the CLI missing-image record. | `@claim:sample-findings`; `@claim:cli-capabilities`; live `/?demo=1`. |
| F-1-17 | Kept the owner and family-access reminder in the sample and checklist. | `@claim:sample-findings`; `@claim:cli-capabilities`; live `/?demo=1`. |
| F-1-18 | Completed the reopened fix: the first screen now says “a JSON inventory you can review before importing.” README defines it as a JSON file for scripts or another recipe tool. | `@claim:cli-capabilities`; `.factory/copy-audit.md`; `.factory/screenshots/polish-2-home-mobile.png`; live `/`. |
| F-1-19 | Kept plain section headings that name their content. | `.factory/copy-audit.md`; live `/`. |
| F-1-20 | Kept “Replay sample run” and “Enter license token.” | `@claim:demo-privacy`; `.factory/screenshots/polish-2-demo-desktop.png`. |
| F-1-21 | Kept README sentences under 22 words and added a 13-word JSON inventory definition. | `.factory/copy-audit.md`; `README.md`. |
| F-2-1 | Replaced conflicting merchant copy everywhere. Both offer and Terms now identify Dodo Payments as online reseller and merchant of record, with the Dodo-receipt support route for order questions and returns. Added a recorded checkout fixture and claim. | `@claim:billing-roles`; `tests/fixtures/dodo-checkout-disclosure.json`; `.factory/screenshots/polish-2-terms-mobile.png`; live `/terms`; live checkout redirects to `checkout.dodopayments.com` and repeats the fixture disclosure. |

## Additional acceptance evidence

- The direct `/?demo=1` path opens completed sample findings with the persistent banner, **Reset demo**, and **Start for real**. `@claim:demo-privacy` proves its separate `demo:` key, reset, exit cleanup, and same-origin request boundary.
- Every one of the 15 claim entries has exactly one tagged outcome test. The manifest-integrity test checks IDs, exact commands, and tag counts.
- Runtime route titles, descriptions, canonicals, Open Graph/Twitter titles, focus transfer, Back behavior, legal links, and the real 404 passed in the 35-test suite.
- At 390×844 the complete first-screen facts end at 787px. At 320×844 they end at 831px. Both viewports have no horizontal overflow and all visible targets are at least 44×44px.
- Axe reports no serious or critical issues on `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, or the styled 404. Valid live routes have no console or page errors.
- The live demo reloads offline after first service-worker control. Cache version `v7` replaces the prior shell.
- Production screenshots: `.factory/screenshots/polish-2-home-mobile.png`, `.factory/screenshots/polish-2-demo-desktop.png`, `.factory/screenshots/polish-2-terms-mobile.png`, `.factory/screenshots/polish-2-404-desktop.png`.
- Production verifier and Lighthouse artifacts: `.factory/live-verification-2/`.

## Cold production recheck

Deployment `72a3cc09-c1ad-4544-b711-c2ffd9e15c47` completed in `centralus`. Fresh contexts then passed all 35 Playwright tests against the live origin. `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` returned 200; `/missing-page` returned the designed 404. The live and local `index.html` SHA-256 values both equal `67d35ac72a819bd204ca1b71de1c015fab8a8fd239b66e2d9fba282e965c09b2`.
