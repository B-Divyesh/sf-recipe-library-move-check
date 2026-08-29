# Adversarial first-read review 1 — FAIL

**Product:** Recipe Library Move Check  
**Reviewed:** 29 August 2026 (UTC)  
**Live URL:** https://recipe-library-move-check.sociobot.in  
**Verdict:** **FAIL**

The landing page is clear on a cold 390px and desktop visit, and the declared claim commands pass. This is not a pass because the previous handoff's packaging gap remains, the CLI's web demo is a hand-written simulation rather than the required terminal recording, and visitor-reliant statements are not all covered by claims.json tests.

## Cold first screen

Tested in a new Chromium context at 390x844 and 1440x900 before scrolling.

| Question | First-read answer | Evidence | Result |
| --- | --- | --- | --- |
| What does this do? | It checks a move from Mealie to Tandoor before importing, looking for issues to review. | “Check your recipe move before importing”; “Mealie ↔ Tandoor preflight” | Pass |
| Who is it for? | Households moving their family recipe library between Mealie and Tandoor. | “For households moving between Mealie and Tandoor…” | Pass |
| What should I click first? | **Try it with sample data**. | Visible primary action beside “See a completed preflight in one click.” | Pass |

The mobile page was 390px wide with scrollWidth = clientWidth = 390. There were no page or console errors. The visual system is distinct, matches the documented notebook thesis, and is not a generic SaaS template.

## Findings

### Blocking

#### F-1-01 — Earlier packaging finding remains unfixed

