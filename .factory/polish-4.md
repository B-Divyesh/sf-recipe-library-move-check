# Polish round 4 — cumulative finding closure

**Reviewed release candidate:** `f1dbc321a9b04cc8d392d051c421d98dea0ac67f`
**Review base:** `77f70e82bca0549d369b7ce58fe93cd8774759ad`
**Repair commit:** `5e2ef4abb0bb9d88efef03a9629c96a4d232c45e`
**Deployment:** `17b2613a-72a7-4fa2-b1ca-86d12330e7a0`
**Live URL:** <https://recipe-library-move-check.sociobot.in>

All review and prior polish files were read before repair. The earlier closures remain present and were re-run from a fresh clone; F-4-1 is closed by the new code and claim assertion. There are no open findings.

## Evidence used for every row

- Fresh clone: `/tmp/recipe-library-move-check-round4-mLPli3/repo` at `5e2ef4a`; `npm ci`, then every one of the 22 exact commands in `.factory/claims.json`, passed. The command sequence reached `@claim:install-command`; that final claim also passed on a direct rerun.
- Full clean-clone suite: `npm test` passed: Cargo fmt/clippy, TypeScript, 13 Rust tests, production site build, and 44 Playwright tests. `test-results/.last-run.json` records `status: passed` with no failed tests.
- Production suite: `PLAYWRIGHT_BASE_URL=https://recipe-library-move-check.sociobot.in npx playwright test` passed all 44 tests, including axe serious/critical scans, keyboard/focus, routing, privacy, mobile, and offline reload. The direct live `@claim:sample-findings` rerun passed (1/1).
- Cold production verifier: `.factory/live-verification-4/verify.json`; no page or console errors, title/lang/main/h1/alt/button checks pass. Screenshots: `.factory/live-verification-4/home-cold-mobile.png`, `.factory/live-verification-4/demo-cold-desktop.png`, and `.factory/live-verification-4/404-cold-desktop.png`.
- Live route check: `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` return 200; `/missing-page` returns 404. Lighthouse mobile report: `.factory/live-verification-4/lighthouse-mobile.json` (performance 100, accessibility 100, LCP 1.5 s, CLS 0).

