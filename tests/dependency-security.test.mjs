import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import katex from "katex";

test("KaTeX does not inherit trusted rendering from the options prototype", () => {
  const html = katex.renderToString(
    String.raw`\href{javascript:alert(1)}{click}`,
    Object.create({ trust: true })
  );
  assert.doesNotMatch(html, /href="javascript:/);
});

test("the dependency graph no longer includes the vulnerable brace toolchain", () => {
  const lock = JSON.parse(
    readFileSync(new URL("../package-lock.json", import.meta.url), "utf8")
  );
  const removed = new Set(["braces", "micromatch", "fast-glob"]);
  const remaining = Object.entries(lock.packages).filter(([path, pkg]) =>
    removed.has(pkg.name ?? path.split("node_modules/").at(-1))
  );
  assert.deepEqual(
    remaining,
    [],
    "Do not reintroduce the old glob dependency chain"
  );
});
