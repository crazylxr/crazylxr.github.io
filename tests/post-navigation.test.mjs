import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('a directly opened post can return to the posts index', async () => {
  const html = await readFile(
    'dist/posts/股票长期回报到底来自哪里从每股价值分红到估值变化/index.html',
    'utf8',
  );

  assert.match(
    html,
    /<a(?=[^>]*href="\/posts")(?=[^>]*class="[^"]*mb-2 mt-8)[^>]*>[\s\S]{0,500}?Go back[\s\S]{0,100}?<\/a>/,
  );
  assert.doesNotMatch(html, /history\.back\(\)/);
});
