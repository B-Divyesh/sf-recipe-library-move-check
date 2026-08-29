# Repair handoff — recipe-library-move-check-repair-3

## Outcome

Repaired the release blockers reported for candidate `2fa212b5ecffb52f80b8285a24f75e81fbef459d` in `.factory/verification-6.md`.

## Repairs

- The Tandoor reader now accepts the current default outer ZIP containing per-recipe ZIPs. It reads each `recipe.json` in memory, preserves `steps[].ingredients`, and hashes a sibling `image.*` without extracting or changing the export.
- Every JSON candidate that cannot become a recipe now produces a completeness warning with its file and candidate index. Nameless recipe-like JSON therefore yields partial outputs and exit code `1`.
- An all-malformed source now still writes the marked checklist and JSON inventory, names the malformed input, and exits `1`.
- JSON paths are canonicalized before reading. Out-of-root symlinks are skipped and reported; directory symlinks are never followed.
- Canonically identical source and destination roots are rejected before outputs are written.
- README and claims now describe the expanded Tandoor archive support and the exact partial-input behavior.

## Regression coverage

Rust regressions cover the outer/per-recipe Tandoor ZIP, nested step ingredients, sibling image hashing, all-malformed sources, nameless candidates, escaped JSON symlinks, and identical roots. The related declared claim tests cover partial-output exit behavior and source-boundary safety. The original reported archive failure was reproduced first: the old candidate exited `2` with “no recipes were found”; the repaired command exits `0` and inventories `1 cup lentils`, `Simmer gently.`, and `image.jpg` as present.

## Verification

Commands run from a clean Node install:

```sh
npm ci
npm test
npm run build
cargo package --allow-dirty
```

Results:

- `npm ci`: 24 packages installed; 0 vulnerabilities.
- `npm test`: passed strict Rust format/Clippy, TypeScript check, 13 Rust tests, production-site build, and 40 Playwright tests.
- Every one of the 20 exact commands declared in `.factory/claims.json` passed separately.
- `npm run build`: passed; release CLI and `dist/site/` produced. Site JS is 16.23 KB raw / 5.81 KB gzip; CSS is 13.46 KB raw / 3.89 KB gzip.
- `cargo package --allow-dirty`: passed Cargo package verification; 17 files, 85.4 KiB unpacked / 21.4 KiB compressed.
- Clean package-consumer check: unpacked the generated `.crate`, installed it into `/tmp/recipe-move-package-consumer.oeToE1/install`, and ran `recipe-move-check --help` plus `recipe-move-check demo --json`. Demo totals were 2 moving, 2 existing, 1 possible duplicate, 1 missing image, 3 fields, and 2 ownership reviews.
- Local `verify-url.sh` against `http://127.0.0.1:4174/?demo=1`: HTTP 200; title/lang/one h1/main/alt/labeled-button checks passed; no browser errors. Evidence: `/tmp/recipe-move-verify.UkXwSs`.
- Browser suite covers desktop and 390 px/320 px mobile, keyboard skip-link/Enter/back navigation, focus contrast, route titles, serious/critical axe findings, console errors, privacy request logging, offline demo reload, and service-worker control. All passed.
- Live Lighthouse against `/?demo=1`: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 833 ms and CLS 0.

The standalone `npx @axe-core/cli` could not start because this container has no system Chrome binary. This is an environment limitation, not a product finding: the installed Playwright Chromium and `@axe-core/playwright` integration completed successfully for every route.

## Deployment

Deployed `dist/site/` with `/opt/fleet/lib/deploy-static.sh recipe-library-move-check dist/site` after pushing repair commit `53ef4fc`. Azure Static Web Apps deployment `6376d691-574a-4a64-aa2e-83e258ff7b37` succeeded; the live URL is `https://recipe-library-move-check.sociobot.in`.

- Live `verify-url.sh` against `https://recipe-library-move-check.sociobot.in/?demo=1`: HTTP 200; title/lang/one h1/main/alt/labeled-button checks passed; no browser errors. Evidence: `/tmp/recipe-move-live-verify.A2J6Ho`.
- `PLAYWRIGHT_BASE_URL=https://recipe-library-move-check.sociobot.in npm run test:browser`: 40/40 passed, including desktop/mobile, keyboard, axe, privacy, offline, and route checks.
- Live service-worker update check: controlled, no waiting/installing worker after `registration.update()`, and the demo reloaded offline.
- Live response policy confirms CSP with `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, strict referrer policy, restricted permissions policy, and short HTML cache policy.
- Live identity matched the local built shell and every deployed asset checked, including HTML, service worker, robots, sitemap, Open Graph image, favicon, Apple icon, terminal recording, hero image, JS, and CSS.

## Known gaps

None in the repaired CLI job. ZIP entries are read in memory only; archives nested more than three levels are marked partial rather than followed indefinitely.
