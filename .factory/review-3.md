# Adversarial first-read review 3 — FAIL

**Product:** Recipe Library Move Check

**Reviewed:** 29 August 2026 (UTC)

**Candidate:** `426ff73c1fb2ea3bd83b4672caf4520c01180dc9`

**Live URL:** <https://recipe-library-move-check.sociobot.in>
**Verdict:** **FAIL**

The cold landing page is clear, the sample works, and all 20 declared claim commands pass. The product still fails this round because an earlier terminology finding remains in public package copy. The history rule makes that a blocking regression. Eleven additional copy, claim-inventory, first-screen, and 404 findings also remain.

## Cold first screen

Opened from new Chromium contexts at 390×844 and 1440×900 before scrolling.

| Question | Answer available before scrolling | Exact evidence | Result |
| --- | --- | --- | --- |
| What does this do? | It checks a Mealie/Tandoor recipe-library move before import. | “Check your recipe move before importing” | Pass |
| Who is it for? | Households moving a family library between Mealie and Tandoor. | “For households moving between Mealie and Tandoor who need a checklist before importing the family library.” | Pass |
| What should I click first? | Open the completed sample. | “Try it with sample data”; “See a completed check in one click.” | Pass |

The mobile viewport had no horizontal overflow, and the three facts ended at 787px. On desktop, the action ended at 873px but the facts started at 905px, below the 900px first screen; see F-3-7. No console or page error occurred. Screenshots: `/tmp/review3-cold-mobile.png` and `/tmp/review3-cold-desktop.png`.

## Findings

### Blocking

#### F-1-18 — Reopened: the required plain terminology was not applied to all public package copy

**Exact locations:**

- `Cargo.toml`: `description = "Local preflight reports for Mealie and Tandoor recipe-library moves"`
- `CHANGELOG.md`: “Add neutral inventory, duplicate checks, image hashing, and Markdown reports.”

**Why this fails:** Review 1 required **check**, **possible duplicate**, **JSON inventory**, and **checklist** everywhere. Polish 2 says the old terms “preflight” and “neutral inventory” are absent from visitor-facing copy. Cargo package metadata and the changelog ship in the 17-file consumer crate, so that statement is false. A first-time Cargo visitor meets the unexplained term “preflight” and a different name, “reports,” for the checklist. The history rule makes an unfixed earlier finding blocking.

**Concrete fix:** Change the package description to “Check Mealie and Tandoor recipe-library moves before importing.” Change the changelog text to “Add a JSON inventory, possible-duplicate checks, image hashing, and Markdown checklists.” Extend the terminology test to scan `Cargo.toml` and shipped documentation.

### Minor

#### F-3-1 — One README compatibility sentence exceeds 22 words

**Exact quote:** “Tandoor's default `export_YYYY-MM-DD.zip` is supported directly: its per-recipe ZIP files are read in place, including each `recipe.json`, step ingredients, and sibling `image.*` file.” — 23 words.

**Why this fails:** The format guarantee is dense enough to require a second read.

**Concrete rewrite:** “Tandoor's default `export_YYYY-MM-DD.zip` is supported. The checker reads each recipe ZIP, including `recipe.json`, step ingredients, and its sibling image.”

#### F-3-2 — One README path-safety sentence exceeds 22 words and uses opaque terms

**Exact quote:** “It rejects the same folder for both libraries, report or inventory paths inside either export, paths that alias an input file, and report/inventory paths that overlap each other.” — 28 words.

**Why this fails:** “Alias” and “overlap” do not tell a person which concrete path is unsafe. “Report” also renames the checklist.

**Concrete rewrite:** “It rejects identical libraries and output files inside either library. It also rejects output files that point to an input or to each other.”

#### F-3-3 — The README exit-code instruction exceeds 22 words

**Exact quote:** “Exit code `1` means it wrote a marked **partial** checklist and inventory because one or more JSON files or recipe candidates could not be inventoried; fix the named items and run it again before importing.” — 35 words.

**Why this fails:** The error meaning and recovery action are buried in one sentence; “recipe candidate” is implementation language.

**Concrete rewrite:** “Exit code `1` means it could not inventory one or more recipe JSON files. It writes partial outputs. Fix the named files, then run it again before importing.”