| Finding ID | Change made | Evidence |
| --- | --- | --- |
| F-1-01 | Kept the deliberate Cargo package allowlist so the consumer crate excludes site, test, factory, package-manager, and analysis files. | Clean-clone `@claim:crate-package`; live install section `/#install`. |
| F-1-02 | Kept the self-hosted SVG recording generated from the real bundled `recipe-move-check demo --json` sample. | Clean-clone `@claim:demo-is-real-cli`; `.factory/live-verification-4/demo-cold-desktop.png`; live `/?demo=1`. |
| F-1-03 | Kept the concrete checklist audience copy and removed the undefined “safe plan” promise. | `.factory/copy-audit.md`; `.factory/live-verification-4/home-cold-mobile.png`; live `/`. |
| F-1-04 | Kept the free checker fact, backed by an unlicensed, offline binary run. | Clean-clone `@claim:free-cli`; live `/`. |
| F-1-05 | Kept the precise no-change boundary and omitted the unsupported paid-content promise. | Clean-clone `@claim:cli-local-only`; live `/privacy`. |
| F-1-06 | Kept tested planning-pack Markdown contents and the unlicensed free outputs. | Clean-clone `@claim:planning-pack` and `@claim:free-cli`; live `/`. |
| F-1-07 | Kept end-to-end inventory, exact-image comparison, possible-duplicate, missing-image, field-review, and checklist coverage. | Clean-clone `@claim:cli-capabilities`; live `/`. |
| F-1-08 | Kept one shipped fixture for demo, normal check, and recording source values. | Clean-clone `@claim:demo-is-real-cli`; `.factory/live-verification-4/demo-cold-desktop.png`; live `/?demo=1`. |
| F-1-09 | Kept nested JSON, sibling image, and Tandoor outer-ZIP support. | Clean-clone `@claim:nested-export-support`; live install/docs entry `/#install`. |
| F-1-10 | Kept recursive source/destination hashing plus the exact allowed output-path diff assertion. | Clean-clone `@claim:cli-local-only`; live `/privacy`. |
| F-1-11 | Kept success, invalid-argument, and unreadable-folder exit status coverage. | Clean-clone `@claim:exit-codes`; live install/docs entry `/#install`. |
| F-1-12 | Kept assertions for every documented Mealie and Tandoor field. | Clean-clone `@claim:supported-fields`; live install/docs entry `/#install`. |
| F-1-13 | Kept unknown-field names in both the JSON inventory and checklist. | Clean-clone `@claim:unknown-fields`; live install/docs entry `/#install`. |
| F-1-14 | Kept the recorded license verification request/storage boundary. | Clean-clone `@claim:license-privacy`; live `/privacy`. |
| F-1-15 | Kept all three real duplicate reasons in raw checker evidence and replaced the visitor preview with a plain explanation. | Clean-clone `@claim:cli-capabilities` and `@claim:sample-findings`; `.factory/live-verification-4/demo-cold-desktop.png`; live `/?demo=1`. |
| F-1-16 | Kept the exact missing `missing.jpg` sample evidence. | Clean-clone `@claim:sample-findings`; `.factory/live-verification-4/demo-cold-desktop.png`; live `/?demo=1`. |
| F-1-17 | Kept owner and family-access reminders in the sample and generated checklist. | Clean-clone `@claim:sample-findings` and `@claim:cli-capabilities`; live `/?demo=1`. |
| F-1-18 | Kept the standard terms **check**, **possible duplicate**, **JSON inventory**, and **checklist** in public package and product copy. | `public package copy keeps the documented plain terms`; `.factory/copy-audit.md`; live `/`. |
| F-1-19 | Kept literal section headings and a literal 404 page. | `real routes set titles, canonical links, and social metadata`; `.factory/live-verification-4/404-cold-desktop.png`; live `/missing-page`. |
| F-1-20 | Kept result-naming controls: Replay sample run and Enter license token. | Clean-clone `@claim:demo-privacy`; `.factory/live-verification-4/demo-cold-desktop.png`; live `/?demo=1`. |
| F-1-21 | Kept short README capability sentences and audited copy. | `.factory/copy-audit.md`; clean-clone `@claim:cli-capabilities`; live install/docs entry `/#install`. |
| F-2-1 | Kept one exact Dodo Payments merchant/reseller and returns disclosure on the offer and Terms page. | Clean-clone `@claim:billing-roles`; live `/terms`. |
| F-3-1 | Kept the short Tandoor compatibility statements. | `.factory/copy-audit.md`; clean-clone `@claim:nested-export-support`; live install/docs entry `/#install`. |
| F-3-2 | Kept concrete output-path safety wording and behavior. | `.factory/copy-audit.md`; clean-clone `@claim:safe-output-paths`; live `/privacy`. |
| F-3-3 | Kept short exit-code, partial-output, and recovery wording. | `.factory/copy-audit.md`; clean-clone `@claim:partial-read-warnings`; live install/docs entry `/#install`. |
| F-3-4 | Kept plain “linked directories” and “invalid JSON” wording. | `.factory/copy-audit.md`; clean-clone `@claim:safe-output-paths` and `@claim:partial-read-warnings`; live install/docs entry `/#install`. |
| F-3-5 | Kept the README mapping of moving/existing folders and checklist output to the command arguments. | `public package copy keeps the documented plain terms`; live install/docs entry `/#install`. |
| F-3-6 | Kept “command-line checker” on visitor-facing first use. | `.factory/copy-audit.md`; `.factory/live-verification-4/home-cold-mobile.png`; live `/`. |
| F-3-7 | Kept the compact desktop/mobile hero; all required facts fit cold viewports. | `the complete first-screen message fits a 1440px desktop viewport`; `.factory/live-verification-4/home-cold-mobile.png`; live `/`. |
| F-3-8 | Kept the one-click completed sample claim and direct demo route. | Clean-clone `@claim:one-click-demo`; `.factory/live-verification-4/demo-cold-desktop.png`; live `/?demo=1`. |
| F-3-9 | Kept the exact displayed Cargo install command under an isolated-install claim. | Clean-clone `@claim:install-command`; live `/#install`. |
| F-3-10 | Kept the literal Error 404 / Page not found treatment. | `real routes set titles, canonical links, and social metadata`; `.factory/live-verification-4/404-cold-desktop.png`; live `/missing-page`. |
| F-3-11 | Kept the full product name in the 404 title. | `real routes set titles, canonical links, and social metadata`; `.factory/live-verification-4/404-cold-desktop.png`; live `/missing-page`. |
| F-4-1 | Replaced “Same name, ingredient list, and image hash” with “The names and ingredients match. The image files match exactly.” Rewrote README, Terms, Changelog, and generated checklist copy to explain matching files plainly; raw CLI hash evidence remains asserted separately. | Clean-clone and live `@claim:sample-findings`; clean-clone `@claim:cli-capabilities`; `.factory/live-verification-4/demo-cold-desktop.png`; live `/?demo=1`; pushed README check confirms the new sentence. |

## Final live recheck

I opened production in fresh browser pages at 390×844 (`/`) and 1440×900 (`/?demo=1`, `/missing-page`). The first screen remains clear and intact; the isolated demo banner, reset, exit, completed findings, and new exact-image wording are visible in the demo screenshot. The styled 404, route titles, privacy/terms links, focus/routing checks, service-worker offline sample, and no-error baseline all passed on the live origin. No review finding remains unresolved.
