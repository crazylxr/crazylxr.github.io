import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import katex from "katex";

const require = createRequire(import.meta.url);
const braces = require("braces");

test("KaTeX does not inherit trusted rendering from the options prototype", () => {
  const html = katex.renderToString(
    String.raw`\href{javascript:alert(1)}{click}`,
    Object.create({ trust: true })
  );
  assert.doesNotMatch(html, /href="javascript:/);
});

test("brace patterns still compile and expand normally", () => {
  assert.equal(
    braces.compile("src/{pages,components}/*.{ts,astro}"),
    "src/(pages|components)/*.(ts|astro)"
  );
  assert.deepEqual(braces.expand("a/{b,{c,d}}"), ["a/b", "a/c", "a/d"]);
  const pattern = "{".repeat(100) + "a,b" + "}".repeat(100);
  assert.doesNotThrow(() => braces.compile(pattern));
  assert.doesNotThrow(() => braces.compile("a".repeat(9000)));
  assert.deepEqual(braces.expand(String.raw`\{literal\}/{a,b}`), [
    "{literal}/a",
    "{literal}/b",
  ]);
});

test("deep patterns are rejected before recursive compilation or expansion", () => {
  for (const [open, close] of [
    ["{", "}"],
    ["(", ")"],
    ["{(", ")}"],
  ]) {
    for (const depth of [101, 2000]) {
      const pattern = open.repeat(depth) + "a,b" + close.repeat(depth);
      for (const method of ["parse", "compile", "expand", "stringify"]) {
        assert.throws(() => braces[method](pattern), {
          name: "SyntaxError",
          message: "Pattern nesting exceeds the security limit of 100",
        });
      }
    }
  }
});