#### F-3-4 — Two more README safety terms are unexplained jargon

**Exact quotes:** “It does not follow directory symlinks or read JSON symlinks that resolve outside the selected folder.” and “This includes an all-malformed source folder...”

**Why this fails:** “Symlink,” “resolve,” and “all-malformed” require filesystem or implementation knowledge.

**Concrete rewrite:** “It does not follow linked directories. It ignores linked JSON files that lead outside the selected folder.” Replace the second phrase with “This includes a source folder where every JSON file is invalid.”

#### F-3-5 — Moving/existing and checklist terminology changes in the README

**Exact locations:** Landing: “moving and existing folders”; README: “The source is the library you plan to move. The destination is the existing library...” Landing: “checklist”; README safety copy: “report ... paths.”

**Why this fails:** The published terminology table promises one term per concept. The option names require `--source`, `--destination`, and `--report`, but the surrounding prose does not connect those flags to the plain terms.

**Concrete fix:** Say “Use `--source` for the moving library and `--destination` for the existing library.” Refer to the “checklist (`--report`) path” wherever the option name matters.

#### F-3-6 — `CLI` is unexplained first-screen jargon

**Exact locations:** Landing fact “The CLI is free,” heading “Recorded CLI sample,” landing install sentence “Install the free CLI with Cargo,” and README introduction “a local CLI.”

**Why this fails:** A cold household visitor should not need to expand an acronym to understand what is free or installable.

**Concrete fix:** Use “command-line checker” on first use: “The command-line checker is free.” Use “Recorded command-line sample” and “local command-line checker”; use “checker” afterward.

#### F-3-7 — The desktop first screen omits the three required facts

**Exact location:** Live `/` at 1440×900. The primary action ends at y=873px; `.facts` starts at y=905px and ends at y=1039px.

**Why this fails:** The mandatory first-screen shape requires privacy/locality, output, and price facts before scrolling on both tested layouts. They fit at 390×844 but not at the required desktop cold read.

**Concrete fix:** Reduce desktop headline size or hero vertical padding so `.facts` ends at or above 900px. Add a 1440×900 assertion beside the existing 390×844 first-screen test.

#### F-3-8 — “In one click” is an unlisted quantitative claim

**Exact quote:** “See a completed check in one click.”

**Why this fails:** The CTA currently works in one click, but no `.factory/claims.json` entry makes that quantitative promise part of the claim gate. `sample-findings` opens `/?demo=1` directly instead of starting at `/` and clicking once.

**Concrete fix:** Add a `one-click-demo` claim whose test starts at `/`, performs one activation of “Try it with sample data,” and asserts the demo banner and completed findings.

#### F-3-9 — The public install promise is absent from the claim inventory

**Exact location:** “Install the free CLI with Cargo” and the copied `cargo install --git https://github.com/B-Divyesh/sf-recipe-library-move-check` command.

**Why this fails:** A visitor relies on that command to obtain the product. It worked in this review, but no claims entry protects it from regression; `free-cli` builds the current checkout and `crate-package` only lists package contents.

**Concrete fix:** Add an `install-command` claim that runs the displayed command into a fresh `CARGO_INSTALL_ROOT`, then asserts `recipe-move-check --version` and the bundled demo outcome.

#### F-3-10 — The 404 headline is a metaphor instead of the error name

**Exact location:** Unknown route h1: “This page is not in the checklist”; eyebrow: “Notebook page missing.”

**Why this fails:** A heading heard out of context should identify the section. The checklist/notebook metaphor hides the actual 404 condition.

**Concrete fix:** Use h1 “Page not found” and plain supporting copy. Keep the notebook styling as visual identity, not required wording.

#### F-3-11 — The 404 title drops part of the product name

**Exact location:** `<title>Page not found — Recipe Move Check</title>` while the product name is “Recipe Library Move Check.”

**Why this fails:** Route titles must use the consistent product name. The shortened title conflicts with the home, demo, privacy, and terms titles.

**Concrete fix:** Use `Page not found — Recipe Library Move Check` and update the route metadata test.

## Landing-page copy audit

