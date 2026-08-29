import "./styles.css";

const PRODUCT = "Recipe Library Move Check";
const SLUG = "recipe-library-move-check";
const API = "https://api.sociobot.in/api/v1";
const LICENSE_KEY = `sb_license:${SLUG}`;
const VERDICT_KEY = `${LICENSE_KEY}:verdict`;
const DEMO_KEY = `demo:${SLUG}:run`;

type Page = "home" | "demo" | "privacy" | "terms" | "not-found";

const app = document.querySelector<HTMLDivElement>("#app")!;
const status = document.querySelector<HTMLDivElement>("#route-status")!;

function header(): string {
  return `<header class="site-header">
    <nav class="nav shell" aria-label="Main navigation">
      <a class="wordmark" href="/" data-link aria-label="${PRODUCT}, home"><span aria-hidden="true" class="wordmark-mark">✓</span><span>Recipe<br>Move Check</span></a>
      <div class="nav-links"><a href="/demo" data-link>Demo</a><a href="/#install" data-link>Install</a><a href="/privacy" data-link>Privacy</a></div>
    </nav>
  </header>`;
}

function footer(): string {
  return `<footer class="site-footer"><div class="shell footer-grid">
    <p>Check a recipe move before you import.</p>
    <nav aria-label="Footer navigation"><a href="/privacy" data-link>Privacy</a><a href="/terms" data-link>Terms</a><a href="https://sociobot.in" rel="noreferrer">Built by Param Factory <span class="sr-only">(external site)</span></a></nav>
    <p class="build">Version 0.1.0 · build 2026.08.29</p>
  </div></footer>`;
}

function facts(): string {
  return `<ul class="facts" aria-label="Product facts">
    <li><span aria-hidden="true">⌂</span> Runs locally on the folders you select.</li>
    <li><span aria-hidden="true">×</span> Writes a checklist and a JSON inventory you can review before importing.</li>
    <li><span aria-hidden="true">$</span> The CLI is free. The planning pack costs $19 once.</li>
  </ul>`;
}

function terminal(compact = false): string {
  return `<figure class="terminal ${compact ? "terminal-compact" : ""}" aria-labelledby="terminal-title">
    <div class="terminal-bar"><span aria-hidden="true">● ● ●</span><h2 id="terminal-title">Recorded CLI sample</h2><button class="terminal-replay" type="button">Replay sample run</button></div>
    <img class="terminal-recording" src="/terminal-recording.4a32d1.svg" width="960" height="430" alt="Recording of the real CLI finding one possible duplicate, one missing image, and three fields to review.">
    <figcaption>Recorded from <code>recipe-move-check demo --json</code> using the bundled sample.</figcaption>
  </figure>`;
}

function resultLedger(): string {
  return `<section class="ledger" aria-labelledby="ledger-title">
    <div class="ledger-heading"><p class="scribble">sample findings / 29 Aug</p><h2 id="ledger-title">What the check catches</h2></div>
    <div class="tally" aria-label="Sample result totals">
      <div><strong>1</strong><span>possible duplicate</span></div><div><strong>1</strong><span>missing image</span></div><div><strong>3</strong><span>fields to review</span></div>
    </div>
    <div class="evidence-list">
      <article><span class="proof proof-red" aria-hidden="true">!</span><div><h3>Lemon Pasta may already exist</h3><p>Same name, ingredient list, and image hash.</p></div><span class="confidence">high</span></article>
      <article><span class="proof proof-amber" aria-hidden="true">?</span><div><h3>Red Lentil Soup has no image file</h3><p>The export points to <code>missing.jpg</code>.</p></div><span class="confidence">find it</span></article>
      <article><span class="proof proof-blue" aria-hidden="true">→</span><div><h3>Household access needs a decision</h3><p>Choose the new owner and recreate family access.</p></div><span class="confidence">review</span></article>
    </div>
  </section>`;
}

function paidSection(): string {
  return `<section class="paid sheet shell" aria-labelledby="paid-title">
    <div><p class="eyebrow">Optional planning pack · $19 once</p><h2 id="paid-title">Optional family planning pack</h2><p>Download a printable ownership worksheet and move-day notes. The CLI, checklist, and JSON inventory remain free.</p></div>
    <div class="paid-actions">
      <a class="button button-dark" href="${API}/products/${SLUG}/checkout">Buy the planning pack</a>
      <button class="text-button" id="restore-toggle" type="button">Enter license token</button>
      <form id="license-form" class="license-form" hidden><label for="license">License token</label><div><input id="license" name="license" autocomplete="off" required><button class="button button-small" type="submit">Verify license</button></div></form>
      <p id="license-status" class="small" aria-live="polite">Dodo Payments is the online reseller and merchant of record. Use the support link in your Dodo receipt for order questions and returns.</p>
      <button id="download-pack" class="button button-paper" type="button" hidden>Download planning pack</button>
    </div>
  </section>`;
}

