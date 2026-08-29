# Repair handoff — recipe-library-move-check, round 4

## Outcome: PASS

Repair commit `5e2ef4abb0bb9d88efef03a9629c96a4d232c45e` closes the final cumulative finding, F-4-1. Visitor-facing evidence now says, “The names and ingredients match. The image files match exactly.” It removes unexplained image-hash wording from the landing preview, README, Terms, Changelog, and generated checklist. The existing raw CLI hash reason remains covered by the checker-capability claim.

The commit was pushed to `origin/main` and deployed as Azure Static Web Apps deployment `17b2613a-72a7-4fa2-b1ca-86d12330e7a0` to <https://recipe-library-move-check.sociobot.in>.

## Exact verification evidence

- Fresh clone: `/tmp/recipe-library-move-check-round4-mLPli3/repo` at `5e2ef4a`, followed by `npm ci`.
- Every exact test command listed in `.factory/claims.json` passed (22/22). The loop reached `@claim:install-command`; a direct rerun of that final claim also passed.
- `npm test` passed from that clean clone: `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, TypeScript, 13 Rust tests, static build, and 44 Playwright tests. `test-results/.last-run.json` records `status: passed` and no failed tests.
- `npm run build:site` produced `dist/site/`; its initial JavaScript is 16 KB on disk / 5.83 KB gzip and CSS is 16 KB on disk / 3.91 KB gzip.
- Post-deploy, `PLAYWRIGHT_BASE_URL=https://recipe-library-move-check.sociobot.in npx playwright test` passed all 44 production tests. The direct production `@claim:sample-findings` run passed 1/1.
- `/opt/fleet/lib/verify-url.sh https://recipe-library-move-check.sociobot.in .factory/live-verification-4` passed: HTTP 200, no console/page errors, title, `lang=en`, one h1, main, complete image alt text, and labeled buttons. Evidence is in `.factory/live-verification-4/verify.json`.
- Live routes `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` return 200. `/missing-page` returns 404 and renders the styled Page not found route.
- Lighthouse mobile: performance 100, accessibility 100, FCP 0.8 s, LCP 1.5 s, CLS 0, total blocking time 60 ms. Report: `.factory/live-verification-4/lighthouse-mobile.json`.
- Visual recheck: `.factory/live-verification-4/home-cold-mobile.png`, `.factory/live-verification-4/demo-cold-desktop.png`, and `.factory/live-verification-4/404-cold-desktop.png`.

## Run and verify locally

```sh
npm ci
npm test
npm run build
cargo run --release -- demo --json
cargo package --allow-dirty --no-verify --list
```

Deploy the already-built static site with:

```sh
/opt/fleet/lib/deploy-static.sh recipe-library-move-check dist/site
```

## Known gaps and next steps

None. The artifact remains a local Rust CLI with a static documentation/demo site. Do not publish the crate from this worker; the package is ready for the factory publishing workflow.
