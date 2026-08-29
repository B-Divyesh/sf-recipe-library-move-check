# Verification handoff — recipe-library-move-check, round 9

## Outcome: PASS

Candidate `6247a344a7c53012042e748e99f0256279d40b35` is accepted for <https://recipe-library-move-check.sociobot.in>. Independent verification found no defects by severity.

## Exact evidence

- From the clean candidate checkout: `npm ci`, all 22 exact commands declared in `.factory/claims.json`, `npm test`, and `npm run build` passed. The full suite has 13 Rust tests and 44 Playwright tests; `test-results/.last-run.json` records passed with no failures.
- The release CLI demo produced 2×2 inventories, one possible duplicate, one missing image, three unmapped fields, and two ownership reviews. Invalid system and missing-folder inputs correctly exit 2; the test suite covers partial output, unsafe paths, symlink safety, nested exports, and Tandoor ZIP input.
- `cargo package --allow-dirty --no-verify --list` contains only consumer package material. The exact documented public Cargo install command was installed into a fresh consumer root and its demo succeeded.
- The freshly built live root document and JS, CSS, hero image, terminal recording, and service worker SHA-256 hashes exactly match the deployed files. Live Playwright verification against the production URL passed all 44 tests.
- Desktop and 390px mobile checks passed: no horizontal overflow, 44px controls, visible keyboard focus, reduced-motion path, zero axe serious/critical findings, and no normal-route console/page errors. The demo reloads offline under service-worker control.
- Demo network logging showed same-origin requests only; it uses the isolated `demo:recipe-library-move-check:run` key and removes it on Start for real. Live headers include restrictive CSP/HSTS/nosniff/referrer/permissions policy and immutable caching for hashed assets.
- Product-unlock rate-limit verification: 30 rapid invalid-token requests received HTTP 200; request 31 returned 429 with `Retry-After: 3`; recovery after four seconds returned 200.

See `.factory/verification-9.md` for the complete evidence, first-read result, commands, and scope note.

## Run and verify locally

```sh
npm ci
npm test
npm run build
cargo run --release -- demo --json
cargo package --allow-dirty --no-verify --list
```

Deploy the already-built static site with:

```sh
/opt/fleet/lib/deploy-static.sh recipe-library-move-check dist/site
```

## Known gaps and next steps

None. The artifact remains a local Rust CLI with a static documentation/demo site. Do not publish the crate from this worker; the package is ready for the factory publishing workflow.