**Location:** The prior handoff says the crate still includes graphify-out and web-development files. A fresh-clone cargo package --allow-dirty --no-verify --list confirms graphify-out/**, package.json, package-lock.json, playwright.config.ts, and scripts/copy-404.mjs are still packaged.

**Why this fails:** The history rule requires an earlier finding to be fixed in code, not merely recorded. The published CLI crate still carries unrelated analysis artifacts and website tooling.

**Fix:** Add a deliberate Cargo.toml include list (or exact excludes), then test that the package contains only consumer CLI files, README/license, and shipped examples.

#### F-1-02 — The web “terminal run” is not the required CLI recording

**Location:** Landing “Sample terminal run” shows “recipe-move-check demo” and a fixed /tmp/recipe-move-check-demo/… path. In site/src/main.ts this is hard-coded HTML; **Replay run** only adds a CSS class and changes its own label.

**Why this fails:** This is a CLI product. The demo-sandbox contract requires a self-hosted terminal recording (asciinema or SVG) of the real binary using the shipped sample, plus the real demo command. A visitor sees a static transcript and a browser-inapplicable temporary path, rather than a recording of the command they will run.

**Fix:** Record recipe-move-check demo --json against shipped examples, commit the self-hosted recording/SVG and source output, and caption it accurately. Keep the real cargo run -- demo path. Test that the recording totals and output filenames match the binary fixture.

#### F-1-03 — “safe plan” is an unlisted, undefined safety claim

**Location:** Hero: “For households moving between Mealie and Tandoor who need a **safe plan** for the family library.”

**Why this fails:** “Safe” is a visitor-reliant quality claim with no definition or matching claim entry/test.

**Fix:** Replace with: “For households moving between Mealie and Tandoor who need a checklist before importing the family library.”

#### F-1-04 — The free-price claim has no claim entry

**Location:** Landing fact: “The CLI is free.”

**Why this fails:** planning-pack proves the $19 price and fixture download, but no claim proves the CLI remains available at no cost.

**Fix:** Add a free-cli claim and clean-install test that runs the CLI with no license or network, or remove the sentence.

#### F-1-05 — Non-moving and paid-content boundary claims are unlisted

**Location:** Landing: “It does not move recipes or copy paid content.”

**Why this fails:** Neither behavior has a claim entry. The sentence combines two independently testable promises.

**Fix:** Split it. Test that inputs remain byte-identical and no destination-import/network action occurs. Remove the paid-content statement or document a precise, testable rule.

#### F-1-06 — Planning-pack contents and free components are unlisted

**Location:** “Print an ownership worksheet and move-day notes. The checker, report, and JSON inventory stay free.”

**Why this fails:** The existing test checks only a download event and filename. It does not inspect the download contents or prove the listed free components.

**Fix:** Test the worksheet and move-day content in downloaded Markdown, and prove an unlicensed CLI writes both report and inventory. Or reduce the copy to the exact tested promise.

#### F-1-07 — README core-capability claim is not listed

**Location:** “It inventories recipes, hashes available images within the selected export folders, finds likely duplicates, lists fields that will not map cleanly, and writes a review checklist.”

**Why this fails:** This is the core functional promise. cli-output only proves two files and one collision; it does not exercise every stated capability.

**Fix:** Split the sentence and add tests for inventory, in-export image hashing, duplicate detection, and unmapped-field reporting, or retain only tested capabilities.

#### F-1-08 — README says the sample runs the same real checker without proof

**Location:** “The command creates a temporary sandbox, runs the same checker used for real exports, and prints the report path.”

**Why this fails:** No claim establishes equivalence between the demo route/recording and normal check behavior.

**Fix:** Add a demo-is-real-cli claim that compares the demo fixture report/inventory with check on the same shipped folders, or narrow the sentence.

#### F-1-09 — Nested-file support is an unlisted compatibility claim

**Location:** “Folder paths may contain nested recipe JSON files and images.”

**Why this fails:** This format-support promise has no fixture test in claims.json.

**Fix:** Add a nested-folder fixture and claim test, or delete it.

#### F-1-10 — “Does not change either export” is not proved by its listed test

**Location:** “It does not change either export.”

**Why this fails:** cli-local-only checks only the source file and output directory. It does not snapshot the destination tree or assert every changed path in the sandbox, as its declared sandbox requires.

**Fix:** Recursively hash source, destination, and parent sandbox before/after. Assert only the two named output paths are new or changed.

#### F-1-11 — Exit-code promises are unlisted

**Location:** “Exit code 0 means the check completed, even when review items exist. Invalid arguments or unreadable exports return a non-zero code.”

**Why this fails:** These are script-automation guarantees without a matching claim test.

**Fix:** Add an exit-codes claim covering review findings, invalid arguments, and unreadable folders, or remove the promises.

#### F-1-12 — Supported-export field claims are unlisted

**Location:** README “Supported export shapes” Mealie and Tandoor bullets.

**Why this fails:** The bullets promise compatibility with Schema.org ingredients, structured steps, keywords, servings, and local image paths. No claim tests those mappings.

**Fix:** Give each format a minimal fixture and claim that asserts the named fields in neutral inventory. Remove unsupported names.

#### F-1-13 — Unknown-field preservation is an unlisted data-integrity claim

**Location:** “Unknown JSON fields are preserved by name in the neutral inventory and listed for review.”

**Why this fails:** This export guarantee is absent from the six claims.

**Fix:** Add a fixture with an unknown field and assert its name in inventory and checklist, or remove the sentence.

#### F-1-14 — License-token privacy claim is unlisted

**Location:** “The optional paid planning pack verifies only its license token with Sociobot…”

**Why this fails:** demo-privacy covers the no-license demo only. It does not log the licensed flow and assert destination, token-only data, or lack of other cross-origin requests.

**Fix:** Add a recorded-response Playwright claim that logs the licensed flow and asserts the exact request data and origins.

#### F-1-15 — The terminal collision explanation is unlisted

**Location:** “Same name, ingredient list, and image hash.”

**Why this fails:** sample-findings checks the count and a heading, not the three evidence reasons shown to visitors.

**Fix:** Assert all three reasons in the sample report/UI, or replace this with a link to a tested sample report.

#### F-1-16 — The terminal missing-image explanation is unlisted

**Location:** “The export points to missing.jpg.”

**Why this fails:** No claim asserts the exact missing path shown to visitors.

**Fix:** Include missing.jpg in sample-findings, or remove the specific filename.

#### F-1-17 — The terminal ownership remedy is unlisted

**Location:** “Choose the new owner and recreate family access.”

**Why this fails:** It promises an ownership/access review capability not named in claims.json.

**Fix:** Add an ownership-review claim and fixture assertion, or label it as a manual migration reminder rather than a checker result.

### Minor

#### F-1-18 — Jargon and inconsistent duplicate terminology slow first read

**Locations:** “Mealie ↔ Tandoor preflight”; “See a completed preflight in one click”; “possible collision”; README “likely duplicates”; README “neutral inventory.”

**Fix:** Use **check** and **possible duplicate** everywhere. Say “JSON inventory you can review before importing” on first use. Terminology table: check → check; possible duplicate → possible duplicate; JSON inventory → JSON inventory.

#### F-1-19 — Several headings are slogans or contextless labels

| Current | Why it fails | Rewrite |
| --- | --- | --- |
| method / three steps | Decorative label, not a section name. | How the recipe check works |
| Check before touching the destination | “destination” is migration jargon and omits recipes. | How to check two recipe libraries |
| scope boundary | Does not name the section. | What the checker reads and writes |
| Your recipes stay yours | Generic slogan that could fit unrelated products. | What the checker does not change |
| Give every family member a job | Metaphor; does not name the paid item. | Optional family planning pack |

#### F-1-20 — Two buttons do not name their result precisely

**Locations:** **Replay run** and **Have a license? Paste it**.

**Fix:** Use **Replay sample run** and **Enter license token**.

#### F-1-21 — README main product sentence exceeds the 22-word cap

**Location:** README introduction, 26 words: “It inventories recipes, hashes available images within the selected export folders, finds likely duplicates, lists fields that will not map cleanly, and writes a review checklist.”

**Fix:** “It inventories recipes and writes a review checklist. It flags possible duplicates, missing images, and fields to review.”

## Copy audit

Word counts treat command paths, names, and numbers as one word. Code blocks are commands rather than prose. F-* is the finding above; “—” means no copy-only issue.

### Landing headings, labels, and actions

| Text | Words | Flag |
| --- | ---: | --- |
| Mealie ↔ Tandoor preflight | 3 | F-1-18 |
| Check your recipe move before importing | 6 | — |
| Try it with sample data | 5 | — |
| Sample terminal run | 3 | F-1-02 |
| Replay run | 2 | F-1-20 |
| What the check catches | 4 | — |
| Lemon Pasta may already exist | 5 | — |
| Red Lentil Soup has no image file | 7 | — |
| Household access needs a decision | 5 | F-1-17 |
| method / three steps | 3 | F-1-19 |
| Check before touching the destination | 5 | F-1-19 |
| Export both libraries | 3 | — |
| Run one local command | 4 | — |
| Review the written checklist | 4 | — |
| Run it locally | 4 | — |
| Install the checker | 3 | — |
| Copy install command | 3 | — |
| scope boundary | 2 | F-1-19 |
| Your recipes stay yours | 4 | F-1-19 |
| Read the privacy details | 4 | — |
| Optional planning pack · $19 once | 5 | F-1-04 |
| Give every family member a job | 6 | F-1-19 |
| Buy the planning pack | 4 | — |
| Have a license? Paste it | 5 | F-1-20 |
| License token | 2 | — |
| Verify license | 2 | — |
| Download planning pack | 3 | — |

### Landing sentences

| Location | Sentence | Words | Flag |
| --- | --- | ---: | --- |
| Hero | For households moving between Mealie and Tandoor who need a safe plan for the family library. | 16 | F-1-03 |
| Hero action | See a completed preflight in one click. | 7 | F-1-18 |
| Fact | Reads the folders you select. | 5 | Covered by cli-local-only |
| Fact | Writes a checklist and neutral JSON. | 6 | F-1-18; otherwise cli-output |
| Fact | The CLI is free. | 4 | F-1-04 |
| Fact | The planning pack costs $19 once. | 6 | Covered by planning-pack |
| Terminal | Demo — sample data, nothing is saved to your libraries. | 9 | Covered by demo-privacy |
| Terminal | Found 1 collision, 1 missing image, and 3 field review items. | 11 | Covered by sample-findings |
| Terminal | Review the demo report: /tmp/recipe-move-check-demo/move-check.md | 5 | F-1-02 |
| Collision detail | Same name, ingredient list, and image hash. | 7 | F-1-15 |
| Missing-image detail | The export points to missing.jpg. | 5 | F-1-16 |
| Ownership detail | Choose the new owner and recreate family access. | 7 | F-1-17 |
| Step 1 | Make a Mealie or Tandoor export from each server. | 9 | — |
| Step 2 | Point the checker at the moving and existing folders. | 9 | — |
| Step 3 | Resolve collisions, images, fields, owners, and family access. | 7 | F-1-18 terminology |
| Install | Rust 1.80 or newer is required. | 6 | Add compatibility test/document tested MSRV |
| Scope | The CLI reads the folders you select and writes the report and inventory paths you name. | 15 | Covered by cli-local-only |
| Scope | It does not move recipes or copy paid content. | 9 | F-1-05 |
| Scope | Delete the report and inventory to remove its output. | 9 | Add deletion/output-path evidence or shorten to instruction |
| Paid | Print an ownership worksheet and move-day notes. | 6 | F-1-06 |
| Paid | The checker, report, and JSON inventory stay free. | 8 | F-1-06 |
| Paid | Sociobot is the merchant of record. | 6 | Confirm as Terms statement or remove from landing |
| Paid | Refunds are handled there. | 4 | Confirm as Terms statement or remove from landing |
| Footer | Check a recipe move before you import. | 7 | — |
| Footer | Version 0.1.0 · build 2026.08.28 | 4 | — |

### README sentences

| Location | Sentence | Words | Flag |
| --- | --- | ---: | --- |
| Summary | Check a recipe move before you import the family library. | 10 | — |
| Introduction | Recipe Library Move Check is a command-line preflight for households moving between Mealie and Tandoor. | 15 | F-1-18 jargon |
| Introduction | It inventories recipes, hashes available images within the selected export folders, finds likely duplicates, lists fields that will not map cleanly, and writes a review checklist. | 26 | F-1-07, F-1-21 |
| Try sample | The command creates a temporary sandbox, runs the same checker used for real exports, and prints the report path. | 19 | F-1-08 |
| Try sample | You can also view the site demo at https://recipe-library-move-check.sociobot.in/demo. | 10 | — |
| Exports | Export both libraries to folders, then run: | 7 | — |
| Exports | The source is the library you plan to move. | 10 | — |
| Exports | The destination is the existing library you want to protect. | 10 | F-1-19 terminology |
| Exports | Folder paths may contain nested recipe JSON files and images. | 10 | F-1-09 |
| Exports | The checker reads the folders you select and writes only the report and inventory paths you name. | 15 | Covered by cli-local-only |
| Exports | It does not change either export. | 6 | F-1-10 |
| Exports | For scripts, print the full result as JSON: | 8 | Add observable JSON-output claim or label as command documentation |
| Exports | Exit code 0 means the check completed, even when review items exist. | 12 | F-1-11 |
| Exports | Invalid arguments or unreadable exports return a non-zero code. | 9 | F-1-11 |
| Exports | Run recipe-move-check --help for every option. | 6 | — |
| Export shape | Mealie: JSON files containing name or recipe.name, Schema.org ingredients, instruction text, tags, and local image paths. | 16 | F-1-12 |
| Export shape | Tandoor: JSON files containing name, structured steps and ingredients, keywords, servings, and local image paths. | 14 | F-1-12 |
| Export shape | Unknown JSON fields are preserved by name in the neutral inventory and listed for review. | 15 | F-1-13, F-1-18 |
| Export shape | Image hashes identify equal files; they do not copy or grant rights to an image. | 15 | Add tested boundary claim or move legal guidance to Terms |
| Install | Rust 1.80 or newer is required. | 6 | Add compatibility test/document tested MSRV |
| Install | The crate starts at version 0.1.0. | 6 | — |
| Install | The factory owns publishing credentials; this repository does not publish itself. | 10 | Remove from user-facing README or explain install path only |
| Develop | Node 20 or newer is used only for static documentation site and browser checks. | 12 | — |
| Develop | npm run build compiles the release binary and writes deployable site to dist/site/. | 12 | Local build evidence; not visitor copy |
| Develop | npm run build:site builds only the site. | 6 | — |
| Privacy | The CLI reads selected export folders and writes only the report and inventory paths you request. | 14 | Covered by cli-local-only |
| Privacy | Delete those files, or delete the temporary directory printed by demo, to remove its output. | 14 | Add deletion/output-path evidence or shorten to instruction |
| Privacy | The optional paid planning pack verifies only its license token with Sociobot; see the site’s Privacy and Terms pages. | 17 | F-1-14 |
| Limits | This is a preflight, not an importer or server sync tool. | 11 | F-1-18 jargon; test or narrow non-goal |
| Limits | Similarity scores are review hints, not proof. | 8 | Retain; add collision-threshold fixture test |
| Limits | Export formats change, so inspect the checklist before moving the family library. | 10 | — |
| License | MIT. | 1 | — |
| License | See LICENSE. | 2 | — |
| Footer | Built by Param Factory. | 4 | — |

## Demo, privacy, claims, and CLI checks

- **Browser demo:** /demo immediately displayed two moving and two existing fictional recipes, one possible collision, one missing image, and three fields to review. The persistent banner read “Demo — sample data, nothing is saved”; Reset demo and Start for real were present. Reset retained only demo:recipe-library-move-check:run; Start for real removed it. The normal demo flow made no cross-origin requests.
- **Offline:** after service-worker control, live /demo reloaded offline with its heading and no console error.
- **CLI demo:** fresh-clone cargo run --quiet -- demo --json created a new /tmp/recipe-move-check-demo-… sandbox and returned two output paths, two source recipes, two destination recipes, one collision, one missing image, three unmapped fields, and two ownership reviews.
- **Declared claims:** after npm ci in a fresh clone, each exact claims.json command passed: sample-findings, demo-privacy, cli-output, cli-local-only, offline-demo, and planning-pack. Passing listed commands does not resolve F-1-03 through F-1-17 because those statements are absent from the claims inventory or insufficiently asserted.
- **AI/missed leverage:** no AI feature is needed by the brief. The product supplies the implied local export inspection and JSON output; live sync is expressly a non-goal.

## Structure, accessibility, and links

- /, /demo, /privacy, and /terms returned 200; an unknown route returned a designed HTTP 404.
- Each tested page had one main and one h1, a route-specific title, description, canonical URL, favicon, and required social image metadata. The sitemap lists all four real routes.
- Keyboard navigation moved focus to the new h1 on Demo navigation and browser Back. Skip link, visible focus, reduced motion, mobile layout, and demo routing passed.
- Axe found no serious or critical violations on /, /demo, /privacy, or /terms.
- All internal links resolved. https://sociobot.in/ returned 200. Paid checkout returned HTTP 303 to hosted Dodo checkout.

## History check

There are no earlier .factory/review-*.md or .factory/polish-*.md files. Earlier verifier reports and the prior handoff were read. Their prior live defects were independently confirmed fixed: checkout redirects with 303; the 390px demo has no overflow; selected-export image escape has a Rust regression test; unknown routes return 404; footer link returns 200; versioned assets are immutable and sw.js is no-cache; strict lint passes. The handoff's remaining crate-packaging gap is still present and is F-1-01.

## What would make this perfect

Ship a real, self-hosted terminal recording tied to the shipped CLI sample; make the crate package only consumer CLI material; reduce the copy to concrete, consistent plain words; and either test every relied-on capability and privacy promise or remove it. Re-run the full review only when there are zero findings.