Counts exclude decorative symbols and treat URLs as one word. No landing sentence exceeds 22 words and no banned marketing adjective appears. F-3-6, F-3-8, and F-3-9 are the landing-copy flags.

| Location | Sentence | Words | Result |
| --- | --- | ---: | --- |
| Hero audience | For households moving between Mealie and Tandoor who need a checklist before importing the family library. | 16 | Pass |
| Hero action | See a completed check in one click. | 7 | F-3-8 |
| Fact | Runs locally on the folders you select. | 7 | Pass; `cli-local-only` |
| Fact | Writes a checklist and a JSON inventory you can review before importing. | 12 | Pass; `cli-capabilities` |
| Fact | The CLI is free. | 4 | F-3-6; `free-cli` covers the outcome |
| Fact | The planning pack costs $19 once. | 6 | Pass; `planning-pack` |
| Hero image alt | A lab notebook compares two recipe cards under a magnifying glass. | 11 | Pass |
| Recording image alt | Recording of the real CLI finding one possible duplicate, one missing image, and three fields to review. | 17 | F-3-6; counts covered by `sample-findings` |
| Recording caption | Recorded from `recipe-move-check demo --json` using the bundled sample. | 9 | Pass; `demo-is-real-cli` |
| Duplicate detail | Same name, ingredient list, and image hash. | 7 | Pass; `sample-findings` |
| Missing-image detail | The export points to `missing.jpg`. | 5 | Pass; `sample-findings` |
| Access detail | Choose the new owner and recreate family access. | 8 | Pass; `sample-findings` |
| Step 1 | Make a Mealie or Tandoor export from each server. | 9 | Pass |
| Step 2 | Point the checker at the moving and existing folders. | 9 | Pass |
| Step 3 | Review possible duplicates, images, fields, owners, and family access. | 9 | Pass |
| Install | Install the free CLI with Cargo. | 6 | F-3-6, F-3-9 |
| Scope | The CLI reads the folders you select. | 7 | F-3-6; `cli-local-only` |
| Scope | It writes the checklist and JSON inventory paths you name. | 10 | Pass; `cli-local-only` |
| Scope | It does not change either export. | 6 | Pass; `cli-local-only` |
| Scope | Delete the checklist and inventory to remove its output. | 9 | Pass |
| Paid | Download a printable ownership worksheet and move-day notes. | 8 | Pass; `planning-pack` |
| Paid | The CLI, checklist, and JSON inventory remain free. | 8 | F-3-6; `free-cli` |
| Paid | Dodo Payments is the online reseller and merchant of record. | 10 | Pass; `billing-roles` |
| Paid | Use the support link in your Dodo receipt for order questions and returns. | 13 | Pass; `billing-roles` |
| Footer | Check a recipe move before you import. | 7 | Pass |

### Landing headings, labels, and controls

| Text | Words | Result |
| --- | ---: | --- |
| Recipe Move Check | 3 | Pass as compact wordmark; full product name remains in metadata |
| Demo / Install / Privacy / Terms | 1 each | Pass as navigation labels |
| Mealie ↔ Tandoor check | 4 | Pass |
| Check your recipe move before importing | 6 | Pass; verb-first h1 |
| Try it with sample data | 5 | Pass; prescribed sample action |
| Recorded CLI sample | 3 | F-3-6 |
| Replay sample run | 3 | Pass |
| What the check catches | 4 | Pass |
| Lemon Pasta may already exist | 5 | Pass |
| Red Lentil Soup has no image file | 7 | Pass |
| Household access needs a decision | 5 | Pass |
| How to check two recipe libraries | 6 | Pass |
| Export both libraries | 3 | Pass |
| Run one local command | 4 | Pass |
| Review the written checklist | 4 | Pass |
| Run it locally | 4 | Pass |
| Install the checker | 3 | Pass |
| Copy install command | 3 | Pass |
| What the checker reads and writes | 6 | Pass |
| Read the privacy details | 4 | Pass |
| Optional planning pack · $19 once | 5 | Pass |
| Optional family planning pack | 4 | Pass |
| Buy the planning pack | 4 | Pass |
| Enter license token / Verify license / Download planning pack | 3 / 2 / 3 | Pass |