function homePage(): string {
  return `${header()}<main id="main">
    <section class="hero shell">
      <div class="hero-copy"><p class="eyebrow">Mealie ↔ Tandoor check</p><h1 tabindex="-1">Check your recipe move before importing</h1><p class="lede">For households moving between Mealie and Tandoor who need a checklist before importing the family library.</p>
        <div class="hero-actions"><a class="button" href="/?demo=1" data-link>Try it with sample data</a><span>See a completed check in one click.</span></div>${facts()}
      </div>
      <div class="hero-visual"><div class="tape" aria-hidden="true"></div><img src="/notebook-migration.98e3f6.webp" width="1280" height="854" alt="A lab notebook compares two recipe cards under a magnifying glass." fetchpriority="high">${terminal(true)}</div>
    </section>
    <section class="preview shell" aria-label="Live product preview">${resultLedger()}</section>
    <section class="how shell" aria-labelledby="how-title"><h2 id="how-title">How to check two recipe libraries</h2><ol>
      <li><span>01</span><div><h3>Export both libraries</h3><p>Make a Mealie or Tandoor export from each server.</p></div></li>
      <li><span>02</span><div><h3>Run one local command</h3><p>Point the checker at the moving and existing folders.</p></div></li>
      <li><span>03</span><div><h3>Review the written checklist</h3><p>Review possible duplicates, images, fields, owners, and family access.</p></div></li>
    </ol></section>
    <section id="install" class="install dark-sheet" aria-labelledby="install-title"><div class="shell install-grid"><div><p class="eyebrow">Run it locally</p><h2 id="install-title">Install the checker</h2><p>Install the free CLI with Cargo.</p></div><div class="code-block"><button type="button" class="copy-command" data-copy="cargo install --git https://github.com/B-Divyesh/sf-recipe-library-move-check">Copy install command</button><code>cargo install --git https://github.com/<wbr>B-Divyesh/<wbr>sf-recipe-library-move-check</code></div></div></section>
    <section class="limits shell" aria-labelledby="limits-title"><div><h2 id="limits-title">What the checker reads and writes</h2></div><div><p>The CLI reads the folders you select. It writes the checklist and JSON inventory paths you name.</p><p>It does not change either export.</p><p>Delete the checklist and inventory to remove its output.</p><a href="/privacy" data-link>Read the privacy details</a></div></section>
    ${paidSection()}
  </main>${footer()}`;
}

function demoPage(): string {
  return `${header()}<div class="demo-banner" role="status"><span><strong>Demo</strong> — sample data, nothing is saved</span><div><button type="button" id="reset-demo">Reset demo</button><a href="/#install" data-link id="start-real">Start for real</a></div></div>
  <main id="main" class="demo-main"><section class="demo-intro shell"><p class="eyebrow">Isolated sample · Mealie to Tandoor</p><h1 tabindex="-1">Review a recipe move with sample data</h1><p>Two moving recipes are checked against two existing recipes. The findings are ready below.</p></section>
  <div class="shell demo-grid">${resultLedger()}${terminal()}</div>
  <section class="sample-files shell" aria-labelledby="files-title"><h2 id="files-title">Files in this sample</h2><div class="folder-pair"><div><h3>Moving from Mealie</h3><ul><li>Lemon Pasta <span>photo found</span></li><li>Red Lentil Soup <span>photo missing</span></li></ul></div><div><h3>Already in Tandoor</h3><ul><li>Lemon Pasta <span>same photo</span></li><li>Sunday Granola <span>no match</span></li></ul></div></div><a class="button" href="/#install" data-link>Check my export folders</a></section>
  </main>${footer()}`;
}

