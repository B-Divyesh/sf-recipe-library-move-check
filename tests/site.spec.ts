import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import {
  existsSync,
  linkSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, join, relative } from "node:path";

const EXPECTED_ORIGIN = new URL(process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:4173").origin;

type CliResult = {
  source_system: string;
  destination_system: string;
  summary: {
    source_recipes: number;
    destination_recipes: number;
    possible_duplicates: number;
    missing_images: number;
    unmapped_fields: number;
    ownership_reviews: number;
  };
  possible_duplicates: Array<{ reasons: string[] }>;
  source_recipes: Array<{
    name: string;
    source_file: string;
    ingredients: string[];
    instructions: string[];
    tags: string[];
    servings: string | null;
    image: { declared_path: string | null; status: string; sha256: string | null };
    unmapped_fields: string[];
  }>;
  destination_recipes: CliResult["source_recipes"];
  warnings: Array<{ file: string; message: string; affects_completeness: boolean }>;
  outputs: { report: string; inventory: string };
};

function runCargo(args: string[]): string {
  return execFileSync("cargo", ["run", "--quiet", "--", ...args], {
    cwd: process.cwd(),
    encoding: "utf8",
  });
}

function treeDigest(root: string): Record<string, string> {
  const result: Record<string, string> = {};
  const visit = (folder: string): void => {
    for (const name of readdirSync(folder).sort()) {
      const path = join(folder, name);
      if (statSync(path).isDirectory()) visit(path);
      else result[relative(root, path)] = createHash("sha256").update(readFileSync(path)).digest("hex");
    }
  };
  visit(root);
  return result;
}

function removeDemo(result: CliResult): void {
  rmSync(result.outputs.report.split("/move-check.md")[0], { recursive: true, force: true });
}

test("@claim:sample-findings shows every recorded sample finding", async ({ page }) => {
  await page.goto("/?demo=1");
  await expect(page.getByRole("heading", { name: "Review a recipe move with sample data" })).toBeVisible();
  const tally = page.getByLabel("Sample result totals");
  await expect(tally).toContainText("1possible duplicate");
  await expect(tally).toContainText("1missing image");
  await expect(tally).toContainText("3fields to review");
  await expect(page.getByText("Same name, ingredient list, and image hash.")).toBeVisible();
  await expect(page.getByText("The export points to")).toContainText("missing.jpg");
  await expect(page.getByText("Choose the new owner and recreate family access.")).toBeVisible();
});

test("@claim:demo-privacy isolates, resets, and discards the browser sample", async ({ page }) => {
  const outgoing: string[] = [];
  page.on("request", request => {
    if (new URL(request.url()).origin !== EXPECTED_ORIGIN) outgoing.push(request.url());
  });
  await page.goto("/?demo=1");
  await expect(page.getByRole("status")).toContainText("sample data, nothing is saved");
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual(["demo:recipe-library-move-check:run"]);
  await page.getByRole("button", { name: "Replay sample run" }).last().click();
  await expect(page.getByRole("button", { name: "Sample run replayed" }).last()).toBeVisible();
  await page.getByRole("button", { name: "Reset demo" }).click();
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual(["demo:recipe-library-move-check:run"]);
  await page.getByRole("link", { name: "Start for real" }).click();
  await expect(page).toHaveURL(/\/#install$/);
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
  expect(outgoing).toEqual([]);
});

test("@claim:cli-capabilities inventories, hashes, compares, and reports the sample", async ({ page }) => {
  const result = JSON.parse(runCargo(["demo", "--json"])) as CliResult;
  expect(result.summary).toEqual({
    source_recipes: 2,
    destination_recipes: 2,
    possible_duplicates: 1,
    missing_images: 1,
    unmapped_fields: 3,
    ownership_reviews: 2,
  });
  expect(result.possible_duplicates[0].reasons).toEqual([
    "same normalized name",
    "similar ingredient list",
    "same image hash",
  ]);
  expect(result.source_recipes.find(recipe => recipe.name === "Lemon Pasta")?.image.sha256).toMatch(/^[a-f0-9]{64}$/);
  expect(result.source_recipes.find(recipe => recipe.name === "Red Lentil Soup")?.image).toMatchObject({
    declared_path: "missing.jpg",
    status: "missing",
  });
  const report = readFileSync(result.outputs.report, "utf8");
  expect(report).toContain("# Recipe library move checklist");
  expect(report).toContain("## Possible duplicates");
  expect(report).toContain("Choose an owner for **Lemon Pasta**");
  expect(report).toContain("Recreate household access for **Lemon Pasta**");
  expect(JSON.parse(readFileSync(result.outputs.inventory, "utf8")).possible_duplicates).toHaveLength(1);
  await page.goto("/");
  await expect(page.locator(".facts li").nth(1)).toContainText("Writes a checklist and a JSON inventory you can review before importing.");
  expect(readFileSync("README.md", "utf8")).toContain("The JSON inventory is a JSON file for scripts or another recipe tool.");
  removeDemo(result);
});

test("@claim:free-cli runs without an account, license, or reachable network", async () => {
  execFileSync("cargo", ["build", "--quiet"], { cwd: process.cwd() });
  const environment = {
    PATH: process.env.PATH || "",
    TMPDIR: tmpdir(),
    HTTP_PROXY: "http://127.0.0.1:1",
    HTTPS_PROXY: "http://127.0.0.1:1",
    ALL_PROXY: "http://127.0.0.1:1",
    NO_PROXY: "",
  };
  const output = execFileSync(join(process.cwd(), "target/debug/recipe-move-check"), ["demo", "--json"], {
    encoding: "utf8",
    env: environment,
  });
  const result = JSON.parse(output) as CliResult;
  expect(existsSync(result.outputs.report)).toBe(true);
  expect(existsSync(result.outputs.inventory)).toBe(true);
  expect(readFileSync("LICENSE", "utf8")).toContain("Permission is hereby granted, free of charge");
  removeDemo(result);
});

test("@claim:demo-is-real-cli matches check on the shipped folders and recording", async () => {
  const sandbox = mkdtempSync(join(tmpdir(), "recipe-move-check-equivalence-"));
  const demo = JSON.parse(runCargo(["demo", "--json"])) as CliResult;
  const checked = JSON.parse(runCargo([
    "check",
    "--source", "mealie:examples/mealie",
    "--destination", "tandoor:examples/tandoor",
    "--report", join(sandbox, "move-check.md"),
    "--inventory", join(sandbox, "neutral-inventory.json"),
    "--json",
  ])) as CliResult;
  const normalized = (result: CliResult) => ({
    source_system: result.source_system,
    destination_system: result.destination_system,
    summary: result.summary,
    possible_duplicates: result.possible_duplicates,
    source_recipes: result.source_recipes,
    destination_recipes: result.destination_recipes,
  });
  expect(normalized(demo)).toEqual(normalized(checked));
  const recording = JSON.parse(readFileSync("examples/demo-recording.json", "utf8"));
  expect(recording.summary).toEqual(demo.summary);
  expect(recording.output_filenames).toEqual([
    basename(demo.outputs.report),
    basename(demo.outputs.inventory),
  ]);
  const svg = readFileSync("site/public/terminal-recording.svg", "utf8");
  expect(svg).toContain("recipe-move-check demo --json");
  expect(svg).toContain(`possible_duplicates: <tspan class="number">${demo.summary.possible_duplicates}</tspan>`);
  expect(svg).toContain(`missing_images: <tspan class="number">${demo.summary.missing_images}</tspan>`);
  removeDemo(demo);
  rmSync(sandbox, { recursive: true, force: true });
});

test("@claim:nested-export-support reads recipe JSON and images in nested folders", async () => {
  const result = JSON.parse(runCargo([
    "check",
    "--source", "mealie:examples/mealie",
    "--destination", "tandoor:examples/tandoor",
    "--report", join(tmpdir(), "nested-report.md"),
    "--inventory", join(tmpdir(), "nested-inventory.json"),
    "--json",
  ])) as CliResult;
  expect(result.source_recipes.map(recipe => recipe.source_file)).toEqual([
    "lemon-pasta/recipe.json",
    "lentil-soup/recipe.json",
  ]);
  expect(result.destination_recipes.map(recipe => recipe.source_file)).toEqual([
    "recipes/lemon.json",
    "recipes/granola.json",
  ]);
  expect(result.source_recipes[0].image.status).toBe("present");
  rmSync(result.outputs.report, { force: true });
  rmSync(result.outputs.inventory, { force: true });
});

test("@claim:cli-local-only leaves both exports byte-identical and changes only named outputs", async () => {
  const sandbox = mkdtempSync(join(tmpdir(), "recipe-move-check-local-"));
  const source = join(sandbox, "moving");
  const destination = join(sandbox, "existing");
  const output = join(sandbox, "review");
  mkdirSync(join(source, "nested"), { recursive: true });
  mkdirSync(join(destination, "nested"), { recursive: true });
  mkdirSync(output);
  writeFileSync(join(source, "nested", "photo.jpg"), "local photo");
  writeFileSync(join(source, "nested", "recipe.json"), '{"name":"Local toast","image":"photo.jpg"}');
  writeFileSync(join(destination, "nested", "recipe.json"), '{"name":"Existing toast"}');
  const sourceBefore = treeDigest(source);
  const destinationBefore = treeDigest(destination);
  const before = treeDigest(sandbox);
  const run = spawnSync("cargo", [
    "run", "--quiet", "--", "check",
    "--source", `mealie:${source}`,
    "--destination", `tandoor:${destination}`,
    "--report", join(output, "move-check.md"),
    "--inventory", join(output, "neutral-inventory.json"),
  ], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: { ...process.env, HTTP_PROXY: "http://127.0.0.1:1", HTTPS_PROXY: "http://127.0.0.1:1", ALL_PROXY: "http://127.0.0.1:1", NO_PROXY: "" },
  });
  expect(run.status).toBe(0);
  expect(treeDigest(source)).toEqual(sourceBefore);
  expect(treeDigest(destination)).toEqual(destinationBefore);
  const after = treeDigest(sandbox);
  const changed = Object.keys(after).filter(path => before[path] !== after[path]);
  expect(changed.sort()).toEqual(["review/move-check.md", "review/neutral-inventory.json"]);
  expect(Object.keys(after).filter(path => path.endsWith(".jpg"))).toEqual(["moving/nested/photo.jpg"]);
  rmSync(join(output, "move-check.md"));
  rmSync(join(output, "neutral-inventory.json"));
  expect(readdirSync(output)).toEqual([]);
  rmSync(sandbox, { recursive: true, force: true });
});

test("@claim:safe-output-paths rejects export, input-alias, and overlapping output paths before any export changes", async () => {
  const sandbox = mkdtempSync(join(tmpdir(), "recipe-move-check-safe-output-"));
  const source = join(sandbox, "moving");
  const destination = join(sandbox, "existing");
  const output = join(sandbox, "review");
  mkdirSync(source); mkdirSync(destination); mkdirSync(output);
  const sourceRecipe = join(source, "recipe.json");
  writeFileSync(sourceRecipe, '{"name":"Moving toast"}');
  writeFileSync(join(destination, "recipe.json"), '{"name":"Existing toast"}');
  const sourceBefore = treeDigest(source);
  const destinationBefore = treeDigest(destination);
  const run = (report: string, inventory: string) => spawnSync("cargo", [
    "run", "--quiet", "--", "check", "--source", `mealie:${source}`, "--destination", `tandoor:${destination}`,
    "--report", report, "--inventory", inventory,
  ], { cwd: process.cwd(), encoding: "utf8" });

  const insideExport = run(sourceRecipe, join(output, "inventory.json"));
  expect(insideExport.status).toBe(2);
  expect(insideExport.stderr).toContain("report path overlaps a selected export");
  const inventoryInsideExport = run(join(output, "report.md"), join(destination, "inventory.json"));
  expect(inventoryInsideExport.status).toBe(2);
  expect(inventoryInsideExport.stderr).toContain("inventory path overlaps a selected export");
  const hardLinkedInput = join(output, "input-alias.md");
  linkSync(sourceRecipe, hardLinkedInput);
  const inputAlias = run(hardLinkedInput, join(output, "inventory-2.json"));
  expect(inputAlias.status).toBe(2);
  expect(inputAlias.stderr).toContain("report path refers to an input file");
  const shared = join(output, "shared.json");
  const overlappingOutputs = run(shared, shared);
  expect(overlappingOutputs.status).toBe(2);
  expect(overlappingOutputs.stderr).toContain("report and inventory paths overlap");
  expect(treeDigest(source)).toEqual(sourceBefore);
  expect(treeDigest(destination)).toEqual(destinationBefore);
  rmSync(sandbox, { recursive: true, force: true });
});

test("@claim:exit-codes reports success and input failures for scripts", async () => {
  const success = spawnSync("cargo", ["run", "--quiet", "--", "demo"], { cwd: process.cwd(), encoding: "utf8" });
  expect(success.status).toBe(0);
  const root = success.stdout.match(/Delete this sandbox when finished: (.+)/)?.[1]?.trim();
  if (root) rmSync(root, { recursive: true, force: true });
  const invalid = spawnSync("cargo", ["run", "--quiet", "--", "check", "--source", "paprika:nope"], { cwd: process.cwd(), encoding: "utf8" });
  expect(invalid.status).not.toBe(0);
  expect(invalid.stderr).toContain("use mealie or tandoor");
  const missing = spawnSync("cargo", [
    "run", "--quiet", "--", "check",
    "--source", "mealie:/definitely/missing/recipe-export",
    "--destination", "tandoor:examples/tandoor",
  ], { cwd: process.cwd(), encoding: "utf8" });
  expect(missing.status).toBe(2);
  expect(missing.stderr).toContain("export folder does not exist");
});

test("@claim:partial-read-warnings writes a marked partial checklist and returns exit code 1", async () => {
  const sandbox = mkdtempSync(join(tmpdir(), "recipe-move-check-partial-"));
  const source = join(sandbox, "moving");
  const destination = join(sandbox, "existing");
  const output = join(sandbox, "review");
  mkdirSync(source); mkdirSync(destination); mkdirSync(output);
  writeFileSync(join(source, "valid.json"), '{"name":"Moving toast","owner":"Ada"}');
  writeFileSync(join(source, "broken.json"), "{not valid JSON");
  writeFileSync(join(destination, "recipe.json"), '{"name":"Existing toast"}');
  const report = join(output, "report.md");
  const inventory = join(output, "inventory.json");
  const result = spawnSync("cargo", [
    "run", "--quiet", "--", "check", "--source", `mealie:${source}`, "--destination", `tandoor:${destination}`,
    "--report", report, "--inventory", inventory,
  ], { cwd: process.cwd(), encoding: "utf8" });
  expect(result.status).toBe(1);
  expect(result.stdout).toContain("Check completed with 1 input warning(s). The checklist and inventory are partial.");
  expect(result.stdout).toContain("broken.json");
  expect(result.stdout).toContain("Exit code: 1");
  const checklist = readFileSync(report, "utf8");
  expect(checklist).toContain("## Input warnings");
  expect(checklist).toContain("This checklist is partial");
  expect(checklist).toContain("broken.json");
  expect(checklist).toContain("exit code 1");
  expect(JSON.parse(readFileSync(inventory, "utf8")).warnings).toMatchObject([
    { affects_completeness: true, message: expect.stringContaining("invalid JSON") },
  ]);
  rmSync(sandbox, { recursive: true, force: true });
});

test("@claim:family-review-empty-state explains when no owner or household review is needed", async () => {
  const sandbox = mkdtempSync(join(tmpdir(), "recipe-move-check-family-empty-"));
  const source = join(sandbox, "moving");
  const destination = join(sandbox, "existing");
  mkdirSync(source); mkdirSync(destination);
  writeFileSync(join(source, "recipe.json"), '{"name":"Moving toast","owner":"Ada"}');
  writeFileSync(join(destination, "recipe.json"), '{"name":"Existing toast"}');
  const report = join(sandbox, "report.md");
  const inventory = join(sandbox, "inventory.json");
  const result = spawnSync("cargo", [
    "run", "--quiet", "--", "check", "--source", `tandoor:${source}`, "--destination", `mealie:${destination}`,
    "--report", report, "--inventory", inventory,
  ], { cwd: process.cwd(), encoding: "utf8" });
  expect(result.status).toBe(0);
  const checklist = readFileSync(report, "utf8");
  expect(checklist).toMatch(/## Family review\n\nNo owner or household access checks were found\.\n\n## Before importing/);
  rmSync(sandbox, { recursive: true, force: true });
});

test("@claim:supported-fields maps the documented Mealie and Tandoor fields", async () => {
  const result = JSON.parse(runCargo([
    "check",
    "--source", "mealie:examples/mealie",
    "--destination", "tandoor:examples/tandoor",
    "--report", join(tmpdir(), "fields-report.md"),
    "--inventory", join(tmpdir(), "fields-inventory.json"),
    "--json",
  ])) as CliResult;
  const mealie = result.source_recipes.find(recipe => recipe.name === "Lemon Pasta")!;
  expect(mealie).toMatchObject({
    ingredients: ["250 g spaghetti", "1 lemon", "2 tbsp olive oil"],
    instructions: ["Boil pasta.", "Toss with lemon and oil."],
    tags: ["weeknight", "family"],
    servings: "4",
  });
  const tandoor = result.destination_recipes.find(recipe => recipe.name === "Lemon Pasta")!;
  expect(tandoor.ingredients).toEqual(["250 g spaghetti", "1 lemon", "2 tbsp olive oil"]);
  expect(tandoor.instructions).toEqual(["Boil pasta, then toss with lemon and oil."]);
  expect(tandoor.tags).toEqual(["weeknight", "family"]);
  expect(tandoor.servings).toBe("4");
  expect(tandoor.image.status).toBe("present");
  rmSync(result.outputs.report, { force: true });
  rmSync(result.outputs.inventory, { force: true });
});

test("@claim:unknown-fields keeps unknown names in the inventory and checklist", async () => {
  const result = JSON.parse(runCargo(["demo", "--json"])) as CliResult;
  expect(result.source_recipes.find(recipe => recipe.name === "Lemon Pasta")?.unmapped_fields).toEqual([
    "household ownership",
    "rating",
  ]);
  expect(result.source_recipes.find(recipe => recipe.name === "Red Lentil Soup")?.unmapped_fields).toEqual(["notes"]);
  const report = readFileSync(result.outputs.report, "utf8");
  for (const field of ["household ownership", "rating", "notes"]) expect(report).toContain(`\`${field}\``);
  removeDemo(result);
});

test("@claim:license-privacy sends only the token to the Sociobot verification route", async ({ page }) => {
  const crossOrigin: Array<{ url: string; method: string; body: string | null; referer?: string }> = [];
  await page.route("https://api.sociobot.in/**", async route => {
    const request = route.request();
    crossOrigin.push({
      url: request.url(),
      method: request.method(),
      body: request.postData(),
      referer: request.headers().referer,
    });
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ valid: true, reason: "ok" }),
    });
  });
  await page.goto("/?license=private-test-token");
  await expect(page.getByText("Planning pack ready on this device.")).toBeVisible();
  expect(page.url()).not.toContain("license=");
  expect(crossOrigin).toHaveLength(1);
  const requestUrl = new URL(crossOrigin[0].url);
  expect(requestUrl.origin).toBe("https://api.sociobot.in");
  expect(requestUrl.pathname).toBe("/api/v1/products/recipe-library-move-check/verify");
  expect([...requestUrl.searchParams.entries()]).toEqual([["license", "private-test-token"]]);
  expect(crossOrigin[0]).toMatchObject({ method: "GET", body: null });
  expect(crossOrigin[0].referer).not.toContain("private-test-token");
  expect(await page.evaluate(() => Object.keys(localStorage).sort())).toEqual([
    "sb_license:recipe-library-move-check",
    "sb_license:recipe-library-move-check:verdict",
  ]);
});

