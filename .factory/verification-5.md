# Independent verification 5 — FAIL

**Candidate:** `89ad5b761c9969cf830b2e82176e752e501ac20c`

**Live URL:** https://recipe-library-move-check.sociobot.in

**Verified:** 29 August 2026 (UTC)

**Decision:** **FAIL — not releasable.**

The mandatory claim tests and standard quality gates pass, and production matches the candidate. Independent boundary testing nevertheless found two high-severity failures in the core local checker: it can overwrite a selected export while returning success, and it can omit a malformed recipe from the human-facing checklist without telling the user. These violate the product's read-only and preflight-loss promises.

## Cold first-read gate — PASS

A fresh production visit answers all three required questions on the first screen:

- What: **“Check your recipe move before importing.”**
- For whom: **“For households moving between Mealie and Tandoor…”**
- First action: **“Try it with sample data”**, paired with **“See a completed check in one click.”**

The action opens the completed sample immediately. The demo banner says **“Demo — sample data, nothing is saved”** and provides **Reset demo** and **Start for real**.

## Clean-checkout acceptance runs

I created a detached clean worktree at the exact candidate (`/tmp/rlmc-verify5-clean`), ran `npm ci` (0 vulnerabilities), and ran every `.factory/claims.json` command separately.

| Claim | Exact command | Result |
| --- | --- | --- |
| `sample-findings` | `npm test -- --grep @claim:sample-findings` | PASS |
| `demo-privacy` | `npm test -- --grep @claim:demo-privacy` | PASS |
| `cli-capabilities` | `npm test -- --grep @claim:cli-capabilities` | PASS |
| `free-cli` | `npm test -- --grep @claim:free-cli` | PASS |
| `demo-is-real-cli` | `npm test -- --grep @claim:demo-is-real-cli` | PASS |
| `nested-export-support` | `npm test -- --grep @claim:nested-export-support` | PASS |
| `cli-local-only` | `npm test -- --grep @claim:cli-local-only` | PASS |
| `exit-codes` | `npm test -- --grep @claim:exit-codes` | PASS |
| `supported-fields` | `npm test -- --grep @claim:supported-fields` | PASS |
| `unknown-fields` | `npm test -- --grep @claim:unknown-fields` | PASS |
| `license-privacy` | `npm test -- --grep @claim:license-privacy` | PASS |
| `offline-demo` | `npm test -- --grep @claim:offline-demo` | PASS |
| `planning-pack` | `npm test -- --grep @claim:planning-pack` | PASS |
| `billing-roles` | `npm test -- --grep @claim:billing-roles` | PASS |
| `crate-package` | `npm test -- --grep @claim:crate-package` | PASS |

Additional clean-checkout gates:

- `npm test`: PASS — strict Rust format/Clippy, TypeScript, 6 Rust tests, production-site build, and 35 Playwright tests.
- `npm run build`: PASS — release CLI plus `dist/site/`.
- `cargo package --no-verify`: PASS — 17 consumer files, 53.0 KiB unpacked / 15.3 KiB compressed.
- Fresh consumer install from the generated `.crate`: PASS. The installed `recipe-move-check demo --json` produced both files and the expected `2/2/1/1/3/2` summary.
- Live Playwright suite: PASS — 35/35 against the production URL.

The passing `cli-local-only` claim test is too narrow: it uses outputs outside the exports. A valid output path inside an export disproves the claim, as documented below.

## Release-blocking findings

### High — a named output can overwrite the selected export and still exit 0

The CLI does not reject report or inventory paths inside either selected export. Using a copied source recipe as `--report` returned exit `0`, printed “Check complete,” and replaced that recipe JSON with Markdown.

Evidence from a temporary copy of the bundled exports:

```text
report: /tmp/recipe-move-qa-GULosV/source/lemon-pasta/recipe.json
exit: 0
before SHA-256: 947f753060b81ea8d1d54ba57ee6c34c1c8def36dc9406a7f999182ab73256de
after SHA-256:  e59bff4adcf6d659ea675dbf3c7ec5aecd665a1962e3867c3676678c49dcad8c
changed: yes
```

This directly contradicts “It does not change either export,” `.factory/claims.json` claim `cli-local-only`, and the brief's local preflight safety boundary. The default output names also make this possible when a person runs the command from inside an export folder. Output paths must be canonicalized and rejected when they overlap either export or an existing input file.

### High — malformed recipe files disappear from the human checklist

With one valid source recipe and one malformed `broken.json`, the command returned exit `0` and printed:

```text
Check complete: 0 possible duplicate(s), 0 missing image(s), 0 field review item(s).
```

`stderr` was empty, and the Markdown checklist contained no warning, filename, or skipped-file section. The machine JSON did contain one item in `warnings`, but the normal CLI and the reviewable checklist—the product's primary workflow—gave no indication that a source recipe was omitted.

This defeats the stated job of identifying what may be lost before import. A successful check must make skipped/unreadable/invalid files prominent in stdout and the checklist, or fail with a non-zero exit when complete coverage is not possible.

### Medium — identical output paths silently destroy one promised output

Passing the same path for `--report` and `--inventory` returned exit `0`. The inventory write replaced the checklist, leaving one JSON file while the result still named both outputs. Reject identical or aliased output paths before writing.

### Medium — primary button focus indicator misses the 3:1 contrast requirement