function policyPage(kind: "privacy" | "terms"): string {
  const privacy = kind === "privacy";
  return `${header()}<main id="main" class="policy shell"><p class="eyebrow">Last updated 29 August 2026</p><h1 tabindex="-1">${privacy ? "Privacy in plain words" : "Terms for using this checker"}</h1>
    ${privacy ? `<section><h2>The CLI uses selected folders</h2><p>The checker reads the export folders you choose. It writes the checklist and inventory paths you choose.</p></section><section><h2>The sample does not use your recipes</h2><p>The site demo uses fixed fictional recipes. Demo state uses a separate <code>demo:</code> browser key. Resetting or leaving the demo removes that key.</p></section><section><h2>License checks</h2><p>If you buy the optional planning pack, the site stores your license token and a dated verdict in this browser.</p><p>It sends only that token to Sociobot for verification. Delete the site’s local storage to remove both values.</p></section><section><h2>Site logs</h2><p>The host may keep standard security logs.</p></section>` : `<section><h2>Use it as a check</h2><p>Similarity scores are review hints. They do not prove that two recipes are the same. Keep backups and test a small import first.</p></section><section><h2>Your content remains yours</h2><p>You are responsible for the recipes and images you inspect or move. An image hash is metadata. It does not grant a right to copy an image.</p></section><section><h2>The free checker</h2><p>The CLI, Markdown checklist, and JSON inventory are provided under the MIT License. They come without a warranty.</p></section><section><h2>The $19 planning pack</h2><p>The planning pack is a one-time purchase.</p><p>Dodo Payments is the online reseller and merchant of record. Use the support link in your Dodo receipt for order questions and returns.</p><p>The free checker remains available.</p></section>`}
  </main>${footer()}`;
}

function notFoundPage(): string {
  return `${header()}<main id="main" class="not-found shell"><div class="lost-mark" aria-hidden="true">404</div><p class="eyebrow">Notebook page missing</p><h1 tabindex="-1">This page is not in the checklist</h1><p>The address may be old or mistyped.</p><a class="button" href="/" data-link>Return to the checker</a></main>${footer()}`;
}

function pageFor(path: string): Page {
  if ((path === "/" || path === "") && new URLSearchParams(location.search).get("demo") === "1") return "demo";
  if (path === "/" || path === "") return "home";
  if (path === "/demo") return "demo";
  if (path === "/privacy") return "privacy";
  if (path === "/terms") return "terms";
  return "not-found";
}

function metadata(page: Page): void {
  const meta: Record<Page, [string, string]> = {
    home: ["Recipe Library Move Check — Check before importing", "Check Mealie and Tandoor exports for possible duplicates, missing images, ownership gaps, and fields to review."],
    demo: ["Demo — Recipe Library Move Check", "Review a sample Mealie to Tandoor move with a possible duplicate and a missing-image finding."],
    privacy: ["Privacy — Recipe Library Move Check", "See what the local checker reads, what it writes, and how optional license verification works."],
    terms: ["Terms — Recipe Library Move Check", "Terms for the free recipe move checker and optional household planning pack."],
    "not-found": ["Page not found — Recipe Move Check", "Return to Recipe Library Move Check."],
  };
  const [title, description] = meta[page];
  const canonicalPath = page === "demo" ? "/demo" : page === "not-found" ? "/404" : location.pathname;
  document.title = title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')!.content = description;
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href = `https://recipe-library-move-check.sociobot.in${canonicalPath}`;
  for (const selector of ['meta[property="og:title"]', 'meta[name="twitter:title"]']) document.querySelector<HTMLMetaElement>(selector)!.content = title;
  for (const selector of ['meta[property="og:description"]', 'meta[name="twitter:description"]']) document.querySelector<HTMLMetaElement>(selector)!.content = description;
}

function render(push = false): void {
  const page = pageFor(location.pathname);
  if (page !== "demo") localStorage.removeItem(DEMO_KEY);
  metadata(page);
  app.innerHTML = page === "home" ? homePage() : page === "demo" ? demoPage() : page === "privacy" ? policyPage("privacy") : page === "terms" ? policyPage("terms") : notFoundPage();
  bindActions();
  if (push) {
    const h1 = document.querySelector<HTMLHeadingElement>("h1")!;
    h1.focus();
    status.textContent = `${h1.textContent} page loaded`;
    window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
}

function navigate(href: string): void {
  const url = new URL(href, location.href);
  history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
  render(true);
  if (url.hash) requestAnimationFrame(() => document.querySelector(url.hash)?.scrollIntoView());
}

function bindActions(): void {
  document.querySelectorAll<HTMLAnchorElement>("a[data-link]").forEach((link) => link.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); navigate(link.href);
  }));
  document.querySelectorAll<HTMLButtonElement>(".terminal-replay").forEach((button) => button.addEventListener("click", () => {
    const recording = button.closest(".terminal")!.querySelector<HTMLImageElement>(".terminal-recording")!;
    recording.src = `/terminal-recording.4a32d1.svg?replay=${Date.now()}`;
    button.textContent = "Sample run replayed";
  }));
  document.querySelectorAll<HTMLButtonElement>(".copy-command").forEach((button) => button.addEventListener("click", async () => {
    await navigator.clipboard.writeText(button.dataset.copy!); button.textContent = "Install command copied";
  }));
  document.querySelector<HTMLButtonElement>("#reset-demo")?.addEventListener("click", () => {
    localStorage.setItem(DEMO_KEY, "reset"); render(); status.textContent = "Sample data reset";
  });
  if (pageFor(location.pathname) === "demo") localStorage.setItem(DEMO_KEY, "active");
  bindLicense();
}

