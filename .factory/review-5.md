# Adversarial first-read review 5 — PASS

**Product:** Recipe Library Move Check  
**Reviewed:** 29 August 2026 UTC  
**Live URL:** <https://recipe-library-move-check.sociobot.in>  
**Code reviewed:** `d55deb610810bd6b58538c75ad84643bf21302b7`  
**Verdict:** **PASS**

There are zero findings. The product is clear on a cold phone visit, has a one-click isolated sample, and its visitor-reliant statements are covered by the declared tests.

## Cold first screen

Opened `/` in separate new Chromium contexts at 390×844 and 1440×900, without scrolling.

| Question | First-read answer | Exact evidence | Result |
| --- | --- | --- | --- |
| What does this do? | Check a recipe-library move before import. | “Check your recipe move before importing” | Confirmed |
| For whom? | Households moving a family library between Mealie and Tandoor. | “For households moving between Mealie and Tandoor who need a checklist before importing the family library.” | Confirmed |
| What should I click first? | Open the completed sample. | “Try it with sample data” and “See a completed check in one click.” | Confirmed |

At 390px, `scrollWidth` and `clientWidth` were both 390. The full fact list was visible in the initial viewport. The 1440px first screen also contained the primary action and all three facts. Both contexts had zero console errors and zero page errors. The ruled notebook, proof marks, clipped recipe image, and terminal evidence form a distinct product-specific identity consistent with `.factory/design.md`; this is not a generic SaaS layout.

## Copy audit

Counts are whitespace-delimited visible words; commands and URLs count as one displayed word. Code blocks are commands, not prose. No sentence exceeds 22 words, no banned marketing term appears, every heading names its section, and all controls name their result.

### Landing-page sentences

| # | Sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | For households moving between Mealie and Tandoor who need a checklist before importing the family library. | 16 | Pass |
| 2 | See a completed check in one click. | 7 | `one-click-demo` |
| 3 | Runs locally on the folders you select. | 7 | `cli-local-only` |
| 4 | Writes a checklist and a JSON inventory you can review before importing. | 12 | `cli-capabilities` |
| 5 | The command-line checker is free. | 5 | `free-cli` |
| 6 | The planning pack costs $19 once. | 6 | `planning-pack` |
| 7 | A lab notebook compares two recipe cards under a magnifying glass. | 11 | Useful hero-image alt |
| 8 | Recording of the real command-line checker finding one possible duplicate, one missing image, and three fields to review. | 17 | Useful recording alt; `sample-findings` |
| 9 | Recorded from recipe-move-check demo --json using the bundled sample. | 9 | `demo-is-real-cli` |
| 10 | The names and ingredients match. | 5 | `sample-findings` |
| 11 | The image files match exactly. | 5 | `sample-findings` |
| 12 | The export points to missing.jpg. | 5 | `sample-findings` |
| 13 | Choose the new owner and recreate family access. | 8 | `sample-findings` |
| 14 | Make a Mealie or Tandoor export from each server. | 9 | Plain instruction |
| 15 | Point the checker at the moving and existing folders. | 9 | Plain instruction |
| 16 | Review possible duplicates, images, fields, owners, and family access. | 8 | Plain instruction |
| 17 | Install the free command-line checker with Cargo. | 7 | `install-command` |
| 18 | The command-line checker reads the folders you select. | 8 | `cli-local-only` |
| 19 | It writes the checklist and JSON inventory paths you name. | 10 | `cli-local-only` |
| 20 | It does not change either export. | 6 | `cli-local-only` |
| 21 | Delete the checklist and inventory to remove its output. | 9 | Direct deletion instruction |
| 22 | Download a printable ownership worksheet and move-day notes. | 8 | `planning-pack` |
| 23 | The checker, checklist, and JSON inventory remain free. | 8 | `free-cli` |
| 24 | Dodo Payments is the online reseller and merchant of record. | 10 | `billing-roles` |
| 25 | Use the support link in your Dodo receipt for order questions and returns. | 13 | `billing-roles` |
| 26 | Check a recipe move before you import. | 7 | Plain footer description |

### Landing headings, labels, and controls

`Mealie ↔ Tandoor check` (3), `Check your recipe move before importing` (6), `Try it with sample data` (5), `Recorded command-line sample` (3), `Replay sample run` (3), `What the check catches` (4), `How to check two recipe libraries` (6), `Export both libraries` (3), `Run one local command` (4), `Review the written checklist` (4), `Run it locally` (4), `Install the checker` (3), `Copy install command` (3), `What the checker reads and writes` (6), `Read the privacy details` (4), `Optional planning pack · $19 once` (5), `Optional family planning pack` (4), `Buy the planning pack` (4), `Enter license token` (3), `Verify license` (2), and `Download planning pack` (3) all pass. They are literal labels or result-naming controls. The finding headings (for example, `Lemon Pasta may already exist`) also identify the item being reviewed.

### README sentences

| # | Sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Check a recipe move before you import the family library. | 10 | Pass |
| 2 | Recipe Library Move Check is a local command-line checker for households moving between Mealie and Tandoor. | 16 | Pass |
| 3 | It inventories recipes and writes a review checklist. | 8 | `cli-capabilities` |
| 4 | It flags possible duplicates, missing images, and fields to review. | 10 | `cli-capabilities` |
| 5 | The command copies the bundled sample into a temporary folder. | 10 | `demo-is-real-cli` |
| 6 | It then runs the same checker used by the check command. | 11 | `demo-is-real-cli` |
| 7 | It prints the checklist path and the folder you can delete afterward. | 12 | `demo-is-real-cli` |
| 8 | Open the isolated browser sample at https://recipe-library-move-check.sociobot.in/?demo=1. | 7 | `demo-privacy` |
| 9 | Its banner includes Reset demo and Start for real. | 9 | `demo-privacy` |
| 10 | Export both libraries to folders, then run: | 7 | Plain instruction |
| 11 | Use --source for the moving library and --destination for the existing library. | 12 | Plain instruction |
| 12 | Recipe JSON files and images may be inside nested folders. | 10 | `nested-export-support` |
| 13 | Tandoor's default export_YYYY-MM-DD.zip is supported. | 5 | `nested-export-support` |
| 14 | The checker reads each recipe ZIP, including recipe.json, step ingredients, and its sibling image. | 14 | `nested-export-support` |
| 15 | The checker reads the two folders and writes only the two paths you name. | 14 | `cli-local-only` |
| 16 | It does not change either export. | 6 | `cli-local-only` |
| 17 | The checklist (--report) and JSON inventory (--inventory) paths must be outside both libraries. | 13 | `safe-output-paths` |
| 18 | It also rejects output files that point to an input or to each other. | 14 | `safe-output-paths` |
| 19 | It does not follow linked directories. | 6 | `safe-output-paths` |
| 20 | It ignores linked JSON files that lead outside the selected folder. | 11 | `safe-output-paths` |
| 21 | The JSON inventory is a JSON file for scripts or another recipe tool. | 13 | Defined on first use |
| 22 | Print the complete result as JSON: | 6 | Plain instruction |
| 23 | Exit code 0 means the check inventoried every recipe file, even when it found review items. | 16 | `exit-codes` |
| 24 | Exit code 1 means it could not inventory one or more recipe JSON files. | 14 | `partial-read-warnings` |
| 25 | It writes partial outputs. | 4 | `partial-read-warnings` |
| 26 | Fix the named files, then run it again before importing. | 10 | Plain recovery instruction |
| 27 | This includes a source folder where every JSON file is invalid. | 11 | `partial-read-warnings` |
| 28 | The partial outputs still identify the problem. | 7 | `partial-read-warnings` |
| 29 | Invalid arguments, unsafe output paths, and unreadable folders return exit code 2. | 12 | `exit-codes` |
| 30 | Run recipe-move-check --help to see every option. | 7 | Plain instruction |
| 31 | Mealie: names, Schema.org ingredients, instruction text, tags, servings, and local image paths. | 12 | `supported-fields` |
| 32 | Tandoor: names, structured steps and ingredients, keywords, servings, local image paths, and the sibling image in its default per-recipe ZIP export. | 21 | `supported-fields` |
| 33 | The JSON inventory keeps unknown field names and lists them for review. | 12 | `unknown-fields` |
| 34 | The checker marks image files that match exactly inside the selected folders. | 12 | `cli-capabilities` |
| 35 | They do not copy an image or grant rights to it. | 11 | Scope limitation |
| 36 | The crate starts at version 0.1.0. | 6 | `crate-package` |
| 37 | The packaged command-line checker contains its source, license, README, changelog, and sample exports. | 13 | `crate-package` |
| 38 | Node is used only for the static documentation site and browser checks. | 12 | Development documentation |
| 39 | npm run build compiles the release command-line checker and writes the deployable site to dist/site/. | 15 | Verified build instruction |
| 40 | Build only the site with npm run build:site. | 8 | Plain instruction |
| 41 | The factory deploys dist/site/ as a static site. | 8 | Deployment documentation |
| 42 | No backend or account is required for the free checker. | 10 | `free-cli` |
| 43 | The checker reads selected folders and writes only your named checklist and inventory. | 13 | `cli-local-only` |
| 44 | Delete those files to remove its output. | 7 | Direct deletion instruction |
| 45 | Delete the temporary folder printed by demo to remove the sample run. | 12 | `demo-is-real-cli` |
| 46 | The optional planning pack sends only its license token to Sociobot. | 11 | `license-privacy` |
| 47 | Read the site Privacy and Terms pages. | 7 | Plain instruction |
| 48 | This checker does not import recipes or sync servers. | 9 | Explicit limit |
| 49 | Similarity scores are review hints, not proof. | 7 | Explicit limit |
| 50 | Export formats change, so inspect the checklist before importing. | 9 | Plain precaution |
| 51 | MIT. | 1 | License label |
| 52 | See LICENSE. | 2 | Plain instruction |
| 53 | Built by Param Factory. | 4 | Attribution |