All landing controls use verbs that name their result. The home-page section headings are literal and understandable out of context.

## README copy audit

Code blocks are commands rather than prose. The URL in sentence 8 counts as one word. No banned marketing adjective appears.

| # | Sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Check a recipe move before you import the family library. | 10 | Pass |
| 2 | Recipe Library Move Check is a local CLI for households moving between Mealie and Tandoor. | 15 | F-3-6 |
| 3 | It inventories recipes and writes a review checklist. | 8 | Pass; `cli-capabilities` |
| 4 | It flags possible duplicates, missing images, and fields to review. | 10 | Pass; `cli-capabilities` |
| 5 | The command copies the bundled sample into a temporary folder. | 10 | Pass; `demo-is-real-cli` |
| 6 | It then runs the same checker used by the `check` command. | 11 | Pass; `demo-is-real-cli` |
| 7 | It prints the checklist path and the folder you can delete afterward. | 12 | Pass; `demo-is-real-cli` |
| 8 | Open the isolated browser sample at `https://recipe-library-move-check.sociobot.in/?demo=1`. | 7 | Pass; `demo-privacy` |
| 9 | Its banner includes **Reset demo** and **Start for real**. | 9 | Pass; `demo-privacy` |
| 10 | Export both libraries to folders, then run: | 7 | Pass |
| 11 | The source is the library you plan to move. | 9 | F-3-5 |
| 12 | The destination is the existing library you compare against. | 9 | F-3-5 |
| 13 | Recipe JSON files and images may be inside nested folders. | 10 | Pass; `nested-export-support` |
| 14 | Tandoor's default `export_YYYY-MM-DD.zip` is supported directly: its per-recipe ZIP files are read in place, including each `recipe.json`, step ingredients, and sibling `image.*` file. | 23 | F-3-1 |
| 15 | The checker reads the two folders and writes only the two paths you name. | 14 | Pass; `cli-local-only` |
| 16 | It does not change either export. | 6 | Pass; `cli-local-only` |
| 17 | It rejects the same folder for both libraries, report or inventory paths inside either export, paths that alias an input file, and report/inventory paths that overlap each other. | 28 | F-3-2, F-3-5 |
| 18 | It does not follow directory symlinks or read JSON symlinks that resolve outside the selected folder. | 16 | F-3-4 |
| 19 | The JSON inventory is a JSON file for scripts or another recipe tool. | 13 | Pass |
| 20 | Print the complete result as JSON: | 6 | Pass |
| 21 | Exit code `0` means the check inventoried every recipe candidate, even when it found review items. | 16 | F-3-3 (“candidate”); `exit-codes` |
| 22 | Exit code `1` means it wrote a marked **partial** checklist and inventory because one or more JSON files or recipe candidates could not be inventoried; fix the named items and run it again before importing. | 35 | F-3-3 |
| 23 | This includes an all-malformed source folder, so the partial outputs still identify the problem. | 14 | F-3-4 |
| 24 | Invalid arguments, unsafe output paths, and unreadable folders return exit code `2`. | 12 | Pass; `exit-codes` |
| 25 | Run `recipe-move-check --help` to see every option. | 7 | Pass |
| 26 | Mealie: names, Schema.org ingredients, instruction text, tags, servings, and local image paths. | 12 | Pass; `supported-fields` |
| 27 | Tandoor: names, structured steps and ingredients, keywords, servings, local image paths, and the sibling image in its default per-recipe ZIP export. | 21 | Pass; `supported-fields`, `nested-export-support` |
| 28 | The JSON inventory keeps unknown field names and lists them for review. | 12 | Pass; `unknown-fields` |
| 29 | Image hashes identify equal files inside the selected folders. | 9 | Pass; `cli-capabilities` |
| 30 | They do not copy an image or grant rights to it. | 11 | Pass; boundary statement |
| 31 | The crate starts at version `0.1.0`. | 6 | Pass |
| 32 | The packaged CLI contains its source, license, README, changelog, and sample exports. | 12 | F-3-6; `crate-package` |
| 33 | Node is used only for the static documentation site and browser checks. | 12 | Pass as development documentation |
| 34 | `npm run build` compiles the release CLI and writes the deployable site to `dist/site/`. | 14 | Pass; verified quality gate |
| 35 | Build only the site with `npm run build:site`. | 8 | Pass; verified quality gate |
| 36 | The factory deploys `dist/site/` as a static site. | 8 | Pass as deployment documentation |
| 37 | No backend or account is required for the free CLI. | 10 | F-3-6; `free-cli` |
| 38 | The CLI reads selected folders and writes only your named checklist and inventory. | 13 | F-3-6; `cli-local-only` |
| 39 | Delete those files to remove its output. | 7 | Pass |
| 40 | Delete the temporary folder printed by `demo` to remove the sample run. | 12 | Pass |
| 41 | The optional planning pack sends only its license token to Sociobot. | 11 | Pass; `license-privacy` |
| 42 | Read the site Privacy and Terms pages. | 7 | Pass |
| 43 | This checker does not import recipes or sync servers. | 9 | Pass; explicit non-goal |
| 44 | Similarity scores are review hints, not proof. | 7 | Pass; limitation |
| 45 | Export formats change, so inspect the checklist before importing. | 9 | Pass |
| 46 | MIT. | 1 | Pass |
| 47 | See LICENSE. | 2 | Pass |
| 48 | Built by Param Factory. | 4 | Pass |

