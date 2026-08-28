# Handoff

## What shipped

- A Rust 0.1.0 single-binary CLI named `recipe-move-check`.
- Mealie and Tandoor folder readers for individual JSON recipes, JSON arrays, and `recipes` or `items` collections.
- A neutral JSON inventory with ingredients, steps, tags, servings, owner, household, image status, SHA-256 image hashes, and unknown field names.
- Collision checks using normalized names, ingredient overlap, and equal image hashes.
- A Markdown migration checklist covering collisions, missing or external images, unmapped fields, owners, family access, backups, and a test import.
- Helpful failure text for missing paths, unsupported systems, invalid source data, and unwritable output. An empty destination produces a valid zero-collision report.
- `recipe-move-check demo`, which makes isolated fictional exports in a new temporary folder and prints its deletion path.
- A static handwritten-lab-notebook product site with `/`, `/demo`, `/privacy`, `/terms`, and a styled fallback route.
- A one-click browser demo, offline reload, keyboard navigation, reduced motion, responsive 390-pixel layout, security headers, metadata, sitemap, robots file, and service worker.
- A $19 one-time household planning pack using the Sociobot checkout and license-verification contract. The CLI, Markdown report, and JSON inventory remain free.
- Original hero and Open Graph art generated for this product. Provenance and the full prompt are in `.factory/design.md`.

## Run and verify

```sh
npm install
npm test
npm run build
cargo run -- demo
cargo package
```

- Required build command: `npm run build`
- Static deployment directory: `dist/site`
- Release binary: `target/release/recipe-move-check`
- Browser demo: `/demo`
- CLI demo: `recipe-move-check demo`

Final local results on 28 August 2026:

- Rust: 5 unit tests passed; doc tests passed.
- Playwright 1.58.2: 12 browser tests passed in Chromium.
- Claim tests: 5 passed, including CLI outputs, demo privacy, offline reload, sample findings, and paid license download.
- Axe: no serious or critical findings on home, demo, privacy, terms, or the fallback route.
- Factory URL check: HTTP 200, one title, `lang=en`, one `h1`, one `main`, no missing alt text, and no console errors.
- Lighthouse mobile: performance 100, accessibility 100, best practices 100, SEO 100.
- Lighthouse lab metrics: LCP 1.7 seconds, CLS 0, total blocking time 0 milliseconds. Lab Lighthouse does not report a field INP value; zero blocking time and browser interaction tests are the local proxy.
- Initial JavaScript: 15.95 KB raw / 5.83 KB gzip.
- CSS: 12.48 KB raw / 3.70 KB gzip.
- Hero WebP: 143 KB. Open Graph WebP: 82 KB.
- `npm audit`: 0 vulnerabilities.
- `cargo package --allow-dirty --no-verify`: 22 files, 25.8 KB compressed before the final handoff edit.

## Privacy and deletion

The CLI has no network client or telemetry. It reads user-selected folders and writes only the named report and inventory. Delete those files to delete all real-data output. Each CLI demo prints its temporary sandbox path for deletion.

The browser demo uses only `demo:recipe-library-move-check:run`, removes it when leaving demo mode, and never reads real recipes. Paid verification stores `sb_license:recipe-library-move-check` and a dated verdict. It sends only the license token to `api.sociobot.in`.

## Known gaps and next steps

- Export schemas can change. Fixtures cover the documented common Mealie and Tandoor shapes, but future versions may need new field aliases.
- Similarity is intentionally a review hint. It does not use semantic matching and can miss heavily renamed recipes.
- The repository is package-ready but does not publish a crate or attach platform binaries. The factory owns release credentials and packaging.
- The checkout product must be registered by the factory before launch. The site uses the slug-based production URL and has no hardcoded product ID.
- Lighthouse was measured against the local production preview. Deployment latency may change LCP.
