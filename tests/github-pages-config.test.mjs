import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
const nextConfig = await readFile(new URL("../next.config.ts", import.meta.url), "utf8");
const workflow = await readFile(new URL("../.github/workflows/deploy-pages.yml", import.meta.url), "utf8");

test("provides a GitHub Pages static-export build", () => {
  assert.equal(packageJson.scripts["build:pages"], "next build");
  assert.match(nextConfig, /GITHUB_PAGES/);
  assert.match(nextConfig, /output:\s*"export"/);
  assert.match(nextConfig, /basePath/);
});

test("deploys the exported site with the official GitHub Pages actions", () => {
  assert.match(workflow, /npm run build:pages/);
  assert.match(workflow, /actions\/upload-pages-artifact@v5/);
  assert.match(workflow, /actions\/deploy-pages@v5/);
  assert.match(workflow, /pages:\s*write/);
  assert.match(workflow, /id-token:\s*write/);
});
