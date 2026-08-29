# Adversarial first-read review 4 — FAIL

**Product:** Recipe Library Move Check  
**Reviewed:** 29 August 2026 UTC  
**Live URL:** <https://recipe-library-move-check.sociobot.in>  
**Code reviewed:** `838c23a83e5ebb5971c1605a506f7ba9a9a23814`  
**Verdict:** **FAIL**

The product is clear, tryable, local-first, and technically verified. It does not pass this round because one visitor-facing sample explanation still uses unexplained jargon. The acceptance standard requires zero findings.

## Cold first screen

I opened the live URL in fresh Chromium contexts at 390×844 and 1440×900, without scrolling.

| Question | First-read answer | Exact evidence | Result |
| --- | --- | --- | --- |
| What does this do? | It checks a recipe-library move before import. | “Check your recipe move before importing” | Confirmed |
| For whom? | Households moving a family recipe library between Mealie and Tandoor. | “For households moving between Mealie and Tandoor who need a checklist before importing the family library.” | Confirmed |
| What should I click first? | Open the completed sample. | “Try it with sample data” and “See a completed check in one click.” | Confirmed |

At 390px there was no horizontal overflow; the three facts ended at y=776.8, inside the 844px viewport. At desktop the facts ended at y=894.9, inside the 900px viewport. Neither cold context reported a console error or page error. The warm ruled-paper notebook treatment is specific to checking family recipe moves, matches `.factory/design.md`, and is not a generic SaaS template.

## Findings

### Minor

#### F-4-1 — `image hash` is unexplained jargon in the sample evidence

**Exact locations:** Landing sample finding: “Same name, ingredient list, and image hash.” README, “Image hashes identify equal files inside the selected folders.”

**Why this fails:** A household visitor can understand that names, ingredients, and images may match. They cannot be expected to know what an image hash is or why it is evidence. This is the concrete proof displayed in the product preview, so the jargon makes the most useful first example less clear. The CLI may retain the technical field name internally; the visitor-facing explanation should say what it means.

**Concrete fix:** Replace the landing text with: “The names and ingredients match. The image files match exactly.” Replace the README sentence with: “The checker marks image files that match exactly inside the selected folders.” Update `@claim:sample-findings` to assert the new browser wording while leaving the CLI's raw hash evidence covered by `@claim:cli-capabilities`.

## Copy audit

Counts are whitespace-delimited visible words; inline command/URL strings count as their displayed words. Code blocks are commands, not prose. No audited sentence exceeds 22 words. Apart from F-4-1, the copy has no banned marketing adjective, empty slogan, inconsistent product term, or non-result-naming control.

### Landing sentences

| # | Sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Check a recipe move before you import. | 7 | Pass |
| 2 | Runs locally on the folders you select. | 7 | `cli-local-only` |
| 3 | Writes a checklist and a JSON inventory you can review before importing. | 12 | `cli-capabilities` |
| 4 | The command-line checker is free. | 5 | `free-cli` |
| 5 | The planning pack costs $19 once. | 6 | `planning-pack` |
| 6 | Recorded from recipe-move-check demo --json using the bundled sample. | 9 | `demo-is-real-cli` |
| 7 | Same name, ingredient list, and image hash. | 7 | **F-4-1** |
| 8 | The export points to missing.jpg. | 5 | `sample-findings` |
| 9 | Choose the new owner and recreate family access. | 8 | `sample-findings` |
| 10 | Download a printable ownership worksheet and move-day notes. | 8 | `planning-pack` |
| 11 | The checker, checklist, and JSON inventory remain free. | 8 | `free-cli` |
| 12 | Dodo Payments is the online reseller and merchant of record. | 10 | `billing-roles` |
| 13 | Use the support link in your Dodo receipt for order questions and returns. | 13 | `billing-roles` |
| 14 | For households moving between Mealie and Tandoor who need a checklist before importing the family library. | 16 | Pass |
| 15 | See a completed check in one click. | 7 | `one-click-demo` |
| 16 | Make a Mealie or Tandoor export from each server. | 9 | Pass |
| 17 | Point the checker at the moving and existing folders. | 9 | Pass |
| 18 | Review possible duplicates, images, fields, owners, and family access. | 9 | Pass |
| 19 | Install the free command-line checker with Cargo. | 7 | `install-command` |
| 20 | The command-line checker reads the folders you select. | 8 | `cli-local-only` |
| 21 | It writes the checklist and JSON inventory paths you name. | 10 | `cli-local-only` |
| 22 | It does not change either export. | 6 | `cli-local-only` |
| 23 | Delete the checklist and inventory to remove its output. | 9 | Pass; direct deletion instruction |