README headings are “Recipe Library Move Check,” “Try the sample,” “Check your exports,” “Supported export fields,” “Install and package,” “Develop, test, and deploy,” “Privacy and deletion,” “Limits,” and “License.” Each names its section.

## Demo, sandbox, and privacy

- One click from `/` opened `/?demo=1`. At 390×844 the first demo screen showed the banner, realistic two-versus-two recipe description, and the beginning of the completed findings ledger. Screenshot: `/tmp/review3-demo-mobile.png`.
- The banner read “Demo — sample data, nothing is saved” and exposed **Reset demo** and **Start for real**.
- Storage on entry was `demo:recipe-library-move-check:run=active` plus a seeded non-demo sentinel. Reset restored the demo state without changing the sentinel. Start for real removed the demo key and retained the sentinel.
- Every browser request through landing, demo, reset, and exit was a same-origin GET. There were no cross-origin requests, console errors, or page errors.
- Offline demo reload passed its declared claim test.
- `cargo run --quiet -- demo --json` created `/tmp/recipe-move-check-demo-7467-1788021632686/` with two source recipes, two destination recipes, one possible duplicate, one missing image, three unmapped fields, two ownership reviews, a checklist, and a JSON inventory.
- The brief does not imply a useful AI step. Importing and live sync are explicit non-goals. The tool already provides the implied machine-readable export, so no missed-leverage finding is raised.

## Claims

All commands were run separately and exactly as declared after `npm ci` in fresh clone `/tmp/recipe-review3-clean-HjMR7f` at candidate `426ff73`. Logs are in `/tmp/recipe-review3-claim-logs/`.

| Claim | Result |
| --- | --- |
| `sample-findings` | PASS |
| `demo-privacy` | PASS |
| `cli-capabilities` | PASS |
| `free-cli` | PASS |
| `demo-is-real-cli` | PASS |
| `nested-export-support` | PASS |
| `cli-local-only` | PASS |
| `safe-output-paths` | PASS |
| `exit-codes` | PASS |
| `partial-read-warnings` | PASS |
| `family-review-empty-state` | PASS |
| `supported-fields` | PASS |
| `unknown-fields` | PASS |
| `license-privacy` | PASS |
| `cached-license-notice` | PASS |
| `button-focus-contrast` | PASS |
| `offline-demo` | PASS |
| `planning-pack` | PASS |
| `billing-roles` | PASS |
| `crate-package` | PASS |

No listed claim test failed. The live and README claim cross-check found the two unlisted promises in F-3-8 and F-3-9.

## Earlier-finding audit

Every earlier review, both polish reports, and the current handoff were read. The table below records a fresh live/code result rather than accepting the closure notes.

