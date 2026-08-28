# Recipe Library Move Check

Check a recipe move before you import the family library.

Recipe Library Move Check is a local command-line preflight for households moving between Mealie and Tandoor. It inventories recipes, hashes available images, finds likely duplicates, lists fields that will not map cleanly, and writes a review checklist. It never uploads recipe data.

## Try the sample

```sh
cargo run -- demo
```

The command creates a temporary sandbox, runs the same checker used for real exports, and prints the report path. You can also view the site demo at `https://recipe-library-move-check.sociobot.in/demo`.

## Check your exports

Export both libraries to folders, then run:

```sh
cargo run -- check \
  --source mealie:/path/to/mealie-export \
  --destination tandoor:/path/to/tandoor-export \
  --report move-check.md \
  --inventory neutral-inventory.json
```

The source is the library you plan to move. The destination is the existing library you want to protect. Folder paths may contain nested recipe JSON files and images. The checker reads data but never changes either export.

For scripts, print the full result as JSON:

```sh
cargo run -- check \
  --source mealie:examples/mealie \
  --destination tandoor:examples/tandoor \
  --json
```

Exit code `0` means the check completed, even when review items exist. Invalid arguments or unreadable exports return a non-zero code. Run `recipe-move-check --help` for every option.

## Supported export shapes

- Mealie: JSON files containing `name` or `recipe.name`, Schema.org ingredients, instruction text, tags, and local image paths.
- Tandoor: JSON files containing `name`, structured steps and ingredients, keywords, servings, and local image paths.

Unknown JSON fields are preserved by name in the neutral inventory and listed for review. Image hashes identify equal files; they do not copy or grant rights to an image.

## Install and package

Rust 1.80 or newer is required.

```sh
cargo install --path .
cargo package
```

The crate starts at version `0.1.0`. The factory owns publishing credentials; this repository does not publish itself.

## Develop and verify

Node 20 or newer is used only for the static documentation site and browser checks.

```sh
npm install
npm test
npm run build
```

`npm run build` compiles the release binary and writes the deployable site to `dist/site/`. `npm run build:site` builds only the site.

## Privacy and deletion

Recipe files stay on your computer. The CLI makes only the report and inventory paths you request. Delete those files, or delete the temporary directory printed by `demo`, to remove its output. The optional paid planning pack verifies only its license token with Sociobot; see the site’s Privacy and Terms pages.

## Limits

This is a preflight, not an importer or server sync tool. Similarity scores are review hints, not proof. Export formats change, so inspect the checklist before moving the family library.

## License

MIT. See [LICENSE](LICENSE).

Built by Param Factory.
