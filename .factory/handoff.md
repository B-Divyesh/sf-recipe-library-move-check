# Verification handoff — recipe-library-move-check-verify-7

## Outcome

**PASS — release-ready.**

Independent QA verified candidate `03eae74c090ac780c80dfa97a6f755916753a9ab` against <https://recipe-library-move-check.sociobot.in> on 29 August 2026 UTC. The deployed product matches the candidate. The earlier deployment-only paid-checkout failure is resolved: production checkout returns HTTP 303 to hosted Dodo checkout.

No product code was modified. Full evidence is in `.factory/verification-7.md`.

## What was verified

- Cold first-read gate and one-click sample demo: PASS on desktop and 390 px mobile.
- All 20 exact `.factory/claims.json` commands from a correctly installed clean candidate clone: PASS.
- `npm test`: PASS — strict Rust format/Clippy, TypeScript, 13 Rust tests, site build, and 40 Playwright tests.
- `npm run build`: PASS — optimized CLI plus `dist/site/`.
- `cargo package --locked`: PASS — 17 consumer files; 85.3 KiB unpacked / 21.4 KiB compressed.
- Clean offline consumer install from the packed crate: PASS.
- Installed CLI normal, empty, malformed, recovery, unsafe-output, identical-root, missing-folder, and invalid-system paths: PASS with exit codes `0`, `1`, and `2` as documented.
- Live route semantics, keyboard-only use, visible focus, 200% text, 44 px targets, reduced motion, mobile layout, console/page errors, and axe: PASS; no axe findings at any severity.
- Privacy request log and storage isolation: PASS. The demo flow used same-origin requests only and deleted its namespaced state on exit.
- Live service-worker update and offline demo reload: PASS.
- Headers and caching: PASS. Security headers are present; HTML is short-lived, hashed assets immutable, and `sw.js` no-cache.
- Candidate/live parity: exact hashes matched for HTML, JS, CSS, art, terminal recording, service worker, robots, and sitemap.
- Checkout and license verification: PASS. Checkout returns 303 to Dodo; verification sends only the token in a GET query with no body.
- API request allowance: 30 successful requests; request 31 returned 429 with `Retry-After: 3`.
- Mobile Lighthouse: Performance 97, Accessibility 100, Best Practices 100, SEO 100; LCP 1.503 s, TBT 196 ms, CLS 0, transfer 159,655 bytes.

## Run it again

```sh
npm ci
npm test
npm run build
cargo package --locked
```

Demo entry points:

```sh
cargo run -- demo
```

<https://recipe-library-move-check.sociobot.in/?demo=1>

## Defects and known gaps

- Critical: none.
- High: none.
- Medium: none.
- Low: none.
- No release-blocking known gaps. Archives nested more than three levels are deliberately marked partial instead of being followed indefinitely.

## Evidence locations

- Report: `.factory/verification-7.md`
- Claim logs: `/tmp/recipe-claim-logs-clean/`
- Full test/build: `/tmp/recipe-full-test.log`, `/tmp/recipe-full-build.log`
- Browser audit: `/tmp/recipe-live-browser-audit.json`
- Lighthouse: `/tmp/recipe-lighthouse.json`
- Required URL verifier: `/tmp/recipe-verify-url-4oL5yh`
- Desktop/mobile screenshots: `/tmp/recipe-desktop-*.png`, `/tmp/recipe-mobile-*.png`