| Earlier finding | Current result |
| --- | --- |
| F-1-01 | Fixed: `crate-package` passed and excluded site, tests, factory, package-manager, and analysis files. |
| F-1-02 | Fixed: the self-hosted SVG recording exists and `demo-is-real-cli` matched it to both CLI paths. |
| F-1-03 | Fixed: “safe plan” is absent; the audience sentence names the checklist. |
| F-1-04 | Fixed: `free-cli` passed without an account, token, or reachable proxy. |
| F-1-05 | Fixed: paid-content copy is absent and `cli-local-only` passed. |
| F-1-06 | Fixed: the paid file contents and free outputs passed their claims. |
| F-1-07 | Fixed: `cli-capabilities` inspected inventory, hashes, duplicate evidence, missing image, fields, and both outputs. |
| F-1-08 | Fixed: `demo-is-real-cli` matched demo, check, and recording data. |
| F-1-09 | Fixed: nested folders and Tandoor outer ZIP support passed. |
| F-1-10 | Fixed: both export trees stayed byte-identical and only named outputs changed. |
| F-1-11 | Fixed: documented exit statuses passed. |
| F-1-12 | Fixed: every documented Mealie/Tandoor field passed. |
| F-1-13 | Fixed: unknown fields appeared in inventory and checklist. |
| F-1-14 | Fixed: the license request used only the token and documented endpoint. |
| F-1-15 | Fixed: all three duplicate reasons appeared in browser and CLI evidence. |
| F-1-16 | Fixed: the missing `missing.jpg` path appeared in browser and CLI evidence. |
| F-1-17 | Fixed: owner and family-access reminders appeared in browser and checklist. |
| F-1-18 | **Reopened / BLOCKING:** public crate metadata and the shipped changelog still use the rejected terminology. |
| F-1-19 | Fixed on the landing page: its section headings are literal. The separate 404 metaphor is F-3-10. |
| F-1-20 | Fixed: controls say “Replay sample run” and “Enter license token.” |
| F-1-21 | Fixed at its original location: the introductory capability sentence is now split. New overlong sentences are F-3-1 through F-3-3. |
| F-2-1 | Fixed: landing and Terms name Dodo Payments consistently; the recorded fixture and live checkout agree. |

## Structure, accessibility, links, and visual identity

- `/`, `/demo`, `/privacy`, and `/terms` returned 200. `/missing-page` returned a designed HTTP 404.
- Every route had one h1, one main landmark, a description, canonical URL, Open Graph/Twitter data, favicon, Apple icon, and the shared header/footer. The 404 title defect is F-3-11.
- Direct routes, `/#install`, keyboard activation, focus transfer, browser Back, and live announcements passed the production suite.
- All crawled links and assets resolved: internal routes 200, Sociobot 200, and checkout 303 to hosted Dodo checkout. `robots.txt` and `sitemap.xml` returned 200 and list all public routes.
- The required URL verifier passed the live demo in 762ms with no errors, one h1, one main, `lang=en`, complete alt text, and labeled buttons. Playwright axe found no violations in the 40-test production run.
- The clean build produced 16.23kB JS (5.81kB gzip) and 13.46kB CSS (3.89kB gzip). Its `index.html` SHA-256 exactly matched production: `371a0e3228d1e3bc6e59565409e307e62e1d55ae6bc5dd80ce64cbc2a1d7ccb9`.
- The handwritten migration-lab notebook identity is specific to recipe comparison, matches `.factory/design.md`, and is not a generic SaaS template.

## Verification summary

- `npm test`: PASS — 13 Rust tests, lint, typecheck, build, and 40 Playwright tests.
- `npm run build`: PASS — release CLI and `dist/site/`.
- Production Playwright suite: PASS — 40/40.
- Exact public `cargo install --git ...` command: PASS; installed `recipe-move-check 0.1.0` into a fresh root.
- Required live URL verifier: PASS.
- Declared claim commands: 20/20 PASS.

## What would make this perfect

Remove the old terminology from every shipped surface and enforce that vocabulary in tests. Split and simplify the three long README sentences, use one set of moving/existing/checklist terms around the CLI flag names, spell out “command-line checker,” bring all three facts into the desktop first screen, register the one-click and install promises in `claims.json`, and make the 404 title and h1 literal and product-name consistent. Then rerun the entire cold-read, demo, claim, history, route, copy, and accessibility review from a fresh clone.
