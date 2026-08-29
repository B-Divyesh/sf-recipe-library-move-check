# Recipe Library Move Check

Check a recipe move before you import the family library.

Recipe Library Move Check is a local CLI for households moving between Mealie and Tandoor. It inventories recipes and writes a review checklist. It flags possible duplicates, missing images, and fields to review.

## Try the sample

```sh
cargo run -- demo
```

The command copies the bundled sample into a temporary folder. It then runs the same checker used by the `check` command. It prints the checklist path and the folder you can delete afterward.

Open the isolated browser sample at <https://recipe-library-move-check.sociobot.in/?demo=1>. Its banner includes **Reset demo** and **Start for real**.

## Check your exports

Export both libraries to folders, then run:

```sh
cargo run -- check \
  --source mealie:/path/to/mealie-export \
  --destination tandoor:/path/to/tandoor-export \
  --report move-check.md \
  --inventory neutral-inventory.json
```

The source is the library you plan to move. The destination is the existing library you compare against. Recipe JSON files and images may be inside nested folders. Tandoor's default `export_YYYY-MM-DD.zip` is supported directly: its per-recipe ZIP files are read in place, including each `recipe.json`, step ingredients, and sibling `image.*` file.

The checker reads the two folders and writes only the two paths you name. It does not change either export. It rejects the same folder for both libraries, report or inventory paths inside either export, paths that alias an input file, and report/inventory paths that overlap each other. It does not follow directory symlinks or read JSON symlinks that resolve outside the selected folder.

The JSON inventory is a JSON file for scripts or another recipe tool. Print the complete result as JSON:

```sh
cargo run -- check \
  --source mealie:examples/mealie \
  --destination tandoor:examples/tandoor \
  --json
```

Exit code `0` means the check inventoried every recipe candidate, even when it found review items. Exit code `1` means it wrote a marked **partial** checklist and inventory because one or more JSON files or recipe candidates could not be inventoried; fix the named items and run it again before importing. This includes an all-malformed source folder, so the partial outputs still identify the problem. Invalid arguments, unsafe output paths, and unreadable folders return exit code `2`. Run `recipe-move-check --help` to see every option.

## Supported export fields

- Mealie: names, Schema.org ingredients, instruction text, tags, servings, and local image paths.
- Tandoor: names, structured steps and ingredients, keywords, servings, local image paths, and the sibling image in its default per-recipe ZIP export.

The JSON inventory keeps unknown field names and lists them for review. Image hashes identify equal files inside the selected folders. They do not copy an image or grant rights to it.

## Install and package

```sh
cargo install --path .
cargo package
```

The crate starts at version `0.1.0`. The packaged CLI contains its source, license, README, changelog, and sample exports.

## Develop, test, and deploy

Node is used only for the static documentation site and browser checks.

```sh
npm ci
npm test
npm run build
```

`npm run build` compiles the release CLI and writes the deployable site to `dist/site/`. Build only the site with `npm run build:site`.

The factory deploys `dist/site/` as a static site. No backend or account is required for the free CLI.

## Privacy and deletion

The CLI reads selected folders and writes only your named checklist and inventory. Delete those files to remove its output. Delete the temporary folder printed by `demo` to remove the sample run.

The optional planning pack sends only its license token to Sociobot. Read the site [Privacy](https://recipe-library-move-check.sociobot.in/privacy) and [Terms](https://recipe-library-move-check.sociobot.in/terms) pages.

## Limits

This checker does not import recipes or sync servers. Similarity scores are review hints, not proof. Export formats change, so inspect the checklist before importing.

## License

MIT. See [LICENSE](LICENSE).

Built by Param Factory.