The two image alt sentences are also concise and useful: “A lab notebook compares two recipe cards under a magnifying glass.” (11) and “Recording of the real command-line checker finding one possible duplicate, one missing image, and three fields to review.” (17). Headings name their sections; controls include “Try it with sample data,” “Replay sample run,” “Copy install command,” “Buy the planning pack,” “Enter license token,” “Verify license,” and “Download planning pack.” They are result-naming actions.

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
| 10 | Export both libraries to folders, then run: | 7 | Pass |
| 11 | Use --source for the moving library and --destination for the existing library. | 12 | Pass |
| 12 | Recipe JSON files and images may be inside nested folders. | 10 | `nested-export-support` |
| 13 | Tandoor's default export_YYYY-MM-DD.zip is supported. | 5 | `nested-export-support` |
| 14 | The checker reads each recipe ZIP, including recipe.json, step ingredients, and its sibling image. | 14 | `nested-export-support` |
| 15 | The checker reads the two folders and writes only the two paths you name. | 14 | `cli-local-only` |
| 16 | It does not change either export. | 6 | `cli-local-only` |
| 17 | The checklist (--report) and JSON inventory (--inventory) paths must be outside both libraries. | 13 | `safe-output-paths` |
| 18 | It also rejects output files that point to an input or to each other. | 14 | `safe-output-paths` |
| 19 | It does not follow linked directories. | 6 | `safe-output-paths` |
| 20 | It ignores linked JSON files that lead outside the selected folder. | 11 | `safe-output-paths` |
| 21 | The JSON inventory is a JSON file for scripts or another recipe tool. | 13 | Pass; defined on first README use |
| 22 | Print the complete result as JSON: | 6 | Pass |
| 23 | Exit code 0 means the check inventoried every recipe file, even when it found review items. | 16 | `exit-codes` |
| 24 | Exit code 1 means it could not inventory one or more recipe JSON files. | 14 | `partial-read-warnings` |
| 25 | It writes partial outputs. | 4 | `partial-read-warnings` |
| 26 | Fix the named files, then run it again before importing. | 10 | `partial-read-warnings` |
| 27 | This includes a source folder where every JSON file is invalid. | 11 | `partial-read-warnings` |
| 28 | The partial outputs still identify the problem. | 7 | `partial-read-warnings` |
| 29 | Invalid arguments, unsafe output paths, and unreadable folders return exit code 2. | 12 | `exit-codes` |
| 30 | Run recipe-move-check --help to see every option. | 7 | Pass |
| 31 | Mealie: names, Schema.org ingredients, instruction text, tags, servings, and local image paths. | 12 | `supported-fields` |
| 32 | Tandoor: names, structured steps and ingredients, keywords, servings, local image paths, and the sibling image in its default per-recipe ZIP export. | 21 | `supported-fields` |
| 33 | The JSON inventory keeps unknown field names and lists them for review. | 12 | `unknown-fields` |
| 34 | Image hashes identify equal files inside the selected folders. | 9 | **F-4-1** |
| 35 | They do not copy an image or grant rights to it. | 11 | Pass; boundary |
| 36 | The crate starts at version 0.1.0. | 6 | `crate-package` |
| 37 | The packaged command-line checker contains its source, license, README, changelog, and sample exports. | 13 | `crate-package` |
| 38 | Node is used only for the static documentation site and browser checks. | 12 | Pass |
| 39 | npm run build compiles the release command-line checker and writes the deployable site to dist/site/. | 15 | Build verified |
| 40 | Build only the site with npm run build:site. | 8 | Pass |
| 41 | The factory deploys dist/site/ as a static site. | 8 | Pass |
| 42 | No backend or account is required for the free checker. | 10 | `free-cli` |
| 43 | The checker reads selected folders and writes only your named checklist and inventory. | 13 | `cli-local-only` |
| 44 | Delete those files to remove its output. | 7 | Pass; direct deletion instruction |
| 45 | Delete the temporary folder printed by demo to remove the sample run. | 12 | `demo-is-real-cli` |
| 46 | The optional planning pack sends only its license token to Sociobot. | 11 | `license-privacy` |
| 47 | Read the site Privacy and Terms pages. | 7 | Pass |
| 48 | This checker does not import recipes or sync servers. | 9 | Pass; stated non-goal |
| 49 | Similarity scores are review hints, not proof. | 7 | Pass; limitation |
| 50 | Export formats change, so inspect the checklist before importing. | 9 | Pass |
| 51 | MIT. | 1 | Pass |
| 52 | See LICENSE. | 2 | Pass |
| 53 | Built by Param Factory. | 4 | Pass |

