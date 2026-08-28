import { copyFile } from "node:fs/promises";

await copyFile(new URL("../dist/site/index.html", import.meta.url), new URL("../dist/site/404.html", import.meta.url));
