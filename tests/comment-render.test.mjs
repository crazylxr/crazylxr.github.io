import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

const COMMENT_ENDPOINT =
  "https://taoweng-twikoo-netlify.netlify.app/.netlify/functions/twikoo";

test("built comment script initializes Twikoo through its public API", async () => {
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

test("built about page renders and loads Twikoo comments", async () => {
  const aboutPage = await readFile("dist/about/index.html", "utf8");
  const commentAssetPath = aboutPage.match(
    /<script type="module" src="\/(_astro\/Comments[^"]+\.js)"><\/script>/,
  )?.[1];

  assert.match(aboutPage, /<div id="tcomment"><\/div>/);
  assert.ok(commentAssetPath, "expected the About page to load the comment script");

  const commentScript = await readFile(`dist/${commentAssetPath}`, "utf8");
  assert.equal(commentScript.includes(COMMENT_ENDPOINT), true);
});
