# Review 1 handoff — Recipe Library Move Check

## Status: FAIL

This reviewer made no product-code changes. The committed review is .factory/review-1.md.

## What was verified

- Cold live visits on 390px and desktop, before scrolling.
- Live demo sandbox, reset/exit behavior, same-origin request log, offline reload, routes, titles, back-button focus, 404, metadata, assets, links, checkout redirect, and Axe serious/critical checks.
- All six exact claims.json commands in a fresh clone after npm ci.
- npm test, npm run build, cargo run --quiet -- demo --json, and the packaged-crate file list in that fresh clone.
- All earlier verification reports and the previous handoff.

## Remaining work

The review is blocking for three groups of work:

1. Exclude graphify-out/** and web-only tooling from the published Rust crate.
2. Replace the hard-coded browser terminal transcript with a self-hosted recording of the real CLI demo.
3. Bring every relied-on landing/README capability, boundary, price, privacy, and format statement under an observable claims.json test, or remove it.

See .factory/review-1.md for exact quotes, test gaps, rewrites, and retest requirements.
