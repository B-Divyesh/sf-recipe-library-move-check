# Adversarial first-read review 2 — FAIL

**Product:** Recipe Library Move Check  
**Reviewed:** 29 August 2026 (UTC)  
**Live URL:** https://recipe-library-move-check.sociobot.in  
**Verdict:** **FAIL**

The local CLI and sample are clear and tryable. This is not a pass: an earlier plain-language finding is only half-fixed, and the paid offer gives conflicting, untested merchant/refund information.

## Cold first screen

Opened in fresh Chromium contexts at 390×844 and 1440×900 before scrolling.

| Question | First-read answer | Exact evidence | Result |
| --- | --- | --- | --- |
| What does this do? | Checks a recipe-library move before import. | “Check your recipe move before importing” | Pass |
| Who is it for? | Households moving from Mealie to Tandoor. | “For households moving between Mealie and Tandoor…” | Pass |
| What should I click first? | Try the completed sample. | “Try it with sample data” | Pass |

At 390px the headline, audience, CTA, next-step explanation, and facts are visible without scrolling. The CTA is 266×53px. There were no page or console errors. The ruled-paper notebook system is distinct, matches `.factory/design.md`, and is not a generic SaaS template.

## Findings

### Blocking

#### F-1-18 — Reopened: `JSON inventory` is still unexplained jargon on first use

**Location:** Landing hero fact: “Writes a checklist and JSON inventory.”

**Why this fails:** Review 1 required consistent use of **check** and **possible duplicate**, plus an explanation of “JSON inventory” on first use. The terminology is now consistent, but this first-screen fact still asks a household user to understand a developer-format label. The prior required rewrite was not applied, so this is half-fixed and is reopened with its original id.

**Concrete fix:** Replace it with “Writes a checklist and a JSON inventory you can review before importing.” Define it again in the README as “a JSON file for scripts or another recipe tool.” Keep the capability claim test.

#### F-2-1 — Paid-offer merchant and refund statements conflict and are unlisted claims

**Locations:** Landing paid panel: “Sociobot is the merchant of record. Refunds are handled there.” Terms: “Sociobot and Dodo are the merchant of record.”

**Why this fails:** A purchaser cannot tell who legally sells the planning pack or where a refund request goes. “There” is ambiguous. These visitor-reliant legal and payment claims have no `.factory/claims.json` entry. The live checkout URL redirects with HTTP 303 to Dodo; that makes the contradictory wording consequential rather than resolving it.

**Concrete fix:** Verify the legal merchant, payment-processor, and refund roles; name each role once in plain words and give a concrete refund route. Only if accurate: “Sociobot sells the planning pack. Dodo Payments processes payment. Use the support link in your receipt for refunds.” Add a `billing-roles` recorded-fixture claim that asserts the displayed roles and refund instruction, or remove these statements until verified.

## Copy audit

Counts treat commands, URLs, names, and numbers as one word. Code blocks are commands, not prose. No sentence is over 22 words and no banned marketing adjective appears. The flagged rows are the findings above.

### Landing sentences

| Sentence | Words | Flag |
| --- | ---: | --- |
| Check a recipe move before you import. | 7 | — |
| Runs locally on the folders you select. | 7 | — |
| Writes a checklist and JSON inventory. | 6 | F-1-18 |
| The CLI is free. | 4 | — |
| The planning pack costs $19 once. | 6 | — |
| Recorded from `recipe-move-check demo --json` using the bundled sample. | 9 | — |
| Same name, ingredient list, and image hash. | 7 | — |
| The export points to `missing.jpg`. | 5 | — |
| Choose the new owner and recreate family access. | 8 | — |
| Download a printable ownership worksheet and move-day notes. | 8 | — |
| The CLI, checklist, and JSON inventory remain free. | 8 | — |
| Sociobot is the merchant of record. | 6 | F-2-1 |
| Refunds are handled there. | 4 | F-2-1 |
| For households moving between Mealie and Tandoor who need a checklist before importing the family library. | 16 | — |
| See a completed check in one click. | 7 | — |
| Make a Mealie or Tandoor export from each server. | 9 | — |
| Point the checker at the moving and existing folders. | 9 | — |
| Review possible duplicates, images, fields, owners, and family access. | 9 | — |
| Install the free CLI with Cargo. | 6 | — |
| The CLI reads the folders you select. | 7 | — |
| It writes the checklist and JSON inventory paths you name. | 10 | — |
| It does not change either export. | 6 | — |
| Delete the checklist and inventory to remove its output. | 9 | — |

