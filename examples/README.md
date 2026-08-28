# Sample exports

These small, fictional household exports exercise the documented check command. The Mealie folder has two recipes. The Tandoor folder has an existing recipe with the same name and image bytes, plus one unrelated recipe. One Mealie image is deliberately missing and two fields need review.

Run:

```sh
cargo run -- check --source mealie:examples/mealie --destination tandoor:examples/tandoor --report /tmp/move-check.md --inventory /tmp/neutral-inventory.json
```
