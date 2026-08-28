import { createHash } from "node:crypto";
import { copyFile, readFile, writeFile } from "node:fs/promises";

const indexUrl = new URL("../dist/site/index.html", import.meta.url);
const outputRoot = new URL("../dist/site/", import.meta.url);
let html = await readFile(indexUrl, "utf8");
const scriptPath = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/)?.[1];
const stylePath = html.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/)?.[1];
if (!scriptPath || !stylePath) throw new Error("Vite output assets were not found in index.html");

const script = await readFile(new URL(scriptPath.slice(1), outputRoot), "utf8");
const style = await readFile(new URL(stylePath.slice(1), outputRoot), "utf8");
html = html
  .replace(`<script type="module" crossorigin src="${scriptPath}"></script>`, `<script type="module">${script.replaceAll("</script>", "<\\/script>")}</script>`)
  .replace(`<link rel="stylesheet" crossorigin href="${stylePath}">`, `<style>${style}</style>`);
await writeFile(indexUrl, html);
await copyFile(indexUrl, new URL("404.html", outputRoot));

const digest = (value) => createHash("sha256").update(value).digest("base64");
const configUrl = new URL("staticwebapp.config.json", outputRoot);
const config = JSON.parse(await readFile(configUrl, "utf8"));
config.globalHeaders["Content-Security-Policy"] = config.globalHeaders["Content-Security-Policy"]
  .replace("script-src 'self'", `script-src 'self' 'sha256-${digest(script)}'`)
  .replace("style-src 'self'", `style-src 'self' 'sha256-${digest(style)}'`);
await writeFile(configUrl, `${JSON.stringify(config, null, 2)}\n`);
