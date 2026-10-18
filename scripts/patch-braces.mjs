import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

// Temporary mitigation for GHSA-vfj7-8cjw-p6xm until braces publishes a fix.
// Limit both brace and parenthesis AST depth before any recursive walker runs.
const root = fileURLToPath(new URL("../", import.meta.url));
const lock = JSON.parse(
  readFileSync(resolve(root, "package-lock.json"), "utf8")
);
const originalHash =
  "e572166565f15fa6ad9865ae49d678218e32aabfd1b3720f6d0d43d39800d310";
const original = "      stack.push(block);";
const patched = [
  "      if (stack.length > 100) {",
  "        throw new SyntaxError('Pattern nesting exceeds the security limit of 100');",
  "      }",
  original,
].join("\n");
const hash = source => createHash("sha256").update(source).digest("hex");

for (const path of Object.keys(lock.packages)) {
  if (!path.endsWith("node_modules/braces")) continue;
  const directory = resolve(root, path);
  if (!existsSync(directory)) continue; // npm ci --omit=dev may omit a copy.
  const manifest = JSON.parse(
    readFileSync(resolve(directory, "package.json"), "utf8")
  );
  if (manifest.version !== "3.0.3") {
    throw new Error(`Review the braces security patch for ${manifest.version}`);
  }
  const file = resolve(directory, "lib/parse.js");
  const source = readFileSync(file, "utf8");
  const unpatched = source.replaceAll(patched, original);
  if (hash(unpatched) !== originalHash) {
    throw new Error(`Unexpected braces source: ${file}`);
  }
  const expected = unpatched.replaceAll(original, patched);
  if (source !== unpatched && source !== expected) {
    throw new Error(`Incomplete braces security patch: ${file}`);
  }
  if (source !== expected) writeFileSync(file, expected);
  console.log(`Applied braces nesting protection: ${path}`);
}
