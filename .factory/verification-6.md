# Independent verification 6 — FAIL

**Candidate:** `2fa212b5ecffb52f80b8285a24f75e81fbef459d`

**Live URL:** https://recipe-library-move-check.sociobot.in

**Verified:** 29 August 2026 (UTC)

**Decision:** **FAIL — not releasable.**

The deployment is available, matches the candidate, and passes the standard build, browser, accessibility, privacy, performance, package, and declared-claim test suites. Independent product testing nevertheless found release-blocking defects in the real CLI job: the checker cannot consume Tandoor's current default export structure, silently drops syntactically valid recipe-like JSON without a name while reporting a complete check, and does not honor its partial-output promise when every source JSON file is malformed.

## Cold first-read gate — PASS

A fresh browser context at the live root answered all three required questions on the first screen:

- What it does: **“Check your recipe move before importing.”**
- For whom: **“For households moving between Mealie and Tandoor…”**
- What to click first: **“Try it with sample data”**, beside **“See a completed check in one click.”**

One click opened `/?demo=1` with completed findings. The persistent banner said **“Demo — sample data, nothing is saved”** and provided **Reset demo** and **Start for real**. Evidence: `.factory/verification-evidence-6/live-cold-desktop.png`.

## Required claims gate

The supplied `/work/repo` tree already contained unrelated modified and untracked `graphify-out` files, so I created a detached worktree at the exact candidate in `/tmp/recipe-move-qa.TDKgmY`. After `npm ci` (24 packages, 0 vulnerabilities), all 20 exact commands from `.factory/claims.json` passed separately:

| Claim | Exact command | Result |
| --- | --- | --- |
| `sample-findings` | `npm test -- --grep @claim:sample-findings` | PASS |
| `demo-privacy` | `npm test -- --grep @claim:demo-privacy` | PASS |
| `cli-capabilities` | `npm test -- --grep @claim:cli-capabilities` | PASS |
| `free-cli` | `npm test -- --grep @claim:free-cli` | PASS |
| `demo-is-real-cli` | `npm test -- --grep @claim:demo-is-real-cli` | PASS |
| `nested-export-support` | `npm test -- --grep @claim:nested-export-support` | PASS |
| `cli-local-only` | `npm test -- --grep @claim:cli-local-only` | PASS |
| `safe-output-paths` | `npm test -- --grep @claim:safe-output-paths` | PASS |
| `exit-codes` | `npm test -- --grep @claim:exit-codes` | PASS |
| `partial-read-warnings` | `npm test -- --grep @claim:partial-read-warnings` | PASS |
| `family-review-empty-state` | `npm test -- --grep @claim:family-review-empty-state` | PASS |
| `supported-fields` | `npm test -- --grep @claim:supported-fields` | PASS |
| `unknown-fields` | `npm test -- --grep @claim:unknown-fields` | PASS |
| `license-privacy` | `npm test -- --grep @claim:license-privacy` | PASS |
| `cached-license-notice` | `npm test -- --grep @claim:cached-license-notice` | PASS |
| `button-focus-contrast` | `npm test -- --grep @claim:button-focus-contrast` | PASS |
| `offline-demo` | `npm test -- --grep @claim:offline-demo` | PASS |
| `planning-pack` | `npm test -- --grep @claim:planning-pack` | PASS |
| `billing-roles` | `npm test -- --grep @claim:billing-roles` | PASS |
| `crate-package` | `npm test -- --grep @claim:crate-package` | PASS |

The command aggregate was `CLAIM_TOTAL 20`, `CLAIM_FAILURES 0`. The first attempt before dependency installation stopped at `tsc: not found`; no product test failed, and the clean installed rerun above is the acceptance result.

The passing `supported-fields` and `partial-read-warnings` tests do not cover the counterexamples below. Their claim wording is broader than their fixtures prove.

## Release-blocking findings

### High — current Tandoor default exports are not supported

The shipped Tandoor fixture is not representative of Tandoor's current default export shape. Fresh upstream source inspection at Tandoor commit `8bb70710d5544d5d543e01a8e82a3f8d1509f8ba` showed:

- `cookbook/integration/default.py` writes an outer `export_YYYY-MM-DD.zip` containing one `<recipe-id>.zip` per recipe.
- Each inner ZIP contains `recipe.json` plus a sibling `image.<extension>`.
- `RecipeExportSerializer` puts ingredients under each item in `steps[].ingredients`; there is no top-level `ingredients` field or image-path field.

The candidate recursively scans only loose `.json` files. A representative extracted outer export folder containing `123.zip` returned exit `2`:

