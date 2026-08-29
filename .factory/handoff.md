# Review handoff — recipe-library-move-check, round 4

## Outcome: FAIL

No product code was changed. The review found one minor plain-language defect, documented in `.factory/review-4.md` as **F-4-1**: the landing sample and README use the unexplained term “image hash.” The required verdict is FAIL until it is written in user language and its visitor-facing copy is asserted by the existing sample claim.

## What was verified

- Cold 390px and 1440px live visits clearly state the job, audience, and primary sample action before scrolling.
- The browser demo opened in one click, showed completed sample findings, used only `demo:recipe-library-move-check:run`, reset safely, discarded the key on exit, and made only same-origin requests.
- A fresh clone at `/tmp/recipe-review4-clean-dZ4Cr5/repo` ran all 22 exact `.factory/claims.json` commands after `npm ci`; all passed. Logs are in `/tmp/recipe-review4-claim-logs/`.
- Crawl, metadata, route/404, back/focus, accessibility, mobile layout, privacy, offline, CLI demo, install, and package checks passed. No valid-route console or page errors were observed.
- Every earlier review finding was rechecked in current code/live behavior and is fixed. There are no reopened historic findings.

## How to verify

```sh
npm ci
npm test
npm run build
cargo run --release -- demo --json
```

Read `.factory/review-4.md` for the full copy audit, claim results, and exact F-4-1 rewrite/test direction.