### Landing headings, labels, and actions

| Text | Words | Flag |
| --- | ---: | --- |
| Recipe Move Check; Demo; Install; Privacy; Terms; Built by Param Factory | 3; 1; 1; 1; 1; 4 | — |
| Version 0.1.0 · build 2026.08.29 | 4 | — |
| Mealie ↔ Tandoor check | 3 | — |
| Check your recipe move before importing | 6 | — |
| Try it with sample data | 5 | — |
| Recorded CLI sample; Replay sample run | 3; 3 | — |
| sample findings / 29 Aug; What the check catches | 4; 4 | — |
| 1 possible duplicate; 1 missing image; 3 fields to review | 3; 3; 4 | — |
| Lemon Pasta may already exist; Red Lentil Soup has no image file; Household access needs a decision | 5; 7; 5 | — |
| Optional planning pack · $19 once; Optional family planning pack | 5; 4 | — |
| Buy the planning pack; Enter license token; License token; Verify license; Download planning pack | 4; 3; 2; 2; 3 | — |
| How to check two recipe libraries; Export both libraries; Run one local command; Review the written checklist | 6; 3; 4; 4 | — |
| Run it locally; Install the checker; Copy install command | 3; 3; 3 | — |
| What the checker reads and writes; Read the privacy details | 6; 4 | — |

All headings name their sections. Every public control uses a result-naming verb.

### README sentences

| Sentence | Words | Flag |
| --- | ---: | --- |
| Check a recipe move before you import the family library. | 10 | — |
| Recipe Library Move Check is a local CLI for households moving between Mealie and Tandoor. | 15 | — |
| It inventories recipes and writes a review checklist. | 8 | — |
| It flags possible duplicates, missing images, and fields to review. | 10 | — |
| The command copies the bundled sample into a temporary folder. | 10 | — |
| It then runs the same checker used by the `check` command. | 11 | — |
| It prints the checklist path and the folder you can delete afterward. | 12 | — |
| Open the isolated browser sample at `https://recipe-library-move-check.sociobot.in/?demo=1`. | 7 | — |
| Its banner includes **Reset demo** and **Start for real**. | 9 | — |
| Export both libraries to folders, then run: | 7 | — |
| The source is the library you plan to move. | 9 | — |
| The destination is the existing library you compare against. | 9 | — |
| Recipe JSON files and images may be inside nested folders. | 10 | — |
| The checker reads the two folders and writes only the two paths you name. | 14 | — |
| It does not change either export. | 6 | — |
| For scripts, print the complete result as JSON: | 8 | — |
| Exit code `0` means the check completed, even when it found review items. | 13 | — |
| Invalid arguments and unreadable folders return a non-zero code. | 9 | — |
| Run `recipe-move-check --help` to see every option. | 7 | — |
| Mealie: names, Schema.org ingredients, instruction text, tags, servings, and local image paths. | 13 | — |
| Tandoor: names, structured steps and ingredients, keywords, servings, and local image paths. | 12 | — |
| The JSON inventory keeps unknown field names and lists them for review. | 12 | — |
| Image hashes identify equal files inside the selected folders. | 9 | — |
| They do not copy an image or grant rights to it. | 11 | — |
| The crate starts at version `0.1.0`. | 6 | — |
| The packaged CLI contains its source, license, README, changelog, and sample exports. | 12 | — |
| Node is used only for the static documentation site and browser checks. | 12 | — |
| `npm run build` compiles the release CLI and writes the deployable site to `dist/site/`. | 14 | — |
| Build only the site with `npm run build:site`. | 9 | — |
| The factory deploys `dist/site/` as a static site. | 8 | — |
| No backend or account is required for the free CLI. | 10 | — |
| The CLI reads selected folders and writes only your named checklist and inventory. | 13 | — |
| Delete those files to remove its output. | 7 | — |
| Delete the temporary folder printed by `demo` to remove the sample run. | 12 | — |
| The optional planning pack sends only its license token to Sociobot. | 11 | — |
| Read the site Privacy and Terms pages. | 7 | — |
| This checker does not import recipes or sync servers. | 9 | — |
| Similarity scores are review hints, not proof. | 7 | — |
| Export formats change, so inspect the checklist before importing. | 9 | — |
| MIT. | 1 | — |
| See LICENSE. | 2 | — |
| Built by Param Factory. | 4 | — |

