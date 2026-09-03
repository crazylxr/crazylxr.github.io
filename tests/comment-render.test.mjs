import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const COMMENT_ENDPOINT =
  "https://taoweng-twikoo-netlify.netlify.app/.netlify/functions/twikoo";

test("built post script initializes Twikoo through its public API", async () => {
  const assetNames = await readdir("dist/_astro");
  const scriptContents = await Promise.all(
    assetNames
      .filter((assetName) => assetName.endsWith(".js"))
      .map((assetName) => readFile(`dist/_astro/${assetName}`, "utf8")),
  );
  const commentScript = scriptContents.find((script) =>
    script.includes(COMMENT_ENDPOINT),
  );

  assert.ok(commentScript, "expected the built Twikoo comment script");
  assert.equal(
    commentScript.includes(".init({envId:"),
    true,
    "expected the built script to call Twikoo's init API",
  );
});