test("@claim:cached-license-notice keeps the inactive-license recovery message during its cached day", async ({ page }) => {
  let requests = 0;
  await page.route("https://api.sociobot.in/**", route => {
    requests += 1;
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ valid: false, reason: "invalid" }) });
  });
  await page.goto("/?license=inactive-license");
  await expect(page.getByText("This license is no longer active.")).toBeVisible();
  await expect(page.locator("#license-status").getByRole("link", { name: "Buy the planning pack" })).toBeVisible();
  expect(requests).toBe(1);
  await page.reload();
  await expect(page.getByText("This license is no longer active.")).toBeVisible();
  await expect(page.locator("#license-status").getByRole("link", { name: "Buy the planning pack" })).toBeVisible();
  expect(requests).toBe(1);
});

test("@claim:offline-demo reloads the isolated sample after the first visit", async ({ page, context }) => {
  await page.goto("/?demo=1");
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Review a recipe move with sample data" })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("nothing is saved");
  await page.getByRole("button", { name: "Replay sample run" }).last().click();
  await expect.poll(() => page.locator(".terminal-recording").last().evaluate(image => (image as HTMLImageElement).naturalWidth)).toBe(960);
});

test("@claim:planning-pack verifies $19 access and downloads the stated contents", async ({ page }) => {
  await page.route("https://api.sociobot.in/**", route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ valid: true, reason: "ok" }),
  }));
  await page.goto("/?license=test-license");
  await expect(page.getByText("The CLI is free. The planning pack costs $19 once.")).toBeVisible();
  await expect(page.getByText("Optional planning pack · $19 once")).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download planning pack" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("family-recipe-move-plan.md");
  const downloadPath = await download.path();
  expect(downloadPath).not.toBeNull();
  const contents = readFileSync(downloadPath!, "utf8");
  expect(contents).toContain("## Owners");
  expect(contents).toContain("Assign an owner to every recipe");
  expect(contents).toContain("## Move day");
  expect(contents).toContain("Resolve possible duplicates");
});

