import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../out/index.html", import.meta.url), "utf8");

test("prefixes public assets with the GitHub repository path", () => {
  assert.match(html, /\/marine-steel-home-3d\/renders\/kitchen-island\.jpg/);
  assert.match(html, /\/marine-steel-home-3d\/favicon\.svg/);
  assert.doesNotMatch(html, /(?:src|href)="\/(?:renders|favicon\.svg)/);
});
