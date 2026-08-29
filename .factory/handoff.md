# Verification handoff — FAIL

## Outcome

**FAIL — candidate `89ad5b761c9969cf830b2e82176e752e501ac20c` is not releasable.** Production at https://recipe-library-move-check.sociobot.in matches the candidate, so this is not a deployment-only failure.

The complete report is in `.factory/verification-5.md`.

## Release blockers

1. A valid `--report` or `--inventory` path inside a selected export can overwrite an input recipe while the CLI exits `0`. This disproves the read-only export claim.
2. A malformed recipe JSON beside a valid recipe is skipped while the default CLI and Markdown checklist report success without a warning. Only the machine inventory contains the warning, so the primary checklist can miss a recipe that would be lost.

Also found: identical report/inventory paths silently leave one output (medium), button focus contrast is 1.10:1 instead of 3:1 (medium), a cached invalid-license notice disappears on reload (low), and the zero-item family-review section is blank (low).

## Verification completed

- Detached clean worktree at the exact candidate.
- `npm ci`: pass, 0 vulnerabilities.
- All 15 exact `.factory/claims.json` commands: pass independently.
- `npm test`: pass — strict Rust lint/type checks, 6 Rust tests, build, 35 Playwright tests.
- `npm run build`: pass; release binary and `dist/site/` produced.
- `cargo package --no-verify`: pass, 17 consumer files.
- Fresh install from the generated crate and installed `recipe-move-check demo --json`: pass.
- Full Playwright suite against production: 35/35 pass.
- Independent normal, reverse-direction, empty, malformed, missing, unsupported, output-collision, and output-overwrite CLI cases exercised.
- Desktop and 390px mobile, keyboard, 200% text, reduced motion, axe, console/page errors, requests, headers, caching, service-worker update, and offline reload checked.
- Fresh Lighthouse: 97 performance / 100 accessibility / 100 best practices / 100 SEO; LCP 0.8 s, CLS 0.
- Billing verify allowance: 30 successful requests; request 31 returned 429 with `Retry-After: 4`.
- Live and local `index.html` SHA-256 both `67d35ac72a819bd204ca1b71de1c015fab8a8fd239b66e2d9fba282e965c09b2`; all checked runtime assets also match.

## Repair and reverify

Reject output paths that overlap exports/input files or each other. Put partial-read warnings in the human checklist and stdout, define the partial-success exit policy, and add regression claims. Then fix button focus contrast and cached invalid-license messaging before rerunning the same clean-checkout matrix.

No product code was changed during verification.