test("@claim:billing-roles matches the recorded checkout disclosure on every purchase page", async ({ page }) => {
  const fixture = JSON.parse(readFileSync("tests/fixtures/dodo-checkout-disclosure.json", "utf8")) as {
    checkout_endpoint: string;
    redirect_origin: string;
    checkout_title: string;
    checkout_footer: string;
    product_disclosure: string;
  };
  expect(fixture.checkout_title).toBe("Sociobot | Checkout");
  expect(fixture.redirect_origin).toBe("https://checkout.dodopayments.com");
  expect(fixture.checkout_footer).toContain("online reseller & Merchant of Record");
  expect(fixture.checkout_footer).toContain("order-related inquiries and returns");

  await page.goto("/");
  await expect(page.getByText(fixture.product_disclosure, { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Buy the planning pack" })).toHaveAttribute("href", fixture.checkout_endpoint);

  await page.goto("/terms");
  await expect(page.getByText(fixture.product_disclosure, { exact: true })).toBeVisible();
  await expect(page.getByText("Sociobot and Dodo are the merchant of record.")).toHaveCount(0);
  await expect(page.getByText("Refunds are handled there.")).toHaveCount(0);
});

test("@claim:crate-package contains only consumer CLI material", async () => {
  const listing = execFileSync("cargo", ["package", "--allow-dirty", "--no-verify", "--list"], {
    cwd: process.cwd(),
    encoding: "utf8",
  }).trim().split("\n");
  expect(listing).toContain("src/main.rs");
  expect(listing).toContain("src/lib.rs");
  expect(listing).toContain("README.md");
  expect(listing).toContain("LICENSE");
  expect(listing.some(path => path.startsWith("examples/"))).toBe(true);
  for (const path of listing) {
    expect(path).not.toMatch(/^(graphify-out|site|tests|scripts|package|playwright|tsconfig|\.factory|AGENTS)/);
  }
});

for (const route of ["/", "/?demo=1", "/demo", "/privacy", "/terms", "/missing-page"]) {
  test(`accessibility baseline on ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto(route);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("footer a[href='/privacy']")).toHaveCount(1);
    await expect(page.locator("footer a[href='/terms']")).toHaveCount(1);
    const results = await new AxeBuilder({ page: page as never }).analyze();
    expect(results.violations.filter(item => ["serious", "critical"].includes(item.impact || ""))).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("real routes set titles, canonical links, and social metadata", async ({ page }) => {
  const routes: Array<[string, string, string]> = [
    ["/", "Recipe Library Move Check — Check before importing", "/"],
    ["/?demo=1", "Demo — Recipe Library Move Check", "/demo"],
    ["/demo", "Demo — Recipe Library Move Check", "/demo"],
    ["/privacy", "Privacy — Recipe Library Move Check", "/privacy"],
    ["/terms", "Terms — Recipe Library Move Check", "/terms"],
    ["/missing-page", "Page not found — Recipe Move Check", "/404"],
  ];
  for (const [route, title, canonical] of routes) {
    await page.goto(route);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://recipe-library-move-check.sociobot.in${canonical}`);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", title);
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute("content", title);
  }
});

test("keyboard navigation, route focus, and browser Back restore the page", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  for (let i = 0; i < 7; i += 1) {
    await page.keyboard.press("Tab");
    if (await page.getByRole("link", { name: "Try it with sample data" }).evaluate(node => node === document.activeElement)) break;
  }
  const sample = page.getByRole("link", { name: "Try it with sample data" });
  await expect(sample).toBeFocused();
  const focus = await sample.evaluate(node => getComputedStyle(node).outlineWidth);
  expect(Number.parseFloat(focus)).toBeGreaterThanOrEqual(3);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page.locator("h1")).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL(`${EXPECTED_ORIGIN}/`);
  await expect(page.locator("h1")).toBeFocused();
});

