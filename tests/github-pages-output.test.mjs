import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");
const detectedRepositoryName = html.match(/(?:src|href)="\/([^/]+)\/(?:_next|renders)\//)?.[1];
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? detectedRepositoryName ?? "marine-steel-home-3d";
const escapedRepositoryName = repositoryName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

test("prefixes public assets with the GitHub repository path", () => {
  assert.match(html, new RegExp(`/${escapedRepositoryName}/renders/kitchen-island\\.jpg`));
  assert.match(html, new RegExp(`/${escapedRepositoryName}/favicon\\.svg`));
  assert.doesNotMatch(html, /(?:src|href)="\/(?:renders|favicon\.svg)/);
});
