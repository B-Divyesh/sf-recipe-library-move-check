# Independent verification 3 — PASS

**Candidate:** `7b584eecbf483a2b5e958f186676cf609e438608`
**Live URL:** https://recipe-library-move-check.sociobot.in
**Verified:** 29 August 2026 (UTC)
**Decision:** **PASS — candidate is releasable.**

## Scope and deployment identity

Verification used a fresh detached worktree at the exact candidate commit, followed by `npm ci`. The candidate's generated `dist/site/index.html` and a fresh HTTPS response from the live `/` had the identical SHA-256:

```
e86df0497ffbfb12fd88922f225b53838dcce3695f01e5fc69a0cd0f8a53dd55
```

The deployment therefore matches the candidate byte-for-byte.

## Cold first-read test

Pass. A cold desktop visit showed:

- **What it does:** “Check your recipe move before importing.” It checks Mealie and Tandoor exports before a migration.
- **Who it is for:** “For households moving between Mealie and Tandoor …”
- **What to click first:** the visible **Try it with sample data** action, paired with “See a completed preflight in one click.”

The action opens `/demo` directly to realistic fixed findings, and the screen has the persistent **Demo — sample data, nothing is saved** banner, **Reset demo**, and **Start for real**. The first-screen requirement and one-click demo requirement pass.

## Required claims contract

All six exact commands in `.factory/claims.json` passed from the clean candidate worktree. Each command includes its required lint/type/Rust/site-build prerequisites and then exercises the declared sandbox.

| Claim | Exact command | Result |
| --- | --- | --- |
| `sample-findings` | `npm test -- --grep @claim:sample-findings` | PASS |
| `demo-privacy` | `npm test -- --grep @claim:demo-privacy` | PASS |
| `cli-output` | `npm test -- --grep @claim:cli-output` | PASS |
| `cli-local-only` | `npm test -- --grep @claim:cli-local-only` | PASS |
| `offline-demo` | `npm test -- --grep @claim:offline-demo` | PASS |
| `planning-pack` | `npm test -- --grep @claim:planning-pack` | PASS (recorded valid verification response) |

The CLI sample observed two source recipes, two destination recipes, one collision, one missing image, three unmapped fields, and two ownership reviews. The normal local-only claim confirms only the named report and neutral-inventory outputs are written.

## Local quality gates and CLI QA

- `npm ci`: PASS; 0 audited vulnerabilities.
- `npm test`: PASS — strict `cargo fmt --check`, strict `cargo clippy --all-targets -- -D warnings`, `tsc --noEmit`, six Rust tests, production-site build, and 15 Chromium tests.
- `npm run build`: PASS — release binary and `dist/site` produced. Built JS is 15,821 bytes raw / 5,750 bytes gzip and CSS is 12,760 bytes raw / 3,760 bytes gzip, within the static budgets.
- `cargo package --allow-dirty --no-verify`: PASS — packaged crate is 42.8 KiB compressed.
- Clean consumer: extracted the packaged `.crate`, installed it into a new temporary Cargo root, then ran `recipe-move-check demo --json`. PASS; both generated output files existed and had the expected sample result.

Independent CLI cases with the release binary:

- Normal Mealie → Tandoor sample: wrote a Markdown checklist and neutral JSON inventory; observed 1 collision, 1 missing image, and 3 unmapped fields.
- Empty destination: completed with exit 0, wrote both outputs, reported 0 collisions, and included the actionable “destination has no recipes” warning.
- Reverse Tandoor → Mealie: completed with two parsed recipes on each side and one collision.
- Invalid `paprika:` system: exit 2 with “use mealie or tandoor.”
- Missing source folder: exit 2 with the missing-folder path and cause.
- `--help`: names `check` and `demo`, documents the migration job, and exits successfully.

## Live product QA

- Routes `/`, `/demo`, `/privacy`, and `/terms`: HTTP 200, correct route-specific title, exactly one `<main>` and one `<h1>`, no page or console errors, and no axe serious/critical findings.
- `/missing-page`: displays the styled recovery page and returns a real HTTP 404. The browser records the expected failed-resource message for the deliberate 404; normal routes have no console/page errors.
- Keyboard: Skip link focuses first; the sample action becomes focused with Tab and opens `/demo` with Enter. Its designed focus outline is `3px` and visible. **Start for real** exits the demo and removes the demo key.
- Responsive: both `/` and `/demo` at 390×844 have `scrollWidth = clientWidth = 390`; no horizontal overflow or errors.
- Reduced motion: live demo computes animation and transition durations of `0.00001s` under `prefers-reduced-motion: reduce`.
- Service worker: active at `/sw.js`, controller present, `registration.update()` completed without a waiting worker, and the `/demo` heading reloaded successfully offline after first visit.
- Privacy: during fresh `/demo` load, Replay, and Reset, all browser requests stayed at `https://recipe-library-move-check.sociobot.in`; localStorage contained only `demo:recipe-library-move-check:run`. The normal demo is isolated from real data.
- License verification: a browser-originated invalid-license request received HTTP 200 with `Access-Control-Allow-Origin: https://recipe-library-move-check.sociobot.in` and `Cache-Control: no-store`; the UI safely retained the free checker and showed the inactive-license notice.
- Billing: fresh checkout returned HTTP 303 to the hosted Dodo checkout. This resolves the earlier deployment-only 404. A direct invalid-token verification returned `{ "valid": false, "reason": "invalid" }`.
- Rate allowance: from one client, verification requests 1–30 returned 200; request 31 returned **429** with **`Retry-After: 3`**. This satisfies the documented protection requirement.
- Headers and caching: live pages send HSTS, `X-Content-Type-Options: nosniff`, strict referrer policy, permissions policy, and a CSP with `frame-ancestors 'none'`. `sw.js` is `no-cache`; versioned hero, Open Graph, and icon assets are `public, max-age=31536000, immutable`; robots and sitemap have one-hour caching.
- Links: internal landing, demo, privacy, and terms links returned 200; the factory footer target `https://sociobot.in/` returned 200; checkout returned the valid 303 described above.

## Defects by severity

No release-blocking, high, or medium defects found.

### Low — published crate carries unrelated repository artifacts

The packaged crate contains `graphify-out/**`, `package.json`, `package-lock.json`, `playwright.config.ts`, `scripts/copy-404.mjs`, and `tsconfig.json`, none of which a CLI consumer needs. The packaged crate still installed and ran correctly in a clean consumer, so this is not a release blocker, but the Cargo `exclude` list should omit the repository-analysis and web-development artifacts before registry publishing.

## Notes

The optional paid planning pack’s browser fixture proves the return-token storage, verification handling, and worksheet download without a live charge. Fresh production evidence proves that the actual checkout endpoint is now enabled and redirects to hosted checkout. No account sign-in is used or required.
