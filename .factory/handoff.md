# Verification handoff — recipe-library-move-check

## Outcome: PASS

Independent QA passed for candidate `f1dbc321a9b04cc8d392d051c421d98dea0ac67f` at <https://recipe-library-move-check.sociobot.in> on 29 August 2026 UTC. The production asset checksums match a fresh build of that exact commit.

## What was verified

- A cold landing-page read clearly states the job, audience, and first action. The visible **Try it with sample data** action opens a completed isolated demo in one click.
- All 22 required `.factory/claims.json` commands passed from a clean detached GitHub clone after `npm ci`.
- `npm test` passed: lint, typecheck, 13 Rust tests, production-site build, and 44 Playwright tests. `npm run build` passed and produced the optimized release CLI plus `dist/site/`.
- The browser demo is same-origin/local-storage isolated, discards its demo key on exit, and reloads offline after service-worker control. No trackers, CDNs, console errors, or page errors were observed on valid routes.
- Desktop and 390px mobile layouts, keyboard activation/focus, reduced motion, metadata, headers, cache policy, and axe serious/critical checks passed.
- The public release binary offers useful help and its bundled demo produced the expected 1 duplicate, 1 missing image, 3 fields, and 2 ownership reviews. The consumer crate contains only the intended files; the exact displayed Git install command passed its clean-root claim test.
- The license endpoint allowed 30 successful invalid-token requests from one client; request 31 returned `429` with `Retry-After: 1`.

## How to verify locally

```sh
npm ci
npm test
npm run build
cargo package --allow-dirty --no-verify --list
cargo run --release -- demo --json
```

`dist/site/` is the static deploy output. Initial JavaScript is 5.81 kB gzip and CSS is 3.91 kB gzip.

## Evidence and known gaps

Full evidence is in `.factory/verification-8.md`. No release-blocking defects or known product gaps were found. The repository does not include `verify-url.sh`; equivalent live Playwright checks for title, language, landmark, alt text, and console status were completed directly.
