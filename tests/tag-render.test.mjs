import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("post tags render as separated pill links", async () => {
  const html = await readFile(
    "dist/posts/股票长期回报到底来自哪里从每股价值分红到估值变化/index.html",
    "utf8",
  );

  assert.match(html, /class="tags-container flex flex-wrap gap-2"/);
  assert.match(
    html,
    /href="\/tags\/股票投资"[^>]*class="[^"]*rounded-full[^"]*no-underline[^"]*"/,
  );
  assert.match(html, /<span[^>]*aria-hidden="true"[^>]*>#<\/span>/);
  assert.doesNotMatch(
    html,
    /href="\/tags\/股票投资"[\s\S]{0,300}?<svg/,
  );
});
