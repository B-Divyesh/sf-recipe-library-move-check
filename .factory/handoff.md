# Repair handoff — PASS

## Outcome

The release-blocking defects recorded in `.factory/verification-5.md` for candidate `89ad5b761c9969cf830b2e82176e752e501ac20c` are repaired and deployed. Repair commit: `7700995` (`fix: protect recipe exports and report partial reads`).

## Repairs

- Output destinations are resolved before any export is read or written. A report or inventory path is rejected with exit code `2` if it is inside (or contains) either selected export, aliases an existing input through a hard link, or overlaps the other output path.
- Invalid or unreadable recipe JSON is now a partial result: both outputs are written, the terminal and Markdown checklist name each warning, JSON flags it with `affects_completeness: true`, and the `check` command exits `1`. Exit `0` remains a complete read; invalid arguments, unsafe paths, and unreadable folders use `2`.
- The checklist now says when there are no owner or household access checks.
- Button focus has a 3px graphite outline with a blue ring; the graphite/paper pair is 12.2:1.
- A cached invalid planning-pack verdict restores the inactive-license message and buy link without making another request during the one-day cache window.

## Exact reproduction evidence

Before repair, the verifier's unsafe-output case replaced `source/lemon-pasta/recipe.json` and exited `0`. After repair, the same case returned exit `2`, printed `report path overlaps a selected export`, and the source SHA-256 was unchanged. A valid recipe beside `broken.json` now returns exit `1`; stdout names `broken.json`, and the report contains `## Input warnings`, `This checklist is partial`, `exit code 1`, and the empty Family review state.

## Verification

- `npm ci`: pass; 0 vulnerabilities.
- `npm test`: pass — `cargo fmt --check`, strict Clippy, TypeScript, 8 Rust tests, production site build, and 40 Playwright tests.
- Every one of the 20 exact commands declared in `.factory/claims.json` was run separately through `@claim:crate-package`; all passed.
- `npm run build`: pass — release CLI plus `dist/site/`; initial JS 16.23 KB raw / 5.81 KB gzip and CSS 13.46 KB raw / 3.89 KB gzip.
- `cargo package --allow-dirty --no-verify --list`: pass — 17 consumer files only. A fresh unpacked crate was installed into a temporary Cargo root; `recipe-move-check demo --json` returned the expected `2/2/1/1/3/2` summary.
- Local browser verification against the production build: `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 .factory/repair-verification` passed (559 ms load, no console/page errors, title/lang/one h1/main/alt/button checks). The Playwright suite separately exercised desktop and 320/390px mobile layouts, keyboard navigation, axe serious/critical checks, reduced motion, privacy/network isolation, offline reload, service-worker update, headers/config, and route metadata.
- Static deployment: `/opt/fleet/lib/deploy-static.sh recipe-library-move-check dist/site` passed (Azure Static Web Apps deployment `6bdbfa72-cfed-4dad-90ca-b7fb4d087f1b`; HTTPS `200`). Local and live `index.html` SHA-256 are both `371a0e3228d1e3bc6e59565409e307e62e1d55ae6bc5dd80ce64cbc2a1d7ccb9`.
- Live verification: `verify-url.sh` passed at `https://recipe-library-move-check.sociobot.in` (767 ms load, no console/page errors, correct title/lang/one h1/main/alt/button checks), and `PLAYWRIGHT_BASE_URL=https://recipe-library-move-check.sociobot.in npm run test:browser` passed 40/40. The live page sends HSTS, nosniff, strict referrer policy, permissions policy, and CSP with `frame-ancestors 'none'`. Checkout returned `303` to Dodo; an invalid-token verification returned `200`, `{"valid":false,"reason":"invalid"}`, and `Cache-Control: no-store`.

## Known gaps and next step

No known product gaps or pending steps.