Keyboard order and operation work, but `.button` overrides the global focus `box-shadow`. On **Try it with sample data**, the computed focus indicator is a `3px` `#FFF9E8` outline against the `#F4EEDA` page, only **1.10:1**. The remaining dark offset shadow is also present when unfocused, so it does not identify focus. This affects the primary sample, install, checkout, and related button-styled links.

### Low — a cached invalid license loses its recovery notice after reload

After submitting an invalid token, the page correctly showed “This license is no longer active” and a buy link. Reloading within the 24-hour cache window made no second request but replaced that notice with the generic merchant text, even though the cached verdict remained `{ valid: false }`. Paid-unlock guidance requires the inactive-license notice to remain visible.

### Low — the empty family-review section has no state text

In a valid Tandoor-to-Mealie run where all source recipes have owners and no household field, the generated Markdown contains `## Family review` followed immediately by `## Before importing`. Other empty sections explain that nothing was found; this one does not.

## CLI end-to-end and recovery evidence

- Bundled Mealie → Tandoor: 2 moving, 2 existing, 1 possible duplicate, 1 missing image, 3 fields, 2 ownership reviews; both outputs written.
- Bundled Tandoor → Mealie: 2 moving, 2 existing, 1 possible duplicate, 0 missing images, 0 fields, 0 ownership reviews.
- Empty source: exit `2`, no outputs, actionable “no recipes were found… Check the folder and export type.”
- Missing source folder: exit `2` with the missing path.
- Unsupported system: exit `2` with “use mealie or tandoor.”
- Image traversal and absolute paths: existing tests confirm they are marked `outside_export` and never hashed.
- Two matching destination entries: the checker reports the best match for the moving recipe. This behavior is consistent with treating collision count as affected source recipes, but should be documented.

## Live deployment identity

The deployment-only failure reported in older work is not present. The fresh candidate build and live deployment match byte-for-byte for the HTML shell and every runtime asset checked.

```text
index.html SHA-256 (local and live):
67d35ac72a819bd204ca1b71de1c015fab8a8fd239b66e2d9fba282e965c09b2
```

Matching hashes were also confirmed for the hero image, terminal recording, favicon, Apple icon, Open Graph image, service worker, `robots.txt`, and `sitemap.xml`.

## Live browser, privacy, accessibility, and PWA evidence

- `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms`: HTTP 200, route-specific title, `lang=en`, exactly one `<main>` and one `<h1>`.
- `/missing-page`: genuine HTTP 404 with the styled recovery page.
- Axe: no serious or critical violations on all five real routes.
- Console/page errors: none on all five routes.
- Desktop and 390×844 mobile: no horizontal overflow. At 390px, the full first-screen facts end at y=787 within the 844px viewport; no visible interactive target is below 44×44px.
- Text enlarged to 200% at 390px: no horizontal overflow or clipped tested text.
- Keyboard: skip link is first; the primary sample action is reachable and Enter opens `/?demo=1`. The contrast defect above remains.
- Reduced motion: animation and transition duration compute to `0.00001s`, one iteration, and scroll behavior is `auto`.
- Demo request log: only same-origin document/asset requests; no analytics, third-party fonts, or recipe-data requests.
- Demo storage: only `demo:recipe-library-move-check:run`; Reset retains the isolated key and Start for real removes it.
- License request: one GET to the documented Sociobot verify URL, no request body, with only the entered token as query data.
- Service worker: active and controlling, `registration.update()` leaves no installing/waiting worker, and the sample reloads offline.
- `/opt/fleet/lib/verify-url.sh`: PASS; 757 ms load, no console/page errors, correct title/lang/h1/main/alt/button checks.

## Headers, caching, budgets, and performance

- HTML: `public, must-revalidate, max-age=30`.
- Hashed JS, CSS, and visual assets: `public, max-age=31536000, immutable`.
- Service worker: `no-cache`.
- Security headers include HSTS, `nosniff`, strict-origin referrer policy, permissions policy, and CSP with `frame-ancestors 'none'`.
- Initial JS: 16.16 KB raw / 5.83 KB gzip; CSS: 13.32 KB raw / 3.88 KB gzip; hero WebP: 146.3 KB. All are within contract budgets.
- Fresh mobile Lighthouse on `/?demo=1`: Performance **97**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 0.8 s, LCP 0.8 s, CLS 0, TBT 210 ms.

## Billing endpoint and allowance

- Checkout endpoint: HTTP 303 to `checkout.dodopayments.com`.
- Invalid verification: HTTP 200 with `{ valid: false, reason: "invalid" }`, production-origin CORS, and `Cache-Control: no-store`.
- One client received 30 successful verification responses. Request 31 and the next four returned HTTP **429** with **`Retry-After: 4`**. Observed allowance: **30 requests per active rate window**.
- No sign-in exists or is required.

## Product and design contract

The handwritten migration-lab-notebook system is product-specific and documented with palette, typography, spacing, motion, and original-asset provenance. The mobile composition remains usable. No AI feature is warranted for this deterministic local comparison job, so there is no missed-leverage finding.

## Required next steps

1. Validate both output paths before reading/writing: reject identical/aliased outputs and any output resolving inside either export or to an input file.
2. Surface every skipped/unreadable/invalid file in stderr, the Markdown checklist, summary counts, and scripted JSON; decide and document whether partial checks exit non-zero.
3. Add claim tests covering both unsafe-output cases and partial-invalid exports.
4. Restore a ≥3:1 focus indicator for `.button:focus-visible` after component styles.
5. Preserve the inactive-license recovery notice from the cached invalid verdict and add the family-review empty state.