## Demo, sandbox, and privacy

One activation of **Try it with sample data** opened `/?demo=1`. At 390px the first demo screen showed the persistent “Demo — sample data, nothing is saved” banner, Reset demo, Start for real, and the completed result ledger beginning at y=545.9. The ledger shows one possible duplicate, one missing image, and three fields to review.

The browser had only `demo:recipe-library-move-check:run` in local storage during demo mode. Reset returned the fixed sample state. Start for real removed the demo key and returned to `/#install`. The request log for home, demo, reset, and exit contained only same-origin product requests (HTML, original artwork, and self-hosted terminal SVG); it contained no sample data, tracker, CDN, or third-party request. The declared offline claim also passed from the fresh clone.

`cargo run --quiet -- demo --json` in the fresh clone created an isolated temporary directory and the expected review outputs. It reported two moving recipes, two existing recipes, one possible duplicate, one missing image, three unmapped fields, and two ownership reviews. The brief explicitly excludes sync and importing; the JSON inventory already supplies the implied export, and no useful AI step is missing.

## Claims

I cloned the repository fresh into `/tmp/recipe-review4-clean-dZ4Cr5/repo`, ran `npm ci`, and ran every exact command from `.factory/claims.json` separately. All 22 commands passed; logs are in `/tmp/recipe-review4-claim-logs/`.

| Claim IDs with passing declared tests |
| --- |
| sample-findings; demo-privacy; one-click-demo; cli-capabilities; free-cli; demo-is-real-cli; nested-export-support; cli-local-only; safe-output-paths; exit-codes; partial-read-warnings; family-review-empty-state; supported-fields; unknown-fields; license-privacy; cached-license-notice; button-focus-contrast; offline-demo; planning-pack; billing-roles; crate-package; install-command |

All landing and README visitor-reliant promises mapped to a declared claim or an immediate instruction/non-goal, except the wording defect in F-4-1. No declared claim test failed.

## Earlier-finding audit

I read every prior review, polish report, and handoff. Current code plus fresh live/claim evidence confirms each prior finding is fixed; no earlier finding is reopened.

| Earlier finding(s) | Current verification |
| --- | --- |
| F-1-01 | Consumer Cargo package allowlist passed `crate-package`; no site, tests, factory, or analysis files ship. |
| F-1-02, F-1-08 | Self-hosted recording exists; `demo-is-real-cli` matched recording, CLI demo, and normal check. |
| F-1-03–F-1-06 | Concrete checklist copy, free-local operation, unchanged exports, and paid file contents all passed their claim tests. |
| F-1-07, F-1-09–F-1-17 | Capability, nested export, local-only, exit, supported-field, unknown-field, license-privacy, and sample-evidence tests all passed. |
| F-1-18–F-1-21 | Public package copy uses check/possible duplicate/JSON inventory/checklist; headings and controls are literal; prior long README wording is split. |
| F-2-1 | Landing and Terms consistently name Dodo Payments; the recorded checkout disclosure test passed. |
| F-3-1–F-3-6 | README compatibility/safety/error copy is short and concrete; flag terms are explained; command-line checker is used on first use. |
| F-3-7 | The required facts fit both cold test viewports: y=776.8/844 at 390px and y=894.9/900 at desktop. |
| F-3-8–F-3-9 | One-click sample and exact displayed install command now have passing declared claims. |
| F-3-10–F-3-11 | Unknown route has `Page not found` h1 and `Page not found — Recipe Library Move Check` title. |

## Structure, accessibility, links, and identity

- `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` returned 200. `/missing-page` returned an actual HTTP 404 with the designed page.
- Every checked route has one h1 and main landmark, route-specific title, meta description, canonical URL, OG/Twitter metadata, favicon, apple touch icon, consistent header/footer, and the Privacy/Terms links.
- The skip link, keyboard sample activation, route focus transfer, Back behavior, reduced-motion treatment, 390px layout, and axe serious/critical checks passed through the clean-clone tests.
- The crawl found no dead link: internal endpoints returned 200; the checkout action returned its expected 303; `https://sociobot.in/` returned 200; robots and sitemap returned 200.
- There are no page/console errors on valid routes. The static response CSP has `frame-ancestors 'none'` as a response header, not a meta tag.

## What would make this perfect

Apply F-4-1, add its exact browser wording to the existing sample claim, and rerun the same cold-read, copy, demo, claim, history, route, and accessibility checks. Nothing else was found in this round.