```text
Could not complete the check: no recipes were found in .../outer. Check the folder and export type
```

After manually extracting the inner ZIP too, the command returned exit `0` but produced this incomplete record:

```json
{
  "name": "Real Tandoor Soup",
  "ingredients": [],
  "instructions": ["Simmer gently."],
  "image": { "declared_path": null, "status": "not_declared", "sha256": null },
  "unmapped_fields": ["servings_text"]
}
```

The source fixture contained one nested ingredient and `image.jpg`. This contradicts claim `supported-fields`, weakens duplicate detection that depends on ingredient and image evidence, and prevents the stated Mealie/Tandoor migration job from working end to end.

### High — valid recipe-like JSON can be silently omitted from a “complete” check

I placed `valid.json` beside a syntactically valid `nameless.json` containing an id, ingredients, and instructions but no `name`/`title`. The checker returned exit `0`, counted one source recipe, emitted `warnings: []`, omitted the second file from the inventory, and did not mention `nameless.json` or its id in the checklist. The checklist therefore says **“Every JSON file was read”** even though one candidate record was discarded.

`parse_recipe` returns `None` without a warning for non-object values, objects without a usable name, and such items inside arrays. A damaged or changed supported export can therefore lose recipes without stopping an import plan. That conflicts with the product's core purpose of finding what may be lost.

### High — an all-malformed source violates the partial-result claim

With a source folder containing only `broken.json`, the command returned exit `2` with the generic “no recipes were found” message. It did not name `broken.json` and wrote neither the checklist nor inventory. This contradicts the declared claim:

> If a recipe JSON file cannot be read, the checker marks the checklist and inventory as partial, names the file in human output, and returns exit code 1.

The current implementation gathers the parse warning, then returns early when `source_recipes` is empty and discards it. The existing claim test passes only because it includes a second valid recipe.

### Medium — JSON symlinks escape the selected-folder boundary

A selected source folder contained `inside.json` plus `linked.json`, a symlink to `../outside/private.json`. The checker returned exit `0`, `warnings: []`, and inventoried both **Inside Recipe** and **Outside Private Recipe**. Image paths already receive a canonical-root check, but the recursive JSON walker follows file and directory symlinks without enforcing the export root.

This violates the plain privacy promise that the CLI reads the folders the user selects and can copy unintended local content into the generated inventory.

### Medium — the same folder is accepted as both libraries

Using one canonical folder for both `--source` and `--destination` returned exit `0` and reported its only recipe as a possible duplicate of itself. The CLI should reject this invalid input instead of producing a plausible but meaningless checklist.

## Clean build, test, and package evidence

- `npm ci`: PASS; 24 packages, 0 vulnerabilities.
- `npm test`: PASS — `cargo fmt --check`, strict Clippy, `tsc --noEmit`, 8 Rust tests, production site build, and 40 Chromium tests.
- `npm run build`: PASS — release CLI and `dist/site/` produced.
- `cargo package`: PASS including Cargo's package verification; 17 files, 63.6 KiB unpacked / 17.3 KiB compressed.
- Clean consumer: unpacked the `.crate`, installed it into a fresh Cargo root, and ran `recipe-move-check --help` and `recipe-move-check demo --json`. Both passed; demo totals were 2 moving, 2 existing, 1 possible duplicate, 1 missing image, 3 fields, and 2 ownership reviews.
- Previously failing unsafe-output regression: PASS. A report path inside the source export returned exit `2`; the source SHA-256 stayed unchanged.
- Normal sample, reverse direction, empty destination, unsupported system, missing folder, overlapping outputs, malformed-plus-valid input, and nested fixture cases are covered by passing unit/browser tests. The additional counterexamples above are not.

## Deployment identity — PASS

The prior deployment-only failure is not present. Fresh local production output and HTTPS responses matched byte-for-byte for the HTML shell, JS, CSS, hero, terminal recording, favicon, Apple icon, Open Graph image, service worker, `robots.txt`, and `sitemap.xml`.

Key hashes:

| Asset | Local and live SHA-256 |
| --- | --- |
| `index.html` | `371a0e3228d1e3bc6e59565409e307e62e1d55ae6bc5dd80ce64cbc2a1d7ccb9` |
| `assets/index-BMZHWdEP.js` | `975651c4e4207f7a85a4d17e3ee195f93c914baae144e9e1d2bd2c045cc2e43b` |
| `assets/index-DJu95Adu.css` | `be014fe0b3ae17b0e1218493c712d493a76732341425f7c31b93a005700251f7` |
| `sw.js` | `27f701d50ca64658f9da2755f280ecebdc6ba55a6bdfb06cc4cacf6ca96fb454` |

