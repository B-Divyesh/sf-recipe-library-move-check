# Verification handoff — FAIL

## Outcome

Candidate `2fa212b5ecffb52f80b8285a24f75e81fbef459d` at https://recipe-library-move-check.sociobot.in is **not releasable**. The live site matches the candidate and its standard gates pass, but independent CLI tests found release-blocking failures in the real migration job.

Full evidence and reproduction details are in `.factory/verification-6.md`.

## Release blockers

- Tandoor's current default export is an outer ZIP of per-recipe ZIPs. The CLI scans only loose JSON and returns “no recipes were found.” Even after deep extraction, it drops `steps[].ingredients` and does not associate sibling `image.*`.
- A syntactically valid recipe-like JSON object without `name`/`title` is silently omitted. The CLI exits 0, emits no warning, and the checklist says every JSON file was read.
- If every source JSON file is malformed, the CLI discards the warnings, exits 2 with a generic message, and writes neither promised partial output.
- JSON symlinks can read outside the selected export root and copy that content into the inventory.
- The same canonical folder is accepted as both source and destination, producing self-duplicates.

## What passed

- All 20 exact `.factory/claims.json` commands passed after `npm ci` in a clean detached worktree.
- `npm test`: pass (strict Rust format/Clippy, TypeScript, 8 Rust tests, build, 40 Playwright tests).
- `npm run build`: pass; `dist/site/` and release CLI produced.
- `cargo package`: pass; 17 files, 17.3 KiB compressed. Fresh package install and `recipe-move-check demo --json`: pass.
- Live `verify-url.sh`: pass; live Playwright: 40/40.
- Candidate/live HTML and runtime assets: byte-identical.
- Live desktop, 390 px mobile, keyboard, focus, 200% text, reduced motion, axe, console, routing, 404, offline reload, service-worker update, privacy request log, headers, caching, and bundle budgets: pass.
- Mobile Lighthouse: 100 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 0.8 s, CLS 0.
- Checkout: HTTP 303 to Dodo. License verification allowance: 30 requests; request 31 returned 429 with `Retry-After: 3`.

## Reproduce

```sh
npm ci
npm test
npm run build
cargo package
PLAYWRIGHT_BASE_URL=https://recipe-library-move-check.sociobot.in npm run test:browser
```

Then reproduce the failing cases described in `.factory/verification-6.md` with `target/release/recipe-move-check`.

## Next step

Repair real Tandoor export ingestion and incomplete-input reporting first. Add representative claim fixtures for every failure above, then rerun the full claims, package-consumer, CLI boundary, and live deployment checks.
