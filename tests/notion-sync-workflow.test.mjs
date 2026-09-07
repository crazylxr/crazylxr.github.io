import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const workflow = readFileSync(
  path.join(root, ".github/workflows/sync-content.yml"),
  "utf8"
);
const checkStep = workflow
  .split("\n      - name:")
  .find(step => step.includes("id: verify-changed-files"));
const checkCommand = checkStep
  .split("        run: |\n")[1]
  .trimEnd()
  .replace(/^ {10}/gm, "");
const articlePath = "src/content/blog/2026/example.md";
const original = "# 示例\n\n正文。\n";

function fixture(t) {
  const directory = mkdtempSync(path.join(tmpdir(), "notion-sync-test-"));
  const repo = path.join(directory, "repo");
  const output = path.join(directory, "github-output");
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  mkdirSync(path.join(repo, "src/content/blog/2026"), { recursive: true });
  symlinkSync(path.join(root, "node_modules"), path.join(repo, "node_modules"));
  for (const file of ["package.json", ".prettierrc", ".prettierignore"]) {
    copyFileSync(path.join(root, file), path.join(repo, file));
  }
  writeFileSync(path.join(repo, articlePath), original);
  writeFileSync(path.join(repo, "README.md"), "Example repository\n");

  function run(command, args) {
    const result = spawnSync(command, args, {
      cwd: repo,
      encoding: "utf8",
      env: { ...process.env, GITHUB_OUTPUT: output },
    });
    assert.equal(result.status, 0, result.stdout + result.stderr);
    return result.stdout;
  }
  run("git", ["init", "--quiet"]);
  run("git", ["config", "user.name", "Notion sync test"]);
  run("git", ["config", "user.email", "notion-sync@example.test"]);
  run("git", ["config", "core.hooksPath", ".git/hooks"]);
  run("git", ["config", "commit.gpgsign", "false"]);
  run("git", ["add", "--", articlePath, "README.md"]);
  run("git", ["commit", "--quiet", "-m", "Initial article"]);
  writeFileSync(
    path.join(repo, ".git/hooks/pre-commit"),
    "#!/bin/sh\n" + readFileSync(path.join(root, ".husky/pre-commit"), "utf8"),
    { mode: 0o755 }
  );

  return {
    repo,
    run,
    write(file, content) {
      writeFileSync(path.join(repo, file), content);
    },
    check() {
      run("bash", [
        "--noprofile",
        "--norc",
        "-eo",
        "pipefail",
        "-c",
        checkCommand,
      ]);
      return readFileSync(output, "utf8").trim();
    },
  };
}

test("Notion sync skips a commit when formatting removes all changes", t => {
  const sync = fixture(t);
  sync.write(articlePath, "# 示例\n\n\n正文。\n");

  assert.equal(sync.check(), "changed=false");
  assert.equal(
    readFileSync(path.join(sync.repo, articlePath), "utf8"),
    original
  );
  assert.equal(sync.run("git", ["diff", "--cached", "--name-only"]), "");
});

test("Notion sync stages and formats a newly created article", t => {
  const sync = fixture(t);
  const newPath = "src/content/blog/2026/new article.md";
  sync.write(newPath, "# 新文章\n\n\n正文。\n");

  assert.equal(sync.check(), "changed=true");
  assert.equal(
    sync.run("git", ["diff", "--cached", "--name-only"]).trim(),
    newPath
  );
  assert.equal(
    sync.run("git", ["show", `:${newPath}`]),
    "# 新文章\n\n正文。\n"
  );
});

test("Notion sync preserves a real content change after formatting", t => {
  const sync = fixture(t);
  sync.write(articlePath, "# 示例\n\n\n更新正文。\n");

  assert.equal(sync.check(), "changed=true");
  assert.equal(
    sync.run("git", ["show", `:${articlePath}`]),
    "# 示例\n\n更新正文。\n"
  );
  sync.run("git", ["commit", "--quiet", "-m", "Sync content update"]);
  assert.equal(sync.run("git", ["rev-list", "--count", "HEAD"]).trim(), "2");
});

test("Notion sync stages an article withdrawal", t => {
  const sync = fixture(t);
  rmSync(path.join(sync.repo, articlePath));

  assert.equal(sync.check(), "changed=true");
  assert.equal(
    sync
      .run("git", ["diff", "--cached", "--name-only", "--diff-filter=D"])
      .trim(),
    articlePath
  );
});

test("Notion sync ignores changes outside blog content", t => {
  const sync = fixture(t);
  sync.write("README.md", "Unrelated change\n");

  assert.equal(sync.check(), "changed=false");
  assert.equal(sync.run("git", ["diff", "--cached", "--name-only"]), "");
});