`/opt/fleet/lib/verify-url.sh` passed against production: HTTP 200, 771 ms load, correct title/lang, one h1, one main, alt text present, labeled buttons, and no console/page errors. The complete live Playwright suite passed 40/40.

## Live browser, privacy, accessibility, and PWA evidence

- Routes `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` returned 200 with route-specific titles, one h1, one main, and no serious/critical axe findings. `/missing-page` returned a genuine 404 with the styled recovery page.
- Desktop and 390×844 mobile had no console/page errors. Mobile `scrollWidth` equaled `clientWidth` at 390 px; the three first-screen facts ended at y=787; no visible target was under 44×44 px. Evidence: `.factory/verification-evidence-6/live-mobile-390.png`.
- At simulated 200% root text size, `/`, demo, privacy, and terms retained `scrollWidth = clientWidth = 390` and their complete page landmarks/headings.
- Keyboard: the skip link received first focus; Tab reached **Try it with sample data**; its computed outline was solid 3 px `rgb(23, 44, 53)` with a 3 px offset; Enter opened the demo and focus moved to its h1.
- Reduced motion: computed animation and transition duration was `0.00001s`, one iteration, and scroll behavior was `auto`.
- Demo privacy: the cold demo, Replay, Reset, and offline reload made only same-origin GETs for the document and terminal recording. No analytics, third-party font/script, or recipe-data request occurred. The only storage key was `demo:recipe-library-move-check:run`; the passing live test also confirmed Start for real removes it.
- PWA: service worker `/sw.js` was active and controlling with cache `recipe-move-check-v7`; `registration.update()` left no waiting/installing worker; the demo heading reloaded offline.
- Internal links returned 200, Sociobot returned 200, and the purchase link returned a hosted-checkout redirect.

## Headers, caching, bundles, and performance

- HTML: `Cache-Control: public, must-revalidate, max-age=30`.
- Hashed JS, CSS, and hero assets: `public, max-age=31536000, immutable`.
- Service worker: `Cache-Control: no-cache`.
- Security headers: HSTS, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, restricted Permissions Policy, and CSP with `frame-ancestors 'none'`.
- Initial JS: 16.23 KB raw / 5.81 KB gzip; CSS: 13.46 KB raw / 3.89 KB gzip; hero WebP: 146.29 KB. All are within contract budgets.
- Fresh mobile Lighthouse on `/?demo=1`: Performance **100**, Accessibility **100**, Best Practices **100**, SEO **100**; FCP 0.8 s, LCP 0.8 s, TBT 60 ms, CLS 0. Evidence: `.factory/verification-evidence-6/lighthouse-mobile.json`.

## Billing endpoint and request allowance

- Checkout returned HTTP `303` to `https://checkout.dodopayments.com/...`; the earlier deployment-only 404 is resolved.
- An invalid verification token returned HTTP `200`, `{ "valid": false, "reason": "invalid" }`, and `Cache-Control: no-store`.
- From one client, verification requests 1–30 returned 200. Requests 31–35 returned **429** with **`Retry-After: 3`** initially (2 on the last probe). Observed allowance: **30 requests per active window**.
- No sign-in is present or required, so the Entra authority requirement does not apply.

## Product, copy, and design review

The live first screen, demo controls, privacy/legal pages, package documentation, and product-specific handwritten migration-notebook system satisfy the presentation contract. `.factory/design.md` records the palette, type, spacing, motion, rationale, and original asset provenance. The deterministic comparison job does not warrant a runtime AI dependency, so there is no missed-leverage finding.

The material claim problem is not missing claim entries; it is that `supported-fields` and `partial-read-warnings` pass against narrow fixtures while remaining false for realistic boundary inputs.

## Required repairs and retest

1. Accept Tandoor's default outer/inner ZIP export directly, or provide and enforce a documented preparation command that produces a supported folder. Parse `steps[].ingredients`, associate sibling `image.*`, and add a fixture derived from the upstream export serializer.
2. Treat every JSON candidate that cannot become a recipe as a completeness warning with its file/index and reason. Do not return exit 0 or print “Every JSON file was read” when any candidate was discarded.
3. Preserve and report warnings when zero source recipes parse. Either write the promised marked partial outputs and exit 1, or narrow the public claim and provide an equally actionable failure artifact.
4. Canonicalize every discovered JSON path, reject/skip targets outside the selected export root, and avoid following directory symlinks.
5. Reject identical canonical source/destination roots.
6. Add claim tests for a real Tandoor default export, deeply extracted Tandoor fields/image, all-malformed input, valid nameless records, JSON symlink escape, and identical library roots.