README headings are “Recipe Library Move Check,” “Try the sample,” “Check your exports,” “Supported export fields,” “Install and package,” “Develop, test, and deploy,” “Privacy and deletion,” “Limits,” and “License.” They all name their sections.

## Demo, privacy, claims, and CLI

- The first-screen CTA opens `/?demo=1` directly to completed findings: two moving recipes against two existing recipes, one possible duplicate, one missing image, and three fields to review.
- The banner is persistent: “Demo — sample data, nothing is saved,” with Reset demo and Start for real. Reset returns the replay control to its initial state. Start for real goes to `/#install` and removes the demo key.
- In a fresh live browser context, requests during demo load, Reset, and exit were same-origin only. The only local-storage key was `demo:recipe-library-move-check:run`, and it was removed on exit. No page or console errors occurred.
- The real CLI demo and self-hosted recording use the shipped examples. The brief does not imply an AI step; no decorative AI feature is present.

After `npm ci` in a fresh clone, every exact `.factory/claims.json` command passed separately: `sample-findings`, `demo-privacy`, `cli-capabilities`, `free-cli`, `demo-is-real-cli`, `nested-export-support`, `cli-local-only`, `exit-codes`, `supported-fields`, `unknown-fields`, `license-privacy`, `offline-demo`, `planning-pack`, and `crate-package`.

`npm test` passed all 32 Chromium tests. `npm run build` produced the release CLI and `dist/site/`. The live planning-pack checkout URL returned HTTP 303 to Dodo; no purchase was attempted.

## Structure, accessibility, and links

- `/`, `/demo`, `/privacy`, and `/terms` returned 200. `/missing-page` returned a styled HTTP 404.
- Each route rendered one `<h1>` and one `<main>`, with route-specific title, description, and canonical URL. Versioned favicon, Apple icon, Open Graph/Twitter images, `robots.txt`, and `sitemap.xml` are present.
- Direct `/#install` opens at the install section. The full suite confirms Back restores the homepage with h1 focus; the skip link is first and route changes announce the heading.
- Header/footer legal links are consistent. Internal links returned 200; checkout returned 303; the Param Factory link returned 200.
- The full local axe suite passed serious/critical checks. The 320px/390px layout, target size, reduced motion, and offline reload checks passed.

## History check

Read every earlier `.factory/review-*.md`, `.factory/polish-*.md`, verifier report, and handoff. This is a live/code retest, not reliance on the closure document.

| Earlier finding | Current check |
| --- | --- |
| F-1-01 | Fixed: package allowlist claim rejects web, test, factory, and analysis material. |
| F-1-02 | Fixed: live self-hosted recorded CLI SVG; equivalence claim passes. |
| F-1-03 | Fixed: undefined “safe plan” wording removed. |
| F-1-04 | Fixed: free CLI claim passes with no account, license, or reachable network. |
| F-1-05 | Fixed: source/destination immutability claim passes. |
| F-1-06 | Fixed: downloaded planning contents and free outputs are asserted. |
| F-1-07 | Fixed: capability claim asserts inventory, hashes, duplicate reasons, fields, and outputs. |
| F-1-08 | Fixed: demo and `check` output are compared. |
| F-1-09 | Fixed: nested JSON and in-folder images are asserted. |
| F-1-10 | Fixed: both export trees and sandbox diff are checked. |
| F-1-11 | Fixed: success and invalid/unreadable exit codes are asserted. |
| F-1-12 | Fixed: documented format fields are asserted. |
| F-1-13 | Fixed: unknown field names are asserted in both outputs. |
| F-1-14 | Fixed: license request and storage privacy are asserted. |
| F-1-15 | Fixed: all duplicate reasons are asserted. |
| F-1-16 | Fixed: `missing.jpg` is asserted. |
| F-1-17 | Fixed: ownership/access reminder is asserted. |
| F-1-18 | **Not fully fixed; reopened above.** |
| F-1-19 | Fixed: former slogan/contextless headings are absent. |
| F-1-20 | Fixed: controls are “Replay sample run” and “Enter license token.” |
| F-1-21 | Fixed: README sentences are all ≤22 words. |

## What would make this perfect

Explain the remaining technical format term in the first-screen fact. Then settle and test the legal merchant/refund copy against the checkout arrangement. Re-run this entire review only after both findings are gone.
