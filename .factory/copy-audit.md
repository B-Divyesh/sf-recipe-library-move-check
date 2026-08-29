# Copy audit — polish round 3

Audited 29 August 2026 after the round-three rewrites. Counts treat product names, commands, paths, and prices as one word. No landing-page sentence exceeds 22 words. No copy uses a banned marketing word.

## First screen

| Text | Words | Result |
| --- | ---: | --- |
| Mealie ↔ Tandoor check | 3 | Pass |
| Check your recipe move before importing | 6 | Pass; verb-first job |
| For households moving between Mealie and Tandoor who need a checklist before importing the family library. | 16 | Pass; audience and outcome |
| Try it with sample data | 5 | Pass; primary action |
| See a completed check in one click. | 7 | Pass; `one-click-demo` |
| Runs locally on the folders you select. | 7 | Pass; `cli-local-only` |
| Writes a checklist and a JSON inventory you can review before importing. | 12 | Pass; `cli-capabilities` |
| The command-line checker is free. | 5 | Pass; `free-cli` |
| The planning pack costs $19 once. | 6 | Pass; `planning-pack` |

## Product preview and method

| Text | Words | Result |
| --- | ---: | --- |
| Recorded command-line sample | 3 | Pass; `demo-is-real-cli` |
| Replay sample run | 3 | Pass |
| Recorded from recipe-move-check demo --json using the bundled sample. | 8 | Pass; `demo-is-real-cli` |
| What the check catches | 4 | Pass |
| Lemon Pasta may already exist | 5 | Pass |
| Same name, ingredient list, and image hash. | 7 | Pass; `sample-findings` |
| Red Lentil Soup has no image file | 7 | Pass |
| The export points to missing.jpg. | 5 | Pass; `sample-findings` |
| Household access needs a decision | 5 | Pass |
| Choose the new owner and recreate family access. | 8 | Pass; `sample-findings` |
| How to check two recipe libraries | 6 | Pass |
| Export both libraries | 3 | Pass |
| Make a Mealie or Tandoor export from each server. | 9 | Pass |
| Run one local command | 4 | Pass |
| Point the checker at the moving and existing folders. | 9 | Pass |
| Review the written checklist | 4 | Pass |
| Review possible duplicates, images, fields, owners, and family access. | 8 | Pass |

## Install, boundaries, and purchase

| Text | Words | Result |
| --- | ---: | --- |
| Run it locally | 4 | Pass |
| Install the checker | 3 | Pass |
| Install the free command-line checker with Cargo. | 8 | Pass; `install-command` |
| Copy install command | 3 | Pass |
| What the checker reads and writes | 6 | Pass |
| The command-line checker reads the folders you select. | 8 | Pass; `cli-local-only` |
| It writes the checklist and JSON inventory paths you name. | 10 | Pass; `cli-local-only` |
| It does not change either export. | 6 | Pass; `cli-local-only` |
| Delete the checklist and inventory to remove its output. | 9 | Pass |
| Read the privacy details | 4 | Pass |
| Optional planning pack · $19 once | 5 | Pass |
| Optional family planning pack | 4 | Pass |
| Download a printable ownership worksheet and move-day notes. | 8 | Pass; `planning-pack` |
| The checker, checklist, and JSON inventory remain free. | 8 | Pass; `free-cli` |
| Buy the planning pack | 4 | Pass |
| Enter license token | 3 | Pass |
| Verify license | 2 | Pass |
| Dodo Payments is the online reseller and merchant of record. | 10 | Pass; `billing-roles` |
| Use the support link in your Dodo receipt for order questions and returns. | 13 | Pass; `billing-roles` |
| Download planning pack | 3 | Pass |

## Error page and footer

| Text | Words | Result |
| --- | ---: | --- |
| Error 404 | 2 | Pass; literal error label |
| Page not found | 3 | Pass; literal h1 |
| The address may be old or mistyped. | 7 | Pass |
| Check a recipe move before you import. | 7 | Pass |
| Built by Param Factory | 4 | Pass |
| Version 0.1.0 · build 2026.08.29 | 4 | Pass |

## Terminology

| Concept | One term used |
| --- | --- |
| Running the comparison | check |
| A recipe that may already exist | possible duplicate |
| Machine-readable output | JSON inventory |
| Library being moved | moving library (`--source`) |
| Library already present | existing library (`--destination`) |
| Human-readable output | checklist (`--report`) |
| Local program | command-line checker |

The old terms “preflight,” “collision,” “likely duplicate,” and prose phrase “neutral inventory” are absent from public package copy. The JSON inventory is defined on the landing page and in the README.

## README safety rewrites

| Text | Words | Result |
| --- | ---: | --- |
| Tandoor's default export_YYYY-MM-DD.zip is supported. | 5 | Pass |
| The checker reads each recipe ZIP, including recipe.json, step ingredients, and its sibling image. | 14 | Pass |
| The checklist (--report) and JSON inventory (--inventory) paths must be outside both libraries. | 13 | Pass |
| It also rejects output files that point to an input or to each other. | 14 | Pass |
| It does not follow linked directories. | 6 | Pass |
| It ignores linked JSON files that lead outside the selected folder. | 11 | Pass |
| Exit code 1 means it could not inventory one or more recipe JSON files. | 15 | Pass |
| It writes partial outputs. | 4 | Pass |
| Fix the named files, then run it again before importing. | 11 | Pass |