function bindLicense(): void {
  const toggle = document.querySelector<HTMLButtonElement>("#restore-toggle");
  const form = document.querySelector<HTMLFormElement>("#license-form");
  toggle?.addEventListener("click", () => { form!.hidden = !form!.hidden; if (!form!.hidden) form!.querySelector<HTMLInputElement>("input")!.focus(); });
  form?.addEventListener("submit", (event) => { event.preventDefault(); const token = new FormData(form).get("license")?.toString().trim(); if (token) { localStorage.setItem(LICENSE_KEY, token); verifyLicense(token, true); } });
  document.querySelector<HTMLButtonElement>("#download-pack")?.addEventListener("click", downloadPack);
  const token = localStorage.getItem(LICENSE_KEY);
  if (token) {
    const cached = parseVerdict();
    if (cached?.valid) showUnlocked();
    else if (cached) showInactiveLicense();
    if (!cached || Date.now() - cached.checked > 86_400_000) verifyLicense(token, false);
  }
}

function parseVerdict(): { valid: boolean; checked: number } | null {
  try { return JSON.parse(localStorage.getItem(VERDICT_KEY) || "null"); } catch { return null; }
}

async function verifyLicense(token: string, announce: boolean): Promise<void> {
  const label = document.querySelector<HTMLElement>("#license-status");
  if (announce && label) label.textContent = "Checking this license…";
  try {
    const response = await fetch(`${API}/products/${SLUG}/verify?license=${encodeURIComponent(token)}`);
    const verdict = await response.json() as { valid: boolean };
    localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: verdict.valid, checked: Date.now() }));
    if (verdict.valid) showUnlocked();
    else showInactiveLicense();
  } catch {
    if (label) label.textContent = "The license check could not connect. The free checker still works.";
  }
}

function showUnlocked(): void {
  const label = document.querySelector<HTMLElement>("#license-status");
  const download = document.querySelector<HTMLButtonElement>("#download-pack");
  if (label) label.textContent = "Planning pack ready on this device.";
  if (download) download.hidden = false;
}

function showInactiveLicense(): void {
  const label = document.querySelector<HTMLElement>("#license-status");
  if (label) label.innerHTML = `This license is no longer active. <a href="${API}/products/${SLUG}/checkout">Buy the planning pack</a>.`;
}

function downloadPack(): void {
  const text = `# Family recipe move plan\n\n## Owners\n\n- [ ] Assign an owner to every recipe\n- [ ] List family members who need access\n- [ ] Confirm private recipes stay private\n\n## Move day\n\n- [ ] Save untouched exports\n- [ ] Resolve possible duplicates\n- [ ] Locate missing images\n- [ ] Import a small test batch\n- [ ] Ask one family member to test access\n\n## Notes\n\n__________________________________________________\n`;
  const url = URL.createObjectURL(new Blob([text], { type: "text/markdown" }));
  const link = document.createElement("a"); link.href = url; link.download = "family-recipe-move-plan.md"; link.click(); URL.revokeObjectURL(url);
}

function acceptLicenseFromUrl(): void {
  const url = new URL(location.href);
  const token = url.searchParams.get("license");
  if (!token) return;
  localStorage.setItem(LICENSE_KEY, token);
  url.searchParams.delete("license");
  history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
}

document.addEventListener("click", (event) => {
  const target = event.target as HTMLElement;
  if (target.matches("button")) target.classList.add("was-pressed");
});
window.addEventListener("popstate", () => render(true));
acceptLicenseFromUrl();
render();
if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js"));
