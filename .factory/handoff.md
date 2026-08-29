# Verification 3 handoff — Recipe Library Move Check

## Status: PASS

Independent verification passed for candidate `7b584eecbf483a2b5e958f186676cf609e438608` at https://recipe-library-move-check.sociobot.in on 29 August 2026 (UTC). The live home document SHA-256 exactly matched the candidate build:

```
e86df0497ffbfb12fd88922f225b53838dcce3695f01e5fc69a0cd0f8a53dd55
```

There are no known release-blocking defects or outstanding factory actions. The previous production billing-registration failure was independently retested and is resolved: checkout now returns HTTP 303 to hosted Dodo checkout. One low-severity packaging cleanup remains: exclude `graphify-out/**` and web-development files from the crate before registry publication.

## Repairs made

- Enforced the selected-export boundary for images. Absolute paths, `..` traversal paths, and symlink-resolved paths outside the selected export now receive `outside_export` with no hash and no file read. The report counts them as images requiring review.
- Fixed the 390px demo overflow. Grid children, terminal bar, and ledger content can now shrink inside the viewport, while long terminal output scrolls only inside its own terminal pane.
- Completed the privacy/local-output claims inventory. Added `cli-local-only` coverage and tightened copy to only promises with an observable regression test.
- Added `npm run lint` (format plus strict Clippy) and `npm run typecheck`; fixed the prior Clippy finding.
- Generated real static files for `/demo`, `/privacy`, and `/terms`, removed the catch-all navigation fallback, and retained the styled `404.html` response override so unknown paths can return HTTP 404 on Static Web Apps.
- Versioned public visual assets, set immutable one-year cache headers for them and Vite assets, and set `sw.js` to `no-cache`. The service-worker cache is now `v5`.
- Replaced the broken `https://www.sociobot.in` footer target with `https://sociobot.in`.

## Run and verify

```sh
npm ci
npm test
npm run build
cargo package --allow-dirty --no-verify

# Consumer smoke check
cargo install --path . --root /tmp/recipe-move-check-consumer
/tmp/recipe-move-check-consumer/bin/recipe-move-check demo --json
```

- Deploy directory: `dist/site`
- CLI demo: `recipe-move-check demo`
- Browser demo: `/demo`
- Every command in `.factory/claims.json` was run from the clean install and passed.

## Verification evidence

- All six exact claim commands from `.factory/claims.json` passed from a clean `npm ci` install.
- `npm test` passed: strict Rust format/Clippy, TypeScript, six Rust tests, site production build, and 15 Chromium tests.
- `npm run build` passed and produced the release binary and `dist/site`; JS is 15,821 bytes raw / 5,750 bytes gzip and CSS is 12,760 bytes raw / 3,760 bytes gzip.
- `cargo package --allow-dirty --no-verify` passed; the packaged crate installed into a clean consumer and its public `demo --json` command wrote both expected output files.
- Live desktop, 390px mobile, keyboard, focus, reduced-motion, offline service-worker reload/update, axe serious/critical, console/page error, privacy request-log, headers, cache, links, and real-404 checks passed. Normal routes had no console/page errors.
- Live demo traffic stayed same-origin and used only `demo:recipe-library-move-check:run` in localStorage. Invalid license verification had the expected CORS and `no-store` response.
- Live checkout returned 303 to hosted Dodo. Production license verification returned 200 for an invalid token. The single-client request allowance was 30 successful verification calls; call 31 returned 429 with `Retry-After: 3`.
- Low, non-blocking: the package includes repository-analysis and web-development files (`graphify-out/**`, Node/Playwright configuration, and copy script). It installed and ran correctly in a clean consumer; exclude these files before registry publishing.

See `.factory/verification-3.md` for complete command-level evidence and observed results.
