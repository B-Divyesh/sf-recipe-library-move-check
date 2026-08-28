import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { execFileSync } from "node:child_process";
import { readFileSync, rmSync } from "node:fs";

test("@claim:sample-findings shows the completed sample findings", async ({ page }) => {
  await page.goto("/demo");
  await expect(page.getByRole("heading", { name: "Review a recipe move with sample data" })).toBeVisible();
  const tally = page.getByLabel("Sample result totals");
  await expect(tally).toContainText("1possible collision");
  await expect(tally).toContainText("1missing image");
  await expect(tally).toContainText("3fields to review");
  await expect(page.getByRole("heading", { name: "Lemon Pasta may already exist" })).toBeVisible();
});

test("@claim:demo-privacy sends no sample recipe data away", async ({ page }) => {
  const outgoing: string[] = [];
  page.on("request", request => {
    if (new URL(request.url()).origin !== "http://127.0.0.1:4173") outgoing.push(request.url());
  });
  await page.goto("/demo");
  await page.getByRole("button", { name: "Replay run" }).last().click();
  await page.getByRole("button", { name: "Reset demo" }).click();
  expect(outgoing).toEqual([]);
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual(["demo:recipe-library-move-check:run"]);
});

test("@claim:cli-output writes a report and neutral JSON inventory", async () => {
  const output = execFileSync("cargo", ["run", "--quiet", "--", "demo", "--json"], { encoding: "utf8" });
  const result = JSON.parse(output);
  expect(result.summary).toMatchObject({ source_recipes: 2, destination_recipes: 2, collisions: 1, missing_images: 1 });
  expect(result.source_system).toBe("mealie");
  expect(result.destination_system).toBe("tandoor");
  expect(readFileSync(result.outputs.report, "utf8")).toContain("# Recipe library move checklist");
  expect(JSON.parse(readFileSync(result.outputs.inventory, "utf8")).collisions).toHaveLength(1);
  rmSync(result.outputs.report.split("/move-check.md")[0], { recursive: true, force: true });
});

test("@claim:offline-demo reloads the sample after the first visit", async ({ page, context }) => {
  await page.goto("/demo");
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole("heading", { name: "Review a recipe move with sample data" })).toBeVisible();
});

test("@claim:planning-pack verifies a license and downloads the worksheet", async ({ page }) => {
  await page.route("https://api.sociobot.in/**", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ valid: true, reason: "ok" }) }));
  await page.goto("/?license=test-license");
  await expect(page.getByText("Planning pack ready on this device.")).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download planning pack" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("family-recipe-move-plan.md");
  expect(page.url()).not.toContain("license=");
});

for (const route of ["/", "/demo", "/privacy", "/terms", "/missing-page"]) {
  test(`accessibility baseline on ${route}`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("main")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter(item => ["serious", "critical"].includes(item.impact || ""))).toEqual([]);
  });
}

test("keyboard path reaches the sample action", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  for (let i = 0; i < 6; i += 1) {
    await page.keyboard.press("Tab");
    if (await page.getByRole("link", { name: "Try it with sample data" }).evaluate(node => node === document.activeElement)) break;
  }
  await expect(page.getByRole("link", { name: "Try it with sample data" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/demo$/);
});

test("390px layout has no horizontal page overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Try it with sample data" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});