README headings (`Try the sample`, `Check your exports`, `Supported export fields`, `Install and package`, `Develop, test, and deploy`, `Privacy and deletion`, `Limits`, and `License`) name their sections. No inconsistent public terminology, unexplained first-use format label, metaphorical heading, or non-result-naming button was found.

## Demo and sandbox

One click on **Try it with sample data** opened `/?demo=1` directly into completed, realistic findings: two moving recipes compared with two existing recipes, one possible duplicate, one missing image, and three fields to review. The persistent banner read **“Demo — sample data, nothing is saved”** and included **Reset demo** and **Start for real**. Reset preserved only the isolated `demo:recipe-library-move-check:run` key. Start for real removed that key and went to `/#install`.

A fresh-browser request log for landing → demo → reset → Start for real had no foreign requests. The demo did not touch any non-demo storage key. The dedicated offline claim also passed after service-worker control. The real `cargo run -- demo --json` uses a new temporary directory and the same shipped sample recorded in the site SVG.

The brief explicitly excludes import and live sync. The tool supplies the implied reviewable Markdown checklist and JSON export. An AI step would not improve this local comparison job, so there is no missed-leverage or decorative-AI finding.

## Claims and test results

I cloned the repository into `/tmp/recipe-library-move-check-review5-0GNPaB/repo`, ran `npm ci`, then ran every exact command listed in `.factory/claims.json` separately. All 22 passed:

`sample-findings`, `demo-privacy`, `one-click-demo`, `cli-capabilities`, `free-cli`, `demo-is-real-cli`, `nested-export-support`, `cli-local-only`, `safe-output-paths`, `exit-codes`, `partial-read-warnings`, `family-review-empty-state`, `supported-fields`, `unknown-fields`, `license-privacy`, `cached-license-notice`, `button-focus-contrast`, `offline-demo`, `planning-pack`, `billing-roles`, `crate-package`, and `install-command`.

I cross-checked every claim-like landing statement against this manifest. All behavior, privacy, price, package, and merchant promises have a corresponding outcome test; the remaining operational/limit wording is direct instruction or a stated non-capability. There is no unlisted claim.

`npm run build` passed and produced `dist/site/` (site JavaScript: 5.83 kB gzip). `npm test` passed all 44 local tests. After that release build, `PLAYWRIGHT_BASE_URL=https://recipe-library-move-check.sociobot.in npx playwright test` passed all 44 tests against production.

## Earlier-finding audit

I read every earlier review, polish report, and prior handoff. These were checked in live code and with the fresh-clone commands, not accepted from their status labels.

| Earlier finding(s) | Current verification |
| --- | --- |
| F-1-01 | `crate-package` passed; the consumer package excludes web, test, factory, and analysis files. |
| F-1-02, F-1-08 | The self-hosted SVG is tied to the shipped CLI demo and normal check by `demo-is-real-cli`. |
| F-1-03–F-1-07 | Concrete, claimed checklist wording; free local operation; immutable exports; paid contents; and full CLI capability are confirmed. |
| F-1-09–F-1-17 | Nested exports, local-only output, exits, field mapping, unknown fields, license privacy, and all sample evidence are covered by passing claims. |
| F-1-18–F-1-21 | Public copy uses check/possible duplicate/JSON inventory/checklist, defines JSON inventory, uses literal headings and result-naming controls, and stays within the word cap. |
| F-2-1 | Offer and Terms consistently identify Dodo Payments and the receipt support route; `billing-roles` matches the recorded disclosure. |
| F-3-1–F-3-6 | README compatibility, path-safety, error, terminology, and command-line wording are short and concrete. |
| F-3-7–F-3-11 | Required desktop/mobile facts fit cold viewports; one-click demo and install are claimed; 404 wording and title are literal and complete. |
| F-4-1 | Visitor copy says image files match exactly rather than using unexplained hash jargon. |

## Structure, accessibility, privacy, and links

- `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` returned 200; `/missing-page` returned the designed HTTP 404.
- Each route has one `h1` and one `main`, a route-specific title and description, canonical, OG/Twitter metadata, favicon, and consistent header/footer with Privacy and Terms.
- Keyboard activation, focus transfer to the new `h1`, browser Back, skip link, reduced motion, 320/390px layouts, touch targets, and axe serious/critical checks passed.
- Internal routes, `robots.txt`, `sitemap.xml`, the Param Factory link, and the expected checkout redirect were checked. No dead link was found.
- Live headers include CSP with response-header `frame-ancestors 'none'`, `nosniff`, strict referrer policy, HSTS, and a restrictive permissions policy. The browser demo request log had only same-origin product requests.

## What would make this perfect

Nothing remains in scope. Keep the claim tests, the self-hosted recording, and the isolated demo flow intact as the product evolves.
