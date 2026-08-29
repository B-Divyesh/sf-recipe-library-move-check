# Independent verification 4 — PASS

**Candidate:** `7b584eecbf483a2b5e958f186676cf609e438608`
**Live URL:** https://recipe-library-move-check.sociobot.in
**Verified:** 29 August 2026 (UTC)
**Decision:** **PASS — candidate is releasable.**

## Scope and deployment identity

Verification used a fresh detached worktree at the exact candidate commit and a clean `npm ci` installation. A fresh live HTTPS `/` response and the candidate's newly built `dist/site/index.html` were byte-identical:

```
e86df0497ffbfb12fd88922f225b53838dcce3695f01e5fc69a0cd0f8a53dd55
```

The previous deployment-only concern is not reproducible: the live product is this candidate.

## Cold first-read and demo

Pass. A fresh live page says **“Check your recipe move before importing”** (what it does), names **households moving between Mealie and Tandoor** (who it is for), and presents a visible **“Try it with sample data”** action with **“See a completed preflight in one click.”** The action opens `/demo`, which immediately shows realistic completed collision, missing-image, and field-review findings.

The demo has the persistent **“Demo — sample data, nothing is saved”** banner, **Reset demo**, and **Start for real**. In a new browser context, all requests during demo load, Replay, and Reset stayed on `https://recipe-library-move-check.sociobot.in`; its sole storage key was `demo:recipe-library-move-check:run`, and leaving demo removed it.

## Required claims contract

All six exact commands listed in `.factory/claims.json` passed from the clean installed candidate. Each invokes linting, typechecking, Rust tests, production-site build, and the declared demo sandbox before its selected claim test.

| Claim | Exact command | Result |
| --- | --- | --- |
| `sample-findings` | `npm test -- --grep @claim:sample-findings` | PASS |
| `demo-privacy` | `npm test -- --grep @claim:demo-privacy` | PASS |
| `cli-output` | `npm test -- --grep @claim:cli-output` | PASS |
| `cli-local-only` | `npm test -- --grep @claim:cli-local-only` | PASS |
| `offline-demo` | `npm test -- --grep @claim:offline-demo` | PASS |
| `planning-pack` | `npm test -- --grep @claim:planning-pack` | PASS (recorded valid Sociobot response) |

## Local quality gates and CLI QA

- `npm ci`: PASS; audit reported 0 vulnerabilities.
- `npm test`: PASS — `cargo fmt --check`, strict `cargo clippy --all-targets -- -D warnings`, `tsc --noEmit`, six Rust tests, site build, and 15 Playwright tests all passed.
- `npm run build`: PASS — release binary and `dist/site` produced. Initial JS is 15,821 bytes raw / 5,750 bytes gzip; CSS is 12,760 bytes raw / 3,760 bytes gzip, within the static budgets.
- `cargo package --allow-dirty --no-verify`: PASS — 32 files, 315.9 KiB unpacked / 42.8 KiB compressed.
- Clean consumer: unpacked the generated `.crate`, installed it into a new Cargo install root, and ran `recipe-move-check demo --json`. PASS: it wrote a Markdown checklist and JSON inventory and reported two source recipes, two destination recipes, one collision, one missing image, three unmapped fields, and two ownership reviews.

Independent CLI cases:

- Normal Mealie → Tandoor examples wrote both named outputs and reported 1 collision, 1 missing image, and 3 unmapped fields.
- Empty destination completed with exit 0, wrote both outputs, had 0 collisions, and stated that the destination had no recipes.
- Missing source folder and unsupported system both exited 2 with actionable messages.
- `--help` documents the `check` and `demo` public commands.

## Live browser, privacy, accessibility, and platform QA

- `/`, `/demo`, `/privacy`, and `/terms` each returned 200 with their expected route title, exactly one `<main>` and one `<h1>`, no page/console errors, and no axe serious/critical violations. The real `/missing-page` returned 404 and displayed the styled recovery page; its expected browser console failed-resource entry is only for that deliberate 404.
- Desktop and 390×844 mobile had no horizontal overflow. Keyboard Tab starts at the skip link, reaches the sample action, and Enter opens `/demo`. The visible focus style is a 3px solid outline plus 6px blue ring.
- Under reduced motion, scroll behavior is `auto` and UI animation/transition duration computes to `0.00001s`.
- In a fresh context, `/demo` activated `/sw.js`; `registration.update()` left no waiting worker; setting the context offline and reloading retained the sample demo heading.
- The live landing load made only same-origin document and original hero-image requests. No third-party fonts or scripts are loaded.
- Live headers include HSTS, `X-Content-Type-Options: nosniff`, strict referrer policy, permissions policy, and CSP with `frame-ancestors 'none'`. Versioned visual assets are `public, max-age=31536000, immutable`; `sw.js` is `no-cache`; unknown pages are genuine HTTP 404s.
- No sign-in is present or required.

## Billing endpoint and rate allowance

- A fresh checkout request to the documented Sociobot endpoint returned HTTP 303 to the hosted Dodo checkout.
- A browser-originated invalid license verification returned HTTP 200, `{ "valid": false, "reason": "invalid" }`, `Access-Control-Allow-Origin: https://recipe-library-move-check.sociobot.in`, and `Cache-Control: no-store`; the UI kept the free checker usable and showed the inactive-license notice.
- From one client/IP, an initial verification plus 29 further probes returned 200. The next request and one further request returned **429** with **`Retry-After: 2`**. Observed allowance: **30 successful verification requests per active rate window**.

## Defects by severity

No release-blocking, high, or medium defects found.

### Low — crate contains non-CLI repository artifacts

The packaged crate includes `graphify-out/**`, Node/Playwright configuration, `package.json`, `package-lock.json`, `tsconfig.json`, and `scripts/copy-404.mjs`. This does not break installation or the public CLI, but `Cargo.toml` should exclude unrelated analysis and web-development artifacts before registry publication.
