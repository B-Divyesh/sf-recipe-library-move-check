# Polish round 1 — finding closure

**Base review:** 783b4ce88b7bd4c25b002334c833582266e2c76e
**Release candidate repaired:** 7b584eecbf483a2b5e958f186676cf609e438608
**Date:** 29 August 2026
**Live URL:** https://recipe-library-move-check.sociobot.in

Every finding in review 1 is required. “Evidence” names the exact automated check and the captured page where visual confirmation applies.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-01 | Added a Cargo include allowlist for CLI source, docs, license, changelog, lockfile, and shipped examples. Repository analysis and web tooling cannot enter the crate. | @claim:crate-package; cargo package --allow-dirty --no-verify --list |
| F-1-02 | Replaced the handwritten transcript with a self-hosted animated SVG recording of the real demo command. The CLI demo now embeds the shipped example files. Added tested source values in examples/demo-recording.json. | @claim:demo-is-real-cli; .factory/screenshots/polish-1-demo-desktop.png; /?demo=1 |
| F-1-03 | Replaced “safe plan” with “checklist before importing the family library.” | .factory/copy-audit.md; .factory/screenshots/polish-1-home-mobile.png; / |
| F-1-04 | Kept the free-price fact and added a binary test with no license, account, or reachable proxy. | @claim:free-cli; / |
| F-1-05 | Removed the paid-content statement. The remaining no-change boundary now snapshots both complete exports and every changed sandbox path. | @claim:cli-local-only; / |
| F-1-06 | The paid test now opens the download and checks the ownership worksheet and move-day notes. The free CLI test requires both free outputs. | @claim:planning-pack; @claim:free-cli; / |
| F-1-07 | Split the README sentence. The capability test now inspects inventory, image hash, duplicate reasons, unknown fields, checklist sections, and both outputs. | @claim:cli-capabilities |
| F-1-08 | The demo uses include_str/include_bytes from examples. Its normalized result must equal check on those same folders and match the recording data. | @claim:demo-is-real-cli |
| F-1-09 | Added a claim that verifies nested Mealie and Tandoor JSON paths and an in-folder image. | @claim:nested-export-support |
| F-1-10 | Replaced the partial check with recursive SHA-256 snapshots of moving and existing folders. The parent diff must contain only the two named outputs. | @claim:cli-local-only |
| F-1-11 | Added success, invalid-system, and unreadable-folder process exit assertions. | @claim:exit-codes |
| F-1-12 | Added assertions for documented Mealie and Tandoor names, ingredients, instructions, tags, servings, and images. | @claim:supported-fields |
| F-1-13 | Added unknown rating, notes, and household-field assertions in both JSON inventory and Markdown checklist. | @claim:unknown-fields |
| F-1-14 | Added a recorded license flow that inspects origin, path, sole query key, GET method, empty body, clean referrer, and exact storage keys. | @claim:license-privacy; /privacy |
| F-1-15 | The sample test now requires all three duplicate reasons in the browser. The CLI test requires the same reason list. | @claim:sample-findings; @claim:cli-capabilities |
| F-1-16 | The sample test now requires the exact missing.jpg path and the CLI missing-image record. | @claim:sample-findings; @claim:cli-capabilities |
| F-1-17 | The sample test now requires the owner and family-access reminder. The CLI checklist must contain both actions. | @claim:sample-findings; @claim:cli-capabilities |
| F-1-18 | Standardized visitor copy on “check,” “possible duplicate,” and “JSON inventory.” JSON output now uses possible_duplicates. | .factory/copy-audit.md; copy terminology scan |
| F-1-19 | Replaced decorative labels and slogans with “How to check two recipe libraries,” “What the checker reads and writes,” and “Optional family planning pack.” | .factory/copy-audit.md; .factory/screenshots/polish-1-home-mobile.png |
| F-1-20 | Renamed the actions to “Replay sample run” and “Enter license token.” | @claim:demo-privacy; .factory/screenshots/polish-1-demo-desktop.png |
| F-1-21 | Split the README capability sentence into two short sentences. The full landing copy audit has no sentence over 22 words. | .factory/copy-audit.md; README.md |

## Additional required acceptance work

- The first action uses the direct isolated URL /?demo=1. It opens completed findings with the persistent banner, Reset demo, and Start for real.
- Route tests cover /, /?demo=1, /demo, /privacy, /terms, and an unknown path. Each route updates title, description, canonical, Open Graph, and Twitter metadata.
- Navigation moves focus to the new h1 and announces it. Browser Back restores route, focus, and scroll position.
- The build emits dedicated route documents and a styled 404 document. Static Web Apps rewrites genuine 404 responses to that document.
- Footer legal links are present on every route.
- Mobile checks run at both 320px and 390px. They require no horizontal overflow and no visible interactive target below 44×44 CSS pixels.
- Axe scans every route, including the unknown route. Reduced-motion and offline checks cover the SVG recording and isolated sample.

## Evidence files

- .factory/screenshots/polish-1-home-mobile.png
- .factory/screenshots/polish-1-demo-desktop.png
- .factory/screenshots/polish-1-privacy-mobile.png
- .factory/screenshots/polish-1-404-desktop.png

Final clean-clone commands and cold live results are recorded in .factory/handoff.md after deployment.

## Cold live recheck by finding

The production origin was opened in a fresh Chromium context after deployment. Tests ran with PLAYWRIGHT_BASE_URL set to the live origin.

| Findings | Live evidence |
| --- | --- |
| F-1-02, F-1-08, F-1-15, F-1-16, F-1-17, F-1-20 | /?demo=1 passed the sample, recording, replay, reset, storage, and screenshot checks. See .factory/live-verification/screenshot-desktop.png. |
| F-1-03, F-1-04, F-1-05, F-1-06, F-1-18, F-1-19 | / passed cold-copy, CTA, purchase, terminology, and mobile layout checks. See .factory/live-verification/screenshot-mobile.png. |
| F-1-14 | /privacy and the recorded licensed flow passed exact origin, query, body, referrer, storage, title, and axe checks. |
| F-1-01, F-1-07, F-1-09, F-1-10, F-1-11, F-1-12, F-1-13, F-1-21 | These are CLI/package/README findings. They passed from the clean clone; the live install and demo documentation links also returned 200. |

Live route status was 200 for /, /?demo=1, /demo, /privacy, and /terms. /missing-page returned 404 with the designed recovery screen.