test("@claim:button-focus-contrast gives every visible button a 3px high-contrast focus outline", async ({ page }) => {
  await page.goto("/");
  const controls = page.locator(".button:visible");
  const count = await controls.count();
  expect(count).toBeGreaterThan(0);
  for (let index = 0; index < count; index += 1) {
    const focus = await controls.nth(index).evaluate(element => {
      (element as HTMLElement).focus();
      const style = getComputedStyle(element);
      const paper = getComputedStyle(document.documentElement).getPropertyValue("--paper").trim();
      return { outlineColor: style.outlineColor, outlineWidth: style.outlineWidth, outlineOffset: style.outlineOffset, paper };
    });
    expect(focus.outlineColor).toBe("rgb(23, 44, 53)");
    expect(Number.parseFloat(focus.outlineWidth)).toBeGreaterThanOrEqual(3);
    expect(Number.parseFloat(focus.outlineOffset)).toBeGreaterThanOrEqual(3);
    expect(focus.paper).toBe("#f4eeda");
  }
});

test("the complete first-screen message fits a 390px phone viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Check your recipe move before importing");
  await expect(page.getByRole("link", { name: "Try it with sample data" })).toBeVisible();
  const facts = page.getByLabel("Product facts");
  await expect(facts.locator("li")).toHaveCount(3);
  expect(await facts.evaluate(element => element.getBoundingClientRect().bottom)).toBeLessThanOrEqual(844);
});

for (const width of [320, 390]) {
  for (const route of ["/", "/?demo=1", "/privacy", "/terms"]) {
    test(`${width}px ${route} layout fits and touch targets remain usable`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
      const smallTargets = await page.locator("a,button,input").evaluateAll(elements =>
        elements.filter(element => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return style.display !== "none" && rect.width > 0 && rect.height > 0 && (rect.height < 44 || rect.width < 44);
        }).map(element => ({ text: element.textContent?.trim(), box: element.getBoundingClientRect().toJSON() })),
      );
      expect(smallTargets).toEqual([]);
    });
  }
}

test("reduced motion removes the terminal recording animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/?demo=1");
  const animation = await page.locator(".terminal-recording").evaluate(async image => {
    const response = await fetch((image as HTMLImageElement).src);
    return response.text();
  });
  expect(animation).toContain("@media (prefers-reduced-motion: reduce)");
  expect(await page.locator("html").evaluate(node => getComputedStyle(node).scrollBehavior)).toBe("auto");
});

test("release output has dedicated routes, legal links, a real 404, and cache policy", async () => {
  for (const output of ["index.html", "demo/index.html", "privacy/index.html", "terms/index.html", "404.html"]) {
    const html = readFileSync(join(process.cwd(), "dist/site", output), "utf8");
    expect(html).toContain("Recipe Move Check");
    expect(html).toContain('rel="canonical"');
  }
  const config = JSON.parse(readFileSync(join(process.cwd(), "dist/site/staticwebapp.config.json"), "utf8"));
  expect(config.navigationFallback).toBeUndefined();
  expect(config.responseOverrides["404"].rewrite).toBe("/404.html");
  expect(config.globalHeaders["Content-Security-Policy"]).toContain("frame-ancestors 'none'");
  const immutable = config.routes.find((route: { route: string }) => route.route === "/terminal-recording.4a32d1.svg");
  expect(immutable.headers["Cache-Control"]).toContain("immutable");
  const sitemap = readFileSync(join(process.cwd(), "dist/site/sitemap.xml"), "utf8");
  for (const route of ["/demo", "/privacy", "/terms"]) expect(sitemap).toContain(`sociobot.in${route}`);
});

test("every declared claim has exactly one tagged outcome test", async () => {
  const claims = JSON.parse(readFileSync(".factory/claims.json", "utf8")) as Array<{ id: string; test: string }>;
  const source = readFileSync("tests/site.spec.ts", "utf8");
  const ids = claims.map(claim => claim.id);
  expect(new Set(ids).size).toBe(ids.length);
  for (const claim of claims) {
    expect(claim.test).toBe(`npm test -- --grep @claim:${claim.id}`);
    expect(source.split(`@claim:${claim.id}`).length - 1).toBe(1);
  }
});
